/// <mls fileReference="_102040_/l2/molecules/groupenternumberinterval/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupenternumberinterval/ml-number-range-slider';
import '/_102040_/l2/molecules/groupenternumberinterval/ml-number-interval-inputs';
import { molecules, scenarios } from '/_102040_/l2/molecules/groupenternumberinterval/index.defs.js';
import { renderCatalogReferenceTable } from '/_102020_/l2/aura/molecules/shared/indexReferenceTable.js';

@customElement('molecules--groupenternumberinterval--index-102040')
export class GroupEnterNumberIntervalIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private card1Start: number | null = 100;
  @state() private card1End: number | null = 500;
  @state() private card2Start: number | null = 18;
  @state() private card2End: number | null = 65;
  @state() private card3Start: number | null = 2.5;
  @state() private card3End: number | null = 12.0;

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

  // =========================================================================== HERO
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupEnterNumberInterval
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Enter Number Interval
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to input a numeric range with a lower and an upper value. Ideal for price bands, age brackets, value filters, weight or measurement ranges, and any bounded numeric interval. Implementations include dual-handle range slider and from/to number inputs.
        </p>
      </header>
    `;
  }

  // =========================================================================== SHOWCASE CARDS
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Range Slider</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupenternumberinterval--ml-number-range-slider</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Dual-handle slider for visual price-band selection</p>
              <groupenternumberinterval--ml-number-range-slider
                name="card-1"
                .startValue=${this.card1Start}
                .endValue=${this.card1End}
                .min=${0}
                .max=${1000}
                .step=${50}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.card1Start = e.detail.startValue; this.card1End = e.detail.endValue; }}>
                <Label>Price range</Label>
                <LabelStart>From</LabelStart>
                <LabelEnd>To</LabelEnd>
                <Prefix>$</Prefix>
                <Helper>Drag the handles to set your budget</Helper>
              </groupenternumberinterval--ml-number-range-slider>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Interval Inputs</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupenternumberinterval--ml-number-interval-inputs</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">From/to number fields for precise age brackets</p>
              <groupenternumberinterval--ml-number-interval-inputs
                name="card-2"
                .startValue=${this.card2Start}
                .endValue=${this.card2End}
                .min=${0}
                .max=${120}
                .step=${1}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.card2Start = e.detail.startValue; this.card2End = e.detail.endValue; }}>
                <Label>Age bracket</Label>
                <LabelStart>Min age</LabelStart>
                <LabelEnd>Max age</LabelEnd>
                <Suffix>yrs</Suffix>
                <Helper>Enter the minimum and maximum age</Helper>
              </groupenternumberinterval--ml-number-interval-inputs>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Range Slider · decimals &amp; gap</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupenternumberinterval--ml-number-range-slider</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Weight range with decimal step and a minimum gap</p>
              <groupenternumberinterval--ml-number-range-slider
                name="card-3"
                .startValue=${this.card3Start}
                .endValue=${this.card3End}
                .min=${0}
                .max=${50}
                .step=${0.5}
                .decimals=${1}
                .minGap=${5}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.card3Start = e.detail.startValue; this.card3End = e.detail.endValue; }}>
                <Label>Weight range</Label>
                <LabelStart>Minimum</LabelStart>
                <LabelEnd>Maximum</LabelEnd>
                <Suffix>kg</Suffix>
                <Helper>Minimum gap of 5 kg between limits</Helper>
              </groupenternumberinterval--ml-number-range-slider>
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
}
