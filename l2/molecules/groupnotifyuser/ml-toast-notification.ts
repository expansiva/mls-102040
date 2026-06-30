/// <mls fileReference="_102040_/l2/molecules/groupnotifyuser/ml-toast-notification.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// TOAST NOTIFICATION MOLECULE
// =============================================================================
// Skill Group: groupNotifyUser
// This molecule does NOT contain business logic.

import { html, svg, TemplateResult } from'lit';
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

type NotificationType ='info' |'success' |'warning' |'error';
type PositionType ='top' |'bottom' |'top-right' |'bottom-right' |'top-left' |'bottom-left';

@customElement('groupnotifyuser--ml-toast-notification')
export class ToastNotificationMolecule extends MoleculeAuraElement {
 private msg: MessageType = messages.en;

 // ===========================================================================
 // SLOT TAGS
 // ===========================================================================
 slotTags = ['Title','Message','Action','Icon'];

 // ===========================================================================
 // PROPERTIES — From Contract
 // ===========================================================================
 @propertyDataSource({ type: String })
 type: NotificationType ='info';

 @propertyDataSource({ type: Boolean })
 visible: boolean = false;

 @propertyDataSource({ type: Boolean })
 dismissible: boolean = true;

 @propertyDataSource({ type: Number })
 duration: number = 0;

 @propertyDataSource({ type: String })
 position: PositionType |'' ='';

 // ===========================================================================
 // INTERNAL STATE
 // ===========================================================================
 @state()
 private isAnimatingOut: boolean = false;

 private autoCloseTimer: number | null = null;

 // ===========================================================================
 // LIFECYCLE
 // ===========================================================================
 disconnectedCallback() {
 super.disconnectedCallback();
 this.clearAutoCloseTimer();
 }

 updated(changedProperties: Map<string, unknown>) {
 if (changedProperties.has('visible')) {
 if (this.visible) {
 this.isAnimatingOut = false;
 this.startAutoCloseTimer();
 } else {
 this.clearAutoCloseTimer();
 }
 }

 if (changedProperties.has('duration') && this.visible) {
 this.clearAutoCloseTimer();
 this.startAutoCloseTimer();
 }
 }

 // ===========================================================================
 // STATE CHANGE HANDLER
 // ===========================================================================
 handleIcaStateChange(key: string, value: unknown) {
 const visibleAttr = this.getAttribute('visible');
 if (visibleAttr === `{{${key}}}`) {
 if (value === true) {
 this.isAnimatingOut = false;
 this.startAutoCloseTimer();
 } else {
 this.clearAutoCloseTimer();
 }
 }
 this.requestUpdate();
 }

 // ===========================================================================
 // TIMER MANAGEMENT
 // ===========================================================================
 private startAutoCloseTimer() {
 this.clearAutoCloseTimer();
 if (this.duration > 0) {
 this.autoCloseTimer = window.setTimeout(() => {
 this.handleDismiss();
 }, this.duration);
 }
 }

 private clearAutoCloseTimer() {
 if (this.autoCloseTimer !== null) {
 window.clearTimeout(this.autoCloseTimer);
 this.autoCloseTimer = null;
 }
 }

 // ===========================================================================
 // EVENT HANDLERS
 // ===========================================================================
 private handleDismiss() {
 this.clearAutoCloseTimer();
 this.isAnimatingOut = true;

 setTimeout(() => {
 this.visible = false;
 this.isAnimatingOut = false;
 this.dispatchEvent(new CustomEvent('dismiss', {
 bubbles: true,
 composed: true,
 detail: {}
 }));
 }, 300);
 }

 private handleActionClick(e: Event) {
 e.stopPropagation();
 this.dispatchEvent(new CustomEvent('action', {
 bubbles: true,
 composed: true,
 detail: {}
 }));
 }

 // ===========================================================================
 // STYLING HELPERS
 // ===========================================================================
 private getContainerClasses(): string {
 const baseClasses = [
'flex items-start gap-3 p-4 rounded-lg shadow-lg border max-w-sm w-full',
'transition-all duration-300 ease-in-out',
 ];

 const typeClasses = this.getTypeClasses();
 const positionClasses = this.getPositionClasses();
 const animationClasses = this.getAnimationClasses();

 return [...baseClasses, typeClasses, positionClasses, animationClasses].filter(Boolean).join(' ');
 }

 private getTypeClasses(): string {
 switch (this.type) {
 case'success':
 return'ml-success-dim-bg ml-border-success';
 case'warning':
 return'ml-warning-dim-bg ml-border-warning';
 case'error':
 return'ml-error-dim-bg ml-border-error';
 case'info':
 default:
 return'ml-primary-dim-bg ml-border-info';
 }
 }

 private getPositionClasses(): string {
 if (!this.position) return'';

 const positionMap: Record<PositionType, string> = {
'top':'fixed top-4 left-1/2 -translate-x-1/2 z-50',
'bottom':'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
'top-right':'fixed top-4 right-4 z-50',
'bottom-right':'fixed bottom-4 right-4 z-50',
'top-left':'fixed top-4 left-4 z-50',
'bottom-left':'fixed bottom-4 left-4 z-50',
 };

 return positionMap[this.position as PositionType] ||'';
 }

