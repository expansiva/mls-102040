/// <mls fileReference="_102040_/l2/molecules/groupentertext/ml-cpf-input.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// CPF INPUT MOLECULE
// =============================================================================
// Skill Group: groupEnterText
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';
/// **collab_i18n_start**
const message_en = {
loading: 'Loading...',
empty: '—',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
pt: {
loading: 'Carregando...',
empty: '—',
},
};
/// **collab_i18n_end**
@customElement('groupentertext--ml-cpf-input')
export class CpfInputMolecule extends MoleculeAuraElement {
static idCounter = 0;
private uid = `cpf-input-${CpfInputMolecule.idCounter++}`;
private msg: MessageType = messages.en;
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
mask: string = '###.###.###-##';
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
private displayValue: string = '';
// ===========================================================================
// STATE CHANGE HANDLER
// ==========================================================================
handleIcaStateChange(key: string, value: any) {
const valueAttr = this.getAttribute('value');
if (valueAttr === `{{${key}}}`) {
this.displayValue = this.formatCpf(String(value ?? ''));
}
this.requestUpdate();
}
// ===========================================================================
// LIFECYCLE
// ==========================================================================
updated(changedProps: Map<string, any>) {
if (changedProps.has('value')) {
this.displayValue = this.formatCpf(this.value);
}
}
// ===========================================================================
// EVENT HANDLERS
// ==========================================================================
private handleInputEvent(event: Event) {
event.stopPropagation();
if (this.disabled || this.readonly || this.loading) return;
const target = event.target as HTMLInputElement | HTMLTextAreaElement;
let raw = target.value;
if (this.rows <= 1) {
raw = raw.replace(/\D/g, '');
raw = raw.slice(0, this.getMaxDigits());
this.value = raw;
this.displayValue = this.formatCpf(raw);
} else {
if (this.maxLength !== null && raw.length > this.maxLength) {
raw = raw.slice(0, this.maxLength);
}
this.value = raw;
this.displayValue = raw;
}
this.dispatchEvent(new CustomEvent('input', {
bubbles: true,
composed: true,
detail: { value: this.value }
}));
}
private handleBlurEvent() {
if (this.disabled || this.readonly || this.loading) return;
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
private handleFocusEvent() {
if (this.disabled || this.readonly || this.loading) return;
this.dispatchEvent(new CustomEvent('focus', {
bubbles: true,
composed: true,
}));
}
// ===========================================================================
// HELPERS
// ==========================================================================
private getMaxDigits(): number {
const base = this.maxLength ?? 11;
return Math.min(base, 11);
}
private formatCpf(raw: string): string {
// Bound props ({{...}}) resolve to undefined before the state is seeded.
const digits = String(raw ?? '').replace(/\D/g, '').slice(0, 11);
let formatted = digits;
if (digits.length > 3) {
formatted = `${digits.slice(0, 3)}.${digits.slice(3)}`;
}
if (digits.length > 6) {
formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
}
if (digits.length > 9) {
formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}
return formatted;
}
private getLabelId(): string {
return `${this.uid}-label`;
}
private getErrorId(): string {
return `${this.uid}-error`;
}
private getHelperId(): string {
return `${this.uid}-helper`;
}
private getCounterId(): string {
return `${this.uid}-counter`;
}
private hasError(): boolean {
return String(this.error || '').length > 0;
}
private getWrapperClasses(): string {
const isError = this.hasError();
const isDisabled = this.disabled || this.loading;
return [
'flex items-stretch ml-input-container',
isError ? 'ml-input-container-error' : '',
isDisabled ? 'ml-disabled' : '',
].filter(Boolean).join(' ');
}
private getInputClasses(): string {
return [
'flex-1 bg-transparent px-3 py-2 text-sm outline-none ml-input',
].join(' ');
}
// ===========================================================================
// RENDER PARTS
// ==========================================================================
private renderLabel(): TemplateResult {
if (!this.hasSlot('Label')) return html``;
return html`
<label id="${this.getLabelId()}" class="${cn('mb-1 block text-sm ml-label', this.getSlotClass('Label'))}">
${unsafeHTML(this.getSlotContent('Label'))}
</label>
`;
}
private renderPrefix(): TemplateResult {
if (!this.hasSlot('Prefix')) return html``;
return html`
<div class="${cn('flex items-center px-3 text-sm ml-text-muted', this.getSlotClass('Prefix'))}">
${unsafeHTML(this.getSlotContent('Prefix'))}
</div>
`;
}
private renderSuffix(): TemplateResult {
if (!this.hasSlot('Suffix')) return html``;
return html`
<div class="${cn('flex items-center px-3 text-sm ml-text-muted', this.getSlotClass('Suffix'))}">
${unsafeHTML(this.getSlotContent('Suffix'))}
</div>
`;
}
private renderHelperOrError(): TemplateResult {
if (!this.isEditing) return html``;
if (this.hasError()) {
return html`<p id="${this.getErrorId()}" class="mt-1 text-xs ml-error-text">${unsafeHTML(String(this.error))}</p>`;
}
if (this.hasSlot('Helper')) {
return html`<p id="${this.getHelperId()}" class="${cn('mt-1 text-xs ml-helper', this.getSlotClass('Helper'))}">${unsafeHTML(this.getSlotContent('Helper'))}</p>`;
}
return html``;
}
private renderCounter(): TemplateResult {
if (!this.isEditing) return html``;
if (this.rows <= 1 || this.maxLength === null) return html``;
return html`
<p id="${this.getCounterId()}" class="mt-1 text-xs ml-text-muted" aria-live="polite">
${String(this.value ?? '').length} / ${this.maxLength}
</p>
`;
}
private renderViewMode(): TemplateResult {
const formatted = this.formatCpf(this.value);
const viewValue = this.inputType === 'password'
? '••••••••'
: (this.value ? formatted : this.msg.empty);
return html`
<div class="${cn('w-full', this.cssClass)}">
${this.renderLabel()}
<div class="flex items-stretch ml-input-container">
${this.renderPrefix()}
<div class="flex-1 px-3 py-2 text-sm ml-text">
${viewValue}
</div>
${this.renderSuffix()}
</div>
</div>
`;
}
private renderEditMode(): TemplateResult {
const isDisabled = this.disabled || this.loading;
const ariaDescribedBy = this.hasError()
? this.getErrorId()
: (this.hasSlot('Helper') ? this.getHelperId() : undefined);
const inputValue = this.rows <= 1
? (this.displayValue || this.formatCpf(this.value))
: (this.displayValue || this.value);
return html`
<div class="${cn('w-full', this.cssClass)}">
${this.renderLabel()}
<div class="${this.getWrapperClasses()}">
${this.renderPrefix()}
${this.rows > 1
? html`
<textarea
class="${this.getInputClasses()}"
.name=${this.name}
.placeholder=${this.placeholder}
.rows=${this.rows}
.autocomplete=${this.autocomplete}
?disabled=${isDisabled}
?readonly=${this.readonly}
?required=${this.required}
aria-labelledby=${this.hasSlot('Label') ? this.getLabelId() : ''}
aria-invalid=${this.hasError() ? 'true' : 'false'}
aria-required=${this.required ? 'true' : 'false'}
aria-describedby=${ariaDescribedBy || ''}
@input=${this.handleInputEvent}
@blur=${this.handleBlurEvent}
@focus=${this.handleFocusEvent}

@change="${(e: Event) => e.stopPropagation()}"
>${inputValue}</textarea>
`
: html`
<input
class="${this.getInputClasses()}"
.type=${this.inputType}
.name=${this.name}
.placeholder=${this.placeholder}
.autocomplete=${this.autocomplete}
.value=${inputValue}
?disabled=${isDisabled}
?readonly=${this.readonly}
?required=${this.required}
aria-labelledby=${this.hasSlot('Label') ? this.getLabelId() : ''}
aria-invalid=${this.hasError() ? 'true' : 'false'}
aria-required=${this.required ? 'true' : 'false'}
aria-describedby=${ariaDescribedBy || ''}
@input=${this.handleInputEvent}
@blur=${this.handleBlurEvent}
@focus=${this.handleFocusEvent}

@change="${(e: Event) => e.stopPropagation()}"
/>
`}
${this.renderSuffix()}
</div>
${this.loading ? html`<p class="mt-1 text-xs ml-text-muted">${this.msg.loading}</p>` : html``}
${this.renderCounter()}
${this.renderHelperOrError()}
</div>
`;
}
// ===========================================================================
// RENDER
// ==========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];
return this.isEditing ? this.renderEditMode() : this.renderViewMode();
}
}
