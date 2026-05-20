/// <mls fileReference="_102040_/l2/molecules/grouprateitem/ml-thumbs-rating.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// THUMBS RATING MOLECULE
// =============================================================================
// Skill Group: groupRateItem
// This molecule does NOT contain business logic.
import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  empty: '—',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
};
/// **collab_i18n_end**

@customElement('grouprateitem--ml-thumbs-rating')
export class ThumbsRatingMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;
  private static instanceCounter = 0;
  private instanceId = ++ThumbsRatingMolecule.instanceCounter;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Helper', 'Item'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: Number })
  value: number | null = null;

  @propertyDataSource({ type: String })
  error = '';

  @propertyDataSource({ type: String })
  name = '';

  @propertyDataSource({ type: Number })
  min = 0;

  @propertyDataSource({ type: Number })
  max = 5;

  @propertyDataSource({ type: Number })
  step = 1;

  @propertyDataSource({ type: Boolean, attribute: 'is-editing' })
  isEditing = true;

  @propertyDataSource({ type: Boolean })
  disabled = false;

  @propertyDataSource({ type: Boolean })
  readonly = false;

  @propertyDataSource({ type: Boolean })
  required = false;

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private hoverValue: number | null = null;

  // ===========================================================================
  // ACCESSIBILITY IDS
  // ===========================================================================
  private get labelId(): string {
    return `thumbs-label-${this.instanceId}`;
  }

  private get helperId(): string {
    return `thumbs-helper-${this.instanceId}`;
  }

  private get errorId(): string {
    return `thumbs-error-${this.instanceId}`;
  }

  // ===========================================================================
  // HELPERS
  // ===========================================================================
  private canInteract(): boolean {
    return this.isEditing && !this.disabled && !this.readonly;
  }

  private getErrorState(): boolean {
    return Boolean(this.error) || (this.required && this.value === null && this.isEditing);
  }

  private getDescribedBy(): string | undefined {
    if (!this.isEditing) return undefined;
    if (this.error) return this.errorId;
    if (this.hasSlot('Helper')) return this.helperId;
    return undefined;
  }

  private getItems(): Array<{ value: number; label: string }> {
    const slotItems = this.getSlots('Item');
    const parsed = slotItems
      .map((el) => {
        const raw = el.getAttribute('value');
        const value = raw !== null ? Number(raw) : NaN;
        const label = el.innerHTML || '';
        return { value, label };
      })
      .filter((item) => !Number.isNaN(item.value));

    if (parsed.length >= 2) return parsed.slice(0, 2);

    const fallback = this.generateFallbackItems(parsed);
    return fallback.slice(0, 2);
  }

  private generateFallbackItems(existing: Array<{ value: number; label: string }>): Array<{ value: number; label: string }> {
    if (existing.length === 1) {
      const existingValue = existing[0].value;
      let altValue = existingValue === this.min ? this.max : this.min;
      if (altValue === existingValue) {
        altValue = existingValue + (this.step || 1);
      }
      return [existing[0], { value: altValue, label: '' }];
    }

    let first = this.min;
    let second = this.max;
    if (first === second) {
      second = first + (this.step || 1);
    }
    return [
      { value: first, label: '' },
      { value: second, label: '' },
    ];
  }

  private getGroupClasses(errorState: boolean): string {
    return [
      'flex items-center gap-2 rounded-md border p-1 w-max',
      errorState ? 'border-red-500 dark:border-red-400' : 'border-slate-200 dark:border-slate-700',
      this.disabled ? 'opacity-50' : '',
      !this.disabled && this.readonly ? 'opacity-80' : '',
    ].filter(Boolean).join(' ');
  }

  private getOptionClasses(isActive: boolean, isEditing: boolean): string {
    return [
      'inline-flex items-center justify-center rounded-md border px-3 py-2 text-xl transition',
      'bg-white dark:bg-slate-800',
      'text-slate-700 dark:text-slate-300',
      isActive
        ? 'bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border-sky-500 dark:border-sky-400'
        : 'border-slate-200 dark:border-slate-700',
      isEditing && this.canInteract() && !isActive ? 'hover:bg-slate-50 dark:hover:bg-slate-700' : '',
      isEditing && this.canInteract() ? 'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400' : '',
      this.disabled ? 'opacity-50 cursor-not-allowed' : '',
      !this.disabled && (this.readonly || !isEditing) ? 'cursor-default' : '',
      this.canInteract() ? 'cursor-pointer' : '',
    ].filter(Boolean).join(' ');
  }

  private getOptionLabel(item: { value: number; label: string }): string {
    const label = item.label?.trim();
    return label ? label : String(item.value);
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleOptionMouseEnter(value: number) {
    if (!this.canInteract()) return;
    this.hoverValue = value;
  }

  private handleOptionMouseLeave() {
    if (!this.canInteract()) return;
    this.hoverValue = null;
  }

  private handleOptionClick(value: number) {
    if (!this.canInteract()) return;
    this.value = value;
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value },
    }));
  }

  private handleOptionFocus() {
    if (!this.canInteract()) return;
    this.dispatchEvent(new CustomEvent('focus', {
      bubbles: true,
      composed: true,
      detail: {},
    }));
  }

  private handleOptionBlur() {
    if (!this.canInteract()) return;
    this.dispatchEvent(new CustomEvent('blur', {
      bubbles: true,
      composed: true,
      detail: {},
    }));
  }

  private handleKeydown(e: KeyboardEvent) {
    if (!this.canInteract()) return;
    const items = this.getItems();
    const options = Array.from(this.querySelectorAll('[data-rating-option]')) as HTMLElement[];
    if (!options.length) return;

    const activeElement = this.ownerDocument.activeElement as HTMLElement | null;
    let currentIndex = options.findIndex((el) => el === activeElement);

    if (currentIndex < 0) {
      const selectedIndex = items.findIndex((item) => item.value === this.value);
      currentIndex = selectedIndex >= 0 ? selectedIndex : 0;
      options[currentIndex]?.focus();
    }

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      const nextIndex = (currentIndex + 1) % options.length;
      options[nextIndex]?.focus();
      e.preventDefault();
    }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      const prevIndex = (currentIndex - 1 + options.length) % options.length;
      options[prevIndex]?.focus();
      e.preventDefault();
    }

    if (e.key === 'Enter' || e.key === ' ') {
      const target = options[currentIndex];
      const raw = target?.getAttribute('data-value');
      const value = raw !== null ? Number(raw) : null;
      if (value !== null && !Number.isNaN(value)) {
        this.handleOptionClick(value);
      }
      e.preventDefault();
    }
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderLabel() {
    if (!this.hasSlot('Label')) return html``;
    return html`
      <div id=${this.labelId} class="text-sm font-medium text-slate-700 dark:text-slate-300">
        ${unsafeHTML(this.getSlotContent('Label'))}
      </div>
    `;
  }

  private renderHelperOrError() {
    if (!this.isEditing) return html``;

    if (this.error) {
      return html`
        <div id=${this.errorId} class="text-xs text-red-600 dark:text-red-400">
          ${unsafeHTML(this.error)}
        </div>
      `;
    }

    if (this.hasSlot('Helper')) {
      return html`
        <div id=${this.helperId} class="text-xs text-slate-500 dark:text-slate-400">
          ${unsafeHTML(this.getSlotContent('Helper'))}
        </div>
      `;
    }

    return html``;
  }

  private renderOption(item: { value: number; label: string }, index: number, isEditing: boolean) {
    const active = this.hoverValue !== null ? this.hoverValue === item.value : this.value === item.value;
    const label = this.getOptionLabel(item);
    const ariaChecked = active ? 'true' : 'false';
    const tabIndex = this.value === null ? (index === 0 ? 0 : -1) : (this.value === item.value ? 0 : -1);

    if (!isEditing) {
      return html`
        <div
          class=${this.getOptionClasses(active, false)}
          role="radio"
          aria-checked=${ariaChecked}
          aria-label=${String(item.value)}
        >
          <span class="leading-none">${unsafeHTML(label)}</span>
        </div>
      `;
    }

    return html`
      <button
        type="button"
        class=${this.getOptionClasses(active, true)}
        role="radio"
        aria-checked=${ariaChecked}
        aria-label=${String(item.value)}
        tabindex=${tabIndex}
        data-rating-option
        data-value=${String(item.value)}
        @mouseenter=${() => this.handleOptionMouseEnter(item.value)}
        @mouseleave=${this.handleOptionMouseLeave}
        @click=${() => this.handleOptionClick(item.value)}
        @focus=${this.handleOptionFocus}
        @blur=${this.handleOptionBlur}
      >
        <span class="leading-none">${unsafeHTML(label)}</span>
      </button>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    const items = this.getItems();
    const errorState = this.getErrorState();
    const describedBy = this.getDescribedBy();

    if (!this.isEditing) {
      const hasValue = this.value !== null;
      return html`
        <div class="flex flex-col gap-1">
          ${this.renderLabel()}
          <div
            class=${this.getGroupClasses(false)}
            role="radiogroup"
            aria-labelledby=${this.hasSlot('Label') ? this.labelId : undefined}
            aria-readonly="true"
          >
            ${hasValue
              ? items.map((item, index) => this.renderOption(item, index, false))
              : html`<span class="px-3 py-2 text-slate-400 dark:text-slate-500">${this.msg.empty}</span>`}
          </div>
        </div>
      `;
    }

    return html`
      <div class="flex flex-col gap-1" data-name=${this.name}>
        ${this.renderLabel()}
        <div
          class=${this.getGroupClasses(errorState)}
          role="radiogroup"
          aria-labelledby=${this.hasSlot('Label') ? this.labelId : undefined}
          aria-describedby=${describedBy}
          aria-invalid=${errorState ? 'true' : 'false'}
          aria-required=${this.required ? 'true' : 'false'}
          @keydown=${this.handleKeydown}
        >
          ${items.map((item, index) => this.renderOption(item, index, true))}
        </div>
        ${this.renderHelperOrError()}
      </div>
    `;
  }
}
