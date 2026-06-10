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
      'inline-flex items-center justify-center gap-2 rounded-md border transition',
      'bg-white dark:bg-slate-800',
      'text-slate-700 dark:text-slate-200',
      'border-slate-200 dark:border-slate-700',
      'hover:bg-slate-50 dark:hover:bg-slate-700',
      'active:bg-slate-100 dark:active:bg-slate-700',
      'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
      this.disabled || this.loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
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
      'text-slate-500 dark:text-slate-400',
    ].join(' ');

    return html`
      <span class="${iconClasses}" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          ${svg`<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.2"></circle>`}
          ${svg`<path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="3" fill="none"></path>`}
        </svg>
      </span>
      ${this.hasSlot('Label')
        ? html`<span class="text-slate-600 dark:text-slate-300">${this.msg.loading}</span>`
        : html``}
    `;
  }

  private renderDefaultIcon(): TemplateResult {
    const iconClasses = [
      'inline-flex items-center justify-center',
      this.getIconSizeClasses(),
      'text-slate-500 dark:text-slate-400',
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
      return html`<span class="inline-flex ${this.getIconSizeClasses()}" aria-hidden="true">${unsafeHTML(content)}</span>`;
    }
    return this.renderDefaultIcon();
  }

  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    const content = this.getSlotContent('Label');
    return html`<span class="text-slate-700 dark:text-slate-200">${unsafeHTML(content)}</span>`;
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
        class="${this.getButtonClasses()}"
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
