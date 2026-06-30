/// <mls fileReference="_102040_/l2/molecules/groupviewdata/ml-kanban-board.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// KANBAN BOARD MOLECULE
// =============================================================================
// Skill Group: groupViewData
// This molecule does NOT contain business logic.

import { html, TemplateResult } from'lit';
import { ifDefined } from'lit/directives/if-defined.js';
import { customElement, property, state } from'lit/decorators.js';
import { unsafeHTML } from'lit/directives/unsafe-html.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
 loading:'Loading...',
 empty:'No items to display',
 addCard:'Add card',
 dropHere:'Drop here',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
 en: message_en,
 pt: {
 loading:'Carregando...',
 empty:'Nenhum item para exibir',
 addCard:'Adicionar cartão',
 dropHere:'Solte aqui',
 },
};
/// **collab_i18n_end**

interface ParsedColumn {
 field: string;
 header: string;
 width: string;
 align:'left' |'center' |'right';
 hidden: boolean;
 content: string;
}

interface ParsedRow {
 element: Element;
 index: number;
 selected: boolean;
 disabled: boolean;
 cells: ParsedCell[];
}

interface ParsedCell {
 element: Element;
 content: string;
 colspan: number;
 isAddAction: boolean;
}

@customElement('groupviewdata--ml-kanban-board')
export class MlKanbanBoardMolecule extends MoleculeAuraElement {
 private msg: MessageType = messages.en;

 // ===========================================================================
 // SLOT TAGS
 // ===========================================================================
 slotTags = ['Columns','Column','Rows','Row','Cell','Empty','Loading'];

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
 private selectedIndices: number[] = [];

 @state()
 private draggedCard: { rowIndex: number; cellIndex: number; element: Element } | null = null;

