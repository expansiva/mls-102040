/// <mls fileReference="_102040_/l2/molecules/groupentertimeinterval/ml-enter-time-interval.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ENTER TIME INTERVAL MOLECULE
// =============================================================================
// Skill Group: groupEnterTimeInterval
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
labelStart: 'Start time',
labelEnd: 'End time',
placeholder: '—',
loading: 'Loading...',
nextDay: '(+1)',
nextDayAria: 'Ends next day',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
pt: {
labelStart: 'Hora inicial',
labelEnd: 'Hora final',
placeholder: '—',
loading: 'Carregando...',
nextDay: '(+1)',
nextDayAria: 'Termina no dia seguinte',
},
};
/// **collab_i18n_end**

@customElement('groupentertimeinterval--ml-enter-time-interval')
export class EnterTimeIntervalMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
private uid = `eti-${Math.random().toString(36).slice(2, 9)}`;

// ==========================================================================
// SLOT TAGS
// ==========================================================================
slotTags = ['Label', 'LabelStart', 'LabelEnd', 'Helper'];

// ==========================================================================
// PROPERTIES — From Contract
// ==========================================================================
@propertyDataSource({ type: String })
startTime: string | null = null;

@propertyDataSource({ type: String })
endTime: string | null = null;

@propertyDataSource({ type: String })
error: string = '';

@propertyDataSource({ type: String })
name: string = '';

@propertyDataSource({ type: String })
locale: string = '';

@propertyDataSource({ type: Boolean, attribute: 'hour12' })
hour12 = false;

@propertyDataSource({ type: Boolean, attribute: 'show-seconds' })
showSeconds = false;

@propertyDataSource({ type: Number, attribute: 'minute-step' })
minuteStep = 1;

@propertyDataSource({ type: String })
minTime = '';

@propertyDataSource({ type: String })
maxTime = '';

@propertyDataSource({ type: Number, attribute: 'min-duration-minutes' })
minDurationMinutes = 0;

@propertyDataSource({ type: Number, attribute: 'max-duration-minutes' })
maxDurationMinutes = 0;

@propertyDataSource({ type: Boolean, attribute: 'allow-overnight' })
allowOvernight = false;

@propertyDataSource({ type: Boolean, attribute: 'allow-same-time' })
allowSameTime = false;

@propertyDataSource({ type: Boolean, attribute: 'is-editing' })
isEditing = true;

@propertyDataSource({ type: Boolean })
disabled = false;

@propertyDataSource({ type: Boolean })
readonly = false;

@propertyDataSource({ type: Boolean })
required = false;

@propertyDataSource({ type: Boolean })
loading = false;

// ==========================================================================
// INTERNAL STATE
// ==========================================================================
@state()
private activeField: 'start' | 'end' | null = null;

// ==========================================================================
// EVENT HANDLERS
// ==========================================================================
private handleStartInput(event: Event) {
if (this.disabled || this.readonly || this.loading) return;
const input = event.target as HTMLInputElement;
this.startTime = input.value ? input.value : null;
this.dispatchEvent(new CustomEvent('startChange', {
bubbles: true,
composed: true,
detail: { value: this.startTime }
}));
this.emitCombinedChangeIfValid();
}

private handleEndInput(event: Event) {
if (this.disabled || this.readonly || this.loading) return;
const input = event.target as HTMLInputElement;
this.endTime = input.value ? input.value : null;
this.dispatchEvent(new CustomEvent('endChange', {
bubbles: true,
composed: true,
detail: { value: this.endTime }
}));
this.emitCombinedChangeIfValid();
}

private emitCombinedChangeIfValid() {
if (!this.isIntervalValid()) return;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: {
startTime: this.startTime,
endTime: this.endTime,
}
}));
}

private handleFocus(field: 'start' | 'end') {
if (this.disabled || this.loading) return;
this.activeField = field;
this.dispatchEvent(new CustomEvent('focus', {
bubbles: true,
composed: true,
}));
}

