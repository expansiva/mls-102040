/// <mls fileReference="_102040_/l2/molecules/groupselectmany/ml-table-multi-select.ts" enhancement="_blank"/>
// =============================================================================
// GROUPSELECTMANY – ML TABLE MULTI SELECT MOLECULE
// =============================================================================
// Skill Group: groupSelectMany (multi‑select table variant)
// This molecule does NOT contain business logic – it only renders UI.
import { html, nothing, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';
/// **collab_i18n_start**
const message_en = {
placeholder: 'No items selected',
noResults: 'No results found',
loading: 'Loading...',
selectedCount: 'selected',
requiredError: 'Select at least one option',
minSelectionError: 'Select at least {min} options',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
pt: {
placeholder: 'Nenhum item selecionado',
noResults: 'Nenhum resultado encontrado',
loading: 'Carregando...',
selectedCount: 'selecionado(s)',
requiredError: 'Selecione pelo menos uma opção',
minSelectionError: 'Selecione pelo menos {min} opções',
},
};
/// **collab_i18n_end**
@customElement('groupselectmany--ml-table-multi-select')
export class MlTableMultiSelectMolecule extends MoleculeAuraElement {
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
// PROPERTIES – data contract
// ---------------------------------------------------------------------------
@propertyDataSource({ type: String })
value: string = '';
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
@propertyDataSource({ type: Boolean })
required: boolean = false;
@propertyDataSource({ type: Number, attribute: 'min-selection' })
minSelection: number = 0;
@propertyDataSource({ type: Number, attribute: 'max-selection' })
maxSelection: number = 0;
// ---------------------------------------------------------------------------
// CONFIGURATION PROPERTIES
// ---------------------------------------------------------------------------
@propertyDataSource({ type: String })
placeholder: string = '';
@propertyDataSource({ type: Boolean, attribute: 'searchable' })
searchable: boolean = false;
// ---------------------------------------------------------------------------
// STATE PROPERTIES
// ---------------------------------------------------------------------------
@state()
private searchQuery: string = '';
// ---------------------------------------------------------------------------
// HELPERS – selection
// ---------------------------------------------------------------------------
private getSelectedSet(): Set<string> {
if (!this.value) return new Set();
return new Set(this.value.split(',').map(v => v.trim()).filter(Boolean));
}
private updateValueFromSet(set: Set<string>) {
this.value = Array.from(set).join(',');
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value },
}));
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
// ---------------------------------------------------------------------------
// VALIDATION
// ---------------------------------------------------------------------------
private getComputedError(): string {
if (this.error) return this.error;
const count = this.getSelectedSet().size;
if (this.required && count === 0) return this.msg.requiredError;
if (this.minSelection > 0 && count < this.minSelection) {
return this.msg.minSelectionError.replace('{min}', String(this.minSelection));
}
return '';
}
// ---------------------------------------------------------------------------
// EVENT HANDLERS
// ---------------------------------------------------------------------------
private handleRowToggle(item: { value: string; disabled: boolean }) {
if (this.disabled || this.readonly || item.disabled) return;
const selected = this.getSelectedSet();
const isSelected = selected.has(item.value);
const maxReached = this.maxSelection > 0 && selected.size >= this.maxSelection;
if (!isSelected && maxReached) return;
if (isSelected) {
selected.delete(item.value);
} else {
selected.add(item.value);
}
this.updateValueFromSet(selected);
}
private handleSelectAll(e: Event) {
e.stopPropagation();
if (this.disabled || this.readonly) return;
const checked = (e.target as HTMLInputElement).checked;
const items = this.getFilteredItems();
const selected = this.getSelectedSet();
if (checked) {
for (const item of items) {
if (!item.disabled) {
if (this.maxSelection > 0 && selected.size >= this.maxSelection) break;
selected.add(item.value);
}
}
} else {
for (const item of items) {
selected.delete(item.value);
}
}
this.updateValueFromSet(selected);
}
private handleSearchInput(e: Event) {
e.stopPropagation();
const input = e.target as HTMLInputElement;
this.searchQuery = input.value;
}
private handleBlur() {
this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
}
private handleFocus() {
this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
}
// ---------------------------------------------------------------------------
// RENDER HELPERS – CSS class builders
// ---------------------------------------------------------------------------
private getTableClasses(): string {
return [
'w-full border-collapse ml-table-row',
].join(' ');
}
private getHeaderCellClasses(): string {
return [
'px-3 py-2 text-left text-sm font-medium ml-table-header',
].join(' ');
}
private getRowClasses(item: { disabled: boolean }, isSelected: boolean): string {
return [
'cursor-pointer ml-table-row',
isSelected ? 'ml-table-row-selected' : '',
item.disabled ? 'ml-disabled' : 'ml-table-row-hover',
].filter(Boolean).join(' ');
}
private getCellClasses(): string {
return [
'px-3 py-2 text-sm ml-table-cell',
].join(' ');
}
private getInputClasses(): string {
return [
'w-full rounded-md px-3 py-2 text-sm border transition ml-table-search',
'focus:outline-none',
this.disabled ? 'ml-disabled' : '',
].filter(Boolean).join(' ');
}
// ---------------------------------------------------------------------------
// RENDER
// ---------------------------------------------------------------------------
private renderLoading(): TemplateResult {
return html`<div class="text-sm ml-text-muted">${this.msg.loading}</div>`;
}
private renderHelperOrError(): TemplateResult {
const errorMessage = this.getComputedError();
if (errorMessage) {
return html`<p class="mt-1 text-xs ml-error-text">${unsafeHTML(errorMessage)}</p>`;
}
if (this.hasSlot('Helper')) {
return html`<p class="${cn('mt-1 text-xs ml-helper', this.getSlotClass('Helper'))}">${unsafeHTML(this.getSlotContent('Helper'))}</p>`;
}
return html``;
}
private renderEmpty(): TemplateResult {
const content = this.getSlotContent('Empty') || this.msg.noResults;
return html`<div class="${cn('p-4 text-center ml-text-muted', this.getSlotClass('Empty'))}">${unsafeHTML(content)}</div>`;
}
private renderViewMode(): TemplateResult {
const selectedSet = this.getSelectedSet();
if (selectedSet.size === 0) {
const placeholder = this.placeholder || this.msg.placeholder;
return html`<div class="ml-text-muted">${placeholder}</div>`;
}
const items = this.getItems().filter(i => selectedSet.has(i.value));
return html`
<div class="space-y-1">
${items.map((item) => html`
<div class="ml-text">
${item.cells.map((c, i) => html`${i > 0 ? html` — ` : nothing}${unsafeHTML(c)}`)}
</div>
`)}
</div>
`;
}
private renderTable(): TemplateResult {
const items = this.getFilteredItems();
const headers = this.getHeaders();
const hasHeaders = headers.length > 0;
const selectedSet = this.getSelectedSet();
const enabledItems = items.filter(i => !i.disabled);
const allSelected = enabledItems.length > 0 && enabledItems.every(i => selectedSet.has(i.value));
const someSelected = enabledItems.some(i => selectedSet.has(i.value));
const maxReached = this.maxSelection > 0 && selectedSet.size >= this.maxSelection;
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
<th class="${this.getHeaderCellClasses()}">
<input
type="checkbox"
.checked=${allSelected}
.indeterminate=${someSelected && !allSelected}
?disabled=${this.disabled || this.readonly}
@change=${this.handleSelectAll}

@input=${(e: Event) => e.stopPropagation()}
/>
</th>
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
const isSelected = selectedSet.has(item.value);
const isDisabled = item.disabled || (!isSelected && maxReached);
return html`
<tr
class="${this.getRowClasses({ disabled: isDisabled }, isSelected)}"
@click=${() => !isDisabled && this.handleRowToggle(item)}
>
<td class="${this.getCellClasses()}">
<input
type="checkbox"
.checked=${isSelected}
?disabled=${isDisabled || this.disabled || this.readonly}
@click=${(e: Event) => e.stopPropagation()}
@change=${(e: Event) => { e.stopPropagation(); this.handleRowToggle(item); }}

@input=${(e: Event) => e.stopPropagation()}
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
const lang = this.getMessageKey(messages);
this.msg = messages[lang];
if (this.loading) {
return html`<div class="p-2">${this.renderLoading()}</div>`;
}
if (!this.isEditing) {
return html`
<div class="groupselectmany--ml-table-multi-select-view">
${this.renderViewMode()}
</div>
`;
}
return html`
<div class="${cn('groupselectmany--ml-table-multi-select', this.cssClass)}">
${this.hasSlot('Label')
? html`<label class="${cn('block mb-1 text-sm font-medium ml-label', this.getSlotClass('Label'))}">
${unsafeHTML(this.getSlotContent('Label'))}
</label>`
: nothing}
${this.renderTable()}
</div>
`;
}
}
