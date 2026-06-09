---
title: '宝宝点滴：UniApp 样板 App 如何走通家庭记录全链路'
date: 2026-06-10
tags: ['UniApp', '小程序', 'HUB', '育儿', '独立开发']
description: '宝宝点滴是 HUB 的 UniApp 样板 App。本文拆解喂养记录、家庭协作与 /app/babydiary/v1 契约如何落在微服务上。'
author: '罗耀生'
updated: 2026-06-10
---

## 它是什么

**宝宝点滴**是 50 Builds 里的 **UniApp 样板 App**，目标很具体：验证记录类 + 家庭协作业务，能不能在 HUB 底座上跑通 **微信小程序 → public-api → 业务 RPC** 全链路。

| 项 | 值 |
|----|-----|
| appKey | `baby-diary` |
| appId | `babydiary` |
| 客户端 | uniapp_app（微信小程序 / H5） |
| 正式 API 前缀 | `/app/babydiary/v1/*` |
| 线上入口 | `https://api.i2kai.com/app/babydiary/v1` |

总述篇：[架构收敛之后：夜莺变声器与宝宝点滴即将上架](/blog/2026-06-09-hub-architecture-two-reference-apps/)

---

## 解决什么问题

带娃家庭常见的痛点：

- 喂养、睡眠、体温、用药分散在备忘录或聊天记录里
- 爸爸妈妈、老人之间信息不同步
- 想回看趋势，却没有结构化数据

宝宝点滴把记录收敛到一个 App 里，并支持 **家庭成员协作** 与 **提醒**。

---

## 功能模块

### 记录类

喂养、同时喂养、睡眠、体重、体温、用药、黄疸、辅食、吸奶器、活动、疫苗、补剂……覆盖 0–3 岁日常高频场景。

### 家庭协作

- 创建家庭空间
- 邀请成员加入
- 多成员身份与权限
- 记录在多端同步

### 统计与提醒

- 日趋势、统计摘要（record RPC 聚合）
- 提醒设置（reminder RPC）
- 活动日志（activity RPC）
- 数据导出

反馈能力走 **平台共享 feedback**，不在 App 内重复造轮子。

---

## 客户端契约：前端只认 public-api

服务端内部怎么拆 RPC，前端不关心。客户端只认：

```
基线路径：/app/babydiary/v1
```

环境切换规则已经收口：

1. 优先编译期注入 `HUB_API_BASE_URL`
2. 若只注入网关根地址，自动补全为 `…/app/babydiary/v1`
3. 未注入则回退线上 `https://api.i2kai.com/app/babydiary/v1`

**不再有**页面内切环境、运行时改 baseUrl 的野路子——联调差异只来自 `.env.hub → vite define`。

请求头统一带 `X-App-Id`、`X-Signature` 等 hub_core 约定字段，与 Flutter 侧同一套平台规则。

契约事实源：`apps/baby-diary/docs/api/app-api.md`

---

## 服务端结构

```
baby-diary/server/
├── publicapi/     # 正式 HTTP 门面（auth + family bootstrap）
├── family/        # 家庭 / 成员 / 邀请 / 宝宝
├── record/        # 记录会话 + 统计聚合
├── reminder/      # 提醒
├── activity/      # 活动日志
└── cmd/local-rest-bridge/   # 契约诊断
```

正式链路：

```
UniApp 小程序
  → APISIX
  → gateway → app-router
  → public-api
  → family / record / reminder / activity RPC
  → PostgreSQL / Redis
```

平台共享能力（auth、payment、storage、feedback）仍走 `/v1/{domain}/*` 或 storage 旁路，不混进 App 私有路由。

---

## 开发与 smoke

本地标准入口：

```bash
make docker-local-up
make smoke-foundation
make smoke-business
make smoke-client-local
make smoke-app-router-local
make smoke-public-api-contract
```

2026-04-23 本地 foundation / business smoke 已通过。下一步验收重点是 **APISIX 公网入口 → 真实 RPC → 数据库** 端到端，而不是只在 bridge 上自嗨。

小程序调试打开 `uniapp_app/unpackage/dist/dev/mp-weixin`，不直接开源码目录；`manifest.json` 与 `project.config.json` 的 appid 必须一致。

---

## 为什么选 UniApp 做记录协作样板

HUB 里 UniApp 产品不少（萌宠圈等），但宝宝点滴承担的是 **结构化记录 + 多成员协作** 这类「表单密集、状态多、家庭权限」场景：

- 页面多、记录类型多，适合验证 public-api 契约治理
- 小程序是国内育儿场景的主战场
- 与 Flutter 样板（夜莺）形成 **双栈互补**

| 对比 | 夜莺变声器 | 宝宝点滴 |
|------|-----------|---------|
| 客户端 | Flutter | UniApp / 小程序 |
| 能力域 | voice + VIP | 记录 + 家庭协作 |
| 样板意义 | 音频异步任务链 | 结构化 CRUD + 多成员 |

---

## 当前状态

公开进度约 **75%**。客户端契约、go-zero 服务端、Makefile smoke 门禁已齐；生产发布走 Gitea CI/CD，业务机 pull/up/smoke，不在业务机编译源码。

进度页：[apps.open.i2kai.com/apps/baby-diary](https://apps.open.i2kai.com/apps/baby-diary)

---

## 写在最后

宝宝点滴的难点不在「做一个育儿 UI」，而在 **契约稳定、家庭权限清晰、多端同步可靠**。

它跟夜莺一起，构成 HUB 架构修正后的 **双栈验收**：一个证明 voice 链路，一个证明记录协作链路。下一篇如果还写，可能就是上架当天的发布笔记了。
