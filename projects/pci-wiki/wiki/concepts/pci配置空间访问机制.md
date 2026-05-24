---
title: PCI配置空间访问机制
summary: 包括传统机制#1和#2用于访问PCI配置空间，以及用于PCI Express的增强配置访问机制，支持通过内存映射方式访问256-4095字节的扩展配置空间
sources:
  - pci-firmware-specification.md
kind: concept
createdAt: "2026-05-24T07:38:32.228Z"
updatedAt: "2026-05-24T07:38:32.228Z"
tags:
  - pci
  - configuration
  - hardware-interface
aliases:
  - pci配置空间访问机制
confidence: 0.95
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "PCI配置空间访问机制" (PCI Configuration Space Access Mechanism) in Chinese, based on the provided source material which is the PCI Firmware Specification v3.3.

Let me organize the information from the source material about PCI configuration space access mechanisms:

1. From the source material, I can identify several key topics:
   - Traditional PCI BIOS access (INT 1Ah)
   - BIOS32 Service Directory
   - PCI BIOS 32-bit service
   - Configuration space access methods (Mechanism #1 and #2)
   - Enhanced Configuration Access Method (ECAM) - memory-mapped
   - MCFG table
   - _CBA method
   - Access rules for PCI Express configuration space

Key information extracted:

1. **Configuration Space**: "A separate address space on PCI buses. Used for device identification and configuring devices into Memory and I/O spaces."

2. **Two hardware mechanisms for accessing configuration space** (from section 2.5.2):
   - Mechanism #1: I/O-based (CF8/CFC)
   - Mechanism #2: Alternative mechanism

3. **Enhanced Configuration Access Method** (from section 4.1):
   - Memory-mapped access for PCI Express and PCI-X Mode 2
   - 256 MiB window can describe entire 256 bus PCI Segment Group
   - First 256 bytes (0-255) can be accessed by either CF8/CFC or enhanced mechanism
   - Extended registers (256-4095) only via enhanced configuration mechanism

4. **MCFG Table** (section 4.1.2):
   - ACPI table for communicating base addresses
   - For non-hot removable PCI Segment Groups at boot
   - Contains base address allocation structures

5. **_CBA Method** (section 4.1.3):
   - ACPI control method for hot plug capable host bridges
   - Returns 64-bit memory mapped configuration base address
   
Software can interact with configuration space through multiple interfaces. The INT 1Ah interface works across real mode, 16-bit protected mode, and 32-bit protected mode environments, while the BIOS32 Service Directory provides a mechanism for 32-bit code to discover and use BIOS services. PCI BIOS functions allow reading and writing bytes, words, and doublewords across the configuration space, including extended registers beyond the standard 256-byte range. For direct access, the I/O Index/Data mechanism (CF8/CFC port pair) handles configuration space registers 0-255, whereas registers 256 and above require the PCI Express memory-mapped access method.
</think>



# PCI配置空间访问机制

PCI配置空间（Configuration Space）是PCI总线上的一个独立地址空间，用于设备识别和将设备配置到内存与I/O空间。 [^pci-firmware-specification.md]

## 概述

在PC兼容系统中，PCI配置空间的访问主要有两种机制：传统的I/O端口访问机制和增强型内存映射访问机制。传统PCI配置空间大小为256字节，而PCI Express和PCI-X Mode 2设备支持扩展配置空间，最高可达4KB（偏移地址256-4095）。 [^pci-firmware-specification.md]

## 传统I/O端口访问机制

### 配置机制#1

PCI规范定义了两个硬件机制来访问配置空间。机制#1使用I/O端口CF8h（地址端口）和CFCh（数据端口）进行配置空间访问。这是PC兼容系统中最常用的配置访问方式。 [^pci-firmware-specification.md]

访问方式为：首先向CF8h端口写入目标地址（格式：0x80000000 | (Bus << 16) | (Device << 11) | (Function << 8) | Register），然后通过CFCh端口进行数据读写。 [^pci-firmware-specification.md]

### 配置机制#2

机制#2是另一种硬件访问机制，部分平台支持。PCI BIOS Present函数会返回[AL]寄存器中的位0和位1，分别指示机制#1和机制#2的支持状态。 [^pci-firmware-specification.md]

### BIOS32服务目录

BIOS32服务目录是一种检测平台是否支持32位BIOS服务的机制。它使用特定的数据结构来标识服务入口点。该数据结构必须位于物理地址范围0E0000h至0FFFF0h之间，并且必须以16字节边界对齐。数据结构包含签名"_32_"（ASCII码）、入口点地址、修订级别、长度和校验和。 [^pci-firmware-specification.md]

## PCI BIOS函数接口

PCI BIOS提供了一组标准函数用于配置空间访问，功能代码为B1h，可通过INT 1Ah中断调用。这些函数支持字节、字和双字的读写操作，寄存器号范围为0-4095。 [^pci-firmware-specification.md]

### 访问规则

对于访问寄存器0-255，固件应使用PCI I/O Index/Data机制（CF8/CFC）。仅当访问配置空间寄存器256及以上的地址时，才应使用PCI Express内存映射访问机制。 [^pci-firmware-specification.md]

### 扩展配置空间访问

访问寄存器256-4095时，需要在寄存器号的bit15置1。如果BIOS实现了PCI Express扩展配置空间访问扩展，则会正常读写配置空间并返回SUCCESS；否则返回FUNC_NOT_SUPPORTED。 [^pci-firmware-specification.md]

## 增强型配置访问机制（ECAM）

### 背景

增强型配置访问机制允许通过内存原语而非I/O原语访问PCI配置空间。对于PCI Express和PCI-X Mode 2设备，扩展配置空间（偏移256-4095）只能通过增强型配置机制访问。 [^pci-firmware-specification.md]

### 内存地址映射

增强型配置访问机制使用256 MiB的内存窗口，假设每个功能最大可寻址4 KiB，每个设备8个功能，每个总线32个设备。该窗口能够描述整个256总线PCI段组。 [^pci-firmware-specification.md]

内存地址格式如下：地址位A[20+n:20]表示总线号（n=0至7），A[19:15]表示设备号，A[14:12]表示功能号，A[11:8]表示扩展寄存器（PCI Express和PCI-X Mode 2支持），A[7:0]表示寄存器号。 [^pci-firmware-specification.md]

### [[mcfg表|MCFG表]]

MCFG（Memory Configuration）表是ACPI表中用于在引导时沟通非热插拔PCI段组的内存映射配置空间基址的机制。MCFG表的签名是"MCFG"，表修订版本为1。 [^pci-firmware-specification.md]

MCFG表结构包含内存映射增强配置空间基址分配结构，该结构包含以下字段：64位处理器相对基地址（用于增强配置访问机制）、PCI段组号（默认值为0）、起始总线号和结束总线号。 [^pci-firmware-specification.md]

### _CBA方法

_CBA（Memory mapped Configuration Base Address）是ACPI控制方法，用于返回热插拔能力主机桥的64位内存映射配置基址。该方法在支持热插拔主机桥的ACPI命名空间对象下出现。 [^pci-firmware-specification.md]

使用_CBA的场景包括：支持主机桥热插拔的系统，可能引入现有PCI段组内的总线范围或引入新的PCI段组。对于非热插拔主机桥，其内存映射配置基址必须使用MCFG表描述。 [^pci-firmware-specification.md]

包含_CBA方法的ACPI命名空间对象还必须包含相应的_SEG方法。 [_CBA和_BBN控制方法需要首先执行，以启用对桥下设备的PCI_Config_OpRegion访问。] [^pci-firmware-specification.md]

## 固件要求

固件必须使用PCI I/O Index/Data机制（CF8/CFC）访问配置空间寄存器0-255。只有访问配置空间寄存器256及更高地址时，才应使用PCI Express内存映射访问机制。 [^pci-firmware-specification.md]

实模式下INT 1Ah调用用于读取PCI Express扩展配置空间的场景，预期用于处理POST期间内部BIOS/系统固件代码调用。POST之后，建议直接访问PCI Express扩展配置空间，而不使用INT 1Ah。如果在POST之后调用INT 1Ah，固件可能返回FUNC_NOT_SUPPORTED。 [^pci-firmware-specification.md]

## 软件注意事项

访问不存在的PCI设备寄存器时，返回的数据无法预测。访问超过256字节的寄存器仅限于支持扩展配置空间的设备。PCI BIOS函数不理解PCI段组概念，因此只能支持默认PCI段组（段组0）中设备的访问。 [^pci-firmware-specification.md]

如果操作系统本身不能原生理解保留MMCFG区域，则该区域必须由固件保留。该地址范围必须通过在ACPI命名空间根（\_SB下）的节点中声明主板资源来保留，_HID为EISAID(PNP0C02)。 [^pci-firmware-specification.md]

## Sources

[^pci-firmware-specification.md]: PCI Firmware Specification Revision 3.3
