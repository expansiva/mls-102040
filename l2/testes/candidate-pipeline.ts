/// <mls fileReference="_102040_/l2/testes/candidate-pipeline.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, nothing, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupviewcard/ml-view-card-horizontal';
import '/_102040_/l2/molecules/grouprateitem/ml-star-rating';
import '/_102040_/l2/molecules/grouprateitem/ml-thumbs-rating';
import '/_102040_/l2/molecules/groupselectfileforupload/ml-file-upload-dropzone';
import '/_102040_/l2/molecules/groupselectfileforupload/ml-user-photo-upload';
import '/_102040_/l2/molecules/groupviewdata/ml-vertical-record-list';
import '/_102040_/l2/molecules/groupexpandcontent/ml-readmore-expand';
import '/_102040_/l2/molecules/groupenterdate/ml-compact-calendar';
import '/_102040_/l2/molecules/grouptriggeraction/ml-button-standard';
import '/_102040_/l2/molecules/grouptriggeraction/ml-icon-button';
import '/_102040_/l2/molecules/groupsearchcontent/ml-search-bar';
import '/_102040_/l2/molecules/groupnotifyuser/ml-toast-notification';

// =============================================================================
// TYPES
// =============================================================================
type Stage = 'triagem' | 'interview' | 'technical' | 'proposal' | 'hired';

interface HistoryEntry {
  date: string;
  type: string;
  description: string;
}

interface Candidate {
  id: number;
  name: string;
  role: string;
  stage: Stage;
  rating: number;
  thumb: 'up' | 'down' | null;
  cvFile: string | null;
  interviewDate: string;
  history: HistoryEntry[];
}

// =============================================================================
// COMPONENT
// =============================================================================
@customElement('testes--candidate-pipeline')
export class CandidatePipeline extends StateLitElement {

  // ── Estado ─────────────────────────────────────────────────────────────────
  @state() searchQuery = '';
  @state() selectedId = 1; // Fernanda Lima pré-selecionada
  @state() toastVisible = false;
  @state() toastMessage = '';

  @state() candidates: Candidate[] = [
    // TRIAGEM (3 candidatos)
    {
      id: 4, name: 'Rafael Sousa', role: 'Dev Frontend',
      stage: 'triagem', rating: 0, thumb: null,
      cvFile: null, interviewDate: '',
      history: [
        { date: '05/06', type: 'CV', description: 'Currículo recebido via LinkedIn' },
      ],
    },
    {
      id: 5, name: 'Juliana Melo', role: 'Dev Full Stack',
      stage: 'triagem', rating: 0, thumb: null,
      cvFile: null, interviewDate: '',
      history: [
        { date: '06/06', type: 'CV', description: 'Currículo recebido via site da empresa' },
      ],
    },
    {
      id: 6, name: 'Thiago Santos', role: 'Eng. de Software',
      stage: 'triagem', rating: 0, thumb: null,
      cvFile: null, interviewDate: '',
      history: [],
    },

    // ENTREVISTA (3 candidatos)
    {
      id: 1, name: 'Fernanda Lima', role: 'Dev Full Stack',
      stage: 'interview', rating: 4, thumb: null,
      cvFile: 'fernanda-cv.pdf', interviewDate: '2026-06-18',
      history: [
        { date: '02/06', type: 'CV',         description: 'Currículo recebido e aprovado na triagem' },
        { date: '05/06', type: 'E-mail',     description: 'Convite para entrevista enviado' },
        { date: '10/06', type: 'Entrevista', description: 'Entrevista comportamental — Ana Souza (RH)' },
        { date: '11/06', type: 'Avaliação',  description: 'Nota 4/5. Comunicação excelente. Boa fit cultural.' },
      ],
    },
    {
      id: 2, name: 'Carlos Andrade', role: 'Dev Full Stack',
      stage: 'interview', rating: 5, thumb: null,
      cvFile: 'carlos-cv.pdf', interviewDate: '2026-06-19',
      history: [
        { date: '03/06', type: 'CV',         description: 'Currículo recebido via indicação interna' },
        { date: '07/06', type: 'E-mail',     description: 'Convite para entrevista enviado' },
        { date: '12/06', type: 'Entrevista', description: 'Entrevista técnica — Pedro Lima (Tech Lead)' },
        { date: '12/06', type: 'Avaliação',  description: 'Nota 5/5. Excelente domínio de arquitetura. Altamente recomendado.' },
      ],
    },
    {
      id: 3, name: 'Mariana Costa', role: 'Dev Full Stack',
      stage: 'interview', rating: 0, thumb: null,
      cvFile: null, interviewDate: '',
      history: [
        { date: '08/06', type: 'CV',     description: 'Currículo recebido e aprovado na triagem' },
        { date: '09/06', type: 'E-mail', description: 'Convite para entrevista enviado' },
      ],
    },

    // TÉCNICO (1 candidato)
    {
      id: 7, name: 'Bruno Teixeira', role: 'Dev Sênior',
      stage: 'technical', rating: 5, thumb: null,
      cvFile: 'bruno-cv.pdf', interviewDate: '2026-06-14',
      history: [
        { date: '14/06', type: 'Entrevista', description: 'Entrevista técnica com desafio de código' },
        { date: '14/06', type: 'Avaliação',  description: 'Nota 5/5. Resolveu o desafio com excelência.' },
        { date: '15/06', type: 'E-mail',     description: 'Aprovado para etapa técnica presencial' },
      ],
    },

    // PROPOSTA (1 candidato)
    {
      id: 8, name: 'Camila Ferreira', role: 'Dev Full Stack',
      stage: 'proposal', rating: 5, thumb: null,
      cvFile: 'camila-cv.pdf', interviewDate: '',
      history: [
        { date: '10/06', type: 'Avaliação', description: 'Aprovada em todas as etapas técnicas' },
        { date: '13/06', type: 'Proposta',  description: 'Proposta de R$ 14.000/mês enviada' },
        { date: '14/06', type: 'E-mail',    description: 'Candidata solicitou 48h para responder' },
      ],
    },

    // CONTRATADO (1 candidato)
    {
      id: 9, name: 'Diego Oliveira', role: 'Eng. de Software',
      stage: 'hired', rating: 5, thumb: null,
      cvFile: 'diego-cv.pdf', interviewDate: '',
      history: [
        { date: '01/06', type: 'Contratação', description: 'Proposta aceita. Início: 01/07/2026' },
      ],
    },
  ];

