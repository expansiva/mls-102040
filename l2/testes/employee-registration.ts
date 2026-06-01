/// <mls fileReference="_102040_/l2/testes/employee-registration.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupnavigatesteps/ml-horizontal-stepper';
import '/_102040_/l2/molecules/groupentertext/ml-floating-text-input';
import '/_102040_/l2/molecules/groupentertext/ml-cpf-input';
import '/_102040_/l2/molecules/groupenterdate/ml-date-picker';
import '/_102040_/l2/molecules/groupselectone/ml-select-dropdown';
import '/_102040_/l2/molecules/groupselectone/ml-radio-group';
import '/_102040_/l2/molecules/groupentermoney/ml-enter-money-br';
import '/_102040_/l2/molecules/groupenterboolean/ml-toggle-switch';
import '/_102040_/l2/molecules/groupenterboolean/ml-checkbox-preference';
import '/_102040_/l2/molecules/groupselectmany/ml-multi-checkbox-list';
import '/_102040_/l2/molecules/groupnotifyuser/ml-toast-notification';

@customElement('testes--employee-registration')
export class EmployeeRegistration extends StateLitElement {

  // ── Navegação ──────────────────────────────────────────────────────────────
  @state() currentStep = 0;
  @state() toastVisible = false;
  @state() errors: Record<string, string> = {};

  // ── Step 0 — Dados Pessoais ────────────────────────────────────────────────
  @state() name = '';
  @state() cpf = '';
  @state() email = '';
  @state() phone = '';
  @state() birthDate = '';

  // ── Step 1 — Cargo e Contrato ──────────────────────────────────────────────
  @state() department = '';
  @state() role = '';
  @state() workRegime = '';
  @state() admissionDate = '';
  @state() salary: number | null = null;

  // ── Step 2 — Acesso ao Sistema ─────────────────────────────────────────────
  @state() systemAccess = false;
  @state() isAdmin = false;
  @state() modules = '';
  @state() privacyAccepted = false;

  // ── Configuração das etapas ────────────────────────────────────────────────
  private readonly steps = [
    { title: 'Dados Pessoais',    description: 'Informações básicas'   },
    { title: 'Cargo e Contrato',  description: 'Vínculo empregatício'  },
    { title: 'Acesso ao Sistema', description: 'Permissões e módulos'  },
  ];

  // ── Validação ──────────────────────────────────────────────────────────────
  private validate(): boolean {
    const e: Record<string, string> = {};

    if (this.currentStep === 0) {
      if (!this.name.trim())
        e.name = 'Nome é obrigatório.';
      if (!this.cpf.trim())
        e.cpf = 'CPF é obrigatório.';
      if (!this.email.trim())
        e.email = 'E-mail é obrigatório.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email))
        e.email = 'Informe um e-mail válido.';
    }

    if (this.currentStep === 1) {
      if (!this.department)    e.department    = 'Departamento é obrigatório.';
      if (!this.role)          e.role          = 'Cargo é obrigatório.';
      if (!this.workRegime)    e.workRegime    = 'Regime de trabalho é obrigatório.';
      if (!this.admissionDate) e.admissionDate = 'Data de admissão é obrigatória.';
    }

    if (this.currentStep === 2) {
      if (!this.privacyAccepted)
        e.privacyAccepted = 'Aceite a política de privacidade para prosseguir.';
    }

    this.errors = e;
    return Object.keys(e).length === 0;
  }

