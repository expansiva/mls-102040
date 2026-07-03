/// <mls fileReference="_102040_/l2/molecules/groupentertext/ml-address-field.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ADDRESS FIELD MOLECULE
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
  postalCodeLabel: 'Postal Code',
  streetLabel: 'Street',
  numberLabel: 'Number',
  complementLabel: 'Complement',
  neighborhoodLabel: 'Neighborhood',
  cityLabel: 'City',
  stateLabel: 'State',
  loading: 'Loading...',
  searching: 'Searching address...',
  emptyValue: '—',
  secureValue: '••••••••',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    postalCodeLabel: 'CEP',
    streetLabel: 'Rua',
    numberLabel: 'Número',
    complementLabel: 'Complemento',
    neighborhoodLabel: 'Bairro',
    cityLabel: 'Cidade',
    stateLabel: 'Estado',
    loading: 'Carregando...',
    searching: 'Buscando endereço...',
    emptyValue: '—',
    secureValue: '••••••••',
  },
};
/// **collab_i18n_end**

interface AddressData {
  postalCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

@customElement('groupentertext--ml-address-field')
export class MlAddressFieldMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Helper', 'Prefix', 'Suffix'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================

  // Address values
  @propertyDataSource({ type: String, attribute: 'postal-code' })
  postalCode: string = '';

  @propertyDataSource({ type: String })
  street: string = '';

  @propertyDataSource({ type: String })
  number: string = '';

  @propertyDataSource({ type: String })
  complement: string = '';

  @propertyDataSource({ type: String })
  neighborhood: string = '';

  @propertyDataSource({ type: String })
  city: string = '';

  @propertyDataSource({ type: String, attribute: 'state-code' })
  stateCode: string = '';

  // Error messages for each field
  @propertyDataSource({ type: String, attribute: 'postal-code-error' })
  postalCodeError: string = '';

  @propertyDataSource({ type: String, attribute: 'street-error' })
  streetError: string = '';

  @propertyDataSource({ type: String, attribute: 'number-error' })
  numberError: string = '';

  @propertyDataSource({ type: String, attribute: 'complement-error' })
  complementError: string = '';

  @propertyDataSource({ type: String, attribute: 'neighborhood-error' })
  neighborhoodError: string = '';

  @propertyDataSource({ type: String, attribute: 'city-error' })
  cityError: string = '';

  @propertyDataSource({ type: String, attribute: 'state-error' })
  stateError: string = '';

  // Configuration
  @propertyDataSource({ type: String })
  name: string = '';

  @propertyDataSource({ type: String, attribute: 'postal-code-mask' })
  postalCodeMask: string = '#####-###';

  @propertyDataSource({ type: Number, attribute: 'postal-code-length' })
  postalCodeLength: number = 8;

  @propertyDataSource({ type: Number, attribute: 'street-max-length' })
  streetMaxLength: number | null = null;

  @propertyDataSource({ type: Number, attribute: 'number-max-length' })
  numberMaxLength: number | null = null;

  @propertyDataSource({ type: Number, attribute: 'complement-max-length' })
  complementMaxLength: number | null = null;

  @propertyDataSource({ type: Number, attribute: 'neighborhood-max-length' })
  neighborhoodMaxLength: number | null = null;

  @propertyDataSource({ type: Number, attribute: 'city-max-length' })
  cityMaxLength: number | null = null;

  @propertyDataSource({ type: Number, attribute: 'complement-rows' })
  complementRows: number = 1;

  // States
  @propertyDataSource({ type: Boolean, attribute: 'is-editing' })
  isEditing: boolean = true;

  @propertyDataSource({ type: Boolean })
  disabled: boolean = false;

  @propertyDataSource({ type: Boolean })
  readonly: boolean = false;

  @propertyDataSource({ type: Boolean })
  loading: boolean = false;

  @propertyDataSource({ type: Boolean, attribute: 'postal-code-required' })
  postalCodeRequired: boolean = false;

  @propertyDataSource({ type: Boolean, attribute: 'street-required' })
  streetRequired: boolean = false;

  @propertyDataSource({ type: Boolean, attribute: 'number-required' })
  numberRequired: boolean = false;

  @propertyDataSource({ type: Boolean, attribute: 'neighborhood-required' })
  neighborhoodRequired: boolean = false;

  @propertyDataSource({ type: Boolean, attribute: 'city-required' })
  cityRequired: boolean = false;

