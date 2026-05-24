---
title: PCI段组(PCI Segment Group)
summary: 纯软件概念，用于逻辑上分组PCI总线和PCI Express层级，支持系统中超过256条总线，允许不同PCI段组复用相同的总线编号
sources:
  - pci-firmware-specification.md
kind: concept
createdAt: "2026-05-24T04:25:27.160Z"
updatedAt: "2026-05-24T04:25:27.160Z"
tags:
  - PCI架构
  - 总线编号
  - 软件抽象
aliases:
  - pci段组pci-segment-group
  - PSG
confidence: 1
provenanceState: extracted
---

<think>The user wants me to write a markdown wiki page about "PCI段组(PCI Segment Group)". I need to extract relevant information from the provided source material (PCI Firmware Specification) and write a clear, well-structured page in zh-CN.

Let me identify the key facts about PCI Segment Group from the source:

1. From Section 1.3 Terms and Acronyms:
- Segment Group Number: A number in the range 0…65535 that uniquely selects a PCI Segment Group.
- PCI Segment Group is purely a software concept managed by system firmware and used by the operating system. It is a logical collection of PCI buses (or bus segments). There is no tie to any physical entities. It is a way to logically group the PCI bus segments and PCI Express Hierarchies.
- PCI Segment Group concept enables support for more than 256 buses in a system by allowing the reuse of the PCI bus numbers. Within each PCI Segment Group, the bus numbers for the PCI buses must be unique. PCI buses in different PCI Segment Group are permitted to have the same bus number.
- A PCI Segment Group contains one or more PCI host bridges.
- There is at least one PCI Segment Group, PCI Segment Group 0, in a system.

2. From Section 2.7:
- PCI BIOS functions do not comprehend the concept of PCI Segment Groups and, hence, can only support access to the devices in the default PCI Segment Group, namely, PCI Segment Group 0.

3. From Section 4.1.2 MCFG Table Description:
- The MCFG table is an ACPI table that is used to communicate the base addresses corresponding to the non-hot removable PCI Segment Groups range within a PCI Segment Group available to the operating system at boot.
- The MCFG table directly refers to PCI Segment Groups defined in the system via the _SEG object in the ACPI namespace for the applicable host bridge device.


- For systems containing only a single PCI Segment Group, the default PCI Segment Group number, namely, PCI Segment Group 0, is implied. In such a case, the default PCI Segment Group need not be represented in the ACPI namespace.

4. From Section 4.1.2 Table 4-3:
- PCI Segment Group Number field denotes the PCI Segment Group corresponding to the base address field in the structure.

5. From Section 4.1.3 _CBA Method:
- The _CBA control method enables reporting of memory-mapped configuration base addresses for hot-pluggable PCI Segment Groups, complementing the static addressing provided by MCFG for non-hot-pluggable configurations.

6. From Section 4.1.3:
- When _CBA is defined for a host bridge, it must also have a corresponding _SEG method to properly identify the segment group. For non-hot-pluggable host bridges, MCFG handles the base address description instead.

7. From Section 3.5 Device State at Firmware/Operating System Handoff:
- The _SEG object is required in ACPI namespace for host bridge objects only when a non-zero PCI Segment Group number exists, distinguishing it from the default segment group 0.
</think>

# PCI段组（PCI Segment Group）

## 概述

PCI段组（PCI Segment Group）是一个纯软件概念，由系统固件管理并供操作系统使用。它是PCI总线（或总线段）的逻辑集合，与任何物理实体没有绑定关系。PCI段组是一种将PCI总线段和PCI Express层次结构进行逻辑分组的方式。^[pci-firmware-specification.md]

## 编号与范围

PCI段组号（Segment Group Number）的取值范围为0至65535，用于唯一标识一个PCI段组。每个系统中至少存在一个PCI段组，即PCI段组0。^[pci-firmware-specification.md]

## 核心特性

### 支持超过256条总线

PCI段组概念的核心价值在于支持系统中超过256条PCI总线的需求。通过允许在不同PCI段组中重复使用PCI总线编号，系统可以容纳更多的PCI设备。具体规则如下：

- 在同一PCI段组内，各PCI总线的总线号必须唯一
- 不同PCI段组中的PCI总线可以拥有相同的总线号 ^[pci-firmware-specification.md]

### 主机桥接器组成

一个PCI段组包含一个或多个PCI主机桥接器（PCI Host Bridge）。^[pci-firmware-specification.md]

## 与ACPI的关系

### MCFG表

MCFG表是一种ACPI表，用于在启动时向操作系统传达非热插拔PCI段组对应的内存映射配置空间基地址。该表直接引用ACPI命名空间中对应主机桥接器设备下的`_SEG`对象定义的PCI段组。^[pci-firmware-specification.md]

对于仅包含单个PCI段组（即PCI段组0）的系统，该默认段组无需在ACPI命名空间中表示（即不需要`_SEG`方法）。^[pci-firmware-specification.md]

### _CBA方法

热插拔主机桥接器引入的PCI段组或PCI段组内的总线范围，其内存映射配置空间基地址通过`_CBA`控制方法描述。包含`_CBA`方法的ACPI命名空间对象必须同时包含相应的`_SEG`方法。^[pci-firmware-specification.md]

### _SEG对象

固件必须在ACPI命名空间中报告主机桥接器。对于具有非零PCI段组号的主机桥接器对象，必须包含`_SEG`方法。^[pci-firmware-specification.md]

## 传统PCI BIOS的局限

传统PCI BIOS函数不理解PCI段组的概念，因此只能访问默认PCI段组（即PCI段组0）中的设备。^[pci-firmware-specification.md]

## 相关概念

- [[PCI配置空间]]
- [[MCFG表]]
- [[ACPI]]
- [[PCI主机桥接器]]
- [[PCI Express]]

## Sources

- [PCI Firmware Specification Revision 3.3](pci-firmware-specification.md)
