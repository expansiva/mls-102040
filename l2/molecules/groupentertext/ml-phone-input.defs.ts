/// <mls fileReference="_102040_/l2/molecules/groupentertext/ml-phone-input.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterText';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  labelPlacement: "top"
};

export const skill = `# Metadata
- TagName: groupentertext--ml-phone-input

# Objective
Provide a Brazilian phone number entry field that formats numbers as they are entered, accepts supplementary content before and after the input area, and participates in standard form workflows.

# Responsibilities
- Display entered numbers in the Brazilian format "(XX) XXXXX-XXXX" while handling the underlying content as digits only.
- Communicate the digit-only content on every change and when editing is completed.
- Signal when the field loses focus, carrying the final digit-only content.
- Accommodate a prefix region for DDD or international country code selection, and a suffix region for additional actions.
- Show formatted text as read-only content when editing is disabled, displaying an em dash when empty.
- Present externally provided error messages below the field, and suppress any helper guidance while an error is shown.
- Limit entry to a configurable minimum and maximum number of digits, refusing characters beyond the maximum.
- Exhibit clear visual differences for normal, focused, filled, disabled, read-only, error, and loading states.
- Render appropriately in dark mode with matching visual treatments.

# Constraints
- Must operate within the groupEnterText boundaries without introducing new controls or signals.
- Must remain a single-line entry area.
- Must prevent user input during loading while keeping surrounding regions visible.
- Must remain silent and hide error or helper information when in view mode.
- Must depend on external sources to define validation failures.
- Must support configurable autocomplete assistance.
- Must respect required, disabled, and read-only rules as established by the group.

# Notes
- DDD lists and international country code selectors with flags are provided by the surrounding context into the prefix region; the field does not maintain these catalogs.
- Validation occurs outside the component; the field only displays the error state it is given.`;

