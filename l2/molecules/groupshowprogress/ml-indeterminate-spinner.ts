/// <mls fileReference="_102040_/l2/molecules/groupshowprogress/ml-indeterminate-spinner.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// INDETERMINATE SPINNER MOLECULE
// =============================================================================
// Skill Group: groupShowProgress
// This molecule does NOT contain business logic.
import { html } from'lit';
import { customElement } from'lit/decorators.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
loading:'Loading',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
};
/// **collab_i18n_end**

@customElement('groupshowprogress--ml-indeterminate-spinner')
export class IndeterminateSpinnerMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
// ===========================================================================
// SLOT TAGS
// ===========================================================================
slotTags = [];
// ===========================================================================
// PROPERTIES — From Contract
// ===========================================================================
@propertyDataSource({ type: Number })
value: number | null = null;

@propertyDataSource({ type: String })
size:'xs' |'sm' |'md' |'lg' ='md';

@propertyDataSource({ type: String })
label: string ='';

@propertyDataSource({ type: Boolean, attribute:'show-value' })
showValue: boolean = false;
// ===========================================================================
// RENDER
// ===========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];
const ariaLabel = this.label || this.msg.loading;
const sizeConfig = this.getSizeConfig();
return html`
<div
class="${cn(sizeConfig.wrapper, this.cssClass)}"
role="progressbar"
aria-label="${ariaLabel}"
>
<div class="${sizeConfig.spinner}"></div>
${this.label
? html`<span class="${sizeConfig.text}">${this.label}</span>`
: html``}
</div>
`;
}
// ===========================================================================
// HELPERS
// ===========================================================================
private getSizeConfig(): { wrapper: string; spinner: string; text: string } {
const baseWrapper ='inline-flex items-center';
const baseSpinner = [
'rounded-full border-solid animate-spin',
'ml-border',
'ml-border-top-primary',
'motion-reduce:animate-none',
].join(' ');
const baseText ='ml-text-muted';

switch (this.size) {
case'xs':
return {
wrapper: `${baseWrapper} gap-1`,
spinner: `${baseSpinner} w-3 h-3 border-2`,
text: `${baseText} text-xs`,
};
case'sm':
return {
wrapper: `${baseWrapper} gap-2`,
spinner: `${baseSpinner} w-5 h-5 border-2`,
text: `${baseText} text-sm`,
};
case'lg':
return {
wrapper: `${baseWrapper} gap-3`,
spinner: `${baseSpinner} w-12 h-12 border-4`,
text: `${baseText} text-base`,
};
case'md':
default:
return {
wrapper: `${baseWrapper} gap-2`,
spinner: `${baseSpinner} w-8 h-8 border-4`,
text: `${baseText} text-sm`,
};
}
}
}
