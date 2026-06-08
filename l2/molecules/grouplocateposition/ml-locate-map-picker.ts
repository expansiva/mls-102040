/// <mls fileReference="_102040_/l2/molecules/grouplocateposition/ml-locate-map-picker.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// LOCATE MAP PICKER MOLECULE
// =============================================================================
// Skill Group: groupLocatePosition
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
placeholder: 'Search location',
noResults: 'No results found',
loading: 'Loading...',
emptyValue: '—',
useLocation: 'Use current location',
requiredError: 'Location is required',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
};
/// **collab_i18n_end**

@customElement('grouplocateposition--ml-locate-map-picker')
export class LocateMapPickerMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
private uid = `locate-${Math.random().toString(36).slice(2)}`;

// ===========================================================================
// SLOT TAGS
// ===========================================================================
slotTags = ['Label', 'Helper', 'Trigger', 'Suggestions', 'Item', 'Empty'];

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

@propertyDataSource({ type: Boolean, attribute: 'show-map' })
showMap = false;

@propertyDataSource({ type: Boolean, attribute: 'allow-geolocation' })
allowGeolocation = false;

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
// ===========================================================================
@state()
private searchQuery = '';

@state()
private isOpen = false;

@state()
private isFocused = false;

@state()
private isDragging = false;

// ===========================================================================
// STATE CHANGE HANDLER
// ===========================================================================
handleIcaStateChange(key: string, _value: any) {
const valueAttr = this.getAttribute('value');
if (valueAttr === `{{${key}}}`) {
this.updateSearchQueryFromValue();
}
this.requestUpdate();
}

// ===========================================================================
// HELPERS
// ===========================================================================
private parseValue(): { lat: number; lng: number } | null {
if (!this.value) return null;
const [lat, lng] = this.value.split(',').map(Number);
return isNaN(lat) || isNaN(lng) ? null : { lat, lng };
}

private getSuggestions(): Array<{ value: string; label: string }> {
const suggestionsContainer = this.getSlot('Suggestions');
if (!suggestionsContainer) return [];
return Array.from(suggestionsContainer.querySelectorAll('Item')).map(el => ({
value: el.getAttribute('value') || '',
label: el.innerHTML,
}));
}

private getLabelForValue(value: string | null): string | null {
if (!value) return null;
const items = this.getSuggestions();
const match = items.find(item => item.value === value);
return match ? match.label : null;
}

private updateSearchQueryFromValue() {
if (!this.value) {
this.searchQuery = '';
return;
}
const label = this.getLabelForValue(this.value);
this.searchQuery = label || this.value;
}

private getEffectiveQuery(): string {
return this.searchQuery || this.getLabelForValue(this.value) || this.value || '';
}

private isInteractionBlocked(): boolean {
return this.disabled || this.readonly || this.loading || !this.isEditing;
}

private getInputClasses(hasError: boolean): string {
return [
'w-full rounded-lg px-3 py-2 text-sm border transition',
'bg-white dark:bg-slate-900',
'text-slate-900 dark:text-slate-100',
'placeholder:text-slate-400 dark:placeholder:text-slate-500',
hasError
? 'border-red-500 dark:border-red-400'
: this.isFocused
? 'border-sky-500 dark:border-sky-400'
: 'border-slate-200 dark:border-slate-700',
'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
this.disabled || this.loading ? 'opacity-50 cursor-not-allowed' : '',
this.readonly ? 'cursor-default' : '',
].filter(Boolean).join(' ');
}

private getPanelClasses(): string {
return [
'absolute z-10 mt-2 w-full rounded-lg border p-2',
'bg-white dark:bg-slate-800',
'border-slate-200 dark:border-slate-700',
'shadow-lg',
].join(' ');
}

private getItemClasses(isSelected: boolean, isDisabled: boolean): string {
return [
'w-full rounded-md px-3 py-2 text-sm transition text-left',
isSelected
? 'bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border border-sky-500 dark:border-sky-400'
: 'text-slate-900 dark:text-slate-100 border border-transparent',
!isDisabled && !isSelected ? 'hover:bg-slate-50 dark:hover:bg-slate-700' : '',
isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
].filter(Boolean).join(' ');
}

