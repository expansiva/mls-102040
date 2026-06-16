/// <mls fileReference="_102040_/l2/molecules/groupviewcard/ml-vertical-card.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewCard';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  cardLayout: "vertical"
};

export const skill = `# Metadata
- TagName: groupviewcard--ml-vertical-card

# Objective
A vertical card for the groupViewCard group that organizes information into optional sections: header with title and description, body, footer metadata, and actions. It adapts to interactive, loading, disabled, selected, and editing states while staying neutral for use across corporate contexts such as sales pipelines, project boards, recruitment funnels, supplier lists, and executive dashboards.

# Responsibilities
- Present a header section at the top when provided, showing a title above a description when both are present.
- Present a body section in the middle when content is provided.
- Present a footer section at the base for metadata, dates, or status when provided.
- Present an actions section visually separated from the main content when action elements are provided.
- Show only the sections that are provided; absent sections must leave no visible gaps.
- When in interactive mode, respond to pointer activation and keyboard activation, and signal that the card has been activated.
- When loading, show a structural placeholder that reflects the card's vertical layout instead of the actual header, body, footer, and action content.
- When selected, display a distinct visual state that indicates selection.
- When disabled, display a distinct visual state and block all interaction and activation signaling, even if interactive mode is enabled.
- When editing, communicate the editing context to contained elements.
- Maintain a neutral appearance that supports multiple business domains without specialized theming.
- Preserve correct visual state behavior in both light and dark presentation modes.

# Constraints
- Must not offer or accept visual style variants such as default, outlined, elevated, or ghost.
- Must not embed logic for any specific business domain; all domain-specific information must be supplied from outside.
- Loading state must suppress all provided content sections.
- Disabled state must override interactive mode.
- Interactive mode must include visible hover feedback and keyboard accessibility.
- Selection, disabled, loading, and hover appearances must remain consistent across presentation modes.

# Notes
- Corporate use cases are supported entirely by the external content placed within the card's sections.
- Editing state handling follows the group's established contract for contained elements.`;

