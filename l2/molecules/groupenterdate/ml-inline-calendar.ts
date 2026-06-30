/// <mls fileReference="_102040_/l2/molecules/groupenterdate/ml-inline-calendar.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// INLINE CALENDAR MOLECULE
// =============================================================================
// Skill Group: groupEnterDate
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
loading: 'Loading...',
previousMonth: 'Previous month',
nextMonth: 'Next month',
week: 'Wk',
empty: '—',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
pt: {
loading: 'Carregando...',
previousMonth: 'Mês anterior',
nextMonth: 'Próximo mês',
week: 'Sem',
empty: '—',
},
};
/// **collab_i18n_end**

@customElement('groupenterdate--ml-inline-calendar')
export class InlineCalendarMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
private uid = `inline-calendar-${Math.random().toString(36).slice(2, 9)}`;
private focusWithin = false;
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
error = '';

@propertyDataSource({ type: String })
name = '';

@propertyDataSource({ type: String })
locale = '';

@propertyDataSource({ type: String, attribute: 'min-date' })
minDate = '';

@propertyDataSource({ type: String, attribute: 'max-date' })
maxDate = '';

@propertyDataSource({ type: String })
placeholder = '';

@propertyDataSource({ type: Number, attribute: 'first-day-of-week' })
firstDayOfWeek = 0;

@propertyDataSource({ type: Boolean, attribute: 'show-week-numbers' })
showWeekNumbers = false;

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
// ===========================================================================
// INTERNAL STATE
// ===========================================================================
@state()
private isOpen = false;

@state()
private viewMonth = new Date().getMonth();

@state()
private viewYear = new Date().getFullYear();

firstUpdated() {
this.syncViewToValue();
}
// ===========================================================================
// STATE CHANGE HANDLER
// ===========================================================================
handleIcaStateChange(key: string, value: any) {
const valueAttr = this.getAttribute('value');
const minAttr = this.getAttribute('min-date');
const maxAttr = this.getAttribute('max-date');
if (valueAttr === `{{${key}}}`) {
this.syncViewToValue(value as string | null);
}
if (minAttr === `{{${key}}}` || maxAttr === `{{${key}}}`) {
this.ensureViewWithinRange();
}
this.requestUpdate();
}
// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handlePrevMonth() {
if (this.disabled || this.loading) return;
const { year, month } = this.getAdjacentMonth(-1);
if (!this.canNavigateTo(year, month)) return;
this.viewYear = year;
this.viewMonth = month;
this.dispatchMonthChange();
}

private handleNextMonth() {
if (this.disabled || this.loading) return;
const { year, month } = this.getAdjacentMonth(1);
if (!this.canNavigateTo(year, month)) return;
this.viewYear = year;
this.viewMonth = month;
this.dispatchMonthChange();
}

private handleDaySelect(iso: string, disabledDay: boolean) {
if (this.disabled || this.loading || this.readonly || disabledDay) return;
this.value = iso;
this.syncViewToValue(iso);
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value }
}));
}

private handleFocusIn() {
if (this.focusWithin) return;
this.focusWithin = true;
this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
}

private handleFocusOut() {
setTimeout(() => {
const active = document.activeElement as HTMLElement | null;
if (!active || !this.contains(active)) {
if (!this.focusWithin) return;
this.focusWithin = false;
this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
}
}, 0);
}

private dispatchMonthChange() {
this.dispatchEvent(new CustomEvent('monthChange', {
bubbles: true,
composed: true,
detail: { year: this.viewYear, month: this.viewMonth + 1 }
}));
}
// ===========================================================================
// HELPERS
// ===========================================================================
private syncViewToValue(forcedValue?: string | null) {
const iso = forcedValue ?? this.value;
const date = this.parseISODate(iso);
if (date) {
this.viewYear = date.getFullYear();
this.viewMonth = date.getMonth();
} else {
const today = new Date();
this.viewYear = today.getFullYear();
this.viewMonth = today.getMonth();
}
this.ensureViewWithinRange();
}

private ensureViewWithinRange() {
if (this.canNavigateTo(this.viewYear, this.viewMonth)) return;
const minDate = this.parseISODate(this.minDate);
if (minDate) {
this.viewYear = minDate.getFullYear();
this.viewMonth = minDate.getMonth();
return;
}
const maxDate = this.parseISODate(this.maxDate);
if (maxDate) {
this.viewYear = maxDate.getFullYear();
this.viewMonth = maxDate.getMonth();
}
}

private getAdjacentMonth(step: number) {
let year = this.viewYear;
let month = this.viewMonth + step;
if (month < 0) {
month = 11;
year -= 1;
}
if (month > 11) {
month = 0;
year += 1;
}
return { year, month };
}

private getMonthTitle(): string {
const locale = this.locale || undefined;
const formatter = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
return formatter.format(new Date(this.viewYear, this.viewMonth, 1));
}

