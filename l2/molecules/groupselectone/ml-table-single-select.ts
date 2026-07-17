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
import { cn } from '/_102033_/l2/cn.js';
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
e.stopPropagation();
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
'border ml-table-border',
].join(' ');
}
private getHeaderCellClasses(): string {
return [
'px-3 py-2 text-left text-sm font-medium',
'ml-table-header',
'border-b',
].join(' ');
}
private getRowClasses(item: { value: string; disabled: boolean }, isSelected: boolean): string {
return [
'cursor-pointer',
isSelected
? 'ml-table-row-selected'
: 'ml-table-row',
item.disabled ? 'ml-disabled' : 'ml-table-row-hover',
]
.filter(Boolean)
.join(' ');
}
private getCellClasses(): string {
return [
'px-3 py-2 text-sm',
'border-b ml-table-cell',
].join(' ');
}
private getInputClasses(): string {
return [
'w-full rounded-md px-3 py-2 text-sm border transition',
'ml-table-search',
this.disabled
? 'ml-disabled'
: '',
'focus:outline-none focus:ring-2',
].filter(Boolean).join(' ');
}
// ---------------------------------------------------------------------------
// RENDER – loading, view mode, editing mode
// ---------------------------------------------------------------------------
private renderLoading(): TemplateResult {
return html`<div class="text-sm ml-text-muted">${this.msg.loading}</div>`;
}
private renderHelperOrError(): TemplateResult {
if (this.error) {
return html`<p class="mt-1 text-xs ml-error-text">${unsafeHTML(this.error)}</p>`;
}
if (this.hasSlot('Helper')) {
return html`<p class=${cn('mt-1 text-xs ml-helper', this.getSlotClass('Helper'))}>${unsafeHTML(this.getSlotContent('Helper'))}</p>`;
}
return html``;
}
private renderEmpty(): TemplateResult {
const content = this.getSlotContent('Empty') || this.msg.noResults;
return html`<div class=${cn('p-4 text-center ml-text-muted', this.getSlotClass('Empty'))}>${unsafeHTML(content)}</div>`;
}
private renderViewMode(): TemplateResult {
const selected = this.findItem(this.value);
if (!selected) {
const placeholder = this.placeholder || '—';
return html`<div class="ml-text-muted">${placeholder}</div>`;
}
// Render cells as a simple vertical list
return html`
<div class="space-y-1">
${selected.cells.map((c) => html`<div class="ml-text">${unsafeHTML(c)}</div>`)}
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

@change="${(e: Event) => e.stopPropagation()}"
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

@input="${(e: Event) => e.stopPropagation()}"

@change="${(e: Event) => e.stopPropagation()}"
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
return html`<div class=${cn('p-2', this.cssClass)}>${this.renderLoading()}</div>`;
}
// View mode – static representation
if (!this.isEditing) {
return html`
<div class=${cn('groupselectone--ml-table-single-select-view', this.cssClass)}>
${this.renderViewMode()}
</div>
`;
}
// Editing mode – render label, table (or empty), helper/error
return html`
<div class=${cn('groupselectone--ml-table-single-select', this.cssClass)}>
${this.hasSlot('Label')
? html`<label class=${cn('block mb-1 text-sm font-medium ml-label', this.getSlotClass('Label'))}>
${unsafeHTML(this.getSlotContent('Label'))}
</label>`
: nothing}
${this.renderTable()}
</div>
`;
}
}
