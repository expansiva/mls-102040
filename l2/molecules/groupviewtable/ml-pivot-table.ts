/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-pivot-table.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// PIVOT TABLE MOLECULE
// =============================================================================
// Skill Group: groupViewTable
// This molecule does NOT contain business logic.

import { html, TemplateResult } from'lit';
import { customElement, property, state } from'lit/decorators.js';
import { unsafeHTML } from'lit/directives/unsafe-html.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
 loading:'Loading...',
 empty:'No data available',
 selectAll:'Select all rows',
 selectRow:'Select row',
 pagination:'Table pagination',
 previous:'Previous',
 next:'Next',
 sortAscending:'Sort ascending',
 sortDescending:'Sort descending',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
 en: message_en,
 pt: {
 loading:'Carregando...',
 empty:'Nenhum dado disponível',
 selectAll:'Selecionar todas as linhas',
 selectRow:'Selecionar linha',
 pagination:'Paginação da tabela',
 previous:'Anterior',
 next:'Próximo',
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
 element: Element;
 cells: string[];
 index: number;
 isSubtotal: boolean;
 isTotal: boolean;
}

@customElement('groupviewtable--ml-pivot-table')
export class MlPivotTableMolecule extends MoleculeAuraElement {
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
 private parsedBodyRows: ParsedRow[] = [];

 @state()
 private parsedFooterRows: ParsedRow[] = [];

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
 // STATE CHANGE HANDLER
 // ===========================================================================
 handleIcaStateChange(key: string, value: unknown) {
 const isEditingAttr = this.getAttribute('is-editing');
 if (isEditingAttr === `{{${key}}}`) {
 this.propagateEditingState();
 }
 this.requestUpdate();
 }

 // ===========================================================================
 // PARSING
 // ===========================================================================
 private parseSlotContent() {
 this.parsedHeaders = this.parseHeaders();
 this.parsedBodyRows = this.parseBodyRows();
 this.parsedFooterRows = this.parseFooterRows();
 }

 private parseHeaders(): ParsedHeader[] {
 const headerSlot = this.getSlot('TableHeader');
 if (!headerSlot) return [];

 const headerRow = headerSlot.querySelector('TableRow');
 if (!headerRow) return [];

 const heads = Array.from(headerRow.querySelectorAll('TableHead'));
 return heads.map((head) => ({
 key: head.getAttribute('key') ||'',
 sortable: head.hasAttribute('sortable'),
 content: head.innerHTML,
 }));
 }

 private parseBodyRows(): ParsedRow[] {
 const bodySlot = this.getSlot('TableBody');
 if (!bodySlot) return [];

 const rows = Array.from(bodySlot.querySelectorAll('TableRow'));
 return rows.map((row, index) => {
 const cells = Array.from(row.querySelectorAll('TableCell'));
 const isSubtotal = row.hasAttribute('subtotal') || row.classList.contains('subtotal');
 const isTotal = row.hasAttribute('total') || row.classList.contains('total');
 return {
 element: row,
 cells: cells.map((cell) => cell.innerHTML),
 index,
 isSubtotal,
 isTotal,
 };
 });
 }

 private parseFooterRows(): ParsedRow[] {
 const footerSlot = this.getSlot('TableFooter');
 if (!footerSlot) return [];

 const rows = Array.from(footerSlot.querySelectorAll('TableRow'));
 return rows.map((row, index) => {
 const cells = Array.from(row.querySelectorAll('TableCell'));
 return {
 element: row,
 cells: cells.map((cell) => cell.innerHTML),
 index,
 isSubtotal: false,
 isTotal: true,
 };
 });
 }

 // ===========================================================================
 // EDITING PROPAGATION
 // ===========================================================================
 private propagateEditingState() {
 const bodySlot = this.getSlot('TableBody');
 if (!bodySlot) return;

 const cells = bodySlot.querySelectorAll('TableCell');
 cells.forEach((cell) => {
 const customElements = Array.from(cell.querySelectorAll('*')).filter(
 (el) => el.tagName.includes('-')
 );
 customElements.forEach((el) => {
 el.setAttribute('is-editing', String(this.isEditing));
 });
 });
 }

