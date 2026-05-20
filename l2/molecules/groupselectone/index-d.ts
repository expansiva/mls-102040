/// <mls fileReference="_102040_/l2/molecules/groupselectone/index-d.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupselectone/ml-radio-group';
import '/_102040_/l2/molecules/groupselectone/ml-segmented-control';
import '/_102040_/l2/molecules/groupselectone/ml-toggle-switch';
import '/_102040_/l2/molecules/groupselectone/ml-discrete-slider';
import '/_102040_/l2/molecules/groupselectone/ml-select-one-autocomplete';

// ===========================================================================
// OPTION D — SaaS Feature Page (Alternating Sections)
// A dark, dramatic hero followed by five full-width feature sections —
// one per component — alternating left/right, text + live component frame.
// Each section reads like a product feature, not a documentation entry.
// Inspired by how SaaS products present capabilities on their marketing pages.
// ===========================================================================

@customElement('molecules--groupselectone--index-d-102040')
export class GroupSelectOneIndexD extends StateLitElement {

  @state() toggles: Record<string, string> = {
    notifications: 'enabled',
    twoFactor:     'disabled',
    publicProfile: 'visible',
  };
  @state() plan         = 'pro';
  @state() cycle        = 'monthly';
  @state() satisfaction = 'good';
  @state() country      = 'BR';

  // ---------------------------------------------------------------------------
  // FEATURE SECTION LAYOUT
  // ---------------------------------------------------------------------------

