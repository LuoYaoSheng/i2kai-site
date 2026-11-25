async (page) => {
  const root = 'http://127.0.0.1:4327';
  const axePath = '/tmp/i2kai-redesign-qa/node_modules/axe-core/axe.min.js';
  const checks = [];
  const layouts = [];
  const accessibility = [];
  const performance = [];
  const providers = [];
  const issues = [];
  const viewports = [
    { width: 375, height: 812 }, { width: 390, height: 844 },
    { width: 768, height: 1024 }, { width: 1440, height: 1000 },
  ];
  const pages = [
    ['/', 'home'], ['/blog/', 'articles'], ['/projects/', 'projects'],
    ['/videos/', 'videos'], ['/about/', 'about'],
    ['/blog/2026-06-10-baby-diary-reference-app/', 'article-detail'],
    ['/showcase/smart-ble/', 'software-detail'],
    ['/showcase/queue-caller/', 'hardware-detail'],
    ['/showcase/open-iot-platform/', 'iot-detail'],
    ['/videos/esp32-c3-s3-espressif/', 'bilibili-detail'],
    ['/videos/flutter-layoutbuilder/', 'youtube-detail'],
    ['/videos/2026-04-15-smart-ble-intro.md/', 'legacy-video-note'],
    ['/showcase/', 'project-archive'], ['/series/fun-builds/', 'legacy-series'],
    ['/contact/', 'contact'], ['/search/', 'search'],
  ];
  const add = (name, passed, evidence) => checks.push({ name, passed, ...(evidence === undefined ? {} : { evidence }) });
  page.on('pageerror', error => issues.push(error.stack));
  page.on('response', response => {
    if (new URL(response.url()).origin === root && response.status() >= 400) issues.push(`HTTP ${response.status()} ${response.url()}`);
  });
  await page.addInitScript(() => {
    window.reviewVitals = { lcp: 0, cls: 0 };
    new PerformanceObserver((list) => {
      window.reviewVitals.lcp = list.getEntries().at(-1).startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      window.reviewVitals.cls += list.getEntries().filter(entry => !entry.hadRecentInput).reduce((sum, entry) => sum + entry.value, 0);
    }).observe({ type: 'layout-shift', buffered: true });
  });

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    for (const [path, name] of pages) {
      const response = await page.goto(root + path, { waitUntil: 'domcontentloaded' });
      await page.locator('#main-content h1').waitFor();
      if (name === 'home' || name === 'videos' || name.endsWith('detail')) {
        await page.evaluate(async () => {
          const images = [...document.images].filter(image => image.getBoundingClientRect().top < innerHeight);
          await Promise.race([Promise.all(images.map(image => image.decode().catch(() => {}))), new Promise(resolve => setTimeout(resolve, 3500))]);
        });
      }
      const layout = await page.evaluate(() => {
        const rect = (element) => element.getBoundingClientRect();
        const width = document.documentElement.clientWidth;
        return {
          width,
          overflow: document.documentElement.scrollWidth - width,
          outsideNav: [...document.querySelectorAll('.site-nav a')].filter(link => rect(link).left < 0 || rect(link).right > width).length,
          navLinks: [...document.querySelectorAll('.site-nav a')].map(link => link.textContent),
          badLocalImages: [...document.images].filter(image => new URL(image.src).origin === location.origin && image.complete && !image.naturalWidth).map(image => image.src),
        };
      });
      layouts.push({ name, viewport: viewport.width, status: response.status(), ...layout });
      if (layout.overflow > 1 || layout.outsideNav || layout.badLocalImages.length || response.status() !== 200) issues.push({ name, viewport: viewport.width, ...layout });
      if (viewport.width === 390 || viewport.width === 1440) {
        await page.addScriptTag({ path: axePath });
        const violations = await page.evaluate(async () => (await axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
        })).violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })));
        accessibility.push({ name, viewport: viewport.width, violations });
      }
      if (name === 'home' || name === 'videos' || name === 'article-detail') {
        const measures = await page.evaluate(() => {
          const page = performance.getEntriesByType('navigation')[0];
          const local = performance.getEntriesByType('resource').filter(item => new URL(item.name).origin === location.origin);
          return {
            htmlBytes: page.encodedBodySize, localBytes: local.reduce((sum, item) => sum + item.encodedBodySize, 0),
            requestCount: local.length, fontRequests: performance.getEntriesByType('resource').filter(item => item.initiatorType === 'css' && /\.woff2?(\?|$)/.test(item.name)).length,
            lcpMs: Math.round(window.reviewVitals.lcp), cls: Number(window.reviewVitals.cls.toFixed(3)),
            dclMs: Math.round(page.domContentLoadedEventEnd), frames: document.querySelectorAll('iframe').length,
          };
        });
        performance.push({ name, viewport: viewport.width, ...measures });
      }
      const fullPage = name !== 'article-detail';
      if (fullPage) await page.evaluate(async () => {
        await Promise.race([Promise.all([...document.images].map(image => {
          image.loading = 'eager';
          return image.decode().catch(() => {});
        })), new Promise(resolve => setTimeout(resolve, 2200))]);
      });
      await page.screenshot({ path: `output/round3/playwright/${name}-${viewport.width}.png`, fullPage });
    }
  }

  await page.setViewportSize(viewports[1]);
  await page.goto(root + '/');
  await page.keyboard.press('Tab');
  add('skip link is first keyboard stop', await page.locator('.skip-link').evaluate(el => document.activeElement === el));
  await page.keyboard.press('Enter');
  add('skip link lands on main', await page.locator('main').evaluate(el => document.activeElement === el));
  const visibleNav = await page.getByRole('navigation', { name: '主导航' }).getByRole('link').allTextContents();
  add('home greeting matches requested name', await page.getByRole('heading', { level: 1 }).textContent() === '你好，我是老罗。');
  add('five primary routes', visibleNav.join(',') === '首页,文章,项目,视频,关于', visibleNav);
  const feedDates = await page.locator('.update-list').first().locator('time').evaluateAll(els => els.map(el => el.dateTime));
  add('home feed is reverse chronological', feedDates.join('|') === [...feedDates].sort().reverse().join('|'));
  const mixedTypes = await page.locator('.update-list').first().innerText();
  add('home offers a featured article and mixed chronological updates',
    ['视频分享', '项目更新', '实验记录', '实践记录'].every(type => mixedTypes.includes(type))
    && await page.locator('.feature-story[href="/blog/2026-04-12-batch-image-studio/"]').count() === 1);
  add('home figure loads with intrinsic dimensions', await page.locator('.home-figure img').evaluate(img => img.naturalWidth > 0 && img.width > 0 && img.hasAttribute('height')));

  await page.goto(root + '/videos/');
  const videoSection = page.getByRole('region', { name: '最近分享' });
  const search = videoSection.getByRole('searchbox');
  await search.focus();
  await page.keyboard.type('flutter');
  add('video search accepts keyboard input and finds one item', await videoSection.locator('[data-filter-row]:visible').count() === 1);
  await search.fill('Google for Developers');
  add('video search matches original author', await videoSection.getByRole('link', { name: /LayoutBuilder/ }).count() === 1);
  await videoSection.getByLabel('分类').selectOption('硬件电子');
  add('video categories combine with search', await videoSection.getByText('没有匹配的内容。').isVisible());
  await videoSection.getByRole('button', { name: '清除筛选' }).press('Enter');
  add('filter reset restores both videos and keyboard focus', await videoSection.locator('[data-filter-row]:visible').count() === 2 && await search.evaluate(el => document.activeElement === el));
  await videoSection.getByLabel('分类').selectOption('硬件电子');
  add('video category isolates hardware item', await videoSection.locator('[data-filter-row]:visible').count() === 1);
  await videoSection.getByLabel('分类').selectOption('');
  const covers = await videoSection.locator('img').evaluateAll(async elements => Promise.all(elements.map(async img => {
    img.loading = 'eager';
    try { await img.decode(); } catch {}
    return { url: img.currentSrc || img.src, width: img.naturalWidth, height: img.naturalHeight };
  })));
  add('original Bilibili and YouTube thumbnails load', covers.length === 2 && covers.every(cover => cover.width > 0 && cover.height > 0), covers);

  await page.goto(root + '/projects/');
  await page.getByLabel('项目类型').selectOption('Hardware');
  add('project filtering shows alternate hardware category', await page.locator('#project-results [data-filter-row]:visible').count() === 3);
  await page.getByRole('searchbox').fill('weather');
  add('project search combines with category', await page.locator('#project-results [data-filter-row]:visible').count() === 1 && await page.locator('#project-results a[href="/showcase/esp32-c3-weather-station/"]').isVisible());

  await page.goto(root + '/blog/');
  await page.getByLabel('分类').selectOption('技术教程');
  add('articles filter by category', await page.locator('#article-results [data-filter-row]:visible').count() === 2);
  await page.goto(root + '/blog/2026-06-10-baby-diary-reference-app/');
  const summary = page.locator('.table-of-contents summary');
  await summary.press('Enter');
  const toc = page.getByRole('navigation', { name: '文章目录' });
  const heading = toc.getByRole('link').first();
  await heading.press('Enter');
  add('keyboard opens TOC and navigates to the heading', await page.evaluate(() => Boolean(document.getElementById(decodeURIComponent(location.hash.slice(1))))));
  add('article dates, syntax highlighting and related links', await page.locator('.publication-meta time').count() === 2 && await page.locator('pre.astro-code span[style]').count() > 0 && await page.getByRole('navigation', { name: '相邻文章' }).getByRole('link').count() === 2);
  const scrollRegions = await page.locator('.prose-table-scroll, .prose pre').evaluateAll(els => els.filter(el => el.scrollWidth > el.clientWidth).map(el => [el.tabIndex, el.getAttribute('aria-label')]));
  add('overflowing tables and code are keyboard focusable', scrollRegions.length > 0 && scrollRegions.every(([tab, label]) => tab === 0 && label));

  await page.goto(root + '/showcase/queue-caller/');
  const fabrication = page.getByRole('heading', { name: '3D 设计与试配' });
  add('hardware indicates 3D use and verification separately', await fabrication.isVisible() && await page.getByText('暂无已公开的模型文件。').isVisible() && await page.getByText('设计用途', { exact: true }).isVisible());
  await page.goto(root + '/showcase/open-iot-platform/');
  add('IoT Release and downloadable asset are distinct', await page.getByRole('link', { name: 'v0.3.0' }).isVisible() && await page.getByRole('link', { name: '查看发布文件' }).isVisible());
  add('legacy QR keeps pending verification label', await page.getByText('SmartLink 配网二维码（待核实）', { exact: true }).isVisible());
  await page.goto(root + '/showcase/smart-ble/');
  add('BLE retains retirement, preview, and current sources', await page.locator('.project-narrative .case-notice').getByText('2026-09-11 退役', { exact: false }).isVisible() && await page.getByRole('link', { name: 'GitHub 源码', exact: false }).isVisible() && await page.getByText('暂无已确认的下载入口').isVisible());
  add('retired BLE QR is absent from public UI', await page.locator('img[src="/projects/smart-ble/qr-code.jpg"]').count() === 0);

  await page.goto(root + '/videos/2026-04-15-smart-ble-intro.md/');
  add('legacy note retains the original URL and no invalid player', await page.locator('iframe').count() === 0 && await page.getByText('视频链接待补。').isVisible() && await page.locator('.prose blockquote').first().isVisible());

  await page.goto(root + '/about/');
  add('about restores original identity and biography', await page.getByRole('heading', { name: '关于老罗', exact: true }).isVisible()
    && await page.getByText('物联网架构专家 / 全栈开发者', { exact: true }).isVisible()
    && await page.getByText(/^12年\+/).isVisible());

  const entries = [
    { name: 'Bilibili', path: '/videos/esp32-c3-s3-espressif/', player: 'https://player.bilibili.com/player.html?bvid=BV1m5411P7yq&page=1&autoplay=0', watch: 'https://www.bilibili.com/video/BV1m5411P7yq/' },
    { name: 'YouTube', path: '/videos/flutter-layoutbuilder/', player: 'https://www.youtube-nocookie.com/embed/IYDVcriKjsw', watch: 'https://www.youtube.com/watch?v=IYDVcriKjsw' },
  ];
  for (const entry of entries) {
    const initialPlayerRequests = [];
    const recordRequest = request => {
      if (request.url().startsWith(entry.player.split('?')[0])) initialPlayerRequests.push(request.url());
    };
    page.on('request', recordRequest);
    await page.goto(root + entry.path);
    await page.waitForLoadState('load');
    page.off('request', recordRequest);
    add(`${entry.name} makes no player request before activation`, initialPlayerRequests.length === 0 && await page.locator('iframe').count() === 0);
    const original = page.getByRole('link', { name: `在 ${entry.name} 原站观看` });
    add(`${entry.name} attribution and original watch link`, await original.getAttribute('href') === entry.watch && await page.getByText(/^原作者 /).isVisible());
    add(`${entry.name} has multiple project associations`, await page.getByRole('navigation', { name: '关联项目与系列' }).getByRole('link').count() >= 2);
    const playerResponse = page.waitForResponse(response => response.url() === entry.player, { timeout: 10000 }).catch(() => null);
    await page.getByRole('button', { name: `加载 ${entry.name} 播放器` }).press('Enter');
    const frame = page.locator('.video-player iframe');
    add(`${entry.name} replaces cover with official titled iframe on Enter`,
      await frame.getAttribute('src') === entry.player && (await frame.getAttribute('title')).includes(entry.name) && await original.isVisible());
    const response = await playerResponse;
    const frameHandle = await frame.elementHandle();
    const embedded = await frameHandle.contentFrame();
    if (embedded) await embedded.waitForLoadState('domcontentloaded', { timeout: 6500 }).catch(() => {});
    const sample = embedded ? await embedded.evaluate(() => ({
      address: location.href,
      title: document.title,
      htmlVideo: document.querySelectorAll('video').length,
      playerText: (document.body?.innerText || '').trim().slice(0, 400),
    })).catch(() => null) : null;
    providers.push({ name: entry.name, embedHttp: response?.status(), sample, watch: entry.watch });

    await page.route(entry.player, route => route.abort());
    await page.goto(root + entry.path);
    await page.getByRole('button', { name: `加载 ${entry.name} 播放器` }).click();
    add(`${entry.name} retains source link when embedding fails`, await original.isVisible());
    await page.unroute(entry.player);

    await page.route(entry.watch, async route => route.fulfill({ body: 'Watch navigation verified' }));
    await original.press('Enter');
    add(`${entry.name} watch link navigates to the exact source`, page.url() === entry.watch);
    await page.unroute(entry.watch);
  }

  const noJs = await page.context().browser().newContext({ javaScriptEnabled: false, viewport: viewports[0] });
  try {
    const fallback = await noJs.newPage();
    await fallback.goto(root + '/videos/flutter-layoutbuilder/', { waitUntil: 'domcontentloaded' });
    add('no JS retains navigation and original watch link',
      await fallback.getByRole('navigation', { name: '主导航' }).getByRole('link').count() === 5
      && await fallback.getByRole('link', { name: '在 YouTube 原站观看' }).isVisible()
      && await fallback.locator('iframe').count() === 0);
  } finally {
    await noJs.close();
  }
  return { checks, layouts, accessibility, performance, providers, issues };
}
