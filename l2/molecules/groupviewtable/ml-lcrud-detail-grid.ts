/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-lcrud-detail-grid.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, nothing, svg, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/shared/molecules/cn.js';
import { cellSortKey, compareSortKeys } from '/_102033_/l2/shared/molecules/tableSort.js';

/// **collab_i18n_start**
const message_en = {
  noRecords: 'No records found',
  loading: 'Loading...',
  selectAll: 'Select all rows',
  selectRow: 'Select row',
  openRecord: 'Open record',
  backToList: 'Back to the list',
  recordDetail: 'Record detail',
  pagination: 'Table pagination',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  page: 'Page',
  of: 'of',
  sortAsc: 'sorted ascending',
  sortDesc: 'sorted descending',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    noRecords: 'Nenhum registro encontrado',
    loading: 'Carregando...',
    selectAll: 'Selecionar todas as linhas',
    selectRow: 'Selecionar linha',
    openRecord: 'Abrir registro',
    backToList: 'Voltar para a lista',
    recordDetail: 'Detalhe do registro',
    pagination: 'Pagina\u00e7\u00e3o da tabela',
    previousPage: 'P\u00e1gina anterior',
    nextPage: 'Pr\u00f3xima p\u00e1gina',
    page: 'P\u00e1gina',
    of: 'de',
    sortAsc: 'ordenado ascendente',
    sortDesc: 'ordenado descendente',
  },
};
/// **collab_i18n_end**

// =============================================================================
// LCRUD DETAIL GRID MOLECULE
// =============================================================================
// Skill Group: groupViewTable
// A sortable, pageable list whose record detail opens as a SCENE OF ITS OWN, replacing the list,
// instead of an accordion row. Built for editing a record on a full screen — the mobile
// master-detail pattern — and usable for detailed viewing as well.
// This molecule does NOT contain business logic.
//
// Two things separate it from `ml-lazy-record-detail-table`, which reads the same `<Detail>` slot:
//
// 1. The control sits at the END of the row and points RIGHT — it navigates somewhere, it does not
//    open something underneath. The direction carries the meaning.
// 2. Opening does not remove the list: the table is HIDDEN with `hidden`, never unrendered. That is
//    what "going back does not repaint" means here — page, sort order, selection, focus and scroll
//    are all still there because nothing was destroyed. Unrendering would also disconnect every
//    nested molecule in the cells and re-run the inert check on the way back.

interface HeaderCell {
  key: string;
  label: string;
  sortable: boolean;
  element: Element | null;
}

interface BodyRow {
  index: number;
  cells: Element[];
  element: Element;
  /**
   * The row's `<Detail>`, when the consumer declared one. It is what the scene shows — text, a
   * form, another table.
   *
   * It must be a source of its OWN: never rebuild the detail out of the row's `<TableCell>` nodes.
   * A live slot moves nodes and the anchor is keyed by source element, so the same cell projected
   * in two places shares one key and the second anchor steals the nodes from the first, emptying
   * the visible row.
   */
  detailEl: Element | null;
}

