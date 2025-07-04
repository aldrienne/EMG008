#!/bin/bash

# Script to import/update all NetSuite objects from account to local project
# Generated for EMG008 project
# Usage: ./import_all_objects.sh [import|update]
# Default mode is import if no parameter provided

# Set mode from command line parameter (default to import)
MODE="${1:-import}"

# Validate mode
if [ "$MODE" != "import" ] && [ "$MODE" != "update" ]; then
    echo "Error: Invalid mode '$MODE'. Use 'import' or 'update'"
    exit 1
fi

echo "Starting NetSuite object ${MODE}..."
echo "================================"
echo "Mode: $(echo $MODE | tr '[:lower:]' '[:upper:]')"

# Set destination folder
DEST_FOLDER="src/Objects"

# Counter for tracking progress
SUCCESS_COUNT=0
FAIL_COUNT=0
TOTAL_COUNT=0

# Function to import/update an object and track result
import_object() {
    local type=$1
    local scriptid=$2
    TOTAL_COUNT=$((TOTAL_COUNT + 1))
    
    echo ""
    echo "[$TOTAL_COUNT/28] $(echo ${MODE:0:1} | tr '[:lower:]' '[:upper:]')${MODE:1}ing $scriptid (type: $type)..."
    
    if [ "$MODE" = "update" ]; then
        # Update mode - use object:update command
        if suitecloud object:update --scriptid "$scriptid" 2>/dev/null; then
            echo "✓ Successfully updated $scriptid"
            SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        else
            echo "✗ Failed to update $scriptid"
            FAIL_COUNT=$((FAIL_COUNT + 1))
        fi
    else
        # Import mode - use object:import command
        if suitecloud object:import --type "$type" --scriptid "$scriptid" --destinationfolder "$DEST_FOLDER" 2>/dev/null; then
            echo "✓ Successfully imported $scriptid"
            SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        else
            echo "✗ Failed to import $scriptid"
            FAIL_COUNT=$((FAIL_COUNT + 1))
        fi
    fi
}

# Import/Update Custom Body Fields (transactionbodycustomfield)
echo ""
echo "$(echo ${MODE:0:1} | tr '[:lower:]' '[:upper:]')${MODE:1}ing Custom Body Fields..."
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

# Import/Update Email Templates
echo ""
echo "$(echo ${MODE:0:1} | tr '[:lower:]' '[:upper:]')${MODE:1}ing Email Templates..."
echo "---------------------------"
import_object "emailtemplate" "custemailtmpl_tsc_emg008_delegate_assignment_notification"

# Import/Update Custom Lists
echo ""
echo "$(echo ${MODE:0:1} | tr '[:lower:]' '[:upper:]')${MODE:1}ing Custom Lists..."
echo "------------------------"
import_object "customlist" "customlist_tsc_approval_actions"
import_object "customlist" "customlist_tsc_config_types"
import_object "customlist" "customlist_tsc_role_types"

# Import/Update Custom Records
echo ""
echo "$(echo ${MODE:0:1} | tr '[:lower:]' '[:upper:]')${MODE:1}ing Custom Records..."
echo "--------------------------"
import_object "customrecord" "customrecord_tsc_approval_history"
import_object "customrecord" "customrecord_tsc_approval_thresholds"
import_object "customrecord" "customrecord_tsc_approver_config"
import_object "customrecord" "customrecord_tsc_delegate_approvers"

# Import/Update Script Deployments
echo ""
echo "$(echo ${MODE:0:1} | tr '[:lower:]' '[:upper:]')${MODE:1}ing Script Deployments..."
echo "------------------------------"
import_object "scriptdeployment" "customscript_tsc_mr_email_alerts"
import_object "scriptdeployment" "customscript_tsc_mr_handle_approver_chan"
import_object "scriptdeployment" "customscript_tsc_mr_process_delegates"
import_object "scriptdeployment" "customscript_tsc_sl_emg008_app_config"
import_object "scriptdeployment" "customscript_tsc_sl_self_service_delegat"
import_object "scriptdeployment" "customscript_tsc_ue_email_alerts"
import_object "scriptdeployment" "customscript_tsc_wa_check_delegate_activ"
import_object "scriptdeployment" "customscript_tsc_wa_retrieve_approvers"

# Import/Update Saved Searches
echo ""
echo "$(echo ${MODE:0:1} | tr '[:lower:]' '[:upper:]')${MODE:1}ing Saved Searches..."
echo "--------------------------"
import_object "savedsearch" "customsearch_tsc_emg008_pending_po_appro"

# Import/Update Workflows
echo ""
echo "$(echo ${MODE:0:1} | tr '[:lower:]' '[:upper:]')${MODE:1}ing Workflows..."
echo "---------------------"
import_object "workflow" "customworkflow_tsc_wf_company_role"
import_object "workflow" "customworkflow_tsc_wf_department"

# Summary
echo ""
echo "================================"
echo "$(echo ${MODE:0:1} | tr '[:lower:]' '[:upper:]')${MODE:1} Summary:"
echo "--------------------------------"
echo "Total objects: $TOTAL_COUNT"
echo "Successful ${MODE}s: $SUCCESS_COUNT"
echo "Failed ${MODE}s: $FAIL_COUNT"
echo "================================"

if [ $FAIL_COUNT -gt 0 ]; then
    echo ""
    echo "⚠️  Some ${MODE}s failed. Please check the error messages above."
    exit 1
else
    echo ""
    echo "✅ All objects ${MODE}ed successfully!"
    exit 0
fi