---
title: MCFG表与_CBA方法
summary: ACPI规范中用于向操作系统传达内存映射PCI配置空间基地址的机制：MCFG表用于引导时不 可热拔插的PCI段组，_CBA方法用于运行时热插拔场景
sources:
  - pci-firmware-specification.md
kind: concept
createdAt: "2026-05-24T04:25:28.092Z"
updatedAt: "2026-05-24T04:25:28.092Z"
tags:
  - ACPI
  - PCI段组
  - 热插拔
aliases:
  - mcfg表与cba方法
confidence: 1
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "MCFG表与_CBA方法" (MCFG Table and _CBA Method) based on the provided source material from the PCI Firmware Specification.

Let me extract the relevant information from the source material:

1. **MCFG Table** - An ACPI table that communicates memory mapped configuration space base addresses for non-hot removable PCI Segment Groups at boot.

2. **_CBA Method** - An ACPI control method that returns the 64-bit memory mapped configuration base address for hot plug capable host bridges.

Key points to cover:
- Background on Enhanced Configuration Access Mechanism
- MCFG Table Description (Table 4-2 structure)
- Memory Mapped Enhanced Configuration Space Base Address Allocation Structure (Table 4-3)
- The _CBA Method definition and usage
- System Software Implication of MCFG and _CBA
- Related concepts like PCI Segment Group, Host Bridge, etc.

Let me write a comprehensive, well-structured wiki page in zh-CN.
</think>

# MCFG 表与 _CBA 方法

## 概述

MCFG 表与 _CBA 方法是 PCI 固件规范中用于向操作系统传达内存映射配置空间基地址的 ACPI 机制。在 PC 兼容系统中，增强配置访问机制允许使用内存原语而非基于 I/O 的原语（CF8/CFC 机制）来访问 PCI 配置空间。^[pci-firmware-specification.md]

## 背景

PCI Express 和 PCI-X 规范定义了**增强配置访问机制**（Enhanced Configuration Access Mechanism），允许通过内存映射地址空间访问配置寄存器。该内存映射配置空间的基地址是平台特定的，由系统固件传递给操作系统。^[pci-firmware-specification.md:38-39]

在支持该机制的层级结构中：
- 前 256 字节（偏移量 0-255）的 PCI 2.3 兼容配置空间可通过传统 PCI 配置机制或增强配置机制访问
- 扩展配置空间（偏移量 256-4095）仅能通过增强配置机制访问 ^[pci-firmware-specification.md:39]

增强配置访问机制可应用于异构层级结构（PCI/PCI-X/PCI Express）。256 MiB 的内存窗口能够描述整个 256 总线的 PCI 段组。^[pci-firmware-specification.md:39]

## MCFG 表

### 用途

MCFG 表是一种基于 ACPI 表的机制，用于传达引导时系统可用的非热拔插 PCI 段组的内存映射配置空间基地址。该表仅用于传达引导时可用的 PCI 段组的基地址，被视为当前引导期间不可重新定位且不可热拔插的地址范围。^[pci-firmware-specification.md:38-40]

> **注意**：MCFG 表不得包含热插拔 PCI 段组的内存映射配置基地址，热插拔段组必须使用 _CBA 方法描述。^[pci-firmware-specification.md:41]

### 表结构

MCFG 表结构定义如下：^[pci-firmware-specification.md:40-42]

| 字段 | 字节长度 | 字节偏移 | 描述 |
|------|---------|---------|------|
| **签名** | 4 | 0 | "MCFG" — 内存映射配置空间基地址描述表的签名 |
| **长度** | 4 | 4 | 整个 MCFG 描述表的长度（字节），包括内存映射配置空间基地址分配结构 |
| **修订版本** | 1 | 8 | 表修订版本号 |
| **校验和** | 1 | 9 | 整个表必须总和为零 |
| **OEM ID** | 6 | 10 | OEM 标识符 |
| **OEM 表 ID** | 8 | 16 | MCFG 表的制造型号 ID |
| **OEM 修订版本** | 4 | 24 | OEM 修订版本号 |
| **创建者 ID** | 4 | 28 | 创建该表的工具供应商 ID |
| **创建者修订版本** | 4 | 32 | 创建该表的工具修订版本 |
| **保留** | 8 | 36 | 保留字段 |
| **配置空间基地址分配结构** | 可变 | 44 | 内存映射配置基地址分配结构列表（至少包含一个条目） |

### 基地址分配结构

每个 PCI 段组对应一个内存映射配置空间基地址分配结构，其字段定义如下：^[pci-firmware-specification.md:42-43]

