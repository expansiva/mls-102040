/// <mls fileReference="_102040_/l2/molecules/groupexpandcontent/ml-reveal-overlay.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// REVEAL OVERLAY MOLECULE
// =============================================================================
// Skill Group: groupExpandContent
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
/// **collab_i18n_start**
const message_en = {
reveal: 'Reveal',
hide: 'Hide',
loading: 'Loading...',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
};
/// **collab_i18n_end**
@customElement('groupexpandcontent--ml-reveal-overlay')
export class RevealOverlayMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
// ===========================================================================
// SLOT TAGS
// ===========================================================================
slotTags = ['Label', 'Section'];
// ===========================================================================
// PROPERTIES — From Contract
// ===========================================================================
@propertyDataSource({ type: Boolean })
multiple = true;
@propertyDataSource({ type: Boolean })
disabled = false;
@propertyDataSource({ type: Boolean })
loading = false;
// ===========================================================================
// INTERNAL STATE
// ===========================================================================
@state()
private openSections: Set<number> = new Set<number>();
// ===========================================================================
// LIFECYCLE
// ===========================================================================
firstUpdated() {
const initial = new Set<number>();
this.getSlots('Section').forEach((el, index) => {
if (el.hasAttribute('expanded')) {
initial.add(index);
}
});
this.openSections = initial;
}
// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleToggle(index: number, title: string, sectionDisabled: boolean) {
if (this.disabled || sectionDisabled) return;
const next = new Set<number>(this.openSections);
const isOpen = next.has(index);
if (isOpen) {
next.delete(index);
} else {
if (!this.multiple) {
next.clear();
}
next.add(index);
}
this.openSections = next;
this.dispatchEvent(new CustomEvent('toggle', {
bubbles: true,
composed: true,
detail: { index, title, expanded: !isOpen }
}));
}
private handleHeaderKeydown(e: KeyboardEvent, index: number, title: string, sectionDisabled: boolean) {
if (e.key === 'Enter' || e.key === ' ') {
e.preventDefault();
this.handleToggle(index, title, sectionDisabled);
return;
}
if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
e.preventDefault();
const headers = Array.from(this.querySelectorAll('[data-header="true"]')) as HTMLElement[];
const current = headers.findIndex((el) => Number(el.getAttribute('data-index')) === index);
if (current === -1) return;
const nextIndex = e.key === 'ArrowDown'
? Math.min(headers.length - 1, current + 1)
: Math.max(0, current - 1);
headers[nextIndex]?.focus();
}
}
// ===========================================================================
// RENDER HELPERS
// ===========================================================================
private renderLoading(): TemplateResult {
return html`
<div class="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-sm text-slate-500 dark:text-slate-400">
${this.msg.loading}
</div>
`;
}
private getHeaderClasses(sectionDisabled: boolean): string {
return [
'w-full flex items-center justify-between rounded-md px-4 py-3 text-sm font-medium border transition',
'bg-white dark:bg-slate-800',
'border-slate-200 dark:border-slate-700',
'text-slate-900 dark:text-slate-100',
'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
(this.disabled || sectionDisabled) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
].filter(Boolean).join(' ');
}
private getContainerClasses(sectionDisabled: boolean): string {
return [
'relative mt-2 rounded-lg border border-slate-200 dark:border-slate-700',
'bg-slate-50 dark:bg-slate-900',
(this.disabled || sectionDisabled) ? 'opacity-50' : '',
].filter(Boolean).join(' ');
}
private getOverlayClasses(expanded: boolean, sectionDisabled: boolean): string {
return [
'absolute inset-0 flex items-center justify-center rounded-lg transition',
'bg-white/90 dark:bg-slate-800/90',
'backdrop-blur-sm',
expanded ? 'opacity-0 pointer-events-none' : 'opacity-100',
(this.disabled || sectionDisabled) ? 'opacity-50 pointer-events-none' : '',
].filter(Boolean).join(' ');
}
private getActionButtonClasses(sectionDisabled: boolean): string {
return [
'rounded-md px-4 py-2 text-sm font-medium border transition',
'bg-white dark:bg-slate-800',
'border-slate-200 dark:border-slate-700',
'text-slate-900 dark:text-slate-100',
'hover:bg-slate-50 dark:hover:bg-slate-700',
'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
(this.disabled || sectionDisabled) ? 'opacity-50 cursor-not-allowed' : '',
].filter(Boolean).join(' ');
}
private renderSectionContent(content: string): TemplateResult {
return html`
<div class="relative p-4 text-sm text-slate-900 dark:text-slate-100">
${unsafeHTML(content)}
</div>
`;
}
// ===========================================================================
// RENDER
// ===========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];
if (this.loading) {
return this.renderLoading();
}
const warning = this.hasSlot('Label') ? this.getSlotContent('Label') : '';
const sections = this.getSlots('Section').map((el, index) => ({
index,
title: el.getAttribute('title') || '',
content: el.innerHTML || '',
sectionDisabled: el.hasAttribute('disabled'),
expanded: this.openSections.has(index),
}));
return html`
<div class="space-y-4">
${sections.map((section) => {
const headerId = `reveal-header-${section.index}`;
const regionId = `reveal-region-${section.index}`;
const actionLabel = section.expanded
? `${this.msg.hide} ${section.title}`
: `${this.msg.reveal} ${section.title}`;
return html`
<div>
<button
id=${headerId}
class=${this.getHeaderClasses(section.sectionDisabled)}
role="button"
aria-expanded=${section.expanded ? 'true' : 'false'}
aria-controls=${regionId}
aria-disabled=${(this.disabled || section.sectionDisabled) ? 'true' : 'false'}
data-header="true"
data-index=${section.index}
tabindex=${(this.disabled || section.sectionDisabled) ? '-1' : '0'}
@click=${() => this.handleToggle(section.index, section.title, section.sectionDisabled)}
@keydown=${(e: KeyboardEvent) => this.handleHeaderKeydown(e, section.index, section.title, section.sectionDisabled)}
>
<span>${section.title}</span>
<span class="text-slate-600 dark:text-slate-400">${actionLabel}</span>
</button>
${warning
? html`<div class="mt-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-600 dark:text-slate-400">${unsafeHTML(warning)}</div>`
: html``}
<div
id=${regionId}
class=${this.getContainerClasses(section.sectionDisabled)}
role="region"
aria-labelledby=${headerId}
>
${this.renderSectionContent(section.content)}
<div class=${this.getOverlayClasses(section.expanded, section.sectionDisabled)}>
<button
class=${this.getActionButtonClasses(section.sectionDisabled)}
@click=${() => this.handleToggle(section.index, section.title, section.sectionDisabled)}
?disabled=${this.disabled || section.sectionDisabled}
>
${actionLabel}
</button>
</div>
</div>
</div>
`;
})}
</div>
`;
}
}
