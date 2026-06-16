/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-select-dropdown.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectOne';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  selectOne: "dropdown"
};

export const skill = `# Metadata
- TagName: groupselectone--ml-select-dropdown

# Objective
Provide a single-selection control that displays the current choice in a collapsed field and reveals a list of available options when activated. It must support searching, validation, and distinct display modes for editing and viewing.

# Responsibilities
- Display the currently selected option's label or a placeholder when no selection exists.
- Reveal a list of available options when the user activates the control.
- Hide the list when the user selects an option, activates an area outside the control, or cancels the operation.
- Update the stored selection to the chosen option's value and report that a change has occurred.
- Show a waiting indication and block list opening while data is being loaded.
- Render the current selection as plain text without interactive elements when in view mode.
- Block interaction but allow text selection when in read-only mode.
- Display a validation failure when a selection is required but none is present, and clear it once a selection is made.
- Provide a way to filter the option list by text when search is enabled.
- Keep unavailable options visible but prevent their selection.
- Use each option's displayed text as the source for its label, separate from its stored value.

# Constraints
- The option list must remain closed while the control is in a loading state.
- Unavailable options must not be selectable and must not trigger change reporting.
- Closing the list without choosing an option must preserve the existing selection and must not report a change.
- The control must not respond to user input when disabled.
- The control must not report changes when in view mode.
- The label shown for the selected option must always correspond to the chosen option's displayed text.
- A required but missing selection must keep the control in an error state until a valid choice is made.
- Filtering must compare the search text against option labels.

# Notes
- Follows the groupSelectOne contract for single-selection patterns.`;

