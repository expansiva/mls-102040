/// <mls fileReference="_102040_/l2/molecules/groupenternumber/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
// Import molecule components
import '/_102040_/l2/molecules/groupenternumber/ml-number-input';
import '/_102040_/l2/molecules/groupenternumber/ml-number-stepper';
import '/_102040_/l2/molecules/groupenternumber/ml-range-slider';
import '/_102040_/l2/molecules/groupenternumber/ml-floating-number-input';

@customElement('molecules--groupenternumber--index-102040')
export class GroupEnterNumberIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardNumberInput: number = 42;
  @state() private cardNumberStepper: number = 5;
  @state() private cardRangeSlider: number = 50;
  @state() private cardFloatingNumberInput: number = 3.14;

  // =========================================================================== HERO
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

  // =========================================================================== SHOWCASE CARDS
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <!-- Number Input -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Number Input</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupenternumber--ml-number-input</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Standard numeric entry field</p>
              <groupenternumber--ml-number-input
                name="card-number-input"
                .value=${this.cardNumberInput}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardNumberInput = e.detail.value; }}
              >
                <Label>Quantity</Label>
                <Helper>Enter a whole number</Helper>
                <Prefix>#</Prefix>
                <Suffix>pcs</Suffix>
              </groupenternumber--ml-number-input>
            </div>
          </div>
          <!-- Number Stepper -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Number Stepper</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupenternumber--ml-number-stepper</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Increment / decrement controls</p>
              <groupenternumber--ml-number-stepper
                name="card-number-stepper"
                .value=${this.cardNumberStepper}
                .min=${1}
                .max=${10}
                .step=${1}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardNumberStepper = e.detail.value; }}
              >
                <Label>Items</Label>
                <Helper>Choose quantity</Helper>
                <Suffix>items</Suffix>
              </groupenternumber--ml-number-stepper>
            </div>
          </div>
          <!-- Range Slider -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Range Slider</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupenternumber--ml-range-slider</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Select a value within a range</p>
              <groupenternumber--ml-range-slider
                name="card-range-slider"
                .value=${this.cardRangeSlider}
                .min=${0}
                .max=${100}
                .step=${5}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardRangeSlider = e.detail.value; }}
              >
                <Label>Progress</Label>
                <Helper>0 % – 100 %</Helper>
                <Suffix>%</Suffix>
              </groupenternumber--ml-range-slider>
            </div>
          </div>
          <!-- Floating Number Input -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Floating Number Input</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupenternumber--ml-floating-number-input</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Supports decimals and locale formatting</p>
              <groupenternumber--ml-floating-number-input
                name="card-floating-number-input"
                .value=${this.cardFloatingNumberInput}
                .decimals=${2}
                .locale="en-US"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardFloatingNumberInput = e.detail.value; }}
              >
                <Label>Weight</Label>
                <Helper>Enter weight in kilograms</Helper>
                <Suffix>kg</Suffix>
              </groupenternumber--ml-floating-number-input>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================================== REFERENCE TABLE
  private renderReferenceTable(): TemplateResult {
    interface Row {
      scenario: string;
      numberInput: boolean;
      numberStepper: boolean;
      rangeSlider: boolean;
      floatingNumberInput: boolean;
    }

    const headers: { key: keyof Row; label: string; cls: string }[] = [
      { key: 'numberInput', label: 'Number Input', cls: 'text-violet-600 dark:text-violet-400' },
      { key: 'numberStepper', label: 'Number Stepper', cls: 'text-emerald-600 dark:text-emerald-400' },
      { key: 'rangeSlider', label: 'Range Slider', cls: 'text-amber-600 dark:text-amber-400' },
      { key: 'floatingNumberInput', label: 'Floating Number Input', cls: 'text-rose-600 dark:text-rose-400' },
    ];

    const rows: Row[] = [
      { scenario: 'Simple quantity', numberInput: true, numberStepper: true, rangeSlider: false, floatingNumberInput: false },
      { scenario: 'Precise measurement', numberInput: true, numberStepper: true, rangeSlider: true, floatingNumberInput: true },
      { scenario: 'Percentage', numberInput: false, numberStepper: false, rangeSlider: true, floatingNumberInput: false },
      { scenario: 'Range selection', numberInput: false, numberStepper: false, rangeSlider: true, floatingNumberInput: false },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">Choose the most appropriate numeric entry component based on the interaction pattern you need.</p>
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <th class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-3/4">Scenario</th>
                  ${headers.map(h => html`
                    <th class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}">${h.label}</th>
                  `)}
                </tr>
              </thead>
              <tbody>
                ${rows.map((row, i) => html`
                  <tr class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0">
                    <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                    ${headers.map(h => html`
                      <td class="px-4 py-3.5 text-center">
                        ${row[h.key]
                          ? html`<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>`
                          : html`<span class="text-slate-200 dark:text-slate-700 text-sm">—</span>`}
                      </td>
                    `)}
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================================== RENDER
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
