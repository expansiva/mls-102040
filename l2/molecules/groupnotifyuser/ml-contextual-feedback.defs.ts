/// <mls fileReference="_102040_/l2/molecules/groupnotifyuser/ml-contextual-feedback.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupNotifyUser';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  feedback: "inline"
};

export const skill = `# Metadata
- TagName: groupnotifyuser--ml-contextual-feedback

# Objective
Provide contextual feedback messages inside forms, positioned near related fields or sections. Communicates success, error, warning, or info states through text, optional icon, and optional action. Supports dismissible and persistent modes, automatic dismissal timing, and accessibility announcements.

# Responsibilities
- Display only when visible; remain completely hidden otherwise
- Present a primary message as contextual feedback near form fields or sections
- Support four semantic variants: success, error, warning, and info
- Display an optional icon when provided alongside the message
- Display an optional title with clear visual hierarchy relative to the message
- Display an optional action control and report when it is activated
- Provide a manual dismissal control when configured as dismissible
- Automatically dismiss after a specified duration when visible, if duration is configured
- Cancel automatic dismissal if the user manually dismisses first
- Report whenever the message is dismissed, whether by user action or automatic timeout
- Announce error and warning messages immediately to assistive technologies
- Announce info and success messages to assistive technologies without interrupting
- Support inline placement within form layouts without overlaying adjacent content
- Animate entry with a combined fade and slight slide when becoming visible

# Constraints
- Must not render any content when hidden
- Must not show a dismissal control when not configured as dismissible
- Must remain visible until externally changed when persistent and no duration is set
- Must always report dismissal when it occurs
- Must prioritize manual dismissal over automatic timeout
- Must align horizontally when an icon is present; otherwise the message must use the full available width
- Must maintain a compact, inline appearance appropriate to form contexts

# Notes
- Designed for localized form feedback rather than global notifications
- Entry animation applies only on transition to visible`;

