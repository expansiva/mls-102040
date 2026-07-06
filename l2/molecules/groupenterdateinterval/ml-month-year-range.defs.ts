/// <mls fileReference="_102040_/l2/molecules/groupenterdateinterval/ml-month-year-range.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterDateInterval';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  intervalInput: "dual-calendar",
  labelPlacement: "top",
  validation: "inline-below",
  requiredMark: "asterisk"
};

export const skill = `# Metadata
- TagName: groupenterdateinterval--ml-month-year-range

# Objective
Enable users to select a date range limited to month and year granularity. The molecule presents two independent year-navigable month grids, highlights the chosen interval, and communicates the selection through the groupEnterDateInterval contract.

# Responsibilities
- Display two month grids, each tied to a navigable year, allowing independent year traversal.
- Present months in a uniform layout with abbreviated names based on the current locale.
- Permit selection of a start month from the first grid and an end month from the second grid.
- Visually mark the selected start and end months with a distinct selection style.
- Highlight all months between the start and end selections with an interval style.
- While awaiting the end selection, keep the start month marked and allow interval preview by interacting with the end grid.
- Map selected months to startDate and endDate values representing the first day of each chosen month, adhering to the groupEnterDateInterval contract.
- After start month selection, store the startDate, clear any previous endDate, enter end-selection mode, and signal the start change.
- After end month selection, store the endDate; if the end precedes the start, automatically swap the values to maintain chronological order, then signal the end change and the final interval change.
- Disable months that fall outside the minDate and maxDate boundaries.
- Disable end months that would violate the minimum or maximum allowed range duration, converting day-based limits to month-level constraints.
- Block selection of the same month for both start and end when same-month selection is forbidden, remaining in end-selection mode until a distinct month is chosen.
- In non-editing mode, render only the formatted interval text according to the locale and contract display format, with no month grids visible.
- In loading state, show a loading indicator and prevent all interaction.
- In disabled state, block all interaction and prevent opening or selecting values.
- In readonly state, allow viewing and text selection but block value changes.
- Signal when the field gains focus and when it loses focus.
- In view mode, suppress all event emissions and hide error messages and helper text.
- Show a general field label, individual labels for the start and end grids, and helper text when no error is present.
- Show error messages with an error style when validation fails, replacing the helper text.
- Adapt all colors for dark mode across backgrounds, text, borders, hover states, selections, and errors using semantic pairs.
- Exhibit the visual states Normal, Selecting, Complete, Disabled, Readonly, Error, Loading, and View Mode.

# Constraints
- Day-level selection must never be exposed or permitted.
- Emitted values must always represent the first day of the selected month to satisfy the contract format.
- Change notifications must use only the contract-defined startDate and endDate properties, never custom month-only fields.
- Disabled months must not respond to interaction or show hover effects.
- Interval selections must respect configured minimum and maximum range limits.
- Visual feedback must accurately reflect the current selection and preview states.
- Grids and interactive elements must not appear in view mode or during loading.
- Error and helper text must not appear simultaneously; error takes precedence.

# Notes
- Independent year navigation in each grid supports selections that span multiple years.
- Interval preview during end-selection gives immediate visual feedback before confirmation.`;

