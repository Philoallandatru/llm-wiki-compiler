---
title: PCIe 5.0参考时钟抖动测量
summary: Refclk抖动限制从3.1ps RMS（PCIe 2.0）大幅收紧至0.15ps RMS，CDR模型与SRIS相同具有良好高频抑制，测试需使用参考接收机CTLE和DFE及特定时域CDR定义
sources:
  - presentation-title-goes-here.md
kind: concept
createdAt: "2026-05-24T04:26:56.859Z"
updatedAt: "2026-05-24T04:26:56.859Z"
tags:
  - PCIe
  - 参考时钟
  - 抖动测量
aliases:
  - pcie-50参考时钟抖动测量
confidence: 0.9
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "PCIe 5.0参考时钟抖动测量" (PCIe 5.0 Reference Clock Jitter Measurement) based on the provided source material.

Let me analyze the source material from the presentation:

From page 12 (PCI Express Reference Clock Jitter):
- PCIe 2.0 vs PCIe 5.0 comparison

From pages 13-14 (Dual Port Algorithm Overview and Comparison):
- PCIe 2.0: Common Clock model CDR has little rejection at 33 KHz and up to 2 MHz. Reference Clock jitter limit large (3.1 ps RMS for 5.0 Gt/s PCIe). Significant ability to trade off data and clock jitter at platform level. Significant savings from conservative assumptions of standalone clock test (min/max pll bandwidths and worst case phase mismatch). Application of reference clock to compute data jitter straightforward (no reference equalizer).
- PCIe 5.0: Common Clock model CDR same as SRIS CDR and has lot of rejection at 33 KHz and up to 2 MHz. Reference Clock jitter limit very small (.15 ps RMS). No ability to trade off at platform level. Many high speed receiver designs do not use reference clock. Application of clock to compute data jitter is not straightforward (reference receiver with CTLE and DFE and specific time domain CDR definition). High speed oscilloscope channels are expensive.

From page 15 (PCIe Gen 5 TX CEM):
- Dual Port Testing Removal
- CEM workgroup voted in March 2020 to remove the Dual Port Requirement for 5.0 System Tx requirement
- Workgroup exploring a new 5.0 System refclk jitter compliance test
- Systems at 32 GT/s will be tested with the same CDR & reference Rx EQ algorithms as 32 GT/s Add-in Cards
- Only 2 scope channels needed!

From page 29 (Reference Clock Phase Jitter Test):


- Stricter requirements and evolving testing approaches

From page 30 (Experiment Setup):
- Gen5 Refclk Eval Board
- PCIe Gen5 Base Rx Calibration Fixtures (Rev 3)
- Tektronix RT Scope (DPS77004SX)
- DMI

From page 31 (PCI SIG CEM Presentation):
- Results from Refclk experiment shared in the CEM workgroup to provide guidance for new 5.0 System refclk jitter compliance test
- Base spec pathfinding simulations used 250fs refclk jitter
- Extra 100fs jitter added from base spec limit
- Crosstalk
- Edge flattening
- Vertical noise to jitter conversion
- All cases showed less than 250fs jitter including 30dB channel with noise added and SSC enabled
- Experiment to be repeated with worse case refclk (150fs)

From page 32 (Tektronix - PCI Express 5.0 Refclk Solution):
- Fully Automated solution - TekExpress
- Expected Q2/Q3 2020
- Targeted Support: High Frequency Jitter Measurements (Gen1 to Gen5), Optional scope Noise removal algorithm, Refclk DC Specifications and AC Requirements, Data Rate Independent Refclk Parameters
- Real Time Scopes: DPS77004SX, DPS5002SX, MSO64
</think>

# PCIe 5.0 参考时钟抖动测量

## 概述

PCI Express 5.0 规范对参考时钟的要求变得更为严格，测试方法也发生了显著变化。相比前代规范，PCIe 5.0 将参考时钟高频抖动限值从 PCIe 4.0 的 ≤ 500 fs 收紧至 ≤ 150 fs，这对测量技术和测试设备提出了更高要求。 ^[presentation-title-goes-here.md:29-29]

## PCIe 2.0 与 PCIe 5.0 参考时钟差异

### PCIe 2.0 特性

PCIe 2.0 采用公共时钟（Common Clock）模型的时钟数据恢复（CDR），在 33 KHz 至 2 MHz 频段内对抖动的抑制能力较弱。该规范下参考时钟抖动限值相对宽松（5.0 GT/s 时为 3.1 ps RMS），在平台层面具有显著的时钟和数据抖动权衡能力。此外，从独立时钟测试的保守假设（最小/最大 PLL 带宽及最坏情况相位偏差）中可获得显著节省。将参考时钟应用于计算数据抖动的过程较为直接，无需参考均衡器。 ^[presentation-title-goes-here.md:14-14]

### PCIe 5.0 特性

