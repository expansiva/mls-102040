/// <mls fileReference="_102040_/l2/molecules/grouplocateposition/ml-address-autocomplete.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ADDRESS AUTOCOMPLETE MOLECULE
// =============================================================================
// Skill Group: groupLocatePosition
// This molecule does NOT contain business logic.
import { html, nothing } from'lit';
import { customElement, state } from'lit/decorators.js';
import { unsafeHTML } from'lit/directives/unsafe-html.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
 placeholder:'Search address',
 empty:'No results',
 loading:'Loading...',
 useLocation:'Use current location',
 noValue:'—',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
 en: message_en,
};
/// **collab_i18n_end**

@customElement('grouplocateposition--ml-address-autocomplete')
export class AddressAutocompleteMolecule extends MoleculeAuraElement {
 private msg: MessageType = messages.en;
 private inputId = `addr-${Math.random().toString(36).slice(2)}`;
 private labelId = `${this.inputId}-label`;
 private helperId = `${this.inputId}-helper`;
 private errorId = `${this.inputId}-error`;
 private debounceTimer: number | null = null;
 private mutationObserver: MutationObserver | null = null;

 // ==========================================================================
 // SLOT TAGS
 // ==========================================================================
 slotTags = ['Label','Helper','Trigger','Suggestions','Item','Empty'];

 // ==========================================================================
 // PROPERTIES — From Contract
 // ==========================================================================
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

 // ==========================================================================
 // INTERNAL STATE
 // ==========================================================================
 @state()
 private searchQuery: string ='';

 @state()
 private isOpen: boolean = false;

 // ==========================================================================
 // LIFECYCLE
 // ==========================================================================
 firstUpdated() {
 this.mutationObserver = new MutationObserver(() => {
 this.syncSearchQueryFromValue();
 this.requestUpdate();
 });
 this.mutationObserver.observe(this, { childList: true, subtree: true });
 this.syncSearchQueryFromValue();
 }

 disconnectedCallback() {
 super.disconnectedCallback();
 if (this.mutationObserver) {
 this.mutationObserver.disconnect();
 this.mutationObserver = null;
 }
 }

 // ==========================================================================
 // STATE CHANGE HANDLER
 // ==========================================================================
 handleIcaStateChange(key: string, value: any) {
 const valueAttr = this.getAttribute('value');
 if (valueAttr === `{{${key}}}`) {
 this.syncSearchQueryFromValue(value as string | null);
 }
 this.requestUpdate();
 }

 // ==========================================================================
 // PARSING & SUGGESTIONS
 // ==========================================================================
 private parseValue(): { lat: number; lng: number } | null {
 if (!this.value) return null;
 const [lat, lng] = this.value.split(',').map(Number);
 return isNaN(lat) || isNaN(lng) ? null : { lat, lng };
 }

 private getSuggestions(): Array<{ value: string; label: string }> {
 const suggestionsContainer = this.getSlot('Suggestions');
 if (!suggestionsContainer) return [];
 return Array.from(suggestionsContainer.querySelectorAll('Item')).map((el) => ({
 value: el.getAttribute('value') ||'',
 label: el.innerHTML,
 }));
 }

 private findLabelForValue(val: string | null): string {
 if (!val) return'';
 const items = this.getSuggestions();
 const match = items.find((item) => item.value === val);
 return match ? match.label : val;
 }

 private syncSearchQueryFromValue(overrideValue?: string | null) {
 const currentValue = overrideValue !== undefined ? overrideValue : this.value;
 const label = this.findLabelForValue(currentValue);
 this.searchQuery = label;
 }

 // ==========================================================================
 // EVENTS
 // ==========================================================================
 private emitChange(value: string | null) {
 this.dispatchEvent(
 new CustomEvent('change', {
 bubbles: true,
 composed: true,
 detail: { value },
 })
 );
 }

 private emitSearch(query: string) {
 this.dispatchEvent(
 new CustomEvent('search', {
 bubbles: true,
 composed: true,
 detail: { query },
 })
 );
 }

 private emitBlur() {
 this.dispatchEvent(
 new CustomEvent('blur', {
 bubbles: true,
 composed: true,
 })
 );
 }

