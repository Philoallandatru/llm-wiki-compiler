---
title: PCI段组(PCI Segment Group)
summary: 纯软件概念，用于逻辑上分组PCI总线，支持系统中的256个以上总线，允许不同段组中的PCI总线使用相同的总线号
sources:
  - pci-firmware-specification.md
kind: concept
createdAt: "2026-05-24T07:38:16.341Z"
updatedAt: "2026-05-24T07:38:16.341Z"
tags:
  - pci
  - software-architecture
  - bus-topology
aliases:
  - pci段组pci-segment-group
  - PSG
confidence: 0.95
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "PCI段组(PCI Segment Group)" based on the provided source material. Let me extract the relevant information from the PCI Firmware Specification document.

From the source material, I can find information about PCI Segment Group in several places:

1. In the "Terms and Acronyms" section (around page 8-9):
- **Segment Group Number**: A number in the range 0…65535 that uniquely selects a PCI Segment Group.
- **PCI Segment Group** is purely a software concept managed by system firmware and used by the operating system. It is a logical collection of PCI buses (or bus segments). There is no tie to any physical entities. It is a way to logically group the PCI bus segments and PCI Express Hierarchies.
- PCI Segment Group concept enables support for more than 256 buses in a system by allowing the reuse of the PCI bus numbers. Within each PCI Segment Group, the bus numbers for the PCI buses must be unique. PCI buses in different PCI Segment Group are permitted to have the same bus number.
- A PCI Segment Group contains one or more PCI host bridges.
- There is at least one PCI Segment Group, PCI Segment Group 0, in a system.

2. In Section 4.1.2 (MCFG Table Description):
- The MCFG table is only used to communicate the base addresses corresponding to the non-hot removable PCI Segment Groups available to the system at boot.
- For systems containing only a single PCI Segment Group, the default PCI Segment Group number, namely, PCI Segment Group 0, is implied.

3. In Section 4.3.2.3 (PCI Segment Group):
- This section is referenced but the actual content is not shown in detail in the truncated content.


- The MCFG table structure associates each PCI Segment Group with its corresponding memory-mapped configuration space base address through the PCI Segment Group Number field, which should match the value returned by the _SEG object in the ACPI namespace for the applicable host bridge device.

4. Section 2.7 states that PCI BIOS functions do not comprehend the concept of PCI Segment Groups and can only support access to the devices in the default PCI Segment Group, namely, PCI Segment Group 0.

5. Section 3.5 notes that firmware must report Host Bridges in the ACPI namespace, and for non-zero PCI Segment Group numbers, each Host Bridge object must contain _SEG.

The _CBA method provides the base address for hot plug capable host bridges, and any namespace object containing _CBA must also include a corresponding _SEG method. Now I'll organize this into a clear wiki page structure.
</think>



# PCI段组 (PCI Segment Group)

## 概述

PCI段组（PCI Segment Group）是PCI固件规范中定义的一个纯软件概念，由系统固件管理并供操作系统使用。它是PCI总线（或总线段）的逻辑集合，与任何物理实体没有绑定关系。PCI段组提供了一种将PCI总线段和PCI Express层次结构进行逻辑分组的方式。^[pci-firmware-specification.md]

## 编号范围与基本特性

段组号（Segment Group Number）的取值范围为0至65535，用于唯一标识一个PCI段组。每个系统至少包含一个PCI段组，即PCI段组0。PCI段组可以包含一个或多个PCI主机桥（PCI Host Bridge）。^[pci-firmware-specification.md]

## 设计目的

PCI段组概念的核心价值在于支持系统中超过256条PCI总线的扩展需求。通过允许在不同PCI段组中重复使用PCI总线编号，系统可以突破传统PCI总线编号0-255的限制。在同一PCI段组内部，各PCI总线的编号必须保持唯一；而不同PCI段组中的PCI总线则被允许使用相同的总线编号。^[pci-firmware-specification.md]

## 与ACPI的关联

在ACPI命名空间中，每个主机桥设备对象需要包含`_SEG`方法，用于返回其所属的PCI段组编号。对于仅包含单个PCI段组（默认为PCI段组0）的系统，可以不提供对应的`_SEG`对象。固件必须在ACPI命名空间中报告所有主机桥，每个主机桥对象需要包含`_HID`、`_CID`以及`_CRS`等必要对象。^[pci-firmware-specification.md]

## MCFG表与PCI段组

MCFG（Memory mapped Configuration）表是ACPI中用于传达非热插拔PCI段组内存映射配置空间基地址的机制。该表直接引用系统中通过主机桥设备ACPI命名空间中`_SEG`对象定义的PCI段组。对于仅包含单一PCI段组的系统，默认的PCI段组0会被隐含表示，无需在MCFG表中显式列出。MCFG表中包含"内存映射增强配置空间基地址分配结构"，该结构中的PCI段组号字段应与对应主机桥的`_SEG`对象返回值保持一致。^[pci-firmware-specification.md]

## _CBA方法与热插拔支持

`_CBA`（Memory mapped Configuration Base Address）控制方法用于返回热插拔-capable主机桥的64位内存映射配置基地址。任何包含`_CBA`方法的ACPI命名空间对象也必须同时包含对应的`_SEG`方法。`_CBA`方法所描述的基地址是处理器相对地址。热插拔PCI段组的配置基地址不能通过MCFG表描述，而必须使用`_CBA`方法。^[pci-firmware-specification.md]

## 传统PCI BIOS的限制

传统的PCI BIOS函数不理解PCI段组的概念，因此只能支持访问默认PCI段组（即PCI段组0）中的设备。如需访问其他PCI段组中的设备，需要使用ACPI机制（如MCFG表和`_CBA`方法）。^[pci-firmware-specification.md]

## 相关概念

- [[MCFG表]] - 内存映射配置空间基地址描述表
- [[ACPI]] - 高级配置与电源接口
- [[PCI主机桥]] (PCI Host Bridge) - PCI段组的上游连接设备
- [[PCI配置空间]] - 设备的配置地址空间
- [[_SEG方法]] - ACPI中用于返回PCI段组编号的控制方法
- [[_CBA方法]] - ACPI中用于返回内存映射配置基地址的控制方法

## Sources

^[pci-firmware-specification.md] PCI Firmware Specification Revision 3.3, Section 1.3 (Terms and Acronyms), Section 4.1.2 (MCFG Table Description), Section 4.1.3 (The _CBA Method), Section 3.5 (Device State at Firmware/Operating System Handoff), Section 2.7 (Accessing Configuration Space)
