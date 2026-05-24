# Knowledge Wiki

## Concepts

- **[[dsm设备特定方法|_DSM设备特定方法]]** — ACPI中用于PCI/PCI Express设备特定功能的_DSM方法集，包括插槽信息、延迟容差报告、D3cold辅助电源、PERST#延迟、下游端口Containment以及SSD状态LED管理等功能
- **[[osc控制方法|_OSC控制方法]]** — ACPI控制方法，用于在固件和操作系统之间协商暴露PCI Express能力，定义了查询标志、评估条件、_OSC调用序列以及控制位之间的依赖关系
- **[[32gts接收校准演进|32GT/s接收校准演进]]** — 从固定信道损耗到可变ISI（34-37dB），增加了幅度/Sj/DMI可调范围，Base Rev2 fixture采用MMPX同轴连接器
- **[[链路均衡旁路link-eq-bypass|链路均衡旁路（Link EQ Bypass）]]** — PCIe 5.0可选功能，允许从2.5GT/s直接训练到32GT/s，绕过中间速率，节省约200ms的L0时间，若链路所有组件支持还可完全跳过链路均衡
- **[[突发错误预防与预编码precoding|突发错误预防与预编码（Precoding）]]** — 32GT/s速率下101010模式易引发DFE错误传播，通过预编码限制切换模式发生，接收器可在≥32GT/s速率请求发射器启用预编码功能
- **[[bios32-service-directory|BIOS32 Service Directory]]** — 检测32位BIOS服务存在性的机制，位于物理地址0E0000h-0FFFF0h范围内的16字节数据结构，包含服务标识符和入口点信息
- **[[cem发射测试与双端口测试取消|CEM发射测试与双端口测试取消]]** — 2020年3月CEM工作组投票取消5.0系统发射的双端口测试要求，32GT/s系统测试将采用与Add-in Card相同的CDR和参考Rx EQ算法，仅需2个示波器通道
- **[[mcfg表与cba方法|MCFG表与_CBA方法]]** — ACPI规范中用于向操作系统传达内存映射PCI配置空间基地址的机制：MCFG表用于引导时不 可热拔插的PCI段组，_CBA方法用于运行时热插拔场景
- **[[pci段组pci-segment-group|PCI段组(PCI Segment Group)]]** — 纯软件概念，用于逻辑上分组PCI总线和PCI Express层级，支持系统中超过256条总线，允许不同PCI段组复用相同的总线编号
- **[[pci扩展rom格式|PCI扩展ROM格式]]** — PCI扩展ROM的结构和内容规范，包括ROM头格式、PCI数据结构、设备列表格式，以及传统BIOS兼容ROM（类型0）和UEFI ROM（类型3）的执行环境要求
- **[[pci配置空间访问机制|PCI配置空间访问机制]]** — 通过INT 1Ah或内存映射方式访问PCI配置空间的两种机制：传统I/O访问（CF8/CFC）和PCI Express增强配置访问（MMCFG），支持256字节标准及4KiB扩展配置空间
- **[[pcie-40到50基础规范变化|PCIe 4.0到5.0基础规范变化]]** — 数据率从16GT/s翻倍至32GT/s，信道损耗从27-30dB增至34-37dB，CTLE从2极点1零点升级为4极点2零点，DFE从2-Taps增至3-Taps，眼宽从18.75ps降至9.375ps，Refclk抖动限制从500fs收紧至150fs
- **[[pcie-50-规范状态与发布时间线|PCIe 5.0 规范状态与发布时间线]]** — PCIe 5.0 Base规范于2019年Q2发布Rev 1.0，CEM规范在2020年处于0.7版本开发阶段，PHY测试规范为0.3版本
- **[[pcie-50参考时钟抖动测量|PCIe 5.0参考时钟抖动测量]]** — Refclk抖动限制从3.1ps RMS（PCIe 2.0）大幅收紧至0.15ps RMS，CDR模型与SRIS相同具有良好高频抑制，测试需使用参考接收机CTLE和DFE及特定时域CDR定义
- **[[pcie-gen5连接器与边缘手指布局更新|PCIe Gen5连接器与边缘手指布局更新]]** — 仅允许SMT CEM连接器，优化包括接地过孔置于焊盘两侧、焊盘尺寸减小、边缘手指尺寸缩减、边缘手指下方增设接地层，间距1.27mm
- **[[uefi-pci驱动模型|UEFI PCI驱动模型]]** — UEFI规范中定义的PCI设备驱动框架，包括PCI根桥协议（提供内存、I/O和配置周期抽象）、PCI驱动模型、以及在UEFI预引导环境中轮询驱动的执行方式

_16 pages | Generated 2026-05-24T04:26:56.891Z_
