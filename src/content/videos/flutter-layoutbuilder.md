---
kind: share
title: 'LayoutBuilder (Flutter Widget of the Week)'
date: 2026-11-25
description: 'Google for Developers 演示如何在 Flutter 中使用父级传入的布局约束。'
category: 软件开发
tags: ['Flutter', '响应式布局', 'LayoutBuilder']
source:
  platform: youtube
  id: IYDVcriKjsw
  embed: true
originalAuthor: Google for Developers
originalDate: 2019-01-08
cover: https://i.ytimg.com/vi/IYDVcriKjsw/hqdefault.jpg
recommendation: '短片用一个 Widget 解释父级约束，适合在做手机与桌面共用的界面时快速回顾。'
featured: false
projectIds: ['smart-ble', 'open-iot-platform']
articleIds: ['2026-03-16-why-flutter', '2026-04-10-smart-ble-multi-platform']
---

[LayoutBuilder](https://api.flutter.dev/flutter/widgets/LayoutBuilder-class.html) 的输入是父容器传入的约束。把它放在要调整的局部组件上，就能按组件实际可用的宽度切换布局。以设备详情为例，侧栏、分栏或对话框里的组件都可以复用同一个布局判断。
