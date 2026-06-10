/// <mls fileReference="_102040_/l2/molecules/groupviewmetric/ml-metric-trend-compare.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML METRIC TREND COMPARE MOLECULE
// =============================================================================
// Skill Group: groupViewMetric
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
metric: 'Metric',
loadingMetric: 'Loading metric',
trendUp: 'Trend: up',
trendDown: 'Trend: down',
trendNeutral: 'Trend: neutral',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
};
/// **collab_i18n_end**

@customElement('groupviewmetric--ml-metric-trend-compare')
export class MlMetricTrendCompareMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

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
  // INTERNAL STATE
  // ==========================================================================
  @state()
  private announceKey = 0;

  // ==========================================================================
  // RENDER
  // ==========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    if (this.loading) {
      return this.renderLoadingSkeleton();
    }

    const labelText = this.getLabelText();

    return html`
      <div
        class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4"
        role="figure"
        aria-label="${labelText || this.msg.metric}"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            ${this.renderLabel()}
            ${this.renderValue()}
          </div>
          ${this.renderIcon()}
        </div>
        <div class="mt-2 flex items-center gap-3">
          ${this.renderTrend()}
          ${this.renderHelper()}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================
  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    const content = this.getSlotContent('Label');
    return html`
      <div class="text-sm font-medium text-slate-600 dark:text-slate-400">
        ${unsafeHTML(content)}
      </div>
    `;
  }

  private renderValue(): TemplateResult {
    const content = this.hasSlot('Value') ? this.getSlotContent('Value') : '';
    // Update announce key to re-announce on external content changes
    this.announceKey += 1;
    return html`
      <div
        class="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100"
        aria-live="polite"
        data-announce-key="${this.announceKey}"
      >
        ${unsafeHTML(content)}
      </div>
    `;
  }

  private renderIcon(): TemplateResult {
    if (!this.hasSlot('Icon')) return html``;
    const content = this.getSlotContent('Icon');
    return html`
      <div class="flex items-center text-slate-500 dark:text-slate-400">
        ${unsafeHTML(content)}
      </div>
    `;
  }

  private renderTrend(): TemplateResult {
    if (!this.hasSlot('Trend')) return html``;
    const direction = (this.getSlotAttr('Trend', 'direction') || 'neutral') as
      | 'up'
      | 'down'
      | 'neutral';
    const content = this.getSlotContent('Trend');
    const ariaLabel = this.getTrendAriaLabel(direction);

    return html`
      <div
        class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${this.getTrendClasses(
          direction,
        )}"
        aria-label="${ariaLabel}"
      >
        ${unsafeHTML(content)}
      </div>
    `;
  }

  private renderHelper(): TemplateResult {
    if (!this.hasSlot('Helper')) return html``;
    const content = this.getSlotContent('Helper');
    return html`
      <div class="text-xs text-slate-500 dark:text-slate-400">
        ${unsafeHTML(content)}
      </div>
    `;
  }

  private renderLoadingSkeleton(): TemplateResult {
    return html`
      <div
        class="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4"
        role="figure"
        aria-label="${this.msg.loadingMetric}"
        aria-busy="true"
      >
        <div class="animate-pulse">
          <div class="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
          <div class="mt-2 h-8 w-40 rounded bg-slate-200 dark:bg-slate-700"></div>
          <div class="mt-3 flex items-center gap-3">
            <div class="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            <div class="h-3 w-28 rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // UTILITIES
  // ==========================================================================
  private getTrendClasses(direction: 'up' | 'down' | 'neutral'): string {
    const base =
      'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900';

    if (direction === 'up') {
      return [
        'border border-emerald-500 dark:border-emerald-400',
        'text-emerald-700 dark:text-emerald-300',
        'bg-emerald-50 dark:bg-emerald-900/40',
      ].join(' ');
    }

    if (direction === 'down') {
      return [
        'border border-red-500 dark:border-red-400',
        'text-red-700 dark:text-red-300',
        'bg-red-50 dark:bg-red-900/40',
      ].join(' ');
    }

    return base;
  }

  private getTrendAriaLabel(direction: 'up' | 'down' | 'neutral'): string {
    if (direction === 'up') return this.msg.trendUp;
    if (direction === 'down') return this.msg.trendDown;
    return this.msg.trendNeutral;
  }

  private getLabelText(): string {
    if (!this.hasSlot('Label')) return '';
    const content = this.getSlotContent('Label');
    return this.stripHtml(content).trim();
  }

  private stripHtml(value: string): string {
    return value.replace(/<[^>]*>/g, '');
  }
}
