/// <mls fileReference="_102040_/l2/testes/account-settings.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupnavigatesection/ml-tabs';
import '/_102040_/l2/molecules/groupentertext/ml-floating-text-input';
import '/_102040_/l2/molecules/groupentertext/ml-multiline-text';
import '/_102040_/l2/molecules/groupentertext/ml-cpf-input';
import '/_102040_/l2/molecules/groupentermoney/ml-enter-money-br';
import '/_102040_/l2/molecules/groupenterdate/ml-date-picker';
import '/_102040_/l2/molecules/groupselectone/ml-select-dropdown';
import '/_102040_/l2/molecules/groupselectone/ml-segmented-control';
import '/_102040_/l2/molecules/groupenterboolean/ml-toggle-switch';
import '/_102040_/l2/molecules/groupenterboolean/ml-checkbox-preference';
import '/_102040_/l2/molecules/groupnotifyuser/ml-toast-notification';

// ── Snapshot interfaces ────────────────────────────────────────────────────────
interface PerfilSnapshot {
  name: string; email: string; phone: string;
  birthDate: string; bio: string;
}
interface SegurancaSnapshot {
  recoveryEmail: string; twoFaEnabled: boolean; pushNotif: boolean;
}
interface CobrancaSnapshot {
  cpf: string; spendingLimit: number; spendingAlert: number;
  autoPayment: boolean; termsAccepted: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTA TÉCNICA — ml-tabs e o problema do unsafeHTML:
//
// ml-tabs lê o conteúdo de cada elemento <Tab> via el.innerHTML e o renderiza
// via unsafeHTML() em seu shadow DOM. Isso tem duas implicações:
//
// 1. Bindings Lit (@change, .value) NÃO são serializados em innerHTML → os
//    formulários de edição NÃO podem ficar dentro dos <Tab>.
//
// 2. O shadow DOM do ml-tabs NÃO se atualiza automaticamente quando o pai
//    re-renderiza os filhos <Tab> → é necessário forçar a recriação do
//    ml-tabs ao trocar isEditing (via viewEpoch + wrapper alternado).
//
// Solução:
//   - VIEW MODE: conteúdo estático (key-value HTML) dentro dos <Tab>.
//     Os valores dinâmicos (${this.foo}) funcionam pois Lit os renderiza
//     como nós de texto no light DOM antes do ml-tabs ler el.innerHTML.
//     O botão "Editar" usa onclick inline com CustomEvent composed:true
//     para cruzar o shadow boundary e disparar o evento no pai.
//   - EDIT MODE: formulário renderizado FORA do ml-tabs, no template do pai,
//     condicionado por activeTab + isEditing[tab].
//   - viewEpoch: wrapper alternado (<div> / <div class="w-full">) força Lit
//     a criar uma nova instância do ml-tabs que re-lê os <Tab> com o conteúdo
//     atualizado (editando: indicador; não editando: view content).
//   - Preferências: sem isEditing — controles interativos renderizados FORA
//     do ml-tabs (mostrados quando activeTab === 'preferencias'), com resumo
//     estático dentro do <Tab>.
// ─────────────────────────────────────────────────────────────────────────────

@customElement('testes--account-settings')
export class AccountSettings extends StateLitElement {

  // ── Navegação ───────────────────────────────────────────────────────────────
  @state() activeTab = 'perfil';
  @state() viewEpoch = 0;  // incr. força recriação do ml-tabs

  // ── Toast ────────────────────────────────────────────────────────────────────
  @state() toastVisible = false;
  @state() toastMsg     = '';

  // ── Estado de edição por aba ─────────────────────────────────────────────────
  @state() isEditingPerfil    = false;
  @state() isEditingSeguranca = false;
  @state() isEditingCobranca  = false;
  @state() errors: Record<string, string> = {};

  // ── Campos: Perfil ────────────────────────────────────────────────────────────
  @state() name      = 'Ana Paula Rodrigues';
  @state() email     = 'ana.rodrigues@empresa.com.br';
  @state() phone     = '(11) 98765-4321';
  @state() birthDate = '1992-07-22';
  @state() bio       = 'Gestora de produto com foco em B2B SaaS.';

