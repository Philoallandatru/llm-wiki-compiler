---
title: BIOS32 Service Directory
summary: 检测32位BIOS服务存在性的机制，位于物理地址0E0000h-0FFFF0h范围内的16字节数据结构，包含服务标识符和入口点信息
sources:
  - pci-firmware-specification.md
kind: concept
createdAt: "2026-05-24T04:25:23.841Z"
updatedAt: "2026-05-24T04:25:23.841Z"
tags:
  - BIOS
  - 固件接口
  - 检测机制
aliases:
  - bios32-service-directory
  - BSD
confidence: 1
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "BIOS32 Service Directory" based on the provided source material from the PCI Firmware Specification. I need to:

1. Write in zh-CN (Simplified Chinese)
2. Follow the wiki structure with markdown
3. Include citations at the end of paragraphs/sentences
4. Include a "## Sources" section
5. Suggest [[wikilinks]] to related concepts
6. Be neutral, informative, concise but thorough
7. Draw facts only from the provided source material

Let me extract the relevant information from the source material about BIOS32 Service Directory:

From the PCI Firmware Specification:

Section 2.3 covers BIOS32 Service Directory:

2.3.1 - Determining the Existence of BIOS32 Service Directory
- A BIOS which implements the BIOS32 Service Directory must embed a specific, contiguous 16-byte data structure
- Beginning on a 16-byte boundary somewhere in the physical address range 0E0000h - 0FFFFh
- Table 2-1 describes the data structure fields:
  - Offset 0: 4 bytes - Signature string in ASCII "_32_"
  - Offset 4: 4 bytes - Entry point for the BIOS32 Service Directory (32-bit physical address)
  - Offset 8: 1 byte - Revision level (00h)
  - Offset 9: 1 byte - Length (01h for this 16-byte structure)
  - Offset 0Ah: 1 byte - Checksum (sum of all bytes must add up to 0)
  - Offset 0Bh: 5 bytes - Reserved. Must be zero.

- Clients should scan 0E0000h to 0FFFF0h looking for the ASCII signature and valid checksummed data structure
- If found, access through entry point provided in data structure
- If not found, then BIOS32 Service Directory (and also the PCI BIOS) is not supported


- The mechanism is accessed via far call to the provided entry point with specific setup requirements: both code and data segment selectors must map to the entry point's physical page and the following page with identical bases, CS is assumed execute-only and DS read-only, and the stack segment must provide at least 1 KiB of space while allowing I/O space access. The service directory itself performs a single function to determine if a particular 32-bit BIOS service is supported by the platform.

The function receives parameters through registers: EAX contains the four-character service identifier, EBX holds the low byte specifying the BIOS32 Service Directory function selector with remaining bytes reserved, while exiting returns AL with status codes (00h for present, 80h for absent, 81h for unrecognized function), EBX with the service's physical base address, ECX with its length, and EDX with the entry point offset from that base. The BIOS32 Service Directory also handles PCI BIOS detection when needed.

The PCI BIOS service identifier is "$PCI" (49435024h in little-endian), which must be invoked via far call with code and data segment descriptors configured to span the base address and length values returned by the BIOS32 Service Directory, maintaining the same segment base. The calling environment requires I/O space access and a minimum 1 KiB stack, with CS assumed execute-only and DS assumed read-only by platform BIOS implementations.
</think>

# BIOS32 服务目录

**BIOS32 Service Directory** 是一种用于检测平台是否支持 32 位 BIOS 服务的机制。在 x86 架构系统中，传统的 BIOS 入口点（如 INT 1Ah）无法被 32 位代码在所有机器上正确调用，因为平台 BIOS 可能不支持 32 位调用者。BIOS32 服务目录正是为解决这一问题而设计的。 ^[pci-firmware-specification.md:11-11]

## 存在性检测

实现 BIOS32 服务目录的 BIOS 必须嵌入一个特定的、连续的 16 字节数据结构，该结构必须位于物理地址范围 **0E0000h - 0FFFFh** 内，并且起始地址需对齐到 16 字节边界。 ^[pci-firmware-specification.md:11-11]

