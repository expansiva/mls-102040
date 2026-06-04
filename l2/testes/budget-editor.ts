/// <mls fileReference="_102040_/l2/testes/budget-editor.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table';
import '/_102040_/l2/molecules/groupentermoney/ml-enter-money-br';
import '/_102040_/l2/molecules/groupentertext/ml-floating-text-input';
import '/_102040_/l2/molecules/groupselectone/ml-select-dropdown';
import '/_102040_/l2/molecules/groupenternumber/ml-number-input';
import '/_102040_/l2/molecules/groupselectone/ml-segmented-control';
import '/_102040_/l2/molecules/groupnotifyuser/ml-notify-banner';
import '/_102040_/l2/molecules/groupnotifyuser/ml-toast-notification';

// =============================================================================
// NOTA TÉCNICA — Por que o painel de edição fica abaixo da tabela
// =============================================================================
// O ml-data-table renderiza cada <TableCell> via unsafeHTML(cell.innerHTML),
// convertendo o conteúdo em string HTML antes de inserir na <td>. Isso destrói
// quaisquer bindings Lit (@change, .value), tornando impossível reagir a eventos
// de moléculas colocadas diretamente nas células.
//
// A propriedade is-editing (table-level) propaga is-editing="true/false" para
// TODOS os custom elements em TODAS as células — não existe edição por linha.
//
// Solução adotada: usar @rowClick para identificar qual linha o usuário selecionou
// e renderizar o formulário de edição ABAIXO da tabela, fora do ml-data-table.
// Os valores editados são exibidos na tabela somente após o "Salvar".
//
// Para que o ml-data-table releia as células após a atualização dos dados,
// usamos o tableEpoch + wrapper alternado (mesmo padrão do ml-tabs).
// =============================================================================

interface BudgetRow {
  id: number;
  description: string;
  costCenter: string;
  qty: number;
  planned: number;   // centavos
  actual: number;    // centavos
}

@customElement('testes--budget-editor')
export class BudgetEditor extends StateLitElement {

  // ── Dados ───────────────────────────────────────────────────────────────────
  @state() rows: BudgetRow[] = [
    { id: 1, description: 'Licenças de Software',   costCenter: 'TI',          qty: 15,  planned: 1800000, actual: 1950000 },
    { id: 2, description: 'Treinamentos',            costCenter: 'RH',          qty: 8,   planned:  600000, actual:  420000 },
    { id: 3, description: 'Infraestrutura Cloud',    costCenter: 'TI',          qty: 1,   planned: 5000000, actual: 5120000 },
    { id: 4, description: 'Material de escritório',  costCenter: 'Corporativo',  qty: 100, planned:   80000, actual:   74000 },
    { id: 5, description: 'Eventos e marketing',     costCenter: 'Comercial',    qty: 3,   planned:  900000, actual:  760000 },
    { id: 6, description: 'Consultoria Jurídica',    costCenter: 'Jurídico',     qty: 2,   planned:  400000, actual:  380000 },
    { id: 7, description: 'Equipamentos',            costCenter: 'TI',           qty: 12,  planned: 2400000, actual: 2100000 },
  ];

  // ── UI ──────────────────────────────────────────────────────────────────────
  @state() activeFilter: 'all' | 'over' | 'within' = 'all';
  @state() editingRowId: number | null = null;
  @state() tableEpoch = 0;            // força recriação do ml-data-table ao mudar
  @state() bannerDismissed = false;
  @state() toastVisible = false;

  // ── Campos do formulário de edição ──────────────────────────────────────────
  @state() editDescription = '';
  @state() editCostCenter  = '';
  @state() editQty         = 0;
  @state() editPlanned     = 0;
  @state() editActual      = 0;
  @state() errors: Record<string, string> = {};

  private editSnapshot: BudgetRow | null = null;

  // ── Computed ─────────────────────────────────────────────────────────────────
  private get filteredRows(): BudgetRow[] {
    switch (this.activeFilter) {
      case 'over':   return this.rows.filter(r => r.actual > r.planned);
      case 'within': return this.rows.filter(r => r.actual <= r.planned);
      default:       return this.rows;
    }
  }

  private get overBudgetRows(): BudgetRow[] {
    return this.rows.filter(r => r.actual > r.planned);
  }

  private get editingRow(): BudgetRow | null {
    if (this.editingRowId === null) return null;
    return this.rows.find(r => r.id === this.editingRowId) ?? null;
  }

