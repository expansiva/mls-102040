/// <mls fileReference="_102040_/l2/molecules/groupselectmany/ml-multi-select-dropdown.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectMany';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  selectMany: "dropdown"
};

export const skill = `# Metadata
- TagName: groupselectmany--ml-multi-select-dropdown

# Objective
Provide a multi-select field that allows users to choose one or more options from a dropdown list. The field supports grouped options, search filtering, selection limits, and validation states, adapting its behavior between editing and viewing modes.

# Responsibilities
- Display a label to identify the field
- Present a trigger area that shows selected items, a selection count, or placeholder text when no items are chosen
- Toggle the dropdown panel open and closed when the user activates the trigger
- Keep the panel open while the user selects or deselects options
- List all available options in the dropdown panel, organized under group headers when grouping is configured
- Allow the user to select and deselect multiple options independently
- Provide a search input to filter the visible option list by label when search is enabled
- Show a loading indicator and prevent panel opening while loading
- Prevent all interaction and selection changes when disabled or readonly
- Render selected option labels as static non-interactive content when not in editing mode
- Notify the system when the selection value changes
- Notify the system when the field gains or loses focus during editing
- Enforce a minimum number of selected items by showing an error when the count is too low
- Enforce a maximum number of selected items by preventing additional selections and treating unselected options as non-selectable when the limit is reached
- Display individual options that are marked as non-selectable in a disabled state
- Show helper text below the field when no error exists and the field is in editing mode
- Show error messages below the field when validation fails or an error is explicitly set
- Display empty state content when no options are available to show
- Expose accessibility information including expanded state, popup role, multiselect capability, and the selected or disabled state of each option

# Constraints
- The current selection must be represented as a comma-separated list of option values; an empty string indicates no selection
- The dropdown panel must close when the user presses Escape or clicks outside the component boundaries
- The trigger must not activate and the panel must not open when the component is disabled, readonly, or loading
- Options marked as disabled must be visible but cannot be selected or toggled
- When a maximum selection limit is active and reached, unselected options must behave as disabled
- An error state must appear when the field is required and no options are selected
- An error state must appear when the number of selected items is below the configured minimum
- Error messaging takes priority over helper text display
- No trigger, dropdown panel, events, or validation messaging may be presented when the component is not in editing mode
- The label must be programmatically associated with the field
- Error descriptions must be programmatically associated with the field when present
- The field must indicate when it is invalid and when it is required to assistive technologies

# Notes
- The component uses named content regions: Label, Helper, Trigger, Item, Group, and Empty
- Each option carries a value identifier and can be marked as non-selectable
- A custom Trigger region replaces the default trigger content entirely
- The component supports both light and dark visual presentations`;

