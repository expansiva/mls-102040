/// <mls fileReference="_102040_/l2/testes/field-service-order.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupnavigatesteps/ml-vertical-stepper';
import '/_102040_/l2/molecules/groupscancode/ml-scan-code-1d';
import '/_102040_/l2/molecules/groupscancode/ml-scan-code';
import '/_102040_/l2/molecules/grouplocateposition/ml-locate-map-picker';
import '/_102040_/l2/molecules/grouplocateposition/ml-geolocation-trigger';
import '/_102040_/l2/molecules/groupshowprogress/ml-linear-progress';
import '/_102040_/l2/molecules/groupshowprogress/ml-indeterminate-spinner';
import '/_102040_/l2/molecules/groupentertime/ml-clock-time-picker';
import '/_102040_/l2/molecules/groupentertime/ml-time-scroll-picker';
import '/_102040_/l2/molecules/groupviewdata/ml-timeline-view';
import '/_102040_/l2/molecules/groupexpandcontent/ml-single-expand-content';
import '/_102040_/l2/molecules/grouptriggeraction/ml-button-standard';
import '/_102040_/l2/molecules/grouptriggeraction/ml-icon-button';
import '/_102040_/l2/molecules/groupentertext/ml-multiline-text';
import '/_102040_/l2/molecules/groupenterboolean/ml-checkbox-preference';
import '/_102040_/l2/molecules/groupnotifyuser/ml-toast-notification';

// =============================================================================
// TYPES
// =============================================================================
interface ChecklistItem {
  id: number;
  label: string;
  done: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================
@customElement('testes--field-service-order')
export class FieldServiceOrder extends StateLitElement {

  // ── Estado ─────────────────────────────────────────────────────────────────
  @state() currentStep = 0;
  @state() scannedBarcode = '';
  @state() scannedQr = '';
  @state() locationCoords = '';
  @state() arrivalTime = '';
  @state() preferredWindowStart = '08:00';
  @state() preferredWindowEnd = '17:00';
  @state() report = '';
  @state() loadingHistory = false;
  @state() historyLoaded = false;
  @state() toastVisible = false;
  @state() toastMessage = '';

  @state() checklist: ChecklistItem[] = [
    { id: 1, label: 'Identificar equipamento via código de barras', done: false },
    { id: 2, label: 'Confirmar localização no mapa',                done: false },
    { id: 3, label: 'Inspecionar filtro de ar',                     done: false },
    { id: 4, label: 'Verificar pressão de trabalho',                done: false },
    { id: 5, label: 'Testar válvula de segurança',                  done: false },
  ];

  // ── Dataset ────────────────────────────────────────────────────────────────
  private readonly order = {
    id: 'OS-2026-08841',
    priority: 'Alta',
    client: 'Indústria Norte SA',
    site: 'Galpão B — Bloco 3',
    equipment: {
      code: '7891234560012',
      name: 'Compressor Atlas Copco GA37',
      patrimony: 'PAT-00412',
      specs: 'Potência: 37 kW | Pressão nominal: 7,5 bar | Vazão: 217 m³/h | Tensão: 380V trifásico',
      lastMaintenance: '10/03/2026',
    },
    description: 'Compressor com ruído anormal e queda de pressão. Cliente relatou início há 2 dias.',
  };

  private readonly serviceHistory = [
    { date: '10/03/2026', type: 'Preventiva', tech: 'Rodrigo Alves',  result: 'Troca de filtro de ar' },
    { date: '22/11/2025', type: 'Corretiva',  tech: 'Lucas Ferreira', result: 'Substituição de correia' },
    { date: '05/07/2025', type: 'Preventiva', tech: 'Rodrigo Alves',  result: 'Revisão geral — aprovado' },
  ];

  // ── Getters ────────────────────────────────────────────────────────────────
  private get doneCount(): number {
    return this.checklist.filter(i => i.done).length;
  }

