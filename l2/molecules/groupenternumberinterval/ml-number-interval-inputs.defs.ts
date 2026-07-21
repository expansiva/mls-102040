/// <mls fileReference="_102040_/l2/molecules/groupenternumberinterval/ml-number-interval-inputs.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterNumberInterval';
export const skill = `# Metadata
- TagName: groupenternumberinterval--ml-number-interval-inputs

# Objective
A molecule that captures a numeric interval composed of a lower bound and an upper bound, presented as two side-by-side numeric inputs. It is designed to be used wherever a min/max range must be entered, such as a minimum and maximum price, quantity range, or any other bounded numeric pair, and it operates under the groupEnterNumberInterval contract.

# Responsibilities
- Render two numeric inputs side by side: a start input (lower bound) and an end input (upper bound), separated by a visible connector.
- Bind the start input to the startValue and the end input to the endValue defined by the contract.
- While the user types, parse the entered text into a number respecting the decimals setting and update the corresponding value, then emit an input event with the current { startValue, endValue }.
- On commit (blur or Enter), apply clamping and gap validation and emit a change event with { startValue, endValue }.
- Render a static, formatted interval text instead of the inputs when isEditing is false; show an em dash when no value is set, the single value with an em dash when only one side is set, and the formatted interval when both sides are set.
- Respect min and max by clamping values that fall outside the allowed range.
- Enforce minGap and maxGap by adjusting the opposite value when one side is edited so the distance between the two values stays within the allowed gap.
- Use the step property for spinner increments and arrow-key adjustments on both inputs.
- When decimals is 0, only accept integer values in both inputs.
- Apply the placeholder property to both inputs when empty, unless a Placeholder slot is provided, in which case the slot content overrides the property.
- Display Prefix slot content immediately before the numeric value and Suffix slot content immediately after the numeric value inside each input (for example, a currency symbol or a unit).
- Display an optional LabelStart slot above the start input, an optional LabelEnd slot above the end input, and an optional overall Label slot above the whole field.
- Display an optional Helper slot below the field when there is no error.
- When error is a non-empty string, show the error message below the field, apply an error visual state to both inputs, and suppress the helper text.
- When disabled is true, make both inputs non-interactive, visually de-emphasize them, and emit no events.
- When readonly is true, keep both values visible and selectable but prevent editing.
- When loading is true, show a loading indicator in place of the controls and block user interaction.
- When required is true and either startValue or endValue is null, enter the error state with a required-field message.
- Dispatch focus on focus of either input and blur on blur of either input.
- Track which input (start or end) is the active one and reflect that focus state through visual emphasis.
- Forward the name property as the name attribute on each rendered input for form integration.

# Constraints
- The molecule must never allow startValue to exceed endValue after commit.
- Values outside the min..max range must be clamped and must not be emitted as invalid.
- The distance between startValue and endValue must always satisfy minGap and maxGap after commit; editing one side may push the other to keep the gap valid.
- Only numeric input is accepted, formatted according to locale and decimals.
- Helper text and error text must never be shown at the same time; error takes precedence.
- When isEditing is false, disabled, or loading, no user-driven events (input, change, focus, blur) are emitted.
- The required-field error must be reported whenever required is true and at least one of the two values is null.
- In view mode, the rendered text must be formatted using locale and decimals, and must default to a clear empty-state representation when values are missing.
- Prefix and Suffix content must remain visually attached to the numeric value of each input and must not be editable as part of the number.
- The active input must be visually distinguishable from the inactive input while focused.
- When both the per-side labels (LabelStart, LabelEnd) and the overall Label are provided, the overall Label is the one rendered above the field.

# Notes
- The connector between the two inputs acts as a visual separator and can be a dash, the word "até", the word "until", or any other short indicator defined by the contract; it is purely presentational.
- The molecule is intended to be used as a leaf input inside forms and integrates with form submission through the name attribute.
- The activeHandle state is internal and is used only to drive the visual emphasis of the currently focused input; it is not a public value.`;

