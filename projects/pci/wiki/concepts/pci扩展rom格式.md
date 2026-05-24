---
title: PCI扩展ROM格式
summary: PCI扩展ROM的结构和内容规范，包括ROM头格式、PCI数据结构、设备列表格式，以及传统BIOS兼容ROM（类型0）和UEFI ROM（类型3）的执行环境要求
sources:
  - pci-firmware-specification.md
kind: concept
createdAt: "2026-05-24T04:26:13.786Z"
updatedAt: "2026-05-24T04:26:13.786Z"
tags:
  - 扩展ROM
  - 固件
  - 启动
aliases:
  - pci扩展rom格式
confidence: 0.95
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "PCI扩展ROM格式" (PCI Expansion ROM Format) in Simplified Chinese (zh-CN). Let me extract the relevant information from the source material.

From the source material (pci-firmware-specification.md), I can see Section 5 "PCI EXPANSION ROMS" which covers:

1. Section 5.1 - PCI Expansion ROM Contents
   - Section 5.1.1 - PCI Expansion ROM Header Format
   - Section 5.1.2 - PCI Data Structure Format
   - Section 5.1.3 - Device List Format

2. Section 5.2 - Firmware Power-on Self Test (POST) Firmware
   - Section 5.2.1 - PC-compatible Expansion ROMs (Code Type 0)
     - Section 5.2.1.1 - Expansion ROM Header Extensions
     - Section 5.2.1.2 - POST Firmware Extensions
     - Section 5.2.1.3 - Resizing of Expansion ROMs During INIT
     - Section 5.2.1.4 - Image Structure and Length
     - Section 5.2.1.5 - Memory Usage
     - Section 5.2.1.6 - Verification of BIOS Support
     - Section 5.2.1.7 - Permanent Memory
     - Section 5.2.1.8 - Temporary Memory
     - Section 5.2.1.9 - Memory Locations
     - Section 5.2.1.10 - Permanent Memory Size Limits
     - Section 5.2.1.11 - Multiple Requests for Memory
     - Section 5.2.1.12 - Protected Mode
     - Section 5.2.1.13 - Run-Time Expansion ROM Size
     - Section 5.2.1.14 - Relocation of Expansion ROM Run-time Code
     - Section 5.2.1.15 - Expansion ROM Placement Address
     - Section 5.2.1.16 - VGA Expansion ROM
     - Section 5.2.1.17 - Expansion ROM Placement Alignment
     - Section 5.2.1.18 - BIOS Boot Specification
     - Section 5.2.1.19 - Extended BIOS Data Area (EBDA) Usage
     - Section 5.2.1.20 - POST Memory Manager (PMM) Functions
     - Section 5.2.1.21 - Backward Compatibility of Option ROMs
     - Section 5.2.1.22 - Option ROM and IRET Handling
     - Section 5.2.1.23 - Stack Size Requirement by Expansion ROM
     - Section 5.2.1.24 - Configuration Code for Expansion ROMs
     - Section 5.2.1.25 - DMTF Server Management Command Line Protocol (SM CLP) Support
   - Section 5.2.2 - UEFI Expansion ROM (Type 3)

Now I'm extracting the core specifications. The document defines the structure starting with the PCI Expansion ROM Header at offset 0, which contains the signature "PCIR" (0x55AA), followed by the vendor identification, device identification, and initialization entry point. The header also specifies the revision level, indicates whether the ROM is PC-compatible or not, and includes a pointer to the PCI Data Structure within the ROM image.

The next section maps out the actual ROM contents, with the initialization entry point at the beginning followed by various firmware components including POST firmware and runtime code. The Device List identifies which PCI devices the ROM supports, and there's a specific structure for legacy PC-compatible ROMs with their own initialization requirements and memory allocation patterns.

Now I'm compiling information about UEFI expansion ROMs as another category with Type 3 designation, along with references to key specifications like the UEFI and PCI standards that define the format requirements.
</think>

# PCI扩展ROM格式

PCI扩展ROM（PCI Expansion ROM）是存储在PCI设备上的固件模块，用于在系统启动时初始化设备、提供驱动程序或执行特定功能。根据 [[PCI固件规范]]（PCI Firmware Specification）修订版3.3的定义，PCI扩展ROM的格式、内容及代码入口点由该规范统一维护（原记载于传统PCI Local Bus Specification修订版2.3及更早版本）。^[pci-firmware-specification.md]

## ROM结构概述

PCI扩展ROM的物理结构采用分层布局，从起始处依次包含PCI ROM头、PCI数据结构、设备列表（可选）以及实际的ROM代码内容。整个ROM镜像以512字节为单位进行对齐。^[pci-firmware-specification.md]

```
+---------------------------+
|   PCI Expansion ROM Header |  ← 必须位于偏移0x0000处
+---------------------------+
|   PCI Data Structure       |  ← 紧接在头结构之后
+---------------------------+
|   Device List Table        |  ← 可选部分
+---------------------------+
|   Initialization Entry Point|  ← 系统调用入口
+---------------------------+
|   POST Firmware            |
+---------------------------+
|   Run-Time Code           |
+---------------------------+
```

## PCI扩展ROM头格式

PCI扩展ROM头必须位于ROM镜像的起始偏移0x0000处。该头结构标识了ROM的提供商、设备类型以及初始化代码的入口位置。^[pci-firmware-specification.md]

