/// <mls fileReference="_102040_/l2/molecules/groupsearchcontent/ml-search-bar.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSearchContent';
export const skill = `# Metadata
- TagName: groupsearchcontent--ml-search-bar

# Objective
Provide a search field that accepts text entry, presents inline suggestions, allows clearing the entry, and communicates loading and empty states. It confirms user selections and notifies when text changes, selections are made, or the field is cleared.

# Responsibilities
- Use Label, Helper, Suggestion, and Empty content areas as defined by the groupSearchContent contract.
- Display a search field with a leading magnifying glass icon.
- Provide a clear action that appears when text is present and the field is active.
- Update the current search text as the user types, wait for a brief pause, then notify that a search should be performed with the current text.
- Confirm the current text as the chosen value when the user submits, and notify that the value has changed.
- When a suggestion is chosen, set the chosen value to that suggestion's value, update the displayed text to match the suggestion's label, and notify that the value has changed.
- When cleared, remove all text, reset the chosen value, and notify that the field has been cleared.
- Present a loading indicator within the suggestions area when loading is active, while still allowing text entry unless the field is inactive.
- Show empty-state content as a no-results message when no suggestions are available and loading is not active.
- Open the suggestions area when the user is typing or when suggestions exist.
- Notify when the input receives focus and when it loses focus.
- When inactive, prevent interaction with the input and clear action, and suppress search, change, and clear notifications.
- Expose accessibility semantics so assistive technologies recognize the input controls a list of options, know whether the list is shown, and understand that autocomplete offers choices from that list.
- Identify the suggestions container and each item within it with appropriate accessibility roles, indicating which item is selected or highlighted.
- When an error is present, mark the input as invalid and link the error message as its description.

# Constraints
- The clear action must only appear when text is present and the field is active.
- Label content must appear above the input when provided.
- Helper content must appear below the input when provided and no error is present.
- An error message must appear below the input when present, and must take precedence over helper content.
- The suggestions area must appear inline below the input without complex dropdown behavior.
- The inactive state must appear visually dimmed and must suppress hover or focus styling on interactive elements.
- The error state must apply an error appearance to the input border and error text color, with appropriate dark-mode presentation.
- The field must not perform search notifications while inactive.
- The field must not perform change or clear notifications while inactive.

# Notes
- Suggestions are rendered inline and require only simple panel behavior.`;

