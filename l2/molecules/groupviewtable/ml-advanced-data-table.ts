/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-advanced-data-table.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, nothing, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  empty: 'No data available',
  loading: 'Loading...',
  selectAll: 'Select all rows',
  selectRow: 'Select row',
  pagination: 'Table pagination',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  page: 'Page',
  of: 'of',
  total: 'Total',
  rowTotal: 'Row total',
  sortAsc: 'sorted ascending',
  sortDesc: 'sorted descending',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    empty: 'Nenhum dado dispon\u00edvel',
    loading: 'Carregando...',
    selectAll: 'Selecionar todas as linhas',
    selectRow: 'Selecionar linha',
    pagination: 'Pagina\u00e7\u00e3o da tabela',
    previousPage: 'P\u00e1gina anterior',
    nextPage: 'Pr\u00f3xima p\u00e1gina',
    page: 'P\u00e1gina',
    of: 'de',
    total: 'Total',
    rowTotal: 'Total da linha',
    sortAsc: 'ordenado crescente',
    sortDesc: 'ordenado decrescente',
  },
};
/// **collab_i18n_end**

// =============================================================================
// ADVANCED DATA TABLE MOLECULE
// =============================================================================
// Skill Group: groupViewTable
// Interactive data table with sorting, resizing, reordering, pagination,
// optional row totals and column-sum footer. Presentation only.

interface ColumnDef {
  key: string;
  label: string;
  sortable: boolean;
  originalIndex: number;
}

interface ParsedRow {
  index: number;
  cells: string[];
  dataClass: string;
}

@customElement('groupviewtable--ml-advanced-data-table')
export class AdvancedDataTableMolecule extends MoleculeAuraElement {
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

  @propertyDataSource({ type: Boolean, attribute: 'show-row-total' })
  showRowTotal: boolean = false;

  @propertyDataSource({ type: Boolean, attribute: 'show-column-total' })
  showColumnTotal: boolean = false;

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private sortKey: string | null = null;

  @state()
  private sortDirection: string = 'asc';

  @state()
  private columnOrder: string[] = [];

  @state()
  private columnWidths: Record<string, number> = {};

  @state()
  private focusedRowIndex: number = -1;

  // Resize drag state
  private _resizingKey: string | null = null;
  private _resizeStartX = 0;
  private _resizeStartWidth = 0;

  // Reorder drag state
  @state()
  private _dragKey: string | null = null;

  @state()
  private _dropTargetKey: string | null = null;

  private _dropBefore = true;

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

  handleIcaStateChange(key: string, _value: any) {
    const isEditingAttr = this.getAttribute('is-editing');
    if (isEditingAttr === `{{${key}}}`) {
      this.propagateEditing();
    }
    this.requestUpdate();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.teardownResizeListeners();
  }

  // ===========================================================================
  // isEditing PROPAGATION
  // ===========================================================================
  private propagateEditing() {
    const editing = !!this.isEditing;
    const cells = this.querySelectorAll('TableCell');
    cells.forEach((cell) => {
      const customs = cell.querySelectorAll('*');
      customs.forEach((el) => {
        if (el.tagName.includes('-')) {
          if (editing) {
            el.setAttribute('is-editing', 'true');
          } else {
            el.setAttribute('is-editing', 'false');
          }
        }
      });
    });
    // Also propagate into rendered custom elements inside the live DOM table
    const rendered = this.querySelectorAll('[data-ml-cell] *');
    rendered.forEach((el) => {
      if ((el as HTMLElement).tagName.includes('-')) {
        if (editing) {
          el.setAttribute('is-editing', 'true');
        } else {
          el.setAttribute('is-editing', 'false');
        }
      }
    });
  }

  // ===========================================================================
  // PARSE SLOT DATA
  // ===========================================================================
  private parseColumns(): ColumnDef[] {
    const header = this.getSlot('TableHeader');
    if (!header) return [];

    const headerRow = header.querySelector('TableRow');
    if (!headerRow) return [];

    const heads = Array.from(headerRow.querySelectorAll('TableHead'));
    return heads.map((head, i) => ({
      key: head.getAttribute('key') || `col-${i}`,
      label: head.innerHTML,
      sortable: head.hasAttribute('sortable'),
      originalIndex: i,
    }));
  }

