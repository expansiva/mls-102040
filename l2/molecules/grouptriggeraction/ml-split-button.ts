/// <mls fileReference="_102040_/l2/molecules/grouptriggeraction/ml-split-button.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// SPLIT BUTTON MOLECULE
// =============================================================================
// Skill Group: groupTriggerAction
// This molecule does NOT contain business logic.
import { html, svg, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { cn } from '/_102033_/l2/cn.js';
/// **collab_i18n_start**
const message_en = {
defaultLabel: 'Action',
moreOptions: 'More options',
loading: 'Loading...',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
};
/// **collab_i18n_end**
type SecondaryItem = {
value: string;
label: string;
disabled: boolean;
};
@customElement('grouptriggeraction--ml-split-button')
export class MlSplitButtonMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
// ==========================================================================
// SLOT TAGS
// ==========================================================================
slotTags = ['Label', 'Icon'];
// ==========================================================================
// PROPERTIES — From Contract
// ==========================================================================
@propertyDataSource({ type: String })
size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
@propertyDataSource({ type: String })
type: 'button' | 'submit' | 'reset' = 'button';
@propertyDataSource({ type: String, attribute: 'icon-position' })
iconPosition: 'start' | 'end' = 'start';
@propertyDataSource({ type: Boolean })
disabled = false;
@propertyDataSource({ type: Boolean })
loading = false;
// ==========================================================================
// INTERNAL STATE
// ==========================================================================
@state()
private isOpen = false;
// ==========================================================================
// EVENT HANDLERS
// ==========================================================================
private handlePrimaryClick() {
if (this.disabled || this.loading) return;
const value = this.getPrimaryValue();
this.dispatchEvent(
new CustomEvent('action', {
bubbles: true,
composed: true,
detail: { value },
})
);
}
private handleToggleMenu() {
if (this.disabled || this.loading) return;
this.isOpen = !this.isOpen;
}
private handleOptionClick(item: SecondaryItem) {
if (this.disabled || this.loading || item.disabled) return;
this.dispatchEvent(
new CustomEvent('action', {
bubbles: true,
composed: true,
detail: { value: item.value },
})
);
this.isOpen = false;
}
// ==========================================================================
// DATA HELPERS
// ==========================================================================
private getPrimaryValue(): string {
const explicit = this.getSlotAttr('Label', 'value');
if (explicit) return explicit;
const label = this.getPrimaryLabelText();
return label || this.msg.defaultLabel;
}
private getPrimaryLabelText(): string {
const content = this.getSlotContent('Label');
if (!content) return '';
const temp = document.createElement('div');
temp.innerHTML = content;
return (temp.textContent || '').trim();
}
private collectSecondaryItems(): SecondaryItem[] {
const children = Array.from(this.children);
const items: SecondaryItem[] = [];
children.forEach((el) => {
const tag = el.tagName.toLowerCase();
if (tag === 'label' || tag === 'icon') return;
const value = el.getAttribute('value');
if (!value) return;
const disabled = el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true' || el.getAttribute('unavailable') === 'true';
const label = el.innerHTML || value;
el.setAttribute('hidden', '');
items.push({ value, label, disabled });
});
return items;
}
private getAriaLabel(): string {
const label = this.getPrimaryLabelText();
return label || this.msg.defaultLabel;
}
// ==========================================================================
// CLASS HELPERS
// ==========================================================================
private getPrimaryClasses(): string {
const sizeClasses = this.getSizeClasses('primary');
return [
'inline-flex items-center justify-center gap-2',
'ml-split-trigger',
this.disabled || this.loading ? 'ml-disabled' : 'cursor-pointer',
sizeClasses,
].filter(Boolean).join(' ');
}
private getChevronClasses(): string {
const sizeClasses = this.getSizeClasses('chevron');
return [
'inline-flex items-center justify-center',
'ml-split-dropdown',
this.disabled || this.loading ? 'ml-disabled' : 'cursor-pointer',
sizeClasses,
].filter(Boolean).join(' ');
}
private getSizeClasses(region: 'primary' | 'chevron'): string {
const sizeMap: Record<string, { primary: string; chevron: string; icon: string }> = {
xs: { primary: 'px-2.5 py-1 text-xs', chevron: 'px-2 py-1 text-xs', icon: 'h-3.5 w-3.5' },
sm: { primary: 'px-3 py-1.5 text-sm', chevron: 'px-2.5 py-1.5 text-sm', icon: 'h-4 w-4' },
md: { primary: 'px-3.5 py-2 text-sm', chevron: 'px-2.5 py-2 text-sm', icon: 'h-4.5 w-4.5' },
lg: { primary: 'px-4 py-2.5 text-base', chevron: 'px-3 py-2.5 text-base', icon: 'h-5 w-5' },
};
const map = sizeMap[this.size] || sizeMap.md;
return region === 'primary' ? map.primary : map.chevron;
}
private getOptionClasses(item: SecondaryItem): string {
return [
'w-full text-left px-3 py-2 text-sm',
'ml-split-item',
item.disabled ? 'ml-disabled' : 'cursor-pointer',
].filter(Boolean).join(' ');
}
// ==========================================================================
// RENDER PARTS
// ==========================================================================
private renderIcon(): TemplateResult {
if (this.loading) {
return this.renderSpinner();
}
if (!this.hasSlot('Icon')) return html``;
return html`<span class="${cn('inline-flex items-center', this.getSlotClass('Icon'))}">${unsafeHTML(this.getSlotContent('Icon'))}</span>`;
}
private renderLabel(): TemplateResult {
const label = this.getSlotContent('Label') || this.msg.defaultLabel;
return html`<span class="${cn('inline-flex items-center', this.getSlotClass('Label'))}">${unsafeHTML(label)}</span>`;
}
private renderSpinner(): TemplateResult {
const sizeMap: Record<string, string> = {
xs: 'h-3.5 w-3.5',
sm: 'h-4 w-4',
md: 'h-4.5 w-4.5',
lg: 'h-5 w-5',
};
const sizeClass = sizeMap[this.size] || sizeMap.md;
return html`
<span class="inline-flex items-center" aria-hidden="true">
<svg class="${sizeClass} animate-spin ml-text-muted" viewBox="0 0 24 24" fill="none">
${svg`<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25"></circle>`}
${svg`<path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>`}
</svg>
</span>
`;
}
private renderChevron(): TemplateResult {
return html`
<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
${svg`<path d="M5 7l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>`}
</svg>
`;
}
private renderMenuOptions(items: SecondaryItem[]): TemplateResult {
if (!this.isOpen || items.length === 0) return html``;
return html`
<div class="absolute right-0 top-full z-10 mt-1 min-w-full p-2 ml-split-menu">
<div class="flex flex-col gap-1">
${items.map((item) => html`
<button
type="button"
class="${this.getOptionClasses(item)}"
?disabled=${this.disabled || this.loading || item.disabled}
aria-disabled=${this.disabled || this.loading || item.disabled ? 'true' : 'false'}
@click=${() => this.handleOptionClick(item)}
>
${unsafeHTML(item.label)}
</button>
`)}
</div>
</div>
`;
}
// ==========================================================================
// RENDER
// ==========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];
const items = this.collectSecondaryItems();
const hasLabel = this.hasSlot('Label') || !!this.getPrimaryLabelText();
const hasIcon = this.hasSlot('Icon') || this.loading;
const ariaLabel = !hasLabel && hasIcon ? this.getAriaLabel() : undefined;
return html`
<div class="${cn('relative inline-flex items-stretch', this.cssClass)}" role="group">
<button
type=${this.type}
class="${this.getPrimaryClasses()}"
?disabled=${this.disabled || this.loading}
aria-busy=${this.loading ? 'true' : 'false'}
aria-disabled=${this.disabled || this.loading ? 'true' : 'false'}
aria-label=${ariaLabel || this.msg.defaultLabel}
@click=${this.handlePrimaryClick}
>
${this.iconPosition === 'start' ? this.renderIcon() : html``}
${this.renderLabel()}
${this.iconPosition === 'end' ? this.renderIcon() : html``}
</button>
<button
type="button"
class="${this.getChevronClasses()}"
?disabled=${this.disabled || this.loading}
aria-busy=${this.loading ? 'true' : 'false'}
aria-disabled=${this.disabled || this.loading ? 'true' : 'false'}
aria-label=${this.msg.moreOptions}
@click=${this.handleToggleMenu}
>
${this.renderChevron()}
</button>
${this.renderMenuOptions(items)}
</div>
`;
}
}
