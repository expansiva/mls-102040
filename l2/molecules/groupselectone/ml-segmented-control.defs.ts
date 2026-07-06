/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-segmented-control.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectOne';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  selectOne: "segmented",
  labelPlacement: "top",
  validation: "inline-below",
  requiredMark: "asterisk"
};

export const skill = `# Metadata
- TagName: groupselectone--ml-segmented-control

# Objective
A single-selection control that presents multiple options as a connected horizontal group of segments. It allows choosing one option from a compact set, showing the selected label when inactive and displaying all options together when active for editing.

# Responsibilities
- Integrate with the groupSelectOne contract, supporting Label, Helper, Trigger, Item, Group, and Empty.
- Render each Item as a selectable segment with a visible label and an associated value.
- Maintain exactly one selected Item at a time; selecting an Item updates the current value and notifies the system of the change.
- When not in editing mode, display only the label of the currently selected Item as static text. Do not render segments, error messages, helpers, or emit change notifications.
- When not in editing mode and no Item is selected, display the configured placeholder or a default fallback if no placeholder is configured.
- When in editing mode, present all Items simultaneously as a horizontal group without requiring any panel or dropdown to be opened.
- Render disabled Items visibly but prevent their selection and suppress change notifications when they are activated.
- Present an error state when the control is required and no value is selected, following the validation rules of the contract.
- Display an error message and apply an error state when an error is present; otherwise display Helper content when available.
- Indicate loading and block all interactions, preventing selection and focus.
- Block all interactions and apply a disabled state to the entire control when disabled.
- Prevent selection changes while maintaining visible selected content when readonly.
- Render Empty content when no Items are present; if Empty is not provided, render an explicit empty state.
- Notify when the control receives and loses focus according to the contract.
- Support keyboard navigation between segments, confirmation of selection, and dismissal of any open state.
- Expose accessibility information so assistive technologies can identify the control type, selected option, disabled options, required status, and error conditions.

# Constraints
- Only one Item may be selected at any time.
- All options must remain visible simultaneously during editing; they must not be hidden behind an additional interaction layer.
- Disabled Items must never trigger selection or change notifications.
- The control must not emit change notifications when not in editing mode.
- Error display takes precedence over Helper display.
- Loading state must prevent all user interactions including focus.
- Designed for compact sets of short labels, typically between 2 and 5 options.
- When not in editing mode, the display must be non-interactive plain text without borders or backgrounds.

# Notes
- Trigger content serves as a placeholder only when no Item is selected.
- The selected Item label always takes precedence over Trigger content when a value is present.`;

