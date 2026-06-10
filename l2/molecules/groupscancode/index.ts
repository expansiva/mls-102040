/// <mls fileReference="_102040_/l2/molecules/groupscancode/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupscancode/ml-scan-code-1d';
import '/_102040_/l2/molecules/groupscancode/ml-scan-code';
import '/_102040_/l2/molecules/groupscancode/ml-scan-ocr';
import '/_102040_/l2/molecules/groupscancode/ml-scan-document';

@customElement('molecules--groupscancode--index-102040')
export class GroupScanCodeIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardScanCode1d = '0123456789012';
  @state() private cardScanCode = 'PAY-QR-2048';
  @state() private cardScanOcr = 'Invoice #3921';
  @state() private cardScanDocument = 'Passport • Lucas T.';

  // ===========================================================================
  // SECTION: Hero
  // ==========================================================================='
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupScanCode
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Scan + Code Capture
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Captures information via camera (QR code, barcode, document). Component captures image frames and emits them; the page is responsible for decoding via BFF.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SECTION: Showcase Cards
  // ==========================================================================='
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">1D Barcode Reader</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-scan-code-1d</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Single-axis barcode scanning for retail labels and tickets.</p>
              <groupscancode--ml-scan-code-1d
                name="card-1"
                value="${this.cardScanCode1d}"
                facing="environment"
                .autoCapture=${true}
                .captureInterval=${400}
                .loading=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardScanCode1d = e.detail.value;
                }}
              >
                <Label>Scan 1D Barcode</Label>
                <Trigger>Open Rear Camera</Trigger>
                <Helper>Align the barcode within the frame for quick detection.</Helper>
                <Result>Detected: ${this.cardScanCode1d || '—'}</Result>
              </groupscancode--ml-scan-code-1d>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">QR Code Scanner</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-scan-code</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Best for payment, check-in, and deep-link QR flows.</p>
              <groupscancode--ml-scan-code
                name="card-2"
                value="${this.cardScanCode}"
                facing="environment"
                .autoCapture=${true}
                .captureInterval=${300}
                .loading=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardScanCode = e.detail.value;
                }}
              >
                <Label>Scan QR to Pay</Label>
                <Trigger>📷 Start QR Scan</Trigger>
                <Helper>Point at the QR code — results appear instantly.</Helper>
                <Result>Decoded: ${this.cardScanCode || 'Waiting for scan'}</Result>
              </groupscancode--ml-scan-code>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">OCR Capture</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-scan-ocr</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Extract text from receipts or invoices with OCR.</p>
              <groupscancode--ml-scan-ocr
                name="card-3"
                value="${this.cardScanOcr}"
                facing="user"
                .autoCapture=${false}
                .loading=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardScanOcr = e.detail.value;
                }}
              >
                <Label>Capture Invoice Text</Label>
                <Trigger>Upload or Use Front Camera</Trigger>
                <Helper>Hold the document steady for clearer OCR.</Helper>
                <Result>Extracted: ${this.cardScanOcr || 'Processing…'}</Result>
              </groupscancode--ml-scan-ocr>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Document Scanner</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-scan-document</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Capture full documents like IDs or passports.</p>
              <groupscancode--ml-scan-document
                name="card-4"
                value="${this.cardScanDocument}"
                facing="environment"
                .autoCapture=${true}
                .captureInterval=${600}
                .loading=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardScanDocument = e.detail.value;
                }}
              >
                <Label>Scan Identity Document</Label>
                <Trigger>Open Scanner</Trigger>
                <Helper>Ensure all corners are visible for best detection.</Helper>
                <Result>Result: ${this.cardScanDocument || 'No document detected'}</Result>
              </groupscancode--ml-scan-document>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // SECTION: Reference Table
  // ==========================================================================='
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{
      scenario: string;
      scanCode1d: boolean;
      scanCode: boolean;
      scanOcr: boolean;
      scanDocument: boolean;
    }> = [
      { scenario: 'Scan linear barcodes on retail labels or tickets.', scanCode1d: true, scanCode: false, scanOcr: false, scanDocument: false },
      { scenario: 'Capture QR codes for payments, check-ins, or deep links.', scanCode1d: false, scanCode: true, scanOcr: false, scanDocument: false },
      { scenario: 'Extract text blocks from receipts or invoices with OCR.', scanCode1d: false, scanCode: false, scanOcr: true, scanDocument: false },
      { scenario: 'Capture full-page documents or IDs with edge detection.', scanCode1d: false, scanCode: false, scanOcr: false, scanDocument: true },
    ];
    const headers = [
      { label: '1D Barcode', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'QR Code', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'OCR Text', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Document', cls: 'text-rose-600 dark:text-rose-400' },
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
                    `,
                  )}
                </tr>
              </thead>
              <tbody>
                ${rows.map(
                  (row, i) => html`
                    <tr class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0">
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                      ${([row.scanCode1d, row.scanCode, row.scanOcr, row.scanDocument] as boolean[]).map(
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

  // ===========================================================================
  // SECTION: Render
  // ==========================================================================='
  override render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }
}
