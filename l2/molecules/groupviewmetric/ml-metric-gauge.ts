/// <mls fileReference="_102040_/l2/molecules/groupviewmetric/ml-metric-gauge.ts" enhancement="_102020_/l2/enhancementAura" />

// =============================================================================
// METRIC GAUGE MOLECULE
// =============================================================================
// Skill Group: groupViewMetric
// This molecule does NOT contain business logic.
import { html, TemplateResult } from'lit';
import { unsafeHTML } from'lit/directives/unsafe-html.js';
import { ifDefined } from'lit/directives/if-defined.js';
import { customElement } from'lit/decorators.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';

@customElement('groupviewmetric--ml-metric-gauge')
export class MetricGaugeMolecule extends MoleculeAuraElement {
 // =========================================================================
 // SLOT TAGS
 // =========================================================================
 slotTags = ['Label','Value','Icon','Trend','Helper'];

 // =========================================================================
 // PROPERTIES — From Contract
 // =========================================================================
 @propertyDataSource({ type: Boolean })
 loading = false;

 // =========================================================================
 // RENDER
 // =========================================================================
 render() {
 if (this.loading) {
 return this.renderLoading();
 }

 const ariaLabel = this.getAriaLabel();

 return html`
 <div
 class="${cn('w-full rounded-xl border ml-border ml-surface-bg p-4', this.cssClass)}"
 role="figure"
 aria-label=${ifDefined(ariaLabel)}
 >
 <div class="flex items-start gap-3">
 ${this.renderIcon()}
 <div class="flex-1 min-w-0">
 ${this.renderLabel()}
 <div class="mt-1 flex items-end justify-between gap-3">
 ${this.renderValue()}
 ${this.renderTrend()}
 </div>
 ${this.renderGauge()}
 ${this.renderHelper()}
 </div>
 </div>
 </div>
 `;
 }

 // =========================================================================
 // RENDER PARTS
 // =========================================================================
 private renderIcon(): TemplateResult {
 if (!this.hasSlot('Icon')) return html``;
 const content = this.getSlotContent('Icon');
 return html`
 <div
 class="${cn('flex h-10 w-10 items-center justify-center rounded-lg ml-surface-dim-bg ml-text-muted', this.getSlotClass('Icon'))}"
 >
 ${unsafeHTML(content)}
 </div>
 `;
 }

 private renderLabel(): TemplateResult {
 if (!this.hasSlot('Label')) return html``;
 const content = this.getSlotContent('Label');
 return html`
 <div class="${cn('text-sm font-medium ml-text-muted', this.getSlotClass('Label'))}">
 ${unsafeHTML(content)}
 </div>
 `;
 }

 private renderValue(): TemplateResult {
 const content = this.getSlotContent('Value');
 return html`
 <div
 class="${cn('text-2xl font-semibold ml-text', this.getSlotClass('Value'))}"
 aria-live="polite"
 >
 ${unsafeHTML(content)}
 </div>
 `;
 }

 private renderTrend(): TemplateResult {
 if (!this.hasSlot('Trend')) return html``;
 const direction = this.getSlotAttr('Trend','direction') ||'neutral';
 const content = this.getSlotContent('Trend');
 const classes = cn(this.getTrendClasses(direction), this.getSlotClass('Trend'));
 return html`
 <div
 class=${classes}
 aria-label=${`Trend: ${direction}`}
 >
 ${unsafeHTML(content)}
 </div>
 `;
 }

 private renderHelper(): TemplateResult {
 if (!this.hasSlot('Helper')) return html``;
 const content = this.getSlotContent('Helper');
 return html`
 <div class="${cn('mt-2 text-xs ml-text-muted', this.getSlotClass('Helper'))}">
 ${unsafeHTML(content)}
 </div>
 `;
 }

 private renderGauge(): TemplateResult {
 return html`
 <div class="mt-3">
 <div
 class="relative h-2 w-full rounded-full ml-surface-dim-bg overflow-hidden"
 >
 <div
 class="absolute left-0 top-0 h-2 w-2/3 ml-primary-dim-bg0/60"
 ></div>
 <div
 class="absolute left-2/3 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full ml-primary-dim-bg0 border-2 border-white"
 ></div>
 </div>
 </div>
 `;
 }

 // =========================================================================
 // LOADING
 // =========================================================================
 private renderLoading(): TemplateResult {
 return html`
 <div
 class="w-full rounded-xl border ml-border ml-surface-bg p-4 animate-pulse"
 role="figure"
 >
 <div class="flex items-start gap-3">
 <div class="h-10 w-10 rounded-lg ml-surface-dim-bg"></div>
 <div class="flex-1">
 <div class="h-4 w-32 rounded ml-surface-dim-bg"></div>
 <div class="mt-2 h-7 w-40 rounded ml-surface-dim-bg"></div>
 <div class="mt-3 h-2 w-full rounded ml-surface-dim-bg"></div>
 <div class="mt-2 h-3 w-24 rounded ml-surface-dim-bg"></div>
 </div>
 </div>
 </div>
 `;
 }

 // =========================================================================
 // HELPERS
 // =========================================================================
 private getAriaLabel(): string | undefined {
 const labelEl = this.getSlot('Label');
 const text = labelEl?.textContent?.trim() ||'';
 return text ? text : undefined;
 }

 private getTrendClasses(direction: string): string {
 const base = [
'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border',
 ];

 if (direction ==='up') {
 base.push('ml-success-text', 'ml-success-dim-bg', 'ml-success-border');
 } else if (direction ==='down') {
 base.push('ml-error-text', 'ml-error-dim-bg', 'ml-border-error');
 } else {
 base.push('ml-text-muted', 'ml-surface-dim-bg', 'ml-border');
 }

 return base.join(' ');
 }
}
