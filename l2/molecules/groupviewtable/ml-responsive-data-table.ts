/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-responsive-data-table.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, nothing, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  loading: 'Loading...',
  empty: 'No records found',
  selectAll: 'Select all rows',
  selectRow: 'Select row',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  pagination: 'Table pagination',
  pageOf: 'Page',
  of: 'of',
  sortAsc: 'sorted ascending',
  sortDesc: 'sorted descending',
  sortable: 'sortable',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    loading: 'Carregando...',
    empty: 'Nenhum registro encontrado',
    selectAll: 'Selecionar todas as linhas',
    selectRow: 'Selecionar linha',
    previousPage: 'Página anterior',
    nextPage: 'Próxima página',
    pagination: 'Paginação da tabela',
    pageOf: 'Página',
    of: 'de',
    sortAsc: 'ordenado ascendente',
    sortDesc: 'ordenado descendente',
    sortable: 'ordenável',
  },
};
/// **collab_i18n_end**

// =============================================================================
// RESPONSIVE DATA TABLE MOLECULE
// =============================================================================
// Skill Group: groupViewTable
// This molecule does NOT contain business logic.

interface ColumnMeta {
  key: string;
  label: string;
  sortable: boolean;
  headEl: Element | null;
  index: number;
}

interface RowMeta {
  index: number;
  cells: Element[];
  rowEl: Element;
}

