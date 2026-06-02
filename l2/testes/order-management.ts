/// <mls fileReference="_102040_/l2/testes/order-management.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupsearchcontent/ml-search-bar';
import '/_102040_/l2/molecules/groupenterdateinterval/ml-date-range-dual-calendar';
import '/_102040_/l2/molecules/groupselectmany/ml-multi-select-dropdown';
import '/_102040_/l2/molecules/groupselectone/ml-select-dropdown';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table';
import '/_102040_/l2/molecules/groupnotifyuser/ml-notify-banner';
import '/_102040_/l2/molecules/groupviewchart/ml-line-chart';
import '/_102040_/l2/molecules/groupnavigatesection/ml-tabs';

// =============================================================================
// TYPES
// =============================================================================
type OrderStatus = 'Pendente' | 'Aprovado' | 'Em trânsito' | 'Concluído' | 'Cancelado';

interface Order {
  id: string;
  client: string;
  value: number;
  valueFormatted: string;
  status: OrderStatus;
  date: string;
  dateISO: string;
  items: number;
}

// =============================================================================
// COMPONENT
// =============================================================================
@customElement('testes--order-management')
export class OrderManagement extends StateLitElement {

  // ── Filtros e UI ───────────────────────────────────────────────────────────
  @state() activeTab = 'all';
  @state() search = '';
  @state() statusFilter = '';
  @state() sortBy = 'recent';
  @state() filterStartDate = '';
  @state() filterEndDate = '';
  @state() page = 1;
  @state() bannerVisible = true;

  private readonly pageSize = 8;

  // ── Dataset ────────────────────────────────────────────────────────────────
  private readonly allOrders: Order[] = [
    { id: '#10042', client: 'Indústria Norte SA',    value: 8740,  valueFormatted: 'R$ 8.740,00',  status: 'Em trânsito', date: '30/05/2026', dateISO: '2026-05-30', items: 12 },
    { id: '#10041', client: 'Comercial Sul Ltda',    value: 1230,  valueFormatted: 'R$ 1.230,00',  status: 'Pendente',    date: '29/05/2026', dateISO: '2026-05-29', items: 3  },
    { id: '#10040', client: 'Grupo Leste Corp',      value: 45000, valueFormatted: 'R$ 45.000,00', status: 'Aprovado',    date: '28/05/2026', dateISO: '2026-05-28', items: 87 },
    { id: '#10039', client: 'Distribuidora Oeste',   value: 3100,  valueFormatted: 'R$ 3.100,00',  status: 'Cancelado',   date: '27/05/2026', dateISO: '2026-05-27', items: 5  },
    { id: '#10038', client: 'TechSupply Brasil',     value: 12890, valueFormatted: 'R$ 12.890,00', status: 'Concluído',   date: '26/05/2026', dateISO: '2026-05-26', items: 22 },
    { id: '#10037', client: 'Atacado Central',       value: 6750,  valueFormatted: 'R$ 6.750,00',  status: 'Concluído',   date: '25/05/2026', dateISO: '2026-05-25', items: 14 },
    { id: '#10036', client: 'Prime Materiais SA',    value: 2400,  valueFormatted: 'R$ 2.400,00',  status: 'Em trânsito', date: '24/05/2026', dateISO: '2026-05-24', items: 8  },
    { id: '#10035', client: 'Metalúrgica Horizonte', value: 19200, valueFormatted: 'R$ 19.200,00', status: 'Concluído',   date: '23/05/2026', dateISO: '2026-05-23', items: 31 },
    { id: '#10034', client: 'Logística Express',     value: 880,   valueFormatted: 'R$ 880,00',    status: 'Pendente',    date: '22/05/2026', dateISO: '2026-05-22', items: 2  },
    { id: '#10033', client: 'Varejo Premium Ltda',   value: 5320,  valueFormatted: 'R$ 5.320,00',  status: 'Aprovado',    date: '21/05/2026', dateISO: '2026-05-21', items: 9  },
    { id: '#10032', client: 'Construção Delta',      value: 34600, valueFormatted: 'R$ 34.600,00', status: 'Em trânsito', date: '20/05/2026', dateISO: '2026-05-20', items: 56 },
    { id: '#10031', client: 'Farmácia Central',      value: 1100,  valueFormatted: 'R$ 1.100,00',  status: 'Concluído',   date: '18/05/2026', dateISO: '2026-05-18', items: 4  },
    { id: '#10030', client: 'Supermercados Alfa',    value: 27400, valueFormatted: 'R$ 27.400,00', status: 'Cancelado',   date: '16/05/2026', dateISO: '2026-05-16', items: 48 },
    { id: '#10029', client: 'Agro Campo Aberto',     value: 9870,  valueFormatted: 'R$ 9.870,00',  status: 'Concluído',   date: '14/05/2026', dateISO: '2026-05-14', items: 17 },
    { id: '#10028', client: 'Transportadora Leal',   value: 4250,  valueFormatted: 'R$ 4.250,00',  status: 'Pendente',    date: '12/05/2026', dateISO: '2026-05-12', items: 7  },
  ];

