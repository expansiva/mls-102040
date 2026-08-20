/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-inline-edit-table.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// INLINE EDIT TABLE MOLECULE
// =============================================================================
// Skill Group: groupViewTable
// This molecule does NOT contain business logic.

import { html, svg, TemplateResult, nothing } from'lit';
import { customElement, property, state } from'lit/decorators.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/shared/molecules/cn.js';
import { cellSortKey, compareSortKeys } from'/_102033_/l2/shared/molecules/tableSort.js';

/// **collab_i18n_start**
const message_en = {
 loading:'Loading...',
 empty:'No data available',
 selectAll:'Select all rows',
 selectRow:'Select row',
 sortAscending:'Sort ascending',
 sortDescending:'Sort descending',
 pagination:'Table pagination',
 previous:'Previous',
 next:'Next',
 page:'Page',
 actions:'Actions',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
 en: message_en,
 pt: {
 loading:'Carregando...',
 empty:'Nenhum dado disponível',
 selectAll:'Selecionar todas as linhas',
 selectRow:'Selecionar linha',
 sortAscending:'Ordenar crescente',
 sortDescending:'Ordenar decrescente',
 pagination:'Paginação da tabela',
 previous:'Anterior',
 next:'Próximo',
 page:'Página',
 actions:'Ações',
 },
};
/// **collab_i18n_end**

// The model holds ELEMENTS, not strings. It used to be `content: string` and `cells: string[]`,
// with the innerHTML of each cell — which killed the consumer's handlers and bindings and, in this
// molecule in particular, gutted the main feature: inline editing depends on the component inside
// the cell being ALIVE to receive `is-editing`.
// Minimum column width while dragging. Below this the header stops being readable and the resize
// handle becomes unreachable.
const MIN_COLUMN_WIDTH = 72;

interface ParsedColumn {
 key: string;
 sortable: boolean;
 headEl: Element;
 /**
  * Position of the column in the SOURCE (inside `<TableHeader>`), which is the position of the
  * matching cell in `ParsedRow.cellEls`. `parsedColumns` is never reordered: the VISUAL order is
  * derived in `orderedColumns()`. Mixing the two was the short path to desynchronizing a header
  * from its cells.
  */
 index: number;
}

interface ParsedRow {
 element: Element;
 cellEls: Element[];
 index: number;
 /** `<TableRow key="...">`. The row identity for editing, saving, cancelling and deleting. */
 key: string;
 /** The `<RowAction>` elements inside this row's `<RowActions>`, in the order they were written. */
 actionEls: Element[];
}

@customElement('groupviewtable--ml-inline-edit-table')
export class MlInlineEditTableMolecule extends MoleculeAuraElement {
 private msg: MessageType = messages.en;

 // ===========================================================================
 // SLOT TAGS
 // ===========================================================================
 slotTags = ['Caption','TableHeader','TableBody','TableRow','TableHead','TableCell','TableFooter','Empty','Loading','RowActions','RowAction','NewRecordRow'];

 // Migrated ENTIRELY to live slots, with no serialized slot left over. In a table the cell is
 // where the consumer puts controls, and here that IS the central feature: `propagateEditingState`
 // marks `is-editing` on the components inside the cell, and on a string clone that was just an
 // attribute on an element with no connection to the page.
 //
 // Migrating entirely also avoids the second paint: a molecule that leaves any slot serialized and
 // receives a component in it ends up with already-rendered markup inside its own snapshot.
 protected usesLiveSlots = true;

 // ===========================================================================
 // PROPERTIES — From Contract
 // ===========================================================================
 @propertyDataSource({ type: Boolean })
 selectable: boolean = false;

 @propertyDataSource({ type: Boolean, attribute:'is-editing' })
 isEditing: boolean = false;

 /**
  * Keys of the rows being edited, comma-separated — the PER-ROW mode, which is the real use case
  * of an inline edit table: one record at a time, with save and cancel.
  *
  * A row identifies itself with `<TableRow key="...">`, the same way a column already uses `key` on
  * `<TableHead>`. A key and not an index: an index is a position, and a position changes on sort.
  *
  * Empty and without `is-editing` = the molecule touches NOBODY's `is-editing`. See `ownsEditing`.
  */
 @propertyDataSource({ type: String, attribute:'editing-rows' })
 editingRows: string ='';

 @propertyDataSource({ type: Number })
 page: number = 1;

 @propertyDataSource({ type: Number, attribute:'page-size' })
 pageSize: number = 0;

 @propertyDataSource({ type: Number, attribute:'total-items' })
 totalItems: number = 0;

 @propertyDataSource({ type: String })
 value: string ='';

 @propertyDataSource({ type: String })
 error: string ='';

 @propertyDataSource({ type: Boolean })
 disabled: boolean = false;

 @propertyDataSource({ type: Boolean })
 loading: boolean = false;

 // ===========================================================================
 // INTERNAL STATE
 // ===========================================================================
 @state()
 private sortKey: string | null = null;

 @state()
 private sortDirection:'asc' |'desc' ='asc';

 @state()
 private focusedRowIndex: number = -1;

 @state()
 private parsedColumns: ParsedColumn[] = [];

 @state()
 private parsedRows: ParsedRow[] = [];

 @state()
 private sortedRowIndices: number[] = [];

 /**
  * VISUAL order of the columns, by key. Empty = the source order.
  *
  * It holds keys and not indexes for the same reason as the row: an index is a position, and the
  * position changes. And the derivation in `orderedColumns()` tolerates the column set changing
  * underfoot — a column that showed up later joins at the end, a key that is gone is dropped.
  */
 @state()
 private columnOrder: string[] = [];

 /** Visual width per column key, in px, for the current session. */
 @state()
 private columnWidths: Record<string, number> = {};

 @state()
 private resizingKey: string | null = null;

 /**
  * The DRAFT row, when the consumer supplied `<NewRecordRow>`. A `ParsedRow` with `index: -1` so
  * that `renderRow()` is reused untouched: only the COLLECTIONS need to know it is special.
  */
 @state()
 private draftRow: ParsedRow | null = null;

 /** Is the draft open? One at a time — see `openDraft()`. */
 @state()
 private draftOpen = false;

 /**
  * The row being edited when the MOLECULE owns the mode — the case where the consumer did not
  * write `editing-rows`. See `editingKeys()` for the rule of who is in charge.
  */
 @state()
 private editingKey = '';

 // Not reactive: they change during the drag and must not schedule a render on their own.
 private resizeStartX = 0;
 private resizeStartWidth = 0;

 // ===========================================================================
 // LIFECYCLE
 // ===========================================================================
 firstUpdated() {
 // The structure was already read in `willUpdate` of this same pass.
 this.propagateEditingState();
 }