  @propertyDataSource({ type: Boolean, attribute: 'state-required' })
  stateRequired: boolean = false;

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private postalCodeDisplay: string = '';

  @state()
  private isSearching: boolean = false;

  @state()
  private focusedField: string | null = null;

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  firstUpdated() {
    this.postalCodeDisplay = this.applyMask(this.postalCode, this.postalCodeMask);
  }

  // ===========================================================================
  // STATE CHANGE HANDLER
  // ===========================================================================
  handleIcaStateChange(key: string, value: any) {
    const postalCodeAttr = this.getAttribute('postal-code');
    if (postalCodeAttr === `{{${key}}}`) {
      this.postalCodeDisplay = this.applyMask(value || '', this.postalCodeMask);
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // MASK HELPERS
  // ===========================================================================
  private applyMask(raw: string, mask: string): string {
    if (!mask || !raw) return raw;
    
    let result = '';
    let rawIndex = 0;
    
    for (let i = 0; i < mask.length && rawIndex < raw.length; i++) {
      const maskChar = mask[i];
      const rawChar = raw[rawIndex];
      
      if (maskChar === '#') {
        if (/\d/.test(rawChar)) {
          result += rawChar;
          rawIndex++;
        } else {
          rawIndex++;
          i--;
        }
      } else if (maskChar === 'A') {
        if (/[a-zA-Z]/.test(rawChar)) {
          result += rawChar;
          rawIndex++;
        } else {
          rawIndex++;
          i--;
        }
      } else if (maskChar === '*') {
        result += rawChar;
        rawIndex++;
      } else {
        result += maskChar;
      }
    }
    
    return result;
  }

  private extractRaw(masked: string, mask: string): string {
    if (!mask) return masked;
    
    let raw = '';
    let maskIndex = 0;
    
    for (let i = 0; i < masked.length && maskIndex < mask.length; i++) {
      const maskChar = mask[maskIndex];
      const inputChar = masked[i];
      
      if (maskChar === '#' || maskChar === 'A' || maskChar === '*') {
        raw += inputChar;
        maskIndex++;
      } else if (inputChar === maskChar) {
        maskIndex++;
      }
    }
    
    return raw;
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handlePostalCodeInput(e: Event) {
    if (this.disabled || this.readonly || this.loading) return;
    
    const input = e.target as HTMLInputElement;
    const rawValue = input.value.replace(/\D/g, '');
    
    if (this.postalCodeLength && rawValue.length > this.postalCodeLength) {
      return;
    }
    
    this.postalCode = rawValue;
    this.postalCodeDisplay = this.applyMask(rawValue, this.postalCodeMask);
    
    this.dispatchEvent(new CustomEvent('input', {
      bubbles: true,
      composed: true,
      detail: { field: 'postalCode', value: rawValue }
    }));
    
    if (rawValue.length === this.postalCodeLength) {
      this.triggerAddressLookup(rawValue);
    }
  }

  private handleFieldInput(field: keyof AddressData, maxLength: number | null, e: Event) {
    if (this.disabled || this.readonly || this.loading) return;
    
    const input = e.target as HTMLInputElement | HTMLTextAreaElement;
    let value = input.value;
    
    if (maxLength !== null && value.length > maxLength) {
      value = value.substring(0, maxLength);
      input.value = value;
    }
    
    (this as any)[field] = value;
    
    this.dispatchEvent(new CustomEvent('input', {
      bubbles: true,
      composed: true,
      detail: { field, value }
    }));
  }

  private handleFieldBlur(field: string) {
    this.focusedField = null;
    
    this.dispatchEvent(new CustomEvent('blur', {
      bubbles: true,
      composed: true,
      detail: { field, value: (this as any)[field] }
    }));
    
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { field, value: (this as any)[field] }
    }));
  }

  private handleFieldFocus(field: string) {
    this.focusedField = field;
    
    this.dispatchEvent(new CustomEvent('focus', {
      bubbles: true,
      composed: true,
      detail: { field }
    }));
  }

  private triggerAddressLookup(postalCode: string) {
    this.isSearching = true;
    
    this.dispatchEvent(new CustomEvent('address-lookup', {
      bubbles: true,
      composed: true,
      detail: { postalCode }
    }));
  }

  private confirmAddress() {
    const address: AddressData = {
      postalCode: this.postalCode,
      street: this.street,
      number: this.number,
      complement: this.complement,
      neighborhood: this.neighborhood,
      city: this.city,
      state: this.stateCode,
    };
    
    this.dispatchEvent(new CustomEvent('address-confirmed', {
      bubbles: true,
      composed: true,
      detail: { address }
    }));
  }

