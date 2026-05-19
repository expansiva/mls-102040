/// <mls fileReference="_102040_/l2/molecules/groupviewtable/index.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table-minimal';
import '/_102040_/l2/molecules/groupviewtable/ml-view-table';

interface TableConfig {
  selectable: boolean;
  loading: boolean;
  disabled: boolean;
}

const defaultTableConfig = (): TableConfig => ({
  selectable: false,
  loading: false,
  disabled: false,
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
    'A minimalist data table with optional row selection, loading and empty states, pagination, and full dark mode support. Sorting and pagination are handled externally via emitted events.',
    (cardBg) => html`
      <div class="${cardBg} border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        ${this.renderConfig(this.dataTableMinimal, (n) => { this.dataTableMinimal = n; }, cardBg)}
      </div>
      <div class="${cardBg} border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <groupviewtable--ml-data-table-minimal
          .selectable=${this.dataTableMinimal.selectable}
          .loading=${this.dataTableMinimal.loading}
          .disabled=${this.dataTableMinimal.disabled}
          value=""
          error=""
          page="1"
          page-size="0"
          total-items="0"
        >
          <Caption>Employee Directory</Caption>
          <TableHeader>
            <TableRow>
              <TableHead key="name">Name</TableHead>
              <TableHead key="department">Department</TableHead>
              <TableHead key="role">Role</TableHead>
              <TableHead key="status">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Alice Martins</TableCell>
              <TableCell>Engineering</TableCell>
              <TableCell>Senior Developer</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bruno Costa</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Product Manager</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Carla Souza</TableCell>
              <TableCell>Design</TableCell>
              <TableCell>UX Designer</TableCell>
              <TableCell>On leave</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Diego Lima</TableCell>
              <TableCell>Data & Analytics</TableCell>
              <TableCell>Data Scientist</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Elena Rocha</TableCell>
              <TableCell>Marketing</TableCell>
              <TableCell>Growth Analyst</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
          </TableBody>
        </groupviewtable--ml-data-table-minimal>
      </div>
    `
  )}

  ${this.renderSection(1,
    'View Table',
    'groupviewtable--ml-view-table',
    'A clean, minimalist table that manages sorting and pagination internally. Supports row selection, loading and empty states, and adapts all colors for dark mode. Set page-size to enable built-in pagination.',
    (cardBg) => html`
      <div class="${cardBg} border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        ${this.renderConfig(this.viewTable, (n) => { this.viewTable = n; }, cardBg)}
      </div>
      <div class="${cardBg} border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <groupviewtable--ml-view-table
          .selectable=${this.viewTable.selectable}
          .loading=${this.viewTable.loading}
          .disabled=${this.viewTable.disabled}
          value=""
          error=""
          page-size="3"
        >
          <Caption>Employee Directory</Caption>
          <TableHeader>
            <TableRow>
              <TableHead key="name" sortable>Name</TableHead>
              <TableHead key="department" sortable>Department</TableHead>
              <TableHead key="role">Role</TableHead>
              <TableHead key="status" sortable>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Alice Martins</TableCell>
              <TableCell>Engineering</TableCell>
              <TableCell>Senior Developer</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bruno Costa</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Product Manager</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Carla Souza</TableCell>
              <TableCell>Design</TableCell>
              <TableCell>UX Designer</TableCell>
              <TableCell>On leave</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Diego Lima</TableCell>
              <TableCell>Data & Analytics</TableCell>
              <TableCell>Data Scientist</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Elena Rocha</TableCell>
              <TableCell>Marketing</TableCell>
              <TableCell>Growth Analyst</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Felipe Torres</TableCell>
              <TableCell>Engineering</TableCell>
              <TableCell>DevOps Engineer</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
          </TableBody>
        </groupviewtable--ml-view-table>
      </div>
    `
  )}

</div>`;
  }
}
