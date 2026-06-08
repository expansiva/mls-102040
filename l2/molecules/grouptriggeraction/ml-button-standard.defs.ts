/// <mls fileReference="_102040_/l2/molecules/grouptriggeraction/ml-button-standard.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupTriggerAction';
export const skill = `# Metadata
- TagName: grouptriggeraction--ml-button-standard

# Objective
A standard button molecule for the groupTriggerAction group that triggers actions when activated. It supports text labels, icons, multiple sizes, visual styles, loading states with a spinner indicator, and disabled states. Designed for corporate interfaces such as ERP, CRM, HR, Financial, and Logistics systems.

# Responsibilities
- Display a text label and/or an icon provided through the designated Label and Icon content areas.
- Arrange the icon either before or after the text label based on configuration.
- Adjust overall dimensions and icon scale according to the selected size.
- Behave as a standard button, a submit button, or a reset button based on configuration.
- Ignore activation attempts and present a disabled state when configured as disabled.
- Ignore activation attempts and present a busy state when configured as loading.
- Show a loading spinner in place of the icon or text during loading, keeping the button size unchanged.
- Trigger an action event when activated by pointer or keyboard (Enter or Space), unless disabled or loading.
- Expose an accessible name for icon-only buttons using the Label content when available.
- Support rich content within the Label and Icon areas.
- Provide distinct visual feedback for Normal, Hover, Active, and Focused states, with a visible focus indicator for keyboard users.
- Reduce opacity and remove interactive feedback when disabled.
- Support visual variations for primary, secondary, danger, ghost, and link styles through theming.
- Adapt colors for dark mode using semantic color definitions.

# Constraints
- Must compose content using only the Label and Icon areas.
- Icon position must be either 'start' or 'end'.
- Size must be one of 'xs', 'sm', 'md', or 'lg'.
- Type must be one of 'button', 'submit', or 'reset'.
- When disabled, the action event must not trigger.
- When loading, the action event must not trigger, and the button must expose busy and disabled states for accessibility.
- During loading, the spinner replaces the icon if present; otherwise, it replaces the text label.
- The action event must contain no detail and must propagate normally.
- For icon-only buttons, the accessible name must come from the Label content if provided; otherwise, it must be empty.
- Visual style variations must not require additional configuration properties.
- Dark mode colors must map to semantic tokens for background, text, border, and focus ring.

# Notes
- Designed for corporate contexts such as ERP forms, CRM proposals, HR approvals, financial payments, and logistics operations.
- The button must preserve its dimensions during loading to prevent layout shifts.
- Visual design aligns with Material UI, Ant Design, and Atlassian Design System button patterns.`;

