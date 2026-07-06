/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-listbox-sidebar-select.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectOne';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  selectOne: "listbox",
  labelPlacement: "top",
  validation: "inline-below",
  requiredMark: "asterisk"
};

export const skill = `# Metadata
- TagName: groupselectone--ml-listbox-sidebar-select

# Objective
A permanently open listbox for sidebar master-detail selection that allows choosing a single item from a visible list. It presents options in an always-open panel during editing and collapses to a static label in view mode.

# Responsibilities
- Use the groupSelectOne contract with Label, Helper, Trigger, Group, Item, and Empty slots.
- In edit mode, keep the listbox panel permanently open and hide the trigger control.
- In view mode, show only the selected item's label as static text, or a placeholder when no value is selected; hide the panel, helper, and error content.
- Update the value to an item's value attribute when that item is selected, and emit a change event carrying the selected value.
- Ignore selection attempts on disabled items and do not emit change events for them.
- Render a loading state and block all selection when loading is active.
- Render a disabled state and prevent selection changes when disabled is active.
- Render a readonly state, prevent selection changes, and allow content selection when readonly is active.
- Render an error state when required is true and no value is selected, clearing only after a selection is made.
- Display the error message and error state when error is a non-empty string; never show errors in view mode.
- Render the Empty slot content inside the panel when no Item slots are present.
- Derive display labels from Item slot content and store selection values from each Item's value attribute.
- Support grouped items via Group slots, displaying the group's label attribute as a heading above its items.
- Provide a search input inside the panel when searchable is true, filtering visible items by their labels.
- Emit focus events when the listbox gains focus and blur events when it loses focus.
- Expose correct accessibility roles and states: listbox role on the panel, option role on each item, with aria-selected, aria-disabled, aria-required, aria-invalid, aria-labelledby, and aria-describedby reflecting current conditions.
- Support keyboard navigation in the open list: ArrowUp and ArrowDown move between items, Enter selects the focused item, and Escape clears active navigation without closing the panel.
- In edit mode, place the Label slot above the panel and the Helper or error message below the panel.
- Clearly indicate the currently selected item within the list.

# Constraints
- The listbox panel must remain open in edit mode and must not close as a result of selection or navigation.
- Error messages and helper text must not appear in view mode.
- Disabled, readonly, and loading states must prevent changes to the selected value.
- Search filtering must only affect item visibility and must not alter available values.
- Accessibility attributes must always match the current state and interaction mode.

# Notes
- The trigger slot is part of the contract but remains hidden in this molecule.
- Placeholder text is only relevant in view mode when no selection exists.`;

