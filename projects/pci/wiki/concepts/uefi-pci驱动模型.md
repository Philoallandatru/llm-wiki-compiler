---
title: UEFI PCI驱动模型
summary: UEFI规范中定义的PCI设备驱动框架，包括PCI根桥协议（提供内存、I/O和配置周期抽象）、PCI驱动模型、以及在UEFI预引导环境中轮询驱动的执行方式
sources:
  - pci-firmware-specification.md
kind: concept
createdAt: "2026-05-24T04:25:31.667Z"
updatedAt: "2026-05-24T04:25:31.667Z"
tags:
  - UEFI
  - 驱动模型
  - 协议
aliases:
  - uefi-pci驱动模型
confidence: 0.95
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "UEFI PCI驱动模型" (UEFI PCI Driver Model) based on the provided source material from the PCI Firmware Specification.

Let me extract the relevant information from the source material:

From the PCI Firmware Specification (pages 32-33):

Section 3.1 - UEFI Driver Model
- The UEFI Driver Model is designed to support the execution of drivers that run in the pre-boot environment
- These drivers may manage and control hardware buses and devices on the platform
- Or they may provide some software derived platform specific services
- The UEFI Driver Model is designed to extend the UEFI Specification in a way that supports device drivers and bus drivers
- It contains information required by UEFI driver writers to design and implement any combination of bus drivers and device drivers that a platform may need to boot an UEFI-compliant operating system

Section 3.1.1 - PCI Root Bridge Protocol
- A PCI Root Bridge is represented in UEFI as a device handle that contains a Device Path Protocol instance and a PCI Root Bridge Protocol instance
- PCI Root Bridge Protocol provides an I/O abstraction for a PCI Root Bridge
- This protocol is used by a PCI Bus Driver to perform PCI Memory, PCI I/O, and PCI Configuration cycles on a PCI Bus
- It also provides services to perform different types of bus mastering DMA on a PCI bus
- PCI Root Bridge Protocol abstracts device specific code from the system memory map
- This allows system designers to make changes to the system memory map without impacting platform independent code

Section 3.1.2 - PCI Driver Model
- The PCI Driver Model is designed to extend the UEFI Driver Model in a way that supports PCI Bus Drivers and PCI Device Drivers
- This applies to Conventional PCI, PCI-X, and PCI Express


- PCI Bus Drivers manage PCI buses present in a system, creating child device handles that must contain a Device Path Protocol instance and a PCI I/O Protocol instance. The PCI I/O Protocol is used by the PCI Device Driver to access memory and I/O on a PCI controller.
- PCI Device Drivers manage PCI controllers present on PCI buses, producing an I/O abstraction that may be used to boot an UEFI compliant operating system.

Now I'll write a comprehensive wiki page about UEFI PCI Driver Model in zh-CN with citations.
</think>

# UEFI PCI 驱动模型

**UEFI PCI 驱动模型**（UEFI PCI Driver Model）是 UEFI 规范中定义的用于在预启动环境中执行驱动程序的框架，旨在支持 PCI 总线驱动程序和 PCI 设备驱动程序的开发。该模型适用于传统 PCI、PCI-X 和 PCI Express 系统。 ^[pci-firmware-specification.md:35-35]

## 概述

UEFI（统一可扩展固件接口）规范定义了一种介于操作系统与平台固件之间的接口，以数据表和引导/运行时服务调用的形式存在。UEFI PCI 驱动模型作为 UEFI 驱动模型在 PCI 领域的扩展，为驱动程序编写者提供了在预启动环境下运行驱动程序所需的设计和实现规范。 ^[pci-firmware-specification.md:32-32]

UEFI 驱动模型支持的驱动程序可以在系统中管理和控制硬件总线与设备，或提供特定于平台的软件服务。通过应用 UEFI 驱动模型到 PCI 领域，UEFI 规范定义了 PCI 根桥协议和 PCI 驱动模型的完整规范。 ^[pci-firmware-specification.md:32-33]

## PCI 根桥协议

在 UEFI 中，PCI 根桥（PCI Root Bridge）被表示为一个设备句柄（device handle），该句柄包含以下两个关键组件： ^[pci-firmware-specification.md:33-33]

- **设备路径协议实例**（Device Path Protocol）
- **PCI 根桥协议实例**（PCI Root Bridge Protocol）

PCI 根桥协议为 PCI 根桥提供了 I/O 抽象层，其主要功能包括： ^[pci-firmware-specification.md:33-33]

1. 使 PCI 总线驱动程序能够执行 PCI 内存访问、PCI I/O 访问和 PCI 配置访问周期
2. 提供执行不同类型总线主控 DMA（直接内存访问）的服务

PCI 根桥协议还将设备特定代码从系统内存映射中抽象出来。这一设计允许系统设计者在不影响平台无关代码的情况下对系统内存映射进行修改。例如，当系统采用非恒等内存映射 I/O（non-identity MMIO）时，处理器侧的地址视图与 PCI 设备侧的地址视图可能不同，PCI 根桥协议能够处理这种映射差异。 ^[pci-firmware-specification.md:33-34]

## PCI 总线驱动程序

PCI 总线驱动程序负责管理系统中存在的 PCI 总线。PCI 总线驱动程序必须为其管理的每个 PCI 总线创建子设备句柄，这些子设备句柄必须包含： ^[pci-firmware-specification.md:35-35]

- **设备路径协议实例**
- **PCI I/O 协议实例**

PCI I/O 协议由 PCI 设备驱动程序使用，用于访问 PCI 控制器上的内存和 I/O 资源。 ^[pci-firmware-specification.md:35-35]

## PCI 设备驱动程序

PCI 设备驱动程序负责管理存在于 PCI 总线上的 PCI 控制器。PCI 设备驱动程序产生的 I/O 抽象可用于引导符合 UEFI 规范的操作系统。 ^[pci-firmware-specification.md:35-35]

## 驱动模型层级结构

UEFI PCI 驱动模型采用分层架构，典型的调用关系如下：

1. **PCI 根桥协议** → 由 PCI 总线驱动程序调用
2. **PCI 总线驱动程序** → 创建子设备句柄和 PCI I/O 协议
3. **PCI 设备驱动程序** → 使用 PCI I/O 协议访问控制器资源

这种分层设计使得各层之间职责清晰，便于代码复用和平台移植。 ^[pci-firmware-specification.md:33-35]

## 参见

- [[UEFI]] — 统一可扩展固件接口
- [[PCI]] — 外设组件互连标准
- [[PCI Express]] — PCI Express 规范
- [[PCI 配置空间]] — PCI 配置地址空间
- [[ACPI]] — 高级配置和电源接口

## 参考文献

^[pci-firmware-specification.md]

- PCI Firmware Specification Revision 3.3, Section 3 "UEFI PCI Services", Section 3.1 "UEFI Driver Model" (pp. 32-35)
