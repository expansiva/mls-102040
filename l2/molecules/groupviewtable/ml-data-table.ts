/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-data-table.ts" enhancement="_102020_/l2/enhancementAura" />

// =============================================================================
// ML DATA TABLE MOLECULE
// =============================================================================
// Skill Group: groupViewTable
// This molecule does NOT contain business logic.

import { html, TemplateResult, nothing } from'lit';
import { unsafeHTML } from'lit/directives/unsafe-html.js';
import { customElement, state } from'lit/decorators.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
 loading:'Loading...',
 empty:'No records found.',
 selectAll:'Select all rows',
 selectRow:'Select row',
 selected:'selected',
 sortAscending:'Sort ascending',
 sortDescending:'Sort descending',
 previous:'Previous',
 next:'Next',
 page:'Table pagination',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
 en: message_en,
 pt: {
 loading:'Carregando...',
 empty:'Nenhum registro encontrado.',
 selectAll:'Selecionar todos',
 selectRow:'Selecionar linha',
 selected:'selecionado(s)',
 sortAscending:'Ordenar crescente',
 sortDescending:'Ordenar decrescente',
 previous:'Anterior',
 next:'Próximo',
 page:'Paginação da tabela',
 },
};
/// **collab_i18n_end**

// =============================================================================
// TYPES
// =============================================================================
type SortDirection ='asc' |'desc';
type Align ='left' |'center' |'right';

interface ColumnDef {
 key: string;
 label: string;
 sortable: boolean;
 align: Align;
 width: string | null;
}

interface RowData {
 cells: Element[];
 index: number;
}

// =============================================================================
// COMPONENT
// =============================================================================
@customElement('groupviewtable--ml-data-table')
export class MlDataTableMolecule extends MoleculeAuraElement {
 private msg: MessageType = messages.en;

 // ===========================================================================
 // SLOT TAGS
 // ===========================================================================
 slotTags = ['Caption','TableHeader','TableBody','TableRow','TableHead','TableCell','TableFooter','Empty','Loading'];

 // ===========================================================================
 // PROPERTIES — From Contract
 // ===========================================================================

 /** Comma-separated selected row indices, e.g."0,2,5" */
 @propertyDataSource({ type: String })
 value ='';

 @propertyDataSource({ type: Boolean })
 selectable = false;

 /** Propagates is-editing attribute to all web components inside TableCell elements */
 @propertyDataSource({ type: Boolean, attribute:'is-editing' })
 isEditing = false;

 @propertyDataSource({ type: Number })
 page = 1;

 @propertyDataSource({ type: Number, attribute:'page-size' })
 pageSize = 0;

 @propertyDataSource({ type: Number, attribute:'total-items' })
 totalItems = 0;

 @propertyDataSource({ type: String })
 error ='';

 @propertyDataSource({ type: Boolean })
 disabled = false;

 @propertyDataSource({ type: Boolean })
 loading = false;

 // ===========================================================================
 // INTERNAL STATE
 // ===========================================================================
 @state() private sortKey: string | null = null;
 @state() private sortDirection: SortDirection ='asc';

 // ===========================================================================
 // LIFECYCLE
 // ===========================================================================
 createRenderRoot() { return this; }

 updated() {
 this.propagateIsEditing();
 }

 // ===========================================================================
 // IS-EDITING PROPAGATION
 // ===========================================================================
 private propagateIsEditing() {
 this.querySelectorAll('TableCell, tablecell').forEach(cell => {
 cell.querySelectorAll('*').forEach(el => {
 if (el.tagName.toLowerCase().includes('-')) {
 el.setAttribute('is-editing', this.isEditing ?'true' :'false');
 }
 });
 });
 }

 // ===========================================================================
 // PARSERS
 // ===========================================================================
 private parseColumns(): ColumnDef[] {
 const header = this.getSlot('TableHeader');
 if (!header) return [];
 return Array.from(header.querySelectorAll('TableHead')).map(el => ({
 key: el.getAttribute('key') ||'',
 label: el.innerHTML,
 sortable: el.hasAttribute('sortable'),
 align: (el.getAttribute('align') ||'left') as Align,
 width: el.getAttribute('width'),
 })).filter(c => c.key);
 }

 private parseBodyRows(): RowData[] {
 const body = this.getSlot('TableBody');
 if (!body) return [];
 return Array.from(body.querySelectorAll('TableRow')).map((row, index) => ({
 cells: Array.from(row.querySelectorAll('TableCell')),
 index,
 }));
 }

 private parseFooterRows(): Element[][] {
 const footer = this.getSlot('TableFooter');
 if (!footer) return [];
 return Array.from(footer.querySelectorAll('TableRow')).map(row =>
 Array.from(row.querySelectorAll('TableCell')));
 }