  // ── Campos: Segurança ─────────────────────────────────────────────────────────
  @state() recoveryEmail = 'ana.pessoal@gmail.com';
  @state() twoFaEnabled  = true;
  @state() pushNotif     = false;

  // ── Campos: Cobrança ──────────────────────────────────────────────────────────
  @state() cpf           = '98765432100';
  @state() spendingLimit = 150000;  // centavos → R$ 1.500,00
  @state() spendingAlert = 120000;  // centavos → R$ 1.200,00
  @state() autoPayment   = true;
  @state() termsAccepted = true;

  // ── Campos: Preferências ──────────────────────────────────────────────────────
  @state() language = 'pt-BR';
  @state() timezone = 'America/Sao_Paulo';
  @state() theme    = 'dark';

  // ── Snapshots para cancelamento ───────────────────────────────────────────────
  private snapshotPerfil!:    PerfilSnapshot;
  private snapshotSeguranca!: SegurancaSnapshot;
  private snapshotCobranca!:  CobrancaSnapshot;

  // ── Ações: Perfil ─────────────────────────────────────────────────────────────
  private editPerfil() {
    this.snapshotPerfil = {
      name:      this.name,
      email:     this.email,
      phone:     this.phone,
      birthDate: this.birthDate,
      bio:       this.bio,
    };
    this.errors = {};
    this.isEditingPerfil = true;
    this.viewEpoch++;
  }
  private cancelPerfil() {
    this.name      = this.snapshotPerfil.name;
    this.email     = this.snapshotPerfil.email;
    this.phone     = this.snapshotPerfil.phone;
    this.birthDate = this.snapshotPerfil.birthDate;
    this.bio       = this.snapshotPerfil.bio;
    this.errors    = {};
    this.isEditingPerfil = false;
    this.viewEpoch++;
  }
  private savePerfil() {
    const e: Record<string, string> = {};
    if (!this.name.trim())  e.name  = 'Nome é obrigatório.';
    if (!this.email.trim()) e.email = 'E-mail é obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email))
      e.email = 'Informe um e-mail válido.';
    this.errors = e;
    if (Object.keys(e).length > 0) return;
    this.snapshotPerfil = {
      name:      this.name,
      email:     this.email,
      phone:     this.phone,
      birthDate: this.birthDate,
      bio:       this.bio,
    };
    this.toastMsg        = 'Perfil salvo com sucesso.';
    this.toastVisible    = true;
    this.isEditingPerfil = false;
    this.viewEpoch++;
  }

  // ── Ações: Segurança ──────────────────────────────────────────────────────────
  private editSeguranca() {
    this.snapshotSeguranca = {
      recoveryEmail: this.recoveryEmail,
      twoFaEnabled:  this.twoFaEnabled,
      pushNotif:     this.pushNotif,
    };
    this.errors = {};
    this.isEditingSeguranca = true;
    this.viewEpoch++;
  }
  private cancelSeguranca() {
    this.recoveryEmail = this.snapshotSeguranca.recoveryEmail;
    this.twoFaEnabled  = this.snapshotSeguranca.twoFaEnabled;
    this.pushNotif     = this.snapshotSeguranca.pushNotif;
    this.errors        = {};
    this.isEditingSeguranca = false;
    this.viewEpoch++;
  }
  private saveSeguranca() {
    const e: Record<string, string> = {};
    if (this.recoveryEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.recoveryEmail))
      e.recoveryEmail = 'Informe um e-mail válido.';
    this.errors = e;
    if (Object.keys(e).length > 0) return;
    this.snapshotSeguranca = {
      recoveryEmail: this.recoveryEmail,
      twoFaEnabled:  this.twoFaEnabled,
      pushNotif:     this.pushNotif,
    };
    this.toastMsg           = 'Configurações de segurança salvas.';
    this.toastVisible       = true;
    this.isEditingSeguranca = false;
    this.viewEpoch++;
  }

