/// <mls fileReference="_102040_/l2/molecules/groupselectfileforupload/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupselectfileforupload/ml-file-upload-dropzone';
import '/_102040_/l2/molecules/groupselectfileforupload/ml-file-upload-preview';
import '/_102040_/l2/molecules/groupselectfileforupload/ml-user-photo-upload';
import '/_102040_/l2/molecules/groupselectfileforupload/ml-upload-file-list';
import '/_102040_/l2/molecules/groupselectfileforupload/ml-file-metadata-uploader';

@customElement('molecules--groupselectfileforupload--index-102040')
export class GroupSelectFileForUploadIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardDropzone: File[] = [];
  @state() private cardPreview: File[] = [
    new File(['Quarterly report'], 'quarterly-report.pdf', { type: 'application/pdf' })
  ];
  @state() private cardUserPhoto: File[] = [
    new File(['Photo'], 'profile.jpg', { type: 'image/jpeg' })
  ];
  @state() private cardFileList: File[] = [
    new File(['Dataset'], 'inventory.csv', { type: 'text/csv' }),
    new File(['Archive'], 'pricing.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  ];
  @state() private cardMetadata: File[] = [
    new File(['Metadata'], 'catalog.csv', { type: 'text/csv' })
  ];

  // ===========================================================================
  // HERO
  private renderHero(): TemplateResult {
    return html`
      <header
        class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center"
      >
        <span
          class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
        >
          groupSelectFileForUpload
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Select File for Upload
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to select one or more files to be uploaded with drag-and-drop, file
          button, camera capture, and clipboard workflows, while enforcing type and size
          validation with reject handling.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SHOWCASE CARDS
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section
        class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700"
      >
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Dropzone upload</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupselectfileforupload--ml-file-upload-dropzone</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Drag-and-drop area for multiple image uploads with validation.
              </p>
              <groupselectfileforupload--ml-file-upload-dropzone
                name="card-dropzone"
                .value=${this.cardDropzone}
                .multiple=${true}
                .maxSizeKb=${2048}
                .maxFiles=${5}
                accept="image/*"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardDropzone = e.detail.value;
                }}
              >
                <Label>Product images</Label>
                <Trigger>Drop images here or click to browse</Trigger>
                <Helper>Up to 5 images, max 2MB each.</Helper>
              </groupselectfileforupload--ml-file-upload-dropzone>
            </div>
          </div>

          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Preview-first upload</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupselectfileforupload--ml-file-upload-preview</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Show selected files with inline preview before upload.
              </p>
              <groupselectfileforupload--ml-file-upload-preview
                name="card-preview"
                .value=${this.cardPreview}
                accept="application/pdf"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardPreview = e.detail.value;
                }}
              >
                <Label>Contracts</Label>
                <Trigger>Choose PDF files</Trigger>
                <Helper>PDF only, one file at a time.</Helper>
              </groupselectfileforupload--ml-file-upload-preview>
            </div>
          </div>

          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Camera capture</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupselectfileforupload--ml-user-photo-upload</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Capture a user photo or upload from device storage.
              </p>
              <groupselectfileforupload--ml-user-photo-upload
                name="card-user-photo"
                .value=${this.cardUserPhoto}
                accept="image/*"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardUserPhoto = e.detail.value;
                }}
              >
                <Label>Profile photo</Label>
                <Trigger>Take a photo or upload</Trigger>
                <Helper>Use a clear headshot for identification.</Helper>
              </groupselectfileforupload--ml-user-photo-upload>
            </div>
          </div>

          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">File list manager</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupselectfileforupload--ml-upload-file-list</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Manage multiple spreadsheet uploads with a list view.
              </p>
              <groupselectfileforupload--ml-upload-file-list
                name="card-file-list"
                .value=${this.cardFileList}
                .multiple=${true}
                accept=".csv,.xlsx"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardFileList = e.detail.value;
                }}
              >
                <Label>Inventory files</Label>
                <Trigger>Add CSV or Excel files</Trigger>
                <Helper>Upload multiple files and remove any before sending.</Helper>
              </groupselectfileforupload--ml-upload-file-list>
            </div>
          </div>

          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div class="h-1 bg-sky-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Metadata uploader</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupselectfileforupload--ml-file-metadata-uploader</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Capture file uploads alongside metadata validation rules.
              </p>
              <groupselectfileforupload--ml-file-metadata-uploader
                name="card-metadata"
                .value=${this.cardMetadata}
                .multiple=${true}
                .maxFiles=${3}
                accept=".csv"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardMetadata = e.detail.value;
                }}
              >
                <Label>Catalog metadata</Label>
                <Trigger>Upload metadata CSV</Trigger>
                <Helper>Limit 3 files, ensure headers match the template.</Helper>
              </groupselectfileforupload--ml-file-metadata-uploader>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{
      scenario: string;
      dropzone: boolean;
      preview: boolean;
      userPhoto: boolean;
      fileList: boolean;
      metadataUploader: boolean;
    }> = [
      {
        scenario: 'Need drag-and-drop and bulk validation for many files.',
        dropzone: true,
        preview: false,
        userPhoto: false,
        fileList: true,
        metadataUploader: false
      },
      {
        scenario: 'Single document upload with an inline preview.',
        dropzone: false,
        preview: true,
        userPhoto: false,
        fileList: false,
        metadataUploader: false
      },
      {
        scenario: 'Capture a headshot directly from the camera.',
        dropzone: false,
        preview: false,
        userPhoto: true,
        fileList: false,
        metadataUploader: false
      },
      {
        scenario: 'Collect many spreadsheet files and manage a list.',
        dropzone: false,
        preview: false,
        userPhoto: false,
        fileList: true,
        metadataUploader: false
      },
      {
        scenario: 'Upload CSVs that must include metadata constraints.',
        dropzone: false,
        preview: false,
        userPhoto: false,
        fileList: false,
        metadataUploader: true
      }
    ];
    const headers = [
      { label: 'Dropzone', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Preview', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'User Photo', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'File List', cls: 'text-rose-600 dark:text-rose-400' },
      { label: 'Metadata Uploader', cls: 'text-sky-600 dark:text-sky-400' }
    ];

    return html`
      <section
        class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700"
      >
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this guide to match the right file selection pattern to your upload flow,
            validation requirements, and metadata needs.
          </p>
          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
          >
            <table class="w-full text-sm">
              <thead>
                <tr
                  class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700"
                >
                  <th
                    class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-3/4"
                  >
                    Scenario
                  </th>
                  ${headers.map(
                    (h) => html`
                      <th class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}">
                        ${h.label}
                      </th>
                    `
                  )}
                </tr>
              </thead>
              <tbody>
                ${rows.map(
                  (row, i) => html`
                    <tr
                      class="${i % 2 !== 0
                        ? 'bg-slate-50/60 dark:bg-slate-900/40'
                        : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0"
                    >
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">
                        ${row.scenario}
                      </td>
                      ${([
                        row.dropzone,
                        row.preview,
                        row.userPhoto,
                        row.fileList,
                        row.metadataUploader
                      ] as boolean[]).map(
                        (ok) => html`
                          <td class="px-4 py-3.5 text-center">
                            ${ok
                              ? html`<span
                                  class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
                                  >✓</span
                                >`
                              : html`<span class="text-slate-200 dark:text-slate-700 text-sm"
                                  >—</span
                                >`}
                          </td>
                        `
                      )}
                    </tr>
                  `
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  public render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()} ${this.renderShowcaseCards()} ${this.renderReferenceTable()}
      </div>
    `;
  }
}
