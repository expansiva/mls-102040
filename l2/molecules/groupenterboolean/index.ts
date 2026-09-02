/// <mls fileReference="_102040_/l2/molecules/groupenterboolean/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupenterboolean/ml-boolean-segmented';
import '/_102040_/l2/molecules/groupenterboolean/ml-checkbox-preference';
import '/_102040_/l2/molecules/groupenterboolean/ml-toggle-icon';
import '/_102040_/l2/molecules/groupenterboolean/ml-toggle-switch';
import { molecules, scenarios } from '/_102040_/l2/molecules/groupenterboolean/index.defs.js';
import { renderCatalogReferenceTable } from '/_102020_/l2/aura/molecules/shared/indexReferenceTable.js';

@customElement('molecules--groupenterboolean--index-102040')
export class GroupEnterBooleanIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardOne = false;
  @state() private cardTwo = true;
  @state() private cardThree = false;
  @state() private cardFour = true;

  // ===========================================================================
  // HERO
  // ===========================================================================
  private renderHero(): TemplateResult {
    return html`
      <header
        class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center"
      >
        <span
          class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
        >
          groupEnterBoolean
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Enter Boolean
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to input a true/false decision with a consistent boolean value contract. Toggle, switch, and
          checkbox implementations are interchangeable by swapping the component tag.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SHOWCASE CARDS
  // ===========================================================================
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section
        class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700"
      >
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Boolean segmented</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupenterboolean--ml-boolean-segmented</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Binary choice with segmented buttons for quick scanning.</p>
              <groupenterboolean--ml-boolean-segmented
                name="card-1"
                .value=${this.cardOne}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardOne = e.detail.value;
                }}
              >
                <Label>Enable smart scheduling</Label>
                <Helper>Switch between Yes and No without leaving the keyboard.</Helper>
              </groupenterboolean--ml-boolean-segmented>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Checkbox preference</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupenterboolean--ml-checkbox-preference</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Ideal for consent and acknowledgement confirmations.</p>
              <groupenterboolean--ml-checkbox-preference
                name="card-2"
                .value=${this.cardTwo}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardTwo = e.detail.value;
                }}
              >
                <Label>I agree to the usage policy</Label>
                <Helper>Required to activate the account.</Helper>
              </groupenterboolean--ml-checkbox-preference>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Toggle icon</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupenterboolean--ml-toggle-icon</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Compact icon toggle for quick feature enablement.</p>
              <groupenterboolean--ml-toggle-icon
                name="card-3"
                .value=${this.cardThree}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardThree = e.detail.value;
                }}
              >
                <Label>Pin dashboard shortcuts</Label>
                <Helper>Keep this section visible on every visit.</Helper>
              </groupenterboolean--ml-toggle-icon>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Toggle switch</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupenterboolean--ml-toggle-switch</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Classic switch for settings and preferences panels.</p>
              <groupenterboolean--ml-toggle-switch
                name="card-4"
                .value=${this.cardFour}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardFour = e.detail.value;
                }}
              >
                <Label>Send weekly summary</Label>
                <Helper>We will email a report every Monday morning.</Helper>
              </groupenterboolean--ml-toggle-switch>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  // ===========================================================================
  private renderReferenceTable(): TemplateResult {
    return renderCatalogReferenceTable(molecules, scenarios);
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  protected render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()} ${this.renderShowcaseCards()} ${this.renderReferenceTable()}
      </div>
    `;
  }
}
