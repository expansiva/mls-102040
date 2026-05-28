/// <mls fileReference="_102040_/l2/molecules/groupselectmany/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupselectmany/ml-multi-select-dropdown';
import '/_102040_/l2/molecules/groupselectmany/ml-popover-multi-select';

@customElement('molecules--groupselectmany--index-102040')
export class GroupGroupSelectManyIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private card1 = 'growth,product';
  @state() private card2 = 'research,qa';

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
          groupSelectMany
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Select Many
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to select one or more options from a list. Value is a comma-separated string of selected item
          values. Supports searchable filtering, min/max selection limits, grouped items, and disabled options.
          Implementations include checkbox group, chips/tags, multi-select dropdown, dual list (transfer list), card grid
          with selection, and toggle group.
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
          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Multi-select dropdown</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupselectmany--ml-multi-select-dropdown</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Searchable dropdown with grouped topics and selection limits.</p>
              <groupselectmany--ml-multi-select-dropdown
                name="card-1"
                value="${this.card1}"
                .isEditing=${true}
                .searchable=${true}
                .minSelection=${1}
                .maxSelection=${3}
                placeholder="Choose up to three topics"
                @change=${(e: CustomEvent) => {
                  this.card1 = e.detail.value;
                }}
              >
                <Label>Primary interests</Label>
                <Trigger>Select topics (${this.card1.split(',').filter(Boolean).length})</Trigger>
                <Group label="Growth">
                  <Item value="growth">Growth strategy</Item>
                  <Item value="retention">Retention programs</Item>
                </Group>
                <Group label="Product">
                  <Item value="product">Product discovery</Item>
                  <Item value="design">Design systems</Item>
                </Group>
                <Item value="analytics" disabled>Analytics (coming soon)</Item>
                <Empty>No topics match the filter.</Empty>
                <Helper>Pick at least one topic and no more than three.</Helper>
              </groupselectmany--ml-multi-select-dropdown>
            </div>
          </div>

          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Popover multi-select</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupselectmany--ml-popover-multi-select</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Popover trigger for dense screens and quick selection.</p>
              <groupselectmany--ml-popover-multi-select
                name="card-2"
                value="${this.card2}"
                .isEditing=${true}
                .searchable=${false}
                .minSelection=${0}
                .maxSelection=${0}
                placeholder="Assign squads"
                @change=${(e: CustomEvent) => {
                  this.card2 = e.detail.value;
                }}
              >
                <Label>Squad assignments</Label>
                <Trigger>Assign squads</Trigger>
                <Group label="Quality">
                  <Item value="qa">QA</Item>
                  <Item value="security">Security</Item>
                </Group>
                <Group label="Discovery">
                  <Item value="research">Research</Item>
                  <Item value="ux">UX</Item>
                </Group>
                <Item value="support" disabled>Support (read-only)</Item>
                <Empty>No squads available.</Empty>
                <Helper>Select any squads that should be looped in.</Helper>
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
        scenario: 'Needs inline search with persistent list visibility for heavy filtering.',
        multiSelectDropdown: true,
        popoverMultiSelect: false,
      },
      {
        scenario: 'Compact trigger required to save horizontal space in dense layouts.',
        multiSelectDropdown: false,
        popoverMultiSelect: true,
      },
      {
        scenario: 'Guided selection with min/max limits and grouped headings.',
        multiSelectDropdown: true,
        popoverMultiSelect: true,
      },
      {
        scenario: 'Prefer a simple click-to-open control for quick pick lists.',
        multiSelectDropdown: false,
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
            Use this table to decide which multi-select pattern best matches your layout density and interaction needs.
          </p>
          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
          >
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
                      class="${i % 2 !== 0
                        ? 'bg-slate-50/60 dark:bg-slate-900/40'
                        : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0"
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
  render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()} ${this.renderShowcaseCards()} ${this.renderReferenceTable()}
      </div>
    `;
  }
}