  // ── Formatação ───────────────────────────────────────────────────────────────
  private fmt(centavos: number): string {
    const [int, dec] = (centavos / 100).toFixed(2).split('.');
    return 'R$\u00a0' + int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + dec;
  }

  private err(f: string): string { return this.errors[f] ?? ''; }

  // ── Ações ─────────────────────────────────────────────────────────────────────
  private handleRowClick(e: CustomEvent) {
    const row = this.filteredRows[e.detail.index];
    if (!row) return;
    if (row.id === this.editingRowId) return;   // clicar na mesma linha não faz nada
    this.openEdit(row);
  }

  private openEdit(row: BudgetRow) {
    this.editingRowId   = row.id;
    this.editSnapshot   = { ...row };
    this.editDescription = row.description;
    this.editCostCenter  = row.costCenter;
    this.editQty         = row.qty;
    this.editPlanned     = row.planned;
    this.editActual      = row.actual;
    this.errors          = {};
  }

  private cancelEdit() {
    this.editingRowId = null;
    this.editSnapshot = null;
    this.errors       = {};
  }

  private saveEdit() {
    const e: Record<string, string> = {};
    if (!this.editDescription.trim())  e.description = 'Descrição é obrigatória.';
    if (!this.editCostCenter)          e.costCenter  = 'Centro de custo é obrigatório.';
    if (this.editPlanned <= 0)         e.planned     = 'Valor planejado deve ser maior que zero.';
    this.errors = e;
    if (Object.keys(e).length) return;

    this.rows = this.rows.map(r =>
      r.id === this.editingRowId
        ? { ...r,
            description: this.editDescription,
            costCenter:  this.editCostCenter,
            qty:         this.editQty,
            planned:     this.editPlanned,
            actual:      this.editActual,
          }
        : r
    );
    this.editingRowId = null;
    this.editSnapshot = null;
    this.errors       = {};
    this.toastVisible = true;
    this.tableEpoch++;   // força o ml-data-table a recriar e reler as células
  }

  // ── Render: tabela ────────────────────────────────────────────────────────────
  private renderTable() {
    const rows = this.filteredRows;

    const tpl = html`
<groupviewtable--ml-data-table
  is-editing="false"
  @rowClick=${this.handleRowClick}
>
  <TableHeader>
    <TableRow>
      <TableHead key="description" sortable>Descrição</TableHead>
      <TableHead key="costCenter"  sortable>Centro de Custo</TableHead>
      <TableHead key="qty"         sortable>Qtd</TableHead>
      <TableHead key="planned"     sortable>Planejado</TableHead>
      <TableHead key="actual"      sortable>Realizado</TableHead>
      <TableHead key="variance">Variação</TableHead>
      <TableHead key="actions">Ação</TableHead>
    </TableRow>
  </TableHeader>

  <TableBody>
    ${rows.map(row => {
      const over    = row.actual > row.planned;
      const diff    = row.actual - row.planned;
      const pct     = row.planned > 0 ? ((diff / row.planned) * 100).toFixed(1) : '0.0';
      const active  = row.id === this.editingRowId;
      return html`
      <TableRow>
        <TableCell>
          <span class="${active ? 'font-semibold text-sky-700 dark:text-sky-300' : 'text-slate-800 dark:text-slate-100'}">
            ${row.description}
          </span>
        </TableCell>
        <TableCell>
          <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            ${row.costCenter}
          </span>
        </TableCell>
        <TableCell><span class="text-slate-600 dark:text-slate-300">${row.qty}</span></TableCell>
        <TableCell>
          <span class="font-mono text-sm text-slate-700 dark:text-slate-200">${this.fmt(row.planned)}</span>
        </TableCell>
        <TableCell>
          <span class="font-mono text-sm font-semibold ${over ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}">
            ${this.fmt(row.actual)}
          </span>
        </TableCell>
        <TableCell>
          <span class="text-xs font-semibold ${over ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}">
            ${diff > 0 ? '+' : ''}${pct}%
          </span>
        </TableCell>
        <TableCell>
          <button
            class="p-1.5 rounded-lg transition
              ${active
                ? 'text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/40'
                : 'text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30'}"
            title="Editar linha"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 0l.172.172a2 2 0 010 2.828L12 16H9v-3z"/>
            </svg>
          </button>
        </TableCell>
      </TableRow>`;
    })}
  </TableBody>

  <TableFooter>
    <TableRow>
      <TableCell><span class="font-semibold text-slate-700 dark:text-slate-300">Total (${rows.length} itens)</span></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell>
        <span class="font-semibold font-mono text-sm text-slate-800 dark:text-slate-100">
          ${this.fmt(rows.reduce((s, r) => s + r.planned, 0))}
        </span>
      </TableCell>
      <TableCell>
        ${(() => {
          const totalPlanned = rows.reduce((s, r) => s + r.planned, 0);
          const totalActual  = rows.reduce((s, r) => s + r.actual, 0);
          const over = totalActual > totalPlanned;
          return html`
          <span class="font-semibold font-mono text-sm ${over ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}">
            ${this.fmt(totalActual)}
          </span>`;
        })()}
      </TableCell>
      <TableCell>
        ${(() => {
          const totalPlanned = rows.reduce((s, r) => s + r.planned, 0);
          const totalActual  = rows.reduce((s, r) => s + r.actual, 0);
          const diff = totalActual - totalPlanned;
          const pct  = totalPlanned > 0 ? ((diff / totalPlanned) * 100).toFixed(1) : '0.0';
          const over = diff > 0;
          return html`
          <span class="text-xs font-semibold ${over ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}">
            ${diff > 0 ? '+' : ''}${pct}%
          </span>`;
        })()}
      </TableCell>
      <TableCell></TableCell>
    </TableRow>
  </TableFooter>
</groupviewtable--ml-data-table>`;

    // Wrapper alternado força Lit a recriar o ml-data-table quando tableEpoch muda,
    // fazendo o componente reler as células via querySelectorAll.
    return this.tableEpoch % 2 === 0
      ? html`<div>${tpl}</div>`
      : html`<div class="w-full">${tpl}</div>`;
  }

