/// <mls fileReference="_102040_/l2/molecules/groupenterdate/ml-date-picker.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupEnterDate';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  dateInput: "calendar-popover",
  labelPlacement: "top"
};

export const skill = `# Metadata
- TagName: groupenterdate--ml-date-picker

# Objective
Allow the user to choose a single date by clicking a trigger button that opens a calendar dropdown. The selected date is displayed on the trigger in a locale-aware format, and a clear action inside the panel resets the selection. The component supports disabled, readonly, required, loading, and error states, and has a view-only mode that shows the value as static text.

# Responsibilities
- Render a trigger button that shows the currently selected date or a placeholder when nothing is selected.
- Open a calendar dropdown panel when the trigger is clicked and close it when a date is selected, cleared, or the user clicks outside.
- Display a monthly calendar grid inside the panel with previous/next month navigation arrows.
- Emit a "change" custom event with the selected ISO date string when the user picks a day.
- Emit a "monthChange" custom event when the user navigates to a different month.
- Emit "focus" and "blur" custom events when the trigger button gains or loses focus.
- Provide a clear button inside the calendar panel that removes the current selection and closes the panel.
- Disable individual day cells that fall outside the min/max date bounds.
- Disable the previous/next navigation buttons when the target month would go outside the allowed range.
- Optionally display week numbers as an extra column when "show-week-numbers" is true.
- Respect a configurable first-day-of-week for weekday header row alignment.
- Synchronise the calendar view to the current value, or to today if no value is set, each time the panel is opened.
- Update the view month when "min-date" or "max-date" properties change via external state binding.
- Close the calendar panel when "is-editing" is set to false via external state binding.
- Render in view-only mode (static formatted text) when "is-editing" is false.
- Show a label slot above the trigger and a helper/error slot below.
- Show a required indicator next to the label when "required" is true.
- Show an error message and apply error border styling when "error" is non-empty.
- Show a loading indicator below the trigger and prevent opening the calendar when "loading" is true.
- Include a hidden input element with the component name and current value for form submission.

# Constraints
- The calendar panel must not open when the component is in disabled, readonly, or loading state.
- Day cells outside the min/max range must be disabled and must not be selectable.
- Only one date can be selected at a time; multi-selection is not supported.
- The calendar must close automatically after a date is selected or cleared.
- Clicking outside the component must close the calendar panel without changing the selection.
- The clear button must not reset the selection when the component is disabled, readonly, or loading.`;
