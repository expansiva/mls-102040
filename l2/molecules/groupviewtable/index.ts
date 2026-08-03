/// <mls fileReference="_102040_/l2/molecules/groupviewtable/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table-minimal';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table-select';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table';
import '/_102040_/l2/molecules/groupviewtable/ml-inline-edit-table';
import '/_102040_/l2/molecules/groupviewtable/ml-pivot-table';
import '/_102040_/l2/molecules/groupviewtable/ml-view-table';
import '/_102040_/l2/molecules/groupviewtable/ml-advanced-data-table';
import '/_102040_/l2/molecules/groupviewtable/ml-grouping-table';

@customElement('molecules--groupviewtable--index-102040')
export class GroupViewTableIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private card1 = '';
  @state() private card2 = '0';
  @state() private card3 = '';
  @state() private card4 = '';
  @state() private card5 = '';
  @state() private card6 = '';
  @state() private card7 = '1';
  @state() private card8 = '';

  render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }

  // ===========================================================================
  // HERO
  // ===========================================================================
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupViewTable
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          View Table
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Displays structured data in tabular format with shared slot tags for headers, rows, and cells.
          Implementations cover data tables, selection, inline editing, pivot, virtualization, and tree/grouping layouts.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SHOWCASE CARDS
  // ===========================================================================
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">

          <!-- ml-data-table-minimal -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Data Table Minimal</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-data-table-minimal</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Lightweight read-only table for simple structured lists</p>
              <groupviewtable--ml-data-table-minimal
                name="card-1"
                value="${this.card1}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.card1 = e.detail.value; }}
              >
                <Caption>Team Roster</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="name">Name</TableHead>
                    <TableHead key="role">Role</TableHead>
                    <TableHead key="status">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Alice Chen</TableCell>
                    <TableCell>Engineer</TableCell>
                    <TableCell>Active</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Bob Martinez</TableCell>
                    <TableCell>Designer</TableCell>
                    <TableCell>Active</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cara Nguyen</TableCell>
                    <TableCell>PM</TableCell>
                    <TableCell>Away</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No team members</Empty>
              </groupviewtable--ml-data-table-minimal>
            </div>
          </div>

          <!-- ml-data-table-select -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Data Table Select</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-data-table-select</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Row selection with checkboxes for bulk actions</p>
              <groupviewtable--ml-data-table-select
                name="card-2"
                value="${this.card2}"
                .selectable=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.card2 = e.detail.value; }}
              >
                <Caption>Selectable Orders</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="id" sortable>Order</TableHead>
                    <TableHead key="customer" sortable>Customer</TableHead>
                    <TableHead key="total">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#1042</TableCell>
                    <TableCell>Acme Corp</TableCell>
                    <TableCell>$320.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>#1043</TableCell>
                    <TableCell>Globex Inc</TableCell>
                    <TableCell>$89.50</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>#1044</TableCell>
                    <TableCell>Initech</TableCell>
                    <TableCell>$1,240.00</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No orders selected</Empty>
              </groupviewtable--ml-data-table-select>
            </div>
          </div>

          <!-- ml-data-table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Data Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-data-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Full-featured data table with sortable columns</p>
              <groupviewtable--ml-data-table
                name="card-3"
                value="${this.card3}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.card3 = e.detail.value; }}
                @sort=${(e: CustomEvent) => { console.log('sort', e.detail); }}
              >
                <Caption>Order List</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="id" sortable>ID</TableHead>
                    <TableHead key="customer" sortable>Customer</TableHead>
                    <TableHead key="total" sortable>Total</TableHead>
                    <TableHead key="status">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#001</TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell>$150.00</TableCell>
                    <TableCell>Completed</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>#002</TableCell>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>$89.50</TableCell>
                    <TableCell>Pending</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>#003</TableCell>
                    <TableCell>Sam Wilson</TableCell>
                    <TableCell>$420.00</TableCell>
                    <TableCell>Shipped</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No orders found</Empty>
                <Loading>Loading orders…</Loading>
              </groupviewtable--ml-data-table>
            </div>
          </div>

          <!-- ml-inline-edit-table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Inline Edit Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-inline-edit-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Editable grid that propagates isEditing into cell components</p>
              <groupviewtable--ml-inline-edit-table
                name="card-4"
                value="${this.card4}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.card4 = e.detail.value; }}
              >
                <Caption>Inventory Adjustments</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="sku">SKU</TableHead>
                    <TableHead key="product">Product</TableHead>
                    <TableHead key="qty">Qty</TableHead>
                    <TableHead key="location">Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>SKU-100</TableCell>
                    <TableCell>Widget A</TableCell>
                    <TableCell>24</TableCell>
                    <TableCell>Aisle 3</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SKU-200</TableCell>
                    <TableCell>Widget B</TableCell>
                    <TableCell>12</TableCell>
                    <TableCell>Aisle 1</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SKU-300</TableCell>
                    <TableCell>Gadget C</TableCell>
                    <TableCell>8</TableCell>
                    <TableCell>Aisle 7</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No inventory rows</Empty>
              </groupviewtable--ml-inline-edit-table>
            </div>
          </div>

          <!-- ml-pivot-table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-sky-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Pivot Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-pivot-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Cross-tabulated metrics by dimension for analysis views</p>
              <groupviewtable--ml-pivot-table
                name="card-5"
                value="${this.card5}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.card5 = e.detail.value; }}
              >
                <Caption>Sales by Region × Quarter</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="region">Region</TableHead>
                    <TableHead key="q1" sortable>Q1</TableHead>
                    <TableHead key="q2" sortable>Q2</TableHead>
                    <TableHead key="q3" sortable>Q3</TableHead>
                    <TableHead key="total">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>North</TableCell>
                    <TableCell>$12k</TableCell>
                    <TableCell>$15k</TableCell>
                    <TableCell>$14k</TableCell>
                    <TableCell>$41k</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>South</TableCell>
                    <TableCell>$9k</TableCell>
                    <TableCell>$11k</TableCell>
                    <TableCell>$13k</TableCell>
                    <TableCell>$33k</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>West</TableCell>
                    <TableCell>$18k</TableCell>
                    <TableCell>$17k</TableCell>
                    <TableCell>$21k</TableCell>
                    <TableCell>$56k</TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>All</TableCell>
                    <TableCell>$39k</TableCell>
                    <TableCell>$43k</TableCell>
                    <TableCell>$48k</TableCell>
                    <TableCell>$130k</TableCell>
                  </TableRow>
                </TableFooter>
                <Empty>No pivot data</Empty>
              </groupviewtable--ml-pivot-table>
            </div>
          </div>

          <!-- ml-view-table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-indigo-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">View Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-view-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">General-purpose view table for structured read displays</p>
              <groupviewtable--ml-view-table
                name="card-6"
                value="${this.card6}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.card6 = e.detail.value; }}
              >
                <Caption>Project Summary</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="project">Project</TableHead>
                    <TableHead key="owner">Owner</TableHead>
                    <TableHead key="progress">Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Apollo Redesign</TableCell>
                    <TableCell>Maya</TableCell>
                    <TableCell>72%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Orbit API</TableCell>
                    <TableCell>Leo</TableCell>
                    <TableCell>45%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Nova Mobile</TableCell>
                    <TableCell>Priya</TableCell>
                    <TableCell>90%</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No projects</Empty>
              </groupviewtable--ml-view-table>
            </div>
          </div>

          <!-- ml-advanced-data-table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-purple-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Advanced Data Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-advanced-data-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Pagination, selection, and sorting for large datasets</p>
              <groupviewtable--ml-advanced-data-table
                name="card-7"
                value="${this.card7}"
                .selectable=${true}
                .isEditing=${true}
                .page=${1}
                .pageSize=${3}
                .totalItems=${12}
                @change=${(e: CustomEvent) => { this.card7 = e.detail.value; }}
                @pageChange=${(e: CustomEvent) => { console.log('page', e.detail); }}
                @sort=${(e: CustomEvent) => { console.log('sort', e.detail); }}
              >
                <Caption>Customer Directory</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="id" sortable>ID</TableHead>
                    <TableHead key="name" sortable>Name</TableHead>
                    <TableHead key="email">Email</TableHead>
                    <TableHead key="plan">Plan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>C-01</TableCell>
                    <TableCell>Rivera Labs</TableCell>
                    <TableCell>hello@rivera.io</TableCell>
                    <TableCell>Pro</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>C-02</TableCell>
                    <TableCell>Northwind</TableCell>
                    <TableCell>ops@northwind.co</TableCell>
                    <TableCell>Starter</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>C-03</TableCell>
                    <TableCell>Brightside</TableCell>
                    <TableCell>team@brightside.app</TableCell>
                    <TableCell>Enterprise</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No customers</Empty>
                <Loading>Loading customers…</Loading>
              </groupviewtable--ml-advanced-data-table>
            </div>
          </div>

          <!-- ml-grouping-table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-teal-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Grouping Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-grouping-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Hierarchical or grouped rows for nested data sets</p>
              <groupviewtable--ml-grouping-table
                name="card-8"
                value="${this.card8}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.card8 = e.detail.value; }}
              >
                <Caption>Departments & People</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="label">Name</TableHead>
                    <TableHead key="title">Title</TableHead>
                    <TableHead key="location">Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Engineering</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>HQ</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>·· Ava Patel</TableCell>
                    <TableCell>Tech Lead</TableCell>
                    <TableCell>HQ</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>·· Noah Kim</TableCell>
                    <TableCell>SWE</TableCell>
                    <TableCell>Remote</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Design</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>Studio</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>·· Mia Rossi</TableCell>
                    <TableCell>Design Lead</TableCell>
                    <TableCell>Studio</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No groups</Empty>
              </groupviewtable--ml-grouping-table>
            </div>
          </div>

        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  // ===========================================================================
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{
      scenario: string;
      minimal: boolean;
      select: boolean;
      dataTable: boolean;
      inlineEdit: boolean;
      pivot: boolean;
      view: boolean;
      advanced: boolean;
      grouping: boolean;
    }> = [
      { scenario: 'Simple read-only list with minimal chrome', minimal: true, select: false, dataTable: true, inlineEdit: false, pivot: false, view: true, advanced: false, grouping: false },
      { scenario: 'Bulk actions requiring row checkboxes', minimal: false, select: true, dataTable: false, inlineEdit: false, pivot: false, view: false, advanced: true, grouping: false },
      { scenario: 'Sortable columns on operational data', minimal: false, select: true, dataTable: true, inlineEdit: false, pivot: true, view: false, advanced: true, grouping: false },
      { scenario: 'Inline cell editing / editable grid', minimal: false, select: false, dataTable: false, inlineEdit: true, pivot: false, view: false, advanced: false, grouping: false },
      { scenario: 'Cross-tab metrics (region × period, etc.)', minimal: false, select: false, dataTable: false, inlineEdit: false, pivot: true, view: false, advanced: false, grouping: false },
      { scenario: 'Paginated large datasets', minimal: false, select: false, dataTable: false, inlineEdit: false, pivot: false, view: false, advanced: true, grouping: false },
      { scenario: 'Hierarchical or department-grouped rows', minimal: false, select: false, dataTable: false, inlineEdit: false, pivot: false, view: false, advanced: false, grouping: true },
      { scenario: 'Propagate isEditing into cell web components', minimal: false, select: false, dataTable: true, inlineEdit: true, pivot: false, view: false, advanced: true, grouping: false },
      { scenario: 'Empty and loading slot states', minimal: true, select: true, dataTable: true, inlineEdit: true, pivot: true, view: true, advanced: true, grouping: true },
      { scenario: 'General structured view without extras', minimal: true, select: false, dataTable: false, inlineEdit: false, pivot: false, view: true, advanced: false, grouping: false },
    ];

    const headers = [
      { label: 'Minimal', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Select', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Data Table', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Inline Edit', cls: 'text-rose-600 dark:text-rose-400' },
      { label: 'Pivot', cls: 'text-sky-600 dark:text-sky-400' },
      { label: 'View', cls: 'text-indigo-600 dark:text-indigo-400' },
      { label: 'Advanced', cls: 'text-purple-600 dark:text-purple-400' },
      { label: 'Grouping', cls: 'text-teal-600 dark:text-teal-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">Pick a table implementation by interaction needs — selection, sorting, inline edit, pivot analysis, pagination, or hierarchical grouping.</p>
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <th class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-3/4">Scenario</th>
                  ${headers.map(h => html`
                    <th class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}">${h.label}</th>
                  `)}
                </tr>
              </thead>
              <tbody>
                ${rows.map((row, i) => html`
                  <tr class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0">
                    <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                    ${([row.minimal, row.select, row.dataTable, row.inlineEdit, row.pivot, row.view, row.advanced, row.grouping] as boolean[]).map(ok => html`
                      <td class="px-4 py-3.5 text-center">
                        ${ok
                          ? html`<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>`
                          : html`<span class="text-slate-200 dark:text-slate-700 text-sm">—</span>`}
                      </td>
                    `)}
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }
}
