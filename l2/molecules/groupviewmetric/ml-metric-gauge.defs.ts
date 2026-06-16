/// <mls fileReference="_102040_/l2/molecules/groupviewmetric/ml-metric-gauge.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupViewMetric';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  metric: "gauge"
};

export const skill = `# Metadata
- TagName: groupviewmetric--ml-metric-gauge

# Objective
Display a compact metric card that combines a key value with a horizontal gauge bar, providing an immediate visual sense of progress or fill level. The card optionally includes an icon, a label, a trend badge with directional coloring, and helper text, making it suitable for dashboard KPI widgets that need both a numeric readout and a relative-position indicator.

# Responsibilities
- Render the Value slot content in a bold numeric style as the primary readout.
- Render a horizontal gauge bar below the value as a static visual track with a filled region and a circular indicator marker.
- Render the Label slot content in a small muted style above the value when the Label slot is present.
- Render the Icon slot content inside a square rounded container when the Icon slot is present.
- Render the Trend slot content as a pill badge with color-coded border and text based on the direction attribute of the Trend slot: green for "up", red for "down", and neutral gray for any other value.
- Render the Helper slot content in a small subdued style below the gauge bar when the Helper slot is present.
- Render an animated pulse loading skeleton that mirrors the card layout when loading is true.
- Derive the accessible aria-label of the figure container from the Label slot's text content when present.
- Set aria-live="polite" on the value container so assistive technologies announce value changes.

# Constraints
- The component must not contain business logic; metric value, gauge fill level computation, and trend direction are the consumer's responsibility.
- The gauge bar is a purely decorative static element; it does not reflect the Value slot content programmatically.
- Icon, Label, Trend, and Helper are all optional; the component must render correctly when any combination of them is absent.
- Trend color must be determined exclusively by the direction attribute on the Trend slot element; the component must not infer direction from the value content.
- The component must not alter the content of any slot; it only wraps slot content in styled containers.`;
