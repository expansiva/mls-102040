/// <mls fileReference="_102040_/l2/molecules/groupenterboolean/ml-toggle-icon.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML TOGGLE ICON MOLECULE
// =============================================================================
// Skill Group: groupEnterBoolean
// This molecule does NOT contain business logic.
import { html, svg } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
/// **collab_i18n_start**
const message_en = {
yes: 'Yes',
no: 'No',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
};
/// **collab_i18n_end**
@customElement('groupenterboolean--ml-toggle-icon')
export class MlToggleIconMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
// ===========================================================================
// SLOT TAGS
// ===========================================================================
slotTags = ['Label', 'Helper'];
// ===========================================================================
// PROPERTIES — From Contract
// ===========================================================================
@propertyDataSource({ type: Boolean })
value = false;
@propertyDataSource({ type: String })
error = '';
@propertyDataSource({ type: String })
name = '';
@propertyDataSource({ type: Boolean, attribute: 'is-editing' })
isEditing = true;
@propertyDataSource({ type: Boolean })
disabled = false;
// Optional icon configuration (SVG path data)
@property({ type: String, attribute: 'icon-on' })
iconOn = '';
@property({ type: String, attribute: 'icon-off' })
iconOff = '';
// ===========================================================================
// INTERNAL STATE
// ===========================================================================
@state()
private hasFocus = false;
private labelId = `label-${Math.random().toString(36).slice(2, 9)}`;
private helperId = `helper-${Math.random().toString(36).slice(2, 9)}`;
private errorId = `error-${Math.random().toString(36).slice(2, 9)}`;
// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleToggle() {
if (!this.isEditing || this.disabled) return;
this.value = !this.value;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value }
}));
}
private handleKeyDown(e: KeyboardEvent) {
if (!this.isEditing || this.disabled) return;
if (e.key === ' ' || e.key === 'Spacebar' || e.code === 'Space') {
e.preventDefault();
this.handleToggle();
}
}
private handleFocus() {
if (!this.isEditing || this.disabled) return;
this.hasFocus = true;
this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
}
private handleBlur() {
if (!this.isEditing || this.disabled) return;
this.hasFocus = false;
this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
}
// ===========================================================================
// RENDER HELPERS
// ===========================================================================
private getTrackClasses(hasError: boolean): string {
return [
'relative inline-flex h-8 w-14 items-center rounded-full transition',
this.value
? 'bg-sky-500 dark:bg-sky-400'
: 'bg-slate-200 dark:bg-slate-700',
'border',
hasError
? 'border-red-500 dark:border-red-400'
: 'border-slate-200 dark:border-slate-700',
this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
].filter(Boolean).join(' ');
}
private getThumbClasses(hasError: boolean): string {
return [
'inline-flex h-6 w-6 transform items-center justify-center rounded-full transition',
'text-slate-900 dark:text-slate-100',
'bg-white dark:bg-slate-800',
this.value ? 'translate-x-7' : 'translate-x-1',
hasError ? 'ring-2 ring-red-500 dark:ring-red-400' : '',
this.hasFocus ? 'ring-2 ring-sky-500 dark:ring-sky-400' : '',
].filter(Boolean).join(' ');
}
private getButtonClasses(): string {
return [
'inline-flex items-center gap-3',
'focus:outline-none',
this.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
].filter(Boolean).join(' ');
}
private renderIcon(): unknown {
const onPath = this.iconOn || 'M5 13l4 4L19 7';
const offPath = this.iconOff || 'M6 6l12 12M6 18L18 6';
const path = this.value ? onPath : offPath;
return html`
<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
${svg`<path d="${path}"></path>`}
</svg>
`;
}
private renderLabel() {
if (!this.hasSlot('Label')) return html``;
return html`
<label id="${this.labelId}" class="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">
${unsafeHTML(this.getSlotContent('Label'))}
</label>
`;
}
private renderHelper(hasError: boolean) {
if (!this.isEditing || hasError || !this.hasSlot('Helper')) return html``;
return html`
<p id="${this.helperId}" class="mt-2 text-xs text-slate-500 dark:text-slate-400">
${unsafeHTML(this.getSlotContent('Helper'))}
</p>
`;
}
private renderError(hasError: boolean) {
if (!this.isEditing || !hasError) return html``;
return html`
<p id="${this.errorId}" class="mt-2 text-xs text-red-600 dark:text-red-400">
${unsafeHTML(String(this.error))}
</p>
`;
}
private renderEditMode() {
const hasError = Boolean(this.error);
const describedBy = hasError
? this.errorId
: (this.hasSlot('Helper') ? this.helperId : undefined);
return html`
<div class="flex flex-col">
<button
class="${this.getButtonClasses()}"
type="button"
role="switch"
aria-checked="${this.value ? 'true' : 'false'}"
aria-disabled="${this.disabled ? 'true' : 'false'}"
aria-invalid="${hasError ? 'true' : 'false'}"
${this.hasSlot('Label') ? `aria-labelledby="${this.labelId}"` : ''}
${describedBy ? `aria-describedby="${describedBy}"` : ''}
?disabled=${this.disabled}
@click=${this.handleToggle}
@keydown=${this.handleKeyDown}
@focus=${this.handleFocus}
@blur=${this.handleBlur}
>
<span class="${this.getTrackClasses(hasError)}">
<span class="${this.getThumbClasses(hasError)}">
${this.renderIcon()}
</span>
</span>
</button>
${this.name ? html`<input type="hidden" name="${this.name}" value="${String(this.value)}" />` : html``}
${this.renderError(hasError)}
${this.renderHelper(hasError)}
</div>
`;
}
private renderViewMode() {
return html`
<div class="text-sm text-slate-900 dark:text-slate-100">
${this.value ? this.msg.yes : this.msg.no}
</div>
`;
}
// ===========================================================================
// RENDER
// ===========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];
return html`
<div class="w-full">
${this.renderLabel()}
${this.isEditing ? this.renderEditMode() : this.renderViewMode()}
</div>
`;
}
}
