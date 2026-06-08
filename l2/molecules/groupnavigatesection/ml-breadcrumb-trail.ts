/// <mls fileReference="_102040_/l2/molecules/groupnavigatesection/ml-breadcrumb-trail.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// BREADCRUMB TRAIL MOLECULE
// =============================================================================
// Skill Group: groupNavigateSection
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
loading: 'Loading...',
overflow: 'More levels',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
};
/// **collab_i18n_end**

type ParsedTab = {
value: string;
title: string;
icon: string;
disabled: boolean;
content: string;
index: number;
isLast: boolean;
};

@customElement('groupnavigatesection--ml-breadcrumb-trail')
export class BreadcrumbTrailMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
// ===========================================================================
// SLOT TAGS
// =========================================================================
slotTags = ['Label', 'Tab'];
// ===========================================================================
// PROPERTIES — From Contract
// =========================================================================
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
// =========================================================================
@state()
private isOverflowOpen = false;

// ===========================================================================
// LIFECYCLE
// =========================================================================
firstUpdated() {
this.addEventListener('keydown', this.handleKeyDown as EventListener);
}

// ===========================================================================
// HELPERS
// =========================================================================
private getTabs(): ParsedTab[] {
const elements = this.getSlots('Tab');
return elements.map((el, index) => ({
value: el.getAttribute('value') || '',
title: el.getAttribute('title') || '',
icon: el.getAttribute('icon') || '',
disabled: el.hasAttribute('disabled'),
content: el.innerHTML || '',
index,
isLast: index === elements.length - 1,
}));
}

private getActiveValue(tabs: ParsedTab[]): string | null {
if (this.value && tabs.find(tab => tab.value === this.value)) {
return this.value;
}
const firstActive = tabs.find(tab => !tab.disabled);
return firstActive ? firstActive.value : (tabs[0]?.value || null);
}

private getTabClasses(isActive: boolean, disabled: boolean, interactive: boolean): string {
return [
'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-sm transition whitespace-nowrap',
'text-slate-600 dark:text-slate-400',
interactive ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700' : 'cursor-default',
isActive ? 'text-slate-900 dark:text-slate-100 font-medium' : '',
disabled ? 'opacity-50 cursor-not-allowed' : '',
'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
].filter(Boolean).join(' ');
}

private getDelimiterClasses(): string {
return [
'mx-1 text-slate-400 dark:text-slate-500 select-none',
].join(' ');
}

private getOverflowButtonClasses(): string {
return [
'inline-flex items-center rounded-md px-1.5 py-0.5 text-sm transition whitespace-nowrap',
'text-slate-600 dark:text-slate-400',
'hover:bg-slate-50 dark:hover:bg-slate-700',
'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
this.disabled || this.loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
].filter(Boolean).join(' ');
}

private getPanelClasses(): string {
return [
'pt-2 text-sm',
'text-slate-900 dark:text-slate-100',
].join(' ');
}

private getLabelClasses(): string {
return [
'block text-xs font-medium mb-1',
'text-slate-600 dark:text-slate-400',
].join(' ');
}

private getErrorClasses(): string {
return [
'pt-1 text-xs',
'text-red-600 dark:text-red-400',
].join(' ');
}

private renderTab(tab: ParsedTab, activeValue: string | null): TemplateResult {
const isActive = tab.value === activeValue;
const interactive = !tab.isLast && !tab.disabled && !this.disabled && !this.loading;
if (tab.isLast) {
return html`
<span class="${this.getTabClasses(isActive, tab.disabled, false)}" role="tab" aria-selected="${isActive}" aria-disabled="true">
${tab.icon ? html`<span class="text-base">${tab.icon}</span>` : ''}
<span>${tab.title}</span>
</span>
`;
}
return html`
<button
class="${this.getTabClasses(isActive, tab.disabled || this.disabled || this.loading, interactive)}"
role="tab"
aria-selected="${isActive}"
aria-disabled="${tab.disabled || this.disabled || this.loading}"
?disabled=${tab.disabled || this.disabled || this.loading}
data-tab-button="true"
@ক্তclick=${() => this.handleTabClick(tab)}
>
${tab.icon ? html`<span class="text-base">${tab.icon}</span>` : ''}
<span>${tab.title}</span>
</button>
`;
}

