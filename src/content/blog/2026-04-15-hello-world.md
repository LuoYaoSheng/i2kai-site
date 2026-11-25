---
category: 开源项目分析
kind: article
title: 关于开篇——为什么我要公开做开源
date: 2026-04-15
description: 个人介绍、做开源的动机，以及这套 BLE + IoT + 桌面工具项目全景介绍。
tags: ['开源', '随想']
author: LuoYaoSheng
projectId: smart-ble
seriesIds: ['open-experiments']
hasUpdateNotice: true
---

> **更新说明 · 2026-11-25**
>
> 蓝析 BLE 工具箱的微信小程序目标（BLE Toolkit+）已于 2026-09-11 退役。当前为开发预览，请查看[蓝析产品站](https://lightble.i2kai.com)的构建指引，或访问 [GitHub 源码](https://github.com/LuoYaoSheng/smart-ble)和 [Gitee 镜像](https://gitee.com/luoyaosheng/lys-smart-ble)。

## 你好，我是 i2kai

一名独立开发者，日常工作就是围绕 BLE、IoT 和桌面工具构建开源项目。

这个博客是我公开做开源的记录窗口。在这里，我会分享项目背后的思考、技术选型的原因、踩过的坑，以及那些「先跑起来再说」的真实经历。

## 为什么公开做开源

做开源的初衷很简单——我学 BLE 和 IoT 的时候，发现真正能跑起来、能体验的完整项目很少。大多数仓库要么只有代码没有文档，要么文档写得像教科书而不是"上手指南"。

所以我决定把自己做的东西公开出来：

1. **先让人能体验**：提供清楚的预览、运行或构建指引，具体方式以各项目当前状态为准
2. **再帮人理解**：配上真实的学习路径和文档，不是 API 列表而是"为什么这样做"
3. **最后才看源码**：当你知道问题是什么、目标是什么，再读源码会高效得多

## 项目全景

目前我在维护的开源项目主要分三个方向：

### 核心主线

- **蓝析 BLE 工具箱（Smart BLE）** — 通用 BLE 调试工具，适合学习 BLE 协议和比较 iOS、Android、Flutter 的实现差异。当前为开发预览，各平台能力和构建方式见产品文档。
- **Open IoT Platform** — 从设备接入、BLE 配网到 MQTT 控制的完整 IoT 平台。ESP32 固件 + Go 服务端 + Flutter APP，一条链路串起硬件、后端和移动端。

### 支撑工具

- **RedisPilot** — 本地优先的 Redis 桌面管理工具
- **QueryLab** — 本地优先的数据库客户端
- **TermForge** — SSH / SFTP / Runbook 运维工作台

这些工具基于 Tauri 构建，体积极小、启动极快。它们不只是工具本身，也是"独立开发者如何从零构建一个完整产品"的实践样本。

### 创作与效率

- **PaperMD** — macOS Markdown 编辑器
- **Batch Image Studio** — 图片批量处理工具
- **CodexSwitch** — 跨平台配置切换工具

## 接下来

这个博客会持续更新，内容包括：

- 项目开发过程中的思考和决策
- BLE / IoT / 桌面工具的技术文章
- 开源维护的真实体验
- 偶尔的随想和总结

如果你对这些内容感兴趣，欢迎关注。如果有任何问题，随时通过 [GitHub](https://github.com/LuoYaoSheng) 或邮件联系我。

---

*这是本站的第一篇博客，写于 2026 年 4 月 15 日。*
