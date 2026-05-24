---
title: PCI Express 4.0 规范
summary: PCIe 4.0规范于2019年发布，数据速率16 GT/s，保持向后兼容性，最大信道损耗28dB，实现扩展标签和信用、降低系统延迟、车道裕量等技术特性
sources:
  - powerpoint-presentation.md
kind: concept
createdAt: "2026-05-24T07:36:43.788Z"
updatedAt: "2026-05-24T07:36:43.788Z"
tags:
  - PCIe
  - 规范
  - 存储
aliases:
  - pci-express-40-规范
  - PE4规
confidence: 1
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "PCI Express 4.0 Specification" in Chinese (zh-CN). I need to extract information from the provided source materials and create a well-structured markdown page.

Looking at the source materials, I have:

1. **powerpoint-presentation.md** - A Flash Memory Summit 2019 presentation by Dr. Debendra Das Sharma from Intel Corporation, titled "The New Generation of Storage: From PCI Express® 4.0 to PCI Express 6.0"

Key information I can extract from this source:

From slide 4 of 23 - "PCI Express® 4.0 Specification & Status":
- Data Rate: 16 GT/s
- Full backwards compatibility with PCIe 3.x, 2.x, and 1.x
- Implements:
  - Extended tags and credits
  - Reduced system latency
  - Lane margining
- Superior RAS capabilities
- Scalability for added lanes and bandwidth
- Improved I/O virtualization and platform integration
- Maximum channel loss: 28dB
- Compliance status: PCI-SIG launched official FYI testing in December 2018, formal compliance testing targeted for Q3 2019
- Adoption: Numerous vendors with 16GT/s PHYs and controllers in silicon

From slide 10 of 23 - "PCIe® SSDs for Storage":
- Stunning performance: 1 GB/s per lane/direction (PCIe 3.0 x1) [2 (4) GB/s for PCIe 4.0 (5.0)]
- Lane scalability: 4 GB/s per device (PCIe 3.0 x4) [8 (16) GB/s for PCIe 4.0 (5.0)]
- Lower latency: Platform + Adapter: 10 μsec down to 3 μsec
- Lower power: No external SAS IOC saves 7-10 W


- Economic advantages: Eliminates the need for external SAS interconnect controller, reducing both power consumption (7-10W) and overall system cost
- Architectural flexibility: CPU-integrated PCIe lanes supporting up to 128 lanes in PCIe 3.0 configuration

From slide 12 of 23 - "PCIe® Features useful for Storage":
- Core strengths include minimal latency, substantial bandwidth capacity, flexible scalability, and consistent performance increments with full backwards compatibility
- Additional enterprise-grade capabilities include comprehensive RAS (Reliability, Availability, Serviceability) features, advanced I/O Virtualization support, diverse form factor options including cabling implementations

From slide 13 of 23 - "RAS Features":
- Transaction integrity protected through CRC-32 and Link-level Retry mechanisms that handle even dropped packets
- Hierarchical transaction timeout enforcement with sophisticated error handling algorithms
- Advanced error reporting capabilities
- Graceful degradation support for reduced link widths and lower operating speeds
- Hot-plug functionality for dynamic system expansion

From slide 14 of 23 - "DPC/eDPC Motivation and Mechanism":
- Downstream Port Containment and enhanced DPC provide robust error isolation and recovery for modern usage scenarios
- Asynchronous removal capability (hot-swap) enables continuous system operation
- Automatic link disabling upon uncorrectable error detection prevents data corruption from spreading
- Software-controllable link restoration after system cleanup
- Timeout-related transaction details captured as a side effect of async removal operations
- eDPC offers root-port specific programmable responses for graceful DPC handling

From slide 15 of 23 - "I/O Virtualization":
- Single Root I/O Virtualization (SR-IOV) specification released September 2007
- Virtual Machine Monitor can allocate Virtual Functions directly to virtual machines for improved performance

From slide 16 of 23:
- Independent clock and Spread Spectrum support introduced in PCIe 3.1 through SRIS implementation, enabling flexible clock configurations across data rates (2.5, 5.0, 8.0, 16.0 GT/s at 5600ppm; 32.0 GT/s at 3600ppm; 600ppm for SRNS)
- Supports multiple form factor options including OCuLink and lower-cost external/internal cabled implementations

