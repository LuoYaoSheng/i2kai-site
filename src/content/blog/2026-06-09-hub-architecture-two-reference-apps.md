---
title: '架构收敛之后：我们到底改了什么，才敢同时上架两个 App'
date: 2026-06-09
tags: ['HUB', '微服务', 'Flutter', 'UniApp', '独立开发']
description: '不是概念升级：APISIX 单入口、/app/{appId}/v1 契约、config-rpc 双写、Makefile smoke 门禁。用夜莺和宝宝点滴说明修正前后差异。'
author: '罗耀生'
updated: 2026-06-11
---

## 这篇想讲清楚的事

停更几个月，我在改 **能跑通的架构**，不是改 PPT。

2026 年 3 月那篇 [HUB Center 统一后端](/blog/2026-03-18-hub-backend-architecture/) 里写的是「一个 Gin 服务 + MySQL hub_db + 8888 端口」——那是早期抽象，**和现在的生产形态已经对不上**。如果现在还按那篇理解 HUB，联调一定会撞墙。

这篇用 **真实仓库约束 + 两个正在上架的 App** 说明：我们改了什么、怎么验收、为什么敢让 Flutter 和 UniApp 同时走同一套底座。

公开架构页（六张图 + 21 个服务索引）：[apps.open.i2kai.com/architecture](https://apps.open.i2kai.com/architecture)

---

## 修正前后：不是换名词，是换链路

| 维度 | 2026-03 旧文/旧习惯 | 现在代码里冻结的事实 |
|------|----------------------|----------------------|
| 数据库 | 文章写 MySQL `hub_db` | 平台侧 **PostgreSQL** + Redis + ETCD（香港主运行面） |
| 入口 | 「API 网关」一句话 | **APISIX** 唯一公网入口：`api.i2kai.com` / `admin.i2kai.com` |
| App 业务路径 | 各 App 路径不统一，旧公共路径混用 | 正式契约 **`/app/{appId}/v1/*`**，例：`/app/babydiary/v1`、`/app/nightingalevoicechanger/v1` |
| 客户端能否直连 RPC | 本地调试时偶尔直连过 | **禁止**；正式链必须 APISIX → gateway → public-api |
| public-api 角色 | 容易被当成「业务中心」 | **HTTP 门面 only**；账号/支付/voice/文件事实源在平台 RPC |
| 配置保存 | 「后台改完就生效」 | `admin-api → config-rpc.UpdateSystemConfig → sys_config + ETCD`；**owner service 消费后才算生效** |
| 支付回调 | 有时挂 App 私有路由 | **固定** `/v1/payment/callback/*`，不走 `/app/{appId}/…` |
| 本地端口 | 随手填 | 平台 **18000–19999**；App public-api ingress **55000–58999**；登记在 `config/app-port-registry.json` |

上面任何一行对不齐，smoke 就会红，而不是「文档写错了而已」。

---

## 固定认知：一条 URL 规则 + 四路分流

### URL 规则

```
appKey  = 仓库目录名（kebab-case）   baby-diary
appId   = 去连字符                  babydiary
正式前缀 = /app/{appId}/v1
```

宝宝点滴客户端默认 base（未注入环境变量时）：

```text
https://api.i2kai.com/app/babydiary/v1
```

代码事实源：`apps/baby-diary/uniapp_app/api/contracts.js`

夜莺正式前缀：

```text
/app/nightingalevoicechanger/v1/*
```

旧 helper 路径已移除；`docs/api/app-api.md` 明确：**唯一正式入口**是上述前缀。

### APISIX 四路分流

| 前缀 | 典型请求 | 落到谁 |
|------|----------|--------|
| `/app/{appId}/v1/*` | 业务 API | gateway → app-router → **App public-api** |
| `/v1/{domain}/*` | 登录/支付/配置 | gateway → **platform RPC** |
| `/v1/storage/*` | 上传 | **storage-api** → file-rpc |
| `/admin-api/*` | 后台 | **admin-api** → config-rpc 等 |

生产入口在香港业务机 APISIX（部署文档：`118.193.47.55`），Cloudflare 前置 TLS。

---

## 我们实际动刀的三块

### 1. App 契约收口（两个 App 各不一样，但规则相同）

**宝宝点滴**（UniApp）：

- 前端只认 `/app/babydiary/v1`；环境差异 **只来自** `.env.hub → vite define`，页面里不能切环境。
- 登录后家庭上下文走 `POST /session/bootstrap`，**删掉了**「登录成功再 `POST /families` 兜底建家庭」的老逻辑。
- 服务端拆成 `family / record / reminder / activity + publicapi`，2026-04-23 本地 `make smoke-foundation` + `make smoke-business` 已通过。

**夜莺变声器**（Flutter）：

- 变声主链冻结为 **`POST /voice/sts/convert` → 轮询 `GET /voice/tasks/{jobId}`**，不是同步等结果。
- 执行链：`public-api → voiceexecution-rpc → platform voice → Windows RVC`；回调主责在 **voice-rpc**，不在 Flutter。
- `smoke-public-api-contract` 会 mock RVC 验主链，另有 `smoke-public-api-contract-remote` 打真实 Windows 节点。

### 2. 控制面 vs 运行态（为什么后台「保存成功」还不够）

`config-rpc.UpdateSystemConfig` 当前是 **PostgreSQL `sys_config` 与 ETCD 双写**。但运行态消费方式 **还不完全统一**（微服务索引 §2.6.1 按代码冻结）：

- `auth-rpc`：`GetSystemConfig` 读 DB
- `storage-api` / `notification-rpc`：ETCD watch
- `payment-rpc`：按需读 ETCD 的 `payment_connector_capability`

所以 voice 后台改了 `voice_service_configs`，还要问：**voice-rpc / voiceexecution 有没有 reload**——这也是 `make smoke-admin-voice` 存在的原因。

### 3. 门禁脚本（不是「感觉能跑」）

两个 App 的 Makefile 里都有可重复执行的 smoke，例如：

```bash
# 宝宝点滴
make -C apps/baby-diary smoke-public-api-contract
make -C apps/baby-diary smoke-app-router-local

# 夜莺
make -C apps/nightingale-voice-changer smoke-public-api-contract
make -C apps/nightingale-voice-changer smoke-admin-voice
```

主仓还有公开只读 smoke（生产 APISIX）：

```bash
# scripts/management/run-uniapp-wechat-miniapp-checks.sh 内默认：
# BABYDIARY_PUBLIC_READONLY_SMOKE_BASE=https://api.i2kai.com/app/babydiary/v1
```

**文章可以停更，smoke 不能停。**

---

## 为什么用这两个 App 做双栈验收

| | 夜莺变声器 | 宝宝点滴 |
|---|-----------|---------|
| appId | `nightingalevoicechanger` | `babydiary` |
| 客户端 | Flutter + hub_core | UniApp 小程序 |
| public-api 端口（本地登记） | 58014 | 55014（public-api）/ 55004（bridge 仅诊断） |
| 验证的能力 | voice 异步任务 + VIP 套餐 | 记录 CRUD + 家庭邀请 + bootstrap |
| 已有对外产物 | APK v1.0.0 官方包 | 小程序审核推进中 |

译言宝验证过 Flutter + 翻译；这一轮补齐 **voice+订阅** 与 **记录+协作** 两条差异最大的链。

---

## 一条请求在夜莺里的真实路径（举例）

用户点「变声」后，Flutter 实际打的是：

```http
POST /app/nightingalevoicechanger/v1/voice/sts/convert
Authorization: Bearer …
X-App-Id: nightingalevoicechanger
X-Signature: …
```

返回不是最终音频，而是 **`accepted + job_id + poll_after_ms`**。客户端再轮询：

```http
GET /app/nightingalevoicechanger/v1/voice/tasks/{jobId}
```

这和「public-api 里同步调 RVC」的旧思路完全不同——**门面只编排，执行在 voiceexecution + 平台 voice**。

---

## 一条会话在宝宝点滴里的真实路径（举例）

小程序启动后：

```http
POST /app/babydiary/v1/auth/wechat-login
{ "code": "wx-code" }
```

拿到 `token` 后 **必须** bootstrap：

```http
POST /app/babydiary/v1/session/bootstrap
Authorization: Bearer …
```

响应里带 `currentFamilyId` / 宝宝列表；**没有 family 就报错**，前端不再偷偷建默认家庭——这是契约层Breaking Change，文档写在 `app-api.md` §5.4。

记一笔喂养：

```http
POST /app/babydiary/v1/record-sessions
```

统计页：

```http
GET /app/babydiary/v1/stats/summary
GET /app/babydiary/v1/stats/daily-trend
```

反馈走平台门面 `POST /feedback`，不是 App 私有 RPC。

---

## 当前状态（2026-06-11）

| App | 公开进度 | 卡点 |
|-----|----------|------|
| 夜莺 | testing 90% | App Store 筹备中；Android 官方 APK 已出 |
| 宝宝点滴 | testing 80% | 微信小程序审核；APISIX→RPC→DB 生产端到端回归 |

连载拆分：

- [130 夜莺技术拆解](/blog/2026-06-10-nightingale-voice-changer-reference-app/)
- [131 宝宝点滴技术拆解](/blog/2026-06-10-baby-diary-reference-app/)
- [132 上架发布笔记](/blog/2026-06-11-dual-app-launch-notes/)

---

## 写在最后

泛泛的「统一后端」救不了第 20 个 App。需要的是：

**入口唯一、契约可测、门面与事实源分离、smoke 可重复。**

这次修正麻烦，是因为之前欠的债集中在入口和契约上。夜莺和宝宝点滴一起上架，不是为了凑数，是 **同一套规则下的 Flutter / UniApp 双重复验**。

你想看某条 smoke 或某段契约原文，直接打开公开架构页或主仓 `docs/项目/01_系统架构.md`；也欢迎到 [愿望池](https://apps.open.i2kai.com/wishlist) 点名下一篇拆哪条链。
