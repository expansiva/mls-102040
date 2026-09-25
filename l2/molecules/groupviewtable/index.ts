/// <mls fileReference="_102040_/l2/molecules/groupviewtable/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, nothing, TemplateResult } from 'lit';
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
// A célula VIVA é o que faz `is-editing` chegar a algum lugar: numa célula de texto puro ele não
// alcança nada (contrato do grupo). A família E depende disto.
import '/_102040_/l2/molecules/groupentertext/ml-enter-text';
import { molecules, scenarios } from '/_102040_/l2/molecules/groupviewtable/index.defs.js';
import { renderCatalogReferenceTable } from '/_102020_/l2/aura/molecules/shared/indexReferenceTable.js';

// =============================================================================
// DADOS
// =============================================================================
// Três conjuntos, porque um só não serve: agrupar precisa de coluna com valor REPETIDO, totalizar
// precisa de DUAS colunas numéricas, paginar precisa de mais linhas que a página, e pivô precisa de
// dimensão × métrica. O conjunto antigo (3 pedidos, status distinto em cada) não servia a nenhuma
// das quatro — e era o mesmo nos 13 cards.

interface Pedido {
  id: string; cliente: string; regiao: string; status: string; itens: number; total: number;
}

const PEDIDOS: Pedido[] = [
  { id: '1047', cliente: 'João Costa',   regiao: 'Sudeste',  status: 'Enviado',     itens: 3, total: 142.5 },
  { id: '1048', cliente: 'Ana Silva',    regiao: 'Sudeste',  status: 'Processando', itens: 5, total: 284.9 },
  { id: '1049', cliente: 'Marcos Lima',  regiao: 'Sul',      status: 'Pago',        itens: 2, total: 96.0 },
  { id: '1050', cliente: 'Rita Nunes',   regiao: 'Sul',      status: 'Enviado',     itens: 8, total: 512.3 },
  { id: '1051', cliente: 'Caio Prado',   regiao: 'Nordeste', status: 'Pago',        itens: 1, total: 48.0 },
  { id: '1052', cliente: 'Bia Moreira',  regiao: 'Sudeste',  status: 'Pago',        itens: 4, total: 203.7 },
  { id: '1053', cliente: 'Léo Tavares',  regiao: 'Sul',      status: 'Processando', itens: 6, total: 330.0 },
  { id: '1054', cliente: 'Sara Dias',    regiao: 'Nordeste', status: 'Enviado',     itens: 2, total: 88.4 },
];

/** Recorte curto — a família A compara ACABAMENTO, e para isso o dado tem de ser o mesmo e pequeno. */
const PEDIDOS_CURTO = PEDIDOS.slice(0, 3);

/**
 * Já pivotado: o `ml-pivot-table` delega cálculo e agregação ao consumidor (objetivo dele).
 * `papel` vira o atributo da linha — a molécula distingue linha comum, `subtotal` e `total`, e sem
 * nenhuma linha marcada ela renderiza como qualquer outra tabela.
 */
const PIVO = {
  colunas: ['T1', 'T2', 'T3', 'T4'],
  linhas: [
    { dimensao: 'Sudeste',          valores: [128, 164, 142, 205], papel: '' },
    { dimensao: 'Sul',              valores: [96, 112, 158, 133],  papel: '' },
    { dimensao: 'Sudeste + Sul',    valores: [224, 276, 300, 338], papel: 'subtotal' },
    { dimensao: 'Nordeste',         valores: [54, 71, 66, 92],     papel: '' },
    { dimensao: 'Total geral',      valores: [278, 347, 366, 430], papel: 'total' },
  ],
};

const brl = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;

@customElement('molecules--groupviewtable--index-102040')
export class GroupGroupViewTableIndex extends StateLitElement {
  // ── Estado dos demos ───────────────────────────────────────────────────────
  @state() private selecao: Record<string, string> = {};
  /** Último evento recebido por bloco — é assim que a vitrine DEMONSTRA evento, e não só forma. */
  @state() private ultimoEvento: Record<string, string> = {};
  /** Conteúdo do `<Detail>` preenchido DEPOIS do rowClick — o fluxo lazy que o contrato descreve. */
  @state() private detalhe: Record<string, string> = {};

