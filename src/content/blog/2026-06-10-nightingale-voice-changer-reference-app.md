---
title: '夜莺变声器：voice/sts/convert 任务链与 public-api 契约实录'
date: 2026-06-10
tags: ['Flutter', '变声器', 'HUB', 'voice', '独立开发']
description: '不是功能列表：POST voice/sts/convert 异步任务、58014 端口、smoke-public-api-contract 验什么、APK v1.0.0 从哪下。'
author: '罗耀生'
updated: 2026-06-11
---

## 这篇不重复讲「什么是变声器」

产品一句话：录音变声 + 音色库 + 语音包 + VIP。

技术一句话：**Flutter 只打 `/app/nightingalevoicechanger/v1/*`，变声是提交任务 + 轮询，不是 public-api 里同步调 RVC。**

契约事实源：`apps/nightingale-voice-changer/docs/api/app-api.md`（2026-06-05 ACTIVE）

总述篇：[架构收敛](/blog/2026-06-09-hub-architecture-two-reference-apps/)

---

## 身份与包名（联调必备）

| 字段 | 值 |
|------|-----|
| appKey | `nightingale-voice-changer` |
| appId | `nightingalevoicechanger` |
| Android 包名 | `luck.good.any.nightingalevoicechanger` |
| 正式 HTTP 前缀 | `/app/nightingalevoicechanger/v1` |

本地端口（`config/app-port-registry.json` 登记，勿随手改）：

| 服务 | 端口 |
|------|------|
| public-api | **58014** |
| local-rest-bridge（仅契约诊断） | **58004** |
| voiceexecution-rpc 调试 | **9811** |

---

## 变声主链：代码里冻结的 4 步

文档 §3 写的执行目标：

```text
Flutter → public-api → voiceexecution-rpc → platform voice → Windows RVC
```

客户端可见的两步 API：

**① 提交任务**

```http
POST /app/nightingalevoicechanger/v1/voice/sts/convert
Content-Type: multipart/form-data
```

成功不是返回变声文件，而是：

```json
{
  "code": 0,
  "data": {
    "accepted": true,
    "job_id": "…",
    "poll_after_ms": 500
  }
}
```

**② 轮询任务**

```http
GET /app/nightingalevoicechanger/v1/voice/tasks/{jobId}
```

直到任务完成或失败。旧的一坨同步 helper（`convert-base64`、直连 upload 等）**已从正式 public-api 移除**，contract smoke 会拦回归。

Windows 侧回调：**平台 voice-rpc 主责**，不是 Flutter 轮询 localhost。

---

## public-api 里还有什么（节选）

除 voice 外，门面还投影共享能力（路径都在 `/app/nightingalevoicechanger/v1/` 下）：

| 分组 | 代表接口 | 说明 |
|------|----------|------|
| auth | `POST /auth/device-login` | 冷启动 |
| user | `GET /user/profile` | 资料 |
| config | `GET /config/app` | 运行时配置 |
| channel | `GET /channel/effective-config` | 渠道三元配置 |
| feedback | `POST /feedback` | 平台共享反馈 |
| voice | `GET /voice/timbres` | 首页音色 |
| voice | `GET /voice/packs` | 语音包 |
| payment | `GET /payment/product-plans?platform=ios` | 套餐（会员角标接口化） |

`HubSDK` 内部常量仍是 `/auth/*` 相对路径，但 `HubConfig.apiPrefix` 会拼成 **`/app/nightingalevoicechanger/v1/auth/*`**——第一方 App 没有「偷偷走旧公共根路径」这一说。

---

## smoke 到底在验什么

本地常用：

```bash
make -C apps/nightingale-voice-changer docker-local-up
make -C apps/nightingale-voice-changer smoke-public-api-contract
make -C apps/nightingale-voice-changer smoke-admin-voice
```

`smoke-public-api-contract` 会做几件「泛文档不会写」的事：

1. 校验 **password / send-code** 与 register 规则一致（有 register 就必须有 send-code）
2. 校验 history 链路
3. **临时把本地 `voice_service_configs` 切到 mock RVC**，跑通 `voice/sts/convert`，结束后 **自动恢复配置**

远端 Windows 节点：

```bash
make -C apps/nightingale-voice-changer check-remote-windows-node
make -C apps/nightingale-voice-changer smoke-public-api-contract-remote
```

后台 voice 配置坏了时：

```bash
make -C apps/nightingale-voice-changer repair-local-admin-voice
make -C apps/nightingale-voice-changer sync-remote-windows-models
```

iOS 真机冷启动 **只看 Profile/Release**，统一脚本：

```bash
bash apps/nightingale-voice-changer/scripts/install-profile-ios.sh
```

---

## 管理后台：不是「配了就有声」

本地默认：

- admin-web：`http://127.0.0.1:18090`
- admin-api：`http://127.0.0.1:18889`
- seed 管理员（仅本地）：`admin / admin123`

`smoke-admin-voice` 会验：

- 管理员登录、voice 菜单可见
- `voice/configs` 按 `app_package_name` 筛选
- `voice/timbres` 支持 `keyword` / `windowsRvc.modelName` 搜索

后台改 `voice_service_configs` 后，还要问 ETCD 是否推送、voice-rpc 是否 reload——这和架构总述里的 **config 生效链** 是同一回事。

---

## 首发产物（具体版本）

`landing-page/content/release-distribution.json`：

| 渠道 | 状态 | 地址 |
|------|------|------|
| Android 官方 APK | **published** v1.0.0 (versionCode 1) | https://nightingalevoicechanger.anxiqing.cn/downloads/nightingalevoicechanger-v1.0.0-official.apk |
| App Store | draft | 链接待填 |
| Google Play | draft | 链接待填 |

产品页：https://nightingalevoicechanger.anxiqing.cn

公开进度：[apps.open.i2kai.com/apps/nightingale-voice-changer](https://apps.open.i2kai.com/apps/nightingale-voice-changer)

---

## 和「泛泛架构文」的差别

如果只写「Flutter 调 voice 微服务」，联调时会遇到这些真实问题：

- 为什么 convert 返回 job_id 而不是 url？
- 为什么 58014 和 58004 两个入口，客户端该打哪个？（**只打 public-api 58014**）
- 为什么 admin 配了音色仍无声？（看 smoke-admin-voice + ETCD 消费）
- 为什么旧路径删了？（contract governance 强制唯一正式门面）

这篇就是把上述问题 **按仓库文档和 Makefile 名称** 写死，方便你或协作者对着查。

下一篇：[宝宝点滴契约实录](/blog/2026-06-10-baby-diary-reference-app/) · [上架笔记](/blog/2026-06-11-dual-app-launch-notes/)
