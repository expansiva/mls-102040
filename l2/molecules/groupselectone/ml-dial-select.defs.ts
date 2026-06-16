/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-dial-select.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupSelectOne';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  selectOne: "dial"
};

export const skill = `# Metadata
- TagName: groupselectone--ml-dial-select

# Objective
Allow the user to choose exactly one option from a circular dial layout. Options are arranged as buttons on concentric rings radiating outward from a central trigger button. Clicking the center opens or closes the rings; clicking a ring item selects it. Items from different groups appear on separate rings, while standalone items share an outermost ring. The component supports an optional search field, keyboard navigation, error and loading states, and a read-only view mode.

# Responsibilities
- Toggle the rings open or closed when the central trigger button is clicked.
- Open the rings and move the highlight to the first enabled item when Arrow Down, Enter, or Space is pressed while closed.
- Navigate the highlight forward or backward through visible non-disabled items with Arrow Down / Arrow Up keys while the rings are open.
- Select the highlighted item when Enter is pressed while the rings are open, then close them.
- Close the rings without making a selection when Escape is pressed.
- Close the rings when the user clicks anywhere outside the component.
- Arrange items from each Group slot on its own concentric ring and standalone items on a shared outer ring.
- Show an optional search input above the dial when searchable = true and the dial is open; filter all visible items by the typed query.
- Scale the dial container size automatically based on the number of rings and the fixed per-item size.
- Display the selected item's label inside the central trigger button; show a placeholder or Trigger slot content when nothing is selected.
- Dispatch a "change" custom event when a selection is made.
- Emit "focus" and "blur" events when the trigger button gains or loses focus.
- Display an error message or helper text below the dial.
- Render a compact read-only text view of the selected label or placeholder when isEditing = false.
- Render a hidden input with the form name when the name property is set.

# Constraints
- All interaction (trigger click, keyboard, item selection) must be blocked when disabled = true, readonly = true, or loading = true.
- The component must not open when isEditing = false.
- Disabled items (item-level disabled attribute) must not be selectable by click or keyboard.
- Only one item can be selected at a time; selecting a new item replaces the previous selection immediately.
- The highlight must stay within the flat list of currently visible non-disabled items; it must never land on a disabled item.
- The search filter only affects the visible items in the open dial; it never alters value.
- The central trigger must carry proper ARIA attributes (role="combobox", aria-expanded, aria-haspopup, aria-invalid) at all times.`;
