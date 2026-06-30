/// <mls fileReference="_102040_/l2/molecules/groupexpandcontent/ml-readmore-expand.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML READMORE EXPAND MOLECULE
// =============================================================================
// Skill Group: groupExpandContent
// This molecule does NOT contain business logic.
import { html, svg, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
loading: 'Loading...',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
pt: {
loading: 'Carregando...',
},
};
/// **collab_i18n_end**

type SectionInfo = {
index: number;
title: string;
disabled: boolean;
expanded: boolean;
content: string;
};

@customElement('groupexpandcontent--ml-readmore-expand')
export class MlReadmoreExpandMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
private uid = `exp-${Math.random().toString(36).slice(2)}`;

// ===========================================================================
// SLOT TAGS
// ==========================================================================='
slotTags = ['Label', 'Section'];

// ===========================================================================
// PROPERTIES — From Contract
// ==========================================================================='
@propertyDataSource({ type: Boolean })
multiple = true;

@propertyDataSource({ type: Boolean })
disabled = false;

@propertyDataSource({ type: Boolean })
loading = false;

// ===========================================================================
// INTERNAL STATE
// ==========================================================================='
@state()
private openSections: Set<number> = new Set();

// ===========================================================================
// LIFECYCLE
// ===========================================================================
firstUpdated() {
const initialOpen = new Set<number>();
this.getSlots('Section').forEach((el, index) => {
if (el.hasAttribute('expanded')) {
initialOpen.add(index);
}
});
this.openSections = initialOpen;
this.requestUpdate();
}

// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleToggle(index: number, title: string, sectionDisabled: boolean) {
if (this.disabled || sectionDisabled) return;
const isOpen = this.openSections.has(index);
let nextOpen = new Set<number>(this.openSections);

if (isOpen) {
nextOpen.delete(index);
} else {
if (!this.multiple) {
nextOpen = new Set<number>();
}
nextOpen.add(index);
}

this.openSections = nextOpen;
this.dispatchEvent(new CustomEvent('toggle', {
bubbles: true,
composed: true,
detail: { index, title, expanded: !isOpen }
}));
}

private handleKeyDown(e: KeyboardEvent, index: number, title: string, sectionDisabled: boolean) {
if (this.disabled) return;
const key = e.key;
if (key === 'Enter' || key === ' ') {
e.preventDefault();
this.handleToggle(index, title, sectionDisabled);
return;
}
if (key === 'ArrowDown' || key === 'ArrowUp') {
e.preventDefault();
this.focusNextHeader(key === 'ArrowDown');
}
}

private focusNextHeader(forward: boolean) {
const headers = this.getHeaderElements().filter((el) => !el.disabled);
if (headers.length === 0) return;
const active = document.activeElement as HTMLButtonElement | null;
const currentIndex = headers.findIndex((el) => el === active);
const nextIndex = currentIndex === -1
? 0
: (currentIndex + (forward ? 1 : -1) + headers.length) % headers.length;
headers[nextIndex].focus();
}

// ===========================================================================
// HELPERS
// ===========================================================================
private getHeaderElements(): HTMLButtonElement[] {
return Array.from(this.querySelectorAll<HTMLButtonElement>('button[data-index]'));
}

private getSectionInfo(): SectionInfo[] {
return this.getSlots('Section').map((el, index) => ({
index,
title: el.getAttribute('title') || '',
disabled: el.hasAttribute('disabled'),
expanded: this.openSections.has(index),
content: el.innerHTML || '',
}));
}

private getTriggerClasses(expanded: boolean, sectionDisabled: boolean): string {
return [
'w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition',
'ml-readmore-toggle',
(sectionDisabled || this.disabled) ? 'ml-disabled' : '',
].filter(Boolean).join(' ');
}

private getPanelClasses(expanded: boolean): string {
return [
'grid transition-all duration-200 ml-readmore-content',
expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
].join(' ');
}

private getPanelInnerClasses(): string {
return [
'overflow-hidden px-4 pb-4 text-sm',
'ml-readmore-content',
].join(' ');
}

private renderLabel(): TemplateResult {
if (!this.hasSlot('Label')) return html``;
const content = this.getSlotContent('Label');
return html`
<div class="${cn('mb-2 text-sm ml-label', this.getSlotClass('Label'))}">
${unsafeHTML(content)}
</div>
`;
}

private renderLoading(): TemplateResult {
return html`
<div class="w-full px-4 py-3 text-sm ml-skeleton ml-text-muted">
${this.msg.loading}
</div>
`;
}

private renderChevron(expanded: boolean): TemplateResult {
const classes = [
'h-4 w-4 transition-transform ml-readmore-gradient',
expanded ? 'rotate-180' : 'rotate-0',
].join(' ');
return html`
<svg class="${classes}" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
${svg`<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" clip-rule="evenodd"></path>`}
</svg>
`;
}

private renderSection(section: SectionInfo): TemplateResult {
const expanded = section.expanded;
const sectionDisabled = section.disabled || this.disabled;
const headerId = `${this.uid}-header-${section.index}`;
const panelId = `${this.uid}-panel-${section.index}`;

return html`
<div>
<button
class="${this.getTriggerClasses(expanded, sectionDisabled)}"
type="button"
data-index="${section.index}"
?disabled=${sectionDisabled}
aria-expanded="${expanded ? 'true' : 'false'}"
aria-controls="${panelId}"
aria-disabled="${sectionDisabled ? 'true' : 'false'}"
id="${headerId}"
@click=${() => this.handleToggle(section.index, section.title, sectionDisabled)}
@keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, section.index, section.title, sectionDisabled)}
>
<span class="text-sm ml-label">${section.title}</span>
${this.renderChevron(expanded)}
</button>
<div
id="${panelId}"
role="region"
aria-labelledby="${headerId}"
class="${this.getPanelClasses(expanded)}"
>
<div class="${this.getPanelInnerClasses()}">
${unsafeHTML(section.content)}
</div>
</div>
</div>
`;
}

// ===========================================================================
// RENDER
// ==========================================================================='
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];
const sections = this.getSectionInfo();

return html`
<div class="${cn('w-full', this.cssClass)}">
${this.renderLabel()}
<div class="flex flex-col gap-3">
${this.loading ? this.renderLoading() : sections.map((section) => this.renderSection(section))}
</div>
</div>
`;
}
}
