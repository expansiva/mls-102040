/// <mls fileReference="_102040_/l2/molecules/groupshowprogress/ml-upload-progress-indicator.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupShowProgress';
export const skill = `# Metadata
- TagName: groupshowprogress--ml-upload-progress-indicator

# Objective
Provide a visual indicator that communicates the progress of an upload operation. The component reflects whether the progress is known, unknown, or finished, and optionally presents the percentage completed.

# Responsibilities
- Interpret the provided progress value as a percentage and constrain it to a 0–100 range when rendering
- Operate in an indeterminate state when no progress value is available, ignoring any request to show a numeric percentage
- Show partial progress proportional to the provided percentage when the value is between 0 and 99
- Display full progress without continuous motion when the operation is complete at 100 percent
- Present the percentage in a numeric format next to the indicator when percentage display is enabled and a valid number is present
- Use the provided label as the accessible name for the progress indicator
- Identify itself as a progress indicator to assistive technologies
- Communicate the current percentage and its bounds to assistive technologies when operating in determinate mode
- Withhold the specific current percentage from assistive technologies when operating in indeterminate mode
- Adapt its visual size based on the configured size variant
- Apply appropriate color variations for dark mode contexts, including background, text, border, and focus states

# Constraints
- Must not trigger or emit events, as the group contract defines none
- Must not display file names, file type icons, upload speed, cancel actions, or file links, as the group contract does not supply data or slots for these elements
- Must suppress percentage display while in indeterminate mode
- Must not show continuous animation when progress is complete
- Must reserve continuous animation for the indeterminate state only
- Must format the visible percentage as two digits followed by a percent symbol when displayed

# Notes
- Intended for use cases such as monitoring large file uploads in learning platforms where the user remains on the same screen during the operation`;

