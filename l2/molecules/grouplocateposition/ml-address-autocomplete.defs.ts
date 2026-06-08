/// <mls fileReference="_102040_/l2/molecules/grouplocateposition/ml-address-autocomplete.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupLocatePosition';
export const skill = `# Metadata
- TagName: grouplocateposition--ml-address-autocomplete

# Objective
An address input field that suggests locations as the user types, allowing selection of a geographic position represented by coordinates. It relies on external sources to provide address suggestions and translates user selections into a definitive location value.

# Responsibilities
- Accept supplementary content such as labels, helper text, trigger controls, suggestion items, and empty state messages from external sources
- Accept user text input and request external address suggestions after typing pauses
- Present externally provided address suggestions, each associated with a geographic coordinate and a human-readable label
- Update the selected value to the coordinate of the chosen address upon selection
- Display the human-readable label of the selected address in the input field after selection
- Clear the selected value and notify the system when the user removes all search text
- Indicate when suggestions are being loaded and prevent selection during this period
- Validate that a value is present when required and signal an error state if missing during editing
- Display the selected address as static text when not in editing mode, showing the human-readable label when available or falling back to coordinates or an empty state
- Offer a way to capture the current geographic position when enabled, updating the selected value accordingly
- Signal when the field gains or loses focus
- Respect disabled and read-only states by blocking edits and selections while maintaining coherent visual presentation
- Display a map preview of the selected location when enabled and a valid position exists
- Communicate all state changes and selections to the containing system

# Constraints
- Must not store or manage its own suggestion list; suggestions must come from external sources
- Must only request suggestions after the user pauses typing, not continuously
- Must close suggestions upon selection and show the selected address label
- Must reset the value to empty and notify the system when search text is cleared
- Must remain visually inactive and non-interactive during loading states
- Must not display error states when in view mode
- Must not request suggestions or allow editing when in view mode
- Must not display a map preview when no valid position is selected
- Must block all editing and selection interactions when disabled or read-only
- Must expose its expanded state, selected option, invalid state, required status, and descriptive labels to assistive technologies
- Must support both light and dark presentation modes

# Notes
- The geographic value is represented as a coordinate pair (latitude and longitude)
- Address labels and coordinates are provided together for each suggestion
- Corporate applications include delivery address entry, employee residential registration, logistics waypoint definition, prospect headquarters logging, and field service dispatch location selection`;

