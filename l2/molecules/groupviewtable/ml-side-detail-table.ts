/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-side-detail-table.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, nothing, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cellSortKey, compareSortKeys } from '/_102033_/l2/shared/molecules/tableSort.js';

@customElement('groupviewtable--ml-side-detail-table')
export class DetailPanelTableMolecule extends MoleculeAuraElement {
  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = [
    'Caption', 'TableHeader', 'TableBody', 'TableRow', 'TableHead', 'TableCell',
    'TableFooter', 'Empty', 'Loading', 'Detail', 'RowActions', 'RowAction', 'NewRecordRow',
  ];
  usesLiveSlots = true;

  // ===========================================================================
  // PROPERTIES — groupViewTable contract
  // ===========================================================================
  @propertyDataSource({ type: Boolean, attribute: 'selectable' }) selectable = false;
  @propertyDataSource({ type: Boolean, attribute: 'is-editing' }) isEditing = false;
  @propertyDataSource({ type: String, attribute: 'editing-rows' }) editingRows: string | undefined;
  @propertyDataSource({ type: Number, attribute: 'page' }) page = 1;
  @propertyDataSource({ type: Number, attribute: 'page-size' }) pageSize = 0;
  @propertyDataSource({ type: Number, attribute: 'total-items' }) totalItems = 0;
  @propertyDataSource({ type: String }) value = '';
  @propertyDataSource({ type: String }) error = '';
  @propertyDataSource({ type: Boolean }) disabled = false;
  @propertyDataSource({ type: Boolean }) loading = false;
  @propertyDataSource({ type: Boolean, attribute: 'fit-height' }) fitHeight = false;

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state() private sortKey: string | null = null;
  @state() private sortDirection = 'asc';
  @state() private openRow: Element | null = null;

  // ===========================================================================
  // STRUCTURE HELPERS
  // ===========================================================================
  private bodyRows(): Element[] {
    const body = this.getLiveSlot('TableBody');
    return body ? Array.from(body.querySelectorAll(':scope > TableRow')) : [];
  }

  private headerCells(): Element[] {
    const header = this.getLiveSlot('TableHeader');
    const row = header?.querySelector(':scope > TableRow');
    return row ? Array.from(row.querySelectorAll(':scope > TableHead')) : [];
  }

  private rowCells(row: Element): Element[] {
    return Array.from(row.querySelectorAll(':scope > TableCell'));
  }

  private rowDetail(row: Element | null): Element | null {
    return row?.querySelector(':scope > Detail') ?? null;
  }

  private externalMode(rows: Element[]): boolean {
    return Number(this.totalItems) > rows.length;
  }

  private totalPages(rowCount: number): number {
    const size = Number(this.pageSize) || 0;
    if (!size) return 1;
    const total = this.externalMode(this.bodyRows()) ? Number(this.totalItems) : rowCount;
    return Math.max(1, Math.ceil(total / size));
  }

  private displayedRows(rows: Element[]): Array<{ row: Element; index: number }> {
    const indexed = rows.map((row, index) => ({ row, index }));
    if (this.externalMode(rows)) return indexed;

    let ordered = indexed;
    if (this.sortKey) {
      const column = this.headerCells().findIndex((head) => head.getAttribute('key') === this.sortKey);
      if (column >= 0) {
        ordered = [...indexed].sort((left, right) => {
          const leftCell = this.rowCells(left.row)[column];
          const rightCell = this.rowCells(right.row)[column];
          const leftKey = cellSortKey(leftCell, this.getLiveText(leftCell));
          const rightKey = cellSortKey(rightCell, this.getLiveText(rightCell));
          const direction = this.sortDirection === 'asc' ? 1 : -1;
          return compareSortKeys(leftKey, rightKey) * direction;
        });
      }
    }

    const size = Number(this.pageSize) || 0;
    const currentPage = Math.max(1, Number(this.page) || 1);
    const start = (currentPage - 1) * size;
    return size ? ordered.slice(start, start + size) : ordered;
  }

  private selectedIndices(): Set<number> {
    return new Set(String(this.value ?? '').split(',').map(Number)
      .filter((index) => Number.isInteger(index) && index >= 0));
  }

