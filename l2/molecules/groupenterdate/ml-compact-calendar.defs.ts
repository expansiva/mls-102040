/// <mls fileReference="_102040_/l2/molecules/groupenterdate/ml-compact-calendar.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupEnterDate';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  dateInput: "inline-calendar",
  labelPlacement: "top"
};

export const skill = `# Metadata
- TagName: groupenterdate--ml-compact-calendar

# Objective
Allow the user to select a single date from an always-visible inline calendar grid. The calendar renders directly inside the page layout without a popover, shows the current month with navigation controls, highlights today and the selected date, optionally displays week numbers, and respects min/max date bounds. It also has a view-only mode that shows the selected value as plain text.

# Responsibilities
- Render a full inline calendar grid for the current view month, showing all days in a 7-column layout.
- Navigate to the previous or next month when the corresponding buttons are clicked.
- Highlight the currently selected day and today's date visually.
- Emit a "change" custom event with the selected ISO date string when the user clicks a selectable day.
- Emit a "monthChange" custom event when the user navigates to a different month.
- Emit "focus" and "blur" custom events when focus enters or leaves the component.
- Provide a clear button in the header that removes the current selection and emits a "change" event with null.
- Display the selected date in a locale-aware human-readable format in the header; show a placeholder when nothing is selected.
- Disable navigation buttons when the target month would go outside the min/max date bounds.
- Disable individual day cells that fall outside the current month or outside the min/max date range.
- Support optional display of ISO week numbers as an additional column when "show-week-numbers" is true.
- Respect a configurable first-day-of-week so the weekday header row and grid alignment start on the correct day.
- Update the view month automatically when the "value", "min-date", or "max-date" properties change via external state binding.
- Render in view-only mode (non-editable static text) when "is-editing" is false.
- Display a label slot above the calendar and a helper/error slot below.
- Show a required indicator next to the label when "required" is true.
- Show an error message and apply error border styling to the container when "error" is non-empty.
- Show a loading message and prevent day selection and navigation when "loading" is true.
- Apply disabled styling and block all interaction when "disabled" is true.
- Apply readonly styling and block day selection and clearing when "readonly" is true.

# Constraints
- Day cells outside the current month must be rendered as disabled and must not be selectable.
- The clear button must not appear when there is no selection or when the component is in disabled, readonly, or loading state.
- Navigation to previous or next month must be blocked when it would move outside the allowed min/max range.
- Selection must always be a single date; the component does not support multi-selection.
- In disabled or readonly state all interaction including month navigation must be blocked.
- The calendar must always be visible; it does not collapse into a dropdown.
- The "change" event must only fire when a valid, selectable date is chosen or when the selection is explicitly cleared.`;
