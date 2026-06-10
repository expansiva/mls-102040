/// <mls fileReference="_102040_/l2/molecules/groupviewmetric/ml-metric-trend-compare.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewMetric';
export const skill = `# Metadata
- TagName: groupviewmetric--ml-metric-trend-compare

# Objective
Display a metric with emphasis on the current value, accompanied by a reference label, previous period context, and a directional trend indicator that communicates performance semantically.

# Responsibilities
- Display a label identifying the metric above the primary value.
- Display the current value as the most prominent element, preserving any provided formatting such as numbers, currency, or percentages.
- Display comparison context below the current value, including the reference period and the previous period value when available.
- Display a trend indicator visually linked to the current value, with explicit semantic direction: positive, negative, or neutral.
- Render a loading state that replaces all data content while preserving the intended visual structure.
- Expose the metric container with an accessible name derived from its label.
- Announce changes to the current value to assistive technologies in a non-intrusive manner.
- Provide a textual description of the trend direction for assistive technologies.
- Remain purely visual and non-interactive, producing no events.

# Constraints
- The component must not infer or calculate trend direction from numeric values; direction must be explicitly defined.
- During loading, no actual data or text may be visible; only structural placeholders may appear.
- Trend indicator styling must map consistently to semantic direction across all supported color schemes, including dark variants.
- The component must not support or emit user interaction events.

# Notes
- Comparison period descriptions are configurable to support various analytical contexts (e.g., prior week, prior year).
- The component receives values already formatted and renders them without modification.`;

