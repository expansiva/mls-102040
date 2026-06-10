/// <mls fileReference="_102040_/l2/molecules/groupviewchart/ml-radar-chart.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// RADAR CHART MOLECULE
// =============================================================================
// Skill Group: groupViewChart
// This molecule does NOT contain business logic.
import { html, svg, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
loading: 'Loading chart...',
empty: 'No data available',
seriesFallback: 'Series',
ariaLabelFallback: 'Radar chart',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
pt: {
loading: 'Carregando gráfico...',
empty: 'Nenhum dado disponível',
seriesFallback: 'Série',
ariaLabelFallback: 'Gráfico radar',
},
};
/// **collab_i18n_end**

interface PointData {
label: string;
value: number;
color?: string;
}

interface SeriesData {
name: string;
color: string;
points: PointData[];
}

interface HoverPoint {
label: string;
value: number;
series?: string;
leftPercent: number;
topPercent: number;
color: string;
}

@customElement('groupviewchart--ml-radar-chart')
export class RadarChartMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;

// ===========================================================================
// SLOT TAGS
// ===========================================================================
slotTags = ['Label', 'Series', 'Point', 'Empty'];

// ===========================================================================
// PROPERTIES — From Contract
// ===========================================================================
@propertyDataSource({ type: Boolean, attribute: 'show-legend' })
showLegend = true;

@propertyDataSource({ type: Boolean, attribute: 'show-values' })
showValues = false;

@propertyDataSource({ type: Boolean })
loading = false;

// ===========================================================================
// INTERNAL STATE
// ===========================================================================
@state()
private hoveredPoint: HoverPoint | null = null;

// ===========================================================================
// DATA PARSING
// ===========================================================================
private parseChartData(): { axes: string[]; series: SeriesData[] } {
const seriesElements = this.getSlots('Series');
const hasSeries = seriesElements.length > 0;
const seriesList: SeriesData[] = [];
const palette = ['#0ea5e9', '#10b981', '#8b5cf6', '#f97316', '#ef4444', '#14b8a6', '#f59e0b', '#6366f1'];

if (hasSeries) {
seriesElements.forEach((el, index) => {
const name = el.getAttribute('name') || `${this.msg.seriesFallback} ${index + 1}`;
const color = el.getAttribute('color') || palette[index % palette.length];
const points = Array.from(el.querySelectorAll('Point')).map((pointEl) => ({
label: pointEl.getAttribute('label') || '',
value: Number(pointEl.getAttribute('value') || '0'),
color: pointEl.getAttribute('color') || undefined,
})).filter((p) => p.label);
seriesList.push({ name, color, points });
});
} else {
const rootPoints = this.getSlots('Point').filter((pointEl) => pointEl.parentElement === this);
if (rootPoints.length > 0) {
const points = rootPoints.map((pointEl) => ({
label: pointEl.getAttribute('label') || '',
value: Number(pointEl.getAttribute('value') || '0'),
color: pointEl.getAttribute('color') || undefined,
})).filter((p) => p.label);
seriesList.push({ name: `${this.msg.seriesFallback} 1`, color: palette[0], points });
}
}

const axes: string[] = [];
if (seriesList.length > 0) {
seriesList.forEach((series) => {
series.points.forEach((point) => {
if (!axes.includes(point.label)) {
axes.push(point.label);
}
});
});
}

return {
axes: axes.slice(0, 8),
series: seriesList,
};
}

private getAxisMaxValues(axes: string[], seriesList: SeriesData[]): number[] {
return axes.map((axis) => {
let max = 0;
seriesList.forEach((series) => {
const point = series.points.find((p) => p.label === axis);
if (point && point.value > max) max = point.value;
});
return max <= 0 ? 1 : max;
});
}

private getPlainText(content: string): string {
return content.replace(/<[^>]*>/g, '').trim();
}

// ===========================================================================
// EVENT HANDLERS
// ===========================================================================
private handlePointClick(point: HoverPoint) {
this.dispatchEvent(new CustomEvent('pointClick', {
bubbles: true,
composed: true,
detail: { label: point.label, value: point.value, series: point.series },
}));
}

private handlePointHover(point: HoverPoint) {
this.hoveredPoint = point;
}

private handlePointLeave() {
this.hoveredPoint = null;
}

// ===========================================================================
// RENDER HELPERS
// ===========================================================================
private renderLegend(series: SeriesData[]) {
if (!this.showLegend || series.length <= 1) return nothing;
return html`
<div class="mt-4 flex flex-wrap gap-3">
${series.map((s) => html`
<div class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
<span class="inline-block h-2.5 w-2.5 rounded-full" style="background:${s.color}"></span>
<span>${s.name}</span>
</div>
`)}
</div>
`;
}

private renderTooltip() {
if (!this.hoveredPoint) return nothing;
return html`
<div
class="pointer-events-none absolute z-10 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
style="left:${this.hoveredPoint.leftPercent}%; top:${this.hoveredPoint.topPercent}%; transform: translate(-50%, -120%);"
>
<div class="font-medium">${this.hoveredPoint.label}</div>
<div class="text-slate-600 dark:text-slate-400">${this.hoveredPoint.value}${this.hoveredPoint.series ? ` · ${this.hoveredPoint.series}` : ''}</div>
</div>
`;
}

