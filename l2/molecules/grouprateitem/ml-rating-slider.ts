/// <mls fileReference="_102040_/l2/molecules/grouprateitem/ml-rating-slider.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML RATING SLIDER MOLECULE
// =============================================================================
// Skill Group: groupRateItem
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
type RatingItem = {
value: number;
label: string;
fromSlot: boolean;
};
@customElement('grouprateitem--ml-rating-slider')
export class MlRatingSliderMolecule extends MoleculeAuraElement {
// ==========================================================================
// SLOT TAGS
// ==========================================================================
slotTags = ['Label', 'Helper', 'Item'];
// ==========================================================================
// PROPERTIES — From Contract
// ==========================================================================
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
// ==========================================================================
// INTERNAL STATE
// ==========================================================================
@state()
private hoverValue: number | null = null;
private uid = `ml-rating-slider-${Math.random().toString(36).slice(2, 9)}`;
// ==========================================================================
// EVENT HANDLERS
// ==========================================================================
private handleOptionClick(value: number) {
if (!this.isEditing || this.disabled || this.readonly) return;
this.value = value;
this.hoverValue = null;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value }
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
private handleGroupMouseLeave() {
if (!this.isEditing || this.disabled || this.readonly) return;
this.hoverValue = null;
}
private handleOptionFocus() {
if (!this.isEditing || this.disabled || this.readonly) return;
this.dispatchEvent(new CustomEvent('focus', {
bubbles: true,
composed: true,
}));
}
private handleOptionBlur() {
if (!this.isEditing || this.disabled || this.readonly) return;
this.dispatchEvent(new CustomEvent('blur', {
bubbles: true,
composed: true,
}));
}
private handleKeyDown(event: KeyboardEvent) {
if (!this.isEditing || this.disabled || this.readonly) return;
const options = Array.from(this.querySelectorAll<HTMLButtonElement>('button[data-role="option"]'));
if (options.length === 0) return;
const currentIndex = options.findIndex(opt => opt === event.target);
const valueIndex = this.getIndexFromValue(options, this.value);
let index = currentIndex >= 0 ? currentIndex : (valueIndex >= 0 ? valueIndex : 0);
if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
event.preventDefault();
const next = Math.min(options.length - 1, index + 1);
options[next].focus();
this.previewHoverFromOption(options[next]);
}
if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
event.preventDefault();
const prev = Math.max(0, index - 1);
options[prev].focus();
this.previewHoverFromOption(options[prev]);
}
if (event.key === 'Enter' || event.key === ' ') {
event.preventDefault();
const option = options[index];
this.selectValueFromOption(option);
}
}
private previewHoverFromOption(option: HTMLButtonElement) {
const value = this.getOptionValue(option);
if (value === null) return;
this.hoverValue = value;
}
private selectValueFromOption(option: HTMLButtonElement) {
const value = this.getOptionValue(option);
if (value === null) return;
this.handleOptionClick(value);
}
private getOptionValue(option: HTMLButtonElement): number | null {
const raw = option.getAttribute('data-value');
const num = raw ? Number(raw) : NaN;
return Number.isFinite(num) ? num : null;
}
private getIndexFromValue(options: HTMLButtonElement[], value: number | null): number {
if (value === null || value === undefined) return -1;
return options.findIndex(opt => Number(opt.getAttribute('data-value')) === value);
}
// ==========================================================================
// HELPERS
// ==========================================================================
private getItems(): RatingItem[] {
const slotItems = this.getSlots('Item');
if (slotItems.length > 0) {
return slotItems
.map((el) => ({
value: Number(el.getAttribute('value')),
label: el.innerHTML,
fromSlot: true,
}))
.filter(item => Number.isFinite(item.value));
}
const items: RatingItem[] = [];
const rawMin = Number(this.min);
const rawMax = Number(this.max);
const rawStep = Number(this.step);
const step = rawStep > 0 ? rawStep : 1;
const min = rawMin <= rawMax ? rawMin : rawMax;
const max = rawMax >= rawMin ? rawMax : rawMin;
for (let v = min; v <= max + 1e-9; v += step) {
const value = Number(v.toFixed(10));
items.push({ value, label: String(value), fromSlot: false });
}
return items;
}
private getActiveValue(): number | null {
return this.hoverValue !== null ? this.hoverValue : this.value;
}
private isHighlighted(itemValue: number, activeValue: number | null): boolean {
if (activeValue === null || activeValue === undefined) return false;
return itemValue <= activeValue;
}
private getGroupClasses(hasError: boolean): string {
return [
'relative rounded-lg border px-2 py-3',
'bg-white dark:bg-slate-800',
hasError
? 'border-red-500 dark:border-red-400'
: 'border-slate-200 dark:border-slate-700',
this.disabled ? 'opacity-50 cursor-not-allowed' : '',
this.readonly ? 'opacity-70' : '',
].filter(Boolean).join(' ');
}
private getOptionButtonClasses(isHighlighted: boolean): string {
return [
'w-7 h-7 rounded-full border flex items-center justify-center text-xs font-medium transition',
'bg-white dark:bg-slate-800',
isHighlighted
? 'bg-sky-500 dark:bg-sky-600 border-sky-500 dark:border-sky-400 text-white'
: 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300',
!this.disabled && !this.readonly ? 'hover:bg-slate-50 dark:hover:bg-slate-700' : '',
'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
this.disabled || this.readonly ? 'cursor-not-allowed' : 'cursor-pointer',
].filter(Boolean).join(' ');
}
private renderLabel(): TemplateResult {
if (!this.hasSlot('Label')) return html``;
const labelId = `label-${this.uid}`;
return html`
<div id=${labelId} class="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
${unsafeHTML(this.getSlotContent('Label'))}
</div>
`;
}
private renderHelperOrError(hasError: boolean): TemplateResult {
if (!this.isEditing) return html``;
if (this.error) {
const errorId = `error-${this.uid}`;
return html`<p id=${errorId} class="mt-2 text-xs text-red-600 dark:text-red-400">${unsafeHTML(this.error)}</p>`;
}
if (this.hasSlot('Helper')) {
return html`<p class="mt-2 text-xs text-slate-500 dark:text-slate-400">${unsafeHTML(this.getSlotContent('Helper'))}</p>`;
}
return html``;
}
private renderRatingOptions(items: RatingItem[], hasCustomItems: boolean): TemplateResult {
const activeValue = this.getActiveValue();
return html`
<div class="relative flex items-start justify-between gap-3" @mouseleave=${this.handleGroupMouseLeave}>
<div class="absolute left-3 right-3 top-3 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></div>
${items.map((item, index) => {
const highlighted = this.isHighlighted(item.value, activeValue);
const buttonClasses = this.getOptionButtonClasses(highlighted);
const labelBelow = item.fromSlot
? html``
: html`<span class="text-xs text-slate-600 dark:text-slate-400">${item.label}</span>`;
const innerContent = item.fromSlot
? unsafeHTML(item.label)
: html`<span class="w-2 h-2 rounded-full bg-current"></span>`;
return html`
<div class="relative z-10 flex flex-1 flex-col items-center gap-1">
<button
class=${buttonClasses}
role="radio"
aria-checked=${this.value === item.value}
aria-label=${String(item.value)}
data-role="option"
data-index=${index}
data-value=${item.value}
type="button"
?disabled=${this.disabled}
@mouseenter=${() => this.handleOptionMouseEnter(item.value)}
@mouseleave=${this.handleOptionMouseLeave}
@click=${() => this.handleOptionClick(item.value)}
@focus=${this.handleOptionFocus}
@blur=${this.handleOptionBlur}
>
${innerContent}
</button>
${hasCustomItems ? html`` : labelBelow}
</div>
`;
})}
</div>
`;
}
private renderViewMode(items: RatingItem[], hasCustomItems: boolean): TemplateResult {
const label = this.renderLabel();
if (this.value === null) {
return html`
<div class="text-slate-900 dark:text-slate-100">
${label}
<div class="text-slate-400 dark:text-slate-500">—</div>
${this.name ? html`<input type="hidden" name=${this.name} value="">` : html``}
</div>
`;
}
return html`
<div class="text-slate-900 dark:text-slate-100">
${label}
${this.renderRatingOptions(items, hasCustomItems)}
${this.name ? html`<input type="hidden" name=${this.name} value=${String(this.value)}>` : html``}
</div>
`;
}
// ==========================================================================
// RENDER
// ==========================================================================
render() {
const items = this.getItems();
const hasCustomItems = this.getSlots('Item').length > 0;
if (!this.isEditing) {
return this.renderViewMode(items, hasCustomItems);
}
const invalidRequired = this.required && this.value === null;
const hasError = Boolean(this.error) || invalidRequired;
const labelId = this.hasSlot('Label') ? `label-${this.uid}` : undefined;
const errorId = this.error ? `error-${this.uid}` : undefined;
return html`
<div class="text-slate-900 dark:text-slate-100">
${this.renderLabel()}
<div
class=${this.getGroupClasses(hasError)}
role="radiogroup"
aria-disabled=${this.disabled}
aria-readonly=${this.readonly}
aria-required=${this.required}
aria-invalid=${hasError}
aria-labelledby=${labelId || ''}
aria-describedby=${errorId || ''}
@keydown=${this.handleKeyDown}
>
${this.renderRatingOptions(items, hasCustomItems)}
</div>
${this.renderHelperOrError(hasError)}
${this.name ? html`<input type="hidden" name=${this.name} value=${this.value === null ? '' : String(this.value)}>` : html``}
</div>
`;
}
}
