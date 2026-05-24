---
title: SRIS 独立参考时钟
summary: 独立参考时钟和展频(SRIS)支持使PCIe无需板载参考时钟即可通过电缆传输，降低成本，支持OCuLink等低成本内外有线PCIe技术，支持2.5-16 GT/s数据速率
sources:
  - powerpoint-presentation.md
kind: concept
createdAt: "2026-05-24T07:36:51.012Z"
updatedAt: "2026-05-24T07:36:51.012Z"
tags:
  - 时钟
  - 电缆
  - 成本
aliases:
  - sris-独立参考时钟
confidence: 0.9
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "SRIS 独立参考时钟" in Chinese (zh-CN). Looking at the source material provided, I can see there's a reference to SRIS in the powerpoint-presentation.md file.

From the source (powerpoint-presentation.md), I can find information about SRIS in slide 16:

"I/O Virtualization and Clocking
Inexpensive Cabling = Independent Clock + Spread Spectrum (SSC) (SRIS)"

And the detailed content:
"Challenge: PCIe® specification did not support independent clock with SSC initially
• SATA* cable ~ $0.50
• PCIe cables include reference clock > $1 for equivalent cable
• Routing reference clock across the chassis to front of the rack for storage access is a challenge

PCIe base specification has included support since PCIe 3.1
1) Requires use of larger elasticity buffer
2) Requires more frequent insertion of SKIP ordered set
3) Requires receiver changes (CDR)
4) Model CDRs

SRIS enables a number of form factors for PCIe technology
• OCuLink
• Lower cost external/internal cabled PCIe technology

Example of Possible PCIe Cable

Separate Refclk Modes of Operation: 5600ppm (SRIS) for 2.5, 5.0, 8.0, and 16.0 GT/s Data Rates and 3600 ppm for 32.0 GT/s; 600ppm (SRNS)"

So SRIS stands for Separate Reference Clock Independent Spread Spectrum Clocking.

Let me write a comprehensive wiki page about SRIS based on this information. I should:
1. Explain what SRIS is
2. Explain why it was needed (the challenge)
3. Describe how it works
4. List the applications and form factors it enables
5. Include wikilinks to related concepts
6. Cite the source properly
</think>

# SRIS 独立参考时钟

**SRIS**（Separate Reference Clock Independent Spread Spectrum clocking）即独立参考时钟扩频时钟，是 PCI Express 规范中定义的一种时钟架构，允许在不传输主参考时钟的情况下实现扩频时钟（SSC）功能。SRIS 自 PCIe 3.1 规范起被纳入规范，为低成本的 PCIe 电缆和连接方案提供了时钟支持。 ^[powerpoint-presentation.md]

## 设计背景与挑战

传统的 PCIe 系统要求所有设备共享同一个参考时钟源，这一设计在某些应用场景下带来了挑战： ^[powerpoint-presentation.md]

- **布线成本**：将参考时钟穿过机箱布线至机架前端的存储访问点成本高昂
- **电缆成本差异**：SATA 电缆价格约为 0.50 美元，而包含参考时钟的 PCIe 电缆需要额外时钟线路，成本超过 1 美元
- **灵活性受限**：固定的时钟分配架构限制了系统设计和部署的灵活性

这些限制阻碍了 PCIe 技术在外部存储和长距离传输场景中的应用，需要一种无需共享参考时钟的新型时钟架构。

## 工作机制

SRIS 通过以下技术实现独立时钟架构： ^[powerpoint-presentation.md]

### 扩频模式

SRIS 支持不同的扩频模式以适应不同的数据速率：

| 数据速率 | 扩频容差 |
|---------|---------|
| 2.5 GT/s | 5600 ppm |
| 5.0 GT/s | 5600 ppm |
| 8.0 GT/s | 5600 ppm |
| 16.0 GT/s | 5600 ppm |
| 32.0 GT/s | 3600 ppm |

作为对比，SRNS（Separate Reference Clock No Spread Spectrum，独立参考时钟无扩频）的模式为 600 ppm。

### 硬件要求

SRIS 架构对接收端硬件提出了以下要求： ^[powerpoint-presentation.md]

1. **更大的弹性缓冲器**（Elasticity Buffer）：补偿发送端与接收端之间的时钟频率差异
2. **更频繁的 SKIP 有序集插入**：确保时钟同步和弹性缓冲器的正常工作
3. **时钟数据恢复电路**（CDR）：接收端需要具备时钟恢复能力，从数据流中恢复时钟信号
4. **CDR 建模**：系统需要正确建模 CDR 的行为以保证信号完整性

## 应用场景与形态

SRIS 使能了多种 PCIe 连接形态： ^[powerpoint-presentation.md]

### OCuLink

OCuLink（Optical Copper Link）是基于 SRIS 技术的重要应用，作为低成本的外接/内接 PCIe 线缆方案，为存储设备提供灵活的热拔插和部署能力。

### 其他形态

SRIS 还支持其他需要外部布线的 PCIe 应用，包括：

- 数据中心存储区域网络中的长距离 PCIe 扩展
- 需要灵活部署的机架式存储系统
- 对成本敏感但需要 PCIe 性能的直连存储场景

## SRIS 与相关时钟模式

PCIe 规范定义了多种时钟模式，SRIS 是其中之一：

- **SRIS**：独立参考时钟 + 扩频时钟，适用于成本敏感型外部连接场景
- **SRNS**：独立参考时钟 + 无扩频，适用于对时钟抖动要求更高的场景
- **-common Refclk**：共享参考时钟模式，是传统的 PCIe 时钟架构

## 与其他技术的关联

SRIS 与以下 PCIe 特性和技术密切相关： ^[powerpoint-presentation.md]

- **[[PCI Express]]**：SRIS 的应用基础协议
- **[[热拔插]]**（Hot-plug）：SRIS 支撑的外部存储方案通常支持热拔插
- **[[DPC]]**（Downstream Port Containment）：DPC 与 SRIS 共同支持存储系统的可靠性与可服务性
- **[[OCuLink]]**：基于 SRIS 的连接器标准

## 相关概念

- [[PCI Express]] — SRIS 的基础协议
- [[OCuLink]] — 基于 SRIS 的重要应用
- [[热拔插]]（Hot-plug）— SRIS 使能的特性
- [[扩频时钟]]（Spread Spectrum Clocking）— SRIS 的核心功能
- [[PCIe 电缆]]（PCIe Cabling）— SRIS 的重要应用场景

---

## 来源

^[powerpoint-presentation.md]
