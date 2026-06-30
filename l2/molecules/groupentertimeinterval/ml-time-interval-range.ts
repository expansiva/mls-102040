/// <mls fileReference="_102040_/l2/molecules/groupentertimeinterval/ml-time-interval-range.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// TIME INTERVAL RANGE MOLECULE
// =============================================================================
// Skill Group: groupEnterTimeInterval
// This molecule does NOT contain business logic.
import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  label: 'Time Interval',
  labelStart: 'Início',
  labelEnd: 'Fim',
  duration: 'Duração',
  minutes: 'min',
  invalidRange: 'O horário final deve ser posterior ao inicial.',
  required: 'Obrigatório',
  emptyView: '—',
  nextDay: '(+1)',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    label: 'Intervalo de tempo',
    labelStart: 'Início',
    labelEnd: 'Fim',
    duration: 'Duração',
    minutes: 'min',
    invalidRange: 'O horário final deve ser posterior ao inicial.',
    required: 'Obrigatório',
    emptyView: '—',
    nextDay: '(+1)',
  },
};
/// **collab_i18n_end**

@customElement('groupentertimeinterval--ml-time-interval-range')
export class TimeIntervalRangeMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ==========================================================================
  // SLOT TAGS
  // ==========================================================================
  slotTags = ['Label', 'LabelStart', 'LabelEnd', 'Helper'];

  // ==========================================================================
  // PROPERTIES — From Contract
  // ==========================================================================
  @propertyDataSource({ type: String, attribute: 'start-time' })
  startTime: string | null = null;

  @propertyDataSource({ type: String, attribute: 'end-time' })
  endTime: string | null = null;

  @propertyDataSource({ type: String })
  error: string = '';

  @propertyDataSource({ type: String })
  name: string = '';

  @propertyDataSource({ type: String })
  locale: string = '';

  @propertyDataSource({ type: Boolean, attribute: 'hour12' })
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
  private activeField: 'start' | 'end' | null = null;

  private uid = `tir-${Math.random().toString(36).slice(2)}`;

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================
  private handleStartInput(event: Event) {
    if (this.disabled || this.readonly) return;
    const input = event.target as HTMLInputElement;
    this.startTime = input.value ? input.value : null;
    this.dispatchEvent(new CustomEvent('startChange', {
      bubbles: true,
      composed: true,
      detail: { value: this.startTime },
    }));
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { startTime: this.startTime, endTime: this.endTime },
    }));
  }

  private handleEndInput(event: Event) {
    if (this.disabled || this.readonly) return;
    const input = event.target as HTMLInputElement;
    this.endTime = input.value ? input.value : null;
    this.dispatchEvent(new CustomEvent('endChange', {
      bubbles: true,
      composed: true,
      detail: { value: this.endTime },
    }));
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { startTime: this.startTime, endTime: this.endTime },
    }));
  }

  private handleFocus(field: 'start' | 'end') {
    if (this.disabled) return;
    this.activeField = field;
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
  }

  private handleBlur() {
    this.activeField = null;
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
  }

  // ==========================================================================
  // DERIVED HELPERS
  // ==========================================================================
  private toMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  private calcDurationMinutes(): number | null {
    if (!this.startTime || !this.endTime) return null;
    if (this.allowOvernight && this.isOvernight()) {
      return (24 * 60) - this.toMinutes(this.startTime) + this.toMinutes(this.endTime);
    }
    return this.toMinutes(this.endTime) - this.toMinutes(this.startTime);
  }

  private isOvernight(): boolean {
    if (!this.startTime || !this.endTime) return false;
    return this.allowOvernight && this.toMinutes(this.endTime) < this.toMinutes(this.startTime);
  }

  private hasRangeError(): boolean {
    if (!this.startTime || !this.endTime) return false;
    const duration = this.calcDurationMinutes();
    if (duration === null) return false;
    if (!this.allowOvernight) {
      if (this.allowSameTime) return duration < 0;
      return duration <= 0;
    }
    if (!this.allowSameTime && this.startTime === this.endTime) return true;
    return false;
  }

  private hasDurationLimitError(): boolean {
    const duration = this.calcDurationMinutes();
    if (duration === null) return false;
    if (this.minDurationMinutes > 0 && duration < this.minDurationMinutes) return true;
    if (this.maxDurationMinutes > 0 && duration > this.maxDurationMinutes) return true;
    return false;
  }

  private hasRequiredError(): boolean {
    if (!this.required) return false;
    return !this.startTime || !this.endTime;
  }

  private getValidationError(): string {
    if (this.error) return this.error;
    if (this.hasRequiredError()) return this.msg.required;
    if (this.hasRangeError()) return this.msg.invalidRange;
    if (this.hasDurationLimitError()) return this.msg.invalidRange;
    return '';
  }

  private formatTimeDisplay(value: string | null): string {
    if (!value) return this.msg.emptyView;
    if (!this.locale) return value;
    const [h, m, s = '00'] = value.split(':');
    const date = new Date();
    date.setHours(Number(h), Number(m), Number(s), 0);
    const formatter = new Intl.DateTimeFormat(this.locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: this.showSeconds ? '2-digit' : undefined,
      hour12: this.hour12,
    });
    return formatter.format(date);
  }

  private getInputClasses(isActive: boolean, hasError: boolean): string {
    return cn(
      'w-full rounded-lg px-3 py-2 text-sm border transition',
      'ml-input',
      hasError
        ? 'ml-input-container-error'
        : isActive
        ? 'ml-input-active'
        : '',
      'ml-input-focus',
      this.disabled ? 'ml-disabled' : '',
      this.readonly ? 'ml-interval-container-readonly' : '',
    );
  }

  private getWrapperClasses(): string {
    return cn(
      'w-full rounded-xl border p-4 transition',
      'ml-interval-container',
      this.disabled ? 'ml-disabled' : '',
    );
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    if (!this.isEditing) {
      return this.renderViewMode();
    }

    const validationError = this.getValidationError();
    const hasError = Boolean(validationError);
    const startLabelId = `${this.uid}-label-start`;
    const endLabelId = `${this.uid}-label-end`;
    const helperId = `${this.uid}-helper`;
    const errorId = `${this.uid}-error`;

    const duration = this.calcDurationMinutes();
    const durationText = duration === null ? '' : `${duration} ${this.msg.minutes}`;

    return html`
      <div class="${cn(this.getWrapperClasses(), this.cssClass)}">
        ${this.renderMainLabel()}
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="flex flex-col gap-2">
            <label id="${startLabelId}" class="${cn('text-xs font-medium ml-text-muted', this.getSlotClass('LabelStart'))}">
              ${this.renderLabelStart()}
              ${this.required ? html`<span class="ml-error-text">*</span>` : nothing}
            </label>
            <input
              type="time"
              class="${this.getInputClasses(this.activeField === 'start', hasError)}"
              .value=${this.startTime ?? ''}
              step=${this.showSeconds ? 1 : Math.max(60, this.minuteStep * 60)}
              min=${this.minTime || nothing}
              max=${this.maxTime || nothing}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              aria-labelledby=${startLabelId}
              aria-invalid=${hasError ? 'true' : 'false'}
              aria-required=${this.required ? 'true' : 'false'}
              aria-describedby=${hasError ? errorId : this.hasSlot('Helper') ? helperId : nothing}
              @input=${this.handleStartInput}
              @focus=${() => this.handleFocus('start')}
              @blur=${this.handleBlur}
            />
          </div>
          <div class="flex flex-col gap-2">
            <label id="${endLabelId}" class="${cn('text-xs font-medium ml-text-muted', this.getSlotClass('LabelEnd'))}">
              ${this.renderLabelEnd()}
              ${this.required ? html`<span class="ml-error-text">*</span>` : nothing}
            </label>
            <input
              type="time"
              class="${this.getInputClasses(this.activeField === 'end', hasError)}"
              .value=${this.endTime ?? ''}
              step=${this.showSeconds ? 1 : Math.max(60, this.minuteStep * 60)}
              min=${this.minTime || nothing}
              max=${this.maxTime || nothing}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              aria-labelledby=${endLabelId}
              aria-invalid=${hasError ? 'true' : 'false'}
              aria-required=${this.required ? 'true' : 'false'}
              aria-describedby=${hasError ? errorId : this.hasSlot('Helper') ? helperId : nothing}
              @input=${this.handleEndInput}
              @focus=${() => this.handleFocus('end')}
              @blur=${this.handleBlur}
            />
          </div>
        </div>
        <div class="mt-3 flex items-center justify-between text-xs ml-text-muted">
          <span>${this.msg.duration}</span>
          <span class="ml-text">${durationText || this.msg.emptyView}</span>
        </div>
        ${hasError
          ? html`<p id="${errorId}" class="mt-2 text-xs ml-error-text">${unsafeHTML(validationError)}</p>`
          : this.hasSlot('Helper')
            ? html`<p id="${helperId}" class="${cn('mt-2 text-xs ml-helper', this.getSlotClass('Helper'))}">${unsafeHTML(this.getSlotContent('Helper'))}</p>`
            : nothing}
        ${this.loading
          ? html`<div class="mt-2 text-xs ml-text-muted">Loading...</div>`
          : nothing}
      </div>
    `;
  }

  private renderMainLabel() {
    if (this.hasSlot('Label')) {
      return html`<div class="${cn('mb-3 text-sm font-semibold ml-label', this.getSlotClass('Label'))}">${unsafeHTML(this.getSlotContent('Label'))}</div>`;
    }
    return html`<div class="mb-3 text-sm font-semibold ml-label">${this.msg.label}</div>`;
  }

  private renderLabelStart() {
    if (this.hasSlot('LabelStart')) {
      return unsafeHTML(this.getSlotContent('LabelStart'));
    }
    return this.msg.labelStart;
  }

  private renderLabelEnd() {
    if (this.hasSlot('LabelEnd')) {
      return unsafeHTML(this.getSlotContent('LabelEnd'));
    }
    return this.msg.labelEnd;
  }

  private renderViewMode() {
    const startDisplay = this.formatTimeDisplay(this.startTime);
    const endDisplay = this.formatTimeDisplay(this.endTime);
    const overnight = this.isOvernight();
    const rangeText = `${startDisplay} – ${endDisplay}${overnight ? ` ${this.msg.nextDay}` : ''}`;

    return html`
      <div class="${cn('w-full rounded-xl border p-4 ml-interval-container', this.cssClass)}">
        <div class="text-sm font-semibold ml-text">
          ${rangeText.includes(this.msg.emptyView) && !this.startTime && !this.endTime
            ? this.msg.emptyView
            : rangeText}
        </div>
      </div>
    `;
  }
}
