/// <mls fileReference="_102040_/l2/molecules/groupselectone/index-a.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupselectone/ml-radio-group';
import '/_102040_/l2/molecules/groupselectone/ml-segmented-control';
import '/_102040_/l2/molecules/groupselectone/ml-toggle-switch';
import '/_102040_/l2/molecules/groupselectone/ml-discrete-slider';
import '/_102040_/l2/molecules/groupselectone/ml-select-one-autocomplete';

// ===========================================================================
// OPTION A — Storytelling / Use Cases
// Organizes by real-world scenario. Each section shows one component
// embedded inside a realistic application mockup, with context text on
// the opposite side. Zero config panels — just the component in action.
// ===========================================================================

@customElement('molecules--groupselectone--index-a-102040')
export class GroupSelectOneIndexA extends StateLitElement {

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
  // LAYOUT HELPER
  // ---------------------------------------------------------------------------

  private renderScenario(
    idx: number,
    side: 'left' | 'right',
    componentTag: string,
    title: string,
    body: string,
    mockup: TemplateResult,
  ): TemplateResult {
    const bg  = idx % 2 === 0
      ? 'bg-slate-50 dark:bg-slate-950'
      : 'bg-white dark:bg-slate-900';
    const text = html`
      <div class="flex flex-col justify-center">
        <span class="text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-3">${componentTag}</span>
        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4 leading-tight">${title}</h2>
        <p class="text-base text-slate-500 dark:text-slate-400 leading-relaxed">${body}</p>
      </div>`;
    const frame = html`<div>${mockup}</div>`;
    return html`
<section class="${bg} px-8 py-20">
  <div class="max-w-5xl mx-auto grid grid-cols-2 gap-16 items-center">
    ${side === 'left' ? html`${frame}${text}` : html`${text}${frame}`}
  </div>
</section>`;
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  render() {
    return html`
<div class="font-sans min-h-screen">

  <!-- ── Hero ── -->
  <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-24 text-center">
    <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
      groupSelectOne
    </span>
    <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
      One choice.<br/>Five ways to make it.
    </h1>
    <p class="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
      A complete suite of single-selection controls — each designed for a specific interaction context.
    </p>
    <div class="mt-8 flex flex-wrap justify-center gap-2">
      ${['Toggle Switch', 'Radio Group', 'Segmented Control', 'Discrete Slider', 'Autocomplete'].map(n => html`
        <span class="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-sm border border-slate-200 dark:border-slate-700">${n}</span>
      `)}
    </div>
  </header>

  <!-- ── Toggle Switch: account settings ── -->
  ${this.renderScenario(0, 'right', 'Toggle Switch', 'Settings that feel instant.',
    'Binary decisions deserve a binary control. The Toggle Switch communicates state change immediately — no confirmation needed, no ambiguity. Perfect for preferences and feature flags.',
    html`
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Account Preferences</p>
          <p class="text-xs text-slate-400 mt-0.5">Notifications and privacy controls</p>
        </div>
        <div class="divide-y divide-slate-100 dark:divide-slate-700 px-5">
          <div class="py-4">
            <groupselectone--ml-toggle-switch
              value="${this.toggles.notifications}" name="t-notifications" .isEditing=${true}
              @change=${(e: CustomEvent) => { this.toggles = { ...this.toggles, notifications: e.detail.value }; }}>
              <Label>Email notifications</Label>
              <Helper>Receive alerts about your account activity.</Helper>
              <Item value="disabled">Disabled</Item>
              <Item value="enabled">Enabled</Item>
            </groupselectone--ml-toggle-switch>
          </div>
          <div class="py-4">
            <groupselectone--ml-toggle-switch
              value="${this.toggles.twoFactor}" name="t-2fa" .isEditing=${true}
              @change=${(e: CustomEvent) => { this.toggles = { ...this.toggles, twoFactor: e.detail.value }; }}>
              <Label>Two-factor authentication</Label>
              <Helper>Add an extra layer of security on sign-in.</Helper>
              <Item value="disabled">Disabled</Item>
              <Item value="enabled">Enabled</Item>
            </groupselectone--ml-toggle-switch>
          </div>
          <div class="py-4">
            <groupselectone--ml-toggle-switch
              value="${this.toggles.publicProfile}" name="t-profile" .isEditing=${true}
              @change=${(e: CustomEvent) => { this.toggles = { ...this.toggles, publicProfile: e.detail.value }; }}>
              <Label>Public profile</Label>
              <Helper>Allow others to find and view your profile.</Helper>
              <Item value="hidden">Hidden</Item>
              <Item value="visible">Visible</Item>
            </groupselectone--ml-toggle-switch>
          </div>
        </div>
      </div>
    `
  )}

  <!-- ── Radio Group: plan selection ── -->
  ${this.renderScenario(1, 'left', 'Radio Group', 'All options, always in sight.',
    'When choices need to be compared side by side, hiding them in a dropdown adds friction. Radio Group keeps every option visible — selection is fast, deliberate, and clear.',
    html`
      <div class="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <p class="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">Choose a Plan</p>
        <groupselectone--ml-radio-group
          value="${this.plan}" name="plan" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.plan = e.detail.value; }}>
          <Item value="starter">Starter — Free forever</Item>
          <Item value="pro">Pro — $29 / month</Item>
          <Item value="team">Team — $79 / month</Item>
          <Item value="enterprise">Enterprise — Custom pricing</Item>
        </groupselectone--ml-radio-group>
        <div class="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 text-right">
          <button class="px-5 py-2 bg-sky-500 text-white text-sm font-semibold rounded-lg hover:bg-sky-600 transition-colors">
            Continue →
          </button>
        </div>
      </div>
    `
  )}

  <!-- ── Segmented Control: billing cycle ── -->
  ${this.renderScenario(2, 'right', 'Segmented Control', 'Compact switching, no dropdown overhead.',
    'When the option set is small and stable, a segmented control offers the most compact always-visible selector. Current state never disappears behind a click.',
    html`
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-5">Billing Settings</p>
        <groupselectone--ml-segmented-control
          value="${this.cycle}" name="cycle" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.cycle = e.detail.value; }}>
          <Label>Billing cycle</Label>
          <Helper>Choose how often you'd like to be charged.</Helper>
          <Item value="monthly">Monthly</Item>
          <Item value="quarterly">Quarterly</Item>
          <Item value="yearly">Yearly (save 20%)</Item>
        </groupselectone--ml-segmented-control>
      </div>
    `
  )}

  <!-- ── Discrete Slider: satisfaction survey ── -->
  ${this.renderScenario(3, 'left', 'Discrete Slider', 'Ordered choices on a scale.',
    'For ordinal options — satisfaction levels, seniority, priority tiers — a slider conveys the inherent ordering that a list cannot express. Fill Previous makes progress feel tangible.',
    html`
      <div class="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <p class="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">How satisfied are you?</p>
        <p class="text-xs text-slate-400 mb-6">Your feedback helps us improve our service.</p>
        <groupselectone--ml-discrete-slider
          value="${this.satisfaction}" name="sat" .isEditing=${true} .fillPrevious=${true}
          @change=${(e: CustomEvent) => { this.satisfaction = e.detail.value; }}>
          <Item value="very-poor">Very Poor</Item>
          <Item value="poor">Poor</Item>
          <Item value="average">Average</Item>
          <Item value="good">Good</Item>
          <Item value="excellent">Excellent</Item>
        </groupselectone--ml-discrete-slider>
        <div class="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-right">
          <button class="px-5 py-2 bg-sky-500 text-white text-sm font-semibold rounded-lg hover:bg-sky-600 transition-colors">
            Submit feedback
          </button>
        </div>
      </div>
    `
  )}

  <!-- ── Autocomplete: address form ── -->
  ${this.renderScenario(4, 'right', 'Select One Autocomplete', 'Search through hundreds. Land on one.',
    'When the list is too long to show at once, autocomplete lets users type to filter instantly. Supports grouped results, clearable selection, and full keyboard navigation.',
    html`
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <p class="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">Shipping Address</p>
        <groupselectone--ml-select-one-autocomplete
          value="${this.country}" name="country" .isEditing=${true} .clearable=${true} .searchable=${true}
          @change=${(e: CustomEvent) => { this.country = e.detail.value; }}>
          <Label>Country</Label>
          <Helper>Where should we deliver your order?</Helper>
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

</div>`;
  }
}
