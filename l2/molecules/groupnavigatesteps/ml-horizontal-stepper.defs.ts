/// <mls fileReference="_102040_/l2/molecules/groupnavigatesteps/ml-horizontal-stepper.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupNavigateSteps';
export const skill = `# Metadata
- TagName: groupnavigatesteps--ml-horizontal-stepper

# Objective
A horizontal stepper that presents a sequence of steps from left to right. Each step shows an icon and a title. Users can navigate between steps by clicking or using keyboard controls. The component visually communicates which steps are completed, active, pending, or unavailable, and can enforce sequential progression or allow free navigation.

# Responsibilities
- Display an optional title above the step sequence.
- Arrange all steps in a single horizontal row with equal spacing and a clear left-to-right flow.
- Render each step as an indicator containing an icon, with the step title shown directly below the indicator.
- Visually highlight the active step.
- Visually distinguish completed steps from pending steps.
- Visually dim steps that are unavailable and show them as non-interactive.
- Support a progression mode that restricts navigation to previously completed steps and the immediate next step only.
- Support a progression mode that allows navigation to any step that is not unavailable, regardless of completion order.
- Update the current step when the user selects an allowed step by clicking or by keyboard.
- Announce the current step and its title whenever the active step changes.
- Maintain synchronization so the visual state always reflects the current step.
- Automatically mark all steps preceding the active step as completed when the active step changes.
- Block interaction on steps marked as unavailable.
- Block all navigation when the entire component is marked as unavailable.
- Show a loading state that disables interaction and visually indicates activity.
- Allow users to move focus between steps using left and right directional controls.
- Allow users to select the focused step using a confirmation control.
- Ensure keyboard navigation follows the same restrictions as click navigation.
- Expose accessibility information so assistive technologies can identify the step list, each step, the active selection, unavailable steps, and completed steps.

# Constraints
- Unavailable steps must not respond to click or keyboard selection.
- In restricted progression mode, future steps beyond the immediate next allowed step must not be selectable.
- In free progression mode, completion state must not prevent navigation unless a step is unavailable.
- The loading state must suppress normal step visuals or dim them to emphasize that activity is in progress.
- When navigating to a step, all preceding steps must be implicitly treated as completed, regardless of whether they were individually visited.
- Completed steps must not appear identical to pending or active steps.
- The left-to-right progression sense must remain clear regardless of step state.

# Notes
- The title above the stepper is optional.
- Each step supplies its own icon content individually.
- The component can operate in either strict sequential order or free-form navigation.`;

