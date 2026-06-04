/// <mls fileReference="_102040_/l2/molecules/groupentermoney/ml-enter-money-minimal.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupEnterMoney';
export const skill = `# Metadata
- TagName: groupentermoney--ml-enter-money-minimal

# Objective
Provide a compact monetary amount input that accepts locale-aware decimal text and displays an inline currency symbol adornment. The component normalises and clamps the entered value on blur and switches to a minimal read-only display in view mode that shows the symbol beside the formatted number.

# Responsibilities
- Render a text input with inputmode="decimal" for entering a monetary amount.
- Display the currency symbol (resolved from the locale via Intl.NumberFormat) as an inline prefix adornment when showSymbol is true.
- Parse the raw text on each input event using locale-aware decimal and group separators, updating the numeric value property immediately and emitting an input event.
- On blur, parse the raw text, round to the configured decimal places, clamp to min/max bounds, reformat to a locale-aware decimal string, and emit change and blur events.
- Select all text in the input when it gains focus and emit a focus event.
- Apply the configured locale and decimals to all Intl.NumberFormat calls.
- Synchronize the internal raw display value when value, locale, or decimals are changed externally via handleIcaStateChange.
- In view mode, display the currency symbol beside the formatted raw value (or "—" when null); omit the symbol when showSymbol is false or value is null.
- Show a loading indicator text when loading is true.
- Render an error message when error is non-empty, or a helper message from the Helper slot otherwise; suppress feedback entirely in view mode.
- Render an optional label from the Label slot.

# Constraints
- Input, typing, and value updates must be blocked when readonly, disabled, or loading is true, and also when isEditing is false.
- The currency symbol adornment must not be rendered when showSymbol is false.
- Clamping and rounding must only occur on blur, not during live typing.
- Error indication must persist until the error property is cleared.
- The component must not contain business logic; it is a pure presentation molecule.`;
