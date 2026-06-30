/// <mls fileReference="_102040_/l2/molecules/groupviewcard/ml-vertical-card.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML VERTICAL CARD MOLECULE
// =============================================================================
// Skill Group: groupViewCard
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

@customElement('groupviewcard--ml-vertical-card')
export class MlVerticalCardMolecule extends MoleculeAuraElement {
// ===========================================================================
// SLOT TAGS
// ==========================================================================
slotTags = ['CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter', 'CardAction'];
// ===========================================================================
// PROPERTIES — From Contract
// ==========================================================================
@propertyDataSource({ type: Boolean })
clickable = false;

@propertyDataSource({ type: Boolean })
selected = false;

@propertyDataSource({ type: Boolean })
disabled = false;

@propertyDataSource({ type: Boolean })
loading = false;

@propertyDataSource({ type: Boolean, attribute: 'is-editing' })
isEditing = false;
// ===========================================================================
// LIFECYCLE
// ==========================================================================
updated(changed: Map<string, unknown>) {
if (changed.has('isEditing')) {
this.applyEditingAttribute();
}
}
// ===========================================================================
// EVENT HANDLERS
// ==========================================================================
private handleCardClick() {
if (!this.isInteractive()) return;
this.dispatchEvent(new CustomEvent('cardClick', {
bubbles: true,
composed: true,
detail: {}
}));
}

private handleKeyDown(e: KeyboardEvent) {
if (!this.isInteractive()) return;
if (e.key === 'Enter' || e.key === ' ') {
e.preventDefault();
this.handleCardClick();
}
}
// ===========================================================================
// INTERNAL HELPERS
// ==========================================================================
private isInteractive(): boolean {
return this.clickable && !this.disabled && !this.loading;
}

private applyEditingAttribute() {
const elements = Array.from(this.querySelectorAll('*'));
elements.forEach((el) => {
const tag = el.tagName.toLowerCase();
if (!tag.includes('-')) return;
if (this.isEditing) {
el.setAttribute('is-editing', '');
} else {
el.removeAttribute('is-editing');
}
});
}

private getRootClasses(): string {
const interactive = this.isInteractive();
return cn(
'w-full rounded-xl border transition p-4 flex flex-col gap-4',
'ml-card',
this.selected ? 'ml-card-header' : '',
interactive ? 'cursor-pointer ml-card-hover' : '',
this.disabled ? 'ml-disabled' : '',
this.cssClass,
);
}

private renderHeader(): TemplateResult {
const hasHeader = this.hasSlot('CardHeader');
const hasTitle = this.hasSlot('CardTitle');
const hasDescription = this.hasSlot('CardDescription');

if (!hasHeader && !hasTitle && !hasDescription) {
return html``;
}

if (hasHeader) {
return html`
<div class="flex flex-col gap-1">
${unsafeHTML(this.getSlotContent('CardHeader'))}
</div>
`;
}

return html`
<div class="flex flex-col gap-1">
${hasTitle
? html`<div class="${cn('text-base font-semibold ml-label', this.getSlotClass('CardTitle'))}">${unsafeHTML(this.getSlotContent('CardTitle'))}</div>`
: html``}
${hasDescription
? html`<div class="${cn('text-sm ml-text-muted', this.getSlotClass('CardDescription'))}">${unsafeHTML(this.getSlotContent('CardDescription'))}</div>`
: html``}
</div>
`;
}

private renderContent(): TemplateResult {
if (!this.hasSlot('CardContent')) return html``;
return html`
<div class="${cn('text-sm ml-text', this.getSlotClass('CardContent'))}">
${unsafeHTML(this.getSlotContent('CardContent'))}
</div>
`;
}

private renderFooter(): TemplateResult {
if (!this.hasSlot('CardFooter')) return html``;
return html`
<div class="${cn('text-xs ml-text-muted', this.getSlotClass('CardFooter'))}">
${unsafeHTML(this.getSlotContent('CardFooter'))}
</div>
`;
}

private renderAction(): TemplateResult {
if (!this.hasSlot('CardAction')) return html``;
return html`
<div class="${cn('pt-3 border-t ml-card-divider', this.getSlotClass('CardAction'))}">
${unsafeHTML(this.getSlotContent('CardAction'))}
</div>
`;
}

private renderLoading(): TemplateResult {
return html`
<div class="flex flex-col gap-4 animate-pulse">
<div class="h-4 w-2/3 rounded ml-skeleton"></div>
<div class="h-3 w-1/2 rounded ml-skeleton"></div>
<div class="h-20 w-full rounded ml-skeleton"></div>
<div class="h-3 w-1/3 rounded ml-skeleton"></div>
<div class="h-9 w-28 rounded ml-skeleton"></div>
</div>
`;
}
// ===========================================================================
// RENDER
// ==========================================================================
render() {
const interactive = this.isInteractive();
return html`
<div
class=${this.getRootClasses()}
role=${ifDefined(interactive ? 'button' : undefined)}
tabindex=${ifDefined(interactive ? '0' : undefined)}
aria-disabled=${ifDefined(this.disabled ? 'true' : undefined)}
aria-selected=${ifDefined(this.selected ? 'true' : undefined)}
@click=${this.handleCardClick}
@keydown=${this.handleKeyDown}
>
${this.loading
? this.renderLoading()
: html`
${this.renderHeader()}
${this.renderContent()}
${this.renderFooter()}
${this.renderAction()}
`}
</div>
`;
}
}
