/// <mls fileReference="_102040_/l2/molecules/groupplaymedia/ml-pdf-viewer.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// PDF VIEWER MOLECULE
// =============================================================================
// Skill Group: groupPlayMedia
// This molecule does NOT contain business logic.

import { html, TemplateResult } from'lit';
import { customElement, state } from'lit/decorators.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';
import { unsafeHTML } from'lit/directives/unsafe-html.js';

/// **collab_i18n_start**
const message_en = {
 loading:'Loading document...',
 error:'Failed to load document',
 noSource:'No document source provided',
 page:'Page',
 of:'of',
 previousPage:'Previous page',
 nextPage:'Next page',
 zoomIn:'Zoom in',
 zoomOut:'Zoom out',
 fitWidth:'Fit to width',
 goToPage:'Go to page',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
 en: message_en,
 pt: {
 loading:'Carregando documento...',
 error:'Falha ao carregar documento',
 noSource:'Nenhuma fonte de documento fornecida',
 page:'Página',
 of:'de',
 previousPage:'Página anterior',
 nextPage:'Próxima página',
 zoomIn:'Aumentar zoom',
 zoomOut:'Diminuir zoom',
 fitWidth:'Ajustar à largura',
 goToPage:'Ir para página',
 },
};
/// **collab_i18n_end**

interface SourceInfo {
 src: string;
 type: string;
}

@customElement('groupplaymedia--ml-pdf-viewer')
export class MlPdfViewerMolecule extends MoleculeAuraElement {
 private msg: MessageType = messages.en;

 // ===========================================================================
 // SLOT TAGS
 // ===========================================================================
 slotTags = ['Label','Source','Track'];

 // ===========================================================================
 // PROPERTIES — From Contract
 // ===========================================================================
 @propertyDataSource({ type: Boolean })
 disabled = false;

 @propertyDataSource({ type: Boolean })
 loading = false;

 @propertyDataSource({ type: Boolean })
 autoplay = false;

 @propertyDataSource({ type: Boolean })
 loop = false;

 @propertyDataSource({ type: Boolean })
 muted = false;

 @propertyDataSource({ type: String })
 preload: string ='metadata';

 @propertyDataSource({ type: String })
 poster: string ='';

 // ===========================================================================
 // INTERNAL STATE
 // ===========================================================================
 @state()
 private currentPage: number = 1;

 @state()
 private totalPages: number = 0;

 @state()
 private scale: number = 1;

 @state()
 private fitToWidth: boolean = false;

 @state()
 private hasError: boolean = false;

 @state()
 private errorMessage: string ='';

 @state()
 private documentSrc: string ='';

 @state()
 private isScaleIncreasing: boolean = true;

 // ===========================================================================
 // LIFECYCLE
 // ===========================================================================
 firstUpdated() {
 this.initializeDocument();
 this.setupKeyboardListeners();
 }

 disconnectedCallback() {
 super.disconnectedCallback();
 this.removeKeyboardListeners();
 }

 // ===========================================================================
 // INITIALIZATION
 // ===========================================================================
 private initializeDocument() {
 const sources = this.getSlots('Source').map(el => ({
 src: el.getAttribute('src') ||'',
 type: el.getAttribute('type') ||'',
 }));

 const validSource = sources.find(s => s.src.trim() !=='');

 if (!validSource) {
 this.hasError = true;
 this.errorMessage = this.msg.noSource;
 this.dispatchErrorEvent(this.msg.noSource);
 return;
 }

 this.documentSrc = validSource.src;
 this.totalPages = 10; // Simulated total pages
 this.currentPage = 1;
 }

 // ===========================================================================
 // KEYBOARD HANDLING
 // ===========================================================================
 private keyboardHandler = (e: KeyboardEvent) => {
 if (this.disabled || this.loading || this.hasError) return;

 switch (e.key) {
 case'ArrowLeft':
 e.preventDefault();
 this.goToPreviousPage();
 break;
 case'ArrowRight':
 e.preventDefault();
 this.goToNextPage();
 break;
 case'ArrowUp':
 e.preventDefault();
 this.increaseScale();
 break;
 case'ArrowDown':
 e.preventDefault();
 this.decreaseScale();
 break;
 case'':
 e.preventDefault();
 this.toggleScaleDirection();
 break;
 }
 };

