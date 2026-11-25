"""Run browser QA against the local preview and store screenshots and results."""
from pathlib import Path
import json
import os
import subprocess

root = Path(__file__).resolve().parent.parent
cli = Path.home() / '.codex/skills/playwright/scripts/playwright_cli.sh'
output = root / 'output/round3/playwright'
output.mkdir(parents=True, exist_ok=True)
session = [str(cli), f'-s=i2kai-round3-{os.getpid()}']
opened = subprocess.run(
    [*session, 'open', 'http://127.0.0.1:4327/', '--browser', 'chrome'],
    cwd=root, capture_output=True, text=True,
)
if opened.returncode:
    print(opened.stdout, opened.stderr)
    raise SystemExit(1)
try:
    result = subprocess.run(
        [*session, 'run-code', (root / 'scripts/browser-review.js').read_text()],
        cwd=root, capture_output=True, text=True,
    )
finally:
    subprocess.run([*session, 'close'], cwd=root, capture_output=True)

(output / 'browser-review.log').write_text(result.stdout + result.stderr)
if result.returncode or '### Result\n' not in result.stdout:
    print(result.stdout[-5000:], result.stderr)
    raise SystemExit(1)

report = json.loads(result.stdout.split('### Result\n', 1)[1].split('\n### ', 1)[0])
(output / 'browser-check.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
failures = [check for check in report['checks'] if not check['passed']]
violations = [item for item in report['accessibility'] if item['violations']]
print(json.dumps({
    'layoutCases': len(report['layouts']),
    'interactionChecks': len(report['checks']),
    'accessibilityRuns': len(report['accessibility']),
    'failedChecks': failures,
    'accessibilityViolations': violations,
    'issues': report['issues'],
}, ensure_ascii=False, indent=2))
raise SystemExit(bool(failures or violations or report['issues']))
