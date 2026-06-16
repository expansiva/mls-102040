/// <mls fileReference="_102040_/l2/molecules/groupshowprogress/ml-linear-progress.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupShowProgress';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  progress: "linear"
};

export const skill = `# Metadata
- TagName: groupshowprogress--ml-linear-progress

# Objective
A linear progress indicator for the groupShowProgress group that visually communicates completion status or ongoing activity. It supports determinate mode to show exact percentage completion and indeterminate mode to indicate that an operation is in progress without a known duration. The component is purely visual and does not emit events.

# Responsibilities
- Render a horizontal bar composed of a background track and a fill indicator.
- In determinate mode, expand the fill indicator from left to right in proportion to the completion value.
- In indeterminate mode, display a continuous looping animation on the indicator to show ongoing activity without a defined completion percentage.
- Accept a text label for contextual description.
- Support semantic color variants (default, success, warning, danger) to convey different contextual meanings.
- Support height sizes (xs, sm, md, lg) to accommodate different layout densities while maintaining consistent visual proportions.
- Display the current percentage as formatted text when configured to do so, but only while in determinate mode.
- When percentage text is displayed, maintain stable visual alignment with the bar.
- Communicate appropriate accessibility information based on the current mode and value.
- Remain purely visual without embedding business logic or emitting events.

# Constraints
- When no value is provided, the component must operate in indeterminate mode with a continuous looping animation.
- When a value is provided, it must be constrained to the 0–100 range before visual representation.
- In indeterminate mode, no percentage text may be rendered regardless of the text display setting.
- Height size must be one of xs, sm, md, or lg; if unspecified, md must be used as the default.
- The component must not emit events.
- Text describing specific business scenarios must be handled outside the component; the component only renders its own visual state.
- In determinate mode, assistive technologies must be informed of the current value within a minimum of 0 and a maximum of 100.
- In indeterminate mode, the current value must not be communicated to assistive technologies.
- At 100% completion, the bar must appear completely filled and must not show an ongoing progress animation.
- Transitions between values in determinate mode must be visually smooth.
- All colors must provide corresponding variants for dark mode environments.

# Notes
- The percentage display format must be "NN%".
- The label provided is used for accessibility identification of the progress indicator.
- While the component supports corporate contexts such as import tracking, onboarding completion, report loading, order picking, and budget monitoring, it remains agnostic to those specific workflows.`;

