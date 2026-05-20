/// <mls fileReference="_102040_/l2/molecules/grouprateitem/ml-rating-slider.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupRateItem';
export const skill = `# Metadata
- TagName: grouprateitem--ml-rating-slider

# Objective
Provide a precision rating control that lets users express intensity, confidence, or preference along a continuous or discrete scale. It offers finer granularity than star ratings or NPS, supporting both auto-generated numeric ranges and custom-defined options for self-assessment or research contexts.

# Responsibilities
- Accept and emit the selected value as a number, or null when no selection exists
- Render custom options when provided, using each option's declared numeric value as the selectable value
- Generate a linear numeric scale from a minimum to a maximum using a defined step when custom options are not provided
- Allow interaction for selection while in editing mode, including hover preview and click to confirm selection
- Display the selected value statically in view mode, showing a dash indicator when no value is selected
- Prevent value changes and interaction when disabled or readonly, while preserving the visible selection in readonly mode
- Emit focus events when an option receives focus and blur events when focus leaves
- Enter an error state when required and no value is selected
- Display external error messages when provided; otherwise display helper content when available
- Support keyboard navigation between adjacent options and keyboard confirmation of the current option
- Communicate selection state, required status, and error conditions to assistive technologies
- Present options in a linear horizontal arrangement that visually suggests a slider scale

# Constraints
- Must belong to the groupRateItem group and support Label, Helper, and Item content areas
- Custom items must take precedence over min/max/step configuration
- Must not show helper text or error indicators in view mode
- Must not permit interaction or value changes while disabled or readonly
- Must indicate invalid state only when required is true and value is null
- Hover preview must not alter the committed selected value
- Must maintain distinct visual treatments for normal, hovered, selected, disabled, readonly, and error states
- Must respect dark mode visual semantics

# Notes
- Intended for self-assessment of skill level, confidence ratings, or preference surveys
- Hover preview provides temporary visual feedback without committing a value until confirmed`;

