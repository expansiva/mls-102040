/// <mls fileReference="_102040_/l2/molecules/groupscancode/ml-scan-ocr.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// SCAN OCR MOLECULE
// =============================================================================
// Skill Group: groupScanCode
// This molecule does NOT contain business logic.
import { html, TemplateResult, nothing } from'lit';
import { customElement, state, query } from'lit/decorators.js';
import { unsafeHTML } from'lit/directives/unsafe-html.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
 openCamera:'Open camera scanner',
 capture:'Capture',
 close:'Close',
 loading:'Processing...',
 permissionDenied:'Camera access denied. Please allow permissions.',
 cameraUnavailable:'Camera is not available on this device.',
 resultLabel:'Scan result',
};

type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
 en: message_en,
};
/// **collab_i18n_end**

@customElement('groupscancode--ml-scan-ocr')
export class MlScanOcrMolecule extends MoleculeAuraElement {
 private msg: MessageType = messages.en;

 // ===========================================================================
 // SLOT TAGS
 // ===========================================================================
 slotTags = ['Label','Helper','Trigger','Result'];

 // ===========================================================================
 // PROPERTIES — From Contract
 // ===========================================================================
 @propertyDataSource({ type: String })
 value: string | null = null;

 @propertyDataSource({ type: String })
 error: string ='';

 @propertyDataSource({ type: String })
 name: string ='';

 @propertyDataSource({ type: String })
 facing: string ='environment';

 @propertyDataSource({ type: Boolean, attribute:'auto-capture' })
 autoCapture: boolean = false;

 @propertyDataSource({ type: Number, attribute:'capture-interval' })
 captureInterval: number = 500;

 @propertyDataSource({ type: Boolean })
 disabled: boolean = false;

 @propertyDataSource({ type: Boolean })
 loading: boolean = false;

 // ===========================================================================
 // INTERNAL STATE
 // ===========================================================================
 @state()
 private isOpen: boolean = false;

 @state()
 private localError: string ='';

 @state()
 private isCapturing: boolean = false;

 @query('video')
 private videoEl!: HTMLVideoElement;

 @query('canvas')
 private canvasEl!: HTMLCanvasElement;

 private stream: MediaStream | null = null;
 private captureTimer: number | null = null;

 // ===========================================================================
 // LIFECYCLE
 // ===========================================================================
 disconnectedCallback() {
 super.disconnectedCallback();
 this.stopCamera();
 }

 updated(changed: Map<string, unknown>) {
 if (changed.has('value')) {
 this.dispatchEvent(
 new CustomEvent('change', {
 bubbles: true,
 composed: true,
 detail: { value: this.value },
 })
 );

 if (this.value && this.isOpen) {
 this.closeCamera();
 }
 }

 if (changed.has('loading')) {
 if (this.loading) {
 this.stopAutoCapture();
 } else if (this.isOpen && this.autoCapture) {
 this.startAutoCapture();
 }
 }
 }

 // ===========================================================================
 // CAMERA MANAGEMENT
 // ===========================================================================
 private async openCamera() {
 if (this.disabled || this.loading || this.isOpen) return;

 this.localError ='';

 if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
 this.localError = this.msg.cameraUnavailable;
 return;
 }