  private rowKey(row: Element, index: number): string {
    return row.getAttribute('key') || String(index);
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private emit(name: string, detail: Record<string, unknown>): void {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
  }

  private handleSort(head: Element): void {
    if (this.disabled || !head.hasAttribute('sortable')) return;
    const key = head.getAttribute('key') || '';
    this.sortDirection = this.sortKey === key && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortKey = key;
    this.emit('sort', { key, direction: this.sortDirection });
  }

  private handlePage(page: number): void {
    if (this.disabled || page < 1 || page > this.totalPages(this.bodyRows().length)) return;
    this.emit('pageChange', { page });
  }

  private handleRowClick(row: Element, index: number, event: Event): void {
    if (this.disabled) return;
    const target = event.target as Element;
    if (target.closest('input, button, select, textarea, [data-row-action], RowAction')) return;
    this.openRow = row;
    this.emit('rowClick', { index });
  }

  private handleRowKey(row: Element, index: number, event: KeyboardEvent): void {
    if (event.key === 'Enter') this.handleRowClick(row, index, event);
    if (event.key === ' ' && this.selectable) {
      event.preventDefault();
      this.toggleSelection(index);
    }
  }

  private updateSelection(indices: Set<number>): void {
    const value = [...indices].sort((a, b) => a - b).join(',');
    this.value = value;
    this.emit('change', { value });
  }

  private toggleSelection(index: number): void {
    if (this.disabled || !this.selectable) return;
    const selected = this.selectedIndices();
    if (selected.has(index)) selected.delete(index); else selected.add(index);
    this.updateSelection(selected);
  }

  private toggleAll(rows: Element[]): void {
    if (this.disabled || !this.selectable) return;
    const selected = this.selectedIndices();
    const allSelected = rows.length > 0 && rows.every((_, index) => selected.has(index));
    rows.forEach((_, index) => allSelected ? selected.delete(index) : selected.add(index));
    this.updateSelection(selected);
  }

  private handleClose(): void {
    if (this.disabled) return;
    this.openRow = null;
  }

  // ===========================================================================
  // EDITING PROPAGATION
  // ===========================================================================
  private propagateEditing(rows: Element[]): void {
    const ownsEditing = this.getAttribute('is-editing') !== null
      || this.getAttribute('editing-rows') !== null
      || this.isEditing || this.editingRows !== undefined;
    if (!ownsEditing) return;

    const openKeys = new Set(String(this.editingRows ?? '').split(',')
      .map((key) => key.trim()).filter(Boolean));
    const mark = (root: Element, editing: boolean): void => {
      root.querySelectorAll<HTMLElement>('*').forEach((child) => {
        if (child.tagName.includes('-')) child.setAttribute('is-editing', String(editing));
      });
    };

    rows.forEach((row, index) => {
      const editing = this.isEditing || openKeys.has(this.rowKey(row, index));
      mark(row, editing);
      const rendered = this.querySelector<HTMLElement>(`tr[data-source-index="${index}"]`);
      if (rendered) mark(rendered, editing);
    });
  }

  updated(): void {
    this.propagateEditing(this.bodyRows());
  }

  handleIcaStateChange(key: string, value: unknown): void {
    const editing = this.getAttribute('is-editing');
    const rows = this.getAttribute('editing-rows');
    if (editing === `{{${key}}}` || rows === `{{${key}}}`) this.propagateEditing(this.bodyRows());
    this.requestUpdate();
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderHeader(heads: Element[], rows: Element[]): TemplateResult {
    const selected = this.selectedIndices();
    const allSelected = rows.length > 0 && rows.every((_, index) => selected.has(index));
    return html`<thead class="ml-table-header"><tr role="row">
      ${this.selectable ? html`<th role="columnheader" class="p-2"><input type="checkbox"
        .checked=${allSelected} aria-label="Select all rows" ?disabled=${this.disabled}
        @input=${(event: Event) => event.stopPropagation()}
        @change=${(event: Event) => { event.stopPropagation(); this.toggleAll(rows); }}></th>` : nothing}
      ${heads.map((head) => {
        const key = head.getAttribute('key') || '';
        const active = this.sortKey === key;
        const direction = active && this.sortDirection === 'desc' ? 'descending' : 'ascending';
        const sortable = head.hasAttribute('sortable');
        const classes = ['p-3 text-left text-sm font-semibold ml-label', sortable ? 'ml-sortable-header cursor-pointer' : '', active ? 'ml-sorted' : ''].filter(Boolean).join(' ');
        return html`<th role="columnheader" tabindex="${sortable ? '0' : '-1'}"
          aria-sort=${sortable ? (active ? direction : 'none') : nothing} class="${classes}"
          @click=${() => this.handleSort(head)} @keydown=${(event: KeyboardEvent) => {
            if (sortable && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); this.handleSort(head); }
          }}>${this.renderLiveSlotFrom(head)}${sortable ? html`<span aria-hidden="true" class="ml-sort-indicator">${active ? (this.sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}</span>` : nothing}</th>`;
      })}
    </tr></thead>`;
  }

  private renderBody(rows: Element[]): TemplateResult {
    const selected = this.selectedIndices();
    return html`<tbody class="ml-table-body">${this.displayedRows(rows).map(({ row, index }) => {
      const rowEditing = this.isEditing || String(this.editingRows ?? '').split(',').map((key) => key.trim()).includes(this.rowKey(row, index));
      const classes = ['ml-table-row', selected.has(index) ? 'ml-selected' : '', this.openRow === row ? 'ml-active-row' : '', rowEditing ? 'ml-editing' : '', this.disabled ? 'ml-disabled' : ''].filter(Boolean).join(' ');
      return html`<tr role="row" tabindex="0" data-source-index="${index}" class="${classes}"
        @click=${(event: Event) => this.handleRowClick(row, index, event)}
        @keydown=${(event: KeyboardEvent) => this.handleRowKey(row, index, event)}>
        ${this.selectable ? html`<td role="cell" class="p-2"><input type="checkbox" .checked=${selected.has(index)}
          aria-label="Select row ${index + 1}" ?disabled=${this.disabled}
          @input=${(event: Event) => event.stopPropagation()}
          @change=${(event: Event) => { event.stopPropagation(); this.toggleSelection(index); }}></td>` : nothing}
        ${this.rowCells(row).map((cell) => html`<td role="cell" class="p-3 text-sm ml-text">${this.renderLiveSlotFrom(cell)}</td>`)}
      </tr>`;
    })}</tbody>`;
  }

  private renderFooter(): TemplateResult {
    const footer = this.getLiveSlot('TableFooter');
    if (!footer) return html``;
    return html`<tfoot class="ml-table-footer">${Array.from(footer.querySelectorAll(':scope > TableRow')).map((row) => html`<tr role="row">${this.rowCells(row).map((cell) => html`<td role="cell" class="p-3 text-sm ml-text-muted">${this.renderLiveSlotFrom(cell)}</td>`)}</tr>`)}</tfoot>`;
  }

  private renderPagination(pages: number): TemplateResult {
    if (pages <= 1) return html``;
    const current = Math.min(Math.max(1, Number(this.page) || 1), pages);
    return html`<nav role="navigation" aria-label="Table pagination" class="ml-table-pagination inline-flex items-center gap-2 p-3">
      <button class="ml-pagination-button px-3 py-2 text-sm" ?disabled=${this.disabled || current <= 1} @click=${() => this.handlePage(current - 1)}>Previous</button>
      <span class="ml-text-muted text-sm">Page ${current} of ${pages}</span>
      <button class="ml-pagination-button px-3 py-2 text-sm" ?disabled=${this.disabled || current >= pages} @click=${() => this.handlePage(current + 1)}>Next</button>
    </nav>`;
  }

  private renderDetail(): TemplateResult {
    if (!this.openRow) return html``;
    const detail = this.rowDetail(this.openRow);
    const label = detail?.getAttribute('label') || 'Record detail';
    return html`<aside class="ml-detail-panel ml-surface-bg p-4" aria-label="${label}">
      <div class="flex items-center justify-between gap-2"><span class="ml-label text-sm">${label}</span>
        <button class="ml-detail-close px-3 py-2 text-sm" aria-label="Close detail" ?disabled=${this.disabled} @click=${this.handleClose}>Close</button>
      </div>
      <div class="ml-detail-content mt-4">${detail ? this.renderLiveSlotFrom(detail) : html`<p class="ml-text-muted">No detail available.</p>`}</div>
    </aside>`;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render(): TemplateResult {
    const rows = this.bodyRows();
    const layout = ['ml-table-layout flex w-full gap-4', this.fitHeight ? 'ml-fit-height' : '', this.openRow ? 'ml-detail-open' : '', this.disabled ? 'ml-disabled' : ''].filter(Boolean).join(' ');
    if (this.loading) {
      return html`<div class="${layout}"><section class="ml-table-region min-w-0 flex-1"><div class="ml-loading p-4 ml-skeleton">${this.hasSlot('Loading') ? this.renderLiveSlot('Loading') : 'Loading...'}</div></section>${this.renderDetail()}</div>`;
    }

    const tableContent = rows.length === 0
      ? html`<div class="ml-empty p-4 ml-text-muted">${this.hasSlot('Empty') ? this.renderLiveSlot('Empty') : 'No records found.'}</div>`
      : html`<div class="ml-table-scroll"><table role="table" class="ml-table w-full border" aria-label="Group table">
          ${this.renderHeader(this.headerCells(), rows)}${this.renderBody(rows)}${this.renderFooter()}
        </table></div>${this.renderPagination(this.totalPages(rows.length))}`;

    return html`<div class="${layout}"><section class="ml-table-region min-w-0 flex-1" aria-label="Group table">
      ${this.hasSlot('Caption') ? html`<div class="ml-caption p-3 text-sm ml-label">${this.renderLiveSlot('Caption')}</div>` : nothing}
      ${this.error ? html`<div role="alert" class="ml-error-text p-3 text-sm">${unsafeHTML(String(this.error))}</div>` : nothing}
      ${tableContent}
    </section>${this.renderDetail()}</div>`;
  }
}
