/// <mls fileReference="_102040_/l2/molecules/groupnavigatesteps/index.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupnavigatesteps/ml-horizontal-stepper';

@customElement('molecules--groupnavigatesteps--index-102040')
export class GroupNavigateStepsIndex extends StateLitElement {

  @state() cardStepper = 0;

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

    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="h-1 bg-sky-500"></div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Horizontal Stepper</p>
          <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-horizontal-stepper</code>
        </div>
        <p class="text-xs text-slate-400 mb-5">Steps with icons and descriptions</p>
        <groupnavigatesteps--ml-horizontal-stepper
          .value=${this.cardStepper}
          .linear=${true}
          @change=${(e: CustomEvent) => { this.cardStepper = e.detail.value; }}
        >
          <Label>Setup wizard</Label>
          <Step title="Connect" description="Link your data source">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
          </Step>
          <Step title="Configure" description="Define your workflow">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </Step>
          <Step title="Go Live" description="Launch and monitor">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/></svg>
          </Step>
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
      { scenario: 'Multi-step form requiring sequential completion',     linear: true,  nonLinear: false },
      { scenario: 'Checkout or payment flow with per-step validation',  linear: true,  nonLinear: false },
      { scenario: 'Onboarding wizard with a required order',            linear: true,  nonLinear: false },
      { scenario: 'Any completed step can be revisited and edited',     linear: false, nonLinear: true  },
      { scenario: 'Steps are independent and can be done in any order', linear: false, nonLinear: true  },
      { scenario: 'Progress tracker where order does not matter',       linear: false, nonLinear: true  },
      { scenario: 'Strict workflow requiring prior step completion',    linear: true,  nonLinear: false },
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
