---
title: UEFI PCI服务与驱动模型
summary: UEFI规范中定义的PCI根桥协议和PCI驱动模型，包括PCI I/O协议，支持UEFI环境下的PCI设备驱动开发
sources:
  - pci-firmware-specification.md
kind: concept
createdAt: "2026-05-24T07:38:59.911Z"
updatedAt: "2026-05-24T07:38:59.911Z"
tags:
  - uefi
  - pci
  - driver-model
aliases:
  - uefi-pci服务与驱动模型
confidence: 0.9
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "UEFI PCI服务与驱动模型" (UEFI PCI Services and Driver Model). I need to extract relevant information from the provided source material (PCI Firmware Specification) and write a well-structured markdown page.

Let me analyze the source material for information related to UEFI PCI services and driver model:

1. Section 3: UEFI PCI Services (pages 32-33 in the PDF)
   - UEFI Overview
   - UEFI Driver Model
   - PCI Root Bridge Protocol
   - PCI Driver Model
   - PCI-X Mode 2 and PCI Express
   - EFI Byte Code
   - Graphics Output Protocol
   - Device State at Firmware/Operating System Handoff

2. Section 3.1: UEFI Driver Model
   - PCI Root Bridge Protocol
   - PCI Driver Model

3. Section 3.1.1: PCI Root Bridge Protocol
   - Device handle with Device Path Protocol and PCI Root Bridge Protocol
   - Provides I/O abstraction
   - Used by PCI Bus Driver for Memory, I/O, Configuration cycles
   - Supports bus mastering DMA

4. Section 3.1.2: PCI Driver Model
   - Supports PCI Bus Drivers and PCI Device Drivers
   - For Conventional PCI, PCI-X, and PCI Express
   - PCI Bus Drivers create child device handles with Device Path Protocol and PCI I/O Protocol
   - PCI Device Drivers produce I/O abstraction

5. Section 3.2: PCI-X Mode 2 and PCI Express
   - Software compatible with Conventional PCI
   - UEFI PCI I/O Protocol supports up to 4 GiB of configuration space
   - Covers extended configuration space (4 KiB)

6. Section 3.3: EFI Byte Code
   - Virtual machine for loading and executing UEFI device drivers
   - Platform and CPU independent
   
7. Section 3.4 covers Graphics Output Protocol, which abstracts video output and removes dependency on legacy VGA hardware and INT 10h BIOS calls. Section 3.5 describes the device state at firmware handoff, where system firmware configures boot and console devices, the operating system takes ownership after ExitBootServices(), and firmware must report host bridges in the ACPI namespace while the OS configures hot-plugged devices and PCI-to-PCI bridges below a certain hierarchy level.
</think>

# UEFI PCI服务与驱动模型

## 概述

UEFI（Unified Extensible Firmware Interface）PCI服务定义了一套在预启动环境中管理PCI设备的接口规范。UEFI规范（第2.4版或更高版本）描述了操作系统与平台固件之间的接口，该接口以数据表的形式提供，包含平台相关信息和引导及运行时服务调用，为操作系统提供标准化的引导环境。UEFI具有处理器无关性。^[pci-firmware-specification.md]

## UEFI驱动模型

UEFI驱动模型旨在支持在实现UEFI固件的系统中预启动环境下运行的驱动程序执行。这些驱动程序可以管理和控制平台上的硬件总线和设备，也可以提供某些软件派生的平台特定服务。^[pci-firmware-specification.md]

UEFI驱动模型被设计为以支持设备驱动程序和总线驱动程序的方式扩展UEFI规范。将UEFI驱动模型应用于PCI领域时，UEFI规范定义了PCI根桥协议（PCI Root Bridge Protocol）和PCI驱动模型，并描述了如何在UEFI环境中编写PCI总线驱动程序和PCI设备驱动程序。^[pci-firmware-specification.md]

## PCI根桥协议

PCI根桥在UEFI中被表示为一个设备句柄，该句柄包含设备路径协议（Device Path Protocol）实例和PCI根桥协议（PCI Root Bridge Protocol）实例。^[pci-firmware-specification.md]

PCI根桥协议为PCI根桥提供了I/O抽象能力，供主机总线执行操作。此协议被PCI总线驱动程序使用，以在PCI总线上执行PCI内存访问、PCI I/O访问和PCI配置周期访问。该协议还提供服务以执行不同类型的总线主控DMA（Direct Memory Access）操作。^[pci-firmware-specification.md]

PCI根桥协议将设备特定代码从系统内存映射中抽象出来。这允许系统设计人员在不影响消费基本系统资源的平台无关代码的情况下，对系统内存映射进行更改。例如支持处理器视角与PCI设备视角之间非恒等内存映射I/O（MMIO）的系统。^[pci-firmware-specification.md]

## PCI驱动模型

