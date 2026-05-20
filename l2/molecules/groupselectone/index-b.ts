/// <mls fileReference="_102040_/l2/molecules/groupselectone/index-b.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupselectone/ml-radio-group';
import '/_102040_/l2/molecules/groupselectone/ml-segmented-control';
import '/_102040_/l2/molecules/groupselectone/ml-toggle-switch';
import '/_102040_/l2/molecules/groupselectone/ml-discrete-slider';
import '/_102040_/l2/molecules/groupselectone/ml-select-one-autocomplete';

// ===========================================================================
// OPTION B — Component Gallery (Card Grid + Detail Panel)
// Presents all 5 components as color-coded cards on an overview grid.
// Clicking a card opens a full-width detail panel below — showing the live
// component in context plus a brief description of when to use it.
// The initial view is a clean, browsable showcase with no noise.
// ===========================================================================

interface CardDef {
  id:          string;
  name:        string;
  fullTag:     string;
  tagline:     string;
  bar:         string;   // Tailwind bg class for accent bar
  btnClass:    string;   // Tailwind classes for the Explore button
  labelClass:  string;   // Tailwind classes for the "active" label
  traits:      string[];
  description: string;
}

const CARDS: CardDef[] = [
  {
    id: 'toggle',
    name: 'Toggle Switch',
    fullTag: 'groupselectone--ml-toggle-switch',
    tagline: 'Binary decisions, beautifully clear.',
    bar: 'bg-sky-500',
    btnClass: 'bg-sky-500 hover:bg-sky-600 text-white',
    labelClass: 'bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300',
    traits: ['On / Off, Enabled / Disabled', 'Ideal for settings lists', 'Two fully custom labels'],
    description: 'When a choice has exactly two states, the Toggle Switch communicates it instantly. Best for preferences, feature flags, and any binary on/off control inside settings panels.',
  },
  {
    id: 'radio',
    name: 'Radio Group',
    fullTag: 'groupselectone--ml-radio-group',
    tagline: 'All options, always in sight.',
    bar: 'bg-violet-500',
    btnClass: 'bg-violet-500 hover:bg-violet-600 text-white',
    labelClass: 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300',
    traits: ['No choices hidden behind a click', 'Supports labelled groups', 'Keyboard navigable'],
    description: 'When 2–6 options must be compared side by side, showing all of them at once eliminates extra clicks and makes the decision deliberate. Radio Group is the most explicit single-select control.',
  },
  {
    id: 'segmented',
    name: 'Segmented Control',
    fullTag: 'groupselectone--ml-segmented-control',
    tagline: 'Compact. Fixed. Immediate.',
    bar: 'bg-emerald-500',
    btnClass: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    labelClass: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300',
    traits: ['Inline horizontal layout', 'Designed for 2–5 options', 'No dropdown required'],
    description: 'For small, stable sets of mutually exclusive modes, the segmented control is the most compact solution. All options remain visible; the selected state is always in view without any extra interaction.',
  },
  {
    id: 'slider',
    name: 'Discrete Slider',
    fullTag: 'groupselectone--ml-discrete-slider',
    tagline: 'Ordered choices on a scale.',
    bar: 'bg-amber-500',
    btnClass: 'bg-amber-500 hover:bg-amber-600 text-white',
    labelClass: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
    traits: ['Communicates ordinal direction', 'Fill Previous for progress feel', 'Supports category labels'],
    description: 'When options have a natural order — satisfaction levels, seniority, risk tolerance — a slider conveys the ordering dimension that a plain list cannot. Best for 2–7 ordinal options.',
  },
  {
    id: 'autocomplete',
    name: 'Autocomplete',
    fullTag: 'groupselectone--ml-select-one-autocomplete',
    tagline: 'Type to filter. Click to confirm.',
    bar: 'bg-rose-500',
    btnClass: 'bg-rose-500 hover:bg-rose-600 text-white',
    labelClass: 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300',
    traits: ['Handles large option lists', 'Clearable & fully searchable', 'Grouped results support'],
    description: 'When the option list is too large to display fully, autocomplete lets users narrow results by typing. Best for locations, people, product categories, and any dataset with dozens or hundreds of entries.',
  },
];