  private renderFeature(
    idx:         number,
    componentTag: string,
    headline:    string,
    description: string,
    bullets:     string[],
    component:   TemplateResult,
  ): TemplateResult {
    const isEven = idx % 2 === 0;
    const bg = isEven
      ? 'bg-white dark:bg-slate-900'
      : 'bg-slate-50 dark:bg-slate-950';

    const text = html`
      <div class="flex flex-col justify-center">
        <span class="text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-4">${componentTag}</span>
        <h2 class="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-5 leading-tight">${headline}</h2>
        <p class="text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-6">${description}</p>
        <ul class="space-y-3">
          ${bullets.map(b => html`
            <li class="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
              <span class="mt-0.5 w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
              ${b}
            </li>
          `)}
        </ul>
      </div>`;

    const frame = html`
      <div class="flex items-center justify-center">
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-8 w-full max-w-md">
          ${component}
        </div>
      </div>`;

    return html`
<section class="${bg} px-8 py-24">
  <div class="max-w-5xl mx-auto grid grid-cols-2 gap-20 items-center">
    ${isEven ? html`${text}${frame}` : html`${frame}${text}`}
  </div>
</section>`;
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  render() {
    return html`
<div class="font-sans min-h-screen">

  <!-- ══ DARK HERO ══ -->
  <header class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-28 text-center relative overflow-hidden">
    <!-- Background grid pattern (decorative) -->
    <div class="absolute inset-0 opacity-5" style="background-image: linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px); background-size: 40px 40px;"></div>
    <div class="relative">
      <span class="inline-block px-4 py-1.5 bg-white/10 text-sky-300 border border-white/20 rounded-full text-xs font-semibold uppercase tracking-widest mb-8">
        groupSelectOne · 5 Components
      </span>
      <h1 class="text-6xl font-black text-white mb-6 tracking-tight leading-none">
        Select One.<br/>
        <span class="text-sky-400">Built right.</span>
      </h1>
      <p class="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
        Five battle-tested controls for every single-selection scenario — from binary toggles to searchable lists with thousands of options.
      </p>
      <div class="mt-12 flex justify-center gap-3 flex-wrap">
        ${[
          ['Toggle Switch',        'bg-sky-500'],
          ['Radio Group',          'bg-violet-500'],
          ['Segmented Control',    'bg-emerald-500'],
          ['Discrete Slider',      'bg-amber-500'],
          ['Autocomplete',         'bg-rose-500'],
        ].map(([name, color]) => html`
          <span class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/15 text-slate-200 rounded-full text-sm">
            <span class="w-2 h-2 rounded-full ${color}"></span>${name}
          </span>
        `)}
      </div>
    </div>
  </header>

  <!-- ══ TOGGLE SWITCH ══ -->
  ${this.renderFeature(
    0,
    'Toggle Switch',
    'Binary choices shouldn\'t need menus.',
    'Some decisions are inherently on or off. The Toggle Switch delivers that clarity without a dropdown, a modal, or a save button — state change happens the moment the user acts.',
    [
      'Exactly two states — the simplest contract in UI',
      'Current state always in view, no extra click to reveal',
      'Custom labels per side (On/Off, Light/Dark, Show/Hide)',
      'Works naturally in stacked settings lists',
    ],
    html`
      <p class="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">Account Preferences</p>
      <div class="divide-y divide-slate-100 dark:divide-slate-700">
        <div class="pb-4"><groupselectone--ml-toggle-switch value="${this.toggles.notifications}" name="d-n1" .isEditing=${true} @change=${(e: CustomEvent) => { this.toggles = { ...this.toggles, notifications: e.detail.value }; }}><Label>Email notifications</Label><Helper>Receive alerts about your account.</Helper><Item value="disabled">Disabled</Item><Item value="enabled">Enabled</Item></groupselectone--ml-toggle-switch></div>
        <div class="py-4"><groupselectone--ml-toggle-switch value="${this.toggles.twoFactor}" name="d-n2" .isEditing=${true} @change=${(e: CustomEvent) => { this.toggles = { ...this.toggles, twoFactor: e.detail.value }; }}><Label>Two-factor authentication</Label><Helper>Add a second sign-in step.</Helper><Item value="disabled">Disabled</Item><Item value="enabled">Enabled</Item></groupselectone--ml-toggle-switch></div>
        <div class="pt-4"><groupselectone--ml-toggle-switch value="${this.toggles.publicProfile}" name="d-n3" .isEditing=${true} @change=${(e: CustomEvent) => { this.toggles = { ...this.toggles, publicProfile: e.detail.value }; }}><Label>Public profile</Label><Helper>Allow others to find your profile.</Helper><Item value="hidden">Hidden</Item><Item value="visible">Visible</Item></groupselectone--ml-toggle-switch></div>
      </div>
    `
  )}

  <!-- ══ RADIO GROUP ══ -->
  ${this.renderFeature(
    1,
    'Radio Group',
    'Every option, always in sight.',
    'When users need to compare and choose, a dropdown forces them to open, read, close, and repeat. Radio Group eliminates that loop: every option is visible immediately, selection is one click.',
    [
      'No hidden choices — comparison is effortless',
      'Labelled groups for organizing related options',
      'Full keyboard navigation (arrows, Enter, Escape)',
      'Supports disabled items, loading, and error states',
    ],
    html`
      <p class="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">Choose a Plan</p>
      <groupselectone--ml-radio-group value="${this.plan}" name="d-plan" .isEditing=${true} @change=${(e: CustomEvent) => { this.plan = e.detail.value; }}>
        <Item value="starter">Starter — Free forever</Item>
        <Item value="pro">Pro — $29 / month</Item>
        <Item value="team">Team — $79 / month</Item>
        <Item value="enterprise">Enterprise — Custom pricing</Item>
      </groupselectone--ml-radio-group>
      <div class="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 text-right">
        <button class="px-4 py-2 bg-sky-500 text-white text-sm font-semibold rounded-lg hover:bg-sky-600 transition-colors">Continue →</button>
      </div>
    `
  )}

  <!-- ══ SEGMENTED CONTROL ══ -->
  ${this.renderFeature(
    2,
    'Segmented Control',
    'Mode switching without a menu.',
    'For small, stable sets of mutually exclusive options, the segmented control offers the most compact always-visible selector. No dropdown, no panel — the selection and the options live side by side.',
    [
      'Horizontal inline layout fits naturally in toolbars',
      'Designed for 2–5 short, fixed option labels',
      'Selected state is always visible without any interaction',
      'Supports disabled individual segments',
    ],
    html`
      <groupselectone--ml-segmented-control value="${this.cycle}" name="d-cycle" .isEditing=${true} @change=${(e: CustomEvent) => { this.cycle = e.detail.value; }}>
        <Label>Billing cycle</Label>
        <Helper>Choose how often you'd like to be charged.</Helper>
        <Item value="monthly">Monthly</Item>
        <Item value="quarterly">Quarterly</Item>
        <Item value="yearly">Yearly (save 20%)</Item>
      </groupselectone--ml-segmented-control>
    `
  )}

  <!-- ══ DISCRETE SLIDER ══ -->
  ${this.renderFeature(
    3,
    'Discrete Slider',
    'The scale speaks for itself.',
    'When options have a natural order — satisfaction levels, seniority tiers, risk tolerance — a linear slider conveys the progression in a way that a plain list never can. Fill Previous makes the selection feel like a progress bar.',
    [
      'Visualizes the ordinal direction options inherently have',
      'Fill Previous mode reinforces the sense of progression',
      'Category labels group steps without affecting selection logic',
      'Accepts 2–7 fixed stopping points',
    ],
    html`
      <p class="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">How satisfied are you?</p>
      <p class="text-xs text-slate-400 mb-6">Your feedback helps us improve our service.</p>
      <groupselectone--ml-discrete-slider value="${this.satisfaction}" name="d-sat" .isEditing=${true} .fillPrevious=${true} @change=${(e: CustomEvent) => { this.satisfaction = e.detail.value; }}>
        <Item value="very-poor">Very Poor</Item>
        <Item value="poor">Poor</Item>
        <Item value="average">Average</Item>
        <Item value="good">Good</Item>
        <Item value="excellent">Excellent</Item>
      </groupselectone--ml-discrete-slider>
      <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 text-right">
        <button class="px-4 py-2 bg-sky-500 text-white text-sm font-semibold rounded-lg hover:bg-sky-600 transition-colors">Submit feedback</button>
      </div>
    `
  )}

  <!-- ══ AUTOCOMPLETE ══ -->
  ${this.renderFeature(
    4,
    'Select One Autocomplete',
    'Find one in thousands.',
    'When showing every option at once is not an option, Autocomplete lets users type to filter the list instantly. Grouped results keep large datasets organized. Clearable selection makes corrections effortless.',
    [
      'Type-to-filter works across all options and group labels',
      'Clearable selection removes friction from corrections',
      'Grouped results organize large datasets visually',
      'Full keyboard navigation (arrows, Enter, Escape)',
    ],
    html`
      <groupselectone--ml-select-one-autocomplete value="${this.country}" name="d-country" .isEditing=${true} .clearable=${true} .searchable=${true} @change=${(e: CustomEvent) => { this.country = e.detail.value; }}>
        <Label>Country</Label>
        <Helper>Type to search or scroll to browse.</Helper>
        <Group label="South America"><Item value="BR">Brazil</Item><Item value="AR">Argentina</Item><Item value="CL">Chile</Item><Item value="CO">Colombia</Item></Group>
        <Group label="North America"><Item value="US">United States</Item><Item value="CA">Canada</Item><Item value="MX">Mexico</Item></Group>
        <Group label="Europe"><Item value="DE">Germany</Item><Item value="FR">France</Item><Item value="PT">Portugal</Item><Item value="ES">Spain</Item></Group>
      </groupselectone--ml-select-one-autocomplete>
    `
  )}

  <!-- ══ FOOTER CTA ══ -->
  <section class="bg-slate-900 px-8 py-20 text-center">
    <h2 class="text-3xl font-bold text-white mb-4">Five controls. One group. Zero guesswork.</h2>
    <p class="text-slate-400 max-w-xl mx-auto">
      Each component follows the same contract — same properties, same events, same states —
      making it trivial to swap controls as your product requirements evolve.
    </p>
    <div class="mt-8">
      <code class="text-sm bg-white/10 text-sky-300 px-4 py-2 rounded-lg">groupSelectOne</code>
    </div>
  </section>

</div>`;
  }
}