private getMapContainerClasses(): string {
return [
'relative w-full h-48 rounded-lg border overflow-hidden',
'bg-slate-50 dark:bg-slate-900',
'border-slate-200 dark:border-slate-700',
this.isInteractionBlocked() ? 'opacity-50' : '',
].filter(Boolean).join(' ');
}

private getMapMarkerStyle(): string {
const coords = this.parseValue();
if (!coords) return 'display:none;';
const x = Math.min(100, Math.max(0, ((coords.lng + 180) / 360) * 100));
const y = Math.min(100, Math.max(0, ((90 - coords.lat) / 180) * 100));
return `left:${x}%; top:${y}%;`;
}

private getErrorMessage(): string {
if (!this.isEditing) return '';
if (this.error) return this.error;
if (this.required && !this.value) return this.msg.requiredError;
return '';
}

// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleInput(e: Event) {
if (this.isInteractionBlocked()) return;
const input = e.target as HTMLInputElement;
this.searchQuery = input.value;
this.isOpen = true;
this.dispatchEvent(new CustomEvent('search', {
bubbles: true,
composed: true,
detail: { query: this.searchQuery }
}));
}

private handleFocus() {
if (this.disabled) return;
this.isFocused = true;
this.isOpen = true;
this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
}

private handleBlur() {
this.isFocused = false;
this.isOpen = false;
this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
}

private handleSelect(value: string, label: string) {
if (this.isInteractionBlocked()) return;
this.value = value;
this.searchQuery = label || value;
this.isOpen = false;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value }
}));
}

private handleGeolocation() {
if (this.isInteractionBlocked() || !this.allowGeolocation) return;
if (!navigator.geolocation) return;
this.loading = true;
navigator.geolocation.getCurrentPosition(
(pos) => {
const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
this.value = coords;
this.searchQuery = coords;
this.loading = false;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value }
}));
this.dispatchEvent(new CustomEvent('search', {
bubbles: true,
composed: true,
detail: { query: coords }
}));
},
() => {
this.loading = false;
}
);
}

private handleMapPointerDown(e: PointerEvent) {
if (this.isInteractionBlocked() || !this.showMap) return;
const target = e.currentTarget as HTMLElement;
if (!target) return;
this.isDragging = true;
(target as HTMLElement).setPointerCapture(e.pointerId);
this.updateValueFromPointer(e);
}

private handleMapPointerMove(e: PointerEvent) {
if (!this.isDragging) return;
this.updateValueFromPointer(e);
}

private handleMapPointerUp(e: PointerEvent) {
if (!this.isDragging) return;
this.isDragging = false;
const target = e.currentTarget as HTMLElement;
if (target) target.releasePointerCapture(e.pointerId);
}

private updateValueFromPointer(e: PointerEvent) {
const container = e.currentTarget as HTMLElement;
const rect = container.getBoundingClientRect();
const x = Math.min(rect.width, Math.max(0, e.clientX - rect.left));
const y = Math.min(rect.height, Math.max(0, e.clientY - rect.top));
const lng = (x / rect.width) * 360 - 180;
const lat = 90 - (y / rect.height) * 180;
const value = `${lat.toFixed(6)},${lng.toFixed(6)}`;
this.value = value;
this.searchQuery = value;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value }
}));
this.dispatchEvent(new CustomEvent('search', {
bubbles: true,
composed: true,
detail: { query: value }
}));
}

// ===========================================================================
// RENDER HELPERS
// ===========================================================================
private renderLabel(): TemplateResult {
if (!this.hasSlot('Label')) return html``;
return html`<label id="${this.uid}-label" class="block mb-2 text-sm text-slate-600 dark:text-slate-400">${unsafeHTML(this.getSlotContent('Label'))}</label>`;
}

private renderHelperOrError(): TemplateResult {
const errorMessage = this.getErrorMessage();
if (!this.isEditing) return html``;
if (errorMessage) {
return html`<p id="${this.uid}-error" class="mt-1 text-xs text-red-600 dark:text-red-400">${unsafeHTML(String(errorMessage))}</p>`;
}
if (this.hasSlot('Helper')) {
return html`<p class="mt-1 text-xs text-slate-500 dark:text-slate-400">${unsafeHTML(this.getSlotContent('Helper'))}</p>`;
}
return html``;
}

