/// <mls fileReference="_102040_/l2/molecules/groupenterdateinterval/ml-date-range-dual-calendar.ts" enhancement="_102020_/l2/enhancementAura"/>

// =============================================================================
// DATE RANGE DUAL CALENDAR MOLECULE
// =============================================================================
// Skill Group: enter + date-interval
// This molecule does NOT contain business logic.
import { html, svg, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  placeholderStart: 'Start date',
  placeholderEnd: 'End date',
  loading: 'Loading...',
  clear: 'Clear',
  empty: '—',
  to: 'to',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholderStart: 'Data inicial',
    placeholderEnd: 'Data final',
    loading: 'Carregando...',
    clear: 'Limpar',
    empty: '—',
    to: 'até',
  },
};
/// **collab_i18n_end**

let uidCounter = 0;

@customElement('groupenterdateinterval--ml-date-range-dual-calendar')
export class DateRangeDualCalendarMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;
  private uid = `drdc-${++uidCounter}`;
  private onDocumentClick = (e: MouseEvent) => this.handleOutsideClick(e);
  private isFocused = false;

  // ==========================================================================
  // SLOT TAGS
  // ==========================================================================
  slotTags = ['Label', 'LabelStart', 'LabelEnd', 'Helper'];

  // ==========================================================================
  // PROPERTIES — From Contract
  // ==========================================================================
  @propertyDataSource({ type: String })
  startDate: string | null = null;

  @propertyDataSource({ type: String })
  endDate: string | null = null;

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

  @propertyDataSource({ type: Number, attribute: 'min-range-days' })
  minRangeDays: number = 0;

  @propertyDataSource({ type: Number, attribute: 'max-range-days' })
  maxRangeDays: number = 0;

  @propertyDataSource({ type: Number, attribute: 'first-day-of-week' })
  firstDayOfWeek: number = 0;

  @propertyDataSource({ type: Boolean, attribute: 'allow-same-day' })
  allowSameDay: boolean = true;

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

  // ==========================================================================
  // INTERNAL STATE
  // ==========================================================================
  @state()
  private isOpen: boolean = false;

  @state()
  private selectingEnd: boolean = false;

  @state()
  private hoverDate: string | null = null;

  @state()
  private currentMonthLeft: Date = this.getToday();

  // ==========================================================================
  // LIFECYCLE
  // ==========================================================================
  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.onDocumentClick);
    super.disconnectedCallback();
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('isOpen')) {
      if (this.isOpen) {
        document.addEventListener('click', this.onDocumentClick);
      } else {
        document.removeEventListener('click', this.onDocumentClick);
      }
    }
  }

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================
  private handleFocusIn() {
    if (this.isEditing && !this.isFocused) {
      this.isFocused = true;
      this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
    }
  }

  private handleFocusOut() {
    if (this.isEditing && this.isFocused) {
      this.isFocused = false;
      this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
    }
  }

  private handleOpenCalendar(selectEnd: boolean) {
    if (!this.isEditing || this.disabled || this.readonly || this.loading) return;
    const baseDate = this.startDate ? this.parseISO(this.startDate) : this.getToday();
    const adjusted = this.adjustMonthToBounds(baseDate || this.getToday());
    this.currentMonthLeft = adjusted;
    this.isOpen = true;
    this.selectingEnd = selectEnd && !!this.startDate;
    this.hoverDate = null;
  }

  private handleOutsideClick(e: MouseEvent) {
    if (!this.isOpen) return;
    const target = e.target as Node;
    if (!this.contains(target)) {
      this.closeCalendar();
    }
  }

  private closeCalendar() {
    this.isOpen = false;
    this.selectingEnd = false;
    this.hoverDate = null;
  }

  private handleDayHover(date: Date) {
    if (!this.selectingEnd || this.disabled || this.readonly || this.loading) return;
    const iso = this.formatISO(date);
    if (this.isDateDisabled(date, 'end')) {
      this.hoverDate = null;
      return;
    }
    this.hoverDate = iso;
  }

  private handleDayClick(date: Date) {
    if (!this.isEditing || this.disabled || this.readonly || this.loading) return;
    const iso = this.formatISO(date);

    if (!this.selectingEnd || !this.startDate) {
      this.startDate = iso;
      this.endDate = null;
      this.selectingEnd = true;
      this.hoverDate = null;
      this.emitStartChange();
      return;
    }

    const start = this.parseISO(this.startDate);
    if (!start) {
      this.startDate = iso;
      this.endDate = null;
      this.selectingEnd = true;
      this.hoverDate = null;
      this.emitStartChange();
      return;
    }

    const end = date;
    let startDate = start;
    let endDate = end;
    let swapped = false;

    if (this.compareDates(end, start) < 0) {
      startDate = end;
      endDate = start;
      swapped = true;
    }

    if (!this.canSelectRange(startDate, endDate)) {
      return;
    }

    const newStartIso = this.formatISO(startDate);
    const newEndIso = this.formatISO(endDate);

    this.startDate = newStartIso;
    this.endDate = newEndIso;
    if (swapped) {
      this.emitStartChange();
    }
    this.emitEndChange();
    this.emitChange();
    this.closeCalendar();
  }

  private handlePrevMonth() {
    const prev = this.addMonths(this.currentMonthLeft, -1);
    if (!this.canNavigateToMonth(prev)) return;
    this.currentMonthLeft = prev;
  }

  private handleNextMonth() {
    const next = this.addMonths(this.currentMonthLeft, 1);
    if (!this.canNavigateToMonth(next)) return;
    this.currentMonthLeft = next;
  }

  private handleClear() {
    if (!this.isEditing || this.disabled || this.readonly || this.loading) return;
    this.startDate = null;
    this.endDate = null;
    this.selectingEnd = false;
    this.hoverDate = null;
    this.emitStartChange();
    this.emitEndChange();
    this.emitChange();
  }

  // ==========================================================================
  // EMIT EVENTS
  // ==========================================================================
  private emitStartChange() {
    this.dispatchEvent(
      new CustomEvent('startChange', {
        bubbles: true,
        composed: true,
        detail: { value: this.startDate },
      })
    );
  }

  private emitEndChange() {
    this.dispatchEvent(
      new CustomEvent('endChange', {
        bubbles: true,
        composed: true,
        detail: { value: this.endDate },
      })
    );
  }

  private emitChange() {
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { startDate: this.startDate, endDate: this.endDate },
      })
    );
  }

  // ==========================================================================
  // DATE HELPERS
  // ==========================================================================
  private getToday(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  private parseISO(iso: string | null): Date | null {
    if (!iso) return null;
    const parts = iso.split('-').map((v) => Number(v));
    if (parts.length !== 3) return null;
    const [y, m, d] = parts;
    return new Date(y, m - 1, d);
  }

  private formatISO(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private formatDisplay(iso: string | null): string {
    if (!iso) return this.msg.empty;
    const date = this.parseISO(iso);
    if (!date) return this.msg.empty;
    const locale = this.getLocale();
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  private getLocale(): string {
    return this.locale || navigator.language || 'en-US';
  }

  private compareDates(a: Date, b: Date): number {
    return this.toUtcDay(a) - this.toUtcDay(b);
  }

  private toUtcDay(date: Date): number {
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private addDays(date: Date, days: number): Date {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    d.setDate(d.getDate() + days);
    return d;
  }

  private addMonths(date: Date, months: number): Date {
    return new Date(date.getFullYear(), date.getMonth() + months, 1);
  }

  private daysBetween(start: Date, end: Date): number {
    const diff = this.toUtcDay(end) - this.toUtcDay(start);
    return Math.round(diff / (1000 * 60 * 60 * 24));
  }

  private adjustMonthToBounds(date: Date): Date {
    const min = this.parseISO(this.minDate);
    const max = this.parseISO(this.maxDate);
    let base = new Date(date.getFullYear(), date.getMonth(), 1);
    if (min && this.compareDates(base, min) < 0) {
      base = new Date(min.getFullYear(), min.getMonth(), 1);
    }
    if (max && this.compareDates(base, max) > 0) {
      base = new Date(max.getFullYear(), max.getMonth(), 1);
    }
    return base;
  }

  private canNavigateToMonth(monthStart: Date): boolean {
    const min = this.parseISO(this.minDate);
    const max = this.parseISO(this.maxDate);
    if (min) {
      const prevEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
      if (this.compareDates(prevEnd, min) < 0) return false;
    }
    if (max) {
      const nextStart = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1);
      if (this.compareDates(nextStart, max) > 0) return false;
    }
    return true;
  }

  private canSelectRange(start: Date, end: Date): boolean {
    const diff = Math.abs(this.daysBetween(start, end));
    if (!this.allowSameDay && diff === 0) return false;
    if (this.minRangeDays > 0 && diff < this.minRangeDays) return false;
    if (this.maxRangeDays > 0 && diff > this.maxRangeDays) return false;
    return true;
  }

  private isDateDisabled(date: Date, mode: 'start' | 'end'): boolean {
    if (this.disabled || this.readonly || this.loading) return true;
    const min = this.parseISO(this.minDate);
    const max = this.parseISO(this.maxDate);
    if (min && this.compareDates(date, min) < 0) return true;
    if (max && this.compareDates(date, max) > 0) return true;

    if (mode === 'end' && this.startDate) {
      const start = this.parseISO(this.startDate);
      if (!start) return false;
      const diff = Math.abs(this.daysBetween(start, date));
      if (!this.allowSameDay && diff === 0) return true;
      if (this.minRangeDays > 0 && diff < this.minRangeDays) return true;
      if (this.maxRangeDays > 0 && diff > this.maxRangeDays) return true;
    }
    return false;
  }

  private isInRange(date: Date): boolean {
    const start = this.parseISO(this.startDate);
    const end = this.parseISO(this.endDate);
    if (start && end) {
      const min = this.compareDates(start, end) <= 0 ? start : end;
      const max = this.compareDates(start, end) <= 0 ? end : start;
      return this.compareDates(date, min) >= 0 && this.compareDates(date, max) <= 0;
    }
    if (this.selectingEnd && start && this.hoverDate) {
      const hover = this.parseISO(this.hoverDate);
      if (!hover) return false;
      if (this.isDateDisabled(hover, 'end')) return false;
      const min = this.compareDates(start, hover) <= 0 ? start : hover;
      const max = this.compareDates(start, hover) <= 0 ? hover : start;
      return this.compareDates(date, min) >= 0 && this.compareDates(date, max) <= 0;
    }
    return false;
  }

  private getWeekdayLabels(): string[] {
    const locale = this.getLocale();
    const base = new Date(2026, 0, 5); // Monday
    const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    const labels = Array.from({ length: 7 }).map((_, i) => formatter.format(this.addDays(base, i)));
    const start = this.firstDayOfWeek % 7;
    return [...labels.slice(start), ...labels.slice(0, start)];
  }

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================
  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    return html`
      <div id="${this.uid}-label" class="${cn('mb-2 text-sm font-medium ml-label', this.getSlotClass('Label'))}">
        ${unsafeHTML(this.getSlotContent('Label'))}
      </div>
    `;
  }

  private renderStartLabel(): TemplateResult {
    if (!this.hasSlot('LabelStart')) return html``;
    return html`
      <div id="${this.uid}-label-start" class="${cn('mb-1 text-xs ml-text-muted', this.getSlotClass('LabelStart'))}">
        ${unsafeHTML(this.getSlotContent('LabelStart'))}
      </div>
    `;
  }

  private renderEndLabel(): TemplateResult {
    if (!this.hasSlot('LabelEnd')) return html``;
    return html`
      <div id="${this.uid}-label-end" class="${cn('mb-1 text-xs ml-text-muted', this.getSlotClass('LabelEnd'))}">
        ${unsafeHTML(this.getSlotContent('LabelEnd'))}
      </div>
    `;
  }

  private renderHelperOrError(): TemplateResult {
    if (!this.isEditing) return html``;
    if (this.error) {
      return html`<p id="${this.uid}-error" class="mt-2 text-xs ml-error-text">${unsafeHTML(String(this.error))}</p>`;
    }
    if (this.hasSlot('Helper')) {
      return html`<p id="${this.uid}-helper" class="${cn('mt-2 text-xs ml-text-muted', this.getSlotClass('Helper'))}">${unsafeHTML(this.getSlotContent('Helper'))}</p>`;
    }
    return html``;
  }

  private renderCalendarIcon(): TemplateResult {
    return html`
      <svg class="h-4 w-4 ml-icon-muted" viewBox="0 0 24 24" aria-hidden="true">
        ${svg`
          <path fill="currentColor" d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1.5A2.5 2.5 0 0 1 22 6.5v13A2.5 2.5 0 0 1 19.5 22h-15A2.5 2.5 0 0 1 2 19.5v-13A2.5 2.5 0 0 1 4.5 4H6V3a1 1 0 0 1 1-1Zm12.5 7h-15V19.5a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5V9ZM6 6h12V6.5H6V6Z" />
        `}
      </svg>
    `;
  }

  private renderMonth(monthStart: Date): TemplateResult {
    const locale = this.getLocale();
    const title = monthStart.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
    const weekdayLabels = this.getWeekdayLabels();

    const firstDay = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1);
    const startOffset = (firstDay.getDay() - this.firstDayOfWeek + 7) % 7;
    const gridStart = this.addDays(firstDay, -startOffset);

    const days = Array.from({ length: 42 }).map((_, i) => this.addDays(gridStart, i));

    return html`
      <div class="flex-1 rounded-lg border p-3 ml-calendar-container">
        <div class="mb-3 text-sm font-semibold ml-label">${title}</div>
        <div class="grid grid-cols-7 gap-1 text-xs ml-text-muted mb-1">
          ${weekdayLabels.map((label) => html`<div class="text-center">${label}</div>`)}
        </div>
        <div class="grid grid-cols-7 gap-1" role="grid">
          ${days.map((day) => {
            const iso = this.formatISO(day);
            const isCurrentMonth = day.getMonth() === monthStart.getMonth();
            const isStart = this.startDate === iso;
            const isEnd = this.endDate === iso;
            const inRange = this.isInRange(day);
            const disabled = this.isDateDisabled(day, this.selectingEnd ? 'end' : 'start');

            const classes = cn(
              'h-8 w-8 rounded-md text-xs font-medium transition ml-calendar-day',
              isCurrentMonth ? 'ml-text' : 'ml-calendar-day-outside',
              inRange ? 'ml-interval-range' : '',
              isStart || isEnd ? 'border ml-interval-start' : 'border border-transparent',
              disabled ? 'ml-calendar-day-disabled' : 'ml-calendar-day--hoverable cursor-pointer',
            );

            return html`
              <button
                type="button"
                class="${classes}"
                role="gridcell"
                aria-selected="${isStart || isEnd}"
                aria-disabled="${disabled}"
                ?disabled=${disabled}
                @mouseenter=${() => this.handleDayHover(day)}
                @click=${() => this.handleDayClick(day)}
              >
                ${day.getDate()}
              </button>
            `;
          })}
        </div>
      </div>
    `;
  }

  private renderCalendarPanel(): TemplateResult {
    if (!this.isOpen || this.loading) return html``;
    const rightMonth = this.addMonths(this.currentMonthLeft, 1);

    const navDisabledPrev = !this.canNavigateToMonth(this.addMonths(this.currentMonthLeft, -1));
    const navDisabledNext = !this.canNavigateToMonth(this.addMonths(this.currentMonthLeft, 1));

    const panelClasses = cn(
      'mt-3 rounded-lg border p-3 ml-calendar-panel',
      'shadow-lg',
    );

    return html`
      <div class="${panelClasses}" role="dialog" aria-modal="true">
        <div class="mb-3 flex items-center justify-between">
          <button
            type="button"
            class="h-8 w-8 rounded-md ml-calendar-nav disabled:opacity-50"
            ?disabled=${navDisabledPrev}
            @click=${this.handlePrevMonth}
            aria-label="Previous month"
          >
            ${svg`<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6" /></svg>`}
          </button>
          <div class="text-xs ml-text-muted">${this.selectingEnd ? this.msg.placeholderEnd : this.msg.placeholderStart}</div>
          <button
            type="button"
            class="h-8 w-8 rounded-md ml-calendar-nav disabled:opacity-50"
            ?disabled=${navDisabledNext}
            @click=${this.handleNextMonth}
            aria-label="Next month"
          >
            ${svg`<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6" /></svg>`}
          </button>
        </div>
        <div class="flex flex-col gap-3 lg:flex-row">
          ${this.renderMonth(this.currentMonthLeft)}
          ${this.renderMonth(rightMonth)}
        </div>
        <div class="mt-3 flex justify-between">
          <button
            type="button"
            class="text-xs ml-clear-btn"
            @click=${this.handleClear}
          >
            ${this.msg.clear}
          </button>
          <div class="text-xs ml-text-muted">
            ${this.minRangeDays > 0 ? html`<span>Min: ${this.minRangeDays}</span>` : html``}
            ${this.maxRangeDays > 0 ? html`<span class="ml-2">Max: ${this.maxRangeDays}</span>` : html``}
          </div>
        </div>
      </div>
    `;
  }

  private renderViewMode(): TemplateResult {
    const start = this.startDate ? this.formatDisplay(this.startDate) : this.msg.empty;
    const end = this.endDate ? this.formatDisplay(this.endDate) : this.msg.empty;
    const value = `${start} – ${end}`;

    return html`
      <div class="${cn('flex flex-col', this.cssClass)}" @focusin=${this.handleFocusIn} @focusout=${this.handleFocusOut}>
        ${this.renderLabel()}
        <div class="text-sm ml-text">${value}</div>
      </div>
    `;
  }

  private renderEditMode(): TemplateResult {
    const hasError = !!this.error;
    const startText = this.startDate ? this.formatDisplay(this.startDate) : this.msg.placeholderStart;
    const endText = this.endDate ? this.formatDisplay(this.endDate) : this.msg.placeholderEnd;

    const triggerBase = cn(
      'w-full rounded-lg border px-3 py-2 text-left text-sm transition flex items-center justify-between gap-2',
      'ml-input-container ml-text',
      hasError ? 'ml-input-container-error' : '',
      (this.disabled || this.loading) ? 'ml-disabled' : 'cursor-pointer',
    );

    const containerClasses = cn(
      'rounded-lg border p-4 ml-input-container',
      (this.disabled || this.loading) ? 'ml-disabled' : '',
      this.cssClass,
    );

    return html`
      <div class="${containerClasses}" @focusin=${this.handleFocusIn} @focusout=${this.handleFocusOut}>
        ${this.renderLabel()}
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            ${this.renderStartLabel()}
            <button
              type="button"
              class="${triggerBase}"
              aria-labelledby="${this.uid}-label ${this.uid}-label-start"
              aria-invalid="${hasError}"
              aria-required="${this.required}"
              ?disabled=${this.disabled || this.readonly || this.loading}
              @click=${() => this.handleOpenCalendar(false)}
            >
              <span class="${this.startDate ? '' : 'ml-placeholder'}">${startText}</span>
              ${this.renderCalendarIcon()}
            </button>
          </div>
          <div>
            ${this.renderEndLabel()}
            <button
              type="button"
              class="${triggerBase}"
              aria-labelledby="${this.uid}-label ${this.uid}-label-end"
              aria-invalid="${hasError}"
              aria-required="${this.required}"
              ?disabled=${this.disabled || this.readonly || this.loading}
              @click=${() => this.handleOpenCalendar(true)}
            >
              <span class="${this.endDate ? '' : 'ml-placeholder'}">${endText}</span>
              ${this.renderCalendarIcon()}
            </button>
          </div>
        </div>

        ${this.loading ? html`<div class="mt-3 text-xs ml-text-muted">${this.msg.loading}</div>` : html``}
        ${this.renderCalendarPanel()}
        ${this.renderHelperOrError()}

        ${this.name ? html`<input type="hidden" name="${this.name}-start" value="${this.startDate || ''}" />` : html``}
        ${this.name ? html`<input type="hidden" name="${this.name}-end" value="${this.endDate || ''}" />` : html``}
      </div>
    `;
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================
  render(): TemplateResult {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    if (!this.isEditing) {
      return this.renderViewMode();
    }
    return this.renderEditMode();
  }
}
