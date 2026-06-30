/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-data-table-minimal.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML DATA TABLE MINIMAL MOLECULE
// =============================================================================
// Skill Group: groupViewTable
// This molecule does NOT contain business logic.
import { html, TemplateResult } from'lit';
import { customElement, state } from'lit/decorators.js';
import { unsafeHTML } from'lit/directives/unsafe-html.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';
/// **collab_i18n_start**
const message_en = {
 empty:'No data available',
 loading:'Loading...',
 selectAll:'Select all rows',
 selectRow:'Select row',
 prev:'Previous',
 next:'Next',
 page:'Page',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
 en: message_en,
 pt: {
 empty:'Nenhum dado disponível',
 loading:'Carregando...',
 selectAll:'Selecionar todas as linhas',
 selectRow:'Selecionar linha',
 prev:'Anterior',
 next:'Próxima',
 page:'Página',
 },
};
/// **collab_i18n_end**
@customElement('groupviewtable--ml-data-table-minimal')
export class MlDataTableMinimalMolecule extends MoleculeAuraElement {
 private msg: MessageType = messages.en;

 // ===========================================================================
 // SLOT TAGS
 // ===========================================================================
 slotTags = ['Caption','TableHeader','TableBody','TableRow','TableHead','TableCell','TableFooter','Empty','Loading'];

 // ===========================================================================
 // PROPERTIES — From Contract
 // ===========================================================================
 @propertyDataSource({ type: Boolean })
 selectable = false;

 @propertyDataSource({ type: Boolean, attribute:'is-editing' })
 isEditing = false;

 @propertyDataSource({ type: Number })
 page = 1;

 @propertyDataSource({ type: Number, attribute:'page-size' })
 pageSize = 0;

 @propertyDataSource({ type: Number, attribute:'total-items' })
 totalItems = 0;

 @propertyDataSource({ type: String })
 value ='';

 @propertyDataSource({ type: String })
 error ='';

 @propertyDataSource({ type: Boolean })
 disabled = false;

 @propertyDataSource({ type: Boolean })
 loading = false;

 // ===========================================================================
 // INTERNAL STATE
 // ===========================================================================
 @state()
 private sortKey: string | null = null;

 @state()
 private sortDirection:'asc' |'desc' ='asc';

 // ===========================================================================
 // LIFECYCLE
 // ===========================================================================
 firstUpdated() {
 this.propagateIsEditing();
 }

 updated(changedProps: Map<string, any>) {
 if (changedProps.has('isEditing')) {
 this.propagateIsEditing();
 }
 this.syncSelectAllState();
 }

 // ===========================================================================
 // HELPERS
 // ===========================================================================
 private getHeaderCells(): HTMLElement[] {
 const header = this.getSlot('TableHeader');
 const row = header?.querySelector('TableRow');
 if (!row) return [];
 return Array.from(row.querySelectorAll('TableHead')) as HTMLElement[];
 }

 private getBodyRows(): HTMLElement[] {
 const body = this.getSlot('TableBody');
 if (!body) return [];
 return Array.from(body.querySelectorAll('TableRow')) as HTMLElement[];
 }

 private getFooterRows(): HTMLElement[] {
 const footer = this.getSlot('TableFooter');
 if (!footer) return [];
 return Array.from(footer.querySelectorAll('TableRow')) as HTMLElement[];
 }

 private getSortedRows(rows: HTMLElement[], headCells: HTMLElement[]): HTMLElement[] {
 if (!this.sortKey) return rows;
 const columnIndex = headCells.findIndex(cell => (cell.getAttribute('key') ||'').trim() === this.sortKey);
 if (columnIndex < 0) return rows;
 const direction = this.sortDirection;
 return [...rows].sort((a, b) => {
 const aCell = a.querySelectorAll('TableCell')[columnIndex] as HTMLElement | undefined;
 const bCell = b.querySelectorAll('TableCell')[columnIndex] as HTMLElement | undefined;
 const aText = (aCell?.textContent ||'').trim();
 const bText = (bCell?.textContent ||'').trim();
 const result = aText.localeCompare(bText, undefined, { numeric: true, sensitivity:'base' });
 return direction ==='asc' ? result : -result;
 });
 }

 private getSelectionSet(): Set<number> {
 if (!this.value) return new Set();
 return new Set(
 this.value
 .split(',')
 .map(v => v.trim())
 .filter(v => v !=='')
 .map(v => Number(v))
 .filter(v => !Number.isNaN(v))
 );
 }

 private updateSelection(set: Set<number>) {
 const value = Array.from(set).sort((a, b) => a - b).join(',');
 this.value = value;
 this.dispatchEvent(new CustomEvent('change', {
 bubbles: true,
 composed: true,
 detail: { value }
 }));
 }

