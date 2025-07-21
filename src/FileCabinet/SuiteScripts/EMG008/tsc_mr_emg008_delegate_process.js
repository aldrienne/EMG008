/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/search', './tsc_cm_constants', 'N/record', 'N/runtime'],
    /**
 * @param{search} search
 */
    (search, TSCCONST, record, runtime) => {

        const SCRIPT_PARAMETERS = {
            PROCESS_MODE: 'custscript_tsc_delegate_process_mode' // 'ASSIGN_DELEGATES' or 'RESTORE_APPROVERS'
        };
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
            let title = "getInputData";
            try {
                let processMode = runtime.getCurrentScript().getParameter(SCRIPT_PARAMETERS.PROCESS_MODE);
                log.debug(title, `Process mode: ${processMode}`);

                if (processMode === 'ASSIGN_DELEGATES') {
                    return retrieveActiveDelegates();
                } else if (processMode === 'RESTORE_APPROVERS') {
                    return retrieveInactiveDelegates();
                } else {
                    log.error(title, `Invalid process mode: ${processMode}. Expected 'ASSIGN_DELEGATES' or 'RESTORE_APPROVERS'`);
                    return [];
                }
            } catch (e) {
                log.error(title, `Error retrieving active delegates: ${e.message}`);
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
            let title = "map: ";
            try {
                let key = mapContext.key;
                let value = JSON.parse(mapContext.value);

                log.debug('key: ' + key, 'value: ' + JSON.stringify(value));

                const primaryApprover = value.values['GROUP(custrecord_tsc_delegate_primary_approver)'];
                const delegateApprover = value.values['GROUP(custrecord_tsc_delegate_approver)'];

                // Validate that both approver fields exist and have values
                if (!primaryApprover || !primaryApprover.value || !delegateApprover || !delegateApprover.value) {
                    log.error(title, `Missing required approver data - Primary: ${JSON.stringify(primaryApprover)}, Delegate: ${JSON.stringify(delegateApprover)}`);
                    return;
                }

                log.debug(title + 'Primary Approver', `ID: ${primaryApprover.value}, Name: ${primaryApprover.text || 'N/A'}`);
                log.debug(title + 'Delegate Approver', `ID: ${delegateApprover.value}, Name: ${delegateApprover.text || 'N/A'}`);

                // Write data to reduce stage if needed
                mapContext.write({
                    key: primaryApprover.value + '|' + delegateApprover.value,
                    value: {
                        primaryApprover: primaryApprover,
                        delegateApprover: delegateApprover
                    }
                });

            } catch (e) {
                log.error(title, `Error processing map stage: ${e.message}`);
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
            let title = "reduce: ";
            try {
                let processMode = runtime.getCurrentScript().getParameter(SCRIPT_PARAMETERS.PROCESS_MODE);

                // Validate key format
                if (!reduceContext.key || !reduceContext.key.includes('|')) {
                    log.error(title, `Invalid key format: ${reduceContext.key}`);
                    return;
                }

                let keyParts = reduceContext.key.split('|');
                let primaryApproverId = keyParts[0];
                let delegateApproverId = keyParts[1];

                // Validate key parts
                if (!primaryApproverId || !delegateApproverId) {
                    log.error(title, `Invalid key parts - Primary: ${primaryApproverId}, Delegate: ${delegateApproverId}`);
                    return;
                }

                //Search for transactions based on process mode
                let transactionToUpdate;
                if (processMode === 'ASSIGN_DELEGATES') {
                    // Search for transactions where primary approver = next approver and no delegate assigned
                    transactionToUpdate = searchTransactionsForDelegateAssignment(primaryApproverId, delegateApproverId);
                } else if (processMode === 'RESTORE_APPROVERS') {
                    // Search for transactions where delegate = next approver and delegation is active
                    transactionToUpdate = searchTransactionsForDelegateRestoration(primaryApproverId, delegateApproverId);
                } else {
                    log.error(title, `Invalid process mode: ${processMode}`);
                    return;
                }
                log.debug(title + 'transactionIds', transactionToUpdate);

                // Validate transactions array
                if (!transactionToUpdate || !Array.isArray(transactionToUpdate)) {
                    log.debug(title, 'No transactions found or invalid response from searchTransactions');
                    return;
                }

                transactionToUpdate.forEach((transaction) => {
                    //ENABLE FOR DEBUGGING
                    //if (transaction.id != 36537) return;

                    if (!transaction || !transaction.id || !transaction.type) {
                        log.error(title, `Invalid transaction object: ${JSON.stringify(transaction)}`);
                        return;
                    }

                    log.debug(title + 'transaction', `ID: ${transaction.id}, Type: ${transaction.type}, Mode: ${processMode}`);

                    try {
                        // Determine values based on process mode
                        let updateValues;
                        if (processMode === 'ASSIGN_DELEGATES') {
                            updateValues = {
                                [TSCCONST.TRANSACTION_BODY_FIELDS.ASSIGNED_DELEGATE_APPROVER]: delegateApproverId,
                                [TSCCONST.TRANSACTION_BODY_FIELDS.IS_DELEGATE_ACTIVE]: true
                            };
                            log.debug(title + 'Assigning delegate', `Transaction: ${transaction.id}, Delegate: ${delegateApproverId}`);
                        } else if (processMode === 'RESTORE_APPROVERS') {
                            updateValues = {
                                [TSCCONST.TRANSACTION_BODY_FIELDS.ASSIGNED_DELEGATE_APPROVER]: '',
                                [TSCCONST.TRANSACTION_BODY_FIELDS.IS_DELEGATE_ACTIVE]: false
                            };
                            log.debug(title + 'Restoring to primary approver', `Transaction: ${transaction.id}, Primary: ${primaryApproverId}`);
                        }

                        if (transaction.type === 'VendBill') {
                            log.debug(title + 'Updating Vendor Bill', `ID: ${transaction.id}`);
                            record.submitFields({
                                type: 'vendorbill',
                                id: transaction.id,
                                values: updateValues,
                                options: {
                                    enableSourcing: false,
                                    ignoreMandatoryFields: true
                                }
                            });
                        } else if (transaction.type === 'PurchOrd') {
                            log.debug(title + 'Updating Purchase Order', `ID: ${transaction.id}`);
                            record.submitFields({
                                type: 'purchaseorder',
                                id: transaction.id,
                                values: updateValues,
                                options: {
                                    enableSourcing: false,
                                    ignoreMandatoryFields: true
                                }
                            });
                        } else {
                            log.error(title + 'Unexpected Transaction Type', `ID: ${transaction.id}, Type: ${transaction.type}`);
                        }
                    } catch (updateError) {
                        log.error(title + 'Error updating transaction', `ID: ${transaction.id}, Error: ${updateError.message}`);
                    }
                });

            } catch (e) {
                log.error(title, `Error processing reduce stage: ${e.message}`);
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

            const primaryApproverCol = search.createColumn({
                name: TSCCONST.RECORDS.DELEGATE_APPROVERS.FIELDS.PRIMARY_APPROVER,
                summary: search.Summary.GROUP
            });
            const delegateApproverCol = search.createColumn({
                name: TSCCONST.RECORDS.DELEGATE_APPROVERS.FIELDS.DELEGATE_APPROVER,
                summary: search.Summary.GROUP
            });

            return search.create({
                type: TSCCONST.RECORDS.DELEGATE_APPROVERS.ID,
                filters: filters,
                columns: [
                    primaryApproverCol,
                    delegateApproverCol,
                ],
            });
        }

        const retrieveInactiveDelegates = () => {
            const filters = [
                [TSCCONST.RECORDS.DELEGATE_APPROVERS.FIELDS.END_DATE, 'before', 'today'],
                'AND',
                ['isinactive', 'is', 'F'],
            ];

            const primaryApproverCol = search.createColumn({
                name: TSCCONST.RECORDS.DELEGATE_APPROVERS.FIELDS.PRIMARY_APPROVER,
                summary: search.Summary.GROUP
            });
            const delegateApproverCol = search.createColumn({
                name: TSCCONST.RECORDS.DELEGATE_APPROVERS.FIELDS.DELEGATE_APPROVER,
                summary: search.Summary.GROUP
            });

            return search.create({
                type: TSCCONST.RECORDS.DELEGATE_APPROVERS.ID,
                filters: filters,
                columns: [
                    primaryApproverCol,
                    delegateApproverCol,
                ],
            });
        }

        const searchTransactionsForDelegateAssignment = (primaryApproverId, delegateApproverId) => {
            let title = "searchTransactionsForDelegateAssignment";
            log.debug(title + ' params', { primaryApproverId, delegateApproverId });

            let results = [];

            const filters = [
                ['type', 'anyof', 'PurchOrd', 'VendBill'],
                'AND',
                ['nextapprover', 'anyof', primaryApproverId],
                'AND',
                ['mainline', 'is', 'T']
            ];

            log.debug(title + ' filters', filters);

            const typeCol = search.createColumn({ name: 'type' });

            const transactionSearch = search.create({
                type: 'transaction',
                filters: filters,
                columns: [typeCol]
            });

            const pagedData = transactionSearch.runPaged({ pageSize: 1000 });
            for (let i = 0; i < pagedData.pageRanges.length; i++) {
                const page = pagedData.fetch({ index: i });
                page.data.forEach((result) => {
                    results.push({
                        id: result.id,
                        type: result.getValue(typeCol)
                    });
                });
            }

            return results;
        }


        const searchTransactionsForDelegateRestoration = (primaryApproverId, delegateApproverId) => {
            let title = "searchTransactionsForDelegateRestoration";
            log.debug(title + ' params', { primaryApproverId, delegateApproverId });

            let results = [];
            const filters = [
                ['type', 'anyof', 'PurchOrd', 'VendBill'],
                'AND',
                ['nextapprover', 'anyof', primaryApproverId], // Currently assigned to delegate
                'AND',
                ['mainline', 'is', 'T'],
                'AND',
                [TSCCONST.TRANSACTION_BODY_FIELDS.ASSIGNED_DELEGATE_APPROVER, 'anyof', delegateApproverId], // Delegate is assigned
                'AND',
                [TSCCONST.TRANSACTION_BODY_FIELDS.IS_DELEGATE_ACTIVE, 'is', 'T'] // Delegation is active
            ];

            log.debug(title + ' filters', filters);

            const typeCol = search.createColumn({ name: 'type' });

            const transactionSearch = search.create({
                type: 'transaction',
                filters: filters,
                columns: [typeCol]
            });

            const pagedData = transactionSearch.runPaged({ pageSize: 1000 });
            for (let i = 0; i < pagedData.pageRanges.length; i++) {
                const page = pagedData.fetch({ index: i });
                page.data.forEach((result) => {
                    results.push({
                        id: result.id,
                        type: result.getValue(typeCol)
                    });
                });
            }

            return results;
        }
        return { getInputData, map, reduce, summarize }

    });
