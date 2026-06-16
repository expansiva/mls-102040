/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-table-single-select.ts" enhancement="_blank"/>
// =============================================================================
// GROUPSELECTONE – ML TABLE SINGLE SELECT MOLECULE
// =============================================================================
// Skill Group: groupSelectOne (single‑select table variant)
// This molecule does NOT contain business logic – it only renders UI.
import { html, nothing, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
/// **collab_i18n_start**
const message_en = {
placeholder: 'Select an option',
noResults: 'No results found',
loading: 'Loading...',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
// add other locales here if needed
};
/// **collab_i18n_end**
@customElement('groupselectone--ml-table-single-select')
export class MlTableSingleSelectMolecule extends MoleculeAuraElement {
// ---------------------------------------------------------------------------
// i18n
// ---------------------------------------------------------------------------
private msg: MessageType = messages.en;
// ---------------------------------------------------------------------------
// SLOT TAGS
// ---------------------------------------------------------------------------
slotTags = [
'Label',
'Helper',
'Trigger', // not used in table variant but kept for contract
'Item',
'Cell',
'Columns',
'Column',
'Group', // not used in table variant but kept for contract
'Empty',
];
// ---------------------------------------------------------------------------
// PROPERTIES – data contract (bound to global state)
// ---------------------------------------------------------------------------
@propertyDataSource({ type: String })
value: string | null = null;
@propertyDataSource({ type: String })
error: string = '';
@propertyDataSource({ type: String })
name: string = '';
@propertyDataSource({ type: Boolean })
disabled: boolean = false;
@propertyDataSource({ type: Boolean })
readonly: boolean = false;
@propertyDataSource({ type: Boolean })
loading: boolean = false;
@propertyDataSource({ type: Boolean })
isEditing: boolean = true;
// ---------------------------------------------------------------------------
// CONFIGURATION PROPERTIES
// ---------------------------------------------------------------------------
@propertyDataSource({ type: String, attribute: 'variant' })
variant: string = 'table'; // forced to table – kept for contract compatibility
@propertyDataSource({ type: String })
placeholder: string = '';
@propertyDataSource({ type: Boolean, attribute: 'searchable' })
searchable: boolean = false;
// ---------------------------------------------------------------------------
// STATE PROPERTIES – internal UI state
// ---------------------------------------------------------------------------
@state()
private isOpen: boolean = false; // not used for table, kept for contract
@state()
private searchQuery: string = '';
// ---------------------------------------------------------------------------
// INTERNAL – unique radio group name per instance
// ---------------------------------------------------------------------------
private static _uidCounter = 0;
private _uid: string;
constructor() {
super();
this._uid = `groupselectone-${MlTableSingleSelectMolecule._uidCounter++}`;
}
// ---------------------------------------------------------------------------
// HELPERS – parsing slot content
// ---------------------------------------------------------------------------
private getItems(): Array<{ value: string; disabled: boolean; cells: string[] }> {
const itemEls = this.getSlots('Item');
return itemEls.map((el) => {
const value = el.getAttribute('value') ?? '';
const disabled = el.hasAttribute('disabled');
const cellEls = Array.from(el.children).filter((c) =>
this.slotTags.map((t) => t.toUpperCase()).includes(c.tagName)
);
const cells = cellEls.map((c) => c.innerHTML.trim());
return { value, disabled, cells };
});
}
private getHeaders(): string[] {
const columnEls = this.getSlots('Column');
return columnEls.map((c) => c.textContent?.trim() ?? '');
}
private getFilteredItems(): Array<{ value: string; disabled: boolean; cells: string[] }> {
if (!this.searchable || !this.searchQuery) return this.getItems();
const q = this.searchQuery.toLowerCase();
return this.getItems().filter((item) =>
item.cells.some((cell) => cell.toLowerCase().includes(q))
);
}
private findItem(value: string | null): { value: string; disabled: boolean; cells: string[] } | null {
if (value === null) return null;
return this.getItems().find((i) => i.value === value) ?? null;
}
// ---------------------------------------------------------------------------
// EVENT HANDLERS
// ---------------------------------------------------------------------------
private handleRowSelect(item: { value: string; disabled: boolean }) {
if (this.disabled || this.readonly || item.disabled) return;
this.value = item.value;
this.dispatchEvent(
new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value },
})
);
}
private handleSearchInput(e: Event) {
const input = e.target as HTMLInputElement;
this.searchQuery = input.value;
}
private handleBlur() {
this.dispatchEvent(
new CustomEvent('blur', { bubbles: true, composed: true })
);
}
private handleFocus() {
this.dispatchEvent(
new CustomEvent('focus', { bubbles: true, composed: true })
);
}
// ---------------------------------------------------------------------------
// RENDER HELPERS – CSS class builders
// ---------------------------------------------------------------------------
private getTableClasses(): string {
return [
'w-full border-collapse',
'border border-slate-200 dark:border-slate-700',
].join(' ');
}
private getHeaderCellClasses(): string {
return [
'px-3 py-2 text-left text-sm font-medium',
'bg-slate-50 dark:bg-slate-900',
'text-slate-600 dark:text-slate-400',
'border-b border-slate-200 dark:border-slate-700',
].join(' ');
}
private getRowClasses(item: { value: string; disabled: boolean }, isSelected: boolean): string {
return [
'cursor-pointer',
isSelected
? 'bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border border-sky-500 dark:border-sky-400'
: 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100',
item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-slate-700',
]
.filter(Boolean)
.join(' ');
}
private getCellClasses(): string {
return [
'px-3 py-2 text-sm',
'border-b border-slate-200 dark:border-slate-700',
].join(' ');
}
private getInputClasses(): string {
return [
'w-full rounded-md px-3 py-2 text-sm border transition',
'bg-white dark:bg-slate-900',
'text-slate-900 dark:text-slate-100',
'placeholder:text-slate-400 dark:placeholder:text-slate-500',
this.disabled
? 'border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
: 'border-slate-200 dark:border-slate-700',
'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
].join(' ');
}
// ---------------------------------------------------------------------------
// RENDER – loading, view mode, editing mode
// ---------------------------------------------------------------------------
private renderLoading(): TemplateResult {
return html`<div class="text-sm text-slate-600 dark:text-slate-400">${this.msg.loading}</div>`;
}
private renderHelperOrError(): TemplateResult {
if (this.error) {
return html`<p class="mt-1 text-xs text-red-600 dark:text-red-400">${unsafeHTML(this.error)}</p>`;
}
if (this.hasSlot('Helper')) {
return html`<p class="mt-1 text-xs text-slate-500 dark:text-slate-400">${unsafeHTML(this.getSlotContent('Helper'))}</p>`;
}
return html``;
}
private renderEmpty(): TemplateResult {
const content = this.getSlotContent('Empty') || this.msg.noResults;
return html`<div class="p-4 text-center text-slate-500 dark:text-slate-400">${unsafeHTML(content)}</div>`;
}
private renderViewMode(): TemplateResult {
const selected = this.findItem(this.value);
if (!selected) {
const placeholder = this.placeholder || '—';
return html`<div class="text-slate-600 dark:text-slate-400">${placeholder}</div>`;
}
// Render cells as a simple vertical list
return html`
<div class="space-y-1">
${selected.cells.map((c) => html`<div class="text-slate-900 dark:text-slate-100">${unsafeHTML(c)}</div>`)}
</div>
`;
}
private renderTable(): TemplateResult {
const items = this.getFilteredItems();
const headers = this.getHeaders();
const hasHeaders = headers.length > 0;
const selectedValue = this.value;
return html`
${this.searchable
? html`
<input
type="text"
class="${this.getInputClasses()} mb-2"
placeholder="Search..."
.value=${this.searchQuery}
@input=${this.handleSearchInput}
@focus=${this.handleFocus}
@blur=${this.handleBlur}
/>
`
: nothing}
<table class="${this.getTableClasses()}">
${hasHeaders
? html`
<thead>
<tr>
<th class="${this.getHeaderCellClasses()}"></th>
${headers.map(
(h) => html`<th class="${this.getHeaderCellClasses()}">${unsafeHTML(h)}</th>`
)}
</tr>
</thead>
`
: nothing}
<tbody>
${items.length
? items.map((item) => {
const isSelected = item.value === selectedValue;
return html`
<tr
class="${this.getRowClasses(item, isSelected)}"
@click=${() => this.handleRowSelect(item)}
>
<td class="${this.getCellClasses()}">
<input
type="radio"
name="${this._uid}"
.checked=${isSelected}
?disabled=${item.disabled || this.disabled || this.readonly}
@click=${(e: Event) => e.stopPropagation()}
/>
</td>
${item.cells.map(
(c) => html`<td class="${this.getCellClasses()}">${unsafeHTML(c)}</td>`
)}
</tr>
`;
})
: html`<tr><td colspan="${hasHeaders ? headers.length + 1 : 1}" class="${this.getCellClasses()}">${this.renderEmpty()}</td></tr>`}
</tbody>
</table>
${this.renderHelperOrError()}
`;
}
render(): TemplateResult {
// i18n handling – pick language based on host attribute or fallback to 'en'
const lang = this.getMessageKey(messages);
this.msg = messages[lang];
// Loading state takes precedence
if (this.loading) {
return html`<div class="p-2">${this.renderLoading()}</div>`;
}
// View mode – static representation
if (!this.isEditing) {
return html`
<div class="groupselectone--ml-table-single-select-view">
${this.renderViewMode()}
</div>
`;
}
// Editing mode – render label, table (or empty), helper/error
return html`
<div class="groupselectone--ml-table-single-select">
${this.hasSlot('Label')
? html`<label class="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
${unsafeHTML(this.getSlotContent('Label'))}
</label>`
: nothing}
${this.renderTable()}
</div>
`;
}
}