 /**
  * Propagates on EVERY update, without consulting `changedProperties`.
  *
  * Not out of distrust of the change map — it works. It is because the propagation also has to
  * reach a cell that was JUST projected (a row that came in through pagination, for example): it
  * needs the attribute even though neither `isEditing` nor `editingRows` changed.
  *
  * What prevents the side effect is `ownsEditing()`: with no `is-editing` and no `editing-rows`,
  * the molecule touches nothing.
  */
 updated() {
 this.propagateEditingState();
 }

 /**
  * The resize listeners live on `window` (the pointer leaves the `<th>` mid-drag), so they have to
  * be removed here — the molecule can be detached while a drag is in progress.
  */
 disconnectedCallback() {
 window.removeEventListener('pointermove', this.handleResizeMove);
 window.removeEventListener('pointerup', this.handleResizeEnd);
 super.disconnectedCallback();
 }

 // ===========================================================================
 // STATE CHANGE HANDLER
 // ===========================================================================
 handleIcaStateChange(key: string, value: unknown) {
 const isEditingAttr = this.getAttribute('is-editing');
 if (isEditingAttr === `{{${key}}}`) {
 this.propagateEditingState();
 }
 this.requestUpdate();
 }

 // ===========================================================================
 // PARSING
 // ===========================================================================
 /**
  * Re-reads the structure and PRESERVES the current sort.
  *
  * It used to always end in `initializeSortedIndices()`, which returns the original order — and
  * because it was called from inside `render()`, every re-render erased the sort just computed.
  * The header click computed the right order and the screen never changed. Measured on 2026-08-04
  * with the demotable--funcionariosedicao page: `ordemFinal=2,5,6,3,7,0,4,1` and the screen intact.
  */
 private parseTableStructure() {
 this.parseColumns();
 this.parseRows();
 this.parseDraftRow();
 if (this.sortKey) this.applySorting();
 else this.initializeSortedIndices();
 }

 private parseColumns() {
 // getLiveSlot and not getSlot: a molecule that projects cannot read from the snapshot, because
 // the source is emptied by the projection and a re-snapshot would read blank.
 const headerSlot = this.getLiveSlot('TableHeader');
 if (!headerSlot) {
 this.parsedColumns = [];
 return;
 }

 const headerRow = headerSlot.querySelector('TableRow');
 if (!headerRow) {
 this.parsedColumns = [];
 return;
 }

 const heads = Array.from(headerRow.querySelectorAll('TableHead'));
 // The key is derived in ONE place only, with a fallback to the position. Two columns without
 // `key` shared the empty key, and therefore shared the same entry in `columnWidths` — resizing
 // one resized them all. The group contract asks for `key` on `<TableHead>`; the fallback is for
 // markup that did not comply.
 this.parsedColumns = heads.map((head, index) => ({
 key: head.getAttribute('key') || `column-${index}`,
 sortable: head.hasAttribute('sortable'),
 headEl: head,
 index,
 }));
 }

 private parseRows() {
 const bodySlot = this.getLiveSlot('TableBody');
 if (!bodySlot) {
 this.parsedRows = [];
 return;
 }

 const rows = Array.from(bodySlot.querySelectorAll('TableRow'));
 this.parsedRows = rows.map((row, index) => ({
 element: row,
 cellEls: Array.from(row.querySelectorAll('TableCell')),
 index,
 // Fallback to the position when the consumer did not write `key`, for the SAME reason as the
 // column: with no distinct identity every row would share the empty key, and clicking "Edit" on
 // one would open them all. Positional identity is poor (it changes on sort) but it beats
 // colliding — the contract asks for `key` on `<TableRow>` for the editing and deleting flows.
 key: row.getAttribute('key') || `row-${index}`,
 // `:scope >` on both ends: a nested `<RowActions>` (a table inside a cell) does not belong to
 // this row, and a `<RowAction>` the consumer nested inside its own button is not an action.
 actionEls: Array.from(row.querySelectorAll(':scope > RowActions > RowAction')),
 }));
 }

 /**
  * Reads the `<NewRecordRow>`.
  *
  * Its cells are REAL elements of the consumer, written ONCE and not per row, so projecting them is
  * the same gesture as a normal cell — nothing is cloned. That is what makes the draft row possible
  * at all: the molecule does not FABRICATE a cell, it projects the one the consumer supplied.
  *
  * `:scope >` on both ends, so the content of a nested table is not mistaken for this row's.
  */
 private parseDraftRow() {
 const el = this.getLiveSlot('NewRecordRow');
 if (!el) {
 this.draftRow = null;
 return;
 }
 this.draftRow = {
 element: el,
 cellEls: Array.from(el.querySelectorAll(':scope > TableCell')),
 index: -1,
 key: el.getAttribute('key') ||'',
 actionEls: Array.from(el.querySelectorAll(':scope > RowActions > RowAction')),
 };
 }

 private initializeSortedIndices() {
 this.sortedRowIndices = this.parsedRows.map((_, i) => i);
 }

 // ===========================================================================
 // COLUMN ORDER AND WIDTH
 // ===========================================================================
 /**
  * The columns in VISUAL order.
  *
  * Derived from `columnOrder` and reconciled against the current set: a key that no longer exists
  * is dropped, and a column that appeared after the reorder joins at the end. Without that second
  * half, a column the consumer added after a drag simply DISAPPEARED from the table.
  */
 private orderedColumns(): ParsedColumn[] {
 if (this.columnOrder.length === 0) return this.parsedColumns;

 const byKey = new Map(this.parsedColumns.map((col) => [col.key, col]));
 const ordered: ParsedColumn[] = [];
 for (const key of this.columnOrder) {
 const col = byKey.get(key);
 if (col) {
 ordered.push(col);
 byKey.delete(key);
 }
 }
 for (const col of this.parsedColumns) {
 if (byKey.has(col.key)) ordered.push(col);
 }
 return ordered;
 }

 /** The pinned width for the column, or nothing. Geometry in `style` is allowed; colour never is. */
 private columnStyle(col: ParsedColumn): string {
 const width = this.columnWidths[col.key];
 return width ? `width:${width}px` : '';
 }

 private moveColumn(fromKey: string, toKey: string) {
 if (this.disabled || fromKey === toKey) return;

 const keys = this.orderedColumns().map((col) => col.key);
 const from = keys.indexOf(fromKey);
 const to = keys.indexOf(toKey);
 if (from < 0 || to < 0) return;

 keys.splice(from, 1);
 keys.splice(to, 0, fromKey);
 this.columnOrder = keys;
 }

