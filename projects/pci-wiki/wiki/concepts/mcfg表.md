---
title: MCFG表
summary: ACPI中用于传递非热插拔PCI段组内存映射配置空间基地址的数据结构，支持在启动时向操作系统报告配置空间地址
sources:
  - pci-firmware-specification.md
kind: concept
createdAt: "2026-05-24T07:38:27.993Z"
updatedAt: "2026-05-24T07:38:27.993Z"
tags:
  - acpi
  - pci
  - firmware
aliases:
  - mcfg表
confidence: 0.95
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "MCFG表" (MCFG table). I need to extract information from the provided source material, which is the PCI Firmware Specification v3.3.

Let me find the relevant sections about MCFG:

From the document, I can see:
- Section 4.1 discusses "Enhanced Configuration Access Method Base Address"
- Section 4.1.2 specifically describes "MCFG Table Description"
- There's also Table 4-2 which describes the MCFG table structure
- Table 4-3 describes the Memory Mapped Enhanced Configuration Space Base Address Allocation Structure

Let me compile the key information:

1. MCFG is an ACPI table used to communicate memory mapped configuration space base addresses
2. It's used for non-hot removable PCI Segment Groups at boot
3. The table structure includes:
   - Header with Signature "MCFG"
   - Length
   - Revision
   - Checksum
   - OEMID
   - OEM Table ID
   - OEM Revision
   - Creator ID
   - Creator Revision
   - Reserved
   - Configuration space base address allocation structure(s)

4. The allocation structure includes:
   - Base Address (8 bytes) - 64-bit processor-relative base address
   - PCI Segment Group Number (2 bytes) - default is 0
   - Start Bus Number (1 byte)
   - End Bus Number (1 byte)
   - Reserved (4 bytes)

5. MCFG only communicates base addresses for non-hot removable PCI Segment Groups at boot
6. For hot plug capable PCI Segment Groups, the _CBA method is used instead

I should write this in zh-CN (Simplified Chinese) as specified. I need to include wikilinks to related concepts and a sources section.

Related concepts to link:
- ACPI
- PCI Express


- 配置空间 (Configuration Space)
- PCI Segment Group
- _CBA

Now I'll draft the wiki article with proper structure and formatting.
</think>



# MCFG 表

MCFG（Memory Configuration）表是[[高级配置与电源接口|ACPI]]规范中定义的一种系统表，用于向操作系统传递 PCI Express 和 PCI-X Mode 2 设备内存映射配置空间的基地址信息。^[pci-firmware-specification.md:38]

## 概述

在 PC 兼容系统中，增强配置访问机制（Enhanced Configuration Access Mechanism）允许通过内存操作而非传统的 I/O 端口操作（CF8/CFC 机制）来访问 PCI 配置空间。对于 PCI Express 和 PCI-X Mode 2 设备，这种内存映射方式是访问扩展配置空间（偏移量 256-4095）的唯一途径。^[pci-firmware-specification.md:38]

MCFG 表的主要作用是将内存映射配置空间的物理基地址告知操作系统，使操作系统能够直接通过内存访问来读取和写入 PCI 配置寄存器。^[pci-firmware-specification.md:40]

## 表结构

MCFG 表由表头和一个或多个**内存映射配置空间基地址分配结构**组成。^[pci-firmware-specification.md:41]

### 表头格式

| 字段 | 字节长度 | 字节偏移 | 描述 |
|------|----------|----------|------|
| Signature | 4 | 0 | 表签名，值为 `"MCFG"` |
| Length | 4 | 4 | 整个 MCFG 表的长度（字节） |
| Revision | 1 | 8 | 表修订版本号，1.0 版为 1 |
| Checksum | 1 | 9 | 整个表的校验和（必须为零） |
| OEMID | 6 | 10 | OEM 标识符 |
| OEM Table ID | 8 | 16 | OEM 表 ID（制造/型号 ID） |
| OEM Revision | 4 | 24 | OEM 修订版本号 |
| Creator ID | 4 | 28 | 创建该表的工具供应商 ID |
| Creator Revision | 4 | 32 | 创建该表的工具修订版本号 |
| Reserved | 8 | 36 | 保留字段 |