 @state()
 private dropTargetRowIndex: number | null = null;

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
 .map((col) => {
 const field = col.getAttribute('field') ||'';
 const header = col.getAttribute('header') ||'';
 const width = col.getAttribute('width') ||'auto';
 const alignAttr = col.getAttribute('align');
 const align:'left' |'center' |'right' =
 alignAttr ==='center' || alignAttr ==='right' ? alignAttr :'left';
 const hidden = col.hasAttribute('hidden');
 const content = col.innerHTML.trim();

 return { field, header, width, align, hidden, content };
 })
 .filter((col) => !col.hidden);
 }

 private parseRows(): ParsedRow[] {
 const rowsSlot = this.getSlot('Rows');
 if (!rowsSlot) return [];

 const rowElements = Array.from(rowsSlot.querySelectorAll('Row'));
 return rowElements.map((row, index) => {
 const selected = row.hasAttribute('selected');
 const disabled = row.hasAttribute('disabled');
 const cellElements = Array.from(row.querySelectorAll('Cell'));

 const cells: ParsedCell[] = cellElements.map((cell) => {
 const colspanAttr = cell.getAttribute('colspan');
 const colspan = colspanAttr ? parseInt(colspanAttr, 10) : 1;
 const isAddAction = cell.hasAttribute('add-action');
 const content = cell.innerHTML.trim();

 return { element: cell, content, colspan, isAddAction };
 });

 return { element: row, index, selected, disabled, cells };
 });
 }

 // ===========================================================================
 // EVENT HANDLERS
 // ===========================================================================
 private handleRowClick(rowIndex: number, cellElement: Element) {
 const row = this.parsedRows[rowIndex];
 if (!row || row.disabled) return;

 if (this.selectable) {
 this.toggleSelection(rowIndex);
 }

 this.dispatchEvent(
 new CustomEvent('row-click', {
 bubbles: true,
 composed: true,
 detail: { index: rowIndex, data: cellElement },
 })
 );
 }

 private toggleSelection(rowIndex: number) {
 const idx = this.selectedIndices.indexOf(rowIndex);
 if (idx === -1) {
 this.selectedIndices = [...this.selectedIndices, rowIndex];
 } else {
 this.selectedIndices = this.selectedIndices.filter((i) => i !== rowIndex);
 }

 this.dispatchEvent(
 new CustomEvent('selection-change', {
 bubbles: true,
 composed: true,
 detail: { selected: this.selectedIndices },
 })
 );
 }

 private handleDragStart(e: DragEvent, rowIndex: number, cellIndex: number, cell: ParsedCell) {
 if (cell.isAddAction) {
 e.preventDefault();
 return;
 }

 const row = this.parsedRows[rowIndex];
 if (row.disabled) {
 e.preventDefault();
 return;
 }

 this.draggedCard = { rowIndex, cellIndex, element: cell.element };

 if (e.dataTransfer) {
 e.dataTransfer.effectAllowed ='move';
 e.dataTransfer.setData('text/plain', `${rowIndex}-${cellIndex}`);
 }
 }

 private handleDragOver(e: DragEvent, rowIndex: number) {
 const row = this.parsedRows[rowIndex];
 if (row.disabled || !this.draggedCard) {
 return;
 }

 e.preventDefault();
 if (e.dataTransfer) {
 e.dataTransfer.dropEffect ='move';
 }
 this.dropTargetRowIndex = rowIndex;
 }

 private handleDragLeave() {
 this.dropTargetRowIndex = null;
 }

 private handleDrop(e: DragEvent, rowIndex: number) {
 e.preventDefault();
 this.dropTargetRowIndex = null;

 const row = this.parsedRows[rowIndex];
 if (row.disabled || !this.draggedCard) {
 this.draggedCard = null;
 return;
 }

 if (this.draggedCard.rowIndex !== rowIndex) {
 this.dispatchEvent(
 new CustomEvent('row-click', {
 bubbles: true,
 composed: true,
 detail: { index: rowIndex, data: this.draggedCard.element },
 })
 );
 }

 this.draggedCard = null;
 }

 private handleDragEnd() {
 this.draggedCard = null;
 this.dropTargetRowIndex = null;
 }

 private handleAddCardClick(rowIndex: number, cell: ParsedCell) {
 const row = this.parsedRows[rowIndex];
 if (row.disabled) return;

 this.dispatchEvent(
 new CustomEvent('row-click', {
 bubbles: true,
 composed: true,
 detail: { index: rowIndex, data: cell.element },
 })
 );
 }

 // ===========================================================================
 // RENDER HELPERS
 // ===========================================================================
 private getColumnHeaderClasses(): string {
 return [
'flex-shrink-0 p-3 rounded-t-lg',
'ml-surface-dim-bg',
'border-b ml-border',
 ].join(' ');
 }

 private getColumnClasses(isDropTarget: boolean): string {
 return [
'flex flex-col flex-shrink-0 w-72 min-h-96',
'ml-surface-dim-bg',
'border ml-border',
'rounded-lg',
 isDropTarget ?'ml-focus-ring' :'',
 ]
 .filter(Boolean)
 .join(' ');
 }

 private getCardClasses(row: ParsedRow, isDragging: boolean): string {
 const isSelected = this.selectedIndices.includes(row.index) || row.selected;

 return [
'p-3 rounded-lg border transition-all cursor-grab',
'ml-surface-bg',
 isSelected
 ?'ml-border-focus ml-primary-dim-bg'
 :'ml-border',
 row.disabled ?'ml-disabled' :'',
 !row.disabled && this.hoverable ?'hover:shadow-md hover:ml-border' :'',
 isDragging ?'opacity-50 scale-95' :'',
 ]
 .filter(Boolean)
 .join(' ');
 }

 private getAddCardClasses(disabled: boolean): string {
 return [
'flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed transition-all cursor-pointer',
'ml-border',
'ml-text-muted',
 disabled ?'ml-disabled' :'hover:ml-border-focus hover:ml-primary-text',
 ]
 .filter(Boolean)
 .join(' ');
 }

 private getDropZoneClasses(): string {
 return [
'flex items-center justify-center p-4 rounded-lg border-2 border-dashed',
'ml-border-focus',
'ml-primary-dim-bg',
'ml-primary-text',
'text-sm font-medium',
 ].join(' ');
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

 if (this.parsedRows.length === 0) {
 return this.renderEmpty();
 }

 return this.renderBoard();
 }

 private renderLoading(): TemplateResult {
 const loadingContent = this.getSlotContent('Loading');
 const content = loadingContent || this.msg.loading;

 return html`
 <div
 class="${cn('flex items-center justify-center min-h-96 ml-surface-dim-bg rounded-lg border ml-border', this.cssClass)}"
 aria-busy="true"
 >
 <div class="flex flex-col items-center gap-3 ml-text-muted">
 <div class="w-8 h-8 border-4 ml-border ml-spinner-border rounded-full animate-spin"></div>
 <span class="text-sm">${unsafeHTML(content)}</span>
 </div>
 </div>
 `;
 }

 private renderEmpty(): TemplateResult {
 const emptyContent = this.getSlotContent('Empty');
 const content = emptyContent || this.msg.empty;

 return html`
 <div
 class="${cn('flex items-center justify-center min-h-96 ml-surface-dim-bg rounded-lg border ml-border', this.cssClass)}"
 >
 <div class="ml-text-muted text-sm">
 ${unsafeHTML(content)}
 </div>
 </div>
 `;
 }

 private renderBoard(): TemplateResult {
 return html`
 <div class="${cn('flex gap-4 overflow-x-auto p-4 ml-surface-dim-bg rounded-lg min-h-96', this.cssClass)}">
 ${this.parsedColumns.map((column, colIndex) => this.renderColumn(column, colIndex))}
 </div>
 `;
 }

 private renderColumn(column: ParsedColumn, colIndex: number): TemplateResult {
 const row = this.parsedRows[colIndex];
 const isDropTarget = this.dropTargetRowIndex === colIndex;
 const columnClasses = this.getColumnClasses(isDropTarget);

 const isSelected = this.selectedIndices.includes(colIndex) || !!row?.selected;

 return html`
 <div
 class=${columnClasses}
 style="width: ${column.width !=='auto' ? column.width :'18rem'}"
 @dragover=${(e: DragEvent) => this.handleDragOver(e, colIndex)}
 @dragleave=${this.handleDragLeave}
 @drop=${(e: DragEvent) => this.handleDrop(e, colIndex)}
 aria-disabled=${ifDefined(row?.disabled ?'true' : undefined)}
 aria-selected=${ifDefined(isSelected ?'true' : undefined)}
 >
 ${this.renderColumnHeader(column)}
 ${this.renderColumnContent(row, colIndex, isDropTarget)}
 </div>
 `;
 }

 private renderColumnHeader(column: ParsedColumn): TemplateResult {
 const headerClasses = this.getColumnHeaderClasses();

 return html`
 <div class=${headerClasses}>
 <div class="flex items-center justify-between">
 <h3 class="font-semibold ml-text text-sm">
 ${column.header}
 </h3>
 ${column.content
 ? html`<div class="text-xs ml-text-muted">${unsafeHTML(column.content)}</div>`
 : html``}
 </div>
 </div>
 `;
 }

 private renderColumnContent(row: ParsedRow | undefined, colIndex: number, isDropTarget: boolean): TemplateResult {
 if (!row) {
 return html`
 <div class="flex-1 p-3">
 <div class="ml-text-faint text-sm text-center py-4">
 ${this.msg.empty}
 </div>
 </div>
 `;
 }

 const cards = row.cells.filter((cell) => !cell.isAddAction);
 const addActionCell = row.cells.find((cell) => cell.isAddAction);

 return html`
 <div class="flex-1 flex flex-col gap-2 p-3 overflow-y-auto">
 ${isDropTarget && this.draggedCard
 ? html`<div class=${this.getDropZoneClasses()}>${this.msg.dropHere}</div>`
 : html``}
 ${cards.map((cell, cellIndex) => this.renderCard(row, cell, colIndex, cellIndex))}
 ${addActionCell ? this.renderAddCard(row, addActionCell, colIndex) : html``}
 </div>
 `;
 }

 private renderCard(row: ParsedRow, cell: ParsedCell, rowIndex: number, cellIndex: number): TemplateResult {
 const isDragging =
 this.draggedCard?.rowIndex === rowIndex && this.draggedCard?.cellIndex === cellIndex;
 const cardClasses = this.getCardClasses(row, isDragging);

 return html`
 <div
 class=${cardClasses}
 draggable=${row.disabled ?'false' :'true'}
 @dragstart=${(e: DragEvent) => this.handleDragStart(e, rowIndex, cellIndex, cell)}
 @dragend=${this.handleDragEnd}
 @click=${() => this.handleRowClick(rowIndex, cell.element)}
 >
 <div class="ml-text text-sm">
 ${unsafeHTML(cell.content)}
 </div>
 </div>
 `;
 }

 private renderAddCard(row: ParsedRow, cell: ParsedCell, rowIndex: number): TemplateResult {
 const addCardClasses = this.getAddCardClasses(row.disabled);

 return html`
 <div
 class=${addCardClasses}
 @click=${() => this.handleAddCardClick(rowIndex, cell)}
 >
 <svg
 class="w-4 h-4"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 xmlns="http://www.w3.org/2000/svg"
 >
 <path
 stroke-linecap="round"
 stroke-linejoin="round"
 stroke-width="2"
 d="M12 4v16m8-8H4"
 ></path>
 </svg>
 <span class="text-sm font-medium">
 ${cell.content ? unsafeHTML(cell.content) : this.msg.addCard}
 </span>
 </div>
 `;
 }
}
