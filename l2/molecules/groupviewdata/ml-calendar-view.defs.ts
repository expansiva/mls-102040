/// <mls fileReference="_102040_/l2/molecules/groupviewdata/ml-calendar-view.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewData';
export const skill = `# Metadata
- TagName: groupviewdata--ml-calendar-view

# Objective
A calendar visualization that allows users to browse events in monthly or weekly layouts. It organizes time into columns, rows, and cells, enabling users to view event details or initiate new events by selecting time slots.

# Responsibilities
- Provide a visible control to switch between monthly and weekly viewing modes.
- In monthly mode, display weeks as rows and days as cells. Each day shows event chips with titles that truncate when too long. When a day contains more events than fit, show an indicator with the count of additional items.
- In weekly mode, display days as columns and hours as rows. Events appear inside the cells that match their scheduled day and time.
- Allow consumers to supply events into the corresponding time cells using the standard group view data structure.
- When a user selects an existing event, communicate the selection including the event data and its row position.
- When a user selects an empty day or hour slot, communicate the selection including the cell and row data so the consumer can start creating an event.
- Show a loading state when data is unavailable, replacing the calendar grid entirely.
- Show an empty state when no time rows exist to display.
- Apply hover styling to rows when hover interaction is enabled.
- Apply selected styling and mark the row as selected when a row carries the selected state.
- Apply disabled styling, prevent interaction, and mark the row as disabled when a row carries the disabled state.
- Indicate busy state to assistive technologies while loading.

# Constraints
- Event titles must never overflow their chip container; they must truncate with a clear visual indication.
- The overflow count indicator must be accurate and visible only when events exceed the cell's display limit.
- The calendar grid must align headers, columns, and rows consistently across both viewing modes.
- Loading and empty states must replace the grid completely rather than appearing alongside it.
- A disabled row must not respond to clicks, focus, or other interactions.
- Selected and disabled visual states must not appear together; disabled state must take precedence.
- The view mode toggle must remain accessible and functional at all times.
- Visual styles must adapt to dark mode using equivalent color mappings for surfaces, borders, text, and state indicators.

# Notes
- The molecule follows the groupViewData contract, using Columns, Column, Rows, Row, Cell, Empty, and Loading containers to structure content.
- Consumer-provided events are placed within cells without adding new properties to the base data contract.
- Interactions on both event chips and empty cells share the same selection channel, distinguished by whether event data is present.`;

