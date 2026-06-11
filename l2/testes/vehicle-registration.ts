/// <mls fileReference="_102040_/l2/testes/vehicle-registration.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupentertext/ml-floating-text-input';
import '/_102040_/l2/molecules/groupselectone/ml-combobox';
import '/_102040_/l2/molecules/groupselectone/ml-select-one-autocomplete';
import '/_102040_/l2/molecules/groupselectone/ml-segmented-control';
import '/_102040_/l2/molecules/groupenternumber/ml-number-input';
import '/_102040_/l2/molecules/groupnotifyuser/ml-notify-banner';

@customElement('testes--vehicle-registration')
export class VehicleRegistration extends StateLitElement {

  // ── Controle (read-only) ─────────────────────────────────────────────────────
  @state() codigo = 'VH-00042';
  @state() dataInclusao = '15/03/2024';
  @state() dataModificacao = '10/06/2026';

  // ── Identificação ────────────────────────────────────────────────────────────
  @state() placa = 'GHT-5821';
  @state() situacao = 'disponivel';

  // ── Dados do Veículo ─────────────────────────────────────────────────────────
  @state() marca = 'Fiat';
  @state() modelo = 'Toro';
  @state() anoFabricacao: number | null = 2022;
  @state() anoModelo: number | null = 2023;

  // ── Estado Atual ─────────────────────────────────────────────────────────────
  @state() quilometragem: number | null = 34500;

  // ── UI ───────────────────────────────────────────────────────────────────────
  @state() errors: Record<string, string> = {};
  @state() saved = false;

  // ── Dados ─────────────────────────────────────────────────────────────────────
  private readonly currentYear = new Date().getFullYear();

  private readonly brands = [
    'Chevrolet', 'Fiat', 'Ford', 'Honda', 'Hyundai',
    'Jeep', 'Nissan', 'Renault', 'Toyota', 'Volkswagen',
  ];

  private readonly modelsByBrand: Record<string, string[]> = {
    chevrolet:  ['Cruze', 'Montana', 'Onix', 'S10', 'Tracker'],
    fiat:       ['Argo', 'Cronos', 'Fastback', 'Mobi', 'Pulse', 'Strada', 'Toro'],
    ford:       ['Bronco Sport', 'EcoSport', 'Maverick', 'Ranger', 'Territory'],
    honda:      ['City', 'Civic', 'Fit', 'HR-V', 'WR-V'],
    hyundai:    ['Creta', 'HB20', 'HB20S', 'Santa Fe', 'Tucson'],
    jeep:       ['Commander', 'Compass', 'Renegade', 'Wrangler'],
    nissan:     ['Frontier', 'Kicks', 'Sentra', 'Versa'],
    renault:    ['Captur', 'Duster', 'Kardian', 'Kwid', 'Logan', 'Oroch'],
    toyota:     ['Corolla', 'Corolla Cross', 'Hilux', 'RAV4', 'Yaris'],
    volkswagen: ['Amarok', 'Gol', 'Polo', 'T-Cross', 'Taos', 'Virtus'],
  };

  // ── Helpers ───────────────────────────────────────────────────────────────────
  private err(field: string): string {
    return this.errors[field] ?? '';
  }

  private getModelos(): string[] {
    return this.modelsByBrand[this.marca.toLowerCase()] ?? [];
  }

