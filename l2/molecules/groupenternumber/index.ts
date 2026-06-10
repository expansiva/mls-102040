/// <mls fileReference="_102040_/l2/molecules/groupenternumber/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupenternumber/ml-number-input';
import '/_102040_/l2/molecules/groupenternumber/ml-number-stepper';
import '/_102040_/l2/molecules/groupenternumber/ml-range-slider';

@customElement('molecules--groupenternumber--index-102040')
export class GroupEnterNumberIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardInputValue = 249.99;
  @state() private cardStepperValue = 3;
  @state() private cardSliderValue = 65;

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
          Allows the user to input numeric values. Ideal for quantities, measurements, percentages, ages, weights, and numeric configurations. Implementations include number input, stepper, slider, percentage input, and quantity selector.
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Price input</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupenternumber--ml-number-input</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Use a direct numeric field when precision matters.</p>
              <groupenternumber--ml-number-input
                name="card-input"
                placeholder="0.00"
                .value=${this.cardInputValue}
                .min=${0}
                .max=${9999}
                .step=${0.01}
                .decimals=${2}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardInputValue = e.detail.value;
                }}
              >
                <Label>Unit price</Label>
                <Helper>Enter the unit cost before tax.</Helper>
                <Prefix>$</Prefix>
                <Suffix>USD</Suffix>
              </groupenternumber--ml-number-input>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Quantity stepper</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupenternumber--ml-number-stepper</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Great for small ranges and step-by-step adjustments.</p>
              <groupenternumber--ml-number-stepper
                name="card-stepper"
                placeholder="0"
                .value=${this.cardStepperValue}
                .min=${1}
                .max=${12}
                .step=${1}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardStepperValue = e.detail.value;
                }}
              >
                <Label>Team seats</Label>
                <Helper>Choose how many licenses to provision.</Helper>
                <Prefix>×</Prefix>
                <Suffix>seats</Suffix>
              </groupenternumber--ml-number-stepper>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Range slider</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupenternumber--ml-range-slider</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Use sliders for expressive ranges like percentages.</p>
              <groupenternumber--ml-range-slider
                name="card-slider"
                placeholder="0"
                .value=${this.cardSliderValue}
                .min=${0}
                .max=${100}
                .step=${5}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardSliderValue = e.detail.value;
                }}
              >
                <Label>Confidence level</Label>
                <Helper>Drag to set the desired target.</Helper>
                <Prefix>≈</Prefix>
                <Suffix>%</Suffix>
              </groupenternumber--ml-range-slider>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{ scenario: string; numberInput: boolean; numberStepper: boolean; rangeSlider: boolean }> = [
      { scenario: 'Precise, typed entry with decimals or currency', numberInput: true, numberStepper: false, rangeSlider: false },
      { scenario: 'Small integer range where users tap up/down quickly', numberInput: false, numberStepper: true, rangeSlider: false },
      { scenario: 'Expressive ranges like percentages or confidence levels', numberInput: false, numberStepper: false, rangeSlider: true },
      { scenario: 'Works well when values must stay within hard min/max', numberInput: true, numberStepper: true, rangeSlider: true },
    ];
    const headers = [
      { label: 'Number input', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Number stepper', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Range slider', cls: 'text-amber-600 dark:text-amber-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this guide to pick the right numeric input pattern for quantities, measurements, and range-based settings.
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
                      ${([row.numberInput, row.numberStepper, row.rangeSlider] as boolean[]).map(
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

  render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }
}
