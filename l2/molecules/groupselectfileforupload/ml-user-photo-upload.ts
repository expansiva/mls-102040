/// <mls fileReference="_102040_/l2/molecules/groupselectfileforupload/ml-user-photo-upload.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML USER PHOTO UPLOAD MOLECULE
// =============================================================================
// Skill Group: groupSelectFileForUpload
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
selectPhoto: 'Select a photo',
dropHere: 'or drag and drop',
loading: 'Loading...',
remove: 'Remove',
fileCount: 'Selected files',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
pt: {
selectPhoto: 'Selecione uma foto',
dropHere: 'ou arraste e solte',
loading: 'Carregando...',
remove: 'Remover',
fileCount: 'Arquivos selecionados',
},
};
/// **collab_i18n_end**

@customElement('groupselectfileforupload--ml-user-photo-upload')
export class MlUserPhotoUploadMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;

// ===========================================================================
// SLOT TAGS
// ===========================================================================
slotTags = ['Label', 'Helper', 'Trigger'];

// ===========================================================================
// PROPERTIES — From Contract
// ===========================================================================
@propertyDataSource({ type: Array })
value: File[] = [];

@propertyDataSource({ type: String })
error: string = '';

@propertyDataSource({ type: Boolean })
multiple = false;

@propertyDataSource({ type: String })
accept = '';

@propertyDataSource({ type: Number, attribute: 'max-size-kb' })
maxSizeKb = 0;

@propertyDataSource({ type: Number, attribute: 'max-files' })
maxFiles = 0;

@propertyDataSource({ type: Boolean })
disabled = false;

@propertyDataSource({ type: Boolean })
loading = false;

// ===========================================================================
// INTERNAL STATE
// ===========================================================================
@state()
private isDragging = false;

@state()
private previewUrl: string | null = null;

@state()
private previewFile: File | null = null;

private uid = `ml-user-photo-${Math.random().toString(36).slice(2)}`;

// ===========================================================================
// STATE CHANGE HANDLER
// ===========================================================================
handleIcaStateChange(key: string, value: any) {
const valueAttr = this.getAttribute('value');
if (valueAttr === `{{${key}}}`) {
const files = Array.isArray(value) ? value : [];
this.updatePreview(files);
}
this.requestUpdate();
}

// ===========================================================================
// LIFECYCLE
// ===========================================================================
disconnectedCallback() {
super.disconnectedCallback();
this.revokePreview();
}

// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handleTriggerClick() {
if (this.isBusy()) return;
this.openFilePicker();
}

private handleTriggerKeyDown(event: KeyboardEvent) {
if (this.isBusy()) return;
if (event.key === 'Enter' || event.key === ' ') {
event.preventDefault();
this.openFilePicker();
}
}

private handleInputChange(event: Event) {
if (this.isBusy()) return;
const input = event.target as HTMLInputElement;
this.processFiles(input.files);
input.value = '';
}

private handleDragOver(event: DragEvent) {
if (this.isBusy()) return;
event.preventDefault();
this.isDragging = true;
}

private handleDragLeave() {
this.isDragging = false;
}

private handleDrop(event: DragEvent) {
if (this.isBusy()) return;
event.preventDefault();
this.isDragging = false;
this.processFiles(event.dataTransfer?.files || null);
}

private handleRemove(index: number) {
if (this.isBusy()) return;
const files = this.value ? [...this.value] : [];
files.splice(index, 1);
this.value = files;
this.updatePreview(files);
}

// ===========================================================================
// FILE PROCESSING
// ===========================================================================
private processFiles(fileList: FileList | null) {
if (!fileList || fileList.length === 0) return;

const incoming = Array.from(fileList);
const baseValue = this.multiple ? (this.value ? [...this.value] : []) : [];
const maxAllowed = this.multiple ? (this.maxFiles > 0 ? this.maxFiles : Number.POSITIVE_INFINITY) : 1;

const accepted: File[] = [];
const rejectedType: File[] = [];
const rejectedSize: File[] = [];
const rejectedCount: File[] = [];

let currentCount = baseValue.length;

incoming.forEach((file) => {
if (!this.isImageFile(file) || !this.isAcceptedType(file)) {
rejectedType.push(file);
return;
}
if (this.maxSizeKb > 0 && file.size / 1024 > this.maxSizeKb) {
rejectedSize.push(file);
return;
}
if (currentCount + accepted.length >= maxAllowed) {
rejectedCount.push(file);
return;
}
accepted.push(file);
});

const newValue = baseValue.concat(accepted);
if (!this.multiple && accepted.length > 0) {
this.value = [accepted[0]];
} else if (accepted.length > 0 || baseValue.length !== newValue.length) {
this.value = newValue;
}

this.updatePreview(this.value || []);
this.dispatchRejects(rejectedType, rejectedSize, rejectedCount);
}

