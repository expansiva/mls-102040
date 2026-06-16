/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-inline-edit-table.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewTable';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  recordsView: "table"
};

export const skill = `# Metadata
- TagName: groupviewtable--ml-inline-edit-table

# Objective
Provide a data table that supports inline editing through cell contents, column sorting, row selection, pagination, and distinct states for loading and empty data. It organizes content through named regions and delegates editing interfaces, validation presentation, and footer actions to the consuming context.

# Responsibilities
- Display table content in the sequence: caption, header, body, and footer, followed by global error messages when an error state is present.
- Require header and body sections to be provided and enforce the contract hierarchy where rows in the header contain column headers and rows in the body contain cells.
- Activate editing mode across all table cells simultaneously when the table enters an editing state, enabling nested interactive elements to present their editing interfaces.
- Notify the consuming context with the index of a row when any cell in that row is clicked, allowing external logic to control entry into editing mode.
- Accept all input types—such as text, number, selection, and date—exclusively from the content placed inside table cells; do not generate or substitute input controls automatically.
- Delegate individual cell validation and error presentation to the contents of each cell; display a global error state below the table according to the contract.
- Show a loading state using provided loading content when available, otherwise display the standard loading representation defined by the contract.
- Show an empty state using provided empty content when available, otherwise display the standard empty message defined by the contract, whenever the body contains no rows.
- Toggle sort direction between ascending and descending when an interactive column header is activated, reorder the visible rows accordingly, and notify the consuming context with the column key and direction.
- Support keyboard navigation between rows using vertical arrow keys, toggle row selection with the space key when selection is enabled, and trigger column sorting with the enter key on interactive headers.
- Allow default keyboard behavior for tab and enter keys to continue operating inside cell contents, enabling natural navigation and confirmation of edits by nested controls.
- Maintain selected row indices as a comma-separated value when selection is enabled, and notify the consuming context whenever the selection changes.
- Present pagination controls when a page size is specified, notify the consuming context of page changes, and do not fetch or manage data pages internally.
- Provide a footer area to accommodate consumer-provided actions, such as adding a new row, handled entirely by the content placed in that area.

# Constraints
- Header and body sections are mandatory; the table must not present a valid structure without them.
- The table must not create, inject, or replace input elements inside cells; all editing interfaces must originate from externally provided content.
- The table must not intercept or suppress native keyboard behaviors inside cell contents, ensuring tab and enter keys continue to operate nested controls as expected.
- Sorting must only respond to column headers explicitly marked as sortable, and the table must notify the consuming context when sorting occurs.
- Pagination must notify the consuming context of page changes without performing internal data retrieval; data management remains external.
- The global error state must appear below the table, but the table must not attempt to validate individual cell values internally.
- When selection is enabled, the value must remain a comma-separated list of row indices.
- The footer must not introduce additional communication mechanisms beyond the contract; actions such as adding rows must be handled entirely by the footer content.

# Notes
- The inline editing experience depends on cooperation between the table's editing state and the interactive elements placed inside table cells.
- All data operations—including saving edits, validating inputs, and adding rows—are the responsibility of the consuming context.`;