  // ── Render: painel de edição ──────────────────────────────────────────────────
  private renderEditPanel() {
    if (this.editingRowId === null || !this.editingRow) return nothing;

    const diff = this.editActual - this.editPlanned;
    const pct  = this.editPlanned > 0 ? ((diff / this.editPlanned) * 100).toFixed(1) : '0.0';
    const over = diff > 0;

    return html`
<div class="mt-4 bg-white dark:bg-slate-800 rounded-xl border border-sky-200 dark:border-sky-700 shadow-sm overflow-hidden">

  <!-- Cabeçalho do painel -->
  <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-sky-50 dark:bg-sky-900/20">
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
      <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">
        Editando: <span class="text-sky-700 dark:text-sky-300">${this.editingRow.description}</span>
      </h3>
    </div>
    <div class="flex gap-2">
      <button
        @click=${() => this.cancelEdit()}
        class="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
      >Cancelar</button>
      <button
        @click=${() => this.saveEdit()}
        class="px-3 py-1.5 text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition"
      >Salvar</button>
    </div>
  </div>

  <!-- Campos -->
  <div class="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

    <!-- Descrição (largura dupla) -->
    <div class="sm:col-span-2">
      <groupentertext--ml-floating-text-input
        value="${this.editDescription}"
        name="editDescription"
        is-editing="true"
        required
        error="${this.err('description')}"
        @change=${(e: CustomEvent) => { this.editDescription = e.detail.value; }}
      ><Label>Descrição da Rubrica</Label></groupentertext--ml-floating-text-input>
    </div>

    <!-- Centro de custo -->
    <groupselectone--ml-select-dropdown
      value="${this.editCostCenter}"
      name="editCostCenter"
      is-editing="true"
      error="${this.err('costCenter')}"
      @change=${(e: CustomEvent) => { this.editCostCenter = e.detail.value; }}
    >
      <Label>Centro de Custo</Label>
      <Item value="TI">TI</Item>
      <Item value="RH">RH</Item>
      <Item value="Comercial">Comercial</Item>
      <Item value="Corporativo">Corporativo</Item>
      <Item value="Jurídico">Jurídico</Item>
      <Item value="Financeiro">Financeiro</Item>
    </groupselectone--ml-select-dropdown>

    <!-- Quantidade -->
    <groupenternumber--ml-number-input
      .value=${this.editQty}
      .min=${0}
      .step=${1}
      name="editQty"
      is-editing="true"
      @change=${(e: CustomEvent) => { if (e.detail.value != null) this.editQty = e.detail.value; }}
    ><Label>Quantidade</Label></groupenternumber--ml-number-input>

    <!-- Valor planejado -->
    <groupentermoney--ml-enter-money-br
      .value=${this.editPlanned}
      name="editPlanned"
      is-editing="true"
      currency="BRL"
      error="${this.err('planned')}"
      @change=${(e: CustomEvent) => { if (e.detail.value != null) this.editPlanned = e.detail.value; }}
    >
      <Label>Valor Planejado</Label>
      <Helper>Orçamento previsto para esta rubrica</Helper>
    </groupentermoney--ml-enter-money-br>

    <!-- Valor realizado -->
    <groupentermoney--ml-enter-money-br
      .value=${this.editActual}
      name="editActual"
      is-editing="true"
      currency="BRL"
      @change=${(e: CustomEvent) => { if (e.detail.value != null) this.editActual = e.detail.value; }}
    >
      <Label>Valor Realizado</Label>
      <Helper>Valor efetivamente gasto</Helper>
    </groupentermoney--ml-enter-money-br>

  </div>

  <!-- Prévia da variação -->
  <div class="px-6 pb-5">
    <div class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm
      ${over
        ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
        : 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'}">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        ${over
          ? html`<path stroke-linecap="round" stroke-linejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>`
          : html`<path stroke-linecap="round" stroke-linejoin="round" d="M13 7H5m0 0v8m0-8l8 8 4-4 6 6"/>`}
      </svg>
      <span>
        Variação atual:
        <strong>${diff > 0 ? '+' : ''}${this.fmt(Math.abs(diff))}</strong>
        (${diff > 0 ? '+' : ''}${pct}% ${over ? 'acima' : 'abaixo'} do planejado)
      </span>
    </div>
  </div>

</div>`;
  }

