/// <mls fileReference="_102040_/l2/molecules/groupentertext/ml-tag-input.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// TAG INPUT MOLECULE
// =============================================================================
// Skill Group: groupEnterText
// This molecule does NOT contain business logic.

import { html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  placeholder: 'Type and press Enter to add tags',
  noValue: '—',
  removeTag: 'Remove tag',
  charactersRemaining: 'characters remaining',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: 'Digite e pressione Enter para adicionar tags',
    noValue: '—',
    removeTag: 'Remover tag',
    charactersRemaining: 'caracteres restantes',
  },
};
/// **collab_i18n_end**

@customElement('groupentertext--ml-tag-input')
export class MlTagInputMolecule extends MoleculeAuraElement {
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

  @propertyDataSource({ type: Number })
  rows: number = 1;

  @propertyDataSource({ type: String })
  autocomplete: string = '';

  @propertyDataSource({ type: String, attribute: 'input-type' })
  inputType: string = 'text';

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
  private currentInput: string = '';

  @state()
  private isFocused: boolean = false;

  // ===========================================================================
  // COMPUTED PROPERTIES
  // ===========================================================================
  private get tags(): string[] {
    if (!this.value || this.value.trim() === '') return [];
    return this.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }

  private get isInteractive(): boolean {
    return !this.disabled && !this.loading && !this.readonly;
  }

  private get isMultiLine(): boolean {
    return this.rows > 1;
  }