  // ── Ações: Cobrança ───────────────────────────────────────────────────────────
  private editCobranca() {
    this.snapshotCobranca = {
      cpf:           this.cpf,
      spendingLimit: this.spendingLimit,
      spendingAlert: this.spendingAlert,
      autoPayment:   this.autoPayment,
      termsAccepted: this.termsAccepted,
    };
    this.errors = {};
    this.isEditingCobranca = true;
    this.viewEpoch++;
  }
  private cancelCobranca() {
    this.cpf           = this.snapshotCobranca.cpf;
    this.spendingLimit = this.snapshotCobranca.spendingLimit;
    this.spendingAlert = this.snapshotCobranca.spendingAlert;
    this.autoPayment   = this.snapshotCobranca.autoPayment;
    this.termsAccepted = this.snapshotCobranca.termsAccepted;
    this.errors        = {};
    this.isEditingCobranca = false;
    this.viewEpoch++;
  }
  private saveCobranca() {
    this.snapshotCobranca = {
      cpf:           this.cpf,
      spendingLimit: this.spendingLimit,
      spendingAlert: this.spendingAlert,
      autoPayment:   this.autoPayment,
      termsAccepted: this.termsAccepted,
    };
    this.toastMsg          = 'Dados de cobrança salvos com sucesso.';
    this.toastVisible      = true;
    this.isEditingCobranca = false;
    this.viewEpoch++;
  }

  // ── Disparado pelo botão "Editar" dentro dos Tab elements ─────────────────────
  private handleRequestEdit(tab: string) {
    this.activeTab = tab;
    switch (tab) {
      case 'perfil':    this.editPerfil();    break;
      case 'seguranca': this.editSeguranca(); break;
      case 'cobranca':  this.editCobranca();  break;
    }
  }

