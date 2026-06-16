/// <mls fileReference="_102040_/l2/molecules/groupshowprogress/ml-segmented-progress.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupShowProgress';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  progress: "segmented"
};

export const skill = `# Metadata
- TagName: groupshowprogress--ml-segmented-progress

# Objective
Provide visual feedback of progress to the user. It indicates how much of an operation or process has been completed, or that activity is occurring when no specific completion percentage is known.

# Responsibilities
- Display a single progress indicator that fills proportionally to a provided numeric completion level.
- Show continuous motion to indicate unspecified activity when no numeric value is available.
- Present the current percentage as formatted text alongside or over the indicator when explicitly enabled and a numeric value exists.
- Identify itself to assistive technologies with an appropriate label and role.
- Report the current numeric bounds and value to assistive technologies in determinate mode.
- Adjust its overall dimensions according to the specified size option.
- Remain visually clear and readable in both light and dark presentation modes.

# Constraints
- The accepted numeric progress must be limited to the range 0–100; anything below 0 must be treated as 0 and anything above 100 as 100.
- When no numeric value is provided, the component must enter an indeterminate state and must suppress percentage text regardless of display settings.
- The component must not emit events or support interactions such as clicking, hovering for details, or focusing individual segments.
- The component must not render discrete segments, step names, labels for individual portions, or unique colors per portion.
- In determinate mode, the component must communicate the minimum value as 0, maximum value as 100, and the current numeric value to assistive technologies.
- In indeterminate mode, the component must not communicate a current numeric value to assistive technologies.
- Any displayed percentage text must maintain legibility against both light and dark backgrounds.

# Notes
- The visual indicator is always a single continuous bar, never a sequence of separate segments.
- The indeterminate animation persists until a numeric value is supplied or the component is no longer rendered.`;

