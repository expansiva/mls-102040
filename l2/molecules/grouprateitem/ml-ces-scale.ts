/// <mls fileReference="_102040_/l2/molecules/grouprateitem/ml-ces-scale.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// CES SCALE MOLECULE
// =============================================================================
// Skill Group: groupRateItem
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
required: 'This field is required',
emptyValue: '—',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
};
/// **collab_i18n_end**

type RateItem = {
value: number;
label: string;
};

@customElement('grouprateitem--ml-ces-scale')
export class CesScaleMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
private baseId = `ces-scale-${Math.random().toString(36).slice(2)}`;
// ===========================================================================
// SLOT TAGS
// ==========================================================================
slotTags = ['Label', 'Helper', 'Item'];
// ===========================================================================
// PROPERTIES — From Contract
// ==========================================================================
@propertyDataSource({ type: Number })
value: number | null = null;
@propertyDataSource({ type: String })
error = '';
@propertyDataSource({ type: String })
name = '';
@propertyDataSource({ type: Number })
min = 0;
@propertyDataSource({ type: Number })
max = 5;
@propertyDataSource({ type: Number })
step = 1;
@propertyDataSource({ type: Boolean, attribute: 'is-editing' })
isEditing = true;
@propertyDataSource({ type: Boolean })
disabled = false;
@propertyDataSource({ type: Boolean })
readonly = false;
@propertyDataSource({ type: Boolean })
required = false;
// ===========================================================================
// INTERNAL STATE
// ==========================================================================
@state()
private hoverValue: number | null = null;
@state()
private isFocused = false;
// ===========================================================================
// EVENT HANDLERS
// ==========================================================================
private handleItemClick(value: number) {
if (!this.isEditing || this.disabled || this.readonly) return;
this.value = value;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value }
}));
}

private handleItemMouseEnter(value: number) {
if (!this.isEditing || this.disabled || this.readonly) return;
this.hoverValue = value;
}

private handleMouseLeave() {
if (!this.isEditing || this.disabled || this.readonly) return;
this.hoverValue = null;
}

private handleKeyDown(e: KeyboardEvent, index: number, items: RateItem[]) {
if (!this.isEditing || this.disabled || this.readonly) return;
const key = e.key;
if (key === 'ArrowRight' || key === 'ArrowLeft' || key === 'Home' || key === 'End') {
e.preventDefault();
let nextIndex = index;
if (key === 'ArrowRight') nextIndex = Math.min(items.length - 1, index + 1);
if (key === 'ArrowLeft') nextIndex = Math.max(0, index - 1);
if (key === 'Home') nextIndex = 0;
if (key === 'End') nextIndex = items.length - 1;
this.value = items[nextIndex].value;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value }
}));
this.focusRateItem(nextIndex);
}
if (key === 'Enter' || key === ' ') {
e.preventDefault();
this.handleItemClick(items[index].value);
}
}

private focusRateItem(index: number) {
requestAnimationFrame(() => {
const buttons = this.querySelectorAll<HTMLButtonElement>('button[data-rate-item]');
const target = buttons[index];
if (target) target.focus();
});
}

private handleFocusIn() {
if (this.isFocused) return;
this.isFocused = true;
this.dispatchEvent(new CustomEvent('focus', {
bubbles: true,
composed: true,
}));
}

private handleFocusOut(e: FocusEvent) {
const related = e.relatedTarget as Node | null;
if (related && this.contains(related)) return;
this.isFocused = false;
this.dispatchEvent(new CustomEvent('blur', {
bubbles: true,
composed: true,
}));
}
// ===========================================================================
// HELPERS
// ==========================================================================
private getItems(): RateItem[] {
const slotItems = this.getSlots('Item');
if (slotItems.length > 0) {
return slotItems.map(el => ({
value: Number(el.getAttribute('value')),
label: el.innerHTML,
})).filter(item => !Number.isNaN(item.value));
}
const items: RateItem[] = [];
for (let v = 1; v <= 7; v += 1) {
items.push({ value: v, label: '' });
}
return items;
}

private getCompact(): boolean {
return !this.hasSlot('Label') && !this.hasSlot('Helper');
}

private getGradientClasses(index: number, count: number): { bg: string; text: string } {
const palette = [
{ bg: 'bg-emerald-500 dark:bg-emerald-400', text: 'text-white dark:text-slate-900' },
{ bg: 'bg-lime-500 dark:bg-lime-400', text: 'text-slate-900 dark:text-slate-900' },
{ bg: 'bg-yellow-500 dark:bg-yellow-400', text: 'text-slate-900 dark:text-slate-900' },
{ bg: 'bg-amber-500 dark:bg-amber-400', text: 'text-slate-900 dark:text-slate-900' },
{ bg: 'bg-orange-500 dark:bg-orange-400', text: 'text-white dark:text-slate-900' },
{ bg: 'bg-red-500 dark:bg-red-400', text: 'text-white dark:text-slate-900' },
{ bg: 'bg-rose-600 dark:bg-rose-400', text: 'text-white dark:text-slate-900' },
];
const ratio = count > 1 ? index / (count - 1) : 0;
const paletteIndex = Math.round(ratio * (palette.length - 1));
return palette[Math.min(palette.length - 1, Math.max(0, paletteIndex))];
}

