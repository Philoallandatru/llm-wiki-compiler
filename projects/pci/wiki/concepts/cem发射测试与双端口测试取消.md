---
title: CEM发射测试与双端口测试取消
summary: 2020年3月CEM工作组投票取消5.0系统发射的双端口测试要求，32GT/s系统测试将采用与Add-in Card相同的CDR和参考Rx EQ算法，仅需2个示波器通道
sources:
  - presentation-title-goes-here.md
kind: concept
createdAt: "2026-05-24T04:26:17.434Z"
updatedAt: "2026-05-24T04:26:17.434Z"
tags:
  - PCIe
  - 测试方法
  - CEM规范
aliases:
  - cem发射测试与双端口测试取消
confidence: 0.9
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "CEM发射测试与双端口测试取消" (CEM Emission Test and Dual Port Test Cancellation). I need to extract relevant information from the provided source material.

Looking at the source material (presentation-title-goes-here.md), I can find relevant information about dual port testing removal:

From page 15 of the presentation (PCIe Gen 5 TX CEM):
"CEM workgroup voted in March 2020 to remove the Dual Port Requirement for 5.0 System Tx requirement"

Key points:
- The CEM workgroup voted in March 2020
- Decision to remove the Dual Port Requirement
- Applied to 5.0 System Tx requirement

I should write a comprehensive wiki page about this topic, covering:
1. Overview of CEM emission testing
2. Dual port testing background
3. The removal decision and its rationale
4. Implications for PCIe 5.0 testing

Let me structure this properly with proper citations to the source material.
</think>

# CEM发射测试与双端口测试取消

## 概述

CEM（Card Electromechanical，卡级机电）发射测试是 PCI Express 规范中用于验证系统和附加卡在高速数据传输时信号质量的关键测试项目。双端口（Dual Port）测试要求则是 CEM 规范中针对发射端测试的一种特定测试方法。2020 年 3 月，CEM 工作组投票决定取消 PCIe 5.0 系统发射端的双端口测试要求，这是 PCI Express 规范演进过程中的重要调整。 ^[presentation-title-goes-here.md:15-15]

## 双端口测试背景

### 双端口测试原理

在传统 PCIe 测试方法中，双端口测试需要同时使用两个示波器通道来捕获时钟信号和数据信号。这种测试方法的核心流程包括：^[presentation-title-goes-here.md:13-13]

1. **同步捕获**：同时捕获时钟信号和数据信号
2. **PLL 滤波**：将最小/最大带宽和峰值 PLL 滤波器应用于参考时钟，生成多个不同的滤波时钟记录
3. **相位抖动计算**：使用每个滤波时钟记录计算数据的相位抖动数组，采用多个不同的相位对齐方式来表示附加卡上可能发生的相位最小/最大偏移
4. **总抖动计算**：取所有 PLL 带宽和相位对齐中获得的最大数值作为总抖动

### PCIe 2.0 双端口模型

PCIe 2.0 时代的双端口测试模型要求设备同时提供时钟和数据路径，以便测试设备能够进行同步测量。这种方法虽然在当时提供了准确的测试结果，但对测试设备提出了较高要求。 ^[presentation-title-goes-here.md:11-13]

## PCIe 5.0 双端口测试取消决策

### 决策内容

2020 年 3 月，CEM 工作组投票决定取消 PCIe 5.0 系统发射端要求的双端口测试（Dual Port Requirement）。这一决策意味着在 PCIe 5.0 系统级发射测试中，不再强制要求使用双端口测试方法。 ^[presentation-title-goes-here.md:15-15]

### 取消原因分析

#### 测试设备成本

双端口测试需要同时使用两个高速示波器通道来捕获信号，而高速示波器通道的价格非常昂贵。取消双端口测试要求可以显著降低测试成本，使得更多的实验室能够承担 PCIe 5.0 合规测试。 ^[presentation-title-goes-here.md:14-14]

#### 测试方法简化

