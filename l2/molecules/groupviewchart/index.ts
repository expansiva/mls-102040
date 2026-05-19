/// <mls fileReference="_102040_/l2/molecules/groupviewchart/index.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupviewchart/ml-area-chart';
import '/_102040_/l2/molecules/groupviewchart/ml-line-chart';

interface ChartConfig {
  showLegend: boolean;
  showValues: boolean;
  loading: boolean;
}

const defaultChartConfig = (): ChartConfig => ({
  showLegend: true,
  showValues: false,
  loading: false,
});

@customElement('molecules--groupviewchart--index-102040')
export class GroupViewChartIndex extends StateLitElement {

  @state() areaChart: ChartConfig = defaultChartConfig();
  @state() lineChart: ChartConfig = defaultChartConfig();

  // ===========================================================================
  // CONFIG PANEL HELPERS
  // ===========================================================================

  private renderToggle(label: string, active: boolean, onClick: () => void): TemplateResult {
    return html`
<button
  class="${active
    ? 'bg-sky-500 text-white border-sky-500'
    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:opacity-80'
  } border rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer w-full text-left"
  @click=${onClick}
>${label}</button>`;
  }

  private renderChartConfig(cfg: ChartConfig, update: (next: ChartConfig) => void): TemplateResult {
    return html`
<div class="flex flex-col gap-4">
  <div>
    <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Props</p>
    <div class="flex flex-col gap-2">
      ${this.renderToggle('show-legend', cfg.showLegend, () => update({ ...cfg, showLegend: !cfg.showLegend }))}
      ${this.renderToggle('show-values', cfg.showValues, () => update({ ...cfg, showValues: !cfg.showValues }))}
      ${this.renderToggle('loading',     cfg.loading,    () => update({ ...cfg, loading:    !cfg.loading    }))}
    </div>
  </div>
</div>`;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================

  render() {
    return html`
<div class="bg-white dark:bg-slate-900 min-h-screen font-sans">

  <!-- Group header -->
  <header class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-10">
    <div class="max-w-3xl">
      <span class="inline-block px-2.5 py-1 bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 rounded-md text-xs font-semibold uppercase tracking-wide mb-3">
        groupViewChart
      </span>
      <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-3">View Chart</h1>
      <p class="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
        Displays data through graphical representation. Data provided via Series and Point slot tags.
        All chart implementations share the same data contract — swap the component tag to change visualization.
        Supports multi-series (Line, Bar, Area, Radar, Scatter) and single-series (Pie, Donut, Funnel).
      </p>
    </div>
  </header>

  <!-- ml-area-chart -->
  <section class="bg-white dark:bg-slate-900 px-8 py-12 border-t border-slate-200 dark:border-slate-700">
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100">Area Chart</h2>
        <code class="text-xs bg-slate-200/70 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-1 rounded">groupviewchart--ml-area-chart</code>
      </div>
      <p class="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
        Present quantitative information as an area chart that highlights volume through filled regions
        below trend lines. Enables comparison across single or multiple data series, with a default
        stacked view that shows how individual parts compose a total.
      </p>
    </div>

    <div class="grid grid-cols-[200px_1fr] gap-6 items-start">

      <!-- Config -->
      <div class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        ${this.renderChartConfig(this.areaChart, (next) => { this.areaChart = next; })}
      </div>

      <!-- Component -->
      <div class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <groupviewchart--ml-area-chart
          .showLegend=${this.areaChart.showLegend}
          .showValues=${this.areaChart.showValues}
          .loading=${this.areaChart.loading}
        >
          <Label>Monthly Revenue by Product Line</Label>
          <Series name="SaaS" color="#0ea5e9">
            <Point label="Jan" value="42000" />
            <Point label="Feb" value="51000" />
            <Point label="Mar" value="58000" />
            <Point label="Apr" value="63000" />
            <Point label="May" value="71000" />
            <Point label="Jun" value="79000" />
          </Series>
          <Series name="Consulting" color="#8b5cf6">
            <Point label="Jan" value="28000" />
            <Point label="Feb" value="31000" />
            <Point label="Mar" value="27000" />
            <Point label="Apr" value="35000" />
            <Point label="May" value="38000" />
            <Point label="Jun" value="44000" />
          </Series>
          <Series name="Licensing" color="#10b981">
            <Point label="Jan" value="15000" />
            <Point label="Feb" value="17000" />
            <Point label="Mar" value="19000" />
            <Point label="Apr" value="21000" />
            <Point label="May" value="24000" />
            <Point label="Jun" value="28000" />
          </Series>
        </groupviewchart--ml-area-chart>
      </div>

    </div>
  </section>

  <!-- ml-line-chart -->
  <section class="bg-slate-100/70 dark:bg-slate-800/50 px-8 py-12 border-t border-slate-200 dark:border-slate-700">
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100">Line Chart</h2>
        <code class="text-xs bg-slate-200/70 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-1 rounded">groupviewchart--ml-line-chart</code>
      </div>
      <p class="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
        Display the evolution of numeric data over time using a multi-series line chart. Visualizes
        connections between ordered data points, allows comparison across series, and handles
        loading, empty, and dark-mode states.
      </p>
    </div>

    <div class="grid grid-cols-[200px_1fr] gap-6 items-start">

      <!-- Config -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        ${this.renderChartConfig(this.lineChart, (next) => { this.lineChart = next; })}
      </div>

      <!-- Component -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <groupviewchart--ml-line-chart
          .showLegend=${this.lineChart.showLegend}
          .showValues=${this.lineChart.showValues}
          .loading=${this.lineChart.loading}
        >
          <Label>Weekly Website Traffic by Channel</Label>
          <Series name="Organic" color="#10b981">
            <Point label="Week 1" value="12400" />
            <Point label="Week 2" value="13800" />
            <Point label="Week 3" value="15200" />
            <Point label="Week 4" value="14600" />
            <Point label="Week 5" value="16900" />
            <Point label="Week 6" value="18300" />
          </Series>
          <Series name="Paid" color="#f59e0b">
            <Point label="Week 1" value="8200" />
            <Point label="Week 2" value="9500" />
            <Point label="Week 3" value="8800" />
            <Point label="Week 4" value="11200" />
            <Point label="Week 5" value="10600" />
            <Point label="Week 6" value="12400" />
          </Series>
          <Series name="Direct" color="#0ea5e9">
            <Point label="Week 1" value="5100" />
            <Point label="Week 2" value="5400" />
            <Point label="Week 3" value="5800" />
            <Point label="Week 4" value="6200" />
            <Point label="Week 5" value="6700" />
            <Point label="Week 6" value="7300" />
          </Series>
        </groupviewchart--ml-line-chart>
      </div>

    </div>
  </section>

</div>`;
  }
}
