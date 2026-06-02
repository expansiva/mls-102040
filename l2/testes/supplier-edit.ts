/// <mls fileReference="_102040_/l2/testes/supplier-edit.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupexpandcontent/ml-accordion';
import '/_102040_/l2/molecules/groupentertext/ml-floating-text-input';
import '/_102040_/l2/molecules/groupentertext/ml-multiline-text';
import '/_102040_/l2/molecules/groupenterdate/ml-date-picker';
import '/_102040_/l2/molecules/groupselectone/ml-select-dropdown';
import '/_102040_/l2/molecules/groupselectone/ml-radio-group';
import '/_102040_/l2/molecules/groupselectmany/ml-multi-checkbox-list';
import '/_102040_/l2/molecules/groupenterboolean/ml-toggle-switch';
import '/_102040_/l2/molecules/groupnotifyuser/ml-toast-notification';

interface SupplierSnapshot {
  companyName:   string;
  cnpj:          string;
  email:         string;
  website:       string;
  address:       string;
  companyType:   string;
  paymentTerm:   string;
  currency:      string;
  taxRegime:     string;
  contractStart: string;
  certExpiry:    string;
  categories:    string;
  isActive:      boolean;
  isHomologated: boolean;
  isPreferred:   boolean;
  notes:         string;
}

@customElement('testes--supplier-edit')
export class SupplierEdit extends StateLitElement {

  // ── Modo de edição ─────────────────────────────────────────────────────────
  @state() isEditing    = false;
  @state() toastVisible = false;
  @state() viewEpoch    = 0;  // incrementar força recriação do ml-accordion
  @state() errors: Record<string, string> = {};

  // ── Campos do formulário ───────────────────────────────────────────────────
  @state() companyName   = 'TechSupply Brasil Ltda';
  @state() cnpj          = '98.765.432/0001-11';
  @state() email         = 'comercial@techsupply.com.br';
  @state() website       = 'https://techsupply.com.br';
  @state() address       = 'Av. Paulista, 1000, CJ 101 — Bela Vista, São Paulo / SP — 01310-100';
  @state() companyType   = 'ltda';
  @state() paymentTerm   = '30d';
  @state() currency      = 'BRL';
  @state() taxRegime     = 'presumido';
  @state() contractStart = '2023-01-15';
  @state() certExpiry    = '2026-12-31';
  @state() categories    = 'ti,telecomunicacoes,hardware';
  @state() isActive      = true;
  @state() isHomologated = true;
  @state() isPreferred   = false;
  @state() notes         = 'Fornecedor homologado pelo jurídico em jan/2023. Renovação anual de contrato.';

  // ── Snapshot para cancelamento ─────────────────────────────────────────────
  private snapshot!: SupplierSnapshot;

  private takeSnapshot(): SupplierSnapshot {
    return {
      companyName:   this.companyName,   cnpj:          this.cnpj,
      email:         this.email,         website:       this.website,
      address:       this.address,       companyType:   this.companyType,
      paymentTerm:   this.paymentTerm,   currency:      this.currency,
      taxRegime:     this.taxRegime,     contractStart: this.contractStart,
      certExpiry:    this.certExpiry,    categories:    this.categories,
      isActive:      this.isActive,      isHomologated: this.isHomologated,
      isPreferred:   this.isPreferred,   notes:         this.notes,
    };
  }

  private restoreSnapshot() {
    this.companyName   = this.snapshot.companyName;
    this.cnpj          = this.snapshot.cnpj;
    this.email         = this.snapshot.email;
    this.website       = this.snapshot.website;
    this.address       = this.snapshot.address;
    this.companyType   = this.snapshot.companyType;
    this.paymentTerm   = this.snapshot.paymentTerm;
    this.currency      = this.snapshot.currency;
    this.taxRegime     = this.snapshot.taxRegime;
    this.contractStart = this.snapshot.contractStart;
    this.certExpiry    = this.snapshot.certExpiry;
    this.categories    = this.snapshot.categories;
    this.isActive      = this.snapshot.isActive;
    this.isHomologated = this.snapshot.isHomologated;
    this.isPreferred   = this.snapshot.isPreferred;
    this.notes         = this.snapshot.notes;
  }

