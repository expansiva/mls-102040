/// <mls fileReference="_102040_/l2/testes/system-settings.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupnavigatesection/ml-tabs';
import '/_102040_/l2/molecules/groupentertext/ml-floating-text-input';
import '/_102040_/l2/molecules/groupselectone/ml-select-dropdown';
import '/_102040_/l2/molecules/groupselectone/ml-segmented-control';
import '/_102040_/l2/molecules/groupenternumber/ml-number-input';
import '/_102040_/l2/molecules/groupentermoney/ml-enter-money-br';
import '/_102040_/l2/molecules/groupenterboolean/ml-toggle-switch';
import '/_102040_/l2/molecules/groupenterboolean/ml-checkbox-preference';
import '/_102040_/l2/molecules/groupnotifyuser/ml-toast-notification';

// ── Snapshot interfaces ───────────────────────────────────────────────────────
interface GeralSnapshot {
  companyName: string; domain: string; supportEmail: string;
  language: string; timezone: string; currency: string; theme: string;
}
interface NotifSnapshot {
  emailNotif: boolean; smsNotif: boolean; pushNotif: boolean; require2fa: boolean;
}
interface LimitesSnapshot {
  autoApproveLimit: number; defaultingAlert: number;
  sessionTimeout: number; loginAttempts: number;
}
interface IntegracoesSnapshot {
  erp: string; termsAccepted: boolean; dataRetention: boolean;
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
// Solução (mesma do ml-accordion em supplier-edit.ts):
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
// ─────────────────────────────────────────────────────────────────────────────

@customElement('testes--system-settings')
export class SystemSettings extends StateLitElement {

  // ── Navegação ───────────────────────────────────────────────────────────────
  @state() activeTab = 'geral';
  @state() viewEpoch = 0;  // incr. força recriação do ml-tabs

  // ── Toast ────────────────────────────────────────────────────────────────────
  @state() toastVisible = false;
  @state() toastMsg     = '';

  // ── Estado de edição por aba ─────────────────────────────────────────────────
  @state() isEditingGeral       = false;
  @state() isEditingNotif       = false;
  @state() isEditingLimites     = false;
  @state() isEditingIntegracoes = false;
  @state() errors: Record<string, string> = {};

  // ── Campos: Geral ─────────────────────────────────────────────────────────────
  @state() companyName  = 'Empresa Demo Ltda';
  @state() domain       = 'empresademo.com.br';
  @state() supportEmail = 'suporte@empresademo.com.br';
  @state() language     = 'pt-BR';
  @state() timezone     = 'America/Sao_Paulo';
  @state() currency     = 'BRL';
  @state() theme        = 'system';

  // ── Campos: Notificações ──────────────────────────────────────────────────────
  @state() emailNotif = true;
  @state() smsNotif   = false;
  @state() pushNotif  = true;
  @state() require2fa = true;

  // ── Campos: Limites Financeiros ───────────────────────────────────────────────
  @state() autoApproveLimit = 500000; // centavos → R$ 5.000,00
  @state() defaultingAlert  = 4;      // %
  @state() sessionTimeout   = 30;     // minutos
  @state() loginAttempts    = 5;

  // ── Campos: Integrações ───────────────────────────────────────────────────────
  @state() erp           = 'sap';
  @state() termsAccepted = true;
  @state() dataRetention = false;

  // ── Snapshots para cancelamento ───────────────────────────────────────────────
  private snapshotGeral!:       GeralSnapshot;
  private snapshotNotif!:       NotifSnapshot;
  private snapshotLimites!:     LimitesSnapshot;
  private snapshotIntegracoes!: IntegracoesSnapshot;

