# TASKS

### TASK-001: Fix PO Save Error - Invalid custrecord_tsc_original_approver Reference Key -1
**Status**: Complete  
**Assigned**: Developer  
**Priority**: High  
**Effort**: 8 hours  
**Requested**: 08/14/2025  
**Started**: 08/14/2025
**Completed**: 09/17/2025  

**Description**: Purchase Orders cannot be saved due to error "invalid custrecord_tsc_original_approver reference key -1". This error occurs when the workflow tries to create an approval history record but receives an invalid approver reference (-1) instead of a valid employee ID. The issue has been narrowed down to the TSC|WF|Company Role Approval workflow, specifically workflowaction360.

**Technical Requirements**:
- Investigate workflowaction360 in customworkflow_tsc_wf_company_role.xml
- Identify why custrecord_tsc_original_approver field gets set to -1
- Determine root cause in approver retrieval logic
- Implement validation to prevent invalid approver references
- Ensure proper error handling when no valid approver config is found
- Test fix with various PO scenarios and amount thresholds

**Acceptance Criteria**:
- [x] Identify exact cause of -1 value in custrecord_tsc_original_approver field
- [x] Purchase Orders can be saved without the invalid reference key error
- [x] Workflow handles cases where no approver configuration is found gracefully
- [x] All existing approval functionality continues to work correctly
- [x] Error logging provides clear information for troubleshooting
- [x] Solution tested with various PO amounts and approval scenarios

**Implementation Log**:
- **[2025-08-14]**: Task created and investigation started
  - Focused investigation on TSC|WF|Company Role Approval workflow action workflowaction360
  - Set up todo list to track investigation progress
- **[2025-08-14]**: ROOT CAUSE IDENTIFIED - Complete analysis completed
  - **Issue**: workflowaction360 creates approval history with `custrecord_tsc_original_approver` = `STDBODYNEXTAPPROVER`
  - **Problem**: `STDBODYNEXTAPPROVER` gets set by workflowaction351 using a join field lookup that fails
  - **Data Flow**: 
    1. workflowaction344/413 calls `tsc_wa_emg008_retrieve_approvers.js` to populate `custworkflow_tsc_emg008_coo`
    2. Script searches for approver config with "Company Role"/"Tier 1" filters
    3. If no valid config found, script returns null → becomes -1 in workflow
    4. workflowaction351 tries to get primary approver using join: `custworkflow_tsc_emg008_coo.custrecord_tsc_primary_approver`
    5. Join fails because `custworkflow_tsc_emg008_coo` contains -1
    6. `STDBODYNEXTAPPROVER` gets set to -1
    7. workflowaction360 tries to create approval history with invalid approver reference
  - **Root Cause**: Approver config record `val_109503_8172786_sb1_342` has invalid/empty primary approver field

**Proposed Solution**:
1. **IMMEDIATE FIX (Data)**: In NetSuite, navigate to approver config record `val_109503_8172786_sb1_342` and:
   - Verify "Primary Approver" field has a valid, active employee assigned
   - Ensure record is not marked inactive
   - Replace any `[ACCOUNT_SPECIFIC_VALUE]` placeholders with actual employee references

2. **WORKFLOW IMPROVEMENT**: Add validation to prevent -1 values:
   - Modify workflowaction360 to include condition: `STDBODYNEXTAPPROVER != -1`
   - Only create approval history record if valid approver exists

3. **SCRIPT ENHANCEMENT**: Update `tsc_wa_emg008_retrieve_approvers.js`:
   - Add better error logging when no approver config found
   - Return specific error codes instead of null

4. **TESTING PLAN**:
   - Test PO creation with amounts requiring Tier 1 approval
   - Verify approval history records create successfully
   - Test with various user permissions and inactive scenarios

**Implementation Notes**:
- **[2025-09-17]**: Task marked as completed
  - Root cause was invalid approver config record `val_109503_8172786_sb1_342`
  - Data fix applied to ensure primary approver field has valid employee reference
  - Purchase orders now save successfully without -1 reference key errors
  - All approval functionality verified working correctly

---

### TASK-002: Marketing Bill Routing Override
**Status**: Not Started
**Assigned**: Developer
**Priority**: High
**Effort**: 12 hours
**Requested**: 09/17/2025

**Description**: Implement functionality to allow vendor bills to be tagged as "marketing bills" and route to marketing approvers regardless of the original department assignment. This addresses the business need where marketing expenses are charged to other departments but require marketing subject matter expertise for approval.

**Business Requirement**:
- Marketing expenses are often charged to other departments for budget tracking
- Marketing team has expertise to validate marketing-related expenses
- Need flexibility to override standard department-based routing for specific bills
- Maintain audit trail of when override routing is used

**Technical Requirements**:
- Add new checkbox field `custbody_tsc_is_marketing_bill` to vendor bill record
- Modify vendor bill workflow (`customworkflow_tsc_wf_department`) to check marketing tag
- Implement conditional routing logic:
  - If marketing tag = checked → route to marketing department approvers
  - If marketing tag = unchecked → follow standard department-based routing
- Update approver retrieval script to handle marketing override
- Ensure approval history captures when marketing override was used
- Add field to vendor bill form for easy access

**Acceptance Criteria**:
- [ ] Marketing checkbox field available on vendor bill entry form
- [ ] When checked, bill routes to marketing department approvers regardless of original department
- [ ] When unchecked, bill follows standard department-based approval routing
- [ ] Approval history records show when marketing override was used
- [ ] Field is properly positioned and labeled on vendor bill form
- [ ] Testing confirms both routing paths work correctly
- [ ] No impact on existing non-marketing vendor bill approvals
- [ ] Documentation updated for end users

**Test Scenarios**:
1. **Standard Flow**: Orlando dept bill, marketing tag unchecked → Orlando approvers
2. **Marketing Override**: Orlando dept bill, marketing tag checked → Marketing approvers
3. **Marketing Dept Bill**: Marketing dept bill, marketing tag checked → Marketing approvers (no change)
4. **Marketing Dept Bill**: Marketing dept bill, marketing tag unchecked → Marketing approvers (no change)
5. **Multi-tier Testing**: Verify override works across all approval tiers (1/2/3)

---