PCIe 5.0 的公共时钟模型 CDR 与 SRIS（分离参考时钟独立展频）CDR 相同，在 33 KHz 至 2 MHz 频段内对抖动具有较强的抑制能力。参考时钟抖动限值非常严格，仅为 0.15 ps RMS，在平台层面不存在抖动权衡的余地。此外，许多高速接收端设计不再使用参考时钟，将时钟应用于计算数据抖动的过程也不够直接，需要考虑参考接收端的 CTLE（连续时间线性均衡器）、DFE（判决反馈均衡器）以及特定时域 CDR 定义。高速示波器通道价格昂贵也是一项重要挑战。 ^[presentation-title-goes-here.md:14-14]

## 双端口测试移除

CEM 工作组于 2020 年 3 月投票决定移除 PCIe 5.0 系统发送端要求的双端口（Dual Port）测试要求。工作组正在探索一种新的 5.0 系统参考时钟抖动合规性测试方法。在 32 GT/s 速率下，系统将使用与 32 GT/s 附加卡相同的 CDR 和参考接收端均衡器算法进行测试。这意味着测试仅需 **2 个示波器通道**即可完成，显著降低了测试复杂度。 ^[presentation-title-goes-here.md:15-15]

## 实验设置

典型的 PCIe 5.0 参考时钟抖动测量实验设置包括以下设备： ^[presentation-title-goes-here.md:30-30]

- **Gen5 参考时钟评估板**（Gen5 Refclk Eval Board）
- **PCIe Gen5 Base Rx 校准夹具 Rev 3**（PCIe Gen5 Base Rx Calibration Fixtures Rev 3）
- **泰克实时示波器 DPS77004SX**（Tektronix RT Scope DPS77004SX）
- **DMI（差分模式阻抗）测量设备**

## 实验结果与发现

CEM 工作组分享的参考时钟实验结果为新的 5.0 系统参考时钟抖动合规性测试提供了指导： ^[presentation-title-goes-here.md:31-31]

### 基线规格路径仿真

- 路径仿真使用 250 fs 参考时钟抖动作为基准
- 额外添加 100 fs 抖动（来自基线规格限值）

### 干扰因素

- **串扰（Crosstalk）**：信号线之间的干扰
- **边缘展平（Edge Flattening）**：垂直噪声到抖动的转换效应

### 结论

所有测试场景均显示抖动小于 250 fs，包括在 30 dB 信道、添加噪声以及启用 SSC（展频时钟）的情况下。该实验后续计划使用更差情况的参考时钟（150 fs）进行重复测试。 ^[presentation-title-goes-here.md:31-31]

## 测试解决方案

### Tektronix 解决方案

泰克公司正在开发针对 PCI Express 5.0 的完全自动化参考时钟抖动测量解决方案： ^[presentation-title-goes-here.md:32-32]

- **软件平台**：TekExpress（预期 Q2/Q3 2020 发布）
- **目标支持功能**：
  - 高频抖动测量（Gen1 至 Gen5）
  - 可选示波器噪声消除算法
  - 参考时钟直流规格和交流要求
  - 与数据速率无关的参考时钟参数
- **支持的实时示波器型号**：
  - DPS77004SX
  - DPS5002SX
  - MSO64

### 校准要点

32 GT/s 接收端校准与 16 GT/s 的主要区别在于：32 GT/s 的校准涉及可变 ISI（符号间干扰），信道损耗范围为 34 至 37 dB，调节旋钮包括幅度、Sj（随机抖动）和 DMI（差分模式阻抗），测试夹具采用带 MMPX 同轴连接器的 Base Rev3 规格。 ^[presentation-title-goes-here.md:21-21]

## 测试注意事项

### 信道选择

- Gen4 选择 27 至 30 dB 之间的信道
- Gen5 选择 34 至 37 dB 之间的信道
- 选择能够以最优 CTLE 获得最大眼高的预设值
- Gen5 的 CTLE 步进为 1 dB，Gen4 为 1/4 dB ^[presentation-title-goes-here.md:23-23]

### 探头点定义

- TP1 为信号发生器输出端
- TP3 为第一根同轴电缆之后的测量点
- 在 16 GT/s 时，TP1 与 TP3 之间的电缆被视为校准信道的一部分
- 在 32 GT/s 时，电缆被视为发生器的一部分，不计入信道损耗 ^[presentation-title-goes-here.md:23-23]

### 平局决胜规则

- Gen4：首选使 EW（眼宽）最接近目标的 Sj/DMI/Swing 组合；次选 Sj 最接近标称值的组合
- Gen5：首选信道损耗最高的组合；次选最接近目标 EH（眼高）的组合 ^[presentation-title-goes-here.md:23-23]

## 相关概念

- [[PCIe 4.0到5.0基础规范变化]] — PCIe 4.0 与 5.0 规范对比
- [[PCIe 物理层]] — 物理层信号与时钟架构
- [[链路均衡]] — 链路训练与均衡机制
- [[参考时钟]] — PCIe 时钟架构类型（CC/SRIS）
- [[串扰]] — 信号完整性干扰因素

## 参考文献

^[presentation-title-goes-here.md]

- PCI-SIG, "PCI Express 5.0 Update: Keys to Addressing an Evolving Specification", June 9, 2020, Slides 12-15, 29-32
