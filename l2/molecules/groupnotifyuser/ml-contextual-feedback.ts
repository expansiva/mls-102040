/// <mls fileReference="_102040_/l2/molecules/groupnotifyuser/ml-contextual-feedback.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// CONTEXTUAL FEEDBACK MOLECULE
// =============================================================================
// Skill Group: groupNotifyUser
// This molecule does NOT contain business logic.

import { html, TemplateResult } from'lit';
import { customElement, property, state } from'lit/decorators.js';
import { unsafeHTML } from'lit/directives/unsafe-html.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
 dismissLabel:'Dismiss notification',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
 en: message_en,
 pt: {
 dismissLabel:'Dispensar notificação',
 },
};
/// **collab_i18n_end**

@customElement('groupnotifyuser--ml-contextual-feedback')
export class ContextualFeedbackMolecule extends MoleculeAuraElement {
 private msg: MessageType = messages.en;

 // ===========================================================================
 // SLOT TAGS
 // ===========================================================================
 slotTags = ['Title','Message','Action','Icon'];

 // ===========================================================================
 // PROPERTIES — From Contract
 // ===========================================================================
 @propertyDataSource({ type: String })
 type: string ='info';

 @propertyDataSource({ type: Boolean })
 visible: boolean = false;

 @propertyDataSource({ type: Boolean })
 dismissible: boolean = true;

 @propertyDataSource({ type: Number })
 duration: number = 0;

 @propertyDataSource({ type: String })
 position: string ='';

 // ===========================================================================
 // INTERNAL STATE
 // ===========================================================================
 @state()
 private isAnimatingOut: boolean = false;

 @state()
 private isAnimatingIn: boolean = false;

 private autoHideTimer: number | null = null;
 private previousVisible: boolean = false;

 // ===========================================================================
 // LIFECYCLE
 // ===========================================================================
 disconnectedCallback() {
 super.disconnectedCallback();
 this.clearAutoHideTimer();
 }

 updated(changedProperties: Map<string, unknown>) {
 super.updated(changedProperties);

 if (changedProperties.has('visible')) {
 const wasVisible = this.previousVisible;
 this.previousVisible = this.visible;

 if (this.visible && !wasVisible) {
 this.handleBecomeVisible();
 } else if (!this.visible && wasVisible) {
 this.clearAutoHideTimer();
 }
 }

 if (changedProperties.has('duration') && this.visible && this.duration > 0) {
 this.startAutoHideTimer();
 }
 }

 // ===========================================================================
 // STATE CHANGE HANDLER
 // ===========================================================================
 handleIcaStateChange(key: string, value: unknown) {
 const visibleAttr = this.getAttribute('visible');
 if (visibleAttr === `{{${key}}}`) {
 const wasVisible = this.visible;
 if (value && !wasVisible) {
 this.isAnimatingIn = true;
 requestAnimationFrame(() => {
 this.isAnimatingIn = false;
 });
 }
 }
 this.requestUpdate();
 }

 // ===========================================================================
 // AUTO-DISMISS LOGIC
 // ===========================================================================
 private handleBecomeVisible() {
 this.isAnimatingIn = true;
 requestAnimationFrame(() => {
 requestAnimationFrame(() => {
 this.isAnimatingIn = false;
 });
 });

 if (this.duration > 0) {
 this.startAutoHideTimer();
 }
 }

 private startAutoHideTimer() {
 this.clearAutoHideTimer();
 this.autoHideTimer = window.setTimeout(() => {
 this.handleDismiss();
 }, this.duration);
 }

 private clearAutoHideTimer() {
 if (this.autoHideTimer !== null) {
 clearTimeout(this.autoHideTimer);
 this.autoHideTimer = null;
 }
 }

 // ===========================================================================
 // EVENT HANDLERS
 // ===========================================================================
 private handleDismiss() {
 this.clearAutoHideTimer();
 this.visible = false;
 this.dispatchEvent(
 new CustomEvent('dismiss', {
 bubbles: true,
 composed: true,
 detail: {},
 })
 );
 }

 private handleActionClick() {
 this.dispatchEvent(
 new CustomEvent('action', {
 bubbles: true,
 composed: true,
 detail: {},
 })
 );
 }

 // ===========================================================================
 // STYLING HELPERS
 // ===========================================================================
 private getContainerClasses(): string {
 const typeStyles = this.getTypeStyles();
 return [
'flex items-start gap-3 p-3 rounded-lg border text-sm transition-all duration-300 ease-out',
 typeStyles.container,
 this.isAnimatingIn ?'opacity-0 translate-y-1' :'opacity-100 translate-y-0',
 ]
 .filter(Boolean)
 .join(' ');
 }

