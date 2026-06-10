/// <mls fileReference="_102040_/l2/molecules/groupentertext/ml-password-strength-input.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterText';
export const skill = `# Metadata
- TagName: groupentertext--ml-password-strength-input

# Objective
Provide a password entry field that allows switching between hidden and visible text, combined with a real-time strength indicator based on configurable validation criteria. It operates within the groupEnterText contract.

# Responsibilities
- Present a password entry field during editing when configured for a single row.
- Offer a control to alternate between masked and plain text visibility during editing, without changing the stored value.
- Show a static placeholder for empty values and a masked representation for filled values when not in editing mode, while hiding all editing controls, strength indicators, and helper or error information.
- Assess password strength using configurable criteria: minimum length (when specified), uppercase letters, numbers, and symbols.
- Consider the length requirement satisfied when no minimum length is configured.
- Classify strength into four levels based on how many criteria are met: zero to one as weak, two as medium, three as strong, and four as very strong.
- Refresh the strength bar and criteria checklist immediately upon any change to the entered value.
- Honor configured input masking for display while basing strength calculations on the underlying unmasked value.
- Refuse input beyond a configured maximum length; show a character counter when multiple rows are allowed together with a maximum length limit.
- Disable editing and prevent interaction with the visibility control when the field is marked as disabled, read-only, or loading.
- Notify changes only through the contract-specified interactions (input, change, blur, focus), providing the current value.
- Position label content above the field when supplied.
- Position prefix content before the entry area and suffix content after it; the visibility control must coexist with suffix content.
- Place the strength indicator below the entry area and above any helper or error message during editing.
- Display a horizontal strength bar and adjacent text label that correspond to the current strength level.
- Present each validation criterion beneath the strength bar with a visual marker indicating whether it is met.
- Apply distinct visual treatments to distinguish satisfied criteria from unsatisfied ones.
- Present error indicators and messaging when validation fails, while maintaining the strength indicator visible during editing.
- Reduce opacity and remove interactive capabilities from the entire field set when disabled.
- Allow text selection but block visibility toggle interaction when read-only.
- Present a loading state that blocks entry and conceals the strength indicator.
- Adapt all semantic colors for dark appearance, including backgrounds, borders, text, errors, and accents.

# Constraints
- Must only use the contract-defined content areas: Label, Helper, Prefix, and Suffix.
- The visibility control must only appear when editing a single-row password field.
- Strength evaluation must always reference the underlying value, never a masked representation.
- No interactions other than those defined in the contract may be used to communicate changes.
- When not in editing mode, no entry field, visibility control, strength indicator, helper text, or error message may appear.
- The visibility control must not displace or suppress suffix content.
- During loading, the strength indicator must remain hidden.

# Notes
- Strength assessment reflects the current state continuously as the user enters text.
- Masking and character counting behaviors adhere to the groupEnterText contract.`;

