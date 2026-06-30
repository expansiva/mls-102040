/// <mls fileReference="_102040_/l2/molecules/groupentertext/ml-password-strength-input.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// PASSWORD STRENGTH INPUT MOLECULE
// =============================================================================
// Skill Group: groupEnterText
// This molecule does NOT contain business logic.

import { html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  placeholder: 'Enter password',
  emptyValue: '—',
  maskedValue: '••••••••',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  strengthWeak: 'Weak',
  strengthMedium: 'Medium',
  strengthStrong: 'Strong',
  strengthVeryStrong: 'Very Strong',
  criteriaMinLength: 'Minimum length',
  criteriaUppercase: 'Uppercase letter',
  criteriaNumber: 'Number',
  criteriaSymbol: 'Symbol',
  loading: 'Loading...',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: 'Digite a senha',
    emptyValue: '—',
    maskedValue: '••••••••',
    showPassword: 'Mostrar senha',
    hidePassword: 'Ocultar senha',
    strengthWeak: 'Fraca',
    strengthMedium: 'Média',
    strengthStrong: 'Forte',
    strengthVeryStrong: 'Muito Forte',
    criteriaMinLength: 'Comprimento mínimo',
    criteriaUppercase: 'Letra maiúscula',
    criteriaNumber: 'Número',
    criteriaSymbol: 'Símbolo',
    loading: 'Carregando...',
  },
};
/// **collab_i18n_end**

type StrengthLevel = 'weak' | 'medium' | 'strong' | 'veryStrong';

interface CriteriaStatus {
  minLength: boolean;
  uppercase: boolean;
  number: boolean;
  symbol: boolean;
}