 private handleColumnDragStart(event: DragEvent, key: string) {
 if (this.disabled || !event.dataTransfer) return;
 event.dataTransfer.setData('text/plain', key);
 event.dataTransfer.effectAllowed = 'move';
 }

 private handleColumnDrop(event: DragEvent, targetKey: string) {
 event.preventDefault();
 this.moveColumn(event.dataTransfer?.getData('text/plain') || '', targetKey);
 }

 /**
  * Measures the `<th>`, not the handle.
  *
  * `event.currentTarget` is the handle's `<span>`, 4px wide — measuring that made the column jump
  * to the minimum width on the first pixel of the drag, instead of starting from its current width.
  */
 private handleResizeStart(event: PointerEvent, key: string) {
 if (this.disabled) return;
 const header = (event.currentTarget as HTMLElement).closest('th');
 if (!header) return;

 // `stopPropagation` isolates the handle from the `<th>`: without it the pointerdown would start
 // the reorder drag, and the two gestures would fight over the same pointer movement.
 event.stopPropagation();
 event.preventDefault();

 this.resizingKey = key;
 this.resizeStartX = event.clientX;
 this.resizeStartWidth = header.getBoundingClientRect().width;

 window.addEventListener('pointermove', this.handleResizeMove);
 window.addEventListener('pointerup', this.handleResizeEnd, { once: true });
 }

 private handleResizeMove = (event: PointerEvent) => {
 if (!this.resizingKey) return;
 const width = Math.max(MIN_COLUMN_WIDTH, this.resizeStartWidth + event.clientX - this.resizeStartX);
 this.columnWidths = { ...this.columnWidths, [this.resizingKey]: width };
 };

 private handleResizeEnd = () => {
 this.resizingKey = null;
 window.removeEventListener('pointermove', this.handleResizeMove);
 };

 // ===========================================================================
 // EDITING PROPAGATION
 // ===========================================================================
 /**
  * Marks `is-editing` on the components the consumer placed inside the cells.
  *
  * It has to sweep TWO places. With live slots the cell's children are MOVED into the anchor inside
  * the rendered `<td>`, so the source (`<TableCell>`) is left empty — sweeping only it, as it did
  * before, would mark nobody. The source stays on the list because a cell that is not projected yet
  * (a row outside the current page, for example) still holds its children.
  */
 /**
  * The molecule only stamps `is-editing` when the consumer handed control to it.
  *
  * It used to stamp ALWAYS — including `is-editing="false"` on everything, on every render. That
  * silently trampled any consumer driving the editing mode cell by cell: the page's binding was
  * undone in the table's `updated()`, which runs afterwards. Measured on 2026-08-04 with the
  * demotable--funcionariosedicao page.
  */
 private ownsEditing(): boolean {
 // The PRESENCE of the attribute, not its content. `editing-rows=""` means "no row is being
 // edited", and that is exactly when the molecule most needs to act: it is the screen's initial
 // state and the state right after saving or cancelling. Requiring non-empty content, as it did,
 // left the fields open on entry and the edited row open after closing.
 return (
 this.hasAttribute('is-editing') ||
 this.isEditing === true ||
 this.hasAttribute('editing-rows') ||
 this.rowsInEdit().size > 0 ||
 this.editingKey !== '' ||
 this.draftOpen ||
 this.hasEditingActions
 );
 }

 /**
  * The keys being edited, coming from WHOEVER is in charge of the mode.
  *
  * `editing-rows` PRESENT in the markup = the page owns it, even when empty: empty means "no row
  * open", which is the screen's initial state and the state right after saving. Absent = the
  * molecule owns it, and the state is `editingKey`. This is what leaves an existing page untouched
  * while giving the internal mode to anyone who wrote nothing.
  */
 private editingKeys(): Set<string> {
 if (this.hasAttribute('editing-rows')) return this.rowsInEdit();
 return this.editingKey ? new Set([this.editingKey]) : new Set();
 }

 /**
  * Is the row being edited?
  *
  * With no key in play, the GLOBAL `isEditing` rules — behaviour that already existed and that a
  * page may be using to open the whole table at once.
  */
 private isRowEditing(rowKey: string): boolean {
 const keys = this.editingKeys();
 if (keys.size > 0) return keys.has(rowKey);
 return this.isEditing;
 }

 private rowsInEdit(): Set<string> {
 return new Set(
 String(this.editingRows ||'')
 .split(',')
 .map((s) => s.trim())
 .filter(Boolean)
 );
 }

 /**
  * Marks `is-editing` and FORCES an update on the marked component.
  *
  * The explicit `requestUpdate()` is not caution: without it the `"false"` → `"true"` transition
  * does not re-render. Lit's Boolean converter is `v => v !== null`, so ANY attribute that is
  * present — `is-editing="false"` included — reaches the `@propertyDataSource` setter as `true` and
  * is stored that way in the internal `_is-editing`. The getter, in turn, reads the attribute TEXT
  * and returns the real value. Since Lit's change detection compares the getter against the
  * `oldValue` taken from the internal, `false → true` is invisible and the screen does not change.
  *
  * Measured on 2026-08-04 with the demotable--funcionariosedicao page: `attr="true" prop=true` and
  * no `<input>` in the row. The defect belongs to the decorator
  * (mls-102029/l2/collabDecorators.ts) and is logged for its own fix; here we only secure the
  * effect.
  */
 private marcar(raiz: Element, editando: boolean) {
 raiz.querySelectorAll('*').forEach((child) => {
 if (!child.tagName.includes('-')) return;
 child.setAttribute('is-editing', String(editando));
 (child as any).requestUpdate?.();
 });
 }

 private propagateEditingState() {
 if (!this.ownsEditing()) return;

 // The draft comes IN ADDITION to the body rows — it does not come from `<TableBody>`, so it is
 // not in `parsedRows`, and without this its editors would never receive `is-editing`.
 const linhas = this.draftOpen && this.draftRow ? [...this.parsedRows, this.draftRow] : this.parsedRows;

 for (const row of linhas) {
 const chave = row.key;
 // The draft row is ALWAYS editing: it is a form, not a record being read.
 const editando = row === this.draftRow ? true : this.isRowEditing(chave);

 // The source, for a cell not projected yet, and the rendered row, where the projected nodes
 // live. `data-row-key` on the <tr> is what ties one to the other.
 row.cellEls.forEach((cell) => this.marcar(cell, editando));
 const tr = this.querySelector(`tr[data-row-key="${CSS.escape(chave)}"]`);
 if (tr) this.marcar(tr, editando);
 }
 }

