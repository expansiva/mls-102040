/// <mls fileReference="_102040_/l2/molecules/groupentertimeinterval/ml-time-interval.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// TIME INTERVAL MOLECULE
// =============================================================================
// Skill Group: groupEnterTimeInterval
// This molecule does NOT contain business logic.

import { html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  placeholderStart: 'Start',
  placeholderEnd: 'End',
  noValue: '—',
  nextDay: '(+1)',
  am: 'AM',
  pm: 'PM',
  loading: 'Loading...',
  selectHour: 'Select hour',
  selectMinute: 'Select minute',
  selectSecond: 'Select second',
  selectPeriod: 'Select AM/PM',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholderStart: 'Início',
    placeholderEnd: 'Fim',
    noValue: '—',
    nextDay: '(+1)',
    am: 'AM',
    pm: 'PM',
    loading: 'Carregando...',
    selectHour: 'Selecionar hora',
    selectMinute: 'Selecionar minuto',
    selectSecond: 'Selecionar segundo',
    selectPeriod: 'Selecionar AM/PM',
  },
};
/// **collab_i18n_end**

@customElement('groupentertimeinterval--ml-time-interval')
export class MlTimeIntervalMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'LabelStart', 'LabelEnd', 'Helper'];

  // ===========================================================================
  // PROPERTIES — Data
  // ===========================================================================
  @propertyDataSource({ type: String, attribute: 'start-time' })
  startTime: string | null = null;

  @propertyDataSource({ type: String, attribute: 'end-time' })
  endTime: string | null = null;

  @propertyDataSource({ type: String })
  error: string = '';

  @propertyDataSource({ type: String })
  name: string = '';

  // ===========================================================================
  // PROPERTIES — Configuration
  // ===========================================================================
  @propertyDataSource({ type: String })
  locale: string = '';

  @propertyDataSource({ type: Boolean })
  hour12: boolean = false;

  @propertyDataSource({ type: Boolean, attribute: 'show-seconds' })
  showSeconds: boolean = false;

  @propertyDataSource({ type: Number, attribute: 'minute-step' })
  minuteStep: number = 1;

  @propertyDataSource({ type: String, attribute: 'min-time' })
  minTime: string = '';

  @propertyDataSource({ type: String, attribute: 'max-time' })
  maxTime: string = '';

  @propertyDataSource({ type: Number, attribute: 'min-duration-minutes' })
  minDurationMinutes: number = 0;

  @propertyDataSource({ type: Number, attribute: 'max-duration-minutes' })
  maxDurationMinutes: number = 0;

  @propertyDataSource({ type: Boolean, attribute: 'allow-overnight' })
  allowOvernight: boolean = false;

  @propertyDataSource({ type: Boolean, attribute: 'allow-same-time' })
  allowSameTime: boolean = false;

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
  private activeField: 'start' | 'end' | null = null;

  @state()
  private startHour: number = 0;

  @state()
  private startMinute: number = 0;

  @state()
  private startSecond: number = 0;

  @state()
  private startPeriod: 'AM' | 'PM' = 'AM';

  @state()
  private endHour: number = 0;

  @state()
  private endMinute: number = 0;

  @state()
  private endSecond: number = 0;

  @state()
  private endPeriod: 'AM' | 'PM' = 'AM';

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  firstUpdated() {
    this.syncFromStartTime();
    this.syncFromEndTime();
    document.addEventListener('click', this.handleDocumentClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleDocumentClick);
  }

  // ===========================================================================
  // STATE CHANGE HANDLER
  // ===========================================================================
  handleIcaStateChange(key: string, value: any) {
    const startAttr = this.getAttribute('start-time');
    const endAttr = this.getAttribute('end-time');

    if (startAttr === `{{${key}}}`) {
      this.startTime = value;
      this.syncFromStartTime();
    }
    if (endAttr === `{{${key}}}`) {
      this.endTime = value;
      this.syncFromEndTime();
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // SYNC HELPERS
  // ===========================================================================
  private syncFromStartTime() {
    if (this.startTime) {
      const parsed = this.parseTime(this.startTime);
      if (this.hour12) {
        this.startPeriod = parsed.hour >= 12 ? 'PM' : 'AM';
        this.startHour = parsed.hour % 12 || 12;
      } else {
        this.startHour = parsed.hour;
      }
      this.startMinute = parsed.minute;
      this.startSecond = parsed.second;
    }
  }

  private syncFromEndTime() {
    if (this.endTime) {
      const parsed = this.parseTime(this.endTime);
      if (this.hour12) {
        this.endPeriod = parsed.hour >= 12 ? 'PM' : 'AM';
        this.endHour = parsed.hour % 12 || 12;
      } else {
        this.endHour = parsed.hour;
      }
      this.endMinute = parsed.minute;
      this.endSecond = parsed.second;
    }
  }

  // ===========================================================================
  // TIME UTILITIES
  // ===========================================================================
  private parseTime(time: string): { hour: number; minute: number; second: number } {
    const parts = time.split(':').map(Number);
    return {
      hour: parts[0] || 0,
      minute: parts[1] || 0,
      second: parts[2] || 0,
    };
  }

  private toMinutes(time: string): number {
    const parsed = this.parseTime(time);
    return parsed.hour * 60 + parsed.minute;
  }

  private formatTime24(hour: number, minute: number, second: number): string {
    const h = String(hour).padStart(2, '0');
    const m = String(minute).padStart(2, '0');
    if (this.showSeconds) {
      const s = String(second).padStart(2, '0');
      return `${h}:${m}:${s}`;
    }
    return `${h}:${m}`;
  }

  private formatTimeDisplay(time: string | null): string {
    if (!time) return this.msg.noValue;
    const parsed = this.parseTime(time);
    if (this.hour12) {
      const period = parsed.hour >= 12 ? this.msg.pm : this.msg.am;
      const displayHour = parsed.hour % 12 || 12;
      const h = String(displayHour).padStart(2, '0');
      const m = String(parsed.minute).padStart(2, '0');
      if (this.showSeconds) {
        const s = String(parsed.second).padStart(2, '0');
        return `${h}:${m}:${s} ${period}`;
      }
      return `${h}:${m} ${period}`;
    }
    return time;
  }

  private isOvernight(): boolean {
    if (!this.startTime || !this.endTime || !this.allowOvernight) return false;
    return this.toMinutes(this.endTime) < this.toMinutes(this.startTime);
  }

  private calcDuration(): number {
    if (!this.startTime || !this.endTime) return 0;
    const startMins = this.toMinutes(this.startTime);
    const endMins = this.toMinutes(this.endTime);
    if (this.isOvernight()) {
      return (24 * 60) - startMins + endMins;
    }
    return endMins - startMins;
  }

  private convert12To24(hour: number, period: 'AM' | 'PM'): number {
    if (period === 'AM') {
      return hour === 12 ? 0 : hour;
    }
    return hour === 12 ? 12 : hour + 12;
  }

  private isTimeDisabled(hour: number, minute: number, field: 'start' | 'end'): boolean {
    const time24 = this.formatTime24(hour, minute, 0);
    const timeMins = hour * 60 + minute;

    if (this.minTime) {
      const minMins = this.toMinutes(this.minTime);
      if (timeMins < minMins) return true;
    }
    if (this.maxTime) {
      const maxMins = this.toMinutes(this.maxTime);
      if (timeMins > maxMins) return true;
    }

    if (field === 'end' && this.startTime) {
      const startMins = this.toMinutes(this.startTime);
      if (!this.allowSameTime && timeMins === startMins) return true;
      if (!this.allowOvernight && timeMins < startMins) return true;

      let duration: number;
      if (this.allowOvernight && timeMins < startMins) {
        duration = (24 * 60) - startMins + timeMins;
      } else {
        duration = timeMins - startMins;
      }

      if (this.minDurationMinutes > 0 && duration < this.minDurationMinutes) return true;
      if (this.maxDurationMinutes > 0 && duration > this.maxDurationMinutes) return true;
    }

    return false;
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleDocumentClick = (e: MouseEvent) => {
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.activeField = null;
    }
  };

  private handleFieldClick(field: 'start' | 'end') {
    if (this.disabled || this.readonly || this.loading) return;
    this.activeField = this.activeField === field ? null : field;
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
  }

  private handleHourSelect(hour: number, field: 'start' | 'end') {
    if (field === 'start') {
      this.startHour = hour;
      this.updateStartTime();
    } else {
      this.endHour = hour;
      this.updateEndTime();
    }
  }

  private handleMinuteSelect(minute: number, field: 'start' | 'end') {
    if (field === 'start') {
      this.startMinute = minute;
      this.updateStartTime();
    } else {
      this.endMinute = minute;
      this.updateEndTime();
    }
  }

  private handleSecondSelect(second: number, field: 'start' | 'end') {
    if (field === 'start') {
      this.startSecond = second;
      this.updateStartTime();
    } else {
      this.endSecond = second;
      this.updateEndTime();
    }
  }

  private handlePeriodSelect(period: 'AM' | 'PM', field: 'start' | 'end') {
    if (field === 'start') {
      this.startPeriod = period;
      this.updateStartTime();
    } else {
      this.endPeriod = period;
      this.updateEndTime();
    }
  }

  private updateStartTime() {
    let hour24 = this.startHour;
    if (this.hour12) {
      hour24 = this.convert12To24(this.startHour, this.startPeriod);
    }
    this.startTime = this.formatTime24(hour24, this.startMinute, this.startSecond);
    this.dispatchEvent(new CustomEvent('startChange', {
      bubbles: true,
      composed: true,
      detail: { value: this.startTime },
    }));
    this.emitChangeIfComplete();
  }

  private updateEndTime() {
    let hour24 = this.endHour;
    if (this.hour12) {
      hour24 = this.convert12To24(this.endHour, this.endPeriod);
    }
    this.endTime = this.formatTime24(hour24, this.endMinute, this.endSecond);
    this.dispatchEvent(new CustomEvent('endChange', {
      bubbles: true,
      composed: true,
      detail: { value: this.endTime },
    }));
    this.emitChangeIfComplete();
  }

  private emitChangeIfComplete() {
    if (this.startTime && this.endTime) {
      this.dispatchEvent(new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { startTime: this.startTime, endTime: this.endTime },
      }));
    }
  }

  private handleBlur() {
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private getContainerClasses(): string {
    return [
      'w-full',
      this.disabled ? 'opacity-50 cursor-not-allowed' : '',
    ].filter(Boolean).join(' ');
  }

  private getFieldClasses(field: 'start' | 'end'): string {
    const isActive = this.activeField === field;
    const hasError = !!this.error;
    const hasValue = field === 'start' ? !!this.startTime : !!this.endTime;
    const bothFilled = !!this.startTime && !!this.endTime;

    return [
      'flex-1 min-w-0 px-3 py-2 rounded-lg border text-sm transition-all',
      'bg-white dark:bg-slate-900',
      'text-slate-900 dark:text-slate-100',
      hasError
        ? 'border-red-500 dark:border-red-400'
        : isActive
          ? 'border-sky-500 dark:border-sky-400 ring-2 ring-sky-500 dark:ring-sky-400'
          : bothFilled
            ? 'border-green-500 dark:border-green-400'
            : 'border-slate-200 dark:border-slate-700',
      !this.disabled && !this.readonly ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800' : '',
      this.readonly ? 'cursor-default' : '',
      this.disabled ? 'cursor-not-allowed' : '',
    ].filter(Boolean).join(' ');
  }

  private getPickerClasses(): string {
    return [
      'absolute z-50 mt-1 p-3 rounded-lg shadow-lg border',
      'bg-white dark:bg-slate-800',
      'border-slate-200 dark:border-slate-700',
    ].join(' ');
  }

  private getColumnClasses(): string {
    return [
      'flex flex-col gap-1 max-h-48 overflow-y-auto px-1',
      'scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600',
    ].join(' ');
  }

  private getOptionClasses(isSelected: boolean, isDisabled: boolean): string {
    return [
      'px-3 py-1.5 rounded text-sm text-center transition-colors',
      isDisabled
        ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
        : isSelected
          ? 'bg-sky-500 dark:bg-sky-600 text-white font-medium'
          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer',
    ].filter(Boolean).join(' ');
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
      <div class="flex items-center justify-center py-4 text-slate-500 dark:text-slate-400">
        <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>${this.msg.loading}</span>
      </div>
    `;
  }

  private renderViewMode(): TemplateResult {
    const label = this.getSlotContent('Label');
    let displayText: string;

    if (!this.startTime && !this.endTime) {
      displayText = this.msg.noValue;
    } else if (this.startTime && !this.endTime) {
      displayText = `${this.formatTimeDisplay(this.startTime)} – ${this.msg.noValue}`;
    } else {
      const overnight = this.isOvernight();
      displayText = `${this.formatTimeDisplay(this.startTime)} – ${this.formatTimeDisplay(this.endTime)}${overnight ? ' ' + this.msg.nextDay : ''}`;
    }

    return html`
      <div class="w-full">
        ${label ? html`<div class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">${unsafeHTML(label)}</div>` : html``}
        <div class="text-slate-900 dark:text-slate-100">${displayText}</div>
      </div>
    `;
  }

  private renderEditMode(): TemplateResult {
    const label = this.getSlotContent('Label');
    const labelStart = this.getSlotContent('LabelStart');
    const labelEnd = this.getSlotContent('LabelEnd');
    const helper = this.getSlotContent('Helper');
    const overnight = this.isOvernight();

    return html`
      <div class=${this.getContainerClasses()} @blur=${this.handleBlur}>
        ${label ? html`<div class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">${unsafeHTML(label)}</div>` : html``}
        
        <div class="flex items-center gap-3">
          <!-- Start Time Field -->
          <div class="flex-1 min-w-0 relative">
            ${labelStart ? html`<div class="text-xs text-slate-500 dark:text-slate-400 mb-1">${unsafeHTML(labelStart)}</div>` : html``}
            <div
              class=${this.getFieldClasses('start')}
              @click=${() => this.handleFieldClick('start')}
              role="button"
              tabindex=${this.disabled ? -1 : 0}
              aria-label=${this.msg.placeholderStart}
              aria-invalid=${this.error ? 'true' : 'false'}
              aria-required=${this.required ? 'true' : 'false'}
            >
              ${this.startTime
                ? this.formatTimeDisplay(this.startTime)
                : html`<span class="text-slate-400 dark:text-slate-500">${this.msg.placeholderStart}</span>`
              }
            </div>
            ${this.activeField === 'start' ? this.renderPicker('start') : html``}
          </div>

          <!-- Delimiter -->
          <div class="text-slate-400 dark:text-slate-500 text-lg font-light">–</div>

          <!-- End Time Field -->
          <div class="flex-1 min-w-0 relative">
            ${labelEnd ? html`<div class="text-xs text-slate-500 dark:text-slate-400 mb-1">${unsafeHTML(labelEnd)}</div>` : html``}
            <div
              class=${this.getFieldClasses('end')}
              @click=${() => this.handleFieldClick('end')}
              role="button"
              tabindex=${this.disabled ? -1 : 0}
              aria-label=${this.msg.placeholderEnd}
              aria-invalid=${this.error ? 'true' : 'false'}
              aria-required=${this.required ? 'true' : 'false'}
            >
              ${this.endTime
                ? html`${this.formatTimeDisplay(this.endTime)}${overnight ? html`<span class="ml-1 text-xs text-amber-600 dark:text-amber-400">${this.msg.nextDay}</span>` : html``}`
                : html`<span class="text-slate-400 dark:text-slate-500">${this.msg.placeholderEnd}</span>`
              }
            </div>
            ${this.activeField === 'end' ? this.renderPicker('end') : html``}
          </div>
        </div>

        ${this.renderFeedback(helper)}
      </div>
    `;
  }

  private renderPicker(field: 'start' | 'end'): TemplateResult {
    const currentHour = field === 'start' ? this.startHour : this.endHour;
    const currentMinute = field === 'start' ? this.startMinute : this.endMinute;
    const currentSecond = field === 'start' ? this.startSecond : this.endSecond;
    const currentPeriod = field === 'start' ? this.startPeriod : this.endPeriod;

    const hours = this.hour12
      ? Array.from({ length: 12 }, (_, i) => i === 0 ? 12 : i)
      : Array.from({ length: 24 }, (_, i) => i);

    const minutes: number[] = [];
    for (let i = 0; i < 60; i += this.minuteStep) {
      minutes.push(i);
    }

    const seconds = Array.from({ length: 60 }, (_, i) => i);

    return html`
      <div class=${this.getPickerClasses()} role="dialog" aria-modal="true">
        <div class="flex gap-2">
          <!-- Hours -->
          <div class=${this.getColumnClasses()} aria-label=${this.msg.selectHour}>
            ${hours.map(h => {
              const hour24 = this.hour12 ? this.convert12To24(h, currentPeriod) : h;
              const disabled = this.isTimeDisabled(hour24, currentMinute, field);
              const selected = h === currentHour;
              return html`
                <div
                  class=${this.getOptionClasses(selected, disabled)}
                  @click=${() => !disabled && this.handleHourSelect(h, field)}
                  role="option"
                  aria-selected=${selected ? 'true' : 'false'}
                  aria-disabled=${disabled ? 'true' : 'false'}
                >
                  ${String(h).padStart(2, '0')}
                </div>
              `;
            })}
          </div>

          <!-- Minutes -->
          <div class=${this.getColumnClasses()} aria-label=${this.msg.selectMinute}>
            ${minutes.map(m => {
              const hour24 = this.hour12 ? this.convert12To24(currentHour, currentPeriod) : currentHour;
              const disabled = this.isTimeDisabled(hour24, m, field);
              const selected = m === currentMinute;
              return html`
                <div
                  class=${this.getOptionClasses(selected, disabled)}
                  @click=${() => !disabled && this.handleMinuteSelect(m, field)}
                  role="option"
                  aria-selected=${selected ? 'true' : 'false'}
                  aria-disabled=${disabled ? 'true' : 'false'}
                >
                  ${String(m).padStart(2, '0')}
                </div>
              `;
            })}
          </div>

          <!-- Seconds (if enabled) -->
          ${this.showSeconds ? html`
            <div class=${this.getColumnClasses()} aria-label=${this.msg.selectSecond}>
              ${seconds.map(s => {
                const selected = s === currentSecond;
                return html`
                  <div
                    class=${this.getOptionClasses(selected, false)}
                    @click=${() => this.handleSecondSelect(s, field)}
                    role="option"
                    aria-selected=${selected ? 'true' : 'false'}
                  >
                    ${String(s).padStart(2, '0')}
                  </div>
                `;
              })}
            </div>
          ` : html``}

          <!-- AM/PM (if 12-hour) -->
          ${this.hour12 ? html`
            <div class="flex flex-col gap-1 px-1" aria-label=${this.msg.selectPeriod}>
              ${(['AM', 'PM'] as const).map(p => {
                const selected = p === currentPeriod;
                return html`
                  <div
                    class=${this.getOptionClasses(selected, false)}
                    @click=${() => this.handlePeriodSelect(p, field)}
                    role="option"
                    aria-selected=${selected ? 'true' : 'false'}
                  >
                    ${p === 'AM' ? this.msg.am : this.msg.pm}
                  </div>
                `;
              })}
            </div>
          ` : html``}
        </div>
      </div>
    `;
  }

  private renderFeedback(helper: string): TemplateResult {
    if (this.error) {
      return html`<p class="mt-1 text-xs text-red-600 dark:text-red-400">${unsafeHTML(this.error)}</p>`;
    }
    if (helper) {
      return html`<p class="mt-1 text-xs text-slate-500 dark:text-slate-400">${unsafeHTML(helper)}</p>`;
    }
    return html``;
  }
}
