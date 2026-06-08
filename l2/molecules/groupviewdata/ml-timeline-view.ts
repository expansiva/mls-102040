/// <mls fileReference="_102040_/l2/molecules/groupviewdata/ml-timeline-view.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// TIMELINE VIEW MOLECULE
// =============================================================================
// Skill Group: groupViewData
// This molecule does NOT contain business logic.

import { html, svg, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  loading: 'Loading...',
  empty: 'No events to display',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    loading: 'Carregando...',
    empty: 'Nenhum evento para exibir',
  },
};
/// **collab_i18n_end**

interface ParsedColumn {
  field: string;
  header: string;
  width: string;
  align: 'left' | 'center' | 'right';
  hidden: boolean;
}

interface ParsedRow {
  index: number;
  element: Element;
  selected: boolean;
  disabled: boolean;
  isGroupHeader: boolean;
  cells: ParsedCell[];
}

interface ParsedCell {
  content: string;
  colspan: number;
}

@customElement('groupviewdata--ml-timeline-view')
export class TimelineViewMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Columns', 'Column', 'Rows', 'Row', 'Cell', 'Empty', 'Loading'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: Boolean })
  loading = false;

  @propertyDataSource({ type: Boolean })
  selectable = false;

  @propertyDataSource({ type: Boolean })
  hoverable = true;

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private selectedIndices: Set<number> = new Set();

  @state()
  private parsedColumns: ParsedColumn[] = [];

  @state()
  private parsedRows: ParsedRow[] = [];

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  firstUpdated() {
    this.parseSlotContent();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('loading')) {
      this.parseSlotContent();
    }
  }

  // ===========================================================================
  // PARSING
  // ===========================================================================
  private parseSlotContent() {
    this.parsedColumns = this.parseColumns();
    this.parsedRows = this.parseRows();
  }

  private parseColumns(): ParsedColumn[] {
    const columnsSlot = this.getSlot('Columns');
    if (!columnsSlot) return [];

    const columnElements = Array.from(columnsSlot.querySelectorAll('Column'));
    return columnElements
      .map((col) => ({
        field: col.getAttribute('field') || '',
        header: col.getAttribute('header') || '',
        width: col.getAttribute('width') || 'auto',
        align: (col.getAttribute('align') as 'left' | 'center' | 'right') || 'left',
        hidden: col.hasAttribute('hidden'),
      }))
      .filter((col) => !col.hidden && col.field && col.header);
  }

  private parseRows(): ParsedRow[] {
    const rowsSlot = this.getSlot('Rows');
    if (!rowsSlot) return [];

    const rowElements = Array.from(rowsSlot.querySelectorAll('Row'));
    return rowElements.map((row, index) => {
      const cells = Array.from(row.querySelectorAll('Cell')).map((cell) => ({
        content: cell.innerHTML,
        colspan: parseInt(cell.getAttribute('colspan') || '1', 10),
      }));

      const isGroupHeader = row.hasAttribute('group-header') || cells.some((c) => c.colspan > 1);

      return {
        index,
        element: row,
        selected: row.hasAttribute('selected') || this.selectedIndices.has(index),
        disabled: row.hasAttribute('disabled'),
        isGroupHeader,
        cells,
      };
    });
  }

  // ===========================================================================
  // COMPUTED
  // ===========================================================================
  private get visibleColumns(): ParsedColumn[] {
    return this.parsedColumns;
  }

  private get isHorizontalLayout(): boolean {
    const eventRows = this.parsedRows.filter((r) => !r.isGroupHeader);
    return this.visibleColumns.length === 1 && eventRows.length > 1;
  }

  private get isEmpty(): boolean {
    return this.parsedRows.length === 0;
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleRowClick(row: ParsedRow) {
    if (row.disabled || row.isGroupHeader) return;

    this.dispatchEvent(
      new CustomEvent('row-click', {
        bubbles: true,
        composed: true,
        detail: { index: row.index, data: row.element },
      })
    );

    if (this.selectable) {
      const newSelected = new Set(this.selectedIndices);
      if (newSelected.has(row.index)) {
        newSelected.delete(row.index);
      } else {
        newSelected.add(row.index);
      }
      this.selectedIndices = newSelected;

      this.dispatchEvent(
        new CustomEvent('selection-change', {
          bubbles: true,
          composed: true,
          detail: { selected: Array.from(newSelected) },
        })
      );
    }
  }

  // ===========================================================================
  // STYLES
  // ===========================================================================
  private getContainerClasses(): string {
    return [
      'relative w-full',
      this.isHorizontalLayout ? 'overflow-x-auto' : '',
    ].filter(Boolean).join(' ');
  }

  private getTimelineWrapperClasses(): string {
    return [
      'relative',
      this.isHorizontalLayout
        ? 'flex flex-row items-start gap-8 pb-4 min-w-max px-4'
        : 'flex flex-col gap-0 pl-4',
    ].filter(Boolean).join(' ');
  }

  private getRowClasses(row: ParsedRow): string {
    if (row.isGroupHeader) {
      return [
        'relative z-10 py-3 px-4 my-2',
        'bg-slate-100 dark:bg-slate-700',
        'text-slate-700 dark:text-slate-200',
        'font-semibold text-sm rounded-lg',
        this.isHorizontalLayout ? 'min-w-[120px]' : 'ml-6',
      ].filter(Boolean).join(' ');
    }

    const isSelected = row.selected || this.selectedIndices.has(row.index);

    return [
      'relative z-10 transition-all duration-200',
      this.isHorizontalLayout
        ? 'flex flex-col items-center min-w-[140px]'
        : 'flex flex-row items-start gap-4 py-3',
      isSelected
        ? 'bg-sky-50 dark:bg-sky-900/40 border-sky-500 dark:border-sky-400'
        : 'bg-white dark:bg-slate-800',
      !row.disabled && this.hoverable && !isSelected
        ? 'hover:bg-slate-50 dark:hover:bg-slate-700'
        : '',
      row.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      this.selectable && !row.disabled ? 'select-none' : '',
      this.isHorizontalLayout ? '' : 'rounded-lg border border-slate-200 dark:border-slate-700 p-3 ml-6',
      isSelected && !this.isHorizontalLayout ? 'border-sky-500 dark:border-sky-400' : '',
    ].filter(Boolean).join(' ');
  }

  private getMarkerClasses(row: ParsedRow): string {
    const isSelected = row.selected || this.selectedIndices.has(row.index);

    return [
      'flex-shrink-0 w-4 h-4 rounded-full border-2 z-20',
      'transition-all duration-200',
      isSelected
        ? 'bg-sky-500 dark:bg-sky-400 border-sky-600 dark:border-sky-300'
        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600',
      row.disabled ? 'opacity-50' : '',
      this.isHorizontalLayout ? 'mb-3' : 'absolute -left-6 top-4',
    ].filter(Boolean).join(' ');
  }

  private getCellClasses(column: ParsedColumn): string {
    const alignClass = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }[column.align];

    return [
      'text-sm text-slate-900 dark:text-slate-100',
      alignClass,
      this.isHorizontalLayout ? 'w-full' : '',
    ].filter(Boolean).join(' ');
  }

  private getTrackClasses(): string {
    return [
      'absolute bg-slate-200 dark:bg-slate-600',
      this.isHorizontalLayout
        ? 'h-0.5 top-2 left-0 right-0'
        : 'w-0.5 left-2 top-0 bottom-0',
    ].filter(Boolean).join(' ');
  }

  // ===========================================================================
  // RENDER METHODS
  // ===========================================================================
  private renderLoading(): TemplateResult {
    const loadingSlot = this.getSlot('Loading');
    const content = loadingSlot ? loadingSlot.innerHTML : this.msg.loading;

    return html`
      <div
        class="flex items-center justify-center py-12 text-slate-500 dark:text-slate-400"
        aria-busy="true"
      >
        <div class="flex flex-col items-center gap-3">
          <div class="w-8 h-8 border-2 border-slate-300 dark:border-slate-600 border-t-sky-500 dark:border-t-sky-400 rounded-full animate-spin"></div>
          <span class="text-sm">${unsafeHTML(content)}</span>
        </div>
      </div>
    `;
  }

  private renderEmpty(): TemplateResult {
    const emptySlot = this.getSlot('Empty');
    const content = emptySlot ? emptySlot.innerHTML : this.msg.empty;

    return html`
      <div class="flex items-center justify-center py-12 text-slate-500 dark:text-slate-400">
        <div class="text-center">
          <div class="mb-2">
            ${this.renderEmptyIcon()}
          </div>
          <span class="text-sm">${unsafeHTML(content)}</span>
        </div>
      </div>
    `;
  }

  private renderEmptyIcon(): TemplateResult {
    return html`
      <svg class="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        ${svg`
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        `}
      </svg>
    `;
  }

  private renderGroupHeader(row: ParsedRow): TemplateResult {
    const content = row.cells[0]?.content || '';

    return html`
      <div class=${this.getRowClasses(row)}>
        ${unsafeHTML(content)}
      </div>
    `;
  }

  private renderEventRow(row: ParsedRow): TemplateResult {
    const isSelected = row.selected || this.selectedIndices.has(row.index);

    return html`
      <div
        class=${this.getRowClasses(row)}
        role="listitem"
        aria-selected=${this.selectable ? String(isSelected) : 'false'}
        aria-disabled=${String(row.disabled)}
        @click=${() => this.handleRowClick(row)}
      >
        ${this.isHorizontalLayout
          ? this.renderHorizontalEvent(row)
          : this.renderVerticalEvent(row)}
      </div>
    `;
  }

  private renderVerticalEvent(row: ParsedRow): TemplateResult {
    return html`
      <div class=${this.getMarkerClasses(row)}></div>
      <div class="flex-1 min-w-0">
        ${this.renderEventContent(row)}
      </div>
    `;
  }

  private renderHorizontalEvent(row: ParsedRow): TemplateResult {
    return html`
      <div class=${this.getMarkerClasses(row)}></div>
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-sm w-full">
        ${this.renderEventContent(row)}
      </div>
    `;
  }

  private renderEventContent(row: ParsedRow): TemplateResult {
    return html`
      <div class="flex flex-col gap-1">
        ${this.visibleColumns.map((column, colIndex) => {
          const cell = row.cells[colIndex];
          if (!cell) return html``;

          return html`
            <div class=${this.getCellClasses(column)} style="width: ${column.width}">
              ${unsafeHTML(cell.content)}
            </div>
          `;
        })}
      </div>
    `;
  }

  private renderTimeline(): TemplateResult {
    const eventRows = this.parsedRows.filter((r) => !r.isGroupHeader);
    const groupHeaders = this.parsedRows.filter((r) => r.isGroupHeader);

    return html`
      <div class=${this.getContainerClasses()} role="list">
        <div class=${this.getTimelineWrapperClasses()}>
          <!-- Timeline Track -->
          <div class=${this.getTrackClasses()}></div>

          <!-- Events -->
          ${this.parsedRows.map((row) =>
            row.isGroupHeader
              ? this.renderGroupHeader(row)
              : this.renderEventRow(row)
          )}
        </div>
      </div>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    this.parseSlotContent();

    if (this.loading) {
      return this.renderLoading();
    }

    if (this.isEmpty) {
      return this.renderEmpty();
    }

    return this.renderTimeline();
  }
}
