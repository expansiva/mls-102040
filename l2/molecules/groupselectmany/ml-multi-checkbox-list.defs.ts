/// <mls fileReference="_102040_/l2/molecules/groupselectmany/ml-multi-checkbox-list.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupSelectMany';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  selectMany: "checkbox-list"
};

export const skill = `# Metadata
- TagName: groupselectmany--ml-multi-checkbox-list

# Objective
Allow the user to select multiple options from a vertical list of checkbox-style buttons. Each item shows a visible check indicator when selected. The component supports optional search filtering, grouping, min/max selection limits, a required flag, and a read-only view mode that renders selected items inline.

# Responsibilities
- Render each available item as a clickable button with a checkbox indicator showing its selected state.
- Toggle an item's selection on click: add it to the selection if not selected, remove it if already selected.
- Filter the visible item list by the search query when searchable = true and the user types into the search field.
- Render items inside named group sections with a group heading when items belong to a Group slot.
- Show standalone Item slots that are not nested in a Group alongside grouped items.
- Store the multi-selection as a comma-separated string in value and dispatch a "change" custom event on each toggle.
- Prevent selecting an additional item when maxSelection is set and already reached.
- Show an empty-state message from the Empty slot or the default "No items available" text when no items match the current filter.
- Display a loading indicator and suppress interaction when loading = true.
- Show an error message or helper text below the list in editing mode.
- Apply an error border when the error property is set, or when required is true and nothing is selected, or when minSelection is not met.
- Render a compact inline view of selected item labels when isEditing = false, with a placeholder when nothing is selected.
- Emit "focus" when focus enters the component and "blur" when it leaves (in editing mode).
- Render a hidden input with the form name when the name property is set.

# Constraints
- All toggling must be blocked when disabled = true, readonly = true, or loading = true, and for items that carry the disabled attribute.
- Selecting a new item must be silently rejected when maxSelection is set and the current selection count already equals it.
- Unselecting an already-selected item must always be permitted regardless of maxSelection.
- isEditing = false activates read-only view mode; no interaction is possible and no feedback section is rendered.
- value is always a comma-separated string of item values; the selection must not use any other format.
- The search filter applies only to item text content and only when searchable = true; it never mutates value.`;
