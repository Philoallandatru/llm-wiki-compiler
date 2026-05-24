---
title: NVMe Telemetry Log Page
summary: NVMe standardized telemetry mechanism including Data Areas 1, 2, 3 for device health monitoring, failure prediction, and root cause analysis
sources:
  - flash-memory-summit-2023.md
kind: concept
createdAt: "2026-05-24T04:28:37.104Z"
updatedAt: "2026-05-24T04:28:37.104Z"
tags:
  - storage-protocol
  - telemetry
  - monitoring
aliases:
  - nvme-telemetry-log-page
  - NTLP
confidence: 0.85
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "NVMe Telemetry Log Page" based on the provided source material. Let me analyze the sources:

1. **flash-memory-summit-2023.md** - This mentions NVMe Telemetry Log Page in the context of Microsoft's VIHR (Vertically Integrated High Resilience) SSDs. It talks about:
   - Standardized host and controller-initiated telemetry log page including vendor specific debug data section
   - NVMe Logs including Telemetry Log Page Data Area 1 are collected regularly from online drives
   - Vendor specific debug data including Data Area 2 & 3 of Telemetry Log Page is collected at the time of failures
   - Telemetry attributes are specified to root cause all intermittent failures

This is a Flash Memory Summit presentation, so it's from 2023.

I need to write this as a wiki page in zh-CN (Simplified Chinese), with:
- Clear structure with headings
- Neutral, informative tone
- Concise but thorough coverage
- [[wikilinks]] to related concepts
- Sources section at the end
- Citations in the format specified

Let me structure this page:

1. Overview/Introduction
2. Data Areas (Telemetry Log Page structure)
3. Usage and Collection
4. Related Concepts
5. Sources

I should note that I don't have a specific dedicated source about "NVMe Telemetry Log Page" itself - the information comes from the Flash Memory Summit presentation which discusses it in the context of VIHR SSDs. I'll attribute accordingly.

Let me write this in Simplified Chinese.
</think>

# NVMe 遥测日志页

## 概述

NVMe Telemetry Log Page（NVMe 遥测日志页）是 NVMe 规范中定义的一种标准化的日志结构，用于收集存储设备（SSD）运行时的遥测数据和诊断信息。该日志页支持主机发起和控制器发起两种方式获取数据，是现代数据中心和云存储基础设施中进行设备健康监测、故障预测和根因分析的重要工具。 ^[flash-memory-summit-2023.md]

## 数据区域结构

NVMe 遥测日志页包含多个数据区域（Data Area），用于存储不同类型和用途的遥测信息：

### 数据区域 1（Data Area 1）

数据区域 1 用于存储常规的健康监测数据，包含设备在正常运行期间收集的标准化遥测属性。这些数据被定期从在线运行的存储设备中采集，用于监控设备状态和预测潜在故障。 ^[flash-memory-summit-2023.md]

### 数据区域 2 和 3（Data Area 2 & 3）

数据区域 2 和 3 属于厂商特定调试数据区域。当存储设备发生故障时，这些区域会捕获详细的调试信息，用于后续的根因分析（Root Cause Analysis）。 ^[flash-memory-summit-2023.md]

## 遥测属性与故障诊断

NVMe 遥测日志页中定义的遥测属性专门用于识别和定位各类故障场景，包括但不限于：

- **间歇性故障**：如数据误比较（data miscompare）、IO 超时（IO timeout）
- **I/O 错误**：读写操作过程中出现的各类错误
- **延迟异常**：I/O 延迟突增等性能问题
- **持久性故障**：导致设备无法正常工作的持续性故障

通过分析这些遥测属性，运维人员可以快速定位问题根源并采取相应的修复措施。 ^[flash-memory-summit-2023.md]

## 应用场景

### 云存储基础设施

在大型云存储基础设施中，遥测日志页的采集是实现高可靠性存储系统的关键环节。通过对数据区域 1 的定期采集，运营团队可以实时掌握设备健康状态。 ^[flash-memory-summit-2023.md]

### 故障根因分析

当设备发生故障时，获取数据区域 2 和 3 中的厂商特定调试数据，能够帮助工程师深入分析故障原因，优化固件设计并改进产品质量。 ^[flash-memory-summit-2023.md]

## 相关概念

- [[NVMe]] — 遥测日志页所属的存储接口协议
- [[SSD]] — 使用 NVMe 遥测日志页的主要存储设备类型
- [[OCP]] — 开放计算项目，其中 OCP v2.5 及更高版本对高可靠性 SSD 有相关规范
- [[根因分析]] — 遥测日志页数据的重要应用方向
- [[故障预测]] — 遥测数据的核心用途之一
- [[MTBF]] — 平均无故障工作时间，常用于衡量存储设备可靠性

## 参考文献

- Flash Memory Summit 2023, "Vertically Integrated High Resilience SSDs Designed for Cloud Computing", Ayberk Ozturk, Microsoft ^[flash-memory-summit-2023.md]
