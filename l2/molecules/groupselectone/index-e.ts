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
//   1. Split hero (left: text | right: all 5 components in a grid)
//      → Components are visible immediately without scrolling.
//   2. One section per component:
//        a. Scenario (component inside a realistic app mockup)
//        b. Do / Don't cards (correct component vs. wrong component,
//           both rendered live so the difference is self-evident)
//   3. Quick-reference table at the bottom.
//
// State is fully independent between hero, scenario, DO, and DON'T
// instances of each component — interacting with one never affects another.
// ===========================================================================

@customElement('molecules--groupselectone--index-e-102040')
export class GroupSelectOneIndexE extends StateLitElement {

  // ── Hero mini-card states ────────────────────────────────────
  @state() heroToggle  = 'enabled';
  @state() heroCycle   = 'monthly';
  @state() heroPlan    = 'pro';
  @state() heroSat     = 'good';
  @state() heroCountry = 'BR';

  // ── Scenario section states ──────────────────────────────────
  @state() scenToggles: Record<string, string> = {
    notifications: 'enabled', twoFactor: 'disabled', publicProfile: 'visible',
  };
  @state() scenPlan    = 'pro';
  @state() scenCycle   = 'monthly';
  @state() scenSat     = 'good';
  @state() scenCountry = 'BR';

  // ── DO card states (independent from scenario) ───────────────
  @state() doToggle  = 'enabled';
  @state() doPlan    = 'pro';
  @state() doCycle   = 'monthly';
  @state() doSat     = 'good';
  @state() doCountry = 'BR';

  // ── DON'T card states (the wrong component for each context) ─
  @state() dontRadioForToggle  = 'enabled';  // Radio Group for a binary choice
  @state() dontAutoForRadio    = '';          // Autocomplete for a 4-option list
  @state() dontRadioForSeg     = 'monthly';  // Radio Group for compact modes
  @state() dontRadioForSlider  = 'good';     // Radio Group for ordinal options
  @state() dontRadioForAuto    = '';          // Radio Group for a long list

  // ===========================================================================
  // HERO — Split layout: text left, component grid right
  // ===========================================================================

  private renderHero(): TemplateResult {
    return html`
<header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-16">
  <div class="max-w-6xl mx-auto grid grid-cols-[1fr_1.5fr] gap-16 items-start">

    <!-- Left: text -->
    <div class="flex flex-col justify-center pt-2">
      <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-5">
        groupSelectOne
      </span>
      <h1 class="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4 leading-tight tracking-tight">
        Select One.<br/>Five controls, one contract.
      </h1>
      <p class="text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
        Every component in this group solves the same problem — picking exactly one option from a set —
        but each is built for a different interaction context.
      </p>
      <p class="text-sm text-slate-400 dark:text-slate-500">
        Scroll down for live scenario examples and visual Do / Don't comparisons.
      </p>
    </div>

    <!-- Right: 5 interactive mini-cards -->
    <div class="grid grid-cols-3 gap-3 items-start">

      <!-- Toggle Switch -->
      <div class="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <p class="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-3">Toggle Switch</p>
        <groupselectone--ml-toggle-switch
          value="${this.heroToggle}" name="h-toggle" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.heroToggle = e.detail.value; }}>
          <Item value="disabled">Off</Item>
          <Item value="enabled">On</Item>
        </groupselectone--ml-toggle-switch>
      </div>

      <!-- Segmented Control -->
      <div class="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <p class="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3">Segmented</p>
        <groupselectone--ml-segmented-control
          value="${this.heroCycle}" name="h-cycle" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.heroCycle = e.detail.value; }}>
          <Item value="monthly">List</Item>
          <Item value="quarterly">Grid</Item>
          <Item value="yearly">Board</Item>
        </groupselectone--ml-segmented-control>
      </div>

      <!-- Radio Group -->
      <div class="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <p class="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">Radio Group</p>
        <groupselectone--ml-radio-group
          value="${this.heroPlan}" name="h-plan" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.heroPlan = e.detail.value; }}>
          <Item value="starter">Starter</Item>
          <Item value="pro">Pro</Item>
          <Item value="team">Team</Item>
        </groupselectone--ml-radio-group>
      </div>

      <!-- Discrete Slider (spans 2 cols for horizontal comfort) -->
      <div class="col-span-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <p class="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3">Discrete Slider</p>
        <groupselectone--ml-discrete-slider
          value="${this.heroSat}" name="h-sat" .isEditing=${true} .fillPrevious=${true}
          @change=${(e: CustomEvent) => { this.heroSat = e.detail.value; }}>
          <Item value="poor">Poor</Item>
          <Item value="average">Average</Item>
          <Item value="good">Good</Item>
          <Item value="excellent">Excellent</Item>
        </groupselectone--ml-discrete-slider>
      </div>

      <!-- Autocomplete -->
      <div class="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <p class="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-3">Autocomplete</p>
        <groupselectone--ml-select-one-autocomplete
          value="${this.heroCountry}" name="h-country" .isEditing=${true} .clearable=${true} .searchable=${true}
          @change=${(e: CustomEvent) => { this.heroCountry = e.detail.value; }}>
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
</header>`;
  }

