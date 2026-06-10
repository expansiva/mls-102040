/// <mls fileReference="_102040_/l2/molecules/groupscancode/ml-scan-document.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML SCAN DOCUMENT MOLECULE
// =============================================================================
// Skill Group: groupScanCode
// This molecule does NOT contain business logic.
import { html, svg, TemplateResult } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
/// **collab_i18n_start**
const message_en = {
openCamera: 'Open camera scanner',
capture: 'Capture',
loading: 'Processing...',
result: 'Scan result',
permissionDenied: 'Camera permission denied',
cameraUnavailable: 'Camera unavailable',
noResult: 'No result yet',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
pt: {
openCamera: 'Abrir câmera',
capture: 'Capturar',
loading: 'Processando...',
result: 'Resultado da leitura',
permissionDenied: 'Permissão de câmera negada',
cameraUnavailable: 'Câmera indisponível',
noResult: 'Nenhum resultado',
},
};
/// **collab_i18n_end**

type CornerPoint = { x: number; y: number };

@customElement('groupscancode--ml-scan-document')
export class MlScanDocumentMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
// ===========================================================================
// SLOT TAGS
// ===========================================================================
slotTags = ['Label', 'Helper', 'Trigger', 'Result'];
// ===========================================================================
// PROPERTIES — From Contract
// ===========================================================================
@propertyDataSource({ type: String })
value: string | null = null;
@propertyDataSource({ type: String })
error: string = '';
@propertyDataSource({ type: String })
name: string = '';
@propertyDataSource({ type: String })
facing: string = 'environment';
@propertyDataSource({ type: Boolean, attribute: 'auto-capture' })
autoCapture: boolean = false;
@propertyDataSource({ type: Number, attribute: 'capture-interval' })
captureInterval: number = 500;
@propertyDataSource({ type: Boolean })
disabled: boolean = false;
@propertyDataSource({ type: Boolean })
loading: boolean = false;
// ===========================================================================
// INTERNAL STATE
// ===========================================================================
@state()
private isOpen = false;
@state()
private corners: CornerPoint[] = [];
@state()
private manualOverride = false;
@state()
private isCapturing = false;
@state()
private videoReady = false;

@query('video')
private videoEl?: HTMLVideoElement;
@query('.ml-scan-overlay')
private overlayEl?: HTMLDivElement;

private stream: MediaStream | null = null;
private detectionTimer: number | null = null;
private autoCaptureTimer: number | null = null;
private draggingIndex: number | null = null;
private errorId = `scan-error-${Math.random().toString(36).slice(2, 8)}`;

private boundPointerMove = (event: PointerEvent) => this.handlePointerMove(event);
private boundPointerUp = () => this.handlePointerUp();
private boundEscape = (event: KeyboardEvent) => this.handleEscapeKey(event);

// ===========================================================================
// LIFECYCLE
// ===========================================================================
connectedCallback() {
super.connectedCallback();
if (this.isOpen) {
this.bindEscapeListener();
}
}

disconnectedCallback() {
super.disconnectedCallback();
this.closeCamera();
}

updated(changed: Map<string, unknown>) {
if (changed.has('value')) {
this.dispatchEvent(
new CustomEvent('change', {
bubbles: true,
composed: true,
detail: { value: this.value },
}),
);
if (this.value && this.isOpen) {
this.closeCamera();
}
}
if (changed.has('disabled') && this.disabled && this.isOpen) {
this.closeCamera();
}
if (changed.has('autoCapture') || changed.has('captureInterval') || changed.has('isOpen')) {
this.setupAutoCapture();
}
}

// ===========================================================================
// CAMERA CONTROLS
// ===========================================================================
private async openCamera() {
if (this.disabled || this.loading || this.isOpen) return;
this.error = '';
try {
this.stream = await navigator.mediaDevices.getUserMedia({
video: { facingMode: this.facing },
});
this.isOpen = true;
this.videoReady = false;
this.manualOverride = false;
this.setDefaultCorners();
const video = this.videoEl;
if (video) {
video.srcObject = this.stream;
video.onloadedmetadata = () => {
this.videoReady = true;
video.play();
this.setDefaultCorners();
this.startDetectionLoop();
};
}
this.dispatchEvent(
new CustomEvent('open', { bubbles: true, composed: true, detail: {} }),
);
this.bindEscapeListener();
} catch (err: any) {
const name = String(err?.name || '');
this.error = name === 'NotAllowedError' ? this.msg.permissionDenied : this.msg.cameraUnavailable;
}
}

private closeCamera() {
if (this.stream) {
this.stream.getTracks().forEach((track) => track.stop());
}
this.stream = null;
this.isOpen = false;
this.videoReady = false;
this.isCapturing = false;
this.manualOverride = false;
this.stopDetectionLoop();
this.clearAutoCapture();
this.unbindEscapeListener();
this.dispatchEvent(
new CustomEvent('close', { bubbles: true, composed: true, detail: {} }),
);
}

