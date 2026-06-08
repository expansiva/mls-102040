/// <mls fileReference="_102040_/l2/testes/training-catalog.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupnavigatesection/ml-breadcrumb-trail';
import '/_102040_/l2/molecules/groupviewcard/ml-view-card-media';
import '/_102040_/l2/molecules/groupviewdata/ml-card-grid';
import '/_102040_/l2/molecules/groupplaymedia/ml-video-player';
import '/_102040_/l2/molecules/groupplaymedia/ml-audio-player';
import '/_102040_/l2/molecules/groupshowprogress/ml-linear-progress';
import '/_102040_/l2/molecules/groupshowprogress/ml-circular-progress';
import '/_102040_/l2/molecules/grouprateitem/ml-star-rating';
import '/_102040_/l2/molecules/grouprateitem/ml-numeric-rating-nps';
import '/_102040_/l2/molecules/groupexpandcontent/ml-single-expand-content';
import '/_102040_/l2/molecules/groupenterdateinterval/ml-date-interval-drag';
import '/_102040_/l2/molecules/grouptriggeraction/ml-split-button';
import '/_102040_/l2/molecules/grouptriggeraction/ml-button-group';
import '/_102040_/l2/molecules/groupselectmany/ml-multi-select-dropdown';
import '/_102040_/l2/molecules/groupsearchcontent/ml-search-bar';
import '/_102040_/l2/molecules/groupnotifyuser/ml-toast-notification';

// =============================================================================
// TYPES
// =============================================================================
type FormatFilter = 'video' | 'audio' | 'reading';

interface RecommendedCourse {
  title: string;
  instructor: string;
  duration: string;
  area: string;
  progress: number;
  format: FormatFilter;
}

// =============================================================================
// COMPONENT
// =============================================================================
@customElement('testes--training-catalog')
export class TrainingCatalog extends StateLitElement {

  // ── Estado ─────────────────────────────────────────────────────────────────
  @state() lessonProgress = 42;
  @state() courseComplete = false;
  @state() userRating = 0;
  @state() npsScore: number | null = null;
  @state() formatFilter: FormatFilter = 'video';
  @state() areaFilter = '';
  @state() searchQuery = '';
  @state() enrollmentStart = '2026-06-01';
  @state() enrollmentEnd = '2026-07-31';
  @state() toastVisible = false;
  @state() toastMessage = '';

  // ── Dataset ────────────────────────────────────────────────────────────────
  private readonly course = {
    title: 'Arquitetura de Microsserviços na Prática',
    instructor: 'Paulo Menezes',
    duration: '8h 40min',
    completionPct: 68,
    currentLesson: { title: 'Aula 5: API Gateway', progressPct: 42 },
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    audioPodcastSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    syllabus: [
      'Módulo 1: Fundamentos de microsserviços',
      'Módulo 2: Decomposição de serviços por domínio',
      'Módulo 3: API Gateway e roteamento',
      'Módulo 4: Observabilidade e rastreamento distribuído',
    ],
  };

  private readonly recommendedCourses: RecommendedCourse[] = [
    { title: 'Docker e Kubernetes',   instructor: 'Maria Oliveira', duration: '6h',  area: 'ti',    progress: 0,   format: 'video'   },
    { title: 'DevOps na Prática',     instructor: 'João Carvalho',  duration: '10h', area: 'ti',    progress: 100, format: 'video'   },
    { title: 'Clean Architecture',    instructor: 'Ana Lima',       duration: '4h',  area: 'ti',    progress: 33,  format: 'reading' },
    { title: 'Event-Driven Design',   instructor: 'Carlos Braga',   duration: '5h',  area: 'ti',    progress: 0,   format: 'audio'   },
    { title: 'Gestão de Projetos',    instructor: 'Fernanda Rocha', duration: '3h',  area: 'rh',    progress: 60,  format: 'video'   },
    { title: 'Vendas Consultivas',    instructor: 'Rafael Melo',    duration: '2h',  area: 'vendas',progress: 0,   format: 'audio'   },
  ];

