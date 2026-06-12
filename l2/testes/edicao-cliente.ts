/// <mls fileReference="_102040_/l2/testes/edicao-cliente.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import { initState, getState, setState } from '/_102029_/l2/collabState.js';
import '/_102040_/l2/molecules/groupentertext/ml-floating-text-input';
import '/_102040_/l2/molecules/groupselectone/ml-combobox';
import '/_102040_/l2/molecules/groupselectone/ml-segmented-control';
import '/_102040_/l2/molecules/groupnotifyuser/ml-notify-banner';

// =============================================================================
// TYPES & MOCK DATA
// =============================================================================

interface Cliente {
  codigo: string;
  nome: string;
  endereco: string;
  situacao: string;
  dataInclusao: string;
  dataModificacao: string;
}

const mockClientes: Cliente[] = [
  {
    codigo: 'CLI-001',
    nome: 'Acme Distribuidora Ltda',
    endereco: 'Rua das Palmeiras, 400 — São Paulo, SP',
    situacao: 'ativo',
    dataInclusao: '10/01/2023',
    dataModificacao: '05/06/2026',
  },
  {
    codigo: 'CLI-002',
    nome: 'Beta Comércio S.A.',
    endereco: 'Av. Industrial, 1200 — Campinas, SP',
    situacao: 'ativo',
    dataInclusao: '22/03/2023',
    dataModificacao: '01/04/2026',
  },
  {
    codigo: 'CLI-003',
    nome: 'Gama Serviços ME',
    endereco: 'Rua Sete de Setembro, 88 — Curitiba, PR',
    situacao: 'inativo',
    dataInclusao: '14/07/2023',
    dataModificacao: '10/11/2025',
  },
  {
    codigo: 'CLI-004',
    nome: 'Delta Tecnologia Ltda',
    endereco: 'Av. Paulista, 2500 — São Paulo, SP',
    situacao: 'bloqueado',
    dataInclusao: '30/09/2023',
    dataModificacao: '20/05/2026',
  },
  {
    codigo: 'CLI-005',
    nome: 'Épsilon Indústria S.A.',
    endereco: 'Rua do Comércio, 310 — Porto Alegre, RS',
    situacao: 'ativo',
    dataInclusao: '03/12/2023',
    dataModificacao: '11/06/2026',
  },
];

// =============================================================================
// PAGE COMPONENT
// =============================================================================

@customElement('testes--edicao-cliente')
export class EdicaoClientePage extends StateLitElement {

  // ── Campos editáveis — property binding (.value=${...})
  @state() private nome = '';
  @state() private endereco = '';
  @state() private situacao = '';

  // ── Controle de UI
  @state() private clienteAtual: Cliente | null = null;
  @state() private errors: Record<string, string> = {};
  @state() private saved = false;

  // ==========================================================================
  // LIFECYCLE
  // ==========================================================================

  connectedCallback() {
    super.connectedCallback();
    initState('edicao', {
      clientes: mockClientes,
      // Campos somente-leitura — atualizados via setState, lidos via ICA
      codigo: '',
      dataInclusao: '',
      dataModificacao: '',
    });
  }

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  private getClientes(): Cliente[] {
    return (getState('edicao.clientes') as Cliente[]) ?? mockClientes;
  }

  private err(field: string): string {
    return this.errors[field] ?? '';
  }

  // ==========================================================================
  // ACTIONS
  // ==========================================================================

  private handleSelect(e: CustomEvent) {
    const codigo = e.detail?.value as string | null;
    if (!codigo) {
      this.clearForm();
      return;
    }
    const cliente = this.getClientes().find(c => c.codigo === codigo) ?? null;
    if (!cliente) return;

    this.clienteAtual = cliente;

    // Campos somente-leitura: atualizam via setState → handleIcaStateChange nas moléculas
    setState('edicao.codigo', cliente.codigo);
    setState('edicao.dataInclusao', cliente.dataInclusao);
    setState('edicao.dataModificacao', cliente.dataModificacao);

    // Campos editáveis: atualizam via property binding → updated(changedProps) nas moléculas
    this.nome = cliente.nome;
    this.endereco = cliente.endereco;
    this.situacao = cliente.situacao;

    this.errors = {};
    this.saved = false;
  }

  private handleSave() {
    const e: Record<string, string> = {};
    if (!this.nome.trim()) e.nome = 'Nome é obrigatório.';
    if (!this.endereco.trim()) e.endereco = 'Endereço é obrigatório.';
    if (!this.situacao) e.situacao = 'Situação é obrigatória.';
    this.errors = e;
    if (Object.keys(e).length > 0) return;

    const hoje = new Date().toLocaleDateString('pt-BR');
    const atualizados = this.getClientes().map(c =>
      c.codigo === this.clienteAtual!.codigo
        ? { ...c, nome: this.nome, endereco: this.endereco, situacao: this.situacao, dataModificacao: hoje }
        : c
    );
    setState('edicao.clientes', atualizados);

    this.saved = true;
    this.clearForm();
  }

  private handleCancel() {
    this.clearForm();
  }