 // ===========================================================================
 // ROW ACTIONS
 // ===========================================================================
 /**
  * The actions column exists because SOME row supplied `<RowActions>`.
  *
  * A mirror of what `selectable` already does on the other side: the molecule injects a column the
  * consumer never declares in `<TableHeader>`. Compatibility consequence: whoever writes their own
  * action column in a `<TableCell>` — like the page that already exists — has no `<RowActions>`,
  * nothing is injected and nothing changes for them.
  */
 private get hasRowActions(): boolean {
 if (this.parsedRows.some((row) => row.actionEls.length > 0)) return true;
 // The draft counts even while CLOSED: if it carries actions, the column exists from the start
 // instead of appearing and disappearing as the list empties.
 return (this.draftRow?.actionEls.length ?? 0) > 0;
 }

 /**
  * The molecule owns the editing mode because the consumer put an action in `<RowActions>` that
  * TOGGLES it (`edit`, `save` or `cancel`) — that was them handing the mode to the table.
  *
  * This is what `ownsEditing()` was missing: without it, before the first click on "Edit" nothing
  * was stamped, and the components in the cells stayed at their own default — which in
  * `ml-enter-text` is `isEditing = true`, that is, an open field with a border, looking like
  * editing. Worse: after cancelling, the row's `is-editing="true"` was left behind, because the
  * molecule stopped stamping.
  *
  * Actions that do not toggle the mode (`delete`, or an action of the consumer's own) do NOT count:
  * whoever only puts a delete button in the table is not handing the mode over, and stays free to
  * drive `is-editing` cell by cell.
  */
 private get hasEditingActions(): boolean {
 const alterna = (el: Element) => {
 const action = (el.getAttribute('action') ||'').trim();
 return action ==='edit' || action ==='save' || action ==='cancel';
 };
 if (this.parsedRows.some((row) => row.actionEls.some(alterna))) return true;
 return (this.draftRow?.actionEls ?? []).some(alterna);
 }

 /** How many columns the table draws, counting the two the molecule injects. */
 private get renderedColumnCount(): number {
 return this.parsedColumns.length + (this.selectable ? 1 : 0) + (this.hasRowActions ? 1 : 0);
 }

 /**
  * Which mode the action appears in. An explicit `when` wins; without it, it is inferred from
  * `action` — edit and delete only while viewing, save and cancel only while editing.
  */
 private actionVisibleIn(actionEl: Element): 'view' |'edit' |'always' {
 const declared = (actionEl.getAttribute('when') ||'').trim().toLowerCase();
 if (declared ==='view' || declared ==='edit' || declared ==='always') return declared;

 switch ((actionEl.getAttribute('action') ||'').trim()) {
 case'edit':
 case'delete':
 return'view';
 case'save':
 case'cancel':
 return'edit';
 default:
 return'always';
 }
 }

 private isActionVisible(actionEl: Element, editing: boolean): boolean {
 const visibleIn = this.actionVisibleIn(actionEl);
 if (visibleIn ==='always') return true;
 return visibleIn === (editing ?'edit' :'view');
 }

 /**
  * Opens and closes the mode ONLY when the molecule owns it.
  *
  * With `editing-rows` in the markup the page decides: the molecule emits the event and does not
  * transition, and it is the page that hands the attribute back. Without it, the transition is
  * internal and the click on "Edit" opens the row right away, with no round trip.
  */
 private openRowEditing(key: string) {
 if (this.hasAttribute('editing-rows')) return;
 this.editingKey = key;
 }

 private closeRowEditing(key: string) {
 if (this.hasAttribute('editing-rows')) return;
 if (this.editingKey === key) this.editingKey ='';
 }

 /**
  * Opens the draft.
  *
  * **One at a time**, and that is an ARCHITECTURE restriction, not a product one: there is one
  * `<NewRecordRow>` and a node can only be in one place. Two simultaneous drafts would require
  * cloning the cells, and a clone projects dead nodes.
  *
  * Without `<NewRecordRow>` there is nothing to open, and the `newRecord` event alone is enough:
  * the page appends the row to `<TableBody>` on its own.
  */
 private openDraft() {
 if (!this.draftRow || this.draftOpen) return;
 this.draftOpen = true;
 }

 private closeDraft() {
 this.draftOpen = false;
 }

 private emitRowEvent(name: string, detail: Record<string, unknown>) {
 this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
 }

 /**
  * A click on a row action.
  *
  * The action is identified by the SLOT the click came from — by no convention at all about the
  * component the consumer put there. That click reaches here because live slots move REAL nodes
  * into the `<td>`, and because the page's own handler runs before this one (target phase on the
  * button, then the bubbling): the page settles the VALUE and only then the molecule switches the
  * MODE.
  *
  * Emits first and transitions after, always — a single rule, so the consumer never has to guess
  * in which order the two things happen.
  */
 private handleRowAction(row: ParsedRow, actionEl: Element, isDraft = false) {
 if (this.disabled) return;

 const action = (actionEl.getAttribute('action') ||'').trim();

 // The draft has a narrower vocabulary — it has no "edit" and no "delete", because the row is
 // born editing and is not a record yet. `isNew` tells the draft's save apart from the save of an
 // existing record, without creating a parallel family of events.
 if (isDraft) {
 switch (action) {
 case'save':
 this.emitRowEvent('save', { key: row.key, isNew: true });
 this.closeDraft();
 break;
 case'cancel':
 this.emitRowEvent('cancel', { key: row.key, isNew: true });
 this.closeDraft();
 break;
 default:
 this.emitRowEvent('rowAction', { key: row.key, action, isNew: true });
 break;
 }
 return;
 }

 const detail = { key: row.key };

 switch (action) {
 case'edit':
 this.emitRowEvent('edit', detail);
 this.openRowEditing(row.key);
 break;
 case'save':
 this.emitRowEvent('save', detail);
 this.closeRowEditing(row.key);
 break;
 case'cancel':
 this.emitRowEvent('cancel', detail);
 this.closeRowEditing(row.key);
 break;
 case'delete':
 // No transition: deleting is not a mode. Removing the row from `<TableBody>` is the page's job.
 this.emitRowEvent('delete', detail);
 break;
 default:
 this.emitRowEvent('rowAction', { key: row.key, action });
 break;
 }
 }

 /**
  * A FOOTER action. Today only `new`, and the vocabulary is the same as the row's `<RowAction>` —
  * there is no new slot for the new-record trigger.
  */
 private handleFooterAction(actionEl: Element) {
 if (this.disabled) return;

 const action = (actionEl.getAttribute('action') ||'').trim();
 if (action ==='new') {
 // Always emits, opens when it can: with `<NewRecordRow>` the molecule shows the draft; without
 // it, the event IS the whole feature and the page writes the row.
 this.emitRowEvent('newRecord', {});
 this.openDraft();
 return;
 }

 this.emitRowEvent('rowAction', { key:'', action });
 }

