---
title: '夜莺变声器：Flutter 样板 App 如何走通 voice 全链路'
date: 2026-06-10
tags: ['Flutter', '变声器', 'HUB', 'voice', '独立开发']
description: '夜莺变声器是 HUB 的 Flutter + voice 样板 App。本文拆解录音变声、public-api 门面与 platform voice 的执行链路。'
author: '罗耀生'
updated: 2026-06-10
---

## 它是什么

**夜莺变声器**是 50 Builds 计划里的 **Flutter 样板 App**，用来验证：在同一套 HUB 底座上，voice 能力 + 会员订阅能不能走通完整闭环。

| 项 | 值 |
|----|-----|
| appKey | `nightingale-voice-changer` |
| appId | `nightingalevoicechanger` |
| 客户端 | Flutter 应用壳 + hub_core |
| 服务端 | public-api + voiceexecution-rpc |
| 平台能力 | hub-voice-rpc（音色、语音包、历史、收藏） |

上一篇总述：[架构收敛之后：夜莺变声器与宝宝点滴即将上架](/blog/2026-06-09-hub-architecture-two-reference-apps/)

---

## 核心功能

- **录音变声** — 正式主链，走 `POST /voice/sts/convert`
- **音色试听** — 平台 voice 音色目录
- **聊天 / 游戏语音模式** — 同一条云端变声链路，UI 场景不同
- **语音包** — 主题素材片段浏览与挑选
- **历史与收藏** — public-api 云端同步
- **VIP 订阅** — payment-rpc → vip-rpc 履约

落地页文案源：`apps/nightingale-voice-changer/content/site/`（导出到 landing-page）

---

## 正式执行链路（代码冻结版）

```
Flutter 客户端
  → hub_core（签名 / 设备 / Token）
  → APISIX（api.i2kai.com）
  → gateway → app-router
  → public-api（App HTTP 门面）
  → voiceexecution-rpc（夜莺业务编排）
  → platform voice（音色 / 语音包 / 历史事实源）
  → Windows RVC 节点（变声执行）
```

几个容易混淆的点：

1. **public-api 不是 voice 事实源** — 它只做 HTTP 门面与编排。
2. **voiceexecution-rpc 是 App 级业务 RPC** — 承接夜莺特有的执行编排。
3. **platform voice 仍是共享能力** — 音色库、历史、收藏的主规则在平台侧。
4. **历史兼容接口**（tts synthesize、convert-base64 等）仍在收口，不是当前正式 public-api 主链。

---

## 客户端结构

```
app/lib/features/
├── voice_changer/      # 变声核心
├── chat_voice_mode/    # 聊天模式
├── game_voice_mode/    # 游戏横屏模式
├── voice_pack/         # 语音包
├── history/            # 历史
└── vip/                # 会员
```

Flutter 侧遵循 HUB **framework 路线**：`packages/` 下 core / design / feature 骨架，与 hub_core SDK 对齐。

---

## 服务端与端口

| 组件 | 端口段 | 说明 |
|------|--------|------|
| public-api | 58014 | 正式 HTTP 门面 |
| local-rest-bridge | 58004 | 本地契约诊断 |
| voiceexecution-rpc | 9811 | 业务 RPC 调试 |

本地验收命令（节选）：

```bash
make -C apps/nightingale-voice-changer docker-local-up
make -C apps/nightingale-voice-changer smoke-public-api-contract
make -C apps/nightingale-voice-changer smoke-admin-voice
```

`smoke-public-api-contract` 会校验密码链路、历史链路，并用 mock RVC 验证变声主链；远端验收另有 `smoke-public-api-contract-remote`。

---

## 管理后台与配置

voice 能力在 admin 侧有独立控制面：音色、Windows RVC 节点、语音包配置等。

配置写入链路与 HUB 统一架构一致：

```
admin-web → admin-api → config-rpc → sys_config + ETCD → 运行时服务消费
```

本地 smoke 失败时，可用 `repair-local-admin-voice` 自愈最小可用配置；远端模型池同步用 `sync-remote-windows-models`。

---

## 为什么选 Flutter 做 voice 样板

译言宝已经验证了 Flutter + 翻译链路。夜莺补齐的是 **voice + 订阅** 组合：

- 实时音频上传与异步变声任务
- 多场景 UI（聊天 / 游戏 / 录音）
- 会员权益与音色解锁
- 与 platform voice 的深度集成

UniApp 侧由 **宝宝点滴** 覆盖记录类场景，两者互补。

---

## 当前状态

公开进度约 **82%**。已完成 public-api 契约、voice smoke、admin 投影、landing-page 内容导出与 iOS Profile 冷启动脚本。

上架前仍在收：商店物料、远端 RVC 节点稳定性、会员链路全链路回归。

进度页：[apps.open.i2kai.com/apps/nightingale-voice-changer](https://apps.open.i2kai.com/apps/nightingale-voice-changer)

---

## 写在最后

夜莺变声器不是「又一个变声 App」这么简单——它是 HUB 在 **Flutter + voice + VIP** 方向的验收件。

架构修完以后，第一个要问的问题就是：**这条链路能不能被下一个 App 复用？** 夜莺就是在回答这个问题。
