/// <mls fileReference="_102040_/l2/molecules/groupviewmetric/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupviewmetric/ml-metric-big-number';
import '/_102040_/l2/molecules/groupviewmetric/ml-metric-gauge';
import '/_102040_/l2/molecules/groupviewmetric/ml-metric-card';
import '/_102040_/l2/molecules/groupviewmetric/ml-compact-metric-sparkline';
import '/_102040_/l2/molecules/groupviewmetric/ml-metric-trend-compare';
import { molecules, scenarios } from '/_102040_/l2/molecules/groupviewmetric/index.defs.js';
import { renderCatalogReferenceTable } from '/_102020_/l2/aura/molecules/shared/indexReferenceTable.js';

@customElement('molecules--groupviewmetric--index-102040')
export class GroupViewMetricIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardBigNumberLoading = false;
  @state() private cardGaugeLoading = false;
  @state() private cardMetricCardLoading = false;
  @state() private cardSparklineLoading = false;
  @state() private cardTrendCompareLoading = true;

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
          groupViewMetric
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          View Metric
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Displays a highlighted indicator or metric. Purely visual — all data via slot tags (Label,
          Value, Icon, Trend with direction attribute, Helper). No value property, no events.
          Supports loading state. Implementations include big number, KPI card, sparkline,
          gauge/speedometer, and trend indicator.
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Big number</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupviewmetric--ml-metric-big-number</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Highlight a single standout KPI.</p>
              <groupviewmetric--ml-metric-big-number
                name="card-1"
                .loading=${this.cardBigNumberLoading}
                .isEditing=${true}
              >
                <Label>Monthly Revenue</Label>
                <Value>$127,450</Value>
                <Icon>💰</Icon>
                <Trend direction="up">↑ 12.5%</Trend>
                <Helper>vs last month</Helper>
              </groupviewmetric--ml-metric-big-number>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Gauge</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupviewmetric--ml-metric-gauge</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Use when a metric has a clear target range.</p>
              <groupviewmetric--ml-metric-gauge
                name="card-2"
                .loading=${this.cardGaugeLoading}
                .isEditing=${true}
              >
                <Label>Server Capacity</Label>
                <Value>68%</Value>
                <Icon>🧭</Icon>
                <Trend direction="neutral">On target</Trend>
                <Helper>Goal 75%</Helper>
              </groupviewmetric--ml-metric-gauge>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">KPI card</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupviewmetric--ml-metric-card</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Best for a compact KPI summary with context.</p>
              <groupviewmetric--ml-metric-card
                name="card-3"
                .loading=${this.cardMetricCardLoading}
                .isEditing=${true}
              >
                <Label>Active Subscribers</Label>
                <Value>24,980</Value>
                <Icon>👥</Icon>
                <Trend direction="down">↓ 2.1%</Trend>
                <Helper>Last 30 days</Helper>
              </groupviewmetric--ml-metric-card>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Compact sparkline</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupviewmetric--ml-compact-metric-sparkline</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Adds a small trend line to show motion.</p>
              <groupviewmetric--ml-compact-metric-sparkline
                name="card-4"
                .loading=${this.cardSparklineLoading}
                .isEditing=${true}
              >
                <Label>Daily Signups</Label>
                <Value>1,204</Value>
                <Icon>📈</Icon>
                <Trend direction="up">↑ 6.3%</Trend>
                <Helper>Rolling 7 days</Helper>
              </groupviewmetric--ml-compact-metric-sparkline>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-sky-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Trend compare</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupviewmetric--ml-metric-trend-compare</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Compare current performance to a baseline.</p>
              <groupviewmetric--ml-metric-trend-compare
                name="card-5"
                .loading=${this.cardTrendCompareLoading}
                .isEditing=${true}
              >
                <Label>Conversion Rate</Label>
                <Value>4.2%</Value>
                <Icon>⚡</Icon>
                <Trend direction="up">↑ +0.6% vs last week</Trend>
                <Helper>Organic + Paid traffic</Helper>
              </groupviewmetric--ml-metric-trend-compare>
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