  private parseRows(): ParsedRow[] {
    const body = this.getSlot('TableBody');
    if (!body) return [];

    const rows = Array.from(body.querySelectorAll('TableRow'));
    return rows.map((row, i) => {
      const cells = Array.from(row.querySelectorAll('TableCell'));
      return {
        index: i,
        cells: cells.map((c) => c.innerHTML),
        dataClass: row.getAttribute('data-class') || '',
      };
    });
  }

  private parseFooterCells(): string[] {
    const footer = this.getSlot('TableFooter');
    if (!footer) return [];
    const footerRow = footer.querySelector('TableRow');
    if (!footerRow) return [];
    return Array.from(footerRow.querySelectorAll('TableCell')).map((c) => c.innerHTML);
  }

  private getOrderedColumns(columns: ColumnDef[]): ColumnDef[] {
    if (this.columnOrder.length === 0) return columns;

    const map = new Map(columns.map((c) => [c.key, c]));
    const ordered: ColumnDef[] = [];

    for (const key of this.columnOrder) {
      const col = map.get(key);
      if (col) {
        ordered.push(col);
        map.delete(key);
      }
    }
    // Append any new columns not yet in order
    map.forEach((col) => ordered.push(col));
    return ordered;
  }

  private ensureColumnOrder(columns: ColumnDef[]) {
    if (this.columnOrder.length === 0 && columns.length > 0) {
      this.columnOrder = columns.map((c) => c.key);
    } else if (columns.length > 0) {
      // Sync: add missing keys, remove stale ones
      const keys = new Set(columns.map((c) => c.key));
      const filtered = this.columnOrder.filter((k) => keys.has(k));
      const missing = columns.filter((c) => !filtered.includes(c.key)).map((c) => c.key);
      if (filtered.length !== this.columnOrder.length || missing.length > 0) {
        this.columnOrder = [...filtered, ...missing];
      }
    }
  }

