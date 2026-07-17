/// <mls fileReference="_102040_/l2/molecules/groupentertimeinterval/ml-work-shift-interval.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// WORK SHIFT INTERVAL MOLECULE
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
  startPlaceholder: 'Start time',
  endPlaceholder: 'End time',
  loading: 'Loading...',
  nextDay: '(+1)',
  emptyView: '—',
  rangeSeparator: '–',
};

type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    startPlaceholder: 'Hora inicial',
    endPlaceholder: 'Hora final',
    loading: 'Carregando...',
    nextDay: '(+1)',
    emptyView: '—',
    rangeSeparator: '–',
  },
};
/// **collab_i18n_end**

@customElement('groupentertimeinterval--ml-work-shift-interval')
export class WorkShiftIntervalMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;
  private uid = `ws-interval-${Math.random().toString(36).slice(2, 9)}`;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'LabelStart', 'LabelEnd', 'Helper'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
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

  @propertyDataSource({ type: Boolean, attribute: 'hour-12' })
  hour12 = false;

  @propertyDataSource({ type: Boolean, attribute: 'show-seconds' })
  showSeconds = false;

  @propertyDataSource({ type: Number, attribute: 'minute-step' })
  minuteStep = 1;

  @propertyDataSource({ type: String, attribute: 'min-time' })
  minTime = '';

  @propertyDataSource({ type: String, attribute: 'max-time' })
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

  @propertyDataSource({ type: Boolean, attribute: 'disabled' })
  disabled = false;

  @propertyDataSource({ type: Boolean, attribute: 'readonly' })
  readonly = false;

  @propertyDataSource({ type: Boolean, attribute: 'required' })
  required = false;

  @propertyDataSource({ type: Boolean, attribute: 'loading' })
  loading = false;

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private activeField: 'start' | 'end' | null = null;

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleStartInput(e: Event) {
    e.stopPropagation();
    if (this.disabled || this.loading || this.readonly) return;
    const input = e.target as HTMLInputElement;
    const next = input.value ? this.normalizeValueForStorage(input.value) : null;
    this.startTime = next;
    this.dispatchEvent(
      new CustomEvent('startChange', {
        bubbles: true,
        composed: true,
        detail: { value: next },
      })
    );
    if (this.startTime || this.endTime) {
      this.dispatchChangeIfComplete();
    }
  }

  private handleEndInput(e: Event) {
    e.stopPropagation();
    if (this.disabled || this.loading || this.readonly) return;
    const input = e.target as HTMLInputElement;
    const next = input.value ? this.normalizeValueForStorage(input.value) : null;
    this.endTime = next;
    this.dispatchEvent(
      new CustomEvent('endChange', {
        bubbles: true,
        composed: true,
        detail: { value: next },
      })
    );
    if (this.startTime || this.endTime) {
      this.dispatchChangeIfComplete();
    }
  }

  private handleFocus(field: 'start' | 'end') {
    if (!this.isEditing) return;
    this.activeField = field;
    this.dispatchEvent(
      new CustomEvent('focus', {
        bubbles: true,
        composed: true,
        detail: {},
      })
    );
  }

  private handleBlur() {
    if (!this.isEditing) return;
    this.activeField = null;
    this.dispatchEvent(
      new CustomEvent('blur', {
        bubbles: true,
        composed: true,
        detail: {},
      })
    );
  }

  private dispatchChangeIfComplete() {
    if (this.startTime !== null && this.endTime !== null) {
      this.dispatchEvent(
        new CustomEvent('change', {
          bubbles: true,
          composed: true,
          detail: { startTime: this.startTime, endTime: this.endTime },
        })
      );
    }
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================
  private normalizeValueForInput(value: string | null): string {
    if (!value) return '';
    if (this.showSeconds) {
      return value.length === 5 ? `${value}:00` : value;
    }
    return value.slice(0, 5);
  }

  private normalizeValueForStorage(value: string): string {
    if (this.showSeconds) {
      return value.length === 5 ? `${value}:00` : value;
    }
    return value.slice(0, 5);
  }

  private parseToSeconds(value: string): number {
    const [h, m, s] = value.split(':').map((v) => Number(v));
    return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
  }

  private formatFromSeconds(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600) % 24;
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return this.showSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
  }

  private formatDisplay(value: string | null): string {
    if (!value) return this.msg.emptyView;
    const normalized = this.normalizeValueForInput(value);
    const [h, m, s] = normalized.split(':').map((v) => Number(v));
    const date = new Date();
    date.setHours(h || 0, m || 0, s || 0, 0);
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: this.showSeconds ? '2-digit' : undefined,
      hour12: this.hour12,
    };
    return date.toLocaleTimeString(this.locale || undefined, options);
  }

  private isOvernightInterval(): boolean {
    if (!this.allowOvernight || !this.startTime || !this.endTime) return false;
    const start = this.parseToSeconds(this.normalizeValueForInput(this.startTime));
    const end = this.parseToSeconds(this.normalizeValueForInput(this.endTime));
    return end < start;
  }

  private getInputStep(): number {
    const stepMinutes = Math.max(1, this.minuteStep || 1);
    return stepMinutes * 60;
  }

  private getEndConstraints(): { min?: string; max?: string } {
    const constraints: { min?: string; max?: string } = {};

    if (this.minTime) {
      constraints.min = this.normalizeValueForInput(this.minTime);
    }
    if (this.maxTime) {
      constraints.max = this.normalizeValueForInput(this.maxTime);
    }

    if (!this.startTime || this.allowOvernight) {
      return constraints;
    }

    const startSeconds = this.parseToSeconds(this.normalizeValueForInput(this.startTime));
    const minDuration = this.minDurationMinutes > 0 ? this.minDurationMinutes : 0;
    const maxDuration = this.maxDurationMinutes > 0 ? this.maxDurationMinutes : 0;
    const minimumStep = this.allowSameTime ? 0 : Math.max(1, this.minuteStep || 1);
    const minOffset = Math.max(minDuration, minimumStep);

    if (minOffset > 0) {
      const minEnd = this.formatFromSeconds(startSeconds + minOffset * 60);
      constraints.min = constraints.min
        ? this.maxTimeValue(constraints.min, minEnd)
        : minEnd;
    }

    if (maxDuration > 0) {
      const maxEnd = this.formatFromSeconds(startSeconds + maxDuration * 60);
      constraints.max = constraints.max
        ? this.minTimeValue(constraints.max, maxEnd)
        : maxEnd;
    }

    return constraints;
  }

  private maxTimeValue(a: string, b: string): string {
    return this.parseToSeconds(a) > this.parseToSeconds(b) ? a : b;
  }

  private minTimeValue(a: string, b: string): string {
    return this.parseToSeconds(a) < this.parseToSeconds(b) ? a : b;
  }

  private getWrapperClasses(): string {
    const hasError = Boolean(this.error);
    const isBlocked = this.disabled || this.loading;
    return [
      'w-full rounded-lg border p-4 transition ml-shift-container',
      hasError ? 'ml-input-container-error' : '',
      isBlocked ? 'ml-disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getInputClasses(isActive: boolean): string {
    const hasError = Boolean(this.error);
    return [
      'w-full rounded-md border px-3 py-2 text-sm transition ml-input',
      hasError
        ? 'ml-input-container-error'
        : isActive
        ? 'ml-shift-input-active'
        : '',
    ].filter(Boolean).join(' ');
  }

  private getIndicatorClasses(): string {
    return 'ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs ml-shift-overnight';
  }

  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    return html`
      <div class="${cn('mb-3 text-sm font-medium ml-label', this.getSlotClass('Label'))}">
        ${unsafeHTML(this.getSlotContent('Label'))}
        ${this.required ? html`<span class="ml-error-text"> *</span>` : html``}
      </div>
    `;
  }

  private renderHelperOrError(): TemplateResult {
    if (!this.isEditing) return html``;
    if (this.error) {
      return html`<p id="${this.uid}-error" class="mt-2 text-xs ml-error-text">${unsafeHTML(String(this.error))}</p>`;
    }
    if (this.hasSlot('Helper')) {
      return html`<p id="${this.uid}-helper" class="${cn('mt-2 text-xs ml-helper', this.getSlotClass('Helper'))}">${unsafeHTML(this.getSlotContent('Helper'))}</p>`;
    }
    return html``;
  }

  private renderViewMode(): TemplateResult {
    const startText = this.formatDisplay(this.startTime);
    const endText = this.formatDisplay(this.endTime);
    const overnight = this.isOvernightInterval();
    const range = `${startText} ${this.msg.rangeSeparator} ${endText}`;

    return html`
      <div class="${cn(this.getWrapperClasses(), this.cssClass)}">
        ${this.renderLabel()}
        <div class="text-sm ml-text">
          <span>${range}</span>
          ${overnight ? html`<span class="${this.getIndicatorClasses()}" aria-label="${this.msg.nextDay}">${this.msg.nextDay}</span>` : html``}
        </div>
      </div>
    `;
  }

  private renderEditMode(): TemplateResult {
    const startLabelId = `${this.uid}-label-start`;
    const endLabelId = `${this.uid}-label-end`;
    const helperId = this.error ? `${this.uid}-error` : `${this.uid}-helper`;
    const endConstraints = this.getEndConstraints();
    const overnight = this.isOvernightInterval();

    return html`
      <div class="${cn(this.getWrapperClasses(), this.cssClass)}">
        ${this.renderLabel()}
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            ${this.hasSlot('LabelStart')
              ? html`<label id="${startLabelId}" class="${cn('mb-1 block text-xs font-medium ml-text-muted', this.getSlotClass('LabelStart'))}">
                  ${unsafeHTML(this.getSlotContent('LabelStart'))}
                </label>`
              : html``}
            <input
              class="${this.getInputClasses(this.activeField === 'start')}"
              type="time"
              name="${this.name ? `${this.name}-start` : ''}"
              .value="${this.normalizeValueForInput(this.startTime)}"
              ?disabled=${this.disabled || this.loading}
              ?readonly=${this.readonly}
              aria-labelledby="${this.hasSlot('LabelStart') ? startLabelId : ''}"
              aria-describedby="${this.hasSlot('Helper') || this.error ? helperId : ''}"
              aria-invalid="${this.error ? 'true' : 'false'}"
              aria-required="${this.required ? 'true' : 'false'}"
              step="${this.getInputStep()}"
              min="${this.minTime ? this.normalizeValueForInput(this.minTime) : ''}"
              max="${this.maxTime ? this.normalizeValueForInput(this.maxTime) : ''}"
              placeholder="${this.msg.startPlaceholder}"
              @input=${this.handleStartInput}
              @focus=${() => this.handleFocus('start')}
              @blur=${this.handleBlur}
            
            @change="${(e: Event) => e.stopPropagation()}"
/>
          </div>
          <div>
            ${this.hasSlot('LabelEnd')
              ? html`<label id="${endLabelId}" class="${cn('mb-1 block text-xs font-medium ml-text-muted', this.getSlotClass('LabelEnd'))}">
                  ${unsafeHTML(this.getSlotContent('LabelEnd'))}
                </label>`
              : html``}
            <div class="flex items-center">
              <input
                class="${this.getInputClasses(this.activeField === 'end')}"
                type="time"
                name="${this.name ? `${this.name}-end` : ''}"
                .value="${this.normalizeValueForInput(this.endTime)}"
                ?disabled=${this.disabled || this.loading}
                ?readonly=${this.readonly}
                aria-labelledby="${this.hasSlot('LabelEnd') ? endLabelId : ''}"
                aria-describedby="${this.hasSlot('Helper') || this.error ? helperId : ''}"
                aria-invalid="${this.error ? 'true' : 'false'}"
                aria-required="${this.required ? 'true' : 'false'}"
                step="${this.getInputStep()}"
                min="${endConstraints.min || ''}"
                max="${endConstraints.max || ''}"
                placeholder="${this.msg.endPlaceholder}"
                @input=${this.handleEndInput}
                @focus=${() => this.handleFocus('end')}
                @blur=${this.handleBlur}
              
              @change="${(e: Event) => e.stopPropagation()}"
/>
              ${overnight ? html`<span class="${this.getIndicatorClasses()}" aria-label="${this.msg.nextDay}">${this.msg.nextDay}</span>` : html``}
            </div>
          </div>
        </div>
        ${this.loading ? html`<div class="mt-3 text-xs ml-text-muted">${this.msg.loading}</div>` : html``}
        ${this.renderHelperOrError()}
      </div>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    return this.isEditing ? this.renderEditMode() : this.renderViewMode();
  }
}