  // ── Helpers de label ──────────────────────────────────────────────────────────
  private get languageLabel(): string {
    return ({ 'pt-BR': 'Português (Brasil)', 'en-US': 'English (US)', 'es-419': 'Español (Latam)' })[this.language] ?? this.language;
  }
  private get timezoneLabel(): string {
    return ({
      'America/Sao_Paulo': 'América/São Paulo (GMT-3)',
      'America/Manaus':    'América/Manaus (GMT-4)',
      'America/Belem':     'América/Belém (GMT-3)',
      'UTC':               'UTC',
    })[this.timezone] ?? this.timezone;
  }
  private get themeLabel(): string {
    return ({ light: 'Claro', dark: 'Escuro', auto: 'Automático' })[this.theme] ?? this.theme;
  }
  private formatMoney(centavos: number): string {
    const [int, dec] = (centavos / 100).toFixed(2).split('.');
    return 'R$ ' + int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + dec;
  }
  private formatCpf(raw: string): string {
    const d = raw.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
    return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9,11)}`;
  }
  private err(f: string): string { return this.errors[f] ?? ''; }

  // ── Badge helper ──────────────────────────────────────────────────────────────
  private badge(active: boolean, on: string, off: string) {
    return active
      ? html`<span class="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">${on}</span>`
      : html`<span class="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">${off}</span>`;
  }

  // ── Cabeçalho da seção de edição ──────────────────────────────────────────────
  private editHeader(title: string, onSave: () => void, onCancel: () => void) {
    return html`
      <div class="flex items-center justify-between mb-5 pb-4 border-b border-slate-200 dark:border-slate-700">
        <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-sky-500"></span>
          ${title}
        </h2>
        <div class="flex gap-2">
          <button
            @click=${onCancel}
            class="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
            Cancelar
          </button>
          <button
            @click=${onSave}
            class="px-3 py-1.5 text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition">
            Salvar
          </button>
        </div>
      </div>`;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // VIEW RENDERERS — conteúdo estático para os elementos <Tab>
  // ─────────────────────────────────────────────────────────────────────────────

  private renderPerfilView() {
    return html`
      <div>
        <div class="flex justify-end mb-3">
          <button
            onclick="this.dispatchEvent(new CustomEvent('request-edit',{bubbles:true,composed:true,detail:{tab:'perfil'}}))"
            class="px-3 py-1.5 text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition">
            Editar
          </button>
        </div>
        <div class="grid grid-cols-[1fr,auto] gap-x-8 gap-y-2.5 text-sm max-w-lg">
          <span class="text-slate-500 dark:text-slate-400">Nome</span>
          <span class="font-semibold text-slate-800 dark:text-slate-100 text-right">${this.name}</span>
          <span class="text-slate-500 dark:text-slate-400">E-mail</span>
          <span class="text-slate-700 dark:text-slate-200 text-right">${this.email}</span>
          <span class="text-slate-500 dark:text-slate-400">Telefone</span>
          <span class="text-slate-700 dark:text-slate-200 text-right">${this.phone}</span>
          <span class="text-slate-500 dark:text-slate-400">Data de nascimento</span>
          <span class="text-slate-700 dark:text-slate-200 text-right">${this.birthDate}</span>
          <span class="text-slate-500 dark:text-slate-400">Bio profissional</span>
          <span class="text-slate-700 dark:text-slate-200 text-right max-w-xs">${this.bio}</span>
        </div>
      </div>`;
  }

  private renderSegurancaView() {
    return html`
      <div>
        <div class="flex justify-end mb-3">
          <button
            onclick="this.dispatchEvent(new CustomEvent('request-edit',{bubbles:true,composed:true,detail:{tab:'seguranca'}}))"
            class="px-3 py-1.5 text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition">
            Editar
          </button>
        </div>
        <div class="grid grid-cols-[1fr,auto] gap-x-8 gap-y-3 text-sm max-w-sm">
          <span class="text-slate-500 dark:text-slate-400">E-mail de recuperação</span>
          <span class="text-slate-700 dark:text-slate-200 text-right">${this.recoveryEmail}</span>
          <span class="text-slate-500 dark:text-slate-400">Autenticação 2FA</span>
          ${this.badge(this.twoFaEnabled, 'Ativo', 'Inativo')}
          <span class="text-slate-500 dark:text-slate-400">Notificações push</span>
          ${this.badge(this.pushNotif, 'Ativo', 'Inativo')}
        </div>
      </div>`;
  }

  private renderCobrancaView() {
    return html`
      <div>
        <div class="flex justify-end mb-3">
          <button
            onclick="this.dispatchEvent(new CustomEvent('request-edit',{bubbles:true,composed:true,detail:{tab:'cobranca'}}))"
            class="px-3 py-1.5 text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition">
            Editar
          </button>
        </div>
        <div class="grid grid-cols-[1fr,auto] gap-x-8 gap-y-2.5 text-sm max-w-sm">
          <span class="text-slate-500 dark:text-slate-400">CPF do titular</span>
          <span class="font-mono text-slate-700 dark:text-slate-200 text-right">${this.formatCpf(this.cpf)}</span>
          <span class="text-slate-500 dark:text-slate-400">Limite mensal de gastos</span>
          <span class="font-semibold text-slate-800 dark:text-slate-100 text-right">${this.formatMoney(this.spendingLimit)}</span>
          <span class="text-slate-500 dark:text-slate-400">Alerta de valor</span>
          <span class="text-slate-700 dark:text-slate-200 text-right">${this.formatMoney(this.spendingAlert)}</span>
          <span class="text-slate-500 dark:text-slate-400">Pagamento automático</span>
          ${this.badge(this.autoPayment, 'Ativo', 'Inativo')}
          <span class="text-slate-500 dark:text-slate-400">Termos de cobrança</span>
          ${this.badge(this.termsAccepted, 'Aceito', 'Pendente')}
        </div>
      </div>`;
  }

  private renderPreferenciasView() {
    return html`
      <div>
        <p class="text-xs text-slate-500 dark:text-slate-400 italic mb-3">
          Alterações aplicadas imediatamente — sem necessidade de salvar.
        </p>
        <div class="grid grid-cols-[1fr,auto] gap-x-8 gap-y-2.5 text-sm max-w-sm">
          <span class="text-slate-500 dark:text-slate-400">Idioma</span>
          <span class="text-slate-700 dark:text-slate-200 text-right">${this.languageLabel}</span>
          <span class="text-slate-500 dark:text-slate-400">Fuso horário</span>
          <span class="text-slate-700 dark:text-slate-200 text-right">${this.timezoneLabel}</span>
          <span class="text-slate-500 dark:text-slate-400">Tema</span>
          <span class="text-slate-700 dark:text-slate-200 text-right">${this.themeLabel}</span>
        </div>
      </div>`;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // EDIT FORM RENDERERS — formulários renderizados fora do ml-tabs
  // ─────────────────────────────────────────────────────────────────────────────

  private renderPerfilEditForm() {
    return html`
      <div class="mt-1 bg-white dark:bg-slate-800 rounded-xl border border-sky-200 dark:border-sky-800 p-6 space-y-6">
        ${this.editHeader('Editando: Perfil', () => this.savePerfil(), () => this.cancelPerfil())}

        <section>
          <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Dados pessoais</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <groupentertext--ml-floating-text-input
                value="${this.name}"
                name="name"
                is-editing="true"
                required
                error="${this.err('name')}"
                @change=${(e: CustomEvent) => { this.name = e.detail.value; }}
              >
                <Label>Nome</Label>
              </groupentertext--ml-floating-text-input>
            </div>

            <groupentertext--ml-floating-text-input
              value="${this.email}"
              name="email"
              input-type="email"
              is-editing="true"
              error="${this.err('email')}"
              @change=${(e: CustomEvent) => { this.email = e.detail.value; }}
            >
              <Label>E-mail</Label>
            </groupentertext--ml-floating-text-input>

            <groupentertext--ml-floating-text-input
              value="${this.phone}"
              name="phone"
              input-type="tel"
              is-editing="true"
              @change=${(e: CustomEvent) => { this.phone = e.detail.value; }}
            >
              <Label>Telefone</Label>
            </groupentertext--ml-floating-text-input>

            <groupenterdate--ml-date-picker
              value="${this.birthDate}"
              name="birthDate"
              locale="pt-BR"
              is-editing="true"
              @change=${(e: CustomEvent) => { this.birthDate = e.detail.value; }}
            >
              <Label>Data de nascimento</Label>
            </groupenterdate--ml-date-picker>
          </div>
        </section>

        <section>
          <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Bio profissional</h3>
          <groupentertext--ml-multiline-text
            value="${this.bio}"
            name="bio"
            rows="4"
            is-editing="true"
            @change=${(e: CustomEvent) => { this.bio = e.detail.value; }}
          >
            <Label>Bio profissional</Label>
            <Helper>Visível para membros da equipe</Helper>
          </groupentertext--ml-multiline-text>
        </section>
      </div>`;
  }

  private renderSegurancaEditForm() {
    return html`
      <div class="mt-1 bg-white dark:bg-slate-800 rounded-xl border border-sky-200 dark:border-sky-800 p-6 space-y-6">
        ${this.editHeader('Editando: Segurança', () => this.saveSeguranca(), () => this.cancelSeguranca())}

        <section>
          <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Recuperação de conta</h3>
          <div class="max-w-sm">
            <groupentertext--ml-floating-text-input
              value="${this.recoveryEmail}"
              name="recoveryEmail"
              input-type="email"
              is-editing="true"
              error="${this.err('recoveryEmail')}"
              @change=${(e: CustomEvent) => { this.recoveryEmail = e.detail.value; }}
            >
              <Label>E-mail de recuperação</Label>
              <Helper>Usado para redefinir sua senha em caso de perda de acesso</Helper>
            </groupentertext--ml-floating-text-input>
          </div>
        </section>

        <section>
          <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Autenticação e notificações</h3>
          <div class="space-y-3">
            <groupenterboolean--ml-toggle-switch
              .value=${this.twoFaEnabled}
              name="twoFaEnabled"
              is-editing="true"
              @change=${(e: CustomEvent) => { this.twoFaEnabled = e.detail.value; }}
            >
              <Label>Autenticação 2FA</Label>
              <Helper>Exige um segundo fator ao fazer login</Helper>
            </groupenterboolean--ml-toggle-switch>

            <groupenterboolean--ml-toggle-switch
              .value=${this.pushNotif}
              name="pushNotif"
              is-editing="true"
              @change=${(e: CustomEvent) => { this.pushNotif = e.detail.value; }}
            >
              <Label>Notificações push</Label>
              <Helper>Receber alertas de segurança no navegador</Helper>
            </groupenterboolean--ml-toggle-switch>
          </div>
        </section>
      </div>`;
  }

  private renderCobrancaEditForm() {
    return html`
      <div class="mt-1 bg-white dark:bg-slate-800 rounded-xl border border-sky-200 dark:border-sky-800 p-6 space-y-6">
        ${this.editHeader('Editando: Cobrança', () => this.saveCobranca(), () => this.cancelCobranca())}

        <section>
          <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Dados do titular</h3>
          <div class="max-w-xs">
            <groupentertext--ml-cpf-input
              value="${this.cpf}"
              name="cpf"
              is-editing="true"
              @change=${(e: CustomEvent) => { this.cpf = e.detail.value; }}
            >
              <Label>CPF do titular</Label>
            </groupentertext--ml-cpf-input>
          </div>
        </section>

        <section>
          <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Limites de gastos</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <groupentermoney--ml-enter-money-br
              .value=${this.spendingLimit}
              name="spendingLimit"
              is-editing="true"
              currency="BRL"
              @change=${(e: CustomEvent) => { if (e.detail.value != null) this.spendingLimit = e.detail.value; }}
            >
              <Label>Limite mensal de gastos</Label>
              <Helper>Valor máximo de gastos no mês</Helper>
            </groupentermoney--ml-enter-money-br>

            <groupentermoney--ml-enter-money-br
              .value=${this.spendingAlert}
              name="spendingAlert"
              is-editing="true"
              currency="BRL"
              @change=${(e: CustomEvent) => { if (e.detail.value != null) this.spendingAlert = e.detail.value; }}
            >
              <Label>Alerta de valor</Label>
              <Helper>Notificar ao atingir este valor</Helper>
            </groupentermoney--ml-enter-money-br>
          </div>
        </section>

        <section>
          <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Pagamento e conformidade</h3>
          <div class="space-y-3">
            <groupenterboolean--ml-toggle-switch
              .value=${this.autoPayment}
              name="autoPayment"
              is-editing="true"
              @change=${(e: CustomEvent) => { this.autoPayment = e.detail.value; }}
            >
              <Label>Pagamento automático</Label>
              <Helper>Debitar automaticamente na data de vencimento</Helper>
            </groupenterboolean--ml-toggle-switch>

            <groupenterboolean--ml-checkbox-preference
              .value=${this.termsAccepted}
              name="termsAccepted"
              is-editing="true"
              @change=${(e: CustomEvent) => { this.termsAccepted = e.detail.value; }}
            >
              <Label>Aceite de termos de cobrança</Label>
              <Helper>Confirmar leitura e aceite dos termos de cobrança vigentes</Helper>
            </groupenterboolean--ml-checkbox-preference>
          </div>
        </section>
      </div>`;
  }

  // ── Controles interativos de Preferências (fora do ml-tabs) ──────────────────
  private renderPreferenciasControls() {
    return html`
      <div class="mt-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        <div class="flex items-center gap-2 mb-5 pb-4 border-b border-slate-200 dark:border-slate-700">
          <span class="inline-block w-2 h-2 rounded-full bg-violet-500"></span>
          <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-300">Preferências — aplicação imediata</h2>
        </div>

        <section>
          <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Localização</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <groupselectone--ml-select-dropdown
              value="${this.language}"
              name="language"
              is-editing="true"
              @change=${(e: CustomEvent) => { this.language = e.detail.value; this.viewEpoch++; }}
            >
              <Label>Idioma</Label>
              <Item value="pt-BR">Português (Brasil)</Item>
              <Item value="en-US">English (US)</Item>
              <Item value="es-419">Español (Latam)</Item>
            </groupselectone--ml-select-dropdown>

            <groupselectone--ml-select-dropdown
              value="${this.timezone}"
              name="timezone"
              is-editing="true"
              @change=${(e: CustomEvent) => { this.timezone = e.detail.value; this.viewEpoch++; }}
            >
              <Label>Fuso horário</Label>
              <Item value="America/Sao_Paulo">São Paulo (GMT-3)</Item>
              <Item value="America/Manaus">Manaus (GMT-4)</Item>
              <Item value="America/Belem">Belém (GMT-3)</Item>
              <Item value="UTC">UTC</Item>
            </groupselectone--ml-select-dropdown>
          </div>
        </section>

        <section>
          <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Aparência</h3>
          <groupselectone--ml-segmented-control
            value="${this.theme}"
            name="theme"
            is-editing="true"
            @change=${(e: CustomEvent) => { this.theme = e.detail.value; this.viewEpoch++; }}
          >
            <Label>Tema da interface</Label>
            <Item value="light">Claro</Item>
            <Item value="dark">Escuro</Item>
            <Item value="auto">Automático</Item>
          </groupselectone--ml-segmented-control>
        </section>
      </div>`;
  }

  // ── Decide qual formulário/painel de edição exibir ────────────────────────────
  private renderActivePanel() {
    if (this.activeTab === 'perfil'    && this.isEditingPerfil)    return this.renderPerfilEditForm();
    if (this.activeTab === 'seguranca' && this.isEditingSeguranca) return this.renderSegurancaEditForm();
    if (this.activeTab === 'cobranca'  && this.isEditingCobranca)  return this.renderCobrancaEditForm();
    if (this.activeTab === 'preferencias')                         return this.renderPreferenciasControls();
    return nothing;
  }

  // ── ml-tabs com wrapper alternado (viewEpoch trick) ───────────────────────────
  private renderTabs() {
    const tabs = html`
