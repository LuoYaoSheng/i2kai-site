---
title: '架构收敛之后：夜莺变声器与宝宝点滴即将上架'
date: 2026-06-09
tags: ['HUB', '微服务', 'Flutter', 'UniApp', '独立开发']
description: '停更数月的背后是一次微服务架构修正。修正完成后，Flutter 样板夜莺变声器与 UniApp 样板宝宝点滴将同步推进上架。'
author: '罗耀生'
updated: 2026-06-09
---

## 先说结论

Blog 和公众号停更了几个月，不是因为懒，是因为我在做一件更底层的事：**把 HUB 的微服务架构重新收口**。

收口完成后，接下来要上架的两个 App 也不只是「又做了两个产品」——它们分别是 **Flutter 样板** 和 **UniApp 样板**，用来验证同一套平台底座能不能同时承载不同客户端技术栈：

- **夜莺变声器**（Flutter）—— voice 链路 + 会员订阅样板
- **宝宝点滴**（UniApp / 小程序）—— 家庭协作 + 记录类业务样板

架构图和进度已同步到公开站：[apps.open.i2kai.com/architecture](https://apps.open.i2kai.com/architecture)

---

## 为什么停更：旧架构文已经不够用了

2026 年 3 月，我在 i2kai.com 发过一篇 [HUB Center 统一后端](/blog/2026-03-18-hub-backend-architecture/)，讲的是「50 个 App 共用一个后端」的大方向。

方向没错，但实现细节在那之后变化很大：

| 旧认知 | 修正后的认知 |
|--------|--------------|
| 「API 网关」概念笼统 | **APISIX 是唯一公网入口**（api.i2kai.com） |
| App 可能直连各种服务 | **App 不直连 RPC**，先走 gateway / public-api |
| public-api 像业务中心 | public-api 是 **HTTP 门面**，不是领域事实源 |
| 后台保存即生效 | Admin 保存 → config-rpc → ETCD → owner service 消费，**才算真正生效** |

这段时间我在改入口、改路由、改契约、改 smoke，文章管线自然慢下来。现在架构主文档、`apps-progress` 公开架构页和微服务索引已经对齐，可以重新对外讲了。

---

## 修正后的固定认知

对任何 App，只需要记住一句话：

**所有正式请求都先进入 APISIX。**

然后再按路径前缀分流：

| 路径 | 用途 |
|------|------|
| `/app/{appId}/v1/*` | 单个 App 的业务 API（经 public-api） |
| `/v1/{domain}/*` | 平台共享 API（auth、payment、config 等） |
| `/v1/storage/*` | 文件上传（storage-api → file-rpc） |
| `/admin-api/*` | 管理后台 |

命名约定：

- `appKey` = 仓库目录名（kebab-case），如 `baby-diary`
- `appId` = 去连字符，如 `babydiary`、`nightingalevoicechanger`

---

## 五层结构：以后讨论架构就按这张表

| 层级 | 组件 | 职责 |
|------|------|------|
| 入口层 | APISIX | 唯一公网入口、TLS、限流 |
| 协议层 | gateway | Token、app-router、按 appId 找 public-api upstream |
| 管理门面 | admin-web / admin-api | 运营控制台，配置写入门面 |
| 领域层 | auth / payment / vip / voice / file … | **事实源**在 RPC + PostgreSQL |
| HTTP 支撑 | storage-api | 标准文件上传入口 |

关键约束三条：

1. **门面 ≠ 事实源**——gateway、public-api、admin-api 只做编排。
2. **支付回调走共享路径**——`/v1/payment/callback/*`，不走 App 私有路由。
3. **配置生效看消费链**——页面保存成功，不等于运行时已经 reload。

更完整的图和微服务索引见公开架构页，比本文更细，适合出门协作时直接打开给团队看。

---

## 为什么选这两个 App 一起上架

HUB 里已经有 100+ 应用条目，但「样板 App」需要覆盖不同客户端形态。译言宝验证了 Flutter 翻译链路，萌宠圈在 UniApp 内容侧推进；这一轮补齐的是：

### 夜莺变声器（Flutter）

| 项 | 说明 |
|----|------|
| appId | `nightingalevoicechanger` |
| 客户端 | Flutter 应用壳 + hub_core |
| 正式链路 | Flutter → public-api → voiceexecution-rpc → platform voice |
| 核心能力 | 录音变声、音色库、聊天/游戏语音模式、语音包、历史同步、VIP 订阅 |
| 平台样板意义 | **voice 能力 + 支付会员** 在 Flutter 侧的完整闭环 |

### 宝宝点滴（UniApp）

| 项 | 说明 |
|----|------|
| appId | `babydiary` |
| 客户端 | uniapp_app（微信小程序 / H5） |
| 正式前缀 | `/app/babydiary/v1/*` |
| 服务端 | family / record / reminder / activity + public-api |
| 核心能力 | 喂养与作息记录、家庭成员协作、提醒、统计与导出 |
| 平台样板意义 | **记录类 + 家庭协作** 在 UniApp 侧的完整闭环 |

一个走 **语音 + 订阅**，一个走 **记录 + 协作**——技术栈不同，底座相同。

---

## 端到端：用户点一下之后发生了什么

以业务请求为例（简化）：

```
用户 → 客户端（Flutter / UniApp）
     → hub_core（设备与签名）
     → APISIX
     → gateway → app-router
     → App public-api
     → 平台 RPC（auth / payment / voice / file …）
```

文件上传走旁路：`/v1/storage/*` → storage-api → file-rpc，不经 public-api 编排上传本身。

支付主链：创建订单 → payment-rpc → 回调验单 → vip-rpc 履约 → promotion-rpc 归因。App 只关心会员态 UI，事实以 vip-rpc 为准。

---

## 开发和验收现状

**夜莺变声器** 当前进度约 82%：public-api 契约、voice smoke、admin 配置投影、本地 docker smoke 已纳入 Makefile 门禁。

**宝宝点滴** 当前进度约 75%：uniapp 客户端与 go-zero 服务端同仓维护；foundation / business smoke 已在本地通过，下一步验收重点是 **APISIX 入口 → 真实 RPC → PostgreSQL/Redis** 的端到端链路。

两者都不是「写个 Demo 就上架」，而是按 HUB 门禁把 **契约、smoke、部署** 一起收完。

---

## 50 Builds 进度怎么对外看

公开进度站：[apps.open.i2kai.com](https://apps.open.i2kai.com)

- **应用目录** `/apps` — 全量 HUB 清单 + 50 Builds 跟踪
- **架构速览** `/architecture` — 六张架构图 + 微服务索引 + 主流程
- **时间线** `/timeline` — 发布节点

上架完成后，我会把 `apps.ts` 里的状态从 `building` 更新为 `released`，与 Blog / 公众号文章同一批次对外。

---

## 接下来还会发什么

这篇文章是 **总述**——把「为什么停更、架构修正了什么、两个 App 为什么一起上」一次讲清楚。

后续还会拆更细的篇目（公众号 / 小红书同步）：

1. 微服务架构修正专题（控制面 vs 运行态）
2. 夜莺变声器产品与技术细节
3. 宝宝点滴产品与技术细节

但主线就以这篇为准：**先收敛架构，再让样板 App 证明架构可用。**

---

## 写在最后

独立开发做 50 个 App，难点从来不只是「写界面」，而是 **每多一个 App，基础设施是否仍然 hold 得住**。

这次架构修正，就是把入口、路由、门面和事实源彻底分开；夜莺和宝宝点滴，就是修正后的第一次双栈验收。

如果你也在做多 App 或平台化，欢迎直接看公开架构页，或到 [愿望池](https://apps.open.i2kai.com/wishlist) 留言你想看哪条链路展开成文。
