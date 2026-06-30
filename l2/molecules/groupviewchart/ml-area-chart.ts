/// <mls fileReference="_102040_/l2/molecules/groupviewchart/ml-area-chart.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// AREA CHART MOLECULE
// =============================================================================
// Skill Group: groupViewChart
// This molecule does NOT contain business logic.

import { html, svg, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { cn } from '/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
  noData: 'No data available',
  loading: 'Loading chart...',
  chartLabel: 'Area chart',
  dataTable: 'Data table',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    noData: 'Nenhum dado disponível',
    loading: 'Carregando gráfico...',
    chartLabel: 'Gráfico de área',
    dataTable: 'Tabela de dados',
  },
};
/// **collab_i18n_end**

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface DataSeries {
  name: string;
  color: string;
  points: DataPoint[];
}

interface TooltipData {
  label: string;
  value: number;
  series?: string;
  x: number;
  y: number;
}

@customElement('groupviewchart--ml-area-chart')
export class MlAreaChartMolecule extends MoleculeAuraElement {
  private msg: MessageType = messages.en;

  // ===========================================================================
  // SLOT TAGS
  // ===========================================================================
  slotTags = ['Label', 'Series', 'Point', 'Empty'];

  // ===========================================================================
  // PROPERTIES — From Contract
  // ===========================================================================
  @propertyDataSource({ type: Boolean, attribute: 'show-legend' })
  showLegend: boolean = true;

  @propertyDataSource({ type: Boolean, attribute: 'show-values' })
  showValues: boolean = false;

  @propertyDataSource({ type: Boolean })
  loading: boolean = false;

  // ===========================================================================
  // INTERNAL STATE
  // ===========================================================================
  @state()
  private tooltip: TooltipData | null = null;

  @state()
  private parsedSeries: DataSeries[] = [];

  @state()
  private chartTitle: string = '';

  // ===========================================================================
  // CHART DIMENSIONS
  // ===========================================================================
  private readonly chartWidth = 600;
  private readonly chartHeight = 300;
  private readonly padding = { top: 40, right: 30, bottom: 50, left: 60 };

