/// <mls fileReference="_102040_/l2/molecules/groupenterboolean/ml-checkbox-preference.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterBoolean';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  boolean: "checkbox",
  labelPlacement: "inline"
};

export const skill = `# Metadata
- TagName: groupenterboolean--ml-checkbox-preference

# Objective
Provide a boolean preference control that allows users to mark or unmark an option. It must support an interactive editing mode for changing the value and a read-only view mode for displaying the current state, while clearly communicating validation issues.

# Responsibilities
- Present an interactive toggle in editing mode that switches the value between true and false.
- Display static text "Yes" when the value is true and "No" when the value is false in view mode, without allowing interaction.
- Update the value and notify the system when the user activates the toggle in editing mode.
- Support keyboard activation to toggle the value when the control has focus in editing mode.
- Prevent user interaction and value changes when disabled.
- Display provided label content next to the control and associate it for accessibility.
- Show error messages and apply an error state when an error exists in editing mode.
- Show helper text below the control when no error is present and helper content is available in editing mode.
- Report when the control gains focus and when it loses focus, only in editing mode.
- Keep the visual checked appearance consistent with the current boolean value.

# Constraints
- Must conform to the groupEnterBoolean group behavior definitions.
- Must not allow interaction or value changes in view mode.
- Must not allow interaction or value changes when disabled.
- Must suppress change notifications in view mode and when disabled.
- Must prioritize error display over helper content in editing mode.
- Must present only static text without interactive elements when in view mode.
- Must provide equivalent visual treatments for light and dark modes, preserving contrast for all states including focus and error.

# Notes
- The editing layout should display the toggle indicator adjacent to the preference description, such as "[x] Utilizar biometria".
- Visual spacing between the toggle, label, and auxiliary text must remain clear and readable for preference lists.`;

