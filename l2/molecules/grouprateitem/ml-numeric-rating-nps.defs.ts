/// <mls fileReference="_102040_/l2/molecules/grouprateitem/ml-numeric-rating-nps.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupRateItem';
export const skill = `# Metadata
- TagName: grouprateitem--ml-numeric-rating-nps

# Objective
A numeric rating selector that presents a scale of numbers for expressing satisfaction levels, commonly used for Net Promoter Score, customer satisfaction, and corporate evaluations. It allows choosing a value from a defined numeric range or from custom-provided options.

# Responsibilities
- Present options as a horizontal numeric scale.
- Render custom items exactly as provided through the Item content area when available, disregarding any configured numeric range.
- Automatically generate numeric options from a minimum to a maximum value using defined increments when no custom items are provided.
- Allow selection of a single numeric value and communicate changes to the system.
- Support clearing the selection to an empty state.
- Enable interaction with options in edit mode unless the component is disabled or readonly.
- In view mode, display the selected value as static text; when empty, show a placeholder dash and disable all interaction, hover effects, and supplementary text.
- Preview the hovered option distinctly and clear the preview when focus or pointer leaves.
- Keep the selected option visually distinct from unselected options.
- Display a label when content is provided.
- Display helper text beneath the options when no error is present.
- Display error messages beneath the options when validation fails, replacing helper text.
- Indicate invalid and required states when the field is mandatory and empty.
- Notify the system when an option gains or loses focus in edit mode.
- Adapt appearance for both light and dark presentation contexts.

# Constraints
- Must conform to the groupRateItem contract, using only the Label, Helper, and Item content areas.
- Must not permit interaction or hover effects in view mode.
- Must suppress helper text while an error message is shown in edit mode.
- Must highlight only the individual hovered option during preview, never a cumulative range.
- Must mute the appearance of disabled and readonly options and prevent active or hover styling on them.
- Must ignore configured range and step values when custom items are present.

# Notes
- Common scales include 0–10 for NPS and 1–5 for CSAT, though the range remains configurable.
- Designed for post-service feedback, training evaluations, vendor assessments, organizational climate surveys, and onboarding feedback.`;