  // ── Constantes ─────────────────────────────────────────────────────────────
  private readonly job = {
    title:           'Desenvolvedor Full Stack Sênior',
    dept:            'Tecnologia',
    manager:         'Ana Paula Sousa',
    openSlots:       4,
    totalInPipeline: 31,
    deadline:        '15/07',
    description:     `Buscamos um Desenvolvedor Full Stack Sênior com sólida experiência em React, Node.js e arquiteturas cloud-native. O profissional atuará no desenvolvimento de produtos B2B SaaS, participando de todo o ciclo — desde o design de APIs até o deploy em produção. TypeScript, testes automatizados e metodologias ágeis são essenciais. Benefícios: plano de saúde, VR, stock options e home office integral.`,
  };

  private readonly stageOrder: Stage[] = ['triagem', 'interview', 'technical', 'proposal', 'hired'];

  private readonly stageLabels: Record<Stage, string> = {
    triagem:   'Triagem',
    interview: 'Entrevista',
    technical: 'Técnico',
    proposal:  'Proposta',
    hired:     'Contratado',
  };

  private readonly nextStageLabel: Partial<Record<Stage, string>> = {
    triagem:   'Avançar para Entrevista',
    interview: 'Avançar para Técnico',
    technical: 'Avançar para Proposta',
    proposal:  'Marcar como Contratado',
  };

  // ── Getters ────────────────────────────────────────────────────────────────
  private get selectedCandidate(): Candidate | undefined {
    return this.candidates.find(c => c.id === this.selectedId);
  }

  private get filteredCandidates(): Candidate[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.candidates;
    return this.candidates.filter(c =>
      c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q)
    );
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  private initials(name: string): string {
    return name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  }

  private advanceCandidate(candidate: Candidate) {
    const idx = this.stageOrder.indexOf(candidate.stage);
    if (idx >= this.stageOrder.length - 1) return;
    const next = this.stageOrder[idx + 1];
    this.candidates = this.candidates.map(c =>
      c.id === candidate.id ? { ...c, stage: next } : c
    );
    this.showToast(`${candidate.name} avançado para ${this.stageLabels[next]}`);
    // selectedId permanece — candidato ainda aparece na lista com novo badge
  }