 private getSelectedSet(): Set<string> {
 if (!this.value) return new Set();
 return new Set(this.value.split(',').map(s => s.trim()).filter(Boolean));
 }

 // ===========================================================================
 // SORTING
 // ===========================================================================
 private getSortedRows(rows: RowData[], columns: ColumnDef[]): RowData[] {
 if (!this.sortKey) return rows;
 const colIndex = columns.findIndex(c => c.key === this.sortKey);
 if (colIndex < 0) return rows;
 return [...rows].sort((a, b) => {
 const aText = a.cells[colIndex]?.textContent?.trim() ??'';
 const bText = b.cells[colIndex]?.textContent?.trim() ??'';
 const aNum = parseFloat(aText.replace(/[^\d.-]/g,''));
 const bNum = parseFloat(bText.replace(/[^\d.-]/g,''));
 if (!isNaN(aNum) && !isNaN(bNum)) {
 return this.sortDirection ==='asc' ? aNum - bNum : bNum - aNum;
 }
 return this.sortDirection ==='asc'
 ? aText.localeCompare(bText, undefined, { sensitivity:'base' })
 : bText.localeCompare(aText, undefined, { sensitivity:'base' });
 });
 }

 // ===========================================================================
 // EVENT HANDLERS
 // ===========================================================================
 private handleSort(col: ColumnDef) {
 if (!col.sortable || this.disabled) return;
 if (this.sortKey === col.key) {
 this.sortDirection = this.sortDirection ==='asc' ?'desc' :'asc';
 } else {
 this.sortKey = col.key;
 this.sortDirection ='asc';
 }
 this.dispatchEvent(new CustomEvent('sort', {
 bubbles: true, composed: true,
 detail: { key: this.sortKey, direction: this.sortDirection },
 }));
 }

 private handleRowClick(index: number, event: Event) {
 if (this.disabled) return;
 if ((event.target as Element).closest('input[type="checkbox"]')) return;
 this.dispatchEvent(new CustomEvent('rowClick', {
 bubbles: true, composed: true,
 detail: { index },
 }));
 }

 private handleRowSelect(index: number, checked: boolean) {
 if (this.disabled) return;
 const sel = this.getSelectedSet();
 if (checked) sel.add(String(index));
 else sel.delete(String(index));
 this.value = Array.from(sel).join(',');
 this.dispatchEvent(new CustomEvent('change', {
 bubbles: true, composed: true,
 detail: { value: this.value },
 }));
 }

 private handleSelectAll(rows: RowData[], checked: boolean) {
 if (this.disabled) return;
 this.value = checked ? rows.map(r => String(r.index)).join(',') :'';
 this.dispatchEvent(new CustomEvent('change', {
 bubbles: true, composed: true,
 detail: { value: this.value },
 }));
 }

 private handlePageChange(newPage: number) {
 if (this.disabled) return;
 this.page = newPage;
 this.dispatchEvent(new CustomEvent('pageChange', {
 bubbles: true, composed: true,
 detail: { page: newPage },
 }));
 }

 // ===========================================================================
 // CLASS HELPERS
 // ===========================================================================
 private getThClasses(col: ColumnDef): string {
 const isActive = this.sortKey === col.key;
 return [
'px-4 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition',
 col.align ==='center' ?'text-center' : col.align ==='right' ?'text-right' :'text-left',
 isActive ?'ml-primary-text' :'ml-text-muted',
 col.sortable && !this.disabled
 ?'cursor-pointer select-none hover:ml-text'
 :'',
 ].filter(Boolean).join(' ');
 }

 private getTdClasses(align: Align, bold = false): string {
 return [
'px-4 py-3 text-sm ml-text',
 align ==='center' ?'text-center' : align ==='right' ?'text-right' :'text-left',
 bold ?'font-medium' :'',
 ].filter(Boolean).join(' ');
 }

 private getTrClasses(index: number, selected: Set<string>): string {
 const isSelected = selected.has(String(index));
 return [
'border-b ml-border transition-colors',
 isSelected ?'ml-primary-dim-bg' :'ml-surface-bg',
 !this.disabled ?'hover:ml-surface-dim-bg cursor-pointer' :'',
 ].filter(Boolean).join(' ');
 }

 // ===========================================================================
 // RENDER HELPERS
 // ===========================================================================
 private renderSortIcon(col: ColumnDef): TemplateResult {
 if (!col.sortable) return html``;
 const isActive = this.sortKey === col.key;
 const isDesc = isActive && this.sortDirection ==='desc';
 return html`
 <svg
 class="ml-1 h-3.5 w-3.5 inline-block flex-shrink-0 ${isActive ?'ml-primary-text' :'ml-text-muted'}"
 viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
 >
 ${isDesc
 ? html`<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>`
 : html`<path fill-rule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832l-3.71 3.938a.75.75 0 01-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clip-rule="evenodd"/>`}
 </svg>
 `;
 }

