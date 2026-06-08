/// <mls fileReference="_102040_/l2/testes/org-chart.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, nothing, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupnavigatemain/ml-sidebar-nav';
import '/_102040_/l2/molecules/groupnavigatesection/ml-breadcrumb-trail';
import '/_102040_/l2/molecules/groupnavigatesection/ml-navigate-pills';
import '/_102040_/l2/molecules/groupviewhierarchy/ml-hierarchy-orgchart';
import '/_102040_/l2/molecules/groupviewhierarchy/ml-hierarchy-tree';
import '/_102040_/l2/molecules/groupviewhierarchy/ml-hierarchy-tree-diagram';
import '/_102040_/l2/molecules/groupviewcard/ml-vertical-card';
import '/_102040_/l2/molecules/groupsearchcontent/ml-search-bar';
import '/_102040_/l2/molecules/groupselectone/ml-segmented-control';
import '/_102040_/l2/molecules/groupshowprogress/ml-circular-progress';
import '/_102040_/l2/molecules/grouptriggeraction/ml-icon-button';
import '/_102040_/l2/molecules/groupnotifyuser/ml-toast-notification';

// =============================================================================
// TYPES
// =============================================================================
type ViewMode = 'orgchart' | 'tree' | 'diagram';
type LevelFilter = 'all' | 'exec' | 'manager' | 'operational';

interface Employee {
  name: string;
  role: string;
  level: LevelFilter;
  dept: string;
  email: string;
}

// =============================================================================
// COMPONENT
// =============================================================================
@customElement('testes--org-chart')
export class OrgChart extends StateLitElement {

  // ── Estado ─────────────────────────────────────────────────────────────────
  @state() activeDept = 'technology';
  @state() activeView: ViewMode = 'orgchart';
  @state() levelFilter: LevelFilter = 'all';
  @state() searchQuery = '';
  @state() selectedEmployee: Employee | null = null;
  @state() loadingChart = false;
  @state() loadingProgress = 0;
  @state() toastVisible = false;
  @state() toastMessage = '';

  // ── Dataset ────────────────────────────────────────────────────────────────
  private readonly navItems = [
    { value: 'technology', label: 'Tecnologia',  badge: '87'  },
    { value: 'commercial', label: 'Comercial',   badge: '124' },
    { value: 'hr',         label: 'RH',          badge: '31'  },
    { value: 'finance',    label: 'Financeiro',  badge: '43'  },
    { value: 'legal',      label: 'Jurídico',    badge: '18'  },
  ];

  private readonly allEmployees: Record<string, Employee[]> = {
    technology: [
      { name: 'Roberto Figueiredo', role: 'CTO',                   level: 'exec',        dept: 'Tecnologia', email: 'roberto@empresa.com' },
      { name: 'Ana Paula Sousa',    role: 'Head de Produto',        level: 'manager',     dept: 'Tecnologia', email: 'ana@empresa.com'     },
      { name: 'Marcos Vinicius',    role: 'Head de Infraestrutura', level: 'manager',     dept: 'Tecnologia', email: 'marcos@empresa.com'  },
      { name: 'Pedro Lima',         role: 'Tech Lead Frontend',     level: 'manager',     dept: 'Tecnologia', email: 'pedro@empresa.com'   },
      { name: 'Julia Rocha',        role: 'Tech Lead Backend',      level: 'manager',     dept: 'Tecnologia', email: 'julia@empresa.com'   },
      { name: 'Tiago Braga',        role: 'SRE Sênior',            level: 'operational', dept: 'Tecnologia', email: 'tiago@empresa.com'   },
    ],
    commercial: [
      { name: 'Carla Mendes',  role: 'Diretora Comercial', level: 'exec',    dept: 'Comercial', email: 'carla@empresa.com' },
      { name: 'Felipe Torres', role: 'Gerente de Contas',  level: 'manager', dept: 'Comercial', email: 'felipe@empresa.com'},
    ],
    hr: [
      { name: 'Sandra Lima',  role: 'Diretora de RH',  level: 'exec',    dept: 'RH', email: 'sandra@empresa.com' },
      { name: 'Lucas Britto', role: 'Gerente de R&S',  level: 'manager', dept: 'RH', email: 'lucas@empresa.com'  },
    ],
  };

