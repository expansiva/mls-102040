/// <mls fileReference="_102040_/l2/molecules/groupsearchcontent/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupsearchcontent/ml-search-bar';
import '/_102040_/l2/molecules/groupsearchcontent/ml-search-history';
import '/_102040_/l2/molecules/groupsearchcontent/ml-faceted-search';
import '/_102040_/l2/molecules/groupsearchcontent/ml-search-filters';
import { molecules, scenarios } from '/_102040_/l2/molecules/groupsearchcontent/index.defs.js';
import { renderCatalogReferenceTable } from '/_102020_/l2/aura/molecules/shared/indexReferenceTable.js';

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
    return renderCatalogReferenceTable(molecules, scenarios);
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
