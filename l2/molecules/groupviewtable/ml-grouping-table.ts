/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-grouping-table.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// GROUPING TABLE MOLECULE
// =============================================================================
// Skill Group: groupViewTable
// A table that groups rows by a user-selected groupable column with collapsible
// group headers. Presentation-only — no business logic.

import { html, nothing, svg, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  groupBy: 'Group by',
  noGrouping: 'None',
  empty: 'No data available',
  loading: 'Loading...',
  selectAll: 'Select all rows',
  selectRow: 'Select row',
  expandGroup: 'Expand group',
  collapseGroup: 'Collapse group',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  page: 'Page',
  of: 'of',
  rows: 'rows',
  sortAsc: 'sorted ascending',
  sortDesc: 'sorted descending',
  notSorted: 'not sorted',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    groupBy: 'Agrupar por',
    noGrouping: 'Nenhum',
    empty: 'Nenhum dado disponível',
    loading: 'Carregando...',
    selectAll: 'Selecionar todas as linhas',
    selectRow: 'Selecionar linha',
    expandGroup: 'Expandir grupo',
    collapseGroup: 'Recolher grupo',
    previousPage: 'Página anterior',
    nextPage: 'Próxima página',
    page: 'Página',
    of: 'de',
    rows: 'linhas',
    sortAsc: 'ordenado ascendente',
    sortDesc: 'ordenado descendente',
    notSorted: 'não ordenado',
  },
};
/// **collab_i18n_end**

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ColumnDef {
  key: string;
  label: string;
  sortable: boolean;
  groupable: boolean;
  index: number;
  dataClass: string;
}

interface ParsedRow {
  index: number;
  cells: string[];
  dataClass: string;
  element: Element;
}

interface RowGroup {
  key: string;
  label: string;
  rows: ParsedRow[];
}

@customElement('groupviewtable--ml-grouping-table')
export class MlGroupingTableMolecule extends MoleculeAuraElement {
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

  /** Selected grouping column key (empty = no grouping). */
  @state()
  private groupKey: string = '';

  /** Map of group value → expanded flag. Defaults to expanded. */
  @state()
  private expandedGroups: Record<string, boolean> = {};

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
  // isEditing PROPAGATION
  // ===========================================================================

  private propagateEditing() {
    const editing = !!this.isEditing;
    // Propagate to live DOM children inside original slot tags
    const bodies = Array.from(this.querySelectorAll('TableBody'));
    for (const body of bodies) {
      const customEls = body.querySelectorAll('*');
      customEls.forEach((el) => {
        if (el.tagName.includes('-')) {
          if (editing) {
            el.setAttribute('is-editing', 'true');
          } else {
            el.setAttribute('is-editing', 'false');
          }
        }
      });
    }
  }

  // ===========================================================================
  // PARSERS — columns & rows from slot tags
  // ===========================================================================

  private parseColumns(): ColumnDef[] {
    const header = this.getSlot('TableHeader');
    if (!header) return [];
    const headerRow = header.querySelector('TableRow');
    if (!headerRow) return [];
    const heads = Array.from(headerRow.querySelectorAll('TableHead'));
    return heads.map((head, index) => ({
      key: head.getAttribute('key') || `col-${index}`,
      label: head.innerHTML || head.textContent || '',
      sortable: head.hasAttribute('sortable'),
      groupable: head.hasAttribute('groupable'),
      index,
      dataClass: head.getAttribute('data-class') || '',
    }));
  }

  private parseRows(): ParsedRow[] {
    const body = this.getSlot('TableBody');
    if (!body) return [];
    const rows = Array.from(body.querySelectorAll('TableRow'));
    return rows.map((row, index) => {
      const cells = Array.from(row.querySelectorAll('TableCell'));
      return {
        index,
        cells: cells.map((c) => c.innerHTML || ''),
        dataClass: row.getAttribute('data-class') || '',
        element: row,
      };
    });
  }

