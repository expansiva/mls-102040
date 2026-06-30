/// <mls fileReference="_102040_/l2/molecules/groupsearchcontent/ml-faceted-search.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// FACETED SEARCH MOLECULE
// =============================================================================
// Skill Group: groupSearchContent
// This molecule does NOT contain business logic.
import { html, TemplateResult, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  placeholder: 'Search',
  loading: 'Loading...',
  empty: 'No options available',
  clear: 'Clear search',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
};
/// **collab_i18n_end**

@customElement('groupsearchcontent--ml-faceted-search')
export class FacetedSearchMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;
  private instanceId = Math.random().toString(36).slice(2);
  private searchTimer: number | undefined;
  private isPointerDown = false;

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
  private highlightedIndex: number = -1;

  // ===========================================================================
  // STATE CHANGE HANDLER
  // ===========================================================================
  updated(changed: Map<string, unknown>) {
    if (changed.has('value')) {
      this.updateQueryFromValue();
    }
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleInput(e: Event) {
    if (this.disabled) return;
    const input = e.target as HTMLInputElement;
    const next = input.value;
    this.query = next;
    this.highlightedIndex = -1;

    if (next.trim() === '') {
      this.clearValue();
      return;
    }

    this.isOpen = true;
    this.scheduleSearch();
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;
    const items = this.getSuggestionItems();
    const total = items.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!this.isOpen) this.isOpen = true;
      if (total === 0) return;
      this.highlightedIndex = (this.highlightedIndex + 1) % total;
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!this.isOpen) this.isOpen = true;
      if (total === 0) return;
      this.highlightedIndex = (this.highlightedIndex - 1 + total) % total;
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (this.highlightedIndex >= 0 && items[this.highlightedIndex]) {
        this.confirmSelection(items[this.highlightedIndex]);
      } else {
        this.confirmFreeText();
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      this.isOpen = false;
      this.highlightedIndex = -1;
    }
  }

  private handleFocus() {
    if (this.disabled) return;
    this.isOpen = true;
    this.dispatchEvent(
      new CustomEvent('focus', { bubbles: true, composed: true })
    );
  }

  private handleBlur() {
    window.setTimeout(() => {
      if (this.isPointerDown) return;
      this.isOpen = false;
      this.highlightedIndex = -1;
      this.dispatchEvent(
        new CustomEvent('blur', { bubbles: true, composed: true })
      );
    }, 120);
  }

  private handleClear() {
    if (this.disabled) return;
    this.clearValue();
  }

  private handleSuggestionClick(item: SuggestionItem) {
    if (this.disabled) return;
    this.confirmSelection(item);
  }

  private handlePanelPointerDown() {
    this.isPointerDown = true;
  }

  private handlePanelPointerUp() {
    this.isPointerDown = false;
  }

  // ===========================================================================
  // LOGIC
  // ===========================================================================
  private scheduleSearch() {
    if (this.disabled) return;
    if (this.searchTimer) window.clearTimeout(this.searchTimer);
    const delay = Math.max(0, Number(this.debounce) || 0);
    this.searchTimer = window.setTimeout(() => {
      if (this.disabled) return;
      if (this.query.trim() === '') return;
      this.dispatchEvent(
        new CustomEvent('search', {
          bubbles: true,
          composed: true,
          detail: { query: this.query },
        })
      );
    }, delay);
  }

  private confirmSelection(item: SuggestionItem) {
    this.value = item.value;
    this.query = item.labelText;
    this.isOpen = false;
    this.highlightedIndex = -1;
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    );
  }

  private confirmFreeText() {
    const trimmed = this.query.trim();
    if (trimmed === '') {
      this.clearValue();
      return;
    }
    this.value = trimmed;
    this.isOpen = false;
    this.highlightedIndex = -1;
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    );
  }

  private clearValue() {
    this.value = null;
    this.query = '';
    this.isOpen = false;
    this.highlightedIndex = -1;
    if (this.searchTimer) window.clearTimeout(this.searchTimer);
    this.dispatchEvent(
      new CustomEvent('clear', { bubbles: true, composed: true })
    );
  }

  private updateQueryFromValue() {
    if (this.value === null || this.value === undefined || this.value === '') {
      this.query = '';
      return;
    }
    const match = this.getSuggestionItems().find(
      (item) => item.value === this.value
    );
    if (match) {
      this.query = match.labelText;
    } else {
      this.query = String(this.value);
    }
  }

  // ===========================================================================
  // DATA PARSING
  // ===========================================================================
  private getSuggestionItems(): SuggestionItem[] {
    return this.getSlots('Suggestion').map((el, index) => {
      const value = el.getAttribute('value') || '';
      const labelHtml = el.innerHTML || '';
      const labelText = el.textContent || '';
      return {
        id: `option-${this.instanceId}-${index}`,
        value,
        labelHtml,
        labelText,
      };
    });
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    const suggestions = this.getSuggestionItems();
    const labelId = this.hasSlot('Label')
      ? `label-${this.instanceId}`
      : '';
    const errorId = this.error ? `error-${this.instanceId}` : '';
    const listboxId = `listbox-${this.instanceId}`;
    const panelOpen = this.isOpen || this.loading;
    const activeDescendant =
      this.highlightedIndex >= 0 && suggestions[this.highlightedIndex]
        ? suggestions[this.highlightedIndex].id
        : '';

    return html`
      <div class=${cn('w-full', this.cssClass)}>
        ${this.renderLabel(labelId)}

        <div class="relative">
          <input
            class="${this.getInputClasses()}"
            .value=${this.query}
            name=${this.name}
            placeholder=${this.placeholder || this.msg.placeholder}
            role="combobox"
            aria-expanded=${panelOpen ? 'true' : 'false'}
            aria-autocomplete="list"
            aria-controls=${listboxId}
            aria-activedescendant=${activeDescendant}
            aria-labelledby=${labelId || nothing}
            aria-describedby=${errorId || nothing}
            aria-invalid=${this.error ? 'true' : 'false'}
            ?disabled=${this.disabled}
            @input=${this.handleInput}
            @keydown=${this.handleKeyDown}
            @focus=${this.handleFocus}
            @blur=${this.handleBlur}
          />

          ${this.query.length > 0 && !this.disabled
            ? html`
                <button
                  type="button"
                  class="${this.getClearButtonClasses()}"
                  aria-label=${this.msg.clear}
                  @click=${this.handleClear}
                >
                  ×
                </button>
              `
            : nothing}

          ${panelOpen
            ? html`
                <div
                  class="${this.getPanelClasses()}"
                  role="listbox"
                  id=${listboxId}
                  @mousedown=${this.handlePanelPointerDown}
                  @mouseup=${this.handlePanelPointerUp}
                >
                  ${this.loading
                    ? html`
                        <div class="px-3 py-2 text-sm ml-text-muted">
                          ${this.msg.loading}
                        </div>
                      `
                    : this.renderSuggestions(suggestions)}
                </div>
              `
            : nothing}
        </div>

        ${this.renderFeedback(errorId)}
      </div>
    `;
  }

  private renderLabel(labelId: string): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    return html`
      <div
        id=${labelId}
        class=${cn('mb-2 text-sm ml-label', this.getSlotClass('Label'))}
      >
        ${unsafeHTML(this.getSlotContent('Label'))}
      </div>
    `;
  }

  private renderSuggestions(items: SuggestionItem[]): TemplateResult {
    if (items.length === 0) {
      const content = this.hasSlot('Empty')
        ? this.getSlotContent('Empty')
        : this.msg.empty;
      return html`
        <div class="px-3 py-2 text-sm ml-text-muted">
          ${unsafeHTML(content)}
        </div>
      `;
    }

    return html`
      ${items.map((item, index) => {
        const isActive = index === this.highlightedIndex;
        return html`
          <div
            id=${item.id}
            role="option"
            aria-selected=${isActive ? 'true' : 'false'}
            class="${this.getItemClasses(isActive)}"
            @click=${() => this.handleSuggestionClick(item)}
          >
            ${unsafeHTML(item.labelHtml)}
          </div>
        `;
      })}
    `;
  }

  private renderFeedback(errorId: string): TemplateResult {
    if (this.error) {
      return html`
        <p
          id=${errorId}
          class="mt-1 text-xs ml-error-text"
        >
          ${unsafeHTML(String(this.error))}
        </p>
      `;
    }

    if (this.hasSlot('Helper')) {
      return html`
        <p class=${cn('mt-1 text-xs ml-text-muted', this.getSlotClass('Helper'))}>
          ${unsafeHTML(this.getSlotContent('Helper'))}
        </p>
      `;
    }

    return html``;
  }

  // ===========================================================================
  // CLASSES
  // ===========================================================================
  private getInputClasses(): string {
    return [
      'w-full rounded-lg px-3 py-2 text-sm border transition',
      'ml-search-input',
      this.error
        ? 'ml-error-border'
        : 'ml-search-border',
      'ml-search-focus',
      this.disabled ? 'ml-disabled' : '',
      this.query.length > 0 && !this.disabled ? 'pr-9' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getClearButtonClasses(): string {
    return [
      'absolute right-2 top-1/2 -translate-y-1/2',
      'h-6 w-6 rounded-full ml-search-clear',
      'ml-search-focus',
    ].join(' ');
  }

  private getPanelClasses(): string {
    return [
      'absolute z-10 mt-2 w-full rounded-lg border',
      'ml-facet-group',
      'shadow-sm',
      'max-h-60 overflow-auto',
    ].join(' ');
  }

  private getItemClasses(isActive: boolean): string {
    return [
      'px-3 py-2 text-sm cursor-pointer transition',
      'ml-text',
      isActive
        ? 'ml-facet-option-selected'
        : 'border border-transparent',
      !isActive ? 'ml-facet-option' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}

type SuggestionItem = {
  id: string;
  value: string;
  labelHtml: string;
  labelText: string;
};