 // ===========================================================================
 // SELECTION
 // ===========================================================================
 private getSelectedIndices(): Set<number> {
 if (!this.value) return new Set();
 return new Set(
 this.value
 .split(',')
 .filter((v) => v.trim() !=='')
 .map((v) => parseInt(v.trim(), 10))
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

 private handleSelectAll() {
 if (this.disabled) return;
 const selected = this.getSelectedIndices();
 const allSelected = this.parsedBodyRows.every((row) => selected.has(row.index));

 if (allSelected) {
 this.setSelectedIndices(new Set());
 } else {
 this.setSelectedIndices(new Set(this.parsedBodyRows.map((row) => row.index)));
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

 this.sortBodyRows();

 this.dispatchEvent(
 new CustomEvent('sort', {
 bubbles: true,
 composed: true,
 detail: { key: this.sortKey, direction: this.sortDirection },
 })
 );
 }

 private sortBodyRows() {
 if (!this.sortKey) return;

 const columnIndex = this.parsedHeaders.findIndex((h) => h.key === this.sortKey);
 if (columnIndex === -1) return;

 const regularRows = this.parsedBodyRows.filter((r) => !r.isSubtotal && !r.isTotal);
 const specialRows = this.parsedBodyRows.filter((r) => r.isSubtotal || r.isTotal);

 regularRows.sort((a, b) => {
 const aText = this.extractTextContent(a.cells[columnIndex] ||'');
 const bText = this.extractTextContent(b.cells[columnIndex] ||'');

 const comparison = aText.localeCompare(bText, undefined, { numeric: true, sensitivity:'base' });
 return this.sortDirection ==='asc' ? comparison : -comparison;
 });

 this.parsedBodyRows = [...regularRows, ...specialRows];
 }

 private extractTextContent(html: string): string {
 const div = document.createElement('div');
 div.innerHTML = html;
 return div.textContent ||'';
 }

 // ===========================================================================
 // ROW CLICK
 // ===========================================================================
 private handleRowClick(index: number, event: Event) {
 if (this.disabled) return;

 const target = event.target as HTMLElement;
 if (target.tagName ==='INPUT' && target.getAttribute('type') ==='checkbox') {
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

 // ===========================================================================
 // PAGINATION
 // ===========================================================================
 private getTotalPages(): number {
 if (this.pageSize <= 0) return 1;
 return Math.ceil(this.totalItems / this.pageSize) || 1;
 }

 private handlePageChange(newPage: number) {
 if (this.disabled) return;
 if (newPage < 1 || newPage > this.getTotalPages()) return;

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
 private getContainerClasses(): string {
 return [
'w-full overflow-x-auto rounded-lg border',
'ml-border',
'ml-surface-bg',
 this.disabled ?'opacity-50 pointer-events-none' :'',
 ]
 .filter(Boolean)
 .join(' ');
 }

 private getTableClasses(): string {
 return'w-full border-collapse text-sm';
 }

 private getHeaderCellClasses(header: ParsedHeader): string {
 return [
'px-4 py-3 text-left font-semibold',
'ml-text',
'ml-surface-dim-bg',
'border-b ml-border',
 header.sortable && !this.disabled ?'cursor-pointer hover:ml-surface-dim-bg select-none' :'',
 ]
 .filter(Boolean)
 .join(' ');
 }

 private getBodyRowClasses(row: ParsedRow, isSelected: boolean): string {
 return [
'transition-colors',
 row.isSubtotal || row.isTotal ?'font-semibold ml-surface-dim-bg' :'',
 isSelected && !row.isSubtotal && !row.isTotal ?'ml-primary-dim-bg' :'',
 !row.isSubtotal && !row.isTotal && !isSelected ?'hover:ml-surface-dim-bg' :'',
 !this.disabled ?'cursor-pointer' :'',
 ]
 .filter(Boolean)
 .join(' ');
 }

 private getBodyCellClasses(row: ParsedRow): string {
 return [
'px-4 py-3',
'ml-text',
'border-b ml-border',
 row.isSubtotal || row.isTotal ?'font-semibold' :'',
 ]
 .filter(Boolean)
 .join(' ');
 }

 private getFooterCellClasses(): string {
 return [
'px-4 py-3 font-bold',
'ml-text',
'ml-surface-dim-bg',
'border-t-2 ml-border',
 ].join(' ');
 }

 private getCheckboxClasses(): string {
 return [
'w-4 h-4 rounded',
'ml-border',
'ml-primary-text',
'',
'ml-surface-bg',
 ].join(' ');
 }

 private getPaginationClasses(): string {
 return [
'flex items-center justify-center gap-2 px-4 py-3',
'border-t ml-border',
'ml-surface-dim-bg',
 ].join(' ');
 }

 private getPaginationButtonClasses(isDisabled: boolean): string {
 return [
'px-3 py-1 rounded text-sm font-medium transition',
 isDisabled
 ?'ml-text-faint cursor-not-allowed'
 :'ml-text hover:ml-surface-dim-bg cursor-pointer',
 ].join(' ');
 }

 private getPageNumberClasses(isCurrent: boolean): string {
 return [
'px-3 py-1 rounded text-sm font-medium transition cursor-pointer',
 isCurrent
 ?'ml-primary-bg'
 :'ml-text hover:ml-surface-dim-bg',
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

 if (this.parsedBodyRows.length === 0) {
 return this.renderEmpty();
 }

 return html`
 <div class="${cn(this.getContainerClasses(), this.cssClass)}">
 ${this.renderCaption()}
 <table class="${this.getTableClasses()}" role="table">
 ${this.renderTableHeader()}
 ${this.renderTableBody()}
 ${this.renderTableFooter()}
 </table>
 ${this.renderPagination()}
 ${this.renderError()}
 </div>
 `;
 }

 private renderCaption(): TemplateResult {
 if (!this.hasSlot('Caption')) return html``;
 const captionContent = this.getSlotContent('Caption');
 return html`
 <div class="${cn('px-4 py-3 font-semibold text-lg ml-text border-b ml-border', this.getSlotClass('Caption'))}">
 ${unsafeHTML(captionContent)}
 </div>
 `;
 }

 private renderTableHeader(): TemplateResult {
 if (this.parsedHeaders.length === 0) return html``;

 const selected = this.getSelectedIndices();
 const allSelected = this.parsedBodyRows.length > 0 && this.parsedBodyRows.every((row) => selected.has(row.index));

 return html`
 <thead role="rowgroup">
 <tr role="row">
 ${this.selectable
 ? html`
 <th class="${this.getHeaderCellClasses({ key:'', sortable: false, content:'' })} w-12" role="columnheader">
 <input
 type="checkbox"
 class="${this.getCheckboxClasses()}"
 .checked="${allSelected}"
 @change="${this.handleSelectAll}"
 aria-label="${this.msg.selectAll}"
 ?disabled="${this.disabled}"
 />
 </th>
 `
 : html``}
 ${this.parsedHeaders.map((header) => this.renderHeaderCell(header))}
 </tr>
 </thead>
 `;
 }

 private renderHeaderCell(header: ParsedHeader): TemplateResult {
 const isSorted = this.sortKey === header.key;
 const ariaSort = isSorted ? (this.sortDirection ==='asc' ?'ascending' :'descending') : undefined;

 return html`
 <th
 class="${this.getHeaderCellClasses(header)}"
 role="columnheader"
 aria-sort="${ariaSort ||'none'}"
 @click="${header.sortable ? () => this.handleSort(header.key) : undefined}"
 @keydown="${header.sortable ? (e: KeyboardEvent) => e.key ==='Enter' && this.handleSort(header.key) : undefined}"
 tabindex="${header.sortable ?'0' :'-1'}"
 >
 <div class="flex items-center gap-2">
 <span>${unsafeHTML(header.content)}</span>
 ${header.sortable ? this.renderSortIndicator(header.key) : html``}
 </div>
 </th>
 `;
 }

 private renderSortIndicator(key: string): TemplateResult {
 const isSorted = this.sortKey === key;
 const iconClasses = [
'w-4 h-4 transition-transform',
 isSorted ?'ml-primary-text' :'ml-text-faint',
 ].join(' ');

 if (!isSorted) {
 return html`
 <svg class="${iconClasses}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
 </svg>
 `;
 }

 const rotation = this.sortDirection ==='desc' ?'rotate-180' :'';
 return html`
 <svg class="${iconClasses} ${rotation}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
 </svg>
 `;
 }

 private renderTableBody(): TemplateResult {
 const selected = this.getSelectedIndices();

 return html`
 <tbody role="rowgroup">
 ${this.parsedBodyRows.map((row) => {
 const isSelected = selected.has(row.index);
 return html`
 <tr
 class="${this.getBodyRowClasses(row, isSelected)}"
 role="row"
 @click="${(e: Event) => this.handleRowClick(row.index, e)}"
 @keydown="${(e: KeyboardEvent) => {
 if (e.key ==='Enter' || e.key ==='') {
 e.preventDefault();
 if (this.selectable) this.handleRowSelect(row.index);
 }
 }}"
 tabindex="0"
 >
 ${this.selectable
 ? html`
 <td class="${this.getBodyCellClasses(row)} w-12" role="cell">
 <input
 type="checkbox"
 class="${this.getCheckboxClasses()}"
 .checked="${isSelected}"
 @change="${() => this.handleRowSelect(row.index)}"
 aria-label="${this.msg.selectRow} ${row.index + 1}"
 ?disabled="${this.disabled}"
 />
 </td>
 `
 : html``}
 ${row.cells.map(
 (cell) => html`
 <td class="${this.getBodyCellClasses(row)}" role="cell">
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

 private renderTableFooter(): TemplateResult {
 if (this.parsedFooterRows.length === 0) return html``;

 return html`
 <tfoot role="rowgroup">
 ${this.parsedFooterRows.map(
 (row) => html`
 <tr role="row">
 ${this.selectable ? html`<td class="${this.getFooterCellClasses()}"></td>` : html``}
 ${row.cells.map(
 (cell) => html`
 <td class="${this.getFooterCellClasses()}" role="cell">
 ${unsafeHTML(cell)}
 </td>
 `
 )}
 </tr>
 `
 )}
 </tfoot>
 `;
 }

 private renderPagination(): TemplateResult {
 if (this.pageSize <= 0) return html``;

 const totalPages = this.getTotalPages();
 const pages = this.getPageNumbers(totalPages);

 return html`
 <nav class="${this.getPaginationClasses()}" role="navigation" aria-label="${this.msg.pagination}">
 <button
 class="${this.getPaginationButtonClasses(this.page <= 1)}"
 @click="${() => this.handlePageChange(this.page - 1)}"
 ?disabled="${this.page <= 1 || this.disabled}"
 aria-label="${this.msg.previous}"
 >
 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
 </svg>
 </button>

 ${pages.map((p) =>
 p ==='...'
 ? html`<span class="px-2 ml-text-faint">...</span>`
 : html`
 <button
 class="${this.getPageNumberClasses(p === this.page)}"
 @click="${() => this.handlePageChange(p as number)}"
 ?disabled="${this.disabled}"
 aria-current="${p === this.page ?'page' :'false'}"
 >
 ${p}
 </button>
 `
 )}

 <button
 class="${this.getPaginationButtonClasses(this.page >= totalPages)}"
 @click="${() => this.handlePageChange(this.page + 1)}"
 ?disabled="${this.page >= totalPages || this.disabled}"
 aria-label="${this.msg.next}"
 >
 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
 </svg>
 </button>
 </nav>
 `;
 }

 private getPageNumbers(totalPages: number): (number | string)[] {
 if (totalPages <= 7) {
 return Array.from({ length: totalPages }, (_, i) => i + 1);
 }

 const pages: (number | string)[] = [];
 const current = this.page;

 pages.push(1);

 if (current > 3) {
 pages.push('...');
 }

 const start = Math.max(2, current - 1);
 const end = Math.min(totalPages - 1, current + 1);

 for (let i = start; i <= end; i++) {
 pages.push(i);
 }

 if (current < totalPages - 2) {
 pages.push('...');
 }

 pages.push(totalPages);

 return pages;
 }

 private renderLoading(): TemplateResult {
 if (this.hasSlot('Loading')) {
 return html`
 <div class="${cn(this.getContainerClasses(), this.cssClass)}">
 ${unsafeHTML(this.getSlotContent('Loading'))}
 </div>
 `;
 }

 return html`
 <div class="${cn(this.getContainerClasses(), this.cssClass)}">
 <div class="p-4 space-y-3">
 <div class="h-10 ml-surface-dim-bg rounded animate-pulse"></div>
 ${[1, 2, 3, 4, 5].map(
 () => html`
 <div class="h-12 ml-surface-dim-bg rounded animate-pulse"></div>
 `
 )}
 </div>
 </div>
 `;
 }

 private renderEmpty(): TemplateResult {
 const emptyContent = this.hasSlot('Empty') ? this.getSlotContent('Empty') : this.msg.empty;

 return html`
 <div class="${cn(this.getContainerClasses(), this.cssClass)}">
 <div class="p-8 text-center ml-text-muted">
 ${unsafeHTML(emptyContent)}
 </div>
 </div>
 `;
 }

 private renderError(): TemplateResult {
 if (!this.error) return html``;

 return html`
 <p class="mt-2 text-xs ml-error-text px-4 pb-3">
 ${unsafeHTML(this.error)}
 </p>
 `;
 }
}
