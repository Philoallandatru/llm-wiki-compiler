---
title: PCI配置空间访问机制
summary: 通过INT 1Ah或内存映射方式访问PCI配置空间的两种机制：传统I/O访问（CF8/CFC）和PCI Express增强配置访问（MMCFG），支持256字节标准及4KiB扩展配置空间
sources:
  - pci-firmware-specification.md
kind: concept
createdAt: "2026-05-24T04:26:05.717Z"
updatedAt: "2026-05-24T04:26:05.717Z"
tags:
  - PCI配置
  - 内存映射
  - 硬件机制
aliases:
  - pci配置空间访问机制
confidence: 1
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "PCI配置空间访问机制" (PCI Configuration Space Access Mechanism) in Simplified Chinese, using the provided source material from the PCI Firmware Specification.

Let me analyze the source material to extract key information about PCI configuration space access mechanisms:

1. **Traditional PCI BIOS** - Sections 2.5-2.7 describe the [[bios32-service-directory|BIOS32 Service Directory]] and PCI BIOS functions for accessing configuration space via INT1Ah

2. **Two Configuration Mechanisms** - From section 2.5.2:
   - Mechanism #1: I/O-based access (CF8/CFC mechanism) - for standard PCI (0-255 bytes)
   - Mechanism #2: Alternative mechanism - for standard PCI (0-255 bytes)

3. **Enhanced Configuration Access Mechanism** - For PCI Express and PCI-X Mode 2:
   - Memory-mapped access to 256 MiB region
   - Accesses registers 0-4095 per function
   - Used for extended configuration space (256-4095 bytes)

4. **MCFG Table** - ACPI mechanism to communicate base addresses of memory-mapped configuration space

5. **_CBA Method** - ACPI control method for hot-plug capable host bridges

6. **Access Rules**:
   - Use PCI I/O Index/Data mechanism for registers 0-255
   - Use PCI Express memory-mapped access for registers 256 and beyond

Let me structure this wiki page with relevant sections and citations.

