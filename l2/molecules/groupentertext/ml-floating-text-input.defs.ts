/// <mls fileReference="_102040_/l2/molecules/groupentertext/ml-floating-text-input.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupEnterText';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  labelPlacement: "floating",
  validation: "inline-below"
};

export const skill = `# Metadata
- TagName: groupentertext--ml-floating-text-input

# Objective
Allow the user to enter a single line of text through an input field that features a floating label — the label starts in the placeholder position and animates upward when the field is focused or has a value. The component supports optional input masking, prefix and suffix slots, character length limits, multiple input types, and disabled, readonly, error, loading, and view-only states.

# Responsibilities
- Display a floating label that animates to a smaller position above the input when the field is focused or has a value.
- Accept and expose typed text as the component's value, dispatching an "input" event on each keystroke and a "change" event on blur.
- Apply an optional input mask: insert literal separator characters automatically, strip non-matching characters, and store only the raw (unmasked) digits or letters as the value.
- Enforce optional maximum and minimum character length limits on the raw value.
- Support multiple input types (text, password, email, etc.) via the input-type property; never apply masking when the type is "password".
- Render a read-only view mode (isEditing = false) that shows the label and value as plain text, displaying "••••••••" for password type and "—" when the value is empty.
- Show an inline error message styled in red when the error property is set.
- Show a helper text below the field when a Helper slot is provided and there is no error.
- Render optional prefix and suffix content inside the input container via named slots.
- Show a spinning indicator inside the suffix area when the loading state is active.
- Dispatch "focus" and "blur" custom events when the underlying input gains or loses focus.
- Synchronize the displayed masked value when the bound value, mask, or input-type changes externally.

# Constraints
- Input, typing, focus, and all interaction must be blocked when disabled, readonly, loading, or isEditing is false.
- Masking must never be applied to password-type inputs.
- The raw (unmasked) value must be stored in the value property; masked characters are display-only.
- The clear action and option list are not part of this component; it is a plain text input, not a select.
- Error styling must persist until the error property is cleared externally.
- The loading state must prevent interaction and display a spinner in place of or alongside the suffix slot.
- Multiple simultaneous selections or multi-line input are not supported by this component.`;