  // ── Dados do gráfico (volume de pedidos — últimos 30 dias) ─────────────────
  private readonly volumePoints = [
    { label: '03/05', value: 3 }, { label: '04/05', value: 5 }, { label: '05/05', value: 2 },
    { label: '06/05', value: 4 }, { label: '07/05', value: 6 }, { label: '08/05', value: 3 },
    { label: '09/05', value: 1 }, { label: '10/05', value: 4 }, { label: '11/05', value: 7 },
    { label: '12/05', value: 5 }, { label: '13/05', value: 3 }, { label: '14/05', value: 6 },
    { label: '15/05', value: 4 }, { label: '16/05', value: 8 }, { label: '17/05', value: 5 },
    { label: '18/05', value: 3 }, { label: '19/05', value: 6 }, { label: '20/05', value: 9 },
    { label: '21/05', value: 4 }, { label: '22/05', value: 5 }, { label: '23/05', value: 7 },
    { label: '24/05', value: 6 }, { label: '25/05', value: 4 }, { label: '26/05', value: 8 },
    { label: '27/05', value: 5 }, { label: '28/05', value: 9 }, { label: '29/05', value: 6 },
    { label: '30/05', value: 7 }, { label: '31/05', value: 4 }, { label: '01/06', value: 5 },
  ];

  // ── Dados filtrados ────────────────────────────────────────────────────────
  private get filteredOrders(): Order[] {
    let result = [...this.allOrders];

    // Filtro de aba
    if (this.activeTab === 'pending') {
      result = result.filter(o => o.status === 'Pendente');
    } else if (this.activeTab === 'transit') {
      result = result.filter(o => o.status === 'Em trânsito' || o.status === 'Aprovado');
    } else if (this.activeTab === 'done') {
      result = result.filter(o => o.status === 'Concluído');
    }

    // Filtro de busca
    const q = this.search.trim().toLowerCase();
    if (q) {
      result = result.filter(o =>
        o.id.toLowerCase().includes(q) || o.client.toLowerCase().includes(q)
      );
    }

    // Filtro de status (multi-select)
    const selected = this.statusFilter.split(',').filter(Boolean);
    if (selected.length > 0) {
      result = result.filter(o => selected.includes(this.toStatusKey(o.status)));
    }

    // Filtro de período
    if (this.filterStartDate) {
      result = result.filter(o => o.dateISO >= this.filterStartDate);
    }
    if (this.filterEndDate) {
      result = result.filter(o => o.dateISO <= this.filterEndDate);
    }

    // Ordenação
    if (this.sortBy === 'value-desc') {
      result = result.sort((a, b) => b.value - a.value);
    } else if (this.sortBy === 'client') {
      result = result.sort((a, b) => a.client.localeCompare(b.client));
    }
    // default: 'recent' — já ordenado por data desc no dataset

    return result;
  }

