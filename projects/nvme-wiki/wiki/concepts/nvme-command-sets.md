---
title: NVMe Command Sets
summary: NVMe命令集体系，包括管理命令集(Admin Command Set)、I/O命令集(I/O Command Set)和Fabrics命令集，以及各命令集支持的命令类型
sources:
  - nvm-express-base-specification-revision-21.md
kind: concept
createdAt: "2026-05-24T07:35:33.755Z"
updatedAt: "2026-05-24T07:35:33.755Z"
tags:
  - commands
  - protocol
  - interface
aliases:
  - nvme-command-sets
  - NCS
confidence: 0.95
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "NVMe Command Sets" in Chinese (zh-CN). I need to extract information from the provided source material and create a well-structured markdown page.

Let me analyze the source material from the NVM Express Base Specification, Revision 2.1:

1. The specification defines NVMe Command Sets
2. Figure 5 on page 19 shows "Types of NVMe Command Sets"
3. There are different command sets mentioned:
   - Admin Command Set (Section 5)
   - Fabrics Command Set (Section 6)
   - I/O Command Set (Section 7)
   - NVM Command Set specific definitions (Section 1.7)
   - I/O Command Set specific definitions (Section 1.6 and 2.3)

Key points from the specification:
- The NVM Express Specification Family consists of multiple documents
- Admin Commands are for controller management
- I/O Commands are for data operations
- There are different types based on transport (Memory-based vs Message-based)
- Command ordering, fused operations, atomic operations
- Command Arbitration

From the flash-memory-summit-2023.md, I can see references to VIHR SSD which uses NVMe command sets.

Let me create a comprehensive wiki page about NVMe Command Sets based on these sources.
</think>

# NVMe 命令集

**NVMe 命令集**（NVMe Command Sets）是 NVM Express 规范中定义的一组标准化命令，用于主机与 NVMe 存储控制器之间的通信与数据操作。NVMe 规范族（NVM Express Specification Family）由多个规范文档组成，涵盖基础规范以及各命令集的具体定义。 ^[nvm-express-base-specification-revision-21.md]

## 命令集分类

根据 NVMe Base Specification Rev 2.1 中的命令集分类法（Types of NVMe Command Sets），NVMe 命令集主要分为以下几类： ^[nvm-express-base-specification-revision-21.md]

### 管理命令集（Admin Command Set）

管理命令集定义了用于管理 NVMe 控制器的命令，涵盖控制器配置、固件更新、命名空间管理、安全操作等核心管理功能。这些命令通过 Admin Submission Queue（管理提交队列）提交，通常仅需要管理员权限即可执行。

规范中，管理命令集包括以下主要命令：

- **Abort**：中止指定的 I/O 命令
- **Asynchronous Event Request**：请求异步事件通知
- **Capacity Management**：容量管理操作
- **Device Self-test**：设备自检功能
- **Firmware Commit / Firmware Image Download**：固件更新相关命令
- **Format NVM**：格式化 NVM 存储
- **Get Features / Set Features**：获取和设置控制器特性
- **Get Log Page / Identify**：日志页面获取和控制器/命名空间识别
- **Namespace Attachment / Management**：命名空间附加与管理
- **Sanitize**：安全擦除操作

^[nvm-express-base-specification-revision-21.md:202-215]

### Fabrics 命令集（Fabrics Command Set）

Fabrics 命令集是专为基于消息的传输模型（[[NVMe Transport Models]]）设计的命令，用于建立和维护主机与远程存储子系统之间的连接。该命令集包含在 Section 6 中定义。

主要命令包括：

- **Connect**：建立与 NVMe 控制器的连接
- **Disconnect**：断开连接
- **Property Get / Property Set**：属性读写操作
- **Authentication Receive / Send**：身份验证命令

^[nvm-express-base-specification-revision-21.md:449-458]

### I/O 命令集（I/O Command Set）

I/O 命令集用于执行实际的数据读写操作。规范中定义了 I/O 命令集特定的定义，包括端域组（Endurance Group）、格式化索引、SMART 数据读取等命令。

主要 I/O 命令包括：