 try {
 this.stream = await navigator.mediaDevices.getUserMedia({
 video: { facingMode: this.facing },
 });

 this.isOpen = true;
 await this.attachStream();

 if (this.autoCapture && !this.loading) {
 this.startAutoCapture();
 }

 this.dispatchEvent(
 new CustomEvent('open', {
 bubbles: true,
 composed: true,
 detail: {},
 })
 );
 } catch (e) {
 this.localError = this.msg.permissionDenied;
 }
 }

 private async attachStream() {
 if (!this.stream || !this.videoEl) return;
 this.videoEl.srcObject = this.stream;
 try {
 await this.videoEl.play();
 } catch {
 this.localError = this.msg.permissionDenied;
 }
 }

 private closeCamera() {
 if (!this.isOpen) return;
 this.stopAutoCapture();
 this.stopCamera();
 this.isOpen = false;

 this.dispatchEvent(
 new CustomEvent('close', {
 bubbles: true,
 composed: true,
 detail: {},
 })
 );
 }

 private stopCamera() {
 if (this.stream) {
 this.stream.getTracks().forEach((t) => t.stop());
 this.stream = null;
 }
 }

 private startAutoCapture() {
 this.stopAutoCapture();
 if (!this.isOpen || this.loading) return;
 this.captureTimer = window.setInterval(() => {
 this.captureFrame();
 }, Math.max(200, this.captureInterval));
 }

 private stopAutoCapture() {
 if (this.captureTimer !== null) {
 window.clearInterval(this.captureTimer);
 this.captureTimer = null;
 }
 }

 private captureFrame() {
 if (this.loading || !this.isOpen || !this.videoEl || !this.canvasEl) return;

 const video = this.videoEl;
 const canvas = this.canvasEl;
 const width = video.videoWidth || 640;
 const height = video.videoHeight || 480;

 canvas.width = width;
 canvas.height = height;

 const ctx = canvas.getContext('2d');
 if (!ctx) return;

 ctx.drawImage(video, 0, 0, width, height);
 const image = canvas.toDataURL('image/png');

 this.isCapturing = true;
 setTimeout(() => (this.isCapturing = false), 250);

 this.dispatchEvent(
 new CustomEvent('capture', {
 bubbles: true,
 composed: true,
 detail: { image },
 })
 );
 }

 // ===========================================================================
 // EVENT HANDLERS
 // ===========================================================================
 private handleTriggerClick() {
 if (this.disabled || this.loading) return;
 this.openCamera();
 }

 private handleTriggerKey(e: KeyboardEvent) {
 if (this.disabled || this.loading) return;
 if (e.key ==='Enter' || e.key ==='') {
 e.preventDefault();
 this.openCamera();
 }
 }

 private handleCaptureClick() {
 if (this.disabled || this.loading) return;
 this.captureFrame();
 }

 private handleRootKey(e: KeyboardEvent) {
 if (e.key ==='Escape') {
 this.closeCamera();
 }
 }

 // ===========================================================================
 // RENDER HELPERS
 // ===========================================================================
 private renderLabel(): TemplateResult {
 if (!this.hasSlot('Label')) return html``;
 return html`
 <div class="${cn('mb-2 text-sm font-medium ml-text-muted', this.getSlotClass('Label'))}">
 ${unsafeHTML(this.getSlotContent('Label'))}
 </div>
 `;
 }

 private renderHelper(): TemplateResult {
 if (!this.hasSlot('Helper')) return html``;
 return html`
 <div class="${cn('mt-2 text-xs ml-text-muted', this.getSlotClass('Helper'))}">
 ${unsafeHTML(this.getSlotContent('Helper'))}
 </div>
 `;
 }

 private renderError(): TemplateResult {
 const err = this.error || this.localError;
 if (!err) return html``;
 return html`
 <div
 id="error-text"
 class="mt-2 text-xs ml-error-text"
 role="status"
 >
 ${err}
 </div>
 `;
 }

 private renderTrigger(): TemplateResult {
 const hasCustom = this.hasSlot('Trigger');
 const triggerClasses = [
'w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm border transition',
'ml-surface-bg',
'ml-text',
'ml-border',
'hover:ml-surface-dim-bg',
 this.disabled ?'ml-disabled' :'cursor-pointer',
 ]
 .filter(Boolean)
 .join(' ');

 return html`
 <div
 class=${triggerClasses}
 role="button"
 tabindex=${this.disabled ? -1 : 0}
 aria-label=${this.msg.openCamera}
 @click=${this.handleTriggerClick}
 @keydown=${this.handleTriggerKey}
 >
 ${hasCustom
 ? unsafeHTML(this.getSlotContent('Trigger'))
 : html`<span>${this.msg.openCamera}</span>`}
 </div>
 `;
 }

 private renderResult(): TemplateResult {
 const hasCustom = this.hasSlot('Result');
 return html`
 <div
 class="w-full rounded-lg border ml-border ml-surface-bg p-4"
 aria-live="polite"
 >
 <div class="text-xs uppercase tracking-wide ml-text-muted mb-1">
 ${this.msg.resultLabel}
 </div>
 ${hasCustom
 ? unsafeHTML(this.getSlotContent('Result'))
 : html`<div class="text-sm ml-text">${this.value}</div>`}
 </div>
 `;
 }

 private renderCamera(): TemplateResult {
 const captureButtonClasses = [
'mt-3 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm border transition',
'ml-surface-bg',
'ml-text',
'ml-border',
'hover:ml-surface-dim-bg',
 this.loading ?'ml-disabled' :'cursor-pointer',
 ]
 .filter(Boolean)
 .join(' ');

 return html`
 <div class="relative w-full overflow-hidden rounded-lg border ml-border ml-surface-dim-bg">
 <video
 class="w-full h-64 object-cover"
 autoplay
 playsinline
 aria-hidden="true"
 ></video>

 <div
 class="pointer-events-none absolute inset-6 rounded-lg border-2 border-dashed ml-border-focus"
 ></div>

 ${this.isCapturing
 ? html`<div class="absolute inset-0 ml-capture-flash"></div>`
 : html``}
 </div>

 <div class="mt-3 flex items-center gap-3">
 <button
 class=${captureButtonClasses}
 aria-label=${this.msg.capture}
 @click=${this.handleCaptureClick}
 ?disabled=${this.loading}
 >
 ${this.msg.capture}
 </button>

 <button
 class="text-xs ml-text-muted hover:underline"
 @click=${this.closeCamera}
 aria-label=${this.msg.close}
 >
 ${this.msg.close}
 </button>
 </div>

 <canvas class="hidden" aria-hidden="true"></canvas>
 `;
 }

 private renderLoading(): TemplateResult {
 return html`
 <div class="mt-2 text-xs ml-text-muted">
 ${this.msg.loading}
 </div>
 `;
 }

 // ===========================================================================
 // RENDER
 // ===========================================================================
 render() {
 const lang = this.getMessageKey(messages);
 this.msg = messages[lang];

 const rootClasses = [
'w-full flex flex-col',
 this.disabled ?'opacity-50' :'',
 ]
 .filter(Boolean)
 .join(' ');

 const hasResult = !!this.value;

 return html`
 <div class=${cn(rootClasses, this.cssClass)} @keydown=${this.handleRootKey}>
 ${this.renderLabel()}

 ${hasResult
 ? this.renderResult()
 : this.isOpen
 ? this.renderCamera()
 : this.renderTrigger()}

 ${this.loading ? this.renderLoading() : nothing}

 ${this.renderHelper()}
 ${this.renderError()}

 ${this.name
 ? html`<input type="hidden" name=${this.name} .value=${this.value ??''} />`
 : nothing}
 </div>
 `;
 }
}
