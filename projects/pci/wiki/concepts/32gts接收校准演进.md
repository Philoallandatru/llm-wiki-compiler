---
title: 32GT/s接收校准演进
summary: 从固定信道损耗到可变ISI（34-37dB），增加了幅度/Sj/DMI可调范围，Base Rev2 fixture采用MMPX同轴连接器
sources:
  - presentation-title-goes-here.md
kind: concept
createdAt: "2026-05-24T04:26:19.599Z"
updatedAt: "2026-05-24T04:26:19.599Z"
tags:
  - PCIe
  - 接收测试
  - 校准
aliases:
  - 32gts接收校准演进
confidence: 0.85
provenanceState: merged
---

<think>The user wants me to write a wiki page about "32GT/s接收校准演进" (32GT/s Receiver Calibration Evolution) based on the provided source material.

Looking at the source material (presentation-title-goes-here.md), I can find relevant information about receiver calibration evolution on pages 19-27:

From page 20 (Slide 20 of 33):
- "32GT/s Rx Calibration" - mentions 15mV / 0.3UI @ E-12 BER

From page 21 (Slide 21 of 33):
- "Rx Calibration Evolution"
- 8GT/s Rx Calibration: Fixed Channel Loss, Knobs - Rj/DMI, Only CEM fixtures
- 16GT/s Rx Calibration: Variable ISI (27 to 30dB), Knobs - Amplitude/Sj/DMI
- 32GT/s Rx Calibration: Variable ISI (34 to 37dB), Same Knobs as 16GT/s, Base Rev2 fixtures under development

From page 22 (Slide 22 of 33):
- "Rx Test Points" - shows test point diagrams

From page 23 (Slide 23 of 33):
- "Points of Clarification" - Channel Selection, TP1 Cable, Tie Breakers

From page 24 (Slide 24 of 33):
- "New Guidelines from Intel & AMD Released" - just says "Text"

From page 25 (Slide 25 of 33):
- "Simulation Method Conversion Factor" - NEW

From page 26 (Slide 26 of 33):
- "Other Considerations" - Replica Channel & Package Embedding, CTLE AC/DC Gain Step Size

From page 27 (Slide 27 of 33):
- "Gen5 Base Calibration (11/5/2019)" - Calibration results table


- I can now construct a comprehensive wiki page using these details.
</think>

# 32GT/s接收校准演进

## 概述

随着 PCIe 5.0 规范将数据速率提升至 32GT/s，接收端校准技术经历了显著的演进过程。与前代 16GT/s 相比，32GT/s 接收校准需要应对更高的信道损耗、更复杂的信号衰减以及更严格的眼图闭合要求。PCI-SIG 在接收校准框架、测试设备和校准流程等方面进行了系统性升级，以确保接收端能够可靠地从劣质信号中恢复数据。 ^[presentation-title-goes-here.md:19-21]

## 校准演进历程

### 8GT/s 接收校准

8GT/s 代际的接收校准采用相对简化的方法： ^[presentation-title-goes-here.md:21-21]

- **信道损耗模型**：使用固定信道损耗参数，封装损耗嵌入 SigTest 软件中
- **可调参数**：仅包含 Rj（随机抖动）和 DMI（数据相关抖动）两个旋钮
- **局限性**：固定参数方法常导致不切实际的 Rj 值，且缺乏边界约束
- **测试夹具**：仅通过 PCI-SIG 销售 CEM 测试夹具
- **软件工具**：Seasim（Base 规范）和 SigTest（CEM 规范）

### 16GT/s 接收校准

16GT/s 代际标志着接收校准的重要改进，引入了可变损耗测试方法： ^[presentation-title-goes-here.md:21-21]

- **信道损耗模型**：采用可变 ISI（码间干扰）技术，测试范围扩展至 27dB 至 30dB，改善了测试设备间的相关性
- **可调参数**：扩展为幅度（Amplitude）、Sj（系统性抖动）和 DMI，并定义了允许范围
- **测试夹具**：提供 Base 规范限制夹具，通过 PCI-SIG 销售，并在 Base 规范中包含实现说明
- **软件工具**：Seasim/SigTest（Base 规范）和 SigTest（CEM 规范）

### 32GT/s 接收校准

32GT/s 代际继承了 16GT/s 的可变 ISI 架构，并根据高速传输需求进行了针对性增强： ^[presentation-title-goes-here.md:21-21]

- **信道损耗模型**：测试范围进一步扩展至 34dB 至 37dB（@ 16GHz）
- **可调参数**：保持与 16GT/s 相同的参数组合，包括幅度、Sj 和 DMI
- **测试夹具**：Base Rev2 夹具正在开发中，采用 MMPX 同轴连接器
- **软件工具**：Seasim（Base 规范），SigTest EH 外推法及噪声影响正在研究中

## 32GT/s 接收校准目标

