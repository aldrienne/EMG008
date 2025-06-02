/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/search', '../tsc_cm_constants', 'N/runtime', 'N/log'],

    (search, TSCCONST, runtime, log) => {
        const { RECORDS } = TSCCONST;

        const SCRIPT_PARAMETERS = {
            PRIMARY_APPROVER: 'custscript_tsc_wa_emg008_primary_approvr',
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
            const primaryApprover = runtime.getCurrentScript().getParameter(SCRIPT_PARAMETERS.PRIMARY_APPROVER);

            if (!primaryApprover) {
                log.error('Missing Parameters', 'Primary Approver is not set.');
                return null;
            }

            try {
                return checkDelegateActive(primaryApprover);
            } catch (error) {
                log.error('Error Checking Delegate Active', error.message);
            }

        }

        const checkDelegateActive = (primaryApprover) => {
            const title = 'checkDelegateActive():';
            log.debug(title + 'parameters', { primaryApprover });

            const customrecordTscDelegateApproversSearchFilters = [
                [RECORDS.DELEGATE_APPROVERS.FIELDS.PRIMARY_APPROVER, 'anyof', primaryApprover],
                'AND',
                [RECORDS.DELEGATE_APPROVERS.FIELDS.START_DATE, 'onorafter', 'today'],
                'AND',
                [RECORDS.DELEGATE_APPROVERS.FIELDS.END_DATE, 'onorbefore', 'today'],
                'AND',
                'isactive', 'is', 'T'
            ];
            log.debug(title + 'customrecordTscDelegateApproversSearchFilters', customrecordTscDelegateApproversSearchFilters);

            const customrecordTscDelegateApproversSearch = search.create({
                type: RECORDS.DELEGATE_APPROVERS.ID,
                filters: customrecordTscDelegateApproversSearchFilters,
                columns: [
                    search.createColumn({ name: RECORDS.DELEGATE_APPROVERS.FIELDS.DELEGATE_APPROVER }),
                    search.createColumn({ name: RECORDS.DELEGATE_APPROVERS.FIELDS.START_DATE }),
                    search.createColumn({ name: RECORDS.DELEGATE_APPROVERS.FIELDS.END_DATE })
                ]
            });

            const searchResults = customrecordTscDelegateApproversSearch.run().getRange({ 
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
