---
title: '宝宝点滴：/app/babydiary/v1 契约、bootstrap 与 record-sessions 实录'
date: 2026-06-10
tags: ['UniApp', '小程序', 'HUB', '育儿', '独立开发']
description: 'contracts.js 编译期 base、session/bootstrap 断兜底、13 种 recordType、2026-04-23 smoke 通过——按 app-api.md 写死的联调手册。'
author: '罗耀生'
updated: 2026-06-11
---

## 这篇解决什么问题

宝宝点滴是 **UniApp 微信小程序**，用来记喂养、睡眠、换尿布、疫苗等。

泛泛地说「走统一后端」没用。小程序联调时真正会问：

- base URL 到底写哪？能不能运行时切环境？
- 微信登录后为什么没有家庭？要不要前端偷偷 `POST /families`？
- 记一笔奶是打哪个接口？统计页读哪几个 GET？

下面全部按 **`apps/baby-diary/docs/api/app-api.md`** 和 **`uniapp_app/api/contracts.js`** 回答。

总述：[架构收敛](/blog/2026-06-09-hub-architecture-two-reference-apps/)

---

## 身份与 base URL

| 字段 | 值 |
|------|-----|
| appKey | `baby-diary` |
| appId | `babydiary` |
| 正式前缀 | `/app/babydiary/v1` |
| 生产 base（默认编译） | `https://api.i2kai.com/app/babydiary/v1` |

`contracts.js` 开头写死的规则：

```javascript
/**
 * 客户端始终只认一套 /app/babydiary/v1 契约。
 * 环境差异仅来自编译期注入，不允许运行时覆盖切环境。
 */
```

本地端口（`config/app-port-registry.json`）：

| 服务 | 端口 | 谁能打 |
|------|------|--------|
| public-api | **55014** | 小程序 / H5 正式链 |
| local-rest-bridge | **55004** | **仅** smoke / 诊断，不是客户端入口 |

---

## 服务端拆法（不是一个大 public-api 包打天下）

| 组件 | 职责 |
|------|------|
| `public-api` | HTTP 门面，聚合 family/record/reminder/activity + 平台 auth/feedback |
| `family-rpc` | 家庭、成员、邀请 |
| `record-rpc` | 记录会话 |
| `reminder-rpc` | 提醒设置 |
| `activity-rpc` | 活动日志 |

正式请求链：

```text
微信小程序 → APISIX → gateway → app-router → public-api:55014 → *-rpc
```

**2026-04-23** 本地 `make smoke-foundation` + `make smoke-business` 已通过（README 冻结）。

---

## 登录：bootstrap 是硬门槛

### 已接入的 auth 接口

| 方法 | 路径 | 前端 |
|------|------|------|
| POST | `/auth/send-code` | 注册验证码 |
| POST | `/auth/register` | 手机号注册 |
| POST | `/auth/login` | 手机号登录 |
| POST | `/auth/wechat-login` | 小程序 |
| POST | `/session/bootstrap` | **登录后必调** |
| GET/PUT | `/auth/profile` | 资料 |

微信登录 body 当前只有：

```json
{ "code": "wx-code" }
```

登录成功最小依赖：

```json
{ "token": "access-token" }
```

### Breaking Change：不再偷偷建家庭

旧习惯：登录成功如果没有 family，前端 `POST /families` 兜底。

**现在删掉。** 家庭上下文 **只认** `POST /session/bootstrap` 返回；没有 family 就报错，文档 §5.4 写死。

bootstrap 核心响应：

```json
{
  "code": 0,
  "data": {
    "userInfo": { "id": 123, "nickname": "宝宝家长" },
    "context": { "currentFamilyId": 456, "familyCount": 1 },
    "families": [{ "id": 456, "name": "我的家庭", "isCurrent": true }]
  }
}
```

必要时再用 `GET /families/current` 确认，但 **不能** 跳过 bootstrap。

---

## 家庭协作：邀请与角色

