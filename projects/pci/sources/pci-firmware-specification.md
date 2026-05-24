---
title: PCI Firmware Specification
source: test_files/PCI_Firmware_v3.3_20210120_NCB.pdf
ingestedAt: "2026-05-24T03:48:00.774Z"
sourceType: pdf
truncated: true
originalChars: 276524
---

PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 1
PCI Firmware
Specification
Revision 3.3
January 20, 2021

-- 1 of 122 --

PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 2
Revision Revision History Date
1.0 Original issue distributed by Intel Corporation. 9/28/1992
2.0 Updated to be in synch with PCI Bus Specification, Rev. 2.0. 7/20/1993
2.1 Added functions for PCI IRQ routing; clarifications. 8/26/1994
3.0 Updated revision evolving the specification to include all aspects of
PCI and system firmware. 6/20/2005
3.1 Incorporated outstanding ECNs and made editorial changes. 12/13/2010
3.2 Incorporated the following ECNs:
• ACPI additions for FW latency optimizations
• UEFI related updates
• PCIe hot plug
01/26/2015
3.3 Incorporated the following ECNs:
• ECN_D3ColdTiming_Power_Firmware_Final
• ECN_TPH-ST_Firmware_20191029
• Enabling Multiple Base Addresses per PCI Segment Group ECN
• PCI FW 3.2 ECN - _DSM function 5
• PCI FW 3.2 ECN - HPX and Completion Timeout
• PCI FW 3.2 ECN-DPC
• PCI FW 3.2 ECN LED
• PCIFW_3.2_ECN_DSM_Revisions_20200212
• _DSM additions for PCIe SSD Status LED Management ECN
• _DSM additions for Runtime Device Power Management
• System Firmware Intermediary (SFI) _OSC and DPC Updates
01/20/2021
PCI-SIG® disclaims all warranties and liability for the use of this document and the information contained herein and assumes no
responsibility for any errors that may appear in this document, nor does PCI-SIG make a commitment to update the information
contained herein.
Contact the PCI-SIG office to obtain the latest revision of the specification.
Questions regarding this specification or membership in PCI-SIG may be forwarded to:
Membership Services
www.pcisig.com
E-mail: administration@pcisig.com
Phone: 503-619-0569
Fax: 503-644-6708
Technical Support
techsupp@pcisig.com
DISCLAIMER
This PCI Firmware Specification is provided “as is” with no warranties whatsoever, including any warranty of
merchantability, noninfringement, fitness for any particular purpose, or any warranty otherwise arising out of any
proposal, specification, or sample. PCI-SIG disclaims all liability for infringement of proprietary rights, relating to use
of information in this specification. No license, express or implied, by estoppel or otherwise, to any intellectual
property rights is granted herein.
PCI, PCI Express, PCIe, and PCI-SIG are trademarks or registered trademarks of PCI-SIG.
All other product names are trademarks, registered trademarks, or service marks of their respective owners.
Copyright © 1992-2021 PCI-SIG

-- 2 of 122 --

PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 3
Contents
1. INTRODUCTION..................................................................................................................7
1.1. Scope ........................................................................................................................................... 7
1.2. Reference Documents ................................................................................................................. 7
1.3. Terms and Acronyms ................................................................................................................... 8
2. TRADITIONAL PCI BIOS ................................................................................................10
2.1. Functional Description ............................................................................................................... 10
2.2. Assumptions and Constraints .................................................................................................... 10
2.2.1. ROM BIOS Location ............................................................................................................ 10
2.2.2. Calling Conventions ............................................................................................................ 10
2.2.3. Interrupt Support ................................................................................................................. 11
2.3. BIOS32 Service Directory .......................................................................................................... 11
2.3.1. Determining the Existence of BIOS32 Service Directory .................................................... 11
2.3.2. Calling Interface for BIOS32 Service Directory ................................................................... 12
2.4. PCI BIOS 32-bit Service ............................................................................................................ 13
2.5. Host Interface ............................................................................................................................ 14
2.5.1. Identifying PCI Resources ................................................................................................... 14
2.5.2. PCI BIOS Present ............................................................................................................... 14
2.5.3. Find PCI Device .................................................................................................................. 16
2.5.4. Find PCI Class Code ........................................................................................................... 17
2.6. PCI Support Functions ............................................................................................................... 18
2.6.1. Generate Special Cycle ...................................................................................................... 18
2.6.2. Get PCI Interrupt Routing Expansions ................................................................................ 18
2.6.3. Set PCI Hardware Interrupt ................................................................................................. 21
2.7. Accessing Configuration Space ................................................................................................. 23
2.7.1. Access Rules for PCI Express I/O and Memory Mapped Accesses ................................... 23
2.7.2. INT1Ah Access Calls in Real Mode .................................................................................... 24
2.7.3. Read Configuration Byte ..................................................................................................... 24
2.7.4. Read Configuration Word .................................................................................................... 25
2.7.5. Read Configuration DWORD .............................................................................................. 26
2.7.6. Write Configuration Byte ..................................................................................................... 27
2.7.7. Write Configuration Word .................................................................................................... 28
2.7.8. Write Configuration DWORD .............................................................................................. 29
2.8. Function List............................................................................................................................... 30
2.9. Return Code List ........................................................................................................................ 31
3. UEFI PCI SERVICES .........................................................................................................32
3.1. UEFI Driver Model ..................................................................................................................... 32
3.1.1. PCI Root Bridge Protocol .................................................................................................... 32
3.1.2. PCI Driver Model ................................................................................................................. 33
3.2. PCI-X Mode 2 and PCI Express ................................................................................................ 33
3.3. EFI Byte Code ........................................................................................................................... 33
3.4. Graphics Output Protocol .......................................................................................................... 33
3.5. Device State at Firmware/Operating System Handoff ............................................................... 34
4. PCI SERVICES IN ACPI ...................................................................................................38
4.1. Enhanced Configuration Access Method Base Address ........................................................... 38
4.1.1. Background ......................................................................................................................... 39
4.1.2. MCFG Table Description ..................................................................................................... 40
4.1.3. The _CBA Method ............................................................................................................... 43
4.1.4. System Software Implication of MCFG and _CBA .............................................................. 44

-- 3 of 122 --

PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 4
4.1.5. Plug-and-Play ID Defined for Enhanced Configuration Space Access Capable Devices .. 45
4.2. Mechanism for Controlling System Wake From PCI Express ................................................... 46
4.3. PCI Root Bridge Description ...................................................................................................... 46
4.3.1. Identification ........................................................................................................................ 46
4.3.2. Resource Description .......................................................................................................... 47
4.3.2.1. Resource Setting............................................................................................................ 47
4.3.2.2. Boot Bus Number ........................................................................................................... 47
4.3.2.3. PCI Segment Group ....................................................................................................... 47
4.4. PCI Interrupt Routing ................................................................................................................. 47
4.5. _OSC – A Mechanism for Exposing PCI Express Capabilities Supported by an Operating
System 48
4.5.1. _OSC Interface for PCI Host Bridge Devices ..................................................................... 48
4.5.2. Rules for Evaluating _OSC ................................................................................................. 59
4.5.2.1. Query Flag ..................................................................................................................... 59
4.5.2.2. Evaluation Conditions .................................................................................................... 59
4.5.2.3. Sequence of _OSC Calls ............................................................................................... 59
4.5.2.4. Dependencies Between _OSC Control Bits .................................................................. 60
4.5.3. ASL Example....................................................................................................................... 61
4.6. _DSM Definitions for PCI ........................................................................................................... 62
4.6.1. _DSM for PCI Express Slot Information .............................................................................. 63
4.6.2. _DSM for PCI Express Slot Number ................................................................................... 65
4.6.3. _DSM for Vendor-specific Token ID Strings ....................................................................... 67
4.6.4. _DSM for PCI Bus Capabilities ........................................................................................... 68
4.6.4.1. Bus Capabilities Structure .............................................................................................. 68
4.6.4.1.1. Bus Types ............................................................................................................... 68
4.6.4.1.2. Bus Capabilities Structure Definitions ................................................................... 69
4.6.4.1.3. _DSM for Bus Capabilities..................................................................................... 71
4.6.5. _DSM for Preserving PCI Boot Configurations ................................................................... 72
4.6.6. _DSM Definitions for Latency Tolerance Reporting ............................................................ 73
4.6.7. _DSM for Naming a PCI or PCI Express Device Under Operating Systems...................... 73
4.6.8. _DSM for Avoiding Power-On Reset Delay Duplication on Sx Resume ............................. 76
4.6.9. _DSM for Specifying Device Readiness Durations ............................................................. 77
4.6.10. _DSM for Requesting D3cold Aux Power Limit ..................................................................... 79
4.6.11. _DSM for Adding PERST# Assertion Delay ....................................................................... 81
4.6.12. _DSM for Downstream Port Containment and Hot-Plug Surprise Control ......................... 82
4.6.13. _DSM for Locating the Port that Experienced the Containment Event ............................... 87
4.6.14. _DSM for Quering Platform Vendor Specific TPH Features ............................................... 88
4.7. _DSM Definitions for PCIe SSD Status LED ............................................................................. 89
4.7.1. _DSM Method Output ......................................................................................................... 90
4.7.2. Query Supported Functions (Function Index 0) .................................................................. 90
4.7.3. Get PCIe SSD Supported LED States ................................................................................ 91
4.7.4. Get PCIe SSD Status LED States (Function Index 2) ........................................................ 93
4.7.5. Set PCIe SSD Status LED States (Function Index 3) ......................................................... 94
4.8. Generic ACPI PCI Slot Description ........................................................................................... 95
4.9. The OSHP Control Method ........................................................................................................ 96
4.10. Hot Plug Parameters ................................................................................................................. 96
4.10.1. _HPP ................................................................................................................................... 96
4.10.2. _HPX ................................................................................................................................... 97
4.10.3. Device State During Hot Plug ............................................................................................. 97
4.10.4. Slot Power State After Device Removal ............................................................................. 97
5. PCI EXPANSION ROMS ...................................................................................................98
5.1. PCI Expansion ROM Contents .................................................................................................. 98
5.1.1. PCI Expansion ROM Header Format .................................................................................. 99
5.1.2. PCI Data Structure Format ................................................................................................ 100

-- 4 of 122 --

PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 5
5.1.3. Device List Format ............................................................................................................ 102
5.2. Firmware Power-on Self Test (POST) Firmware ..................................................................... 103
5.2.1. PC-compatible Expansion ROMs (Code Type 0) ............................................................. 105
5.2.1.1. Expansion ROM Header Extensions ........................................................................... 106
5.2.1.2. POST Firmware Extensions ......................................................................................... 106
5.2.1.3. Resizing of Expansion ROMs During INIT ................................................................... 107
5.2.1.3.1. Calculating a New Checksum at the End of INIT ................................................ 108
5.2.1.4. Image Structure and Length ........................................................................................ 108
5.2.1.5. Memory Usage ............................................................................................................. 109
5.2.1.6. Verification of BIOS Support ........................................................................................ 109
5.2.1.7. Permanent Memory ..................................................................................................... 110
5.2.1.8. Temporary Memory ...................................................................................................... 110
5.2.1.9. Memory Locations ........................................................................................................ 110
5.2.1.10. Permanent Memory Size Limits ................................................................................. 111
5.2.1.11. Multiple Requests for Memory ................................................................................... 111
5.2.1.12. Protected Mode .......................................................................................................... 111
5.2.1.13. Run-Time Expansion ROM Size ................................................................................ 111
5.2.1.14. Relocation of Expansion ROM Run-time Code ......................................................... 112
5.2.1.15. Expansion ROM Placement Address ........................................................................ 112
5.2.1.16. VGA Expansion ROM ................................................................................................ 113
5.2.1.17. Expansion ROM Placement Alignment ...................................................................... 113
5.2.1.18. BIOS Boot Specification ............................................................................................. 113
5.2.1.19. Extended BIOS Data Area (EBDA) Usage ................................................................ 114
5.2.1.20. POST Memory Manager (PMM) Functions ............................................................... 115
5.2.1.21. Backward Compatibility of Option ROMs ................................................................... 115
5.2.1.22. Option ROM and IRET Handling ................................................................................ 116
5.2.1.23. Stack Size Requirement by Expansion ROM ............................................................ 116
5.2.1.24. Configuration Code for Expansion ROMs .................................................................. 116
5.2.1.24.1. Executing the Expansion ROM Configuration Code ......................................... 118
5.2.1.24.2. Configuration Utility Behavior Under Console Redirection .............................. 119
5.2.1.24.3. Configuration Utility Code Header .................................................................... 119
5.2.1.25. DMTF Server Management Command Line Protocol (SM CLP) Support ................ 120
5.2.2. UEFI Expansion ROM (Type 3) ........................................................................................ 122

-- 5 of 122 --

PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 6
Figures
Figure 2-1: Layout of Value Returned in [AL]............................................................................................. 15
Figure 4-1: 256-MiB Region for Enhanced Configuration Space Access Mechanism .............................. 39
Figure 5-1: PCI Expansion ROM Structure ................................................................................................ 99
Figure 5-2: Image and Header Organization ........................................................................................... 105
Tables
Table 2-1. Data Structure Fields for the BIOS32 Service Directory .......................................................... 12
Table 2-2: Layout of IRQ Routing Table Entry ........................................................................................... 19
Table 2-3: Function List.............................................................................................................................. 30
Table 2-4: Return Code List ....................................................................................................................... 31
Table 4-1: Memory Address PCI Express Configuration Space ................................................................ 39
Table 4-2: MCFG Table to Support Enhanced Configuration Space Access ............................................ 41
Table 4-3: Memory Mapped Enhanced Configuration Space Base Address Allocation Structure ............ 42
Table 4-4: Interpretation of the _OSC Support Field ................................................................................. 49
Table 4-5: Interpretation of the _OSC Control Field, Passed in via Arg3 .................................................. 51
Table 4-6: Interpretation of the _OSC Control Field, Returned Value ....................................................... 53
Table 4-7: _DSM Definitions for PCI .......................................................................................................... 63
Table 4-8: Bus Types ................................................................................................................................. 68
Table 4-9: PCI Bus Capability Structure .................................................................................................... 69
Table 4-10: Example Usage of Device/Slot Enumeration Ordering Hints ................................................. 75
Table 4-11: _DSM Method Input Parameters ............................................................................................ 89
Table 4-12: Function Index ......................................................................................................................... 89
Table 4-14: Status Field ......................................................................................................................... 90
Table 4-15: Output Buffer ....................................................................................................................... 91
Table 4-16: PCIe SSD Device Status Bitmap Description .......................................................................... 92
Table 4-17: Output Buffer for Function Index 2 ...................................................................................... 93
Table 4-18: Input (Arg3) ......................................................................................................................... 94
Table 4-19: Output Buffer for Function Index 3 ...................................................................................... 94
Table 4-20: Function-specific Error Code for Function Index 3 .............................................................. 95
Table 5-1: Device List Table .................................................................................................................... 102
Table 5-2: Arguments for an Expansion ROM Compliant to this Specification Version 3.0 or Later ....... 107
Table 5-3: Arguments for a Legacy Expansion ROM .............................................................................. 107
Table 5-4: Fields and Values for PMM Functions .................................................................................... 115
Table 5-5: Input Arguments for SM CLP Entry Point ............................................................................... 120
Table 5-6: Output Arguments for SM CLP Entry Point ............................................................................ 121

-- 6 of 122 --

PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 7
1. Introduction
This document describes the hardware independent firmware interface for managing PCI, PCI-X,
and PCI Express™ systems in a host computer.
1.1. Scope
This document is developed based on the PCI BIOS Specification, Revision 2.1. It continues to provide
the PCI BIOS support on the PC-compatible systems.
In addition, this document also provides the descriptions or references of the following:
❑ Advanced Configuration and Power Interface (ACPI) services for supporting PCI, PCI-X, and
PCI Express devices and systems.
❑ Extensible Firmware Interface (EFI) services for supporting PCI, PCI-X, and PCI Express
devices and systems.
❑ Requirements and services for supporting PCI Expansion ROMs: The format, contents, and
code entry points for PCI Expansion ROMs, along with system firmware services and execution
environment, are described in this document. This information was documented in prior
versions of the Conventional PCI Local Bus Specification (Revision 2.3 and earlier), and is now
maintained solely in this document.
1.2. Reference Documents
The following documents are a part of this specification to the extent specified herein:
Advanced Configuration and Power Interface, Revision 6.3 (ACPI 6.3), January 2019
https/uefi.org/specifications
Unified Extensible Firmware Interface Specification, Version 2.8, March 2019, https/uefi.org/specifications
Driver Writer’s Guide for UEFI 2.3.1, Draft 1.10, April 2018, is https://edk2-docs.gitbooks.io/edk-ii-
uefi-driver-writer-s-guide/
PCI Local Bus Specification, Revision 3.0 (PCI 3.0)
PCI Express Base Specification, Revision 5.0
PCI Express Card Electromechanical Specification, Revision 4.0
PCI Express to PCI/PCI-X Bridge Specification, Revision 1.0
PCI Express Mini Card Electromechanical Specification, Revision 4.0
1

-- 7 of 122 --

INTRODUCTION
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 8
PCI-X Addendum to the PCI Local Bus Specification, Revision 2.0
PCI Hot-Plug Specification, Revision 1.1
PCI Standard Hot-Plug Controller and Subsystem Specification, Revision 1.0 (SHPC 1.0)
DMTF Server Management Command Line Protocol (SM CLP) Specification, v1.0.2, Document Number
DSP0214, March 7, 2007, http://www.dmtf.org/standards/published_documents/DSP0214.pdf
SMBIOS Reference Specification, v3.4.0a, Document Number DSP0134, December 7, 2019,
https://www.dmtf.org/standards/smbios
1.3. Terms and Acronyms
Term Definition
Active State Power Management (ASPM) An autonomous hardware based active state
mechanism, Active State Power Management defined in
PCI Express.
Advanced Error Reporting (AER) A capability for advanced error control and reporting
defined in PCI Express.
Bus Number A number in the range 0…255 that uniquely selects a
PCI bus.
Configuration Space A separate address space on PCI buses. Used for
device identification and configuring devices into
Memory and I/O spaces.
Device ID A predefined field in configuration space that (along with
Vendor ID) uniquely identifies the device.
Device Number A number in the range 0…31 that uniquely selects a
device on a PCI bus.
Function Number A number in the range 0…7 that uniquely selects a
function within a multi-function PCI device.
Message Signaled Interrupt (MSI) An optional feature that enables a device to request
service by writing a system-specified DW of data to a
system-specified address using a Memory Write
semantic Request.
Multi-function PCI device A PCI device that contains multiple functions. For
instance, a single device that provides both LAN and
SCSI functions and has a separate configuration space
for each function is a multi-function device.
Operating System Hot Plug (OSHP) An ACPI control method to transfer control of Hot-Plug
to the operating system. On some systems, this
method is defined for Ports that are Hot-Plug capable
and being controlled by ACPI firmware.
PCI An acronym for Peripheral Component Interconnect.

-- 8 of 122 --

INTRODUCTION
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 9
Term Definition
Segment Group Number A number in the range 0…65535 that uniquely selects a
PCI Segment Group.
PCI Segment Group is purely a software concept
managed by system firmware and used by the operating
system. It is a logical collection of PCI buses (or bus
segments). There is no tie to any physical entities. It is
a way to logically group the PCI bus segments and PCI
Express Hierarchies.
PCI Segment Group concept enables support for more
than 256 buses in a system by allowing the reuse of the
PCI bus numbers. Within each PCI Segment Group,
the bus numbers for the PCI buses must be unique.
PCI buses in different PCI Segment Group are
permitted to have the same bus number.
A PCI Segment Group contains one or more PCI host
bridges.
There is at least one PCI Segment Group, PCI Segment
Group 0, in a system.
Standard Hot-Plug Controller (SHPC) A PCI Hot-Plug Controller compliant with SHPC 1.0.
Vendor ID A predefined field in configuration space that (along with
Device ID) uniquely identifies the device.

-- 9 of 122 --

PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 10
2.Traditional PCI BIOS
2.1. Functional Description
PCI BIOS functions provide a software interface to the hardware used to implement a PCI based
system. Its primary usage is for generating operations in PCI specific address spaces (configuration
space and Special Cycles).
PCI BIOS functions are specified to operate in the following modes of the X86 architecture. The
modes are: real-mode, 16:16 protected mode (also known as 286 protected mode), 16:32 protected
mode (introduced with the 386), and 0:32 protected mode (also known as “flat” mode, wherein all
segments start at linear address 0 and span the entire 4 GiB address space).
Access to the PCI BIOS functions for 16-bit callers is provided through Interrupt 1Ah. 32-bit (i.e.,
protected mode) access is provided by calling through a 32-bit protected mode entry point. The
PCI BIOS function code is B1h. Specific BIOS functions are invoked using a sub-function code. A
user simply sets the host processors registers for the function and sub-function desired and calls the
PCI BIOS software. Status is returned using the CARRY FLAG ([CF]) and registers specific to the
function invoked.
2.2. Assumptions and Constraints
2.2.1. ROM BIOS Location
The PCI BIOS functions are intended to be located within an IBM-PC compatible ROM BIOS.
2.2.2. Calling Conventions
The PCI BIOS functions use the X86 CPU’s registers to pass arguments and return status. The
caller must use the appropriate sub-function code.
These routines preserve all registers and flags except those used for return parameters. The CARRY
FLAG [CF] will be altered as shown to indicate completion status. The calling routine will be
returned with the interrupt flag unmodified and interrupts will not be enabled during function
execution. These routines are re-entrant. These routines require 1024 bytes of stack space and the
stack segment must have the same size (i.e., 16-bit or 32-bit) as the code segment.
2

-- 10 of 122 --

TRADITIONAL PCI BIOS
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 11
The PCI BIOS provides a 16-bit real and protected mode interface and a 32-bit protected mode
interface. The 16-bit interface is provided through PC/AT Int 1Ah software interrupt. The PCI
BIOS Int 1Ah interface operates in either real mode, virtual-86 mode, or 16:16 protected mode.
The BIOS functions may also be accessed through the industry standard entry point for INT 1Ah
(physical address 000F FE6Eh) by simulating an INT instruction.3 The INT 1Ah entry point
supports 16-bit code only. Protected mode callers of this interface must set the CS selector base to
0 F000h.
The protected mode interface supports 32-bit protected mode callers. The protected mode PCI
BIOS interface is accessed by calling (not a simulated INT) through a protected mode entry point in
the PCI BIOS. The entry point and information needed for building the segment descriptors are
provided by the BIOS32 Service Directory (refer to Section 2.3). 32-bit callers invoke the PCI BIOS
routines using CALL FAR.
The PCI BIOS routines (for both 16-bit and 32-bit callers) must be invoked with appropriate
privilege so that interrupts can be enabled/disabled and the routines can access I/O space.
Implementers of the PCI BIOS must assume that CS is execute-only and DS is read-only.
2.2.3. Interrupt Support
To support PC-compatible BIOS, the system must support the INTx routing. MSI or MSI-X may
be supported for the operating system use after booted from BIOS.
2.3. BIOS32 Service Directory
Detecting the absence or presence of 32-bit BIOS services with 32-bit code can be problematic.
Standard BIOS entry points cannot be called in 32-bit mode on all machines because the platform
BIOS may not support 32-bit callers. This section describes a mechanism for detecting the presence
of 32-bit BIOS services. While the mechanism supports the detection of the PCI BIOS, it is
intended to be broader in scope to allow detection of any/all 32-bit BIOS services. The description
of this mechanism, known as BIOS32 Service Directory, is provided in three parts; the first part
specifies an algorithm for determining if the BIOS32 Service Directory exists on a platform, the
second part specifies the calling interface to the BIOS32 Service Directory, and the third part
describes how the BIOS32 Service Directory supports PCI BIOS detection.
2.3.1. Determining the Existence of BIOS32 Service
Directory
A BIOS which implements the BIOS32 Service Directory must embed a specific, contiguous
16-byte data structure, beginning on a 16-byte boundary somewhere in the physical address range
0E 0000h - 0F FFFFh. A description of the fields in the data structure are given in Table 2-1.
3 Note that accessing the BIOS functions through the industry standard entry point will bypass any code that may
have “hooked” the INT 1Ah interrupt vector.

-- 11 of 122 --

TRADITIONAL PCI BIOS
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 12
Table 2-1. Data Structure Fields for the BIOS32 Service Directory
Offset Size Description
0 4 bytes Signature string in ASCII. The string is "_32_". This puts an “underscore”
at offset 0, a “3” at offset 1, a “2” at offset 2, and another “underscore” at
offset 3.
4 4 bytes Entry point for the BIOS32 Service Directory. This is a 32-bit physical
address.
8 1 byte Revision level. This version has revision level 00h.
9 1 byte Length. This field provides the length of this data structure in paragraph
(i.e., 16-byte) units. This data structure is 16 bytes long so this field
contains 01h.
0Ah 1 byte Checksum. This field is a checksum of the complete data structure. The
sum of all bytes must add up to 0.
0Bh 5 bytes Reserved. Must be zero.
Clients of the BIOS32 Service Directory should determine its existence by scanning 0E 0000h to
0F FFF0h looking for the ASCII signature and a valid, checksummed data structure. If the data
structure is found, the BIOS32 Service Directory can be accessed through the entry point provided
in the data structure. If the data structure is not found, then the BIOS32 Service Directory (and also
the PCI BIOS) is not supported by the platform.
2.3.2. Calling Interface for BIOS32 Service Directory
The BIOS32 Service Directory is accessed by doing a CALL FAR to the entry point provided in the
Service data structure (see previous section). There are several requirements about the calling
environment that must be met. The CS code segment selector and the DS data segment selector
must be set up to encompass the physical page holding the entry point as well as the immediately
following physical page. They must also have the same base. Platform BIOS writers must assume
that CS is execute-only and DS is read-only. The SS stack segment selector must provide at least
1 KiB of stack space. The calling environment must also allow access to I/O space.
The BIOS32 Service Directory provides a single function to determine whether a particular 32-bit
BIOS service is supported by the platform. All parameters to the function are passed in registers.
Parameter descriptions are provided below. If a particular service is implemented in the platform
BIOS, three values are returned. The first value is the base physical address of the BIOS service.
The second value is the length of the BIOS service. These two values can be used to build the code
segment selector and data segment selector for accessing the service. The third value provides the
entry point to the BIOS service encoded as an offset from the base.

-- 12 of 122 --

TRADITIONAL PCI BIOS
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 13
ENTRY:
[EAX] Service Identifier. This is a four character string used to
specifically identify which 32-bit BIOS Service is being sought.
[EBX] The low order byte ([BL]) is the BIOS32 Service Directory
function selector. Currently only one function is defined (with
the encoding of zero) which returns the values provided
below.
The upper three bytes of [EBX] are reserved and must be zero
on entry.
EXIT:
[AL] Return Code:
00h = Service corresponding to Service Identifier is
present.
80h = Service corresponding to Service Identifier is not
present.
81h = Unimplemented function for BIOS Service
Directory (i.e., BL has an unrecognized value).
[EBX] Physical address of the base of the BIOS service.
[ECX] Length of the BIOS service.
[EDX] Entry point into BIOS service. This is an offset from the base
provided in EBX.
2.4. PCI BIOS 32-bit Service
The BIOS32 Service Directory may be used to detect the presence of the PCI BIOS. The Service
Identifier for the PCI BIOS is “$PCI” (4943 5024h).
The 32-bit PCI BIOS functions must be accessed using CALL FAR. The CS and DS descriptors
must be setup to encompass the physical addresses specified by the Base and Length parameters
returned by the BIOS32 Service Directory. The CS and DS descriptors must have the same base.
The calling environment must allow access to I/O space and provide at least 1 KiB of stack space.
Platform BIOS writers must assume that CS is execute-only and DS is read-only.

-- 13 of 122 --

TRADITIONAL PCI BIOS
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 14
2.5. Host Interface
2.5.1. Identifying PCI Resources
The following group of functions allow the caller to determine first, if the PCI BIOS support is
installed, and second, if specific PCI devices are present in the system.
2.5.2. PCI BIOS Present
This function allows the caller to determine whether the PCI BIOS interface function set is present,
and what the current interface version level is. It also provides information about what hardware
mechanism for accessing configuration space is supported, and whether or not the hardware
supports generation of PCI Special Cycles.
ENTRY:
[AH] PCI_FUNCTION_ID
[AL] PCI_BIOS_PRESENT
EXIT:
[EDX] “PCI”, “P” in [DL], “C” in [DH], etc. There is a
“space” character in the upper byte.
[AH] Present Status, 00h = BIOS Present if and only if
EDX set properly.
[AL] Hardware mechanism.
[BH] Interface Level Major Version.
[BL] Interface Level Minor Version.
[CL] Number of last PCI bus in the system.
[CF] Present Status, set = No BIOS Present,
reset = BIOS Present if and only if EDX set
properly.
If the CARRY FLAG [CF] is cleared and AH is set to 00h, it is still necessary to examine the
contents of [EDX] for the presence of the string “PCI” + (trailing space) to fully validate the
presence of the PCI function set. [BX] will further indicate the version level, with enough
granularity to allow for incremental changes in the code that do not affect the function interface.
Version numbers are stored as Binary Coded Decimal (BCD) values. For example, Version 2.10
would be returned as a 02h in the [BH] registers and 10h in the [BL] registers.
A BIOS that complies with Version 3.1 of the specification will return with 0310h in the [BX]
register.

-- 14 of 122 --

TRADITIONAL PCI BIOS
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 15
The value returned in [AL] identifies what specific hardware characteristics the platform supports in
relation to accessing configuration space and generating PCI Special Cycles (see Figure 2-1). The
PCI Specification defines two hardware mechanisms for accessing configuration space. Bits 0 and 1
of the value returned in [AL] specify which mechanism is supported by this platform. Bit 0 will be
Set (1) if Mechanism #1 is supported, and Clear (0) otherwise. Bit 1 will be Set (1) if Mechanism #2
is supported, and Clear (0) otherwise. Bits 2, 3, 6, and 7 are reserved and returned as zeros.
The PCI Specification also defines hardware mechanisms for generating Special Cycles. Bits 4 and 5
of the value return in [AL] specify which mechanism is supported (if any). Bit 4 will be Set (1) if the
platform supports Special Cycle generation based on Config Mechanism #1, and Clear (0)
otherwise. Bit 5 will be Set (1) if the platform supports Special Cycle generation based on Config
Mechanism #2, and Clear (0) otherwise.
Figure 2-1: Layout of Value Returned in [AL]
The value returned in [CL] specifies the number of the last PCI bus in the system. PCI buses are
numbered starting at zero and running up to the value specified in CL.
If the [BX] register indicates that the BIOS is compliant with version 3.0 (or later), then the [CH]
register will have the following meaning:
CH = Level of BIOS support:
bit 0 set = Functions 06h through 0Dh inclusively are implemented for register
access below 256.
bit 1 set = Functions 06h through 0Dh inclusively are implemented for register
access in the range 256 - 4096 for POST only.
bit 2 set = Function 0Eh has been implemented.
bit 3 set = Function 0Fh has been implemented.
bit 4 set = Function 02h has been implemented.
bit 5 set = Function 03h has been implemented.
bit 6 set = BIOS supports Option ROM Configuration Code execution.
bit 7 set = BIOS supports calling the Option ROM with DMTF CLP style
configuration data.
Note that version 3.0 and 3.1 of this specification requires that bit 0 and bit 1 be Set. This may not
be the case in future versions of the specification.

