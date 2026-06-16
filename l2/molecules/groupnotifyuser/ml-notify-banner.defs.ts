/// <mls fileReference="_102040_/l2/molecules/groupnotifyuser/ml-notify-banner.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupNotifyUser';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  feedback: "banner"
};

export const skill = `# Metadata
- TagName: groupnotifyuser--ml-notify-banner

# Objective
Display a contextual inline or floating notification banner that communicates a status message to the user. The banner supports four semantic types (info, success, warning, error), an optional title, an optional action link, an optional custom icon, a dismiss button, automatic timed dismissal, and configurable screen positioning.

# Responsibilities
- Render the banner only when the visible property is true; render nothing when visible is false.
- Apply type-specific colors and a default icon matching the type (info, success, warning, error).
- Render a custom icon from the Icon slot when provided, replacing the default icon.
- Render an optional Title slot as a bold heading above the message.
- Render the Message slot content as the notification body; show a fallback warning text when the Message slot is absent.
- Render an optional Action slot as a clickable inline element and dispatch an action custom event (bubbling, composed) when it is clicked.
- Render a dismiss button when the dismissible property is true; clicking it sets visible to false and dispatches a dismiss custom event (bubbling, composed).
- Start an auto-dismiss timer when both visible is true and duration is greater than zero; cancel the timer when visible becomes false or duration changes to zero.
- Cancel the auto-dismiss timer when the component is disconnected from the DOM.
- Apply fixed-position placement classes derived from the position property (top-right, top-left, bottom-right, bottom-left, top, bottom); use relative positioning when position is empty.
- Set role="alert" and aria-live="assertive" for error type; set role="status" and aria-live="polite" for all other types.
- Support light and dark color schemes through conditional class application.

# Constraints
- The banner must render no DOM output while visible is false.
- The dismiss button must not appear unless dismissible is true.
- Auto-dismiss must not fire if visible has already been set to false before the timer expires.
- The component must not contain business logic; it only manages notification visibility and appearance.
- Slot content (Title, Message, Action, Icon) is rendered via unsafeHTML and must not be sanitized by this component.
- Only one auto-dismiss timer may be active at a time; a new timer must cancel the previous one.`;
