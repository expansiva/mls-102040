/// <mls fileReference="_102040_/l2/molecules/groupplaymedia/ml-image-gallery.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// IMAGE GALLERY MOLECULE
// =============================================================================
// Skill Group: groupPlayMedia
// This molecule does NOT contain business logic.
import { html, TemplateResult } from'lit';
import { customElement, state } from'lit/decorators.js';
import { unsafeHTML } from'lit/directives/unsafe-html.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
labelFallback:'Image gallery',
previous:'Previous image',
next:'Next image',
loading:'Loading...',
noSources:'No image sources were provided.',
openExpanded:'Open expanded view',
closeExpanded:'Close expanded view',
image:'Image',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
};
/// **collab_i18n_end**

type GallerySource = { src: string; type: string };
type GalleryTrack = { src: string; kind: string; lang: string; label: string };

@customElement('groupplaymedia--ml-image-gallery')
export class ImageGalleryMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
// ===========================================================================
// SLOT TAGS
// ===========================================================================
slotTags = ['Label','Source','Track'];
// ===========================================================================
// PROPERTIES — From Contract
// ===========================================================================
@propertyDataSource({ type: Boolean })
disabled = false;
@propertyDataSource({ type: Boolean })
loading = false;
@propertyDataSource({ type: String })
error ='';
// ===========================================================================
// INTERNAL STATE
// ===========================================================================
@state()
private activeIndex = 0;
@state()
private isExpanded = false;
@state()
private lastErrorMessage ='';
// ===========================================================================
// EVENT HELPERS
// ===========================================================================
private notifyIndexChange() {
const sources = this.getSources();
this.dispatchEvent(new CustomEvent('timeUpdate', {
bubbles: true,
composed: true,
detail: { currentTime: this.activeIndex, duration: sources.length },
}));
}
private dispatchPlayEvent() {
this.dispatchEvent(new CustomEvent('play', {
bubbles: true,
composed: true,
detail: {},
}));
}
private dispatchPauseEvent() {
this.dispatchEvent(new CustomEvent('pause', {
bubbles: true,
composed: true,
detail: {},
}));
}
private dispatchErrorEvent(message: string) {
this.dispatchEvent(new CustomEvent('error', {
bubbles: true,
composed: true,
detail: { message },
}));
}
// ===========================================================================
// DATA HELPERS
// ===========================================================================
private getSources(): GallerySource[] {
return this.getSlots('Source').map((el) => ({
src: el.getAttribute('src') ||'',
type: el.getAttribute('type') ||'',
})).filter((item) => item.src);
}
private getTracks(): GalleryTrack[] {
return this.getSlots('Track').map((el) => ({
src: el.getAttribute('src') ||'',
kind: el.getAttribute('kind') ||'subtitles',
lang: el.getAttribute('lang') ||'',
label: el.getAttribute('label') ||'',
}));
}
private getCaption(tracks: GalleryTrack[], index: number): string {
return tracks[index]?.label ||'';
}
private getAltText(tracks: GalleryTrack[], index: number): string {
const caption = this.getCaption(tracks, index);
if (caption) return caption;
return `${this.msg.image} ${index + 1}`;
}
private getLabelText(): string {
const labelContent = this.getSlotContent('Label');
return labelContent ? labelContent.replace(/<[^>]*>/g,'').trim() : this.msg.labelFallback;
}
private getComputedError(sources: GallerySource[]): string {
if (this.error && this.error.trim()) return this.error;
if (sources.length === 0) return this.msg.noSources;
return'';
}
private syncActiveIndex(sources: GallerySource[]) {
if (sources.length === 0) {
this.activeIndex = 0;
return;
}
if (this.activeIndex >= sources.length) {
this.activeIndex = sources.length - 1;
}
}
private trackError(message: string) {
if (message && message !== this.lastErrorMessage) {
this.lastErrorMessage = message;
this.dispatchErrorEvent(message);
return;
}
if (!message && this.lastErrorMessage) {
this.lastErrorMessage ='';
}
}
// ===========================================================================
// INTERACTION HANDLERS
// ===========================================================================
private handlePrev() {
if (this.disabled || this.loading || this.lastErrorMessage) return;
if (this.activeIndex > 0) {
this.activeIndex -= 1;
this.notifyIndexChange();
}
}
private handleNext() {
if (this.disabled || this.loading || this.lastErrorMessage) return;
const sources = this.getSources();
if (this.activeIndex < sources.length - 1) {
this.activeIndex += 1;
this.notifyIndexChange();
}
}
private handleThumbnailSelect(index: number) {
if (this.disabled || this.loading || this.lastErrorMessage) return;
if (index === this.activeIndex) return;
this.activeIndex = index;
this.notifyIndexChange();
}
private handleToggleExpanded() {
if (this.disabled || this.loading || this.lastErrorMessage) return;
if (this.isExpanded) {
this.isExpanded = false;
this.dispatchPauseEvent();
} else {
this.isExpanded = true;
this.dispatchPlayEvent();
}
}
private handleKeyDown(event: KeyboardEvent) {
if (this.disabled || this.loading || this.lastErrorMessage) return;
if (event.key ==='ArrowLeft') {
event.preventDefault();
this.handlePrev();
return;
}
if (event.key ==='ArrowRight') {
event.preventDefault();
this.handleNext();
return;
}
if (event.key ==='' && this.isExpanded) {
event.preventDefault();
this.isExpanded = false;
this.dispatchPauseEvent();
}
}
// ===========================================================================
// CLASS HELPERS
// ===========================================================================
private getControlButtonClasses(disabled: boolean): string {
return [
'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium border transition',
'ml-surface-bg',
'ml-border',
'ml-text',
'',
!disabled ?'hover:ml-surface-dim-bg' :'ml-disabled',
].filter(Boolean).join(' ');
}
private getThumbnailClasses(isActive: boolean, disabled: boolean): string {
return [
'h-16 w-16 shrink-0 rounded-md border overflow-hidden transition',
'ml-surface-bg',
isActive
?'ml-border-focus ml-focus-ring'
:'ml-border',
!disabled ?'hover:ml-border' :'ml-disabled',
].filter(Boolean).join(' ');
}
// ===========================================================================
// RENDER
// ===========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];

