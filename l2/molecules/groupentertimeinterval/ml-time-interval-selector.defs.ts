/// <mls fileReference="_102040_/l2/molecules/groupentertimeinterval/ml-time-interval-selector.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupEnterTimeInterval';
export const skill = `# Metadata
- TagName: groupentertimeinterval--ml-time-interval-selector

# Objective
Allow the user to define a time interval by selecting both a start time and an end time through dropdown pickers with select-based hour, minute, optional second, and optional AM/PM fields. After the start time is confirmed the picker automatically advances to the end time. The component validates interval constraints (min/max duration, overnight spans, same-time rules) and stores both times independently as HH:MM or HH:MM:SS strings.

# Responsibilities
- Render two clickable time buttons side by side — one for the start time and one for the end time — each showing the currently selected time formatted with Intl.DateTimeFormat or a placeholder when unset.
- Open a select-based picker panel below the buttons when a field is clicked, provided the component can interact.
- Populate the picker with a <select> for hour (12 or 24-hour mode), minute (respecting minuteStep), optional second, and optional AM/PM.
- Pre-fill the picker with the field's current time when it has a value, or with the minimum allowed time when it does not.
- Validate the tentative time against minTime, maxTime, minDurationMinutes, maxDurationMinutes, allowOvernight, and allowSameTime before allowing confirmation; disable the confirm button when invalid.
- On start-time confirmation: store the start time, dispatch a "startChange" event, then automatically open the end-time picker if no end time is set, or close and dispatch "change" if the end time is already set.
- On end-time confirmation: store the end time, dispatch "endChange" and "change" events, and close the picker.
- Allow clearing the currently active field's time independently, dispatching the corresponding "startChange" or "endChange" event.
- Display a "(+1)" overnight badge on the end-time button when allowOvernight is true and the end time is earlier than the start time.
- Render a view mode (isEditing = false) showing the label and a formatted "start – end" range string, including the overnight suffix when applicable.
- Show an inline error message or helper text below the buttons as appropriate.
- Support i18n for labels (confirm, clear, placeholders, loading, nextDay) in English and Portuguese.
- Dispatch "focus" and "blur" custom events when a field is opened or closed.

# Constraints
- All interaction must be blocked when disabled, readonly, or loading.
- The end time must be strictly after the start time unless allowOvernight or allowSameTime is explicitly enabled.
- Duration between start and end must satisfy minDurationMinutes and maxDurationMinutes when those are greater than zero.
- Each time must fall within the minTime–maxTime bounds.
- The confirm button must remain disabled while the current selection violates any constraint.
- The component must not implement a visual clock face or scrollable column picker; it uses <select> elements only.
- Start and end times are stored as separate properties (startTime, endTime) and dispatched via separate events; a combined "change" event is also dispatched only when both times are set.`;
