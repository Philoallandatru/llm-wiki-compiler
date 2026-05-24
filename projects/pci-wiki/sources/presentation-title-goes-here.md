---
title: Presentation Title  Goes Here
source: test_files/PCI-Express-5-Update-Keys-to-Addressing-an-Evolving-Specification.pdf
ingestedAt: "2026-05-24T07:33:05.716Z"
sourceType: pdf
---

PCI Express 5.0 Update:
Keys to Addressing an
Evolving Specification
6/9/2020

-- 1 of 33 --

1 	2 	3 	4
PCI Express 5.0
Specification
Status
PCI Express 5.0
CEM Tx
PCI Express 5.0
32GT/s Rx
Calibration and
Test
PCI Express 5.0
Refclk Jitter
Measurements
Agenda

-- 2 of 33 --

PCI Express 5.0 Specification Status
3

-- 3 of 33 --

PCIe 5.0 Specification Snap Shot (4/8/2020)
4
• 	PCIe 5.0 Base Specification – Rev 1.0 Released (Q2 2019)
• 	Describes chip-level behavior on all levels of the stack
• 	PCIe 5.0 CEM Specification – Rev 0.7 under development
• 	Card electro-mechanical (CEM) defines system and Add-in Card level
• 	PCIe 5.0 PHY Test Specification – Rev 0.3 workgroup approved
• 	Describes electrical compliance tests for Tx, Rx LEQ, & PLL Bandwidth
• 	PCIe 4.0 – All Specifications at Rev 1.0
• 	Integrators List testing began August 2019

-- 4 of 33 --

PCIe 4.0 to 5.0 Base Specification Changes
5
PCIe 4.0 	PCIe 5.0
Data Rate 	16 GT/s 	32 GT/s
Channel Loss (Rx Test Range) 	- (27 to 30) dB @ 8GHz 	- (34 to 37) dB @ 16GHz
Add-in Card Loss 	8dB @ 8Ghz 	9.5dB @ 16GHz
Reference CTLE 	2 Poles; 1 Zero; DC Gain
Range (-6 to -12) dB
4 Poles; 2 Zero; DC Gain Range
(-5 to -12) dB
Reference DFE 	2-Taps 	3-Taps
Eye Width (Rx Test) 	18.75 ps 	9.375 ps
Eye Height (Rx Test) 	15 mV 	15 mV
Rx Jitter Tolerance 	Separate curves for CC & SRIS
at 16GT/s
One curve for CC & SRIS at
16GT/s & 32GT/s
Lane Margining 	Required for timing only 	Required for timing and voltage
Refclk High Freq Jitter Limits 	<= 500 fs 	<= 150 fs

-- 5 of 33 --

PCIe 5.0 Channel Solution Space
6

-- 6 of 33 --

Link Equalization Bypass
7
• 	PCIe 5.0 optional Link EQ Training Bypass
• 	Train directly from 2.5 GT/s to 32 GT/s
• 	2.5GT/s -> 32GT/s
• 	Traditional Training still Supported
• 	2.5GT/s > 8GT/s > 16GT/s > 32GT/s
• 	If lower rates don’t preform link training
they cannot be utilized
• 	~200ms time savings to L0 at 32GT/s
• 	Option to skip Link EQ entirely if all
components in the link support

-- 7 of 33 --

Burst Error Prevention
8
• 	Burst Errors are more likely at 32GT/s given the DFE tap ratios
• 	This error propagation can occur with 101010 patterns
• 	Precoding limits toggle pattern occurrences
• 	Receivers may request precoding from its transmitter at data rates >= 32 GT/s
• 	Enabled through Training Sets

-- 8 of 33 --

Updated Connector &
Edge Finger Layout
9
• 	Only SMT CEM connectors allowed
• 	CEM connector layout optimizations
• 	Gnd vias at both sides of pad
• 	Pad size reduction
• 	Edge Finger layout optimizations
• 	Edge Finger Dimension reduction
• 	Gnd plane beneath edge fingers
1.27mm
(0.05”)

-- 9 of 33 --

PCI Express 5.0 CEM Tx
10

-- 10 of 33 --

PCIe 2.0 Dual Port Model for MB Tx
8 June 2020 	11

-- 11 of 33 --

PCIe Reference Clock Jitter
8 June 2020 	12

-- 12 of 33 --

PCIe 2.0 Dual Port Algorithm Overview
• 	Capture clock and data simultaneously
• 	Apply min/max bandwidth and peaking PLL filters to reference clock – producing
several different filtered clock records
• 	Use each filtered clock record to compute phase jitter array for data using several
different phase alignments to represent the min/max shift in phase that could
occur on an add-in card
• 	The total jitter is the largest number obtained across all PLL bandwidths and
phase alignments
13