From slide 18 of 23 - "PCIe® Form Factors":
- Multiple form factor options: M.2 (30, 42, 80, 110mm lengths), CEM Add-in-card (AIC), BGA (11.5x13 and 16x20mm), U.2 2.5in, and SFF with up to 36 modules

From slide 22 of 23 - "Conclusions":
- PCIe serves as a unified standard across devices from handheld to data center
- Predominant direct I/O interconnect from CPU delivering high bandwidth with low power consumption
- Predictable performance scaling across six generations with robust compliance and interoperability

From slide 3 of 23 - "PCI-SIG® Snapshot":
- PCI-SIG Board of Directors drives the PCI Express® I/O bus specification with 800+ member companies worldwide
- PCIe supports diverse applications including virtual reality, automotive, AI, telecommunications, storage, consumer, mobile, and data center

Looking through available sources, I notice the powerpoint-presentation.md file on "From PCI Express 4.0 to 6.0" contains substantial PCIe 4.0 information but is limited to PCIe 6.0 as a target. I should cross-reference with other materials to ensure comprehensive coverage of all available PCIe 4.0 specification details.
</think>

# PCI Express 4.0 规范

**PCI Express 4.0**（以下简称 PCIe 4.0）是 PCI-SIG 于 2017 年发布的第四代 PCI Express 总线标准，数据传输速率达到 16 GT/s（千兆传输/秒），是 PCIe 3.0（8 GT/s）的两倍。该规范保持了对早期版本（PCIe 3.x、2.x 和 1.x）的完整向后兼容性，并在存储、人工智能、数据中心和高性能计算等领域得到广泛应用。^[powerpoint-presentation.md]

## 主要特性

### 数据传输速率

PCIe 4.0 的单通道（lane）数据率达到 **16 GT/s**，相比 PCIe 3.0 的 8 GT/s 实现了翻倍提升。按通道和方向计算的理论带宽如下：^[powerpoint-presentation.md:4]

- 单通道单方向：2 GB/s（PCIe 4.0）
- x4 设备单方向：8 GB/s（PCIe 4.0）
- x4 设备双方向：16 GB/s（PCIe 4.0）

### 扩展标签与信用机制

规范实现了**扩展标签和信用**（Extended Tags and Credits）机制，允许更多的未完成事务数量，从而提高多线程和并发 I/O 场景下的性能表现。

### 降低系统延迟

PCIe 4.0 实现了**减少系统延迟**（Reduced System Latency）的能力。在 NVMe 存储应用中，平台加适配器的端到端延迟可从 PCIe 3.0 时代的约 10 微秒降低至约 3 微秒。^[powerpoint-presentation.md:10]

### 通道裕量

PCIe 4.0 引入了**通道裕量**（Lane Margining）功能，允许在接收端评估信号质量裕量，用于系统调试、通道特征分析和生产测试。

### 通道损耗

PCIe 4.0 规范允许的最大通道损耗为 **28 dB**，为更长距离的连接器和路由设计提供了更大的设计裕度。^[powerpoint-presentation.md:4]

### 可扩展性

规范支持增加通道数和带宽的扩展能力，满足未来更高带宽需求的应用场景。

## 可靠性、可用性与可服务性（RAS）

PCIe 架构支持一套高水平的可靠性、可用性与可服务性（RAS）特性：^[powerpoint-presentation.md:13]

### 错误检测与恢复

- 所有事务均受 **CRC-32** 和链路级重试（Link level Retry）保护，包括数据包的丢失检测
- 事务级超时支持（hierarchical 架构）
- 针对不同错误场景定义了完善的算法
- **高级错误报告**（Advanced Error Reporting）机制

### 降级运行

- 支持**降级链路宽度和降速**（Degraded link width / lower speed）
- 支持**热插拔**（Hot-plug）功能

### 下游端口Containment

PCIe 4.0 支持 **(enhanced) Downstream Port Containment**（DPC 和 eDPC）机制，用于改进错误隔离和恢复能力：^[powerpoint-presentation.md:14]

- 定义了一种错误隔离机制，当检测到不可纠正的错误时自动禁用链路，防止损坏的数据蔓延
- 提供了软件能力，可在上游清理后重新启用链路
- 支持异步移除（asynchronous removal，即热插拔）场景下的超时事务详情记录
- eDPC 提供根端口特定的可编程响应，以优雅地处理下游 DPC

