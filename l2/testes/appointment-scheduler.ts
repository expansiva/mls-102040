/// <mls fileReference="_102040_/l2/testes/appointment-scheduler.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupnavigatesection/ml-tabs';
import '/_102040_/l2/molecules/groupentertext/ml-floating-text-input';
import '/_102040_/l2/molecules/groupentertext/ml-multiline-text';
import '/_102040_/l2/molecules/groupenterdatetime/ml-datetime-picker';
import '/_102040_/l2/molecules/groupenterdatetimeinterval/ml-enter-datetime-interval';
import '/_102040_/l2/molecules/groupentertimeinterval/ml-time-interval-selector';
import '/_102040_/l2/molecules/groupselectone/ml-select-one-autocomplete';
import '/_102040_/l2/molecules/groupselectmany/ml-multi-select-dropdown';
import '/_102040_/l2/molecules/groupselectone/ml-radio-group';
import '/_102040_/l2/molecules/groupenternumber/ml-number-input';
import '/_102040_/l2/molecules/groupnotifyuser/ml-toast-notification';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table-minimal';

// ─────────────────────────────────────────────────────────────────────────────
// NOTA TÉCNICA — ml-tabs e o problema do unsafeHTML:
//
// ml-tabs lê o conteúdo de cada elemento <Tab> via el.innerHTML e o renderiza
// via unsafeHTML() em seu shadow DOM. Bindings Lit (@change, .value) NÃO são
// serializados em innerHTML — portanto os formulários de edição e a lista NÃO
// podem ficar dentro dos <Tab>.
//
// Solução: os elementos <Tab> contêm apenas texto estático descritivo.
// Todo o conteúdo real (formulário e lista) é renderizado FORA do ml-tabs,
// condicionado por activeTab.
//
// O viewEpoch + wrapper alternado força Lit a recriar o ml-tabs quando o
// conteúdo dos Tab precisa mudar (ex.: contador de reuniões atualizado).
// ─────────────────────────────────────────────────────────────────────────────

interface Meeting {
  id: number;
  title: string;
  date: string;
  room: string;
  participants: number;
}

@customElement('testes--appointment-scheduler')
export class AppointmentScheduler extends StateLitElement {

  // ── Navegação ────────────────────────────────────────────────────────────────
  @state() activeTab = 'nova-reuniao';
  @state() viewEpoch = 0;

  // ── Toast ────────────────────────────────────────────────────────────────────
  @state() toastVisible = false;
  @state() toastMsg     = '';

  // ── Campos do formulário ─────────────────────────────────────────────────────
  @state() title          = '';
  @state() agenda         = '';
  @state() startAt        = '';
  @state() intervalStart  = '';
  @state() intervalEnd    = '';
  @state() preferredStart = '09:00';
  @state() preferredEnd   = '18:00';
  @state() participants: string[] = [];
  @state() selectedRooms: string[] = [];
  @state() recurrence     = 'none';
  @state() recurrenceCount = 1;
  @state() errors: Record<string, string> = {};

  // ── Lista de reuniões ─────────────────────────────────────────────────────────
  @state() upcomingMeetings: Meeting[] = [
    { id: 1, title: 'Sprint Review',    date: '2026-06-05 14:00', room: 'Sala 3',    participants: 8  },
    { id: 2, title: 'One-on-one RH',    date: '2026-06-06 10:00', room: 'Sala 1',    participants: 2  },
    { id: 3, title: 'Planejamento Q3',  date: '2026-06-10 09:00', room: 'Auditório', participants: 22 },
  ];

  // ── Dados disponíveis ─────────────────────────────────────────────────────────
  private readonly availableRooms = [
    'Sala 1 (4p)', 'Sala 3 (8p)', 'Auditório (30p)', 'Sala de Vídeo (6p)',
  ];
  private readonly allParticipants = [
    'Ana Rodrigues', 'Carlos Mendes', 'Fernanda Lima', 'João Silva',
    'Maria Santos',  'Pedro Costa',   'Renata Oliveira', 'Thiago Almeida',
  ];