PCI驱动模型被设计为以支持PCI总线驱动程序和PCI设备驱动程序的方式扩展UEFI驱动模型。该模型适用于传统PCI（Conventional PCI）、PCI-X和PCI Express。^[pci-firmware-specification.md]

PCI总线驱动程序管理系统中存在的PCI总线。PCI总线驱动程序创建子设备句柄，这些句柄必须包含设备路径协议实例和PCI I/O协议（PCI I/O Protocol）实例。PCI I/O协议被PCI设备驱动程序使用，以访问PCI控制器上的内存和I/O资源。^[pci-firmware-specification.md]

PCI设备驱动程序管理系统中存在的PCI控制器。PCI设备驱动程序产生可用于引导UEFI兼容操作系统的I/O抽象。^[pci-firmware-specification.md]

## PCI-X Mode 2与PCI Express

PCI-X Mode 2和PCI Express提供的软件编程模型与传统PCI软件兼容。^[pci-firmware-specification.md]

UEFI PCI I/O协议支持高达4 GiB的配置空间，因此能够覆盖PCI-X Mode 2和PCI Express的扩展配置空间（4 KiB大小）。^[pci-firmware-specification.md]

为识别功能类型（如传统PCI、PCI-X与PCI Express），UEFI驱动程序使用兼容性配置空间中的设备ID、供应商ID和功能指针（Capability Pointer）。^[pci-firmware-specification.md]

在预启动期间，UEFI使用单一定时器中断，UEFI设备驱动程序采用轮询方式，因此INTx、MSI或MSI-X不被UEFI使用。^[pci-firmware-specification.md]

## EFI字节码

UEFI规范定义了一个虚拟机，该虚拟机提供了一种与平台和CPU无关的机制，用于加载和执行UEFI设备驱动程序。虚拟机的指令集称为EFI字节码（EFI Byte Code，简称EBC）。^[pci-firmware-specification.md]

## 图形输出协议

图形输出协议（Graphics Output Protocol，GOP）在UEFI规范中定义，旨在消除对传统VGA硬件和INT 10h BIOS的硬件支持需求。GOP提供了一种在视频屏幕上绘制的软件抽象。^[pci-firmware-specification.md]

需要注意的是，图形适配器仍需高性能驱动程序以在操作系统中高速运行。此外，VGA硬件可以支持GOP。^[pci-firmware-specification.md]

## 固件与操作系统交接时的设备状态

系统固件仅需要配置引导设备和控制台设备。本节规定了固件交接时PCI子系统的状态，并为操作系统提供了如何确定特定组件是否由固件配置的指导。PCI子系统指符合PCI、PCI-X或PCI-Express规范 compliant 的组件。本节中“PCI规范”指PCI、PCI-X或PCI Express规范。^[pci-firmware-specification.md]

固件在将控制权移交给操作系统之前拥有PCI子系统。交接点是UEFI `ExitBootServices()`返回之后。操作系统加载器调用`ExitBootServices()`后，操作系统拥有PCI子系统。^[pci-firmware-specification.md]

固件可以提供预启动用户交互功能，允许系统操作员指定所需的引导和控制台设备。固件必须配置通往控制台（输入和输出）的完整路径以及引导设备，包括芯片组、桥接器和多功能设备。设备配置是加载操作系统加载器、显示启动消息以及允许操作员与引导过程交互所必需的。^[pci-firmware-specification.md]

固件可以可选地配置系统中的所有设备和桥接器。固件不需要配置引导和控制台设备以外的设备。由于并非所有设备都可能在操作系统交接之前完成配置，操作系统需要知道特定的BAR寄存器是否已由固件配置。操作系统通过检查设备命令寄存器中的I/O Enable位和Memory Enable位以及扩展ROM BAR enable位来确定。如果使能位被设置，则对应的资源寄存器已被配置。^[pci-firmware-specification.md]

操作系统需要在以下情况下配置PCI子系统：热插拔期间、设备从复位状态恢复所需时间过长时、以及在固件设计配置的级别以下的PCI-to-PCI桥接器。^[pci-firmware-specification.md]

## 相关概念

- [[PCI段组]] (PCI Segment Group) - 用于逻辑分组PCI总线的软件概念
- [[MCFG表]] - ACPI中用于传达内存映射配置空间基地址的表
- [[PCI根桥协议]] (PCI Root Bridge Protocol) - UEFI中提供PCI根桥I/O抽象的协议
- [[PCI I/O协议]] (PCI I/O Protocol) - UEFI中用于访问PCI控制器内存和I/O的协议
- [[_CBA方法]] - ACPI中用于返回内存映射配置基地址的控制方法
- [[UEFI]] - 统一可扩展固件接口

## Sources

^[pci-firmware-specification.md] PCI Firmware Specification Revision 3.3, Section 3 (UEFI PCI Services), January 20, 2021