 private getAnimationClasses(): string {
 if (this.isAnimatingOut) {
 return this.getExitAnimationClass();
 }
 return this.getEntryAnimationClass();
 }

 private getEntryAnimationClass(): string {
 if (!this.position) return'opacity-100 translate-y-0';

 switch (this.position) {
 case'top':
 case'top-left':
 case'top-right':
 return'animate-slide-in-top';
 case'bottom':
 case'bottom-left':
 case'bottom-right':
 return'animate-slide-in-bottom';
 default:
 return'opacity-100';
 }
 }

 private getExitAnimationClass(): string {
 if (!this.position) return'opacity-0 translate-y-2';

 switch (this.position) {
 case'top':
 case'top-left':
 case'top-right':
 return'opacity-0 -translate-y-4';
 case'bottom':
 case'bottom-left':
 case'bottom-right':
 return'opacity-0 translate-y-4';
 default:
 return'opacity-0';
 }
 }

 private getIconColorClasses(): string {
 switch (this.type) {
 case'success':
 return'ml-success-text';
 case'warning':
 return'ml-warning-text';
 case'error':
 return'ml-error-text';
 case'info':
 default:
 return'ml-primary-text';
 }
 }

 private getTitleClasses(): string {
 return'text-sm font-semibold ml-text';
 }

 private getMessageClasses(): string {
 return'text-sm ml-text';
 }

 private getActionClasses(): string {
 return [
'mt-2 text-sm font-medium cursor-pointer transition-colors',
 this.getActionColorClasses(),
 ].join(' ');
 }

 private getActionColorClasses(): string {
 switch (this.type) {
 case'success':
 return'ml-success-text';
 case'warning':
 return'ml-warning-text';
 case'error':
 return'ml-error-text';
 case'info':
 default:
 return'ml-primary-text';
 }
 }

 private getCloseButtonClasses(): string {
 return [
'flex-shrink-0 p-1 rounded-md transition-colors',
'ml-text-faint',
'hover:ml-text-muted',
'hover:ml-surface-dim-bg',
'',
 ].join(' ');
 }

 // ===========================================================================
 // ACCESSIBILITY HELPERS
 // ===========================================================================
 private getAriaRole(): string {
 return this.type ==='error' || this.type ==='warning' ?'alert' :'status';
 }

 private getAriaLive():'assertive' |'polite' {
 return this.type ==='error' ?'assertive' :'polite';
 }

 // ===========================================================================
 // RENDER HELPERS
 // ===========================================================================
 private renderIcon(): TemplateResult {
 if (this.hasSlot('Icon')) {
 return html`
 <div class="${cn(`flex-shrink-0 ${this.getIconColorClasses()}`, this.getSlotClass('Icon'))}">
 ${unsafeHTML(this.getSlotContent('Icon'))}
 </div>
 `;
 }

 return html`
 <div class="flex-shrink-0 ${this.getIconColorClasses()}">
 ${this.renderDefaultIcon()}
 </div>
 `;
 }

 private renderDefaultIcon(): TemplateResult {
 const iconClasses ='w-5 h-5';

 switch (this.type) {
 case'success':
 return html`
 <svg class="${iconClasses}" viewBox="0 0 20 20" fill="currentColor">
 ${svg`
 <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
 `}
 </svg>
 `;
 case'warning':
 return html`
 <svg class="${iconClasses}" viewBox="0 0 20 20" fill="currentColor">
 ${svg`
 <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
 `}
 </svg>
 `;
 case'error':
 return html`
 <svg class="${iconClasses}" viewBox="0 0 20 20" fill="currentColor">
 ${svg`
 <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
 `}
 </svg>
 `;
 case'info':
 default:
 return html`
 <svg class="${iconClasses}" viewBox="0 0 20 20" fill="currentColor">
 ${svg`
 <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
 `}
 </svg>
 `;
 }
 }

 private renderTitle(): TemplateResult {
 if (!this.hasSlot('Title')) {
 return html``;
 }

 return html`
 <div class="${cn(this.getTitleClasses(), this.getSlotClass('Title'))}">
 ${unsafeHTML(this.getSlotContent('Title'))}
 </div>
 `;
 }

 private renderMessage(): TemplateResult {
 return html`
 <div class="${cn(this.getMessageClasses(), this.getSlotClass('Message'))}">
 ${unsafeHTML(this.getSlotContent('Message'))}
 </div>
 `;
 }

 private renderAction(): TemplateResult {
 if (!this.hasSlot('Action')) {
 return html``;
 }

 return html`
 <div
 class="${cn(this.getActionClasses(), this.getSlotClass('Action'))}"
 @click=${this.handleActionClick}
 >
 ${unsafeHTML(this.getSlotContent('Action'))}
 </div>
 `;
 }

 private renderCloseButton(): TemplateResult {
 if (!this.dismissible) {
 return html``;
 }

 return html`
 <button
 type="button"
 class="${this.getCloseButtonClasses()}"
 aria-label="${this.msg.dismissLabel}"
 @click=${this.handleDismiss}
 >
 <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
 ${svg`
 <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
 `}
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

 if (!this.visible && !this.isAnimatingOut) {
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
 ${this.renderTitle()}
 ${this.renderMessage()}
 ${this.renderAction()}
 </div>
 
 ${this.renderCloseButton()}
 </div>
 `;
 }
}
