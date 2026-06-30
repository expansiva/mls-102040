/// <mls fileReference="_102040_/l2/molecules/groupviewchart/ml-scatter-plot.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// ML SCATTER PLOT MOLECULE
// =============================================================================
// Skill Group: groupViewChart
// This molecule does NOT contain business logic.
import { html, svg, TemplateResult } from'lit';
import { customElement, state, query } from'lit/decorators.js';
import { unsafeHTML } from'lit/directives/unsafe-html.js';
import { propertyDataSource } from'/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from'/_102033_/l2/moleculeBase.js';
import { cn } from'/_102033_/l2/cn.js';

/// **collab_i18n_start**
const message_en = {
labelFallback:'Scatter plot',
loading:'Loading chart...',
empty:'No data available',
seriesHeader:'Series',
xHeader:'X',
yHeader:'Y',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
pt: {
labelFallback:'Gráfico de dispersão',
loading:'Carregando gráfico...',
empty:'Nenhum dado disponível',
seriesHeader:'Série',
xHeader:'X',
yHeader:'Y',
},
};
/// **collab_i18n_end**

type ParsedPoint = {
label: string;
value: number;
x: number;
y: number;
series?: string;
color?: string;
isTrend?: boolean;
};

type SeriesMeta = {
name: string;
color: string;
isTrend: boolean;
};

type HoveredPoint = {
label: string;
value: number;
series?: string;
left: number;
top: number;
};

@customElement('groupviewchart--ml-scatter-plot')
export class MlScatterPlotMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
// ===========================================================================
// SLOT TAGS
// ===========================================================================
slotTags = ['Label','Series','Point','Empty'];
// ===========================================================================
// PROPERTIES — From Contract
// ===========================================================================
@propertyDataSource({ type: Boolean, attribute:'show-legend' })
showLegend = true;

@propertyDataSource({ type: Boolean, attribute:'show-values' })
showValues = false;

@propertyDataSource({ type: Boolean })
loading = false;
// ===========================================================================
// INTERNAL STATE
// ===========================================================================
@state()
private hoveredPoint: HoveredPoint | null = null;

@query('.chart-container')
private chartContainer?: HTMLDivElement;
// ===========================================================================
// RENDER
// ===========================================================================
render() {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];

const labelContent = this.getSlotContent('Label');
const labelText = this.getPlainText(labelContent) || this.msg.labelFallback;

if (this.loading) {
return html`
<div class="${cn('w-full', this.cssClass)}">
${labelContent
? html`<div class="${cn('mb-2 text-sm font-semibold ml-text', this.getSlotClass('Label'))}">${unsafeHTML(labelContent)}</div>`
: html``}
<div class="h-64 w-full animate-pulse rounded-lg border ml-border ml-surface-dim-bg"></div>
<div class="mt-2 text-xs ml-text-muted">${this.msg.loading}</div>
</div>
`;
}

const { points, seriesMeta } = this.parseData();
const hasData = points.length > 0;

if (!hasData) {
const emptyContent = this.hasSlot('Empty') ? this.getSlotContent('Empty') : this.msg.empty;
return html`
<div class="${cn('w-full', this.cssClass)}">
${labelContent
? html`<div class="${cn('mb-2 text-sm font-semibold ml-text', this.getSlotClass('Label'))}">${unsafeHTML(labelContent)}</div>`
: html``}
<div class="${cn('flex h-64 w-full items-center justify-center rounded-lg border ml-border ml-surface-bg', this.getSlotClass('Empty'))}">
<div class="text-sm ml-text-muted">${unsafeHTML(emptyContent)}</div>
</div>
</div>
`;
}

const { width, height, padding, minX, maxX, minY, maxY } = this.getChartMetrics(points);
const xTicks = this.getTicks(minX, maxX, 5);
const yTicks = this.getTicks(minY, maxY, 5);

