/// <mls fileReference="_102040_/l2/molecules/groupenterdatetimeinterval/ml-event-duration-interval.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// EVENT DURATION INTERVAL MOLECULE
// =============================================================================
// Skill Group: groupEnterDateTimeInterval
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

/// **collab_i18n_start**
const message_en = {
labelStart: 'Start',
labelEnd: 'End',
duration: 'Duration',
minutes: 'Minutes',
hours: 'Hours',
placeholder: '—',
loading: 'Loading...',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
pt: {
labelStart: 'Início',
labelEnd: 'Fim',
duration: 'Duração',
minutes: 'Minutos',
hours: 'Horas',
placeholder: '—',
loading: 'Carregando...',
},
};
/// **collab_i18n_end**

@customElement('groupenterdatetimeinterval--ml-event-duration-interval')
export class EventDurationIntervalMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
private componentId = `dt-interval-${Math.random().toString(36).slice(2)}`;

// ===========================================================================
// SLOT TAGS
// ===========================================================================
slotTags = ['Label', 'LabelStart', 'LabelEnd', 'Helper'];

// ===========================================================================
// PROPERTIES — From Contract
// ===========================================================================
@propertyDataSource({ type: String })
startDatetime: string | null = null;

@propertyDataSource({ type: String })
endDatetime: string | null = null;

@propertyDataSource({ type: String })
error: string = '';

@propertyDataSource({ type: String })
name: string = '';

@propertyDataSource({ type: String })
locale: string = '';

@propertyDataSource({ type: String })
timezone: string = '';

@propertyDataSource({ type: String })
minDatetime: string = '';

@propertyDataSource({ type: String })
maxDatetime: string = '';

@propertyDataSource({ type: Number, attribute: 'min-duration-minutes' })
minDurationMinutes: number = 0;

@propertyDataSource({ type: Number, attribute: 'max-duration-minutes' })
maxDurationMinutes: number = 0;

@propertyDataSource({ type: Number, attribute: 'minute-step' })
minuteStep: number = 1;

@propertyDataSource({ type: Boolean, attribute: 'allow-same-instant' })
allowSameInstant: boolean = false;

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
private activeField: 'start' | 'end' | null = null;

@state()
private durationValue: number | null = null;

@state()
private durationUnit: 'minutes' | 'hours' = 'minutes';

// ===========================================================================
// STATE CHANGE HANDLER (Derived duration display)
// ===========================================================================
handleIcaStateChange(key: string, value: any) {
const startAttr = this.getAttribute('startDatetime');
const endAttr = this.getAttribute('endDatetime');
if (startAttr === `{{${key}}}` || endAttr === `{{${key}}}`) {
this.updateDurationFromRange();
}
this.requestUpdate();
}

// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleFocus(field: 'start' | 'end') {
if (this.disabled || this.readonly || !this.isEditing) return;
this.activeField = field;
this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
}

private handleBlur(e: FocusEvent) {
if (!this.isEditing) return;
const next = e.relatedTarget as Element | null;
if (next && this.contains(next)) return;
this.activeField = null;
this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
}

private handleStartInput(e: Event) {
if (this.disabled || this.readonly || this.loading) return;
const input = e.target as HTMLInputElement;
const iso = this.parseInputToIso(input.value);
this.startDatetime = iso;
this.dispatchEvent(new CustomEvent('startChange', {
bubbles: true,
composed: true,
detail: { value: this.startDatetime }
}));
this.updateDurationFromRange();
if (!this.endDatetime && this.startDatetime) {
this.activeField = 'end';
}
this.emitChangeIfComplete();
}

private handleEndInput(e: Event) {
if (this.disabled || this.readonly || this.loading) return;
const input = e.target as HTMLInputElement;
const iso = this.parseInputToIso(input.value);
if (!this.isEndValidAgainstStart(iso)) return;
this.endDatetime = iso;
this.dispatchEvent(new CustomEvent('endChange', {
bubbles: true,
composed: true,
detail: { value: this.endDatetime }
}));
this.updateDurationFromRange();
this.emitChangeIfComplete();
this.activeField = null;
}

