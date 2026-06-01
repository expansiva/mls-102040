/// <mls fileReference="_102040_/l2/testes/corporate-dashboard.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupviewmetric/ml-metric-big-number';
import '/_102040_/l2/molecules/groupviewmetric/ml-metric-gauge';
import '/_102040_/l2/molecules/groupviewchart/ml-area-chart';
import '/_102040_/l2/molecules/groupviewchart/ml-bar-chart';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table-minimal';
import '/_102040_/l2/molecules/groupnotifyuser/ml-notify-banner';
import '/_102040_/l2/molecules/groupselectone/ml-segmented-control';

interface KpiSet {
  revenue:    { value: string; trend: string; direction: 'up' | 'down' | 'neutral' };
  orders:     { value: string; trend: string; direction: 'up' | 'down' | 'neutral' };
  avgTicket:  { value: string; trend: string; direction: 'up' | 'down' | 'neutral' };
  defaulting: { value: string; trend: string; direction: 'up' | 'down' | 'neutral' };
  goalPct:    string;
  goalHelper: string;
}

interface Transaction {
  id: string;
  client: string;
  value: string;
  status: 'Aprovado' | 'Pendente' | 'Enviado' | 'Cancelado';
  date: string;
}

@customElement('testes--corporate-dashboard')
export class CorporateDashboard extends StateLitElement {

  @state() period: string = 'monthly';
  @state() bannerVisible: boolean = true;

  private readonly kpiData: Record<string, KpiSet> = {
    weekly: {
      revenue:    { value: 'R$ 312.400',   trend: '+8% vs sem. ant.',  direction: 'up'      },
      orders:     { value: '947',           trend: '+5% vs sem. ant.',  direction: 'up'      },
      avgTicket:  { value: 'R$ 330',        trend: '-1% vs sem. ant.',  direction: 'down'    },
      defaulting: { value: '3,9%',          trend: '+0,1 p.p.',         direction: 'down'    },
      goalPct:    '74%',
      goalHelper: 'Semana atual',
    },
    monthly: {
      revenue:    { value: 'R$ 1.284.900', trend: '+12% vs mês ant.',  direction: 'up'      },
      orders:     { value: '3.847',        trend: '+8% vs mês ant.',   direction: 'up'      },
      avgTicket:  { value: 'R$ 334',       trend: '-2% vs mês ant.',   direction: 'down'    },
      defaulting: { value: '4,1%',         trend: '+0,3 p.p.',         direction: 'down'    },
      goalPct:    '78%',
      goalHelper: 'Maio / 2026',
    },
    quarterly: {
      revenue:    { value: 'R$ 3.910.500', trend: '+18% vs tri. ant.', direction: 'up'      },
      orders:     { value: '11.204',       trend: '+14% vs tri. ant.', direction: 'up'      },
      avgTicket:  { value: 'R$ 349',       trend: '+3% vs tri. ant.',  direction: 'up'      },
      defaulting: { value: '3,7%',         trend: '-0,5 p.p.',         direction: 'up'      },
      goalPct:    '81%',
      goalHelper: '1º Trimestre 2026',
    },
  };

  private readonly transactions: Transaction[] = [
    { id: '#10042', client: 'Indústria Norte SA',  value: 'R$ 8.740',  status: 'Enviado',   date: '30/05/2026' },
    { id: '#10041', client: 'Comercial Sul Ltda',  value: 'R$ 1.230',  status: 'Pendente',  date: '29/05/2026' },
    { id: '#10040', client: 'Grupo Leste Corp',    value: 'R$ 45.000', status: 'Aprovado',  date: '28/05/2026' },
    { id: '#10039', client: 'Distribuidora Oeste', value: 'R$ 3.100',  status: 'Cancelado', date: '27/05/2026' },
    { id: '#10038', client: 'TechSupply Brasil',   value: 'R$ 12.890', status: 'Aprovado',  date: '26/05/2026' },
  ];

  private get kpis(): KpiSet {
    return this.kpiData[this.period] ?? this.kpiData.monthly;
  }

  private statusBadge(status: Transaction['status']): string {
    const map: Record<string, string> = {
      'Aprovado':  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
      'Pendente':  'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
      'Enviado':   'bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300',
      'Cancelado': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    };
    return map[status] ?? '';
  }

