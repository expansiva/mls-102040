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
Presents tabular records with per-row inline editing and a complete record workflow — edit, save, cancel, delete and create — driven by controls the page supplies. It owns the editing MODE and the placement and visibility of those controls; the page owns the VALUES. It also sorts, paginates, selects rows, and lets a user reorder and resize columns for the session.

# Responsibilities
- Presents the supplied \`Caption\`, \`TableHeader\`, \`TableBody\` and \`TableFooter\` in that order, with \`TableRow\` inside each section, \`TableHead\` as header cells and \`TableCell\` as data cells; displays a supplied \`error\` message below the table.
- Requires \`TableHeader\` and \`TableBody\`; \`Caption\`, \`TableFooter\`, \`Empty\`, \`Loading\`, \`RowActions\` and \`NewRecordRow\` are optional.
- Marks the current editing state on the components the page placed inside the cells of a row, so those components switch between viewing and editing by themselves.
- Edits ONE ROW AT A TIME. A row identifies itself with \`key\` on its \`TableRow\`; a row without \`key\` falls back to its position, which is enough to keep rows distinct but changes when the table is sorted.
- Lets the PAGE own the editing mode when \`editing-rows\` is present, as a comma-separated list of row keys — present but empty means no row is open. Owns the mode itself when \`editing-rows\` is absent, so a supplied edit control opens its own row with no round trip through the page.
- Falls back to the single \`isEditing\` state, which marks every row at once, when no row key is in play.
- Presents the \`RowAction\` controls of each row's \`RowActions\` in an actions column the table adds after the data columns, and adds that column only when at least one row or the \`NewRecordRow\` supplies actions.
- Reads \`action\` on each \`RowAction\` to know what it does: \`edit\` opens the row, \`save\` and \`cancel\` close it, \`delete\` changes no mode, \`new\` opens the draft row, and any other value is reported as a generic row action.
- Reads \`when\` on each \`RowAction\` to know in which mode it appears — \`view\`, \`edit\` or \`always\`. When \`when\` is absent it is inferred from \`action\`: \`edit\` and \`delete\` appear in viewing, \`save\` and \`cancel\` appear in editing, anything else always appears.
- Keeps a control that is out of its mode present but unavailable, so it is also out of the keyboard order and out of the accessibility tree, and the component the page supplied is never destroyed or recreated by the change of mode.
- Emits \`edit\`, \`save\`, \`cancel\` and \`delete\` with the row key, and a generic row action with the key and the declared action value. Emits the event FIRST and changes the mode after, always in that order.
- Presents a \`RowAction\` placed directly in the \`TableFooter\` as a band across the whole width, and emits a new-record event when its action is \`new\`.
- Presents the cells of \`NewRecordRow\` as a DRAFT ROW pinned as the last row of the body, always in editing mode, holding the \`RowActions\` declared inside it. The draft row is not sorted, not paginated, not selectable, and does not take part in row navigation.
- Opens ONE draft row at a time, and emits the save and cancel events of the draft marked as a new record, so the page can tell creating from updating.
- Emits the new-record event even when no \`NewRecordRow\` was supplied, so a page that writes the new row itself is served by the event alone.
- Presents the draft row instead of the empty content when the body has no rows and the draft is open.
- Lets users request sorting from a \`TableHead\` marked \`sortable\`, alternates the direction between ascending and descending, emits a sort event with the column key and the direction, and keeps the active column and direction visible through an indicator subordinate to the header text.
- Sorts by the value a \`TableCell\` declares in \`sort-value\` when it is present, and by the cell's text otherwise, comparing as numbers when both values are numeric — so masked currency and dates order by their value and not by their text.
- Sorts the complete set of received rows and then slices it to the current page when the table holds every record.
- Keeps the received order and slices nothing when \`totalItems\` is greater than the number of rows received, because the page already sliced; it still emits the sort and page events so the page can reorder and requery.
- Lets users navigate pages when \`pageSize\` is greater than zero, emits a page-change event with the requested page, and derives the number of pages from the row count when \`totalItems\` was not declared.
- Presents row selection and selection of all rows when \`selectable\` is active, distinguishes selected rows, keeps \`value\` as comma-separated row indices, and emits a change event after each selection change.
- Emits a row-click event with the row index when a row is activated outside any control — selection controls and row actions do not produce it.
- Lets users reorder columns by dragging a header and resize a column by dragging the right edge of its header, for the session, keeping each header with its own cells and never letting a column fall below a minimum readable width. A column that appears after a reorder joins at the end instead of disappearing.
- Presents the supplied \`Loading\` content while loading, or a loading placeholder shaped like the table when none is supplied; presents the supplied \`Empty\` content, or an alternative message, when the body has no rows and nothing is loading.
- Supports row navigation with the vertical arrow keys over the rows of the current page, selection toggling with the space key, and sorting with the enter key on a sortable header, while leaving tab and enter free to operate the components inside the cells.
- Makes unavailability apparent and blocks sorting, selection, pagination, column reordering, column resizing and every row and footer action while \`disabled\` is active.

# Constraints
- Uses only the content areas, properties and events of the groupViewTable contract, plus the row actions and the draft row described here.
- Does NOT create, inject or replace input controls inside cells. Every editing interface comes from the components the page placed in the cells; a cell holding only text stays text in both modes.
- Does NOT hold the record's values. It changes the MODE; saving, discarding, reverting and clearing values are the page's, which is why a cancel needs the page to restore what it kept.
- Does NOT create, delete or persist records. It emits the events and the page writes or removes the \`TableRow\`.
- Accepts \`RowActions\` only as a direct child of a \`TableRow\` inside \`TableBody\`, or of \`NewRecordRow\`. One per row.
- Accepts one \`NewRecordRow\` and opens one draft row at a time — its cells are the page's own elements, so they cannot be in two rows at once.
- Requires \`key\` on \`TableRow\` for the editing and deleting flows; without it a row is identified by position, which changes when the table is sorted.
- Must not reorder or slice rows when \`totalItems\` is greater than the number of rows received: it holds one page, and ordering it would order a fraction of the set.
- Sorts only from a \`TableHead\` marked \`sortable\`, and never bypasses the shared comparison, which is what keeps \`sort-value\` working.
- Offers pagination only when \`pageSize\` is greater than zero, and never fetches data.
- Does not validate cell values and does not intercept the tab and enter keys inside cell contents.
- Keeps \`value\` as a comma-separated list of row indices while selection is enabled.

# Notes
- The division that explains every flow: the table owns the MODE, the page owns the VALUE. On a cancel the table closes the row and the page restores what it had; on a save the table closes the row and the page persists; on a new record the table opens the draft and the page fills and clears it.
- The presence of the \`editing-rows\` attribute — not its content — is what hands the mode to the page. Present and empty means "no row open", which is the state of a screen just after saving or cancelling.
- Row actions and the new-record trigger share one vocabulary, so a page that already knows \`RowAction\` needs nothing new to offer record creation.
- The draft row is a form, not a record: it stays at the end of the body on whatever page is showing, and the page decides what its fields start with.
- The events carry the row key, and the draft's save and cancel also carry the new-record mark. A page can keep its own copy of which row is open using only these events.
- Column order and width live for the session only and are not reported to the page.
- Table structure, headers, rows, cells, selection controls, row actions, the actions column and pagination expose their purposes to assistive technology.`;
