/// <mls fileReference="_102040_/l2/molecules/groupnavigatesection/ml-tabs.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupNavigateSection';
export const skill = `# Metadata
- TagName: groupnavigatesection--ml-tabs

# Objective
Allow the user to switch between multiple named content panels within a section by clicking labelled tab buttons arranged in a horizontal tab bar. The component tracks which tab is active, renders the corresponding panel below the tab bar, and supports icons, disabled tabs, an error message, a loading state, and full keyboard navigation.

# Responsibilities
- Render each Tab slot as a button in the tab bar with its title and optional icon.
- Display the content panel of the active tab below the tab bar.
- Activate the tab whose value matches the value property; fall back to the first enabled tab when the stored value is absent or refers to a disabled tab.
- Dispatch a change custom event (bubbling, composed) with value and title when a non-disabled tab is clicked or activated via keyboard.
- Allow moving keyboard focus between enabled tab buttons using ArrowLeft and ArrowRight keys with wrapping.
- Activate the focused tab with Enter or Space.
- Apply ARIA roles (tablist, tab, tabpanel) and aria-selected, aria-disabled, aria-controls, and aria-labelledby attributes for accessibility.
- Render an optional Label slot above the tab bar as the tab list label.
- Display a loading message when the loading property is true.
- Show an empty-state message when no Tab slots are provided.
- Render an error message below the tab panel when the error property is non-empty.
- Block tab switching when the component-level disabled or loading property is true.
- Support light and dark color schemes through conditional class application.

# Constraints
- Only one tab panel may be visible at a time.
- Keyboard navigation must skip disabled tabs.
- Disabled tabs must render with reduced opacity, a not-allowed cursor, and must not dispatch change events.
- The active tab must receive tabindex="0"; all other tabs must receive tabindex="-1".
- Tab content is rendered via unsafeHTML from each Tab slot's innerHTML and must not be sanitized by this component.
- The component must not contain business logic; it only manages tab selection state.
- Error indication must persist until the error property is cleared externally.`;
