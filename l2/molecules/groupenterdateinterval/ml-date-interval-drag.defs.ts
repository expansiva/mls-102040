/// <mls fileReference="_102040_/l2/molecules/groupenterdateinterval/ml-date-interval-drag.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupEnterDateInterval';
export const skill = `# Metadata
- TagName: groupenterdateinterval--ml-date-interval-drag

# Objective
Allow the user to select a date range by pressing and dragging across an always-visible single-month calendar grid. Pressing down on any selectable day anchors the start date, and releasing the pointer on another day confirms the end date. The component shows a live preview of the range as the user drags and highlights invalid end-date candidates in red. It supports min/max date bounds, configurable minimum and maximum range lengths, optional same-day selection, and disabled, readonly, loading, and error states.

# Responsibilities
- Render a full inline calendar grid for the current month with 42 cells (6 weeks × 7 days).
- Start a drag gesture on pointerdown on a selectable start day, setting that day as the tentative start and clearing any previous end date.
- Update the hover preview as the pointer moves over other day cells during the drag.
- Finish the drag on pointerup (including a window-level fallback) and commit the ordered start and end dates.
- Swap start and end if the user drags backwards so the earlier date always becomes the start.
- Emit "startChange", "endChange", and "change" custom events with the confirmed start and end ISO date strings when a range is committed.
- Emit "focus" and "blur" custom events when focus enters or leaves the component.
- Highlight days in the confirmed range with a range background and mark start and end endpoints with a distinct fill.
- Highlight hovered days during drag with a red background when the candidate end date violates the range constraints.
- Navigate to the previous or next month when the corresponding header buttons are clicked.
- Disable navigation buttons when the target month would go outside the min/max date bounds.
- Enforce minRangeDays and maxRangeDays constraints when validating candidate end dates.
- Reject same-day ranges when "allow-same-day" is false.
- Display a summary of the current start and end dates in the header.
- Display a loading overlay that blocks the calendar when "loading" is true.
- Show an overall label slot, separate start and end label slots, and a helper/error slot.
- Apply error border styling and show an error message when "error" is non-empty.
- Apply disabled styling and block all pointer interaction when "disabled" is true.
- Apply readonly background styling and block pointer interaction when "readonly" is true.

# Constraints
- The calendar is always visible; it does not collapse into a dropdown.
- Day cells outside the min/max global date bounds must not be selectable as either start or end.
- End date candidates that violate minRangeDays, maxRangeDays, or allowSameDay must be rejected and visually flagged as invalid during drag.
- When the drag finishes on an invalid end candidate the end date must remain null and the component must stay in the selecting-end state.
- All pointer interaction must be blocked when disabled, readonly, or loading.
- The "change" event must only fire after a complete valid range has been committed, not during the drag preview.`;
