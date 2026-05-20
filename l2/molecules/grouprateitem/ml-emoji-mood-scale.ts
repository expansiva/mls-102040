/// <mls fileReference="_102040_/l2/molecules/grouprateitem/ml-emoji-mood-scale.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// EMOJI MOOD SCALE MOLECULE
// =============================================================================
// Skill Group: groupRateItem
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  empty: '—',
  required: 'Required',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
};
/// **collab_i18n_end**

let moodScaleId = 0;

@customElement('grouprateitem--ml-emoji-mood-scale')
export class EmojiMoodScaleMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;
  private uid = `mood-scale-${moodScaleId++}`;

  // ==========================================================================
  // SLOT TAGS
  // ==========================================================================
  slotTags = ['Label', 'Helper', 'Item'];

  // ==========================================================================
  // PROPERTIES — From Contract
  // ==========================================================================
  @propertyDataSource({ type: Number })
  value: number | null = null;

  @propertyDataSource({ type: String })
  error: string = '';

  @propertyDataSource({ type: String })
  name: string = '';

  @propertyDataSource({ type: Number })
  min: number = 0;

  @propertyDataSource({ type: Number })
  max: number = 5;

  @propertyDataSource({ type: Number })
  step: number = 1;

  @propertyDataSource({ type: Boolean, attribute: 'is-editing' })
  isEditing: boolean = true;

  @propertyDataSource({ type: Boolean })
  disabled: boolean = false;

  @propertyDataSource({ type: Boolean })
  readonly: boolean = false;

  @propertyDataSource({ type: Boolean })
  required: boolean = false;

  // ==========================================================================
  // INTERNAL STATE
  // ==========================================================================
  @state()
  private hoverValue: number | null = null;

  @state()
  private focusedIndex: number = -1;

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================
  private handleOptionClick(value: number) {
    if (!this.isEditing || this.disabled || this.readonly) return;
    this.value = value;
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    );
  }

  private handleOptionFocus(index: number) {
    if (!this.isEditing) return;
    this.focusedIndex = index;
    this.dispatchEvent(
      new CustomEvent('focus', {
        bubbles: true,
        composed: true,
        detail: {},
      })
    );
  }

  private handleOptionBlur() {
    if (!this.isEditing) return;
    this.dispatchEvent(
      new CustomEvent('blur', {
        bubbles: true,
        composed: true,
        detail: {},
      })
    );
  }

  private handleMouseEnter(value: number) {
    if (!this.isEditing || this.disabled || this.readonly) return;
    this.hoverValue = value;
  }

  private handleMouseLeave() {
    if (!this.isEditing || this.disabled || this.readonly) return;
    this.hoverValue = null;
  }

  private handleKeydown(e: KeyboardEvent, items: RatingItem[]) {
    if (!this.isEditing || this.disabled || this.readonly) return;
    if (items.length === 0) return;

    const currentIndex = this.focusedIndex >= 0 ? this.focusedIndex : this.getSelectedIndex(items);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % items.length;
      this.focusItem(nextIndex);
      return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + items.length) % items.length;
      this.focusItem(prevIndex);
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const index = currentIndex >= 0 ? currentIndex : 0;
      const item = items[index];
      if (item) this.handleOptionClick(item.value);
    }
  }

  private focusItem(index: number) {
    const el = this.querySelector(`[data-index="${index}"]`) as HTMLElement | null;
    if (el) {
      this.focusedIndex = index;
      el.focus();
    }
  }

  // ==========================================================================
  // DATA HELPERS
  // ==========================================================================
  private getSelectedIndex(items: RatingItem[]): number {
    if (this.value === null) return 0;
    const idx = items.findIndex((i) => i.value === this.value);
    return idx >= 0 ? idx : 0;
  }

  private getItems(): RatingItem[] {
    if (this.hasSlot('Item')) {
      return this.getSlots('Item').map((el) => ({
        value: Number(el.getAttribute('value')),
        label: el.innerHTML,
      }));
    }
    const items: RatingItem[] = [];
    for (let v = this.min; v <= this.max; v += this.step) {
      items.push({ value: v, label: String(v) });
    }
    return items;
  }

  private getActiveValue(): number | null {
    return this.hoverValue !== null ? this.hoverValue : this.value;
  }

  private getHasError(): boolean {
    return Boolean(this.getErrorMessage());
  }

  private getErrorMessage(): string {
    if (this.error && this.error.trim() !== '') return this.error;
    if (this.required && this.value === null) return this.msg.required;
    return '';
  }

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================
  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    return html`<div id="${this.uid}-label" class="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">
      ${unsafeHTML(this.getSlotContent('Label'))}
    </div>`;
  }

  private renderHelperOrError(): TemplateResult {
    const errorMessage = this.getErrorMessage();
    if (errorMessage) {
      return html`<div id="${this.uid}-error" class="mt-2 text-xs text-red-600 dark:text-red-400">
        ${unsafeHTML(errorMessage)}
      </div>`;
    }
    if (this.hasSlot('Helper')) {
      return html`<div id="${this.uid}-helper" class="mt-2 text-xs text-slate-500 dark:text-slate-400">
        ${unsafeHTML(this.getSlotContent('Helper'))}
      </div>`;
    }
    return html``;
  }

  private getContainerClasses(): string {
    return [
      'w-full rounded-lg border p-3 transition',
      'bg-white dark:bg-slate-800',
      this.getHasError() ? 'border-red-500 dark:border-red-400' : 'border-slate-200 dark:border-slate-700',
      this.disabled ? 'opacity-50 cursor-not-allowed' : '',
      !this.disabled && !this.readonly ? 'focus-within:ring-2 focus-within:ring-sky-500 dark:focus-within:ring-sky-400' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getOptionClasses(isActive: boolean, isSelected: boolean): string {
    return [
      'flex items-center justify-center rounded-md border px-3 py-2 text-xl transition',
      'bg-slate-50 dark:bg-slate-900',
      'text-slate-900 dark:text-slate-100',
      isActive || isSelected
        ? 'bg-sky-50 dark:bg-sky-900/40 border-sky-500 dark:border-sky-400'
        : 'border-slate-200 dark:border-slate-700',
      !this.disabled && !this.readonly ? 'hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer' : 'cursor-default',
      !this.disabled && !this.readonly ? 'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private renderOption(item: RatingItem, index: number, activeValue: number | null): TemplateResult {
    const isSelected = this.value === item.value;
    const isActive = activeValue === item.value;
    const ariaChecked = isSelected ? 'true' : 'false';
    const label = `Rating ${item.value}`;
    const tabIndex = !this.disabled && !this.readonly && (isSelected || (this.value === null && index === 0)) ? 0 : -1;

    return html`
      <div
        class="${this.getOptionClasses(isActive, isSelected)}"
        role="radio"
        aria-checked="${ariaChecked}"
        aria-label="${label}"
        tabindex="${tabIndex}"
        data-index="${index}"
        @focus="${() => this.handleOptionFocus(index)}"
        @blur="${this.handleOptionBlur}"
        @mouseenter="${() => this.handleMouseEnter(item.value)}"
        @mouseleave="${this.handleMouseLeave}"
        @click="${() => this.handleOptionClick(item.value)}"
      >
        ${unsafeHTML(item.label)}
      </div>
    `;
  }

  private renderViewMode(items: RatingItem[]): TemplateResult {
    const selected = items.find((i) => i.value === this.value);
    return html`
      <div class="flex items-center gap-3">
        ${selected
          ? html`<div class="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xl">
              ${unsafeHTML(selected.label)}
            </div>`
          : html`<div class="text-slate-500 dark:text-slate-400">${this.msg.empty}</div>`}
      </div>
    `;
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    const items = this.getItems();

    if (!this.isEditing) {
      return html`
        <div class="w-full">
          ${this.renderLabel()}
          ${this.renderViewMode(items)}
        </div>
      `;
    }

    const activeValue = this.getActiveValue();
    const hasError = this.getHasError();
    const describedBy = hasError ? `${this.uid}-error` : this.hasSlot('Helper') ? `${this.uid}-helper` : '';

    return html`
      <div
        class="${this.getContainerClasses()}"
        role="radiogroup"
        aria-labelledby="${this.hasSlot('Label') ? `${this.uid}-label` : ''}"
        aria-describedby="${describedBy}"
        aria-invalid="${hasError ? 'true' : 'false'}"
        aria-required="${this.required ? 'true' : 'false'}"
        @keydown="${(e: KeyboardEvent) => this.handleKeydown(e, items)}"
        @mouseleave="${this.handleMouseLeave}"
      >
        ${this.renderLabel()}
        <div class="flex items-center gap-2">
          ${items.map((item, index) => this.renderOption(item, index, activeValue))}
        </div>
        ${this.renderHelperOrError()}
      </div>
    `;
  }
}

type RatingItem = {
  value: number;
  label: string;
};
