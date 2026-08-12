/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-responsive-table.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, nothing, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/shared/molecules/cn.js';
import { cellSortKey, compareSortKeys } from '/_102033_/l2/shared/molecules/tableSort.js';

/// **collab_i18n_start**
const message_en = {
  loading: 'Loading...',
  empty: 'No records to display',
  selectAll: 'Select all rows',
  selectRow: 'Select row {n}',
  pagination: 'Table pagination',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  pageOf: 'Page {page} of {total}',
  sortAsc: 'sorted ascending',
  sortDesc: 'sorted descending',
  sortable: 'sortable',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    loading: 'Carregando...',
    empty: 'Nenhum registro para exibir',
    selectAll: 'Selecionar todas as linhas',
    selectRow: 'Selecionar linha {n}',
    pagination: 'Paginação da tabela',
    previousPage: 'Página anterior',
    nextPage: 'Próxima página',
    pageOf: 'Página {page} de {total}',
    sortAsc: 'ordenado ascendente',
    sortDesc: 'ordenado descendente',
    sortable: 'ordenável',
  },
};
/// **collab_i18n_end**

// =============================================================================
// RESPONSIVE TABLE MOLECULE
// =============================================================================
// Skill Group: groupViewTable
// Wide spaces → conventional table. Constrained spaces → labeled record cards.
// Live slot projection keeps interactive cell content alive across presentations.
// This molecule does NOT contain business logic and does NOT support row expansion.

interface HeaderCell {
  key: string;
  sortable: boolean;
  label: string;
  html: string;
  el: Element;
}

interface BodyRow {
  el: Element;
  originalIndex: number;
  cells: Element[];
}

@customElement('groupviewtable--ml-responsive-table')
export class MlResponsiveTableMolecule extends MoleculeAuraElement {
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

  /** Project cell content as live DOM so interactive controls stay alive. */
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
  private sortDirection: string = 'asc';

  @state()
  private focusedRowIndex: number = -1;

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================

