/// <mls fileReference="_102040_/l2/testes/candidate-pipeline.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupnavigatesection/ml-navigate-pills';
import '/_102040_/l2/molecules/groupviewcard/ml-vertical-card';
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

interface Candidate {
  id: number;
  name: string;
  role: string;
  rating: number;
  stage: Stage;
}

// =============================================================================
// COMPONENT
// =============================================================================
@customElement('testes--candidate-pipeline')
export class CandidatePipeline extends StateLitElement {

  // ── Estado ─────────────────────────────────────────────────────────────────
  @state() activeStage: Stage = 'interview';
  @state() searchQuery = '';
  @state() selectedId: number | null = null;
  @state() interviewDate = '';
  @state() resumeFile = '';
  @state() toastVisible = false;
  @state() toastMessage = '';

  @state() candidates: Candidate[] = [
    { id: 1, name: 'Fernanda Lima',   role: 'Dev Full Stack',   rating: 4, stage: 'interview' },
    { id: 2, name: 'Carlos Andrade',  role: 'Dev Full Stack',   rating: 5, stage: 'interview' },
    { id: 3, name: 'Mariana Costa',   role: 'Dev Full Stack',   rating: 3, stage: 'interview' },
    { id: 4, name: 'Rafael Sousa',    role: 'Dev Frontend',     rating: 0, stage: 'triagem'   },
    { id: 5, name: 'Juliana Melo',    role: 'Dev Full Stack',   rating: 0, stage: 'triagem'   },
    { id: 6, name: 'Bruno Teixeira',  role: 'Dev Sênior',       rating: 5, stage: 'technical' },
    { id: 7, name: 'Camila Ferreira', role: 'Dev Full Stack',   rating: 4, stage: 'proposal'  },
    { id: 8, name: 'Diego Oliveira',  role: 'Eng. de Software', rating: 5, stage: 'hired'     },
  ];

  // ── Constantes ─────────────────────────────────────────────────────────────
  private readonly job = {
    title: 'Desenvolvedor Full Stack Sênior',
    dept: 'Tecnologia',
    open: 4,
    total: 31,
  };

  private readonly history = [
    { date: '02/06', type: 'E-mail',     description: 'Convite para entrevista enviado' },
    { date: '04/06', type: 'Entrevista', description: 'Entrevista comportamental — Ana Souza (RH)' },
    { date: '06/06', type: 'Avaliação',  description: 'Nota 4/5. Bom perfil técnico.' },
  ];

  private readonly stageOrder: Stage[] = ['triagem', 'interview', 'technical', 'proposal', 'hired'];

  private readonly stageLabels: Record<Stage, string> = {
    triagem:   'Triagem',
    interview: 'Entrevista',
    technical: 'Técnico',
    proposal:  'Proposta',
    hired:     'Contratado',
  };

  // ── Getters ────────────────────────────────────────────────────────────────
  private get selectedCandidate(): Candidate | undefined {
    return this.candidates.find(c => c.id === this.selectedId);
  }

