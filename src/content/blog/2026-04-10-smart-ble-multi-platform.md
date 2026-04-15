---
title: 'Smart BLE 阶段更新：多平台交互统一，验证闭环形成'
date: 2026-04-10
tags: ['BLE', 'IoT', '跨平台', 'Smart BLE']
description: 'Smart BLE 多平台产品家族完成阶段性收敛：核心交互统一、桌面端标准化、本地验证和CI闭环。'
author: '罗耀生'
---

## 更新概述

Smart BLE 多平台产品家族完成了一次重要的阶段性收敛。

**核心成果：**

- 主线平台和次维护桌面平台的核心交互基本收齐
- 桌面端不再各走各的
- 本地验证和 CI 形成闭环

## 解决的问题

这轮收敛之前，仓库存在几个典型问题：

- 同一能力在不同平台入口不一致
- 扫描页、设备详情页、日志组织方式不统一
- 桌面端体验容易漂移
- 部分平台未被纳入统一验证流程

**影响：**

- 新贡献者理解成本高
- 多平台同步迭代效率低
- UI 和交互一致性差
- 每次改动回归成本高

## iOS 主线入口收口

`apps/ios/Sources` 按统一蓝图收成：

**顶层 Tab 结构：**

- 扫描
- 广播
- 关于

**交互优化：**

- 设备详情不再是一级 Tab
- 日志回到详情页内部
- 点击设备卡进入详情页
- 未连接时也能看设备广播快照
- 广播数据按扫描结果动态刷新

iOS 和 Android / Flutter 的主流程终于更像同一个产品。

## 桌面端核心变化

### 预览与连接分离

桌面端统一遵循更清晰的模型：

```
点击设备卡 → 进入预览/详情容器
点击连接按钮 → 发起连接
连接成功后 → 界面升级为"连接后详情"
```

这个边界定义让 Tauri、Electron、macOS Native 三条桌面线可以围绕同一套工作台逻辑演进。

### Tauri / Electron 统一

- 扫描页有固定的广播信息预览侧栏
- 设备卡点击进入详情
- 信息预览和连接按钮明确分离
- 详情页动作顺序统一：导出日志 → 清空日志 → 连接/断开
- 详情页补了广播快照卡

### macOS Native 重构

- 扫描列表改成"选中先预览"
- 连接改成显式动作
- 详情区增加广播快照、快捷操作和内嵌日志
- 删除了旧的独立日志窗口流程

## 验证体系

### 本地验证

根级 Makefile 现在支持：

```bash
make verify              # 主线平台
make verify-desktop-secondary  # 次维护桌面平台
make verify-macos-native  # macOS Native
make verify-all          # 完整本地链路
```

**Android 本地验证优化：**

- 优先使用当前 JAVA_HOME
- macOS 上自动回退到 Android Studio 自带 JBR 21

### CI 增强

GitHub Actions 新增：

- macOS Native 构建
- Android JVM 单元测试
- Electron / Tauri 前端脚本语法检查

## 当前平台格局

**主维护平台：**

- Android
- Flutter
- iOS Sources
- Tauri

**次维护平台：**

- Electron
- macOS Native

这些平台的核心页面、动作顺序、预览与连接关系、日志位置、验证流程，已有清晰的一致性。

## 下一步计划

短期进入"稳定性"阶段：

- GitHub Actions 真正跑云端结果
- 补截图级/录屏级回归检查
- 做更多真机验证
- 特别关注广播、OTA、多设备场景

## 项目入口

- **仓库主页：** [github.com/luoyaosheng/smart-ble](https://github.com/LuoYaoSheng/smart-ble)
- **文档入口：** [smart-ble docs](https://github.com/LuoYaoSheng/smart-ble/tree/main/docs)

如果你之前看过这个仓库，但觉得"平台很多、结构有点乱"，这次更新之后可以重新看一遍。

现在它已经更接近一个真正可读、可跑、可扩展的跨平台 BLE 工具家族。