  // ===========================================================================
  // INSTRUMENTAÇÃO
  // ===========================================================================
  /** Registra qualquer evento da molécula. `e.type` é o nome real — nada é inventado aqui. */
  private reg(bloco: string) {
    return (e: Event) => {
      const detalhe = (e as CustomEvent).detail;
      const corpo = detalhe && Object.keys(detalhe).length ? JSON.stringify(detalhe) : '{}';
      this.ultimoEvento = { ...this.ultimoEvento, [bloco]: `${e.type} ${corpo}` };
    };
  }

  /** `change` traz a seleção em `detail.value` — o mesmo idioma que a página deveria usar. */
  private sel(bloco: string) {
    return (e: Event) => {
      this.reg(bloco)(e);
      this.selecao = { ...this.selecao, [bloco]: (e as CustomEvent).detail?.value ?? '' };
    };
  }

  /**
   * O contrato lazy: a molécula emite `rowClick` com o ÍNDICE, o consumidor carrega e escreve
   * dentro do `<Detail>`. O slot é vivo, então o que se escreve aqui chega ao nó já projetado.
   */
  private lazy(bloco: string) {
    return (e: Event) => {
      this.reg(bloco)(e);
      const i = (e as CustomEvent<{ index: number }>).detail?.index;
      const p = typeof i === 'number' ? PEDIDOS[i] : undefined;
      if (!p) return;
      const chave = `${bloco}:${p.id}`;
      if (this.detalhe[chave]) return;
      this.detalhe = { ...this.detalhe, [chave]: '⋯ carregando' };
      window.setTimeout(() => {
        this.detalhe = {
          ...this.detalhe,
          [chave]: `${p.cliente} · ${p.regiao} · ${p.itens} itens · ${brl(p.total)}`,
        };
      }, 450);
    };
  }

  private renderEventos(bloco: string): TemplateResult {
    const txt = this.ultimoEvento[bloco];
    return html`<p class="mt-3 text-[11px] font-mono text-slate-400 dark:text-slate-500">
      ${txt ? html`último evento: <span class="text-slate-600 dark:text-slate-300">${txt}</span>` : 'nenhum evento ainda — interaja com a tabela'}
    </p>`;
  }

  // ===========================================================================
  // CONTEÚDO DE SLOT — por necessidade, nunca um molde único
  // ===========================================================================
  /** Cabeçalho simples. `groupable` só entra onde a molécula agrupa — ele muda o que é renderizado. */
  private cabecalho(opts: { agrupavel?: boolean; numerico?: boolean } = {}): TemplateResult {
    return html`<TableHeader><TableRow>
      <TableHead key="id" sortable>Pedido</TableHead>
      <TableHead key="cliente" sortable>Cliente</TableHead>
      <TableHead key="regiao" ?groupable=${!!opts.agrupavel} sortable>Região</TableHead>
      <TableHead key="status" ?groupable=${!!opts.agrupavel} sortable>Status</TableHead>
      ${opts.numerico ? html`<TableHead key="itens" sortable>Itens</TableHead>` : nothing}
      <TableHead key="total" sortable>Total</TableHead>
    </TableRow></TableHeader>`;
  }

  private linhas(dados: Pedido[], opts: { numerico?: boolean } = {}): TemplateResult {
    return html`<TableBody>${dados.map(p => html`<TableRow key=${p.id}>
      <TableCell sort-value=${p.id}>#${p.id}</TableCell>
      <TableCell>${p.cliente}</TableCell>
      <TableCell>${p.regiao}</TableCell>
      <TableCell>${p.status}</TableCell>
      ${opts.numerico ? html`<TableCell sort-value=${p.itens}>${p.itens}</TableCell>` : nothing}
      <TableCell sort-value=${p.total}>${brl(p.total)}</TableCell>
    </TableRow>`)}</TableBody>`;
  }

  private estados(): TemplateResult {
    return html`<Empty>Nenhum pedido encontrado.</Empty><Loading>Carregando pedidos…</Loading>`;
  }

  // ===========================================================================
  // HERO
  // ===========================================================================
  private renderHero(): TemplateResult {
    return html`<header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-16 text-center">
      <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">groupViewTable</span>
      <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">Tabelas de registros</h1>
      <p class="text-lg text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
        Treze moléculas com o MESMO contrato de slot. O que as separa não é atributo — é o que cada uma
        faz com a interação, com o espaço e com a forma do dado. Cada bloco abaixo exercita exatamente isso.
      </p>
    </header>`;
  }