private handleDurationValueInput(e: Event) {
if (this.disabled || this.readonly || this.loading) return;
const input = e.target as HTMLInputElement;
const value = input.value ? Number(input.value) : null;
this.durationValue = value;
this.applyDurationToEnd();
}

private handleDurationUnitChange(e: Event) {
if (this.disabled || this.readonly || this.loading) return;
const select = e.target as HTMLSelectElement;
this.durationUnit = select.value as 'minutes' | 'hours';
this.updateDurationFromRange();
}

private emitChangeIfComplete() {
if (this.startDatetime && this.endDatetime) {
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: {
startDatetime: this.startDatetime,
endDatetime: this.endDatetime
}
}));
}
}

// ===========================================================================
// DERIVED METHODS
// ===========================================================================
private updateDurationFromRange() {
const durationMinutes = this.getDurationMinutes();
if (durationMinutes === null) {
this.durationValue = null;
return;
}
if (this.durationUnit === 'hours') {
this.durationValue = Number((durationMinutes / 60).toFixed(2));
} else {
this.durationValue = durationMinutes;
}
}

private applyDurationToEnd() {
if (!this.startDatetime || this.durationValue === null) return;
const minutes = this.durationUnit === 'hours'
? Math.round(this.durationValue * 60)
: Math.round(this.durationValue);
const minOk = this.minDurationMinutes === 0 || minutes >= this.minDurationMinutes;
const maxOk = this.maxDurationMinutes === 0 || minutes <= this.maxDurationMinutes;
if (!minOk || !maxOk) return;
const end = this.addMinutesToIso(this.startDatetime, minutes);
if (!this.isEndValidAgainstStart(end)) return;
this.endDatetime = end;
this.dispatchEvent(new CustomEvent('endChange', {
bubbles: true,
composed: true,
detail: { value: this.endDatetime }
}));
this.emitChangeIfComplete();
}

private getDurationMinutes(): number | null {
const start = this.parseIsoToDate(this.startDatetime);
const end = this.parseIsoToDate(this.endDatetime);
if (!start || !end) return null;
const diff = (end.getTime() - start.getTime()) / 60000;
if (!this.allowSameInstant && diff <= 0) return null;
return Math.round(diff);
}

private isEndValidAgainstStart(iso: string | null): boolean {
if (!iso || !this.startDatetime) return true;
const start = this.parseIsoToDate(this.startDatetime);
const end = this.parseIsoToDate(iso);
if (!start || !end) return true;
const diff = end.getTime() - start.getTime();
if (!this.allowSameInstant && diff <= 0) return false;
const minutes = diff / 60000;
if (this.minDurationMinutes > 0 && minutes < this.minDurationMinutes) return false;
if (this.maxDurationMinutes > 0 && minutes > this.maxDurationMinutes) return false;
return true;
}

// ===========================================================================
// FORMATTERS
// ===========================================================================
private parseIsoToDate(iso: string | null): Date | null {
if (!iso) return null;
const date = new Date(iso);
return Number.isNaN(date.getTime()) ? null : date;
}

private formatToInput(iso: string | null): string {
if (!iso) return '';
const date = this.parseIsoToDate(iso);
if (!date) return '';
const pad = (v: number) => String(v).padStart(2, '0');
return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

private parseInputToIso(value: string): string | null {
if (!value) return null;
const date = new Date(value);
if (Number.isNaN(date.getTime())) return null;
const pad = (v: number) => String(v).padStart(2, '0');
return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

private formatRangeDisplay(): string {
const start = this.parseIsoToDate(this.startDatetime);
const end = this.parseIsoToDate(this.endDatetime);
const locale = this.locale || undefined;
const timeZone = this.timezone || undefined;
if (!start && !end) return this.msg.placeholder;
const dateOpts: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone };
const timeOpts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: locale === 'en-US', timeZone };
if (start && !end) {
return `${start.toLocaleDateString(locale, dateOpts)} ${start.toLocaleTimeString(locale, timeOpts)} – ${this.msg.placeholder}`;
}
if (start && end) {
const sameDay = start.toDateString() === end.toDateString();
if (sameDay) {
return `${start.toLocaleDateString(locale, dateOpts)} ${start.toLocaleTimeString(locale, timeOpts)} – ${end.toLocaleTimeString(locale, timeOpts)}`;
}
return `${start.toLocaleDateString(locale, dateOpts)} ${start.toLocaleTimeString(locale, timeOpts)} – ${end.toLocaleDateString(locale, dateOpts)} ${end.toLocaleTimeString(locale, timeOpts)}`;
}
if (end) {
return `${this.msg.placeholder} – ${end.toLocaleDateString(locale, dateOpts)} ${end.toLocaleTimeString(locale, timeOpts)}`;
}
return this.msg.placeholder;
}

