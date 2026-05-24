---
title: PCI扩展ROM格式
summary: PCI扩展ROM的内容格式、结构和代码入口点规范，包括传统PC兼容ROM(类型0)和UEFI扩展ROM(类型3)
sources:
  - pci-firmware-specification.md
kind: concept
createdAt: "2026-05-24T07:38:25.394Z"
updatedAt: "2026-05-24T07:38:25.394Z"
tags:
  - pci
  - expansion-rom
  - firmware
aliases:
  - pci扩展rom格式
confidence: 0.95
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "PCI扩展ROM格式" (PCI Expansion ROM Format) based on the provided source material from the PCI Firmware Specification.

Let me extract the relevant information from the source material. Looking at Section 5 of the document:

1. Section 5 - PCI EXPANSION ROMS
2. Section 5.1 - PCI Expansion ROM Contents
3. Section 5.1.1 - PCI Expansion ROM Header Format
4. Section 5.1.2 - PCI Data Structure Format
5. Section 5.1.3 - Device List Format

The document mentions that this information was previously documented in the Conventional PCI Local Bus Specification (Revision 2.3 and earlier) and is now maintained solely in this document.

Key facts to extract:
- PCI Expansion ROM structure contains multiple components
- PCI Expansion ROM Header Format (Table 5-1 shows the structure, Figure 5-1)
- PCI Data Structure Format
- Device List Format
- Firmware Power-on Self Test (POST) Firmware (Section 5.2)
- PC-compatible Expansion ROMs (Code Type 0) - Section 5.2.1
- UEFI Expansion ROM (Type 3) - Section 5.2.2

Let me look at the specific tables and content:

From Table 5-1 and related content:
- The document references Figure 5-1: PCI Expansion ROM Structure
- Section 5.1.1 - PCI Expansion ROM Header Format
- Section 5.1.2 - PCI Data Structure Format
- Section 5.1.3 - Device List Format

The document also mentions:
- Section 5.2.1 covers PC-compatible Expansion ROMs (Code Type 0)
  - Including Expansion ROM Header Extensions
  - POST Firmware Extensions
  - Resizing of Expansion ROMs During INIT
  - Image Structure and Length
  - Memory Usage
  - Verification of BIOS Support
  - Permanent Memory
  - Temporary Memory
  - Memory Locations
  - Permanent Memory Size Limits
  - Multiple Requests for Memory
  - Protected Mode
  - Run-Time Expansion ROM Size
  - Relocation of Expansion ROM Run-time Code
  - Expansion ROM Placement Address
  - VGA Expansion ROM
  - Expansion ROM Placement Alignment
  - BIOS Boot Specification
  - Extended BIOS Data Area (EBDA) Usage
  - POST Memory Manager (PMM) Functions
  - Backward Compatibility of Option ROMs
  - Option ROM and IRET Handling
  - Stack Size Requirement by Expansion ROM
  - Configuration Code for Expansion ROMs
  - SM CLP Support

Section 5.2.2 covers UEFI Expansion ROMs (Type 3).

I need to compile this information into a clear, well-organized wiki article in Chinese (Simplified).
</think>

# PCI扩展ROM格式

## 概述

PCI扩展ROM（PCI Expansion ROM）是集成在PCI设备上的固件模块，用于在系统启动时提供设备初始化、配置和引导支持功能。PCI扩展ROM格式规范最初包含在《PCI本地总线规范》2.3版及更早版本中，现已迁移并维护于本规范文档中。^[pci-firmware-specification.md]

## ROM结构总览

PCI扩展ROM的物理结构由多个连续模块组成。第一个模块的起始地址必须与下一个模块之前的位置之间存在至少16字节的间隔。每个模块的起始地址必须按512字节边界对齐。^[pci-firmware-specification.md]

## 扩展ROM头部格式

每个扩展ROM模块以PCI扩展ROM头部开始。头部格式包含以下字段，用于标识ROM类型、版本和模块大小。^[pci-firmware-specification.md]

### PC兼容扩展ROM头部

对于PC兼容扩展ROM（代码类型0），头部包含扩展字段，支持POST固件扩展功能。^[pci-firmware-specification.md]

## PCI数据结构格式

在扩展ROM头部之后是PCI数据结构。该数据结构包含设备的供应商ID、设备ID等信息，使BIOS和操作系统能够识别和管理扩展ROM。^[pci-firmware-specification.md]

### 设备列表格式

设备列表格式（Device List Format）提供了扩展ROM中包含的设备信息列表，支持一个扩展ROM包含多个设备驱动程序的情况。^[pci-firmware-specification.md]

## 固件POST扩展

### PC兼容扩展ROM

PC兼容扩展ROM（Code Type 0）支持多种功能和扩展机制。^[pci-firmware-specification.md]

#### INIT期间的扩展ROM调整

在INIT（初始化）期间支持对扩展ROM进行调整大小操作，并可在INIT结束时计算新的校验和。^[pci-firmware-specification.md]

#### 镜像结构与长度

扩展ROM的镜像结构和长度定义了在INIT过程中可用的代码和数据布局。BIOS必须验证其对扩展ROM的支持能力。^[pci-firmware-specification.md]

#### 内存使用

扩展ROM的内存使用涉及永久内存（Permanent Memory）和临时内存（Temporary Memory）的分配。永久内存用于存储需要在运行时持续存在的代码和数据。 ^[pci-firmware-specification.md]

#### 运行时代码重定位

扩展ROM的运行时代码可以在系统运行时被重定位到不同的内存位置，以优化系统内存布局。^[pci-firmware-specification.md]

#### 扩展ROM放置地址

扩展ROM的放置地址由BIOS根据系统内存布局和设备需求确定。VGA扩展ROM具有特殊的放置要求，通常需要在特定内存地址范围内可用。扩展ROM放置对齐确保了代码和数据在内存中的正确对齐。^[pci-firmware-specification.md]

#### POST内存管理器

POST内存管理器（PMM）函数定义了扩展ROM在初始化过程中请求临时内存的接口，支持多次内存请求。^[pci-firmware-specification.md]

#### 扩展ROM配置代码

扩展ROM配置代码允许在系统启动时对设备进行交互式配置。配置代码执行需要特定的控制台重定向行为，并具有定义的头部格式。^[pci-firmware-specification.md]

#### 其他要求

扩展ROM必须满足特定的堆栈大小要求。选项ROM需要正确处理IRET（中断返回）操作。对于向后兼容性问题，BIOS应确保对旧版选项ROM的正确支持。 ^[pci-firmware-specification.md]

## UEFI扩展ROM

UEFI扩展ROM（Type 3）遵循UEFI规范定义的格式和要求，为UEFI环境提供设备固件支持。^[pci-firmware-specification.md]

## 相关概念

- [[PCI配置空间]] - PCI设备上用于设备识别和配置的特殊地址空间
- [[PCI主机桥]] (PCI Host Bridge) - 连接处理器与PCI总线的关键组件
- [[增强配置访问机制]] - 通过内存访问方式访问PCI配置空间的机制
- [[MCFG表]] - ACPI中用于描述内存映射配置空间基地址的表
- [[_CBA控制方法]] - 用于热插拔PCI段组配置基地址的ACPI控制方法
- [[PCI段组]] - PCI总线的逻辑分组，支持超过256条总线

---

## Sources

- [PCI Firmware Specification Revision 3.3](pci-firmware-specification.md)
