---
title: Fault System Resiliency (FSR)
summary: 通过0xC1错误恢复日志页面和异步事件请求机制检测并恢复存储设备上的panic故障，使故障驱动器优雅下线
sources:
  - flash-memory-summit-2023.md
kind: concept
createdAt: "2026-05-24T07:35:28.554Z"
updatedAt: "2026-05-24T07:35:28.554Z"
tags:
  - fault-recovery
  - ssd
  - firmware
aliases:
  - fault-system-resiliency-fsr
  - FSR(
confidence: 1
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "Fault System Resiliency (FSR)" based on the provided source material. Let me analyze the source content to extract key information about FSR.

From the source material (flash-memory-summit-2023.md), I can see:

1. FSR is part of the VIHR (Vertically Integrated High Resilience) SSDs framework
2. FSR detects and recovers from panics on storage devices
3. A panic is defined as a firmware assert, crash, or hard hang
4. FSR uses 0xC1 Error Recovery Log Page and Asynchronous Event Request (AER) for panic response
5. Panic condition is identified through CSTS.CFS bit or AEN
6. Storage device performs non-invasive corrective actions to recover
7. Systems with panic drives are moved to offline gracefully without impacting workload

Let me structure this as a clear, well-organized markdown page with wikilinks to related concepts where appropriate.
</think>



# 故障系统弹性 (Fault System Resiliency, FSR)

**故障系统弹性**（Fault System Resiliency，简称 FSR）是垂直集成高弹性固态硬盘（VIHR SSD）框架中的一项关键能力，旨在检测并从存储设备的故障状态中恢复。^[flash-memory-summit-2023.md]

## 概述

FSR 属于云存储基础设施中高弹性存储解决方案的核心组件。在大规模的云计算环境中，固态硬盘（SSD）数量庞大，即使采用行业标准的平均无故障时间（MTBF）为 250 万小时或年化故障率（AFR）为 0.35%，每天仍可能有数百个存储设备发生故障。FSR 作为 VIHR SSD 的四大关键能力之一，通过主动故障检测与恢复机制，显著降低系统级年化故障率（SAFR）。^[flash-memory-summit-2023.md]

## 故障定义

FSR 所指的**故障（Panic）**包含以下几种情况：^[flash-memory-summit-2023.md]

- 固件断言失败（Firmware assert）
- 系统崩溃（Crash）
- 硬挂起（Hard hang）

## 工作机制

### 故障检测

FSR 通过以下机制识别存储设备上的故障状态：^[flash-memory-summit-2023.md]

| 检测方式 | 说明 |
|---------|------|
| CSTS.CFS 位 | 控制器状态寄存器中的控制器致命故障状态位 |
| 异步事件通知（AEN） | 设备主动向主机发送的异步事件 |

### 故障恢复

故障响应通过以下标准化机制建立：^[flash-memory-summit-2023.md]

- **0xC1 错误恢复日志页**（Error Recovery Log Page）
- **异步事件请求**（Asynchronous Event Request, AER）

存储设备执行一项或多项非侵入性纠正操作，使设备从检测到的故障状态中恢复，以促成主机系统与存储系统之间恢复正常运行状态。

### 优雅下线

一旦系统检测到故障设备，将执行优雅下线操作：在不影响工作负载的前提下，将故障驱动器移至离线状态，以便进行后续检查和修复。^[flash-memory-summit-2023.md]

## 在 VIHR 框架中的地位

FSR 是 VIHR SSD 的四大核心能力之一，与其他三项能力共同作用：^[flash-memory-summit-2023.md]

- [[遥测数据收集]]（Telemetry Collection）
- [[固件更新]]（FW Update）
- [[故障预测]]（Failure Prediction）

这四项能力的协同运用，使系统级 SSD 年化故障率降至 0.09%，同时将平均无故障时间提升至 1000 万小时。

## 相关概念

- [[NVMe]] — FSR 机制基于 NVMe 规范实现
- [[固态硬盘]]（SSD）— FSR 的保护对象
- [[云存储]] — FSR 的主要应用场景
- [[遥测数据收集]] — VIHR 框架中与 FSR 协同的能力，用于故障根因分析
- [[故障预测]] — VIHR 框架中与 FSR 协同的能力，用于预见性维护

---

## 资料来源

^[flash-memory-summit-2023.md] Flash Memory Summit 2023. *Vertically Integrated High Resilience SSDs Designed for Cloud Computing*. Ayberk Ozturk, Microsoft.
