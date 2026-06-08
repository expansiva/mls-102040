/// <mls fileReference="_102040_/l2/molecules/groupexpandcontent/ml-single-expand-content.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupExpandContent';
export const skill = `# Metadata
- TagName: groupexpandcontent--ml-single-expand-content

# Objective
Manage a single expandable section with a clickable header and collapsible body. It must display a title above the section when provided, open and close smoothly, report state changes, and prevent interaction when disabled or loading.

# Responsibilities
- Present exactly one Section slot; ignore any additional Section slots beyond the first.
- Display the section header text from the mandatory title attribute of the Section slot.
- Display the expandable body from the inner content of the Section slot.
- Start in an expanded or collapsed state based on the expanded attribute of the Section slot.
- Reflect the current expanded state through a dedicated property and allow external update.
- Notify when the expanded state changes by emitting an event that includes the new state.
- Prevent toggling when the component or the Section slot is marked as disabled.
- Replace all section content with a loading placeholder and block all interaction while loading.
- Display the Label slot, when present, as a title above the section without interfering with expansion.
- Apply accordion behavior when multiple Section slots are provided and the multiple property is false.
- Support configurable animation for expand and collapse transitions.
- Make the header focusable and indicate its current expanded state to assistive technologies.
- Associate the expandable body with its header for accessibility.
- Allow toggling via Enter and Space keys, and navigate between headers with Arrow Up and Arrow Down when multiple sections are present.

# Constraints
- The Section slot must supply a title attribute to define the header text.
- Only the first Section slot is effective; extras are disregarded.
- Disabled state must visually attenuate the section and block toggling.
- Loading state must hide actual content and show only a placeholder.
- State change events must carry the exact expanded value and, for toggle events, include index and title.
- Focus indicators must be visible when navigating by keyboard.
- Colors and borders must support dark mode through semantic pairing.

# Notes
- The Label slot is purely presentational and does not trigger or prevent expansion.
- Although optimized for one section, accidental provision of multiple Section slots is handled via the multiple property rule set.`;

