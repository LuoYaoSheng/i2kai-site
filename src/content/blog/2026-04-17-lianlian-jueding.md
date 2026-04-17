---
title: '恋恋决定：情侣互动决策小程序 v1.0.0 上架'
date: 2026-04-17
tags: ['微信小程序', 'uni-app', 'Vue3', '个人产品']
description: '恋恋决定 v1.0.0 已上架微信小程序，用抽签、转盘、石头剪刀布、掷骰子等轻量玩法解决情侣日常的小纠结。'
heroImage: '/projects/lianlian-jueding/wechat-home-clean.png'
author: '罗耀生'
---

今天把 **恋恋决定** 正式整理成了 v1.0.0，并上架微信小程序。

它解决的是一个很小、但很真实的问题：情侣之间很多日常小事，其实不值得反复拉扯。晚饭吃什么，谁去拿外卖，今天谁洗碗，周末先做哪件事，都可以交给一个更轻松的互动来决定。

## 扫码体验

![恋恋决定小程序码](/projects/lianlian-jueding/miniapp-qrcode.jpg)

## 当前版本

- 快速抽签做决定
- 幸运大转盘选答案
- 石头剪刀布、掷骰子
- 猜数字、猜颜色
- 自定义任务清单
- 历史记录回看
- 音效反馈开关
- 转发给朋友和分享到朋友圈

## 截图

![恋恋决定首页](/projects/lianlian-jueding/wechat-home-clean.png)

![恋恋决定抽签页](/projects/lianlian-jueding/wechat-lottery-clean.png)

![恋恋决定任务清单](/projects/lianlian-jueding/wechat-task-list-clean.png)

## 技术与发布整理

这个版本基于 **uni-app + Vue 3 + Pinia + TypeScript** 开发，当前主发布平台是微信小程序。

v1.0.0 的重点不是继续堆功能，而是把主链路收口：从首页、任务入口和历史记录进入同一套玩法流程；补齐分享能力、真实音效、协议与隐私政策日期；同时清理旧的多端和后端历史目录，让项目只保留当前小程序主线。
