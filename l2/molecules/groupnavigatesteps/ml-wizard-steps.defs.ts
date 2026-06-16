/// <mls fileReference="_102040_/l2/molecules/groupnavigatesteps/ml-wizard-steps.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupNavigateSteps';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  steps: "horizontal"
};

export const skill = `# Metadata
- TagName: groupnavigatesteps--ml-wizard-steps

# Objective
A step navigation component that displays a horizontal sequence of workflow steps and manages user progression through them. It indicates active, completed, pending, and disabled states, and enforces either sequential or free-form navigation based on step completion.

# Responsibilities
- Render a horizontal step indicator strip ordered from left to right matching the sequence of provided step definitions.
- Display each step's required title and optional description.
- Visually highlight the active step.
- Show a completion mark on steps marked as finished.
- Apply a subdued appearance to disabled steps and remove their interactivity.
- Present an optional label above the step sequence.
- Update the active step upon valid user selection and notify the system of the change, including the step's identity and title.
- Honor an externally controlled value to determine which step is active.
- Disable all navigation when the component is in a disabled state.
- In linear mode, restrict forward navigation to the next step only when the current step is completed; allow return to prior completed steps.
- In non-linear mode, permit navigation to any step that is not disabled, without completion prerequisites.
- Prevent advancement when linearity or completion requirements are unmet.
- Consider optional steps non-blocking for progression when marked complete.
- Display a loading state that replaces the normal step indicator when loading is active.
- Enable keyboard navigation to move between steps and select the focused step.
- Expose accessibility information so assistive technologies can identify the active step, disabled steps, and completed steps.

# Constraints
- Must operate exclusively within the groupNavigateSteps contract properties, events, and content areas.
- Must not provide internal footer buttons for step navigation; external controls are the consumer's responsibility.
- Step definitions must include a title; description, completion status, and disabled state are optional.
- Validation must rely only on the completion status of steps and the linear mode setting; no external validation callbacks or additional events may be used.
- The loading state must override the standard visual presentation entirely.
- Must maintain accessible navigation semantics for the step container and each step.
- Must remain visually usable in both light and dark presentation modes.

# Notes
- The consumer manages step completion state and any external navigation buttons.
- This component governs only the step indicator strip; step body content is handled separately by the consumer.`;

