/// <mls fileReference="_102040_/l2/molecules/groupentertext/ml-tag-input.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterText';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  labelPlacement: "top",
  validation: "inline-below",
  requiredMark: "asterisk"
};

export const skill = `# Metadata
- TagName: groupentertext--ml-tag-input

# Objective
Provide a tag entry field that allows users to create multiple tags from typed text, display each tag as a removable chip, and manage the collection as a single comma-separated value. It must support constraints on tag count and length, prevent duplicates, offer suggestion areas, and adapt behavior between single-line tag entry and standard multi-line text entry.

# Responsibilities
- Accept text entry and convert delimited tokens into tags when in single-line edit mode.
- Present each committed tag as a removable chip inside the field before the text entry region, keeping the entry region visible for additional input.
- Present on each chip the tag text and a visible removal control with clear interaction affordance.
- Maintain the current tag collection as a single comma-separated string, ignoring empty tokens.
- Emit the updated comma-separated value immediately after tags are added or removed.
- Prevent addition of duplicate tags using case-insensitive comparison.
- Enforce configured maximum and minimum length limits on individual tags.
- Block further character entry when the current token reaches the maximum length.
- Block tag creation and removal when the field is disabled, loading, or readonly.
- Present label, helper, prefix, and suffix content according to the groupEnterText contract.
- Display error text and apply error visual treatment when an error is present.
- Provide a helper area during edit mode for external suggestion content.
- Switch to plain text display without chips or interaction when in view mode, showing an em dash when the value is empty.
- Adopt standard multi-line text entry behavior when configured for multiple rows, including length limits and character counting.
- Visually indicate focus by highlighting the field border during active input in edit mode.
- Visually indicate disabled and loading states as non-interactive without focus styling that suggests editability.
- Visually indicate readonly state as non-editable while keeping text selectable.
- Emit focus and blur events when the field gains or loses attention in edit mode.
- Emit change events when the field loses focus in edit mode.
- Support dark-mode color semantics for all visual states.

# Constraints
- Must only present content in the Label, Helper, Prefix, and Suffix areas defined by the groupEnterText contract.
- The stored and emitted value must always be a comma-separated string.
- In single-line edit mode, Enter and comma must commit the current token as a tag only if the token is not empty.
- After committing a tag in single-line edit mode, the entry area must clear to accept the next token.
- Duplicate tags must not be added, and no value update or event may occur for duplicate attempts.
- Tags exceeding the maximum length or below the minimum length must not be added.
- Chips must flow to the next line when they exceed the available field width.
- Removing a chip must update the comma-separated value and emit the new value immediately.
- No input or change events may result from user interaction while disabled, loading, or readonly.
- No tag creation or removal interactions may be available while disabled, loading, or readonly.
- In view mode, interactive controls must not appear, input/change/focus/blur events must not emit, error and helper content must be hidden.
- In multi-line mode, tag chips, delimiters, and tag-specific parsing must not be active.
- The molecule must not filter or manage suggestion data; it must only render the helper area for external suggestion content.
- All color applications must include dark-mode variants.

# Notes
- Consumers are responsible for splitting the comma-separated string into an array if needed.
- The helper area serves as the visual container for autocomplete suggestions supplied by the parent.`;