-- 15 of 122 --

TRADITIONAL PCI BIOS
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 16
2.5.3. Find PCI Device
This function returns the location of PCI devices that have a specific Device ID and Vendor ID.
Given a Vendor ID, Device ID, and an Index (N), the function returns the Bus Number, Device
Number, and Function Number of the Nth Device/Function whose Vendor ID and Device ID
match the input parameters.
ENTRY:
[AH] PCI_FUNCTION_ID
[AL] FIND_PCI_DEVICE
[CX] Device ID (0...65535)
[DX] Vendor ID (0...65534)
[SI] Index (0...N)
EXIT:
[BH] Bus Number (0...255)
[BL] Device Number in upper 5 bits,
Function Number in bottom 3 bits.
[AH] Return Code:
SUCCESSFUL
DEVICE_NOT_FOUND
BAD_VENDOR_ID
[CF] Completion Status, set = error, cleared = success.
Calling software can find all devices having the same Vendor ID and Device ID by making
successive calls to this function starting with Index set to zero, and incrementing it until the return
code is “DEVICE_NOT_FOUND”. A return code of BAD_VENDOR_ID indicates that the
passed in Vendor ID value (in [DX]) had an illegal value of all 1's.
Values returned by this function upon successful completion must be the actual values used to
access the PCI device if the INT 1Ah routines are bypassed in favor of the direct I/O mechanisms
described in the PCI Specification.

-- 16 of 122 --

TRADITIONAL PCI BIOS
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 17
2.5.4. Find PCI Class Code
This function returns the location of PCI devices that have a specific Class Code. Given a Class
Code and an Index (N), the function returns the Bus Number, Device Number, and Function
Number of the Nth Device/Function whose Class Code matches the input parameters.
ENTRY:
[AH] PCI_FUNCTION_ID
[AL] FIND_PCI_CLASS_CODE
[ECX] Class Code (in lower 3 bytes)
[SI] Index (0...N)
EXIT:
[BH] Bus Number (0...255)
[BL] Device Number in upper 5 bits,
Function Number in bottom 3 bits.
[AH] Return Code:
SUCCESSFUL
DEVICE_NOT_FOUND
[CF] Completion Status, set = error, cleared = success.
Calling software can find all devices having the same Class Code by making successive calls to this
function starting with Index set to zero, and incrementing it until the return code is
“DEVICE_NOT_FOUND”.

-- 17 of 122 --

TRADITIONAL PCI BIOS
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 18
2.6. PCI Support Functions
The following functions provide support for several PCI specific operations.
2.6.1. Generate Special Cycle
This function allows for generation of PCI special cycles. The generated special cycle will be
broadcast on a specific PCI bus in the system.
ENTRY:
[AH] PCI_FUNCTION_ID
[AL] GENERATE_SPECIAL_CYCLE
[BH] Bus Number (0...255)
[EDX] Special Cycle Data
EXIT:
[AH] Return Code:
SUCCESSFUL
FUNC_NOT_SUPPORTED
[CF] Completion Status, set = error, reset = success.
2.6.2. Get PCI Interrupt Routing Expansions
Description:
Logical input parameters:
RouteBuffer Pointer to buffer data structure
This routine returns the PCI interrupt routing Expansions available on the system motherboard and
also the current state of what interrupts are currently exclusively assigned to PCI. Routing
information is returned in a data buffer that contains an IRQ Routing for each PCI device or slot.
The format of an entry in the IRQ routing table is shown in Table 2-2.

-- 18 of 122 --

TRADITIONAL PCI BIOS
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 19
Table 2-2: Layout of IRQ Routing Table Entry
Offset Size Description
0 byte PCI Bus number
1 byte PCI Device number (in upper 5 bits)
2 byte Link value for INTA#
3 word IRQ bit-map for INTA#
5 byte Link value for INTB#
6 word IRQ bit-map for INTB#
8 byte Link value for INTC#
9 word IRQ bit-map for INTC#
11 byte Link value for INTD#
12 word IRQ bit-map for INTD#
14 byte Slot Number
15 byte Reserved (for OEM use)
Two values are provided for each PCI interrupt pin in every slot. One of these values is a bit-map
that shows which of the standard AT IRQs this PCI interrupt can be routed to. This provides the
routing Expansions for one particular PCI interrupt pin. In this bit-map, bit 0 corresponds to
IRQ0, bit 1 to IRQ1, etc. A “1” bit in this bit-map indicates a routing is possible: a “0” bit indicates
no routing is possible. The second value is a “link” value that provides a way of specifying which
PCI interrupt pins are wire-OR'ed together on the motherboard. Interrupt pins that are wired
together must have the same “link” value in their table entries. Values for the “link” field are
arbitrary except that the value zero indicates that the PCI interrupt pin has no connection to the
interrupt controller.5
The Slot Number value at the end of the structure is used to communicate whether the table entry is
for a motherboard device or an add-in slot. For motherboard devices, Slot Number should be set to
zero. For add-in slots, Slot Number should be set to a value that corresponds with the physical
placement of the slot on the motherboard. This provides a way to correlate physical slots with PCI
Device numbers. Values (with the exception of 00h) are OEM specific.6 For end user ease-of-use,
slots in the system should be clearly labeled (e.g., solder mask, back panel, etc.).
5This is typically used for motherboard devices that have only an IRQA# line and not IRQB#, IRQC#, or IRQD#.
6For example, a system with 4 ISA slots and 3 PCI slots arranged as 3-ISA, 3-PCI, and 1-ISA may choose to start
numbering the slots at the 3-ISA end in which case the PCI slot numbers would be 4, 5, and 6. If slot numbering
started at the 1-ISA end, PCI slot numbers would be 2, 3, and 4.

-- 19 of 122 --

TRADITIONAL PCI BIOS
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 20
This routine requires one parameter, RouteBuffer, which is a far pointer to the data structure shown
below.
typedef struct
{
WORD BufferSize;
BYTE FAR * DataBuffer;
} IRQRoutingExpansionsBuffer;
where
BufferSize: A word size value providing the size of the data buffer. If the buffer is
too small, the routine will return with status of BUFFER_TOO_SMALL, and this
field will be updated with the required size. To indicate that the running PCI system
does not have any PCI devices, this function will update the BufferSize field to zero.
On successful completion, this field is updated with the size (in bytes) of the data
returned.
DataBuffer: Far pointer to the buffer containing PCI interrupt routing information
for all motherboard devices and slots.
IMPLEMENTATION NOTE
Defining the DataBuffer in C
The code example above is syntactically correct for C language in all processor modes. But the
storage size of the BYTE FAR * offset varies for each mode as follows:
● Real Mode: 2 WORD (Segment:Offset)
● PM16: 2 WORD (Selector:Offset)
● PM32: 3 WORD (Selector:32bitOffset)
This routine also returns information about which IRQs are currently dedicated for PCI usage. This
information is returned as a bit map where a set bit indicates that the IRQ is dedicated to PCI and
not available for use by devices on other buses. Note that if an IRQ is routed such that it can be
used by PCI devices and other devices the corresponding bit in the bit map should not be set. The
function returns this information in the [BX] register where bit 0 corresponds to IRQ0, bit 1 -
IRQ1, etc. The caller must initialize [BX] to zero before calling this routine.

-- 20 of 122 --

TRADITIONAL PCI BIOS
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 21
ENTRY:
[AH] PCI_FUNCTION_ID
[AL] GET_IRQ_ROUTING_EXPANSIONS
[BX] Must be initialized to 0000h.
[DS] Segment or Selector for BIOS data.
For 16-bit code, the real-mode segment or PM
selector must resolve to physical address
0F 0000h and have a limit of 64 KiB.
For information on 32-bit code, refer to
Section 2.4.
[ES] Segment or Selector for RouteBuffer
parameter.
[DI] for 16-bit
code
[EDI] for 32-bit
code
Offset for RouteBuffer parameter.
EXIT:
[AH] Return Code:
SUCCESSFUL
BUFFER_TOO_SMALL
FUNC_NOT_SUPPORTED
[BX] IRQ bitmap indicating which IRQs are
exclusively dedicated to PCI devices.
[CF] Completion Status, set = error, cleared =
success.
2.6.3. Set PCI Hardware Interrupt
Description:
This function is intended to be used by a system-wide configuration utility or a PNP operating
system. This function should never be called by device drivers or Expansion ROM code.
This function is optional in this version of the specification. The caller is responsible for checking
the return code to determine if the call is supported.
Logical input parameters:
BusDev Bus number and device number
IntPin PCI Interrupt Pin (INTA ..
INTD)
IRQNum IRQ Number (0-15)

-- 21 of 122 --

