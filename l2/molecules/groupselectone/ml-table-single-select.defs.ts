/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-table-single-select.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectOne';
export const skill = `# Metadata
- TagName: groupselectone--ml-table-single-select

# Objective
Allow users to view and compare multiple detailed options arranged in a table and choose exactly one. The main purpose is to support decisions like selecting the best quote by comparing providers, costs, and timelines side by side.

# Responsibilities
- Display options in a table with multiple columns so users can compare details across rows
- Show a header for each column that describes the data below it
- Keep data aligned under the correct headers in a consistent order
- Let the user pick only one option at a time
- Clearly mark which row is currently chosen
- Update the current choice immediately when the user picks a different row
- Inform the system when the user's choice has changed
- Show options that cannot be chosen in a way that makes their unavailable status clear
- When not in editing mode, show only the details of the chosen option as plain text without the table or selection controls
- During loading, show a loading indicator and prevent any choice from being made
- When an error exists, show the error message; otherwise show helper text if available, but only while in editing mode
- Indicate when the user moves focus into or away from the control
- Support keyboard navigation between rows and confirmation of a choice using standard keys

# Constraints
- Only one row may be chosen at any time; choosing another row must replace the previous choice
- Unavailable options must remain visible but cannot be chosen or change the current choice
- In plain-text mode, no table structure, selection controls, or interactions may be presented
- No choice can be made while the control is loading
- Error messages must take priority over helper text
- Every choosable option must have a unique identifier
- Headers and row data must match in count and sequence
- Focus behavior must follow standard single-selection expectations

# Notes
- The table format is intended for comparing structured data such as vendor names, amounts, and delivery times
- The chosen row should be visually distinct as a whole
- Dark mode must maintain clear contrast and meaning for backgrounds, text, borders, and selected states`;