  // ── Ações ──────────────────────────────────────────────────────────────────
  private edit() {
    this.snapshot  = this.takeSnapshot();
    this.errors    = {};
    this.isEditing = true;
  }

  private cancel() {
    this.restoreSnapshot();
    this.errors    = {};
    this.isEditing = false;
    this.viewEpoch++;
  }

  private validate(): boolean {
    const e: Record<string, string> = {};
    if (!this.companyName.trim()) e.companyName = 'Razão social é obrigatória.';
    if (!this.cnpj.trim())        e.cnpj        = 'CNPJ é obrigatório.';
    if (!this.email.trim())       e.email       = 'E-mail é obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email))
      e.email = 'Informe um e-mail válido.';
    this.errors = e;
    return Object.keys(e).length === 0;
  }

  private save() {
    if (!this.validate()) return;
    this.snapshot     = this.takeSnapshot();
    this.toastVisible = true;
    this.isEditing    = false;
    this.viewEpoch++;
  }

  private err(f: string): string { return this.errors[f] ?? ''; }

  // ── Helpers de label ───────────────────────────────────────────────────────
  private get companyTypeLabel(): string {
    return ({ ltda: 'Ltda', sa: 'S/A', mei: 'MEI', eireli: 'Eireli', slu: 'SLU' })[this.companyType] ?? this.companyType;
  }
  private get taxRegimeLabel(): string {
    return ({ simples: 'Simples Nacional', presumido: 'Lucro Presumido', real: 'Lucro Real' })[this.taxRegime] ?? this.taxRegime;
  }
  private get paymentTermLabel(): string {
    return ({ '0d': 'À vista', '15d': '15 dias', '30d': '30 dias', '45d': '45 dias', '60d': '60 dias', '90d': '90 dias' })[this.paymentTerm] ?? this.paymentTerm;
  }
  private get currencyLabel(): string {
    return ({ BRL: 'Real (BRL)', USD: 'Dólar (USD)', EUR: 'Euro (EUR)' })[this.currency] ?? this.currency;
  }
  private readonly categoryMap: Record<string, string> = {
    ti: 'T.I.', telecomunicacoes: 'Telecom', hardware: 'Hardware',
    software: 'Software', redes: 'Redes', energia: 'Energia',
    manutencao: 'Manutenção', consultoria: 'Consultoria',
  };
  private get categoryLabels(): string {
    return this.categories.split(',').filter(Boolean).map(v => this.categoryMap[v] ?? v).join(', ');
  }
  private get initials(): string {
    return this.companyName.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }
  private statusBadge(active: boolean, labelOn: string, labelOff: string) {
    return active
      ? html`<span class="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">${labelOn}</span>`
      : html`<span class="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">${labelOff}</span>`;
  }

