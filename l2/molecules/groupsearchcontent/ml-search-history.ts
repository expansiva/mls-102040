/// <mls fileReference="_102040_/l2/molecules/groupsearchcontent/ml-search-history.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML SEARCH HISTORY MOLECULE
// =============================================================================
// Skill Group: groupSearchContent
// This molecule does NOT contain business logic.
import { html, svg, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { cn } from '/_102033_/l2/cn.js';
/// **collab_i18n_start**
const message_en = {
  placeholder: 'Search...',
  noResults: 'No results found',
  loading: 'Loading...',
  clear: 'Clear search',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: 'Pesquisar...',
    noResults: 'Nenhum resultado encontrado',
    loading: 'Carregando...',
    clear: 'Limpar busca',
  },
};
/// **collab_i18n_end**

@customElement('groupsearchcontent--ml-search-history')
export class MlSearchHistoryMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;
  // ===========================================================================
  // SLOT TAGS
  // ==========================================================================
  slotTags = ['Label', 'Helper', 'Suggestion', 'Empty'];
  // ===========================================================================
  // PROPERTIES — From Contract
  // ==========================================================================
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
  // ==========================================================================
  @state()
  private query: string = '';

  @state()
  private isOpen: boolean = false;

  @state()
  private focusedSuggestion: number = -1; // index of highlighted suggestion

  private debounceTimer: any = null;
  private inputId = `mlsh-input-${Math.random().toString(36).slice(2)}`;
  private labelId = `mlsh-label-${Math.random().toString(36).slice(2)}`;
  private errorId = `mlsh-error-${Math.random().toString(36).slice(2)}`;

  // ===========================================================================
  // STATE CHANGE HANDLER (sync query with value)
  // ==========================================================================
  handleIcaStateChange(key: string, value: any) {
    // If value changed externally, update query to match label
    const valueAttr = this.getAttribute('value');
    if (valueAttr === `{{${key}}}`) {
      if (value === null || value === undefined || value === '') {
        this.query = '';
      } else {
        // Try to find matching suggestion label
        const suggestions = this.getSlots('Suggestion');
        let found = false;
        for (const el of suggestions) {
          if (el.getAttribute('value') === value) {
            this.query = el.textContent || '';
            found = true;
            break;
          }
        }
        if (!found) {
          this.query = value;
        }
      }
    }
    this.requestUpdate();
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ==========================================================================
  private handleInput(e: Event) {
    e.stopPropagation();
    if (this.disabled) return;
    const input = e.target as HTMLInputElement;
    this.query = input.value;
    this.isOpen = true;
    this.focusedSuggestion = -1;
    // Debounce search event
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.dispatchEvent(new CustomEvent('search', {
        bubbles: true,
        composed: true,
        detail: { query: this.query },
      }));
    }, this.debounce);
  }

  private handleFocus() {
    if (this.disabled) return;
    this.isOpen = true;
    this.dispatchEvent(new CustomEvent('focus', {
      bubbles: true,
      composed: true,
    }));
  }

  private handleBlur(e?: FocusEvent) {
    // Delay closing to allow click on suggestion
    setTimeout(() => {
      this.isOpen = false;
      this.focusedSuggestion = -1;
      this.dispatchEvent(new CustomEvent('blur', {
        bubbles: true,
        composed: true,
      }));
    }, 120);
  }

  private handleClear(e?: Event) {
    if (this.disabled) return;
    this.query = '';
    this.value = null;
    this.isOpen = false;
    this.focusedSuggestion = -1;
    this.dispatchEvent(new CustomEvent('clear', {
      bubbles: true,
      composed: true,
    }));
    // Also emit search for empty query
    this.dispatchEvent(new CustomEvent('search', {
      bubbles: true,
      composed: true,
      detail: { query: '' },
    }));
    // Focus input
    const input = this.renderRoot.querySelector('input');
    input?.focus();
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (!this.isOpen) return;
    const suggestions = this.getSlots('Suggestion');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestions.length === 0) return;
      this.focusedSuggestion = (this.focusedSuggestion + 1) % suggestions.length;
      this.scrollFocusedIntoView();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggestions.length === 0) return;
      this.focusedSuggestion = (this.focusedSuggestion - 1 + suggestions.length) % suggestions.length;
      this.scrollFocusedIntoView();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.focusedSuggestion >= 0 && suggestions[this.focusedSuggestion]) {
        this.selectSuggestion(suggestions[this.focusedSuggestion]);
      } else {
        // Confirm raw query
        this.value = this.query;
        this.isOpen = false;
        this.focusedSuggestion = -1;
        this.dispatchEvent(new CustomEvent('change', {
          bubbles: true,
          composed: true,
          detail: { value: this.value },
        }));
      }
    } else if (e.key === 'Escape') {
      this.isOpen = false;
      this.focusedSuggestion = -1;
    }
  }

  private handleSuggestionClick(idx: number) {
    const suggestions = this.getSlots('Suggestion');
    if (suggestions[idx]) {
      this.selectSuggestion(suggestions[idx]);
    }
  }

  private selectSuggestion(el: Element) {
    const value = el.getAttribute('value') || '';
    const label = el.textContent || '';
    this.value = value;
    this.query = label;
    this.isOpen = false;
    this.focusedSuggestion = -1;
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value },
    }));
  }

  private scrollFocusedIntoView() {
    setTimeout(() => {
      const panel = this.renderRoot.querySelector('.mlsh-suggestions');
      if (!panel) return;
      const focused = panel.querySelector('.mlsh-suggestion[aria-selected="true"]');
      if (focused) {
        (focused as HTMLElement).scrollIntoView({ block: 'nearest' });
      }
    }, 0);
  }

  // ===========================================================================
  // RENDER HELPERS
  // ==========================================================================
  private getInputClasses(): string {
    return [
      'w-full rounded-lg px-3 py-2 text-sm border transition',
      'ml-search-input',
      this.error
        ? 'ml-error-border'
        : 'ml-search-border',
      'ml-search-focus',
      this.disabled ? 'ml-disabled' : '',
    ].filter(Boolean).join(' ');
  }

  private getSuggestionClasses(selected: boolean, focused: boolean): string {
    return [
      'mlsh-suggestion w-full px-3 py-2 text-sm rounded cursor-pointer flex items-center',
      selected
        ? 'ml-filter-chip-active'
        : 'ml-text border border-transparent',
      focused
        ? 'ml-history-item'
        : '',
      'ml-history-item-hover',
    ].filter(Boolean).join(' ');
  }

  private renderLabel(): TemplateResult {
    if (this.hasSlot('Label')) {
      return html`<label id="${this.labelId}" for="${this.inputId}" class=${cn('block mb-1 text-sm ml-label', this.getSlotClass('Label'))}>${unsafeHTML(this.getSlotContent('Label'))}</label>`;
    }
    return html``;
  }

  private renderHelper(): TemplateResult {
    if (this.hasSlot('Helper')) {
      return html`<div class=${cn('mt-1 text-xs ml-text-muted', this.getSlotClass('Helper'))}>${unsafeHTML(this.getSlotContent('Helper'))}</div>`;
    }
    return html``;
  }

  private renderError(): TemplateResult {
    if (this.error) {
      return html`<div id="${this.errorId}" class="mt-1 text-xs ml-error-text">${unsafeHTML(this.error)}</div>`;
    }
    return html``;
  }

  private renderClearButton(): TemplateResult {
    if (!this.query || this.disabled) return html``;
    return html`
      <button
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded ml-history-remove focus:outline-none"
        aria-label="${this.msg.clear}"
        @click=${this.handleClear}
        tabindex="-1"
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
          ${svg`<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 5l8 8M13 5l-8 8"/>`}
        </svg>
      </button>
    `;
  }

  private renderSuggestions(): TemplateResult {
    if (!this.isOpen) return html``;
    const suggestions = this.getSlots('Suggestion');
    if (this.loading) {
      return html`
        <div class="mlsh-suggestions absolute z-10 mt-1 w-full rounded-lg ml-search-container shadow-lg max-h-60 overflow-auto">
          <div class="flex items-center justify-center py-4 ml-text-muted">
            <svg class="animate-spin mr-2" width="18" height="18" fill="none" viewBox="0 0 18 18">
              ${svg`<circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="2" stroke-dasharray="44" stroke-dashoffset="10" fill="none"/>`}
            </svg>
            ${this.msg.loading}
          </div>
        </div>
      `;
    }
    if (suggestions.length === 0) {
      if (this.hasSlot('Empty')) {
        return html`
          <div class="mlsh-suggestions absolute z-10 mt-1 w-full rounded-lg ml-search-container shadow-lg max-h-60 overflow-auto">
            <div class="py-4 px-3 ml-text-muted">${unsafeHTML(this.getSlotContent('Empty'))}</div>
          </div>
        `;
      }
      return html`
        <div class="mlsh-suggestions absolute z-10 mt-1 w-full rounded-lg ml-search-container shadow-lg max-h-60 overflow-auto">
          <div class="py-4 px-3 ml-text-muted">${this.msg.noResults}</div>
        </div>
      `;
    }
    // Render suggestions
    return html`
      <div class="mlsh-suggestions absolute z-10 mt-1 w-full rounded-lg ml-search-container shadow-lg max-h-60 overflow-auto" role="listbox">
        ${suggestions.map((el, idx) => {
          const value = el.getAttribute('value') || '';
          const label = el.innerHTML;
          const selected = this.value === value;
          const focused = this.focusedSuggestion === idx;
          return html`
            <div
              class="${this.getSuggestionClasses(selected, focused)}"
              role="option"
              aria-selected="${focused}"
              @mousedown=${(e: Event) => { e.preventDefault(); this.handleSuggestionClick(idx); }}
              tabindex="-1"
            >
              ${unsafeHTML(label)}
            </div>
          `;
        })}
      </div>
    `;
  }

  // ===========================================================================
  // RENDER
  // ==========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    const ariaLabelledBy = this.hasSlot('Label') ? this.labelId : undefined;
    const ariaDescribedBy = this.error ? this.errorId : undefined;
    const placeholder = this.placeholder || this.msg.placeholder;
    return html`
      <div class=${cn('relative w-full', this.cssClass)}>
        ${this.renderLabel()}
        <div class="relative">
          <input
            id="${this.inputId}"
            class="${this.getInputClasses()}"
            type="text"
            .value="${this.query}"
            ?disabled="${this.disabled}"
            name="${this.name}"
            placeholder="${placeholder}"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="${this.isOpen}"
            aria-controls="${this.inputId}-listbox"
            aria-activedescendant="${this.focusedSuggestion >= 0 ? `${this.inputId}-option-${this.focusedSuggestion}` : ''}"
            aria-labelledby="${ariaLabelledBy}"
            aria-describedby="${ariaDescribedBy}"
            aria-invalid="${!!this.error}"
            @input="${this.handleInput}"
            @focus="${this.handleFocus}"
            @blur="${this.handleBlur}"
            @keydown="${this.handleKeyDown}"
            autocomplete="off"
            spellcheck="false"
          
          @change="${(e: Event) => e.stopPropagation()}"
/>
          ${this.renderClearButton()}
        </div>
        ${this.renderSuggestions()}
        ${this.renderError()}
        ${this.renderHelper()}
      </div>
    `;
  }
}