  // ── Validação ─────────────────────────────────────────────────────────────────
  private validate(): boolean {
    const e: Record<string, string> = {};
    if (!this.title.trim()) e.title = 'Título é obrigatório.';
    this.errors = e;
    return Object.keys(e).length === 0;
  }

  private err(f: string): string { return this.errors[f] ?? ''; }

  // ── Agendamento ───────────────────────────────────────────────────────────────
  private handleAgendar() {
    if (!this.validate()) return;

    const newMeeting: Meeting = {
      id:           Date.now(),
      title:        this.title,
      date:         this.intervalStart || this.startAt || '—',
      room:         this.selectedRooms.length > 0 ? this.selectedRooms[0] : '—',
      participants: this.participants.length,
    };

    this.upcomingMeetings = [newMeeting, ...this.upcomingMeetings];

    // Reset form
    this.title          = '';
    this.agenda         = '';
    this.startAt        = '';
    this.intervalStart  = '';
    this.intervalEnd    = '';
    this.preferredStart = '09:00';
    this.preferredEnd   = '18:00';
    this.participants   = [];
    this.selectedRooms  = [];
    this.recurrence     = 'none';
    this.recurrenceCount = 1;
    this.errors         = {};

    this.toastMsg     = 'Reunião agendada com sucesso!';
    this.toastVisible = true;

    // Switch to meetings tab — viewEpoch forces ml-tabs to re-read Tab children
    this.activeTab = 'minhas-reunioes';
    this.viewEpoch++;
  }

  // ── Participante selecionado via autocomplete ─────────────────────────────────
  private handleParticipantSelect(e: CustomEvent) {
    const selected: string = e.detail.value;
    if (!selected) return;
    if (!this.participants.includes(selected)) {
      this.participants = [...this.participants, selected];
    }
    // Reset the autocomplete field — defer so the component has rendered the selection first
    setTimeout(() => {
      const el = this.querySelector('groupselectone--ml-select-one-autocomplete[name="participant"]') as any;
      if (el) {
        el.value = null;
        (el as any).searchQuery = '';
        el.requestUpdate?.();
      }
    }, 0);
  }

  private removeParticipant(name: string) {
    this.participants = this.participants.filter(p => p !== name);
  }

  // ── ml-tabs wrapper alternado (viewEpoch trick) ───────────────────────────────
  private renderTabs() {
    const meetingCount = this.upcomingMeetings.length;
    const tabs = html`
<groupnavigatesection--ml-tabs
  value="${this.activeTab}"
  @change=${(e: CustomEvent) => { this.activeTab = e.detail.value; }}
>
  <Tab value="nova-reuniao" title="Nova Reunião">
    <div class="py-1 text-xs text-slate-500 dark:text-slate-400">Preencha os dados abaixo para agendar uma reunião.</div>
  </Tab>

  <Tab value="minhas-reunioes" title="Minhas Reuniões">
    <div class="py-1 text-xs text-slate-500 dark:text-slate-400">${meetingCount} reunião(ões) agendada(s).</div>
  </Tab>
</groupnavigatesection--ml-tabs>`;

    return this.viewEpoch % 2 === 0
      ? html`<div>${tabs}</div>`
      : html`<div class="w-full">${tabs}</div>`;
  }

