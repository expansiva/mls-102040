/// <mls fileReference="_102040_/l2/molecules/groupshowprogress/ml-upload-progress-indicator.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// UPLOAD PROGRESS INDICATOR MOLECULE
// =============================================================================
// Skill Group: groupShowProgress
// This molecule does NOT contain business logic.
import { html, svg } from'lit';
import { customElement } from'lit/decorators.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';

@customElement('groupshowprogress--ml-upload-progress-indicator')
export class UploadProgressIndicatorMolecule extends MoleculeAuraElement {
 // ==========================================================================
 // SLOT TAGS
 // ==========================================================================
 slotTags = [];

 // ==========================================================================
 // PROPERTIES — From Contract
 // ==========================================================================
 @propertyDataSource({ type: Number })
 value: number | null = null;

 @propertyDataSource({ type: String })
 size: string ='md';

 @propertyDataSource({ type: String })
 label: string ='';

 @propertyDataSource({ type: Boolean, attribute:'show-value' })
 showValue: boolean = false;

 // ==========================================================================
 // RENDER
 // ==========================================================================
 render() {
 const isIndeterminate = this.value === null || this.value === undefined;
 const clampedValue = isIndeterminate ? null : this.clampValue(this.value);
 const showPercent = this.showValue && clampedValue !== null;
 const sizeConfig = this.getSizeConfig(this.size);
 const ariaLabel = this.label ||'Progress';

 const containerClasses = [
'inline-flex items-center gap-2',
'ml-text-muted',
 ].join(' ');

 const svgClasses = [
 sizeConfig.sizeClass,
 isIndeterminate ?'animate-spin' :'',
 ].filter(Boolean).join(' ');

 const progressCircle = this.renderProgressCircle(clampedValue, isIndeterminate, sizeConfig.strokeWidth);

 return html`
 <div
 class="${cn(containerClasses, this.cssClass)}"
 role="progressbar"
 aria-label="${ariaLabel}"
 aria-valuemin="${isIndeterminate ?'' :'0'}"
 aria-valuemax="${isIndeterminate ?'' :'100'}"
 aria-valuenow="${isIndeterminate ?'' : String(clampedValue)}"
 >
 <svg class="${svgClasses}" viewBox="0 0 36 36" aria-hidden="true">
 ${progressCircle}
 </svg>
 ${showPercent ? html`<span class="text-sm font-medium ml-text">${this.formatPercentage(clampedValue)}</span>` : html``}
 </div>
 `;
 }

 // ==========================================================================
 // HELPERS
 // ==========================================================================
 private clampValue(value: number | null): number {
 if (value === null || value === undefined) return 0;
 return Math.min(100, Math.max(0, value));
 }

 private formatPercentage(value: number | null): string {
 if (value === null || value === undefined) return'';
 if (value === 100) return'100%';
 return `${String(Math.round(value)).padStart(2,'0')}%`;
 }

 private getSizeConfig(size: string): { sizeClass: string; strokeWidth: number } {
 switch (size) {
 case'xs':
 return { sizeClass:'w-4 h-4', strokeWidth: 3 };
 case'sm':
 return { sizeClass:'w-6 h-6', strokeWidth: 3 };
 case'lg':
 return { sizeClass:'w-16 h-16', strokeWidth: 4 };
 case'md':
 default:
 return { sizeClass:'w-10 h-10', strokeWidth: 4 };
 }
 }

 private renderProgressCircle(value: number | null, isIndeterminate: boolean, strokeWidth: number) {
 const radius = 16;
 const circumference = 2 * Math.PI * radius;

 if (isIndeterminate) {
 return svg`
 <circle
 cx="18"
 cy="18"
 r="${radius}"
 fill="none"
 stroke-width="${strokeWidth}"
 class="ml-text-muted"
 stroke="currentColor"
 ></circle>
 <circle
 cx="18"
 cy="18"
 r="${radius}"
 fill="none"
 stroke-width="${strokeWidth}"
 stroke-linecap="round"
 class="ml-primary-text"
 stroke="currentColor"
 stroke-dasharray="80 200"
 stroke-dashoffset="0"
 ></circle>
 `;
 }

 const dashOffset = circumference - (circumference * (value || 0)) / 100;

 return svg`
 <circle
 cx="18"
 cy="18"
 r="${radius}"
 fill="none"
 stroke-width="${strokeWidth}"
 class="ml-text-muted"
 stroke="currentColor"
 ></circle>
 <circle
 cx="18"
 cy="18"
 r="${radius}"
 fill="none"
 stroke-width="${strokeWidth}"
 stroke-linecap="round"
 class="ml-primary-text"
 stroke="currentColor"
 stroke-dasharray="${circumference} ${circumference}"
 stroke-dashoffset="${dashOffset}"
 ></circle>
 `;
 }
}
