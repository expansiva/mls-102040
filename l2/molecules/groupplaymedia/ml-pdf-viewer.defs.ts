/// <mls fileReference="_102040_/l2/molecules/groupplaymedia/ml-pdf-viewer.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupPlayMedia';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {};

export const skill = `# Metadata
- TagName: groupplaymedia--ml-pdf-viewer

# Objective
An embedded document viewer that presents paginated content from a source URL, allowing users to navigate between pages, adjust the viewing scale, and track their position within the document.

# Responsibilities
- Accept content exclusively through the Label, Source, and Track slots defined by the groupPlayMedia contract
- Treat each Source slot as a potential document source using its source address; adopt the first valid Source as the active document
- Enter an Error state and dispatch an error event if no Source is provided or if none contain a valid source address
- Use the Label slot content as the accessible label and display it as a visible title or description alongside the viewer
- Render the document page by page, maintaining the current page index and the total page count
- Provide controls to navigate to the previous page, the next page, and to jump directly to a specific page within the total
- Provide controls to increase viewing scale, decrease viewing scale, and toggle a fit-to-width mode
- Enter a Buffering state when the loading property is true, display a loading indicator, and disable navigation and scale controls
- Enter a Disabled state when the disabled property is true, render all controls non-interactive and visually inactive, and block all navigation and scale actions
- Dispatch a timeUpdate event on every page change, indicating the current page number and the total page count
- Dispatch a play event when increasing the viewing scale and a pause event when decreasing the viewing scale
- Dispatch an ended event when toggling the fit-to-width mode
- Dispatch an error event and hide all controls if the document fails to load or render
- Respond to keyboard inputs: left and right directional inputs navigate pages, up and down directional inputs adjust scale, and space toggles between scale increase and decrease
- Present the progress control as a slider that communicates the current page position and the total number of pages

# Constraints
- Navigation must be constrained to the bounds of the document; previous page is unavailable at the first page and next page is unavailable at the last page
- Controls must remain inactive and non-interactive while loading or disabled
- All controls must be hidden when the Error state is active
- Page position and total count must remain accurate and synchronized with the displayed content
- Event notifications must only dispatch in response to their corresponding user actions or state changes
- The viewer must not process navigation or scale actions when loading or disabled

# Notes
- Page navigation and viewing scale are independent behaviors
- The progress slider represents discrete page positions across the document sequence
- Fit-to-width is a distinct viewing mode separate from incremental scale adjustments`;