  // ===========================================================================
  // CROMO — a moldura é da página, não das moléculas. Os métodos `demo*` abaixo
  // contêm SÓ a instanciação da molécula, para poderem ser lidos isoladamente.
  // ===========================================================================
  private secao(titulo: string, pergunta: string, corpo: TemplateResult): TemplateResult {
    return html`<section class="px-8 py-12 border-b border-slate-200 dark:border-slate-700">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">${titulo}</h2>
        <p class="mt-2 mb-8 text-sm text-slate-500 dark:text-slate-400 max-w-3xl">${pergunta}</p>
        ${corpo}
      </div>
    </section>`;
  }

  private painel(nome: string, tag: string, nota: string, corpo: TemplateResult): TemplateResult {
    return html`<div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 h-full flex flex-col">
      <div class="flex items-center justify-between gap-3 mb-1">
        <p class="text-sm font-bold text-slate-900 dark:text-slate-50">${nome}</p>
        <code class="text-[11px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">${tag}</code>
      </div>
      <p class="text-xs text-slate-400 mb-4">${nota}</p>
      <div class="flex-1">${corpo}</div>
    </div>`;
  }

  // ===========================================================================
  // A · MESMO DADO, ACABAMENTOS DIFERENTES — só lado a lado se compara
  // ===========================================================================
  private renderFamiliaA(): TemplateResult {
    const bloco = (nome: string, tag: string, nota: string, m: TemplateResult, k: string) =>
      this.painel(nome, tag, nota, html`${m}${this.renderEventos(k)}`);
    return this.secao(
      'A · O mesmo dado, quatro acabamentos',
      'Estas quatro têm a mesma API. A diferença é densidade e enfeite — e só aparece com o mesmo dado, lado a lado. Ordene uma coluna: todas emitem sort.',
      html`<div class="grid gap-5 md:grid-cols-2">
        ${bloco('Tabela de dados', 'ml-data-table', 'Completa: seleção, paginação, rodapé.',
          html`<groupviewtable--ml-data-table selectable value=${this.selecao['a-data'] ?? ''}
            @change=${this.sel('a-data')} @sort=${this.reg('a-data')} @rowClick=${this.reg('a-data')}>
            <Caption>Pedidos recentes</Caption>${this.cabecalho()}${this.linhas(PEDIDOS_CURTO)}${this.estados()}
          </groupviewtable--ml-data-table>`, 'a-data')}
        ${bloco('Tabela mínima', 'ml-data-table-minimal', 'O mesmo, sem cromo.',
          html`<groupviewtable--ml-data-table-minimal value=${this.selecao['a-min'] ?? ''}
            @change=${this.sel('a-min')} @sort=${this.reg('a-min')} @rowClick=${this.reg('a-min')}>
            <Caption>Pedidos recentes</Caption>${this.cabecalho()}${this.linhas(PEDIDOS_CURTO)}${this.estados()}
          </groupviewtable--ml-data-table-minimal>`, 'a-min')}
        ${bloco('Tabela de visualização', 'ml-view-table', 'Leitura limpa, foco no conteúdo.',
          html`<groupviewtable--ml-view-table value=${this.selecao['a-view'] ?? ''}
            @change=${this.sel('a-view')} @sort=${this.reg('a-view')} @rowClick=${this.reg('a-view')}>
            <Caption>Pedidos recentes</Caption>${this.cabecalho()}${this.linhas(PEDIDOS_CURTO)}${this.estados()}
          </groupviewtable--ml-view-table>`, 'a-view')}
        ${bloco('Tabela responsiva (dados)', 'ml-responsive-data-table', 'Acessível, com data-class na host.',
          html`<groupviewtable--ml-responsive-data-table data-class="w-full" value=${this.selecao['a-resp'] ?? ''}
            @change=${this.sel('a-resp')} @sort=${this.reg('a-resp')} @rowClick=${this.reg('a-resp')}>
            <Caption>Pedidos recentes</Caption>${this.cabecalho()}${this.linhas(PEDIDOS_CURTO)}${this.estados()}
          </groupviewtable--ml-responsive-data-table>`, 'a-resp')}
      </div>`);
  }