private renderEmptyState() {
const emptyContent = this.hasSlot('Empty') ? this.getSlotContent('Empty') : this.msg.empty;
return html`
<div class="absolute inset-0 flex items-center justify-center">
<div class="text-sm text-slate-500 dark:text-slate-400">${unsafeHTML(emptyContent)}</div>
</div>
`;
}

private renderLoadingState() {
return html`
<div class="absolute inset-0 flex items-center justify-center">
<div class="text-sm text-slate-500 dark:text-slate-400">${this.msg.loading}</div>
</div>
`;
}

private renderAccessibleTable(axes: string[], series: SeriesData[]) {
return html`
<table class="sr-only">
<thead>
<tr>
<th>Series</th>
${axes.map((axis) => html`<th>${axis}</th>`)}
</tr>
</thead>
<tbody>
${series.map((s) => html`
<tr>
<td>${s.name}</td>
${axes.map((axis) => {
const point = s.points.find((p) => p.label === axis);
return html`<td>${point ? point.value : 0}</td>`;
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

const labelContent = this.getSlotContent('Label') || '';
const ariaLabel = this.getPlainText(labelContent) || this.msg.ariaLabelFallback;
const { axes, series } = this.parseChartData();
const hasData = axes.length > 0 && series.length > 0;

const viewBox = 200;
const center = 100;
const radius = 70;
const labelRadius = 88;
const rings = 4;
const axisCount = axes.length || 1;
const maxValues = this.getAxisMaxValues(axes, series);

const angleStep = (Math.PI * 2) / axisCount;

const axisPoints = axes.map((label, index) => {
const angle = -Math.PI / 2 + index * angleStep;
const x = center + radius * Math.cos(angle);
const y = center + radius * Math.sin(angle);
const lx = center + labelRadius * Math.cos(angle);
const ly = center + labelRadius * Math.sin(angle);
const textAnchor = Math.cos(angle) > 0.2 ? 'start' : Math.cos(angle) < -0.2 ? 'end' : 'middle';
const dy = Math.sin(angle) > 0.2 ? '0.6em' : Math.sin(angle) < -0.2 ? '-0.2em' : '0.3em';
return { label, x, y, lx, ly, textAnchor, dy };
});

return html`
<div class="w-full">
${labelContent ? html`<div class="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">${unsafeHTML(labelContent)}</div>` : nothing}
<div class="relative">
<div class="aspect-square w-full">
<svg
viewBox="0 0 ${viewBox} ${viewBox}"
role="img"
aria-label="${ariaLabel}"
class="h-full w-full"
>
${axisPoints.map((axis) => svg`
<line x1="${center}" y1="${center}" x2="${axis.x}" y2="${axis.y}" class="stroke-slate-200 dark:stroke-slate-700" />
`)}
${Array.from({ length: rings }).map((_, i) => {
const r = (radius / rings) * (i + 1);
return svg`<circle cx="${center}" cy="${center}" r="${r}" class="fill-none stroke-slate-200 dark:stroke-slate-700" />`;
})}
${axisPoints.map((axis) => svg`
<text x="${axis.lx}" y="${axis.ly}" text-anchor="${axis.textAnchor}" dy="${axis.dy}" class="text-xs fill-slate-600 dark:fill-slate-400">${axis.label}</text>
`)}
${hasData ? series.map((s, seriesIndex) => {
const points = axisPoints.map((axis, axisIndex) => {
const point = s.points.find((p) => p.label === axis.label);
const value = point ? point.value : 0;
const max = maxValues[axisIndex] || 1;
const ratio = Math.min(value / max, 1);
const angle = -Math.PI / 2 + axisIndex * angleStep;
const x = center + radius * ratio * Math.cos(angle);
const y = center + radius * ratio * Math.sin(angle);
return { x, y, label: axis.label, value, series: s.name, color: point?.color || s.color };
});
const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(' ');
return svg`
<g>
<polygon points="${polygonPoints}" fill="${s.color}" fill-opacity="0.2" stroke="${s.color}" stroke-width="2" />
${points.map((p) => svg`
<g>
<circle
cx="${p.x}"
cy="${p.y}"
r="3"
fill="${p.color}"
class="cursor-pointer"
role="button"
aria-label="${p.label}: ${p.value}${p.series ? ` (${p.series})` : ''}"
@mouseenter=${() => this.handlePointHover({
label: p.label,
value: p.value,
series: series.length > 1 ? p.series : undefined,
leftPercent: (p.x / viewBox) * 100,
topPercent: (p.y / viewBox) * 100,
color: p.color,
})}
@mouseleave=${this.handlePointLeave}
@click=${() => this.handlePointClick({
label: p.label,
value: p.value,
series: series.length > 1 ? p.series : undefined,
leftPercent: 0,
topPercent: 0,
color: p.color,
})}
></circle>
${this.showValues ? svg`
<text x="${p.x}" y="${p.y}" dy="-0.6em" text-anchor="middle" class="text-[10px] fill-slate-600 dark:fill-slate-400">${p.value}</text>
` : svg``}
</g>
`)}
</g>
`;
}) : svg``}
</svg>
</div>
${this.loading ? this.renderLoadingState() : nothing}
${!this.loading && !hasData ? this.renderEmptyState() : nothing}
${this.renderTooltip()}
</div>
${this.renderLegend(series)}
${hasData ? this.renderAccessibleTable(axes, series) : nothing}
</div>
`;
}
}