  // ── Formulário: Nova Reunião ──────────────────────────────────────────────────
  private renderNovaReuniaoForm() {
    return html`
<div class="mt-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">

  <!-- Título + Pauta -->
  <section>
    <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Informações gerais</h3>
    <div class="space-y-4">
      <groupentertext--ml-floating-text-input
        value="${this.title}"
        name="title"
        is-editing="true"
        required
        error="${this.err('title')}"
        @change=${(e: CustomEvent) => { this.title = e.detail.value; }}
      >
        <Label>Título da reunião</Label>
      </groupentertext--ml-floating-text-input>

      <groupentertext--ml-multiline-text
        value="${this.agenda}"
        name="agenda"
        is-editing="true"
        .rows=${4}
        @change=${(e: CustomEvent) => { this.agenda = e.detail.value; }}
      >
        <Label>Pauta / Descrição</Label>
        <Helper>Descreva brevemente os tópicos a serem discutidos</Helper>
      </groupentertext--ml-multiline-text>
    </div>
  </section>

  <!-- Data / Hora -->
  <section>
    <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Data e horário</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <groupenterdatetime--ml-datetime-picker
        value="${this.startAt}"
        name="startAt"
        is-editing="true"
        locale="pt-BR"
        .minute-step=${15}
        @change=${(e: CustomEvent) => {
          this.startAt = e.detail.value ?? '';
          // Pre-fill the interval start when startAt is set
          if (this.startAt) this.intervalStart = this.startAt;
        }}
      >
        <Label>Data e hora de início</Label>
      </groupenterdatetime--ml-datetime-picker>

      <groupenterdatetimeinterval--ml-enter-datetime-interval
        start-datetime="${this.intervalStart}"
        end-datetime="${this.intervalEnd}"
        name="interval"
        is-editing="true"
        locale="pt-BR"
        @startChange=${(e: CustomEvent) => { this.intervalStart = e.detail.value ?? ''; }}
        @endChange=${(e: CustomEvent)   => { this.intervalEnd   = e.detail.value ?? ''; }}
        @change=${(e: CustomEvent) => {
          this.intervalStart = e.detail.startDatetime ?? '';
          this.intervalEnd   = e.detail.endDatetime   ?? '';
        }}
      >
        <Label>Intervalo início–fim</Label>
      </groupenterdatetimeinterval--ml-enter-datetime-interval>
    </div>

    <div class="mt-4">
      <groupentertimeinterval--ml-time-interval-selector
        startTime="${this.preferredStart}"
        endTime="${this.preferredEnd}"
        name="preferredTimeRange"
        is-editing="true"
        locale="pt-BR"
        @change=${(e: CustomEvent) => {
          this.preferredStart = e.detail.startTime ?? this.preferredStart;
          this.preferredEnd   = e.detail.endTime   ?? this.preferredEnd;
        }}
      >
        <Label>Faixa de horário preferencial</Label>
        <LabelStart>Início preferencial</LabelStart>
        <LabelEnd>Fim preferencial</LabelEnd>
        <Helper>Horários dentro dos quais a reunião deve ocorrer</Helper>
      </groupentertimeinterval--ml-time-interval-selector>
    </div>
  </section>

  <!-- Participantes -->
  <section>
    <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Participantes</h3>

    <groupselectone--ml-select-one-autocomplete
      name="participant"
      is-editing="true"
      placeholder="Buscar participante por nome…"
      @change=${this.handleParticipantSelect}
    >
      <Label>Adicionar participante</Label>
      ${this.allParticipants.map(p => html`<Item value="${p}">${p}</Item>`)}
    </groupselectone--ml-select-one-autocomplete>

    ${this.participants.length > 0 ? html`
      <div class="mt-3 flex flex-wrap gap-2">
        ${this.participants.map(name => html`
          <span class="inline-flex items-center gap-1.5 rounded-full bg-sky-100 dark:bg-sky-900/40 px-3 py-1 text-xs font-medium text-sky-700 dark:text-sky-300">
            ${name}
            <button
              type="button"
              @click=${() => this.removeParticipant(name)}
              class="text-sky-500 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-200 transition"
              aria-label="Remover ${name}"
            >
              <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M2 2l8 8M10 2l-8 8"/>
              </svg>
            </button>
          </span>
        `)}
      </div>
    ` : nothing}
  </section>

  <!-- Salas -->
  <section>
    <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Sala</h3>
    <groupselectmany--ml-multi-select-dropdown
      value="${this.selectedRooms.join(',')}"
      name="rooms"
      is-editing="true"
      @change=${(e: CustomEvent) => {
        this.selectedRooms = (e.detail.value as string)
          .split(',')
          .map((v: string) => v.trim())
          .filter((v: string) => v.length > 0);
      }}
    >
      <Label>Salas disponíveis</Label>
      ${this.availableRooms.map(r => html`<Item value="${r}">${r}</Item>`)}
    </groupselectmany--ml-multi-select-dropdown>
  </section>

  <!-- Recorrência -->
  <section>
    <h3 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Recorrência</h3>

    <groupselectone--ml-radio-group
      value="${this.recurrence}"
      name="recurrence"
      is-editing="true"
      @change=${(e: CustomEvent) => { this.recurrence = e.detail.value; }}
    >
      <Label>Tipo de recorrência</Label>
      <Item value="none">Sem recorrência</Item>
      <Item value="daily">Diária</Item>
      <Item value="weekly">Semanal</Item>
      <Item value="monthly">Mensal</Item>
    </groupselectone--ml-radio-group>

    ${this.recurrence !== 'none' ? html`
      <div class="mt-4 max-w-xs">
        <groupenternumber--ml-number-input
          .value=${this.recurrenceCount}
          .min=${1}
          .max=${52}
          .step=${1}
          name="recurrenceCount"
          is-editing="true"
          @change=${(e: CustomEvent) => { if (e.detail.value != null) this.recurrenceCount = e.detail.value; }}
        >
          <Label>Número de ocorrências</Label>
          <Helper>Quantas vezes a reunião deve se repetir</Helper>
        </groupenternumber--ml-number-input>
      </div>
    ` : nothing}
  </section>

  <!-- Ação -->
  <div class="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-700">
    <button
      type="button"
      @click=${this.handleAgendar}
      class="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-sm font-semibold rounded-lg transition"
    >
      Agendar
    </button>
  </div>

</div>`;
  }