 private renderSkeleton(): TemplateResult {
 const cols = [0, 1, 2, 3];
 const rows = [0, 1, 2, 3, 4];
 return html`
 <div class="w-full overflow-hidden rounded-xl border ml-border animate-pulse">
 <div class="flex items-center gap-6 border-b ml-border ml-surface-dim-bg px-4 py-3">
 ${cols.map((_, i) => html`
 <div class="h-3 rounded ml-surface-dim-bg ${i === 0 ?'w-20' : i === 1 ?'w-32' : i === 2 ?'w-24' :'w-16'}"></div>
 `)}
 </div>
 ${rows.map(() => html`
 <div class="flex items-center gap-6 border-b ml-border ml-surface-bg px-4 py-3">
 ${cols.map((_, i) => html`
 <div class="h-3 rounded ml-surface-dim-bg ${i === 0 ?'w-24' : i === 1 ?'w-40' : i === 2 ?'w-20' :'w-12'}"></div>
 `)}
 </div>
 `)}
 </div>
 `;
 }

 private renderEmpty(): TemplateResult {
 const content = this.hasSlot('Empty') ? this.getSlotContent('Empty') : this.msg.empty;
 return html`
 <tr>
 <td colspan="999">
 <div class="flex flex-col items-center justify-center py-14 ml-text-faint">
 <svg class="mb-3 h-10 w-10 ml-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
 <path stroke-linecap="round" stroke-linejoin="round"
 d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375z"
 />
 </svg>
 <p class="text-sm">${unsafeHTML(content)}</p>
 </div>
 </td>
 </tr>
 `;
 }

 private renderPagination(totalPages: number): TemplateResult {
 if (this.pageSize <= 0 || totalPages <= 1) return html``;
 const current = this.page;

 // Build page list with ellipsis markers (-1)
 const visible = new Set<number>();
 visible.add(1);
 visible.add(totalPages);
 for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
 visible.add(i);
 }
 const sorted = Array.from(visible).sort((a, b) => a - b);
 const withEllipsis: number[] = [];
 for (let i = 0; i < sorted.length; i++) {
 if (i > 0 && sorted[i] - sorted[i - 1] > 1) withEllipsis.push(-1);
 withEllipsis.push(sorted[i]);
 }

 const btnBase ='flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 text-sm transition';

