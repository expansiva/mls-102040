/// <mls fileReference="_102040_/l2/molecules/groupenterboolean/ml-toggle-switch.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// TOGGLE SWITCH MOLECULE
// =============================================================================
// Skill Group: groupEnterBoolean
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  yes: 'Yes',
  no: 'No',
};

type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    yes: 'Sim',
    no: 'Não',
  },
};
/// **collab_i18n_end**

@customElement('groupenterboolean--ml-toggle-switch')
export class ToggleSwitchMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;
  private uid = `toggle-${Math.random().toString(36).slice(2, 9)}`;

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
  // EVENT HANDLERS
  // ===========================================================================
  private handleToggle() {
    if (!this.isEditing || this.disabled) return;
    this.value = !this.value;
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      })
    );
  }

  private handleFocus() {
    if (!this.isEditing || this.disabled) return;
    this.dispatchEvent(
      new CustomEvent('focus', {
        bubbles: true,
        composed: true,
        detail: {},
      })
    );
  }

  private handleBlur() {
    if (!this.isEditing || this.disabled) return;
    this.dispatchEvent(
      new CustomEvent('blur', {
        bubbles: true,
        composed: true,
        detail: {},
      })
    );
  }

  private handleKeydown(event: KeyboardEvent) {
    if (!this.isEditing || this.disabled) return;
    if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'Enter') {
      event.preventDefault();
      this.handleToggle();
    }
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderLabel(labelId: string | undefined): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    return html`
      <div id=${labelId || ''} class="${cn('mb-2 text-sm ml-label', this.getSlotClass('Label'))}">
        ${unsafeHTML(this.getSlotContent('Label'))}
      </div>
    `;
  }

  private renderHelper(helperId: string | undefined): TemplateResult {
    if (!this.hasSlot('Helper')) return html``;
    if (this.error) return html``;
    return html`
      <div id=${helperId || ''} class="${cn('mt-2 text-xs ml-helper', this.getSlotClass('Helper'))}">
        ${unsafeHTML(this.getSlotContent('Helper'))}
      </div>
    `;
  }

  private renderError(errorId: string | undefined): TemplateResult {
    if (!this.error) return html``;
    return html`
      <div id=${errorId || ''} class="mt-2 text-xs ml-error-text">
        ${unsafeHTML(String(this.error))}
      </div>
    `;
  }

  private getToggleButtonClasses(): string {
    return [
      'relative inline-flex h-6 w-11 items-center',
      'ml-toggle-track',
      this.value ? 'ml-toggle-track-on' : '',
      this.error ? 'ml-toggle-track-error' : '',
      this.disabled ? 'ml-disabled' : 'cursor-pointer',
    ].filter(Boolean).join(' ');
  }

  private getThumbClasses(): string {
    return [
      'inline-block h-4 w-4 transform ml-toggle-thumb',
      this.value ? 'translate-x-6' : 'translate-x-1',
    ].join(' ');
  }

  private renderViewMode(): TemplateResult {
    const labelId = this.hasSlot('Label') ? `${this.uid}-label` : undefined;
    const viewValue = this.value ? this.msg.yes : this.msg.no;
    return html`
      <div class="${cn('w-full', this.cssClass)}">
        ${this.renderLabel(labelId)}
        <div class="text-sm ml-text">${viewValue}</div>
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

    const labelId = this.hasSlot('Label') ? `${this.uid}-label` : undefined;
    const helperId = this.hasSlot('Helper') ? `${this.uid}-helper` : undefined;
    const errorId = this.error ? `${this.uid}-error` : undefined;
    const describedBy = this.error ? errorId : helperId;

    return html`
      <div class="${cn('w-full', this.cssClass)}">
        ${this.renderLabel(labelId)}
        <button
          type="button"
          class=${this.getToggleButtonClasses()}
          role="switch"
          aria-checked=${this.value ? 'true' : 'false'}
          aria-labelledby=${labelId || undefined}
          aria-describedby=${describedBy || undefined}
          aria-invalid=${this.error ? 'true' : 'false'}
          aria-disabled=${this.disabled ? 'true' : 'false'}
          ?disabled=${this.disabled}
          tabindex=${this.disabled ? -1 : 0}
          @click=${this.handleToggle}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
          @keydown=${this.handleKeydown}
        >
          <span class=${this.getThumbClasses()}></span>
        </button>
        ${this.renderError(errorId)}
        ${this.renderHelper(helperId)}
      </div>
    `;
  }
}
