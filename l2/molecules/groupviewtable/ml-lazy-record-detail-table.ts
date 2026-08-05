/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-lazy-record-detail-table.ts" enhancement="_102020_/l2/enhancementAura"/>
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
  expandRow: 'Expand row details',
  collapseRow: 'Collapse row details',
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
    expandRow: 'Expandir detalhes da linha',
    collapseRow: 'Recolher detalhes da linha',
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
// LAZY RECORD DETAIL TABLE MOLECULE
// =============================================================================
// Skill Group: groupViewTable
// Presents a sortable, pageable table with on-demand expandable detail rows.
// This molecule does NOT contain business logic.

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
   * O `<Detail>` da linha, quando o consumidor declarou um. É o conteúdo que aparece ao expandir
   * — texto, uma div ou outra tabela.
   *
   * Antes a linha de detalhe reprojetava as MESMAS `<TableCell>` da linha principal. Com slots
   * vivos um nó só existe num lugar: as duas âncoras dividiam a mesma chave e cada render movia
   * os nós de uma para a outra, esvaziando a linha de cima ao expandir. E, de fundo, não havia
   * onde o consumidor pôr o conteúdo do detalhe.
   */
  detailEl: Element | null;
}

@customElement('groupviewtable--ml-lazy-record-detail-table')
export class MlLazyRecordDetailTableMolecule extends MoleculeAuraElement {
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

  /** Set of expanded body-row indices (original order indices). */
  @state()
  private expandedIndices: Set<number> = new Set();

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

  // ===========================================================================
  // IS-EDITING PROPAGATION
  // ===========================================================================

  private propagateEditing() {
    const flag = this.isEditing ? 'true' : 'false';
    const body = this.getLiveSlot('TableBody');
    if (!body) return;
    const cells = body.querySelectorAll('TableCell');
    cells.forEach((cell) => {
      cell.querySelectorAll('*').forEach((el) => {
        if (el.tagName.includes('-')) {
          el.setAttribute('is-editing', flag);
        }
      });
    });
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
  // EXPANSION (lazy detail)
  // ===========================================================================

  private handleToggleExpand(index: number, e?: Event) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (this.disabled || this.loading) return;

    const next = new Set(this.expandedIndices);
    if (next.has(index)) {
      next.delete(index);
      this.expandedIndices = next;
    } else {
      next.add(index);
      this.expandedIndices = next;
      // Emit rowClick so the consumer can lazy-load detail content
      this.dispatchEvent(
        new CustomEvent('rowClick', {
          bubbles: true,
          composed: true,
          detail: { index },
        })
      );
    }
  }

  // ===========================================================================
  // PAGINATION
  // ===========================================================================

