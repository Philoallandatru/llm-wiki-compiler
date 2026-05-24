---
title: Vertically Integrated High Resilience (VIHR) SSDs
summary: 微软提出的面向云计算的垂直集成高弹性固态硬盘架构，通过四项关键能力显著降低系统年化故障率至0.09%
sources:
  - flash-memory-summit-2023.md
kind: concept
createdAt: "2026-05-24T07:35:10.966Z"
updatedAt: "2026-05-24T07:35:10.966Z"
tags:
  - cloud-storage
  - ssd
  - fault-tolerance
aliases:
  - vertically-integrated-high-resilience-vihr-ssds
  - VIHR(S
confidence: 1
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "Vertically Integrated High Resilience (VIHR) SSDs" based on the provided source material. I need to:

1. Write in zh-CN (Chinese Simplified)
2. Use a neutral, informative tone
3. Be concise but thorough
4. Include [[wikilinks]] to related concepts where appropriate
5. Include a ## Sources section at the end
6. Add proper citations with the format specified
7. Make sure the content is well-structured markdown

Let me analyze the source material from the Flash Memory Summit 2023 presentation by Ayberk Ozturk from Microsoft:

Key information:
- VIHR stands for Vertically Integrated High Resilience
- Designed for cloud computing
- Specified in OCP v2.5 and above
- The cloud infrastructure has tens of millions of SSDs
- Standard SSD MTBF: 2.5M hour, AFR: 0.35%
- VIHR reduces system annualized failure rate (SAFR) significantly

Four key capabilities:
1. Telemetry Collection - standardized host and controller-initiated telemetry log page
2. FW Update - firmware update capability
3. Failure Prediction - predict failures
4. [[fault-system-resiliency-fsr|Fault System Resiliency (FSR)]] - detects and recovers from panic

Fault System Resiliency details:
- Panic is a firmware assert, crash or hard hang
- Detects and recovers from panic on storage device
- Uses 0xC1 Error Recovery Log Page and Asynchronous Event Request (AER)
- Panic condition identified through CSTS.CFS bit or AEN
- Storage device performs non-invasive corrective actions
- Systems with panic drives moved to offline gracefully

Telemetry Collection details:
- NVMe Logs including Telemetry Log Page Data Area 1
- Data Area 2 & 3 collected at time of failures
- Root cause intermittent failures, data miscompare, IO timeout, IO errors, latency spikes


- VIHR achieves 0.09% annualized failure rate with 10 million hours MTBF, representing substantial gains over standard specifications. The approach aims for near-complete system resiliency and improves root cause analysis capabilities. Key concepts like [[NVMe]] and [[Open Compute Project]] are foundational to understanding the technical framework.
</think>

# Vertically Integrated High Resilience (VIHR) SSD

**Vertically Integrated High Resilience (VIHR) SSD** 是一种面向[[云计算]]场景设计的高可靠性固态硬盘规范，旨在通过软硬件协同设计，显著降低大规模存储系统中的故障率。该规范被纳入 [[开放计算项目]] (OCP) v2.5 及以上版本中定义。 ^[flash-memory-summit-2023.md]

## 背景与动机

云基础设施中部署着数以千万计的 [[固态硬盘]] (SSD)。按照行业标准的 SSD 平均无故障时间 (MTBF) 为 250 万小时或年化故障率 (AFR) 为 0.35% 计算，每天约有数百块存储设备发生故障，全年累计可达数万块。 ^[flash-memory-summit-2023.md]

面对这一挑战，[[微软]] 通过垂直整合的方式推进 VIHR SSD 的研发与部署，以提升存储设备质量、减少容量损失，并改善用户体验。 ^[flash-memory-summit-2023.md]

## 四大核心能力

VIHR SSD 通过实现以下四项关键能力，有效缓解 SSD 故障对系统层面造成的影响： ^[flash-memory-summit-2023.md]

### 故障系统弹性 (Fault System Resiliency, FSR)

该能力用于检测并从存储设备上的 **panic** 状态（固件断言失败、系统崩溃或硬挂起）中恢复。具体机制包括： ^[flash-memory-summit-2023.md]

- 通过 **0xC1 错误恢复日志页** 和 **异步事件请求** (AER) 建立 panic 响应流程
- 通过 **CSTS.CFS 位** 或 **AEN** 识别 panic 状态
- 存储设备执行一项或多项非侵入式纠正操作，使设备恢复至可与主机系统正常通信的状态
- 发生 panic 的驱动器会被优雅地移至离线状态，不影响正在运行的[[工作负载]]，便于后续检查和修复 ^[flash-memory-summit-2023.md]

### 遥测数据采集 (Telemetry Collection)

VIHR SSD 采用标准化的主机和控制器发起的遥测日志页机制： ^[flash-memory-summit-2023.md]

- 定期从在线驱动器收集 NVMe 遥测日志页 Data Area 1，用以监控设备健康状况并预测潜在故障
- 在故障发生时采集供应商特定的调试数据（Data Area 2 和 3），用于[[根因分析]]
- 遥测属性可定位间歇性故障（如数据校验错误、IO 超时、IO 错误或延迟峰值）以及持续性故障 ^[flash-memory-summit-2023.md]

### 固件更新 (Firmware Update)

该能力允许在不中断服务的情况下对 SSD 固件进行更新，确保设备能够及时获得安全补丁和性能优化。

### 故障预测 (Failure Prediction)

通过分析遥测数据中的关键指标，VIHR SSD 能够提前识别即将发生故障的驱动器，使系统可以在数据丢失前进行预防性数据迁移。

## 成效

根据实际部署数据，配备上述四项核心能力的 VIHR SSD 取得了显著改善： ^[flash-memory-summit-2023.md]

| 指标 | 标准 SSD | VIHR SSD |
|------|----------|----------|
| 年化故障率 (AFR) | 0.35% | **0.09%** |
| 平均无故障时间 (MTBF) | 250 万小时 | **1000 万小时** |

年化故障驱动器数量的显著下降意味着，随着存储集群规模的扩大，系统故障节省的效益愈发可观。 ^[flash-memory-summit-2023.md]

## 设计目标

VIHR SSD 的「北极星」目标为实现 **100% 系统弹性**。为达成这一目标，当前改进方向包括： ^[flash-memory-summit-2023.md]

- 扩大故障系统弹性覆盖范围，检测并优雅处理更多致命故障
- 增强遥测能力，引入新的关键驱动器属性，以定位更多故障根因并进一步提升故障预测精度

## 参见

- [[固态硬盘]]
- [[NVMe]]
- [[开放计算项目]]
- [[云计算]]
- [[根因分析]]

## 来源

- [Flash Memory Summit 2023: Vertically Integrated High Resilience SSDs Designed for Cloud Computing](flash-memory-summit-2023.md) — Ayberk Ozturk, Microsoft
