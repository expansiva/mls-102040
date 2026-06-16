/// <mls fileReference="_102040_/l2/molecules/groupviewdata/ml-vertical-record-list.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewData';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  recordsView: "list"
};

export const skill = `# Metadata
- TagName: groupviewdata--ml-vertical-record-list

# Objective
Display a vertical list of records within the groupViewData context. Each record supports multiple content regions such as visual identifiers, titles, descriptions, metadata, and actions. The molecule manages loading states, empty collections, item selection, and user interaction events.

# Responsibilities
- Display a collection of items in vertical sequence, preserving the provided order.
- Support multiple content regions within each item, arranged horizontally from start to end.
- Validate that column definitions are provided; surface validation errors when column definitions are missing.
- When loading, display loading content and hide the item list.
- When no items exist, display empty state content.
- Allow toggling selection of individual items when selection is enabled, and communicate the set of selected item indices whenever selection changes.
- Communicate which item was activated when a user selects or activates an item.
- Ignore interactions, prevent selection changes, and suppress activation communication for disabled items.
- Recognize pre-selected items upon initial display and include them in subsequent selection state updates.
- Apply a hover visual state to items when hover interaction is enabled; provide no hover effect when hover interaction is disabled.
- Indicate a busy state while loading, mark selected items as selected, and mark disabled items as disabled for accessibility purposes.

# Constraints
- Items must be presented as a vertical list without table header styling.
- Adjacent items must be separated by a visual divider spanning the full width, except after the last item.
- Selected items must use a distinct visual state consistent with the selected state definition.
- Disabled items must appear visually inactive.
- Empty state content must be centered or visually isolated within the list container.
- Loading content must fill the list area and align with the item layout to maintain visual continuity.
- All color and surface styling must include dark mode equivalents using semantic pairings for surfaces, borders, text, hover, and selection states.

# Notes
- Intended for corporate use cases including activity feeds, team directories, ticket queues, financial transaction lists, and task boards.
- Item content is expected to accommodate patterns such as avatars, title and subtitle blocks, meta information, and action controls.`;

