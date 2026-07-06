/// <mls fileReference="_102040_/l2/molecules/groupenterdate/ml-inline-calendar.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterDate';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  dateInput: "inline-calendar",
  labelPlacement: "top",
  validation: "inline-below"
};

export const skill = `# Metadata
- TagName: groupenterdate--ml-inline-calendar

# Objective
An inline calendar molecule for selecting a single date, always visible during editing, with monthly navigation. It follows the groupEnterDate contract for data entry and display states.

# Responsibilities
- Display a single-month calendar inline during editing mode, without popovers or overlays.
- Provide month navigation controls to move between previous and next months.
- Update the visible month and year upon navigation, and report the new view to the system.
- Allow selection of exactly one date at a time; a new selection replaces the previous one.
- Report the selected date in ISO format (YYYY-MM-DD) and notify the system of value changes.
- Visually distinguish the current day from other days, and combine this distinction with the selection highlight when today is chosen.
- Present week numbers as a column when enabled.
- Arrange days starting from the configured first day of the week.
- Show only the formatted date text when not in editing mode, with no calendar grid, navigation, error message, or helper text.
- Present a loading state that prevents access to the calendar.
- Display an error message and indicate an invalid state when error content is provided.
- Show helper text below the calendar when no error is present.
- Show a label above the calendar when provided.
- Adapt to dark mode using the semantic color definitions from the group contract.

# Constraints
- Must expose only the properties, events, and slots defined in the groupEnterDate contract.
- Days before the minimum date or after the maximum date must be disabled and unselectable.
- Navigation must be prevented for months entirely outside the minimum and maximum date range.
- When no date is selected, no day may appear selected.
- In the disabled state, the calendar must not respond to navigation or selection.
- In the read-only state, the calendar must remain visible but must not allow date selection; the displayed text must remain selectable.
- Hover feedback must appear only on enabled, unselected days.
- Focus indicators must be visible on navigation controls and day cells per the contract.
- Disabled days must appear with reduced opacity and must not provide hover feedback.
- The error state must apply visual error styling to the calendar and display the error message beneath it.
- The selected day must have a visual highlight clearly distinct from unselected days.
- The calendar must follow the group accessibility contract, including modal dialog behavior for the panel, structured day presentation, communication of selected and disabled states, and polite announcements for month title changes.
- The label must be programmatically associated with the field.
- Error content must communicate the invalid state and link the error description.
- The required state must be communicated programmatically.
- Disabling dates via arbitrary arrays is not supported; only minimum and maximum date boundaries control availability.

# Notes
- The molecule is rendered directly in the page flow and does not use a popover.
- Date availability is controlled exclusively by the minimum and maximum date boundaries.`;