  // ── Validação ─────────────────────────────────────────────────────────────────
  private validate(): boolean {
    const e: Record<string, string> = {};
    const placaRe = /^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/i;

    if (!this.placa.trim())
      e.placa = 'Placa é obrigatória.';
    else if (!placaRe.test(this.placa.replace(/\s/g, '')))
      e.placa = 'Formato inválido. Use ABC-1234 ou Mercosul ABC1D23.';

    if (!this.marca)
      e.marca = 'Marca é obrigatória.';

    if (!this.modelo)
      e.modelo = 'Modelo é obrigatório.';

    if (this.anoFabricacao === null)
      e.anoFabricacao = 'Ano de fabricação é obrigatório.';
    else if (this.anoFabricacao < 1950 || this.anoFabricacao > this.currentYear)
      e.anoFabricacao = `Informe um ano entre 1950 e ${this.currentYear}.`;

    if (this.anoModelo === null)
      e.anoModelo = 'Ano do modelo é obrigatório.';
    else if (this.anoFabricacao !== null &&
             (this.anoModelo < this.anoFabricacao || this.anoModelo > this.anoFabricacao + 1))
      e.anoModelo = 'Deve ser igual ou até um ano acima do Ano de Fabricação.';

    if (this.quilometragem === null)
      e.quilometragem = 'Quilometragem é obrigatória.';
    else if (this.quilometragem < 0)
      e.quilometragem = 'Quilometragem não pode ser negativa.';

    this.errors = e;
    return Object.keys(e).length === 0;
  }

  // ── Ações ─────────────────────────────────────────────────────────────────────
  private handleSave() {
    if (!this.validate()) return;
    this.dataModificacao = new Date().toLocaleDateString('pt-BR');
    this.saved = true;
  }

  private handleCancel() {
    this.placa = 'GHT-5821';
    this.situacao = 'disponivel';
    this.marca = 'Fiat';
    this.modelo = 'Toro';
    this.anoFabricacao = 2022;
    this.anoModelo = 2023;
    this.quilometragem = 34500;
    this.errors = {};
    this.saved = false;
  }

  // ── Render principal ──────────────────────────────────────────────────────────
  render() {
    return html`
<div class="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans">
  <div class="max-w-3xl mx-auto px-6 py-10">

    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-1">
        <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Registro de Veículo</h1>
        <span class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300">
          locadora
        </span>
      </div>
      <p class="text-sm text-slate-500 dark:text-slate-400">
        Edição de cadastro — campos marcados com * são obrigatórios.
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
        <Message>O registro do veículo ${this.placa} foi atualizado com sucesso.</Message>
      </groupnotifyuser--ml-notify-banner>
    </div>

    <!-- Card principal -->
    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 space-y-8">
      ${this.renderControle()}
      ${this.renderIdentificacao()}
      ${this.renderDadosVeiculo()}
      ${this.renderEstadoAtual()}
    </div>

    <!-- Rodapé -->
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

  </div>
</div>
    `;
  }

  // ── Seção: Controle ───────────────────────────────────────────────────────────
  private renderControle() {
    return html`
<div>
  ${this.renderSectionHeader('Controle')}
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

    <div class="opacity-60 pointer-events-none">
      <groupentertext--ml-floating-text-input
        value="${this.codigo}"
        name="codigo"
        disabled
      >
        <Label>Código</Label>
      </groupentertext--ml-floating-text-input>
    </div>

    <div class="opacity-60 pointer-events-none">
      <groupentertext--ml-floating-text-input
        value="${this.dataInclusao}"
        name="dataInclusao"
        disabled
      >
        <Label>Data de Inclusão</Label>
      </groupentertext--ml-floating-text-input>
    </div>

    <div class="opacity-60 pointer-events-none">
      <groupentertext--ml-floating-text-input
        value="${this.dataModificacao}"
        name="dataModificacao"
        disabled
      >
        <Label>Data de Modificação</Label>
      </groupentertext--ml-floating-text-input>
    </div>

  </div>
</div>
    `;
  }