  private rejectCandidate(candidate: Candidate) {
    const updated = this.candidates.filter(c => c.id !== candidate.id);
    this.candidates = updated;
    this.showToast(`${candidate.name} reprovado`);
    if (this.selectedId === candidate.id) {
      this.selectedId = updated[0]?.id ?? -1;
    }
  }

  private updateCandidate(id: number, patch: Partial<Candidate>) {
    this.candidates = this.candidates.map(c => c.id === id ? { ...c, ...patch } : c);
  }

  private showToast(msg: string) {
    this.toastMessage = msg;
    this.toastVisible = true;
    setTimeout(() => { this.toastVisible = false; }, 3000);
  }

  // ── Render principal ───────────────────────────────────────────────────────
  render() {
    const sel = this.selectedCandidate;
    return html`
<div class="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans">

  <groupnotifyuser--ml-toast-notification
    .visible=${this.toastVisible}
    type="success"
    position="top-right"
    @dismiss=${() => { this.toastVisible = false; }}
  ><Message>${this.toastMessage}</Message></groupnotifyuser--ml-toast-notification>

  <div class="max-w-7xl mx-auto px-6 py-8">

    <!-- Cabeçalho: identificação da vaga -->
    <div class="mb-6">
      <groupviewcard--ml-view-card-horizontal>
        <CardContent>
          <div class="w-12 h-12 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
            <span class="text-sky-600 dark:text-sky-300 font-bold text-sm">FS</span>
          </div>
        </CardContent>
        <CardHeader>
          <CardTitle>${this.job.title} · ${this.job.dept}</CardTitle>
          <CardDescription>Resp.: ${this.job.manager} · ${this.job.openSlots} vagas abertas · ${this.job.totalInPipeline} no pipeline · Prazo: ${this.job.deadline}</CardDescription>
        </CardHeader>
        <CardAction>
          <span class="px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium">Ativa</span>
        </CardAction>
      </groupviewcard--ml-view-card-horizontal>
    </div>

    <!-- Corpo: duas colunas sempre visíveis -->
    <div class="flex gap-6 items-start">

      <!-- Coluna esquerda: busca + lista -->
      <div class="w-72 shrink-0 flex flex-col gap-4">

        <!-- Busca por nome ou cargo -->
        <groupsearchcontent--ml-search-bar
          value="${this.searchQuery}"
          placeholder="Buscar por nome ou cargo..."
          debounce="300"
          @search=${(e: CustomEvent) => { this.searchQuery = e.detail.value ?? ''; }}
          @clear=${() => { this.searchQuery = ''; }}
        ></groupsearchcontent--ml-search-bar>

        <!-- Lista de candidatos -->
        <div class="flex flex-col gap-2">
          ${this.filteredCandidates.length === 0
            ? html`<p class="text-sm text-slate-400 dark:text-slate-500 py-6 text-center">Nenhum candidato encontrado.</p>`
            : this.filteredCandidates.map(c => this.renderCandidateCard(c))
          }
        </div>

        <!-- Ações rápidas do candidato selecionado -->
        ${sel ? html`
          <div class="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <grouptriggeraction--ml-icon-button
              title="Editar"
              @action=${() => this.showToast(`Editar perfil de ${sel.name}`)}
            ><Icon>✏️</Icon></grouptriggeraction--ml-icon-button>
            <grouptriggeraction--ml-icon-button
              title="Enviar e-mail"
              @action=${() => this.showToast(`E-mail para ${sel.name} aberto`)}
            ><Icon>📧</Icon></grouptriggeraction--ml-icon-button>
            <grouptriggeraction--ml-icon-button
              title="Arquivar candidato"
              @action=${() => this.rejectCandidate(sel)}
            ><Icon>🗄️</Icon></grouptriggeraction--ml-icon-button>
          </div>
        ` : nothing}

      </div>

      <!-- Painel direito: detalhes do candidato -->
      <div class="flex-1 min-w-0">
        ${sel ? this.renderDetailPanel(sel) : this.renderEmptyPanel()}
      </div>

    </div>
  </div>
</div>
    `;
  }