 // ===========================================================================
 // SELECTION
 // ===========================================================================
 private getSelectedIndices(): Set<number> {
 if (!this.value) return new Set();
 return new Set(
 this.value
 .split(',')
 .map((s) => parseInt(s.trim(), 10))
 .filter((n) => !isNaN(n))
 );
 }

 private setSelectedIndices(indices: Set<number>) {
 const sorted = Array.from(indices).sort((a, b) => a - b);
 this.value = sorted.join(',');
 this.dispatchEvent(
 new CustomEvent('change', {
 bubbles: true,
 composed: true,
 detail: { value: this.value },
 })
 );
 }

 private handleSelectAll(e: Event) {
 e.stopPropagation();
 if (this.disabled) return;
 const selected = this.getSelectedIndices();
 const allSelected = this.parsedRows.every((row) => selected.has(row.index));

 if (allSelected) {
 this.setSelectedIndices(new Set());
 } else {
 this.setSelectedIndices(new Set(this.parsedRows.map((row) => row.index)));
 }
 }

 private handleRowSelect(index: number) {
 if (this.disabled) return;
 const selected = this.getSelectedIndices();

 if (selected.has(index)) {
 selected.delete(index);
 } else {
 selected.add(index);
 }

 this.setSelectedIndices(selected);
 }

 // ===========================================================================
 // SORTING
 // ===========================================================================
 private handleSort(key: string) {
 if (this.disabled) return;

 if (this.sortKey === key) {
 this.sortDirection = this.sortDirection ==='asc' ?'desc' :'asc';
 } else {
 this.sortKey = key;
 this.sortDirection ='asc';
 }

 // Does not call `applySorting()` here: changing `sortKey`/`sortDirection` already schedules the
 // update, and `willUpdate` reapplies the sort before drawing. Calling it in both places sorted
 // twice per click.

 this.dispatchEvent(
 new CustomEvent('sort', {
 bubbles: true,
 composed: true,
 detail: { key: this.sortKey, direction: this.sortDirection },
 })
 );
 }

 /**
  * EXTERNAL mode does not reorder. The table holds ONE page, and sorting there would order 10 rows
  * out of 60. `sort` is still emitted by `handleSort`: it is the consumer, holding the real values,
  * who requeries and rewrites `<TableBody>` in the right order. Rule of the group contract
  * (groupViewTable/creation.ts §9.2).
  */
 private applySorting() {
 if (!this.sortKey || this.isExternalData) {
 this.initializeSortedIndices();
 return;
 }

 // The column's `index` and not its position in `parsedColumns`: they are equal today because
 // `parsedColumns` stays in source order, and that is exactly the invariant `index` makes
 // explicit — the visual order lives in `orderedColumns()`.
 const column = this.parsedColumns.find((col) => col.key === this.sortKey);
 if (!column) {
 this.initializeSortedIndices();
 return;
 }
 const columnIndex = column.index;

 // Two things, and both were measured:
 //
 // `cellSortKey` and not the cell's text: it honours `sort-value`, and `compareSortKeys` reads a
 // NUMBER when both keys are numeric — it was the raw `localeCompare` here that broke on
 // `R$ 1.234,50` and on `dd/mm/yyyy`, and that silently ignored `sort-value`. This is the debt
 // that created the shared helper (three wrong parses of the same value in three tables).
 //
 // `getLiveText`: the projected cell is empty (its children were moved into the anchor), and the
 // base knows how to recover the current text of the moved nodes. It skips Lit's part markers —
 // including them made the sort key read `?lit$...$70`.
 const rowsWithValues = this.parsedRows.map((row) => {
 const cell = row.cellEls[columnIndex];
 return { index: row.index, key: cellSortKey(cell, this.getLiveText(cell)) };
 });

 rowsWithValues.sort((a, b) => {
 const comparison = compareSortKeys(a.key, b.key);
 return this.sortDirection ==='asc' ? comparison : -comparison;
 });

 this.sortedRowIndices = rowsWithValues.map((r) => r.index);
 }

 // ===========================================================================
 // ROW CLICK
 // ===========================================================================
 private handleRowClick(index: number, event: Event) {
 const target = event.target as HTMLElement;
 // A control is not a row. Without this guard, clicking "Delete" emitted `rowClick` as well — and
 // there are pages that use `rowClick` to open a record's detail. `data-ml-table-control` covers
 // the actions area BY CONSTRUCTION, whatever component the consumer placed inside it.
 if (target.closest('input,button,a,select,textarea,[data-ml-table-control]')) {
 return;
 }

 this.dispatchEvent(
 new CustomEvent('rowClick', {
 bubbles: true,
 composed: true,
 detail: { index },
 })
 );
 }

 // ===========================================================================
 // PAGINATION
 // ===========================================================================
 /**
  * EXTERNAL when the consumer declared more items than the rows it sent: it already sliced the
  * page. This is the implicit signal of the group contract (creation.ts §9), and it is what decides
  * whether this molecule may reorder and slice.
  */
 private get isExternalData(): boolean {
 return Number(this.totalItems) > this.parsedRows.length;
 }

 /**
  * Total items in the set. In INTERNAL mode it is the ROW COUNT.
  *
  * Deriving it from `totalItems` when that was not declared gave `ceil(0/pageSize) || 1` = 1 page:
  * the table showed the first one, "next" was born disabled and the rest of the set was reachable
  * from nowhere. Measured on 2026-08-05 in `ml-lazy-record-detail-table` — 8 rows,
  * `page-size="5"`, 3 rows unreachable.
  */
 private get totalItemCount(): number {
 const declared = Number(this.totalItems) || 0;
 return declared > 0 ? declared : this.parsedRows.length;
 }

 private get totalPages(): number {
 if (this.pageSize <= 0) return 1;
 return Math.max(1, Math.ceil(this.totalItemCount / this.pageSize));
 }

 /**
  * The current page clamped to the valid range. The slice and the controls must read the SAME
  * rule: a stale `page` (the set shrank) would draw an empty body with the navigation intact.
  */
 private get currentPage(): number {
 return Math.min(Math.max(1, Number(this.page) || 1), this.totalPages);
 }

 /**
  * Indexes of the current page. The slice belongs to INTERNAL mode: in EXTERNAL the consumer
  * already sent only the page, and slicing again would hide rows. A molecule that does not slice
  * locally has not implemented internal mode — it is half of the contract, and the two halves go
  * together.
  */
 private visibleRowIndices(): number[] {
 if (this.pageSize <= 0 || this.isExternalData) return this.sortedRowIndices;
 const start = (this.currentPage - 1) * this.pageSize;
 return this.sortedRowIndices.slice(start, start + this.pageSize);
 }

