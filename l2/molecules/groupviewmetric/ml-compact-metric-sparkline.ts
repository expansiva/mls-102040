/// <mls fileReference="_102040_/l2/molecules/groupviewmetric/ml-compact-metric-sparkline.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// COMPACT METRIC SPARKLINE MOLECULE
// =============================================================================
// Skill Group: groupViewMetric
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

@customElement('groupviewmetric--ml-compact-metric-sparkline')
export class CompactMetricSparklineMolecule extends MoleculeAuraElement {
  // ==========================================================================
  // SLOT TAGS
  // ==========================================================================
  slotTags = ['Label', 'Value', 'Icon', 'Trend', 'Helper'];

  // ==========================================================================
  // PROPERTIES — From Contract
  // ==========================================================================
  @propertyDataSource({ type: Boolean })
  loading = false;

  // ==========================================================================
  // RENDER
  // ==========================================================================
  render() {
    const ariaLabel = this.getFigureAriaLabel();
    return html`
      <div
        class="w-full"
        role="figure"
        aria-label="${ariaLabel}"
      >
        ${this.loading ? this.renderSkeleton() : this.renderContent()}
      </div>
    `;
  }

  // ==========================================================================
  // CONTENT RENDERING
  // ==========================================================================
  private renderContent(): TemplateResult {
    return html`
      <div class="flex items-start gap-3">
        ${this.renderIcon()}
        <div class="min-w-0 flex-1">
          ${this.renderLabel()}
          <div class="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            ${this.renderValue()}
            ${this.renderTrend()}
          </div>
          ${this.renderHelper()}
        </div>
      </div>
    `;
  }

  private renderIcon(): TemplateResult {
    if (!this.hasSlot('Icon')) return html``;
    return html`
      <div
        class="mt-0.5 flex h-6 w-6 items-center justify-center text-slate-600 dark:text-slate-400"
        aria-hidden="true"
      >
        ${unsafeHTML(this.getSlotContent('Icon'))}
      </div>
    `;
  }

  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    return html`
      <div class="text-sm text-slate-600 dark:text-slate-400">
        ${unsafeHTML(this.getSlotContent('Label'))}
      </div>
    `;
  }

  private renderValue(): TemplateResult {
    return html`
      <div
        class="text-xl font-semibold text-slate-900 dark:text-slate-100"
        aria-live="polite"
      >
        ${unsafeHTML(this.getSlotContent('Value'))}
      </div>
    `;
  }

  private renderTrend(): TemplateResult {
    if (!this.hasSlot('Trend')) return html``;
    const direction = this.getSlotAttr('Trend', 'direction');
    const trendLabel = direction ? `Trend: ${direction}` : '';
    const trendClasses = this.getTrendClasses(direction || 'neutral');
    return html`
      <div class="${trendClasses}" ${trendLabel ? html`aria-label="${trendLabel}"` : html``}>
        ${unsafeHTML(this.getSlotContent('Trend'))}
      </div>
    `;
  }

  private renderHelper(): TemplateResult {
    if (!this.hasSlot('Helper')) return html``;
    return html`
      <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
        ${unsafeHTML(this.getSlotContent('Helper'))}
      </div>
    `;
  }

  // ==========================================================================
  // SKELETON
  // ==========================================================================
  private renderSkeleton(): TemplateResult {
    const hasIcon = this.hasSlot('Icon');
    const hasLabel = this.hasSlot('Label');
    const hasTrend = this.hasSlot('Trend');
    const hasHelper = this.hasSlot('Helper');

    return html`
      <div class="flex items-start gap-3 animate-pulse">
        ${hasIcon
          ? html`
              <div class="mt-0.5 h-6 w-6 rounded-md bg-slate-200 dark:bg-slate-700"></div>
            `
          : html``}
        <div class="min-w-0 flex-1">
          ${hasLabel
            ? html`
                <div class="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700"></div>
              `
            : html``}
          <div class="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <div class="h-6 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
            ${hasTrend
              ? html`
                  <div class="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700"></div>
                `
              : html``}
          </div>
          ${hasHelper
            ? html`
                <div class="mt-2 h-3 w-28 rounded bg-slate-200 dark:bg-slate-700"></div>
              `
            : html``}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // HELPERS
  // ==========================================================================
  private getTrendClasses(direction: string): string {
    const base = [
      'text-xs font-medium',
      'rounded-md',
      'px-1.5 py-0.5',
      'pointer-events-auto',
      'inline-flex items-center gap-1',
    ];

    const tone =
      direction === 'up'
        ? 'text-emerald-600 dark:text-emerald-400'
        : direction === 'down'
          ? 'text-red-600 dark:text-red-400'
          : 'text-slate-500 dark:text-slate-400';

    return [...base, tone].join(' ');
  }

  private getFigureAriaLabel(): string {
    if (!this.hasSlot('Label')) return 'Metric';
    const raw = this.getSlotContent('Label');
    return this.stripHtml(raw).trim() || 'Metric';
  }

  private stripHtml(content: string): string {
    return content.replace(/<[^>]*>/g, ' ');
  }
}
