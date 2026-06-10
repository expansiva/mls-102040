/// <mls fileReference="_102040_/l2/molecules/groupexpandcontent/ml-collapsible-panel.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupExpandContent';
export const skill = `# Metadata
- TagName: groupexpandcontent--ml-collapsible-panel

# Objective
Provide an expandable and collapsible panel interface that allows users to reveal or hide content by interacting with section headers. Supports multiple independent sections, optional subtitles, icons, and controlled expansion behavior.

# Responsibilities
- Render multiple independent collapsible sections when provided.
- Each section header must be clickable to toggle its expanded or collapsed state.
- Display an optional label as a component title above the sections.
- Display a left-aligned icon and optional subtitle within each section header.
- Indicate expanded state through a right-aligned chevron that changes orientation.
- Animate the expansion and collapse of section content smoothly.
- Support an initial expanded state for individual sections.
- Support a mode where only one section may be expanded at a time.
- Support a mode where multiple sections may be expanded simultaneously.
- Emit events when a section is opened or closed, including the section index, title, and current state.
- Support keyboard navigation between headers and toggling via Enter and Space.
- Render a loading placeholder when content is not yet ready, preventing section interaction.
- Visually indicate when the entire component or individual sections are disabled and prevent interaction.

# Constraints
- Section headers must not be interactive while the component is in a loading state.
- Disabled sections must not respond to click or keyboard interactions.
- When configured for single expansion, expanding one section must collapse any other expanded section.
- Section content must remain hidden when collapsed and visible when expanded.
- The loading state must suppress all section interactions and display placeholder content instead.
- Keyboard navigation must cycle through headers without activating them unless explicitly triggered.
- Multiple instances must maintain independent expansion states without interfering with each other.
- Visual states must respect semantic color pairing rules including dark mode variants.

# Notes
- The subtitle is only rendered when explicitly provided for a section.
- Events are dispatched for both open and close actions under a unified toggle contract.`;

