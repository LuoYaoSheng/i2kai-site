---
title: '夜莺变声器与宝宝点滴：双 App 上架发布笔记'
date: 2026-06-11
tags: ['上架', 'Flutter', 'UniApp', 'HUB', '独立开发']
description: '架构收敛后的双栈验收进入发布阶段：夜莺变声器 Android 首发，宝宝点滴微信小程序同步推进。'
author: '罗耀生'
updated: 2026-06-11
---

## 发布概览

经过几个月的架构收敛，HUB 的两枚 **样板 App** 进入发布阶段：

| App | 技术栈 | 首发形态 | 样板意义 |
|-----|--------|----------|----------|
| 夜莺变声器 | Flutter | Android APK | voice + VIP 链路 |
| 宝宝点滴 | UniApp | 微信小程序 | 记录 + 家庭协作 |

前三篇技术连载：

1. [架构收敛总述](/blog/2026-06-09-hub-architecture-two-reference-apps/)
2. [夜莺变声器技术拆解](/blog/2026-06-10-nightingale-voice-changer-reference-app/)
3. [宝宝点滴技术拆解](/blog/2026-06-10-baby-diary-reference-app/)

---

## 夜莺变声器

**定位：** AI 变声与语音包应用，聊天 / 游戏 / 轻创作场景。

**首发下载：**

- 官方 APK：https://nightingalevoicechanger.anxiqing.cn/downloads/nightingalevoicechanger-v1.0.0-official.apk
- 产品页：https://nightingalevoicechanger.anxiqing.cn

**核心能力：** 录音变声、音色试听、语音包、历史收藏、VIP 订阅。

**架构验证点：** Flutter → public-api → voiceexecution-rpc → platform voice → RVC 执行链已在 smoke 门禁中跑通。

App Store / Google Play 渠道仍在筹备，官网会同步更新。

公开进度：[apps.open.i2kai.com/apps/nightingale-voice-changer](https://apps.open.i2kai.com/apps/nightingale-voice-changer)

---

## 宝宝点滴

**定位：** 0–3 岁婴幼儿喂养、作息与成长记录，支持家庭成员协作。

**首发形态：** 微信小程序（UniApp 构建）

**核心能力：** 喂养 / 睡眠 / 体温 / 用药等多类记录，家庭空间、成员邀请、提醒与统计导出。

**正式 API：** `https://api.i2kai.com/app/babydiary/v1`

**架构验证点：** 小程序 → APISIX → public-api → family / record / reminder RPC 全链路；客户端契约已冻结在 `docs/api/app-api.md`。

小程序审核与备案流程推进中，通过后在此文评论区 / 公众号同步二维码。

公开进度：[apps.open.i2kai.com/apps/baby-diary](https://apps.open.i2kai.com/apps/baby-diary)

---

## 这次上架验证了什么

不是「又做了两个 App」，而是验证 **架构修正是否可用**：

1. **APISIX 单入口** — 两个 App 共用同一套公网入口与路由规则
2. **appId 路由** — Flutter 与 UniApp 都走 `/app/{appId}/v1/*`
3. **门面与事实源分离** — public-api 只做 HTTP 门面，领域规则在平台 RPC
4. **双栈复用** — 下一款 App 可以选 Flutter 或 UniApp，而不重写基础设施

架构图：[apps.open.i2kai.com/architecture](https://apps.open.i2kai.com/architecture)

---

## 反馈与愿望池

使用中遇到问题，或想看到哪条链路展开成文，欢迎：

- 公开愿望池：[apps.open.i2kai.com/wishlist](https://apps.open.i2kai.com/wishlist)
- 邮箱：121912336@qq.com

---

## 写在最后

129 → 130 → 131 讲「为什么」和「怎么做」，132 这篇是「可以用了」。

50 Builds 的下一章，从 **两个样板 App 真正落地** 开始。
