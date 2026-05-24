---
title: VIHR SSD
summary: Vertically Integrated High Resilience SSD - Microsoft initiative enhancing cloud storage reliability through standardized OCP v2.5+ specifications
sources:
  - flash-memory-summit-2023.md
kind: concept
createdAt: "2026-05-24T04:29:00.845Z"
updatedAt: "2026-05-24T04:29:00.845Z"
tags:
  - storage
  - cloud-infrastructure
  - reliability
aliases:
  - vihr-ssd
confidence: 0.95
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "VIHR SSD" based on the provided source material from Flash Memory Summit 2023. Let me analyze the source content and extract the key facts:

1. VIHR stands for "Vertically Integrated High Resilience"
2. It's designed for cloud computing
3. VIHR SSDs are specified in OCP v2.5 and above
4. VIHR reduces overall system [[annualized-failure-rate|Annualized Failure Rate]] (SAFR)

Key capabilities mentioned:
1. [[fault-system-resiliency|Fault System Resiliency]] (FSR) - detects and recovers from panic (firmware assert, crash, or hard hang) on storage devices. Uses 0xC1 Error Recovery Log Page and Asynchronous Event Request (AER). Panic identified through CSTS.CFS bit or AEN.
2. Telemetry Collection - standardized host and controller-initiated telemetry log page including vendor specific debug data. NVMe Logs including Telemetry Log Page Data Area 1 collected regularly. Vendor specific debug data including Data Area 2 & 3 collected at failure time for root cause analysis.
3. FW Update (mentioned in results slide)
4. [[failure-prediction|Failure Prediction]] (mentioned in results slide)

Results:
- System-level [[annualized-failure-rate|Annualized Failure Rate]] reduced to 0.09%
- [[mtbf|MTBF]] elevated to 10 million hours
- Standard SSD [[mtbf|MTBF]] is 2.5M hours (AFR of 0.35%)
- The benefits increase as fleet grows

Conclusion:
- VIHR SSDs present a cost-effective strategy for building fault-tolerant systems
- North Star goal of 100% system resiliency
- Future improvements: increasing FSR coverage, enhanced telemetry with new critical drive attributes

Now I need to write this in zh-CN (Simplified Chinese) with proper citations and wikilinks where appropriate. Let me structure this:

1. Introduction
2. Background/Problem
3. Key Capabilities
   - [[fault-system-resiliency|Fault System Resiliency]] (FSR)
   - Telemetry Collection
   - Firmware Update
   - [[failure-prediction|Failure Prediction]]
4. Results/Outcomes
5. Conclusion
6. Sources

I'll include citations in the format requested.
</think>

# VIHR SSD

VIHR SSD（Vertically Integrated High Resilience SSD，垂直集成高弹性固态硬盘）是微软为云基础设施设计的高可靠性存储设备规范，符合 [[OCP]]（开放计算项目）v2.5 及以上版本标准。^[flash-memory-summit-2023.md]

## 背景与挑战

当前云基础设施中部署着数千万块 [[SSD]]（固态硬盘）。行业标准的 SSD 平均故障间隔时间（MTBF）为 250 万小时，年化故障率（AFR）约为 0.35%。按此比例计算，每天约有数百块存储设备发生故障，每年则有上万块。^[flash-memory-summit-2023.md]

为应对这一挑战，微软通过 VIHR SSD 积极提升存储设备质量、降低容量损失影响，并改善客户体验。VIHR 的核心目标是显著降低系统年化故障率（SAFR）。^[flash-memory-summit-2023.md]

## 核心能力

VIHR SSD 实现了四项关键能力，有效降低 SSD 故障对系统层面的影响。^[flash-memory-summit-2023.md]

### 故障系统弹性（FSR）

故障系统弹性（Fault System Resiliency）用于检测和恢复存储设备上的 [[Panic]] 状态（固件断言、崩溃或硬挂起）。^[flash-memory-summit-2023.md]

FSR 的工作机制包括：通过 0xC1 错误恢复日志页和异步事件请求（AER）建立 Panic 响应；通过 CSTS.CFS 位或 AEN 识别 Panic 条件；存储设备执行一项或多项非侵入性纠正操作，使系统恢复正常运行状态。配备 FSR 的故障设备会被优雅地离线处理，不影响工作负载，便于后续检查和修复。^[flash-memory-summit-2023.md]

### 遥测数据采集

VIHR SSD 支持标准化主机和控制器发起的遥测日志页，涵盖供应商特定调试数据区域。^[flash-memory-summit-2023.md]

定期从在线设备采集 NVMe 遥测日志页（Data Area 1），以监控设备健康状况并预测故障。发生故障时，采集供应商特定调试数据（Data Area 2 和 3）用于根因分析。遥测属性可定位所有间歇性故障，包括数据误比较、IO 超时、IO 错误或延迟突增，以及持久性故障。^[flash-memory-summit-2023.md]

### 固件更新

VIHR SSD 支持可靠的 [[固件更新]]机制，确保存储设备能够及时获得安全补丁和性能优化。^[flash-memory-summit-2023.md]

### 故障预测

通过持续收集和分析遥测数据，VIHR SSD 能够提前识别潜在故障，实现 [[预测性维护]]，减少意外停机时间。^[flash-memory-summit-2023.md]

## 实施效果

微软部署的 VIHR SSD 取得了显著成效：^[flash-memory-summit-2023.md]

| 指标 | 标准 SSD | VIHR SSD |
|------|----------|----------|
| 年化故障率 (AFR) | 0.35% | 0.09% |
| 平均故障间隔时间 ([[mtbf|MTBF]]) | 250 万小时 | 1000 万小时 |

随着 fleet 规模的增长，系统故障节省的效益持续增加。^[flash-memory-summit-2023.md]

## 未来方向

VIHR 的"北极星"目标是实现 100% 系统弹性。未来改进方向包括：^[flash-memory-summit-2023.md]

- **扩大故障系统弹性覆盖范围**：检测并优雅处理更多致命故障
- **增强遥测能力**：引入新的关键驱动属性，提高故障根因定位能力，进一步改善故障预测

## 结论

VIHR SSD 为构建[[容错]]系统提供了一种经济高效的策略。^[flash-memory-summit-2023.md]

## 相关概念

- [[NVMe]] — VIHR SSD 使用的存储接口协议
- [[SSD]] — VIHR 优化的存储介质类型
- [[OCP]] — VIHR 规范遵循的开放计算项目标准
- [[Panic]] — FSR 功能处理的核心故障类型
- [[固件更新]] — VIHR 的关键维护能力

## Sources

- [Flash Memory Summit 2023: Vertically Integrated High Resilience SSDs Designed for Cloud Computing](flash-memory-summit-2023.md)
