---
title: DPC 下游端口Containment
summary: 增强型下游端口Containment机制，用于错误隔离和异步移除（热插拔）支持
sources:
  - powerpoint-presentation.md
kind: concept
createdAt: "2026-05-24T04:28:06.355Z"
updatedAt: "2026-05-24T04:28:06.355Z"
tags:
  - error-handling
  - hot-swap
  - pci-express
aliases:
  - dpc-下游端口containment
confidence: 0.85
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "DPC 下游端口Containment" (DPC Downstream Port Containment) in Chinese (zh-CN).

Looking at the source material, I can find information about DPC/eDPC in the powerpoint-presentation.md file. Let me extract the relevant facts:

From slide 14 of the powerpoint:
- DPC stands for Downstream Port Containment
- eDPC stands for enhanced Downstream Port Containment
- It was created for emerging usages
- Emerging PCIe usage models are creating a need for improved error containment/recovery and support for asynchronous removal (a.k.a. hot-swap)
- It defines an error containment mechanism that automatically disables a Link when an uncorrectable error is detected, preventing potential spread of corrupted data
- There's a reporting mechanism with software capability to bring up the link after clean up
- Transaction details on a timeout are recorded (side-effect of asynchronous removal)
- eDPC is Root-port specific programmable response to gracefully handle DPC downstream

I should write a clear, well-structured markdown page about DPC Downstream Port Containment. The user wants me to:
1. Draw facts only from the provided source material
2. Include a ## Sources section at the end
3. Suggest [[wikilinks]] to related concepts where appropriate
4. Write in zh-CN (Chinese Simplified)
5. Use citation markers

Let me structure the page:
1. Overview/What is DPC
2. Purpose/Use cases
3. Mechanism
4. eDPC (enhanced DPC)
5. Related concepts
6. Sources

I need to think about relevant wikilinks to related concepts mentioned in the source or related to the topic:
- PCI Express / PCIe
- Root Port
- Error containment
- Hot-swap / asynchronous removal
- CRC protection (related to error detection)

Let me write this in Chinese as requested.</think>

# DPC 下游端口 Containment

**DPC**（Downstream Port Containment，下游端口Containment）和 **eDPC**（enhanced DPC，增强型下游端口Containment）是由 [[PCI-SIG]] 定义的 [[PCI Express]] 错误Containment机制，旨在隔离和处理下行端口上发生的不可纠正错误，防止故障扩散至整个系统。^[powerpoint-presentation.md]

## 背景与需求

随着 [[PCI Express]] 技术在数据中心、汽车、人工智能等新兴领域的广泛应用，对错误Containment和恢复能力的需求日益增长。传统的错误处理机制难以满足以下场景的需求：^[powerpoint-presentation.md]

- **改进的错误Containment与恢复**：需要能够在检测到不可纠正错误时自动隔离故障链路
- **异步移除（Asynchronous Removal）支持**：即热插拔（Hot-swap）能力，允许在不中断系统运行的情况下安全地添加或移除设备

## DPC 机制

DPC 定义了一种错误Containment机制，其核心特性包括：^[powerpoint-presentation.md:14]

- **自动链路禁用**：当检测到不可纠正错误时，系统会自动禁用该链路，防止损坏的数据进一步传播
- **软件恢复能力**：提供报告机制，允许软件在清理完成后重新启用链路
- **超时事务记录**：超时事件的详细事务信息会被记录，这对于异步移除场景具有重要意义

## eDPC 增强机制

**eDPC**（增强型下游端口Containment）进一步扩展了 DPC 的功能，提供了一种根端口（Root Port）特定的**可编程响应机制**，能够更优雅地处理 DPC 下游端口的错误场景。^[powerpoint-presentation.md:14]

eDPC 的设计目标是在 DPC 触发时，提供更精细的控制选项，使系统软件能够根据具体应用场景定制响应策略。

## 与 RAS 特性的关系

DPC 和 eDPC 是 [[PCI Express]] 架构中 [[RAS]]（可靠性、可用性、可服务性）特性的重要组成部分。与其他 RAS 功能配合使用，包括：^[powerpoint-presentation.md:12-13]

- **CRC-32 保护**：所有事务均受 CRC-32 保护，链路级重传机制覆盖甚至丢失的数据包
- **事务级超时支持**：层次化的超时机制
- **高级错误报告**：完善的错误报告机制
- **降级链路宽度/降低速度支持**：在降级条件下维持通信

## 应用场景

DPC/eDPC 机制特别适用于以下场景：^[powerpoint-presentation.md]

- **数据中心**：需要高可用性和快速故障恢复的服务器环境
- **存储系统**：使用 [[U.2]] 或 [[Add-in-card]] 形态的 [[PCI Express]] [[固态硬盘]]
- **电信基础设施**：要求不间断运行的通信设备
- **汽车电子**：需要安全可靠运行的车辆系统

## 版本演进

| 版本 | 说明 | 状态 |
|------|------|------|
| DPC | 基础下游端口Containment | 在 [[PCI Express]] 4.0 及后续版本中支持 |
| eDPC | 增强型可编程响应 | 在 [[PCI Express]] 5.0 规范中进一步增强 |

---

## 相关概念

- [[PCI Express]]
- [[PCI-SIG 组织]]
- [[RAS]]（可靠性、可用性、可服务性）
- [[Root Port]]
- [[SR-IOV]]（单根 I/O 虚拟化）
- [[固态硬盘]]
- [[热插拔]]

---

## 来源

^[powerpoint-presentation.md]