^[pci-firmware-specification.md:41]

### 基地址分配结构

每个内存映射配置空间基地址分配结构包含以下字段：^[pci-firmware-specification.md:42]

| 字段 | 字节长度 | 字节偏移 | 描述 |
|------|----------|----------|------|
| Base Address | 8 | 0 | 增强配置访问机制的处理器相对基地址（64 位） |
| PCI Segment Group Number | 2 | 8 | PCI 段组编号，默认为 0 |
| Start Bus Number | 1 | 10 | 主机桥解码的起始 PCI 总线号 |
| End Bus Number | 1 | 11 | 主机桥解码的结束 PCI 总线号 |
| Reserved | 4 | 12 | 保留字段 |

^[pci-firmware-specification.md:42]

## 关键特性

### 非热插拔 PCI 段组

MCFG 表仅用于描述系统在启动时不可热插拔的 [[PCI Segment Group]] 的基地址。每个 PCI 段组最多可包含 256 条 PCI 总线。^[pci-firmware-specification.md:40]

### 基地址解释

表中的基地址始终相对于总线号 0（无论主机桥实际解码的总线号范围从何处开始）。系统软件需要根据 MCFG 条目中的起始和结束总线号来计算所支持的内存映射配置地址范围。^[pci-firmware-specification.md:44]

### 多主机桥支持

支持多个 PCI Express 或 PCI-X 主机桥的平台，每个主机桥可以位于独立的 PCI 段组中，基地址分配在不同的内存位置。^[pci-firmware-specification.md:44]

## 与 _CBA 方法的关系

对于支持热插拔的主机桥（可引入新的 PCI 段组或现有段组内的总线范围），应使用 [[ACPI]] 控制方法 **_CBA**（Memory mapped Configuration Base Address）来动态报告配置空间的基地址，而非 MCFG 表。^[pci-firmware-specification.md:43]

MCFG 表与 _CBA 方法的区别如下：

- **MCFG 表**：静态报告启动时不可热插拔的 PCI 段组的基地址 ^[pci-firmware-specification.md:40]
- **_CBA 方法**：动态报告热插拔 PCI 段组的基地址 ^[pci-firmware-specification.md:43]

## 系统软件要求

如果操作系统不能原生理解 MMCFG 区域的预留需求，固件必须通过以下方式确保该内存区域被正确预留：

1. 在 ACPI 命名空间的根节点下（通常在 `\_SB` 下）声明一个具有 PNP0C02（PNP0C02 即 `EISAID("PNP0C02")`）_HID 的节点，作为主板资源（motherboard resource）
2. 这些资源不应在根 PCI 总线的 `_CRS` 中声明
3. 可以选择在 Int15 E820h 或 EFIGetMemoryMap 中作为保留内存返回

^[pci-firmware-specification.md:41]

## 寻址方式

内存映射配置空间的地址编码方式如下：^[pci-firmware-specification.md:39]

- **A[20+n:20]**：总线号 Bus[n:0]，n 取 0 到 7
- **A[19:15]**：设备号 Device[4:0]
- **A[14:12]**：功能号 Function[2:0]
- **A[11:8]**：扩展寄存器 Extended Register[3:0]（仅 PCI-X Mode 2 和 PCI Express）
- **A[7:0]**：寄存器 Register[7:0]

在支持最多每个设备 32 个、每个设备 8 个功能、总线号范围 0-255 的情况下，256 MiB 的窗口足以描述整个 256 总线的 PCI 段组。^[pci-firmware-specification.md:39]

## 相关概念

- [[PCI Express]] — MCFG 表主要服务的总线技术
- [[ACPI]] — 定义 MCFG 表的接口规范
- [[PCI Segment Group]] — MCFG 表中的核心寻址单元
- [[配置空间]]（Configuration Space）— PCI 设备配置寄存器的地址空间
- [[_CBA]] — 热插拔场景下动态报告配置基地址的 ACPI 方法
- [[PCI-X]] — 支持扩展配置空间的另一种 PCI 技术

## 来源

^[pci-firmware-specification.md]
