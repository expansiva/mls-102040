/// <mls fileReference="_102040_/l2/molecules/groupenterdatetimeinterval/ml-enter-datetime-interval.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupEnterDatetimeInterval';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  intervalInput: "fields",
  labelPlacement: "top",
  validation: "inline-below"
};

export const skill = `# Metadata
- TagName: groupenterdatetimeinterval--ml-enter-datetime-interval

# Objective
Allow the user to select a datetime interval by clicking separate start and end trigger buttons that each expand an inline picker panel. The component shows a live formatted preview of the selected range above the trigger buttons and supports individual confirmation and clearing of each field. In view mode the range is displayed as plain text without any interactive controls.

# Responsibilities
- Render one trigger button per field (start and end) that toggles an inline picker panel open or closed when clicked.
- Display the formatted datetime of the selected value on each trigger button, or a placeholder text when no value is set.
- Open the picker panel for a field when its trigger button is clicked, and close the panel if the same button is clicked again.
- Render a datetime-local input inside each picker panel, initialized to a draft value that the user can freely edit before confirming.
- Apply configurable min, max, and step constraints to the picker input so the browser native controls respect the interval rules.
- Require the user to click a Confirm button to commit the draft; reject the confirmation if the draft fails validation.
- Validate the start draft against minDatetime and maxDatetime.
- Validate the end draft against a computed minimum (derived from startDatetime, minDurationMinutes, minuteStep, and allowSameInstant) and a computed maximum (derived from startDatetime, maxDurationMinutes, and maxDatetime).
- After confirming the start field, automatically open the end picker if no end value is set yet.
- Provide a Clear button inside each picker panel to remove the current value and close the panel.
- Show a formatted range preview (start – end) above the trigger buttons at all times when values are present.
- Collapse to a plain formatted range string when isEditing is false.
- Dispatch startChange when the committed start value changes, endChange when the committed end value changes, and change when the end is committed alongside a confirmed start.
- Dispatch focus when any picker panel first opens and blur when the last open panel closes.
- Show a loading indicator text when the loading property is true.
- Render an error message when error is non-empty, or a helper message from the Helper slot when no error is present.
- Render an optional label from the Label slot, with LabelStart and LabelEnd slot overrides for each field's label.
- Synchronize draft values with external property changes via handleIcaStateChange.
- Support English and Portuguese UI strings via the locale property.

# Constraints
- Opening the picker panel must be blocked when disabled, readonly, or loading is true.
- Confirmation of a draft must be rejected unless the draft passes all validation constraints.
- The change event must only fire when a confirmed end value is set together with a confirmed start value.
- Helper text must not be shown when an error is active.
- The component must not contain business logic; it is a pure presentation molecule.`;
