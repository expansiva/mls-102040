/// <mls fileReference="_102040_/l2/molecules/groupenterdateinterval/ml-date-interval-presets.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterDateInterval';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  intervalInput: "presets",
  labelPlacement: "top",
  validation: "inline-below",
  requiredMark: "asterisk"
};

export const skill = `# Metadata
- TagName: groupenterdateinterval--ml-date-interval-presets

# Objective
Enable users to select a date range through predefined period shortcuts or custom start and end dates, conforming to the groupEnterDateInterval contract. The component presents the range differently depending on whether the user is editing or viewing the value.

# Responsibilities
- Render in editing mode when isEditing is true, displaying interactive date range controls; render in viewing mode when isEditing is false, showing only the formatted date range text without inputs, calendar, helper text, or error messages.
- Display predefined date range options above the custom date inputs when option content is provided; omit the options entirely when no such content is supplied.
- Highlight the predefined option whose start and end dates match the currently selected values.
- Apply the start and end dates defined by a predefined option when that option is activated, then emit the standard start change, end change, and change notifications defined by the group contract.
- Maintain the standard change event detail structure containing start and end dates regardless of whether the change originated from a predefined option or manual input.
- Finalize any active date selection and close the calendar panel when a predefined option is chosen.
- Provide separate entry fields for start and end dates during editing, enforcing minimum date, maximum date, minimum range days, maximum range days, same-day allowance, and first day of the week as specified by the contract.
- Automatically correct the range if the chosen end date precedes the start date.
- Reject same-day ranges when same-day selection is not permitted.
- Disable dates that fall outside the allowed minimum or maximum bounds or exceed the permitted range duration.
- Display the general field label when label content is provided; display start and end field labels when their respective content is provided.
- Show helper text below the inputs when no validation error exists; display the error message in place of the helper text when an error is present.
- Present a loading state that blocks interaction when loading is true.
- Block all interaction with options, date fields, and calendar panels when disabled.
- Allow text selection of displayed values while preventing value changes when read-only.
- Emit focus and blur notifications according to the group contract when the field gains or loses focus.
- Format the displayed date range in view mode according to the current locale, applying the contract's rules for handling null or incomplete ranges.

# Constraints
- Must operate exclusively within the properties, events, and content regions defined by the groupEnterDateInterval contract.
- The change event detail must remain consistent with the group contract structure containing start and end dates, even when triggered by predefined option selection.
- Predefined option selection must not introduce alternative event payloads or naming.
- Active option state must be determined strictly by comparing the current start and end dates against each option's defined values.
- The option list must not render if no option content is configured.
- Date validation rules must be applied to both manual input and preset selection.
- Error feedback must replace helper text entirely rather than appearing simultaneously.
- Loading, disabled, and read-only states must override normal interactive behavior.

# Notes
- View mode should gracefully handle null or partial ranges using the contract's defined display conventions.
- Predefined options serve as shortcuts that immediately commit a valid range without requiring additional confirmation.`;