  // ── Getters ────────────────────────────────────────────────────────────────
  private get filteredCourses(): RecommendedCourse[] {
    const q = this.searchQuery.trim().toLowerCase();
    const areas = this.areaFilter.split(',').filter(Boolean);
    return this.recommendedCourses.filter(c => {
      if (c.format !== this.formatFilter) return false;
      if (areas.length > 0 && !areas.includes(c.area)) return false;
      if (q && !c.title.toLowerCase().includes(q) && !c.instructor.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  private showToast(msg: string) {
    this.toastMessage = msg;
    this.toastVisible = true;
    setTimeout(() => { this.toastVisible = false; }, 3000);
  }

  private simulateProgress() {
    this.lessonProgress = Math.min(100, this.lessonProgress + 15);
    if (this.lessonProgress >= 100) {
      this.courseComplete = true;
      this.showToast('Aula concluída! Avalie o curso abaixo.');
    }
  }

  private formatLabel(f: FormatFilter): string {
    return f === 'video' ? '🎬 Vídeo' : f === 'audio' ? '🎧 Áudio' : '📖 Leitura';
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

    <!-- Breadcrumb -->
    <div class="mb-5">
      <groupnavigatesection--ml-breadcrumb-trail>
        <Item value="home">Início</Item>
        <Item value="catalog">Catálogo</Item>
        <Item value="tech">Desenvolvimento Técnico</Item>
        <Item value="course">${this.course.title}</Item>
      </groupnavigatesection--ml-breadcrumb-trail>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- ════════════════════════════════════════ -->
      <!-- Coluna esquerda: curso em andamento      -->
      <!-- ════════════════════════════════════════ -->
      <div class="lg:col-span-2 space-y-5">

        <!-- Card do curso (media card) -->
        <groupviewcard--ml-view-card-media>
          <CardHeader aspect-ratio="16:9">
            <div class="w-full h-full bg-gradient-to-br from-sky-700 to-violet-800 flex flex-col items-center justify-center text-white p-6">
              <span class="text-4xl mb-3">⚙️</span>
              <p class="text-base font-semibold text-center">${this.course.title}</p>
              <p class="text-sm opacity-75 mt-1">${this.course.instructor}</p>
            </div>
          </CardHeader>
          <CardTitle>${this.course.title}</CardTitle>
          <CardDescription>${this.course.instructor} · ${this.course.duration}</CardDescription>
          <CardContent>
            <div class="flex items-center gap-4 mt-1">
              <div class="shrink-0">
                <groupshowprogress--ml-circular-progress
                  value="${this.course.completionPct}"
                  size="56"
                  show-value="true"
                ></groupshowprogress--ml-circular-progress>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-700 dark:text-slate-200">${this.course.currentLesson.title}</p>
                <div class="mt-2">
                  <groupshowprogress--ml-linear-progress
                    value="${this.lessonProgress}"
                  ></groupshowprogress--ml-linear-progress>
                  <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">${this.lessonProgress}% da aula assistida</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardAction>
            <div class="flex items-center gap-3">
              <grouptriggeraction--ml-split-button
                value="continue"
                @action=${(e: CustomEvent) => {
                  const v = e.detail?.value ?? 'continue';
                  if (v === 'continue') {
                    this.simulateProgress();
                  } else if (v === 'restart') {
                    this.lessonProgress = 0;
                    this.courseComplete = false;
                    this.showToast('Aula reiniciada');
                  } else if (v === 'download') {
                    this.showToast('Certificado gerado com sucesso');
                  } else if (v === 'share') {
                    this.showToast('Link copiado para a área de transferência');
                  }
                }}
              >
                <Label>Continuar curso</Label>
                <Item value="restart">Reiniciar aula</Item>
                <Item value="download" ?disabled=${!this.courseComplete}>Baixar certificado</Item>
                <Item value="share">Compartilhar</Item>
              </grouptriggeraction--ml-split-button>
              ${this.courseComplete
                ? html`<span class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">✓ Concluído</span>`
                : nothing
              }
            </div>
          </CardAction>
        </groupviewcard--ml-view-card-media>

        <!-- Player de vídeo -->
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <div class="px-5 pt-4 pb-2">
            <h3 class="font-medium text-slate-800 dark:text-slate-100 text-sm">${this.course.currentLesson.title}</h3>
          </div>
          <groupplaymedia--ml-video-player
            @timeUpdate=${(e: CustomEvent) => {
              if (e.detail?.percent !== undefined) {
                this.lessonProgress = Math.round(e.detail.percent);
              }
            }}
            @ended=${() => {
              this.lessonProgress = 100;
              this.courseComplete = true;
              this.showToast('Aula finalizada! Avalie o curso abaixo.');
            }}
          >
            <Source src="${this.course.videoSrc}" type="video/mp4"></Source>
          </groupplaymedia--ml-video-player>
        </div>

        <!-- Player de podcast -->
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
          <p class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            🎙️ Podcast — Microsserviços na prática
          </p>
          <groupplaymedia--ml-audio-player>
            <Source src="${this.course.audioPodcastSrc}" type="audio/mpeg"></Source>
          </groupplaymedia--ml-audio-player>
        </div>

        <!-- Ementa do curso -->
        <groupexpandcontent--ml-single-expand-content>
          <Label>Conteúdo do curso</Label>
          <Section title="Ementa completa" expanded="true">
            <ul class="space-y-2">
              ${this.course.syllabus.map((item, i) => html`
                <li class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span class="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs flex items-center justify-center shrink-0 font-medium">${i + 1}</span>
                  ${item}
                </li>
              `)}
            </ul>
          </Section>
        </groupexpandcontent--ml-single-expand-content>

        <!-- Período de matrícula -->
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-slate-800 dark:text-slate-100">Período de matrícula</h3>
            <span class="text-xs text-slate-500 dark:text-slate-400">${this.enrollmentStart} → ${this.enrollmentEnd}</span>
          </div>
          <groupenterdateinterval--ml-date-interval-drag
            start-date="${this.enrollmentStart}"
            end-date="${this.enrollmentEnd}"
            is-editing="true"
            @change=${(e: CustomEvent) => {
              this.enrollmentStart = e.detail.startDate ?? this.enrollmentStart;
              this.enrollmentEnd   = e.detail.endDate   ?? this.enrollmentEnd;
            }}
          ></groupenterdateinterval--ml-date-interval-drag>
          <div class="mt-4 flex justify-end">
            <button
              class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg transition-colors"
              @click=${() => this.showToast('Matrícula confirmada para o período selecionado')}
            >
              Confirmar matrícula
            </button>
          </div>
        </div>

        <!-- Avaliação (visível após conclusão) -->
        ${this.courseComplete ? html`
          <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-5">
            <h3 class="font-semibold text-slate-800 dark:text-slate-100">Avalie este curso</h3>

            <div>
              <p class="text-sm text-slate-600 dark:text-slate-300 mb-2">Nota geral</p>
              <grouprateitem--ml-star-rating
                value="${this.userRating}"
                is-editing="true"
                @change=${(e: CustomEvent) => {
                  this.userRating = Number(e.detail.value);
                  if (this.userRating > 0) this.showToast('Avaliação registrada');
                }}
              ></grouprateitem--ml-star-rating>
            </div>

            <div>
              <p class="text-sm text-slate-600 dark:text-slate-300 mb-2">
                Você recomendaria este curso a um colega? (0–10)
              </p>
              <grouprateitem--ml-numeric-rating-nps
                min="0"
                max="10"
                .value=${this.npsScore}
                is-editing="true"
                @change=${(e: CustomEvent) => {
                  this.npsScore = Number(e.detail.value);
                  this.showToast(`NPS registrado: ${this.npsScore}`);
                }}
              >
                <Label>Net Promoter Score</Label>
              </grouprateitem--ml-numeric-rating-nps>
            </div>
          </div>
        ` : html`
          <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center justify-between">
            <p class="text-sm text-amber-700 dark:text-amber-300">
              Avaliação disponível após concluir o curso.
            </p>
            <button
              class="text-xs underline text-amber-600 dark:text-amber-400 ml-3 shrink-0"
              @click=${() => { this.lessonProgress = 100; this.courseComplete = true; this.showToast('Curso marcado como concluído'); }}
            >
              Simular conclusão
            </button>
          </div>
        `}

      </div>

      <!-- ════════════════════════════════════════ -->
      <!-- Coluna direita: catálogo de cursos       -->
      <!-- ════════════════════════════════════════ -->
      <div class="space-y-4">

        <h2 class="font-semibold text-slate-700 dark:text-slate-300">Cursos recomendados</h2>

        <!-- Busca -->
        <groupsearchcontent--ml-search-bar
          value="${this.searchQuery}"
          placeholder="Buscar curso ou instrutor..."
          debounce="300"
          @search=${(e: CustomEvent) => { this.searchQuery = e.detail.value ?? ''; }}
          @clear=${() => { this.searchQuery = ''; }}
        ></groupsearchcontent--ml-search-bar>

        <!-- Filtro de formato via button-group -->
        <div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Formato: <span class="font-medium text-slate-700 dark:text-slate-300">${this.formatLabel(this.formatFilter)}</span>
          </p>
          <grouptriggeraction--ml-button-group
            @action=${(e: CustomEvent) => {
              const label: string = (e.detail?.label ?? '').toLowerCase();
              if (label.includes('ídeo') || label.includes('video')) this.formatFilter = 'video';
              else if (label.includes('udio') || label.includes('audio')) this.formatFilter = 'audio';
              else if (label.includes('leitura')) this.formatFilter = 'reading';
            }}
          >
            <Label>Vídeo</Label>
            <Label>Áudio</Label>
            <Label>Leitura</Label>
          </grouptriggeraction--ml-button-group>
        </div>

        <!-- Filtro de área -->
        <groupselectmany--ml-multi-select-dropdown
          value="${this.areaFilter}"
          placeholder="Filtrar por área"
          name="area"
          @change=${(e: CustomEvent) => { this.areaFilter = e.detail.value ?? ''; }}
        >
          <Label>Área de conhecimento</Label>
          <Item value="ti">TI</Item>
          <Item value="rh">RH</Item>
          <Item value="vendas">Vendas</Item>
          <Item value="compliance">Compliance</Item>
        </groupselectmany--ml-multi-select-dropdown>

        <!-- Grade de cursos -->
        <groupviewdata--ml-card-grid
          hoverable="true"
          @row-click=${(e: CustomEvent) => {
            const course = this.filteredCourses[e.detail?.rowIndex];
            if (course) this.showToast(`Abrindo: ${course.title}`);
          }}
        >
          <Columns>
            <Column field="thumb"      header="Thumb"      ></Column>
            <Column field="title"      header="Título"     ></Column>
            <Column field="instructor" header="Instrutor"  ></Column>
            <Column field="meta"       header="Info"       ></Column>
            <Column field="progress"   header="Progresso"  ></Column>
          </Columns>
          <Rows>
            ${this.filteredCourses.map(c => html`
              <Row>
                <Cell>
                  <div class="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-lg flex items-center justify-center mb-2">
                    <span class="text-2xl">${c.format === 'video' ? '🎬' : c.format === 'audio' ? '🎧' : '📖'}</span>
                  </div>
                </Cell>
                <Cell>
                  <p class="font-medium text-sm text-slate-800 dark:text-slate-100 leading-tight">${c.title}</p>
                </Cell>
                <Cell>
                  <p class="text-xs text-slate-500 dark:text-slate-400">${c.instructor}</p>
                </Cell>
                <Cell>
                  <p class="text-xs text-slate-400 dark:text-slate-500">${c.duration}</p>
                </Cell>
                <Cell>
                  <groupshowprogress--ml-linear-progress value="${c.progress}"></groupshowprogress--ml-linear-progress>
                  <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">${c.progress}%</p>
                </Cell>
              </Row>
            `)}
          </Rows>
          <Empty>
            <div class="py-6 text-center">
              <p class="text-sm text-slate-400 dark:text-slate-500">Nenhum curso encontrado.</p>
              <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Tente outro formato ou área.</p>
            </div>
          </Empty>
        </groupviewdata--ml-card-grid>

      </div>

    </div>
  </div>
</div>
    `;
  }
}
