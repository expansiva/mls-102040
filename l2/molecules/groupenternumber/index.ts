/// <mls fileReference="_102040_/l2/molecules/groupenternumber/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupenternumber/ml-number-input';
import '/_102040_/l2/molecules/groupenternumber/ml-number-stepper';

@customElement('molecules--groupenternumber--index-102040')
export class GroupEnterNumberIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardInput = 42;
  @state() private cardStepper = 3;

  // ===========================================================================
  // HERO
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupEnterNumber
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Enter Number
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to input numeric values. Ideal for quantities, measurements, percentages, ages, weights, and numeric configurations with input and stepper implementations.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SHOWCASE CARDS
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Number Input</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-number-input</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Free-form numeric entry with formatting, prefix, and suffix support.</p>
              <groupenternumber--ml-number-input
                name="card-input"
                .value=${this.cardInput}
                .isEditing=${true}
                .min=${0}
                .max=${250}
                .decimals=${0}
                placeholder="0"
                @change=${(e: CustomEvent) => {
                  this.cardInput = e.detail.value;
                }}
              >
                <Label>Target weight</Label>
                <Helper>Enter the weight in kilograms.</Helper>
                <Prefix>≈</Prefix>
                <Suffix>kg</Suffix>
              </groupenternumber--ml-number-input>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Number Stepper</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-number-stepper</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Controlled quantity selection with step increments.</p>
              <groupenternumber--ml-number-stepper
                name="card-stepper"
                .value=${this.cardStepper}
                .isEditing=${true}
                .min=${1}
                .max=${12}
                .step=${1}
                placeholder="1"
                @change=${(e: CustomEvent) => {
                  this.cardStepper = e.detail.value;
                }}
              >
                <Label>Team seats</Label>
                <Helper>Pick the number of seats for this plan.</Helper>
                <Prefix>Qty</Prefix>
                <Suffix>seats</Suffix>
              </groupenternumber--ml-number-stepper>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{ scenario: string; input: boolean; stepper: boolean }> = [
      { scenario: 'User can type any numeric value, including large ranges.', input: true, stepper: false },
      { scenario: 'Quantity should be adjusted in fixed increments.', input: false, stepper: true },
      { scenario: 'Need to show unit prefix or suffix with formatting.', input: true, stepper: true },
    ];
    const headers = [
      { label: 'Number Input', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Number Stepper', cls: 'text-emerald-600 dark:text-emerald-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Choose the numeric control that best matches how tightly you want to constrain input for quantities and measurements.
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
                      ${([row.input, row.stepper] as boolean[]).map(
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

  // ===========================================================================
  // RENDER
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
