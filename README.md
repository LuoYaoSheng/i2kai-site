# i2kai-site

i2kai.com 个人官网，基于 Astro 5 构建。

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 部署

仓库已配置 [GitHub Pages 发布工作流](https://github.com/LuoYaoSheng/i2kai-site/actions/workflows/deploy.yml)，定义了 `main` 推送和手动触发。2026-11-25 只读核实，工作流状态为 `disabled_manually`。目前推送到 `main` 不会自动发布。正式发布前须单独恢复工作流并验收构建、部署和线上结果。

## 内容管理

文章和外部视频使用 Astro Content Collections，项目沿用现有档案。录入模板、字段和核对步骤见[内容录入指南](docs/i2kai-redesign/content-guide.md)。

## 本地审阅

经典开发者风格以白色、浅灰分隔和蓝色链接为主。一级导航包括首页、文章、项目、视频和关于。搜索和 RSS 从导航或页脚访问。

```bash
npm ci
npm run build
npm run verify:participation
npm run verify:static
npm run preview -- --host 127.0.0.1 --port 4327
```

静态检查覆盖历史路由、正文、发表日期、原始资源、站内链接、canonical、sitemap 和 RSS。

浏览器验收需要本机的 Playwright CLI 和 Chrome。启动上面的预览服务后，运行 `npm install --prefix /tmp/i2kai-redesign-qa --no-save axe-core` 和 `python3 scripts/browser-review.py`。验收产物保存在本地 `output/`。
