/// <mls fileReference="_102040_/l2/molecules/groupentertimeinterval/ml-time-interval-slider.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupEnterTimeInterval';
export const skill = `# Metadata
- TagName: groupentertimeinterval--ml-time-interval-slider

# Objective
Allow the user to define a time interval by dragging two overlapping range sliders — one for the start time and one for the end time — over a shared track. The selected segment is highlighted on the track. Both times are displayed as formatted labels above the sliders and validated against min/max time bounds, duration constraints, overnight rules, and same-time rules before being committed.

# Responsibilities
- Render two stacked <input type="range"> elements sharing the same track, one controlling the start time and one controlling the end time.
- Convert the raw slider value (seconds since midnight) to a formatted time string using Intl.DateTimeFormat for display.
- Show a highlighted segment on the track between the start and end positions; in overnight mode, render two segments (start-to-midnight and midnight-to-end).
- Display formatted start and end times in labeled boxes above the slider track, updating in real time as the thumb is dragged (draft mode).
- Commit the start or end time only when the slider's change event fires and the new value passes all validation rules; revert the draft on invalid change.
- Validate each committed value against minTime, maxTime, allowOvernight, allowSameTime, minDurationMinutes, and maxDurationMinutes.
- Dispatch a "startChange" event when the start time is committed; dispatch an "endChange" event when the end time is committed; dispatch a combined "change" event when both times are set.
- Display a "(+1)" overnight label on the end-time box when allowOvernight is true and the end time is before the start time.
- Respect the minuteStep property as the slider step (converted to seconds); use 1-second steps when show-seconds is enabled.
- Clamp slider min/max to the minTime–maxTime bounds (defaulting to 00:00–23:59:59).
- Render a view mode (isEditing = false) showing the label and a formatted "start – end" range string, including the overnight suffix when applicable.
- Show an inline error message or helper text below the track as appropriate.
- Support i18n for fallback labels (Start, End, loading, nextDay) in English and Portuguese.
- Dispatch "focus" and "blur" custom events when a slider thumb gains or loses focus.

# Constraints
- All slider interaction must be blocked when disabled, loading, or isEditing is false; readonly permits visual display but blocks dragging.
- An invalid slider change (violating any duration, overnight, same-time, or bounds constraint) must be silently rejected and the draft cleared; the committed value must not change.
- The slider step must be at least 1 second and must respect minuteStep when show-seconds is false.
- The component must not render a clock face, dropdown panel, or select-based picker; time entry is through range sliders only.
- The overnight highlight must only appear when allowOvernight is explicitly true.
- Start and end times are stored as separate properties (startTime, endTime) and the combined "change" event fires only when both are non-null.`;