 private getTotalPages(itemCount: number): number {
 if (this.pageSize <= 0) return 1;
 const pages = Math.ceil(itemCount / this.pageSize);
 return pages > 0 ? pages : 1;
 }

 private propagateIsEditing() {
 const cells = Array.from(this.querySelectorAll('td')) as HTMLElement[];
 cells.forEach(cell => {
 const customElements = Array.from(cell.querySelectorAll('*')).filter(el => el.tagName.includes('-')) as HTMLElement[];
 customElements.forEach(el => {
 el.setAttribute('is-editing', this.isEditing ?'true' :'false');
 });
 });
 }

 private syncSelectAllState() {
 if (!this.selectable) return;
 const headerCheckbox = this.querySelector('input[data-select-all="true"]') as HTMLInputElement | null;
 if (!headerCheckbox) return;
 const rows = this.getBodyRows();
 const selected = this.getSelectionSet();
 if (rows.length === 0) {
 headerCheckbox.indeterminate = false;
 headerCheckbox.checked = false;
 return;
 }
 headerCheckbox.indeterminate = selected.size > 0 && selected.size < rows.length;
 headerCheckbox.checked = selected.size === rows.length;
 }

 // ===========================================================================
 // EVENT HANDLERS
 // ===========================================================================
 private handleSort(key: string, sortable: boolean) {
 if (this.disabled || !sortable) return;
 const nextDirection = this.sortKey === key && this.sortDirection ==='asc' ?'desc' :'asc';
 this.sortKey = key;
 this.sortDirection = nextDirection;
 this.dispatchEvent(new CustomEvent('sort', {
 bubbles: true,
 composed: true,
 detail: { key, direction: nextDirection }
 }));
 }

 private handleSortKeydown(e: KeyboardEvent, key: string, sortable: boolean) {
 if (!sortable) return;
 if (e.key ==='Enter' || e.key ==='') {
 e.preventDefault();
 this.handleSort(key, sortable);
 }
 }

 private handleRowSelection(index: number) {
 if (this.disabled) return;
 const selected = this.getSelectionSet();
 if (selected.has(index)) {
 selected.delete(index);
 } else {
 selected.add(index);
 }
 this.updateSelection(selected);
 }

 private handleSelectAll(totalRows: number) {
 if (this.disabled) return;
 const selected = this.getSelectionSet();
 if (selected.size === totalRows) {
 this.updateSelection(new Set());
 return;
 }
 const next = new Set<number>();
 for (let i = 0; i < totalRows; i += 1) {
 next.add(i);
 }
 this.updateSelection(next);
 }

 private handleRowClick(index: number, e: Event) {
 if (this.disabled) return;
 const target = e.target as HTMLElement;
 if (target.closest('input[type="checkbox"]')) return;
 this.dispatchEvent(new CustomEvent('rowClick', {
 bubbles: true,
 composed: true,
 detail: { index }
 }));
 }

 private handleRowKeydown(e: KeyboardEvent, index: number) {
 const rows = Array.from(this.querySelectorAll('tbody tr[data-row-index]')) as HTMLElement[];
 const currentIndex = rows.findIndex(r => r.getAttribute('data-row-index') === String(index));
 if (e.key ==='ArrowDown') {
 e.preventDefault();
 const next = rows[currentIndex + 1];
 if (next) next.focus();
 }
 if (e.key ==='ArrowUp') {
 e.preventDefault();
 const prev = rows[currentIndex - 1];
 if (prev) prev.focus();
 }
 if (e.key ==='' && this.selectable) {
 e.preventDefault();
 this.handleRowSelection(index);
 }
 if (e.key ==='Enter') {
 e.preventDefault();
 this.dispatchEvent(new CustomEvent('rowClick', {
 bubbles: true,
 composed: true,
 detail: { index }
 }));
 }
 }

 private handlePageChange(nextPage: number) {
 if (this.disabled) return;
 this.page = nextPage;
 this.dispatchEvent(new CustomEvent('page-change', {
 bubbles: true,
 composed: true,
 detail: { page: nextPage }
 }));
 }

 // ===========================================================================
 // RENDER HELPERS
 // ===========================================================================
 private renderCaption(): TemplateResult {
 if (!this.hasSlot('Caption')) return html``;
 return html`<caption class="${cn('text-left px-3 py-2 text-sm ml-text-muted', this.getSlotClass('Caption'))}">${unsafeHTML(this.getSlotContent('Caption'))}</caption>`;
 }

