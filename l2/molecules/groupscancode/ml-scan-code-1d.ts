/// <mls fileReference="_102040_/l2/molecules/groupscancode/ml-scan-code-1d.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML SCAN CODE 1D MOLECULE
// =============================================================================
// Skill Group: groupScanCode
// This molecule does NOT contain business logic.
import { html, TemplateResult } from'lit';
import { customElement, state, query } from'lit/decorators.js';
import { unsafeHTML } from'lit/directives/unsafe-html.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';
/// **collab_i18n_start**
const message_en = {
open:'Open camera scanner',
capture:'Capture',
close:'Close',
processing:'Processing...',
noResult:'No result',
permissionDenied:'Camera permission denied',
notSupported:'Camera not supported on this device',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
};
/// **collab_i18n_end**
@customElement('groupscancode--ml-scan-code-1d')
export class MlScanCode1dMolecule extends MoleculeAuraElement {
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
private isCapturing: boolean = false;
@state()
private hasSupport: boolean = true;
@state()
private lastEmittedValue: string | null = null;
@query('video')
private videoEl!: HTMLVideoElement;
private stream: MediaStream | null = null;
private autoCaptureTimer: number | null = null;
// ===========================================================================
// LIFECYCLE
// ===========================================================================
disconnectedCallback() {
super.disconnectedCallback();
this.stopCamera();
this.stopAutoCapture();
}
updated(changed: Map<string, unknown>) {
if (changed.has('autoCapture') || changed.has('captureInterval') || changed.has('isOpen')) {
this.handleAutoCaptureState();
}
if (changed.has('disabled') && this.disabled) {
this.closeCamera();
}
if (changed.has('value')) {
this.emitValueChange(this.value);
if (this.value && this.isOpen) {
this.closeCamera();
}
}
}
// ===========================================================================
// STATE CHANGE HANDLER
// ===========================================================================
handleIcaStateChange(key: string, value: any) {
const valueAttr = this.getAttribute('value');
if (valueAttr === `{{${key}}}`) {
this.emitValueChange(value as string | null);
if (value && this.isOpen) {
this.closeCamera();
}
}
this.requestUpdate();
}
// ===========================================================================
// EVENT HELPERS
// ===========================================================================
private emitValueChange(value: string | null) {
if (value === this.lastEmittedValue) return;
this.lastEmittedValue = value;
this.dispatchEvent(new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value },
}));
}
private emitCapture(image: string) {
this.dispatchEvent(new CustomEvent('capture', {
bubbles: true,
composed: true,
detail: { image },
}));
}
private emitDetect(format: string, value: string) {
this.dispatchEvent(new CustomEvent('detect', {
bubbles: true,
composed: true,
detail: { format, value },
}));
}
private emitOpen() {
this.dispatchEvent(new CustomEvent('open', {
bubbles: true,
composed: true,
detail: {},
}));
}
private emitClose() {
this.dispatchEvent(new CustomEvent('close', {
bubbles: true,
composed: true,
detail: {},
}));
}
// ===========================================================================
// CAMERA CONTROLS
// ===========================================================================
private async openCamera() {
if (this.disabled || this.loading || this.isOpen) return;
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
this.hasSupport = false;
this.error = this.msg.notSupported;
return;
}
try {
const stream = await navigator.mediaDevices.getUserMedia({
video: { facingMode: this.facing ||'environment' },
});
this.stream = stream;
this.isOpen = true;
this.hasSupport = true;
this.error ='';
this.emitOpen();
if (this.videoEl) {
this.videoEl.srcObject = stream;
await this.videoEl.play();
}
} catch (err) {
this.error = this.msg.permissionDenied;
}
}
private closeCamera() {
if (!this.isOpen) return;
this.stopCamera();
this.isOpen = false;
this.emitClose();
}
private stopCamera() {
if (this.stream) {
this.stream.getTracks().forEach((t) => t.stop());
this.stream = null;
}
if (this.videoEl) {
this.videoEl.pause();
this.videoEl.srcObject = null;
}
}
// ===========================================================================
// CAPTURE FLOW
// ===========================================================================
private handleAutoCaptureState() {
if (!this.isOpen || !this.autoCapture || this.disabled) {
this.stopAutoCapture();
return;
}
if (this.autoCaptureTimer !== null) {
this.stopAutoCapture();
}
const interval = Math.max(200, this.captureInterval || 500);
this.autoCaptureTimer = window.setInterval(() => {
if (!this.isOpen || this.loading || this.disabled) return;
this.captureFrame();
}, interval);
}
private stopAutoCapture() {
if (this.autoCaptureTimer !== null) {
window.clearInterval(this.autoCaptureTimer);
this.autoCaptureTimer = null;
}
}
private async captureFrame() {
if (!this.videoEl || !this.isOpen) return;
const canvas = document.createElement('canvas');
const width = this.videoEl.videoWidth || 640;
const height = this.videoEl.videoHeight || 480;
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');
if (!ctx) return;
ctx.drawImage(this.videoEl, 0, 0, width, height);
const dataUrl = canvas.toDataURL('image/png');
this.emitCapture(dataUrl);
this.flashCapture();
await this.tryLocalDecode(canvas);
}
private flashCapture() {
this.isCapturing = true;
window.setTimeout(() => {
this.isCapturing = false;
}, 180);
}
private async tryLocalDecode(canvas: HTMLCanvasElement) {
const Detector = (window as any).BarcodeDetector as any;
if (!Detector) return;
try {
const formats = ['ean_13','ean_8','upc_a','code_128','code_39','itf'];
const detector = new Detector({ formats });
const results = await detector.detect(canvas);
if (results && results.length > 0) {
const result = results[0];
if (result.rawValue && result.format) {
this.value = result.rawValue;
this.emitDetect(result.format, result.rawValue);
this.emitValueChange(result.rawValue);
this.closeCamera();
}
}
} catch (err) {
// silent: local decoding is optional
}
}
// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleTriggerClick() {
if (this.isOpen) {
this.closeCamera();
} else {
this.openCamera();
}
}
private handleTriggerKeydown(event: KeyboardEvent) {
if (event.key ==='Enter' || event.key ==='') {
event.preventDefault();
this.handleTriggerClick();
}
}
private handleCloseKeydown(event: KeyboardEvent) {
if (event.key ==='Escape') {
this.closeCamera();
}
}
// ===========================================================================
// RENDER HELPERS
// ===========================================================================
private renderLabel(): TemplateResult {
if (!this.hasSlot('Label')) return html``;
return html`<div class="${cn('mb-2 text-sm ml-text-muted', this.getSlotClass('Label'))}">${unsafeHTML(this.getSlotContent('Label'))}</div>`;
}
private renderHelper(): TemplateResult {
if (!this.hasSlot('Helper')) return html``;
return html`<div class="${cn('mt-2 text-xs ml-text-muted', this.getSlotClass('Helper'))}">${unsafeHTML(this.getSlotContent('Helper'))}</div>`;
}
private renderError(): TemplateResult {
if (!this.error) return html``;
return html`<div class="mt-2 text-xs ml-error-text" role="alert">${unsafeHTML(String(this.error))}</div>`;
}
private renderResult(): TemplateResult {
if (!this.value) return html``;
if (this.hasSlot('Result')) {
return html`<div class="mt-3">${unsafeHTML(this.getSlotContent('Result'))}</div>`;
}
return html`
<div class="mt-3 rounded-lg border ml-border ml-surface-dim-bg px-3 py-2 text-sm ml-text" aria-live="polite">
${this.value}
</div>
`;
}
private renderTriggerContent(): TemplateResult {
if (this.hasSlot('Trigger')) {
return html`${unsafeHTML(this.getSlotContent('Trigger'))}`;
}
return html`<span>${this.isOpen ? this.msg.close : this.msg.open}</span>`;
}
private getFrameClasses(): string {
return [
'relative w-full rounded-xl border transition',
'ml-surface-bg',
this.error ?'ml-border-error' :'ml-border',
this.isCapturing ?'ml-focus-ring' :'',
this.disabled ?'ml-disabled' :'',
].filter(Boolean).join(' ');
}
private getVideoWrapperClasses(): string {
return [
'relative w-full overflow-hidden rounded-lg border',
'ml-border',
'ml-surface-dim-bg',
this.isOpen ?'block' :'hidden',
].filter(Boolean).join(' ');
}
private getTriggerClasses(): string {
return [
'inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm transition',
'ml-border',
'ml-surface-bg',
'ml-text',
'hover:ml-surface-dim-bg',
'',
this.disabled ?'ml-disabled' :'',
].filter(Boolean).join(' ');
}
private getCaptureButtonClasses(): string {
return [
'inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm transition',
'ml-border-focus',
'ml-primary-dim-bg',
'ml-primary-text',
'hover:ml-surface-dim-bg',
'',
this.loading ?'ml-disabled' :'',
].filter(Boolean).join(' ');
}
// ===========================================================================
// RENDER
// ===========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];
const hasResult = Boolean(this.value);
return html`
<div class="${cn('w-full', this.cssClass)}" @keydown=${this.handleCloseKeydown}>
${this.renderLabel()}
<div class=${this.getFrameClasses()}>
<div class="flex items-center justify-between px-4 py-3">
<button
class=${this.getTriggerClasses()}
role="button"
aria-label=${this.msg.open}
?disabled=${this.disabled}
@click=${this.handleTriggerClick}
@keydown=${this.handleTriggerKeydown}
>
${this.renderTriggerContent()}
</button>
${this.isOpen ? html`
<button
class=${this.getCaptureButtonClasses()}
aria-label=${this.msg.capture}
?disabled=${this.loading}
@click=${this.captureFrame}
>
${this.msg.capture}
</button>
` : html``}
</div>
<div class=${this.getVideoWrapperClasses()} aria-hidden="true">
<video class="w-full h-64 object-cover"></video>
</div>
${this.loading ? html`
<div class="px-4 py-3 text-sm ml-text-muted">
${this.msg.processing}
</div>
` : html``}
${!this.isOpen && hasResult ? this.renderResult() : html``}
${!this.isOpen && !hasResult && !this.loading ? html`
<div class="px-4 pb-3 text-xs ml-text-faint">${this.msg.noResult}</div>
` : html``}
</div>
${this.renderError()}
${this.renderHelper()}
${this.name ? html`<input type="hidden" name=${this.name} .value=${this.value ??''} />` : html``}
</div>
`;
}
}