private renderOverflowMenu(hiddenTabs: ParsedTab[], activeValue: string | null): TemplateResult {
if (!hiddenTabs.length) return html``;
return html`
<div class="relative inline-flex items-center">
<button
class="${this.getOverflowButtonClasses()}"
aria-label="${this.msg.overflow}"
?disabled=${this.disabled || this.loading}
@click=${this.handleOverflowToggle}
>
...
</button>
${this.isOverflowOpen ? html`
<div class="absolute left-0 top-full mt-1 w-48 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md z-10">
<div class="p-1">
${hiddenTabs.map(tab => html`
<button
class="${this.getTabClasses(tab.value === activeValue, tab.disabled || this.disabled || this.loading, !tab.disabled)} w-full justify-start" 
role="tab"
aria-selected="${tab.value === activeValue}"
aria-disabled="${tab.disabled || this.disabled || this.loading}"
?disabled=${tab.disabled || this.disabled || this.loading}
data-tab-button="true"
@click=${() => this.handleTabClick(tab, true)}
>
${tab.icon ? html`<span class="text-base">${tab.icon}</span>` : ''}
<span>${tab.title}</span>
</button>
`)}
</div>
</div>
` : ''}
</div>
`;
}

private renderTrail(tabs: ParsedTab[], activeValue: string | null): TemplateResult {
if (!tabs.length) return html``;
const first = tabs[0];
const last = tabs[tabs.length - 1];
const middle = tabs.slice(1, tabs.length - 1);
return html`
<div class="flex items-center whitespace-nowrap" role="tablist">
<div class="flex items-center sm:hidden">
${this.renderTab(first, activeValue)}
<span class="${this.getDelimiterClasses()}">/</span>
${this.renderOverflowMenu(middle, activeValue)}
<span class="${this.getDelimiterClasses()}">/</span>
${this.renderTab(last, activeValue)}
</div>
<div class="hidden sm:flex items-center">
${tabs.map((tab, index) => html`
${index > 0 ? html`<span class="${this.getDelimiterClasses()}">/</span>` : ''}
${this.renderTab(tab, activeValue)}
`)}
</div>
</div>
`;
}

// ===========================================================================
// EVENT HANDLERS
// =========================================================================
private handleTabClick(tab: ParsedTab, closeOverflow = false) {
if (this.loading || this.disabled) return;
if (tab.disabled || tab.isLast) return;
this.value = tab.value;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: tab.value, title: tab.title },
}));
if (closeOverflow) {
this.isOverflowOpen = false;
}
}

private handleOverflowToggle() {
if (this.loading || this.disabled) return;
this.isOverflowOpen = !this.isOverflowOpen;
}

private handleKeyDown(e: KeyboardEvent) {
if (this.loading || this.disabled) return;
const keys = ['ArrowLeft', 'ArrowRight', 'Enter', ' '];
if (!keys.includes(e.key)) return;
const buttons = Array.from(this.querySelectorAll<HTMLButtonElement>('button[data-tab-button="true"]'))
.filter(btn => !btn.disabled);
if (!buttons.length) return;
const current = document.activeElement as HTMLButtonElement | null;
const currentIndex = buttons.findIndex(btn => btn === current);
if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
e.preventDefault();
const dir = e.key === 'ArrowRight' ? 1 : -1;
const nextIndex = (currentIndex + dir + buttons.length) % buttons.length;
buttons[nextIndex].focus();
}
if (e.key === 'Enter' || e.key === ' ') {
e.preventDefault();
current?.click();
}
}

// ===========================================================================
// RENDER
// =========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];
const tabs = this.getTabs();
const activeValue = this.getActiveValue(tabs);
const activeTab = tabs.find(tab => tab.value === activeValue) || tabs[0];
const labelContent = this.hasSlot('Label') ? this.getSlotContent('Label') : '';
const activeContent = activeTab ? activeTab.content : '';
return html`
<div class="w-full">
${labelContent ? html`<span class="${this.getLabelClasses()}">${unsafeHTML(labelContent)}</span>` : ''}
<div class="relative">
${this.loading
? html`<div class="text-sm text-slate-500 dark:text-slate-400">${this.msg.loading}</div>`
: this.renderTrail(tabs, activeValue)}
</div>
<div class="${this.getPanelClasses()}" role="tabpanel">
${activeContent ? unsafeHTML(activeContent) : ''}
</div>
${this.error ? html`<div class="${this.getErrorClasses()}">${unsafeHTML(this.error)}</div>` : ''}
</div>
`;
}
}