 private setupKeyboardListeners() {
 this.addEventListener('keydown', this.keyboardHandler);
 this.setAttribute('tabindex','0');
 }

 private removeKeyboardListeners() {
 this.removeEventListener('keydown', this.keyboardHandler);
 }

 // ===========================================================================
 // NAVIGATION HANDLERS
 // ===========================================================================
 private goToPreviousPage() {
 if (this.disabled || this.loading || this.currentPage <= 1) return;
 this.currentPage--;
 this.dispatchTimeUpdateEvent();
 }

 private goToNextPage() {
 if (this.disabled || this.loading || this.currentPage >= this.totalPages) return;
 this.currentPage++;
 this.dispatchTimeUpdateEvent();
 }

 private goToPage(page: number) {
 if (this.disabled || this.loading) return;
 if (page < 1 || page > this.totalPages) return;
 this.currentPage = page;
 this.dispatchTimeUpdateEvent();
 }

 private handleSliderChange(e: Event) {
 const input = e.target as HTMLInputElement;
 const page = parseInt(input.value, 10);
 this.goToPage(page);
 }

 private handlePageInputChange(e: Event) {
 const input = e.target as HTMLInputElement;
 const page = parseInt(input.value, 10);
 if (!isNaN(page)) {
 this.goToPage(page);
 }
 }

 // ===========================================================================
 // SCALE HANDLERS
 // ===========================================================================
 private increaseScale() {
 if (this.disabled || this.loading) return;
 this.fitToWidth = false;
 this.scale = Math.min(this.scale + 0.25, 3);
 this.dispatchPlayEvent();
 }

 private decreaseScale() {
 if (this.disabled || this.loading) return;
 this.fitToWidth = false;
 this.scale = Math.max(this.scale - 0.25, 0.5);
 this.dispatchPauseEvent();
 }

 private toggleFitToWidth() {
 if (this.disabled || this.loading) return;
 this.fitToWidth = !this.fitToWidth;
 if (this.fitToWidth) {
 this.scale = 1;
 }
 this.dispatchEndedEvent();
 }

 private toggleScaleDirection() {
 if (this.isScaleIncreasing) {
 this.increaseScale();
 } else {
 this.decreaseScale();
 }
 this.isScaleIncreasing = !this.isScaleIncreasing;
 }

 // ===========================================================================
 // EVENT DISPATCHERS
 // ===========================================================================
 private dispatchTimeUpdateEvent() {
 this.dispatchEvent(new CustomEvent('timeUpdate', {
 bubbles: true,
 composed: true,
 detail: { currentTime: this.currentPage, duration: this.totalPages }
 }));
 }

 private dispatchPlayEvent() {
 this.dispatchEvent(new CustomEvent('play', {
 bubbles: true,
 composed: true,
 detail: {}
 }));
 }

 private dispatchPauseEvent() {
 this.dispatchEvent(new CustomEvent('pause', {
 bubbles: true,
 composed: true,
 detail: {}
 }));
 }

 private dispatchEndedEvent() {
 this.dispatchEvent(new CustomEvent('ended', {
 bubbles: true,
 composed: true,
 detail: {}
 }));
 }

 private dispatchErrorEvent(message: string) {
 this.dispatchEvent(new CustomEvent('error', {
 bubbles: true,
 composed: true,
 detail: { message }
 }));
 }

 // ===========================================================================
 // CSS CLASSES
 // ===========================================================================
 private getContainerClasses(): string {
 return [
'flex flex-col w-full rounded-lg border overflow-hidden',
'ml-surface-bg',
'ml-border',
 this.disabled ?'opacity-50' :'',
 ].filter(Boolean).join(' ');
 }

 private getToolbarClasses(): string {
 return [
'flex items-center justify-between gap-2 px-3 py-2 border-b',
'ml-surface-dim-bg',
'ml-border',
 ].join(' ');
 }