return html`
<div class="${cn('w-full', this.cssClass)}">
${labelContent
? html`<div class="${cn('mb-2 text-sm font-semibold ml-text', this.getSlotClass('Label'))}">${unsafeHTML(labelContent)}</div>`
: html``}
<div
class="chart-container relative w-full rounded-lg border ml-border ml-surface-bg"
role="img"
aria-label="${labelText}"
>
<svg
class="block w-full"
viewBox="0 0 ${width} ${height}"
preserveAspectRatio="xMidYMid meet"
>
${this.renderAxes(width, height, padding, xTicks, yTicks)}
${this.renderTrendLines(points, width, height, padding, minX, maxX, minY, maxY)}
${points.map(point => this.renderPoint(point, width, height, padding, minX, maxX, minY, maxY))}
${this.showValues
? points.map(point => this.renderPointValue(point, width, height, padding, minX, maxX, minY, maxY))
: svg``}
</svg>
${this.hoveredPoint ? this.renderTooltip(this.hoveredPoint) : html``}
${this.renderDataTable(points)}
</div>
${this.showLegend ? this.renderLegend(seriesMeta) : html``}
</div>
`;
}
// ===========================================================================
// DATA PARSING
// ===========================================================================
private parseData(): { points: ParsedPoint[]; seriesMeta: SeriesMeta[] } {
const points: ParsedPoint[] = [];
const seriesMeta: SeriesMeta[] = [];

const seriesElements = this.getSlots('Series');
seriesElements.forEach(seriesEl => {
const name = seriesEl.getAttribute('name') ||'';
const color = seriesEl.getAttribute('color') ||'#38bdf8';
const typeAttr = seriesEl.getAttribute('type');
const trendAttr = seriesEl.getAttribute('trend');
const isTrend = typeAttr ==='trend' || trendAttr ==='true';

if (name) {
seriesMeta.push({ name, color, isTrend });
}

const pointEls = Array.from(seriesEl.querySelectorAll('Point'));
pointEls.forEach(pointEl => {
const label = pointEl.getAttribute('label') ||'';
const value = this.parseNumber(pointEl.getAttribute('value'));
const x = this.parseNumber(label, points.length);
const y = value;
const pointColor = pointEl.getAttribute('color') || color;
points.push({
label,
value: y,
x,
y,
series: name || undefined,
color: pointColor,
isTrend,
});
});
});

const rootPoints = this.getSlots('Point').filter(el => el.parentElement === this);
rootPoints.forEach(pointEl => {
const label = pointEl.getAttribute('label') ||'';
const value = this.parseNumber(pointEl.getAttribute('value'));
const x = this.parseNumber(label, points.length);
const y = value;
const color = pointEl.getAttribute('color') ||'#38bdf8';
points.push({
label,
value: y,
x,
y,
color,
});
});

return { points, seriesMeta };
}
// ===========================================================================
// CHART METRICS
// ===========================================================================
private getChartMetrics(points: ParsedPoint[]) {
const width = 640;
const height = 320;
const padding = { left: 56, right: 24, top: 24, bottom: 56 };
const xValues = points.map(p => p.x);
const yValues = points.map(p => p.y);
let minX = Math.min(...xValues);
let maxX = Math.max(...xValues);
let minY = Math.min(...yValues);
let maxY = Math.max(...yValues);

if (minX === maxX) {
minX -= 1;
maxX += 1;
}
if (minY === maxY) {
minY -= 1;
maxY += 1;
}

return { width, height, padding, minX, maxX, minY, maxY };
}

private getTicks(min: number, max: number, count: number): number[] {
const ticks: number[] = [];
const step = (max - min) / (count - 1);
for (let i = 0; i < count; i += 1) {
ticks.push(min + step * i);
}
return ticks;
}

private scaleX(value: number, width: number, padding: { left: number; right: number }, minX: number, maxX: number): number {
const range = maxX - minX;
const ratio = range === 0 ? 0 : (value - minX) / range;
return padding.left + ratio * (width - padding.left - padding.right);
}