private handleBlur() {
this.activeField = null;
this.dispatchEvent(new CustomEvent('blur', {
bubbles: true,
composed: true,
}));
}

// ==========================================================================
// VALIDATION & FORMATTING
// ==========================================================================
private isIntervalValid(): boolean {
if (!this.startTime || !this.endTime) return false;
if (!this.allowSameTime && this.startTime === this.endTime) return false;

const startMinutes = this.toMinutes(this.startTime);
const endMinutes = this.toMinutes(this.endTime);
if (startMinutes === null || endMinutes === null) return false;

if (!this.isWithinBounds(startMinutes) || !this.isWithinBounds(endMinutes)) return false;

const overnight = endMinutes < startMinutes;
if (overnight && !this.allowOvernight) return false;

const duration = overnight
? (24 * 60) - startMinutes + endMinutes
: endMinutes - startMinutes;

if (duration < 0) return false;
if (this.minDurationMinutes > 0 && duration < this.minDurationMinutes) return false;
if (this.maxDurationMinutes > 0 && duration > this.maxDurationMinutes) return false;

return true;
}

private isWithinBounds(minutes: number): boolean {
if (this.minTime) {
const minMinutes = this.toMinutes(this.minTime);
if (minMinutes !== null && minutes < minMinutes) return false;
}
if (this.maxTime) {
const maxMinutes = this.toMinutes(this.maxTime);
if (maxMinutes !== null && minutes > maxMinutes) return false;
}
return true;
}

private toMinutes(time: string): number | null {
const parts = time.split(':').map(Number);
if (parts.length < 2) return null;
const [h, m, s = 0] = parts;
if (Number.isNaN(h) || Number.isNaN(m) || Number.isNaN(s)) return null;
return h * 60 + m + (s / 60);
}

private isOvernightInterval(): boolean {
if (!this.allowOvernight || !this.startTime || !this.endTime) return false;
const startMinutes = this.toMinutes(this.startTime);
const endMinutes = this.toMinutes(this.endTime);
if (startMinutes === null || endMinutes === null) return false;
return endMinutes < startMinutes;
}

private formatTimeDisplay(time: string | null): string {
if (!time) return this.msg.placeholder;
const parts = time.split(':').map(Number);
const [h, m, s = 0] = parts;
const date = new Date(1970, 0, 1, h, m, s);
const options: Intl.DateTimeFormatOptions = {
hour: '2-digit',
minute: '2-digit',
second: this.showSeconds ? '2-digit' : undefined,
hour12: this.hour12,
};
return date.toLocaleTimeString(this.locale || undefined, options);
}

private getDisplayRange(): string {
const startText = this.formatTimeDisplay(this.startTime);
const endText = this.formatTimeDisplay(this.endTime);
if (!this.startTime && !this.endTime) {
return this.msg.placeholder;
}
if (this.startTime && !this.endTime) {
return `${startText} – ${this.msg.placeholder}`;
}
if (!this.startTime && this.endTime) {
return `${this.msg.placeholder} – ${endText}`;
}
const overnight = this.isOvernightInterval();
return `${startText} – ${endText}${overnight ? ` ${this.msg.nextDay}` : ''}`;
}

// ==========================================================================
// CLASS BUILDERS
// ==========================================================================
private getContainerClasses(): string {
return cn(
'w-full',
this.disabled || this.loading ? 'ml-disabled' : '',
);
}

private getInputClasses(isActive: boolean): string {
return cn(
'w-full rounded-lg px-3 py-2 text-sm border transition',
'ml-input',
this.error ? 'ml-input-container-error' : '',
isActive ? 'ml-input-active' : '',
'ml-input-focus',
this.readonly ? 'ml-interval-container-readonly' : '',
);
}

// ==========================================================================
// RENDER
// ==========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];

if (!this.isEditing) {
return html`
<div class="${cn(this.getContainerClasses(), this.cssClass)}">
<div class="text-sm ml-text">
${this.getDisplayRange()}
</div>
</div>
`;
}

