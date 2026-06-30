/// <mls fileReference="_102040_/l2/molecules/groupviewmetric/ml-compact-metric-sparkline.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// COMPACT METRIC SPARKLINE MOLECULE
// =============================================================================
// Skill Group: groupViewMetric
// This molecule does NOT contain business logic.
import { html, TemplateResult } from'lit';
import { customElement } from'lit/decorators.js';
import { unsafeHTML } from'lit/directives/unsafe-html.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';

@customElement('groupviewmetric--ml-compact-metric-sparkline')
export class CompactMetricSparklineMolecule extends MoleculeAuraElement {
 // ==========================================================================
 // SLOT TAGS
 // ==========================================================================
 slotTags = ['Label','Value','Icon','Trend','Helper'];

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
 class="${cn('w-full', this.cssClass)}"
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
 class="mt-0.5 flex h-6 w-6 items-center justify-center ml-text-muted"
 aria-hidden="true"
 >
 ${unsafeHTML(this.getSlotContent('Icon'))}
 </div>
 `;
 }

 private renderLabel(): TemplateResult {
 if (!this.hasSlot('Label')) return html``;
 return html`
 <div class="${cn('text-sm ml-text-muted', this.getSlotClass('Label'))}">
 ${unsafeHTML(this.getSlotContent('Label'))}
 </div>
 `;
 }

 private renderValue(): TemplateResult {
 return html`
 <div
 class="text-xl font-semibold ml-text"
 aria-live="polite"
 >
 ${unsafeHTML(this.getSlotContent('Value'))}
 </div>
 `;
 }

 private renderTrend(): TemplateResult {
 if (!this.hasSlot('Trend')) return html``;
 const direction = this.getSlotAttr('Trend','direction');
 const trendLabel = direction ? `Trend: ${direction}` :'';
 const trendClasses = this.getTrendClasses(direction ||'neutral');
 return html`
 <div class="${trendClasses}" ${trendLabel ? html`aria-label="${trendLabel}"` : html``}>
 ${unsafeHTML(this.getSlotContent('Trend'))}
 </div>
 `;
 }

 private renderHelper(): TemplateResult {
 if (!this.hasSlot('Helper')) return html``;
 return html`
 <div class="${cn('mt-1 text-xs ml-text-muted', this.getSlotClass('Helper'))}">
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
 <div class="mt-0.5 h-6 w-6 rounded-md ml-surface-dim-bg"></div>
 `
 : html``}
 <div class="min-w-0 flex-1">
 ${hasLabel
 ? html`
 <div class="h-3 w-24 rounded ml-surface-dim-bg"></div>
 `
 : html``}
 <div class="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
 <div class="h-6 w-32 rounded ml-surface-dim-bg"></div>
 ${hasTrend
 ? html`
 <div class="h-4 w-20 rounded ml-surface-dim-bg"></div>
 `
 : html``}
 </div>
 ${hasHelper
 ? html`
 <div class="mt-2 h-3 w-28 rounded ml-surface-dim-bg"></div>
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
 direction ==='up'
 ?'ml-success-text'
 : direction ==='down'
 ?'ml-error-text'
 :'ml-text-muted';

 return [...base, tone].join(' ');
 }

 private getFigureAriaLabel(): string {
 if (!this.hasSlot('Label')) return'Metric';
 const raw = this.getSlotContent('Label');
 return this.stripHtml(raw).trim() ||'Metric';
 }

 private stripHtml(content: string): string {
 return content.replace(/<[^>]*>/g,'');
 }
}