 private emitFocus() {
 this.dispatchEvent(
 new CustomEvent('focus', {
 bubbles: true,
 composed: true,
 })
 );
 }

 // ==========================================================================
 // HANDLERS
 // ==========================================================================
 private handleInput(e: Event) {
 e.stopPropagation();
 if (this.disabled || this.readonly || this.loading) return;
 const input = e.target as HTMLInputElement;
 this.searchQuery = input.value;
 this.isOpen = true;

 if (this.searchQuery.trim() ==='') {
 this.value = null;
 this.emitChange(null);
 this.emitSearch('');
 return;
 }

 if (this.debounceTimer) window.clearTimeout(this.debounceTimer);
 this.debounceTimer = window.setTimeout(() => {
 this.emitSearch(this.searchQuery.trim());
 }, 350);
 }

 private handleItemSelect(item: { value: string; label: string }) {
 if (this.disabled || this.readonly || this.loading) return;
 this.value = item.value;
 this.searchQuery = item.label;
 this.isOpen = false;
 this.emitChange(this.value);
 }

 private handleInputFocus() {
 if (this.disabled || this.readonly || this.loading) return;
 this.isOpen = true;
 this.emitFocus();
 }

 private handleInputBlur() {
 window.setTimeout(() => {
 this.isOpen = false;
 this.requestUpdate();
 }, 150);
 this.emitBlur();
 }

 private handleGeoLocation() {
 if (this.disabled || this.readonly || this.loading) return;
 if (!navigator.geolocation) return;
 navigator.geolocation.getCurrentPosition((pos) => {
 const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
 this.value = coords;
 this.searchQuery = coords;
 this.emitChange(coords);
 this.emitSearch(coords);
 });
 }

 // ==========================================================================
 // RENDER HELPERS
 // ==========================================================================
 private getInputClasses(isError: boolean): string {
 return [
'w-full rounded-lg px-3 py-2 text-sm border transition',
'ml-surface-bg',
'ml-text',
'placeholder:ml-text-faint',
 isError
 ?'ml-border-error'
 :'ml-border',
'',
 this.disabled || this.loading ?'ml-disabled' :'',
 this.readonly ?'ml-surface-dim-bg' :'',
 ]
 .filter(Boolean)
 .join(' ');
 }

 private getSuggestionPanelClasses(): string {
 return [
'mt-2 max-h-56 overflow-auto rounded-lg border p-2',
'ml-surface-bg',
'ml-border',
 this.loading ?'opacity-50 pointer-events-none' :'',
 ]
 .filter(Boolean)
 .join(' ');
 }

 private getSuggestionItemClasses(isSelected: boolean): string {
 return [
'w-full rounded-md px-3 py-2 text-sm transition cursor-pointer',
 isSelected
 ?'ml-primary-dim-bg ml-primary-text border ml-border-focus'
 :'ml-text border border-transparent',
 !isSelected ?'hover:ml-surface-dim-bg' :'',
 ]
 .filter(Boolean)
 .join(' ');
 }

 private renderLabel() {
 if (!this.hasSlot('Label')) return nothing;
 return html`<label id=${this.labelId} class="${cn('mb-1 block text-sm ml-text-muted', this.getSlotClass('Label'))}">
 ${unsafeHTML(this.getSlotContent('Label'))}
 </label>`;
 }

 private renderHelperOrError(isError: boolean) {
 if (!this.isEditing) return nothing;
 if (isError) {
 return html`<p id=${this.errorId} class="mt-1 text-xs ml-error-text">
 ${unsafeHTML(this.error)}
 </p>`;
 }
 if (this.hasSlot('Helper')) {
 return html`<p id=${this.helperId} class="${cn('mt-1 text-xs ml-text-muted', this.getSlotClass('Helper'))}">
 ${unsafeHTML(this.getSlotContent('Helper'))}
 </p>`;
 }
 return nothing;
 }

 private renderEmptyState() {
 const emptyContent = this.hasSlot('Empty') ? this.getSlotContent('Empty') : this.msg.empty;
 return html`<div class="px-3 py-2 text-sm ml-text-muted">${unsafeHTML(emptyContent)}</div>`;
 }

