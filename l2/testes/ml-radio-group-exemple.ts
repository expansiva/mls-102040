/// <mls fileReference="_102040_/l2/testes/ml-radio-group-exemple.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupselectone/ml-radio-group';

interface Config {
  value: string;
  isEditing: boolean;
  required: boolean;
  disabled: boolean;
  readonly: boolean;
  loading: boolean;
  error: string;
}

@customElement('testes--ml-radio-group-exemple')
export class MlRadioGroupExemple extends StateLitElement {

  @state() basic: Config = {
    value: '', isEditing: true, required: false,
    disabled: false, readonly: false, loading: false, error: '',
  };

  @state() grouped: Config = {
    value: '', isEditing: true, required: false,
    disabled: false, readonly: false, loading: false, error: '',
  };

  private toggle(cfg: Config, key: keyof Omit<Config, 'value' | 'error'>): Config {
    return { ...cfg, [key]: !cfg[key] };
  }

  private renderToggle(label: string, active: boolean, onClick: () => void): TemplateResult {
    return html`
<button
  class="${active
    ? 'bg-sky-500 text-white border-sky-500'
    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
  } border rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer"
  @click=${onClick}
>${label}</button>`;
  }

  private renderConfig(cfg: Config, update: (next: Config) => void): TemplateResult {
    return html`
<div class="flex flex-col gap-4">
  <div>
    <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Props</p>
    <div class="flex flex-col gap-2">
      ${this.renderToggle('is-editing', cfg.isEditing, () => update(this.toggle(cfg, 'isEditing')))}
      ${this.renderToggle('required',   cfg.required,   () => update(this.toggle(cfg, 'required')))}
      ${this.renderToggle('disabled',   cfg.disabled,   () => update(this.toggle(cfg, 'disabled')))}
      ${this.renderToggle('readonly',   cfg.readonly,   () => update(this.toggle(cfg, 'readonly')))}
      ${this.renderToggle('loading',    cfg.loading,    () => update(this.toggle(cfg, 'loading')))}
    </div>
  </div>
  <div>
    <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">error</p>
    <input
      type="text"
      placeholder="Mensagem de erro..."
      .value=${cfg.error}
      @input=${(e: InputEvent) => update({ ...cfg, error: (e.target as HTMLInputElement).value })}
      class="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
    />
  </div>
  ${cfg.value ? html`
  <div class="pt-2 border-t border-slate-100 dark:border-slate-700">
    <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">value</p>
    <p class="text-sm font-medium text-slate-800 dark:text-slate-100">${cfg.value}</p>
  </div>` : html``}
</div>`;
  }

  render() {
    return html`
<div class="bg-slate-50 dark:bg-slate-900 min-h-screen p-8 font-sans">

  <header class="mb-10">
    <h1 class="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-1">ml-radio-group</h1>
    <p class="text-sm text-slate-500 dark:text-slate-400">
      <code class="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs">groupselectone--ml-radio-group</code>
    </p>
  </header>

  <!-- Exemplo básico -->
  <section class="mb-10">
    <h2 class="text-base font-semibold text-slate-700 dark:text-slate-200 mb-4">Exemplo básico</h2>
    <div class="grid grid-cols-[200px_1fr] gap-6 items-start">

      <!-- Config -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        ${this.renderConfig(this.basic, (next) => { this.basic = next; })}
      </div>

      <!-- Component -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <groupselectone--ml-radio-group
          value="${this.basic.value}"
          name="size"
          error="${this.basic.error}"
          .isEditing=${this.basic.isEditing}
          .required=${this.basic.required}
          .disabled=${this.basic.disabled}
          .readonly=${this.basic.readonly}
          .loading=${this.basic.loading}
          @change=${(e: CustomEvent) => { this.basic = { ...this.basic, value: e.detail.value }; }}
        >
          <Label>Tamanho do plano</Label>
          <Helper>Escolha o plano que melhor se encaixa no seu uso.</Helper>
          <Item value="small">Small</Item>
          <Item value="medium">Medium</Item>
          <Item value="large">Large</Item>
        </groupselectone--ml-radio-group>
      </div>

    </div>
  </section>

  <!-- Exemplo em grupo -->
  <section>
    <h2 class="text-base font-semibold text-slate-700 dark:text-slate-200 mb-4">Exemplo em grupo</h2>
    <div class="grid grid-cols-[200px_1fr] gap-6 items-start">

      <!-- Config -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        ${this.renderConfig(this.grouped, (next) => { this.grouped = next; })}
      </div>

      <!-- Component -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <groupselectone--ml-radio-group
          value="${this.grouped.value}"
          name="department"
          error="${this.grouped.error}"
          .isEditing=${this.grouped.isEditing}
          .required=${this.grouped.required}
          .disabled=${this.grouped.disabled}
          .readonly=${this.grouped.readonly}
          .loading=${this.grouped.loading}
          @change=${(e: CustomEvent) => { this.grouped = { ...this.grouped, value: e.detail.value }; }}
        >
          <Label>Departamento</Label>
          <Helper>Selecione o departamento onde o funcionário será alocado.</Helper>
          <Group label="Tecnologia">
            <Item value="engineering">Engenharia de Software</Item>
            <Item value="data">Dados e Analytics</Item>
            <Item value="infra">Infraestrutura</Item>
          </Group>
          <Group label="Negócios">
            <Item value="product">Produto</Item>
            <Item value="marketing">Marketing</Item>
            <Item value="sales">Vendas</Item>
          </Group>
          <Group label="Corporativo">
            <Item value="finance">Financeiro</Item>
            <Item value="legal">Jurídico</Item>
            <Item value="hr" disabled>Recursos Humanos (sem vagas)</Item>
          </Group>
        </groupselectone--ml-radio-group>
      </div>

    </div>
  </section>

</div>`;
  }
}
