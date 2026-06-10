/// <mls fileReference="_102040_/l2/molecules/groupselectmany/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupselectmany/ml-dual-list-select';
import '/_102040_/l2/molecules/groupselectmany/ml-multi-checkbox-list';
import '/_102040_/l2/molecules/groupselectmany/ml-multi-select-dropdown';
import '/_102040_/l2/molecules/groupselectmany/ml-popover-multi-select';
import '/_102040_/l2/molecules/groupselectmany/ml-tree-multi-select';

@customElement('molecules--groupselectmany--index-102040')
export class GroupSelectManyIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardDualList = 'design,engineering';
  @state() private cardCheckboxes = 'read,write';
  @state() private cardDropdown = 'tokyo,singapore';
  @state() private cardPopover = 'basic,pro';
  @state() private cardTree = 'north-america,eu-west';

  // ===========================================================================
  // HERO
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupSelectMany
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Select Many
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to select one or more options from a list, with support for search, limits, grouping, and disabled options. Implementations range from checklists to multi-select dropdowns, dual lists, card grids, and toggle groups.
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Dual list select</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-dual-list-select</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Great for moving items between available and selected buckets.</p>
              <groupselectmany--ml-dual-list-select
                name="card-1"
                value="${this.cardDualList}"
                .minSelection=${1}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardDualList = e.detail.value;
                }}
              >
                <Label>Team access</Label>
                <Helper>Select at least one team for onboarding.</Helper>
                <Trigger>Choose teams</Trigger>
                <Group label="Core">
                  <Item value="design">Design</Item>
                  <Item value="engineering">Engineering</Item>
                </Group>
                <Group label="Support">
                  <Item value="success">Customer Success</Item>
                  <Item value="finance" disabled>Finance (restricted)</Item>
                </Group>
                <Item value="marketing">Marketing</Item>
                <Empty>No teams available</Empty>
              </groupselectmany--ml-dual-list-select>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Multi checkbox list</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-multi-checkbox-list</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Dense, always-visible options for quick scanning.</p>
              <groupselectmany--ml-multi-checkbox-list
                name="card-2"
                value="${this.cardCheckboxes}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardCheckboxes = e.detail.value;
                }}
              >
                <Label>Permissions</Label>
                <Helper>Assign one or more permissions.</Helper>
                <Trigger>Permissions</Trigger>
                <Group label="Standard">
                  <Item value="read">Read</Item>
                  <Item value="write">Write</Item>
                </Group>
                <Group label="Advanced">
                  <Item value="execute">Execute</Item>
                  <Item value="admin" disabled>Admin (restricted)</Item>
                </Group>
                <Item value="audit">Audit logs</Item>
                <Empty>No permissions available</Empty>
              </groupselectmany--ml-multi-checkbox-list>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Multi select dropdown</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-multi-select-dropdown</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Compact selection with search and a custom trigger.</p>
              <groupselectmany--ml-multi-select-dropdown
                name="card-3"
                value="${this.cardDropdown}"
                placeholder="Select regions"
                .searchable=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardDropdown = e.detail.value;
                }}
              >
                <Label>Launch regions</Label>
                <Helper>Pick regions to include in the rollout.</Helper>
                <Trigger>Regions (${this.cardDropdown.split(',').length})</Trigger>
                <Group label="Asia-Pacific">
                  <Item value="tokyo">Tokyo</Item>
                  <Item value="singapore">Singapore</Item>
                </Group>
                <Group label="Americas">
                  <Item value="seattle">Seattle</Item>
                  <Item value="sao-paulo">São Paulo</Item>
                </Group>
                <Item value="london">London</Item>
                <Empty>No regions found</Empty>
              </groupselectmany--ml-multi-select-dropdown>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Popover multi select</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-popover-multi-select</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Ideal for tags or plans when the list is medium-sized.</p>
              <groupselectmany--ml-popover-multi-select
                name="card-4"
                value="${this.cardPopover}"
                placeholder="Select plan"
                .searchable=${true}
                .maxSelection=${3}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardPopover = e.detail.value;
                }}
              >
                <Label>Plan features</Label>
                <Helper>Choose up to three features to highlight.</Helper>
                <Trigger>${this.cardPopover ? 'Edit features' : 'Choose features'}</Trigger>
                <Group label="Popular">
                  <Item value="basic">Basic</Item>
                  <Item value="pro">Pro</Item>
                </Group>
                <Group label="Enterprise">
                  <Item value="security">Advanced security</Item>
                  <Item value="analytics">Analytics</Item>
                </Group>
                <Item value="support">24/7 Support</Item>
                <Empty>No features available</Empty>
              </groupselectmany--ml-popover-multi-select>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-sky-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Tree multi select</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-tree-multi-select</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Best for hierarchical data like regions, categories, or orgs.</p>
              <groupselectmany--ml-tree-multi-select
                name="card-5"
                value="${this.cardTree}"
                .searchable=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardTree = e.detail.value;
                }}
              >
                <Label>Deployment zones</Label>
                <Helper>Select one or more regional zones.</Helper>
                <Trigger>Manage zones</Trigger>
                <Group label="Americas">
                  <Item value="north-america">North America</Item>
                  <Item value="south-america">South America</Item>
                </Group>
                <Group label="Europe">
                  <Item value="eu-west">EU West</Item>
                  <Item value="eu-central">EU Central</Item>
                </Group>
                <Item value="apac">APAC</Item>
                <Empty>No zones available</Empty>
              </groupselectmany--ml-tree-multi-select>
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
      dualListSelect: boolean;
      multiCheckboxList: boolean;
      multiSelectDropdown: boolean;
      popoverMultiSelect: boolean;
      treeMultiSelect: boolean;
    }> = [
      {
        scenario: 'Users need to move items between two distinct lists with clear selection counts.',
        dualListSelect: true,
        multiCheckboxList: false,
        multiSelectDropdown: false,
        popoverMultiSelect: false,
        treeMultiSelect: false,
      },
      {
        scenario: 'All options should stay visible without opening a panel.',
        dualListSelect: false,
        multiCheckboxList: true,
        multiSelectDropdown: false,
        popoverMultiSelect: false,
        treeMultiSelect: false,
      },
      {
        scenario: 'Screen space is limited and the list can be searched or filtered.',
        dualListSelect: false,
        multiCheckboxList: false,
        multiSelectDropdown: true,
        popoverMultiSelect: true,
        treeMultiSelect: false,
      },
      {
        scenario: 'Selections come from nested categories or organizational hierarchies.',
        dualListSelect: false,
        multiCheckboxList: false,
        multiSelectDropdown: false,
        popoverMultiSelect: false,
        treeMultiSelect: true,
      },
      {
        scenario: 'You need a compact, chip-based picker with a customizable trigger.',
        dualListSelect: false,
        multiCheckboxList: false,
        multiSelectDropdown: false,
        popoverMultiSelect: true,
        treeMultiSelect: false,
      },
    ];
    const headers = [
      { label: 'Dual list', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Checkbox list', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Dropdown', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Popover', cls: 'text-rose-600 dark:text-rose-400' },
      { label: 'Tree', cls: 'text-sky-600 dark:text-sky-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this group when you need users to choose one or more options; compare layouts to balance visibility, hierarchy, and search.
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
                        row.dualListSelect,
                        row.multiCheckboxList,
                        row.multiSelectDropdown,
                        row.popoverMultiSelect,
                        row.treeMultiSelect,
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
  public render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()} ${this.renderShowcaseCards()} ${this.renderReferenceTable()}
      </div>
    `;
  }
}
