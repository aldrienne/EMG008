/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/search', '../tsc_cm_constants', 'N/record', 'N/runtime', 'N/render', 'N/email'],

    (search, TSCCONST, record, runtime, render, email) => {
        const SCRIPT_PARAMETERS = {
            EMAIL_TYPE: 'custscript_tsc_mr_emg008_email_type',
            DELEGATE_ASSIGNMENT_NOTIFICATION_TEMPLATE_ID: "custscript_tsc_emg008_dlgt_assign_templ",
            EMAIL_AUTHOR: "custscript_tsc_emg008_email_author"
        }
        /**
         * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Object} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
         * @property {string} ObjectRef.type - Type of the record instance that contains the input data
         * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
         * @since 2015.2
         */

        const getInputData = (inputContext) => {
            let title = 'getInputData():';
            log.debug(title + '==START==')
            try {
                let emailType = runtime.getCurrentScript().getParameter(SCRIPT_PARAMETERS.EMAIL_TYPE);
                log.debug(title + 'Email Type', emailType);
                if (emailType == "DELEGATE_ASSIGNMENT_NOTIFICATION") {
                    return retrieveActiveDelegates();
                }

            } catch (e) {
                log.error(title + 'Error', e.message);
            }
        }

        /**
         * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
         * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
         * context.
         * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
         *     is provided automatically based on the results of the getInputData stage.
         * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
         *     function on the current key-value pair
         * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */

        const map = (mapContext) => {
            let title = 'map():';
            log.debug(title + '==START==');
            let emailType = runtime.getCurrentScript().getParameter(SCRIPT_PARAMETERS.EMAIL_TYPE);
            try {

                if (emailType == "DELEGATE_ASSIGNMENT_NOTIFICATION") {
                    let id = mapContext.key;
                    let value = JSON.parse(mapContext.value);
                    log.debug(title + id, value);

                    let primaryApprover = value['values']["GROUP(custrecord_tsc_delegate_primary_approver)"];
                    let delegateApprover = value['values']["GROUP(custrecord_tsc_delegate_approver)"];
                    let startDate = value['values']["GROUP(custrecord_delegate_start_date)"];
                    let endDate = value['values']["GROUP(custrecord_tsc_delegate_end_date)"];
                    let internalId = value['values']["GROUP(internalid)"];

                    mapContext.write({
                        key: primaryApprover.value + '|' + delegateApprover.value,
                        value: {
                            primaryApprover: primaryApprover.value,
                            delegateApprover: delegateApprover.value,
                            startDate: startDate,
                            endDate: endDate,
                            internalId: internalId.value
                        }
                    })
                }


            } catch (e) {
                log.error(title + 'Error', e.message);
            }

        }

        /**
         * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
         * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
         * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
         *     provided automatically based on the results of the map stage.
         * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
         *     reduce function on the current group
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
         * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} reduceContext.key - Key to be processed during the reduce stage
         * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
         *     for processing
         * @since 2015.2
         */
        const reduce = (reduceContext) => {
            let title = 'reduce():';
            try {
                let emailType = runtime.getCurrentScript().getParameter(SCRIPT_PARAMETERS.EMAIL_TYPE);                
                let author = runtime.getCurrentScript().getParameter(SCRIPT_PARAMETERS.EMAIL_AUTHOR);
                if (emailType == "DELEGATE_ASSIGNMENT_NOTIFICATION") {
                    let emailTemplateId = runtime.getCurrentScript().getParameter(SCRIPT_PARAMETERS.DELEGATE_ASSIGNMENT_NOTIFICATION_TEMPLATE_ID);
                    log.debug(title + '==START==');
                    let key = reduceContext.key;
                    let values = JSON.parse(reduceContext.values[0]);

                    log.debug(title + key, values);

                    var mergeResult = render.mergeEmail({
                        templateId: emailTemplateId,
                        entity: {
                            type: 'employee',
                            id: parseInt(values.primaryApprover)
                        },
                        recipient: {
                            type: 'customer',
                            id: parseInt(values.delegateApprover)
                        },
                        customRecord: {
                            type: TSCCONST.RECORDS.DELEGATE_APPROVERS.ID,
                            id: parseInt(values.internalId)
                        }
                    });

                    email.send({
                        author: parseInt(author),
                        recipients: parseInt(values.delegateApprover),
                        subject: mergeResult.subject,
                        body: mergeResult.body
                    });
                }


            } catch (e) {
                log.error(title + 'Error', e.message);
            }
        }


        /**
         * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
         * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
         * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
         * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
         *     script
         * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
         * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
         * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
         * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
         *     script
         * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
         * @param {Object} summaryContext.inputSummary - Statistics about the input stage
         * @param {Object} summaryContext.mapSummary - Statistics about the map stage
         * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
         * @since 2015.2
         */
        const summarize = (summaryContext) => {

        }


        const retrieveActiveDelegates = () => {
            const filters = [
                [TSCCONST.RECORDS.DELEGATE_APPROVERS.FIELDS.START_DATE, 'onorbefore', 'today'],
                'AND',
                [
                    [TSCCONST.RECORDS.DELEGATE_APPROVERS.FIELDS.END_DATE, 'onorafter', 'today'],
                    'OR',
                    [TSCCONST.RECORDS.DELEGATE_APPROVERS.FIELDS.END_DATE, 'isempty', '']
                ],
                'AND',
                ['isinactive', 'is', 'F'],
            ];

            const internalIdCol = search.createColumn({
                name: 'internalid',
                summary: search.Summary.GROUP
            });
            const primaryApproverCol = search.createColumn({
                name: TSCCONST.RECORDS.DELEGATE_APPROVERS.FIELDS.PRIMARY_APPROVER,
                summary: search.Summary.GROUP
            });
            const delegateApproverCol = search.createColumn({
                name: TSCCONST.RECORDS.DELEGATE_APPROVERS.FIELDS.DELEGATE_APPROVER,
                summary: search.Summary.GROUP
            });
            const startDateCol = search.createColumn({
                name: TSCCONST.RECORDS.DELEGATE_APPROVERS.FIELDS.START_DATE,
                summary: search.Summary.GROUP
            });
            const endDateCol = search.createColumn({
                name: TSCCONST.RECORDS.DELEGATE_APPROVERS.FIELDS.END_DATE,
                summary: search.Summary.GROUP
            });
            return search.create({
                type: TSCCONST.RECORDS.DELEGATE_APPROVERS.ID,
                filters: filters,
                columns: [
                    internalIdCol,
                    primaryApproverCol,
                    delegateApproverCol,
                    startDateCol,
                    endDateCol
                ],
            });
        }

        return { getInputData, map, reduce, summarize }

    });
