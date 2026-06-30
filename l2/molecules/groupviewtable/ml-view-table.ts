/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-view-table.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// VIEW TABLE MOLECULE
// =============================================================================
// Skill Group: groupViewTable
// This molecule does NOT contain business logic.

import { html, svg, TemplateResult } from'lit';
import { customElement, property, state } from'lit/decorators.js';
import { unsafeHTML } from'lit/directives/unsafe-html.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
 selectAll:'Select all rows',
 selectRow:'Select row',
 noData:'No data available',
 loading:'Loading...',
 pagination:'Table pagination',
 previous:'Previous page',
 next:'Next page',
 page:'Page',
 of:'of',
 sortAscending:'Sort ascending',
 sortDescending:'Sort descending',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
 en: message_en,
 pt: {
 selectAll:'Selecionar todas as linhas',
 selectRow:'Selecionar linha',
 noData:'Nenhum dado disponível',
 loading:'Carregando...',
 pagination:'Paginação da tabela',
 previous:'Página anterior',
 next:'Próxima página',
 page:'Página',
 of:'de',
 sortAscending:'Ordenar crescente',
 sortDescending:'Ordenar decrescente',
 },
};
/// **collab_i18n_end**

interface ParsedHeader {
 key: string;
 sortable: boolean;
 content: string;
}

interface ParsedRow {
 cells: string[];
 element: Element;
}

@customElement('groupviewtable--ml-view-table')
export class ViewTableMolecule extends MoleculeAuraElement {
 private msg: MessageType = messages.en;

 // ===========================================================================
 // SLOT TAGS
 // ===========================================================================
 slotTags = ['Caption','TableHeader','TableBody','TableRow','TableHead','TableCell','TableFooter','Empty','Loading'];

 // ===========================================================================
 // PROPERTIES — From Contract
 // ===========================================================================
 @propertyDataSource({ type: Boolean })
 selectable: boolean = false;

 @propertyDataSource({ type: Boolean, attribute:'is-editing' })
 isEditing: boolean = false;

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
 private parsedHeaders: ParsedHeader[] = [];

 @state()
 private parsedRows: ParsedRow[] = [];

 @state()
 private sortedRowIndices: number[] = [];

 // ===========================================================================
 // LIFECYCLE
 // ===========================================================================
 firstUpdated() {
 this.parseSlotContent();
 this.propagateEditingState();
 }

 updated(changedProperties: Map<string, unknown>) {
 if (changedProperties.has('isEditing')) {
 this.propagateEditingState();
 }
 }

 // ===========================================================================
 // PARSING
 // ===========================================================================
 private parseSlotContent() {
 this.parseHeaders();
 this.parseRows();
 this.initializeSortedIndices();
 }

 private parseHeaders() {
 const headerSlot = this.getSlot('TableHeader');
 if (!headerSlot) {
 this.parsedHeaders = [];
 return;
 }

 const headerRow = headerSlot.querySelector('TableRow');
 if (!headerRow) {
 this.parsedHeaders = [];
 return;
 }

 const heads = headerRow.querySelectorAll('TableHead');
 this.parsedHeaders = Array.from(heads).map((head) => ({
 key: head.getAttribute('key') ||'',
 sortable: head.hasAttribute('sortable'),
 content: head.innerHTML.trim(),
 }));
 }

 private parseRows() {
 const bodySlot = this.getSlot('TableBody');
 if (!bodySlot) {
 this.parsedRows = [];
 return;
 }

 const rows = bodySlot.querySelectorAll('TableRow');
 this.parsedRows = Array.from(rows).map((row) => {
 const cells = row.querySelectorAll('TableCell');
 return {
 cells: Array.from(cells).map((cell) => cell.innerHTML.trim()),
 element: row,
 };
 });
 }

 private initializeSortedIndices() {
 this.sortedRowIndices = this.parsedRows.map((_, index) => index);
 }

 // ===========================================================================
 // EDITING PROPAGATION
 // ===========================================================================
 private propagateEditingState() {
 const bodySlot = this.getSlot('TableBody');
 if (!bodySlot) return;

 const cells = bodySlot.querySelectorAll('TableCell');
 cells.forEach((cell) => {
 const children = cell.querySelectorAll('*');
 children.forEach((child) => {
 if (child.tagName.includes('-')) {
 child.setAttribute('is-editing', String(this.isEditing));
 }
 });
 });
 }