-- 13 of 33 --

Dual Port Comparison – PCIe 2.0 & PCIe 5.0
14
• 	PCIe 2.0
• 	Common Clock model CDR has little rejection at 33 KHz and up to 2 MHz.
• 	Reference Clock jitter limit large (3.1 ps RMS for 5.0 Gt/s PCIe).
• 	Significant ability to trade off data and clock jitter at platform level
• 	Significant savings from conservative assumptions of standalone clock test (min/max pll
bandwidths and worst case phase mismatch)
• 	Application of reference clock to compute data jitter straightforward (no reference equalizer)
• 	PCIe 5.0
• 	Common Clock model CDR same as SRIS CDR and has lot of rejection at 33 KHz and up to 2
MHz
• 	Reference Clock jitter limit very small (.15 ps RMS). No ability to trade off at platform level
• 	Many high speed receiver designs do not use reference clock
• 	Application of clock to compute data jitter is not straightforward. (reference receiver with CTLE
and DFE and specific time domain CDR definition)
• 	High speed oscilloscope channels are expensive

-- 14 of 33 --

PCIe Gen 5 TX CEM
8 JUNE 2020 	15
DUAL PORT TESTING REMOVAL
CEM workgroup voted in March 2020 to
remove the Dual Port Requirement for 5.0
System Tx requirement
Workgroup exploring a new 5.0 System
refclk jitter compliance test
Systems at 32 GT/s will be tested with the
same CDR & reference Rx EQ algorithms as
32 GT/s Add-in Cards
Only 2 scope channels needed!

-- 15 of 33 --

PCI Express Proposed CEM Tx Eye Mask
8 JUNE 2020 	16

-- 16 of 33 --

Tektronix Gen5 Tx Solution Status
17
• 	PCI Express 5.0 Base Tx – !!Released Q1 2020!!
• 	PCI Express 5.0 CEM Tx – Target First Release Q2 2020 (coming soon)
• 	Currently no Gen5 CEM compliance fixtures available
• 	Not expected to be broadly available from the PCI-SIG till Q3/Q4 2020

-- 17 of 33 --

Key features – Gen5 Base Tx Release
• 	TekExpress PCIe Base Spec TX Software
▫ 	PCIe Base spec Gen5 solution over DPO70000SX Series with ATI 2 stack (BW > 50GHz)
▫ 	Backward compatibility support for Gen1-4 over Non-ATI channel
▫ 	Updated UI for DUT panel
▫ 	Support for Reduced Swing and Full Swing
▫ 	Base Tx Jitter & Voltage measurement support with SigTest 4.0.51
▫ 	Preset test using Sigtest V4.0.51
▫ 	De-embedding support for single ended waveforms
▫ 	Semi Automated Deskew support using Deskew tool from Tekscope
▫ 	Documentation with updated schematics for gen 5 (.chm/pdf)
▫ 	Updated TekExpress report with ATI channel and SSC Status information
• 	DPOJET plugin w/Gen5 Base Spec measurements for debugging/characterization
• 	DPOJET setup files for ease of debugging
• 	MOI updates for DPOJET measurements
• 	Refclk measurement as DPOJET Plugin for Common Clock
8 JUNE 2020 	18
BASE SPEC

-- 18 of 33 --

PCI Express 5.0
32GT/s Rx PG Calibration & Test
19

-- 19 of 33 --

Click to edit Master title style
Copyright © 2019 PCI-SIG ® - All Rights Reserved	PCI-SIG Developers Conference 2019
32GT/s Rx Calibration
20
15mV / 0.3UI @ E-12 BER

-- 20 of 33 --

Click to edit Master title style
Copyright © 2019 PCI-SIG ® - All Rights Reserved	PCI-SIG Developers Conference 2019
Rx Calibration Evolution
21
8GT/s Rx Calibration
• Fixed Channel Loss (package embedded with SigTest)
• Knobs – Rj/DMI (often results in unrealistic Rj values – no bounds)
• Only CEM fixtures for sale through PCI-SIG
• Seasim (Base) & SigTest (CEM)
16GT/s Rx Calibration
• Variable ISI (27 to 30dB) – improved test equipment correlation
• Knobs – Amplitude/Sj/DMI (with allowable ranges defined)
• Limit BASE fixtures for sale through PCI-SIG & implementation note in BASE Spec
• Seasim/SigTest (Base) & SigTest (CEM)
32GT/s Rx Calibration
• Variable ISI (34 to 37dB)
• Knobs – Same as 16GT/s
• Base Rev2 fixtures under development (MMPX coaxial connector)
• Seasim (Base) –& SigTest EH Extrapolation under investigation & noise impact

