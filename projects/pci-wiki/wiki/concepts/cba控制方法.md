---
title: _CBA控制方法
summary: ACPI控制方法，用于报告热插拔PCI段组的内存映射配置空间基地址，允许运行时更新热添加的PCI组件
sources:
  - pci-firmware-specification.md
kind: concept
createdAt: "2026-05-24T07:38:16.648Z"
updatedAt: "2026-05-24T07:38:16.648Z"
tags:
  - acpi
  - pci
  - hot-plug
aliases:
  - cba控制方法
confidence: 0.9
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "_CBA控制方法" (CBA Control Method) based on the provided source material.

Looking at the source material, I can find information about _CBA in the PCI Firmware Specification document. Specifically, it's discussed in Section 4.1.3 "The _CBA Method" on page 43 of the PDF.

Let me extract the key information about _CBA:

1. **What is _CBA**: It's an ACPI control method that returns the 64-bit memory mapped configuration base address for hot plug capable host bridges.

2. **Purpose**: Some systems may support hot plug of host bridges that introduce either a range of buses within an existing PCI Segment Group or introduce a new PCI Segment Group. The base address of the memory mapped configuration space for such a hot pluggable PCI Segment Group or a range of buses within a PCI Segment Group is described using the _CBA control method.

3. **Where it appears**: This control method appears under a host bridge object (with _HID of PNP0A08 or _CID of PNP0A03).

4. **Arguments**: None

5. **Result**: Memory mapped configuration base address for the PCI-compatible host bridge returned as an integer (64-bit as of ACPI 2.0)

6. **Important notes**:
   - An ACPI namespace object that contains the _CBA method must also contain a corresponding _SEG method.
   - For a host bridge that includes _CBA, the _CBA and _BBN control methods have to be executed first to enable PCI_Config_OpRegion access for devices below the bridge.
   - _CBA and _BBN methods must not include PCI_Config opregions that refer to devices below the host bridge.
   - If rebalancing of resources on a host bridge is supported via _PRS, _SRS, it is the responsibility of the operating system to reevaluate _CBA every time _CRS is evaluated.
   - For host bridges that don't support hot plug, the MCFG table handles the configuration base address instead of _CBA.

7. **Related concepts**: MCFG table, PCI Segment Group, _SEG method, _BBN method, _CRS method, Enhanced Configuration Access Method

Now I'll structure the wiki page with a clear overview, detailed explanation of the control method, and relevant technical specifications.
</think>



# _CBA 控制方法

## 概述

_CBA（Memory mapped Configuration Base Address）是ACPI规范中定义的一种控制方法，用于返回支持热插拔的PCI主机桥的64位内存映射配置空间基地址。^[pci-firmware-specification.md]

该方法允许系统固件描述热插拔PCI段组（PCI Segment Group）或PCI段组内总线范围内设备的内存映射配置空间基地址。对于不支持热插拔的主机桥，其配置基地址应通过MCFG表进行描述。^[pci-firmware-specification.md]

## 背景

在PC兼容系统中，PCI Express和PCI-X规范定义了增强配置访问机制（Enhanced Configuration Access Mechanism），允许通过内存操作而非传统的I/O端口操作（CF8/CFC机制）访问PCI配置空间。对于PCI Express设备，扩展配置空间（偏移量256-4095）只能通过增强配置机制访问。^[pci-firmware-specification.md]

增强配置访问机制使用256 MiB的内存窗口，可支持最多256条PCI总线，每条总线最多32个设备，每个设备最多8个功能，每个功能最大4 KiB配置空间。^[pci-firmware-specification.md]

## 方法定义

_CBA是一个可选的ACPI对象，位于主机桥设备对象下方。

| 属性 | 说明 |
|------|------|
| **位置** | 主机桥ACPI命名空间对象下 |
| **参数** | 无 |
| **返回值** | 64位整数，表示内存映射配置基地址 |
| **必需关联** | 包含_CBA的对象必须同时包含[[_SEG]]方法 |

^[pci-firmware-specification.md]

## 执行要求

对于包含_CBA的主机桥，操作系统必须首先执行_CBA和[[_BBN]]方法，才能启用对桥下设备的PCI_Config操作区域的访问。^[pci-firmware-specification.md]

重要约束：
- _CBA和_BBN方法不得包含引用桥下设备的PCI_Config操作区域
- 如果系统支持通过[[_PRS]]和[[_SRS]]进行资源重新平衡，操作系统每次评估[[_CRS]]时都有责任重新评估_CBA^[pci-firmware-specification.md]

## 与MCFG表的关系

MCFG表用于描述系统启动时不可热插拔的PCI段组的配置基地址，而_CBA方法用于描述可热插拔的PCI段组的配置基地址。两者共同构成完整的配置空间地址通信机制。^[pci-firmware-specification.md]

_CBA返回的基地址始终相对于总线0，操作系统需根据主机桥[[_CRS]]中指定的总线范围计算实际支持的内存映射配置地址范围。^[pci-firmware-specification.md]

## 示例ASL代码

```asl
Scope(\_SB) {
    Device(PCI1) {          // 根PCI总线
        Name(_HID, EISAID("PNP0A03"))
        Name(_SEG, 1)      // PCI段组1
        Method (_CRS, ResourceTemplate() {
            ...
        })
        Method(_CBA, 0) {
            // 返回64位基地址
            Return (0xE000000000000000)
        }
    }
}
```

^[pci-firmware-specification.md:43-44]

## 相关概念

- [[MCFG表]] - ACPI中用于描述不可热插拔PCI段组配置基地址的表
- [[PCI段组]] - PCI总线的逻辑分组，支持超过256条总线
- [[_SEG方法]] - 返回PCI段组编号，必须与_CBA配合使用
- [[_BBN方法]] - 获取总线编号，与_CBA一同执行以启用配置空间访问
- [[增强配置访问机制]] - PCI Express规范定义的内存映射配置访问方式

---

## Sources

- [PCI Firmware Specification Revision 3.3](pci-firmware-specification.md)
