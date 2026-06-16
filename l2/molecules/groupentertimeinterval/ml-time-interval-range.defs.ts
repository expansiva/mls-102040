/// <mls fileReference="_102040_/l2/molecules/groupentertimeinterval/ml-time-interval-range.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterTimeInterval';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  intervalInput: "fields"
};

export const skill = `# Metadata
- TagName: groupentertimeinterval--ml-time-interval-range

# Objective
Enable users to define a time interval by providing a start time and an end time, ensure the interval is logically valid, display the resulting duration in minutes, and report the interval to the system according to the groupEnterTimeInterval specification.

# Responsibilities
- Present two adjacent time fields labeled "Início" and "Fim"
- Receive time values in 24-hour format without seconds
- Restrict minute selection to increments defined by a configurable step
- Validate that the end time is later than the start time when same-time and overnight intervals are disallowed
- Show a clear visual error state when the selected end time does not come after the start time
- Calculate and visibly present the duration in minutes between the start and end times
- Report to the system when the start value changes, when the end value changes, and when the complete interval is confirmed or modified
- Visually reflect active, complete, disabled, read-only, loading, and required states
- In view mode, display the formatted time range as static text without controls, guidance text, or error messaging

# Constraints
- Duration calculation must assume the same calendar day unless overnight intervals are explicitly permitted
- The duration must be shown to the user but must not be included in interval reports to the system
- When an error is present, helper text must be hidden and the error indication must be shown
- Overnight intervals must display a "+1" day indicator in view mode only when overnight intervals are enabled
- Read-only and disabled states must prevent modification of the time values
- The required state must ensure both start and end values are provided
- All visual states must support dark mode appearance

# Notes
- The visual duration readout must update immediately whenever either time value changes
- Error validation must apply to the interval as a whole rather than individual fields alone`;

