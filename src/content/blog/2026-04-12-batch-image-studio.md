---
title: 'Batch Image Studio — 模板驱动的批量图片处理工具'
date: 2026-04-12
tags: ['图片处理', 'AI', 'Tauri', '桌面工具']
description: '基于Tauri + React + LaMa AI模型的桌面端图片批量处理工具，支持AI智能修复、模板驱动批量处理。'
author: '罗耀生'
---

## 应用简介

Batch Image Studio 是一款模板驱动的桌面端图片局部批量处理工具，专为需要批量处理图片的用户打造。

基于 Tauri + React + TypeScript 开发，使用 LaMa AI 模型实现智能水印去除，所有处理在本地完成，保护用户隐私。

## 功能特点

- **模板驱动**：创建一次模板，复用于同类图片，极大提升批量处理效率
- **AI 智能修复**：基于 LaMa 模型的图像修复，智能去除水印和瑕疵
- **多种处理方式**：支持 AI 修复、纯色填充、裁切三种方式
- **灵活定位**：右下角锚定、按比例定位、固定像素定位
- **批量处理**：支持批量导入和处理图片，实时进度监控
- **历史记录**：任务历史保存，模板快速复用

## 适用场景

- 批量去除图片水印
- 批量修复图片瑕疵
- 批量裁剪图片区域
- 图片格式统一处理
- 电商图片批量优化

## 为什么选择 Batch Image Studio

**对比在线工具：**

- 完全本地处理，隐私安全
- 无需上传图片，处理更快
- 无次数限制，免费使用
- 支持批量处理

**对比专业修图软件：**

- 操作简单，无需专业技能
- 模板驱动，一次配置重复使用
- 专注批量处理，效率更高

## 技术亮点

- **现代化技术栈**：React 19 + Tauri 2.x + TypeScript + Rust
- **AI 模型本地运行**：LaMa ONNX 模型，无需联网
- **跨平台支持**：macOS、Windows、Linux 全平台支持
- **高效缓存机制**：预览结果缓存，避免重复计算
- **完全开源**：MIT 许可证，代码透明可审计

## 下载方式

**GitHub Releases：** [github.com/LuoYaoSheng/batch-image-studio/releases](https://github.com/LuoYaoSheng/batch-image-studio/releases)

**Gitee（国内推荐）：** [gitee.com/luoyaosheng/lys-image-studio/releases](https://gitee.com/luoyaosheng/lys-image-studio/releases)

## 设计理念

**专业、高效、隐私。**

专注批量图片局部处理场景，用模板驱动的方式提升重复性任务的效率。所有处理在本地完成，不上传任何图片，保护用户隐私。

## 开源信息

- **仓库地址：** [github.com/LuoYaoSheng/batch-image-studio](https://github.com/LuoYaoSheng/batch-image-studio)
- **技术栈：** Tauri + React + TypeScript + Rust
- **许可证：** MIT License
- **欢迎贡献：** Issue 和 Pull Request
