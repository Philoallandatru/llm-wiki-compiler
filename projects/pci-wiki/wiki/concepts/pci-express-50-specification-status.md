---
title: PCI Express 5.0 Specification Status
summary: PCIe 5.0 Base spec (Rev 1.0) released Q2 2019; CEM spec Rev 0.7 under development; PHY Test spec Rev 0.3 workgroup approved
sources:
  - presentation-title-goes-here.md
kind: concept
createdAt: "2026-05-24T07:38:49.746Z"
updatedAt: "2026-05-24T07:38:49.746Z"
tags:
  - specifications
  - pcie
  - standards
aliases:
  - pci-express-50-specification-status
  - PE5SS
confidence: 0.95
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "PCI Express 5.0 Specification Status" based on the provided source material. Let me analyze the source document carefully.

The source document is a presentation titled "PCI Express 5.0 Update: Keys to Addressing an Evolving Specification" dated 6/9/2020. It covers several topics:

1. PCI Express 5.0 Specification Status (Section 3)
2. PCIe 5.0 to 5.0 Base Specification Changes (Section 4)
3. PCIe 5.0 Channel Solution Space (Section 5)
4. [[link-equalization-bypass|Link Equalization Bypass]] (Section 6)
5. Burst Error Prevention (Section 7)
6. Updated Connector & Edge Finger Layout (Section 8)
7. PCIe 5.0 CEM Tx (Section 9-10)
8. PCIe Reference Clock Jitter (Section 11-14)
9. PCIe Gen 5 TX CEM (Section 15-16)
10. Tektronix Gen5 Tx Solution Status (Section 17-18)
11. PCI Express 5.0 32GT/s Rx PG Calibration & Test (Section 19-27)
12. PCI Express 5.0 Refclk Jitter Measurements (Section 28-32)

Key facts to extract:

1. **Specification Snap Shot (as of 4/8/2020)**:
   - PCIe 5.0 Base Specification – Rev 1.0 Released (Q2 2019) - Describes chip-level behavior on all levels of the stack
   - PCIe 5.0 CEM Specification – Rev 0.7 under development - Card electro-mechanical (CEM) defines system and Add-in Card level
   - PCIe 5.0 PHY Test Specification – Rev 0.3 workgroup approved - Describes electrical compliance tests for Tx, Rx LEQ, & PLL Bandwidth
   - PCIe 4.0 – All Specifications at Rev 1.0 with Integrators List testing starting August 2019
   
2. **Comparing PCIe 4.0 to 5.0**:
   The specification doubles the data rate to 32 GT/s while significantly increasing channel loss tolerance from -30 dB to -37 dB at higher frequencies. Add-in card loss increases slightly to 9.5dB, and the reference CTLE evolves from 2 poles with 1 zero to 4 poles with 2 zeros. The DFE implementation expands from 2-taps to 3-taps, and the eye diagram narrows considerably at the receiver test point.

Eye width tightens from 18.75 ps to 9.375 ps, though eye height remains constant at 15 mV. Rx jitter tolerance curves consolidate into a single characterization for both CC and SRIS operating at 16GT/s and 32GT/s. Lane margining requirements now apply to both timing and voltage domains, and reference clock high frequency jitter limits drop dramatically from 500 fs to 150 fs.

3. **Link Equalization Bypass**: This optional feature allows direct training from 2.5 GT/s to 32 GT/s, eliminating the need for intermediate data rates in the training sequence.

4. **Burst Error Prevention**: At 32GT/s, burst errors become more likely due to DFE tap ratios. Precoding helps limit toggle pattern occurrences, and receivers can request precoding from their transmitter at data rates of 32 GT/s or higher through Training Sets.

5. **Updated Connector & Edge Finger Layout**: Only SMT CEM connectors are permitted, with ground vias positioned at both sides of each pad.

6. **PCIe Reference Clock Jitter**: The jitter limit has been significantly tightened to 0.15 ps RMS.

