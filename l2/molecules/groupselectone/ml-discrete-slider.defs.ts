/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-discrete-slider.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectOne';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  selectOne: "slider",
  labelPlacement: "top",
  validation: "inline-below",
  requiredMark: "asterisk"
};

export const skill = `# Metadata
- TagName: groupselectone--ml-discrete-slider

# Objective
A discrete slider that allows selection of exactly one option from a set of mutually exclusive ordinal choices arranged along a horizontal linear scale. It behaves according to the groupSelectOne selection pattern, snapping the selection indicator to fixed stopping points that represent valid options.

# Responsibilities
- Present options in a linear horizontal order that reflects their natural ordinal relationship
- Allow the user to select exactly one option at a time by interacting with the scale
- Display a short text label for each available option, positioned to remain readable
- Display the currently selected option label in an indicator above the selection position
- Show placeholder or trigger content when no option is selected
- Support category labels that span across their associated options without interrupting the linear scale
- Snap the selection indicator to the chosen option's position upon selection
- Maintain visibility of all option labels and stopping points regardless of active or inactive state
- Toggle an active state when the user interacts with the control area
- Close the active state when the user clicks outside, presses Escape, or selects an option
- Navigate between enabled options using directional inputs
- Confirm selection of the focused option using a confirm action
- Ignore focus and blur state changes when in view mode
- Display static text showing the selected label in view mode, or a placeholder when nothing is selected
- Indicate when the selection is invalid due to a missing required value
- Display an error message when one is provided
- Display helper text when no error is present
- Indicate when the component is loading, prevent selection changes during this state, and show a loading state in the indicator
- Ignore search functionality

# Constraints
- Must only be used for ordinal data with a natural order of magnitude, intensity, time, or hierarchy
- Must not be used for nominal data without logical order
- Must accept no fewer than 2 and no more than 7 options; excess options are ignored, and fewer than 2 results in a non-interactive state
- Must not change the stored value when the user closes the control without selecting
- Must not allow selection when disabled, readonly, loading, or when an individual option is disabled
- Must not display interactive controls in view mode
- Must not display error text unless an error message is explicitly provided; helper text appears otherwise
- Must suppress interaction cues when disabled or loading
- Must allow text selection in readonly mode while preventing value changes

# Notes
- The linear order of options determines the ordinal scale; grouping labels serve only as visual cues and do not affect selection logic
- The displayed selected label is derived directly from the selected option content and is not independently stored`;

