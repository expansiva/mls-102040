/// <mls fileReference="_102040_/l2/molecules/groupenternumber/ml-number-input.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupEnterNumber';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  numberInput: "input",
  labelPlacement: "top",
  validation: "inline-below"
};

export const skill = `# Metadata
- TagName: groupenternumber--ml-number-input

# Objective
Allow the user to type a numeric value into a text field that accepts locale-aware decimal input with optional prefix and suffix slot adornments. On blur the component rounds the value to the configured decimal places, clamps it to min/max bounds, and reformats the display text. In view mode it shows the formatted number alongside any prefix or suffix without an editable field.

# Responsibilities
- Render a text input with inputmode="decimal" for entering a number.
- Parse the typed text on each input event using locale-aware group and decimal separators, updating the numeric value property immediately and emitting an input event.
- On blur, parse the raw text, round the result to the configured decimals, clamp to min/max bounds, reformat the display text using locale-aware formatting, and emit a change event; emit a blur event regardless of whether the value changed.
- Emit a focus event when the input gains focus.
- Support optional Prefix and Suffix slot adornments rendered to the left and right of the input respectively.
- Apply the configured locale and decimals to all number formatting via toLocaleString / Intl.NumberFormat.
- Synchronize the internal raw display value when value, locale, or decimals are changed externally via handleIcaStateChange.
- In view mode, display the formatted value (or "—" when null) flanked by any Prefix and Suffix slot content; omit the input element entirely.
- Show a loading indicator text when loading is true.
- Render an error message when error is non-empty, or a helper message from the Helper slot otherwise.
- Render an optional label from the Label slot.

# Constraints
- Input, typing, and value updates must be blocked when readonly, disabled, or loading is true.
- Rounding and clamping must only occur on blur, not during live typing.
- Error indication must persist until the error property is cleared.
- The component must not contain business logic; it is a pure presentation molecule.`;
