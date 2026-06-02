/// <mls fileReference="_102040_/l2/testes/customer-profile.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupentertext/ml-floating-text-input';
import '/_102040_/l2/molecules/groupentertext/ml-cpf-input';
import '/_102040_/l2/molecules/groupentertext/ml-multiline-text';
import '/_102040_/l2/molecules/groupenterdate/ml-date-picker';
import '/_102040_/l2/molecules/groupselectone/ml-select-dropdown';
import '/_102040_/l2/molecules/groupselectone/ml-select-one-autocomplete';
import '/_102040_/l2/molecules/groupselectmany/ml-multi-checkbox-list';
import '/_102040_/l2/molecules/groupenterboolean/ml-checkbox-preference';
import '/_102040_/l2/molecules/groupnotifyuser/ml-toast-notification';

interface CustomerSnapshot {
  clientName:    string;
  personType:    string;
  cnpj:          string;
  cpf:           string;
  email:         string;
  phone:         string;
  segment:       string;
  city:          string;
  stateUF:       string;
  registerDate:  string;
  birthday:      string;
  channels:      string;
  acceptsOffers: boolean;
  acceptsWpp:    boolean;
  notes:         string;
}

@customElement('testes--customer-profile')
export class CustomerProfile extends StateLitElement {

  // ── Modo de edição ─────────────────────────────────────────────────────────
  @state() isEditing    = false;
  @state() toastVisible = false;
  @state() errors: Record<string, string> = {};

  // ── Campos do formulário ───────────────────────────────────────────────────
  @state() clientName    = 'Indústria Norte SA';
  @state() personType    = 'pj';
  @state() cnpj          = '12.345.678/0001-99';
  @state() cpf           = '';
  @state() email         = 'compras@industrianorte.com.br';
  @state() phone         = '(92) 3312-8800';
  @state() segment       = 'industry';
  @state() city          = 'Manaus';
  @state() stateUF       = 'AM';
  @state() registerDate  = '2021-04-10';
  @state() birthday      = '';
  @state() channels      = 'email,whatsapp';
  @state() acceptsOffers = true;
  @state() acceptsWpp    = true;
  @state() notes         = 'Cliente estratégico. Compras trimestrais de grande volume. Contato direto: João Figueiredo (92) 99812-3456.';

  // ── Snapshot para cancelamento ─────────────────────────────────────────────
  private snapshot!: CustomerSnapshot;

  private takeSnapshot(): CustomerSnapshot {
    return {
      clientName:    this.clientName,
      personType:    this.personType,
      cnpj:          this.cnpj,
      cpf:           this.cpf,
      email:         this.email,
      phone:         this.phone,
      segment:       this.segment,
      city:          this.city,
      stateUF:       this.stateUF,
      registerDate:  this.registerDate,
      birthday:      this.birthday,
      channels:      this.channels,
      acceptsOffers: this.acceptsOffers,
      acceptsWpp:    this.acceptsWpp,
      notes:         this.notes,
    };
  }

