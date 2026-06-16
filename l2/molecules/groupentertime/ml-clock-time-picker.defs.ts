/// <mls fileReference="_102040_/l2/molecules/groupentertime/ml-clock-time-picker.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupEnterTime';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  timeInput: "clock"
};

export const skill = `# Metadata
- TagName: groupentertime--ml-clock-time-picker

# Objective
Allow the user to pick a time of day through a step-by-step clock panel. The user clicks a read-only text input to open a panel, then selects the hour, then the minute, and optionally the second, each on a separate stage. Confirming the selection stores the time in HH:MM or HH:MM:SS format and closes the panel. The component supports 12-hour and 24-hour modes, a configurable minute step, min/max time bounds, and disabled, readonly, error, loading, and view-only states.

# Responsibilities
- Display a read-only text input showing the currently selected time formatted with Intl.DateTimeFormat, or a configurable placeholder when no time is selected.
- Open a clock selection panel when the input or the clock icon button is clicked, provided the component can interact.
- Guide the user through three sequential stages — hour, then minute, then (optionally) second — automatically advancing to the next stage after each selection.
- Show 12 hour buttons (1–12) in 12-hour mode and 24 hour buttons (0–23) in 24-hour mode.
- Show AM/PM toggle buttons when hour12 is enabled and update the internally stored 24-hour value accordingly.
- Show minute buttons respecting the minuteStep interval; default step is 1.
- Show second buttons (0–59) only when show-seconds is enabled.
- Disable individual hour, minute, and second buttons that fall outside the minTime–maxTime range.
- Allow the user to clear the selection, setting value to null and closing the panel.
- Allow the user to confirm the selection only when all required stages are complete; dispatch a "change" event with the formatted value string.
- Close the panel when a click is detected outside the component.
- Render a view mode (isEditing = false) showing the label and formatted time as plain text.
- Show an inline error message or helper text below the input as appropriate.
- Support i18n for labels (hour, minute, second, AM, PM, clear, confirm, placeholder) in English and Portuguese.
- Dispatch "focus" and "blur" custom events on input focus and blur.
- Synchronize internal selection state when the value property changes externally.

# Constraints
- The panel must not open when disabled, readonly, loading, or isEditing is false.
- Hour, minute, and second options outside the min/max time range must be rendered as disabled and must not be selectable.
- The confirm button must be inactive until all required stages (hour, minute, and second if show-seconds is true) have a selection.
- The panel input is always readonly; the user cannot type a time directly.
- AM/PM conversion must correctly map 12-hour display values to 24-hour storage values (12 AM = 00:xx, 12 PM = 12:xx).
- The value is always stored in 24-hour HH:MM or HH:MM:SS format regardless of the display mode.`;