  // ── Render principal ──────────────────────────────────────────────────────────
  render() {
    const overCount    = this.overBudgetRows.length;
    const totalPlanned = this.filteredRows.reduce((s, r) => s + r.planned, 0);
    const totalActual  = this.filteredRows.reduce((s, r) => s + r.actual, 0);
    const totalOver    = totalActual > totalPlanned;

    return html`
<div class="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans">
  <div class="max-w-6xl mx-auto px-6 py-8">

    <!-- Cabeçalho da página -->
    <div class="flex items-start gap-4 mb-6">
      <div class="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      </div>
      <div>
        <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Editor de Orçamento</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Clique em qualquer linha para editar os valores no painel abaixo
        </p>
      </div>
    </div>

    <!-- Banner: rubricas acima do orçamento -->
    ${!this.bannerDismissed && overCount > 0 ? html`
    <div class="mb-5">
      <groupnotifyuser--ml-notify-banner
        type="warning"
        .visible=${true}
        @close=${() => { this.bannerDismissed = true; }}
      >
        ${overCount} rubrica${overCount > 1 ? 's estão' : ' está'} acima do orçamento:
        ${this.overBudgetRows.map(r => r.description).join(', ')}.
      </groupnotifyuser--ml-notify-banner>
    </div>
    ` : nothing}

    <!-- Barra de filtro + totais -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">

      <groupselectone--ml-segmented-control
        value="${this.activeFilter}"
        is-editing="true"
        @change=${(e: CustomEvent) => {
          this.activeFilter  = e.detail.value as 'all' | 'over' | 'within';
          this.editingRowId  = null;   // fecha o painel ao filtrar
          this.tableEpoch++;
        }}
      >
        <Label>Filtrar</Label>
        <Item value="all">Todas (${this.rows.length})</Item>
        <Item value="over">Acima do orçamento (${overCount})</Item>
        <Item value="within">Dentro do orçamento (${this.rows.length - overCount})</Item>
      </groupselectone--ml-segmented-control>

      <!-- Totais resumidos -->
      <div class="flex gap-6 text-sm shrink-0">
        <div class="text-right">
          <div class="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Total planejado</div>
          <div class="font-semibold font-mono text-slate-800 dark:text-slate-100">${this.fmt(totalPlanned)}</div>
        </div>
        <div class="text-right">
          <div class="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Total realizado</div>
          <div class="font-semibold font-mono ${totalOver ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}">
            ${this.fmt(totalActual)}
          </div>
        </div>
      </div>

    </div>

    <!-- Tabela -->
    ${this.renderTable()}

    <!-- Painel de edição (abaixo da tabela, sem modal) -->
    ${this.renderEditPanel()}

    <!-- Toast de confirmação -->
    <groupnotifyuser--ml-toast-notification
      type="success"
      .visible=${this.toastVisible}
      @close=${() => { this.toastVisible = false; }}
    >
      Rubrica atualizada com sucesso.
    </groupnotifyuser--ml-toast-notification>

  </div>
</div>`;
  }
}
