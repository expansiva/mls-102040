/// <mls fileReference="_102040_/l2/testes/financial-report.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupenterdateinterval/ml-date-range-dual-calendar';
import '/_102040_/l2/molecules/groupselectone/ml-select-dropdown';
import '/_102040_/l2/molecules/groupselectone/ml-segmented-control';
import '/_102040_/l2/molecules/groupviewmetric/ml-metric-big-number';
import '/_102040_/l2/molecules/groupviewchart/ml-area-chart';
import '/_102040_/l2/molecules/groupviewchart/ml-pie-chart';
import '/_102040_/l2/molecules/groupviewtable/ml-view-table';
import '/_102040_/l2/molecules/groupnavigatesection/ml-tabs';

interface KpiEntry {
  value: string;
  delta: string;
  direction: 'up' | 'down' | 'neutral';
}

@customElement('testes--financial-report')
export class FinancialReport extends StateLitElement {

  // ── Filtros ────────────────────────────────────────────────────────────────
  @state() startDate = '2026-01-01';
  @state() endDate = '2026-05-31';
  @state() granularity = 'monthly';
  @state() activeView: 'revenue' | 'expense' | 'margin' = 'revenue';
  @state() activeTab = 'overview';

  // ── KPIs ───────────────────────────────────────────────────────────────────
  private readonly summary: Record<'revenue' | 'expense' | 'netProfit', KpiEntry> = {
    revenue:   { value: 'R$ 6.420.000', delta: '+18% vs período anterior', direction: 'up'   },
    expense:   { value: 'R$ 4.105.000', delta: '+11% vs período anterior', direction: 'down' },
    netProfit: { value: 'R$ 2.315.000', delta: '+31% vs período anterior', direction: 'up'   },
  };

  private kpiRing(key: 'revenue' | 'expense' | 'netProfit'): string {
    const viewMap: Record<string, 'revenue' | 'expense' | 'netProfit'> = {
      revenue: 'revenue',
      expense: 'expense',
      margin:  'netProfit',
    };
    return viewMap[this.activeView] === key
      ? 'ring-2 ring-sky-500 dark:ring-sky-400 rounded-xl'
      : '';
  }

