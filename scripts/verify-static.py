"""Check built routes, links, assets, SEO, and preservation of the original content."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, urljoin, unquote
import hashlib
import json
import subprocess
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / 'dist'
baseline = json.loads((ROOT / 'scripts/static-baseline.json').read_text())
errors = []


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.ids, self.refs, self.meta, self.canonical = set(), [], {}, []
        self.h1 = 0
        self.title = False
        self.has_title = False

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if data.get('id'):
            if data['id'] in self.ids:
                errors.append(f'{self.path}: duplicate id {data["id"]}')
            self.ids.add(data['id'])
        if tag == 'h1':
            self.h1 += 1
        if tag == 'title':
            self.title = True
        if tag == 'meta':
            self.meta[data.get('name') or data.get('property')] = data.get('content')
        if tag == 'link' and data.get('rel') == 'canonical':
            self.canonical.append(data.get('href'))
        if tag in ('a', 'link', 'script', 'img', 'iframe'):
            ref = data.get('href') if tag in ('a', 'link') else data.get('src')
            if ref:
                self.refs.append(ref)
            if tag == 'img' and data.get('srcset'):
                self.refs.extend(entry.strip().split()[0] for entry in data['srcset'].split(',') if entry.strip())
            if tag == 'a' and not ref:
                errors.append(f'{self.path}: anchor without href')
        if tag == 'img' and 'alt' not in data:
            errors.append(f'{self.path}: image without alt')
        if tag == 'iframe' and ('undefined' in data.get('src', '') or not data.get('title')):
            errors.append(f'{self.path}: invalid iframe')

    def handle_endtag(self, tag):
        if tag == 'title':
            self.title = False

    def handle_data(self, data):
        if self.title and data.strip():
            self.has_title = True


pages = {}
for path in sorted(DIST.rglob('index.html')):
    route = '/' + str(path.relative_to(DIST)).removesuffix('index.html')
    page = Page(route)
    page.feed(path.read_text())
    pages[route] = page
    if page.h1 != 1 or not page.has_title:
        errors.append(f'{route}: expected one h1 and nonempty title')
    for key in ('description', 'og:title', 'og:description', 'og:image', 'og:url'):
        if not page.meta.get(key):
            errors.append(f'{route}: missing {key}')
    if len(page.canonical) != 1 or page.canonical[0] != 'https://i2kai.com' + route:
        errors.append(f'{route}: incorrect canonical {page.canonical}')

link_count = 0
for route, page in pages.items():
    for ref in page.refs:
        split = urlsplit(urljoin('https://i2kai.com' + route, ref))
        if split.scheme not in ('https', 'http') or split.netloc != 'i2kai.com':
            continue
        link_count += 1
        relative = unquote(split.path).lstrip('/')
        target = DIST / relative
        if target.is_dir():
            target = target / 'index.html'
        if not target.exists():
            errors.append(f'{route}: broken link {ref}')
            continue
        target_route = '/' + str(target.relative_to(DIST)).removesuffix('index.html')
        if split.fragment and target_route in pages and unquote(split.fragment) not in pages[target_route].ids:
            errors.append(f'{route}: missing anchor {ref}')

for route in baseline['routes']:
    if route not in pages:
        errors.append(f'lost original route {route}')
old_project_routes = {route for route in baseline['routes'] if route.startswith('/showcase/') and route != '/showcase/'}
new_project_routes = {
    f'/showcase/{slug}/' for slug in ('queue-caller', 'modular-ai-robot-kit', 'esp32-c3-weather-station')
}
previous_routes = set(baseline['routes']) | new_project_routes | {'/series/'} | {
    f'/series/{slug}/' for slug in ('dorm-upgrade', 'fun-builds', 'open-experiments')
}
for route in sorted(previous_routes - set(pages)):
    errors.append(f'lost previous redesign route {route}')
project_routes = {route for route in pages if route.startswith('/showcase/') and route != '/showcase/'}
if project_routes != old_project_routes | new_project_routes:
    errors.append(f'unexpected project paths: {sorted(project_routes ^ (old_project_routes | new_project_routes))}')
for name, digest in baseline['assets'].items():
    for file in (ROOT / name, DIST / name.removeprefix('public/')):
        if not file.is_file() or hashlib.sha256(file.read_bytes()).hexdigest() != digest:
            errors.append(f'missing or changed original asset {file.relative_to(ROOT)}')

# These two historical bodies have narrowly scoped corrections for retired BLE entry points.
corrected_bodies = {
    'blog/2026-04-15-hello-world.md': '4e275de1616e32fabd71e4a77ea586f498aea315aa9d7d8ec2512b4f20160fca',
    'videos/2026-04-15-smart-ble-intro.md': '5742b5e777f70245ca533573a98b0ef7e892f8247f8339bd8a8e982d5f41b2b6',
}
historical_bodies_preserved = 0
corrected_bodies_verified = []
historical_dates_preserved = 0
for group, key in [('blog', 'blogFiles'), ('videos', 'videoFiles')]:
    for name in baseline[key]:
        file = ROOT / 'src/content' / group / name
        old = subprocess.check_output(['git', 'show', f'{baseline["baseCommit"]}:src/content/{group}/{name}'], cwd=ROOT, text=True)
        new = file.read_text()
        relative_path = f'{group}/{name}'
        corrected_digest = corrected_bodies.get(relative_path)
        new_body = new.split('---', 2)[-1]
        if corrected_digest:
            if hashlib.sha256(new_body.encode()).hexdigest() != corrected_digest:
                errors.append(f'unexpected changes to corrected historical body {relative_path}')
            else:
                corrected_bodies_verified.append(relative_path)
        elif old.split('---', 2)[-1] != new_body:
            errors.append(f'changed historical body {name}')
        else:
            historical_bodies_preserved += 1
        old_date = [x for x in old.splitlines() if x.startswith('date:')]
        new_date = [x for x in new.splitlines() if x.startswith('date:')]
        if old_date != new_date:
            errors.append(f'changed publication date {name}')
        else:
            historical_dates_preserved += 1

if set(corrected_bodies_verified) != set(corrected_bodies):
    errors.append('expected corrections were not verified')

for name in ('astro.config.mjs', '.github/workflows/deploy.yml', 'package-lock.json'):
    old = subprocess.check_output(['git', 'show', f'{baseline["baseCommit"]}:{name}'], cwd=ROOT)
    if old != (ROOT / name).read_bytes():
        errors.append(f'changed protected configuration {name}')

ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
sitemap_routes = set()
for file in DIST.glob('sitemap-*.xml'):
    tree = ET.parse(file)
    locations = [urlsplit(item.text) for item in tree.findall('.//s:loc', ns)]
    if any(loc.scheme != 'https' or loc.netloc != 'i2kai.com' for loc in locations):
        errors.append(f'incorrect sitemap domain in {file.name}')
    if tree.getroot().tag.endswith('urlset'):
        sitemap_routes.update(loc.path for loc in locations)
for route in pages:
    if route not in sitemap_routes:
        errors.append(f'missing sitemap route {route}')
if 'Sitemap: https://i2kai.com/sitemap-index.xml' not in (DIST / 'robots.txt').read_text():
    errors.append('missing robots sitemap')

rss = ET.parse(DIST / 'rss.xml').getroot()
rss_items = rss.findall('./channel/item')
rss_links = [urlsplit(item.findtext('link')) for item in rss_items]
rss_guids = {item.findtext('guid') for item in rss_items}
if len(rss_guids) != len(rss_items) or not rss_items or any(
    loc.scheme != 'https' or loc.netloc != 'i2kai.com' or loc.path not in pages for loc in rss_links
):
    errors.append('invalid RSS item links or GUIDs')
if any(not all(item.findtext(key) for key in ('guid', 'title', 'pubDate', 'description', 'category')) for item in rss_items):
    errors.append('missing RSS item metadata')

result = {
    'pages': len(pages), 'oldRoutesPreserved': len(set(baseline['routes']) & set(pages)),
    'previousPagesPreserved': len(previous_routes & set(pages)), 'rssEntries': len(rss_items),
    'projectPages': len(project_routes), 'oldProjectPagesPreserved': len(old_project_routes & project_routes),
    'localLinksAndResources': link_count, 'originalAssetsPreserved': len(baseline['assets']),
    'historicalBodiesPreserved': historical_bodies_preserved,
    'correctedHistoricalBodies': corrected_bodies_verified,
    'historicalDatesPreserved': historical_dates_preserved, 'errors': errors,
}
output = ROOT / 'output/round3'
output.mkdir(parents=True, exist_ok=True)
(output / 'static-check.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(result, ensure_ascii=False, indent=2))
raise SystemExit(bool(errors))
