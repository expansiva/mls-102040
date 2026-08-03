/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-advanced-data-table.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupViewTable';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  recordsView: "table",
  listOverflow: "pagination"
};

export const skill = `# Metadata
- TagName: groupviewtable--ml-advanced-data-table

# Objective
An interactive data table that supports column sorting, column resizing, column reordering, pagination, an optional per-row total column, and an optional column-sum footer row. The component follows the groupViewTable group contract, using the slot tags TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter, Empty, and Loading, and respecting all properties and events defined by that contract.

# Responsibilities
- Renders a data table with header, body, and optional footer sections using the groupViewTable slot hierarchy.
- Sorts a column in ascending order on the first click of its header and descending order on the second click, emitting the \`sort\` event with \`{ key, direction }\`.
- Shows a sort direction indicator only on the currently active sorted column header; column headers carry the strongest visual hierarchy in the table.
- Allows the user to resize column widths by dragging the border of column headers; the header borders visually indicate resize capability on cursor hover.
- Allows the user to reorder columns by dragging and dropping column headers to a new position; columns being reordered receive visual highlight to indicate the drop target position.
- Paginates data when \`pageSize\` is greater than zero, rendering pagination controls below the table and emitting the \`pageChange\` event with \`{ page }\` on navigation; pagination controls are visually subordinate to the table.
- Displays an optional final column showing the total of each row when \`showRowTotal\` is true; this column carries visual weight distinct from regular data columns.
- Displays an optional footer row showing the sum of each column when \`showColumnTotal\` is true; this row is visually differentiated from data rows with emphasis on the total values.
- Respects all groupViewTable contract properties: \`selectable\`, \`isEditing\`, \`page\`, \`pageSize\`, \`totalItems\`, \`value\`, \`error\`, \`disabled\`, and \`loading\`.
- When \`selectable\` is true, renders a checkbox per row and a select-all checkbox in the header, updating \`value\` as a comma-separated string of selected row indices and emitting the \`change\` event.
- When \`isEditing\` changes, propagates the \`is-editing\` attribute to all custom elements inside TableCell elements.
- Emits the \`rowClick\` event with \`{ index }\` when a row is clicked outside of checkbox selection.
- Displays the Loading slot content (or default skeleton placeholders) during the loading state, showing visual placeholders instead of data.
- Displays the Empty slot content (or a centered default message) when the TableBody has no rows.
- Displays the error message below the table when \`error\` is non-empty.
- Reduces opacity and blocks all interaction when \`disabled\` is true.

# Constraints
- Must not emit events other than those defined in the groupViewTable contract (\`change\`, \`sort\`, \`pageChange\`, \`rowClick\`); column resizing and reordering are purely internal visual interactions that emit no additional events.
- Must not perform sorting, pagination, or data fetching externally; the component reorders rows internally for sorting and delegates page content updates to the host via \`pageChange\`.
- The \`showRowTotal\` and \`showColumnTotal\` features must be activated only by their respective boolean properties and must not appear by default.
- Pagination controls must appear only when \`pageSize\` is greater than zero.
- The table must use the slot tags TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter, Empty, and Loading as defined by the groupViewTable contract.
- Sorting must be based on the text content of the cell at the matching column index.
- The \`value\` property must remain a comma-separated string of selected row indices when \`selectable\` is true; empty string means no selection.
- Must not allow interaction when \`disabled\` is true.

# Notes
- Column resizing and reordering are internal visual state changes that persist for the lifetime of the component instance but are not communicated to the host.
- The sort indicator on the active column reflects the current \`sortDirection\` (ascending or descending).
- Accessibility: the table uses semantic table roles; sortable header cells expose \`aria-sort\`; pagination is wrapped in a navigation landmark with an accessible label; keyboard navigation supports arrow keys for row traversal, Space for selection toggle, and Enter on a header to trigger sorting.
- The component relies on the groupViewTable design tokens for all visual styling and accepts \`data-class\` for consumer-provided CSS classes on the host and slots.`;
