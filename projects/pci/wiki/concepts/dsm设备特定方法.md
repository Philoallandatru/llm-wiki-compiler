---
title: _DSM设备特定方法
summary: ACPI中用于PCI/PCI Express设备特定功能的_DSM方法集，包括插槽信息、延迟容差报告、D3cold辅助电源、PERST#延迟、下游端口Containment以及SSD状态LED管理等功能
sources:
  - pci-firmware-specification.md
kind: concept
createdAt: "2026-05-24T04:25:40.735Z"
updatedAt: "2026-05-24T04:25:40.735Z"
tags:
  - ACPI
  - 电源管理
  - 热插拔
aliases:
  - dsm设备特定方法
confidence: 0.85
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "_DSM设备特定方法" (Device-Specific Method). I need to extract relevant information from the provided source material (PCI Firmware Specification) and write a clear, well-structured page in zh-CN.

Let me identify the key facts about _DSM from the source material:

From Section 4.6 _DSM Definitions for PCI (pages 62-88):
- _DSM (Device-Specific Method) is an ACPI control method
- It's used to expose device-specific features to the operating system
- Multiple _DSM functions exist for different purposes
- _DSM uses a UUID/Token approach

From the document structure, I can see:
- Section 4.6 _DSM Definitions for PCI (62)
- 4.6.1 _DSM for PCI Express Slot Information (63)
- 4.6.2 _DSM for PCI Express Slot Number (65)
- 4.6.3 _DSM for Vendor-specific Token ID Strings (67)
- 4.6.4 _DSM for PCI Bus Capabilities (68)
- 4.6.5 _DSM for Preserving PCI Boot Configurations (72)
- 4.6.6 _DSM for Latency Tolerance Reporting (73)
- 4.6.7 _DSM for Naming a PCI or PCI Express Device Under Operating Systems (73)
- 4.6.8 _DSM for Avoiding Power-On Reset Delay Duplication on Sx Resume (76)
- 4.6.9 _DSM for Specifying Device Readiness Durations (77)
- 4.6.10 _DSM for Requesting D3cold Aux Power Limit (79)
- 4.6.11 _DSM for Adding PERST# Assertion Delay (81)


- 4.6.12 _DSM for Downstream Port Containment and Hot-Plug Surprise Control (82)
- 4.6.13 _DSM for Locating the Port that Experienced the Containment Event (87)
- 4.6.14 _DSM for Quering Platform Vendor Specific TPH Features (88)

The _DSM method can also define actions for downstream port containment and hot-plug surprise scenarios, locate which port triggered a containment event, and query vendor-specific TPH features. Additionally, Section 4.7 covers _DSM definitions for PCIe SSD Status LED functionality.
</think>

# _DSM 设备特定方法

## 概述

_DSM（Device-Specific Method，设备特定方法）是一种 ACPI 控制方法，用于向操作系统暴露特定于设备的功能和特性。_DSM 方法允许设备厂商在标准 ACPI 接口之上提供专有的扩展功能，从而实现对 PCI 和 PCI Express 设备的高级控制和配置能力。 ^[pci-firmware-specification.md]

## 设计架构

### UUID/Token 机制

_DSM 方法采用 UUID（通用唯一标识符）和 Token（令牌）两级索引机制来识别不同的设备特定功能。这种设计允许多个厂商独立定义各自的设备特定扩展而不会产生冲突。 ^[pci-firmware-specification.md:62]

具体调用规范如下：

- **参数 1 (Arg0)**：UUID — 一个 16 字节的 GUID，标识设备所属的功能类别
- **参数 2 (Arg1)**：修订版本号 — 指示正在使用的 _DSM 方法修订版本
- **参数 3 (Arg2)**：函数索引 — 选择要执行的 _DSM 函数
- **参数 4 (Arg3)**：函数特定参数 — 根据具体函数而定

### 返回值约定

当函数索引为 0 时，_DSM 方法返回操作系统支持的所有函数索引位字段。返回值通常为一个整数，其中每个置位对应一个受支持的函数索引。 ^[pci-firmware-specification.md:62]

## PCI 设备 _DSM 定义

PCI 固件规范为 PCI 设备定义了多个 _DSM 函数类别，覆盖了从插槽信息报告到电源管理的各种功能场景。 ^[pci-firmware-specification.md:62-88]

### PCI Express 插槽信息

_DSM 可用于报告 PCI Express 插槽相关信息。该功能允许操作系统获取插槽物理特性，帮助优化设备安装和热插拔体验。 ^[pci-firmware-specification.md:63]

