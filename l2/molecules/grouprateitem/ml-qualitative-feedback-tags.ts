/// <mls fileReference="_102040_/l2/molecules/grouprateitem/ml-qualitative-feedback-tags.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// QUALITATIVE FEEDBACK TAGS MOLECULE
// =============================================================================
// Skill Group: groupRateItem
// This molecule does NOT contain business logic.
import { html, TemplateResult } from'lit';
import { customElement, state } from'lit/decorators.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';
import { unsafeHTML } from'lit/directives/unsafe-html.js';

/// **collab_i18n_start**
const message_en = {
 required:'Required',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
 en: message_en,
 pt: {
 required:'Obrigatório',
 },
};
/// **collab_i18n_end**

@customElement('grouprateitem--ml-qualitative-feedback-tags')
export class QualitativeFeedbackTagsMolecule extends MoleculeAuraElement {
 private msg: MessageType = messages.en;

 // ==========================================================================
 // SLOT TAGS
 // ==========================================================================
 slotTags = ['Label','Helper','Item'];

 // ==========================================================================
 // PROPERTIES — From Contract
 // ==========================================================================
 @propertyDataSource({ type: Number })
 value: number | null = null;

 @propertyDataSource({ type: String })
 error: string ='';

 @propertyDataSource({ type: String })
 name: string ='';

 @propertyDataSource({ type: Number })
 min: number = 0;

 @propertyDataSource({ type: Number })
 max: number = 5;

 @propertyDataSource({ type: Number })
 step: number = 1;

 @propertyDataSource({ type: Boolean, attribute:'is-editing' })
 isEditing: boolean = true;

 @propertyDataSource({ type: Boolean })
 disabled: boolean = false;

 @propertyDataSource({ type: Boolean })
 readonly: boolean = false;

 @propertyDataSource({ type: Boolean })
 required: boolean = false;

 // ==========================================================================
 // INTERNAL STATE
 // ==========================================================================
 @state()
 private hoverValue: number | null = null;

 private labelId = `label-${Math.floor(Math.random() * 1000000)}`;
 private errorId = `error-${Math.floor(Math.random() * 1000000)}`;
 private hasFocus = false;

 // ==========================================================================
 // EVENT HANDLERS
 // ==========================================================================
 private handleSelect(value: number) {
 if (this.disabled || this.readonly) return;
 this.value = value;
 this.dispatchEvent(new CustomEvent('change', {
 bubbles: true,
 composed: true,
 detail: { value: this.value },
 }));
 }

 private handleFocusIn() {
 if (!this.isEditing || this.disabled || this.readonly) return;
 if (this.hasFocus) return;
 this.hasFocus = true;
 this.dispatchEvent(new CustomEvent('focus', {
 bubbles: true,
 composed: true,
 detail: {},
 }));
 }

 private handleFocusOut(e: FocusEvent) {
 if (!this.isEditing || this.disabled || this.readonly) return;
 const related = e.relatedTarget as Node | null;
 if (related && this.contains(related)) return;
 this.hasFocus = false;
 this.hoverValue = null;
 this.dispatchEvent(new CustomEvent('blur', {
 bubbles: true,
 composed: true,
 detail: {},
 }));
 }

 private handleKeydown(e: KeyboardEvent, items: RatingItem[]) {
 if (!this.isEditing || this.disabled || this.readonly) return;
 if (!items.length) return;

 const keys = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',''];
 if (!keys.includes(e.key)) return;

 e.preventDefault();

 const target = e.target as HTMLElement | null;
 const targetIndex = target?.getAttribute('data-option-index');
 const currentIndex = targetIndex ? Number(targetIndex) : this.getActiveIndex(items);

 if (e.key ==='Enter' || e.key ==='') {
 const item = items[currentIndex] ?? items[0];
 if (item) this.handleSelect(item.value);
 return;
 }

 const delta = e.key ==='ArrowRight' || e.key ==='ArrowDown' ? 1 : -1;
 const nextIndex = Math.min(items.length - 1, Math.max(0, currentIndex + delta));
 const nextItem = items[nextIndex];
 const nextEl = this.querySelector<HTMLButtonElement>(`[data-option-index="${nextIndex}"]`);
 if (nextItem) {
 this.hoverValue = nextItem.value;
 }
 nextEl?.focus();
 }

 private handleOptionEnter(value: number) {
 if (!this.isEditing || this.disabled || this.readonly) return;
 this.hoverValue = value;
 }

 private handleOptionLeave() {
 if (!this.isEditing || this.disabled || this.readonly) return;
 this.hoverValue = null;
 }

 private handleOptionFocus(value: number) {
 if (!this.isEditing || this.disabled || this.readonly) return;
 this.hoverValue = value;
 }

 private handleOptionBlur() {
 if (!this.isEditing || this.disabled || this.readonly) return;
 this.hoverValue = null;
 }

 // ==========================================================================
 // HELPERS
 // ==========================================================================
 private getItems(): RatingItemSet {
 const slotItems = this.getSlots('Item');
 if (slotItems.length > 0) {
 const items = slotItems
 .map((el) => {
 const value = Number(el.getAttribute('value'));
 if (Number.isNaN(value)) return null;
 const label = el.innerHTML;
 const ariaLabel = el.getAttribute('aria-label') || el.textContent?.trim() || String(value);
 return { value, label, ariaLabel };
 })
 .filter((item): item is RatingItem => item !== null);
 return { items, isCustom: true };
 }

 const items: RatingItem[] = [];
 for (let v = this.min; v <= this.max; v += this.step) {
 items.push({ value: v, label: String(v), ariaLabel: String(v) });
 }
 return { items, isCustom: false };
 }

