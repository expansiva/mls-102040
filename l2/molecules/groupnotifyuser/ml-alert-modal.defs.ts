/// <mls fileReference="_102040_/l2/molecules/groupnotifyuser/ml-alert-modal.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupNotifyUser';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  feedback: "modal"
};

export const skill = `# Metadata
- TagName: groupnotifyuser--ml-alert-modal

# Objective
Present a blocking modal alert for critical or destructive actions that demands user attention and an explicit choice before proceeding. Communicate severity through visual cues and provide clear options to confirm or cancel the action.

# Responsibilities
- Appear as a centered overlay with a backdrop that blocks interaction with the underlying screen when activated
- Display a severity-appropriate icon by default, while allowing replacement with a custom icon when provided
- Show a title when one is supplied
- Always display the descriptive message content when the alert is active
- Present externally supplied action buttons, including confirmation and cancellation options, arranged side by side
- Notify the system when the user selects an action button
- Notify the system when the user dismisses the alert through an available dismiss mechanism
- Remain open when the user interacts with the backdrop or clicks outside the alert boundaries
- Disappear completely without leaving reserved space when in an inactive state
- Automatically close after a configured duration when specified, transitioning to an inactive state and signaling dismissal
- Support distinct severity levels: danger treated as error, warning as warning, and info as info
- Disable user-initiated dismissal mechanisms when configured as non-dismissible
- Adjust presentation to modal overlay behavior when positioned for centered display
- Announce its presence and severity to assistive technologies using appropriate roles and live regions
- Adapt its visual presentation for dark environments

# Constraints
- The backdrop must be purely visual and must not respond to clicks or taps by closing the alert
- Action buttons must be supplied externally; the alert must not generate default buttons
- No output may be displayed when the alert is inactive
- When non-dismissible, no close button or dismiss gesture may be available to the user
- The message area must not be empty when the alert is visible
- Default icons must match the severity level when no custom icon is supplied
- Auto-dismiss must only occur when a positive duration is configured and the alert is active
- Severity mapping must remain consistent: danger corresponds to error behavior
- Modal positioning must cover the full screen with an overlay backdrop
- Accessibility announcements must reflect the current alert type

# Notes
- The caller is responsible for defining the labels and appearance of the action buttons placed inside the action area
- Dismissal via the dedicated dismiss mechanism is equivalent to cancellation from the system's perspective`;

