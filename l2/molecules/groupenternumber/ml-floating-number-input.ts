/// <mls fileReference="_102040_/l2/molecules/groupenternumber/ml-floating-number-input.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// GROUP ENTER NUMBER – FLOATING NUMBER INPUT MOLECULE
// =============================================================================
// Skill Group: groupEnterNumber (data entry)
// This molecule does NOT contain business logic.

import { html, nothing, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, property, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  placeholder: 'Enter a number',
  loading: 'Loading...',
  noResults: 'No results',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  // additional locales can be added here
};
/// **collab_i18n_end**

@customElement('groupenternumber--ml-floating-number-input')
export class MlFloatingNumberInputMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Helper', 'Prefix', 'Suffix'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: Number })
  value: number | null = null;

  @propertyDataSource({ type: String })
  error: string = '';

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
  private rawValue = '';

  @state()
  private isFocused = false;

  // ===========================================================================
  // LIFECYCLE & STATE CHANGE HANDLER
  // ===========================================================================
  firstUpdated() {
    this.updateRawFromValue();
  }

  /**
   * Called when a bound ICA state changes. Re‑calculate derived values.
   */
  handleIcaStateChange(key: string, value: any) {
    const valueAttr = this.getAttribute('value');
    if (valueAttr === `{{${key}}}`) {
      this.value = value as number | null;
      this.updateRawFromValue();
    }
    // other bound properties (min, max, etc.) are automatically reflected by Lit
    this.requestUpdate();
  }

  // ===========================================================================
  // HELPERS – Formatting & Parsing
  // ===========================================================================
  private formatToDisplay(num: number | null): string {
    if (num === null || num === undefined) return '';
    const opts: Intl.NumberFormatOptions = {
      minimumFractionDigits: this.decimals,
      maximumFractionDigits: this.decimals,
    };
    try {
      return new Intl.NumberFormat(this.locale || undefined, opts).format(num);
    } catch {
      // Fallback to default formatting if locale is invalid
      return num.toFixed(this.decimals);
    }
  }

  private parseRaw(raw: string): number | null {
    if (!raw) return null;
    // Remove grouping separators based on locale (fallback to generic replace)
    const normalized = raw
      .replace(/\s/g, '')
      .replace(/[^0-9\-.,]/g, '')
      .replace(/\./g, '')
      .replace(/,/, '.');
    const num = Number(normalized);
    return isNaN(num) ? null : num;
  }

  private roundToDecimals(num: number): number {
    const factor = Math.pow(10, this.decimals);
    return Math.round(num * factor) / factor;
  }

  private clampValue(num: number | null): number | null {
    if (num === null) return null;
    let clamped = num;
    if (this.min !== null && clamped < this.min) clamped = this.min;
    if (this.max !== null && clamped > this.max) clamped = this.max;
    return this.roundToDecimals(clamped);
  }

  private updateRawFromValue() {
    this.rawValue = this.value !== null ? this.formatToDisplay(this.value) : '';
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.rawValue = input.value;
    const parsed = this.parseRaw(input.value);
    this.value = parsed;
    this.dispatchEvent(
      new CustomEvent('input', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    );
  }

  private handleBlur() {
    // Apply clamping / rounding on blur
    const clamped = this.clampValue(this.value);
    if (clamped !== this.value) {
      this.value = clamped;
    }
    this.updateRawFromValue();
    this.isFocused = false;
    this.dispatchEvent(
      new CustomEvent('blur', { bubbles: true, composed: true })
    );
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    );
  }

  private handleFocus() {
    this.isFocused = true;
    this.dispatchEvent(
      new CustomEvent('focus', { bubbles: true, composed: true })
    );
  }

  private increment() {
    if (this.disabled || this.readonly) return;
    const current = this.value ?? 0;
    const next = current + this.step;
    if (this.max !== null && next > this.max) return;
    this.value = this.roundToDecimals(next);
    this.updateRawFromValue();
    this.emitChange();
  }

  private decrement() {
    if (this.disabled || this.readonly) return;
    const current = this.value ?? 0;
    const next = current - this.step;
    if (this.min !== null && next < this.min) return;
    this.value = this.roundToDecimals(next);
    this.updateRawFromValue();
    this.emitChange();
  }

  private emitChange() {
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    );
  }

  // ===========================================================================
  // CSS CLASS BUILDERS (dark‑mode aware)
  // ===========================================================================
  private getInputClasses(): string {
    const base = [
      'w-full rounded-md px-3 py-2 text-sm border transition',
      'bg-white dark:bg-slate-900',
      'text-slate-900 dark:text-slate-100',
      'placeholder:text-slate-400 dark:placeholder:text-slate-500',
      this.error ? 'border-red-500 dark:border-red-400' : 'border-slate-200 dark:border-slate-700',
      'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
      this.disabled ? 'opacity-50 cursor-not-allowed' : '',
      this.readonly ? 'bg-slate-50 dark:bg-slate-900' : '',
    ].filter(Boolean);
    return base.join(' ');
  }

  private getContainerClasses(): string {
    const base = [
      'relative',
      this.isFocused ? 'ring-2 ring-sky-500 dark:ring-sky-400' : '',
    ].filter(Boolean);
    return base.join(' ');
  }

  private getLabelClasses(): string {
    const floating = this.isFocused || (this.value !== null && this.value !== undefined && this.value !== 0) || this.rawValue !== '';
    const base = [
      'absolute left-3 transition-all text-sm',
      floating ? 'top-0 text-xs text-slate-600 dark:text-slate-400' : 'top-2.5 text-slate-500 dark:text-slate-400',
    ].filter(Boolean);
    return base.join(' ');
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderLabel(): TemplateResult | typeof nothing {
    if (!this.hasSlot('Label')) return nothing;
    const content = this.getSlotContent('Label');
    return html`<label class="${this.getLabelClasses()}">${unsafeHTML(content)}</label>`;
  }

  private renderHelper(): TemplateResult | typeof nothing {
    if (this.error) return nothing;
    if (!this.hasSlot('Helper')) return nothing;
    const content = this.getSlotContent('Helper');
    return html`<p class="mt-1 text-xs text-slate-500 dark:text-slate-400">${unsafeHTML(content)}</p>`;
  }

  private renderError(): TemplateResult | typeof nothing {
    if (!this.error) return nothing;
    return html`<p class="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">${unsafeHTML(this.error)}</p>`;
  }

  private renderPrefix(): TemplateResult | typeof nothing {
    if (!this.hasSlot('Prefix')) return nothing;
    const content = this.getSlotContent('Prefix');
    return html`<span class="mr-2 text-slate-600 dark:text-slate-400">${unsafeHTML(content)}</span>`;
  }

  private renderSuffix(): TemplateResult | typeof nothing {
    if (!this.hasSlot('Suffix')) return nothing;
    const content = this.getSlotContent('Suffix');
    return html`<span class="ml-2 text-slate-600 dark:text-slate-400">${unsafeHTML(content)}</span>`;
  }

  private renderInput(): TemplateResult {
    const ph = this.placeholder || this.getSlotAttr('Label', 'placeholder') || this.msg.placeholder;
    return html`
      <div class="flex items-center" @click="${(e: Event) => e.stopPropagation()}">
        ${this.renderPrefix()}
        <input
          type="text"
          .value="${this.rawValue}"
          ?disabled="${this.disabled || this.loading}"
          ?readonly="${this.readonly}"
          placeholder="${ph}"
          class="${this.getInputClasses()}"
          @input="${this.handleInput}"
          @blur="${this.handleBlur}"
          @focus="${this.handleFocus}"
          aria-invalid="${this.error ? 'true' : 'false'}"
          aria-required="${this.required ? 'true' : 'false'}"
          name="${this.name}"
        />
        ${this.renderSuffix()}
        <!-- Stepper buttons -->
        <button
          type="button"
          class="ml-2 p-1 text-sm bg-slate-200 dark:bg-slate-700 rounded disabled:opacity-50"
          ?disabled="${this.disabled || this.readonly || this.loading}"
          @click="${this.decrement}"
          aria-label="Decrement"
        >−</button>
        <button
          type="button"
          class="ml-1 p-1 text-sm bg-slate-200 dark:bg-slate-700 rounded disabled:opacity-50"
          ?disabled="${this.disabled || this.readonly || this.loading}"
          @click="${this.increment}"
          aria-label="Increment"
        >+</button>
      </div>
    `;
  }

  private renderViewMode(): TemplateResult {
    const display = this.value !== null ? this.formatToDisplay(this.value) : '—';
    return html`
      <div class="flex items-center">
        ${this.renderPrefix()}
        <span class="${this.getInputClasses()} bg-transparent border-0 p-0 focus:outline-none">
          ${unsafeHTML(display)}
        </span>
        ${this.renderSuffix()}
      </div>
    `;
  }

  // ===========================================================================
  // MAIN RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    if (this.loading) {
      return html`<div class="flex items-center text-slate-500 dark:text-slate-400">
        <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/></svg>
        ${this.msg.loading}
      </div>`;
    }

    return html`
      <div class="${this.getContainerClasses()}">
        ${this.renderLabel()}
        ${this.isEditing ? this.renderInput() : this.renderViewMode()}
        ${this.error ? this.renderError() : this.renderHelper()}
      </div>
    `;
  }
}
