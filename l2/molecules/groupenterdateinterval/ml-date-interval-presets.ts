/// <mls fileReference="_102040_/l2/molecules/groupenterdateinterval/ml-date-interval-presets.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// DATE INTERVAL PRESETS MOLECULE
// =============================================================================
// Skill Group: groupEnterDateInterval
// This molecule does NOT contain business logic.

import { html, svg, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  selectStartDate: 'Select start date',
  selectEndDate: 'Select end date',
  startDate: 'Start',
  endDate: 'End',
  noDateSelected: '—',
  to: '–',
  loading: 'Loading...',
  today: 'Today',
  clear: 'Clear',
  apply: 'Apply',
  cancel: 'Cancel',
  presets: 'Quick Select',
  customRange: 'Custom Range',
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    selectStartDate: 'Selecione a data inicial',
    selectEndDate: 'Selecione a data final',
    startDate: 'Início',
    endDate: 'Fim',
    noDateSelected: '—',
    to: '–',
    loading: 'Carregando...',
    today: 'Hoje',
    clear: 'Limpar',
    apply: 'Aplicar',
    cancel: 'Cancelar',
    presets: 'Seleção Rápida',
    customRange: 'Período Personalizado',
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    dayNamesShort: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sá'],
  },
};
/// **collab_i18n_end**

interface PresetOption {
  label: string;
  startDate: string;
  endDate: string;
}

