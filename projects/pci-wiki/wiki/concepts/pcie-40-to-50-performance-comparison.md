---
title: PCIe 4.0 to 5.0 Performance Comparison
summary: Data rate doubled from 16GT/s to 32GT/s; channel loss increased from -30dB to -37dB; eye width halved from 18.75ps to 9.375ps; refclk jitter limit tightened from 500fs to 150fs
sources:
  - presentation-title-goes-here.md
kind: concept
createdAt: "2026-05-24T07:39:26.090Z"
updatedAt: "2026-05-24T07:39:26.090Z"
tags:
  - pcie
  - performance
  - signal-integrity
aliases:
  - pcie-40-to-50-performance-comparison
  - P4T5PC
confidence: 0.95
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "PCIe 4.0 to 5.0 Performance Comparison" based on the provided source material.

Let me analyze the source material from the PDF presentation "PCI Express 5.0 Update: Keys to Addressing an Evolving Specification" (June 9, 2020).

Key facts to extract:
1. Data Rate: PCIe 4.0 = 16 GT/s, PCIe 5.0 = 32 GT/s (doubled)
2. Channel Loss (Rx Test Range): PCIe 4.0 = -27 to -30 dB @ 8GHz, PCIe 5.0 = -34 to -37 dB @ 16GHz
3. Add-in Card Loss: PCIe 4.0 = 8dB @ 8GHz, PCIe 5.0 = 9.5dB @ 16GHz
4. Reference CTLE: 
   - PCIe 4.0: 2 Poles; 1 Zero; DC Gain Range (-6 to -12) dB
   - PCIe 5.0: 4 Poles; 2 Zero; DC Gain Range (-5 to -12) dB
5. Reference DFE: PCIe 4.0 = 2-Taps, PCIe 5.0 = 3-Taps
6. Eye Width (Rx Test): PCIe 4.0 = 18.75 ps, PCIe 5.0 = 9.375 ps (half)
7. Eye Height (Rx Test): PCIe 4.0 = 15 mV, PCIe 5.0 = 15 mV (same)
8. Rx Jitter Tolerance:
   - PCIe 4.0: Separate curves for CC & SRIS at 16GT/s
   - PCIe 5.0: One curve for CC & SRIS at 16GT/s & 32GT/s


9. Lane Margining: PCIe 4.0 = Required for timing only, PCIe 5.0 = Required for timing and voltage

The reference clock high frequency jitter limits tightened significantly from PCIe 4.0 to 5.0, dropping from 500 fs to 150 fs. The specification itself reached a milestone with PCIe 5.0 Base Specification Rev 1.0 released in Q2 2019, establishing the foundational requirements for the next generation.

The implementation side progressed further with the CEM Specification Rev 0.7 currently under development and the PHY Test Specification Rev 0.3 approved, though both remained in draft status as of April 2020. In contrast, PCIe 4.0 achieved final specification status across all versions, with Integrators List testing beginning in August 2019.

Several architectural improvements distinguish the two generations. PCIe 5.0 introduces an optional [[link-equalization-bypass|Link Equalization Bypass]] feature enabling direct training from 2.5 GT/s to 32 GT/s, potentially cutting L0 transition time by roughly 200 milliseconds. There's also a burst error prevention mechanism that counters the increased likelihood of burst errors at 32GT/s by using precoding to mitigate 101010 pattern issues. The connector specifications shifted toward SMT-only CEM implementations with optimized ground vias at pad boundaries.
</think>

# PCIe 4.0 到 5.0 性能对比

## 概述

PCI Express 5.0（PCIe 5.0）规范是 PCIe 4.0 的重大升级版本，于 2019 年第二季度正式发布 1.0 版本。^[presentation-title-goes-here.md] 与前代相比，PCIe 5.0 将数据传输率从 16 GT/s 翻倍至 32 GT/s，并引入了一系列针对更高速度传输的信号完整性改进。^[presentation-title-goes-here.md:1]

## 核心规格对比

| 参数 | PCIe 4.0 | PCIe 5.0 |
|------|----------|----------|
| 数据传输率 | 16 GT/s | 32 GT/s |
| 每通道理论带宽 | 16 GT/s | 32 GT/s |
| x16 理论带宽 | ~64 GB/s（双向） | ~128 GB/s（双向）|

^[presentation-title-goes-here.md:5]

## 信号完整性规格

### 通道损耗

PCIe 5.0 在更高频率下运行，因此允许的通道损耗范围显著增加：接收端测试范围从 PCIe 4.0 的 -27 至 -30 dB @ 8GHz 扩展至 -34 至 -37 dB @ 16GHz。^[presentation-title-goes-here.md:5] 插件卡损耗从 8 dB @ 8GHz 调整为 9.5 dB @ 16GHz。^[presentation-title-goes-here.md:5]

### 均衡器改进

