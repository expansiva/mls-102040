/// <mls fileReference="_102040_/l2/molecules/groupentertime/ml-time-scroll-picker.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupEnterTime';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  timeInput: "scroll-picker",
  labelPlacement: "top",
  validation: "inline-below",
  requiredMark: "asterisk"
};

export const skill = `# Metadata
- TagName: groupentertime--ml-time-scroll-picker

# Objective
Allow the user to pick a time of day by scrolling through independent columns — one for hours, one for minutes, optionally one for seconds, and optionally one for AM/PM — displayed in a dropdown panel that opens below a read-only text input. Confirming the selection stores the time in HH:MM or HH:MM:SS format. The component supports 12-hour and 24-hour modes, a configurable minute step, min/max time bounds, keyboard Escape to dismiss, and disabled, readonly, error, loading, and view-only states.

# Responsibilities
- Display a read-only text input showing the currently selected time formatted with Intl.DateTimeFormat, or a configurable placeholder when no time is selected.
- Open a picker panel containing scrollable columns when the input or clock-icon button is clicked, provided the component can interact.
- Render an hour column (1–12 in 12-hour mode, 0–23 in 24-hour mode), a minute column (respecting the minuteStep interval), an optional seconds column (0–59), and an optional AM/PM column when hour12 is enabled.
- Disable individual column items that would produce a time outside the minTime–maxTime range when combined with the currently selected values.
- Allow the user to independently scroll and select any value in each column without a forced step-by-step progression.
- Provide a Confirm button that commits the selection, dispatches a "change" event with the formatted value, and closes the panel; the button is disabled when the selected combination is outside the allowed range.
- Provide a Clear button that sets value to null, dispatches a "change" event with null, and closes the panel.
- Close the panel when a click is detected outside the component or when the Escape key is pressed.
- Render a view mode (isEditing = false) showing the label and formatted time as plain text.
- Show a loading indicator text when the loading state is active.
- Show an inline error message or helper text below the input as appropriate.
- Support i18n for labels (confirm, clear, placeholder, loading) in English and Portuguese.
- Dispatch "focus" and "blur" custom events on input focus and blur.
- Synchronize internal column selection state when the value, hour12, or show-seconds properties change externally.

# Constraints
- The panel must not open when disabled, readonly, loading, or isEditing is false.
- The Confirm button must be disabled when the currently selected time combination falls outside the minTime–maxTime range.
- The panel input is always readonly; the user cannot type a time directly.
- AM/PM conversion must correctly map 12-hour display values to 24-hour storage values.
- Individual column items outside the allowed time range must be rendered as disabled and must reject click events.
- The panel must close on outside click and on Escape key, without committing unsaved changes.
- The value is always stored in 24-hour HH:MM or HH:MM:SS format regardless of the display mode.`;
