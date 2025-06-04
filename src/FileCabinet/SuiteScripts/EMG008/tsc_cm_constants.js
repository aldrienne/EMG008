/**
 * @NApiVersion 2.1
 */
define([], () => {

    const FORM_CONST = {
        TAB: {
            COMPANY_ROLES: {
                ID: 'custpage_company_roles_tab',
                SUBLISTS: {
                    COMPANY_ROLES_LIST: {
                        ID: 'custpage_company_roles_sublist',
                        FIELDS: {
                            COMPANY_APPROVER_CONFIG_ID: 'custpage_company_approver_config_id',
                            COMPANY_ROLE_TYPE_DISPLAY: 'custpage_company_role_type_display',
                            COMPANY_ROLE_PRIMARY_APPROVER_DISPLAY: 'custpage_company_role_primary_approver_display',
                        }
                    }
                }
            },
            DEPARTMENTS: {
                ID: 'custpage_departments_tab',
                SUBLISTS: {
                    DEPARTMENTS_LIST: {
                        ID: 'custpage_departments_sublist',
                        FIELDS: {
                            DEPARTMENT_APPROVER_CONFIG_ID: 'custpage_department_approver_config_id',
                            DEPARTMENT_DISPLAY: 'custpage_department_display',
                            DEPARTMENT_TIER1_APPROVER: 'custpage_department_tier1_approver',
                            DEPARTMENT_TIER2_APPROVER: 'custpage_department_tier2_approver',
                            DEPARTMENT_TIER3_APPROVER: 'custpage_department_tier3_approver',
                        }
                    }
                }
            },
            DELEGATES: {
                ID: 'custpage_delegates_tab',
                SUBLISTS: {
                    DELEGATES_LIST: {
                        ID: 'custpage_delegates_sublist',
                        FIELDS: {
                            DELEGATE_ID: 'custpage_delegate_id',
                            DELEGATE_PRIMARY_APPROVER: 'custpage_delegate_primary_approver',
                            DELEGATE_APPROVER: 'custpage_delegate_approver',
                            DELEGATE_START_DATE: 'custpage_delegate_start_date',
                            DELEGATE_END_DATE: 'custpage_delegate_end_date'
                        }
                    }
                }
            }
        },
        THRESHOLDS: {
            ID: 'custpage_thresholds_tab',
            FIELDS: {
                COMPANY_AUTO_APPROVAL_LIMIT: 'custpage_tsc_comp_auto_approval_limit',
                COO_APPROVAL_LIMIT: 'custpage_tsc_coo_approval_limit',
                CFO_APPROVAL_LIMIT: 'custpage_tsc_cfo_approval_limit',
                CEO_APPROVAL_LIMIT: 'custpage_tsc_ceo_approval_limit',
                DEPARTMENT_AUTO_APPROVAL_LIMIT: 'custpage_tsc_dep_auto_approval_limit',
                DEPARTMENT_TIER1_APPROVAL_LIMIT: 'custpage_tsc_dep_tier1_approval_limit',
                DEPARTMENT_TIER2_APPROVAL_LIMIT: 'custpage_tsc_dep_tier2_approval_limit',
                DEPARTMENT_TIER3_APPROVAL_LIMIT: 'custpage_tsc_dep_tier3_approval_limit'
            }
        },
        BUTTON: {
            SUBMIT: 'custpage_submit',
            SEARCH: 'custpage_search'
        }
    };

    const RECORDS = {
        APPROVER_CONFIG: {
            ID: 'customrecord_tsc_approver_config',
            FIELDS: {
                CONFIG_TYPE: 'custrecordtsc_config_type',
                ROLE_TYPE: 'custrecord_tsc_role_type',
                DEPARTMENT: 'custrecord_tsc_department',
                PRIMARY_APPROVER: 'custrecord_tsc_primary_approver',
                SECONDARY_APPROVER: 'custrecord_tsc_secondary_approver',
                TERTIARY_APPROVER: 'custrecord_tsc_tertiary_approver',
                EFFECTIVE_DATE: 'custrecord_tsc_effective_date',
                END_DATE: 'custrecord_tsc_end_date'
            }
        },
        DELEGATE_APPROVERS: {
            ID: 'customrecord_tsc_delegate_approvers',
            FIELDS: {
                PRIMARY_APPROVER: 'custrecord_tsc_delegate_primary_approver',
                DELEGATE_APPROVER: 'custrecord_tsc_delegate_approver',
                START_DATE: 'custrecord_delegate_start_date',
                END_DATE: 'custrecord_tsc_delegate_end_date'
            }
        },
        APPROVAL_THRESHOLDS: {
            ID: 'customrecord_tsc_approval_thresholds',
            FIELDS: {
                THRESHOLD_TYPE: 'custrecord_tsc_threshold_type',
                COMP_AUTO_APPROVAL_LIMIT: 'custrecord_tsc_comp_auto_approval_limit',
                COO_APPROVAL_LIMIT: 'custrecord_tsc_coo_approval_limit',
                CFO_APPROVAL_LIMIT: 'custrecord_tsc_cfo_approval_limit',
                CEO_APPROVAL_LIMIT: 'custrecord_tsc_ceo_approval_limit',
                DEPT_AUTO_APPROVAL_LIMIT: 'custrecord_tsc_dept_auto_approval_limit',
                TIER_1_APPROVAL_LIMIT: 'custrecord_tsc_tier_1_approval_limit',
                TIER_2_APPROVAL_LIMIT: 'custrecord_tsc_tier_2_approver_limit',
                TIER_3_APPROVAL_LIMIT: 'custrecord_tsc_tier_3_approver_limit'
            }
        },
        APPROVAL_HISTORY: {
            ID: 'customrecord_tsc_approval_history',
            FIELDS: {
                TRANSACTION: 'custrecord_tsc_transaction',
                TRANSACTION_TYPE: 'custrecord_tsc_transaction_type',
                ORIGINAL_APPROVER: 'custrecord_tsc_original_approver',
                ACTUAL_APPROVER: 'custrecord_tsc_actual_approver',
                APPROVAL_ACTION: 'custrecord_tsc_approval_action',
                APPROVAL_DATE: 'custrecord_tsc_approval_date',
                APPROVAL_NOTES: 'custrecord_tsc_approval_notes',
                IS_DELEGATE_ACTION: 'custrecord_tsc_is_delegate_action'
            }
        }
    };

    const TRANSACTION_BODY_FIELDS = {
        APPROVAL_HISTORY: 'custbody_tsc_approval_history',
        APPROVAL_STATUS: 'custbody_tsc_approval_status',
        CREATED_BY: 'custbody_tsc_created_by',
        IS_REVISION: 'custbody_tsc_is_revision',
        LAST_APPROVER: 'custbody_tsc_last_approver',
        REJECTION_REASON: 'custbody_tsc_rejection_reason',
        ASSIGNED_DELEGATE_APPROVER: 'custbody_tsc_assigned_delegate_approv',
        IS_DELEGATE_ACTIVE: 'custbody_tsc_is_delegate_active'
    };

    const LISTS = {
        APPROVAL_ACTIONS: 'customlist_tsc_approval_actions',
        CONFIG_TYPES: 'customlist_tsc_config_types',
        ROLE_TYPES: 'customlist_tsc_role_types'
    };

    return {
        FORM_CONST,
        RECORDS,
        TRANSACTION_BODY_FIELDS,
        LISTS
    };
});