const labelId = `label-${this.uid}`;
const labelStartId = `label-start-${this.uid}`;
const labelEndId = `label-end-${this.uid}`;
const errorId = `error-${this.uid}`;
const helperId = `helper-${this.uid}`;
const hasError = Boolean(this.error);
const hasHelper = this.hasSlot('Helper');
const overnight = this.isOvernightInterval();
const stepSeconds = this.showSeconds ? 1 : Math.max(1, this.minuteStep) * 60;

const ariaStartLabelledBy = this.hasSlot('LabelStart')
? labelStartId
: (this.hasSlot('Label') ? labelId : undefined);
const ariaEndLabelledBy = this.hasSlot('LabelEnd')
? labelEndId
: (this.hasSlot('Label') ? labelId : undefined);

const ariaDescribedBy = hasError
? errorId
: (hasHelper ? helperId : undefined);

return html`
<div class="${cn(this.getContainerClasses(), this.cssClass)}">
${this.hasSlot('Label') ? html`
<label id="${labelId}" class="${cn('mb-1 block text-sm font-medium ml-label', this.getSlotClass('Label'))}">
${unsafeHTML(this.getSlotContent('Label'))}
</label>
` : html``}

<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
<div>
${this.hasSlot('LabelStart') ? html`
<label id="${labelStartId}" class="${cn('mb-1 block text-xs font-medium ml-text-muted', this.getSlotClass('LabelStart'))}">
${unsafeHTML(this.getSlotContent('LabelStart'))}
</label>
` : html``}
<input
class="${this.getInputClasses(this.activeField === 'start')}"
type="time"
.value=${this.startTime ?? ''}
step="${stepSeconds}"
min="${this.minTime || ''}"
max="${this.maxTime || ''}"
name="${this.name ? `${this.name}-start` : ''}"
?disabled=${this.disabled || this.loading}
?readonly=${this.readonly}
?required=${this.required}
aria-labelledby=${ariaStartLabelledBy || ''}
aria-describedby=${ariaDescribedBy || ''}
aria-invalid=${hasError ? 'true' : 'false'}
aria-required=${this.required ? 'true' : 'false'}
@input=${this.handleStartInput}
@focus=${() => this.handleFocus('start')}
@blur=${this.handleBlur}
/>
</div>

<div>
${this.hasSlot('LabelEnd') ? html`
<label id="${labelEndId}" class="${cn('mb-1 block text-xs font-medium ml-text-muted', this.getSlotClass('LabelEnd'))}">
${unsafeHTML(this.getSlotContent('LabelEnd'))}
</label>
` : html``}
<input
class="${this.getInputClasses(this.activeField === 'end')}"
type="time"
.value=${this.endTime ?? ''}
step="${stepSeconds}"
min="${this.minTime || ''}"
max="${this.maxTime || ''}"
name="${this.name ? `${this.name}-end` : ''}"
?disabled=${this.disabled || this.loading}
?readonly=${this.readonly}
?required=${this.required}
aria-labelledby=${ariaEndLabelledBy || ''}
aria-describedby=${ariaDescribedBy || ''}
aria-invalid=${hasError ? 'true' : 'false'}
aria-required=${this.required ? 'true' : 'false'}
@input=${this.handleEndInput}
@focus=${() => this.handleFocus('end')}
@blur=${this.handleBlur}
/>
${overnight ? html`
<p class="mt-1 text-xs ml-text-muted" aria-label="${this.msg.nextDayAria}">
${this.msg.nextDay}
</p>
` : html``}
</div>
</div>

${this.loading ? html`
<p class="mt-2 text-xs ml-text-muted">${this.msg.loading}</p>
` : html``}

${hasError ? html`
<p id="${errorId}" class="mt-2 text-xs ml-error-text">
${unsafeHTML(String(this.error))}
</p>
` : html``}

${!hasError && hasHelper ? html`
<p id="${helperId}" class="${cn('mt-2 text-xs ml-helper', this.getSlotClass('Helper'))}">
${unsafeHTML(this.getSlotContent('Helper'))}
</p>
` : html``}
</div>
`;
}
}
