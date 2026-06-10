/// <mls fileReference="_102040_/l2/molecules/groupviewchart/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupviewchart/ml-area-chart';
import '/_102040_/l2/molecules/groupviewchart/ml-bar-chart';
import '/_102040_/l2/molecules/groupviewchart/ml-line-chart';
import '/_102040_/l2/molecules/groupviewchart/ml-pie-chart';
import '/_102040_/l2/molecules/groupviewchart/ml-scatter-plot';
import '/_102040_/l2/molecules/groupviewchart/ml-radar-chart';
@customElement('molecules--groupviewchart--index-102040')
export class GroupViewChartIndex extends StateLitElement {
// ── Showcase card states ─────────────────────────────────────
@state() private cardArea = 0;
@state() private cardBar = 0;
@state() private cardLine = 0;
@state() private cardPie = 0;
@state() private cardScatter = 0;
@state() private cardRadar = 0;
// ===========================================================================
// HERO
private renderHero(): TemplateResult {
return html`
<header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
<span
class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
>
groupViewChart
</span>
<h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
View Charts
</h1>
<p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
Displays data through graphical representation. Data provided via Series and Point slot tags. All chart implementations share the same data contract — swap the component tag to change visualization.
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
<p class="text-sm font-bold text-slate-900 dark:text-slate-50">Area chart</p>
<code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewchart--ml-area-chart</code>
</div>
<p class="text-xs text-slate-400 mb-5">Use for stacked trends with multiple series over time.</p>
<groupviewchart--ml-area-chart
name="card-1"
.value=${this.cardArea}
.isEditing=${true}
.showLegend=${true}
.showValues=${false}
@change=${(e: CustomEvent) => {
this.cardArea = e.detail.value;
}}
>
<Label>Customer Growth</Label>
<Series name="Free" color="#7c3aed">
<Point label="Jan" value="120" />
<Point label="Feb" value="180" />
<Point label="Mar" value="260" />
</Series>
<Series name="Pro" color="#22c55e">
<Point label="Jan" value="60" />
<Point label="Feb" value="110" />
<Point label="Mar" value="150" />
</Series>
<Empty>No customer data yet.</Empty>
</groupviewchart--ml-area-chart>
</div>
</div>
<div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
<div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
<div class="p-6">
<div class="flex items-center justify-between mb-1">
<p class="text-sm font-bold text-slate-900 dark:text-slate-50">Bar chart</p>
<code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewchart--ml-bar-chart</code>
</div>
<p class="text-xs text-slate-400 mb-5">Compare categories side by side in a monthly snapshot.</p>
<groupviewchart--ml-bar-chart
name="card-2"
.value=${this.cardBar}
.isEditing=${true}
.showLegend=${true}
.showValues=${true}
@change=${(e: CustomEvent) => {
this.cardBar = e.detail.value;
}}
>
<Label>Monthly Revenue</Label>
<Series name="2024" color="#10b981">
<Point label="Jan" value="1200" />
<Point label="Feb" value="1800" />
<Point label="Mar" value="950" />
</Series>
<Series name="2025" color="#f59e0b">
<Point label="Jan" value="1500" />
<Point label="Feb" value="2100" />
<Point label="Mar" value="1300" />
</Series>
<Empty>No revenue data available.</Empty>
</groupviewchart--ml-bar-chart>
</div>
</div>
<div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
<div class="h-1 bg-amber-500 rounded-t-2xl"></div>
<div class="p-6">
<div class="flex items-center justify-between mb-1">
<p class="text-sm font-bold text-slate-900 dark:text-slate-50">Line chart</p>
<code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewchart--ml-line-chart</code>
</div>
<p class="text-xs text-slate-400 mb-5">Best for precise trend lines with multiple series.</p>
<groupviewchart--ml-line-chart
name="card-3"
.value=${this.cardLine}
.isEditing=${true}
.showLegend=${true}
.showValues=${false}
@change=${(e: CustomEvent) => {
this.cardLine = e.detail.value;
}}
>
<Label>Support Tickets</Label>
<Series name="Opened" color="#f97316">
<Point label="Mon" value="34" />
<Point label="Tue" value="42" />
<Point label="Wed" value="28" />
<Point label="Thu" value="55" />
</Series>
<Series name="Resolved" color="#0ea5e9">
<Point label="Mon" value="18" />
<Point label="Tue" value="30" />
<Point label="Wed" value="26" />
<Point label="Thu" value="48" />
</Series>
<Empty>No ticket data yet.</Empty>
</groupviewchart--ml-line-chart>
</div>
</div>
<div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
<div class="h-1 bg-rose-500 rounded-t-2xl"></div>
<div class="p-6">
<div class="flex items-center justify-between mb-1">
<p class="text-sm font-bold text-slate-900 dark:text-slate-50">Pie chart</p>
<code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewchart--ml-pie-chart</code>
</div>
<p class="text-xs text-slate-400 mb-5">Single-series share of total across categories.</p>
<groupviewchart--ml-pie-chart
name="card-4"
.value=${this.cardPie}
.isEditing=${true}
.showLegend=${true}
.showValues=${true}
@change=${(e: CustomEvent) => {
this.cardPie = e.detail.value;
}}
>
<Label>Channel Mix</Label>
<Point label="Organic" value="42" color="#ec4899" />
<Point label="Paid" value="28" color="#8b5cf6" />
<Point label="Referral" value="18" color="#14b8a6" />
<Point label="Partner" value="12" color="#f97316" />
<Empty>No channel data yet.</Empty>
</groupviewchart--ml-pie-chart>
</div>
</div>
<div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
<div class="h-1 bg-sky-500 rounded-t-2xl"></div>
<div class="p-6">
<div class="flex items-center justify-between mb-1">
<p class="text-sm font-bold text-slate-900 dark:text-slate-50">Scatter plot</p>
<code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewchart--ml-scatter-plot</code>
</div>
<p class="text-xs text-slate-400 mb-5">Reveal correlation between two metrics across segments.</p>
<groupviewchart--ml-scatter-plot
name="card-5"
.value=${this.cardScatter}
.isEditing=${true}
.showLegend=${true}
.showValues=${false}
@change=${(e: CustomEvent) => {
this.cardScatter = e.detail.value;
}}
>
<Label>Latency vs. Satisfaction</Label>
<Series name="Enterprise" color="#0ea5e9">
<Point label="A" value="82" />
<Point label="B" value="68" />
<Point label="C" value="74" />
</Series>
<Series name="SMB" color="#f97316">
<Point label="D" value="56" />
<Point label="E" value="63" />
<Point label="F" value="71" />
</Series>
<Empty>No correlation data yet.</Empty>
</groupviewchart--ml-scatter-plot>
</div>
</div>
<div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
<div class="h-1 bg-indigo-500 rounded-t-2xl"></div>
<div class="p-6">
<div class="flex items-center justify-between mb-1">
<p class="text-sm font-bold text-slate-900 dark:text-slate-50">Radar chart</p>
<code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewchart--ml-radar-chart</code>
</div>
<p class="text-xs text-slate-400 mb-5">Compare balanced performance across multiple dimensions.</p>
<groupviewchart--ml-radar-chart
name="card-6"
.value=${this.cardRadar}
.isEditing=${true}
.showLegend=${true}
.showValues=${false}
@change=${(e: CustomEvent) => {
this.cardRadar = e.detail.value;
}}
>
<Label>Team Skill Matrix</Label>
<Series name="Design" color="#6366f1">
<Point label="Research" value="78" />
<Point label="Visual" value="92" />
<Point label="Systems" value="65" />
</Series>
<Series name="Engineering" color="#14b8a6">
<Point label="Research" value="55" />
<Point label="Visual" value="64" />
<Point label="Systems" value="88" />
</Series>
<Empty>No team data yet.</Empty>
</groupviewchart--ml-radar-chart>
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
area: boolean;
bar: boolean;
line: boolean;
pie: boolean;
scatter: boolean;
radar: boolean;
}> = [
{
scenario: 'Compare multi-series trends over time with stacked context.',
area: true,
bar: false,
line: false,
pie: false,
scatter: false,
radar: false,
},
{
scenario: 'Compare category totals for the same time period.',
area: false,
bar: true,
line: false,
pie: false,
scatter: false,
radar: false,
},
{
scenario: 'Track precise series movement across intervals.',
area: false,
bar: false,
line: true,
pie: false,
scatter: false,
radar: false,
},
{
scenario: 'Show share of total for a single series breakdown.',
area: false,
bar: false,
line: false,
pie: true,
scatter: false,
radar: false,
},
{
scenario: 'Explore correlation between two metrics across segments.',
area: false,
bar: false,
line: false,
pie: false,
scatter: true,
radar: false,
},
{
scenario: 'Evaluate balanced performance across multiple dimensions.',
area: false,
bar: false,
line: false,
pie: false,
scatter: false,
radar: true,
},
];
const headers = [
{ label: 'Area', cls: 'text-violet-600 dark:text-violet-400' },
{ label: 'Bar', cls: 'text-emerald-600 dark:text-emerald-400' },
{ label: 'Line', cls: 'text-amber-600 dark:text-amber-400' },
{ label: 'Pie', cls: 'text-rose-600 dark:text-rose-400' },
{ label: 'Scatter', cls: 'text-sky-600 dark:text-sky-400' },
{ label: 'Radar', cls: 'text-indigo-600 dark:text-indigo-400' },
];
return html`
<section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
<div class="max-w-5xl mx-auto">
<h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
<p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
Use this decision table to choose the right chart while keeping the shared Series/Point data contract.
</p>
<div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
<table class="w-full text-sm">
<thead>
<tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
<th
class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-3/4"
>
Scenario
</th>
${headers.map(
(h) => html`
<th class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}">
${h.label}
</th>
`
)}
</tr>
</thead>
<tbody>
${rows.map((row, i) => {
const chartFlags = [row.area, row.bar, row.line, row.pie, row.scatter, row.radar];
return html`
<tr
class="${
i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''
} border-b border-slate-100 dark:border-slate-700/60 last:border-0"
>
<td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
${chartFlags.map(
(ok) => html`
<td class="px-4 py-3.5 text-center">
${ok
? html`<span
class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
>✓</span
>`
: html`<span class="text-slate-200 dark:text-slate-700 text-sm">—</span>`}
</td>
`
)}
</tr>
`;
})}
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
