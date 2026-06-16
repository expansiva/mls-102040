/// <mls fileReference="_102040_/l2/molecules/groupviewdata/ml-kanban-board.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewData';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  recordsView: "kanban"
};

export const skill = `# Metadata
- TagName: groupviewdata--ml-kanban-board

# Objective
Display a Kanban board with configurable columns and vertically stacked cards. Enable moving cards between columns, adding new cards per column, and handling loading, empty, and selection states. Notify consumers of card movements and additions.

# Responsibilities
- Present columns side by side in a horizontal layout following the defined column order.
- Render each column header showing a primary title and complementary information such as color or an optional work-in-progress limit.
- Stack cards vertically inside each column.
- Display card content including title, subtitle, and badges while maintaining visual hierarchy.
- Allow cards to be dragged from one column to another when neither the source nor destination column is disabled.
- Upon dropping a card into a destination Row, emit a row-click event carrying the destination Row index and the moved Cell element so the consumer can derive the card identity.
- Include a dedicated add action Cell within each Row to support creating a new card; this Cell must not participate in drag-and-drop.
- Upon activating the add action Cell, emit a row-click event carrying the Row index and the add action Cell element.
- Show a loading state and hide column content while loading.
- Show an empty state when no Rows exist.
- Support column selection when enabled, track selected Row indices, and emit selection-change with the list of selected indices.
- Apply visual hover feedback to Rows and their Cells when hover is enabled.
- Expose busy, selected, and disabled states through aria-busy, aria-selected, and aria-disabled attributes.

# Constraints
- Must use only the contract slot tags: Columns, Column, Rows, Row, Cell, Empty, and Loading.
- Column headers must use the header attribute for the primary title; complementary header content must be placed in the Column slot content.
- Each Row must represent a Kanban column in the same order as the Column definitions.
- Each Cell inside a Row must represent exactly one card in that column.
- Card content must be rendered from the Cell's provided content without altering the intended visual structure.
- Cards must not be draggable to or from Rows marked with a disabled attribute.
- The add-card action must be a dedicated Cell within each Row and must not be treated as a draggable card.
- While loading is true, the Loading slot must fill the main area and Rows must be hidden.
- When no Rows are defined, the Empty slot must fill the main area.
- Selected Rows must show a distinct selected state; disabled Rows must show reduced opacity and inactive styling.
- All background, border, text, and state colors must have corresponding dark variants per the semantic contract.
- Horizontal scrolling must be available when total column width exceeds the available space.
- The component must declare aria-busy when loading, aria-selected on selected Rows, and aria-disabled on disabled Rows.

# Notes
- The consumer determines card identity by inspecting the card element returned in move and add notifications.
- Hover, selected, and disabled appearances must align with the system design contract.`;