 private renderHeaderCell(cell: HTMLElement, index: number): TemplateResult {
 const key = (cell.getAttribute('key') || String(index)).trim();
 const sortable = cell.hasAttribute('sortable');
 const isSorted = this.sortKey === key;
 const ariaSort = sortable ? (isSorted ? (this.sortDirection ==='asc' ?'ascending' :'descending') :'none') : undefined;
 const buttonClasses = [
'flex items-center gap-2 w-full text-left',
'ml-text',
 sortable ?'cursor-pointer select-none' :'cursor-default',
 ].filter(Boolean).join(' ');
 const iconClasses = [
'text-xs',
 isSorted ?'ml-primary-text' :'ml-text-faint',
 ].filter(Boolean).join(' ');
 const icon = isSorted ? (this.sortDirection ==='asc' ?'▲' :'▼') :'↕';
 return html`
 <th
 role="columnheader"
 aria-sort="${ariaSort ||'none'}"
 class="px-3 py-2 text-sm font-semibold border-b ml-border"
 >
 <button
 class="${buttonClasses}"
 @click=${() => this.handleSort(key, sortable)}
 @keydown=${(e: KeyboardEvent) => this.handleSortKeydown(e, key, sortable)}
 ?disabled=${this.disabled || !sortable}
 >
 <span>${unsafeHTML(cell.innerHTML)}</span>
 ${sortable ? html`<span class="${iconClasses}">${icon}</span>` : html``}
 </button>
 </th>
 `;
 }

 private renderBodyRow(row: HTMLElement, index: number, selection: Set<number>): TemplateResult {
 const cells = Array.from(row.querySelectorAll('TableCell')) as HTMLElement[];
 const isSelected = selection.has(index);
 const rowClasses = [
'border-b ml-border',
'ml-text',
 isSelected ?'ml-primary-dim-bg' :'ml-surface-bg',
 !this.disabled ?'hover:ml-surface-dim-bg' :'',
'',
 ].filter(Boolean).join(' ');
 return html`
 <tr
 role="row"
 class="${rowClasses}"
 data-row-index="${index}"
 tabindex="0"
 @click=${(e: Event) => this.handleRowClick(index, e)}
 @keydown=${(e: KeyboardEvent) => this.handleRowKeydown(e, index)}
 >
 ${this.selectable ? html`
 <td role="cell" class="px-3 py-2">
 <input
 type="checkbox"
 class="h-4 w-4 rounded ml-border ml-primary-text"
 aria-label="${this.msg.selectRow} ${index + 1}"
 .checked=${isSelected}
 @change=${() => this.handleRowSelection(index)}
 ?disabled=${this.disabled}
 />
 </td>
 ` : html``}
 ${cells.map(cell => html`
 <td role="cell" class="px-3 py-2 text-sm">
 ${unsafeHTML(cell.innerHTML)}
 </td>
 `)}
 </tr>
 `;
 }

 private renderFooter(colCount: number): TemplateResult {
 if (!this.hasSlot('TableFooter')) return html``;
 const rows = this.getFooterRows();
 return html`
 <tfoot role="rowgroup" class="${cn('ml-surface-dim-bg', this.getSlotClass('TableFooter'))}">
 ${rows.map(row => {
 const cells = Array.from(row.querySelectorAll('TableCell')) as HTMLElement[];
 return html`
 <tr role="row" class="border-t ml-border">
 ${this.selectable ? html`<td role="cell" class="px-3 py-2"></td>` : html``}
 ${cells.map(cell => html`
 <td role="cell" class="px-3 py-2 text-sm ml-text">
 ${unsafeHTML(cell.innerHTML)}
 </td>
 `)}
 </tr>
 `;
 })}
 </tfoot>
 `;
 }

 private renderPagination(totalPages: number): TemplateResult {
 if (this.pageSize <= 0 || totalPages <= 1) return html``;
 const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
 const navClasses = [
'mt-3 flex items-center gap-2',
'text-sm ml-text-muted',
 ].join(' ');
 const buttonBase = [
'px-2 py-1 rounded-md border transition',
'ml-border',
'ml-surface-bg',
'ml-text',
 !this.disabled ?'hover:ml-surface-dim-bg' :'ml-disabled',
 ].join(' ');
 const currentClasses = [
'px-2 py-1 rounded-md border',
'ml-border-focus',
'ml-primary-dim-bg',
'ml-primary-text',
 ].join(' ');
 return html`
 <nav class="${navClasses}" role="navigation" aria-label="Table pagination">
 <button
 class="${buttonBase}"
 @click=${() => this.handlePageChange(Math.max(1, this.page - 1))}
 ?disabled=${this.disabled || this.page <= 1}
 >
 ${this.msg.prev}
 </button>
 ${pages.map(p => html`
 <button
 class="${p === this.page ? currentClasses : buttonBase}"
 aria-current=${p === this.page ?'page' :'false'}
 @click=${() => this.handlePageChange(p)}
 ?disabled=${this.disabled}
 >
 ${this.msg.page} ${p}
 </button>
 `)}
 <button
 class="${buttonBase}"
 @click=${() => this.handlePageChange(Math.min(totalPages, this.page + 1))}
 ?disabled=${this.disabled || this.page >= totalPages}
 >
 ${this.msg.next}
 </button>
 </nav>
 `;
 }

