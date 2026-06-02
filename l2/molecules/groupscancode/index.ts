/// <mls fileReference="_102040_/l2/molecules/groupscancode/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupscancode/ml-scan-code';

@customElement('molecules--groupscancode--index-102040')
export class GroupScanCodeIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardScanCode: string | null = null;

  // ===========================================================================
  // RENDER
  // ==========================================================================
  public render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }

  // ===========================================================================
  // HERO
  // ==========================================================================
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span
          class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
        >
          groupScanCode
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Scan + Code Capture
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Captures information via camera (QR code, barcode, document). Component captures image frames and emits them; the page is responsible for decoding via BFF. Supports rear/front camera, auto-capture with configurable interval, and custom result display.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SHOWCASE CARDS
  // ==========================================================================
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Scan code</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-scan-code</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Capture frames from the camera and render the decoded result.</p>
              <groupscancode--ml-scan-code
                name="card-1"
                .value=${this.cardScanCode}
                .autoCapture=${true}
                .captureInterval=${400}
                facing="environment"
                .loading=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardScanCode = e.detail.value;
                }}
              >
                <Label>Scan QR or barcode</Label>
                <Trigger>📷 Open camera</Trigger>
                <Helper>Hold steady and keep the code inside the frame.</Helper>
                <Result>${this.cardScanCode ?? 'Awaiting decoded result from BFF'}</Result>
              </groupscancode--ml-scan-code>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  // ==========================================================================
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{ scenario: string; mlScanCode: boolean }> = [
      { scenario: 'Need a general-purpose camera capture flow with custom decoding.', mlScanCode: true },
      { scenario: 'Want auto-capture at a configurable interval for real-time scanning.', mlScanCode: true },
      { scenario: 'Need to show a custom decoded result area after BFF processing.', mlScanCode: true },
    ];
    const headers = [
      { label: 'ml-scan-code', cls: 'text-violet-600 dark:text-violet-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Captures information via camera (QR code, barcode, document). Component captures image frames and emits them; the page is responsible for decoding via BFF.
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
                      ${([row.mlScanCode] as boolean[]).map(
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
