/// <mls fileReference="_102040_/l2/testes/escolha-orcamento.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupnavigatesteps/ml-wizard-steps';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table-select';
import '/_102040_/l2/molecules/groupviewmetric/ml-metric-card';
import '/_102040_/l2/molecules/groupselectmany/ml-multi-checkbox-list';
import '/_102040_/l2/molecules/groupenterboolean/ml-toggle-switch';
import '/_102040_/l2/molecules/groupentertext/ml-multiline-text';
import '/_102040_/l2/molecules/groupnotifyuser/ml-notify-banner';

// =============================================================================
// TYPES & MOCK DATA
// =============================================================================

interface Orcamento {
  codigo: string;
  fornecedor: string;
  dataInclusao: string;
  valorPecas: number;
  valorMaoDeObra: number;
  estimativaEntregaDias: number;
  avaliacaoFornecedor: number;
}

interface StepDef {
  title: string;
  description: string;
  completed: boolean;
  disabled: boolean;
}

const mockOrcamentos: Orcamento[] = [
  {
    codigo: 'ORC-001',
    fornecedor: 'Auto Peças Brasil',
    dataInclusao: '02/06/2026',
    valorPecas: 1800,
    valorMaoDeObra: 650,    // total: 2450
    estimativaEntregaDias: 3,
    avaliacaoFornecedor: 4,
  },
  {
    codigo: 'ORC-002',
    fornecedor: 'Mecânica Rápida Ltda',
    dataInclusao: '03/06/2026',
    valorPecas: 1200,
    valorMaoDeObra: 480,    // total: 1680 — MENOR VALOR
    estimativaEntregaDias: 5,
    avaliacaoFornecedor: 3,
  },
  {
    codigo: 'ORC-003',
    fornecedor: 'Delta Motors S.A.',
    dataInclusao: '03/06/2026',
    valorPecas: 1600,
    valorMaoDeObra: 700,    // total: 2300
    estimativaEntregaDias: 2,
    avaliacaoFornecedor: 5,
  },
  {
    codigo: 'ORC-004',
    fornecedor: 'Oficina Central ME',
    dataInclusao: '04/06/2026',
    valorPecas: 1350,
    valorMaoDeObra: 520,    // total: 1870
    estimativaEntregaDias: 4,
    avaliacaoFornecedor: 4,
  },
  {
    codigo: 'ORC-005',
    fornecedor: 'Tecno Veículos Ltda',
    dataInclusao: '04/06/2026',
    valorPecas: 2100,
    valorMaoDeObra: 800,    // total: 2900
    estimativaEntregaDias: 1,
    avaliacaoFornecedor: 5,
  },
];

// =============================================================================
// PAGE COMPONENT
// =============================================================================

@customElement('testes--escolha-orcamento')
export class EscolhaOrcamentoPage extends StateLitElement {

  // ── Wizard navigation ──────────────────────────────────────────────────────
  @state() private step = 0;
  @state() private steps: StepDef[] = [
    { title: 'Orçamentos',  description: 'Selecione o orçamento',  completed: false, disabled: false },
    { title: 'Confirmação', description: 'Revise a escolha',        completed: false, disabled: true  },
    { title: 'Tarefas',     description: 'Defina as tarefas da OS', completed: false, disabled: true  },
    { title: 'Gerar OS',    description: 'Configure e confirme',    completed: false, disabled: true  },
    { title: 'Concluído',   description: 'OS gerada com sucesso',   completed: false, disabled: true  },
  ];

  // ── Step 0 — orçamento ─────────────────────────────────────────────────────
  @state() private orcamentoSelecionado: Orcamento | null = null;
  @state() private orcamentoIdx = '';

  // ── Step 2 — tarefas ───────────────────────────────────────────────────────
  @state() private tarefas = 'equipamentos,checkin,manutencao,checkout';
  @state() private tarefasError = '';

  // ── Step 3 — gerar OS ──────────────────────────────────────────────────────
  @state() private bloquearVeiculo = false;
  @state() private justificativa = '';
  @state() private justificativaError = '';

  // ── Step 4 — resultado ─────────────────────────────────────────────────────
  @state() private osGerada: string | null = null;

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  private getMenorValor(): Orcamento {
    return mockOrcamentos.reduce((acc, o) =>
      (o.valorPecas + o.valorMaoDeObra) < (acc.valorPecas + acc.valorMaoDeObra) ? o : acc
    );
  }

