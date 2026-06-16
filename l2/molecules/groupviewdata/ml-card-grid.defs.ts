/// <mls fileReference="_102040_/l2/molecules/groupviewdata/ml-card-grid.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewData';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  recordsView: "grid"
};

export const skill = `# Metadata
- TagName: groupviewdata--ml-card-grid

# Objective
Display records as individual cards arranged in a responsive multi-column grid. Each card combines visual content, title, description, metadata, and actions, offering a spacious, visual alternative to tabular presentation. Suitable for product catalogs, employee directories, project listings, document galleries, and customer panels.

# Responsibilities
- Use exclusively the contract slot tags: Columns, Column, Rows, Row, Cell, Empty, and Loading.
- Represent each Row as one card in the grid.
- Present each Cell inside a Row as a content block within the card, preserving the declared order and accepting any content type—such as images, avatars, titles, descriptions, metadata, or actions—without enforcing additional structure.
- Respect column definitions including field, header, width, align, and hidden to guide data presentation and omit fields marked as hidden.
- In loading state, hide all rows and present only the Loading content when provided.
- When no Rows are present, hide the grid and present only the Empty content when provided.
- When selection is enabled, toggle the selected state of a card upon activation and communicate the current list of selected indices through selection-change.
- When selection is enabled, communicate the activated row index and Row reference through row-click upon card activation.
- When selection is disabled, communicate only the activated row index and Row reference through row-click upon card activation.
- Prevent activation and selection changes on cards whose Row carries the disabled attribute, expose aria-disabled, and present the card as non-interactive.
- Present cards whose Row carries the selected attribute as selected, expose aria-selected, and apply the corresponding visual highlight.
- Provide hover feedback on cards when hoverable is enabled; suppress all hover feedback when hoverable is disabled.
- Enforce the presence of Columns, Rows, and at least one Column, raising the contract-specified errors when any are absent.
- Ignore unknown tags and issue the contract-specified warning.

# Constraints
- The grid must automatically adjust its column count to fit the viewport.
- Cards must maintain comfortable internal spacing and clear visual separation.
- Selected cards must exhibit a visual highlight consistent with the contract's Selected state.
- Disabled cards must present reduced opacity and must not react to interaction.
- Loading and Empty states must replace the grid entirely rather than appearing alongside it.
- Background, border, and text colors must support dark mode variants per the general contract semantic table.
- Cards must align uniformly and scale responsively within their container without relying on fixed dimensions.

# Notes
- The internal card layout naturally supports visual-first arrangements, allowing images or avatars to precede titles, descriptions, and actions in the order defined by Cells.
- Unrecognized tags are ignored to preserve forward compatibility.`;