 // ===========================================================================
 // SELECTION
 // ===========================================================================
 private getSelectedIndices(): Set<number> {
 if (!this.value || this.value.trim() ==='') {
 return new Set();
 }
 return new Set(
 this.value
 .split(',')
 .map((s) => parseInt(s.trim(), 10))
 .filter((n) => !isNaN(n))
 );
 }

 private setSelectedIndices(indices: Set<number>) {
 const newValue = Array.from(indices).sort((a, b) => a - b).join(',');
 this.value = newValue;
 this.dispatchEvent(
 new CustomEvent('change', {
 bubbles: true,
 composed: true,
 detail: { value: newValue },
 })
 );
 }

 private handleSelectAll() {
 if (this.disabled) return;

 const selected = this.getSelectedIndices();
 const allSelected = this.parsedRows.length > 0 && selected.size === this.parsedRows.length;

 if (allSelected) {
 this.setSelectedIndices(new Set());
 } else {
 this.setSelectedIndices(new Set(this.parsedRows.map((_, i) => i)));
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

 private handleRowClick(index: number) {
 if (this.disabled) return;

 this.dispatchEvent(
 new CustomEvent('rowClick', {
 bubbles: true,
 composed: true,
 detail: { index },
 })
 );
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

 this.applySorting();

 this.dispatchEvent(
 new CustomEvent('sort', {
 bubbles: true,
 composed: true,
 detail: { key: this.sortKey, direction: this.sortDirection },
 })
 );
 }

 private applySorting() {
 if (!this.sortKey) {
 this.initializeSortedIndices();
 return;
 }

 const columnIndex = this.parsedHeaders.findIndex((h) => h.key === this.sortKey);
 if (columnIndex === -1) {
 this.initializeSortedIndices();
 return;
 }

 const indices = this.parsedRows.map((_, i) => i);
 indices.sort((a, b) => {
 const cellA = this.parsedRows[a]?.cells[columnIndex] ||'';
 const cellB = this.parsedRows[b]?.cells[columnIndex] ||'';

 const textA = this.stripHtml(cellA).toLowerCase();
 const textB = this.stripHtml(cellB).toLowerCase();

 let comparison = textA.localeCompare(textB, undefined, { numeric: true });
 return this.sortDirection ==='desc' ? -comparison : comparison;
 });

 this.sortedRowIndices = indices;
 }

 private stripHtml(html: string): string {
 const div = document.createElement('div');
 div.innerHTML = html;
 return div.textContent || div.innerText ||'';
 }

 // ===========================================================================
 // PAGINATION
 // ===========================================================================
 private getTotalPages(): number {
 if (this.pageSize <= 0 || this.parsedRows.length === 0) return 1;
 return Math.ceil(this.parsedRows.length / this.pageSize);
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

 // ===========================================================================
 // RENDER HELPERS
 // ===========================================================================
 private getTableClasses(): string {
 return [
'w-full border-collapse',
'text-sm',
 this.disabled ?'opacity-50 pointer-events-none' :'',
 ].filter(Boolean).join(' ');
 }

 private getHeaderCellClasses(header: ParsedHeader): string {
 const isActive = this.sortKey === header.key;
 return [
'px-4 py-3 text-left font-medium',
'ml-surface-dim-bg',
'ml-text',
'border-b ml-border',
 header.sortable && !this.disabled ?'cursor-pointer select-none hover:ml-surface-dim-bg' :'',
 isActive ?'ml-primary-text' :'',
 ].filter(Boolean).join(' ');
 }

 private getRowClasses(index: number): string {
 const selected = this.getSelectedIndices();
 const isSelected = selected.has(index);
 return [
'transition-colors',
'border-b ml-border',
 isSelected
 ?'ml-primary-dim-bg'
 :'ml-surface-bg hover:ml-surface-dim-bg',
 !this.disabled ?'cursor-pointer' :'',
 ].filter(Boolean).join(' ');
 }

 private getCellClasses(): string {
 return [
'px-4 py-3',
'ml-text',
 ].join(' ');
 }

 private getCheckboxClasses(): string {
 return [
'w-4 h-4 rounded',
'border ml-border',
'ml-primary-text',
'',
'ml-surface-bg',
 this.disabled ?'cursor-not-allowed' :'cursor-pointer',
 ].join(' ');
 }

 // ===========================================================================
 // RENDER SECTIONS
 // ===========================================================================
 private renderCaption(): TemplateResult {
 const captionContent = this.getSlotContent('Caption');
 if (!captionContent) return html``;

 return html`
 <caption class="${cn('px-4 py-3 text-left text-base font-semibold ml-text ml-surface-bg', this.getSlotClass('Caption'))}">
 ${unsafeHTML(captionContent)}
 </caption>
 `;
 }

 private renderSortIcon(header: ParsedHeader): TemplateResult {
 if (!header.sortable) return html``;

 const isActive = this.sortKey === header.key;
 const iconClasses = [
'ml-2 inline-block w-4 h-4 transition-transform',
 isActive ?'ml-primary-text' :'ml-text-faint',
 ].join(' ');

 if (!isActive) {
 return html`
 <span class="${iconClasses}">
 <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 ${svg`<path d="M7 10l5-5 5 5M7 14l5 5 5-5"/>`}
 </svg>
 </span>
 `;
 }

 const rotation = this.sortDirection ==='desc' ?'rotate-180' :'';
 return html`
 <span class="${iconClasses} ${rotation}">
 <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 ${svg`<path d="M5 15l7-7 7 7"/>`}
 </svg>
 </span>
 `;
 }

 private renderHeader(): TemplateResult {
 if (this.parsedHeaders.length === 0) return html``;

 const selected = this.getSelectedIndices();
 const allSelected = this.parsedRows.length > 0 && selected.size === this.parsedRows.length;
 const someSelected = selected.size > 0 && selected.size < this.parsedRows.length;

 return html`
 <thead role="rowgroup">
 <tr role="row">
 ${this.selectable
 ? html`
 <th
 role="columnheader"
 class="px-4 py-3 w-12 ml-surface-dim-bg border-b ml-border"
 >
 <input
 type="checkbox"
 class="${this.getCheckboxClasses()}"
 .checked=${allSelected}
 .indeterminate=${someSelected}
 @change=${this.handleSelectAll}
 aria-label="${this.msg.selectAll}"
 ?disabled=${this.disabled}
 />
 </th>
 `
 : html``}
 ${this.parsedHeaders.map(
 (header) => html`
 <th
 role="columnheader"
 class="${this.getHeaderCellClasses(header)}"
 aria-sort=${this.sortKey === header.key
 ? this.sortDirection ==='asc'
 ?'ascending'
 :'descending'
 :'none'}
 @click=${header.sortable ? () => this.handleSort(header.key) : null}
 @keydown=${header.sortable
 ? (e: KeyboardEvent) => {
 if (e.key ==='Enter' || e.key ==='') {
 e.preventDefault();
 this.handleSort(header.key);
 }
 }
 : null}
 tabindex=${header.sortable && !this.disabled ?'0' :'-1'}
 >
 <span class="inline-flex items-center">
 ${unsafeHTML(header.content)}
 ${this.renderSortIcon(header)}
 </span>
 </th>
 `
 )}
 </tr>
 </thead>
 `;
 }

 private renderBody(): TemplateResult {
 if (this.parsedRows.length === 0) {
 return this.renderEmpty();
 }

 const selected = this.getSelectedIndices();
 const start = this.pageSize > 0 ? (this.page - 1) * this.pageSize : 0;
 const visibleIndices = this.pageSize > 0
 ? this.sortedRowIndices.slice(start, start + this.pageSize)
 : this.sortedRowIndices;

 return html`
 <tbody role="rowgroup">
 ${visibleIndices.map((originalIndex) => {
 const row = this.parsedRows[originalIndex];
 if (!row) return html``;

 const isSelected = selected.has(originalIndex);

 return html`
 <tr
 role="row"
 class="${this.getRowClasses(originalIndex)}"
 @click=${() => this.handleRowClick(originalIndex)}
 @keydown=${(e: KeyboardEvent) => {
 if (e.key ==='Enter') {
 this.handleRowClick(originalIndex);
 } else if (e.key ==='' && this.selectable) {
 e.preventDefault();
 this.handleRowSelect(originalIndex);
 }
 }}
 tabindex=${!this.disabled ?'0' :'-1'}
 >
 ${this.selectable
 ? html`
 <td role="cell" class="px-4 py-3 w-12">
 <input
 type="checkbox"
 class="${this.getCheckboxClasses()}"
 .checked=${isSelected}
 @change=${(e: Event) => {
 e.stopPropagation();
 this.handleRowSelect(originalIndex);
 }}
 @click=${(e: Event) => e.stopPropagation()}
 aria-label="${this.msg.selectRow} ${originalIndex + 1}"
 ?disabled=${this.disabled}
 />
 </td>
 `
 : html``}
 ${row.cells.map(
 (cell) => html`
 <td role="cell" class="${this.getCellClasses()}">
 ${unsafeHTML(cell)}
 </td>
 `
 )}
 </tr>
 `;
 })}
 </tbody>
 `;
 }

 private renderFooter(): TemplateResult {
 const footerSlot = this.getSlot('TableFooter');
 if (!footerSlot) return html``;

 const footerRow = footerSlot.querySelector('TableRow');
 if (!footerRow) return html``;

 const cells = footerRow.querySelectorAll('TableCell');
 const cellContents = Array.from(cells).map((cell) => cell.innerHTML.trim());

 return html`
 <tfoot role="rowgroup" class="${cn('ml-surface-dim-bg', this.getSlotClass('TableFooter'))}">
 <tr role="row" class="border-t ml-border">
 ${this.selectable ? html`<td role="cell" class="px-4 py-3"></td>` : html``}
 ${cellContents.map(
 (content) => html`
 <td role="cell" class="${this.getCellClasses()} font-medium">
 ${unsafeHTML(content)}
 </td>
 `
 )}
 </tr>
 </tfoot>
 `;
 }

 private renderEmpty(): TemplateResult {
 const emptyContent = this.getSlotContent('Empty');
 const colSpan = this.parsedHeaders.length + (this.selectable ? 1 : 0);

 return html`
 <tbody role="rowgroup">
 <tr role="row">
 <td role="cell" colspan="${colSpan}" class="px-4 py-12 text-center">
 <div class="flex flex-col items-center justify-center space-y-3">
 <svg
 class="w-12 h-12 ml-text-muted"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 stroke-width="1.5"
 >
 ${svg`
 <path d="M3 10h18M3 14h18M3 6h18M3 18h18" stroke-linecap="round"/>
 <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3"/>
 `}
 </svg>
 <p class="ml-text-muted">
 ${emptyContent ? unsafeHTML(emptyContent) : this.msg.noData}
 </p>
 </div>
 </td>
 </tr>
 </tbody>
 `;
 }

 private renderLoading(): TemplateResult {
 const loadingContent = this.getSlotContent('Loading');
 if (loadingContent) {
 return html`
 <div class="p-4">
 ${unsafeHTML(loadingContent)}
 </div>
 `;
 }

 const skeletonRows = 5;
 const skeletonCols = Math.max(this.parsedHeaders.length, 3);

 return html`
 <div class="animate-pulse">
 <div class="ml-surface-dim-bg border-b ml-border">
 <div class="flex px-4 py-3 space-x-4">
 ${this.selectable
 ? html`<div class="w-4 h-4 ml-surface-dim-bg rounded"></div>`
 : html``}
 ${Array(skeletonCols)
 .fill(0)
 .map(
 () => html`
 <div class="flex-1 h-4 ml-surface-dim-bg rounded"></div>
 `
 )}
 </div>
 </div>
 ${Array(skeletonRows)
 .fill(0)
 .map(
 () => html`
 <div class="flex px-4 py-3 space-x-4 border-b ml-border">
 ${this.selectable
 ? html`<div class="w-4 h-4 ml-surface-dim-bg rounded"></div>`
 : html``}
 ${Array(skeletonCols)
 .fill(0)
 .map(
 () => html`
 <div class="flex-1 h-4 ml-surface-dim-bg rounded"></div>
 `
 )}
 </div>
 `
 )}
 </div>
 `;
 }

 private renderPagination(): TemplateResult {
 if (this.pageSize <= 0) return html``;

 const totalPages = this.getTotalPages();
 if (totalPages <= 1) return html``;

 const pages = this.getPaginationPages(totalPages);

 return html`
 <nav
 role="navigation"
 aria-label="${this.msg.pagination}"
 class="flex items-center justify-between px-4 py-3 border-t ml-border ml-surface-bg"
 >
 <div class="text-sm ml-text-muted">
 ${this.msg.page} ${this.page} ${this.msg.of} ${totalPages}
 </div>
 <div class="flex items-center space-x-1">
 <button
 type="button"
 class="${this.getPaginationButtonClasses(this.page === 1)}"
 @click=${() => this.handlePageChange(this.page - 1)}
 ?disabled=${this.page === 1 || this.disabled}
 aria-label="${this.msg.previous}"
 >
 <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 ${svg`<path d="M15 19l-7-7 7-7"/>`}
 </svg>
 </button>
 ${pages.map((p) => {
 if (p ==='...') {
 return html`
 <span class="px-2 py-1 ml-text-faint">...</span>
 `;
 }
 const pageNum = p as number;
 const isActive = pageNum === this.page;
 return html`
 <button
 type="button"
 class="${this.getPageNumberClasses(isActive)}"
 @click=${() => this.handlePageChange(pageNum)}
 ?disabled=${this.disabled}
 aria-current=${isActive ?'page' :'false'}
 >
 ${pageNum}
 </button>
 `;
 })}
 <button
 type="button"
 class="${this.getPaginationButtonClasses(this.page === totalPages)}"
 @click=${() => this.handlePageChange(this.page + 1)}
 ?disabled=${this.page === totalPages || this.disabled}
 aria-label="${this.msg.next}"
 >
 <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 ${svg`<path d="M9 5l7 7-7 7"/>`}
 </svg>
 </button>
 </div>
 </nav>
 `;
 }

 private getPaginationPages(totalPages: number): (number | string)[] {
 const pages: (number | string)[] = [];
 const current = this.page;
 const delta = 2;

 for (let i = 1; i <= totalPages; i++) {
 if (i === 1 || i === totalPages || (i >= current - delta && i <= current + delta)) {
 pages.push(i);
 } else if (pages[pages.length - 1] !=='...') {
 pages.push('...');
 }
 }

 return pages;
 }

 private getPaginationButtonClasses(isDisabled: boolean): string {
 return [
'p-2 rounded-md transition-colors',
'ml-text-muted',
 isDisabled
 ?'ml-disabled'
 :'hover:ml-surface-dim-bg cursor-pointer',
'',
 ].join(' ');
 }

 private getPageNumberClasses(isActive: boolean): string {
 return [
'min-w-[32px] h-8 px-2 rounded-md text-sm font-medium transition-colors',
 isActive
 ?'ml-primary-bg'
 :'ml-text-muted hover:ml-surface-dim-bg',
'',
 ].join(' ');
 }

 private renderError(): TemplateResult {
 if (!this.error) return html``;

 return html`
 <div class="px-4 py-2 text-sm ml-error-text ml-error-dim-bg border-t ml-border-error">
 ${unsafeHTML(this.error)}
 </div>
 `;
 }

 // ===========================================================================
 // RENDER
 // ===========================================================================
 render() {
 const lang = this.getMessageKey(messages);
 this.msg = messages[lang];

 if (this.loading) {
 return html`
 <div class="${cn('overflow-hidden rounded-lg border ml-border ml-surface-bg', this.cssClass)}">
 ${this.renderLoading()}
 </div>
 `;
 }

 return html`
 <div class="${cn('overflow-hidden rounded-lg border ml-border ml-surface-bg', this.cssClass)}">
 <div class="overflow-x-auto">
 <table role="table" class="${this.getTableClasses()}">
 ${this.renderCaption()}
 ${this.renderHeader()}
 ${this.renderBody()}
 ${this.renderFooter()}
 </table>
 </div>
 ${this.renderPagination()}
 ${this.renderError()}
 </div>
 `;
 }
}
