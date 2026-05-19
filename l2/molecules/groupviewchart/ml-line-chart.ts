/// <mls fileReference="_102040_/l2/molecules/groupviewchart/ml-line-chart.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// LINE CHART MOLECULE
// =============================================================================
// Skill Group: groupViewChart
// This molecule does NOT contain business logic.

import { html, svg, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

/// **collab_i18n_start**
const message_en = {
  noData: 'No data available',
  loading: 'Loading chart...',
  chartLabel: 'Line chart',
  dataPoint: 'Data point',
};

type MessageType = typeof message_en;

const messages: Record<string, MessageType> = {
  en: message_en,
  pt: {
    noData: 'Nenhum dado disponível',
    loading: 'Carregando gráfico...',
    chartLabel: 'Gráfico de linhas',
    dataPoint: 'Ponto de dados',
  },
};
/// **collab_i18n_end**

interface ParsedPoint {
  label: string;
  value: number;
  color?: string;
}

interface ParsedSeries {
  name: string;
  color: string;
  points: ParsedPoint[];
}

interface TooltipData {
  label: string;
  value: number;
  series?: string;
  x: number;
  y: number;
}

const DEFAULT_COLORS = [
  '#0ea5e9', // sky-500
  '#8b5cf6', // violet-500
  '#f59e0b', // amber-500
  '#10b981', // emerald-500
  '#ef4444', // red-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
];

@customElement('groupviewchart--ml-line-chart')
export class MlLineChartMolecule extends MoleculeAuraElement {
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

  // ===========================================================================
  // CHART DIMENSIONS
  // ===========================================================================
  private readonly chartWidth = 600;
  private readonly chartHeight = 300;
  private readonly padding = { top: 20, right: 30, bottom: 50, left: 60 };

  // ===========================================================================
  // DATA PARSING
  // ===========================================================================
  private parseData(): { series: ParsedSeries[]; allLabels: string[] } {
    const seriesElements = this.getSlots('Series');
    const standalonePoints = this.getSlots('Point').filter(
      (p) => !p.closest('Series')
    );

    const series: ParsedSeries[] = [];
    const allLabelsSet = new Set<string>();

    // Parse series with nested points
    seriesElements.forEach((seriesEl, index) => {
      const name = seriesEl.getAttribute('name') || `Series ${index + 1}`;
      const color = seriesEl.getAttribute('color') || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
      const pointElements = Array.from(seriesEl.querySelectorAll('Point'));

      const points: ParsedPoint[] = [];
      pointElements.forEach((pointEl) => {
        const label = pointEl.getAttribute('label') || '';
        const valueStr = pointEl.getAttribute('value');
        const value = valueStr ? parseFloat(valueStr) : 0;

        if (label) {
          points.push({ label, value });
          allLabelsSet.add(label);
        }
      });

      if (points.length > 0) {
        series.push({ name, color, points });
      }
    });

    // Parse standalone points as a single series
    if (standalonePoints.length > 0) {
      const points: ParsedPoint[] = [];
      standalonePoints.forEach((pointEl) => {
        const label = pointEl.getAttribute('label') || '';
        const valueStr = pointEl.getAttribute('value');
        const value = valueStr ? parseFloat(valueStr) : 0;
        const color = pointEl.getAttribute('color') || undefined;

        if (label) {
          points.push({ label, value, color });
          allLabelsSet.add(label);
        }
      });

      if (points.length > 0) {
        series.push({
          name: 'Data',
          color: DEFAULT_COLORS[0],
          points,
        });
      }
    }

    // Preserve order of labels as they appear
    const allLabels: string[] = [];
    series.forEach((s) => {
      s.points.forEach((p) => {
        if (!allLabels.includes(p.label)) {
          allLabels.push(p.label);
        }
      });
    });

    return { series, allLabels };
  }

  private calculateScale(series: ParsedSeries[]): { min: number; max: number; ticks: number[] } {
    let min = Infinity;
    let max = -Infinity;

    series.forEach((s) => {
      s.points.forEach((p) => {
        if (p.value < min) min = p.value;
        if (p.value > max) max = p.value;
      });
    });

    if (min === Infinity) {
      min = 0;
      max = 100;
    }

    // Add padding to scale
    const range = max - min || 1;
    const paddingAmount = range * 0.1;
    min = Math.floor(min - paddingAmount);
    max = Math.ceil(max + paddingAmount);

    // Generate ticks
    const tickCount = 5;
    const step = (max - min) / (tickCount - 1);
    const ticks: number[] = [];
    for (let i = 0; i < tickCount; i++) {
      ticks.push(Math.round(min + step * i));
    }

    return { min, max, ticks };
  }

  // ===========================================================================
  // COORDINATE HELPERS
  // ===========================================================================
  private getX(index: number, totalLabels: number): number {
    const plotWidth = this.chartWidth - this.padding.left - this.padding.right;
    if (totalLabels <= 1) return this.padding.left + plotWidth / 2;
    return this.padding.left + (index / (totalLabels - 1)) * plotWidth;
  }

  private getY(value: number, min: number, max: number): number {
    const plotHeight = this.chartHeight - this.padding.top - this.padding.bottom;
    const range = max - min || 1;
    return this.padding.top + plotHeight - ((value - min) / range) * plotHeight;
  }

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================
  private handlePointMouseEnter(e: MouseEvent, point: ParsedPoint, seriesName: string) {
    const target = e.target as SVGElement;
    const rect = target.getBoundingClientRect();
    const containerRect = this.getBoundingClientRect();

    this.tooltip = {
      label: point.label,
      value: point.value,
      series: seriesName,
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 10,
    };
  }

  private handlePointMouseLeave() {
    this.tooltip = null;
  }

  private handlePointClick(point: ParsedPoint, seriesName: string) {
    this.dispatchEvent(
      new CustomEvent('pointClick', {
        bubbles: true,
        composed: true,
        detail: {
          label: point.label,
          value: point.value,
          series: seriesName,
        },
      })
    );
  }

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================
  private renderLoading(): TemplateResult {
    const classes = [
      'flex items-center justify-center',
      'w-full h-64',
      'bg-slate-50 dark:bg-slate-900',
      'rounded-lg',
      'animate-pulse',
    ].join(' ');

    return html`
      <div class=${classes}>
        <div class="flex flex-col items-center gap-2">
          <div class="w-8 h-8 border-2 border-sky-500 dark:border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-sm text-slate-500 dark:text-slate-400">${this.msg.loading}</span>
        </div>
      </div>
    `;
  }

  private renderEmpty(): TemplateResult {
    const content = this.hasSlot('Empty')
      ? this.getSlotContent('Empty')
      : this.msg.noData;

    const classes = [
      'flex items-center justify-center',
      'w-full h-64',
      'bg-slate-50 dark:bg-slate-900',
      'rounded-lg',
      'text-slate-500 dark:text-slate-400',
      'text-sm',
    ].join(' ');

    return html`
      <div class=${classes}>
        ${unsafeHTML(content)}
      </div>
    `;
  }

  private renderGridLines(ticks: number[], min: number, max: number): TemplateResult {
    return html`
      ${ticks.map((tick) => {
        const y = this.getY(tick, min, max);
        return svg`
          <line
            x1=${this.padding.left}
            y1=${y}
            x2=${this.chartWidth - this.padding.right}
            y2=${y}
            class="stroke-slate-200 dark:stroke-slate-700"
            stroke-width="1"
            stroke-dasharray="4,4"
          />
        `;
      })}
    `;
  }

  private renderYAxis(ticks: number[], min: number, max: number): TemplateResult {
    return html`
      ${ticks.map((tick) => {
        const y = this.getY(tick, min, max);
        return svg`
          <text
            x=${this.padding.left - 10}
            y=${y}
            text-anchor="end"
            dominant-baseline="middle"
            class="fill-slate-600 dark:fill-slate-400 text-xs"
          >${tick}</text>
        `;
      })}
    `;
  }

  private renderXAxis(labels: string[]): TemplateResult {
    return html`
      ${labels.map((label, index) => {
        const x = this.getX(index, labels.length);
        const y = this.chartHeight - this.padding.bottom + 20;
        return svg`
          <text
            x=${x}
            y=${y}
            text-anchor="middle"
            class="fill-slate-600 dark:fill-slate-400 text-xs"
          >${label}</text>
        `;
      })}
    `;
  }

  private renderLine(series: ParsedSeries, allLabels: string[], min: number, max: number): TemplateResult {
    const pathData = series.points
      .map((point, index) => {
        const labelIndex = allLabels.indexOf(point.label);
        const x = this.getX(labelIndex, allLabels.length);
        const y = this.getY(point.value, min, max);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');

    return svg`
      <path
        d=${pathData}
        fill="none"
        stroke=${series.color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    `;
  }

  private renderPoints(series: ParsedSeries, allLabels: string[], min: number, max: number): TemplateResult {
    return html`
      ${series.points.map((point) => {
        const labelIndex = allLabels.indexOf(point.label);
        const x = this.getX(labelIndex, allLabels.length);
        const y = this.getY(point.value, min, max);
        const pointColor = point.color || series.color;

        return svg`
          <circle
            cx=${x}
            cy=${y}
            r="6"
            fill=${pointColor}
            class="cursor-pointer transition-all hover:r-8"
            stroke="white"
            stroke-width="2"
            role="button"
            aria-label="${this.msg.dataPoint}: ${point.label}, ${point.value}"
            tabindex="0"
            @mouseenter=${(e: MouseEvent) => this.handlePointMouseEnter(e, point, series.name)}
            @mouseleave=${() => this.handlePointMouseLeave()}
            @click=${() => this.handlePointClick(point, series.name)}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                this.handlePointClick(point, series.name);
              }
            }}
          />
          ${this.showValues
            ? svg`
              <text
                x=${x}
                y=${y - 12}
                text-anchor="middle"
                class="fill-slate-700 dark:fill-slate-300 text-xs font-medium pointer-events-none"
              >${point.value}</text>
            `
            : ''}
        `;
      })}
    `;
  }

  private renderTooltip(): TemplateResult {
    if (!this.tooltip) return html``;

    const classes = [
      'absolute z-10 px-3 py-2 rounded-lg shadow-lg',
      'bg-slate-800 dark:bg-slate-700',
      'text-white text-xs',
      'pointer-events-none',
      'transform -translate-x-1/2 -translate-y-full',
    ].join(' ');

    return html`
      <div
        class=${classes}
        style="left: ${this.tooltip.x}px; top: ${this.tooltip.y}px;"
      >
        <div class="font-medium">${this.tooltip.label}</div>
        <div class="text-slate-300 dark:text-slate-400">
          ${this.tooltip.series ? `${this.tooltip.series}: ` : ''}${this.tooltip.value}
        </div>
      </div>
    `;
  }

  private renderLegend(series: ParsedSeries[]): TemplateResult {
    if (!this.showLegend || series.length === 0) return html``;

    const classes = [
      'flex flex-wrap justify-center gap-4 mt-4',
    ].join(' ');

    return html`
      <div class=${classes}>
        ${series.map((s) => {
          const itemClasses = [
            'flex items-center gap-2 text-sm',
            'text-slate-700 dark:text-slate-300',
          ].join(' ');

          return html`
            <div class=${itemClasses}>
              <span
                class="w-3 h-3 rounded-full"
                style="background-color: ${s.color};"
              ></span>
              <span>${s.name}</span>
            </div>
          `;
        })}
      </div>
    `;
  }

  private renderAccessibleTable(series: ParsedSeries[], allLabels: string[]): TemplateResult {
    return html`
      <table class="sr-only">
        <caption>${this.hasSlot('Label') ? this.getSlotContent('Label') : this.msg.chartLabel}</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            ${series.map((s) => html`<th scope="col">${s.name}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${allLabels.map((label) => html`
            <tr>
              <th scope="row">${label}</th>
              ${series.map((s) => {
                const point = s.points.find((p) => p.label === label);
                return html`<td>${point ? point.value : '-'}</td>`;
              })}
            </tr>
          `)}
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

    const { series, allLabels } = this.parseData();

    if (series.length === 0 || allLabels.length === 0) {
      return this.renderEmpty();
    }

    const { min, max, ticks } = this.calculateScale(series);
    const labelContent = this.hasSlot('Label') ? this.getSlotContent('Label') : '';

    const containerClasses = [
      'relative w-full',
      'bg-white dark:bg-slate-800',
      'rounded-lg p-4',
      'border border-slate-200 dark:border-slate-700',
    ].join(' ');

    const titleClasses = [
      'text-lg font-semibold text-center mb-4',
      'text-slate-900 dark:text-slate-100',
    ].join(' ');

    return html`
      <div class=${containerClasses}>
        ${labelContent
          ? html`<div class=${titleClasses}>${unsafeHTML(labelContent)}</div>`
          : ''}

        <div class="relative">
          <svg
            viewBox="0 0 ${this.chartWidth} ${this.chartHeight}"
            class="w-full h-auto"
            role="img"
            aria-label=${labelContent || this.msg.chartLabel}
          >
            ${this.renderGridLines(ticks, min, max)}
            ${this.renderYAxis(ticks, min, max)}
            ${this.renderXAxis(allLabels)}
            ${series.map((s) => this.renderLine(s, allLabels, min, max))}
            ${series.map((s) => this.renderPoints(s, allLabels, min, max))}
          </svg>

          ${this.renderTooltip()}
        </div>

        ${this.renderLegend(series)}
        ${this.renderAccessibleTable(series, allLabels)}
      </div>
    `;
  }
}