  // ── Ações: Geral ──────────────────────────────────────────────────────────────
  private editGeral() {
    this.snapshotGeral = {
      companyName: this.companyName,   domain:       this.domain,
      supportEmail: this.supportEmail, language:     this.language,
      timezone:    this.timezone,      currency:     this.currency,
      theme:       this.theme,
    };
    this.errors = {};
    this.isEditingGeral = true;
    this.viewEpoch++;
  }
  private cancelGeral() {
    this.companyName  = this.snapshotGeral.companyName;
    this.domain       = this.snapshotGeral.domain;
    this.supportEmail = this.snapshotGeral.supportEmail;
    this.language     = this.snapshotGeral.language;
    this.timezone     = this.snapshotGeral.timezone;
    this.currency     = this.snapshotGeral.currency;
    this.theme        = this.snapshotGeral.theme;
    this.errors       = {};
    this.isEditingGeral = false;
    this.viewEpoch++;
  }
  private saveGeral() {
    const e: Record<string, string> = {};
    if (!this.companyName.trim())  e.companyName  = 'Nome da empresa é obrigatório.';
    if (!this.supportEmail.trim()) e.supportEmail = 'E-mail é obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.supportEmail))
      e.supportEmail = 'Informe um e-mail válido.';
    this.errors = e;
    if (Object.keys(e).length > 0) return;
    this.snapshotGeral = {
      companyName: this.companyName,   domain:       this.domain,
      supportEmail: this.supportEmail, language:     this.language,
      timezone:    this.timezone,      currency:     this.currency,
      theme:       this.theme,
    };
    this.toastMsg       = 'Configurações gerais salvas com sucesso.';
    this.toastVisible   = true;
    this.isEditingGeral = false;
    this.viewEpoch++;
  }

  // ── Ações: Notificações ───────────────────────────────────────────────────────
  private editNotif() {
    this.snapshotNotif = {
      emailNotif: this.emailNotif, smsNotif:   this.smsNotif,
      pushNotif:  this.pushNotif,  require2fa: this.require2fa,
    };
    this.isEditingNotif = true;
    this.viewEpoch++;
  }
  private cancelNotif() {
    this.emailNotif = this.snapshotNotif.emailNotif;
    this.smsNotif   = this.snapshotNotif.smsNotif;
    this.pushNotif  = this.snapshotNotif.pushNotif;
    this.require2fa = this.snapshotNotif.require2fa;
    this.isEditingNotif = false;
    this.viewEpoch++;
  }
  private saveNotif() {
    this.snapshotNotif = {
      emailNotif: this.emailNotif, smsNotif:   this.smsNotif,
      pushNotif:  this.pushNotif,  require2fa: this.require2fa,
    };
    this.toastMsg       = 'Configurações de notificações salvas.';
    this.toastVisible   = true;
    this.isEditingNotif = false;
    this.viewEpoch++;
  }

  // ── Ações: Limites ────────────────────────────────────────────────────────────
  private editLimites() {
    this.snapshotLimites = {
      autoApproveLimit: this.autoApproveLimit, defaultingAlert: this.defaultingAlert,
      sessionTimeout:   this.sessionTimeout,   loginAttempts:   this.loginAttempts,
    };
    this.isEditingLimites = true;
    this.viewEpoch++;
  }
  private cancelLimites() {
    this.autoApproveLimit = this.snapshotLimites.autoApproveLimit;
    this.defaultingAlert  = this.snapshotLimites.defaultingAlert;
    this.sessionTimeout   = this.snapshotLimites.sessionTimeout;
    this.loginAttempts    = this.snapshotLimites.loginAttempts;
    this.isEditingLimites = false;
    this.viewEpoch++;
  }
  private saveLimites() {
    this.snapshotLimites = {
      autoApproveLimit: this.autoApproveLimit, defaultingAlert: this.defaultingAlert,
      sessionTimeout:   this.sessionTimeout,   loginAttempts:   this.loginAttempts,
    };
    this.toastMsg         = 'Limites financeiros salvos.';
    this.toastVisible     = true;
    this.isEditingLimites = false;
    this.viewEpoch++;
  }

