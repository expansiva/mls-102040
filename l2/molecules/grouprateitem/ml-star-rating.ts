/// <mls fileReference="_102040_/l2/molecules/grouprateitem/ml-star-rating.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// STAR RATING MOLECULE
// =============================================================================
// Skill Group: groupRateItem
// This molecule does NOT contain business logic.
import { html, svg, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

type RatingItem = {
value: number;
label: string;
};

@customElement('grouprateitem--ml-star-rating')
export class MlStarRatingMolecule extends MoleculeAuraElement {
// ===========================================================================
// SLOT TAGS
// ===========================================================================
slotTags = ['Label', 'Helper', 'Item'];
// ===========================================================================
// PROPERTIES — From Contract
// ===========================================================================
@propertyDataSource({ type: Number })
value: number | null = null;
@propertyDataSource({ type: String })
error: string = '';
@propertyDataSource({ type: String })
name: string = '';
@propertyDataSource({ type: Number })
min: number = 0;
@propertyDataSource({ type: Number })
max: number = 5;
@propertyDataSource({ type: Number })
step: number = 1;
@propertyDataSource({ type: Boolean, attribute: 'is-editing' })
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
private uid: string = `star-rating-${Math.random().toString(36).slice(2)}`;
// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleOptionClick(value: number) {
if (!this.isEditing || this.disabled || this.readonly) return;
this.value = value;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value },
}));
}
private handleOptionMouseEnter(value: number) {
if (!this.isEditing || this.disabled || this.readonly) return;
this.hoverValue = value;
}
private handleOptionMouseLeave() {
if (!this.isEditing || this.disabled || this.readonly) return;
this.hoverValue = null;
}
private handleOptionFocus() {
if (!this.isEditing || this.disabled) return;
this.dispatchEvent(new CustomEvent('focus', {
bubbles: true,
composed: true,
}));
}
private handleOptionBlur() {
if (!this.isEditing || this.disabled) return;
this.dispatchEvent(new CustomEvent('blur', {
bubbles: true,
composed: true,
}));
}
private handleOptionKeydown(e: KeyboardEvent, currentValue: number) {
if (!this.isEditing || this.disabled || this.readonly) return;
const items = this.getRatingItems();
const index = items.findIndex((i) => i.value === currentValue);
if (index < 0) return;
if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
e.preventDefault();
const prev = items[Math.max(0, index - 1)];
this.focusOption(prev.value);
}
if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
e.preventDefault();
const next = items[Math.min(items.length - 1, index + 1)];
this.focusOption(next.value);
}
if (e.key === 'Enter' || e.key === ' ') {
e.preventDefault();
this.handleOptionClick(currentValue);
}
}
private focusOption(value: number) {
const el = this.querySelector(`[data-value="${value}"]`) as HTMLElement | null;
if (el) el.focus();
}
// ===========================================================================
// DATA HELPERS
// ===========================================================================
private getRatingItems(): RatingItem[] {
const slotItems = this.getSlots('Item');
if (slotItems.length > 0) {
return slotItems
.map((el) => {
const val = Number(el.getAttribute('value'));
return {
value: val,
label: el.innerHTML,
};
})
.filter((item) => !Number.isNaN(item.value));
}
const items: RatingItem[] = [];
const step = this.step > 0 ? this.step : 1;
let v = this.min;
let guard = 0;
while (v <= this.max + 1e-6 && guard < 1000) {
items.push({ value: Number(v.toFixed(4)), label: '' });
v += step;
guard += 1;
}
return items;
}
private getActiveValue(): number | null {
if (!this.isEditing) return this.value;
return this.hoverValue !== null ? this.hoverValue : this.value;
}
private isItemActive(itemValue: number, activeValue: number | null): boolean {
if (activeValue === null || activeValue === undefined) return false;
return itemValue <= activeValue;
}
private getLabelId(): string | null {
return this.hasSlot('Label') ? `${this.uid}-label` : null;
}
private getHelpId(): string | null {
if (this.isEditing && this.error) return `${this.uid}-error`;
if (this.isEditing && this.hasSlot('Helper')) return `${this.uid}-helper`;
return null;
}
private getIsInvalid(): boolean {
return !!this.error || (this.required && this.value === null);
}
// ===========================================================================
// RENDER HELPERS
// ===========================================================================
private renderLabel(): TemplateResult {
if (!this.hasSlot('Label')) return html``;
return html`
<label id="${this.getLabelId() || ''}" class="${cn('mb-1 text-sm ml-label', this.getSlotClass('Label'))}">
${unsafeHTML(this.getSlotContent('Label'))}
</label>
`;
}
private renderHelperOrError(): TemplateResult {
if (!this.isEditing) return html``;
if (this.error) {
return html`
<p id="${this.getHelpId() || ''}" class="mt-1 text-xs ml-error-text">
${unsafeHTML(String(this.error))}
</p>
`;
}
if (this.hasSlot('Helper')) {
return html`
<p id="${this.getHelpId() || ''}" class="${cn('mt-1 text-xs ml-helper', this.getSlotClass('Helper'))}">
${unsafeHTML(this.getSlotContent('Helper'))}
</p>
`;
}
return html``;
}
private renderHiddenInput(): TemplateResult {
if (!this.name) return html``;
const val = this.value === null || this.value === undefined ? '' : String(this.value);
return html`<input type="hidden" name="${this.name}" value="${val}" />`;
}
private renderStarIcon(isActive: boolean): TemplateResult {
const iconClasses = [
'w-5 h-5 transition',
isActive
? 'ml-rating-star-filled'
: 'ml-rating-star',
].join(' ');
return html`
<svg class="${iconClasses}" viewBox="0 0 20 20" aria-hidden="true">
${svg`<path fill="currentColor" d="M10 15.27l-5.18 3.05 1.64-5.81L1 7.97l6.02-.52L10 2l2.98 5.45 6.02.52-5.46 4.54 1.64 5.81z" />`}
</svg>
`;
}
private renderOption(item: RatingItem, activeValue: number | null, isTabbable: boolean): TemplateResult {
const isActive = this.isItemActive(item.value, activeValue);
const isSelected = this.value === item.value;
const optionClasses = [
'inline-flex items-center justify-center rounded-md p-1 transition',
'ml-rating-star-hover',
this.disabled ? 'ml-disabled' : 'cursor-pointer',
isSelected ? 'ml-rating-star-filled' : '',
].join(' ');
const ariaChecked = isSelected ? 'true' : 'false';
const label = item.label ? item.label : `Rating ${item.value}`;
return html`
<button
class="${optionClasses}"
type="button"
role="radio"
aria-checked="${ariaChecked}"
aria-label="${label}"
data-role="rating-option"
data-value="${item.value}"
?disabled="${this.disabled}"
?tabindex="${isTabbable}"
@focus="${this.handleOptionFocus}"
@blur="${this.handleOptionBlur}"
@mouseenter="${() => this.handleOptionMouseEnter(item.value)}"
@mouseleave="${() => this.handleOptionMouseLeave()}"
@click="${() => this.handleOptionClick(item.value)}"
@keydown="${(e: KeyboardEvent) => this.handleOptionKeydown(e, item.value)}"
>
${item.label ? html`${unsafeHTML(item.label)}` : this.renderStarIcon(isActive)}
</button>
`;
}
private renderEditMode(items: RatingItem[]): TemplateResult {
const activeValue = this.getActiveValue();
const labelId = this.getLabelId();
const helpId = this.getHelpId();
const isInvalid = this.getIsInvalid();
const containerClasses = [
'flex items-center gap-1 rounded-lg border px-2 py-1',
'ml-surface ml-border',
'ml-focus-within',
isInvalid ? 'ml-border-error' : '',
this.disabled ? 'ml-disabled' : '',
].filter(Boolean).join(' ');
const defaultTabValue = this.value !== null ? this.value : (items[0]?.value ?? 0);
return html`
<div
class="${containerClasses}"
role="radiogroup"
aria-labelledby="${labelId || ''}"
aria-describedby="${helpId || ''}"
aria-invalid="${isInvalid ? 'true' : 'false'}"
aria-required="${this.required ? 'true' : 'false'}"
@mouseleave="${() => this.handleOptionMouseLeave()}"
>
${items.map((item) => this.renderOption(item, activeValue, item.value === defaultTabValue))}
</div>
${this.renderHiddenInput()}
${this.renderHelperOrError()}
`;
}
private renderViewMode(items: RatingItem[]): TemplateResult {
const labelId = this.getLabelId();
const selected = items.find((i) => i.value === this.value);
const content = this.value === null
? html`<span class="ml-text-muted">—</span>`
: selected && selected.label
? html`${unsafeHTML(selected.label)}`
: html`
<div class="flex items-center gap-1" aria-labelledby="${labelId || ''}">
${items.map((item) => this.renderStarIcon(this.isItemActive(item.value, this.value)))}
</div>
`;
return html`
<div class="flex items-center gap-2">
${content}
${this.renderHiddenInput()}
</div>
`;
}
// ===========================================================================
// RENDER
// ===========================================================================
render() {
const items = this.getRatingItems();
return html`
<div class="${cn('w-full', this.cssClass)}">
${this.renderLabel()}
${this.isEditing ? this.renderEditMode(items) : this.renderViewMode(items)}
</div>
`;
}
}
