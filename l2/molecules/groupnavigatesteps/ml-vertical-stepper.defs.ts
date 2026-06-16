/// <mls fileReference="_102040_/l2/molecules/groupnavigatesteps/ml-vertical-stepper.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupNavigateSteps';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  steps: "vertical"
};

export const skill = `# Metadata
- TagName: groupnavigatesteps--ml-vertical-stepper

# Objective
Guide the user through an ordered sequence of steps displayed in a vertical list, indicating which step is currently active, which steps have been completed, and which are still pending. The component supports linear and non-linear navigation modes, per-step disabled and completed states, an optional description per step, and full keyboard navigation.

# Responsibilities
- Render each Step slot as a vertically stacked list item showing a numbered indicator, a title, and an optional description.
- Mark the step whose index matches the value property as active.
- Replace the number indicator with a checkmark icon for steps that carry the completed attribute.
- Connect adjacent steps with a vertical connector line, coloured to indicate completion or activity of the next step.
- Dispatch a change custom event (bubbling, composed) with value (index) and title when a navigable step is selected.
- In linear mode, allow navigation only to steps at or before the current step, or to the immediately following step if the current step is completed, or to any already-completed step.
- In non-linear mode, allow navigation to any non-disabled step regardless of order.
- Support keyboard navigation: ArrowDown/ArrowRight moves to the next navigable step; ArrowUp/ArrowLeft moves to the previous; Home jumps to the first navigable step; End jumps to the last; Enter/Space selects the focused step.
- Move focus programmatically to the newly selected step button after keyboard navigation.
- Render an optional Label slot as a heading above the step list.
- Display a loading message when the loading property is true.
- Show an empty-state message when no Step slots with a title are provided.
- Apply ARIA roles (tablist, tab) and aria-selected, aria-disabled, and aria-label attributes for accessibility.
- Support light and dark color schemes through conditional class application.

# Constraints
- Steps without a title attribute must be silently skipped and not rendered.
- Navigation to a disabled step must be blocked regardless of linear mode setting.
- The active step button must receive tabindex="0"; all other step buttons must receive tabindex="-1".
- In linear mode, forward navigation beyond the next step is blocked unless intermediate steps are completed.
- The component must not contain business logic; it only manages step selection and completion display.
- The component-level disabled property must block all step interaction and navigation.`;