  // ── Seção: Identificação ──────────────────────────────────────────────────────
  private renderIdentificacao() {
    return html`
<div>
  ${this.renderSectionHeader('Identificação')}
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

    <groupentertext--ml-floating-text-input
      value="${this.placa}"
      name="placa"
      placeholder="AAA-0000"
      error="${this.err('placa')}"
      @change=${(e: CustomEvent) => { this.placa = (e.detail.value as string).toUpperCase(); this.errors = {}; }}
    >
      <Label>Placa *</Label>
      <Helper>Formato antigo (ABC-1234) ou Mercosul (ABC1D23)</Helper>
    </groupentertext--ml-floating-text-input>

    <groupselectone--ml-segmented-control
      value="${this.situacao}"
      name="situacao"
      error="${this.err('situacao')}"
      @change=${(e: CustomEvent) => { this.situacao = e.detail.value; this.errors = {}; }}
    >
      <Label>Situação *</Label>
      <Item value="disponivel">Disponível</Item>
      <Item value="locado">Locado</Item>
      <Item value="manutencao">Manutenção</Item>
    </groupselectone--ml-segmented-control>

  </div>
</div>
    `;
  }

  // ── Seção: Dados do Veículo ───────────────────────────────────────────────────
  private renderDadosVeiculo() {
    return html`
<div>
  ${this.renderSectionHeader('Dados do Veículo')}
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

    <groupselectone--ml-combobox
      value="${this.marca}"
      name="marca"
      error="${this.err('marca')}"
      @change=${(e: CustomEvent) => {
        this.marca = e.detail.value;
        if (!this.getModelos().includes(this.modelo)) this.modelo = '';
        this.errors = {};
      }}
    >
      <Label>Marca *</Label>
      ${this.brands.map(b => html`<Item value="${b}">${b}</Item>`)}
    </groupselectone--ml-combobox>

    <groupselectone--ml-select-one-autocomplete
      value="${this.modelo}"
      name="modelo"
      locale="pt"
      error="${this.err('modelo')}"
      @change=${(e: CustomEvent) => { this.modelo = e.detail.value; this.errors = {}; }}
    >
      <Label>Modelo *</Label>
      ${this.getModelos().map(m => html`<Item value="${m}">${m}</Item>`)}
    </groupselectone--ml-select-one-autocomplete>

    <groupenternumber--ml-number-input
      .value=${this.anoFabricacao}
      name="anoFabricacao"
      .min=${1950}
      .max=${this.currentYear}
      .step=${1}
      error="${this.err('anoFabricacao')}"
      locale="pt-BR"
      @change=${(e: CustomEvent) => { this.anoFabricacao = e.detail.value; this.errors = {}; }}
    >
      <Label>Ano de Fabricação *</Label>
    </groupenternumber--ml-number-input>

    <groupenternumber--ml-number-input
      .value=${this.anoModelo}
      name="anoModelo"
      .min=${1950}
      .max=${this.currentYear + 1}
      .step=${1}
      error="${this.err('anoModelo')}"
      locale="pt-BR"
      @change=${(e: CustomEvent) => { this.anoModelo = e.detail.value; this.errors = {}; }}
    >
      <Label>Ano do Modelo *</Label>
    </groupenternumber--ml-number-input>

  </div>
</div>
    `;
  }

  // ── Seção: Estado Atual ───────────────────────────────────────────────────────
  private renderEstadoAtual() {
    return html`
<div>
  ${this.renderSectionHeader('Estado Atual')}
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

    <groupenternumber--ml-number-input
      .value=${this.quilometragem}
      name="quilometragem"
      .min=${0}
      .step=${1000}
      error="${this.err('quilometragem')}"
      locale="pt-BR"
      @change=${(e: CustomEvent) => { this.quilometragem = e.detail.value; this.errors = {}; }}
    >
      <Label>Quilometragem Atual (km) *</Label>
      <Helper>Hodômetro registrado na última vistoria</Helper>
    </groupenternumber--ml-number-input>

  </div>
</div>
    `;
  }

  // ── Helper: cabeçalho de seção ────────────────────────────────────────────────
  private renderSectionHeader(title: string) {
    return html`
<div class="flex items-center gap-3 mb-4">
  <h2 class="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">
    ${title}
  </h2>
  <div class="flex-1 h-px bg-slate-100 dark:bg-slate-700"></div>
</div>
    `;
  }
}
