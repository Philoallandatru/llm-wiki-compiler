---
title: _OSC机制
summary: 用于向操作系统暴露PCI Express能力支持的ACPI控制方法，支持查询和控制PCI Express特性如ASPM、AER等
sources:
  - pci-firmware-specification.md
kind: concept
createdAt: "2026-05-24T07:38:37.816Z"
updatedAt: "2026-05-24T07:38:37.816Z"
tags:
  - acpi
  - pci-express
  - capabilities
aliases:
  - osc机制
confidence: 0.85
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "_OSC机制" (_OSC Mechanism) based on the provided source material from the PCI Firmware Specification.

Let me extract the relevant information from the source material:

From Section 4.5 "_OSC – A Mechanism for Exposing PCI Express Capabilities Supported by an Operating System":

1. **What is _OSC**: It's a mechanism for exposing PCI Express capabilities supported by an operating system. It's used for PCI host bridge devices.

2. **Purpose**: _OSC allows firmware to query the operating system about what PCI Express features the OS supports and is willing to manage.

3. **Location**: The _OSC interface is for PCI Host Bridge devices.

4. **How it works**: 
   - Firmware evaluates _OSC with specific arguments
   - OS returns capabilities in a buffer
   - The _OSC Support Field and Control Field are used

5. **Rules for evaluating _OSC**:
   - Query Flag
   - Evaluation Conditions
   - Sequence of _OSC Calls
   - Dependencies Between _OSC Control Bits

6. **ASL Example**: Section 4.5.3 provides an ASL example

Let me look at the specific details:

From Table 4-4: Interpretation of the _OSC Support Field
- This field indicates which PCI Express capabilities the OS is being queried about
- It includes bits for:
  - PCIE_hotplug
  - shpc_power_controller_device
  - shpc_rom
  - ASPM
  - Reserved
  - PCI Express native PCIe capability
  - PCIe capability (for SHPC native PCIe)
  - MSI
  - _DSM for PCIe SSD Status LED Management
  - _DSM for Runtime Device Power Management
  - _DSM for Downstream Port Containment
  - _DSM for TPH_ST (Transaction Processing Hint - Sideband Tags)

From Table 4-5: Interpretation of the _OSC Control Field (Passed in via Arg3)


- The OS receives which capabilities firmware supports and decides which to manage
- Arg3 contains a buffer with a support field indicating queried capabilities and a control field showing OS preferences

From Table 4-6: Interpretation of the _OSC Control Field (Returned Value)
- The OS returns control bits indicating which capabilities it accepts responsibility for managing

The _OSC interface serves as a negotiation mechanism between firmware and the operating system for PCI Express feature management. Firmware initiates the query by evaluating _OSC, passing information about what features are available, and the OS responds by specifying which capabilities it will handle independently.
</think>

# _OSC 机制

## 概述

_OSC（Operating System Capabilities）是ACPI规范中定义的一种机制，用于向操作系统查询其支持哪些PCI Express功能并愿意接管这些功能的管理。_OSC接口专门针对PCI主机桥设备设计，允许系统固件了解操作系统能够正确处理哪些PCI Express特性。^[pci-firmware-specification.md]

## 背景

在现代计算机系统中，PCI Express规范定义了多种可选功能，如ASPM（Active State Power Management）、热插拔、MSI（Message Signaled Interrupt）等。操作系统需要知道哪些功能可以由其直接管理，哪些仍由固件控制。_OSC机制提供了一种标准的查询和协商方式，使固件能够将设备控制权移交给操作系统。^[pci-firmware-specification.md]

## 接口参数

_OSC控制方法接收三个参数，返回一个包含操作系统能力信息的缓冲区。

### 输入参数

| 参数 | 类型 | 描述 |
|------|------|------|
| Arg0 | UUID | 标识_OSC查询类型的UUID标识符 |
| Arg1 | 整数 | 修订ID，用于标识_OSC接口的版本 |
| Arg2 | 整数 | 查询计数，固件递增该值以触发新的_OSC查询 |
| Arg3 | 缓冲区 | 包含支持字段和控制字段的数据包 |

^[pci-firmware-specification.md]

### 输出缓冲区