 private getTypeStyles(): {
 container: string;
 icon: string;
 title: string;
 message: string;
 } {
 switch (this.type) {
 case'success':
 return {
 container:
'ml-success-dim-bg ml-border-success',
 icon:'ml-success-text',
 title:'ml-success-text',
 message:'ml-success-text',
 };
 case'error':
 return {
 container:'ml-error-dim-bg ml-border-error',
 icon:'ml-error-text',
 title:'ml-error-text',
 message:'ml-error-text',
 };
 case'warning':
 return {
 container:
'ml-warning-dim-bg ml-border-warning',
 icon:'ml-warning-text',
 title:'ml-warning-text',
 message:'ml-warning-text',
 };
 case'info':
 default:
 return {
 container:'ml-primary-dim-bg ml-border-info',
 icon:'ml-primary-text',
 title:'ml-primary-text',
 message:'ml-primary-text',
 };
 }
 }

 private getAriaRole(): string {
 return this.type ==='error' || this.type ==='warning' ?'alert' :'status';
 }

 private getAriaLive(): string {
 return this.type ==='error' ?'assertive' :'polite';
 }

 // ===========================================================================
 // RENDER HELPERS
 // ===========================================================================
 private renderDefaultIcon(): TemplateResult {
 const typeStyles = this.getTypeStyles();
 const iconClass = `w-5 h-5 flex-shrink-0 ${typeStyles.icon}`;

 switch (this.type) {
 case'success':
 return html`
 <svg
 class="${iconClass}"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 aria-hidden="true"
 >
 <path
 stroke-linecap="round"
 stroke-linejoin="round"
 stroke-width="2"
 d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
 />
 </svg>
 `;
 case'error':
 return html`
 <svg
 class="${iconClass}"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 aria-hidden="true"
 >
 <path
 stroke-linecap="round"
 stroke-linejoin="round"
 stroke-width="2"
 d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
 />
 </svg>
 `;
 case'warning':
 return html`
 <svg
 class="${iconClass}"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 aria-hidden="true"
 >
 <path
 stroke-linecap="round"
 stroke-linejoin="round"
 stroke-width="2"
 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
 />
 </svg>
 `;
 case'info':
 default:
 return html`
 <svg
 class="${iconClass}"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 aria-hidden="true"
 >
 <path
 stroke-linecap="round"
 stroke-linejoin="round"
 stroke-width="2"
 d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
 />
 </svg>
 `;
 }
 }

 private renderIcon(): TemplateResult {
 const typeStyles = this.getTypeStyles();

 if (this.hasSlot('Icon')) {
 return html`
 <div class="${cn(`flex-shrink-0 ${typeStyles.icon}`, this.getSlotClass('Icon'))}" aria-hidden="true">
 ${unsafeHTML(this.getSlotContent('Icon'))}
 </div>
 `;
 }

 return this.renderDefaultIcon();
 }

 private renderTitle(): TemplateResult {
 if (!this.hasSlot('Title')) {
 return html``;
 }

 const typeStyles = this.getTypeStyles();
 return html`
 <div class="${cn(`font-medium ${typeStyles.title}`, this.getSlotClass('Title'))}">
 ${unsafeHTML(this.getSlotContent('Title'))}
 </div>
 `;
 }

 private renderMessage(): TemplateResult {
 const typeStyles = this.getTypeStyles();
 const messageContent = this.getSlotContent('Message');

 if (!messageContent) {
 return html``;
 }

 return html`
 <div class="${cn(typeStyles.message, this.getSlotClass('Message'))}">${unsafeHTML(messageContent)}</div>
 `;
 }

 private renderAction(): TemplateResult {
 if (!this.hasSlot('Action')) {
 return html``;
 }

 const typeStyles = this.getTypeStyles();
 return html`
 <div
 class="${cn(`mt-2 ${typeStyles.title} font-medium cursor-pointer hover:underline`, this.getSlotClass('Action'))}"
 @click="${this.handleActionClick}"
 >
 ${unsafeHTML(this.getSlotContent('Action'))}
 </div>
 `;
 }

 private renderDismissButton(): TemplateResult {
 if (!this.dismissible) {
 return html``;
 }

 const lang = this.getMessageKey(messages);
 this.msg = messages[lang];

 return html`
 <button
 type="button"
 class="flex-shrink-0 p-1 rounded-md ml-text-faint hover:ml-text-muted hover:ml-surface-dim-bg transition-colors"
 aria-label="${this.msg.dismissLabel}"
 @click="${this.handleDismiss}"
 >
 <svg
 class="w-4 h-4"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 aria-hidden="true"
 >
 <path
 stroke-linecap="round"
 stroke-linejoin="round"
 stroke-width="2"
 d="M6 18L18 6M6 6l12 12"
 />
 </svg>
 </button>
 `;
 }

 // ===========================================================================
 // RENDER
 // ===========================================================================
 render() {
 const lang = this.getMessageKey(messages);
 this.msg = messages[lang];

 if (!this.visible) {
 return html``;
 }

 return html`
 <div
 class="${cn(this.getContainerClasses(), this.cssClass)}"
 role="${this.getAriaRole()}"
 aria-live="${this.getAriaLive()}"
 >
 ${this.renderIcon()}
 <div class="flex-1 min-w-0">
 ${this.renderTitle()} ${this.renderMessage()} ${this.renderAction()}
 </div>
 ${this.renderDismissButton()}
 </div>
 `;
 }
}
