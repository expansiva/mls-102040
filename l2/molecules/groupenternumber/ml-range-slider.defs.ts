/// <mls fileReference="_102040_/l2/molecules/groupenternumber/ml-range-slider.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterNumber';
export const skill = `# Metadata
- TagName: groupenternumber--ml-range-slider

# Objective
Allows users to select a numeric interval by adjusting two controls that define the lowest and highest acceptable values. It presents the formatted bounds above their respective controls and alternates between an interactive state for editing and a plain text state for viewing, following the groupEnterNumber contract. It notifies the system of range changes as they happen and when they settle, suitable for filtering data such as age brackets or price bands.

# Responsibilities
- Present two adjustable controls for setting the lower and upper limits of a numeric interval during editing
- Display formatted values for both limits above their respective controls
- Respect absolute floor, ceiling, and increment settings that apply to both limits
- Keep the lower limit from surpassing the upper limit and the upper limit from dropping below the lower limit
- Notify the system with the current interval values continuously while either control is being adjusted
- Notify the system with the final interval values once adjustment ends or focus moves away
- Restrict interval values to stay within the absolute floor and ceiling
- Present values rounded or truncated to the configured precision
- Apply locale and unit formatting to displayed values; fall back to the browser's default when no locale is specified
- Show placeholder text when no interval has been chosen
- In viewing mode, display only the formatted interval or an absence marker, with no interactive controls, guidance text, or validation messages
- Show validation messages and distinct error styling exclusively during editing when the value is invalid
- Block all adjustment and suppress change notifications when disabled
- Allow focus and selection but block value changes when readonly
- Show a busy state indicator and block interaction while loading
- Associate the controls with their visible label, any visible validation message, and states for required and invalid through accessibility properties

# Constraints
- Must use only the Label, Helper, Prefix, and Suffix slots from the groupEnterNumber contract
- The lower limit must not exceed the upper limit at any time
- Both controls must stay within the configured minimum, maximum, and step boundaries
- Validation messages must not appear in viewing mode
- Viewing mode must not present guidance text, interactive controls, or editing affordances
- Placeholder must only appear when the interval is unset
- Disabled and loading states must prevent all control adjustment and system notifications
- Readonly state must lock the controls in place while preserving focus capability
- Accessibility properties must reference the Label slot when available
- Accessibility properties must reference validation messages when they are shown
- Required and invalid conditions must be exposed through accessibility properties

# Notes
- The molecule follows the groupEnterNumber contract for editing, viewing, validation, and state management
- Continuous notifications during adjustment enable live filtering without requiring the user to finish interacting`;

