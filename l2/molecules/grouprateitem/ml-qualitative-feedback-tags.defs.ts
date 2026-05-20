/// <mls fileReference="_102040_/l2/molecules/grouprateitem/ml-qualitative-feedback-tags.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupRateItem';
export const skill = `# Metadata
- TagName: grouprateitem--ml-qualitative-feedback-tags

# Objective
Provide a qualitative feedback selection mechanism that allows users to choose predefined tags to explain their rating. It works alongside a numeric or emoji scale to contextualize the given score. Tags are configurable and support single selection only.

# Responsibilities
- Expose all properties defined by the groupRateItem contract: value, error, name, min, max, step, isEditing, disabled, readonly, and required.
- Accept feedback options through configurable items, each carrying a mandatory numeric identifier and a visual label.
- When custom options are provided, render exclusively those options and disregard any numeric range configuration.
- When no custom options are provided, automatically generate options across the configured numeric range using the defined increment.
- In editing mode, allow the user to select one option at a time, updating the current value and notifying the system of the change.
- In editing mode, notify the system when the component or its options receive or lose focus.
- In editing mode, update the preview state when the user points to an option, reverting when the pointer leaves.
- In viewing mode, display the currently selected value as static text; show an em dash when no value exists. Disable all interaction, hover effects, helper text, and error messaging.
- Prevent user interaction and value changes when disabled or readonly, and suppress change notifications.
- Present an error state when the field is required but no value is selected; display any provided error message.
- Expose the correct accessibility semantics for the container and each option, including selection status, requirement status, invalidity, and descriptive error references.
- Support keyboard navigation between options using horizontal arrow keys and selection using confirmation keys.
- Support only single selection at a time, where each new choice replaces the previous one.
- Allow visual labels to consist of text, emojis, or icons as provided by the item configuration.

# Constraints
- The component must render options in a single horizontal row.
- Custom options always take precedence over auto-generated numeric ranges.
- Only one option may be selected at any given moment.
- Interaction, hover effects, and informational messages must be completely suppressed in viewing mode.
- Disabled and readonly states must block all user-driven changes and events.
- Error messaging must appear below the options when applicable; helper text must appear only when no error is present.
- A label, when provided, must appear above the options.
- Visual states must distinguish clearly between normal, hovered, selected, disabled, readonly, and error conditions.
- The component must support both light and dark appearance modes through semantic color application.

# Notes
- The visual representation of each option is determined entirely by the provided item content, enabling flexible use of numbers, emojis, or textual tags.
- Although the original use case mentions multiple selection, this molecule adheres to the groupRateItem contract by enforcing single selection only.`;