private getWeekdayLabels(): string[] {
const locale = this.locale || undefined;
const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
const baseSunday = new Date(2020, 0, 5); // Sunday
const labels: string[] = [];
const first = this.normalizeFirstDay();
for (let i = 0; i < 7; i += 1) {
const date = new Date(baseSunday);
date.setDate(baseSunday.getDate() + ((first + i) % 7));
labels.push(formatter.format(date));
}
return labels;
}

private buildCalendarDays(): Array<Array<{ iso: string; day: number; inMonth: boolean; disabled: boolean }>> {
const firstDay = new Date(this.viewYear, this.viewMonth, 1);
const startOffset = this.getStartOffset(firstDay.getDay());
const startDate = new Date(this.viewYear, this.viewMonth, 1 - startOffset);
const weeks: Array<Array<{ iso: string; day: number; inMonth: boolean; disabled: boolean }>> = [];
for (let week = 0; week < 6; week += 1) {
const days: Array<{ iso: string; day: number; inMonth: boolean; disabled: boolean }> = [];
for (let d = 0; d < 7; d += 1) {
const date = new Date(startDate);
date.setDate(startDate.getDate() + week * 7 + d);
const iso = this.formatISODate(date);
const inMonth = date.getMonth() === this.viewMonth;
const disabled = this.isOutsideRange(iso) || !inMonth;
days.push({ iso, day: date.getDate(), inMonth, disabled });
}
weeks.push(days);
}
return weeks;
}

private getStartOffset(dayIndex: number): number {
const first = this.normalizeFirstDay();
return (dayIndex - first + 7) % 7;
}

private normalizeFirstDay(): number {
return Number.isFinite(this.firstDayOfWeek) ? Math.min(Math.max(this.firstDayOfWeek, 0), 6) : 0;
}

private parseISODate(iso?: string | null): Date | null {
if (!iso) return null;
const parts = iso.split('-').map((p) => Number(p));
if (parts.length !== 3) return null;
const [year, month, day] = parts;
if (!year || !month || !day) return null;
const date = new Date(year, month - 1, day);
if (Number.isNaN(date.getTime())) return null;
return date;
}

private formatISODate(date: Date): string {
const y = date.getFullYear();
const m = String(date.getMonth() + 1).padStart(2, '0');
const d = String(date.getDate()).padStart(2, '0');
return `${y}-${m}-${d}`;
}

private formatDisplayValue(): string {
if (!this.value) return this.msg.empty;
const date = this.parseISODate(this.value);
if (!date) return this.msg.empty;
const locale = this.locale || undefined;
const formatter = new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' });
return formatter.format(date);
}

private isOutsideRange(iso: string): boolean {
if (this.minDate && iso < this.minDate) return true;
if (this.maxDate && iso > this.maxDate) return true;
return false;
}

private canNavigateTo(year: number, month: number): boolean {
const monthStart = this.formatISODate(new Date(year, month, 1));
const monthEnd = this.formatISODate(new Date(year, month + 1, 0));
if (this.minDate && monthEnd < this.minDate) return false;
if (this.maxDate && monthStart > this.maxDate) return false;
return true;
}

private isToday(iso: string): boolean {
const today = this.formatISODate(new Date());
return iso === today;
}

private isSelected(iso: string): boolean {
return !!this.value && this.value === iso;
}

private getDayButtonClasses(disabledDay: boolean, selected: boolean, today: boolean): string {
const isDayDisabled = disabledDay || this.disabled || this.loading;
return cn(
'ml-calendar-day w-full h-9 rounded-md text-sm border border-transparent transition flex items-center justify-center',
'focus:outline-none focus:ring-2',
selected ? 'ml-calendar-day-selected' : '',
!selected && today ? 'ml-calendar-day-today' : '',
!isDayDisabled && !selected && !this.readonly ? 'ml-calendar-day--hoverable' : '',
isDayDisabled ? 'ml-calendar-day-disabled' : '',
this.readonly && !isDayDisabled ? 'cursor-default' : '',
);
}

private getContainerClasses(): string {
return cn(
'ml-calendar-container w-full rounded-lg border p-4',
this.error ? 'ml-calendar-container--error' : '',
this.disabled || this.loading ? 'ml-disabled' : '',
this.readonly ? 'cursor-default' : '',
);
}

private renderLabel(): TemplateResult {
if (!this.hasSlot('Label')) return html``;
return html`
<label id="${this.uid}-label" class="${cn('ml-label mb-2 block text-sm', this.getSlotClass('Label'))}">
${unsafeHTML(this.getSlotContent('Label'))}
</label>
`;
}

private renderHelperOrError(): TemplateResult {
if (!this.isEditing) return html``;
if (this.error) {
return html`<p id="${this.uid}-error" class="ml-error-text mt-2 text-xs">${unsafeHTML(String(this.error))}</p>`;
}
if (this.hasSlot('Helper')) {
return html`<p id="${this.uid}-helper" class="${cn('ml-helper mt-2 text-xs', this.getSlotClass('Helper'))}">${unsafeHTML(this.getSlotContent('Helper'))}</p>`;
}
return html``;
}

private renderHiddenInput(): TemplateResult {
if (!this.name) return html``;
return html`<input type="hidden" name="${this.name}" value="${this.value ?? ''}" />`;
}

