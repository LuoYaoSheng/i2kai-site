# i2kai 内容录入

网站使用 Astro 5 静态构建。文章和视频从 Markdown 集合读取，项目档案沿用已有数据。新增内容后执行 `npm run build` 与 `npm run verify:static`，再用 `npm run preview -- --host 127.0.0.1 --port 4327` 查看结果。

## 分享外部视频

在 `src/content/videos/` 新建 Markdown。文件名形成新视频的 URL，发布后保留文件名与路径。可从 [Flutter LayoutBuilder 条目](../../src/content/videos/flutter-layoutbuilder.md)复制一份作为模板，再替换条目资料与正文。

| 字段 | 填写方式 |
| --- | --- |
| `kind` | 新增外部分享填写 `share`。历史视频笔记继续使用原字段和 URL。 |
| `title`, `originalAuthor`, `originalDate` | 原站视频标题、上传作者或机构、原始发表日期。录入前核对视频页面或官方元数据。 |
| `date` | i2kai 的实际分享日期，决定首页、视频列表和 RSS 的排列顺序。 |
| `description`, `recommendation` | 简介与推荐理由。Markdown 正文用于记录带有上下文的观看笔记。 |
| `category`, `tags` | 分类可选软件开发、硬件电子、AI、IoT、开源项目、DIY、技术演讲。标签可填项目名、工具或技术主题。 |
| `source` | Bilibili 填 `platform: bilibili` 和 BV 号 `id`，YouTube 填 `platform: youtube` 和 11 位视频 `id`。其他平台填 `platform: external`、站名 `name` 和 HTTPS 原站地址 `url`。 |
| `source.embed` | 使用 Bilibili 或 YouTube 官方分享的嵌入方式且确认可用后填 `true`。默认只显示原站入口，其他平台走同一原站观看路径。 |
| `cover` | 填原平台提供的 HTTPS 封面 URL。浏览器延迟加载，远程图片失效时显示文本提示。 |
| `featured`, `draft` | 两者均可省略，默认为 `false`。精选条目同时保留在最近分享中，草稿不进入构建。 |
| `projectIds`, `articleIds` | 可关联多个项目和文章。项目用 `projectShowcaseCases` 的 `slug`，文章用 `/blog/` 后的 slug，均省略斜线和扩展名。 |

录入时在原站确认分享和嵌入权限。Bilibili 封面可从官方视频元数据获取，YouTube 可通过官方 oEmbed 核对作者及封面。播放器在站内点击后创建，原站入口始终可访问。正文标清原作者，用本站自己的文字描述推荐理由与观看笔记。

页面从相关视频反向显示文章和项目关联。已有 `projectId` 字段继续有效，新增关系可统一填 `projectIds`。原蓝析视频笔记继续使用 `/videos/2026-04-15-smart-ble-intro.md/`。

## 写文章或实践记录

在 `src/content/blog/` 增加 Markdown，填写 `title`、原始 `date`、`description`、`category` 和 `tags`。后续修订填写 `updated`，保留原发表日期。用 `kind: practice` 或 `kind: experiment` 标记实践、实验记录。普通技术文章的默认类型为 `article`。正文用二、三级标题组织，目录自动提取。代码围栏标注语言，图片附替代文字。

## 维护项目档案

基础档案在 `src/data/site.ts` 的 `projectShowcaseCases`。项目类型、研发阶段、版本和下载入口在 `src/data/projects.ts`。分别核对公开仓库、许可、正式发布、下载资产和购买渠道。已有 GitHub Release 的项目填公开版本和链接，实际下载另外指向发行资产。可在 `projectUpdates` 增加有日期和依据的项目进展记录，首页和 RSS 自动纳入。

硬件档案可通过 `fabricationNotes` 记录结构设计、用途和实物验证。模型获公开授权后，用 `model.url` 和 `model.label` 填入对应可下载文件。装配图、PCB、BOM、实拍和试配记录可在项目的资料与图库中按实际情况补充。下载入口和实物验证按各自证据更新。研发和客户资料通过公开权限核对后再录入。

## 构建检查

```sh
npm run build
npm run verify:static
npm run verify:participation
```

确认草稿未出现，所有内容关联都能打开，视频列显示作者和原站，禁用 JavaScript 时仍能前往原站。canonical、sitemap 和 RSS 都以 `https://i2kai.com` 为准。
