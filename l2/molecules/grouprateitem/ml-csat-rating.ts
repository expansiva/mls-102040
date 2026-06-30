/// <mls fileReference="_102040_/l2/molecules/grouprateitem/ml-csat-rating.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// CSAT RATING MOLECULE
// =============================================================================
// Skill Group: groupRateItem
// This molecule does NOT contain business logic.

import { html, TemplateResult } from'lit';
import { customElement, state, property } from'lit/decorators.js';
import { unsafeHTML } from'lit/directives/unsafe-html.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
 noSelection:'—',
 score:'Score',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
 en: message_en,
 pt: {
 noSelection:'—',
 score:'Pontuação',
 },
};
/// **collab_i18n_end**

interface RatingItem {
 value: number;
 label: string;
}

@customElement('grouprateitem--ml-csat-rating')
export class CsatRatingMolecule extends MoleculeAuraElement {
 private msg: MessageType = messages.en;

 // ===========================================================================
 // SLOT TAGS
 // ===========================================================================
 slotTags = ['Label','Helper','Item'];

 // ===========================================================================
 // PROPERTIES — From Contract
 // ===========================================================================

 // Data
 @propertyDataSource({ type: Number })
 value: number | null = null;

 @propertyDataSource({ type: String })
 error: string ='';

 @propertyDataSource({ type: String })
 name: string ='';

 // Configuration
 @propertyDataSource({ type: Number })
 min: number = 1;

 @propertyDataSource({ type: Number })
 max: number = 5;

 @propertyDataSource({ type: Number })
 step: number = 1;

 // States
 @propertyDataSource({ type: Boolean, attribute:'is-editing' })
 isEditing: boolean = true;

 @propertyDataSource({ type: Boolean })
 disabled: boolean = false;

 @propertyDataSource({ type: Boolean })
 readonly: boolean = false;

 @propertyDataSource({ type: Boolean })
 required: boolean = false;

 // ===========================================================================
 // INTERNAL STATE
 // ===========================================================================
 @state()
 private hoverValue: number | null = null;

 @state()
 private focusedIndex: number = -1;

 // ===========================================================================
 // LIFECYCLE
 // ===========================================================================
 private labelId = `csat-label-${Math.random().toString(36).slice(2, 9)}`;
 private errorId = `csat-error-${Math.random().toString(36).slice(2, 9)}`;

 // ===========================================================================
 // ITEM PARSING
 // ===========================================================================
 private getItems(): RatingItem[] {
 const slotItems = this.getSlots('Item');
 if (slotItems.length > 0) {
 return slotItems.map(el => ({
 value: Number(el.getAttribute('value')),
 label: el.innerHTML,
 }));
 }
 // Auto-generate from min to max
 const items: RatingItem[] = [];
 for (let v = this.min; v <= this.max; v += this.step) {
 items.push({ value: v, label: String(v) });
 }
 return items;
 }

 // ===========================================================================
 // EVENT HANDLERS
 // ===========================================================================
 private handleSelect(itemValue: number) {
 if (this.disabled || this.readonly || !this.isEditing) return;
 this.value = itemValue;
 this.dispatchEvent(new CustomEvent('change', {
 bubbles: true,
 composed: true,
 detail: { value: this.value }
 }));
 }

 private handleMouseEnter(itemValue: number) {
 if (this.disabled || this.readonly || !this.isEditing) return;
 this.hoverValue = itemValue;
 }

 private handleMouseLeave() {
 if (!this.isEditing) return;
 this.hoverValue = null;
 }

 private handleFocus() {
 this.dispatchEvent(new CustomEvent('focus', {
 bubbles: true,
 composed: true,
 }));
 }

 private handleBlur() {
 this.focusedIndex = -1;
 this.dispatchEvent(new CustomEvent('blur', {
 bubbles: true,
 composed: true,
 }));
 }

