/// <mls fileReference="_102040_/l2/testes/employee-profile.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupentertext/ml-floating-text-input';
import '/_102040_/l2/molecules/groupentertext/ml-cpf-input';
import '/_102040_/l2/molecules/groupentertext/ml-multiline-text';
import '/_102040_/l2/molecules/groupenterdate/ml-date-picker';
import '/_102040_/l2/molecules/groupselectone/ml-select-dropdown';
import '/_102040_/l2/molecules/groupselectone/ml-radio-group';
import '/_102040_/l2/molecules/groupentermoney/ml-enter-money-br';
import '/_102040_/l2/molecules/groupenterboolean/ml-toggle-switch';
import '/_102040_/l2/molecules/groupnotifyuser/ml-toast-notification';

interface ProfileSnapshot {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  admissionDate: string;
  department: string;
  role: string;
  workRegime: string;
  salary: number | null;
  systemAccess: boolean;
  isAdmin: boolean;
  notes: string;
}

@customElement('testes--employee-profile')
export class EmployeeProfile extends StateLitElement {

  // ── Modo de edição ─────────────────────────────────────────────────────────
  @state() isEditing = false;
  @state() toastVisible = false;
  @state() errors: Record<string, string> = {};

  // ── Campos do formulário ───────────────────────────────────────────────────
  @state() name          = 'Carlos Alberto Mendes';
  @state() cpf           = '321.654.987-00';
  @state() email         = 'carlos.mendes@empresa.com.br';
  @state() phone         = '(11) 99876-5432';
  @state() birthDate     = '1988-03-15';
  @state() admissionDate = '2019-06-01';
  @state() department    = 'technology';
  @state() role          = 'manager';
  @state() workRegime    = 'clt';
  @state() salary: number | null = 12500;
  @state() systemAccess  = true;
  @state() isAdmin       = false;
  @state() notes         = 'Certificado AWS Solutions Architect. Responsável pela squad de plataforma.';

  // ── Snapshot para cancelamento ─────────────────────────────────────────────
  private snapshot!: ProfileSnapshot;

  private takeSnapshot(): ProfileSnapshot {
    return {
      name:          this.name,
      email:         this.email,
      phone:         this.phone,
      birthDate:     this.birthDate,
      admissionDate: this.admissionDate,
      department:    this.department,
      role:          this.role,
      workRegime:    this.workRegime,
      salary:        this.salary,
      systemAccess:  this.systemAccess,
      isAdmin:       this.isAdmin,
      notes:         this.notes,
    };
  }

  private restoreSnapshot() {
    this.name          = this.snapshot.name;
    this.email         = this.snapshot.email;
    this.phone         = this.snapshot.phone;
    this.birthDate     = this.snapshot.birthDate;
    this.admissionDate = this.snapshot.admissionDate;
    this.department    = this.snapshot.department;
    this.role          = this.snapshot.role;
    this.workRegime    = this.snapshot.workRegime;
    this.salary        = this.snapshot.salary;
    this.systemAccess  = this.snapshot.systemAccess;
    this.isAdmin       = this.snapshot.isAdmin;
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
  }

  private validate(): boolean {
    const e: Record<string, string> = {};
    if (!this.name.trim())
      e.name = 'Nome é obrigatório.';
    if (!this.email.trim())
      e.email = 'E-mail é obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email))
      e.email = 'Informe um e-mail válido.';
    if (!this.department)
      e.department = 'Departamento é obrigatório.';
    if (!this.role)
      e.role = 'Cargo é obrigatório.';
    this.errors = e;
    return Object.keys(e).length === 0;
  }

  private save() {
    if (!this.validate()) return;
    this.snapshot     = this.takeSnapshot();
    this.toastVisible = true;
    this.isEditing    = false;
  }

  private err(field: string): string {
    return this.errors[field] ?? '';
  }

  // ── Helpers de exibição ────────────────────────────────────────────────────
  private get departmentLabel(): string {
    const map: Record<string, string> = {
      technology: 'Tecnologia', finance: 'Financeiro', hr: 'Recursos Humanos',
      commercial: 'Comercial',  legal: 'Jurídico',    operations: 'Operações',
    };
    return map[this.department] ?? this.department;
  }

  private get roleLabel(): string {
    const map: Record<string, string> = {
      analyst: 'Analista', coordinator: 'Coordenador', manager: 'Gerente',
      director: 'Diretor', intern: 'Estagiário',       specialist: 'Especialista',
    };
    return map[this.role] ?? this.role;
  }

  private get initials(): string {
    return this.name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }

  // ── Render ─────────────────────────────────────────────────────────────────
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
    <Title>Perfil atualizado</Title>
    <Message>As alterações de ${this.name} foram salvas com sucesso.</Message>
  </groupnotifyuser--ml-toast-notification>

  <div class="max-w-3xl mx-auto px-6 py-10">

    <!-- Cabeçalho: avatar + nome + ações -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

