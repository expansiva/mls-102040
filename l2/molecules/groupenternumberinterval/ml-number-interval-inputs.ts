/// <mls fileReference="_102040_/l2/molecules/groupenternumberinterval/ml-number-interval-inputs.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML NUMBER INTERVAL INPUTS MOLECULE
// =============================================================================
// Skill Group: groupEnterNumberInterval
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';
/// **collab_i18n_start**
const message_en = {
placeholder: 'Enter a value',
connector: '–',
emptyView: '—',
loading: 'Loading...',
required: 'Both values are required',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
pt: {
placeholder: 'Informe um valor',
connector: 'até',
emptyView: '—',
loading: 'Carregando...',
required: 'Ambos os valores são obrigatórios',
},
};
/// **collab_i18n_end**
@customElement('groupenternumberinterval--ml-number-interval-inputs')
export class MlNumberIntervalInputsMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
// ===========================================================================
// SLOT TAGS
// ===========================================================================
slotTags = ['Label', 'LabelStart', 'LabelEnd', 'Helper', 'Prefix', 'Suffix'];
// ===========================================================================
// PROPERTIES — Data
// ===========================================================================
@propertyDataSource({ type: Number, attribute: 'start-value' })
startValue: number | null = null;
@propertyDataSource({ type: Number, attribute: 'end-value' })
endValue: number | null = null;
@propertyDataSource({ type: String })
error: string = '';
@propertyDataSource({ type: String })
name: string = '';
// ===========================================================================
// PROPERTIES — Configuration
// ===========================================================================
@propertyDataSource({ type: Number })
min: number | null = null;
@propertyDataSource({ type: Number })
max: number | null = null;
@propertyDataSource({ type: Number })
step: number = 1;
@propertyDataSource({ type: Number })
decimals: number = 0;
@propertyDataSource({ type: String })
locale: string = '';
@propertyDataSource({ type: String })
placeholder: string = '';
@propertyDataSource({ type: Number, attribute: 'min-gap' })
minGap: number = 0;
@propertyDataSource({ type: Number, attribute: 'max-gap' })
maxGap: number = 0;
// ===========================================================================
// PROPERTIES — States
// ===========================================================================
@propertyDataSource({ type: Boolean, attribute: 'is-editing' })
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
private activeHandle: string | null = null;
@state()
private startRawValue: string = '';
@state()
private endRawValue: string = '';
// ===========================================================================
// STATE CHANGE HANDLER
// ===========================================================================
handleIcaStateChange(key: string, value: any) {
const startAttr = this.getAttribute('start-value');
const endAttr = this.getAttribute('end-value');
if (startAttr === `{{${key}}}`) {
this.startRawValue =
value === null || value === undefined ? '' : this.formatNumberToDisplay(value);
}
if (endAttr === `{{${key}}}`) {
this.endRawValue =
value === null || value === undefined ? '' : this.formatNumberToDisplay(value);
}
this.requestUpdate();
}
updated(changedProps: Map<string, unknown>) {
if (changedProps.has('startValue')) {
if (this.startValue === null || this.startValue === undefined) {
this.startRawValue = '';
} else {
const parsed = this.parseRawToNumber(this.startRawValue);
if (parsed !== this.startValue) {
this.startRawValue = this.formatNumberToDisplay(this.startValue);
}
}
}
if (changedProps.has('endValue')) {
if (this.endValue === null || this.endValue === undefined) {
this.endRawValue = '';
} else {
const parsed = this.parseRawToNumber(this.endRawValue);
if (parsed !== this.endValue) {
this.endRawValue = this.formatNumberToDisplay(this.endValue);
}
}
}
}
firstUpdated() {
if (this.startValue !== null && this.startValue !== undefined) {
this.startRawValue = this.formatNumberToDisplay(this.startValue);
}
if (this.endValue !== null && this.endValue !== undefined) {
this.endRawValue = this.formatNumberToDisplay(this.endValue);
}
}
// ===========================================================================
// HELPERS — Formatting / Parsing
// ===========================================================================
private getDecimals(): number {
const d = Number(this.decimals);
return Number.isFinite(d) && d >= 0 ? Math.floor(d) : 0;
}
private getLocale(): string | undefined {
const loc = String(this.locale ?? '').trim();
return loc || undefined;
}
private formatNumberToDisplay(num: number | null | undefined): string {
if (num === null || num === undefined || Number.isNaN(Number(num))) return '';
const decimals = this.getDecimals();
const locale = this.getLocale();
try {
return Number(num).toLocaleString(locale, {
minimumFractionDigits: decimals,
maximumFractionDigits: decimals,
useGrouping: false,
});
} catch {
return Number(num).toFixed(decimals);
}
}
private parseRawToNumber(raw: string | null | undefined): number | null {
const text = String(raw ?? '').trim();
if (!text) return null;
// Normalize: remove grouping spaces, treat comma as decimal separator when present
let normalized = text.replace(/\s/g, '');
if (normalized.includes(',')) {
normalized = normalized.replace(/\./g, '').replace(',', '.');
}
// Keep only valid numeric characters
normalized = normalized.replace(/[^0-9.+-]/g, '');
if (!normalized || normalized === '-' || normalized === '+' || normalized === '.') return null;
const num = Number(normalized);
if (!Number.isFinite(num)) return null;
return this.roundToDecimals(num);
}
private roundToDecimals(value: number): number {
const decimals = this.getDecimals();
const factor = Math.pow(10, decimals);
return Math.round(value * factor) / factor;
}
private clampToBounds(value: number): number {
let next = value;
const min = this.min;
const max = this.max;
if (min !== null && min !== undefined && Number.isFinite(Number(min))) {
next = Math.max(next, Number(min));
}
if (max !== null && max !== undefined && Number.isFinite(Number(max))) {
next = Math.min(next, Number(max));
}
return this.roundToDecimals(next);
}
private clampPair(
start: number,
end: number,
edited: 'start' | 'end'
): { start: number; end: number } {
let s = this.clampToBounds(start);
let e = this.clampToBounds(end);
const minGap =
this.minGap !== null && this.minGap !== undefined && Number(this.minGap) > 0
? Number(this.minGap)
: 0;
const maxGap =
this.maxGap !== null && this.maxGap !== undefined && Number(this.maxGap) > 0
? Number(this.maxGap)
: 0;
// Keep order
if (s > e) {
if (edited === 'start') {
e = s;
} else {
s = e;
}
}
// minGap
if (minGap > 0 && e - s < minGap) {
if (edited === 'start') {
e = this.clampToBounds(s + minGap);
if (e - s < minGap) {
s = this.clampToBounds(e - minGap);
}
} else {
s = this.clampToBounds(e - minGap);
if (e - s < minGap) {
e = this.clampToBounds(s + minGap);
}
}
}
// maxGap
if (maxGap > 0 && e - s > maxGap) {
if (edited === 'start') {
e = this.clampToBounds(s + maxGap);
} else {
s = this.clampToBounds(e - maxGap);
}
}
// Final order safety
if (s > e) {
if (edited === 'start') e = s;
else s = e;
}
return { start: this.roundToDecimals(s), end: this.roundToDecimals(e) };
}
private getPlaceholderText(): string {
const fromProp = String(this.placeholder ?? '').trim();
return fromProp || this.msg.placeholder;
}
private getDisplayError(): string {
const external = String(this.error ?? '').trim();
if (external) return external;
if (this.required) {
const startMissing = this.startValue === null || this.startValue === undefined;
const endMissing = this.endValue === null || this.endValue === undefined;
if (startMissing || endMissing) return this.msg.required;
}
return '';
}
private canInteract(): boolean {
return !this.disabled && !this.readonly && !this.loading && this.isEditing !== false;
}
// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleStartInput(e: Event) {
e.stopPropagation();
if (!this.canInteract()) return;
const input = e.target as HTMLInputElement;
this.startRawValue = input.value;
const parsed = this.parseRawToNumber(input.value);
this.startValue = parsed;
this.dispatchEvent(
new CustomEvent('input', {
bubbles: true,
composed: true,
detail: {
startValue: this.startValue,
endValue: this.endValue,
},
})
);
}
private handleEndInput(e: Event) {
e.stopPropagation();
if (!this.canInteract()) return;
const input = e.target as HTMLInputElement;
this.endRawValue = input.value;
const parsed = this.parseRawToNumber(input.value);
this.endValue = parsed;
this.dispatchEvent(
new CustomEvent('input', {
bubbles: true,
composed: true,
detail: {
startValue: this.startValue,
endValue: this.endValue,
},
})
);
}
private commitSide(side: 'start' | 'end') {
if (!this.canInteract()) return;
let start =
side === 'start'
? this.parseRawToNumber(this.startRawValue)
: this.startValue === null || this.startValue === undefined
? null
: Number(this.startValue);
let end =
side === 'end'
? this.parseRawToNumber(this.endRawValue)
: this.endValue === null || this.endValue === undefined
? null
: Number(this.endValue);
if (start !== null) start = this.clampToBounds(start);
if (end !== null) end = this.clampToBounds(end);
if (start !== null && end !== null) {
const clamped = this.clampPair(start, end, side);
start = clamped.start;
end = clamped.end;
} else if (start !== null && end === null) {
// keep start only
} else if (start === null && end !== null) {
// keep end only
}
this.startValue = start;
this.endValue = end;
this.startRawValue = start === null ? '' : this.formatNumberToDisplay(start);
this.endRawValue = end === null ? '' : this.formatNumberToDisplay(end);
this.dispatchEvent(
new CustomEvent('change', {
bubbles: true,
composed: true,
detail: {
startValue: this.startValue,
endValue: this.endValue,
},
})
);
}
private handleStartBlur(e: Event) {
e.stopPropagation();
this.activeHandle = null;
if (!this.canInteract()) {
this.dispatchBlur();
return;
}
this.commitSide('start');
this.dispatchBlur();
}
private handleEndBlur(e: Event) {
e.stopPropagation();
this.activeHandle = null;
if (!this.canInteract()) {
this.dispatchBlur();
return;
}
this.commitSide('end');
this.dispatchBlur();
}
private handleStartFocus() {
if (!this.canInteract()) return;
this.activeHandle = 'start';
this.dispatchEvent(
new CustomEvent('focus', {
bubbles: true,
composed: true,
detail: {},
})
);
}
private handleEndFocus() {
if (!this.canInteract()) return;
this.activeHandle = 'end';
this.dispatchEvent(
new CustomEvent('focus', {
bubbles: true,
composed: true,
detail: {},
})
);
}
private dispatchBlur() {
this.dispatchEvent(
new CustomEvent('blur', {
bubbles: true,
composed: true,
detail: {},
})
);
}
private handleStartKeydown(e: KeyboardEvent) {
if (!this.canInteract()) return;
if (e.key === 'Enter') {
e.preventDefault();
this.commitSide('start');
(e.target as HTMLInputElement)?.blur();
return;
}
this.handleArrowStep(e, 'start');
}
private handleEndKeydown(e: KeyboardEvent) {
if (!this.canInteract()) return;
if (e.key === 'Enter') {
e.preventDefault();
this.commitSide('end');
(e.target as HTMLInputElement)?.blur();
return;
}
this.handleArrowStep(e, 'end');
}
private handleArrowStep(e: KeyboardEvent, side: 'start' | 'end') {
if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
e.preventDefault();
const stepRaw = Number(this.step);
const step = Number.isFinite(stepRaw) && stepRaw !== 0 ? Math.abs(stepRaw) : 1;
const delta = e.key === 'ArrowUp' ? step : -step;
const currentRaw = side === 'start' ? this.startRawValue : this.endRawValue;
const current =
this.parseRawToNumber(currentRaw) ??
(side === 'start' ? this.startValue : this.endValue) ??
0;
let next = this.clampToBounds(Number(current) + delta);
if (side === 'start') {
this.startValue = next;
this.startRawValue = this.formatNumberToDisplay(next);
} else {
this.endValue = next;
this.endRawValue = this.formatNumberToDisplay(next);
}
this.dispatchEvent(
new CustomEvent('input', {
bubbles: true,
composed: true,
detail: {
startValue: this.startValue,
endValue: this.endValue,
},
})
);
}
// ===========================================================================
// CLASS HELPERS
// ===========================================================================
private getFieldClasses(side: 'start' | 'end'): string {
const hasError = !!this.getDisplayError();
const isActive = this.activeHandle === side;
return [
'flex w-full items-center gap-1 px-3 py-2 text-sm',
'ml-interval-input',
hasError ? 'ml-interval-input-error' : '',
isActive ? 'ml-interval-input-active' : '',
this.disabled ? 'ml-disabled' : '',
this.readonly ? 'ml-interval-input-readonly' : '',
]
.filter(Boolean)
.join(' ');
}
private getNativeInputClasses(): string {
return [
'min-w-0 flex-1 bg-transparent outline-none border-0 p-0 text-sm',
'ml-interval-native-input',
this.disabled ? 'ml-disabled' : '',
]
.filter(Boolean)
.join(' ');
}
// ===========================================================================
// RENDER HELPERS
// ===========================================================================
private renderLabel(): TemplateResult {
if (this.hasSlot('Label')) {
return html`
<div class="${cn('mb-1 text-sm ml-label', this.getSlotClass('Label'))}">
${unsafeHTML(this.getSlotContent('Label'))}
</div>
`;
}
return html``;
}
private renderSideLabel(tag: 'LabelStart' | 'LabelEnd'): TemplateResult {
if (this.hasSlot('Label')) return html``;
if (!this.hasSlot(tag)) return html``;
return html`
<div class="${cn('mb-1 text-xs ml-label', this.getSlotClass(tag))}">
${unsafeHTML(this.getSlotContent(tag))}
</div>
`;
}
private renderPrefix(): TemplateResult {
if (!this.hasSlot('Prefix')) return html``;
return html`
<span class="${cn('shrink-0 text-sm ml-text-muted', this.getSlotClass('Prefix'))}">
${unsafeHTML(this.getSlotContent('Prefix'))}
</span>
`;
}
private renderSuffix(): TemplateResult {
if (!this.hasSlot('Suffix')) return html``;
return html`
<span class="${cn('shrink-0 text-sm ml-text-muted', this.getSlotClass('Suffix'))}">
${unsafeHTML(this.getSlotContent('Suffix'))}
</span>
`;
}
private renderFeedback(): TemplateResult {
const errorMsg = this.getDisplayError();
if (errorMsg) {
return html`<p class="${cn('mt-1 text-xs ml-error-text')}">${unsafeHTML(errorMsg)}</p>`;
}
if (this.hasSlot('Helper')) {
return html`
<p class="${cn('mt-1 text-xs ml-helper', this.getSlotClass('Helper'))}">
${unsafeHTML(this.getSlotContent('Helper'))}
</p>
`;
}
return html``;
}
private renderViewMode(): TemplateResult {
const start =
this.startValue === null || this.startValue === undefined
? null
: Number(this.startValue);
const end =
this.endValue === null || this.endValue === undefined ? null : Number(this.endValue);
const prefix = this.hasSlot('Prefix') ? this.getSlotContent('Prefix') : '';
const suffix = this.hasSlot('Suffix') ? this.getSlotContent('Suffix') : '';
const formatSide = (val: number | null): string => {
if (val === null || Number.isNaN(val)) return this.msg.emptyView;
const num = this.formatNumberToDisplay(val);
return `${prefix}${num}${suffix}`;
};
let text: string;
if (start === null && end === null) {
text = this.msg.emptyView;
} else if (start !== null && end === null) {
text = `${formatSide(start)} ${this.msg.connector} ${this.msg.emptyView}`;
} else if (start === null && end !== null) {
text = `${this.msg.emptyView} ${this.msg.connector} ${formatSide(end)}`;
} else {
text = `${formatSide(start)} ${this.msg.connector} ${formatSide(end)}`;
}
return html`
<div class="${cn('w-full text-sm ml-text', this.cssClass)}">
${this.renderLabel()}
<div class="ml-interval-view">${unsafeHTML(text)}</div>
</div>
`;
}
private renderLoading(): TemplateResult {
return html`
<div class="${cn('w-full', this.cssClass)}">
${this.renderLabel()}
<div class="flex items-center gap-2 py-2 ml-skeleton" aria-busy="true">
<span class="inline-block h-4 w-4 animate-spin rounded-full ml-spinner"></span>
<span class="text-sm ml-text-muted">${this.msg.loading}</span>
</div>
</div>
`;
}
private renderSideInput(side: 'start' | 'end'): TemplateResult {
const isStart = side === 'start';
const raw = isStart ? this.startRawValue : this.endRawValue;
const valueNum = isStart ? this.startValue : this.endValue;
const labelTag = isStart ? 'LabelStart' : 'LabelEnd';
const inputId = isStart ? 'ml-interval-start' : 'ml-interval-end';
const nameAttr = this.name
? isStart
? `${this.name}-start`
: `${this.name}-end`
: isStart
? 'start'
: 'end';
const errorMsg = this.getDisplayError();
const hasError = !!errorMsg;
const placeholder = this.getPlaceholderText();
const minAttr =
this.min !== null && this.min !== undefined && Number.isFinite(Number(this.min))
? String(this.min)
: undefined;
const maxAttr =
this.max !== null && this.max !== undefined && Number.isFinite(Number(this.max))
? String(this.max)
: undefined;
const stepVal = Number(this.step);
const stepAttr = Number.isFinite(stepVal) && stepVal !== 0 ? String(stepVal) : '1';
return html`
<div class="flex min-w-0 flex-1 flex-col">
${this.renderSideLabel(labelTag as 'LabelStart' | 'LabelEnd')}
<div class="${this.getFieldClasses(side)}">
${this.renderPrefix()}
<input
id="${inputId}"
class="${this.getNativeInputClasses()}"
type="text"
inputmode="${this.getDecimals() > 0 ? 'decimal' : 'numeric'}"
name="${nameAttr}"
.value=${raw}
placeholder="${placeholder}"
?disabled=${this.disabled || this.loading}
?readonly=${this.readonly}
?required=${this.required}
aria-invalid=${hasError ? 'true' : 'false'}
aria-required=${this.required ? 'true' : 'false'}
aria-readonly=${this.readonly ? 'true' : 'false'}
aria-valuemin=${minAttr ?? nothingAttr()}
aria-valuemax=${maxAttr ?? nothingAttr()}
aria-valuenow=${valueNum !== null && valueNum !== undefined ? String(valueNum) : nothingAttr()}
aria-label=${isStart ? 'Start value' : 'End value'}
step="${stepAttr}"
@input=${isStart ? this.handleStartInput : this.handleEndInput}
@change=${(e: Event) => e.stopPropagation()}
@focus=${isStart ? this.handleStartFocus : this.handleEndFocus}
@blur=${isStart ? this.handleStartBlur : this.handleEndBlur}
@keydown=${isStart ? this.handleStartKeydown : this.handleEndKeydown}
/>
${this.renderSuffix()}
</div>
</div>
`;
}
// ===========================================================================
// RENDER
// ===========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang] || messages.en;
if (this.loading) {
return this.renderLoading();
}
if (this.isEditing === false) {
return this.renderViewMode();
}
return html`
<div class="${cn('w-full', this.cssClass)}">
${this.renderLabel()}
<div
class="${[
'flex w-full items-end gap-2',
'ml-interval-inputs-root',
this.disabled ? 'ml-disabled' : '',
]
.filter(Boolean)
.join(' ')}"
>
${this.renderSideInput('start')}
<div
class="flex shrink-0 items-center self-center pb-2 text-sm ml-interval-connector ml-text-muted"
aria-hidden="true"
>
${this.msg.connector}
</div>
${this.renderSideInput('end')}
</div>
${this.renderFeedback()}
</div>
`;
}
}
/** Helper: omit aria attribute when value is absent (Lit removes null/nothing-like). */
function nothingAttr(): any {
return undefined;
}