32GT/s 接收校准的核心目标是在指定误码率（BER）条件下确保接收端能够可靠地恢复信号。具体参数要求如下： ^[presentation-title-goes-here.md:20-20]

| 参数 | 要求 |
|------|------|
| 眼高（Eye Height） | 15 mV |
| 眼宽（Eye Width） | 0.3 UI（单位间隔） |
| 目标误码率 | E-12（10⁻¹²） |

## 测试点定义

接收校准涉及多个关键测试点（Test Points），这些测试点定义了信号在传输链路中的特定位置，用于精确测量和分析信号质量。每个测试点代表不同的信号完整性状态，对于理解信道对信号的影响至关重要。 ^[presentation-title-goes-here.md:22-22]

## 校准细节澄清

PCI-SIG 针对 32GT/s 接收校准发布了若干澄清指南，以确保各厂商实现的一致性： ^[presentation-title-goes-here.md:23-23]

### 信道选择

- 对于 Gen4（16GT/s），选择 27dB 至 30dB 之间的信道
- 对于 Gen5（32GT/s），选择 34dB 至 37dB 之间的信道
- 选择产生最大有效幅度（EA）且具有最佳 CTLE 的预设值
- CTLE 步进精度：16GT/s 为 1/4dB，32GT/s 为 1dB

### 测试点 1（TP1）电缆定义

- TP1 定义为信号发生器的输出端，TP3 定义为第一根同轴电缆之后的点
- 在 16GT/s 速率下，TP1 与 TP3 之间的电缆被视为校准信道的一部分
- 在 32GT/s 速率下，该电缆被视为发生器的一部分，不计入信道损耗

### 平局决胜规则

当存在多个满足条件的配置时，采用以下优先级规则：

**16GT/s 规则**：
1. 首先选择使眼宽（EW）最接近目标值的 Sj/DMI/Swing 组合
2. 其次选择 Sj 最接近标称值的组合

**32GT/s 规则**：
1. 首先选择具有最高信道损耗的组合
2. 其次选择眼高（EH）最接近目标值的组合

## 仿真方法转换因子

PCI-SIG 在 32GT/s 接收校准中引入了新的仿真方法转换因子，用于更精确地映射仿真结果与实际测试条件之间的关系。该转换因子是 32GT/s 校准方法论中的新增内容，旨在提高仿真与实测之间的相关性。 ^[presentation-title-goes-here.md:25-25]

## 其他技术考量

### 复制信道与封装嵌入

32GT/s 校准需考虑以下复制信道相关问题： ^[presentation-title-goes-here.md:26-26]

- **物理复制信道**：提供额外的阻抗不连续性，需要进行电缆去嵌入
- **级联滤波器方法**：对复制信道和封装模型采用级联滤波器处理
- **低反射信道优势**：采用较少反射的信道设计，无需复杂的去嵌入处理

### CTLE 交流/直流增益步进精度

- 16GT/s 相关性验证需要 1/4dB 步进精度的 CTLE
- 32GT/s 目前仅探索了 1dB 步进精度，未来可能需要进一步细化

## Gen5 Base 校准结果

2019 年 11 月 5 日发布的 Gen5 Base 校准结果如下： ^[presentation-title-goes-here.md:27-27]

**校准配置参数**：

| 参数 | 值 |
|------|---|
| 信道 | Gen5 Base Rx Calibration Fixtures – Rev3 |
| 传输线对 | 15" 和 8" 复制线（约 36dB） |
| 传输端 Tx EQ | Preset 6 |
| 最终 Sj | 3.5ps（超出标称值 0.375ps） |
| 最终 DMI | 12.35mV @ TP2（超出标称值 2.35mV） |
| 最终眼宽 | 9.5ps |
| 最终眼高 | 16.2mV |

**各预设测试点结果**：

| 预设 | EH (mV) | EW (ps) |
|------|---------|---------|
| P0 | 4.9 | 3.2 |
| P1 | 10.5 | 6.1 |
| P2 | 6.5 | 4.0 |
| P3 | 11.1 | 6.6 |
| P4 | 8.4 | 4.5 |
| P5 | 9.5 | 6.4 |
| P6 | 17.5 | 10.2 |
| P7 | 6.8 | 5.0 |
| P8 | 9.1 | 6.7 |
| P9 | 11.9 | 7.7 |

## 相关概念

- [[PCIe 4.0到5.0基础规范变化]] — PCIe 4.0 与 5.0 规范的完整对比
- [[PCI Express]] — PCI Express 标准概览
- [[接收端均衡]] — 接收端的 CTLE 和 DFE 均衡技术
- [[链路均衡]] — 链路训练与均衡机制
- [[眼图分析]] — 眼高、眼宽与信号质量评估

## 来源

^[presentation-title-goes-here.md]

- PCI-SIG, "PCI Express 5.0 Update: Keys to Addressing an Evolving Specification", June 9, 2020, Slides 20-27 "PCI Express 5.0 32GT/s Rx Calibration and Test"
