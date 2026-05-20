/// <mls fileReference="_102040_/l2/molecules/groupselectone/index-e.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupselectone/ml-radio-group';
import '/_102040_/l2/molecules/groupselectone/ml-segmented-control';
import '/_102040_/l2/molecules/groupselectone/ml-toggle-switch';
import '/_102040_/l2/molecules/groupselectone/ml-discrete-slider';
import '/_102040_/l2/molecules/groupselectone/ml-select-one-autocomplete';

// ===========================================================================
// OPTION E — Combined approach
//
// Structure:
//   1. Hero (full-width text, centered)
//   2. Showcase cards — all 5 components visible without scrolling,
//      arranged in a 3-column grid with labels and tags
//   3. One scenario section per component (component inside a realistic
//      app mockup, alternating left/right layout)
//   4. Quick-reference table
// ===========================================================================

@customElement('molecules--groupselectone--index-e-102040')
export class GroupSelectOneIndexE extends StateLitElement {

  // ── Showcase card states ─────────────────────────────────────
  @state() cardToggle  = 'enabled';
  @state() cardCycle   = 'monthly';
  @state() cardPlan    = 'pro';
  @state() cardSat     = '50';
  @state() cardCountry = 'BR';

  // ── Scenario section states ──────────────────────────────────
  @state() scenToggles: Record<string, string> = {
    notifications: 'enabled', twoFactor: 'disabled', publicProfile: 'visible',
  };
  @state() scenPlan    = 'pro';
  @state() scenCycle   = 'monthly';
  @state() scenSat     = 'good';
  @state() scenCountry = 'BR';

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