private dispatchRejects(typeFiles: File[], sizeFiles: File[], countFiles: File[]) {
if (typeFiles.length > 0) {
this.dispatchEvent(new CustomEvent('reject', {
bubbles: true,
composed: true,
detail: { files: typeFiles, reason: 'type' }
}));
}
if (sizeFiles.length > 0) {
this.dispatchEvent(new CustomEvent('reject', {
bubbles: true,
composed: true,
detail: { files: sizeFiles, reason: 'size' }
}));
}
if (countFiles.length > 0) {
this.dispatchEvent(new CustomEvent('reject', {
bubbles: true,
composed: true,
detail: { files: countFiles, reason: 'count' }
}));
}
}

private isImageFile(file: File): boolean {
if (file.type && file.type.startsWith('image/')) return true;
const ext = file.name.split('.').pop()?.toLowerCase() || '';
return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'].includes(ext);
}

private isAcceptedType(file: File): boolean {
if (!this.accept) return true;
const acceptList = this.accept.split(',').map((item) => item.trim()).filter(Boolean);
if (acceptList.length === 0) return true;
const fileName = file.name.toLowerCase();
const fileType = (file.type || '').toLowerCase();
return acceptList.some((rule) => {
const r = rule.toLowerCase();
if (r.endsWith('/*')) {
const prefix = r.replace('/*', '/');
return fileType.startsWith(prefix);
}
if (r.startsWith('.')) {
return fileName.endsWith(r);
}
return fileType === r;
});
}

private updatePreview(files: File[]) {
const file = files && files.length > 0 ? files[0] : null;
if (file && this.previewFile === file) return;
this.revokePreview();
if (file) {
this.previewUrl = URL.createObjectURL(file);
this.previewFile = file;
} else {
this.previewUrl = null;
this.previewFile = null;
}
}

private revokePreview() {
if (this.previewUrl) {
URL.revokeObjectURL(this.previewUrl);
}
}

// ===========================================================================
// UTILITIES
// ===========================================================================
private isBusy(): boolean {
return this.disabled || this.loading;
}

private openFilePicker() {
const input = this.querySelector('input[type="file"]') as HTMLInputElement | null;
input?.click();
}

private formatSize(size: number): string {
const kb = size / 1024;
if (kb < 1024) return `${kb.toFixed(1)} KB`;
return `${(kb / 1024).toFixed(1)} MB`;
}

private getTriggerClasses(hasError: boolean, isBusy: boolean): string {
return [
'w-full rounded-lg border-2 border-dashed p-4 text-center transition',
'bg-white dark:bg-slate-800',
'text-slate-600 dark:text-slate-400',
hasError ? 'border-red-500 dark:border-red-400' : 'border-slate-200 dark:border-slate-700',
this.isDragging ? 'bg-sky-50 dark:bg-sky-900/40 border-sky-500 dark:border-sky-400' : '',
!isBusy ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700' : 'opacity-50 cursor-not-allowed',
].filter(Boolean).join(' ');
}

private getRemoveButtonClasses(): string {
return [
'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border transition',
'border-slate-200 dark:border-slate-700',
'text-slate-600 dark:text-slate-300',
'hover:bg-slate-50 dark:hover:bg-slate-700',
].filter(Boolean).join(' ');
}

// ===========================================================================
// RENDER
// ===========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];

const hasError = Boolean(this.error);
const hasHelper = this.hasSlot('Helper');
const isBusy = this.isBusy();
const labelId = `${this.uid}-label`;
const helperId = `${this.uid}-helper`;
const errorId = `${this.uid}-error`;
const describedBy = hasError ? errorId : (hasHelper ? helperId : undefined);
const files = this.value || [];
const acceptAttr = this.accept || 'image/*';