  // ── Card do candidato (coluna esquerda) ───────────────────────────────────
  private renderCandidateCard(c: Candidate): TemplateResult {
    const isSelected = this.selectedId === c.id;
    return html`
<div
  class="cursor-pointer rounded-xl border p-3 transition-colors ${isSelected
    ? 'bg-violet-50 dark:bg-violet-900/30 border-violet-300 dark:border-violet-600'
    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-violet-200 dark:hover:border-violet-700'}"
  @click=${() => { this.selectedId = c.id; }}
>
  <div class="flex items-center gap-3">
    <div class="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
      <span class="text-violet-700 dark:text-violet-300 font-semibold text-xs">${this.initials(c.name)}</span>
    </div>
    <div class="flex-1 min-w-0">
      <p class="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">${c.name}</p>
      <p class="text-xs text-slate-500 dark:text-slate-400 truncate">${c.role}</p>
    </div>
    ${isSelected ? html`<span class="w-2 h-2 rounded-full bg-violet-500 shrink-0"></span>` : nothing}
  </div>
  <div class="mt-2 flex items-center justify-between">
    <span class="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
      ${this.stageLabels[c.stage]}
    </span>
    ${c.rating > 0 ? html`
      <div class="flex gap-0.5">
        ${[1,2,3,4,5].map(i => html`<span class="text-xs ${i <= c.rating ? 'text-amber-400' : 'text-slate-200 dark:text-slate-600'}">★</span>`)}
      </div>
    ` : nothing}
  </div>
</div>
    `;
  }

  // ── Painel vazio (etapa sem candidatos) ───────────────────────────────────
  private renderEmptyPanel(): TemplateResult {
    return html`
<div class="h-48 flex items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
  <p class="text-sm text-slate-400 dark:text-slate-500 text-center px-6">
    Nenhum candidato nesta etapa.
  </p>
</div>
    `;
  }

