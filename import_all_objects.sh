#!/bin/bash

# Script to import all NetSuite objects from account to local project
# Generated for EMG008 project

echo "Starting NetSuite object import..."
echo "================================"

# Set destination folder
DEST_FOLDER="src/Objects"

# Counter for tracking progress
SUCCESS_COUNT=0
FAIL_COUNT=0
TOTAL_COUNT=0

# Function to import an object and track result
import_object() {
    local type=$1
    local scriptid=$2
    TOTAL_COUNT=$((TOTAL_COUNT + 1))
    
    echo ""
    echo "[$TOTAL_COUNT/28] Importing $scriptid (type: $type)..."
    
    if suitecloud object:import --type "$type" --scriptid "$scriptid" --destinationfolder "$DEST_FOLDER" 2>/dev/null; then
        echo "✓ Successfully imported $scriptid"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo "✗ Failed to import $scriptid"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
}

# Import Custom Body Fields (transactionbodycustomfield)
echo ""
echo "Importing Custom Body Fields..."
echo "------------------------------"
import_object "transactionbodycustomfield" "custbody_tsc_approval_history"
import_object "transactionbodycustomfield" "custbody_tsc_approval_level"
import_object "transactionbodycustomfield" "custbody_tsc_approval_status"
import_object "transactionbodycustomfield" "custbody_tsc_assigned_delegate_approv"
import_object "transactionbodycustomfield" "custbody_tsc_created_by"
import_object "transactionbodycustomfield" "custbody_tsc_is_delegate_active"
import_object "transactionbodycustomfield" "custbody_tsc_is_revision"
import_object "transactionbodycustomfield" "custbody_tsc_last_approver"
import_object "transactionbodycustomfield" "custbody_tsc_rejection_reason"

# Import Email Templates
echo ""
echo "Importing Email Templates..."
echo "---------------------------"
import_object "emailtemplate" "custemailtmpl_tsc_emg008_delegate_assignment_notification"

# Import Custom Lists
echo ""
echo "Importing Custom Lists..."
echo "------------------------"
import_object "customlist" "customlist_tsc_approval_actions"
import_object "customlist" "customlist_tsc_config_types"
import_object "customlist" "customlist_tsc_role_types"

# Import Custom Records
echo ""
echo "Importing Custom Records..."
echo "--------------------------"
import_object "customrecord" "customrecord_tsc_approval_history"
import_object "customrecord" "customrecord_tsc_approval_thresholds"
import_object "customrecord" "customrecord_tsc_approver_config"
import_object "customrecord" "customrecord_tsc_delegate_approvers"

# Import Script Deployments
echo ""
echo "Importing Script Deployments..."
echo "------------------------------"
import_object "scriptdeployment" "customscript_tsc_mr_email_alerts"
import_object "scriptdeployment" "customscript_tsc_mr_handle_approver_chan"
import_object "scriptdeployment" "customscript_tsc_mr_process_delegates"
import_object "scriptdeployment" "customscript_tsc_sl_emg008_app_config"
import_object "scriptdeployment" "customscript_tsc_sl_self_service_delegat"
import_object "scriptdeployment" "customscript_tsc_ue_email_alerts"
import_object "scriptdeployment" "customscript_tsc_wa_check_delegate_activ"
import_object "scriptdeployment" "customscript_tsc_wa_retrieve_approvers"

# Import Saved Searches
echo ""
echo "Importing Saved Searches..."
echo "--------------------------"
import_object "savedsearch" "customsearch_tsc_emg008_pending_po_appro"

# Import Workflows
echo ""
echo "Importing Workflows..."
echo "---------------------"
import_object "workflow" "customworkflow_tsc_wf_company_role"
import_object "workflow" "customworkflow_tsc_wf_department"

# Summary
echo ""
echo "================================"
echo "Import Summary:"
echo "--------------------------------"
echo "Total objects: $TOTAL_COUNT"
echo "Successful imports: $SUCCESS_COUNT"
echo "Failed imports: $FAIL_COUNT"
echo "================================"

if [ $FAIL_COUNT -gt 0 ]; then
    echo ""
    echo "⚠️  Some imports failed. Please check the error messages above."
    exit 1
else
    echo ""
    echo "✅ All objects imported successfully!"
    exit 0
fi