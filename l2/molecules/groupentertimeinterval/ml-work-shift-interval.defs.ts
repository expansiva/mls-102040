/// <mls fileReference="_102040_/l2/molecules/groupentertimeinterval/ml-work-shift-interval.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterTimeInterval';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  intervalInput: "fields",
  labelPlacement: "top",
  validation: "inline-below",
  requiredMark: "asterisk"
};

export const skill = `# Metadata
- TagName: groupentertimeinterval--ml-work-shift-interval

# Objective
Enable users to define a single work shift interval with a start time and an end time. The component supports overnight shifts, enforces time constraints, communicates changes to the system, and clearly indicates its current state.

# Responsibilities
- Represent a single work shift interval defined by a start time and an end time.
- Enable users to provide a start time and an end time through direct input or selection controls.
- Support overnight intervals that extend into the following day when enabled.
- Notify the system when a complete interval has been defined or confirmed.
- Notify the system whenever the start time or end time is modified.
- Notify the system when the component gains or loses focus.
- Restrict selectable and enterable times based on configured minimum and maximum bounds, step increments, duration limits, and whether identical start and end times are allowed.
- Indicate when data is loading by blocking interaction and displaying a loading indicator.
- Block all user interaction when disabled.
- Prevent modification while allowing text selection when in a read-only state.
- Require both the start and end times to be provided when marked as mandatory.
- Display error indicators and messages when the interval is invalid or an error condition is present.
- In display mode, present only the formatted interval text without controls or auxiliary information.
- Display preset descriptions as auxiliary text only; selecting a preset must be handled outside the component.
- Manage exactly one time interval; supporting multiple shifts simultaneously must be handled by external orchestration.
- Display an overall label describing the interval when provided.
- Display separate labels for the start and end fields when provided.
- Present the start and end fields as a unified group.
- Indicate which field is currently being edited.
- Indicate when both start and end times have been provided.
- Identify overnight intervals with an indicator showing the end time occurs on the following day.
- Format displayed times according to the system convention and indicate missing values with a placeholder.
- Display auxiliary text when no error exists, and replace it with error text when validation fails.
- Adapt colors and contrast for dark mode environments.

# Constraints
- Must block interaction while loading or disabled.
- Must not present input controls or auxiliary text in display mode.
- Must require both times when mandatory; partial intervals are not acceptable.
- Must not perform preset selection internally.
- Must manage only one interval at a time.
- Must communicate error states accessibly.
- Must represent times in 24-hour format and support optional seconds precision.
- Must only permit overnight intervals when explicitly enabled.

# Notes
- Preset selection and multiple shift management are handled by parent components.
- Auxiliary text may describe available presets, but does not trigger selection.`;

