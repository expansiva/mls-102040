/// <mls fileReference="_102040_/l2/molecules/groupviewmetric/ml-metric-card.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewMetric';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  metric: "big-number"
};

export const skill = `# Metadata
- TagName: groupviewmetric--ml-metric-card

# Objective
Present a statistical card that displays a configurable icon, a descriptive label, a primary highlighted value, and a trend indicator with period comparison. It must support a loading state and follow the groupViewMetric contract.

# Responsibilities
- Display an icon when icon content is provided.
- Display a label as the metric title or description.
- Display a primary value with the highest visual prominence.
- Display a trend indicator when trend content is provided, applying the appropriate state based on the declared direction of up, down, or neutral.
- Display helper text as supporting information for period comparisons when helper content is provided.
- Replace visible content with a skeleton representation that mirrors the card layout during loading.
- Behave as a figure and derive its accessible name from the label content.
- Announce updates to the primary value politely to assistive technologies.
- Describe the trend direction through an accessible label on the trend indicator.

# Constraints
- Must only use the contract-defined content areas: Icon, Label, Value, Trend, and Helper.
- The primary value is mandatory and must always be present.
- Must not offer multiple size variants; it must render at a single default size.
- Must not emit events.
- The trend indicator must visually distinguish positive, negative, and neutral states using green, red, and gray respectively, including equivalent dark variants.
- Colors and visual states must follow semantic pairings with corresponding dark variants for backgrounds, text, and borders.
- The skeleton state must preserve the overall card layout, representing the icon, label, value, and trend areas.
- The primary value must maintain greater visual hierarchy than the label and helper text.
- Helper text must remain visually subordinate to the primary value and label.

# Notes
- The component is purely presentational and depends on externally provided content.
- Trend direction styling applies only when trend content is supplied and a direction is explicitly declared.`;

