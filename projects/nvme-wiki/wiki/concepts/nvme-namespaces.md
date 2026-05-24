---
title: NVMe Namespaces
summary: 命名空间概念，定义为主机可访问的逻辑块地址集合，支持共享、私有、分散式(Dispersed)等多种类型，以及命名空间ID(NSID)的管理
sources:
  - nvm-express-base-specification-revision-21.md
kind: concept
createdAt: "2026-05-24T07:35:58.330Z"
updatedAt: "2026-05-24T07:35:58.330Z"
tags:
  - storage
  - logical-blocks
  - namespace
aliases:
  - nvme-namespaces
confidence: 0.92
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "NVMe Namespaces" in Simplified Chinese (zh-CN). I need to extract facts from the provided source material, which includes:

1. nvm-express-base-specification-revision-21.md - NVMe Base Specification Rev 2.1
2. flash-memory-summit-2023.md - About VIHR SSDs

Let me search through the content for relevant information about NVMe Namespaces.

From the NVMe Base Specification, I can see references to namespaces:
- Section 3.2 NVM Subsystem Entities: Namespaces (page 75)
- Section 1.5 Definitions includes namespace-related terms
- Figure 65: NSID Types and Relationship to Namespace
- Figure 66: NSID Types
- Namespace attachment commands
- Namespace management commands

The TOC mentions:
- "3.2 NVM Subsystem Entities" with subsections "Namespaces", "NVM Sets", etc.
- "Namespace Management" section
- "Namespace Attachment command" 
- "Namespace Write Protection"
- "Dispersed Namespaces"
- "Namespace List" data structures

Let me compile the relevant information from the source material into a comprehensive wiki page about NVMe Namespaces.

Key facts to include:
1. What a namespace is (logical grouping of non-volatile storage)
2. Namespace ID (NSID)
3. Types of namespaces mentioned in Figure 65/66 (Allocated namespace, specified namespace, etc.)
4. Relationship to NVM subsystem, controller, etc.
5. Commands related to namespace management
6. Namespace features like write protection, dispersed namespaces

I should create a well-structured page with proper wikilinks to related concepts.</think>

# NVMe 命名空间（Namespace）

**命名空间**（Namespace，简称 NS）是 NVMe 规范中的核心存储抽象概念，代表 [[NVM 子系统]] 中由一个或多个控制器导出的、可由主机系统访问的逻辑块地址（LBA）空间。命名空间将物理存储介质抽象为离散的逻辑单元，使主机能够以标准化的方式对存储资源进行分区、分配和管理。

## 基本定义

在 NVMe 规范中，命名空间被定义为一段连续的非易失性存储空间，该空间可通过 [[NVMe]] 命令集进行读写操作。每个命名空间拥有唯一的**命名空间标识符**（Namespace ID，简称 NSID），用于在主机与控制器通信时标识目标存储区域。

根据规范中的定义，存在以下几种命名空间类型：

- **已分配的命名空间**（Allocated Namespace）：已创建并分配给控制器的命名空间。
- **指定的命名空间**（Specified Namespace）：符合特定条件的命名空间。
- **底层命名空间**（Underlying Namespace）：分布式命名空间（Dispersed Namespace）的组成部分。
- **私有命名空间**（Private Namespace）：仅限特定主机访问的命名空间。
- **共享命名空间**（Shared Namespace）：可被多个主机访问的命名空间。
- **导出的命名空间**（Exported Namespace）：通过 Fabrics 接口向远程主机提供的命名空间。

## 命名空间与控制器的关系

一个 [[控制器]] 可以关联多个命名空间，命名空间通过 NSID 在命令中引用。在 NVMe 架构中，命名空间是存储层级结构的重要组成部分，介于顶层 [[NVM 子系统]] 和底层物理存储介质（如 NAND 闪存介质单元）之间。

典型的 NVM 子系统包含一个或多个控制器，每个控制器可挂载一个或多个命名空间。这种一对多的关系允许存储系统在单一物理设备内实现存储资源的逻辑分区与隔离。

## 命名空间标识符

NSID 是命名空间的关键标识符，范围从 1 到 0xFFFFFFE（十进制 16777214）。特殊值 0xFFFFFFFF 被保留用于广播寻址，表示所有命名空间。规范中还定义了其他 NSID 类型，具体关系可参考规范中的 "NSID Types and Relationship to Namespace" 图表。

## 命名空间管理功能

NVMe 规范提供了一系列命令用于命名空间的管理与操作：

- **Namespace Attachment 命令**：将命名空间附加到指定控制器或从控制器分离。
- **Namespace Management 命令**：创建和删除命名空间。
- **Namespace Write Protection 命令**：设置命名空间的写保护状态，防止意外数据修改。
- **Identify 命令**：查询命名空间的属性与特征信息。
- **Dispersed Namespace**：支持将多个底层命名空间聚合为一个逻辑命名空间。

## 在 NVM 子系统中的角色

命名空间是 NVM 子系统的核心实体之一。根据 NVMe Base Specification Rev 2.1 中的 NVM 存储模型，NVM 子系统可包含多种存储层级结构：

- 简单单命名空间 NVM 子系统
- 多命名空间 NVM 子系统
- 支持 NVM Set 的复杂 NVM 子系统

命名空间可进一步与 **NVM Set** 关联，实现更精细的资源分配与隔离。NVM Set 是逻辑上划分的存储资源集合，可包含多个命名空间，支持独立的管理与QoS控制。

## 相关概念

- [[NVM 子系统]]
- [[控制器]]
- [[NVMe]]
- [[NVMe Transport Models]]
- [[NVM Set]]
- [[I/O 命令集]]

---

## 资料来源

^[nvm-express-base-specification-revision-21.md] NVM Express. *NVM Express Base Specification, Revision 2.1*. August 2024.
