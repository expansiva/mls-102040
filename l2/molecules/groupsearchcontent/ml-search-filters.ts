/// <mls fileReference="_102040_/l2/molecules/groupsearchcontent/ml-search-filters.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// SEARCH FILTERS MOLECULE
// =============================================================================
// Skill Group: groupSearchContent
// This molecule does NOT contain business logic.

import { html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  placeholder: 'Search...',
  filters: 'Filters',
  clearSearch: 'Clear search',
  removeSelection: 'Remove selection',
  noResults: 'No results found',
  loading: 'Loading...',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: 'Buscar...',
    filters: 'Filtros',
    clearSearch: 'Limpar busca',
    removeSelection: 'Remover seleção',
    noResults: 'Nenhum resultado encontrado',
    loading: 'Carregando...',
  },
};
/// **collab_i18n_end**

interface ParsedSuggestion {
  value: string;
  label: string;
}

@customElement('groupsearchcontent--ml-search-filters')
export class SearchFiltersMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Helper', 'Suggestion', 'Empty'];

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

  @propertyDataSource({ type: Number })
  debounce: number = 300;

  @propertyDataSource({ type: Boolean })
  disabled: boolean = false;

  @propertyDataSource({ type: Boolean })
  loading: boolean = false;

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private query: string = '';

  @state()
  private isOpen: boolean = false;

  @state()
  private selectedLabel: string = '';

  @state()
  private highlightedIndex: number = -1;

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private inputId: string = `search-input-${Math.random().toString(36).substring(2, 9)}`;
  private listboxId: string = `listbox-${Math.random().toString(36).substring(2, 9)}`;
  private labelId: string = `label-${Math.random().toString(36).substring(2, 9)}`;
  private errorId: string = `error-${Math.random().toString(36).substring(2, 9)}`;

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }

  // ===========================================================================
  // STATE CHANGE HANDLER
  // ===========================================================================
  handleIcaStateChange(key: string, value: unknown) {
    const valueAttr = this.getAttribute('value');
    if (valueAttr === `{{${key}}}`) {
      if (value === null || value === '') {
        this.query = '';
        this.selectedLabel = '';
      }
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // HELPERS
  // ===========================================================================
  private getSuggestions(): ParsedSuggestion[] {
    return this.getSlots('Suggestion').map(el => ({
      value: el.getAttribute('value') || '',
      label: el.innerHTML,
    }));
  }

  private getActiveSelectionCount(): number {
    return this.value ? 1 : 0;
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleInput(e: Event) {
    e.stopPropagation();
    if (this.disabled) return;

    const input = e.target as HTMLInputElement;
    this.query = input.value;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.dispatchEvent(new CustomEvent('search', {
        bubbles: true,
        composed: true,
        detail: { query: this.query }
      }));
    }, this.debounce);
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;

    const suggestions = this.getSuggestions();

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (this.isOpen && this.highlightedIndex >= 0 && suggestions[this.highlightedIndex]) {
          this.selectSuggestion(suggestions[this.highlightedIndex]);
        } else if (this.query.trim()) {
          this.confirmQuery();
        }
        break;
      case 'Escape':
        if (this.isOpen) {
          e.preventDefault();
          this.isOpen = false;
          this.highlightedIndex = -1;
        }
        break;
      case 'ArrowDown':
        if (this.isOpen && suggestions.length > 0) {
          e.preventDefault();
          this.highlightedIndex = Math.min(this.highlightedIndex + 1, suggestions.length - 1);
        }
        break;
      case 'ArrowUp':
        if (this.isOpen && suggestions.length > 0) {
          e.preventDefault();
          this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
        }
        break;
    }
  }

  private confirmQuery() {
    this.value = this.query;
    this.selectedLabel = this.query;
    this.isOpen = false;
    this.highlightedIndex = -1;

    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value }
    }));
  }

  private selectSuggestion(suggestion: ParsedSuggestion) {
    if (this.disabled) return;

    this.value = suggestion.value;
    this.query = this.stripHtml(suggestion.label);
    this.selectedLabel = suggestion.label;
    this.isOpen = false;
    this.highlightedIndex = -1;

    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value }
    }));
  }

  private stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  private handleClear() {
    if (this.disabled) return;

    this.query = '';
    this.value = null;
    this.selectedLabel = '';
    this.highlightedIndex = -1;

    this.dispatchEvent(new CustomEvent('clear', {
      bubbles: true,
      composed: true,
      detail: {}
    }));

    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: null }
    }));
  }

  private handleRemoveChip() {
    if (this.disabled) return;

    this.query = '';
    this.value = null;
    this.selectedLabel = '';

    this.dispatchEvent(new CustomEvent('clear', {
      bubbles: true,
      composed: true,
      detail: {}
    }));

    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: null }
    }));
  }

  private handleTogglePanel() {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.highlightedIndex = -1;
    }
  }

  private handleFocus() {
    this.dispatchEvent(new CustomEvent('focus', {
      bubbles: true,
      composed: true,
      detail: {}
    }));
  }

  private handleBlur() {
    this.dispatchEvent(new CustomEvent('blur', {
      bubbles: true,
      composed: true,
      detail: {}
    }));
  }

  // ===========================================================================
  // CSS CLASSES
  // ===========================================================================
  private getContainerClasses(): string {
    return [
      'w-full flex flex-col gap-2',
    ].join(' ');
  }

  private getLabelClasses(): string {
    return [
      'text-sm ml-label',
    ].join(' ');
  }

  private getInputRowClasses(): string {
    return [
      'flex items-center gap-2',
    ].join(' ');
  }

  private getInputWrapperClasses(): string {
    return [
      'flex-1 relative',
    ].join(' ');
  }

  private getInputClasses(): string {
    return [
      'w-full rounded-lg px-3 py-2 pr-10 text-sm border transition',
      'ml-search-input',
      this.error
        ? 'ml-error-border'
        : 'ml-search-border',
      'ml-search-focus',
      this.disabled ? 'ml-disabled' : '',
    ].filter(Boolean).join(' ');
  }

  private getClearButtonClasses(): string {
    return [
      'absolute right-2 top-1/2 -translate-y-1/2',
      'p-1 rounded-full transition',
      'ml-search-clear',
      'ml-search-focus',
      this.disabled ? 'ml-disabled' : 'cursor-pointer',
    ].filter(Boolean).join(' ');
  }

  private getFilterButtonClasses(): string {
    return [
      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition',
      'border',
      this.isOpen
        ? 'ml-filter-chip-active'
        : 'ml-filter-chip',
      !this.disabled && !this.isOpen ? 'ml-filter-chip-hover' : '',
      'ml-search-focus',
      this.disabled ? 'ml-disabled' : 'cursor-pointer',
    ].filter(Boolean).join(' ');
  }

  private getBadgeClasses(): string {
    return [
      'inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-medium',
      'ml-filter-badge',
    ].join(' ');
  }

  private getChipsContainerClasses(): string {
    return [
      'flex flex-wrap gap-2',
    ].join(' ');
  }

  private getChipClasses(): string {
    return [
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm',
      'ml-filter-chip-active',
    ].join(' ');
  }

  private getChipRemoveClasses(): string {
    return [
      'p-0.5 rounded-full transition',
      'ml-search-clear',
      'ml-search-focus',
      this.disabled ? 'ml-disabled' : 'cursor-pointer',
    ].filter(Boolean).join(' ');
  }

  private getPanelClasses(): string {
    return [
      'mt-2 rounded-lg border shadow-lg overflow-hidden',
      'ml-search-container',
    ].join(' ');
  }

  private getPanelContentClasses(): string {
    return [
      'max-h-60 overflow-y-auto p-2',
    ].join(' ');
  }

  private getSuggestionClasses(index: number, isSelected: boolean): string {
    return [
      'w-full px-3 py-2 rounded-md text-sm text-left transition cursor-pointer',
      'ml-text',
      isSelected
        ? 'ml-filter-chip-active'
        : '',
      this.highlightedIndex === index && !isSelected
        ? 'ml-facet-option-selected'
        : '',
      !isSelected && this.highlightedIndex !== index
        ? 'ml-facet-option'
        : '',
      'ml-search-focus',
    ].filter(Boolean).join(' ');
  }

  private getEmptyClasses(): string {
    return [
      'px-3 py-4 text-sm text-center',
      'ml-text-muted',
    ].join(' ');
  }

  private getLoadingClasses(): string {
    return [
      'flex items-center justify-center gap-2 px-3 py-4 text-sm',
      'ml-text-muted',
    ].join(' ');
  }

  private getHelperClasses(): string {
    return [
      'text-xs',
      'ml-text-muted',
    ].join(' ');
  }

  private getErrorClasses(): string {
    return [
      'text-xs',
      'ml-error-text',
    ].join(' ');
  }

  // ===========================================================================
  // RENDER METHODS
  // ===========================================================================
  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) {
      return html``;
    }

    return html`
      <label
        id=${this.labelId}
        class=${cn(this.getLabelClasses(), this.getSlotClass('Label'))}
      >
        ${unsafeHTML(this.getSlotContent('Label'))}
      </label>
    `;
  }

  private renderClearButton(): TemplateResult {
    if (!this.query) {
      return html``;
    }

    return html`
      <button
        type="button"
        class=${this.getClearButtonClasses()}
        aria-label=${this.msg.clearSearch}
        @click=${this.handleClear}
        ?disabled=${this.disabled}
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;
  }

  private renderFilterButton(): TemplateResult {
    const count = this.getActiveSelectionCount();

    return html`
      <button
        type="button"
        class=${this.getFilterButtonClasses()}
        aria-expanded=${this.isOpen}
        aria-controls=${this.listboxId}
        @click=${this.handleTogglePanel}
        ?disabled=${this.disabled}
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
        </svg>
        <span>${this.msg.filters}</span>
        <span class=${this.getBadgeClasses()}>${count}</span>
      </button>
    `;
  }

  private renderChips(): TemplateResult {
    if (!this.value || !this.selectedLabel) {
      return html``;
    }

    return html`
      <div class=${this.getChipsContainerClasses()}>
        <span class=${this.getChipClasses()}>
          <span>${unsafeHTML(this.selectedLabel)}</span>
          <button
            type="button"
            class=${this.getChipRemoveClasses()}
            aria-label=${this.msg.removeSelection}
            @click=${this.handleRemoveChip}
            ?disabled=${this.disabled}
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </span>
      </div>
    `;
  }

  private renderPanel(): TemplateResult {
    if (!this.isOpen) {
      return html``;
    }

    return html`
      <div
        id=${this.listboxId}
        class=${this.getPanelClasses()}
        role="listbox"
        aria-labelledby=${this.labelId}
      >
        <div class=${this.getPanelContentClasses()}>
          ${this.renderPanelContent()}
        </div>
      </div>
    `;
  }

  private renderPanelContent(): TemplateResult {
    if (this.loading) {
      return html`
        <div class=${this.getLoadingClasses()}>
          <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>${this.msg.loading}</span>
        </div>
      `;
    }

    const suggestions = this.getSuggestions();

    if (suggestions.length === 0) {
      const emptyContent = this.hasSlot('Empty')
        ? this.getSlotContent('Empty')
        : this.msg.noResults;

      return html`
        <div class=${this.getEmptyClasses()}>
          ${unsafeHTML(emptyContent)}
        </div>
      `;
    }

    return html`
      ${suggestions.map((suggestion, index) => this.renderSuggestion(suggestion, index))}
    `;
  }

  private renderSuggestion(suggestion: ParsedSuggestion, index: number): TemplateResult {
    const isSelected = this.value === suggestion.value;

    return html`
      <button
        type="button"
        class=${this.getSuggestionClasses(index, isSelected)}
        role="option"
        aria-selected=${isSelected}
        @click=${() => this.selectSuggestion(suggestion)}
        @mouseenter=${() => { this.highlightedIndex = index; }}
      >
        ${unsafeHTML(suggestion.label)}
      </button>
    `;
  }

  private renderFeedback(): TemplateResult {
    if (this.error) {
      return html`
        <p id=${this.errorId} class=${this.getErrorClasses()}>
          ${unsafeHTML(String(this.error))}
        </p>
      `;
    }

    if (this.hasSlot('Helper')) {
      return html`
        <p class=${this.getHelperClasses()}>
          ${unsafeHTML(this.getSlotContent('Helper'))}
        </p>
      `;
    }

    return html``;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    const placeholderText = this.placeholder || this.msg.placeholder;

    return html`
      <div class=${cn(this.getContainerClasses(), this.cssClass)}>
        ${this.renderLabel()}

        <div class=${this.getInputRowClasses()}>
          <div class=${this.getInputWrapperClasses()}>
            <input
              id=${this.inputId}
              type="text"
              class=${this.getInputClasses()}
              placeholder=${placeholderText}
              .value=${this.query}
              ?disabled=${this.disabled}
              role="combobox"
              aria-expanded=${this.isOpen}
              aria-autocomplete="list"
              aria-controls=${this.listboxId}
              aria-labelledby=${this.hasSlot('Label') ? this.labelId : ''}
              aria-describedby=${this.error ? this.errorId : ''}
              aria-invalid=${this.error ? 'true' : 'false'}
              @input=${this.handleInput}
              @keydown=${this.handleKeyDown}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            
            @change=${(e: Event) => e.stopPropagation()}
/>
            ${this.renderClearButton()}
          </div>
          ${this.renderFilterButton()}
        </div>

        ${this.renderChips()}
        ${this.renderPanel()}
        ${this.renderFeedback()}
      </div>
    `;
  }
}
