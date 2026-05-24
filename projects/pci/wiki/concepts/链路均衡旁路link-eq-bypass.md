---
title: 链路均衡旁路（Link EQ Bypass）
summary: PCIe 5.0可选功能，允许从2.5GT/s直接训练到32GT/s，绕过中间速率，节省约200ms的L0时间，若链路所有组件支持还可完全跳过链路均衡
sources:
  - presentation-title-goes-here.md
kind: concept
createdAt: "2026-05-24T04:26:13.759Z"
updatedAt: "2026-05-24T04:26:13.759Z"
tags:
  - PCIe
  - 链路训练
  - 性能优化
aliases:
  - 链路均衡旁路link-eq-bypass
  - 链EB
confidence: 0.9
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "链路均衡旁路（Link EQ Bypass）". Let me analyze the source material to extract relevant information.

From the provided source material (presentation from PCI-SIG Developers Conference 2020):

Key facts about Link EQ Bypass (from slide 7):
1. PCIe 5.0 optional Link EQ Training Bypass
2. Train directly from 2.5 GT/s to 32 GT/s
3. Traditional Training still Supported - 2.5GT/s > 8GT/s > 16GT/s > 32GT/s
4. If lower rates don't perform link training they cannot be utilized
5. ~200ms time savings to L0 at 32GT/s
6. Option to skip Link EQ entirely if all components in the link support

Let me also check if there are other relevant facts in the document about related concepts that could be cross-referenced.

From slide 5 (PCIe 4.0 to 5.0 Base Specification Changes):
- Data Rate: 16 GT/s → 32 GT/s
- Channel Loss (Rx Test Range): - (27 to 30) dB @ 8GHz → - (34 to 37) dB @ 16GHz
- Reference CTLE changes
- Reference DFE: 2-Taps → 3-Taps
- Eye Width (Rx Test): 18.75 ps → 9.375 ps

From slide 8 (Burst Error Prevention):
- Burst Errors are more likely at 32GT/s given the DFE tap ratios
- 101010 patterns can cause error propagation
- Precoding limits toggle pattern occurrences
- Receivers may request precoding from its transmitter at data rates >= 32 GT/s
- Enabled through Training Sets

This is related content that could be mentioned to provide context.

Now let me write a clear, well-structured wiki page in zh-CN with proper citations and related concepts at the end.


I need to organize the information hierarchically with an overview section explaining the feature, then detailed description of how it works, the performance advantages it delivers, the prerequisites for use, and relevant standards. I'll add cross-references to related PCIe specifications and include the source attribution at the end.
</think>

# 链路均衡旁路（Link EQ Bypass）

## 概述

链路均衡旁路（Link EQ Bypass）是 PCI Express 5.0 规范中的一个可选特性，允许链路训练过程直接从 2.5 GT/s 的初始速率跳过中间速率直接到达 32 GT/s 的目标速率。这一特性旨在减少高速链路的建立时间，提升系统启动和恢复效率。^[presentation-title-goes-here.md]

## 工作原理

### 传统链路训练流程

在传统的 PCI Express 链路均衡过程中，链路需要按序经历以下速率阶段：^[presentation-title-goes-here.md]

1. **2.5 GT/s** — 初始速率（Gen1）
2. **8 GT/s** — Gen3
3. **16 GT/s** — Gen4
4. **32 GT/s** — Gen5

每个阶段都需要进行完整的均衡训练，包括发送均衡（Transmitter EQ）和接收均衡（Receiver EQ）过程。

### 链路均衡旁路流程

启用链路均衡旁路后，链路训练可以直接从 2.5 GT/s 跳转至 32 GT/s，跳过 8 GT/s 和 16 GT/s 的中间训练阶段。这要求链路两端的设备能够通过简化的协商机制直接建立高速链路。 ^[presentation-title-goes-here.md]

### 完全跳过链路均衡

如果链路上的所有组件都支持，还可以选择完全跳过链路均衡过程，直接进入正常工作状态（L0）。这一选项在延迟敏感型应用中具有显著优势。 ^[presentation-title-goes-here.md]

## 性能收益

### 时间节省

通过使用链路均衡旁路特性，从检测到建立 32 GT/s 链路（L0 状态）可节省约 **200 毫秒**的时间。这一改进对于需要频繁重建链路的应用场景（如系统从睡眠状态恢复）尤为重要。 ^[presentation-title-goes-here.md]

### 适用场景

- 快速系统启动
- Sx 状态（睡眠状态）恢复
- 热插拔事件后的链路重建
- 对延迟敏感的高性能计算场景

## 技术要求

### 链路两端兼容性

链路均衡旁路是一个可选特性，其成功启用依赖于链路两端所有组件的共同支持。如果较低速率的训练过程未能成功完成，则相应的速率无法被利用。因此，实现可靠的链路均衡旁路需要： ^[presentation-title-goes-here.md]

- 发送器和接收器均支持 32 GT/s 速率
- 双方固件/软件均启用链路均衡旁路功能
- 物理信道质量满足 32 GT/s 传输要求

### 与传统训练的后向兼容

链路均衡旁路特性不会取代传统的链路训练机制。即使链路两端都支持旁路功能，系统仍然会保留传统的分级训练流程作为备选方案，确保在旁路训练失败时能够平滑回退到标准训练序列。 ^[presentation-title-goes-here.md]

## 相关技术背景

### 32 GT/s 信道特性

PCI Express 5.0 将数据速率提升至 32 GT/s，相比 Gen4 的 16 GT/s 翻倍。为保持信号完整性，对信道损耗的要求也更加严格：接收端测试范围从 Gen4 的 -27 至 -30 dB @ 8GHz 扩展至 -34 至 -37 dB @ 16GHz。 ^[presentation-title-goes-here.md]

### 接收均衡改进

Gen5 规范对接收端连续时间均衡器（CTLE）进行了增强，采用 4 极 2 零设计，直流增益范围调整为 -5 至 -12 dB。此外，判决反馈均衡器（DFE）从 2 抽头增加至 3 抽头，以更好地补偿高损耗信道的码间干扰。 ^[presentation-title-goes-here.md]

### 前置编码

在 32 GT/s 及以上速率下，突发错误（Burst Error）发生的概率增加。这是因为特定的 101010 模式可能导致错误传播。PCI Express 5.0 引入前置编码（Precoding）机制来限制切换模式的出现，通过训练序列（Training Sets）进行协商和启用。 ^[presentation-title-goes-here.md]

## 参见

- [[PCI Express 5.0]]
- [[链路均衡（Link Equalization）]]
- [[前置编码（Precoding）]]
- [[判决反馈均衡器（DFE）]]
- [[连续时间均衡器（CTLE）]]
- [[链路训练与状态机（LTSSM）]]

## 来源

^[presentation-title-goes-here.md]

- PCI-SIG Developers Conference 2020, "PCI Express 5.0 Update: Keys to Addressing an Evolving Specification", Slide 7 "Link Equalization Bypass"