 private handlePageChange(newPage: number) {
 if (this.disabled) return;
 if (newPage < 1 || newPage > this.totalPages) return;

 this.page = newPage;
 this.dispatchEvent(
 new CustomEvent('pageChange', {
 bubbles: true,
 composed: true,
 detail: { page: newPage },
 })
 );
 }

 // ===========================================================================
 // KEYBOARD NAVIGATION
 // ===========================================================================
 private handleKeyDown(event: KeyboardEvent) {
 if (this.disabled) return;

 const target = event.target as HTMLElement;
 const isInsideCell = target.closest('td') !== null;

 if (isInsideCell && (event.key ==='Tab' || event.key ==='Enter')) {
 return;
 }

 switch (event.key) {
 case'ArrowUp':
 event.preventDefault();
 this.moveFocus(-1);
 break;
 case'ArrowDown':
 event.preventDefault();
 this.moveFocus(1);
 break;
 case'':
 if (this.selectable && this.focusedRowIndex >= 0) {
 event.preventDefault();
 this.handleRowSelect(this.focusedRowIndex);
 }
 break;
 }
 }

 /**
  * A click on the header sorts — EXCEPT when it comes from the resize handle, which lives inside
  * the clickable `<th>`. `preventDefault` on pointerdown does not prevent the `click`, so dragging
  * the handle also sorted the column.
  */
 private handleHeaderClick(event: Event, key: string) {
 const target = event.target as Element | null;
 if (target?.closest('[data-ml-table-control]')) return;
 this.handleSort(key);
 }

 private handleHeaderKeyDown(event: KeyboardEvent, key: string, sortable: boolean) {
 if (event.key ==='Enter' && sortable) {
 event.preventDefault();
 this.handleSort(key);
 }
 }

 /**
  * Walks the VISIBLE rows, not the whole set: with the pagination slice active, the focus would
  * move to rows that are not drawn.
  *
  * `focusedRowIndex` holds the row's INDEX (its position in `<TableBody>`), never the position in
  * the visible list — the two diverge as soon as the table is sorted or paginated. That is what
  * assigning `0` / `rowCount - 1` directly used to confuse.
  */
 private moveFocus(direction: number) {
 const visible = this.visibleRowIndices();
 if (visible.length === 0) return;

 const first = direction > 0 ? visible[0] : visible[visible.length - 1];

 if (this.focusedRowIndex === -1) {
 this.focusedRowIndex = first;
 return;
 }

 // The focused row left the visible page (page change): restart from the entering edge.
 const currentPosition = visible.indexOf(this.focusedRowIndex);
 if (currentPosition === -1) {
 this.focusedRowIndex = first;
 return;
 }

 const newPosition = Math.max(0, Math.min(visible.length - 1, currentPosition + direction));
 this.focusedRowIndex = visible[newPosition];
 }

 // ===========================================================================
 // RENDER HELPERS
 // ===========================================================================
 private getTableClasses(): string {
 return [
'w-full border-collapse',
'ml-surface-bg',
'ml-text',
 this.disabled ?'opacity-50 pointer-events-none' :'',
 ]
 .filter(Boolean)
 .join(' ');
 }

 private getHeaderCellClasses(sortable: boolean): string {
 return [
'px-4 py-3 text-left text-sm font-semibold',
'ml-surface-dim-bg',
'ml-text',
'border-b ml-border',
 sortable ?'cursor-pointer select-none hover:ml-surface-dim-bg' :'',
 ]
 .filter(Boolean)
 .join(' ');
 }

 private getRowClasses(index: number, isSelected: boolean): string {
 return [
'transition-colors',
 isSelected ?'ml-primary-dim-bg' :'ml-surface-bg',
 // `index >= 0` excludes the draft: it has `index: -1`, which is the SAME value as the
 // "nothing focused" sentinel of `focusedRowIndex` — without the guard, the draft would be born
 // wearing the focus ring. That collision is also why arrow navigation does not reach the draft.
 index >= 0 && this.focusedRowIndex === index ?'ring-2 ring-inset ml-focus-ring' :'',
'hover:ml-surface-dim-bg',
'border-b ml-border',
 ]
 .filter(Boolean)
 .join(' ');
 }

 private getCellClasses(): string {
 return ['px-4 py-3 text-sm','ml-text'].join(' ');
 }

 private getCheckboxClasses(): string {
 return [
'w-4 h-4 rounded',
'ml-border',
'ml-primary-text',
'',
'ml-surface-bg',
 ].join(' ');
 }

 // ===========================================================================
 // RENDER SECTIONS
 // ===========================================================================
 private renderCaption(): TemplateResult | typeof nothing {
 if (!this.hasSlot('Caption')) return nothing;
 return html`
 <caption class="${cn('px-4 py-3 text-left text-lg font-semibold ml-text ml-surface-bg', this.getSlotClass('Caption'))}">
 ${this.renderLiveSlot('Caption')}
 </caption>
 `;
 }

 private renderHeader(): TemplateResult {
 const selected = this.getSelectedIndices();
 const allSelected = this.parsedRows.length > 0 && this.parsedRows.every((row) => selected.has(row.index));
 const someSelected = this.parsedRows.some((row) => selected.has(row.index));

 return html`
 <thead role="rowgroup">
 <tr role="row">
 ${this.selectable
 ? html`
 <th class="${this.getHeaderCellClasses(false)} w-12" role="columnheader">
 <input
 type="checkbox"
 class="${this.getCheckboxClasses()}"
 .checked=${allSelected}
 .indeterminate=${someSelected && !allSelected}
 @change=${this.handleSelectAll}
 aria-label=${this.msg.selectAll}
 ?disabled=${this.disabled}
 
 @input="${(e: Event) => e.stopPropagation()}"
/>
 </th>
 `
 : nothing}
 ${this.orderedColumns().map((col) => this.renderHeaderCell(col))}
 ${this.hasRowActions
 ? html`
 <th class="${this.getHeaderCellClasses(false)}" role="columnheader">${this.msg.actions}</th>
 `
 : nothing}
 </tr>
 </thead>
 `;
 }

