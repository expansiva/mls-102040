/// <mls fileReference="_102040_/l2/molecules/groupsearchcontent/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupsearchcontent/ml-search-bar';
import '/_102040_/l2/molecules/groupsearchcontent/ml-search-history';
import '/_102040_/l2/molecules/groupsearchcontent/ml-faceted-search';
import '/_102040_/l2/molecules/groupsearchcontent/ml-search-filters';

@customElement('molecules--groupsearchcontent--index-102040')
export class GroupSearchContentIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardSearchBar = 'Quarterly budget';
  @state() private cardSearchHistory = '';
  @state() private cardFacetedSearch = 'Customer portal';
  @state() private cardSearchFilters = 'Sales dashboard';

  // ===========================================================================
  // HERO
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
          Allows the user to find content using text search. Emits search events with debounce; page provides suggestions via Suggestion slot tags. Value holds the confirmed result — either a suggestion value or the raw typed text. Supports clear, loading state, and empty state. Implementations include search field, command palette (cmd+k), search with suggestions, and combobox.
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Search bar</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-search-bar</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Primary text search with suggestions for catalog-style pages.</p>
              <groupsearchcontent--ml-search-bar
                name="card-1"
                value="${this.cardSearchBar}"
                placeholder="Search reports, docs, and dashboards"
                .debounce=${300}
                .loading=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardSearchBar = e.detail.value ?? '';
                }}
              >
                <Label>Workspace search</Label>
                <Helper>Type to discover recent reports or shared dashboards.</Helper>
                <Suggestion value="report-q2">Q2 Budget Review</Suggestion>
                <Suggestion value="report-forecast">Forecast Comparison</Suggestion>
                <Suggestion value="doc-ops">Operations Handbook</Suggestion>
                <Empty>No matching results. Try a different keyword.</Empty>
              </groupsearchcontent--ml-search-bar>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Search history</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-search-history</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Show recent queries and let users jump back quickly.</p>
              <groupsearchcontent--ml-search-history
                name="card-2"
                value="${this.cardSearchHistory}"
                placeholder="Search recently viewed items"
                .debounce=${250}
                .loading=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardSearchHistory = e.detail.value ?? '';
                }}
              >
                <Label>Recent searches</Label>
                <Helper>We’ll keep your last 5 searches here.</Helper>
                <Suggestion value="history-invoices">Invoices overdue</Suggestion>
                <Suggestion value="history-forecast">Forecast vs actuals</Suggestion>
                <Suggestion value="history-usage">API usage report</Suggestion>
                <Empty>No recent searches yet.</Empty>
              </groupsearchcontent--ml-search-history>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Faceted search</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-faceted-search</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Pair search with richer results and facets.</p>
              <groupsearchcontent--ml-faceted-search
                name="card-3"
                value="${this.cardFacetedSearch}"
                placeholder="Search products, topics, or teams"
                .debounce=${400}
                .loading=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardFacetedSearch = e.detail.value ?? '';
                }}
              >
                <Label>Marketplace search</Label>
                <Helper>Results update as you type with facet suggestions.</Helper>
                <Suggestion value="facet-portal">Customer Portal</Suggestion>
                <Suggestion value="facet-onboarding">Onboarding Toolkit</Suggestion>
                <Suggestion value="facet-analytics">Analytics Studio</Suggestion>
                <Empty>No matching facets found.</Empty>
              </groupsearchcontent--ml-faceted-search>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Search filters</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-search-filters</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Use when search drives filtering a dense list.</p>
              <groupsearchcontent--ml-search-filters
                name="card-4"
                value="${this.cardSearchFilters}"
                placeholder="Search teams, owners, or dashboards"
                .debounce=${300}
                .loading=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardSearchFilters = e.detail.value ?? '';
                }}
              >
                <Label>Filter dashboards</Label>
                <Helper>Search by owner or tag to narrow the list.</Helper>
                <Suggestion value="filter-sales">Sales dashboard</Suggestion>
                <Suggestion value="filter-growth">Growth metrics</Suggestion>
                <Suggestion value="filter-support">Support overview</Suggestion>
                <Empty>No dashboards match your filter.</Empty>
              </groupsearchcontent--ml-search-filters>
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
      mlSearchBar: boolean;
      mlSearchHistory: boolean;
      mlFacetedSearch: boolean;
      mlSearchFilters: boolean;
    }> = [
      {
        scenario: 'Default search entry point with live suggestions and clear states.',
        mlSearchBar: true,
        mlSearchHistory: false,
        mlFacetedSearch: false,
        mlSearchFilters: false,
      },
      {
        scenario: 'Highlight recent queries so users can re-run a search quickly.',
        mlSearchBar: false,
        mlSearchHistory: true,
        mlFacetedSearch: false,
        mlSearchFilters: false,
      },
      {
        scenario: 'Provide a rich search experience with facet-driven discovery.',
        mlSearchBar: false,
        mlSearchHistory: false,
        mlFacetedSearch: true,
        mlSearchFilters: false,
      },
      {
        scenario: 'Search directly within a filtered list or table of content.',
        mlSearchBar: false,
        mlSearchHistory: false,
        mlFacetedSearch: false,
        mlSearchFilters: true,
      },
    ];
    const headers = [
      { label: 'Search bar', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Search history', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Faceted search', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Search filters', cls: 'text-rose-600 dark:text-rose-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Allows the user to find content using text search. Emits search events with debounce; page provides suggestions via Suggestion slot tags. Value holds the confirmed result — either a suggestion value or the raw typed text. Supports clear, loading state, and empty state. Implementations include search field, command palette (cmd+k), search with suggestions, and combobox.
          </p>
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <th class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-3/4">Scenario</th>
                  ${headers.map(
                    (h) => html`
                      <th class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}">${h.label}</th>
                    `,
                  )}
                </tr>
              </thead>
              <tbody>
                ${rows.map(
                  (row, i) => html`
                    <tr class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0">
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                      ${([
                        row.mlSearchBar,
                        row.mlSearchHistory,
                        row.mlFacetedSearch,
                        row.mlSearchFilters,
                      ] as boolean[]).map(
                        (ok) => html`
                          <td class="px-4 py-3.5 text-center">
                            ${ok
                              ? html`<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>`
                              : html`<span class="text-slate-200 dark:text-slate-700 text-sm">—</span>`}
                          </td>
                        `,
                      )}
                    </tr>
                  `,
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
