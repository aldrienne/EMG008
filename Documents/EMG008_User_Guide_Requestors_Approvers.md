# EMG008 - NetSuite Approval Workflow System User Guide

**Table of Contents**

## Overview

The EMG008 NetSuite Approval Workflow System implements a comprehensive multi-tiered approval process for purchase orders and vendor bills. The system uses different approval structures for each transaction type:
- **Purchase Orders**: Role-based approval (COO/CFO/CEO) based purely on transaction amount
- **Vendor Bills**: Tier-based approval (Tier 1/2/3) based on transaction amount AND department (each department has its own Tier 1/2/3 approvers)

### System Requirements

- NetSuite access with appropriate role permissions
- Access to Purchase Order and Vendor Bill transactions
- Email access for approval notifications
- Appropriate permissions to view approval workflow fields

### Key Features

- **Multi-tiered approval workflow** for purchase orders and vendor bills
- **Transaction type-based routing** with amount-based approval hierarchies within each workflow
- **Amount-based role approvals** (COO, CFO, CEO) for Purchase Orders
- **Department + amount-based tier approvals** (Tier 1, 2, 3) for Vendor Bills
- **Self-service delegation management** with date-based activation
- **Automated email notifications** for pending approvals
- **Complete audit trail** tracking all approval actions
- **Delegate action tracking** for compliance and accountability

## Process Flow

The approval workflow follows a transaction type-based architecture:

1. **Purchase Order Workflow** (`customworkflow_tsc_wf_company_role`) - "TSC|WF|Company Role Approval" - Handles **Purchase Order** approvals with role-based hierarchy (COO/CFO/CEO) based purely on transaction amount
2. **Vendor Bill Workflow** (`customworkflow_tsc_wf_department`) - "TSC|WF|Company Department Approval" - Handles **Vendor Bill** approvals with department-specific tier-based hierarchy (each department has its own Tier 1, 2, 3 approvers)

**Key Routing Differences:**
- **Purchase Orders**: Amount-based routing to company-wide role approvers (COO → CFO → CEO)
- **Vendor Bills**: Department + amount-based routing to department-specific tier approvers (e.g., Finance Dept Tier 1, IT Dept Tier 2, etc.)

## Components

The system includes several key NetSuite components:

1. **Custom Records:**
   - Approver Configuration (`customrecord_tsc_approver_config`)
   - Approval Thresholds (`customrecord_tsc_approval_thresholds`)
   - Delegate Approvers (`customrecord_tsc_delegate_approvers`)
   - Approval History (`customrecord_tsc_approval_history`)

2. **Workflow Actions:**
   - Retrieve Approvers (`tsc_wa_emg008_retrieve_approvers.js`)
   - Email notification scripts

3. **User Interfaces:**
   - Approver Configuration UI (`tsc_sl_emg008_approver_config.js`)
   - Self-Service Delegation (`tsc_sl_self_delegate.js`)

## For Requestors

### Creating Purchase Orders and Vendor Bills

**How the approval process works:**

1. **Transaction Creation**
   - Create your purchase order or vendor bill as normal
   - The system automatically calculates the total amount
   - Upon save, the workflow determines the appropriate approval path

2. **Automatic Routing**
   - Based on the transaction type, the system routes as follows:
     - **Purchase Orders** → Purchase Order Workflow → Company-wide role approvers (COO/CFO/CEO) based on amount
     - **Vendor Bills** → Vendor Bill Workflow → Department-specific tier approvers (Tier 1/2/3) based on department and amount

3. **Approval Status Tracking**
   - Check custom fields on your transaction to track approval status:
     - `custbody_tsc_approval_status` - Current approval state
     - `custbody_tsc_current_approver` - Who needs to approve next
     - `custbody_tsc_delegate_approver` - If a delegate is handling the approval

4. **Transaction States**
   - **Pending Approval** - Waiting for approver action
   - **Approved** - Transaction has been approved and can proceed
   - **Rejected** - Transaction was rejected and requires revision
   - **Delegated** - Approval is handled by a designated delegate

### Understanding Approval Requirements

**Purchase Orders:**
- Automatically routes through Purchase Order Workflow (company-wide COO/CFO/CEO hierarchy)
- System checks transaction amount against configured approval thresholds for each role
- Uses company-wide role approvers regardless of department
- Approval required before purchase order can be converted to receipt
- Escalates through role hierarchy based on amount limits (COO → CFO → CEO)

**Vendor Bills:**
- Automatically routes through Vendor Bill Workflow (department-specific Tier 1/2/3 hierarchy)  
- System first identifies the department, then checks transaction amount against that department's approval thresholds
- Each department has its own set of Tier 1/2/3 approvers
- Approval required before bill can be paid
- Escalates through the department's tier hierarchy based on amount limits
- System validates against purchase order (if linked)

