---
title: PCI BIOS32 Service Directory
summary: 一种用于检测32位BIOS服务存在的机制，通过在物理地址0E0000h-0FFFFFh范围内查找签名"_32_"的16字节数据结构来实现
sources:
  - pci-firmware-specification.md
kind: concept
createdAt: "2026-05-24T07:38:33.531Z"
updatedAt: "2026-05-24T07:38:33.531Z"
tags:
  - firmware
  - pci
  - bios
aliases:
  - pci-bios32-service-directory
  - PBSD
confidence: 0.95
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "PCI BIOS32 Service Directory" in Chinese (zh-CN). I need to draw facts only from the provided source material, which is the PCI Firmware Specification document.

Let me identify the relevant sections about BIOS32 Service Directory:

From the source material (pci-firmware-specification.md), Section 2.3 covers the BIOS32 Service Directory:

1. **Purpose/Overview**: It's a mechanism for detecting the presence of 32-bit BIOS services. While it supports detection of the PCI BIOS, it's intended to be broader in scope to allow detection of any/all 32-bit BIOS services.

2. **Determining the Existence** (2.3.1): 
   - A BIOS which implements the BIOS32 Service Directory must embed a specific, contiguous 16-byte data structure
   - Beginning on a 16-byte boundary somewhere in the physical address range 0E0000h - 0FFFFFh
   - Table 2-1 shows the data structure fields:
     - Offset 0: 4 bytes - Signature string "_32_" in ASCII
     - Offset 4: 4 bytes - Entry point physical address (32-bit)
     - Offset 8: 1 byte - Revision level (00h)
     - Offset 9: 1 byte - Length in paragraph units (01h = 16 bytes)
     - Offset 0Ah: 1 byte - Checksum (sum of all bytes must be 0)
     - Offset 0Bh: 5 bytes - Reserved, must be zero

3. **Detection Algorithm**: Clients should scan from 0E0000h to 0FFFFF0h for the signature and valid checksum. If found, they can use the entry point; if not found, neither the BIOS32 Service Directory nor the PCI BIOS is supported.

4. **Calling Interface** (2.3.2): The BIOS32 Service Directory accepts a CALL FAR to the entry point, with CS and DS needing to encompass both the entry point page and the next physical page at the same base address.

5. **Parameters**: The service identifier (4-character string in EAX) and function selector (low byte of EBX) are passed in registers, with upper bytes of EBX reserved as zero.

6. **Return Values**: The result comes back in AL as a return code—00h indicates the service is present, while 80h means it's not present, and 81h signals an unimplemented function. The BIOS service's physical base address is returned in EBX, with its length in ECX.

7. **Entry Point**: EDX contains the entry point offset relative to the base address.

8. **PCI BIOS 32-bit Service** (2.4): The Service Identifier for PCI BIOS is "$PCI" (49435024h). To use it, set up CS and DS descriptors to cover the physical addresses given by the Base and Length values from the BIOS32 Service Directory, ensuring both descriptors share the same base address.

The calling environment needs I/O space access and at least 1 KiB of stack space available.
</think>



# PCI BIOS32 服务目录

**PCI BIOS32 Service Directory** 是传统 PCI BIOS 中用于检测和访问 32 位 BIOS 服务的一种标准化机制。该目录由 PCI 固件规范（Revision 3.3）定义，旨在解决 32 位代码在某些平台上无法直接调用标准 BIOS 入口点的问题。 ^[pci-firmware-specification.md]

## 背景与目的

在 x86 架构系统中，标准的 BIOS 入口点（如中断 1Ah）主要面向 16 位代码设计。然而，在 32 位保护模式下，并非所有平台 BIOS 都支持 32 位调用者，这使得检测 32 位 BIOS 服务的存在与否变得困难。BIOS32 服务目录提供了一种统一的方法，用于检测平台上是否支持 32 位 BIOS 服务。 ^[pci-firmware-specification.md:11-12]

虽然该机制被设计为通用的，可支持检测任何 32 位 BIOS 服务，但其最重要的应用场景是检测 [[PCI BIOS]] 的存在并获取其入口点。 ^[pci-firmware-specification.md:11-12]

## 数据结构

