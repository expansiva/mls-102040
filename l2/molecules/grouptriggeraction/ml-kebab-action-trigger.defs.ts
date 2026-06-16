/// <mls fileReference="_102040_/l2/molecules/grouptriggeraction/ml-kebab-action-trigger.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupTriggerAction';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  actionStyle: "kebab"
};

export const skill = `# Metadata
- TagName: grouptriggeraction--ml-kebab-action-trigger

# Objective
A compact contextual trigger presented as a kebab or ellipsis button. When activated by the user, it signals the system to open an external contextual menu. Designed for dense interfaces such as data tables, where each row requires access to secondary actions without cluttering the primary view.

# Responsibilities
- Display as an icon-only button or as a button combining an icon with a text label
- Signal the system to open or toggle a contextual menu upon user activation
- Prevent menu triggering and block interaction when in a disabled state
- Prevent menu triggering and block interaction when in a loading state, showing a loading indicator instead of the default content
- Adjust dimensions, spacing, and typography proportionally based on the configured size
- Adapt visual appearance based on the configured type
- Position the icon to the left or right of the label based on configuration
- Supply an accessible name when running in icon-only mode by using provided label text
- Provide visual feedback for hover, active, and focused states
- Provide visual feedback for disabled and loading states
- Render suitably in both light and dark environments

# Constraints
- Must not render or manage the contextual menu, menu items, separators, or item styling directly
- Must not signal the menu to open while disabled or loading
- Must maintain a compact and neutral appearance appropriate for table rows and dense lists
- Must present a clearly visible focus indicator during keyboard navigation
- Must clearly indicate non-interactivity through reduced opacity or equivalent styling when disabled

# Notes
- Menu content, action lists, separators, destructive action styling, and dismissal behavior are managed by the parent component or external system.
- Typically used once per row in data tables, such as order grids offering actions like view details, edit, duplicate, or cancel.`;

