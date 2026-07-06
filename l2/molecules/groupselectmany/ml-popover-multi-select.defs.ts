/// <mls fileReference="_102040_/l2/molecules/groupselectmany/ml-popover-multi-select.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectMany';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  selectMany: "popover",
  labelPlacement: "top",
  validation: "inline-below"
};

export const skill = `# Metadata
- TagName: groupselectmany--ml-popover-multi-select

# Objective
Act as a compact multi-selection control that opens a floating panel when activated. It allows choosing multiple options without keeping the selection interface permanently visible, making it suitable for filter bars and space-constrained interfaces.

# Responsibilities
- Follow the groupSelectMany contract using slots named Label, Helper, Trigger, Item, Group, and Empty.
- Render a default activator displaying the placeholder text when no Trigger slot is provided.
- Open and close the floating selection panel when the trigger is activated.
- Keep the panel open while the user selects or deselects multiple items in one session.
- Toggle the selection state of an Item when chosen and represent the current value as a comma-separated list of selected item values.
- Close the panel when the user presses Escape or clicks outside the component boundaries.
- Prevent the panel from opening when the component is disabled, readonly, or loading.
- Show a search input that filters Items and Groups by their labels when searchable is true.
- Enter an error state when required is true and no value is selected, or when minSelection or maxSelection constraints are violated.
- Block selection of further items when maxSelection is reached, and treat remaining unselected items as disabled.
- In view mode (isEditing=false), display only the selected values as static text or tags, and hide the trigger, panel, helper text, and error messaging.
- Emit change, focus, and blur events according to the contract during edit mode interactions.
- Show the Empty slot content when no items exist or when active filtering yields no results.
- Display a summary of current selections, such as a count or selected tags, in the trigger when partially filled.
- Position Label content adjacent to the trigger when provided.
- Position Helper content below the trigger when no error is present and the component is in edit mode.
- Indicate loading state on the trigger and keep the panel hidden during loading.

# Constraints
- Selecting an item must not close the panel.
- The panel must stay closed while disabled, readonly, or loading is true.
- Unselected items must not be selectable once maxSelection is reached.
- Error state must appear for empty required fields or violated selection count limits.
- Events must only be emitted during edit mode.
- View mode must not expose interactive controls or helper and error text.

# Notes
- The floating panel anchors to the trigger.
- Group slots organize items into labeled sections.
- Item slots represent individual selectable options.`;

