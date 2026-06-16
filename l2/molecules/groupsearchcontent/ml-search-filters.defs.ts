/// <mls fileReference="_102040_/l2/molecules/groupsearchcontent/ml-search-filters.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSearchContent';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  search: "bar"
};

export const skill = `# Metadata
- TagName: groupsearchcontent--ml-search-filters

# Objective
Provide a search interface with a text field, an expandable panel of selectable options, and removable active selection chips. It allows users to search by typing, choose from available options, manage active selections, and communicate all changes to the surrounding system.

# Responsibilities
- Display a text input that reflects the user's current typing
- Communicate the current search text to the system after the user pauses typing for a configurable duration
- Confirm the typed text as the active selection and communicate it to the system when the user submits without choosing from the panel
- When the user picks an option from the panel, set it as the active selection, update the input to show the option's label, communicate the selection to the system, and close the panel
- Toggle the options panel open and closed via a dedicated control labeled "Filters"
- Present available options in the panel from the contract-defined suggestion content
- Show the designated empty content when no options are available
- Arrange elements vertically: label above, search field and filter control in a row, active chips below the field, and the options panel below the chips when open
- Display active selections as removable chips below the search bar
- Active chips must appear as pills showing the confirmed label with a visible removal control
- When a chip is removed, clear the active selection and input text, communicate the removal to the system, and communicate an empty selection
- Show the count of active selections on the "Filters" control
- Display a loading indicator in the panel while options are being fetched
- Each option in the panel must display hover styles and a visual selection state
- Notify the system when the input receives focus and when it loses focus
- Prevent all interaction when the component is disabled, including typing, toggling the panel, selecting options, and removing chips
- Show the contract-defined label above the input
- Show the contract-defined helper text below the component when provided and no error exists
- Show an error indicator with error text and a contrasting border on the input when an error is present

# Constraints
- Must exclusively use the contract content areas: Label, Helper, Suggestion, and Empty
- Search communications must contain only the current text being typed
- Selection change communications must contain the confirmed choice, which is empty when cleared
- Removal communications must only occur when the user dismisses an active chip
- The active selection count must read as zero when nothing is confirmed, and one when a selection exists
- The panel must only open or close via the "Filters" control, or close upon option selection
- All interactive elements must be inactive when the component is disabled
- Error display takes precedence over helper text display
- Visual presentation must adapt to both light and dark modes

# Notes
- The pause duration before communicating typing changes is configurable
- Available options are provided through the contract's Suggestion content area
- The panel should visually appear as an elevated surface with a border and overlay background`;

