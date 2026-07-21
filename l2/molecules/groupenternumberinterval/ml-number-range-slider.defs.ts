/// <mls fileReference="_102040_/l2/molecules/groupenternumberinterval/ml-number-range-slider.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterNumberInterval';
export const skill = `# Metadata
- TagName: groupenternumberinterval--ml-number-range-slider

# Objective
Provide a dual-handle range slider molecule that allows the user to select a numeric interval (a minimum and a maximum value) on a single bounded track, primarily intended for use cases such as price-range filtering.

# Responsibilities
- Render a horizontal track spanning the full container width with two circular, draggable handles positioned along it.
- Maintain an ordered interval \`[startValue, endValue]\` such that \`startValue ≤ endValue\`.
- Allow the user to select an interval by dragging the lower handle (controls \`startValue\`) and the upper handle (controls \`endValue\`) along the track.
- Snap both handles in \`step\` increments and round displayed values to \`decimals\` decimal places.
- Support keyboard navigation of the focused handle: Arrow Left / Arrow Down decrement by \`step\`, Arrow Right / Arrow Up increment by \`step\`, Home jump to \`min\`, End jump to \`max\`.
- Support touch interaction so handles respond to pointer-based input on touch devices.
- Allow clicking on the unselected segments of the track to move the nearest handle to the clicked position (re-clamping the pair).
- Ignore clicks on the selected segment between the two handles (must not collapse the interval).
- Prevent the two handles from crossing by enforcing a \`minGap\` between them; when a drag would cross, push the other handle to preserve the gap.
- Keep both handles within the absolute bounds defined by \`min\` and \`max\`.
- Track which handle is currently being dragged (\`activeHandle\`: \`'start'\`, \`'end'\`, or \`null\`) so the correct active visual state can be applied.
- Visually highlight the track segment between the two handles to distinguish it from the unselected segments.
- Show a tooltip/label on each handle displaying its current value (formatted with \`locale\`, \`decimals\`, and Prefix/Suffix) while the handle is being dragged or focused.
- Emit \`input\` events continuously while dragging either handle, with the current \`{ startValue, endValue }\`.
- Emit a single \`change\` event on pointer release (or equivalent finalization), with the finalized \`{ startValue, endValue }\`.
- Emit \`focus\` and \`blur\` events following the contract's event signatures.
- Apply the Disabled visual state and ignore all pointer/keyboard interaction when \`disabled\` is true.
- Apply the Readonly visual state without draggable handles but keep the formatted interval text-selectable when \`readonly\` is true.
- Apply the Loading visual state, block the track and handles, and ignore pointer/keyboard interaction when \`loading\` is true.
- Apply the Error visual state when \`error\` is a non-empty string, displaying the error message instead of the Helper; apply the Error visual state when \`required\` is true and either \`startValue\` or \`endValue\` is null.
- Render only the formatted interval as static text (with Prefix/Suffix) and emit no \`input\`/\`change\`/\`focus\`/\`blur\` events when \`isEditing\` is false.
- Format displayed values using \`locale\` and \`decimals\`, wrapping each bound with Prefix/Suffix when present.
- Display an em-dash placeholder (\`—\`, or \`startValue – —\` or \`— – endValue\`) when one or both bounds are not yet set, and a placeholder on the track in editing mode when provided.
- Accept and merge a consumer \`data-class\` attribute on the component root.
- Adapt responsively to the container width and keep handles aligned to the track edges regardless of container size.
- Prevent native \`change\`/\`input\` events from internal controls from bubbling beyond the molecule tag; only the molecule's own CustomEvents cross.

# Constraints
- Only horizontal orientation is supported; vertical orientation is not allowed in this variant.
- \`startValue\` must never exceed \`endValue\`; \`endValue\` must never fall below \`startValue\`; the \`minGap\` between them must be preserved at all times.
- The lower handle cannot go below \`min\`; the upper handle cannot exceed \`max\`.
- When \`disabled\`, \`readonly\`, or \`loading\` is true, all pointer and keyboard interaction must be ignored.
- When \`loading\` is true, the track must appear blocked with a loading indicator.
- When \`error\` is a non-empty string, the error message must be displayed instead of the Helper slot.
- When \`isEditing\` is false, the molecule must not render the track or handles, must not emit \`input\`/\`change\`/\`focus\`/\`blur\` events, and must render only the formatted interval as static text.
- All emitted \`change\`, \`input\`, \`blur\`, and \`focus\` events must match the contract's event signatures exactly.
- All numeric values displayed in tooltips, view-mode text, and value labels must be formatted using \`locale\` and \`decimals\` exactly as specified by the contract's display format table.
- Hardcoded color classes are not allowed; all colors must come from semantic tokens via companion style file classes.
- Native control events (\`change\`/\`input\`) must not bubble beyond the molecule tag.

# Notes
- Visual states observed: Active (start), Active (end), Complete, Disabled, Readonly, Error, Loading, and view mode.
- Optional slots: Label, LabelStart, LabelEnd, Prefix, Suffix, Helper.
- Optional \`placeholder\` text can be shown on the track when the interval is not yet set.`;

