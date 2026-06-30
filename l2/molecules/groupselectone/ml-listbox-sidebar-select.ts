/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-listbox-sidebar-select.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// LISTBOX SIDEBAR SELECT MOLECULE
// =============================================================================
// Skill Group: groupSelectOne
// A permanently open listbox for sidebar master-detail selection.
// This molecule does NOT contain business logic.

import { html, TemplateResult } from 'lit';
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
    searchPlaceholder: 'Pesquisar...',
    noSelection: '—',
  },
};
/// **collab_i18n_end**

interface ParsedItem {
  value: string;
  label: string;
  disabled: boolean;
  groupLabel?: string;
}

interface ParsedGroup {
  label: string;
  items: ParsedItem[];
}

@customElement('groupselectone--ml-listbox-sidebar-select')
export class MlListboxSidebarSelectMolecule extends MoleculeAuraElement {
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

  @propertyDataSource({ type: Boolean })
  searchable: boolean = false;

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
  private searchQuery: string = '';

  @state()
  private focusedIndex: number = -1;

  private listboxId = `listbox-${Math.random().toString(36).substr(2, 9)}`;
  private labelId = `label-${Math.random().toString(36).substr(2, 9)}`;
  private errorId = `error-${Math.random().toString(36).substr(2, 9)}`;

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.handleKeyDown);
  }

  // ===========================================================================
  // ITEM PARSING
  // ===========================================================================
  private parseItems(): { items: ParsedItem[]; groups: ParsedGroup[] } {
    const items: ParsedItem[] = [];
    const groups: ParsedGroup[] = [];

    const groupElements = this.getSlots('Group');
    const standaloneItems = this.getSlots('Item');

    // Parse grouped items
    groupElements.forEach((groupEl) => {
      const groupLabel = groupEl.getAttribute('label') || '';
      const groupItems: ParsedItem[] = [];

      const itemElements = groupEl.querySelectorAll('Item');
      itemElements.forEach((itemEl) => {
        const item: ParsedItem = {
          value: itemEl.getAttribute('value') || '',
          label: itemEl.innerHTML.trim(),
          disabled: itemEl.hasAttribute('disabled'),
          groupLabel,
        };
        groupItems.push(item);
        items.push(item);
      });

      if (groupItems.length > 0) {
        groups.push({ label: groupLabel, items: groupItems });
      }
    });

    // Parse standalone items
    standaloneItems.forEach((itemEl) => {
      const item: ParsedItem = {
        value: itemEl.getAttribute('value') || '',
        label: itemEl.innerHTML.trim(),
        disabled: itemEl.hasAttribute('disabled'),
      };
      items.push(item);
    });

    return { items, groups };
  }

  private findItem(value: string | null): ParsedItem | undefined {
    if (value === null) return undefined;
    const { items } = this.parseItems();
    return items.find((item) => item.value === value);
  }

  private getFilteredItems(): { items: ParsedItem[]; groups: ParsedGroup[] } {
    const { items, groups } = this.parseItems();
    const query = this.searchQuery.toLowerCase().trim();

    if (!query) {
      return { items, groups };
    }

    const filteredItems = items.filter((item) =>
      item.label.toLowerCase().includes(query)
    );

    const filteredGroups = groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.label.toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.items.length > 0);

    return { items: filteredItems, groups: filteredGroups };
  }

  private getSelectableItems(): ParsedItem[] {
    const { items } = this.getFilteredItems();
    return items.filter((item) => !item.disabled);
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleSelect(item: ParsedItem) {
    if (this.disabled || this.readonly || this.loading || item.disabled) return;

    this.value = item.value;
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    );
  }

  private handleSearchInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.focusedIndex = -1;
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.isEditing || this.disabled || this.readonly || this.loading) return;

    const selectableItems = this.getSelectableItems();
    if (selectableItems.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.focusedIndex = Math.min(
          this.focusedIndex + 1,
          selectableItems.length - 1
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (this.focusedIndex >= 0 && this.focusedIndex < selectableItems.length) {
          this.handleSelect(selectableItems[this.focusedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.focusedIndex = -1;
        break;
    }
  };

  private handleFocus() {
    this.dispatchEvent(
      new CustomEvent('focus', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleBlur() {
    this.dispatchEvent(
      new CustomEvent('blur', {
        bubbles: true,
        composed: true,
      })
    );
  }

  // ===========================================================================
  // CSS CLASSES
  // ===========================================================================
  private getContainerClasses(): string {
    return ['flex flex-col gap-1.5 w-full'].join(' ');
  }

  private getLabelClasses(): string {
    return [
      'text-sm font-medium',
      'ml-label',
    ].join(' ');
  }

  private getPanelClasses(): string {
    return [
      'w-full rounded-lg border overflow-hidden',
      'ml-listbox-panel',
      this.error
        ? 'ml-listbox-panel-error'
        : '',
      this.disabled ? 'ml-disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getSearchInputClasses(): string {
    return [
      'w-full px-3 py-2 text-sm border-b',
      'ml-listbox-search',
      'focus:outline-none focus:ring-2 focus:ring-inset',
      this.disabled || this.readonly ? 'cursor-not-allowed' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getListClasses(): string {
    return [
      'max-h-64 overflow-y-auto',
      'ml-listbox-divider',
    ].join(' ');
  }

  private getGroupLabelClasses(): string {
    return [
      'px-3 py-2 text-xs font-semibold uppercase tracking-wider',
      'ml-listbox-group-label',
    ].join(' ');
  }

  private getItemClasses(item: ParsedItem, isSelected: boolean, isFocused: boolean): string {
    return [
      'w-full px-3 py-2.5 text-sm text-left transition-colors',
      'flex items-center gap-2',
      isSelected
        ? 'ml-listbox-item-selected'
        : 'ml-listbox-item',
      isFocused && !isSelected
        ? 'ml-listbox-item-focused'
        : '',
      !item.disabled && !isSelected && !isFocused
        ? 'ml-listbox-item-hover'
        : '',
      item.disabled
        ? 'ml-disabled ml-text-muted'
        : 'cursor-pointer',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getHelperClasses(): string {
    return ['text-xs ml-helper'].join(' ');
  }

  private getErrorClasses(): string {
    return ['text-xs ml-error-text'].join(' ');
  }

  private getViewModeClasses(): string {
    return [
      'text-sm',
      'ml-text',
    ].join(' ');
  }

  private getLoadingClasses(): string {
    return [
      'flex items-center justify-center gap-2 py-8',
      'text-sm ml-text-muted',
    ].join(' ');
  }

  private getEmptyClasses(): string {
    return [
      'flex items-center justify-center py-8',
      'text-sm ml-text-muted',
    ].join(' ');
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;

    return html`
      <label id=${this.labelId} class=${cn(this.getLabelClasses(), this.getSlotClass('Label'))}>
        ${unsafeHTML(this.getSlotContent('Label'))}
        ${this.required ? html`<span class="ml-error-text ml-0.5">*</span>` : html``}
      </label>
    `;
  }

  private renderSearchInput(): TemplateResult {
    if (!this.searchable) return html``;

    return html`
      <input
        type="text"
        class=${this.getSearchInputClasses()}
        placeholder=${this.msg.searchPlaceholder}
        .value=${this.searchQuery}
        @input=${this.handleSearchInput}
        ?disabled=${this.disabled || this.readonly}
        aria-label=${this.msg.searchPlaceholder}
      />
    `;
  }

  private renderItem(item: ParsedItem, index: number): TemplateResult {
    const isSelected = this.value === item.value;
    const selectableItems = this.getSelectableItems();
    const selectableIndex = selectableItems.findIndex((i) => i.value === item.value);
    const isFocused = selectableIndex === this.focusedIndex;

    return html`
      <button
        type="button"
        role="option"
        class=${this.getItemClasses(item, isSelected, isFocused)}
        aria-selected=${isSelected}
        aria-disabled=${item.disabled}
        ?disabled=${item.disabled}
        @click=${() => this.handleSelect(item)}
      >
        ${isSelected
          ? html`
              <svg
                class="w-4 h-4 ml-listbox-check flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            `
          : html`<span class="w-4 h-4 flex-shrink-0"></span>`}
        <span class="flex-1">${unsafeHTML(item.label)}</span>
      </button>
    `;
  }

  private renderGroupedItems(): TemplateResult {
    const { items, groups } = this.getFilteredItems();

    // Get standalone items (items without a group)
    const groupedValues = new Set(
      groups.flatMap((g) => g.items.map((i) => i.value))
    );
    const standaloneItems = items.filter((item) => !groupedValues.has(item.value) || !item.groupLabel);

    if (items.length === 0) {
      return this.renderEmpty();
    }

    let itemIndex = 0;

    return html`
      ${groups.map(
        (group) => html`
          <div>
            <div class=${this.getGroupLabelClasses()}>${group.label}</div>
            ${group.items.map((item) => {
              const result = this.renderItem(item, itemIndex);
              itemIndex++;
              return result;
            })}
          </div>
        `
      )}
      ${standaloneItems.map((item) => {
        const result = this.renderItem(item, itemIndex);
        itemIndex++;
        return result;
      })}
    `;
  }

  private renderEmpty(): TemplateResult {
    const emptyContent = this.hasSlot('Empty')
      ? this.getSlotContent('Empty')
      : this.msg.noResults;

    return html`
      <div class=${this.getEmptyClasses()}>
        ${unsafeHTML(emptyContent)}
      </div>
    `;
  }

  private renderLoading(): TemplateResult {
    return html`
      <div class=${this.getLoadingClasses()}>
        <svg
          class="animate-spin h-4 w-4 ml-listbox-spinner"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span>${this.msg.loading}</span>
      </div>
    `;
  }

  private renderHelper(): TemplateResult {
    if (this.error) {
      return html`
        <p id=${this.errorId} class=${this.getErrorClasses()}>
          ${unsafeHTML(this.error)}
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

  private renderViewMode(): TemplateResult {
    const selectedItem = this.findItem(this.value);
    const displayText = selectedItem
      ? selectedItem.label
      : this.placeholder || this.msg.noSelection;

    return html`
      <div class=${cn(this.getContainerClasses(), this.cssClass)}>
        ${this.renderLabel()}
        <span class=${this.getViewModeClasses()}>
          ${unsafeHTML(displayText)}
        </span>
      </div>
    `;
  }

  private renderEditMode(): TemplateResult {
    const hasError = !!this.error;
    const { items } = this.parseItems();
    const hasItems = items.length > 0;

    return html`
      <div class=${cn(this.getContainerClasses(), this.cssClass)}>
        ${this.renderLabel()}
        <div
          class=${this.getPanelClasses()}
          role="listbox"
          id=${this.listboxId}
          aria-labelledby=${this.hasSlot('Label') ? this.labelId : ''}
          aria-describedby=${hasError ? this.errorId : ''}
          aria-invalid=${hasError}
          aria-required=${this.required}
          aria-disabled=${this.disabled}
          tabindex=${this.disabled ? -1 : 0}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
        >
          ${this.renderSearchInput()}
          <div class=${this.getListClasses()}>
            ${this.loading
              ? this.renderLoading()
              : hasItems
                ? this.renderGroupedItems()
                : this.renderEmpty()}
          </div>
        </div>
        ${this.renderHelper()}
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
