/// <mls fileReference="_102040_/l2/molecules/groupenternumber/ml-range-slider.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// RANGE SLIDER MOLECULE
// =============================================================================
// Skill Group: groupEnterNumber
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  placeholder: 'Select a range',
  empty: '—',
  loading: 'Loading...',
  rangeSeparator: '–',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: 'Selecione um intervalo',
    empty: '—',
    loading: 'Carregando...',
    rangeSeparator: '–',
  },
};
/// **collab_i18n_end**

@customElement('groupenternumber--ml-range-slider')
export class RangeSliderMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;
  private uid = `rs-${Math.random().toString(36).slice(2, 8)}`;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Helper', 'Prefix', 'Suffix'];

  // ===========================================================================
  // PROPERTIES — From Contract (+ range extension)
  // ===========================================================================
  @propertyDataSource({ type: Number })
  value: number | null = null; // Lower value

  @propertyDataSource({ type: Number, attribute: 'value-high' })
  valueHigh: number | null = null; // Upper value (range extension)

  @propertyDataSource({ type: String })
  error = '';

  @propertyDataSource({ type: String })
  name = '';

  @propertyDataSource({ type: Number })
  min: number | null = null;

  @propertyDataSource({ type: Number })
  max: number | null = null;

  @propertyDataSource({ type: Number })
  step = 1;

  @propertyDataSource({ type: Number })
  decimals = 0;

  @propertyDataSource({ type: String })
  locale = '';

  @propertyDataSource({ type: String })
  placeholder = '';

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
  private rawValueLow = '';

  @state()
  private rawValueHigh = '';

  // ===========================================================================
  // STATE CHANGE HANDLER
  // ===========================================================================
  handleIcaStateChange(key: string, value: any) {
    const valueAttr = this.getAttribute('value');
    const valueHighAttr = this.getAttribute('value-high');
    const minAttr = this.getAttribute('min');
    const maxAttr = this.getAttribute('max');
    const decimalsAttr = this.getAttribute('decimals');
    const localeAttr = this.getAttribute('locale');

    if (valueAttr === `{{${key}}}` || valueHighAttr === `{{${key}}}` || minAttr === `{{${key}}}` || maxAttr === `{{${key}}}` || decimalsAttr === `{{${key}}}` || localeAttr === `{{${key}}}`) {
      this.rawValueLow = this.formatToDisplay(this.value);
      this.rawValueHigh = this.formatToDisplay(this.valueHigh);
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // DERIVED VALUES
  // ===========================================================================
  private getLabelId(): string {
    return `${this.uid}-label`;
  }

  private getErrorId(): string {
    return `${this.uid}-error`;
  }

  private getHelperId(): string {
    return `${this.uid}-helper`;
  }

  private getDisplayPlaceholder(): string {
    return this.placeholder || this.msg.placeholder;
  }

  private isIntervalUnset(): boolean {
    return this.value === null && this.valueHigh === null;
  }

  private getBounds(): { min: number; max: number } {
    const fallbackMin = this.value ?? 0;
    const fallbackMax = this.valueHigh ?? (fallbackMin + 100);
    const minBound = this.min ?? Math.min(fallbackMin, fallbackMax - this.step);
    const maxBound = this.max ?? Math.max(fallbackMax, minBound + this.step);
    return { min: minBound, max: maxBound };
  }

  private normalizeValue(value: number | null): number | null {
    if (value === null || Number.isNaN(value)) return null;
    const { min, max } = this.getBounds();
    let next = value;
    if (this.min !== null) next = Math.max(next, min);
    if (this.max !== null) next = Math.min(next, max);
    return this.roundToDecimals(next);
  }

  private roundToDecimals(value: number): number {
    const factor = Math.pow(10, Math.max(this.decimals, 0));
    return Math.round(value * factor) / factor;
  }

  private formatToDisplay(value: number | null): string {
    if (value === null || value === undefined) return '';
    const options: Intl.NumberFormatOptions = {
      minimumFractionDigits: this.decimals,
      maximumFractionDigits: this.decimals,
    };
    try {
      return new Intl.NumberFormat(this.locale || undefined, options).format(value);
    } catch {
      return value.toFixed(this.decimals);
    }
  }

  private clampPair(low: number | null, high: number | null): { low: number | null; high: number | null } {
    let nextLow = this.normalizeValue(low);
    let nextHigh = this.normalizeValue(high);

    if (nextLow !== null && nextHigh !== null && nextLow > nextHigh) {
      nextHigh = nextLow;
    }

    return { low: nextLow, high: nextHigh };
  }

  // ===========================================================================
  // EVENT EMITTERS
  // ===========================================================================
  private emitInput() {
    this.dispatchEvent(new CustomEvent('input', {
      bubbles: true,
      composed: true,
      detail: { value: { min: this.value, max: this.valueHigh } },
    }));
  }

  private emitChange() {
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: { min: this.value, max: this.valueHigh } },
    }));
  }

  private emitFocus() {
    this.dispatchEvent(new CustomEvent('focus', {
      bubbles: true,
      composed: true,
      detail: {},
    }));
  }

  private emitBlur() {
    this.dispatchEvent(new CustomEvent('blur', {
      bubbles: true,
      composed: true,
      detail: {},
    }));
  }

  // ===========================================================================
  // HANDLERS
  // ===========================================================================
  private handleLowInput(e: Event) {
    if (this.disabled || this.loading) return;
    const input = e.target as HTMLInputElement;
    const next = Number(input.value);

    if (this.readonly) {
      input.value = String(this.value ?? this.getBounds().min);
      return;
    }

    const { low, high } = this.clampPair(next, this.valueHigh);
    this.value = low;
    this.valueHigh = high;
    this.rawValueLow = this.formatToDisplay(this.value);
    this.rawValueHigh = this.formatToDisplay(this.valueHigh);
    this.emitInput();
  }

  private handleHighInput(e: Event) {
    if (this.disabled || this.loading) return;
    const input = e.target as HTMLInputElement;
    const next = Number(input.value);

    if (this.readonly) {
      input.value = String(this.valueHigh ?? this.getBounds().max);
      return;
    }

    const { low, high } = this.clampPair(this.value, next);
    this.value = low;
    this.valueHigh = high;
    this.rawValueLow = this.formatToDisplay(this.value);
    this.rawValueHigh = this.formatToDisplay(this.valueHigh);
    this.emitInput();
  }

  private handleLowChange() {
    if (this.disabled || this.loading || this.readonly) return;
    this.emitChange();
  }

  private handleHighChange() {
    if (this.disabled || this.loading || this.readonly) return;
    this.emitChange();
  }

  private handleFocus() {
    if (this.disabled || this.loading) return;
    this.emitFocus();
  }

  private handleBlur() {
    if (this.disabled || this.loading) return;
    this.emitBlur();
    if (this.readonly) return;
    const { low, high } = this.clampPair(this.value, this.valueHigh);
    this.value = low;
    this.valueHigh = high;
    this.rawValueLow = this.formatToDisplay(this.value);
    this.rawValueHigh = this.formatToDisplay(this.valueHigh);
    this.emitChange();
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    return html`
      <label id=${this.getLabelId()} class="${cn('mb-1 text-sm ml-label', this.getSlotClass('Label'))}">
        ${unsafeHTML(this.getSlotContent('Label'))}
      </label>
    `;
  }

  private renderPrefixSuffix(content: string): TemplateResult {
    const prefix = this.hasSlot('Prefix') ? unsafeHTML(this.getSlotContent('Prefix')) : null;
    const suffix = this.hasSlot('Suffix') ? unsafeHTML(this.getSlotContent('Suffix')) : null;
    return html`
      <span class="inline-flex items-center gap-1">
        ${prefix ? html`<span class="${cn('ml-text-muted', this.getSlotClass('Prefix'))}">${prefix}</span>` : html``}
        <span class="ml-text">${content}</span>
        ${suffix ? html`<span class="${cn('ml-text-muted', this.getSlotClass('Suffix'))}">${suffix}</span>` : html``}
      </span>
    `;
  }

  private renderHelperOrError(): TemplateResult {
    if (!this.isEditing) return html``;
    if (this.error) {
      return html`<p id=${this.getErrorId()} class="mt-1 text-xs ml-error-text">${unsafeHTML(String(this.error))}</p>`;
    }
    if (this.hasSlot('Helper')) {
      return html`<p id=${this.getHelperId()} class="${cn('mt-1 text-xs ml-helper', this.getSlotClass('Helper'))}">${unsafeHTML(this.getSlotContent('Helper'))}</p>`;
    }
    return html``;
  }

  private getInputClasses(): string {
    return [
      'w-full h-2 rounded-full transition ml-slider-track',
      this.error ? 'ml-input-container-error' : '',
      this.disabled || this.loading ? 'ml-disabled' : 'cursor-pointer',
      this.readonly ? 'opacity-80' : '',
    ].filter(Boolean).join(' ');
  }

  private getValueDisplay(): { low: string; high: string } {
    const placeholder = this.getDisplayPlaceholder();
    if (this.isIntervalUnset()) {
      return { low: placeholder, high: placeholder };
    }
    const low = this.value === null ? this.msg.empty : this.formatToDisplay(this.value);
    const high = this.valueHigh === null ? this.msg.empty : this.formatToDisplay(this.valueHigh);
    return { low, high };
  }

  private renderLoading(): TemplateResult {
    if (!this.loading) return html``;
    return html`<div class="mt-2 text-xs ml-text-muted">${this.msg.loading}</div>`;
  }

  private renderEditMode(): TemplateResult {
    const { min, max } = this.getBounds();
    const display = this.getValueDisplay();
    const ariaDescribedBy = this.error ? this.getErrorId() : (this.hasSlot('Helper') ? this.getHelperId() : undefined);
    const ariaLabelledBy = this.hasSlot('Label') ? this.getLabelId() : undefined;

    return html`
      <div class="${cn('flex flex-col', this.cssClass)}">
        ${this.renderLabel()}
        <div class="mb-2 flex items-center justify-between text-sm ml-text-muted">
          ${this.renderPrefixSuffix(display.low)}
          <span class="ml-text-muted">${this.msg.rangeSeparator}</span>
          ${this.renderPrefixSuffix(display.high)}
        </div>
        <div class="grid gap-3">
          <input
            type="range"
            class=${this.getInputClasses()}
            min=${min}
            max=${max}
            step=${this.step}
            .value=${String(this.value ?? min)}
            aria-labelledby=${ariaLabelledBy || ''}
            aria-describedby=${ariaDescribedBy || ''}
            aria-required=${this.required ? 'true' : 'false'}
            aria-invalid=${this.error ? 'true' : 'false'}
            aria-valuemin=${min}
            aria-valuemax=${max}
            aria-valuenow=${this.value ?? min}
            aria-readonly=${this.readonly ? 'true' : 'false'}
            ?disabled=${this.disabled || this.loading}
            @input=${this.handleLowInput}
            @change=${this.handleLowChange}
            @focus=${this.handleFocus}
            @blur=${this.handleBlur}
          />
          <input
            type="range"
            class=${this.getInputClasses()}
            min=${min}
            max=${max}
            step=${this.step}
            .value=${String(this.valueHigh ?? max)}
            aria-labelledby=${ariaLabelledBy || ''}
            aria-describedby=${ariaDescribedBy || ''}
            aria-required=${this.required ? 'true' : 'false'}
            aria-invalid=${this.error ? 'true' : 'false'}
            aria-valuemin=${min}
            aria-valuemax=${max}
            aria-valuenow=${this.valueHigh ?? max}
            aria-readonly=${this.readonly ? 'true' : 'false'}
            ?disabled=${this.disabled || this.loading}
            @input=${this.handleHighInput}
            @change=${this.handleHighChange}
            @focus=${this.handleFocus}
            @blur=${this.handleBlur}
          />
        </div>
        ${this.renderHelperOrError()}
        ${this.renderLoading()}
      </div>
    `;
  }

  private renderViewMode(): TemplateResult {
    const display = this.getValueDisplay();
    const content = this.isIntervalUnset()
      ? this.msg.empty
      : `${display.low} ${this.msg.rangeSeparator} ${display.high}`;

    return html`
      <div class="${cn('flex flex-col', this.cssClass)}">
        ${this.renderLabel()}
        <div class="text-sm ml-text">
          ${this.renderPrefixSuffix(content)}
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
    if (!this.isEditing) return this.renderViewMode();
    return this.renderEditMode();
  }
}