@customElement('molecules--groupselectone--index-b-102040')
export class GroupSelectOneIndexB extends StateLitElement {

  @state() active: string | null = null;

  // Component demo states (shown in detail panel)
  @state() toggles: Record<string, string> = { notifications: 'enabled', twoFactor: 'disabled', publicProfile: 'visible' };
  @state() plan         = 'pro';
  @state() cycle        = 'monthly';
  @state() satisfaction = 'good';
  @state() country      = 'BR';

  // ---------------------------------------------------------------------------
  // CARD
  // ---------------------------------------------------------------------------

  private renderCard(card: CardDef): TemplateResult {
    const isActive = this.active === card.id;
    return html`
<button
  class="text-left w-full bg-white dark:bg-slate-800 rounded-2xl border-2 transition-all overflow-hidden
    ${isActive
      ? 'border-slate-900 dark:border-slate-100 shadow-lg'
      : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-md'}"
  @click=${() => { this.active = isActive ? null : card.id; }}
>
  <!-- accent bar -->
  <div class="${card.bar} h-1.5 w-full"></div>
  <div class="p-6">
    <p class="text-lg font-bold text-slate-900 dark:text-slate-50 mb-1">${card.name}</p>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">${card.tagline}</p>
    <ul class="space-y-1.5 mb-5">
      ${card.traits.map(t => html`
        <li class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
          <span class="mt-0.5 text-slate-400">—</span>${t}
        </li>
      `)}
    </ul>
    <span class="inline-block px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${card.btnClass}">
      ${isActive ? 'Close ↑' : 'Explore →'}
    </span>
  </div>
</button>`;
  }

  // ---------------------------------------------------------------------------
  // DETAIL PANEL
  // ---------------------------------------------------------------------------

  private renderDetail(id: string): TemplateResult {
    const card = CARDS.find(c => c.id === id)!;
    return html`
<div class="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-8 py-12">
  <div class="max-w-5xl mx-auto">
    <div class="flex items-start justify-between mb-8">
      <div>
        <span class="inline-block px-2.5 py-1 rounded text-xs font-semibold mb-2 ${card.labelClass}">${card.name}</span>
        <p class="text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">${card.description}</p>
      </div>
      <code class="text-xs bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded ml-6 whitespace-nowrap">${card.fullTag}</code>
    </div>
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8 max-w-xl">
      ${this.renderComponentPreview(id)}
    </div>
  </div>
</div>`;
  }

