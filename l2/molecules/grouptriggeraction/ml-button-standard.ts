/// <mls fileReference="_102040_/l2/molecules/grouptriggeraction/ml-button-standard.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// BUTTON STANDARD MOLECULE
// =============================================================================
// Skill Group: groupTriggerAction
// This molecule does NOT contain business logic.
import { html, nothing, svg, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

@customElement('grouptriggeraction--ml-button-standard')
export class ButtonStandardMolecule extends MoleculeAuraElement {
  // ==========================================================================
  // SLOT TAGS
  // ==========================================================================
  slotTags = ['Label', 'Icon'];

  // ==========================================================================
  // PROPERTIES — From Contract
  // ==========================================================================
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

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================
  private handleActionClick(e: Event) {
    const isDisabled = this.isDisabled();
    if (isDisabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    this.dispatchEvent(
      new CustomEvent('action', {
        bubbles: true,
        composed: true,
        detail: {},
      }),
    );
  }

  // ==========================================================================
  // HELPERS
  // ==========================================================================
  private isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  private getVariant(): 'primary' | 'secondary' | 'danger' | 'ghost' | 'link' {
    const variant = (this.getAttribute('data-variant') || 'primary').toLowerCase();
    if (variant === 'secondary' || variant === 'danger' || variant === 'ghost' || variant === 'link') {
      return variant;
    }
    return 'primary';
  }

  private getSizeKey(): 'xs' | 'sm' | 'md' | 'lg' {
    if (this.size === 'xs' || this.size === 'sm' || this.size === 'lg') return this.size;
    return 'md';
  }

  private getSizeClasses(hasLabel: boolean): { button: string; icon: string; spinner: string; gap: string } {
    const sizeKey = this.getSizeKey();
    const iconOnly = !hasLabel;
    const paddingMap: Record<string, string> = {
      xs: iconOnly ? 'p-1.5' : 'px-2 py-1',
      sm: iconOnly ? 'p-2' : 'px-3 py-1.5',
      md: iconOnly ? 'p-2.5' : 'px-4 py-2',
      lg: iconOnly ? 'p-3' : 'px-5 py-2.5',
    };
    const iconMap: Record<string, string> = {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };
    const gapMap: Record<string, string> = {
      xs: 'gap-1.5 text-xs',
      sm: 'gap-2 text-sm',
      md: 'gap-2 text-sm',
      lg: 'gap-2.5 text-base',
    };
    return {
      button: paddingMap[sizeKey],
      icon: iconMap[sizeKey],
      spinner: iconMap[sizeKey],
      gap: gapMap[sizeKey],
    };
  }

  private getVariantClasses(variant: string): string {
    const baseMap: Record<string, string> = {
      primary: 'ml-button-primary',
      secondary: 'ml-button-secondary',
      danger: 'ml-button-danger',
      ghost: 'ml-button-ghost',
      link: 'ml-button-link',
    };
    return baseMap[variant] || baseMap.primary;
  }

  private getButtonClasses(hasLabel: boolean): string {
    const isDisabled = this.isDisabled();
    const variant = this.getVariant();
    const sizeClasses = this.getSizeClasses(hasLabel);
    return [
      'inline-flex items-center justify-center',
      'ml-button',
      sizeClasses.button,
      sizeClasses.gap,
      this.getVariantClasses(variant),
      isDisabled ? 'ml-disabled' : 'cursor-pointer',
    ].filter(Boolean).join(' ');
  }

  private getIconClasses(sizeClass: string): string {
    return [
      'inline-flex items-center justify-center',
      sizeClass,
    ].join(' ');
  }

  private renderSpinner(sizeClass: string): TemplateResult {
    return html`
      <svg
        class="animate-spin ${sizeClass}"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        ${svg`<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25" stroke-width="4"></circle>`}
        ${svg`<path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="4" stroke-linecap="round"></path>`}
      </svg>
    `;
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================
  render() {
    const labelContent = (this.getSlotContent('Label') || '').trim();
    const iconContent = (this.getSlotContent('Icon') || '').trim();
    const hasLabel = labelContent.length > 0;
    const hasIcon = iconContent.length > 0;
    const isDisabled = this.isDisabled();
    const sizeClasses = this.getSizeClasses(hasLabel);
    const iconPosition = this.iconPosition === 'end' ? 'end' : 'start';
    const ariaLabel = !hasLabel && hasIcon ? labelContent : undefined;

    const iconTemplate = hasIcon
      ? html`<span class="${cn(this.getIconClasses(sizeClasses.icon), this.getSlotClass('Icon'))}">${unsafeHTML(iconContent)}</span>`
      : nothing;

    const spinnerTemplate = html`<span class="${this.getIconClasses(sizeClasses.spinner)}">${this.renderSpinner(sizeClasses.spinner)}</span>`;

    const labelTemplate = hasLabel
      ? html`<span class="${cn(this.loading && !hasIcon ? 'opacity-0' : '', this.getSlotClass('Label'))}">${unsafeHTML(labelContent)}</span>`
      : nothing;

    const labelWithSpinner = html`
      <span class="relative inline-flex items-center justify-center">
        ${labelTemplate}
        ${this.loading && !hasIcon ? html`<span class="absolute">${spinnerTemplate}</span>` : nothing}
      </span>
    `;

    const contentTemplate = html`
      ${iconPosition === 'start'
        ? html`
            ${this.loading && hasIcon ? spinnerTemplate : iconTemplate}
            ${labelWithSpinner}
          `
        : html`
            ${labelWithSpinner}
            ${this.loading && hasIcon ? spinnerTemplate : iconTemplate}
          `}
    `;

    return html`
      <button
        class="${cn(this.getButtonClasses(hasLabel), this.cssClass)}"
        type="${this.type}"
        ?disabled=${isDisabled}
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-disabled=${isDisabled ? 'true' : 'false'}
        aria-label=${ariaLabel || nothing}
        @click=${this.handleActionClick}
      >
        ${contentTemplate}
      </button>
    `;
  }
}
