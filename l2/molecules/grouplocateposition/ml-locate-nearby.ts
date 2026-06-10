/// <mls fileReference="_102040_/l2/molecules/grouplocateposition/ml-locate-nearby.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// LOCATE NEARBY MOLECULE
// =============================================================================
// Skill Group: groupLocatePosition
// This molecule does NOT contain business logic.
import { html, svg, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
placeholder: 'Search nearby locations',
noResults: 'No results found',
loading: 'Loading...',
empty: '—',
useLocation: 'Use current location',
required: 'Location is required',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
pt: {
placeholder: 'Buscar locais próximos',
noResults: 'Nenhum resultado encontrado',
loading: 'Carregando...',
empty: '—',
useLocation: 'Usar localização atual',
required: 'Localização obrigatória',
},
};
/// **collab_i18n_end**

@customElement('grouplocateposition--ml-locate-nearby')
export class LocateNearbyMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;

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
error = '';

@propertyDataSource({ type: String })
name = '';

@propertyDataSource({ type: String })
placeholder = '';

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
private geoLoading = false;

private static idCount = 0;
private inputId = `locate-input-${++LocateNearbyMolecule.idCount}`;
private labelId = `locate-label-${LocateNearbyMolecule.idCount}`;
private listboxId = `locate-listbox-${LocateNearbyMolecule.idCount}`;
private helperId = `locate-helper-${LocateNearbyMolecule.idCount}`;
private errorId = `locate-error-${LocateNearbyMolecule.idCount}`;
private blurTimeout: number | null = null;

// ===========================================================================
// STATE CHANGE HANDLER (Derived state)
// ===========================================================================
handleIcaStateChange(key: string, value: any) {
const valueAttr = this.getAttribute('value');
if (valueAttr === `{{${key}}}`) {
this.syncSearchQueryWithValue(value);
}
this.requestUpdate();
}

// ===========================================================================
// HELPERS
// ===========================================================================
private getSuggestions(): Array<{ value: string; labelHtml: string; labelText: string }> {
const suggestionsContainer = this.getSlot('Suggestions');
if (!suggestionsContainer) return [];
const items = Array.from(suggestionsContainer.querySelectorAll('Item'));
return items.map(el => ({
value: el.getAttribute('value') || '',
labelHtml: el.innerHTML,
labelText: (el.textContent || '').trim(),
}));
}

private parseValue(): { lat: number; lng: number } | null {
if (!this.value) return null;
const [lat, lng] = this.value.split(',').map(Number);
return isNaN(lat) || isNaN(lng) ? null : { lat, lng };
}

private getSelectedLabel(): { html: string; text: string } | null {
if (!this.value) return null;
const match = this.getSuggestions().find(item => item.value === this.value);
if (match) return { html: match.labelHtml, text: match.labelText };
return null;
}

private syncSearchQueryWithValue(newValue: string | null) {
if (!newValue) {
this.searchQuery = '';
return;
}
const match = this.getSelectedLabel();
this.searchQuery = match?.text || newValue;
}

private getInputClasses(hasError: boolean): string {
return [
'w-full rounded-lg px-3 py-2 text-sm border transition',
'bg-white dark:bg-slate-900',
'text-slate-900 dark:text-slate-100',
'placeholder:text-slate-400 dark:placeholder:text-slate-500',
hasError
? 'border-red-500 dark:border-red-400'
: 'border-slate-200 dark:border-slate-700',
'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
this.disabled || this.readonly ? 'opacity-50 cursor-not-allowed' : '',
].filter(Boolean).join(' ');
}

private getPanelClasses(): string {
return [
'absolute z-10 mt-2 w-full rounded-lg border p-2 text-sm shadow-sm',
'bg-white dark:bg-slate-800',
'border-slate-200 dark:border-slate-700',
].join(' ');
}

private getItemClasses(isSelected: boolean, isDisabled: boolean): string {
return [
'w-full rounded-md px-3 py-2 text-sm transition cursor-pointer',
isSelected
? 'bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border border-sky-500 dark:border-sky-400'
: 'text-slate-900 dark:text-slate-100 border border-transparent',
!isSelected && !isDisabled ? 'hover:bg-slate-50 dark:hover:bg-slate-700' : '',
isDisabled ? 'opacity-50 cursor-not-allowed' : '',
].filter(Boolean).join(' ');
}

// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleInput(e: Event) {
if (this.disabled || this.readonly) return;
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
if (this.disabled || this.readonly) return;
this.isOpen = true;
this.dispatchEvent(new CustomEvent('focus', {
bubbles: true,
composed: true,
}));
}

private handleBlur() {
if (this.blurTimeout) window.clearTimeout(this.blurTimeout);
this.blurTimeout = window.setTimeout(() => {
this.isOpen = false;
this.dispatchEvent(new CustomEvent('blur', {
bubbles: true,
composed: true,
}));
}, 120);
}

private handleSuggestionSelect(item: { value: string; labelText: string }) {
if (this.disabled || this.readonly) return;
this.value = item.value;
this.searchQuery = item.labelText || item.value;
this.isOpen = false;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value }
}));
}

private async handleGeolocation() {
if (this.disabled || this.readonly || this.geoLoading) return;
if (!navigator.geolocation) return;
this.geoLoading = true;
try {
const position = await new Promise<GeolocationPosition>((resolve, reject) => {
navigator.geolocation.getCurrentPosition(resolve, reject);
});
const lat = position.coords.latitude;
const lng = position.coords.longitude;
this.value = `${lat},${lng}`;
this.searchQuery = this.value;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value }
}));
this.dispatchEvent(new CustomEvent('search', {
bubbles: true,
composed: true,
detail: { query: this.value }
}));
} finally {
this.geoLoading = false;
}
}

