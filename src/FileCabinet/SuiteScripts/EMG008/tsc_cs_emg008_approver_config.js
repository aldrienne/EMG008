/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/ui/dialog', './tsc_cm_constants.js'],

function(dialog, TSCCONST) {
    const { FORM_CONST, RECORDS, TRANSACTION_BODY_FIELDS, LISTS } = TSCCONST;
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {
        
    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {
        const currentRecord = scriptContext.currentRecord;
        const sublistId = scriptContext.sublistId;
        const fieldId = scriptContext.fieldId;
        
        // Real-time duplicate role detection for Company Roles
        if (sublistId === FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.ID &&
            fieldId === FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_ROLE_TYPE_DISPLAY) {
            
            const roleType = currentRecord.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: fieldId
            });
            
            if (roleType) {
                const lineCount = currentRecord.getLineCount({ sublistId: sublistId });
                const currentLine = currentRecord.getCurrentSublistIndex({ sublistId: sublistId });
                let duplicateFound = false;
                
                for (let i = 0; i < lineCount; i++) {
                    // Skip current line
                    if (i === currentLine) continue;
                    
                    const existingRoleType = currentRecord.getSublistValue({
                        sublistId: sublistId,
                        fieldId: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_ROLE_TYPE_DISPLAY,
                        line: i
                    });
                    
                    if (roleType === existingRoleType) {
                        dialog.alert({
                            title: 'Warning',
                            message: 'This role type already exists. Each role type (CEO/COO/CFO) must be unique.'
                        });
                        duplicateFound = true;
                        break;
                    }
                }
            }
        }
        
        // Check for duplicate delegates when either approver changes
        else if (sublistId === FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.ID && (
            fieldId === FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_PRIMARY_APPROVER || 
            fieldId === FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_APPROVER)) {
            
            const primaryApprover = currentRecord.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_PRIMARY_APPROVER
            });
            
            const delegateApprover = currentRecord.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_APPROVER
            });
            
            // Check for duplicate primary approvers if primary approver field was changed
            if (fieldId === FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_PRIMARY_APPROVER && primaryApprover) {
                const lineCount = currentRecord.getLineCount({ sublistId: sublistId });
                const currentLine = currentRecord.getCurrentSublistIndex({ sublistId: sublistId });
                
                for (let i = 0; i < lineCount; i++) {
                    // Skip current line
                    if (i === currentLine) continue;
                    
                    const existingPrimaryApprover = currentRecord.getSublistValue({
                        sublistId: sublistId,
                        fieldId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_PRIMARY_APPROVER,
                        line: i
                    });
                    
                    if (primaryApprover === existingPrimaryApprover) {
                        dialog.alert({
                            title: 'Warning',
                            message: 'This primary approver already exists in another delegation. Each primary approver can only appear once in the delegates list.'
                        });
                        break;
                    }
                }
            }
            
            // Can only check for duplicates if both fields have values
            if (primaryApprover && delegateApprover) {
                
                // Same person can't be both primary and delegate
                if (primaryApprover === delegateApprover) {
                    dialog.alert({
                        title: 'Warning',
                        message: 'Primary Approver and Delegate Approver cannot be the same person'
                    });
                    return;
                }
                
                const lineCount = currentRecord.getLineCount({ sublistId: sublistId });
                const currentLine = currentRecord.getCurrentSublistIndex({ sublistId: sublistId });
                
                for (let i = 0; i < lineCount; i++) {
                    // Skip current line
                    if (i === currentLine) continue;
                    
                    const existingPrimaryApprover = currentRecord.getSublistValue({
                        sublistId: sublistId,
                        fieldId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_PRIMARY_APPROVER,
                        line: i
                    });
                    
                    const existingDelegateApprover = currentRecord.getSublistValue({
                        sublistId: sublistId,
                        fieldId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_APPROVER,
                        line: i
                    });
                    
                    if (primaryApprover === existingPrimaryApprover && delegateApprover === existingDelegateApprover) {
                        dialog.alert({
                            title: 'Warning',
                            message: 'This delegation combination already exists.'
                        });
                        break;
                    }
                }
            }
        }
        
        // Check for duplicate departments
        else if (sublistId === FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.ID &&
                 fieldId === FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_DISPLAY) {
            
            const department = currentRecord.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: fieldId
            });
            
            if (department) {
                const lineCount = currentRecord.getLineCount({ sublistId: sublistId });
                const currentLine = currentRecord.getCurrentSublistIndex({ sublistId: sublistId });
                
                for (let i = 0; i < lineCount; i++) {
                    // Skip current line
                    if (i === currentLine) continue;
                    
                    const existingDepartment = currentRecord.getSublistValue({
                        sublistId: sublistId,
                        fieldId: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_DISPLAY,
                        line: i
                    });
                    
                    if (department === existingDepartment) {
                        dialog.alert({
                            title: 'Warning',
                            message: 'This department already exists. Each department must be unique.'
                        });
                        break;
                    }
                }
            }
        }
    }

    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     *
     * @since 2015.2
     */
    function postSourcing(scriptContext) {

    }

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function sublistChanged(scriptContext) {

    }

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(scriptContext) {

    }

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    function validateField(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(scriptContext) {
        const currentRecord = scriptContext.currentRecord;
        const sublistId = scriptContext.sublistId;
        
        // Validate Company Roles sublist
        if (sublistId === FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.ID) {
            const roleType = currentRecord.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_ROLE_TYPE_DISPLAY
            });
            
            const primaryApprover = currentRecord.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_ROLE_PRIMARY_APPROVER_DISPLAY
            });
            
            
            // Required Field Validation
            if (!roleType) {
                dialog.alert({ title: 'Validation Error', message: 'Role Type is required' });
                return false;
            }
            
            if (!primaryApprover) {
                dialog.alert({ title: 'Validation Error', message: 'Primary Approver is required' });
                return false;
            }            
            
            
            // Check for duplicate role types
            const lineCount = currentRecord.getLineCount({ sublistId: sublistId });
            const currentLine = currentRecord.getCurrentSublistIndex({ sublistId: sublistId });
            
            for (let i = 0; i < lineCount; i++) {
                // Skip current line
                if (i === currentLine) continue;
                
                const existingRoleType = currentRecord.getSublistValue({
                    sublistId: sublistId,
                    fieldId: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_ROLE_TYPE_DISPLAY,
                    line: i
                });
                
                if (roleType === existingRoleType) {
                    dialog.alert({ title: 'Validation Error', message: 'Duplicate Role Type detected. Each role type (CEO/COO/CFO) must be unique.' });
                    return false;
                }
            }
            
            // Check for same person with multiple roles
            for (let i = 0; i < lineCount; i++) {
                // Skip current line
                if (i === currentLine) continue;
                
                const existingPrimaryApprover = currentRecord.getSublistValue({
                    sublistId: sublistId,
                    fieldId: FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.FIELDS.COMPANY_ROLE_PRIMARY_APPROVER_DISPLAY,
                    line: i
                });
                
                if (primaryApprover === existingPrimaryApprover) {
                    dialog.alert({ title: 'Validation Error', message: 'A person cannot have multiple company roles.' });
                    return false;
                }
            }
        }
        
        // Validate Delegates sublist
        else if (sublistId === FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.ID) {
            const primaryApprover = currentRecord.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_PRIMARY_APPROVER
            });
            
            const delegateApprover = currentRecord.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_APPROVER
            });
            
            const startDate = currentRecord.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_START_DATE
            });
            
            const endDate = currentRecord.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_END_DATE
            });
            
            // Required Field Validation
            if (!primaryApprover) {
                dialog.alert({ title: 'Validation Error', message: 'Primary Approver is required' });
                return false;
            }
            
            if (!delegateApprover) {
                dialog.alert({ title: 'Validation Error', message: 'Delegate Approver is required' });
                return false;
            }            
            
            // Date Validation
            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                
                if (start > end) {
                    dialog.alert({ title: 'Validation Error', message: 'End Date must be after Start Date' });
                    return false;
                }
            }
            
            // Same person can't be both primary and delegate
            if (primaryApprover === delegateApprover) {
                dialog.alert({ title: 'Validation Error', message: 'Primary Approver and Delegate Approver cannot be the same person' });
                return false;
            }
            
            // Check if same person is already primary + delegate for same role
            const lineCount = currentRecord.getLineCount({ sublistId: sublistId });
            const currentLine = currentRecord.getCurrentSublistIndex({ sublistId: sublistId });
            
            for (let i = 0; i < lineCount; i++) {
                // Skip current line
                if (i === currentLine) continue;
                
                const existingPrimaryApprover = currentRecord.getSublistValue({
                    sublistId: sublistId,
                    fieldId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_PRIMARY_APPROVER,
                    line: i
                });
                
                const existingDelegateApprover = currentRecord.getSublistValue({
                    sublistId: sublistId,
                    fieldId: FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.FIELDS.DELEGATE_APPROVER,
                    line: i
                });
                
                // Check for duplicate combinations
                if (primaryApprover === existingPrimaryApprover && delegateApprover === existingDelegateApprover) {
                    dialog.alert({
                        title: 'Validation Error',
                        message: 'This delegation combination already exists. The same person cannot be delegated multiple times for the same role.'
                    });
                    return false;
                }
            }
        }
        
        // Validate Departments sublist
        else if (sublistId === FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.ID) {
            const department = currentRecord.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_DISPLAY
            });
            
            const tier1Approver = currentRecord.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_TIER1_APPROVER
            });

            const tier2Approver = currentRecord.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_TIER2_APPROVER
            });

            const tier3Approver = currentRecord.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_TIER3_APPROVER
            });
            
            
            // Required Field Validation
            if (!department) {
                dialog.alert({ title: 'Validation Error', message: 'Department is required' });
                return false;
            }
            
            if (!tier1Approver) {
                dialog.alert({ title: 'Validation Error', message: 'Primary Approver is required' });
                return false;
            }    
            
            if (!tier2Approver) {
                dialog.alert({ title: 'Validation Error', message: 'Tier 2 Approver is required' });
                return false;
            }

            if (!tier3Approver) {
                dialog.alert({ title: 'Validation Error', message: 'Tier 3 Approver is required' });
                return false;
            }
            
            
            // Check for duplicate departments
            const lineCount = currentRecord.getLineCount({ sublistId: sublistId });
            const currentLine = currentRecord.getCurrentSublistIndex({ sublistId: sublistId });
            
            for (let i = 0; i < lineCount; i++) {
                // Skip current line
                if (i === currentLine) continue;
                
                const existingDepartment = currentRecord.getSublistValue({
                    sublistId: sublistId,
                    fieldId: FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.FIELDS.DEPARTMENT_DISPLAY,
                    line: i
                });
                
                if (department === existingDepartment) {
                    dialog.alert({ title: 'Validation Error', message: 'Duplicate Department detected. Each department must be unique.' });
                    return false;
                }
            }
        }
        
        return true;
    }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateInsert(scriptContext) {

    }

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateDelete(scriptContext) {
        const sublistId = scriptContext.sublistId;
        
        // Check if this is one of our managed sublists
        if (sublistId === FORM_CONST.TAB.COMPANY_ROLES.SUBLISTS.COMPANY_ROLES_LIST.ID ||
            sublistId === FORM_CONST.TAB.DEPARTMENTS.SUBLISTS.DEPARTMENTS_LIST.ID ||
            sublistId === FORM_CONST.TAB.DELEGATES.SUBLISTS.DELEGATES_LIST.ID) {
            
            dialog.alert({
                title: 'Warning',
                message: 'You are not allowed to delete this line, you may only modify this line.'
            });
            
            return false;
        }
        
        return true;
    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {

    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        validateLine: validateLine,
        validateDelete: validateDelete
        //saveRecord: saveRecord
    };
    
});