 private getButtonClasses(isDisabled: boolean): string {
 return [
'flex items-center justify-center w-8 h-8 rounded-md transition',
'ml-text-muted',
'border ml-border',
 isDisabled
 ?'ml-disabled ml-surface-dim-bg'
 :'hover:ml-surface-dim-bg cursor-pointer ml-surface-bg',
'',
 ].filter(Boolean).join(' ');
 }

 private getActiveButtonClasses(isActive: boolean): string {
 return [
'flex items-center justify-center w-8 h-8 rounded-md transition',
'border',
 isActive
 ?'ml-primary-dim-bg ml-primary-text ml-border-focus'
 :'ml-text-muted ml-border ml-surface-bg',
 this.disabled || this.loading
 ?'ml-disabled'
 :'hover:ml-surface-dim-bg cursor-pointer',
'',
 ].filter(Boolean).join(' ');
 }

 private getViewerClasses(): string {
 return [
'flex-1 flex items-center justify-center min-h-[400px] overflow-auto',
'ml-surface-dim-bg',
 ].join(' ');
 }

 private getPageInputClasses(): string {
 return [
'w-12 text-center text-sm rounded-md border px-1 py-1',
'ml-surface-bg',
'ml-text',
'ml-border',
'',
 this.disabled || this.loading ?'ml-disabled' :'',
 ].filter(Boolean).join(' ');
 }

 private getSliderClasses(): string {
 return [
'flex-1 h-2 rounded-full appearance-none cursor-pointer',
'ml-surface-dim-bg',
 this.disabled || this.loading ?'ml-disabled' :'',
 ].filter(Boolean).join(' ');
 }

 private getLoadingOverlayClasses(): string {
 return [
'absolute inset-0 flex items-center justify-center',
'ml-surface-bg/80',
 ].join(' ');
 }

 private getErrorClasses(): string {
 return [
'flex flex-col items-center justify-center gap-4 p-8',
'ml-error-text',
 ].join(' ');
 }

 // ===========================================================================
 // RENDER METHODS
 // ===========================================================================
 private renderLabel(): TemplateResult {
 if (!this.hasSlot('Label')) return html``;
 const labelContent = this.getSlotContent('Label');
 return html`
 <div class="${cn('px-3 py-2 text-sm font-medium ml-text border-b ml-border', this.getSlotClass('Label'))}">
 ${unsafeHTML(labelContent)}
 </div>
 `;
 }

 private renderNavigationControls(): TemplateResult {
 const isPrevDisabled = this.disabled || this.loading || this.currentPage <= 1;
 const isNextDisabled = this.disabled || this.loading || this.currentPage >= this.totalPages;

 return html`
 <div class="flex items-center gap-1">
 <button
 type="button"
 class=${this.getButtonClasses(isPrevDisabled)}
 ?disabled=${isPrevDisabled}
 @click=${this.goToPreviousPage}
 aria-label=${this.msg.previousPage}
 >
 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
 </svg>
 </button>
 <button
 type="button"
 class=${this.getButtonClasses(isNextDisabled)}
 ?disabled=${isNextDisabled}
 @click=${this.goToNextPage}
 aria-label=${this.msg.nextPage}
 >
 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
 </svg>
 </button>
 </div>
 `;
 }

 private renderPageIndicator(): TemplateResult {
 return html`
 <div class="flex items-center gap-2 text-sm ml-text-muted">
 <span>${this.msg.page}</span>
 <input
 type="number"
 class=${this.getPageInputClasses()}
 .value=${String(this.currentPage)}
 min="1"
 max=${this.totalPages}
 ?disabled=${this.disabled || this.loading}
 @change=${this.handlePageInputChange}
 aria-label=${this.msg.goToPage}
 />
 <span>${this.msg.of} ${this.totalPages}</span>
 </div>
 `;
 }