 private handleKeyDown(e: KeyboardEvent, items: RatingItem[], index: number) {
 if (this.disabled || this.readonly || !this.isEditing) return;

 if (e.key ==='ArrowRight' || e.key ==='ArrowDown') {
 e.preventDefault();
 const nextIndex = Math.min(index + 1, items.length - 1);
 this.focusedIndex = nextIndex;
 this.focusOption(nextIndex);
 } else if (e.key ==='ArrowLeft' || e.key ==='ArrowUp') {
 e.preventDefault();
 const prevIndex = Math.max(index - 1, 0);
 this.focusedIndex = prevIndex;
 this.focusOption(prevIndex);
 } else if (e.key ==='Enter' || e.key ==='') {
 e.preventDefault();
 this.handleSelect(items[index].value);
 }
 }

 private focusOption(index: number) {
 const options = this.querySelectorAll('[role="radio"]');
 if (options[index]) {
 (options[index] as HTMLElement).focus();
 }
 }

 // ===========================================================================
 // CSS CLASSES
 // ===========================================================================
 private getContainerClasses(): string {
 return [
'flex flex-col gap-2',
 ].join(' ');
 }

 private getOptionsContainerClasses(): string {
 return [
'flex items-center gap-2',
 ].join(' ');
 }

 private getOptionClasses(item: RatingItem, index: number): string {
 const isSelected = this.value === item.value;
 const isHovered = this.hoverValue === item.value;
 const isInteractive = this.isEditing && !this.disabled && !this.readonly;

 return [
'flex flex-col items-center justify-center gap-1 p-3 rounded-lg border-2 transition-all duration-200',
'min-w-[72px] text-center',
 // Base colors
'ml-surface-bg',
 // Selection state
 isSelected
 ?'ml-border-focus ml-primary-dim-bg'
 :'ml-border',
 // Hover state (only in edit mode)
 isInteractive && isHovered && !isSelected
 ?'ml-border-focus ml-surface-dim-bg'
 :'',
 // Interactive states
 isInteractive
 ?'cursor-pointer hover:shadow-md'
 :'',
 // Disabled state
 this.disabled
 ?'ml-disabled'
 :'',
 // Readonly state
 this.readonly && !this.disabled
 ?'cursor-default'
 :'',
 '',
 // Error state
 this.error && this.isEditing && !isSelected
 ?'ml-border-error'
 :'',
 ].filter(Boolean).join(' ');
 }

 private getIconClasses(item: RatingItem): string {
 const isSelected = this.value === item.value;
 const isHovered = this.hoverValue === item.value;

 return [
'text-2xl transition-transform duration-200',
 isSelected || isHovered ?'scale-110' :'',
 ].filter(Boolean).join(' ');
 }

 private getLabelTextClasses(item: RatingItem): string {
 const isSelected = this.value === item.value;

 return [
'text-xs font-medium transition-colors',
 isSelected
 ?'ml-primary-text'
 :'ml-text-muted',
 ].join(' ');
 }

 private getScoreClasses(): string {
 return [
'flex items-center gap-2 px-3 py-2 rounded-lg',
'ml-surface-dim-bg',
'text-sm font-semibold',
'ml-text',
 ].join(' ');
 }

 private getLabelClasses(): string {
 return [
'text-sm font-medium',
'ml-text',
 ].join(' ');
 }

 private getHelperClasses(): string {
 return [
'text-xs',
'ml-text-muted',
 ].join(' ');
 }

 private getErrorClasses(): string {
 return [
'text-xs',
'ml-error-text',
 ].join(' ');
 }

 private getViewModeClasses(): string {
 return [
'ml-text-muted',
 ].join(' ');
 }

 // ===========================================================================
 // RENDER HELPERS
 // ===========================================================================
 private renderLabel(): TemplateResult {
 if (!this.hasSlot('Label')) {
 return html``;
 }
 return html`
 <div id="${this.labelId}" class="${cn(this.getLabelClasses(), this.getSlotClass('Label'))}">
 ${unsafeHTML(this.getSlotContent('Label'))}
 ${this.required && this.isEditing ? html`<span class="ml-error-text ml-1">*</span>` : html``}
 </div>
 `;
 }

