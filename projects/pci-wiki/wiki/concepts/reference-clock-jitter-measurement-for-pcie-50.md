---
title: Reference Clock Jitter Measurement for PCIe 5.0
summary: PCIe 5.0 refclk jitter limit very small (0.15ps RMS) vs 3.1ps for PCIe 2.0; new testing methodology required; CDR has lot of rejection at 33KHz to 2MHz
sources:
  - presentation-title-goes-here.md
kind: concept
createdAt: "2026-05-24T07:39:45.491Z"
updatedAt: "2026-05-24T07:39:45.491Z"
tags:
  - jitter
  - refclk
  - testing
aliases:
  - reference-clock-jitter-measurement-for-pcie-50
  - RCJMFP5
confidence: 0.9
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "Reference Clock Jitter Measurement for PCIe 5.0" in zh-CN (Simplified Chinese). I need to draw facts from the provided source material, which is a presentation about PCIe 5.0.

Let me identify the relevant sections about Reference Clock Jitter:

From slide 12 (page 12): "PCIe Reference Clock Jitter"
From slide 13 (page 13): "PCIe 2.0 Dual Port Algorithm Overview" - describes the algorithm
From slide 14 (page 14): "Dual Port Comparison – PCIe 2.0 & PCIe 5.0" - compares the differences
From slide 28 (page 28): "PCI Express 5.0 Refclk Jitter Measurements"
From slide 29 (page 29): "Reference Clock Phase Jitter Test"
From slide 30 (page 30): "Experiment Setup"
From slide 31 (page 31): "PCI SIG CEM Presentation" - results
From slide 32 (page 32): "Tektronix – PCI Express 5.0 Refclk Solution (under development)"

Key facts to extract:

1. PCIe 5.0 Reference Clock Jitter Requirements:
- Reference High Freq Jitter Limits: <= 500 fs for PCIe 4.0, <= 150 fs for PCIe 5.0 (from slide 5)

2. Dual Port Algorithm Overview (slide 13):
- Capture clock and data simultaneously
- Apply min/max bandwidth and peaking PLL filters to reference clock – producing several different filtered clock records
- Use each filtered clock record to compute phase jitter array for data using several different phase alignments to represent the min/max shift in phase that could occur on an add-in card
- The total jitter is the largest number obtained across all PLL bandwidths and phase alignments

3. 

The 2.0 and 5.0 specifications differ significantly in their approach. PCIe 2.0 uses a Common Clock model with CDR that has minimal rejection from 33 KHz up to 2 MHz, allowing for substantial jitter trading between data and clock paths at the platform level, with a reference clock limit of 3.1 ps RMS. PCIe 5.0 tightens this considerably with the same CDR model but substantially improved rejection characteristics, requiring a much stricter 0.15 ps RMS reference clock limit with no platform-level jitter flexibility.

At higher speeds, the calculation methodology becomes more complex. Modern high-speed receivers often don't rely on the reference clock at all, and the clock-to-data jitter computation now involves reference equalizer components, CTLE and DFE stages, plus a specific time domain CDR definition, necessitating expensive high-speed oscilloscope channels. The dual port testing requirement was removed from CEM specifications in March 2020, and the workgroup is now exploring alternative compliance test approaches for 5.0 systems.

Systems operating at 32 GT/s will be validated using identical CDR and reference Rx EQ algorithms as 32 GT/s Add-in Cards, reducing the channel count needed to just two oscilloscope inputs. An experiment setup was constructed with a Gen5 Reference Clock evaluation board, PCIe Gen5 Base Rx Calibration Fixtures (Revision 3), and a Tektronix real-time scope.

Preliminary results from the CEM workgroup indicate that base spec pathfinding simulations used 250fs reference clock jitter as the baseline, with an additional 100fs from the base spec limit attributed to crosstalk and edge flattening effects.

The analysis showed that even with 30dB channel loss, added noise, and SSC modulation enabled, jitter remained below 250fs. Future testing will examine worse-case reference clock scenarios at 150fs. Tektronix is developing a fully automated TekExpress solution for PCIe 5.0 refclk measurements, expected to launch in Q2/Q3 2020, with support for high frequency jitter measurements across Gen1 through Gen5 and optional scope noise removal capabilities.

The testing setup includes Tektronix real-time oscilloscopes (DPS77004SX, DPS5002SX, MSO64), supports data rate independent reference clock parameters, and can measure reference clock DC specifications and AC requirements. PCIe 5.0 refclk jitter requirements have tightened significantly compared to earlier generations, while testing methodologies have evolved to accommodate these more stringent specifications.
</think>



# PCIe 5.0 参考时钟抖动测量

## 概述

PCI Express 5.0（PCIe 5.0）对参考时钟抖动的要求变得更加严格，同时测试方法也发生了显著变化。这些变化反映了从16 GT/s升级到32 GT/s所带来的技术挑战。^[presentation-title-goes-here.md:12,29]

在PCIe 5.0规范中，参考时钟高频抖动限值从PCIe 4.0的**≤500 fs**大幅收紧至**≤150 fs**，这意味着测量系统的精度和测试方法必须相应提升以满足更严苛的合规性要求。^[presentation-title-goes-here.md:5]

## PCIe 2.0双端口模型算法

双端口（Dual Port）测试算法是测量PCIe参考时钟抖动的传统方法，其核心原理如下：^[presentation-title-goes-here.md:13]

1. **同步捕获**：同时捕获时钟信号和数据信号
2. **PLL滤波**：对参考时钟应用最小/最大带宽和峰值PLL滤波器，生成多个不同的滤波后时钟记录
3. **相位抖动计算**：使用每个滤波后的时钟记录，通过多个不同的相位对齐方式计算数据的相位抖动数组，以表示 addon 卡上可能发生的最小/最大相位偏移
4. **总抖动判定**：总抖动为所有PLL带宽和相位对齐组合中所获得的最大值

