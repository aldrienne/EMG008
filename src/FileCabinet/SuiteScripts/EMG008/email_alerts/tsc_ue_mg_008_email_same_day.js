/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/search', 'N/record', 'N/email', 'N/render', 'N/runtime', '../tsc_cm_constants'],

    (search, record, email, render, runtime, TSCCONST) => {
        const SCRIPT_PARAMETERS = {
            DELEGATE_ASSIGNMENT_NOTIFICATION_TEMPLATE_ID: "custscript_tsc_emg008_dlgt_assign_templ",
            EMAIL_AUTHOR: "custscript_tsc_emg008_email_author"
        };
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {
            //Determine record type
            //If Delegate Approvers record, determine start and end date
            // If Start Date is today send notification template
            const newRecord = scriptContext.newRecord;
            const oldRecord = scriptContext.oldRecord;
            const recordType = newRecord.type;
            log.debug('recordType', recordType);
            log.debug('RECORD_TYPE_DELEGATE_APPROVERS', TSCCONST.RECORDS.DELEGATE_APPROVERS.ID);

            if (recordType == TSCCONST.RECORDS.DELEGATE_APPROVERS.ID) {
                let primaryApprover = newRecord.getValue(TSCCONST.RECORDS.DELEGATE_APPROVERS.FIELDS.PRIMARY_APPROVER);
                let delegateApprover = newRecord.getValue(TSCCONST.RECORDS.DELEGATE_APPROVERS.FIELDS.DELEGATE_APPROVER);

                let templateId = runtime.getCurrentScript().getParameter(SCRIPT_PARAMETERS.DELEGATE_ASSIGNMENT_NOTIFICATION_TEMPLATE_ID);
                let author = runtime.getCurrentScript().getParameter(SCRIPT_PARAMETERS.EMAIL_AUTHOR);

                //Log parameters 
                log.debug('Parameters', {
                    primaryApprover: primaryApprover,
                    delegateApprover: delegateApprover,
                    templateId: templateId,
                });
                const startDate = newRecord.getValue(TSCCONST.RECORDS.DELEGATE_APPROVERS.FIELDS.START_DATE);
                const oldStartDate = oldRecord ? oldRecord.getValue(TSCCONST.RECORDS.DELEGATE_APPROVERS.FIELDS.START_DATE) : null;
                const endDate = newRecord.getValue(TSCCONST.RECORDS.DELEGATE_APPROVERS.FIELDS.END_DATE);
                const today = new Date();

                // Check if start date is today AND old start date is not today
                if (startDate && startDate.getFullYear() === today.getFullYear() &&
                    startDate.getMonth() === today.getMonth() &&
                    startDate.getDate() === today.getDate() &&
                    (!oldStartDate || oldStartDate.getFullYear() !== today.getFullYear() ||
                     oldStartDate.getMonth() !== today.getMonth() ||
                     oldStartDate.getDate() !== today.getDate())) {

                    try {
                        var mergeResult = render.mergeEmail({
                            templateId: templateId,
                            entity: {
                                type: 'employee',
                                id: parseInt(primaryApprover)
                            },
                            recipient: {
                                type: 'customer',
                                id: parseInt(delegateApprover)
                            },
                            customRecord: {
                                type: TSCCONST.RECORDS.DELEGATE_APPROVERS.ID,
                                id: parseInt(newRecord.id)
                            }
                        });

                        email.send({
                            author: parseInt(author),
                            recipients: parseInt(delegateApprover),
                            subject: mergeResult.subject,
                            body: mergeResult.body
                        });

                    } catch (e) {
                        log.error('Error Sending Email', e.message);
                    }

                }
            }
        }

        return { beforeLoad, beforeSubmit, afterSubmit }

    });
