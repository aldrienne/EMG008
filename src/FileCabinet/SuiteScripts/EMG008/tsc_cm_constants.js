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
                            COMPANY_EFFECTIVE_START_DATE: 'custpage_company_effective_start_date',
                            COMPANY_EFFECTIVE_END_DATE: 'custpage_company_effective_end_date'
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
                            DEPARTMENT_EFFECTIVE_START_DATE: 'custpage_department_effective_start_date',
                            DEPARTMENT_EFFECTIVE_END_DATE: 'custpage_department_effective_end_date'
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
        BUTTON: {
            SUBMIT: 'custpage_submit',
            SEARCH: 'custpage_search'
        }
    };

    return {
        FORM_CONST
    };
});