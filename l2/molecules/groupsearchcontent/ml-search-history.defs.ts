/// <mls fileReference="_102040_/l2/molecules/groupsearchcontent/ml-search-history.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSearchContent';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  search: "bar-with-history"
};

export const skill = `# Metadata
- TagName: groupsearchcontent--ml-search-history

# Objective
Provide a search input that reveals a dropdown panel of recent and saved searches when focused and empty, and switches to live search suggestions as the user types. Users may select a suggestion or confirm their query to set the field value, with support for loading states, clearing, and disabled states.

# Responsibilities
- Display a search input accompanied by label content above it and helper content below it.
- When the input is focused and contains no text, open a panel below the input showing grouped recent searches and saved searches.
- As the user types, update the visible query and transition the panel to show live result suggestions.
- Notify the host of the current query after the user pauses typing for the configured debounce duration.
- When the user selects a suggestion, populate the input with the suggestion's value and label, notify the host that the value has changed, and close the panel.
- When the user presses Enter without selecting a suggestion, confirm the current query as the input value, notify the host of the change, and close the panel.
- When the user clears the input, reset the value and query, notify the host of the clear action, and restore the recent/saved searches panel if the input remains focused.
- Show a loading indicator inside the suggestions panel while results are being fetched, keeping the panel open.
- Prevent focus, typing, selection, and all host notifications when the component is in a disabled state.
- Notify the host when the input gains or loses focus.
- Allow navigation through suggestions using arrow keys, confirmation with Enter, and panel closure with Escape.
- Show empty-state content when no suggestions are available for the current query state.
- Ensure the input is described by its label and any provided error message for accessibility purposes.
- Accept recent searches and saved searches as two distinct groups of suggestion items without requiring separate configuration for each group.

# Constraints
- The suggestions panel must only open when the input is focused.
- The panel must close after a selection or Enter confirmation and remain closed until the input is refocused.
- Query notifications to the host must not occur during active typing; they must only happen after the debounce pause.
- The input must be empty to show recent and saved searches; any non-empty query must show live result suggestions.
- No suggestions may be selected, typed, or notified while disabled.
- Keyboard navigation must not move focus away from the input.
- Error indicators must only appear when an error is explicitly provided.

# Notes
- Recent searches and saved searches are provided as two distinct groups of suggestion items.
- The debounce duration determines how long the user must pause typing before the host is notified.`;