@customElement('groupenterdateinterval--ml-date-interval-presets')
export class MlDateIntervalPresetsMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'LabelStart', 'LabelEnd', 'Helper', 'Preset'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: String, attribute: 'start-date' })
  startDate: string | null = null;

  @propertyDataSource({ type: String, attribute: 'end-date' })
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

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private isOpen: boolean = false;

  @state()
  private selectingEnd: boolean = false;

  @state()
  private hoverDate: string | null = null;

  @state()
  private viewingMonth: number = new Date().getMonth();

  @state()
  private viewingYear: number = new Date().getFullYear();

  @state()
  private focusedField: 'start' | 'end' | null = null;

  @state()
  private parsedPresets: PresetOption[] = [];

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  firstUpdated() {
    this.parsePresets();
    this.initializeViewingMonth();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('startDate') || changedProperties.has('endDate')) {
      this.initializeViewingMonth();
    }
  }

  // ===========================================================================
  // PRESET PARSING
  // ===========================================================================
  private parsePresets() {
    const presetElements = this.getSlots('Preset');
    this.parsedPresets = presetElements.map(el => {
      return {
        label: el.innerHTML.trim(),
        startDate: el.getAttribute('start-date') || '',
        endDate: el.getAttribute('end-date') || '',
      };
    }).filter(p => p.startDate && p.endDate);
  }

  private initializeViewingMonth() {
    if (this.startDate) {
      const date = this.parseDate(this.startDate);
      if (date) {
        this.viewingMonth = date.getMonth();
        this.viewingYear = date.getFullYear();
      }
    } else {
      const now = new Date();
      this.viewingMonth = now.getMonth();
      this.viewingYear = now.getFullYear();
    }
  }

  // ===========================================================================
  // DATE UTILITIES
  // ===========================================================================
  private parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }

  private formatDateISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatDateDisplay(dateStr: string | null): string {
    if (!dateStr) return this.msg.noDateSelected;
    const date = this.parseDate(dateStr);
    if (!date) return this.msg.noDateSelected;

    const effectiveLocale = this.locale || 'en-US';
    try {
      return date.toLocaleDateString(effectiveLocale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    }
  }

  private formatRangeDisplay(): string {
    const start = this.formatDateDisplay(this.startDate);
    const end = this.formatDateDisplay(this.endDate);
    return `${start} ${this.msg.to} ${end}`;
  }

  private getDaysBetween(start: Date, end: Date): number {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private isDateDisabled(dateStr: string): boolean {
    const date = this.parseDate(dateStr);
    if (!date) return true;

    if (this.minDate) {
      const min = this.parseDate(this.minDate);
      if (min && date < min) return true;
    }

    if (this.maxDate) {
      const max = this.parseDate(this.maxDate);
      if (max && date > max) return true;
    }

    if (this.selectingEnd && this.startDate) {
      const start = this.parseDate(this.startDate);
      if (start) {
        const days = this.getDaysBetween(start, date);
        if (!this.allowSameDay && days === 0) return true;
        if (this.minRangeDays > 0 && days < this.minRangeDays) return true;
        if (this.maxRangeDays > 0 && days > this.maxRangeDays) return true;
      }
    }

    return false;
  }

  private isDateInRange(dateStr: string): boolean {
    if (!this.startDate) return false;
    const date = this.parseDate(dateStr);
    const start = this.parseDate(this.startDate);
    if (!date || !start) return false;

    const endDateStr = this.selectingEnd && this.hoverDate ? this.hoverDate : this.endDate;
    if (!endDateStr) return false;

    const end = this.parseDate(endDateStr);
    if (!end) return false;

    return date >= start && date <= end;
  }

  private isRangeStart(dateStr: string): boolean {
    return dateStr === this.startDate;
  }

  private isRangeEnd(dateStr: string): boolean {
    if (this.selectingEnd && this.hoverDate) {
      return dateStr === this.hoverDate;
    }
    return dateStr === this.endDate;
  }

  // ===========================================================================
  // CALENDAR GENERATION
  // ===========================================================================
  private getCalendarDays(): { date: string; day: number; isCurrentMonth: boolean }[] {
    const days: { date: string; day: number; isCurrentMonth: boolean }[] = [];
    const firstDay = new Date(this.viewingYear, this.viewingMonth, 1);
    const lastDay = new Date(this.viewingYear, this.viewingMonth + 1, 0);

    let startDayOfWeek = firstDay.getDay() - this.firstDayOfWeek;
    if (startDayOfWeek < 0) startDayOfWeek += 7;

    // Previous month days
    const prevMonthLastDay = new Date(this.viewingYear, this.viewingMonth, 0);
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay.getDate() - i;
      const date = new Date(this.viewingYear, this.viewingMonth - 1, day);
      days.push({
        date: this.formatDateISO(date),
        day,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(this.viewingYear, this.viewingMonth, day);
      days.push({
        date: this.formatDateISO(date),
        day,
        isCurrentMonth: true,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(this.viewingYear, this.viewingMonth + 1, day);
      days.push({
        date: this.formatDateISO(date),
        day,
        isCurrentMonth: false,
      });
    }

    return days;
  }

  private getOrderedDayNames(): string[] {
    const dayNames = [...this.msg.dayNamesShort];
    const reordered: string[] = [];
    for (let i = 0; i < 7; i++) {
      reordered.push(dayNames[(this.firstDayOfWeek + i) % 7]);
    }
    return reordered;
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleTriggerClick() {
    if (this.disabled || this.readonly || this.loading) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
    }
  }

  private handleDateSelect(dateStr: string) {
    if (this.disabled || this.readonly || this.isDateDisabled(dateStr)) return;

    if (!this.selectingEnd) {
      // Selecting start date
      this.startDate = dateStr;
      this.endDate = null;
      this.selectingEnd = true;
      this.dispatchEvent(new CustomEvent('startChange', {
        bubbles: true,
        composed: true,
        detail: { value: this.startDate },
      }));
    } else {
      // Selecting end date
      const start = this.parseDate(this.startDate!);
      const end = this.parseDate(dateStr);

      if (start && end) {
        if (end < start) {
          // Swap dates
          this.endDate = this.startDate;
          this.startDate = dateStr;
        } else {
          this.endDate = dateStr;
        }

        this.selectingEnd = false;
        this.hoverDate = null;
        this.isOpen = false;

        this.dispatchEvent(new CustomEvent('endChange', {
          bubbles: true,
          composed: true,
          detail: { value: this.endDate },
        }));

        this.dispatchEvent(new CustomEvent('change', {
          bubbles: true,
          composed: true,
          detail: { startDate: this.startDate, endDate: this.endDate },
        }));

        this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
      }
    }
  }

  private handleDateHover(dateStr: string) {
    if (this.selectingEnd && !this.isDateDisabled(dateStr)) {
      this.hoverDate = dateStr;
    }
  }

  private handleDateHoverEnd() {
    this.hoverDate = null;
  }

  private handlePresetSelect(preset: PresetOption) {
    if (this.disabled || this.readonly) return;

    this.startDate = preset.startDate;
    this.endDate = preset.endDate;
    this.selectingEnd = false;
    this.hoverDate = null;
    this.isOpen = false;

    this.dispatchEvent(new CustomEvent('startChange', {
      bubbles: true,
      composed: true,
      detail: { value: this.startDate },
    }));

    this.dispatchEvent(new CustomEvent('endChange', {
      bubbles: true,
      composed: true,
      detail: { value: this.endDate },
    }));

    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { startDate: this.startDate, endDate: this.endDate },
    }));

    this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
  }

  private handlePrevMonth() {
    if (this.viewingMonth === 0) {
      this.viewingMonth = 11;
      this.viewingYear--;
    } else {
      this.viewingMonth--;
    }
  }

  private handleNextMonth() {
    if (this.viewingMonth === 11) {
      this.viewingMonth = 0;
      this.viewingYear++;
    } else {
      this.viewingMonth++;
    }
  }

  private handleOutsideClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!this.contains(target)) {
      this.isOpen = false;
      this.selectingEnd = false;
      this.hoverDate = null;
      this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
    }
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.handleOutsideClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleOutsideClick);
  }

  private isPresetActive(preset: PresetOption): boolean {
    return this.startDate === preset.startDate && this.endDate === preset.endDate;
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private getTriggerClasses(): string {
    return cn(
      'ml-input-container w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-sm transition',
      this.error ? 'ml-input-container-error' : '',
      !this.disabled && !this.readonly ? 'ml-input-container--hoverable cursor-pointer' : '',
      this.disabled ? 'ml-disabled' : '',
      this.readonly ? 'cursor-default' : '',
      'focus:outline-none focus:ring-2',
    );
  }

  private getPresetClasses(isActive: boolean): string {
    return cn(
      'w-full px-3 py-2 text-sm rounded-md text-left transition border',
      isActive ? 'ml-preset-active' : 'ml-preset',
      !isActive ? 'ml-preset--hoverable' : '',
      'focus:outline-none focus:ring-2',
    );
  }

  private getDayClasses(day: { date: string; day: number; isCurrentMonth: boolean }): string {
    const isDisabled = this.isDateDisabled(day.date);
    const isInRange = this.isDateInRange(day.date);
    const isStart = this.isRangeStart(day.date);
    const isEnd = this.isRangeEnd(day.date);
    const isToday = day.date === this.formatDateISO(new Date());

    return cn(
      'ml-calendar-day w-8 h-8 flex items-center justify-center text-sm rounded-md transition',
      !day.isCurrentMonth ? 'ml-calendar-day-outside' : '',
      day.isCurrentMonth && !isDisabled && !isInRange && !isStart && !isEnd
        ? 'ml-calendar-day--hoverable'
        : '',
      isInRange && !isStart && !isEnd ? 'ml-interval-range' : '',
      isStart || isEnd ? 'ml-interval-start' : '',
      isToday && !isStart && !isEnd && !isInRange ? 'ml-calendar-day-today' : '',
      isDisabled ? 'ml-calendar-day-disabled' : 'cursor-pointer',
    );
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    if (this.loading) {
      return this.renderLoading();
    }

    if (!this.isEditing) {
      return this.renderViewMode();
    }

    return this.renderEditMode();
  }

  private renderLoading(): TemplateResult {
    return html`
      <div class="flex items-center gap-2 px-3 py-2 text-sm ml-text-muted">
        ${this.renderSpinner()}
        <span>${this.msg.loading}</span>
      </div>
    `;
  }

  private renderSpinner(): TemplateResult {
    return html`
      <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        ${svg`
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        `}
      </svg>
    `;
  }

  private renderViewMode(): TemplateResult {
    return html`
      <div class="${cn('ml-text text-sm', this.cssClass)}">
        ${this.formatRangeDisplay()}
      </div>
    `;
  }

  private renderEditMode(): TemplateResult {
    return html`
      <div class="${cn('relative w-full', this.cssClass)}">
        ${this.renderLabel()}
        ${this.renderTrigger()}
        ${this.isOpen ? this.renderDropdown() : html``}
        ${this.renderFeedback()}
      </div>
    `;
  }

  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    return html`
      <label class="${cn('ml-label block text-sm mb-1', this.getSlotClass('Label'))}">
        ${unsafeHTML(this.getSlotContent('Label'))}
        ${this.required ? html`<span class="ml-error-text">*</span>` : html``}
      </label>
    `;
  }

  private renderTrigger(): TemplateResult {
    return html`
      <button
        type="button"
        class=${this.getTriggerClasses()}
        ?disabled=${this.disabled}
        aria-haspopup="dialog"
        aria-expanded=${this.isOpen}
        aria-invalid=${this.error ? 'true' : 'false'}
        aria-required=${this.required}
        @click=${this.handleTriggerClick}
      >
        <div class="flex items-center gap-2 flex-1 min-w-0">
          ${this.renderCalendarIcon()}
          <div class="flex items-center gap-1 truncate">
            <span class=${this.startDate ? 'ml-text' : 'ml-text-muted'}>
              ${this.formatDateDisplay(this.startDate)}
            </span>
            <span class="ml-text-muted">${this.msg.to}</span>
            <span class=${this.endDate ? 'ml-text' : 'ml-text-muted'}>
              ${this.formatDateDisplay(this.endDate)}
            </span>
          </div>
        </div>
        ${this.renderChevronIcon()}
      </button>
    `;
  }

  private renderCalendarIcon(): TemplateResult {
    return html`
      <svg class="w-4 h-4 ml-text-muted flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        ${svg`
          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
        `}
      </svg>
    `;
  }

  private renderChevronIcon(): TemplateResult {
    return html`
      <svg class="w-4 h-4 ml-text-muted flex-shrink-0 transition-transform ${this.isOpen ? 'rotate-180' : ''}" viewBox="0 0 20 20" fill="currentColor">
        ${svg`
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
        `}
      </svg>
    `;
  }

  private renderDropdown(): TemplateResult {
    return html`
      <div
        class="ml-calendar-container absolute z-50 mt-1 rounded-lg border p-4 min-w-[320px]"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex gap-4">
          ${this.parsedPresets.length > 0 ? this.renderPresets() : html``}
          <div class="flex-1">
            ${this.renderCalendar()}
          </div>
        </div>
      </div>
    `;
  }

  private renderPresets(): TemplateResult {
    return html`
      <div class="ml-preset-sidebar w-40 border-r pr-4">
        <div class="ml-text-muted text-xs font-medium uppercase tracking-wide mb-2">
          ${this.msg.presets}
        </div>
        <div class="flex flex-col gap-1">
          ${this.parsedPresets.map(preset => html`
            <button
              type="button"
              class=${this.getPresetClasses(this.isPresetActive(preset))}
              @click=${() => this.handlePresetSelect(preset)}
            >
              ${unsafeHTML(preset.label)}
            </button>
          `)}
        </div>
      </div>
    `;
  }

  private renderCalendar(): TemplateResult {
    const days = this.getCalendarDays();
    const dayNames = this.getOrderedDayNames();

    return html`
      <div>
        ${this.renderCalendarHeader()}
        <div class="grid grid-cols-7 gap-1 mb-2">
          ${dayNames.map(name => html`
            <div class="w-8 h-6 flex items-center justify-center text-xs font-medium ml-text-muted">
              ${name}
            </div>
          `)}
        </div>
        <div class="grid grid-cols-7 gap-1">
          ${days.map(day => html`
            <button
              type="button"
              class=${this.getDayClasses(day)}
              ?disabled=${this.isDateDisabled(day.date)}
              role="gridcell"
              aria-selected=${this.isRangeStart(day.date) || this.isRangeEnd(day.date)}
              aria-disabled=${this.isDateDisabled(day.date)}
              @click=${() => this.handleDateSelect(day.date)}
              @mouseenter=${() => this.handleDateHover(day.date)}
              @mouseleave=${this.handleDateHoverEnd}
            >
              ${day.day}
            </button>
          `)}
        </div>
        ${this.renderSelectionHint()}
      </div>
    `;
  }

  private renderCalendarHeader(): TemplateResult {
    return html`
      <div class="flex items-center justify-between mb-4">
        <button
          type="button"
          class="ml-calendar-nav p-1 rounded"
          @click=${this.handlePrevMonth}
        >
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            ${svg`<path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>`}
          </svg>
        </button>
        <span class="ml-text text-sm font-medium">
          ${this.msg.monthNames[this.viewingMonth]} ${this.viewingYear}
        </span>
        <button
          type="button"
          class="ml-calendar-nav p-1 rounded"
          @click=${this.handleNextMonth}
        >
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            ${svg`<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>`}
          </svg>
        </button>
      </div>
    `;
  }

  private renderSelectionHint(): TemplateResult {
    const hintText = this.selectingEnd ? this.msg.selectEndDate : this.msg.selectStartDate;
    return html`
      <div class="ml-calendar-hint mt-3 pt-3 border-t">
        <p class="ml-text-muted text-xs text-center">
          ${hintText}
        </p>
      </div>
    `;
  }

  private renderFeedback(): TemplateResult {
    if (this.error) {
      return html`
        <p class="ml-error-text mt-1 text-xs" role="alert">
          ${unsafeHTML(String(this.error))}
        </p>
      `;
    }
    if (this.hasSlot('Helper')) {
      return html`
        <p class="${cn('ml-helper mt-1 text-xs', this.getSlotClass('Helper'))}">
          ${unsafeHTML(this.getSlotContent('Helper'))}
        </p>
      `;
    }
    return html``;
  }
}
