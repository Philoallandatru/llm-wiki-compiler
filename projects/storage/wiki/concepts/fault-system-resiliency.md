---
title: Fault System Resiliency
summary: Storage device capability that detects and recovers from firmware panics, crashes, or hard hangs through non-invasive corrective actions
sources:
  - flash-memory-summit-2023.md
kind: concept
createdAt: "2026-05-24T04:28:57.210Z"
updatedAt: "2026-05-24T04:28:57.210Z"
tags:
  - storage
  - fault-tolerance
  - firmware
aliases:
  - fault-system-resiliency
  - FSR
confidence: 0.9
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "Fault System Resiliency" based on the source material provided. Let me analyze the source material carefully.

From the Flash Memory Summit 2023 document, the key information about Fault System Resiliency (FSR) is:

1. A panic is defined as a firmware assert, crash, or hard hang
2. FSR detects and recovers from a panic on a storage device
3. Panic response is established through 0xC1 Error Recovery Log Page and Asynchronous Event Request (AER)
4. A panic condition is identified through CSTS.CFS bit or AEN
5. Storage device performs one or more non-invasive corrective actions to recover from a detected panic condition to facilitate a normal operational state between a host system and the storage system
6. Systems with panic drives are moved to offline gracefully without impacting workload for further inspection and repair

I need to:
1. Write in zh-CN (Simplified Chinese)
2. Include wikilinks to related concepts
3. Add source citations
4. Include a Sources section at the end
5. Be neutral, informative, concise but thorough

Let me identify related concepts that would benefit from wikilinks:
- Solid-State Drive (SSD) - mentioned in context
- NVMe - mentioned (Telemetry Log Page, Error Recovery Log Page)
- Panic (firmware assert, crash, hard hang)
- Telemetry
- [[annualized-failure-rate|Annualized Failure Rate]] (AFR)
- Mean Time Between Failures ([[mtbf|MTBF]])
- Fault tolerance
- Vertically Integrated High Resilience (VIHR) SSDs

Let me write a comprehensive wiki page in Chinese.
</think>



# 故障系统弹性

**故障系统弹性**（Fault System Resiliency，简称 FSR）是 [[固态硬盘]]（SSD）设计中的一项关键能力，旨在检测并从存储设备上的 panic（固件断言、崩溃或硬挂起）状态中恢复。 ^[flash-memory-summit-2023.md]

## 概述

在云基础设施中，存储设备的可靠性至关重要。当存储设备发生 panic 时，FSR 机制能够自动检测异常状态并执行恢复操作，使主机系统与存储系统之间恢复正常运行状态，而非简单地让设备下线。这一能力显著提升了系统的整体 [[容错能力]]。 ^[flash-memory-summit-2023.md]

## 技术机制

### Panic 检测与识别

Panic 状态可通过以下方式进行识别：^[flash-memory-summit-2023.md]

- **CSTS.CFS 位**：Controller Status 寄存器中的 Controller Fatal Status 位
- **AEN（Asynchronous Event Notification）**：异步事件通知机制

### 恢复机制

当检测到 panic 条件后，存储设备会执行一项或多项非侵入式的纠正措施：^[flash-memory-summit-2023.md]

1. 通过 **0xC1 错误恢复日志页面**（Error Recovery Log Page）记录和传递错误信息
2. 通过 **异步事件请求**（Asynchronous Event Request，AER）通知主机系统
3. 尝试将设备恢复到正常操作状态

### 优雅下线

对于无法自动恢复的 panic 驱动，系统会将其优雅地移至离线状态，以便进行进一步检查和修复，同时**不会对工作负载造成影响**。 ^[flash-memory-summit-2023.md]

## 与其他能力的关联

FSR 是 [[垂直集成高弹性固态硬盘]]（Vertically Integrated High Resilience SSD，VIHR SSD）四大核心能力之一，与其协同工作的能力包括： ^[flash-memory-summit-2023.md]

| 能力 | 用途 |
|------|------|
| [[遥测]] 采集（Telemetry Collection） | 监控设备健康状态，预测潜在故障 |
| 固件更新（FW Update） | 修复已知问题，提升稳定性 |
| 故障预测（Failure Prediction） | 提前识别风险设备 |

## 性能影响

采用 [[vihr-ssd|VIHR SSD]] 的四大核心能力后，系统层面的 SSD [[年化故障率]]（Annualized Failure Rate，AFR）从 0.35% 降低至 **0.09%**，同时 [[平均故障间隔时间]]（Mean Time Between Failures，MTBF）从 250 万小时提升至 **1000 万小时**。 ^[flash-memory-summit-2023.md]

## 参见

- [[固态硬盘]]
- [[NVMe]]
- [[容错]]
- [[遥测]]
- [[年化故障率]]
- [[平均故障间隔时间]]

## 来源

^[flash-memory-summit-2023.md]
