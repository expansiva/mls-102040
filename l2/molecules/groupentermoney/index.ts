/// <mls fileReference="_102040_/l2/molecules/groupentermoney/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';

// ── Component imports ───────────────────────────────────────────────────────
import '/_102040_/l2/molecules/groupentermoney/ml-enter-money-br';
import '/_102040_/l2/molecules/groupentermoney/ml-enter-money-display';
import '/_102040_/l2/molecules/groupentermoney/ml-enter-money-minimal';
import '/_102040_/l2/molecules/groupentermoney/ml-currency-input';
import { molecules, scenarios } from '/_102040_/l2/molecules/groupentermoney/index.defs.js';
import { renderCatalogReferenceTable } from '/_102020_/l2/aura/molecules/shared/indexReferenceTable.js';

@customElement('molecules--groupentermoney--index-102040')
export class GroupEnterMoneyIndex extends StateLitElement {
  // ── Showcase card states ───────────────────────────────────────────────────
  @state() private cardBr: number | null = 1234.56;
  @state() private cardDisplay: number | null = 9876.5;
  @state() private cardMinimal: number | null = 2500;
  @state() private cardCurrency: number | null = 1999.99;

  // ===========================================================================
  // SECTION: HERO
  // ===========================================================================
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupEnterMoney
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Enter Money
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to input monetary values with locale‑aware formatting. Ideal for prices, payments, budgets, and financial transactions. Handles currency symbols, thousand separators, and decimal precision.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SECTION: SHOWCASE CARDS
  // ===========================================================================
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <!-- Card 1: ml-enter-money-br -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Brazilian Real Input</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupentermoney--ml-enter-money-br</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Currency‑aware input for BRL</p>
              <groupentermoney--ml-enter-money-br
                name="price-br"
                .value=${this.cardBr}
                currency="BRL"
                locale="pt-BR"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardBr = e.detail.value; }}
              >
                <Label>Preço (BRL)</Label>
                <Helper>Informe o valor em reais</Helper>
              </groupentermoney--ml-enter-money-br>
            </div>
          </div>

          <!-- Card 2: ml-enter-money-display -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Formatted Display</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupentermoney--ml-enter-money-display</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Read‑only formatted value</p>
              <groupentermoney--ml-enter-money-display
                name="price-display"
                .value=${this.cardDisplay}
                currency="USD"
                locale="en-US"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardDisplay = e.detail.value; }}
              >
                <Label>Price (USD)</Label>
                <Helper>Shows formatted amount</Helper>
              </groupentermoney--ml-enter-money-display>
            </div>
          </div>

          <!-- Card 3: ml-enter-money-minimal -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Minimal Input</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupentermoney--ml-enter-money-minimal</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Bare‑bones monetary field</p>
              <groupentermoney--ml-enter-money-minimal
                name="price-min"
                .value=${this.cardMinimal}
                currency="EUR"
                locale="de-DE"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardMinimal = e.detail.value; }}
              >
                <Label>Preis (EUR)</Label>
                <Helper>Nur den Betrag eingeben</Helper>
              </groupentermoney--ml-enter-money-minimal>
            </div>
          </div>

          <!-- Card 4: ml-currency-input -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Full Currency Input</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupentermoney--ml-currency-input</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">All‑features monetary component</p>
              <groupentermoney--ml-currency-input
                name="price-full"
                .value=${this.cardCurrency}
                currency="GBP"
                locale="en-GB"
                .decimals=${2}
                .showSymbol=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardCurrency = e.detail.value; }}
              >
                <Label>Price (GBP)</Label>
                <Helper>Enter amount in pounds sterling</Helper>
              </groupentermoney--ml-currency-input>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // SECTION: REFERENCE TABLE
  // ===========================================================================
  private renderReferenceTable(): TemplateResult {
    return renderCatalogReferenceTable(molecules, scenarios);
  }

  // ===========================================================================
  // MAIN RENDER
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
}