private renderViewMode(): TemplateResult {
return html`
<div class="${cn('w-full', this.cssClass)}">
${this.renderLabel()}
<div class="ml-text text-sm">${this.formatDisplayValue()}</div>
${this.renderHiddenInput()}
</div>
`;
}

private renderCalendar(): TemplateResult {
const weeks = this.buildCalendarDays();
const weekdayLabels = this.getWeekdayLabels();
const prevDisabled = !this.canNavigateTo(this.getAdjacentMonth(-1).year, this.getAdjacentMonth(-1).month) || this.disabled || this.loading;
const nextDisabled = !this.canNavigateTo(this.getAdjacentMonth(1).year, this.getAdjacentMonth(1).month) || this.disabled || this.loading;
const describedBy = this.error ? `${this.uid}-error` : this.hasSlot('Helper') ? `${this.uid}-helper` : '';
const ariaLabelledBy = this.hasSlot('Label') ? `${this.uid}-label` : undefined;
return html`
<div
class="${this.getContainerClasses()}"
role="dialog"
aria-modal="true"
aria-labelledby="${ariaLabelledBy ?? ''}"
aria-describedby="${describedBy}"
aria-invalid="${this.error ? 'true' : 'false'}"
aria-required="${this.required ? 'true' : 'false'}"
@focusin="${this.handleFocusIn}"
@focusout="${this.handleFocusOut}"
>
<div class="ml-calendar-nav flex items-center justify-between mb-3">
<button
class="${cn('ml-calendar-nav-btn h-8 w-8 rounded-md border text-sm', prevDisabled ? 'ml-disabled' : 'ml-calendar-nav-btn--enabled')}"
?disabled="${prevDisabled}"
@mousedown="${(e: Event) => e.preventDefault()}"
@click="${this.handlePrevMonth}"
aria-label="${this.msg.previousMonth}"
>
<span class="text-lg">‹</span>
</button>
<div class="ml-text text-sm font-medium" aria-live="polite">${this.getMonthTitle()}</div>
<button
class="${cn('ml-calendar-nav-btn h-8 w-8 rounded-md border text-sm', nextDisabled ? 'ml-disabled' : 'ml-calendar-nav-btn--enabled')}"
?disabled="${nextDisabled}"
@mousedown="${(e: Event) => e.preventDefault()}"
@click="${this.handleNextMonth}"
aria-label="${this.msg.nextMonth}"
>
<span class="text-lg">›</span>
</button>
</div>
<div class="grid grid-cols-${this.showWeekNumbers ? '8' : '7'} gap-1 text-xs mb-2">
${this.showWeekNumbers ? html`<div class="ml-text-muted text-center">${this.msg.week}</div>` : html``}
${weekdayLabels.map((label) => html`<div class="ml-text-muted text-center">${label}</div>`)}
</div>
<div class="grid grid-cols-${this.showWeekNumbers ? '8' : '7'} gap-1" role="grid">
${weeks.map((week, weekIndex) => html`
${this.showWeekNumbers ? html`
<div class="ml-text-muted text-xs flex items-center justify-center">${this.getWeekNumber(weekIndex)}</div>
` : html``}
${week.map((day) => {
const selected = this.isSelected(day.iso);
const today = this.isToday(day.iso);
const classes = this.getDayButtonClasses(day.disabled, selected, today);
return html`
<button
class="${classes}"
role="gridcell"
aria-selected="${selected ? 'true' : 'false'}"
aria-disabled="${day.disabled || this.disabled || this.loading ? 'true' : 'false'}"
?disabled="${day.disabled || this.disabled || this.loading}"
@mousedown="${(e: Event) => e.preventDefault()}"
@click="${() => this.handleDaySelect(day.iso, day.disabled)}"
>
<span class="${day.inMonth ? '' : 'ml-calendar-day-outside'}">${day.day}</span>
</button>
`;
})}
`)}
</div>
${this.renderHiddenInput()}
</div>
`;
}

private getWeekNumber(weekIndex: number): number {
const firstDay = new Date(this.viewYear, this.viewMonth, 1);
const startOffset = this.getStartOffset(firstDay.getDay());
const weekStart = new Date(this.viewYear, this.viewMonth, 1 - startOffset + weekIndex * 7);
return this.calculateISOWeek(weekStart);
}

private calculateISOWeek(date: Date): number {
const temp = new Date(date.getTime());
temp.setHours(0, 0, 0, 0);
const day = temp.getDay() || 7;
temp.setDate(temp.getDate() + 4 - day);
const yearStart = new Date(temp.getFullYear(), 0, 1);
return Math.ceil((((temp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
// ===========================================================================
// RENDER
// ===========================================================================
createRenderRoot() {
return this;
}

render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];
if (!this.isEditing) {
return this.renderViewMode();
}
return html`
<div class="${cn('w-full', this.cssClass)}">
${this.renderLabel()}
${this.loading
? html`<div class="${this.getContainerClasses()} ml-text-muted text-sm">${this.msg.loading}</div>`
: this.renderCalendar()}
${this.renderHelperOrError()}
</div>
`;
}
}
