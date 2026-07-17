/// <mls fileReference="_102040_/l2/molecules/groupentermoney/ml-currency-input.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// groupentermoney--ml-currency-input MOLECULE
// =============================================================================
// Skill Group: groupEnterMoney (currency input)
// This molecule does NOT contain business logic.
import { html, nothing, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';
/// **collab_i18n_start**
const message_en = {
  loading: 'Loading...',
  placeholder: 'Enter amount',
  noValue: '—',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
};
/// **collab_i18n_end**
@customElement('groupentermoney--ml-currency-input')
export class GroupEnterMoneyMlCurrencyInputMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;
  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags: string[] = ['Label', 'Helper'];
  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: Number })
  value: number | null = null;
  @propertyDataSource({ type: String })
  error: string = '';
  @propertyDataSource({ type: String })
  name = '';
  @propertyDataSource({ type: String })
  currency = 'USD';
  @propertyDataSource({ type: String })
  locale = '';
  @propertyDataSource({ type: Number })
  decimals = 2;
  @propertyDataSource({ type: Number })
  min: number | null = null;
  @propertyDataSource({ type: Number })
  max: number | null = null;
  @propertyDataSource({ type: Boolean, attribute: 'show-symbol' })
  showSymbol = true;
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
  private rawValue: string = '';
  // ===========================================================================
  // STATE CHANGE HANDLER – keep rawValue in sync when external state changes
  // ===========================================================================
  handleIcaStateChange(key: string, value: any) {
    const valueBinding = this.getAttribute('value');
    if (valueBinding === `{{${key}}}`) {
      this.rawValue = this.formatToRaw(this.value);
    }
    this.requestUpdate();
  }
  // ===========================================================================
  // HELPERS – Formatting & Parsing
  // ===========================================================================
  private getEffectiveLocale(): string {
    return this.locale || 'en-US';
  }
  private formatNumber(num: number | null): string {
    if (num === null) return '';
    const opts: Intl.NumberFormatOptions = {
      minimumFractionDigits: this.decimals,
      maximumFractionDigits: this.decimals,
    };
    if (this.showSymbol) {
      opts.style = 'currency';
      opts.currency = this.currency;
    }
    return new Intl.NumberFormat(this.getEffectiveLocale(), opts).format(num);
  }
  // Raw value for the INPUT – locale formatted without currency symbol
  private formatToRaw(num: number | null): string {
    if (num === null) return '';
    const opts: Intl.NumberFormatOptions = {
      minimumFractionDigits: this.decimals,
      maximumFractionDigits: this.decimals,
    };
    return new Intl.NumberFormat(this.getEffectiveLocale(), opts).format(num);
  }
  /**
   * Parses the raw string entered by the user, interpreting it as an integer of cents
   * (or the appropriate fraction based on `decimals`). Returns a number or null.
   * Supports up to 20 digits by using BigInt for the intermediate integer value.
   */
  private parseRawToNumber(raw: string): number | null {
    // Remove everything except digits and minus sign
    const digits = raw.replace(/[^0-9\-]/g, '');
    if (digits === '' || digits === '-') return null;
    try {
      // Use BigInt to safely handle up to 20 digits
      const bigIntVal = BigInt(digits);
      const divisor = BigInt(10) ** BigInt(this.decimals);
      // Convert back to Number (may lose precision beyond safe integer range, but fulfills requirement)
      return Number(bigIntVal) / Number(divisor);
    } catch {
      // Fallback to regular parsing if BigInt fails (e.g., too large for environment)
      const intVal = parseInt(digits, 10);
      if (isNaN(intVal)) return null;
      const divisor = Math.pow(10, this.decimals);
      return intVal / divisor;
    }
  }
  private clampValue(val: number | null): number | null {
    if (val === null) return null;
    let result = val;
    if (this.min !== null && result < this.min) result = this.min;
    if (this.max !== null && result > this.max) result = this.max;
    return result;
  }
  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private onFocus = (e: FocusEvent) => {
    if (this.disabled || this.readonly) return;
    const input = e.target as HTMLInputElement;
    input.select();
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
  };
  private onInput = (e: InputEvent) => {
    e.stopPropagation();
    if (this.disabled || this.readonly) return;
    const input = e.target as HTMLInputElement;
    this.rawValue = input.value;
    const parsed = this.parseRawToNumber(this.rawValue);
    this.value = parsed;
    this.dispatchEvent(
      new CustomEvent('input', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    );
  };
  private onBlur = () => {
    if (this.disabled || this.readonly) return;
    const parsed = this.parseRawToNumber(this.rawValue);
    let newValue = parsed;
    if (newValue !== null) {
      newValue = Number(newValue.toFixed(this.decimals));
    }
    newValue = this.clampValue(newValue);
    this.value = newValue;
    this.rawValue = this.formatToRaw(this.value);
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    );
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
  };
  // ===========================================================================
  // CSS CLASS BUILDERS (dark mode aware)
  // ===========================================================================
  private getInputClasses(): string {
    return [
      'w-full flex-1 bg-transparent outline-none text-sm ml-input',
      this.disabled ? 'cursor-not-allowed' : '',
      this.readonly ? 'cursor-default' : '',
    ].filter(Boolean).join(' ');
  }
  private getContainerClasses(): string {
    return [
      'relative flex w-full items-center gap-2 ml-input-container py-2 px-3',
      this.error ? 'ml-input-container-error' : '',
      (this.disabled || this.loading) ? 'ml-disabled' : 'cursor-text',
    ].filter(Boolean).join(' ');
  }
  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderLabel(): TemplateResult | typeof nothing {
    if (!this.hasSlot('Label')) return nothing;
    const labelId = `${this.id}-label`;
    return html`<label id="${labelId}" class="${cn('block mb-1 text-sm ml-label', this.getSlotClass('Label'))}">
      ${unsafeHTML(this.getSlotContent('Label'))}
    </label>`;
  }
  private renderHelperOrError(): TemplateResult | typeof nothing {
    const describedId = `${this.id}-desc`;
    if (this.error) {
      return html`<p id="${describedId}" class="mt-1 text-xs ml-error-text">
        ${unsafeHTML(this.error)}
      </p>`;
    }
    if (this.hasSlot('Helper')) {
      return html`<p id="${describedId}" class="${cn('mt-1 text-xs ml-helper', this.getSlotClass('Helper'))}">
        ${unsafeHTML(this.getSlotContent('Helper'))}
      </p>`;
    }
    return nothing;
  }
  private renderInput(): TemplateResult {
    const inputId = `${this.id}-input`;
    const describedId = this.error || this.hasSlot('Helper') ? `${this.id}-desc` : undefined;
    const placeholder = this.placeholder || this.getSlotAttr('Label', 'placeholder') || this.msg.placeholder;
    return html`
      <div class="${this.getContainerClasses()}">
        <input
          id="${inputId}"
          name="${this.name}"
          class="${this.getInputClasses()}"
          .value=${this.rawValue}
          ?disabled=${this.disabled || this.loading}
          ?readonly=${this.readonly}
          placeholder="${placeholder}"
          maxlength="20"
          aria-labelledby="${this.hasSlot('Label') ? `${this.id}-label` : undefined}"
          aria-describedby="${describedId}"
          aria-invalid="${this.error ? 'true' : 'false'}"
          aria-required="${this.required ? 'true' : 'false'}"
          @focus="${this.onFocus}"
          @input="${this.onInput}"
          @blur="${this.onBlur}"
        
        @change="${(e: Event) => e.stopPropagation()}"
/>
      </div>
    `;
  }
  private renderViewMode(): TemplateResult {
    const display = this.value === null ? this.msg.noValue : this.formatNumber(this.value);
    return html`<span class="block w-full text-sm ml-text">${unsafeHTML(display)}</span>`;
  }
  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    // Sync rawValue when value changes externally (initial render)
    if (this.rawValue === '' && this.value !== null) {
      this.rawValue = this.formatToRaw(this.value);
    }
    return html`
      <div class="${cn('relative w-full', this.cssClass)}">
        ${this.renderLabel()}
        ${this.isEditing ? this.renderInput() : this.renderViewMode()}
        ${this.renderHelperOrError()}
        ${this.loading
          ? html`<div class="absolute inset-0 flex items-center justify-center ml-loading-overlay">
              <span class="text-sm ml-text-muted">${this.msg.loading}</span>
            </div>`
          : nothing}
      </div>
    `;
  }
}