private scaleY(value: number, height: number, padding: { top: number; bottom: number }, minY: number, maxY: number): number {
const range = maxY - minY;
const ratio = range === 0 ? 0 : (value - minY) / range;
return height - padding.bottom - ratio * (height - padding.top - padding.bottom);
}
// ===========================================================================
// RENDER HELPERS
// ===========================================================================
private renderAxes(
width: number,
height: number,
padding: { left: number; right: number; top: number; bottom: number },
xTicks: number[],
yTicks: number[],
): TemplateResult {
const axisColor ='ml-chart-axis';
const tickText ='ml-chart-axis';
const xAxisY = height - padding.bottom;
const yAxisX = padding.left;

return svg`
<g>
<line x1="${padding.left}" y1="${xAxisY}" x2="${width - padding.right}" y2="${xAxisY}" class="${axisColor}" stroke-width="1" />
<line x1="${yAxisX}" y1="${padding.top}" x2="${yAxisX}" y2="${xAxisY}" class="${axisColor}" stroke-width="1" />
${xTicks.map(tick => {
const x = this.scaleX(tick, width, padding, xTicks[0], xTicks[xTicks.length - 1]);
return svg`
<line x1="${x}" y1="${xAxisY}" x2="${x}" y2="${xAxisY + 6}" class="${axisColor}" stroke-width="1" />
<text x="${x}" y="${xAxisY + 20}" text-anchor="middle" class="${tickText}" font-size="10">${this.formatNumber(tick)}</text>
`;
})}
${yTicks.map(tick => {
const y = this.scaleY(tick, height, padding, yTicks[0], yTicks[yTicks.length - 1]);
return svg`
<line x1="${yAxisX - 6}" y1="${y}" x2="${yAxisX}" y2="${y}" class="${axisColor}" stroke-width="1" />
<text x="${yAxisX - 10}" y="${y + 3}" text-anchor="end" class="${tickText}" font-size="10">${this.formatNumber(tick)}</text>
`;
})}
</g>
`;
}

private renderPoint(
point: ParsedPoint,
width: number,
height: number,
padding: { left: number; right: number; top: number; bottom: number },
minX: number,
maxX: number,
minY: number,
maxY: number,
): TemplateResult {
const cx = this.scaleX(point.x, width, padding, minX, maxX);
const cy = this.scaleY(point.y, height, padding, minY, maxY);
const color = point.color ||'#38bdf8';
const ariaLabel = point.series ? `${point.series}: ${point.label}, ${point.value}` : `${point.label}, ${point.value}`;

return svg`
<circle
cx="${cx}"
cy="${cy}"
r="5"
fill="${color}"
stroke="white"
stroke-width="1"
role="button"
tabindex="0"
aria-label="${ariaLabel}"
@mouseenter=${(event: MouseEvent) => this.handlePointEnter(point, event)}
@mouseleave=${() => this.handlePointLeave()}
@focus=${(event: FocusEvent) => this.handlePointEnter(point, event as unknown as MouseEvent)}
@blur=${() => this.handlePointLeave()}
@click=${() => this.handlePointClick(point)}
@keydown=${(event: KeyboardEvent) => this.handlePointKeyDown(event, point)}
></circle>
`;
}

private renderPointValue(
point: ParsedPoint,
width: number,
height: number,
padding: { left: number; right: number; top: number; bottom: number },
minX: number,
maxX: number,
minY: number,
maxY: number,
): TemplateResult {
const x = this.scaleX(point.x, width, padding, minX, maxX);
const y = this.scaleY(point.y, height, padding, minY, maxY) - 10;
return svg`
<text x="${x}" y="${y}" text-anchor="middle" font-size="10" class="ml-chart-axis">${this.formatNumber(point.value)}</text>
`;
}

