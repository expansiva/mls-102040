/// <mls fileReference="_102040_/l2/molecules/grouplocateposition/ml-geolocation-trigger.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupLocatePosition';
export const skill = `# Metadata
- TagName: grouplocateposition--ml-geolocation-trigger

# Objective
Capture the device's current geographic position for the groupLocatePosition group. Provide a trigger control that requests a single position reading, presents the result as a coordinate pair, supports suggestion selection, and displays a map preview when configured. Operate in editing and viewing modes while respecting all group contract parameters.

# Responsibilities
- Render distinct regions for label, helper text, trigger action, suggestions list, individual suggestion items, and empty state messaging
- Honor the group contract parameters: value, error, name, placeholder, showMap, allowGeolocation, isEditing, disabled, readonly, required, and loading
- When geolocation is allowed and the molecule is in editing mode, activating the trigger requests the device's current geographic position
- While awaiting a position reading, enter a loading state and block additional position requests
- Upon successful capture, update the value to a comma-separated latitude and longitude pair and notify that the value changed, including the new coordinate pair
- Upon successful capture, also notify a search request using the coordinate pair so the surrounding page can resolve and populate suggestions
- If capture fails, exit the loading state, preserve the existing value, and notify the failure with a code and message
- Perform only a single position request per activation; do not support continuous tracking
- When disabled, prevent all user interactions including position requests and suggestion selection
- When readonly, prevent editing while preserving the ability to select and read text
- In view mode, display the resolved address or raw coordinates for the current value; do not show input controls, suggestion panels, or issue search requests
- In view mode, if no value exists, display empty state content or a default placeholder indicator
- Present suggestion items when available; each item must hold a coordinate value and be selectable
- Selecting a suggestion item updates the value, notifies the change, closes the suggestions, and sets the search text to the selected item's label
- When no suggestions are available, display empty state content or a default no-results message
- When required and no value is set, display an error visual state until a location is chosen
- Notify when the field receives and loses focus according to the group contract
- Use the error state to display error messaging below the field; suppress error messaging in view mode

# Constraints
- The value must always be represented as a comma-separated latitude and longitude pair when set
- Error messages must never appear in view mode
- Helper text must be hidden when an error message is present
- The suggestions panel must only appear when editing and actively open
- Selected suggestion items must be visually distinguishable from unselected items
- The loading state must visually disable the trigger and suggestion interactions
- The error state must apply visual styling to the interactive field and show error text below it
- Disabled state must reduce visual opacity and indicate non-interactive behavior
- Readonly state must appear non-editable while maintaining readable text contrast
- All visual colors must include dark mode variants using semantic pairings
- If map display is enabled and a valid value exists, show a map preview with a location indicator in both edit and view modes

# Notes
- The trigger region supplies the primary action control and must contain any icon or label required by the use case
- Intended for corporate scenarios including field service, logistics, mobile human resources, asset security, and delivery fleet management`;

