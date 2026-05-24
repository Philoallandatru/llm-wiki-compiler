---
title: PCIe 外形尺寸
summary: M.2、Add-in-card、U.2、BGA等PCIe SSD的不同物理规格和部署方式
sources:
  - powerpoint-presentation.md
kind: concept
createdAt: "2026-05-24T04:27:39.110Z"
updatedAt: "2026-05-24T04:27:39.110Z"
tags:
  - form-factor
  - hardware
  - storage
aliases:
  - pcie-外形尺寸
confidence: 0.9
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "PCIe 外形尺寸" (PCIe Form Factors) in zh-CN, using only the provided source material.

Let me extract the relevant information about PCIe form factors from the source material:

From powerpoint-presentation.md (slide 18):

The form factors mentioned are:
1. M.2 - 30, 42, 80, and 110mm - Smallest footprint of PCIe connector form factors, use for boot or for max storage density
2. CEM Add-in-card (AIC) - has maximum system compatibility with existing servers and most reliable compliance program. Higher power envelope, and options for height and length
3. BGA - 11.5x13 & 16x20mm - small and thin platforms, prevalent in hand-held, IoT, automotive
4. U.2 (2.5in) - Source: Intel Corporation - Majority of SSDs sold - Ease of deployment, hotplug, serviceability. Single-Port x4 or Dual-Port x2, High B/W with PCIe 3.0

From slide 19:
SFF Form Factors - Up to 36 Modules (SFF TA 1006 – SSD), (SFF TA 1002), (SFF TA 1007 – SSD) - Up to 32 Modules

Let me organize this information into a well-structured wiki page in zh-CN.

I need to:
1. Write in zh-CN
2. Use wikilinks to related concepts where appropriate
3. Include citations from the source material
4. Include a ## Sources section at the end

Let me structure the page:
- Introduction
- Main form factors (M.2, AIC, BGA, U.2)
- SFF Form Factors


- Sources</think>

# PCIe 外形尺寸

PCIe 外形尺寸（PCIe® Form Factors）指的是 PCI Express 接口设备在不同物理尺寸和连接器类型上的标准化形态。这些外形尺寸由 PCI-SIG® 定义，旨在满足从手持设备到数据中心等多样化应用场景的需求。

## 主要外形尺寸类型

根据 PCI-SIG 在 Flash Memory Summit 2019 上发布的技术资料，PCIe 外形尺寸主要包括以下几种类型：

### M.2

M.2 外形尺寸是 PCIe 连接器形态中**最小巧的外形**，提供 30mm、42mm、80mm 和 110mm 四种长度规格 ^[powerpoint-presentation.md]。M.2 主要用于启动盘（boot）或需要最大存储密度的场景。

### CEM Add-in-card (AIC)

CEM（卡扩展商规范）Add-in-card 是兼容性最广的外形尺寸，与现有服务器系统具有最大兼容性，并且拥有最可靠的合规性认证程序 ^[powerpoint-presentation.md]。AIC 支持更高的功率预算，并提供多种高度和长度选项。

### BGA

BGA（球栅阵列）封装外形尺寸提供 **11.5×13mm** 和 **16×20mm** 两种规格 ^[powerpoint-presentation.md]。这种小型化、薄型化的封装方案主要应用于手持设备、物联网（IoT）和汽车电子等对体积有严格要求的平台。

### U.2（2.5 英寸）

U.2 外形尺寸基于 2.5 英寸驱动器规格，是**目前销量最大的 SSD 外形尺寸** ^[powerpoint-presentation.md]。其主要优势包括易于部署、热插拔（hotplug）支持和便捷的维护性。U.2 接口通常支持单端口 x4 或双端口 x2 配置，在 PCIe 3.0 环境下可提供高带宽。

## SFF 小型化外形尺寸

除上述主流外形尺寸外，还存在针对高密度存储应用的小型化（SFF）外形尺寸系列。这些规格由 SFF 技术规范定义，包括 SFF TA 1002、SFF TA 1006（SSD）以及 SFF TA 1007（SSD）等标准，支持最多 32 至 36 个模块的集成配置 ^[powerpoint-presentation.md]。

## 外形尺寸与 PCIe 版本的关系

PCIe 技术持续演进，不同的外形尺寸需要适应从 PCIe 1.x 到 PCIe 5.0 等各代技术标准。例如，U.2 接口在 PCIe 3.0 环境下可提供高带宽性能。PCIe 5.0 规范已与 2019 年 5 月正式发布，其电气改动旨在改善连接器的信号完整性和机械性能 ^[powerpoint-presentation.md]。

## 相关概念

- [[PCIe]]
- [[NVMe]]
- [[M.2]]
- [[U.2]]
- [[SSD]]
- [[PCI-SIG]]
- [[热插拔]]

## 来源

^[powerpoint-presentation.md]