接收端连续时间线性均衡器（CTLE）从 PCIe 4.0 的 2 极点、1 零点升级为 PCIe 5.0 的 4 极点、2 零点。直流增益范围从 -6 至 -12 dB 调整为 -5 至 -12 dB。^[presentation-title-goes-here.md:5] 判决反馈均衡器（DFE）抽头数从 2 增加至 3。^[presentation-title-goes-here.md:5]

### 眼图规格

接收端测试眼宽从 18.75 ps 缩小至 9.375 ps（减半），眼高保持 15 mV 不变。^[presentation-title-goes-here.md:5]

### 抖动容限

PCIe 4.0 在 16 GT/s 速率下为公共时钟（CC）和独立参考时钟独立恢复时钟（SRIS）分别使用不同的抖动容限曲线。PCIe 5.0 在 16 GT/s 和 32 GT/s 速率下统一采用单一曲线。^[presentation-title-goes-here.md:5]

### 边缘裕量

PCIe 4.0 仅要求时序相关的边缘裕量测试。PCIe 5.0 扩展了要求，现在同时需要时序和电压的边缘裕量测量。^[presentation-title-goes-here.md:5]

### 参考时钟抖动限制

参考时钟高频抖动限制从 PCIe 4.0 的 ≤500 fs 大幅收紧至 PCIe 5.0 的 ≤150 fs。^[presentation-title-goes-here.md:5] 这反映了更高数据率对时钟质量的更高要求。

## 链路均衡改进

### 链路均衡旁路

PCIe 5.0 引入了可选的链路均衡训练旁路功能，允许设备直接从 2.5 GT/s 训练至 32 GT/s，无需经过中间速率。^[presentation-title-goes-here.md:7] 传统训练序列（2.5 GT/s → 8 GT/s → 16 GT/s → 32 GT/s）仍然被支持。如果链路上的所有组件都支持，选项可以完全跳过链路均衡。^[presentation-title-goes-here.md:7] 估计可节省约 200ms 到达 L0 状态的时间。^[presentation-title-goes-here.md:7]

### 突发错误预防

由于 DFE 抽头比率的原因，32 GT/s 速率下更容易出现突发错误。这种错误传播可能发生在 101010 模式中。预编码（Precoding）可以限制切换模式的发生。接收端可在 32 GT/s 及以上数据率从发送端请求预编码，通过训练序列启用。^[presentation-title-goes-here.md:8]

## 连接器与金手指改进

PCIe 5.0 仅允许使用表面贴装技术（SMT）CEM 连接器。^[presentation-title-goes-here.md:9] 优化包括：焊盘两侧的接地过孔、缩小的焊盘尺寸、优化的边缘金手指布局、减小的金手指尺寸以及金手指下方的接地平面。^[presentation-title-goes-here.md:9] 金手指间距维持 1.27mm（0.05 英寸）。^[presentation-title-goes-here.md:9]

## 规范状态

截至 2020 年 4 月 8 日：

- PCIe 5.0 基础规范（Base Specification）1.0 版已发布（2019 年第二季度），描述芯片级别的各层行为
- PCIe 5.0 CEM 规范 0.7 版正在开发中，定义系统和插件卡级别
- PCIe 5.0 PHY 测试规范 0.3 版已获工作组批准，描述发射机、接收机均衡与锁相环带宽的电气合规测试
- PCIe 4.0 所有规范均已发布 1.0 版，集成商列表测试于 2019 年 8 月开始

^[presentation-title-goes-here.md:4]

## 接收端校准演进

### PCIe 2.0/4.0/5.0 对比

| 方面 | PCIe 8GT/s | PCIe 16GT/s | PCIe 32GT/s |
|------|-----------|-------------|-------------|
| 通道损耗 | 固定（含封装嵌入） | 变量 27-30 dB | 变量 34-37 dB |
| 调节旋钮 | Rj/DMI | 幅度/Sj/DMI | 同 16GT/s |
| 可用fixtures | 仅 CEM | 基础+CEM | 基础 Rev2 开发中 |

^[presentation-title-goes-here.md:21]

## 参考时钟测试

PCIe 5.0 的参考时钟相位抖动要求变得更加严格，测试方法也发生了变化。^[presentation-title-goes-here.md:29] 基础规范路径仿真使用 250 fs 参考时钟抖动。额外 100 fs 抖动来自基础规范限制的附加噪声、串扰以及边缘展平（垂直噪声转换为抖动）。^[presentation-title-goes-here.md:31] 所有情况均显示包括 30 dB 通道（附加噪声且启用展频时钟 SSC）时抖动小于 250 fs。^[presentation-title-goes-here.md:31]

## 相关概念

- [[PCIe 5.0 规范]] — PCIe 5.0 的完整规范文档
- [[信号完整性]] — 高速数据传输中的信号质量研究领域
- [[均衡器]] (Equalizer) — 用于补偿通道损耗的信号处理技术
- [[链路训练]] (Link Training) — PCIe 链路初始化过程

---

## Sources

- [PCI Express 5.0 Update: Keys to Addressing an Evolving Specification](presentation-title-goes-here.md)
