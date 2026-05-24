---
title: NVMe Queue Architecture
summary: NVMe提交队列(Submission Queue)和完成队列(Completion Queue)的配对模型、队列轮询机制、命令仲裁机制(Arbitration)以及队列优先级
sources:
  - nvm-express-base-specification-revision-21.md
kind: concept
createdAt: "2026-05-24T07:35:37.728Z"
updatedAt: "2026-05-24T07:35:37.728Z"
tags:
  - queue
  - command-processing
  - I/O
aliases:
  - nvme-queue-architecture
  - NQA
confidence: 0.95
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "NVMe Queue Architecture" based on the provided source material. Let me analyze the sources to extract relevant information.

From the NVM Express Base Specification (Revision 2.1), I can find information about:

1. **Section 2.3 NVM Queue Models** (pages 85-97):
   - Memory-based Transport Queue Model (PCIe) 
   - Message-based Transport Queue Model (Fabrics)
   - Queueing Attributes

2. **Figure 4: Taxonomy of Transport Models** (page 18)

3. **Figure 6: Queue Pair Example, 1:1 Mapping** (page 20)
4. **Figure 7: Queue Pair Example, n:1 Mapping** (page 20)

5. **Section 3.3 NVM Queue Models** (pages 85-97) - This is the detailed section on queue architecture

Key concepts to cover:
- Queue Pair (Submission Queue + Completion Queue)
- Memory-based queue model (PCIe)
- Message-based queue model (Fabrics)
- Queue associations (1:1, n:1 mappings)
- Queue attributes
- Controller initialization and queues
- Queue level resets

Let me write a comprehensive wiki page in zh-CN based on this information. I should structure it with clear headings and include wikilinks to related concepts.

The page should cover:
1. Introduction/Overview
2. Queue Pair structure
3. Memory-based queue model
4. Message-based queue model
5. Queue mappings (1:1 and n:1)
6. Queue attributes
7. Related concepts

Let me also check the flash-memory-summit-2023.md source for any relevant info about NVMe Queue Architecture - but it seems to be about VIHR SSDs, not directly about queue architecture.

I'll write the page based primarily on the NVM Express Base Specification.
</think>

# NVMe 队列架构

**NVMe 队列架构**（NVMe Queue Architecture）是 NVMe 协议中用于处理主机与存储控制器之间命令提交与完成的通信框架。该架构基于[[提交队列]]（Submission Queue, SQ）和[[完成队列]]（Completion Queue, CQ）构成的队列对（Queue Pair）机制，实现了高效的命令处理能力。 ^[nvm-express-base-specification-revision-21.md]

## 概述

NVMe 规范定义了两种传输模型的队列架构：基于内存的传输队列模型（用于 PCIe）和基于消息的传输队列模型（用于 Fabrics）。两种模型均以队列对作为命令处理的基本单元，但在具体实现上存在差异。 ^[nvm-express-base-specification-revision-21.md]

根据规范中的传输模型分类法（Taxonomy of Transport Models）， NVMe 支持的传输类型均可纳入这两种传输模型的分类体系之下。 ^[nvm-express-base-specification-revision-21.md]

## 队列对（Queue Pair）

队列对是 NVMe 队列架构的基本组成单元，每个队列对由以下两部分组成：

- **提交队列（SQ）**：主机用于向控制器提交命令的数据结构。
- **完成队列（CQ）**：控制器用于向主机报告命令完成状态的数据结构。

### 1:1 映射模型

在标准映射模式下，每个[[NVMe 控制器]]拥有独立的提交队列和完成队列。主机将命令写入提交队列，然后通过门铃（Doorbell）机制通知控制器。控制器处理完成后，将完成状态写入对应的完成队列。 ^[nvm-express-base-specification-revision-21.md]

### n:1 映射模型

