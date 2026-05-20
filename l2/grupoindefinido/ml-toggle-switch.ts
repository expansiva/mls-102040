/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-toggle-switch.ts" enhancement="_102020_/l2/enhancementAura"/>

// =============================================================================
// TOGGLE SWITCH MOLECULE
// =============================================================================
// Skill Group: groupSelectOne
// This molecule does NOT contain business logic.

import { html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  placeholder: 'Select an option',
  noSelection: '—',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: 'Selecione uma opção',
    noSelection: '—',
  },
};
/// **collab_i18n_end**

interface ParsedItem {
  value: string;
  label: string;
  disabled: boolean;
}

@customElement('groupselectone--ml-toggle-switch')
export class MlToggleSwitchMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Helper', 'Trigger', 'Item', 'Group', 'Empty'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: String })
  value: string | null = null;

  @propertyDataSource({ type: String })
  error: string = '';

  @propertyDataSource({ type: String })
  name: string = '';

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

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private isOpen: boolean = false;

  @state()
  private focusedIndex: number = -1;

  private boundHandleOutsideClick = this.handleOutsideClick.bind(this);

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.boundHandleOutsideClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.boundHandleOutsideClick);
  }

  // ===========================================================================
  // ITEM PARSING
  // ===========================================================================
  private parseItems(): ParsedItem[] {
    const itemElements = this.getSlots('Item');
    const items: ParsedItem[] = [];
    
    for (let i = 0; i < Math.min(itemElements.length, 2); i++) {
      const el = itemElements[i];
      const value = el.getAttribute('value') || '';
      const label = el.innerHTML.trim() || value;
      const disabled = el.hasAttribute('disabled');
      items.push({ value, label, disabled });
    }
    
    return items;
  }

  private findItem(value: string | null): ParsedItem | null {
    if (value === null) return null;
    const items = this.parseItems();
    return items.find(item => item.value === value) || null;
  }

  private getSelectedIndex(): number {
    const items = this.parseItems();
    return items.findIndex(item => item.value === this.value);
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleOutsideClick(e: Event) {
    if (!this.isOpen) return;
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.isOpen = false;
      this.focusedIndex = -1;
    }
  }

  private handleTriggerClick(e: Event) {
    e.stopPropagation();
    if (this.disabled || this.readonly || this.loading) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.focusedIndex = this.getSelectedIndex();
      this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
    } else {
      this.focusedIndex = -1;
      this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
    }
  }

  private handleToggleClick(e: Event) {
    e.stopPropagation();
    if (this.disabled || this.readonly || this.loading) return;
    
    const items = this.parseItems();
    if (items.length < 2) return;
    
    const currentIndex = this.getSelectedIndex();
    const newIndex = currentIndex === 0 ? 1 : 0;
    const newItem = items[newIndex];
    
    if (newItem && !newItem.disabled) {
      this.value = newItem.value;
      this.dispatchEvent(new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value }
      }));
    }
  }

  private handleItemSelect(item: ParsedItem) {
    if (this.disabled || this.readonly || item.disabled) return;
    this.value = item.value;
    this.isOpen = false;
    this.focusedIndex = -1;
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value }
    }));
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
  }

  private handleKeydown(e: KeyboardEvent) {
    if (!this.isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.handleTriggerClick(e);
      }
      return;
    }

    const items = this.parseItems();
    
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        this.focusedIndex = this.focusedIndex < items.length - 1 ? this.focusedIndex + 1 : 0;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        this.focusedIndex = this.focusedIndex > 0 ? this.focusedIndex - 1 : items.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (this.focusedIndex >= 0 && this.focusedIndex < items.length) {
          this.handleItemSelect(items[this.focusedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.isOpen = false;
        this.focusedIndex = -1;
        this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
        break;
    }
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private hasError(): boolean {
    return this.error !== '' && this.isEditing;
  }

  private showRequiredError(): boolean {
    return this.required && this.value === null && this.isEditing;
  }

  private getContainerClasses(): string {
    return [
      'relative inline-flex flex-col gap-1',
    ].join(' ');
  }

  private getTriggerClasses(): string {
    const hasErrorState = this.hasError() || this.showRequiredError();
    
    return [
      'inline-flex items-center gap-3 px-3 py-2 rounded-lg border transition-all duration-200',
      'focus:outline-none focus:ring-2',
      // Background
      'bg-white dark:bg-slate-800',
      // Border
      hasErrorState
        ? 'border-red-500 dark:border-red-400'
        : 'border-slate-200 dark:border-slate-700',
      // Focus ring
      hasErrorState
        ? 'focus:ring-red-500 dark:focus:ring-red-400'
        : 'focus:ring-sky-500 dark:focus:ring-sky-400',
      // Disabled/readonly states
      this.disabled ? 'opacity-50 cursor-not-allowed' : '',
      this.readonly ? 'cursor-default' : '',
      !this.disabled && !this.readonly && !this.loading ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-600' : '',
    ].filter(Boolean).join(' ');
  }

  private getToggleTrackClasses(): string {
    const selectedIndex = this.getSelectedIndex();
    const isOn = selectedIndex === 1;
    const hasErrorState = this.hasError() || this.showRequiredError();
    
    return [
      'relative w-11 h-6 rounded-full transition-colors duration-200',
      // Background based on state
      hasErrorState
        ? 'bg-red-100 dark:bg-red-900/30'
        : isOn
          ? 'bg-sky-500 dark:bg-sky-600'
          : 'bg-slate-200 dark:bg-slate-600',
      // Disabled state
      this.disabled ? 'opacity-50' : '',
    ].filter(Boolean).join(' ');
  }

  private getToggleKnobClasses(): string {
    const selectedIndex = this.getSelectedIndex();
    const isOn = selectedIndex === 1;
    
    return [
      'absolute top-0.5 w-5 h-5 rounded-full shadow-sm transition-transform duration-200',
      'bg-white dark:bg-slate-100',
      isOn ? 'translate-x-5' : 'translate-x-0.5',
    ].join(' ');
  }

  private getLabelTextClasses(): string {
    return [
      'text-sm font-medium min-w-0',
      'text-slate-900 dark:text-slate-100',
    ].join(' ');
  }

  private getPlaceholderClasses(): string {
    return [
      'text-sm',
      'text-slate-400 dark:text-slate-500',
    ].join(' ');
  }

  private getPanelClasses(): string {
    return [
      'absolute z-50 mt-1 w-full min-w-max',
      'bg-white dark:bg-slate-800',
      'border border-slate-200 dark:border-slate-700',
      'rounded-lg shadow-lg',
      'py-1',
    ].join(' ');
  }

  private getItemClasses(item: ParsedItem, index: number): string {
    const isSelected = this.value === item.value;
    const isFocused = this.focusedIndex === index;
    
    return [
      'w-full px-3 py-2 text-sm text-left transition-colors duration-150',
      // Selected state
      isSelected
        ? 'bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300'
        : 'text-slate-900 dark:text-slate-100',
      // Focused state
      isFocused && !isSelected
        ? 'bg-slate-50 dark:bg-slate-700'
        : '',
      // Hover
      !item.disabled && !isSelected
        ? 'hover:bg-slate-50 dark:hover:bg-slate-700'
        : '',
      // Disabled
      item.disabled
        ? 'opacity-50 cursor-not-allowed'
        : 'cursor-pointer',
    ].filter(Boolean).join(' ');
  }

  private getViewModeClasses(): string {
    return [
      'text-sm',
      'text-slate-900 dark:text-slate-100',
    ].join(' ');
  }

  // ===========================================================================
  // RENDER SECTIONS
  // ===========================================================================
  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    
    const labelContent = this.getSlotContent('Label');
    return html`
      <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
        ${unsafeHTML(labelContent)}
        ${this.required ? html`<span class="text-red-500 dark:text-red-400 ml-0.5">*</span>` : html``}
      </label>
    `;
  }

  private renderToggleSwitch(): TemplateResult {
    return html`
      <div 
        class=${this.getToggleTrackClasses()}
        @click=${this.handleToggleClick}
        role="switch"
        aria-checked=${this.getSelectedIndex() === 1}
      >
        <div class=${this.getToggleKnobClasses()}></div>
      </div>
    `;
  }

  private renderSelectedLabel(): TemplateResult {
    const selectedItem = this.findItem(this.value);
    
    if (selectedItem) {
      return html`
        <span class=${this.getLabelTextClasses()}>
          ${unsafeHTML(selectedItem.label)}
        </span>
      `;
    }
    
    // No selection - show trigger content or placeholder
    if (this.hasSlot('Trigger')) {
      return html`
        <span class=${this.getPlaceholderClasses()}>
          ${unsafeHTML(this.getSlotContent('Trigger'))}
        </span>
      `;
    }
    
    const placeholderText = this.placeholder || this.msg.placeholder;
    return html`
      <span class=${this.getPlaceholderClasses()}>
        ${placeholderText}
      </span>
    `;
  }

  private renderLoadingIndicator(): TemplateResult {
    return html`
      <svg class="animate-spin h-4 w-4 text-slate-400 dark:text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    `;
  }

  private renderDropdownIcon(): TemplateResult {
    return html`
      <svg 
        class="w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${this.isOpen ? 'rotate-180' : ''}"
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    `;
  }

  private renderTrigger(): TemplateResult {
    const hasErrorState = this.hasError() || this.showRequiredError();
    
    return html`
      <div
        class=${this.getTriggerClasses()}
        @click=${this.handleTriggerClick}
        @keydown=${this.handleKeydown}
        tabindex=${this.disabled ? -1 : 0}
        role="combobox"
        aria-expanded=${this.isOpen}
        aria-haspopup="listbox"
        aria-invalid=${hasErrorState}
        aria-required=${this.required}
        ${this.hasSlot('Label') ? `aria-labelledby="label-${this.name}"` : ''}
      >
        ${this.renderToggleSwitch()}
        ${this.renderSelectedLabel()}
        ${this.loading ? this.renderLoadingIndicator() : this.renderDropdownIcon()}
      </div>
    `;
  }

  private renderPanel(): TemplateResult {
    if (!this.isOpen) return html``;
    
    const items = this.parseItems();
    
    if (items.length === 0) {
      if (this.hasSlot('Empty')) {
        return html`
          <div class=${this.getPanelClasses()}>
            <div class="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
              ${unsafeHTML(this.getSlotContent('Empty'))}
            </div>
          </div>
        `;
      }
      return html``;
    }
    
    return html`
      <div class=${this.getPanelClasses()} role="listbox">
        ${items.map((item, index) => html`
          <div
            class=${this.getItemClasses(item, index)}
            role="option"
            aria-selected=${this.value === item.value}
            aria-disabled=${item.disabled}
            @click=${() => this.handleItemSelect(item)}
          >
            <div class="flex items-center gap-2">
              ${this.value === item.value ? html`
                <svg class="w-4 h-4 text-sky-500 dark:text-sky-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              ` : html`<div class="w-4 h-4"></div>`}
              <span>${unsafeHTML(item.label)}</span>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  private renderHelper(): TemplateResult {
    if (this.hasError()) {
      return html`
        <p class="text-xs text-red-600 dark:text-red-400">
          ${this.error}
        </p>
      `;
    }
    
    if (this.showRequiredError()) {
      return html`
        <p class="text-xs text-red-600 dark:text-red-400">
          ${this.msg.placeholder}
        </p>
      `;
    }
    
    if (this.hasSlot('Helper')) {
      return html`
        <p class="text-xs text-slate-500 dark:text-slate-400">
          ${unsafeHTML(this.getSlotContent('Helper'))}
        </p>
      `;
    }
    
    return html``;
  }

  private renderViewMode(): TemplateResult {
    const selectedItem = this.findItem(this.value);
    const displayText = selectedItem ? selectedItem.label : this.msg.noSelection;
    
    return html`
      <div class=${this.getContainerClasses()}>
        ${this.renderLabel()}
        <span class=${this.getViewModeClasses()}>
          ${unsafeHTML(displayText)}
        </span>
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

    return html`
      <div class=${this.getContainerClasses()}>
        ${this.renderLabel()}
        ${this.renderTrigger()}
        ${this.renderPanel()}
        ${this.renderHelper()}
      </div>
    `;
  }
}
