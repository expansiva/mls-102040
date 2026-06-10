/// <mls fileReference="_102040_/l2/molecules/grouplocateposition/ml-locate-nearby.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupLocatePosition';
export const skill = `# Metadata
- TagName: grouplocateposition--ml-locate-nearby

# Objective
Allow users to find and select nearby locations centered on a specific coordinate. The molecule supports searching for places, selecting from suggestions, viewing the selected location, and optionally using the device's geolocation to set the center point. It can also display a map preview of the selected coordinate.

# Responsibilities
- Accept a central coordinate value or no coordinate.
- Offer a geolocation option when enabled, which obtains the user's current position and sets it as the central coordinate.
- Display a search field during editing that lets users type to find nearby locations.
- Show available nearby locations as selectable suggestions, each identified by a coordinate.
- Update the selected value when the user clicks a suggestion.
- Show an empty state when no suggestions are available.
- During viewing, display the label of the selected location if it matches a known suggestion; otherwise show the raw coordinate or an empty state.
- Hide the suggestions panel and disable search emission during viewing.
- Block selection changes when disabled or readonly.
- Show error messages and error styling during editing when an error exists; otherwise show helper text if provided.
- Open and close the suggestions panel based on user focus and interaction during editing.
- Show a map with a location pin when map display is enabled and a valid coordinate is selected.

# Constraints
- Must use the groupLocatePosition contract slots: Label, Helper, Trigger, Suggestions, Item, and Empty.
- Must not accept nearby locations as a structured data array; locations must be provided as Item elements inside the Suggestions slot.
- Must emit a change event when the central coordinate changes through geolocation or when a suggestion is selected.
- Must emit a search event with the coordinate when geolocation succeeds, allowing the page to resolve location labels.
- Must emit a search event only when the user types in the search field during editing.
- Must not render the suggestions panel during view mode.
- Must not emit change events from user interaction when disabled or readonly.
- Sorting and filtering of suggestions must be handled externally by the order and presence of provided Item elements.
- Must support the visual states defined by the contract: normal, focused, open, disabled, readonly, error, and loading.
- Must provide dark mode variants for all colors including backgrounds, text, borders, focus indicators, and hover states.

# Notes
- The page is responsible for calculating distances, ordering results, and filtering categories by providing Item elements in the desired sequence.
- The content of each suggestion, including name, address, distance, and category icon, is defined entirely by the page through the Item slot content.`;

