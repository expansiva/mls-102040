/// <mls fileReference="_102040_/l2/molecules/groupshowprogress/ml-linear-progress.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// LINEAR PROGRESS MOLECULE
// =============================================================================
// Skill Group: groupShowProgress
// This molecule does NOT contain business logic.
import { html } from'lit';
import { ifDefined } from'lit/directives/if-defined.js';
import { customElement } from'lit/decorators.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';

@customElement('groupshowprogress--ml-linear-progress')
export class LinearProgressMolecule extends MoleculeAuraElement {
 // ===========================================================================
 // SLOT TAGS
 // ===========================================================================
 slotTags: string[] = [];

 // ===========================================================================
 // PROPERTIES — From Contract
 // ===========================================================================
 @propertyDataSource({ type: Number })
 value: number | null = null;

 @propertyDataSource({ type: String })
 size:'xs' |'sm' |'md' |'lg' ='md';

 @propertyDataSource({ type: String })
 label: string ='';

 @propertyDataSource({ type: Boolean, attribute:'show-value' })
 showValue: boolean = false;

 @propertyDataSource({ type: String })
 variant:'default' |'success' |'warning' |'danger' ='default';

 // ===========================================================================
 // HELPERS
 // ===========================================================================
 private getNormalizedValue(): number | null {
 if (this.value === null || this.value === undefined) return null;
 const clamped = Math.max(0, Math.min(100, this.value));
 return clamped;
 }

 private getSizeClasses(): string {
 const sizeMap: Record<string, string> = {
 xs:'h-1.5',
 sm:'h-2',
 md:'h-3',
 lg:'h-4',
 };
 return sizeMap[this.size] || sizeMap.md;
 }

 private getTextSizeClasses(): string {
 const sizeMap: Record<string, string> = {
 xs:'text-xs',
 sm:'text-xs',
 md:'text-sm',
 lg:'text-sm',
 };
 return sizeMap[this.size] || sizeMap.md;
 }

 private getTrackClasses(): string {
 return [
'w-full rounded-full overflow-hidden',
'ml-surface-dim-bg',
 ].join(' ');
 }

 private getFillClasses(isIndeterminate: boolean): string {
 const variantMap: Record<string, string> = {
 default:'ml-primary-bg',
 success:'ml-success-bg',
 warning:'ml-warning-bg',
 danger:'ml-error-bg',
 };
 return [
'h-full rounded-full transition-[width] duration-300 ease-out',
 variantMap[this.variant] || variantMap.default,
 isIndeterminate ?'mlp-indeterminate' :'',
 ].filter(Boolean).join(' ');
 }

 private renderValueText(value: number | null) {
 if (value === null || !this.showValue) return null;
 const textClasses = [
'min-w-[3rem] text-right',
 this.getTextSizeClasses(),
'ml-text-muted',
 ].join(' ');
 return html`<span class="${textClasses}">${Math.round(value)}%</span>`;
 }

 // ===========================================================================
 // RENDER
 // ===========================================================================
 render() {
 const normalized = this.getNormalizedValue();
 const isIndeterminate = normalized === null;
 const isComplete = normalized === 100;

 const trackClasses = [
 this.getTrackClasses(),
 this.getSizeClasses(),
 ].join(' ');

 const fillClasses = this.getFillClasses(isIndeterminate);
 const widthStyle = isIndeterminate ?'' : `width: ${normalized}%;`;

 return html`
 <style>
 @keyframes mlp-indeterminate {
 0% { transform: translateX(-60%); }
 100% { transform: translateX(160%); }
 }
 .mlp-indeterminate {
 width: 40%;
 animation: mlp-indeterminate 1.2s ease-in-out infinite;
 }
 </style>
 <div
 class="${cn('w-full flex items-center gap-2', this.cssClass)}"
 role="progressbar"
 aria-label=${ifDefined(this.label || undefined)}
 aria-valuemin=${ifDefined(isIndeterminate ? undefined :'0')}
 aria-valuemax=${ifDefined(isIndeterminate ? undefined :'100')}
 aria-valuenow=${ifDefined(isIndeterminate ? undefined : String(normalized))}
 >
 <div class="${trackClasses}">
 <div
 class="${fillClasses}"
 style="${widthStyle}"
 aria-hidden="true"
 ></div>
 </div>
 ${this.renderValueText(isIndeterminate ? null : normalized)}
 </div>
 ${isComplete ? html`` : html``}
 `;
 }
}