  // ── Getters ────────────────────────────────────────────────────────────────
  private get currentDeptLabel(): string {
    return this.navItems.find(n => n.value === this.activeDept)?.label ?? this.activeDept;
  }

  private get employees(): Employee[] {
    return this.allEmployees[this.activeDept] ?? [];
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  private initials(name: string): string {
    return name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  }

  private levelLabel(level: LevelFilter): string {
    const map: Record<LevelFilter, string> = {
      all: 'Todos', exec: 'Diretoria', manager: 'Gerência', operational: 'Operacional',
    };
    return map[level] ?? level;
  }

  private matchesSearch(name: string, role: string): boolean {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return true;
    return name.toLowerCase().includes(q) || role.toLowerCase().includes(q);
  }

  private matchesLevel(level: LevelFilter): boolean {
    return this.levelFilter === 'all' || this.levelFilter === level;
  }

  private switchDept(value: string) {
    if (value === this.activeDept || this.loadingChart) return;
    this.loadingChart = true;
    this.loadingProgress = 0;
    this.selectedEmployee = null;
    const interval = setInterval(() => {
      this.loadingProgress = Math.min(85, this.loadingProgress + 20);
    }, 120);
    setTimeout(() => {
      clearInterval(interval);
      this.loadingProgress = 100;
      this.activeDept = value;
      setTimeout(() => { this.loadingChart = false; }, 100);
    }, 800);
  }

  private showToast(msg: string) {
    this.toastMessage = msg;
    this.toastVisible = true;
    setTimeout(() => { this.toastVisible = false; }, 3000);
  }

  private handleNodeClick(e: CustomEvent) {
    const emp = this.employees.find(x => x.name === e.detail?.value);
    if (emp) this.selectedEmployee = emp;
  }

  // ── Renderização dos nós da hierarquia ─────────────────────────────────────
  private renderHierarchyNodes(): TemplateResult {
    const dept = this.activeDept;

    if (dept === 'technology') {
      const show = (level: LevelFilter, name: string, role: string) =>
        this.matchesLevel(level) && this.matchesSearch(name, role);

      if (!show('exec', 'Roberto Figueiredo', 'CTO')) {
        return html`<Node value="__empty" label="Nenhum nó visível com o filtro atual"></Node>`;
      }

      return html`
        <Node value="Roberto Figueiredo" label="Roberto Figueiredo" description="CTO" expanded>
          ${show('manager', 'Ana Paula Sousa', 'Head de Produto') ? html`
            <Node value="Ana Paula Sousa" label="Ana Paula Sousa" description="Head de Produto" expanded>
              ${show('manager', 'Pedro Lima', 'Tech Lead Frontend') ? html`
                <Node value="Pedro Lima" label="Pedro Lima" description="Tech Lead Frontend"></Node>
              ` : nothing}
              ${show('manager', 'Julia Rocha', 'Tech Lead Backend') ? html`
                <Node value="Julia Rocha" label="Julia Rocha" description="Tech Lead Backend"></Node>
              ` : nothing}
            </Node>
          ` : nothing}
          ${show('manager', 'Marcos Vinicius', 'Head de Infraestrutura') ? html`
            <Node value="Marcos Vinicius" label="Marcos Vinicius" description="Head de Infraestrutura" expanded>
              ${show('operational', 'Tiago Braga', 'SRE Sênior') ? html`
                <Node value="Tiago Braga" label="Tiago Braga" description="SRE Sênior"></Node>
              ` : nothing}
            </Node>
          ` : nothing}
        </Node>
      `;
    }

    if (dept === 'commercial') {
      const show = (level: LevelFilter, name: string, role: string) =>
        this.matchesLevel(level) && this.matchesSearch(name, role);
      if (!show('exec', 'Carla Mendes', 'Diretora Comercial')) {
        return html`<Node value="__empty" label="Nenhum nó visível com o filtro atual"></Node>`;
      }
      return html`
        <Node value="Carla Mendes" label="Carla Mendes" description="Diretora Comercial" expanded>
          ${show('manager', 'Felipe Torres', 'Gerente de Contas') ? html`
            <Node value="Felipe Torres" label="Felipe Torres" description="Gerente de Contas"></Node>
          ` : nothing}
        </Node>
      `;
    }

    if (dept === 'hr') {
      const show = (level: LevelFilter, name: string, role: string) =>
        this.matchesLevel(level) && this.matchesSearch(name, role);
      if (!show('exec', 'Sandra Lima', 'Diretora de RH')) {
        return html`<Node value="__empty" label="Nenhum nó visível com o filtro atual"></Node>`;
      }
      return html`
        <Node value="Sandra Lima" label="Sandra Lima" description="Diretora de RH" expanded>
          ${show('manager', 'Lucas Britto', 'Gerente de R&S') ? html`
            <Node value="Lucas Britto" label="Lucas Britto" description="Gerente de R&S"></Node>
          ` : nothing}
        </Node>
      `;
    }

    return html`<Node value="__placeholder" label="Dados indisponíveis" description="Selecione outro departamento"></Node>`;
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  render() {
    return html`
<div class="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans flex">

  <groupnotifyuser--ml-toast-notification
    .visible=${this.toastVisible}
    type="success"
    position="top-right"
    @dismiss=${() => { this.toastVisible = false; }}
  ><Message>${this.toastMessage}</Message></groupnotifyuser--ml-toast-notification>

  <!-- Sidebar de departamentos -->
  <div class="shrink-0">
    <groupnavigatemain--ml-sidebar-nav
      value="${this.activeDept}"
      @change=${(e: CustomEvent) => this.switchDept(e.detail.value)}
    >
      <Label>Organograma</Label>
      ${this.navItems.map(n => html`
        <Item value="${n.value}" badge="${n.badge}">${n.label}</Item>
      `)}
    </groupnavigatemain--ml-sidebar-nav>
  </div>

  <!-- Área principal -->
  <div class="flex-1 min-w-0 p-6 overflow-auto">

    <!-- Breadcrumb -->
    <div class="mb-4">
      <groupnavigatesection--ml-breadcrumb-trail>
        <Item value="root">Empresa</Item>
        <Item value="dept">${this.currentDeptLabel}</Item>
      </groupnavigatesection--ml-breadcrumb-trail>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-wrap gap-3 items-center mb-5">
      <div class="w-56">
        <groupsearchcontent--ml-search-bar
          value="${this.searchQuery}"
          placeholder="Buscar colaborador..."
          debounce="300"
          @search=${(e: CustomEvent) => { this.searchQuery = e.detail.value ?? ''; }}
          @clear=${() => { this.searchQuery = ''; }}
        ></groupsearchcontent--ml-search-bar>
      </div>

      <groupnavigatesection--ml-navigate-pills
        value="${this.activeView}"
        @change=${(e: CustomEvent) => { this.activeView = e.detail.value as ViewMode; }}
      >
        <Section value="orgchart">Organograma</Section>
        <Section value="tree">Árvore</Section>
        <Section value="diagram">Diagrama</Section>
      </groupnavigatesection--ml-navigate-pills>

      <groupselectone--ml-segmented-control
        value="${this.levelFilter}"
        is-editing="true"
        @change=${(e: CustomEvent) => { this.levelFilter = e.detail.value as LevelFilter; }}
      >
        <Item value="all">Todos</Item>
        <Item value="exec">Diretoria</Item>
        <Item value="manager">Gerência</Item>
        <Item value="operational">Operacional</Item>
      </groupselectone--ml-segmented-control>

      <div class="flex gap-1 ml-auto">
        <grouptriggeraction--ml-icon-button title="Expandir tudo" @action=${() => this.showToast('Hierarquia expandida')}>
          <Icon>⬇️</Icon>
        </grouptriggeraction--ml-icon-button>
        <grouptriggeraction--ml-icon-button title="Recolher tudo" @action=${() => this.showToast('Hierarquia recolhida')}>
          <Icon>⬆️</Icon>
        </grouptriggeraction--ml-icon-button>
        <grouptriggeraction--ml-icon-button title="Exportar imagem" @action=${() => this.showToast('Exportação iniciada')}>
          <Icon>📥</Icon>
        </grouptriggeraction--ml-icon-button>
      </div>
    </div>

    <div class="flex gap-5">

      <!-- Visualização da hierarquia -->
      <div class="flex-1 min-w-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 min-h-80">

        ${this.loadingChart ? html`
          <div class="flex flex-col items-center justify-center h-64 gap-4">
            <groupshowprogress--ml-circular-progress
              value="${this.loadingProgress}"
              size="72"
              show-value="true"
            ></groupshowprogress--ml-circular-progress>
            <p class="text-sm text-slate-500 dark:text-slate-400">Carregando organograma...</p>
          </div>
        ` : html`

          ${this.activeView === 'orgchart' ? html`
            <groupviewhierarchy--ml-hierarchy-orgchart
              expand-all="true"
              @nodeClick=${(e: CustomEvent) => this.handleNodeClick(e)}
              @toggle=${() => {}}
            >
              ${this.renderHierarchyNodes()}
            </groupviewhierarchy--ml-hierarchy-orgchart>
          ` : nothing}

          ${this.activeView === 'tree' ? html`
            <groupviewhierarchy--ml-hierarchy-tree
              expand-all="true"
              @nodeClick=${(e: CustomEvent) => this.handleNodeClick(e)}
              @toggle=${() => {}}
            >
              ${this.renderHierarchyNodes()}
            </groupviewhierarchy--ml-hierarchy-tree>
          ` : nothing}

          ${this.activeView === 'diagram' ? html`
            <groupviewhierarchy--ml-hierarchy-tree-diagram
              expand-all="true"
              @nodeClick=${(e: CustomEvent) => this.handleNodeClick(e)}
              @toggle=${() => {}}
            >
              ${this.renderHierarchyNodes()}
            </groupviewhierarchy--ml-hierarchy-tree-diagram>
          ` : nothing}

        `}
      </div>

      <!-- Painel do colaborador selecionado -->
      ${this.selectedEmployee ? html`
        <div class="w-60 shrink-0">
          <groupviewcard--ml-vertical-card>
            <CardHeader>
              <CardTitle>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <span class="text-violet-700 dark:text-violet-300 font-semibold text-sm">
                      ${this.initials(this.selectedEmployee.name)}
                    </span>
                  </div>
                  <p class="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-tight">
                    ${this.selectedEmployee.name}
                  </p>
                </div>
              </CardTitle>
              <CardDescription>${this.selectedEmployee.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <p>🏢 ${this.selectedEmployee.dept}</p>
                <p>📊 ${this.levelLabel(this.selectedEmployee.level)}</p>
                <p>✉️ ${this.selectedEmployee.email}</p>
              </div>
            </CardContent>
            <CardFooter>
              <div class="flex gap-2 mt-1">
                <grouptriggeraction--ml-icon-button
                  title="Enviar e-mail"
                  @action=${() => this.showToast(`E-mail aberto para ${this.selectedEmployee!.name}`)}
                >
                  <Icon>✉️</Icon>
                </grouptriggeraction--ml-icon-button>
                <grouptriggeraction--ml-icon-button
                  title="Ver perfil completo"
                  @action=${() => this.showToast(`Abrindo perfil de ${this.selectedEmployee!.name}`)}
                >
                  <Icon>👤</Icon>
                </grouptriggeraction--ml-icon-button>
              </div>
            </CardFooter>
          </groupviewcard--ml-vertical-card>
        </div>
      ` : html`
        <div class="w-60 shrink-0 flex items-center justify-center">
          <p class="text-sm text-slate-400 dark:text-slate-500 text-center px-3">
            Clique em um nó para ver o perfil do colaborador
          </p>
        </div>
      `}

    </div>
  </div>
</div>
    `;
  }
}
