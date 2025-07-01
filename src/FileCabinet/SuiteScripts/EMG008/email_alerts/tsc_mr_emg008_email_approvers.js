/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/email', 'N/runtime', 'N/search', '../tsc_cm_constants'],
    /**
 * @param{email} email
 * @param{runtime} runtime
 * @param{search} search
 * @param{TSCCONST} TSCCONST
 */
    (email, runtime, search, TSCCONST) => {
        const SCRIPT_PARAMETERS = {
            AUTHOR: "custscript_tsc_emg008_email_author",
            EMAIL_TEMPLATE: "custscript_tsc_emg008_email_template",
            PENDING_APPROVALS_SEARCH: "custscript_tsc_emg008_pending_approvals",
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
            let title = "getInputData(): ";
            try {
                let pendingApprovalsSearch = runtime.getCurrentScript().getParameter({ name: SCRIPT_PARAMETERS.PENDING_APPROVALS_SEARCH });
                log.debug(title + "Pending Approvals Search", pendingApprovalsSearch);
                if (!pendingApprovalsSearch) {
                    throw new Error("Pending Approvals Search is not defined in script parameters.");
                }

                return search.load({ id: pendingApprovalsSearch });

            } catch (e) {
                log.error(title + "Error", e);
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
            let title = "map(): ";
            try {
                let key = mapContext.key;
                let value = JSON.parse(mapContext.value)['values'];
                log.debug(key, value);

                let isDelegateActive = value[TSCCONST.TRANSACTION_BODY_FIELDS.IS_DELEGATE_ACTIVE];
                let recipient;
                let cc;

                if (isDelegateActive == 'T' && value[TSCCONST.TRANSACTION_BODY_FIELDS.ASSIGNED_DELEGATE_APPROVER]) {
                    recipient = value[TSCCONST.TRANSACTION_BODY_FIELDS.ASSIGNED_DELEGATE_APPROVER]['value'];
                    cc = value['nextapprover']['value'];
                } else {
                    recipient = value['nextapprover']['value'];
                }

                let recipients = recipient + ((cc) ? '|' + cc : '');
                mapContext.write({
                    key: recipients,
                    value
                });

            } catch (e) {
                log.error(title + "Error", e);
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
            let title = "reduce(): ";
            try {
                let key = reduceContext.key;
                let values = reduceContext.values;
                let recipient = key.split('|')[0];
                let cc = key.split('|')[1] || '';       
                
                log.debug(title + key, values)

                let transactionData = values.map(value => JSON.parse(value));
                
                let htmlBody = `
        <html>
        <body style="font-family: Arial, sans-serif;">
            <p>Dear Approver,</p>
            
            <p>You have <strong>${transactionData.length}</strong> transaction(s) pending your approval:</p>
            
            <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; margin: 20px 0;">
                <thead style="background-color: #f2f2f2;">
                    <tr>
                        <th>Transaction Number</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Approval Level</th>
                    </tr>
                </thead>
                <tbody>`;

                transactionData.forEach(transaction => {
                    
                    let approvalLevel = transaction[TSCCONST.TRANSACTION_BODY_FIELDS.APPROVAL_LEVEL] || '';
                    
                    htmlBody += `
                    <tr>
                        <td>${transaction.tranid}</td>
                        <td>${transaction.type ? transaction.type.text : ''}</td>
                        <td>$${parseFloat(transaction.total || 0).toLocaleString()}</td>
                        <td>Pending Approval</td>
                        <td>${approvalLevel}</td>
                    </tr>`;
                });

                htmlBody += `
                </tbody>
            </table>
            
            <p><strong>Action Required:</strong> Please log into NetSuite to review and approve these transactions.</p>
            
            <p>Best regards,<br>Approval System</p>
        </body>
        </html>`;

                let author = runtime.getCurrentScript().getParameter({ name: SCRIPT_PARAMETERS.AUTHOR });
                let subject = `Transactions Pending Your Approval - ${new Date().toLocaleDateString()}`;
                
                let emailOptions = {
                    author: parseInt(author),
                    recipients: parseInt(recipient),
                    subject: subject,
                    relatedRecords: {
                        entityId: parseInt(recipient),
                        entityId: parseInt(author)
                    },
                    body: htmlBody
                };
                
                if (cc && cc.trim()) {
                    emailOptions.cc = [parseInt(cc)];
                }
                
                log.debug(title + "Email Options", emailOptions);
                email.send(emailOptions);
                
            } catch (e) {
                log.error(title + "Error", e);
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
            let title = "summarize(): ";
            try {
                log.debug(title + "Summary", {
                    inputSummary: summaryContext.inputSummary,
                    mapSummary: summaryContext.mapSummary,
                    reduceSummary: summaryContext.reduceSummary,
                    usage: summaryContext.usage,
                    yields: summaryContext.yields,
                    seconds: summaryContext.seconds
                });
            } catch (e) {
                log.error(title + "Error", e);
            }
        }

        return { getInputData, map, reduce, summarize }
    });