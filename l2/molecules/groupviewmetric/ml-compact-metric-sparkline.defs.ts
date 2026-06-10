/// <mls fileReference="_102040_/l2/molecules/groupviewmetric/ml-compact-metric-sparkline.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewMetric';
export const skill = `# Metadata
- TagName: groupviewmetric--ml-compact-metric-sparkline

# Objective
Display a compact metric with an inline sparkline trend, supporting loading states and accessible markup.

# Responsibilities
- Render the primary metric value using the required Value slot.
- Render the Trend slot content adjacent to the Value, allowing it to wrap below when horizontal space is insufficient.
- Preserve hover interactions on the Trend content so that point tooltips can appear.
- When the Trend slot provides a direction, apply an accessible label to the Trend container describing that direction.
- During loading, show a skeleton placeholder that mirrors the presence and positions of the Label, Value, Trend, Icon, and Helper slots, and do not render slot content.
- Expose the container as a figure and derive its accessible label from the Label slot content when present.
- Announce updates to the Value region politely.
- Accept sparkline data, point tooltips, and line color exclusively through the Trend slot content.

# Constraints
- Must use only the groupViewMetric slot tags: Label, Value, Icon, Trend, and Helper.
- Must not accept sparkline data arrays through properties.
- Must not emit events.
- Must present the sparkline without axes, gridlines, or labels.
- Must apply semantic positive, negative, or neutral styling to the Trend container based on direction, while permitting the slot content to define its own line color.
- Must support dark-mode counterparts for surface, text, border, and accent colors.
- Must maintain compact visual hierarchy: Value is prominent, Label is smaller and secondary, Helper appears below the Value, and Icon is aligned with the Label/Value block without dominating the Value.

# Notes
- The sparkline is presented as a clean inline graphic.`;

