/// <mls fileReference="_102040_/l2/molecules/groupviewmetric/ml-metric-big-number.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupViewMetric';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  metric: "big-number"
};

export const skill = `# Metadata
- TagName: groupviewmetric--ml-metric-big-number

# Objective
Display a single key metric as a large prominent number accompanied by optional contextual elements: an icon, a descriptive label, a trend indicator with directional coloring, and a helper text. The component is designed for dashboard-style KPI cards where a value needs to be immediately scannable.

# Responsibilities
- Render the Value slot content in a large, bold typography style as the focal point of the component.
- Render the Label slot content in a smaller, muted style above the value when the Label slot is present.
- Render the Icon slot content in a neutral color container when the Icon slot is present.
- Render the Trend slot content with color-coded styling based on the direction attribute of the Trend slot: green for "up", red for "down", and neutral gray for "neutral" or any unrecognized value.
- Render the Helper slot content in a small, subdued style below the trend when the Helper slot is present.
- Render an animated loading skeleton with pulse placeholders when loading is true.
- Set aria-live="polite" on the value container so assistive technologies announce value changes.
- Derive the accessible aria-label for the figure container from the Label slot text content, stripping HTML tags.

# Constraints
- The component must not contain business logic; metric computation and data binding are the consumer's responsibility.
- The component must render nothing (empty template) when the Value slot is absent and loading is false.
- Icon, Label, Trend, and Helper are all optional; the component must render correctly when any combination of them is absent.
- Trend color must be determined exclusively by the direction attribute on the Trend slot element; the component must not infer direction from the value content itself.
- The component must not alter the content of any slot; it only wraps slot content in styled containers.`;