  private get allDone(): boolean {
    return this.doneCount === this.checklist.length;
  }

  private get checklistProgress(): number {
    return Math.round((this.doneCount / this.checklist.length) * 100);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  private toggleItem(id: number) {
    this.checklist = this.checklist.map(i =>
      i.id === id ? { ...i, done: !i.done } : i
    );
  }

  private showToast(msg: string) {
    this.toastMessage = msg;
    this.toastVisible = true;
    setTimeout(() => { this.toastVisible = false; }, 3000);
  }

  private loadHistory() {
    this.loadingHistory = true;
    setTimeout(() => {
      this.loadingHistory = false;
      this.historyLoaded = true;
    }, 1200);
  }

  private nextStep() {
    if (this.currentStep < 3) this.currentStep += 1;
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  render() {
    return html`
<div class="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans">

  <groupnotifyuser--ml-toast-notification
    .visible=${this.toastVisible}
    type="success"
    position="top-right"
    @dismiss=${() => { this.toastVisible = false; }}
  ><Message>${this.toastMessage}</Message></groupnotifyuser--ml-toast-notification>

  <div class="max-w-5xl mx-auto px-6 py-8">

    <!-- Cabeçalho da OS -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">${this.order.id}</h1>
          <span class="px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">
            Prioridade ${this.order.priority}
          </span>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400">${this.order.client} · ${this.order.site}</p>
      </div>
      <div class="flex gap-1">
        <grouptriggeraction--ml-icon-button title="Tirar foto" @action=${() => this.showToast('Câmera aberta')}>
          <Icon>📷</Icon>
        </grouptriggeraction--ml-icon-button>
        <grouptriggeraction--ml-icon-button title="Adicionar observação" @action=${() => this.showToast('Observação adicionada')}>
          <Icon>📝</Icon>
        </grouptriggeraction--ml-icon-button>
        <grouptriggeraction--ml-icon-button title="Ligar para solicitante" @action=${() => this.showToast('Discando para o solicitante...')}>
          <Icon>📞</Icon>
        </grouptriggeraction--ml-icon-button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">

      <!-- Stepper lateral -->
      <div class="lg:col-span-1">
        <groupnavigatesteps--ml-vertical-stepper
          value="${this.currentStep}"
          @change=${(e: CustomEvent) => { this.currentStep = Number(e.detail.value); }}
        >
          <Step title="Deslocamento" ?completed=${this.currentStep > 0}></Step>
          <Step title="Chegada"      ?completed=${this.currentStep > 1}></Step>
          <Step title="Execução"     ?completed=${this.currentStep > 2}></Step>
          <Step title="Conclusão"></Step>
        </groupnavigatesteps--ml-vertical-stepper>
      </div>

      <!-- Conteúdo da etapa ativa -->
      <div class="lg:col-span-3 space-y-4">

        <!-- ── Etapa 0: Deslocamento ─────────────────────────────────── -->
        ${this.currentStep === 0 ? html`

          <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 class="font-semibold text-slate-800 dark:text-slate-100 mb-4">Detalhes da chamada</h2>
            <dl class="space-y-3 text-sm">
              <div class="flex justify-between gap-4">
                <dt class="text-slate-500 dark:text-slate-400 shrink-0">Equipamento</dt>
                <dd class="font-medium text-slate-800 dark:text-slate-100 text-right">${this.order.equipment.name}</dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="text-slate-500 dark:text-slate-400 shrink-0">Patrimônio</dt>
                <dd class="font-mono text-slate-800 dark:text-slate-100">${this.order.equipment.patrimony}</dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="text-slate-500 dark:text-slate-400 shrink-0">Última manutenção</dt>
                <dd class="text-slate-800 dark:text-slate-100">${this.order.equipment.lastMaintenance}</dd>
              </div>
              <div class="pt-2 border-t border-slate-100 dark:border-slate-700">
                <dt class="text-slate-500 dark:text-slate-400 mb-1">Problema relatado</dt>
                <dd class="text-slate-700 dark:text-slate-200">${this.order.description}</dd>
              </div>
            </dl>
          </div>

          <groupexpandcontent--ml-single-expand-content>
            <Label>Dados técnicos do equipamento</Label>
            <Section title="Especificações técnicas">
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${this.order.equipment.specs}</p>
            </Section>
          </groupexpandcontent--ml-single-expand-content>

          <div class="flex justify-end">
            <grouptriggeraction--ml-button-standard @action=${() => this.nextStep()}>
              <Label>Iniciar deslocamento</Label>
            </grouptriggeraction--ml-button-standard>
          </div>

        ` : nothing}

        <!-- ── Etapa 1: Chegada ──────────────────────────────────────── -->
        ${this.currentStep === 1 ? html`

          <!-- Janela de atendimento preferencial -->
          <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h3 class="font-medium text-slate-800 dark:text-slate-100 mb-4">Janela de atendimento preferencial</h3>
            <div class="grid grid-cols-2 gap-4">
              <groupentertime--ml-time-scroll-picker
                value="${this.preferredWindowStart}"
                is-editing="true"
                @change=${(e: CustomEvent) => { this.preferredWindowStart = e.detail.value ?? ''; }}
              >
                <Label>Início</Label>
              </groupentertime--ml-time-scroll-picker>
              <groupentertime--ml-time-scroll-picker
                value="${this.preferredWindowEnd}"
                is-editing="true"
                @change=${(e: CustomEvent) => { this.preferredWindowEnd = e.detail.value ?? ''; }}
              >
                <Label>Fim</Label>
              </groupentertime--ml-time-scroll-picker>
            </div>
          </div>

          <!-- Scan do código de barras do equipamento -->
          <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h3 class="font-medium text-slate-800 dark:text-slate-100 mb-3">Código de barras do equipamento</h3>
            <groupscancode--ml-scan-code-1d
              @change=${(e: CustomEvent) => {
                this.scannedBarcode = e.detail?.value ?? '';
                if (this.scannedBarcode) {
                  this.checklist = this.checklist.map(i => i.id === 1 ? { ...i, done: true } : i);
                  this.showToast(`Código lido: ${this.scannedBarcode}`);
                }
              }}
              @capture=${() => {
                // Simula leitura bem-sucedida ao capturar frame
                this.scannedBarcode = this.order.equipment.code;
                this.checklist = this.checklist.map(i => i.id === 1 ? { ...i, done: true } : i);
                this.showToast(`Código identificado: ${this.scannedBarcode}`);
              }}
            >
              <Label>Escaneie o código do equipamento (EAN-13)</Label>
            </groupscancode--ml-scan-code-1d>
            ${this.scannedBarcode
              ? html`<p class="text-sm text-emerald-600 dark:text-emerald-400 mt-2">✓ ${this.scannedBarcode}</p>`
              : nothing
            }
          </div>

          <!-- Scan do QR Code do local -->
          <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h3 class="font-medium text-slate-800 dark:text-slate-100 mb-3">QR Code do local</h3>
            <groupscancode--ml-scan-code
              @capture=${() => {
                this.scannedQr = 'LOCAL-B-BLOCO3-G2';
                this.showToast('Local identificado: Galpão B, Bloco 3');
              }}
            >
              <Label>Escaneie o QR Code afixado na entrada do setor</Label>
            </groupscancode--ml-scan-code>
            ${this.scannedQr
              ? html`<p class="text-sm text-emerald-600 dark:text-emerald-400 mt-2">✓ ${this.scannedQr}</p>`
              : nothing
            }
          </div>

          <!-- GPS + Mapa -->
          <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h3 class="font-medium text-slate-800 dark:text-slate-100 mb-3">Confirmar localização</h3>
            <div class="flex items-center gap-3 mb-3">
              <grouplocateposition--ml-geolocation-trigger
                @change=${(e: CustomEvent) => {
                  this.locationCoords = e.detail.value ?? '';
                  this.checklist = this.checklist.map(i => i.id === 2 ? { ...i, done: true } : i);
                  this.showToast('Localização capturada via GPS');
                }}
              >
                <Label>Capturar GPS</Label>
              </grouplocateposition--ml-geolocation-trigger>
              ${this.locationCoords
                ? html`<span class="text-xs text-slate-500 dark:text-slate-400">📍 ${this.locationCoords}</span>`
                : nothing
              }
            </div>
            <grouplocateposition--ml-locate-map-picker
              value="${this.locationCoords}"
              is-editing="true"
              @change=${(e: CustomEvent) => {
                this.locationCoords = e.detail.value ?? '';
                this.checklist = this.checklist.map(i => i.id === 2 ? { ...i, done: true } : i);
              }}
            ></grouplocateposition--ml-locate-map-picker>
          </div>

          <!-- Horário de chegada -->
          <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h3 class="font-medium text-slate-800 dark:text-slate-100 mb-3">Horário de chegada</h3>
            <groupentertime--ml-clock-time-picker
              value="${this.arrivalTime}"
              is-editing="true"
              @change=${(e: CustomEvent) => { this.arrivalTime = e.detail.value ?? ''; }}
            >
              <Label>Registrar chegada ao local</Label>
            </groupentertime--ml-clock-time-picker>
            ${this.arrivalTime
              ? html`<p class="text-sm text-emerald-600 dark:text-emerald-400 mt-2">✓ Chegada registrada às ${this.arrivalTime}</p>`
              : nothing
            }
          </div>

          <div class="flex justify-end">
            <grouptriggeraction--ml-button-standard @action=${() => { this.nextStep(); if (!this.historyLoaded) this.loadHistory(); }}>
              <Label>Iniciar atendimento</Label>
            </grouptriggeraction--ml-button-standard>
          </div>

        ` : nothing}

        <!-- ── Etapa 2: Execução ─────────────────────────────────────── -->
        ${this.currentStep === 2 ? html`

          <!-- Checklist de tarefas -->
          <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium text-slate-800 dark:text-slate-100">Checklist de tarefas</h3>
              <span class="text-sm text-slate-500 dark:text-slate-400">${this.doneCount}/${this.checklist.length} concluídos</span>
            </div>
            <div class="mb-4">
              <groupshowprogress--ml-linear-progress value="${this.checklistProgress}"></groupshowprogress--ml-linear-progress>
            </div>
            <div class="space-y-3">
              ${this.checklist.map(item => html`
                <groupenterboolean--ml-checkbox-preference
                  .checked=${item.done}
                  is-editing="true"
                  @change=${() => this.toggleItem(item.id)}
                >
                  <Label>${item.label}</Label>
                </groupenterboolean--ml-checkbox-preference>
              `)}
            </div>
          </div>

          <!-- Histórico de atendimentos anteriores -->
          <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium text-slate-800 dark:text-slate-100">Histórico deste equipamento</h3>
              ${!this.historyLoaded && !this.loadingHistory ? html`
                <grouptriggeraction--ml-button-standard
                  size="sm"
                  variant="ghost"
                  @action=${() => this.loadHistory()}
                >
                  <Label>Carregar histórico</Label>
                </grouptriggeraction--ml-button-standard>
              ` : nothing}
            </div>

            ${this.loadingHistory ? html`
              <div class="flex items-center gap-3 py-6">
                <groupshowprogress--ml-indeterminate-spinner
                  size="small"
                  label="Carregando histórico"
                ></groupshowprogress--ml-indeterminate-spinner>
                <span class="text-sm text-slate-500 dark:text-slate-400">Consultando histórico de atendimentos...</span>
              </div>
            ` : this.historyLoaded ? html`
              <groupviewdata--ml-timeline-view>
                <Columns>
                  <Column field="date"   header="Data"       width="100px"></Column>
                  <Column field="type"   header="Tipo"       width="90px" ></Column>
                  <Column field="tech"   header="Técnico"    width="130px"></Column>
                  <Column field="result" header="Resultado"               ></Column>
                </Columns>
                <Rows>
                  ${this.serviceHistory.map(h => html`
                    <Row>
                      <Cell>${h.date}</Cell>
                      <Cell>
                        <span class="text-xs px-2 py-0.5 rounded-full ${h.type === 'Corretiva'
                          ? 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300'
                          : 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                        }">${h.type}</span>
                      </Cell>
                      <Cell>${h.tech}</Cell>
                      <Cell>${h.result}</Cell>
                    </Row>
                  `)}
                </Rows>
              </groupviewdata--ml-timeline-view>
            ` : html`
              <p class="text-sm text-slate-400 dark:text-slate-500 py-4 text-center">
                Clique em "Carregar histórico" para consultar atendimentos anteriores.
              </p>
            `}
          </div>

          <!-- Laudo técnico -->
          <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <groupentertext--ml-multiline-text
              .value=${this.report}
              rows="5"
              is-editing="true"
              placeholder="Descreva as causas identificadas, ações realizadas e recomendações..."
              @change=${(e: CustomEvent) => { this.report = e.detail.value ?? ''; }}
            >
              <Label>Laudo técnico / Observações da visita</Label>
            </groupentertext--ml-multiline-text>
          </div>

          <div class="flex justify-end">
            <grouptriggeraction--ml-button-standard @action=${() => this.nextStep()}>
              <Label>Ir para conclusão</Label>
            </grouptriggeraction--ml-button-standard>
          </div>

        ` : nothing}

        <!-- ── Etapa 3: Conclusão ────────────────────────────────────── -->
        ${this.currentStep === 3 ? html`

          <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            <h2 class="font-semibold text-slate-800 dark:text-slate-100">Resumo da OS</h2>

            <dl class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt class="text-slate-500 dark:text-slate-400">Número da OS</dt>
                <dd class="font-mono font-medium text-slate-800 dark:text-slate-100">${this.order.id}</dd>
              </div>
              <div>
                <dt class="text-slate-500 dark:text-slate-400">Horário de chegada</dt>
                <dd class="text-slate-800 dark:text-slate-100">${this.arrivalTime || '—'}</dd>
              </div>
              <div>
                <dt class="text-slate-500 dark:text-slate-400">Checklist</dt>
                <dd class="${this.allDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'} font-medium">
                  ${this.doneCount}/${this.checklist.length} itens
                </dd>
              </div>
              <div>
                <dt class="text-slate-500 dark:text-slate-400">Localização confirmada</dt>
                <dd class="text-slate-800 dark:text-slate-100">${this.locationCoords ? 'Sim' : 'Não'}</dd>
              </div>
              <div>
                <dt class="text-slate-500 dark:text-slate-400">Código lido</dt>
                <dd class="font-mono text-slate-800 dark:text-slate-100">${this.scannedBarcode || '—'}</dd>
              </div>
              <div>
                <dt class="text-slate-500 dark:text-slate-400">Laudo</dt>
                <dd class="${this.report ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}">
                  ${this.report ? 'Preenchido' : 'Não preenchido'}
                </dd>
              </div>
            </dl>

            ${!this.allDone ? html`
              <div class="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-300">
                ⚠️ ${this.checklist.length - this.doneCount} item(ns) do checklist ainda não foram concluídos.
              </div>
            ` : nothing}

            <div class="flex justify-end pt-2">
              <grouptriggeraction--ml-button-standard
                ?disabled=${!this.allDone}
                @action=${() => this.showToast('OS encerrada com sucesso! Relatório enviado ao cliente.')}
              >
                <Label>Encerrar OS</Label>
              </grouptriggeraction--ml-button-standard>
            </div>
          </div>

        ` : nothing}

      </div>
    </div>
  </div>
</div>
    `;
  }
}
