/// <mls fileReference="_102040_/l2/molecules/groupenterdate/ml-date-shortcut-picker.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterDate';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  dateInput: "shortcuts",
  labelPlacement: "top",
  validation: "inline-below",
  requiredMark: "asterisk"
};

export const skill = `# Metadata
- TagName: groupenterdate--ml-date-shortcut-picker

# Objective
Provide a date selection interface that offers configurable shortcut options for common dates alongside a manual date entry field. It allows users to quickly select predefined dates or enter a date manually, maintaining compliance with the groupEnterDate contract.

# Responsibilities
- Display configurable shortcut options labeled "Hoje", "Ontem", "Esta semana", "Este mês", and "Últimos 30 dias" above the manual entry field, arranged horizontally and wrapping when space is insufficient
- Present each shortcut as a pill-shaped element with consistent internal spacing and visual feedback for hover, focus, and selection states
- Highlight the shortcut that corresponds to the current value using accent colors, including dark mode variants
- When "Hoje" is selected, set the value to the current date in ISO format and emit the change event
- When "Ontem" is selected, set the value to the previous day's date in ISO format and emit the change event
- When "Esta semana" is selected, set the value to the first day of the current week based on the configured firstDayOfWeek, in ISO format, and emit the change event
- When "Este mês" is selected, set the value to the first day of the current month in ISO format and emit the change event
- When "Últimos 30 dias" is selected, set the value to the date from 30 days before today in ISO format and emit the change event
- Update the manual entry field to reflect the value when a shortcut is selected
- Provide a manual date entry field with standard surface, border, and text styling, supporting dark mode and showing placeholder text when empty
- Allow users to type a valid date or clear the manual entry field
- When a valid date is entered manually, update the value in ISO format and emit the change event
- When the manual entry is cleared, set the value to null and emit the change event with null
- Disable any shortcut whose calculated date falls outside the minDate and maxDate boundaries, showing it with reduced opacity and no hover states
- Prevent disabled shortcuts from changing the value if activated
- When disabled, prevent all shortcuts and the manual field from being interactive
- When readonly, prevent shortcuts from changing the value and prevent the manual field from being edited
- During loading, display a loading indicator with contrast appropriate for light and dark modes, replacing the interactive area and blocking all interactions
- In display mode, show only the formatted date text according to locale, or a long dash when no value exists; hide shortcuts, manual entry, error messages, and helper text
- When the error property is a non-empty string, display the error message below the field, apply error border styling to the manual entry with colors supporting dark mode, and apply the error visual state
- When no error is present and helper text is provided, display the helper text below the field in a secondary style
- Emit a blur event when the manual entry field loses focus
- Emit a focus event when the manual entry field receives focus
- Apply accessibility attributes: associate the label via aria-labelledby, associate error text via aria-describedby, set aria-invalid when an error exists, and set aria-required when required

# Constraints
- Must use only the properties, events, and slot tags defined in the groupEnterDate contract
- All date values emitted must follow the ISO "YYYY-MM-DD" format
- Shortcuts must not update the value if their resulting date is outside the minDate/maxDate range
- Error display takes precedence over helper text display
- The manual entry field must support a null state when cleared
- In display mode, no interactive elements or supporting text may be visible

# Notes
- The available shortcut set is configurable
- Date display formatting follows the current locale settings
- The firstDayOfWeek configuration affects only the "Esta semana" shortcut calculation`;

