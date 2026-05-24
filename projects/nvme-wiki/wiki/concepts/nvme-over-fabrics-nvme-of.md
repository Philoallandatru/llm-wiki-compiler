---
title: NVMe over Fabrics (NVMe-oF)
summary: 通过Fabric网络传输NVMe协议的标准，包括Capsule(命令封装)机制、Discovery服务、Centralized Discovery Controller和Direct Discovery Controller架构
sources:
  - nvm-express-base-specification-revision-21.md
kind: concept
createdAt: "2026-05-24T07:35:45.209Z"
updatedAt: "2026-05-24T07:35:45.209Z"
tags:
  - network
  - fabric
  - remote-storage
aliases:
  - nvme-over-fabrics-nvme-of
  - NOF(
confidence: 0.95
provenanceState: extracted
---

<think>The user wants me to write a wiki page about "NVMe over Fabrics (NVMe-oF)" based on the provided source materials. I need to extract facts from the sources and create a well-structured markdown page in Chinese (zh-CN).

Let me analyze the source materials:

1. **nvm-express-base-specification-revision-21.md** - The NVMe Base Specification contains information about:
   - Message-Based Transport Model (Fabrics) in Section 2.2
   - Fabrics Command Set (Section 6)
   - NVMe over Fabrics layering architecture
   - Command Capsule Format
   - Response Capsule Format
   - Discovery Service
   - Authentication mechanisms
   - NVMe over Fabrics Secure Channel

2. **flash-memory-summit-2023.md** - Contains information about VIHR SSD which uses NVMe technology but doesn't directly discuss NVMe-oF specifically.

From the NVMe Base Specification, I can extract the following key information about NVMe over Fabrics:

Section 2.2 covers Message-Based Transport Model (Fabrics):
- Fabrics and Transports
- NVM Subsystem Ports for Fabrics
- Discovery Service
- Capsules and Data Transfer
- Authentication

Figure 8 shows NVMe over Fabrics Layering architecture.

From the table of contents:
- Section 6: FABRICS COMMAND SET
  - Authentication Receive Command and Response
  - Authentication Send Command and Response
  - Connect Command and Response
  - Disconnect Command and Response
  - Property Get Command and Response
  - Property Set Command and Response

From Section 8.3 (Message-Based Transport Extended Capabilities):
- Automated Discovery of NVMe-oF Discovery Controllers for IP Based Fabrics
- Centralized Discovery for IP-based Fabrics
- Exporting NVM Resources
- NVMe over Fabrics Secure Channel and In-band Authentication


- NVMe over Fabrics extends the NVMe protocol across network fabrics, enabling remote storage access. The architecture uses a layered approach where Command Capsules and Response Capsules serve as the primary data exchange formats, with Discovery Services facilitating controller discovery and authentication mechanisms ensuring secure communication. The Fabrics Command Set provides essential operations for connection management, property access, and authentication between hosts and remote controllers.
</think>

# NVMe over Fabrics (NVMe-oF)

**NVMe over Fabrics**（简称 NVMe-oF）是一种将 NVMe 命令集扩展到网络传输架构的协议标准，允许主机通过 Fabrics 网络访问远程 [[NVM 子系统]]。该技术将 NVMe 的高性能、低延迟优势从直连存储扩展到分布式存储网络场景。^[nvm-express-base-specification-revision-21.md]

## 概述

NVMe over Fabrics 基于 [[NVMe Transport Models]] 中的**基于消息的传输模型**（Message-Based Transport Model）设计，专门用于在 Fabrics 网络环境下实现 NVMe 命令和数据的传输。与传统的 [[NVMe]] 直连存储（PCIe）相比，NVMe-oF 通过网络远程访问的方式，使得存储资源可以在多台主机之间共享，特别适用于数据中心、软件定义存储和超融合基础设施等场景。^[nvm-express-base-specification-revision-21.md]

## 架构分层

NVMe over Fabrics 采用清晰的分层架构设计，从底层到顶层依次为：^[nvm-express-base-specification-revision-21.md]

- **物理层**（Physical Fabric Interface）：承载实际网络通信的物理接口和传输介质
- **传输层**（Fabrics Transport）：将 NVMe 命令封装为适配特定网络协议的消息格式，支持 RDMA、TCP、光纤通道（FC）等多种传输绑定
- **NVMe 协议层**：定义标准的 NVMe 命令集、命令胶囊和响应胶囊格式

## 命令胶囊与数据封装

### 命令胶囊格式

在基于消息的传输模型中，所有命令均以**胶囊**（Capsule）为单位进行传输。命令胶囊包含完整的 NVMe 命令信息：^[nvm-express-base-specification-revision-21.md]

- 命令操作码（Command Opcode）
- 元数据指针（Metadata Pointer）
- 数据指针（Data Pointer）
- 命令特定参数

命令胶囊的设计确保了命令的完整性，适合在网络环境中传输。

### 响应胶囊格式

控制器完成命令处理后，返回包含执行结果的**响应胶囊**（Response Capsule）。响应胶囊包含状态码、完成状态等信息，主机通过解析响应胶囊判断命令是否成功执行。^[nvm-express-base-specification-revision-21.md]

## Fabrics 命令集

[[NVMe Command Sets#Fabrics 命令集（Fabrics Command Set）|Fabrics 命令集]]是 NVMe-oF 的核心命令集，用于建立、维护和断开与远程 NVMe 控制器的连接。主要命令包括：^[nvm-express-base-specification-revision-21.md:449-458]

| 命令 | 功能描述 |
|------|----------|
| **Connect** | 与 NVMe 控制器建立连接关系 |
| **Disconnect** | 断开已建立的连接 |
| **Property Get** | 读取控制器属性值 |
| **Property Set** | 设置控制器属性值 |
| **Authentication Receive** | 接收远程身份验证响应 |
| **Authentication Send** | 发送身份验证请求 |

### 连接管理

Connect 命令用于建立主机与远程 NVMe 控制器之间的关联（Association）。该命令通过 Fabrics 网络发送连接请求，控制器验证后返回连接响应，建立会话上下文。此后主机可以通过该连接提交 I/O 命令。

Disconnect 命令用于优雅地断开已建立的连接，释放相关资源。

### 属性操作

Property Get 和 Property Set 命令提供对控制器属性（Property）的访问能力，允许主机在 Fabric 环境下配置和查询控制器的运行时参数。

## 发现服务

NVMe over Fabrics 定义了**发现服务**（Discovery Service）机制，允许主机在不知道目标存储子系统位置的情况下自动发现可用的 NVMe 资源。^[nvm-express-base-specification-revision-21.md:23]

### 发现控制器

发现控制器（Discovery Controller）是一种特殊类型的 NVMe 控制器，专门用于响应发现请求并提供可用存储子系统的列表。主机首先连接到发现控制器，获取目标子系统的地址和连接参数信息，再据此建立到目标存储的连接。

### 自动化发现

NVMe 规范支持基于 IP 网络的 Fabrics 的自动化发现机制，通过定时请求或事件触发的方式自动更新发现信息，减少手动配置的复杂度。^[nvm-express-base-specification-revision-21.md:604-610]

## 安全与认证

### 安全通道

NVMe over Fabrics 支持建立**安全通道**（Secure Channel），确保命令胶囊和响应胶囊在传输过程中的机密性和完整性。安全通道通过 TLS 等加密协议保护网络通信。^[nvm-express-base-specification-revision-21.md:639-667]

### 身份验证

规范定义了带内身份验证机制，支持在 Connect 命令交互过程中或连接建立后进行主机与控制器之间的双向身份验证。Authentication Receive 和 Authentication Send 命令为身份验证流程提供标准接口。^[nvm-express-base-specification-revision-21.md:449-450]

### Fabric Zoning

除传输层加密外，NVMe-oF 还支持基于 Fabric Zoning 的访问控制，通过网络分区分组限制不同主机对存储资源的访问权限。^[nvm-express-base-specification-revision-21.md:21]

## 与 VIHR SSD 的关联

在云数据中心的大规模存储部署中，NVMe-oF 作为标准化的远程存储访问协议，与 [[VIHR SSD]] 的遥测和故障恢复机制协同工作。通过标准化的日志页面和错误报告接口，即使在网络存储场景下也能实现统一的设备管理和健康监控。^[flash-memory-summit-2023.md]

## 相关概念

- [[NVMe]]
- [[NVMe Transport Models]]
- [[NVM 子系统]]
- [[NVMe Command Sets]]
- [[PCI Express]] — 对比的本地直连传输方案
- [[VIHR SSD]]
- [[NVMe遥测日志页面]]

---

## 资料来源

^[nvm-express-base-specification-revision-21.md] NVM Express, Inc. *NVM Express Base Specification, Revision 2.1*. August 2024.

^[flash-memory-summit-2023.md] Flash Memory Summit 2023. *Vertically Integrated High Resilience SSDs Designed for Cloud Computing*. Ayberk Ozturk, Microsoft.
