/// <mls fileReference="_102040_/l2/testes/product-edit.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupentertext/ml-floating-text-input';
import '/_102040_/l2/molecules/groupentertext/ml-multiline-text';
import '/_102040_/l2/molecules/groupentermoney/ml-enter-money-br';
import '/_102040_/l2/molecules/groupenternumber/ml-number-input';
import '/_102040_/l2/molecules/groupenternumber/ml-number-stepper';
import '/_102040_/l2/molecules/groupselectone/ml-select-dropdown';
import '/_102040_/l2/molecules/groupselectmany/ml-multi-checkbox-list';
import '/_102040_/l2/molecules/groupenterboolean/ml-toggle-switch';
import '/_102040_/l2/molecules/groupnotifyuser/ml-toast-notification';

interface ProductSnapshot {
  productName: string;
  sku: string;
  barcode: string;
  description: string;
  salePrice: number | null;
  costPrice: number | null;
  stock: number | null;
  minStock: number | null;
  packQty: number | null;
  category: string;
  supplier: string;
  tags: string;
  isActive: boolean;
  availOnline: boolean;
}

@customElement('testes--product-edit')
export class ProductEdit extends StateLitElement {

  // ── Modo de edição ─────────────────────────────────────────────────────────
  @state() isEditing    = false;
  @state() toastVisible = false;
  @state() errors: Record<string, string> = {};

  // ── Campos do formulário ───────────────────────────────────────────────────
  @state() productName  = 'Cabo de Rede Cat6 5m';
  @state() sku          = 'CAB-CAT6-5M-GRY';
  @state() barcode      = '7891234567890';
  @state() description  = 'Cabo de rede Ethernet Cat6 5 metros, blindado, conector RJ45 banhado a ouro. Ideal para instalações residenciais e comerciais de alta velocidade.';
  @state() salePrice:  number | null = 34.90;
  @state() costPrice:  number | null = 18.90;
  @state() stock:      number | null = 248;
  @state() minStock:   number | null = 50;
  @state() packQty:    number | null = 10;
  @state() category    = 'networking';
  @state() supplier    = 'tech-supply';
  @state() tags        = 'cabos,redes,cat6';
  @state() isActive    = true;
  @state() availOnline = true;

  // ── Snapshot para cancelamento ─────────────────────────────────────────────
  private snapshot!: ProductSnapshot;

  private takeSnapshot(): ProductSnapshot {
    return {
      productName: this.productName,
      sku:         this.sku,
      barcode:     this.barcode,
      description: this.description,
      salePrice:   this.salePrice,
      costPrice:   this.costPrice,
      stock:       this.stock,
      minStock:    this.minStock,
      packQty:     this.packQty,
      category:    this.category,
      supplier:    this.supplier,
      tags:        this.tags,
      isActive:    this.isActive,
      availOnline: this.availOnline,
    };
  }