Key points to cover:
1. Overview of PCI configuration space
2. Traditional mechanisms (Mechanism #1 and #2 via I/O ports)
3. [[bios32-service-directory|BIOS32 Service Directory]] and INT1Ah interface
4. Enhanced Configuration Access Mechanism (ECAM/MMCFG)
5. MCFG table and _CBA method
6. Access rules for different register ranges


7. Related concepts and their interconnections

I should include wikilinks to related concepts like PCI Configuration Space, PCI Express, ACPI, BIOS, and UEFI where appropriate.
</think>

# PCI配置空间访问机制

PCI配置空间访问机制是系统软件与PCI总线硬件之间的关键接口，用于读写PCI设备的配置寄存器。本页面基于 PCI Firmware Specification 3.3 文档，介绍从传统BIOS到现代UEFI/ACPI环境下的多种配置空间访问方案。 ^[pci-firmware-specification.md]

## 配置空间概述

PCI设备具有独立的配置地址空间，用于设备标识和系统资源分配。每个PCI设备由三段式地址定位：**总线号**（0-255）、**设备号**（0-31）和**功能号**（0-7），多功能设备可包含多个独立的功能实例。 ^[pci-firmware-specification.md:8] 配置空间的前256字节对所有PCI设备通用（通过标准配置机制访问），而PCI Express和PCI-X Mode 2设备还支持扩展配置空间（偏移256-4095字节），需通过内存映射访问机制操作。 ^[pci-firmware-specification.md:39]

## 标准配置访问机制

PCI规范定义了两种访问配置空间的标准硬件机制：

### 机制一（I/O索引/数据机制）

该机制通过I/O端口0xCF8（索引端口）和0xCFC（数据端口）实现配置空间读写。调用者将目标地址写入0xCF8，然后从0xCFC读取或写入数据。这种机制在传统PC兼容系统中广泛使用，适用于访问配置空间的前256字节（寄存器0-255）。 ^[pci-firmware-specification.md:15]

### 机制二

作为备选配置访问机制，同样用于访问配置空间的前256字节，与机制一可并行实现。 ^[pci-firmware-specification.md:15]

## 传统PCI BIOS访问接口

传统PCI BIOS提供了软件接口用于生成PCI特定地址空间的操作，包括配置空间访问和特殊周期生成。

### BIOS32服务目录

BIOS32服务目录是检测32位BIOS服务存在的机制，支持在没有标准BIOS入口点的32位代码环境中发现PCI BIOS等服务。该目录以特定数据结构的形态存在于物理地址0E0000h至0FFFF0h范围内，需包含ASCII签名字符串"_32_"且校验和为零。 ^[pci-firmware-specification.md:11-12] 客户端通过在指定范围内扫描签名来定位服务目录，然后通过目录返回的入口点执行调用。

### INT1Ah中断调用

PCI BIOS函数通过中断1Ah提供服务。调用者设置AH寄存器为B1h（PCI_FUNCTION_ID），并通过AL寄存器指定具体子功能码。状态通过进位标志[CF]和特定寄存器返回。 ^[pci-firmware-specification.md:10] INT1Ah接口可在实模式、虚拟86模式或16:16保护模式下运行，支持16位代码访问PCI配置空间。

### 保护模式入口

32位保护模式调用者需通过CALL FAR直接调用保护模式入口点，而非模拟INT指令。入口点信息由BIOS32服务目录提供，调用前需正确设置代码段和数据段描述符，栈空间要求至少1KB。 ^[pci-firmware-specification.md:13] 保护模式接口支持32位调用者访问完整的PCI BIOS功能集。

### 配置空间读写函数

PCI BIOS提供三种数据宽度的读写函数：读/写配置字节（READ_CONFIG_BYTE/WRITE_CONFIG_BYTE）、读/写配置字（READ_CONFIG_WORD/WRITE_CONFIG_WORD）、读/写配置双字（READ_CONFIG_DWORD/WRITE_CONFIG_DWORD）。这些函数通过总线号、设备号（含功能号）和寄存器号定位目标配置空间位置。 ^[pci-firmware-specification.md:24-29]

## 增强配置访问机制

对于PCI Express和PCI-X Mode 2设备，增强配置访问机制（Enhanced Configuration Access Mechanism）允许通过内存映射地址空间访问配置寄存器，而非传统的I/O端口方式。

### 内存映射配置空间

增强配置访问机制将整个PCI段组（Segment Group）的配置空间映射到256 MiB的内存地址窗口内。每个设备功能占用4 KiB（4096字节）的配置空间，窗口内的地址编码包含：总线号（8位）、设备号（5位）、功能号（3位）、扩展寄存器（4位，用于超过256字节的配置空间）和标准寄存器（8位）。 ^[pci-firmware-specification.md:39]

内存映射配置空间的基地址由系统固件编程设定，必须位于4 GiB以下地址空间。固件负责确保映射的地址区域真实存在且符合PCI Express或PCI-X规范的对齐要求。 ^[pci-firmware-specification.md:23]

### 访问规则

固件应使用PCI I/O索引/数据机制访问配置空间寄存器0-255，而仅对寄存器256及以上的扩展配置空间使用PCI Express内存映射访问机制。这一规则确保了向后兼容性，同时充分利用增强机制的能力。 ^[pci-firmware-specification.md:23] 调用者需注意，若对不支持扩展配置空间的普通PCI设备访问超出256字节的寄存器位置，返回数据不可预测。PCI BIOS函数不支持PCI段组概念，仅能访问默认的PCI段组0。 ^[pci-firmware-specification.md:23]

## MCFG表机制

MCFG（Memory Configuration）表是ACPI规范中用于向操作系统传递内存映射配置空间基地址的机制。该表通过签名字符串"MCFG"标识，包含版本号、OEM标识以及一个或多个内存映射配置空间基地址分配结构。 ^[pci-firmware-specification.md:40-42]

### 表结构

MCFG表的主要字段包括：签名字段（"MCFG"）、表长度、校验和（整表字节和为零）、OEM ID、表ID及修订版本。配置空间基地址分配结构描述了每个PCI段组与其对应内存映射基地址的关联关系，包含64位基地址、PCI段组号、起始总线号和结束总线号。 ^[pci-firmware-specification.md:41-42]

### 使用限制

MCFG表仅用于描述系统启动时可用的非热插拔PCI段组。表中的基地址范围必须通过ACPI报告为 motherboard 资源（如在命名空间根节点下使用_PNP0C02的_HID对象），以确保操作系统正确保留该内存区域。若操作系统不支持原生保留MMCFG区域，固件必须负责完成此操作。 ^[pci-firmware-specification.md:41]

## _CBA控制方法

_CBA（Configuration Base Address）是ACPI命名空间中的控制方法，用于返回热插拔PCI段组的内存映射配置空间基地址。该方法返回64位整数值，表示处理器相对地址。 ^[pci-firmware-specification.md:43]

### 适用场景

_CBA方法专用于热插拔主机桥设备的热插拔PCI段组或段组内的总线范围。当主机桥包含_CBA方法时，固件必须同时提供_SEG方法以标识对应的PCI段组编号。操作系统在评估_CRS方法时若支持资源重平衡，则每次都需重新评估_CBA。 ^[pci-firmware-specification.md:43-44]

### 与MCFG的关系

非热插拔主机桥的内存映射配置基地址必须通过MCFG表描述，而热插拔主机桥则通过_CBA方法在运行时报告。这种双重机制确保了系统在不同配置阶段都能正确访问PCI配置空间。 ^[pci-firmware-specification.md:44]

## POST阶段与运行时的差异

实模式INT1Ah调用在POST阶段用于内部BIOS/系统固件代码的扩展配置空间访问。POST完成后，建议直接使用内存映射机制访问PCI Express扩展配置空间，而不再通过INT1Ah。符合本规范3.0版或更高版本的固件实现中，POST后调用INT1Ah可能返回FUNC_NOT_SUPPORTED。 ^[pci-firmware-specification.md:24]

## 相关概念

- [[PCI配置空间]] — 配置空间的完整定义和寄存器布局
- [[PCI Express]] — 支持扩展配置空间的现代PCI总线技术
- [[ACPI]] — 高级配置与电源接口规范
- [[BIOS32服务目录]] — 传统BIOS服务发现机制
- [[UEFI]] — 统一可扩展固件接口，现代系统固件标准
- [[MCFG]] — ACPI内存配置表

## Sources

- PCI Firmware Specification, Revision 3.3, January 2021 (PCI_Firmware_v3.3_20210120_NCB.pdf)