  // ── Render principal ───────────────────────────────────────────────────────
  render() {
    const s = this.summary;
    return html`
<div class="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans">
  <div class="max-w-7xl mx-auto px-6 py-8">

    <!-- Cabeçalho + filtros -->
    <div class="flex flex-col lg:flex-row lg:items-end gap-6 mb-8">
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Relatório Financeiro</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Análise de receitas, despesas e margem de lucro</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 items-end shrink-0">
        <groupenterdateinterval--ml-date-range-dual-calendar
          .startDate=${this.startDate}
          .endDate=${this.endDate}
          name="reportPeriod"
          locale="pt-BR"
          @change=${(e: CustomEvent) => {
            this.startDate = e.detail.startDate ?? this.startDate;
            this.endDate   = e.detail.endDate   ?? this.endDate;
          }}
        >
          <Label>Período de análise</Label>
          <LabelStart>Data inicial</LabelStart>
          <LabelEnd>Data final</LabelEnd>
        </groupenterdateinterval--ml-date-range-dual-calendar>

        <groupselectone--ml-select-dropdown
          value="${this.granularity}"
          name="granularity"
          @change=${(e: CustomEvent) => { this.granularity = e.detail.value; }}
        >
          <Label>Granularidade</Label>
          <Item value="daily">Diário</Item>
          <Item value="weekly">Semanal</Item>
          <Item value="monthly">Mensal</Item>
        </groupselectone--ml-select-dropdown>
      </div>
    </div>

    <!-- Seletor de visão + KPIs -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
      <h2 class="text-base font-semibold text-slate-700 dark:text-slate-300">Resumo do Período</h2>
      <groupselectone--ml-segmented-control
        value="${this.activeView}"
        name="activeView"
        @change=${(e: CustomEvent) => { this.activeView = e.detail.value as 'revenue' | 'expense' | 'margin'; }}
      >
        <Item value="revenue">Receita</Item>
        <Item value="expense">Despesa</Item>
        <Item value="margin">Margem</Item>
      </groupselectone--ml-segmented-control>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

      <div class="${this.kpiRing('revenue')}">
        <groupviewmetric--ml-metric-big-number>
          <Label>Receita Total</Label>
          <Value>${s.revenue.value}</Value>
          <Trend direction="${s.revenue.direction}">${s.revenue.delta}</Trend>
        </groupviewmetric--ml-metric-big-number>
      </div>

      <div class="${this.kpiRing('expense')}">
        <groupviewmetric--ml-metric-big-number>
          <Label>Despesa Total</Label>
          <Value>${s.expense.value}</Value>
          <Trend direction="${s.expense.direction}">${s.expense.delta}</Trend>
        </groupviewmetric--ml-metric-big-number>
      </div>

      <div class="${this.kpiRing('netProfit')}">
        <groupviewmetric--ml-metric-big-number>
          <Label>Lucro Líquido</Label>
          <Value>${s.netProfit.value}</Value>
          <Trend direction="${s.netProfit.direction}">${s.netProfit.delta}</Trend>
        </groupviewmetric--ml-metric-big-number>
      </div>

    </div>

    <!-- Abas de análise -->
    <groupnavigatesection--ml-tabs
      value="${this.activeTab}"
      @change=${(e: CustomEvent) => { this.activeTab = e.detail.value; }}
    >

      <Tab value="overview" title="Visão Geral">
        <groupviewchart--ml-area-chart show-legend="true">
          <Label>Evolução Financeira — Jan a Mai/2026 (R$ mil)</Label>
          <Series name="Receita" color="#0ea5e9">
            <Point label="Jan/26" value="1100"></Point>
            <Point label="Fev/26" value="1150"></Point>
            <Point label="Mar/26" value="1280"></Point>
            <Point label="Abr/26" value="1340"></Point>
            <Point label="Mai/26" value="1550"></Point>
          </Series>
          <Series name="Despesa" color="#ef4444">
            <Point label="Jan/26" value="750"></Point>
            <Point label="Fev/26" value="790"></Point>
            <Point label="Mar/26" value="820"></Point>
            <Point label="Abr/26" value="860"></Point>
            <Point label="Mai/26" value="885"></Point>
          </Series>
        </groupviewchart--ml-area-chart>
      </Tab>

      <Tab value="category" title="Por Categoria">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <groupviewchart--ml-pie-chart show-legend="true" show-values="true">
            <Label>Distribuição de Despesas por Categoria</Label>
            <Point label="Pessoal"     value="45" color="#0ea5e9"></Point>
            <Point label="Operacional" value="28" color="#8b5cf6"></Point>
            <Point label="Marketing"   value="14" color="#10b981"></Point>
            <Point label="TI"          value="8"  color="#f59e0b"></Point>
            <Point label="Outros"      value="5"  color="#64748b"></Point>
          </groupviewchart--ml-pie-chart>
          <div>
            <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Valores absolutos</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <span class="h-3 w-3 rounded-full flex-shrink-0 bg-sky-500"></span>
                <span class="flex-1 text-sm text-slate-700 dark:text-slate-300">Pessoal</span>
                <span class="text-xs text-slate-500 dark:text-slate-400 w-8 text-right">45%</span>
                <span class="text-sm font-medium text-slate-800 dark:text-slate-100 w-28 text-right">R$ 1.847.250</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="h-3 w-3 rounded-full flex-shrink-0 bg-violet-500"></span>
                <span class="flex-1 text-sm text-slate-700 dark:text-slate-300">Operacional</span>
                <span class="text-xs text-slate-500 dark:text-slate-400 w-8 text-right">28%</span>
                <span class="text-sm font-medium text-slate-800 dark:text-slate-100 w-28 text-right">R$ 1.149.400</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="h-3 w-3 rounded-full flex-shrink-0 bg-emerald-500"></span>
                <span class="flex-1 text-sm text-slate-700 dark:text-slate-300">Marketing</span>
                <span class="text-xs text-slate-500 dark:text-slate-400 w-8 text-right">14%</span>
                <span class="text-sm font-medium text-slate-800 dark:text-slate-100 w-28 text-right">R$ 574.700</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="h-3 w-3 rounded-full flex-shrink-0 bg-amber-500"></span>
                <span class="flex-1 text-sm text-slate-700 dark:text-slate-300">TI</span>
                <span class="text-xs text-slate-500 dark:text-slate-400 w-8 text-right">8%</span>
                <span class="text-sm font-medium text-slate-800 dark:text-slate-100 w-28 text-right">R$ 328.400</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="h-3 w-3 rounded-full flex-shrink-0 bg-slate-500"></span>
                <span class="flex-1 text-sm text-slate-700 dark:text-slate-300">Outros</span>
                <span class="text-xs text-slate-500 dark:text-slate-400 w-8 text-right">5%</span>
                <span class="text-sm font-medium text-slate-800 dark:text-slate-100 w-28 text-right">R$ 205.250</span>
              </div>
            </div>
          </div>
        </div>
      </Tab>

      <Tab value="costcenter" title="Por Centro de Custo">
        <groupviewtable--ml-view-table is-editing="false">
          <Caption>Resultado por Centro de Custo — Jan a Mai/2026</Caption>
          <TableHeader>
            <TableRow>
              <TableHead>Centro de Custo</TableHead>
              <TableHead>Receita</TableHead>
              <TableHead>Despesa</TableHead>
              <TableHead>Margem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell><span class="font-medium text-slate-800 dark:text-slate-100">Comercial</span></TableCell>
              <TableCell><span class="font-medium text-emerald-600 dark:text-emerald-400">R$ 2.800.000</span></TableCell>
              <TableCell><span class="text-red-600 dark:text-red-400">R$ 1.200.000</span></TableCell>
              <TableCell><span class="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">57%</span></TableCell>
            </TableRow>
            <TableRow>
              <TableCell><span class="font-medium text-slate-800 dark:text-slate-100">Produto</span></TableCell>
              <TableCell><span class="font-medium text-emerald-600 dark:text-emerald-400">R$ 1.900.000</span></TableCell>
              <TableCell><span class="text-red-600 dark:text-red-400">R$ 1.400.000</span></TableCell>
              <TableCell><span class="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">26%</span></TableCell>
            </TableRow>
            <TableRow>
              <TableCell><span class="font-medium text-slate-800 dark:text-slate-100">Corporativo</span></TableCell>
              <TableCell><span class="font-medium text-emerald-600 dark:text-emerald-400">R$ 1.720.000</span></TableCell>
              <TableCell><span class="text-red-600 dark:text-red-400">R$ 1.505.000</span></TableCell>
              <TableCell><span class="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">12%</span></TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell><span class="font-semibold text-slate-800 dark:text-slate-100">Total</span></TableCell>
              <TableCell><span class="font-semibold text-emerald-600 dark:text-emerald-400">R$ 6.420.000</span></TableCell>
              <TableCell><span class="font-semibold text-red-600 dark:text-red-400">R$ 4.105.000</span></TableCell>
              <TableCell><span class="font-semibold text-slate-700 dark:text-slate-300">36%</span></TableCell>
            </TableRow>
          </TableFooter>
        </groupviewtable--ml-view-table>
      </Tab>

    </groupnavigatesection--ml-tabs>

  </div>
</div>
    `;
  }
}