^[presentation-title-goes-here.md:13]

## PCIe 2.0与PCIe 5.0对比

| 特性 | PCIe 2.0 | PCIe 5.0 |
|------|----------|----------|
| 数据速率 | 5 GT/s | 32 GT/s |
| 参考时钟抖动限值 | 3.1 ps RMS | 0.15 ps RMS |
| CDR模型 | 普通时钟模型的CDR在33 KHz至2 MHz范围内抑制能力较弱 | 普通时钟模型CDR与SRIS CDR相同，在33 KHz至2 MHz范围内抑制能力强 |
| 平台级抖动权衡能力 | 显著，可在平台层面灵活分配数据和时钟抖动 | 无，抖动限值非常小 |
| 时钟在高速接收机中的使用 | 广泛使用 | 许多高速接收机设计不使用参考时钟 |
| 时钟抖动计算复杂度 | 直接（无需参考均衡器） | 复杂（需要参考接收机含CTLE和DFE，以及特定时域CDR定义） |
| 测量设备要求 | 标准示波器通道 | 高速示波器通道成本高昂 |

^[presentation-title-goes-here.md:14]

### 关键差异分析

**CDR抑制能力差异**：PCIe 2.0中普通时钟模型的CDR在33 KHz至2 MHz频段内对时钟抖动的抑制能力较弱，而PCIe 5.0的CDR（无论是普通时钟模型还是独立参考时钟独立展宽时钟模型SRIS）在此频段内具有更强的抑制能力。^[presentation-title-goes-here.md:14]

**计算复杂度提升**：在PCIe 5.0中，将时钟信号应用于数据抖动计算不再简单直接，因为需要考虑参考接收机中的连续时间时间均衡器（CTLE）和判决反馈均衡器（DFE），以及特定的时域CDR定义。^[presentation-title-goes-here.md:14]

## CEM双端口测试要求的变更

2020年3月，CEM工作组投票决定**取消5.0系统发射机要求的双端口要求**。这一决定基于以下考虑：^[presentation-title-goes-here.md:15]

- 工作组正在探索新的5.0系统参考时钟抖动合规测试方法
- 32 GT/s系统将使用与32 GT/saddon 卡相同的CDR和参考接收机均衡器算法进行测试
- **仅需2个示波器通道即可完成测试**，大幅降低了测试成本

^[presentation-title-goes-here.md:15]

## 实验设置

PCI-SIG进行的参考时钟抖动实验采用了以下测试配置：^[presentation-title-goes-here.md:30]

- **Gen5参考时钟评估板**（Gen5 Refclk Eval Board）
- **PCIe Gen5 Base Rx校准夹具Rev 3**（PCIe Gen5 Base Rx Calibration Fixtures (Rev 3)）
- **Tektronix实时示波器DPS77004SX**（Tektronix RT Scope (DPS77004SX)）
- **差分模式阻抗**（DMI）

^[presentation-title-goes-here.md:30]

## 实验结果

在CEM工作组中分享的参考时钟实验结果为新的5.0系统参考时钟抖动合规测试提供了指导：^[presentation-title-goes-here.md:31]

- Base规范路径仿真使用**250 fs参考时钟抖动**作为基准
- 从Base规范限值中额外增加**100 fs抖动**裕量
- 额外抖动的来源包括：
  - 串扰（Crosstalk）
  - 边沿展平效应（Edge flattening）——垂直噪声转换为抖动
- **所有测试场景下，抖动均小于250 fs**，包括30 dB信道（加噪声并启用扩展频谱时钟SSC）的情况
- 实验将使用最差情况参考时钟（150 fs）重复进行

^[presentation-title-goes-here.md:31]

## Tektronix PCIe 5.0参考时钟解决方案

Tektronix正在开发针对PCI Express 5.0的参考时钟抖动测试解决方案，预计于2020年第二/三季度发布：^[presentation-title-goes-here.md:32]

### 预期功能

- **全自动化解决方案**——通过TekExpress平台实现
- **高频抖动测量**——支持Gen1至Gen5
- **可选示波器噪声消除算法**
- **参考时钟直流规格和交流要求测量**
- **数据速率无关的参考时钟参数**

### 支持的示波器型号

- DPS77004SX
- DPS5002SX
- MSO64

^[presentation-title-goes-here.md:32]

## 技术要点

1. **抖动限值对比**：
   - PCIe 4.0（16 GT/s）：≤500 fs
   - PCIe 5.0（32 GT/s）：≤150 fs

2. **测试简化**：取消双端口要求后，32 GT/s系统测试仅需2个示波器通道即可完成

3. **测量可靠性**：即使在30 dB信道衰减条件下，增加噪声和启用SSC后，抖动仍可控制在250 fs以下

## 相关概念

- [[PCI Express 5.0]] — 本测量技术应用的核心传输标准
- [[突发错误预防与预编码]] — 32 GT/s速率下的另一项关键信号完整性技术
- [[链路均衡]] — 与参考时钟抖动测量密切相关的接收机技术
- [[连续时间均衡器]]（CTLE）— PCIe 5.0接收机中的关键组件
- [[判决反馈均衡器]]（DFE）— 影响抖动传播的接收机组件
- [[扩展频谱时钟]]（SSC）— 可能影响抖动测量的时钟调制技术
- [[时钟数据恢复]]（CDR）— 与参考时钟抖动测量直接相关的接收机功能

---

## 来源

- [PCI Express 5.0 Update: Keys to Addressing an Evolving Specification](presentation-title-goes-here.md)