  // ===========================================================================
  // B · A JANELA DECIDE — medido: `@media (max-width: 640px)`, não o contêiner
  // ===========================================================================
  private renderFamiliaB(): TemplateResult {
    return this.secao(
      'B · A janela decide a forma',
      'Esta é a única do grupo que troca de forma sozinha: abaixo de 640px de JANELA ela deixa de ser tabela e vira fichas rotuladas, sem mudar uma linha do markup. Estreite a janela para ver — o contêiner não basta, a regra é de viewport.',
      html`<div class="max-w-4xl">
        ${this.painel('Tabela responsiva', 'ml-responsive-table', 'Mesmo markup das outras; a forma muda com a largura da janela.',
          html`<groupviewtable--ml-responsive-table value=${this.selecao['b'] ?? ''}
            @change=${this.sel('b')} @sort=${this.reg('b')} @rowClick=${this.reg('b')}>
            <Caption>Pedidos recentes</Caption>${this.cabecalho()}${this.linhas(PEDIDOS_CURTO)}${this.estados()}
          </groupviewtable--ml-responsive-table>${this.renderEventos('b')}`)}
      </div>`);
  }

  // ===========================================================================
  // C · A FORMA DO DADO — cada uma exige um dado que as outras não pedem
  // ===========================================================================
  private renderFamiliaC(): TemplateResult {
    return this.secao(
      'C · A forma do dado',
      'Aqui o dado é o argumento. Agrupar exige coluna com valor repetido e marcada groupable; totalizar exige duas colunas numéricas e os dois show*Total; pivotar exige dimensão × métrica já agregada.',
      html`<div class="grid gap-5 lg:grid-cols-3">
        ${this.painel('Tabela agrupada', 'ml-grouping-table', 'Região e Status são groupable — escolha por qual agrupar.',
          html`<groupviewtable--ml-grouping-table value=${this.selecao['c-grp'] ?? ''}
            @change=${this.sel('c-grp')} @groupChange=${this.reg('c-grp')} @sort=${this.reg('c-grp')}>
            <Caption>Pedidos por dimensão</Caption>${this.cabecalho({ agrupavel: true })}${this.linhas(PEDIDOS)}${this.estados()}
          </groupviewtable--ml-grouping-table>${this.renderEventos('c-grp')}`)}
        ${this.painel('Tabela de dados avançada', 'ml-advanced-data-table', 'Total por linha e somatório por coluna ligados.',
          html`<groupviewtable--ml-advanced-data-table .showRowTotal=${true} .showColumnTotal=${true}
            value=${this.selecao['c-adv'] ?? ''} @change=${this.sel('c-adv')} @sort=${this.reg('c-adv')}>
            <Caption>Pedidos com totais</Caption>${this.cabecalho({ numerico: true })}${this.linhas(PEDIDOS, { numerico: true })}${this.estados()}
          </groupviewtable--ml-advanced-data-table>${this.renderEventos('c-adv')}`)}
        ${this.painel('Tabela dinâmica', 'ml-pivot-table', 'Dimensão × trimestre, com linhas de subtotal e total marcadas.',
          html`<groupviewtable--ml-pivot-table value=${this.selecao['c-piv'] ?? ''}
            @change=${this.sel('c-piv')} @sort=${this.reg('c-piv')}>
            <Caption>Faturamento por região e trimestre</Caption>
            <TableHeader><TableRow>
              <TableHead key="dimensao" sortable>Região</TableHead>
              ${PIVO.colunas.map(c => html`<TableHead key=${c} sortable>${c}</TableHead>`)}
            </TableRow></TableHeader>
            <TableBody>${PIVO.linhas.map(l => html`<TableRow key=${l.dimensao} ?subtotal=${l.papel === 'subtotal'} ?total=${l.papel === 'total'}>
              <TableCell>${l.dimensao}</TableCell>
              ${l.valores.map(v => html`<TableCell sort-value=${v}>${brl(v)}</TableCell>`)}
            </TableRow>`)}</TableBody>
            ${this.estados()}
          </groupviewtable--ml-pivot-table>${this.renderEventos('c-piv')}`)}
      </div>`);
  }

