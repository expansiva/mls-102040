/// <mls fileReference="_102040_/l2/molecules/groupviewtable/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupviewtable/ml-advanced-data-table';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table-minimal';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table-select';
import '/_102040_/l2/molecules/groupviewtable/ml-grouping-table';
import '/_102040_/l2/molecules/groupviewtable/ml-inline-edit-table';
import '/_102040_/l2/molecules/groupviewtable/ml-lazy-record-detail-table';
import '/_102040_/l2/molecules/groupviewtable/ml-lcrud-detail-grid';
import '/_102040_/l2/molecules/groupviewtable/ml-pivot-table';
import '/_102040_/l2/molecules/groupviewtable/ml-responsive-data-table';
import '/_102040_/l2/molecules/groupviewtable/ml-responsive-table';
import '/_102040_/l2/molecules/groupviewtable/ml-view-table';

@customElement('molecules--groupviewtable--index-102040')
export class GroupViewTableIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardAdvanced = '';
  @state() private cardData = '';
  @state() private cardMinimal = '';
  @state() private cardSelect = '0';
  @state() private cardGrouping = '';
  @state() private cardInlineEdit = '';
  @state() private cardLazyDetail = '';
  @state() private cardLcrud = '';
  @state() private cardPivot = '';
  @state() private cardRespData = '';
  @state() private cardResponsive = '';
  @state() private cardView = '';

  // ===========================================================================
  // HERO
  // ===========================================================================
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupViewTable
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          View Table
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Visualize dados estruturados em formato tabular. O grupo oferece implementações para listagem,
          seleção, edição inline, detalhe sob demanda, agrupamento, pivot e adaptação responsiva em cartões.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SHOWCASE CARDS
  // ===========================================================================
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto flex flex-col gap-5">

          <!-- ml-advanced-data-table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Advanced Data Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-advanced-data-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Tabela completa com ordenação, paginação e recursos avançados de listagem</p>
              <groupviewtable--ml-advanced-data-table
                name="card-advanced"
                .value=${this.cardAdvanced}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardAdvanced = e.detail.value; }}
              >
                <Caption>Pedidos recentes</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="id" sortable>ID</TableHead>
                    <TableHead key="cliente" sortable>Cliente</TableHead>
                    <TableHead key="total" sortable>Total</TableHead>
                    <TableHead key="status">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#1042</TableCell>
                    <TableCell>Ana Souza</TableCell>
                    <TableCell sort-value="320.00">R$ 320,00</TableCell>
                    <TableCell>Concluído</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>#1043</TableCell>
                    <TableCell>Bruno Lima</TableCell>
                    <TableCell sort-value="89.50">R$ 89,50</TableCell>
                    <TableCell>Pendente</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>#1044</TableCell>
                    <TableCell>Carla Dias</TableCell>
                    <TableCell sort-value="150.00">R$ 150,00</TableCell>
                    <TableCell>Enviado</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>Nenhum pedido encontrado</Empty>
                <Loading>Carregando pedidos…</Loading>
              </groupviewtable--ml-advanced-data-table>
            </div>
          </div>

          <!-- ml-data-table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Data Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-data-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Tabela de dados padrão com ordenação e paginação internas</p>
              <groupviewtable--ml-data-table
                name="card-data"
                .value=${this.cardData}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardData = e.detail.value; }}
              >
                <Caption>Lista de produtos</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="sku" sortable>SKU</TableHead>
                    <TableHead key="nome" sortable>Nome</TableHead>
                    <TableHead key="preco" sortable>Preço</TableHead>
                    <TableHead key="estoque">Estoque</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>SKU-01</TableCell>
                    <TableCell>Caderno A5</TableCell>
                    <TableCell sort-value="24.90">R$ 24,90</TableCell>
                    <TableCell>120</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SKU-02</TableCell>
                    <TableCell>Caneta gel</TableCell>
                    <TableCell sort-value="6.50">R$ 6,50</TableCell>
                    <TableCell>340</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SKU-03</TableCell>
                    <TableCell>Mochila escolar</TableCell>
                    <TableCell sort-value="189.00">R$ 189,00</TableCell>
                    <TableCell>45</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>Nenhum produto cadastrado</Empty>
                <Loading>Carregando produtos…</Loading>
              </groupviewtable--ml-data-table>
            </div>
          </div>

          <!-- ml-data-table-minimal -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Data Table Minimal</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-data-table-minimal</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Variante enxuta para listagens simples sem chrome extra</p>
              <groupviewtable--ml-data-table-minimal
                name="card-minimal"
                .value=${this.cardMinimal}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardMinimal = e.detail.value; }}
              >
                <Caption>Contatos</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="nome" sortable>Nome</TableHead>
                    <TableHead key="email">E-mail</TableHead>
                    <TableHead key="cargo">Cargo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Diego Alves</TableCell>
                    <TableCell>diego@empresa.com</TableCell>
                    <TableCell>Analista</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Elena Rocha</TableCell>
                    <TableCell>elena@empresa.com</TableCell>
                    <TableCell>Gerente</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>Sem contatos</Empty>
                <Loading>Carregando…</Loading>
              </groupviewtable--ml-data-table-minimal>
            </div>
          </div>

          <!-- ml-data-table-select -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Data Table Select</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-data-table-select</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Tabela com coluna de seleção por checkbox para ações em lote</p>
              <groupviewtable--ml-data-table-select
                name="card-select"
                .value=${this.cardSelect}
                .isEditing=${true}
                selectable
                @change=${(e: CustomEvent) => { this.cardSelect = e.detail.value; }}
              >
                <Caption>Selecionar itens</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="item" sortable>Item</TableHead>
                    <TableHead key="qtd" sortable>Qtd</TableHead>
                    <TableHead key="valor" sortable>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Teclado mecânico</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell sort-value="450">R$ 450,00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mouse sem fio</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell sort-value="199">R$ 199,00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Monitor 27"</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell sort-value="1299">R$ 1.299,00</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>Nenhum item</Empty>
                <Loading>Carregando itens…</Loading>
              </groupviewtable--ml-data-table-select>
            </div>
          </div>

          <!-- ml-grouping-table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-sky-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Grouping Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-grouping-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Agrupa linhas por categoria para leitura hierárquica dos dados</p>
              <groupviewtable--ml-grouping-table
                name="card-grouping"
                .value=${this.cardGrouping}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardGrouping = e.detail.value; }}
              >
                <Caption>Vendas por região</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="regiao" sortable>Região</TableHead>
                    <TableHead key="vendedor" sortable>Vendedor</TableHead>
                    <TableHead key="meta" sortable>Meta</TableHead>
                    <TableHead key="realizado" sortable>Realizado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Sul</TableCell>
                    <TableCell>Fernanda</TableCell>
                    <TableCell sort-value="50000">R$ 50.000</TableCell>
                    <TableCell sort-value="48200">R$ 48.200</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sul</TableCell>
                    <TableCell>Gustavo</TableCell>
                    <TableCell sort-value="40000">R$ 40.000</TableCell>
                    <TableCell sort-value="41500">R$ 41.500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Norte</TableCell>
                    <TableCell>Helena</TableCell>
                    <TableCell sort-value="35000">R$ 35.000</TableCell>
                    <TableCell sort-value="30100">R$ 30.100</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>Sem vendas no período</Empty>
                <Loading>Agrupando…</Loading>
              </groupviewtable--ml-grouping-table>
            </div>
          </div>

          <!-- ml-inline-edit-table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-indigo-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Inline Edit Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-inline-edit-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Permite editar células diretamente na grade sem sair da listagem</p>
              <groupviewtable--ml-inline-edit-table
                name="card-inline-edit"
                .value=${this.cardInlineEdit}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardInlineEdit = e.detail.value; }}
              >
                <Caption>Planilha de preços</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="produto" sortable>Produto</TableHead>
                    <TableHead key="custo" sortable>Custo</TableHead>
                    <TableHead key="venda" sortable>Venda</TableHead>
                    <TableHead key="margem">Margem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Camiseta básica</TableCell>
                    <TableCell sort-value="28">R$ 28,00</TableCell>
                    <TableCell sort-value="59.90">R$ 59,90</TableCell>
                    <TableCell>53%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Calça jeans</TableCell>
                    <TableCell sort-value="70">R$ 70,00</TableCell>
                    <TableCell sort-value="149.90">R$ 149,90</TableCell>
                    <TableCell>53%</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>Nenhum preço definido</Empty>
                <Loading>Carregando planilha…</Loading>
              </groupviewtable--ml-inline-edit-table>
            </div>
          </div>

          <!-- ml-lazy-record-detail-table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-purple-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Lazy Record Detail Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-lazy-record-detail-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Expande o detalhe do registro sob demanda ao clicar na linha</p>
              <groupviewtable--ml-lazy-record-detail-table
                name="card-lazy-detail"
                .value=${this.cardLazyDetail}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardLazyDetail = e.detail.value; }}
              >
                <Caption>Ordens de serviço</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="os" sortable>OS</TableHead>
                    <TableHead key="cliente" sortable>Cliente</TableHead>
                    <TableHead key="abertura" sortable>Abertura</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#OS-210</TableCell>
                    <TableCell>Igor Martins</TableCell>
                    <TableCell sort-value="2026-07-12">12/07/2026</TableCell>
                    <Detail label="Igor Martins">
                      Prioridade alta · Técnico: Paulo · Peça sob encomenda
                    </Detail>
                  </TableRow>
                  <TableRow>
                    <TableCell>#OS-211</TableCell>
                    <TableCell>Julia Nunes</TableCell>
                    <TableCell sort-value="2026-07-18">18/07/2026</TableCell>
                    <Detail label="Julia Nunes">
                      Aguardando diagnóstico · Unidade Centro
                    </Detail>
                  </TableRow>
                </TableBody>
                <Empty>Nenhuma OS aberta</Empty>
                <Loading>Carregando ordens…</Loading>
              </groupviewtable--ml-lazy-record-detail-table>
            </div>
          </div>

          <!-- ml-lcrud-detail-grid -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-teal-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">LCRUD Detail Grid</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-lcrud-detail-grid</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Grade orientada a fluxos LCRUD com cena de detalhe do registro</p>
              <groupviewtable--ml-lcrud-detail-grid
                name="card-lcrud"
                .value=${this.cardLcrud}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardLcrud = e.detail.value; }}
              >
                <Caption>Cadastro de clientes</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="codigo" sortable>Código</TableHead>
                    <TableHead key="nome" sortable>Nome</TableHead>
                    <TableHead key="cidade" sortable>Cidade</TableHead>
                    <TableHead key="ativo">Ativo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>C-001</TableCell>
                    <TableCell>Mercado Bom Preço</TableCell>
                    <TableCell>Curitiba</TableCell>
                    <TableCell>Sim</TableCell>
                    <Detail label="Mercado Bom Preço">
                      CNPJ 12.345.678/0001-90 · Limite R$ 25.000 · Contato: (41) 3333-0000
                    </Detail>
                  </TableRow>
                  <TableRow>
                    <TableCell>C-002</TableCell>
                    <TableCell>Padaria Central</TableCell>
                    <TableCell>Londrina</TableCell>
                    <TableCell>Sim</TableCell>
                    <Detail label="Padaria Central">
                      CNPJ 98.765.432/0001-10 · Limite R$ 8.000 · Contato: (43) 3222-1111
                    </Detail>
                  </TableRow>
                </TableBody>
                <Empty>Nenhum cliente</Empty>
                <Loading>Carregando clientes…</Loading>
              </groupviewtable--ml-lcrud-detail-grid>
            </div>
          </div>

          <!-- ml-pivot-table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-orange-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Pivot Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-pivot-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Cruza dimensões em linhas e colunas para análise agregada</p>
              <groupviewtable--ml-pivot-table
                name="card-pivot"
                .value=${this.cardPivot}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardPivot = e.detail.value; }}
              >
                <Caption>Receita por canal × trimestre</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="canal" sortable>Canal</TableHead>
                    <TableHead key="q1" sortable>Q1</TableHead>
                    <TableHead key="q2" sortable>Q2</TableHead>
                    <TableHead key="q3" sortable>Q3</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Online</TableCell>
                    <TableCell sort-value="120">120k</TableCell>
                    <TableCell sort-value="145">145k</TableCell>
                    <TableCell sort-value="160">160k</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Loja</TableCell>
                    <TableCell sort-value="80">80k</TableCell>
                    <TableCell sort-value="92">92k</TableCell>
                    <TableCell sort-value="88">88k</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Parceiros</TableCell>
                    <TableCell sort-value="40">40k</TableCell>
                    <TableCell sort-value="55">55k</TableCell>
                    <TableCell sort-value="61">61k</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>Sem dados para pivot</Empty>
                <Loading>Calculando…</Loading>
              </groupviewtable--ml-pivot-table>
            </div>
          </div>

          <!-- ml-responsive-data-table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-pink-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Responsive Data Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-responsive-data-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Tabela de dados que se reorganiza em viewports estreitos</p>
              <groupviewtable--ml-responsive-data-table
                name="card-resp-data"
                .value=${this.cardRespData}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardRespData = e.detail.value; }}
              >
                <Caption>Entregas do dia</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="rota" sortable>Rota</TableHead>
                    <TableHead key="motorista" sortable>Motorista</TableHead>
                    <TableHead key="paradas" sortable>Paradas</TableHead>
                    <TableHead key="status">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Rota A</TableCell>
                    <TableCell>Lucas</TableCell>
                    <TableCell sort-value="12">12</TableCell>
                    <TableCell>Em andamento</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rota B</TableCell>
                    <TableCell>Marina</TableCell>
                    <TableCell sort-value="8">8</TableCell>
                    <TableCell>Concluída</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>Sem entregas</Empty>
                <Loading>Carregando rotas…</Loading>
              </groupviewtable--ml-responsive-data-table>
            </div>
          </div>

          <!-- ml-responsive-table (new) -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Responsive Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-responsive-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Em telas largas renderiza tabela; em mobile cada registro vira um cartão</p>
              <groupviewtable--ml-responsive-table
                name="card-responsive"
                .value=${this.cardResponsive}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardResponsive = e.detail.value; }}
              >
                <Caption>Funcionários</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="matricula" sortable>Matrícula</TableHead>
                    <TableHead key="nome" sortable>Nome</TableHead>
                    <TableHead key="departamento" sortable>Departamento</TableHead>
                    <TableHead key="admissao" sortable>Admissão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>M-1001</TableCell>
                    <TableCell>Olivia Costa</TableCell>
                    <TableCell>Engenharia</TableCell>
                    <TableCell sort-value="2022-03-15">15/03/2022</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>M-1002</TableCell>
                    <TableCell>Pedro Santos</TableCell>
                    <TableCell>Comercial</TableCell>
                    <TableCell sort-value="2023-08-01">01/08/2023</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>M-1003</TableCell>
                    <TableCell>Quésia Prado</TableCell>
                    <TableCell>Financeiro</TableCell>
                    <TableCell sort-value="2021-11-20">20/11/2021</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>Nenhum funcionário encontrado</Empty>
                <Loading>Carregando funcionários…</Loading>
              </groupviewtable--ml-responsive-table>
            </div>
          </div>

          <!-- ml-view-table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">View Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-view-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Tabela de visualização somente leitura para consulta de registros</p>
              <groupviewtable--ml-view-table
                name="card-view"
                .value=${this.cardView}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardView = e.detail.value; }}
              >
                <Caption>Histórico de acessos</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="usuario" sortable>Usuário</TableHead>
                    <TableHead key="ip">IP</TableHead>
                    <TableHead key="quando" sortable>Quando</TableHead>
                    <TableHead key="resultado">Resultado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>admin</TableCell>
                    <TableCell>192.168.0.10</TableCell>
                    <TableCell sort-value="2026-08-06T09:12:00">06/08 09:12</TableCell>
                    <TableCell>OK</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>operador</TableCell>
                    <TableCell>192.168.0.44</TableCell>
                    <TableCell sort-value="2026-08-06T08:55:00">06/08 08:55</TableCell>
                    <TableCell>OK</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>guest</TableCell>
                    <TableCell>10.0.0.5</TableCell>
                    <TableCell sort-value="2026-08-05T22:01:00">05/08 22:01</TableCell>
                    <TableCell>Negado</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>Sem registros de acesso</Empty>
                <Loading>Carregando histórico…</Loading>
              </groupviewtable--ml-view-table>
            </div>
          </div>

        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  // ===========================================================================
  private renderReferenceTable(): TemplateResult {
    const headers = [
      { label: 'Advanced', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Data', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Minimal', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Select', cls: 'text-rose-600 dark:text-rose-400' },
      { label: 'Grouping', cls: 'text-sky-600 dark:text-sky-400' },
      { label: 'Inline Edit', cls: 'text-indigo-600 dark:text-indigo-400' },
      { label: 'Lazy Detail', cls: 'text-purple-600 dark:text-purple-400' },
      { label: 'LCRUD', cls: 'text-teal-600 dark:text-teal-400' },
      { label: 'Pivot', cls: 'text-orange-600 dark:text-orange-400' },
      { label: 'Resp. Data', cls: 'text-pink-600 dark:text-pink-400' },
      { label: 'Responsive', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'View', cls: 'text-emerald-600 dark:text-emerald-400' },
    ];

    type Row = {
      scenario: string;
      advanced: boolean;
      data: boolean;
      minimal: boolean;
      select: boolean;
      grouping: boolean;
      inlineEdit: boolean;
      lazyDetail: boolean;
      lcrud: boolean;
      pivot: boolean;
      respData: boolean;
      responsive: boolean;
      view: boolean;
    };

    const rows: Row[] = [
      {
        scenario: 'Listagem geral com ordenação e paginação',
        advanced: true, data: true, minimal: true, select: true,
        grouping: true, inlineEdit: true, lazyDetail: true, lcrud: true,
        pivot: true, respData: true, responsive: true, view: true,
      },
      {
        scenario: 'Seleção múltipla com checkboxes para ações em lote',
        advanced: true, data: false, minimal: false, select: true,
        grouping: false, inlineEdit: false, lazyDetail: false, lcrud: true,
        pivot: false, respData: false, responsive: false, view: false,
      },
      {
        scenario: 'Edição de valores direto nas células',
        advanced: false, data: false, minimal: false, select: false,
        grouping: false, inlineEdit: true, lazyDetail: false, lcrud: false,
        pivot: false, respData: false, responsive: false, view: false,
      },
      {
        scenario: 'Detalhe do registro sob demanda (expandir / cena)',
        advanced: false, data: false, minimal: false, select: false,
        grouping: false, inlineEdit: false, lazyDetail: true, lcrud: true,
        pivot: false, respData: false, responsive: false, view: false,
      },
      {
        scenario: 'Agrupar linhas por categoria ou dimensão',
        advanced: false, data: false, minimal: false, select: false,
        grouping: true, inlineEdit: false, lazyDetail: false, lcrud: false,
        pivot: true, respData: false, responsive: false, view: false,
      },
      {
        scenario: 'Análise cruzada (pivot) de métricas',
        advanced: false, data: false, minimal: false, select: false,
        grouping: false, inlineEdit: false, lazyDetail: false, lcrud: false,
        pivot: true, respData: false, responsive: false, view: false,
      },
      {
        scenario: 'Mobile: cada linha vira um cartão legível',
        advanced: false, data: false, minimal: false, select: false,
        grouping: false, inlineEdit: false, lazyDetail: false, lcrud: false,
        pivot: false, respData: true, responsive: true, view: false,
      },
      {
        scenario: 'Fluxo LCRUD com navegação para detalhe do registro',
        advanced: false, data: false, minimal: false, select: false,
        grouping: false, inlineEdit: false, lazyDetail: false, lcrud: true,
        pivot: false, respData: false, responsive: false, view: false,
      },
      {
        scenario: 'Consulta somente leitura, chrome mínimo',
        advanced: false, data: false, minimal: true, select: false,
        grouping: false, inlineEdit: false, lazyDetail: false, lcrud: false,
        pivot: false, respData: false, responsive: false, view: true,
      },
      {
        scenario: 'Recursos avançados de listagem em um único componente',
        advanced: true, data: false, minimal: false, select: false,
        grouping: false, inlineEdit: false, lazyDetail: false, lcrud: false,
        pivot: false, respData: false, responsive: false, view: false,
      },
    ];

    const flags = (row: Row) => [
      row.advanced, row.data, row.minimal, row.select,
      row.grouping, row.inlineEdit, row.lazyDetail, row.lcrud,
      row.pivot, row.respData, row.responsive, row.view,
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Referência rápida</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Escolha a implementação conforme o modo de interação: listagem simples, seleção, edição inline,
            detalhe sob demanda, agrupamento, pivot ou adaptação responsiva em cartões no mobile.
          </p>
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm overflow-x-auto">
            <table class="w-full text-sm min-w-[64rem]">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <th class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-1/4">Cenário</th>
                  ${headers.map(h => html`
                    <th class="px-3 py-3.5 text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${h.cls}">${h.label}</th>
                  `)}
                </tr>
              </thead>
              <tbody>
                ${rows.map((row, i) => html`
                  <tr class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0">
                    <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                    ${flags(row).map(ok => html`
                      <td class="px-3 py-3.5 text-center">
                        ${ok
                          ? html`<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>`
                          : html`<span class="text-slate-200 dark:text-slate-700 text-sm">—</span>`}
                      </td>
                    `)}
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================
  render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen bg-slate-100 dark:bg-slate-950">
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }
}
