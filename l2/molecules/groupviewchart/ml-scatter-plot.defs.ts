/// <mls fileReference="_102040_/l2/molecules/groupviewchart/ml-scatter-plot.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewChart';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {};

export const skill = `# Metadata
- TagName: groupviewchart--ml-scatter-plot

# Objective
Display a scatter plot that visualizes data points across X and Y axes, supporting multiple series, interactive tooltips, an optional trend line supplied as a dedicated series, a configurable legend, and accessible data alternatives.

# Responsibilities
- Accept data exclusively through designated slots: Series containers holding Points, or standalone Points at the root level for single-series data.
- Map each Point's label attribute to the X-axis and its value attribute to the Y-axis.
- Plot points as circular markers positioned by their X and Y values.
- Display a tooltip on point hover showing the X value, Y value, and series name when applicable.
- Emit a pointClick event upon point activation, including the X value, Y value, and associated series.
- Show a legend with series names and colors when enabled; hide it entirely when disabled.
- Present a loading placeholder while the loading state is active.
- Render the Empty slot content when no Points are provided in any Series or at the root level.
- Render a consumer-supplied dedicated series as a continuous line connecting its points to represent a trend.
- Provide an accessible alternative containing a hidden data table with all points and series.
- Expose the chart container with an image role and an accessible label derived from the Label slot when present.
- Display a title above the plotting area when the Label slot is populated.
- Render visible X and Y axes with markings based on the data's minimum and maximum values.
- Apply the series color to its points; fallback to the individual Point color when no series color is defined.
- Maintain uniform point size across all points.
- Position the legend below the chart, aligned to the left.
- Ensure tooltips appear near the hovered point with legible text and sufficient contrast in both light and dark modes.
- Support dark mode using semantic color pairs for backgrounds, text, borders, and interactive states.
- Center the Empty slot content within the chart area.

# Constraints
- Must not calculate trend lines or perform regression internally; trend data must be provided as a separate series through slots.
- Must not render the chart or axes while the loading state is active.
- Must not display the legend when it is configured as hidden.
- Must render the Empty state only when zero Points exist across all inputs.
- Must derive axis ranges solely from the provided Point attributes.
- Must not vary point size by series or data values.
- The accessible data table must remain visually hidden while available to assistive technologies.
- The container's accessible label must reflect the Label slot content and must not introduce unrelated descriptions.

# Notes
- The consumer is responsible for pre-calculating any trend-line coordinates before providing them as a dedicated series.
- Tooltip content is limited to the point's label, value, and series name.
- Color inheritance follows the order: Series color takes precedence over individual Point color.`;

