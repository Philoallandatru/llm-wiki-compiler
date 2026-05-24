---
title: PCIe 外形规格
summary: PCIe SSD的主要外形规格包括：M.2(最小占位)、AIC(最高兼容性)、U.2/SFF(易部署热插拔)、BGA(手持/IoT/汽车)，以及支持多达36个模块的SFF规格
sources:
  - powerpoint-presentation.md
kind: concept
createdAt: "2026-05-24T07:36:36.024Z"
updatedAt: "2026-05-24T07:36:36.024Z"
tags:
  - 硬件
  - 外形规格
aliases:
  - pcie-外形规格
confidence: 0.95
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "PCIe 外形规格" (PCIe Form Factors) in zh-CN (Simplified Chinese). I need to extract information from the provided source material and create a well-structured markdown page.

Looking at the source material (powerpoint-presentation.md), I can find relevant information about PCIe form factors on slide 18:

From slide 18 "PCIe® Form Factors":
- Various form factors are mentioned:
  - M.2
  - CEM Add-in-card (AIC)
  - BGA
  - U.2 2.5in

There are also additional references to:
- SFF Form Factors (slide 19) - mentions up to 36 modules and 32 modules with references to SFF TA 1006, SFF TA 1002, SFF TA 1007
- Smallest footprint: 30, 42, 80, and 110mm
- BGA dimensions: 11.5x13 & 16x20mm

I should create a comprehensive wiki page about PCIe form factors based on this information. The page should include:
1. An introduction
2. Various form factor types
3. Key characteristics
4. Related concepts with wikilinks

Let me organize this information into a clear, well-structured markdown page in Chinese.
</think>

# PCIe 外形规格

**PCIe 外形规格**（PCIe Form Factors）是指 PCI Express 接口设备在不同物理形态和尺寸下的标准规范。这些规格由 PCI-SIG（PCI Special Interest Group）定义，以确保不同厂商生产的 PCIe 设备在物理尺寸、连接器和安装方式上具备互操作性。PCIe 外形规格的选择直接影响设备的部署场景、散热能力和可服务性。 ^[powerpoint-presentation.md]

## 主要外形规格类型

### M.2

M.2 是最小巧的 PCIe 连接器外形规格，尺寸涵盖 30mm、42mm、80mm 和 110mm 四种长度规格。M.2 接口最初设计用于超极本和平板电脑等空间受限的移动设备，如今已广泛应用于高性能 [[固态硬盘]]（SSD）领域。其小巧的尺寸使 M.2 成为追求最大存储密度的应用场景的理想选择，既可用于系统启动盘，也可用于扩展存储容量。 ^[powerpoint-presentation.md]

### CEM Add-in-card (AIC)

CEM（Card Electromechanical）Add-in-card 是一种标准化的 PCIe 插卡外形规格，具有最高的系统兼容性，可兼容现有大多数服务器平台。AIC 规格提供更高的功率上限，并支持多种高度和长度选项，能够满足不同应用场景的扩展需求。由于其标准化的设计，AIC 规格拥有最可靠的一致性测试程序，是企业级存储和加速器卡的首选形态。 ^[powerpoint-presentation.md]

### BGA

BGA（Ball Grid Array，球栅阵列封装）是一种直接焊接在主板或系统板上的 PCIe 设备形态。BGA 封装尺寸紧凑，常见规格包括 11.5×13mm 和 16×20mm 两种。这种封装方式特别适用于对空间和功耗有严格要求的移动平台、物联网（IoT）设备和汽车电子应用。BGA 封装的设备虽然更换不便，但具有更好的抗振动性能和更低的连接器成本。 ^[powerpoint-presentation.md]

### U.2 (SFF-TA-1002)

U.2 接口是一种支持热拔插的 2.5 英寸小型化存储设备外形规格，是当前企业级 SSD 市场中部署最广泛的形态之一。U.2 接口支持单端口 x4 或双端口 x2 配置，能够提供高带宽的 PCIe 3.0 连接能力。其热拔插特性使得设备可以在系统运行时进行更换和维护，显著提升了数据中心的可服务性和可用性。 ^[powerpoint-presentation.md]

## SFF 外形规格

SFF（Small Form Factor）技术工作组定义了一系列用于高密度存储系统的外形规格：

- **SFF TA-1006**：针对 SSD 优化的外形规格，支持最多 36 个存储模块
- **SFF TA-1002**：定义了存储模块的机械和电气规范
- **SFF TA-1007**：SSD 专用外形规格，支持最多 32 个存储模块

这些 SFF 规格主要面向需要高密度存储部署的数据中心和企业级应用场景。 ^[powerpoint-presentation.md]

## 外形规格对比

| 外形规格 | 典型应用场景 | 部署方式 | 可服务性 |
|---------|-------------|---------|---------|
| M.2 | 移动设备、空间受限系统 | 焊接/插座 | 低 |
| AIC | 服务器、桌面工作站 | 插槽插拔 | 中 |
| BGA | 嵌入式系统、移动设备 | 焊接固定 | 不可更换 |
| U.2 | 企业级存储、数据中心 | 热拔插托架 | 高 |

## 选择考量因素

在选择 PCIe 外形规格时，需要综合考虑以下因素：

- **空间限制**：不同的系统平台对设备尺寸有严格要求
- **功率预算**：高功耗设备需要更强的散热能力和供电支持
- **可服务性需求**：生产环境通常优先选择支持热拔插的规格
- **带宽需求**：多端口配置可提供更高的聚合带宽
- **成本考量**：连接器类型、散热方案和部署方式都会影响总体拥有成本

## 相关概念

- [[PCI Express]] — PCIe 外形规格的基础协议标准
- [[固态硬盘]] — 使用 PCIe 接口的主要设备类型
- [[热拔插]] — U.2 等外形规格支持的关键特性
- [[PCIe 5.0]] — 当前主流的高速 PCIe 规范版本
- [[PCIe 6.0]] — 下一代 PCIe 规范，目标传输速率 64 GT/s

---

## 来源

^[powerpoint-presentation.md]
