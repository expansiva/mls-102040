/// <mls fileReference="_102040_/l2/molecules/groupenterdate/ml-compact-calendar.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// COMPACT CALENDAR MOLECULE
// =============================================================================
// Skill Group: enter + date
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';
/// **collab_i18n_start**
const message_en = {
labelRequired: '*',
placeholder: 'Select a date',
loading: 'Loading...',
clear: 'Clear',
week: 'Wk',
noValue: '—',
};
const message_pt = {
labelRequired: '*',
placeholder: 'Selecione uma data',
loading: 'Carregando...',
clear: 'Limpar',
week: 'Sem',
noValue: '—',
};
const message_de = {
labelRequired: '*',
placeholder: 'Datum auswählen',
loading: 'Wird geladen...',
clear: 'Löschen',
week: 'KW',
noValue: '—',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
pt: message_pt,
de: message_de,
};
/// **collab_i18n_end**
@customElement('groupenterdate--ml-compact-calendar')
export class MlCompactCalendarMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
// ===========================================================================
// SLOT TAGS
// ===========================================================================
slotTags = ['Label', 'Helper'];
// ===========================================================================
// PROPERTIES — From Contract
// ===========================================================================
@propertyDataSource({ type: String })
value: string | null = null;
@propertyDataSource({ type: String })
error: string = '';
@propertyDataSource({ type: String })
name: string = '';
@propertyDataSource({ type: String })
locale: string = '';
@propertyDataSource({ type: String, attribute: 'min-date' })
minDate: string = '';
@propertyDataSource({ type: String, attribute: 'max-date' })
maxDate: string = '';
@propertyDataSource({ type: String })
placeholder: string = '';
@propertyDataSource({ type: Number, attribute: 'first-day-of-week' })
firstDayOfWeek: number = 0;
@propertyDataSource({ type: Boolean, attribute: 'show-week-numbers' })
showWeekNumbers: boolean = false;
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
private isOpen: boolean = false; // kept for contract compliance
@state()
private viewMonth: number = new Date().getMonth();
@state()
private viewYear: number = new Date().getFullYear();
@state()
private hasFocus: boolean = false;
private static idCounter = 0;
private instanceId = `compact-calendar-${MlCompactCalendarMolecule.idCounter++}`;
// ===========================================================================
// STATE CHANGE HANDLER
// ===========================================================================
handleIcaStateChange(key: string, value: any) {
const valueAttr = this.getAttribute('value');
const minAttr = this.getAttribute('min-date');
const maxAttr = this.getAttribute('max-date');
if (valueAttr === `{{${key}}}`) {
const selected = this.parseIsoDate(String(value || ''));
if (selected) {
this.viewMonth = selected.getMonth();
this.viewYear = selected.getFullYear();
} else {
this.setViewToToday();
}
}
if (minAttr === `{{${key}}}` || maxAttr === `{{${key}}}`) {
this.ensureViewWithinBounds();
}
this.requestUpdate();
}
// ===========================================================================
// LIFECYCLE
// ===========================================================================
firstUpdated() {
const selected = this.parseIsoDate(this.value || '');
if (selected) {
this.viewMonth = selected.getMonth();
this.viewYear = selected.getFullYear();
} else {
this.setViewToToday();
}
this.ensureViewWithinBounds();
}
// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleDayClick(day: Date) {
if (this.disabled || this.readonly || this.loading) return;
if (!this.isDateSelectable(day)) return;
const iso = this.formatIsoDate(day);
this.value = iso;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value },
}));
}
private handleClear() {
if (this.disabled || this.readonly || this.loading) return;
if (this.value === null || this.value === '') return;
this.value = null;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value },
}));
}
private handlePrevMonth() {
if (!this.canNavigatePrev()) return;
this.navigateToMonth(-1);
}
private handleNextMonth() {
if (!this.canNavigateNext()) return;
this.navigateToMonth(1);
}
private handleFocusIn() {
if (!this.isEditing || this.disabled) return;
if (!this.hasFocus) {
this.hasFocus = true;
this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
}
}
private handleFocusOut(e: FocusEvent) {
if (!this.isEditing || this.disabled) return;
const related = e.relatedTarget as Node | null;
if (related && this.contains(related)) return;
if (this.hasFocus) {
this.hasFocus = false;
this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
}
}
// ===========================================================================
// RENDER
// ===========================================================================
render(): TemplateResult {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];
if (!this.isEditing) {
return this.renderViewMode();
}
const labelId = `${this.instanceId}-label`;
const errorId = `${this.instanceId}-error`;
const helperId = `${this.instanceId}-helper`;
const describedBy = this.error
? errorId
: (this.hasSlot('Helper') ? helperId : '');
return html`
<div class="${cn('w-full', this.cssClass)}" @focusin=${this.handleFocusIn} @focusout=${this.handleFocusOut}>
${this.renderLabel(labelId)}
<div
class="${this.getContainerClasses()}"
role="dialog"
aria-modal="true"
aria-labelledby=${labelId}
aria-describedby=${describedBy}
aria-invalid=${this.error ? 'true' : 'false'}
aria-required=${this.required ? 'true' : 'false'}
>
${this.renderHeader()}
${this.renderCalendar()}
</div>
${this.renderFeedback(errorId, helperId)}
</div>
`;
}
private renderViewMode(): TemplateResult {
const labelId = `${this.instanceId}-label`;
const display = this.formatDisplayValue(this.value);
return html`
<div class="${cn('w-full', this.cssClass)}">
${this.renderLabel(labelId)}
<div class="ml-text text-sm">
${display}
</div>
</div>
`;
}
private renderLabel(labelId: string): TemplateResult {
if (!this.hasSlot('Label')) return html``;
return html`
<label id=${labelId} class="${cn('ml-label mb-1 block text-sm', this.getSlotClass('Label'))}">
${unsafeHTML(this.getSlotContent('Label'))}
${this.required ? html`<span class="ml-error-text ml-1">${this.msg.labelRequired}</span>` : html``}
</label>
`;
}
private renderHeader(): TemplateResult {
const display = this.formatDisplayValue(this.value, true);
const canClear = !!this.value && !this.disabled && !this.readonly && !this.loading;
return html`
<div class="ml-calendar-header mb-2 flex items-center justify-between">
<div class="ml-text text-sm">
${display}
</div>
<div class="flex items-center gap-2">
${this.loading ? html`<span class="ml-text-muted text-xs">${this.msg.loading}</span>` : html``}
${canClear ? html`
<button
class="ml-text-muted text-xs ml-calendar-header-clear"
@click=${this.handleClear}
>
${this.msg.clear}
</button>
` : html``}
</div>
</div>
`;
}
private renderCalendar(): TemplateResult {
const monthTitle = this.getMonthTitle();
const weekdays = this.getWeekdayNames();
const grid = this.getCalendarDays();
const gridCols = this.showWeekNumbers ? 'grid-cols-8' : 'grid-cols-7';
const weekLabel = this.showWeekNumbers
? html`<div class="ml-text-muted text-xs font-medium">${this.msg.week}</div>`
: html``;
return html`
<div class="ml-calendar-grid w-full">
<div class="ml-calendar-nav mb-2 flex items-center justify-between">
<button
class="${this.getNavButtonClasses(this.canNavigatePrev())}"
@click=${this.handlePrevMonth}
?disabled=${!this.canNavigatePrev()}
aria-label="Previous month"
>
‹
</button>
<div class="ml-text text-sm font-medium" aria-live="polite">
${monthTitle}
</div>
<button
class="${this.getNavButtonClasses(this.canNavigateNext())}"
@click=${this.handleNextMonth}
?disabled=${!this.canNavigateNext()}
aria-label="Next month"
>
›
</button>
</div>
<div class="grid ${gridCols} gap-1" role="row">
${weekLabel}
${weekdays.map((d) => html`<div class="ml-text-muted text-xs font-medium">${d}</div>`)}
</div>
<div class="mt-1 grid ${gridCols} gap-1" role="grid">
${grid.map((week) => html`
${this.showWeekNumbers ? html`
<div class="ml-text-muted text-xs flex items-center justify-center">
${week.weekNumber}
</div>
` : html``}
${week.days.map((day) => this.renderDayCell(day))}
`)}
</div>
</div>
`;
}
private renderDayCell(day: CalendarDay): TemplateResult {
const isSelected = this.isSameIsoDate(day.date, this.value); // Ensure selected date matches by ISO string
const classes = this.getDayClasses(day, isSelected);
const disabled = day.disabled || this.disabled || this.readonly || this.loading;
return html`
<button
class="${classes}"
@click=${() => this.handleDayClick(day.date)}
?disabled=${disabled}
role="gridcell"
aria-selected=${isSelected ? 'true' : 'false'}
aria-disabled=${disabled ? 'true' : 'false'}
>
${day.date.getDate()}
</button>
`;
}
private renderFeedback(errorId: string, helperId: string): TemplateResult {
if (this.error) {
return html`<p id=${errorId} class="ml-error-text mt-1 text-xs">${this.error}</p>`;
}
if (this.hasSlot('Helper')) {
return html`<p id=${helperId} class="${cn('ml-helper mt-1 text-xs', this.getSlotClass('Helper'))}">${unsafeHTML(this.getSlotContent('Helper'))}</p>`;
}
return html``;
}
// ===========================================================================
// HELPERS — DATE
// ===========================================================================
private setViewToToday() {
const now = new Date();
this.viewMonth = now.getMonth();
this.viewYear = now.getFullYear();
}
private parseIsoDate(value: string): Date | null {
if (!value) return null;
const parts = value.split('-').map((p) => parseInt(p, 10));
if (parts.length !== 3 || parts.some((p) => isNaN(p))) return null;
const [year, month, day] = parts;
return new Date(year, month - 1, day);
}
private formatIsoDate(date: Date): string {
const y = date.getFullYear();
const m = String(date.getMonth() + 1).padStart(2, '0');
const d = String(date.getDate()).padStart(2, '0');
return `${y}-${m}-${d}`;
}
private formatDisplayValue(value: string | null, allowPlaceholder = false): string {
if (!value) return allowPlaceholder ? (this.placeholder || this.msg.placeholder) : this.msg.noValue;
const date = this.parseIsoDate(value);
if (!date) return this.msg.noValue;
const locale = this.locale || navigator.language || 'en-US';
return new Intl.DateTimeFormat(locale).format(date);
}
private getMonthTitle(): string {
const locale = this.locale || navigator.language || 'en-US';
const date = new Date(this.viewYear, this.viewMonth, 1);
return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
}
private getWeekdayNames(): string[] {
const locale = this.locale || navigator.language || 'en-US';
const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
const base = new Date(2021, 7, 1); // Sunday
const days = Array.from({ length: 7 }, (_, i) => {
const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
return formatter.format(d);
});
const start = Math.min(Math.max(this.firstDayOfWeek, 0), 6);
return days.slice(start).concat(days.slice(0, start));
}
private getCalendarDays(): CalendarWeek[] {
const first = new Date(this.viewYear, this.viewMonth, 1);
const startOffset = (first.getDay() - this.firstDayOfWeek + 7) % 7;
const startDate = new Date(this.viewYear, this.viewMonth, 1 - startOffset);
const weeks: CalendarWeek[] = [];
let current = new Date(startDate);
for (let w = 0; w < 6; w++) {
const weekDays: CalendarDay[] = [];
const weekStart = new Date(current);
for (let d = 0; d < 7; d++) {
const dayDate = new Date(current);
const inCurrentMonth = dayDate.getMonth() === this.viewMonth;
const disabled = !inCurrentMonth || !this.isDateSelectable(dayDate);
weekDays.push({
date: dayDate,
inCurrentMonth,
disabled,
});
current.setDate(current.getDate() + 1);
}
weeks.push({
weekNumber: this.getWeekNumber(weekStart),
days: weekDays,
});
}
return weeks;
}
private isDateSelectable(date: Date): boolean {
if (!date) return false;
const min = this.parseIsoDate(this.minDate || '');
const max = this.parseIsoDate(this.maxDate || '');
const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
if (min && day < new Date(min.getFullYear(), min.getMonth(), min.getDate())) return false;
if (max && day > new Date(max.getFullYear(), max.getMonth(), max.getDate())) return false;
return true;
}
private isSameDay(a: Date | null, b: Date | null): boolean {
if (!a || !b) return false;
return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
private isSameIsoDate(date: Date, value: string | null): boolean {
if (!value) return false;
return this.formatIsoDate(date) === value; // Compare using ISO string to keep selection highlight stable
}
private getWeekNumber(date: Date): number {
const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
const dayNum = d.getUTCDay() || 7;
d.setUTCDate(d.getUTCDate() + 4 - dayNum);
const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
private ensureViewWithinBounds() {
const min = this.parseIsoDate(this.minDate || '');
const max = this.parseIsoDate(this.maxDate || '');
const viewIndex = this.viewYear * 12 + this.viewMonth;
if (min) {
const minIndex = min.getFullYear() * 12 + min.getMonth();
if (viewIndex < minIndex) {
this.viewYear = min.getFullYear();
this.viewMonth = min.getMonth();
}
}
if (max) {
const maxIndex = max.getFullYear() * 12 + max.getMonth();
if (viewIndex > maxIndex) {
this.viewYear = max.getFullYear();
this.viewMonth = max.getMonth();
}
}
}
private canNavigatePrev(): boolean {
if (this.disabled || this.readonly || this.loading) return false;
const prev = new Date(this.viewYear, this.viewMonth - 1, 1);
const min = this.parseIsoDate(this.minDate || '');
if (!min) return true;
const minMonth = new Date(min.getFullYear(), min.getMonth(), 1);
return prev >= minMonth;
}
private canNavigateNext(): boolean {
if (this.disabled || this.readonly || this.loading) return false;
const next = new Date(this.viewYear, this.viewMonth + 1, 1);
const max = this.parseIsoDate(this.maxDate || '');
if (!max) return true;
const maxMonth = new Date(max.getFullYear(), max.getMonth(), 1);
return next <= maxMonth;
}
private navigateToMonth(delta: number) {
const newDate = new Date(this.viewYear, this.viewMonth + delta, 1);
this.viewYear = newDate.getFullYear();
this.viewMonth = newDate.getMonth();
this.dispatchEvent(new CustomEvent('monthChange', {
bubbles: true,
composed: true,
detail: { year: this.viewYear, month: this.viewMonth + 1 },
}));
}
// ===========================================================================
// HELPERS — CLASSES
// ===========================================================================
private getContainerClasses(): string {
return cn(
'ml-calendar-container w-full rounded-lg border p-3 transition',
this.error ? 'ml-calendar-container--error' : '',
this.disabled ? 'ml-disabled' : '',
this.readonly ? 'cursor-default' : '',
);
}
private getNavButtonClasses(enabled: boolean): string {
return cn(
'ml-calendar-nav-btn h-7 w-7 rounded-md text-sm border transition',
enabled ? 'ml-calendar-nav-btn--enabled' : 'ml-disabled',
);
}
private getDayClasses(day: CalendarDay, isSelected: boolean): string {
const isToday = this.isSameDay(day.date, new Date());
const isDayDisabled = day.disabled || this.disabled || this.readonly || this.loading;
return cn(
'ml-calendar-day h-8 w-8 rounded-md text-xs border border-transparent transition flex items-center justify-center',
!day.inCurrentMonth ? 'ml-calendar-day-outside' : '',
isSelected ? 'ml-calendar-day-selected' : '',
!isSelected && isToday ? 'ml-calendar-day-today' : '',
!isDayDisabled && !isSelected ? 'ml-calendar-day--hoverable' : '',
isDayDisabled ? 'ml-calendar-day-disabled' : '',
);
}
}
// ===========================================================================
// TYPES
// ===========================================================================
type CalendarDay = {
date: Date;
inCurrentMonth: boolean;
disabled: boolean;
};
type CalendarWeek = {
weekNumber: number;
days: CalendarDay[];
};