  // ===========================================================================
  // DO / DON'T CARD HELPERS
  // ===========================================================================

  private renderDoCard(label: string, component: TemplateResult): TemplateResult {
    return html`
<div class="rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 overflow-hidden">
  <div class="flex items-center gap-2 px-5 py-3 bg-emerald-100 dark:bg-emerald-900/50 border-b border-emerald-200 dark:border-emerald-800">
    <span class="text-emerald-700 dark:text-emerald-300 font-bold text-sm">✓ DO</span>
    <span class="text-emerald-700 dark:text-emerald-400 text-sm">${label}</span>
  </div>
  <div class="p-6 bg-emerald-50 dark:bg-emerald-950/30">${component}</div>
</div>`;
  }

  private renderDontCard(label: string, component: TemplateResult, instead: string): TemplateResult {
    return html`
<div class="rounded-2xl border-2 border-rose-200 dark:border-rose-800 overflow-hidden">
  <div class="flex items-center gap-2 px-5 py-3 bg-rose-100 dark:bg-rose-900/50 border-b border-rose-200 dark:border-rose-800">
    <span class="text-rose-700 dark:text-rose-300 font-bold text-sm">✗ DON'T</span>
    <span class="text-rose-700 dark:text-rose-400 text-sm">${label}</span>
  </div>
  <div class="p-6 bg-rose-50 dark:bg-rose-950/30">${component}</div>
  <div class="px-5 py-3 bg-rose-100/60 dark:bg-rose-900/30 border-t border-rose-200 dark:border-rose-800">
    <p class="text-xs font-medium text-rose-700 dark:text-rose-400">→ Use ${instead} instead</p>
  </div>
</div>`;
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
<div class="grid grid-cols-2 gap-12 items-center mb-12">
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

    <div class="grid grid-cols-2 gap-6">
      ${this.renderDoCard('use Toggle for binary on/off decisions', html`
        <groupselectone--ml-toggle-switch value="${this.doToggle}" name="do-toggle" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.doToggle = e.detail.value; }}>
          <Label>Email notifications</Label>
          <Item value="disabled">Disabled</Item>
          <Item value="enabled">Enabled</Item>
        </groupselectone--ml-toggle-switch>
        <p class="mt-3 text-xs text-emerald-700 dark:text-emerald-400">
          Clear binary semantics, minimal space — state is always visible without opening anything.
        </p>
      `)}
      ${this.renderDontCard('use Radio Group for a 2-option choice', html`
        <groupselectone--ml-radio-group value="${this.dontRadioForToggle}" name="dont-rtoggle" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.dontRadioForToggle = e.detail.value; }}>
          <Label>Email notifications</Label>
          <Item value="disabled">Disabled</Item>
          <Item value="enabled">Enabled</Item>
        </groupselectone--ml-radio-group>
        <p class="mt-3 text-xs text-rose-600 dark:text-rose-400">
          Radio Group is designed for comparing distinct options — using it for on/off wastes vertical space and implies the decision is more complex than it is.
        </p>
      `, 'Toggle Switch')}
    </div>

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

    <div class="grid grid-cols-2 gap-6">
      ${this.renderDoCard('use Radio Group for 3–6 options that benefit from comparison', html`
        <groupselectone--ml-radio-group value="${this.doPlan}" name="do-radio" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.doPlan = e.detail.value; }}>
          <Label>Plan</Label>
          <Item value="starter">Starter</Item>
          <Item value="pro">Pro</Item>
          <Item value="team">Team</Item>
          <Item value="enterprise">Enterprise</Item>
        </groupselectone--ml-radio-group>
        <p class="mt-3 text-xs text-emerald-700 dark:text-emerald-400">
          All options are simultaneously visible — users can compare and decide without opening anything.
        </p>
      `)}
      ${this.renderDontCard('use Autocomplete for a short, fixed list', html`
        <groupselectone--ml-select-one-autocomplete value="${this.dontAutoForRadio}" name="dont-auto-radio" .isEditing=${true} .searchable=${true}
          @change=${(e: CustomEvent) => { this.dontAutoForRadio = e.detail.value; }}>
          <Label>Plan</Label>
          <Item value="starter">Starter</Item>
          <Item value="pro">Pro</Item>
          <Item value="team">Team</Item>
          <Item value="enterprise">Enterprise</Item>
        </groupselectone--ml-select-one-autocomplete>
        <p class="mt-3 text-xs text-rose-600 dark:text-rose-400">
          Autocomplete hides 4 options behind a click and suggests users might need to search — adding friction where none is needed.
        </p>
      `, 'Radio Group')}
    </div>

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

    <div class="grid grid-cols-2 gap-6">
      ${this.renderDoCard('use Segmented for 2–5 compact inline options', html`
        <groupselectone--ml-segmented-control value="${this.doCycle}" name="do-seg" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.doCycle = e.detail.value; }}>
          <Label>View</Label>
          <Item value="monthly">List</Item>
          <Item value="quarterly">Grid</Item>
          <Item value="yearly">Board</Item>
        </groupselectone--ml-segmented-control>
        <p class="mt-3 text-xs text-emerald-700 dark:text-emerald-400">
          Compact, inline, selected state always visible — ideal for switching modes without interrupting the page flow.
        </p>
      `)}
      ${this.renderDontCard('use Radio Group for compact mode-switching', html`
        <groupselectone--ml-radio-group value="${this.dontRadioForSeg}" name="dont-radio-seg" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.dontRadioForSeg = e.detail.value; }}>
          <Label>View</Label>
          <Item value="monthly">List</Item>
          <Item value="quarterly">Grid</Item>
          <Item value="yearly">Board</Item>
        </groupselectone--ml-radio-group>
        <p class="mt-3 text-xs text-rose-600 dark:text-rose-400">
          Radio Group takes significantly more vertical space for what should be a compact inline control — and the stacked layout makes it read as a form field, not a mode switcher.
        </p>
      `, 'Segmented Control')}
    </div>

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

    <div class="grid grid-cols-2 gap-6">
      ${this.renderDoCard('use Slider for ordinal, naturally ordered options', html`
        <groupselectone--ml-discrete-slider value="${this.doSat}" name="do-slider" .isEditing=${true} .fillPrevious=${true}
          @change=${(e: CustomEvent) => { this.doSat = e.detail.value; }}>
          <Label>Satisfaction</Label>
          <Item value="very-poor">Very Poor</Item>
          <Item value="poor">Poor</Item>
          <Item value="average">Average</Item>
          <Item value="good">Good</Item>
          <Item value="excellent">Excellent</Item>
        </groupselectone--ml-discrete-slider>
        <p class="mt-3 text-xs text-emerald-700 dark:text-emerald-400">
          The linear scale communicates progression visually — filling to the left reinforces the sense of increasing value.
        </p>
      `)}
      ${this.renderDontCard('use Radio Group for ordered scales', html`
        <groupselectone--ml-radio-group value="${this.dontRadioForSlider}" name="dont-radio-slider" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.dontRadioForSlider = e.detail.value; }}>
          <Label>Satisfaction</Label>
          <Item value="very-poor">Very Poor</Item>
          <Item value="poor">Poor</Item>
          <Item value="average">Average</Item>
          <Item value="good">Good</Item>
          <Item value="excellent">Excellent</Item>
        </groupselectone--ml-radio-group>
        <p class="mt-3 text-xs text-rose-600 dark:text-rose-400">
          Radio Group treats the five levels as if they were unrelated choices — the progressive, ordinal nature of the scale disappears entirely.
        </p>
      `, 'Discrete Slider')}
    </div>

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

    <div class="grid grid-cols-2 gap-6">
      ${this.renderDoCard('use Autocomplete for large lists that benefit from search', html`
        <groupselectone--ml-select-one-autocomplete value="${this.doCountry}" name="do-auto" .isEditing=${true} .clearable=${true} .searchable=${true}
          @change=${(e: CustomEvent) => { this.doCountry = e.detail.value; }}>
          <Label>Country</Label>
          <Group label="South America">
            <Item value="BR">Brazil</Item><Item value="AR">Argentina</Item><Item value="CL">Chile</Item>
          </Group>
          <Group label="North America">
            <Item value="US">United States</Item><Item value="CA">Canada</Item>
          </Group>
          <Group label="Europe">
            <Item value="PT">Portugal</Item><Item value="DE">Germany</Item>
          </Group>
        </groupselectone--ml-select-one-autocomplete>
        <p class="mt-3 text-xs text-emerald-700 dark:text-emerald-400">
          Users find their option instantly by typing — no need to scroll through a long list.
        </p>
      `)}
      ${this.renderDontCard('use Radio Group for long lists', html`
        <groupselectone--ml-radio-group value="${this.dontRadioForAuto}" name="dont-radio-auto" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.dontRadioForAuto = e.detail.value; }}>
          <Label>Country</Label>
          <Item value="BR">Brazil</Item>
          <Item value="AR">Argentina</Item>
          <Item value="CL">Chile</Item>
          <Item value="CO">Colombia</Item>
          <Item value="US">United States</Item>
          <Item value="CA">Canada</Item>
          <Item value="MX">Mexico</Item>
          <Item value="PT">Portugal</Item>
        </groupselectone--ml-radio-group>
        <p class="mt-3 text-xs text-rose-600 dark:text-rose-400">
          With 8 options this is already a long scroll. At 20+ countries it becomes an unusable wall of radio buttons with no way to jump to a specific entry.
        </p>
      `, 'Select One Autocomplete')}
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
      { scenario: 'Binary on/off, yes/no decision',              toggle: true,  seg: false, radio: false, slider: false, auto: false },
      { scenario: '2–5 compact options, inline layout',           toggle: false, seg: true,  radio: true,  slider: false, auto: false },
      { scenario: 'Options need visual side-by-side comparison', toggle: false, seg: false, radio: true,  slider: false, auto: false },
      { scenario: 'Options have a natural ordinal order/scale',   toggle: false, seg: false, radio: false, slider: true,  auto: false },
      { scenario: 'Large list (10+ options)',                     toggle: false, seg: false, radio: false, slider: false, auto: true  },
      { scenario: 'User benefits from typing to filter',          toggle: false, seg: false, radio: false, slider: false, auto: true  },
      { scenario: 'All options visible simultaneously',           toggle: false, seg: true,  radio: true,  slider: true,  auto: false },
    ];
    const headers = [
      { label: 'Toggle',       cls: 'text-sky-600 dark:text-sky-400'       },
      { label: 'Segmented',    cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Radio',        cls: 'text-violet-600 dark:text-violet-400'  },
      { label: 'Slider',       cls: 'text-amber-600 dark:text-amber-400'   },
      { label: 'Autocomplete', cls: 'text-rose-600 dark:text-rose-400'     },
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
  ${this.renderToggleSection()}
  ${this.renderRadioSection()}
  ${this.renderSegmentedSection()}
  ${this.renderSliderSection()}
  ${this.renderAutocompleteSection()}
  ${this.renderReferenceTable()}
</div>`;
  }
}
