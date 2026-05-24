# Knowledge Wiki

## Concepts

- **[[cba控制方法|_CBA控制方法]]** — ACPI控制方法，用于报告热插拔PCI段组的内存映射配置空间基地址，允许运行时更新热添加的PCI组件
- **[[osc机制|_OSC机制]]** — 用于向操作系统暴露PCI Express能力支持的ACPI控制方法，支持查询和控制PCI Express特性如ASPM、AER等
- **[[32gts-receiver-calibration|32GT/s Receiver Calibration]]** — Evolution from 8GT/s to 32GT/s calibration: variable ISI (34-37dB), knob controls for amplitude/Sj/DMI, Base Rev2 fixtures with MMPX coaxial connectors
- **[[burst-error-prevention-via-precoding|Burst Error Prevention via Precoding]]** — At 32GT/s, burst errors more likely with DFE tap ratios and 101010 patterns; precoding limits toggle pattern occurrences; enabled through Training Sets
- **[[dual-port-testing-removal-in-pcie-50-cem|Dual Port Testing Removal in PCIe 5.0 CEM]]** — CEM workgroup voted March 2020 to remove Dual Port requirement for 5.0 System Tx; new 5.0 System refclk jitter compliance test under development; only 2 scope channels needed
- **[[link-equalization-bypass|Link Equalization Bypass]]** — PCIe 5.0 optional feature allowing direct training from 2.5GT/s to 32GT/s, saving ~200ms to reach L0 state at 32GT/s
- **[[mcfg表|MCFG表]]** — ACPI中用于传递非热插拔PCI段组内存映射配置空间基地址的数据结构，支持在启动时向操作系统报告配置空间地址
- **[[pci-bios32-service-directory|PCI BIOS32 Service Directory]]** — 一种用于检测32位BIOS服务存在的机制，通过在物理地址0E0000h-0FFFFFh范围内查找签名"_32_"的16字节数据结构来实现
- **[[pci-express-50-specification-status|PCI Express 5.0 Specification Status]]** — PCIe 5.0 Base spec (Rev 1.0) released Q2 2019; CEM spec Rev 0.7 under development; PHY Test spec Rev 0.3 workgroup approved
- **[[pci段组pci-segment-group|PCI段组(PCI Segment Group)]]** — 纯软件概念，用于逻辑上分组PCI总线，支持系统中的256个以上总线，允许不同段组中的PCI总线使用相同的总线号
- **[[pci扩展rom格式|PCI扩展ROM格式]]** — PCI扩展ROM的内容格式、结构和代码入口点规范，包括传统PC兼容ROM(类型0)和UEFI扩展ROM(类型3)
- **[[pci配置空间访问机制|PCI配置空间访问机制]]** — 包括传统机制#1和#2用于访问PCI配置空间，以及用于PCI Express的增强配置访问机制，支持通过内存映射方式访问256-4095字节的扩展配置空间
- **[[pcie-40-to-50-performance-comparison|PCIe 4.0 to 5.0 Performance Comparison]]** — Data rate doubled from 16GT/s to 32GT/s; channel loss increased from -30dB to -37dB; eye width halved from 18.75ps to 9.375ps; refclk jitter limit tightened from 500fs to 150fs
- **[[reference-clock-jitter-measurement-for-pcie-50|Reference Clock Jitter Measurement for PCIe 5.0]]** — PCIe 5.0 refclk jitter limit very small (0.15ps RMS) vs 3.1ps for PCIe 2.0; new testing methodology required; CDR has lot of rejection at 33KHz to 2MHz
- **[[uefi-pci服务与驱动模型|UEFI PCI服务与驱动模型]]** — UEFI规范中定义的PCI根桥协议和PCI驱动模型，包括PCI I/O协议，支持UEFI环境下的PCI设备驱动开发
- **[[updated-cem-connector-and-edge-finger-layout|Updated CEM Connector and Edge Finger Layout]]** — PCIe 5.0 only allows SMT CEM connectors; includes ground vias at both sides of pad, pad size reduction, ground plane beneath edge fingers, 1.27mm (0.05") pitch

_16 pages | Generated 2026-05-24T07:39:45.526Z_
