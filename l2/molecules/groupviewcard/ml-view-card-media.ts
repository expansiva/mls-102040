/// <mls fileReference="_102040_/l2/molecules/groupviewcard/ml-view-card-media.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML VIEW CARD MEDIA MOLECULE
// =============================================================================
// Skill Group: groupViewCard
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

@customElement('groupviewcard--ml-view-card-media')
export class MlViewCardMediaMolecule extends MoleculeAuraElement {
// ===========================================================================
// SLOT TAGS
// ===========================================================================
slotTags = ['CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter', 'CardAction'];
// ===========================================================================
// PROPERTIES — From Contract
// ===========================================================================
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
// INTERNAL STATE
// ===========================================================================
@state()
private mediaFailed = false;

private handledMediaElements = new WeakSet<Element>();
// ===========================================================================
// LIFECYCLE
// ===========================================================================
updated(changedProps: Map<string, unknown>) {
if (changedProps.has('isEditing')) {
this.applyEditingState();
}
this.attachMediaListeners();
}
// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleCardClick() {
if (!this.isInteractive()) return;
this.dispatchEvent(new CustomEvent('cardClick', {
bubbles: true,
composed: true,
detail: {}
}));
}

private handleKeyDown(event: KeyboardEvent) {
if (!this.isInteractive()) return;
if (event.key === 'Enter' || event.key === ' ') {
event.preventDefault();
this.handleCardClick();
}
}

private handleMediaError = () => {
this.mediaFailed = true;
this.requestUpdate();
};

private handleMediaLoad = () => {
this.mediaFailed = false;
this.requestUpdate();
};
// ===========================================================================
// RENDER
// ===========================================================================
render() {
if (this.loading) {
return this.renderSkeleton();
}

const cardClasses = this.getCardClasses();
const interactive = this.isInteractive();

return html`
<div
class="${cardClasses}"
role=${ifDefined(interactive ? 'button' : undefined)}
tabindex=${ifDefined(interactive ? '0' : undefined)}
aria-disabled=${ifDefined(this.disabled ? 'true' : undefined)}
aria-selected=${ifDefined(this.selected ? 'true' : undefined)}
@click=${this.handleCardClick}
@keydown=${this.handleKeyDown}
>
${this.renderMediaSection()}
${this.renderBodySection()}
</div>
`;
}
// ===========================================================================
// RENDER SECTIONS
// ===========================================================================
private renderMediaSection(): TemplateResult {
const ratioClass = this.getMediaRatioClass();
const mediaContent = this.getSlotContent('CardHeader').trim();
const hasMedia = mediaContent.length > 0;
const showPlaceholder = !hasMedia || this.mediaFailed;

const placeholderClasses = cn(
'absolute inset-0',
'ml-card-media',
);

const mediaContentClasses = [
'absolute inset-0 w-full h-full',
'[&_img]:w-full [&_img]:h-full [&_img]:object-cover',
'[&_video]:w-full [&_video]:h-full [&_video]:object-cover',
].join(' ');

return html`
<div class="w-full ${ratioClass} relative overflow-hidden">
<div class="${placeholderClasses} ${showPlaceholder ? '' : 'hidden'}" aria-hidden="true"></div>
${showPlaceholder
? html``
: html`<div data-media-slot class="${mediaContentClasses}">${unsafeHTML(mediaContent)}</div>`}
</div>
`;
}

private renderBodySection(): TemplateResult {
const hasHeader = this.hasSlotContent('CardTitle') || this.hasSlotContent('CardDescription');
const hasContent = this.hasSlotContent('CardContent');
const hasFooter = this.hasSlotContent('CardFooter') || this.hasSlotContent('CardAction');

if (!hasHeader && !hasContent && !hasFooter) {
return html``;
}

return html`
<div class="p-4 space-y-4">
${this.renderHeaderText()}
${this.renderContentSection()}
${this.renderFooterSection()}
</div>
`;
}

