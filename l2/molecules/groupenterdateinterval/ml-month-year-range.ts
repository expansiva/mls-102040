/// <mls fileReference="_102040_/l2/molecules/groupenterdateinterval/ml-month-year-range.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// MONTH YEAR RANGE MOLECULE
// =============================================================================
// Skill Group: groupEnterDateInterval
// This molecule does NOT contain business logic.

import { html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  loading: 'Loading...',
  noSelection: '—',
  to: '–',
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  monthsFull: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    loading: 'Carregando...',
    noSelection: '—',
    to: '–',
    months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    monthsFull: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  },
};
/// **collab_i18n_end**

interface MonthData {
  year: number;
  month: number;
  label: string;
  disabled: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isHovered: boolean;
}

@customElement('groupenterdateinterval--ml-month-year-range')
export class MlMonthYearRangeMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'LabelStart', 'LabelEnd', 'Helper'];

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
  private startYear: number = new Date().getFullYear();

  @state()
  private endYear: number = new Date().getFullYear();

  @state()
  private selectingEnd: boolean = false;

  @state()
  private hoverMonth: { year: number; month: number } | null = null;

  @state()
  private isFocused: boolean = false;

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  firstUpdated() {
    this.initializeYears();
  }

  // ===========================================================================
  // STATE CHANGE HANDLER
  // ===========================================================================
  handleIcaStateChange(key: string, value: unknown) {
    const startDateAttr = this.getAttribute('start-date');
    const endDateAttr = this.getAttribute('end-date');

    if (startDateAttr === `{{${key}}}` && typeof value === 'string') {
      this.initializeYearsFromDate(value, 'start');
    }
    if (endDateAttr === `{{${key}}}` && typeof value === 'string') {
      this.initializeYearsFromDate(value, 'end');
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================
  private initializeYears() {
    const now = new Date();
    if (this.startDate) {
      const parsed = this.parseDate(this.startDate);
      if (parsed) this.startYear = parsed.year;
    } else {
      this.startYear = now.getFullYear();
    }

    if (this.endDate) {
      const parsed = this.parseDate(this.endDate);
      if (parsed) this.endYear = parsed.year;
    } else {
      this.endYear = this.startYear;
    }
  }

  private initializeYearsFromDate(dateStr: string, type: 'start' | 'end') {
    const parsed = this.parseDate(dateStr);
    if (parsed) {
      if (type === 'start') {
        this.startYear = parsed.year;
      } else {
        this.endYear = parsed.year;
      }
    }
  }

  // ===========================================================================
  // DATE UTILITIES
  // ===========================================================================
  private parseDate(dateStr: string): { year: number; month: number; day: number } | null {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
    return { year, month, day };
  }

  private formatDateISO(year: number, month: number): string {
    const m = String(month + 1).padStart(2, '0');
    return `${year}-${m}-01`;
  }

  private formatDisplayDate(dateStr: string | null): string {
    if (!dateStr) return this.msg.noSelection;
    const parsed = this.parseDate(dateStr);
    if (!parsed) return this.msg.noSelection;
    const monthName = this.msg.monthsFull[parsed.month];
    return `${monthName} ${parsed.year}`;
  }

  private getMonthDiff(startYear: number, startMonth: number, endYear: number, endMonth: number): number {
    return (endYear - startYear) * 12 + (endMonth - startMonth);
  }

  private getDaysInRange(startYear: number, startMonth: number, endYear: number, endMonth: number): number {
    const startDate = new Date(startYear, startMonth, 1);
    const endDate = new Date(endYear, endMonth + 1, 0);
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  // ===========================================================================
  // VALIDATION
  // ===========================================================================
  private isMonthDisabled(year: number, month: number): boolean {
    const dateStr = this.formatDateISO(year, month);

    if (this.minDate) {
      const minParsed = this.parseDate(this.minDate);
      if (minParsed) {
        const minMonthStart = this.formatDateISO(minParsed.year, minParsed.month);
        if (dateStr < minMonthStart) return true;
      }
    }

    if (this.maxDate) {
      const maxParsed = this.parseDate(this.maxDate);
      if (maxParsed) {
        const maxMonthStart = this.formatDateISO(maxParsed.year, maxParsed.month);
        if (dateStr > maxMonthStart) return true;
      }
    }

    return false;
  }

  private isEndMonthDisabled(year: number, month: number): boolean {
    if (this.isMonthDisabled(year, month)) return true;

    if (!this.selectingEnd || !this.startDate) return false;

    const startParsed = this.parseDate(this.startDate);
    if (!startParsed) return false;

    if (!this.allowSameDay && year === startParsed.year && month === startParsed.month) {
      return true;
    }

    const daysInRange = this.getDaysInRange(startParsed.year, startParsed.month, year, month);

    if (this.minRangeDays > 0) {
      const minMonths = Math.ceil(this.minRangeDays / 30);
      const monthDiff = this.getMonthDiff(startParsed.year, startParsed.month, year, month);
      if (monthDiff < minMonths - 1) return true;
    }

    if (this.maxRangeDays > 0 && daysInRange > this.maxRangeDays) {
      return true;
    }

    return false;
  }

  // ===========================================================================
  // MONTH DATA GENERATION
  // ===========================================================================
  private generateMonthData(year: number, isEndGrid: boolean): MonthData[] {
    const months: MonthData[] = [];
    const startParsed = this.startDate ? this.parseDate(this.startDate) : null;
    const endParsed = this.endDate ? this.parseDate(this.endDate) : null;

    for (let m = 0; m < 12; m++) {
      const disabled = isEndGrid
        ? this.isEndMonthDisabled(year, m)
        : this.isMonthDisabled(year, m);

      const isStart = startParsed !== null && startParsed.year === year && startParsed.month === m;
      const isEnd = endParsed !== null && endParsed.year === year && endParsed.month === m;

      let isInRange = false;
      let isHovered = false;

      if (startParsed && endParsed) {
        const currentDate = this.formatDateISO(year, m);
        const startDateStr = this.formatDateISO(startParsed.year, startParsed.month);
        const endDateStr = this.formatDateISO(endParsed.year, endParsed.month);
        isInRange = currentDate > startDateStr && currentDate < endDateStr;
      } else if (this.selectingEnd && startParsed && this.hoverMonth && isEndGrid) {
        const currentDate = this.formatDateISO(year, m);
        const startDateStr = this.formatDateISO(startParsed.year, startParsed.month);
        const hoverDateStr = this.formatDateISO(this.hoverMonth.year, this.hoverMonth.month);

        if (hoverDateStr >= startDateStr) {
          isInRange = currentDate > startDateStr && currentDate < hoverDateStr;
          isHovered = year === this.hoverMonth.year && m === this.hoverMonth.month;
        }
      }

      months.push({
        year,
        month: m,
        label: this.msg.months[m],
        disabled,
        isStart,
        isEnd,
        isInRange,
        isHovered,
      });
    }

    return months;
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleStartYearPrev() {
    if (this.disabled || this.readonly || this.loading) return;
    this.startYear--;
  }

  private handleStartYearNext() {
    if (this.disabled || this.readonly || this.loading) return;
    this.startYear++;
  }

  private handleEndYearPrev() {
    if (this.disabled || this.readonly || this.loading) return;
    this.endYear--;
  }

  private handleEndYearNext() {
    if (this.disabled || this.readonly || this.loading) return;
    this.endYear++;
  }

  private handleStartMonthSelect(monthData: MonthData) {
    if (this.disabled || this.readonly || this.loading || monthData.disabled) return;

    this.startDate = this.formatDateISO(monthData.year, monthData.month);
    this.endDate = null;
    this.selectingEnd = true;
    this.hoverMonth = null;

    this.dispatchEvent(new CustomEvent('startChange', {
      bubbles: true,
      composed: true,
      detail: { value: this.startDate },
    }));
  }

  private handleEndMonthSelect(monthData: MonthData) {
    if (this.disabled || this.readonly || this.loading || monthData.disabled) return;
    if (!this.startDate) return;

    const startParsed = this.parseDate(this.startDate);
    if (!startParsed) return;

    const selectedDateStr = this.formatDateISO(monthData.year, monthData.month);
    const startDateStr = this.formatDateISO(startParsed.year, startParsed.month);

    if (selectedDateStr < startDateStr) {
      this.endDate = this.startDate;
      this.startDate = selectedDateStr;
    } else {
      this.endDate = selectedDateStr;
    }

    this.selectingEnd = false;
    this.hoverMonth = null;

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
  }

  private handleEndMonthHover(monthData: MonthData) {
    if (this.disabled || this.readonly || this.loading || monthData.disabled) return;
    if (!this.selectingEnd) return;

    this.hoverMonth = { year: monthData.year, month: monthData.month };
  }

  private handleEndMonthLeave() {
    this.hoverMonth = null;
  }

  private handleFocus() {
    if (this.disabled || this.loading) return;
    this.isFocused = true;
    this.dispatchEvent(new CustomEvent('focus', {
      bubbles: true,
      composed: true,
    }));
  }

  private handleBlur() {
    this.isFocused = false;
    this.dispatchEvent(new CustomEvent('blur', {
      bubbles: true,
      composed: true,
    }));
  }

  // ===========================================================================
  // CSS CLASSES
  // ===========================================================================
  private getContainerClasses(): string {
    return [
      'w-full',
      this.disabled ? 'opacity-50 cursor-not-allowed' : '',
    ].filter(Boolean).join(' ');
  }

  private getGridContainerClasses(): string {
    return [
      'flex flex-col md:flex-row gap-6',
    ].join(' ');
  }

  private getGridPanelClasses(): string {
    return [
      'flex-1 rounded-lg border p-4',
      'bg-white dark:bg-slate-800',
      'border-slate-200 dark:border-slate-700',
      this.isFocused && !this.error ? 'ring-2 ring-sky-500 dark:ring-sky-400' : '',
      this.error ? 'border-red-500 dark:border-red-400' : '',
    ].filter(Boolean).join(' ');
  }

  private getYearNavClasses(): string {
    return [
      'flex items-center justify-between mb-4',
    ].join(' ');
  }

  private getNavButtonClasses(): string {
    return [
      'p-2 rounded-md transition',
      'text-slate-600 dark:text-slate-400',
      'hover:bg-slate-100 dark:hover:bg-slate-700',
      'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
      this.disabled || this.readonly ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
    ].filter(Boolean).join(' ');
  }

  private getYearLabelClasses(): string {
    return [
      'text-lg font-semibold',
      'text-slate-900 dark:text-slate-100',
    ].join(' ');
  }

  private getMonthGridClasses(): string {
    return [
      'grid grid-cols-3 gap-2',
    ].join(' ');
  }

  private getMonthButtonClasses(monthData: MonthData): string {
    const base = 'px-3 py-2 rounded-md text-sm font-medium transition';

    if (monthData.disabled) {
      return [
        base,
        'opacity-40 cursor-not-allowed',
        'text-slate-400 dark:text-slate-600',
        'bg-slate-50 dark:bg-slate-900',
      ].join(' ');
    }

    if (monthData.isStart || monthData.isEnd) {
      return [
        base,
        'bg-sky-500 dark:bg-sky-600',
        'text-white',
        'cursor-pointer',
      ].join(' ');
    }

    if (monthData.isHovered) {
      return [
        base,
        'bg-sky-200 dark:bg-sky-800',
        'text-sky-900 dark:text-sky-100',
        'cursor-pointer',
      ].join(' ');
    }

    if (monthData.isInRange) {
      return [
        base,
        'bg-sky-100 dark:bg-sky-900/50',
        'text-sky-800 dark:text-sky-200',
        'cursor-pointer',
      ].join(' ');
    }

    return [
      base,
      'bg-white dark:bg-slate-800',
      'text-slate-900 dark:text-slate-100',
      'border border-slate-200 dark:border-slate-700',
      'hover:bg-slate-50 dark:hover:bg-slate-700',
      'cursor-pointer',
      'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
    ].join(' ');
  }

  private getLabelClasses(): string {
    return [
      'block text-sm font-medium mb-2',
      'text-slate-700 dark:text-slate-300',
    ].join(' ');
  }

  private getGridLabelClasses(): string {
    return [
      'text-xs font-medium mb-2',
      'text-slate-500 dark:text-slate-400',
    ].join(' ');
  }

  private getHelperClasses(): string {
    return [
      'mt-2 text-xs',
      'text-slate-500 dark:text-slate-400',
    ].join(' ');
  }

  private getErrorClasses(): string {
    return [
      'mt-2 text-xs',
      'text-red-600 dark:text-red-400',
    ].join(' ');
  }

  private getViewModeClasses(): string {
    return [
      'text-sm',
      'text-slate-900 dark:text-slate-100',
    ].join(' ');
  }

  private getLoadingClasses(): string {
    return [
      'flex items-center justify-center p-8',
      'text-slate-500 dark:text-slate-400',
    ].join(' ');
  }

  // ===========================================================================
  // RENDER METHODS
  // ===========================================================================
  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    return html`
      <label class=${this.getLabelClasses()}>
        ${unsafeHTML(this.getSlotContent('Label'))}
        ${this.required ? html`<span class="text-red-500 dark:text-red-400 ml-1">*</span>` : html``}
      </label>
    `;
  }

  private renderGridLabel(slotName: 'LabelStart' | 'LabelEnd'): TemplateResult {
    if (!this.hasSlot(slotName)) return html``;
    return html`
      <div class=${this.getGridLabelClasses()}>
        ${unsafeHTML(this.getSlotContent(slotName))}
      </div>
    `;
  }

  private renderYearNav(year: number, onPrev: () => void, onNext: () => void): TemplateResult {
    return html`
      <div class=${this.getYearNavClasses()}>
        <button
          type="button"
          class=${this.getNavButtonClasses()}
          @click=${onPrev}
          ?disabled=${this.disabled || this.readonly}
          aria-label="Previous year"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <span class=${this.getYearLabelClasses()}>${year}</span>
        <button
          type="button"
          class=${this.getNavButtonClasses()}
          @click=${onNext}
          ?disabled=${this.disabled || this.readonly}
          aria-label="Next year"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    `;
  }

  private renderMonthGrid(months: MonthData[], isEndGrid: boolean): TemplateResult {
    return html`
      <div class=${this.getMonthGridClasses()} role="grid">
        ${months.map(monthData => this.renderMonthButton(monthData, isEndGrid))}
      </div>
    `;
  }

  private renderMonthButton(monthData: MonthData, isEndGrid: boolean): TemplateResult {
    const handleClick = isEndGrid
      ? () => this.handleEndMonthSelect(monthData)
      : () => this.handleStartMonthSelect(monthData);

    const handleMouseEnter = isEndGrid
      ? () => this.handleEndMonthHover(monthData)
      : undefined;

    const handleMouseLeave = isEndGrid
      ? () => this.handleEndMonthLeave()
      : undefined;

    return html`
      <button
        type="button"
        class=${this.getMonthButtonClasses(monthData)}
        @click=${handleClick}
        @mouseenter=${handleMouseEnter}
        @mouseleave=${handleMouseLeave}
        ?disabled=${monthData.disabled || this.disabled || this.readonly}
        role="gridcell"
        aria-selected=${monthData.isStart || monthData.isEnd}
        aria-disabled=${monthData.disabled}
      >
        ${monthData.label}
      </button>
    `;
  }

  private renderStartGrid(): TemplateResult {
    const months = this.generateMonthData(this.startYear, false);
    return html`
      <div class=${this.getGridPanelClasses()}>
        ${this.renderGridLabel('LabelStart')}
        ${this.renderYearNav(
          this.startYear,
          () => this.handleStartYearPrev(),
          () => this.handleStartYearNext()
        )}
        ${this.renderMonthGrid(months, false)}
      </div>
    `;
  }

  private renderEndGrid(): TemplateResult {
    const months = this.generateMonthData(this.endYear, true);
    return html`
      <div class=${this.getGridPanelClasses()}>
        ${this.renderGridLabel('LabelEnd')}
        ${this.renderYearNav(
          this.endYear,
          () => this.handleEndYearPrev(),
          () => this.handleEndYearNext()
        )}
        ${this.renderMonthGrid(months, true)}
      </div>
    `;
  }

  private renderFeedback(): TemplateResult {
    if (this.error) {
      return html`
        <p class=${this.getErrorClasses()} role="alert">
          ${unsafeHTML(this.error)}
        </p>
      `;
    }

    if (this.hasSlot('Helper')) {
      return html`
        <p class=${this.getHelperClasses()}>
          ${unsafeHTML(this.getSlotContent('Helper'))}
        </p>
      `;
    }

    return html``;
  }

  private renderViewMode(): TemplateResult {
    const startDisplay = this.formatDisplayDate(this.startDate);
    const endDisplay = this.formatDisplayDate(this.endDate);

    let displayText: string;
    if (!this.startDate && !this.endDate) {
      displayText = this.msg.noSelection;
    } else if (this.startDate && !this.endDate) {
      displayText = `${startDisplay} ${this.msg.to} ${this.msg.noSelection}`;
    } else {
      displayText = `${startDisplay} ${this.msg.to} ${endDisplay}`;
    }

    return html`
      <div class=${this.getContainerClasses()}>
        ${this.renderLabel()}
        <div class=${this.getViewModeClasses()}>
          ${displayText}
        </div>
      </div>
    `;
  }

  private renderLoading(): TemplateResult {
    return html`
      <div class=${this.getContainerClasses()}>
        ${this.renderLabel()}
        <div class=${this.getLoadingClasses()}>
          <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          ${this.msg.loading}
        </div>
      </div>
    `;
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

    return html`
      <div
        class=${this.getContainerClasses()}
        @focusin=${this.handleFocus}
        @focusout=${this.handleBlur}
        aria-invalid=${this.error ? 'true' : 'false'}
        aria-required=${this.required ? 'true' : 'false'}
      >
        ${this.renderLabel()}
        <div class=${this.getGridContainerClasses()}>
          ${this.renderStartGrid()}
          ${this.renderEndGrid()}
        </div>
        ${this.renderFeedback()}
      </div>
    `;
  }
}
