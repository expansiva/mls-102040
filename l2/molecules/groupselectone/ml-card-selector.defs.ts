/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-card-selector.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectOne';
export const skill = `# Metadata
- TagName: groupselectone--ml-card-selector

# Objective
A single-selection interface that presents choices as a grid of rich-content cards, enabling the user to review detailed descriptions before choosing one option. It serves high-stakes decisions such as plan selection, template choice, account type, risk profile, or service modality.

# Responsibilities
- Present each option as a card containing rich content including headings, descriptions, and supporting details.
- Allow selection of exactly one enabled card at a time.
- Update the current value to the chosen item and report the new value when a selection occurs.
- Display the selected item's label in the trigger area when the panel is closed.
- Show placeholder text when no item is selected; in view mode with no value, display the placeholder or a fallback dash.
- Group related cards under labeled headings when group content is provided.
- Display an empty state when no options are available.
- Provide a search field inside the panel when search mode is enabled, reducing visible cards to those matching the entered text.
- Support keyboard navigation between cards, confirmation of selection, and closing the panel.
- Indicate loading by showing a loading indicator in the trigger area and keeping the panel closed.
- Ignore trigger interaction and prevent the panel from opening when read-only or disabled.
- Present an error state when the field is required and no value is selected.
- In view mode, show only the selected label as plain text without interactive affordances, panels, helper text, or error messages.

# Constraints
- Must conform to the groupSelectOne contract for properties, events, and content regions.
- Disabled items must remain visible but cannot be selected and must not report value changes.
- When not in editing mode, the molecule must not display the trigger, panel, helper text, or error message.
- When loading, the selection panel must remain closed.
- When read-only or disabled, the panel must never open.
- Change, focus, and blur events must propagate according to the contract.
- The error state must apply to the trigger area and show the error message below the field; no error may appear in view mode.
- Helper text must appear below the field only when no error is present.
- The label must appear consistently with other groupSelectOne molecules.
- The selected card must have a distinct visual state using the contract's selected styling.
- Disabled cards must appear muted and must not respond to hover.
- All colors for borders, text, backgrounds, hover, focus, and selected states must include dark-mode variants.
- The card grid must wrap responsively to remain readable across varying container widths.
- Empty state content must be clearly visible within the panel.

# Notes
- The rich content inside each card is supplied entirely through the item's content region, enabling full customization of the card body.`;

