/// <mls fileReference="_102040_/l2/molecules/groupviewcard/ml-profile-card.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML PROFILE CARD MOLECULE
// =============================================================================
// Skill Group: groupViewCard
// This molecule does NOT contain business logic.
import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

@customElement('groupviewcard--ml-profile-card')
export class MlProfileCardMolecule extends MoleculeAuraElement {
// ==========================================================================
// SLOT TAGS
// ==========================================================================
slotTags = ['CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter', 'CardAction'];
// ==========================================================================
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
// ==========================================================================
// LIFECYCLE
// ==========================================================================
firstUpdated() {
this.syncEditingAttribute();
}

updated(changedProperties: Map<string, unknown>) {
if (changedProperties.has('isEditing')) {
this.syncEditingAttribute();
}
}
// ==========================================================================
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

private handleCardKeydown(event: KeyboardEvent) {
if (!this.isInteractive()) return;
if (event.key === 'Enter' || event.key === ' ') {
event.preventDefault();
this.handleCardClick();
}
}
// ==========================================================================
// HELPERS
// ==========================================================================
private isInteractive(): boolean {
return this.clickable && !this.disabled && !this.loading;
}

private getCardClasses(): string {
const base = 'w-full rounded-xl border p-4 transition-colors';
const surface = this.selected
? 'border-sky-500 dark:border-sky-400 bg-sky-50 dark:bg-sky-900/40'
: 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800';
const interactive = this.isInteractive()
? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400'
: '';
const disabled = (this.disabled || this.loading)
? 'opacity-50 cursor-not-allowed'
: '';
return [base, surface, interactive, disabled].filter(Boolean).join(' ');
}

private syncEditingAttribute() {
const elements = Array.from(this.querySelectorAll('*'));
for (const el of elements) {
if (!el.tagName.includes('-')) continue;
if (this.isEditing) {
el.setAttribute('is-editing', '');
} else {
el.removeAttribute('is-editing');
}
}
}

private renderHeader() {
const hasHeader = this.hasSlot('CardHeader');
const hasTitle = this.hasSlot('CardTitle');
const hasDescription = this.hasSlot('CardDescription');
if (!hasHeader && !hasTitle && !hasDescription) return nothing;

if (hasHeader) {
return html`
<div class="card-header text-slate-900 dark:text-slate-100">
${unsafeHTML(this.getSlotContent('CardHeader'))}
</div>
`;
}

return html`
<div class="card-header">
${hasTitle ? html`
<div class="text-lg font-semibold text-slate-900 dark:text-slate-100">
${unsafeHTML(this.getSlotContent('CardTitle'))}
</div>
` : nothing}
${hasDescription ? html`
<div class="mt-1 text-sm text-slate-600 dark:text-slate-400">
${unsafeHTML(this.getSlotContent('CardDescription'))}
</div>
` : nothing}
</div>
`;
}

private renderContent() {
if (!this.hasSlot('CardContent')) return nothing;
return html`
<div class="card-content text-slate-900 dark:text-slate-100">
${unsafeHTML(this.getSlotContent('CardContent'))}
</div>
`;
}

private renderFooter() {
if (!this.hasSlot('CardFooter')) return nothing;
return html`
<div class="card-footer text-slate-600 dark:text-slate-400">
${unsafeHTML(this.getSlotContent('CardFooter'))}
</div>
`;
}

private renderAction() {
if (!this.hasSlot('CardAction')) return nothing;
return html`
<div class="card-action flex flex-wrap items-center gap-2">
${unsafeHTML(this.getSlotContent('CardAction'))}
</div>
`;
}

private renderLoadingSkeleton() {
return html`
<div class="animate-pulse space-y-4">
<div class="space-y-2">
<div class="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700"></div>
<div class="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700"></div>
</div>
<div class="h-16 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
<div class="flex gap-2">
<div class="h-8 w-24 rounded bg-slate-200 dark:bg-slate-700"></div>
<div class="h-8 w-20 rounded bg-slate-200 dark:bg-slate-700"></div>
</div>
</div>
`;
}
// ==========================================================================
// RENDER
// ==========================================================================
render() {
const roleAttr = this.isInteractive() ? 'button' : nothing;
const tabIndexAttr = this.isInteractive() ? 0 : nothing;
const ariaDisabled = (this.disabled || this.loading) ? 'true' : nothing;
const ariaSelected = this.selected ? 'true' : nothing;

return html`
<div
class="${this.getCardClasses()}"
role=${roleAttr}
tabindex=${tabIndexAttr}
aria-disabled=${ariaDisabled}
aria-selected=${ariaSelected}
@click=${this.handleCardClick}
@keydown=${this.handleCardKeydown}
>
${this.loading
? this.renderLoadingSkeleton()
: html`
<div class="space-y-4">
${this.renderHeader()}
${this.renderContent()}
${this.renderFooter()}
${this.renderAction()}
</div>
`}
</div>
`;
}
}
