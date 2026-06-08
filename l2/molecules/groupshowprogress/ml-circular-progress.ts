/// <mls fileReference="_102040_/l2/molecules/groupshowprogress/ml-circular-progress.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// CIRCULAR PROGRESS MOLECULE
// =============================================================================
// Skill Group: groupShowProgress
// This molecule does NOT contain business logic.
import { html, svg, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
@customElement('groupshowprogress--ml-circular-progress')
export class CircularProgressMolecule extends MoleculeAuraElement {
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
size: string = 'md';
@propertyDataSource({ type: String })
label: string = '';
@propertyDataSource({ type: Boolean, attribute: 'show-value' })
showValue: boolean = false;
// ==========================================================================
// RENDER
// ==========================================================================
render() {
const determinate = this.isDeterminate();
const clampedValue = determinate ? this.getClampedValue() : null;
const showText = determinate && this.showValue;
const ariaAttrs = this.getAriaAttributes(clampedValue);
return html`
<div
class="${this.getWrapperClasses()}"
role="progressbar"
aria-label="${this.label || 'Progress'}"
${ariaAttrs}
>
${this.renderSvg(clampedValue, determinate)}
${showText
? html`<div class="${this.getValueTextClasses()}">${Math.round(clampedValue || 0)}%</div>`
: html``}
</div>
`;
}
// ==========================================================================
// SVG RENDERING
// ==========================================================================
private renderSvg(value: number | null, determinate: boolean): TemplateResult {
const radius = 45;
const circumference = 2 * Math.PI * radius;
const dashOffset = determinate && value !== null
? circumference * (1 - value / 100)
: circumference * 0.25;
const progressClasses = [
'stroke-sky-500 dark:stroke-sky-400',
value === 100 ? '' : '',
].filter(Boolean).join(' ');
return html`
<svg
viewBox="0 0 100 100"
class="${this.getSvgClasses()}"
aria-hidden="true"
>
${svg`
<circle
cx="50"
cy="50"
r="45"
fill="none"
stroke-width="10"
class="stroke-slate-200 dark:stroke-slate-700"
></circle>
<circle
cx="50"
cy="50"
r="45"
fill="none"
stroke-width="10"
stroke-linecap="round"
stroke-dasharray="${circumference}"
stroke-dashoffset="${dashOffset}"
class="${progressClasses}"
transform="${determinate ? 'rotate(-90 50 50)' : ''}"
>
${!determinate
? svg`<!-- Use SVG animation to avoid lateral movement in indeterminate mode -->
<animateTransform
attributeName="transform"
attributeType="XML"
type="rotate"
from="0 50 50"
to="360 50 50"
dur="1s"
repeatCount="indefinite"
></animateTransform>`
: svg``}
</circle>
`}
</svg>
`;
}
// ==========================================================================
// HELPERS
// ==========================================================================
private isDeterminate(): boolean {
return this.value !== null && !Number.isNaN(this.value);
}
private getClampedValue(): number {
const raw = this.value ?? 0;
return Math.min(100, Math.max(0, raw));
}
private getAriaAttributes(value: number | null) {
if (!this.isDeterminate() || value === null) {
return html``;
}
return html`aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100"`;
}
private getWrapperClasses(): string {
return [
'relative inline-flex items-center justify-center',
this.getSizeClasses(),
].join(' ');
}
private getSvgClasses(): string {
return [
'w-full h-full',
].join(' ');
}
private getValueTextClasses(): string {
return [
'absolute text-xs font-medium',
'text-slate-700 dark:text-slate-300',
'pointer-events-none',
].join(' ');
}
private getSizeClasses(): string {
const size = this.getResolvedSize();
const map: Record<string, string> = {
xs: 'w-4 h-4',
sm: 'w-6 h-6',
md: 'w-10 h-10',
lg: 'w-16 h-16',
};
return map[size] || map.md;
}
private getResolvedSize(): string {
const sizes = ['xs', 'sm', 'md', 'lg'];
return sizes.includes(this.size) ? this.size : 'md';
}
}
