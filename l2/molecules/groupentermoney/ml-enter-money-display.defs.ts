/// <mls fileReference="_102040_/l2/molecules/groupentermoney/ml-enter-money-display.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupEnterMoney';
export const skill = `# Metadata
- TagName: groupentermoney--ml-enter-money-display

# Objective
Allow the user to type a monetary amount into a text field that accepts locale-aware decimal input, with an optional currency symbol adornment positioned according to the locale's currency format convention. In view mode the component renders the value formatted as a full currency string or plain decimal. The field clamps the value to configured min/max bounds and normalises the raw text to the correct number of decimal places on blur.

# Responsibilities
- Render a text input with inputmode="decimal" for entering a monetary amount.
- Display the currency symbol as a prefix or suffix adornment (determined by the locale's Intl.NumberFormat currency part order) when showSymbol is true.
- Parse the typed text on every input event using locale-aware decimal and group separators, updating the numeric value property immediately and emitting an input event.
- On blur, trim the raw text, parse it, clamp the result to min/max bounds, reformat it to the configured decimal places, and emit change and blur events with the final numeric value.
- Select all text in the input when it receives focus and emit a focus event.
- Apply the configured locale and decimals to all Intl.NumberFormat calls.
- Synchronize the internal raw display value when value, locale, or decimals are changed externally via handleIcaStateChange.
- In view mode, render the value using Intl currency formatting when showSymbol is true, or plain decimal formatting otherwise; show "—" when value is null.
- Show a loading indicator text when loading is true.
- Render an error message when error is non-empty, or a helper message from the Helper slot otherwise.
- Render an optional label from the Label slot.

# Constraints
- Input and value updates must be blocked when readonly is true; all interaction must also be blocked when disabled or loading is true.
- The currency symbol adornment must not be rendered when showSymbol is false.
- Clamping to min/max must only occur on blur, not during live typing.
- Error indication must persist until the error property is cleared.
- The component must not contain business logic; it is a pure presentation molecule.`;