  // ===========================================================================
  // D · ABRIR O DETALHE — as quatro mais confundíveis; só se distinguem ABRINDO
  // ===========================================================================
  private renderFamiliaD(): TemplateResult {
    const det = (bloco: string, p: Pedido) => this.detalhe[`${bloco}:${p.id}`] ?? '';
    const fichaVazia = (bloco: string) => html`<TableBody>${PEDIDOS.slice(0, 4).map(p => html`<TableRow key=${p.id}>
      <TableCell sort-value=${p.id}>#${p.id}</TableCell><TableCell>${p.cliente}</TableCell>
      <TableCell>${p.regiao}</TableCell><TableCell>${p.status}</TableCell>
      <TableCell sort-value=${p.total}>${brl(p.total)}</TableCell>
      <Detail label=${'Pedido #' + p.id}>${det(bloco, p)}</Detail>
    </TableRow>`)}</TableBody>`;

    return this.secao(
      'D · Abrir o registro — quatro respostas para a mesma pergunta',
      'As quatro têm o mesmo markup de tabela e um <Detail> por linha. O que muda é ONDE o detalhe aparece e QUAL gesto o abre. Nas duas primeiras o <Detail> começa VAZIO e é preenchido depois do rowClick — é o fluxo lazy do contrato.',
      html`<div class="grid gap-5 lg:grid-cols-2">
        ${this.painel('Detalhe sob demanda', 'ml-lazy-record-detail-table', 'Gesto: o chevron da linha. O detalhe abre ABAIXO dela.',
          html`<groupviewtable--ml-lazy-record-detail-table value=${this.selecao['d-lazy'] ?? ''}
            @change=${this.sel('d-lazy')} @rowClick=${this.lazy('d-lazy')} @sort=${this.reg('d-lazy')}>
            <Caption>Pedidos</Caption>${this.cabecalho()}${fichaVazia('d-lazy')}${this.estados()}
          </groupviewtable--ml-lazy-record-detail-table>${this.renderEventos('d-lazy')}`)}
        ${this.painel('Grade com cena de detalhe', 'ml-lcrud-detail-grid', 'Gesto: o botão da linha. O detalhe SUBSTITUI a lista.',
          html`<groupviewtable--ml-lcrud-detail-grid value=${this.selecao['d-lcrud'] ?? ''}
            @change=${this.sel('d-lcrud')} @rowClick=${this.lazy('d-lcrud')} @sort=${this.reg('d-lcrud')}>
            <Caption>Pedidos</Caption>${this.cabecalho()}${fichaVazia('d-lcrud')}${this.estados()}
          </groupviewtable--ml-lcrud-detail-grid>${this.renderEventos('d-lcrud')}`)}
        ${this.painel('Tabela com painel lateral', 'ml-side-detail-table', 'Gesto: clicar na linha. O detalhe abre AO LADO, com a lista visível.',
          html`<groupviewtable--ml-side-detail-table value=${this.selecao['d-side'] ?? ''}
            @change=${this.sel('d-side')} @rowClick=${this.reg('d-side')} @sort=${this.reg('d-side')}>
            <Caption>Pedidos</Caption>${this.cabecalho()}
            <TableBody>${PEDIDOS.slice(0, 4).map(p => html`<TableRow key=${p.id}>
              <TableCell sort-value=${p.id}>#${p.id}</TableCell><TableCell>${p.cliente}</TableCell>
              <TableCell>${p.regiao}</TableCell><TableCell>${p.status}</TableCell>
              <TableCell sort-value=${p.total}>${brl(p.total)}</TableCell>
              <Detail label=${'Pedido #' + p.id}>${p.cliente} · ${p.regiao} · ${p.itens} itens · ${brl(p.total)}</Detail>
            </TableRow>`)}</TableBody>${this.estados()}
          </groupviewtable--ml-side-detail-table>${this.renderEventos('d-side')}`)}
        ${this.painel('Tabela de ficha de registro', 'ml-record-form-table', 'Gesto: a ação "Abrir" da linha. A ficha SUBSTITUI a lista, para manutenção.',
          html`<groupviewtable--ml-record-form-table value=${this.selecao['d-form'] ?? ''}
            @change=${this.sel('d-form')} @rowAction=${this.reg('d-form')} @delete=${this.reg('d-form')}
            @rowClick=${this.reg('d-form')} @sort=${this.reg('d-form')}>
            <Caption>Pedidos</Caption>${this.cabecalho()}
            <TableBody>${PEDIDOS.slice(0, 4).map(p => html`<TableRow key=${p.id}>
              <TableCell sort-value=${p.id}>#${p.id}</TableCell><TableCell>${p.cliente}</TableCell>
              <TableCell>${p.regiao}</TableCell><TableCell>${p.status}</TableCell>
              <TableCell sort-value=${p.total}>${brl(p.total)}</TableCell>
              <Detail label=${'Pedido #' + p.id}>
                <p class="text-sm">Cliente <strong>${p.cliente}</strong>, região ${p.regiao}.</p>
                <p class="text-sm">${p.itens} itens · ${brl(p.total)} · situação ${p.status}.</p>
              </Detail>
              <RowActions>
                <RowAction action="open">Abrir</RowAction>
                <RowAction action="delete">Excluir</RowAction>
              </RowActions>
            </TableRow>`)}</TableBody>${this.estados()}
          </groupviewtable--ml-record-form-table>${this.renderEventos('d-form')}`)}
      </div>`);
  }