return html`
<div class="w-full">
${this.renderLabel(labelId)}
<div
class="${this.getTriggerClasses(hasError, isBusy)}"
role="button"
tabindex="${isBusy ? '-1' : '0'}"
aria-label="${this.msg.selectPhoto}"
aria-labelledby="${this.hasSlot('Label') ? labelId : ''}"
aria-describedby="${describedBy || ''}"
aria-invalid="${hasError ? 'true' : 'false'}"
aria-busy="${this.loading ? 'true' : 'false'}"
@keydown=${this.handleTriggerKeyDown}
@click=${this.handleTriggerClick}
@dragover=${this.handleDragOver}
@dragleave=${this.handleDragLeave}
@drop=${this.handleDrop}
>
${this.renderTriggerContent()}
</div>
<input
class="hidden"
type="file"
?multiple=${this.multiple}
accept="${acceptAttr}"
?disabled=${isBusy}
@change=${this.handleInputChange}
aria-hidden="true"
/>
${this.renderPreview(files)}
${this.renderFileList(files)}
${this.renderFeedback(hasError, hasHelper, errorId, helperId)}
</div>
`;
}

private renderLabel(labelId: string): TemplateResult {
if (!this.hasSlot('Label')) return html``;
return html`
<label id="${labelId}" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
${unsafeHTML(this.getSlotContent('Label'))}
</label>
`;
}

private renderTriggerContent(): TemplateResult {
if (this.hasSlot('Trigger')) {
return html`${unsafeHTML(this.getSlotContent('Trigger'))}`;
}
return html`
<div class="flex flex-col items-center gap-1">
<span class="text-sm font-medium text-slate-900 dark:text-slate-100">${this.msg.selectPhoto}</span>
<span class="text-xs text-slate-500 dark:text-slate-400">${this.msg.dropHere}</span>
${this.loading ? html`<span class="text-xs text-slate-500 dark:text-slate-400">${this.msg.loading}</span>` : html``}
</div>
`;
}

private renderPreview(files: File[]): TemplateResult {
if (!files || files.length === 0 || !this.previewUrl) return html``;
const file = files[0];
return html`
<div class="mt-4 flex items-center gap-4">
<img
src="${this.previewUrl}"
alt="${file.name}"
class="h-20 w-20 rounded-lg border border-slate-200 dark:border-slate-700 object-cover"
/>
<div class="flex-1">
<p class="text-sm font-medium text-slate-900 dark:text-slate-100">${file.name}</p>
<p class="text-xs text-slate-500 dark:text-slate-400">${this.formatSize(file.size)}</p>
</div>
<button
type="button"
class="${this.getRemoveButtonClasses()}"
?disabled=${this.isBusy()}
@click=${() => this.handleRemove(0)}
>
${this.msg.remove}
</button>
</div>
`;
}

private renderFileList(files: File[]): TemplateResult {
if (!this.multiple || files.length <= 1) return html``;
return html`
<div class="mt-3">
<p class="text-xs text-slate-500 dark:text-slate-400">${this.msg.fileCount}: ${files.length}</p>
<ul class="mt-2 space-y-2">
${files.map((file, index) => html`
<li class="flex items-center justify-between rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2">
<div>
<p class="text-sm text-slate-900 dark:text-slate-100">${file.name}</p>
<p class="text-xs text-slate-500 dark:text-slate-400">${this.formatSize(file.size)}</p>
</div>
<button
type="button"
class="${this.getRemoveButtonClasses()}"
?disabled=${this.isBusy()}
@click=${() => this.handleRemove(index)}
>
${this.msg.remove}
</button>
</li>
`)}
</ul>
</div>
`;
}

private renderFeedback(hasError: boolean, hasHelper: boolean, errorId: string, helperId: string): TemplateResult {
if (hasError) {
return html`<p id="${errorId}" class="mt-2 text-xs text-red-600 dark:text-red-400">${unsafeHTML(String(this.error))}</p>`;
}
if (hasHelper) {
return html`<p id="${helperId}" class="mt-2 text-xs text-slate-500 dark:text-slate-400">${unsafeHTML(this.getSlotContent('Helper'))}</p>`;
}
return html``;
}
}
