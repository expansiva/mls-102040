/// <mls fileReference="_102040_/l2/molecules/groupviewtable/ml-data-table-select.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// GROUPVIEWTABLE – ML DATA TABLE SELECT MOLECULE
// =============================================================================
// Skill Group: groupViewTable (data display)
// This molecule does NOT contain business logic.

import { html, nothing, TemplateResult, } from'lit';
import { unsafeHTML } from'lit/directives/unsafe-html.js';
import { customElement, state } from'lit/decorators.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
 placeholder:'Select an option',
 noResults:'No results found',
 loading:'Loading...',
 selectAll:'Select all rows',
 selectRow: (i: number) => `Select row ${i}`,
 pagePrev:'Previous page',
 pageNext:'Next page',
 error:'Error',
};

type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
 en: message_en,
 // Add other locales as needed
};
/// **collab_i18n_end**

@customElement('groupviewtable--ml-data-table-select')
export class MlDataTableSelectMolecule extends MoleculeAuraElement {
 private msg: MessageType = messages.en;
 private readonly uid = `dts-${Math.random().toString(36).slice(2)}`;

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
 @propertyDataSource({ type: Boolean, attribute:'selectable' })
 selectable = false;

 /**'single' — radio buttons, max 1 row.'multi' (default) — checkboxes, N rows. */
 @propertyDataSource({ type: String, attribute:'select-mode' })
 selectMode: string ='multi';

 @propertyDataSource({ type: Boolean, attribute:'is-editing' })
 isEditing = false;

 @propertyDataSource({ type: Number })
 page = 1; // 1‑based

 @propertyDataSource({ type: Number })
 pageSize = 0; // 0 = no pagination

