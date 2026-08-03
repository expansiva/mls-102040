/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-grouping-table.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupViewTable';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  recordsView: "table"
};

export const skill = `# Metadata
- TagName: groupviewtable--ml-grouping-table

# Objective
A table that groups rows according to a user-selected column, displaying collapsible group headers above each set of rows. The grouping column choice is restricted to columns marked as groupable in the predefined header configuration. It follows the groupViewTable group contract, supporting selection, sorting, pagination, editing propagation, loading, empty, error, and disabled states.

# Responsibilities
- Presents a dropdown control at the top of the table, above the column headers, that lists only the columns whose TableHead carries the \`groupable\` attribute, allowing the user to select a grouping column.
- When a grouping column is selected, groups the rows from TableBody by the text content of the cell at the corresponding column position, rendering a collapsible group header for each distinct value.
- Each group header displays the group value and the count of rows belonging to that group.
- Each group can be collapsed or expanded by interacting with its group header; the collapse/expand indicator reflects the current expansion state and is clearly identifiable.
- When no grouping column is selected, renders the table in a flat standard layout without grouping.
- Emits the custom event \`groupChange\` with \`{ key: string }\` when the grouping column is changed.
- Supports row selection with checkboxes when \`selectable=true\`, emitting the \`change\` event with comma-separated row indices.
- Supports column sorting for columns marked as \`sortable\`, emitting the \`sort\` event with \`{ key, direction }\`.
- Supports pagination when \`pageSize > 0\`, emitting the \`pageChange\` event with \`{ page }\`.
- Propagates the \`is-editing\` attribute to all web components inside TableCell elements when \`isEditing\` changes.
- Displays the content of the \`Loading\` slot or a default skeleton when \`loading=true\`.
- Displays the content of the \`Empty\` slot or a default message when TableBody has no rows.
- Displays the error message below the table when \`error\` is not empty.
- Blocks all interaction and applies a dimmed appearance when \`disabled=true\`.
- The grouping column selection control carries the strongest visual weight at the top of the table, above the column headers.
- Group headers carry intermediate visual weight, distinguishing them from column headers and data rows.
- Data rows within a group are visually subordinate to their group header, with clear indentation or visual separation.
- Selected rows, when \`selectable=true\`, are visually highlighted relative to unselected rows.
- The sort indicator on the active column carries sufficient visual weight to identify the current sort direction.
- The loading state displays placeholders that visually communicate that data is being loaded.
- The disabled state applies reduced opacity to the entire table, indicating no interaction is available.

# Constraints
- The grouping dropdown must list only columns whose TableHead has the \`groupable\` attribute; columns without it must not appear in the dropdown.
- Must not allow grouping by a column that is not marked as groupable.
- Must not render group headers when no grouping column is selected.
- Must follow the groupViewTable group contract for all shared functionality: selection, sorting, pagination, isEditing propagation, loading, empty, error, and disabled states.
- The \`value\` property is a comma-separated string of selected row indices when \`selectable=true\`; empty string means no rows selected.
- The \`groupChange\` event detail must be \`{ key: string }\` where key is the selected grouping column key or empty string when grouping is cleared.
- Group headers must be collapsible and expandable; collapsed groups must not display their rows.
- All interaction must be blocked when \`disabled=true\`.
- Content areas: a grouping control area above the table headers, the standard table structure (Caption, TableHeader, TableBody, TableFooter), and slots for Empty and Loading.

# Notes
- The component reads TableHead elements to discover which columns are groupable and reads TableRow elements from TableBody to perform grouping by cell text content at the matching column index.
- Grouping is performed on the text content of the cell at the position corresponding to the selected grouping column.
- The collapse/expand state of each group is internal to the component and persists across re-renders within the same grouping column selection.
- When the grouping column changes, all groups default to expanded.
- Accessibility: group headers must be keyboard-focusable and operable; the collapse/expand indicator must convey its state to assistive technology. The grouping dropdown must be accessible via keyboard. All a11y requirements from the groupViewTable contract apply.
- The component emits \`rowClick\` with \`{ index: number }\` when a row is clicked outside of checkbox selection, per the group contract.
- Pagination, sorting, and selection operate within the grouped view when a grouping column is active.`;
