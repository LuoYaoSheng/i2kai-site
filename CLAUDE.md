# i2kai-site — CLAUDE.md

## 项目概述
i2kai.com 个人官网，基于 Astro 5 纯静态站点。

## 技术栈
- Astro 5（纯静态输出，零 JS 框架依赖）
- 纯 CSS（暖色系，Instrument Serif + IBM Plex 字体族）
- Content Collections（Markdown 驱动博客/视频内容）
- GitHub Pages + GitHub Actions 自动部署

## 关键路径
- 布局：`src/layouts/BaseLayout.astro`
- 样式：`src/styles/global.css`
- 数据：`src/data/site.ts`
- 内容 schema：`src/content/config.ts`
- 页面：`src/pages/`
- 组件：`src/components/`

## 设计语言
- 暖色系：米色背景 `#f3ecde`，深棕文字 `#16120f`，赤陶强调 `#9f2f16`
- 字体：Instrument Serif（标题）、IBM Plex Sans（正文）、IBM Plex Mono（代码）
- 卡片风格：圆角 + 半透明面板 + 柔和阴影

## 开发命令
- `npm run dev` — 本地开发
- `npm run build` — 构建到 dist/
- `npm run preview` — 预览构建结果

## 域名
- `i2kai.com` 通过 CNAME 文件指向 GitHub Pages
- 子域名 `lightble.i2kai.com`、`cat.i2kai.com` 独立管理
- 开源项目子域名默认走 `*.open.i2kai.com`，例如 `icon.open.i2kai.com`

## 内容规范
- 博客文章存放 `src/content/blog/`（Markdown，frontmatter 含 title/date/tags/description）
- 视频笔记存放 `src/content/videos/`（Markdown，frontmatter 含 title/date/platform/bvid 或 videoId/duration/tags）
- 视频不存本地文件，通过 Bilibili/YouTube iframe 嵌入
