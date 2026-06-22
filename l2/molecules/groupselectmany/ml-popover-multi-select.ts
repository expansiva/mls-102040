/// <mls fileReference="_102040_/l2/molecules/groupselectmany/ml-popover-multi-select.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML POPOVER MULTI SELECT MOLECULE
// =============================================================================
// Skill Group: groupSelectMany
// This molecule does NOT contain business logic.
import { html, render as litRender, svg, TemplateResult, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
/// **collab_i18n_start**
const message_en = {
placeholder: 'Select options',
noResults: 'No results found',
loading: 'Loading...',
search: 'Search',
selected: 'selected',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
pt: {
placeholder: 'Selecione opções',
noResults: 'Nenhum resultado encontrado',
loading: 'Carregando...',
search: 'Buscar',
selected: 'selecionado',
},
};
/// **collab_i18n_end**
type ItemData = {
value: string;
labelHtml: string;
labelText: string;
disabled: boolean;
groupLabel?: string;
};
type GroupData = {
label: string;
items: ItemData[];
};
@customElement('groupselectmany--ml-popover-multi-select')
export class MlPopoverMultiSelectMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
// ===========================================================================
// SLOT TAGS
// ==========================================================================='
slotTags = ['Label', 'Helper', 'Trigger', 'Item', 'Group', 'Empty'];
// ===========================================================================
// PROPERTIES — From Contract
// ===========================================================================
@propertyDataSource({ type: String })
value: string = '';
@propertyDataSource({ type: String })
error: string = '';
@propertyDataSource({ type: String })
name: string = '';
@propertyDataSource({ type: String })
placeholder: string = '';
@propertyDataSource({ type: Boolean })
searchable: boolean = false;
@propertyDataSource({ type: Number, attribute: 'min-selection' })
minSelection: number = 0;
@propertyDataSource({ type: Number, attribute: 'max-selection' })
maxSelection: number = 0;
@propertyDataSource({ type: Boolean, attribute: 'is-editing' })
isEditing: boolean = true;
@propertyDataSource({ type: Boolean })
disabled: boolean = false;
@propertyDataSource({ type: Boolean })
readonly: boolean = false;
@propertyDataSource({ type: Boolean })
required: boolean = false;
@propertyDataSource({ type: Boolean })
loading: boolean = false;
// ===========================================================================
// INTERNAL STATE
// ==========================================================================='
@state()
private isOpen: boolean = false;
@state()
private searchQuery: string = '';
@state()
private activeIndex: number = -1;
private labelId = `ml-popover-multi-select-label-${Math.random().toString(36).slice(2)}`;
private errorId = `ml-popover-multi-select-error-${Math.random().toString(36).slice(2)}`;
private panelId = `ml-popover-multi-select-panel-${Math.random().toString(36).slice(2)}`;
private hasFocus = false;
protected portalContainer: HTMLDivElement | null = null;
protected portalClassName = '';
private boundUpdatePosition = () => this.updatePanelPosition();
// ===========================================================================
// LIFECYCLE
// ==========================================================================='
disconnectedCallback() {
super.disconnectedCallback();
this.destroyPortal();
}
updated(changed: Map<string, unknown>) {
if (changed.has('isOpen')) {
if (this.isOpen) {
document.addEventListener('click', this.handleDocumentClick, true);
document.addEventListener('keydown', this.handleDocumentKeyDown);
this.setInitialActiveIndex();
this.focusAfterOpen();
} else {
document.removeEventListener('click', this.handleDocumentClick, true);
document.removeEventListener('keydown', this.handleDocumentKeyDown);
this.activeIndex = -1;
}
}
if (changed.has('loading') && this.loading && this.isOpen) {
this.closePanel();
}
if (changed.has('isEditing') && !this.isEditing && this.isOpen) {
this.closePanel();
}
if (this.isOpen && this.portalContainer) {
this.renderPortalContent();
this.updatePanelPosition();
}
}
// ===========================================================================
// EVENT HANDLERS
// ==========================================================================='
private handleTriggerClick() {
if (!this.isEditing || this.disabled || this.readonly || this.loading) return;
this.isOpen ? this.closePanel() : this.openPanel();
}
private handleTriggerFocus() {
if (!this.isEditing) return;
if (!this.hasFocus) {
this.hasFocus = true;
this.dispatchFocusEvent();
}
}
private handleTriggerBlur() {
if (!this.isEditing) return;
if (this.isOpen) return;
this.dispatchBlurIfNeeded();
}
private handleItemClick(item: ItemData, isItemDisabled: boolean) {
if (!this.isEditing || this.disabled || this.readonly || this.loading) return;
if (isItemDisabled) return;
const currentValues = this.parseValue(this.value);
const isSelected = currentValues.includes(item.value);
let nextValues: string[] = [];
if (isSelected) {
nextValues = currentValues.filter((val) => val !== item.value);
} else {
nextValues = [...currentValues, item.value];
}
this.value = nextValues.join(',');
this.dispatchChangeEvent(this.value);
}
private handleSearchInput(e: Event) {
const input = e.target as HTMLInputElement;
this.searchQuery = input.value;
this.activeIndex = -1;
this.setInitialActiveIndex();
}
private handlePanelKeyDown(e: KeyboardEvent) {
if (!this.isOpen) return;
if (e.key === 'Escape') {
this.closePanel();
return;
}
if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
e.preventDefault();
this.moveActiveIndex(e.key === 'ArrowDown' ? 1 : -1);
return;
}
if (e.key === 'Enter' || e.key === ' ') {
e.preventDefault();
this.toggleActiveItem();
}
}
private handleDocumentClick = (e: MouseEvent) => {
if (!this.isOpen) return;
const target = e.target as Node;
if (!this.contains(target) && !this.portalContainer?.contains(target)) {
this.closePanel();
}
};
private handleDocumentKeyDown = (e: KeyboardEvent) => {
if (!this.isOpen) return;
if (e.key === 'Escape') {
this.closePanel();
}
};
// ===========================================================================
// OPEN/CLOSE HELPERS
// ==========================================================================='
private openPanel() {
if (this.isOpen) return;
this.isOpen = true;
this.createPortal();
}
private closePanel() {
if (!this.isOpen) return;
this.isOpen = false;
this.destroyPortal();
this.dispatchBlurIfNeeded();
}
private focusAfterOpen() {
requestAnimationFrame(() => {
const container = this.portalContainer || this;
const searchInput = container.querySelector('[data-ml-search]') as HTMLInputElement | null;
if (this.searchable && searchInput) {
searchInput.focus();
return;
}
this.focusActiveItem();
});
}
private dispatchChangeEvent(value: string) {
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value },
}));
}
private dispatchFocusEvent() {
this.dispatchEvent(new CustomEvent('focus', {
bubbles: true,
composed: true,
}));
}
private dispatchBlurIfNeeded() {
if (!this.hasFocus) return;
this.hasFocus = false;
this.dispatchEvent(new CustomEvent('blur', {
bubbles: true,
composed: true,
}));
}
// ===========================================================================
// DATA PREP
// ==========================================================================='
private parseValue(value: string | null | undefined): string[] {
if (!value) return [];
return value.split(',').map((val) => val.trim()).filter(Boolean);
}
private collectSlotData(): { groups: GroupData[]; items: ItemData[]; allItems: ItemData[] } {
const groups: GroupData[] = [];
const allItems: ItemData[] = [];
const groupEls = this.getSlots('Group');
for (const groupEl of groupEls) {
const label = groupEl.getAttribute('label') || '';
const itemEls = Array.from(groupEl.querySelectorAll('Item'));
const groupItems = itemEls.map((el) => this.createItemData(el, label));
if (groupItems.length > 0) {
groups.push({ label, items: groupItems });
allItems.push(...groupItems);
}
}
const itemEls = this.getSlots('Item').filter((el) => !el.closest('Group'));
const items = itemEls.map((el) => this.createItemData(el));
allItems.push(...items);
return { groups, items, allItems };
}
private createItemData(el: Element, groupLabel?: string): ItemData {
const value = el.getAttribute('value') || '';
const labelHtml = el.innerHTML.trim();
const labelText = (el.textContent || '').trim();
const disabled = el.hasAttribute('disabled');
return { value, labelHtml, labelText, disabled, groupLabel };
}
private filterData(data: { groups: GroupData[]; items: ItemData[] }, query: string) {
if (!query) return data;
const q = query.toLowerCase();
const groups = data.groups.map((group) => {
const groupMatch = group.label.toLowerCase().includes(q);
const items = groupMatch
? group.items
: group.items.filter((item) => item.labelText.toLowerCase().includes(q));
return { label: group.label, items };
}).filter((group) => group.items.length > 0);
const items = data.items.filter((item) => item.labelText.toLowerCase().includes(q));
return { groups, items };
}
private getSelectionState() {
const selectedValues = this.parseValue(this.value);
const selectedSet = new Set(selectedValues);
const selectedCount = selectedValues.length;
const selectionFull = this.maxSelection > 0 && selectedCount >= this.maxSelection;
return { selectedValues, selectedSet, selectedCount, selectionFull };
}
private getValidationError(selectedCount: number): string {
if (this.error) return this.error;
if (this.required && selectedCount === 0) return ' ';
if (this.minSelection > 0 && selectedCount < this.minSelection) return ' ';
if (this.maxSelection > 0 && selectedCount > this.maxSelection) return ' ';
return '';
}
private getItemDisabled(item: ItemData, selectionFull: boolean, selectedSet: Set<string>): boolean {
if (this.disabled || this.readonly || this.loading) return true;
if (item.disabled) return true;
if (selectionFull && !selectedSet.has(item.value)) return true;
return false;
}
private getSelectedLabelMap(items: ItemData[]): Map<string, string> {
const map = new Map<string, string>();
for (const item of items) {
map.set(item.value, item.labelHtml || item.labelText || item.value);
}
return map;
}
// ===========================================================================
// KEYBOARD HELPERS
// ==========================================================================='
private getVisibleItems() {
const slotData = this.collectSlotData();
const filtered = this.filterData(slotData, this.searchQuery);
const { selectedSet, selectionFull } = this.getSelectionState();
const flatItems: ItemData[] = [];
for (const group of filtered.groups) {
flatItems.push(...group.items);
}
flatItems.push(...filtered.items);
const visibleItems = flatItems.map((item, index) => ({
item,
index,
disabled: this.getItemDisabled(item, selectionFull, selectedSet),
}));
return visibleItems;
}
private setInitialActiveIndex() {
if (!this.isOpen) return;
const visibleItems = this.getVisibleItems();
const firstEnabled = visibleItems.find((entry) => !entry.disabled);
this.activeIndex = firstEnabled ? firstEnabled.index : -1;
}
private moveActiveIndex(direction: 1 | -1) {
const visibleItems = this.getVisibleItems();
if (visibleItems.length === 0) return;
let currentIndex = this.activeIndex;
let nextIndex = currentIndex;
const maxIndex = visibleItems.length - 1;
for (let i = 0; i < visibleItems.length; i++) {
nextIndex = Math.min(Math.max(currentIndex + direction, 0), maxIndex);
const nextItem = visibleItems[nextIndex];
if (!nextItem.disabled) {
this.activeIndex = nextIndex;
this.focusActiveItem();
return;
}
currentIndex = nextIndex;
}
}
private toggleActiveItem() {
const visibleItems = this.getVisibleItems();
const activeEntry = visibleItems[this.activeIndex];
if (!activeEntry) return;
this.handleItemClick(activeEntry.item, activeEntry.disabled);
}
private focusActiveItem() {
const container = this.portalContainer || this;
const activeButton = container.querySelector(`[data-ml-item][data-index="${this.activeIndex}"]`) as HTMLButtonElement | null;
if (activeButton) {
activeButton.focus();
}
}
// ===========================================================================
// PORTAL
// ===========================================================================
private createPortal() {
if (this.portalContainer) return;
this.portalContainer = document.createElement('div');
if (this.portalClassName) {
this.portalContainer.classList.add(this.portalClassName);
}
document.body.appendChild(this.portalContainer);
this.updatePanelPosition();
this.renderPortalContent();
window.addEventListener('scroll', this.boundUpdatePosition, true);
window.addEventListener('resize', this.boundUpdatePosition);
}
private destroyPortal() {
if (!this.portalContainer) return;
window.removeEventListener('scroll', this.boundUpdatePosition, true);
window.removeEventListener('resize', this.boundUpdatePosition);
this.portalContainer.remove();
this.portalContainer = null;
}
private updatePanelPosition() {
if (!this.portalContainer) return;
const trigger = this.querySelector('button[role="combobox"]') as HTMLElement;
if (!trigger) return;
const rect = trigger.getBoundingClientRect();
Object.assign(this.portalContainer.style, {
position: 'fixed',
top: `${rect.bottom + 8}px`,
left: `${rect.left}px`,
width: `${rect.width}px`,
zIndex: '9999',
});
}
private renderPortalContent() {
if (!this.portalContainer) return;
litRender(this.getPortalTemplate(), this.portalContainer);
}
protected getPortalTemplate(): TemplateResult {
const slotData = this.collectSlotData();
const filtered = this.filterData(slotData, this.searchQuery);
const { selectedSet, selectionFull } = this.getSelectionState();
const showEmpty = filtered.groups.length === 0 && filtered.items.length === 0;
return html`
<div
id="${this.panelId}"
class="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg"
role="listbox"
aria-multiselectable="true"
@keydown=${(e: KeyboardEvent) => this.handlePanelKeyDown(e)}
>
${this.searchable
? html`
<div class="p-2 border-b border-slate-200 dark:border-slate-700">
<input
class="w-full rounded-md px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400"
.placeholder=${this.msg.search}
value=${this.searchQuery}
@input=${(e: Event) => this.handleSearchInput(e)}
data-ml-search
/>
</div>`
: nothing}
<div class="max-h-64 overflow-auto p-2">
${showEmpty ? this.renderEmpty() : this.renderItems(filtered.groups, filtered.items, selectedSet, selectionFull)}
</div>
</div>
`;
}
// ===========================================================================
// RENDER HELPERS
// ==========================================================================='
private getTriggerClasses(hasError: boolean): string {
return [
'w-full min-h-[40px] rounded-lg px-3 py-2 text-sm border transition flex items-center justify-between gap-2',
'bg-white dark:bg-slate-900',
'text-slate-900 dark:text-slate-100',
'placeholder:text-slate-400 dark:placeholder:text-slate-500',
hasError
? 'border-red-500 dark:border-red-400'
: 'border-slate-200 dark:border-slate-700',
'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
(this.disabled || this.readonly || this.loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
this.isOpen ? 'border-sky-500 dark:border-sky-400' : '',
].filter(Boolean).join(' ');
}
private getItemClasses(isSelected: boolean, isDisabled: boolean): string {
return [
'w-full rounded-md px-3 py-2 text-sm transition flex items-center justify-between',
isSelected
? 'bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border border-sky-500 dark:border-sky-400'
: 'text-slate-900 dark:text-slate-100 border border-transparent',
(!isDisabled && !isSelected) ? 'hover:bg-slate-50 dark:hover:bg-slate-700' : '',
isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
].filter(Boolean).join(' ');
}
private renderLabel(): TemplateResult | typeof nothing {
if (!this.hasSlot('Label')) return nothing;
return html`<label id="${this.labelId}" class="text-sm font-medium text-slate-700 dark:text-slate-300">${unsafeHTML(this.getSlotContent('Label'))}</label>`;
}
private renderHelper(hasError: boolean): TemplateResult | typeof nothing {
if (hasError || !this.hasSlot('Helper')) return nothing;
return html`<p class="mt-1 text-xs text-slate-500 dark:text-slate-400">${unsafeHTML(this.getSlotContent('Helper'))}</p>`;
}
private renderError(hasError: boolean): TemplateResult | typeof nothing {
if (!hasError) return nothing;
const message = this.error || '';
return html`<p id="${this.errorId}" class="mt-1 text-xs text-red-600 dark:text-red-400">${unsafeHTML(message)}</p>`;
}
private renderSelectedTag(label: string, isHtml: boolean): TemplateResult {
return html`
<span class="px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
${isHtml ? unsafeHTML(label) : label}
</span>
`;
}
private renderTriggerContent(selectedLabels: { label: string; isHtml: boolean }[], selectedCount: number): TemplateResult {
if (this.loading) {
return html`<span class="text-slate-500 dark:text-slate-400">${this.msg.loading}</span>`;
}
if (this.hasSlot('Trigger')) {
return html`${unsafeHTML(this.getSlotContent('Trigger'))}`;
}
if (selectedCount === 0) {
const placeholder = this.placeholder || this.msg.placeholder;
return html`<span class="text-slate-400 dark:text-slate-500">${placeholder}</span>`;
}
const visible = selectedLabels.slice(0, 2);
const extraCount = selectedCount - visible.length;
return html`
<div class="flex flex-wrap items-center gap-1">
${visible.map((item) => this.renderSelectedTag(item.label, item.isHtml))}
${extraCount > 0
? html`<span class="text-xs text-slate-500 dark:text-slate-400">+${extraCount}</span>`
: nothing}
</div>
`;
}
private renderEmpty(): TemplateResult {
const content = this.hasSlot('Empty') ? this.getSlotContent('Empty') : this.msg.noResults;
return html`<div class="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">${unsafeHTML(content)}</div>`;
}
private renderGroup(group: GroupData, selectedSet: Set<string>, selectionFull: boolean, baseIndex: number): TemplateResult {
let runningIndex = baseIndex;
return html`
<div class="mb-2">
${group.label
? html`<div class="px-3 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">${group.label}</div>`
: nothing}
<div class="flex flex-col gap-1">
${group.items.map((item) => {
const isSelected = selectedSet.has(item.value);
const isDisabled = this.getItemDisabled(item, selectionFull, selectedSet);
const itemIndex = runningIndex++;
return html`
<button
type="button"
role="option"
aria-selected="${isSelected}"
aria-disabled="${isDisabled}"
class="${this.getItemClasses(isSelected, isDisabled)}"
?disabled=${isDisabled}
@mouseenter=${() => { this.activeIndex = itemIndex; }}
@click=${() => this.handleItemClick(item, isDisabled)}
@keydown=${this.handlePanelKeyDown}
data-ml-item
/data-index="${itemIndex}"
>
<span>${unsafeHTML(item.labelHtml || item.labelText)}</span>
${isSelected
? html`<span class="text-xs text-sky-600 dark:text-sky-300">✓</span>`
: nothing}
</button>
`;
})}
</div>
</div>
`;
}
private renderItems(groups: GroupData[], items: ItemData[], selectedSet: Set<string>, selectionFull: boolean): TemplateResult {
let indexCounter = 0;
return html`
${groups.map((group) => {
const template = this.renderGroup(group, selectedSet, selectionFull, indexCounter);
indexCounter += group.items.length;
return template;
})}
${items.length
? html`<div class="flex flex-col gap-1">
${items.map((item) => {
const isSelected = selectedSet.has(item.value);
const isDisabled = this.getItemDisabled(item, selectionFull, selectedSet);
const itemIndex = indexCounter++;
return html`
<button
type="button"
role="option"
aria-selected="${isSelected}"
aria-disabled="${isDisabled}"
class="${this.getItemClasses(isSelected, isDisabled)}"
?disabled=${isDisabled}
@mouseenter=${() => { this.activeIndex = itemIndex; }}
@click=${() => this.handleItemClick(item, isDisabled)}
@keydown=${this.handlePanelKeyDown}
data-ml-item
/data-index="${itemIndex}"
>
<span>${unsafeHTML(item.labelHtml || item.labelText)}</span>
${isSelected
? html`<span class="text-xs text-sky-600 dark:text-sky-300">✓</span>`
: nothing}
</button>
`;
})}
</div>`
: nothing}
`;
}
private renderViewMode(selectedLabels: { label: string; isHtml: boolean }[]): TemplateResult {
const hasSelection = selectedLabels.length > 0;
const placeholder = this.placeholder || this.msg.placeholder;
return html`
<div class="flex flex-col gap-1">
${this.renderLabel()}
<div class="min-h-[40px] rounded-lg px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
${hasSelection
? html`<div class="flex flex-wrap gap-1">
${selectedLabels.map((item) => this.renderSelectedTag(item.label, item.isHtml))}
</div>`
: html`<span class="text-slate-400 dark:text-slate-500">${placeholder}</span>`}
</div>
</div>
`;
}
// ===========================================================================
// RENDER
// ==========================================================================='
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];
const slotData = this.collectSlotData();
const filtered = this.filterData(slotData, this.searchQuery);
const { selectedValues, selectedSet, selectedCount, selectionFull } = this.getSelectionState();
const hasError = this.isEditing ? Boolean(this.getValidationError(selectedCount)) : false;
const labelMap = this.getSelectedLabelMap(slotData.allItems);
const selectedLabels = selectedValues.map((val) => {
const label = labelMap.get(val);
if (label) {
return { label, isHtml: true };
}
return { label: val, isHtml: false };
});
if (!this.isEditing) {
return this.renderViewMode(selectedLabels);
}
const triggerClasses = this.getTriggerClasses(hasError);
return html`
<div class="w-full" role="group">
<div class="flex items-start gap-3">
${this.renderLabel()}
<div class="relative flex-1">
<button
id="${this.name || this.panelId}"
type="button"
class="${triggerClasses}"
role="combobox"
aria-expanded="${this.isOpen}"
aria-haspopup="listbox"
aria-controls="${this.panelId}"
aria-labelledby="${this.hasSlot('Label') ? this.labelId : ''}"
aria-invalid="${hasError}"
aria-required="${this.required}"
?disabled=${this.disabled || this.readonly || this.loading}
@focus=${this.handleTriggerFocus}
@blur=${this.handleTriggerBlur}
@click=${this.handleTriggerClick}
@keydown=${(e: KeyboardEvent) => {
if (e.key === 'ArrowDown') {
e.preventDefault();
this.openPanel();
}
}}
>
<div class="flex-1 flex items-center gap-2">
${this.renderTriggerContent(selectedLabels, selectedCount)}
</div>
<span class="text-slate-400 dark:text-slate-500">
<svg viewBox="0 0 20 20" class="w-4 h-4" aria-hidden="true">
${svg`<path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>`}
</svg>
</span>
</button>
</div>
</div>
${this.renderError(hasError)}
${this.renderHelper(hasError)}
</div>
`;
}
}