  private parseFooterRows(): ParsedRow[] {
    const footer = this.getSlot('TableFooter');
    if (!footer) return [];
    const rows = Array.from(footer.querySelectorAll('TableRow'));
    return rows.map((row, index) => {
      const cells = Array.from(row.querySelectorAll('TableCell'));
      return {
        index,
        cells: cells.map((c) => c.innerHTML || ''),
        dataClass: row.getAttribute('data-class') || '',
        element: row,
      };
    });
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

  private isRowSelected(index: number): boolean {
    return this.getSelectedIndices().has(index);
  }

  private areAllVisibleSelected(rows: ParsedRow[]): boolean {
    if (rows.length === 0) return false;
    const selected = this.getSelectedIndices();
    return rows.every((r) => selected.has(r.index));
  }

  private areSomeVisibleSelected(rows: ParsedRow[]): boolean {
    if (rows.length === 0) return false;
    const selected = this.getSelectedIndices();
    const count = rows.filter((r) => selected.has(r.index)).length;
    return count > 0 && count < rows.length;
  }

  // ===========================================================================
  // SORTING
  // ===========================================================================

  private getSortedRows(rows: ParsedRow[], columns: ColumnDef[]): ParsedRow[] {
    if (!this.sortKey) return rows;
    const col = columns.find((c) => c.key === this.sortKey);
    if (!col) return rows;
    const colIndex = col.index;
    const dir = this.sortDirection === 'desc' ? -1 : 1;
    return [...rows].sort((a, b) => {
      const aText = this.cellText(a.cells[colIndex] || '');
      const bText = this.cellText(b.cells[colIndex] || '');
      const aNum = parseFloat(aText);
      const bNum = parseFloat(bText);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return (aNum - bNum) * dir;
      }
      return aText.localeCompare(bText, undefined, { sensitivity: 'base' }) * dir;
    });
  }

  private cellText(htmlContent: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = htmlContent;
    return (tmp.textContent || '').trim();
  }

  // ===========================================================================
  // GROUPING
  // ===========================================================================

  private getGroupableColumns(columns: ColumnDef[]): ColumnDef[] {
    return columns.filter((c) => c.groupable);
  }

  private buildGroups(rows: ParsedRow[], columns: ColumnDef[]): RowGroup[] {
    if (!this.groupKey) return [];
    const col = columns.find((c) => c.key === this.groupKey);
    if (!col) return [];
    const colIndex = col.index;
    const map = new Map<string, ParsedRow[]>();
    for (const row of rows) {
      const label = this.cellText(row.cells[colIndex] || '') || '(empty)';
      const existing = map.get(label);
      if (existing) {
        existing.push(row);
      } else {
        map.set(label, [row]);
      }
    }
    return Array.from(map.entries()).map(([label, groupRows]) => ({
      key: label,
      label,
      rows: groupRows,
    }));
  }

  private isGroupExpanded(groupKey: string): boolean {
    // Default to expanded when key is absent
    if (!(groupKey in this.expandedGroups)) return true;
    return this.expandedGroups[groupKey] !== false;
  }

