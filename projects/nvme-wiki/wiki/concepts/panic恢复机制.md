---
title: Panic恢复机制
summary: 存储设备通过固件断言、崩溃或硬挂起检测panic状态，通过非侵入式纠正措施恢复正常运行
sources:
  - flash-memory-summit-2023.md
kind: concept
createdAt: "2026-05-24T07:35:10.404Z"
updatedAt: "2026-05-24T07:35:10.404Z"
tags:
  - firmware
  - error-recovery
  - ssd
aliases:
  - panic恢复机制
confidence: 1
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "Panic恢复机制" (Panic Recovery Mechanism) in zh-CN (Simplified Chinese). I need to extract facts from the provided source material and cite them properly.

Looking at the source material, it's from Flash Memory Summit 2023, specifically about Vertically Integrated High Resilience SSDs designed for Cloud Computing by Ayberk Ozturk from Microsoft.

The relevant content about "Panic" is found on page 4 of 7, under the "Fault System Resiliency" section:

- Panic is a firmware assert, crash or hard hang.
- This [[fault-system-resiliency-fsr|Fault System Resiliency (FSR)]] capability detects and recovers from a panic on a storage device.
- A panic response is established through 0xC1 Error Recovery Log Page and Asynchronous Event Request (AER).
- A panic condition is identified through CSTS.CFS bit or AEN.
- Storage device performs one or more non-invasive corrective actions to recover from a detected panic condition to facilitate a normal operational state between a host system and the storage system.
- Systems with panic drives are moved to offline gracefully without impacting workload for further inspection and repair.

This is about NVMe SSD panic recovery mechanism. Let me structure the wiki page well.

I should:
1. Give a clear overview
2. Cover the key aspects (what is panic, how it's detected, how it's recovered)
3. Include wikilinks to related concepts
4. Keep it concise but thorough
5. Cite all paragraphs properly
6. End with a Sources section
</think>

# Panic 恢复机制

**Panic 恢复机制**（Panic Recovery Mechanism）是 NVMe 存储设备中的一项 [[Fault_System_Resiliency|故障系统韧性]]（Fault System Resiliency, FSR）能力，用于检测并从存储设备上的固件断言（assert）、崩溃（crash）或硬挂起（hard hang）状态中恢复。

## 什么是 Panic

Panic 是固态硬盘（SSD）固件层面的严重故障状态，具体表现为以下三类情况：固件断言触发、系统崩溃或完全无响应的硬挂起。这类状态通常意味着设备无法正常处理 I/O 请求，需要系统介入才能恢复正常运行。

## 检测机制

Panic 状态的识别通过两种 NVMe 标准机制实现：

- **CSTS.CFS 位**：Controller Status 寄存器中的 Controller Fatal Status 位，用于指示控制器是否处于致命错误状态。
- **AEN（Asynchronous Event Notification）**：异步事件通知机制，可主动向主机系统上报设备异常状态。

这两种机制为存储设备提供了可靠的故障感知能力，使主机能够在第一时间获知设备异常。

## 恢复流程

Panic 恢复过程由以下机制协同完成：

1. **0xC1 错误恢复日志页**（Error Recovery Log Page）：定义设备在发生 Panic 后应采取的恢复行为和超时策略。
2. **异步事件请求**（Asynchronous Event Request, AER）：主机通过该机制订阅并接收设备上报的 Panic 事件。
3. **非侵入式纠正措施**：存储设备执行一项或多项非侵入性纠正操作，旨在重建主机系统与存储系统之间的正常通信状态。

完成恢复后，设备应重新进入可用状态，恢复正常的 I/O 操作能力。

## 优雅下线

对于无法立即恢复的 Panic 驱动器，系统会将其**优雅地下线**（gracefully offline），即将驱动器从生产工作负载中移除，而**不会中断正在运行的业务**。下线后的设备可交由运维人员进行进一步检查和修复。

## 与 [[VIHR_SSD|VIHR SSD]] 的关系

Panic 恢复机制是 Microsoft 垂直集成高韧性 SSD（VIHR SSD）的四大核心能力之一，隶属于 OCP v2.5 及更高版本规范中的故障系统韧性功能。通过 VIHR SSD 的部署，企业数据中心的系统年化故障率（SAFR）可从标准的 0.35% 降低至 0.09%，同时将平均无故障时间（MTBF）提升至 1000 万小时级别。

## 相关概念

- [[Fault_System_Resiliency]] — 故障系统韧性
- [[VIHR_SSD]] — 垂直集成高韧性 SSD
- [[NVMe]] — NVMe 协议标准
- [[Telemetry_Collection]] — 遥测数据采集

---

## Sources

- [@flash-memory-summit-2023.md]
