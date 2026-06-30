/// <mls fileReference="_102040_/l2/molecules/groupshowprogress/ml-segmented-progress.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// SEGMENTED PROGRESS MOLECULE
// =============================================================================
// Skill Group: groupShowProgress
// This molecule does NOT contain business logic.
import { html, nothing } from'lit';
import { customElement } from'lit/decorators.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
 defaultLabel:'Progress',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
 en: message_en,
};
/// **collab_i18n_end**

@customElement('groupshowprogress--ml-segmented-progress')
export class SegmentedProgressMolecule extends MoleculeAuraElement {
 private msg: MessageType = messages.en;
 // ===========================================================================
 // SLOT TAGS
 // ===========================================================================
 slotTags = [];
 // ===========================================================================
 // PROPERTIES — From Contract
 // ===========================================================================
 @propertyDataSource({ type: Number })
 value: number | null = null;

 @propertyDataSource({ type: String })
 size: string ='md';

 @propertyDataSource({ type: String })
 label: string ='';

 @propertyDataSource({ type: Boolean, attribute:'show-value' })
 showValue: boolean = false;
 // ===========================================================================
 // RENDER
 // ===========================================================================
 render() {
 const lang = this.getMessageKey(messages);
 this.msg = messages[lang];

 const isIndeterminate = this.value === null || this.value === undefined;
 const clampedValue = this.clampValue(this.value ?? 0);

 const sizeConfig = this.getSizeConfig();
 const barContainerClasses = this.buildBarContainerClasses(sizeConfig.heightClass, sizeConfig.radiusClass);
 const barFillClasses = this.buildBarFillClasses();
 const indeterminateClasses = this.buildIndeterminateClasses();
 const valueTextClasses = this.buildValueTextClasses(sizeConfig.textClass);

 return html`
 <div
 class="${cn('flex items-center gap-2 w-full', this.cssClass)}"
 role="progressbar"
 aria-label=${this.label || this.msg.defaultLabel}
 aria-valuemin=${isIndeterminate ? nothing :'0'}
 aria-valuemax=${isIndeterminate ? nothing :'100'}
 aria-valuenow=${isIndeterminate ? nothing : String(clampedValue)}
 >
 <div class=${barContainerClasses}>
 ${isIndeterminate
 ? html`<div class=${indeterminateClasses}></div>`
 : html`<div class=${barFillClasses} style="width: ${clampedValue}%;"></div>`}
 </div>
 ${!isIndeterminate && this.showValue
 ? html`<span class=${valueTextClasses}>${clampedValue}%</span>`
 : nothing}
 </div>
 `;
 }
 // ===========================================================================
 // HELPERS
 // ===========================================================================
 private clampValue(value: number): number {
 if (Number.isNaN(value)) return 0;
 return Math.max(0, Math.min(100, value));
 }

 private getSizeConfig(): { heightClass: string; textClass: string; radiusClass: string } {
 switch (this.size) {
 case'xs':
 return { heightClass:'h-1.5', textClass:'text-xs', radiusClass:'rounded-full' };
 case'sm':
 return { heightClass:'h-2', textClass:'text-xs', radiusClass:'rounded-full' };
 case'lg':
 return { heightClass:'h-4', textClass:'text-sm', radiusClass:'rounded-full' };
 case'md':
 default:
 return { heightClass:'h-3', textClass:'text-sm', radiusClass:'rounded-full' };
 }
 }

 private buildBarContainerClasses(heightClass: string, radiusClass: string): string {
 return [
'relative flex-1 overflow-hidden border',
 heightClass,
 radiusClass,
'ml-surface-dim-bg',
'ml-border',
 ].filter(Boolean).join(' ');
 }

 private buildBarFillClasses(): string {
 return [
'absolute inset-y-0 left-0 transition-all duration-300 ease-out',
'ml-primary-bg',
 ].filter(Boolean).join(' ');
 }

 private buildIndeterminateClasses(): string {
 return [
'absolute inset-y-0 left-0 w-1/2',
'ml-primary-bg',
'animate-pulse',
 ].filter(Boolean).join(' ');
 }

 private buildValueTextClasses(textClass: string): string {
 return [
 textClass,
'ml-text',
'tabular-nums',
 ].filter(Boolean).join(' ');
 }
}
