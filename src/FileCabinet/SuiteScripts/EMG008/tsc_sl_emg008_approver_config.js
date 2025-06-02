/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/log', 'N/search', 'N/record', 'N/redirect', './tsc_cm_constants'],

    (serverWidget, log, search, record, redirect, TSCCONST) => {
        const { FORM_CONST, RECORDS, TRANSACTION_BODY_FIELDS, LISTS } = TSCCONST;

        const FORM_OBJECT = {
            TITLE: 'Approval Configuration',
            TABS: {
                COMPANY_ROLES: {
                    ID: FORM_CONST.TAB.COMPANY_ROLES.ID,
                    LABEL: 'Company Roles',
                    FIELDGROUPS: {
                    },
                    SUBLISTS: {
                        COMPANY_ROLES_LIST: {
                            ID: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.ID,
                            TYPE: serverWidget.SublistType.EDITOR,
                            LABEL: 'Existing Role Configurations',
                            FIELDS: [
                                {
                                    ID: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_APPROVER_CONFIG_ID,
                                    TYPE: serverWidget.FieldType.TEXT,
                                    LABEL: 'ID',
                                    DISPLAY_TYPE: serverWidget.FieldDisplayType.HIDDEN
                                },
                                {
                                    ID: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_ROLE_TYPE_DISPLAY,
                                    TYPE: serverWidget.FieldType.SELECT,
                                    SOURCE: LISTS.ROLE_TYPES,
                                    LABEL: 'Role Type'
                                },
                                {
                                    ID: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_ROLE_PRIMARY_APPROVER_DISPLAY,
                                    TYPE: serverWidget.FieldType.SELECT,
                                    SOURCE: 'employee',
                                    LABEL: 'Primary Approver'
                                },
                            ]
                        }
                    }
                },
                DEPARTMENTS: {
                    ID: FORM_CONST.TAB.DEPARTMENTS.ID,
                    LABEL: 'Departments',
                    FIELDGROUPS: {
                    },
                    SUBLISTS: {
                        DEPARTMENTS_LIST: {
                            ID: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.ID,
                            TYPE: serverWidget.SublistType.EDITOR,
                            LABEL: 'Existing Department Configurations',
                            FIELDS: [
                                {
                                    ID: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_APPROVER_CONFIG_ID,
                                    TYPE: serverWidget.FieldType.TEXT,
                                    LABEL: 'ID',
                                    DISPLAY_TYPE: serverWidget.FieldDisplayType.HIDDEN
                                },
                                {
                                    ID: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_DISPLAY,
                                    TYPE: serverWidget.FieldType.SELECT,
                                    SOURCE: 'department',
                                    LABEL: 'Department'
                                },
                                {
                                    ID: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_TIER1_APPROVER,
                                    TYPE: serverWidget.FieldType.SELECT,
                                    SOURCE: 'employee',
                                    LABEL: 'Tier 1 Approver'
                                },
                                {
                                    ID: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_TIER2_APPROVER,
                                    TYPE: serverWidget.FieldType.SELECT,
                                    SOURCE: 'employee',
                                    LABEL: 'Tier 2 Approver'
                                },
                                {
                                    ID: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_TIER3_APPROVER,
                                    TYPE: serverWidget.FieldType.SELECT,
                                    SOURCE: 'employee',
                                    LABEL: 'Tier 3 Approver'
                                },
                            ]
                        }
                    }
                },
                DELEGATES: {
                    ID: FORM_CONST.TAB.DELEGATES.ID,
                    LABEL: 'Delegates',
                    FIELDGROUPS: {
                    },
                    SUBLISTS: {
                        DELEGATES_LIST: {
                            ID: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.ID,
                            TYPE: serverWidget.SublistType.EDITOR,
                            LABEL: 'Existing Delegate Configurations',
                            FIELDS: [
                                {
                                    ID: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_ID,
                                    TYPE: serverWidget.FieldType.TEXT,
                                    LABEL: 'ID',
                                    DISPLAY_TYPE: serverWidget.FieldDisplayType.HIDDEN
                                },
                                {
                                    ID: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_PRIMARY_APPROVER,
                                    TYPE: serverWidget.FieldType.SELECT,
                                    SOURCE: 'employee',
                                    LABEL: 'Primary Approver'
                                },
                                {
                                    ID: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_APPROVER,
                                    TYPE: serverWidget.FieldType.SELECT,
                                    SOURCE: 'employee',
                                    LABEL: 'Delegate Approver'
                                },
                                {
                                    ID: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_START_DATE,
                                    TYPE: serverWidget.FieldType.DATE,
                                    LABEL: 'Start Date'
                                },
                                {
                                    ID: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_END_DATE,
                                    TYPE: serverWidget.FieldType.DATE,
                                    LABEL: 'End Date'
                                }
                            ]
                        }
                    }
                },
                THRESHOLDS: {
                    ID: FORM_CONST.THRESHOLDS.ID,
                    LABEL: 'Approval Thresholds',
                    FIELDGROUPS: {
                        COMPANY_THRESHOLDS: {
                            ID: 'custpage_company_thresholds_group',
                            LABEL: 'Company Approval Limits',
                            FIELDS: [
                                {
                                    ID: FORM_CONST.THRESHOLDS.FIELDS.COMPANY_AUTO_APPROVAL_LIMIT,
                                    TYPE: serverWidget.FieldType.CURRENCY,
                                    LABEL: 'Company Auto Approval Limit'
                                },
                                {
                                    ID: FORM_CONST.THRESHOLDS.FIELDS.COO_APPROVAL_LIMIT,
                                    TYPE: serverWidget.FieldType.CURRENCY,
                                    LABEL: 'COO Approval Limit'
                                },
                                {
                                    ID: FORM_CONST.THRESHOLDS.FIELDS.CFO_APPROVAL_LIMIT,
                                    TYPE: serverWidget.FieldType.CURRENCY,
                                    LABEL: 'CFO Approval Limit'
                                },
                                {
                                    ID: FORM_CONST.THRESHOLDS.FIELDS.CEO_APPROVAL_LIMIT,
                                    TYPE: serverWidget.FieldType.CURRENCY,
                                    LABEL: 'CEO Approval Limit'
                                }
                            ]
                        },
                        DEPARTMENT_THRESHOLDS: {
                            ID: 'custpage_department_thresholds_group',
                            LABEL: 'Department Approval Limits',
                            FIELDS: [
                                {
                                    ID: FORM_CONST.THRESHOLDS.FIELDS.DEPARTMENT_AUTO_APPROVAL_LIMIT,
                                    TYPE: serverWidget.FieldType.CURRENCY,
                                    LABEL: 'Department Auto Approval Limit'
                                },
                                {
                                    ID: FORM_CONST.THRESHOLDS.FIELDS.DEPARTMENT_TIER1_APPROVAL_LIMIT,
                                    TYPE: serverWidget.FieldType.CURRENCY,
                                    LABEL: 'Department Tier 1 Approval Limit'
                                },
                                {
                                    ID: FORM_CONST.THRESHOLDS.FIELDS.DEPARTMENT_TIER2_APPROVAL_LIMIT,
                                    TYPE: serverWidget.FieldType.CURRENCY,
                                    LABEL: 'Department Tier 2 Approval Limit'
                                },
                                {
                                    ID: FORM_CONST.THRESHOLDS.FIELDS.DEPARTMENT_TIER3_APPROVAL_LIMIT,
                                    TYPE: serverWidget.FieldType.CURRENCY,
                                    LABEL: 'Department Tier 3 Approval Limit'
                                }
                            ]
                        }
                    },
                    SUBLISTS: {
                    }
                }
            },
            BUTTONS: {
                SUBMIT: {
                    ID: FORM_CONST.BUTTON.SUBMIT,
                    LABEL: 'Save Configuration'
                },
                SEARCH: {
                    ID: FORM_CONST.BUTTON.SEARCH,
                    LABEL: 'Search',
                    FUNCTION_NAME: 'searchRecords()'
                }
            }
        };

        const CONFIG_TYPES = {
            COMPANY_ROLE: '1',
            DEPARTMENT: '2',
            DELEGATE: '3'
        };

        const RECORD_TYPES = {
            APPROVER_CONFIG: RECORDS.APPROVER_CONFIG.ID,
            DELEGATE_APPROVERS: RECORDS.DELEGATE_APPROVERS.ID,
            THRESHOLDS: RECORDS.APPROVAL_THRESHOLDS.ID
        };

        const SEARCH_DEFINITIONS = {
            COMPANY_ROLE: {
                recordType: RECORD_TYPES.APPROVER_CONFIG,
                filters: [
                    ['isinactive', 'is', 'F'],
                    'AND',
                    [RECORDS.APPROVER_CONFIG.FIELDS.CONFIG_TYPE, 'anyof', CONFIG_TYPES.COMPANY_ROLE]
                ],
                columns: [
                    search.createColumn({ name: RECORDS.APPROVER_CONFIG.FIELDS.ROLE_TYPE }),
                    search.createColumn({ name: RECORDS.APPROVER_CONFIG.FIELDS.PRIMARY_APPROVER })
                ]
            },
            DEPARTMENT: {
                recordType: RECORD_TYPES.APPROVER_CONFIG,
                filters: [
                    ['isinactive', 'is', 'F'],
                    'AND',
                    [RECORDS.APPROVER_CONFIG.FIELDS.CONFIG_TYPE, 'anyof', CONFIG_TYPES.DEPARTMENT]
                ],
                columns: [
                    search.createColumn({ name: RECORDS.APPROVER_CONFIG.FIELDS.DEPARTMENT }),
                    search.createColumn({ name: RECORDS.APPROVER_CONFIG.FIELDS.PRIMARY_APPROVER }),
                    search.createColumn({ name: RECORDS.APPROVER_CONFIG.FIELDS.SECONDARY_APPROVER }),
                    search.createColumn({ name: RECORDS.APPROVER_CONFIG.FIELDS.TERTIARY_APPROVER })
                ]
            },
            DELEGATE: {
                recordType: RECORD_TYPES.DELEGATE_APPROVERS,
                filters: [
                    ['isinactive', 'is', 'F']
                ],
                columns: [
                    search.createColumn({ name: RECORDS.DELEGATE_APPROVERS.FIELDS.PRIMARY_APPROVER }),
                    search.createColumn({ name: RECORDS.DELEGATE_APPROVERS.FIELDS.DELEGATE_APPROVER }),
                    search.createColumn({ name: RECORDS.DELEGATE_APPROVERS.FIELDS.START_DATE }),
                    search.createColumn({ name: RECORDS.DELEGATE_APPROVERS.FIELDS.END_DATE })
                ]
            },
            THRESHOLDS: {
                recordType: RECORD_TYPES.THRESHOLDS,
                filters: [
                    ['isinactive', 'is', 'F']
                ],
                columns: [
                    search.createColumn({name: RECORDS.APPROVAL_THRESHOLDS.FIELDS.COMP_AUTO_APPROVAL_LIMIT}),
                    search.createColumn({name: RECORDS.APPROVAL_THRESHOLDS.FIELDS.COO_APPROVAL_LIMIT}),
                    search.createColumn({name: RECORDS.APPROVAL_THRESHOLDS.FIELDS.CFO_APPROVAL_LIMIT}),
                    search.createColumn({name: RECORDS.APPROVAL_THRESHOLDS.FIELDS.CEO_APPROVAL_LIMIT}),
                    search.createColumn({name: RECORDS.APPROVAL_THRESHOLDS.FIELDS.DEPT_AUTO_APPROVAL_LIMIT}),
                    search.createColumn({name: RECORDS.APPROVAL_THRESHOLDS.FIELDS.TIER_1_APPROVAL_LIMIT}),
                    search.createColumn({name: RECORDS.APPROVAL_THRESHOLDS.FIELDS.TIER_2_APPROVAL_LIMIT}),
                    search.createColumn({name: RECORDS.APPROVAL_THRESHOLDS.FIELDS.TIER_3_APPROVAL_LIMIT})                    
                ]
            }
        }

        const SUBLIST_MAPPINGS = {
            COMPANY_ROLE: {
                searchType: 'COMPANY_ROLE',
                sublistId: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.ID,
                fieldMappings: [
                    { dataField: 'internalid', sublistFieldId: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_APPROVER_CONFIG_ID },
                    { dataField: RECORDS.APPROVER_CONFIG.FIELDS.ROLE_TYPE, sublistFieldId: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_ROLE_TYPE_DISPLAY },
                    { dataField: RECORDS.APPROVER_CONFIG.FIELDS.PRIMARY_APPROVER, sublistFieldId: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_ROLE_PRIMARY_APPROVER_DISPLAY }
                ]
            },
            DEPARTMENT: {
                searchType: 'DEPARTMENT',
                sublistId: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.ID,
                fieldMappings: [
                    { dataField: 'internalid', sublistFieldId: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_APPROVER_CONFIG_ID },
                    { dataField: RECORDS.APPROVER_CONFIG.FIELDS.DEPARTMENT, sublistFieldId: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_DISPLAY },
                    { dataField: RECORDS.APPROVER_CONFIG.FIELDS.PRIMARY_APPROVER, sublistFieldId: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_TIER1_APPROVER },
                    { dataField: RECORDS.APPROVER_CONFIG.FIELDS.SECONDARY_APPROVER, sublistFieldId: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_TIER2_APPROVER },
                    { dataField: RECORDS.APPROVER_CONFIG.FIELDS.TERTIARY_APPROVER, sublistFieldId: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_TIER3_APPROVER }
                ]
            },
            DELEGATE: {
                searchType: 'DELEGATE',
                sublistId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.ID,
                fieldMappings: [
                    { dataField: 'internalid', sublistFieldId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_ID },
                    { dataField: RECORDS.DELEGATE_APPROVERS.FIELDS.PRIMARY_APPROVER, sublistFieldId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_PRIMARY_APPROVER },
                    { dataField: RECORDS.DELEGATE_APPROVERS.FIELDS.DELEGATE_APPROVER, sublistFieldId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_APPROVER },
                    { dataField: RECORDS.DELEGATE_APPROVERS.FIELDS.START_DATE, sublistFieldId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_START_DATE },
                    { dataField: RECORDS.DELEGATE_APPROVERS.FIELDS.END_DATE, sublistFieldId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_END_DATE }
                ]
            }
        };

        const FIELD_MAPPINGS = {
            THRESHOLDS: {
                searchType: 'THRESHOLDS',                
                fieldMappings: [
                    { dataField: RECORDS.APPROVAL_THRESHOLDS.FIELDS.COMP_AUTO_APPROVAL_LIMIT, fieldId: FORM_CONST.THRESHOLDS.FIELDS.COMPANY_AUTO_APPROVAL_LIMIT },
                    { dataField: RECORDS.APPROVAL_THRESHOLDS.FIELDS.COO_APPROVAL_LIMIT, fieldId: FORM_CONST.THRESHOLDS.FIELDS.COO_APPROVAL_LIMIT },
                    { dataField: RECORDS.APPROVAL_THRESHOLDS.FIELDS.CFO_APPROVAL_LIMIT, fieldId: FORM_CONST.THRESHOLDS.FIELDS.CFO_APPROVAL_LIMIT },
                    { dataField: RECORDS.APPROVAL_THRESHOLDS.FIELDS.CEO_APPROVAL_LIMIT, fieldId: FORM_CONST.THRESHOLDS.FIELDS.CEO_APPROVAL_LIMIT },
                    { dataField: RECORDS.APPROVAL_THRESHOLDS.FIELDS.DEPT_AUTO_APPROVAL_LIMIT, fieldId: FORM_CONST.THRESHOLDS.FIELDS.DEPARTMENT_AUTO_APPROVAL_LIMIT },
                    { dataField: RECORDS.APPROVAL_THRESHOLDS.FIELDS.TIER_1_APPROVAL_LIMIT, fieldId: FORM_CONST.THRESHOLDS.FIELDS.DEPARTMENT_TIER1_APPROVAL_LIMIT },
                    { dataField: RECORDS.APPROVAL_THRESHOLDS.FIELDS.TIER_2_APPROVAL_LIMIT, fieldId: FORM_CONST.THRESHOLDS.FIELDS.DEPARTMENT_TIER2_APPROVAL_LIMIT },
                    { dataField: RECORDS.APPROVAL_THRESHOLDS.FIELDS.TIER_3_APPROVAL_LIMIT, fieldId: FORM_CONST.THRESHOLDS.FIELDS.DEPARTMENT_TIER3_APPROVAL_LIMIT }                    
                ]
            },
        };

        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try {
                // Check if the request is GET or POST
                if (scriptContext.request.method === 'GET') {
                    // Handle GET request
                    createApproverConfigForm(scriptContext);
                } else {
                    // Handle POST request
                    handleFormSubmission(scriptContext);
                }
            } catch (e) {
                log.error({
                    title: 'Error in Approver Configuration Suitelet',
                    details: e.toString()
                });

                // Display error to user
                let form = serverWidget.createForm({
                    title: 'Error Occurred'
                });

                let errorField = form.addField({
                    id: 'custpage_error_message',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'Error Message'
                });

                errorField.defaultValue = '<p style="color: red; font-weight: bold;">An error occurred: ' + e.message + '</p>';

                scriptContext.response.writePage(form);
            }
        };

        /**
         * Creates the approver configuration form
         * @param {Object} scriptContext - The script context
         */
        function createApproverConfigForm(scriptContext) {
            // Create a form using the form object structure
            let form = serverWidget.createForm({
                title: FORM_OBJECT.TITLE
            });

            // Create tabs
            let tabs = {};
            for (let tabKey in FORM_OBJECT.TABS) {
                const tabConfig = FORM_OBJECT.TABS[tabKey];
                tabs[tabKey] = form.addTab({
                    id: tabConfig.ID,
                    label: tabConfig.LABEL
                });
            }

            // Create field groups and fields for each tab
            for (let tabKey in FORM_OBJECT.TABS) {
                const tabConfig = FORM_OBJECT.TABS[tabKey];

                // Process field groups
                if (tabConfig.FIELDGROUPS) {
                    for (let groupKey in tabConfig.FIELDGROUPS) {
                        const groupConfig = tabConfig.FIELDGROUPS[groupKey];

                        // Create field group
                        const fieldGroup = form.addFieldGroup({
                            id: groupConfig.ID,
                            label: groupConfig.LABEL,
                            tab: tabConfig.ID
                        });

                        // Create fields in the group using helper function
                        if (groupConfig.FIELDS) {
                            addFieldsToForm(form, groupConfig.FIELDS, groupConfig.ID);
                        }
                    }
                }

                // Process sublists (commented out for now as you mentioned to add later)

                if (tabConfig.SUBLISTS) {
                    for (let sublistKey in tabConfig.SUBLISTS) {
                        const sublistConfig = tabConfig.SUBLISTS[sublistKey];

                        // Create sublist
                        const sublist = form.addSublist({
                            id: sublistConfig.ID,
                            type: sublistConfig.TYPE,
                            label: sublistConfig.LABEL,
                            tab: tabConfig.ID
                        });

                        // Add fields to sublist
                        if (sublistConfig.FIELDS) {
                            for (let field of sublistConfig.FIELDS) {
                                const fieldObj = sublist.addField({
                                    id: field.ID,
                                    type: field.TYPE,
                                    label: field.LABEL,
                                    source: field.SOURCE
                                });

                                // Set display type if specified
                                if (field.DISPLAY_TYPE) {
                                    fieldObj.updateDisplayType({
                                        displayType: field.DISPLAY_TYPE
                                    });
                                }
                            }
                        }
                    }
                }

            }

            populateSublist(form, 'COMPANY_ROLE');
            populateSublist(form, 'DEPARTMENT');
            populateSublist(form, 'DELEGATE');
            
            // Populate threshold fields
            populateFields(form, 'THRESHOLDS');

            // Add buttons
            if (FORM_OBJECT.BUTTONS) {
                if (FORM_OBJECT.BUTTONS.SUBMIT) {
                    form.addSubmitButton({
                        label: FORM_OBJECT.BUTTONS.SUBMIT.LABEL
                    });
                }

                // Add other buttons
                for (let buttonKey in FORM_OBJECT.BUTTONS) {
                    if (buttonKey !== 'SUBMIT') {
                        const buttonConfig = FORM_OBJECT.BUTTONS[buttonKey];
                        form.addButton({
                            id: buttonConfig.ID,
                            label: buttonConfig.LABEL,
                            functionName: buttonConfig.FUNCTION_NAME
                        });
                    }
                }
            }
            form.clientScriptModulePath = './tsc_cs_emg008_approver_config.js';

            // Write the form to the response
            scriptContext.response.writePage(form);
        }

        /**
         * Helper function to add fields to form based on configuration
         * @param {Object} form - The form object
         * @param {Object} fieldConfig - Field configuration object
         * @param {string} containerId - Container ID for the field (fieldgroup or tab)
         * @returns {Object} The created field object
         */
        function addFieldToForm(form, fieldConfig, containerId) {
            const title = "addFieldToForm";
            log.debug(title, `Adding field: ${fieldConfig.ID} to container: ${containerId}`);

            try {
                // Create the field
                const fieldObj = form.addField({
                    id: fieldConfig.ID,
                    type: fieldConfig.TYPE,
                    label: fieldConfig.LABEL,
                    source: fieldConfig.SOURCE,
                    container: containerId
                });

                // Add options if specified (for select fields)
                if (fieldConfig.OPTIONS) {
                    for (let option of fieldConfig.OPTIONS) {
                        fieldObj.addSelectOption({
                            value: option.VALUE,
                            text: option.TEXT,
                            isSelected: option.IS_SELECTED || false
                        });
                    }
                }

                // Set display type if specified
                if (fieldConfig.DISPLAY_TYPE) {
                    fieldObj.updateDisplayType({
                        displayType: fieldConfig.DISPLAY_TYPE
                    });
                }

                // Set default value if specified
                if (fieldConfig.DEFAULT_VALUE !== undefined) {
                    fieldObj.defaultValue = fieldConfig.DEFAULT_VALUE;
                }

                // Set mandatory if specified
                if (fieldConfig.MANDATORY) {
                    fieldObj.isMandatory = fieldConfig.MANDATORY;
                }

                // Set help text if specified
                if (fieldConfig.HELP_TEXT) {
                    fieldObj.setHelpText({
                        help: fieldConfig.HELP_TEXT
                    });
                }

                log.debug(title, `Successfully added field: ${fieldConfig.ID}`);
                return fieldObj;

            } catch (e) {
                log.error(title, `Error adding field ${fieldConfig.ID}: ${e.message}`);
                throw e;
            }
        }

        /**
         * Helper function to add multiple fields to a form or field group
         * @param {Object} form - The form object
         * @param {Array} fieldsConfig - Array of field configuration objects
         * @param {string} containerId - Container ID for the fields (fieldgroup or tab)
         */
        function addFieldsToForm(form, fieldsConfig, containerId) {
            const title = "addFieldsToForm";
            log.debug(title, `Adding ${fieldsConfig.length} fields to container: ${containerId}`);

            const createdFields = [];

            try {
                for (let fieldConfig of fieldsConfig) {
                    const fieldObj = addFieldToForm(form, fieldConfig, containerId);
                    createdFields.push(fieldObj);
                }

                log.debug(title, `Successfully added ${createdFields.length} fields to container: ${containerId}`);
                return createdFields;

            } catch (e) {
                log.error(title, `Error adding fields to container ${containerId}: ${e.message}`);
                throw e;
            }
        }

        const searchRecords = (searchType) => {
            let title = "searchRecords";
            log.debug(title + ' params: ', { searchType });

            const searchDef = SEARCH_DEFINITIONS[searchType];
            if (!searchDef) {
                log.error(title, 'Search definition not found for type: ' + searchType);
                return [];
            }

            // Always include internalid in columns
            const columns = [search.createColumn({ name: 'internalid' })];

            // Add all the defined columns
            searchDef.columns.forEach(col => {
                columns.push(search.createColumn({ name: col.name }));
            });

            const searchObj = search.create({
                type: searchDef.recordType,
                filters: searchDef.filters,
                columns: columns
            });

            const searchPagedData = searchObj.runPaged({ pageSize: 1000 });
            let results = [];

            for (let i = 0; i < searchPagedData.pageRanges.length; i++) {

                const searchPage = searchPagedData.fetch({ index: i });
                searchPage.data.forEach((result) => {
                    let tempObj = {
                        internalid: result.id
                    };

                    searchDef.columns.forEach((col) => {
                        tempObj[col.name] = result.getValue(col.name);
                    });

                    results.push(tempObj);
                });
            }
            log.debug(title + searchType + ' result: ', results);
            return results;
        };

        /**
         * Handles form submission
         * @param {Object} scriptContext - The script context
         */
        function handleFormSubmission(scriptContext) {
            let title = "handleFormSubmission";
            log.audit(title + ' params: ', { scriptContext });
            const activeTab = scriptContext.request.parameters.selectedtab || FORM_OBJECT.TABS.COMPANY_ROLES.ID;
            log.audit(title + ' activeTab: ', { activeTab });

            if (activeTab === FORM_OBJECT.TABS.COMPANY_ROLES.ID) {
                processCompanyRoleRecords(scriptContext.request);
            } else if (activeTab === FORM_OBJECT.TABS.DEPARTMENTS.ID) {
                processDepartmentRecords(scriptContext.request);
            } else if (activeTab === FORM_OBJECT.TABS.DELEGATES.ID) {
                processDelegateRecords(scriptContext.request);
            } else if (activeTab === FORM_OBJECT.TABS.THRESHOLDS.ID) {
                processThresholdRecords(scriptContext.request);
            }

            //Redirect to the same suitelet after processing
            redirect.toSuitelet({
                scriptId: 'customscript_tsc_sl_emg008_app_config',
                deploymentId: 'customdeploy_tsc_sl_emg008_app_config',
                parameters: {
                    'success': 'true',
                    'selectedtab': activeTab
                }
            });
        }

        function populateSublist(form, tabKey) {
            const title = "populateSublist:";
            log.debug(title + ' params: ', { tabKey });

            const mapping = SUBLIST_MAPPINGS[tabKey];
            log.debug(title + ' mapping: ', mapping);
            if (!mapping) {
                log.error(title, 'Mapping not found for tab key: ' + tabKey);
                return;
            }

            const data = searchRecords(mapping.searchType);
            if (!data || data.length === 0) {
                log.debug(title, 'No data found for search type: ' + mapping.searchType);
                return;
            }

            try {
                // Get sublist
                const sublist = form.getSublist({
                    id: mapping.sublistId
                });

                if (!sublist) {
                    log.error(title, 'Sublist not found with ID: ' + mapping.sublistId);
                    return;
                }

                // Populate sublist based on field mappings
                for (let i = 0; i < data.length; i++) {
                    const record = data[i];
                    for (let fieldMapping of mapping.fieldMappings) {
                        const value = record[fieldMapping.dataField] || '';
                        log.debug(title + tabKey + fieldMapping.dataField + ' value', value);

                        if (value) {
                            sublist.setSublistValue({
                                id: fieldMapping.sublistFieldId,
                                line: i,
                                value: value
                            });

                            log.audit(title + ' setting value', {
                                line: i,
                                field: fieldMapping.sublistFieldId,
                                value: value
                            });
                        }
                    }
                }

                log.debug(title, 'Successfully populated sublist for tab: ' + tabKey);
            } catch (e) {
                log.error(title + ' error', e);
            }
        }

        /**
         * Populates form fields based on field mappings
         * @param {Object} form - The form object
         * @param {string} tabKey - The key identifying which field mapping to use
         */
        function populateFields(form, tabKey) {
            const title = "populateFields:";
            log.debug(title + ' params: ', { tabKey });

            const mapping = FIELD_MAPPINGS[tabKey];
            log.debug(title + ' mapping: ', mapping);
            if (!mapping) {
                log.error(title, 'Field mapping not found for tab key: ' + tabKey);
                return;
            }

            const data = searchRecords(mapping.searchType);
            if (!data || data.length === 0) {
                log.debug(title, 'No data found for search type: ' + mapping.searchType);
                return;
            }

            try {
                // For thresholds, we expect only one record typically, so use the first record
                const record = data[0];
                log.debug(title + ' record data: ', record);

                for (let fieldMapping of mapping.fieldMappings) {
                    const value = record[fieldMapping.dataField] || '';
                    log.debug(title + tabKey + ' ' + fieldMapping.dataField + ' value: ', value);

                    if (value) {
                        // Get the field and set its default value
                        const field = form.getField({
                            id: fieldMapping.fieldId
                        });

                        if (field) {
                            field.defaultValue = value;
                            log.audit(title + ' setting field value', {
                                field: fieldMapping.fieldId,
                                value: value
                            });
                        } else {
                            log.error(title, 'Field not found with ID: ' + fieldMapping.fieldId);
                        }
                    }
                }

                log.debug(title, 'Successfully populated fields for tab: ' + tabKey);
            } catch (e) {
                log.error(title + ' error', e);
            }
        }

        /**
         * Process company role records for CRUD operations
         * @param {Object} request - The request object from scriptContext
         * @returns {Object} Result object with operation details
         */
        function processCompanyRoleRecords(request) {
            const title = "processCompanyRoleRecords";
            log.debug(title, 'Processing company role records');

            // Results tracking
            const results = {
                success: true,
                created: 0,
                updated: 0,
                deleted: 0,
                errors: []
            };

            try {
                // Get the line count from the company roles sublist
                const lineCount = request.getLineCount({
                    group: FORM_OBJECT.TABS.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.ID
                });

                log.debug(title, `Found ${lineCount} lines in company roles sublist`);
                // Track role types to prevent duplicates
                const roleTypes = new Set();
                const submittedIds = new Set();

                // Process each line
                for (let i = 0; i < lineCount; i++) {
                    try {
                        // Get values from the line
                        const configId = request.getSublistValue({
                            group: FORM_OBJECT.TABS.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.ID,
                            name: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_APPROVER_CONFIG_ID,
                            line: i
                        });

                        const roleType = request.getSublistValue({
                            group: FORM_OBJECT.TABS.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.ID,
                            name: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_ROLE_TYPE_DISPLAY,
                            line: i
                        });

                        const primaryApprover = request.getSublistValue({
                            group: FORM_OBJECT.TABS.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.ID,
                            name: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_ROLE_PRIMARY_APPROVER_DISPLAY,
                            line: i
                        });


                        // Validate required fields
                        if (!roleType || !primaryApprover) {
                            results.errors.push(`Line ${i + 1}: Role Type and Primary Approver are required fields`);
                            continue;
                        }

                        // Check for duplicate role types
                        if (roleTypes.has(roleType)) {
                            results.errors.push(`Line ${i + 1}: Duplicate Role Type detected. Each role type must be unique.`);
                            continue;
                        }

                        roleTypes.add(roleType);
                        log.debug(title, `Processing line ${i + 1}: configId=${configId}, roleType=${roleType}, primaryApprover=${primaryApprover}`);

                        // Determine if this is a create or update operation
                        if (configId) {
                            // Update existing record
                            const recordId = record.submitFields({
                                type: RECORD_TYPES.APPROVER_CONFIG,
                                id: configId,
                                values: {
                                    [RECORDS.APPROVER_CONFIG.FIELDS.ROLE_TYPE]: roleType,
                                    [RECORDS.APPROVER_CONFIG.FIELDS.PRIMARY_APPROVER]: primaryApprover
                                }
                            });

                            log.debug(title, `Updated record ID: ${recordId}`);
                            results.updated++;
                        } else {
                            // Create new record
                            const newRecord = record.create({
                                type: RECORD_TYPES.APPROVER_CONFIG,
                                isDynamic: true
                            });

                            // Set field values
                            newRecord.setValue({
                                fieldId: RECORDS.APPROVER_CONFIG.FIELDS.CONFIG_TYPE,
                                value: CONFIG_TYPES.COMPANY_ROLE
                            });

                            newRecord.setValue({
                                fieldId: RECORDS.APPROVER_CONFIG.FIELDS.ROLE_TYPE,
                                value: roleType
                            });

                            newRecord.setValue({
                                fieldId: RECORDS.APPROVER_CONFIG.FIELDS.PRIMARY_APPROVER,
                                value: primaryApprover
                            });


                            // Save the record
                            const recordId = newRecord.save();
                            log.debug(title, `Created new record ID: ${recordId}`);
                            submittedIds.add(String(recordId));
                            results.created++;
                        }
                    } catch (lineError) {
                        log.error(title, `Error processing line ${i}: ${lineError}`);
                        results.errors.push(`Line ${i + 1}: ${lineError.message}`);
                        results.success = false;
                    }
                }

                // Handle deletions - compare existing records with submitted ones
                // We need to find records that exist in the database but weren't in the submitted form
                const existingRecords = searchRecords('COMPANY_ROLE');

                // Collect all submitted IDs
                for (let i = 0; i < lineCount; i++) {
                    const configId = request.getSublistValue({
                        group: FORM_OBJECT.TABS.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.ID,
                        name: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_APPROVER_CONFIG_ID,
                        line: i
                    });
                    log.debug(title, `Submitted ID for line ${i}: ${configId}`);

                    if (configId) {
                        log.debug(title, `Adding submitted ID: ${configId}`);
                        submittedIds.add(String(configId));
                    }
                }
                log.debug(title + 'Submitted IDS vs Existing IDS', { submittedIds, existingRecords });

                // Find records to delete (exist in DB but not in submitted form)
                for (const existingRecord of existingRecords) {
                    if (!submittedIds.has(String(existingRecord.internalid))) {
                        log.debug(title + `Deleting record ID: ${existingRecord.internalid}`, JSON.stringify([...submittedIds]));
                        // Delete/inactivate the record
                        record.submitFields({
                            type: RECORD_TYPES.APPROVER_CONFIG,
                            id: existingRecord.internalid,
                            values: {
                                'isinactive': 'T'
                            }
                        });

                        log.debug(title, `Marked record as inactive: ${existingRecord.internalid}`);
                        results.deleted++;
                    }
                }

            } catch (e) {
                log.error(title, `Error in processCompanyRoleRecords: ${e}`);
                results.success = false;
                results.errors.push(`General error: ${e.message}`);
            }

            // Return results
            log.debug(title, `Results: ${JSON.stringify(results)}`);
            return results;
        }
        /**
         * Process department records for CRUD operations
         * @param {Object} request - The request object from scriptContext
         * @returns {Object} Result object with operation details
         */
        function processDepartmentRecords(request) {
            const title = "processDepartmentRecords";
            log.debug(title, 'Processing department records');

            // Results tracking
            const results = {
                success: true,
                created: 0,
                updated: 0,
                deleted: 0,
                errors: []
            };

            try {
                // Get the line count from the departments sublist
                const lineCount = request.getLineCount({
                    group: FORM_OBJECT.TABS.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.ID
                });

                log.debug(title, `Found ${lineCount} lines in departments sublist`);

                // Track departments to prevent duplicates
                const departments = new Set();
                const submittedIds = new Set();

                // Process each line
                for (let i = 0; i < lineCount; i++) {
                    try {
                        // Get values from the line
                        const configId = request.getSublistValue({
                            group: FORM_OBJECT.TABS.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.ID,
                            name: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_APPROVER_CONFIG_ID,
                            line: i
                        });

                        const department = request.getSublistValue({
                            group: FORM_OBJECT.TABS.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.ID,
                            name: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_DISPLAY,
                            line: i
                        });

                        const tier1Approver = request.getSublistValue({
                            group: FORM_OBJECT.TABS.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.ID,
                            name: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_TIER1_APPROVER,
                            line: i
                        });

                        const tier2Approver = request.getSublistValue({
                            group: FORM_OBJECT.TABS.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.ID,
                            name: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_TIER2_APPROVER,
                            line: i
                        });

                        const tier3Approver = request.getSublistValue({
                            group: FORM_OBJECT.TABS.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.ID,
                            name: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_TIER3_APPROVER,
                            line: i
                        });


                        // Validate required fields
                        if (!department) {
                            results.errors.push(`Line ${i + 1}: Department is a required field`);
                            continue;
                        }

                        if (!tier1Approver && !tier2Approver && !tier3Approver) {
                            results.errors.push(`Line ${i + 1}: At least one approver tier must be specified`);
                            continue;
                        }

                        // Check for duplicate departments
                        if (departments.has(department)) {
                            results.errors.push(`Line ${i + 1}: Duplicate Department detected. Each department must be unique.`);
                            continue;
                        }

                        departments.add(department);

                        log.debug(title, `Processing line ${i + 1}: configId=${configId}, department=${department}, approvers=${tier1Approver}/${tier2Approver}/${tier3Approver}`);

                        // Determine if this is a create or update operation
                        if (configId) {
                            // Update existing record
                            const recordId = record.submitFields({
                                type: RECORD_TYPES.APPROVER_CONFIG,
                                id: configId,
                                values: {
                                    [RECORDS.APPROVER_CONFIG.FIELDS.DEPARTMENT]: department,
                                    [RECORDS.APPROVER_CONFIG.FIELDS.PRIMARY_APPROVER]: tier1Approver || '',
                                    [RECORDS.APPROVER_CONFIG.FIELDS.SECONDARY_APPROVER]: tier2Approver || '',
                                    [RECORDS.APPROVER_CONFIG.FIELDS.TERTIARY_APPROVER]: tier3Approver || ''
                                }
                            });

                            log.debug(title, `Updated record ID: ${recordId}`);
                            submittedIds.add(String(configId));
                            results.updated++;
                        } else {
                            // Create new record
                            const newRecord = record.create({
                                type: RECORD_TYPES.APPROVER_CONFIG,
                                isDynamic: true
                            });

                            // Set field values
                            newRecord.setValue({
                                fieldId: RECORDS.APPROVER_CONFIG.FIELDS.CONFIG_TYPE,
                                value: CONFIG_TYPES.DEPARTMENT
                            });

                            newRecord.setValue({
                                fieldId: RECORDS.APPROVER_CONFIG.FIELDS.DEPARTMENT,
                                value: department
                            });

                            if (tier1Approver) {
                                newRecord.setValue({
                                    fieldId: RECORDS.APPROVER_CONFIG.FIELDS.PRIMARY_APPROVER,
                                    value: tier1Approver
                                });
                            }

                            if (tier2Approver) {
                                newRecord.setValue({
                                    fieldId: RECORDS.APPROVER_CONFIG.FIELDS.SECONDARY_APPROVER,
                                    value: tier2Approver
                                });
                            }

                            if (tier3Approver) {
                                newRecord.setValue({
                                    fieldId: RECORDS.APPROVER_CONFIG.FIELDS.TERTIARY_APPROVER,
                                    value: tier3Approver
                                });
                            }


                            // Save the record
                            const recordId = newRecord.save();
                            log.debug(title, `Created new record ID: ${recordId}`);
                            submittedIds.add(String(recordId));
                            results.created++;
                        }
                    } catch (lineError) {
                        log.error(title, `Error processing line ${i}: ${lineError}`);
                        results.errors.push(`Line ${i + 1}: ${lineError.message}`);
                        results.success = false;
                    }
                }

                // Handle deletions - compare existing records with submitted ones
                const existingRecords = searchRecords('DEPARTMENT');
                log.debug(title + 'Submitted IDS vs Existing IDS', {
                    submittedIds: [...submittedIds],
                    existingRecords: existingRecords.map(record => record.internalid)
                });

                // Find records to delete (exist in DB but not in submitted form)
                for (const existingRecord of existingRecords) {
                    if (!submittedIds.has(String(existingRecord.internalid))) {
                        log.debug(title + ` Deleting record ID: ${existingRecord.internalid}`, JSON.stringify([...submittedIds]));

                        // Delete/inactivate the record
                        record.submitFields({
                            type: RECORD_TYPES.APPROVER_CONFIG,
                            id: existingRecord.internalid,
                            values: {
                                'isinactive': 'T'
                            }
                        });

                        log.debug(title, `Marked record as inactive: ${existingRecord.internalid}`);
                        results.deleted++;
                    }
                }

            } catch (e) {
                log.error(title, `Error in processDepartmentRecords: ${e}`);
                results.success = false;
                results.errors.push(`General error: ${e.message}`);
            }

            // Return results
            log.debug(title, `Results: ${JSON.stringify(results)}`);
            return results;
        }

        /**
         * Process delegate records for CRUD operations
         * @param {Object} request - The request object from scriptContext
         * @returns {Object} Result object with operation details
         */
        function processDelegateRecords(request) {
            const title = "processDelegateRecords";
            log.debug(title, 'Processing delegate records');

            // Results tracking
            const results = {
                success: true,
                created: 0,
                updated: 0,
                deleted: 0,
                errors: []
            };

            try {
                // Get the line count from the delegates sublist
                const lineCount = request.getLineCount({
                    group: FORM_OBJECT.TABS.DELEGATES.SUBLISTS.DELEGATES_LIST.ID
                });

                log.debug(title, `Found ${lineCount} lines in delegates sublist`);

                // Track delegate combinations to prevent duplicates
                const delegateCombinations = new Set();
                const submittedIds = new Set();

                // Process each line
                for (let i = 0; i < lineCount; i++) {
                    try {
                        // Get values from the line
                        const delegateId = request.getSublistValue({
                            group: FORM_OBJECT.TABS.DELEGATES.SUBLISTS.DELEGATES_LIST.ID,
                            name: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_ID,
                            line: i
                        });

                        const primaryApprover = request.getSublistValue({
                            group: FORM_OBJECT.TABS.DELEGATES.SUBLISTS.DELEGATES_LIST.ID,
                            name: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_PRIMARY_APPROVER,
                            line: i
                        });

                        const delegateApprover = request.getSublistValue({
                            group: FORM_OBJECT.TABS.DELEGATES.SUBLISTS.DELEGATES_LIST.ID,
                            name: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_APPROVER,
                            line: i
                        });

                        const startDate = request.getSublistValue({
                            group: FORM_OBJECT.TABS.DELEGATES.SUBLISTS.DELEGATES_LIST.ID,
                            name: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_START_DATE,
                            line: i
                        });

                        const endDate = request.getSublistValue({
                            group: FORM_OBJECT.TABS.DELEGATES.SUBLISTS.DELEGATES_LIST.ID,
                            name: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_END_DATE,
                            line: i
                        });

                        // Validate required fields
                        if (!primaryApprover || !delegateApprover) {
                            results.errors.push(`Line ${i + 1}: Primary Approver and Delegate Approver are required fields`);
                            continue;
                        }

                        if (!startDate) {
                            results.errors.push(`Line ${i + 1}: Start Date is required`);
                            continue;
                        }

                        // Validate that primary and delegate approvers are different
                        if (primaryApprover === delegateApprover) {
                            results.errors.push(`Line ${i + 1}: Primary Approver and Delegate Approver cannot be the same person`);
                            continue;
                        }

                        // Check for duplicate delegate combinations for the same period
                        const delegateKey = `${primaryApprover}_${delegateApprover}_${startDate}_${endDate || 'indefinite'}`;
                        if (delegateCombinations.has(delegateKey)) {
                            results.errors.push(`Line ${i + 1}: Duplicate delegation found. The same delegation cannot be defined multiple times.`);
                            continue;
                        }

                        delegateCombinations.add(delegateKey);

                        // Date validation
                        if (startDate && endDate) {
                            const startDateObj = new Date(startDate);
                            const endDateObj = new Date(endDate);

                            if (startDateObj > endDateObj) {
                                results.errors.push(`Line ${i + 1}: End Date must be after Start Date`);
                                continue;
                            }
                        }

                        log.debug(title, `Processing line ${i + 1}: delegateId=${delegateId}, primaryApprover=${primaryApprover}, delegateApprover=${delegateApprover}`);

                        // Determine if this is a create or update operation
                        if (delegateId) {
                            // Update existing record
                            const recordId = record.submitFields({
                                type: RECORD_TYPES.DELEGATE_APPROVERS,
                                id: delegateId,
                                values: {
                                    [RECORDS.DELEGATE_APPROVERS.FIELDS.PRIMARY_APPROVER]: primaryApprover,
                                    [RECORDS.DELEGATE_APPROVERS.FIELDS.DELEGATE_APPROVER]: delegateApprover,
                                    [RECORDS.DELEGATE_APPROVERS.FIELDS.START_DATE]: startDate,
                                    [RECORDS.DELEGATE_APPROVERS.FIELDS.END_DATE]: endDate || ''
                                }
                            });

                            log.debug(title, `Updated record ID: ${recordId}`);
                            submittedIds.add(String(delegateId));
                            results.updated++;
                        } else {
                            log.debug(title, `Creating new record: primaryApprover=${primaryApprover}, delegateApprover=${delegateApprover}, startDate=${startDate}, endDate=${endDate}`);
                            // Create new record
                            const newRecord = record.create({
                                type: RECORD_TYPES.DELEGATE_APPROVERS,
                                isDynamic: true
                            });

                            // Set field values
                            newRecord.setValue({
                                fieldId: RECORDS.DELEGATE_APPROVERS.FIELDS.PRIMARY_APPROVER,
                                value: primaryApprover
                            });

                            newRecord.setValue({
                                fieldId: RECORDS.DELEGATE_APPROVERS.FIELDS.DELEGATE_APPROVER,
                                value: delegateApprover
                            });

                            newRecord.setText({
                                fieldId: RECORDS.DELEGATE_APPROVERS.FIELDS.START_DATE,
                                text: startDate
                            });

                            if (endDate) {
                                newRecord.setText({
                                    fieldId: RECORDS.DELEGATE_APPROVERS.FIELDS.END_DATE,
                                    text: endDate
                                });
                            }

                            // Save the record
                            const recordId = newRecord.save();
                            log.debug(title, `Created new record ID: ${recordId}`);
                            submittedIds.add(String(recordId));
                            results.created++;
                        }
                    } catch (lineError) {
                        log.error(title, `Error processing line ${i}: ${lineError}`);
                        results.errors.push(`Line ${i + 1}: ${lineError.message}`);
                        results.success = false;
                    }
                }

                // Handle deletions - compare existing records with submitted ones
                const existingRecords = searchRecords('DELEGATE');
                log.debug(title + 'Submitted IDS vs Existing IDS', {
                    submittedIds: [...submittedIds],
                    existingRecords: existingRecords.map(record => record.internalid)
                });

                // Find records to delete (exist in DB but not in submitted form)
                for (const existingRecord of existingRecords) {
                    if (!submittedIds.has(String(existingRecord.internalid))) {
                        log.debug(title + ` Deleting record ID: ${existingRecord.internalid}`, JSON.stringify([...submittedIds]));

                        // Delete/inactivate the record
                        record.submitFields({
                            type: RECORD_TYPES.DELEGATE_APPROVERS,
                            id: existingRecord.internalid,
                            values: {
                                'isinactive': 'T'
                            }
                        });

                        log.debug(title, `Marked record as inactive: ${existingRecord.internalid}`);
                        results.deleted++;
                    }
                }

            } catch (e) {
                log.error(title, `Error in processDelegateRecords: ${e}`);
                results.success = false;
                results.errors.push(`General error: ${e.message}`);
            }

            // Return results
            log.debug(title, `Results: ${JSON.stringify(results)}`);
            return results;
        }

        /**
         * Process threshold records for CRUD operations
         * @param {Object} request - The request object from scriptContext
         * @returns {Object} Result object with operation details
         */
        function processThresholdRecords(request) {
            const title = "processThresholdRecords";
            log.debug(title, 'Processing threshold records');
            log.emergency(title + 'parameters', JSON.stringify(request.parameters));

            // Results tracking
            const results = {
                success: true,
                created: 0,
                updated: 0,
                deleted: 0,
                errors: []
            };

            try {
                // Get the field mappings for thresholds
                const mapping = FIELD_MAPPINGS.THRESHOLDS;
                if (!mapping || !mapping.fieldMappings) {
                    log.error(title, 'No field mappings found for thresholds');
                    results.success = false;
                    results.errors.push('No field mappings configured for thresholds');
                    return results;
                }

                // Check if threshold record already exists
                const existingRecords = searchRecords('THRESHOLDS');
                log.debug(title, `Found ${existingRecords.length} existing threshold records`);
                
                if (existingRecords && existingRecords.length > 0) {
                    // Update existing record
                    const existingRecordId = existingRecords[0].internalid;
                    log.debug(title, `Updating existing threshold record ID: ${existingRecordId}`);
                    
                    // Collect all field values to update
                    const valuesToUpdate = {};
                    for (let fieldMapping of mapping.fieldMappings) {
                        log.debug(title + ' fieldMapping', fieldMapping.fieldId);
                        const fieldValue = request.parameters[fieldMapping.fieldId];
                        log.debug(title, `Field ${fieldMapping.fieldId} value: ${fieldValue}`);
                        
                        if (fieldValue !== null && fieldValue !== undefined && fieldValue !== '') {
                            valuesToUpdate[fieldMapping.dataField] = fieldValue;
                            log.debug(title, `Setting ${fieldMapping.dataField} = ${fieldValue}`);
                        }
                    }
                    
                    // Submit the updates
                    if (Object.keys(valuesToUpdate).length > 0) {
                        const recordId = record.submitFields({
                            type: RECORD_TYPES.THRESHOLDS,
                            id: existingRecordId,
                            values: valuesToUpdate
                        });
                        
                        log.debug(title, `Updated record ID: ${recordId}`);
                        results.updated++;
                    } else {
                        log.debug(title, 'No threshold values to update');
                    }
                    
                } else {
                    // Create new record
                    log.debug(title, 'Creating new threshold record');
                    
                    const newRecord = record.create({
                        type: RECORD_TYPES.THRESHOLDS,
                        isDynamic: true
                    });
                    
                    // Set field values from form
                    for (let fieldMapping of mapping.fieldMappings) {
                        const fieldValue = request.parameters[fieldMapping.fieldId];
                        log.debug(title, `Field ${fieldMapping.fieldId} value: ${fieldValue}`);
                        
                        if (fieldValue !== null && fieldValue !== undefined && fieldValue !== '') {
                            newRecord.setValue({
                                fieldId: fieldMapping.dataField,
                                value: fieldValue
                            });
                            log.debug(title, `Setting ${fieldMapping.dataField} = ${fieldValue}`);
                        }
                    }
                    
                    // Save the record
                    const recordId = newRecord.save();
                    log.debug(title, `Created new threshold record ID: ${recordId}`);
                    results.created++;
                }

            } catch (e) {
                log.error(title, `Error in processThresholdRecords: ${e}`);
                results.success = false;
                results.errors.push(`General error: ${e.message}`);
            }

            // Return results
            log.debug(title, `Results: ${JSON.stringify(results)}`);
            return results;
        }

        return { onRequest };
    });