/// <mls fileReference="_102040_/l2/molecules/groupnavigatesteps/ml-compact-step-indicator.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupNavigateSteps';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  steps: "horizontal"
};

export const skill = `# Metadata
- TagName: groupnavigatesteps--ml-compact-step-indicator

# Objective
Provide a compact visual indicator for multi-step workflows that displays progress through numbered steps or completion marks without visible text labels, optimized for narrow spaces such as form headers.

# Responsibilities
- Display a series of step indicators in a compact format suitable for limited horizontal space
- Indicate which step is currently active through visual emphasis
- Show completed steps with a completion mark instead of a number
- Present pending steps with a numeric indicator
- Support a loading state that replaces the step indicators when active
- Allow step selection when navigation is enabled
- Communicate the selected step's identity and title to the system upon selection
- Provide accessibility labels using each step's title and description even though they are not visually displayed

# Constraints
- Must not display step titles or descriptions as visible text within the indicator area
- When navigation is globally blocked, no step may be selected
- When a step is marked as disabled, it must not be selectable under any condition
- In linear mode, only previously completed steps and the single next step immediately following the current completed step may be selected; future steps beyond that are not selectable
- In non-linear mode, any step that is not disabled may be selected regardless of completion status
- Must support distinct visual treatments for pending, active, completed, disabled, and loading states
- Must adapt color semantics for both light and dark environments
- Must arrange indicators in a single horizontal row with even spacing for header layouts
- Must support configurable sizing to accommodate different container constraints

# Notes
- The optional label associated with the indicator is not rendered as part of the compact step visualization
- Step descriptions contribute to accessibility context but remain visually hidden`;