private getItemClasses(isActive: boolean, hasError: boolean, compact: boolean, gradient: { bg: string; text: string }): string {
return [
'flex items-center justify-center rounded-md border transition focus:outline-none focus:ring-2',
compact ? 'px-2 py-1 text-xs min-w-8' : 'px-3 py-2 text-sm min-w-10',
gradient.bg,
gradient.text,
hasError ? 'border-red-500 dark:border-red-400' : 'border-slate-200 dark:border-slate-700',
isActive ? 'ring-sky-500 dark:ring-sky-400 scale-[1.02]' : 'ring-transparent',
this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
].filter(Boolean).join(' ');
}

private renderLabel(labelId: string): TemplateResult {
if (!this.hasSlot('Label')) return html``;
return html`
<div id=${labelId} class="mb-2 text-sm font-medium text-slate-900 dark:text-slate-100">
${unsafeHTML(this.getSlotContent('Label'))}
</div>
`;
}

private renderHelper(hasError: boolean, errorId: string, errorMessage: string): TemplateResult {
if (!this.isEditing) return html``;
if (hasError) {
return html`<p id=${errorId} class="mt-2 text-xs text-red-600 dark:text-red-400">${unsafeHTML(errorMessage)}</p>`;
}
if (this.hasSlot('Helper')) {
return html`<p class="mt-2 text-xs text-slate-500 dark:text-slate-400">${unsafeHTML(this.getSlotContent('Helper'))}</p>`;
}
return html``;
}

private renderItems(items: RateItem[], hasError: boolean, compact: boolean): TemplateResult {
const activeValue = this.hoverValue !== null && this.isEditing && !this.disabled && !this.readonly
? this.hoverValue
: this.value;
return html`
<div class="flex items-center ${compact ? 'gap-1' : 'gap-2'}" @mouseleave=${this.handleMouseLeave}>
${items.map((item, index) => {
const isActive = activeValue !== null && item.value === activeValue;
const gradient = this.getGradientClasses(index, items.length);
const autoLabel = item.label ? unsafeHTML(item.label) : html`${item.value}`;
const labelClasses = [
item.label ? '' : 'font-semibold',
item.label ? '' : (index === 0 || index === items.length - 1 ? 'opacity-95' : 'opacity-85'),
].filter(Boolean).join(' ');
return html`
<button
class=${this.getItemClasses(isActive, hasError, compact, gradient)}
role="radio"
aria-checked=${isActive}
aria-label=${String(item.value)}
?disabled=${this.disabled}
?data-rate-item=${true}
@mouseenter=${() => this.handleItemMouseEnter(item.value)}
@click=${() => this.handleItemClick(item.value)}
@keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, index, items)}
.tabIndex=${this.disabled ? -1 : 0}
>
<span class=${labelClasses}>${autoLabel}</span>
</button>
`;
})}
</div>
`;
}

private renderView(items: RateItem[], compact: boolean): TemplateResult {
if (this.value === null) {
return html`<div class="text-sm text-slate-600 dark:text-slate-400">${this.msg.emptyValue}</div>`;
}
return this.renderItems(items, false, compact);
}
// ===========================================================================
// RENDER
// ==========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];
const items = this.getItems();
const compact = this.getCompact();
const labelId = `${this.baseId}-label`;
const errorId = `${this.baseId}-error`;
const requiredError = this.required && this.value === null ? this.msg.required : '';
const errorMessage = this.isEditing ? (this.error || requiredError) : '';
const hasError = this.isEditing && !!errorMessage;
const ariaLabelledBy = this.hasSlot('Label') ? labelId : undefined;
const ariaDescribedBy = hasError ? errorId : undefined;

return html`
<div class="w-full" @focusin=${this.handleFocusIn} @focusout=${this.handleFocusOut}>
${this.renderLabel(labelId)}
<div
role="radiogroup"
aria-labelledby=${ariaLabelledBy || ''}
aria-describedby=${ariaDescribedBy || ''}
aria-invalid=${hasError ? 'true' : 'false'}
aria-required=${this.required ? 'true' : 'false'}
class=${[
'flex flex-col rounded-lg border p-3 transition',
compact ? 'gap-2' : 'gap-3',
'bg-white dark:bg-slate-800',
hasError ? 'border-red-500 dark:border-red-400' : 'border-slate-200 dark:border-slate-700',
this.disabled ? 'opacity-50' : '',
].filter(Boolean).join(' ')}
>
${this.isEditing
? this.renderItems(items, hasError, compact)
: this.renderView(items, compact)
}
</div>
${this.renderHelper(hasError, errorId, errorMessage)}
</div>
`;
}
}
