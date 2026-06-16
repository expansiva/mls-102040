/// <mls fileReference="_102040_/l2/molecules/groupshowprogress/ml-circular-progress.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupShowProgress';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  progress: "circular"
};

export const skill = `# Metadata
- TagName: groupshowprogress--ml-circular-progress

# Objective
Provide a circular progress indicator that displays completion percentage or ongoing activity status. It communicates progress through a circular ring that fills proportionally to a numeric value or signals indeterminate activity when no value is available.

# Responsibilities
- Display a circular ring composed of a background track and a progress arc
- Show the current percentage as centered text when enabled and a valid value is present
- Operate in determinate mode when a numeric value between 0 and 100 is provided
- Operate in indeterminate mode when no value is provided, indicating ongoing activity
- Adjust visual proportions according to the requested size
- Communicate progress state to accessibility tools, including current value and valid range in determinate mode
- Present a completed, static state when progress reaches 100 percent
- Remain purely visual and non-interactive

# Constraints
- Only use the configured properties: value, size, label, and showValue
- Limit any numeric value to the range of 0 through 100
- When value is absent, activate indeterminate mode and suppress percentage display regardless of showValue
- When showValue is enabled and value is a valid number, display the percentage formatted as a whole number followed by a percent symbol
- Identify itself as a progress indicator to accessibility systems using the provided label
- In determinate mode, expose the current value and the bounds of 0 to 100 to accessibility tools
- In indeterminate mode, do not expose a specific current value to accessibility tools
- Apply default medium size behavior when an unrecognized size is provided
- Generate center content automatically from internal state; do not accept external content
- Halt indeterminate activity indication when the value reaches 100 percent
- Support dark environments by using subdued tones for the background track and prominent accent tones for the progress arc

# Notes
- Intended for corporate dashboards such as HR performance tracking, project task completion, sales quota attainment, credit limit utilization, and logistics on-time delivery metrics
- Visual appearance should align with clean, professional circular indicators suitable for data visualization contexts`;

