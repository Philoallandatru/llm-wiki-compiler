---
title: Link Equalization Bypass
summary: PCIe 5.0 optional feature allowing direct training from 2.5GT/s to 32GT/s, saving ~200ms to reach L0 state at 32GT/s
sources:
  - presentation-title-goes-here.md
kind: concept
createdAt: "2026-05-24T07:39:02.709Z"
updatedAt: "2026-05-24T07:39:02.709Z"
tags:
  - pcie
  - training
  - equalization
aliases:
  - link-equalization-bypass
  - LEB
confidence: 0.9
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "Link Equalization Bypass" based on the provided source material. I have the PCI Express 5.0 presentation that covers this topic on slide 7 of 33.

Let me extract the key information:

From slide 7:
- **Title**: Link Equalization Bypass
- **Content**:
  - PCIe 5.0 optional Link EQ Training Bypass
  - Train directly from 2.5 GT/s to 32 GT/s
  - 2.5GT/s -> 32GT/s
  - Traditional Training still Supported
  - 2.5GT/s > 8GT/s > 16GT/s > 32GT/s
  - If lower rates don't perform link training, they cannot be utilized
  - ~200ms time savings to L0 at 32GT/s
  - Option to skip Link EQ entirely if all components in the link support

This is a relatively brief topic, but I can also reference related concepts from other slides:
- Burst Error Prevention (slide 8) - mentions DFE tap ratios, 101010 patterns, precoding
- PCIe 5.0 Channel Solution Space (slide 6)
- Various technical specs from other slides

I'll write a clear, well-structured wiki page about "Link Equalization Bypass" in zh-CN (Simplified Chinese), including facts from the source material, relevant wikilinks, and a sources section.
</think>

# 链路均衡旁路 (Link Equalization Bypass)

## 概述

链路均衡旁路（Link Equalization Bypass，通常简称 EQ Bypass）是 PCI Express 5.0 规范中引入的可选功能，允许链路的链路训练（Link Training）过程跳过中间速率阶段的均衡训练，直接从 2.5 GT/s 训练到 32 GT/s 的目标速率。^[presentation-title-goes-here.md]

## 工作原理

### 传统链路训练流程

在传统的 PCI Express 训练流程中，链路需要按照速率递增的顺序依次完成各阶段的均衡训练：^[presentation-title-goes-here.md]

```
2.5 GT/s → 8 GT/s → 16 GT/s → 32 GT/s
```

在这种模式下，较低速率的链路训练是更高速率训练的前置条件。如果某个较低速率的训练未能成功完成，则后续更高速度的速率将无法被使用。^[presentation-title-goes-here.md]

### 链路均衡旁路流程

链路均衡旁路允许直接跳过中间速率的训练阶段：^[presentation-title-goes-here.md]

```
2.5 GT/s → 32 GT/s
```

该模式仅在链路两端的所有组件均支持该功能时方可使用。如果链路中任意一端不支持该功能，系统将回退到传统训练流程。^[presentation-title-goes-here.md]

## 性能收益

链路均衡旁路的主要优势在于显著减少从链路初始化到正常工作状态（L0）所需的时间。采用旁路训练时，可节省约 **200 毫秒**的链路建立时间。^[presentation-title-goes-here.md]

这对于需要快速启动或热插拔场景的系统尤为重要，能够有效改善用户体验和系统响应速度。

## 技术背景

在 PCI Express 5.0（32 GT/s）速率下，由于判决反馈均衡器（DFE）的抽头比率特性，连串错误（Burst Errors）发生的概率更高。这种错误传播可能在 101010 等特定比特模式出现时发生。为应对这一问题，PCI Express 5.0 引入了 **预编码（Precoding）** 机制，通过限制翻转模式的产生来降低连串错误的风险。接收端可在此速率下向发送端请求启用预编码，该功能通过训练集（Training Sets）启用。^[presentation-title-goes-here.md]

## 相关概念

- [[PCI Express 5.0]] — 引入链路均衡旁路功能的 PCI Express 规范版本
- [[链路训练]] (Link Training) — 链路建立过程中的均衡和协商阶段
- [[判决反馈均衡器]] (DFE, Decision Feedback Equalizer) — 用于补偿信道损伤的均衡技术
- [[预编码]] (Precoding) — 用于降低连串错误发生概率的传输技术
- [[PCI Express 链路速率]] — 涵盖 2.5/5/8/16/32 GT/s 等不同速率等级

---

## Sources

- [PCI Express 5.0 Update: Keys to Addressing an Evolving Specification](presentation-title-goes-here.md)