- **Read / Write**：基本的读写命令
- **Flush**：刷新缓存数据到非易失性存储
- **Compare**：比较指定数据与存储数据
- **Dataset Management**：数据集管理
- **Reservation Commands**：预留操作（Register、Acquire、Release、Report）
- **I/O Management Receive / Send**：I/O 管理操作
- **Cancel**：取消指定命令

^[nvm-express-base-specification-revision-21.md:460-474]

## 命令处理机制

### 命令排序要求

NVMe 规范定义了命令的排序要求，确保在并发执行多条命令时保持数据一致性和正确的执行顺序。命令提交后，控制器需要按照规范要求处理命令的执行顺序。

### 融合操作（Fused Operations）

NVMe 支持将两条命令融合为一个执行单元，主要有两种融合模式：

- **Compare and Write**：先将数据与存储内容比较，匹配后再写入
- **Fused Submission**：融合两条提交命令作为一个原子操作

融合操作确保了某些需要先检查后执行的场景下的原子性。

### 命令仲裁

当存在多个待处理的命令时，控制器使用**命令仲裁机制**（Command Arbitration）决定处理顺序。NVMe 规范定义了多种仲裁机制：

- **轮询仲裁**（Round Robin）：按顺序循环处理各队列中的命令
- **带优先级的加权轮询仲裁**（Weighted Round Robin with Urgent Priority Class）：为不同队列分配权重，高优先级队列优先处理
- **自有方式**（Owner's Choice）：控制器自行决定处理顺序

^[nvm-express-base-specification-revision-21.md:99-101]

### 命令重试

在发生通信丢失等错误时，NVMe 规范定义了命令重试的机制。然而，规范也指出了一些**不应重试的场景**（Incorrect Command Retry Handling），包括：

- **写后写**（Write after Write）：重试可能导致数据重复写入
- **非幂等命令**（Non-Idempotent Command）：重试可能产生非预期副作用
- **重试后仍失败**（Retried Command Does Not Succeed）：多次重试失败后应停止
- **重试影响其他主机**（Retried Command Affects Another Host）：多主机环境下的重试可能影响其他访问

^[nvm-express-base-specification-revision-21.md:680-683]

## 命令与存储模型的关联

### NVM 存储模型

NVMe 命令集与 NVM 存储模型（NVM Storage Model）紧密关联。存储实体层次包括：

- **Domain（域）**：最高层级的存储组织单元
- **Endurance Group（端域组）**：具有相似 endurance 特性的媒体单元集合
- **NVM Set**：可由主机独立寻址的 NVM 资源子集
- **Reclaim Group / Reclaim Unit Handle / Reclaim Unit**：用于存储资源回收的层级结构
- **Namespace（命名空间）**：可供主机访问的逻辑块地址空间
- **Media Unit（媒体单元）**：物理存储介质的逻辑管理单元

^[nvm-express-base-specification-revision-21.md:24-29]

### 命令集对存储实体的操作

不同命令集对存储实体的操作范围和粒度有所不同：

- **Identify Controller**：返回控制器支持的功能和能力信息
- **Identify Namespace**：返回指定命名空间的属性信息
- **Format NVM**：可指定操作范围，影响特定命名空间或整个控制器
- **Sanitize**：安全擦除整个存储介质

规范提供了多种灵活的数据放置选项，如**分散命名空间**（Dispersed Namespace）和**灵活数据放置**（Flexible Data Placement），允许命令集在更细粒度上管理存储资源。

## 与 [[VIHR SSD]] 的关联

在微软提出的垂直集成高韧性 SSD（VIHR SSD）架构中，NVMe 命令集的健康监控和诊断能力被充分利用。通过 NVMe 标准化的日志页面（如遥测日志页）和错误恢复机制，VIHR SSD 能够实现：

- 故障预测与预防性数据迁移
- 故障系统弹性恢复
- 根因分析

## 相关概念

- [[NVMe]]
- [[NVM 子系统]]
- [[NVMe Transport Models]]
- [[命令队列]]
- [[命名空间]]
- [[VIHR SSD]]

## 来源

- [NVM Express Base Specification, Revision 2.1](nvm-express-base-specification-revision-21.md)