  private get filteredCandidates(): Candidate[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.candidates.filter(c =>
      c.stage === this.activeStage &&
      (!q || c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q))
    );
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  private countByStage(s: Stage): number {
    return this.candidates.filter(c => c.stage === s).length;
  }

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
  }

  private rejectCandidate(candidate: Candidate) {
    this.candidates = this.candidates.filter(c => c.id !== candidate.id);
    if (this.selectedId === candidate.id) this.selectedId = null;
    this.showToast(`${candidate.name} reprovado`);
  }

  private showToast(msg: string) {
    this.toastMessage = msg;
    this.toastVisible = true;
    setTimeout(() => { this.toastVisible = false; }, 3000);
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

  <div class="max-w-7xl mx-auto px-6 py-8">

    <!-- Cabeçalho -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Pipeline de Recrutamento</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Gestão de candidatos por etapa</p>
    </div>

    <!-- Card da vaga -->
    <div class="mb-6">
      <groupviewcard--ml-view-card-horizontal>
        <CardContent>
          <div class="w-12 h-12 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
            <span class="text-sky-600 dark:text-sky-300 font-bold text-sm">FS</span>
          </div>
        </CardContent>
        <CardHeader>
          <CardTitle>${this.job.title}</CardTitle>
          <CardDescription>${this.job.dept} · ${this.job.open} vagas abertas · ${this.job.total} candidatos no pipeline</CardDescription>
        </CardHeader>
        <CardAction>
          <span class="px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium">Ativa</span>
        </CardAction>
      </groupviewcard--ml-view-card-horizontal>
    </div>

    <!-- Descrição da vaga (accordion) -->
    <div class="mb-6">
      <groupexpandcontent--ml-readmore-expand>
        <Section title="Descrição da Vaga">
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Buscamos um Desenvolvedor Full Stack Sênior com experiência em React, Node.js e arquiteturas cloud-native.
            O profissional atuará no desenvolvimento de produtos B2B SaaS — desde o design de APIs até o deploy em produção.
            TypeScript, testes automatizados e metodologias ágeis são essenciais.
          </p>
        </Section>
      </groupexpandcontent--ml-readmore-expand>
    </div>

    <div class="flex gap-6">

      <!-- Coluna principal: lista de candidatos -->
      <div class="flex-1 min-w-0">

        <!-- Busca -->
        <div class="mb-4">
          <groupsearchcontent--ml-search-bar
            value="${this.searchQuery}"
            placeholder="Buscar candidato ou cargo..."
            debounce="300"
            @search=${(e: CustomEvent) => { this.searchQuery = e.detail.value ?? ''; }}
            @clear=${() => { this.searchQuery = ''; }}
          ></groupsearchcontent--ml-search-bar>
        </div>

        <!-- Pills de etapas -->
        <div class="mb-5">
          <groupnavigatesection--ml-navigate-pills
            value="${this.activeStage}"
            @change=${(e: CustomEvent) => { this.activeStage = e.detail.value; this.selectedId = null; }}
          >
            <Section value="triagem">Triagem (${this.countByStage('triagem')})</Section>
            <Section value="interview">Entrevista (${this.countByStage('interview')})</Section>
            <Section value="technical">Técnico (${this.countByStage('technical')})</Section>
            <Section value="proposal">Proposta (${this.countByStage('proposal')})</Section>
            <Section value="hired">Contratado (${this.countByStage('hired')})</Section>
          </groupnavigatesection--ml-navigate-pills>
        </div>

        <!-- Cards dos candidatos -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${this.filteredCandidates.length === 0
            ? html`<div class="col-span-2 py-12 text-center text-sm text-slate-400 dark:text-slate-500">Nenhum candidato nesta etapa.</div>`
            : this.filteredCandidates.map(c => this.renderCandidateCard(c))
          }
        </div>

      </div>

      <!-- Painel lateral do candidato selecionado -->
      ${this.selectedCandidate
        ? this.renderDetailPanel(this.selectedCandidate)
        : html`
          <div class="w-72 shrink-0 hidden lg:flex items-center justify-center">
            <p class="text-sm text-slate-400 dark:text-slate-500 text-center px-4">
              Clique em um candidato<br>para ver os detalhes
            </p>
          </div>
        `
      }

    </div>
  </div>
</div>
    `;
  }

  private renderCandidateCard(c: Candidate) {
    const isSelected = this.selectedId === c.id;
    return html`
<div @click=${() => { this.selectedId = c.id; }}>
  <groupviewcard--ml-vertical-card ?selected=${isSelected}>
    <CardHeader>
      <CardTitle>
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
            <span class="text-violet-700 dark:text-violet-300 font-semibold text-xs">${this.initials(c.name)}</span>
          </div>
          <div>
            <p class="font-semibold text-slate-800 dark:text-slate-100">${c.name}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-normal">${c.role}</p>
          </div>
        </div>
      </CardTitle>
    </CardHeader>

    <CardContent>
      ${(c.stage === 'interview' || c.stage === 'technical') ? html`
        <div class="mt-2" @click=${(e: Event) => e.stopPropagation()}>
          <grouprateitem--ml-star-rating
            value="${c.rating}"
            is-editing="true"
            @change=${(e: CustomEvent) => {
              this.candidates = this.candidates.map(x =>
                x.id === c.id ? { ...x, rating: Number(e.detail.value) } : x
              );
            }}
          ></grouprateitem--ml-star-rating>
        </div>
      ` : nothing}

      ${c.stage === 'triagem' ? html`
        <div class="mt-2" @click=${(e: Event) => e.stopPropagation()}>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Triagem rápida</p>
          <grouprateitem--ml-thumbs-rating
            is-editing="true"
            @change=${(e: CustomEvent) => {
              if (e.detail.value === 'up') {
                setTimeout(() => this.advanceCandidate(c), 400);
              } else if (e.detail.value === 'down') {
                setTimeout(() => this.rejectCandidate(c), 400);
              }
            }}
          >
            <Item value="up">Avançar</Item>
            <Item value="down">Reprovar</Item>
          </grouprateitem--ml-thumbs-rating>
        </div>
      ` : nothing}
    </CardContent>

    <CardFooter>
      <div class="flex gap-2 mt-1" @click=${(e: Event) => e.stopPropagation()}>
        <grouptriggeraction--ml-button-standard
          size="sm"
          @action=${() => this.advanceCandidate(c)}
        >
          <Label>Avançar etapa</Label>
        </grouptriggeraction--ml-button-standard>
        <grouptriggeraction--ml-button-standard
          size="sm"
          variant="ghost"
          @action=${() => this.rejectCandidate(c)}
        >
          <Label>Reprovar</Label>
        </grouptriggeraction--ml-button-standard>
      </div>
    </CardFooter>
  </groupviewcard--ml-vertical-card>
</div>
    `;
  }

  private renderDetailPanel(c: Candidate) {
    return html`
<div class="w-80 shrink-0 space-y-4">

  <!-- Nome e ações rápidas -->
  <div class="flex items-center justify-between">
    <div>
      <p class="font-semibold text-slate-800 dark:text-slate-100">${c.name}</p>
      <p class="text-xs text-slate-500 dark:text-slate-400">${c.role} · ${this.stageLabels[c.stage]}</p>
    </div>
    <div class="flex gap-1">
      <grouptriggeraction--ml-icon-button title="Editar" @action=${() => this.showToast('Editar candidato')}>
        <Icon>✏️</Icon>
      </grouptriggeraction--ml-icon-button>
      <grouptriggeraction--ml-icon-button title="Enviar e-mail" @action=${() => this.showToast('E-mail aberto')}>
        <Icon>📧</Icon>
      </grouptriggeraction--ml-icon-button>
      <grouptriggeraction--ml-icon-button title="Arquivar" @action=${() => { this.rejectCandidate(c); }}>
        <Icon>🗄️</Icon>
      </grouptriggeraction--ml-icon-button>
    </div>
  </div>

  <!-- Foto do candidato -->
  <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
    <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Foto</p>
    <groupselectfileforupload--ml-user-photo-upload
      name="photo"
      @change=${() => this.showToast('Foto atualizada')}
    ></groupselectfileforupload--ml-user-photo-upload>
  </div>

  <!-- Upload de currículo -->
  <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
    <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Currículo</p>
    <groupselectfileforupload--ml-file-upload-dropzone
      accept=".pdf,.docx"
      max-size-kb="5120"
      name="resume"
      @change=${(e: CustomEvent) => {
        this.resumeFile = e.detail?.files?.[0]?.name ?? 'currículo.pdf';
        this.showToast('Currículo enviado com sucesso');
      }}
      @reject=${() => this.showToast('Arquivo inválido — máx 5MB, PDF ou DOCX')}
    >
      <Label>PDF ou DOCX — máx 5MB</Label>
    </groupselectfileforupload--ml-file-upload-dropzone>
    ${this.resumeFile
      ? html`<p class="text-xs text-emerald-600 dark:text-emerald-400 mt-2">📎 ${this.resumeFile}</p>`
      : nothing
    }
  </div>

  <!-- Calendário para agendar entrevista -->
  <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
    <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Agendar entrevista</p>
    <groupenterdate--ml-compact-calendar
      value="${this.interviewDate}"
      is-editing="true"
      @change=${(e: CustomEvent) => { this.interviewDate = e.detail.value ?? ''; }}
    ></groupenterdate--ml-compact-calendar>
    ${this.interviewDate
      ? html`<p class="text-xs text-slate-500 dark:text-slate-400 mt-2">Data selecionada: ${this.interviewDate}</p>`
      : nothing
    }
    ${this.interviewDate ? html`
      <div class="mt-3">
        <grouptriggeraction--ml-button-standard
          size="sm"
          @action=${() => this.showToast(`Entrevista de ${c.name} agendada para ${this.interviewDate}`)}
        >
          <Label>Confirmar agendamento</Label>
        </grouptriggeraction--ml-button-standard>
      </div>
    ` : nothing}
  </div>

  <!-- Histórico de interações -->
  <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
    <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">Histórico</p>
    <groupviewdata--ml-vertical-record-list>
      <Columns>
        <Column field="date" header="Data"   width="52px"></Column>
        <Column field="type" header="Tipo"   width="90px"></Column>
        <Column field="desc" header="Detalhe"             ></Column>
      </Columns>
      <Rows>
        ${this.history.map(h => html`
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
  </div>

</div>
    `;
  }
}