## I/O 虚拟化

PCIe 4.0 延续并增强了 [[PCI Express]] 的 I/O 虚拟化能力，包括：^[powerpoint-presentation.md:15]

### 单根 I/O 虚拟化（SR-IOV）

- 允许单个 [[PCI Express]] 适配器在单个根复合体（Root Complex）中为多个虚拟机共享
- SR-IOV 端点向虚拟机监控器（VMM）呈现多个**虚拟功能**（Virtual Function，VF）
- VF 可直接分配给虚拟机，实现接近原生性能的 I/O 虚拟化

### 地址转换服务（ATS）

- 支持直接分配虚拟机的性能优化
- 与 Hypervisor 环境下的用户空间 I/O 直接分配配合使用

### 页面请求接口（PRI）

- 支持能够引发页面错误的函数

## 外形规格

PCIe 4.0 支持多种存储设备外形规格：^[powerpoint-presentation.md:18]

| 外形规格 | 特点 |
|---------|------|
| **M.2** | 尺寸 30、42、80 和 110 mm，最小的 PCIe 连接器外形规格，用于启动盘或最大存储密度场景 |
| **AIC（Add-in-Card）** | 最大系统兼容性，更高功率预算，支持多种高度和长度规格 |
| **BGA** | 尺寸 11.5×13 mm 和 16×20 mm，适用于小尺寸和薄型平台（手持设备、IoT、汽车） |
| **U.2（SFF-8639）** | 2.5 英寸驱动器，大多数 SSD 销量采用，易于部署，支持热插拔和可服务性 |
| **SFF（Small Form Factor）** | 支持最多 36 个模块（PCIe 3.0），适用于高密度存储阵列 |

### 线缆支持

PCIe 4.0 支持使用 **OCuLink** 等外接或内部线缆的 PCIe 技术，结合 SRIS（独立参考时钟独立 SSC）模式，可降低线缆成本。^[powerpoint-presentation.md:16]

## 合规性状态

根据 2019 年 Flash Memory Summit 的发布信息：^[powerpoint-presentation.md:4]

- PCI-SIG 于 **2018 年 12 月**启动了官方 PCIe 4.0 FYI 测试
- **2019 年第三季度**目标是正式合规性测试
- 多家厂商已在芯片中提供 16 GT/s PHY 和控制器
- 多家测试设备供应商提供支持
- 多家成员公司已公开宣布并展示了 PCIe 4.0 产品

## 应用场景

PCIe 技术凭借其高带宽、低延迟、低功耗和成熟生态的优势，在以下应用场景中占据主导地位：^[powerpoint-presentation.md:3]

- 虚拟现实（VR）
- 汽车
- 人工智能（AI）
- 电信
- **存储**（NVMe SSD）
- 消费电子
- 移动设备
- 数据中心

## 与其他代际的关系

| 代际 | 数据率 | 最大通道损耗 | 状态 |
|------|--------|-------------|------|
| PCIe 3.0 | 8 GT/s | — | 已发布 |
| **PCIe 4.0** | **16 GT/s** | **28 dB** | **2017 年发布，2019 年合规** |
| PCIe 5.0 | 32 GT/s | 36 dB | 2019 年 5 月发布 |
| PCIe 6.0 | 64 GT/s | — | 目标 2021 年完成 |

PCIe 4.0 是 NVMe 存储接口的重要物理层基础，为 [[NVMe]] 协议的高速数据传输提供了底层支撑。相比传统的 SAS/SATA 接口，PCIe 消除了外部存储控制器（IOC）的开销，可节省 7-10 瓦功耗，同时显著降低了系统延迟。^[powerpoint-presentation.md:10]

## 相关概念

- [[PCI Express]]
- [[NVMe]]
- [[NVMe Queue Architecture]]
- [[NVM 子系统]]
- [[I/O 虚拟化]]

---

## 资料来源

^[powerpoint-presentation.md] Das Sharma, D. (2019). *The New Generation of Storage: From PCI Express® 4.0 to PCI Express 6.0*. Flash Memory Summit 2019, Santa Clara, CA. Intel Corporation / PCI-SIG.
