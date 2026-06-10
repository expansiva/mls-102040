/// <mls fileReference="_102040_/l2/molecules/groupplaymedia/ml-image-gallery.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupPlayMedia';
export const skill = `# Metadata
- TagName: groupplaymedia--ml-image-gallery

# Objective
An image gallery that presents a sequence of images through a main viewing area, a thumbnail strip, and an expanded overlay view. It supports directional navigation, keyboard control, and communicates state changes through the groupPlayMedia contract.

# Responsibilities
- Render each gallery image from an ordered set of source slots.
- Accept optional track slots associated by index to each source, using the track label as the image caption and alternative text.
- Display the currently selected image in the main viewing area.
- Present thumbnails in a horizontal strip below the main image, with the active thumbnail visually distinguished.
- Provide previous and next controls to move through the image sequence.
- Disable the previous control at the first image and the next control at the last image.
- Update the main image immediately when a thumbnail is selected.
- Notify with the current index and total image count whenever the active image changes.
- Support keyboard navigation with left and right arrow keys when the component has focus.
- Open an expanded lightbox view when the main image is activated.
- Close the expanded view when activated again or when the space key is pressed.
- Signal start of expanded view when opening and end of expanded view when closing.
- Report a descriptive failure when no image sources are provided.
- Use the label slot content as the component's accessible label.
- Block all interactions when disabled.
- Show a loading indicator over the main area and block interactions when loading.
- Hide controls and thumbnails and display only an error message when in error.

# Constraints
- The main image must always match the currently selected source.
- Thumbnail interaction must immediately update the selection.
- Navigation controls must not loop; boundaries must disable the relevant control.
- Keyboard navigation must only respond while the component is focused.
- The expanded view must display a dark overlay covering the component and center the enlarged image.
- Captions must appear below the main image.
- The label content must appear near the top as a title or description.
- In disabled state, controls and thumbnails must appear visually inactive.
- In loading state, the indicator must appear over the main image area.
- In error state, the message must use error styling and occupy the main gallery area.
- All colors must have semantic light and dark mode variations.

# Notes
- Track slots are optional and linked to sources by position.
- The component adheres to the groupPlayMedia contract for slots, events, and accessibility.`;

