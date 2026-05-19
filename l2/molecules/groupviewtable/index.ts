/// <mls fileReference="_102040_/l2/molecules/groupviewtable/index.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table-minimal';
import '/_102040_/l2/molecules/groupviewtable/ml-view-table';

// ===========================================================================
// DATASET
// ===========================================================================

interface Employee {
  name: string;
  department: string;
  role: string;
  status: string;
}

const EMPLOYEES: Employee[] = [
  { name: 'Alice Martins',     department: 'Engineering',       role: 'Senior Developer',     status: 'Active'   },
  { name: 'Bruno Costa',       department: 'Product',           role: 'Product Manager',      status: 'Active'   },
  { name: 'Carla Souza',       department: 'Design',            role: 'UX Designer',          status: 'On leave' },
  { name: 'Diego Lima',        department: 'Data & Analytics',  role: 'Data Scientist',       status: 'Active'   },
  { name: 'Elena Rocha',       department: 'Marketing',         role: 'Growth Analyst',       status: 'Active'   },
  { name: 'Felipe Torres',     department: 'Engineering',       role: 'DevOps Engineer',      status: 'Active'   },
  { name: 'Gabriela Ferreira', department: 'Finance',           role: 'Financial Analyst',    status: 'Active'   },
  { name: 'Henrique Alves',    department: 'Sales',             role: 'Account Executive',    status: 'Active'   },
  { name: 'Isabela Nunes',     department: 'Legal',             role: 'Legal Counsel',        status: 'Active'   },
  { name: 'João Pereira',      department: 'Engineering',       role: 'Frontend Developer',   status: 'On leave' },
  { name: 'Karen Silva',       department: 'Design',            role: 'Product Designer',     status: 'Active'   },
  { name: 'Lucas Moreira',     department: 'Data & Analytics',  role: 'ML Engineer',          status: 'Active'   },
  { name: 'Mariana Santos',    department: 'Marketing',         role: 'Content Strategist',   status: 'Active'   },
  { name: 'Nathan Oliveira',   department: 'Engineering',       role: 'Backend Developer',    status: 'Active'   },
  { name: 'Olivia Carvalho',   department: 'Product',           role: 'Product Designer',     status: 'Active'   },
  { name: 'Pedro Ramos',       department: 'Sales',             role: 'Sales Manager',        status: 'Active'   },
  { name: 'Quintão Barbosa',   department: 'Finance',           role: 'Controller',           status: 'Active'   },
  { name: 'Renata Gomes',      department: 'Engineering',       role: 'QA Engineer',          status: 'Active'   },
  { name: 'Samuel Dias',       department: 'Data & Analytics',  role: 'BI Analyst',           status: 'Inactive' },
  { name: 'Tatiana Cruz',      department: 'HR',                role: 'HR Manager',           status: 'Active'   },
  { name: 'Ulisses Mendes',    department: 'Engineering',       role: 'Tech Lead',            status: 'Active'   },
  { name: 'Valentina Pires',   department: 'Marketing',         role: 'Brand Manager',        status: 'Active'   },
  { name: 'Wagner Correia',    department: 'Sales',             role: 'SDR',                  status: 'Active'   },
  { name: 'Xanda Freitas',     department: 'Design',            role: 'Motion Designer',      status: 'On leave' },
  { name: 'Yara Monteiro',     department: 'Legal',             role: 'Compliance Officer',   status: 'Active'   },
  { name: 'Zara Fonseca',      department: 'Engineering',       role: 'Cloud Architect',      status: 'Active'   },
  { name: 'Adam Weber',        department: 'Product',           role: 'Product Owner',        status: 'Active'   },
  { name: 'Barbara King',      department: 'Data & Analytics',  role: 'Data Engineer',        status: 'Active'   },
  { name: 'Carlos Reyes',      department: 'Sales',             role: 'Regional Manager',     status: 'Active'   },
  { name: 'Diana Müller',      department: 'Finance',           role: 'Treasurer',            status: 'Active'   },
  { name: 'Eric Johnson',      department: 'Engineering',       role: 'Security Engineer',    status: 'Active'   },
  { name: 'Fatima Malik',      department: 'Marketing',         role: 'SEO Specialist',       status: 'Active'   },
  { name: 'George Park',       department: 'Engineering',       role: 'iOS Developer',        status: 'On leave' },
  { name: 'Hannah Schmidt',    department: 'Design',            role: 'Design Lead',          status: 'Active'   },
  { name: 'Igor Novak',        department: 'Data & Analytics',  role: 'Analytics Manager',    status: 'Active'   },
  { name: 'Julia Chen',        department: 'Product',           role: 'Product Analyst',      status: 'Active'   },
  { name: 'Kevin Okafor',      department: 'Sales',             role: 'Enterprise AE',        status: 'Active'   },
  { name: 'Laura Dupont',      department: 'Legal',             role: 'IP Specialist',        status: 'Inactive' },
  { name: 'Marco Rossi',       department: 'Engineering',       role: 'Android Developer',    status: 'Active'   },
  { name: 'Nina Petrov',       department: 'Finance',           role: 'Accountant',           status: 'Active'   },
  { name: 'Omar Hassan',       department: 'Engineering',       role: 'Embedded Systems',     status: 'Active'   },
  { name: 'Patricia Yamamoto', department: 'Marketing',         role: 'Campaign Manager',     status: 'Active'   },
  { name: 'Quentin Blanc',     department: 'Product',           role: 'CTO',                  status: 'Active'   },
  { name: 'Rosa Gutierrez',    department: 'Design',            role: 'UI Designer',          status: 'Active'   },
  { name: 'Stefan Kovač',      department: 'Data & Analytics',  role: 'Research Scientist',   status: 'Active'   },
  { name: 'Tanya Osei',        department: 'Sales',             role: 'Customer Success',     status: 'Active'   },
  { name: 'Umar Ali',          department: 'Engineering',       role: 'Platform Engineer',    status: 'On leave' },
  { name: 'Vera Antonova',     department: 'Finance',           role: 'Risk Analyst',         status: 'Active'   },
  { name: 'William Adeyemi',   department: 'Marketing',         role: 'VP Marketing',         status: 'Active'   },
  { name: 'Xiomara Diaz',      department: 'Engineering',       role: 'Principal Engineer',   status: 'Active'   },
];