  firstUpdated() {
    this.propagateEditing();
  }

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('isEditing')) {
      this.propagateEditing();
    }
  }

  // ===========================================================================
  // STATE CHANGE HANDLER — propagate isEditing only (never reassign bound props)
  // ===========================================================================

  handleIcaStateChange(key: string, _value: unknown) {
    const isEditingAttr = this.getAttribute('is-editing');
    if (isEditingAttr === `{{${key}}}`) {
      this.propagateEditing();
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // isEditing PROPAGATION
  // ===========================================================================

  private propagateEditing(): void {
    const flag = this.isEditing ? 'true' : 'false';
    // Projected cell content lives under live-ref anchors after the first paint.
    this.querySelectorAll('[data-ml-live-ref]').forEach((anchor) => {
      anchor.querySelectorAll('*').forEach((node) => {
        if (node instanceof HTMLElement && node.tagName.includes('-')) {
          node.setAttribute('is-editing', flag);
        }
      });
    });
    // Also cover not-yet-projected sources still under the slot tags.
    const body = this.getLiveSlot('TableBody');
    if (body) {
      body.querySelectorAll('tablecell *').forEach((node) => {
        if (node instanceof HTMLElement && node.tagName.includes('-')) {
          node.setAttribute('is-editing', flag);
        }
      });
    }
    const footer = this.getLiveSlot('TableFooter');
    if (footer) {
      footer.querySelectorAll('tablecell *').forEach((node) => {
        if (node instanceof HTMLElement && node.tagName.includes('-')) {
          node.setAttribute('is-editing', flag);
        }
      });
    }
  }

  // ===========================================================================
  // SLOT PARSERS
  // ===========================================================================

  private parseHeaderCells(): HeaderCell[] {
    const header = this.getLiveSlot('TableHeader');
    if (!header) return [];
    const heads = Array.from(header.querySelectorAll(':scope > tablerow > tablehead, :scope > tablehead'));
    return heads.map((el, index) => {
      const key = el.getAttribute('key') || `col-${index}`;
      const sortable = el.hasAttribute('sortable');
      const label = (el.textContent || '').trim();
      const htmlContent = el.innerHTML;
      return { key, sortable, label, html: htmlContent, el };
    });
  }

  private parseBodyRows(): BodyRow[] {
    const body = this.getLiveSlot('TableBody');
    if (!body) return [];
    const rows = Array.from(body.querySelectorAll(':scope > tablerow'));
    return rows.map((el, originalIndex) => {
      const cells = Array.from(el.querySelectorAll(':scope > tablecell'));
      return { el, originalIndex, cells };
    });
  }

  private parseFooterRows(): { cells: Element[] }[] {
    const footer = this.getLiveSlot('TableFooter');
    if (!footer) return [];
    const rows = Array.from(footer.querySelectorAll(':scope > tablerow'));
    return rows.map((el) => ({
      cells: Array.from(el.querySelectorAll(':scope > tablecell')),
    }));
  }

  // ===========================================================================
  // MODE / PAGINATION / SORT HELPERS
  // ===========================================================================

  private isExternalMode(rowCount: number): boolean {
    const declared = Number(this.totalItems) || 0;
    return declared > rowCount;
  }

  private getTotalItemCount(rowCount: number): number {
    const declared = Number(this.totalItems) || 0;
    if (declared > rowCount) return declared;
    return rowCount;
  }

  private getPageSize(): number {
    const size = Number(this.pageSize);
    return Number.isFinite(size) && size > 0 ? size : 0;
  }

  private getCurrentPage(): number {
    const p = Number(this.page);
    return Number.isFinite(p) && p >= 1 ? Math.floor(p) : 1;
  }

  private getTotalPages(rowCount: number): number {
    const size = this.getPageSize();
    if (size <= 0) return 1;
    const total = this.getTotalItemCount(rowCount);
    return Math.max(1, Math.ceil(total / size));
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

  private sortedRows(rows: BodyRow[], headers: HeaderCell[]): BodyRow[] {
    if (this.isExternalMode(rows.length)) {
      // External mode: keep received order; consumer re-queries on sort.
      return rows.slice();
    }
    if (!this.sortKey) return rows.slice();
    const colIndex = headers.findIndex((h) => h.key === this.sortKey);
    if (colIndex < 0) return rows.slice();
    const dir = this.sortDirection === 'desc' ? -1 : 1;
    const decorated = rows.map((row, idx) => {
      const cell = row.cells[colIndex];
      const key = cell ? cellSortKey(cell, this.getLiveText(cell)) : '';
      return { row, key, idx };
    });
    decorated.sort((a, b) => {
      const cmp = compareSortKeys(a.key, b.key) * dir;
      return cmp !== 0 ? cmp : a.idx - b.idx;
    });
    return decorated.map((d) => d.row);
  }

  private paginateRows(rows: BodyRow[]): BodyRow[] {
    const size = this.getPageSize();
    if (size <= 0) return rows;
    // External mode already holds one page — do not slice again.
    if (this.isExternalMode(this.parseBodyRows().length)) return rows;
    const page = this.getCurrentPage();
    const start = (page - 1) * size;
    return rows.slice(start, start + size);
  }

  private getVisibleRows(headers: HeaderCell[]): BodyRow[] {
    const all = this.parseBodyRows();
    const ordered = this.sortedRows(all, headers);
    return this.paginateRows(ordered);
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================

  private emitChange(selected: Set<number>) {
    const ordered = Array.from(selected).sort((a, b) => a - b);
    const next = ordered.join(',');
    this.value = next;
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: next },
      })
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

  private handleRowCheck(originalIndex: number, checked: boolean) {
    if (this.disabled || this.loading) return;
    const selected = this.getSelectedSet();
    if (checked) selected.add(originalIndex);
    else selected.delete(originalIndex);
    this.emitChange(selected);
  }

  private handleSelectAll(checked: boolean, allRows: BodyRow[]) {
    if (this.disabled || this.loading) return;
    const selected = this.getSelectedSet();
    if (checked) {
      allRows.forEach((r) => selected.add(r.originalIndex));
    } else {
      allRows.forEach((r) => selected.delete(r.originalIndex));
    }
    this.emitChange(selected);
  }

  private handleRowActivate(originalIndex: number, e: Event) {
    if (this.disabled || this.loading) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest('input[type="checkbox"]')) return;
    if (target?.closest('button, a, input, select, textarea, label')) return;
    this.focusedRowIndex = originalIndex;
    this.dispatchEvent(
      new CustomEvent('rowClick', {
        bubbles: true,
        composed: true,
        detail: { index: originalIndex },
      })
    );
  }

  private handlePageChange(nextPage: number, totalPages: number) {
    if (this.disabled || this.loading) return;
    const page = Math.min(Math.max(1, nextPage), totalPages);
    if (page === this.getCurrentPage()) return;
    this.page = page;
    this.dispatchEvent(
      new CustomEvent('pageChange', {
        bubbles: true,
        composed: true,
        detail: { page },
      })
    );
  }

  private handleCheckboxChange(e: Event, originalIndex: number) {
    e.stopPropagation();
    if (this.disabled || this.loading) return;
    const input = e.target as HTMLInputElement;
    this.handleRowCheck(originalIndex, input.checked);
  }

  private handleSelectAllChange(e: Event, allRows: BodyRow[]) {
    e.stopPropagation();
    if (this.disabled || this.loading) return;
    const input = e.target as HTMLInputElement;
    this.handleSelectAll(input.checked, allRows);
  }

  private handleKeyDown(e: KeyboardEvent, visibleRows: BodyRow[], headers: HeaderCell[]) {
    if (this.disabled || this.loading) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (visibleRows.length === 0) return;
      const currentPos = visibleRows.findIndex((r) => r.originalIndex === this.focusedRowIndex);
      let nextPos: number;
      if (e.key === 'ArrowDown') {
        nextPos = currentPos < 0 ? 0 : Math.min(visibleRows.length - 1, currentPos + 1);
      } else {
        nextPos = currentPos < 0 ? visibleRows.length - 1 : Math.max(0, currentPos - 1);
      }
      this.focusedRowIndex = visibleRows[nextPos].originalIndex;
      const rowEl = this.querySelector(`[data-row-index="${this.focusedRowIndex}"]`) as HTMLElement | null;
      rowEl?.focus();
      return;
    }

    if (e.key === ' ' || e.key === 'Spacebar') {
      const target = e.target as HTMLElement;
      if (target.closest('input, button, a, select, textarea')) return;
      if (!this.selectable) return;
      if (this.focusedRowIndex < 0) return;
      e.preventDefault();
      const selected = this.getSelectedSet();
      if (selected.has(this.focusedRowIndex)) selected.delete(this.focusedRowIndex);
      else selected.add(this.focusedRowIndex);
      this.emitChange(selected);
      return;
    }

    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;
      const th = target.closest('[data-sort-key]') as HTMLElement | null;
      if (th) {
        const key = th.getAttribute('data-sort-key');
        if (key) {
          e.preventDefault();
          this.handleSort(key);
        }
        return;
      }
    }
  }

  // ===========================================================================
  // CLASS HELPERS
  // ===========================================================================

  private getRootClasses(): string {
    return cn(
      [
        'w-full flex flex-col gap-3',
        'ml-responsive-table',
        this.disabled ? 'ml-disabled' : '',
        this.loading ? 'ml-loading' : '',
      ]
        .filter(Boolean)
        .join(' '),
      this.cssClass
    );
  }

  private getRowClasses(isSelected: boolean, isFocused: boolean): string {
    return [
      'ml-table-row',
      isSelected ? 'ml-row-selected' : '',
      isFocused ? 'ml-row-focused' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getHeadClasses(header: HeaderCell): string {
    const isActive = this.sortKey === header.key;
    return [
      'ml-table-head',
      header.sortable ? 'ml-sortable' : '',
      isActive ? 'ml-sort-active' : '',
      isActive && this.sortDirection === 'asc' ? 'ml-sort-asc' : '',
      isActive && this.sortDirection === 'desc' ? 'ml-sort-desc' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================

  private renderCaption(): TemplateResult {
    if (!this.hasSlot('Caption') && !this.getLiveSlot('Caption')) return html``;
    const live = this.getLiveSlot('Caption');
    const content = live ? live.innerHTML : this.getSlotContent('Caption');
    if (!content) return html``;
    return html`
      <caption class="${cn('ml-table-caption text-sm font-semibold text-left mb-2', this.getSlotClass('Caption'))}">
        ${unsafeHTML(content)}
      </caption>
    `;
  }

  private ariaSortFor(header: HeaderCell): string | typeof nothing {
    if (!header.sortable) return nothing;
    if (this.sortKey !== header.key) return 'none';
    return this.sortDirection === 'desc' ? 'descending' : 'ascending';
  }

  private renderSortIndicator(header: HeaderCell): TemplateResult {
    if (!header.sortable) return html``;
    const isActive = this.sortKey === header.key;
    const arrow =
      isActive && this.sortDirection === 'desc'
        ? '▼'
        : isActive && this.sortDirection === 'asc'
          ? '▲'
          : '↕';
    const sr =
      isActive
        ? this.sortDirection === 'desc'
          ? this.msg.sortDesc
          : this.msg.sortAsc
        : this.msg.sortable;
    return html`
      <span class="ml-sort-indicator inline-flex ml-1 text-xs" aria-hidden="true">${arrow}</span>
      <span class="sr-only">${sr}</span>
    `;
  }

  private renderSelectAllCell(allRows: BodyRow[], selected: Set<number>): TemplateResult {
    if (!this.selectable) return html``;
    const enabledRows = allRows;
    const allSelected =
      enabledRows.length > 0 && enabledRows.every((r) => selected.has(r.originalIndex));
    const someSelected = enabledRows.some((r) => selected.has(r.originalIndex));
    return html`
      <th class="ml-select-cell w-10 px-2 py-2" scope="col">
        <input
          type="checkbox"
          class="ml-checkbox"
          aria-label=${this.msg.selectAll}
          .checked=${allSelected}
          .indeterminate=${someSelected && !allSelected}
          ?disabled=${this.disabled || this.loading || enabledRows.length === 0}
          @change=${(e: Event) => this.handleSelectAllChange(e, enabledRows)}
          @input=${(e: Event) => e.stopPropagation()}
          @click=${(e: Event) => e.stopPropagation()}
        />
      </th>
    `;
  }

  private renderHeaderRow(headers: HeaderCell[], allRows: BodyRow[], selected: Set<number>): TemplateResult {
    return html`
      <tr class="ml-table-header-row" role="row">
        ${this.renderSelectAllCell(allRows, selected)}
        ${headers.map(
          (header) => html`
            <th
              class="${this.getHeadClasses(header)} px-3 py-2 text-sm font-semibold text-left"
              scope="col"
              role="columnheader"
              data-sort-key=${header.sortable ? header.key : nothing}
              aria-sort=${this.ariaSortFor(header)}
              tabindex=${header.sortable && !this.disabled && !this.loading ? '0' : nothing}
              @click=${header.sortable
                ? (e: Event) => {
                    e.preventDefault();
                    this.handleSort(header.key);
                  }
                : nothing}
              @keydown=${header.sortable
                ? (e: KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      this.handleSort(header.key);
                    }
                  }
                : nothing}
            >
              <span class="inline-flex items-center gap-1 ml-head-label">
                ${unsafeHTML(header.html || header.label)}
                ${this.renderSortIndicator(header)}
              </span>
            </th>
          `
        )}
      </tr>
    `;
  }

  private renderRowCheckbox(originalIndex: number, isSelected: boolean): TemplateResult {
    if (!this.selectable) return html``;
    const label = this.msg.selectRow.replace('{n}', String(originalIndex + 1));
    return html`
      <td class="ml-select-cell w-10 px-2 py-2" role="cell" data-label="">
        <input
          type="checkbox"
          class="ml-checkbox"
          aria-label=${label}
          .checked=${isSelected}
          ?disabled=${this.disabled || this.loading}
          @change=${(e: Event) => this.handleCheckboxChange(e, originalIndex)}
          @input=${(e: Event) => e.stopPropagation()}
          @click=${(e: Event) => e.stopPropagation()}
        />
      </td>
    `;
  }

  private renderBodyRow(
    row: BodyRow,
    headers: HeaderCell[],
    selected: Set<number>
  ): TemplateResult {
    const isSelected = selected.has(row.originalIndex);
    const isFocused = this.focusedRowIndex === row.originalIndex;
    return html`
      <tr
        class="${this.getRowClasses(isSelected, isFocused)}"
        role="row"
        data-row-index=${row.originalIndex}
        tabindex="0"
        aria-selected=${this.selectable ? (isSelected ? 'true' : 'false') : nothing}
        @click=${(e: Event) => this.handleRowActivate(row.originalIndex, e)}
        @focus=${() => {
          this.focusedRowIndex = row.originalIndex;
        }}
      >
        ${this.renderRowCheckbox(row.originalIndex, isSelected)}
        ${row.cells.map((cell, colIndex) => {
          const header = headers[colIndex];
          const label = header?.label || '';
          const slotClass = cell.getAttribute('data-class') || '';
          return html`
            <td
              class="${cn('ml-table-cell px-3 py-2 text-sm', slotClass)}"
              role="cell"
              data-label=${label}
            >
              ${label
                ? html`<span class="ml-card-label ml-label text-xs font-medium" aria-hidden="true"
                    >${label}</span
                  >`
                : nothing}
              <div class="ml-cell-value">
                ${this.renderLiveSlotFrom(cell, 'ml-cell-content')}
              </div>
            </td>
          `;
        })}
      </tr>
    `;
  }

  private renderFooter(headers: HeaderCell[]): TemplateResult {
    const footerRows = this.parseFooterRows();
    if (footerRows.length === 0) return html``;
    return html`
      <tfoot class="ml-table-footer" role="rowgroup">
        ${footerRows.map(
          (row) => html`
            <tr class="ml-table-footer-row" role="row">
              ${this.selectable
                ? html`<td class="ml-select-cell w-10 px-2 py-2" role="cell"></td>`
                : nothing}
              ${row.cells.map((cell, colIndex) => {
                const slotClass = cell.getAttribute('data-class') || '';
                const label = headers[colIndex]?.label || '';
                return html`
                  <td
                    class="${cn('ml-table-cell ml-footer-cell px-3 py-2 text-sm', slotClass)}"
                    role="cell"
                    data-label=${label}
                  >
                    <div class="ml-cell-value">
                      ${this.renderLiveSlotFrom(cell, 'ml-cell-content')}
                    </div>
                  </td>
                `;
              })}
            </tr>
          `
        )}
      </tfoot>
    `;
  }

  private renderLoading(): TemplateResult {
    const live = this.getLiveSlot('Loading');
    const content = live?.innerHTML || this.getSlotContent('Loading');
    if (content) {
      return html`
        <div class="${cn('ml-table-loading p-6', this.getSlotClass('Loading'))}" role="status" aria-live="polite">
          ${unsafeHTML(content)}
        </div>
      `;
    }
    return html`
      <div class="ml-table-loading flex flex-col gap-2 p-6" role="status" aria-live="polite">
        <div class="ml-skeleton h-4 w-full rounded"></div>
        <div class="ml-skeleton h-4 w-5/6 rounded"></div>
        <div class="ml-skeleton h-4 w-4/6 rounded"></div>
        <span class="sr-only">${this.msg.loading}</span>
      </div>
    `;
  }

  private renderEmpty(): TemplateResult {
    const live = this.getLiveSlot('Empty');
    const content = live?.innerHTML || this.getSlotContent('Empty');
    if (content) {
      return html`
        <div class="${cn('ml-table-empty p-6 text-sm ml-text-muted', this.getSlotClass('Empty'))}" role="status">
          ${unsafeHTML(content)}
        </div>
      `;
    }
    return html`
      <div class="ml-table-empty p-6 text-sm ml-text-muted" role="status">${this.msg.empty}</div>
    `;
  }

  private renderPagination(rowCount: number): TemplateResult {
    const size = this.getPageSize();
    if (size <= 0) return html``;
    const totalPages = this.getTotalPages(rowCount);
    if (totalPages <= 1 && !this.isExternalMode(rowCount)) return html``;
    const page = Math.min(this.getCurrentPage(), totalPages);
    const label = this.msg.pageOf
      .replace('{page}', String(page))
      .replace('{total}', String(totalPages));
    return html`
      <nav
        class="ml-table-pagination flex items-center justify-between gap-3 text-sm"
        role="navigation"
        aria-label=${this.msg.pagination}
      >
        <button
          type="button"
          class="ml-page-btn px-3 py-1 rounded border text-sm"
          ?disabled=${this.disabled || this.loading || page <= 1}
          aria-label=${this.msg.previousPage}
          @click=${() => this.handlePageChange(page - 1, totalPages)}
        >
          ‹
        </button>
        <span class="ml-page-status ml-text-muted">${label}</span>
        <button
          type="button"
          class="ml-page-btn px-3 py-1 rounded border text-sm"
          ?disabled=${this.disabled || this.loading || page >= totalPages}
          aria-label=${this.msg.nextPage}
          @click=${() => this.handlePageChange(page + 1, totalPages)}
        >
          ›
        </button>
      </nav>
    `;
  }

  private renderError(): TemplateResult {
    const err = String(this.error ?? '').trim();
    if (!err) return html``;
    return html`
      <p class="ml-error-text mt-1 text-xs" role="alert">${unsafeHTML(err)}</p>
    `;
  }

  private renderTableShell(
    headers: HeaderCell[],
    visibleRows: BodyRow[],
    allRows: BodyRow[],
    selected: Set<number>
  ): TemplateResult {
    return html`
      <div class="ml-table-scroll w-full overflow-x-auto">
        <table
          class="ml-table w-full border-collapse"
          role="table"
          @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, visibleRows, headers)}
        >
          ${this.renderCaption()}
          <thead class="ml-table-header" role="rowgroup">
            ${this.renderHeaderRow(headers, allRows, selected)}
          </thead>
          <tbody class="ml-table-body" role="rowgroup">
            ${visibleRows.map((row) => this.renderBodyRow(row, headers, selected))}
          </tbody>
          ${this.renderFooter(headers)}
        </table>
      </div>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================

  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang] || messages.en;

    const headers = this.parseHeaderCells();
    const allRows = this.parseBodyRows();
    const selected = this.getSelectedSet();
    const rowCount = allRows.length;

    // Loading takes precedence over empty-state presentation.
    if (this.loading) {
      return html`
        <div class="${this.getRootClasses()}">
          ${this.renderLoading()}
          ${this.renderError()}
        </div>
      `;
    }

    if (rowCount === 0) {
      return html`
        <div class="${this.getRootClasses()}">
          ${this.renderEmpty()}
          ${this.renderPagination(rowCount)}
          ${this.renderError()}
        </div>
      `;
    }

    const visibleRows = this.getVisibleRows(headers);

    return html`
      <div class="${this.getRootClasses()}">
        ${this.renderTableShell(headers, visibleRows, allRows, selected)}
        ${this.renderPagination(rowCount)}
        ${this.renderError()}
      </div>
    `;
  }
}
