/// <mls fileReference="_102040_/l2/molecules/grouptriggeraction/ml-button-group.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML BUTTON GROUP MOLECULE
// =============================================================================
// Skill Group: groupTriggerAction
// This molecule does NOT contain business logic.
import { html, svg, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';
/// **collab_i18n_start**
const message_en = {
loading: 'Loading...',
action: 'Action',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
pt: {
loading: 'Carregando...',
action: 'Ação',
},
};
/// **collab_i18n_end**
@customElement('grouptriggeraction--ml-button-group')
export class MlButtonGroupMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
// ===========================================================================
// SLOT TAGS
// ===========================================================================
slotTags = ['Label', 'Icon'];
// ===========================================================================
// PROPERTIES — From Contract
// ===========================================================================
@propertyDataSource({ type: String })
size: string = 'md';
@propertyDataSource({ type: String })
type: string = 'button';
@propertyDataSource({ type: String, attribute: 'icon-position' })
iconPosition: string = 'start';
@propertyDataSource({ type: Boolean })
disabled: boolean = false;
@propertyDataSource({ type: Boolean })
loading: boolean = false;
// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleButtonClick(index: number) {
if (this.disabled || this.loading) return;
this.dispatchEvent(new CustomEvent('action', {
bubbles: true,
composed: true,
detail: {},
}));
}
// ===========================================================================
// RENDER HELPERS
// ===========================================================================
private getDirection(): 'horizontal' | 'vertical' {
const dirAttr = this.getAttribute('direction');
return dirAttr === 'vertical' ? 'vertical' : 'horizontal';
}
private getGroupClasses(isVertical: boolean): string {
return [
'inline-flex',
isVertical ? 'flex-col' : 'flex-row',
'items-stretch',
].join(' ');
}
private getSizeClasses(): string {
switch (this.size) {
case 'xs':
return 'text-xs px-2 py-1';
case 'sm':
return 'text-sm px-3 py-1.5';
case 'lg':
return 'text-base px-5 py-2.5';
case 'md':
default:
return 'text-sm px-4 py-2';
}
}
private getVariantClasses(variant: string): string {
const baseMap: Record<string, string> = {
primary: 'ml-button-primary',
ghost: 'ml-button-ghost',
secondary: 'ml-button-secondary',
};
return baseMap[variant] || baseMap.secondary;
}
private getButtonClasses(index: number, total: number, variant: string, isVertical: boolean): string {
const isFirst = index === 0;
const isLast = index === total - 1;
const rounding = isVertical
? [isFirst ? 'rounded-t-lg' : '', isLast ? 'rounded-b-lg' : '']
: [isFirst ? 'rounded-l-lg' : '', isLast ? 'rounded-r-lg' : ''];
const overlap = isVertical ? (isFirst ? '' : '-mt-px') : (isFirst ? '' : '-ml-px');
return [
'relative',
'inline-flex',
'items-center',
'justify-center',
'gap-2',
'ml-button',
'focus:z-10',
this.getSizeClasses(),
this.getVariantClasses(variant),
rounding.join(' '),
overlap,
(this.disabled || this.loading) ? 'ml-disabled' : 'cursor-pointer',
].filter(Boolean).join(' ');
}
private renderSpinner(): TemplateResult {
return html`
<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
${svg`<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>`}
${svg`<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>`}
</svg>
`;
}
private renderButtonContent(labelHtml: string, iconHtml: string): TemplateResult {
if (this.loading) {
return html`${this.renderSpinner()}`;
}
const hasIcon = iconHtml.trim().length > 0;
const hasLabel = labelHtml.trim().length > 0;
if (!hasIcon && !hasLabel) {
return html``;
}
if (hasIcon && hasLabel) {
return this.iconPosition === 'end'
? html`<span class="${cn('inline-flex items-center gap-2', this.getSlotClass('Label'))}">${unsafeHTML(labelHtml)}${unsafeHTML(iconHtml)}</span>`
: html`<span class="${cn('inline-flex items-center gap-2', this.getSlotClass('Label'))}">${unsafeHTML(iconHtml)}${unsafeHTML(labelHtml)}</span>`;
}
return hasLabel
? html`${unsafeHTML(labelHtml)}`
: html`${unsafeHTML(iconHtml)}`;
}
// ===========================================================================
// RENDER
// ===========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];
const labelSlots = this.getSlots('Label');
const iconSlots = this.getSlots('Icon');
const items = labelSlots.map((labelEl, index) => {
const labelHtml = (labelEl?.innerHTML || '').trim();
if (!labelHtml) return null;
const iconEl = iconSlots[index] as Element | undefined;
const iconHtml = (iconEl?.innerHTML || '').trim();
const variant = labelEl.getAttribute('variant') || 'secondary';
const ariaLabel = (labelEl.textContent || '').trim() || this.msg.action;
return { labelHtml, iconHtml, variant, ariaLabel, index };
}).filter(Boolean) as Array<{ labelHtml: string; iconHtml: string; variant: string; ariaLabel: string; index: number }>;
const isVertical = this.getDirection() === 'vertical';
if (items.length === 0) {
return html`<div class="${cn(this.getGroupClasses(isVertical), this.cssClass)}"></div>`;
}
return html`
<div class="${cn(this.getGroupClasses(isVertical), 'ml-button-group', this.cssClass)}" role="group">
${items.map((item, idx) => html`
<button
class="${this.getButtonClasses(idx, items.length, item.variant, isVertical)}"
type="${this.type}"
?disabled=${this.disabled || this.loading}
aria-busy="${this.loading ? 'true' : 'false'}"
aria-disabled="${this.disabled || this.loading ? 'true' : 'false'}"
aria-label="${item.ariaLabel}"
@click=${() => this.handleButtonClick(item.index)}
>
${this.renderButtonContent(item.labelHtml, item.iconHtml)}
</button>
`)}
</div>
`;
}
}
