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
            DEPARTMENT: "custscript_tsc_wa_emg008_department",
            DEPARTMENT_LEVEL: "custscriptt_tsc_wa_emg008_department_lvl",
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
            const department = runtime.getCurrentScript().getParameter(SCRIPT_PARAMETERS.DEPARTMENT);

            if (!approvalType) {
                log.error('Missing Parameters', 'Approval Type or Approval Role is not set.');
                return null;
            }

            try {
                return retrieveApproverConfig(approvalType, approvalRole, department);
            } catch (error) {
                log.error('Error Retrieving Approver Config', error.message);
            }
        }

        const retrieveApproverConfig = (approvalType, approvalRole, department) => {
            const title = 'retrieveApproverConfig():';
            log.debug(title + 'parameters', { approvalType, approvalRole, department });
            const customrecordTscApproverConfigSearchFilters = [
                ['custrecordtsc_config_type', 'anyof', approvalType],
                'AND',
                ['isinactive', 'is', 'F']
            ];

            if (approvalRole) {
                customrecordTscApproverConfigSearchFilters.push('AND');
                customrecordTscApproverConfigSearchFilters.push(['custrecord_tsc_role_type', 'anyof', approvalRole]);
            }
            if (department) {
                customrecordTscApproverConfigSearchFilters.push('AND');
                customrecordTscApproverConfigSearchFilters.push(['custrecord_tsc_department', 'anyof', department]);
            }


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
