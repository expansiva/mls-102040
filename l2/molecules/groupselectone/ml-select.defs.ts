/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-select.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupSelectOne';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  selectOne: "dropdown"
};

export const skill = `# Metadata
- TagName: groupselectone--ml-select

# Objective
Allow the user to choose exactly one option from a conventional click-to-open dropdown list. The component shows a trigger button that displays the current selection or a placeholder, and opens a panel of options when clicked. Unlike the combobox, it accepts no typed input — selection is made entirely by clicking or keyboard navigation. It supports grouped options, required and error states, disabled and readonly modes, and a read-only view mode.

# Responsibilities
- Toggle the option panel open or closed when the trigger button is clicked.
- Open the panel and pre-highlight the current value (or the first item) when Arrow Down, Arrow Up, Enter, or Space is pressed while closed.
- Move the highlight down or up through non-disabled options with Arrow Down / Arrow Up keys while the panel is open.
- Select the highlighted option and close the panel when Enter or Space is pressed while the panel is open.
- Close the panel without making a selection when Escape is pressed.
- Close the panel when the user clicks anywhere outside the component.
- Select an option immediately when it is clicked in the panel, then close the panel.
- Update the highlight index on mouse move over options so keyboard and pointer navigation stay in sync.
- Display items inside labeled group sections with a separator line when items belong to a Group slot.
- Show a checkmark next to the currently selected option in the panel.
- Render a loading spinner and label inside the trigger button while loading = true, and disable the trigger.
- Show an error message below the trigger when error is set, or helper text from the Helper slot when there is no error.
- Dispatch a "change" custom event with the new value when a selection is made.
- Emit "focus" and "blur" events from the trigger button.
- Render a compact read-only label and value text when isEditing = false.
- Append a required asterisk to the label when required = true.
- Render an empty-state message (from the Empty slot or the default text) in the panel when no items are defined.

# Constraints
- No text input is permitted; the user can only select from the predefined item list.
- All interaction must be blocked when disabled = true, readonly = true, or loading = true.
- Disabled options (item-level disabled attribute) must not be selectable by click or keyboard and must appear visually dimmed.
- Only one option can be selected at a time; selecting a new option always replaces the previous one.
- The option panel must not be visible while the trigger does not have an open state.
- The highlight index must stay within the bounds of the selectable (non-disabled) items array.
- isEditing = false activates a read-only view that shows only the label and selected value text without any interactive elements.`;
