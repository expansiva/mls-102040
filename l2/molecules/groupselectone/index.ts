/// <mls fileReference="_102040_/l2/molecules/groupselectone/index.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupselectone/ml-radio-group';
import '/_102040_/l2/molecules/groupselectone/ml-segmented-control';
import '/_102040_/l2/molecules/groupselectone/ml-discrete-slider';
import '/_102040_/l2/molecules/groupselectone/ml-select-one-autocomplete';
import '/_102040_/l2/molecules/groupselectone/ml-select-dropdown';
import '/_102040_/l2/molecules/groupselectone/ml-select-dropdown-img';
import '/_102040_/l2/molecules/groupselectone/ml-card-selector';
import '/_102040_/l2/molecules/groupselectone/ml-listbox-sidebar-select';

@customElement('molecules--groupselectone--index-102040')
export class GroupSelectOneIndex extends StateLitElement {

  // ── Showcase card states ─────────────────────────────────────
  @state() cardPlan    = 'pro';
  @state() cardCycle   = 'monthly';
  @state() cardSat     = '50';
  @state() cardCountry = 'BR';
  @state() cardRole    = 'admin';
  @state() cardLang    = 'en';
  @state() cardCard    = 'pro';
  @state() cardSidebar = 'dashboard';

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
  // SHOWCASE CARDS
  // ===========================================================================

