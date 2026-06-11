/// <mls fileReference="_102040_/l2/molecules/groupselectone/ml-combobox.ts" enhancement="_102020_/l2/enhancementAura" />

// =============================================================================
// ML COMBOBOX MOLECULE
// =============================================================================
// Skill Group: groupSelectOne
// This molecule does NOT contain business logic.

import { html, nothing, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { customElement, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  placeholder: 'Search or select...',
  empty: 'No options found',
  loading: 'Loading...',
  clear: 'Clear value',
  useValue: 'Use',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: 'Pesquisar ou selecionar...',
    empty: 'Nenhuma opção encontrada',
    loading: 'Carregando...',
    clear: 'Limpar valor',
    useValue: 'Usar',
  },
};
/// **collab_i18n_end**

// =============================================================================
// TYPES
// =============================================================================
interface ComboItem {
  value: string;
  label: string;
  labelText: string;
  disabled: boolean;
}

interface ComboGroup {
  label: string;
  items: ComboItem[];
}

@customElement('groupselectone--ml-combobox')
export class MlComboboxMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Helper', 'Item', 'Group', 'Empty'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: String })
  value: string | null = null;

  @propertyDataSource({ type: String })
  placeholder = '';

  @propertyDataSource({ type: String })
  name = '';

  @propertyDataSource({ type: String })
  error = '';

  /** When true, any typed text is accepted as the value (not just list items). */
  @propertyDataSource({ type: Boolean, attribute: 'free-text' })
  freeText = false;

  /** Show a clear (×) button when the field has a value. */
  @propertyDataSource({ type: Boolean })
  clearable = false;

  @propertyDataSource({ type: Boolean, attribute: 'is-editing' })
  isEditing = true;

  @propertyDataSource({ type: Boolean })
  disabled = false;

  @propertyDataSource({ type: Boolean })
  readonly = false;

  @propertyDataSource({ type: Boolean })
  required = false;

  @propertyDataSource({ type: Boolean })
  loading = false;

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state() private inputText = '';
  @state() private isOpen = false;
  @state() private activeIndex = -1;

  private uid = `combo-${Math.random().toString(36).slice(2)}`;
  private lastValueSynced: string | null = undefined as any;

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this._boundDocClick = this._boundDocClick.bind(this);
    document.addEventListener('click', this._boundDocClick);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._boundDocClick);
    super.disconnectedCallback();
  }

  private _boundDocClick(event: MouseEvent) {
    if (!this.isOpen) return;
    if (!this.contains(event.target as Node)) this.closeAndResolve();
  }

  firstUpdated() {
    this.syncInputFromValue();
    this.lastValueSynced = this.value;
  }

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('value')) {
      this.syncInputFromValue();
      this.lastValueSynced = this.value;
    }
  }

  // ===========================================================================
  // PARSERS
  // ===========================================================================
  private toPlainText(rawHtml: string): string {
    return rawHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  private parseItems(): { standalone: ComboItem[]; groups: ComboGroup[] } {
    const standalone: ComboItem[] = this.getSlots('Item')
      .filter(el => !el.closest('Group'))
      .map(el => ({
        value: el.getAttribute('value') || '',
        label: el.innerHTML,
        labelText: this.toPlainText(el.innerHTML),
        disabled: el.hasAttribute('disabled'),
      }));

    const groups: ComboGroup[] = this.getSlots('Group').map(group => ({
      label: group.getAttribute('label') || '',
      items: Array.from(group.querySelectorAll('Item')).map(el => ({
        value: el.getAttribute('value') || '',
        label: el.innerHTML,
        labelText: this.toPlainText(el.innerHTML),
        disabled: el.hasAttribute('disabled'),
      })),
    }));

    return { standalone, groups };
  }

  private getAllItems(): ComboItem[] {
    const { standalone, groups } = this.parseItems();
    return [...standalone, ...groups.flatMap(g => g.items)];
  }

  private filterItems(items: ComboItem[], query: string): ComboItem[] {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(i => i.labelText.toLowerCase().includes(q));
  }

  // ===========================================================================
  // HELPERS
  // ===========================================================================
  private syncInputFromValue() {
    if (!this.value) { this.inputText = ''; return; }
    const found = this.getAllItems().find(i => i.value === this.value);
    this.inputText = found ? found.labelText : (this.freeText ? this.value : '');
  }

  private getFlatVisible(
    filteredStandalone: ComboItem[],
    filteredGroups: ComboGroup[],
  ): ComboItem[] {
    return [...filteredStandalone, ...filteredGroups.flatMap(g => g.items)];
  }

  private getNextEnabledIndex(items: ComboItem[], start: number, step: number): number {
    if (!items.length) return -1;
    let idx = start;
    for (let i = 0; i < items.length; i++) {
      idx = (idx + step + items.length) % items.length;
      if (!items[idx].disabled) return idx;
    }
    return -1;
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleInputFocus() {
    if (!this.isEditing || this.disabled || this.readonly || this.loading) return;
    this.isOpen = true;
    this.activeIndex = -1;
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
  }

  private handleInputInput(event: Event) {
    if (!this.isEditing || this.disabled || this.readonly) return;
    this.inputText = (event.target as HTMLInputElement).value;
    this.isOpen = true;
    this.activeIndex = -1;
    this.dispatchEvent(new CustomEvent('input', {
      bubbles: true, composed: true, detail: { value: this.inputText },
    }));
  }

  private handleInputBlur() {
    if (!this.isEditing) return;
    // Delay so mousedown on an option fires selectItem before blur resolves
    setTimeout(() => {
      if (!this.isOpen) {
        this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
      }
    }, 150);
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.isEditing || this.disabled || this.readonly || this.loading) return;

    const { standalone, groups } = this.parseItems();
    const q = this.inputText;
    const flatItems = this.getFlatVisible(
      this.filterItems(standalone, q),
      groups.map(g => ({ ...g, items: this.filterItems(g.items, q) })).filter(g => g.items.length > 0),
    );

    switch (event.key) {
      case 'Escape':
        this.closeAndResolve();
        event.preventDefault();
        break;
      case 'ArrowDown':
        if (!this.isOpen) this.isOpen = true;
        this.activeIndex = this.getNextEnabledIndex(flatItems, this.activeIndex, 1);
        event.preventDefault();
        break;
      case 'ArrowUp':
        if (!this.isOpen) this.isOpen = true;
        this.activeIndex = this.getNextEnabledIndex(flatItems, this.activeIndex, -1);
        event.preventDefault();
        break;
      case 'Enter':
        if (this.isOpen && this.activeIndex >= 0) {
          const item = flatItems[this.activeIndex];
          if (item && !item.disabled) this.selectItem(item);
        } else if (this.freeText && this.inputText.trim()) {
          this.commitFreeText();
        }
        event.preventDefault();
        break;
      case 'Tab':
        this.closeAndResolve();
        break;
    }
  }

  private selectItem(item: ComboItem) {
    if (this.disabled || this.readonly || this.loading || item.disabled) return;
    this.value = item.value;
    this.inputText = item.labelText;
    this.lastValueSynced = this.value;
    this.isOpen = false;
    this.activeIndex = -1;
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true, composed: true, detail: { value: this.value },
    }));
  }

  private commitFreeText() {
    const next = this.inputText.trim() || null;
    if (next === this.value) { this.isOpen = false; return; }
    this.value = next;
    this.lastValueSynced = this.value;
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true, composed: true, detail: { value: this.value },
    }));
  }

  private closeAndResolve() {
    if (this.freeText && this.isOpen) {
      this.commitFreeText();
    } else {
      this.syncInputFromValue();
    }
    this.isOpen = false;
    this.activeIndex = -1;
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
  }

  private handleClear(event: MouseEvent) {
    event.stopPropagation();
    this.value = null;
    this.inputText = '';
    this.lastValueSynced = null;
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true, composed: true, detail: { value: null },
    }));
  }

  // ===========================================================================
  // CLASS HELPERS
  // ===========================================================================
  private getInputClasses(hasError: boolean): string {
    return [
      'w-full rounded-lg border px-3 py-2 text-sm text-slate-900 dark:text-slate-100',
      'bg-white dark:bg-slate-900',
      'placeholder:text-slate-400 dark:placeholder:text-slate-500',
      'transition focus:outline-none focus:ring-2',
      hasError
        ? 'border-red-400 dark:border-red-500 focus:ring-red-400 dark:focus:ring-red-500'
        : 'border-slate-200 dark:border-slate-700 focus:ring-sky-500 dark:focus:ring-sky-400',
      this.disabled || this.loading ? 'opacity-50 cursor-not-allowed' : '',
      this.readonly ? 'bg-slate-50 dark:bg-slate-800 cursor-default' : '',
    ].filter(Boolean).join(' ');
  }

  private getOptionClasses(item: ComboItem, flatIndex: number): string {
    const isSelected = item.value === this.value;
    const isActive = flatIndex === this.activeIndex;
    return [
      'flex w-full items-center gap-2 px-3 py-2 text-sm cursor-pointer transition select-none',
      isSelected
        ? 'bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300'
        : isActive
          ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700',
      item.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
    ].filter(Boolean).join(' ');
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderCheckmark(item: ComboItem): TemplateResult {
    if (item.value !== this.value) return html``;
    return html`
      <svg class="ml-auto h-4 w-4 flex-shrink-0 text-sky-600 dark:text-sky-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"/>
      </svg>
    `;
  }

  private renderOption(item: ComboItem, flatIndex: number, indent = false): TemplateResult {
    return html`
      <li
        id="${this.uid}-opt-${flatIndex}"
        role="option"
        aria-selected=${item.value === this.value ? 'true' : 'false'}
        aria-disabled=${item.disabled ? 'true' : 'false'}
        class=${this.getOptionClasses(item, flatIndex)}
        @mousedown=${(e: MouseEvent) => { e.preventDefault(); this.selectItem(item); }}
      >
        <span class="flex-1 truncate ${indent ? 'pl-2' : ''}">${unsafeHTML(item.label)}</span>
        ${this.renderCheckmark(item)}
      </li>
    `;
  }

  private renderDropdown(
    filteredStandalone: ComboItem[],
    filteredGroups: ComboGroup[],
    flatItems: ComboItem[],
    listId: string,
  ): TemplateResult {
    const total = filteredStandalone.length + filteredGroups.reduce((n, g) => n + g.items.length, 0);

    return html`
      <ul
        id=${listId}
        role="listbox"
        class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg py-1 focus:outline-none"
      >
        ${this.loading ? html`
          <li class="px-3 py-2 text-sm text-slate-400 dark:text-slate-500">${this.msg.loading}</li>
        ` : total === 0 ? html`
          <li class="px-3 py-2 text-sm text-slate-400 dark:text-slate-500">
            ${this.hasSlot('Empty') ? unsafeHTML(this.getSlotContent('Empty')) : this.msg.empty}
          </li>
        ` : html`
          ${filteredStandalone.map(item => this.renderOption(item, flatItems.indexOf(item)))}
          ${filteredGroups.map(group => html`
            ${group.label ? html`
              <li role="presentation" class="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none">
                ${group.label}
              </li>
            ` : nothing}
            ${group.items.map(item => this.renderOption(item, flatItems.indexOf(item), !!group.label))}
          `)}
        `}

        ${this.freeText && this.inputText.trim() && !flatItems.find(i => i.labelText.toLowerCase() === this.inputText.trim().toLowerCase()) ? html`
          <li
            class="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition select-none"
            @mousedown=${(e: MouseEvent) => { e.preventDefault(); this.commitFreeText(); }}
          >
            <svg class="h-4 w-4 flex-shrink-0 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            <span>${this.msg.useValue} "<strong>${this.inputText.trim()}</strong>"</span>
          </li>
        ` : nothing}
      </ul>
    `;
  }

  private renderLoading(): TemplateResult {
    return html`
      <div class="h-9 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    const inputId = `${this.uid}-input`;
    const listId  = `${this.uid}-list`;
    const labelId = `${this.uid}-label`;
    const errorId = `${this.uid}-error`;

    const hasError  = (!!this.error && this.error.length > 0) || (this.required && !this.value);
    const showClear = this.clearable && !this.disabled && !this.readonly && !this.loading
      && (!!this.value || !!this.inputText);

    // View-only mode
    if (!this.isEditing) {
      const found = this.getAllItems().find(i => i.value === this.value);
      return html`
        <div class="w-full">
          ${this.hasSlot('Label')
            ? html`<div id=${labelId} class="mb-1 text-sm text-slate-600 dark:text-slate-400">${unsafeHTML(this.getSlotContent('Label'))}</div>`
            : nothing}
          <div class="text-sm ${this.value ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}">
            ${this.value
              ? (found ? unsafeHTML(found.label) : this.value)
              : (this.placeholder || this.msg.placeholder)}
          </div>
          ${this.name ? html`<input type="hidden" name=${this.name} value=${this.value ?? ''} />` : nothing}
        </div>
      `;
    }

    const { standalone, groups } = this.parseItems();
    const q = this.inputText;
    const filteredStandalone = this.filterItems(standalone, q);
    const filteredGroups = groups
      .map(g => ({ ...g, items: this.filterItems(g.items, q) }))
      .filter(g => g.items.length > 0);
    const flatItems = this.getFlatVisible(filteredStandalone, filteredGroups);

    // Trailing icon sizes: chevron always at right; clear button to its left
    const inputPaddingRight = showClear ? '4rem' : '2.5rem';

    return html`
      <div class="w-full">

        ${this.hasSlot('Label')
          ? html`<label for=${inputId} id=${labelId} class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">${unsafeHTML(this.getSlotContent('Label'))}</label>`
          : nothing}

        <div class="relative">

          <!-- Text input -->
          ${this.loading && !this.isOpen ? this.renderLoading() : html`
            <input
              id=${inputId}
              type="text"
              role="combobox"
              autocomplete="off"
              spellcheck="false"
              aria-expanded=${this.isOpen ? 'true' : 'false'}
              aria-autocomplete="list"
              aria-controls=${listId}
              aria-activedescendant=${ifDefined(this.activeIndex >= 0 ? `${this.uid}-opt-${this.activeIndex}` : undefined)}
              aria-labelledby=${ifDefined(this.hasSlot('Label') ? labelId : undefined)}
              aria-describedby=${ifDefined(hasError ? errorId : undefined)}
              aria-invalid=${hasError ? 'true' : 'false'}
              aria-required=${this.required ? 'true' : 'false'}
              ?disabled=${this.disabled || this.loading}
              ?readonly=${this.readonly}
              placeholder=${this.placeholder || this.msg.placeholder}
              .value=${this.inputText}
              class=${this.getInputClasses(hasError)}
              style="padding-right:${inputPaddingRight}"
              @focus=${this.handleInputFocus}
              @input=${this.handleInputInput}
              @blur=${this.handleInputBlur}
              @keydown=${this.handleKeyDown}
            />

            <!-- Trailing icons -->
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 gap-1">

              <!-- Clear button -->
              ${showClear ? html`
                <button
                  type="button"
                  aria-label=${this.msg.clear}
                  class="pointer-events-auto flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400"
                  @click=${this.handleClear}
                >
                  <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
                  </svg>
                </button>
              ` : nothing}

              <!-- Chevron / spinner -->
              <span class="flex h-4 w-4 items-center justify-center text-slate-400 dark:text-slate-500">
                <svg class="h-4 w-4 transition-transform duration-150 ${this.isOpen ? 'rotate-180' : ''}" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
                </svg>
              </span>
            </div>

            <!-- Dropdown -->
            ${this.isOpen ? this.renderDropdown(filteredStandalone, filteredGroups, flatItems, listId) : nothing}
          `}
        </div>

        ${this.name ? html`<input type="hidden" name=${this.name} value=${this.value ?? ''} />` : nothing}

        ${hasError && this.error
          ? html`<p id=${errorId} class="mt-1.5 text-xs text-red-600 dark:text-red-400">${unsafeHTML(String(this.error))}</p>`
          : !hasError && this.hasSlot('Helper')
            ? html`<p class="mt-1.5 text-xs text-slate-500 dark:text-slate-400">${unsafeHTML(this.getSlotContent('Helper'))}</p>`
            : nothing}
      </div>
    `;
  }
}
