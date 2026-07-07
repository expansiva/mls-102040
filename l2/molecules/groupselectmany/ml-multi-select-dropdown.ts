/// <mls fileReference="_102040_/l2/molecules/groupselectmany/ml-multi-select-dropdown.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// MULTI SELECT DROPDOWN MOLECULE
// =============================================================================
// Skill Group: groupSelectMany
// This molecule does NOT contain business logic.
import { html, render as litRender, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';
/// **collab_i18n_start**
const message_en = {
placeholder: 'Select options',
loading: 'Loading...',
searchPlaceholder: 'Search...',
empty: 'No options available',
selectedCount: 'selected',
requiredError: 'Select at least one option',
minSelectionError: 'Select at least {min} options',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
pt: {
placeholder: 'Selecione opções',
loading: 'Carregando...',
searchPlaceholder: 'Buscar...',
empty: 'Nenhuma opção disponível',
selectedCount: 'selecionado(s)',
requiredError: 'Selecione pelo menos uma opção',
minSelectionError: 'Selecione pelo menos {min} opções',
},
};
/// **collab_i18n_end**
type ParsedItem = {
value: string;
labelHtml: string;
labelText: string;
disabled: boolean;
groupLabel?: string;
};
type ParsedGroup = {
label: string;
items: ParsedItem[];
};
@customElement('groupselectmany--ml-multi-select-dropdown')
export class MultiSelectDropdownMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
// ===========================================================================
// SLOT TAGS
// ==========================================================================
slotTags = ['Label', 'Helper', 'Trigger', 'Item', 'Group', 'Empty'];
// ===========================================================================
// PROPERTIES — From Contract
// ==========================================================================
@propertyDataSource({ type: String })
value = '';
@propertyDataSource({ type: String })
error = '';
@propertyDataSource({ type: String })
name = '';
@propertyDataSource({ type: String })
placeholder = '';
@propertyDataSource({ type: Boolean })
searchable = false;
@propertyDataSource({ type: Number, attribute: 'min-selection' })
minSelection = 0;
@propertyDataSource({ type: Number, attribute: 'max-selection' })
maxSelection = 0;
@propertyDataSource({ type: Boolean, attribute: 'is-editing' })
isEditing = true;
@propertyDataSource({ type: Boolean })
disabled = false;
@propertyDataSource({ type: Boolean })
readonly = false;
@propertyDataSource({ type: Boolean })
required = false;
@propertyDataSource({ type: Boolean })
loading = false;
// ===========================================================================
// INTERNAL STATE
// ==========================================================================
@state()
private isOpen = false;
@state()
private searchQuery = '';
private uid = `msd-${Math.random().toString(36).slice(2)}`;
private labelId = `${this.uid}-label`;
private helperId = `${this.uid}-helper`;
private errorId = `${this.uid}-error`;
private panelId = `${this.uid}-panel`;
private hasFocus = false;
protected portalContainer: HTMLDivElement | null = null;
protected portalWidgetName = 'groupselectmany--ml-multi-select-dropdown';
private boundUpdatePosition = () => this.updatePanelPosition();
// ===========================================================================
// LIFECYCLE
// ==========================================================================
connectedCallback() {
super.connectedCallback();
}
disconnectedCallback() {
super.disconnectedCallback();
this.unregisterOutsideClick();
this.destroyPortal();
}
updated(_changedProperties: Map<string, unknown>) {
super.updated(_changedProperties);
if (this.isOpen && this.portalContainer) {
this.renderPortalContent();
this.updatePanelPosition();
}
}
// ===========================================================================
// EVENT HANDLERS
// ==========================================================================
private handleTriggerClick() {
if (!this.isEditing || this.disabled || this.readonly || this.loading) return;
this.toggleOpen();
}
private handleTriggerKeydown(e: KeyboardEvent) {
if (!this.isEditing || this.disabled || this.readonly || this.loading) return;
if (e.key === 'Enter' || e.key === ' ') {
e.preventDefault();
this.toggleOpen();
}
}
private handlePanelKeydown(e: KeyboardEvent) {
if (!this.isOpen) return;
if (e.key === 'Escape') {
e.preventDefault();
this.closePanel();
this.focusTrigger();
return;
}
if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
e.preventDefault();
const direction = e.key === 'ArrowDown' ? 1 : -1;
this.moveOptionFocus(direction);
return;
}
if (e.key === ' ' || e.key === 'Enter') {
const active = document.activeElement as HTMLElement | null;
if (active && active.dataset.optionValue) {
e.preventDefault();
this.toggleSelection(active.dataset.optionValue);
}
}
}
private handleSearchInput(e: Event) {
const input = e.target as HTMLInputElement;
this.searchQuery = input.value;
}
private handleOptionClick(value: string) {
this.toggleSelection(value);
}
private handleFocusIn() {
if (!this.isEditing || this.disabled || this.readonly) return;
if (!this.hasFocus) {
this.hasFocus = true;
this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
}
}
private handleFocusOut(e: FocusEvent) {
if (!this.isEditing) return;
const related = e.relatedTarget as Node | null;
if (this.hasFocus && (!related || (!this.contains(related) && !this.portalContainer?.contains(related)))) {
this.hasFocus = false;
this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
this.closePanel();
}
}
private handleDocumentClick = (e: Event) => {
const target = e.target as Node | null;
if (!target || (!this.contains(target) && !this.portalContainer?.contains(target))) {
this.closePanel();
}
};
// ===========================================================================
// SELECTION LOGIC
// ==========================================================================
private toggleSelection(value: string) {
if (!this.isEditing || this.disabled || this.readonly || this.loading) return;
const selected = this.getSelectedValues();
const isSelected = selected.includes(value);
const maxReached = this.maxSelection > 0 && selected.length >= this.maxSelection;
if (!isSelected && maxReached) return;
const updated = isSelected
? selected.filter(v => v !== value)
: [...selected, value];
this.value = updated.join(',');
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value },
}));
}
// ===========================================================================
// OPEN/CLOSE
// ==========================================================================
private toggleOpen() {
this.isOpen = !this.isOpen;
if (this.isOpen) {
this.registerOutsideClick();
this.createPortal();
if (this.searchable) {
setTimeout(() => this.focusSearchInput(), 0);
}
} else {
this.closePanel();
}
}
private closePanel() {
if (!this.isOpen) return;
this.isOpen = false;
this.searchQuery = '';
this.unregisterOutsideClick();
this.destroyPortal();
}
private registerOutsideClick() {
document.addEventListener('pointerdown', this.handleDocumentClick);
}
private unregisterOutsideClick() {
document.removeEventListener('pointerdown', this.handleDocumentClick);
}
private focusSearchInput() {
const container = this.portalContainer || this;
const input = container.querySelector('input[data-search]') as HTMLInputElement | null;
input?.focus();
}
private focusTrigger() {
const trigger = this.querySelector('[data-trigger]') as HTMLElement | null;
trigger?.focus();
}
private moveOptionFocus(direction: number) {
const container = this.portalContainer || this;
const options = Array.from(container.querySelectorAll('[data-option]')) as HTMLElement[];
if (!options.length) return;
const activeIndex = options.findIndex(el => el === document.activeElement);
const nextIndex = activeIndex === -1
? 0
: (activeIndex + direction + options.length) % options.length;
options[nextIndex]?.focus();
}
// ===========================================================================
// PORTAL
// ==========================================================================
private createPortal() {
if (this.portalContainer) return;
this.portalContainer = document.createElement('div');
if (this.portalWidgetName) {
this.portalContainer.setAttribute('data-widget', this.portalWidgetName);
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
litRender(this.getPortalTemplate(), this.portalContainer, { host: this });
}
protected getPortalTemplate(): TemplateResult {
const groups = this.getGroupedItems();
const items = this.getUngroupedItems();
const selectedValues = this.getSelectedValues();
return html`
<div class="${this.getPanelClasses()}" @keydown=${(e: KeyboardEvent) => this.handlePanelKeydown(e)}>
${this.searchable ? html`
<div class="p-2">
<input
class="w-full rounded-md border ml-select-search px-3 py-2 text-sm focus:outline-none focus:ring-2"
type="text"
placeholder="${this.msg.searchPlaceholder}"
.value=${this.searchQuery}
@input=${(e: Event) => this.handleSearchInput(e)}
data-search
/>
</div>
` : html``}
${this.renderOptionList(groups, items, selectedValues)}
</div>
`;
}
// ===========================================================================
// PARSING
// ==========================================================================
private getSelectedValues(): string[] {
return this.value
.split(',')
.map(v => v.trim())
.filter(v => v.length > 0);
}
private parseItem(el: Element, groupLabel?: string): ParsedItem {
const value = el.getAttribute('value') || '';
const disabled = el.hasAttribute('disabled');
const labelHtml = el.innerHTML || value;
const labelText = (el.textContent || value).trim();
return { value, labelHtml, labelText, disabled, groupLabel };
}
private getGroupedItems(): ParsedGroup[] {
const groups = this.getSlots('Group');
return groups
.map(groupEl => {
const label = groupEl.getAttribute('label') || '';
const items = Array.from(groupEl.querySelectorAll('Item'))
.map(itemEl => this.parseItem(itemEl, label))
.filter(item => item.value);
return { label, items };
})
.filter(group => group.items.length > 0);
}
private getUngroupedItems(): ParsedItem[] {
const items = Array.from(this.querySelectorAll('Item'))
.filter(itemEl => !itemEl.closest('Group'))
.map(itemEl => this.parseItem(itemEl))
.filter(item => item.value);
return items;
}
private getAllItems(): ParsedItem[] {
const grouped = this.getGroupedItems().flatMap(g => g.items);
const ungrouped = this.getUngroupedItems();
return [...grouped, ...ungrouped];
}
// ===========================================================================
// RENDER HELPERS
// ==========================================================================
private renderLabel(): TemplateResult {
if (!this.hasSlot('Label')) return html``;
return html`
<label id="${this.labelId}" class=${cn('mb-1 block text-sm font-medium ml-label', this.getSlotClass('Label'))}>
${unsafeHTML(this.getSlotContent('Label'))}
</label>
`;
}
private renderHelperOrError(errorMessage: string): TemplateResult {
if (!this.isEditing) return html``;
if (errorMessage) {
return html`
<p id="${this.errorId}" class="mt-1 text-xs ml-error-text">
${unsafeHTML(errorMessage)}
</p>
`;
}
if (this.hasSlot('Helper')) {
return html`
<p id="${this.helperId}" class=${cn('mt-1 text-xs ml-helper', this.getSlotClass('Helper'))}>
${unsafeHTML(this.getSlotContent('Helper'))}
</p>
`;
}
return html``;
}
private renderSelectedTags(items: ParsedItem[], selectedValues: string[]): TemplateResult {
const selectedItems = selectedValues
.map(value => items.find(item => item.value === value) || { value, labelHtml: value, labelText: value, disabled: false })
.filter(Boolean) as ParsedItem[];
if (selectedItems.length === 0) {
const placeholder = this.placeholder || this.msg.placeholder;
return html`<span class="ml-text-muted">${placeholder}</span>`;
}
if (selectedItems.length > 3) {
return html`<span class="ml-text-muted">${selectedItems.length} ${this.msg.selectedCount}</span>`;
}
return html`
<div class="flex flex-wrap gap-1">
${selectedItems.map(item => html`
<span class="rounded-md ml-select-tag px-2 py-0.5 text-xs">
${unsafeHTML(item.labelHtml)}
</span>
`)}
</div>
`;
}
private getTriggerClasses(hasError: boolean): string {
return [
'w-full rounded-lg border px-3 py-2 text-sm flex flex-wrap items-center gap-2 transition',
'ml-select-trigger',
hasError
? 'ml-select-trigger-error'
: '',
'focus:outline-none focus:ring-2 ml-select-trigger-focus',
(this.disabled || this.readonly || this.loading) ? 'ml-disabled' : 'cursor-pointer',
].filter(Boolean).join(' ');
}
private getPanelClasses(): string {
return [
'w-full rounded-lg border shadow-lg',
'ml-select-panel',
].join(' ');
}
private getItemClasses(item: ParsedItem, isSelected: boolean, isDisabled: boolean): string {
return [
'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition',
isSelected
? 'ml-select-item-selected'
: 'ml-select-item border border-transparent',
!isDisabled && !isSelected ? 'ml-select-item-hover' : '',
isDisabled ? 'ml-disabled' : 'cursor-pointer',
].filter(Boolean).join(' ');
}
private renderOptionList(groups: ParsedGroup[], items: ParsedItem[], selectedValues: string[]): TemplateResult {
const query = this.searchQuery.trim().toLowerCase();
const filterItem = (item: ParsedItem) => !query || item.labelText.toLowerCase().includes(query);
const filteredGroups = groups
.map(group => ({ ...group, items: group.items.filter(filterItem) }))
.filter(group => group.items.length > 0);
const filteredItems = items.filter(filterItem);
if (!filteredGroups.length && !filteredItems.length) {
const emptyContent = this.hasSlot('Empty') ? this.getSlotContent('Empty') : this.msg.empty;
return html`
<div class="px-3 py-4 text-sm ml-text-muted">
${unsafeHTML(emptyContent)}
</div>
`;
}
const maxReached = this.maxSelection > 0 && selectedValues.length >= this.maxSelection;
return html`
<div class="max-h-60 overflow-auto p-2" role="listbox" aria-multiselectable="true" id="${this.panelId}">
${filteredGroups.map(group => html`
<div class="mb-2">
${group.label ? html`<div class="px-2 py-1 text-xs font-semibold ml-text-muted">${group.label}</div>` : html``}
${group.items.map(item => {
const isSelected = selectedValues.includes(item.value);
const isDisabled = item.disabled || (!isSelected && maxReached);
return html`
<button
class="${this.getItemClasses(item, isSelected, isDisabled)}"
role="option"
aria-selected="${isSelected}"
aria-disabled="${isDisabled}"
type="button"
?disabled=${isDisabled}
@mousedown=${(e: Event) => e.preventDefault()}
@click=${() => this.handleOptionClick(item.value)}
.data-option=${true}
.data-option-value=${item.value}
>
<span>${unsafeHTML(item.labelHtml)}</span>
${isSelected ? html`<span class="ml-select-check">✓</span>` : html``}
</button>
`;
})}
</div>
`)}
${filteredItems.map(item => {
const isSelected = selectedValues.includes(item.value);
const isDisabled = item.disabled || (!isSelected && maxReached);
return html`
<button
class="${this.getItemClasses(item, isSelected, isDisabled)}"
role="option"
aria-selected="${isSelected}"
aria-disabled="${isDisabled}"
type="button"
?disabled=${isDisabled}
@mousedown=${(e: Event) => e.preventDefault()}
@click=${() => this.handleOptionClick(item.value)}
.data-option=${true}
.data-option-value=${item.value}
>
<span>${unsafeHTML(item.labelHtml)}</span>
${isSelected ? html`<span class="ml-select-check">✓</span>` : html``}
</button>
`;
})}
</div>
`;
}
private renderTriggerContent(items: ParsedItem[], selectedValues: string[]): TemplateResult {
if (this.hasSlot('Trigger')) {
return html`${unsafeHTML(this.getSlotContent('Trigger'))}`;
}
return this.renderSelectedTags(items, selectedValues);
}
private getComputedError(selectedCount: number): string {
if (this.error) return this.error;
if (this.minSelection > 0 && selectedCount < this.minSelection) {
return this.msg.minSelectionError.replace('{min}', String(this.minSelection));
}
if (this.required && selectedCount === 0) {
return this.msg.requiredError;
}
return '';
}
private renderViewMode(): TemplateResult {
const items = this.getAllItems();
const selectedValues = this.getSelectedValues();
return html`
<div class=${cn('w-full', this.cssClass)}>
${this.renderLabel()}
<div class="rounded-lg border ml-select-view px-3 py-2 text-sm">
${this.renderSelectedTags(items, selectedValues)}
</div>
${this.name ? html`<input type="hidden" name="${this.name}" value="${this.value}" />` : html``}
</div>
`;
}
// ===========================================================================
// RENDER
// ==========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];
if (!this.isEditing) {
return this.renderViewMode();
}
const groups = this.getGroupedItems();
const items = this.getUngroupedItems();
const allItems = [...groups.flatMap(g => g.items), ...items];
const selectedValues = this.getSelectedValues();
const errorMessage = this.getComputedError(selectedValues.length);
const hasError = Boolean(errorMessage);
const describedBy = hasError
? this.errorId
: this.hasSlot('Helper')
? this.helperId
: undefined;
const labelAttr = this.hasSlot('Label') ? this.labelId : undefined;
const isPanelOpen = this.isOpen && !this.loading;
return html`
<div
class=${cn('w-full', this.cssClass)}
@focusin=${this.handleFocusIn}
@focusout=${this.handleFocusOut}
@keydown=${this.handlePanelKeydown}
>
${this.renderLabel()}
<div class="relative">
<button
class="${this.getTriggerClasses(hasError)}"
type="button"
role="combobox"
aria-expanded="${isPanelOpen}"
aria-haspopup="listbox"
aria-required="${this.required}"
aria-invalid="${hasError}"
${labelAttr ? html`aria-labelledby="${labelAttr}"` : html`aria-label="${this.placeholder || this.msg.placeholder}"`}
${describedBy ? html`aria-describedby="${describedBy}"` : html``}
@keydown=${this.handleTriggerKeydown}
@click=${this.handleTriggerClick}
.data-trigger=${true}
>
${this.loading ? html`<span class="ml-text-muted">${this.msg.loading}</span>` : this.renderTriggerContent(allItems, selectedValues)}
</button>
</div>
${this.renderHelperOrError(errorMessage)}
${this.name ? html`<input type="hidden" name="${this.name}" value="${this.value}" />` : html``}
</div>
`;
}
}