 @propertyDataSource({ type: Number })
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
 this.propagateEditing();
 }

 // ===========================================================================
 // STATE CHANGE HANDLER – needed for isEditing propagation
 // ===========================================================================
 handleIcaStateChange(key: string, value: any) {
 const isEditingAttr = this.getAttribute('is-editing');
 if (isEditingAttr === `{{${key}}}`) {
 this.isEditing = Boolean(value);
 this.propagateEditing();
 }
 this.requestUpdate();
 }

 // ===========================================================================
 // HELPERS – Selection handling
 // ===========================================================================
 private getSelectedSet(): Set<number> {
 if (!this.value) return new Set();
 return new Set(this.value.split(',').map(v => Number(v)).filter(v => !Number.isNaN(v)));
 }

 private updateValueFromSet(set: Set<number>) {
 const arr = Array.from(set).sort((a, b) => a - b);
 this.value = arr.join(',');
 this.dispatchEvent(
 new CustomEvent('change', {
 bubbles: true,
 composed: true,
 detail: { value: this.value },
 })
 );
 }

 // ===========================================================================
 // HELPERS – Editing propagation
 // ===========================================================================
 private propagateEditing() {
 const body = this.getSlot('TableBody');
 if (!body) return;
 const customEls = body.querySelectorAll('*');
 customEls.forEach(el => {
 if (el.tagName.includes('-')) {
 el.setAttribute('is-editing', String(this.isEditing));
 }
 });
 }

 // ===========================================================================
 // HELPERS – Sorting
 // ===========================================================================
 private handleHeaderClick(e: Event) {
 const target = e.currentTarget as HTMLElement;
 const key = target.getAttribute('data-key');
 if (!key) return;
 if (this.sortKey === key) {
 this.sortDirection = this.sortDirection ==='asc' ?'desc' :'asc';
 } else {
 this.sortKey = key;
 this.sortDirection ='asc';
 }
 this.dispatchEvent(
 new CustomEvent('sort', {
 bubbles: true,
 composed: true,
 detail: { key: this.sortKey, direction: this.sortDirection },
 })
 );
 this.requestUpdate();
 }

 private getSortedRows(rows: HTMLElement[]): HTMLElement[] {
 if (!this.sortKey) return rows;
 const headerCells = this.getHeaderCells();
 const colIndex = headerCells.findIndex(h => h.getAttribute('key') === this.sortKey);
 if (colIndex === -1) return rows;
 return rows.slice().sort((a, b) => {
 const aCell = a.querySelectorAll('TableCell')[colIndex];
 const bCell = b.querySelectorAll('TableCell')[colIndex];
 const aText = aCell?.textContent?.trim() ??'';
 const bText = bCell?.textContent?.trim() ??'';
 const cmp = aText.localeCompare(bText, undefined, { numeric: true, sensitivity:'base' });
 return this.sortDirection ==='asc' ? cmp : -cmp;
 });
 }

 // ===========================================================================
 // HELPERS – Header cells extraction
 // ===========================================================================
 private getHeaderCells(): HTMLElement[] {
 const header = this.getSlot('TableHeader');
 if (!header) return [];
 const headRow = header.querySelector('TableRow');
 if (!headRow) return [];
 return Array.from(headRow.querySelectorAll('TableHead')) as HTMLElement[];
 }

 // ===========================================================================
 // HELPERS – Pagination
 // ===========================================================================
 private getTotalPages(): number {
 if (this.pageSize <= 0) return 1;
 const total = this.totalItems > 0 ? this.totalItems : this.getAllRows().length;
 return Math.max(1, Math.ceil(total / this.pageSize));
 }

 private handlePageClick(newPage: number) {
 if (newPage < 1 || newPage > this.getTotalPages()) return;
 this.page = newPage;
 this.dispatchEvent(
 new CustomEvent('pageChange', {
 bubbles: true,
 composed: true,
 detail: { page: this.page },
 })
 );
 this.requestUpdate();
 }

 // ===========================================================================
 // HELPERS – Row click & selection
 // ===========================================================================
 private handleRowClick(index: number) {
 this.dispatchEvent(
 new CustomEvent('rowClick', {
 bubbles: true,
 composed: true,
 detail: { index },
 })
 );
 }

 private handleRowCheckboxChange(e: Event, index: number) {
 const checked = (e.target as HTMLInputElement).checked;
 const selected = this.getSelectedSet();
 if (checked) {
 selected.add(index);
 } else {
 selected.delete(index);
 }
 this.updateValueFromSet(selected);
 }

 private handleSelectAllChange(e: Event) {
 const checked = (e.target as HTMLInputElement).checked;
 const rows = this.getAllRows();
 const selected = new Set<number>();
 if (checked) {
 rows.forEach((_, idx) => selected.add(idx));
 }
 this.updateValueFromSet(selected);
 }

 private handleRowRadioChange(index: number) {
 this.updateValueFromSet(new Set([index]));
 }

 // ===========================================================================
 // HELPERS – Row collection (raw order before pagination/sort)
 // ===========================================================================
 private getAllRows(): HTMLElement[] {
 const body = this.getSlot('TableBody');
 if (!body) return [];
 return Array.from(body.querySelectorAll('TableRow')) as HTMLElement[];
 }

 // ===========================================================================
 // RENDERING HELPERS
 // ===========================================================================
 private getTableClasses(): string {
 return [
'w-full border-collapse',
 this.disabled ?'ml-disabled' :'',
 ]
 .filter(Boolean)
 .join(' ');
 }

 private getHeaderClasses(): string {
 return [
'ml-surface-bg',
'border-b ml-border',
 ]
 .filter(Boolean)
 .join(' ');
 }

 private getCellClasses(isHeader = false): string {
 const base = [
'px-4 py-2 text-sm',
'border ml-border',
 isHeader ?'font-medium ml-text-muted' :'ml-text',
 ];
 return base.filter(Boolean).join(' ');
 }

 private renderSortIndicator(key: string): TemplateResult {
 if (this.sortKey !== key) return html``;
 const arrow = this.sortDirection ==='asc' ?'▲' :'▼';
 return html`<span class="ml-1 text-xs">${arrow}</span>`;
 }

 private renderHeader(): TemplateResult {
 const heads = this.getHeaderCells();
 const selectable = this.selectable;
 const isSingle = this.selectMode ==='single';
 return html`
 <thead class="${this.getHeaderClasses()}">
 <tr>
 ${selectable
 ? isSingle
 ? html`<th class="${this.getCellClasses(true)}"></th>`
 : html`<th class="${this.getCellClasses(true)}">
 <input
 type="checkbox"
 ?disabled="${this.disabled}"
 aria-label="${this.msg.selectAll}"
 @change="${(e: Event) => this.handleSelectAllChange(e)}"
 />
 </th>`
 : nothing}
 ${heads.map(head => {
 const key = head.getAttribute('key') ??'';
 const sortable = head.hasAttribute('sortable');
 const ariaSort = sortable
 ? this.sortKey === key
 ? this.sortDirection ==='asc' ?'ascending' :'descending'
 :'none'
 : undefined;
 return html`<th
 class="${this.getCellClasses(true)} ${sortable ?'cursor-pointer' :''}"
 data-key="${key}"
 ?disabled="${this.disabled}"
 aria-sort="${ariaSort ?? nothing}"
 @click="${sortable ? (e: Event) => this.handleHeaderClick(e) : nothing}"
 >
 ${unsafeHTML(head.innerHTML)}
 ${sortable ? this.renderSortIndicator(key) : nothing}
 </th>`;
 })}
 </tr>
 </thead>
 `;
 }

 private renderBody(): TemplateResult {
 const rawRows = this.getAllRows();
 const sortedRows = this.getSortedRows(rawRows);
 const startIdx = this.pageSize > 0 ? (this.page - 1) * this.pageSize : 0;
 const endIdx = this.pageSize > 0 ? startIdx + this.pageSize : sortedRows.length;
 const pagedRows = sortedRows.slice(startIdx, endIdx);
 const selectedSet = this.getSelectedSet();
 const selectable = this.selectable;

 if (pagedRows.length === 0) {
 // Empty state
 const emptyContent = this.getSlotContent('Empty') || this.msg.noResults;
 return html`
 <tr>
 <td colspan="${selectable ? this.getHeaderCells().length + 1 : this.getHeaderCells().length}" class="${this.getCellClasses()}">
 ${unsafeHTML(emptyContent)}
 </td>
 </tr>
 `;
 }

 const isSingle = this.selectMode ==='single';
 return html`
 ${pagedRows.map((rowEl) => {
 const globalIdx = rawRows.indexOf(rowEl); // original index before pagination/sort
 const cells = Array.from(rowEl.querySelectorAll('TableCell')) as HTMLElement[];
 const isSelected = selectedSet.has(globalIdx);
 const rowClasses = [
 isSelected ?'ml-primary-dim-bg' :'ml-surface-bg',
'hover:ml-surface-dim-bg',
 this.disabled ?'ml-disabled' :'cursor-pointer',
 ]
 .filter(Boolean)
 .join(' ');
 return html`
 <tr
 class="${rowClasses}"
 @click="${() => {
 if (this.disabled) return;
 if (!this.selectable) this.handleRowClick(globalIdx);
 }}"
 >
 ${selectable
 ? isSingle
 ? html`<td class="${this.getCellClasses()}">
 <input
 type="radio"
 name="${this.uid}"
 ?disabled="${this.disabled}"
 .checked="${isSelected}"
 aria-label="${this.msg.selectRow(globalIdx)}"
 @click="${(e: Event) => e.stopPropagation()}"
 @change="${() => this.handleRowRadioChange(globalIdx)}"
 />
 </td>`
 : html`<td class="${this.getCellClasses()}">
 <input
 type="checkbox"
 ?disabled="${this.disabled}"
 .checked="${isSelected}"
 aria-label="${this.msg.selectRow(globalIdx)}"
 @click="${(e: Event) => e.stopPropagation()}"
 @change="${(e: Event) => this.handleRowCheckboxChange(e, globalIdx)}"
 />
 </td>`
 : nothing}
 ${cells.map(cell => html`
 <td class="${this.getCellClasses()}">
 ${unsafeHTML(cell.innerHTML)}
 </td>`)}
 </tr>`;
 })}
 `;
 }

 private renderPagination(): TemplateResult {
 const totalPages = this.getTotalPages();
 if (totalPages <= 1) return html``;
 const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
 return html`
 <nav class="flex items-center space-x-2 mt-2" aria-label="Table pagination">
 <button
 class="px-2 py-1 border rounded ${this.disabled ?'ml-disabled' :''}"
 ?disabled="${this.disabled || this.page === 1}"
 @click="${() => this.handlePageClick(this.page - 1)}"
 >${this.msg.pagePrev}</button>
 ${pages.map(p => html`
 <button
 class="px-2 py-1 border rounded ${p === this.page ?'ml-primary-dim-bg' :''} ${this.disabled ?'ml-disabled' :''}"
 ?disabled="${this.disabled}"
 @click="${() => this.handlePageClick(p)}"
 >${p}</button>`)}
 <button
 class="px-2 py-1 border rounded ${this.disabled ?'ml-disabled' :''}"
 ?disabled="${this.disabled || this.page === totalPages}"
 @click="${() => this.handlePageClick(this.page + 1)}"
 >${this.msg.pageNext}</button>
 </nav>
 `;
 }

 private renderFooter(): TemplateResult {
 const footer = this.getSlot('TableFooter');
 if (!footer) return html``;
 const rows = Array.from(footer.querySelectorAll('TableRow')) as HTMLElement[];
 if (rows.length === 0) return html``;
 return html`
 <tfoot class="${cn('border-t-2 ml-border', this.getSlotClass('TableFooter'))}">
 ${rows.map(rowEl => {
 const cells = Array.from(rowEl.querySelectorAll('TableCell')) as HTMLElement[];
 return html`
 <tr class="ml-surface-dim-bg">
 ${this.selectable ? html`<td class="${this.getCellClasses()}"></td>` : nothing}
 ${cells.map(cell => html`
 <td class="${this.getCellClasses()} font-semibold">
 ${unsafeHTML(cell.innerHTML)}
 </td>`)}
 </tr>`;
 })}
 </tfoot>
 `;
 }

 private renderError(): TemplateResult {
 if (!this.error) return html``;
 return html`
 <p class="mt-2 text-sm ml-error-text">
 ${unsafeHTML(this.error)}
 </p>
 `;
 }

 // ===========================================================================
 // MAIN RENDER
 // ===========================================================================
 render() {
 const lang = this.getMessageKey(messages);
 this.msg = messages[lang];

 // Loading state
 if (this.loading) {
 const loadingContent = this.getSlotContent('Loading') || this.msg.loading;
 return html`
 <div class="${cn('p-4', this.cssClass)}">
 ${unsafeHTML(loadingContent)}
 </div>
 `;
 }

 // Caption (optional)
 const captionContent = this.getSlotContent('Caption');
 const caption = captionContent
 ? html`<caption class="${cn('text-left font-medium mb-2', this.getSlotClass('Caption'))}">${unsafeHTML(captionContent)}</caption>`
 : nothing;

 return html`
 <div class="${cn('overflow-x-auto', this.cssClass)}">
 <table class="${this.getTableClasses()}" role="table">
 ${caption}
 ${this.renderHeader()}
 <tbody role="rowgroup">
 ${this.renderBody()}
 </tbody>
 ${this.renderFooter()}
 </table>
 ${this.pageSize > 0 ? this.renderPagination() : nothing}
 ${this.renderError()}
 </div>
 `;
 }
}