  private restoreSnapshot() {
    this.clientName    = this.snapshot.clientName;
    this.personType    = this.snapshot.personType;
    this.cnpj          = this.snapshot.cnpj;
    this.cpf           = this.snapshot.cpf;
    this.email         = this.snapshot.email;
    this.phone         = this.snapshot.phone;
    this.segment       = this.snapshot.segment;
    this.city          = this.snapshot.city;
    this.stateUF       = this.snapshot.stateUF;
    this.registerDate  = this.snapshot.registerDate;
    this.birthday      = this.snapshot.birthday;
    this.channels      = this.snapshot.channels;
    this.acceptsOffers = this.snapshot.acceptsOffers;
    this.acceptsWpp    = this.snapshot.acceptsWpp;
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
    if (!this.clientName.trim())
      e.clientName = 'Nome é obrigatório.';
    if (this.personType === 'pj' && !this.cnpj.trim())
      e.cnpj = 'CNPJ é obrigatório.';
    if (this.personType === 'pf' && !this.cpf.trim())
      e.cpf = 'CPF é obrigatório.';
    if (!this.email.trim())
      e.email = 'E-mail é obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email))
      e.email = 'Informe um e-mail válido.';
    if (!this.segment)
      e.segment = 'Segmento é obrigatório.';
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
  private get segmentLabel(): string {
    const map: Record<string, string> = {
      industry: 'Indústria', retail: 'Varejo', services: 'Serviços',
      agribusiness: 'Agronegócio', construction: 'Construção', technology: 'Tecnologia',
      health: 'Saúde', education: 'Educação', finance: 'Financeiro',
    };
    return map[this.segment] ?? this.segment;
  }

  private get initials(): string {
    return this.clientName.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }

  private get personTypeLabel(): string {
    return this.personType === 'pj' ? 'Pessoa Jurídica' : 'Pessoa Física';
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
    <Title>Cliente atualizado</Title>
    <Message>Os dados de ${this.clientName} foram salvos com sucesso.</Message>
  </groupnotifyuser--ml-toast-notification>

  <div class="max-w-3xl mx-auto px-6 py-10">

    <!-- Cabeçalho -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

      <div class="flex items-center gap-4">
        <div class="h-14 w-14 rounded-xl bg-violet-100 dark:bg-violet-900/60 flex items-center justify-center shrink-0">
          <span class="text-lg font-bold text-violet-600 dark:text-violet-300">${this.initials}</span>
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100">${this.clientName}</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            ${this.personTypeLabel} · ${this.segmentLabel}
            · ${this.city}${this.stateUF ? html` / ${this.stateUF}` : ''}
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
            class="px-4 py-2 text-sm font-medium rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition"
            @click=${this.save}
          >Salvar cliente</button>
        ` : html`
          <button
            class="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600
                   text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            @click=${this.edit}
          >Editar</button>
        `}
      </div>

    </div>

    <!-- ─── Seção: Dados Cadastrais ───────────────────────────────────────── -->
    <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-4">
      <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
        Dados Cadastrais
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

        <div class="sm:col-span-2">
          <groupentertext--ml-floating-text-input
            value="${this.clientName}"
            name="clientName"
            is-editing="${this.isEditing}"
            error="${this.err('clientName')}"
            @change=${(e: CustomEvent) => { this.clientName = e.detail.value; }}
          >
            <Label>Razão social / Nome</Label>
          </groupentertext--ml-floating-text-input>
        </div>

        <groupselectone--ml-select-dropdown
          value="${this.personType}"
          name="personType"
          is-editing="${this.isEditing}"
          @change=${(e: CustomEvent) => {
            this.personType = e.detail.value;
            this.cnpj = '';
            this.cpf  = '';
          }}
        >
          <Label>Tipo de pessoa</Label>
          <Item value="pj">Pessoa Jurídica (CNPJ)</Item>
          <Item value="pf">Pessoa Física (CPF)</Item>
        </groupselectone--ml-select-dropdown>

        <!-- Documento: CNPJ para PJ -->
        ${this.personType === 'pj' ? html`
          <groupentertext--ml-floating-text-input
            value="${this.cnpj}"
            name="cnpj"
            is-editing="${this.isEditing}"
            error="${this.err('cnpj')}"
            @change=${(e: CustomEvent) => { this.cnpj = e.detail.value; }}
          >
            <Label>CNPJ</Label>
          </groupentertext--ml-floating-text-input>
        ` : html`
          <groupentertext--ml-cpf-input
            value="${this.cpf}"
            name="cpf"
            is-editing="${this.isEditing}"
            error="${this.err('cpf')}"
            @change=${(e: CustomEvent) => { this.cpf = e.detail.value; }}
          >
            <Label>CPF</Label>
          </groupentertext--ml-cpf-input>
        `}

        <groupselectone--ml-select-dropdown
          value="${this.segment}"
          name="segment"
          is-editing="${this.isEditing}"
          error="${this.err('segment')}"
          @change=${(e: CustomEvent) => { this.segment = e.detail.value; }}
        >
          <Label>Segmento</Label>
          <Item value="industry">Indústria</Item>
          <Item value="retail">Varejo</Item>
          <Item value="services">Serviços</Item>
          <Item value="agribusiness">Agronegócio</Item>
          <Item value="construction">Construção</Item>
          <Item value="technology">Tecnologia</Item>
          <Item value="health">Saúde</Item>
          <Item value="education">Educação</Item>
          <Item value="finance">Financeiro</Item>
        </groupselectone--ml-select-dropdown>

        <groupenterdate--ml-date-picker
          value="${this.registerDate}"
          name="registerDate"
          locale="pt-BR"
          is-editing="${this.isEditing}"
          @change=${(e: CustomEvent) => { this.registerDate = e.detail.value; }}
        >
          <Label>Data de cadastro</Label>
        </groupenterdate--ml-date-picker>

      </div>
    </section>

    <!-- ─── Seção: Contato e Localização ─────────────────────────────────── -->
    <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-4">
      <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
        Contato e Localização
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

        <groupentertext--ml-floating-text-input
          value="${this.email}"
          name="email"
          input-type="email"
          is-editing="${this.isEditing}"
          error="${this.err('email')}"
          @change=${(e: CustomEvent) => { this.email = e.detail.value; }}
        >
          <Label>E-mail principal</Label>
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

        <!-- Cidade via autocomplete com busca por digitação -->
        <groupselectone--ml-select-one-autocomplete
          value="${this.city}"
          name="city"
          placeholder="Digite para buscar..."
          is-editing="${this.isEditing}"
          clearable="true"
          @change=${(e: CustomEvent) => { this.city = e.detail.value ?? ''; }}
        >
          <Label>Cidade</Label>
          <Item value="Manaus">Manaus</Item>
          <Item value="Belém">Belém</Item>
          <Item value="São Paulo">São Paulo</Item>
          <Item value="Rio de Janeiro">Rio de Janeiro</Item>
          <Item value="Brasília">Brasília</Item>
          <Item value="Salvador">Salvador</Item>
          <Item value="Fortaleza">Fortaleza</Item>
          <Item value="Belo Horizonte">Belo Horizonte</Item>
          <Item value="Curitiba">Curitiba</Item>
          <Item value="Porto Alegre">Porto Alegre</Item>
          <Item value="Recife">Recife</Item>
          <Item value="Goiânia">Goiânia</Item>
          <Item value="Maceió">Maceió</Item>
          <Item value="Natal">Natal</Item>
          <Item value="Teresina">Teresina</Item>
          <Item value="Campos dos Goytacazes">Campos dos Goytacazes</Item>
          <Item value="Santarém">Santarém</Item>
          <Item value="Porto Velho">Porto Velho</Item>
          <Item value="Macapá">Macapá</Item>
          <Item value="Boa Vista">Boa Vista</Item>
        </groupselectone--ml-select-one-autocomplete>

        <groupselectone--ml-select-dropdown
          value="${this.stateUF}"
          name="stateUF"
          is-editing="${this.isEditing}"
          @change=${(e: CustomEvent) => { this.stateUF = e.detail.value; }}
        >
          <Label>Estado (UF)</Label>
          <Item value="AC">AC — Acre</Item>
          <Item value="AL">AL — Alagoas</Item>
          <Item value="AP">AP — Amapá</Item>
          <Item value="AM">AM — Amazonas</Item>
          <Item value="BA">BA — Bahia</Item>
          <Item value="CE">CE — Ceará</Item>
          <Item value="DF">DF — Distrito Federal</Item>
          <Item value="ES">ES — Espírito Santo</Item>
          <Item value="GO">GO — Goiás</Item>
          <Item value="MA">MA — Maranhão</Item>
          <Item value="MT">MT — Mato Grosso</Item>
          <Item value="MS">MS — Mato Grosso do Sul</Item>
          <Item value="MG">MG — Minas Gerais</Item>
          <Item value="PA">PA — Pará</Item>
          <Item value="PB">PB — Paraíba</Item>
          <Item value="PR">PR — Paraná</Item>
          <Item value="PE">PE — Pernambuco</Item>
          <Item value="PI">PI — Piauí</Item>
          <Item value="RJ">RJ — Rio de Janeiro</Item>
          <Item value="RN">RN — Rio Grande do Norte</Item>
          <Item value="RS">RS — Rio Grande do Sul</Item>
          <Item value="RO">RO — Rondônia</Item>
          <Item value="RR">RR — Roraima</Item>
          <Item value="SC">SC — Santa Catarina</Item>
          <Item value="SP">SP — São Paulo</Item>
          <Item value="SE">SE — Sergipe</Item>
          <Item value="TO">TO — Tocantins</Item>
        </groupselectone--ml-select-dropdown>

        <!-- Data de aniversário — visível apenas para PF -->
        ${this.personType === 'pf' ? html`
          <groupenterdate--ml-date-picker
            value="${this.birthday}"
            name="birthday"
            locale="pt-BR"
            is-editing="${this.isEditing}"
            @change=${(e: CustomEvent) => { this.birthday = e.detail.value; }}
          >
            <Label>Data de aniversário</Label>
            <Helper>Opcional — usado para campanhas de relacionamento</Helper>
          </groupenterdate--ml-date-picker>
        ` : html``}

      </div>
    </section>

    <!-- ─── Seção: Preferências de Comunicação ────────────────────────────── -->
    <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-4">
      <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
        Preferências de Comunicação
      </h2>
      <div class="space-y-5">

        <groupselectmany--ml-multi-checkbox-list
          value="${this.channels}"
          name="channels"
          is-editing="${this.isEditing}"
          @change=${(e: CustomEvent) => { this.channels = e.detail.value; }}
        >
          <Label>Canais preferidos</Label>
          <Helper>Por quais meios este cliente prefere ser contatado</Helper>
          <Item value="email">E-mail</Item>
          <Item value="whatsapp">WhatsApp</Item>
          <Item value="sms">SMS</Item>
          <Item value="phone">Ligação telefônica</Item>
          <Item value="letter">Correspondência</Item>
        </groupselectmany--ml-multi-checkbox-list>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-700">

          <groupenterboolean--ml-checkbox-preference
            .value=${this.acceptsOffers}
            name="acceptsOffers"
            is-editing="${this.isEditing}"
            @change=${(e: CustomEvent) => { this.acceptsOffers = e.detail.value; }}
          >
            <Label>Aceita receber ofertas e promoções</Label>
            <Helper>Consentimento para envio de campanhas comerciais</Helper>
          </groupenterboolean--ml-checkbox-preference>

          <groupenterboolean--ml-checkbox-preference
            .value=${this.acceptsWpp}
            name="acceptsWpp"
            is-editing="${this.isEditing}"
            @change=${(e: CustomEvent) => { this.acceptsWpp = e.detail.value; }}
          >
            <Label>Aceita mensagens via WhatsApp</Label>
            <Helper>Consentimento específico para canal WhatsApp (LGPD)</Helper>
          </groupenterboolean--ml-checkbox-preference>

        </div>

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
        <Helper>Visível apenas para a equipe de vendas</Helper>
      </groupentertext--ml-multiline-text>

    </section>

  </div>
</div>
    `;
  }
}
