/// <mls fileReference="_102040_/l2/molecules/groupentertext/ml-floating-text-input.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML FLOATING TEXT INPUT MOLECULE
// =============================================================================
// Skill Group: groupEnterText
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { customElement, property, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';
@customElement('groupentertext--ml-floating-text-input')
export class MlFloatingTextInputMolecule extends MoleculeAuraElement {
// ===========================================================================
// SLOT TAGS
// ==========================================================================
slotTags = ['Label', 'Helper', 'Prefix', 'Suffix'];
// ===========================================================================
// PROPERTIES — From Contract
// ==========================================================================
@propertyDataSource({ type: String })
value: string = '';
@propertyDataSource({ type: String })
error: string = '';
@propertyDataSource({ type: String })
name: string = '';
@propertyDataSource({ type: String })
placeholder: string = '';
@propertyDataSource({ type: Number, attribute: 'max-length' })
maxLength: number | null = null;
@propertyDataSource({ type: Number, attribute: 'min-length' })
minLength: number | null = null;
@propertyDataSource({ type: Number, attribute: 'rows' })
rows: number = 1;
@propertyDataSource({ type: String })
autocomplete: string = '';
@propertyDataSource({ type: String, attribute: 'input-type' })
inputType: string = 'text';
@propertyDataSource({ type: String })
mask: string = '';
@propertyDataSource({ type: Boolean, attribute: 'is-editing' })
isEditing: boolean = true;
@propertyDataSource({ type: Boolean })
disabled: boolean = false;
@propertyDataSource({ type: Boolean })
readonly: boolean = false;
@propertyDataSource({ type: Boolean })
required: boolean = false;
@propertyDataSource({ type: Boolean })
loading: boolean = false;
// ===========================================================================
// INTERNAL STATE
// ==========================================================================
@state()
private rawDisplay: string = '';
@state()
private isFocused: boolean = false;
@state()
private uid: string = `ml-floating-${Math.random().toString(36).slice(2, 9)}`;
// ===========================================================================
// STATE CHANGE HANDLER (derived values)
// ==========================================================================
handleIcaStateChange(key: string, value: any) {
const valueAttr = this.getAttribute('value');
const maskAttr = this.getAttribute('mask');
const inputTypeAttr = this.getAttribute('input-type');
if (valueAttr === `{{${key}}}` || maskAttr === `{{${key}}}` || inputTypeAttr === `{{${key}}}`) {
this.rawDisplay = this.getMaskedDisplayValue(this.value, this.mask, this.inputType);
}
this.requestUpdate();
}
// ===========================================================================
// LIFECYCLE
// ==========================================================================
updated(changedProps: Map<string, unknown>) {
if (changedProps.has('value') || changedProps.has('mask') || changedProps.has('inputType')) {
this.rawDisplay = this.getMaskedDisplayValue(this.value, this.mask, this.inputType);
}
}
// ===========================================================================
// EVENT HANDLERS
// ==========================================================================
private handleInput(e: Event) {
if (this.disabled || this.readonly || this.loading || !this.isEditing) return;
const input = e.target as HTMLInputElement;
const incomingValue = input.value ?? '';
let nextRaw = incomingValue;
let nextDisplay = incomingValue;
if (this.shouldUseMask()) {
nextRaw = this.extractRawFromInput(incomingValue, this.mask);
if (this.maxLength !== null) {
nextRaw = nextRaw.slice(0, this.maxLength);
}
nextDisplay = this.applyMaskToRaw(nextRaw, this.mask);
input.value = nextDisplay;
this.rawDisplay = nextDisplay;
} else {
if (this.maxLength !== null && incomingValue.length > this.maxLength) {
nextRaw = incomingValue.slice(0, this.maxLength);
input.value = nextRaw;
}
}
this.value = nextRaw;
this.dispatchEvent(new CustomEvent('input', {
bubbles: true,
composed: true,
detail: { value: this.value }
}));
}
private handleBlur() {
if (!this.isEditing) return;
this.isFocused = false;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value }
}));
this.dispatchEvent(new CustomEvent('blur', {
bubbles: true,
composed: true,
}));
}
private handleFocus() {
if (!this.isEditing) return;
this.isFocused = true;
this.dispatchEvent(new CustomEvent('focus', {
bubbles: true,
composed: true,
}));
}
// ===========================================================================
// MASK HELPERS
// ==========================================================================
private shouldUseMask(): boolean {
return Boolean(this.mask) && this.inputType !== 'password';
}
private getMaskedDisplayValue(value: string, mask: string, inputType: string): string {
if (!mask || inputType === 'password') return value ?? '';
return this.applyMaskToRaw(value ?? '', mask);
}
private applyMaskToRaw(raw: string, mask: string): string {
if (!mask) return raw;
let result = '';
let rawIndex = 0;
for (let i = 0; i < mask.length; i += 1) {
const maskChar = mask[i];
if (this.isMaskToken(maskChar)) {
if (rawIndex >= raw.length) break;
result += raw[rawIndex];
rawIndex += 1;
} else {
if (rawIndex > 0 && rawIndex <= raw.length) {
result += maskChar;
}
}
}
return result;
}
private extractRawFromInput(input: string, mask: string): string {
if (!mask) return input;
const tokens = mask.split('').filter((ch) => this.isMaskToken(ch));
let raw = '';
let tokenIndex = 0;
for (let i = 0; i < input.length; i += 1) {
if (tokenIndex >= tokens.length) break;
const token = tokens[tokenIndex];
const ch = input[i];
if (this.isCharValidForToken(ch, token)) {
raw += ch;
tokenIndex += 1;
}
}
return raw;
}
private isMaskToken(ch: string): boolean {
return ch === '#' || ch === 'A' || ch === '*';
}
private isCharValidForToken(ch: string, token: string): boolean {
if (token === '#') return /\d/.test(ch);
if (token === 'A') return /[a-zA-Z]/.test(ch);
return true;
}
// ===========================================================================
// RENDER HELPERS
// ==========================================================================
private getLabelText(): string {
if (this.hasSlot('Label')) {
return this.getSlotContent('Label');
}
return this.placeholder || '';
}
private getInputPlaceholder(labelText: string): string {
return labelText ? '' : this.placeholder;
}
private getViewValue(): string {
if (this.inputType === 'password') return '••••••••';
if (!this.value) return '—';
if (this.shouldUseMask()) return this.getMaskedDisplayValue(this.value, this.mask, this.inputType);
return this.value;
}
private renderPrefix(): TemplateResult {
if (!this.hasSlot('Prefix')) return html``;
return html`<div class="${cn('ml-text-muted', this.getSlotClass('Prefix'))}">${unsafeHTML(this.getSlotContent('Prefix'))}</div>`;
}
private renderSuffix(): TemplateResult {
if (!this.hasSlot('Suffix') && !this.loading) return html``;
return html`
<div class="${cn('flex items-center gap-2 ml-text-muted', this.getSlotClass('Suffix'))}">
${this.hasSlot('Suffix') ? unsafeHTML(this.getSlotContent('Suffix')) : html``}
${this.loading ? html`<span class="inline-block h-4 w-4 animate-spin rounded-full ml-spinner"></span>` : html``}
</div>
`;
}
private renderFeedback(labelId: string): TemplateResult {
if (!this.isEditing) return html``;
if (this.error) {
return html`<p id="${labelId}-error" class="mt-1 text-xs ml-error-text">${unsafeHTML(this.error)}</p>`;
}
if (this.hasSlot('Helper')) {
return html`<p id="${labelId}-helper" class="${cn('mt-1 text-xs ml-helper', this.getSlotClass('Helper'))}">${unsafeHTML(this.getSlotContent('Helper'))}</p>`;
}
return html``;
}
private renderInlineLabel(labelText: string, labelId: string): TemplateResult {
if (!labelText) return html``;
const labelClasses = [
// When prefix exists, shift the inline label to avoid overlapping the prefix content.
this.hasSlot('Prefix') ? 'left-10' : 'left-3',
'absolute transition-all pointer-events-none top-1/2 -translate-y-1/2 text-sm ml-text-faint',
this.getSlotClass('Label'),
].filter(Boolean).join(' ');
return html`<label id="${labelId}" class="${labelClasses}">${unsafeHTML(labelText)}</label>`;
}
private renderFloatingLabel(labelText: string, labelId: string): TemplateResult {
if (!labelText) return html``;
// Show label above the input when focused or filled to keep field context visible.
return html`<label id="${labelId}" class="${cn('mb-1 block text-xs ml-text-muted', this.getSlotClass('Label'))}">${unsafeHTML(labelText)}</label>`;
}
private getContainerClasses(hasInlineLabel: boolean): string {
return [
'relative flex w-full items-center gap-2 ml-input-container',
hasInlineLabel ? 'pt-4 pb-1 px-3' : 'py-2 px-3',
this.error ? 'ml-input-container-error' : '',
this.disabled || this.loading ? 'ml-disabled' : 'cursor-text',
].filter(Boolean).join(' ');
}
private getInputClasses(): string {
return [
'flex-1 bg-transparent outline-none text-sm ml-input',
this.disabled || this.loading ? 'cursor-not-allowed' : '',
this.readonly ? 'cursor-default' : '',
].filter(Boolean).join(' ');
}
// ===========================================================================
// RENDER
// ==========================================================================
render() {
const labelText = this.getLabelText();
const labelId = `${this.uid}-label`;
if (!this.isEditing) {
return html`
<div class="${cn('w-full', this.cssClass)}">
${labelText ? html`<div class="mb-1 text-sm ml-text-muted">${unsafeHTML(labelText)}</div>` : html``}
<div class="flex items-center gap-2 text-sm ml-text">
${this.renderPrefix()}
<span>${this.getViewValue()}</span>
${this.renderSuffix()}
</div>
</div>
`;
}
const floating = this.isFocused || Boolean(this.value);
const showFloatingLabel = Boolean(labelText) && floating;
const showInlineLabel = Boolean(labelText) && !floating;
const inputValue = this.shouldUseMask() ? this.rawDisplay : this.value;
const inputPlaceholder = this.getInputPlaceholder(labelText);
const inputDisabled = this.disabled || this.loading;
const describedBy = this.error
? `${labelId}-error`
: this.hasSlot('Helper') ? `${labelId}-helper` : undefined;
return html`
<div class="${cn('w-full', this.cssClass)}">
<div class="min-h-[1rem]">
<!-- Reserve vertical space for the floating label to avoid layout shift -->
${showFloatingLabel ? this.renderFloatingLabel(labelText, labelId) : html``}
</div>
<div class="${this.getContainerClasses(showInlineLabel)}">
${showInlineLabel ? this.renderInlineLabel(labelText, labelId) : html``}
${this.renderPrefix()}
<input
class="${this.getInputClasses()}"
type="${this.inputType}"
.value="${inputValue}"
placeholder="${inputPlaceholder}"
maxlength=${ifDefined(this.maxLength ?? undefined)}
minlength=${ifDefined(this.minLength ?? undefined)}
name="${this.name}"
autocomplete="${this.autocomplete}"
?disabled=${inputDisabled}
?readonly=${this.readonly}
?required=${this.required}
aria-labelledby=${ifDefined(labelText ? labelId : undefined)}
aria-describedby=${ifDefined(describedBy)}
aria-invalid=${this.error ? 'true' : 'false'}
aria-required=${this.required ? 'true' : 'false'}
@input=${this.handleInput}
@blur=${this.handleBlur}
@focus=${this.handleFocus}
/>
${this.renderSuffix()}
</div>
${this.renderFeedback(labelId)}
</div>
`;
}
}
