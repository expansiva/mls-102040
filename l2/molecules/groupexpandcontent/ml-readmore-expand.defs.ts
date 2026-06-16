/// <mls fileReference="_102040_/l2/molecules/groupexpandcontent/ml-readmore-expand.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupExpandContent';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  expand: "readmore"
};

export const skill = `# Metadata
- TagName: groupexpandcontent--ml-readmore-expand

# Objective
Displays content sections that users can expand to view fully or collapse to hide. Supports both accordion-style single expansion and multiple simultaneous expansions. Provides clear visual states and accessibility for interactive content disclosure.

# Responsibilities
- Render content sections with an interactive trigger and an expandable content area
- Expand a section to reveal its full content when the user activates its trigger
- Collapse an expanded section to hide its content when the user activates its trigger again
- Support a configuration where expanding one section automatically collapses any other open section
- Support a configuration where multiple sections may remain expanded at the same time
- Initialize sections in their designated expanded or collapsed state when first displayed
- Ignore all expansion interactions when the entire component is disabled
- Ignore expansion interactions only for sections individually marked as disabled
- Announce when a section changes state by providing the section identifier and whether it is now expanded or collapsed
- Display an optional text label above the group of sections
- Show a loading indicator and suppress section content while loading data
- Allow users to navigate between section triggers using directional keys
- Allow users to activate the focused section trigger using standard activation keys
- Expose expanded state and disabled state to assistive technologies on each trigger
- Associate each expandable content region with its corresponding trigger for assistive technologies

# Constraints
- Must not apply height restrictions, clipping, or fade gradients to simulate truncated content
- Must not use custom text labels for expand or collapse actions beyond the standard section trigger
- Must not emit state change notifications that lack the section identifier or expanded status
- Must not allow disabled sections to change state through any interaction method
- Must not allow any section to change state when the entire component is disabled
- Must maintain visual distinction between expanded and collapsed sections
- Must maintain visual distinction for disabled states at both component and section levels
- Must ensure keyboard navigation cycles only through interactive triggers, skipping disabled ones appropriately

# Notes
- The trigger area acts as the primary control for revealing or hiding content
- Visual design should support both light and dark presentation modes
- Animation between expanded and collapsed states should provide clear visual feedback without impeding accessibility`;

