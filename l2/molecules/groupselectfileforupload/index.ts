/// <mls fileReference="_102040_/l2/molecules/groupselectfileforupload/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupselectfileforupload/ml-user-photo-upload';

@customElement('molecules--groupselectfileforupload--index-102040')
export class GroupSelectFileForUploadIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardOneValue: File[] = [];
  @state() private cardTwoValue: File[] = [];

  // ===========================================================================
  // SECTION: Hero
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupSelectFileForUpload
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Select File for Upload
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to select one or more files to be uploaded. Stateless — emits selected File objects via change event; the page is responsible for uploading via BFF. Supports drag-and-drop, file type and size validation, and emits a reject event for invalid files.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SECTION: Showcase Cards
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">User photo upload</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupselectfileforupload--ml-user-photo-upload</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Use for avatar or profile photo capture with a clear call to action.</p>
              <groupselectfileforupload--ml-user-photo-upload
                name="card-one"
                accept="image/*"
                .maxSizeKb=${2048}
                .value=${this.cardOneValue}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardOneValue = e.detail.value;
                }}
              >
                <Label>Profile photo</Label>
                <Trigger>Drop a photo or browse files</Trigger>
                <Helper>JPG or PNG, up to 2 MB.</Helper>
              </groupselectfileforupload--ml-user-photo-upload>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Bulk avatar refresh</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupselectfileforupload--ml-user-photo-upload</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Illustrates multi-file capture with upload-in-progress state.</p>
              <groupselectfileforupload--ml-user-photo-upload
                name="card-two"
                accept="image/*"
                .multiple=${true}
                .maxFiles=${3}
                .loading=${true}
                error="Upload is processing the last batch."
                .value=${this.cardTwoValue}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardTwoValue = e.detail.value;
                }}
              >
                <Label>Team photos</Label>
                <Trigger>Drop up to 3 headshots</Trigger>
                <Helper>Max 3 files, 2 MB each.</Helper>
              </groupselectfileforupload--ml-user-photo-upload>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // SECTION: Reference Table
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{ scenario: string; userPhotoUpload: boolean }> = [
      { scenario: 'Capture an avatar with preview, drag-and-drop, and camera-friendly guidance.', userPhotoUpload: true },
      { scenario: 'Attach PDFs or documents without a photo-centric UI.', userPhotoUpload: false },
      { scenario: 'Multi-user profile refresh where a small batch of images is uploaded at once.', userPhotoUpload: true },
    ];
    const headers = [
      { label: 'User photo upload', cls: 'text-violet-600 dark:text-violet-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">Use this guide to confirm when the user photo upload experience is the right fit for selecting files and emitting File[] state.</p>
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <th class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-3/4">Scenario</th>
                  ${headers.map(
                    (h) => html`
                      <th class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}">${h.label}</th>
                    `,
                  )}
                </tr>
              </thead>
              <tbody>
                ${rows.map(
                  (row, i) => html`
                    <tr class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0">
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                      ${([row.userPhotoUpload] as boolean[]).map(
                        (ok) => html`
                          <td class="px-4 py-3.5 text-center">
                            ${ok
                              ? html`<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>`
                              : html`<span class="text-slate-200 dark:text-slate-700 text-sm">—</span>`}
                          </td>
                        `,
                      )}
                    </tr>
                  `,
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()} ${this.renderShowcaseCards()} ${this.renderReferenceTable()}
      </div>
    `;
  }
}