  // ===========================================================================
  // STATE CHANGE HANDLER
  // ===========================================================================
  handleIcaStateChange(key: string, value: any) {
    const valueAttr = this.getAttribute('value');
    if (valueAttr === `{{${key}}}`) {
      // Value changed externally, reset current input
      this.currentInput = '';
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleInput(e: Event) {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    
    if (this.isMultiLine) {
      // Multi-line mode: standard text behavior
      if (this.maxLength !== null && target.value.length > this.maxLength) {
        target.value = target.value.slice(0, this.maxLength);
      }
      this.value = target.value;
      this.dispatchEvent(new CustomEvent('input', {
        bubbles: true,
        composed: true,
        detail: { value: this.value }
      }));
    } else {
      // Single-line tag mode
      let inputValue = target.value;
      
      // Block input beyond max length for current token
      if (this.maxLength !== null && inputValue.length > this.maxLength) {
        inputValue = inputValue.slice(0, this.maxLength);
        target.value = inputValue;
      }
      
      // Check for comma delimiter
      if (inputValue.includes(',')) {
        const parts = inputValue.split(',');
        for (let i = 0; i < parts.length - 1; i++) {
          this.addTag(parts[i].trim());
        }
        this.currentInput = parts[parts.length - 1];
        target.value = this.currentInput;
      } else {
        this.currentInput = inputValue;
      }
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (!this.isInteractive || this.isMultiLine) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      this.addTag(this.currentInput.trim());
    } else if (e.key === 'Backspace' && this.currentInput === '' && this.tags.length > 0) {
      // Remove last tag when backspace on empty input
      this.removeTagByIndex(this.tags.length - 1);
    }
  }

  private addTag(tag: string) {
    if (!tag || tag.length === 0) return;
    
    // Check min length
    if (this.minLength !== null && tag.length < this.minLength) return;
    
    // Check max length
    if (this.maxLength !== null && tag.length > this.maxLength) return;
    
    // Check for duplicates (case-insensitive)
    const lowerTag = tag.toLowerCase();
    const isDuplicate = this.tags.some(t => t.toLowerCase() === lowerTag);
    if (isDuplicate) return;
    
    // Add tag
    const newTags = [...this.tags, tag];
    this.value = newTags.join(', ');
    this.currentInput = '';
    
    this.dispatchEvent(new CustomEvent('input', {
      bubbles: true,
      composed: true,
      detail: { value: this.value }
    }));
  }

  private removeTagByIndex(index: number) {
    if (!this.isInteractive) return;
    
    const newTags = this.tags.filter((_, i) => i !== index);
    this.value = newTags.join(', ');
    
    this.dispatchEvent(new CustomEvent('input', {
      bubbles: true,
      composed: true,
      detail: { value: this.value }
    }));
  }

  private handleFocus() {
    if (!this.isInteractive) return;
    this.isFocused = true;
    this.dispatchEvent(new CustomEvent('focus', {
      bubbles: true,
      composed: true,
    }));
  }

  private handleBlur() {
    if (!this.isInteractive) return;
    this.isFocused = false;
    
    // Commit any pending input as tag on blur (single-line mode)
    if (!this.isMultiLine && this.currentInput.trim()) {
      this.addTag(this.currentInput.trim());
    }
    
    this.dispatchEvent(new CustomEvent('blur', {
      bubbles: true,
      composed: true,
    }));
    
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value }
    }));
  }

  private handleContainerClick(e: Event) {
    if (!this.isInteractive || !this.isEditing) return;
    
    // Focus the input when clicking on the container
    const input = this.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement;
    if (input) {
      input.focus();
    }
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private getContainerClasses(): string {
    const hasError = this.error && this.error.length > 0;
    
    return [
      'w-full rounded-lg border transition-all',
      'bg-white dark:bg-slate-900',
      
      // Border states
      hasError
        ? 'border-red-500 dark:border-red-400'
        : this.isFocused && this.isInteractive
          ? 'border-sky-500 dark:border-sky-400'
          : 'border-slate-200 dark:border-slate-700',
      
      // Focus ring
      this.isFocused && this.isInteractive && !hasError
        ? 'ring-2 ring-sky-500/20 dark:ring-sky-400/20'
        : '',
      
      // Disabled/loading state
      this.disabled || this.loading
        ? 'opacity-50 cursor-not-allowed'
        : this.readonly
          ? 'cursor-default'
          : 'cursor-text',
    ].filter(Boolean).join(' ');
  }

  private getInputClasses(): string {
    return [
      'flex-1 min-w-[120px] bg-transparent border-none outline-none',
      'text-sm text-slate-900 dark:text-slate-100',
      'placeholder:text-slate-400 dark:placeholder:text-slate-500',
      this.disabled || this.loading ? 'cursor-not-allowed' : '',
      this.readonly ? 'cursor-default' : '',
    ].filter(Boolean).join(' ');
  }

  private getTagClasses(): string {
    return [
      'inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm',
      'bg-sky-50 dark:bg-sky-900/40',
      'text-sky-700 dark:text-sky-300',
      'border border-sky-200 dark:border-sky-700',
    ].join(' ');
  }

  private getRemoveButtonClasses(): string {
    return [
      'inline-flex items-center justify-center w-4 h-4 rounded-full',
      'text-sky-500 dark:text-sky-400',
      'hover:bg-sky-200 dark:hover:bg-sky-800',
      'focus:outline-none focus:ring-1 focus:ring-sky-500 dark:focus:ring-sky-400',
      'transition-colors',
      !this.isInteractive ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
    ].filter(Boolean).join(' ');
  }

  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    
    const labelContent = this.getSlotContent('Label');
    return html`
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        ${unsafeHTML(labelContent)}
        ${this.required ? html`<span class="text-red-500 dark:text-red-400 ml-0.5">*</span>` : ''}
      </label>
    `;
  }

  private renderPrefix(): TemplateResult {
    if (!this.hasSlot('Prefix')) return html``;
    
    const prefixContent = this.getSlotContent('Prefix');
    return html`
      <span class="flex-shrink-0 text-slate-500 dark:text-slate-400">
        ${unsafeHTML(prefixContent)}
      </span>
    `;
  }

  private renderSuffix(): TemplateResult {
    if (!this.hasSlot('Suffix')) return html``;
    
    const suffixContent = this.getSlotContent('Suffix');
    return html`
      <span class="flex-shrink-0 text-slate-500 dark:text-slate-400">
        ${unsafeHTML(suffixContent)}
      </span>
    `;
  }

  private renderTag(tag: string, index: number): TemplateResult {
    return html`
      <span class="${this.getTagClasses()}">
        <span class="max-w-[150px] truncate">${tag}</span>
        ${this.isInteractive ? html`
          <button
            type="button"
            class="${this.getRemoveButtonClasses()}"
            @click=${(e: Event) => {
              e.stopPropagation();
              this.removeTagByIndex(index);
            }}
            aria-label="${this.msg.removeTag}: ${tag}"
            ?disabled=${!this.isInteractive}
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        ` : ''}
      </span>
    `;
  }

  private renderTags(): TemplateResult {
    if (this.tags.length === 0) return html``;
    
    return html`
      ${this.tags.map((tag, index) => this.renderTag(tag, index))}
    `;
  }

  private renderInput(): TemplateResult {
    const placeholderText = this.placeholder || this.msg.placeholder;
    
    return html`
      <input
        type="${this.inputType}"
        class="${this.getInputClasses()}"
        .value=${this.currentInput}
        placeholder=${this.tags.length === 0 ? placeholderText : ''}
        ?disabled=${this.disabled || this.loading}
        ?readonly=${this.readonly}
        autocomplete=${this.autocomplete || 'off'}
        aria-invalid=${this.error ? 'true' : 'false'}
        aria-required=${this.required ? 'true' : 'false'}
        @input=${this.handleInput}
        @keydown=${this.handleKeyDown}
        @focus=${this.handleFocus}
        @blur=${this.handleBlur}
      />
    `;
  }

  private renderTextarea(): TemplateResult {
    const placeholderText = this.placeholder || this.msg.placeholder;
    const currentLength = this.value?.length || 0;
    
    return html`
      <textarea
        class="${this.getInputClasses()} w-full resize-none py-2"
        .value=${this.value || ''}
        placeholder=${placeholderText}
        rows=${this.rows}
        ?disabled=${this.disabled || this.loading}
        ?readonly=${this.readonly}
        autocomplete=${this.autocomplete || 'off'}
        aria-invalid=${this.error ? 'true' : 'false'}
        aria-required=${this.required ? 'true' : 'false'}
        @input=${this.handleInput}
        @focus=${this.handleFocus}
        @blur=${this.handleBlur}
      ></textarea>
      ${this.maxLength !== null ? html`
        <div class="text-xs text-slate-500 dark:text-slate-400 text-right mt-1" aria-live="polite">
          ${currentLength} / ${this.maxLength}
        </div>
      ` : ''}
    `;
  }

  private renderEditMode(): TemplateResult {
    if (this.isMultiLine) {
      return html`
        <div class="${this.getContainerClasses()} p-2">
          ${this.renderPrefix()}
          ${this.renderTextarea()}
          ${this.renderSuffix()}
        </div>
      `;
    }
    
    return html`
      <div 
        class="${this.getContainerClasses()} p-2 min-h-[42px]"
        @click=${this.handleContainerClick}
      >
        <div class="flex flex-wrap items-center gap-2">
          ${this.renderPrefix()}
          ${this.renderTags()}
          ${this.renderInput()}
          ${this.renderSuffix()}
        </div>
      </div>
    `;
  }

  private renderViewMode(): TemplateResult {
    const displayValue = this.value && this.value.trim() !== '' 
      ? this.value 
      : this.msg.noValue;
    
    return html`
      <div class="flex items-center gap-2 py-2 text-sm text-slate-900 dark:text-slate-100">
        ${this.renderPrefix()}
        <span>${displayValue}</span>
        ${this.renderSuffix()}
      </div>
    `;
  }

  private renderHelper(): TemplateResult {
    if (!this.isEditing) return html``;
    
    if (this.error && this.error.length > 0) {
      return html`
        <p class="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
          ${unsafeHTML(this.error)}
        </p>
      `;
    }
    
    if (this.hasSlot('Helper')) {
      return html`
        <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          ${unsafeHTML(this.getSlotContent('Helper'))}
        </div>
      `;
    }
    
    return html``;
  }

  private renderLoadingIndicator(): TemplateResult {
    if (!this.loading) return html``;
    
    return html`
      <div class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 rounded-lg">
        <svg class="animate-spin h-5 w-5 text-sky-500 dark:text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
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
      <div class="w-full">
        ${this.renderLabel()}
        <div class="relative">
          ${this.isEditing ? this.renderEditMode() : this.renderViewMode()}
          ${this.renderLoadingIndicator()}
        </div>
        ${this.renderHelper()}
      </div>
    `;
  }
}