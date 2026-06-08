/// <mls fileReference="_102040_/l2/molecules/grouptriggeraction/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/grouptriggeraction/ml-icon-button';
import '/_102040_/l2/molecules/grouptriggeraction/ml-button-standard';
import '/_102040_/l2/molecules/grouptriggeraction/ml-split-button';
import '/_102040_/l2/molecules/grouptriggeraction/ml-button-group';

@customElement('molecules--grouptriggeraction--index-102040')
export class GroupTriggerActionIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardIconButton = 'Search';
  @state() private cardStandardButton = 'Save changes';
  @state() private cardSplitButton = 'Export';
  @state() private cardButtonGroup = 'View';

  // ===========================================================================
  // HERO
  // ===========================================================================
  private renderHero(): TemplateResult {
    return html`
      <header
        class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center"
      >
        <span
          class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
        >
          groupTriggerAction
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Trigger Actions
        </h1>
        <p
          class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Allows the user to execute an action or command. Choose between standard buttons, icon
          buttons, split actions, and grouped controls while keeping label and icon composition
          consistent.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SHOWCASE CARDS
  // ===========================================================================
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Icon button</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >grouptriggeraction--ml-icon-button</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Compact trigger for toolbars or dense UI where the icon leads.
              </p>
              <grouptriggeraction--ml-icon-button
                name="card-1"
                value="${this.cardIconButton}"
                size="sm"
                variant="ghost"
                icon-position="start"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardIconButton = e.detail.value;
                }}
              >
                <Label>Search</Label>
                <Icon>🔍</Icon>
              </grouptriggeraction--ml-icon-button>
            </div>
          </div>
          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Standard button</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >grouptriggeraction--ml-button-standard</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Primary action button with label and optional icon support.
              </p>
              <grouptriggeraction--ml-button-standard
                name="card-2"
                value="${this.cardStandardButton}"
                size="md"
                variant="primary"
                icon-position="start"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardStandardButton = e.detail.value;
                }}
              >
                <Label>Save changes</Label>
                <Icon>💾</Icon>
              </grouptriggeraction--ml-button-standard>
            </div>
          </div>
          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Split button</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >grouptriggeraction--ml-split-button</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Default action plus a secondary option in one control.
              </p>
              <grouptriggeraction--ml-split-button
                name="card-3"
                value="${this.cardSplitButton}"
                size="md"
                variant="secondary"
                icon-position="end"
                .loading=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardSplitButton = e.detail.value;
                }}
              >
                <Label>Export</Label>
                <Icon>📤</Icon>
              </grouptriggeraction--ml-split-button>
            </div>
          </div>
          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Button group</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >grouptriggeraction--ml-button-group</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Cluster related commands while keeping them visually unified.
              </p>
              <grouptriggeraction--ml-button-group
                name="card-4"
                value="${this.cardButtonGroup}"
                size="sm"
                variant="ghost"
                icon-position="start"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardButtonGroup = e.detail.value;
                }}
              >
                <Label>View</Label>
                <Icon>🗂️</Icon>
              </grouptriggeraction--ml-button-group>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  // ===========================================================================
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{
      scenario: string;
      iconButton: boolean;
      standardButton: boolean;
      splitButton: boolean;
      buttonGroup: boolean;
    }> = [
      {
        scenario: 'Toolbar or compact UI where space is limited and an icon leads the action.',
        iconButton: true,
        standardButton: false,
        splitButton: false,
        buttonGroup: false,
      },
      {
        scenario: 'Primary, high-confidence action that needs a clear label and icon.',
        iconButton: false,
        standardButton: true,
        splitButton: false,
        buttonGroup: false,
      },
      {
        scenario: 'Action with a default behavior plus a secondary menu of alternatives.',
        iconButton: false,
        standardButton: false,
        splitButton: true,
        buttonGroup: false,
      },
      {
        scenario: 'Multiple related actions that should be presented as a unified cluster.',
        iconButton: false,
        standardButton: false,
        splitButton: false,
        buttonGroup: true,
      },
    ];
    const headers = [
      { label: 'Icon button', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Standard button', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Split button', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Button group', cls: 'text-rose-600 dark:text-rose-400' },
    ];

    return html`
      <section
        class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700"
      >
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this guide to select the right trigger control for executing actions or commands,
            balancing clarity, density, and available alternatives.
          </p>
          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
          >
            <table class="w-full text-sm">
              <thead>
                <tr
                  class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700"
                >
                  <th
                    class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-3/4"
                  >
                    Scenario
                  </th>
                  ${headers.map(
                    (h) => html`
                      <th
                        class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}"
                      >
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
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">
                        ${row.scenario}
                      </td>
                      ${([
                        row.iconButton,
                        row.standardButton,
                        row.splitButton,
                        row.buttonGroup,
                      ] as boolean[]).map(
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
  // ===========================================================================
  render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }
}