返回的缓冲区包含两个字段：支持字段（Support Field）和控制字段（Control Field）。支持字段标识操作系统正在被查询的PCI Express功能能力，控制字段则由操作系统填充，表示其愿意接受哪些功能的管理责任。^[pci-firmware-specification.md]

## 支持字段定义

支持字段定义了操作系统可以被查询的PCI Express功能集合，主要包括：

| 功能 | 描述 |
|------|------|
| PCIE_hotplug | PCI Express热插拔 |
| shpc_power_controller_device | SHPC电源控制器设备 |
| shpc_rom | SHPC ROM |
| ASPM | Active State Power Management |
| PCIe_native | PCI Express原生PCIe能力 |
| SHPC_native | SHPC原生PCIe能力 |
| MSI | 消息信号中断 |
| DSM_SSD_LED | _DSM for PCIe SSD Status LED Management |
| DSM_PwrMgmt | _DSM for Runtime Device Power Management |
| DSM_DPC | _DSM for Downstream Port Containment |
| DSM_TPH_ST | _DSM for TPH_ST (Transaction Processing Hint - Sideband Tags) |

^[pci-firmware-specification.md]

## 控制字段协商

### 传入控制字段

传入控制字段表示固件支持的PCI Express功能能力。操作系统检查传入控制字段中各功能的"查询"位，如果某功能被置位，操作系统将在返回的控制字段中设置对应位来指示其是否接受该功能的管理责任。^[pci-firmware-specification.md]

### 返回控制字段

返回控制字段包含操作系统接受管理责任的功能位。操作系统必须将未请求的功能位清零。操作系统通过返回控制字段告知固件它将接管哪些功能的管理。^[pci-firmware-specification.md]

## _OSC评估规则

### 查询标志

_OSC方法的Arg2参数作为查询标志使用。固件必须递增查询计数器的值（从0开始），每次评估_OSC时都传递更新后的计数值。操作系统根据查询计数器的变化确定固件是否发起了新的查询。^[pci-firmware-specification.md]

### 评估条件

操作系统必须满足以下条件才会评估_OSC：操作系统必须已经识别出主机桥设备；如果支持字段中设置了"查询"位，且操作系统支持该功能，则操作系统可以评估_OSC。^[pci-firmware-specification.md]

### _OSC调用序列

操作系统只会在系统启动时评估一次_OSC，除非固件增加了查询计数器的值。如果查询计数器值发生变化，操作系统将重新评估_OSC。^[pci-firmware-specification.md]

### 控制位之间的依赖关系

某些_OSC控制位存在依赖关系。例如，PCI Express原生热插拔功能依赖于PCI Express原生 PCIe Capability功能。如果操作系统拒绝管理PCI Express原生 PCIe Capability功能，则必须同时拒绝管理PCI Express原生热插拔功能。^[pci-firmware-specification.md]

## ASL实现示例

```asl
Method(_OSC, 4) {
    If (Arg0 == UUID) {
        If (Arg1 != 1) {
            Return (Buffer() { 0 })
        }
        // 检查查询计数
        If (Arg2 > SaveCnt) {
            SaveCnt = Arg2
            If (And(Arg3[0], PCIE_HOTPLUG)) {
                // 操作系统支持热插拔，设置相应位
                SaveCtrl = Or(SaveCtrl, PCIE_HOTPLUG)
            }
            // ... 其他功能检查
        }
        Return (Buffer() {
            // 返回控制字段
        })
    }
    Return (Buffer() { 0 })
}
```

^[pci-firmware-specification.md]

## 与相关机制的关系

_OSC机制与其他ACPI PCI服务密切相关。_DSM（Device-Specific Method）用于定义PCI Express设备的特定功能，而_OSC用于在主机桥层面协商操作系统对这些功能的接管能力。操作系统通过_OSC明确表示愿意管理哪些特性后，固件应停止对这些特性的干预。^[pci-firmware-specification.md]

## 相关概念

- [[_DSM定义]] - ACPI中用于设备特定控制的方法
- [[PCI主机桥]] - _OSC接口适用的设备类型
- [[PCI Express热插拔]] - 可通过_OSC协商管理的功能之一
- [[ACPI命名空间]] - _OSC对象所在的ACPI层次结构
- [[ASPM]] - Active State Power Management，可通过_OSC协商

---

## Sources

- [PCI Firmware Specification Revision 3.3](pci-firmware-specification.md)