  private clearForm() {
    this.clienteAtual = null;
    this.nome = '';
    this.endereco = '';
    this.situacao = '';
    this.errors = {};
    setState('edicao.codigo', '');
    setState('edicao.dataInclusao', '');
    setState('edicao.dataModificacao', '');
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================

  render() {
    return html`
<div class="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans">
  <div class="max-w-2xl mx-auto px-6 py-10">

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Edição de Clientes</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Pesquise um cliente pelo código ou nome para editar o cadastro.
      </p>
    </div>

    <!-- Banner de sucesso -->
    <div class="mb-6">
      <groupnotifyuser--ml-notify-banner
        type="success"
        .visible=${this.saved}
        dismissible="true"
        @dismiss=${() => { this.saved = false; }}
      >
        <Title>Alterações salvas</Title>
        <Message>O cadastro do cliente foi atualizado com sucesso.</Message>
      </groupnotifyuser--ml-notify-banner>
    </div>

    <!-- Pesquisa -->
    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-6">
      ${this.renderSectionHeader('Pesquisa')}
      <groupselectone--ml-combobox
        name="pesquisa"
        clearable="true"
        @change=${(e: CustomEvent) => this.handleSelect(e)}
      >
        <Label>Cliente (código ou nome)</Label>
        ${this.getClientes().map(c => html`<Item value="${c.codigo}">${c.codigo} — ${c.nome}</Item>`)}
      </groupselectone--ml-combobox>
    </div>

    <!-- Formulário de edição — visível apenas quando um cliente está selecionado -->
    ${this.clienteAtual ? this.renderForm() : nothing}

  </div>
</div>`;
  }

  private renderForm() {
    return html`
<div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
  ${this.renderSectionHeader('Cadastro')}

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

    <!-- Código — ICA (value="\${getState('edicao.codigo')}"), somente leitura -->
    <div class="opacity-60 pointer-events-none">
      <groupentertext--ml-floating-text-input
        value="${getState('edicao.codigo')}"
        name="codigo"
        readonly="true"
      >
        <Label>Código</Label>
      </groupentertext--ml-floating-text-input>
    </div>

    <!-- Situação — property binding (.value=\${this.situacao}), editável -->
    <groupselectone--ml-segmented-control
      .value=${this.situacao}
      name="situacao"
      error="${this.err('situacao')}"
      @change=${(e: CustomEvent) => { this.situacao = e.detail.value; this.errors = {}; }}
    >
      <Label>Situação</Label>
      <Item value="ativo">Ativo</Item>
      <Item value="inativo">Inativo</Item>
      <Item value="bloqueado">Bloqueado</Item>
    </groupselectone--ml-segmented-control>

    <!-- Nome — property binding (.value=\${this.nome}), editável -->
    <groupentertext--ml-floating-text-input
      .value=${this.nome}
      name="nome"
      error="${this.err('nome')}"
      @change=${(e: CustomEvent) => { this.nome = e.detail.value; this.errors = {}; }}
    >
      <Label>Nome *</Label>
    </groupentertext--ml-floating-text-input>

    <!-- Endereço — property binding (.value=\${this.endereco}), editável -->
    <groupentertext--ml-floating-text-input
      .value=${this.endereco}
      name="endereco"
      error="${this.err('endereco')}"
      @change=${(e: CustomEvent) => { this.endereco = e.detail.value; this.errors = {}; }}
    >
      <Label>Endereço *</Label>
    </groupentertext--ml-floating-text-input>

    <!-- Data de Inclusão — ICA (value="\${getState('edicao.dataInclusao')}"), somente leitura -->
    <div class="opacity-60 pointer-events-none">
      <groupentertext--ml-floating-text-input
        value="${getState('edicao.dataInclusao')}"
        name="dataInclusao"
        readonly="true"
      >
        <Label>Data de Inclusão</Label>
      </groupentertext--ml-floating-text-input>
    </div>

    <!-- Última Modificação — ICA (value="\${getState('edicao.dataModificacao')}"), somente leitura -->
    <div class="opacity-60 pointer-events-none">
      <groupentertext--ml-floating-text-input
        value="${getState('edicao.dataModificacao')}"
        name="dataModificacao"
        readonly="true"
      >
        <Label>Última Modificação</Label>
      </groupentertext--ml-floating-text-input>
    </div>

  </div>

  <!-- Botões -->
  <div class="flex justify-end gap-3 mt-6">
    <button
      class="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600
             text-sm font-medium text-slate-700 dark:text-slate-300
             hover:bg-slate-100 dark:hover:bg-slate-700 transition"
      @click=${this.handleCancel}
    >
      Cancelar
    </button>
    <button
      class="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700
             disabled:opacity-50 disabled:cursor-not-allowed
             text-white text-sm font-medium transition"
      ?disabled=${Object.keys(this.errors).length > 0}
      @click=${this.handleSave}
    >
      Salvar Alterações
    </button>
  </div>
</div>`;
  }

  private renderSectionHeader(title: string) {
    return html`
<div class="flex items-center gap-3 mb-4">
  <h2 class="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">
    ${title}
  </h2>
  <div class="flex-1 h-px bg-slate-100 dark:bg-slate-700"></div>
</div>`;
  }
}
