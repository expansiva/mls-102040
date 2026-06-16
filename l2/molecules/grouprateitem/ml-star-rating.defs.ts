/// <mls fileReference="_102040_/l2/molecules/grouprateitem/ml-star-rating.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupRateItem';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  rating: "stars"
};

export const skill = `# Metadata
- TagName: grouprateitem--ml-star-rating

# Objective
Provide a numeric rating selection mechanism that allows users to choose a value from 1 to 5. It serves corporate platforms such as training systems, internal product evaluation, supplier portals, and marketplaces. Typical uses include rating courses, suppliers, service interactions, and documents.

# Responsibilities
- Allow selection of a numeric rating from 1 through 5 when operating with default options
- Render exclusively custom items when provided, honoring their individual numeric values and supplied visual representations
- Display the provided label content in association with the rating field
- In edit mode, enable interaction where hovering over an option temporarily highlights that option and all preceding options
- Remove temporary highlight on mouse leave, restoring visual emphasis to the currently selected rating
- Update the current rating to the chosen numeric value upon selection and report the change to the system
- Report when the component receives or loses focus
- In view mode, present the selected rating as static content without permitting interaction, hover feedback, error indication, or helper text
- Show an em-dash symbol when no rating exists in view mode
- Present error messaging and assume an error appearance in edit mode when an error condition is active
- Present helper text in edit mode when no error condition exists and helper content is supplied
- Block all interaction and assume a disabled appearance when disabled
- Block value changes while preserving rating visibility when readonly
- Expose the current selection, required status, and error condition to assistive technologies in a meaningful way
- Permit navigation through options via keyboard and allow the focused option to be selected via keyboard action
- Treat absence of selection as unset rather than zero

# Constraints
- Must conform to the groupRateItem group contract for properties, events, and slot definitions
- Default rating scale is bounded to the defined minimum and maximum values
- Presence of custom item slots disables default option generation
- Hover and selection behaviors are suppressed while disabled or readonly
- Error and helper presentations are restricted to edit mode
- View mode hides interactive affordances and auxiliary text regardless of state
- A required field without a selection must trigger the defined error validation behavior
- Only numeric values are valid; unset represents no choice

# Notes
- Suitable for corporate training platforms, internal product reviews, supplier portals, and marketplace systems
- When custom items are used, their slot content defines the visual representation entirely`;

