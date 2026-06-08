/// <mls fileReference="_102040_/l2/molecules/groupviewcard/ml-view-card-media.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupViewCard';
export const skill = `# Metadata
- TagName: groupviewcard--ml-view-card-media

# Objective
Display a card with featured media at the top, followed by a structured header, content, footer, and actions. It serves corporate scenarios such as courses, products, properties, job postings, and news through composable content sections.

# Responsibilities
- Present a media area at the top using the CardHeader section, occupying the full width without side padding.
- Present CardTitle and CardDescription as the text header directly below the media area.
- Present CardContent, CardFooter, and CardAction below the header when provided.
- Allow the media aspect ratio to be configured on the CardHeader section with supported values of 16:9, 4:3, and 1:1, falling back to 16:9 when unspecified.
- Center and crop media content to fill the configured aspect ratio area.
- Show a neutral placeholder occupying the media space when media is missing or fails to load.
- When set as clickable, make the entire card interactive, focusable, and announceable as a button; activation via pointer, Enter, or Space must trigger a cardClick notification with empty detail.
- Provide a hover indication only when the card is clickable.
- Apply a selected visual state and communicate the selected condition to accessibility tools when the selected state is active.
- Apply a disabled visual state, prevent interaction, suppress cardClick notifications, and communicate the disabled condition to accessibility tools when the disabled state is active.
- Replace all content with skeleton placeholders matching the media and text areas when in the loading state.
- Forward the editing state to child elements according to the groupViewCard contract.
- Support all corporate use cases exclusively through composition of the standard sections, without introducing extra dedicated properties.

# Constraints
- Must only use the groupViewCard contract sections: CardHeader, CardTitle, CardDescription, CardContent, CardFooter, and CardAction.
- The media area must span the full top width and must not have lateral padding.
- Only 16:9, 4:3, and 1:1 are valid media aspect ratios.
- Media must remain centered and cropped to fill the ratio area without altering the card dimensions.
- Clickable cards must be keyboard-operable and must expose button semantics to assistive technologies.
- Disabled cards must not respond to activation and must not emit cardClick notifications.
- Loading state must hide all actual content and media until deactivated.
- The unavailable media placeholder must match the dimensions of the intended media area.
- Interactive states must behave consistently: disabled takes precedence over clickable interaction, and loading suppresses all other states.
- Child elements must receive the editing state through the standard group mechanism.

# Notes
- The CardHeader section carries the featured media content rather than a conventional textual header.
- Corporate use cases are achieved by what content is placed into each section, not by variant-specific properties.`;