 private renderError(): TemplateResult {
 if (!this.error) return html``;
 return html`<p class="mt-2 text-xs ml-error-text">${unsafeHTML(String(this.error))}</p>`;
 }

 private renderLoading(columnCount: number): TemplateResult {
 if (this.hasSlot('Loading')) {
 return html`<div class="w-full text-sm ml-text-muted">${unsafeHTML(this.getSlotContent('Loading'))}</div>`;
 }
 const cols = Math.max(columnCount + (this.selectable ? 1 : 0), 3);
 const rows = 3;
 return html`
 <div class="w-full">
 <div class="mb-2 text-sm ml-text-muted">${this.msg.loading}</div>
 <table class="min-w-full border ml-border">
 <tbody>
 ${Array.from({ length: rows }).map(() => html`
 <tr class="animate-pulse border-b ml-border">
 ${Array.from({ length: cols }).map(() => html`
 <td class="px-3 py-3">
 <div class="h-3 rounded ml-surface-dim-bg"></div>
 </td>
 `)}
 </tr>
 `)}
 </tbody>
 </table>
 </div>
 `;
 }

 private renderEmpty(headerCells: HTMLElement[]): TemplateResult {
 const content = this.hasSlot('Empty') ? this.getSlotContent('Empty') : this.msg.empty;
 return html`
 <div class="${cn('w-full', this.cssClass)}">
 <table class="min-w-full border ml-border">
 ${headerCells.length > 0 ? html`
 <thead class="ml-surface-dim-bg">
 <tr>
 ${this.selectable ? html`<th class="px-3 py-2"></th>` : html``}
 ${headerCells.map((cell, index) => this.renderHeaderCell(cell, index))}
 </tr>
 </thead>
 ` : html``}
 <tbody></tbody>
 </table>
 <div class="py-4 text-sm ml-text-muted">${unsafeHTML(content)}</div>
 ${this.renderPagination(this.getTotalPages(0))}
 ${this.renderError()}
 </div>
 `;
 }

 // ===========================================================================
 // RENDER
 // ===========================================================================
 render() {
 const lang = this.getMessageKey(messages);
 this.msg = messages[lang];

 const headerCells = this.getHeaderCells();
 const bodyRows = this.getBodyRows();

 if (this.loading) {
 return html`<div class="${cn('w-full', this.cssClass)}">${this.renderLoading(headerCells.length)}</div>`;
 }

 if (bodyRows.length === 0) {
 return this.renderEmpty(headerCells);
 }

 const sortedRows = this.getSortedRows(bodyRows, headerCells);
 // External pagination: totalItems > bodyRows.length means the parent already
 // sliced the dataset — render all received rows as-is.
 // Internal pagination: all rows are in the DOM — slice to the current page.
 const isExternalPagination = this.totalItems > bodyRows.length;
 const visibleRows = (this.pageSize > 0 && !isExternalPagination)
 ? sortedRows.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
 : sortedRows;
 const selection = this.getSelectionSet();
 const totalPages = this.getTotalPages(this.totalItems > 0 ? this.totalItems : bodyRows.length);
 const containerClasses = [
'w-full',
 this.disabled ?'opacity-50 pointer-events-none' :'',
 ].filter(Boolean).join(' ');

 return html`
 <div class="${cn(containerClasses, this.cssClass)}">
 <table class="min-w-full border ml-border ml-surface-bg" role="table">
 ${this.renderCaption()}
 <thead class="ml-surface-dim-bg" role="rowgroup">
 <tr role="row">
 ${this.selectable ? html`
 <th role="columnheader" class="px-3 py-2 border-b ml-border">
 <input
 type="checkbox"
 data-select-all="true"
 class="h-4 w-4 rounded ml-border ml-primary-text"
 aria-label="${this.msg.selectAll}"
 @change=${() => this.handleSelectAll(sortedRows.length)}
 ?disabled=${this.disabled}
 />
 </th>
 ` : html``}
 ${headerCells.map((cell, index) => this.renderHeaderCell(cell, index))}
 </tr>
 </thead>
 <tbody role="rowgroup">
 ${visibleRows.map((row, index) => this.renderBodyRow(row, index, selection))}
 </tbody>
 ${this.renderFooter(headerCells.length)}
 </table>
 ${this.renderPagination(totalPages)}
 ${this.renderError()}
 </div>
 `;
 }
}