// ===========================================================================
// RENDER PARTS
// ===========================================================================
private renderLabel(): TemplateResult {
if (!this.hasSlot('Label')) return html``;
return html`
<label id=${this.labelId} for=${this.inputId} class="mb-1 block text-sm text-slate-600 dark:text-slate-400">
${unsafeHTML(this.getSlotContent('Label'))}
</label>
`;
}

private renderHelper(hasError: boolean): TemplateResult {
if (!this.isEditing) return html``;
if (hasError) {
const errorMessage = this.error || this.msg.required;
return html`<p id=${this.errorId} class="mt-1 text-xs text-red-600 dark:text-red-400">${unsafeHTML(String(errorMessage))}</p>`;
}
if (this.hasSlot('Helper')) {
return html`<p id=${this.helperId} class="mt-1 text-xs text-slate-500 dark:text-slate-400">${unsafeHTML(this.getSlotContent('Helper'))}</p>`;
}
return html``;
}

private renderSuggestions(hasError: boolean): TemplateResult {
if (!this.isEditing || !this.isOpen) return html``;
const items = this.getSuggestions();
const isLoading = this.loading || this.geoLoading;
return html`
<div class=${this.getPanelClasses()} role="listbox" id=${this.listboxId} aria-label="Suggestions">
${isLoading ? html`<div class="px-3 py-2 text-slate-500 dark:text-slate-400">${this.msg.loading}</div>` : html``}
${!isLoading && items.length === 0 ? html`
<div class="px-3 py-2 text-slate-500 dark:text-slate-400">
${this.hasSlot('Empty') ? unsafeHTML(this.getSlotContent('Empty')) : this.msg.noResults}
</div>
` : html``}
${!isLoading ? items.map(item => {
const isSelected = this.value === item.value;
return html`
<div
class=${this.getItemClasses(isSelected, this.disabled || this.readonly)}
role="option"
aria-selected=${isSelected ? 'true' : 'false'}
@mousedown=${(e: MouseEvent) => { e.preventDefault(); this.handleSuggestionSelect(item); }}
>
${unsafeHTML(item.labelHtml)}
</div>
`;
}) : html``}
</div>
`;
}

private renderMap(): TemplateResult {
if (!this.showMap) return html``;
const coords = this.parseValue();
if (!coords) return html``;
return html`
<div class="mt-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4">
<div class="flex items-center gap-3">
<div class="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 dark:bg-sky-900/40">
<svg viewBox="0 0 24 24" class="h-6 w-6 text-sky-600 dark:text-sky-300" aria-hidden="true">
${svg`<path d="M12 2C8.69 2 6 4.69 6 8c0 4.19 4.94 11.02 5.15 11.32a1 1 0 0 0 1.7 0C13.06 19.02 18 12.19 18 8c0-3.31-2.69-6-6-6zm0 8.5A2.5 2.5 0 1 1 12 5a2.5 2.5 0 0 1 0 5.5z" fill="currentColor"></path>`}
</svg>
</div>
<div>
<p class="text-sm text-slate-900 dark:text-slate-100">${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}</p>
<p class="text-xs text-slate-500 dark:text-slate-400">Map preview</p>
</div>
</div>
</div>
`;
}

// ===========================================================================
// RENDER
// ===========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];

const hasError = this.isEditing && (Boolean(this.error) || (this.required && !this.value));
const placeholder = this.placeholder || this.getSlotAttr('Trigger', 'placeholder') || this.msg.placeholder;
const ariaDescribedBy = hasError ? this.errorId : (this.hasSlot('Helper') ? this.helperId : undefined);
const selected = this.getSelectedLabel();

if (!this.isEditing) {
const display = this.value
? (selected ? unsafeHTML(selected.html) : html`<span class="text-slate-900 dark:text-slate-100">${this.value}</span>`)
: (this.hasSlot('Empty') ? unsafeHTML(this.getSlotContent('Empty')) : html`<span class="text-slate-500 dark:text-slate-400">${this.msg.empty}</span>`);
return html`
<div class="w-full">
${this.renderLabel()}
<div class="text-sm text-slate-900 dark:text-slate-100">${display}</div>
${this.renderMap()}
</div>
`;
}

return html`
<div class="relative w-full">
${this.renderLabel()}
<div class="flex items-center gap-2">
<div class="flex-1">
<input
id=${this.inputId}
name=${this.name || ''}
class=${this.getInputClasses(hasError)}
.placeholder=${placeholder}
.value=${this.searchQuery}
?disabled=${this.disabled}
?readonly=${this.readonly}
role="combobox"
aria-expanded=${this.isOpen ? 'true' : 'false'}
aria-autocomplete="list"
aria-controls=${this.listboxId}
aria-labelledby=${this.hasSlot('Label') ? this.labelId : ''}
aria-describedby=${ariaDescribedBy || ''}
aria-invalid=${hasError ? 'true' : 'false'}
aria-required=${this.required ? 'true' : 'false'}
@input=${this.handleInput}
@focus=${this.handleFocus}
@blur=${this.handleBlur}
/>
</div>
${this.allowGeolocation ? html`
<button
type="button"
class="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
?disabled=${this.disabled || this.readonly || this.loading || this.geoLoading}
aria-label=${this.msg.useLocation}
@click=${this.handleGeolocation}
>
${this.hasSlot('Trigger') ? unsafeHTML(this.getSlotContent('Trigger')) : this.msg.useLocation}
</button>
` : html``}
</div>
${this.renderSuggestions(hasError)}
${this.renderHelper(hasError)}
${this.renderMap()}
</div>
`;
}
}
