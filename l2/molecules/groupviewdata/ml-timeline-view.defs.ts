/// <mls fileReference="_102040_/l2/molecules/groupviewdata/ml-timeline-view.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewData';
export const skill = `# Metadata
- TagName: groupviewdata--ml-timeline-view

# Objective
Present events in chronological order along a timeline. The molecule must support vertical and horizontal reading flows, group events by date, handle item selection and hover, manage disabled items, and switch between loading, empty, and populated states using designated content regions.

# Responsibilities
- Display chronological events using a structure of rows and columns, where each row represents one event and cells supply content for each visible column.
- Automatically choose the layout orientation: horizontal when only one column is visible and multiple events are present; vertical in all other cases.
- Respect column order and visibility; exclude any column marked as hidden.
- Support full-width group headers that span all visible columns to separate event groups such as dates or categories.
- Allow selection of events when selection is enabled, toggling the selection state and reporting which events are selected.
- Notify when an interactive event is activated, providing its position and identity, regardless of selection mode.
- Prevent activation and selection on disabled events, and indicate the disabled condition.
- Identify which events are currently selected.
- Present a dedicated loading region when loading, hiding all events and signaling that the molecule is busy.
- Present a dedicated empty region when no events exist, centered within the available space.
- Enforce structural rules by requiring necessary column identifiers and headers.

# Constraints
- Group header rows must not respond to activation or participate in selection, even when selection mode is enabled.
- Only events that are not disabled may be activated or selected.
- Activating an event must always trigger a notification, independent of selection mode.
- In loading state, no timeline track, markers, or event content may appear; only the loading region may be visible.
- In empty state, only the empty region may be visible, centered within the molecule.
- In vertical layout, a continuous track must align with the marker column, each marker must be centered on the track, and event content must align consistently to the side of the track with uniform spacing between events.
- In horizontal layout, a continuous track must align with the markers, events must be distributed left to right in chronological order, each marker centered on the track, and content stacked above or below the marker according to column order.
- Group headers must visually interrupt the timeline track and appear distinct from regular events.
- Hover highlighting must apply only when hover interaction is enabled and must not appear on disabled events or group headers.
- Selected events must be highlighted using semantic accent colors for background, border, and text.
- Disabled events must appear at reduced opacity and must not display interactive visual cues.
- All background, text, border, and accent colors must provide a dark variant under the semantic color contract.

# Notes
- Event content supports free content within the cell structure.
- Marker appearance and color are defined per event through the content structure.
- Layout orientation is derived from the number of visible columns and the quantity of events, not by explicit configuration.`;