  // ── View mode: ml-accordion ────────────────────────────────────────────────
  // Nota: ml-accordion lê el.innerHTML e renderiza via unsafeHTML.
  // Bindings de evento não são serializados → este modo é somente leitura.
  // viewEpoch troca o wrapper estático a cada save/cancel, forçando Lit a
  // recriar o elemento ml-accordion para exibir os valores atualizados.
  private renderViewMode() {
    const accordion = html`
<groupexpandcontent--ml-accordion multiple="true">

  <Section title="Dados da Empresa" expanded>
    <div class="px-5 py-4 grid grid-cols-[1fr,auto] gap-x-6 gap-y-2.5 text-sm">
      <span class="text-slate-500 dark:text-slate-400">Razão Social</span>
      <span class="font-semibold text-slate-800 dark:text-slate-100 text-right">${this.companyName}</span>
      <span class="text-slate-500 dark:text-slate-400">CNPJ</span>
      <span class="font-mono text-slate-700 dark:text-slate-200 text-right">${this.cnpj}</span>
      <span class="text-slate-500 dark:text-slate-400">Tipo</span>
      <span class="text-slate-700 dark:text-slate-200 text-right">${this.companyTypeLabel}</span>
      <span class="text-slate-500 dark:text-slate-400">Regime tributário</span>
      <span class="text-slate-700 dark:text-slate-200 text-right">${this.taxRegimeLabel}</span>
    </div>
  </Section>

  <Section title="Dados de Contato">
    <div class="px-5 py-4 grid grid-cols-[1fr,auto] gap-x-6 gap-y-2.5 text-sm">
      <span class="text-slate-500 dark:text-slate-400">E-mail</span>
      <span class="text-slate-700 dark:text-slate-200 text-right">${this.email}</span>
      <span class="text-slate-500 dark:text-slate-400">Site</span>
      <span class="text-slate-700 dark:text-slate-200 text-right">${this.website || '—'}</span>
      <span class="text-slate-500 dark:text-slate-400 self-start">Endereço</span>
      <span class="text-slate-700 dark:text-slate-200 text-right max-w-xs">${this.address}</span>
    </div>
  </Section>

  <Section title="Categorias de Fornecimento">
    <div class="px-5 py-4 grid grid-cols-[1fr,auto] gap-x-6 gap-y-2.5 text-sm">
      <span class="text-slate-500 dark:text-slate-400">Categorias</span>
      <span class="text-slate-700 dark:text-slate-200 text-right">${this.categoryLabels || '—'}</span>
      <span class="text-slate-500 dark:text-slate-400">Prazo de pagamento</span>
      <span class="text-slate-700 dark:text-slate-200 text-right">${this.paymentTermLabel}</span>
      <span class="text-slate-500 dark:text-slate-400">Moeda</span>
      <span class="text-slate-700 dark:text-slate-200 text-right">${this.currencyLabel}</span>
      <span class="text-slate-500 dark:text-slate-400">Início do contrato</span>
      <span class="text-slate-700 dark:text-slate-200 text-right">${this.contractStart}</span>
    </div>
  </Section>

  <Section title="Situação Cadastral">
    <div class="px-5 py-4 space-y-3 text-sm">
      <div class="flex flex-wrap gap-2">
        ${this.statusBadge(this.isActive,      'Ativo',      'Inativo')}
        ${this.statusBadge(this.isHomologated, 'Homologado', 'Não homologado')}
        ${this.statusBadge(this.isPreferred,   'Preferencial','Não preferencial')}
      </div>
      <div class="grid grid-cols-[1fr,auto] gap-x-6 gap-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-700">
        <span class="text-slate-500 dark:text-slate-400">Venc. certificação</span>
        <span class="text-slate-700 dark:text-slate-200 text-right">${this.certExpiry}</span>
      </div>
      ${this.notes ? html`
      <div class="pt-2 border-t border-slate-100 dark:border-slate-700">
        <p class="text-slate-500 dark:text-slate-400 text-xs mb-1">Observações</p>
        <p class="text-slate-700 dark:text-slate-200">${this.notes}</p>
      </div>` : html``}
    </div>
  </Section>

</groupexpandcontent--ml-accordion>`;

    // Alternar wrapper estático força Lit a recriar o ml-accordion quando viewEpoch muda,
    // garantindo que o componente releia el.innerHTML com os valores mais recentes.
    return this.viewEpoch % 2 === 0
      ? html`<div>${accordion}</div>`
      : html`<div class="w-full">${accordion}</div>`;
  }

