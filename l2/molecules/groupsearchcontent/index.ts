/// <mls fileReference="_102040_/l2/molecules/groupsearchcontent/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupsearchcontent/ml-search-bar';
import '/_102040_/l2/molecules/groupsearchcontent/ml-search-history';

@customElement('molecules--groupsearchcontent--index-102040')
export class GroupSearchContentIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardSearchBarValue: string | null = 'report-2024';
  @state() private cardSearchHistoryValue: string | null = null;

  // ===========================================================================
  // HERO
  // ===========================================================================
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupSearchContent
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Search Content
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to find content using text search with debounced search events and suggestion slots.
          The value stores the confirmed suggestion or raw text, with clear, loading, and empty states across search
          field and command-style experiences.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SHOWCASE CARDS
  // ===========================================================================
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Search bar with suggestions</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupsearchcontent--ml-search-bar</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Use for primary content discovery with live suggestions and loading feedback.</p>
              <groupsearchcontent--ml-search-bar
                name="card-search-bar"
                placeholder="Search reports, dashboards, or docs..."
                .value=${this.cardSearchBarValue}
                .debounce=${300}
                .loading=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardSearchBarValue = e.detail.value;
                }}
              >
                <Label>Find content</Label>
                <Helper>Type to search. Results update after a short pause.</Helper>
                <Suggestion value="report-2024">2024 Revenue Report</Suggestion>
                <Suggestion value="dashboard-q2">Q2 Performance Dashboard</Suggestion>
                <Suggestion value="guide-onboarding">Onboarding Guide</Suggestion>
                <Empty>No matching content. Try a different keyword.</Empty>
              </groupsearchcontent--ml-search-bar>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Search history + recents</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupsearchcontent--ml-search-history</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Offer quick access to recent or saved queries before users type.</p>
              <groupsearchcontent--ml-search-history
                name="card-search-history"
                placeholder="Jump back to a recent search..."
                .value=${this.cardSearchHistoryValue}
                .debounce=${200}
                .loading=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardSearchHistoryValue = e.detail.value;
                }}
              >
                <Label>Recent searches</Label>
                <Helper>Select a past query or type a new one.</Helper>
                <Suggestion value="projects-q3">Projects tagged Q3</Suggestion>
                <Suggestion value="launch-plan">Launch plan checklist</Suggestion>
                <Suggestion value="design-system">Design system assets</Suggestion>
                <Empty>No recent searches saved yet.</Empty>
              </groupsearchcontent--ml-search-history>
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
    const rows: Array<{ scenario: string; mlSearchBar: boolean; mlSearchHistory: boolean }> = [
      { scenario: 'Live search with async suggestions and loading state from a catalog or API.', mlSearchBar: true, mlSearchHistory: false },
      { scenario: 'Fast re-entry into recent searches or saved queries without immediate network calls.', mlSearchBar: false, mlSearchHistory: true },
      { scenario: 'Primary global search entry point for dashboards or content libraries.', mlSearchBar: true, mlSearchHistory: false },
      { scenario: 'Shortcut entry for frequent users who revisit the same queries often.', mlSearchBar: false, mlSearchHistory: true },
    ];
    const headers = [
      { label: 'Search bar', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Search history', cls: 'text-emerald-600 dark:text-emerald-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Choose a search bar for live discovery with suggestions, or lean on search history when the goal is quick
            access to recently used queries.
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
                      ${([row.mlSearchBar, row.mlSearchHistory] as boolean[]).map(
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
  // ===========================================================================
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
