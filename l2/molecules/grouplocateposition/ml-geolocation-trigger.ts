/// <mls fileReference="_102040_/l2/molecules/grouplocateposition/ml-geolocation-trigger.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML GEOLOCATION TRIGGER MOLECULE
// =============================================================================
// Skill Group: groupLocatePosition
// This molecule does NOT contain business logic.
import { html, svg, TemplateResult } from'lit';
import { customElement, state } from'lit/decorators.js';
import { unsafeHTML } from'lit/directives/unsafe-html.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
 placeholder:'Search address or coordinates',
 noResults:'No results found',
 loading:'Loading...',
 useLocation:'Use current location',
 required:'Location is required',
 empty:'—',
};

type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
 en: message_en,
 pt: {
 placeholder:'Buscar endereço ou coordenadas',
 noResults:'Nenhum resultado encontrado',
 loading:'Carregando...',
 useLocation:'Usar localização atual',
 required:'Localização é obrigatória',
 empty:'—',
 },
};
/// **collab_i18n_end**

@customElement('grouplocateposition--ml-geolocation-trigger')
export class MlGeolocationTriggerMolecule extends MoleculeAuraElement {
 private static instanceCount = 0;
 private msg: MessageType = messages.en;
 private baseId = `geo-${MlGeolocationTriggerMolecule.instanceCount++}`;

 // ===========================================================================
 // SLOT TAGS
 // ===========================================================================
 slotTags = ['Label','Helper','Trigger','Suggestions','Item','Empty'];

 // ===========================================================================
 // PROPERTIES — From Contract
 // ===========================================================================
 @propertyDataSource({ type: String })
 value: string | null = null;

 @propertyDataSource({ type: String })
 error: string ='';

 @propertyDataSource({ type: String })
 name: string ='';

 @propertyDataSource({ type: String })
 placeholder: string ='';

 @propertyDataSource({ type: Boolean, attribute:'show-map' })
 showMap: boolean = false;

 @propertyDataSource({ type: Boolean, attribute:'allow-geolocation' })
 allowGeolocation: boolean = false;

 @propertyDataSource({ type: Boolean, attribute:'is-editing' })
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
 // ===========================================================================
 @state()
 private searchQuery: string ='';

 @state()
 private isOpen: boolean = false;

 @state()
 private geoLoading: boolean = false;

 // ===========================================================================
 // STATE CHANGE HANDLER
 // ===========================================================================
 handleIcaStateChange(key: string, value: any) {
 const valueAttr = this.getAttribute('value');
 if (valueAttr === `{{${key}}}`) {
 this.searchQuery = this.resolveLabelByValue(value) || String(value ||'');
 }
 this.requestUpdate();
 }

 // ===========================================================================
 // LIFECYCLE
 // ===========================================================================
 firstUpdated() {
 this.searchQuery = this.resolveLabelByValue(this.value) || String(this.value ||'');
 }

 // ===========================================================================
 // HELPERS
 // ===========================================================================
 private parseValue(): { lat: number; lng: number } | null {
 if (!this.value) return null;
 const [lat, lng] = this.value.split(',').map(Number);
 return isNaN(lat) || isNaN(lng) ? null : { lat, lng };
 }

 private getSuggestions(): Array<{ value: string; label: string; textLabel: string }> {
 const suggestionsContainer = this.getSlot('Suggestions');
 if (!suggestionsContainer) return [];
 const items = Array.from(suggestionsContainer.querySelectorAll('Item'));
 return items.map((el) => {
 const label = el.innerHTML ||'';
 return {
 value: el.getAttribute('value') ||'',
 label,
 textLabel: this.htmlToText(label),
 };
 });
 }

 private resolveLabelByValue(value: string | null): string {
 if (!value) return'';
 const match = this.getSuggestions().find((item) => item.value === value);
 return match?.textLabel || value;
 }

 private htmlToText(value: string): string {
 const temp = document.createElement('div');
 temp.innerHTML = value;
 return temp.textContent ||'';
 }

 private getInputClasses(hasError: boolean): string {
 const base = [
'w-full rounded-lg px-3 py-2 text-sm border transition',
'ml-surface-bg',
'ml-text',
'placeholder:ml-text-faint',
'',
 ];
 const state = [
 hasError ?'ml-border-error' :'ml-border',
 this.disabled ?'ml-disabled' :'',
 this.readonly ?'ml-surface-dim-bg' :'',
 ];
 return [...base, ...state].filter(Boolean).join(' ');
 }

