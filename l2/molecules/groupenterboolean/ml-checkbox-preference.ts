/// <mls fileReference="_102040_/l2/molecules/groupenterboolean/ml-checkbox-preference.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// CHECKBOX PREFERENCE MOLECULE
// =============================================================================
// Skill Group: groupEnterBoolean
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, state } from 'lit/decorators.js';
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
pt: {
yes: 'Sim',
no: 'Não',
},
};
/// **collab_i18n_end**

@customElement('groupenterboolean--ml-checkbox-preference')
export class CheckboxPreferenceMolecule extends MoleculeAuraElement {
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

// ===========================================================================
// INTERNAL STATE
// ===========================================================================
@state()
private inputId = `chk-${CheckboxPreferenceMolecule.nextId++}`;

@state()
private labelId = `lbl-${CheckboxPreferenceMolecule.nextId++}`;

@state()
private helperId = `hlp-${CheckboxPreferenceMolecule.nextId++}`;

@state()
private errorId = `err-${CheckboxPreferenceMolecule.nextId++}`;

private static nextId = 0;

// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleToggle(e: Event) {
if (!this.isEditing || this.disabled) return;
const input = e.target as HTMLInputElement;
this.value = input.checked;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value }
}));
}

private handleFocus() {
if (!this.isEditing) return;
this.dispatchEvent(new CustomEvent('focus', {
bubbles: true,
composed: true,
}));
}

private handleBlur() {
if (!this.isEditing) return;
this.dispatchEvent(new CustomEvent('blur', {
bubbles: true,
composed: true,
}));
}

// ===========================================================================
// RENDER HELPERS
// ===========================================================================
private renderLabel(): TemplateResult {
if (!this.hasSlot('Label')) return html``;
return html`
<label
id=${this.labelId}
for=${this.inputId}
class="text-sm font-medium text-slate-900 dark:text-slate-100"
>
${unsafeHTML(this.getSlotContent('Label'))}
</label>
`;
}

private renderHelperOrError(): TemplateResult {
if (!this.isEditing) return html``;
if (this.error) {
return html`
<p id=${this.errorId} class="mt-1 text-xs text-red-600 dark:text-red-400">
${unsafeHTML(String(this.error))}
</p>
`;
}
if (this.hasSlot('Helper')) {
return html`
<p id=${this.helperId} class="mt-1 text-xs text-slate-500 dark:text-slate-400">
${unsafeHTML(this.getSlotContent('Helper'))}
</p>
`;
}
return html``;
}

private getCheckboxClasses(): string {
return [
'h-4 w-4 rounded border transition cursor-pointer',
'bg-white dark:bg-slate-900',
'border-slate-200 dark:border-slate-700',
'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
'checked:bg-sky-600 checked:border-sky-600 dark:checked:bg-sky-400 dark:checked:border-sky-400',
this.error ? 'border-red-500 dark:border-red-400' : '',
this.disabled ? 'opacity-50 cursor-not-allowed' : '',
].filter(Boolean).join(' ');
}

// ===========================================================================
// RENDER
// ===========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];

if (!this.isEditing) {
return html`
<div class="w-full">
${this.hasSlot('Label') ? html`
<div class="mb-1">
${this.renderLabel()}
</div>
` : html``}
<div class="text-sm text-slate-900 dark:text-slate-100">
${this.value ? this.msg.yes : this.msg.no}
</div>
</div>
`;
}

const describedBy = this.error
? this.errorId
: (this.hasSlot('Helper') ? this.helperId : '');

return html`
<div class="w-full">
<div class="flex items-start gap-3">
<input
id=${this.inputId}
class=${this.getCheckboxClasses()}
name=${this.name}
type="checkbox"
?checked=${this.value}
?disabled=${this.disabled}
aria-labelledby=${this.hasSlot('Label') ? this.labelId : ''}
aria-describedby=${describedBy}
aria-invalid=${this.error ? 'true' : 'false'}
aria-disabled=${this.disabled ? 'true' : 'false'}
@change=${this.handleToggle}
@focus=${this.handleFocus}
@blur=${this.handleBlur}
/>
<div class="flex-1">
${this.renderLabel()}
${this.renderHelperOrError()}
</div>
</div>
</div>
`;
}
}
