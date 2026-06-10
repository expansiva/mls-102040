/// <mls fileReference="_102040_/l2/molecules/groupenterboolean/ml-boolean-segmented.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterBoolean';
export const skill = `# Metadata
- TagName: groupenterboolean--ml-boolean-segmented

# Objective
Enable the user to choose between two mutually exclusive boolean states through a pair of side-by-side options. The molecule must clearly identify the current selection, inform the system of changes, and adapt its interactivity and presentation according to editing, viewing, disabled, and error conditions.

# Responsibilities
- Display a provided label above the control.
- Present two selectable options side by side during editing, representing affirmative and negative boolean states.
- Visually distinguish the option that matches the current value from the unselected option.
- Set the value to affirmative when that option is chosen.
- Set the value to negative when that option is chosen.
- Immediately inform the system when the user changes the selection, reporting the new boolean value.
- Honor an initially configured boolean value.
- Prevent user interaction and suppress system notifications while disabled.
- Show the current value as static text during viewing mode, without interactive elements or system notifications.
- Display helper text beneath the control during editing when available and no error is present.
- Display error text and apply an error presentation when an error is present, replacing helper text.
- Keep the distinguished option synchronized with the current value at all times.
- Signal when the control receives or loses focus during editing.
- Support keyboard selection during editing, allowing the user to toggle the value using the Space key and inform the system of the change.
- Communicate disabled, selected, and invalid states to assistive technologies.
- Associate the control with its visible label for accessibility.

# Constraints
- Only native boolean values (true or false) are valid selections.
- The control must not send notifications to the system while disabled.
- Error text and helper text must not appear in viewing mode.
- Interactive options must not be rendered in viewing mode.
- The visually distinguished option must always reflect the current value.
- Keyboard interaction must only be available during editing and when not disabled.
- The label must appear above the control; helper or error text must appear below the control during editing.
- User interaction must be ignored while the control is disabled.

# Notes
- The affirmative option represents true; the negative option represents false.
- The presentation must remain effective across light and dark environments.
- Error state takes precedence over helper text display.`;

