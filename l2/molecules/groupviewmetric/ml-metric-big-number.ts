/// <mls fileReference="_102040_/l2/molecules/groupviewmetric/ml-metric-big-number.ts" enhancement="_102020_/l2/enhancementAura" />

// Do not change – automatically generated code. 
// =============================================================================
// ML METRIC BIG NUMBER MOLECULE
// =============================================================================
// Skill Group: groupViewMetric
// This molecule does NOT contain business logic.
import { html, TemplateResult } from'lit';
import { unsafeHTML } from'lit/directives/unsafe-html.js';
import { customElement } from'lit/decorators.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';

@customElement('groupviewmetric--ml-metric-big-number')
export class MlMetricBigNumberMolecule extends MoleculeAuraElement {
 // ===========================================================================
 // SLOT TAGS
 // ===========================================================================
 slotTags = ['Label','Value','Icon','Trend','Helper'];

 // ===========================================================================
 // PROPERTIES — From Contract
 // ===========================================================================
 @propertyDataSource({ type: Boolean })
 loading = false;

 // ===========================================================================
 // RENDER
 // ===========================================================================
 render(): TemplateResult {
 if (this.loading) {
 return this.renderLoadingSkeleton();
 }

 if (!this.hasSlot('Value')) {
 return html``;
 }

 const ariaLabel = this.getAriaLabel();

 return html`
 <div class="${cn(this.getContainerClasses(), this.cssClass)}" role="figure" aria-label="${ariaLabel}">
 ${this.hasSlot('Icon') ? this.renderIcon() : html``}
 ${this.hasSlot('Label') ? this.renderLabel() : html``}
 ${this.renderValue()}
 ${this.hasSlot('Trend') ? this.renderTrend() : html``}
 ${this.hasSlot('Helper') ? this.renderHelper() : html``}
 </div>
 `;
 }

 // ===========================================================================
 // RENDER HELPERS
 // ===========================================================================
 private renderIcon(): TemplateResult {
 const content = this.getSlotContent('Icon');
 return html`
 <div class="${cn('flex items-center ml-text-muted', this.getSlotClass('Icon'))}">
 ${unsafeHTML(content)}
 </div>
 `;
 }

 private renderLabel(): TemplateResult {
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
 class="${cn('text-4xl leading-tight font-semibold ml-text', this.getSlotClass('Value'))}"
 aria-live="polite"
 >
 ${unsafeHTML(content)}
 </div>
 `;
 }

 private renderTrend(): TemplateResult {
 const direction = this.getTrendDirection();
 const content = this.getSlotContent('Trend');
 return html`
 <div
 class="${cn(this.getTrendClasses(direction), this.getSlotClass('Trend'))}"
 aria-label="Trend: ${direction}"
 >
 ${unsafeHTML(content)}
 </div>
 `;
 }

 private renderHelper(): TemplateResult {
 const content = this.getSlotContent('Helper');
 return html`
 <div class="${cn('text-xs ml-text-muted', this.getSlotClass('Helper'))}">
 ${unsafeHTML(content)}
 </div>
 `;
 }

 private renderLoadingSkeleton(): TemplateResult {
 return html`
 <div class="${this.getContainerClasses()}" role="figure" aria-busy="true">
 <div class="h-4 w-24 rounded ml-surface-dim-bg animate-pulse"></div>
 <div class="mt-2 h-10 w-40 rounded ml-surface-dim-bg animate-pulse"></div>
 <div class="mt-2 h-4 w-20 rounded ml-surface-dim-bg animate-pulse"></div>
 </div>
 `;
 }

 // ===========================================================================
 // CLASS HELPERS
 // ===========================================================================
 private getContainerClasses(): string {
 return [
'flex flex-col gap-1 rounded-lg p-4',
'ml-surface-bg',
'border ml-border',
 ].join(' ');
 }

 private getTrendClasses(direction:'up' |'down' |'neutral'): string {
 const color =
 direction ==='up'
 ?'ml-success-text'
 : direction ==='down'
 ?'ml-error-text'
 :'ml-text-muted';

 return [
'inline-flex items-center gap-1 text-sm font-medium',
 color,
 ].join(' ');
 }

 // ===========================================================================
 // UTILITIES
 // ===========================================================================
 private getTrendDirection():'up' |'down' |'neutral' {
 const dir = this.getSlotAttr('Trend','direction');
 if (dir ==='up' || dir ==='down' || dir ==='neutral') return dir;
 return'neutral';
 }

 private getAriaLabel(): string {
 const raw = this.getSlotContent('Label') ||'Metric';
 return raw.replace(/<[^>]*>/g,'').trim() ||'Metric';
 }
}