 private renderHeaderCell(col: ParsedColumn): TemplateResult {
 const isSorted = this.sortKey === col.key;
 const ariaSort = isSorted ? (this.sortDirection ==='asc' ?'ascending' :'descending') : undefined;

 return html`
 <th
 class="${this.getHeaderCellClasses(col.sortable)}"
 style=${this.columnStyle(col) || nothing}
 role="columnheader"
 aria-sort=${ariaSort || nothing}
 tabindex=${col.sortable ?'0' : nothing}
 draggable=${this.disabled ?'false' :'true'}
 @click=${col.sortable ? (e: Event) => this.handleHeaderClick(e, col.key) : nothing}
 @keydown=${col.sortable ? (e: KeyboardEvent) => this.handleHeaderKeyDown(e, col.key, col.sortable) : nothing}
 @dragstart=${(e: DragEvent) => this.handleColumnDragStart(e, col.key)}
 @dragover=${(e: DragEvent) => e.preventDefault()}
 @drop=${(e: DragEvent) => this.handleColumnDrop(e, col.key)}
 >
 <span class="flex items-center gap-2">
 ${this.renderLiveSlotFrom(col.headEl)}
 ${col.sortable ? this.renderSortIcon(isSorted) : nothing}
 </span>
 <span
 class="ml-column-resize"
 data-ml-table-control
 aria-hidden="true"
 @pointerdown=${(e: PointerEvent) => this.handleResizeStart(e, col.key)}
 ></span>
 </th>
 `;
 }

 private renderSortIcon(isSorted: boolean): TemplateResult {
 if (!isSorted) {
 return html`
 <span class="ml-text-faint">
 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 ${svg`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>`}
 </svg>
 </span>
 `;
 }

 return html`
 <span class="ml-primary-text">
 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 ${this.sortDirection ==='asc'
 ? svg`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>`
 : svg`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>`}
 </svg>
 </span>
 `;
 }

 private renderBody(): TemplateResult {
 const draft = this.draftOpen ? this.draftRow : null;

 // With the draft open the body is NOT empty, even with no records at all: clicking "new record"
 // on an empty table is the likeliest use case of them all, and the empty-state short circuit
 // swallowed the row.
 if (this.parsedRows.length === 0 && !draft) {
 return this.renderEmpty();
 }

 const selected = this.getSelectedIndices();

 return html`
 <tbody role="rowgroup">
 ${this.visibleRowIndices().map((rowIndex) => {
 const row = this.parsedRows.find((r) => r.index === rowIndex);
 if (!row) return nothing;
 return this.renderRow(row, selected.has(rowIndex));
 })}
 ${draft ? this.renderRow(draft, false, true) : nothing}
 </tbody>
 `;
 }

 private renderRow(row: ParsedRow, isSelected: boolean, isDraft = false): TemplateResult {
 return html`
 <tr
 class="${this.getRowClasses(row.index, isSelected)} ${isDraft ?'ml-table-draft-row' :''}"
 role="row"
 data-row-key=${row.key}
 tabindex="0"
 @click=${isDraft ? nothing : (e: Event) => this.handleRowClick(row.index, e)}
 @focus=${isDraft ? nothing : () => (this.focusedRowIndex = row.index)}
 >
 ${this.selectable && isDraft
 ? html`<td class="${this.getCellClasses()} w-12" role="cell"></td>`
 : nothing}
 ${this.selectable && !isDraft
 ? html`
 <td class="${this.getCellClasses()} w-12" role="cell">
 <input
 type="checkbox"
 class="${this.getCheckboxClasses()}"
 .checked=${isSelected}
 @change=${(e: Event) => { e.stopPropagation(); this.handleRowSelect(row.index); }}
 aria-label="${this.msg.selectRow} ${row.index + 1}"
 ?disabled=${this.disabled}
 
 @input="${(e: Event) => e.stopPropagation()}"
/>
 </td>
 `
 : nothing}
 ${this.orderedColumns().map((col) => this.renderCell(row.cellEls[col.index], col))}
 ${this.hasRowActions ? this.renderRowActions(row, isDraft) : nothing}
 </tr>
 `;
 }

 /**
  * The row's actions area.
  *
  * Each `<RowAction>` gets its own wrapper, and the wrapper is what identifies the action. The
  * wrapper is rendered ALWAYS and hidden by CSS: making the anchor's existence conditional would
  * send the consumer's node back to the source and have it removed and reinserted on every change
  * of mode — the double-anchor family of defect, here alternating on every click.
  */
 private renderRowActions(row: ParsedRow, isDraft = false): TemplateResult {
 // The draft is always editing, so the `when` inference works with no change at all: the `edit`
 // actions show and the `view` ones stay hidden.
 const editing = isDraft ? true : this.isRowEditing(row.key);

 return html`
 <td class="${this.getCellClasses()} ml-table-actions" role="cell">
 <div class="ml-table-action-group">
 ${row.actionEls.map(
 (actionEl) => html`
 <span
 class="ml-table-action ${this.isActionVisible(actionEl, editing) ?'' :'ml-row-action-hidden'}"
 data-ml-table-control
 @click=${() => this.handleRowAction(row, actionEl, isDraft)}
 >
 ${this.renderLiveSlotFrom(actionEl)}
 </span>
 `
 )}
 </div>
 </td>
 `;
 }

 private renderCell(cell: Element | undefined, col: ParsedColumn): TemplateResult {
 return html` <td class="${this.getCellClasses()}" style=${this.columnStyle(col) || nothing} role="cell">${this.renderLiveSlotFrom(cell)}</td> `;
 }

 private renderEmpty(): TemplateResult {
 const colSpan = this.renderedColumnCount;
 const content = this.hasSlot('Empty') ? this.renderLiveSlot('Empty') : html`${this.msg.empty}`;

 return html`
 <tbody role="rowgroup">
 <tr role="row">
 <td colspan="${colSpan}" class="px-4 py-12 text-center ml-text-muted" role="cell">
 ${content}
 </td>
 </tr>
 </tbody>
 `;
 }

 private renderLoading(): TemplateResult {
 const colSpan = this.renderedColumnCount;

 if (this.hasSlot('Loading')) {
 return html`
 <tbody role="rowgroup">
 <tr role="row">
 <td colspan="${colSpan}" class="px-4 py-8" role="cell">${this.renderLiveSlot('Loading')}</td>
 </tr>
 </tbody>
 `;
 }

 return html`
 <tbody role="rowgroup">
 ${[1, 2, 3].map(
 () => html`
 <tr role="row" class="border-b ml-border">
 ${this.selectable
 ? html`
 <td class="px-4 py-3 w-12" role="cell">
 <div class="w-4 h-4 ml-surface-dim-bg rounded animate-pulse"></div>
 </td>
 `
 : nothing}
 ${this.parsedColumns.map(
 () => html`
 <td class="px-4 py-3" role="cell">
 <div class="h-4 ml-surface-dim-bg rounded animate-pulse"></div>
 </td>
 `
 )}
 ${this.hasRowActions
 ? html`
 <td class="px-4 py-3" role="cell">
 <div class="h-4 ml-surface-dim-bg rounded animate-pulse"></div>
 </td>
 `
 : nothing}
 </tr>
 `
 )}
 </tbody>
 `;
 }