private renderTrendLines(
points: ParsedPoint[],
width: number,
height: number,
padding: { left: number; right: number; top: number; bottom: number },
minX: number,
maxX: number,
minY: number,
maxY: number,
): TemplateResult {
const trendSeries = points.filter(point => point.isTrend && point.series);
if (trendSeries.length === 0) return svg``;

const grouped: Record<string, ParsedPoint[]> = {};
trendSeries.forEach(point => {
const key = point.series ||'trend';
if (!grouped[key]) grouped[key] = [];
grouped[key].push(point);
});

return svg`
${Object.entries(grouped).map(([key, seriesPoints]) => {
const sorted = [...seriesPoints].sort((a, b) => a.x - b.x);
const path = sorted.map((point, index) => {
const x = this.scaleX(point.x, width, padding, minX, maxX);
const y = this.scaleY(point.y, height, padding, minY, maxY);
return `${index === 0 ?'M' :'L'} ${x} ${y}`;
}).join('');
const color = seriesPoints[0].color ||'#38bdf8';
return svg`<path d="${path}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" />`;
})}
`;
}

private renderLegend(seriesMeta: SeriesMeta[]): TemplateResult {
if (!seriesMeta.length) return html``;
const visibleSeries = seriesMeta.filter(series => series.name);
if (!visibleSeries.length) return html``;

return html`
<div class="mt-2 flex flex-wrap gap-3 text-xs ml-text-muted">
${visibleSeries.map(series => html`
<div class="flex items-center gap-2">
<span class="h-2 w-2 rounded-full" style="background:${series.color}"></span>
<span>${series.name}</span>
</div>
`)}
</div>
`;
}

private renderTooltip(point: HoveredPoint): TemplateResult {
const classes = [
'pointer-events-none absolute z-10 rounded-md border px-2 py-1 text-xs shadow',
'ml-surface-bg',
'ml-text',
'ml-border',
].join(' ');

return html`
<div class="${classes}" style="left:${point.left}px; top:${point.top}px;">
<div class="font-semibold">${point.label}</div>
<div>${this.msg.xHeader}: ${point.label}</div>
<div>${this.msg.yHeader}: ${this.formatNumber(point.value)}</div>
${point.series ? html`<div>${this.msg.seriesHeader}: ${point.series}</div>` : html``}
</div>
`;
}

private renderDataTable(points: ParsedPoint[]): TemplateResult {
const hasSeries = points.some(point => !!point.series);
return html`
<table class="sr-only">
<thead>
<tr>
${hasSeries ? html`<th>${this.msg.seriesHeader}</th>` : html``}
<th>${this.msg.xHeader}</th>
<th>${this.msg.yHeader}</th>
</tr>
</thead>
<tbody>
${points.map(point => html`
<tr>
${hasSeries ? html`<td>${point.series ||''}</td>` : html``}
<td>${point.label}</td>
<td>${this.formatNumber(point.value)}</td>
</tr>
`)}
</tbody>
</table>
`;
}
// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handlePointEnter(point: ParsedPoint, event: MouseEvent) {
if (!this.chartContainer) return;
const rect = this.chartContainer.getBoundingClientRect();
const left = event.clientX - rect.left + 12;
const top = event.clientY - rect.top - 12;
this.hoveredPoint = {
label: point.label,
value: point.value,
series: point.series,
left,
top,
};
}

private handlePointLeave() {
this.hoveredPoint = null;
}

private handlePointClick(point: ParsedPoint) {
this.dispatchEvent(new CustomEvent('pointClick', {
bubbles: true,
composed: true,
detail: { label: point.label, value: point.value, series: point.series },
}));
}

private handlePointKeyDown(event: KeyboardEvent, point: ParsedPoint) {
if (event.key ==='Enter' || event.key ==='') {
event.preventDefault();
this.handlePointClick(point);
}
}
// ===========================================================================
// UTILS
// ===========================================================================
private parseNumber(value: string | null, fallback = 0): number {
if (value === null || value === undefined) return fallback;
const parsed = Number(value);
return Number.isNaN(parsed) ? fallback : parsed;
}

private formatNumber(value: number): string {
if (Number.isInteger(value)) return value.toString();
return value.toFixed(2);
}

private getPlainText(htmlContent: string): string {
return htmlContent.replace(/<[^>]*>/g,'').trim();
}
}
