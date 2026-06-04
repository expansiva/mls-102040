/// <mls fileReference="_102040_/l2/molecules/groupenterdatetimeinterval/ml-datetime-interval-timeline.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupEnterDatetimeInterval';
export const skill = `# Metadata
- TagName: groupenterdatetimeinterval--ml-datetime-interval-timeline

# Objective
Allow the user to view and edit a datetime interval through a visual timeline track that renders two draggable markers representing the start and end datetimes, together with two datetime-local inputs arranged in a two-column grid. In view mode the component collapses to a single formatted range string. When editing, the timeline visually fills the segment between the two selected instants.

# Responsibilities
- Render a horizontal timeline track showing a progress segment between the start and end markers proportional to the configured min/max datetime boundaries.
- Display two clickable circular markers on the timeline, one for start and one for end, highlighting the active field.
- Render two datetime-local inputs (start and end) in a responsive two-column grid when in editing mode.
- Apply the minuteStep property as the step attribute of both inputs, converting minutes to seconds.
- Validate each input value against the configured minDatetime and maxDatetime boundaries before accepting it.
- Reject an end datetime that would create an invalid range with the already-confirmed start datetime.
- Enforce minimum and maximum interval duration in minutes when both start and end are present.
- Block equal start and end instants unless allowSameInstant is true.
- Dispatch a startChange event when the start value changes and an endChange event when the end value changes, each carrying the new ISO value.
- Dispatch a change event carrying both startDatetime and endDatetime when both fields hold a valid range.
- Dispatch focus and blur events as fields gain and lose focus.
- Show a loading indicator text when the loading property is true.
- Render an error message below the timeline when the error property is non-empty.
- Render a helper message from the Helper slot when no error is present and the field is in editing mode.
- Render an optional top label from the Label slot.
- Collapse to a plain formatted range string when isEditing is false.
- Format displayed datetimes using Intl.DateTimeFormat with the configured locale and timezone, collapsing same-day ranges to show the shared date once.
- Support English and Portuguese UI strings via the locale property.

# Constraints
- Input interaction must be blocked when disabled, readonly, or loading is true.
- Values that fall outside minDatetime or maxDatetime must be silently rejected without updating the property.
- The change event must only fire when both startDatetime and endDatetime are set and form a valid range.
- The edit inputs are only shown in editing mode; the timeline track and markers are present in both modes.
- Helper text must not be shown when an error is active.
- The component must not contain business logic; it is a pure presentation molecule.`;
