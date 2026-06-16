/// <mls fileReference="_102040_/l2/molecules/groupviewchart/ml-line-chart.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewChart';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {};

export const skill = `# Metadata
- TagName: groupviewchart--ml-line-chart

# Objective
Display the evolution of numeric data over time using a multi-series line chart. It must visualize connections between ordered data points, allow comparison across series, and handle loading, empty, and dark-mode states.

# Responsibilities
- Accept a title, grouped or ungrouped data points, and an empty state as inputs.
- Position each data point horizontally according to its category label and vertically according to its numeric value.
- Draw lines connecting sequential points within each series to show progression.
- Automatically calculate the vertical scale from the minimum and maximum values present in the data.
- Render subtle horizontal reference lines aligned to the vertical scale.
- On hover over a data point, display contextual information including the category label, exact value, and series name.
- On selection of a data point, expose the point's label, value, and series identity for external handling.
- Differentiate each series by a distinct color.
- When in a loading state, display an animated placeholder and suppress chart rendering.
- When no data points are provided, render the empty state or a default empty message.
- Optionally render a legend mapping each series to its visual representation.
- Optionally render numeric values next to their corresponding data points.
- Expose the underlying data in a text format accessible to assistive technologies.
- Ensure interactive data points are detectable and actionable by assistive technologies.
- Adapt all visual elements for dark presentation mode.

# Constraints
- Category labels must appear on the horizontal axis in the order received.
- The vertical scale must be derived solely from the data values without external configuration.
- Contextual hover information must appear only while the pointer is over the data point and must disappear on exit.
- The loading placeholder must fully replace the chart area and block interaction with chart elements.
- The empty state must render only when no data points exist in any series or root input.
- The legend must accurately reflect only the series or points currently represented.
- Visual elements must maintain sufficient contrast for readability in both light and dark modes.
- Interactive points must present an adequate target area for pointer interaction.

# Notes
- Lines should visually suggest continuous progression between points.
- Legend placement should default below the chart.`;