  private toggleGroup(groupKey: string) {
    if (this.disabled) return;
    const next = { ...this.expandedGroups };
    next[groupKey] = !this.isGroupExpanded(groupKey);
    this.expandedGroups = next;
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================

  private handleGroupChange(e: Event) {
    e.stopPropagation();
    if (this.disabled) return;
    const select = e.target as HTMLSelectElement;
    const key = select.value || '';
    this.groupKey = key;
    // Reset expansion state when grouping column changes — all expanded
    this.expandedGroups = {};
    this.dispatchEvent(
      new CustomEvent('groupChange', {
        bubbles: true,
        composed: true,
        detail: { key },
      })
    );
  }

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

  private handleRowCheckbox(e: Event, index: number) {
    e.stopPropagation();
    if (this.disabled) return;
    const checked = (e.target as HTMLInputElement).checked;
    const selected = this.getSelectedIndices();
    if (checked) {
      selected.add(index);
    } else {
      selected.delete(index);
    }
    this.setSelectedIndices(selected);
  }

  private handleSelectAll(e: Event, rows: ParsedRow[]) {
    e.stopPropagation();
    if (this.disabled) return;
    const checked = (e.target as HTMLInputElement).checked;
    const selected = this.getSelectedIndices();
    if (checked) {
      rows.forEach((r) => selected.add(r.index));
    } else {
      rows.forEach((r) => selected.delete(r.index));
    }
    this.setSelectedIndices(selected);
  }

  private handleRowClick(e: Event, index: number) {
    if (this.disabled) return;
    // Ignore clicks originating from checkboxes / interactive controls
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'SELECT' ||
      target.closest('input, button, select, a, label')
    ) {
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

  private handlePageChange(newPage: number) {
    if (this.disabled) return;
    const totalPages = this.getTotalPages();
    if (newPage < 1 || newPage > totalPages) return;
    this.page = newPage;
    this.dispatchEvent(
      new CustomEvent('pageChange', {
        bubbles: true,
        composed: true,
        detail: { page: newPage },
      })
    );
  }

  private handleHeaderKeydown(e: KeyboardEvent, col: ColumnDef) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.handleSort(col);
    }
  }

