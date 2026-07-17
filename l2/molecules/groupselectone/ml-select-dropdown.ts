/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-select-dropdown.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// SELECT DROPDOWN MOLECULE
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
  noSelection: '—',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: 'Selecione uma opção',
    noResults: 'Nenhum resultado encontrado',
    loading: 'Carregando...',
    searchPlaceholder: 'Buscar...',
    noSelection: '—',
  },
};
/// **collab_i18n_end**

interface ParsedItem {
  value: string;
  label: string;
  disabled: boolean;
  group?: string;
}

interface ParsedGroup {
  label: string;
  items: ParsedItem[];
}

@customElement('groupselectone--ml-select-dropdown')
export class MlSelectDropdownMolecule extends MoleculeAuraElement {
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
  protected portalWidgetName = 'groupselectone--ml-select-dropdown';
  private boundUpdatePosition: () => void;

  // ===========================================================================
  // CONSTRUCTOR
  // ===========================================================================
  constructor() {
    super();
    this.boundHandleOutsideClick = this.handleOutsideClick.bind(this);
    this.boundHandleKeydown = this.handleKeydown.bind(this);
    this.boundUpdatePosition = this.updatePanelPosition.bind(this);
  }

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
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
  // PARSING HELPERS
  // ===========================================================================
  private parseItems(): ParsedItem[] {
    const items: ParsedItem[] = [];
    const itemElements = this.getSlots('Item');
    
    for (const el of itemElements) {
      const value = el.getAttribute('value');
      if (value !== null) {
        items.push({
          value,
          label: el.innerHTML.trim(),
          disabled: el.hasAttribute('disabled'),
        });
      }
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
        const value = el.getAttribute('value');
        if (value !== null) {
          groupItems.push({
            value,
            label: el.innerHTML.trim(),
            disabled: el.hasAttribute('disabled'),
            group: groupLabel,
          });
        }
      }
      
      if (groupItems.length > 0) {
        groups.push({
          label: groupLabel,
          items: groupItems,
        });
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

  private findItem(value: string | null): ParsedItem | undefined {
    if (value === null) return undefined;
    return this.getAllItems().find(item => item.value === value);
  }

  private getFilteredItems(): ParsedItem[] {
    const allItems = this.getAllItems();
    if (!this.searchable || !this.searchQuery.trim()) {
      return allItems;
    }
    const query = this.searchQuery.toLowerCase().trim();
    return allItems.filter(item => 
      item.label.toLowerCase().includes(query)
    );
  }

  private getSelectableItems(): ParsedItem[] {
    return this.getFilteredItems().filter(item => !item.disabled);
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleTriggerClick(e: Event) {
    e.stopPropagation();
    if (this.disabled || this.readonly || this.loading) return;

    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchQuery = '';
      this.focusedIndex = -1;
      this.createPortal();
      this.dispatchEvent(new CustomEvent('focus', {
        bubbles: true,
        composed: true,
      }));
    } else {
      this.destroyPortal();
    }
  }

  private handleSelect(item: ParsedItem) {
    if (this.disabled || this.readonly || item.disabled) return;

    this.value = item.value;
    this.isOpen = false;
    this.searchQuery = '';
    this.focusedIndex = -1;
    this.destroyPortal();
    
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    }));
  }

  private handleOutsideClick(e: MouseEvent) {
    if (!this.isOpen) return;
    
    const path = e.composedPath();
    if (!path.includes(this) && (!this.portalContainer || !path.includes(this.portalContainer))) {
      this.isOpen = false;
      this.searchQuery = '';
      this.focusedIndex = -1;
      this.destroyPortal();
      this.dispatchEvent(new CustomEvent('blur', {
        bubbles: true,
        composed: true,
      }));
    }
  }

  private handleKeydown(e: KeyboardEvent) {
    if (!this.isOpen) return;
    
    const selectableItems = this.getSelectableItems();
    
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this.isOpen = false;
        this.searchQuery = '';
        this.focusedIndex = -1;
        this.destroyPortal();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (selectableItems.length > 0) {
          this.focusedIndex = Math.min(this.focusedIndex + 1, selectableItems.length - 1);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (selectableItems.length > 0) {
          this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (this.focusedIndex >= 0 && this.focusedIndex < selectableItems.length) {
          this.handleSelect(selectableItems[this.focusedIndex]);
        }
        break;
    }
  }

  private handleSearchInput(e: Event) {
    e.stopPropagation();
    const input = e.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.focusedIndex = -1;
  }

  // ===========================================================================
  // CSS HELPERS
  // ===========================================================================
  private getTriggerClasses(): string {
    const hasError = this.error !== '';

    return cn(
      'w-full flex items-center justify-between gap-2 px-3 py-2 text-sm transition-all focus:outline-none ml-select-trigger',
      hasError ? 'ml-select-trigger-error' : '',
      this.disabled ? 'ml-disabled' : '',
      this.readonly ? 'cursor-default' : '',
      !this.disabled && !this.readonly && !this.loading ? 'cursor-pointer' : '',
      this.isOpen && !hasError ? 'ml-select-trigger-open' : '',
      this.getSlotClass('Trigger'),
    );
  }

  private getDropdownClasses(): string {
    return 'w-full max-h-60 overflow-auto ml-select-panel';
  }

  private getItemClasses(item: ParsedItem, isSelected: boolean, isFocused: boolean): string {
    return cn(
      'w-full px-3 py-2 text-sm text-left transition-colors cursor-pointer ml-select-item',
      isSelected ? 'ml-select-item-selected' : '',
      isFocused && !item.disabled && !isSelected ? 'ml-select-item-highlighted' : '',
      item.disabled ? 'ml-disabled' : '',
      this.getSlotClass('Item'),
    );
  }

  private getSearchInputClasses(): string {
    return 'w-full px-3 py-2 text-sm focus:outline-none ml-select-search';
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;

    const labelContent = this.getSlotContent('Label');
    const labelId = `label-${this.name || 'select'}`;

    return html`
      <label
        id="${labelId}"
        class="${cn('block text-sm font-medium mb-1 ml-label', this.getSlotClass('Label'))}"
      >
        ${unsafeHTML(labelContent)}
        ${this.required ? html`<span class="ml-error-text ml-0.5">*</span>` : html``}
      </label>
    `;
  }

  private renderTriggerContent(): TemplateResult {
    const selectedItem = this.findItem(this.value);

    if (this.loading) {
      return html`
        <span class="flex items-center gap-2 ml-text-muted">
          <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          ${this.msg.loading}
        </span>
      `;
    }

    if (selectedItem) {
      return html`
        <span class="truncate ml-text">${unsafeHTML(selectedItem.label)}</span>
      `;
    }

    if (this.hasSlot('Trigger')) {
      return html`<span class="ml-text-muted truncate">${unsafeHTML(this.getSlotContent('Trigger'))}</span>`;
    }

    const placeholderText = this.placeholder || this.msg.placeholder;
    return html`<span class="ml-text-muted truncate">${placeholderText}</span>`;
  }

  private renderChevron(): TemplateResult {
    const rotateClass = this.isOpen ? 'rotate-180' : '';

    return html`
      <svg
        class="w-4 h-4 ml-text-muted transition-transform ${rotateClass} flex-shrink-0"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    `;
  }

  private renderTrigger(): TemplateResult {
    const hasError = this.error !== '';
    const labelId = this.hasSlot('Label') ? `label-${this.name || 'select'}` : undefined;
    const errorId = hasError ? `error-${this.name || 'select'}` : undefined;
    
    return html`
      <button
        type="button"
        role="combobox"
        aria-expanded="${this.isOpen}"
        aria-haspopup="listbox"
        aria-invalid="${hasError}"
        aria-required="${this.required}"
        aria-labelledby="${labelId || ''}"
        aria-describedby="${errorId || ''}"
        class="${this.getTriggerClasses()}"
        ?disabled="${this.disabled}"
        @click="${this.handleTriggerClick}"
      >
        ${this.renderTriggerContent()}
        ${this.renderChevron()}
      </button>
    `;
  }

  private renderSearchInput(): TemplateResult {
    if (!this.searchable) return html``;
    
    return html`
      <div class="sticky top-0 ml-select-search-container">
        <input
          type="text"
          class="${this.getSearchInputClasses()}"
          placeholder="${this.msg.searchPlaceholder}"
          .value="${this.searchQuery}"
          @input="${this.handleSearchInput}"
          @click="${(e: Event) => e.stopPropagation()}"
        
        @change="${(e: Event) => e.stopPropagation()}"
/>
      </div>
    `;
  }

  private renderItems(): TemplateResult {
    const filteredItems = this.getFilteredItems();
    const selectableItems = this.getSelectableItems();
    
    if (filteredItems.length === 0) {
      return this.renderEmpty();
    }
    
    const groups = this.parseGroups();
    const standaloneItems = this.parseItems();
    
    // Filter standalone items
    const filteredStandalone = standaloneItems.filter(item => {
      if (!this.searchable || !this.searchQuery.trim()) return true;
      return item.label.toLowerCase().includes(this.searchQuery.toLowerCase().trim());
    });
    
    // Filter grouped items
    const filteredGroups = groups.map(group => ({
      ...group,
      items: group.items.filter(item => {
        if (!this.searchable || !this.searchQuery.trim()) return true;
        return item.label.toLowerCase().includes(this.searchQuery.toLowerCase().trim());
      }),
    })).filter(group => group.items.length > 0);
    
    let globalIndex = 0;
    
    return html`
      <div role="listbox" class="py-1">
        ${filteredStandalone.map(item => {
          const isSelected = item.value === this.value;
          const selectableIndex = selectableItems.findIndex(si => si.value === item.value);
          const isFocused = selectableIndex === this.focusedIndex;
          globalIndex++;
          
          return html`
            <button
              type="button"
              role="option"
              aria-selected="${isSelected}"
              aria-disabled="${item.disabled}"
              class="${this.getItemClasses(item, isSelected, isFocused)}"
              @click="${() => this.handleSelect(item)}"
            >
              ${unsafeHTML(item.label)}
            </button>
          `;
        })}
        
        ${filteredGroups.map(group => html`
          <div class="pt-2 first:pt-0">
            <div class="${cn('px-3 py-1 text-xs font-semibold uppercase tracking-wider ml-select-group-label', this.getSlotClass('Group'))}">
              ${group.label}
            </div>
            ${group.items.map(item => {
              const isSelected = item.value === this.value;
              const selectableIndex = selectableItems.findIndex(si => si.value === item.value);
              const isFocused = selectableIndex === this.focusedIndex;
              globalIndex++;
              
              return html`
                <button
                  type="button"
                  role="option"
                  aria-selected="${isSelected}"
                  aria-disabled="${item.disabled}"
                  class="${this.getItemClasses(item, isSelected, isFocused)}"
                  @click="${() => this.handleSelect(item)}"
                >
                  ${unsafeHTML(item.label)}
                </button>
              `;
            })}
          </div>
        `)}
      </div>
    `;
  }

  private renderEmpty(): TemplateResult {
    const emptyContent = this.hasSlot('Empty')
      ? this.getSlotContent('Empty')
      : this.msg.noResults;

    return html`
      <div class="${cn('px-3 py-4 text-sm text-center ml-select-empty', this.getSlotClass('Empty'))}">
        ${unsafeHTML(emptyContent)}
      </div>
    `;
  }

  // ===========================================================================
  // PORTAL
  // ===========================================================================
  private createPortal() {
    if (this.portalContainer) return;
    this.portalContainer = document.createElement('div');
    if (this.portalWidgetName) this.portalContainer.setAttribute('data-widget', this.portalWidgetName);
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
      top: `${rect.bottom + 4}px`,
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
      <div class="${this.getDropdownClasses()}">
        ${this.renderSearchInput()}
        ${this.renderItems()}
      </div>
    `;
  }

  private renderHelper(): TemplateResult {
    if (!this.hasSlot('Helper')) return html``;

    return html`
      <p class="${cn('mt-1 text-xs ml-helper', this.getSlotClass('Helper'))}">
        ${unsafeHTML(this.getSlotContent('Helper'))}
      </p>
    `;
  }

  private renderError(): TemplateResult {
    if (this.error === '') return html``;

    const errorId = `error-${this.name || 'select'}`;

    return html`
      <p id="${errorId}" class="mt-1 text-xs ml-error-text">
        ${this.error}
      </p>
    `;
  }

  private renderFeedback(): TemplateResult {
    if (this.error !== '') {
      return this.renderError();
    }
    return this.renderHelper();
  }

  private renderViewMode(): TemplateResult {
    const selectedItem = this.findItem(this.value);
    const displayValue = selectedItem
      ? selectedItem.label
      : this.msg.noSelection;

    return html`
      <div class="text-sm ml-text">
        ${this.hasSlot('Label') ? html`
          <span class="ml-text-muted">
            ${unsafeHTML(this.getSlotContent('Label'))}:
          </span>
          <span class="ml-1">${unsafeHTML(displayValue)}</span>
        ` : html`
          ${unsafeHTML(displayValue)}
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
