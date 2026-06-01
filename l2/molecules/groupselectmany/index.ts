/// <mls fileReference="_102040_/l2/molecules/groupselectmany/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupselectmany/ml-multi-select-dropdown';
import '/_102040_/l2/molecules/groupselectmany/ml-popover-multi-select';

@customElement('molecules--groupselectmany--index-102040')
export class GroupSelectManyIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardOne = 'read,write';
  @state() private cardTwo = 'design,qa';

  // ===========================================================================
  // HERO
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span
          class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
        >
          groupSelectMany
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Select Many
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to select one or more options from a list. Value is a comma-separated string of selected item
          values. Supports searchable filtering, min/max selection limits, grouped items, and disabled options.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SHOWCASE CARDS
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section
        class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700"
      >
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Multi-select dropdown</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupselectmany--ml-multi-select-dropdown</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Compact dropdown with search and a custom trigger.</p>
              <groupselectmany--ml-multi-select-dropdown
                name="card-1"
                value="${this.cardOne}"
                placeholder="Select permissions"
                .searchable=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardOne = e.detail.value;
                }}
              >
                <Label>Permissions</Label>
                <Helper>Select the actions the user can perform.</Helper>
                <Trigger>
                  <span class="inline-flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Manage permissions
                  </span>
                </Trigger>
                <Item value="read">Read</Item>
                <Item value="write">Write</Item>
                <Item value="execute">Execute</Item>
                <Item value="admin" disabled>Admin (restricted)</Item>
                <Empty>No permissions available</Empty>
              </groupselectmany--ml-multi-select-dropdown>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Popover multi-select</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupselectmany--ml-popover-multi-select</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Grouped items with min/max selection limits.</p>
              <groupselectmany--ml-popover-multi-select
                name="card-2"
                value="${this.cardTwo}"
                placeholder="Choose team roles"
                .minSelection=${1}
                .maxSelection=${3}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardTwo = e.detail.value;
                }}
              >
                <Label>Team roles</Label>
                <Helper>Pick up to three roles for this squad.</Helper>
                <Group label="Product">
                  <Item value="design">Design</Item>
                  <Item value="product">Product</Item>
                </Group>
                <Group label="Engineering">
                  <Item value="frontend">Frontend</Item>
                  <Item value="backend">Backend</Item>
                  <Item value="qa">QA</Item>
                </Group>
                <Empty>No roles found</Empty>
              </groupselectmany--ml-popover-multi-select>
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
      multiSelectDropdown: boolean;
      popoverMultiSelect: boolean;
    }> = [
      {
        scenario: 'Need a compact dropdown trigger that fits tight toolbar layouts.',
        multiSelectDropdown: true,
        popoverMultiSelect: false,
      },
      {
        scenario: 'Want grouped options with min/max limits surfaced in a popover.',
        multiSelectDropdown: false,
        popoverMultiSelect: true,
      },
      {
        scenario: 'Searchable list where the trigger can be customized.',
        multiSelectDropdown: true,
        popoverMultiSelect: true,
      },
    ];
    const headers = [
      { label: 'Multi-select dropdown', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Popover multi-select', cls: 'text-emerald-600 dark:text-emerald-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Choose the implementation that best balances space, grouping needs, and how the trigger is presented while
            still supporting multi-selection.
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
                      <th class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}">${h.label}</th>
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
                      ${([row.multiSelectDropdown, row.popoverMultiSelect] as boolean[]).map(
                        (ok) => html`
                          <td class="px-4 py-3.5 text-center">
                            ${ok
                              ? html`<span
                                  class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
                                  >✓</span
                                >`
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
        ${this.renderHero()} ${this.renderShowcaseCards()} ${this.renderReferenceTable()}
      </div>
    `;
  }
}
