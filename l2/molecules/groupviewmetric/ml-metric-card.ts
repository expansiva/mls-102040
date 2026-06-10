/// <mls fileReference="_102040_/l2/molecules/groupviewmetric/ml-metric-card.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// METRIC CARD MOLECULE
// =============================================================================
// Skill Group: groupViewMetric
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

@customElement('groupviewmetric--ml-metric-card')
export class MetricCardMolecule extends MoleculeAuraElement {
  // ===========================================================================
  // SLOT TAGS
  // ==========================================================================='
  slotTags = ['Label', 'Value', 'Icon', 'Trend', 'Helper'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: Boolean })
  loading = false;

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private getBaseClasses(): string {
    return [
      'w-full rounded-xl border p-4 transition',
      'bg-white dark:bg-slate-800',
      'border-slate-200 dark:border-slate-700',
      'text-slate-900 dark:text-slate-100',
    ].join(' ');
  }

  private getLabelClasses(): string {
    return [
      'text-sm font-medium',
      'text-slate-600 dark:text-slate-400',
    ].join(' ');
  }

  private getValueClasses(): string {
    return [
      'text-3xl font-semibold tracking-tight',
      'text-slate-900 dark:text-slate-100',
    ].join(' ');
  }

  private getHelperClasses(): string {
    return [
      'text-xs',
      'text-slate-500 dark:text-slate-400',
    ].join(' ');
  }

  private getTrendClasses(direction: string | null): string {
    const base = [
      'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium border',
    ];
    if (direction === 'up') {
      base.push(
        'text-emerald-700 dark:text-emerald-300',
        'bg-emerald-50 dark:bg-emerald-900/30',
        'border-emerald-200 dark:border-emerald-700',
      );
    } else if (direction === 'down') {
      base.push(
        'text-red-600 dark:text-red-400',
        'bg-red-50 dark:bg-red-900/30',
        'border-red-200 dark:border-red-700',
      );
    } else {
      base.push(
        'text-slate-600 dark:text-slate-400',
        'bg-slate-50 dark:bg-slate-900',
        'border-slate-200 dark:border-slate-700',
      );
    }
    return base.join(' ');
  }

  private getAriaLabelFromHtml(content: string): string {
    if (!content) return '';
    return content.replace(/<[^>]*>/g, '').trim();
  }

  private renderIcon(): TemplateResult {
    if (!this.hasSlot('Icon')) return html``;
    return html`
      <div class="flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-900 p-2">
        <span class="text-slate-700 dark:text-slate-300">
          ${unsafeHTML(this.getSlotContent('Icon'))}
        </span>
      </div>
    `;
  }

  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    return html`
      <div class="${this.getLabelClasses()}">
        ${unsafeHTML(this.getSlotContent('Label'))}
      </div>
    `;
  }

  private renderValue(): TemplateResult {
    return html`
      <div class="${this.getValueClasses()}" aria-live="polite">
        ${unsafeHTML(this.getSlotContent('Value'))}
      </div>
    `;
  }

  private renderTrend(): TemplateResult {
    if (!this.hasSlot('Trend')) return html``;
    const direction = this.getSlotAttr('Trend', 'direction');
    const aria = direction ? `Trend: ${direction}` : '';
    return html`
      <div class="${this.getTrendClasses(direction)}" aria-label=${aria}>
        ${unsafeHTML(this.getSlotContent('Trend'))}
      </div>
    `;
  }

  private renderHelper(): TemplateResult {
    if (!this.hasSlot('Helper')) return html``;
    return html`
      <div class="${this.getHelperClasses()}">
        ${unsafeHTML(this.getSlotContent('Helper'))}
      </div>
    `;
  }

  private renderSkeleton(): TemplateResult {
    const block = [
      'rounded-md bg-slate-200 dark:bg-slate-700',
    ].join(' ');
    return html`
      <div class="flex items-start gap-3">
        <div class="h-10 w-10 ${block}"></div>
        <div class="flex-1 space-y-2">
          <div class="h-3 w-1/2 ${block}"></div>
          <div class="h-8 w-2/3 ${block}"></div>
          <div class="h-4 w-1/3 ${block}"></div>
        </div>
      </div>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const labelContent = this.getSlotContent('Label');
    const ariaLabel = this.getAriaLabelFromHtml(labelContent);

    return html`
      <div class="${this.getBaseClasses()}" role="figure" aria-label=${ariaLabel}>
        ${this.loading
          ? this.renderSkeleton()
          : html`
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-start gap-3">
                  ${this.renderIcon()}
                  <div class="space-y-1">
                    ${this.renderLabel()}
                    ${this.renderValue()}
                  </div>
                </div>
                <div class="pt-1">${this.renderTrend()}</div>
              </div>
              <div class="mt-2">${this.renderHelper()}</div>
            `}
      </div>
    `;
  }
}