 private renderScaleControls(): TemplateResult {
 const isScaleDisabled = this.disabled || this.loading;

 return html`
 <div class="flex items-center gap-1">
 <button
 type="button"
 class=${this.getButtonClasses(isScaleDisabled || this.scale <= 0.5)}
 ?disabled=${isScaleDisabled || this.scale <= 0.5}
 @click=${this.decreaseScale}
 aria-label=${this.msg.zoomOut}
 >
 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
 </svg>
 </button>
 <span class="text-sm ml-text-muted min-w-[3rem] text-center">
 ${Math.round(this.scale * 100)}%
 </span>
 <button
 type="button"
 class=${this.getButtonClasses(isScaleDisabled || this.scale >= 3)}
 ?disabled=${isScaleDisabled || this.scale >= 3}
 @click=${this.increaseScale}
 aria-label=${this.msg.zoomIn}
 >
 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
 </svg>
 </button>
 <button
 type="button"
 class=${this.getActiveButtonClasses(this.fitToWidth)}
 ?disabled=${isScaleDisabled}
 @click=${this.toggleFitToWidth}
 aria-label=${this.msg.fitWidth}
 >
 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
 </svg>
 </button>
 </div>
 `;
 }

 private renderToolbar(): TemplateResult {
 return html`
 <div class=${this.getToolbarClasses()}>
 ${this.renderNavigationControls()}
 ${this.renderPageIndicator()}
 ${this.renderScaleControls()}
 </div>
 `;
 }

 private renderProgressBar(): TemplateResult {
 return html`
 <div class="px-3 py-2 border-t ml-border ml-surface-dim-bg">
 <input
 type="range"
 class=${this.getSliderClasses()}
 min="1"
 max=${this.totalPages}
 .value=${String(this.currentPage)}
 ?disabled=${this.disabled || this.loading}
 @input=${this.handleSliderChange}
 role="slider"
 aria-valuenow=${this.currentPage}
 aria-valuemin="1"
 aria-valuemax=${this.totalPages}
 aria-label="${this.msg.page} ${this.currentPage} ${this.msg.of} ${this.totalPages}"
 />
 </div>
 `;
 }

 private renderDocumentViewer(): TemplateResult {
 const scaleStyle = this.fitToWidth ?'width: 100%;' : `transform: scale(${this.scale}); transform-origin: top center;`;

 return html`
 <div class=${this.getViewerClasses()}>
 <div class="relative" style=${scaleStyle}>
 <iframe
 src=${this.documentSrc}
 class="w-full h-[600px] border-0"
 title=${this.hasSlot('Label') ? this.getSlotContent('Label') :'Document viewer'}
 ></iframe>
 </div>
 </div>
 `;
 }

 private renderLoading(): TemplateResult {
 return html`
 <div class=${this.getLoadingOverlayClasses()}>
 <div class="flex flex-col items-center gap-3">
 <div class="w-8 h-8 border-2 ml-border-focus border-t-transparent rounded-full animate-spin"></div>
 <span class="text-sm ml-text-muted">${this.msg.loading}</span>
 </div>
 </div>
 `;
 }

 private renderError(): TemplateResult {
 return html`
 <div class=${this.getErrorClasses()}>
 <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
 </svg>
 <span class="text-sm font-medium">${this.errorMessage || this.msg.error}</span>
 </div>
 `;
 }

 // ===========================================================================
 // RENDER
 // ===========================================================================
 render() {
 const lang = this.getMessageKey(messages);
 this.msg = messages[lang];

 const labelContent = this.hasSlot('Label') ? this.getSlotContent('Label') :'';

 return html`
 <div
 class=${cn(this.getContainerClasses(), this.cssClass)}
 role="document"
 aria-label=${labelContent ||'PDF Viewer'}
 >
 ${this.renderLabel()}
 ${this.hasError ? html`` : this.renderToolbar()}
 <div class="relative flex-1">
 ${this.hasError
 ? this.renderError()
 : this.renderDocumentViewer()
 }
 ${this.loading && !this.hasError ? this.renderLoading() : html``}
 </div>
 ${this.hasError ? html`` : this.renderProgressBar()}
 </div>
 `;
 }
}