 private renderHelper(): TemplateResult {
 if (!this.isEditing || !this.hasSlot('Helper')) {
 return html``;
 }
 return html`
 <div class="${cn(this.getHelperClasses(), this.getSlotClass('Helper'))}">
 ${unsafeHTML(this.getSlotContent('Helper'))}
 </div>
 `;
 }

 private renderError(): TemplateResult {
 if (!this.isEditing || !this.error) {
 return html``;
 }
 return html`
 <div id="${this.errorId}" class="${this.getErrorClasses()}" role="alert">
 ${this.error}
 </div>
 `;
 }

 private renderScore(): TemplateResult {
 if (this.value === null) {
 return html``;
 }
 return html`
 <div class="${this.getScoreClasses()}">
 <span>${this.msg.score}:</span>
 <span class="ml-primary-text">${this.value}</span>
 </div>
 `;
 }

 private renderOption(item: RatingItem, index: number, items: RatingItem[]): TemplateResult {
 const isSelected = this.value === item.value;
 const isInteractive = this.isEditing && !this.disabled && !this.readonly;

 return html`
 <div
 role="radio"
 aria-checked="${isSelected}"
 aria-label="${item.value}"
 tabindex="${isInteractive ? (isSelected || (this.value === null && index === 0) ?'0' :'-1') :'-1'}"
 class="${this.getOptionClasses(item, index)}"
 @click="${() => this.handleSelect(item.value)}"
 @mouseenter="${() => this.handleMouseEnter(item.value)}"
 @mouseleave="${this.handleMouseLeave}"
 @keydown="${(e: KeyboardEvent) => this.handleKeyDown(e, items, index)}"
 @focus="${this.handleFocus}"
 @blur="${this.handleBlur}"
 >
 <span class="${this.getIconClasses(item)}">
 ${unsafeHTML(item.label)}
 </span>
 </div>
 `;
 }

 private renderViewMode(): TemplateResult {
 if (this.value === null) {
 return html`
 <div class="${cn(this.getContainerClasses(), this.cssClass)}">
 ${this.renderLabel()}
 <div class="${this.getViewModeClasses()}">
 ${this.msg.noSelection}
 </div>
 </div>
 `;
 }

 const items = this.getItems();
 const selectedItem = items.find(item => item.value === this.value);

 return html`
 <div class="${cn(this.getContainerClasses(), this.cssClass)}">
 ${this.renderLabel()}
 <div class="${this.getOptionsContainerClasses()}">
 ${selectedItem ? html`
 <div class="flex flex-col items-center justify-center gap-1 p-3 rounded-lg border-2 ml-border-focus ml-primary-dim-bg min-w-[72px]">
 <span class="text-2xl">
 ${unsafeHTML(selectedItem.label)}
 </span>
 </div>
 ` : html``}
 ${this.renderScore()}
 </div>
 </div>
 `;
 }

 private renderEditMode(): TemplateResult {
 const items = this.getItems();
 const hasError = !!this.error;

 return html`
 <div class="${cn(this.getContainerClasses(), this.cssClass)}">
 ${this.renderLabel()}
 <div
 role="radiogroup"
 aria-labelledby="${this.hasSlot('Label') ? this.labelId :''}"
 aria-describedby="${hasError ? this.errorId :''}"
 aria-invalid="${hasError}"
 aria-required="${this.required}"
 class="${this.getOptionsContainerClasses()}"
 >
 ${items.map((item, index) => this.renderOption(item, index, items))}
 ${this.renderScore()}
 </div>
 ${this.renderError()}
 ${!this.error ? this.renderHelper() : html``}
 </div>
 `;
 }

 // ===========================================================================
 // RENDER
 // ===========================================================================
 render() {
 const lang = this.getMessageKey(messages);
 this.msg = messages[lang];

 if (!this.isEditing) {
 return this.renderViewMode();
 }

 return this.renderEditMode();
 }
}