  // ── Lista: Minhas Reuniões ────────────────────────────────────────────────────
  private renderMinhasReunioes() {
    return html`
<div class="mt-4">
  <groupviewtable--ml-data-table-minimal
    is-editing="false"
    page="1"
    page-size="${this.upcomingMeetings.length}"
    total-items="${this.upcomingMeetings.length}"
  >
    <Caption>Reuniões agendadas</Caption>
    <TableHeader>
      <TableRow>
        <TableHead>Título</TableHead>
        <TableHead>Data/Hora</TableHead>
        <TableHead>Sala</TableHead>
        <TableHead>Participantes</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      ${this.upcomingMeetings.map(m => html`
        <TableRow>
          <TableCell>
            <span class="font-medium text-slate-800 dark:text-slate-100">${m.title}</span>
          </TableCell>
          <TableCell>
            <span class="text-sm text-slate-600 dark:text-slate-300">${m.date}</span>
          </TableCell>
          <TableCell>
            <span class="text-sm text-slate-600 dark:text-slate-300">${m.room}</span>
          </TableCell>
          <TableCell>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200">
              ${m.participants}
            </span>
          </TableCell>
        </TableRow>
      `)}
    </TableBody>
  </groupviewtable--ml-data-table-minimal>

  ${this.upcomingMeetings.length === 0 ? html`
    <div class="mt-6 flex flex-col items-center gap-3 py-12 text-center text-slate-400 dark:text-slate-500">
      <svg class="w-10 h-10 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5"/>
      </svg>
      <p class="text-sm">Nenhuma reunião agendada. Vá até a aba <strong>Nova Reunião</strong> para agendar.</p>
    </div>
  ` : nothing}
</div>`;
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
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </div>
      <div>
        <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Agendamento de Reuniões</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Agende reuniões corporativas, gerencie salas e participantes
        </p>
      </div>
    </div>

    <!-- Abas de navegação (Tab filhos apenas com texto estático) -->
    ${this.renderTabs()}

    <!-- Conteúdo da aba ativa — renderizado FORA do ml-tabs para ter reatividade Lit plena -->
    ${this.activeTab === 'nova-reuniao'   ? this.renderNovaReuniaoForm() : nothing}
    ${this.activeTab === 'minhas-reunioes' ? this.renderMinhasReunioes()  : nothing}

    <!-- Toast de confirmação -->
    <groupnotifyuser--ml-toast-notification
      type="success"
      .visible=${this.toastVisible}
      duration="4000"
      @close=${() => { this.toastVisible = false; }}
    >
      <Title>Reunião agendada</Title>
      <Message>${this.toastMsg}</Message>
    </groupnotifyuser--ml-toast-notification>

  </div>
</div>`;
  }
}
