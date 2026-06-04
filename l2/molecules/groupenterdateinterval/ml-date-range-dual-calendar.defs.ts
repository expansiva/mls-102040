/// <mls fileReference="_102040_/l2/molecules/groupenterdateinterval/ml-date-range-dual-calendar.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupEnterDateInterval';
export const skill = `# Metadata
- TagName: groupenterdateinterval--ml-date-range-dual-calendar

# Objective
Allow the user to select a date range through two separate trigger buttons — one for the start date and one for the end date — that open a panel showing two side-by-side monthly calendars. Clicking the start trigger opens the calendars in start-selection mode; clicking the end trigger enters end-selection mode directly when a start date is already set. A hover preview highlights the tentative range as the user moves over day cells. The component enforces min/max date bounds, optional minimum and maximum range lengths, same-day restrictions, and supports disabled, readonly, required, loading, and error states.

# Responsibilities
- Render two trigger buttons (start date and end date) that display the current selection or a placeholder.
- Open a dual-calendar panel when either trigger is clicked, positioning the left calendar at the start date's month (or today if unset).
- Enter end-selection mode automatically when the end-date trigger is clicked and a start date is already set.
- Render two adjacent month calendars; the right calendar always shows the month after the left.
- Navigate both calendars together by one month when the previous or next arrow is clicked.
- Highlight the selected range across both calendar grids with distinct border styling on start and end endpoints.
- Show a live range preview as the mouse hovers over valid day cells while in end-selection mode.
- Confirm the range when the user clicks a day in end-selection mode, swapping dates if needed so start <= end.
- Close the calendar panel automatically after a valid range is confirmed.
- Close the calendar panel when the user clicks outside the component.
- Emit "startChange", "endChange", and "change" custom events when the range changes.
- Emit "focus" and "blur" custom events when focus enters or leaves the component.
- Provide a clear button inside the panel that resets both dates and emits the corresponding change events.
- Display optional hint text for min/max range day constraints inside the panel footer.
- Disable individual day cells that fall outside the global min/max date bounds or violate range constraints in end-selection mode.
- Disable the previous/next navigation buttons when the target month would fall outside the allowed bounds.
- Enforce minRangeDays, maxRangeDays, and allowSameDay when validating the candidate end date.
- Render in view-only mode (static formatted text showing start – end) when "is-editing" is false.
- Show overall, start, and end label slots as well as a helper/error slot.
- Show a required indicator when "required" is true.
- Show an error message and apply error border styling when "error" is non-empty.
- Show a loading indicator and disable the triggers when "loading" is true.
- Include hidden form inputs for the start and end dates when "name" is provided.

# Constraints
- The calendar panel must not open when the component is disabled, readonly, or loading.
- Day cells outside the global min/max bounds must be disabled and not selectable.
- End-date selections that violate minRangeDays, maxRangeDays, or allowSameDay constraints must be silently rejected without closing the panel.
- The right calendar must always display exactly one month ahead of the left calendar.
- The "change" event must only fire after a complete valid range is committed.
- Clicking outside the component must close the panel without modifying the current selection.
- The clear action must be blocked when the component is disabled, readonly, or loading.`;