private handleEscapeKey(event: KeyboardEvent) {
if (event.key === 'Escape' && this.isOpen) {
this.closeCamera();
}
}

private bindEscapeListener() {
document.addEventListener('keydown', this.boundEscape);
}

private unbindEscapeListener() {
document.removeEventListener('keydown', this.boundEscape);
}

// ===========================================================================
// CORNER DETECTION (SIMULATED)
// ===========================================================================
private startDetectionLoop() {
this.stopDetectionLoop();
this.detectionTimer = window.setInterval(() => {
if (!this.isOpen || this.manualOverride) return;
this.setDefaultCorners();
}, 1000);
}

private stopDetectionLoop() {
if (this.detectionTimer) {
window.clearInterval(this.detectionTimer);
}
this.detectionTimer = null;
}

private setDefaultCorners() {
this.corners = [
{ x: 0.08, y: 0.12 },
{ x: 0.92, y: 0.12 },
{ x: 0.92, y: 0.88 },
{ x: 0.08, y: 0.88 },
];
}

// ===========================================================================
// CAPTURE
// ===========================================================================
private async captureFrame() {
if (this.disabled || this.loading || !this.isOpen || !this.videoEl) return;
const video = this.videoEl;
if (!this.videoReady || video.videoWidth === 0 || video.videoHeight === 0) return;
const width = video.videoWidth;
const height = video.videoHeight;
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');
if (!ctx) return;
ctx.drawImage(video, 0, 0, width, height);
const bounds = this.getCornerBounds(width, height);
const output = document.createElement('canvas');
output.width = bounds.width;
output.height = bounds.height;
const outCtx = output.getContext('2d');
if (!outCtx) return;
outCtx.drawImage(canvas, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height);
const dataUrl = output.toDataURL('image/png');
this.isCapturing = true;
setTimeout(() => (this.isCapturing = false), 180);
this.dispatchEvent(
new CustomEvent('capture', {
bubbles: true,
composed: true,
detail: { image: dataUrl },
}),
);
}

private getCornerBounds(width: number, height: number) {
const xs = this.corners.map((c) => c.x * width);
const ys = this.corners.map((c) => c.y * height);
const minX = Math.max(0, Math.min(...xs));
const maxX = Math.min(width, Math.max(...xs));
const minY = Math.max(0, Math.min(...ys));
const maxY = Math.min(height, Math.max(...ys));
const boxWidth = Math.max(1, maxX - minX);
const boxHeight = Math.max(1, maxY - minY);
return { x: minX, y: minY, width: boxWidth, height: boxHeight };
}

private setupAutoCapture() {
this.clearAutoCapture();
if (!this.isOpen || !this.autoCapture || this.disabled) return;
this.autoCaptureTimer = window.setInterval(() => {
if (this.loading || this.disabled) return;
this.captureFrame();
}, Math.max(200, this.captureInterval));
}

private clearAutoCapture() {
if (this.autoCaptureTimer) {
window.clearInterval(this.autoCaptureTimer);
}
this.autoCaptureTimer = null;
}

// ===========================================================================
// CORNER DRAGGING
// ===========================================================================
private handleCornerPointerDown(index: number, event: PointerEvent) {
if (this.disabled || this.loading || !this.isOpen) return;
this.draggingIndex = index;
this.manualOverride = true;
window.addEventListener('pointermove', this.boundPointerMove);
window.addEventListener('pointerup', this.boundPointerUp);
(event.target as HTMLElement).setPointerCapture(event.pointerId);
}

private handlePointerMove(event: PointerEvent) {
if (this.draggingIndex === null || !this.overlayEl) return;
const rect = this.overlayEl.getBoundingClientRect();
const x = (event.clientX - rect.left) / rect.width;
const y = (event.clientY - rect.top) / rect.height;
const clamped = { x: Math.min(0.98, Math.max(0.02, x)), y: Math.min(0.98, Math.max(0.02, y)) };
const updated = [...this.corners];
updated[this.draggingIndex] = clamped;
this.corners = updated;
}

private handlePointerUp() {
this.draggingIndex = null;
window.removeEventListener('pointermove', this.boundPointerMove);
window.removeEventListener('pointerup', this.boundPointerUp);
}

// ===========================================================================
// RENDER HELPERS
// ===========================================================================
private getWrapperClasses(): string {
return [
'group relative w-full rounded-xl border p-4 transition',
'bg-white dark:bg-slate-800',
'border-slate-200 dark:border-slate-700',
this.disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100',
].filter(Boolean).join(' ');
}

private getViewfinderClasses(): string {
return [
'relative w-full overflow-hidden rounded-lg border',
'bg-slate-50 dark:bg-slate-900',
'border-slate-200 dark:border-slate-700',
].join(' ');
}

private getTriggerClasses(): string {
return [
'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition',
'bg-sky-600 text-white dark:bg-sky-500 dark:text-slate-950',
'hover:bg-sky-700 dark:hover:bg-sky-400',
'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
this.disabled ? 'opacity-50 cursor-not-allowed' : '',
].filter(Boolean).join(' ');
}