PCIe 5.0 采用了新的时钟数据恢复（CDR）技术。与 PCIe 2.0 不同，PCIe 5.0 的公共时钟模型 CDR 与 SRIS CDR 在 33 KHz 至 2 MHz 频段范围内具有较强的抖动抑制能力，这使得单端口测试方法同样能够获得准确的测试结果。 ^[presentation-title-goes-here.md:14-14]

#### 测试效率提升

单端口测试方法相比双端口测试具有更简单的操作流程和更短的测试时间，有助于提高 PCIe 5.0 设备的认证效率。 ^[presentation-title-goes-here.md:15-15]

## 替代方案

### 新的 PCIe 5.0 系统参考时钟抖动合规测试

CEM 工作组正在探索一种新的 5.0 系统参考时钟抖动合规测试方法，以替代原有的双端口测试要求。这种新方法旨在确保在不增加测试复杂度的前提下，维持对 PCIe 5.0 系统信号质量的验证能力。 ^[presentation-title-goes-here.md:15-15]

### CDR 与参考 Rx EQ 算法对齐

在 32 GT/s 速率下，PCIe 5.0 系统将使用与 32 GT/s 附加卡相同的 CDR（时钟数据恢复）和参考 Rx EQ（接收端均衡）算法。这意味着系统级测试与卡级测试采用了统一的验证标准，确保了测试结果的一致性和可重复性。 ^[presentation-title-goes-here.md:15-15]

## 技术细节

### PCIe 5.0 参考时钟抖动要求

PCIe 5.0 对参考时钟的高频抖动限值提出了更严格的要求，从 PCIe 4.0 的 ≤ 500 fs 降低至 ≤ 150 fs。这一更严格的抖动要求是 PCIe 5.0 采用单端口测试方法的技术基础之一。 ^[presentation-title-goes-here.md:4-4]

### 时钟抖动特性变化

在 PCIe 5.0 系统中，时钟抖动的处理方式发生了显著变化：^[presentation-title-goes-here.md:14-14]

| 特性 | PCIe 2.0 | PCIe 5.0 |
|------|----------|----------|
| CDR 抖动抑制 | 在 33 KHz 至 2 MHz 范围内抑制能力较弱 | 在 33 KHz 至 2 MHz 范围内抑制能力强 |
| 参考时钟抖动限值 | 较大（5.0 GT/s PCIe 约 3.1 ps RMS） | 很小（0.15 ps RMS） |
| 平台级抖动权衡 | 支持显著的数据与时钟抖动权衡 | 不支持平台级抖动权衡 |

### 测试设备需求

取消双端口测试要求后，PCIe 5.0 系统发射测试仅需要 **2 个示波器通道**即可完成，相比原有方法大幅减少了对测试资源的需求。这一改变使得 PCIe 5.0 测试的门槛显著降低。 ^[presentation-title-goes-here.md:15-15]

## 对行业的影响

### 降低测试成本

双端口测试取消后，实验室无需采购昂贵的双端口示波器配置即可执行 PCIe 5.0 系统级发射测试，这有助于推动 PCIe 5.0 技术的快速普及。 ^[presentation-title-goes-here.md:15-15]

### 加速产品上市

简化的测试方法可以缩短设备认证周期，帮助厂商更快地将支持 PCIe 5.0 的产品推向市场。 ^[presentation-title-goes-here.md:17-17]

### 测试标准化

通过采用与附加卡相同的 CDR 和 Rx EQ 算法进行系统测试，有助于建立更加统一和一致的测试标准，提升行业整体测试水平。 ^[presentation-title-goes-here.md:15-15]

## 参见

- [[PCIe 5.0 CEM 规范]]
- [[PCIe 4.0到5.0基础规范变化]]
- [[PCI Express]]
- [[PCIe 发射测试]]
- [[PCIe 参考时钟抖动]]

## 参考文献

^[presentation-title-goes-here.md]

- PCI-SIG, "PCI Express 5.0 Update: Keys to Addressing an Evolving Specification", June 9, 2020, Slide 15 "PCIe Gen 5 TX CEM"