7. **Tektronix Gen5 Tx Solution**: The Base Tx specification was released in Q1 2020, while the CEM Tx version is targeted for Q2 2020, though compliance fixtures won't be widely accessible until Q3/Q4 2020. 32GT/s Rx Calibration utilizes variable ISI ranging from 34 to 37 dB with the same amplitude, SJ, and DMI adjustment knobs as 16GT/s, though the Base Rev2 fixtures are still under development using MMPX coaxial connectors. Refclk Jitter measurements have become substantially more stringent with the Tektronix solution expected to be ready by Q2/Q3 2020, providing automated jitter measurements across Gen1 through Gen5 on Real Time Scopes including the DPS77004SX, DPS5002SX, and MSO64. I should reference related topics like [[PCI Express]], [[PCI-SIG]], [[PCI Express 4.0]], [[信号完整性]], and [[通道损耗]] where relevant, then structure the content with an overview of the specification's current status.
</think>

# PCI Express 5.0 Specification Status

## Overview

PCI Express 5.0（简称PCIe 5.0）是PCI Express总线标准的下一代版本，数据传输速率较PCIe 4.0翻倍，达到32 GT/s。根据2020年4月8日的规范快照，PCIe 5.0 Base Specification已发布正式版，而CEM（Card Electro-Mechanical）规范和PHY测试规范仍在开发中。^[presentation-title-goes-here.md]

## Specification Status

截至2020年4月8日，PCI Express 5.0相关规范的开发状态如下：^[presentation-title-goes-here.md]

### Base Specification

PCIe 5.0 Base Specification Version 1.0已于2019年第二季度正式发布。该规范描述了芯片级别在全栈各层次上的行为规范，为芯片设计提供了完整的技术参考。^[presentation-title-goes-here.md]

### CEM Specification

PCIe 5.0 CEM Specification（卡片机电规范）Version 0.7正在开发中。CEM规范定义了系统和Add-in Card级别的规范要求，包括连接器布局优化、边缘手指布局优化等内容。^[presentation-title-goes-here.md]

### PHY Test Specification

PCIe 5.0 PHY Test Specification Version 0.3已获得工作组批准。该规范描述了发送端（Tx）、接收端均衡（Rx LEQ）以及锁相环带宽的电气合规测试要求。^[presentation-title-goes-here.md]

### PCIe 4.0 Reference

PCIe 4.0所有规范已更新至1.0版本，Integrators List测试于2019年8月启动。^[presentation-title-goes-here.md]

## Base Specification技术变化

PCIe 5.0与PCIe 4.0相比，Base Specification包含多项关键技术的升级与改进。

| 技术参数 | PCIe 4.0 | PCIe 5.0 |
|----------|----------|----------|
| 数据速率 | 16 GT/s | 32 GT/s |
| 通道损耗（Rx测试范围）@8GHz | -27至-30 dB | -34至-37 dB @16GHz |
| Add-in Card损耗 | 8dB @8GHz | 9.5dB @16GHz |
| 参考CTLE | 2极点；1零点；DC增益范围(-6至-12)dB | 4极点；2零点；DC增益范围(-5至-12)dB |
| 参考DFE | 2抽头 | 3抽头 |
| 眼宽（Rx测试） | 18.75 ps | 9.375 ps |
| 眼高（Rx测试） | 15 mV | 15 mV |
| Rx抖动容忍度 | 16GT/s下CC与SRIS分离曲线 | 16GT/s与32GT/s下CC与SRIS单一曲线 |
| 通道裕度 | 仅时序要求 | 时序和电压均要求 |
| Refclk高频抖动限制 | ≤500 fs | ≤150 fs |

^[presentation-title-goes-here.md]

## 链路均衡旁路

PCIe 5.0引入了可选的链路均衡（Link Equalization）旁路功能，允许直接从2.5 GT/s训练至32 GT/s，跳过中间速率的均衡训练过程。^[presentation-title-goes-here.md]

### 工作原理

传统训练流程遵循2.5GT/s → 8GT/s → 16GT/s → 32GT/s的渐进路径。如果较低速率无法完成链路训练，则该速率无法被利用。^[presentation-title-goes-here.md]

旁路训练则允许从2.5 GT/s直接跳至32 GT/s进行训练。如果链路上的所有组件均支持此功能，甚至可以完全跳过链路均衡过程。根据评估，在32 GT/s速率下可实现约200毫秒的时间节省。^[presentation-title-goes-here.md]

## 突发错误预防

