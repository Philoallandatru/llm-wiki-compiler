---
title: 突发错误预防与预编码（Precoding）
summary: 32GT/s速率下101010模式易引发DFE错误传播，通过预编码限制切换模式发生，接收器可在≥32GT/s速率请求发射器启用预编码功能
sources:
  - presentation-title-goes-here.md
kind: concept
createdAt: "2026-05-24T04:26:23.169Z"
updatedAt: "2026-05-24T04:26:23.169Z"
tags:
  - PCIe
  - 信号完整性
  - 错误处理
aliases:
  - 突发错误预防与预编码precoding
confidence: 0.9
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "突发错误预防与预编码（Precoding）" (Burst Error Prevention and Precoding).

Looking at the source material from the presentation about PCIe 5.0, I can find relevant information in Slide 8 (labeled as 8 of 33):

"Burst Error Prevention
• Burst Errors are more likely at 32GT/s given the DFE tap ratios
• This error propagation can occur with 101010 patterns
• Precoding limits toggle pattern occurrences
• Receivers may request precoding from its transmitter at data rates >= 32 GT/s
• Enabled through Training Sets"

I need to write a clear, well-structured markdown page about this topic, drawing facts only from the provided source material. Let me structure this properly:

1. Title: 突发错误预防与预编码（Precoding）
2. Summary at the top
3. Overview section explaining the concept
4. Technical details
5. How it works (mechanism)
6. Related concepts
7. Sources

The user specified zh-CN (Simplified Chinese) and wants citations at the end of paragraphs/sentences, using the format ^[filename.md] for single source.

Let me write this page now.
</think>

# 突发错误预防与预编码（Precoding）

**突发错误预防与预编码**是 PCI Express 5.0 规范中引入的一项关键技术，用于解决在 32 GT/s 数据传输速率下可能出现的突发错误（burst errors）问题。该机制通过预编码技术限制翻转模式的产生，从而防止错误在接收端的判决反馈均衡器（DFE）中传播。 ^[presentation-title-goes-here.md:8-8]

## 背景与问题

### 突发错误产生原因

在 PCI Express 5.0 的 32 GT/s 数据传输速率下，由于 DFE（判决反馈均衡器）抽头比率的特性，突发错误发生的概率显著增加。当数据流中出现特定的 **101010 模式**（二进制序列）时，可能触发错误传播现象。 ^[presentation-title-goes-here.md:8-8]

具体而言：
- DFE 的反馈机制在处理连续的高频翻转数据时可能出现不稳定
- 101010 模式的高翻转率增加了错误检测和纠正的难度
- 错误一旦产生，可能沿数据链路传播扩散，影响后续数据包的正确性

## 预编码机制

### 技术原理

**预编码（Precoding）**是一种信号处理技术，其核心原理是通过对发送数据进行预编码处理，限制数据流中翻转模式（toggle pattern）的出现频率。预编码在发送端实施，接收端通过相应的解码算法恢复原始数据。 ^[presentation-title-goes-here.md:8-8]

### 工作方式

在 32 GT/s 及以上数据速率时，接收端可以向发射端请求启用预编码功能。该请求通过链路训练序列（Training Sets）传递。 ^[presentation-title-goes-here.md:8-8]

具体流程如下：

1. **检测阶段**：接收端监测数据流中的翻转模式频率
2. **请求阶段**：当检测到翻转模式可能引发错误传播时，接收端通过训练序列向发射端发送预编码启用请求
3. **启用阶段**：发射端收到请求后，对后续发送的数据启用预编码处理
4. **解码阶段**：接收端对预编码数据进行解码，恢复原始数据内容

## 规范要求

### 触发条件

根据 PCI Express 5.0 规范，预编码机制适用于：
- 数据传输速率 **≥ 32 GT/s** 的场景
- 接收端检测到可能导致错误传播的翻转模式时

### 实现方式

预编码功能通过 **链路训练序列（Training Sets）** 实现，这是 PCI Express 物理层链路初始化和协商的标准机制。训练序列是链路训练过程中发送的特定数据模式，用于信道特性学习和链路参数优化。 ^[presentation-title-goes-here.md:8-8]

## 与链路均衡的关系

### 协同工作

预编码机制与 PCI Express 5.0 引入的链路均衡旁路（Link Equalization Bypass）功能协同工作。链路均衡旁路允许直接从 2.5 GT/s 训练至 32 GT/s，在该训练过程中可以一并协商预编码的启用。 ^[presentation-title-goes-here.md:6-6, 8-8]

### 性能收益

启用预编码功能可带来以下收益：

- **可靠性提升**：有效抑制突发错误的发生
- **链路稳定性**：减少因错误传播导致的重传次数
- **功耗优化**：降低因重传导致的额外功耗开销

## 相关概念

- [[PCIe 5.0 规范状态与发布时间线]]
- [[链路均衡]]
- [[判决反馈均衡器（DFE）]]
- [[PCIe 训练序列]]
- [[PCI Express]]

## 来源

^[presentation-title-goes-here.md]

- PCI-SIG, *PCI Express 5.0 Update: Keys to Addressing an Evolving Specification*, Slide 8 "Burst Error Prevention" (June 9, 2020)


---

title: 突发错误预防与预编码（Precoding）
summary: PCIe 5.0中用于防止突发错误传播的技术，通过预编码限制翻转模式发生，数据速率>=32GT/s时可通过训练序列启用
sources:
  - presentation-title-goes-here.md
kind: concept
createdAt: "2026-05-24T04:25:54.791Z"
updatedAt: "2026-05-24T04:25:54.791Z"
tags:
  - PCIe 5.0
  - 预编码
  - 突发错误
  - DFE
  - 错误预防
aliases:
  - 突发错误预防
  - Precoding
confidence: 1
provenanceState: extracted
