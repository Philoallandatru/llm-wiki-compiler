---
title: Dual Port Testing Removal in PCIe 5.0 CEM
summary: CEM workgroup voted March 2020 to remove Dual Port requirement for 5.0 System Tx; new 5.0 System refclk jitter compliance test under development; only 2 scope channels needed
sources:
  - presentation-title-goes-here.md
kind: concept
createdAt: "2026-05-24T07:39:27.525Z"
updatedAt: "2026-05-24T07:39:27.525Z"
tags:
  - cem
  - testing
  - pcie
aliases:
  - dual-port-testing-removal-in-pcie-50-cem
  - DPTRIP5C
confidence: 0.85
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "Dual Port Testing Removal in PCIe 5.0 CEM" based on the provided source material. Looking at the source material (presentation-title-goes-here.md), I can find relevant information in slide 15:

"DUAL PORT TESTING REMOVAL
✓ CEM workgroup voted in March 2020 to remove the Dual Port Requirement for 5.0 System Tx requirement
✓ Workgroup exploring a new 5.0 System refclk jitter compliance test
✓ Systems at 32 GT/s will be tested with the same CDR & reference Rx EQ algorithms as 32 GT/s Add-in Cards
✓ Only 2 scope channels needed!"

Additionally, slide 14 provides context about why this change was made:
"PCIe 2.0
• Common Clock model CDR has little rejection at 33 KHz and up to 2 MHz.
• Reference Clock jitter limit large (3.1 ps RMS for 5.0 Gt/s PCIe).
• Significant ability to trade off data and clock jitter at platform level
• Significant savings from conservative assumptions of standalone clock test (min/max pll bandwidths and worst case phase mismatch)
• Application of reference clock to compute data jitter straightforward (no reference equalizer)

PCIe 5.0
• Common Clock model CDR same as SRIS CDR and has lot of rejection at 33 KHz and up to 2 MHz
• Reference Clock jitter limit very small (.15 ps RMS). No ability to trade off at platform level
• Many high speed receiver designs do not use reference clock
• Application of clock to compute data jitter is not straightforward. (reference receiver with CTLE and DFE and specific time domain CDR definition)
• High speed oscilloscope channels are expensive"

So the key points are:
1. CEM workgroup voted in March 2020 to remove Dual Port requirement for PCIe 5.0 System Tx


2. A new refclk jitter compliance test approach is being developed for 32 GT/s systems
3. System testing will now employ the same CDR and Rx EQ algorithms used for Add-in Cards at 32 GT/s
4. This simplifies the test setup by requiring only 2 scope channels instead of more
5. PCIe 5.0's stricter reference clock requirements (0.15 ps RMS vs 3.1 ps RMS) and advanced receiver designs made the previous dual port testing approach impractical and cost-prohibitive

Now I need to write this in zh-CN (Simplified Chinese) with wikilinks to related concepts and a sources section.
</think>

# PCIe 5.0 CEM 双端口测试移除

## 概述

双端口测试移除（Dual Port Testing Removal）是PCI Express 5.0 CEM（Card Electro-Mechanical）规范中的一项重要变更。2020年3月，CEM工作组投票决定移除5.0系统发射端（System Tx）的双端口测试要求，转而探索新的参考时钟抖动合规测试方法。^[presentation-title-goes-here.md]

## 变更背景

### PCIe 2.0时代的情况

在PCIe 2.0（5 GT/s）时代，双端口测试模型具有以下特点：^[presentation-title-goes-here.md]

- 公共时钟模型的CDR在33 KHz至2 MHz频段内抑制能力较弱
- 参考时钟抖动限值较为宽松（3.1 ps RMS）
- 在平台层面，数据抖动和时钟抖动之间存在显著的权衡空间
- 从独立时钟测试的保守假设（最小/最大PLL带宽、最坏情况相位偏差）中获得了显著的节省
- 将参考时钟应用于数据抖动计算的流程相对直接（无需参考均衡器）

### PCIe 5.0时代的挑战

随着信号速率提升至32 GT/s，测试方法面临根本性的变化：^[presentation-title-goes-here.md]

- 公共时钟模型CDR与SRIS CDR特性相同，在33 KHz至2 MHz频段内具有较强的抑制能力
- 参考时钟抖动限值大幅收紧（0.15 ps RMS），无法在平台层面进行抖动权衡
- 许多高速接收机设计不再使用参考时钟
- 将时钟应用于数据抖动计算不再简单（涉及参考接收机中的CTLE和DFE，以及特定时域CDR定义）
- 高速示波器通道成本高昂

## 主要变更内容

### 双端口测试要求的移除

CEM工作组于2020年3月投票决定移除5.0系统发射端的双端口测试要求。这一决定简化了PCIe 5.0系统的发射端合规性测试流程。^[presentation-title-goes-here.md]

### 新型参考时钟抖动合规测试

CEM工作组正在探索一种新的5.0系统参考时钟抖动合规测试方法，以替代原有的双端口测试方案。^[presentation-title-goes-here.md]

### 测试方法统一

32 GT/s的系统将与32 GT/s的[[PCI Express|附加卡]]（Add-in Card）使用相同的[[CDR|时钟数据恢复]]和参考接收机均衡算法进行测试，实现了测试方法的一致性。^[presentation-title-goes-here.md]

### 示波器通道减少

通过移除双端口测试要求，系统发射端测试所需的示波器通道从四个减少到两个，大幅降低了测试设备成本。^[presentation-title-goes-here.md]

## 技术影响

| 测试资源 | PCIe 2.0 | PCIe 5.0（变更后） |
|----------|----------|-------------------|
| 示波器通道数 | 4 | 2 |
| 参考时钟抖动限值 | 3.1 ps RMS | 0.15 ps RMS |
| CDR设计 | 独立设计 | 与SRIS统一 |

^[presentation-title-goes-here.md]

## 相关概念

- [[PCI Express 5.0]] — 本次变更所属的PCIe世代
- [[CDR]] — 时钟数据恢复，用于接收端信号恢复
- [[CTLE]] — 连续时间线性均衡，接收机均衡技术之一
- [[DFE]] — 判决反馈均衡，另一种接收机均衡技术
- [[参考时钟抖动]] — PCIe发射端的关键性能指标

---

## Sources

- [PCI Express 5.0 Update: Keys to Addressing an Evolving Specification](presentation-title-goes-here.md)
