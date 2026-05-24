# Knowledge Wiki

## Concepts

- **[[dpc-下行端口-containment|DPC 下行端口 containment]]** — 增强型下行端口containment (eDPC)定义错误containment机制，当检测到不可纠正错误时自动禁用链路，防止损坏数据扩散，并支持异步移除（热插拔）
- **[[fault-system-resiliency-fsr|Fault System Resiliency (FSR)]]** — 通过0xC1错误恢复日志页面和异步事件请求机制检测并恢复存储设备上的panic故障，使故障驱动器优雅下线
- **[[nvm-express-nvme-architecture-overview|NVM Express (NVMe) Architecture Overview]]** — NVMe协议的核心架构，包括控制器(Controller)、NVM子系统(NVM Subsystem)、命名空间(Namespace)的层次结构和互连关系
- **[[nvm-sets-and-endurance-groups|NVM Sets and Endurance Groups]]** — NVM存储层次结构：NVM Set将命名空间与底层NVM资源关联，Endurance Group管理不同耐久等级的NVM介质，支持空间回收单元(RU/RUH/RG)
- **[[nvme-command-sets|NVMe Command Sets]]** — NVMe命令集体系，包括管理命令集(Admin Command Set)、I/O命令集(I/O Command Set)和Fabrics命令集，以及各命令集支持的命令类型
- **[[nvme-controller-types|NVMe Controller Types]]** — NVMe控制器类型分类：I/O控制器、管理控制器、行政控制器、Discovery控制器，以及动态控制器、静态控制器、虚拟控制器等实现模式
- **[[nvme-namespaces|NVMe Namespaces]]** — 命名空间概念，定义为主机可访问的逻辑块地址集合，支持共享、私有、分散式(Dispersed)等多种类型，以及命名空间ID(NSID)的管理
- **[[nvme-over-fabrics-nvme-of|NVMe over Fabrics (NVMe-oF)]]** — 通过Fabric网络传输NVMe协议的标准，包括Capsule(命令封装)机制、Discovery服务、Centralized Discovery Controller和Direct Discovery Controller架构
- **[[nvme-queue-architecture|NVMe Queue Architecture]]** — NVMe提交队列(Submission Queue)和完成队列(Completion Queue)的配对模型、队列轮询机制、命令仲裁机制(Arbitration)以及队列优先级
- **[[nvme-transport-models|NVMe Transport Models]]** — NVMe传输层模型：基于内存的传输模型(PCIe)和基于消息的传输模型(Fabrics)，包括各自的队列机制和数据传输方式
- **[[nvme遥测日志页面|NVMe遥测日志页面]]** — NVMe标准化的主机和控制器初始化遥测日志页面，包含设备健康监控、故障预测和根因分析所需的数据区域
- **[[ocp-v25存储规范|OCP v2.5存储规范]]** — 开放计算项目发布的下一代存储设备规范，定义了高弹性SSD的技术要求和接口标准
- **[[panic恢复机制|Panic恢复机制]]** — 存储设备通过固件断言、崩溃或硬挂起检测panic状态，通过非侵入式纠正措施恢复正常运行
- **[[pci-express-40-规范|PCI Express 4.0 规范]]** — PCIe 4.0规范于2019年发布，数据速率16 GT/s，保持向后兼容性，最大信道损耗28dB，实现扩展标签和信用、降低系统延迟、车道裕量等技术特性
- **[[pci-express-50-规范|PCI Express 5.0 规范]]** — PCIe 5.0规范于2019年5月发布，数据速率32 GT/s，最大信道损耗36dB，提升信号完整性和连接器机械性能，包含先进测试和调试能力
- **[[pcie-外形规格|PCIe 外形规格]]** — PCIe SSD的主要外形规格包括：M.2(最小占位)、AIC(最高兼容性)、U.2/SFF(易部署热插拔)、BGA(手持/IoT/汽车)，以及支持多达36个模块的SFF规格
- **[[pcie-ras-特性|PCIe RAS 特性]]** — PCIe架构提供高级可靠性、可用性、可服务性特性，包括CRC-32和链路级重试保护、分层事务超时支持、高级错误报告、降级链路宽度/低速支持和热插拔支持
- **[[pcie-ssd-存储接口|PCIe SSD 存储接口]]** — PCI Express作为SSD接口的优势：单通道1 GB/s性能(x1 PCIe 3.0)，延迟从10μs降至3μs，无外部SAS IOC节省7-10W功耗，支持CPU集成128条PCIe 3.0通道
- **[[sr-iov-单根io虚拟化|SR-IOV 单根I/O虚拟化]]** — 单根I/O虚拟化规范(SR-IOV)允许单一根复合体内的多个虚拟机共享PCIe适配器，端点向虚拟机监控器呈现多个虚拟功能(VF)，支持ATS和PRI进行性能优化
- **[[sris-独立参考时钟|SRIS 独立参考时钟]]** — 独立参考时钟和展频(SRIS)支持使PCIe无需板载参考时钟即可通过电缆传输，降低成本，支持OCuLink等低成本内外有线PCIe技术，支持2.5-16 GT/s数据速率
- **[[ssd年均故障率与mtbf指标|SSD年均故障率与MTBF指标]]** — 标准SSD的MTBF为250万小时(AFR 0.35%)，而VIHR SSD将MTBF提升至1000万小时(AFR 0.09%)
- **[[vertically-integrated-high-resilience-vihr-ssds|Vertically Integrated High Resilience (VIHR) SSDs]]** — 微软提出的面向云计算的垂直集成高弹性固态硬盘架构，通过四项关键能力显著降低系统年化故障率至0.09%

_22 pages | Generated 2026-05-24T07:36:51.060Z_
