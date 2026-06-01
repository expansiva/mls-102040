/// <mls fileReference="_102033_/l2/molecules/groupselectone/ml-select.ts" enhancement="_102020_/l2/enhancementAura" />

// =============================================================================
// ML SELECT MOLECULE
// =============================================================================
// Skill Group: groupSelectOne
// Implements a conventional dropdown select — click to open, click to pick.
// No text input. Use ml-combobox when filtering/typing is needed.

import { html, TemplateResult, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  placeholder: 'Select an option',
  empty: 'No options available',
  loading: 'Loading...',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    placeholder: 'Selecione uma opção',
    empty: 'Nenhuma opção disponível',
    loading: 'Carregando...',
  },
};
/// **collab_i18n_end**

// =============================================================================
// TYPES
// =============================================================================
interface SelectItem {
  value: string;
  label: string;
  disabled: boolean;
}

interface SelectGroup {
  label: string;
  items: SelectItem[];
}

// =============================================================================
// COMPONENT
// =============================================================================
@customElement('groupselectone--ml-select')
export class MlSelectMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;
  private _outsideClickHandler: ((e: MouseEvent) => void) | null = null;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Helper', 'Trigger', 'Item', 'Group', 'Empty'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================

  /** Currently selected item value; null = nothing selected */
  @propertyDataSource({ type: String })
  value: string | null = null;

  @propertyDataSource({ type: String })
  error = '';

  @propertyDataSource({ type: String })
  name = '';

  @propertyDataSource({ type: String })
  placeholder = '';

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
  @state() private isOpen = false;

  /** Index into the flat selectableItems array; -1 = nothing highlighted */
  @state() private highlightIndex = -1;

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  createRenderRoot() { return this; }

  connectedCallback() {
    super.connectedCallback();
    this._outsideClickHandler = (e: MouseEvent) => {
      if (!this.contains(e.target as Node)) {
        this.isOpen = false;
        this.highlightIndex = -1;
      }
    };
    document.addEventListener('click', this._outsideClickHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._outsideClickHandler) {
      document.removeEventListener('click', this._outsideClickHandler);
      this._outsideClickHandler = null;
    }
  }

  // ===========================================================================
  // PARSERS
  // ===========================================================================
  private parseTopItems(): SelectItem[] {
    return this.getSlots('Item')
      .filter(el => el.parentElement?.tagName?.toLowerCase() !== 'group')
      .map(el => ({
        value: el.getAttribute('value') || '',
        label: el.innerHTML,
        disabled: el.hasAttribute('disabled'),
      }));
  }

  private parseGroups(): SelectGroup[] {
    return this.getSlots('Group').map(group => ({
      label: group.getAttribute('label') || '',
      items: Array.from(group.querySelectorAll('Item')).map(el => ({
        value: el.getAttribute('value') || '',
        label: el.innerHTML,
        disabled: el.hasAttribute('disabled'),
      })),
    }));
  }

  /** Flat ordered list of non-disabled items: group items first, then top items. */
  private buildSelectableList(topItems: SelectItem[], groups: SelectGroup[]): SelectItem[] {
    return [...groups.flatMap(g => g.items), ...topItems].filter(i => !i.disabled);
  }

  private findSelected(topItems: SelectItem[], groups: SelectGroup[]): SelectItem | undefined {
    if (this.value === null) return undefined;
    return [...groups.flatMap(g => g.items), ...topItems].find(i => i.value === this.value);
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleTriggerClick() {
    if (this.disabled || this.readonly || this.loading) return;
    this.isOpen = !this.isOpen;
    if (!this.isOpen) this.highlightIndex = -1;
  }

  private handleSelect(item: SelectItem) {
    if (item.disabled || this.disabled || this.readonly) return;
    this.value = item.value;
    this.isOpen = false;
    this.highlightIndex = -1;
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true, composed: true,
      detail: { value: this.value },
    }));
  }

  private handleKeydown(e: KeyboardEvent, selectableItems: SelectItem[]) {
    if (this.disabled || this.readonly || this.loading) return;

    if (!this.isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.isOpen = true;
        // Pre-highlight current value, else first item
        const idx = selectableItems.findIndex(i => i.value === this.value);
        this.highlightIndex = idx >= 0 ? idx : 0;
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.highlightIndex = Math.min(this.highlightIndex + 1, selectableItems.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.highlightIndex = Math.max(this.highlightIndex - 1, 0);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (this.highlightIndex >= 0 && this.highlightIndex < selectableItems.length) {
          this.handleSelect(selectableItems[this.highlightIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.isOpen = false;
        this.highlightIndex = -1;
        break;
    }
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderTrigger(selectedLabel: string | null): TemplateResult {
    const hasError = !!this.error;
    const triggerBase = 'relative flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-0';

    const triggerState = this.disabled
      ? 'cursor-not-allowed bg-slate-100 dark:bg-slate-800 opacity-50 border-slate-200 dark:border-slate-700'
      : this.readonly
        ? 'cursor-default bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
        : hasError
          ? 'cursor-pointer bg-white dark:bg-slate-900 border-red-400 dark:border-red-500 focus:ring-red-400 dark:focus:ring-red-500'
          : this.isOpen
            ? 'cursor-pointer bg-white dark:bg-slate-900 border-sky-500 dark:border-sky-400 ring-2 ring-sky-500/20 dark:ring-sky-400/20'
            : 'cursor-pointer bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:ring-sky-500 dark:focus:ring-sky-400';

    return html`
      <button
        type="button"
        class="${triggerBase} ${triggerState}"
        role="combobox"
        aria-expanded=${this.isOpen ? 'true' : 'false'}
        aria-haspopup="listbox"
        aria-invalid=${hasError ? 'true' : 'false'}
        aria-required=${this.required ? 'true' : 'false'}
        ?disabled=${this.disabled}
        @click=${this.handleTriggerClick}
        @blur=${() => this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true, detail: {} }))}
        @focus=${() => this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true, detail: {} }))}
      >
        ${this.loading ? html`
          <span class="flex items-center gap-2 text-slate-400 dark:text-slate-500">
            <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <span>${this.msg.loading}</span>
          </span>
        ` : selectedLabel !== null ? html`
          <span class="flex-1 truncate text-left text-slate-900 dark:text-slate-100">
            ${unsafeHTML(selectedLabel)}
          </span>
        ` : html`
          <span class="flex-1 truncate text-left text-slate-400 dark:text-slate-500">
            ${this.hasSlot('Trigger')
              ? unsafeHTML(this.getSlotContent('Trigger'))
              : (this.placeholder || this.msg.placeholder)}
          </span>
        `}

        <svg
          class="h-4 w-4 flex-shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-150 ${this.isOpen ? 'rotate-180' : ''}"
          viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
        >
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
        </svg>
      </button>
    `;
  }

  private renderOption(item: SelectItem, flatIdx: number): TemplateResult {
    const isSelected = this.value === item.value;
    const isHighlighted = this.highlightIndex === flatIdx;

    const optionClasses = [
      'flex items-center gap-2 px-3 py-2 text-sm transition select-none',
      item.disabled
        ? 'cursor-not-allowed opacity-40 text-slate-600 dark:text-slate-400'
        : isHighlighted
          ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 cursor-pointer'
          : isSelected
            ? 'bg-sky-50/60 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 cursor-pointer'
            : 'text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50',
    ].filter(Boolean).join(' ');

    return html`
      <li
        role="option"
        aria-selected=${isSelected ? 'true' : 'false'}
        aria-disabled=${item.disabled ? 'true' : 'false'}
        class=${optionClasses}
        @click=${() => this.handleSelect(item)}
        @mousemove=${() => { if (!item.disabled) this.highlightIndex = flatIdx; }}
      >
        <!-- checkmark or spacer to keep text aligned -->
        ${isSelected ? html`
          <svg class="h-4 w-4 flex-shrink-0 text-sky-500 dark:text-sky-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"/>
          </svg>
        ` : html`<span class="h-4 w-4 flex-shrink-0" aria-hidden="true"></span>`}
        <span class="flex-1 truncate">${unsafeHTML(item.label)}</span>
      </li>
    `;
  }

  private renderPanel(topItems: SelectItem[], groups: SelectGroup[], selectableItems: SelectItem[]): TemplateResult {
    const hasItems = groups.length > 0 || topItems.length > 0;

    const flatIdx = (item: SelectItem) => selectableItems.findIndex(s => s.value === item.value);

    return html`
      <ul
        role="listbox"
        class="absolute z-50 mt-1 w-full overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1 shadow-lg max-h-60"
        @mousedown=${(e: Event) => e.preventDefault()}
      >
        ${!hasItems ? html`
          <li role="presentation" class="px-3 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
            ${this.hasSlot('Empty') ? unsafeHTML(this.getSlotContent('Empty')) : this.msg.empty}
          </li>
        ` : html`
          ${groups.map((group, gi) => html`
            ${group.label ? html`
              <li role="presentation" class="px-3 pt-2.5 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                ${group.label}
              </li>
            ` : nothing}
            ${group.items.map(item => this.renderOption(item, flatIdx(item)))}
            ${gi < groups.length - 1 || topItems.length > 0 ? html`
              <li role="presentation" class="my-1 border-t border-slate-100 dark:border-slate-800"></li>
            ` : nothing}
          `)}
          ${topItems.map(item => this.renderOption(item, flatIdx(item)))}
        `}
      </ul>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    const topItems = this.parseTopItems();
    const groups = this.parseGroups();
    const selectableItems = this.buildSelectableList(topItems, groups);
    const selectedItem = this.findSelected(topItems, groups);
    const selectedLabel = selectedItem?.label ?? null;
    const labelContent = this.hasSlot('Label') ? this.getSlotContent('Label') : '';

    // -------------------------------------------------------------------------
    // VIEW MODE
    // -------------------------------------------------------------------------
    if (!this.isEditing) {
      return html`
        <div class="flex flex-col gap-1">
          ${labelContent ? html`
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">${unsafeHTML(labelContent)}</span>
          ` : nothing}
          <span class="text-sm text-slate-900 dark:text-slate-100">
            ${selectedLabel !== null
              ? unsafeHTML(selectedLabel)
              : html`<span class="text-slate-400 dark:text-slate-500">${this.placeholder || '—'}</span>`}
          </span>
        </div>
      `;
    }

    // -------------------------------------------------------------------------
    // EDIT MODE
    // -------------------------------------------------------------------------
    return html`
      <div
        class="relative flex flex-col gap-1"
        @keydown=${(e: KeyboardEvent) => this.handleKeydown(e, selectableItems)}
      >
        ${labelContent ? html`
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
            ${unsafeHTML(labelContent)}
            ${this.required ? html`<span class="ml-0.5 text-red-500" aria-hidden="true">*</span>` : nothing}
          </label>
        ` : nothing}

        <div class="relative">
          ${this.renderTrigger(selectedLabel)}
          ${this.isOpen ? this.renderPanel(topItems, groups, selectableItems) : nothing}
        </div>

        ${this.error ? html`
          <p class="text-xs text-red-600 dark:text-red-400" role="alert">${this.error}</p>
        ` : this.hasSlot('Helper') ? html`
          <p class="text-xs text-slate-500 dark:text-slate-400">${unsafeHTML(this.getSlotContent('Helper'))}</p>
        ` : nothing}
      </div>
    `;
  }
}
