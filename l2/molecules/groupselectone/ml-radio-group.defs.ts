/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-radio-group.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectOne';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  selectOne: "radio",
  labelPlacement: "top",
  validation: "inline-below",
  requiredMark: "asterisk"
};

export const skill = `# Metadata
- TagName: groupselectone--ml-radio-group

# Objective
A single-selection option group that displays all available choices at once without hiding them behind a dropdown. It allows the user to pick exactly one option from a small set, making every option visible for quick comparison and selection.

# Responsibilities
- Present all options simultaneously in a visible list; never hide options behind a dropdown or collapsible panel.
- Provide distinct areas for Label, Helper, Item, Group, and Empty content. Each Item represents one selectable option and shows its label text.
- When the user chooses an enabled Item, set the value to that Item's value and indicate that the value has changed.
- Show disabled Items as visible but unavailable for selection; they cannot change the current value.
- Block selection changes and suppress change indications while readonly is active.
- Block selection changes and appear fully inactive while disabled is active.
- Display an error appearance and indicate invalidity when an error message is present; otherwise show helper text if available.
- When required is true and no value exists, display an error appearance until a selection is made.
- Display a loading appearance that prevents selection changes while loading is active.
- In view mode, render only the selected option's label as static text, or a placeholder when nothing is selected. Hide all interactive controls, error indicators, and helper text.
- Allow moving focus between options with arrow keys, confirm the focused option with Enter, and report when focus enters or leaves. Escape must not change the selection and may remove focus.
- When a Group area is present, render its label and include its Items as a labeled subsection while enforcing single-selection across all options.
- If no Items are provided, render the Empty area content if available.

# Constraints
- Only one option may be selected at any time, including across subgroups.
- Selection changes are prohibited during loading, readonly, and disabled states.
- Disabled options must remain visible and clearly distinguishable from enabled options.
- Error appearance persists until a valid selection is made when required; provided error messages override helper text.
- View mode must not expose interactive controls or validation feedback.
- The component must remain readable and usable when presenting 2 to 6 items at once.
- Selected, disabled, readonly, error, and loading states must each have a unique, recognizable appearance in any color context.

# Notes
- Designed for small option sets where immediate visibility of all choices improves decision speed.
- Group labels are visual separators; they do not allow multiple independent selections within the same component.`;