  private brl(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  private stars(n: number): string {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  private tarefaLabel(key: string): string {
    const map: Record<string, string> = {
      equipamentos: 'Relacionar Equipamentos no Veículo',
      checkin: 'Check-in',
      manutencao: 'Manutenção Conforme Orçamento',
      vistoria: 'Vistoria',
      checkout: 'Check-out',
    };
    return map[key] ?? key;
  }

  // ==========================================================================
  // ACTIONS
  // ==========================================================================

  private completeStep(n: number) {
    this.steps = this.steps.map((s, i) => {
      if (i === n) return { ...s, completed: true };
      if (i === n + 1) return { ...s, disabled: false };
      return s;
    });
  }

  private handleWizardChange(e: CustomEvent) {
    this.step = e.detail.value as number;
  }

  private handleTableChange(e: CustomEvent) {
    const val = (e.detail.value as string).trim();
    this.orcamentoIdx = val;
    if (!val) {
      this.orcamentoSelecionado = null;
      return;
    }
    const idx = Number(val.split(',')[0]);
    if (!isNaN(idx) && idx >= 0 && idx < mockOrcamentos.length) {
      this.orcamentoSelecionado = mockOrcamentos[idx];
      this.completeStep(0);
    }
  }

  private handleNext() {
    if (this.step === 2 && !this.tarefas.trim()) {
      this.tarefasError = 'Selecione ao menos uma tarefa.';
      return;
    }
    this.completeStep(this.step);
    this.step++;
  }

  private handleBack() {
    this.step--;
  }

  private handleGerarOS() {
    if (this.bloquearVeiculo && !this.justificativa.trim()) {
      this.justificativaError = 'Justificativa é obrigatória ao bloquear o veículo.';
      return;
    }
    this.justificativaError = '';
    const ano = new Date().getFullYear();
    const seq = String(Date.now()).slice(-5);
    this.osGerada = `OS-${ano}-${seq}`;
    this.completeStep(3);
    this.step = 4;
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================

  render() {
    return html`
<div class="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans">
  <div class="max-w-4xl mx-auto px-6 py-10">

    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Escolha de Orçamento</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Leilão reverso — selecione o melhor orçamento e gere a OS de manutenção.
      </p>
    </div>

    <div class="mb-8">
      <groupnavigatesteps--ml-wizard-steps
        .value=${this.step}
        linear="true"
        @change=${this.handleWizardChange}
      >
        ${this.steps.map(s => html`
          <Step
            title="${s.title}"
            description="${s.description}"
            ?completed=${s.completed}
            ?disabled=${s.disabled}
          ></Step>
        `)}
      </groupnavigatesteps--ml-wizard-steps>
    </div>

    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-6">
      ${this.step === 0 ? this.renderStep0() : nothing}
      ${this.step === 1 ? this.renderStep1() : nothing}
      ${this.step === 2 ? this.renderStep2() : nothing}
      ${this.step === 3 ? this.renderStep3() : nothing}
      ${this.step === 4 ? this.renderStep4() : nothing}
    </div>

    ${this.step < 4 ? this.renderNav() : nothing}

  </div>
</div>`;
  }

  private renderNav() {
    const canNext =
      this.step === 0 ? this.orcamentoSelecionado !== null :
      this.step === 2 ? this.tarefas.trim() !== '' :
      true;

    return html`
<div class="flex items-center justify-between">
  <button
    class="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-medium
           text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700
           transition disabled:opacity-40 disabled:cursor-not-allowed"
    ?disabled=${this.step === 0}
    @click=${this.handleBack}
  >
    ← Voltar
  </button>

  <span class="text-sm text-slate-400 dark:text-slate-500">
    Etapa ${this.step + 1} de ${this.steps.length}
  </span>

  ${this.step === 3 ? html`
    <button
      class="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition"
      @click=${this.handleGerarOS}
    >
      Gerar OS
    </button>
  ` : html`
    <button
      class="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium
             transition disabled:opacity-40 disabled:cursor-not-allowed"
      ?disabled=${!canNext}
      @click=${this.handleNext}
    >
      ${this.step === 1 ? 'Confirmar Escolha' : 'Próxima etapa →'}
    </button>
  `}
</div>`;
  }

  // ── Step 0: Orçamentos ─────────────────────────────────────────────────────

  private renderStep0() {
    return html`
<h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">Orçamentos Disponíveis</h2>
<p class="text-sm text-slate-500 dark:text-slate-400 mb-5">Selecione um orçamento para prosseguir.</p>
<groupviewtable--ml-data-table-select
  selectable="true"
  select-mode="single"
  .value=${this.orcamentoIdx}
  @change=${this.handleTableChange}
>
  <TableHeader>
    <TableRow>
      <TableHead key="codigo" sortable>Código</TableHead>
      <TableHead key="fornecedor">Fornecedor</TableHead>
      <TableHead key="dataInclusao">Data Inclusão</TableHead>
      <TableHead key="valorPecas">Valor Peças</TableHead>
      <TableHead key="maoDeObra">Mão de Obra</TableHead>
      <TableHead key="total">Total</TableHead>
      <TableHead key="prazo" sortable>Prazo (dias)</TableHead>
      <TableHead key="avaliacao" sortable>Avaliação</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    ${mockOrcamentos.map(o => html`
      <TableRow>
        <TableCell>${o.codigo}</TableCell>
        <TableCell>${o.fornecedor}</TableCell>
        <TableCell>${o.dataInclusao}</TableCell>
        <TableCell>${this.brl(o.valorPecas)}</TableCell>
        <TableCell>${this.brl(o.valorMaoDeObra)}</TableCell>
        <TableCell>${this.brl(o.valorPecas + o.valorMaoDeObra)}</TableCell>
        <TableCell>${o.estimativaEntregaDias}</TableCell>
        <TableCell>${this.stars(o.avaliacaoFornecedor)}</TableCell>
      </TableRow>
    `)}
  </TableBody>
  <Empty>Nenhum orçamento disponível.</Empty>
</groupviewtable--ml-data-table-select>`;
  }

  // ── Step 1: Confirmação ────────────────────────────────────────────────────

  private renderStep1() {
    const o = this.orcamentoSelecionado!;
    const menorValor = this.getMenorValor();
    const isMaisBarato = menorValor.codigo === o.codigo;
    const total = o.valorPecas + o.valorMaoDeObra;
    const totalMenor = menorValor.valorPecas + menorValor.valorMaoDeObra;

    return html`
<h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">Confirmar Escolha</h2>
<p class="text-sm text-slate-500 dark:text-slate-400 mb-5">Revise o orçamento selecionado antes de continuar.</p>

<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
  <groupviewmetric--ml-metric-card>
    <Label>Total do Orçamento</Label>
    <Value>${this.brl(total)}</Value>
    <Helper>${o.codigo}</Helper>
  </groupviewmetric--ml-metric-card>
  <groupviewmetric--ml-metric-card>
    <Label>Valor Peças</Label>
    <Value>${this.brl(o.valorPecas)}</Value>
  </groupviewmetric--ml-metric-card>
  <groupviewmetric--ml-metric-card>
    <Label>Mão de Obra</Label>
    <Value>${this.brl(o.valorMaoDeObra)}</Value>
  </groupviewmetric--ml-metric-card>
  <groupviewmetric--ml-metric-card>
    <Label>Prazo Estimado</Label>
    <Value>${o.estimativaEntregaDias} dias</Value>
    <Helper>${o.fornecedor}</Helper>
  </groupviewmetric--ml-metric-card>
</div>

<groupnotifyuser--ml-notify-banner
  type="${isMaisBarato ? 'success' : 'warning'}"
  dismissible="false"
>
  <Title>${isMaisBarato ? 'Melhor preço' : 'Atenção: não é o menor valor'}</Title>
  <Message>
    ${isMaisBarato
      ? `Este orçamento possui o menor valor total entre os recebidos (${this.brl(total)}).`
      : `O orçamento ${menorValor.codigo} (${menorValor.fornecedor}) possui o menor valor total: ${this.brl(totalMenor)}.`
    }
  </Message>
</groupnotifyuser--ml-notify-banner>

${!isMaisBarato ? html`
  <div class="mt-6 overflow-x-auto">
    <p class="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">Comparativo com o menor valor</p>
    <table class="w-full text-sm border-collapse">
      <thead>
        <tr class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          <th class="pb-2 pr-6 text-left">Campo</th>
          <th class="pb-2 pr-6 text-left text-slate-700 dark:text-slate-200">Selecionado</th>
          <th class="pb-2 text-left text-emerald-600 dark:text-emerald-400">Menor Valor</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
        ${this.compRow('Código', o.codigo, menorValor.codigo)}
        ${this.compRow('Fornecedor', o.fornecedor, menorValor.fornecedor)}
        ${this.compRow('Valor Peças', this.brl(o.valorPecas), this.brl(menorValor.valorPecas))}
        ${this.compRow('Mão de Obra', this.brl(o.valorMaoDeObra), this.brl(menorValor.valorMaoDeObra))}
        ${this.compRow('Total', this.brl(total), this.brl(totalMenor))}
        ${this.compRow('Prazo (dias)', String(o.estimativaEntregaDias), String(menorValor.estimativaEntregaDias))}
        ${this.compRow('Avaliação', this.stars(o.avaliacaoFornecedor), this.stars(menorValor.avaliacaoFornecedor))}
      </tbody>
    </table>
  </div>
` : nothing}`;
  }

  private compRow(label: string, selected: string, best: string) {
    return html`
<tr>
  <td class="py-2 pr-6 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">${label}</td>
  <td class="py-2 pr-6 text-slate-800 dark:text-slate-100">${selected}</td>
  <td class="py-2 text-emerald-600 dark:text-emerald-400 font-semibold">${best}</td>
</tr>`;
  }

  // ── Step 2: Tarefas ────────────────────────────────────────────────────────

  private renderStep2() {
    return html`
<h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">Tarefas da OS</h2>
<p class="text-sm text-slate-500 dark:text-slate-400 mb-5">
  Defina as tarefas que serão incluídas na Ordem de Serviço. Vistoria é opcional.
</p>
<groupselectmany--ml-multi-checkbox-list
  value="${this.tarefas}"
  name="tarefas"
  error="${this.tarefasError}"
  is-editing="true"
  @change=${(e: CustomEvent) => {
    this.tarefas = e.detail.value;
    this.tarefasError = '';
  }}
>
  <Label>Tarefas</Label>
  <Item value="equipamentos">Relacionar Equipamentos no Veículo</Item>
  <Item value="checkin">Check-in</Item>
  <Item value="manutencao">Manutenção Conforme Orçamento</Item>
  <Item value="vistoria">Vistoria</Item>
  <Item value="checkout">Check-out</Item>
</groupselectmany--ml-multi-checkbox-list>`;
  }

  // ── Step 3: Gerar OS ───────────────────────────────────────────────────────

  private renderStep3() {
    return html`
<h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">Configurações da OS</h2>
<p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
  Configure as opções finais e clique em <strong>Gerar OS</strong> para concluir.
</p>
<div class="space-y-5">
  <groupenterboolean--ml-toggle-switch
    .value=${this.bloquearVeiculo}
    name="bloquearVeiculo"
    @change=${(e: CustomEvent) => {
      this.bloquearVeiculo = e.detail.value;
      if (!this.bloquearVeiculo) this.justificativaError = '';
    }}
  >
    <Label>Bloquear Veículo</Label>
    <Helper>O veículo ficará indisponível até a conclusão da manutenção</Helper>
  </groupenterboolean--ml-toggle-switch>

  <groupentertext--ml-multiline-text
    value="${this.justificativa}"
    name="justificativa"
    error="${this.justificativaError}"
    rows="3"
    is-editing="true"
    @change=${(e: CustomEvent) => {
      this.justificativa = e.detail.value;
      this.justificativaError = '';
    }}
  >
    <Label>Justificativa${this.bloquearVeiculo ? ' *' : ''}</Label>
    <Helper>Descreva o motivo da abertura da OS de manutenção</Helper>
  </groupentertext--ml-multiline-text>
</div>`;
  }

  // ── Step 4: Concluído ──────────────────────────────────────────────────────

  private renderStep4() {
    const o = this.orcamentoSelecionado!;
    const tarefasList = this.tarefas
      .split(',')
      .filter(Boolean)
      .map(k => this.tarefaLabel(k))
      .join(', ');

    return html`
<div class="text-center mb-8">
  <div class="inline-flex items-center justify-center w-16 h-16 rounded-full
              bg-emerald-100 dark:bg-emerald-900/50 mb-4">
    <span class="text-3xl text-emerald-600 dark:text-emerald-400">✓</span>
  </div>
  <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100">OS Gerada com Sucesso</h2>
  <p class="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-2 tracking-widest">
    ${this.osGerada}
  </p>
</div>

<div class="border-t border-slate-100 dark:border-slate-700 pt-6">
  <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-5">
    Resumo das Escolhas
  </p>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">

    <div>
      <p class="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Orçamento</p>
      <p class="text-sm font-medium text-slate-800 dark:text-slate-100">
        ${o.codigo} — ${o.fornecedor}
      </p>
    </div>

    <div>
      <p class="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Valor Total</p>
      <p class="text-sm font-medium text-slate-800 dark:text-slate-100">
        ${this.brl(o.valorPecas + o.valorMaoDeObra)}
      </p>
    </div>

    <div>
      <p class="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Prazo Estimado</p>
      <p class="text-sm font-medium text-slate-800 dark:text-slate-100">${o.estimativaEntregaDias} dias</p>
    </div>

    <div>
      <p class="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Bloquear Veículo</p>
      <p class="text-sm font-medium text-slate-800 dark:text-slate-100">
        ${this.bloquearVeiculo ? 'Sim' : 'Não'}
      </p>
    </div>

    <div class="sm:col-span-2">
      <p class="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Tarefas Incluídas</p>
      <p class="text-sm text-slate-700 dark:text-slate-300">${tarefasList}</p>
    </div>

    ${this.justificativa.trim() ? html`
      <div class="sm:col-span-2">
        <p class="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Justificativa</p>
        <p class="text-sm text-slate-700 dark:text-slate-300">${this.justificativa}</p>
      </div>
    ` : nothing}

  </div>
</div>`;
  }
}