  private restoreSnapshot() {
    this.productName  = this.snapshot.productName;
    this.sku          = this.snapshot.sku;
    this.barcode      = this.snapshot.barcode;
    this.description  = this.snapshot.description;
    this.salePrice    = this.snapshot.salePrice;
    this.costPrice    = this.snapshot.costPrice;
    this.stock        = this.snapshot.stock;
    this.minStock     = this.snapshot.minStock;
    this.packQty      = this.snapshot.packQty;
    this.category     = this.snapshot.category;
    this.supplier     = this.snapshot.supplier;
    this.tags         = this.snapshot.tags;
    this.isActive     = this.snapshot.isActive;
    this.availOnline  = this.snapshot.availOnline;
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
    if (!this.productName.trim())
      e.productName = 'Nome do produto é obrigatório.';
    if (!this.sku.trim())
      e.sku = 'SKU é obrigatório.';
    if (this.salePrice === null || this.salePrice <= 0)
      e.salePrice = 'Preço de venda deve ser maior que zero.';
    if (this.stock === null || this.stock < 0)
      e.stock = 'Estoque não pode ser negativo.';
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

  // ── Helpers ────────────────────────────────────────────────────────────────
  private get margin(): string {
    if (!this.salePrice || !this.costPrice || this.salePrice <= 0) return '—';
    const pct = ((this.salePrice - this.costPrice) / this.salePrice) * 100;
    return pct.toFixed(1) + '%';
  }

  private get marginColor(): string {
    if (!this.salePrice || !this.costPrice) return 'text-slate-500 dark:text-slate-400';
    const pct = ((this.salePrice - this.costPrice) / this.salePrice) * 100;
    if (pct >= 40) return 'text-emerald-600 dark:text-emerald-400';
    if (pct >= 20) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  }

  private get stockStatus(): { label: string; color: string } {
    const s = this.stock ?? 0;
    const m = this.minStock ?? 0;
    if (s === 0)    return { label: 'Sem estoque',    color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' };
    if (s <= m)     return { label: 'Estoque baixo',  color: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' };
    return             { label: 'Em estoque',       color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' };
  }

  private get categoryLabel(): string {
    const map: Record<string, string> = {
      networking: 'Redes e Conectividade', hardware: 'Hardware', software: 'Software',
      peripherals: 'Periféricos', storage: 'Armazenamento', power: 'Energia',
    };
    return map[this.category] ?? this.category;
  }

  private get supplierLabel(): string {
    const map: Record<string, string> = {
      'tech-supply': 'TechSupply Brasil', 'global-tech': 'Global Tech Ltda',
      'redes-br': 'Redes BR Distribuidora', 'direct-import': 'Direct Import',
    };
    return map[this.supplier] ?? this.supplier;
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  render() {
    const ss = this.stockStatus;

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
    <Title>Produto atualizado</Title>
    <Message>${this.productName} (${this.sku}) foi salvo com sucesso.</Message>
  </groupnotifyuser--ml-toast-notification>

  <div class="max-w-3xl mx-auto px-6 py-10">

    <!-- Cabeçalho: nome + status + ações -->
    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
      <div>
        <div class="flex items-center gap-3 flex-wrap">
          <h1 class="text-xl font-bold text-slate-800 dark:text-slate-100">${this.productName}</h1>
          <span class="px-2 py-0.5 rounded-full text-xs font-medium ${ss.color}">${ss.label}</span>
          ${this.isActive
            ? html`<span class="px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300">Ativo</span>`
            : html`<span class="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">Inativo</span>`}
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          SKU: <span class="font-mono">${this.sku}</span>
          · ${this.categoryLabel}
          · ${this.supplierLabel}
        </p>
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
          >Salvar produto</button>
        ` : html`
          <button
            class="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600
                   text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            @click=${this.edit}
          >Editar</button>
        `}
      </div>
    </div>

    <!-- ─── Seção: Identificação ─────────────────────────────────────────── -->
    <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-4">
      <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
        Identificação
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

        <div class="sm:col-span-2">
          <groupentertext--ml-floating-text-input
            value="${this.productName}"
            name="productName"
            is-editing="${this.isEditing}"
            error="${this.err('productName')}"
            @change=${(e: CustomEvent) => { this.productName = e.detail.value; }}
          >
            <Label>Nome do produto</Label>
          </groupentertext--ml-floating-text-input>
        </div>

        <groupentertext--ml-floating-text-input
          value="${this.sku}"
          name="sku"
          is-editing="${this.isEditing}"
          error="${this.err('sku')}"
          @change=${(e: CustomEvent) => { this.sku = e.detail.value; }}
        >
          <Label>SKU</Label>
          <Helper>Código único do produto no catálogo</Helper>
        </groupentertext--ml-floating-text-input>

        <groupentertext--ml-floating-text-input
          value="${this.barcode}"
          name="barcode"
          is-editing="${this.isEditing}"
          @change=${(e: CustomEvent) => { this.barcode = e.detail.value; }}
        >
          <Label>Código de barras (EAN)</Label>
        </groupentertext--ml-floating-text-input>

      </div>
    </section>

    <!-- ─── Seção: Descrição ─────────────────────────────────────────────── -->
    <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-4">
      <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
        Descrição
      </h2>

      <groupentertext--ml-multiline-text
        value="${this.description}"
        name="description"
        rows="4"
        is-editing="${this.isEditing}"
        @change=${(e: CustomEvent) => { this.description = e.detail.value; }}
      >
        <Label>Descrição do produto</Label>
        <Helper>Exibida no catálogo e nas notas fiscais</Helper>
      </groupentertext--ml-multiline-text>

    </section>

    <!-- ─── Seção: Precificação ───────────────────────────────────────────── -->
    <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-4">
      <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
        Precificação
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">

        <groupentermoney--ml-enter-money-br
          .value=${this.salePrice}
          name="salePrice"
          is-editing="${this.isEditing}"
          error="${this.err('salePrice')}"
          @change=${(e: CustomEvent) => { this.salePrice = e.detail.value; }}
        >
          <Label>Preço de venda</Label>
        </groupentermoney--ml-enter-money-br>

        <groupentermoney--ml-enter-money-br
          .value=${this.costPrice}
          name="costPrice"
          is-editing="${this.isEditing}"
          @change=${(e: CustomEvent) => { this.costPrice = e.detail.value; }}
        >
          <Label>Preço de custo</Label>
          <Helper>Custo médio ponderado</Helper>
        </groupentermoney--ml-enter-money-br>

        <!-- Margem bruta — sempre somente leitura -->
        <div class="flex flex-col">
          <span class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Margem bruta</span>
          <div class="flex items-center h-10">
            <span class="text-2xl font-bold ${this.marginColor}">${this.margin}</span>
          </div>
          <span class="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Calculada automaticamente
          </span>
        </div>

      </div>
    </section>

    <!-- ─── Seção: Estoque ────────────────────────────────────────────────── -->
    <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-4">
      <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
        Estoque
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">

        <groupenternumber--ml-number-input
          .value=${this.stock}
          .min=${0}
          name="stock"
          is-editing="${this.isEditing}"
          error="${this.err('stock')}"
          @change=${(e: CustomEvent) => { this.stock = e.detail.value; }}
        >
          <Label>Estoque atual</Label>
          <Helper>Quantidade disponível</Helper>
          <Suffix>un</Suffix>
        </groupenternumber--ml-number-input>

        <groupenternumber--ml-number-input
          .value=${this.minStock}
          .min=${0}
          name="minStock"
          is-editing="${this.isEditing}"
          @change=${(e: CustomEvent) => { this.minStock = e.detail.value; }}
        >
          <Label>Estoque mínimo</Label>
          <Helper>Alerta de reposição</Helper>
          <Suffix>un</Suffix>
        </groupenternumber--ml-number-input>

        <groupenternumber--ml-number-stepper
          .value=${this.packQty}
          .min=${1}
          .max=${100}
          .step=${1}
          name="packQty"
          is-editing="${this.isEditing}"
          @change=${(e: CustomEvent) => { this.packQty = e.detail.value; }}
        >
          <Label>Qtd. por embalagem</Label>
          <Helper>Itens na caixa master</Helper>
        </groupenternumber--ml-number-stepper>

      </div>
    </section>

    <!-- ─── Seção: Classificação ─────────────────────────────────────────── -->
    <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-4">
      <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
        Classificação
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

        <groupselectone--ml-select-dropdown
          value="${this.category}"
          name="category"
          is-editing="${this.isEditing}"
          @change=${(e: CustomEvent) => { this.category = e.detail.value; }}
        >
          <Label>Categoria principal</Label>
          <Item value="networking">Redes e Conectividade</Item>
          <Item value="hardware">Hardware</Item>
          <Item value="software">Software</Item>
          <Item value="peripherals">Periféricos</Item>
          <Item value="storage">Armazenamento</Item>
          <Item value="power">Energia</Item>
        </groupselectone--ml-select-dropdown>

        <groupselectone--ml-select-dropdown
          value="${this.supplier}"
          name="supplier"
          is-editing="${this.isEditing}"
          @change=${(e: CustomEvent) => { this.supplier = e.detail.value; }}
        >
          <Label>Fornecedor</Label>
          <Item value="tech-supply">TechSupply Brasil</Item>
          <Item value="global-tech">Global Tech Ltda</Item>
          <Item value="redes-br">Redes BR Distribuidora</Item>
          <Item value="direct-import">Direct Import</Item>
        </groupselectone--ml-select-dropdown>

        <div class="sm:col-span-2">
          <groupselectmany--ml-multi-checkbox-list
            value="${this.tags}"
            name="tags"
            is-editing="${this.isEditing}"
            @change=${(e: CustomEvent) => { this.tags = e.detail.value; }}
          >
            <Label>Tags / categorias secundárias</Label>
            <Helper>Facilita a busca no catálogo interno</Helper>
            <Item value="cabos">Cabos</Item>
            <Item value="redes">Redes</Item>
            <Item value="cat6">Cat6</Item>
            <Item value="hardware">Hardware</Item>
            <Item value="perifericos">Periféricos</Item>
            <Item value="acessorios">Acessórios</Item>
            <Item value="bestseller">Mais vendidos</Item>
            <Item value="promocao">Em promoção</Item>
          </groupselectmany--ml-multi-checkbox-list>
        </div>

      </div>
    </section>

    <!-- ─── Seção: Disponibilidade ───────────────────────────────────────── -->
    <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
      <h2 class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
        Disponibilidade
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

        <groupenterboolean--ml-toggle-switch
          .value=${this.isActive}
          name="isActive"
          is-editing="${this.isEditing}"
          @change=${(e: CustomEvent) => {
            this.isActive = e.detail.value;
            if (!this.isActive) this.availOnline = false;
          }}
        >
          <Label>Produto ativo</Label>
          <Helper>Produto visível e disponível para pedidos</Helper>
        </groupenterboolean--ml-toggle-switch>

        <groupenterboolean--ml-toggle-switch
          .value=${this.availOnline}
          .disabled=${!this.isActive}
          name="availOnline"
          is-editing="${this.isEditing}"
          @change=${(e: CustomEvent) => { this.availOnline = e.detail.value; }}
        >
          <Label>Disponível para venda online</Label>
          <Helper>Exibido na loja virtual e integrações</Helper>
        </groupenterboolean--ml-toggle-switch>

      </div>
    </section>

  </div>
</div>
    `;
  }
}