### PCI Express 插槽编号

_DSM 提供插槽编号查询功能，使操作系统能够识别系统中各插槽的逻辑编号，便于设备枚举和用户界面展示。 ^[pci-firmware-specification.md:65]

### 厂商特定 Token ID 字符串

_DSM 支持定义厂商特定的 Token ID 字符串，允许硬件厂商通过标准化接口提供专有配置参数和状态信息。 ^[pci-firmware-specification.md:67]

### PCI 总线能力

_DSM 函数索引 3 用于报告 PCI 总线能力结构。该功能向操作系统传达总线类型信息和相关能力，支持更智能的资源分配和性能优化决策。 ^[pci-firmware-specification.md:68-71]

### 保留 PCI 启动配置

_DSM 函数索引 4 用于在系统固件和操作系统之间保存和恢复设备启动时的配置状态，确保设备在操作系统接管后保持预期的初始化参数。 ^[pci-firmware-specification.md:72]

### 延迟容差报告

_DSM 支持延迟容差报告（Latency Tolerance Reporting），使设备能够向系统报告其对内存访问延迟的容忍度，助力平台功耗优化和性能调度决策。 ^[pci-firmware-specification.md:73]

### 操作系统设备命名

_DSM 函数索引 6 允许操作系统查询设备在操作系统环境中的名称标识，便于用户界面显示和设备管理。 ^[pci-firmware-specification.md:73-75]

### 避免 Sx 恢复时重复上电延迟

_DSM 函数索引 7 提供机制，使设备能够在 Sx（睡眠状态）恢复时指示已避免重复执行上电延迟，优化系统唤醒时间。 ^[pci-firmware-specification.md:76]

### 设备就绪持续时间

_DSM 函数索引 8 用于指定设备从 D3cold 状态转换到运行状态所需的持续时间，帮助操作系统准确规划设备初始化时序。 ^[pci-firmware-specification.md:77]

### D3cold 辅助电源限制请求

_DSM 函数索引 9 允许设备请求 D3cold 状态下的辅助电源限制参数，支持便携设备的热管理策略。 ^[pci-firmware-specification.md:79-80]

### 添加 PERST# 断言延迟

_DSM 函数索引 10 用于在 PCI Express 热插拔场景中指定 PERST# 信号断言延迟，确保链路稳定后在进行设备访问。 ^[pci-firmware-specification.md:81]

### 下游端口包含和热插拔意外控制

_DSM 函数索引 11 提供下游端口包含（Downstream Port Containment）功能和热插拔意外移除控制能力。当 PCI Express 链路出现错误时，系统可执行包含操作以隔离故障端口，防止错误扩散影响其他设备。 ^[pci-firmware-specification.md:82-86]

### 定位发生包含事件的端口

_DSM 函数索引 12 用于定位经历包含事件的下游端口，帮助操作系统和系统管理软件识别和处理 PCI Express 链路故障。 ^[pci-firmware-specification.md:87]

### 查询平台厂商特定 TPH 特性

_DSM 函数索引 13 用于查询平台支持的厂商特定 TPH（Transaction Processing Hints）特性。TPH 是一种允许设备向系统提供内存访问提示的机制。 ^[pci-firmware-specification.md:88]

## PCIe SSD 状态 LED _DSM

PCI 固件规范还定义了用于 PCIe 固态硬盘（SSD）状态 LED 管理的 _DSM 功能集。这些功能通过特定函数索引实现状态 LED 的查询和控制。 ^[pci-firmware-specification.md:89-94]

### 函数索引定义

| 函数索引 | 功能描述 |
|---------|---------|
| 0 | 查询支持的函数 |
| 1 | 获取支持的 LED 状态 |
| 2 | 获取状态 LED 状态 |
| 3 | 设置状态 LED 状态 |

### 状态查询

函数索引 0 返回设备支持的功能位字段，函数索引 2 用于获取当前 LED 状态，函数索引 3 用于设置 LED 状态。状态信息以位图形式编码，反映设备的物理 LED 指示灯状态。 ^[pci-firmware-specification.md:90-94]

## 参见

- [[ACPI]] — 高级配置和电源接口规范
- [[PCI配置空间]] — PCI 设备配置空间
- [[PCI Express]] — PCI Express 基础规范
- [[MCFG表]] — 内存映射配置空间基地址描述表
- [[_OSC方法]] — PCI Express 能力暴露机制

## 来源

^[pci-firmware-specification.md] PCI Firmware Specification Revision 3.3, Section 4.6-4.7 (Pages 62-94)