  private renderComponentPreview(id: string): TemplateResult {
    switch (id) {
      case 'toggle': return html`
        <p class="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">Account Preferences</p>
        <div class="divide-y divide-slate-100 dark:divide-slate-700">
          <div class="pb-4"><groupselectone--ml-toggle-switch value="${this.toggles.notifications}" name="b-n1" .isEditing=${true} @change=${(e: CustomEvent) => { this.toggles = { ...this.toggles, notifications: e.detail.value }; }}><Label>Email notifications</Label><Helper>Receive alerts about account activity.</Helper><Item value="disabled">Disabled</Item><Item value="enabled">Enabled</Item></groupselectone--ml-toggle-switch></div>
          <div class="py-4"><groupselectone--ml-toggle-switch value="${this.toggles.twoFactor}" name="b-n2" .isEditing=${true} @change=${(e: CustomEvent) => { this.toggles = { ...this.toggles, twoFactor: e.detail.value }; }}><Label>Two-factor authentication</Label><Helper>Extra security layer on sign-in.</Helper><Item value="disabled">Disabled</Item><Item value="enabled">Enabled</Item></groupselectone--ml-toggle-switch></div>
          <div class="pt-4"><groupselectone--ml-toggle-switch value="${this.toggles.publicProfile}" name="b-n3" .isEditing=${true} @change=${(e: CustomEvent) => { this.toggles = { ...this.toggles, publicProfile: e.detail.value }; }}><Label>Public profile</Label><Helper>Allow others to find your profile.</Helper><Item value="hidden">Hidden</Item><Item value="visible">Visible</Item></groupselectone--ml-toggle-switch></div>
        </div>`;

      case 'radio': return html`
        <p class="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">Choose a Plan</p>
        <groupselectone--ml-radio-group value="${this.plan}" name="b-plan" .isEditing=${true} @change=${(e: CustomEvent) => { this.plan = e.detail.value; }}>
          <Item value="starter">Starter — Free forever</Item>
          <Item value="pro">Pro — $29 / month</Item>
          <Item value="team">Team — $79 / month</Item>
          <Item value="enterprise">Enterprise — Custom pricing</Item>
        </groupselectone--ml-radio-group>`;

      case 'segmented': return html`
        <groupselectone--ml-segmented-control value="${this.cycle}" name="b-cycle" .isEditing=${true} @change=${(e: CustomEvent) => { this.cycle = e.detail.value; }}>
          <Label>Billing cycle</Label>
          <Helper>Choose how often you'd like to be charged.</Helper>
          <Item value="monthly">Monthly</Item>
          <Item value="quarterly">Quarterly</Item>
          <Item value="yearly">Yearly (save 20%)</Item>
        </groupselectone--ml-segmented-control>`;

      case 'slider': return html`
        <p class="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">How satisfied are you?</p>
        <p class="text-xs text-slate-400 mb-6">Your feedback helps us improve.</p>
        <groupselectone--ml-discrete-slider value="${this.satisfaction}" name="b-sat" .isEditing=${true} .fillPrevious=${true} @change=${(e: CustomEvent) => { this.satisfaction = e.detail.value; }}>
          <Item value="very-poor">Very Poor</Item>
          <Item value="poor">Poor</Item>
          <Item value="average">Average</Item>
          <Item value="good">Good</Item>
          <Item value="excellent">Excellent</Item>
        </groupselectone--ml-discrete-slider>`;

      case 'autocomplete': return html`
        <groupselectone--ml-select-one-autocomplete value="${this.country}" name="b-country" .isEditing=${true} .clearable=${true} .searchable=${true} @change=${(e: CustomEvent) => { this.country = e.detail.value; }}>
          <Label>Country</Label>
          <Helper>Type to search or scroll to browse.</Helper>
          <Group label="South America"><Item value="BR">Brazil</Item><Item value="AR">Argentina</Item><Item value="CL">Chile</Item><Item value="CO">Colombia</Item></Group>
          <Group label="North America"><Item value="US">United States</Item><Item value="CA">Canada</Item><Item value="MX">Mexico</Item></Group>
          <Group label="Europe"><Item value="DE">Germany</Item><Item value="FR">France</Item><Item value="PT">Portugal</Item><Item value="ES">Spain</Item></Group>
        </groupselectone--ml-select-one-autocomplete>`;
    }
    return html``;
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  render() {
    return html`
<div class="bg-white dark:bg-slate-900 font-sans min-h-screen">

  <!-- ── Hero ── -->
  <header class="px-8 py-16 border-b border-slate-200 dark:border-slate-700">
    <div class="max-w-3xl">
      <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-5">
        groupSelectOne
      </span>
      <h1 class="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3 tracking-tight">Select One Controls</h1>
      <p class="text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
        Five components for every single-selection scenario. Browse the collection, click any card to see the component live.
      </p>
    </div>
  </header>

  <!-- ── Card grid ── -->
  <div class="px-8 py-10">
    <div class="max-w-6xl mx-auto grid grid-cols-5 gap-4">
      ${CARDS.map(card => this.renderCard(card))}
    </div>
  </div>

  <!-- ── Detail panel ── -->
  ${this.active ? this.renderDetail(this.active) : html``}

</div>`;
  }
}