@customElement('groupviewtable--ml-responsive-data-table')
export class MlResponsiveDataTableMolecule extends MoleculeAuraElement {
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
  ];

  /** Transforming table: project cell/header content as live DOM nodes. */
  protected usesLiveSlots = true;

  // ===========================================================================
  // PROPERTIES — From Contract
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
  private sortDirection: 'asc' | 'desc' = 'asc';

  @state()
  private focusedRowIndex: number = -1;

  @state()
  private hiddenColumnCount: number = 0;

  private _resizeObserver: ResizeObserver | null = null;
  private _tableWrapEl: HTMLElement | null = null;
  private _lastEditing: boolean | null = null;

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================

  firstUpdated() {
    this._setupResizeObserver();
    this._propagateEditing();
  }

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('isEditing')) {
      this._propagateEditing();
    }
    // Re-measure after render when columns/rows may have changed
    this._scheduleColumnMeasure();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._teardownResizeObserver();
  }

  // ===========================================================================
  // STATE CHANGE HANDLER — propagate isEditing only
  // ===========================================================================

  handleIcaStateChange(key: string, _value: any) {
    const isEditingAttr = this.getAttribute('is-editing');
    if (isEditingAttr === `{{${key}}}`) {
      this._propagateEditing();
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // RESIZE / RESPONSIVE COLUMNS
  // ===========================================================================

  private _setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') return;
    this._resizeObserver = new ResizeObserver(() => {
      this._measureHiddenColumns();
    });
    // Observe host; wrap may appear later
    this._resizeObserver.observe(this);
  }

  private _teardownResizeObserver() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    this._tableWrapEl = null;
  }

  private _scheduleColumnMeasure() {
    requestAnimationFrame(() => this._measureHiddenColumns());
  }

  /**
   * Progressively hide columns from right to left as width shrinks.
   * Never hide the first three columns; enable horizontal scroll instead.
   */
  private _measureHiddenColumns() {
    const wrap = this.querySelector('.ml-table-scroll') as HTMLElement | null;
    const table = this.querySelector('.ml-table') as HTMLElement | null;
    if (!wrap || !table) return;

    this._tableWrapEl = wrap;

    const columns = this._parseColumns();
    const colCount = columns.length;
    if (colCount <= 3) {
      if (this.hiddenColumnCount !== 0) this.hiddenColumnCount = 0;
      return;
    }

    // Temporarily show all columns to measure natural widths
    const cells = table.querySelectorAll<HTMLElement>('[data-col-index]');
    cells.forEach((el) => {
      el.style.display = '';
    });

    const headerCells = table.querySelectorAll<HTMLElement>('thead th[data-col-index]');
    if (headerCells.length === 0) return;

    const available = wrap.clientWidth;
    // Selection column width if present
    const selectCol = table.querySelector<HTMLElement>('th.ml-table-select-col');
    const selectWidth = selectCol ? selectCol.offsetWidth : 0;
    let used = selectWidth;
    let fitCount = 0;

    for (let i = 0; i < headerCells.length; i++) {
      const w = headerCells[i].offsetWidth || 80;
      if (used + w <= available || fitCount < 3) {
        used += w;
        fitCount++;
      } else {
        break;
      }
    }

    // Keep at least 3 columns visible
    fitCount = Math.max(3, Math.min(fitCount, colCount));
    const hide = Math.max(0, colCount - fitCount);

    if (hide !== this.hiddenColumnCount) {
      this.hiddenColumnCount = hide;
    } else {
      // Re-apply display without state churn
      this._applyColumnVisibility(table, colCount, hide);
    }
  }

  private _applyColumnVisibility(table: HTMLElement, colCount: number, hide: number) {
    const cutoff = colCount - hide; // columns with index >= cutoff are hidden
    const cells = table.querySelectorAll<HTMLElement>('[data-col-index]');
    cells.forEach((el) => {
      const idx = Number(el.dataset.colIndex);
      if (Number.isFinite(idx) && idx >= cutoff && hide > 0) {
        el.style.display = 'none';
      } else {
        el.style.display = '';
      }
    });
  }

  private _isColumnHidden(colIndex: number, colCount: number): boolean {
    if (this.hiddenColumnCount <= 0) return false;
    const cutoff = colCount - this.hiddenColumnCount;
    return colIndex >= cutoff;
  }

  // ===========================================================================
  // PARSING — live slot structure
  // ===========================================================================

  private _parseColumns(): ColumnMeta[] {
    const header = this.getLiveSlot('TableHeader') || this.getSlot('TableHeader');
    if (!header) return [];

    const headerRow =
      Array.from(header.children).find((c) => c.tagName === 'TABLEROW') ||
      header.querySelector('TableRow');
    if (!headerRow) return [];

    const heads = Array.from(headerRow.children).filter((c) => c.tagName === 'TABLEHEAD');
    return heads.map((head, index) => ({
      key: head.getAttribute('key') || `col-${index}`,
      label: (head.textContent || '').trim(),
      sortable: head.hasAttribute('sortable'),
      headEl: head,
      index,
    }));
  }

  private _parseRows(): RowMeta[] {
    const body = this.getLiveSlot('TableBody') || this.getSlot('TableBody');
    if (!body) return [];

    const rows = Array.from(body.children).filter((c) => c.tagName === 'TABLEROW');
    return rows.map((row, index) => {
      const cells = Array.from(row.children).filter((c) => c.tagName === 'TABLECELL');
      return { index, cells, rowEl: row };
    });
  }

  private _parseFooterRows(): RowMeta[] {
    const footer = this.getLiveSlot('TableFooter') || this.getSlot('TableFooter');
    if (!footer) return [];

    const rows = Array.from(footer.children).filter((c) => c.tagName === 'TABLEROW');
    return rows.map((row, index) => {
      const cells = Array.from(row.children).filter((c) => c.tagName === 'TABLECELL');
      return { index, cells, rowEl: row };
    });
  }

  private _getCellText(cell: Element | null | undefined): string {
    if (!cell) return '';
    // Prefer live projected text (source may be emptied after projection)
    const live = this.getLiveText(cell);
    if (live) return live;
    return (cell.textContent || '').trim();
  }

  // ===========================================================================
  // SELECTION HELPERS
  // ===========================================================================

  private _getSelectedIndices(): Set<number> {
    const raw = String(this.value ?? '').trim();
    if (!raw) return new Set();
    return new Set(
      raw
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !Number.isNaN(n))
    );
  }

  private _setSelectedIndices(indices: Set<number>) {
    const sorted = Array.from(indices).sort((a, b) => a - b);
    const next = sorted.join(',');
    this.value = next;
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: next },
      })
    );
  }

  private _isRowSelected(index: number): boolean {
    return this._getSelectedIndices().has(index);
  }

  private _allRowsSelected(rowCount: number): boolean {
    if (rowCount === 0) return false;
    const selected = this._getSelectedIndices();
    for (let i = 0; i < rowCount; i++) {
      if (!selected.has(i)) return false;
    }
    return true;
  }

  private _someRowsSelected(rowCount: number): boolean {
    if (rowCount === 0) return false;
    const selected = this._getSelectedIndices();
    let count = 0;
    for (let i = 0; i < rowCount; i++) {
      if (selected.has(i)) count++;
    }
    return count > 0 && count < rowCount;
  }

  // ===========================================================================
  // SORTING
  // ===========================================================================

  private _sortedRows(rows: RowMeta[], columns: ColumnMeta[]): RowMeta[] {
    if (!this.sortKey) return rows;

    const colIndex = columns.findIndex((c) => c.key === this.sortKey);
    if (colIndex < 0) return rows;

    const dir = this.sortDirection === 'asc' ? 1 : -1;
    const decorated = rows.map((row, i) => ({
      row,
      i,
      text: this._getCellText(row.cells[colIndex]).toLowerCase(),
    }));

    decorated.sort((a, b) => {
      if (a.text < b.text) return -1 * dir;
      if (a.text > b.text) return 1 * dir;
      return a.i - b.i;
    });

    return decorated.map((d) => d.row);
  }

  private _handleSort(column: ColumnMeta) {
    if (this.disabled || this.loading) return;
    if (!column.sortable) return;

    if (this.sortKey === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = column.key;
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
  // SELECTION HANDLERS
  // ===========================================================================

  private _handleToggleRow(index: number, e?: Event) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (this.disabled || this.loading || !this.selectable) return;

    const selected = this._getSelectedIndices();
    if (selected.has(index)) {
      selected.delete(index);
    } else {
      selected.add(index);
    }
    this._setSelectedIndices(selected);
  }

  private _handleToggleAll(rowCount: number, e?: Event) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (this.disabled || this.loading || !this.selectable) return;

    if (this._allRowsSelected(rowCount)) {
      this._setSelectedIndices(new Set());
    } else {
      const all = new Set<number>();
      for (let i = 0; i < rowCount; i++) all.add(i);
      this._setSelectedIndices(all);
    }
  }

  private _handleRowClick(index: number, e: Event) {
    if (this.disabled || this.loading) return;
    const target = e.target as HTMLElement | null;
    // Selection-control interaction must not emit rowClick
    if (target?.closest('.ml-table-select-col, .ml-table-checkbox')) return;

    this.focusedRowIndex = index;
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

  private _totalPages(): number {
    const size = Number(this.pageSize) || 0;
    if (size <= 0) return 0;
    const total = Number(this.totalItems) || 0;
    return Math.max(1, Math.ceil(total / size));
  }

  private _goToPage(page: number) {
    if (this.disabled || this.loading) return;
    const total = this._totalPages();
    if (total <= 0) return;
    const next = Math.min(Math.max(1, page), total);
    if (next === this.page) return;
    this.page = next;
    this.dispatchEvent(
      new CustomEvent('pageChange', {
        bubbles: true,
        composed: true,
        detail: { page: next },
      })
    );
  }

  // ===========================================================================
  // KEYBOARD
  // ===========================================================================

  private _handleTableKeydown(e: KeyboardEvent, rowCount: number, columns: ColumnMeta[]) {
    if (this.disabled || this.loading) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (rowCount === 0) return;
      this.focusedRowIndex =
        this.focusedRowIndex < 0 ? 0 : Math.min(rowCount - 1, this.focusedRowIndex + 1);
      this._focusRow(this.focusedRowIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (rowCount === 0) return;
      this.focusedRowIndex =
        this.focusedRowIndex < 0 ? 0 : Math.max(0, this.focusedRowIndex - 1);
      this._focusRow(this.focusedRowIndex);
    } else if (e.key === ' ' || e.key === 'Spacebar') {
      if (this.selectable && this.focusedRowIndex >= 0) {
        e.preventDefault();
        this._handleToggleRow(this.focusedRowIndex);
      }
    } else if (e.key === 'Enter') {
      // Sort active sortable header when focus is on a header button — handled there.
      // When focus is on a row, treat as row activation.
      if (this.focusedRowIndex >= 0) {
        e.preventDefault();
        this.dispatchEvent(
          new CustomEvent('rowClick', {
            bubbles: true,
            composed: true,
            detail: { index: this.focusedRowIndex },
          })
        );
      }
    }
  }

  private _focusRow(index: number) {
    requestAnimationFrame(() => {
      const row = this.querySelector(`[data-row-index="${index}"]`) as HTMLElement | null;
      row?.focus();
    });
  }

  // ===========================================================================
  // isEditing PROPAGATION
  // ===========================================================================

  private _propagateEditing() {
    const editing = !!this.isEditing;
    if (this._lastEditing === editing) {
      // Still walk cells on first pass after projection
    }
    this._lastEditing = editing;

    const body = this.getLiveSlot('TableBody');
    const roots: Element[] = [];
    if (body) roots.push(body);
    const footer = this.getLiveSlot('TableFooter');
    if (footer) roots.push(footer);

    // Also propagate into already-projected anchors inside the rendered table
    const projected = this.querySelectorAll('.ml-table-cell, .ml-table-footer-cell');
    projected.forEach((cell) => roots.push(cell));

    for (const root of roots) {
      const customs = root.querySelectorAll<HTMLElement>('*');
      customs.forEach((el) => {
        if (el.tagName.includes('-')) {
          el.setAttribute('is-editing', editing ? 'true' : 'false');
        }
      });
    }
  }

  // ===========================================================================
  // CLASS HELPERS
  // ===========================================================================

  private _rootClasses(): string {
    return cn(
      [
        'flex flex-col w-full gap-3',
        'ml-table-root',
        this.disabled ? 'ml-disabled' : '',
        this.loading ? 'ml-table-loading' : '',
        this.isEditing ? 'ml-table-editing' : '',
        this.error ? 'ml-table-error' : '',
      ]
        .filter(Boolean)
        .join(' '),
      this.cssClass
    );
  }

  private _headerCellClasses(col: ColumnMeta): string {
    return [
      'px-3 py-2 text-left text-sm font-semibold',
      'ml-table-head',
      col.sortable ? 'ml-table-head-sortable' : '',
      this.sortKey === col.key ? 'ml-table-head-sorted' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private _rowClasses(index: number, selected: boolean): string {
    return [
      'ml-table-row',
      selected ? 'ml-table-row-selected' : '',
      this.focusedRowIndex === index ? 'ml-table-row-focused' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================

  private _ariaSort(col: ColumnMeta): string | typeof nothing {
    if (!col.sortable) return nothing;
    if (this.sortKey !== col.key) return 'none';
    return this.sortDirection === 'asc' ? 'ascending' : 'descending';
  }

  private _renderSortIndicator(col: ColumnMeta): TemplateResult | typeof nothing {
    if (!col.sortable) return nothing;
    if (this.sortKey !== col.key) {
      return html`<span class="ml-table-sort-icon ml-text-faint" aria-hidden="true">⇅</span>`;
    }
    const arrow = this.sortDirection === 'asc' ? '↑' : '↓';
    return html`<span class="ml-table-sort-icon ml-text" aria-hidden="true">${arrow}</span>`;
  }

  private _renderCaption(): TemplateResult {
    if (!this.hasSlot('Caption') && !this.getLiveSlot('Caption')) return html``;
    const live = this.getLiveSlot('Caption');
    return html`
      <caption class="${cn('caption-bottom text-sm mt-2 ml-text-muted ml-table-caption', this.getSlotClass('Caption'))}">
        ${live ? this.renderLiveSlotFrom(live) : unsafeHTML(this.getSlotContent('Caption'))}
      </caption>
    `;
  }

  private _renderSelectAllHeader(rowCount: number): TemplateResult {
    if (!this.selectable) return html``;
    const all = this._allRowsSelected(rowCount);
    const some = this._someRowsSelected(rowCount);
    return html`
      <th
        class="w-10 px-2 py-2 ml-table-select-col ml-table-head"
        scope="col"
        role="columnheader"
      >
        <input
          type="checkbox"
          class="ml-table-checkbox"
          .checked=${all}
          .indeterminate=${some}
          aria-label=${this.msg.selectAll}
          ?disabled=${this.disabled || this.loading}
          @click=${(e: Event) => this._handleToggleAll(rowCount, e)}
          @change=${(e: Event) => e.stopPropagation()}
          @input=${(e: Event) => e.stopPropagation()}
        />
      </th>
    `;
  }

  private _renderSelectCell(rowIndex: number): TemplateResult {
    if (!this.selectable) return html``;
    const selected = this._isRowSelected(rowIndex);
    return html`
      <td class="w-10 px-2 py-2 ml-table-select-col ml-table-cell-select" role="cell">
        <input
          type="checkbox"
          class="ml-table-checkbox"
          .checked=${selected}
          aria-label=${`${this.msg.selectRow} ${rowIndex + 1}`}
          ?disabled=${this.disabled || this.loading}
          @click=${(e: Event) => this._handleToggleRow(rowIndex, e)}
          @change=${(e: Event) => e.stopPropagation()}
          @input=${(e: Event) => e.stopPropagation()}
        />
      </td>
    `;
  }

  private _renderHeader(columns: ColumnMeta[], rowCount: number): TemplateResult {
    return html`
      <thead class="ml-table-header" role="rowgroup">
        <tr class="ml-table-header-row" role="row">
          ${this._renderSelectAllHeader(rowCount)}
          ${columns.map((col) => {
            const hidden = this._isColumnHidden(col.index, columns.length);
            const headContent = col.headEl
              ? this.renderLiveSlotFrom(col.headEl, 'ml-table-head-content')
              : html`${col.label}`;

            if (col.sortable) {
              return html`
                <th
                  class="${this._headerCellClasses(col)}"
                  scope="col"
                  role="columnheader"
                  data-col-index=${col.index}
                  data-col-key=${col.key}
                  aria-sort=${this._ariaSort(col)}
                  style=${hidden ? 'display:none' : nothing}
                >
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 w-full text-left ml-table-sort-btn"
                    ?disabled=${this.disabled || this.loading}
                    @click=${() => this._handleSort(col)}
                    @keydown=${(e: KeyboardEvent) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        this._handleSort(col);
                      }
                    }}
                  >
                    <span class="ml-table-head-label">${headContent}</span>
                    ${this._renderSortIndicator(col)}
                    <span class="sr-only">
                      ${this.sortKey === col.key
                        ? this.sortDirection === 'asc'
                          ? this.msg.sortAsc
                          : this.msg.sortDesc
                        : this.msg.sortable}
                    </span>
                  </button>
                </th>
              `;
            }

            return html`
              <th
                class="${this._headerCellClasses(col)}"
                scope="col"
                role="columnheader"
                data-col-index=${col.index}
                data-col-key=${col.key}
                style=${hidden ? 'display:none' : nothing}
              >
                <span class="ml-table-head-label">${headContent}</span>
              </th>
            `;
          })}
        </tr>
      </thead>
    `;
  }

  private _renderBody(rows: RowMeta[], columns: ColumnMeta[]): TemplateResult {
    if (rows.length === 0) return html``;

    return html`
      <tbody class="ml-table-body" role="rowgroup">
        ${rows.map((row, visualIndex) => {
          const selected = this._isRowSelected(row.index);
          return html`
            <tr
              class="${this._rowClasses(row.index, selected)}"
              role="row"
              data-row-index=${row.index}
              tabindex=${this.disabled ? nothing : 0}
              aria-selected=${this.selectable ? (selected ? 'true' : 'false') : nothing}
              @click=${(e: Event) => this._handleRowClick(row.index, e)}
              @keydown=${(e: KeyboardEvent) => this._handleTableKeydown(e, rows.length, columns)}
            >
              ${this._renderSelectCell(row.index)}
              ${columns.map((col) => {
                const cell = row.cells[col.index];
                const hidden = this._isColumnHidden(col.index, columns.length);
                return html`
                  <td
                    class="px-3 py-2 text-sm ml-table-cell ml-text"
                    role="cell"
                    data-col-index=${col.index}
                    style=${hidden ? 'display:none' : nothing}
                  >
                    ${cell ? this.renderLiveSlotFrom(cell) : nothing}
                  </td>
                `;
              })}
            </tr>
          `;
        })}
      </tbody>
    `;
  }

  private _renderFooter(columns: ColumnMeta[]): TemplateResult {
    const footerRows = this._parseFooterRows();
    if (footerRows.length === 0) return html``;

    return html`
      <tfoot class="ml-table-footer" role="rowgroup">
        ${footerRows.map(
          (row) => html`
            <tr class="ml-table-footer-row" role="row">
              ${this.selectable
                ? html`<td class="ml-table-select-col ml-table-footer-cell" role="cell"></td>`
                : nothing}
              ${columns.map((col) => {
                const cell = row.cells[col.index];
                const hidden = this._isColumnHidden(col.index, columns.length);
                return html`
                  <td
                    class="px-3 py-2 text-sm font-semibold ml-table-footer-cell ml-text"
                    role="cell"
                    data-col-index=${col.index}
                    style=${hidden ? 'display:none' : nothing}
                  >
                    ${cell ? this.renderLiveSlotFrom(cell) : nothing}
                  </td>
                `;
              })}
            </tr>
          `
        )}
      </tfoot>
    `;
  }

  private _renderLoading(): TemplateResult {
    const hasLoading = !!(this.getLiveSlot('Loading') || this.hasSlot('Loading'));
    return html`
      <div class="flex flex-col items-center justify-center gap-3 p-8 w-full ml-table-loading-state" role="status" aria-live="polite">
        ${hasLoading
          ? html`
              <div class="${cn('w-full ml-table-loading-slot', this.getSlotClass('Loading'))}">
                ${this.getLiveSlot('Loading')
                  ? this.renderLiveSlotFrom(this.getLiveSlot('Loading'))
                  : unsafeHTML(this.getSlotContent('Loading'))}
              </div>
            `
          : html`
              <div class="flex flex-col gap-2 w-full" aria-label=${this.msg.loading}>
                <div class="h-10 w-full rounded ml-skeleton"></div>
                <div class="h-10 w-full rounded ml-skeleton"></div>
                <div class="h-10 w-full rounded ml-skeleton"></div>
                <span class="sr-only">${this.msg.loading}</span>
              </div>
            `}
      </div>
    `;
  }

  private _renderEmpty(): TemplateResult {
    const hasEmpty = !!(this.getLiveSlot('Empty') || this.hasSlot('Empty'));
    return html`
      <div class="flex flex-col items-center justify-center gap-2 p-8 w-full ml-table-empty-state" role="status" aria-live="polite">
        ${hasEmpty
          ? html`
              <div class="${cn('w-full text-sm ml-text-muted ml-table-empty-slot', this.getSlotClass('Empty'))}">
                ${this.getLiveSlot('Empty')
                  ? this.renderLiveSlotFrom(this.getLiveSlot('Empty'))
                  : unsafeHTML(this.getSlotContent('Empty'))}
              </div>
            `
          : html`
              <p class="text-sm ml-text-muted ml-table-empty-message">${this.msg.empty}</p>
            `}
      </div>
    `;
  }

  private _renderError(): TemplateResult {
    const err = String(this.error ?? '').trim();
    if (!err) return html``;
    return html`
      <div class="mt-2 text-sm ml-error-text ml-table-error-message" role="alert" aria-live="assertive">
        ${unsafeHTML(err)}
      </div>
    `;
  }

  private _pageNumbers(total: number, current: number): number[] {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages = new Set<number>();
    pages.add(1);
    pages.add(total);
    for (let p = current - 1; p <= current + 1; p++) {
      if (p >= 1 && p <= total) pages.add(p);
    }
    return Array.from(pages).sort((a, b) => a - b);
  }

  private _renderPagination(): TemplateResult {
    const size = Number(this.pageSize) || 0;
    if (size <= 0) return html``;

    const total = this._totalPages();
    if (total <= 0) return html``;

    const current = Math.min(Math.max(1, Number(this.page) || 1), total);
    const pages = this._pageNumbers(total, current);

    return html`
      <nav
        class="flex flex-wrap items-center justify-between gap-2 pt-2 ml-table-pagination"
        role="navigation"
        aria-label=${this.msg.pagination}
      >
        <span class="text-xs ml-text-muted ml-table-pagination-status">
          ${this.msg.pageOf} ${current} ${this.msg.of} ${total}
        </span>
        <div class="inline-flex items-center gap-1">
          <button
            type="button"
            class="px-2 py-1 text-sm rounded ml-table-page-btn"
            aria-label=${this.msg.previousPage}
            ?disabled=${this.disabled || this.loading || current <= 1}
            @click=${() => this._goToPage(current - 1)}
          >
            ‹
          </button>
          ${pages.map((p, i) => {
            const prev = pages[i - 1];
            const gap = prev !== undefined && p - prev > 1;
            return html`
              ${gap
                ? html`<span class="px-1 text-sm ml-text-faint" aria-hidden="true">…</span>`
                : nothing}
              <button
                type="button"
                class="${[
                  'min-w-[2rem] px-2 py-1 text-sm rounded ml-table-page-btn',
                  p === current ? 'ml-table-page-btn-active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}"
                aria-label=${`${this.msg.pageOf} ${p}`}
                aria-current=${p === current ? 'page' : nothing}
                ?disabled=${this.disabled || this.loading}
                @click=${() => this._goToPage(p)}
              >
                ${p}
              </button>
            `;
          })}
          <button
            type="button"
            class="px-2 py-1 text-sm rounded ml-table-page-btn"
            aria-label=${this.msg.nextPage}
            ?disabled=${this.disabled || this.loading || current >= total}
            @click=${() => this._goToPage(current + 1)}
          >
            ›
          </button>
        </div>
      </nav>
    `;
  }

  private _renderTable(): TemplateResult {
    const columns = this._parseColumns();
    const rawRows = this._parseRows();
    const rows = this._sortedRows(rawRows, columns);
    const isEmpty = rawRows.length === 0;

    if (isEmpty) {
      return this._renderEmpty();
    }

    // Apply column visibility after paint via measure; also stamp current hide state
    const colCount = columns.length;

    return html`
      <div class="w-full overflow-x-auto ml-table-scroll">
        <table
          class="w-full border-collapse text-sm ml-table"
          role="table"
          aria-busy=${this.loading ? 'true' : 'false'}
          aria-disabled=${this.disabled ? 'true' : nothing}
        >
          ${this._renderCaption()}
          ${this._renderHeader(columns, rows.length)}
          ${this._renderBody(rows, columns)}
          ${this._renderFooter(columns)}
        </table>
      </div>
      <!-- stamp for measure helper -->
      <span hidden data-col-count=${colCount} data-hidden-cols=${this.hiddenColumnCount}></span>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================

  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang] || messages.en;

    return html`
      <div class="${this._rootClasses()}">
        ${this.loading ? this._renderLoading() : this._renderTable()}
        ${this._renderPagination()}
        ${this._renderError()}
      </div>
    `;
  }
}
