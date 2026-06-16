/// <mls fileReference="_102040_/l2/molecules/groupenterboolean/ml-toggle-icon.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterBoolean';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  boolean: "icon"
};

export const skill = `# Metadata
- TagName: groupenterboolean--ml-toggle-icon

# Objective
A boolean input component that behaves as a toggle switch with distinct icons for on and off states. It supports editing and viewing modes, optional labeling, helper text, error display, and disabled state, emitting events on user-driven state changes.

# Responsibilities
- Maintain a boolean \`value\` as the source of truth for the on/off state, defaulting to \`false\` when not provided.
- Display a distinct icon for the on state and a distinct icon for the off state, showing only the icon matching the current value.
- Perform a visible transition when switching between on and off states.
- In editing mode, toggle the boolean value upon user activation via click or Space key.
- Emit a \`change\` event with the current boolean value in \`detail.value\` after each state change in editing mode.
- Emit \`focus\` when receiving focus and \`blur\` when losing focus in editing mode.
- Render an associated label when provided, semantically linking it to the control.
- Display helper content below the control in editing mode when helper content is available and no error is present.
- Display an error message and expose an invalid state via \`aria-invalid\` when error text is provided in editing mode.
- In viewing mode, render static text “Yes” when the value is \`true\` and “No” when \`false\`.
- Present a visible focus indicator when the control has focus.
- Reduce opacity and remove interactive affordances when disabled.
- Apply emphasized visual treatment for the on state and neutral treatment for the off state.
- Apply error-specific visual highlighting and display the error message when invalid.
- Adapt colors for dark mode using semantic pairs.

# Constraints
- Do not respond to interaction, change the value, or emit events when disabled.
- Do not display helper text or error messages in viewing mode.
- Do not emit \`change\`, \`focus\`, or \`blur\` events in viewing mode.
- Only display helper content when no error is present and the component is in editing mode.
- Only toggle the value in response to click or Space key while in editing mode and not disabled.
- Error messaging and invalid state must only appear when error text is provided and the component is in editing mode.

# Notes
- The icons representing the on and off states are configurable.`;