// ===========================================================================
// CONFIG
// ===========================================================================

interface TableConfig {
  selectable: boolean;
  loading: boolean;
  disabled: boolean;
  pageSize: number;
}

const defaultTableConfig = (): TableConfig => ({
  selectable: false,
  loading: false,
  disabled: false,
  pageSize: 10,
});

const SECTION_BG = [
  'bg-white dark:bg-slate-900',
  'bg-slate-100/70 dark:bg-slate-800/50',
];
const CARD_BG = [
  'bg-slate-50 dark:bg-slate-800',
  'bg-white dark:bg-slate-800',
];

@customElement('molecules--groupviewtable--index-102040')
export class GroupViewTableIndex extends StateLitElement {

  @state() dataTableMinimal: TableConfig = defaultTableConfig();
  @state() dataTablePage: number = 1;

  @state() viewTable: TableConfig = defaultTableConfig();

  // ===========================================================================
  // CONFIG PANEL HELPERS
  // ===========================================================================

  private renderToggle(label: string, active: boolean, onClick: () => void, cardBg: string): TemplateResult {
    return html`
<button
  class="${active
    ? 'bg-sky-500 text-white border-sky-500'
    : `${cardBg} text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:opacity-80`
  } border rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer w-full text-left"
  @click=${onClick}
>${label}</button>`;
  }