@customElement('groupentertext--ml-password-strength-input')
export class PasswordStrengthInputMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Helper', 'Prefix', 'Suffix'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: String })
  value: string = '';

  @propertyDataSource({ type: String })
  error: string = '';

  @propertyDataSource({ type: String })
  name: string = '';

  @propertyDataSource({ type: String })
  placeholder: string = '';

  @propertyDataSource({ type: Number, attribute: 'max-length' })
  maxLength: number | null = null;

  @propertyDataSource({ type: Number, attribute: 'min-length' })
  minLength: number | null = null;

  @propertyDataSource({ type: Number })
  rows: number = 1;

  @propertyDataSource({ type: String })
  autocomplete: string = '';

  @propertyDataSource({ type: String, attribute: 'input-type' })
  inputType: string = 'password';

  @propertyDataSource({ type: String })
  mask: string = '';

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
  private isPasswordVisible: boolean = false;

  @state()
  private isFocused: boolean = false;

  @state()
  private rawDisplay: string = '';

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  firstUpdated() {
    this.rawDisplay = this.applyMask(this.value);
  }

  // ===========================================================================
  // STATE CHANGE HANDLER
  // ===========================================================================
  handleIcaStateChange(key: string, value: any) {
    const valueAttr = this.getAttribute('value');
    if (valueAttr === `{{${key}}}`) {
      this.rawDisplay = this.applyMask(value || '');
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // MASK LOGIC
  // ===========================================================================
  private applyMask(rawValue: string): string {
    if (!this.mask || !rawValue) return rawValue;

    let result = '';
    let rawIndex = 0;

    for (let i = 0; i < this.mask.length && rawIndex < rawValue.length; i++) {
      const maskChar = this.mask[i];
      const inputChar = rawValue[rawIndex];

      if (maskChar === '#') {
        if (/\d/.test(inputChar)) {
          result += inputChar;
          rawIndex++;
        } else {
          rawIndex++;
          i--;
        }
      } else if (maskChar === 'A') {
        if (/[a-zA-Z]/.test(inputChar)) {
          result += inputChar;
          rawIndex++;
        } else {
          rawIndex++;
          i--;
        }
      } else if (maskChar === '*') {
        result += inputChar;
        rawIndex++;
      } else {
        result += maskChar;
      }
    }

    return result;
  }

  private extractRawValue(maskedValue: string): string {
    if (!this.mask) return maskedValue;

    let raw = '';
    let maskIndex = 0;

    for (let i = 0; i < maskedValue.length && maskIndex < this.mask.length; i++) {
      const maskChar = this.mask[maskIndex];
      const inputChar = maskedValue[i];

      if (maskChar === '#' || maskChar === 'A' || maskChar === '*') {
        raw += inputChar;
        maskIndex++;
      } else {
        if (inputChar === maskChar) {
          maskIndex++;
        }
      }
    }

    return raw;
  }

  // ===========================================================================
  // STRENGTH CALCULATION
  // ===========================================================================
  private getCriteriaStatus(): CriteriaStatus {
    const val = this.value || '';
    return {
      minLength: this.minLength === null || val.length >= this.minLength,
      uppercase: /[A-Z]/.test(val),
      number: /\d/.test(val),
      symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(val),
    };
  }

  private getStrengthLevel(criteria: CriteriaStatus): StrengthLevel {
    const metCount = Object.values(criteria).filter(Boolean).length;

    if (metCount <= 1) return 'weak';
    if (metCount === 2) return 'medium';
    if (metCount === 3) return 'strong';
    return 'veryStrong';
  }

  private getStrengthLabel(level: StrengthLevel): string {
    switch (level) {
      case 'weak':
        return this.msg.strengthWeak;
      case 'medium':
        return this.msg.strengthMedium;
      case 'strong':
        return this.msg.strengthStrong;
      case 'veryStrong':
        return this.msg.strengthVeryStrong;
    }
  }

  private getStrengthBarClasses(level: StrengthLevel): string {
    const baseClasses = 'h-2 rounded-full transition-all duration-300';
    const widthMap: Record<StrengthLevel, string> = {
      weak: 'w-1/4',
      medium: 'w-2/4',
      strong: 'w-3/4',
      veryStrong: 'w-full',
    };
    const colorMap: Record<StrengthLevel, string> = {
      weak: 'ml-strength-weak',
      medium: 'ml-strength-fair',
      strong: 'ml-strength-strong',
      veryStrong: 'ml-strength-strong',
    };

    return [baseClasses, widthMap[level], colorMap[level]].join(' ');
  }

  private getStrengthTextClasses(level: StrengthLevel): string {
    const colorMap: Record<StrengthLevel, string> = {
      weak: 'ml-strength-weak-text',
      medium: 'ml-strength-fair-text',
      strong: 'ml-strength-strong-text',
      veryStrong: 'ml-strength-strong-text',
    };
    return ['text-xs font-medium', colorMap[level]].join(' ');
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleInput(e: Event) {
    if (this.disabled || this.readonly || this.loading) return;

    const input = e.target as HTMLInputElement;
    let newValue = input.value;

    if (this.mask) {
      const rawValue = this.extractRawValue(newValue);
      if (this.maxLength !== null && rawValue.length > this.maxLength) {
        return;
      }
      this.value = rawValue;
      this.rawDisplay = this.applyMask(rawValue);
    } else {
      if (this.maxLength !== null && newValue.length > this.maxLength) {
        newValue = newValue.slice(0, this.maxLength);
      }
      this.value = newValue;
      this.rawDisplay = newValue;
    }

    this.dispatchEvent(
      new CustomEvent('input', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    );
  }

  private handleChange() {
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
      new CustomEvent('focus', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleBlur() {
    this.isFocused = false;
    this.handleChange();
    this.dispatchEvent(
      new CustomEvent('blur', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private togglePasswordVisibility() {
    if (this.disabled || this.loading) return;
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  // ===========================================================================
  // CSS CLASSES
  // ===========================================================================
  private getContainerClasses(): string {
    return [
      'w-full',
      this.disabled ? 'ml-disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getInputWrapperClasses(): string {
    const hasError = !!this.error;

    return [
      'flex items-center w-full rounded-lg transition-all duration-200 ml-input-container',
      hasError ? 'ml-input-container-error' : '',
      this.disabled || this.loading
        ? 'cursor-not-allowed'
        : this.readonly
        ? 'cursor-default'
        : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getInputClasses(): string {
    return [
      'flex-1 w-full px-3 py-2 text-sm bg-transparent border-none outline-none ml-input',
      this.disabled || this.loading ? 'cursor-not-allowed' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getToggleButtonClasses(): string {
    return [
      'flex items-center justify-center w-10 h-10 rounded-r-lg transition-colors ml-text-faint',
      this.disabled || this.loading
        ? 'cursor-not-allowed'
        : 'cursor-pointer',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getCriteriaItemClasses(isMet: boolean): string {
    return [
      'flex items-center gap-2 text-xs',
      isMet ? 'ml-strength-strong-text' : 'ml-text-faint',
    ].join(' ');
  }

  // ===========================================================================
  // RENDER METHODS
  // ===========================================================================
  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;

    return html`
      <label
        class="${cn('block mb-1.5 text-sm font-medium ml-label', this.getSlotClass('Label'))}"
        id="label-${this.name}"
      >
        ${unsafeHTML(this.getSlotContent('Label'))}
        ${this.required
          ? html`<span class="ml-error-text ml-0.5">*</span>`
          : html``}
      </label>
    `;
  }

  private renderPrefix(): TemplateResult {
    if (!this.hasSlot('Prefix')) return html``;

    return html`
      <span class="${cn('flex items-center pl-3 ml-text-faint', this.getSlotClass('Prefix'))}">
        ${unsafeHTML(this.getSlotContent('Prefix'))}
      </span>
    `;
  }

  private renderSuffix(): TemplateResult {
    if (!this.hasSlot('Suffix')) return html``;

    return html`
      <span class="${cn('flex items-center pr-1 ml-text-faint', this.getSlotClass('Suffix'))}">
        ${unsafeHTML(this.getSlotContent('Suffix'))}
      </span>
    `;
  }

  private renderToggleButton(): TemplateResult {
    if (this.rows > 1 || this.readonly) return html``;

    const iconPath = this.isPasswordVisible
      ? 'M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
      : 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z';

    return html`
      <button
        type="button"
        class=${this.getToggleButtonClasses()}
        @click=${this.togglePasswordVisibility}
        ?disabled=${this.disabled || this.loading}
        aria-label=${this.isPasswordVisible
          ? this.msg.hidePassword
          : this.msg.showPassword}
        tabindex="-1"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d=${iconPath}
          />
        </svg>
      </button>
    `;
  }

  private renderInput(): TemplateResult {
    const placeholderText = this.placeholder || this.msg.placeholder;
    const inputType = this.isPasswordVisible ? 'text' : 'password';
    const displayValue = this.mask ? this.rawDisplay : this.value;

    return html`
      <div class=${this.getInputWrapperClasses()}>
        ${this.renderPrefix()}
        <input
          type=${inputType}
          class=${this.getInputClasses()}
          .value=${displayValue}
          placeholder=${placeholderText}
          ?disabled=${this.disabled || this.loading}
          ?readonly=${this.readonly}
          ?required=${this.required}
          name=${this.name}
          autocomplete=${this.autocomplete || 'off'}
          aria-labelledby=${this.hasSlot('Label') ? `label-${this.name}` : ''}
          aria-describedby=${this.error ? `error-${this.name}` : ''}
          aria-invalid=${this.error ? 'true' : 'false'}
          aria-required=${this.required ? 'true' : 'false'}
          @input=${this.handleInput}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
        />
        ${this.renderSuffix()}
        ${this.renderToggleButton()}
      </div>
    `;
  }

  private renderStrengthIndicator(): TemplateResult {
    if (this.loading) return html``;

    const criteria = this.getCriteriaStatus();
    const level = this.getStrengthLevel(criteria);

    return html`
      <div class="mt-3 space-y-2">
        <div class="flex items-center gap-3">
          <div
            class="flex-1 h-2 rounded-full ml-strength-track overflow-hidden"
          >
            <div class=${this.getStrengthBarClasses(level)}></div>
          </div>
          <span class=${this.getStrengthTextClasses(level)}>
            ${this.getStrengthLabel(level)}
          </span>
        </div>
        <div class="grid grid-cols-2 gap-1">
          ${this.renderCriteriaItem(
            criteria.minLength,
            this.minLength !== null
              ? `${this.msg.criteriaMinLength} (${this.minLength})`
              : this.msg.criteriaMinLength
          )}
          ${this.renderCriteriaItem(
            criteria.uppercase,
            this.msg.criteriaUppercase
          )}
          ${this.renderCriteriaItem(criteria.number, this.msg.criteriaNumber)}
          ${this.renderCriteriaItem(criteria.symbol, this.msg.criteriaSymbol)}
        </div>
      </div>
    `;
  }

  private renderCriteriaItem(isMet: boolean, label: string): TemplateResult {
    const iconPath = isMet
      ? 'M4.5 12.75l6 6 9-13.5'
      : 'M6 18L18 6M6 6l12 12';

    return html`
      <div class=${this.getCriteriaItemClasses(isMet)}>
        <svg
          class="w-3.5 h-3.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d=${iconPath}
          />
        </svg>
        <span>${label}</span>
      </div>
    `;
  }

  private renderHelper(): TemplateResult {
    if (!this.hasSlot('Helper')) return html``;

    return html`
      <p class="${cn('mt-1.5 text-xs ml-helper', this.getSlotClass('Helper'))}">
        ${unsafeHTML(this.getSlotContent('Helper'))}
      </p>
    `;
  }

  private renderError(): TemplateResult {
    if (!this.error) return html``;

    return html`
      <p
        class="mt-1.5 text-xs ml-error-text"
        id="error-${this.name}"
        role="alert"
      >
        ${unsafeHTML(String(this.error))}
      </p>
    `;
  }

  private renderLoading(): TemplateResult {
    return html`
      <div class="flex items-center justify-center py-4">
        <svg
          class="w-5 h-5 animate-spin ml-spinner"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span class="ml-2 text-sm ml-text-muted">
          ${this.msg.loading}
        </span>
      </div>
    `;
  }

  private renderViewMode(): TemplateResult {
    const displayValue = this.value
      ? this.msg.maskedValue
      : this.msg.emptyValue;

    return html`
      <div class="flex items-center gap-2">
        ${this.renderPrefix()}
        <span class="text-sm ml-text">
          ${displayValue}
        </span>
        ${this.renderSuffix()}
      </div>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    if (!this.isEditing) {
      return html`
        <div class=${cn(this.getContainerClasses(), this.cssClass)}>
          ${this.renderLabel()} ${this.renderViewMode()}
        </div>
      `;
    }

    if (this.loading) {
      return html`
        <div class=${cn(this.getContainerClasses(), this.cssClass)}>
          ${this.renderLabel()} ${this.renderLoading()}
        </div>
      `;
    }

    return html`
      <div class=${cn(this.getContainerClasses(), this.cssClass)}>
        ${this.renderLabel()} ${this.renderInput()}
        ${this.renderStrengthIndicator()}
        ${this.error ? this.renderError() : this.renderHelper()}
      </div>
    `;
  }
}
