/// <mls fileReference="_102040_/l2/molecules/groupviewchart/ml-area-chart.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewChart';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {};

export const skill = `# Metadata
- TagName: groupviewchart--ml-area-chart

# Objective
Present quantitative information as an area chart that highlights volume through filled regions below trend lines. Enable comparison across single or multiple data series, with a default stacked view that shows how individual parts compose a total. Offer interactive discovery, loading feedback, empty state handling, and full accessibility support.

# Responsibilities
- Render data as lines connecting points, with the area beneath each line filled using the series color at reduced opacity.
- Accumulate multiple series vertically in a stacked view by default, making each series' contribution to the total visible at every point.
- Activate a selection behavior when a user interacts with a data point, carrying the point's label, value, and series name when applicable.
- Reveal a contextual description on hover over any data point, displaying its label, value, and series name when relevant.
- Display a legend mapping each series name to its corresponding color when enabled; hide the legend entirely when disabled.
- Replace the chart with a loading placeholder that preserves the final dimensions while data is unavailable.
- Show an empty state when no data points exist, preferring custom empty content or falling back to a default empty indication.
- Expose the chart container to assistive technologies as a graphical image named by the chart title.
- Supply raw data in a structured, non-visual form accessible to assistive technologies.
- Treat interactive data points as actionable controls described by their label and value.
- Apply provided title content as the visible chart heading and as the accessible name for the chart container.

# Constraints
- Must handle both single-series and multi-series data seamlessly.
- Must default to stacked mode whenever multiple series are present.
- Tooltip information must always include label and value; series name must appear only when multiple series are present.
- Legend colors and names must correspond exactly to the rendered areas.
- The loading placeholder must suggest a chart shape and occupy the same space as the completed chart.
- All visual elements must maintain adequate contrast in both light and dark presentation modes.
- The empty state must suppress the chart area and axes.
- Interactive points must remain operable and perceptible across all display modes.

# Notes
- Area fill opacity must remain low enough to keep grid lines and overlapping series distinguishable.
- Tooltip placement must avoid covering the target data point or neighboring content.
- Dark mode must rely on semantically appropriate color pairings for backgrounds, text, and borders.`;