 private renderSuggestionsPanel() {
 if (!this.isOpen || !this.isEditing) return nothing;
 const items = this.getSuggestions();
 return html`
 <div class=${this.getSuggestionPanelClasses()} role="listbox">
 ${this.loading
 ? html`<div class="px-3 py-2 text-sm ml-text-muted">${this.msg.loading}</div>`
 : items.length === 0
 ? this.renderEmptyState()
 : items.map((item) => {
 const selected = item.value === this.value;
 return html`
 <button
 type="button"
 class=${this.getSuggestionItemClasses(selected)}
 role="option"
 aria-selected=${selected ?'true' :'false'}
 @click=${() => this.handleItemSelect(item)}
 >
 ${unsafeHTML(item.label)}
 </button>
 `;
 })}
 </div>
 `;
 }

 private renderGeolocationButton() {
 if (!this.allowGeolocation || !this.isEditing) return nothing;
 const triggerContent = this.hasSlot('Trigger')
 ? unsafeHTML(this.getSlotContent('Trigger'))
 : html`<span class="text-sm ml-text-muted">${this.msg.useLocation}</span>`;
 return html`
 <button
 type="button"
 class="ml-2 rounded-lg border ml-border ml-surface-bg px-3 py-2 text-sm ml-text hover:ml-surface-dim-bg"
 aria-label=${this.msg.useLocation}
 ?disabled=${this.disabled || this.readonly || this.loading}
 @click=${this.handleGeoLocation}
 >
 ${triggerContent}
 </button>
 `;
 }

 private renderMapPreview() {
 if (!this.showMap) return nothing;
 const coords = this.parseValue();
 if (!coords) return nothing;
 return html`
 <div class="mt-3 rounded-lg border ml-border ml-surface-dim-bg p-3 text-xs ml-text-muted">
 <div class="font-semibold ml-text">${coords.lat}, ${coords.lng}</div>
 <div class="mt-1 ml-text-muted">Map preview</div>
 </div>
 `;
 }

 private renderViewMode() {
 const label = this.findLabelForValue(this.value);
 const content = label || (this.hasSlot('Empty') ? this.getSlotContent('Empty') : this.msg.noValue);
 return html`
 <div class="${cn('w-full', this.cssClass)}">
 ${this.renderLabel()}
 <div class="rounded-lg border ml-border ml-surface-bg px-3 py-2 text-sm ml-text">
 ${unsafeHTML(content)}
 </div>
 ${this.renderMapPreview()}
 </div>
 `;
 }

 // ==========================================================================
 // RENDER
 // ==========================================================================
 render() {
 const lang = this.getMessageKey(messages);
 this.msg = messages[lang];

 if (!this.isEditing) {
 return this.renderViewMode();
 }

 const isError = Boolean(this.error) || (this.required && !this.value);
 const placeholder = this.placeholder || this.msg.placeholder;

 return html`
 <div class="${cn('w-full', this.cssClass)}">
 ${this.renderLabel()}
 <div class="flex items-center">
 <input
 id=${this.inputId}
 class=${this.getInputClasses(isError)}
 type="text"
 .value=${this.searchQuery}
 placeholder=${placeholder}
 name=${this.name}
 role="combobox"
 aria-expanded=${this.isOpen ?'true' :'false'}
 aria-autocomplete="list"
 aria-labelledby=${this.hasSlot('Label') ? this.labelId : nothing}
 aria-describedby=${isError ? this.errorId : this.hasSlot('Helper') ? this.helperId : nothing}
 aria-invalid=${isError ?'true' :'false'}
 aria-required=${this.required ?'true' :'false'}
 ?disabled=${this.disabled || this.loading}
 ?readonly=${this.readonly}
 @input=${this.handleInput}
 @focus=${this.handleInputFocus}
 @blur=${this.handleInputBlur}
 
 @change=${(e: Event) => e.stopPropagation()}
/>
 ${this.renderGeolocationButton()}
 </div>
 ${this.renderSuggestionsPanel()}
 ${this.renderHelperOrError(isError)}
 ${this.renderMapPreview()}
 </div>
 `;
 }
}