private getCaptureClasses(): string {
return [
'inline-flex items-center justify-center rounded-md px-3 py-2 text-xs font-semibold transition',
'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900',
'hover:bg-slate-700 dark:hover:bg-slate-200',
'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
(this.disabled || this.loading) ? 'opacity-50 cursor-not-allowed' : '',
].filter(Boolean).join(' ');
}

private getCornerHandleClasses(): string {
return [
'absolute h-4 w-4 rounded-full border-2 shadow',
'border-sky-500 dark:border-sky-400',
'bg-white dark:bg-slate-800',
'cursor-grab',
].join(' ');
}

private hasResult(): boolean {
return this.value !== null && this.value !== '';
}

private renderLabel(): TemplateResult {
if (!this.hasSlot('Label')) return html``;
return html`
<div class="mb-3 text-sm text-slate-600 dark:text-slate-400">
${unsafeHTML(this.getSlotContent('Label'))}
</div>
`;
}

private renderHelper(): TemplateResult {
if (!this.hasSlot('Helper')) return html``;
return html`
<div class="mt-3 text-xs text-slate-500 dark:text-slate-400">
${unsafeHTML(this.getSlotContent('Helper'))}
</div>
`;
}

private renderError(): TemplateResult {
if (!this.error) return html``;
return html`
<p id="${this.errorId}" class="mt-2 text-xs text-red-600 dark:text-red-400">
${unsafeHTML(String(this.error))}
</p>
`;
}

private renderTrigger(): TemplateResult {
const content = this.hasSlot('Trigger') ? unsafeHTML(this.getSlotContent('Trigger')) : this.msg.openCamera;
return html`
<button
class="${this.getTriggerClasses()}"
?disabled=${this.disabled}
role="button"
aria-label="${this.msg.openCamera}"
@keydown=${this.handleTriggerKeydown}
@click=${this.handleTriggerClick}
>
${content}
</button>
`;
}

private renderResult(): TemplateResult {
const content = this.hasSlot('Result')
? unsafeHTML(this.getSlotContent('Result'))
: unsafeHTML(this.value || this.msg.noResult);
return html`
<div class="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
<div class="text-xs text-slate-500 dark:text-slate-400 mb-2">${this.msg.result}</div>
<div class="text-sm text-slate-900 dark:text-slate-100" aria-live="polite">${content}</div>
</div>
`;
}

private renderViewfinder(): TemplateResult {
const points = this.corners.map((c) => `${c.x * 100},${c.y * 100}`).join(' ');
return html`
<div class="${this.getViewfinderClasses()}" aria-describedby=${this.error ? this.errorId : ''}>
<div class="relative aspect-[4/3] w-full">
<video
class="h-full w-full object-cover"
autoplay
playsinline
aria-hidden="true"
></video>
<div class="ml-scan-overlay absolute inset-0">
<svg viewBox="0 0 100 100" class="h-full w-full">
${svg`
<polygon
points="${points}"
fill="rgba(14, 165, 233, 0.08)"
stroke="rgba(14, 165, 233, 0.85)"
stroke-width="1.2"
/>
`}
</svg>
${this.corners.map((corner, index) => html`
<div
class="${this.getCornerHandleClasses()}"
style="left: calc(${corner.x * 100}% - 8px); top: calc(${corner.y * 100}% - 8px);"
@pointerdown=${(event: PointerEvent) => this.handleCornerPointerDown(index, event)}
></div>
`)}
</div>
${this.isCapturing ? html`<div class="absolute inset-0 bg-white/40 dark:bg-slate-950/40"></div>` : html``}
${this.loading ? html`
<div class="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-slate-900/70">
<div class="text-sm text-slate-600 dark:text-slate-300">${this.msg.loading}</div>
</div>
` : html``}
</div>
<div class="mt-3 flex items-center justify-between">
<button
class="${this.getCaptureClasses()}"
aria-label="${this.msg.capture}"
?disabled=${this.disabled || this.loading}
@click=${this.handleCaptureClick}
>
${this.msg.capture}
</button>
<button
class="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
@click=${this.handleCloseClick}
>
Close
</button>
</div>
</div>
`;
}

// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleTriggerClick() {
this.openCamera();
}

private handleTriggerKeydown(event: KeyboardEvent) {
if (event.key === 'Enter' || event.key === ' ') {
event.preventDefault();
this.openCamera();
}
}

private handleCaptureClick() {
this.captureFrame();
}

private handleCloseClick() {
this.closeCamera();
}

// ===========================================================================
// RENDER
// ===========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];
return html`
<div class="${this.getWrapperClasses()}">
${this.renderLabel()}
${this.hasResult() ? this.renderResult() : (this.isOpen ? this.renderViewfinder() : this.renderTrigger())}
${this.renderError()}
${this.renderHelper()}
</div>
`;
}
}
