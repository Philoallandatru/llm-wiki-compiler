---
title: RAS 可靠性可用性可服务性
summary: PCIe架构中的可靠性、可用性和可服务性特性，包括CRC-32保护、链路重试、错误报告
sources:
  - powerpoint-presentation.md
kind: concept
createdAt: "2026-05-24T04:27:35.714Z"
updatedAt: "2026-05-24T04:27:35.714Z"
tags:
  - reliability
  - error-handling
  - ras
aliases:
  - ras-可靠性可用性可服务性
confidence: 0.9
provenanceState: extracted
---

<think>The user wants me to write a wiki page in Chinese (zh-CN) about "RAS 可靠性可用性可服务性" (Reliability, Availability, Serviceability). I need to draw facts only from the provided source material.

Let me analyze the source material. The main source is a PowerPoint presentation about PCI Express technology from Flash Memory Summit 2019. Let me find relevant content about RAS:

From the source, I can find information about RAS features in slide 13:

"RAS Features
Flash Memory Summit 2019
Santa Clara, CA 13
▪ PCIe® architecture supports a very high-level set of Reliability, Availability, Serviceability (RAS) features
• All transactions protected by CRC-32 and Link level Retry, covering even dropped packets
• Transaction level time-out support (hierarchical)
• Well defined algorithm for different error scenarios
• Advanced Error Reporting mechanism
• Support for degraded link width / lower speed
• Support for hot-plug"

And from slide 12:
"PCIe® Features useful for Storage
• Low-latency, High Bandwidth, Scalability, and predicable cadence of speed increase with backwards compatibility
• In addition, PCIe technology offers the following value-add essential for storage
• Reliability, Availability and Serviceability (RAS)
• I/O Virtualization
• Multitude of form factors including cabling support"

There's also information about DPC/eDPC (Downstream Port Containment) in slide 14 which relates to RAS/error containment.

I should write a comprehensive wiki page about RAS in the context of PCI Express, incorporating the information from the source material. Since the source is specifically about PCIe, I should focus on RAS in the context of PCIe/storage systems.


I'll structure the page with an introduction to RAS concepts, then detail the specific RAS capabilities offered by PCIe architecture including error detection and recovery mechanisms, hot-plug support, and degraded link handling. I'll include sections on DPC/eDPC for error containment and wrap up with key takeaways about why RAS matters for storage applications.
</think>

# RAS 可靠性可用性可服务性

**RAS** 是 **Reliability（可靠性）、Availability（可用性）、Serviceability（可服务性）** 三个术语的缩写，是评估企业级计算系统和存储基础设施关键性能指标。

## 概述

在企业级存储和数据中心的应用场景中，RAS 是衡量系统可靠运行能力的核心指标。PCI Express（PCIe）架构为存储技术提供了卓越的 RAS 能力，成为高性能存储解决方案的重要价值增强特性。 ^[powerpoint-presentation.md]

## PCIe 架构中的 RAS 功能

PCIe 架构支持一套高水平的可靠性、可用性和可服务性（RAS）功能集，这些功能对于存储应用至关重要。 ^[powerpoint-presentation.md]

### 错误检测与恢复

| 功能 | 说明 |
|------|------|
| **CRC-32 保护** | 所有事务均受 CRC-32 保护，确保数据传输的完整性 |
| **链路层重试机制** | 提供链路级重试机制，能够恢复因 CRC 错误导致的丢包 |
| **分层超时支持** | 支持事务级别的分层超时机制 |
| **错误处理算法** | 针对不同错误场景定义了完善的处理算法 |

### 高级错误报告

PCIe 提供了高级错误报告机制，能够精确记录和报告系统中发生的各类错误状况，为系统管理员提供详细的诊断信息。 ^[powerpoint-presentation.md]

### 链路降级支持

PCIe 架构支持**降级链路宽度/降低速率**功能，当物理链路出现部分通道故障时，系统可以自动将链路宽度降低（如从 x4 降至 x2 或 x1），继续保持通信能力而无需完全中断服务。 ^[powerpoint-presentation.md]

### 热插拔支持

PCIe 支持**热插拔（Hot-Plug）**功能，允许在系统运行状态下安全地添加或移除 PCIe 设备，这一特性对于需要不间断运行的数据中心环境尤为重要。 ^[powerpoint-presentation.md]

## 下游端口Containment（DPC/eDPC）

### 背景与需求

新兴的 PCIe 使用场景对错误Containment/恢复和异步移除（即热插拔）支持提出了更高的需求。 ^[powerpoint-presentation.md]

### 功能机制

**（增强型）下游端口Containment（DPC 和 eDPC）** 定义了一种错误Containment机制：

- 当检测到不可纠正的错误时，自动禁用链路
- 防止损坏的数据进一步传播
- 提供软件能力记录事务超时详情（异步移除的副作用）
- 支持清理后重新启用链路

**eDPC（增强型 DPC）** 提供根端口特定的可编程响应，用于优雅地处理下游 DPC 场景。 ^[powerpoint-presentation.md]

## 在存储系统中的重要性

RAS 特性对于存储系统至关重要，原因包括：

1. **数据完整性**：CRC-32 和链路级重试确保传输数据的完整性和可靠性
2. **业务连续性**：热插拔和链路降级支持确保服务不中断
3. **可维护性**：高级错误报告机制简化故障诊断和系统维护
4. **容错能力**：完善的错误处理算法提升系统整体可靠性

---

## 相关概念

[[PCI Express]] | [[NVMe]] | [[数据中心存储]] | [[SSD]] | [[热插拔]]

## 来源

^[powerpoint-presentation.md]
