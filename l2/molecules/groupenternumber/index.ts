/// <mls fileReference="_102040_/l2/molecules/groupenternumber/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
// Import molecule components
import '/_102040_/l2/molecules/groupenternumber/ml-number-input';
import '/_102040_/l2/molecules/groupenternumber/ml-number-stepper';
import '/_102040_/l2/molecules/groupenternumber/ml-range-slider';
import '/_102040_/l2/molecules/groupenternumber/ml-floating-number-input';
import { molecules, scenarios } from '/_102040_/l2/molecules/groupenternumber/index.defs.js';
import { renderCatalogReferenceTable } from '/_102020_/l2/aura/molecules/shared/indexReferenceTable.js';

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
    return renderCatalogReferenceTable(molecules, scenarios);
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