  // ── Edit mode: form plano ──────────────────────────────────────────────────
  // Event handlers de Lit não são serializáveis no innerHTML do accordion,
  // portanto o modo de edição usa <section> HTML diretamente no template pai.
  private renderEditMode() {
    return html`
<div class="space-y-4">

  <!-- ─── Dados da Empresa ──────────────────────────────────────────────── -->
  <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
    <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
      Dados da Empresa
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

      <div class="sm:col-span-2">
        <groupentertext--ml-floating-text-input
          value="${this.companyName}"
          name="companyName"
          is-editing="true"
          error="${this.err('companyName')}"
          @change=${(e: CustomEvent) => { this.companyName = e.detail.value; }}
        >
          <Label>Razão Social</Label>
        </groupentertext--ml-floating-text-input>
      </div>

      <groupentertext--ml-floating-text-input
        value="${this.cnpj}"
        name="cnpj"
        is-editing="true"
        error="${this.err('cnpj')}"
        @change=${(e: CustomEvent) => { this.cnpj = e.detail.value; }}
      >
        <Label>CNPJ</Label>
      </groupentertext--ml-floating-text-input>

      <groupselectone--ml-select-dropdown
        value="${this.companyType}"
        name="companyType"
        is-editing="true"
        @change=${(e: CustomEvent) => { this.companyType = e.detail.value; }}
      >
        <Label>Tipo de empresa</Label>
        <Item value="ltda">Ltda</Item>
        <Item value="sa">S/A</Item>
        <Item value="mei">MEI</Item>
        <Item value="eireli">Eireli</Item>
        <Item value="slu">SLU</Item>
      </groupselectone--ml-select-dropdown>

      <div class="sm:col-span-2">
        <groupselectone--ml-radio-group
          value="${this.taxRegime}"
          name="taxRegime"
          is-editing="true"
          @change=${(e: CustomEvent) => { this.taxRegime = e.detail.value; }}
        >
          <Label>Regime tributário</Label>
          <Item value="simples">Simples Nacional</Item>
          <Item value="presumido">Lucro Presumido</Item>
          <Item value="real">Lucro Real</Item>
        </groupselectone--ml-radio-group>
      </div>

    </div>
  </section>

  <!-- ─── Dados de Contato ──────────────────────────────────────────────── -->
  <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
    <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
      Dados de Contato
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

      <groupentertext--ml-floating-text-input
        value="${this.email}"
        name="email"
        input-type="email"
        is-editing="true"
        error="${this.err('email')}"
        @change=${(e: CustomEvent) => { this.email = e.detail.value; }}
      >
        <Label>E-mail comercial</Label>
      </groupentertext--ml-floating-text-input>

      <groupentertext--ml-floating-text-input
        value="${this.website}"
        name="website"
        input-type="url"
        is-editing="true"
        @change=${(e: CustomEvent) => { this.website = e.detail.value; }}
      >
        <Label>Site</Label>
      </groupentertext--ml-floating-text-input>

      <div class="sm:col-span-2">
        <groupentertext--ml-multiline-text
          value="${this.address}"
          name="address"
          rows="3"
          is-editing="true"
          @change=${(e: CustomEvent) => { this.address = e.detail.value; }}
        >
          <Label>Endereço completo</Label>
        </groupentertext--ml-multiline-text>
      </div>

    </div>
  </section>

  <!-- ─── Categorias de Fornecimento ────────────────────────────────────── -->
  <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
    <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
      Categorias de Fornecimento
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

      <div class="sm:col-span-2">
        <groupselectmany--ml-multi-checkbox-list
          value="${this.categories}"
          name="categories"
          is-editing="true"
          @change=${(e: CustomEvent) => { this.categories = e.detail.value; }}
        >
          <Label>Categorias</Label>
          <Helper>Tipos de produto ou serviço fornecidos</Helper>
          <Item value="ti">T.I.</Item>
          <Item value="telecomunicacoes">Telecom</Item>
          <Item value="hardware">Hardware</Item>
          <Item value="software">Software</Item>
          <Item value="redes">Redes</Item>
          <Item value="energia">Energia</Item>
          <Item value="manutencao">Manutenção</Item>
          <Item value="consultoria">Consultoria</Item>
        </groupselectmany--ml-multi-checkbox-list>
      </div>

      <groupselectone--ml-select-dropdown
        value="${this.paymentTerm}"
        name="paymentTerm"
        is-editing="true"
        @change=${(e: CustomEvent) => { this.paymentTerm = e.detail.value; }}
      >
        <Label>Prazo de pagamento</Label>
        <Item value="0d">À vista</Item>
        <Item value="15d">15 dias</Item>
        <Item value="30d">30 dias</Item>
        <Item value="45d">45 dias</Item>
        <Item value="60d">60 dias</Item>
        <Item value="90d">90 dias</Item>
      </groupselectone--ml-select-dropdown>

      <groupselectone--ml-select-dropdown
        value="${this.currency}"
        name="currency"
        is-editing="true"
        @change=${(e: CustomEvent) => { this.currency = e.detail.value; }}
      >
        <Label>Moeda de negociação</Label>
        <Item value="BRL">Real (BRL)</Item>
        <Item value="USD">Dólar (USD)</Item>
        <Item value="EUR">Euro (EUR)</Item>
      </groupselectone--ml-select-dropdown>

      <groupenterdate--ml-date-picker
        value="${this.contractStart}"
        name="contractStart"
        locale="pt-BR"
        is-editing="true"
        @change=${(e: CustomEvent) => { this.contractStart = e.detail.value; }}
      >
        <Label>Início do contrato</Label>
      </groupenterdate--ml-date-picker>

      <groupenterdate--ml-date-picker
        value="${this.certExpiry}"
        name="certExpiry"
        locale="pt-BR"
        is-editing="true"
        @change=${(e: CustomEvent) => { this.certExpiry = e.detail.value; }}
      >
        <Label>Vencimento da certificação</Label>
      </groupenterdate--ml-date-picker>

    </div>
  </section>

  <!-- ─── Situação Cadastral ────────────────────────────────────────────── -->
  <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
    <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
      Situação Cadastral
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">

      <groupenterboolean--ml-toggle-switch
        .value=${this.isActive}
        name="isActive"
        is-editing="true"
        @change=${(e: CustomEvent) => {
          this.isActive = e.detail.value;
          if (!this.isActive) { this.isHomologated = false; this.isPreferred = false; }
        }}
      >
        <Label>Fornecedor ativo</Label>
        <Helper>Aceita novos pedidos</Helper>
      </groupenterboolean--ml-toggle-switch>

      <groupenterboolean--ml-toggle-switch
        .value=${this.isHomologated}
        .disabled=${!this.isActive}
        name="isHomologated"
        is-editing="true"
        @change=${(e: CustomEvent) => {
          this.isHomologated = e.detail.value;
          if (!this.isHomologated) this.isPreferred = false;
        }}
      >
        <Label>Homologado</Label>
        <Helper>Aprovado pelo jurídico</Helper>
      </groupenterboolean--ml-toggle-switch>

      <groupenterboolean--ml-toggle-switch
        .value=${this.isPreferred}
        .disabled=${!this.isHomologated}
        name="isPreferred"
        is-editing="true"
        @change=${(e: CustomEvent) => { this.isPreferred = e.detail.value; }}
      >
        <Label>Preferencial</Label>
        <Helper>Prioridade nas cotações</Helper>
      </groupenterboolean--ml-toggle-switch>

    </div>

    <div class="mt-5">
      <groupentertext--ml-multiline-text
        value="${this.notes}"
        name="notes"
        rows="3"
        is-editing="true"
        @change=${(e: CustomEvent) => { this.notes = e.detail.value; }}
      >
        <Label>Observações</Label>
        <Helper>Histórico de relacionamento, restrições, contatos-chave</Helper>
      </groupentertext--ml-multiline-text>
    </div>

  </section>

</div>`;
  }