private addMinutesToIso(iso: string, minutes: number): string | null {
const date = this.parseIsoToDate(iso);
if (!date) return null;
const updated = new Date(date.getTime() + minutes * 60000);
const pad = (v: number) => String(v).padStart(2, '0');
return `${updated.getFullYear()}-${pad(updated.getMonth() + 1)}-${pad(updated.getDate())}T${pad(updated.getHours())}:${pad(updated.getMinutes())}:00`;
}

private getStartMinMax(): { min: string; max: string } {
return {
min: this.minDatetime ? this.formatToInput(this.minDatetime) : '',
max: this.maxDatetime ? this.formatToInput(this.maxDatetime) : ''
};
}

private getEndMinMax(): { min: string; max: string } {
let min = this.minDatetime ? this.formatToInput(this.minDatetime) : '';
let max = this.maxDatetime ? this.formatToInput(this.maxDatetime) : '';
if (this.startDatetime) {
const baseMin = this.allowSameInstant
? this.startDatetime
: this.addMinutesToIso(this.startDatetime, Math.max(this.minuteStep, 1));
const durationMin = this.minDurationMinutes > 0
? this.addMinutesToIso(this.startDatetime, this.minDurationMinutes)
: baseMin;
const durationMax = this.maxDurationMinutes > 0
? this.addMinutesToIso(this.startDatetime, this.maxDurationMinutes)
: null;
min = this.formatToInput(durationMin || baseMin);
if (durationMax) max = this.formatToInput(durationMax);
}
return { min, max };
}

// ===========================================================================
// RENDER
// ===========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];
if (!this.isEditing) {
return html`<div class="w-full">
${this.renderLabel()}
<div class="text-sm text-slate-900 dark:text-slate-100">${this.formatRangeDisplay()}</div>
</div>`;
}

if (this.loading) {
return html`<div class="text-sm text-slate-600 dark:text-slate-400">${this.msg.loading}</div>`;
}

const startMinMax = this.getStartMinMax();
const endMinMax = this.getEndMinMax();
const errorId = `${this.componentId}-error`;
const helperId = `${this.componentId}-helper`;
const ariaDescribedBy = this.error ? errorId : this.hasSlot('Helper') ? helperId : '';
const hasComplete = Boolean(this.startDatetime && this.endDatetime);
const durationMinutes = this.getDurationMinutes();

