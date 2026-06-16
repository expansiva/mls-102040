/// <mls fileReference="_102040_/l2/molecules/groupnavigatemain/ml-sidebar-nav.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupNavigateMain';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  navMain: "sidebar"
};

export const skill = `# Metadata
- TagName: groupnavigatemain--ml-sidebar-nav

# Objective
Provide a vertical sidebar navigation panel that organises application destinations into top-level items, labelled groups, and a footer section. The sidebar can be collapsed to an icon-only rail and supports an active selection, disabled items, badge indicators, collapsible groups, and a loading skeleton.

# Responsibilities
- Render top-level Item slots, Group slots (each containing Item children), and a Footer slot containing Item children as distinct navigation regions.
- Highlight the item whose value matches the value property as the active (current) page.
- Dispatch a change custom event (bubbling, composed) with value, label, and badge when a non-disabled item is clicked.
- Toggle the sidebar between full-width (w-64) and collapsed icon-rail (w-16) modes when the collapse button is activated, and dispatch a collapse event with the new collapsed state.
- When collapsed, hide item labels and badge text, replacing full badges with a small dot indicator on the icon.
- Show item initials as a fallback icon when no icon HTML is provided.
- Allow named groups to be expanded or collapsed individually by clicking the group label; groups without a label are always expanded.
- When collapsed, render group items without a group label header and separated by a horizontal divider.
- Display a loading skeleton with animated pulse items when the loading property is true.
- Render an optional Label slot as the sidebar header title when the sidebar is not collapsed.
- Block item selection and dispatch when the component-level disabled property or an individual item's disabled attribute is set.
- Support light and dark color schemes through conditional class application.

# Constraints
- Only one item may be active at a time; setting a new value replaces the previous active item.
- Disabled items must render with reduced opacity, a not-allowed cursor, and must not dispatch change events.
- The collapse toggle button must always remain visible regardless of collapsed state.
- The component must not contain business logic; it only manages navigation selection and layout state.
- Item badges and icons are rendered via unsafeHTML and must not be sanitized by this component.`;
