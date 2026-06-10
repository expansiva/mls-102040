/// <mls fileReference="_102040_/l2/molecules/groupenterboolean/ml-boolean-segmented.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// BOOLEAN SEGMENTED MOLECULE
// =============================================================================
// Skill Group: groupEnterBoolean
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  yes: 'Yes',
  no: 'No',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
};
/// **collab_i18n_end**

@customElement('groupenterboolean--ml-boolean-segmented')
export class BooleanSegmentedMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Helper'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: Boolean })
  value = false;

  @propertyDataSource({ type: String })
  error = '';

  @propertyDataSource({ type: String })
  name = '';

  @propertyDataSource({ type: Boolean, attribute: 'is-editing' })
  isEditing = true;

  @propertyDataSource({ type: Boolean, attribute: 'disabled' })
  disabled = false;

  // ===========================================================================
  // INTERNAL IDS
  // ===========================================================================
  private labelId = `segmented-label-${Math.random().toString(36).slice(2)}`;
  private helperId = `segmented-helper-${Math.random().toString(36).slice(2)}`;

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleSelect(nextValue: boolean) {
    if (this.disabled || !this.isEditing) return;
    if (this.value === nextValue) return;
    this.value = nextValue;
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    );
  }

  private handleKeyDown(e: KeyboardEvent, nextValue: boolean) {
    if (this.disabled || !this.isEditing) return;
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      this.handleSelect(nextValue);
    }
  }

  private handleFocus() {
    if (this.disabled || !this.isEditing) return;
    this.dispatchEvent(
      new CustomEvent('focus', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleBlur() {
    if (this.disabled || !this.isEditing) return;
    this.dispatchEvent(
      new CustomEvent('blur', {
        bubbles: true,
        composed: true,
      })
    );
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    return html`
      <div
        id=${this.labelId}
        class="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        ${unsafeHTML(this.getSlotContent('Label'))}
      </div>
    `;
  }

  private renderHelperOrError(): TemplateResult {
    if (!this.isEditing) return html``;
    if (this.error) {
      return html`
        <div
          id=${this.helperId}
          class="mt-1 text-xs text-red-600 dark:text-red-400"
        >
          ${unsafeHTML(String(this.error))}
        </div>
      `;
    }
    if (this.hasSlot('Helper')) {
      return html`
        <div
          id=${this.helperId}
          class="mt-1 text-xs text-slate-500 dark:text-slate-400"
        >
          ${unsafeHTML(this.getSlotContent('Helper'))}
        </div>
      `;
    }
    return html``;
  }

  private getSegmentClasses(isSelected: boolean): string {
    return [
      'flex-1 rounded-md px-3 py-2 text-sm font-medium border transition',
      'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
      isSelected
        ? 'bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border-sky-500 dark:border-sky-400'
        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700',
      this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      !this.disabled && !isSelected
        ? 'hover:bg-slate-50 dark:hover:bg-slate-700'
        : '',
      this.error ? 'border-red-500 dark:border-red-400' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private renderViewMode(): TemplateResult {
    const text = this.value ? this.msg.yes : this.msg.no;
    return html`
      <div class="text-sm text-slate-900 dark:text-slate-100">
        ${text}
      </div>
    `;
  }

  private renderEditMode(): TemplateResult {
    const ariaLabelledBy = this.hasSlot('Label') ? this.labelId : undefined;
    const ariaDescribedBy = this.error || this.hasSlot('Helper') ? this.helperId : undefined;
    return html`
      <div
        class="inline-flex w-full gap-2"
        role="radiogroup"
        aria-labelledby=${ariaLabelledBy || ''}
        aria-describedby=${ariaDescribedBy || ''}
        aria-invalid=${this.error ? 'true' : 'false'}
        aria-disabled=${this.disabled ? 'true' : 'false'}
      >
        <button
          type="button"
          role="radio"
          aria-checked=${this.value ? 'true' : 'false'}
          class=${this.getSegmentClasses(this.value)}
          @click=${() => this.handleSelect(true)}
          @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, true)}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
          ?disabled=${this.disabled}
        >
          ${this.msg.yes}
        </button>
        <button
          type="button"
          role="radio"
          aria-checked=${!this.value ? 'true' : 'false'}
          class=${this.getSegmentClasses(!this.value)}
          @click=${() => this.handleSelect(false)}
          @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, false)}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
          ?disabled=${this.disabled}
        >
          ${this.msg.no}
        </button>
        ${this.name
          ? html`<input type="hidden" name=${this.name} .value=${String(this.value)} />`
          : html``}
      </div>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];
    return html`
      <div class="w-full">
        ${this.renderLabel()}
        ${this.isEditing ? this.renderEditMode() : this.renderViewMode()}
        ${this.renderHelperOrError()}
      </div>
    `;
  }
}