该数据结构的各字段定义如下（对应表 2-1）： ^[pci-firmware-specification.md:12-12]

| 偏移量 | 大小 | 描述 |
|--------|------|------|
| 0 | 4 字节 | ASCII 签名字符串 "_32_"（下划线-3-2-下划线） |
| 4 | 4 字节 | BIOS32 服务目录的入口点，为 32 位物理地址 |
| 8 | 1 字节 | 修订级别，当前版本为 00h |
| 9 | 1 字节 | 长度，以段落（16 字节）为单位，本结构为 16 字节，因此该字段值为 01h |
| 0Ah | 1 字节 | 校验和，所有字节之和必须等于 0 |
| 0Bh | 5 字节 | 保留字段，必须为零 |

客户端检测 BIOS32 服务目录存在性的方法是：从 0E0000h 到 0FFFF0h 范围内扫描，寻找匹配 "_32_" 签名且校验和有效的数据结构。如果找到该结构，则可通过其中提供的入口点地址访问 BIOS32 服务目录；如果未找到，则表明该平台不支持 BIOS32 服务目录，也不支持 PCI BIOS。 ^[pci-firmware-specification.md:12-12]

## 调用接口

BIOS32 服务目录通过 **CALL FAR**（远调用）访问数据结构调整中提供的入口点。调用环境须满足以下要求： ^[pci-firmware-specification.md:12-12]

- **CS 代码段选择子**和 **DS 数据段选择子**必须设置为涵盖入口点所在物理页面及其后续物理页面，两者须具有相同的基地址
- 平台 BIOS 编写者须假设 CS 为仅可执行（execute-only），DS 为仅可读（read-only）
- **SS 堆栈段选择子**必须提供至少 1 KiB 的堆栈空间
- 调用环境必须允许访问 I/O 空间

BIOS32 服务目录提供一个功能函数，用于判断特定 32 位 BIOS 服务是否被平台支持。所有参数通过寄存器传递。 ^[pci-firmware-specification.md:12-12]

**入口参数：**

- **[EAX]**：服务标识符，一个四字符的 ASCII 字符串，用于唯一标识所寻找的 32 位 BIOS 服务
- **[EBX]**：其中低字节 [BL] 为 BIOS32 服务目录功能选择子，当前仅定义了一个功能（编码为 0）；高三个字节保留，输入时必须为零

**出口参数：**

- **[AL]**：返回码
  - 00h：对应的服务存在
  - 80h：对应的服务不存在
  - 81h：BIOS32 服务目录未实现该功能（即 BL 包含无法识别的值）
- **[EBX]**：BIOS 服务基址的物理地址
- **[ECX]**：BIOS 服务的长度
- **[EDX]**：BIOS 服务入口点，为相对于 EBX 所提供基址的偏移量

## 与 PCI BIOS 的关联

BIOS32 服务目录可用于检测 PCI BIOS 是否存在。PCI BIOS 的服务标识符为 **"$PCI"**（ASCII 编码为 49435024h）。 ^[pci-firmware-specification.md:13-13]

32 位 PCI BIOS 功能必须通过 **CALL FAR** 访问。CS 和 DS 描述符必须按照 BIOS32 服务目录返回的 Base 和 Length 参数进行设置，两者须具有相同的基地址。调用环境必须允许访问 I/O 空间并提供至少 1 KiB 的堆栈空间。 ^[pci-firmware-specification.md:13-13]

## 参见

- [[PCI BIOS]] — BIOS32 服务目录的主要服务之一
- [[PCI 配置空间]] — PCI BIOS 操作的目标地址空间
- [[ACPI]] — 高级配置和电源接口规范
- [[UEFI]] — 统一可扩展固件接口

## 参考文献

^[pci-firmware-specification.md]

- PCI Firmware Specification Revision 3.3, Section 2.3 "BIOS32 Service Directory" (pp. 11-13)
