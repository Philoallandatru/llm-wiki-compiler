---
title: 32GT/s Receiver Calibration
summary: "Evolution from 8GT/s to 32GT/s calibration: variable ISI (34-37dB), knob controls for amplitude/Sj/DMI, Base Rev2 fixtures with MMPX coaxial connectors"
sources:
  - presentation-title-goes-here.md
kind: concept
createdAt: "2026-05-24T07:39:42.815Z"
updatedAt: "2026-05-24T07:39:42.815Z"
tags:
  - calibration
  - testing
  - pcie
aliases:
  - 32gts-receiver-calibration
  - 3RC
confidence: 0.9
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "32GT/s Receiver Calibration" based on the provided source material. Looking at the presentation PDF, I can see this is a PCI Express 5.0 Update presentation from PCI-SIG.

From the presentation, I can identify several relevant slides about 32GT/s Rx Calibration:

1. **Slide 8 of 33** - "Burst Error Prevention" - This is actually about burst errors, not directly about Rx calibration, but it mentions 32GT/s and DFE tap ratios.

2. **Slide 19 of 33** - "PCI Express 5.0 32GT/s Rx PG Calibration & Test" - This is a section header

3. **Slide 20 of 33** - "32GT/s Rx Calibration" - Shows "15mV / 0.3UI @ E-12 BER"

4. **Slide 21 of 33** - "Rx Calibration Evolution" - Compares 8GT/s, 16GT/s, and 32GT/s Rx calibration methods

5. **Slide 22 of 33** - "Rx Test Points" - Shows test point diagrams

6. **Slide 23 of 33** - "Points of Clarification" - Channel selection, cable handling, tie breakers

7. **Slide 25 of 33** - "Simulation Method Conversion Factor" - NEW, mentions Gen5 Base Calibration

8. **Slide 26 of 33** - "Other Considerations" - Replica channel, CTLE AC/DC gain step size

9. **Slide 27 of 33** - "Gen5 Base Calibration (11/5/2019)" - Detailed calibration results

Let me compile the key information from these slides:

**32GT/s Rx Calibration:**
- Eye Width: 9.375 ps (compared to 18.75 ps at 16GT/s)
- Eye Height: 15 mV (same as 16GT/s)


- Variable ISI (34 to 37dB) - same knobs as 16GT/s
- Base Rev2 fixtures under development (MMPX coaxial connector)
- Seasim (Base) & SigTest EH Extrapolation under investigation & noise impact
- 15mV / 0.3UI @ E-12 BER

**Rx Calibration Evolution:**
Comparing across generations, 8GT/s used fixed channel loss with Rj/DMI knobs and only CEM fixtures available, while 16GT/s introduced variable ISI (27 to 30dB) with improved test equipment correlation and more defined knob ranges.

32GT/s builds on the 16GT/s architecture with variable ISI (34 to 37dB) and the same knob set, though Base Rev2 fixtures are still being developed and noise impact remains under investigation. The test points are defined at TP1 (signal generator output), TP3 (after first coaxial cable), and TP2 (post-calibration). Channel selection requires picking between 27 & 30dB for Gen4 or 34 & 37dB for Gen5, with the preset chosen to maximize EA with optimal CTLE.

At 16GT/s, CTLE adjustment happens in ¼dB increments while 32GT/s uses 1dB steps. Cable treatment differs between rates—at 16GT/s the cable between TP1 and TP3 is part of the calibration channel, but at 32GT/s it's treated as part of the generator. Tie breaker logic prioritizes getting closest to EW target first, then Sj nominal value; for 32GT/s the priority shifts to highest channel loss first, then closest to target EH. The Gen5 Base Calibration performed on 11/5/2019 used Gen5 Base Rx Calibration Fixtures Rev3 with 15" pairs.

The 8" replica channel achieves approximately 36dB loss with Preset 6 Tx EQ. Final characterization shows 9.5ps eye width and 16.2mV eye height, with P6 achieving the best results at 17.5mV EH and 10.2ps EW. Additional considerations include whether to use physical replica channels with impedance discontinuities and cable de-embedding requirements versus cascaded filter approaches for replica channel and package models that handle less reflective channels without complex de-embedding. CTLE precision matters—at 16GT/s, ¼dB steps are needed for correlation, but at 32GT/s only 1dB steps have been explored so far.
</think>



# 32GT/s 接收机校准

## 概述

32GT/s 接收机校准是 PCI Express 5.0 规范中的关键测试环节，用于验证 32 GT/s 数据速率下接收机的信号眼图是否符合规范要求。与前代 16GT/s 技术相比，32GT/s 接收机校准面临更大的信道损耗和更严格的技术指标要求。^[presentation-title-goes-here.md]

PCI Express 5.0 规范规定的 32GT/s 接收机测试眼图目标为 **15mV 眼高**和 **0.3UI 眼宽**，对应 E-12 误码率（BER）标准。^[presentation-title-goes-here.md:20]

## 技术指标对比

PCI Express 技术演进过程中，接收机校准的关键参数发生了显著变化：^[presentation-title-goes-here.md:4]

| 参数 | PCIe 4.0 (16GT/s) | PCIe 5.0 (32GT/s) |
|------|-------------------|-------------------|
| 数据速率 | 16 GT/s | 32 GT/s |
| 信道损耗测试范围 | -27 至 -30 dB @ 8GHz | -34 至 -37 dB @ 16GHz |
| Add-in Card 损耗 | 8dB @ 8GHz | 9.5dB @ 16GHz |
| 参考 CTLE | 双极点；单零点；直流增益范围 (-6 至 -12) dB | 四极点；双零点；直流增益范围 (-5 至 -12) dB |
| 参考 DFE | 2 抽头 | 3 抽头 |
| 眼宽测试目标 | 18.75 ps | 9.375 ps |
| 眼高测试目标 | 15 mV | 15 mV |