private renderHeaderText(): TemplateResult {
const title = this.getSlotContent('CardTitle').trim();
const description = this.getSlotContent('CardDescription').trim();
if (!title && !description) return html``;

return html`
<div class="space-y-1">
${title
? html`<div class="${cn('text-base font-semibold ml-label', this.getSlotClass('CardTitle'))}">${unsafeHTML(title)}</div>`
: html``}
${description
? html`<div class="${cn('text-sm ml-text-muted', this.getSlotClass('CardDescription'))}">${unsafeHTML(description)}</div>`
: html``}
</div>
`;
}

private renderContentSection(): TemplateResult {
const content = this.getSlotContent('CardContent').trim();
if (!content) return html``;
return html`
<div class="${cn('text-sm ml-text-muted', this.getSlotClass('CardContent'))}">${unsafeHTML(content)}</div>
`;
}

private renderFooterSection(): TemplateResult {
const footer = this.getSlotContent('CardFooter').trim();
const action = this.getSlotContent('CardAction').trim();
if (!footer && !action) return html``;

const containerClasses = [
'flex flex-wrap items-center gap-3',
footer ? 'justify-between' : 'justify-end',
].join(' ');

return html`
<div class="${containerClasses}">
${footer ? html`<div class="${cn('text-sm ml-text-muted', this.getSlotClass('CardFooter'))}">${unsafeHTML(footer)}</div>` : html``}
${action ? html`<div class="shrink-0">${unsafeHTML(action)}</div>` : html``}
</div>
`;
}

private renderSkeleton(): TemplateResult {
const ratioClass = this.getMediaRatioClass();
const skeletonClasses = cn(
'animate-pulse',
'w-full rounded-xl border overflow-hidden',
'ml-card',
);

const blockClasses = 'ml-skeleton rounded';

return html`
<div class="${skeletonClasses}" aria-hidden="true">
<div class="w-full ${ratioClass} ${blockClasses}"></div>
<div class="p-4 space-y-3">
<div class="h-4 w-3/4 ${blockClasses}"></div>
<div class="h-3 w-2/3 ${blockClasses}"></div>
<div class="h-20 w-full ${blockClasses}"></div>
</div>
</div>
`;
}
// ===========================================================================
// HELPERS
// ===========================================================================
private getMediaRatioClass(): string {
const ratio = (this.getSlotAttr('CardHeader', 'ratio') || '16:9').trim();
if (ratio === '4:3') return 'aspect-[4/3]';
if (ratio === '1:1') return 'aspect-square';
return 'aspect-[16/9]';
}

private hasSlotContent(tag: string): boolean {
const content = this.getSlotContent(tag).trim();
return content.length > 0;
}

private isInteractive(): boolean {
return this.clickable && !this.disabled && !this.loading;
}

private getCardClasses(): string {
const isSelected = this.selected && !this.disabled && !this.loading;
return cn(
'w-full rounded-xl border overflow-hidden transition',
'ml-card',
isSelected ? 'ml-card-header' : '',
this.isInteractive()
? 'cursor-pointer focus:outline-none focus:ring-2'
: '',
this.disabled ? 'ml-disabled' : '',
this.cssClass,
);
}

private attachMediaListeners() {
const container = this.querySelector('[data-media-slot]');
if (!container) return;

const mediaElements = container.querySelectorAll('img, video');
mediaElements.forEach((el) => {
if (this.handledMediaElements.has(el)) return;
this.handledMediaElements.add(el);
el.addEventListener('error', this.handleMediaError);
el.addEventListener('load', this.handleMediaLoad);
});
}

private applyEditingState() {
const elements = Array.from(this.querySelectorAll('*'));
for (const el of elements) {
if (el === this) continue;
if (!el.tagName.includes('-')) continue;
if (this.isEditing) {
el.setAttribute('is-editing', '');
} else {
el.removeAttribute('is-editing');
}
}
}
}