 private getItemClasses(isSelected: boolean, isDisabled: boolean): string {
 return [
'w-full text-left rounded-md px-3 py-2 text-sm transition border',
 isSelected
 ?'ml-primary-dim-bg ml-primary-text ml-border-focus'
 :'ml-text border-transparent',
 !isDisabled && !isSelected ?'hover:ml-surface-dim-bg' :'',
 isDisabled ?'ml-disabled' :'cursor-pointer',
 ].filter(Boolean).join(' ');
 }

 private getPanelClasses(): string {
 return [
'mt-2 rounded-lg border p-2 space-y-1',
'ml-surface-bg',
'ml-border',
 ].join(' ');
 }

 private getMapClasses(): string {
 return [
'mt-3 rounded-lg border p-3',
'ml-surface-dim-bg',
'ml-border',
 ].join(' ');
 }

 // ===========================================================================
 // EVENT HANDLERS
 // ===========================================================================
 private handleInput(event: Event) {
 event.stopPropagation();
 if (this.disabled || this.readonly) return;
 const input = event.target as HTMLInputElement;
 this.searchQuery = input.value;
 this.isOpen = true;
 this.dispatchEvent(new CustomEvent('search', {
 bubbles: true,
 composed: true,
 detail: { query: this.searchQuery },
 }));
 }

 private handleFocus() {
 if (this.disabled) return;
 this.isOpen = true;
 this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
 }

 private handleBlur() {
 setTimeout(() => {
 this.isOpen = false;
 this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
 }, 150);
 }

 private handleSelect(itemValue: string, itemLabel: string) {
 if (this.disabled || this.readonly || this.loading || this.geoLoading) return;
 this.value = itemValue || null;
 this.searchQuery = this.htmlToText(itemLabel ||'');
 this.isOpen = false;
 this.dispatchEvent(new CustomEvent('change', {
 bubbles: true,
 composed: true,
 detail: { value: this.value },
 }));
 }

