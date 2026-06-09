---
title: '双 App 上架笔记：APK 已出、小程序在审，smoke 清单对照表'
date: 2026-06-11
tags: ['上架', 'Flutter', 'UniApp', 'HUB', '独立开发']
description: '夜莺 Android v1.0.0 官方包 URL、宝宝点滴审核卡点、两条 smoke 清单、仍标 testing 的原因——可操作的发布台账。'
author: '罗耀生'
updated: 2026-06-11
---

## 这篇是什么

不是「即将震撼发布」的软文，是 **发布台账**：现在能下载什么、什么还在审、上线前最后一遍跑哪些 make 目标。

技术拆解见 [129 总述](/blog/2026-06-09-hub-architecture-two-reference-apps/) · [130 夜莺](/blog/2026-06-10-nightingale-voice-changer-reference-app/) · [131 宝宝点滴](/blog/2026-06-10-baby-diary-reference-app/)

---

## 进度站数字（2026-06-11）

来源：[apps.open.i2kai.com](https://apps.open.i2kai.com)

| App | 状态 | 进度 | 备注 |
|-----|------|------|------|
| 夜莺变声器 | **testing** | 90% | Android 官方包已 published |
| 宝宝点滴 | **testing** | 80% | 微信小程序审核中 |

**故意没标 released**：商店/审核没完全走完前，进度站保持 testing，避免「文章发了但用户下不到」。

---

## 夜莺变声器：现在能拿到什么

### 已发布

| 项 | 值 |
|----|-----|
| 版本 | **1.0.0**（versionCode 1） |
| 包名 | `luck.good.any.nightingalevoicechanger` |
| 渠道 | Android 官方 APK |
| 下载 | https://nightingalevoicechanger.anxiqing.cn/downloads/nightingalevoicechanger-v1.0.0-official.apk |
| 产品页 | https://nightingalevoicechanger.anxiqing.cn |

数据来自 `landing-page/content/release-distribution.json`。

### 进行中

| 渠道 | 状态 |
|------|------|
| App Store | draft，链接待填 |
| Google Play | draft，链接待填 |

### 上架前 smoke 清单（复制即用）

```bash
# 契约 + 变声主链（mock RVC）
make -C apps/nightingale-voice-changer smoke-public-api-contract

# 后台 voice 配置
make -C apps/nightingale-voice-changer smoke-admin-voice

# 可选：真实 Windows 节点
make -C apps/nightingale-voice-changer smoke-public-api-contract-remote
```

iOS 真机：**只验 Profile/Release**

```bash
bash apps/nightingale-voice-changer/scripts/install-profile-ios.sh
```

### 用户侧必知的 API 行为

- 变声 = `POST …/voice/sts/convert` + 轮询 `GET …/voice/tasks/{jobId}`
- 正式前缀：`https://api.i2kai.com/app/nightingalevoicechanger/v1`

---

## 宝宝点滴：现在卡在哪

### 目标平台

微信小程序（UniApp），正式 base：

```text
https://api.i2kai.com/app/babydiary/v1
```

### 已通过（本地冻结）

- **2026-04-23**：`make smoke-foundation` + `make smoke-business`
- 契约文档：`apps/baby-diary/docs/api/app-api.md`

### 上架前 smoke 清单

```bash
make -C apps/baby-diary smoke-public-api-contract
make -C apps/baby-diary smoke-app-router-local
make -C apps/baby-diary smoke-miniapp-release-config
make -C apps/baby-diary smoke-client-wechat
```

生产只读：

```bash
# 默认 BABYDIARY_PUBLIC_READONLY_SMOKE_BASE
bash scripts/management/run-uniapp-wechat-miniapp-checks.sh
```

### 审核期最容易踩的契约点

1. 登录后 **必须** `POST /session/bootstrap`，没有 family 不能前端兜底创建。
2. 记录只走 `/record-sessions`，13 种 `recordType` 见 131 篇表格。
3. 环境 **编译期** 注入，小程序里不能运行时切 API 环境。

### 待补公开资产

- 微信小程序码（审核通过后更新 132 小红书卡片 / 进度站）
- 生产端到端：APISIX → gateway → public-api → family/record RPC → PostgreSQL

---

## 两条链对照：为什么一起上架

| | 夜莺 | 宝宝点滴 |
|---|------|-----------|
| 客户端栈 | Flutter + hub_core | UniApp 小程序 |
|  hardest API | 异步 voice 任务 + VIP | bootstrap + 多成员协作 + record 聚合 |
| public-api 端口 | 58014 | 55014 |
| 已有对外产物 | APK v1.0.0 | 审核中 |
| smoke 代表 | `smoke-public-api-contract` | `smoke-foundation` + `smoke-business` |

同一套 **APISIX 四路分流** 下，Flutter 和 UniApp 各验一条最难链——比再写一篇「微服务优势」有用。

---

## 发布顺序建议

公众号 / 小红书仍建议 **129 → 130 → 131 → 132**：

1. **129** 改前改后（MySQL 旧文 vs PostgreSQL + APISIX 现网）
2. **130** 夜莺 job 轮询 + APK
3. **131** bootstrap + record-sessions
4. **132** 本篇台账

HTML 发布物：`HUB-Ecosystem-v2/content/tools/output/published/`

---

## 你下载 / 试用后

- 夜莺 APK 变声失败：看是否走 task 轮询；后台 voice 配置用 `smoke-admin-voice` 对照。
- 宝宝点滴登录后空白：几乎一定是 bootstrap / family 上下文问题，不是「小程序 bug」一句话带过。
- 架构疑问： [公开六图](https://apps.open.i2kai.com/architecture) · [愿望池](https://apps.open.i2kai.com/wishlist)

商店链接和 `released` 状态会在 **渠道真正上线后** 单独更新进度站与本文——不提前写空头支票。