在共享映射模式下，多个控制器可以共享同一组队列。这种配置常见于虚拟化环境，其中虚拟控制器通过共享的队列资源与物理控制器通信。 ^[nvm-express-base-specification-revision-21.md]

## 基于内存的传输队列模型（PCIe）

基于内存的传输队列模型专为直连存储场景设计，充分利用 PCIe 总线的高速和低延迟特性。

### 内存映射机制

在基于内存的模型中，主机通过直接内存访问（DMA）读写队列结构。控制器通过内存映射 I/O 直接访问主机内存中的提交队列和完成队列，无需经过网络协议栈。 ^[nvm-express-base-specification-revision-21.md]

### 门铃机制

主机通过写入 PCIe 配置空间中的门铃寄存器来通知控制器有新命令待处理。这种零拷贝设计最大限度地减少了数据传输开销。 ^[nvm-express-base-specification-revision-21.md]

### 控制器初始化

在基于 PCIe 的控制器初始化过程中，主机需要执行以下队列相关操作： ^[nvm-express-base-specification-revision-21.md]

1. 创建管理队列（Admin Queue）—— 包含管理提交队列（ASQ）和管理完成队列（ACQ）
2. 配置管理队列属性（AQA）
3. 设置管理队列基地址（ASQ 和 ACQ）

### 队列级重置

基于内存的传输模型支持队列级重置，允许在不影响整个控制器的情况下重置特定队列。 ^[nvm-express-base-specification-revision-21.md]

## 基于消息的传输队列模型（Fabrics）

基于消息的传输队列模型用于 NVMe over Fabrics（NVMe-oF）场景，通过网络传输命令和数据。 ^[nvm-express-base-specification-revision-21.md]

### 命令胶囊格式

在基于消息的模型中，命令和响应以**胶囊**（Capsule）形式传输： ^[nvm-express-base-specification-revision-21.md]

- **命令胶囊**：包含完整的命令信息（操作码、元数据指针、数据指针等）
- **响应胶囊**：包含命令执行结果和状态信息

这种设计确保了命令的原子性，适合在不可靠的网络环境中传输。

### 与基于内存模型的差异

| 特性 | 基于内存的模型（PCIe） | 基于消息的模型（Fabrics） |
|------|----------------------|------------------------|
| 数据传输方式 | 直接内存访问 | 网络胶囊传输 |
| 门铃机制 | PCIe 门铃寄存器 | Fabric 传输协议 |
| 数据位置 | 队列内联或 PRP/SGL 引用 | 胶囊内或 SGL 引用 |
| 连接管理 | 初始化后固定连接 | 支持动态连接/断开 |

## 队列属性（Queueing Attributes）

NVMe 规范定义了一组队列属性，用于配置队列行为： ^[nvm-express-base-specification-revision-21.md]

- **队列深度**：每个队列支持的最大条目数
- **中断配置**：完成队列的中断掩码设置
- **优先级**：多队列场景下的仲裁优先级

这些属性可通过管理命令进行配置和查询。

## 命令处理

NVMe 架构中的命令处理遵循严格的排序规则： ^[nvm-express-base-specification-revision-21.md]

- **命令排序要求**：确保命令执行顺序符合应用预期
- **融合操作（Fused Operations）**：支持将两条相关命令合并执行
- **原子操作**：提供介质级别的原子写保证
- **命令仲裁**：在多个提交队列间进行优先级仲裁

### 仲裁机制

NVMe 支持多种命令仲裁机制，包括轮询仲裁（Round Robin）和加权轮询仲裁（Weighted Round Robin with Urgent Priority Class）。 ^[nvm-express-base-specification-revision-21.md]

## 相关概念

- [[NVMe]]
- [[NVMe Transport Models]]
- [[PCI Express]]
- [[NVMe over Fabrics]]
- [[提交队列]]
- [[完成队列]]
- [[NVM 子系统]]

---

## 来源

- [NVM Express Base Specification, Revision 2.1](nvm-express-base-specification-revision-21.md)
