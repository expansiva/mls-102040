/// <mls fileReference="_102040_/l2/molecules/groupenterboolean/ml-toggle-switch.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterBoolean';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  boolean: "toggle",
  labelPlacement: "top",
  validation: "inline-below"
};

export const skill = `# Metadata
- TagName: groupenterboolean--ml-toggle-switch

# Objective
A boolean input molecule that enables users to switch between two mutually exclusive states. It provides an interactive toggle during editing mode and displays the current selection as static text during read-only mode. It reports value changes, focus, and blur to the surrounding system, and presents labels, contextual guidance, and validation errors according to its current state.

# Responsibilities
- Present an interactive binary toggle when in editing mode
- Display static text representing the current value when not in editing mode, showing "Yes" for true and "No" for false
- Accept and display label content through the contract-defined label region
- Accept and display helper content through the contract-defined helper region when no validation error is present and in editing mode
- Display validation error messages when provided and in editing mode
- Change the boolean value upon user activation when in editing mode
- Report value changes to the system, including the new boolean state
- Report when the control receives focus
- Report when the control loses focus
- Prevent user activation and suppress value change reports when disabled
- Prevent all interaction and suppress reports when not in editing mode
- Initialize with a default value of false when no prior value exists
- Support keyboard activation to change the value when enabled and in editing mode
- Communicate the current boolean state to accessibility tools
- Communicate the disabled condition to accessibility tools when applicable
- Communicate the invalid condition to accessibility tools when a validation error is present
- Maintain programmatic associations between the control and its label, helper text, and error messages

# Constraints
- Must exclusively use the Label and Helper content regions defined in the contract
- Must treat the value strictly as a boolean type without intermediate states
- Must not permit value changes while disabled
- Must not report value changes while disabled
- Must not permit interaction or report focus, blur, or value changes when not in editing mode
- Must suppress helper text display when a validation error message is present
- Must not display helper text or error messages when not in editing mode
- Must ensure value change reports are detectable outside the component
- Must display "Yes" only when the value is true in read-only mode
- Must display "No" only when the value is false in read-only mode

# Notes
- The control maintains a strict binary state; null or indeterminate values are not supported
- Keyboard activation should follow conventional toggle interaction patterns`;

