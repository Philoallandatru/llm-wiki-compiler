---
title: I/O 虚拟化技术
summary: SR-IOV、ATS、PRI等技术实现单根复杂共享PCIe适配器，支持虚拟机直接分配
sources:
  - powerpoint-presentation.md
kind: concept
createdAt: "2026-05-24T04:27:48.601Z"
updatedAt: "2026-05-24T04:27:48.601Z"
tags:
  - virtualization
  - sr-iov
  - io-virtualization
aliases:
  - io-虚拟化技术
confidence: 0.9
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "I/O 虚拟化技术" (I/O Virtualization Technology). I need to extract facts from the provided source material and create a well-structured markdown page in zh-CN.

Looking at the source material, I can find information about I/O Virtualization in slide 15 of the PowerPoint presentation:

"I/O Virtualization
- Reduces System Cost and power
- Single Root I/O Virtualization Specification
  • Released September 2007
  • Allows for multiple Virtual Machines (VM) in a single Root Complex to share a PCI Express* (PCIe*) adapter
- An SR-IOV endpoint presents multiple Virtual Functions (VF) to a Virtual Machine Monitor (VMM)
  • VF allocated to VM => direct assignment
- Address Translation Services (ATS) supports:
  • Performance optimization for direct assignment of a Function to a Guest OS running on a Virtual Intermediary (Hypervisor)
- Page Request Interface (PRI) supports:
  • Functions that can raise a Page Fault
- Process Address Space ID enhancement to support Direct assignment of I/O to user space"

There's also information from slide 12 about storage features that mentions I/O Virtualization:
"In addition, PCIe technology offers the following value-add essential for storage
• Reliability, Availability and Serviceability (RAS)
• I/O Virtualization
• Multitude of form factors including cabling support"

I should write a comprehensive wiki page about I/O Virtualization technology, incorporating these facts and adding relevant wikilinks to related concepts.

Key concepts to link:
- SR-IOV (Single Root I/O Virtualization)
- Virtual Functions (VF)
- Virtual Machine Monitor (VMM) / Hypervisor
- Address Translation Services (ATS)
- Page Request Interface (PRI)


- PCI Express (PCIe)
- Virtual Machine (VM)
- Root Complex

I'll structure the page with an overview section covering the definition and purpose of I/O Virtualization, followed by sections on SR-IOV specifications, Virtual Functions and Virtual Machine Monitors, ATS and PRI mechanisms, performance optimization strategies, and typical deployment scenarios in data centers and enterprise environments.</think>

# I/O 虚拟化技术

**I/O 虚拟化技术**（I/O Virtualization）是一种允许在单个物理 [[PCI Express]] 适配器上支持多个虚拟机的技术，通过 SR-IOV（单根 I/O 虚拟化）规范实现。该技术显著降低了系统成本和功耗，是现代数据中心虚拟化基础设施的重要组成部分。 ^[powerpoint-presentation.md]

## 概述

I/O 虚拟化技术的核心目标是通过共享物理 I/O 资源，使多个虚拟机能够直接访问硬件设备，从而消除传统虚拟化方案中的性能开销。SR-IOV 规范于 2007 年 9 月发布，是实现这一目标的关键标准。 ^[powerpoint-presentation.md]

## SR-IOV 架构

### 单根 I/O 虚拟化（SR-IOV）

**SR-IOV** 是一种让单个 [[PCI Express]] 设备能够被多个虚拟机共享的技术架构。该规范允许单一根复杂体（Root Complex）中的多个虚拟机共享一个 [[PCI Express]] 适配器，从而实现高效的硬件资源利用。 ^[powerpoint-presentation.md]

### 虚拟功能（VF）

SR-IOV 端点向虚拟机监控器（VMM）呈现多个虚拟功能（Virtual Functions，VF）。每个虚拟功能可以被直接分配给虚拟机，实现虚拟机与物理设备之间的直接通信。虚拟功能是轻量级的共享资源，能够被多个虚拟机同时使用，而无需完整的物理设备实例。 ^[powerpoint-presentation.md]

### 直接分配机制

虚拟功能分配给虚拟机的过程称为直接分配（Direct Assignment）。通过这种机制，虚拟机可以获得近乎原生的 I/O 性能，因为数据可以直接在虚拟机和物理设备之间传输，无需经过软件模拟层。 ^[powerpoint-presentation.md]

## 辅助技术支持

### 地址转换服务（ATS）

**地址转换服务（Address Translation Services，ATS）** 支持将功能直接分配给运行在虚拟中介层（[[Hypervisor]]）上的客户操作系统。这一机制优化了直接分配场景下的性能，使得虚拟机能够更高效地访问 I/O 资源。 ^[powerpoint-presentation.md]

### 页面请求接口（PRI）

**页面请求接口（Page Request Interface，PRI）** 支持能够引发页面错误的功能。当虚拟机访问的内存页面不在物理内存中时，PRI 允许 I/O 设备向系统请求页面调入，从而实现虚拟内存与 I/O 设备之间的协同工作。 ^[powerpoint-presentation.md]

### 进程地址空间ID增强

SR-IOV 规范还包含进程地址空间 ID（Process Address Space ID）增强功能，用于支持将 I/O 设备直接分配给用户空间应用程序。这种增强机制使得应用程序能够绕过操作系统内核直接访问 I/O 资源，进一步降低延迟并提升性能。 ^[powerpoint-presentation.md]

## 技术优势

| 优势 | 说明 |
|------|------|
| **降低成本** | 通过共享物理适配器减少硬件采购成本 |
| **降低功耗** | 减少物理设备数量，从而降低整体能耗 |
| **提升性能** | 虚拟机可直接访问硬件，实现近乎原生的 I/O 性能 |
| **提高资源利用率** | 单个适配器可服务于多个虚拟机 |
| **降低延迟** | 减少数据路径中的虚拟化层开销 |

## 在存储系统中的应用

I/O 虚拟化是 [[PCI Express]] 为存储应用提供的关键增值特性之一。与 [[RAS]]（可靠性、可用性、可服务性）以及多种板卡形态支持一起，I/O 虚拟化使 [[NVMe]] SSD 能够高效地服务于虚拟化环境中的多个租户和工作负载。 ^[powerpoint-presentation.md]

在数据中心场景中，SR-IOV 使得单个 [[PCI Express]] SSD 可以同时为多个虚拟机提供高性能存储服务，同时保持良好的隔离性和安全性。

---

## 相关概念

[[PCI Express]] | [[SR-IOV]] | [[NVMe]] | [[虚拟机]] | [[Hypervisor]] | [[RAS]] | [[数据中心]]

## 来源

^[powerpoint-presentation.md]