TRADITIONAL PCI BIOS
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 22
This routine causes the specified hardware interrupt (IRQ) to be connected to the specified interrupt
pin of a PCI device. It makes the following assumptions:
1. The caller is responsible for all error checking to ensure no resource conflict exits between the
specific hardware interrupt assigned to the PCI device and any other hardware interrupt resource
in the system.
2. The caller is responsible for ensuring that the specified interrupt is configured properly (level
triggered) in the interrupt controller. If the system contains hardware outside of the interrupt
controller that controls interrupt triggering (edge/level), then the callee (i.e., the BIOS) is
responsible for setting that hardware to level triggered for the specified interrupt.
3. The caller is responsible for updating PCI configuration space (i.e., Interrupt Line registers) for
all effected devices.
4. The caller must be aware that changing IRQ routing for one device will also change the IRQ
routing for other devices whose INTx# pins are WIRE-ORed together (i.e., they have the same
link field in the Get Routing Expansions call).
If the requested interrupt cannot be assigned to the specified PCI device, then SET_FAILED status
is returned. This routine immediately effects the interrupt routing and does nothing to remember
the routing for the next system boot.
The BusDev parameter specifies the PCI bus and device numbers for the PCI device/slot being
modified. The high-order byte of BusDev contains the PCI bus number. The device number is
provided in the top five bits of the low-order byte of BusDev. For example, to specify device 6 on
PCI bus 2 the BusDev parameter would be 0230h.
The IntPin parameter specifies which interrupt pin (INTA#,..,INTD#) of the specified PCI device/slot
is effected by this call. A value of 0Ah corresponds to INTA#, 0Bh to INTB#, etc.
The IRQNum parameter specifies which IRQ input is to be connected to the PCI interrupt pin.
This parameter can have values of 0..15 specifying IRQ0 thru IRQ15 respectively.
ENTRY:
[AH] PCI_FUNCTION_ID
[AL] SET_PCI_HW_INT
[CL] IntPin parameter. Valid values 0Ah..0Dh.
[CH] IRQNum parameter. Valid values 0..0Fh.
[BX] BusDev parameter. [BH] holds bus number,
[BL] holds Device (upper 5 bits), and
Function (lower 3 bits) numbers.
[DS] Segment or Selector for BIOS data.
For 16-bit code, the real-mode segment or
the Protected Mode selector must resolve to
physical address 0F 0000h and have a limit
of 64 KiB.
For 32-bit code, see Section 2.4.

-- 22 of 122 --

TRADITIONAL PCI BIOS
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 23
EXIT:
[AH] Return Code:
SUCCESSFUL
SET_FAILED
FUNC_NOT_SUPPORTED
[CF] Completion Status, set = error, cleared
= success.
2.7. Accessing Configuration Space
The 32-bit PCI BIOS functions must be accessed using CALL FAR. The CS and DS descriptors
must be setup to encompass the physical addresses specified by the Base and Length parameters
returned by the BIOS32 Service Directory. The CS and DS descriptors must have the same base.
The ES descriptors must be setup to encompass the physical address reported by the PCI Express
Base Address Register (BAR) region. The ES descriptor must have a base of zero with the limit of
4 GiB to encompass the 256-MiB PCI Express BAR region. The calling environment must allow
access to I/O space and provide at least 1 KiB of stack space. Platform BIOS writers must assume
that CS is execute-only, DS is read-only, and ES is read/write.
The underlying assumptions being made are the following:
❑ If PCI BIOS functions support access to extended configuration registers, the PCI Express
memory mapped configuration base address must be programmed with an address region that
exists below 4 GiB of memory.
❑ The caller has the responsibility to appropriately parse the data returned from accessing non-
existing registers of a PCI Device. The caller has to ensure that Register accesses beyond
256 bytes be invoked only on devices that have the support for extended configuration space.
For example: if the caller accesses DWORD Register 0FFCh (4092) of a regular PCI device, the
data returned cannot be predicted.
❑ PCI BIOS functions do not comprehend the concept of PCI Segment Groups (for definition,
refer to Section 4.3.2.3) and, hence, can only support access to the devices in the default PCI
Segment Group, namely, PCI Segment Group 0.
2.7.1. Access Rules for PCI Express I/O and Memory
Mapped Accesses
Firmware should use the PCI I/O Index/Data mechanism to access configuration space registers
0-255. Only accesses to configuration space registers 256 and beyond should use the PCI Express
memory-mapped access mechanism.

-- 23 of 122 --

TRADITIONAL PCI BIOS
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 24
2.7.2. INT1Ah Access Calls in Real Mode
The real mode invocations of INT 1Ah for reading the PCI Express Extended Configuration space
are intended to be used for handling the internal BIOS/system firmware code calls during POST (if
needed). After POST, it is recommended that the PCI Express Extended Configuration space be
accessed directly without the use of INT 1Ah. The ACPI MCFG table describes the location of the
PCI Express configuration space, and this table will be present in a firmware implementation
compliant to this specification version 3.0 (or later). If INT 1Ah is invoked after POST for reading
the PCI Express extended configuration space, the firmware may return
FUNC_NOT_SUPPORTED.
2.7.3. Read Configuration Byte
This function allows reading individual bytes from the configuration space of a specific device.
ENTRY:
[AH] PCI_FUNCTION_ID
[AL] READ_CONFIG_BYTE
[BH] Bus Number (0...255)
[BL] Device Number in upper 5 bits,
Function Number in lower 3 bits.
[DI] Register Number (0...4095) [bits 11:0]
To Read Register number greater than 255 [bit15=1]
To Read Register number less than or equal to 255 [bit15=0]
EXIT:
[CL] Byte Read
[AH] Return Code:
SUCCESSFUL
BAD_REGISTER_NUMBER
FUNC_NOT_SUPPORTED
[CF] Completion Status, set = error, reset = success.

-- 24 of 122 --

TRADITIONAL PCI BIOS
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 25
Input Register Requirements:
❑ If register DI has a register number less than or equal to 255 and does not have bit15=1, the
BIOS will read the configuration space and return the value read with return code “SUCCESS”.
❑ If register DI has a register number greater than 255 and does not have bit15=1, the BIOS will
not try to read the configuration space and returns “BAD_REGISTER_NUMBER”.
❑ If register DI has a register number greater than 255 with bit15=1 and the BIOS implements the
extensions for accessing PCI Express Extended Configuration space, then the BIOS will read
the configuration space and return the value read with return code “SUCCESS”.
❑ If register DI has a register number greater than 255 with bit15=1 and the BIOS does not
implement the extensions for accessing PCI Express Extended Configuration space, then the
BIOS will return error code of “FUNC_NOT_SUPPORTED”.
2.7.4. Read Configuration Word
This function allows reading individual words from the configuration space of a specific device. The
Register Number parameter must be a multiple of two (i.e., bit 0 must be set to 0).
ENTRY:
[AH] PCI_FUNCTION_ID
[AL] READ_CONFIG_WORD
[BH] Bus Number (0...255)
[BL] Device Number in upper 5 bits,
Function Number in lower 3 bits.
[DI] Register Number (0, 2, 4,...4094) [bits 11:0]
To Read Register number greater than 255 [bit15=1]
To Read Register number less than or equal to 254 [bit15=0]
EXIT:
[CX] Word Read
[AH] Return Code:
SUCCESSFUL
BAD_REGISTER_NUMBER
FUNC_NOT_SUPPORTED
[CF] Completion Status, set = error, reset = success.

-- 25 of 122 --

TRADITIONAL PCI BIOS
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 26
Input Register Requirements:
❑ If register DI has a register number less than or equal to 254 and does not have bit15=1, the
BIOS will read the configuration space and return the value read with return code “SUCCESS”.
❑ If register DI has a register number greater than 255 and does not have bit15=1, the BIOS will
not try to read the configuration space and returns “BAD_REGISTER_NUMBER”.
❑ If register DI has a register number greater than 255 with bit15=1 and the BIOS implements the
extensions for accessing PCI Express Extended Configuration space, then the BIOS will read
the configuration space and return the value read with return code “SUCCESS”.
❑ If register DI has a register number greater than 255 with bit15=1 and the BIOS does not
implement the extensions for accessing PCI Express Extended Configuration space, then the
BIOS will return error code of “FUNC_NOT_SUPPORTED”.
2.7.5. Read Configuration DWORD
This function allows reading individual DWORDs from the configuration space of a specific device.
The Register Number parameter must be a multiple of four (i.e., bits 0 and 1 must be set to 0).
ENTRY:
[AH] PCI_FUNCTION_ID
[AL] READ_CONFIG_DWORD
[BH] Bus Number (0...255)
[BL] Device Number in upper 5 bits,
Function Number in lower 3 bits.
[DI] Register Number (0, 4, 8,...4092) [bits 11:0]
To Read Register number greater than 255 [bit15=1]
To Read Register number less than or equal to 252 [bit15=0]
EXIT:
[ECX] DWORD Read
[AH] Return Code:
SUCCESSFUL
BAD_REGISTER_NUMBER
FUNC_NOT_SUPPORTED
[CF] Completion Status, set = error, reset = success.

-- 26 of 122 --

TRADITIONAL PCI BIOS
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 27
Input Register Requirements:
❑ If register DI has a register number less than or equal to 252 and does not have bit15=1, the
BIOS will read the configuration space and return the value read with return code “SUCCESS”.
❑ If register DI has a register number greater than 255 and does not have bit15=1, the BIOS will
not try to read the configuration space and returns “BAD_REGISTER_NUMBER”.
❑ If register DI has a register number greater than 255 with bit15=1 and BIOS implements the
extensions for accessing PCI Express Extended Configuration space, then the BIOS will read
the configuration space and return the value read with return code “SUCCESS”.
❑ If register DI has a register number greater than 255 with bit15=1 and the BIOS does not
implement the extensions for accessing PCI Express Extended Configuration space, then the
BIOS will return error code of “FUNC_NOT_SUPPORTED”.
2.7.6. Write Configuration Byte
This function allows writing individual bytes to the configuration space of a specific device.
ENTRY:
[AH] PCI_FUNCTION_ID
[AL] WRITE_CONFIG_BYTE
[BH] Bus Number (0...255)
[BL] Device Number in upper 5 bits,
Function Number in lower 3 bits.
[DI] Register Number (0...4095) [bits 11:0]
To Write Register number greater than 255 [bit15=1]
To Write Register number less than or equal to 255 [bit15=0]
[CL] Byte Value to Write
EXIT:
[AH] Return Code:
SUCCESSFUL
BAD_REGISTER_NUMBER
FUNC_NOT_SUPPORTED
[CF] Completion Status, set = error, reset = success.

-- 27 of 122 --

TRADITIONAL PCI BIOS
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 28
Input Register Requirements:
❑ If register DI has a register number less than or equal to 255 and does not have bit15=1, the
BIOS will read the configuration space and return the value read with return code “SUCCESS”.
❑ If register DI has a register number greater than 255 and does not have bit15=1, the BIOS will
not try to read the configuration space and returns “BAD_REGISTER_NUMBER”.
❑ If register DI has a register number greater than 255 with bit15=1 and the BIOS implements the
extensions for accessing PCI Express Extended Configuration space, then the BIOS will read
the configuration space and return the value read with return code “SUCCESS”.
❑ If register DI has a register number greater than 255 with bit15=1 and the BIOS does not
implement the extensions for accessing PCI Express Extended Configuration space, then the
BIOS will return error code of “FUNC_NOT_SUPPORTED”.
2.7.7. Write Configuration Word
This function allows writing individual words from the configuration space of a specific device. The
Register Number parameter must be a multiple of two (i.e., bit 0 must be set to 0).
ENTRY:
[AH] PCI_FUNCTION_ID
[AL] WRITE_CONFIG_WORD
[BH] Bus Number (0...255)
[BL] Device Number in upper 5 bits,
Function Number in lower 3 bits.
[DI] Register Number (0, 2, 4,...4094) [bits 11:0]
To Write Register number greater than 255 [bit15=1]
To Write Register number less than or equal to 254 [bit15=0]
[CX] Word Value to Write
EXIT:
[AH] Return Code:
SUCCESSFUL
BAD_REGISTER_NUMBER
FUNC_NOT_SUPPORTED
[CF] Completion Status, set = error, reset = success.

-- 28 of 122 --

TRADITIONAL PCI BIOS
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 29
Input Register Requirements:
❑ If register DI has a register number less than or equal to 254 and does not have bit15=1, the
BIOS will read the configuration space and return the value read with return code “SUCCESS”.
❑ If register DI has a register number greater than 255 and does not have bit15=1, the BIOS will
not try to read the configuration space and returns “BAD_REGISTER_NUMBER”.
❑ If register DI has a register number greater than 255 with bit15=1 and the BIOS implements the
extensions for accessing PCI Express Extended Configuration space, then the BIOS will read
the configuration space and return the value read with return code “SUCCESS”.
❑ If register DI has a register number greater than 255 with bit15=1 and the BIOS does not
implement the extensions for accessing PCI Express Extended Configuration space, then the
BIOS will return error code of “FUNC_NOT_SUPPORTED”.
2.7.8. Write Configuration DWORD
This function allows writing individual DWORDs from the configuration space of a specific device.
The Register Number parameter must be a multiple of four (i.e., bits 0 and 1 must be set to 0).
ENTRY:
[AH] PCI_FUNCTION_ID
[AL] WRITE_CONFIG_DWORD
[BH] Bus Number (0...255)
[BL] Device Number in upper 5 bits,
Function Number in lower 3 bits.
[DI] Register Number (0, 4, 8,...4092) [bits 11:0]
To Write Register number greater than 255 [bit15=1]
To Write Register number less than or equal to 252 [bit15=0]
[ECX] DWORD Value to Write
EXIT:
[AH] Return Code:
SUCCESSFUL
BAD_REGISTER_NUMBER
FUNC_NOT_SUPPORTED
[CF] Completion Status, set = error, reset = success.

-- 29 of 122 --

TRADITIONAL PCI BIOS
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 30
Input Register Requirements:
❑ If register DI has a register number less than or equal to 252 and does not have bit15=1, the
BIOS will read the configuration space and return the value read with return code “SUCCESS”.
❑ If register DI has a register number greater than 255 and does not have bit15=1, the BIOS will
not try to read the configuration space and returns “BAD_REGISTER_NUMBER”.
❑ If register DI has a register number greater than 255 with bit15=1 and the BIOS implements the
extensions for accessing PCI Express Extended Configuration space, then the BIOS will read
the configuration space and return the value read with return code “SUCCESS”.
❑ If register DI has a register number greater than 255 with bit15=1 and the BIOS does not
implement the extensions for accessing PCI Express Extended Configuration space, then the
BIOS will return error code of “FUNC_NOT_SUPPORTED”.
2.8. Function List
Table 2-3: Function List
Function AH AL Implementation Notes
PCI_FUNCTION_ID B1h
PCI_BIOS_PRESENT 01h
FIND_PCI_DEVICE 02h Optional 1
FIND_PCI_CLASS_CODE 03h Optional 1
GENERATE_SPECIAL_CYCLE 06h Optional 1
READ_CONFIG_BYTE 08h Optional 1
READ_CONFIG_WORD 09h Optional 1
READ_CONFIG_DWORD 0Ah Optional 1
WRITE_CONFIG_BYTE 0Bh Optional 1
WRITE_CONFIG_WORD 0Ch Optional 1
WRITE_CONFIG_DWORD 0Dh Optional 1
GET_IRQ_ROUTING_EXPANSIONS 0Eh Optional 2
SET_PCI_HW_INT 0Fh Optional 2
Notes:
1. If the “PCI BIOS PRESENT (B101h)” function indicates “Presence”, then all functions (06h-to-0Dh
inclusively) must be implemented for register accesses below 256 and must be present during
POST and at run-time (after POST completes). For register accesses above 255, these functions
must only be present during POST. There is not a requirement to implement the above 255
register access functions after POST completes; however, if implemented, they must not change
the processor mode when invoked after POST (option ROMs might be executing in v86 mode).
2. Implementation of these INT1Ah sub-functions is optional for compliance with this version of the
specification.

-- 30 of 122 --

TRADITIONAL PCI BIOS
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 31
2.9. Return Code List
Table 2-4: Return Code List
Return Codes AH
SUCCESSFUL 00h
FUNC_NOT_SUPPORTED 81h
BAD_VENDOR_ID 83h
DEVICE_NOT_FOUND 86h
BAD_REGISTER_NUMBER 87h
SET_FAILED 88h
BUFFER_TOO_SMALL 89h

-- 31 of 122 --

PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 32
3.UEFI PCI Services
UEFI stands for Unified Extensible Firmware Interface. The UEFI Specification, Version 2.4 or later
(http://www.uefi.org) describes an interface between the operating system and the platform
firmware. The interface is in the form of data tables that contain platform-related information and
boot and run-time services calls that are available to the operating system and its loader. Together,
these provide a standard environment for booting an operating system.
The following sections provide an overview of the UEFI Services relevant to PCI (including
Conventional PCI, PCI-X, and PCI Express). For details, refer to the UEFI Specification. UEFI is
processor-agnostic.
3.1. UEFI Driver Model
The UEFI Driver Model is designed to support the execution of drivers that run in the pre-boot
environment present on systems that implement the UEFI firmware. These drivers may manage
and control hardware buses and devices on the platform, or they may provide some software
derived platform specific services.
The UEFI Driver Model is designed to extend the UEFI Specification in a way that supports device
drivers and bus drivers. It contains information required by UEFI driver writers to design and
implement any combination of bus drivers and device drivers that a platform may need to boot an
UEFI-compliant operating system.
Applying the UEFI Driver Model to PCI, the UEFI Specification defines the PCI Root Bridge
Protocol and the PCI Driver Model and describes how to write PCI bus drivers and PCI devices
drivers in the UEFI environment. For details, refer to the UEFI Specification.
3.1.1. PCI Root Bridge Protocol
A PCI Root Bridge is represented in UEFI as a device handle that contains a Device Path Protocol
instance and a PCI Root Bridge Protocol instance.
PCI Root Bridge Protocol provides an I/O abstraction for a PCI Root Bridge that the host bus can
perform. This protocol is used by a PCI Bus Driver to perform PCI Memory, PCI I/O, and PCI
Configuration cycles on a PCI Bus. It also provides services to perform different types of bus
mastering DMA on a PCI bus.
PCI Root Bridge Protocol abstracts device specific code from the system memory map. This allows
system designers to make changes to the system memory map without impacting platform
independent code that is consuming basic system resources. An example of such system memory
map changes is a system that provides non-identity memory mapped I/O (MMIO) mapping
between the host processor view and the PCI device view.
3

-- 32 of 122 --

UEFI PCI SERVICES
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 33
3.1.2. PCI Driver Model
The PCI Driver Model is designed to extend the UEFI Driver Model in a way that supports PCI
Bus Drivers and PCI Device Drivers. This applies to Conventional PCI, PCI-X, and PCI Express.
PCI Bus Drivers manage PCI buses present in a system. The PCI Bus Driver creates child device
handles that must contain a Device Path Protocol instance and a PCI I/O Protocol instance. The
PCI I/O Protocol is used by the PCI Device Driver to access memory and I/O on a PCI controller.
PCI Device Drivers manage PCI controllers present on PCI buses. The PCI Device Drivers
produce an I/O abstraction that may be used to boot an UEFI compliant operating system.
3.2. PCI-X Mode 2 and PCI Express
The PCI-X Mode 2 and PCI Express provide a software programming model that is software
compatible with the Conventional PCI.
UEFI PCI I/O Protocol supports up to 4 GiB of configuration space; therefore, it covers the PCI-
X Mode 2 and PCI Express Extended Configuration space of 4 KiB in size.
UEFI uses a single timer interrupt in pre-boot, UEFI device drivers are polled so INTx, MSI, or
MSI-X is not used by UEFI.
To identify a function (e.g., Conventional PCI, PCI-X vs. PCI Express), the UEFI driver uses
Device ID, Vendor ID, and Capability Pointer in the compatibility configuration space.
3.3. EFI Byte Code
The UEFI Specification defines a virtual machine that provides a platform and CPU independent
mechanism for loading and executing UEFI device drivers. The instruction set of the virtual
machine is called EFI Byte Code, or EBC.
For details of the EBC Virtual Machine, refer to the UEFI Specification.
3.4. Graphics Output Protocol
Graphics Output Protocol (GOP) is defined in the UEFI Specification to remove the hardware
requirement to support legacy VGA and INT 10h BIOS. GOP provides a software abstraction to
draw on the video screen.
Note: A graphics adapter will still require a performance driver for high speed operation in the
operating system.
Note: VGA hardware can support GOP.

-- 33 of 122 --

UEFI PCI SERVICES
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 34
3.5. Device State at Firmware/Operating System
Handoff
System firmware is only required to configure the boot and console devices. This section specifies
the state of the PCI subsystem at firmware handoff and provides guidance to the operating system
on how to determine if a particular component was configured by firmware. PCI subsystem refers
to components that are compliant to the PCI, PCI-X, or PCI-Express Specifications. In this
section, “PCI Specifications” refers to the PCI, PCI-X, or PCI Express Specification.
Firmware owns the PCI subsystem prior to handing control off to the operating system. The
handoff point is the return from UEFI ExitBootServices(). After the operating system loader calls
ExitBootServices(), the operating system owns the PCI subsystem.
Firmware may provide pre-boot user interaction to allow the system operator to specify the desired
boot and console devices.
Firmware must configure the entire path to the console (both input and output) and boot devices.
This includes, the chipset, bridges, and multi-function devices. The device configuration is required
to load the operating system loader, display boot up messages, and allow operator interaction with
the boot process.
Optionally, firmware may configure all devices and bridges in the system. Firmware is not required
to configure devices other than boot and console devices.
Since not all devices may be configured prior to the operating system handoff, the operating system
needs to know whether a specific BAR register has been configured by firmware. The operating
system makes the determination by checking the I/O Enable, and Memory Enable bits in the
device's command register, and Expansion ROM BAR enable bits. If the enable bit is set, then the
corresponding resource register has been configured.
Note: The operating system does not use the state of the Bus Master Enable bit to determine the
validity of the BARs. If the BAR ranges are enabled, the device must respond to those addresses.
The device may not be able to master a transaction, but enabled BARs must be configured correctly
by firmware.
The operating system is required to configure PCI subsystems:
❑ During hotplug
❑ For devices that take too long to come out of reset
❑ PCI-to-PCI bridges that are at levels below what firmware is designed to configure

-- 34 of 122 --

UEFI PCI SERVICES
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 35
Firmware must configure all Host Bridges in the systems, even if they are not connected to a
console or boot device. Firmware must configure Host Bridges in order to allow operating systems
to use the devices below the Host Bridges. This is because the Host Bridges programming model is
not defined by the PCI Specifications. “Configured” in this context means that:
❑ Memory and I/O resources are assigned and configured.
❑ Includes both the resources consumed by the Host Bridge and the resources passed through to
the secondary bus.
❑ The bridge is enabled to receive and forward transactions.
❑ The bridge is operating in “safe” mode. Safe mode includes:
● Enabling resources such as: I/O Port, Memory addresses, VGA routing, bus number, etc.
● Enabling detection of parity and system errors.
● Programming cacheline, latency timer, and other registers as required by the PCI
Specifications.
Firmware must report Host Bridges in the ACPI namespace. Each Host Bridge object must contain
the following objects:
❑ _HID and _CID
❑ _CRS to determine all resources consumed and produced (passed through to the secondary bus)
by the host bridge. Firmware allocates resources (Memory Addresses, I/O Port, etc.) to Host
Bridges. The _CRS descriptor informs the operating system of the resources it may use for
configuring devices below the Host Bridge:
● _TRA, _TTP, and _TRS translation offsets to inform the operating system of the mapping
between the primary bus and the secondary bus.
❑ _PRT and the interrupt descriptor to determine interrupt routing.
❑ _BBN to obtain a bus number.
❑ _UID to match with UEFI device path.
❑ _SEG if it has a non-zero PCI Segment Group number.
❑ _STA if hot plug is supported.
❑ _MAT if hot plug is supported.
Firmware is required to configure all PCI-to-PCI Bridges in the hierarchy leading to boot and
console devices. Firmware may optionally configure all PCI-to-PCI Bridges in the system. When
configuring a PCI-to-PCI Bridge, Firmware must set it to safe mode. This includes:
❑ Programming and enabling resources such as: I/O Port, Memory addresses, VGA routing, bus
number, etc.
❑ Enabling detection of parity and system errors.
❑ If applicable, program cache_line, latency timer, and other registers as required by the PCI
Specifications.

-- 35 of 122 --

UEFI PCI SERVICES
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 36
❑ If applicable7, disable Discard SERR# Enable. The Discard Timer SERR# Enable bit in the
Bridge Control Register controls whether the timer waiting for the completion of a delayed
transaction generates an SERR (value=1) or simply discards the transaction (value=0) on a time-
out. The value of 1 is generally required when peer-to-peer transactions are allowed to and from
cards under that bridge. Allowing peer-to-peer transactions is operating system policy and may
not be supported on all platforms. Therefore, the bit should be set to 0 when firmware hands
off to the operating system, and any changes to the setting to support peer-to-peer under the
PCI-to-PCI Bridges should be made by the operating system.
The operating system may provide software to configure PCI-to-PCI bridges for optimum
performance.
All slots with an open MRL must be disabled and their Power Indicators must be turned off. All
occupied slots with MRL closed must be enabled and their Power Indicators must be turned on.
The slot power state for unoccupied slots with MRL closed is implementation dependent and their
Power Indicators must reflect the slot power state.
Firmware must deassert RST# for all occupied PCI slots below the Host Bridge. Firmware must
observe required wait times such as Trhfa (RST# High to First configuration Access) after taking a
bus out of reset. Firmware only needs to delay once for all PCI bus controllers before handing
control to the operating system. This allows the operating system to successively walk PCI buses
without having to successively delay (post reset quiesce period, 1 second) for each bus.
PCI-to-PCI Bridges have RST# asserted by default for the secondary bus. Firmware is not required
to deassert RST# on secondary buses that are not used for boot and console devices.
UEFI drivers and applications must not change BAR assignments. The PCI BARs and the
configuration of any PCI-to-PCI bridge controllers belong to the firmware component that
configured the PCI Bus prior to the execution of the device driver.
The operating system must not assume that all devices have been configured. Per Section 2.5.6 of
UEFI (Revision.2.8): ”The presence of a UEFI driver in the system firmware or in an option ROM
does not guarantee that the UEFI driver will be loaded, executed, or allowed to manage any devices
in a platform.” In addition, UEFI drivers are not involved during PCI hot plug.
Note: The operating system does not have to walk all buses during boot. The kernel can
automatically configure devices on request; i.e., an event can cause a scan of I/O on demand.
The operating system can determine if the device’s BARs have been configured by firmware by
checking the I/O Enable, and Memory Enable bits in the device’s command register, and
Expansion ROM BAR enable bit. If the enable bit is set, then the corresponding resource has been
configured. If the enable bit is not set, the operating system cannot assume that the associated BAR
register contains valid information.
The address that a processor uses to access a device is not necessarily the same as the address stored
in the device’s BAR. The translation (_TRA, _TTP, and _TRS) information is not available to the
operating system until after the operating system brings up the ACPI interpreter. The operating
system must wait until after the ACPI interpreter is up to determine the address at the processor
side associated with the BAR registers configured by firmware. Before re-enabling a resource, the
operating system must reprogram the BAR register using a value that falls within the range reported
7 For example, does not apply to PCI Express.

-- 36 of 122 --

UEFI PCI SERVICES
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 37
in the _CRS descriptor of the parent Host Bridge. The operating system must ensure that the
address range is not used by any other device below that Host Bridge.
Operating systems must not configure devices with resources outside what is reported by the Host
Bridge _CRS. Firmware reports the address ranges that are routed to that particular Host Bridge.
There is no guarantee that devices under that bridge will respond to other address ranges.
The Expansion ROM BAR (at 30h) is normally not enabled at the firmware handoff to the
operating system and the operating system must assume that the BAR content is invalid. For some
devices, when the Expansion ROM BARs are enabled, the device’s other BARs are disabled. PCI
specifies that a device may share decoders between the Expansion ROM BAR and other BARs, and
that device independent software must not access the other BARs when the Expansion ROM BAR
is enabled. Firmware may leave the Expansion ROM BARs enabled if it happens to know that the
device does not share address decoders. This could be firmware based on the Device ID or
firmware that is shipped in the card itself. The device independent operating system software must
disable the Expansion ROM when accessing the device via the other BARs. If the operating system
wants to use the Expansion ROM, it must “take turns” enabling the Expansion ROM BAR, using
the ROM, then disabling the BAR again before resuming access to the card via its other BARs. In
other words, the operating system must not assume that the card has dual decoders. The operating
system is not prohibited from accessing all the card’s resources if it knows that the card has dual
decoders and that the Expansion ROM BAR content is correct.

-- 37 of 122 --

PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 38
4. PCI Services in ACPI
The Advanced Configuration and Power Interface (ACPI) Specification describes a set of common
firmware interfaces that enable robust operating system-directed platform device configuration and
power management of both individual devices and the entire system. ACPI uses tables to describe
system information, features, and methods for controlling those features.
The following sections provide an overview of ACPI interfaces that are relevant to platforms that
support PCI hierarchies consisting of Conventional PCI, PCI-X, and PCI Express.
4.1. Enhanced Configuration Access Method Base
Address
On PC-compatible systems, the enhanced configuration access mechanism allows PCI configuration
space to be accessed using memory primitives rather than I/O-based primitives (CF8/CFC
mechanism). For PCI Express and PCI-X Mode 2 hierarchies on these systems, the memory
mapped configuration access mechanism is the only way to access the extended configuration space
(offsets 256-4095).
This section defines an ACPI-based mechanisms to communicate the memory mapped
configuration space base address(es) used for Enhanced Configuration Access Mechanism (defined
in PCI-X and PCI Express Local Bus Specifications) to the operating system:
❑ MCFG: An ACPI table-based mechanism that is used to communicate the memory mapped
configuration space base addresses corresponding to the (non-hot removable) PCI Segment
Groups and/or base address ranges within a PCI Segment Group available to the system at
boot. The memory mapped configuration space address ranges described exclusively through the
table mechanism are considered to be non-relocatable and non-hot removable for the current
boot.
❑ _CBA: An ACPI method that is used to report the Enhanced Configuration Access base
address for any PCI Segment Groups and/or base address ranges within a PCI Segment group.
This allows run-time update for the hot added PCI components.
The MCFG table is only used to communicate the base addresses corresponding to the non-hot
removable PCI Segment Groups available to the system at boot. The _CBA method enables the
system to describe the base address of the memory mapped configuration space for hot plug capable
PCI Segment Groups.
4

-- 38 of 122 --

PCI SERVICES IN ACPI
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 39
4.1.1. Background
The PCI Express and PCI-X Specifications define the Enhanced Configuration Access Mechanism
for the PC-compatible systems, which allows access to the configuration registers via memory
mapped address space. The base address of this memory mapped configuration space is platform
specific and is communicated to the operating system via system firmware.
In a hierarchy that supports the enhanced configuration access mechanism, the first 256 bytes
(offsets 0-255) of PCI 2.3 compatible configuration space can be accessed by either the PCI 2.3
configuration mechanism (CF8/CFC) or using the enhanced configuration mechanism. The
extended register configuration space (region from offset 256-4095) can be accessed only via the
enhanced configuration mechanism for PCI Express devices and Mode 2 PCI-X devices on the PC-
compatible systems.
Table 4-1: Memory Address PCI Express Configuration Space
Memory Address PCI PCI-X Mode 1 PCI-X Mode 2 PCI Express
A[(20+n):20] Bus[n:0],
where n=0 to 7
Applies Applies Applies Applies
A[19:15] Device[4:0] Applies Applies Applies Applies
A[14:12] Function[2:0] Applies Applies Applies Applies
A[11:8] Extended
Register[3:0]
N/A N/A Applies Applies
A[7:0] Register[7:0] Applies Applies Applies Applies
The 256-MiB window of memory mapped configuration space (assuming maximum addressable
4 KiB per function, eight functions per device, 32 devices per bus) defined by PCI-X and PCI
Express is capable of describing the entire 256 bus PCI Segment Group as shown in Figure 4-1.
Figure 4-1: 256-MiB Region for Enhanced Configuration Space Access Mechanism
The Enhanced Configuration Access Mechanism can be applied to access heterogeneous hierarchies
consisting of PCI/PCI-X/PCI Express. In this case, the extended configuration space up to a limit
of 4 KiB per device-function is accessible for PCI Express devices and PCI-X Mode 2 devices.

-- 39 of 122 --

PCI SERVICES IN ACPI
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 40
For non-Mode 2 PCI-X and all PCI devices, only the first 256 bytes of configuration space are
accessible.
Note that a given chipset implementation may choose to implement less than 256 MiB for the
memory mapped configuration space. Further, implementations with multiple host bridges or
mixed hierarchies (for example, a multi-chip implementation with PCI Express as well as PCI-X at
the root level) are allowed to implement the memory mapped configuration space in a discontinuous
fashion; that is, the 256 PCI buses could be distributed across multiple host bridges in a non-
overlapping fashion.
Note that in a multiple host bridge hierarchy, there is no requirement for the host bridges to
program the buses within a PCI Segment Group or Groups in a contiguous fashion.
4.1.2. MCFG Table Description
The MCFG table is an ACPI table that is used to communicate the base addresses corresponding to
the non-hot removable PCI Segment Groups range within a PCI Segment Group available to the
operating system at boot. This is required for the PC-compatible systems.
The MCFG table is only used to communicate the base addresses corresponding to the PCI
Segment Groups available to the system at boot. This table directly refers to PCI Segment Groups
defined in the system via the _SEG object in the ACPI namespace for the applicable host bridge
device. For systems containing only a single PCI Segment Group, the default PCI Segment Group
number, namely, PCI Segment Group 0, is implied. In such a case, the default PCI Segment Group
need not be represented in the ACPI namespace (i.e., no _SEG method is required in such a
hierarchy).
The size of the memory mapped configuration region is indicated by the start and end bus number
fields in the Memory mapped Enhanced configuration space base address allocation structure as
shown in Table 4-3. 0-255 is the range of allowed bus numbers supported for a given PCI Segment
Group.
Table 4-2 provides a description of the MCFG table.

-- 40 of 122 --

PCI SERVICES IN ACPI
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 41
Table 4-2: MCFG Table to Support Enhanced Configuration Space Access
Field Byte
Length
Byte
Offset
Description
Header
Signature 4 0 “MCFG”. Signature for the Memory mapped
configuration space base address Description
Table. (refer to Note 1)
Length 4 4 Length, in bytes, of the entire MCFG Description
table including the memory mapped configuration
space base address allocation structures.
Revision 1 8 1
Checksum 1 9 Entire table must sum to zero
OEMID 6 10 OEM ID
OEM Table ID 8 16 For the MCFG Description Table, the table ID is
the manufacture model ID
OEM Revision 4 24 OEM revision of MCFG table for supplied OEM
Table ID
Creator ID 4 28 Vendor ID of utility that created the table
Creator Revision 4 32 Revision of utility that created the table
Reserved 8 36 Reserved
Configuration space
base address
allocation structure [n]
--- 44 A list of the memory mapped configuration base
address allocation structures. This list will
contain at least one entry corresponding to each
PCI Segment Group present in the platform. The
structure of this entry is defined in Table 4-3.
Notes:
1. A table signature “MCFG” is reserved for this purpose and the header for the table is shown in Table 4-2.
Based on the signature and table revision, the operating system can then interpret the implementation-
specific data within the table. The Table Revision for revision 1.0 of the MCFG table is set to 1.
2. If the operating system does not natively comprehend reserving the MMCFG region, the MMCFG region
must be reserved by firmware. The address range reported in the MCFG table or by _CBA method (see
Section 4.1.3) must be reserved by declaring a motherboard resource. For most systems, the motherboard
resource would appear at the root of the ACPI namespace (under \_SB) in a node with a _HID of EISAID
(PNP0C02), and the resources in this case should not be claimed in the root PCI bus’s _CRS. The
resources can optionally be returned in Int15 E820h or EFIGetMemoryMap as reserved memory but must
always be reported through ACPI as a motherboard resource.
3. This table must not include the memory mapped configuration base addresses for hot pluggable PCI
Segment Groups. Such PCI Segment Groups must be described by using the _CBA method (see
Section 4.1.3) in the corresponding ACPI namespace object.

-- 41 of 122 --

PCI SERVICES IN ACPI
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 42
The structure in Table 4-3 describes the association between the PCI Segment Group and the
corresponding memory mapped configuration base address. This table describes the details of this
structure.
Table 4-3: Memory Mapped Enhanced Configuration Space Base Address Allocation
Structure
Field Byte
Length
Byte
Offset
Description
Base Address 8 0 Processor-relative Base Address for the
Enhanced Configuration Access Mechanism
PCI Segment Group
Number
2 8 PCI Segment Group Number. Default is 0. For
all other PCI Segment Groups, this field value
should correspond to the value returned by _SEG
object in ACPI namespace for the applicable host
bridge device.
Start Bus Number 1 10 Start PCI Bus number decoded by the host
bridge
End Bus Number 1 11 End PCI Bus number decoded by the host bridge
Reserved 4 12 Reserved
The MCFG table format allows for more than one memory mapped base address entry (instance of
Table 4-3) provided each entry (memory mapped configuration space base address allocation
structure) corresponds to a unique PCI Segment Group consisting of 256 PCI buses. Multiple
entries corresponding to a single PCI Segment Group are also allowed provided the Field (PCI
Segment Group Number, Start Bus Number, and End Bus Number) uniquely identifies each PCI
Host Bridge and the bus number values do not overlap.
❑ The PCI Segment Group Number field denotes the PCI Segment Group corresponding to the
base address field in the structure. For systems supporting multiple PCI Segment Groups, this
field should correspond to the value returned by _SEG object in ACPI namespace for the
applicable host bridge device. If the system only contains a single (default) PCI Segment Group,
namely, PCI Segment Group 0, no corresponding _SEG object is required.
❑ The base address field provides the 64-bit physical address of the base of the memory mapped
configuration space associated with the PCI Segment Group. It is the responsibility of the
provider of the table to ensure that the base address reported is consistent with the requirements
for the hardware implementation. For PCI-X and PCI Express platforms utilizing the enhanced
configuration access method, the base address of the memory mapped configuration space
always corresponds to bus number 0 (regardless of the start bus number decoded by the host
bridge) and further must comply with alignment requirements of the corresponding local bus
specification. The unsupported upper bits of the physical address must be set to 0.

-- 42 of 122 --

PCI SERVICES IN ACPI
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 43
4.1.3. The _CBA Method
Some systems may support hot plug of host bridges that introduce either a range of buses within an
existing PCI Segment Group or introduce a new PCI Segment Group. For example, each I/O chip
in a multi-chip PCI Express root complex implementation could start a new PCI Segment Group.
The base address of the memory mapped configuration space for such a hot pluggable PCI Segment
Group or a range of buses within a PCI Segment Group is described using an ACPI control
method, _CBA, that is under the host bridge devices that are part of the PCI Segment Group. This
applies to PC-compatible systems only.
The _CBA (Memory mapped Configuration Base Address) control method is an optional ACPI
object that returns the 64-bit memory mapped configuration base address for the hot plug capable
host bridge. The base address returned by _CBA is processor-relative address. The _CBA control
method evaluates to an Integer.
This control method appears under a host bridge object. When the _CBA method appears under an
active host bridge object, the operating system evaluates this structure to identify the memory
mapped configuration base address corresponding to the bus number range specified in _CRS
method. Within the same PCI Segment Group, different host bridges, each with its associated bus
number range, may have a different configuration base address. An ACPI namespace object that
contains the _CBA method must also contain a corresponding _SEG method.
For a host bridge that includes _CBA, the _CBA and _BBN control methods have to be executed
first to enable PCI_Config_OpRegion access for devices below the bridge. As a result, the _CBA
and _BBN methods must not include PCI_Config opregions that refer to devices below the host
bridge.
A set of hot pluggable host bridges could have _CBA under each of the host bridge devices, where
each host bridge device is typically described in the ACPI namespace with PNP0A08 for _HID and
PNP0A03 for _CID. In this case, the memory mapped configuration base address (always
corresponds to bus number 0 of a given bus number range) is provided by _CBA and the bus
number range covered by the base address is indicated by the corresponding bus number range
specified in _CRS.
If rebalancing of resources on a host bridge is supported via _PRS, _SRS, it is the responsibility of
the operating system to reevaluate _CBA every time _CRS is evaluated.
Memory mapped configuration base addresses for non-hot pluggable host bridges must be described
using MCFG table.
_CBA Control Method
Arguments:
None
Result Code:
Memory mapped configuration base address for the PCI-compatible host bridge returned as an
integer
Note: Starting with ACPI 2.0, integers are 64-bit entities.

-- 43 of 122 --

PCI SERVICES IN ACPI
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 44
Example ASL for _CBA usage:
Scope(\_SB) {
…
Device(PCI1) { // Root PCI Bus
Name(_HID, EISAID("PNP0A03")) // Need _HID for root device
Name(_SEG, 1) // PCI Segment Group 1
Method (_CRS, ResourceTemplate()
{
…
}
Method(_CBA, 0) {
// Bits 63:0 of the base address
Return (0xE000000000000000)
} // end of _CBA method
} // end PCI1
} // end scope SB
4.1.4. System Software Implication of MCFG and _CBA
The base address returned by MCFG table for a given bus number range is always with respect to
bus 0 of that particular bus number range as specified in the PCI Express Base Specification (and the
PCI-X Specification). It is the responsibility of system software to calculate the start and end of the
supported memory mapped configuration address range based on the start and end bus numbers
specified in the MCFG entry. System software must make no assumptions about the memory range
corresponding to the base address up to the start of the memory mapped configuration space (as
specified by start bus number).
The base address returned by _CBA for a given PCI Segment Group is always with respect to bus 0
as specified in the PCI Express Base Specification (and the PCI-X Specification). It is the responsibility of
system software to calculate the start and end of the supported memory mapped configuration
address range for the host bridge based on the bus range supported by the host bridge as identified
by _CRS.

-- 44 of 122 --

PCI SERVICES IN ACPI
PCI FIRMWARE SPECIFICATION
REVISION 3.3
JANUARY 20, 2021 45
IMPLEMENTATION NOTE
Multiple Host Bridges
A platform may have multiple PCI Express or PCI-X host bridges. The base address for the
MMCONFIG space for these host bridges may need to be allocated at different locations.
Historically, in such cases, using MCFG table and _CBA method as defined in this section means
that each of these host bridges must be in its own PCI Segment Group. This approach is referred
to as the legacy interpretation of this specification. A newer interpretation of this specification allows
“multiple host bridges with base addresses allocated at different locations” to exist within the same
PCI Segment Group. Vendors who choose to implement to the newer interpretation bear the
responsibility that supported operating systems can handle the newer inter