  private get visibleOrders(): Order[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  private toStatusKey(status: OrderStatus): string {
    const map: Record<string, string> = {
      'Pendente':    'pending',
      'Aprovado':    'approved',
      'Em trânsito': 'transit',
      'Concluído':   'done',
      'Cancelado':   'cancelled',
    };
    return map[status] ?? status;
  }

  private countByTab(tab: string): number {
    if (tab === 'all')     return this.allOrders.length;
    if (tab === 'pending') return this.allOrders.filter(o => o.status === 'Pendente').length;
    if (tab === 'transit') return this.allOrders.filter(o => o.status === 'Em trânsito' || o.status === 'Aprovado').length;
    if (tab === 'done')    return this.allOrders.filter(o => o.status === 'Concluído').length;
    return 0;
  }

  private statusBadge(status: OrderStatus): string {
    const map: Record<string, string> = {
      'Aprovado':    'bg-sky-100    text-sky-700    dark:bg-sky-900    dark:text-sky-300',
      'Pendente':    'bg-amber-100  text-amber-700  dark:bg-amber-900  dark:text-amber-300',
      'Em trânsito': 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
      'Concluído':   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
      'Cancelado':   'bg-red-100    text-red-700    dark:bg-red-900    dark:text-red-300',
    };
    return map[status] ?? '';
  }

  private lateInTransit(): number {
    // Pedidos em trânsito há mais de 5 dias (base: 02/06/2026)
    return this.allOrders.filter(o =>
      (o.status === 'Em trânsito') && (o.dateISO <= '2026-05-27')
    ).length;
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  render() {
    const total     = this.filteredOrders.length;
    const lateCount = this.lateInTransit();

    return html`
<div class="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans">
  <div class="max-w-7xl mx-auto px-6 py-8">

    <!-- Banner de atraso -->
    <groupnotifyuser--ml-notify-banner
      type="warning"
      .visible=${this.bannerVisible && lateCount > 0}
      dismissible="true"
      @dismiss=${() => { this.bannerVisible = false; }}
    >
      <Title>Atenção: pedidos com entrega atrasada</Title>
      <Message>${lateCount} pedido${lateCount > 1 ? 's' : ''} em trânsito com prazo de entrega vencido. Verifique com a transportadora.</Message>
      <Action>Ver pedidos atrasados</Action>
    </groupnotifyuser--ml-notify-banner>

    ${this.bannerVisible && lateCount > 0 ? html`<div class="mt-4"></div>` : html``}

    <!-- Cabeçalho -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Gestão de Pedidos</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${this.allOrders.length} pedidos no período — maio/2026</p>
    </div>

    <!-- Gráfico de volume -->
    <div class="mb-6">
      <groupviewchart--ml-line-chart show-legend="false">
        <Label>Volume de pedidos — últimos 30 dias</Label>
        <Series name="Pedidos" color="#0ea5e9">
          ${this.volumePoints.map(p => html`<Point label="${p.label}" value="${p.value}"></Point>`)}
        </Series>
      </groupviewchart--ml-line-chart>
    </div>

    <!-- Abas -->
    <div class="mb-4">
      <groupnavigatesection--ml-tabs
        value="${this.activeTab}"
        @change=${(e: CustomEvent) => { this.activeTab = e.detail.value; this.page = 1; }}
      >
        <Tab value="all"     title="Todos (${this.countByTab('all')})"></Tab>
        <Tab value="pending" title="Pendentes (${this.countByTab('pending')})"></Tab>
        <Tab value="transit" title="Em trânsito (${this.countByTab('transit')})"></Tab>
        <Tab value="done"    title="Concluídos (${this.countByTab('done')})"></Tab>
      </groupnavigatesection--ml-tabs>
    </div>

    <!-- Filtros -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">

      <groupsearchcontent--ml-search-bar
        value="${this.search}"
        name="search"
        placeholder="Buscar pedido ou cliente..."
        debounce="300"
        @search=${(e: CustomEvent) => { this.search = e.detail.value ?? ''; this.page = 1; }}
        @clear=${() => { this.search = ''; this.page = 1; }}
      >
      </groupsearchcontent--ml-search-bar>

      <groupenterdateinterval--ml-date-range-dual-calendar
        start-date="${this.filterStartDate}"
        end-date="${this.filterEndDate}"
        name="period"
        locale="pt-BR"
        @change=${(e: CustomEvent) => {
          this.filterStartDate = e.detail.startDate ?? '';
          this.filterEndDate   = e.detail.endDate   ?? '';
          this.page = 1;
        }}
      >
        <LabelStart>De</LabelStart>
        <LabelEnd>Até</LabelEnd>
      </groupenterdateinterval--ml-date-range-dual-calendar>

      <groupselectmany--ml-multi-select-dropdown
        value="${this.statusFilter}"
        name="statusFilter"
        placeholder="Filtrar por status"
        searchable="false"
        @change=${(e: CustomEvent) => { this.statusFilter = e.detail.value ?? ''; this.page = 1; }}
      >
        <Label>Status</Label>
        <Item value="pending">Pendente</Item>
        <Item value="approved">Aprovado</Item>
        <Item value="transit">Em trânsito</Item>
        <Item value="done">Concluído</Item>
        <Item value="cancelled">Cancelado</Item>
      </groupselectmany--ml-multi-select-dropdown>

      <groupselectone--ml-select-dropdown
        value="${this.sortBy}"
        name="sortBy"
        @change=${(e: CustomEvent) => { this.sortBy = e.detail.value; this.page = 1; }}
      >
        <Label>Ordenar por</Label>
        <Item value="recent">Mais recente</Item>
        <Item value="value-desc">Maior valor</Item>
        <Item value="client">Cliente A–Z</Item>
      </groupselectone--ml-select-dropdown>

    </div>

    <!-- Resultado -->
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-3">
      ${total} resultado${total !== 1 ? 's' : ''}
      ${this.search ? html` para "<strong class="text-slate-700 dark:text-slate-200">${this.search}</strong>"` : html``}
    </p>

    <!-- Tabela -->
    <groupviewtable--ml-data-table
      page="${this.page}"
      page-size="${this.pageSize}"
      total-items="${total}"
      is-editing="false"
      @page-change=${(e: CustomEvent) => { this.page = e.detail.page; }}
    >
      <Caption>Pedidos</Caption>
      <TableHeader>
        <TableRow>
          <TableHead key="id"     sortable>Pedido</TableHead>
          <TableHead key="client" sortable>Cliente</TableHead>
          <TableHead key="items">Itens</TableHead>
          <TableHead key="value"  sortable>Valor</TableHead>
          <TableHead key="status">Status</TableHead>
          <TableHead key="date"   sortable>Data</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        ${this.visibleOrders.length > 0
          ? this.visibleOrders.map(o => html`
            <TableRow>
              <TableCell><span class="font-mono text-sm text-slate-600 dark:text-slate-300">${o.id}</span></TableCell>
              <TableCell>${o.client}</TableCell>
              <TableCell><span class="text-slate-500 dark:text-slate-400">${o.items}</span></TableCell>
              <TableCell><span class="font-medium text-slate-800 dark:text-slate-100">${o.valueFormatted}</span></TableCell>
              <TableCell>
                <span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium ${this.statusBadge(o.status)}">${o.status}</span>
              </TableCell>
              <TableCell><span class="text-sm text-slate-500 dark:text-slate-400">${o.date}</span></TableCell>
            </TableRow>
          `)
          : html`
            <TableRow>
              <TableCell colspan="6">
                <div class="py-10 text-center text-sm text-slate-400 dark:text-slate-500">
                  Nenhum pedido encontrado com os filtros aplicados.
                </div>
              </TableCell>
            </TableRow>
          `
        }
      </TableBody>
    </groupviewtable--ml-data-table>

  </div>
</div>
    `;
  }
}
