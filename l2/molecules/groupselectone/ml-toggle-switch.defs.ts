/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-toggle-switch.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectOne';
export const skill = `# Metadata
- TagName: groupselectone--ml-toggle-switch

# Objective
A binary selection control presented as a toggle switch that allows the user to choose between two mutually exclusive options. It provides clear semantics for yes/no, active/inactive, or enabled/disabled decisions.

# Responsibilities
- Treat only the first two provided items as valid binary options; disregard any additional items.
- Represent the selected choice as the string value of the chosen item; use null when no choice is made.
- Display the selected item label inside or next to the toggle so the current state is always visible without opening the options panel.
- In edit mode, show the selected label in the trigger; when no selection exists, show placeholder text or the provided trigger content using a placeholder visual style.
- Open and close the options panel when the user activates the trigger.
- When the panel is open, allow the user to pick an option, which updates the selection, closes the panel, and notifies that the value has changed.
- In view mode, show only the selected item label as static text; do not show the trigger, options panel, helper text, or error messaging.
- Block the panel from opening and ignore selection attempts when the control is disabled, readonly, or loading.
- Show a loading state in the trigger and prevent panel access while loading is active.
- Display an error message and apply error styling when a non-empty error is provided.
- Show helper text below the control when no error is present and helper content is available.
- Apply an error visual state when the control is required and no selection has been made.
- Allow navigation between the two options using arrow keys, confirm a selection with enter, and close the panel with escape.
- Notify when the control receives or loses focus.

# Constraints
- The toggle knob or indicator must reflect the first option in the left or off position, and the second option in the right or on position.
- The trigger must remain inactive for opening the panel while disabled, readonly, or loading.
- Selection must be impossible while the control is disabled or readonly.
- Error display takes precedence over helper text.
- All visual states, including selected, unselected, hover, disabled, readonly, error, and loading, must use the appropriate semantic color pairings.
- Colors and contrast must adapt correctly for dark mode.

# Notes
- This control follows the groupSelectOne contract for structure, properties, and behavioral expectations.
- Intended for mutually exclusive binary decisions where toggle semantics are clearer than a traditional choice list.`;

