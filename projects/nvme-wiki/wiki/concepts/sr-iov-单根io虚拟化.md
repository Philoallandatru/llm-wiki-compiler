---
title: SR-IOV 单根I/O虚拟化
summary: 单根I/O虚拟化规范(SR-IOV)允许单一根复合体内的多个虚拟机共享PCIe适配器，端点向虚拟机监控器呈现多个虚拟功能(VF)，支持ATS和PRI进行性能优化
sources:
  - powerpoint-presentation.md
kind: concept
createdAt: "2026-05-24T07:36:49.064Z"
updatedAt: "2026-05-24T07:36:49.064Z"
tags:
  - 虚拟化
  - I/O
aliases:
  - sr-iov-单根io虚拟化
confidence: 0.95
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "SR-IOV 单根I/O虚拟化" (Single Root I/O Virtualization). I need to extract information from the provided source material and write a well-structured markdown page in Chinese (zh-CN).

Looking at the source material (powerpoint-presentation.md), I can find relevant information about SR-IOV in slide 15:

"I/O Virtualization
Flash Memory Summit 2019
Santa Clara, CA 15
▪ Reduces System Cost and power
▪ Single Root I/O Virtualization Specification
• Released September 2007
• Allows for multiple Virtual Machines (VM) in a single Root Complex to share a PCI Express* (PCIe*) adapter
▪ An SR-IOV endpoint presents multiple Virtual Functions (VF) to a Virtual Machine Monitor (VMM)
• VF allocated to VM => direct assignment
▪ Address Translation Services (ATS) supports:
• Performance optimization for direct assignment of a Function to a Guest OS running on a Virtual Intermediary (Hypervisor)
▪ Page Request Interface (PRI) supports:
• Functions that can raise a Page Fault
▪ Process Address Space ID enhancement to support Direct assignment of I/O to user space"

Let me also note that SR-IOV is briefly mentioned as a feature useful for storage (slide 12) as part of I/O Virtualization capabilities.

I should write a comprehensive wiki page based on this information, following the format requirements:
1. Clear, well-structured markdown
2. Include facts only from the provided source material
3. Include a Sources section at the end
4. Suggest wikilinks to related concepts where appropriate
5. Write in a neutral, informative tone
6. Be concise but thorough
7. Output in zh-CN
8. Include citations at the end of prose paragraphs
9. No citations on headings, list items, or code blocks

Let me structure the page:


- Overview
- Key Components (VF, PF)
- How it Works
- Supporting Technologies (ATS, PRI)
- Benefits
- Related Concepts
- Sources
</think>



# SR-IOV 单根 I/O 虚拟化

**SR-IOV**（Single Root I/O Virtualization，单根 I/O 虚拟化）是由 PCI-SIG 制定的开放标准规范，于 2007 年 9 月正式发布。该技术允许单个 [[PCI Express]] 适配器被多个虚拟机组（Virtual Machine）直接共享，从而在虚拟化环境中实现高性能的 I/O 访问。 ^[powerpoint-presentation.md]

## 概述

传统虚拟化架构中，I/O 设备需经过虚拟化管理器（VMM/Hypervisor）进行软件模拟转发，这会引入显著的性能开销。SR-IOV 通过将物理设备虚拟化能力下沉至硬件层面，使每个虚拟机能够直接访问分配给它的虚拟功能（Virtual Function），有效降低了 I/O 延迟并提升了吞吐量。 ^[powerpoint-presentation.md]

SR-IOV 是 PCI Express 架构中 I/O 虚拟化技术的核心组成部分，也是 PCIe 技术为存储等应用场景提供的重要价值加成特性之一。

## 核心组件

SR-IOV 架构包含两种关键功能类型：

### 物理功能（Physical Function, PF）

物理功能是 SR-IOV 设备的主功能实体，作为设备的核心功能呈现给主机。PF 拥有完整的 PCI 配置空间，能够配置和管理设备上的虚拟功能，并负责处理涉及虚拟功能资源分配的 I/O 操作。

### 虚拟功能（Virtual Function, VF）

虚拟功能是 SR-IOV 设备的轻量级虚拟化表示，每个 VF 从属于一个物理功能。一个 SR-IOV 终端（endpoint）可向虚拟化管理器呈现多个虚拟功能，这些 VF 可直接分配给虚拟机使用，使虚拟机能够在没有 Hypervisor 介入的情况下直接与 I/O 设备通信。 ^[powerpoint-presentation.md]

## 工作原理

SR-IOV 的虚拟化分配流程如下： ^[powerpoint-presentation.md]

1. **VF 分配**：虚拟化管理器识别设备支持的虚拟功能数量，并将相应的 VF 分配给目标虚拟机
2. **直接分配**：VF 以透传（pass-through）方式直接分配给虚拟机，虚拟机内的操作系统或驱动能够直接访问该虚拟功能
3. **资源共享**：多个虚拟机共享同一个物理适配器，但各自拥有独立的 VF，实现了硬件资源的高效隔离与复用

这种直接分配机制消除了传统软件模拟路径中的性能开销，显著降低了 I/O 延迟。

## 支持技术

SR-IOV 与以下技术协同工作，以提供完整的虚拟化 I/O 解决方案：

### 地址翻译服务（Address Translation Services, ATS）

ATS 支持将功能直接分配给运行在虚拟中间层（Hypervisor）上的 Guest OS，用于优化直接分配场景下的性能。该机制允许 I/O 设备直接访问虚拟机的虚拟地址空间，无需 Hypervisor 介入地址翻译过程。 ^[powerpoint-presentation.md]

### 页面请求接口（Page Request Interface, PRI）

PRI 用于支持能够引发页面错误（Page Fault）的功能。当设备访问的内存页面不在物理内存中时，PRI 允许设备向系统发起页面请求，由操作系统负责调入所需页面。这一机制确保了 VF 在内存资源动态分配的环境中正常运行。 ^[powerpoint-presentation.md]

### 进程地址空间标识符（Process Address Space ID）

进程地址空间标识符增强技术支持将 I/O 设备直接分配给用户空间应用程序，进一步优化了直接 I/O 分配的使用场景，拓宽了 SR-IOV 在高性能计算和低延迟交易系统中的应用范围。

## 主要优势

基于源文档，SR-IOV 提供了以下核心价值： ^[powerpoint-presentation.md]

- **降低系统成本与功耗**：通过共享物理适配器减少所需硬件设备数量
- **提升 I/O 性能**：消除软件模拟开销，缩短 I/O 路径
- **支持多虚拟机并发访问**：单个 Root Complex 下可运行多个虚拟机共享 PCIe 适配器
- **灵活的虚拟化配置**：通过 PF 管理 VF 资源分配策略

## 应用场景

SR-IOV 广泛应用于需要高性能 I/O 的虚拟化环境，包括： [[PCI Express]] 存储适配器在数据中心中的虚拟化部署、NFV（网络功能虚拟化）基础设施、云计算平台的 I/O 密集型工作负载、以及金融交易系统等对延迟敏感的应用。

## 相关概念

- [[PCI Express]] — SR-IOV 的协议基础
- [[虚拟化]] — SR-IOV 的应用领域
- [[多根 I/O 虚拟化]]（MR-IOV）— SR-IOV 的扩展，支持多 Root Complex 场景
- [[地址翻译服务]]（ATS）— SR-IOV 的配套技术
- [[页面请求接口]]（PRI）— SR-IOV 的配套技术

---

## 来源

^[powerpoint-presentation.md]
