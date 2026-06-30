/// <mls fileReference="_102040_/l2/molecules/groupentermoney/ml-enter-money-br.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ENTER MONEY BR MOLECULE
// =============================================================================
// Skill Group: groupEnterMoney
// This molecule does NOT contain business logic.
import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  placeholder: '0,00',
  empty: '—',
  loading: 'Loading...',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: '0,00',
    empty: '—',
    loading: 'Carregando...',
  },
};
/// **collab_i18n_end**

@customElement('groupentermoney--ml-enter-money-br')
export class EnterMoneyBrMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // =========================================================================
  // SLOT TAGS
  // =========================================================================
  slotTags = ['Label', 'Helper'];

  // =========================================================================
  // PROPERTIES — From Contract
  // =========================================================================
  @propertyDataSource({ type: Number })
  value: number | null = null;

  @propertyDataSource({ type: String })
  error = '';

  @propertyDataSource({ type: String })
  name = '';

  @propertyDataSource({ type: String })
  currency = 'BRL';

  @propertyDataSource({ type: String })
  locale = 'pt-BR';

  @propertyDataSource({ type: Number })
  decimals = 2;

  @propertyDataSource({ type: Number })
  min: number | null = null;

  @propertyDataSource({ type: Number })
  max: number | null = null;

  @propertyDataSource({ type: Boolean, attribute: 'show-symbol' })
  showSymbol = false;

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

  // =========================================================================
  // INTERNAL STATE
  // =========================================================================
  @state()
  private rawValue = '';

  // =========================================================================
  // STATE CHANGE HANDLER
  // =========================================================================
  handleIcaStateChange(key: string, value: any) {
    const valueAttr = this.getAttribute('value');
    const localeAttr = this.getAttribute('locale');
    const decimalsAttr = this.getAttribute('decimals');
    if (valueAttr === `{{${key}}}` || localeAttr === `{{${key}}}` || decimalsAttr === `{{${key}}}`) {
      this.rawValue = this.formatNumberToRaw(value);
    }
    this.requestUpdate();
  }

  // =========================================================================
  // EVENT HANDLERS
  // =========================================================================
  private handleFocus(e: Event) {
    if (this.disabled || this.readonly || this.loading || !this.isEditing) return;
    const input = e.target as HTMLInputElement;
    input.select();
    this.dispatchEvent(
      new CustomEvent('focus', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleInput(e: Event) {
    if (this.disabled || this.readonly || this.loading || !this.isEditing) return;
    const input = e.target as HTMLInputElement;
    const digits = this.extractDigits(input.value);
    const parsed = this.parseDigitsToNumber(digits);
    this.value = parsed;
    this.rawValue = digits.length ? this.formatNumberToRaw(parsed) : '';
    this.dispatchEvent(
      new CustomEvent('input', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    );
  }

  private handleBlur() {
    if (this.disabled || this.readonly || this.loading || !this.isEditing) return;
    const digits = this.extractDigits(this.rawValue);
    let nextValue = this.parseDigitsToNumber(digits);
    if (nextValue === null) {
      this.value = null;
      this.rawValue = '';
    } else {
      nextValue = this.applyMinMax(nextValue);
      this.value = nextValue;
      this.rawValue = this.formatNumberToRaw(nextValue);
    }
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    );
    this.dispatchEvent(
      new CustomEvent('blur', {
        bubbles: true,
        composed: true,
      })
    );
  }

  // =========================================================================
  // HELPERS
  // =========================================================================
  private getLocale(): string {
    return this.locale || 'pt-BR';
  }

  private getDecimals(): number {
    return Number.isFinite(this.decimals) ? this.decimals : 2;
  }

  private extractDigits(value: string): string {
    return String(value || '').replace(/\D+/g, '');
  }

  private parseDigitsToNumber(digits: string): number | null {
    if (!digits) return null;
    const d = this.getDecimals();
    const intValue = parseInt(digits, 10);
    if (isNaN(intValue)) return null;
    if (d <= 0) return intValue;
    return intValue / Math.pow(10, d);
  }

  private formatNumberToRaw(value: number | null): string {
    if (value === null || value === undefined || isNaN(value)) return '';
    const formatter = new Intl.NumberFormat(this.getLocale(), {
      style: 'decimal',
      minimumFractionDigits: this.getDecimals(),
      maximumFractionDigits: this.getDecimals(),
    });
    return formatter.format(value);
  }

  private formatNumberToView(value: number | null): string {
    if (value === null || value === undefined || isNaN(value)) return this.msg.empty;
    const formatter = new Intl.NumberFormat(this.getLocale(), {
      style: 'decimal',
      minimumFractionDigits: this.getDecimals(),
      maximumFractionDigits: this.getDecimals(),
    });
    return formatter.format(value);
  }

  private applyMinMax(value: number): number {
    if (this.min !== null && value < this.min) return this.min;
    if (this.max !== null && value > this.max) return this.max;
    return value;
  }

  private getInputClasses(): string {
    const hasError = !!this.error;
    const isBlocked = this.disabled || this.loading;
    return [
      'w-full flex-1 bg-transparent outline-none text-sm ml-input',
      isBlocked ? 'cursor-not-allowed' : '',
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

  private renderLabel(labelId: string) {
    if (!this.hasSlot('Label')) return html``;
    return html`
      <label id=${labelId} class="${cn('mb-1 block text-sm ml-label', this.getSlotClass('Label'))}">
        ${unsafeHTML(this.getSlotContent('Label'))}
      </label>
    `;
  }

  private renderHelper(helperId: string) {
    if (this.error) {
      return html`
        <p id=${helperId} class="mt-1 text-xs ml-error-text">
          ${unsafeHTML(String(this.error))}
        </p>
      `;
    }
    if (this.hasSlot('Helper')) {
      return html`
        <p id=${helperId} class="${cn('mt-1 text-xs ml-helper', this.getSlotClass('Helper'))}">
          ${unsafeHTML(this.getSlotContent('Helper'))}
        </p>
      `;
    }
    return html``;
  }

  private renderLoading() {
    if (!this.loading) return html``;
    return html`
      <div class="mt-2 text-xs ml-text-muted">${this.msg.loading}</div>
    `;
  }

  // =========================================================================
  // RENDER
  // =========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    const labelId = `label-${this.id || 'enter-money-br'}`;
    const helperId = `helper-${this.id || 'enter-money-br'}`;

    if (!this.isEditing) {
      return html`
        <div class="${cn('w-full', this.cssClass)}">
          ${this.renderLabel(labelId)}
          <div
            class="text-sm ml-text"
            aria-labelledby=${labelId}
          >
            ${this.formatNumberToView(this.value)}
          </div>
        </div>
      `;
    }

    const placeholder = this.placeholder || this.msg.placeholder;
    const ariaInvalid = this.error ? 'true' : 'false';

    return html`
      <div class="${cn('w-full', this.cssClass)}">
        ${this.renderLabel(labelId)}
        <div class="${this.getContainerClasses()}">
          <input
            class=${this.getInputClasses()}
            type="text"
            inputmode="decimal"
            .value=${this.rawValue}
            placeholder=${placeholder}
            name=${this.name}
            ?disabled=${this.disabled || this.loading}
            ?readonly=${this.readonly}
            aria-labelledby=${this.hasSlot('Label') ? labelId : ''}
            aria-describedby=${this.error || this.hasSlot('Helper') ? helperId : ''}
            aria-invalid=${ariaInvalid}
            aria-required=${this.required ? 'true' : 'false'}
            @focus=${this.handleFocus}
            @input=${this.handleInput}
            @blur=${this.handleBlur}
          />
        </div>
        ${this.renderHelper(helperId)}
        ${this.renderLoading()}
      </div>
    `;
  }
}
