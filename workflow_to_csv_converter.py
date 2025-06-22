#!/usr/bin/env python3
"""
NetSuite Workflow XML to CSV Converter
Converts large workflow XML files into multiple CSV files for easier review
"""

import xml.etree.ElementTree as ET
import csv
import os
import re
from datetime import datetime

class WorkflowToCSVConverter:
    def __init__(self, xml_file_path):
        self.xml_file_path = xml_file_path
        self.base_name = os.path.splitext(os.path.basename(xml_file_path))[0]
        self.output_dir = os.path.join(os.path.dirname(xml_file_path), f"{self.base_name}_csv")
        
    def convert(self):
        """Main conversion method"""
        # Create output directory
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Parse XML
        tree = ET.parse(self.xml_file_path)
        root = tree.getroot()
        
        # Extract different components
        self.extract_general_info(root)
        self.extract_states(root)
        self.extract_transitions(root)
        self.extract_state_actions(root)
        self.extract_custom_fields(root)
        self.create_summary_report(root)
        
        print(f"Conversion complete! CSV files saved to: {self.output_dir}")
        
    def clean_formula(self, formula_text):
        """Clean CDATA and format formula text"""
        if not formula_text:
            return ""
        # Remove CDATA markers
        cleaned = re.sub(r'<!\[CDATA\[|\]\]>', '', formula_text)
        # Replace newlines with spaces for CSV
        cleaned = cleaned.replace('\n', ' ').replace('\r', '')
        return cleaned.strip()
        
    def extract_general_info(self, root):
        """Extract general workflow information"""
        output_file = os.path.join(self.output_dir, "01_general_info.csv")
        
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Property', 'Value'])
            
            writer.writerow(['Script ID', root.get('scriptid', '')])
            writer.writerow(['Name', root.findtext('name', '')])
            writer.writerow(['Description', root.findtext('description', '')])
            writer.writerow(['Record Types', root.findtext('recordtypes', '')])
            writer.writerow(['Is Inactive', root.findtext('isinactive', '')])
            writer.writerow(['Keep History', root.findtext('keephistory', '')])
            writer.writerow(['Run as Admin', root.findtext('runasadmin', '')])
            writer.writerow(['Log Enabled', root.findtext('islogenabled', '')])
            
    def extract_states(self, root):
        """Extract workflow states"""
        output_file = os.path.join(self.output_dir, "02_states.csv")
        
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['State ID', 'State Name', 'Description', 'Position X', 'Position Y', 
                           'Exit Workflow', 'Entry Actions', 'Load Actions', 'Custom Fields'])
            
            states = root.findall('.//workflowstate')
            for state in states:
                state_id = state.get('scriptid', '')
                name = state.findtext('name', '')
                desc = state.findtext('description', '')
                pos_x = state.findtext('positionx', '')
                pos_y = state.findtext('positiony', '')
                exit_wf = state.findtext('donotexitworkflow', '')
                
                # Count actions by trigger type
                entry_actions = len(state.findall(".//workflowactions[@triggertype='ONENTRY']//"))
                load_actions = len(state.findall(".//workflowactions[@triggertype='BEFORELOAD']//"))
                
                # Count custom fields
                custom_fields = len(state.findall('.//workflowstatecustomfield'))
                
                writer.writerow([state_id, name, desc, pos_x, pos_y, exit_wf, 
                               entry_actions, load_actions, custom_fields])
                
    def extract_transitions(self, root):
        """Extract workflow transitions with their conditions"""
        output_file = os.path.join(self.output_dir, "03_transitions.csv")
        
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Transition ID', 'From State', 'From State Name', 'To State', 
                           'Trigger Type', 'Button Action', 'Condition Formula', 'Condition Type'])
            
            states = root.findall('.//workflowstate')
            for state in states:
                state_id = state.get('scriptid', '')
                state_name = state.findtext('name', '')
                
                transitions = state.findall('.//workflowtransition')
                for trans in transitions:
                    trans_id = trans.get('scriptid', '')
                    to_state = trans.findtext('tostate', '')
                    trigger = trans.findtext('triggertype', '')
                    button = trans.findtext('buttonaction', '')
                    
                    # Extract condition
                    condition = trans.find('initcondition')
                    if condition is not None:
                        formula = self.clean_formula(condition.findtext('formula', ''))
                        cond_type = condition.findtext('type', '')
                    else:
                        formula = ''
                        cond_type = ''
                    
                    writer.writerow([trans_id, state_id, state_name, to_state, 
                                   trigger, button, formula, cond_type])
                                   
    def extract_state_actions(self, root):
        """Extract actions for each state"""
        output_file = os.path.join(self.output_dir, "04_state_actions.csv")
        
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['State ID', 'State Name', 'Action Type', 'Action ID', 
                           'Trigger Type', 'Field/Script', 'Value', 'Condition'])
            
            states = root.findall('.//workflowstate')
            for state in states:
                state_id = state.get('scriptid', '')
                state_name = state.findtext('name', '')
                
                # Process all workflow actions
                for actions in state.findall('.//workflowactions'):
                    trigger_type = actions.get('triggertype', '')
                    
                    # Set field value actions
                    for action in actions.findall('.//setfieldvalueaction'):
                        action_id = action.get('scriptid', '')
                        field = action.findtext('field', '')
                        value = (action.findtext('valuetext', '') or 
                                action.findtext('valueselect', '') or
                                action.findtext('valuefield', '') or
                                action.findtext('valueformula', ''))
                        
                        condition = action.find('initcondition')
                        if condition is not None:
                            cond_formula = self.clean_formula(condition.findtext('formula', ''))
                        else:
                            cond_formula = ''
                            
                        writer.writerow([state_id, state_name, 'Set Field Value', action_id,
                                       trigger_type, field, value, cond_formula])
                    
                    # Custom actions
                    for action in actions.findall('.//customaction'):
                        action_id = action.get('scriptid', '')
                        script = action.findtext('scripttype', '')
                        result_field = action.findtext('resultfield', '')
                        
                        writer.writerow([state_id, state_name, 'Custom Action', action_id,
                                       trigger_type, script, result_field, ''])
                    
                    # Button actions
                    for action in actions.findall('.//addbuttonaction'):
                        action_id = action.get('scriptid', '')
                        label = action.findtext('label', '')
                        
                        condition = action.find('initcondition')
                        if condition is not None:
                            cond_formula = self.clean_formula(condition.findtext('formula', ''))
                        else:
                            cond_formula = ''
                            
                        writer.writerow([state_id, state_name, 'Add Button', action_id,
                                       trigger_type, label, '', cond_formula])
                                       
    def extract_custom_fields(self, root):
        """Extract custom workflow fields"""
        output_file = os.path.join(self.output_dir, "05_custom_fields.csv")
        
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Field ID', 'Label', 'Field Type', 'Display Type', 
                           'Select Record Type', 'Store Value', 'Scope'])
            
            # Workflow-level custom fields
            wf_fields = root.findall('.//workflowcustomfields/workflowcustomfield')
            for field in wf_fields:
                field_id = field.get('scriptid', '')
                label = field.findtext('label', '')
                field_type = field.findtext('fieldtype', '')
                display_type = field.findtext('displaytype', '')
                select_type = field.findtext('selectrecordtype', '')
                store_value = field.findtext('storevalue', '')
                
                writer.writerow([field_id, label, field_type, display_type, 
                               select_type, store_value, 'Workflow'])
            
            # State-level custom fields - find them with their parent states
            states = root.findall('.//workflowstate')
            for state in states:
                state_name = state.findtext('name', '')
                state_fields = state.findall('.//workflowstatecustomfield')
                
                for field in state_fields:
                    field_id = field.get('scriptid', '')
                    label = field.findtext('label', '')
                    field_type = field.findtext('fieldtype', '')
                    display_type = field.findtext('displaytype', '')
                    select_type = field.findtext('selectrecordtype', '')
                    store_value = field.findtext('storevalue', '')
                    
                    writer.writerow([field_id, label, field_type, display_type, 
                                   select_type, store_value, f'State: {state_name}'])
                               
    def create_summary_report(self, root):
        """Create a summary report"""
        output_file = os.path.join(self.output_dir, "00_summary.csv")
        
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Metric', 'Count'])
            
            # Count various elements
            states = len(root.findall('.//workflowstate'))
            transitions = len(root.findall('.//workflowtransition'))
            actions = len(root.findall('.//workflowactions//*[@scriptid]'))
            custom_fields = len(root.findall('.//workflowcustomfield'))
            state_custom_fields = len(root.findall('.//workflowstatecustomfield'))
            
            writer.writerow(['Total States', states])
            writer.writerow(['Total Transitions', transitions])
            writer.writerow(['Total Actions', actions])
            writer.writerow(['Workflow Custom Fields', custom_fields])
            writer.writerow(['State Custom Fields', state_custom_fields])
            writer.writerow(['Generated Date', datetime.now().strftime('%Y-%m-%d %H:%M:%S')])

def main():
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python workflow_to_csv_converter.py <workflow_xml_file>")
        sys.exit(1)
        
    xml_file = sys.argv[1]
    if not os.path.exists(xml_file):
        print(f"Error: File '{xml_file}' not found")
        sys.exit(1)
        
    converter = WorkflowToCSVConverter(xml_file)
    converter.convert()

if __name__ == "__main__":
    main()