/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-lazy-record-detail-table.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupViewTable';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  recordsView: "table",
  listOverflow: "pagination"
};

export const skill = `# Metadata
- TagName: groupviewtable--ml-lazy-record-detail-table
# Objective
Presents records in a sortable, pageable table with on-demand expandable detail rows, following the groupViewTable contract for table content, selection, states, events, and accessibility.
# Responsibilities
- Presents the supplied caption, header, body, footer, empty content, and loading content in their respective table areas when provided.
- Presents tabular content as the dominant visual structure, with headers, records, and cells clearly organized.
- Provides each body record with an untitled first control column dedicated to expanding or collapsing that record’s details and visually subordinate to the record data.
- Indicates a collapsed record with a directional expansion indicator and an expanded record with a directional collapse indicator.
- Toggles only the activated record’s expanded state when its expansion control is activated.
- Emits \`rowClick\` with the activated record index when expansion is requested, enabling details to be loaded on demand.
- Inserts a detail row immediately after each expanded record and visually associates it with that preceding record as complementary, subordinate content.
- Displays the declarative text and supplied components from the record’s \`Detail\` content area in its detail row, preserving nested interactive components as functional elements.
- Allows sortable headers to be activated to alternate the active sort direction, reorder records by the corresponding column, identify the active sort column and direction, and emit \`sort\` with the current key and direction.
- Allows individual and all-record selection when selection is enabled, visually distinguishes selected records, maintains the selected indices as a comma-separated \`value\`, and emits \`change\` when that value changes.
- Presents pagination below the table when \`pageSize\` is greater than zero, communicates the current page and available navigation, updates \`page\`, and emits \`pageChange\` with the requested page.
- Presents supplied loading content or a loading representation while loading is active.
- Presents supplied empty content or a default no-records message when no body records exist.
- Presents a non-empty error message after the tabular content.
- Propagates the editing state to custom components within record cells, including those displayed in expanded details.
- Provides visible focus for records, expansion controls, sortable headers, selection controls, and active pagination controls.
- Supports keyboard navigation between records, selection toggling with Space, and sorting of sortable headers with Enter.
- Blocks expansion, collapse, sorting, selection, and pagination while disabled, and visually distinguishes disabled controls.
# Constraints
- Preserves all groupViewTable slots, properties, selection-value rules, events, and accessibility requirements.
- Supports only the groupViewTable content areas: Caption, TableHeader, TableBody, TableFooter, Empty, Loading, and Detail, with rows and cells in their defined table sections and at most one Detail per body record, as its direct child.
- Requires TableHeader and TableBody content and uses the group-defined row, header-cell, and data-cell structure.
- Accepts sorting only for header cells identified as sortable and uses their required column key in \`sort\`.
- Uses \`value\` as a comma-separated list of selected record indices only when selection is enabled; an empty string represents no selection.
- Does not present pagination when \`pageSize\` is zero.
- Does not permit any interaction while disabled.
- Does not introduce slots, properties, or events beyond the groupViewTable contract.
# Notes
- \`rowClick\` carries \`{ index }\`; \`sort\` carries \`{ key, direction }\`; \`pageChange\` carries \`{ page }\`; and \`change\` carries \`{ value }\`.
- \`Detail\` content may include text and supplied nested components, including interactive content and additional tables.
- The expanded detail content is supplied or updated by the consumer inside that record's \`Detail\` after the expansion request; an empty \`Detail\` before it is a valid state.
- The table exposes table semantics, labelled selection controls, sortable-header sort state, and labelled pagination navigation as defined by the group contract.`;
