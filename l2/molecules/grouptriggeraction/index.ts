/// <mls fileReference="_102040_/l2/molecules/grouptriggeraction/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';

// ── Component imports ───────────────────────────────────────────────────────
import '/_102040_/l2/molecules/grouptriggeraction/ml-button-group';
import '/_102040_/l2/molecules/grouptriggeraction/ml-button-standard';
import '/_102040_/l2/molecules/grouptriggeraction/ml-icon-button';
import '/_102040_/l2/molecules/grouptriggeraction/ml-split-button';
import '/_102040_/l2/molecules/grouptriggeraction/ml-kebab-action-trigger';

@customElement('molecules--grouptriggeraction--index-102040')
export class GroupTriggerActionIndex extends StateLitElement {
  // ── Showcase card states ───────────────────────────────────────────────────
  @state() private cardButtonGroup: string = 'Group';
  @state() private cardButtonStandard: string = 'Save';
  @state() private cardIconButton: string = '';
  @state() private cardSplitButton: string = 'More';
  @state() private cardKebabActionTrigger: string = '';

  // ===========================================================================
  // SECTION: Hero
  // ===========================================================================
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupTriggerAction
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Trigger Action
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to execute an action or command. Supports Label and Icon slot tags with flexible composition (text only, icon only, or both). Configurable variant, size, loading state, and icon position. Implementations include button, icon button, FAB, split button, and button group.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SECTION: Showcase Cards
  // ===========================================================================
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <!-- Card 1 – Button Group (violet) -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Button Group</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">grouptriggeraction--ml-button-group</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">A set of related actions displayed together.</p>
              <grouptriggeraction--ml-button-group
                name="card-button-group"
                .value=${this.cardButtonGroup}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardButtonGroup = e.detail.value; }}
              >
                <Label>Group Actions</Label>
                <Icon>⚙️</Icon>
              </grouptriggeraction--ml-button-group>
            </div>
          </div>

          <!-- Card 2 – Standard Button (emerald) -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Standard Button</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">grouptriggeraction--ml-button-standard</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Primary call‑to‑action button.</p>
              <grouptriggeraction--ml-button-standard
                name="card-button-standard"
                .value=${this.cardButtonStandard}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardButtonStandard = e.detail.value; }}
              >
                <Label>Save</Label>
                <Icon>💾</Icon>
              </grouptriggeraction--ml-button-standard>
            </div>
          </div>

          <!-- Card 3 – Icon Button (amber) -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Icon Button</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">grouptriggeraction--ml-icon-button</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Button that displays only an icon.</p>
              <grouptriggeraction--ml-icon-button
                name="card-icon-button"
                .value=${this.cardIconButton}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardIconButton = e.detail.value; }}
              >
                <Icon>🔔</Icon>
              </grouptriggeraction--ml-icon-button>
            </div>
          </div>

          <!-- Card 4 – Split Button (rose) -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Split Button</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">grouptriggeraction--ml-split-button</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Primary action with a dropdown of secondary actions.</p>
              <grouptriggeraction--ml-split-button
                name="card-split-button"
                .value=${this.cardSplitButton}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardSplitButton = e.detail.value; }}
              >
                <Label>More</Label>
                <Icon>▾</Icon>
              </grouptriggeraction--ml-split-button>
            </div>
          </div>

          <!-- Card 5 – Kebab Action Trigger (sky) -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-sky-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Kebab Action Trigger</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">grouptriggeraction--ml-kebab-action-trigger</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Three‑dot menu for overflow actions.</p>
              <grouptriggeraction--ml-kebab-action-trigger
                name="card-kebab-action-trigger"
                .value=${this.cardKebabActionTrigger}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardKebabActionTrigger = e.detail.value; }}
              >
                <Icon>⋮</Icon>
              </grouptriggeraction--ml-kebab-action-trigger>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // SECTION: Reference Table
  // ===========================================================================
  private renderReferenceTable(): TemplateResult {
    const headers = [
      { label: 'Button Group', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Standard Button', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Icon Button', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Split Button', cls: 'text-rose-600 dark:text-rose-400' },
      { label: 'Kebab Action Trigger', cls: 'text-sky-600 dark:text-sky-400' },
    ];

    const rows: Array<{
      scenario: string;
      buttonGroup: boolean;
      buttonStandard: boolean;
      iconButton: boolean;
      splitButton: boolean;
      kebabActionTrigger: boolean;
    }> = [
      { scenario: 'Primary call‑to‑action', buttonGroup: true, buttonStandard: true, iconButton: false, splitButton: true, kebabActionTrigger: false },
      { scenario: 'Secondary/alternative action', buttonGroup: true, buttonStandard: true, iconButton: false, splitButton: true, kebabActionTrigger: true },
      { scenario: 'Danger / destructive', buttonGroup: true, buttonStandard: true, iconButton: true, splitButton: true, kebabActionTrigger: false },
      { scenario: 'Icon‑only button', buttonGroup: false, buttonStandard: false, iconButton: true, splitButton: false, kebabActionTrigger: true },
      { scenario: 'Loading state', buttonGroup: true, buttonStandard: true, iconButton: true, splitButton: true, kebabActionTrigger: false },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">Pick the right trigger component based on visual style and interaction pattern.</p>
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <th class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-3/4">Scenario</th>
                  ${headers.map(h => html`
                    <th class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}">${h.label}</th>
                  `)}
                </tr>
              </thead>
              <tbody>
                ${rows.map((row, i) => html`
                  <tr class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0">
                    <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                    ${[row.buttonGroup, row.buttonStandard, row.iconButton, row.splitButton, row.kebabActionTrigger].map(ok => html`
                      <td class="px-4 py-3.5 text-center">
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
      </section>
    `;
  }

  // ===========================================================================
  // MAIN RENDER
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
