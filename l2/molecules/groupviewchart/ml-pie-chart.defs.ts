/// <mls fileReference="_102040_/l2/molecules/groupviewchart/ml-pie-chart.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupViewChart';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {};

export const skill = `# Metadata
- TagName: groupviewchart--ml-pie-chart

# Objective
Display a pie chart that represents proportional data as colored SVG arc segments. The component accepts data through declarative Series and Point slot elements, renders each slice proportionally to its share of the total, and supports hover tooltips, keyboard interaction, and an accessible data table for screen readers.

# Responsibilities
- Parse standalone Point slot elements or Series slot elements (each containing nested Points) to build the list of pie segments.
- Compute the SVG arc path for each segment using polar-to-cartesian geometry, scaled to the point's proportion of the total value.
- Assign colors to segments from the built-in palette when no explicit color attribute is provided.
- Render a positioned tooltip showing the segment label, value, series name, and color swatch when the user hovers over or focuses a slice.
- Dispatch a pointClick CustomEvent (bubbles, composed) with label, value, and series when a slice is clicked or activated with Enter or Space.
- Show an optional label above the chart when a Label slot is provided.
- Render a two-column color-coded legend below the chart when showLegend is true.
- Optionally render the numeric value as SVG text at the midpoint of each slice when showValues is true.
- Render an animated loading placeholder when loading is true.
- Render an empty state message when no valid segments are available; use the Empty slot content when provided, otherwise fall back to the localized default.
- Include a visually hidden accessible table (sr-only) listing all segment labels, values, and series.
- Support English and Portuguese UI strings via the i18n message system.

# Constraints
- The component must not contain business logic; data interpretation is the consumer's responsibility.
- Points with a missing label, missing value, non-numeric value, or value of zero or less must be silently excluded from rendering.
- When Series slots are present, standalone root-level Point slots are ignored and the series points are used exclusively.
- The tooltip must not intercept pointer events; it must use pointer-events-none so it does not block interaction with underlying elements.
- The legend must only appear when showLegend is explicitly true and at least one valid segment exists.
- Value labels inside slices must only appear when showValues is explicitly true.`;