 private getActiveIndex(items: RatingItem[]): number {
 if (!items.length) return 0;
 const activeValue = this.value ?? items[0].value;
 const index = items.findIndex((item) => item.value === activeValue);
 return index >= 0 ? index : 0;
 }

 private getDisplayValue(items: RatingItemSet): TemplateResult {
 if (this.value === null) {
 return html`<span class="ml-text-faint">—</span>`;
 }
 if (items.isCustom) {
 const selected = items.items.find((item) => item.value === this.value);
 if (selected) {
 return html`<span class="ml-text">${unsafeHTML(selected.label)}</span>`;
 }
 }
 return html`<span class="ml-text">${String(this.value)}</span>`;
 }

 private getOptionClasses(isActive: boolean, isSelected: boolean, hasError: boolean): string {
 return [
'flex items-center justify-center rounded-md px-3 py-2 text-sm border transition cursor-pointer',
'ml-surface-bg',
'ml-text',
 hasError ?'ml-border-error' :'ml-border',
 isActive || isSelected
 ?'ml-primary-dim-bg ml-primary-text ml-border-focus'
 :'hover:ml-surface-dim-bg',
 this.disabled || this.readonly ?'ml-disabled' :'',
 !this.disabled && !this.readonly ?'' :'',
 ].filter(Boolean).join(' ');
 }

 private renderLabel(): TemplateResult {
 if (!this.hasSlot('Label')) return html``;
 return html`
 <div id="${this.labelId}" class="${cn('mb-2 text-sm font-medium ml-text-muted', this.getSlotClass('Label'))}">
 ${unsafeHTML(this.getSlotContent('Label'))}
 </div>
 `;
 }

 private renderFeedback(hasError: boolean, errorMessage: string): TemplateResult {
 if (!this.isEditing) return html``;
 if (hasError) {
 return html`<p id="${this.errorId}" class="mt-1 text-xs ml-error-text">${unsafeHTML(errorMessage)}</p>`;
 }
 if (this.hasSlot('Helper')) {
 return html`<p class="${cn('mt-1 text-xs ml-text-muted', this.getSlotClass('Helper'))}">${unsafeHTML(this.getSlotContent('Helper'))}</p>`;
 }
 return html``;
 }

 private renderViewMode(items: RatingItemSet): TemplateResult {
 return html`
 <div class="${cn('flex flex-col', this.cssClass)}">
 ${this.renderLabel()}
 <div class="text-sm ml-text">
 ${this.getDisplayValue(items)}
 </div>
 </div>
 `;
 }

 private renderEditMode(itemsSet: RatingItemSet): TemplateResult {
 const items = itemsSet.items;
 const requiredError = this.required && this.value === null;
 const errorMessage = this.error || (requiredError ? this.msg.required :'');
 const hasError = errorMessage !=='';
 const activeValue = this.hoverValue !== null ? this.hoverValue : this.value;

 return html`
 <div class="${cn('flex flex-col', this.cssClass)}">
 ${this.renderLabel()}
 <div
 class="flex flex-row items-center gap-2"
 role="radiogroup"
 aria-labelledby="${this.hasSlot('Label') ? this.labelId :''}"
 aria-describedby="${hasError ? this.errorId :''}"
 aria-invalid="${hasError ?'true' :'false'}"
 aria-required="${this.required ?'true' :'false'}"
 aria-readonly="${this.readonly ?'true' :'false'}"
 @focusin=${this.handleFocusIn}
 @focusout=${this.handleFocusOut}
 @keydown=${(e: KeyboardEvent) => this.handleKeydown(e, items)}
 >
 ${items.map((item, index) => {
 const isSelected = this.value === item.value;
 const isActive = activeValue === item.value;
 const isTabbable = index === this.getActiveIndex(items);
 const content = itemsSet.isCustom ? unsafeHTML(item.label) : item.label;
 return html`
 <button
 type="button"
 class="${this.getOptionClasses(isActive, isSelected, hasError)}"
 role="radio"
 aria-checked="${isSelected ?'true' :'false'}"
 aria-label="${item.ariaLabel}"
 aria-disabled="${this.disabled ?'true' :'false'}"
 tabindex="${isTabbable ? 0 : -1}"
 data-option-index="${index}"
 @mouseenter=${() => this.handleOptionEnter(item.value)}
 @mouseleave=${this.handleOptionLeave}
 @focus=${() => this.handleOptionFocus(item.value)}
 @blur=${this.handleOptionBlur}
 @click=${() => this.handleSelect(item.value)}
 >
 ${content}
 </button>
 `;
 })}
 </div>
 ${this.renderFeedback(hasError, errorMessage)}
 </div>
 `;
 }

 // ==========================================================================
 // RENDER
 // ==========================================================================
 render() {
 const lang = this.getMessageKey(messages);
 this.msg = messages[lang];

 const itemsSet = this.getItems();
 if (!this.isEditing) {
 return this.renderViewMode(itemsSet);
 }
 return this.renderEditMode(itemsSet);
 }
}

type RatingItem = {
 value: number;
 label: string;
 ariaLabel: string;
};

type RatingItemSet = {
 items: RatingItem[];
 isCustom: boolean;
};
