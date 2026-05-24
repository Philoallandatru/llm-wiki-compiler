---
title: PowerPoint Presentation
source: test_files/20190719_NVME-301-1_Das Sharma_FINAL.pdf
ingestedAt: "2026-05-24T07:32:42.179Z"
sourceType: pdf
---

Dr. Debendra Das Sharma
PCI-SIG® Board Member
Intel Fellow and Director of I/O Technology and Standards
Intel Corporation
Flash Memory Summit 2019
Santa Clara, CA 1
The New Generation of Storage:
From PCI Express® 4.0 to PCI Express 6.0

-- 1 of 23 --

Agenda
Flash Memory Summit 2019
Santa Clara, CA 2
▪ Introduction: Evolution of PCI Express®
Technology
▪ PCI Express and Storage
▪ Form Factors
▪ Compliance
▪ Conclusions

-- 2 of 23 --

PCI-SIG® Snapshot
Flash Memory Summit 2019
Santa Clara, CA 3
0
Board of Directors
2019 – 2020
Organization that defines the PCI Express® (PCIe®) I/O bus
specifications and related form factors.
800+ member companies located worldwide.
Creating specifications and mechanisms to support compliance and
interoperability.
PCI-SIG member companies support the following usages with
PCIe:
▪ Virtual reality
▪ Automotive
▪ Artificial intelligence
▪ Telecommunications
▪ Storage
▪ Consumer
▪ Mobile
▪ Data Center

-- 3 of 23 --

PCI Express® 4.0 Specification & Status
Flash Memory Summit 2019
Santa Clara, CA 4
Adoption is Well Under Way
▪ Key Features:
• Data Rate 16 GT/s
• Maintains full backwards compatibility with
PCIe 3.x, 2.x, and 1.x
• Implements:
- Extended tags and credits
- Reduced system latency
- Lane margining
• Superior RAS capabilities
• Scalability for added lanes and
bandwidth
• Improved I/O virtualization and platform
integration
• Maximum channel loss is 28dB
▪ Compliance Status:
• PCI-SIG Launched Official FYI Testing
for PCIe 4.0 in December 2018
• Formal Compliance testing targeted for
Q3 2019
▪ Adoption:
• Numerous vendors with 16GT/s PHYs
and controllers in silicon
• Test equipment from multiple vendors
• Several member companies have
publicly announced & exhibited PCIe
4.0 products

-- 4 of 23 --

Flash Memory Summit 2019
Santa Clara, CA 5
Published in May 2019
▪ Key Features:
• Data Rate 32 GT/s
• Maintains full backwards
compatibility with PCIe 4.0, 3.x, 2.x,
and 1.x
• Maximum channel loss is 36dB
• Electrical changes to improve signal
integrity and mechanical
performance of connectors
• Advanced test and debug
capabilities
▪ Compliance Status:
• PCIe 5.0 compliance testing is
under development
• Adoption
• Several member companies have
publicly announced and are
showcasing PCIe 5.0 solutions and
interoperable silicon
• Adoption expected to grow in the
next few months due to demand
from high performance applications
PCI Express® 5.0 Specification & Status

-- 5 of 23 --

PCI Express 6.0® Specification Targets
Aiming for completion in 2021
Flash Memory Summit 2019
Santa Clara, CA 6

-- 6 of 23 --

Flash Memory Summit 2019
Santa Clara, CA 7
4.2

-- 7 of 23 --

One Interconnect—Infinite Applications
Flash Memory Summit 2019
Santa Clara, CA 8

-- 8 of 23 --

Agenda
Flash Memory Summit 2019
Santa Clara, CA 9
▪ Introduction: Evolution of PCI Express
Technology
▪ PCIe and Storage
▪ Form Factors
▪ Compliance
▪ Conclusions

-- 9 of 23 --

PCIe® SSDs for Storage
Flash Memory Summit 2019
Santa Clara, CA 10
▪ PCI Express is a great interface for SSDs
• Stunning performance 1 GB/s per lane/ direction (PCIe 3.0 x1) [2 (4) GB/s for PCIe 4.0 (5.0)]
• Lane scalability 4 GB/s per device (PCIe 3.0 x4) [8 (16) GB/s for PCIe 4.0 (5.0)]
• Lower latency Platform + Adapter: 10 μsec down to 3 μsec
• Lower power No external SAS IOC saves 7-10 W
• Lower cost No external SAS IOC saves $
• CPU-integrated PCIe lanes Up to 128 PCIe 3.0
▪ With Next Gen NVM, the NVM is no longer the bottleneck
Source: FMS 2013
“NVMe Express
Overview &
Ecosystem Update”

-- 10 of 23 --

Growth of PCIe® Technology in Storage
Flash Memory Summit 2019
Santa Clara, CA 11
▪ Data explosion is driving SSD adoption
• SSD market CAGR of 14.8% during 2016-2021 Source: IDC
• PCIe SSD market to surpass a CAGR of 33% during 2016-2020 Source:
Technavio
▪ PCIe technology is outpacing other interconnect technologies in both units and
bandwidth/capacity
Source: SSD Insights Q1/18, Forward Insights
0%
20%
40%
60%
80%
100%
2016 2017 2018 2019 2020 2021 2022
Petabytes
PCIe Other
0%
20%
40%
60%
80%
100%
2016 2017 2018 2019 2020 2021 2022
Units
PCIe Other

-- 11 of 23 --