| 方法 | 路径 |
|------|------|
| GET | `/families` |
| GET | `/families/current` |
| PUT | `/families/current` |
| GET | `/family-members` |
| PUT | `/family-members/{id}/role` |
| POST | `/invitations` |
| POST | `/invitations/code/{code}/accept` |

角色枚举（提交用英文，展示用中文）：

| role | 含义 |
|------|------|
| `owner` | 家庭所有者 |
| `admin` | 管理员 |
| `recorder` | 可记录 |
| `readonly` | 只读 |

创建邀请示例（前端实际发送）：

```json
{
  "name": "外婆",
  "relation": "elder",
  "role": "recorder"
}
```

`relation` 推荐：`parent` / `elder` / `caregiver`

---

## 记录：只用 `/record-sessions`

**没有**单独的 `/record-targets*` 给客户端——聚合在 session 里。

| 方法 | 路径 |
|------|------|
| GET | `/record-sessions` |
| POST | `/record-sessions` |
| GET/PUT/DELETE | `/record-sessions/{id}` |

13 种 `recordType`（文档 §9.1 冻结）：

`feeding_bottle` · `feeding_breast` · `diaper` · `sleep` · `weight` · `temperature` · `medicine` · `jaundice` · `solid` · `pump` · `activity` · `vaccine` · `supplement`

瓶喂示例：

```json
{
  "recordType": "feeding_bottle",
  "eventAt": "2026-04-16T09:30:00+08:00",
  "notes": "瓶喂记录",
  "targets": [{
    "babyId": 1,
    "recordType": "feeding_bottle",
    "amount": 120,
    "unit": "ml",
    "payload": "{\"method\":\"奶粉\"}"
  }]
}
```

列表筛选参数：`babyId` · `recordType` · `date` · `dateFrom` · `dateTo` · `page` · `pageSize`

---

## 统计与提醒

| 方法 | 路径 | 前端 |
|------|------|------|
| GET | `/stats/summary` | 已接入 |
| GET | `/stats/trend` | 已接入 |
| GET | `/stats/today-summary` | API 有，页面未接 |
| GET | `/reminders/settings` | 已接入 |
| PUT | `/reminders/settings` | 已接入 |

反馈走平台门面：`POST /feedback`（不是 App 私有路径）。

---

## smoke：怎么证明「不是 PPT」

```bash
make -C apps/baby-diary docker-local-up
make -C apps/baby-diary smoke-foundation      # auth + bootstrap + family
make -C apps/baby-diary smoke-business        # record + stats
make -C apps/baby-diary smoke-public-api-contract
make -C apps/baby-diary smoke-app-router-local
```

生产只读（主仓脚本默认 base）：

```bash
# scripts/management/run-uniapp-wechat-miniapp-checks.sh
BABYDIARY_PUBLIC_READONLY_SMOKE_BASE=https://api.i2kai.com/app/babydiary/v1
```

小程序发布前还有：

```bash
make -C apps/baby-diary smoke-miniapp-release-config
make -C apps/baby-diary smoke-client-wechat
```

---

## 文档优先规则（协作者必看）

`app-api.md` 末尾 governance：

1. **改 API 先改文档**，再改 public-api / 前端 / smoke。
2. 「API 已定义，当前页面未接入」≠ 可以删接口——门面和 smoke 仍按正式契约维护。
3. `GET /record-sessions` 分页、筛选、时间格式 **不得** 随内部 RPC 重构漂移。

这比「我们有个统一后端」具体得多，也是停更期间真正在干的事。

---

## 当前状态

| 项 | 值 |
|----|-----|
| 公开进度 | testing **80%** |
| 平台 | 微信小程序（UniApp） |
| 生产镜像 tag 示例 | `2026-04-23.1`（family/record/public-api 等同批） |
| 卡点 | 审核 + APISIX→RPC→DB 生产端到端回归 |

公开页：[apps.open.i2kai.com/apps/baby-diary](https://apps.open.i2kai.com/apps/baby-diary)

上一篇：[夜莺契约实录](/blog/2026-06-10-nightingale-voice-changer-reference-app/) · 下一篇：[上架笔记](/blog/2026-06-11-dual-app-launch-notes/)
