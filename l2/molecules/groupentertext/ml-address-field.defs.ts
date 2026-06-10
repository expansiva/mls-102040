/// <mls fileReference="_102040_/l2/molecules/groupentertext/ml-address-field.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterText';
export const skill = `# Metadata
- TagName: groupentertext--ml-address-field

# Objective
Provide a complete address entry interface that allows users to input a postal code and automatically retrieves corresponding address details from an external service. The molecule populates street, neighborhood, city, and state fields automatically while keeping them manually editable afterward. It includes fields for number and complement, validates the postal code before searching, and notifies the system when a complete address is confirmed.

# Responsibilities
- Display input fields for postal code, street, neighborhood, city, state, number, and complement.
- Accept user input in all fields and reflect changes immediately.
- When the postal code reaches its required valid length, automatically query an external address service.
- Populate street, neighborhood, city, and state fields with data returned from the service.
- Allow manual editing of any auto-populated field after the lookup completes.
- Prevent entry beyond the defined maximum length for any field.
- Render single-line inputs by default and multi-line inputs when configured; multi-line fields must not apply format patterns or input type restrictions.
- Display a character counter below multi-line fields when a maximum length is defined, updating as the user types.
- Present field values as static text without error messages or helper text when in view mode.
- Show an em dash when a view-mode field contains no value.
- Hide sensitive values behind a fixed bullet sequence in view mode when configured for secure content.
- Remain editable after external value updates unless the field is marked as read-only or disabled.
- Emit a notification containing the full address object when the address entry is confirmed.
- Emit a notification with the current field value on every user input.
- Emit a notification with the current value and a blur indication when a field loses focus.
- Emit a focus indication when a field gains focus.
- Present a visual error state only when an external error message is provided.
- Support visual error states for empty required fields when indicated externally.
- Block user interaction while remaining visible during loading states.
- Display a loading indicator during loading states.
- Show helper text below fields when no error exists and the field is in editing mode.
- Hide helper text and display error messages below fields when errors are present.
- Render prefix and suffix elements aligned horizontally with the input area.
- Provide distinct visual treatments for normal, focus, filled, disabled, read-only, error, loading, and view modes.
- Highlight field borders with focus colors when active.
- Use semantic error colors for borders and messages when an error is present.
- Reduce opacity and remove interaction affordances when disabled.
- Allow text selection without editing affordances when read-only.
- Support dark mode variants for all background, text, border, focus, hover, and placeholder colors.
- Announce character count changes politely to assistive technologies.
- Associate labels with inputs and link error messages and counters using assistive attributes.
- Mark fields as invalid and required for accessibility when applicable.

# Constraints
- The postal code must be validated for correct length before triggering any external lookup.
- The molecule must not generate its own error messages; all errors come from external sources.
- Format patterns must apply to visible text while the stored value contains only raw characters without literal pattern symbols.
- Multi-line fields must ignore format pattern and input type configurations.
- Loading states must prevent user interaction without hiding the component.
- Empty values must always be represented as empty strings.

# Notes
- The molecule adheres to the groupEnterText contract boundaries.
- The external address lookup occurs only when the postal code field is valid and complete.`;