@customElement('groupviewtable--ml-lcrud-detail-grid')
export class MlLcrudDetailGridMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = [
    'Caption',
    'TableHeader',
    'TableBody',
    'TableRow',
    'TableHead',
    'TableCell',
    'TableFooter',
    'Empty',
    'Loading',
    // Conteúdo que aparece ao expandir a linha. Vai DENTRO da <TableRow>, ao lado das
    // <TableCell>, e é preenchido pelo consumidor depois do `rowClick` — o fluxo lazy.
    'Detail',
  ];

  /** Live slots preserve nested interactive components inside cells and details. */
  protected usesLiveSlots = true;

  // ===========================================================================
  // PROPERTIES \u2014 From Contract
  // ===========================================================================

  @propertyDataSource({ type: Boolean })
  selectable: boolean = false;

  @propertyDataSource({ type: Boolean, attribute: 'is-editing' })
  isEditing: boolean = false;

  @propertyDataSource({ type: Number })
  page: number = 1;

  @propertyDataSource({ type: Number, attribute: 'page-size' })
  pageSize: number = 0;

  @propertyDataSource({ type: Number, attribute: 'total-items' })
  totalItems: number = 0;

  @propertyDataSource({ type: String })
  value: string = '';

  @propertyDataSource({ type: String })
  error: string = '';

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
  private sortDirection: string = 'asc';

  /**
   * The record whose scene is open, by original-order index — or `null` for the list.
   *
   * A single index, not a set: the scene takes the whole surface, so two records cannot be open at
   * once. This is the only piece of state the scene needs; everything the list holds (page, sort,
   * selection, focus) stays untouched, which is why going back costs nothing.
   */
  @state()
  private openIndex: number | null = null;

  /** Keyboard-focused row index within the currently visible page. */
  @state()
  private focusedRowIndex: number = -1;

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================

  firstUpdated() {
    this.propagateEditing();
  }

  updated(changedProps: Map<string, unknown>) {
    // Also on `openIndex`: the scene's content only exists in the DOM after it opens, so a record
    // opened while `isEditing` was already true would never receive the attribute.
    if (changedProps.has('isEditing') || changedProps.has('openIndex')) {
      this.propagateEditing();
    }
    this.watchScene();
  }

  disconnectedCallback() {
    this.sceneObserver?.disconnect();
    this.sceneObserver = null;
    super.disconnectedCallback();
  }

  handleIcaStateChange(key: string, _value: any) {
    const isEditingAttr = this.getAttribute('is-editing');
    if (isEditingAttr === `{{${key}}}`) {
      this.propagateEditing();
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // IS-EDITING PROPAGATION
  // ===========================================================================

  private propagateEditing() {
    const flag = this.isEditing ? 'true' : 'false';
    this.propagateEditingToScene(flag);
    const body = this.getLiveSlot('TableBody');
    if (!body) return;
    const cells = body.querySelectorAll('TableCell');
    cells.forEach((cell) => {
      cell.querySelectorAll('*').forEach((el) => {
        if (el.tagName.includes('-')) this.setEditingFlag(el, flag);
      });
    });
  }

  /**
   * Propagates into the OPEN SCENE, reading the projected nodes and not the source.
   *
   * The source `<Detail>` is empty once projected — its children were moved into the anchor — so
   * querying it would find nothing. This runs from `updated()`, after `update()` has projected.
   */
  private propagateEditingToScene(flag: string) {
    const scene = this.querySelector('.ml-grid-scene-body');
    if (!scene) return;
    scene.querySelectorAll('*').forEach((el) => {
      if (el.tagName.includes('-')) this.setEditingFlag(el, flag);
    });
  }

  /**
   * Writes `is-editing` and MAKES THE ELEMENT RE-RENDER.
   *
   * Setting the attribute alone is not enough, and the reason is subtle: Lit's Boolean converter is
   * `v => v !== null`, so the attribute "false" and the attribute "true" both reach the property
   * setter as `true`. The value does not change, `hasChanged` says no, and the element never
   * re-renders — while the collab getter, which reads the ATTRIBUTE and honours the literal
   * "false", now disagrees with what is on screen.
   *
   * The asymmetry that exposed it: going to read mode appeared to work, because it happens right
   * after saving, when other bindings change and force a render anyway. Going back to edit mode
   * changes nothing else, so the stale view stayed. Measured on 2026-08-05 with
   * `demotable--funcionariosdetalhe`.
   */
  private setEditingFlag(el: Element, flag: string) {
    if (el.getAttribute('is-editing') === flag) return;
    el.setAttribute('is-editing', flag);
    (el as unknown as { requestUpdate?: () => void }).requestUpdate?.();
  }

  private sceneObserver: MutationObserver | null = null;

  /**
   * Watches the scene for content that arrives LATE, and re-applies the editing flag.
   *
   * Propagating only when `isEditing`/`openIndex` change is not enough, and this is the reason:
   * the scene's content belongs to the consumer and typically arrives one round later — after
   * `rowClick`, when the fetch returns. Those nodes are created INSIDE the anchor, where the
   * consumer's own Lit render puts them, so nothing about them reaches this molecule: they are not
   * inside a slot tag, so the base class's observer ignores them, and no property of ours changed.
   * A field born after the last sweep keeps its own default — and every field molecule in this
   * library defaults to `isEditing = true`, so a record opened for READING would show a form.
   * Measured on 2026-08-05 with `demotable--funcionariosdetalhe`.
   *
   * Only `childList`/`subtree`: the attribute writes are ours, and observing attributes would make
   * this re-enter on its own changes.
   */
  private watchScene() {
    this.sceneObserver?.disconnect();
    const scene = this.querySelector('.ml-grid-scene-body');
    if (!scene) {
      this.sceneObserver = null;
      return;
    }
    this.sceneObserver = new MutationObserver(() => {
      this.propagateEditingToScene(this.isEditing ? 'true' : 'false');
    });
    this.sceneObserver.observe(scene, { childList: true, subtree: true });
    // Primeira aplicação: o conteúdo pode já estar aqui quando a âncora nasce.
    this.propagateEditingToScene(this.isEditing ? 'true' : 'false');
  }

  // ===========================================================================
  // PARSERS
  // ===========================================================================

  private parseHeaders(): HeaderCell[] {
    const header = this.getLiveSlot('TableHeader');
    if (!header) return [];
    const row = header.querySelector('TableRow');
    if (!row) return [];
    return Array.from(row.querySelectorAll('TableHead')).map((th) => ({
      key: th.getAttribute('key') || '',
      label: (th.textContent || '').trim(),
      sortable: th.hasAttribute('sortable'),
      element: th,
    }));
  }

  // Sem o fallback `|| this.getSlot(...)`: o `getSlot` lê do SNAPSHOT, e molécula que projeta não
  // pode ler de lá — a origem fica vazia depois da projeção e um re-snapshot leria vazio.
  private parseBodyRows(): BodyRow[] {
    const body = this.getLiveSlot('TableBody');
    if (!body) return [];
    return Array.from(body.querySelectorAll(':scope > TableRow')).map((row, index) => ({
      index,
      cells: Array.from(row.querySelectorAll(':scope > TableCell')),
      element: row,
      detailEl: row.querySelector(':scope > Detail'),
    }));
  }

  private parseFooterRows(): BodyRow[] {
    const footer = this.getLiveSlot('TableFooter');
    if (!footer) return [];
    return Array.from(footer.querySelectorAll(':scope > TableRow')).map((row, index) => ({
      index,
      cells: Array.from(row.querySelectorAll(':scope > TableCell')),
      element: row,
      detailEl: null,
    }));
  }

  private getSelectedSet(): Set<number> {
    const raw = String(this.value ?? '').trim();
    if (!raw) return new Set();
    return new Set(
      raw
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n))
    );
  }

  // ===========================================================================
  // SORTING
  // ===========================================================================

  /** Cell key, with the text taken from the projected nodes — the source is empty once projected. */
  private sortValueOf(cell: Element | undefined): string {
    return cellSortKey(cell, this.getLiveText(cell));
  }

  private getSortedRows(rows: BodyRow[], headers: HeaderCell[]): BodyRow[] {
    if (!this.sortKey) return rows;
    const colIndex = headers.findIndex((h) => h.key === this.sortKey);
    if (colIndex < 0) return rows;

    const dir = this.sortDirection === 'asc' ? 1 : -1;
    return [...rows].sort(
      (a, b) =>
        compareSortKeys(this.sortValueOf(a.cells[colIndex]), this.sortValueOf(b.cells[colIndex])) *
        dir
    );
  }

  private handleSort(key: string) {
    if (this.disabled || this.loading) return;
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.dispatchEvent(
      new CustomEvent('sort', {
        bubbles: true,
        composed: true,
        detail: { key: this.sortKey, direction: this.sortDirection },
      })
    );
  }

  // ===========================================================================
  // SELECTION
  // ===========================================================================

  private emitChange(selected: Set<number>) {
    const next = Array.from(selected)
      .sort((a, b) => a - b)
      .join(',');
    this.value = next;
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: next },
      })
    );
  }

  private handleToggleRow(index: number, e?: Event) {
    if (e) e.stopPropagation();
    if (this.disabled || this.loading || !this.selectable) return;
    const selected = this.getSelectedSet();
    if (selected.has(index)) {
      selected.delete(index);
    } else {
      selected.add(index);
    }
    this.emitChange(selected);
  }

  private handleToggleAll(visibleRows: BodyRow[]) {
    if (this.disabled || this.loading || !this.selectable) return;
    const selected = this.getSelectedSet();
    const indices = visibleRows.map((r) => r.index);
    const allSelected = indices.length > 0 && indices.every((i) => selected.has(i));
    if (allSelected) {
      indices.forEach((i) => selected.delete(i));
    } else {
      indices.forEach((i) => selected.add(i));
    }
    this.emitChange(selected);
  }

  // ===========================================================================
  // SCENE (record detail)
  // ===========================================================================

  private handleOpenRecord(index: number, e?: Event) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (this.disabled || this.loading) return;
    if (this.openIndex === index) return;

    this.openIndex = index;
    // Same contract as the accordion sibling: `rowClick` is the signal for the consumer to load
    // this record's detail on demand and write it inside that row's `<Detail>`.
    this.dispatchEvent(
      new CustomEvent('rowClick', {
        bubbles: true,
        composed: true,
        detail: { index },
      })
    );
  }

  /**
   * Back to the list.
   *
   * Emits NOTHING on purpose. `pageChange` would be the wrong signal — a consumer in EXTERNAL mode
   * reacts to it by requerying and rewriting `<TableBody>`, which is exactly the repaint this
   * molecule exists to avoid, and it would say "the page changed" when it did not. A dedicated
   * event can be added to the group contract later, when a consumer actually needs it.
   */
  private handleBackToList(e?: Event) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.openIndex = null;
  }

  // ===========================================================================
  // PAGINATION
  // ===========================================================================

  /**
   * Total pages, counting the rows in INTERNAL mode.
   *
   * `total-items` unset means the consumer wrote the WHOLE set in `<TableBody>`, so the row count
   * is the total — §9.1 of the group contract. Returning 1 here (the previous behaviour) made the
   * two halves of pagination disagree: `render()` still sliced to `pageSize`, but the control was
   * born with "next" disabled, and `handlePageChange` clamped every page to 1. With 8 rows and
   * `page-size="5"`, the last 3 were rendered nowhere and unreachable. Measured on 2026-08-05 with
   * `demotable--pedidosdetalhe`.
   */
  private getTotalPages(): number {
    const size = Number(this.pageSize) || 0;
    if (size <= 0) return 1;
    const declared = Number(this.totalItems) || 0;
    const total = declared > 0 ? declared : this.parseBodyRows().length;
    if (total <= 0) return 1;
    return Math.max(1, Math.ceil(total / size));
  }

  private handlePageChange(nextPage: number) {
    if (this.disabled || this.loading) return;
    const totalPages = this.getTotalPages();
    const page = Math.min(Math.max(1, nextPage), totalPages);
    if (page === this.page) return;
    this.page = page;
    this.focusedRowIndex = -1;
    this.dispatchEvent(
      new CustomEvent('pageChange', {
        bubbles: true,
        composed: true,
        detail: { page },
      })
    );
  }

  // ===========================================================================
  // KEYBOARD NAVIGATION
  // ===========================================================================

  private handleTableKeyDown(e: KeyboardEvent, visibleRows: BodyRow[]) {
    if (this.disabled || this.loading) return;
    const count = visibleRows.length;
    if (count === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.focusedRowIndex =
        this.focusedRowIndex < 0 ? 0 : Math.min(this.focusedRowIndex + 1, count - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.focusedRowIndex =
        this.focusedRowIndex < 0 ? count - 1 : Math.max(this.focusedRowIndex - 1, 0);
    } else if (e.key === ' ' || e.key === 'Spacebar') {
      if (this.focusedRowIndex >= 0 && this.focusedRowIndex < count && this.selectable) {
        e.preventDefault();
        this.handleToggleRow(visibleRows[this.focusedRowIndex].index);
      }
    } else if (e.key === 'Enter') {
      if (this.focusedRowIndex >= 0 && this.focusedRowIndex < count) {
        e.preventDefault();
        this.handleOpenRecord(visibleRows[this.focusedRowIndex].index);
      }
    }
  }

  private handleHeaderKeyDown(e: KeyboardEvent, key: string, sortable: boolean) {
    if (!sortable || this.disabled || this.loading) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.handleSort(key);
    }
  }

  // ===========================================================================
  // CLASS HELPERS
  // ===========================================================================

  private getRootClasses(): string {
    return cn(
      [
        'flex w-full flex-col gap-2',
        'ml-table-root',
        this.disabled ? 'ml-disabled' : '',
      ]
        .filter(Boolean)
        .join(' '),
      this.cssClass
    );
  }

  private getTableWrapClasses(): string {
    return ['w-full overflow-x-auto', 'ml-table-wrap'].filter(Boolean).join(' ');
  }

  private getTableClasses(): string {
    return ['w-full border-collapse text-sm', 'ml-table'].filter(Boolean).join(' ');
  }

  private getHeadCellClasses(header: HeaderCell): string {
    const isActive = this.sortKey === header.key;
    return [
      'px-3 py-2 text-left font-semibold',
      'ml-table-head',
      header.sortable ? 'ml-table-head-sortable cursor-pointer select-none' : '',
      isActive ? 'ml-table-head-sorted' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getBodyRowClasses(isSelected: boolean, isFocused: boolean): string {
    return [
      'ml-table-row',
      isSelected ? 'ml-table-row-selected' : '',
      isFocused ? 'ml-table-row-focused' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getOpenBtnClasses(): string {
    return [
      'inline-flex items-center justify-center w-7 h-7 rounded-md',
      'ml-grid-open-btn',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getSceneClasses(): string {
    return ['flex w-full flex-col gap-3', 'ml-grid-scene'].filter(Boolean).join(' ');
  }

  private getBackBtnClasses(): string {
    return [
      'inline-flex items-center gap-1 h-8 px-2 rounded-md text-sm',
      'ml-grid-back-btn',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getCheckboxClasses(): string {
    return ['ml-table-checkbox'].filter(Boolean).join(' ');
  }

  private getPaginationClasses(): string {
    return [
      'flex w-full items-center justify-between gap-2 px-1 py-2 text-sm',
      'ml-table-pagination',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getPageBtnClasses(active: boolean, navDisabled: boolean): string {
    return [
      'inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-md text-sm',
      'ml-table-page-btn',
      active ? 'ml-table-page-btn-active' : '',
      navDisabled ? 'ml-disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  // ===========================================================================
  // SVG ICONS
  // ===========================================================================

  /**
   * Chevron pointing RIGHT, and it never rotates.
   *
   * The accordion sibling points DOWN because the content opens underneath. Here the record opens
   * elsewhere, so the arrow reads as navigation. There is no open state to show in the list either
   * — when a record is open, the list is not on screen.
   */
  private renderOpenIcon(): TemplateResult {
    return html`
      <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        ${
svg`<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />`}
      </svg>
    `;
  }

  /** Chevron pointing LEFT, for the back control. */
  private renderBackIcon(): TemplateResult {
    return html`
      <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        ${
svg`<path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />`}
      </svg>
    `;
  }

  private renderSortIcon(key: string): TemplateResult {
    if (this.sortKey !== key) {
      return html`
        <svg class="w-3.5 h-3.5 ml-1 inline-block opacity-40" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          ${
svg`<path d="M5 8l5-5 5 5H5zm0 4l5 5 5-5H5z" />`}
        </svg>
      `;
    }
    if (this.sortDirection === 'asc') {
      return html`
        <svg class="w-3.5 h-3.5 ml-1 inline-block" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          ${
svg`<path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />`}
        </svg>
      `;
    }
    return html`
      <svg class="w-3.5 h-3.5 ml-1 inline-block" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        ${
svg`<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />`}
      </svg>
    `;
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================

  private renderCaption(): TemplateResult {
    if (!this.hasSlot('Caption')) return html``;
    return html`
      <caption class=${cn('text-left px-3 py-2 text-sm font-semibold ml-label', this.getSlotClass('Caption'))}>
        ${this.renderLiveSlot('Caption')}
      </caption>
    `;
  }

  private renderSelectAllCell(visibleRows: BodyRow[]): TemplateResult {
    if (!this.selectable) return html``;
    const selected = this.getSelectedSet();
    const indices = visibleRows.map((r) => r.index);
    const allSelected = indices.length > 0 && indices.every((i) => selected.has(i));
    const someSelected = indices.some((i) => selected.has(i)) && !allSelected;

    return html`
      <th class="w-10 px-2 py-2 ml-table-head ml-table-select-cell" scope="col">
        <input
          type="checkbox"
          class=${this.getCheckboxClasses()}
          .checked=${allSelected}
          .indeterminate=${someSelected}
          ?disabled=${this.disabled || this.loading}
          aria-label=${this.msg.selectAll}
          @change=${(e: Event) => {
            e.stopPropagation();
            this.handleToggleAll(visibleRows);
          }}
          @input=${(e: Event) => e.stopPropagation()}
          @click=${(e: Event) => e.stopPropagation()}
        />
      </th>
    `;
  }

  private renderOpenHeadCell(): TemplateResult {
    // Untitled control column, LAST — it opens the record's scene.
    return html`
      <th class="w-10 px-2 py-2 ml-table-head ml-grid-open-cell" scope="col">
        <span class="sr-only">${this.msg.openRecord}</span>
      </th>
    `;
  }

  private renderHeader(headers: HeaderCell[], visibleRows: BodyRow[]): TemplateResult {
    return html`
      <thead class="ml-table-thead" role="rowgroup">
        <tr class="ml-table-header-row" role="row">
          ${this.renderSelectAllCell(visibleRows)}
          ${headers.map((header) => {
            const isActive = this.sortKey === header.key;
            const ariaSort = !header.sortable
              ? nothing
              : isActive
                ? this.sortDirection === 'asc'
                  ? 'ascending'
                  : 'descending'
                : 'none';
            return html`
              <th
                class=${this.getHeadCellClasses(header)}
                scope="col"
                role="columnheader"
                aria-sort=${ariaSort}
                tabindex=${header.sortable && !this.disabled ? '0' : nothing}
                @click=${() => header.sortable && this.handleSort(header.key)}
                @keydown=${(e: KeyboardEvent) =>
                  this.handleHeaderKeyDown(e, header.key, header.sortable)}
              >
                <span class="inline-flex items-center">
                  ${header.element
                    ? this.renderLiveSlotFrom(header.element)
                    : html`${header.label}`}
                  ${header.sortable ? this.renderSortIcon(header.key) : nothing}
                </span>
              </th>
            `;
          })}
          ${this.renderOpenHeadCell()}
        </tr>
      </thead>
    `;
  }

  private renderSelectCell(rowIndex: number, isSelected: boolean): TemplateResult {
    if (!this.selectable) return html``;
    return html`
      <td class="w-10 px-2 py-2 ml-table-cell ml-table-select-cell" role="cell">
        <input
          type="checkbox"
          class=${this.getCheckboxClasses()}
          .checked=${isSelected}
          ?disabled=${this.disabled || this.loading}
          aria-label=${`${this.msg.selectRow} ${rowIndex + 1}`}
          @change=${(e: Event) => this.handleToggleRow(rowIndex, e)}
          @input=${(e: Event) => e.stopPropagation()}
          @click=${(e: Event) => e.stopPropagation()}
        />
      </td>
    `;
  }

  private renderOpenCell(rowIndex: number): TemplateResult {
    // No `aria-expanded`: nothing expands here. The button navigates to the record's scene.
    return html`
      <td class="w-10 px-2 py-2 ml-table-cell ml-grid-open-cell" role="cell">
        <button
          type="button"
          class=${this.getOpenBtnClasses()}
          ?disabled=${this.disabled || this.loading}
          aria-label=${`${this.msg.openRecord} ${rowIndex + 1}`}
          @click=${(e: Event) => this.handleOpenRecord(rowIndex, e)}
        >
          ${this.renderOpenIcon()}
        </button>
      </td>
    `;
  }

  private renderDataCells(cells: Element[]): TemplateResult[] {
    return cells.map(
      (cell) => html`
        <td class=${cn('px-3 py-2 ml-table-cell', (cell as HTMLElement).getAttribute('data-class') || '')} role="cell">
          ${this.renderLiveSlotFrom(cell)}
        </td>
      `
    );
  }

  /**
   * The scene: the open record's `<Detail>`, projected live, with a frame around it.
   *
   * The frame is only a heading and the back control — everything else is the consumer's, inside
   * the `<Detail>`, including save and cancel. The heading comes from `<Detail label="…">`: the
   * molecule cannot know which column names the record, and reading the first cell would produce
   * the composite text of an avatar plus name plus e-mail.
   *
   * Without a `<Detail>` the body stays empty, which is the right state while the consumer is
   * still fetching after `rowClick`.
   */
  private renderScene(row: BodyRow): TemplateResult {
    const label = (row.detailEl?.getAttribute('label') || '').trim();

    return html`
      <section
        class=${this.getSceneClasses()}
        role="region"
        aria-label=${label || this.msg.recordDetail}
        data-scene-for=${row.index}
      >
        <header class="flex items-center gap-2 ml-grid-scene-head">
          <button
            type="button"
            class=${this.getBackBtnClasses()}
            aria-label=${this.msg.backToList}
            @click=${(e: Event) => this.handleBackToList(e)}
          >
            ${this.renderBackIcon()}
            <span>${this.msg.backToList}</span>
          </button>
          ${label
            ? html`<h3 class="text-sm font-semibold ml-grid-scene-title">${label}</h3>`
            : nothing}
        </header>
        <div class="ml-grid-scene-body">
          ${row.detailEl ? this.renderLiveSlotFrom(row.detailEl) : nothing}
        </div>
      </section>
    `;
  }

  private renderBodyRow(
    row: BodyRow,
    visibleIndex: number,
    selected: Set<number>
  ): TemplateResult {
    const isSelected = selected.has(row.index);
    const isFocused = this.focusedRowIndex === visibleIndex;

    return html`
      <tr
        class=${this.getBodyRowClasses(isSelected, isFocused)}
        role="row"
        tabindex=${!this.disabled ? '0' : nothing}
        aria-selected=${this.selectable ? (isSelected ? 'true' : 'false') : nothing}
        data-row-index=${row.index}
        @click=${(e: Event) => {
          // Ignore clicks originating from interactive controls inside the row
          const target = e.target as HTMLElement;
          if (
            target.closest('button, input, a, select, textarea, [role="button"]')
          ) {
            return;
          }
        }}
      >
        ${this.renderSelectCell(row.index, isSelected)}
        ${this.renderDataCells(row.cells)}
        ${this.renderOpenCell(row.index)}
      </tr>
    `;
  }

  private renderBody(
    rows: BodyRow[],
    headers: HeaderCell[],
    selected: Set<number>
  ): TemplateResult {
    // Optional select col + data columns + the trailing open col
    const colSpan = (this.selectable ? 1 : 0) + headers.length + 1;

    if (rows.length === 0) {
      return html`
        <tbody class="ml-table-tbody" role="rowgroup">
          <tr class="ml-table-empty-row" role="row">
            <td class="px-3 py-6 text-center ml-table-cell ml-text-muted" role="cell" colspan=${colSpan}>
              ${this.renderEmptyContent()}
            </td>
          </tr>
        </tbody>
      `;
    }

    return html`
      <tbody class="ml-table-tbody" role="rowgroup">
        ${rows.map((row, i) => this.renderBodyRow(row, i, selected))}
      </tbody>
    `;
  }

  private renderFooter(headers: HeaderCell[]): TemplateResult {
    const footerRows = this.parseFooterRows();
    if (footerRows.length === 0) return html``;
    // Only the selection column pads on the LEFT now; the control column is at the end, so the
    // footer closes with one empty cell instead of opening with it.
    const colPad = this.selectable ? 1 : 0;

    return html`
      <tfoot class="ml-table-tfoot" role="rowgroup">
        ${footerRows.map(
          (row) => html`
            <tr class="ml-table-footer-row" role="row">
              ${colPad > 0
                ? html`<td class="ml-table-cell" role="cell" colspan=${colPad}></td>`
                : nothing}
              ${row.cells.map(
                (cell) => html`
                  <td
                    class=${cn(
                      'px-3 py-2 ml-table-cell ml-table-footer-cell',
                      (cell as HTMLElement).getAttribute('data-class') || ''
                    )}
                    role="cell"
                  >
                    ${this.renderLiveSlotFrom(cell)}
                  </td>
                `
              )}
              <td class="ml-table-cell ml-grid-open-cell" role="cell"></td>
            </tr>
          `
        )}
      </tfoot>
    `;
  }

  private renderEmptyContent(): TemplateResult {
    if (this.hasSlot('Empty')) {
      return html`
        <div class=${cn('ml-table-empty', this.getSlotClass('Empty'))}>
          ${this.renderLiveSlot('Empty')}
        </div>
      `;
    }
    return html`<span class="ml-text-muted">${this.msg.noRecords}</span>`;
  }

  private renderLoading(): TemplateResult {
    if (this.hasSlot('Loading')) {
      return html`
        <div class=${cn('w-full p-4 ml-table-loading', this.getSlotClass('Loading'))}>
          ${this.renderLiveSlot('Loading')}
        </div>
      `;
    }
    return html`
      <div class="w-full flex flex-col gap-2 p-4 ml-table-loading" aria-busy="true" aria-live="polite">
        ${[0, 1, 2].map(
          () => html`
            <div class="w-full h-10 rounded-md ml-skeleton"></div>
          `
        )}
        <span class="sr-only">${this.msg.loading}</span>
      </div>
    `;
  }

  private renderError(): TemplateResult {
    const err = String(this.error ?? '').trim();
    if (!err) return html``;
    return html`
      <p class="mt-1 text-xs ml-error-text" role="alert">${unsafeHTML(err)}</p>
    `;
  }

  private renderPagination(): TemplateResult {
    const size = Number(this.pageSize) || 0;
    if (size <= 0) return html``;

    const totalPages = this.getTotalPages();
    const current = Math.min(Math.max(1, Number(this.page) || 1), totalPages);
    const prevDisabled = this.disabled || this.loading || current <= 1;
    const nextDisabled = this.disabled || this.loading || current >= totalPages;

    // Build a compact page list around the current page
    const pages: number[] = [];
    const windowSize = 5;
    let start = Math.max(1, current - Math.floor(windowSize / 2));
    let end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    for (let p = start; p <= end; p++) pages.push(p);

    return html`
      <nav
        class=${this.getPaginationClasses()}
        role="navigation"
        aria-label=${this.msg.pagination}
      >
        <span class="ml-text-muted text-xs">
          ${this.msg.page} ${current} ${this.msg.of} ${totalPages}
        </span>
        <div class="flex items-center gap-1">
          <button
            type="button"
            class=${this.getPageBtnClasses(false, prevDisabled)}
            ?disabled=${prevDisabled}
            aria-label=${this.msg.previousPage}
            @click=${() => this.handlePageChange(current - 1)}
          >
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              ${
svg`<path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />`}
            </svg>
          </button>
          ${pages.map(
            (p) => html`
              <button
                type="button"
                class=${this.getPageBtnClasses(p === current, this.disabled || this.loading)}
                ?disabled=${this.disabled || this.loading}
                aria-label=${`${this.msg.page} ${p}`}
                aria-current=${p === current ? 'page' : nothing}
                @click=${() => this.handlePageChange(p)}
              >
                ${p}
              </button>
            `
          )}
          <button
            type="button"
            class=${this.getPageBtnClasses(false, nextDisabled)}
            ?disabled=${nextDisabled}
            aria-label=${this.msg.nextPage}
            @click=${() => this.handlePageChange(current + 1)}
          >
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              ${
svg`<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />`}
            </svg>
          </button>
        </div>
      </nav>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================

  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    const headers = this.parseHeaders();
    const allRows = this.parseBodyRows();

    // Em modo EXTERNO a molécula não reordena: ela recebeu só a página corrente, e ordenar aqui
    // ordenaria 10 linhas de 60. O evento `sort` continua saindo para o consumidor reconsultar.
    // Mesma regra da ml-data-table-minimal e da ml-responsive-data-table.
    const externo = Number(this.totalItems) > allRows.length;
    const sortedRows = externo ? allRows : this.getSortedRows(allRows, headers);
    const selected = this.getSelectedSet();

    // When pageSize > 0 and totalItems is managed externally, body already holds
    // the current page's rows. Local slice only applies when totalItems is unset
    // and the full dataset is present in TableBody.
    let visibleRows = sortedRows;
    const size = Number(this.pageSize) || 0;
    const total = Number(this.totalItems) || 0;
    if (size > 0 && total <= 0 && sortedRows.length > size) {
      const current = Math.max(1, Number(this.page) || 1);
      const start = (current - 1) * size;
      visibleRows = sortedRows.slice(start, start + size);
    }

    // The open record is looked up among ALL rows, not the visible ones: the consumer may reorder
    // or repaginate while the scene is open, and the scene must keep showing the record it opened.
    const openRow =
      this.openIndex === null ? null : allRows.find((r) => r.index === this.openIndex) ?? null;

    return html`
      <div
        class=${this.getRootClasses()}
        @keydown=${(e: KeyboardEvent) => this.handleTableKeyDown(e, visibleRows)}
      >
        ${this.loading
          ? this.renderLoading()
          : html`
              <!--
                The list is HIDDEN, never unrendered, and that is the whole point of this molecule.
                \`hidden\` keeps page, sort order, selection, focus and scroll intact, and keeps every
                nested molecule in the cells connected — unrendering would disconnect them and
                re-run the inert check when the user comes back. It must be \`hidden\`/\`display:none\`
                and not \`visibility\`/\`opacity\`, or the screen reader and Tab would still reach a
                list that is not on screen.
              -->
              <div class=${this.getTableWrapClasses()} ?hidden=${openRow !== null}>
                <table
                  class=${this.getTableClasses()}
                  role="table"
                  aria-busy=${this.loading ? 'true' : 'false'}
                  aria-disabled=${this.disabled ? 'true' : 'false'}
                >
                  ${this.renderCaption()}
                  ${this.renderHeader(headers, visibleRows)}
                  ${this.renderBody(visibleRows, headers, selected)}
                  ${this.renderFooter(headers)}
                </table>
              </div>
              <div ?hidden=${openRow !== null}>${this.renderPagination()}</div>
              ${openRow ? this.renderScene(openRow) : nothing}
            `}
        ${this.renderError()}
      </div>
    `;
  }
}
