/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-select-dropdown-icon.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectOne';
export const skill = `# Metadata
- TagName: groupselectone--ml-select-dropdown-icon

# Objective
A selection field that displays the currently chosen option and reveals a dropdown list when activated. Each option combines a visual icon with text, enabling scenarios such as language or country selection where graphical identifiers like flags are presented alongside labels.

# Responsibilities
- Display the currently selected option inside the trigger, including both its icon and text.
- Display a placeholder indication when no option has been chosen.
- Reveal a dropdown panel containing all available options when the user activates the component.
- Present each option with an icon aligned to the left of its text label.
- Allow the user to select an option by choosing it from the dropdown panel.
- Prevent interaction and dropdown opening when the component is disabled.
- Prevent interaction and dropdown opening when the component is in a read-only state.
- Prevent interaction and dropdown opening when the component is loading.
- Filter the visible options when a search capability is active and the user provides input.
- Close the dropdown panel when the user presses the escape key.
- Close the dropdown panel when the user interacts outside the component boundaries.
- Render the selected option as static text without interactive controls when in view mode.
- Notify the system when the selected value changes.
- Indicate an invalid state when a selection is required but none is present.
- Visually distinguish disabled options and prevent their selection.
- Visually highlight the currently selected option within the dropdown list.

# Constraints
- Disabled options must be visible but cannot be selected.
- The dropdown must not open if the component is disabled, read-only, or loading.
- A placeholder must appear when no option is selected.
- Error indicators must be shown when the component requires a value but none is selected.
- The component must not display interactive triggers, panels, or helper messages when in view mode.
- The icon and text arrangement must remain consistent between the trigger display and the dropdown items.
- The dropdown must close after an option is chosen.
- The component must communicate its disabled, required, and invalid states to accessibility tools.
- Visual styles must adapt appropriately for dark environments.

# Notes
- Icons are considered part of the option's content and must appear in both the dropdown list and the trigger when selected.
- Designed for use cases requiring visual differentiation between choices, such as country flags or language icons.`;

