/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-combobox.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupSelectOne';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  selectOne: "dropdown",
  labelPlacement: "top",
  validation: "inline-below"
};

export const skill = `# Metadata
- TagName: groupselectone--ml-combobox

# Objective
Allow the user to choose exactly one option from a list by typing into a text field to filter results. A dropdown of matching options appears as the user types or when the field is focused. Optionally, when free-text mode is enabled, any typed value can be accepted even if it does not match a predefined option. The component supports groups, a clearable selection, required and error states, and a read-only view mode.

# Responsibilities
- Open the dropdown and display all options when the text field is focused.
- Filter the visible options in real time as the user types, using case-insensitive partial matching on option label text.
- Confirm the highlighted option as the selection when Enter is pressed, and close the dropdown.
- Move the highlight down or up through the visible non-disabled options with Arrow Down / Arrow Up keys.
- Close the dropdown without making changes when Escape is pressed, restoring the text field to the currently selected label.
- Close the dropdown when Tab is pressed or when the user clicks outside the component.
- Commit the typed text as the value in free-text mode when Enter is pressed and no option is highlighted, or when the field loses focus.
- Display a "Use ..." entry at the bottom of the dropdown in free-text mode when the typed text does not exactly match any visible option.
- Sync the text field display to the selected option's label when value is changed externally while the dropdown is closed.
- Show an optional clear (x) button when clearable = true and the field has a value; clicking it resets value to null.
- Display items inside named group sections with a group label header when items belong to a Group slot.
- Show a checkmark next to the currently selected option in the dropdown.
- Render a skeleton pulse placeholder while loading = true and the dropdown is closed.
- Dispatch "change" when a selection is confirmed, "input" on every keystroke, "focus" on field focus, and "blur" when the component loses focus.
- Show an error message below the field or a helper text from the Helper slot.
- Render a compact read-only label and value display when isEditing = false.
- Render a hidden input with the form name when the name property is set.

# Constraints
- All typing, dropdown opening, and selection must be blocked when disabled = true or loading = true.
- readonly = true must allow focus and display but block typing, dropdown opening, and selection.
- The dropdown must not be visible while the field lacks focus, except when opened by keyboard navigation.
- Only one option can be selected at a time; selecting a new option always replaces the previous one.
- In non-free-text mode, closing the dropdown without making a selection must restore the text field to the label of the current value, never retain an unmatched typed string.
- Disabled options (item-level disabled attribute) must not be selectable by mouse or keyboard.
- The clear button must not appear unless clearable = true is set.
- The error state must persist until the error property is cleared.`;
