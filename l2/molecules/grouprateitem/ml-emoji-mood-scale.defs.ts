/// <mls fileReference="_102040_/l2/molecules/grouprateitem/ml-emoji-mood-scale.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupRateItem';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  rating: "emoji"
};

export const skill = `# Metadata
- TagName: grouprateitem--ml-emoji-mood-scale

# Objective
Provide a visual mood scale using expressive emoji faces to capture user sentiment quickly. It allows selecting a satisfaction level from very unsatisfied to very satisfied using custom-defined options within the groupRateItem contract.

# Responsibilities
- Behave as a member of the groupRateItem group, respecting all contract properties, events, states, and validation rules.
- Accept rating options exclusively through declared item slots with numeric values; when items are declared, automatic range generation must be ignored.
- Render five mood options arranged horizontally from very unsatisfied to very satisfied, using the visual content provided for each slot.
- In editing mode, enable selection of a single option and signal when the value changes.
- In viewing mode, render only the selected option statically; display a placeholder when no value is present.
- Visually highlight the option under pointer focus; remove the highlight when the pointer leaves.
- Update the current value and signal change when the user selects an option.
- Signal when an option receives focus and when it loses focus.
- Present an error state when required and no value is selected.
- Display an error message when one is provided; if no error exists, display helper text when available.
- Block interaction and show disabled visuals when disabled; block interaction while preserving selection visuals when read-only.
- Allow navigation between options and selection of the focused option using keyboard input.
- Communicate selection state, required status, and validity to assistive technologies; ensure labels and error messages are programmatically associated with the control group.

# Constraints
- Must define exactly five mood options through item slots.
- Must not use automatic range values when custom items are declared.
- Must remain non-interactive in view mode, when disabled, or when read-only.
- Must clear pointer highlight when the cursor exits the component.
- Must only signal change in response to user action.
- Error messages take precedence over helper text.
- Must adapt visual presentation for both light and dark modes.

# Notes
- The visual representation of each option is determined entirely by the content supplied in its item slot.`;