 private handleGeolocation() {
 if (!this.allowGeolocation || !this.isEditing || this.disabled || this.readonly) return;
 if (this.geoLoading || this.loading) return;
 if (!navigator.geolocation) {
 this.dispatchEvent(new CustomEvent('geoerror', {
 bubbles: true,
 composed: true,
 detail: { code:'UNSUPPORTED', message:'Geolocation not supported' },
 }));
 return;
 }
 this.geoLoading = true;
 navigator.geolocation.getCurrentPosition(
 (position) => {
 const coords = `${position.coords.latitude},${position.coords.longitude}`;
 this.value = coords;
 this.searchQuery = coords;
 this.geoLoading = false;
 this.dispatchEvent(new CustomEvent('change', {
 bubbles: true,
 composed: true,
 detail: { value: this.value },
 }));
 this.dispatchEvent(new CustomEvent('search', {
 bubbles: true,
 composed: true,
 detail: { query: coords },
 }));
 },
 (error) => {
 this.geoLoading = false;
 this.dispatchEvent(new CustomEvent('geoerror', {
 bubbles: true,
 composed: true,
 detail: { code: String(error.code), message: error.message },
 }));
 },
 { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
 );
 }

 // ===========================================================================
 // RENDER PARTS
 // ===========================================================================
 private renderLabel(labelId: string): TemplateResult {
 if (!this.hasSlot('Label')) return html``;
 return html`
 <label id=${labelId} class="${cn('mb-1 block text-sm ml-text-muted', this.getSlotClass('Label'))}">
 ${unsafeHTML(this.getSlotContent('Label'))}
 </label>
 `;
 }

 private renderHelperOrError(errorText: string, helperId: string): TemplateResult {
 if (!this.isEditing) return html``;
 if (errorText) {
 return html`<p id=${helperId} class="mt-1 text-xs ml-error-text">${unsafeHTML(errorText)}</p>`;
 }
 if (this.hasSlot('Helper')) {
 return html`<p id=${helperId} class="${cn('mt-1 text-xs ml-text-muted', this.getSlotClass('Helper'))}">${unsafeHTML(this.getSlotContent('Helper'))}</p>`;
 }
 return html``;
 }

 private renderTrigger(effectiveLoading: boolean): TemplateResult {
 if (!this.isEditing || !this.allowGeolocation) return html``;
 const label = this.hasSlot('Trigger')
 ? this.getSlotContent('Trigger')
 : this.msg.useLocation;
 const buttonClasses = [
'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition',
'ml-surface-bg',
'ml-text',
'ml-border',
'hover:ml-surface-dim-bg',
 (this.disabled || this.readonly || effectiveLoading) ?'ml-disabled' :'',
 ].filter(Boolean).join(' ');
 return html`
 <button
 type="button"
 class=${buttonClasses}
 ?disabled=${this.disabled || this.readonly || effectiveLoading}
 aria-label=${this.msg.useLocation}
 @click=${this.handleGeolocation}
 >
 ${effectiveLoading ? this.msg.loading : unsafeHTML(label)}
 </button>
 `;
 }

 private renderSuggestions(items: Array<{ value: string; label: string }>, effectiveLoading: boolean): TemplateResult {
 if (!this.isEditing || !this.isOpen) return html``;
 const hasItems = items.length > 0;
 return html`
 <div class=${this.getPanelClasses()} role="listbox">
 ${effectiveLoading ? html`
 <div class="px-3 py-2 text-sm ml-text-muted">${this.msg.loading}</div>
 ` :''}
 ${!effectiveLoading && hasItems ? html`
 ${items.map((item) => {
 const isSelected = this.value === item.value;
 const isDisabled = this.disabled || this.readonly || effectiveLoading;
 return html`
 <button
 type="button"
 class=${this.getItemClasses(isSelected, isDisabled)}
 role="option"
 aria-selected=${isSelected ?'true' :'false'}
 ?disabled=${isDisabled}
 @click=${() => this.handleSelect(item.value, item.label)}
 >
 ${unsafeHTML(item.label)}
 </button>
 `;
 })}
 ` :''}
 ${!effectiveLoading && !hasItems ? html`
 <div class="px-3 py-2 text-sm ml-text-muted">
 ${this.hasSlot('Empty') ? unsafeHTML(this.getSlotContent('Empty')) : this.msg.noResults}
 </div>
 ` :''}
 </div>
 `;
 }

 private renderViewMode(valueLabel: string): TemplateResult {
 const display = valueLabel || (this.hasSlot('Empty') ? this.getSlotContent('Empty') : this.msg.empty);
 return html`
 <div class="rounded-lg border px-3 py-2 text-sm ml-surface-bg ml-text ml-border">
 ${unsafeHTML(display)}
 </div>
 `;
 }

 private renderMapPreview(): TemplateResult {
 const parsed = this.parseValue();
 if (!this.showMap || !parsed) return html``;
 return html`
 <div class=${this.getMapClasses()}>
 <div class="flex items-center justify-between text-xs ml-text-muted">
 <span>Lat: ${parsed.lat.toFixed(5)}</span>
 <span>Lng: ${parsed.lng.toFixed(5)}</span>
 </div>
 <div class="mt-2 flex items-center justify-center rounded-md ml-surface-bg border ml-border p-3">
 <svg viewBox="0 0 64 64" class="h-16 w-16 ml-primary-text" fill="currentColor" aria-hidden="true">
 ${svg`
 <path d="M32 4c-9.4 0-17 7.6-17 17 0 12.7 17 35 17 35s17-22.3 17-35c0-9.4-7.6-17-17-17zm0 24.5c-4.1 0-7.5-3.4-7.5-7.5S27.9 13.5 32 13.5 39.5 16.9 39.5 21 36.1 28.5 32 28.5z" />
 `}
 </svg>
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

 const effectiveLoading = this.loading || this.geoLoading;
 const requiredError = this.required && !this.value;
 const errorText = this.error || (requiredError ? this.msg.required :'');
 const labelId = `${this.baseId}-label`;
 const helperId = `${this.baseId}-helper`;
 const inputId = `${this.baseId}-input`;
 const suggestions = this.getSuggestions();
 const valueLabel = this.resolveLabelByValue(this.value);

 return html`
 <div class="${cn('flex flex-col', this.cssClass)}">
 ${this.renderLabel(labelId)}
 ${this.isEditing ? html`
 <div class="flex flex-col gap-2">
 <input
 id=${inputId}
 class=${this.getInputClasses(!!errorText)}
 type="text"
 .value=${this.searchQuery}
 name=${this.name}
 placeholder=${this.placeholder || this.msg.placeholder}
 ?disabled=${this.disabled}
 ?readonly=${this.readonly}
 role="combobox"
 aria-autocomplete="list"
 aria-expanded=${this.isOpen ?'true' :'false'}
 aria-labelledby=${this.hasSlot('Label') ? labelId :''}
 aria-describedby=${errorText || this.hasSlot('Helper') ? helperId :''}
 aria-invalid=${errorText ?'true' :'false'}
 aria-required=${this.required ?'true' :'false'}
 @input=${this.handleInput}
 @focus=${this.handleFocus}
 @blur=${this.handleBlur}
 
 @change=${(e: Event) => e.stopPropagation()}
/>
 <div class="flex items-center justify-between">
 ${this.renderTrigger(effectiveLoading)}
 </div>
 ${this.renderSuggestions(suggestions, effectiveLoading)}
 </div>
 ` : html`
 ${this.renderViewMode(valueLabel)}
 `}
 ${this.renderMapPreview()}
 ${this.renderHelperOrError(errorText, helperId)}
 </div>
 `;
 }
}
