/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-select-dropdown-img.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectOne';
export const skill = `# Metadata
- TagName: groupselectone--ml-select-dropdown-img

# Objective
A selection field that displays the currently chosen option and opens a list of choices when activated. Each option includes an icon alongside text, supporting use cases such as language or country selection where each entry is identified by a representative image or symbol.

# Responsibilities
- Display the selected option inside the trigger, including its icon and text.
- Show a placeholder when no option is selected, using defined placeholder text or fallback visual content.
- Toggle the options panel open and closed when the trigger is activated, unless the component is disabled, readonly, or loading.
- Present each option with an icon to the left of its text label.
- Set the current value when a non-disabled option is chosen, close the panel, and signal that a change occurred.
- Provide an internal search field that filters the list of options when the search capability is enabled.
- Close the options panel when the user presses Escape or clicks outside the component.
- In view mode, render only the text of the selected option as static content without showing interactive controls.
- Keep disabled options visible but prevent them from being selected and mark them as unavailable.
- Indicate an error state when the field is required and no value is selected.
- Block panel opening while the component is in a loading state.

# Constraints
- Must not open the options panel if the component is disabled, readonly, or loading.
- Disabled options must remain visible but must not be selectable.
- The panel must close after a selection is made, when Escape is pressed, or when interaction occurs outside the component.
- In view mode, must not display the trigger, panel, helper text, or error messages.
- Must communicate invalid and required states to assistive technologies.
- Must preserve the icon and text arrangement of an option when it is shown in the trigger as the selected value.

# Notes
- Option content containing images or symbols should render consistently in both the dropdown list and the trigger area.
- Placeholder behavior applies only when no option is currently selected.`;

