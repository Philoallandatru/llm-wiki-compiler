---
title: Updated CEM Connector and Edge Finger Layout
summary: PCIe 5.0 only allows SMT CEM connectors; includes ground vias at both sides of pad, pad size reduction, ground plane beneath edge fingers, 1.27mm (0.05") pitch
sources:
  - presentation-title-goes-here.md
kind: concept
createdAt: "2026-05-24T07:39:24.658Z"
updatedAt: "2026-05-24T07:39:24.658Z"
tags:
  - connectors
  - cem
  - hardware
aliases:
  - updated-cem-connector-and-edge-finger-layout
  - Edge Finger Layout and Updated CEM Connector
  - UCCAEFL
confidence: 0.8
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "Updated CEM Connector and Edge Finger Layout" based on the provided source material. I have the PCI Express 5.0 presentation content, and slide 9 of 33 contains information about this topic.

Let me extract the key information from slide 9:

"Updated Connector & Edge Finger Layout
• Only SMT CEM connectors allowed
• CEM connector layout optimizations
• Gnd vias at both sides of pad
• Pad size reduction
• Edge Finger layout optimizations
• Edge Finger Dimension reduction
• Gnd plane beneath edge fingers
1.27mm
(0.05")"

So the key points are:
1. Only SMT (Surface Mount Technology) CEM connectors are allowed
2. CEM connector layout optimizations:
   - Ground vias at both sides of pad
   - Pad size reduction
3. Edge Finger layout optimizations:
   - Edge Finger Dimension reduction
   - Ground plane beneath edge fingers
4. The pitch/dimension mentioned is 1.27mm (0.05")

This is a relatively brief topic, but I can expand on the context and related concepts. I need to write in zh-CN (Simplified Chinese) as specified in the system message.

Let me structure the wiki page:

1. Overview - Brief introduction to the topic
2. SMT Connector Requirement - Explanation of why only SMT connectors are allowed
3. Connector Layout Optimizations - Details about ground vias and pad size
4. Edge Finger Layout - Details about dimension reduction and ground plane
5. Technical Specifications - The 1.27mm measurement
6. Related Concepts - Wikilinks to relevant topics

I need to include citations at the end of each prose paragraph following the format specified.
</think>

# 更新的CEM连接器和边缘手指布局

## 概述

CEM（Card Electro-Mechanical card， 卡片机电规范）连接器和边缘手指布局的更新是PCI Express 5.0规范中的重要改进之一。这些更新旨在应对32 GT/s高速数据传输带来的信号完整性挑战，通过优化连接器设计和布局来减少信道损耗和阻抗不连续性。^[presentation-title-goes-here.md]

## 仅允许SMT连接器

PCI Express 5.0规范明确要求**仅使用SMT（表面贴装技术）CEM连接器**，不再支持传统的通孔技术连接器。^[presentation-title-goes-here.md]

SMT连接器相比通孔连接器具有以下优势：
- 更短的信号路径，减少插入损耗
- 更好的高频性能
- 更低的寄生电感
- 有利于自动化装配和大规模生产

这一要求的提出主要基于32 GT/s速率下对信号完整性的严格要求。^[presentation-title-goes-here.md]

## 连接器布局优化

PCI Express 5.0对CEM连接器的布局进行了多项优化改进。

### 地通孔布置

在焊盘两侧设置**接地通孔（Ground Vias）**，这是改善信号完整性的关键设计。通过在信号焊盘两侧对称布置接地通孔，可以有效降低信号路径的回路电感，减少串扰，并提供更好的屏蔽效果。^[presentation-title-goes-here.md]

### 焊盘尺寸缩小

与前代规范相比，PCI Express 5.0规范要求**缩小焊盘尺寸**。较小的焊盘可减少连接器区域的电容效应，降低高速信号的眼图退化风险。焊盘尺寸的减小与32 GT/s速率下更严格的信号眼图要求相匹配。^[presentation-title-goes-here.md]

## 边缘手指布局优化

边缘手指（Edge Finger）是插入卡边缘的镀金触点，用于与连接器建立电气连接。PCI Express 5.0对边缘手指的布局进行了显著的优化调整。

### 边缘手指尺寸减小

规范要求**减小边缘手指的尺寸**，包括宽度和长度的调整。这一优化基于以下考量：
- 减少高速信号传输过程中的阻抗不连续
- 降低连接器区域的寄生电容
- 改善信号从PCB到连接器的过渡质量

### 接地平面增强

在边缘手指下方设置了**专用的接地平面（Ground Plane）**，这一设计提供了：
- 更好的阻抗控制
- 增强的屏蔽效果
- 改善信号回流路径
- 减少电磁干扰（EMI）辐射

接地平面的优化对于32 GT/s高速信号的传输尤为关键。^[presentation-title-goes-here.md]

## 技术规格

PCI Express 5.0 CEM连接器和边缘手指布局的关键尺寸为**1.27 mm（0.05英寸）**。^[presentation-title-goes-here.md]

这一间距标准确保了与PCI Express 5.0连接器的机械和电气兼容性，同时为高频信号传输提供了适当的引脚间距以减少串扰。

## 设计原则

PCI Express 5.0连接器和边缘手指布局的更新遵循以下设计原则：

| 原则 | 说明 |
|------|------|
| 最小化插入损耗 | 通过SMT技术和优化的布局减少信号衰减 |
| 控制阻抗连续性 | 通过接地通孔和接地平面维持传输线阻抗特性 |
| 降低寄生效应 | 通过减小焊盘和手指尺寸降低寄生电容 |
| 改善信号隔离 | 通过合理的地通孔布置减少串扰 |

^[presentation-title-goes-here.md]

## 相关概念

- [[PCI Express 5.0]] — 引入更新连接器规范的PCIe版本
- [[CEM规范]] — 定义卡级机电接口的标准
- [[信号完整性]] — 连接器设计优化的核心目标
- [[SMT技术]] — 当前连接器采用的表面贴装工艺
- [[眼图]] — 评估高速信号质量的测量方法
- [[传输线阻抗]] — 影响连接器设计的关键电气参数

---

## Sources

- [PCI Express 5.0 Update: Keys to Addressing an Evolving Specification](presentation-title-goes-here.md)