### What Happens After Submission

1. **Immediate Actions:**
   - Transaction status changes to "Pending Approval"
   - Approval workflow is triggered automatically
   - Email notification sent to designated approver

2. **Approver Actions:**
   - Approver receives email notification with transaction details
   - Approver can approve, reject, or delegate the approval
   - System tracks all actions in approval history

3. **Completion:**
   - Upon approval, transaction proceeds to next step in business process
   - If rejected, transaction returns to requestor with rejection comments
   - Complete audit trail maintained for compliance

## For Approvers

### Accessing Pending Approvals

**Finding Your Pending Approvals:**

1. **Email Notifications**
   - You will receive automated email alerts for pending approvals
   - Emails include transaction details and direct links (where applicable)
   - Email frequency and recipients are configurable by administrators

2. **NetSuite Dashboard**
   - Navigate to your NetSuite dashboard
   - Look for approval-related saved searches or reports
   - Filter by transactions assigned to you for approval

3. **Transaction Records**
   - Open the specific purchase order or vendor bill
   - Check the approval status fields to see current state
   - Review transaction details before making approval decision

### How to Approve or Reject Transactions

**Approval Process:**

1. **Review Transaction Details**
   - Verify transaction amount and details
   - Check department and business justification
   - Ensure compliance with company policies

2. **Make Approval Decision**
   - Navigate to the workflow action area on the transaction
   - Select **Approve** or **Reject**
   - Add comments explaining your decision (especially for rejections)

3. **Submit Decision**
   - Save the transaction to execute your approval decision
   - System automatically updates approval status
   - Email notifications sent to relevant parties

**Rejection Handling:**
- Provide clear comments explaining rejection reason
- Transaction returns to requestor for revision
- Approval process restarts after requestor makes necessary changes

### Understanding Your Approval Limits

**Approval Thresholds:**

The system maintains configurable approval limits based on:
- **Your Role/Tier** (COO/CFO/CEO for POs, Tier 1/2/3 for VBs)
- **Transaction Amount** 
- **Transaction Type** (Purchase Order or Vendor Bill)
- **Department** (for Vendor Bills only - each department has separate tier approvers)

**Key Approval Rules:**
- **Purchase Orders**: Transactions within your role limit require only your approval (company-wide COO/CFO/CEO)
- **Vendor Bills**: Transactions within your tier limit for your specific department require only your approval
- **Purchase Orders**: Escalate through role hierarchy (COO → CFO → CEO) based on amount limits
- **Vendor Bills**: Escalate through tier hierarchy (Tier 1 → Tier 2 → Tier 3) within same department
- CEO (for POs) and Tier 3 (for VBs) typically have unlimited approval authority within their scope
- System prevents approval of transactions exceeding your authorized limit

### Setting Up Email Notifications

**Configuring Your Email Preferences:**

1. **Default Notifications**
   - System sends emails to your NetSuite user email address
   - Notifications include pending approvals requiring your attention
   - Automatic reminders for overdue approvals

2. **Email Content**
   - Transaction details (type, amount, requestor)
   - Direct links to transaction records (where possible)
   - Approval deadline information
   - Instructions for approval actions

## Delegation Management

### How to Assign a Delegate

**Self-Service Delegation Setup:**

1. **Access Delegation Interface**
   - Navigate to the Self-Service Delegation page
   - This is available through the custom Suitelet: `tsc_sl_self_delegate.js`

2. **Configure Delegation**
   - **Select Delegate** - Choose the person who will approve on your behalf
   - **Set Date Range** - Define when delegation is active
     - Start Date: When delegation begins
     - End Date: When delegation expires (optional)
   - **Approval Scope** - Define what the delegate can approve

3. **Activation and Management**
   - Delegation becomes active on the specified start date
   - You can modify or cancel delegation at any time
   - System maintains complete audit trail of delegate actions

### Date-Based Delegation Activation

**Automatic Delegation:**
- Delegation automatically activates on the specified start date
- No manual intervention required once configured
- System routes approvals to delegate during active period

**Delegation Expiration:**
- If end date specified, delegation automatically expires
- Approvals revert to original approver after expiration
- Email notifications sent to both parties about delegation status changes

### Delegate Approval Tracking

**Audit Trail:**
- All delegate approvals are tracked in the approval history
- System records both the delegate and original approver
- Complete transparency for compliance requirements

**Notifications:**
- Original approver receives notification when delegate takes action
- Delegate receives standard approval notifications
- Both parties notified of delegation activation/expiration

## Common Scenarios

**Note:** The dollar amounts used in these scenarios are examples only. Actual approval thresholds are configurable by administrators and may vary based on your organization's settings.

### Purchase Order Approval Flow

