/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/search', 'N/log', 'N/record', './tsc_cm_constants.js'],

    (search, log, record, TSCCONST) => {

        const CONFIG_TYPE_MAPPING = {
            COMPANY: 1,
            DEPARTMENT: 2
        }

        // Marketing Department ID - used for override logic
        const MARKETING_DEPT_ID = '7'; // Update this based on actual Marketing Dept ID

        const FIELD_MAPPING = {
            PRIMARY_APPROVER: 'CUSTRECORD_TSC_PRIMARY_APPROVER',
            SECONDARY_APPROVER: 'CUSTRECORD_TSC_SECONDARY_APPROVER',
            TERTIARY_APPROVER: 'CUSTRECORD_TSC_TERTIARY_APPROVER'
        }
        const ROLE_TYPE_MAPPING = {
            COO: 1,
            CFO: 2,
            CEO: 3,
        }

        // Tier configuration mapping for better maintainability
        const TIER_CONFIG = {
            DEPARTMENT: [
                { field: 'primaryApprover', level: 'TIER 1' },
                { field: 'secondaryApprover', level: 'TIER 2' },
                { field: 'tertiaryApprover', level: 'TIER 3' }
            ],
            COMPANY: [
                {
                    field: 'primaryApprover', getRoleLevel: (roleType) => {
                        switch (parseInt(roleType)) {
                            case ROLE_TYPE_MAPPING.COO: return 'TIER 1';
                            case ROLE_TYPE_MAPPING.CFO: return 'TIER 2';
                            case ROLE_TYPE_MAPPING.CEO: return 'TIER 3';
                            default: return 'UNKNOWN';
                        }
                    }
                }
            ]
        }

        // Transaction search configuration for different approval types
        const TRANSACTION_SEARCH_CONFIG = {
            DEPARTMENT: {
                recordType: 'vendorbill',
                transactionType: 'VendBill',
                pendingStatus: 'VendBill:D', // Pending approval status
                baseFilters: [
                    ['type', 'anyof', 'VendBill'],
                    'AND',
                    ['mainline', 'is', 'T'],
                    'AND',
                    ['status', 'anyof', 'VendBill:D']
                ],
                requiresDepartment: true,
                name: 'vendor bills'
            },
            COMPANY: {
                recordType: 'purchaseorder',
                transactionType: 'PurchOrd',
                pendingStatus: 'PurchOrd:A', // Pending approval status
                baseFilters: [
                    ['type', 'anyof', 'PurchOrd'],
                    'AND',
                    ['mainline', 'is', 'T'],
                    'AND',
                    ['status', 'anyof', 'PurchOrd:A']
                ],
                requiresDepartment: false,
                name: 'purchase orders'
            }
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
            try {
                log.audit("==START==", 'getInputData()');
                let title = 'getInputData(): ';
                return retrieveRecentApproverChange();
            } catch (e) {
                log.error('getInputData Error', e.message);
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
            try {
                let title = 'map(): ';
                log.audit("==START==", title + 'Processing key: ' + mapContext.key);
                log.debug('key:' + mapContext.key, mapContext.value);
                let mapValue = JSON.parse(mapContext.value);

                // Helper function to safely get field value
                const getFieldValue = (fieldObj) => {
                    return fieldObj && fieldObj.value ? fieldObj.value : '';
                };

                let approverConfigObj = {
                    configType: getFieldValue(mapValue['values']['custrecordtsc_config_type']),
                    department: getFieldValue(mapValue['values']['custrecord_tsc_department']),
                    roleType: getFieldValue(mapValue['values']['custrecord_tsc_role_type']),
                    primaryApprover: getFieldValue(mapValue['values']['custrecord_tsc_primary_approver']),
                    secondaryApprover: getFieldValue(mapValue['values']['custrecord_tsc_secondary_approver']),
                    tertiaryApprover: getFieldValue(mapValue['values']['custrecord_tsc_tertiary_approver']),
                }
                log.debug('approverConfigObj', approverConfigObj);

                // Helper function to create and write approver objects
                const writeApproverData = (approver, department, approvalLevel) => {
                    // Skip if approver is empty
                    if (!approver) {
                        log.debug(title + 'Skipping empty approver for level:', approvalLevel);
                        return;
                    }

                    const approverObj = {
                        approver: approver,
                        approvalLevel: approvalLevel
                    };

                    // Add department for department-type configurations
                    if (department) {
                        approverObj.department = department;
                    }

                    // Generate consistent key format
                    const keyParts = [approver, approvalLevel];
                    if (department) {
                        keyParts.splice(1, 0, department); // Insert department in the middle
                    }
                    const key = keyParts.join('-');

                    mapContext.write({
                        key: key,
                        value: approverObj
                    });

                    log.debug(title + 'Written approver data', { key: key, value: approverObj });
                };

                // Process based on configuration type
                if (approverConfigObj.configType == CONFIG_TYPE_MAPPING.DEPARTMENT) {
                    // Special handling for Marketing department config changes
                    if (approverConfigObj.department === MARKETING_DEPT_ID) {
                        log.audit(title + 'Processing Marketing department config', {
                            message: 'This will affect both Marketing dept bills and marketing override bills',
                            department: approverConfigObj.department
                        });
                    }

                    // Process department-based approvers using tier configuration
                    TIER_CONFIG.DEPARTMENT.forEach(tierConfig => {
                        const approver = approverConfigObj[tierConfig.field];
                        writeApproverData(approver, approverConfigObj.department, tierConfig.level);
                    });
                } else {
                    // Process company role-based approvers
                    const companyConfig = TIER_CONFIG.COMPANY[0];
                    const approver = approverConfigObj[companyConfig.field];
                    const approvalLevel = companyConfig.getRoleLevel(approverConfigObj.roleType);

                    writeApproverData(approver, null, approvalLevel);
                }

            } catch (e) {
                log.error('map Error', e.message);
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
            try {
                let title = 'reduce(): ';
                let key = reduceContext.key;
                let value = JSON.parse(reduceContext.values[0]);
                
                log.debug(title + 'Processing key', { key: key, value: value });

                // Validate required fields
                if (!value.approver || !value.approvalLevel) {
                    log.error(title + 'Missing required fields', { key: key, value: value });
                    return;
                }

                // Determine configuration type and retrieve transactions
                const configType = value.department ? 'DEPARTMENT' : 'COMPANY';
                const searchConfig = TRANSACTION_SEARCH_CONFIG[configType];

                if (!searchConfig) {
                    log.error(title + 'Unknown configuration type', { configType: configType, key: key });
                    return;
                }

                // Get transactions that need approver updates
                const transactionsToUpdate = retrieveTransactionsToUpdate({
                    config: searchConfig,
                    approvalLevel: value.approvalLevel,
                    approver: value.approver,
                    department: value.department
                });

                log.audit(title + `Found ${transactionsToUpdate.length} ${searchConfig.name} to update`, {
                    configType: configType,
                    approvalLevel: value.approvalLevel,
                    approver: value.approver,
                    department: value.department || 'N/A',
                    transactionIds: transactionsToUpdate
                });

                // TODO: Add logic to actually update the transactions                
                updateTransactionApprovers({
                    transactionIds: transactionsToUpdate,
                    newApprover: value.approver,
                    config: searchConfig
                });

            } catch (e) {
                log.error('reduce Error', { error: e.message, stack: e.stack, key: reduceContext.key });
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

        //        const searchPendingPO = (oldApprover, newApprover, department,)

        const retrieveRecentApproverChange = () => {
            const { RECORDS } = TSCCONST;

            const filters = [
                ['isinactive', 'is', 'F'],
                'AND',
                ['lastmodified', 'after', 'yesterday'],
            ];

            const columns = [
                search.createColumn({ name: RECORDS.APPROVER_CONFIG.FIELDS.CONFIG_TYPE }),
                search.createColumn({ name: RECORDS.APPROVER_CONFIG.FIELDS.DEPARTMENT }),
                search.createColumn({ name: RECORDS.APPROVER_CONFIG.FIELDS.ROLE_TYPE }),
                search.createColumn({ name: RECORDS.APPROVER_CONFIG.FIELDS.PRIMARY_APPROVER }),
                search.createColumn({ name: RECORDS.APPROVER_CONFIG.FIELDS.SECONDARY_APPROVER }),
                search.createColumn({ name: RECORDS.APPROVER_CONFIG.FIELDS.TERTIARY_APPROVER })
            ];

            return search.create({
                type: RECORDS.APPROVER_CONFIG.ID,
                filters: filters,
                columns: columns
            });
        }

        /**
         * Generic function to retrieve transactions that need approver updates
         * @param {Object} params - Search parameters
         * @param {Object} params.config - Transaction search configuration
         * @param {string} params.approvalLevel - Current approval level
         * @param {string} params.approver - New approver ID
         * @param {string} [params.department] - Department ID (for department-based approvals)
         * @returns {Array} Array of transaction IDs that need updates
         */
        const retrieveTransactionsToUpdate = (params) => {
            const title = 'retrieveTransactionsToUpdate(): ';
            
            try {
                const { config, approvalLevel, approver, department } = params;
                
                // Validate required parameters
                if (!config || !approvalLevel || !approver) {
                    log.error(title + 'Missing required parameters', params);
                    return [];
                }

                // Build search filters
                let searchFilters = [...config.baseFilters];
                
                // Add approval level filter
                searchFilters.push('AND', ['custbody_tsc_approval_level', 'is', approvalLevel]);
                
                // Add next approver filter (exclude current approver to avoid duplicates)
                searchFilters.push('AND', ['nextapprover', 'noneof', approver]);
                
                // Add department filter if required and provided
                if (config.requiresDepartment) {
                    if (!department) {
                        log.error(title + 'Department required but not provided', params);
                        return [];
                    }

                    // Enhanced filter logic for marketing override support
                    if (department === MARKETING_DEPT_ID) {
                        // For Marketing department, include both:
                        // 1. Bills with Marketing department directly
                        // 2. Bills with marketing override checkbox checked
                        searchFilters.push('AND');
                        searchFilters.push([
                            ['department', 'anyof', department],
                            'OR',
                            ['custbody_tsc_is_marketing_bill', 'is', 'T']
                        ]);
                        log.debug(title + 'Marketing dept search', 'Including marketing override bills');
                    } else {
                        // For non-Marketing departments:
                        // Only include bills for this dept WITHOUT marketing override
                        searchFilters.push('AND', ['department', 'anyof', department]);
                        searchFilters.push('AND', [
                            ['custbody_tsc_is_marketing_bill', 'is', 'F'],
                            'OR',
                            ['custbody_tsc_is_marketing_bill', 'is', '@NONE@']
                        ]);
                        log.debug(title + 'Non-Marketing dept search', 'Excluding marketing override bills');
                    }
                }

                log.debug(title + 'Search filters', { 
                    recordType: config.recordType, 
                    filters: searchFilters,
                    params: params 
                });

                // Create and execute search
                const transactionSearch = search.create({
                    type: config.recordType,
                    filters: searchFilters,
                    columns: [
                        search.createColumn({ name: 'internalid' }),
                        search.createColumn({ name: 'tranid' }),
                        search.createColumn({ name: 'entity' }),
                        search.createColumn({ name: 'total' }),
                        search.createColumn({ name: 'custbody_tsc_is_marketing_bill' }),
                        search.createColumn({ name: 'department' })
                    ]
                });

                // Execute search with pagination for large result sets
                const results = [];
                const searchPagedData = transactionSearch.runPaged({ pageSize: 1000 });
                
                log.debug(title + 'Search execution', {
                    pageCount: searchPagedData.pageRanges.length,
                    totalCount: searchPagedData.count
                });

                for (let i = 0; i < searchPagedData.pageRanges.length; i++) {
                    const searchPage = searchPagedData.fetch({ index: i });
                    searchPage.data.forEach((result) => {
                        results.push({
                            id: result.id,
                            tranid: result.getValue('tranid'),
                            entity: result.getText('entity'),
                            total: result.getValue('total'),
                            isMarketingBill: result.getValue('custbody_tsc_is_marketing_bill'),
                            department: result.getText('department')
                        });
                    });
                }

                log.debug(title + 'Search results', {
                    recordType: config.recordType,
                    resultCount: results.length,
                    sampleResults: results.slice(0, 5) // Log first 5 for debugging
                });

                return results.map(r => r.id); // Return just IDs for backward compatibility

            } catch (e) {
                log.error(title + 'Error in transaction search', {
                    error: e.message,
                    stack: e.stack,
                    params: params
                });
                return [];
            }
        }

        /**
         * Updates transaction approvers with dynamic record type detection
         * @param {Object} params - Update parameters
         * @param {Array} params.transactionIds - Array of transaction IDs to update
         * @param {string} params.newApprover - New approver ID
         * @param {Object} params.config - Transaction configuration object
         */
        const updateTransactionApprovers = (params) => {
            const title = 'updateTransactionApprovers(): ';
            
            if (!params || !params.transactionIds || params.transactionIds.length === 0) {
                log.debug(title + 'No transactions to update');
                return;
            }

            const { transactionIds, newApprover, config } = params;

            if (!newApprover || !config) {
                log.error(title + 'Missing required parameters', params);
                return;
            }

            log.audit(title + `Starting update of ${transactionIds.length} ${config.name}`, {
                transactionCount: transactionIds.length,
                newApprover: newApprover,
                recordType: config.recordType,
                transactionIds: transactionIds.slice(0, 10) // Log first 10 for debugging
            });

            let successCount = 0;
            let errorCount = 0;
            const errors = [];

            // Process each transaction
            transactionIds.forEach((transactionId, index) => {
                try {
                    log.debug(title + `Processing transaction ${index + 1}/${transactionIds.length}`, {
                        transactionId: transactionId,
                        recordType: config.recordType,
                        newApprover: newApprover
                    });

                    const updatedId = record.submitFields({
                        type: config.recordType, // Dynamic record type from config
                        id: transactionId,
                        values: {
                            nextapprover: newApprover
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });

                    log.debug(title + 'Transaction updated successfully', { 
                        transactionId: transactionId,
                        updatedId: updatedId,
                        recordType: config.recordType
                    });
                    
                    successCount++;

                } catch (updateError) {
                    errorCount++;
                    const errorMsg = `Failed to update ${config.recordType} ${transactionId}: ${updateError.message}`;
                    errors.push(errorMsg);
                    
                    log.error(title + 'Transaction update failed', {
                        transactionId: transactionId,
                        recordType: config.recordType,
                        error: updateError.message,
                        stack: updateError.stack
                    });
                }
            });

            // Summary logging
            log.audit(title + `Update process completed for ${config.name}`, {
                totalTransactions: transactionIds.length,
                successCount: successCount,
                errorCount: errorCount,
                recordType: config.recordType,
                newApprover: newApprover
            });

            if (errors.length > 0) {
                log.error(title + 'Update errors summary', {
                    errorCount: errors.length,
                    errors: errors.slice(0, 5), // Log first 5 errors
                    totalErrors: errors.length
                });
            }

            return {
                success: successCount,
                errors: errorCount,
                total: transactionIds.length
            };
        }

        return { getInputData, map, reduce, summarize }

    });
