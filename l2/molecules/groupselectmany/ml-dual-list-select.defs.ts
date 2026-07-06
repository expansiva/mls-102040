/// <mls fileReference="_102040_/l2/molecules/groupselectmany/ml-dual-list-select.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupSelectMany';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  selectMany: "dual-list",
  labelPlacement: "top",
  validation: "inline-below"
};

export const skill = `# Metadata
- TagName: groupselectmany--ml-dual-list-select

# Objective
Allow the user to select multiple items from a side-by-side two-panel layout. The left panel shows available (unselected) items and the right panel shows selected items. Users transfer items between panels using per-item Add/Remove buttons or bulk "Add all" / "Remove all" actions. The component supports optional search filtering, grouping, min/max selection limits, and a read-only view mode.

# Responsibilities
- Render two panels side by side: one for available items and one for selected items, each showing their item count.
- Move a single item from the available panel to the selected panel when its Add button is clicked, and back when its Remove button is clicked.
- Move all transferable available items to the selected panel when "Add all" is clicked, respecting the maxSelection limit.
- Move all removable selected items back to the available panel when "Remove all" is clicked, respecting the minSelection limit.
- Derive the available list as all items not present in value, and the selected list as all items present in value.
- Filter both panels simultaneously by the search query when searchable = true and the user types in the search field.
- Render items inside named group sections with a group label header when items belong to a Group slot.
- Store the multi-selection as a comma-separated string in value and dispatch a "change" custom event on every mutation.
- Prevent adding an item when maxSelection is set and the selection is already at the limit.
- Prevent removing an item when minSelection (or required = true) would be violated.
- Disable per-item buttons and bulk action buttons when the corresponding action is not permitted.
- Display a loading indicator and suppress all interaction when loading = true.
- Show an error message or helper text below the component when in editing mode.
- Render a compact chip-based view of the selected items when isEditing = false, with a placeholder when nothing is selected.
- Emit "focus" when focus enters the component and "blur" when it leaves (in editing mode).
- Render a hidden input with the form name when the name property is set.

# Constraints
- All item-transfer actions must be blocked when disabled = true, readonly = true, or loading = true.
- Actions are also blocked when isEditing = false (view mode), which renders the selected items as read-only chips.
- Adding an item must be rejected silently if the item value is already in the selected set.
- The minSelection constraint must include required = true as an implicit minimum of 1.
- Disabled items (item-level disabled attribute) must never be transferred by either per-item or bulk actions.
- The "Add all" button must be disabled when all available non-disabled items are already selected or the maxSelection cap is reached.
- The "Remove all" button must be disabled when the selected count is already at or below minSelection.
- value is always a comma-separated string of item values; multi-value selection must not use any other format.`;
