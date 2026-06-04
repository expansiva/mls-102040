/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-data-table.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupViewTable';
export const skill = `# Metadata
- TagName: groupviewtable--ml-data-table

# Objective
Render a full-featured data table that supports column-based sorting, row selection with checkboxes, pagination, an optional footer, an editing mode, and accessible semantics. The component reads its column definitions and row data from declarative slot elements and exposes rich interaction events so the host application can respond to user actions without the table containing any business logic.

# Responsibilities
- Parse TableHeader > TableHead slot elements to derive column definitions including key, label, sortable flag, text alignment, and optional width.
- Parse TableBody > TableRow > TableCell slot elements to derive body row data.
- Parse TableFooter > TableRow > TableCell slot elements to derive optional footer rows.
- Sort rows client-side by the active column key when a sortable column header is clicked or activated with Enter or Space; toggle between ascending and descending on repeated activations; prefer numeric comparison when cell text is parseable as a number, otherwise use locale-aware string comparison.
- Dispatch a sort CustomEvent (bubbles, composed) with key and direction after each sort activation.
- Render per-row checkboxes and a select-all header checkbox when selectable is true; manage indeterminate state on the header checkbox when some but not all rows are selected.
- Represent the selected rows as a comma-separated string of row indices in the value property; dispatch a change CustomEvent (bubbles, composed) with the new value string on every selection change.
- Dispatch a rowClick CustomEvent (bubbles, composed) with the row index when a data row is clicked outside of its checkbox.
- Render a page number bar with previous/next buttons and ellipsis markers when pageSize is greater than zero and totalPages is greater than one; dispatch a pageChange CustomEvent (bubbles, composed) with the new page number.
- Propagate the is-editing attribute with its current boolean value to all custom elements (tags containing a hyphen) found inside TableCell slots after every render update.
- Show an optional caption above the table and as a visually hidden table caption element when the Caption slot is provided.
- Display a selection count badge when selectable is true and at least one row is selected.
- Render an animated skeleton loading state when loading is true; use the Loading slot content if provided, otherwise use the built-in skeleton.
- Render an empty state row spanning all columns when no body rows are present; use the Empty slot content if provided, otherwise use the localized default message.
- Render an error message below the table when the error property is non-empty.
- Support English and Portuguese UI strings via the i18n message system.

# Constraints
- The component must not contain business logic; data fetching, filtering, and server-side sorting are the consumer's responsibility.
- Column definitions must be derived exclusively from TableHead elements that have a non-empty key attribute; elements without a key must be silently ignored.
- When disabled is true, the entire table must be rendered with reduced opacity and pointer-events-none so no interaction is possible.
- The sort state is maintained internally and resets only when the component is re-created; the component does not persist sort state externally.
- Pagination UI must not appear when pageSize is zero or totalPages is one or less.
- The component uses createRenderRoot returning this, meaning it renders without a shadow DOM.`;
