/// <mls fileReference="_102040_/l2/molecules/groupenterdatetimeinterval/ml-event-duration-interval.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterDateTimeInterval';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  intervalInput: "duration"
};

export const skill = `# Metadata
- TagName: groupenterdatetimeinterval--ml-event-duration-interval

# Objective
Enable users to define an event time interval by providing a start and end date and time. The molecule automatically calculates the duration between the two points and presents it to the user. It supports defining the interval by directly setting the end, or by providing a duration in minutes or hours that the molecule converts into an end time. The molecule handles validation, boundary restrictions, and distinct presentation modes for editing and viewing.

# Responsibilities
- Present two date-time fields for start and end when the user is allowed to edit.
- Accept and confirm a start date and time from the user.
- Accept a duration expressed in minutes or hours and derive the corresponding end time automatically.
- If the end is not yet defined when the start is confirmed, guide the user to provide the end next.
- Accept and confirm an end date and time from the user.
- Communicate the confirmed start and end values, including the calculated duration, to the consuming system according to the groupEnterDateTimeInterval contract.
- Calculate the elapsed duration in minutes whenever both start and end are available, and present this value to the user.
- Block confirmation of an end that occurs before or at the same instant as the start, unless the configuration explicitly permits same-instant selection.
- Visually distinguish which field is currently active for input.
- Visually indicate when the interval is completely defined.
- Show a group label when provided, and individual field labels when provided.
- Show supporting text alongside the calculated duration when custom guidance is provided.
- Show validation failure messages and alter the visual presentation to reflect an error condition.
- Indicate a busy state and prevent user action while processing.
- Ignore user attempts to change values when interaction is disabled.
- Allow text selection but prevent opening of date-time choosers and prevent value modification when in a read-only state.
- Enforce mandatory field semantics when the interval is marked as required.
- Limit available dates and times to a defined minimum and maximum range.
- Limit end choices to those that respect configured minimum and maximum duration boundaries.
- Advance minute selections in configured increments rather than continuously.
- When the user is not allowed to edit, present the interval as formatted text without any input controls.
- When not editing, display a placeholder dash for missing values, a partial interval when only the start exists, and the full formatted range when both exist.
- Signal when the user enters or leaves the component boundary according to the contract.
- Adjust visual presentation for dark environments using the contract's semantic color system.

# Constraints
- Must adhere strictly to the properties and events defined in the groupEnterDateTimeInterval contract.
- Must not permit an end datetime earlier than or equal to the start datetime unless same-instant selection is explicitly allowed.
- Must visually suppress end options that violate minimum or maximum duration constraints.
- Must not present input fields, helper text, error messages, or communicate changes when in the viewing state.
- Must not respond to user input or communicate state changes while disabled or busy.
- Must not present interactive controls for value selection in read-only state.
- Error indicators and messages must appear only during editing.
- Calculated duration must not appear in the helper area while an error is present.
- Must support dark mode presentation using semantic color pairs for surfaces, borders, typography, hover, and focus.

# Notes
- The molecule supports two ways to establish the end: by direct entry of the end datetime, or by specifying a duration that is added to the start.
- The duration is displayed as auxiliary information unless an error condition overrides it.
- Text presentation in the non-editing state follows contract rules for empty, partial, and complete intervals.`;

