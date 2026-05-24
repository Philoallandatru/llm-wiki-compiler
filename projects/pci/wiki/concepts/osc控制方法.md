---
title: _OSC控制方法
summary: ACPI控制方法，用于在固件和操作系统之间协商暴露PCI Express能力，定义了查询标志、评估条件、_OSC调用序列以及控制位之间的依赖关系
sources:
  - pci-firmware-specification.md
kind: concept
createdAt: "2026-05-24T04:25:35.469Z"
updatedAt: "2026-05-24T04:25:35.469Z"
tags:
  - ACPI
  - PCIe能力
  - 协商
aliases:
  - osc控制方法
confidence: 0.9
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "_OSC控制方法" (Operating System Capabilities Control Method) based on the provided source material. Let me extract the relevant information from the PCI Firmware Specification.

From Section 4.5 "OSHP – A Mechanism for Exposing PCI Express Capabilities Supported by an Operating System" (pages 48-59):

Key facts:
1. _OSC is an ACPI control method used to expose capabilities that the operating system supports
2. It's used to negotiate capabilities between firmware and the operating system
3. The _OSC method is called by the OS to determine what features can be enabled
4. _OSC is evaluated by firmware to determine what features to enable
5. It's specific to PCI Host Bridge devices
6. The method uses a query flag to determine if the OS is querying capabilities or requesting control
7. It uses buffer arguments for passing capability information
8. There are specific rules for evaluating _OSC
9. It involves bit fields for support and control

Let me structure this properly with citations.
</think>

# _OSC 控制方法

## 概述

`_OSC`（Operating System Capabilities）是一种 ACPI 控制方法，用于向操作系统暴露其所支持的 PCI Express 功能特性。该方法为固件和操作系统之间提供了一个能力协商机制，使得固件能够根据操作系统实际支持的功能来决定启用哪些 PCI Express 特性。 ^[pci-firmware-specification.md:48-48]

## 应用范围

`_OSC` 方法专门应用于 **PCI 主机桥接器设备**（PCI Host Bridge Devices）。通过该方法，系统固件可以了解操作系统在特定平台上能够支持哪些 PCI Express 特性，从而在固件层面做出正确的功能启用决策。 ^[pci-firmware-specification.md:48-48]

## 接口定义

### 参数传递

`_OSC` 方法通过缓冲区参数传递能力信息，具体包括两个主要参数： ^[pci-firmware-specification.md:48-48]

- **支持字段（Support Field）**：描述操作系统支持的功能集合
- **控制字段（Control Field）**：描述操作系统请求控制的功能位

### 返回值

`_OSC` 方法的返回值同样包含控制字段，用于向操作系统返回固件对各项功能的授权状态或协商结果。 ^[pci-firmware-specification.md:52-53]

## 查询标志机制

`_OSC` 方法的评估过程依赖于 **查询标志（Query Flag）** 的状态： ^[pci-firmware-specification.md:59-59]

- 当操作系统仅查询能力而不请求控制权时，查询标志反映查询状态
- 当操作系统实际请求控制时，查询标志用于确定固件是否应评估完整的 `_OSC` 调用

## 评估规则

### 基本条件

`_OSC` 方法的评估需要满足以下基本条件： ^[pci-firmware-specification.md:59-59]

- 必须存在有效的查询标志输入
- 必须具有正确格式的缓冲区参数
- 目标设备对象路径必须是 PCI 主机桥接器

### 调用序列

在多 PCI 主机桥接器系统中，`_OSC` 调用须按照特定顺序执行，确保每个主机桥接器都能正确获得操作系统能力信息的更新。 ^[pci-firmware-specification.md:59-59]

### 功能位依赖

在 `_OSC` 控制字段中，某些功能位之间存在依赖关系，即一个功能的启用可能以另一个功能的启用为前提条件。固件在评估时需要考虑这些依赖关系。 ^[pci-firmware-specification.md:60-60]

## 典型应用场景

`_OSC` 方法主要用于操作系统与固件之间协商以下 PCI Express 功能： ^[pci-firmware-specification.md:48-48]

- **PCI Express 插槽热插拔能力**
- **ACS（访问控制服务）**
- **朋级错误报告（AER）**
- **电源管理相关功能**
- **其他平台特定的 PCI Express 扩展功能**

## 与 MCFG 表的关系

`_OSC` 控制方法与 **MCFG 表**（内存映射配置空间基地址描述表）协同工作。MCFG 表提供 PCI 配置空间的基础地址信息，而 `_OSC` 方法则负责操作系统能力协商，两者共同构成 ACPI 环境下 PCI Express 系统的完整固件接口。 ^[pci-firmware-specification.md:38-38]

## 参见

- [[PCI主机桥接器]]
- [[MCFG表]]
- [[ACPI]]
- [[PCI Express]]
- [[BIOS32服务目录]]

## 来源

^[pci-firmware-specification.md]

- PCI Firmware Specification Revision 3.3, Section 4.5 "_OSC – A Mechanism for Exposing PCI Express Capabilities Supported by an Operating System" (pp. 48-61)
