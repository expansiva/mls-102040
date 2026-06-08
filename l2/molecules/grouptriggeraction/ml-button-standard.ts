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

  private getVariantClasses(variant: string, isDisabled: boolean): string {
    const hoverActive = !isDisabled;
    const baseMap: Record<string, string> = {
      primary: [
        'bg-sky-600 dark:bg-sky-500 text-white',
        'border border-sky-600 dark:border-sky-500',
        hoverActive ? 'hover:bg-sky-700 dark:hover:bg-sky-400 active:bg-sky-800 dark:active:bg-sky-600' : '',
      ].filter(Boolean).join(' '),
      secondary: [
        'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100',
        'border border-slate-200 dark:border-slate-700',
        hoverActive ? 'hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-600' : '',
      ].filter(Boolean).join(' '),
      danger: [
        'bg-red-600 dark:bg-red-500 text-white',
        'border border-red-600 dark:border-red-500',
        hoverActive ? 'hover:bg-red-700 dark:hover:bg-red-400 active:bg-red-800 dark:active:bg-red-600' : '',
      ].filter(Boolean).join(' '),
      ghost: [
        'bg-transparent text-slate-700 dark:text-slate-300',
        'border border-transparent',
        hoverActive ? 'hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-600' : '',
      ].filter(Boolean).join(' '),
      link: [
        'bg-transparent text-sky-600 dark:text-sky-400',
        'border border-transparent',
        hoverActive ? 'hover:underline active:text-sky-700 dark:active:text-sky-300' : '',
      ].filter(Boolean).join(' '),
    };
    return baseMap[variant] || baseMap.primary;
  }

  private getButtonClasses(hasLabel: boolean): string {
    const isDisabled = this.isDisabled();
    const variant = this.getVariant();
    const sizeClasses = this.getSizeClasses(hasLabel);
    return [
      'inline-flex items-center justify-center rounded-md font-medium transition',
      'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
      'focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900',
      sizeClasses.button,
      sizeClasses.gap,
      this.getVariantClasses(variant, isDisabled),
      isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
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
      ? html`<span class="${this.getIconClasses(sizeClasses.icon)}">${unsafeHTML(iconContent)}</span>`
      : nothing;

    const spinnerTemplate = html`<span class="${this.getIconClasses(sizeClasses.spinner)}">${this.renderSpinner(sizeClasses.spinner)}</span>`;

    const labelTemplate = hasLabel
      ? html`<span class="${this.loading && !hasIcon ? 'opacity-0' : ''}">${unsafeHTML(labelContent)}</span>`
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
        class="${this.getButtonClasses(hasLabel)}"
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
