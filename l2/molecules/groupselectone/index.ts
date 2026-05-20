/// <mls fileReference="_102040_/l2/molecules/groupselectone/index-e.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupselectone/ml-radio-group';
import '/_102040_/l2/molecules/groupselectone/ml-segmented-control';
import '/_102040_/l2/molecules/groupselectone/ml-discrete-slider';
import '/_102040_/l2/molecules/groupselectone/ml-select-one-autocomplete';

// ===========================================================================
// OPTION E — Combined approach
//
// Structure:
//   1. Hero (full-width text, centered)
//   2. Showcase cards — all 5 components visible on load, stacked vertically
//   3. Quick-reference table
// ===========================================================================

@customElement('molecules--groupselectone--index-102040')
export class GroupSelectOneIndexE extends StateLitElement {

  // ── Showcase card states ─────────────────────────────────────
  @state() cardToggle  = 'enabled';
  @state() cardCycle   = 'monthly';
  @state() cardPlan    = 'pro';
  @state() cardSat     = '50';
  @state() cardCountry = 'BR';

  // ===========================================================================
  // HERO
  // ===========================================================================

  private renderHero(): TemplateResult {
    return html`
<header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
  <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
    groupSelectOne
  </span>
  <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
    Select One
  </h1>
  <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
    Every component in this group solves the same problem — picking exactly one option from a set —
    but each is built for a different interaction context. Try them below.
  </p>
</header>`;
  }

  // ===========================================================================
  // SHOWCASE CARDS — all 5 components visible on load
  // ===========================================================================

  private renderShowcaseCards(): TemplateResult {
    return html`
<section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
  <div class="max-w-2xl mx-auto flex flex-col gap-5">

    <!-- Segmented Control -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="h-1 bg-emerald-500"></div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Segmented Control</p>
          <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-segmented-control</code>
        </div>
        <p class="text-xs text-slate-400 mb-5">2–5 compact inline options</p>
        <groupselectone--ml-segmented-control
          value="${this.cardCycle}" name="card-cycle" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.cardCycle = e.detail.value; }}>
          <Label>View</Label>
          <Item value="monthly">List</Item>
          <Item value="quarterly">Grid</Item>
          <Item value="yearly">Board</Item>
        </groupselectone--ml-segmented-control>
      </div>
    </div>

    <!-- Radio Group -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="h-1 bg-violet-500"></div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Radio Group</p>
          <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-radio-group</code>
        </div>
        <p class="text-xs text-slate-400 mb-5">All options always visible</p>
        <groupselectone--ml-radio-group
          value="${this.cardPlan}" name="card-plan" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.cardPlan = e.detail.value; }}>
          <Label>Plan</Label>
          <Item value="starter">Starter</Item>
          <Item value="pro">Pro</Item>
          <Item value="team">Team</Item>
        </groupselectone--ml-radio-group>
      </div>
    </div>

    <!-- Discrete Slider -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="h-1 bg-amber-500"></div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Discrete Slider</p>
          <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-discrete-slider</code>
        </div>
        <p class="text-xs text-slate-400 mb-5">Ordered options on a scale</p>
        <groupselectone--ml-discrete-slider
          value="${this.cardSat}" name="card-sat" .isEditing=${true} .fillPrevious=${true}
          @change=${(e: CustomEvent) => { this.cardSat = e.detail.value; }}>
          <Label>Satisfaction</Label>
          <Item value="0">0%</Item>
          <Item value="50">50%</Item>
          <Item value="100">100%</Item>
        </groupselectone--ml-discrete-slider>
      </div>
    </div>

    <!-- Autocomplete -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="h-1 bg-rose-500"></div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Autocomplete</p>
          <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-select-one-autocomplete</code>
        </div>
        <p class="text-xs text-slate-400 mb-5">Search through large lists</p>
        <groupselectone--ml-select-one-autocomplete
          value="${this.cardCountry}" name="card-country" .isEditing=${true} .clearable=${true} .searchable=${true}
          @change=${(e: CustomEvent) => { this.cardCountry = e.detail.value; }}>
          <Label>Country</Label>
          <Group label="Americas">
            <Item value="BR">Brazil</Item>
            <Item value="US">United States</Item>
            <Item value="CA">Canada</Item>
            <Item value="AR">Argentina</Item>
          </Group>
          <Group label="Europe">
            <Item value="PT">Portugal</Item>
            <Item value="DE">Germany</Item>
            <Item value="FR">France</Item>
          </Group>
        </groupselectone--ml-select-one-autocomplete>
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
      toggle: boolean; seg: boolean; radio: boolean; slider: boolean; auto: boolean;
    }> = [
      { scenario: 'Binary on/off, yes/no decision',                toggle: true,  seg: false, radio: false, slider: false, auto: false },
      { scenario: '2–5 compact options, inline layout',             toggle: false, seg: true,  radio: true,  slider: false, auto: false },
      { scenario: 'Options need visual side-by-side comparison',    toggle: false, seg: false, radio: true,  slider: false, auto: false },
      { scenario: 'Options have a natural ordinal order/scale',     toggle: false, seg: false, radio: false, slider: true,  auto: false },
      { scenario: 'Large list (10+ options)',                       toggle: false, seg: false, radio: false, slider: false, auto: true  },
      { scenario: 'User benefits from typing to filter',            toggle: false, seg: false, radio: false, slider: false, auto: true  },
      { scenario: 'All options visible simultaneously',             toggle: false, seg: true,  radio: true,  slider: true,  auto: false },
    ];
    const headers = [
      { label: 'Toggle',       cls: 'text-sky-600 dark:text-sky-400'         },
      { label: 'Segmented',    cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Radio',        cls: 'text-violet-600 dark:text-violet-400'   },
      { label: 'Slider',       cls: 'text-amber-600 dark:text-amber-400'     },
      { label: 'Autocomplete', cls: 'text-rose-600 dark:text-rose-400'       },
    ];
    return html`
<section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">Match your scenario to the right control at a glance.</p>
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
              ${([row.toggle, row.seg, row.radio, row.slider, row.auto] as boolean[]).map(ok => html`
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