  // ── Render principal ───────────────────────────────────────────────────────
  render() {
    return html`
<div class="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans">

  <!-- Toast de confirmação -->
  <groupnotifyuser--ml-toast-notification
    type="success"
    .visible=${this.toastVisible}
    dismissible="true"
    duration="4000"
    position="top-right"
    @dismiss=${() => { this.toastVisible = false; }}
  >
    <Title>Fornecedor atualizado</Title>
    <Message>Os dados de ${this.companyName} foram salvos com sucesso.</Message>
  </groupnotifyuser--ml-toast-notification>

  <div class="max-w-3xl mx-auto px-6 py-10">

    <!-- Cabeçalho -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

      <div class="flex items-center gap-4">
        <div class="h-14 w-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center shrink-0">
          <span class="text-lg font-bold text-emerald-700 dark:text-emerald-300">${this.initials}</span>
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100">${this.companyName}</h1>
            ${this.statusBadge(this.isActive, 'Ativo', 'Inativo')}
            ${this.isHomologated
              ? html`<span class="px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300">Homologado</span>`
              : html``}
            ${this.isPreferred
              ? html`<span class="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">Preferencial</span>`
              : html``}
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            ${this.cnpj} · ${this.companyTypeLabel} · ${this.categoryLabels || 'sem categorias'}
          </p>
        </div>
      </div>

      <div class="flex gap-2 shrink-0">
        ${this.isEditing ? html`
          <button
            class="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600
                   text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            @click=${this.cancel}
          >Cancelar</button>
          <button
            class="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition"
            @click=${this.save}
          >Salvar fornecedor</button>
        ` : html`
          <button
            class="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600
                   text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            @click=${this.edit}
          >Editar</button>
        `}
      </div>

    </div>

    <!-- Conteúdo: accordion (view) ou form plano (edit) -->
    ${this.isEditing ? this.renderEditMode() : this.renderViewMode()}

  </div>
</div>
    `;
  }
}
