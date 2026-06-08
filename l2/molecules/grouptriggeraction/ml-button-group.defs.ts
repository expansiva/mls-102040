/// <mls fileReference="_102040_/l2/molecules/grouptriggeraction/ml-button-group.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupTriggerAction';
export const skill = `# Metadata
- TagName: grouptriggeraction--ml-button-group

# Objective
A group of related buttons that act as a single control unit, allowing users to choose between related actions or options. The buttons appear visually connected without gaps, supporting different layouts, sizes, and visual styles.

# Responsibilities
- Display multiple related buttons as a unified group without spacing between them
- Support both horizontal and vertical arrangements
- Allow each button to display text, an icon, or both
- Pair icons with their corresponding text labels by order of appearance
- Apply uniform sizing to all buttons within the group
- Control icon placement relative to text across all buttons
- Indicate when the entire group is disabled and prevent user interaction
- Indicate when the entire group is loading and block interaction
- Replace normal button content with a loading indicator during loading states
- Notify the system when any button is activated, provided the group is not disabled or loading
- Support distinct visual treatments for primary, secondary, and ghost presentations
- Default to secondary presentation when no specific style is assigned to a button
- Adapt colors and contrast for both light and dark presentation modes

# Constraints
- If no labels are provided, the group must appear empty with no visible buttons
- Icons must align with their paired label by order; any unmatched icons must not appear
- Disabled state must remove all interaction affordances and prevent action notification
- Loading state must hide all standard content and display only the loading indicator
- Internal borders between adjacent buttons must never appear duplicated
- Outer corners must be rounded while inner corners must remain square
- A visible focus indicator must appear when a button receives keyboard focus
- All buttons in the group must share the same size, type, and icon position settings
- Action notification must carry no supplementary data beyond the activation signal

# Notes
- The group is intended for related actions such as save/cancel, time period selection, view switching, status filtering, or shift selection
- Each button within the group maintains its own variant independently`;

