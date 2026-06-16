/// <mls fileReference="_102040_/l2/molecules/groupexpandcontent/ml-reveal-overlay.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupExpandContent';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  expand: "overlay"
};

export const skill = `# Metadata
- TagName: groupexpandcontent--ml-reveal-overlay

# Objective
Conceal sensitive or surprise content behind a visual overlay until the user explicitly chooses to reveal it. Provide a configurable warning before disclosure, allow the user to toggle between hidden and visible states, and inform the system whenever the content is revealed or concealed.

# Responsibilities
- Display a configurable warning message above each revealable content block.
- Keep sensitive content fully hidden behind a visual overlay until the user interacts with the reveal control.
- Provide a central control over the overlay that offers to reveal the content when hidden and to hide it when shown.
- Remove the overlay with a smooth visual transition when the user chooses to reveal the content.
- Allow the user to restore the hidden state by activating the same control again.
- Inform the system of any state change by identifying the affected section, its title, and whether it is now revealed or hidden.
- Prevent toggling and system notifications when the molecule or a specific section is inactive.
- Show a loading state instead of sections when content is not yet ready.
- Support keeping multiple sections open at once or only one at a time, according to the group behavior contract.

# Constraints
- Must use only the predefined content areas of the group contract for the warning text and the sensitive content blocks; no additional content areas, controls, or notification mechanisms may be introduced.
- The warning text must be provided through the designated warning content area.
- Each sensitive content block must reside in its designated content area, and the central control label must come from the title associated with that area.
- The control label must indicate the current action: offering to reveal when content is hidden and to hide when content is visible.
- The overlay must completely obscure the underlying content while hidden, preventing any visual access to the information beneath.
- The overlay must cover the full content area without disturbing the surrounding layout or flow.
- When inactive, the entire block—including overlay, control, and content—must appear visually dimmed or disabled.
- Colors for backgrounds, text, borders, and hover states must follow the semantic pairs defined for both standard and dark presentations.
- The reveal and hide actions must remain reversible; the user must never be locked into a single state.

# Notes
- The overlay may employ blur or solid color treatments as long as the content remains unreadable prior to revelation.
- Transitions between hidden and revealed states should be noticeable but not distracting.
- All structural behavior, accessibility, and notification semantics are governed by the groupExpandContent contract.`;