| 字段 | 字节长度 | 字节偏移 | 描述 |
|------|---------|---------|------|
| **基地址** | 8 | 0 | 增强配置访问机制的处理器相对基地址 |
| **PCI 段组编号** | 2 | 8 | PCI 段组编号，默认为 0；其他值应与 _SEG 对象返回值对应 |
| **起始总线编号** | 1 | 10 | 由主机桥解码的起始 PCI 总线编号 |
| **结束总线编号** | 1 | 11 | 由主机桥解码的结束 PCI 总线编号 |
| **保留** | 4 | 12 | 保留字段 |

### 字段说明

- **PCI 段组编号**：对于支持多个 PCI 段组的系统，此字段值应与 ACPI 命名空间中适用主机桥设备的 _SEG 对象返回值对应。如果系统仅包含单个（默认）PCI 段组（即 PCI 段组 0），则不需要对应的 _SEG 对象。^[pci-firmware-specification.md:42-43]
- **基地址**：提供与该 PCI 段组关联的内存映射配置空间的 64 位物理基地址。对于 PCI-X 和 PCI Express 平台，基地址始终对应总线编号 0（无论主机桥解码的起始总线编号是多少）。^[pci-firmware-specification.md:42-43]

## _CBA 方法

### 用途

_CBA（Memory mapped Configuration Base Address，内存映射配置基地址）控制方法是一种可选的 ACPI 对象，用于返回热插拔主机桥的 64 位内存映射配置基地址。^[pci-firmware-specification.md:43]

某些系统可能支持主机桥的热插拔，这些热插拔可能引入现有 PCI 段组内的总线范围或引入新的 PCI 段组。_CBA 方法用于描述此类热插拔 PCI 段组或 PCI 段组内总线范围的内存映射配置空间基地址。^[pci-firmware-specification.md:43]

### 定义

_CBA 控制方法的 ASL（ACPI Source Language）定义如下：

```
Method(_CBA, 0) {
    // 返回 64 位基地址
    Return (0xE000000000000000)
}
```

- **参数**：无
- **返回值**：以整数形式返回的 PCI 兼容主机桥的内存映射配置基地址（从 ACPI 2.0 开始，整数为 64 位实体）^[pci-firmware-specification.md:43-44]

### 使用约束

- 包含 _CBA 方法的 ACPI 命名空间对象还必须包含对应的 _SEG 方法
- 主机桥必须首先执行 _CBA 和 _BBN 控制方法，才能启用对该桥下方设备的 PCI_Config_OpRegion 访问
- 因此 _CBA 和 _BBN 方法不得包含引用该主机桥下方设备的 PCI_Config opregions ^[pci-firmware-specification.md:43]

### 示例

以下 ASL 示例展示了 _CBA 方法的典型使用方式：^[pci-firmware-specification.md:44]

```asl
Scope(\_SB) {
    Device(PCI1) {
        Name(_HID, EISAID("PNP0A03"))
        Name(_SEG, 1)
        Method (_CRS, ResourceTemplate() {
            // ... 资源模板
        })
        Method(_CBA, 0) {
            Return (0xE000000000000000)
        }
    }
}
```

## MCFG 与 _CBA 的系统软件含义

MCFG 表返回的基地址始终是相对于该特定总线范围内的总线 0，遵循 PCI Express 基础规范和 PCI-X 规范的规定。系统软件负责根据 MCFG 条目中指定的起始和结束总线编号计算所支持的内存映射配置地址范围的起始和结束位置。^[pci-firmware-specification.md:44]

_CBA 返回的基地址同样始终相对于总线 0。系统软件负责根据 _CRS 方法识别的主机桥支持的总线范围计算该主机桥的内存映射配置地址范围的起始和结束位置。^[pci-firmware-specification.md:44]

### 资源保留

如果操作系统本身不支持保留 MMCFG 区域，则固件必须保留该区域。MCFG 表或 _CBA 方法中报告的地址范围必须通过声明主板资源来保留。对于大多数系统，主板资源应出现在 ACPI 命名空间根部（\_SB 下），具有 _HID 为 EISAID(PNP0C02) 的节点中，且资源不应在根 PCI 总线的 _CRS 中声明。^[pci-firmware-specification.md:41]

## 相关概念

- [[PCI配置空间]] — PCI 设备用于设备识别和配置的空间
- [[PCI段组]] — PCI 总线的逻辑集合，支持超过 256 条总线的系统
- [[ACPI]] — 高级配置和电源接口规范
- [[PCI Express]] — PCI Express 基础规范定义了增强配置访问机制
- [[PCI主机桥]] — 连接处理器和 PCI 总线的硬件组件
- [[_SEG方法]] — 返回 PCI 段组编号的 ACPI 方法
- [[_CRS方法]] — 返回主机桥资源的 ACPI 方法

## 来源

^[pci-firmware-specification.md] PCI Firmware Specification Revision 3.3, Section 4.1 (Pages 38-45)
