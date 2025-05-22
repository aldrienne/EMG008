/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/log', 'N/search', 'N/record', 'N/redirect', './tsc_cm_constants'],

    (serverWidget, log, search, record, redirect, TSCCONST) => {
        const { FORM_CONST } = TSCCONST;

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
                                    SOURCE: 'customlist_tsc_role_types',
                                    LABEL: 'Role Type'
                                },
                                {
                                    ID: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_ROLE_PRIMARY_APPROVER_DISPLAY,
                                    TYPE: serverWidget.FieldType.SELECT,
                                    SOURCE: 'employee',
                                    LABEL: 'Primary Approver'
                                },
                                {
                                    ID: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_EFFECTIVE_START_DATE,
                                    TYPE: serverWidget.FieldType.DATE,
                                    LABEL: 'Delegate Effective Start Date'
                                },
                                {
                                    ID: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_EFFECTIVE_END_DATE,
                                    TYPE: serverWidget.FieldType.DATE,
                                    LABEL: 'Delegate Effective End Date'
                                }
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
                                {
                                    ID: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_EFFECTIVE_START_DATE,
                                    TYPE: serverWidget.FieldType.DATE,
                                    LABEL: 'Delegate Effective Start Date'
                                },
                                {
                                    ID: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_EFFECTIVE_END_DATE,
                                    TYPE: serverWidget.FieldType.DATE,
                                    LABEL: 'Delegate Effective End Date'
                                }
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
                // APPROVAL_THRESHOLD: {
                //     ID: 'custpage_approval_threshold_tab',
                //     LABEL: 'Approval Threshold',
                //     FIELDGROUPS: {
                //     },
                //     SUBLISTS: {
                //         DEPARTMENT: {
                //             ID: 'custpage_dept_threshold_sublist',
                //             TYPE: serverWidget.SublistType.INLINEEDITOR,
                //             LABEL: 'Department Approval Threshold (Applies to Vendor Bills)',
                //             FIELDS: [
                //                 {
                //                     ID: 'custpage_dept_tsc_approval_thresholds',
                //                     TYPE: serverWidget.FieldType.TEXT,
                //                     LABEL: 'ID',
                //                     DISPLAY_TYPE: serverWidget.FieldDisplayType.HIDDEN
                //                 },
                //                 {
                //                     ID: 'custpage_dept_auto_approval_limit',
                //                     TYPE: serverWidget.FieldType.CURRENCY,
                //                     LABEL: 'Auto Approval Limit',
                //                 },
                //                 {
                //                     ID: 'custpage_dept_tier1_approval_limit',
                //                     TYPE: serverWidget.FieldType.CURRENCY,
                //                     LABEL: 'Tier 1 Approval Limit',
                //                 },
                //                 {
                //                     ID: 'custpage_dept_tier2_approval_limit',
                //                     TYPE: serverWidget.FieldType.CURRENCY,
                //                     LABEL: 'Tier 2 Approval Limit',
                //                 },
                //                 {
                //                     ID: 'custpage_dept_tier3_approval_limit',
                //                     TYPE: serverWidget.FieldType.CURRENCY,
                //                     LABEL: 'Tier 3 Approval Limit',
                //                     DISPLAY_TYPE: serverWidget.FieldDisplayType.DISABLED
                //                 }
                //             ]
                //         },
                //         COMPANY_ROLE: {
                //             ID: 'custpage_company_role_threshold_sublist',
                //             TYPE: serverWidget.SublistType.INLINEEDITOR,
                //             LABEL: 'Company Role Approval Threshold (Applies to Vendor Bills)',
                //             FIELDS: [
                //                 {
                //                     ID: 'custpage_company_role_tsc_approval_thresholds',
                //                     TYPE: serverWidget.FieldType.TEXT,
                //                     LABEL: 'ID',
                //                     DISPLAY_TYPE: serverWidget.FieldDisplayType.HIDDEN
                //                 },
                //                 {
                //                     ID: 'custpage_company_role_auto_approval_limit',
                //                     TYPE: serverWidget.FieldType.CURRENCY,
                //                     LABEL: 'Auto Approval Limit',
                //                 },
                //                 {
                //                     ID: 'custpage_company_role_tier1_approval_limit',
                //                     TYPE: serverWidget.FieldType.CURRENCY,
                //                     LABEL: 'Tier 1 Approval Limit',
                //                 },
                //                 {
                //                     ID: 'custpage_company_role_tier2_approval_limit',
                //                     TYPE: serverWidget.FieldType.CURRENCY,
                //                     LABEL: 'Tier 2 Approval Limit',
                //                 },
                //                 {
                //                     ID: 'custpage_company_role_tier3_approval_limit',
                //                     TYPE: serverWidget.FieldType.CURRENCY,
                //                     LABEL: 'Tier 3 Approval Limit',
                //                     DISPLAY_TYPE: serverWidget.FieldDisplayType.DISABLED
                //                 }
                //             ]
                //         }

                //     }
                // }
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
            APPROVER_CONFIG: 'customrecord_tsc_approver_config',
            DELEGATE_APPROVERS: 'customrecord_tsc_delegate_approvers'
        };

        const SEARCH_DEFINITIONS = {
            COMPANY_ROLE: {
                recordType: RECORD_TYPES.APPROVER_CONFIG,
                filters: [
                    ['isinactive', 'is', 'F'],
                    'AND',
                    ['custrecordtsc_config_type', 'anyof', CONFIG_TYPES.COMPANY_ROLE]
                ],
                columns: [
                    search.createColumn({ name: 'custrecord_tsc_role_type' }),
                    search.createColumn({ name: 'custrecord_tsc_primary_approver' })
                ]
            },
            DEPARTMENT: {
                recordType: RECORD_TYPES.APPROVER_CONFIG,
                filters: [
                    ['isinactive', 'is', 'F'],
                    'AND',
                    ['custrecordtsc_config_type', 'anyof', CONFIG_TYPES.DEPARTMENT]
                ],
                columns: [
                    search.createColumn({ name: 'custrecord_tsc_department' }),
                    search.createColumn({ name: 'custrecord_tsc_primary_approver' }),
                    search.createColumn({ name: 'custrecord_tsc_secondary_approver' }),
                    search.createColumn({ name: 'custrecord_tsc_tertiary_approver' }),
                    search.createColumn({ name: 'custrecord_tsc_effective_date' }),
                    search.createColumn({ name: 'custrecord_tsc_end_date' })
                ]
            },
            DELEGATE: {
                recordType: RECORD_TYPES.DELEGATE_APPROVERS,
                filters: [
                    ['isinactive', 'is', 'F']
                ],
                columns: [
                    search.createColumn({ name: 'custrecord_tsc_delegate_primary_approver' }),
                    search.createColumn({ name: 'custrecord_tsc_delegate_approver' }),
                    search.createColumn({ name: 'custrecord_delegate_start_date' }),
                    search.createColumn({ name: 'custrecord_tsc_delegate_end_date' })
                ]
            }
        }

        const SUBLIST_MAPPINGS = {
            COMPANY_ROLE: {
                searchType: 'COMPANY_ROLE',
                sublistId: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.ID,
                fieldMappings: [
                    { dataField: 'internalid', sublistFieldId: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_APPROVER_CONFIG_ID },
                    { dataField: 'custrecord_tsc_role_type', sublistFieldId: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_ROLE_TYPE_DISPLAY },
                    { dataField: 'custrecord_tsc_primary_approver', sublistFieldId: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_ROLE_PRIMARY_APPROVER_DISPLAY }
                ]
            },
            DEPARTMENT: {
                searchType: 'DEPARTMENT',
                sublistId: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.ID,
                fieldMappings: [
                    { dataField: 'internalid', sublistFieldId: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_APPROVER_CONFIG_ID },
                    { dataField: 'custrecord_tsc_department', sublistFieldId: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_DISPLAY },
                    { dataField: 'custrecord_tsc_primary_approver', sublistFieldId: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_TIER1_APPROVER },
                    { dataField: 'custrecord_tsc_secondary_approver', sublistFieldId: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_TIER2_APPROVER },
                    { dataField: 'custrecord_tsc_tertiary_approver', sublistFieldId: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_TIER3_APPROVER },
                    { dataField: 'custrecord_tsc_effective_date', sublistFieldId: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_EFFECTIVE_START_DATE },
                    { dataField: 'custrecord_tsc_end_date', sublistFieldId: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_EFFECTIVE_END_DATE }
                ]
            },
            DELEGATE: {
                searchType: 'DELEGATE',
                sublistId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.ID,
                fieldMappings: [
                    { dataField: 'internalid', sublistFieldId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_ID },
                    { dataField: 'custrecord_tsc_delegate_primary_approver', sublistFieldId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_PRIMARY_APPROVER },
                    { dataField: 'custrecord_tsc_delegate_approver', sublistFieldId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_APPROVER },
                    { dataField: 'custrecord_delegate_start_date', sublistFieldId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_START_DATE },
                    { dataField: 'custrecord_tsc_delegate_end_date', sublistFieldId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_END_DATE }
                ]
            }
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

                        // Create fields in the group
                        if (groupConfig.FIELDS) {
                            for (let field of groupConfig.FIELDS) {
                                const fieldObj = form.addField({
                                    id: field.ID,
                                    type: field.TYPE,
                                    label: field.LABEL,
                                    source: field.SOURCE,
                                    container: groupConfig.ID
                                });

                                // Add options if specified
                                if (field.OPTIONS) {
                                    for (let option of field.OPTIONS) {
                                        fieldObj.addSelectOption({
                                            value: option.VALUE,
                                            text: option.TEXT,
                                            isSelected: option.IS_SELECTED || false
                                        });
                                    }
                                }

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

            //Retrieve for Company Roles sublist
            // let approverConfig = searchApproverConfig('1');
            // log.debug('approverConfig: ', approverConfig);
            // //Populate Company Roles Sublist
            // if (approverConfig.length > 0) {
            //     const companyRolesSublist = form.getSublist({
            //         id: FORM_OBJECT.TABS.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.ID
            //     });

            //     for (let i = 0; i < approverConfig.length; i++) {
            //         const approver = approverConfig[i];
            //         companyRolesSublist.setSublistValue({
            //             id: FORM_OBJECT.TABS.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS[0].ID,
            //             line: i,
            //             value: approver.roleType
            //         });
            //         companyRolesSublist.setSublistValue({
            //             id: FORM_OBJECT.TABS.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS[1].ID,
            //             line: i,
            //             value: approver.primaryApprover
            //         });
            //         companyRolesSublist.setSublistValue({
            //             id: FORM_OBJECT.TABS.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS[2].ID,
            //             line: i,
            //             value: approver.id
            //         });
            //     }
            // }

            // let departmentConfig = searchApproverConfig('2');
            // log.debug('departmentConfig: ', departmentConfig);
            // //Populate Departments Sublist
            // if (departmentConfig.length > 0) {
            //     const departmentsSublist = form.getSublist({
            //         id: FORM_OBJECT.TABS.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.ID
            //     });

            //     for (let i = 0; i < departmentConfig.length; i++) {
            //         const approver = departmentConfig[i];
            //         departmentsSublist.setSublistValue({
            //             id: FORM_OBJECT.TABS.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS[0].ID,
            //             line: i,
            //             value: approver.department
            //         });
            //         departmentsSublist.setSublistValue({
            //             id: FORM_OBJECT.TABS.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS[1].ID,
            //             line: i,
            //             value: approver.primaryApprover
            //         });
            //         departmentsSublist.setSublistValue({
            //             id: FORM_OBJECT.TABS.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS[2].ID,
            //             line: i,
            //             value: approver.secondaryApprover
            //         });
            //         departmentsSublist.setSublistValue({
            //             id: FORM_OBJECT.TABS.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS[3].ID,
            //             line: i,
            //             value: approver.tertiaryApprover
            //         });
            //     }
            // }

            //Retrieve for Delegate Approvers sublist
            // let delegateConfig = searchDelegateApproverConfig();
            // log.debug('delegateConfig: ', delegateConfig);
            // //Populate Delegate Approvers Sublist
            // if (delegateConfig.length > 0) {
            //     const delegatesSublist = form.getSublist({
            //         id: FORM_OBJECT.TABS.DELEGATES.SUBLISTS.DELEGATES_LIST.ID
            //     });
            //     for (let i = 0; i < delegateConfig.length; i++) {
            //         const approver = delegateConfig[i];
            //         delegatesSublist.setSublistValue({
            //             id: FORM_OBJECT.TABS.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS[0].ID,
            //             line: i,
            //             value: approver.primaryApprover
            //         });
            //         delegatesSublist.setSublistValue({
            //             id: FORM_OBJECT.TABS.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS[1].ID,
            //             line: i,
            //             value: approver.delegateApprover
            //         });
            //         delegatesSublist.setSublistValue({
            //             id: FORM_OBJECT.TABS.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS[2].ID,
            //             line: i,
            //             value: approver.startDate
            //         });
            //         delegatesSublist.setSublistValue({
            //             id: FORM_OBJECT.TABS.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS[3].ID,
            //             line: i,
            //             value: approver.endDate
            //         });
            //     }
            // }
            populateSublist(form, 'COMPANY_ROLE');
            populateSublist(form, 'DEPARTMENT');
            populateSublist(form, 'DELEGATE');

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

            // Write the form to the response
            scriptContext.response.writePage(form);
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
            log.debug(title + ' params: ', { scriptContext });
            const activeTab = scriptContext.request.parameters.selectedtab || FORM_OBJECT.TABS.COMPANY_ROLES.ID;
            processCompanyRoleRecords(scriptContext.request);
            processDepartmentRecords(scriptContext.request);
            processDelegateRecords(scriptContext.request);

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
            const title = "populateSublist";
            log.debug(title + ' params: ', { tabKey });

            const mapping = SUBLIST_MAPPINGS[tabKey];
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
                        log.emergency(title + fieldMapping.dataField + ' value', value);

                        sublist.setSublistValue({
                            id: fieldMapping.sublistFieldId,
                            line: i,
                            value: value
                        });

                        log.debug(title + ' setting value', {
                            line: i,
                            field: fieldMapping.sublistFieldId,
                            value: value
                        });
                    }
                }

                log.debug(title, 'Successfully populated sublist for tab: ' + tabKey);
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
                                    'custrecord_tsc_role_type': roleType,
                                    'custrecord_tsc_primary_approver': primaryApprover
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
                                fieldId: 'custrecordtsc_config_type',
                                value: CONFIG_TYPES.COMPANY_ROLE
                            });

                            newRecord.setValue({
                                fieldId: 'custrecord_tsc_role_type',
                                value: roleType
                            });

                            newRecord.setValue({
                                fieldId: 'custrecord_tsc_primary_approver',
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

                        const startDate = request.getSublistValue({
                            group: FORM_OBJECT.TABS.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.ID,
                            name: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_EFFECTIVE_START_DATE,
                            line: i
                        });

                        const endDate = request.getSublistValue({
                            group: FORM_OBJECT.TABS.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.ID,
                            name: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_EFFECTIVE_END_DATE,
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

                        // Date validation
                        if (startDate && endDate) {
                            const startDateObj = new Date(startDate);
                            const endDateObj = new Date(endDate);

                            if (startDateObj > endDateObj) {
                                results.errors.push(`Line ${i + 1}: End Date must be after Start Date`);
                                continue;
                            }
                        }

                        log.debug(title, `Processing line ${i + 1}: configId=${configId}, department=${department}, approvers=${tier1Approver}/${tier2Approver}/${tier3Approver}`);

                        // Determine if this is a create or update operation
                        if (configId) {
                            // Update existing record
                            const recordId = record.submitFields({
                                type: RECORD_TYPES.APPROVER_CONFIG,
                                id: configId,
                                values: {
                                    'custrecord_tsc_department': department,
                                    'custrecord_tsc_primary_approver': tier1Approver || '',
                                    'custrecord_tsc_secondary_approver': tier2Approver || '',
                                    'custrecord_tsc_tertiary_approver': tier3Approver || '',
                                    'custrecord_tsc_effective_date': startDate || '',
                                    'custrecord_tsc_end_date': endDate || ''
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
                                fieldId: 'custrecordtsc_config_type',
                                value: CONFIG_TYPES.DEPARTMENT
                            });

                            newRecord.setValue({
                                fieldId: 'custrecord_tsc_department',
                                value: department
                            });

                            if (tier1Approver) {
                                newRecord.setValue({
                                    fieldId: 'custrecord_tsc_primary_approver',
                                    value: tier1Approver
                                });
                            }

                            if (tier2Approver) {
                                newRecord.setValue({
                                    fieldId: 'custrecord_tsc_secondary_approver',
                                    value: tier2Approver
                                });
                            }

                            if (tier3Approver) {
                                newRecord.setValue({
                                    fieldId: 'custrecord_tsc_tertiary_approver',
                                    value: tier3Approver
                                });
                            }

                            if (startDate) {
                                newRecord.setValue({
                                    fieldId: 'custrecord_tsc_effective_date',
                                    value: startDate
                                });
                            }

                            if (endDate) {
                                newRecord.setValue({
                                    fieldId: 'custrecord_tsc_end_date',
                                    value: endDate
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
                                    'custrecord_tsc_delegate_primary_approver': primaryApprover,
                                    'custrecord_tsc_delegate_approver': delegateApprover,
                                    'custrecord_delegate_start_date': startDate,
                                    'custrecord_tsc_delegate_end_date': endDate || ''
                                }
                            });

                            log.debug(title, `Updated record ID: ${recordId}`);
                            submittedIds.add(String(delegateId));
                            results.updated++;
                        } else {
                            log.emergency(title, `Creating new record: primaryApprover=${primaryApprover}, delegateApprover=${delegateApprover}, startDate=${startDate}, endDate=${endDate}`);
                            // Create new record
                            const newRecord = record.create({
                                type: RECORD_TYPES.DELEGATE_APPROVERS,
                                isDynamic: true
                            });

                            // Set field values
                            newRecord.setValue({
                                fieldId: 'custrecord_tsc_delegate_primary_approver',
                                value: primaryApprover
                            });

                            newRecord.setValue({
                                fieldId: 'custrecord_tsc_delegate_approver',
                                value: delegateApprover
                            });

                            newRecord.setText({
                                fieldId: 'custrecord_delegate_start_date',
                                text: startDate
                            });

                            if (endDate) {
                                newRecord.setText({
                                    fieldId: 'custrecord_tsc_delegate_end_date',
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

        return { onRequest };
    });