 return html`
 <nav class="mt-4 flex items-center justify-end gap-1" role="navigation" aria-label=${this.msg.page}>
 <button
 class="${btnBase} ml-text-muted hover:ml-surface-dim-bg disabled:opacity-40 disabled:cursor-not-allowed"
 ?disabled=${current <= 1 || this.disabled}
 aria-label=${this.msg.previous}
 @click=${() => this.handlePageChange(current - 1)}
 >
 <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
 <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd"/>
 </svg>
 </button>

 ${withEllipsis.map(p => p === -1
 ? html`<span class="flex h-8 w-8 items-center justify-center text-sm ml-text-faint select-none">…</span>`
 : html`
 <button
 class="${btnBase} ${p === current
 ?'ml-primary-bg font-semibold'
 :'ml-text-muted hover:ml-surface-dim-bg'}"
 ?disabled=${this.disabled}
 aria-current=${p === current ?'page' : nothing}
 @click=${() => this.handlePageChange(p)}
 >${p}</button>
 `)}

 <button
 class="${btnBase} ml-text-muted hover:ml-surface-dim-bg disabled:opacity-40 disabled:cursor-not-allowed"
 ?disabled=${current >= totalPages || this.disabled}
 aria-label=${this.msg.next}
 @click=${() => this.handlePageChange(current + 1)}
 >
 <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
 <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd"/>
 </svg>
 </button>
 </nav>
 `;
 }

 // ===========================================================================
 // RENDER
 // ===========================================================================
 render() {
 const lang = this.getMessageKey(messages);
 this.msg = messages[lang];

 const caption = this.hasSlot('Caption') ? this.getSlotContent('Caption') :'';

 // Loading state
 if (this.loading) {
 return html`
 <div class="${cn('w-full', this.cssClass)}">
 ${caption ? html`<div class="${cn('mb-3 text-sm font-semibold ml-text', this.getSlotClass('Caption'))}">${unsafeHTML(caption)}</div>` : nothing}
 ${this.hasSlot('Loading')
 ? unsafeHTML(this.getSlotContent('Loading'))
 : this.renderSkeleton()}
 </div>
 `;
 }

 const columns = this.parseColumns();
 const rawRows = this.parseBodyRows();
 const footerRows = this.parseFooterRows();
 const sortedRows = this.getSortedRows(rawRows, columns);
 const selected = this.getSelectedSet();
 const allSelected = sortedRows.length > 0 && sortedRows.every(r => selected.has(String(r.index)));
 const someSelected = !allSelected && sortedRows.some(r => selected.has(String(r.index)));
 const totalPages = this.pageSize > 0 ? Math.ceil(this.totalItems / this.pageSize) : 0;

 return html`
 <div class="${cn('w-full', this.disabled ?'opacity-60 pointer-events-none' :'', this.cssClass)}">

 ${caption ? html`<div class="${cn('mb-3 text-sm font-semibold ml-text', this.getSlotClass('Caption'))}">${unsafeHTML(caption)}</div>` : nothing}

 ${this.selectable && selected.size > 0 ? html`
 <div class="mb-2 flex items-center gap-2">
 <span class="inline-flex items-center rounded-full ml-primary-dim-bg px-2.5 py-0.5 text-xs font-semibold ml-primary-text">
 ${selected.size} ${this.msg.selected}
 </span>
 </div>
 ` : nothing}

 <div class="w-full overflow-x-auto rounded-xl border ml-border">
 <table class="w-full border-collapse text-sm" role="table">

 ${caption ? html`<caption class="sr-only">${unsafeHTML(caption)}</caption>` : nothing}

 <!-- HEAD -->
 <thead class="${cn('border-b ml-border ml-surface-dim-bg', this.getSlotClass('TableHeader'))}" role="rowgroup">
 <tr role="row">
 ${this.selectable ? html`
 <th class="w-10 px-4 py-3" scope="col" role="columnheader">
 <input
 type="checkbox"
 class="h-4 w-4 rounded ml-border ml-primary-text cursor-pointer"
 .checked=${allSelected}
 .indeterminate=${someSelected}
 ?disabled=${this.disabled}
 aria-label=${this.msg.selectAll}
 @change=${(e: Event) => this.handleSelectAll(sortedRows, (e.target as HTMLInputElement).checked)}
 />
 </th>
 ` : nothing}

 ${columns.map(col => html`
 <th
 class=${this.getThClasses(col)}
 style=${col.width ? `width:${col.width}` :''}
 scope="col"
 role="columnheader"
 tabindex=${col.sortable ?'0' : nothing}
 aria-sort=${col.sortable && this.sortKey === col.key
 ? (this.sortDirection ==='asc' ?'ascending' :'descending')
 : nothing}
 @click=${() => this.handleSort(col)}
 @keydown=${(e: KeyboardEvent) => {
 if (e.key ==='Enter' || e.key ==='') { e.preventDefault(); this.handleSort(col); }
 }}
 >
 <span class="inline-flex items-center">
 ${unsafeHTML(col.label)}
 ${this.renderSortIcon(col)}
 </span>
 </th>
 `)}
 </tr>
 </thead>

 <!-- BODY -->
 <tbody role="rowgroup">
 ${sortedRows.length === 0
 ? this.renderEmpty()
 : sortedRows.map(row => html`
 <tr
 class=${this.getTrClasses(row.index, selected)}
 role="row"
 aria-selected=${this.selectable ? (selected.has(String(row.index)) ?'true' :'false') : nothing}
 @click=${(e: Event) => this.handleRowClick(row.index, e)}
 >
 ${this.selectable ? html`
 <td class="w-10 px-4 py-3" role="cell" @click=${(e: Event) => e.stopPropagation()}>
 <input
 type="checkbox"
 class="h-4 w-4 rounded ml-border ml-primary-text cursor-pointer"
 .checked=${selected.has(String(row.index))}
 ?disabled=${this.disabled}
 aria-label="${this.msg.selectRow} ${row.index + 1}"
 @change=${(e: Event) => this.handleRowSelect(row.index, (e.target as HTMLInputElement).checked)}
 />
 </td>
 ` : nothing}

 ${columns.map((col, ci) => html`
 <td class=${this.getTdClasses(col.align)} role="cell">
 ${unsafeHTML(row.cells[ci]?.innerHTML ??'')}
 </td>
 `)}
 </tr>
 `)
 }
 </tbody>

 <!-- FOOTER -->
 ${footerRows.length > 0 ? html`
 <tfoot class="${cn('border-t ml-border ml-surface-dim-bg', this.getSlotClass('TableFooter'))}" role="rowgroup">
 ${footerRows.map(cells => html`
 <tr role="row">
 ${this.selectable ? html`<td class="w-10 px-4 py-3" role="cell"></td>` : nothing}
 ${columns.map((col, ci) => html`
 <td class=${this.getTdClasses(col.align, true)} role="cell">
 ${unsafeHTML(cells[ci]?.innerHTML ??'')}
 </td>
 `)}
 </tr>
 `)}
 </tfoot>
 ` : nothing}

 </table>
 </div>

 ${this.renderPagination(totalPages)}

 ${this.error ? html`
 <p class="mt-2 text-xs ml-error-text">${this.error}</p>
 ` : nothing}

 </div>
 `;
 }
}