      <div class="flex items-center gap-4">
        <div class="h-16 w-16 rounded-full bg-sky-100 dark:bg-sky-900/60 flex items-center justify-center shrink-0">
          <span class="text-xl font-bold text-sky-600 dark:text-sky-300">${this.initials}</span>
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100">${this.name}</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            ${this.departmentLabel} · ${this.roleLabel}
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
            class="px-4 py-2 text-sm font-medium rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition"
            @click=${this.save}
          >Salvar alterações</button>
        ` : html`
          <button
            class="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600
                   text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            @click=${this.edit}
          >Editar</button>
        `}
      </div>

    </div>

    <!-- ─── Seção: Dados Pessoais ─────────────────────────────────────────── -->
    <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-4">
      <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
        Dados Pessoais
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

        <div class="sm:col-span-2">
          <groupentertext--ml-floating-text-input
            value="${this.name}"
            name="name"
            is-editing="${this.isEditing}"
            error="${this.err('name')}"
            @change=${(e: CustomEvent) => { this.name = e.detail.value; }}
          >
            <Label>Nome completo</Label>
          </groupentertext--ml-floating-text-input>
        </div>

        <groupentertext--ml-cpf-input
          value="${this.cpf}"
          name="cpf"
          is-editing="${this.isEditing}"
          @change=${(e: CustomEvent) => { this.cpf = e.detail.value; }}
        >
          <Label>CPF</Label>
        </groupentertext--ml-cpf-input>

        <groupenterdate--ml-date-picker
          value="${this.birthDate}"
          name="birthDate"
          locale="pt-BR"
          is-editing="${this.isEditing}"
          @change=${(e: CustomEvent) => { this.birthDate = e.detail.value; }}
        >
          <Label>Data de nascimento</Label>
        </groupenterdate--ml-date-picker>

        <groupentertext--ml-floating-text-input
          value="${this.email}"
          name="email"
          input-type="email"
          is-editing="${this.isEditing}"
          error="${this.err('email')}"
          @change=${(e: CustomEvent) => { this.email = e.detail.value; }}
        >
          <Label>E-mail corporativo</Label>
        </groupentertext--ml-floating-text-input>

        <groupentertext--ml-floating-text-input
          value="${this.phone}"
          name="phone"
          input-type="tel"
          is-editing="${this.isEditing}"
          @change=${(e: CustomEvent) => { this.phone = e.detail.value; }}
        >
          <Label>Telefone</Label>
        </groupentertext--ml-floating-text-input>

      </div>
    </section>

    <!-- ─── Seção: Cargo e Remuneração ───────────────────────────────────── -->
    <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-4">
      <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
        Cargo e Remuneração
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

        <groupselectone--ml-select-dropdown
          value="${this.department}"
          name="department"
          is-editing="${this.isEditing}"
          error="${this.err('department')}"
          @change=${(e: CustomEvent) => { this.department = e.detail.value; }}
        >
          <Label>Departamento</Label>
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
          is-editing="${this.isEditing}"
          error="${this.err('role')}"
          @change=${(e: CustomEvent) => { this.role = e.detail.value; }}
        >
          <Label>Cargo</Label>
          <Item value="analyst">Analista</Item>
          <Item value="coordinator">Coordenador</Item>
          <Item value="manager">Gerente</Item>
          <Item value="director">Diretor</Item>
          <Item value="intern">Estagiário</Item>
          <Item value="specialist">Especialista</Item>
        </groupselectone--ml-select-dropdown>

        <groupenterdate--ml-date-picker
          value="${this.admissionDate}"
          name="admissionDate"
          locale="pt-BR"
          is-editing="${this.isEditing}"
          @change=${(e: CustomEvent) => { this.admissionDate = e.detail.value; }}
        >
          <Label>Data de admissão</Label>
        </groupenterdate--ml-date-picker>

        <groupentermoney--ml-enter-money-br
          .value=${this.salary}
          name="salary"
          is-editing="${this.isEditing}"
          @change=${(e: CustomEvent) => { this.salary = e.detail.value; }}
        >
          <Label>Salário base</Label>
          <Helper>Valor bruto mensal</Helper>
        </groupentermoney--ml-enter-money-br>

        <div class="sm:col-span-2">
          <groupselectone--ml-radio-group
            value="${this.workRegime}"
            name="workRegime"
            is-editing="${this.isEditing}"
            @change=${(e: CustomEvent) => { this.workRegime = e.detail.value; }}
          >
            <Label>Regime de trabalho</Label>
            <Item value="clt">CLT</Item>
            <Item value="pj">Pessoa Jurídica (PJ)</Item>
            <Item value="internship">Estágio</Item>
            <Item value="temporary">Temporário</Item>
          </groupselectone--ml-radio-group>
        </div>

      </div>
    </section>

    <!-- ─── Seção: Configurações de Acesso ───────────────────────────────── -->
    <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-4">
      <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
        Configurações de Acesso
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

        <groupenterboolean--ml-toggle-switch
          .value=${this.systemAccess}
          name="systemAccess"
          is-editing="${this.isEditing}"
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
          is-editing="${this.isEditing}"
          @change=${(e: CustomEvent) => { this.isAdmin = e.detail.value; }}
        >
          <Label>Perfil administrador</Label>
          <Helper>Acesso total ao painel de configurações</Helper>
        </groupenterboolean--ml-toggle-switch>

      </div>
    </section>

    <!-- ─── Seção: Observações ────────────────────────────────────────────── -->
    <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
      <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
        Observações
      </h2>

      <groupentertext--ml-multiline-text
        value="${this.notes}"
        name="notes"
        rows="4"
        is-editing="${this.isEditing}"
        @change=${(e: CustomEvent) => { this.notes = e.detail.value; }}
      >
        <Label>Notas internas</Label>
        <Helper>Visível apenas para gestores — não exibido ao funcionário</Helper>
      </groupentertext--ml-multiline-text>

    </section>

  </div>
</div>
    `;
  }
}
