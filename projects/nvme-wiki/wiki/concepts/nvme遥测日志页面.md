---
title: NVMe遥测日志页面
summary: NVMe标准化的主机和控制器初始化遥测日志页面，包含设备健康监控、故障预测和根因分析所需的数据区域
sources:
  - flash-memory-summit-2023.md
kind: concept
createdAt: "2026-05-24T07:35:11.680Z"
updatedAt: "2026-05-24T07:35:11.680Z"
tags:
  - nvme
  - telemetry
  - monitoring
aliases:
  - nvme遥测日志页面
confidence: 1
provenanceState: extracted
---

<think>The user wants me to write a wiki page in Chinese (zh-CN) about "NVMe遥测日志页面" (NVMe Telemetry Log Page). I need to extract information from the provided source material and create a well-structured markdown page.

Let me analyze the source material:

From flash-memory-summit-2023.md:
- Information about Telemetry Collection capability
- NVMe Logs including Telemetry Log Page Data Area 1 are collected regularly from online drives to monitor device health and predict failures
- Vendor specific debug data including Data Area 2 & 3 of Telemetry Log Page is collected at the time of failures for root cause analysis
- Telemetry attributes are specified to root cause all intermittent failures including data miscompare, IO timeout and IO errors or latency spikes along with persistent failures

I notice the source material mentions NVMe Telemetry Log Page in the context of VIHR (Vertically Integrated High Resilience) SSDs, but the source is limited. I should write a comprehensive page based on what's provided, and note that this is primarily about the telemetry collection capability in the context of enterprise/cloud storage systems.

Let me structure the page:
1. Brief introduction
2. Structure (Data Areas)
3. Applications/Use cases
4. Related concepts (wikilinks)

Since this is about a technical NVMe feature, I should be careful to only draw from the provided sources. The main information comes from the Flash Memory Summit 2023 presentation about Microsoft's VIHR SSDs.

Let me write the page now.
</think>

# NVMe 遥测日志页面

NVMe 遥测日志页面（Telemetry Log Page）是 NVMe 规范中定义的一种标准化日志结构，用于在存储设备和主机系统之间收集和传输设备遥测数据。该日志页面支持主机端和控制器端发起的数据收集请求，并可包含厂商特定的调试数据区域。

## 数据区域结构

NVMe 遥测日志页面被划分为多个数据区域（Data Area），以便分类存储不同类型的遥测信息：

- **Data Area 1**：标准化的主机和控制器初始化遥测数据区域。此区域包含设备运行状态的核心指标，供在线运行时定期收集，用于监控设备健康状况和预测潜在故障。

- **Data Area 2 和 Data Area 3**：厂商特定的调试数据区域。这些区域由存储设备厂商自定义，用于存储专有的诊断和调试信息，通常在设备发生故障时触发收集，以便进行根本原因分析（Root Cause Analysis）。

## 主要应用

### 健康监控与故障预测

系统会定期从在线运行的 NVMe 设备中收集 Data Area 1 的遥测数据。通过分析这些数据，可以监测设备的健康状态并识别可能即将发生的故障。遥测属性设计用于定位各类间歇性故障，包括数据比对错误、IO 超时、IO 错误或延迟突增等问题，同时也能追踪持续性故障。

### 根本原因分析

当存储设备发生故障时，系统会收集设备中的 Data Area 2 和 Data Area 3 数据，用于深入分析故障的根本原因。这些厂商特定的调试数据为设备厂商和系统运维团队提供了丰富的诊断信息，有助于快速定位问题根源并进行修复。

## 规范背景

NVMe 遥测日志页面是 NVMe 规范中的标准功能，其设计旨在为数据中心和企业级存储系统提供统一的设备遥测接口。该功能与 OCP（开放计算项目）v2.5 及更高版本中定义的垂直集成高弹性（VIHR）存储设备规范相兼容，已在云基础设施的大规模存储设备管理中得到应用。

在云基础设施中，由于存在数以千万计的固态硬盘（SSD），即使按照标准化 MTBF（平均故障间隔时间）250 万小时或年故障率（AFR）0.35% 计算，每天也会有数百台设备发生故障。通过持续的遥测数据收集和智能分析，系统能够显著提升故障预测的准确性，降低整体系统年故障率。

## 相关概念

[[NVMe]] | [[固态硬盘]] | [[故障预测]] | [[根因分析]] | [[OCP 存储规范]]

## 来源

^[flash-memory-summit-2023.md]
