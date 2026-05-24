---
title: Annualized Failure Rate
summary: AFR measures annual failure probability of storage devices; VIHR SSDs achieve 0.09% vs standard 0.35%
sources:
  - flash-memory-summit-2023.md
kind: concept
createdAt: "2026-05-24T04:28:37.216Z"
updatedAt: "2026-05-24T04:28:37.216Z"
tags:
  - reliability-metrics
  - storage
  - cloud-infrastructure
aliases:
  - annualized-failure-rate
  - AFR
confidence: 0.95
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "Annualized Failure Rate" (AFR) based on the provided source material from Flash Memory Summit 2023. Let me extract the relevant information from this source.

Key facts from the source:
1. AFR stands for Annualized Failure Rate
2. Standardized SSD AFR is 0.35% (derived from [[mtbf|MTBF]] of 2.5M hour)
3. With millions of SSDs in cloud infrastructure, this translates to hundreds of failures daily or tens of thousands yearly
4. VIHR (Vertically Integrated High Resilience) SSDs reduced system-level AFR to 0.09%
5. VIHR also elevated [[mtbf|MTBF]] to 10 million hours

I should explain what AFR is, how it's calculated (related to [[mtbf|MTBF]]), and provide context about its use in the industry. I should also suggest relevant wikilinks to related concepts.

Let me write this in zh-CN as requested.
</think>

# 年化故障率

**年化故障率**（Annualized Failure Rate，简称 AFR）是用于衡量设备或组件在一年内发生故障概率的可靠性指标。它通常以百分比形式表示，是可靠性工程和存储行业中的重要度量标准。

## 定义与计算

年化故障率表示在一年内设备发生故障的预期比例。如果已知设备的[[平均故障间隔时间]]（MTBF），可以通过以下公式估算 AFR：

$AFR = \frac{8,760}{[[mtbf|MTBF]]} \times 100\%$

其中 8,760 是一年的小时数。

例如，当 [[mtbf|MTBF]] 为 250 万小时时，对应的年化故障率约为 0.35%。^[flash-memory-summit-2023.md]

## 行业应用

在云基础设施中，年化故障率是评估存储设备可靠性的关键指标。根据行业标准，固态硬盘（SSD）的典型 [[mtbf|MTBF]] 为 250 万小时，对应的年化故障率为 0.35%。^[flash-memory-summit-2023.md]

在大规模部署场景中，这些百分比数据会产生显著的绝对影响。以拥有数千万块固态硬盘的云基础设施为例，即使故障率仅为千分之几，每年也会出现数以万计的设备故障——这意味着每天可能有数百块硬盘出现问题。^[flash-memory-summit-2023.md]

## 降低年化故障率的实践

业内通过采用高可靠性设计来降低 AFR。例如，垂直集成高弹性（VIHR）固态硬盘通过整合四项关键能力——遥测数据收集、固件更新、故障预测和故障系统弹性——成功将系统级年化故障率降低至 0.09%，同时将 [[mtbf|MTBF]] 提升至 1000 万小时。^[flash-memory-summit-2023.md]

## 与相关指标的关系

年化故障率与多个可靠性指标密切相关：

- **MTBF**：平均故障间隔时间，两者呈反比关系
- **SAFR**：系统年化故障率（System Annualized Failure Rate），衡量整个系统而非单设备的故障率
- **FIT**：Failures In Time，表示每十亿工作小时的故障数

## 参考文献

^[flash-memory-summit-2023.md]

---

## 相关链接

[[平均故障间隔时间]] | [[可靠性工程]] | [[固态硬盘]] | [[云存储]]
