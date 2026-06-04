/// <mls fileReference="_102040_/l2/molecules/groupentertext/ml-multiline-text.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupEnterText';
export const skill = `# Metadata
- TagName: groupentertext--ml-multiline-text

# Objective
Allow the user to enter either a single line of text or a multiline paragraph, switching automatically between an <input> and a <textarea> based on the rows property. The component supports optional input masking for single-line mode, character length limits, prefix and suffix slots, a live character counter for multiline mode, and disabled, readonly, error, loading, and view-only states.

# Responsibilities
- Render a <textarea> when rows > 1 and an <input> when rows = 1, using the same property contract for both.
- Accept and expose typed text as the component's value, dispatching an "input" event on each keystroke and a "change" event on blur.
- Apply an optional input mask in single-line mode (rows = 1) only: insert literal separators automatically, strip non-matching characters, and store only the raw value.
- Enforce optional maximum and minimum character length limits; truncate input that exceeds maxLength.
- Display a live character counter (current / max) below the textarea when rows > 1 and maxLength is set.
- Support multiple input types via the input-type property; never apply masking when the type is "password".
- Render a view mode (isEditing = false) showing the label and current value as plain text, displaying "••••••••" for password type and "—" when the value is empty.
- Show an inline error message styled in red when the error property is set.
- Show helper text below the field when a Helper slot is provided and there is no error.
- Render optional prefix and suffix content inside the input wrapper via named slots.
- Show a spinning loading indicator when the loading state is active.
- Dispatch "focus" and "blur" custom events when the underlying input or textarea gains or loses focus.
- Synchronize the raw display value when the bound value, mask, rows, or input-type changes externally.

# Constraints
- Input and all interaction must be blocked when disabled, readonly, loading, or isEditing is false.
- Masking applies only to single-line mode (rows = 1) and never to password-type inputs.
- The raw (unmasked) value must be stored in the value property; masked characters are display-only.
- The character counter must only be shown in multiline mode when maxLength is explicitly set.
- Error styling must persist until the error property is cleared externally.
- The component must not implement selection, autocomplete dropdown, or calendar-style pickers.`;