-- 21 of 33 --

Click to edit Master title style
Copyright © 2019 PCI-SIG ® - All Rights Reserved	PCI-SIG Developers Conference 2019
Rx Test Points
22

-- 22 of 33 --

Click to edit Master title style
Copyright © 2019 PCI-SIG ® - All Rights Reserved	PCI-SIG Developers Conference 2019
Points of Clarification
23
Channel
Selection
• Select channel between 27 & 30dB for Gen4 and 34 & 37dB for Gen5
• Preset is selected which gives the largest EA with the optimal CTLE
• CTLE varied in 1/4dB steps for 16GT/s and 1dB steps for 32GT/s
TP1
Cable
• TP1 is the output of the signal generator & TP3 is after the first coaxial cable
• At 16GT/s the cable between TP1 & TP3 is considered part of the calibration channel
• At 32GT/s the cable is considered part of the generator and not included in the loss
Tie Breakers
• 16GT/s: 1st - pick the combination of Sj/DMI/Swing which gets closest to the EW target;
2nd - choose the combination with Sj closest to the nominal value
• 32GT/s: 1st – pick the combination with the highest channel loss; 2 nd – choose the
combination closest to the target EH

-- 23 of 33 --

New Guidelines from Intel & AMD Released
24
• 	Text

-- 24 of 33 --

Click to edit Master title style
Copyright © 2019 PCI-SIG ® - All Rights Reserved	PCI-SIG Developers Conference 2019
Simulation Method Conversion Factor
25
NEW

-- 25 of 33 --

Click to edit Master title style
Copyright © 2019 PCI-SIG ® - All Rights Reserved	PCI-SIG Developers Conference 2019
Other Considerations
o 	Replica Channel & Package Embedding
• 	Physical replica channel
• 	Additional impedance discontinuities
• 	Cable de-embedding required
• 	Cascaded filter for replica channel & package model
• 	Less reflective channel
• 	No complex de-embedding needed
o 	CTLE AC/DC Gain Step Size
• 	¼ dB step sized required for correlation at 16GT/s
• 	Currently only 1 dB explored at 32GT/s
26

-- 26 of 33 --

Gen5 Base Calibration (11/5/2019)
27
• 	Channel – Gen5 Base Rx Calibration Fixtures – Rev3
• 	Pair 15 & 8” replica (~36dB) – Full physical
• 	Optimal Tx EQ – Preset 6
• 	Final Sj – 3.5ps (0.375ps above nominal)
• 	Final DMI – 12.35mV TP2 (2.35mV above nominal)
• 	Final Eye Width – 9.5ps
• 	Final Eye Height – 16.2mV
EH (mV) 	EW (ps)
P0 	4.9 	3.2
P1 	10.5 	6.1
P2 	6.5 	4.0
P3 	11.1 	6.6
P4 	8.4 	4.5
P5 	9.5 	6.4
P6 	17.5 	10.2
P7 	6.8 	5.0
P8 	9.1 	6.7
P9 	11.9 	7.7

-- 27 of 33 --

PCI Express 5.0 Refclk
Jitter Measurements
28

-- 28 of 33 --

Reference Clock Phase Jitter Test
29
Ref CLK requirements for PCIe
5.0 have become more stringent and
testing methodologies have changed

-- 29 of 33 --

Experiment Setup
30
Gen5 Refclk
Eval Board
PCIe Gen5 Base
Rx Calibration Fixtures (Rev 3)
Tektronix RT Scope
(DPS77004SX)
DMI

-- 30 of 33 --

PCI SIG CEM Presentation
31
• 	Results from Refclk experiment shared in the CEM workgroup to provide
guidance for new 5.0 System refclk jitter compliance test
• 	Base spec pathfinding simulations used 250fs refclk jitter
• 	Extra 100fs jitter added from base spec limit
• 	Crosstalk
• 	Edge flattening – vertical noise to jitter conversion
• 	All cases showed less than 250fs jitter including 30dB channel with noise
added and SSC enabled
• 	Experiment to be repeated with worse case refclk (150fs)

-- 31 of 33 --

Tektronix – PCI Express 5.0 Refclk Solution
(under development)
32
• 	Fully Automated solution – TekExpress
• 	Expected Q2/Q3 2020
• 	Targeted Support
• 	High Frequency Jitter Measurements (Gen1 to Gen5)
• 	Optional scope Noise removal algorithm
• 	Refclk DC Specifications and AC Requirements
• 	Data Rate Independent Refclk Parameters
• 	Real Time Scopes
• 	DPS77004SX
• 	DPS5002SX
• 	MSO64

-- 32 of 33 --

Questions
33

-- 33 of 33 --
