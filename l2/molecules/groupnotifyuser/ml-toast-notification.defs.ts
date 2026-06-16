/// <mls fileReference="_102040_/l2/molecules/groupnotifyuser/ml-toast-notification.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupNotifyUser';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  feedback: "toast"
};

export const skill = `# Metadata
- TagName: groupnotifyuser--ml-toast-notification

# Objective
Provide ephemeral floating notifications that appear in a screen corner, slide in and out smoothly, indicate different severity levels through color and icon, dismiss automatically after a set time or manually via a close control, optionally offer a secondary action, and stack vertically when multiple instances are active.

# Responsibilities
- Appear in a configurable screen corner when activated, sliding smoothly from the edge of that corner.
- Disappear by sliding out smoothly along the same path used for entry.
- Present four distinct visual identities: information (blue), success (green), warning (yellow), and error (red), each with a default icon.
- Display a provided message as the primary content.
- Disappear automatically after a configurable duration unless dismissed earlier.
- Allow manual dismissal via a close control when manual closing is enabled.
- Offer an optional action trigger, visually distinct from the message, that can be activated independently of dismissal.
- Use a custom icon when one is supplied; otherwise, show the default icon for the current notification type.
- Stack vertically with uniform spacing between simultaneous notifications.
- Announce urgent interruptions for error and warning types, and polite updates for information and success types to assistive technologies.

# Constraints
- Must remain hidden when inactive.
- Must complete its exit and cease to be presented after dismissal.
- Must cancel pending automatic dismissal if the notification is deactivated externally or dismissed manually before the configured duration elapses.
- Must not show a manual close control when manual dismissal is disabled.
- Must not show an action trigger when no action is provided.
- Must preserve consistent external spacing to support predictable vertical stacking in shared presentation areas.
- Must apply the appropriate urgency level for assistive announcements based on the notification type.

# Notes
- The notification is transient and intended only for temporary awareness.
- Screen corner selection determines both placement and the direction of the slide motion.
- Activating the action trigger is independent of dismissal; the notification remains visible unless dismissal is separately requested.`;