  // ===========================================================================
  // DEFAULT COLORS
  // ===========================================================================
  private readonly defaultColors = [
    '#0ea5e9', // sky-500
    '#8b5cf6', // violet-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
    '#84cc16', // lime-500
  ];

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  firstUpdated() {
    this.parseData();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('loading')) {
      this.parseData();
    }
  }

  // ===========================================================================
  // DATA PARSING
  // ===========================================================================
  private parseData() {
    this.chartTitle = this.getSlotContent('Label') || '';
    const seriesElements = this.getSlots('Series');
    const standalonePoints = this.getSlots('Point').filter(
      (p) => !p.closest('Series')
    );

    const series: DataSeries[] = [];

    if (seriesElements.length > 0) {
      seriesElements.forEach((seriesEl, index) => {
        const name = seriesEl.getAttribute('name') || `Series ${index + 1}`;
        const color =
          seriesEl.getAttribute('color') ||
          this.defaultColors[index % this.defaultColors.length];
        const pointElements = Array.from(seriesEl.querySelectorAll('Point'));
        const points: DataPoint[] = pointElements.map((pointEl) => ({
          label: pointEl.getAttribute('label') || '',
          value: parseFloat(pointEl.getAttribute('value') || '0'),
        }));
        series.push({ name, color, points });
      });
    } else if (standalonePoints.length > 0) {
      const points: DataPoint[] = standalonePoints.map((pointEl, index) => ({
        label: pointEl.getAttribute('label') || '',
        value: parseFloat(pointEl.getAttribute('value') || '0'),
        color:
          pointEl.getAttribute('color') ||
          this.defaultColors[index % this.defaultColors.length],
      }));
      series.push({
        name: 'Data',
        color: this.defaultColors[0],
        points,
      });
    }

    this.parsedSeries = series;
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handlePointClick(label: string, value: number, series?: string) {
    this.dispatchEvent(
      new CustomEvent('pointClick', {
        bubbles: true,
        composed: true,
        detail: { label, value, series },
      })
    );
  }

  private handlePointMouseEnter(
    label: string,
    value: number,
    x: number,
    y: number,
    series?: string
  ) {
    this.tooltip = { label, value, series, x, y };
  }

  private handlePointMouseLeave() {
    this.tooltip = null;
  }

  // ===========================================================================
  // CALCULATIONS
  // ===========================================================================
  private getStackedData(): { series: DataSeries; stackedPoints: { label: string; y0: number; y1: number; value: number }[] }[] {
    if (this.parsedSeries.length === 0) return [];

    const labels = this.parsedSeries[0]?.points.map((p) => p.label) || [];
    const stackedData: { series: DataSeries; stackedPoints: { label: string; y0: number; y1: number; value: number }[] }[] = [];

    const cumulative: Record<string, number> = {};
    labels.forEach((label) => {
      cumulative[label] = 0;
    });

    this.parsedSeries.forEach((series) => {
      const stackedPoints = series.points.map((point) => {
        const y0 = cumulative[point.label] || 0;
        const y1 = y0 + point.value;
        cumulative[point.label] = y1;
        return { label: point.label, y0, y1, value: point.value };
      });
      stackedData.push({ series, stackedPoints });
    });

    return stackedData;
  }

  private getMaxValue(): number {
    const stackedData = this.getStackedData();
    if (stackedData.length === 0) return 100;

    let max = 0;
    stackedData.forEach(({ stackedPoints }) => {
      stackedPoints.forEach((p) => {
        if (p.y1 > max) max = p.y1;
      });
    });

    return max || 100;
  }

  private getLabels(): string[] {
    if (this.parsedSeries.length === 0) return [];
    return this.parsedSeries[0]?.points.map((p) => p.label) || [];
  }

  private scaleX(index: number, total: number): number {
    const plotWidth = this.chartWidth - this.padding.left - this.padding.right;
    if (total <= 1) return this.padding.left + plotWidth / 2;
    return this.padding.left + (index / (total - 1)) * plotWidth;
  }

  private scaleY(value: number, maxValue: number): number {
    const plotHeight = this.chartHeight - this.padding.top - this.padding.bottom;
    return this.padding.top + plotHeight - (value / maxValue) * plotHeight;
  }

  // ===========================================================================
  // RENDER METHODS
  // ===========================================================================
  private renderLoading(): TemplateResult {
    const containerClasses = cn(
      'w-full rounded-lg border p-4',
      'ml-chart-container',
    );

    const skeletonClasses = cn(
      'animate-pulse rounded',
      'ml-skeleton',
    );

    return html`
      <div class=${containerClasses}>
        <div class="${skeletonClasses} h-6 w-32 mb-4"></div>
        <div class="${skeletonClasses} h-64 w-full"></div>
        <div class="flex gap-4 mt-4">
          <div class="${skeletonClasses} h-4 w-16"></div>
          <div class="${skeletonClasses} h-4 w-16"></div>
          <div class="${skeletonClasses} h-4 w-16"></div>
        </div>
      </div>
    `;
  }

  private renderEmpty(): TemplateResult {
    const containerClasses = cn(
      'w-full rounded-lg border p-8 text-center',
      'ml-chart-container',
    );

    const textClasses = 'ml-text-muted';

    const emptyContent = this.getSlotContent('Empty');

    return html`
      <div class=${containerClasses}>
        <svg
          class="mx-auto h-12 w-12 ml-text-muted mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <p class=${textClasses}>
          ${emptyContent ? unsafeHTML(emptyContent) : this.msg.noData}
        </p>
      </div>
    `;
  }

  private renderGrid(maxValue: number, labels: string[]): TemplateResult {
    const gridLines: TemplateResult[] = [];
    const plotHeight = this.chartHeight - this.padding.top - this.padding.bottom;
    const plotWidth = this.chartWidth - this.padding.left - this.padding.right;
    const gridCount = 5;

    for (let i = 0; i <= gridCount; i++) {
      const y = this.padding.top + (i / gridCount) * plotHeight;
      const value = Math.round(maxValue * (1 - i / gridCount));

      gridLines.push(svg`
        <line
          x1=${this.padding.left}
          y1=${y}
          x2=${this.padding.left + plotWidth}
          y2=${y}
          stroke="currentColor"
          stroke-opacity="0.1"
          stroke-dasharray="4,4"
        />
        <text
          x=${this.padding.left - 10}
          y=${y + 4}
          text-anchor="end"
          class="text-xs ml-chart-axis"
        >${value}</text>
      `);
    }

    labels.forEach((label, index) => {
      const x = this.scaleX(index, labels.length);
      gridLines.push(svg`
        <text
          x=${x}
          y=${this.chartHeight - this.padding.bottom + 20}
          text-anchor="middle"
          class="text-xs ml-chart-axis"
        >${label}</text>
      `);
    });

    return svg`${gridLines}`;
  }

  private renderAreas(maxValue: number): TemplateResult {
    const stackedData = this.getStackedData();
    const labels = this.getLabels();
    const areas: TemplateResult[] = [];

    stackedData.forEach(({ series, stackedPoints }) => {
      if (stackedPoints.length === 0) return;

      let pathD = '';
      const total = stackedPoints.length;

      pathD += `M ${this.scaleX(0, total)} ${this.scaleY(stackedPoints[0].y1, maxValue)}`;
      for (let i = 1; i < total; i++) {
        pathD += ` L ${this.scaleX(i, total)} ${this.scaleY(stackedPoints[i].y1, maxValue)}`;
      }

      for (let i = total - 1; i >= 0; i--) {
        pathD += ` L ${this.scaleX(i, total)} ${this.scaleY(stackedPoints[i].y0, maxValue)}`;
      }
      pathD += ' Z';

      areas.push(svg`
        <path
          d=${pathD}
          fill=${series.color}
          fill-opacity="0.3"
          stroke=${series.color}
          stroke-width="2"
        />
      `);

      stackedPoints.forEach((point, index) => {
        const x = this.scaleX(index, total);
        const y = this.scaleY(point.y1, maxValue);
        const seriesName = this.parsedSeries.length > 1 ? series.name : undefined;

        areas.push(svg`
          <circle
            cx=${x}
            cy=${y}
            r="5"
            fill=${series.color}
            stroke="white"
            stroke-width="2"
            class="cursor-pointer transition-all hover:r-7"
            role="button"
            aria-label="${point.label}: ${point.value}${seriesName ? `, ${seriesName}` : ''}"
            tabindex="0"
            @click=${() => this.handlePointClick(point.label, point.value, seriesName)}
            @mouseenter=${() => this.handlePointMouseEnter(point.label, point.value, x, y, seriesName)}
            @mouseleave=${() => this.handlePointMouseLeave()}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handlePointClick(point.label, point.value, seriesName);
              }
            }}
          />
        `);

        if (this.showValues) {
          areas.push(svg`
            <text
              x=${x}
              y=${y - 10}
              text-anchor="middle"
              class="text-xs ml-chart-axis font-medium"
            >${point.value}</text>
          `);
        }
      });
    });

    return svg`${areas}`;
  }

  private renderTooltip(): TemplateResult {
    if (!this.tooltip) return html``;

    const tooltipClasses = cn(
      'absolute pointer-events-none z-10 px-3 py-2 rounded-lg shadow-lg text-sm',
      'ml-chart-tooltip',
      'border',
    );

    const style = `left: ${this.tooltip.x}px; top: ${this.tooltip.y - 50}px; transform: translateX(-50%);`;

    return html`
      <div class=${tooltipClasses} style=${style}>
        <div class="font-medium">${this.tooltip.label}</div>
        <div class="ml-chart-tooltip-detail">
          ${this.tooltip.series ? html`<span>${this.tooltip.series}: </span>` : ''}
          ${this.tooltip.value}
        </div>
      </div>
    `;
  }

  private renderLegend(): TemplateResult {
    if (!this.showLegend || this.parsedSeries.length <= 1) return html``;

    const legendClasses = [
      'flex flex-wrap gap-4 mt-4 justify-center',
    ].join(' ');

    const itemClasses = cn(
      'flex items-center gap-2 text-sm',
      'ml-chart-legend',
    );

    return html`
      <div class=${legendClasses}>
        ${this.parsedSeries.map(
          (series) => html`
            <div class=${itemClasses}>
              <span
                class="w-3 h-3 rounded-full"
                style="background-color: ${series.color}"
              ></span>
              <span>${series.name}</span>
            </div>
          `
        )}
      </div>
    `;
  }

  private renderAccessibleTable(): TemplateResult {
    const labels = this.getLabels();
    if (labels.length === 0) return html``;

    return html`
      <table class="sr-only" aria-label=${this.msg.dataTable}>
        <thead>
          <tr>
            <th scope="col">Label</th>
            ${this.parsedSeries.map(
              (series) => html`<th scope="col">${series.name}</th>`
            )}
          </tr>
        </thead>
        <tbody>
          ${labels.map(
            (label, index) => html`
              <tr>
                <th scope="row">${label}</th>
                ${this.parsedSeries.map(
                  (series) => html`<td>${series.points[index]?.value ?? 0}</td>`
                )}
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render() {
    const lang = this.getMessageKey(messages);
    this.msg = messages[lang];

    if (this.loading) {
      return this.renderLoading();
    }

    this.parseData();

    const hasData = this.parsedSeries.length > 0 && this.parsedSeries.some((s) => s.points.length > 0);

    if (!hasData) {
      return this.renderEmpty();
    }

    const maxValue = this.getMaxValue();
    const labels = this.getLabels();

    const containerClasses = cn(
      'w-full rounded-lg border p-4',
      'ml-chart-container',
      this.cssClass,
    );

    const titleClasses = cn(
      'text-lg font-semibold mb-4',
      'ml-label',
      this.getSlotClass('Label'),
    );

    const chartLabel = this.chartTitle || this.msg.chartLabel;

    return html`
      <div class=${containerClasses}>
        ${this.chartTitle
          ? html`<h3 class=${titleClasses}>${unsafeHTML(this.chartTitle)}</h3>`
          : ''}
        <div class="relative" role="img" aria-label=${chartLabel}>
          <svg
            viewBox="0 0 ${this.chartWidth} ${this.chartHeight}"
            class="w-full h-auto ml-text"
            preserveAspectRatio="xMidYMid meet"
          >
            ${this.renderGrid(maxValue, labels)}
            ${this.renderAreas(maxValue)}
          </svg>
          ${this.renderTooltip()}
        </div>
        ${this.renderLegend()}
        ${this.renderAccessibleTable()}
      </div>
    `;
  }
}
