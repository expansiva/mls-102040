/// <mls fileReference="_102040_/l2/molecules/groupviewmetric/ml-metric-trend-compare.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML METRIC TREND COMPARE MOLECULE
// =============================================================================
// Skill Group: groupViewMetric
// This molecule does NOT contain business logic.
import { html, TemplateResult } from'lit';
import { customElement, state } from'lit/decorators.js';
import { unsafeHTML } from'lit/directives/unsafe-html.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
metric:'Metric',
loadingMetric:'Loading metric',
trendUp:'Trend: up',
trendDown:'Trend: down',
trendNeutral:'Trend: neutral',
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
 slotTags = ['Label','Value','Icon','Trend','Helper'];

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
 class="${cn('w-full rounded-xl border ml-border ml-surface-bg p-4', this.cssClass)}"
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
 <div class="${cn('text-sm font-medium ml-text-muted', this.getSlotClass('Label'))}">
 ${unsafeHTML(content)}
 </div>
 `;
 }

 private renderValue(): TemplateResult {
 const content = this.hasSlot('Value') ? this.getSlotContent('Value') :'';
 // Update announce key to re-announce on external content changes
 this.announceKey += 1;
 return html`
 <div
 class="${cn('mt-1 text-3xl font-semibold ml-text', this.getSlotClass('Value'))}"
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
 <div class="${cn('flex items-center ml-text-muted', this.getSlotClass('Icon'))}">
 ${unsafeHTML(content)}
 </div>
 `;
 }

 private renderTrend(): TemplateResult {
 if (!this.hasSlot('Trend')) return html``;
 const direction = (this.getSlotAttr('Trend','direction') ||'neutral') as
 |'up'
 |'down'
 |'neutral';
 const content = this.getSlotContent('Trend');
 const ariaLabel = this.getTrendAriaLabel(direction);

 return html`
 <div
 class="${cn('inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ' + this.getTrendClasses(direction), this.getSlotClass('Trend'))}"
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
 <div class="${cn('text-xs ml-text-muted', this.getSlotClass('Helper'))}">
 ${unsafeHTML(content)}
 </div>
 `;
 }

 private renderLoadingSkeleton(): TemplateResult {
 return html`
 <div
 class="w-full rounded-xl border ml-border ml-surface-bg p-4"
 role="figure"
 aria-label="${this.msg.loadingMetric}"
 aria-busy="true"
 >
 <div class="animate-pulse">
 <div class="h-4 w-32 rounded ml-surface-dim-bg"></div>
 <div class="mt-2 h-8 w-40 rounded ml-surface-dim-bg"></div>
 <div class="mt-3 flex items-center gap-3">
 <div class="h-5 w-20 rounded-full ml-surface-dim-bg"></div>
 <div class="h-3 w-28 rounded ml-surface-dim-bg"></div>
 </div>
 </div>
 </div>
 `;
 }

 // ==========================================================================
 // UTILITIES
 // ==========================================================================
 private getTrendClasses(direction:'up' |'down' |'neutral'): string {
 if (direction ==='up') {
 return [
'border ml-success-border',
'ml-success-text',
'ml-success-dim-bg',
 ].join(' ');
 }

 if (direction ==='down') {
 return [
'border ml-border-error',
'ml-error-text',
'ml-error-dim-bg',
 ].join(' ');
 }

 return 'border ml-border ml-text-muted ml-surface-dim-bg';
 }

 private getTrendAriaLabel(direction:'up' |'down' |'neutral'): string {
 if (direction ==='up') return this.msg.trendUp;
 if (direction ==='down') return this.msg.trendDown;
 return this.msg.trendNeutral;
 }

 private getLabelText(): string {
 if (!this.hasSlot('Label')) return'';
 const content = this.getSlotContent('Label');
 return this.stripHtml(content).trim();
 }

 private stripHtml(value: string): string {
 return value.replace(/<[^>]*>/g,'');
 }
}
