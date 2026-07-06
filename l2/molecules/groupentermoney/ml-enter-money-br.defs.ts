/// <mls fileReference="_102040_/l2/molecules/groupentermoney/ml-enter-money-br.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterMoney';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  labelPlacement: "top",
  validation: "inline-below"
};

export const skill = `# Metadata
- TagName: groupentermoney--ml-enter-money-br

# Objective
A monetary input field that accepts numeric typing and automatically formats values according to Brazilian currency conventions. As the user types digits, the value fills from right to left, applying thousand and decimal separators without displaying the currency symbol.

# Responsibilities
- Accept only numeric characters during editing; ignore any letters, symbols, or signs without changing the field's value.
- Format the displayed value using Brazilian locale conventions: period as thousands separator and comma as decimal separator.
- Omit the currency symbol from display, showing only the formatted numeric value.
- Fill entered digits from right to left, so that typing "123456" displays as "1.234,56".
- Emit an input event containing the parsed numeric value during typing, following the group's contract rules.
- On focus loss, set the value to null if the field is empty; otherwise normalize the value, apply minimum and maximum bounds if defined, reformat the display, and emit change followed by blur events.
- In read-only mode, display the formatted value or an em dash when null, without presenting an input field or emitting events.
- Respect disabled and read-only states by blocking interaction as defined by the contract.
- Display an error state when a non-empty error string is provided; otherwise display helper text when a Helper slot is present.
- Support Label and Helper slots exactly as defined by the contract.
- Present the label above or beside the field when provided, and helper text below when no error exists.
- Show error styling and error message below the field when in error state.
- Present reduced opacity and no visual interaction cues when disabled.
- Support dark mode color variants for background, text, border, hover, focus, and error states as defined by the contract.

# Constraints
- Must expose properties and events exactly as defined by the groupEnterMoney contract.
- Default configuration must use Brazilian locale (pt-BR), BRL currency, and 2 decimal places.
- Must never accept non-numeric input during editing.
- Must not display the currency symbol under any editing or viewing state.
- Must not emit input, change, or blur events in read-only mode.
- Empty content on blur must result in a null value.
- Must apply min/max constraints only when explicitly defined.
- Error state takes precedence over helper text display.

# Notes
- The component operates in two distinct modes: editing (interactive input) and viewing (static display).
- Right-to-left filling means each new digit shifts the decimal place accordingly.`;

