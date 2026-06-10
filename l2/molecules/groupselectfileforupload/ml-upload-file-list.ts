/// <mls fileReference="_102040_/l2/molecules/groupselectfileforupload/ml-upload-file-list.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML UPLOAD FILE LIST MOLECULE
// =============================================================================
// Skill Group: groupSelectFileForUpload
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
  addFiles: 'Add files',
  dropHere: 'Drop files here or click to browse',
  noFiles: 'No files selected',
  uploading: 'Uploading...',
  uploaded: 'Ready',
  remove: 'Remove',
  size: 'Size',
  type: 'Type',
};

type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
  en: message_en,
};
/// **collab_i18n_end**

@customElement('groupselectfileforupload--ml-upload-file-list')
export class UploadFileListMolecule extends MoleculeAuraElement {
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
  error = '';

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

  @query('input[type="file"]')
  private fileInput?: HTMLInputElement;

  private uid = `ufl-${Math.random().toString(36).slice(2, 9)}`;

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleTriggerClick() {
    if (this.disabled || this.loading) return;
    this.fileInput?.click();
  }

  private handleTriggerKeydown(event: KeyboardEvent) {
    if (this.disabled || this.loading) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.fileInput?.click();
    }
  }

  private handleInputChange(event: Event) {
    if (this.disabled || this.loading) return;
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    this.validateAndMergeFiles(files);
    input.value = '';
  }

  private handleDragOver(event: DragEvent) {
    event.preventDefault();
    if (this.disabled || this.loading) return;
    this.isDragging = true;
  }

  private handleDragLeave() {
    if (this.disabled || this.loading) return;
    this.isDragging = false;
  }

  private handleDrop(event: DragEvent) {
    event.preventDefault();
    if (this.disabled || this.loading) return;
    this.isDragging = false;
    const files = event.dataTransfer?.files ? Array.from(event.dataTransfer.files) : [];
    this.validateAndMergeFiles(files);
  }

  private handleRemoveFile(index: number) {
    if (this.disabled || this.loading) return;
    const list = Array.isArray(this.value) ? [...this.value] : [];
    list.splice(index, 1);
    this.value = list;
  }

  // ===========================================================================
  // VALIDATION
  // ===========================================================================
  private validateAndMergeFiles(files: File[]) {
    if (!files.length) return;

    const rejectedType: File[] = [];
    const rejectedSize: File[] = [];
    const rejectedCount: File[] = [];
    const valid: File[] = [];

    for (const file of files) {
      if (!this.matchesAccept(file)) {
        rejectedType.push(file);
        continue;
      }
      if (this.maxSizeKb > 0 && file.size / 1024 > this.maxSizeKb) {
        rejectedSize.push(file);
        continue;
      }
      valid.push(file);
    }

    if (!this.multiple) {
      if (valid.length > 0) {
        this.value = [valid[0]];
      }
      this.dispatchRejectEvents(rejectedType, rejectedSize, []);
      return;
    }

    const current = Array.isArray(this.value) ? [...this.value] : [];
    if (this.maxFiles > 0) {
      for (const file of valid) {
        if (current.length < this.maxFiles) {
          current.push(file);
        } else {
          rejectedCount.push(file);
        }
      }
    } else {
      current.push(...valid);
    }

    if (valid.length > 0) {
      this.value = current;
    }

    this.dispatchRejectEvents(rejectedType, rejectedSize, rejectedCount);
  }

  private dispatchRejectEvents(typeFiles: File[], sizeFiles: File[], countFiles: File[]) {
    if (typeFiles.length) {
      this.dispatchEvent(new CustomEvent('reject', {
        bubbles: true,
        composed: true,
        detail: { files: typeFiles, reason: 'type' },
      }));
    }
    if (sizeFiles.length) {
      this.dispatchEvent(new CustomEvent('reject', {
        bubbles: true,
        composed: true,
        detail: { files: sizeFiles, reason: 'size' },
      }));
    }
    if (countFiles.length) {
      this.dispatchEvent(new CustomEvent('reject', {
        bubbles: true,
        composed: true,
        detail: { files: countFiles, reason: 'count' },
      }));
    }
  }

  private matchesAccept(file: File): boolean {
    if (!this.accept) return true;
    const acceptItems = this.accept.split(',').map((item) => item.trim()).filter(Boolean);
    if (!acceptItems.length) return true;

    const fileType = (file.type || '').toLowerCase();
    const fileName = file.name.toLowerCase();

    return acceptItems.some((accept) => {
      const rule = accept.toLowerCase();
      if (rule.startsWith('.')) {
        return fileName.endsWith(rule);
      }
      if (rule.endsWith('/*')) {
        const prefix = rule.replace('/*', '');
        return fileType.startsWith(prefix);
      }
      return fileType === rule;
    });
  }

  // ===========================================================================
  // HELPERS
  // ===========================================================================
  private formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, index);
    return `${size.toFixed(size >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
  }

  private getFileExtension(file: File): string {
    const name = file.name || '';
    const parts = name.split('.');
    if (parts.length < 2) return 'FILE';
    return parts[parts.length - 1].toUpperCase();
  }

  private getDropZoneClasses(hasError: boolean): string {
    return [
      'w-full rounded-lg border border-dashed p-4 transition text-sm flex flex-col gap-2 items-center justify-center text-center',
      'bg-white dark:bg-slate-900',
      'text-slate-700 dark:text-slate-300',
      hasError
        ? 'border-red-500 dark:border-red-400'
        : 'border-slate-200 dark:border-slate-700',
      this.isDragging
        ? 'border-sky-500 dark:border-sky-400 bg-sky-50 dark:bg-sky-900/40'
        : '',
      this.disabled || this.loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ].filter(Boolean).join(' ');
  }

  private getFileRowClasses(): string {
    return [
      'w-full rounded-md border p-3 flex flex-col gap-2',
      'border-slate-200 dark:border-slate-700',
      'bg-white dark:bg-slate-800',
    ].join(' ');
  }

  private getTypeBadgeClasses(): string {
    return [
      'inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold',
      'bg-slate-100 dark:bg-slate-700',
      'text-slate-600 dark:text-slate-300',
    ].join(' ');
  }

  private getRemoveButtonClasses(): string {
    return [
      'text-xs font-medium text-red-600 dark:text-red-400 transition',
      this.disabled || this.loading ? 'opacity-50 cursor-not-allowed' : 'hover:underline',
    ].join(' ');
  }

  private renderLabel(labelId: string): TemplateResult {
    if (!this.hasSlot('Label')) return html``;
    return html`
      <div id=${labelId} class="text-sm font-medium text-slate-700 dark:text-slate-300">
        ${unsafeHTML(this.getSlotContent('Label'))}
      </div>
    `;
  }

  private renderHelperOrError(helperId: string, hasError: boolean): TemplateResult {
    if (hasError) {
      return html`
        <p id=${helperId} class="text-xs text-red-600 dark:text-red-400">
          ${unsafeHTML(String(this.error))}
        </p>
      `;
    }
    if (this.hasSlot('Helper')) {
      return html`
        <p id=${helperId} class="text-xs text-slate-500 dark:text-slate-400">
          ${unsafeHTML(this.getSlotContent('Helper'))}
        </p>
      `;
    }
    return html``;
  }

  private renderTriggerContent(): TemplateResult {
    if (this.hasSlot('Trigger')) {
      return html`${unsafeHTML(this.getSlotContent('Trigger'))}`;
    }
    return html`
      <div class="text-sm font-medium text-slate-700 dark:text-slate-200">${this.msg.addFiles}</div>
      <div class="text-xs text-slate-500 dark:text-slate-400">${this.msg.dropHere}</div>
    `;
  }

  private renderFileList(hasFiles: boolean): TemplateResult {
    if (!hasFiles) {
      return html`
        <div class="text-sm text-slate-500 dark:text-slate-400">${this.msg.noFiles}</div>
      `;
    }

    return html`
      <div class="flex flex-col gap-3">
        ${this.value.map((file, index) => html`
          <div class=${this.getFileRowClasses()}>
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class=${this.getTypeBadgeClasses()}>${this.getFileExtension(file)}</span>
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-slate-900 dark:text-slate-100">${file.name}</span>
                  <span class="text-xs text-slate-500 dark:text-slate-400">${this.msg.size}: ${this.formatSize(file.size)}</span>
                </div>
              </div>
              <button
                type="button"
                class=${this.getRemoveButtonClasses()}
                @click=${() => this.handleRemoveFile(index)}
                aria-label=${this.msg.remove}
                ?disabled=${this.disabled || this.loading}
              >
                ${this.msg.remove}
              </button>
            </div>
            <div class="flex flex-col gap-1">
              <div class="text-xs text-slate-500 dark:text-slate-400">
                ${this.loading ? this.msg.uploading : this.msg.uploaded}
              </div>
              <div class="h-1 w-full rounded bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div class=${[
                  'h-full w-full',
                  this.loading
                    ? 'bg-sky-500 dark:bg-sky-400 animate-pulse'
                    : 'bg-emerald-500 dark:bg-emerald-400',
                ].join(' ')}></div>
              </div>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    const hasError = Boolean(this.error);
    const labelId = `${this.uid}-label`;
    const helperId = `${this.uid}-helper`;
    const describedBy = hasError || this.hasSlot('Helper') ? helperId : undefined;
    const hasFiles = Array.isArray(this.value) && this.value.length > 0;

    return html`
      <div class="flex flex-col gap-3">
        ${this.renderLabel(labelId)}

        <div
          class=${this.getDropZoneClasses(hasError)}
          role="button"
          tabindex=${this.disabled || this.loading ? -1 : 0}
          aria-labelledby=${this.hasSlot('Label') ? labelId : undefined}
          aria-describedby=${describedBy}
          aria-invalid=${hasError ? 'true' : 'false'}
          @click=${this.handleTriggerClick}
          @keydown=${this.handleTriggerKeydown}
          @dragover=${this.handleDragOver}
          @dragleave=${this.handleDragLeave}
          @drop=${this.handleDrop}
        >
          ${this.renderTriggerContent()}
          <input
            class="sr-only"
            type="file"
            ?multiple=${this.multiple}
            ?disabled=${this.disabled || this.loading}
            accept=${this.accept}
            @change=${this.handleInputChange}
          />
        </div>

        ${this.renderHelperOrError(helperId, hasError)}

        ${this.renderFileList(hasFiles)}
      </div>
    `;
  }
}
