/// <mls fileReference="_102040_/l2/molecules/groupentertext/ml-phone-input.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// PHONE INPUT MOLECULE
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
  placeholder: '(00) 00000-0000',
  emptyValue: '—',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: '(00) 00000-0000',
    emptyValue: '—',
  },
};
/// **collab_i18n_end**

@customElement('groupentertext--ml-phone-input')
export class PhoneInputMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Helper', 'Prefix', 'Suffix'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================

  // Data
  @propertyDataSource({ type: String })
  value: string = '';

  @propertyDataSource({ type: String })
  error: string = '';

  @propertyDataSource({ type: String })
  name: string = '';

  // Configuration
  @propertyDataSource({ type: String })
  placeholder: string = '';

  @propertyDataSource({ type: Number, attribute: 'max-length' })
  maxLength: number | null = null;

  @propertyDataSource({ type: Number, attribute: 'min-length' })
  minLength: number | null = null;

  @propertyDataSource({ type: String })
  autocomplete: string = '';

  // States
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
  private isFocused: boolean = false;

  @state()
  private rawDisplay: string = '';

  private labelId = `phone-label-${Math.random().toString(36).substr(2, 9)}`;
  private errorId = `phone-error-${Math.random().toString(36).substr(2, 9)}`;

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  firstUpdated() {
    this.rawDisplay = this.formatPhoneNumber(this.value);
  }

  // ===========================================================================
  // STATE CHANGE HANDLER
  // ===========================================================================
  handleIcaStateChange(key: string, value: any) {
    const valueAttr = this.getAttribute('value');
    if (valueAttr === `{{${key}}}`) {
      this.rawDisplay = this.formatPhoneNumber(value || '');
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // FORMATTING HELPERS
  // ===========================================================================
  private extractDigits(input: string): string {
    // Bound props ({{...}}) resolve to undefined before the state is seeded.
    return String(input ?? '').replace(/\D/g, '');
  }

  private formatPhoneNumber(digits: string): string {
    const cleaned = this.extractDigits(digits);

    if (cleaned.length === 0) return '';
    if (cleaned.length <= 2) return `(${cleaned}`;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    if (cleaned.length <= 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleInput(e: Event) {
    e.stopPropagation();
    if (this.disabled || this.readonly || this.loading) return;

    const input = e.target as HTMLInputElement;
    const cursorPosition = input.selectionStart || 0;
    const previousLength = this.rawDisplay.length;

    let digits = this.extractDigits(input.value);

    // Apply maxLength constraint on digits
    const effectiveMaxLength = this.maxLength ?? 11;
    if (digits.length > effectiveMaxLength) {
      digits = digits.slice(0, effectiveMaxLength);
    }

    this.value = digits;
    this.rawDisplay = this.formatPhoneNumber(digits);

    // Restore cursor position after formatting
    requestAnimationFrame(() => {
      const newLength = this.rawDisplay.length;
      const diff = newLength - previousLength;
      let newPosition = cursorPosition + diff;

      // Ensure cursor doesn't go beyond input length
      newPosition = Math.max(0, Math.min(newPosition, newLength));
      input.setSelectionRange(newPosition, newPosition);
    });

    this.dispatchEvent(new CustomEvent('input', {
      bubbles: true,
      composed: true,
      detail: { value: this.value }
    }));
  }

  private handleChange(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value }
    }));
  }

  private handleFocus() {
    this.isFocused = true;
    this.dispatchEvent(new CustomEvent('focus', {
      bubbles: true,
      composed: true,
    }));
  }

  private handleBlur() {
    this.isFocused = false;
    this.dispatchEvent(new CustomEvent('blur', {
      bubbles: true,
      composed: true,
      detail: { value: this.value }
    }));
  }

  // ===========================================================================
  // CSS CLASSES
  // ===========================================================================
  private getContainerClasses(): string {
    return [
      'flex flex-col gap-1 w-full',
    ].join(' ');
  }

  private getInputWrapperClasses(): string {
    const hasError = this.error && this.error.length > 0;

    return [
      'flex items-center gap-2 w-full px-3 py-2 ml-input-container',
      hasError ? 'ml-input-container-error' : '',
      this.disabled || this.loading ? 'ml-disabled' : '',
    ].filter(Boolean).join(' ');
  }

  private getInputClasses(): string {
    return [
      'flex-1 bg-transparent border-none outline-none text-sm ml-input',
      this.disabled || this.loading ? 'cursor-not-allowed' : '',
      this.readonly ? 'cursor-default' : '',
    ].filter(Boolean).join(' ');
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;

    return html`
      <label id="${this.labelId}" class="${cn('text-sm ml-label', this.getSlotClass('Label'))}">
        ${unsafeHTML(this.getSlotContent('Label'))}
        ${this.required ? html`<span class="ml-error-text ml-0.5">*</span>` : html``}
      </label>
    `;
  }

  private renderPrefix(): TemplateResult {
    if (!this.hasSlot('Prefix')) return html``;

    return html`
      <span class="${cn('flex items-center ml-text-muted', this.getSlotClass('Prefix'))}">
        ${unsafeHTML(this.getSlotContent('Prefix'))}
      </span>
    `;
  }

  private renderSuffix(): TemplateResult {
    if (!this.hasSlot('Suffix')) return html``;

    return html`
      <span class="${cn('flex items-center ml-text-muted', this.getSlotClass('Suffix'))}">
        ${unsafeHTML(this.getSlotContent('Suffix'))}
      </span>
    `;
  }

  private renderLoadingIndicator(): TemplateResult {
    return html`
      <span class="h-4 w-4 animate-spin rounded-full ml-spinner"></span>
    `;
  }

  private renderFeedback(): TemplateResult {
    if (!this.isEditing) return html``;

    const hasError = this.error && this.error.length > 0;

    if (hasError) {
      return html`
        <p id="${this.errorId}" class="text-xs ml-error-text" role="alert">
          ${unsafeHTML(this.error)}
        </p>
      `;
    }

    if (this.hasSlot('Helper')) {
      return html`
        <p class="${cn('text-xs ml-helper', this.getSlotClass('Helper'))}">
          ${unsafeHTML(this.getSlotContent('Helper'))}
        </p>
      `;
    }

    return html``;
  }

  private renderViewMode(): TemplateResult {
    const displayValue = this.value
      ? this.formatPhoneNumber(this.value)
      : this.msg.emptyValue;

    return html`
      <div class="${cn(this.getContainerClasses(), this.cssClass)}">
        ${this.renderLabel()}
        <div class="flex items-center gap-2">
          ${this.renderPrefix()}
          <span class="text-sm ml-text">${displayValue}</span>
          ${this.renderSuffix()}
        </div>
      </div>
    `;
  }

  private renderEditMode(): TemplateResult {
    const hasError = this.error && this.error.length > 0;
    const placeholderText = this.placeholder || this.msg.placeholder;

    return html`
      <div class="${cn(this.getContainerClasses(), this.cssClass)}">
        ${this.renderLabel()}
        <div class="${this.getInputWrapperClasses()}">
          ${this.renderPrefix()}
          <input
            type="tel"
            class="${this.getInputClasses()}"
            .value="${this.rawDisplay}"
            placeholder="${placeholderText}"
            ?disabled="${this.disabled || this.loading}"
            ?readonly="${this.readonly}"
            ?required="${this.required}"
            autocomplete="${this.autocomplete || 'tel'}"
            name="${this.name}"
            aria-labelledby="${this.hasSlot('Label') ? this.labelId : ''}"
            aria-describedby="${hasError ? this.errorId : ''}"
            aria-invalid="${hasError ? 'true' : 'false'}"
            aria-required="${this.required ? 'true' : 'false'}"
            @input="${this.handleInput}"
            @change="${this.handleChange}"
            @focus="${this.handleFocus}"
            @blur="${this.handleBlur}"
          />
          ${this.loading ? this.renderLoadingIndicator() : html``}
          ${this.renderSuffix()}
        </div>
        ${this.renderFeedback()}
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
      return this.renderViewMode();
    }

    return this.renderEditMode();
  }
}