private renderSuggestions(): TemplateResult {
if (!this.isEditing || !this.isOpen) return html``;
const items = this.getSuggestions();
if (this.loading) {
return html`<div class="${this.getPanelClasses()}" role="listbox">${this.msg.loading}</div>`;
}
if (!items.length) {
const emptyContent = this.hasSlot('Empty') ? this.getSlotContent('Empty') : this.msg.noResults;
return html`<div class="${this.getPanelClasses()}" role="listbox"><div class="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">${unsafeHTML(emptyContent)}</div></div>`;
}
return html`
<div class="${this.getPanelClasses()}" role="listbox">
${items.map(item => {
const isSelected = item.value === this.value;
return html`
<button
class="${this.getItemClasses(isSelected, this.isInteractionBlocked())}"
role="option"
aria-selected="${isSelected}"
?disabled=${this.isInteractionBlocked()}
@mousedown=${(e: Event) => e.preventDefault()}
@click=${() => this.handleSelect(item.value, item.label)}
>
${unsafeHTML(item.label)}
</button>
`;
})}
</div>
`;
}

private renderMap(): TemplateResult {
if (!this.showMap) return html``;
const coords = this.parseValue();
return html`
<div
class="${this.getMapContainerClasses()}"
@pointerdown=${this.handleMapPointerDown}
@pointermove=${this.handleMapPointerMove}
@pointerup=${this.handleMapPointerUp}
@pointerleave=${this.handleMapPointerUp}
>
<div class="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
${coords ? '' : this.msg.emptyValue}
</div>
<div
class="absolute w-4 h-4 rounded-full border border-sky-500 dark:border-sky-400 bg-sky-50 dark:bg-sky-900/40 -translate-x-1/2 -translate-y-1/2"
style="${this.getMapMarkerStyle()}"
></div>
</div>
`;
}

private renderViewMode(): TemplateResult {
const label = this.getLabelForValue(this.value) || this.value;
const display = label || (this.hasSlot('Empty') ? this.getSlotContent('Empty') : this.msg.emptyValue);
return html`
${this.renderLabel()}
<div class="text-sm text-slate-900 dark:text-slate-100">${unsafeHTML(String(display))}</div>
${this.renderMap()}
`;
}

// ===========================================================================
// RENDER
// ===========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];

if (!this.isEditing) {
return html`<div class="w-full">${this.renderViewMode()}</div>`;
}

const errorMessage = this.getErrorMessage();
const hasError = Boolean(errorMessage);
const effectivePlaceholder = this.placeholder || this.msg.placeholder;
const query = this.getEffectiveQuery();

return html`
<div class="w-full">
${this.renderLabel()}
<div class="relative">
<input
id="${this.uid}-input"
type="text"
name="${this.name}"
class="${this.getInputClasses(hasError)}"
.placeholder=${effectivePlaceholder}
.value=${query}
?disabled=${this.disabled || this.loading}
?readonly=${this.readonly}
role="combobox"
aria-expanded="${this.isOpen}"
aria-autocomplete="list"
aria-labelledby="${this.uid}-label"
aria-invalid="${hasError}"
aria-required="${this.required}"
aria-describedby="${hasError ? `${this.uid}-error` : ''}"
@input=${this.handleInput}
@focus=${this.handleFocus}
@blur=${this.handleBlur}
/>
${this.allowGeolocation ? html`
<button
class="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
?disabled=${this.isInteractionBlocked()}
aria-label="${this.msg.useLocation}"
@click=${this.handleGeolocation}
>
${this.hasSlot('Trigger') ? unsafeHTML(this.getSlotContent('Trigger')) : this.msg.useLocation}
</button>
` : html``}
${this.renderSuggestions()}
</div>
${this.renderMap()}
${this.renderHelperOrError()}
</div>
`;
}
}

declare global {
interface HTMLElementTagNameMap {
'grouplocateposition--ml-locate-map-picker': LocateMapPickerMolecule;
}
}