  private next() {
    if (!this.validate()) return;
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    } else {
      this.toastVisible = true;
    }
  }

  private back() {
    if (this.currentStep > 0) {
      this.errors = {};
      this.currentStep--;
    }
  }

  private err(field: string): string {
    return this.errors[field] ?? '';
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
    duration="5000"
    position="top-right"
    @dismiss=${() => { this.toastVisible = false; }}
  >
    <Title>Cadastro concluído</Title>
    <Message>Funcionário ${this.name || 'novo'} cadastrado com sucesso. Um e-mail de boas-vindas foi enviado.</Message>
  </groupnotifyuser--ml-toast-notification>

  <div class="max-w-3xl mx-auto px-6 py-10">

    <!-- Cabeçalho -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Cadastro de Funcionário</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Sistema de RH — preencha todos os campos marcados com *</p>
    </div>

    <!-- Stepper -->
    <div class="mb-8">
      <groupnavigatesteps--ml-horizontal-stepper .value=${this.currentStep} linear="true">
        ${this.steps.map(s => html`<Step title="${s.title}" description="${s.description}"></Step>`)}
      </groupnavigatesteps--ml-horizontal-stepper>
    </div>

    <!-- Conteúdo da etapa atual -->
    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 mb-6">
      ${this.currentStep === 0 ? this.renderStep0() : html``}
      ${this.currentStep === 1 ? this.renderStep1() : html``}
      ${this.currentStep === 2 ? this.renderStep2() : html``}
    </div>

    <!-- Navegação -->
    <div class="flex items-center justify-between">
      <button
        class="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-medium
               text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700
               transition disabled:opacity-40 disabled:cursor-not-allowed"
        ?disabled=${this.currentStep === 0}
        @click=${this.back}
      >
        Voltar
      </button>

      <span class="text-sm text-slate-400 dark:text-slate-500">
        Etapa ${this.currentStep + 1} de ${this.steps.length}
      </span>

      <button
        class="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium transition"
        @click=${this.next}
      >
        ${this.currentStep < this.steps.length - 1 ? 'Próxima etapa →' : 'Concluir cadastro'}
      </button>
    </div>

  </div>
</div>
    `;
  }

  // ── Step 0: Dados Pessoais ─────────────────────────────────────────────────
  private renderStep0() {
    return html`
<h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">Dados Pessoais</h2>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

  <div class="sm:col-span-2">
    <groupentertext--ml-floating-text-input
      value="${this.name}"
      name="name"
      error="${this.err('name')}"
      @change=${(e: CustomEvent) => { this.name = e.detail.value; }}
    >
      <Label>Nome completo *</Label>
    </groupentertext--ml-floating-text-input>
  </div>

  <groupentertext--ml-cpf-input
    value="${this.cpf}"
    name="cpf"
    error="${this.err('cpf')}"
    @change=${(e: CustomEvent) => { this.cpf = e.detail.value; }}
  >
    <Label>CPF *</Label>
  </groupentertext--ml-cpf-input>

  <groupenterdate--ml-date-picker
    value="${this.birthDate}"
    name="birthDate"
    locale="pt-BR"
    @change=${(e: CustomEvent) => { this.birthDate = e.detail.value; }}
  >
    <Label>Data de nascimento</Label>
  </groupenterdate--ml-date-picker>

  <groupentertext--ml-floating-text-input
    value="${this.email}"
    name="email"
    input-type="email"
    error="${this.err('email')}"
    @change=${(e: CustomEvent) => { this.email = e.detail.value; }}
  >
    <Label>E-mail corporativo *</Label>
  </groupentertext--ml-floating-text-input>

  <groupentertext--ml-floating-text-input
    value="${this.phone}"
    name="phone"
    input-type="tel"
    mask="(##) #####-####"
    @change=${(e: CustomEvent) => { this.phone = e.detail.value; }}
  >
    <Label>Telefone</Label>
  </groupentertext--ml-floating-text-input>

</div>
    `;
  }

  // ── Step 1: Cargo e Contrato ───────────────────────────────────────────────
  private renderStep1() {
    return html`
<h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">Cargo e Contrato</h2>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

  <groupselectone--ml-select-dropdown
    value="${this.department}"
    name="department"
    error="${this.err('department')}"
    @change=${(e: CustomEvent) => { this.department = e.detail.value; }}
  >
    <Label>Departamento *</Label>
    <Item value="technology">Tecnologia</Item>
    <Item value="finance">Financeiro</Item>
    <Item value="hr">Recursos Humanos</Item>
    <Item value="commercial">Comercial</Item>
    <Item value="legal">Jurídico</Item>
    <Item value="operations">Operações</Item>
  </groupselectone--ml-select-dropdown>

  <groupselectone--ml-select-dropdown
    value="${this.role}"
    name="role"
    error="${this.err('role')}"
    @change=${(e: CustomEvent) => { this.role = e.detail.value; }}
  >
    <Label>Cargo *</Label>
    <Item value="analyst">Analista</Item>
    <Item value="coordinator">Coordenador</Item>
    <Item value="manager">Gerente</Item>
    <Item value="director">Diretor</Item>
    <Item value="intern">Estagiário</Item>
    <Item value="specialist">Especialista</Item>
  </groupselectone--ml-select-dropdown>

  <div class="sm:col-span-2">
    <groupselectone--ml-radio-group
      value="${this.workRegime}"
      name="workRegime"
      error="${this.err('workRegime')}"
      @change=${(e: CustomEvent) => { this.workRegime = e.detail.value; }}
    >
      <Label>Regime de trabalho *</Label>
      <Item value="clt">CLT</Item>
      <Item value="pj">Pessoa Jurídica (PJ)</Item>
      <Item value="internship">Estágio</Item>
      <Item value="temporary">Temporário</Item>
    </groupselectone--ml-radio-group>
  </div>

  <groupenterdate--ml-date-picker
    value="${this.admissionDate}"
    name="admissionDate"
    locale="pt-BR"
    error="${this.err('admissionDate')}"
    @change=${(e: CustomEvent) => { this.admissionDate = e.detail.value; }}
  >
    <Label>Data de admissão *</Label>
  </groupenterdate--ml-date-picker>

  <groupentermoney--ml-enter-money-br
    .value=${this.salary}
    name="salary"
    @change=${(e: CustomEvent) => { this.salary = e.detail.value; }}
  >
    <Label>Salário base</Label>
    <Helper>Valor bruto mensal</Helper>
  </groupentermoney--ml-enter-money-br>

</div>
    `;
  }

  // ── Step 2: Acesso ao Sistema ──────────────────────────────────────────────
  private renderStep2() {
    return html`
<h2 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">Acesso ao Sistema</h2>
<div class="space-y-6">

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

    <groupenterboolean--ml-toggle-switch
      .value=${this.systemAccess}
      name="systemAccess"
      @change=${(e: CustomEvent) => {
        this.systemAccess = e.detail.value;
        if (!this.systemAccess) this.isAdmin = false;
      }}
    >
      <Label>Acesso ao sistema</Label>
      <Helper>Permite que o funcionário faça login</Helper>
    </groupenterboolean--ml-toggle-switch>

    <groupenterboolean--ml-toggle-switch
      .value=${this.isAdmin}
      .disabled=${!this.systemAccess}
      name="isAdmin"
      @change=${(e: CustomEvent) => { this.isAdmin = e.detail.value; }}
    >
      <Label>Perfil administrador</Label>
      <Helper>Acesso total ao painel de configurações</Helper>
    </groupenterboolean--ml-toggle-switch>

  </div>

  <groupselectmany--ml-multi-checkbox-list
    value="${this.modules}"
    name="modules"
    @change=${(e: CustomEvent) => { this.modules = e.detail.value; }}
  >
    <Label>Módulos do sistema</Label>
    <Helper>Selecione os módulos que o funcionário poderá acessar</Helper>
    <Item value="crm">CRM</Item>
    <Item value="financial">Financeiro</Item>
    <Item value="hr">Recursos Humanos</Item>
    <Item value="inventory">Estoque</Item>
    <Item value="reports">Relatórios</Item>
    <Item value="settings">Configurações</Item>
    <Item value="support">Suporte</Item>
    <Item value="analytics">Analytics</Item>
  </groupselectmany--ml-multi-checkbox-list>

  <groupenterboolean--ml-checkbox-preference
    .value=${this.privacyAccepted}
    name="privacyAccepted"
    error="${this.err('privacyAccepted')}"
    @change=${(e: CustomEvent) => { this.privacyAccepted = e.detail.value; }}
  >
    <Label>Aceito a política de privacidade e os termos de uso *</Label>
    <Helper>O funcionário receberá um e-mail com os termos para assinatura digital</Helper>
  </groupenterboolean--ml-checkbox-preference>

</div>
    `;
  }
}