  // ── Ações: Integrações ────────────────────────────────────────────────────────
  private editIntegracoes() {
    this.snapshotIntegracoes = {
      erp:           this.erp,
      termsAccepted: this.termsAccepted,
      dataRetention: this.dataRetention,
    };
    this.isEditingIntegracoes = true;
    this.viewEpoch++;
  }
  private cancelIntegracoes() {
    this.erp           = this.snapshotIntegracoes.erp;
    this.termsAccepted = this.snapshotIntegracoes.termsAccepted;
    this.dataRetention = this.snapshotIntegracoes.dataRetention;
    this.isEditingIntegracoes = false;
    this.viewEpoch++;
  }
  private saveIntegracoes() {
    this.snapshotIntegracoes = {
      erp:           this.erp,
      termsAccepted: this.termsAccepted,
      dataRetention: this.dataRetention,
    };
    this.toastMsg             = 'Configurações de integrações salvas.';
    this.toastVisible         = true;
    this.isEditingIntegracoes = false;
    this.viewEpoch++;
  }

  // ── Disparado pelo botão "Editar" dentro dos Tab elements ─────────────────────
  // O botão usa onclick inline com CustomEvent composed:true, que cruza o shadow
  // boundary do ml-tabs e chega ao listener @request-edit no pai.
  private handleRequestEdit(tab: string) {
    this.activeTab = tab;
    switch (tab) {
      case 'geral':       this.editGeral();       break;
      case 'notif':       this.editNotif();       break;
      case 'limites':     this.editLimites();     break;
      case 'integracoes': this.editIntegracoes(); break;
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
  private get currencyLabel(): string {
    return ({ BRL: 'Real (BRL)', USD: 'Dólar (USD)', EUR: 'Euro (EUR)' })[this.currency] ?? this.currency;
  }
  private get themeLabel(): string {
    return ({ light: 'Claro', dark: 'Escuro', system: 'Automático' })[this.theme] ?? this.theme;
  }
  private get erpLabel(): string {
    return ({ sap: 'SAP', totvs: 'TOTVS', oracle: 'Oracle ERP', none: 'Nenhum' })[this.erp] ?? this.erp;
  }
  private formatMoney(centavos: number): string {
    const [int, dec] = (centavos / 100).toFixed(2).split('.');
    return 'R$ ' + int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + dec;
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
  // Estes métodos retornam TemplateResult que Lit renderiza no light DOM do
  // elemento <Tab>. ml-tabs lê el.innerHTML após o render e serializa como HTML.
  // Valores dinâmicos (${this.foo}) são renderizados por Lit antes da leitura.
  // ─────────────────────────────────────────────────────────────────────────────

  private renderGeralView() {
    return html`
      <div>
        <div class="flex justify-end mb-3">
          <button
            onclick="this.dispatchEvent(new CustomEvent('request-edit',{bubbles:true,composed:true,detail:{tab:'geral'}}))"
            class="px-3 py-1.5 text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition">
            Editar
          </button>
        </div>
        <div class="grid grid-cols-[1fr,auto] gap-x-8 gap-y-2.5 text-sm max-w-lg">
          <span class="text-slate-500 dark:text-slate-400">Nome da empresa</span>
          <span class="font-semibold text-slate-800 dark:text-slate-100 text-right">${this.companyName}</span>
          <span class="text-slate-500 dark:text-slate-400">Domínio</span>
          <span class="font-mono text-slate-700 dark:text-slate-200 text-right">${this.domain}</span>
          <span class="text-slate-500 dark:text-slate-400">E-mail de suporte</span>
          <span class="text-slate-700 dark:text-slate-200 text-right">${this.supportEmail}</span>
          <span class="text-slate-500 dark:text-slate-400">Idioma</span>
          <span class="text-slate-700 dark:text-slate-200 text-right">${this.languageLabel}</span>
          <span class="text-slate-500 dark:text-slate-400">Fuso horário</span>
          <span class="text-slate-700 dark:text-slate-200 text-right">${this.timezoneLabel}</span>
          <span class="text-slate-500 dark:text-slate-400">Moeda</span>
          <span class="text-slate-700 dark:text-slate-200 text-right">${this.currencyLabel}</span>
          <span class="text-slate-500 dark:text-slate-400">Tema</span>
          <span class="text-slate-700 dark:text-slate-200 text-right">${this.themeLabel}</span>
        </div>
      </div>`;
  }

  private renderNotifView() {
    return html`
      <div>
        <div class="flex justify-end mb-3">
          <button
            onclick="this.dispatchEvent(new CustomEvent('request-edit',{bubbles:true,composed:true,detail:{tab:'notif'}}))"
            class="px-3 py-1.5 text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition">
            Editar
          </button>
        </div>
        <div class="grid grid-cols-[1fr,auto] gap-x-8 gap-y-3 text-sm max-w-sm">
          <span class="text-slate-500 dark:text-slate-400">Notificações por e-mail</span>
          ${this.badge(this.emailNotif, 'Ativo', 'Inativo')}
          <span class="text-slate-500 dark:text-slate-400">Notificações por SMS</span>
          ${this.badge(this.smsNotif, 'Ativo', 'Inativo')}
          <span class="text-slate-500 dark:text-slate-400">Notificações push</span>
          ${this.badge(this.pushNotif, 'Ativo', 'Inativo')}
          <span class="text-slate-500 dark:text-slate-400">2FA obrigatório</span>
          ${this.badge(this.require2fa, 'Ativo', 'Inativo')}
        </div>
      </div>`;
  }

  private renderLimitesView() {
    return html`
      <div>
        <div class="flex justify-end mb-3">
          <button
            onclick="this.dispatchEvent(new CustomEvent('request-edit',{bubbles:true,composed:true,detail:{tab:'limites'}}))"
            class="px-3 py-1.5 text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition">
            Editar
          </button>
        </div>
        <div class="grid grid-cols-[1fr,auto] gap-x-8 gap-y-2.5 text-sm max-w-sm">
          <span class="text-slate-500 dark:text-slate-400">Aprovação automática</span>
          <span class="font-semibold text-slate-800 dark:text-slate-100 text-right">${this.formatMoney(this.autoApproveLimit)}</span>
          <span class="text-slate-500 dark:text-slate-400">Alerta de inadimplência</span>
          <span class="text-slate-700 dark:text-slate-200 text-right">${this.defaultingAlert}%</span>
          <span class="text-slate-500 dark:text-slate-400">Timeout de sessão</span>
          <span class="text-slate-700 dark:text-slate-200 text-right">${this.sessionTimeout} min</span>
          <span class="text-slate-500 dark:text-slate-400">Tentativas de login</span>
          <span class="text-slate-700 dark:text-slate-200 text-right">${this.loginAttempts}</span>
        </div>
      </div>`;
  }

  private renderIntegracoesView() {
    return html`
      <div>
        <div class="flex justify-end mb-3">
          <button
            onclick="this.dispatchEvent(new CustomEvent('request-edit',{bubbles:true,composed:true,detail:{tab:'integracoes'}}))"
            class="px-3 py-1.5 text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition">
            Editar
          </button>
        </div>
        <div class="grid grid-cols-[1fr,auto] gap-x-8 gap-y-2.5 text-sm max-w-sm">
          <span class="text-slate-500 dark:text-slate-400">Sistema ERP</span>
          <span class="font-semibold text-slate-800 dark:text-slate-100 text-right">${this.erpLabel}</span>
          <span class="text-slate-500 dark:text-slate-400">Termos de uso</span>
          ${this.badge(this.termsAccepted, 'Aceito', 'Pendente')}
          <span class="text-slate-500 dark:text-slate-400">Política de retenção</span>
          ${this.badge(this.dataRetention, 'Habilitada', 'Desabilitada')}
        </div>
      </div>`;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // EDIT FORM RENDERERS — formulários renderizados fora do ml-tabs
  // Aqui temos acesso total ao sistema reativo do Lit (event handlers, etc.)
  // ─────────────────────────────────────────────────────────────────────────────

  private renderGeralEditForm() {
    return html`
      <div class="mt-1 bg-white dark:bg-slate-800 rounded-xl border border-sky-200 dark:border-sky-800 p-6 space-y-6">
        ${this.editHeader('Editando: Configurações Gerais', () => this.saveGeral(), () => this.cancelGeral())}

        <section>
          <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Identificação</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <groupentertext--ml-floating-text-input
              value="${this.companyName}"
              name="companyName"
              is-editing="true"
              required
              error="${this.err('companyName')}"
              @change=${(e: CustomEvent) => { this.companyName = e.detail.value; }}
            >
              <Label>Nome da empresa</Label>
            </groupentertext--ml-floating-text-input>
            <groupentertext--ml-floating-text-input
              value="${this.domain}"
              name="domain"
              is-editing="true"
              @change=${(e: CustomEvent) => { this.domain = e.detail.value; }}
            >
              <Label>Domínio</Label>
            </groupentertext--ml-floating-text-input>
          </div>
          <div class="mt-4">
            <groupentertext--ml-floating-text-input
              value="${this.supportEmail}"
              name="supportEmail"
              is-editing="true"
              error="${this.err('supportEmail')}"
              @change=${(e: CustomEvent) => { this.supportEmail = e.detail.value; }}
            >
              <Label>E-mail de suporte</Label>
            </groupentertext--ml-floating-text-input>
          </div>
        </section>

        <section>
          <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Localização</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <groupselectone--ml-select-dropdown
              value="${this.language}"
              name="language"
              is-editing="true"
              @change=${(e: CustomEvent) => { this.language = e.detail.value; }}
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
              @change=${(e: CustomEvent) => { this.timezone = e.detail.value; }}
            >
              <Label>Fuso horário</Label>
              <Item value="America/Sao_Paulo">São Paulo (GMT-3)</Item>
              <Item value="America/Manaus">Manaus (GMT-4)</Item>
              <Item value="America/Belem">Belém (GMT-3)</Item>
              <Item value="UTC">UTC</Item>
            </groupselectone--ml-select-dropdown>
            <groupselectone--ml-select-dropdown
              value="${this.currency}"
              name="currency"
              is-editing="true"
              @change=${(e: CustomEvent) => { this.currency = e.detail.value; }}
            >
              <Label>Moeda</Label>
              <Item value="BRL">Real (BRL)</Item>
              <Item value="USD">Dólar (USD)</Item>
              <Item value="EUR">Euro (EUR)</Item>
            </groupselectone--ml-select-dropdown>
          </div>
        </section>

        <section>
          <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Aparência</h3>
          <groupselectone--ml-segmented-control
            value="${this.theme}"
            name="theme"
            is-editing="true"
            @change=${(e: CustomEvent) => { this.theme = e.detail.value; }}
          >
            <Label>Tema da interface</Label>
            <Item value="light">Claro</Item>
            <Item value="dark">Escuro</Item>
            <Item value="system">Automático</Item>
          </groupselectone--ml-segmented-control>
        </section>
      </div>`;
  }

  private renderNotifEditForm() {
    return html`
      <div class="mt-1 bg-white dark:bg-slate-800 rounded-xl border border-sky-200 dark:border-sky-800 p-6 space-y-6">
        ${this.editHeader('Editando: Notificações', () => this.saveNotif(), () => this.cancelNotif())}

        <section>
          <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Canais de comunicação</h3>
          <div class="space-y-3">
            <groupenterboolean--ml-toggle-switch
              .value=${this.emailNotif}
              name="emailNotif"
              is-editing="true"
              @change=${(e: CustomEvent) => { this.emailNotif = e.detail.value; }}
            >
              <Label>Notificações por e-mail</Label>
              <Helper>Receber alertas e relatórios por e-mail</Helper>
            </groupenterboolean--ml-toggle-switch>

            <groupenterboolean--ml-toggle-switch
              .value=${this.smsNotif}
              name="smsNotif"
              is-editing="true"
              @change=${(e: CustomEvent) => { this.smsNotif = e.detail.value; }}
            >
              <Label>Notificações por SMS</Label>
              <Helper>Receber alertas críticos por mensagem de texto</Helper>
            </groupenterboolean--ml-toggle-switch>

            <groupenterboolean--ml-toggle-switch
              .value=${this.pushNotif}
              name="pushNotif"
              is-editing="true"
              @change=${(e: CustomEvent) => { this.pushNotif = e.detail.value; }}
            >
              <Label>Notificações push</Label>
              <Helper>Receber notificações no navegador</Helper>
            </groupenterboolean--ml-toggle-switch>
          </div>
        </section>

        <section>
          <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Segurança</h3>
          <groupenterboolean--ml-toggle-switch
            .value=${this.require2fa}
            name="require2fa"
            is-editing="true"
            @change=${(e: CustomEvent) => { this.require2fa = e.detail.value; }}
          >
            <Label>2FA obrigatório</Label>
            <Helper>Exigir autenticação em dois fatores para todos os usuários</Helper>
          </groupenterboolean--ml-toggle-switch>
        </section>
      </div>`;
  }

  private renderLimitesEditForm() {
    return html`
      <div class="mt-1 bg-white dark:bg-slate-800 rounded-xl border border-sky-200 dark:border-sky-800 p-6 space-y-6">
        ${this.editHeader('Editando: Limites Financeiros', () => this.saveLimites(), () => this.cancelLimites())}

        <section>
          <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Aprovação e alertas</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <groupentermoney--ml-enter-money-br
              .value=${this.autoApproveLimit}
              name="autoApproveLimit"
              is-editing="true"
              currency="BRL"
              @change=${(e: CustomEvent) => { if (e.detail.value != null) this.autoApproveLimit = e.detail.value; }}
            >
              <Label>Limite de aprovação automática</Label>
              <Helper>Compras abaixo deste valor são aprovadas automaticamente</Helper>
            </groupentermoney--ml-enter-money-br>

            <groupenternumber--ml-number-input
              .value=${this.defaultingAlert}
              .min=${0}
              .max=${100}
              .step=${1}
              name="defaultingAlert"
              is-editing="true"
              @change=${(e: CustomEvent) => { if (e.detail.value != null) this.defaultingAlert = e.detail.value; }}
            >
              <Label>Alerta de inadimplência</Label>
              <Suffix>%</Suffix>
            </groupenternumber--ml-number-input>
          </div>
        </section>

        <section>
          <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Segurança de acesso</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <groupenternumber--ml-number-input
              .value=${this.sessionTimeout}
              .min=${5}
              .max=${480}
              .step=${5}
              name="sessionTimeout"
              is-editing="true"
              @change=${(e: CustomEvent) => { if (e.detail.value != null) this.sessionTimeout = e.detail.value; }}
            >
              <Label>Timeout de sessão</Label>
              <Suffix>min</Suffix>
            </groupenternumber--ml-number-input>

            <groupenternumber--ml-number-input
              .value=${this.loginAttempts}
              .min=${1}
              .max=${10}
              .step=${1}
              name="loginAttempts"
              is-editing="true"
              @change=${(e: CustomEvent) => { if (e.detail.value != null) this.loginAttempts = e.detail.value; }}
            >
              <Label>Tentativas de login</Label>
            </groupenternumber--ml-number-input>
          </div>
        </section>
      </div>`;
  }

  private renderIntegracoesEditForm() {
    return html`
      <div class="mt-1 bg-white dark:bg-slate-800 rounded-xl border border-sky-200 dark:border-sky-800 p-6 space-y-6">
        ${this.editHeader('Editando: Integrações', () => this.saveIntegracoes(), () => this.cancelIntegracoes())}

        <section>
          <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Sistema ERP</h3>
          <div class="max-w-xs">
            <groupselectone--ml-select-dropdown
              value="${this.erp}"
              name="erp"
              is-editing="true"
              @change=${(e: CustomEvent) => { this.erp = e.detail.value; }}
            >
              <Label>Integração ERP</Label>
              <Item value="sap">SAP</Item>
              <Item value="totvs">TOTVS</Item>
              <Item value="oracle">Oracle ERP</Item>
              <Item value="none">Nenhum</Item>
            </groupselectone--ml-select-dropdown>
          </div>
        </section>

        <section>
          <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Conformidade e privacidade</h3>
          <div class="space-y-3">
            <groupenterboolean--ml-checkbox-preference
              .value=${this.termsAccepted}
              name="termsAccepted"
              is-editing="true"
              @change=${(e: CustomEvent) => { this.termsAccepted = e.detail.value; }}
            >
              <Label>Termos de uso atualizados</Label>
              <Helper>Confirmar leitura e aceite dos termos de uso vigentes</Helper>
            </groupenterboolean--ml-checkbox-preference>

            <groupenterboolean--ml-checkbox-preference
              .value=${this.dataRetention}
              name="dataRetention"
              is-editing="true"
              @change=${(e: CustomEvent) => { this.dataRetention = e.detail.value; }}
            >
              <Label>Política de retenção de dados</Label>
              <Helper>Habilitar exclusão automática de registros após 5 anos</Helper>
            </groupenterboolean--ml-checkbox-preference>
          </div>
        </section>
      </div>`;
  }

  // ── Decide qual formulário de edição exibir ───────────────────────────────────
  private renderActiveEditForm() {
    if (this.activeTab === 'geral'       && this.isEditingGeral)       return this.renderGeralEditForm();
    if (this.activeTab === 'notif'       && this.isEditingNotif)       return this.renderNotifEditForm();
    if (this.activeTab === 'limites'     && this.isEditingLimites)     return this.renderLimitesEditForm();
    if (this.activeTab === 'integracoes' && this.isEditingIntegracoes) return this.renderIntegracoesEditForm();
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

  <Tab value="geral" title="Geral">
    ${this.isEditingGeral
      ? html`<div class="py-1 text-xs text-sky-600 dark:text-sky-400 italic">Editando configurações gerais…</div>`
      : this.renderGeralView()}
  </Tab>

  <Tab value="notif" title="Notificações">
    ${this.isEditingNotif
      ? html`<div class="py-1 text-xs text-sky-600 dark:text-sky-400 italic">Editando notificações…</div>`
      : this.renderNotifView()}
  </Tab>

  <Tab value="limites" title="Limites Financeiros">
    ${this.isEditingLimites
      ? html`<div class="py-1 text-xs text-sky-600 dark:text-sky-400 italic">Editando limites financeiros…</div>`
      : this.renderLimitesView()}
  </Tab>

  <Tab value="integracoes" title="Integrações">
    ${this.isEditingIntegracoes
      ? html`<div class="py-1 text-xs text-sky-600 dark:text-sky-400 italic">Editando integrações…</div>`
      : this.renderIntegracoesView()}
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
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <div>
        <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Configurações do Sistema</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          ERP Demo — cada aba pode ser editada de forma independente
        </p>
      </div>
    </div>

    <!-- Abas de configuração -->
    ${this.renderTabs()}

    <!-- Formulário de edição (fora do ml-tabs para ter reatividade Lit plena) -->
    ${this.renderActiveEditForm()}

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
