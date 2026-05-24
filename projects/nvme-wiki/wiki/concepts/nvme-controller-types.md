---
title: NVMe Controller Types
summary: NVMe控制器类型分类：I/O控制器、管理控制器、行政控制器、Discovery控制器，以及动态控制器、静态控制器、虚拟控制器等实现模式
sources:
  - nvm-express-base-specification-revision-21.md
kind: concept
createdAt: "2026-05-24T07:35:48.942Z"
updatedAt: "2026-05-24T07:35:48.942Z"
tags:
  - controller
  - types
  - architecture
aliases:
  - nvme-controller-types
  - NCT
confidence: 0.9
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "NVMe Controller Types" in Chinese (zh-CN). I need to extract information from the provided source materials to create this page.

Let me analyze the sources to find relevant information about NVMe Controller Types:

1. From `nvm-express-base-specification-revision-21.md`:
   - Section 3.1 NVM Controller Architecture (page 36)
   - Controller Types (page 37) - Figure 23: Controller Types
   - Memory-Based Controller Architecture (PCIe) (page 36)
   - Message-Based Controller Architecture (Fabrics) (page 36)
   - Section 3.3 NVM Queue Models (page 85)
   - Figure 23 on page 37 shows the taxonomy of controller types

2. From the table of contents:
   - Section 3.1 NVM Controller Architecture
     - Memory-Based Controller Architecture (PCIe)
     - Message-Based Controller Architecture (Fabrics)
     - Controller Types
     - Controller Properties

3. Looking at the figures listed:
   - Figure 23: Controller Types (page 37)
   - Figure 24: NVM Subsystem with Three I/O Controllers
   - Figure 25: NVM Subsystem with One Administrative and Two I/O Controllers
   - Figure 26: NVM Subsystem with One Administrative Controller
   - Figure 27: Controller IDs FFF0h to FFFFh
   - Figure 28: Admin Command Support Requirements
   - Figure 29: Fabrics Command Support Requirements
   - Figure 30: Common I/O Command Support Requirements

4. From the definitions section:
   - Administrative controller
   - Dynamic controller
   - Emulated controller
   - I/O controller
   - memory-based controller
   - message-based controller
   - primary controller
   - secondary controller
   - static controller

5. Looking at the text around page 37:
   - There's a figure showing controller types taxonomy
   - The system supports different controller types with various capabilities

Let me look for more specific information about the controller types and their characteristics from the source material to provide a comprehensive overview of the different controller classifications and their roles within the NVMe architecture.
</think>

# NVMe 控制器类型

**NVMe 控制器类型**（NVMe Controller Types）是指 NVMe 规范中定义的多种控制器分类方式，分别基于传输架构、管理角色和生命周期等维度进行划分。这些分类共同构成了 NVMe 存储系统的核心架构。 ^[nvm-express-base-specification-revision-21.md]

## 按传输架构分类

根据物理连接和通信机制的不同，NVMe 控制器可分为两大传输类型： ^[nvm-express-base-specification-revision-21.md]

### 基于内存的控制器（Memory-Based Controller）

基于内存的控制器采用 PCIe 总线进行通信，直接通过内存映射 I/O 访问主机内存中的队列结构。这种控制器利用 PCIe 的高速和低延迟特性，适用于直连存储场景。主机通过门铃（Doorbell）机制通知控制器有新命令待处理，控制器可直接访问提交队列和完成队列。

### 基于消息的控制器（Message-Based Controller）

基于消息的控制器通过 Fabrics 网络进行通信，支持 NVMe over Fabrics（NVMe-oF）协议。这种控制器将命令封装为胶囊（Capsule）形式在网络中传输，适用于远程存储访问场景。控制器与主机之间的命令和响应均以独立的网络数据包形式传递。

## 按管理角色分类

NVMe 控制器按其在系统中的管理职责可分为以下几类： ^[nvm-express-base-specification-revision-21.md]

### 管理控制器（Administrative Controller）

管理控制器是 NVM 子系统中负责整体管理和配置的核心角色。每个 NVM 子系统至少包含一个管理控制器，用于执行以下管理操作：

- 控制器配置和初始化
- 命名空间管理
- 安全和认证操作
- 固件更新管理

管理控制器通过管理命令集（Admin Command Set）与主机通信，是整个存储子系统的管理入口点。

### I/O 控制器（I/O Controller）

I/O 控制器专门负责处理主机与存储介质之间的实际数据传输操作。这类控制器支持 I/O 命令集（I/O Command Set），执行读写、数据刷新、比较等数据操作命令。 ^[nvm-express-base-specification-revision-21.md]

## 按生命周期分类

### 静态控制器（Static Controller）

静态控制器在 NVM 子系统初始化时创建，并在子系统整个运行生命周期中保持存在。这种控制器适用于需要持续可用的存储服务场景。

### 动态控制器（Dynamic Controller）

动态控制器可以根据需要创建和删除，允许主机根据工作负载动态调整控制器资源。在大规模虚拟化环境中，动态控制器能够更高效地利用系统资源。

### 主控制器（Primary Controller）

主控制器是承担主要管理职责的控制器，负责协调子系统中其他控制器的活动。在多控制器配置中，主控制器通常负责命名空间分配和资源共享策略的制定。

### 辅助控制器（Secondary Controller）

辅助控制器从属于主控制器，协助处理 I/O 操作或在主控制器不可用时接管特定管理功能。辅助控制器常见于高可用性存储配置中。

## 按模拟方式分类

### 本地控制器（Native Controller）

本地控制器是直接与物理存储介质交互的真实物理控制器，具有完整的命令处理和数据传输能力。

### 模拟控制器（Emulated Controller）

模拟控制器通过软件层模拟 NVMe 控制器的行为，通常用于兼容legacy接口或在虚拟化环境中提供标准化的存储接口。

## NVM 子系统中的控制器配置

NVMe 规范支持灵活多样的控制器配置方式，典型的子系统拓扑包括： ^[nvm-express-base-specification-revision-21.md]

- **单 I/O 控制器配置**：最简单的子系统中包含一个管理控制器和一个 I/O 控制器
- **多 I/O 控制器配置**：一个管理控制器配合多个 I/O 控制器，实现性能扩展
- **多端口配置**：子系统包含多个物理端口，提供端口级冗余
- **SR-IOV 虚拟化配置**：支持单根 I/O 虚拟化，允许创建多个虚拟控制器

## 控制器标识与地址空间

NVMe 控制器通过唯一的控制器标识符（Controller ID）进行识别。在 Fabrics 配置中，控制器 ID 的有效范围为 FFF0h 至 FFFFh，用于特殊管理操作和虚拟化场景。 ^[nvm-express-base-specification-revision-21.md]

## 相关概念

- [[NVMe]]
- [[NVMe Transport Models]]
- [[NVM 子系统]]
- [[命名空间]]
- [[PCI Express]]
- [[NVMe over Fabrics]]

## 来源

^[nvm-express-base-specification-revision-21.md]
