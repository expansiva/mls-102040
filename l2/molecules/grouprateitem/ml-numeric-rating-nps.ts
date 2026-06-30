/// <mls fileReference="_102040_/l2/molecules/grouprateitem/ml-numeric-rating-nps.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// NUMERIC RATING NPS MOLECULE
// =============================================================================
// Skill Group: groupRateItem
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
emptyValue: '—',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
pt: {
emptyValue: '—',
},
};
/// **collab_i18n_end**

type OptionItem = {
value: number;
label: string;
fromSlot: boolean;
};

@customElement('grouprateitem--ml-numeric-rating-nps')
export class NumericRatingNpsMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
private uid = `nps-${Math.random().toString(36).slice(2)}`;
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
private focusedIndex: number | null = null;
// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleOptionClick(item: OptionItem) {
if (this.disabled || this.readonly || !this.isEditing) return;
const nextValue = this.value === item.value ? null : item.value;
this.value = nextValue;
this.hoverValue = null;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value },
}));
}

private handleOptionFocus(index: number) {
if (!this.isEditing) return;
this.focusedIndex = index;
this.dispatchEvent(new CustomEvent('focus', {
bubbles: true,
composed: true,
detail: {},
}));
}

private handleOptionBlur() {
if (!this.isEditing) return;
this.focusedIndex = null;
this.hoverValue = null;
this.dispatchEvent(new CustomEvent('blur', {
bubbles: true,
composed: true,
detail: {},
}));
}

private handleOptionMouseEnter(item: OptionItem) {
if (this.disabled || this.readonly || !this.isEditing) return;
this.hoverValue = item.value;
}

private handleOptionMouseLeave() {
if (this.disabled || this.readonly || !this.isEditing) return;
this.hoverValue = null;
}

private handleKeyDown(event: KeyboardEvent, items: OptionItem[]) {
if (this.disabled || this.readonly || !this.isEditing) return;
if (items.length === 0) return;

const key = event.key;
const isArrow = key === 'ArrowRight' || key === 'ArrowLeft' || key === 'ArrowDown' || key === 'ArrowUp';
const isSelect = key === 'Enter' || key === ' ';

if (!isArrow && !isSelect) return;

event.preventDefault();

let index = this.focusedIndex;
if (index === null) {
index = this.getSelectedIndex(items);
}
if (index === null) index = 0;

if (isArrow) {
const dir = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1;
const nextIndex = Math.min(items.length - 1, Math.max(0, index + dir));
this.focusedIndex = nextIndex;
this.focusOption(nextIndex);
return;
}

if (isSelect && index !== null) {
this.handleOptionClick(items[index]);
}
}

private focusOption(index: number) {
const el = this.querySelector(`[data-index="${index}"]`) as HTMLElement | null;
if (el) el.focus();
}
// ===========================================================================
// HELPERS
// ===========================================================================
private getItems(): OptionItem[] {
const slotItems = this.getSlots('Item');
if (slotItems.length > 0) {
return slotItems
.map((el) => ({
value: Number(el.getAttribute('value')),
label: el.innerHTML || '',
fromSlot: true,
}))
.filter((item) => !Number.isNaN(item.value));
}

const items: OptionItem[] = [];
const step = this.step || 1;
if (step <= 0) return items;
let count = 0;
for (let v = this.min; v <= this.max; v += step) {
items.push({ value: v, label: String(v), fromSlot: false });
count += 1;
if (count > 200) break;
}
return items;
}

private getSelectedIndex(items: OptionItem[]): number | null {
if (this.value === null) return null;
const idx = items.findIndex((i) => i.value === this.value);
return idx >= 0 ? idx : null;
}

private getGroupClasses(hasError: boolean): string {
return [
'rounded-lg border p-2',
'ml-surface',
'ml-border',
hasError ? 'ml-border-error' : '',
(this.disabled || this.readonly) ? 'ml-disabled' : '',
].filter(Boolean).join(' ');
}

private getOptionClasses(isActive: boolean): string {
return [
'h-10 w-10 rounded-md border text-sm font-medium transition',
'ml-focus-ring',
isActive
? 'ml-nps-option-selected'
: 'ml-surface ml-text ml-border',
(!this.disabled && !this.readonly) ? 'ml-nps-option cursor-pointer' : 'cursor-not-allowed',
].filter(Boolean).join(' ');
}

