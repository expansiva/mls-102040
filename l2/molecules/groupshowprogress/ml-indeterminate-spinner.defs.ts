/// <mls fileReference="_102040_/l2/molecules/groupshowprogress/ml-indeterminate-spinner.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupShowProgress';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  progress: "spinner"
};

export const skill = `# Metadata
- TagName: groupshowprogress--ml-indeterminate-spinner

# Objective
Provide a purely visual loading indicator for ongoing processes that lack a measurable completion percentage. It communicates activity through continuous motion and optional accompanying text, functioning either inline or as a container overlay.

# Responsibilities
- Display continuous animation to indicate an active, unmeasured process
- Operate exclusively in an indeterminate state without showing numeric progress or completion values
- Support four distinct visual sizes: extra-small, small, medium, and large
- Render optional accompanying text adjacent to the indicator when provided
- Use provided label text as the accessible name for the component
- Function both inline within a layout and as an overlay covering a target area
- Remain purely visual without initiating or responding to interactions

# Constraints
- Must not display percentages, numeric values, or progress fills under any circumstance
- Must not expose a measurable progress value while operating in indeterminate mode
- Animation must remain active and uninterrupted whenever the component is visible
- Must use only the system's semantic color pairings for both light and dark themes
- Must not introduce color variants beyond the contracted semantic set
- Must maintain a neutral, corporate visual style suitable for overlays, buttons, and cards
- Must not require external content areas to function in inline or overlay modes

# Notes
- The label text serves as both visible context and the component's accessible identifier
- When acting as an overlay, the component covers its target container visually without modifying the underlying content structure`;

