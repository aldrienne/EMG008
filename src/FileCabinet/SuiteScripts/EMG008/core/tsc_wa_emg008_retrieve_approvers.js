/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/search', '../tsc_cm_constants', 'N/runtime'],
    /**
 * @param{search} search
 */
    (search, TSCCONST, runtime) => {
        const SCRIPT_PARAMETERS = {
            APPROVAL_TYPE: 'custscript_tsc_wa_emg008_approval_type',
            APPROVAL_ROLE: 'custscript_tsc_wa_emg008_approval_role',
        }
        /**
         * Defines the WorkflowAction script trigger point.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.workflowId - Internal ID of workflow which triggered this action
         * @param {string} scriptContext.type - Event type
         * @param {Form} scriptContext.form - Current form that the script uses to interact with the record
         * @since 2016.1
         */
        const onAction = (scriptContext) => {
            const approvalType = runtime.getCurrentScript().getParameter(SCRIPT_PARAMETERS.APPROVAL_TYPE);
            const approvalRole = runtime.getCurrentScript().getParameter(SCRIPT_PARAMETERS.APPROVAL_ROLE);

            if (!approvalType || !approvalRole) {
                log.error('Missing Parameters', 'Approval Type or Approval Role is not set.');
                return null;
            }

            try {
                return retrieveApproverConfig(approvalType, approvalRole);
            } catch (error) {
                log.error('Error Retrieving Approver Config', error.message);
            }
        }

        const retrieveApproverConfig = (approvalType, approvalRole) => {
            const title = 'retrieveApproverConfig():';
            log.debug(title + 'parameters', {approvalType, approvalRole});
            const customrecordTscApproverConfigSearchFilters = [
                ['custrecordtsc_config_type', 'anyof', approvalType],
                'AND',
                ['custrecord_tsc_role_type', 'anyof', approvalRole],
            ];

            const customrecordTscApproverConfigSearch = search.create({
                type: TSCCONST.RECORDS.APPROVER_CONFIG.ID,
                filters: customrecordTscApproverConfigSearchFilters,
                columns: [],
            });
            let searchResults = customrecordTscApproverConfigSearch.run().getRange({
                start: 0,
                end: 1
            });
            log.debug(title + 'searchResults', searchResults);

            if (searchResults.length > 0) {
                return searchResults[0].id; 
            }
            return null;
        }

        return { onAction };
    });
