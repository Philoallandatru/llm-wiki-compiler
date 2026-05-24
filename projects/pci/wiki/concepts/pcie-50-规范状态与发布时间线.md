---
title: PCIe 5.0 规范状态与发布时间线
summary: PCIe 5.0 Base规范于2019年Q2发布Rev 1.0，CEM规范在2020年处于0.7版本开发阶段，PHY测试规范为0.3版本
sources:
  - presentation-title-goes-here.md
kind: concept
createdAt: "2026-05-24T04:25:47.479Z"
updatedAt: "2026-05-24T04:25:47.479Z"
tags:
  - PCIe
  - 规范
  - 发布时间线
aliases:
  - pcie-50-规范状态与发布时间线
  - P5规
confidence: 0.95
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "PCIe 5.0 规范状态与发布时间线" (PCIe 5.0 Specification Status and Release Timeline) based on the provided source material.

Looking at the source material, this is a presentation from PCI-SIG dated 6/9/2020 titled "PCI Express 5.0 Update: Keys to Addressing an Evolving Specification". Let me extract the key information:

1. **Slide 3** - PCIe 5.0 Specification Status (4/8/2020 snapshot):
   - PCIe 5.0 Base Specification – Rev 1.0 Released (Q2 2019)
   - PCIe 5.0 CEM Specification – Rev 0.7 under development
   - PCIe 5.0 PHY Test Specification – Rev 0.3 workgroup approved
   - PCIe 4.0 – All Specifications at Rev 1.0
   - Integrators List testing began August 2019

2. **Slide 5** - PCIe 4.0 to 5.0 Base Specification Changes:
   - Data Rate: 16 GT/s → 32 GT/s
   - Channel Loss (Rx Test Range): - (27 to 30) dB @ 8GHz → - (34 to 37) dB @ 16GHz
   - Add-in Card Loss: 8dB @ 8Ghz → 9.5dB @ 16GHz
   - Reference CTLE: 2 Poles; 1 Zero; DC Gain Range (-6 to -12) dB → 4 Poles; 2 Zero; DC Gain Range (-5 to -12) dB
   - Reference DFE: 2-Taps → 3-Taps
   - Eye Width (Rx Test): 18.75 ps → 9.375 ps
   - Eye Height (Rx Test): 15 mV → 15 mV (unchanged)
   - Rx Jitter Tolerance: Separate curves for CC & SRIS at 16GT/s → One curve for CC & SRIS at 16GT/s & 32GT/s
   - Lane Margining: Required for timing only → Required for timing and voltage
   - Refclk High Freq Jitter Limits: <= 500 fs → <= 150 fs

3. **Slide 7** - Link Equalization Bypass feature allows training directly from 2.5 GT/s to 32 GT/s, with traditional training through 2.5GT/s > 8GT/s > 16GT/s > 32GT/s remaining supported for backwards compatibility.

4. **Slide 8** - Burst Error Prevention uses precoding to mitigate 101010 pattern errors, where receivers can request precoding from transmitters at data rates >= 32 GT/s through Training Sets.

5. **Slide 9** - Updated Connector & Edge Finger Layout mandates SMT-only CEM connectors with optimized ground via placements at pad edges, reduced pad dimensions, and a new 1.27mm ground plane underneath the edge fingers.

6. **Slide 15** - PCIe Gen 5 TX CEM specification removes the Dual Port requirement from the 5.0 System Tx specification, with the CEM workgroup voting in March 2020 to adopt this change.

7. **Slide 17** - Tektronix Gen5 Tx Solution Status shows the PCI Express 5.0 Base Tx release already available since Q1 2020, while the CEM Tx version targets Q2 2020 release, though Gen5 CEM compliance fixtures won't be broadly available from PCI-SIG until Q3/Q4 2020.

8. **Slide 27** - Gen5 Base Calibration (11/5/2019) documents the calibration results for Gen5 Base Rx calibration fixtures.

9. **Slide 32** - Tektronix's PCI Express 5.0 Refclk Solution remains under development with an expected Q2/Q3 2020 release, aiming to provide automated testing through TekExpress with support for high frequency jitter measurements across Gen1 through Gen5.
</think>

# PCIe 5.0 规范状态与发布时间线

## 概述

PCI Express 5.0（简称 PCIe 5.0）是 PCI-SIG 推出的下一代高速串行计算机扩展总线标准，其数据传输速率相比 PCIe 4.0 提升了一倍，达到 32 GT/s。本文基于 2020 年 6 月 9 日 PCI-SIG 发布的《PCI Express 5.0 Update: Keys to Addressing an Evolving Specification》技术演示文稿，梳理 PCIe 5.0 各规范的发布状态与关键时间节点。 ^[presentation-title-goes-here.md]

## 规范发布状态概览

截至 2020 年 4 月 8 日，PCIe 5.0 规范体系各组件处于不同的开发阶段： ^[presentation-title-goes-here.md:3-3]

| 规范名称 | 状态 | 备注 |
|----------|------|------|
| **PCIe 5.0 Base Specification（基础规范）** | Rev 1.0 已发布（2019 年第二季度） | 描述芯片层面所有层级的行为 |
| **PCIe 5.0 CEM Specification（CEM 规范）** | Rev 0.7 开发中 | 定义系统和插卡级别规范 |
| **PCIe 5.0 PHY Test Specification（物理层测试规范）** | Rev 0.3 工作组已批准 | 描述 Tx、Rx LEQ 及 PLL 带宽的电气合规测试 |
| **PCIe 4.0 各规范** | 全部达到 Rev 1.0 | 集成商列表测试于 2019 年 8 月启动 |

