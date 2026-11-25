# i2kai-site — CLAUDE.md

## 项目概述
i2kai.com 个人官网，基于 Astro 5 纯静态站点。

## 技术栈
- Astro 5（纯静态输出，零 JS 框架依赖）
- 纯 CSS，白底、浅灰分隔、蓝色链接和本地系统字体
- Content Collections（Markdown 驱动博客/视频内容）
- GitHub Pages 为发布目标。GitHub Actions 已配置 `main` 推送和手动触发，2026-11-25 核实工作流仍为 `disabled_manually`。目前不能依赖推送自动发布，正式发布前须单独恢复工作流并验收。

## 关键路径
- 布局：`src/layouts/BaseLayout.astro`
- 样式：`src/styles/global.css`
- 数据：`src/data/site.ts`、`src/data/projects.ts` 和 `src/data/content.ts`
- 内容 schema：`src/content/config.ts`
- 页面：`src/pages/`
- 组件：`src/components/`

## 设计语言

- 白色背景 `#FFFFFF`，次级背景 `#F6F8FA`，正文 `#1F2328`，辅助文字 `#656D76`，链接 `#0969DA`。
- `#E85D2A` 用于站名标识。首页以时间顺序为主，项目、文章和视频使用各自的列表和阅读布局。
- 项目研发、源码、Release、下载、购买独立呈现。硬件档案记录试配和实物验证。

## 开发命令
- `npm run dev` — 本地开发
- `npm run build` — 构建到 dist/
- `npm run preview` — 预览构建结果

## 域名
- `i2kai.com` 通过 CNAME 文件指向 GitHub Pages
- 子域名 `lightble.i2kai.com`、`cat.i2kai.com` 独立管理
- 开源项目子域名默认走 `*.open.i2kai.com`，例如 `icon.open.i2kai.com`

## 内容规范

参见[内容录入指南](docs/i2kai-redesign/content-guide.md)。文章和视频保留历史路径。视频使用原站封面、原站链接和官方嵌入地址，播放器在访客主动点击后加载。RSS、canonical 和 sitemap 使用 i2kai.com。
