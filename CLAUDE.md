# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **EMG008**, a NetSuite SuiteCloud Account Customization Project (ACP) implementing a comprehensive multi-tiered approval workflow system for purchase orders and vendor bills. The system uses different approval structures for each transaction type:
- **Purchase Orders**: Company-wide role-based approvals (Tier 1/Tier 2/Tier 3) based on amount
- **Vendor Bills**: Department-specific tier-based approvals (Tier 1/2/3) based on department and amount

## Development Commands

### SuiteCloud Project Management
```bash
# Import all NetSuite objects from account to local project
./import_all_objects.sh

# Deploy to NetSuite (requires suitecloud CLI)
suitecloud project:deploy

# Import specific object types
suitecloud object:import --type customrecord --scriptid [RECORD_ID] --destinationfolder src/Objects

# Validate project structure
suitecloud project:validate
```

### Utility Scripts
```bash
# Convert workflow XML to CSV for easier review
python workflow_to_csv_converter.py
```

## Core Architecture

### Authentication & Configuration
- **Default Auth ID**: `EMG_SB1` (NetSuite sandbox environment)
- **Source Folder**: `src/` (all NetSuite customizations)
- **Naming Convention**: All custom components prefixed with `tsc_` (The Software Company)

### Key SuiteScript Modules

#### Constants Module (`tsc_cm_constants.js`)
Central AMD module defining all field IDs, record types, and UI constants. Always import this module when working with custom objects:
```javascript
define(['./tsc_cm_constants'], (constants) => {
    // Access via constants.RECORDS.APPROVER_CONFIG.FIELDS.CONFIG_TYPE
});
```

#### Core Business Logic
- **`core/tsc_wa_emg008_retrieve_approvers.js`** - Workflow action that determines appropriate approvers based on transaction amount and business rules
- **`tsc_mr_emg008_delegate_process.js`** - Map/Reduce script for batch processing delegate assignments
- **`email_alerts/`** directory - Email notification system for pending approvals

### Data Model Architecture

#### Custom Records
1. **`customrecord_tsc_approver_config`** - Central configuration for company roles and department tiers
2. **`customrecord_tsc_approval_thresholds`** - Approval amount limits by role/tier
3. **`customrecord_tsc_delegate_approvers`** - Delegate relationship management
4. **`customrecord_tsc_approval_history`** - Complete audit trail of all approval actions

#### Transaction Body Fields
All transaction fields follow `custbody_tsc_` naming pattern and track approval status, delegate assignments, and audit information.

### Workflow Architecture

The system implements **transaction type-based workflow architecture**:
- **Purchase Order Workflow** (`customworkflow_tsc_wf_company_role`) - "TSC|WF|Company Role Approval" - Handles **Purchase Order** approvals with company-wide role-based hierarchy (Tier 1/Tier 2/Tier 3) based purely on amount
- **Vendor Bill Workflow** (`customworkflow_tsc_wf_department`) - "TSC|WF|Company Department Approval" - Handles **Vendor Bill** approvals with department-specific tier-based hierarchy (each department has its own Tier 1, 2, 3 approvers)

**Key Routing Differences:**
- **Purchase Orders**: Amount-based routing to company-wide role approvers (Tier 1/Tier 2/Tier 3)
- **Vendor Bills**: Department + amount-based routing to department-specific tier approvers (Tier 1/2/3)
- Different approval structures: PO workflow uses role-based (Tier 1/Tier 2/Tier 3), VB workflow uses tier-based (1/2/3) with department parameter

## Development Patterns

### SuiteScript 2.1 Standards
- All scripts use `@NApiVersion 2.1`
- AMD module pattern with `define()` for dependencies
- Consistent error handling and logging throughout
- Modular design with reusable components

### Configuration-Driven Approach
The system is highly configurable through custom records rather than hard-coded logic:
- Approval thresholds configurable per role/tier
- Approver assignments managed through UI forms
- Email templates customizable via NetSuite templates

### Self-Service Capabilities
- **Self-Service Delegation** (`tsc_sl_self_delegate.js`) - Allows users to assign delegates
- **Approver Configuration UI** (`tsc_sl_emg008_approver_config.js`) - Administrative interface for managing approval hierarchies

## Key File Locations

### Configuration & Constants
- `src/FileCabinet/SuiteScripts/EMG008/tsc_cm_constants.js` - Central constants definition

### Main User Interfaces  
- `src/FileCabinet/SuiteScripts/EMG008/tsc_sl_emg008_approver_config.js` - Approver management UI
- `src/FileCabinet/SuiteScripts/EMG008/tsc_sl_self_delegate.js` - Self-service delegation

### Core Processing Logic
- `src/FileCabinet/SuiteScripts/EMG008/core/tsc_wa_emg008_retrieve_approvers.js` - Approver determination logic
- `src/FileCabinet/SuiteScripts/EMG008/tsc_mr_emg008_delegate_process.js` - Delegate processing

### Object Definitions
- `src/Objects/` - All NetSuite object definitions (custom records, fields, workflows)

## Project Structure Rules

### Code Organization
- **`/core/`** - Business logic and workflow actions
- **`/email_alerts/`** - Email notification scripts  
- **`/self_delegate/`** - Self-service delegation functionality
- **Root level** - Main UI scripts and configuration

### Field Naming Conventions
- Custom body fields: `custbody_tsc_[purpose]`
- Custom record fields: `custrecord_tsc_[purpose]` or `custrecordtsc_[purpose]`
- Form fields: `custpage_[purpose]`

### Script Type Conventions
- **SL** - Suitelet (user interface)
- **MR** - Map/Reduce (batch processing)
- **UE** - User Event (transaction triggers)
- **WA** - Workflow Action (custom workflow logic)
- **CS** - Client Script (client-side interactions)

## Important Development Notes

### Testing
**No testing framework is currently implemented.** When adding tests, follow the SuiteCloud Unit Testing standards defined in the global CLAUDE.md instructions.

### Deployment Process
1. Modify source files in `src/` directory
2. Test in sandbox environment (`EMG_SB1`)
3. Use `./import_all_objects.sh` to sync any NetSuite-side changes back to local
4. Deploy using SuiteCloud CLI commands

### Business Logic Complexity
The approval workflow involves sophisticated business rules:
- Dynamic approver assignment based on transaction amounts
- Delegation management with date-based activation
- Multi-tiered approval chains with escalation
- Complete audit trail with delegate action tracking

Always consult the constants file (`tsc_cm_constants.js`) for current field mappings and record structures before making modifications.

### NOTION PROJECT NAME: EMG008 - Netsuite Approval workflow requirements