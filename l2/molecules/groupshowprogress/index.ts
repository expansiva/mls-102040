/// <mls fileReference="_102040_/l2/molecules/groupshowprogress/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupshowprogress/ml-linear-progress';
import '/_102040_/l2/molecules/groupshowprogress/ml-circular-progress';
import '/_102040_/l2/molecules/groupshowprogress/ml-indeterminate-spinner';

@customElement('molecules--groupshowprogress--index-102040')
export class GroupShowProgressIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardLinear = 38;
  @state() private cardCircular = 72;
  @state() private cardSpinner: number | null = null;

  // ===========================================================================
  // SECTION: Render
  // ===========================================================================
  render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }

  // ===========================================================================
  // SECTION: Hero
  // ===========================================================================
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupShowProgress
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Show Progress
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Indicates the progress of an operation or process. Visual primitive designed for composition inside other components, with determinate and indeterminate progress options.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SECTION: Showcase Cards
  // ===========================================================================
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Linear Progress</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-linear-progress</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Best for inline loading states that need a horizontal track.</p>
              <groupshowprogress--ml-linear-progress
                name="card-linear"
                .value=${this.cardLinear}
                size="md"
                label="Uploading assets"
                .showValue=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardLinear = e.detail.value;
                }}>
              </groupshowprogress--ml-linear-progress>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Circular Progress</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-circular-progress</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Ideal for cards or tiles that need a compact progress indicator.</p>
              <groupshowprogress--ml-circular-progress
                name="card-circular"
                .value=${this.cardCircular}
                size="lg"
                label="Generating report"
                .showValue=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardCircular = e.detail.value;
                }}>
              </groupshowprogress--ml-circular-progress>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Indeterminate Spinner</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-indeterminate-spinner</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Use when duration is unknown and you need a compact loader.</p>
              <groupshowprogress--ml-indeterminate-spinner
                name="card-spinner"
                .value=${this.cardSpinner}
                size="sm"
                label="Saving changes"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardSpinner = e.detail.value;
                }}>
              </groupshowprogress--ml-indeterminate-spinner>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // SECTION: Reference Table
  // ===========================================================================
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{ scenario: string; linearProgress: boolean; circularProgress: boolean; indeterminateSpinner: boolean }> = [
      {
        scenario: 'Inline operations where users expect a track-style meter.',
        linearProgress: true,
        circularProgress: false,
        indeterminateSpinner: false,
      },
      {
        scenario: 'Compact UI surfaces like cards, stats, or widgets.',
        linearProgress: false,
        circularProgress: true,
        indeterminateSpinner: true,
      },
      {
        scenario: 'Unknown duration tasks where only activity needs to be shown.',
        linearProgress: false,
        circularProgress: false,
        indeterminateSpinner: true,
      },
      {
        scenario: 'Need to display a precise percent value to the user.',
        linearProgress: true,
        circularProgress: true,
        indeterminateSpinner: false,
      },
    ];
    const headers = [
      { label: 'Linear Progress', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Circular Progress', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Indeterminate Spinner', cls: 'text-amber-600 dark:text-amber-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this guide to choose between bar, ring, or spinner progress indicators when communicating task status.
          </p>
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <th class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-3/4">Scenario</th>
                  ${headers.map(
                    (h) => html`
                      <th class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}">${h.label}</th>
                    `
                  )}
                </tr>
              </thead>
              <tbody>
                ${rows.map(
                  (row, i) => html`
                    <tr class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0">
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                      ${([row.linearProgress, row.circularProgress, row.indeterminateSpinner] as boolean[]).map(
                        (ok) => html`
                          <td class="px-4 py-3.5 text-center">
                            ${ok
                              ? html`<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>`
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
}