const sources = this.getSources();
const tracks = this.getTracks();
const total = sources.length;
const labelContent = this.getSlotContent('Label');
const ariaLabel = this.getLabelText();

this.syncActiveIndex(sources);
const computedError = this.getComputedError(sources);
this.trackError(computedError);

const mainSource = sources[this.activeIndex];
const caption = this.getCaption(tracks, this.activeIndex);

const rootClasses = [
'relative w-full rounded-xl border p-4 transition',
'ml-surface-bg',
'ml-border',
(this.disabled || this.loading) ?'opacity-70' :'',
].filter(Boolean).join(' ');

if (computedError) {
return html`
<div class="${cn(rootClasses, this.cssClass)}" tabindex="0" aria-label="${ariaLabel}">
${labelContent
? html`<div class="${cn('mb-3 text-sm ml-text-muted', this.getSlotClass('Label'))}">${unsafeHTML(labelContent)}</div>`
:''}
<div class="flex min-h-[220px] items-center justify-center rounded-lg border ml-border-error ml-surface-dim-bg">
<p class="text-sm ml-error-text">${computedError}</p>
</div>
</div>
`;
}

return html`
<div
class="${cn(rootClasses, this.cssClass)}"
tabindex="0"
aria-label="${ariaLabel}"
@keydown=${this.handleKeyDown}
>
${labelContent
? html`<div class="${cn('mb-3 text-sm ml-text-muted', this.getSlotClass('Label'))}">${unsafeHTML(labelContent)}</div>`
:''}
<div class="relative">
<button
class="w-full rounded-lg border ml-border ml-surface-dim-bg overflow-hidden"
?disabled=${this.disabled || this.loading}
@click=${this.handleToggleExpanded}
aria-label="${this.isExpanded ? this.msg.closeExpanded : this.msg.openExpanded}"
>
${mainSource
? html`<img
class="h-64 w-full object-cover"
src="${mainSource.src}"
alt="${this.getAltText(tracks, this.activeIndex)}"
loading="lazy"
/>`
: html`<div class="h-64"></div>`}
</button>
${caption
? html`<div class="mt-2 text-sm ml-text-muted">${caption}</div>`
:''}
${this.loading
? html`<div class="absolute inset-0 flex items-center justify-center rounded-lg ml-surface-bg/70">
<span class="text-sm ml-text-muted">${this.msg.loading}</span>
</div>`
:''}
</div>
<div class="mt-4 flex items-center justify-between gap-3">
<button
class="${this.getControlButtonClasses(this.disabled || this.loading || this.activeIndex === 0)}"
?disabled=${this.disabled || this.loading || this.activeIndex === 0}
@mousedown=${(event: MouseEvent) => event.preventDefault()}
@click=${this.handlePrev}
aria-label="${this.msg.previous}"
>
${this.msg.previous}
</button>
<div class="text-xs ml-text-muted">
${total > 0 ? `${this.activeIndex + 1} / ${total}` :'0 / 0'}
</div>
<button
class="${this.getControlButtonClasses(this.disabled || this.loading || this.activeIndex === total - 1)}"
?disabled=${this.disabled || this.loading || this.activeIndex === total - 1}
@mousedown=${(event: MouseEvent) => event.preventDefault()}
@click=${this.handleNext}
aria-label="${this.msg.next}"
>
${this.msg.next}
</button>
</div>
<div class="mt-4 flex gap-2 overflow-x-auto">
${sources.map((source, index) => html`
<button
class="${this.getThumbnailClasses(index === this.activeIndex, this.disabled || this.loading)}"
?disabled=${this.disabled || this.loading}
@click=${() => this.handleThumbnailSelect(index)}
aria-label="${this.getAltText(tracks, index)}"
>
<img
class="h-full w-full object-cover"
src="${source.src}"
alt="${this.getAltText(tracks, index)}"
loading="lazy"
/>
</button>
`)}
</div>
${this.isExpanded
? html`
<div
class="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/70"
@click=${this.handleToggleExpanded}
>
<div class="max-h-[90%] max-w-[90%]">
${mainSource
? html`<img
class="max-h-[90vh] w-auto rounded-lg border ml-border"
src="${mainSource.src}"
alt="${this.getAltText(tracks, this.activeIndex)}"
/>`
: html``}
</div>
</div>
`
:''}
</div>
`;
}
}
