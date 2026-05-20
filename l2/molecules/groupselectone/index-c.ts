/// <mls fileReference="_102040_/l2/molecules/groupselectone/index-c.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupselectone/ml-radio-group';
import '/_102040_/l2/molecules/groupselectone/ml-segmented-control';
import '/_102040_/l2/molecules/groupselectone/ml-toggle-switch';
import '/_102040_/l2/molecules/groupselectone/ml-discrete-slider';
import '/_102040_/l2/molecules/groupselectone/ml-select-one-autocomplete';

// ===========================================================================
// OPTION C — Decision Guide ("Which control should I use?")
// Top section: a visual comparison table answering the most common question
//   developers face when arriving at this group.
// Bottom section: one interactive quick-try card per component.
// Zero config panels — emphasis on choosing the right tool, not tweaking props.
// ===========================================================================

interface GuideRow {
  when:      string;
  ideal:     string;
  component: string;
  tag:       string;
  tagColor:  string;
  traits:    string[];
}

const GUIDE: GuideRow[] = [
  {
    when:      'The user must toggle a single feature on or off',
    ideal:     'Binary, instant, no ambiguity needed',
    component: 'Toggle Switch',
    tag:       'ml-toggle-switch',
    tagColor:  'bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300',
    traits:    ['Exactly 2 states', 'State always visible', 'Settings / preferences'],
  },
  {
    when:      'A compact selector for 2–5 short, fixed options',
    ideal:     'Horizontal inline layout, no dropdown',
    component: 'Segmented Control',
    tag:       'ml-segmented-control',
    tagColor:  'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300',
    traits:    ['2–5 short labels', 'All visible at once', 'View / mode switching'],
  },
  {
    when:      'Options must be compared before choosing one',
    ideal:     'All choices visible, deliberate selection',
    component: 'Radio Group',
    tag:       'ml-radio-group',
    tagColor:  'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300',
    traits:    ['2–6 distinct options', 'Supports groups', 'Plans / types / roles'],
  },
  {
    when:      'Options have a natural order or progression',
    ideal:     'Ordinal data — scale, intensity, seniority',
    component: 'Discrete Slider',
    tag:       'ml-discrete-slider',
    tagColor:  'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
    traits:    ['2–7 ordered steps', 'Visualizes the scale', 'Ratings / seniority / priority'],
  },
  {
    when:      'The list is too large to display all options at once',
    ideal:     'Searchable, clearable, supports grouping',
    component: 'Select One Autocomplete',
    tag:       'ml-select-one-autocomplete',
    tagColor:  'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300',
    traits:    ['Dozens or hundreds of options', 'Type-to-filter', 'Countries / users / products'],
  },
];

@customElement('molecules--groupselectone--index-c-102040')
export class GroupSelectOneIndexC extends StateLitElement {

  @state() toggles: Record<string, string> = { mode: 'enabled' };
  @state() plan         = 'pro';
  @state() cycle        = 'monthly';
  @state() satisfaction = 'good';
  @state() country      = 'BR';

  // ---------------------------------------------------------------------------
  // GUIDE ROW
  // ---------------------------------------------------------------------------

  private renderGuideRow(row: GuideRow, idx: number): TemplateResult {
    const alt = idx % 2 !== 0;
    return html`
<div class="${alt ? 'bg-slate-50 dark:bg-slate-900/50' : 'bg-white dark:bg-slate-800'} rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
  <div class="grid grid-cols-[1fr_auto] gap-6 items-start">

    <!-- Left: when + ideal -->
    <div>
      <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">${row.when}</p>
      <p class="text-xs text-slate-400 dark:text-slate-500 italic mb-4">${row.ideal}</p>
      <div class="flex flex-wrap gap-2">
        ${row.traits.map(t => html`
          <span class="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full border border-slate-200 dark:border-slate-600">
            ${t}
          </span>
        `)}
      </div>
    </div>

    <!-- Right: component name + tag -->
    <div class="text-right shrink-0">
      <span class="inline-block px-3 py-1.5 rounded-lg text-sm font-bold mb-2 ${row.tagColor}">${row.component}</span>
      <br/>
      <code class="text-xs text-slate-400 dark:text-slate-500">groupselectone--${row.tag}</code>
    </div>

  </div>
</div>`;
  }