  private getTotalPages(): number {
    const size = Number(this.pageSize) || 0;
    if (size <= 0) return 1;
    const total = Number(this.totalItems) || 0;
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
        this.handleToggleExpand(visibleRows[this.focusedRowIndex].index);
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

  private getBodyRowClasses(isSelected: boolean, isFocused: boolean, isExpanded: boolean): string {
    return [
      'ml-table-row',
      isSelected ? 'ml-table-row-selected' : '',
      isFocused ? 'ml-table-row-focused' : '',
      isExpanded ? 'ml-table-row-expanded' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getDetailRowClasses(): string {
    return ['ml-table-detail-row'].filter(Boolean).join(' ');
  }

  private getDetailCellClasses(): string {
    return ['px-3 py-3', 'ml-table-detail-cell'].filter(Boolean).join(' ');
  }

  private getExpandBtnClasses(isExpanded: boolean): string {
    return [
      'inline-flex items-center justify-center w-7 h-7 rounded-md',
      'ml-table-expand-btn',
      isExpanded ? 'ml-table-expand-btn-open' : '',
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

  private renderExpandIcon(isExpanded: boolean): TemplateResult {
    // Chevron down when collapsed; chevron up when expanded
    if (isExpanded) {
      return html`
        <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          ${
svg`<path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />`}
        </svg>
      `;
    }
    return html`
      <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        ${
svg`<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />`}
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

  private renderExpandHeadCell(): TemplateResult {
    // Untitled first control column dedicated to expand/collapse
    return html`
      <th class="w-10 px-2 py-2 ml-table-head ml-table-expand-cell" scope="col">
        <span class="sr-only">${this.msg.expandRow}</span>
      </th>
    `;
  }

  private renderHeader(headers: HeaderCell[], visibleRows: BodyRow[]): TemplateResult {
    return html`
      <thead class="ml-table-thead" role="rowgroup">
        <tr class="ml-table-header-row" role="row">
          ${this.renderExpandHeadCell()}
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

  private renderExpandCell(rowIndex: number, isExpanded: boolean): TemplateResult {
    const label = isExpanded ? this.msg.collapseRow : this.msg.expandRow;
    return html`
      <td class="w-10 px-2 py-2 ml-table-cell ml-table-expand-cell" role="cell">
        <button
          type="button"
          class=${this.getExpandBtnClasses(isExpanded)}
          ?disabled=${this.disabled || this.loading}
          aria-expanded=${isExpanded ? 'true' : 'false'}
          aria-label=${`${label} ${rowIndex + 1}`}
          @click=${(e: Event) => this.handleToggleExpand(rowIndex, e)}
        >
          ${this.renderExpandIcon(isExpanded)}
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
   * Linha de detalhe: projeta o `<Detail>` que o consumidor declarou dentro da `<TableRow>`.
   *
   * O fluxo lazy é este: ao expandir, a molécula emite `rowClick` com o índice; o consumidor
   * carrega o que precisar e escreve dentro do `<Detail>` daquela linha. Como o slot é vivo, o
   * conteúdo entra com handler e binding — pode ser outra tabela, com botões que funcionam.
   *
   * Sem `<Detail>` a área fica vazia, o que é o certo enquanto o consumidor ainda está buscando.
   */
  private renderDetailRow(
    row: BodyRow,
    colSpan: number,
    isSelected: boolean
  ): TemplateResult {
    return html`
      <tr
        class=${cn(this.getDetailRowClasses(), isSelected ? 'ml-table-row-selected' : '')}
        role="row"
        data-detail-for=${row.index}
      >
        <td class=${this.getDetailCellClasses()} role="cell" colspan=${colSpan}>
          <div class="ml-table-detail-content">
            ${row.detailEl ? this.renderLiveSlotFrom(row.detailEl) : nothing}
          </div>
        </td>
      </tr>
    `;
  }

  private renderBodyRow(
    row: BodyRow,
    visibleIndex: number,
    colSpan: number,
    selected: Set<number>
  ): TemplateResult {
    const isSelected = selected.has(row.index);
    const isExpanded = this.expandedIndices.has(row.index);
    const isFocused = this.focusedRowIndex === visibleIndex;

    return html`
      <tr
        class=${this.getBodyRowClasses(isSelected, isFocused, isExpanded)}
        role="row"
        tabindex=${!this.disabled ? '0' : nothing}
        aria-selected=${this.selectable ? (isSelected ? 'true' : 'false') : nothing}
        aria-expanded=${isExpanded ? 'true' : 'false'}
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
        ${this.renderExpandCell(row.index, isExpanded)}
        ${this.renderSelectCell(row.index, isSelected)}
        ${this.renderDataCells(row.cells)}
      </tr>
      ${isExpanded ? this.renderDetailRow(row, colSpan, isSelected) : nothing}
    `;
  }

  private renderBody(
    rows: BodyRow[],
    headers: HeaderCell[],
    selected: Set<number>
  ): TemplateResult {
    // Expand col + optional select col + data columns
    const colSpan = 1 + (this.selectable ? 1 : 0) + headers.length;

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
        ${rows.map((row, i) => this.renderBodyRow(row, i, colSpan, selected))}
      </tbody>
    `;
  }

  private renderFooter(headers: HeaderCell[]): TemplateResult {
    const footerRows = this.parseFooterRows();
    if (footerRows.length === 0) return html``;
    const colPad = 1 + (this.selectable ? 1 : 0);

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

    return html`
      <div
        class=${this.getRootClasses()}
        @keydown=${(e: KeyboardEvent) => this.handleTableKeyDown(e, visibleRows)}
      >
        ${this.loading
          ? this.renderLoading()
          : html`
              <div class=${this.getTableWrapClasses()}>
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
              ${this.renderPagination()}
            `}
        ${this.renderError()}
      </div>
    `;
  }
}