  private renderConfig(cfg: TableConfig, update: (next: TableConfig) => void, cardBg: string): TemplateResult {
    return html`
<div class="flex flex-col gap-4">
  <div>
    <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Props</p>
    <div class="flex flex-col gap-2">
      ${this.renderToggle('selectable', cfg.selectable, () => update({ ...cfg, selectable: !cfg.selectable }), cardBg)}
      ${this.renderToggle('loading',    cfg.loading,    () => update({ ...cfg, loading:    !cfg.loading    }), cardBg)}
      ${this.renderToggle('disabled',   cfg.disabled,   () => update({ ...cfg, disabled:   !cfg.disabled   }), cardBg)}
    </div>
  </div>
  <div>
    <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">page-size</p>
    <div class="flex flex-col gap-1.5">
      ${[5, 10, 25].map((size) => html`
        <button
          class="${cfg.pageSize === size
            ? 'bg-sky-500 text-white border-sky-500'
            : `${cardBg} text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:opacity-80`
          } border rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer w-full text-left"
          @click=${() => update({ ...cfg, pageSize: size })}
        >${size} per page</button>
      `)}
    </div>
  </div>
</div>`;
  }

  private renderSection(
    index: number,
    title: string,
    tag: string,
    objective: string,
    content: (cardBg: string) => TemplateResult
  ): TemplateResult {
    const sectionBg = SECTION_BG[index % 2];
    const cardBg    = CARD_BG[index % 2];
    return html`
<section class="${sectionBg} px-8 py-12 border-t border-slate-200 dark:border-slate-700">
  <div class="mb-8">
    <div class="flex items-center gap-3 mb-2">
      <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100">${title}</h2>
      <code class="text-xs bg-slate-200/70 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-1 rounded">${tag}</code>
    </div>
    <p class="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">${objective}</p>
  </div>
  <div class="grid grid-cols-[200px_1fr] gap-6 items-start">
    ${content(cardBg)}
  </div>
</section>`;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================

  render() {
    const dtPageSize  = this.dataTableMinimal.pageSize;
    const dtPage      = this.dataTablePage;
    const dtPageRows  = EMPLOYEES.slice((dtPage - 1) * dtPageSize, dtPage * dtPageSize);

    return html`
<div class="bg-white dark:bg-slate-900 min-h-screen font-sans">

  <!-- Group header -->
  <header class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-10">
    <div class="max-w-3xl">
      <span class="inline-block px-2.5 py-1 bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 rounded-md text-xs font-semibold uppercase tracking-wide mb-3">
        groupViewTable
      </span>
      <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-3">View Table</h1>
      <p class="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
        Displays structured data in tabular format. Data provided via TableHeader, TableBody, TableRow,
        TableHead, and TableCell slot tags. Supports column sorting, row selection with checkboxes,
        pagination, and isEditing propagation to web components inside cells.
      </p>
    </div>
  </header>

  ${this.renderSection(0,
    'Data Table Minimal',
    'groupviewtable--ml-data-table-minimal',
    'A minimalist data table with optional row selection, loading and empty states, and full dark mode support. Sorting and pagination are handled externally — the component emits events and the page is responsible for slicing the dataset.',
    (cardBg) => html`
      <div class="${cardBg} border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        ${this.renderConfig(this.dataTableMinimal, (n) => { this.dataTableMinimal = n; this.dataTablePage = 1; }, cardBg)}
      </div>
      <div class="${cardBg} border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <groupviewtable--ml-data-table-minimal
          .selectable=${this.dataTableMinimal.selectable}
          .loading=${this.dataTableMinimal.loading}
          .disabled=${this.dataTableMinimal.disabled}
          .page=${dtPage}
          .pageSize=${dtPageSize}
          .totalItems=${EMPLOYEES.length}
          value=""
          error=""
          @page-change=${(e: CustomEvent) => { this.dataTablePage = e.detail.page; }}
        >
          <Caption>Employee Directory (${EMPLOYEES.length} employees)</Caption>
          <TableHeader>
            <TableRow>
              <TableHead key="name">Name</TableHead>
              <TableHead key="department">Department</TableHead>
              <TableHead key="role">Role</TableHead>
              <TableHead key="status">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            ${dtPageRows.map((e) => html`
            <TableRow>
              <TableCell>${e.name}</TableCell>
              <TableCell>${e.department}</TableCell>
              <TableCell>${e.role}</TableCell>
              <TableCell>${e.status}</TableCell>
            </TableRow>`)}
          </TableBody>
        </groupviewtable--ml-data-table-minimal>
      </div>
    `
  )}

  ${this.renderSection(1,
    'View Table',
    'groupviewtable--ml-view-table',
    'A clean, minimalist table that manages sorting and pagination internally. Pass all rows in the slots and set page-size — the component handles navigation, page tracking, and column sorting automatically.',
    (cardBg) => html`
      <div class="${cardBg} border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        ${this.renderConfig(this.viewTable, (n) => { this.viewTable = n; }, cardBg)}
      </div>
      <div class="${cardBg} border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <groupviewtable--ml-view-table
          .selectable=${this.viewTable.selectable}
          .loading=${this.viewTable.loading}
          .disabled=${this.viewTable.disabled}
          .pageSize=${this.viewTable.pageSize}
          value=""
          error=""
        >
          <Caption>Employee Directory (${EMPLOYEES.length} employees)</Caption>
          <TableHeader>
            <TableRow>
              <TableHead key="name" sortable>Name</TableHead>
              <TableHead key="department" sortable>Department</TableHead>
              <TableHead key="role">Role</TableHead>
              <TableHead key="status" sortable>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            ${EMPLOYEES.map((e) => html`
            <TableRow>
              <TableCell>${e.name}</TableCell>
              <TableCell>${e.department}</TableCell>
              <TableCell>${e.role}</TableCell>
              <TableCell>${e.status}</TableCell>
            </TableRow>`)}
          </TableBody>
        </groupviewtable--ml-view-table>
      </div>
    `
  )}

</div>`;
  }
}
