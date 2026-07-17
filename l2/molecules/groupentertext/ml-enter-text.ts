/// <mls fileReference="_102040_/l2/molecules/groupentertext/ml-enter-text.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// GROUP ENTER TEXT – ML ENTER TEXT MOLECULE
// =============================================================================
// Skill Group: groupEnterText (Data Entry)
// This molecule does NOT contain business logic.

import { html, nothing, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, property, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  placeholder: 'Select an option',
  noResults: 'No results found',
  loading: 'Loading...',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  // other locales could be added here
};
/// **collab_i18n_end**

@customElement('groupentertext--ml-enter-text')
export class MlEnterTextMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Helper', 'Prefix', 'Suffix'];

  // ===========================================================================
  // PROPERTIES – From Contract
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

  @propertyDataSource({ type: String })
  inputType: string = 'text';

  @propertyDataSource({ type: String })
  mask: string = '';

  @propertyDataSource({ type: Boolean, attribute: 'is-editing' })
  isEditing: boolean = true;

  @propertyDataSource({ type: Boolean, attribute: 'disabled' })
  disabled: boolean = false;

  @propertyDataSource({ type: Boolean, attribute: 'readonly' })
  readonly: boolean = false;

  @propertyDataSource({ type: Boolean, attribute: 'required' })
  required: boolean = false;

  @propertyDataSource({ type: Boolean, attribute: 'loading' })
  loading: boolean = false;

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private rawDisplay: string = '';

  @state()
  private isFocused: boolean = false;

  // ===========================================================================
  // STATE CHANGE HANDLER – derived state from value
  // ===========================================================================
  handleIcaStateChange(key: string, value: any) {
    const valueAttr = this.getAttribute('value');
    if (valueAttr === `{{${key}}}`) {
      this.updateRawDisplay(value);
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // Lit updated hook – also keep derived state in sync for direct bindings
  // ===========================================================================
  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('value')) {
      this.updateRawDisplay(this.value);
    }
  }

  // ===========================================================================
  // HELPERS – mask handling & CSS classes
  // ===========================================================================
  private updateRawDisplay(raw: string) {
    // Bound props ({{...}}) resolve to undefined before the state is seeded.
    raw = String(raw ?? '');
    if (this.mask) {
      this.rawDisplay = this.applyMask(raw);
    } else {
      this.rawDisplay = raw;
    }
  }

  private stripMask(display: string): string {
    // Remove all characters that are not alphanumeric – simple approach
    return display.replace(/[^a-zA-Z0-9]/g, '');
  }

  private applyMask(raw: string): string {
    if (!this.mask) return raw;
    let result = '';
    let rawIdx = 0;
    for (const ch of this.mask) {
      if (rawIdx >= raw.length) break;
      if (ch === '#') {
        // digit only – if not a digit, skip
        const digit = raw[rawIdx].match(/\d/);
        if (digit) {
          result += digit[0];
          rawIdx++;
        } else {
          // skip non‑digit in raw
          rawIdx++;
          continue;
        }
      } else if (ch === 'A') {
        const letter = raw[rawIdx].match(/[a-zA-Z]/);
        if (letter) {
          result += letter[0];
          rawIdx++;
        } else {
          rawIdx++;
          continue;
        }
      } else if (ch === '*') {
        result += raw[rawIdx];
        rawIdx++;
      } else {
        // literal character from mask
        result += ch;
      }
    }
    return result;
  }

  private getInputClasses(): string {
    const base = [
      'w-full rounded-md px-3 py-2 text-sm transition ml-input ml-input-container',
      this.error ? 'ml-input-container-error' : '',
      this.disabled || this.loading ? 'ml-disabled' : 'cursor-pointer',
    ].filter(Boolean).join(' ');
    return base;
  }

  private getTextareaClasses(): string {
    return this.getInputClasses();
  }

  private getLabelId(): string {
    return `${this.id}-label`;
  }

  private getHelperId(): string {
    return `${this.id}-helper`;
  }

  private getErrorId(): string {
    return `${this.id}-error`;
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleInput(e: Event) {
    e.stopPropagation();
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    let displayValue = target.value;
    // Apply mask if needed
    if (this.mask) {
      const raw = this.stripMask(displayValue);
      // Enforce maxLength on raw value
      const limitedRaw = this.maxLength !== null ? raw.slice(0, this.maxLength) : raw;
      this.value = limitedRaw;
      this.rawDisplay = this.applyMask(limitedRaw);
      // Reflect masked value back to the element (avoid cursor jump for simplicity)
      target.value = this.rawDisplay;
    } else {
      // Enforce maxLength directly
      if (this.maxLength !== null && displayValue.length > this.maxLength) {
        displayValue = displayValue.slice(0, this.maxLength);
        target.value = displayValue;
      }
      this.value = displayValue;
      this.rawDisplay = displayValue;
    }
    this.dispatchEvent(new CustomEvent('input', {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    }));
  }

  private handleBlur() {
    this.isFocused = false;
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    }));
  }

  private handleFocus() {
    this.isFocused = true;
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderLabel(): TemplateResult | typeof nothing {
    if (this.hasSlot('Label')) {
      const content = this.getSlotContent('Label');
      return html`<label id="${this.getLabelId()}" class="${cn('block mb-1 text-sm font-medium ml-label', this.getSlotClass('Label'))}">
        ${unsafeHTML(content)}
      </label>`;
    }
    return nothing;
  }

  private renderHelperOrError(): TemplateResult | typeof nothing {
    if (this.error && this.isEditing) {
      return html`<p id="${this.getErrorId()}" class="mt-1 text-xs ml-error-text" role="alert">
        ${unsafeHTML(this.error)}
      </p>`;
    }
    if (this.hasSlot('Helper') && this.isEditing) {
      const content = this.getSlotContent('Helper');
      return html`<p id="${this.getHelperId()}" class="${cn('mt-1 text-xs ml-helper', this.getSlotClass('Helper'))}">
        ${unsafeHTML(content)}
      </p>`;
    }
    return nothing;
  }

  private renderPrefix(): TemplateResult | typeof nothing {
    if (this.hasSlot('Prefix')) {
      return html`<span class="${cn('inline-flex items-center mr-2', this.getSlotClass('Prefix'))}">
        ${unsafeHTML(this.getSlotContent('Prefix'))}
      </span>`;
    }
    return nothing;
  }

  private renderSuffix(): TemplateResult | typeof nothing {
    if (this.hasSlot('Suffix')) {
      return html`<span class="${cn('inline-flex items-center ml-2', this.getSlotClass('Suffix'))}">
        ${unsafeHTML(this.getSlotContent('Suffix'))}
      </span>`;
    }
    return nothing;
  }

  private renderCounter(): TemplateResult | typeof nothing {
    if (this.rows > 1 && this.maxLength !== null) {
      return html`<div class="mt-1 text-xs ml-text-muted" aria-live="polite">
        ${String(this.value ?? '').length} / ${this.maxLength}
      </div>`;
    }
    return nothing;
  }

  private renderInput(): TemplateResult {
    const commonAttrs = {
      name: this.name,
      placeholder: this.placeholder || undefined,
      autocomplete: this.autocomplete || undefined,
      disabled: this.disabled || this.loading,
      readonly: this.readonly,
      required: this.required,
      'aria-labelledby': this.hasSlot('Label') ? this.getLabelId() : undefined,
      'aria-describedby': this.error && this.isEditing ? this.getErrorId() : (this.hasSlot('Helper') ? this.getHelperId() : undefined),
      'aria-invalid': this.error && this.isEditing ? 'true' : undefined,
      'aria-required': this.required ? 'true' : undefined,
    } as Record<string, any>;

    if (this.rows === 1) {
      return html`
        <div class="flex items-center">
          ${this.renderPrefix()}
          <input
            type="${this.inputType}"
            class="${this.getInputClasses()}"
            .value="${this.rawDisplay}"
            @input="${this.handleInput}"
            @blur="${this.handleBlur}"
            @focus="${this.handleFocus}"
            ...=${commonAttrs}
          
          @change="${(e: Event) => e.stopPropagation()}"
/>
          ${this.renderSuffix()}
        </div>`;
    }
    // Textarea (rows > 1) – mask not applied
    return html`
      <div class="flex flex-col">
        ${this.renderPrefix()}
        <textarea
          class="${this.getTextareaClasses()}"
          rows="${this.rows}"
          .value="${this.value}"
          @input="${this.handleInput}"
          @blur="${this.handleBlur}"
          @focus="${this.handleFocus}"
          ...=${commonAttrs}
        
          @change="${(e: Event) => e.stopPropagation()}"
></textarea>
        ${this.renderSuffix()}
        ${this.renderCounter()}
      </div>`;
  }

  private renderViewMode(): TemplateResult {
    const displayText = (() => {
      if (!this.value) return '—';
      if (this.inputType === 'password') return '••••••••';
      return this.mask ? this.applyMask(this.value) : this.value;
    })();
    return html`
      <div class="flex items-center">
        ${this.renderPrefix()}
        <span class="${this.getInputClasses()}" aria-labelledby="${this.hasSlot('Label') ? this.getLabelId() : ''}">
          ${unsafeHTML(displayText)}
        </span>
        ${this.renderSuffix()}
      </div>`;
  }

  // ===========================================================================
  // MAIN RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    if (this.loading) {
      return html`<div class="text-sm ml-text-muted">${this.msg.loading}</div>`;
    }
    return html`
      <div class="${cn('groupentertext--ml-enter-text', this.cssClass)}">
        ${this.renderLabel()}
        ${this.isEditing ? this.renderInput() : this.renderViewMode()}
        ${this.renderHelperOrError()}
      </div>`;
  }
}
