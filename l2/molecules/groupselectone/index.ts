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
import '/_102040_/l2/molecules/groupselectone/ml-select-table';

@customElement('molecules--groupselectone--index-102040')
export class GroupSelectOneIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardSelector: string | null = 'team';
  @state() private combobox: string | null = null;
  @state() private dialSelect: string | null = 'medium';
  @state() private discreteSlider: string | null = 'standard';
  @state() private listboxSidebarSelect: string | null = null;
  @state() private radioGroup: string | null = 'monthly';
  @state() private segmentedControl: string | null = 'grid';
  @state() private selectDropdownImg: string | null = null;
  @state() private selectDropdown: string | null = 'priority';
  @state() private selectOneAutocomplete: string | null = null;
  @state() private select: string | null = 'support';
  @state() private selectTable: string | null = null;

  // ===========================================================================
  // HERO
  private renderHero(): TemplateResult {
    return html`
      <header
        class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center"
      >
        <span
          class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
        >
          groupSelectOne
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Select One
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to select exactly one option from a list of mutually exclusive choices. Ideal for scenarios
          where a single, clear decision is required, with dropdown, radio, segmented, dial, and list-based variants.
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
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >ml-card-selector</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Great for visual plan or package choices.</p>
              <groupselectone--ml-card-selector
                name="card-card-selector"
                value="${this.cardSelector}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardSelector = e.detail.value;
                }}
              >
                <Label>Plan layout</Label>
                <Helper>Select the plan presentation for the offer.</Helper>
                <Trigger>Choose a plan...</Trigger>
                <Group label="Core plans">
                  <Item value="solo">Solo</Item>
                  <Item value="team">Team</Item>
                </Group>
                <Group label="Enterprise">
                  <Item value="enterprise">Enterprise</Item>
                </Group>
                <Empty>No plans available</Empty>
              </groupselectone--ml-card-selector>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Combobox</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >ml-combobox</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Best when the list is long but still visible.</p>
              <groupselectone--ml-combobox
                name="card-combobox"
                .value=${this.combobox}
                placeholder="Search a region"
                .searchable=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.combobox = e.detail.value;
                }}
              >
                <Label>Region</Label>
                <Helper>Type to filter global territories.</Helper>
                <Trigger>Select a region...</Trigger>
                <Group label="Americas">
                  <Item value="na">North America</Item>
                  <Item value="latam">Latin America</Item>
                </Group>
                <Group label="Europe">
                  <Item value="emea">Europe, Middle East</Item>
                </Group>
                <Empty>No regions found</Empty>
              </groupselectone--ml-combobox>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Dial select</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >ml-dial-select</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Tactile choice for intensity or sensitivity settings.</p>
              <groupselectone--ml-dial-select
                name="card-dial-select"
                value="${this.dialSelect}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.dialSelect = e.detail.value;
                }}
              >
                <Label>Sensitivity</Label>
                <Helper>Rotate to the desired responsiveness.</Helper>
                <Trigger>Pick sensitivity...</Trigger>
                <Group label="Presets">
                  <Item value="low">Low</Item>
                  <Item value="medium">Medium</Item>
                  <Item value="high">High</Item>
                </Group>
                <Group label="Expert">
                  <Item value="turbo">Turbo</Item>
                </Group>
                <Empty>No sensitivities available</Empty>
              </groupselectone--ml-dial-select>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Discrete slider</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >ml-discrete-slider</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Clear progression across ordered tiers.</p>
              <groupselectone--ml-discrete-slider
                name="card-discrete-slider"
                value="${this.discreteSlider}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.discreteSlider = e.detail.value;
                }}
              >
                <Label>Storage tier</Label>
                <Helper>Slide to the tier you need.</Helper>
                <Trigger>Select a tier...</Trigger>
                <Group label="Popular tiers">
                  <Item value="basic">Basic</Item>
                  <Item value="standard">Standard</Item>
                  <Item value="pro">Pro</Item>
                </Group>
                <Group label="Archive">
                  <Item value="archive">Archive</Item>
                </Group>
                <Empty>No tiers available</Empty>
              </groupselectone--ml-discrete-slider>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-sky-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Listbox sidebar select</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >ml-listbox-sidebar-select</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Use when categories need persistent navigation.</p>
              <groupselectone--ml-listbox-sidebar-select
                name="card-listbox-sidebar-select"
                .value=${this.listboxSidebarSelect}
                placeholder="Browse workspaces"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.listboxSidebarSelect = e.detail.value;
                }}
              >
                <Label>Workspace</Label>
                <Helper>Select the workspace to manage.</Helper>
                <Trigger>Choose a workspace...</Trigger>
                <Group label="Personal">
                  <Item value="design">Design Ops</Item>
                  <Item value="marketing">Marketing</Item>
                </Group>
                <Group label="Shared">
                  <Item value="product">Product Core</Item>
                  <Item value="sales">Sales West</Item>
                </Group>
                <Empty>No workspaces available</Empty>
              </groupselectone--ml-listbox-sidebar-select>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-indigo-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Radio group</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >ml-radio-group</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Simple single-choice selection with all options visible.</p>
              <groupselectone--ml-radio-group
                name="card-radio-group"
                value="${this.radioGroup}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.radioGroup = e.detail.value;
                }}
              >
                <Label>Billing cycle</Label>
                <Helper>Choose the cadence for invoices.</Helper>
                <Trigger>Choose a cycle...</Trigger>
                <Group label="Standard">
                  <Item value="monthly">Monthly</Item>
                  <Item value="annual">Annual</Item>
                </Group>
                <Group label="Enterprise">
                  <Item value="quarterly">Quarterly</Item>
                </Group>
                <Empty>No billing cycles available</Empty>
              </groupselectone--ml-radio-group>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-purple-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Segmented control</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >ml-segmented-control</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Ideal for short, mutually exclusive modes.</p>
              <groupselectone--ml-segmented-control
                name="card-segmented-control"
                value="${this.segmentedControl}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.segmentedControl = e.detail.value;
                }}
              >
                <Label>View mode</Label>
                <Helper>Switch how the content is arranged.</Helper>
                <Trigger>Select a view...</Trigger>
                <Group label="Layouts">
                  <Item value="grid">Grid</Item>
                  <Item value="list">List</Item>
                </Group>
                <Group label="Density">
                  <Item value="compact">Compact</Item>
                </Group>
                <Empty>No view modes available</Empty>
              </groupselectone--ml-segmented-control>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-teal-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Select dropdown image</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >ml-select-dropdown-img</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Combine imagery with standard dropdown behavior.</p>
              <groupselectone--ml-select-dropdown-img
                name="card-select-dropdown-img"
                .value=${this.selectDropdownImg}
                placeholder="Choose a country"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.selectDropdownImg = e.detail.value;
                }}
              >
                <Label>Country</Label>
                <Helper>Flags help distinguish options quickly.</Helper>
                <Trigger>Select a country...</Trigger>
                <Group label="Popular">
                  <Item value="us">🇺🇸 United States</Item>
                  <Item value="br">🇧🇷 Brazil</Item>
                </Group>
                <Group label="Europe">
                  <Item value="de">🇩🇪 Germany</Item>
                </Group>
                <Empty>No countries available</Empty>
              </groupselectone--ml-select-dropdown-img>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-orange-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Select dropdown</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >ml-select-dropdown</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Classic dropdown for compact single choice fields.</p>
              <groupselectone--ml-select-dropdown
                name="card-select-dropdown"
                value="${this.selectDropdown}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.selectDropdown = e.detail.value;
                }}
              >
                <Label>Priority</Label>
                <Helper>Set the default urgency for tickets.</Helper>
                <Trigger>Select priority...</Trigger>
                <Group label="Standard">
                  <Item value="low">Low</Item>
                  <Item value="priority">Normal</Item>
                </Group>
                <Group label="Escalated">
                  <Item value="high">High</Item>
                </Group>
                <Empty>No priorities available</Empty>
              </groupselectone--ml-select-dropdown>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-pink-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Select one autocomplete</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >ml-select-one-autocomplete</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Best for large lists where search is essential.</p>
              <groupselectone--ml-select-one-autocomplete
                name="card-select-one-autocomplete"
                .value=${this.selectOneAutocomplete}
                placeholder="Search teammates"
                .searchable=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.selectOneAutocomplete = e.detail.value;
                }}
              >
                <Label>Assignee</Label>
                <Helper>Find the teammate by name.</Helper>
                <Trigger>Assign to...</Trigger>
                <Group label="Design">
                  <Item value="amelia">Amelia Park</Item>
                  <Item value="luis">Luis Ortega</Item>
                </Group>
                <Group label="Engineering">
                  <Item value="mei">Mei Tan</Item>
                </Group>
                <Empty>No teammates available</Empty>
              </groupselectone--ml-select-one-autocomplete>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Select</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >ml-select</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Standard form-field select with grouped items.</p>
              <groupselectone--ml-select
                name="card-select"
                value="${this.select}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.select = e.detail.value;
                }}
              >
                <Label>Department</Label>
                <Helper>Choose the team responsible for the request.</Helper>
                <Trigger>Select a department...</Trigger>
                <Group label="Operations">
                  <Item value="support">Support</Item>
                  <Item value="success">Customer Success</Item>
                </Group>
                <Group label="Technical">
                  <Item value="platform">Platform</Item>
                </Group>
                <Empty>No departments available</Empty>
              </groupselectone--ml-select>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Select table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >ml-select-table</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Useful when choices include multiple data points.</p>
              <groupselectone--ml-select-table
                name="card-select-table"
                .value=${this.selectTable}
                placeholder="Choose a vendor"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.selectTable = e.detail.value;
                }}
              >
                <Label>Vendor</Label>
                <Helper>Compare vendors before selecting one.</Helper>
                <Trigger>Select a vendor...</Trigger>
                <Group label="Preferred">
                  <Item value="northwind">Northwind</Item>
                  <Item value="acme">Acme Corp</Item>
                </Group>
                <Group label="New">
                  <Item value="lumen">Lumen Supply</Item>
                </Group>
                <Empty>No vendors available</Empty>
              </groupselectone--ml-select-table>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  private renderReferenceTable(): TemplateResult {
    type Row = {
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
      selectTable: boolean;
    };

    type HeaderKey = Exclude<keyof Row, 'scenario'>;

    const rows: Row[] = [
      {
        scenario: 'User must see options as rich cards or highly visual choices.',
        cardSelector: true,
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
        selectTable: false,
      },
      {
        scenario: 'Single choice from a short list with minimal space.',
        cardSelector: false,
        combobox: false,
        dialSelect: false,
        discreteSlider: true,
        listboxSidebarSelect: false,
        radioGroup: true,
        segmentedControl: true,
        selectDropdownImg: false,
        selectDropdown: false,
        selectOneAutocomplete: false,
        select: false,
        selectTable: false,
      },
      {
        scenario: 'Long list that benefits from search or typeahead filtering.',
        cardSelector: false,
        combobox: true,
        dialSelect: false,
        discreteSlider: false,
        listboxSidebarSelect: false,
        radioGroup: false,
        segmentedControl: false,
        selectDropdownImg: false,
        selectDropdown: true,
        selectOneAutocomplete: true,
        select: false,
        selectTable: false,
      },
      {
        scenario: 'Need browsing with categories and persistent sidebar navigation.',
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
        selectTable: true,
      },
      {
        scenario: 'Standard form-field dropdown with grouped items and defaults.',
        cardSelector: false,
        combobox: false,
        dialSelect: false,
        discreteSlider: false,
        listboxSidebarSelect: false,
        radioGroup: false,
        segmentedControl: false,
        selectDropdownImg: true,
        selectDropdown: true,
        selectOneAutocomplete: false,
        select: true,
        selectTable: false,
      },
      {
        scenario: 'Fine-tuned choice via tactile control or stepped progression.',
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
        selectTable: false,
      },
    ];

    const headers: Array<{ key: HeaderKey; label: string; cls: string }> = [
      { key: 'cardSelector', label: 'Card selector', cls: 'text-violet-600 dark:text-violet-400' },
      { key: 'combobox', label: 'Combobox', cls: 'text-emerald-600 dark:text-emerald-400' },
      { key: 'dialSelect', label: 'Dial', cls: 'text-amber-600 dark:text-amber-400' },
      { key: 'discreteSlider', label: 'Slider', cls: 'text-rose-600 dark:text-rose-400' },
      { key: 'listboxSidebarSelect', label: 'Listbox', cls: 'text-sky-600 dark:text-sky-400' },
      { key: 'radioGroup', label: 'Radio', cls: 'text-indigo-600 dark:text-indigo-400' },
      { key: 'segmentedControl', label: 'Segmented', cls: 'text-purple-600 dark:text-purple-400' },
      { key: 'selectDropdownImg', label: 'Dropdown img', cls: 'text-teal-600 dark:text-teal-400' },
      { key: 'selectDropdown', label: 'Dropdown', cls: 'text-orange-600 dark:text-orange-400' },
      { key: 'selectOneAutocomplete', label: 'Autocomplete', cls: 'text-pink-600 dark:text-pink-400' },
      { key: 'select', label: 'Select', cls: 'text-violet-600 dark:text-violet-400' },
      { key: 'selectTable', label: 'Select table', cls: 'text-emerald-600 dark:text-emerald-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this guide to match the interaction style, density, and discoverability you need for a single-choice
            decision.
          </p>
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <th
                    class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-3/4"
                  >
                    Scenario
                  </th>
                  ${headers.map(
                    (h) => html`
                      <th class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}">
                        ${h.label}
                      </th>
                    `
                  )}
                </tr>
              </thead>
              <tbody>
                ${rows.map(
                  (row, i) => html`
                    <tr
                      class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0"
                    >
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                      ${headers.map((h) => {
                        const ok = row[h.key];
                        return html`
                          <td class="px-4 py-3.5 text-center">
                            ${ok
                              ? html`<span
                                  class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
                                  >✓</span
                                >`
                              : html`<span class="text-slate-200 dark:text-slate-700 text-sm">—</span>`}
                          </td>
                        `;
                      })}
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