实现了 BIOS32 服务目录的 BIOS 必须在物理地址范围 **0E0000h 至 0FFFFFh** 之间的某个 16 字节边界上嵌入一个连续的 16 字节数据结构。 ^[pci-firmware-specification.md:11-12]

下表描述了该数据结构的各字段： ^[pci-firmware-specification.md:12]

| 偏移量 | 大小 | 描述 |
|--------|------|------|
| 0 | 4 字节 | ASCII 签名字符串 `"_32_"`（下划线-3-2-下划线） |
| 4 | 4 字节 | BIOS32 服务目录入口点的 32 位物理地址 |
| 8 | 1 字节 | 修订级别，当前版本为 00h |
| 9 | 1 字节 | 长度，以段落（16 字节）为单位，该结构为 16 字节，因此该字段值为 01h |
| 0Ah | 1 字节 | 校验和，整个数据结构的字节和必须为零 |
| 0Bh | 5 字节 | 保留字段，必须为零 |

## 检测方法

客户端程序应扫描 0E0000h 至 0FFFFF0h 的地址范围，搜索 ASCII 签名 `"_32_"` 以及校验和有效的数据结构。 ^[pci-firmware-specification.md:12]

- 如果找到有效的数据结构，则可通过其中提供的人口点访问 BIOS32 服务目录
- 如果未找到该数据结构，则说明该平台不支持 BIOS32 服务目录，同时也不支持 PCI BIOS ^[pci-firmware-specification.md:12]

## 调用接口

### 调用环境要求

调用 BIOS32 服务目录前，需满足以下环境要求： ^[pci-firmware-specification.md:12-13]

- **CS 代码段选择子**和 **DS 数据段选择子**必须设置相同的基址，并涵盖包含入口点的物理页面及其紧随的下一个物理页面
- **SS 堆栈段选择子**必须提供至少 **1 KiB** 的堆栈空间
- 调用环境必须允许访问 I/O 空间

平台 BIOS 编写者应假设 CS 为仅执行权限，DS 为只读权限。 ^[pci-firmware-specification.md:13]

### 入口参数与返回参数

BIOS32 服务目录通过 **CALL FAR** 指令调用，所有参数通过寄存器传递： ^[pci-firmware-specification.md:12-13]

**入口参数：**
- `[EAX]`：服务标识符——用于标识所需服务的 4 字符字符串
- `[EBX]`：`[BL]` 为功能选择子（目前只定义了 0），`[EBX]` 的高 24 位必须为零

**返回参数：**
- `[AL]`：返回码
  - `00h`：所请求的服务存在
  - `80h`：所请求的服务不存在
  - `81h`：未实现的功能（BL 包含无法识别的值）
- `[EBX]`：BIOS 服务的基物理地址
- `[ECX]`：BIOS 服务的长度
- `[EDX]`：BIOS 服务的入口点（相对于 `EBX` 中基址的偏移量）

## PCI BIOS 32 位服务的检测

BIOS32 服务目录可用于检测 PCI BIOS 是否存在。PCI BIOS 的服务标识符为 **"$PCI"**（十六进制 49435024h）。 ^[pci-firmware-specification.md:13]

### 32 位 PCI BIOS 的访问

32 位 PCI BIOS 函数必须通过 **CALL FAR** 调用。调用前需根据 BIOS32 服务目录返回的 Base（EBX）和 Length（ECX）参数设置 CS 和 DS 描述子，两个描述子必须具有相同的基址。调用环境必须允许访问 I/O 空间并提供至少 1 KiB 的堆栈空间。 ^[pci-firmware-specification.md:13-14]

## 相关概念

[[PCI BIOS]] — BIOS32 服务目录最初设计用于检测的核心服务

[[PCI 配置空间]] — PCI BIOS 的主要操作对象

[[ACPI MCFG 表]] — ACPI 中用于描述 PCI Express 内存映射配置空间基址的机制

[[UEFI PCI 服务]] — 现代系统中替代传统 PCI BIOS 的固件接口

## 参考文献

PCI Firmware Specification, Revision 3.3, January 20, 2021, PCI-SIG

---

## Sources

- pci-firmware-specification.md

^[pci-firmware-specification.md]
