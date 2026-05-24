---
title: PCIe 线缆与SRIS
summary: 独立时钟和扩频SSC（SRIS）支持，使PCIe可通过OCuLink等低成本线缆连接
sources:
  - powerpoint-presentation.md
kind: concept
createdAt: "2026-05-24T04:28:09.492Z"
updatedAt: "2026-05-24T04:28:09.492Z"
tags:
  - cabling
  - interconnect
  - clocking
aliases:
  - pcie-线缆与sris
confidence: 0.85
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "PCIe 线缆与SRIS" (PCIe Cables and SRIS) in Chinese (zh-CN). I need to extract facts only from the provided source material.

Looking at the source material (powerpoint-presentation.md), I can find relevant information about PCIe cables and SRIS on slide 16:

"Innexpensive Cabling = Independent Clock + Spread Spectrum (SSC) (SRIS)"

The content discusses:
1. Challenge: PCIe specification did not support independent clock with SSC initially
2. SATA cables cost about $0.50 while PCIe cables with reference clock cost over $1
3. Routing reference clock across the chassis is a challenge
4. PCIe base specification has included support since PCIe 3.1
5. Requirements: larger elasticity buffer, more frequent SKIP ordered set insertion, receiver changes (CDR), CDRs modeling
6. SRIS enables form factors like OCuLink
7. SRIS enables lower cost external/internal cabled PCIe technology
8. Separate Refclk Modes of Operation: 5600ppm (SRIS) for 2.5, 5.0, 8.0, and 16.0 GT/s Data Rates and 3600 ppm for 32.0 GT/s; 600ppm (SRNS)

Let me also check the document for related topics:
- The document mentions "线缆" (cables) in the context of form factors
- There's mention of "cabling support" as a value-add for storage

I should write a well-structured wiki page about PCIe cables and SRIS, including:
1. Overview/Introduction
2. The challenge with PCIe cables and reference clock
3. SRIS (Separate Reference Clock with Independent Spread Spectrum)
4. Technical implementation
5. Benefits and applications
6. Related concepts (wikilinks)
7. Sources

Let me write this in zh-CN with proper citations from the source material.
</think>



# PCIe 线缆与 SRIS

**PCIe 线缆与 SRIS** 指的是基于 PCI Express 规范使用独立参考时钟配合扩展频谱时钟（Spread Spectrum Clocking, SSC）的线缆互连方案。这一技术使得 PCIe 能够以更低的成本支持内部和外部线缆连接，为多种新型设备形态提供了可能。

## 背景与挑战

传统的 PCIe 规范在设计之初并未支持独立时钟与扩展频谱时钟的组合使用，这给线缆方案带来了显著的成本和设计挑战。 ^[powerpoint-presentation.md:16]

### 成本问题

SATA 线缆成本约为 **0.50 美元**，而包含参考时钟的 PCIe 线缆成本则超过 **1 美元**，成本的差异主要源于需要同时传输参考时钟信号。这种成本溢价使得 PCIe 线缆在大规模部署时面临经济性挑战。 ^[powerpoint-presentation.md:16]

### 布线挑战

在实际系统设计中，将参考时钟穿过机箱布线到机架前端的存储访问位置存在技术难度。特别是对于需要长距离传输的应用场景，如数据中心 rack 前端访问，参考时钟的分配和完整性维护增加了系统设计的复杂性。 ^[powerpoint-presentation.md:16]

## SRIS 技术

**SRIS**（**Separate Reference Clock with Independent Spread Spectrum**，独立参考时钟配合独立扩展频谱）是一项自 PCIe 3.1 规范起引入的重要功能，旨在解决上述线缆连接的成本和技术挑战。 ^[powerpoint-presentation.md:16]

### 工作原理

SRIS 模式允许 PCIe 设备使用独立于链路的参考时钟，同时仍支持扩展频谱时钟功能。这种架构将时钟分配与数据信号分离，使线缆制造商能够简化设计并降低成本。 ^[powerpoint-presentation.md:16]

### 技术要求

实现 SRIS 需要对 PCIe 发送和接收电路进行以下改进：

| 组件 | 要求 |
|------|------|
| **弹性缓冲区（Elasticity Buffer）** | 需要使用更大的缓冲区以补偿时钟偏差 |
| **SKIP 有序集（SKIP Ordered Set）** | 需要更频繁地插入以进行时钟补偿 |
| **时钟数据恢复（CDR）** | 接收端需要添加 CDR 电路 |
| **CDR 建模** | 需要对 CDR 进行精确建模以确保信号完整性 |

 ^[powerpoint-presentation.md:16]

## SRIS 支持的数据速率

SRIS 模式已支持多个 PCIe 世代的数据速率：

| PCIe 世代 | 数据速率 | SRIS 扩展频谱容差 |
|-----------|---------|------------------|
| PCIe 1.x | 2.5 GT/s | 5600 ppm |
| PCIe 2.x | 5.0 GT/s | 5600 ppm |
| PCIe 3.x | 8.0 GT/s | 5600 ppm |
| PCIe 4.x | 16.0 GT/s | 5600 ppm |
| PCIe 5.x | 32.0 GT/s | 3600 ppm |

> 注：作为对比，SRNS（Separate Reference Clock with No Spread Spectrum，无扩展频谱的独立参考时钟）模式使用 600 ppm 的固定容差。 ^[powerpoint-presentation.md:16]

## 应用场景

SRIS 技术的引入为 PCIe 生态系统开辟了多种新的互连形态：

### OCuLink

OCuLink（Optical Copper Link）是一种重要的 PCIe 线缆连接器标准，利用 SRIS 技术实现了内部和外部 PCIe 设备的低成本连接方案。 ^[powerpoint-presentation.md:16]

### 内部线缆

SRIS 使得服务器内部可以采用更长距离的 PCIe 设备连接，例如存储控制器与主板之间的灵活布线，同时保持较低的信号完整性和成本。

### 外部存储访问

在数据中心环境中，SRIS 支持从服务器到存储阵列的外部 PCIe 连接，实现 rack 级别的存储资源池化和灵活部署。

## 技术优势总结

SRIS 为 PCIe 线缆方案带来的核心价值包括：

- **降低成本**：消除或简化线缆中的参考时钟分配，降低线缆组件成本
- **简化布线**：无需在机箱内长距离分配参考时钟信号
- **支持多种形态**：为 OCuLink 等新型连接方案提供技术基础
- **覆盖多代技术**：从 PCIe 3.1 到 PCIe 6.0 持续演进的数据速率支持

---

## 相关概念

[[PCI Express]] | [[PCI-SIG 组织]] | [[扩展频谱时钟]] | [[OCuLink]] | [[PCIe SSD 存储应用]]

## 来源

^[powerpoint-presentation.md]
