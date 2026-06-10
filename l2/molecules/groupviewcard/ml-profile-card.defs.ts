/// <mls fileReference="_102040_/l2/molecules/groupviewcard/ml-profile-card.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewCard';
export const skill = `# Metadata
- TagName: groupviewcard--ml-profile-card

# Objective
A profile and contact card that presents identity, contact details, status, and quick actions for a user or entity. It supports interactive, selected, disabled, loading, and editing states, and allows consumers to compose either vertical or horizontal layouts through its content areas.

# Responsibilities
- Present identity information such as avatar, name, and role only when provided, without leaving empty placeholders.
- Present contact information and associated visual indicators exactly as provided.
- Present quick actions exactly as provided.
- Support an optional status indicator representing online, offline, or away states within any provided content area.
- Respond to pointer and keyboard activation when interactive and enabled.
- Be focusable only when interactive.
- Communicate disabled, selected, and loading states clearly.
- Display placeholder shapes approximating the header, content, and action regions while loading.
- Allow consumers to arrange content in either vertical or horizontal orientation without enforcing a single layout direction.
- Present content areas in a clear sequence so consumers can style for either orientation.
- Provide hover feedback only when interactive and enabled.
- Visually distinguish the title as primary emphasis and the description as secondary text.
- Group multiple actions with consistent spacing and alignment.
- Align contact indicators with their corresponding values in a readable arrangement.
- Support dark mode equivalents for all colors, borders, backgrounds, hover states, selected states, and placeholders.

# Constraints
- Must only use the content areas defined by the groupViewCard contract: header, title, description, content, footer, and action.
- Must not render placeholder interface elements for missing content areas.
- Must not respond to activation or be focusable when not interactive.
- Must be completely non-interactive when disabled, ignoring all activation attempts.
- Must not show hover feedback when disabled or non-interactive.
- Must maintain structural layout in the disabled state while reducing visual emphasis.
- Individual actions within the action area handle their own specific behaviors; the card signals only overall activation.
- Must communicate an editing state to all nested content within its regions when in editing mode.

# Notes
- Intended for employee directories, contact lists, and similar profile displays.
- Consumers provide all content and determine the layout direction; the card provides the container behavior and state management.`;

