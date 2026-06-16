/// <mls fileReference="_102040_/l2/molecules/grouprateitem/ml-csat-rating.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupRateItem';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  rating: "emoji"
};

export const skill = `# Metadata
- TagName: grouprateitem--ml-csat-rating

# Objective
A customer satisfaction score rating tool that presents five selectable satisfaction levels. Each level displays a distinct icon and a configurable descriptive label. The component highlights the active choice and reveals the associated numeric score.

# Responsibilities
- Present five rating options in a horizontal row ordered from 1 to 5
- Allow each option to show a unique icon and configurable descriptive label
- Enable selection of a single numeric value in the 1-to-5 range
- Visually emphasize the selected option
- Show the selected numeric score next to the option group when a value is active
- Show a static dash placeholder when no value is selected and the component is in view mode
- Apply hover highlighting during editing and clear it when the pointer exits
- Present a static, non-interactive view in non-editing mode without hover effects, error indicators, or helper text
- Enter an error state when a value is required but none is selected
- Show error messages and error styling during editing when an error is supplied
- Prevent all interaction and state changes when disabled
- Prevent interaction while keeping the current value visible when readonly
- Notify when the selected value changes
- Notify when the component gains or loses focus
- Support keyboard navigation between options and keyboard confirmation of selection

# Constraints
- Must adhere to the Rate Item group behavior contract for states, properties, and notifications
- Must maintain a fixed scale of five numeric levels from 1 to 5
- Must use explicitly provided option definitions when available, ignoring generic scale settings
- Change notifications must include only the numeric value, not labels or other metadata
- Must suppress interaction and notifications in disabled and readonly states
- Must suppress hover effects and interaction outside of editing mode
- Must suppress error and helper presentation outside of editing mode
- Keyboard control must follow the group behavior contract for directional movement and selection

# Notes
- Each rating level is defined by its own declared content
- Color presentation must respect light and dark mode contracts
- Labels and helper text are visible only during editing and only under their defined conditions`;

