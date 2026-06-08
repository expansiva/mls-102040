/// <mls fileReference="_102040_/l2/molecules/grouplocateposition/ml-locate-map-picker.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupLocatePosition';
export const skill = `# Metadata
- TagName: grouplocateposition--ml-locate-map-picker

# Objective
A location selection interface that combines map visualization with search and geolocation capabilities. It enables users to identify, adjust, and confirm geographic coordinates either by searching for a place, dragging a map marker, or using their current position.

# Responsibilities
- Accept and maintain location value as a coordinate string or null
- Display a search field with a suggestion panel when in editing mode
- Show a map with a position marker when map display is enabled
- Allow the marker to be dragged to update coordinates during active editing
- Emit change events containing the coordinate value when selection occurs
- Emit search events to request external address resolution when coordinates change
- Provide a control to capture the user's current geographic position when allowed
- Render selectable suggestion items with labels and coordinate values
- Present an empty state when no suggestions are available
- Display labels, helper text, and error messages according to the current state
- Support a view-only mode that shows static location text and a non-interactive map
- Indicate loading state and disable interactions during processing
- Track and emit focus and blur events on the search field
- Apply distinct visual treatments for disabled, readonly, error, and focused states

# Constraints
- Must reject or ignore JSON object formats for value, accepting only coordinate strings or null
- Must prevent marker dragging when the component is readonly, disabled, or not in editing mode
- Must close the suggestion panel immediately upon selecting an item
- Must block all user interactions when disabled, including search, suggestions, geolocation, and map manipulation
- Must suppress search event emissions and hide helper and error text in view mode
- Must enter error state only when required is true and value is null
- Must interpret labels, helpers, triggers, suggestions, items, and empty states strictly according to the group contract without introducing new elements or properties
- Must support both light and dark presentation modes

# Notes
- Coordinate updates from map dragging should emit both change and search events to enable parent-level address lookup
- The search event acts as a request for external address resolution rather than performing internal geocoding`;

