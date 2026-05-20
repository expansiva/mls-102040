/// <mls fileReference="_102040_/l2/molecules/groupnavigatesteps/index.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupnavigatesteps/ml-horizontal-stepper';

@customElement('molecules--groupnavigatesteps--index-102040')
export class GroupNavigateStepsIndex extends StateLitElement {

  @state() cardCheckout  = 1;
  @state() cardOnboard   = 2;
  @state() cardSetup     = 0;

  // ===========================================================================
  // HERO
  // ===========================================================================

  private renderHero(): TemplateResult {
    return html`
<header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
  <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
    groupNavigateSteps
  </span>
  <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
    Navigate Steps
  </h1>
  <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
    A horizontal stepper that guides users through multi-step flows — from simple checkout sequences
    to free-navigation wizards where any completed step can be revisited at any time.
  </p>
</header>`;
  }

  // ===========================================================================
  // SHOWCASE CARDS
  // ===========================================================================

  private renderShowcaseCards(): TemplateResult {
    return html`
<section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
  <div class="max-w-2xl mx-auto flex flex-col gap-5">

    <!-- Checkout flow (linear) -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="h-1 bg-sky-500"></div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Horizontal Stepper — Linear</p>
          <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-horizontal-stepper</code>
        </div>
        <p class="text-xs text-slate-400 mb-5">Sequential flows — each step unlocks after the previous one</p>
        <groupnavigatesteps--ml-horizontal-stepper
          .value=${this.cardCheckout}
          .linear=${true}
          @change=${(e: CustomEvent) => { this.cardCheckout = e.detail.value; }}
        >
          <Label>Checkout</Label>
          <Step title="Cart"></Step>
          <Step title="Shipping"></Step>
          <Step title="Payment"></Step>
          <Step title="Confirm"></Step>
        </groupnavigatesteps--ml-horizontal-stepper>
      </div>
    </div>

    <!-- Onboarding (non-linear) -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="h-1 bg-emerald-500"></div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Horizontal Stepper — Non-linear</p>
          <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-horizontal-stepper</code>
        </div>
        <p class="text-xs text-slate-400 mb-5">Free navigation — jump to any step to review or edit</p>
        <groupnavigatesteps--ml-horizontal-stepper
          .value=${this.cardOnboard}
          .linear=${false}
          @change=${(e: CustomEvent) => { this.cardOnboard = e.detail.value; }}
        >
          <Label>Onboarding</Label>
          <Step title="Account" completed></Step>
          <Step title="Team" completed></Step>
          <Step title="Profile"></Step>
          <Step title="Launch"></Step>
        </groupnavigatesteps--ml-horizontal-stepper>
      </div>
    </div>

    <!-- Setup wizard with descriptions -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="h-1 bg-violet-500"></div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Horizontal Stepper — With descriptions</p>
          <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-horizontal-stepper</code>
        </div>
        <p class="text-xs text-slate-400 mb-5">Steps with subtitles for additional context</p>
        <groupnavigatesteps--ml-horizontal-stepper
          .value=${this.cardSetup}
          .linear=${true}
          @change=${(e: CustomEvent) => { this.cardSetup = e.detail.value; }}
        >
          <Label>Setup wizard</Label>
          <Step title="Connect" description="Link your data source"></Step>
          <Step title="Configure" description="Define your workflow"></Step>
          <Step title="Go Live" description="Launch and monitor"></Step>
        </groupnavigatesteps--ml-horizontal-stepper>
      </div>
    </div>

  </div>
</section>`;
  }

  // ===========================================================================
  // REFERENCE TABLE
  // ===========================================================================

  private renderReferenceTable(): TemplateResult {
    const rows: Array<{
      scenario: string;
      linear: boolean; nonLinear: boolean;
    }> = [
      { scenario: 'Multi-step form requiring sequential completion',    linear: true,  nonLinear: false },
      { scenario: 'Checkout or payment flow with per-step validation', linear: true,  nonLinear: false },
      { scenario: 'Onboarding wizard with a required order',           linear: true,  nonLinear: false },
      { scenario: 'Any completed step can be revisited and edited',    linear: false, nonLinear: true  },
      { scenario: 'Steps are independent and can be done in any order',linear: false, nonLinear: true  },
      { scenario: 'Progress tracker where order does not matter',      linear: false, nonLinear: true  },
      { scenario: 'Strict workflow requiring prior step completion',   linear: true,  nonLinear: false },
    ];
    const headers = [
      { label: 'linear',     cls: 'text-sky-600 dark:text-sky-400'         },
      { label: 'non-linear', cls: 'text-emerald-600 dark:text-emerald-400' },
    ];
    return html`
<section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">Choose the navigation mode based on whether step order must be enforced.</p>
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-1/2">
              Scenario
            </th>
            ${headers.map(h => html`
              <th class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}">${h.label}</th>
            `)}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row, i) => html`
            <tr class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0">
              <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
              ${([row.linear, row.nonLinear] as boolean[]).map(ok => html`
                <td class="px-4 py-3.5 text-center">
                  ${ok
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
</section>`;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================

  render() {
    return html`
<div class="font-sans min-h-screen">
  ${this.renderHero()}
  ${this.renderShowcaseCards()}
  ${this.renderReferenceTable()}
</div>`;
  }
}