 /**
  * Footer through a LIVE slot.
  *
  * It used to read `getSlot`, which returns the SNAPSHOT: the cells there are CLONES, and
  * `renderLiveSlotFrom` on a clone projects DEAD nodes — the button the consumer puts in the footer
  * rendered and called nothing. The base class is literal about it: "Pass the LIVE element (from
  * `getLiveSlot`), never a snapshot clone: a clone's children are copies, and moving copies
  * projects dead nodes."
  */
 private renderFooter(): TemplateResult | typeof nothing {
 const footerSlot = this.getLiveSlot('TableFooter');
 if (!footerSlot) return nothing;

 const footerRows = Array.from(footerSlot.querySelectorAll('TableRow'));
 // The new-record trigger is a DIRECT child of the footer, not a column cell: it spans the row.
 // Support for `TableRow > TableCell` stays, for the totals footer that already exists.
 const footerActions = Array.from(footerSlot.querySelectorAll(':scope > RowAction'));
 if (footerRows.length === 0 && footerActions.length === 0) return nothing;

 return html`
 <tfoot role="rowgroup" class="${cn('ml-surface-dim-bg', this.getSlotClass('TableFooter'))}">
 ${footerRows.map((row) => {
 const cells = Array.from(row.querySelectorAll('TableCell'));
 return html`
 <tr role="row" class="border-t ml-border">
 ${this.selectable ? html`<td class="px-4 py-3" role="cell"></td>` : nothing}
 ${cells.map(
 (cell) => html`
 <td
 class="${this.getCellClasses()}"
 role="cell"
 colspan=${cell.getAttribute('colspan') || nothing}
 >
 ${this.renderLiveSlotFrom(cell)}
 </td>
 `
 )}
 ${this.hasRowActions ? html`<td class="px-4 py-3" role="cell"></td>` : nothing}
 </tr>
 `;
 })}
 ${footerActions.length > 0
 ? html`
 <tr role="row" class="border-t ml-border">
 <td
 class="${this.getCellClasses()} ml-table-new-record"
 role="cell"
 colspan="${this.renderedColumnCount}"
 >
 ${footerActions.map(
 (actionEl) => html`
 <span
 class="ml-table-action"
 data-ml-table-control
 @click=${() => this.handleFooterAction(actionEl)}
 >
 ${this.renderLiveSlotFrom(actionEl)}
 </span>
 `
 )}
 </td>
 </tr>
 `
 : nothing}
 </tfoot>
 `;
 }

 private renderPagination(): TemplateResult | typeof nothing {
 if (this.pageSize <= 0) return nothing;

 const pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
 const showEllipsis = this.totalPages > 7;

 return html`
 <nav
 class="flex items-center justify-between px-4 py-3 ml-surface-bg border-t ml-border"
 role="navigation"
 aria-label=${this.msg.pagination}
 >
 <button
 class="${this.getPaginationButtonClasses(this.currentPage === 1)}"
 @click=${() => this.handlePageChange(this.currentPage - 1)}
 ?disabled=${this.currentPage === 1 || this.disabled}
 aria-label=${this.msg.previous}
 >
 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 ${svg`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>`}
 </svg>
 <span class="sr-only">${this.msg.previous}</span>
 </button>

 <div class="flex items-center gap-1">
 ${showEllipsis ? this.renderPaginationWithEllipsis() : pages.map((p) => this.renderPageButton(p))}
 </div>

 <button
 class="${this.getPaginationButtonClasses(this.currentPage === this.totalPages)}"
 @click=${() => this.handlePageChange(this.currentPage + 1)}
 ?disabled=${this.currentPage === this.totalPages || this.disabled}
 aria-label=${this.msg.next}
 >
 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 ${svg`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>`}
 </svg>
 <span class="sr-only">${this.msg.next}</span>
 </button>
 </nav>
 `;
 }

 private renderPaginationWithEllipsis(): TemplateResult {
 const pages: (number | string)[] = [];
 const current = this.currentPage;
 const total = this.totalPages;

 pages.push(1);

 if (current > 3) {
 pages.push('...');
 }

 for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
 pages.push(i);
 }

 if (current < total - 2) {
 pages.push('...');
 }

 if (total > 1) {
 pages.push(total);
 }

 return html`
 ${pages.map((p) =>
 typeof p ==='string'
 ? html`<span class="px-2 ml-text-faint">...</span>`
 : this.renderPageButton(p)
 )}
 `;
 }

 private renderPageButton(pageNum: number): TemplateResult {
 const isActive = pageNum === this.currentPage;
 const classes = [
'min-w-[2rem] h-8 px-2 text-sm font-medium rounded transition-colors',
 isActive
 ?'ml-primary-bg text-white'
 :'ml-text hover:ml-surface-dim-bg',
 this.disabled ?'ml-disabled' :'cursor-pointer',
 ].join(' ');

 return html`
 <button
 class="${classes}"
 @click=${() => this.handlePageChange(pageNum)}
 ?disabled=${this.disabled}
 aria-label="${this.msg.page} ${pageNum}"
 aria-current=${isActive ?'page' : nothing}
 >
 ${pageNum}
 </button>
 `;
 }

 private getPaginationButtonClasses(isDisabled: boolean): string {
 return [
'p-2 rounded transition-colors',
'ml-text-muted',
 isDisabled
 ?'ml-disabled'
 :'hover:ml-surface-dim-bg cursor-pointer',
 ].join(' ');
 }

 private renderError(): TemplateResult | typeof nothing {
 if (!this.error) return nothing;

 return html`
 <div class="px-4 py-3 text-sm ml-error-text ml-error-dim-bg border-t ml-border-error">
 ${this.error}
 </div>
 `;
 }

 // ===========================================================================
 // RENDER
 // ===========================================================================
 /**
  * Reading the structure moves out of here and into `willUpdate`, which is Lit's place to derive
  * state before the render: writing a reactive property inside `render()` schedules another cycle,
  * and `parsedRows`/`sortedRowIndices` are reactive.
  */
 willUpdate() {
 this.parseTableStructure();
 }

 render() {
 const lang = this.getMessageKey(messages);
 this.msg = messages[lang];

 return html`
 <div
 class="${cn('overflow-hidden rounded-lg border ml-border ml-surface-bg', this.resizingKey ?'ml-table-resizing' :'', this.cssClass)}"
 @keydown=${this.handleKeyDown}
 >
 <div class="overflow-x-auto">
 <table class="${this.getTableClasses()}" role="table">
 ${this.renderCaption()} ${this.renderHeader()} ${this.loading ? this.renderLoading() : this.renderBody()}
 ${this.renderFooter()}
 </table>
 </div>
 ${this.renderPagination()} ${this.renderError()}
 </div>
 `;
 }
}
