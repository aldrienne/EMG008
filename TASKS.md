# TASKS

### TASK-001: Fix PO Save Error - Invalid custrecord_tsc_original_approver Reference Key -1
**Status**: In Progress  
**Assigned**: Developer  
**Priority**: High  
**Effort**: 8 hours  
**Requested**: 08/14/2025  
**Started**: 08/14/2025  

**Description**: Purchase Orders cannot be saved due to error "invalid custrecord_tsc_original_approver reference key -1". This error occurs when the workflow tries to create an approval history record but receives an invalid approver reference (-1) instead of a valid employee ID. The issue has been narrowed down to the TSC|WF|Company Role Approval workflow, specifically workflowaction360.

**Technical Requirements**:
- Investigate workflowaction360 in customworkflow_tsc_wf_company_role.xml
- Identify why custrecord_tsc_original_approver field gets set to -1
- Determine root cause in approver retrieval logic
- Implement validation to prevent invalid approver references
- Ensure proper error handling when no valid approver config is found
- Test fix with various PO scenarios and amount thresholds

**Acceptance Criteria**:
- [ ] Identify exact cause of -1 value in custrecord_tsc_original_approver field
- [ ] Purchase Orders can be saved without the invalid reference key error
- [ ] Workflow handles cases where no approver configuration is found gracefully
- [ ] All existing approval functionality continues to work correctly
- [ ] Error logging provides clear information for troubleshooting
- [ ] Solution tested with various PO amounts and approval scenarios

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

---