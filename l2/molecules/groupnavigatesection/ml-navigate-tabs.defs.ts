/// <mls fileReference="_102040_/l2/molecules/groupnavigatesection/ml-navigate-tabs.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupNavigateSection';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  sectionNav: "tabs"
};

export const skill = `# Metadata
- TagName: groupnavigatesection--ml-navigate-tabs

# Objective
A tab navigation molecule that allows users to switch between content sections. It supports touch gestures, keyboard navigation, and indicates the active section while keeping inactive sections hidden.

# Responsibilities
- Display only the content associated with the currently active tab; keep all other sections hidden.
- When initialized without a preselected tab, automatically activate the first enabled tab.
- Upon user selection of an enabled tab, update the active state and communicate the new identifier and title to the system.
- Support horizontal swipe gestures to navigate sequentially to the previous or next enabled tab.
- Reject any attempt to activate a disabled tab through any interaction method.
- Support keyboard navigation to move focus between tabs and to confirm selection of the focused tab.
- Block all tab changes while the component is disabled.
- Display a loading state and prevent all user interaction while loading.
- Expose an accessible label for the tab group when provided.
- Maintain a visual indicator that tracks the active tab and moves smoothly between selections.
- Ensure all tabs remain reachable through horizontal scrolling when they exceed the available width.
- Visually distinguish the active tab from inactive tabs.
- Visually indicate disabled tabs as non-interactive.
- Display the active tab's content below the tab list, occupying the full available width.
- Adjust visual presentation appropriately for dark mode settings.

# Constraints
- Disabled tabs cannot be activated by any interaction method.
- The component must not allow tab changes while disabled or loading.
- Swipe navigation must follow tab sequence and bypass disabled tabs.
- Notifications of selection changes must include both the active tab's identifier and its title.
- Keyboard interaction must conform to accessibility standards for tab navigation.

# Notes
- The active tab's identifier may represent its positional index depending on how the author defines the tab values.`;