  render() {
    const k = this.kpis;

    return html`
<div class="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans">
  <div class="max-w-7xl mx-auto px-6 py-8">

    <!-- Banner de fechamento -->
    <groupnotifyuser--ml-notify-banner
      type="warning"
      .visible=${this.bannerVisible}
      dismissible="true"
      @dismiss=${() => { this.bannerVisible = false; }}
    >
      <Title>Processamento de fechamento em andamento</Title>
      <Message>O fechamento contábil de maio/2026 está sendo processado. Alguns valores podem apresentar variações até a conclusão.</Message>
      <Action>Ver status</Action>
    </groupnotifyuser--ml-notify-banner>

    ${this.bannerVisible ? html`<div class="mt-4"></div>` : html``}

    <!-- Cabeçalho + seletor de período -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard Executivo</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Visão geral de desempenho comercial</p>
      </div>
      <groupselectone--ml-segmented-control
        value="${this.period}"
        name="period"
        @change=${(e: CustomEvent) => { this.period = e.detail.value; }}
      >
        <Item value="weekly">Semana</Item>
        <Item value="monthly">Mês</Item>
        <Item value="quarterly">Trimestre</Item>
      </groupselectone--ml-segmented-control>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

      <groupviewmetric--ml-metric-big-number>
        <Label>Receita</Label>
        <Value>${k.revenue.value}</Value>
        <Trend direction="${k.revenue.direction}">${k.revenue.trend}</Trend>
      </groupviewmetric--ml-metric-big-number>

      <groupviewmetric--ml-metric-big-number>
        <Label>Pedidos</Label>
        <Value>${k.orders.value}</Value>
        <Trend direction="${k.orders.direction}">${k.orders.trend}</Trend>
      </groupviewmetric--ml-metric-big-number>

      <groupviewmetric--ml-metric-big-number>
        <Label>Ticket Médio</Label>
        <Value>${k.avgTicket.value}</Value>
        <Trend direction="${k.avgTicket.direction}">${k.avgTicket.trend}</Trend>
      </groupviewmetric--ml-metric-big-number>

      <groupviewmetric--ml-metric-big-number>
        <Label>Inadimplência</Label>
        <Value>${k.defaulting.value}</Value>
        <Trend direction="${k.defaulting.direction}">${k.defaulting.trend}</Trend>
      </groupviewmetric--ml-metric-big-number>

    </div>

    <!-- Gauge + Gráfico de área -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

      <groupviewmetric--ml-metric-gauge>
        <Label>Meta de Vendas</Label>
        <Value>${k.goalPct}</Value>
        <Trend direction="up">da meta atingida</Trend>
        <Helper>${k.goalHelper}</Helper>
      </groupviewmetric--ml-metric-gauge>

      <div class="lg:col-span-2">
        <groupviewchart--ml-area-chart show-legend="false">
          <Label>Evolução de Receita — últimos 12 meses (R$ mil)</Label>
          <Series name="Receita" color="#0ea5e9">
            <Point label="Jun/25" value="890"></Point>
            <Point label="Jul/25" value="940"></Point>
            <Point label="Ago/25" value="870"></Point>
            <Point label="Set/25" value="1010"></Point>
            <Point label="Out/25" value="1120"></Point>
            <Point label="Nov/25" value="980"></Point>
            <Point label="Dez/25" value="1340"></Point>
            <Point label="Jan/26" value="780"></Point>
            <Point label="Fev/26" value="910"></Point>
            <Point label="Mar/26" value="1050"></Point>
            <Point label="Abr/26" value="1140"></Point>
            <Point label="Mai/26" value="1285"></Point>
          </Series>
        </groupviewchart--ml-area-chart>
      </div>

    </div>

    <!-- Gráfico de barras por canal -->
    <div class="mb-6">
      <groupviewchart--ml-bar-chart show-legend="true" show-values="true">
        <Label>Vendas por Canal — jan a mai/2026 (R$ mil)</Label>
        <Series name="Online" color="#0ea5e9">
          <Point label="Jan" value="320"></Point>
          <Point label="Fev" value="380"></Point>
          <Point label="Mar" value="410"></Point>
          <Point label="Abr" value="460"></Point>
          <Point label="Mai" value="512"></Point>
        </Series>
        <Series name="Loja Física" color="#8b5cf6">
          <Point label="Jan" value="240"></Point>
          <Point label="Fev" value="270"></Point>
          <Point label="Mar" value="290"></Point>
          <Point label="Abr" value="310"></Point>
          <Point label="Mai" value="348"></Point>
        </Series>
        <Series name="Parceiros" color="#10b981">
          <Point label="Jan" value="220"></Point>
          <Point label="Fev" value="260"></Point>
          <Point label="Mar" value="350"></Point>
          <Point label="Abr" value="370"></Point>
          <Point label="Mai" value="425"></Point>
        </Series>
      </groupviewchart--ml-bar-chart>
    </div>

    <!-- Últimas transações -->
    <groupviewtable--ml-data-table-minimal
      page="1"
      page-size="5"
      total-items="5"
      is-editing="false"
    >
      <Caption>Últimas Transações</Caption>
      <TableHeader>
        <TableRow>
          <TableHead>Pedido</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Data</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        ${this.transactions.map(t => html`
        <TableRow>
          <TableCell><span class="font-mono text-sm text-slate-600 dark:text-slate-300">${t.id}</span></TableCell>
          <TableCell>${t.client}</TableCell>
          <TableCell><span class="font-medium">${t.value}</span></TableCell>
          <TableCell>
            <span class="px-2 py-0.5 rounded-full text-xs font-medium ${this.statusBadge(t.status)}">${t.status}</span>
          </TableCell>
          <TableCell><span class="text-sm text-slate-500 dark:text-slate-400">${t.date}</span></TableCell>
        </TableRow>
        `)}
      </TableBody>
    </groupviewtable--ml-data-table-minimal>

  </div>
</div>
    `;
  }
}
