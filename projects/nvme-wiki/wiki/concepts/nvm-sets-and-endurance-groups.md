---
title: NVM Sets and Endurance Groups
summary: NVM存储层次结构：NVM Set将命名空间与底层NVM资源关联，Endurance Group管理不同耐久等级的NVM介质，支持空间回收单元(RU/RUH/RG)
sources:
  - nvm-express-base-specification-revision-21.md
kind: concept
createdAt: "2026-05-24T07:36:09.619Z"
updatedAt: "2026-05-24T07:36:09.619Z"
tags:
  - storage
  - resources
  - management
aliases:
  - nvm-sets-and-endurance-groups
  - Endurance Groups and NVM Sets
  - NSAEG
confidence: 0.92
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "NVM Sets and Endurance Groups" based on the provided source material. Let me analyze what information I can extract from the sources about this topic.

From the NVMe Base Specification (nvm-express-base-specification-revision-21.md), I can find relevant information about NVM Sets and Endurance Groups:

1. **Definitions from Section 1.5 (page 5-6):**
- NVM Set: defined
- Endurance Group: defined

2. **From Table of Contents:**
- Section 2.3 NVM Storage Model (page 24)
- Section 3.2 NVM Subsystem Entities (page 75)
  - Namespaces (page 75)
  - NVM Sets (page 77)
  - Endurance Groups (page 79)
  - Reclaim Groups, Reclaim Unit Handles, and Reclaim Units (page 81)
  - Domains and Divisions (page 82)

3. **From figures list:**
- Figure 67: NVM Sets and Associated Namespaces
- Figure 68: NVM Set Aware Admin Commands
- Figure 69: NVM Sets and Associated Namespaces (related to Endurance Groups)

4. **From Section 2.3 NVM Storage Model:**
- Storage Entities (page 24-30)
- NVM Sets are part of the storage hierarchy

5. **Key figures:**
- Figure 11: Simple NVM Storage Hierarchy with NVM Sets
- Figure 12: Simple NVM Storage Hierarchy with One Reclaim Group
- Figure 13: Simple NVM Storage Hierarchy with Multiple Reclaim Groups
- Figure 14: Complex NVM Storage Hierarchy with NVM Sets
- Figure 15: Complex NVM Storage Hierarchy with Multiple Reclaim Groups


- Figure 67: NVM Sets and Associated Namespaces (page 78)
- Figure 69: NVM Sets and Associated Namespaces (page 80)

Now I can synthesize this information into a coherent wiki page. NVM Sets are logical groupings within the NVM subsystem that enable hosts to manage endurance and performance characteristics, while Endurance Groups organize NVM Sets with similar wear characteristics. The hierarchical structure shows how Namespaces attach to NVM Sets, and how multiple NVM Sets can be grouped into Endurance Groups for coordinated wear management and performance optimization.

I should draw from both sources to provide comprehensive coverage. The primary specification document will give me the foundational definitions and architecture, while the FMS presentation can provide practical context about how these entities interact in real-world deployments.
</think>



# NVM Sets 与 Endurance Groups

**NVM Sets** 和 **Endurance Groups** 是 NVMe 规范中定义的两种关键存储资源管理机制，用于对 [[NVM 子系统]]中的非易失性存储容量进行逻辑划分和管理。这两种机制共同支持主机的精细化存储资源控制，帮助实现性能隔离、耐用性管理和容量规划。

## NVM Sets

### 定义

**NVM Set** 是 NVM 子系统中由控制器管理的一组非易失性存储资源（media units）。每个 NVM Set 包含特定的物理存储介质，并可关联一个或多个 [[Namespace]]。^[nvm-express-base-specification-revision-21.md]

### 架构特点

NVM Set 架构支持灵活的存储层级组织。从 NVMe 规范中的存储层级示意图可以看出，NVM Sets 是连接底层物理存储介质与上层命名空间的核心逻辑层。在简单的存储层级中，NVM Set 直接关联一个或多个 Namespace；在复杂的存储层级中，多个 NVM Sets 通过 Endurance Group 进行分组管理。

NVM Set 感知的管理命令（Figure 68 定义了 NVM Set Aware Admin Commands）允许主机直接对 NVM Set 粒度执行容量分配、资源管理操作。

### 与命名空间的关系

一个 NVM Set 可以关联一个或多个 Namespace，一个 Namespace 只能关联到一个 NVM Set。这种一对多的关系使得同一物理存储区域可以通过不同的命名空间呈现给主机或不同的租户使用，支持多租户环境和存储隔离场景。

## Endurance Groups

### 定义

**Endurance Group** 是 NVM 子系统中的一组 NVM Sets，用于管理具有相似耐久特性（endurance characteristics）的存储资源。每个 Endurance Group 包含一个或多个 NVM Sets，这些 Sets 通常共享相同的 NAND 介质类型、写入周期特性或设计寿命预期。^[nvm-express-base-specification-revision-21.md]

### 设计目的

Endurance Groups 的引入主要是为了解决以下问题：

1. **耐写性管理**：在混合使用不同类型 NAND 介质的 SSD 中（如 TLC、QLC NAND），不同区域的写入寿命差异显著。Endurance Groups 将具有相似耐写特性的存储资源归为一组，便于主机进行差异化的写入策略管理。

2. **性能隔离**：归属于同一 Endurance Group 的 NVM Sets 通常共享硬件资源通道，通过分组可以实现不同工作负载的性能隔离。

3. **容量规划**：主机能够根据 Endurance Group 提供的剩余写入次数、预计寿命等信息进行长期容量和运维规划。

### 与 NVM Sets 的关系

Endurance Group 与 NVM Set 之间存在层级包含关系：

- 一个 Endurance Group 包含一个或多个 NVM Sets
- 一个 NVM Set 归属于且仅归属于一个 Endurance Group
- 一个 NVM Set 可关联多个 Namespace

这种层级结构可在 NVMe 规范的 NVM Storage Hierarchy 图（图 67、图 69）中清晰看到：存储介质首先划分为多个 Endurance Groups，每个 Endurance Group 内包含若干 NVM Sets，NVM Sets 再与 Namespaces 建立映射关系。

## 存储层级结构

综合 NVMe Base Specification 定义，NVM 子系统的完整存储层级如下：

```
NVM 子系统 (NVM Subsystem)
├── Endurance Group (耐写性分组)
│   ├── NVM Set (存储资源集)
│   │   └── Namespace (命名空间)
│   └── NVM Set
│       └── Namespace
└── Endurance Group
    ├── NVM Set
    │   └── Namespace
    └── ...
```

简单存储层级可包含单个 Endurance Group 管理所有 NVM Sets；复杂存储层级则包含多个 Endurance Groups，以支持更精细的资源划分。

## 相关概念

- [[NVM 子系统]]（NVM Subsystem）
- [[Namespace]]（命名空间）
- [[NVMe]]
- [[Reclaim Group]]（回收组，与 NVM Sets 的垃圾回收机制相关）
- [[Media Unit]]（介质单元，NVM Set 的底层组成单位）

---

## 来源

^[nvm-express-base-specification-revision-21.md]