  // ===========================================================================
  // CSS HELPERS
  // ===========================================================================
  private getInputClasses(hasError: boolean, isFocused: boolean): string {
    return [
      'w-full rounded-lg px-3 py-2 text-sm transition ml-input ml-input-container',
      hasError ? 'ml-input-container-error' : '',
      this.disabled ? 'ml-disabled' : '',
      this.readonly ? 'cursor-default' : '',
    ].filter(Boolean).join(' ');
  }

  private getLabelClasses(): string {
    return 'block text-sm font-medium mb-1 ml-label';
  }

  private getErrorClasses(): string {
    return 'mt-1 text-xs ml-error-text';
  }

  private getHelperClasses(): string {
    return 'mt-1 text-xs ml-helper';
  }

  private getViewValueClasses(): string {
    return 'text-sm ml-text';
  }

  private getCounterClasses(): string {
    return 'mt-1 text-xs ml-text-muted text-right';
  }

  private getContainerClasses(): string {
    return [
      'relative',
      this.loading ? 'opacity-70 pointer-events-none' : '',
    ].filter(Boolean).join(' ');
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderLabel(text: string, required: boolean): TemplateResult {
    return html`
      <label class="${this.getLabelClasses()}">
        ${text}
        ${required ? html`<span class="ml-error-text">*</span>` : html``}
      </label>
    `;
  }

  private renderViewValue(value: string): TemplateResult {
    const displayValue = value || this.msg.emptyValue;
    return html`<span class="${this.getViewValueClasses()}">${displayValue}</span>`;
  }

  private renderError(error: string): TemplateResult {
    if (!error) return html``;
    return html`<p class="${this.getErrorClasses()}">${unsafeHTML(error)}</p>`;
  }

  private renderCounter(value: string, maxLength: number | null): TemplateResult {
    if (maxLength === null) return html``;
    return html`
      <p class="${this.getCounterClasses()}" aria-live="polite">
        ${String(value ?? '').length} / ${maxLength}
      </p>
    `;
  }

  private renderInput(
    field: string,
    value: string,
    label: string,
    required: boolean,
    error: string,
    maxLength: number | null,
    placeholder: string = ''
  ): TemplateResult {
    const isFocused = this.focusedField === field;
    const hasError = !!error;
    const inputId = `${this.name}-${field}`;
    const errorId = `${inputId}-error`;
    
    if (!this.isEditing) {
      return html`
        <div class="mb-4">
          ${this.renderLabel(label, required)}
          ${this.renderViewValue(value)}
        </div>
      `;
    }
    
    return html`
      <div class="mb-4">
        ${this.renderLabel(label, required)}
        <input
          type="text"
          id="${inputId}"
          class="${this.getInputClasses(hasError, isFocused)}"
          .value="${value}"
          placeholder="${placeholder}"
          ?disabled="${this.disabled}"
          ?readonly="${this.readonly}"
          aria-required="${required}"
          aria-invalid="${hasError}"
          aria-describedby="${hasError ? errorId : ''}"
          maxlength="${maxLength !== null ? maxLength : ''}"
          @input="${(e: Event) => this.handleFieldInput(field as keyof AddressData, maxLength, e)}"
          @blur="${() => this.handleFieldBlur(field)}"
          @focus="${() => this.handleFieldFocus(field)}"
        />
        ${this.renderError(error)}
      </div>
    `;
  }

  private renderTextarea(
    field: string,
    value: string,
    label: string,
    required: boolean,
    error: string,
    maxLength: number | null,
    rows: number,
    placeholder: string = ''
  ): TemplateResult {
    const isFocused = this.focusedField === field;
    const hasError = !!error;
    const inputId = `${this.name}-${field}`;
    const errorId = `${inputId}-error`;
    const counterId = `${inputId}-counter`;
    
    if (!this.isEditing) {
      return html`
        <div class="mb-4">
          ${this.renderLabel(label, required)}
          ${this.renderViewValue(value)}
        </div>
      `;
    }
    
    return html`
      <div class="mb-4">
        ${this.renderLabel(label, required)}
        <textarea
          id="${inputId}"
          class="${this.getInputClasses(hasError, isFocused)} resize-none"
          .value="${value}"
          placeholder="${placeholder}"
          rows="${rows}"
          ?disabled="${this.disabled}"
          ?readonly="${this.readonly}"
          aria-required="${required}"
          aria-invalid="${hasError}"
          aria-describedby="${hasError ? errorId : counterId}"
          maxlength="${maxLength !== null ? maxLength : ''}"
          @input="${(e: Event) => this.handleFieldInput(field as keyof AddressData, maxLength, e)}"
          @blur="${() => this.handleFieldBlur(field)}"
          @focus="${() => this.handleFieldFocus(field)}"
        ></textarea>
        ${this.renderCounter(value, maxLength)}
        ${this.renderError(error)}
      </div>
    `;
  }

  private renderPostalCodeField(): TemplateResult {
    const isFocused = this.focusedField === 'postalCode';
    const hasError = !!this.postalCodeError;
    const inputId = `${this.name}-postalCode`;
    const errorId = `${inputId}-error`;
    
    if (!this.isEditing) {
      return html`
        <div class="mb-4">
          ${this.renderLabel(this.msg.postalCodeLabel, this.postalCodeRequired)}
          ${this.renderViewValue(this.postalCodeDisplay || this.postalCode)}
        </div>
      `;
    }
    
    return html`
      <div class="mb-4">
        ${this.renderLabel(this.msg.postalCodeLabel, this.postalCodeRequired)}
        <div class="relative">
          <input
            type="text"
            id="${inputId}"
            class="${this.getInputClasses(hasError, isFocused)}"
            .value="${this.postalCodeDisplay}"
            ?disabled="${this.disabled}"
            ?readonly="${this.readonly}"
            aria-required="${this.postalCodeRequired}"
            aria-invalid="${hasError}"
            aria-describedby="${hasError ? errorId : ''}"
            @input="${this.handlePostalCodeInput}"
            @blur="${() => this.handleFieldBlur('postalCode')}"
            @focus="${() => this.handleFieldFocus('postalCode')}"
          />
          ${this.isSearching ? html`
            <div class="absolute right-3 top-1/2 -translate-y-1/2">
              <svg class="animate-spin h-4 w-4 ml-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ` : html``}
        </div>
        ${this.renderError(this.postalCodeError)}
      </div>
    `;
  }

  private renderLoadingOverlay(): TemplateResult {
    if (!this.loading) return html``;
    
    return html`
      <div class="absolute inset-0 flex items-center justify-center rounded-lg z-10 ml-loading-overlay">
        <div class="flex items-center gap-2 ml-text-muted">
          <svg class="animate-spin h-5 w-5 ml-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm">${this.msg.loading}</span>
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

    return html`
      <div class="${cn(this.getContainerClasses(), this.cssClass)}">
        ${this.renderLoadingOverlay()}

        <div class="space-y-4">
          <!-- Postal Code -->
          ${this.renderPostalCodeField()}
          
          <!-- Street -->
          ${this.renderInput(
            'street',
            this.street,
            this.msg.streetLabel,
            this.streetRequired,
            this.streetError,
            this.streetMaxLength
          )}
          
          <!-- Number and Complement Row -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              ${this.renderInput(
                'number',
                this.number,
                this.msg.numberLabel,
                this.numberRequired,
                this.numberError,
                this.numberMaxLength
              )}
            </div>
            <div>
              ${this.complementRows > 1
                ? this.renderTextarea(
                    'complement',
                    this.complement,
                    this.msg.complementLabel,
                    false,
                    this.complementError,
                    this.complementMaxLength,
                    this.complementRows
                  )
                : this.renderInput(
                    'complement',
                    this.complement,
                    this.msg.complementLabel,
                    false,
                    this.complementError,
                    this.complementMaxLength
                  )
              }
            </div>
          </div>
          
          <!-- Neighborhood -->
          ${this.renderInput(
            'neighborhood',
            this.neighborhood,
            this.msg.neighborhoodLabel,
            this.neighborhoodRequired,
            this.neighborhoodError,
            this.neighborhoodMaxLength
          )}
          
          <!-- City and State Row -->
          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-2">
              ${this.renderInput(
                'city',
                this.city,
                this.msg.cityLabel,
                this.cityRequired,
                this.cityError,
                this.cityMaxLength
              )}
            </div>
            <div>
              ${this.renderInput(
                'stateCode',
                this.stateCode,
                this.msg.stateLabel,
                this.stateRequired,
                this.stateError,
                2
              )}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