    <!-- Toggle Switch -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="h-1 bg-sky-500"></div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Toggle Switch</p>
          <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-toggle-switch</code>
        </div>
        <p class="text-xs text-slate-400 mb-5">Binary on/off decisions</p>
        <groupselectone--ml-toggle-switch
          value="${this.cardToggle}" name="card-toggle" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.cardToggle = e.detail.value; }}>
          <Label>Dark mode</Label>
          <Item value="disabled">Light</Item>
          <Item value="enabled">Dark</Item>
        </groupselectone--ml-toggle-switch>
      </div>
    </div>

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
  // SCENARIO LAYOUT HELPER
  // ===========================================================================

  private renderScenario(
    mockupOn: 'left' | 'right',
    tag: string,
    title: string,
    description: string,
    mockup: TemplateResult,
  ): TemplateResult {
    const text = html`
      <div class="flex flex-col justify-center">
        <span class="text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-3">${tag}</span>
        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4 leading-tight">${title}</h2>
        <p class="text-base text-slate-500 dark:text-slate-400 leading-relaxed">${description}</p>
      </div>`;
    const frame = html`<div>${mockup}</div>`;
    return html`
<div class="grid grid-cols-2 gap-12 items-center">
  ${mockupOn === 'left' ? html`${frame}${text}` : html`${text}${frame}`}
</div>`;
  }

  // ===========================================================================
  // COMPONENT SECTIONS
  // ===========================================================================

  private renderToggleSection(): TemplateResult {
    return html`
<section class="bg-white dark:bg-slate-900 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
  <div class="max-w-5xl mx-auto">
    ${this.renderScenario('right', 'Toggle Switch', 'Settings that feel instant.',
      'Binary decisions deserve a binary control. Toggle Switch communicates state change immediately — no confirmation dialog, no ambiguity. Built for preferences, feature flags, and any on/off control.',
      html`
        <div class="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Account Preferences</p>
            <p class="text-xs text-slate-400 mt-0.5">Notifications and privacy</p>
          </div>
          <div class="divide-y divide-slate-100 dark:divide-slate-700 px-5">
            <div class="py-4">
              <groupselectone--ml-toggle-switch value="${this.scenToggles.notifications}" name="scen-n1" .isEditing=${true}
                @change=${(e: CustomEvent) => { this.scenToggles = { ...this.scenToggles, notifications: e.detail.value }; }}>
                <Label>Email notifications</Label>
                <Helper>Receive alerts about account activity.</Helper>
                <Item value="disabled">Disabled</Item>
                <Item value="enabled">Enabled</Item>
              </groupselectone--ml-toggle-switch>
            </div>
            <div class="py-4">
              <groupselectone--ml-toggle-switch value="${this.scenToggles.twoFactor}" name="scen-n2" .isEditing=${true}
                @change=${(e: CustomEvent) => { this.scenToggles = { ...this.scenToggles, twoFactor: e.detail.value }; }}>
                <Label>Two-factor authentication</Label>
                <Helper>Add a second sign-in step.</Helper>
                <Item value="disabled">Disabled</Item>
                <Item value="enabled">Enabled</Item>
              </groupselectone--ml-toggle-switch>
            </div>
            <div class="py-4">
              <groupselectone--ml-toggle-switch value="${this.scenToggles.publicProfile}" name="scen-n3" .isEditing=${true}
                @change=${(e: CustomEvent) => { this.scenToggles = { ...this.scenToggles, publicProfile: e.detail.value }; }}>
                <Label>Public profile</Label>
                <Helper>Allow others to find your profile.</Helper>
                <Item value="hidden">Hidden</Item>
                <Item value="visible">Visible</Item>
              </groupselectone--ml-toggle-switch>
            </div>
          </div>
        </div>
      `
    )}
  </div>
</section>`;
  }

  private renderRadioSection(): TemplateResult {
    return html`
<section class="bg-slate-50 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
  <div class="max-w-5xl mx-auto">
    ${this.renderScenario('left', 'Radio Group', 'All options, always in sight.',
      'When choices need to be compared side by side, hiding them in a dropdown adds friction. Radio Group keeps every option visible — selection is fast, deliberate, and clear.',
      html`
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <p class="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">Choose a Plan</p>
          <groupselectone--ml-radio-group value="${this.scenPlan}" name="scen-plan" .isEditing=${true}
            @change=${(e: CustomEvent) => { this.scenPlan = e.detail.value; }}>
            <Item value="starter">Starter — Free forever</Item>
            <Item value="pro">Pro — $29 / month</Item>
            <Item value="team">Team — $79 / month</Item>
            <Item value="enterprise">Enterprise — Custom pricing</Item>
          </groupselectone--ml-radio-group>
          <div class="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 text-right">
            <button class="px-4 py-2 bg-sky-500 text-white text-sm font-semibold rounded-lg hover:bg-sky-600 transition-colors">
              Continue →
            </button>
          </div>
        </div>
      `
    )}
  </div>
</section>`;
  }

  private renderSegmentedSection(): TemplateResult {
    return html`
<section class="bg-white dark:bg-slate-900 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
  <div class="max-w-5xl mx-auto">
    ${this.renderScenario('right', 'Segmented Control', 'Compact switching, no dropdown overhead.',
      'For small, stable sets of mutually exclusive options, the segmented control is the most compact always-visible selector. State never disappears behind a click.',
      html`
        <div class="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-5">Billing Settings</p>
          <groupselectone--ml-segmented-control value="${this.scenCycle}" name="scen-cycle" .isEditing=${true}
            @change=${(e: CustomEvent) => { this.scenCycle = e.detail.value; }}>
            <Label>Billing cycle</Label>
            <Helper>Choose how often you'd like to be charged.</Helper>
            <Item value="monthly">Monthly</Item>
            <Item value="quarterly">Quarterly</Item>
            <Item value="yearly">Yearly (–20%)</Item>
          </groupselectone--ml-segmented-control>
        </div>
      `
    )}
  </div>
</section>`;
  }

  private renderSliderSection(): TemplateResult {
    return html`
<section class="bg-slate-50 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
  <div class="max-w-5xl mx-auto">
    ${this.renderScenario('left', 'Discrete Slider', 'Ordered choices on a scale.',
      'For ordinal options — satisfaction levels, seniority, priority tiers — a slider conveys the inherent ordering that a plain list cannot express. Fill Previous makes the progression tangible.',
      html`
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <p class="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Satisfaction Survey</p>
          <p class="text-xs text-slate-400 mb-6">How would you rate your overall experience?</p>
          <groupselectone--ml-discrete-slider value="${this.scenSat}" name="scen-sat" .isEditing=${true} .fillPrevious=${true}
            @change=${(e: CustomEvent) => { this.scenSat = e.detail.value; }}>
            <Item value="very-poor">Very Poor</Item>
            <Item value="poor">Poor</Item>
            <Item value="average">Average</Item>
            <Item value="good">Good</Item>
            <Item value="excellent">Excellent</Item>
          </groupselectone--ml-discrete-slider>
          <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 text-right">
            <button class="px-4 py-2 bg-sky-500 text-white text-sm font-semibold rounded-lg hover:bg-sky-600 transition-colors">
              Submit feedback
            </button>
          </div>
        </div>
      `
    )}
  </div>
</section>`;
  }

  private renderAutocompleteSection(): TemplateResult {
    return html`
<section class="bg-white dark:bg-slate-900 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
  <div class="max-w-5xl mx-auto">
    ${this.renderScenario('right', 'Select One Autocomplete', 'Search through hundreds. Land on one.',
      'When the list is too large to display at once, autocomplete lets users type to filter instantly. Supports grouped results, clearable selection, and full keyboard navigation.',
      html`
        <div class="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <p class="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">Shipping Address</p>
          <groupselectone--ml-select-one-autocomplete value="${this.scenCountry}" name="scen-country" .isEditing=${true} .clearable=${true} .searchable=${true}
            @change=${(e: CustomEvent) => { this.scenCountry = e.detail.value; }}>
            <Label>Country</Label>
            <Helper>Type to search or scroll to browse.</Helper>
            <Group label="South America">
              <Item value="BR">Brazil</Item>
              <Item value="AR">Argentina</Item>
              <Item value="CL">Chile</Item>
              <Item value="CO">Colombia</Item>
            </Group>
            <Group label="North America">
              <Item value="US">United States</Item>
              <Item value="CA">Canada</Item>
              <Item value="MX">Mexico</Item>
            </Group>
            <Group label="Europe">
              <Item value="DE">Germany</Item>
              <Item value="FR">France</Item>
              <Item value="PT">Portugal</Item>
              <Item value="ES">Spain</Item>
            </Group>
          </groupselectone--ml-select-one-autocomplete>
        </div>
      `
    )}
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
      { scenario: 'Binary on/off, yes/no decision',                  toggle: true,  seg: false, radio: false, slider: false, auto: false },
      { scenario: '2–5 compact options, inline layout',               toggle: false, seg: true,  radio: true,  slider: false, auto: false },
      { scenario: 'Options need visual side-by-side comparison',      toggle: false, seg: false, radio: true,  slider: false, auto: false },
      { scenario: 'Options have a natural ordinal order/scale',       toggle: false, seg: false, radio: false, slider: true,  auto: false },
      { scenario: 'Large list (10+ options)',                         toggle: false, seg: false, radio: false, slider: false, auto: true  },
      { scenario: 'User benefits from typing to filter',              toggle: false, seg: false, radio: false, slider: false, auto: true  },
      { scenario: 'All options visible simultaneously',               toggle: false, seg: true,  radio: true,  slider: true,  auto: false },
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
  ${this.renderToggleSection()}
  ${this.renderRadioSection()}
  ${this.renderSegmentedSection()}
  ${this.renderSliderSection()}
  ${this.renderAutocompleteSection()}
  ${this.renderReferenceTable()}
</div>`;
  }
}