  // ---------------------------------------------------------------------------
  // QUICK-TRY CARDS
  // ---------------------------------------------------------------------------

  private renderQuickTry(): TemplateResult {
    return html`
<section class="px-8 py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Try them now</h2>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">Each component shown in its simplest, most common configuration. No setup needed.</p>
    <div class="grid grid-cols-5 gap-4">

      <!-- Toggle -->
      <div class="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <p class="text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-4">Toggle Switch</p>
        <groupselectone--ml-toggle-switch
          value="${this.toggles.mode}" name="c-mode" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.toggles = { ...this.toggles, mode: e.detail.value }; }}>
          <Label>Dark mode</Label>
          <Item value="disabled">Light</Item>
          <Item value="enabled">Dark</Item>
        </groupselectone--ml-toggle-switch>
      </div>

      <!-- Segmented -->
      <div class="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <p class="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">Segmented Control</p>
        <groupselectone--ml-segmented-control
          value="${this.cycle}" name="c-cycle" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.cycle = e.detail.value; }}>
          <Label>View</Label>
          <Item value="monthly">List</Item>
          <Item value="quarterly">Grid</Item>
          <Item value="yearly">Board</Item>
        </groupselectone--ml-segmented-control>
      </div>

      <!-- Radio -->
      <div class="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <p class="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-4">Radio Group</p>
        <groupselectone--ml-radio-group
          value="${this.plan}" name="c-plan" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.plan = e.detail.value; }}>
          <Label>Plan</Label>
          <Item value="starter">Starter</Item>
          <Item value="pro">Pro</Item>
          <Item value="team">Team</Item>
        </groupselectone--ml-radio-group>
      </div>

      <!-- Slider -->
      <div class="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <p class="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-4">Discrete Slider</p>
        <groupselectone--ml-discrete-slider
          value="${this.satisfaction}" name="c-sat" .isEditing=${true} .fillPrevious=${true}
          @change=${(e: CustomEvent) => { this.satisfaction = e.detail.value; }}>
          <Label>Rating</Label>
          <Item value="poor">Poor</Item>
          <Item value="average">Average</Item>
          <Item value="good">Good</Item>
          <Item value="excellent">Excellent</Item>
        </groupselectone--ml-discrete-slider>
      </div>

      <!-- Autocomplete -->
      <div class="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <p class="text-xs font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-4">Autocomplete</p>
        <groupselectone--ml-select-one-autocomplete
          value="${this.country}" name="c-country" .isEditing=${true} .clearable=${true} .searchable=${true}
          @change=${(e: CustomEvent) => { this.country = e.detail.value; }}>
          <Label>Country</Label>
          <Group label="Americas"><Item value="BR">Brazil</Item><Item value="US">United States</Item><Item value="CA">Canada</Item><Item value="AR">Argentina</Item></Group>
          <Group label="Europe"><Item value="PT">Portugal</Item><Item value="DE">Germany</Item><Item value="FR">France</Item><Item value="ES">Spain</Item></Group>
        </groupselectone--ml-select-one-autocomplete>
      </div>

    </div>
  </div>
</section>`;
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  render() {
    return html`
<div class="bg-slate-100 dark:bg-slate-950 font-sans min-h-screen">

  <!-- ── Hero ── -->
  <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-14">
    <div class="max-w-3xl">
      <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-5">
        groupSelectOne — 5 components
      </span>
      <h1 class="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3 tracking-tight">
        Which control should you use?
      </h1>
      <p class="text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
        Match your interaction pattern to the right component. Each row describes a scenario, recommends the control, and lists key constraints.
      </p>
    </div>
  </header>

  <!-- ── Decision guide ── -->
  <section class="px-8 py-10">
    <div class="max-w-4xl mx-auto space-y-3">
      ${GUIDE.map((row, idx) => this.renderGuideRow(row, idx))}
    </div>
  </section>

  <!-- ── Quick try ── -->
  ${this.renderQuickTry()}

</div>`;
  }
}
