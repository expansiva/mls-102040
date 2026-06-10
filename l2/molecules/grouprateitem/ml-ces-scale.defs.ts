/// <mls fileReference="_102040_/l2/molecules/grouprateitem/ml-ces-scale.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupRateItem';
export const skill = `# Metadata
- TagName: grouprateitem--ml-ces-scale

# Objective
A molecule that presents a 1-to-7 Customer Effort Score rating scale, allowing users to select a numeric value representing their perceived level of effort. It displays options in a horizontal arrangement with a color gradient from low to high effort, supports configurable text labels at the extremes, and adapts its density based on the presence of label and helper content.

# Responsibilities
- Accept only Label, Helper, and Item slots as defined by the groupRateItem contract.
- When Item slots are provided, present only those items as selectable rating options, ignoring min, max, and step.
- Use the numeric value declared in each Item slot's value attribute as that option's selection value.
- When no Item slots are provided, generate rating options automatically from 1 to 7 in increments of 1.
- In edit mode, set the value to the selected option's number upon user selection and emit a change event with detail \`{ value: number | null }\`.
- In edit mode, when interaction is allowed, provide a visual preview of an option when it is hovered.
- Clear the hover preview when the user stops hovering, returning the visual state to reflect the current value.
- Emit focus and blur events according to the groupRateItem contract when the field receives or loses focus.
- In view mode, display the selected value statically without hover behavior or interactive affordances.
- Show the error visual state specified by the contract when the field is required and no value is selected.
- Display the error message below the control and apply the error visual state when an error is provided; hide error indicators in view mode.
- Prevent all selection, hover, and related event emission when disabled.
- Prevent value changes and hover effects when readonly, while continuing to show the current value.
- Automatically adopt a compact layout when both Label and Helper slots are absent, reducing spacing and control size while preserving full functionality.
- Present rating options horizontally as selectable items identified by their numeric values.
- Apply a left-to-right color gradient across options, associating the lowest value with minimal effort and the highest value with maximal effort.
- Visually emphasize selected and hovered options without altering their underlying gradient color identity.
- In view mode, present the selected value using the same effort-based color mapping, without interactive cues.
- Render the content of Item slots inside their respective options, allowing the first and last options to carry configurable extreme labels.
- When options are auto-generated, display numeric labels only and visually emphasize the first and last values to imply the scale extremes.
- Place the Label slot near the control as the field label.
- Place the Helper slot beneath the control when no error is present.
- Place the error message beneath the control and apply the error visual state when an error is active.
- Support dark-mode equivalents for all background, border, text, and gradient colors.
- In compact variant, reduce spacing between options, item padding, and text size while keeping labels readable.

# Constraints
- Must not use slot tags outside of Label, Helper, and Item.
- Item slots must declare a numeric value attribute to be treated as valid selection options.
- Auto-generated options are constrained to the 1–7 range.
- Change events must only fire in edit mode as a result of user selection.
- Hover preview must not activate in view mode, disabled state, or readonly state.
- Error messages and error visual states must be hidden in view mode.
- Focus and blur behavior must align strictly with the groupRateItem contract.
- Compact layout must be determined solely by the absence of both Label and Helper slots.
- The color gradient must consistently map the lowest available value to the low-effort end and the highest available value to the high-effort end, independent of how many options are rendered.

# Notes
- Configurable extreme labels depend on authors supplying Item slots at the first and last positions with the desired text.
- The gradient provides a fixed semantic reference for effort level and must remain distinguishable across all visual states.`;