  // ===========================================================================
  // SELECTION HELPERS
  // ===========================================================================
  private getSelectedIndices(): Set<number> {
    const raw = String(this.value ?? '').trim();
    if (!raw) return new Set();
    return new Set(
      raw
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
    const checked = (e.target as HTMLInputElement).checked;
    const rows = this.getSortedRows(this.parseRows(), this.parseColumns());
    if (checked) {
      this.setSelectedIndices(new Set(rows.map((r) => r.index)));
    } else {
      this.setSelectedIndices(new Set());
    }
  }

  private handleRowSelect(e: Event, rowIndex: number) {
    e.stopPropagation();
    if (this.disabled) return;
    const selected = this.getSelectedIndices();
    if (selected.has(rowIndex)) {
      selected.delete(rowIndex);
    } else {
      selected.add(rowIndex);
    }
    this.setSelectedIndices(selected);
  }

  // ===========================================================================
  // SORTING
  // ===========================================================================
  private handleSort(col: ColumnDef) {
    if (this.disabled || !col.sortable) return;

    if (this.sortKey === col.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = col.key;
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

  private getSortedRows(rows: ParsedRow[], columns: ColumnDef[]): ParsedRow[] {
    if (!this.sortKey) return rows;

    const col = columns.find((c) => c.key === this.sortKey);
    if (!col) return rows;

    const colIndex = col.originalIndex;
    const dir = this.sortDirection === 'asc' ? 1 : -1;

    return [...rows].sort((a, b) => {
      const aText = this.cellText(a.cells[colIndex] ?? '');
      const bText = this.cellText(b.cells[colIndex] ?? '');

      const aNum = parseFloat(aText.replace(/[^0-9.\-]/g, ''));
      const bNum = parseFloat(bText.replace(/[^0-9.\-]/g, ''));

      if (!isNaN(aNum) && !isNaN(bNum) && aText.match(/[0-9]/) && bText.match(/[0-9]/)) {
        return (aNum - bNum) * dir;
      }
      return aText.localeCompare(bText, undefined, { sensitivity: 'base', numeric: true }) * dir;
    });
  }

  private cellText(htmlContent: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = htmlContent;
    return (tmp.textContent || '').trim();
  }

  // ===========================================================================
  // COLUMN RESIZE
  // ===========================================================================
  private handleResizeStart(e: PointerEvent, key: string) {
    if (this.disabled) return;
    e.preventDefault();
    e.stopPropagation();

    this._resizingKey = key;
    this._resizeStartX = e.clientX;
    this._resizeStartWidth = this.columnWidths[key] || this.getHeaderWidth(key);

    document.addEventListener('pointermove', this.handleResizeMove);
    document.addEventListener('pointerup', this.handleResizeEnd);
  }

  private getHeaderWidth(key: string): number {
    const el = this.querySelector(`[data-col-key="${key}"]`) as HTMLElement | null;
    return el ? el.getBoundingClientRect().width : 120;
  }

  private handleResizeMove = (e: PointerEvent) => {
    if (!this._resizingKey) return;
    const delta = e.clientX - this._resizeStartX;
    const newWidth = Math.max(48, this._resizeStartWidth + delta);
    this.columnWidths = { ...this.columnWidths, [this._resizingKey]: newWidth };
  };

  private handleResizeEnd = () => {
    this._resizingKey = null;
    this.teardownResizeListeners();
  };

  private teardownResizeListeners() {
    document.removeEventListener('pointermove', this.handleResizeMove);
    document.removeEventListener('pointerup', this.handleResizeEnd);
  }

  // ===========================================================================
  // COLUMN REORDER (drag & drop)
  // ===========================================================================
  private handleDragStart(e: DragEvent, key: string) {
    if (this.disabled) return;
    this._dragKey = key;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', key);
    }
  }

  private handleDragOver(e: DragEvent, key: string) {
    if (this.disabled || !this._dragKey || this._dragKey === key) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';

    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    this._dropBefore = e.clientX < rect.left + rect.width / 2;
    this._dropTargetKey = key;
  }

  private handleDragLeave(e: DragEvent, key: string) {
    if (this._dropTargetKey === key) {
      this._dropTargetKey = null;
    }
  }

  private handleDrop(e: DragEvent, targetKey: string) {
    e.preventDefault();
    if (this.disabled || !this._dragKey || this._dragKey === targetKey) {
      this.resetDragState();
      return;
    }

    const order = [...this.columnOrder];
    const fromIdx = order.indexOf(this._dragKey);
    if (fromIdx === -1) {
      this.resetDragState();
      return;
    }

    order.splice(fromIdx, 1);
    let toIdx = order.indexOf(targetKey);
    if (toIdx === -1) {
      this.resetDragState();
      return;
    }
    if (!this._dropBefore) toIdx += 1;
    order.splice(toIdx, 0, this._dragKey);

    this.columnOrder = order;
    this.resetDragState();
  }

  private handleDragEnd() {
    this.resetDragState();
  }

  private resetDragState() {
    this._dragKey = null;
    this._dropTargetKey = null;
    this._dropBefore = true;
  }

  // ===========================================================================
  // PAGINATION
  // ===========================================================================
  private getTotalPages(): number {
    const size = Number(this.pageSize) || 0;
    const total = Number(this.totalItems) || 0;
    if (size <= 0) return 1;
    return Math.max(1, Math.ceil(total / size));
  }

  private handlePageChange(newPage: number) {
    if (this.disabled) return;
    const totalPages = this.getTotalPages();
    const page = Math.max(1, Math.min(newPage, totalPages));
    if (page === Number(this.page)) return;

    this.page = page;
    this.dispatchEvent(
      new CustomEvent('pageChange', {
        bubbles: true,
        composed: true,
        detail: { page },
      })
    );
  }

  private getVisiblePageNumbers(): number[] {
    const total = this.getTotalPages();
    const current = Number(this.page) || 1;
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    let start = Math.max(2, current - 1);
    let end = Math.min(total - 1, current + 1);

    if (current <= 3) {
      start = 2;
      end = 4;
    } else if (current >= total - 2) {
      start = total - 3;
      end = total - 1;
    }

    if (start > 2) pages.push(-1); // ellipsis marker
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push(-1);
    pages.push(total);
    return pages;
  }

  // ===========================================================================
  // ROW / COLUMN TOTALS
  // ===========================================================================
  private parseNumeric(text: string): number | null {
    const cleaned = text.replace(/[^0-9.,\-]/g, '').replace(',', '.');
    if (!cleaned || cleaned === '-' || cleaned === '.') return null;
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }

  private computeRowTotal(row: ParsedRow, columns: ColumnDef[]): number {
    let sum = 0;
    let hasNum = false;
    for (const col of columns) {
      const text = this.cellText(row.cells[col.originalIndex] ?? '');
      const num = this.parseNumeric(text);
      if (num !== null) {
        sum += num;
        hasNum = true;
      }
    }
    return hasNum ? sum : 0;
  }

  private computeColumnTotal(rows: ParsedRow[], col: ColumnDef): number {
    let sum = 0;
    let hasNum = false;
    for (const row of rows) {
      const text = this.cellText(row.cells[col.originalIndex] ?? '');
      const num = this.parseNumeric(text);
      if (num !== null) {
        sum += num;
        hasNum = true;
      }
    }
    return hasNum ? sum : 0;
  }

  private formatTotal(n: number): string {
    if (Number.isInteger(n)) return String(n);
    return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  // ===========================================================================
  // ROW CLICK / KEYBOARD
  // ===========================================================================
  private handleRowClick(e: Event, index: number) {
    if (this.disabled) return;
    const target = e.target as HTMLElement;
    if (target.closest('input[type="checkbox"]')) return;
    if (target.closest('button')) return;

    this.focusedRowIndex = index;
    this.dispatchEvent(
      new CustomEvent('rowClick', {
        bubbles: true,
        composed: true,
        detail: { index },
      })
    );
  }

  private handleTableKeydown(e: KeyboardEvent, rows: ParsedRow[]) {
    if (this.disabled || rows.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.focusedRowIndex = Math.min(this.focusedRowIndex + 1, rows.length - 1);
      if (this.focusedRowIndex < 0) this.focusedRowIndex = 0;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.focusedRowIndex = Math.max(this.focusedRowIndex - 1, 0);
    } else if (e.key === ' ' || e.key === 'Spacebar') {
      if (this.selectable && this.focusedRowIndex >= 0 && this.focusedRowIndex < rows.length) {
        e.preventDefault();
        const rowIndex = rows[this.focusedRowIndex].index;
        const selected = this.getSelectedIndices();
        if (selected.has(rowIndex)) {
          selected.delete(rowIndex);
        } else {
          selected.add(rowIndex);
        }
        this.setSelectedIndices(selected);
      }
    } else if (e.key === 'Enter' && this.focusedRowIndex >= 0 && this.focusedRowIndex < rows.length) {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent('rowClick', {
          bubbles: true,
          composed: true,
          detail: { index: rows[this.focusedRowIndex].index },
        })
      );
    }
  }

  private handleHeaderKeydown(e: KeyboardEvent, col: ColumnDef) {
    if (this.disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.handleSort(col);
    }
  }

  // ===========================================================================
  // CLASS HELPERS
  // ===========================================================================
  private getRootClasses(): string {
    return [
      'flex flex-col w-full gap-2',
      'ml-table-root',
      this.disabled ? 'ml-disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getTableWrapperClasses(): string {
    return ['w-full overflow-x-auto', 'ml-table-wrapper'].filter(Boolean).join(' ');
  }

  private getTableClasses(): string {
    return ['w-full border-collapse', 'ml-table'].filter(Boolean).join(' ');
  }

  private getHeadCellClasses(col: ColumnDef): string {
    return [
      'relative text-left text-sm font-semibold px-3 py-2 select-none',
      'ml-table-head',
      col.sortable && !this.disabled ? 'cursor-pointer' : '',
      this.sortKey === col.key ? 'ml-table-head-sorted' : '',
      this._dragKey === col.key ? 'ml-table-head-dragging' : '',
      this._dropTargetKey === col.key ? 'ml-table-head-drop-target' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getBodyCellClasses(): string {
    return ['text-sm px-3 py-2', 'ml-table-cell', 'ml-text'].filter(Boolean).join(' ');
  }

  private getRowClasses(row: ParsedRow, isSelected: boolean, isFocused: boolean): string {
    return [
      'ml-table-row',
      isSelected ? 'ml-table-row-selected' : '',
      isFocused ? 'ml-table-row-focused' : '',
      !this.disabled ? 'cursor-pointer' : '',
      row.dataClass,
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getTotalCellClasses(): string {
    return [
      'text-sm px-3 py-2 font-semibold',
      'ml-table-cell',
      'ml-table-row-total',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getFooterCellClasses(): string {
    return [
      'text-sm px-3 py-2 font-semibold',
      'ml-table-cell',
      'ml-table-col-total',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getColStyle(key: string): string {
    const w = this.columnWidths[key];
    if (w) return `width: ${w}px; min-width: ${w}px; max-width: ${w}px;`;
    return '';
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderCaption(): TemplateResult {
    if (!this.hasSlot('Caption')) return html``;
    return html`
      <caption class=${cn('text-sm font-semibold text-left mb-2 ml-label', this.getSlotClass('Caption'))}>
        ${unsafeHTML(this.getSlotContent('Caption'))}
      </caption>
    `;
  }

  private renderSortIndicator(col: ColumnDef): TemplateResult {
    if (this.sortKey !== col.key) {
      return col.sortable
        ? html`<span class="ml-sort-indicator ml-sort-inactive inline-flex ml-1" aria-hidden="true">\u2195</span>`
        : html``;
    }
    const arrow = this.sortDirection === 'asc' ? '\u2191' : '\u2193';
    return html`<span class="ml-sort-indicator ml-sort-active inline-flex ml-1" aria-hidden="true">${arrow}</span>`;
  }

  private renderSelectAllCheckbox(rows: ParsedRow[]): TemplateResult {
    if (!this.selectable) return html``;
    const selected = this.getSelectedIndices();
    const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.index));
    const someSelected = rows.some((r) => selected.has(r.index)) && !allSelected;

    return html`
      <th class="w-10 px-2 py-2 ml-table-head ml-table-select-cell" scope="col" role="columnheader">
        <input
          type="checkbox"
          class="ml-table-checkbox"
          .checked=${allSelected}
          .indeterminate=${someSelected}
          aria-label=${this.msg.selectAll}
          ?disabled=${this.disabled}
          @change=${this.handleSelectAll}
          @click=${(e: Event) => e.stopPropagation()}
          @input=${(e: Event) => e.stopPropagation()}
        />
      </th>
    `;
  }

  private renderRowCheckbox(rowIndex: number, displayIndex: number): TemplateResult {
    if (!this.selectable) return html``;
    const selected = this.getSelectedIndices();
    return html`
      <td class="w-10 px-2 py-2 ml-table-cell ml-table-select-cell" role="cell">
        <input
          type="checkbox"
          class="ml-table-checkbox"
          .checked=${selected.has(rowIndex)}
          aria-label=${`${this.msg.selectRow} ${displayIndex + 1}`}
          ?disabled=${this.disabled}
          @change=${(e: Event) => this.handleRowSelect(e, rowIndex)}
          @click=${(e: Event) => e.stopPropagation()}
          @input=${(e: Event) => e.stopPropagation()}
        />
      </td>
    `;
  }

  private renderHeader(columns: ColumnDef[], rows: ParsedRow[]): TemplateResult {
    const ordered = this.getOrderedColumns(columns);

    return html`
      <thead class=${cn('ml-table-thead', this.getSlotClass('TableHeader'))} role="rowgroup">
        <tr class="ml-table-row ml-table-header-row" role="row">
          ${this.renderSelectAllCheckbox(rows)}
          ${ordered.map((col) => {
            const ariaSort =
              this.sortKey === col.key
                ? this.sortDirection === 'asc'
                  ? 'ascending'
                  : 'descending'
                : col.sortable
                  ? 'none'
                  : nothing;

            const dropClass =
              this._dropTargetKey === col.key
                ? this._dropBefore
                  ? 'ml-drop-before'
                  : 'ml-drop-after'
                : '';

            return html`
              <th
                class=${cn(this.getHeadCellClasses(col), dropClass)}
                style=${this.getColStyle(col.key)}
                scope="col"
                role="columnheader"
                data-col-key=${col.key}
                aria-sort=${ariaSort}
                tabindex=${col.sortable && !this.disabled ? '0' : nothing}
                draggable=${!this.disabled ? 'true' : 'false'}
                @click=${() => this.handleSort(col)}
                @keydown=${(e: KeyboardEvent) => this.handleHeaderKeydown(e, col)}
                @dragstart=${(e: DragEvent) => this.handleDragStart(e, col.key)}
                @dragover=${(e: DragEvent) => this.handleDragOver(e, col.key)}
                @dragleave=${(e: DragEvent) => this.handleDragLeave(e, col.key)}
                @drop=${(e: DragEvent) => this.handleDrop(e, col.key)}
                @dragend=${() => this.handleDragEnd()}
              >
                <div class="flex items-center gap-1 min-w-0">
                  <span class="truncate ml-table-head-label">${unsafeHTML(col.label)}</span>
                  ${this.renderSortIndicator(col)}
                </div>
                <span
                  class="ml-resize-handle absolute top-0 right-0 h-full w-1 cursor-col-resize"
                  @pointerdown=${(e: PointerEvent) => this.handleResizeStart(e, col.key)}
                  @click=${(e: Event) => e.stopPropagation()}
                ></span>
              </th>
            `;
          })}
          ${this.showRowTotal
            ? html`
                <th
                  class="text-left text-sm font-semibold px-3 py-2 ml-table-head ml-table-row-total-head"
                  scope="col"
                  role="columnheader"
                >
                  ${this.msg.rowTotal}
                </th>
              `
            : nothing}
        </tr>
      </thead>
    `;
  }

  private renderBody(columns: ColumnDef[], rows: ParsedRow[]): TemplateResult {
    const ordered = this.getOrderedColumns(columns);
    const selected = this.getSelectedIndices();

    if (rows.length === 0) {
      const colSpan =
        ordered.length + (this.selectable ? 1 : 0) + (this.showRowTotal ? 1 : 0);
      return html`
        <tbody class=${cn('ml-table-tbody', this.getSlotClass('TableBody'))} role="rowgroup">
          <tr role="row">
            <td class="px-3 py-8 text-center ml-table-cell ml-text-muted" colspan=${colSpan} role="cell">
              ${this.renderEmptyContent()}
            </td>
          </tr>
        </tbody>
      `;
    }

    return html`
      <tbody class=${cn('ml-table-tbody', this.getSlotClass('TableBody'))} role="rowgroup">
        ${rows.map((row, displayIdx) => {
          const isSelected = selected.has(row.index);
          const isFocused = this.focusedRowIndex === displayIdx;
          return html`
            <tr
              class=${this.getRowClasses(row, isSelected, isFocused)}
              role="row"
              aria-selected=${this.selectable ? (isSelected ? 'true' : 'false') : nothing}
              tabindex=${!this.disabled ? '0' : nothing}
              @click=${(e: Event) => this.handleRowClick(e, row.index)}
              @focus=${() => {
                this.focusedRowIndex = displayIdx;
              }}
            >
              ${this.renderRowCheckbox(row.index, displayIdx)}
              ${ordered.map(
                (col) => html`
                  <td
                    class=${this.getBodyCellClasses()}
                    style=${this.getColStyle(col.key)}
                    role="cell"
                    data-ml-cell
                    data-col-key=${col.key}
                  >
                    ${unsafeHTML(row.cells[col.originalIndex] ?? '')}
                  </td>
                `
              )}
              ${this.showRowTotal
                ? html`
                    <td class=${this.getTotalCellClasses()} role="cell">
                      ${this.formatTotal(this.computeRowTotal(row, columns))}
                    </td>
                  `
                : nothing}
            </tr>
          `;
        })}
      </tbody>
    `;
  }

  private renderEmptyContent(): TemplateResult {
    if (this.hasSlot('Empty')) {
      return html`<div class=${cn('ml-table-empty', this.getSlotClass('Empty'))}>
        ${unsafeHTML(this.getSlotContent('Empty'))}
      </div>`;
    }
    return html`<div class="ml-table-empty ml-text-muted">${this.msg.empty}</div>`;
  }

  private renderColumnTotalFooter(columns: ColumnDef[], rows: ParsedRow[]): TemplateResult {
    if (!this.showColumnTotal || rows.length === 0) {
      // Still render slot footer if present and not using computed totals exclusively
      return this.renderSlotFooter(columns);
    }

    const ordered = this.getOrderedColumns(columns);
    let grandTotal = 0;

    return html`
      <tfoot class="ml-table-tfoot ml-table-col-total-row" role="rowgroup">
        <tr class="ml-table-row ml-table-footer-row" role="row">
          ${this.selectable
            ? html`<td class="ml-table-cell ml-table-col-total" role="cell"></td>`
            : nothing}
          ${ordered.map((col) => {
            const total = this.computeColumnTotal(rows, col);
            grandTotal += total;
            return html`
              <td
                class=${this.getFooterCellClasses()}
                style=${this.getColStyle(col.key)}
                role="cell"
                data-col-key=${col.key}
              >
                ${this.formatTotal(total)}
              </td>
            `;
          })}
          ${this.showRowTotal
            ? html`
                <td class=${this.getFooterCellClasses()} role="cell">
                  ${this.formatTotal(grandTotal)}
                </td>
              `
            : nothing}
        </tr>
      </tfoot>
    `;
  }

  private renderSlotFooter(columns: ColumnDef[]): TemplateResult {
    if (this.showColumnTotal) return html``;
    const footerCells = this.parseFooterCells();
    if (footerCells.length === 0) return html``;

    const ordered = this.getOrderedColumns(columns);

    return html`
      <tfoot class=${cn('ml-table-tfoot', this.getSlotClass('TableFooter'))} role="rowgroup">
        <tr class="ml-table-row ml-table-footer-row" role="row">
          ${this.selectable
            ? html`<td class="ml-table-cell" role="cell"></td>`
            : nothing}
          ${ordered.map(
            (col) => html`
              <td
                class=${cn(this.getBodyCellClasses(), 'ml-table-footer-cell')}
                style=${this.getColStyle(col.key)}
                role="cell"
              >
                ${unsafeHTML(footerCells[col.originalIndex] ?? '')}
              </td>
            `
          )}
          ${this.showRowTotal
            ? html`<td class=${this.getBodyCellClasses()} role="cell"></td>`
            : nothing}
        </tr>
      </tfoot>
    `;
  }

  private renderLoading(): TemplateResult {
    if (this.hasSlot('Loading')) {
      return html`
        <div class=${cn('w-full p-4 ml-table-loading', this.getSlotClass('Loading'))}>
          ${unsafeHTML(this.getSlotContent('Loading'))}
        </div>
      `;
    }

    // Default skeleton placeholders
    const skeletonRows = [1, 2, 3, 4, 5];
    const skeletonCols = [1, 2, 3, 4];
    return html`
      <div class="w-full overflow-x-auto ml-table-wrapper" aria-busy="true" aria-label=${this.msg.loading}>
        <table class=${this.getTableClasses()} role="table">
          <thead class="ml-table-thead" role="rowgroup">
            <tr class="ml-table-row ml-table-header-row" role="row">
              ${skeletonCols.map(
                () => html`
                  <th class="px-3 py-2 ml-table-head" role="columnheader">
                    <div class="h-4 w-20 rounded ml-skeleton"></div>
                  </th>
                `
              )}
            </tr>
          </thead>
          <tbody class="ml-table-tbody" role="rowgroup">
            ${skeletonRows.map(
              () => html`
                <tr class="ml-table-row" role="row">
                  ${skeletonCols.map(
                    () => html`
                      <td class="px-3 py-3 ml-table-cell" role="cell">
                        <div class="h-4 w-full rounded ml-skeleton"></div>
                      </td>
                    `
                  )}
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  private renderPagination(): TemplateResult {
    const size = Number(this.pageSize) || 0;
    if (size <= 0) return html``;

    const current = Number(this.page) || 1;
    const totalPages = this.getTotalPages();
    const pages = this.getVisiblePageNumbers();

    return html`
      <nav
        class="flex items-center justify-center gap-1 pt-2 ml-table-pagination"
        role="navigation"
        aria-label=${this.msg.pagination}
      >
        <button
          type="button"
          class="px-2 py-1 text-sm rounded ml-pagination-btn"
          aria-label=${this.msg.previousPage}
          ?disabled=${this.disabled || current <= 1}
          @click=${() => this.handlePageChange(current - 1)}
        >
          \u2039
        </button>

        ${pages.map((p) =>
          p === -1
            ? html`<span class="px-1 text-sm ml-text-faint" aria-hidden="true">\u2026</span>`
            : html`
                <button
                  type="button"
                  class=${[
                    'px-2.5 py-1 text-sm rounded min-w-[2rem]',
                    'ml-pagination-btn',
                    p === current ? 'ml-pagination-btn-active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-label=${`${this.msg.page} ${p}`}
                  aria-current=${p === current ? 'page' : nothing}
                  ?disabled=${this.disabled}
                  @click=${() => this.handlePageChange(p)}
                >
                  ${p}
                </button>
              `
        )}

        <button
          type="button"
          class="px-2 py-1 text-sm rounded ml-pagination-btn"
          aria-label=${this.msg.nextPage}
          ?disabled=${this.disabled || current >= totalPages}
          @click=${() => this.handlePageChange(current + 1)}
        >
          \u203a
        </button>

        <span class="ml-2 text-xs ml-text-muted">
          ${this.msg.page} ${current} ${this.msg.of} ${totalPages}
        </span>
      </nav>
    `;
  }

  private renderError(): TemplateResult {
    const err = String(this.error ?? '').trim();
    if (!err) return html``;
    return html`
      <p class="mt-1 text-xs ml-error-text" role="alert">${unsafeHTML(err)}</p>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang] || messages.en;

    if (this.loading) {
      return html`
        <div class=${cn(this.getRootClasses(), this.cssClass)}>
          ${this.renderLoading()}
          ${this.renderError()}
        </div>
      `;
    }

    const columns = this.parseColumns();
    this.ensureColumnOrder(columns);
    const rawRows = this.parseRows();
    const sortedRows = this.getSortedRows(rawRows, columns);

    return html`
      <div
        class=${cn(this.getRootClasses(), this.cssClass)}
        @keydown=${(e: KeyboardEvent) => this.handleTableKeydown(e, sortedRows)}
      >
        <div class=${this.getTableWrapperClasses()}>
          <table class=${this.getTableClasses()} role="table">
            ${this.renderCaption()}
            ${this.renderHeader(columns, sortedRows)}
            ${this.renderBody(columns, sortedRows)}
            ${this.renderColumnTotalFooter(columns, sortedRows)}
          </table>
        </div>
        ${this.renderPagination()}
        ${this.renderError()}
      </div>
    `;
  }
}
