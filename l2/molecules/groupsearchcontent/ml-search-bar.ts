/// <mls fileReference="_102040_/l2/molecules/groupsearchcontent/ml-search-bar.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML-SEARCH-BAR MOLECULE
// =============================================================================
// Skill Group: groupSearchContent
// This molecule does NOT contain business logic.
import { html, svg, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
placeholder: 'Search',
loading: 'Loading...',
noResults: 'No results found',
clear: 'Clear search',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
};
/// **collab_i18n_end**

@customElement('groupsearchcontent--ml-search-bar')
export class MlSearchBarMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
private debounceTimer: number | null = null;
private componentId = `ml-search-bar-${Math.random().toString(36).slice(2)}`;

// ===========================================================================
// SLOT TAGS
// ===========================================================================
slotTags = ['Label', 'Helper', 'Suggestion', 'Empty'];

// ===========================================================================
// PROPERTIES — From Contract
// ===========================================================================
@propertyDataSource({ type: String })
value: string | null = null;

@propertyDataSource({ type: String })
error: string = '';

@propertyDataSource({ type: String })
name: string = '';

@propertyDataSource({ type: String })
placeholder: string = '';

@propertyDataSource({ type: Number })
debounce: number = 300;

@propertyDataSource({ type: Boolean })
disabled: boolean = false;

@propertyDataSource({ type: Boolean })
loading: boolean = false;

// ===========================================================================
// INTERNAL STATE
// ===========================================================================
@state()
private query: string = '';

@state()
private isOpen: boolean = false;

@state()
private highlightIndex: number = -1;

// ===========================================================================
// STATE CHANGE HANDLER
// ===========================================================================
handleIcaStateChange(key: string, value: any) {
const valueAttr = this.getAttribute('value');
if (valueAttr === `{{${key}}}`) {
const stringValue = value ?? '';
const suggestions = this.getSuggestions();
const matched = suggestions.find((s) => s.value === stringValue);
this.query = matched ? matched.labelText : String(stringValue);
}
this.requestUpdate();
}

// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleInput(e: Event) {
e.stopPropagation();
if (this.disabled) return;
const input = e.target as HTMLInputElement;
this.query = input.value;
this.isOpen = true;
this.highlightIndex = -1;

if (!this.query) {
this.value = null;
this.dispatchEvent(new CustomEvent('clear', { bubbles: true, composed: true }));
}

this.scheduleSearch();
}

private handleFocus() {
if (this.disabled) return;
this.isOpen = true;
this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
}

private handleBlur() {
this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
window.setTimeout(() => {
this.isOpen = false;
this.highlightIndex = -1;
}, 100);
}

private handleKeyDown(e: KeyboardEvent) {
if (this.disabled) return;
const suggestions = this.getSuggestions();
const maxIndex = suggestions.length - 1;

if (e.key === 'ArrowDown') {
e.preventDefault();
this.isOpen = true;
this.highlightIndex = Math.min(maxIndex, this.highlightIndex + 1);
return;
}

if (e.key === 'ArrowUp') {
e.preventDefault();
this.isOpen = true;
this.highlightIndex = Math.max(-1, this.highlightIndex - 1);
return;
}

if (e.key === 'Enter') {
e.preventDefault();
if (this.highlightIndex >= 0 && suggestions[this.highlightIndex]) {
this.confirmSuggestion(suggestions[this.highlightIndex]);
} else {
this.confirmQuery();
}
return;
}

if (e.key === 'Escape') {
this.isOpen = false;
this.highlightIndex = -1;
}
}

private handleClearClick() {
if (this.disabled) return;
this.query = '';
this.value = null;
this.isOpen = false;
this.highlightIndex = -1;
this.dispatchEvent(new CustomEvent('clear', { bubbles: true, composed: true }));
}

private handleSuggestionClick(index: number) {
if (this.disabled) return;
const suggestions = this.getSuggestions();
const suggestion = suggestions[index];
if (suggestion) {
this.confirmSuggestion(suggestion);
}
}

// ===========================================================================
// DATA + ACTIONS
// ===========================================================================
private scheduleSearch() {
if (this.debounceTimer) {
window.clearTimeout(this.debounceTimer);
}
this.debounceTimer = window.setTimeout(() => {
if (this.disabled) return;
this.dispatchEvent(new CustomEvent('search', {
bubbles: true,
composed: true,
detail: { query: this.query },
}));
}, this.debounce);
}

private confirmQuery() {
if (this.disabled) return;
if (!this.query) {
this.value = null;
this.dispatchEvent(new CustomEvent('clear', { bubbles: true, composed: true }));
return;
}
this.value = this.query;
this.isOpen = false;
this.highlightIndex = -1;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value },
}));
}

private confirmSuggestion(suggestion: SuggestionItem) {
this.value = suggestion.value;
this.query = suggestion.labelText;
this.isOpen = false;
this.highlightIndex = -1;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value },
}));
}

// ===========================================================================
// RENDERING HELPERS
// ===========================================================================
private getSuggestions(): SuggestionItem[] {
return this.getSlots('Suggestion').map((el) => ({
value: el.getAttribute('value') || '',
labelHtml: el.innerHTML,
labelText: el.textContent || '',
}));
}

private getInputClasses(): string {
return [
'w-full rounded-lg pl-10 pr-10 py-2 text-sm border transition',
'ml-search-input',
this.error
? 'ml-error-border'
: 'ml-search-border',
'ml-search-focus',
this.disabled ? 'ml-disabled' : '',
].filter(Boolean).join(' ');
}