**Scenario 1: COO Approval (Within Limit)**
1. Employee creates purchase order for $15,000
2. System routes to Purchase Order Workflow
3. COO receives approval notification (limit: $25,000)
4. COO reviews and approves
5. Purchase order status changes to "Approved"
6. Employee can proceed with purchase

**Scenario 2: CFO Approval Required**
1. Department head creates purchase order for $35,000
2. Amount exceeds COO limit ($25,000)
3. System escalates to CFO for approval (limit: $50,000)
4. CFO receives approval notification
5. CFO approves, purchase order proceeds

**Scenario 3: CEO Approval Required**
1. Purchase order created for $75,000
2. Exceeds CFO limit ($50,000)
3. System escalates to CEO for final approval
4. CEO has unlimited approval authority
5. Upon CEO approval, purchase order is fully approved

### Vendor Bill Approval Flow

**Scenario 1: Finance Department Tier 1 Approval**
1. Finance department vendor bill entered for $3,000
2. System routes to Vendor Bill Workflow
3. Finance Dept Tier 1 approver receives notification (limit: $5,000)
4. Finance Dept Tier 1 approver reviews and approves
5. Bill can be scheduled for payment

**Scenario 2: IT Department Tier 2 Approval Required**
1. IT department vendor bill entered for $8,000
2. Amount exceeds IT Dept Tier 1 limit ($5,000)
3. System escalates to IT Dept Tier 2 approver (limit: $15,000)
4. IT Dept Tier 2 approver reviews and approves
5. Bill proceeds for payment processing

**Scenario 3: Marketing Department Tier 3 Approval Required**
1. Marketing department vendor bill entered for $20,000
2. Amount exceeds Marketing Dept Tier 2 limit ($15,000)
3. System escalates to Marketing Dept Tier 3 approver (unlimited authority)
4. Marketing Dept Tier 3 approver provides final approval
5. Bill approved for payment

**Three-Way Matching:**
- System can enforce three-way matching (PO, Receipt, Bill)
- Approval required for any variances
- Routes through Vendor Bill Workflow regardless of variance
- Complete audit trail maintained

### Escalation Scenarios

**Automatic Escalation:**
- If approver doesn't respond within configured timeframe
- System can automatically escalate to next approval level
- Email notifications sent to all relevant parties

**Manual Escalation:**
- Approvers can manually escalate if outside their authority
- Comments required explaining escalation reason
- System maintains chain of escalation in audit trail

### Handling Rejections

**When Transaction is Rejected:**
1. Requestor receives email notification with rejection reason
2. Transaction status changes to "Rejected"
3. Requestor must revise transaction based on feedback
4. Upon resubmission, approval process restarts

**Best Practices for Rejections:**
- Provide clear, specific comments explaining rejection
- Include guidance on what changes are needed
- Reference company policies where applicable

## Troubleshooting

### Common Issues and Resolutions

**Issue: Not receiving email notifications**
- **Check:** Your NetSuite user email address is correct
- **Check:** Email preferences in NetSuite settings
- **Contact:** System administrator to verify email configuration

**Issue: Cannot approve transaction (exceeds limit)**
- **Cause:** Transaction amount exceeds your approval authority
- **Resolution:** Transaction must be escalated to higher approval tier
- **Action:** Add comments explaining need for escalation

**Issue: Delegation not working**
- **Check:** Delegation dates are correctly configured
- **Check:** Delegate has appropriate NetSuite access
- **Verify:** Delegation is active for current date range

**Issue: Approval workflow not triggering**
- **Check:** Transaction meets minimum threshold for approval
- **Verify:** Appropriate workflow is enabled
- **Contact:** Administrator to review workflow configuration

**Issue: Cannot find pending approvals**
- **Check:** Use saved searches configured for approvals
- **Verify:** You have appropriate role permissions
- **Review:** Email notifications for approval requests

### Contact Information for Support

**Technical Support:**
- **System Administrator:** [Contact details to be configured]
- **IT Helpdesk:** [Contact details to be configured]

**Process Questions:**
- **Finance Team:** [Contact details to be configured]
- **Department Manager:** [Contact details to be configured]

**Emergency Approvals:**
- **After Hours:** [Emergency contact procedure]
- **Urgent Transactions:** [Escalation process]

---

## Important Notes

- **Audit Compliance:** All approval actions are logged for audit purposes
- **Policy Adherence:** Approvals must comply with company financial policies
- **Data Security:** Approval information is confidential and should not be shared
- **System Updates:** This guide reflects current system configuration and may be updated

**Document Version:** 1.0  
**Last Updated:** [Date to be configured]  
**Next Review:** [Date to be configured]

---

*This user guide covers the core functionality of the EMG008 NetSuite Approval Workflow System. For technical configuration questions or system modifications, please contact your NetSuite administrator.*