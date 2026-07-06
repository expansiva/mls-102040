/// <mls fileReference="_102040_/l2/molecules/groupenternumber/ml-number-stepper.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupEnterNumber';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  numberInput: "stepper",
  labelPlacement: "top",
  validation: "inline-below"
};

export const skill = `# Metadata
- TagName: groupenternumber--ml-number-stepper

# Objective
Allow the user to enter or adjust a numeric value through a text input flanked by decrement and increment buttons. Each button click changes the value by the configured step, respecting min/max bounds, and the typed input is normalised and clamped on blur. In view mode the component renders the formatted value with optional prefix and suffix adornments but no interactive controls.

# Responsibilities
- Render a text input for direct numeric entry together with a decrement button (−) and an increment button (+).
- Increment the value by the step amount when the + button is clicked, silently ignoring the action if it would exceed max.
- Decrement the value by the step amount when the − button is clicked, silently ignoring the action if it would fall below min.
- Parse the typed text on each input event using locale-aware group and decimal separators, updating the numeric value property immediately and emitting an input event.
- On blur, parse the raw text, round the result to the configured decimals, clamp to min/max bounds, reformat the display text, and emit change and blur events.
- Emit a focus event when the input gains focus.
- Support optional Prefix and Suffix slot adornments rendered around the input.
- Apply the configured locale and decimals to all Intl.NumberFormat calls.
- Synchronize the internal raw display value when value, decimals, or locale are changed externally via handleIcaStateChange.
- In view mode, display the formatted value (or "—" when null) flanked by any Prefix and Suffix slot content; omit all interactive controls.
- When loading is true, show a loading indicator and suppress helper/error text in its favour.
- Derive an effective error from the explicit error property, or from the required constraint when the value is null; render a helper message from the Helper slot when no effective error is active.
- Render an optional label from the Label slot.
- Support English and Portuguese UI strings (loading indicator, required message, increment/decrement aria labels) via the locale property.

# Constraints
- Increment, decrement, and direct input must be blocked when disabled, readonly, or loading is true, and also when isEditing is false.
- Increment must be silently blocked when the resulting value would exceed max; decrement must be silently blocked when it would fall below min.
- Rounding and clamping must only occur on blur or after a stepper button click, not during live typing.
- The required error must only surface when required is true and value is null; it must be suppressed when the explicit error property is set.
- The component must not contain business logic; it is a pure presentation molecule.`;
