/// <mls fileReference="_102040_/l2/molecules/groupviewtable/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupviewtable/ml-advanced-data-table';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table-minimal';
import '/_102040_/l2/molecules/groupviewtable/ml-grouping-table';
import '/_102040_/l2/molecules/groupviewtable/ml-inline-edit-table';
import '/_102040_/l2/molecules/groupviewtable/ml-lazy-record-detail-table';
import '/_102040_/l2/molecules/groupviewtable/ml-lcrud-detail-grid';
import '/_102040_/l2/molecules/groupviewtable/ml-pivot-table';
import '/_102040_/l2/molecules/groupviewtable/ml-record-form-table';
import '/_102040_/l2/molecules/groupviewtable/ml-responsive-data-table';
import '/_102040_/l2/molecules/groupviewtable/ml-responsive-table';
import '/_102040_/l2/molecules/groupviewtable/ml-side-detail-table';
import '/_102040_/l2/molecules/groupviewtable/ml-view-table';
import { molecules, scenarios } from '/_102040_/l2/molecules/groupviewtable/index.defs.js';
import { renderCatalogReferenceTable } from '/_102020_/l2/aura/molecules/shared/indexReferenceTable.js';

@customElement('molecules--groupviewtable--index-102040')
export class GroupGroupViewTableIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardAdvanced = '0';
  @state() private cardData = '1';
  @state() private cardMinimal = '2';
  @state() private cardGrouping = '0';
  @state() private cardInline = '1';
  @state() private cardLazy = '0';
  @state() private cardLcrud = '2';
  @state() private cardPivot = '1';
  @state() private cardRecordForm = '0';
  @state() private cardResponsiveData = '1';
  @state() private cardResponsive = '0';
  @state() private cardSideDetail = '1';
  @state() private cardView = '0';

  private renderTableSlots(detail = 'Detalhe do registro selecionado: pedido #1048, cliente Ana Silva e total de R$ 284,90.') : TemplateResult {
    return html`
      <Caption>Pedidos recentes</Caption>
      <TableHeader>
        <TableRow><TableHead key="id" sortable>ID</TableHead><TableHead key="cliente" sortable>Cliente</TableHead><TableHead key="status" sortable>Status</TableHead><TableHead key="total" sortable>Total</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        <TableRow key="1047"><TableCell sort-value="1047">#1047</TableCell><TableCell>João Costa</TableCell><TableCell>Enviado</TableCell><TableCell sort-value="142.50">R$ 142,50</TableCell><Detail label="Pedido #1047">Entrega prevista para amanhã. ${detail}</Detail><RowActions><RowAction action="edit">Editar</RowAction><RowAction action="delete">Excluir</RowAction><RowAction action="save">Salvar</RowAction><RowAction action="cancel">Cancelar</RowAction></RowActions></TableRow>
        <TableRow key="1048"><TableCell sort-value="1048">#1048</TableCell><TableCell>Ana Silva</TableCell><TableCell>Processando</TableCell><TableCell sort-value="284.90">R$ 284,90</TableCell><Detail label="Pedido #1048">${detail}</Detail><RowActions><RowAction action="edit">Editar</RowAction><RowAction action="delete">Excluir</RowAction><RowAction action="save">Salvar</RowAction><RowAction action="cancel">Cancelar</RowAction></RowActions></TableRow>
        <TableRow key="1049"><TableCell sort-value="1049">#1049</TableCell><TableCell>Marcos Lima</TableCell><TableCell>Pago</TableCell><TableCell sort-value="96.00">R$ 96,00</TableCell><Detail label="Pedido #1049">Pagamento confirmado e faturamento em preparação.</Detail><RowActions><RowAction action="edit">Editar</RowAction><RowAction action="delete">Excluir</RowAction><RowAction action="save">Salvar</RowAction><RowAction action="cancel">Cancelar</RowAction></RowActions></TableRow>
      </TableBody>
      <TableFooter><RowAction action="new">Novo pedido</RowAction></TableFooter>
      <Empty>Nenhum pedido encontrado.</Empty>
      <Loading>Carregando pedidos...</Loading>
    `;
  }

  // =========================================================================== HERO
  private renderHero(): TemplateResult {
    return html`<header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
      <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">groupViewTable</span>
      <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">Tabelas de registros</h1>
      <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">Apresente registros em tabelas com ordenação, paginação e diferentes níveis de interação. Escolha entre visualizações compactas, responsivas, editáveis, agrupadas ou com detalhes associados ao registro aberto.</p>
    </header>`;
  }

  // =========================================================================== SHOWCASE CARDS
  private renderShowcaseCards(): TemplateResult {
    const change = (key: string) => (e: CustomEvent) => { (this as unknown as Record<string, string>)[key] = e.detail.value; };
    return html`<section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700"><div class="max-w-2xl mx-auto flex flex-col gap-5">
      ${this.renderCard('violet', 'Tabela de dados avançada', 'groupviewtable--ml-advanced-data-table', 'card-advanced', html`<groupviewtable--ml-advanced-data-table value="${this.cardAdvanced}" .isEditing=${true} @change=${change('cardAdvanced')}>${this.renderTableSlots()}</groupviewtable--ml-advanced-data-table>`)}
      ${this.renderCard('emerald', 'Tabela de dados', 'groupviewtable--ml-data-table', 'card-data', html`<groupviewtable--ml-data-table value="${this.cardData}" .isEditing=${true} @change=${change('cardData')}>${this.renderTableSlots()}</groupviewtable--ml-data-table>`)}
      ${this.renderCard('amber', 'Tabela mínima', 'groupviewtable--ml-data-table-minimal', 'card-minimal', html`<groupviewtable--ml-data-table-minimal value="${this.cardMinimal}" .isEditing=${true} @change=${change('cardMinimal')}>${this.renderTableSlots()}</groupviewtable--ml-data-table-minimal>`)}
      ${this.renderCard('rose', 'Tabela agrupada', 'groupviewtable--ml-grouping-table', 'card-grouping', html`<groupviewtable--ml-grouping-table value="${this.cardGrouping}" .isEditing=${true} @change=${change('cardGrouping')}>${this.renderTableSlots()}</groupviewtable--ml-grouping-table>`)}
      ${this.renderCard('sky', 'Tabela com edição em linha', 'groupviewtable--ml-inline-edit-table', 'card-inline', html`<groupviewtable--ml-inline-edit-table value="${this.cardInline}" .isEditing=${true} @change=${change('cardInline')}>${this.renderTableSlots()}</groupviewtable--ml-inline-edit-table>`)}
      ${this.renderCard('indigo', 'Tabela com detalhe sob demanda', 'groupviewtable--ml-lazy-record-detail-table', 'card-lazy', html`<groupviewtable--ml-lazy-record-detail-table value="${this.cardLazy}" .isEditing=${true} @change=${change('cardLazy')}>${this.renderTableSlots('Dados carregados sob demanda: endereço, itens e histórico do pedido.')}</groupviewtable--ml-lazy-record-detail-table>`)}
      ${this.renderCard('purple', 'Grade de detalhe LCRUD', 'groupviewtable--ml-lcrud-detail-grid', 'card-lcrud', html`<groupviewtable--ml-lcrud-detail-grid value="${this.cardLcrud}" .isEditing=${true} @change=${change('cardLcrud')}>${this.renderTableSlots()}</groupviewtable--ml-lcrud-detail-grid>`)}
      ${this.renderCard('teal', 'Tabela dinâmica', 'groupviewtable--ml-pivot-table', 'card-pivot', html`<groupviewtable--ml-pivot-table value="${this.cardPivot}" .isEditing=${true} @change=${change('cardPivot')}>${this.renderTableSlots()}</groupviewtable--ml-pivot-table>`)}
      ${this.renderCard('orange', 'Tabela de formulário de registro', 'groupviewtable--ml-record-form-table', 'card-record-form', html`<groupviewtable--ml-record-form-table value="${this.cardRecordForm}" .isEditing=${true} @change=${change('cardRecordForm')}>${this.renderTableSlots()}</groupviewtable--ml-record-form-table>`)}
      ${this.renderCard('pink', 'Tabela de dados responsiva', 'groupviewtable--ml-responsive-data-table', 'card-responsive-data', html`<groupviewtable--ml-responsive-data-table value="${this.cardResponsiveData}" .isEditing=${true} @change=${change('cardResponsiveData')}>${this.renderTableSlots()}</groupviewtable--ml-responsive-data-table>`)}
      ${this.renderCard('violet', 'Tabela responsiva', 'groupviewtable--ml-responsive-table', 'card-responsive', html`<groupviewtable--ml-responsive-table value="${this.cardResponsive}" .isEditing=${true} @change=${change('cardResponsive')}>${this.renderTableSlots()}</groupviewtable--ml-responsive-table>`)}
      ${this.renderCard('emerald', 'Tabela com painel lateral', 'groupviewtable--ml-side-detail-table', 'card-side-detail', html`<groupviewtable--ml-side-detail-table value="${this.cardSideDetail}" .isEditing=${true} @change=${change('cardSideDetail')}>${this.renderTableSlots('Painel lateral: Ana Silva, pedido #1048, 3 itens e entrega prevista para 30 de agosto.')}</groupviewtable--ml-side-detail-table>`)}
      ${this.renderCard('amber', 'Tabela de visualização', 'groupviewtable--ml-view-table', 'card-view', html`<groupviewtable--ml-view-table value="${this.cardView}" .isEditing=${true} @change=${change('cardView')}>${this.renderTableSlots()}</groupviewtable--ml-view-table>`)}
    </div></section>`;
  }

  private renderCard(color: string, name: string, tag: string, card: string, content: TemplateResult): TemplateResult {
    return html`<div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"><div class="h-1 bg-${color}-500 rounded-t-2xl"></div><div class="p-6"><div class="flex items-center justify-between mb-1"><p class="text-sm font-bold text-slate-900 dark:text-slate-50">${name}</p><code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">${tag}</code></div><p class="text-xs text-slate-400 mb-5">${card === 'card-side-detail' ? 'Lista utilizável com o detalhe do registro ao lado.' : 'Tabela interativa para consultar e operar registros.'}</p>${content}</div></div>`;
  }

  // =========================================================================== REFERENCE TABLE
  private renderReferenceTable(): TemplateResult {
    return renderCatalogReferenceTable(molecules, scenarios);
  }

  protected render(): TemplateResult {
    return html`<div class="font-sans min-h-screen">${this.renderHero()}${this.renderShowcaseCards()}${this.renderReferenceTable()}</div>`;
  }
}

export default GroupGroupViewTableIndex;