  // ===========================================================================
  // E · EDITAR NA LINHA — a célula tem de ser VIVA
  // ===========================================================================
  private renderFamiliaE(): TemplateResult {
    return this.secao(
      'E · Editar na linha',
      'A molécula é dona do MODO; a página é dona do VALOR — e o editor é da página. Por isso a célula do cliente traz uma molécula dentro, e não texto: is-editing só alcança web component. Numa célula de texto puro, abrir a linha não faz nada.',
      html`<div class="max-w-4xl">
        ${this.painel('Tabela com edição em linha', 'ml-inline-edit-table', 'Editar · Salvar · Cancelar · Excluir, mais a linha de rascunho do rodapé.',
          html`<groupviewtable--ml-inline-edit-table value=${this.selecao['e-inline'] ?? ''}
            @change=${this.sel('e-inline')} @edit=${this.reg('e-inline')} @save=${this.reg('e-inline')}
            @cancel=${this.reg('e-inline')} @delete=${this.reg('e-inline')} @newRecord=${this.reg('e-inline')}
            @rowAction=${this.reg('e-inline')} @sort=${this.reg('e-inline')}>
            <Caption>Pedidos editáveis</Caption>
            <TableHeader><TableRow>
              <TableHead key="id" sortable>Pedido</TableHead>
              <TableHead key="cliente">Cliente</TableHead>
              <TableHead key="regiao">Região</TableHead>
              <TableHead key="total" sortable>Total</TableHead>
            </TableRow></TableHeader>
            <TableBody>${PEDIDOS.slice(0, 4).map(p => html`<TableRow key=${p.id}>
              <TableCell sort-value=${p.id}>#${p.id}</TableCell>
              <TableCell><groupentertext--ml-enter-text name=${'cliente-' + p.id} .value=${p.cliente}></groupentertext--ml-enter-text></TableCell>
              <TableCell><groupentertext--ml-enter-text name=${'regiao-' + p.id} .value=${p.regiao}></groupentertext--ml-enter-text></TableCell>
              <TableCell sort-value=${p.total}>${brl(p.total)}</TableCell>
              <RowActions>
                <RowAction action="edit">Editar</RowAction>
                <RowAction action="save">Salvar</RowAction>
                <RowAction action="cancel">Cancelar</RowAction>
                <RowAction action="delete">Excluir</RowAction>
              </RowActions>
            </TableRow>`)}</TableBody>
            <NewRecordRow key="novo">
              <TableCell>novo</TableCell>
              <TableCell><groupentertext--ml-enter-text name="cliente-novo" .value=${''}></groupentertext--ml-enter-text></TableCell>
              <TableCell><groupentertext--ml-enter-text name="regiao-novo" .value=${''}></groupentertext--ml-enter-text></TableCell>
              <TableCell>—</TableCell>
              <RowActions>
                <RowAction action="save">Salvar</RowAction>
                <RowAction action="cancel">Cancelar</RowAction>
              </RowActions>
            </NewRecordRow>
            <TableFooter><RowAction action="new">Novo pedido</RowAction></TableFooter>
            ${this.estados()}
          </groupviewtable--ml-inline-edit-table>${this.renderEventos('e-inline')}`)}
      </div>`);
  }

  // ===========================================================================
  // TABELA DE REFERÊNCIA — gerada pelo catálogo, nunca escrita à mão
  // ===========================================================================
  private renderReferenceTable(): TemplateResult {
    return renderCatalogReferenceTable(molecules, scenarios);
  }

  protected render(): TemplateResult {
    return html`<div class="font-sans min-h-screen bg-slate-50 dark:bg-slate-950">
      ${this.renderHero()}
      ${this.renderFamiliaA()}
      ${this.renderFamiliaB()}
      ${this.renderFamiliaC()}
      ${this.renderFamiliaD()}
      ${this.renderFamiliaE()}
      ${this.renderReferenceTable()}
    </div>`;
  }
}

export default GroupGroupViewTableIndex;