private renderLabel(labelId: string): TemplateResult {
if (!this.hasSlot('Label')) return html``;
const content = this.getSlotContent('Label');
return html`
<div id=${labelId} class="${cn('mb-2 text-sm ml-label', this.getSlotClass('Label'))}">
${unsafeHTML(content)}
</div>
`;
}

private renderHelperOrError(hasError: boolean, errorMessage: string, helperId: string, errorId: string): TemplateResult {
if (hasError && errorMessage) {
return html`
<p id=${errorId} class="mt-2 text-xs ml-error-text">
${unsafeHTML(errorMessage)}
</p>
`;
}
if (!hasError && this.hasSlot('Helper')) {
return html`
<p id=${helperId} class="${cn('mt-2 text-xs ml-helper', this.getSlotClass('Helper'))}">
${unsafeHTML(this.getSlotContent('Helper'))}
</p>
`;
}
return html``;
}

private renderOptionLabel(item: OptionItem): TemplateResult {
if (item.fromSlot) {
const content = item.label || String(item.value);
return html`${unsafeHTML(content)}`;
}
return html`${item.label}`;
}

private renderViewMode(items: OptionItem[]): TemplateResult {
const labelId = `${this.uid}-label`;
const display = this.getViewDisplayValue(items);
return html`
<div class="${cn('w-full', this.cssClass)}">
${this.renderLabel(labelId)}
<div class="text-sm ml-text">
${display}
</div>
</div>
`;
}

private getViewDisplayValue(items: OptionItem[]): TemplateResult {
if (this.value === null || this.value === undefined) {
return html`<span class="ml-text-muted">${this.msg.emptyValue}</span>`;
}
const matched = items.find((i) => i.value === this.value);
if (matched && matched.fromSlot) {
const content = matched.label || String(this.value);
return html`${unsafeHTML(content)}`;
}
return html`${String(this.value)}`;
}
// ===========================================================================
// RENDER
// ===========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];

const items = this.getItems();

if (!this.isEditing) {
return this.renderViewMode(items);
}

const labelId = `${this.uid}-label`;
const helperId = `${this.uid}-helper`;
const errorId = `${this.uid}-error`;
const hasError = this.error !== '' || (this.required && this.value === null);
const errorMessage = this.error;
const describedBy = hasError && errorMessage ? errorId : (!hasError && this.hasSlot('Helper') ? helperId : '');

return html`
<div class="${cn('w-full', this.cssClass)}">
${this.renderLabel(labelId)}
<div
class=${this.getGroupClasses(hasError)}
role="radiogroup"
aria-labelledby=${this.hasSlot('Label') ? labelId : ''}
aria-describedby=${describedBy}
aria-invalid=${hasError ? 'true' : 'false'}
aria-required=${this.required ? 'true' : 'false'}
@keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, items)}
>
${this.name ? html`<input type="hidden" name=${this.name} value=${this.value ?? ''} />` : html``}
<div class="flex flex-wrap gap-2">
${items.map((item, index) => {
const isActive = this.hoverValue !== null
? item.value === this.hoverValue
: item.value === this.value;
const isDisabled = this.disabled || this.readonly;
return html`
<button
class=${this.getOptionClasses(isActive)}
role="radio"
aria-checked=${item.value === this.value ? 'true' : 'false'}
aria-label=${String(item.value)}
tabindex=${isDisabled ? -1 : (this.focusedIndex === index || (this.focusedIndex === null && item.value === this.value) ? 0 : -1)}
?disabled=${isDisabled}
data-index=${index}
@focus=${() => this.handleOptionFocus(index)}
@blur=${() => this.handleOptionBlur()}
@mouseenter=${() => this.handleOptionMouseEnter(item)}
@mouseleave=${() => this.handleOptionMouseLeave()}
@click=${() => this.handleOptionClick(item)}
>
${this.renderOptionLabel(item)}
</button>
`;
})}
</div>
</div>
${this.renderHelperOrError(hasError, errorMessage, helperId, errorId)}
</div>
`;
}
}
