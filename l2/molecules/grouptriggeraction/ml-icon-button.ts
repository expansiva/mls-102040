/// <mls fileReference="_102040_/l2/molecules/grouptriggeraction/ml-icon-button.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ICON BUTTON MOLECULE
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
  defaultLabel: 'Action',
  loadingLabel: 'Processing',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    defaultLabel: 'Ação',
    loadingLabel: 'Processando',
  },
};
/// **collab_i18n_end**
@customElement('grouptriggeraction--ml-icon-button')
export class IconButtonMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;
  // =========================================================================
  // SLOT TAGS
  // =========================================================================
  slotTags = ['Label', 'Icon'];
  // =========================================================================
  // PROPERTIES — From Contract
  // =========================================================================
  @propertyDataSource({ type: String })
  size: 'xs' | 'sm' | 'md' | 'lg' = 'md';

  @propertyDataSource({ type: String })
  type: 'button' | 'submit' | 'reset' = 'button';

  @propertyDataSource({ type: String, attribute: 'icon-position' })
  iconPosition: 'start' | 'end' = 'start';

  @propertyDataSource({ type: Boolean })
  disabled = false;

  @propertyDataSource({ type: Boolean })
  loading = false;
  // =========================================================================
  // EVENT HANDLERS
  // =========================================================================
  private handleActionClick(event: Event) {
    if (this.disabled || this.loading) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
    this.dispatchEvent(
      new CustomEvent('action', {
        bubbles: true,
        composed: true,
        detail: {},
      })
    );
  }
  // =========================================================================
  // RENDER
  // =========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    const isDisabled = this.disabled || this.loading;
    const labelContent = this.getSlotContent('Label') || this.msg.defaultLabel;
    const ariaLabel = this.getAccessibleLabel(labelContent);

    return html`
      <button
        type=${this.type}
        class=${cn(this.getButtonClasses(isDisabled), this.cssClass)}
        ?disabled=${isDisabled}
        aria-label=${ariaLabel}
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-disabled=${isDisabled ? 'true' : 'false'}
        @click=${this.handleActionClick}
      >
        <span class="sr-only">${unsafeHTML(labelContent)}</span>
        ${this.loading ? this.renderLoadingIcon() : this.renderIcon()}
      </button>
    `;
  }
  // =========================================================================
  // TEMPLATE PARTS
  // =========================================================================
  private renderIcon(): TemplateResult {
    const iconContent = this.getSlotContent('Icon');
    if (iconContent) {
      return html`
        <span class=${cn(this.getIconClasses(), this.getSlotClass('Icon'))} aria-hidden="true">
          ${unsafeHTML(iconContent)}
        </span>
      `;
    }
    return html`
      <span class=${cn(this.getIconClasses(), this.getSlotClass('Icon'))} aria-hidden="true">
        <svg viewBox="0 0 24 24" class="w-full h-full" fill="currentColor" aria-hidden="true">
          ${svg`<circle cx="12" cy="12" r="4"></circle>`}
        </svg>
      </span>
    `;
  }

  private renderLoadingIcon(): TemplateResult {
    const label = this.getSlotContent('Label') || this.msg.loadingLabel;
    return html`
      <span class=${this.getIconClasses()} aria-hidden="true">
        <svg viewBox="0 0 24 24" class="w-full h-full animate-spin" fill="none" stroke="currentColor" stroke-width="2">
          ${svg`
            <circle cx="12" cy="12" r="9" opacity="0.25"></circle>
            <path d="M21 12a9 9 0 0 1-9 9"></path>
          `}
        </svg>
      </span>
      <span class="sr-only">${unsafeHTML(label)}</span>
    `;
  }
  // =========================================================================
  // HELPERS
  // =========================================================================
  private getAccessibleLabel(rawLabel: string): string {
    const clean = rawLabel.replace(/<[^>]*>/g, '').trim();
    return clean || this.msg.defaultLabel;
  }

  private getButtonClasses(isDisabled: boolean): string {
    return [
      'inline-flex items-center justify-center',
      'ml-button',
      'ml-button-secondary',
      this.getSizeClasses(),
      isDisabled ? 'ml-disabled' : 'cursor-pointer',
      this.loading ? 'cursor-wait' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getIconClasses(): string {
    return [
      'inline-flex items-center justify-center',
      'w-full h-full',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getSizeClasses(): string {
    switch (this.size) {
      case 'xs':
        return 'w-7 h-7 text-xs';
      case 'sm':
        return 'w-8 h-8 text-sm';
      case 'lg':
        return 'w-11 h-11 text-base';
      case 'md':
      default:
        return 'w-9 h-9 text-sm';
    }
  }
}
