---
title: Smart BLE 跨平台蓝牙调试工具介绍
date: 2026-04-15
description: 蓝析 BLE 工具箱的历史配套笔记。当前为开发预览，可查看源码与构建指引。微信小程序目标已于 2026-09-11 退役。
platform: bilibili
tags: ['BLE', '蓝牙', 'IoT', 'Smart BLE']
author: LuoYaoSheng
projectId: smart-ble
seriesIds: ['open-experiments']
hasUpdateNotice: true
---

> **更新说明 · 2026-11-25**
>
> 蓝析 BLE 工具箱的微信小程序目标（BLE Toolkit+）已于 2026-09-11 退役。当前为开发预览，请查看[蓝析产品站](https://lightble.i2kai.com)的构建指引，或访问 [GitHub 源码](https://github.com/LuoYaoSheng/smart-ble)和 [Gitee 镜像](https://gitee.com/luoyaosheng/lys-smart-ble)。

## Smart BLE 是什么

Smart BLE 是一个跨平台的 BLE（蓝牙低功耗）调试工具，核心目的是帮助开发者和学习者理解 BLE 的扫描、连接、读写和广播这四个基本操作。

它不是一个简单的 demo，而是一个真实在维护的项目，保留了多个平台的实现版本，方便对比学习。

## 支持的平台

- **微信小程序**（BLE Toolkit+）— 历史实现，已于 2026-09-11 退役
- **iOS** — 原生 Swift 实现
- **Android** — 原生 Kotlin 实现
- **Flutter** — 跨平台统一实现

多平台并存的目的不是重复造轮子，而是为了对比不同平台在 BLE 实现上的差异。比如 iOS 和 Android 在扫描行为、连接超时、后台限制上的区别，光看文档是感受不到的。

## 核心功能

### BLE 扫描

扫描周围的 BLE 设备，显示设备名称、RSSI 信号强度和广播数据。不同平台的扫描行为有差异，可以通过对比来理解。

### 连接与读写

连接到目标设备后，可以浏览其 Service 和 Characteristic，进行读写操作。这是理解 GATT 结构最直接的方式。

### 广播监听

监听设备的广播数据，理解 BLE 广播包的结构和内容。

## 适合谁

- 想学习 BLE 但不知道从哪里入手的人
- 已经在做 BLE 开发，想对比不同平台实现差异的人
- 想理解 BLE 协议栈但不想啃规范文档的人

## 如何开始

先在[蓝析产品站](https://lightble.i2kai.com)查看开发预览和对应平台的构建指引，再从 [GitHub](https://github.com/LuoYaoSheng/smart-ble) 或 [Gitee](https://gitee.com/luoyaosheng/lys-smart-ble)查看源码和实现细节。

## 相关项目

Smart BLE 是 BLE 学习的起点。如果你想继续往 IoT 方向走，可以看看 [Open IoT Platform](https://iot.open.i2kai.com)，它展示了如何从 BLE 配网到 MQTT 控制的完整链路。

---

*本文是视频配套文字笔记。如有 BV 号后续补充。*
