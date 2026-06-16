/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-select-one-autocomplete.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectOne';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  selectOne: "dropdown"
};

export const skill = `# Metadata
- TagName: groupselectone--ml-select-one-autocomplete

# Objective
Allow the user to choose exactly one option from a list by typing into a text field to filter results. A list of matching options appears when the field gains focus. The component supports readonly, disabled, and error states, offers an optional way to clear the selection, and allows full keyboard control.

# Responsibilities
- Filter the list of options by partial case-insensitive text match on their labels as the user types.
- Show the list of options when the field has focus; hide it when focus is lost.
- Permit only one selected option at a time; choosing a new option replaces the previous one.
- Display the label of the currently selected option inside the text field.
- Allow moving a highlight through the visible options using up and down arrow keys.
- Confirm the highlighted option as the selection when Enter is pressed.
- Close the option list without making changes when Escape is pressed.
- Show a message when typing yields no matching options.
- Provide an optional clear control that removes the current selection.
- Prevent all interaction, typing, and list display when in readonly or disabled states.
- Present an error message and invalid appearance when the field is in an error state.
- Indicate when data is loading and prevent selection during that time.
- Update the displayed label if the selected value is changed from outside.

# Constraints
- The option list must not be visible while the field lacks focus.
- Highlight navigation must remain within the filtered set of options.
- Readonly state must show the current selection label but block focus, typing, and list opening.
- Disabled state must show the current selection label but block all interaction.
- The clear control must not appear unless explicitly enabled.
- Error indication must persist until the error state is resolved.
- Selection must always be singular; multiple simultaneous selections are not allowed.

# Notes
- The filtering logic must match partial strings regardless of case (for example, typing "zonas" matches "Amazonas").
- The component is intended for single-item selection scenarios such as choosing one state from a country list.`;

