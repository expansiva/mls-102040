/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-card-selector.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// CARD SELECTOR MOLECULE
// =============================================================================
// Skill Group: groupSelectOne
// This molecule does NOT contain business logic.

import { html, render as litRender, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  placeholder: 'Select an option',
  noResults: 'No results found',
  loading: 'Loading...',
  searchPlaceholder: 'Search...',
  noValue: '—',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: 'Selecione uma opção',
    noResults: 'Nenhum resultado encontrado',
    loading: 'Carregando...',
    searchPlaceholder: 'Buscar...',
    noValue: '—',
  },
};
/// **collab_i18n_end**

interface ParsedItem {
  value: string;
  label: string;
  disabled: boolean;
  content: string;
  group?: string;
}

interface ParsedGroup {
  label: string;
  items: ParsedItem[];
}

@customElement('groupselectone--ml-card-selector')
export class MlCardSelectorMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Helper', 'Trigger', 'Item', 'Group', 'Empty'];

  // ===========================================================================
  // PROPERTIES — Data
  // ===========================================================================
  @propertyDataSource({ type: String })
  value: string | null = null;

  @propertyDataSource({ type: String })
  error: string = '';

  @propertyDataSource({ type: String })
  name: string = '';

  // ===========================================================================
  // PROPERTIES — Configuration
  // ===========================================================================
  @propertyDataSource({ type: String })
  placeholder: string = '';

  @propertyDataSource({ type: Boolean })
  searchable: boolean = false;

  // ===========================================================================
  // PROPERTIES — States
  // ===========================================================================
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
  private searchQuery: string = '';

  @state()
  private focusedIndex: number = -1;

  private boundHandleOutsideClick: (e: MouseEvent) => void;
  private boundHandleKeydown: (e: KeyboardEvent) => void;
  protected portalContainer: HTMLDivElement | null = null;
  protected portalWidgetName = 'groupselectone--ml-card-selector';
  private boundUpdatePosition: () => void;

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  constructor() {
    super();
    this.boundHandleOutsideClick = this.handleOutsideClick.bind(this);
    this.boundHandleKeydown = this.handleKeydown.bind(this);
    this.boundUpdatePosition = this.updatePanelPosition.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.boundHandleOutsideClick);
    document.addEventListener('keydown', this.boundHandleKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.boundHandleOutsideClick);
    document.removeEventListener('keydown', this.boundHandleKeydown);
    this.destroyPortal();
  }

  updated(_changedProperties: Map<string, unknown>) {
    super.updated(_changedProperties);
    if (this.isOpen && this.portalContainer) {
      this.renderPortalContent();
      this.updatePanelPosition();
    }
  }

  // ===========================================================================
  // PARSING
  // ===========================================================================
  private parseItems(): ParsedItem[] {
    const items: ParsedItem[] = [];
    const itemElements = this.getSlots('Item');

    for (const el of itemElements) {
      const value = el.getAttribute('value') || '';
      const disabled = el.hasAttribute('disabled');
      const label = el.textContent?.trim() || value;
      const content = el.innerHTML;
      items.push({ value, label, disabled, content });
    }

    return items;
  }

  private parseGroups(): ParsedGroup[] {
    const groups: ParsedGroup[] = [];
    const groupElements = this.getSlots('Group');

    for (const groupEl of groupElements) {
      const groupLabel = groupEl.getAttribute('label') || '';
      const groupItems: ParsedItem[] = [];
      const itemElements = groupEl.querySelectorAll('Item');

      for (const el of Array.from(itemElements)) {
        const value = el.getAttribute('value') || '';
        const disabled = el.hasAttribute('disabled');
        const label = el.textContent?.trim() || value;
        const content = el.innerHTML;
        groupItems.push({ value, label, disabled, content, group: groupLabel });
      }

      if (groupItems.length > 0) {
        groups.push({ label: groupLabel, items: groupItems });
      }
    }

    return groups;
  }

  private getAllItems(): ParsedItem[] {
    const standaloneItems = this.parseItems();
    const groups = this.parseGroups();
    const groupedItems = groups.flatMap(g => g.items);
    return [...standaloneItems, ...groupedItems];
  }

  private getFilteredItems(items: ParsedItem[]): ParsedItem[] {
    if (!this.searchable || !this.searchQuery.trim()) {
      return items;
    }
    const query = this.searchQuery.toLowerCase().trim();
    return items.filter(item =>
      item.label.toLowerCase().includes(query) ||
      item.value.toLowerCase().includes(query)
    );
  }

  private findItem(value: string | null): ParsedItem | undefined {
    if (value === null) return undefined;
    return this.getAllItems().find(item => item.value === value);
  }

  private getSelectableItems(): ParsedItem[] {
    return this.getFilteredItems(this.getAllItems()).filter(item => !item.disabled);
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleOutsideClick(e: MouseEvent) {
    if (!this.isOpen) return;
    const path = e.composedPath();
    if (!path.includes(this) && (!this.portalContainer || !path.includes(this.portalContainer))) {
      this.closePanel();
    }
  }

  private handleKeydown(e: KeyboardEvent) {
    if (!this.isOpen) return;

    const selectableItems = this.getSelectableItems();
    if (selectableItems.length === 0) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this.closePanel();
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.focusedIndex = Math.min(this.focusedIndex + 1, selectableItems.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.focusedIndex = Math.min(this.focusedIndex + 1, selectableItems.length - 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (this.focusedIndex >= 0 && this.focusedIndex < selectableItems.length) {
          this.handleSelect(selectableItems[this.focusedIndex].value);
        }
        break;
    }
  }

  private handleTriggerClick(e: Event) {
    e.stopPropagation();
    if (this.disabled || this.readonly || this.loading) return;

    if (this.isOpen) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  private handleSelect(value: string) {
    if (this.disabled || this.readonly) return;

    this.value = value;
    this.closePanel();

    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value }
    }));
  }

  private handleSearchInput(e: Event) {
    e.stopPropagation();
    const input = e.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.focusedIndex = 0;
  }

  private handleFocus() {
    this.dispatchEvent(new CustomEvent('focus', {
      bubbles: true,
      composed: true,
    }));
  }

  private handleBlur() {
    this.dispatchEvent(new CustomEvent('blur', {
      bubbles: true,
      composed: true,
    }));
  }

  private openPanel() {
    this.isOpen = true;
    this.searchQuery = '';
    this.focusedIndex = 0;
    this.createPortal();
    this.handleFocus();
  }

  private closePanel() {
    this.isOpen = false;
    this.searchQuery = '';
    this.focusedIndex = -1;
    this.destroyPortal();
    this.handleBlur();
  }

  // ===========================================================================
  // CSS CLASSES
  // ===========================================================================
  private getTriggerClasses(): string {
    const hasError = this.error !== '';
    return cn(
      'w-full min-h-[44px] rounded-lg px-4 py-3 text-sm border transition',
      'flex items-center justify-between gap-2 cursor-pointer ml-select-trigger',
      hasError ? 'ml-select-trigger-error' : '',
      this.isOpen ? 'ml-select-trigger-open' : '',
      this.disabled ? 'ml-disabled' : '',
      this.readonly ? 'cursor-default' : '',
      this.getSlotClass('Trigger'),
    );
  }

  private getPanelClasses(): string {
    return 'w-full max-h-[400px] overflow-auto rounded-lg border ml-select-panel';
  }

  private getCardClasses(item: ParsedItem, isSelected: boolean, isFocused: boolean): string {
    const hasError = this.error !== '';
    return cn(
      'rounded-lg border-2 p-4 transition cursor-pointer ml-card-option',
      isSelected ? 'ml-card-option-selected' : '',
      hasError ? 'ml-card-option-error' : '',
      isFocused && !isSelected ? 'ml-select-item-highlighted' : '',
      item.disabled ? 'ml-disabled' : '',
      this.getSlotClass('Item'),
    );
  }

  private getSearchInputClasses(): string {
    return 'w-full rounded-lg px-3 py-2 text-sm border transition focus:outline-none focus:ring-2 ml-combobox-input ml-select-trigger';
  }

  private getGroupLabelClasses(): string {
    return 'text-xs font-semibold uppercase tracking-wider mb-2 ml-text-muted';
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    const labelContent = this.getSlotContent('Label');
    const labelId = `label-${this.name || 'card-selector'}`;
    return html`
      <label
        id="${labelId}"
        class="${cn('block text-sm font-medium mb-1.5 ml-label', this.getSlotClass('Label'))}"
      >
        ${unsafeHTML(labelContent)}
        ${this.required ? html`<span class="ml-error-text ml-0.5">*</span>` : html``}
      </label>
    `;
  }

  private renderTrigger(): TemplateResult {
    const selectedItem = this.findItem(this.value);
    const placeholderText = this.placeholder || this.getSlotContent('Trigger') || this.msg.placeholder;
    const hasError = this.error !== '';
    const labelId = `label-${this.name || 'card-selector'}`;
    const errorId = `error-${this.name || 'card-selector'}`;

    return html`
      <button
        type="button"
        role="combobox"
        aria-expanded="${this.isOpen}"
        aria-haspopup="listbox"
        aria-labelledby="${this.hasSlot('Label') ? labelId : ''}"
        aria-describedby="${hasError ? errorId : ''}"
        aria-invalid="${hasError}"
        aria-required="${this.required}"
        ?disabled="${this.disabled}"
        class="${this.getTriggerClasses()}"
        @click="${this.handleTriggerClick}"
      >
        <span class="flex-1 text-left ${!selectedItem ? 'ml-text-muted' : ''}">
          ${this.loading
            ? html`<span class="flex items-center gap-2 ml-text-muted">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                ${this.msg.loading}
              </span>`
            : selectedItem
              ? selectedItem.label
              : unsafeHTML(placeholderText)
          }
        </span>
        <svg
          class="w-5 h-5 ml-text-muted transition-transform ${this.isOpen ? 'rotate-180' : ''}"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
    `;
  }

  private renderSearch(): TemplateResult {
    if (!this.searchable) return html``;

    return html`
      <div class="p-3 border-b ml-select-panel">
        <input
          type="text"
          class="${this.getSearchInputClasses()}"
          placeholder="${this.msg.searchPlaceholder}"
          .value="${this.searchQuery}"
          @input="${this.handleSearchInput}"
        
        @change="${(e: Event) => e.stopPropagation()}"
/>
      </div>
    `;
  }

  private renderCard(item: ParsedItem, index: number): TemplateResult {
    const isSelected = this.value === item.value;
    const selectableItems = this.getSelectableItems();
    const selectableIndex = selectableItems.findIndex(i => i.value === item.value);
    const isFocused = selectableIndex === this.focusedIndex;

    return html`
      <div
        role="option"
        aria-selected="${isSelected}"
        aria-disabled="${item.disabled}"
        class="${this.getCardClasses(item, isSelected, isFocused)}"
        @click="${() => !item.disabled && this.handleSelect(item.value)}"
      >
        <div class="flex items-start gap-3">
          <div class="flex-1">
            ${unsafeHTML(item.content)}
          </div>
          ${isSelected ? html`
            <div class="flex-shrink-0">
              <svg class="w-5 h-5 ml-select-checkmark" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
            </div>
          ` : html``}
        </div>
      </div>
    `;
  }

  private renderCardGrid(): TemplateResult {
    const standaloneItems = this.getFilteredItems(this.parseItems());
    const groups = this.parseGroups();
    const hasItems = standaloneItems.length > 0 || groups.some(g => this.getFilteredItems(g.items).length > 0);

    if (!hasItems) {
      return this.renderEmpty();
    }

    let itemIndex = 0;

    return html`
      <div class="p-4">
        ${groups.map(group => {
          const filteredGroupItems = this.getFilteredItems(group.items);
          if (filteredGroupItems.length === 0) return html``;
          return html`
            <div class="mb-4 last:mb-0">
              <div class="${this.getGroupLabelClasses()}">${group.label}</div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                ${filteredGroupItems.map(item => {
                  const card = this.renderCard(item, itemIndex);
                  itemIndex++;
                  return card;
                })}
              </div>
            </div>
          `;
        })}
        ${standaloneItems.length > 0 ? html`
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            ${standaloneItems.map(item => {
              const card = this.renderCard(item, itemIndex);
              itemIndex++;
              return card;
            })}
          </div>
        ` : html``}
      </div>
    `;
  }

  private renderEmpty(): TemplateResult {
    const emptyContent = this.hasSlot('Empty')
      ? this.getSlotContent('Empty')
      : this.msg.noResults;

    return html`
      <div class="p-8 text-center ml-select-empty">
        ${unsafeHTML(emptyContent)}
      </div>
    `;
  }

  private createPortal() {
    if (this.portalContainer) return;
    this.portalContainer = document.createElement('div');
    if (this.portalWidgetName) {
      this.portalContainer.setAttribute('data-widget', this.portalWidgetName);
    }
    document.body.appendChild(this.portalContainer);
    this.updatePanelPosition();
    this.renderPortalContent();
    window.addEventListener('scroll', this.boundUpdatePosition, true);
    window.addEventListener('resize', this.boundUpdatePosition);
  }

  private destroyPortal() {
    if (!this.portalContainer) return;
    window.removeEventListener('scroll', this.boundUpdatePosition, true);
    window.removeEventListener('resize', this.boundUpdatePosition);
    this.portalContainer.remove();
    this.portalContainer = null;
  }

  private updatePanelPosition() {
    if (!this.portalContainer) return;
    const trigger = this.querySelector('button[role="combobox"]') as HTMLElement;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    Object.assign(this.portalContainer.style, {
      position: 'fixed',
      top: `${rect.bottom + 8}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: '9999',
    });
  }

  private renderPortalContent() {
    if (!this.portalContainer) return;
    litRender(this.getPortalTemplate(), this.portalContainer, { host: this });
  }

  protected getPortalTemplate(): TemplateResult {
    return html`
      <div role="listbox" class="${this.getPanelClasses()}">
        ${this.renderSearch()}
        ${this.renderCardGrid()}
      </div>
    `;
  }

  private renderHelper(): TemplateResult {
    if (!this.hasSlot('Helper')) return html``;
    const helperContent = this.getSlotContent('Helper');
    return html`
      <p class="${cn('mt-1.5 text-xs ml-helper', this.getSlotClass('Helper'))}">
        ${unsafeHTML(helperContent)}
      </p>
    `;
  }

  private renderError(): TemplateResult {
    if (!this.error) return html``;
    const errorId = `error-${this.name || 'card-selector'}`;
    return html`
      <p id="${errorId}" class="mt-1.5 text-xs ml-error-text">
        ${unsafeHTML(this.error)}
      </p>
    `;
  }

  private renderFeedback(): TemplateResult {
    if (this.error) {
      return this.renderError();
    }
    return this.renderHelper();
  }

  private renderViewMode(): TemplateResult {
    const selectedItem = this.findItem(this.value);
    const displayValue = selectedItem
      ? selectedItem.label
      : (this.placeholder || this.msg.noValue);

    return html`
      <div class="${cn('text-sm ml-text', this.cssClass)}">
        ${this.hasSlot('Label') ? html`
          <span class="${cn('ml-text-muted', this.getSlotClass('Label'))}">
            ${unsafeHTML(this.getSlotContent('Label'))}:
          </span>
          <span class="ml-1">${displayValue}</span>
        ` : html`
          <span>${displayValue}</span>
        `}
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
      <div class="${cn('relative w-full', this.cssClass)}">
        ${this.renderLabel()}
        ${this.renderTrigger()}
        ${this.renderFeedback()}
      </div>
    `;
  }
}