  private handleGroupHeaderKeydown(e: KeyboardEvent, groupKey: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.toggleGroup(groupKey);
    }
  }

  private handleRowKeydown(e: KeyboardEvent, index: number, rows: ParsedRow[]) {
    if (this.disabled) return;
    if (e.key === ' ' && this.selectable) {
      e.preventDefault();
      const selected = this.getSelectedIndices();
      if (selected.has(index)) {
        selected.delete(index);
      } else {
        selected.add(index);
      }
      this.setSelectedIndices(selected);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent('rowClick', {
          bubbles: true,
          composed: true,
          detail: { index },
        })
      );
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const currentIdx = rows.findIndex((r) => r.index === index);
      const nextIdx = e.key === 'ArrowDown' ? currentIdx + 1 : currentIdx - 1;
      if (nextIdx >= 0 && nextIdx < rows.length) {
        const rowEls = this.querySelectorAll('[data-row-index]');
        const target = Array.from(rowEls).find(
          (el) => el.getAttribute('data-row-index') === String(rows[nextIdx].index)
        ) as HTMLElement | undefined;
        target?.focus();
      }
    }
  }

  // ===========================================================================
  // PAGINATION HELPERS
  // ===========================================================================

  private getTotalPages(): number {
    const size = Number(this.pageSize) || 0;
    if (size <= 0) return 1;
    const total = Number(this.totalItems) || 0;
    if (total <= 0) return 1;
    return Math.max(1, Math.ceil(total / size));
  }

  private getPageNumbers(): number[] {
    const total = this.getTotalPages();
    const current = Number(this.page) || 1;
    const pages: number[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (current > 3) pages.push(-1); // ellipsis marker
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push(-1);
    pages.push(total);
    return pages;
  }

  // ===========================================================================
  // CLASS HELPERS
  // ===========================================================================

  private getRootClasses(): string {
    return cn(
      [
        'flex flex-col w-full',
        'ml-grouping-table',
        this.disabled ? 'ml-disabled' : '',
        this.loading ? 'ml-loading' : '',
        this.error ? 'ml-has-error' : '',
      ]
        .filter(Boolean)
        .join(' '),
      this.cssClass
    );
  }

  private getTableClasses(): string {
    return ['w-full border-collapse', 'ml-table'].filter(Boolean).join(' ');
  }

  private getHeadCellClasses(col: ColumnDef): string {
    return [
      'px-3 py-2 text-left text-sm font-semibold',
      'ml-table-head',
      col.sortable && !this.disabled ? 'cursor-pointer select-none' : '',
      this.sortKey === col.key ? 'ml-table-head-sorted' : '',
      col.dataClass,
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getBodyRowClasses(row: ParsedRow, isSelected: boolean): string {
    return [
      'ml-table-row',
      isSelected ? 'ml-table-row-selected' : '',
      row.dataClass,
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getCellClasses(): string {
    return ['px-3 py-2 text-sm', 'ml-table-cell'].filter(Boolean).join(' ');
  }

  private getGroupHeaderClasses(): string {
    return [
      'px-3 py-2 text-sm font-semibold',
      'ml-group-header',
      this.disabled ? '' : 'cursor-pointer',
    ]
      .filter(Boolean)
      .join(' ');
  }

  // ===========================================================================
  // RENDER HELPERS — icons
  // ===========================================================================

  private renderChevronIcon(expanded: boolean): TemplateResult {
    // Points down when expanded, right when collapsed
    const rotation = expanded ? 'rotate(0deg)' : 'rotate(-90deg)';
    return html`
      <svg
        class="w-4 h-4 shrink-0 transition-transform duration-200 ml-group-chevron"
        style="transform: ${rotation}"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        ${
svg`
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        `}
      </svg>
    `;
  }

  private renderSortIcon(col: ColumnDef): TemplateResult | typeof nothing {
    if (!col.sortable) return nothing;
    const isActive = this.sortKey === col.key;
    const isDesc = isActive && this.sortDirection === 'desc';
    return html`
      <span class="inline-flex flex-col ml-sort-indicator ${isActive ? 'ml-sort-active' : ''}" aria-hidden="true">
        <svg class="w-3 h-3 ${isActive && !isDesc ? 'ml-sort-asc' : ''}" viewBox="0 0 12 12" fill="none">
          ${
svg`
            <path d="M6 3l3 3H3L6 3z" fill="currentColor" opacity="${isActive && !isDesc ? '1' : '0.35'}" />
          `}
        </svg>
        <svg class="w-3 h-3 -mt-0.5 ${isActive && isDesc ? 'ml-sort-desc' : ''}" viewBox="0 0 12 12" fill="none">
          ${
svg`
            <path d="M6 9L3 6h6L6 9z" fill="currentColor" opacity="${isActive && isDesc ? '1' : '0.35'}" />
          `}
        </svg>
      </span>
    `;
  }

  // ===========================================================================
  // RENDER — grouping control
  // ===========================================================================

  private renderGroupControl(columns: ColumnDef[]): TemplateResult {
    const groupable = this.getGroupableColumns(columns);
    if (groupable.length === 0) return html``;

    return html`
      <div class="flex items-center gap-2 px-3 py-2 ml-group-control">
        <label class="text-sm font-semibold ml-label shrink-0" for="ml-group-select">
          ${this.msg.groupBy}
        </label>
        <select
          id="ml-group-select"
          class="text-sm px-2 py-1.5 rounded-md border w-full max-w-xs ml-group-select"
          .value=${this.groupKey}
          ?disabled=${this.disabled || this.loading}
          @change=${this.handleGroupChange}
          @input=${(e: Event) => e.stopPropagation()}
          aria-label=${this.msg.groupBy}
        >
          <option value="">${this.msg.noGrouping}</option>
          ${groupable.map(
            (col) => html`
              <option value=${col.key} ?selected=${this.groupKey === col.key}>
                ${this.cellText(col.label)}
              </option>
            `
          )}
        </select>
      </div>
    `;
  }

  // ===========================================================================
  // RENDER — caption
  // ===========================================================================

  private renderCaption(): TemplateResult {
    if (!this.hasSlot('Caption')) return html``;
    return html`
      <caption class=${cn('text-sm font-semibold text-left px-3 py-2 ml-caption', this.getSlotClass('Caption'))}>
        ${unsafeHTML(this.getSlotContent('Caption'))}
      </caption>
    `;
  }

  // ===========================================================================
  // RENDER — header
  // ===========================================================================

  private renderHeader(columns: ColumnDef[], visibleRows: ParsedRow[]): TemplateResult {
    const allSelected = this.areAllVisibleSelected(visibleRows);
    const someSelected = this.areSomeVisibleSelected(visibleRows);

    return html`
      <thead class="ml-table-thead" role="rowgroup">
        <tr class="ml-table-header-row" role="row">
          ${this.selectable
            ? html`
                <th class="px-3 py-2 w-10 ml-table-head ml-table-checkbox-cell" scope="col" role="columnheader">
                  <input
                    type="checkbox"
                    class="ml-checkbox"
                    .checked=${allSelected}
                    .indeterminate=${someSelected}
                    ?disabled=${this.disabled || this.loading}
                    aria-label=${this.msg.selectAll}
                    @change=${(e: Event) => this.handleSelectAll(e, visibleRows)}
                    @input=${(e: Event) => e.stopPropagation()}
                    @click=${(e: Event) => e.stopPropagation()}
                  />
                </th>
              `
            : nothing}
          ${columns.map((col) => {
            const ariaSort =
              col.sortable && this.sortKey === col.key
                ? this.sortDirection === 'asc'
                  ? 'ascending'
                  : 'descending'
                : col.sortable
                  ? 'none'
                  : nothing;
            return html`
              <th
                class=${this.getHeadCellClasses(col)}
                scope="col"
                role="columnheader"
                aria-sort=${ariaSort}
                tabindex=${col.sortable && !this.disabled ? '0' : nothing}
                @click=${() => this.handleSort(col)}
                @keydown=${(e: KeyboardEvent) => this.handleHeaderKeydown(e, col)}
              >
                <span class="inline-flex items-center gap-1">
                  ${unsafeHTML(col.label)}
                  ${this.renderSortIcon(col)}
                </span>
              </th>
            `;
          })}
        </tr>
      </thead>
    `;
  }

  // ===========================================================================
  // RENDER — body rows
  // ===========================================================================

  private renderDataRow(row: ParsedRow, columns: ColumnDef[], allVisibleRows: ParsedRow[]): TemplateResult {
    const isSelected = this.selectable && this.isRowSelected(row.index);
    return html`
      <tr
        class=${this.getBodyRowClasses(row, isSelected)}
        role="row"
        tabindex="0"
        data-row-index=${row.index}
        aria-selected=${this.selectable ? (isSelected ? 'true' : 'false') : nothing}
        @click=${(e: Event) => this.handleRowClick(e, row.index)}
        @keydown=${(e: KeyboardEvent) => this.handleRowKeydown(e, row.index, allVisibleRows)}
      >
        ${this.selectable
          ? html`
              <td class="px-3 py-2 w-10 ml-table-cell ml-table-checkbox-cell" role="cell">
                <input
                  type="checkbox"
                  class="ml-checkbox"
                  .checked=${isSelected}
                  ?disabled=${this.disabled || this.loading}
                  aria-label=${`${this.msg.selectRow} ${row.index + 1}`}
                  @change=${(e: Event) => this.handleRowCheckbox(e, row.index)}
                  @input=${(e: Event) => e.stopPropagation()}
                  @click=${(e: Event) => e.stopPropagation()}
                />
              </td>
            `
          : nothing}
        ${row.cells.map((cell, i) => {
          // Indent first data cell when grouping is active
          const indentClass = this.groupKey && i === 0 ? 'ml-grouped-cell' : '';
          return html`
            <td class="${this.getCellClasses()} ${indentClass}" role="cell">
              ${unsafeHTML(cell)}
            </td>
          `;
        })}
        ${row.cells.length < columns.length
          ? Array.from({ length: columns.length - row.cells.length }).map(
              () => html`<td class=${this.getCellClasses()} role="cell"></td>`
            )
          : nothing}
      </tr>
    `;
  }

  private renderGroupHeaderRow(group: RowGroup, colSpan: number): TemplateResult {
    const expanded = this.isGroupExpanded(group.key);
    const label = expanded ? this.msg.collapseGroup : this.msg.expandGroup;
    return html`
      <tr
        class="ml-group-header-row"
        role="row"
        aria-expanded=${expanded ? 'true' : 'false'}
      >
        <td
          class=${this.getGroupHeaderClasses()}
          colspan=${colSpan}
          role="cell"
          tabindex="0"
          aria-label=${`${label}: ${group.label}, ${group.rows.length} ${this.msg.rows}`}
          @click=${() => this.toggleGroup(group.key)}
          @keydown=${(e: KeyboardEvent) => this.handleGroupHeaderKeydown(e, group.key)}
        >
          <span class="inline-flex items-center gap-2">
            ${this.renderChevronIcon(expanded)}
            <span class="ml-group-label">${group.label}</span>
            <span class="text-xs font-normal ml-group-count ml-text-muted">
              (${group.rows.length} ${this.msg.rows})
            </span>
          </span>
        </td>
      </tr>
    `;
  }

  private renderBody(
    columns: ColumnDef[],
    rows: ParsedRow[]
  ): TemplateResult {
    if (rows.length === 0) {
      return html`
        <tbody class="ml-table-tbody" role="rowgroup">
          ${this.renderEmptyRow(columns)}
        </tbody>
      `;
    }

    const colSpan = columns.length + (this.selectable ? 1 : 0);

    // Grouped view
    if (this.groupKey) {
      const groups = this.buildGroups(rows, columns);
      return html`
        <tbody class="ml-table-tbody ml-table-tbody-grouped" role="rowgroup">
          ${groups.map((group) => {
            const expanded = this.isGroupExpanded(group.key);
            return html`
              ${this.renderGroupHeaderRow(group, colSpan)}
              ${expanded
                ? group.rows.map((row) => this.renderDataRow(row, columns, rows))
                : nothing}
            `;
          })}
        </tbody>
      `;
    }

    // Flat view
    return html`
      <tbody class="ml-table-tbody" role="rowgroup">
        ${rows.map((row) => this.renderDataRow(row, columns, rows))}
      </tbody>
    `;
  }

  private renderEmptyRow(columns: ColumnDef[]): TemplateResult {
    const colSpan = columns.length + (this.selectable ? 1 : 0);
    const content = this.hasSlot('Empty')
      ? this.getSlotContent('Empty')
      : this.msg.empty;
    return html`
      <tr class="ml-table-empty-row" role="row">
        <td
          class=${cn(
            'px-3 py-8 text-sm text-center ml-table-empty',
            this.hasSlot('Empty') ? this.getSlotClass('Empty') : ''
          )}
          colspan=${colSpan}
          role="cell"
        >
          ${unsafeHTML(content)}
        </td>
      </tr>
    `;
  }

  // ===========================================================================
  // RENDER — footer
  // ===========================================================================

  private renderFooter(columns: ColumnDef[]): TemplateResult {
    const footerRows = this.parseFooterRows();
    if (footerRows.length === 0) return html``;

    return html`
      <tfoot class="ml-table-tfoot" role="rowgroup">
        ${footerRows.map(
          (row) => html`
            <tr class="ml-table-footer-row ${row.dataClass}" role="row">
              ${this.selectable
                ? html`<td class="px-3 py-2 ml-table-cell" role="cell"></td>`
                : nothing}
              ${row.cells.map(
                (cell) => html`
                  <td class="${this.getCellClasses()} ml-table-footer-cell" role="cell">
                    ${unsafeHTML(cell)}
                  </td>
                `
              )}
              ${row.cells.length < columns.length
                ? Array.from({ length: columns.length - row.cells.length }).map(
                    () => html`<td class=${this.getCellClasses()} role="cell"></td>`
                  )
                : nothing}
            </tr>
          `
        )}
      </tfoot>
    `;
  }

  // ===========================================================================
  // RENDER — loading
  // ===========================================================================

  private renderLoading(columns: ColumnDef[]): TemplateResult {
    if (this.hasSlot('Loading')) {
      return html`
        <div class=${cn('w-full p-4 ml-loading-slot', this.getSlotClass('Loading'))}>
          ${unsafeHTML(this.getSlotContent('Loading'))}
        </div>
      `;
    }

    // Default skeleton rows
    const colCount = Math.max(columns.length, 3);
    const skeletonRows = [1, 2, 3, 4];
    return html`
      <div class="w-full overflow-x-auto" role="status" aria-label=${this.msg.loading}>
        <table class=${this.getTableClasses()}>
          <thead class="ml-table-thead">
            <tr>
              ${this.selectable
                ? html`<th class="px-3 py-2 w-10"><div class="h-4 w-4 rounded ml-skeleton"></div></th>`
                : nothing}
              ${Array.from({ length: colCount }).map(
                () => html`
                  <th class="px-3 py-2">
                    <div class="h-4 w-24 rounded ml-skeleton"></div>
                  </th>
                `
              )}
            </tr>
          </thead>
          <tbody>
            ${skeletonRows.map(
              () => html`
                <tr>
                  ${this.selectable
                    ? html`<td class="px-3 py-3"><div class="h-4 w-4 rounded ml-skeleton"></div></td>`
                    : nothing}
                  ${Array.from({ length: colCount }).map(
                    () => html`
                      <td class="px-3 py-3">
                        <div class="h-4 w-full max-w-[8rem] rounded ml-skeleton"></div>
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

  // ===========================================================================
  // RENDER — pagination
  // ===========================================================================

  private renderPagination(): TemplateResult {
    const size = Number(this.pageSize) || 0;
    if (size <= 0) return html``;

    const totalPages = this.getTotalPages();
    const current = Number(this.page) || 1;
    const pages = this.getPageNumbers();

    return html`
      <nav
        class="flex items-center justify-between gap-2 px-3 py-2 ml-pagination"
        role="navigation"
        aria-label="Table pagination"
      >
        <span class="text-xs ml-text-muted">
          ${this.msg.page} ${current} ${this.msg.of} ${totalPages}
        </span>
        <div class="flex items-center gap-1">
          <button
            type="button"
            class="px-2 py-1 text-sm rounded-md border ml-pagination-btn"
            ?disabled=${this.disabled || current <= 1}
            aria-label=${this.msg.previousPage}
            @click=${() => this.handlePageChange(current - 1)}
          >
            ‹
          </button>
          ${pages.map((p) =>
            p === -1
              ? html`<span class="px-1 text-sm ml-text-faint" aria-hidden="true">…</span>`
              : html`
                  <button
                    type="button"
                    class="px-2.5 py-1 text-sm rounded-md border ml-pagination-btn ${p === current ? 'ml-pagination-btn-active' : ''}"
                    ?disabled=${this.disabled}
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
            class="px-2 py-1 text-sm rounded-md border ml-pagination-btn"
            ?disabled=${this.disabled || current >= totalPages}
            aria-label=${this.msg.nextPage}
            @click=${() => this.handlePageChange(current + 1)}
          >
            ›
          </button>
        </div>
      </nav>
    `;
  }

  // ===========================================================================
  // RENDER — error
  // ===========================================================================

  private renderError(): TemplateResult {
    const err = String(this.error ?? '').trim();
    if (!err) return html``;
    return html`
      <p class="mt-1 px-3 text-xs ml-error-text" role="alert">${unsafeHTML(err)}</p>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================

  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang] || messages.en;

    const columns = this.parseColumns();
    let rows = this.parseRows();

    // Apply internal sort
    rows = this.getSortedRows(rows, columns);

    return html`
      <div class=${this.getRootClasses()}>
        <!-- Grouping control — strongest visual weight at top -->
        ${this.renderGroupControl(columns)}

        ${this.loading
          ? this.renderLoading(columns)
          : html`
              <div class="w-full overflow-x-auto ml-table-wrapper">
                <table
                  class=${this.getTableClasses()}
                  role="table"
                  aria-disabled=${this.disabled ? 'true' : nothing}
                >
                  ${this.renderCaption()}
                  ${this.renderHeader(columns, rows)}
                  ${this.renderBody(columns, rows)}
                  ${this.renderFooter(columns)}
                </table>
              </div>
            `}

        ${this.renderPagination()}
        ${this.renderError()}
      </div>
    `;
  }
}
