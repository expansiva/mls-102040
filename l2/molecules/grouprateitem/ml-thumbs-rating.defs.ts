/// <mls fileReference="_102040_/l2/molecules/grouprateitem/ml-thumbs-rating.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupRateItem';
export const skill = `# Metadata
- TagName: grouprateitem--ml-thumbs-rating

# Objective
A binary rating molecule that allows users to choose between two opposing options, typically represented as positive and negative ratings. It follows the groupRateItem contract to provide a compact horizontal choice control that supports editing, viewing, and accessibility needs.

# Responsibilities
- Present exactly two selectable options defined by provided content items, each associated with a numeric rating value, arranged horizontally in a compact row.
- Disregard minimum, maximum, and step settings when content items are present.
- Display label content above the option row when provided.
- In editing state: set the rating value when an option is chosen and announce the change.
- In editing state: temporarily highlight an option while it is being hovered, and remove the highlight when hover ends.
- In viewing state: show the chosen rating as a static display; show an empty indicator when no rating exists; prevent all interaction and change announcements.
- Announce focus and blur interactions only during editing state.
- Allow keyboard movement between options and confirmation of a selection using standard navigation keys, restricted to editing state.
- Visually indicate and block interaction when disabled.
- Visually indicate non-editable status while keeping the current selection visible when readonly.
- Signal an invalid state to assistive technologies when a value is required but missing during editing.
- Display an error message below the options when an error is provided during editing; display helper content instead when no error exists and helper content is available.
- Conceal helper and error messages in viewing state.
- Expose the container as a grouped set of selectable choices and each option as an individual choice with its selection state available to assistive technologies.

# Constraints
- Must always present exactly two options.
- Must adhere strictly to the groupRateItem contract without adding new properties or behaviors.
- Must not display scale boundaries or stepped values.
- Must not permit value changes in viewing state, disabled state, or readonly state.
- Must not show hover highlights, change announcements, or focus/blur communications in viewing state.
- Must not display helper or error text in viewing state.
- Must apply error visual treatment when required and unselected during editing, or when an explicit error is present.
- Highlighting must affect only the specific hovered or selected option, never both options together as a range.
- Must support rich text content within option labels.

# Notes
- The two options are typically visualized as opposing icons or labels such as thumbs up and thumbs down.
- Dark mode color schemes must be respected for all visual states including default, hover, selected, error, disabled, and readonly.`;