## 校准方法演进

### 8GT/s 接收机校准

8GT/s 时代的接收机校准采用固定信道损耗模型，信道损耗包含在 SigTest 软件的封装参数中。可调参数包括 **Rj/DMI**（随机抖动/确定性模式抖动），但这些参数往往导致不现实的 Rj 值，因为规范未对其设定边界约束。当时仅有 **CEM 夹具**通过 PCI-SIG 销售，校准工具为 Seasim（Base 规范）和 SigTest（CEM 规范）。^[presentation-title-goes-here.md:21]

### 16GT/s 接收机校准

16GT/s 规范引入了可变 **ISI（符号间干扰）** 信道，测试范围扩展至 27dB 至 30dB，显著改善了测试设备的相关性。可调参数扩展为 **幅度/Sj/DMI**，并定义了允许范围。CEM 夹具和 Base 规范夹具均可通过 PCI-SIG 购买。Seasim 和 SigTest 工具继续用于 Base 规范和 CEM 规范的校准。^[presentation-title-goes-here.md:21]

### 32GT/s 接收机校准

32GT/s 接收机校准继承了 16GT/s 的技术框架，但测试信道损耗进一步提升至 **34dB 至 37dB**。可调参数保持与 16GT/s 一致，即幅度、正弦抖动（Sj）和 DMI。Base Rev2 校准夹具正在开发中，采用 **MMPX 同轴连接器**。Seasim 工具用于 Base 规范校准，而 SigTest 眼高外推及噪声影响仍在研究中。^[presentation-title-goes-here.md:21]

## 测试点定义

接收机校准涉及多个关键测试点的信号采集与测量：^[presentation-title-goes-here.md:23]

- **TP1**：信号发生器输出端
- **TP3**：第一根同轴电缆之后
- **TP2**：校准后的测量点（眼图参数提取位置）

在 16GT/s 速率下，TP1 与 TP3 之间的电缆被视为**校准信道的一部分**；而在 32GT/s 速率下，该电缆被视为**信号发生器的一部分**，不纳入信道损耗计算。^[presentation-title-goes-here.md:23]

## 信道选择与预设

### 信道选择准则

测试信道应在规定范围内选择。对于 Gen4（16GT/s），选择 27dB 至 30dB 之间的信道；对于 Gen5（32GT/s），选择 34dB 至 37dB 之间的信道。预设（Preset）应选择在与最优 CTLE 组合下能产生最大眼图面积（EA）的预设值。^[presentation-title-goes-here.md:23]

### CTLE 步进精度

连续时间线性均衡器（CTLE）的调整步进精度对校准结果有重要影响：
- **16GT/s**：需要 **1/4dB** 步进的精细调整以实现设备相关性
- **32GT/s**：目前仅探索 **1dB** 步进精度 ^[presentation-title-goes-here.md:23]

## 平局决胜规则

当存在多个满足条件的测试配置时，按以下优先级进行选择：^[presentation-title-goes-here.md:23]

**16GT/s 规则：**
1. 优先选择使眼宽最接近目标值的 Sj/DMI/幅度组合
2. 次选 Sj 最接近标称值的组合

**32GT/s 规则：**
1. 优先选择信道损耗最高的组合
2. 次选眼高最接近目标值的组合

## Gen5 Base 校准实例

以下数据来源于 2019 年 11 月 5 日的实际 Gen5 Base 校准测试：^[presentation-title-goes-here.md:27]

| 配置 | 眼高 EH (mV) | 眼宽 EW (ps) |
|------|--------------|--------------|
| P0 | 4.9 | 3.2 |
| P1 | 10.5 | 6.1 |
| P2 | 6.5 | 4.0 |
| P3 | 11.1 | 6.6 |
| P4 | 8.4 | 4.5 |
| P5 | 9.5 | 6.4 |
| **P6** | **17.5** | **10.2** |
| P7 | 6.8 | 5.0 |
| P8 | 9.1 | 6.7 |
| P9 | 11.9 | 7.7 |

**测试条件：**
- 校准信道：Gen5 Base Rx 校准夹具 Rev3
- 信道配置：15 英寸与 8 英寸复制线对（~36dB 损耗）
- 最优发送端均衡：Preset 6
- 最终 Sj：3.5ps（高于标称值 0.375ps）
- 最终 DMI：12.35mV @ TP2（高于标称值 2.35mV）
- 最终眼宽：9.5ps
- 最终眼高：16.2mV

测试结果显示，P6 配置取得了最佳性能，达到 17.5mV 眼高和 10.2ps 眼宽。^[presentation-title-goes-here.md:27]

## 复制信道与封装嵌入

32GT/s 接收机校准中存在两种复制信道方法的选择：^[presentation-title-goes-here.md:26]

**物理复制信道方案：**
- 使用实际物理复制信道
- 引入额外的阻抗不连续性
- 需要进行电缆去嵌入处理
- 采用级联滤波器处理复制信道与封装模型

**级联滤波器方案：**
- 使用级联滤波器替代物理复制信道
- 信道反射性更低
- 无需复杂的去嵌入处理
- 适用于对阻抗敏感度较低的应用场景

## 相关概念

- [[PCI Express 5.0]] — 32GT/s 技术的核心规范
- [[判决反馈均衡器]] (DFE) — 接收机中的关键信号恢复组件
- [[连续时间线性均衡器]] (CTLE) — 高速信号链中的前端均衡技术
- [[眼图分析]] — 评估高速信号质量的标准方法
- [[突发错误预防]] — 32GT/s 速率下的信号完整性保障机制

---

## Sources

- [PCI Express 5.0 Update: Keys to Addressing an Evolving Specification](presentation-title-goes-here.md)