| 字段 | 偏移量 | 大小 | 描述 |
|------|--------|------|------|
| 签名 | 0x00 | 2字节 | 必须为0x55AA（小端序），用于标识有效ROM |
| 初始化入口偏移 | 0x02 | 2字节 | 相对于ROM起始地址的初始化代码偏移量 |
| 品牌标识 | 0x04 | 2字节 | 品牌标记或PCI设备标识 |
| 设备ID | 0x06 | 2字节 | 设备标识符 |
| 保留 | 0x08 | 2字节 | 保留字段 |
| 长度 | 0x0A | 2字节 | ROM镜像总长度（以512字节为单位） |
| 修订版本 | 0x0C | 1字节 | ROM修订级别 |
| 代码类型 | 0x0D | 1字节 | 0=PC兼容；3=UEFI |
| 指示符 | 0x0E | 1字节 | 特定平台标记 |
| 保留 | 0x0F | 1字节 | 保留字段 |

## PCI数据结构

PCI数据结构紧接在扩展ROM头之后定义，用于描述ROM支持的设备列表信息。该结构允许单个ROM镜像支持多种不同的PCI设备配置。^[pci-firmware-specification.md]

### 设备列表格式

设备列表（Device List）紧随PCI数据结构之后排列，每个设备占用固定字节数以提供制造商ID、设备ID及可选的子系统信息。^[pci-firmware-specification.md]

| 字段 | 偏移量 | 大小 | 描述 |
|------|--------|------|------|
| 供应商ID | 0x00 | 2字节 | PCI供应商标识符 |
| 设备ID | 0x02 | 2字节 | PCI设备标识符 |
| 设备列表结构 | — | — | 包含设备列表的完整定义 |

## PC兼容扩展ROM（代码类型0）

代码类型0的扩展ROM遵循传统 [[BIOS]] 环境下的兼容规范。系统固件在POST（开机自检）阶段会调用ROM的初始化入口，扩展ROM需要在此时完成设备的初始化配置并返回适当的控制权。^[pci-firmware-specification.md]

### INIT过程中的重置与调整

INIT是系统启动时的关键阶段，此时固件会执行扩展ROM的初始化代码。在此过程中，ROM可动态调整自身大小并重新计算校验和，以确保镜像完整性。系统固件以特定参数调用初始化代码，扩展ROM据此判断其运行环境并执行相应的初始化策略。^[pci-firmware-specification.md]

### 内存使用

扩展ROM的内存占用涉及两种模式：永久内存（Permanent Memory）和临时内存（Temporary Memory）。永久内存区域用于存储在系统运行期间持续存在的代码和数据，而临时内存则仅在初始化阶段使用，之后可被释放以供其他用途。扩展ROM代码必须明确声明其内存需求，以便系统固件进行合理分配。^[pci-firmware-specification.md]

### 保护模式支持

PC兼容扩展ROM需要支持多种处理器运行模式，包括实模式、16:16保护模式、16:32保护模式以及0:32平坦模式。扩展ROM应在初始化时检测当前处理器模式，并据此调整其执行路径，确保在不同系统环境下的兼容性。^[pci-firmware-specification.md]

### 运行时代码重定位

扩展ROM的运行时（Run-time）代码通常需要在系统完成POST后仍然保持可用状态。为实现这一点，ROM代码需要支持从其原始存储位置重定位到系统内存中的其他地址。运行时代码的重定位机制允许操作系统在需要时调用ROM提供的服务，同时避免与系统其他组件产生地址冲突。^[pci-firmware-specification.md]

### 配置代码

扩展ROM可以包含配置实用程序（Configuration Utility），允许用户在系统启动时对设备进行设置。此类配置代码的执行需要遵循特定的调用接口规范，固件负责在适当的时候将控制权传递给扩展ROM的配置代码模块。在控制台重定向环境下，配置实用程序的行为需遵循相应的兼容性要求。^[pci-firmware-specification.md]

### SM CLP支持

部分扩展ROM实现了DMTF Server Management Command Line Protocol（SM CLP）支持，提供基于命令行界面的设备管理功能。SM CLP入口点通过标准化的参数定义实现，允许系统管理软件与扩展ROM进行交互以执行诊断、配置和监控操作。^[pci-firmware-specification.md]

## UEFI扩展ROM（代码类型3）

代码类型3的扩展ROM遵循 [[UEFI]]（Unified Extensible Firmware Interface）规范。UEFI扩展ROM使用不同于传统PC兼容ROM的架构和调用约定，能够在支持 [[UEFI规范]]版本2.8或更高版本的系统上运行。^[pci-firmware-specification.md]

UEFI扩展ROM通过标准的 [[PCI I/O协议]]（PCI I/O Protocol）与系统固件进行交互，支持PCI、PCI-X及 [[PCI Express]]设备的初始化和驱动加载。UEFI驱动模型允许扩展ROM在预引导环境中执行设备驱动的加载与初始化工作。^[pci-firmware-specification.md]

## VGA扩展ROM

对于包含 [[VGA]]图形功能的PCI设备，其扩展ROM遵循特定的初始化协议。当系统检测到VGA扩展ROM时，固件会按照传统的INT 10h中断服务机制调用ROM的初始化代码，以确保显卡在系统启动的早期阶段即可正常工作。VGA扩展ROM的放置地址需要满足特定的内存区域要求，通常位于系统内存的特定地址范围内以保证与 [[BIOS]]的兼容性。^[pci-firmware-specification.md]

## 相关概念

- [[PCI配置空间]] — PCI设备用于存储设备标识和配置信息的独立地址空间
- [[PCI Express]] — PCI总线的演进版本，支持更高的带宽和更先进的功能
- [[PCI固件规范]] — 定义PCI固件接口的行业规范
- [[UEFI]] — 统一可扩展固件接口规范
- [[POST]] — 开机自检，系统启动时的初始化检测过程
- [[BIOS32服务目录]] — 用于检测和保护32位BIOS服务的数据结构
- [[MCFG]] — ACPI中用于描述PCI Express内存映射配置空间基地址的表

## 来源

^[pci-firmware-specification.md] PCI Firmware Specification, Revision 3.3, January 20, 2021, PCI-SIG
