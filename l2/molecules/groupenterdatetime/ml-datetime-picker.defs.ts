/// <mls fileReference="_102040_/l2/molecules/groupenterdatetime/ml-datetime-picker.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupEnterDatetime';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  dateInput: "calendar-popover",
  labelPlacement: "top"
};

export const skill = `# Metadata
- TagName: groupenterdatetime--ml-datetime-picker

# Objective
Allow the user to select a combined date and time through a trigger button that opens a panel containing a monthly calendar grid on the left and scrollable hour and minute selectors on the right. The selection is confirmed explicitly with a Confirm button. The component supports min/max datetime bounds, configurable minute step intervals, timezone-aware display, and disabled, readonly, required, loading, and error states.

# Responsibilities
- Render a trigger button that displays the currently selected datetime in a locale- and timezone-aware format, or a placeholder when nothing is selected.
- Open a picker panel when the trigger is clicked and close it on outside clicks or after confirmation or clearing.
- Render a monthly calendar grid inside the panel with previous/next month navigation.
- Render scrollable hour (0–23) and minute selectors side by side; generate minute options according to the configured minuteStep.
- When the user selects a day, automatically move the time selection to the first valid hour/minute within the min/max datetime bounds if the current time would become invalid.
- When the user selects an hour, automatically advance the minute selection to the first valid minute for that hour.
- Emit a "change" custom event with the confirmed ISO datetime string (YYYY-MM-DDTHH:MM:00) when the user clicks Confirm.
- Emit a "change" event with null when the user clicks Clear, and close the panel.
- Emit "focus" and "blur" custom events when the trigger button gains or loses focus.
- Disable individual day cells that fall outside the date portion of the min/max datetime bounds.
- Disable individual hour and minute buttons that would produce a datetime outside the min/max bounds.
- Prevent Confirm from executing when no date is selected or when the selected time is invalid.
- Update the display value when "value", "locale", or "timezone" properties change via external state binding.
- Render in view-only mode (static formatted text) when "is-editing" is false.
- Show a label slot above the trigger and a helper/error slot below.
- Show a required indicator next to the label when "required" is true.
- Show an error message and apply error border styling when "error" is non-empty.
- Show a loading spinner on the trigger and prevent opening the panel when "loading" is true.
- Include a hidden input element for form submission when "name" is provided.

# Constraints
- The panel must not open when the component is disabled, readonly, or loading.
- The Confirm button must be inert until a valid date and a valid time within min/max bounds are both selected.
- Minute options must be strictly limited to multiples of minuteStep; intermediate values must not appear.
- Hour and minute options that violate the min/max datetime constraint for the currently selected date must be disabled and unselectable.
- The panel must close on any outside click without altering the committed value.
- The "change" event must only fire on explicit Confirm or Clear actions, never during intermediate calendar or time navigation.`;