return html`
<div class="w-full">
${this.renderLabel()}
<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
<div>
${this.renderFieldLabel('LabelStart', this.msg.labelStart)}
<input
class="${this.getInputClasses(this.activeField === 'start')}"
name="${this.name ? `${this.name}-start` : ''}"
type="datetime-local"
.value=${this.formatToInput(this.startDatetime)}
?disabled=${this.disabled || this.loading}
?readonly=${this.readonly}
?required=${this.required}
min=${startMinMax.min}
max=${startMinMax.max}
step=${this.minuteStep * 60}
aria-labelledby="${this.getLabelId('LabelStart')}"
aria-invalid=${this.error ? 'true' : 'false'}
aria-required=${this.required ? 'true' : 'false'}
aria-describedby="${ariaDescribedBy}"
@focus=${() => this.handleFocus('start')}
@blur=${this.handleBlur}
@input=${this.handleStartInput}
/>
</div>
<div>
${this.renderFieldLabel('LabelEnd', this.msg.labelEnd)}
<input
class="${this.getInputClasses(this.activeField === 'end')}"
name="${this.name ? `${this.name}-end` : ''}"
type="datetime-local"
.value=${this.formatToInput(this.endDatetime)}
?disabled=${this.disabled || this.loading}
?readonly=${this.readonly}
?required=${this.required}
min=${endMinMax.min}
max=${endMinMax.max}
step=${this.minuteStep * 60}
aria-labelledby="${this.getLabelId('LabelEnd')}"
aria-invalid=${this.error ? 'true' : 'false'}
aria-required=${this.required ? 'true' : 'false'}
aria-describedby="${ariaDescribedBy}"
@focus=${() => this.handleFocus('end')}
@blur=${this.handleBlur}
@input=${this.handleEndInput}
/>
</div>
</div>

<div class="mt-3 grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto]">
<label class="text-xs text-slate-600 dark:text-slate-400" for="${this.componentId}-duration">
${this.msg.duration}
</label>
<div class="flex gap-2">
<input
id="${this.componentId}-duration"
class="${this.getInputClasses(false)}"
type="number"
min="0"
.value=${this.durationValue !== null ? String(this.durationValue) : ''}
?disabled=${this.disabled || this.loading || !this.startDatetime}
?readonly=${this.readonly}
@input=${this.handleDurationValueInput}
/>
<select
class="${this.getSelectClasses()}"
.value=${this.durationUnit}
?disabled=${this.disabled || this.loading || !this.startDatetime}
?readonly=${this.readonly}
@change=${this.handleDurationUnitChange}
>
<option value="minutes">${this.msg.minutes}</option>
<option value="hours">${this.msg.hours}</option>
</select>
</div>
</div>

${this.renderHelper(errorId, helperId, durationMinutes, hasComplete)}
</div>
`;
}

// ===========================================================================
// UI HELPERS
// ===========================================================================
private renderLabel(): TemplateResult {
if (!this.hasSlot('Label')) return html``;
return html`<div id="${this.getLabelId('Label')}" class="mb-2 text-sm text-slate-600 dark:text-slate-400">
${unsafeHTML(this.getSlotContent('Label'))}
</div>`;
}

private renderFieldLabel(tag: 'LabelStart' | 'LabelEnd', fallback: string): TemplateResult {
const content = this.hasSlot(tag) ? this.getSlotContent(tag) : fallback;
return html`<div id="${this.getLabelId(tag)}" class="mb-1 text-xs text-slate-600 dark:text-slate-400">
${unsafeHTML(content)}
</div>`;
}

private renderHelper(errorId: string, helperId: string, durationMinutes: number | null, hasComplete: boolean): TemplateResult {
if (this.error) {
return html`<p id="${errorId}" class="mt-2 text-xs text-red-600 dark:text-red-400">${unsafeHTML(this.error)}</p>`;
}
const helper = this.hasSlot('Helper') ? this.getSlotContent('Helper') : '';
if (!helper && (!hasComplete || durationMinutes === null)) return html``;
const durationText = durationMinutes !== null
? `(${durationMinutes} ${this.msg.minutes.toLowerCase()})`
: '';
return html`<p id="${helperId}" class="mt-2 text-xs text-slate-500 dark:text-slate-400">
${unsafeHTML(helper)} ${durationText}
</p>`;
}

private getLabelId(tag: string): string {
return `${this.componentId}-${tag}`;
}

private getInputClasses(isActive: boolean): string {
const base = [
'w-full rounded-md px-3 py-2 text-sm border transition',
'bg-white dark:bg-slate-900',
'text-slate-900 dark:text-slate-100',
'placeholder:text-slate-400 dark:placeholder:text-slate-500',
this.error
? 'border-red-500 dark:border-red-400'
: 'border-slate-200 dark:border-slate-700',
'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
this.disabled || this.loading ? 'opacity-50 cursor-not-allowed' : 'cursor-text',
isActive ? 'ring-2 ring-sky-500 dark:ring-sky-400' : '',
].filter(Boolean).join(' ');
return base;
}

private getSelectClasses(): string {
return [
'rounded-md px-3 py-2 text-sm border transition',
'bg-white dark:bg-slate-900',
'text-slate-900 dark:text-slate-100',
this.error
? 'border-red-500 dark:border-red-400'
: 'border-slate-200 dark:border-slate-700',
'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
this.disabled || this.loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
].filter(Boolean).join(' ');
}
}

export default EventDurationIntervalMolecule;
