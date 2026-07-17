/// <mls fileReference="_102040_/l2/molecules/groupselectfileforupload/ml-file-metadata-uploader.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// FILE METADATA UPLOADER MOLECULE
// =============================================================================
// Skill Group: groupSelectFileForUpload
// This molecule does NOT contain business logic.

import { html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  dropFilesHere: 'Drop files here or click to select',
  dropFilesHereSingle: 'Drop file here or click to select',
  dragActive: 'Drop files here',
  loading: 'Loading...',
  selectedFiles: 'Selected files',
  removeFile: 'Remove file',
  browse: 'Browse',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    dropFilesHere: 'Solte arquivos aqui ou clique para selecionar',
    dropFilesHereSingle: 'Solte arquivo aqui ou clique para selecionar',
    dragActive: 'Solte os arquivos aqui',
    loading: 'Carregando...',
    selectedFiles: 'Arquivos selecionados',
    removeFile: 'Remover arquivo',
    browse: 'Procurar',
  },
};
/// **collab_i18n_end**

@customElement('groupselectfileforupload--ml-file-metadata-uploader')
export class MlFileMetadataUploaderMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Helper', 'Trigger'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================

  // Data
  @propertyDataSource({ type: Array })
  value: File[] = [];

  @propertyDataSource({ type: String })
  error: string = '';

  // Configuration
  @propertyDataSource({ type: Boolean })
  multiple: boolean = false;

  @propertyDataSource({ type: String })
  accept: string = '';

  @propertyDataSource({ type: Number, attribute: 'max-size-kb' })
  maxSizeKb: number = 0;

  @propertyDataSource({ type: Number, attribute: 'max-files' })
  maxFiles: number = 0;

  // States
  @propertyDataSource({ type: Boolean })
  disabled: boolean = false;

  @propertyDataSource({ type: Boolean })
  loading: boolean = false;

  @property({ type: String })
  name: string = '';

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private isDragging: boolean = false;

  private inputId = `file-input-${Math.random().toString(36).substring(2, 9)}`;
  private labelId = `file-label-${Math.random().toString(36).substring(2, 9)}`;
  private errorId = `file-error-${Math.random().toString(36).substring(2, 9)}`;

  // ===========================================================================
  // FILE VALIDATION
  // ===========================================================================
  private validateFiles(files: File[]): { valid: File[]; rejected: { files: File[]; reason: 'size' | 'type' | 'count' }[] } {
    const valid: File[] = [];
    const rejectedByType: File[] = [];
    const rejectedBySize: File[] = [];

    for (const file of files) {
      // Type validation
      if (this.accept && !this.isFileTypeAccepted(file)) {
        rejectedByType.push(file);
        continue;
      }

      // Size validation
      if (this.maxSizeKb > 0 && file.size > this.maxSizeKb * 1024) {
        rejectedBySize.push(file);
        continue;
      }

      valid.push(file);
    }

    const rejected: { files: File[]; reason: 'size' | 'type' | 'count' }[] = [];

    if (rejectedByType.length > 0) {
      rejected.push({ files: rejectedByType, reason: 'type' });
    }

    if (rejectedBySize.length > 0) {
      rejected.push({ files: rejectedBySize, reason: 'size' });
    }

    // Count validation
    if (this.maxFiles > 0) {
      const currentCount = this.value?.length || 0;
      const availableSlots = this.maxFiles - currentCount;

      if (valid.length > availableSlots) {
        const rejectedByCount = valid.splice(availableSlots);
        rejected.push({ files: rejectedByCount, reason: 'count' });
      }
    }

    return { valid, rejected };
  }

  private isFileTypeAccepted(file: File): boolean {
    if (!this.accept) return true;

    const acceptedTypes = this.accept.split(',').map(t => t.trim().toLowerCase());
    const fileType = file.type.toLowerCase();
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    for (const accepted of acceptedTypes) {
      // Wildcard match (e.g., image/*)
      if (accepted.endsWith('/*')) {
        const category = accepted.slice(0, -2);
        if (fileType.startsWith(category + '/')) {
          return true;
        }
      }
      // Extension match (e.g., .pdf)
      else if (accepted.startsWith('.')) {
        if (fileExtension === accepted) {
          return true;
        }
      }
      // MIME type match
      else if (fileType === accepted) {
        return true;
      }
    }

    return false;
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (this.disabled || this.loading) return;
    this.isDragging = true;
  }

  private handleDragLeave(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;
  }

  private handleDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;

    if (this.disabled || this.loading) return;

    const files = Array.from(e.dataTransfer?.files || []);
    this.processFiles(files);
  }

  private handleFileInputChange(e: Event) {
    e.stopPropagation();
    if (this.disabled || this.loading) return;

    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    this.processFiles(files);

    // Reset input to allow selecting the same file again
    input.value = '';
  }

  private processFiles(files: File[]) {
    if (files.length === 0) return;

    const { valid, rejected } = this.validateFiles(files);

    // Emit reject events for invalid files
    for (const rejection of rejected) {
      this.dispatchEvent(new CustomEvent('reject', {
        bubbles: true,
        composed: true,
        detail: { files: rejection.files, reason: rejection.reason }
      }));
    }

    // Update value with valid files
    if (valid.length > 0) {
      if (this.multiple) {
        this.value = [...(this.value || []), ...valid];
      } else {
        this.value = [valid[0]];
      }

      this.dispatchEvent(new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value }
      }));
    }
  }

  private handleRemoveFile(index: number) {
    if (this.disabled || this.loading) return;

    const newValue = [...(this.value || [])];
    newValue.splice(index, 1);
    this.value = newValue;

    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value }
    }));
  }

  private handleDropZoneClick() {
    if (this.disabled || this.loading) return;

    const input = this.querySelector(`#${this.inputId}`) as HTMLInputElement;
    input?.click();
  }

  private handleDropZoneKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.handleDropZoneClick();
    }
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================
  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  private getDropZoneClasses(): string {
    const hasError = !!this.error;

    return [
      // Base
      'relative flex flex-col items-center justify-center w-full min-h-32 p-6',
      'border-2 border-dashed rounded-lg transition-all duration-200',
      'cursor-pointer ml-dropzone',

      // Border states
      this.isDragging && !this.disabled && !this.loading
        ? 'ml-dropzone-active'
        : hasError
          ? 'ml-dropzone-error'
          : '',

      // Disabled/Loading state
      this.disabled || this.loading
        ? 'ml-disabled'
        : '',

      // Focus
      'focus:outline-none',
    ].filter(Boolean).join(' ');
  }

  private getFileItemClasses(): string {
    return [
      'flex items-center justify-between gap-3 p-3 rounded-lg ml-metadata-card',
      'text-sm',
    ].join(' ');
  }

  private getRemoveButtonClasses(): string {
    return [
      'flex items-center justify-center w-6 h-6 rounded-full ml-metadata-remove',
      'transition-colors duration-150',
      'focus:outline-none',
      this.disabled || this.loading ? 'ml-disabled' : 'cursor-pointer',
    ].filter(Boolean).join(' ');
  }

  // ===========================================================================
  // RENDER METHODS
  // ===========================================================================
  private renderLabel(): TemplateResult {
    if (!this.hasSlot('Label')) return html``;

    return html`
      <label
        id="${this.labelId}"
        class="${cn('block text-sm font-medium mb-2 ml-label', this.getSlotClass('Label'))}"
      >
        ${unsafeHTML(this.getSlotContent('Label'))}
      </label>
    `;
  }

  private renderDropZone(): TemplateResult {
    const hasTrigger = this.hasSlot('Trigger');
    const dropText = this.multiple ? this.msg.dropFilesHere : this.msg.dropFilesHereSingle;

    return html`
      <div
        class="${this.getDropZoneClasses()}"
        role="button"
        tabindex="${this.disabled || this.loading ? -1 : 0}"
        aria-labelledby="${this.hasSlot('Label') ? this.labelId : ''}"
        aria-describedby="${this.error ? this.errorId : ''}"
        aria-invalid="${this.error ? 'true' : 'false'}"
        aria-disabled="${this.disabled || this.loading}"
        @click="${this.handleDropZoneClick}"
        @keydown="${this.handleDropZoneKeyDown}"
        @dragover="${this.handleDragOver}"
        @dragleave="${this.handleDragLeave}"
        @drop="${this.handleDrop}"
      >
        ${this.loading
          ? this.renderLoadingState()
          : this.isDragging
            ? this.renderDragActiveState()
            : hasTrigger
              ? html`${unsafeHTML(this.getSlotContent('Trigger'))}`
              : this.renderDefaultTrigger(dropText)
        }
      </div>

      <input
        type="file"
        id="${this.inputId}"
        name="${this.name}"
        class="sr-only"
        ?multiple="${this.multiple}"
        accept="${this.accept}"
        ?disabled="${this.disabled || this.loading}"
        @change="${this.handleFileInputChange}"
        aria-hidden="true"
        tabindex="-1"
      
      @input="${(e: Event) => e.stopPropagation()}"
/>
    `;
  }

  private renderDefaultTrigger(dropText: string): TemplateResult {
    return html`
      <div class="flex flex-col items-center gap-2 text-center">
        <svg
          class="w-10 h-10 ml-dropzone-icon-svg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p class="text-sm ml-text-muted">
          ${dropText}
        </p>
        <span class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ml-metadata-browse-btn">
          ${this.msg.browse}
        </span>
      </div>
    `;
  }

  private renderDragActiveState(): TemplateResult {
    return html`
      <div class="flex flex-col items-center gap-2 text-center">
        <svg
          class="w-10 h-10 animate-bounce ml-dropzone-icon-active"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
        <p class="text-sm font-medium ml-dropzone-icon-active">
          ${this.msg.dragActive}
        </p>
      </div>
    `;
  }

  private renderLoadingState(): TemplateResult {
    return html`
      <div class="flex flex-col items-center gap-2 text-center">
        <svg
          class="w-8 h-8 animate-spin ml-dropzone-icon-active"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <p class="text-sm ml-text-muted">
          ${this.msg.loading}
        </p>
      </div>
    `;
  }

  private renderSelectedFiles(): TemplateResult {
    if (!this.value || this.value.length === 0) return html``;

    return html`
      <div class="mt-4 space-y-2">
        <p class="text-xs font-medium uppercase tracking-wide ml-text-muted">
          ${this.msg.selectedFiles} (${this.value.length})
        </p>
        <ul class="space-y-2">
          ${this.value.map((file, index) => this.renderFileItem(file, index))}
        </ul>
      </div>
    `;
  }

  private renderFileItem(file: File, index: number): TemplateResult {
    return html`
      <li class="${this.getFileItemClasses()}">
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <svg
            class="w-5 h-5 flex-shrink-0 ml-metadata-file-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <div class="min-w-0 flex-1 ml-metadata-field">
            <p class="text-sm font-medium truncate ml-text">
              ${file.name}
            </p>
            <p class="text-xs ml-text-muted">
              ${this.formatFileSize(file.size)}
            </p>
          </div>
        </div>
        <button
          type="button"
          class="${this.getRemoveButtonClasses()}"
          aria-label="${this.msg.removeFile}: ${file.name}"
          ?disabled="${this.disabled || this.loading}"
          @click="${(e: Event) => { e.stopPropagation(); this.handleRemoveFile(index); }}"
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
      </li>
    `;
  }

  private renderMetadataSlot(): TemplateResult {
    return html`
      <div class="mt-4">
        <slot></slot>
      </div>
    `;
  }

  private renderFeedback(): TemplateResult {
    if (this.error) {
      return html`
        <p
          id="${this.errorId}"
          class="mt-2 text-xs ml-error-text"
          role="alert"
        >
          ${unsafeHTML(String(this.error))}
        </p>
      `;
    }

    if (this.hasSlot('Helper')) {
      return html`
        <p class="${cn('mt-2 text-xs ml-helper', this.getSlotClass('Helper'))}">
          ${unsafeHTML(this.getSlotContent('Helper'))}
        </p>
      `;
    }

    return html``;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    return html`
      <div class="${cn('w-full', this.cssClass)}">
        ${this.renderLabel()}
        ${this.renderDropZone()}
        ${this.renderSelectedFiles()}
        ${this.renderMetadataSlot()}
        ${this.renderFeedback()}
      </div>
    `;
  }
}
