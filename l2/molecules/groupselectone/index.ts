/// <mls fileReference="_102040_/l2/molecules/groupselectone/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupselectone/ml-card-selector';
import '/_102040_/l2/molecules/groupselectone/ml-combobox';
import '/_102040_/l2/molecules/groupselectone/ml-dial-select';
import '/_102040_/l2/molecules/groupselectone/ml-discrete-slider';
import '/_102040_/l2/molecules/groupselectone/ml-listbox-sidebar-select';
import '/_102040_/l2/molecules/groupselectone/ml-radio-group';
import '/_102040_/l2/molecules/groupselectone/ml-segmented-control';
import '/_102040_/l2/molecules/groupselectone/ml-select-dropdown-img';
import '/_102040_/l2/molecules/groupselectone/ml-select-dropdown';
import '/_102040_/l2/molecules/groupselectone/ml-select-one-autocomplete';
import '/_102040_/l2/molecules/groupselectone/ml-select';
import '/_102040_/l2/molecules/groupselectone/ml-table-single-select';

@customElement('molecules--groupselectone--index-102040')
export class GroupSelectOneIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private card1 = 'starter';
  @state() private card2 = 'us';
  @state() private card3 = 'pm';
  @state() private card4 = '3';
  @state() private card5 = 'analytics';
  @state() private card6 = 'email';
  @state() private card7 = 'monthly';
  @state() private card8 = 'cat';
  @state() private card9 = 'design';
  @state() private card10 = 'tokyo';
  @state() private card11 = 'eur';
  @state() private card12 = 'team';

  // ===========================================================================
  // HERO
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
          Allows the user to select exactly one option from a list of mutually exclusive choices. Ideal for scenarios where a single, clear decision is required. Layout is chosen via the variant property: dropdown/combobox (default), radio group, segmented control, list picker, and table (a radio group laid out as a table with column headers — for comparing options that each have multiple attributes, e.g. plan name/price/limits). The selected value is always the chosen item value, regardless of variant.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SHOWCASE CARDS
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Card selector</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-card-selector</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Best for plan selection with bold visual tiles.</p>
              <groupselectone--ml-card-selector
                name="card-1"
                value="${this.card1}"
                .isEditing=${true}
                required
                @change=${(e: CustomEvent) => {
                  this.card1 = e.detail.value ?? '';
                }}>
                <Label>Plan</Label>
                <Helper>Select the plan that fits your team.</Helper>
                <Trigger>Choose a plan</Trigger>
                <Group label="Popular">
                  <Item value="starter">Starter</Item>
                  <Item value="pro">Pro</Item>
                </Group>
                <Item value="enterprise">Enterprise</Item>
                <Empty>No plans available</Empty>
              </groupselectone--ml-card-selector>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Combobox</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-combobox</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Searchable dropdown for long lists.</p>
              <groupselectone--ml-combobox
                name="card-2"
                value="${this.card2}"
                placeholder="Search a country"
                searchable
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card2 = e.detail.value ?? '';
                }}>
                <Label>Country</Label>
                <Helper>Type to filter the list.</Helper>
                <Trigger>Select a country</Trigger>
                <Group label="Americas">
                  <Item value="us">United States</Item>
                  <Item value="br">Brazil</Item>
                </Group>
                <Item value="de">Germany</Item>
                <Empty>No countries found</Empty>
              </groupselectone--ml-combobox>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Dial select</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-dial-select</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Rotary-style selector for time or mode.</p>
              <groupselectone--ml-dial-select
                name="card-3"
                value="${this.card3}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card3 = e.detail.value ?? '';
                }}>
                <Label>Delivery slot</Label>
                <Helper>Pick a delivery window.</Helper>
                <Trigger>Choose a slot</Trigger>
                <Group label="Morning">
                  <Item value="am">8–11 AM</Item>
                  <Item value="pm">11–2 PM</Item>
                </Group>
                <Item value="eve">2–5 PM</Item>
                <Empty>No slots available</Empty>
              </groupselectone--ml-dial-select>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Discrete slider</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-discrete-slider</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Stepped selector for intensity or levels.</p>
              <groupselectone--ml-discrete-slider
                name="card-4"
                value="${this.card4}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card4 = e.detail.value ?? '';
                }}>
                <Label>Priority</Label>
                <Helper>Choose a service level.</Helper>
                <Trigger>Select priority</Trigger>
                <Group label="Standard">
                  <Item value="1">Low</Item>
                  <Item value="3">Normal</Item>
                </Group>
                <Item value="5">Critical</Item>
                <Empty>No levels configured</Empty>
              </groupselectone--ml-discrete-slider>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-sky-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Listbox sidebar select</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-listbox-sidebar-select</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Good for navigation-like choices.</p>
              <groupselectone--ml-listbox-sidebar-select
                name="card-5"
                value="${this.card5}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card5 = e.detail.value ?? '';
                }}>
                <Label>Workspace</Label>
                <Helper>Switch between teams.</Helper>
                <Trigger>Select a workspace</Trigger>
                <Group label="Product">
                  <Item value="analytics">Analytics</Item>
                  <Item value="growth">Growth</Item>
                </Group>
                <Item value="platform">Platform</Item>
                <Empty>No workspaces found</Empty>
              </groupselectone--ml-listbox-sidebar-select>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-indigo-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Radio group</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-radio-group</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Classic single-choice options in a form.</p>
              <groupselectone--ml-radio-group
                name="card-6"
                value="${this.card6}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card6 = e.detail.value ?? '';
                }}>
                <Label>Notification channel</Label>
                <Helper>Select where we should reach you.</Helper>
                <Trigger>Choose a channel</Trigger>
                <Group label="Messaging">
                  <Item value="email">Email</Item>
                  <Item value="sms">SMS</Item>
                </Group>
                <Item value="push">Push</Item>
                <Empty>No channels available</Empty>
              </groupselectone--ml-radio-group>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-purple-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Segmented control</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-segmented-control</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Compact toggle for mutually exclusive modes.</p>
              <groupselectone--ml-segmented-control
                name="card-7"
                value="${this.card7}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card7 = e.detail.value ?? '';
                }}>
                <Label>Billing cadence</Label>
                <Helper>Pick the billing interval.</Helper>
                <Trigger>Select cadence</Trigger>
                <Group label="Options">
                  <Item value="monthly">Monthly</Item>
                  <Item value="annual">Annual</Item>
                </Group>
                <Item value="quarterly">Quarterly</Item>
                <Empty>No billing options</Empty>
              </groupselectone--ml-segmented-control>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-teal-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Select dropdown with images</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-select-dropdown-img</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Visual choice list with thumbnails.</p>
              <groupselectone--ml-select-dropdown-img
                name="card-8"
                value="${this.card8}"
                placeholder="Choose a mascot"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card8 = e.detail.value ?? '';
                }}>
                <Label>Mascot</Label>
                <Helper>Pick a friendly brand mascot.</Helper>
                <Trigger>Select a mascot</Trigger>
                <Group label="Animals">
                  <Item value="cat">Cat</Item>
                  <Item value="fox">Fox</Item>
                </Group>
                <Item value="owl">Owl</Item>
                <Empty>No mascots available</Empty>
              </groupselectone--ml-select-dropdown-img>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-orange-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Select dropdown</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-select-dropdown</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Standard dropdown for quick single choice.</p>
              <groupselectone--ml-select-dropdown
                name="card-9"
                value="${this.card9}"
                placeholder="Select a team"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card9 = e.detail.value ?? '';
                }}>
                <Label>Design squad</Label>
                <Helper>Choose the squad you work with.</Helper>
                <Trigger>Select a squad</Trigger>
                <Group label="Studios">
                  <Item value="design">Design</Item>
                  <Item value="content">Content</Item>
                </Group>
                <Item value="brand">Brand</Item>
                <Empty>No squads available</Empty>
              </groupselectone--ml-select-dropdown>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-pink-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Select one autocomplete</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-select-one-autocomplete</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Autocomplete for large or remote lists.</p>
              <groupselectone--ml-select-one-autocomplete
                name="card-10"
                value="${this.card10}"
                placeholder="Search a city"
                searchable
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card10 = e.detail.value ?? '';
                }}>
                <Label>City</Label>
                <Helper>Type to filter cities.</Helper>
                <Trigger>Search a city</Trigger>
                <Group label="Asia">
                  <Item value="tokyo">Tokyo</Item>
                  <Item value="singapore">Singapore</Item>
                </Group>
                <Item value="sydney">Sydney</Item>
                <Empty>No cities match</Empty>
              </groupselectone--ml-select-one-autocomplete>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Select</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-select</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Default select field with minimal chrome.</p>
              <groupselectone--ml-select
                name="card-11"
                value="${this.card11}"
                placeholder="Choose currency"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card11 = e.detail.value ?? '';
                }}>
                <Label>Currency</Label>
                <Helper>Used for billing and reporting.</Helper>
                <Trigger>Select currency</Trigger>
                <Group label="Popular">
                  <Item value="usd">USD</Item>
                  <Item value="eur">EUR</Item>
                </Group>
                <Item value="gbp">GBP</Item>
                <Empty>No currencies available</Empty>
              </groupselectone--ml-select>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Table single select</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-table-single-select</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Compare options across multiple attributes.</p>
              <groupselectone--ml-table-single-select
                name="card-12"
                value="${this.card12}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card12 = e.detail.value ?? '';
                }}>
                <Label>Team tier</Label>
                <Helper>Compare tier limits and pricing.</Helper>
                <Trigger>Select a tier</Trigger>
                <Group label="Teams">
                  <Item value="starter">Starter</Item>
                  <Item value="team">Team</Item>
                </Group>
                <Item value="enterprise">Enterprise</Item>
                <Empty>No tiers available</Empty>
              </groupselectone--ml-table-single-select>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{
      scenario: string;
      cardSelector: boolean;
      combobox: boolean;
      dialSelect: boolean;
      discreteSlider: boolean;
      listboxSidebarSelect: boolean;
      radioGroup: boolean;
      segmentedControl: boolean;
      selectDropdownImg: boolean;
      selectDropdown: boolean;
      selectOneAutocomplete: boolean;
      select: boolean;
      tableSingleSelect: boolean;
    }> = [
      {
        scenario: 'Large visual tiles for plan or package selection.',
        cardSelector: true,
        combobox: false,
        dialSelect: false,
        discreteSlider: false,
        listboxSidebarSelect: false,
        radioGroup: false,
        segmentedControl: false,
        selectDropdownImg: false,
        selectDropdown: false,
        selectOneAutocomplete: false,
        select: false,
        tableSingleSelect: false,
      },
      {
        scenario: 'Long lists where users need search or autocomplete.',
        cardSelector: false,
        combobox: true,
        dialSelect: false,
        discreteSlider: false,
        listboxSidebarSelect: false,
        radioGroup: false,
        segmentedControl: false,
        selectDropdownImg: false,
        selectDropdown: false,
        selectOneAutocomplete: true,
        select: false,
        tableSingleSelect: false,
      },
      {
        scenario: 'Compact toolbar or mode switch with few options.',
        cardSelector: false,
        combobox: false,
        dialSelect: false,
        discreteSlider: false,
        listboxSidebarSelect: false,
        radioGroup: false,
        segmentedControl: true,
        selectDropdownImg: false,
        selectDropdown: false,
        selectOneAutocomplete: false,
        select: false,
        tableSingleSelect: false,
      },
      {
        scenario: 'Stepped scale or rotational control for levels.',
        cardSelector: false,
        combobox: false,
        dialSelect: true,
        discreteSlider: true,
        listboxSidebarSelect: false,
        radioGroup: false,
        segmentedControl: false,
        selectDropdownImg: false,
        selectDropdown: false,
        selectOneAutocomplete: false,
        select: false,
        tableSingleSelect: false,
      },
      {
        scenario: 'Sidebar navigation with persistent option list.',
        cardSelector: false,
        combobox: false,
        dialSelect: false,
        discreteSlider: false,
        listboxSidebarSelect: true,
        radioGroup: false,
        segmentedControl: false,
        selectDropdownImg: false,
        selectDropdown: false,
        selectOneAutocomplete: false,
        select: false,
        tableSingleSelect: false,
      },
      {
        scenario: 'Traditional form radio options and short lists.',
        cardSelector: false,
        combobox: false,
        dialSelect: false,
        discreteSlider: false,
        listboxSidebarSelect: false,
        radioGroup: true,
        segmentedControl: false,
        selectDropdownImg: false,
        selectDropdown: false,
        selectOneAutocomplete: false,
        select: true,
        tableSingleSelect: false,
      },
      {
        scenario: 'Standard dropdowns with minimal chrome.',
        cardSelector: false,
        combobox: false,
        dialSelect: false,
        discreteSlider: false,
        listboxSidebarSelect: false,
        radioGroup: false,
        segmentedControl: false,
        selectDropdownImg: false,
        selectDropdown: true,
        selectOneAutocomplete: false,
        select: true,
        tableSingleSelect: false,
      },
      {
        scenario: 'Option lists that need imagery or icons.',
        cardSelector: false,
        combobox: false,
        dialSelect: false,
        discreteSlider: false,
        listboxSidebarSelect: false,
        radioGroup: false,
        segmentedControl: false,
        selectDropdownImg: true,
        selectDropdown: false,
        selectOneAutocomplete: false,
        select: false,
        tableSingleSelect: false,
      },
      {
        scenario: 'Comparing multiple attributes before choosing one.',
        cardSelector: false,
        combobox: false,
        dialSelect: false,
        discreteSlider: false,
        listboxSidebarSelect: false,
        radioGroup: false,
        segmentedControl: false,
        selectDropdownImg: false,
        selectDropdown: false,
        selectOneAutocomplete: false,
        select: false,
        tableSingleSelect: true,
      },
    ];
    const headers = [
      { label: 'Card selector', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Combobox', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Dial select', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Discrete slider', cls: 'text-rose-600 dark:text-rose-400' },
      { label: 'Listbox sidebar', cls: 'text-sky-600 dark:text-sky-400' },
      { label: 'Radio group', cls: 'text-indigo-600 dark:text-indigo-400' },
      { label: 'Segmented control', cls: 'text-purple-600 dark:text-purple-400' },
      { label: 'Dropdown image', cls: 'text-teal-600 dark:text-teal-400' },
      { label: 'Dropdown', cls: 'text-orange-600 dark:text-orange-400' },
      { label: 'Autocomplete', cls: 'text-pink-600 dark:text-pink-400' },
      { label: 'Select', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Table select', cls: 'text-emerald-600 dark:text-emerald-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this matrix to match layout and interaction patterns to your single-selection decision.
          </p>
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <th class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-3/4">Scenario</th>
                  ${headers.map(
                    (h) => html`
                      <th class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}">${h.label}</th>
                    `
                  )}
                </tr>
              </thead>
              <tbody>
                ${rows.map(
                  (row, i) => html`
                    <tr class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0">
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                      ${([
                        row.cardSelector,
                        row.combobox,
                        row.dialSelect,
                        row.discreteSlider,
                        row.listboxSidebarSelect,
                        row.radioGroup,
                        row.segmentedControl,
                        row.selectDropdownImg,
                        row.selectDropdown,
                        row.selectOneAutocomplete,
                        row.select,
                        row.tableSingleSelect,
                      ] as boolean[]).map(
                        (ok) => html`
                          <td class="px-4 py-3.5 text-center">
                            ${ok
                              ? html`<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>`
                              : html`<span class="text-slate-200 dark:text-slate-700 text-sm">—</span>`}
                          </td>
                        `
                      )}
                    </tr>
                  `
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // RENDER
  protected render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }
}