private getPanelClasses(): string {
return [
'rounded-lg border mt-2 p-2 space-y-1',
'ml-search-container',
this.isOpen ? 'block' : 'hidden',
].filter(Boolean).join(' ');
}

private getSuggestionClasses(isActive: boolean): string {
return [
'w-full text-left rounded-md px-3 py-2 text-sm transition',
isActive
? 'ml-filter-chip-active'
: 'ml-text border border-transparent',
!this.disabled && !isActive ? 'ml-search-icon' : '',
this.disabled ? 'ml-disabled' : 'cursor-pointer',
].filter(Boolean).join(' ');
}

private renderLabel(): TemplateResult {
if (!this.hasSlot('Label')) return html``;
const labelId = `${this.componentId}-label`;
return html`
<label id=${labelId} class=${cn('block mb-1 text-sm ml-label', this.getSlotClass('Label'))}>
${unsafeHTML(this.getSlotContent('Label'))}
</label>
`;
}

private renderHelperOrError(): TemplateResult {
if (this.error) {
const errorId = `${this.componentId}-error`;
return html`<p id=${errorId} class="mt-1 text-xs ml-error-text">${unsafeHTML(String(this.error))}</p>`;
}
if (this.hasSlot('Helper')) {
const helperId = `${this.componentId}-helper`;
return html`<p id=${helperId} class=${cn('mt-1 text-xs ml-text-muted', this.getSlotClass('Helper'))}>${unsafeHTML(this.getSlotContent('Helper'))}</p>`;
}
return html``;
}

private renderSuggestions(): TemplateResult {
const suggestions = this.getSuggestions();
const hasSuggestions = suggestions.length > 0;
const showEmpty = !this.loading && !hasSuggestions && this.query;

return html`
<div id=${`${this.componentId}-list`} class=${this.getPanelClasses()} role="listbox">
${this.loading ? html`
<div class="px-3 py-2 text-sm ml-text-muted">
${this.msg.loading}
</div>
` : html``}
${hasSuggestions ? suggestions.map((item, index) => html`
<button
class=${this.getSuggestionClasses(index === this.highlightIndex)}
role="option"
aria-selected=${index === this.highlightIndex}
?disabled=${this.disabled}
@mousedown=${(e: Event) => e.preventDefault()}
@click=${() => this.handleSuggestionClick(index)}
>
${unsafeHTML(item.labelHtml)}
</button>
`) : html``}
${showEmpty ? html`
<div class=${cn('px-3 py-2 text-sm ml-text-muted', this.getSlotClass('Empty'))}>
${unsafeHTML(this.getSlotContent('Empty') || this.msg.noResults)}
</div>
` : html``}
</div>
`;
}

// ===========================================================================
// RENDER
// ===========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];

const labelId = this.hasSlot('Label') ? `${this.componentId}-label` : undefined;
const errorId = this.error ? `${this.componentId}-error` : undefined;
const helperId = !this.error && this.hasSlot('Helper') ? `${this.componentId}-helper` : undefined;
const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;
const inputPlaceholder = this.placeholder || this.msg.placeholder;
const showClear = !!this.query && !this.disabled;

return html`
<div class=${cn('w-full', this.cssClass)}>
${this.renderLabel()}
<div class="relative">
<span class="absolute left-3 top-1/2 -translate-y-1/2 ml-search-icon">
<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
${svg`<path d="M10.5 3a7.5 7.5 0 1 1-4.24 13.68l-3.97 3.97a1 1 0 1 1-1.42-1.42l3.97-3.97A7.5 7.5 0 0 1 10.5 3zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z" fill="currentColor" />`}
</svg>
</span>
<input
class=${this.getInputClasses()}
type="text"
name=${this.name}
.placeholder=${inputPlaceholder}
.value=${this.query}
?disabled=${this.disabled}
role="combobox"
aria-expanded=${this.isOpen}
aria-autocomplete="list"
aria-controls=${`${this.componentId}-list`}
aria-labelledby=${labelId || ''}
aria-describedby=${describedBy || ''}
aria-invalid=${this.error ? 'true' : 'false'}
@input=${this.handleInput}
@focus=${this.handleFocus}
@blur=${this.handleBlur}
@keydown=${this.handleKeyDown}

@change=${(e: Event) => e.stopPropagation()}
/>
${showClear ? html`
<button
class="absolute right-3 top-1/2 -translate-y-1/2 ml-search-clear"
aria-label=${this.msg.clear}
@mousedown=${(e: Event) => e.preventDefault()}
@click=${this.handleClearClick}
>
<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
${svg`<path d="M6.7 5.3a1 1 0 0 1 1.4 0L12 9.17l3.9-3.88a1 1 0 1 1 1.4 1.42L13.42 10.6l3.88 3.9a1 1 0 0 1-1.42 1.4L12 12.02l-3.9 3.88a1 1 0 1 1-1.4-1.42l3.88-3.9-3.88-3.88a1 1 0 0 1 0-1.4z" fill="currentColor" />`}
</svg>
</button>
` : html``}
</div>
${this.renderSuggestions()}
${this.renderHelperOrError()}
</div>
`;
}
}

type SuggestionItem = {
value: string;
labelHtml: string;
labelText: string;
};
