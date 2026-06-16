/// <mls fileReference="_102040_/l2/molecules/groupviewchart/ml-bar-chart.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupViewChart';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {};

export const skill = `# Metadata
- TagName: groupviewchart--ml-bar-chart

# Objective
Display a vertical bar chart that visualizes one or more data series across named categories. The component accepts data through declarative slot elements (Series and Point), renders proportionally sized bars, and lets the user explore individual values through hover tooltips and keyboard-accessible bar buttons.

# Responsibilities
- Parse standalone Point slot elements and Series slot elements (each containing nested Points) to build the chart data model.
- Calculate bar heights proportionally relative to the maximum value across all data points.
- Render a tooltip showing the label, series name, and formatted value when the user hovers over a bar.
- Dispatch a pointClick CustomEvent (bubbles, composed) with label, value, and series when a bar is clicked or activated with Enter or Space.
- Show an optional label above the chart when a Label slot is provided.
- Render a color-coded legend below the chart when showLegend is true and data is present.
- Optionally display the numeric value above each bar when showValues is true.
- Render an animated loading skeleton when loading is true.
- Render an empty state message when no data is available; use the Empty slot content when provided, otherwise fall back to the localized default message.
- Include a visually hidden accessible data table (sr-only) so screen readers can consume the full data set.
- Format numbers according to the active locale (en-US or pt-BR).
- Support English and Portuguese UI strings via the i18n message system.

# Constraints
- The component must not contain business logic; data interpretation is the consumer's responsibility.
- Bar height must always be calculated as a percentage of the maximum value; a value of zero must render a bar with zero visible height.
- The tooltip must not be visible unless the user is actively hovering over a bar.
- The legend must only appear when showLegend is explicitly true.
- Value labels above bars must only appear when showValues is explicitly true.
- When both Series and standalone Point slots are present, Series-based rendering takes precedence and standalone Points are ignored.
- Points with a non-numeric or missing value attribute must be treated as zero rather than causing a render error.`;