PCIe® Features useful for Storage
• Low-latency, High Bandwidth, Scalability, and
predicable cadence of speed increase with
backwards compatibility
• In addition, PCIe technology offers the
following value-add essential for storage
• Reliability, Availability and Serviceability (RAS)
• I/O Virtualization
• Multitude of form factors including cabling support
Flash Memory Summit 2019
Santa Clara, CA 12

-- 12 of 23 --

RAS Features
Flash Memory Summit 2019
Santa Clara, CA 13
▪ PCIe® architecture supports a very high-level set of
Reliability, Availability, Serviceability (RAS) features
• All transactions protected by CRC-32 and Link level
Retry, covering even dropped packets
• Transaction level time-out support (hierarchical)
• Well defined algorithm for different error scenarios
• Advanced Error Reporting mechanism
• Support for degraded link width / lower speed
• Support for hot-plug

-- 13 of 23 --

DPC/ eDPC Motivation and Mechanism
Flash Memory Summit 2019
Santa Clara, CA 14
▪ (enhanced) Downstream Port Containment (DPC and eDPC) for emerging usages
▪ Emerging PCIe usage models are creating a need for improved error
containment/recovery and support for asynchronous removal (a.k.a. hot-swap)
▪ Defines an error containment mechanism, automatically disabling a Link when an
uncorrectable error is detected, preventing potential spread of corrupted data
▪ Reporting mechanism with Software capability to bring up the link after clean up
▪ Transaction details on a timeout recorded (side-effect of asynchronous removal)
▪ eDPC: Root-port specific programmable response to gracefully handle DPC downstream

-- 14 of 23 --

I/O Virtualization
Flash Memory Summit 2019
Santa Clara, CA 15
▪ Reduces System Cost and power
▪ Single Root I/O Virtualization Specification
• Released September 2007
• Allows for multiple Virtual Machines (VM) in a single Root
Complex to share a PCI Express* (PCIe*) adapter
▪ An SR-IOV endpoint presents multiple Virtual Functions (VF)
to a Virtual Machine Monitor (VMM)
• VF allocated to VM => direct assignment
▪ Address Translation Services (ATS) supports:
• Performance optimization for direct assignment of a Function
to a Guest OS running on a Virtual Intermediary (Hypervisor)
▪ Page Request Interface (PRI) supports:
• Functions that can raise a Page Fault
▪ Process Address Space ID enhancement to support Direct
assignment of I/O to user space

-- 15 of 23 --

Inexpensive Cabling = Independent
Clock + Spread Spectrum (SSC) (SRIS)
Flash Memory Summit 2019
Santa Clara, CA 16
▪ Challenge: PCIe® specification did not support independent clock with SSC initially
• SATA* cable ~ $0.50
• PCIe cables include reference clock > $1 for equivalent cable
• Routing reference clock across the chassis to front of the rack for storage access is a challenge
▪ PCIe base specification has included support since PCIe 3.1
1) Requires use of larger elasticity buffer
2) Requires more frequent insertion of SKIP ordered set
3) Requires receiver changes (CDR)
4) Model CDRs
▪ SRIS enables a number of form factors for PCIe technology
• OCuLink
• Lower cost external/internal cabled PCIe technology
Example of Possible
PCIe Cable
Separate Refclk Modes of Operation: 5600ppm (SRIS) for 2.5, 5.0, 8.0, and 16.0 GT/s Data Rates and 3600 ppm for 32.0 GT/s; 600ppm (SRNS)

-- 16 of 23 --

Agenda
Flash Memory Summit 2019
Santa Clara, CA 17
▪ Introduction: Evolution of PCI Express
Technology
▪ PCIe and Storage
▪ Form Factors
▪ Compliance
▪ Conclusions

-- 17 of 23 --

PCIe® Form Factors
Flash Memory Summit 2019
Santa Clara, CA 18
30, 42, 80, and 110mm
Smallest footprint of
PCIe connector form
factors, use for boot or
for max storage density
M.2 CEM Add-in-card
Add-in-card (AIC) has maximum
system compatibility with existing
servers and most reliable compliance
program. Higher power envelope,
and options for height and length
11.5x13 &16x20mm
small and thin
platforms
BGA U.2 2.5in
Source: Intel Corporation
Majority of SSDs sold
Ease of deployment, hotplug,
serviceability
Single-Port x4 or Dual-Port x2
High B/W with
PCIe 3.0
Prevalent in
hand-held, IoT,
automotive

-- 18 of 23 --

SFF Form Factors
Flash Memory Summit 2019
Santa Clara, CA 19
(Up to 36 Modules)
(SFF TA 1006 – SSD)(SFF TA 1002) (SFF TA 1007 – SSD)
(Up to 32 Modules)

-- 19 of 23 --

Agenda
Flash Memory Summit 2019
Santa Clara, CA 20
▪ Introduction: Evolution of PCI Express
Technology
▪ PCIe and Storage
▪ Form Factors
▪ Compliance
▪ Conclusions

-- 20 of 23 --

PCIe® Compliance Process
Flash Memory Summit 2019
Santa Clara, CA 21

-- 21 of 23 --

Conclusions
Flash Memory Summit 2019
Santa Clara, CA 22
▪ Single standard covering systems from handheld to data center
▪ Predominant direct I/O interconnect from CPU with high bandwidth
▪ Low-power
▪ High-performance
▪ Predictive performance growth spanning six generations
▪ A robust and mature compliance and interoperability program

-- 22 of 23 --

Flash Memory Summit 2019
Santa Clara, CA 23
Follow PCI-SIG on Social Media
@PCI_SIG https://www.linkedin.com/company/pcisig/ PCI-SIG

-- 23 of 23 --
