---
title: NVM Express (NVMe) Architecture Overview
summary: NVMe协议的核心架构，包括控制器(Controller)、NVM子系统(NVM Subsystem)、命名空间(Namespace)的层次结构和互连关系
sources:
  - nvm-express-base-specification-revision-21.md
kind: concept
createdAt: "2026-05-24T07:35:48.350Z"
updatedAt: "2026-05-24T07:35:48.350Z"
tags:
  - storage
  - architecture
  - specification
aliases:
  - nvm-express-nvme-architecture-overview
  - NE(AO
confidence: 0.95
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "NVM Express (NVMe) Architecture Overview" in zh-CN (Simplified Chinese). Let me analyze the source material from the NVMe Base Specification Revision 2.1 document.

From the table of contents and content provided, I can see the document covers:

1. Introduction (Chapter 1)
   - Overview
   - NVMe Specification Family
   - Scope
   - Conventions
   - Definitions
   - References

2. Theory of Operation (Chapter 2)
   - Memory-Based Transport Model (PCIe)
   - Message-Based Transport Model (Fabrics)
   - NVM Storage Model
   - Extended Capabilities Theory

3. NVM Express Architecture (Chapter 3)
   - NVM Controller Architecture
   - Memory-Based Controller Architecture (PCIe)
   - Message-Based Controller Architecture (Fabrics)
   - Controller Types
   - Controller Properties
   - NVM Subsystem Entities
   - Namespaces
   - NVM Sets
   - Endurance Groups
   - Reclaim Groups, Reclaim Unit Handles, and Reclaim Units
   - Domains and Divisions
   - NVM Queue Models
   - Command Processing
   - Controller Initialization
   - Shutdown Processing
   - Resets
   - NVM Capacity Model
   - Keep Alive

4. Data Structures (Chapter 4)
   - Submission Queue Entry
   - Completion Queue Entry
   - Data Pointer Layouts (PRPs and SGLs)
   - Feature Values
   - Identifier Format and Layout
   - List Data Structures
   - NVMe Qualified Names
   - UTF-8 String Processing

5. Admin Command Set (Chapter 5)
   - Common Admin Commands
   - Memory-Based Transport Admin Commands (PCIe)
   - Message-Based Transport Admin Commands (Fabrics)

6. Fabrics Command Set (Chapter 6)

7. I/O Commands (Chapter 7)


8. Extended Capabilities (Chapter 8) - covering both PCIe and Fabrics transport implementations. Chapter 9 addresses error reporting and recovery mechanisms. The document also includes several annexes covering sanitize operations, host considerations, and power management.

Now I'll focus on structuring the architecture overview wiki page with key topics like the layered architecture, transport models, subsystem components, command processing, and storage organization.</think>

# NVM Express (NVMe) 架构概述

**NVM Express (NVMe)** 是一套专为[[固态硬盘]]等[[非易失性存储器]]设计的标准化接口规范，旨在充分发挥高速闪存介质的性能潜力。该规范由 NVM Express 组织维护，当前最新版本为 2.1（NVM Express® Base Specification, Revision 2.1）。 ^[nvm-express-base-specification-revision-21.md]

## 架构分层

NVMe 架构采用分层设计，核心层包括：

- **NVMe 指令集层**：定义命令格式、队列机制和错误处理
- **传输层**：支持 PCIe（内存映射传输）和 Fabrics（消息传输）两种模型
- **物理层**：对应具体的接口协议（如 PCIe 或网络结构）

NVMe 规范族涵盖基础规范及针对不同应用场景的专用指令集扩展。 ^[nvm-express-base-specification-revision-21.md]

## 传输模型

NVMe 支持两种传输模型，适用于不同的部署场景：

### 内存映射传输模型 (PCIe)

基于 [[PCI Express]] 总线的传输方式，NVMe 命令通过内存映射 I/O 直接与控制器通信。该模型采用**队列对**（Queue Pair）机制，包括：

- **提交队列**（Submission Queue, SQ）：主机向控制器发送命令
- **完成队列**（Completion Queue, CQ）：控制器向主机返回命令结果

支持 1:1 或 n:1 的队列映射配置。 ^[nvm-express-base-specification-revision-21.md]

### 消息传输模型 (Fabrics)

基于网络的传输方式，支持 [[NVMe over Fabrics]] 协议，允许通过RDMA、TCP 等传输绑定远程访问存储资源。该模型的核心概念包括：

- **Capsule（胶囊）**：封装命令和响应的基本单元
- **NVM 子系统端口**（NVM Subsystem Port）：对外暴露的访问入口
- **发现服务**（Discovery Service）：帮助客户端定位可用资源

消息传输模型支持身份验证和安全通道机制。 ^[nvm-express-base-specification-revision-21.md]

## NVM 子系统实体

NVMe 定义了层次化的存储组织结构：

### 命名空间（Namespace）

命名空间是主机可访问的存储逻辑单元，类似于传统存储中的 LUN。每个命名空间拥有独立的标识符（NSID），支持以下类型：

- **分配命名空间**（Allocated Namespace）：已绑定至控制器的命名空间
- **私有命名空间**（Private Namespace）：仅限特定主机访问
- **共享命名空间**（Shared Namespace）：可被多个主机并发访问
- **导出命名空间**（Exported Namespace）：通过 Fabrics 暴露的命名空间 ^[nvm-express-base-specification-revision-21.md]

### NVM Set

NVM Set 是分配给特定主机的 NVM 资源集合，包含一个或多个命名空间，支持细粒度的资源隔离和性能控制。

### Endurance Group（ endurance groups）

 Endurance Group 用于管理具有相似寿命特性的存储区域，便于进行寿命均衡（wear leveling）和错误处理。

### Reclaim Groups 与 Reclaim Units

存储回收机制的基本单元，Reclaim Group 包含多个 Reclaim Unit Handle (RUH)，而 Reclaim Unit (RU) 是实际执行垃圾回收的最小单位。

### Domain（域）和 Division

Domain 是报告容量和错误信息的逻辑单元，可进一步划分为多个 Division，支持分层管理。

## 控制器架构

NVMe 控制器负责处理命令并管理存储介质，按功能分为：

- **管理控制器**（Administrative Controller）：处理管理命令
- **I/O 控制器**（I/O Controller）：处理读写等 I/O 命令
- **发现控制器**（Discovery Controller）：专为 Fabrics 环境提供资源发现服务
  - **直接发现控制器**（Direct Discovery Controller, DDC）
  - **集中式发现控制器**（Centralized Discovery Controller, CDC）

按生命周期又可分为**静态控制器**和**动态控制器**。 ^[nvm-express-base-specification-revision-21.md]

控制器通过属性（Property）机制向外暴露配置和状态信息，包括控制器能力（CAP）、控制器配置（CC）、控制器状态（CSTS）等关键寄存器。

## 命令处理

NVMe 命令处理遵循以下机制：

- **命令排序**：支持按提交顺序或显式栅栏（Fence）命令排序
- **融合操作**（Fused Operations）：将两条命令绑定为原子单元执行
- **原子操作**（Atomic Operations）：确保跨多个逻辑块的写操作一致性
- **命令仲裁**：支持轮询、加权轮询等仲裁算法决定队列优先级

每条命令通过提交队列条目（Submission Queue Entry）提交，控制器完成处理后通过完成队列条目（Completion Queue Entry）返回结果，包含状态码和命令特定信息。 ^[nvm-express-base-specification-revision-21.md]

## 数据传输

NVMe 支持两种数据指针布局方式：

- **PRP（Physical Region Page）**：适用于线性内存区域，通过页对齐的物理地址列表描述数据位置
- **SGL（Scatter Gather List）**：更灵活的分段描述方式，支持复杂的数据布局，包括数据块、位桶、分段描述符等类型

元数据区域（Metadata Region）可用于存储与每个逻辑块关联的端到端保护信息。 ^[nvm-express-base-specification-revision-21.md]

## 控制器生命周期

### 初始化

控制器初始化包括内存映射传输（PCIe）和消息传输（Fabrics）两种路径，需要完成队列创建、属性配置和就绪状态确认等步骤。

### 关闭

支持优雅关闭流程，确保缓存数据落盘并通知主机，避免数据丢失。

### 复位

NVMe 定义了三级复位机制：NVM 子系统复位、控制器级复位和队列级复位。 ^[nvm-express-base-specification-revision-21.md]

## 扩展能力

NVMe 规范支持丰富的扩展功能，包括：

- **多路径 I/O 与命名空间共享**：支持 [[多路径]] 配置和共享命名空间
- **非对称命名空间访问**（ANA）：报告不同路径的性能特性差异
- **持久内存区域**（PMR）：支持 [[持久内存]] 访问
- **遥测**（Telemetry）：标准化数据采集接口用于故障诊断
- **灵活数据放置**（FDP）：支持优化数据放置策略
- **预测延迟模式**（Predictable Latency Mode）：提供可预测的 I/O 延迟
- **错误恢复**：支持多种恢复级别（Read Recovery Level） ^[nvm-express-base-specification-revision-21.md]

## 容量模型

NVMe 定义了容量报告机制，支持多种 NVM 子系统组织方式：

- **纵向组织**：层次化的存储结构，从 Domain 到 Media Unit
- **横向组织**：支持多个 NAND 通道并行

容量信息通过标准日志页向主机报告。 ^[nvm-express-base-specification-revision-21.md]

## 错误报告与恢复

NVMe 规范定义了完整的错误处理体系：

- **命令和队列错误处理**：包括重试和中止机制
- **介质和数据错误处理**：支持纠错码和数据完整性检查
- **控制器致命状态**（CFS）：标识不可恢复的错误条件
- **通信丢失处理**：包括命令重试和超时管理

## 相关概念

- [[PCI Express]] — PCIe 传输层
- [[NVMe over Fabrics]] — 网络传输扩展
- [[命名空间]] — 存储逻辑单元
- [[NVM Set]] — 资源分配集合
- [[固态硬盘]] — 应用场景

---

## 来源

- [@nvm-express-base-specification-revision-21.md]
