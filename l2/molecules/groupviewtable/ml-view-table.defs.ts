/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-view-table.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewTable';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  recordsView: "table",
  density: "compact"
};

export const skill = `# Metadata
- TagName: groupviewtable--ml-view-table

# Objective
Present data in a clean, minimalist table format that supports ordering, pagination, row selection, and adaptive states for loading and empty data. It must provide clear visual feedback for interactions and maintain full compatibility with dark appearance modes.

# Responsibilities
- Present data in a structured table with distinguishable header and body areas, plus optional caption and footer regions.
- Enable column header interaction to sort the displayed data, alternating between ascending and descending order with clear directional indicators.
- Manage data ordering internally based on the active column and direction.
- Divide data into pages internally when a page limit is defined, and provide navigation between pages.
- Offer an optional row selection mode that presents a checkbox at the start of each row and a corresponding master checkbox in the header to select or clear all rows.
- Maintain and display the current selection state as rows are checked or unchecked individually or collectively.
- Recognize when a user activates a specific row separately from selection controls.
- Show an animated loading placeholder that imitates the table layout while data is unavailable, falling back to a default skeleton if no custom loading presentation is supplied.
- Show a centered empty-state message with an empty-table icon when no data exists, falling back to a default message if no custom empty presentation is supplied.
- Apply a subdued horizontal rule between rows without vertical dividers between columns for a minimalist appearance.
- Visually distinguish the header background from the body.
- Highlight the active sort column header and any selected rows with dedicated color treatments.
- Adapt all colors—including backgrounds, text, borders, and highlights—for dark mode presentation.
- Disable all sorting, selection, and pagination interactions when placed in an inactive state.

# Constraints
- Sort indicators must always match the currently applied column and direction.
- Page navigation must respect the calculated total pages and current position.
- The master selection checkbox must accurately reflect whether all, some, or no rows are selected.
- Loading, empty, and data states must not overlap; only one may be visible at a time.
- Selected and highlighted states must remain clearly distinguishable in both light and dark appearances.
- All interactive features must be inoperable when the inactive state is active.

# Notes
- Custom presentations for empty and loading states take precedence over default representations when provided.
- Activating a row and toggling its selection are separate, non-conflicting interactions.`;

