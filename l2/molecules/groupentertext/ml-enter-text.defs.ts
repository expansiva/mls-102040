/// <mls fileReference="_102040_/l2/molecules/groupentertext/ml-enter-text.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterText';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  labelPlacement: "top"
};

export const skill = `# Metadata
- TagName: groupentertext--ml-enter-text

# Objective
Provide a general-purpose text input that supports minimum and maximum character limits, with clear modes for editing and viewing, and accessible interaction states.

# Responsibilities
- Render a single-line text input when the minimum number of rows is specified.
- Display the current text value and update it as the user types.
- Enforce minimum and maximum character limits, preventing input beyond the maximum and indicating errors when below the minimum.
- Emit events reflecting user interactions: input, change, blur, and focus, with the current value as appropriate.
- Switch between edit mode (interactive input) and view mode (plain text display) based on the editing state.
- Display a placeholder (e.g., '—') when the value is empty in view mode.
- Render optional elements for label, helper text, prefix, and suffix when provided.
- Indicate error, disabled, readonly, loading, and required states visually and functionally.
- Apply accessibility attributes for labeling, description, error indication, and required status.

# Constraints
- Input must not accept more characters than the defined maximum limit.
- Input must indicate an error and display an error message if the value is shorter than the minimum limit while editing.
- All interaction must be blocked when disabled or loading states are active.
- Editing must be blocked but text selection allowed when in readonly state.
- Required state must be indicated and reflected in accessibility attributes.
- Error state must only be visually indicated and error message shown when editing and an error is present.
- Accessibility attributes must always reflect the current state for screen readers.
- In view mode, only plain text or a placeholder is shown; no editing is possible.

# Notes
- The molecule must support both light and dark visual themes.
- Visual appearance and color roles must follow the defined contract for all states.
- All slot tags (Label, Helper, Prefix, Suffix) are optional and only rendered if provided.
`;