## 核心规格演进

### 与 PCIe 4.0 的主要差异

PCIe 5.0 相比 PCIe 4.0 在物理层规格上进行了多项重大升级： ^[presentation-title-goes-here.md:4-4]

| 参数 | PCIe 4.0 | PCIe 5.0 |
|------|----------|----------|
| **数据传输速率** | 16 GT/s | 32 GT/s |
| **通道损耗（Rx 测试范围）** | -27 至 -30 dB @ 8 GHz | -34 至 -37 dB @ 16 GHz |
| **插卡损耗** | 8 dB @ 8 GHz | 9.5 dB @ 16 GHz |
| **参考 CTLE** | 2极点；1零点；直流增益范围 -6 至 -12 dB | 4极点；2零点；直流增益范围 -5 至 -12 dB |
| **参考 DFE** | 2-Tap | 3-Tap |
| **眼宽（Rx 测试）** | 18.75 ps | 9.375 ps |
| **眼高（Rx 测试）** | 15 mV | 15 mV（保持不变） |
| **Rx 抖动容限** | CC 和 SRIS 在 16 GT/s 下分离曲线 | CC 和 SRIS 在 16 GT/s 和 32 GT/s 下统一曲线 |
| **信道裕量（Lane Margining）** | 仅时序要求 | 时序和电压均需要求 |
| **参考时钟高频抖动限制** | ≤ 500 fs | ≤ 150 fs |

## 关键新特性

### 链路均衡旁路

PCIe 5.0 引入了可选的链路均衡训练旁路功能，支持直接从 2.5 GT/s 训练至 32 GT/s。该特性可节省约 200 毫秒的链路建立时间。在 32 GT/s 速率下，如果链路上的所有组件均支持该特性，还可以选择完全跳过链路均衡过程。传统训练流程（2.5 GT/s → 8 GT/s → 16 GT/s → 32 GT/s）仍然被支持。 ^[presentation-title-goes-here.md:6-6]

### 突发错误预防

在 32 GT/s 速率下，由于 DFE 抽头比率的特性，突发错误（burst errors）更容易发生。当出现 101010 模式时可能发生错误传播。通过预编码（precoding）机制可以限制翻转模式的产生。在 32 GT/s 及以上数据速率时，接收端可通过训练序列请求发射端启用预编码功能。 ^[presentation-title-goes-here.md:7-7]

### 连接器和边缘手指布局更新

PCIe 5.0 CEM 规范对连接器和插卡边缘设计进行了优化： ^[presentation-title-goes-here.md:8-8]

- 仅允许使用表面贴装技术（SMT）的 CEM 连接器
- 在焊盘两侧添加接地过孔（ground vias）
- 缩小焊盘尺寸
- 减小边缘手指尺寸
- 边缘手指下方增加接地平面
- 间距规格为 1.27 mm（0.05 英寸）

## 测试与校准进度

### 发射端测试

2020 年 3 月，CEM 工作组投票决定移除 5.0 系统发射端的双端口（Dual Port）测试要求，改为探索新的 5.0 系统参考时钟抖动合规测试方法。32 GT/s 速率下的系统将使用与 32 GT/s 插卡相同的 CDR 和参考 Rx EQ 算法进行测试，仅需 2 个示波器通道即可完成验证。 ^[presentation-title-goes-here.md:14-14]

**Tektronix PCIe 5.0 发射端测试方案：** ^[presentation-title-goes-here.md:16-16]

- **PCI Express 5.0 Base Tx**：2020 年第一季度已发布
- **PCI Express 5.0 CEM Tx**：目标 2020 年第二季度发布
- Gen5 CEM 合规测试夹具预计 2020 年第三季度至第四季度才能广泛供应

### 接收端校准

32 GT/s 接收端校准的关键参数：目标眼高 15 mV、目标眼宽 0.3 UI（在 E-12 BER 条件下）。校准测试点选择在 27 至 30 dB（Gen4）和 34 至 37 dB（Gen5）之间的通道中进行。 ^[presentation-title-goes-here.md:19-19]

**32 GT/s Rx 校准特性：**

- 变量 ISI 范围：-34 至 -37 dB
- 测试夹具：Base Rev2 正在开发中（采用 MMPX 同轴连接器）
- 校准工具：Seasim（Base）和 SigTest（使用眼高外推法）

2019 年 11 月 5 日完成的 Gen5 基础校准显示，最终眼宽为 9.5 ps，最终眼高为 16.2 mV。 ^[presentation-title-goes-here.md:21-21]

### 参考时钟抖动测试

PCIe 5.0 的参考时钟要求更加严格，测试方法也发生了重大变化。Tektronix 正在开发全自动化的参考时钟抖动测量解决方案，预计 2020 年第二季度至第三季度发布。该方案将支持 Gen1 至 Gen5 的高频抖动测量，并提供可选的示波器噪声消除算法。 ^[presentation-title-goes-here.md:31-31]

## 相关概念

- [[PCI Express]]
- [[PCIe 4.0 规范]]
- [[PCIe 6.0 规范]]
- [[链路均衡]]
- [[信号完整性]]
- [[CEM 规范]]

## 参考文献

^[presentation-title-goes-here.md]

- PCI-SIG, *PCI Express 5.0 Update: Keys to Addressing an Evolving Specification*, June 9, 2020