由于32 GT/s速率下DFE抽头比率的特性，突发错误（Burst Errors）发生的概率增加。当出现101010模式时，可能导致错误传播。^[presentation-title-goes-here.md]

### 预编码机制

预编码（Precoding）技术用于限制翻转模式（Toggle Pattern）的发生频率。接收端可以在数据速率≥32 GT/s时通过训练集（Training Sets）向发送端请求启用预编码功能。^[presentation-title-goes-here.md]

## 连接器和边缘手指布局更新

为适应32 GT/s高速信号传输，CEM规范对连接器和边缘手指布局进行了多项优化。^[presentation-title-goes-here.md]

### 连接器规范

仅允许使用SMT（表面贴装技术）CEM连接器，并进行了布局优化：在焊盘两侧设置接地过孔（Gnd vias），缩小焊盘尺寸。^[presentation-title-goes-here.md]

### 边缘手指布局

优化了边缘手指（Edge Finger）布局，减小了边缘手指尺寸，并在边缘手指下方增加接地平面（Ground plane）。标准间距为1.27mm（0.05英寸）。^[presentation-title-goes-here.md]

## PCIe参考时钟抖动测试

PCIe 5.0的参考时钟（Reference Clock）抖动要求变得更加严格，测试方法也发生了重大变化。^[presentation-title-goes-here.md]

### 技术要求变化

PCIe 2.0时代，共模时钟模型（Common Clock）CDR在33 KHz至2 MHz频率范围内的抖动抑制能力较弱，参考时钟抖动限制较为宽松（5.0 GT/s PCIe为3.1 ps RMS），在平台级别存在较大的数据与时钟抖动权衡空间。^[presentation-title-goes-here.md]

PCIe 5.0时代，共模时钟模型CDR与SRIS CDR类似，在33 KHz至2 MHz频率范围内具有较强的抖动抑制能力，参考时钟抖动限制极为严格（0.15 ps RMS），平台级别无法进行抖动权衡。许多高速接收端设计不再使用参考时钟，参考时钟应用于计算数据抖动的过程也更加复杂。^[presentation-title-goes-here.md]

### 双端口测试移除

2020年3月，CEM工作组投票决定移除5.0系统发送端要求的双端口（Dual Port）测试需求。工作组正在探索新的5.0系统参考时钟抖动合规测试方案。未来32 GT/s系统将使用与32 GT/s Add-in Card相同的CDR和参考Rx均衡算法进行测试，仅需2个示波器通道即可完成。^[presentation-title-goes-here.md]

## 32 GT/s接收端校准与测试

### 接收端校准演进

PCIe 5.0接收端校准相比前代产品有明显演进。8 GT/s接收端校准采用固定通道损耗（嵌入SigTest），旋钮参数为Rj/DMI，但常导致不切实际的Rj值。16 GT/s接收端校准则改用可变ISI（27至30dB），旋钮参数为Amplitude/Sj/DMI并定义了允许范围。^[presentation-title-goes-here.md]

32 GT/s接收端校准采用可变ISI（34至37dB），旋钮参数与16 GT/s相同。Base Rev2校准夹具（MMPX同轴连接器）正在开发中。^[presentation-title-goes-here.md]

### 通道选择要求

测试时需选择27至30dB（Gen4）或34至37dB（Gen5）之间的通道。预设值应选择可获得最大眼宽（EA）且具有最优CTLE的预设值。16 GT/s时CTLE以1/4dB步进变化，32 GT/s时以1dB步进变化。^[presentation-title-goes-here.md]

## 相关概念

- [[PCI Express]] — PCIe 5.0所属的高速扩展总线技术标准
- [[PCI-SIG]] — 制定和维护PCI Express规范的组织机构
- [[PCI Express 4.0]] — PCIe 5.0的前代版本，数据速率为16 GT/s
- [[信号完整性]] — 涉及高速信号传输质量保证的技术领域
- [[通道损耗]] — 影响高速信号传输衰减的关键因素
- [[均衡技术]] (Equalization) — 用于补偿信道损耗的信号处理技术
- [[眼图测试]] (Eye Diagram Testing) — 评估高速信号质量的测试方法

---

## Sources

- [PCI Express 5.0 Update: Keys to Addressing an Evolving Specification (Presentation, 2020-06-09)](presentation-title-goes-here.md)
