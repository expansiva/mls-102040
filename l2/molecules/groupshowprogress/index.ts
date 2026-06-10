/// <mls fileReference="_102040_/l2/molecules/groupshowprogress/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupshowprogress/ml-circular-progress';
import '/_102040_/l2/molecules/groupshowprogress/ml-indeterminate-spinner';
import '/_102040_/l2/molecules/groupshowprogress/ml-linear-progress';
import '/_102040_/l2/molecules/groupshowprogress/ml-segmented-progress';
import '/_102040_/l2/molecules/groupshowprogress/ml-upload-progress-indicator';

@customElement('molecules--groupshowprogress--index-102040')
export class GroupShowProgressIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private card1 = 68;
  @state() private card2: number | null = null;
  @state() private card3 = 42;
  @state() private card4 = 75;
  @state() private card5 = 88;

  // ===========================================================================
  // SECTION: Hero
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span
          class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
        >
          groupShowProgress
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Show Progress
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Indicates the progress of an operation or process. Visual primitive designed for composition inside other components. Supports determinate mode (0-100%) and indeterminate mode (unknown duration). Implementations include progress bar, progress ring/circle, spinner, and percentage indicator.
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Circular Progress</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupshowprogress--ml-circular-progress</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Compact determinate ring with a visible percentage.</p>
              <groupshowprogress--ml-circular-progress
                name="card-1"
                .value=${this.card1}
                size="md"
                label="Generating report"
                .showValue=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card1 = e.detail.value;
                }}
              ></groupshowprogress--ml-circular-progress>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Indeterminate Spinner</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupshowprogress--ml-indeterminate-spinner</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Use when duration is unknown and feedback must stay lightweight.</p>
              <groupshowprogress--ml-indeterminate-spinner
                name="card-2"
                .value=${this.card2}
                size="sm"
                label="Saving changes"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card2 = e.detail.value;
                }}
              ></groupshowprogress--ml-indeterminate-spinner>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Linear Progress</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupshowprogress--ml-linear-progress</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Best for full-width task progress in layouts or dialogs.</p>
              <groupshowprogress--ml-linear-progress
                name="card-3"
                .value=${this.card3}
                size="lg"
                label="Uploading files"
                .showValue=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card3 = e.detail.value;
                }}
              ></groupshowprogress--ml-linear-progress>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Segmented Progress</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupshowprogress--ml-segmented-progress</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Segmented indicators suit multi-step flows and milestones.</p>
              <groupshowprogress--ml-segmented-progress
                name="card-4"
                .value=${this.card4}
                size="md"
                label="Completing steps"
                .showValue=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card4 = e.detail.value;
                }}
              ></groupshowprogress--ml-segmented-progress>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-sky-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Upload Progress Indicator</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupshowprogress--ml-upload-progress-indicator</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Expresses file transfer progress with a clear percent readout.</p>
              <groupshowprogress--ml-upload-progress-indicator
                name="card-5"
                .value=${this.card5}
                size="md"
                label="Syncing assets"
                .showValue=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card5 = e.detail.value;
                }}
              ></groupshowprogress--ml-upload-progress-indicator>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // SECTION: Reference Table
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{
      scenario: string;
      circularProgress: boolean;
      indeterminateSpinner: boolean;
      linearProgress: boolean;
      segmentedProgress: boolean;
      uploadProgressIndicator: boolean;
    }> = [
      {
        scenario: 'Need a compact percentage indicator for a determinate task.',
        circularProgress: true,
        indeterminateSpinner: false,
        linearProgress: false,
        segmentedProgress: false,
        uploadProgressIndicator: false,
      },
      {
        scenario: 'Duration is unknown and the UI should stay lightweight.',
        circularProgress: false,
        indeterminateSpinner: true,
        linearProgress: false,
        segmentedProgress: false,
        uploadProgressIndicator: false,
      },
      {
        scenario: 'Show a full-width progress bar in a form or modal.',
        circularProgress: false,
        indeterminateSpinner: false,
        linearProgress: true,
        segmentedProgress: false,
        uploadProgressIndicator: false,
      },
      {
        scenario: 'Represent a multi-step workflow with segment milestones.',
        circularProgress: false,
        indeterminateSpinner: false,
        linearProgress: false,
        segmentedProgress: true,
        uploadProgressIndicator: false,
      },
      {
        scenario: 'Highlight file transfer completion with a percent readout.',
        circularProgress: false,
        indeterminateSpinner: false,
        linearProgress: false,
        segmentedProgress: false,
        uploadProgressIndicator: true,
      },
    ];
    const headers = [
      { label: 'Circular Progress', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Indeterminate Spinner', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Linear Progress', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Segmented Progress', cls: 'text-rose-600 dark:text-rose-400' },
      { label: 'Upload Indicator', cls: 'text-sky-600 dark:text-sky-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Indicates the progress of an operation or process. Visual primitive designed for composition inside other components. Supports determinate mode (0-100%) and indeterminate mode (unknown duration). Implementations include progress bar, progress ring/circle, spinner, and percentage indicator.
          </p>
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
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
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                      ${[
                        row.circularProgress,
                        row.indeterminateSpinner,
                        row.linearProgress,
                        row.segmentedProgress,
                        row.uploadProgressIndicator,
                      ].map(
                        (ok) => html`
                          <td class="px-4 py-3.5 text-center">
                            ${ok
                              ? html`<span
                                  class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
                                  >✓</span
                                >`
                              : html`<span class="text-slate-200 dark:text-slate-700 text-sm">—</span>`}
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

  // ===========================================================================
  // SECTION: Render
  protected render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }
}