<groupnavigatesection--ml-tabs
  value="${this.activeTab}"
  @change=${(e: CustomEvent) => { this.activeTab = e.detail.value; }}
  @request-edit=${(e: CustomEvent) => { this.handleRequestEdit(e.detail.tab); }}
>

  <Tab value="perfil" title="Perfil">
    ${this.isEditingPerfil
      ? html`<div class="py-1 text-xs text-sky-600 dark:text-sky-400 italic">Editando perfil…</div>`
      : this.renderPerfilView()}
  </Tab>

  <Tab value="seguranca" title="Segurança">
    ${this.isEditingSeguranca
      ? html`<div class="py-1 text-xs text-sky-600 dark:text-sky-400 italic">Editando segurança…</div>`
      : this.renderSegurancaView()}
  </Tab>

  <Tab value="cobranca" title="Cobrança">
    ${this.isEditingCobranca
      ? html`<div class="py-1 text-xs text-sky-600 dark:text-sky-400 italic">Editando cobrança…</div>`
      : this.renderCobrancaView()}
  </Tab>

  <Tab value="preferencias" title="Preferências">
    ${this.renderPreferenciasView()}
  </Tab>

</groupnavigatesection--ml-tabs>`;

    // Wrapper alternado força Lit a criar nova instância do ml-tabs quando
    // viewEpoch muda, fazendo o novo elemento re-ler os Tab filhos via parseTabs().
    return this.viewEpoch % 2 === 0
      ? html`<div>${tabs}</div>`
      : html`<div class="w-full">${tabs}</div>`;
  }

  // ── Render principal ──────────────────────────────────────────────────────────
  render() {
    return html`
<div class="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans">
  <div class="max-w-4xl mx-auto px-6 py-8">

    <!-- Cabeçalho da página -->
    <div class="flex items-start gap-4 mb-8">
      <div class="w-10 h-10 rounded-lg bg-sky-600 flex items-center justify-center shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div>
        <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Configurações da Conta</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          ${this.name} — cada aba pode ser editada de forma independente
        </p>
      </div>
    </div>

    <!-- Abas de configuração -->
    ${this.renderTabs()}

    <!-- Formulário de edição / painel de preferências (fora do ml-tabs para ter reatividade Lit plena) -->
    ${this.renderActivePanel()}

    <!-- Toast de confirmação -->
    <groupnotifyuser--ml-toast-notification
      type="success"
      .visible=${this.toastVisible}
      @close=${() => { this.toastVisible = false; }}
    >
      ${this.toastMsg}
    </groupnotifyuser--ml-toast-notification>

  </div>
</div>`;
  }
}
