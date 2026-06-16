/// <mls fileReference="_102040_/l2/molecules/groupsearchcontent/ml-faceted-search.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSearchContent';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  search: "bar"
};

export const skill = `# Metadata
- TagName: groupsearchcontent--ml-faceted-search

# Objective
A faceted search component that presents filter options grouped by facets, allows searching within facet options, displays selected filters as breadcrumbs above the search field, and communicates user selections to the containing page through events.

# Responsibilities
- Use only the group slot tags: Label, Helper, Suggestion, and Empty.
- Render the Label slot content above the search field to display breadcrumbs of selected filters provided by the page.
- Represent each facet option through a Suggestion slot, where the slot's value attribute carries the selection value and the slot content carries the display text including result counts.
- Update the search query as the user types and emit a search event carrying the current query after a configured debounce period.
- Upon selecting a suggestion, set the component value to the suggestion's value, update the query to the suggestion's label, emit a change event with the selected value, and close the suggestions panel.
- Upon pressing Enter without an active suggestion selection, confirm the raw query text as the value and emit a change event with that value.
- Upon clearing the field, reset the value to null, clear the query, and emit a clear event.
- Emit a focus event when the search field gains focus and a blur event when it loses focus.
- Block user interaction and suppress change and search events when the component is disabled.
- Keep the suggestions panel open and indicate a loading state while loading is active.
- Render the Empty slot content inside the suggestions panel when no options are available.
- Support keyboard navigation to move through suggestions, confirm a selection, and close the panel.
- Expose selected facet filters through the change event value for the page to interpret, since the component exposes only a single value.
- Communicate the panel's open or closed state, the list structure, and the highlighted option to assistive technologies.
- Indicate an invalid state and link the field to its error description when an error is present.

# Constraints
- Must not use slot tags outside the defined group set: Label, Helper, Suggestion, and Empty.
- The page is responsible for providing breadcrumb content via the Label slot; the component only renders it in the designated position.
- Debounce timing must be configurable but always applied before emitting search events.
- The change event must always carry the current value, whether from suggestion selection or free-text confirmation.
- When disabled, the component must block interaction and must not emit change or search events.
- The suggestions panel must remain open during loading even if the option list is empty.
- Keyboard navigation must allow traversal of available suggestions without losing focus.
- The value emitted in change represents the serialized or structured filter state for all facets, managed by the consuming page.
- An error state must only trigger invalid marking and error association when the error value is non-empty.

# Notes
- The component acts as a controlled input where the page manages the meaning of value across multiple facets.
- The count displayed with each option is part of the provided Suggestion content and is not computed or altered by the component.
- Selected filters are visually represented through the Label slot content, not maintained as internal component state.`;

