/// <mls fileReference="_102040_/l2/molecules/groupviewchart/ml-radar-chart.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewChart';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {};

export const skill = `# Metadata
- TagName: groupviewchart--ml-radar-chart

# Objective
Provide a radar chart for comparing multiple dimensions across one or more data series. It must render labeled axes in a circular layout, display each series as a distinct visual layer, and allow users to explore and select individual values.

# Responsibilities
- Display a chart title.
- Render up to eight labeled axes distributed uniformly around a circular layout.
- Support multiple data series for comparison, each with a distinct name and color.
- Support a single data series provided without explicit grouping.
- Limit visible axes to the first eight dimensions when excess dimensions are provided.
- Automatically determine the scale for each axis based on the maximum value found across all series for that dimension.
- Present detailed information upon hovering over any vertex, including the axis label, numeric value, and series name when applicable.
- Enable selection of any vertex and communicate its axis label, value, and associated series.
- Show a loading indicator while data is being prepared.
- Display provided empty-state content when no valid data exists; otherwise show a default empty state.
- Render a legend identifying each series when enabled; omit the legend when disabled.
- Show numeric values at each vertex when enabled; hide them when disabled.
- Make the underlying data available in an accessible format.
- Ensure every interactive vertex conveys its axis label, value, and series identity.

# Constraints
- Must not render more than eight axes.
- Axis labels must align with their respective positions around the chart perimeter.
- Each series must be represented as a closed shape connecting its values across all axes.
- Multiple series must remain visually distinguishable through unique colors and semi-transparent fills.
- Concentric reference rings must indicate scale levels.
- Vertices must be visibly marked where series shapes intersect the axes.
- The chart area must maintain its structure during loading and empty states.
- Color usage must adapt appropriately for light and dark presentation modes.

# Notes
- Intended for scenarios such as semestral performance reviews comparing actual versus expected results across competencies including leadership, technical skill, communication, and deliverables.`;

