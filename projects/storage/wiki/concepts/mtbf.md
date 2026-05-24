---
title: MTBF
summary: Mean Time Between Failures - industry standard metric; VIHR achieves 10M hours vs standard 2.5M hours
sources:
  - flash-memory-summit-2023.md
kind: concept
createdAt: "2026-05-24T04:28:42.673Z"
updatedAt: "2026-05-24T04:28:42.673Z"
tags:
  - reliability-metrics
  - storage
aliases:
  - mtbf
confidence: 0.9
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "MTBF" (Mean Time Between Failures). I need to look at the source material provided to gather information about this topic.

Looking at the source material (flash-memory-summit-2023.md), I can find the following relevant information about MTBF:

1. From slide 1 (line 5-8): "Given the standardized SSD Mean Time Between Failures (MTBF) of 2.5M hour or [[annualized-failure-rate|Annualized Failure Rate]] (AFR) of 0.35% prevalent in the industry, a significant number of storage devices, in the hundreds daily or tens of thousands yearly, encounter failures."

2. From slide 6 (Results): "The benefits of system failure savings increase as the fleet grows." and "Elevating the Mean Time Between Failures (MTBF) to 10 million hours"

So the source material mentions MTBF in the context of SSDs and cloud storage infrastructure. I should write a wiki page about MTBF drawing from this information, while also noting that this is a general concept I may need to infer about.

Let me structure a comprehensive wiki page about MTBF:

1. Overview/Definition
2. Calculation/Formula
3. Relationship with AFR ([[annualized-failure-rate|Annualized Failure Rate]])
4. Applications in Storage Industry
5. Limitations
6. Related Concepts
7. Sources

I'll write this in zh-CN (Simplified Chinese) as requested, with proper citations and wikilinks.
</think>

# MTBF

## 概述

MTBF（Mean Time Between Failures，平均无故障工作时间）是衡量系统或组件可靠性的关键指标，表示设备在两次故障之间正常运行时的平均时间长度。MTBF 值越高，通常意味着设备的可靠性越强。 ^[flash-memory-summit-2023.md]

## 定义与计算

MTBF 表示相邻两次故障之间的平均运行时间，其计算基于设备在投入使用后发生故障的时间点统计。在存储行业，标准化的 SSD MTBF 通常为 250 万小时（约 2.5M 小时），对应的年化故障率（Annualized Failure Rate, AFR）约为 0.35%。 ^[flash-memory-summit-2023.md]

MTBF 与 AFR 之间存在数学关系，当 MTBF 值为 250 万小时时，可以通过以下公式推算年化故障率：

**AFR ≈ 8760 小时 / MTBF × 100%**

例如，MTBF 为 250 万小时时：
8760 ÷ 2,500,000 × 100% ≈ 0.35%

## 在存储行业的应用

### 大规模基础设施

在拥有数千万块 SSD 的大型云存储基础设施中，即使 AFR 仅为 0.35%，每天也会有数百块存储设备发生故障，全年累计可达数万块。这种规模下，MTBF 成为评估系统韧性和规划运维资源的重要依据。 ^[flash-memory-summit-2023.md]

### 高可靠性存储系统

通过采用具有更高 MTBF 指标的存储设备，可以显著降低系统级年化故障率（System [[annualized-failure-rate|Annualized Failure Rate]], SAFR）。例如，采用垂直集成高韧性（VIHR）SSD 技术，可以将 MTBF 提升至 1000 万小时，从而大幅减少故障设备数量。 ^[flash-memory-summit-2023.md]

## 相关概念

- [[AFR]] — 年化故障率，与 MTBF 密切相关
- [[SAFR]] — 系统级年化故障率
- [[NVMe Telemetry Log Page]] — 用于收集设备健康数据以预测故障
- [[故障预测]] — 基于遥测数据预判设备故障
- [[SSD]] — 使用 MTBF 衡量可靠性的存储设备
- [[可靠性工程]] — 研究系统可靠性的工程学科

## 局限性

MTBF 作为统计平均值，存在以下局限性：

- **不适用于可修复系统**：MTBF 主要适用于不可修复组件的平均故障间隔
- **早期故障期影响**：设备投入使用初期的"浴缸曲线"早期故障阶段会显著影响 MTBF 计算结果
- **工作负载相关性**：MTBF 通常基于标准工作负载条件，实际使用环境可能差异较大
- **无法预测个体故障**：MTBF 是群体统计指标，无法预测单个设备的具体故障时间

## 参考文献

- Flash Memory Summit 2023, "Vertically Integrated High Resilience SSDs Designed for Cloud Computing", Ayberk Ozturk, Microsoft ^[flash-memory-summit-2023.md]
