/// <mls fileReference="_102040_/l2/molecules/grouptriggeraction/ml-kebab-action-trigger.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML KEBAB ACTION TRIGGER MOLECULE
// =============================================================================
// Skill Group: groupTriggerAction
// This molecule does NOT contain business logic.
import { html, svg, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  moreActions: 'More actions',
  loading: 'Loading...',
};

type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
};
/// **collab_i18n_end**

@customElement('grouptriggeraction--ml-kebab-action-trigger')
export class MlKebabActionTriggerMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Icon'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: String })
  size: 'xs' | 'sm' | 'md' | 'lg' = 'md';

  @propertyDataSource({ type: String })
  type: 'button' | 'submit' | 'reset' = 'button';

  @propertyDataSource({ type: String })
  iconPosition: 'start' | 'end' = 'start';

  @propertyDataSource({ type: Boolean })
  disabled = false;

  @propertyDataSource({ type: Boolean })
  loading = false;

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleActionClick() {
    if (this.disabled || this.loading) return;
    this.dispatchEvent(
      new CustomEvent('action', {
        bubbles: true,
        composed: true,
        detail: {},
      })
    );
  }

  // ===========================================================================
  // HELPERS
  // ===========================================================================
  private getButtonClasses(): string {
    const sizeClasses = this.getSizeClasses();
    return [
      'inline-flex items-center justify-center gap-2',
      'ml-kebab-trigger',
      this.disabled || this.loading ? 'ml-disabled' : 'cursor-pointer',
      sizeClasses,
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getSizeClasses(): string {
    switch (this.size) {
      case 'xs':
        return 'h-7 px-2 text-xs';
      case 'sm':
        return 'h-8 px-2.5 text-xs';
      case 'lg':
        return 'h-11 px-3.5 text-sm';
      case 'md':
      default:
        return 'h-9 px-3 text-sm';
    }
  }

  private getIconSizeClasses(): string {
    switch (this.size) {
      case 'xs':
        return 'h-3.5 w-3.5';
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-5 w-5';
      case 'md':
      default:
        return 'h-4.5 w-4.5';
    }
  }

  private getLabelText(): string {
    const labelContent = this.getSlotContent('Label');
    if (labelContent) {
      return labelContent.replace(/<[^>]*>/g, '').trim();
    }
    return this.msg.moreActions;
  }

  private renderLoadingIndicator(): TemplateResult {
    const iconClasses = [
      'animate-spin',
      this.getIconSizeClasses(),
      'ml-text-muted',
    ].join(' ');

    return html`
      <span class="${iconClasses}" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          ${svg`<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.2"></circle>`}
          ${svg`<path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="3" fill="none"></path>`}
        </svg>
      </span>
      ${this.hasSlot('Label')
        ? html`<span class="ml-text-muted">${this.msg.loading}</span>`
        : html``}
    `;
  }

  private renderDefaultIcon(): TemplateResult {
    const iconClasses = [
      'inline-flex items-center justify-center',
      this.getIconSizeClasses(),
      'ml-text-muted',
    ].join(' ');

    return html`
      <span class="${iconClasses}" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          ${svg`<circle cx="6" cy="12" r="2" fill="currentColor"></circle>`}
          ${svg`<circle cx="12" cy="12" r="2" fill="currentColor"></circle>`}
          ${svg`<circle cx="18" cy="12" r="2" fill="currentColor"></circle>`}
        </svg>
      </span>
    `;
  }

  private renderIcon(): TemplateResult {
    if (this.hasSlot('Icon')) {
      const content = this.getSlotContent('Icon');
      return html`<span class="${cn(`inline-flex ${this.getIconSizeClasses()}`, this.getSlotClass('Icon'))}" aria-hidden="true">${unsafeHTML(content)}</span>`;
    }
    return this.renderDefaultIcon();
  }

  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    const content = this.getSlotContent('Label');
    return html`<span class="${cn('ml-label', this.getSlotClass('Label'))}">${unsafeHTML(content)}</span>`;
  }

  private renderContent(): TemplateResult {
    if (this.loading) {
      return this.renderLoadingIndicator();
    }

    const icon = this.renderIcon();
    const label = this.renderLabel();
    const parts = this.iconPosition === 'end' ? [label, icon] : [icon, label];
    return html`${parts}`;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    const isIconOnly = !this.hasSlot('Label');
    const ariaLabel = isIconOnly ? this.getLabelText() : undefined;

    return html`
      <button
        class="${cn(this.getButtonClasses(), this.cssClass)}"
        type="${this.type}"
        ?disabled=${this.disabled || this.loading}
        aria-label=${ariaLabel || ''}
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-disabled=${this.disabled || this.loading ? 'true' : 'false'}
        @click=${this.handleActionClick}
      >
        ${this.renderContent()}
      </button>
    `;
  }
}
