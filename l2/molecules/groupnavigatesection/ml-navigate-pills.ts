/// <mls fileReference="_102040_/l2/molecules/groupnavigatesection/ml-navigate-pills.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// NAVIGATE PILLS MOLECULE
// =============================================================================
// Skill Group: groupNavigateSection
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
loading: 'Loading...',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
};
/// **collab_i18n_end**

interface NavigateTab {
value: string;
title: string;
icon: string;
disabled: boolean;
content: string;
}

@customElement('groupnavigatesection--ml-navigate-pills')
export class NavigatePillsMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
private instanceId = `nav-${Math.random().toString(36).slice(2, 8)}`;

// ===========================================================================
// SLOT TAGS
// ==========================================================================='
slotTags = ['Label', 'Tab'];

// ===========================================================================
// PROPERTIES — From Contract
// ==========================================================================='
@propertyDataSource({ type: String })
value: string | null = null;

@propertyDataSource({ type: String })
error: string = '';

@propertyDataSource({ type: Boolean })
disabled = false;

@propertyDataSource({ type: Boolean })
loading = false;

// ===========================================================================
// INTERNAL STATE
// ===========================================================================
@state()
private lastActiveIndex = -1;

// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleTabClick(tab: NavigateTab) {
if (this.disabled || this.loading || tab.disabled) return;
this.value = tab.value;
this.dispatchChange(tab);
}

private handleKeyDown(e: KeyboardEvent, index: number, tabs: NavigateTab[]) {
if (this.disabled || this.loading) return;
const key = e.key;
if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Enter' && key !== ' ') return;

const enabledIndices = tabs
.map((t, i) => ({ t, i }))
.filter(({ t }) => !t.disabled)
.map(({ i }) => i);

if (enabledIndices.length === 0) return;

if (key === 'Enter' || key === ' ') {
e.preventDefault();
const tab = tabs[index];
if (tab && !tab.disabled) {
this.value = tab.value;
this.dispatchChange(tab);
}
return;
}

e.preventDefault();
const currentPos = enabledIndices.indexOf(index);
if (currentPos === -1) return;
let nextIndex = index;
if (key === 'ArrowRight') {
nextIndex = enabledIndices[(currentPos + 1) % enabledIndices.length];
} else if (key === 'ArrowLeft') {
nextIndex = enabledIndices[(currentPos - 1 + enabledIndices.length) % enabledIndices.length];
}
this.focusTabButton(nextIndex);
}

private focusTabButton(index: number) {
const button = this.querySelector<HTMLButtonElement>(`[data-tab-index="${index}"]`);
if (button) button.focus();
}

private dispatchChange(tab: NavigateTab) {
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: tab.value, title: tab.title },
}));
}

// ===========================================================================
// HELPERS
// ===========================================================================
private getTabs(): NavigateTab[] {
return this.getSlots('Tab').map(el => ({
value: el.getAttribute('value') || '',
title: el.getAttribute('title') || '',
icon: el.getAttribute('icon') || '',
disabled: el.hasAttribute('disabled'),
content: el.innerHTML || '',
})).filter(tab => tab.value && tab.title);
}

private getActiveIndex(tabs: NavigateTab[]): number {
if (tabs.length === 0) return -1;
const explicitIndex = this.value
? tabs.findIndex(t => t.value === this.value && !t.disabled)
: -1;
if (explicitIndex !== -1) return explicitIndex;
const firstAvailable = tabs.findIndex(t => !t.disabled);
return firstAvailable;
}

private getTabClasses(isActive: boolean, isDisabled: boolean): string {
return [
'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition whitespace-nowrap',
'bg-white dark:bg-slate-800',
isActive
? 'border-sky-500 dark:border-sky-400 bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300'
: 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400',
!isDisabled && !this.disabled && !this.loading
? 'hover:bg-slate-50 dark:hover:bg-slate-700'
: '',
(isDisabled || this.disabled || this.loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
].filter(Boolean).join(' ');
}

private renderLabel(): TemplateResult {
if (!this.hasSlot('Label')) return html``;
const labelContent = this.getSlotContent('Label');
return html`<div class="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">${unsafeHTML(labelContent)}</div>`;
}

private renderLoading(): TemplateResult {
return html`
<div class="space-y-2">
${this.renderLabel()}
<div class="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
${this.msg.loading}
</div>
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

const tabs = this.getTabs();
const activeIndex = this.getActiveIndex(tabs);
this.lastActiveIndex = activeIndex;
const activeTab = activeIndex >= 0 ? tabs[activeIndex] : null;

return html`
<div class="w-full">
${this.renderLabel()}
<div
class="flex gap-2 overflow-x-auto pb-1"
role="tablist"
aria-label="${this.hasSlot('Label') ? this.getSlotContent('Label') : 'Navigation'}"
>
${tabs.map((tab, index) => {
const isActive = index === activeIndex;
const isDisabled = tab.disabled;
const tabId = `${this.instanceId}-tab-${index}`;
const panelId = `${this.instanceId}-panel-${index}`;
return html`
<button
class="${this.getTabClasses(isActive, isDisabled)}"
role="tab"
aria-selected="${isActive ? 'true' : 'false'}"
aria-disabled="${isDisabled || this.disabled || this.loading ? 'true' : 'false'}"
aria-controls="${panelId}"
id="${tabId}"
data-tab-index="${index}"
?disabled=${isDisabled || this.disabled || this.loading}
@click=${() => this.handleTabClick(tab)}
@keydown=${(e: KeyboardEvent) => this.handleKeyDown(e, index, tabs)}
>
${tab.icon ? html`<span class="text-base">${unsafeHTML(tab.icon)}</span>` : html``}
<span>${unsafeHTML(tab.title)}</span>
</button>
`;
})}
</div>
${activeTab ? html`
<div
class="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-slate-900 dark:text-slate-100"
role="tabpanel"
id="${this.instanceId}-panel-${activeIndex}"
aria-labelledby="${this.instanceId}-tab-${activeIndex}"
>
${unsafeHTML(activeTab.content)}
</div>
` : html``}
${this.error ? html`<p class="mt-2 text-xs text-red-600 dark:text-red-400">${unsafeHTML(this.error)}</p>` : html``}
</div>
`;
}
}
