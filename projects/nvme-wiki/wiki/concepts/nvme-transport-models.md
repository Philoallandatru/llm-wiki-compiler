---
title: NVMe Transport Models
summary: NVMe传输层模型：基于内存的传输模型(PCIe)和基于消息的传输模型(Fabrics)，包括各自的队列机制和数据传输方式
sources:
  - nvm-express-base-specification-revision-21.md
kind: concept
createdAt: "2026-05-24T07:35:22.402Z"
updatedAt: "2026-05-24T07:35:22.402Z"
tags:
  - transport
  - PCIe
  - fabrics
aliases:
  - nvme-transport-models
  - NTM
confidence: 0.95
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "NVMe Transport Models". Let me analyze the source material provided.

From the NVMe Base Specification (Revision 2.1), I can find relevant information about transport models:

1. **Memory-Based Transport Model (PCIe)** - mentioned in section 2.1 (page 19)
2. **Message-Based Transport Model (Fabrics)** - mentioned in section 2.2 (page 21)

Key points from the table of contents and text:

- Section 2.1: Memory-Based Transport Model (PCIe)
- Section 2.2: Message-Based Transport Model (Fabrics)
  - Fabrics and Transports
  - NVM Subsystem Ports for Fabrics
  - Discovery Service
  - Capsules and Data Transfer
  - Authentication
- Section 2.3: NVM Storage Model
  - Storage Entities
  - I/O Command Sets
  - NVM Subsystem Examples
- Figure 4: Taxonomy of Transport Models

From page 18 (Figure 4), there's a "Taxonomy of Transport Models" that shows the types of transport models.

From page 19-20:
- Memory-Based Transport Queue Model (PCIe)
- Queue Pair Example, 1:1 Mapping
- Queue Pair Example, n:1 Mapping

From page 21-24:
- Message-Based Transport Queue Model (Fabrics)
- NVMe over Fabrics Layering
- Command Capsule Format
- Response Capsule Format

Let me also check the other source files for any additional context about NVMe Transport Models.

Looking at the source files provided:
1. nvm-express-base-specification-revision-21.md - the main specification
2. flash-memory-summit-2023.md - about VIHR SSDs

I should write a comprehensive wiki page about NVMe Transport Models based on the Base Specification. Let me structure the page:


- Brief introduction explaining what NVMe Transport Models are
- Detailed coverage of the two primary models: Memory-Based (PCIe) and Message-Based (Fabrics)
- Include relevant diagrams and examples from the specification
- Provide cross-references to related concepts like NVMe over Fabrics, PCIe, and command processing
- Maintain a neutral, informative tone throughout
- Conclude with a Sources section citing the Base Specification
</think>

# NVMe 传输模型

NVMe 传输模型（Transport Models）是 NVMe 规范中定义的不同数据传输架构，用于在主机系统与 [[NVMe]] 存储控制器之间建立通信。根据 NVMe Base Specification Rev 2.1，NVMe 标准支持两种核心传输模型：基于内存的传输模型（Memory-Based Transport Model）和基于消息的传输模型（Message-Based Transport Model）。

## 模型分类概述

根据 NVMe 规范中的传输模型分类法（Taxonomy of Transport Models），两种传输模型在架构设计上存在根本性差异：

- **基于内存的传输模型**：基于 [[PCI Express]]（PCIe）物理层，通过内存直接访问实现主机与控制器之间的高速数据传输。
- **基于消息的传输模型**：基于 Fabrics 网络架构，通过网络消息传递实现远程存储设备的访问。

这两种模型分别对应 NVMe 技术栈中不同的应用场景：基于内存的模型适用于本地 [[固态硬盘]] 直连场景，而基于消息的模型则支持 [[NVMe over Fabrics]] 远程访问场景。

## 基于内存的传输模型（PCIe）

基于内存的传输模型是 NVMe 最初定义的传输架构，专为直连存储（Direct-Attached Storage）场景设计。该模型利用 PCIe 总线的高带宽和低延迟特性，实现主机与 NVMe 控制器之间的直接通信。

### 队列模型

在基于内存的传输模型中，主机与控制器之间通过**队列对**（Queue Pair）进行通信，每个队列对由一个提交队列（Submission Queue, SQ）和一个完成队列（Completion Queue, CQ）组成。主机通过写入提交队列中的命令描述符向控制器发送 I/O 请求，控制器完成处理后向完成队列写入结果。

规范中定义了两种队列映射方式：

- **1:1 映射**：每个控制器拥有一个专属的提交队列和完成队列，映射关系简单明确，适用于单核或多核系统的标准 I/O 处理。
- **n:1 映射**：多个控制器共享同一组队列，允许多个虚拟控制器通过单一队列对进行通信，适用于虚拟化环境中的资源共享场景。

### 门铃机制

基于内存的传输模型采用**门铃（Doorbell）**机制进行队列通知。主机通过写入 PCIe 配置空间中的门铃寄存器来通知控制器有新的命令待处理，控制器通过内存映射 I/O 直接访问主机内存中的队列结构。这种零拷贝设计最大限度地减少了数据传输开销。

## 基于消息的传输模型（Fabrics）

基于消息的传输模型是 NVMe 规范为支持网络存储而扩展的传输架构，允许主机通过 Fabrics 网络访问远程 [[NVM 子系统]]。该模型定义在 NVMe over Fabrics（NVMe-oF）规范中，支持 RDMA、TCP、FC 等多种传输绑定。

### 分层架构

NVMe over Fabrics 采用清晰的分层架构设计：

- **NVMe 命令集层**：定义 NVMe 命令和响应的格式，包括命令胶囊（Capsule）和响应胶囊（Response Capsule）两种基本数据结构。
- **传输映射层**：将 NVMe 命令封装为适配特定 Fabrics 传输协议的消息格式。
- **Fabrics 传输层**：承载实际的网络数据传输，支持 InfiniBand、RDMA、TCP、光纤通道等多种传输介质。

### 命令胶囊格式

在基于消息的传输模型中，NVMe 命令以胶囊（Capsule）形式在网络中传输。命令胶囊包含完整的命令信息（命令操作码、元数据指针、数据指针等），控制器处理完成后返回响应胶囊。这种设计确保了命令的原子性，适合在不可靠的网络环境中传输。

### 发现服务

基于 Fabrics 的传输模型引入了**发现服务**（Discovery Service）机制，类似于存储网络中的目录服务。主机首先连接到发现控制器（Discovery Controller），获取可用 NVMe 子系统的列表和连接参数，然后根据需要建立到目标存储子系统的连接。发现服务简化了大规模存储网络的配置和管理。

### 认证机制

基于消息的传输模型支持基于 Fabric Zoning 的访问控制和基于 TLS 的安全通道，确保网络环境下数据传输的安全性。

## 比较与应用场景

| 特性 | 基于内存的传输模型（PCIe） | 基于消息的传输模型（Fabrics） |
|------|---------------------------|------------------------------|
| 物理层 | PCIe 总线 | 网络（RDMA/TCP/FC 等） |
| 延迟 | 极低（微秒级） | 较低（亚毫秒至毫秒级） |
| 传输距离 | 短（本地直连） | 长（支持远程访问） |
| 典型应用 | 服务器本地 SSD | 数据中心存储网络、分布式存储 |

## 相关概念

- [[NVMe]]
- [[PCI Express]]
- [[NVMe over Fabrics]]
- [[NVM 子系统]]
- [[命令队列]]
- [[I/O 命令集]]

---

## 来源

- [NVM Express Base Specification, Revision 2.1](nvm-express-base-specification-revision-21.md)