  // ── Painel de detalhes do candidato selecionado ───────────────────────────
  private renderDetailPanel(c: Candidate): TemplateResult {
    const ratingEditing = c.rating === 0;
    return html`
<div class="space-y-4">

  <!-- Cabeçalho do candidato -->
  <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
        <span class="text-violet-700 dark:text-violet-300 font-bold text-sm">${this.initials(c.name)}</span>
      </div>
      <div>
        <p class="font-semibold text-slate-800 dark:text-slate-100">${c.name}</p>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          ${c.role} ·
          <span class="font-medium text-violet-600 dark:text-violet-400">${this.stageLabels[c.stage]}</span>
        </p>
      </div>
    </div>
  </div>

  <!-- Linha: documentos + avaliação -->
  <div class="grid grid-cols-2 gap-4">

    <!-- Documentos -->
    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
      <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Documentos</p>
      <groupselectfileforupload--ml-user-photo-upload
        name="photo-${c.id}"
        @change=${() => this.showToast('Foto atualizada')}
      ></groupselectfileforupload--ml-user-photo-upload>
      <div class="mt-3">
        <groupselectfileforupload--ml-file-upload-dropzone
          accept=".pdf,.docx"
          max-size-kb="5120"
          name="resume-${c.id}"
          @change=${(e: CustomEvent) => {
            const filename = e.detail?.files?.[0]?.name ?? 'currículo.pdf';
            this.updateCandidate(c.id, { cvFile: filename });
            this.showToast('Currículo enviado com sucesso');
          }}
          @reject=${() => this.showToast('Arquivo inválido — máx 5MB, PDF ou DOCX')}
        ><Label>PDF ou DOCX — máx 5MB</Label></groupselectfileforupload--ml-file-upload-dropzone>
        ${c.cvFile
          ? html`<p class="text-xs text-emerald-600 dark:text-emerald-400 mt-2">📎 ${c.cvFile}</p>`
          : nothing}
      </div>
    </div>

    <!-- Avaliação (varia por etapa) -->
    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
      <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Avaliação</p>

      ${c.stage === 'triagem' ? html`
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">
          Triagem rápida — avance ou reprove este candidato:
        </p>
        <grouprateitem--ml-thumbs-rating
          is-editing="true"
          @change=${(e: CustomEvent) => {
            if (e.detail.value === 'up') {
              setTimeout(() => this.advanceCandidate(c), 300);
            } else if (e.detail.value === 'down') {
              setTimeout(() => this.rejectCandidate(c), 300);
            }
          }}
        >
          <Item value="up">Avançar</Item>
          <Item value="down">Reprovar</Item>
        </grouprateitem--ml-thumbs-rating>
      ` : nothing}

      ${(c.stage === 'interview' || c.stage === 'technical') ? html`
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">
          ${ratingEditing ? 'Registre a nota após a entrevista:' : 'Nota registrada:'}
        </p>
        <grouprateitem--ml-star-rating
          .value=${c.rating}
          is-editing="${ratingEditing ? 'true' : 'false'}"
          @change=${(e: CustomEvent) => {
            this.updateCandidate(c.id, { rating: Number(e.detail.value) });
          }}
        ></grouprateitem--ml-star-rating>
        ${!ratingEditing ? html`
          <button
            class="text-xs text-violet-600 dark:text-violet-400 hover:underline mt-2 block"
            @click=${() => this.updateCandidate(c.id, { rating: 0 })}
          >Editar avaliação</button>
        ` : nothing}
      ` : nothing}

      ${(c.stage === 'proposal' || c.stage === 'hired') ? html`
        <p class="text-xs text-slate-400 dark:text-slate-500">
          Candidato aprovado em todas as etapas avaliativas.
        </p>
      ` : nothing}
    </div>

  </div>

  <!-- Descrição da vaga (colapsada por padrão) -->
  <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
    <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Descrição da Vaga</p>
    <groupexpandcontent--ml-readmore-expand>
      <Section title="Ver descrição completa">
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${this.job.description}</p>
      </Section>
    </groupexpandcontent--ml-readmore-expand>
  </div>

  <!-- Agendamento (somente em Entrevista) -->
  ${c.stage === 'interview' ? html`
    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
      <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Agendar Entrevista</p>
      ${c.interviewDate
        ? html`
          <p class="text-sm text-emerald-600 dark:text-emerald-400 mb-2">📅 Agendado para ${c.interviewDate}</p>
          <button
            class="text-xs text-violet-600 dark:text-violet-400 hover:underline"
            @click=${() => this.updateCandidate(c.id, { interviewDate: '' })}
          >Reagendar</button>
        `
        : html`
          <groupenterdate--ml-compact-calendar
            value="${c.interviewDate}"
            is-editing="true"
            @change=${(e: CustomEvent) => {
              const date = e.detail.value ?? '';
              this.updateCandidate(c.id, { interviewDate: date });
              if (date) this.showToast(`Entrevista de ${c.name} agendada para ${date}`);
            }}
          ></groupenterdate--ml-compact-calendar>
        `}
    </div>
  ` : nothing}

  <!-- Histórico de interações -->
  <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
    <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Histórico</p>
    ${c.history.length === 0
      ? html`<p class="text-xs text-slate-400 dark:text-slate-500">Nenhuma interação registrada ainda.</p>`
      : html`
        <groupviewdata--ml-vertical-record-list>
          <Columns>
            <Column field="date"        header="Data"    width="52px"></Column>
            <Column field="type"        header="Tipo"    width="90px"></Column>
            <Column field="description" header="Detalhe"             ></Column>
          </Columns>
          <Rows>
            ${c.history.map(h => html`
              <Row>
                <Cell>${h.date}</Cell>
                <Cell>
                  <span class="text-xs px-2 py-0.5 bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 rounded-full whitespace-nowrap">${h.type}</span>
                </Cell>
                <Cell><span class="text-xs">${h.description}</span></Cell>
              </Row>
            `)}
          </Rows>
        </groupviewdata--ml-vertical-record-list>
      `}
  </div>

  <!-- Ações (condicional: não aparece em hired; em triagem, thumbs é o mecanismo) -->
  ${(c.stage === 'interview' || c.stage === 'technical' || c.stage === 'proposal') ? html`
    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
      <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Ações</p>
      <div class="flex gap-3 flex-wrap">
        <grouptriggeraction--ml-button-standard
          @action=${() => this.advanceCandidate(c)}
        ><Label>${this.nextStageLabel[c.stage] ?? 'Avançar'}</Label></grouptriggeraction--ml-button-standard>
        <grouptriggeraction--ml-button-standard
          variant="ghost"
          @action=${() => this.rejectCandidate(c)}
        ><Label>Reprovar</Label></grouptriggeraction--ml-button-standard>
      </div>
    </div>
  ` : nothing}

</div>
    `;
  }
}
