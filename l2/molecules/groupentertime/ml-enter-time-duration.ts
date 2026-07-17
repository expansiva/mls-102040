/// <mls fileReference="_102040_/l2/molecules/groupentertime/ml-enter-time-duration.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ENTER TIME DURATION MOLECULE
// =============================================================================
// Skill Group: groupEnterTime
// This molecule does NOT contain business logic.
import { html, TemplateResult} from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  placeholder: 'HH:mm',
  emptyView: '—',
  loading: 'Loading...',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
};
/// **collab_i18n_end**

@customElement('groupentertime--ml-enter-time-duration')
export class EnterTimeDurationMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ==========================================================================
  // SLOT TAGS
  // ==========================================================================
  slotTags = ['Label', 'Helper'];

  // ==========================================================================
  // PROPERTIES — From Contract
  // ==========================================================================
  @propertyDataSource({ type: String })
  value: string | null = null;

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

  @propertyDataSource({ type: String })
  placeholder: string = '';

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
  private rawValue: string = '';

  // ==========================================================================
  // STATE CHANGE HANDLER
  // ==========================================================================
  handleIcaStateChange(key: string, value: any) {
    const valueAttr = this.getAttribute('value');
    const showSecondsAttr = this.getAttribute('show-seconds');
    if (valueAttr === `{{${key}}}` || showSecondsAttr === `{{${key}}}`) {
      this.rawValue = this.formatStoredValue(value, this.showSeconds);
    }
    this.requestUpdate();
  }

  // ==========================================================================
  // LIFECYCLE
  // ==========================================================================
  firstUpdated() {
    this.rawValue = this.formatStoredValue(this.value, this.showSeconds);
  }

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================
  private handleFocus() {
    if (!this.isEditing || this.disabled || this.readonly) return;
    this.dispatchEvent(
      new CustomEvent('focus', {
        bubbles: true,
        composed: true,
        detail: {},
      })
    );
  }

  private handleBlur() {
    if (!this.isEditing || this.disabled || this.readonly) return;
    this.commitValue(this.rawValue);
    this.dispatchEvent(
      new CustomEvent('blur', {
        bubbles: true,
        composed: true,
        detail: {},
      })
    );
  }

  private handleInput(e: Event) {
    e.stopPropagation();
    if (!this.isEditing || this.disabled || this.readonly) return;
    const input = e.target as HTMLInputElement;
    this.rawValue = input.value;
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.commitValue(this.rawValue);
    }
  }

  private commitValue(raw: string) {
    if (raw.trim() === '') {
      this.value = null;
      this.rawValue = '';
      this.dispatchChange();
      return;
    }

    const parsed = this.parseTime(raw, this.showSeconds);
    if (!parsed) {
      this.rawValue = this.formatStoredValue(this.value, this.showSeconds);
      return;
    }

    const normalized = this.normalizeTime(parsed, this.minuteStep);
    if (!normalized) {
      this.rawValue = this.formatStoredValue(this.value, this.showSeconds);
      return;
    }

    if (!this.isWithinRange(normalized)) {
      this.rawValue = this.formatStoredValue(this.value, this.showSeconds);
      return;
    }

    const nextValue = this.formatTime(normalized, this.showSeconds);
    this.value = nextValue;
    this.rawValue = nextValue;
    this.dispatchChange();
  }

  private dispatchChange() {
    if (!this.isEditing || this.disabled || this.readonly) return;
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    );
  }

  // ==========================================================================
  // HELPERS
  // ==========================================================================
  private formatStoredValue(value: string | null, showSeconds: boolean): string {
    if (!value) return '';
    if (!showSeconds && value.length === 8) {
      return value.slice(0, 5);
    }
    return value;
  }

  private parseTime(raw: string, showSeconds: boolean): { h: number; m: number; s: number } | null {
    const cleaned = raw.trim();
    const parts = cleaned.split(':');
    if (!showSeconds && parts.length !== 2) return null;
    if (showSeconds && parts.length !== 3) return null;

    const h = Number(parts[0]);
    const m = Number(parts[1]);
    const s = showSeconds ? Number(parts[2]) : 0;

    if ([h, m, s].some((n) => Number.isNaN(n))) return null;
    if (h < 0 || h > 23) return null;
    if (m < 0 || m > 59) return null;
    if (showSeconds && (s < 0 || s > 59)) return null;

    return { h, m, s };
  }

  private normalizeTime(
    time: { h: number; m: number; s: number },
    step: number
  ): { h: number; m: number; s: number } | null {
    const safeStep = step > 0 ? step : 1;
    const normalizedMinutes = Math.floor(time.m / safeStep) * safeStep;
    if (normalizedMinutes < 0 || normalizedMinutes > 59) return null;
    return { h: time.h, m: normalizedMinutes, s: time.s };
  }

  private formatTime(time: { h: number; m: number; s: number }, showSeconds: boolean): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    if (showSeconds) {
      return `${pad(time.h)}:${pad(time.m)}:${pad(time.s)}`;
    }
    return `${pad(time.h)}:${pad(time.m)}`;
  }

  private timeToSeconds(time: { h: number; m: number; s: number }): number {
    return time.h * 3600 + time.m * 60 + time.s;
  }

  private isWithinRange(time: { h: number; m: number; s: number }): boolean {
    if (!this.minTime && !this.maxTime) return true;

    const minParsed = this.minTime ? this.parseTime(this.minTime, false) : null;
    const maxParsed = this.maxTime ? this.parseTime(this.maxTime, false) : null;

    const current = this.timeToSeconds(time);
    if (minParsed) {
      const minSeconds = this.timeToSeconds({ h: minParsed.h, m: minParsed.m, s: 0 });
      if (current < minSeconds) return false;
    }
    if (maxParsed) {
      const maxSeconds = this.timeToSeconds({ h: maxParsed.h, m: maxParsed.m, s: 59 });
      if (current > maxSeconds) return false;
    }
    return true;
  }

  private getDisplayValue(): string {
    if (!this.value) return this.msg.emptyView;
    const parsed = this.parseTime(this.value, this.value.length === 8);
    if (!parsed) return this.msg.emptyView;

    const baseDate = new Date(1970, 0, 1, parsed.h, parsed.m, parsed.s);
    const locale = this.locale || undefined;
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: this.showSeconds ? '2-digit' : undefined,
      hour12: this.hour12,
    };

    return new Intl.DateTimeFormat(locale, options).format(baseDate);
  }

  private getInputClasses(): string {
    return cn(
      'w-full px-3 py-2 text-sm ml-input ml-input-container',
      this.error ? 'ml-input-container-error' : '',
      this.disabled ? 'ml-disabled' : '',
      this.readonly ? 'ml-disabled' : '',
    );
  }

  private renderLabel(labelId: string): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    return html`
      <label id=${labelId} class="${cn('mb-1 block text-sm ml-label', this.getSlotClass('Label'))}">
        ${unsafeHTML(this.getSlotContent('Label'))}
      </label>
    `;
  }

  private renderFeedback(helperId: string): TemplateResult {
    if (this.error) {
      return html`<p id=${helperId} class="${cn('mt-1 text-xs ml-error-text', this.getSlotClass('Helper'))}">${unsafeHTML(this.error)}</p>`;
    }
    if (this.hasSlot('Helper')) {
      return html`<p id=${helperId} class="${cn('mt-1 text-xs ml-helper', this.getSlotClass('Helper'))}">${unsafeHTML(this.getSlotContent('Helper'))}</p>`;
    }
    return html``;
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    const inputPlaceholder = this.placeholder || (this.showSeconds ? 'HH:mm:ss' : this.msg.placeholder);
    const labelId = `${this.id || 'time'}-label`;
    const helperId = `${this.id || 'time'}-helper`;

    if (!this.isEditing) {
      return html`
        <div class="${cn('w-full', this.cssClass)}">
          ${this.renderLabel(labelId)}
          <div class="text-sm ml-text">${this.getDisplayValue()}</div>
        </div>
      `;
    }

    if (this.loading) {
      return html`
        <div class="${cn('w-full', this.cssClass)}">
          ${this.renderLabel(labelId)}
          <div class="text-sm ml-text-muted">${this.msg.loading}</div>
        </div>
      `;
    }

    return html`
      <div class="${cn('w-full', this.cssClass)}">
        ${this.renderLabel(labelId)}
        <input
          class=${this.getInputClasses()}
          type="text"
          name=${this.name}
          .value=${this.rawValue}
          placeholder=${inputPlaceholder}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          aria-labelledby=${labelId}
          aria-describedby=${this.error || this.hasSlot('Helper') ? helperId : ''}
          aria-invalid=${this.error ? 'true' : 'false'}
          aria-required=${this.required ? 'true' : 'false'}
          @input=${this.handleInput}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
          @keydown=${this.handleKeyDown}
        
        @change=${(e: Event) => e.stopPropagation()}
/>
        ${this.renderFeedback(helperId)}
      </div>
    `;
  }
}