  private renderShowcaseCards(): TemplateResult {
    return html`
<section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
  <div class="max-w-2xl mx-auto flex flex-col gap-5">

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

    <!-- Select Dropdown -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="h-1 bg-sky-500"></div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Select Dropdown</p>
          <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-select-dropdown</code>
        </div>
        <p class="text-xs text-slate-400 mb-5">Compact dropdown for forms</p>
        <groupselectone--ml-select-dropdown
          value="${this.cardRole}" name="card-role" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.cardRole = e.detail.value; }}>
          <Label>Role</Label>
          <Item value="admin">Admin</Item>
          <Item value="editor">Editor</Item>
          <Item value="viewer">Viewer</Item>
          <Item value="guest">Guest</Item>
        </groupselectone--ml-select-dropdown>
      </div>
    </div>

    <!-- Select Dropdown Img -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="h-1 bg-indigo-500"></div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Select Dropdown Img</p>
          <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-select-dropdown-img</code>
        </div>
        <p class="text-xs text-slate-400 mb-5">Dropdown with image per option</p>
        <groupselectone--ml-select-dropdown-img
          value="${this.cardLang}" name="card-lang" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.cardLang = e.detail.value; }}>
          <Label>Language</Label>
          <Item value="en"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 14'%3E%3Crect width='20' height='14' fill='%23003087'/%3E%3Crect y='5.5' width='20' height='3' fill='white'/%3E%3Crect x='8.5' width='3' height='14' fill='white'/%3E%3Crect y='6' width='20' height='2' fill='%23C8102E'/%3E%3Crect x='9' width='2' height='14' fill='%23C8102E'/%3E%3C/svg%3E" width="20" height="14" alt="EN"/>English</Item>
          <Item value="pt"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 14'%3E%3Crect width='20' height='14' fill='%23FF0000'/%3E%3Crect width='8' height='14' fill='%23006600'/%3E%3C/svg%3E" width="20" height="14" alt="PT"/>Portuguese</Item>
          <Item value="de"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 14'%3E%3Crect width='20' height='14' fill='%23FFCE00'/%3E%3Crect width='20' height='9.5' fill='%23DD0000'/%3E%3Crect width='20' height='4.5' fill='%23000'/%3E%3C/svg%3E" width="20" height="14" alt="DE"/>German</Item>
          <Item value="fr"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 14'%3E%3Crect width='20' height='14' fill='%23ED2939'/%3E%3Crect width='13' height='14' fill='white'/%3E%3Crect width='7' height='14' fill='%230055A4'/%3E%3C/svg%3E" width="20" height="14" alt="FR"/>French</Item>
        </groupselectone--ml-select-dropdown-img>
      </div>
    </div>

    <!-- Card Selector -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="h-1 bg-purple-500"></div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Card Selector</p>
          <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-card-selector</code>
        </div>
        <p class="text-xs text-slate-400 mb-5">Rich card grid in a dropdown</p>
        <groupselectone--ml-card-selector
          value="${this.cardCard}" name="card-card" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.cardCard = e.detail.value; }}>
          <Label>Plan</Label>
          <Item value="starter">
            <p class="font-semibold text-sm">Starter</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">$9 / month</p>
          </Item>
          <Item value="pro">
            <p class="font-semibold text-sm">Pro</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">$29 / month</p>
          </Item>
          <Item value="team">
            <p class="font-semibold text-sm">Team</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">$79 / month</p>
          </Item>
        </groupselectone--ml-card-selector>
      </div>
    </div>

    <!-- Listbox Sidebar -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="h-1 bg-teal-500"></div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Listbox Sidebar</p>
          <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-listbox-sidebar-select</code>
        </div>
        <p class="text-xs text-slate-400 mb-5">Persistent sidebar navigation</p>
        <groupselectone--ml-listbox-sidebar-select
          value="${this.cardSidebar}" name="card-sidebar" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.cardSidebar = e.detail.value; }}>
          <Label>Navigation</Label>
          <Group label="Main">
            <Item value="dashboard">Dashboard</Item>
            <Item value="analytics">Analytics</Item>
            <Item value="reports">Reports</Item>
          </Group>
          <Group label="Settings">
            <Item value="profile">Profile</Item>
            <Item value="billing">Billing</Item>
            <Item value="security">Security</Item>
          </Group>
        </groupselectone--ml-listbox-sidebar-select>
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
      radio: boolean; seg: boolean; slider: boolean; auto: boolean;
      drop: boolean; dropImg: boolean; card: boolean; listbox: boolean;
    }> = [
      { scenario: '2–5 compact inline options',                      radio: false, seg: true,  slider: false, auto: false, drop: false, dropImg: false, card: false, listbox: false },
      { scenario: 'All options permanently visible',                 radio: true,  seg: true,  slider: true,  auto: false, drop: false, dropImg: false, card: false, listbox: true  },
      { scenario: 'Options have an ordinal or numeric scale',        radio: false, seg: false, slider: true,  auto: false, drop: false, dropImg: false, card: false, listbox: false },
      { scenario: 'Large list (10+ options)',                        radio: false, seg: false, slider: false, auto: true,  drop: true,  dropImg: true,  card: false, listbox: false },
      { scenario: 'User benefits from typing to filter',             radio: false, seg: false, slider: false, auto: true,  drop: false, dropImg: false, card: false, listbox: false },
      { scenario: 'Each option has an associated image or icon',     radio: false, seg: false, slider: false, auto: false, drop: false, dropImg: true,  card: false, listbox: false },
      { scenario: 'Options need rich content (price, description)',  radio: false, seg: false, slider: false, auto: false, drop: false, dropImg: false, card: true,  listbox: false },
      { scenario: 'Persistent sidebar navigation list',             radio: false, seg: false, slider: false, auto: false, drop: false, dropImg: false, card: false, listbox: true  },
      { scenario: 'Compact dropdown embedded in a form',            radio: false, seg: false, slider: false, auto: false, drop: true,  dropImg: true,  card: true,  listbox: false },
    ];
    const headers = [
      { label: 'Radio',       cls: 'text-violet-600 dark:text-violet-400'   },
      { label: 'Segmented',   cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Slider',      cls: 'text-amber-600 dark:text-amber-400'     },
      { label: 'Autocomplete',cls: 'text-rose-600 dark:text-rose-400'       },
      { label: 'Dropdown',    cls: 'text-sky-600 dark:text-sky-400'         },
      { label: 'Drop. Img',   cls: 'text-indigo-600 dark:text-indigo-400'   },
      { label: 'Card',        cls: 'text-purple-600 dark:text-purple-400'   },
      { label: 'Listbox',     cls: 'text-teal-600 dark:text-teal-400'       },
    ];
    return html`
<section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">Match your scenario to the right control at a glance.</p>
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-2/5">
              Scenario
            </th>
            ${headers.map(h => html`
              <th class="px-2 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}">${h.label}</th>
            `)}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row, i) => html`
            <tr class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0">
              <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
              ${([row.radio, row.seg, row.slider, row.auto, row.drop, row.dropImg, row.card, row.listbox] as boolean[]).map(ok => html`
                <td class="px-2 py-3.5 text-center">
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
