# EM Group - NetSuite Approval Workflow Requirements BRD

Project: EMG008 - Netsuite Approval workflow requirements (https://www.notion.so/EMG008-Netsuite-Approval-workflow-requirements-208b4c9eecc981578be6f1733d61a6ff?pvs=21)
Status: Final
Title: EMG008 - NetSuite Approval Workflow Requirements
Type: BRD
Version: 1

# EMG008 - NetSuite Approval Workflow Requirements

Business Requirements Document for implementing automated approval workflows for Purchase Orders and Accounts Payable Bills in NetSuite.

# Executive Summary

## Project Overview

EM Group requires the implementation of automated approval workflows for Purchase Orders (PO) and Accounts Payable (AP) Bills within NetSuite. This project will streamline approval processes, enforce spending controls based on configurable thresholds, enable delegation capabilities, and maintain comprehensive audit trails. The solution will replace manual email-based approvals with systematic, trackable workflows that adapt to the organization's structure and policies.

## Current Challenges

• Manual Approval Processes: Currently relying on email-based approvals with no systematic tracking or automation
• No Delegation Functionality: Approvals are delayed when designated approvers are unavailable, with no formal delegation system
• Lack of Automated Routing: No intelligent routing based on amount thresholds or organizational hierarchy
• Limited Visibility: No centralized dashboard or real-time visibility into approval status and bottlenecks
• Inconsistent Processes: Different departments follow varying approval procedures without standardization
• No Audit Trail: Limited or no historical tracking of approval decisions and justifications

## Expected Outcomes

• Automated Approval Routing: Intelligent workflow routing based on configurable thresholds and organizational rules
• Configurable Thresholds: Administrator-managed approval limits that can be adjusted without code changes
• Delegate Capabilities: Formal delegation system allowing temporary or permanent approval authority transfers
• Comprehensive Audit Trails: Complete history of all approval actions, including delegated approvals
• Improved Efficiency: Reduced approval cycle times through automation and clear accountability
• Enhanced Compliance: Consistent enforcement of approval policies across the organization

# Current State Analysis

## Current Process Flow

The current approval process operates through informal email communications:
1. Employee creates a Purchase Order or enters an AP Bill in NetSuite
2. Manual email sent to approver(s) with transaction details
3. Approver responds via email with approval or rejection
4. Employee manually updates transaction status
5. No systematic tracking of approval history or pending items
6. Process varies significantly between departments

## Known Limitations

• No Automated Routing: Employees must manually identify and contact appropriate approvers
• No Delegation System: When approvers are unavailable, no formal process exists for delegation
• Inconsistent Approval Processes: Each department follows different procedures without standardization
• Lack of Approval History: No systematic recording of who approved what and when
• Manual Status Tracking: Users must manually track approval status through email threads
• No Threshold Enforcement: Amount-based approval requirements are not systematically enforced
• Limited Reporting: No ability to analyze approval metrics or identify bottlenecks

# Detailed Requirements

## Functional Requirements

The following user stories define the functional requirements for the NetSuite Approval Workflow system:

| **Story ID** | **As a…** | **I want to…** | **So that…** | **Acceptance Criteria** |
| --- | --- | --- | --- | --- |
| FR1 | PO Creator | POs under $2,500 to be automatically approved | small purchases don't require manual approval | • POs < $2,500 are auto-approved upon creation
• Approval status set to "Approved"
• No approver assignment required
• History logs auto-approval |
| FR2 | COO | skip my own approval when I create POs | the process moves directly to the next approver | • System detects when COO creates PO
• COO approval step bypassed
• Routes directly to CFO for mid-tier
• Routes to CFO then CEO for high-tier |
| FR3 | Approver | delegate my approval authority | approvals aren't delayed when I'm unavailable | • Can assign delegate with start/end dates
• Delegate receives approval notifications
• System tracks delegated approvals
• Can set indefinite delegations |
| FR4 | Department Manager | bills routed to appropriate tier approvers based on amount | proper controls are maintained | • Tier 1: < $2,500 to dept approver 1
• Tier 2: $2,500-$9,999.99 to approver 2
• Tier 3: $10,000+ to approver 3
• Department field required on bills |
| FR5 | Administrator | configure approval thresholds and approvers | the system can adapt to organizational changes | • Admin interface for threshold management
• Assign approvers by role/department
• Changes take effect immediately
• No code changes required |
| FR6 | Finance Manager | see approval history for all transactions | we maintain proper audit trails | • Complete approval history per transaction
• Shows original and delegate approvers
• Timestamps for all actions
• Rejection reasons captured |
| FR7 | Approver | receive consolidated approval notifications | I'm not overwhelmed with individual emails | • Daily digest of pending approvals
• Summary by transaction type
• Direct links to approve/reject
• Configurable notification frequency |
| FR8 | PO Creator | revise and resubmit rejected POs | corrections can be made without starting over | • Rejected POs can be edited
• Resubmission restarts approval flow
• Original rejection reason visible
• History tracks all iterations |

# Proposed Solution

The proposed solution leverages NetSuite's native workflow capabilities enhanced with custom SuiteScript components to deliver a comprehensive approval automation system:

**Technical Architecture:**

1. NetSuite Workflows
- PO Company Role Approval Workflow: Handles role-based routing for Purchase Orders with intelligent skip logic
- AP Bill Department Approval Workflow: Manages department-based three-tier approval structure
- State Management: Clear workflow states for Pending, Approved, and Rejected statuses

2. Custom Configuration Interface
- Administrator Suitelet: Multi-tab interface for managing all configuration aspects
- Approver Configuration: Assign approvers by role (COO, CFO, CEO) or department tiers
- Threshold Management: Configurable amount limits without code modifications
- Delegate Management: Interface for setting up temporary or permanent delegations

3. Delegate System with Automation
- Map/Reduce Script: Processes delegate assignments every 3 hours for optimal performance
- Real-time Updates: User Event scripts for immediate delegate activation
- Dual Processing: Separate handling of new delegations and expiration management
- Workflow Integration: Seamless checking of delegates during approval routing

4. Reporting and Analytics
- Approval Dashboard: Real-time visibility into pending approvals and bottlenecks
- SLA Monitoring: Track approval turnaround times and identify delays
- Audit Reports: Comprehensive approval history with delegate tracking
- Saved Searches: Pre-built searches for common approval queries

5. Notification System
- Email Digest: Daily consolidated notifications to prevent inbox flooding
- Smart Reminders: Escalation for overdue approvals
- Configurable Frequency: Users can adjust notification preferences
- Mobile-Friendly: Notifications optimized for mobile approval actions