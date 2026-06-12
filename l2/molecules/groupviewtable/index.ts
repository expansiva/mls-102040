/// <mls fileReference="_102040_/l2/molecules/groupviewtable/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table-minimal';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table';
import '/_102040_/l2/molecules/groupviewtable/ml-inline-edit-table';
import '/_102040_/l2/molecules/groupviewtable/ml-pivot-table';
import '/_102040_/l2/molecules/groupviewtable/ml-view-table';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table-select';

@customElement('molecules--groupviewtable--index-102040')
export class GroupViewTableIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardMinimal = '';
  @state() private cardData = '';
  @state() private cardInline = '';
  @state() private cardPivot = '';
  @state() private cardView = '';
  @state() private cardSelect = '1';

  // ===========================================================================
  // HERO
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
          Displays structured data in tabular format. Implementations include data table, simple table, editable grid, virtualized table, and tree table with consistent slots for headers, rows, and cells.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SHOWCASE CARDS
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Minimal data table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-data-table-minimal</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Simple read-only table with a caption and totals footer.</p>
              <groupviewtable--ml-data-table-minimal name="card-1" value="${this.cardMinimal}" .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardMinimal = e.detail.value; }}>
                <Caption>Weekly Order Summary</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="order" sortable>Order</TableHead>
                    <TableHead key="customer" sortable>Customer</TableHead>
                    <TableHead key="total">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#1240</TableCell>
                    <TableCell>Sofia Miles</TableCell>
                    <TableCell>$240.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>#1241</TableCell>
                    <TableCell>Daniel Brooks</TableCell>
                    <TableCell>$96.50</TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colspan="2">Total</TableCell>
                    <TableCell>$336.50</TableCell>
                  </TableRow>
                </TableFooter>
                <Empty>No orders yet</Empty>
                <Loading>Loading orders…</Loading>
              </groupviewtable--ml-data-table-minimal>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Feature-rich data table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-data-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Sortable columns with pagination for large datasets.</p>
              <groupviewtable--ml-data-table name="card-2" value="${this.cardData}" .isEditing=${true} .page=${1} .pageSize=${5} .totalItems=${22}
                @change=${(e: CustomEvent) => { this.cardData = e.detail.value; }}>
                <Caption>Support Tickets</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="ticket" sortable>Ticket</TableHead>
                    <TableHead key="priority" sortable>Priority</TableHead>
                    <TableHead key="status">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#4412</TableCell>
                    <TableCell>High</TableCell>
                    <TableCell>Open</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>#4413</TableCell>
                    <TableCell>Medium</TableCell>
                    <TableCell>In progress</TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colspan="3">Showing 1–2 of 22</TableCell>
                  </TableRow>
                </TableFooter>
                <Empty>No tickets found</Empty>
                <Loading>Loading tickets…</Loading>
              </groupviewtable--ml-data-table>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Inline edit grid</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-inline-edit-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Editable cells for quick data adjustments.</p>
              <groupviewtable--ml-inline-edit-table name="card-3" value="${this.cardInline}" .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardInline = e.detail.value; }}>
                <Caption>Inventory Adjustments</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="sku" sortable>SKU</TableHead>
                    <TableHead key="location" sortable>Location</TableHead>
                    <TableHead key="quantity">Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>SKU-2201</TableCell>
                    <TableCell>Warehouse A</TableCell>
                    <TableCell>
                      <input class="w-full rounded-md border border-slate-200 dark:border-slate-600 bg-transparent px-2 py-1 text-sm" value="120" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SKU-2202</TableCell>
                    <TableCell>Warehouse B</TableCell>
                    <TableCell>
                      <input class="w-full rounded-md border border-slate-200 dark:border-slate-600 bg-transparent px-2 py-1 text-sm" value="78" />
                    </TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colspan="3">Edits save automatically</TableCell>
                  </TableRow>
                </TableFooter>
                <Empty>No inventory rows</Empty>
                <Loading>Loading inventory…</Loading>
              </groupviewtable--ml-inline-edit-table>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Pivot-style table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-pivot-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Compare metrics across multiple dimensions.</p>
              <groupviewtable--ml-pivot-table name="card-4" value="${this.cardPivot}" .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardPivot = e.detail.value; }}>
                <Caption>Regional Sales</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="region" sortable>Region</TableHead>
                    <TableHead key="q1" sortable>Q1</TableHead>
                    <TableHead key="q2" sortable>Q2</TableHead>
                    <TableHead key="q3">Q3</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>North America</TableCell>
                    <TableCell>$1.2M</TableCell>
                    <TableCell>$1.4M</TableCell>
                    <TableCell>$1.6M</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Europe</TableCell>
                    <TableCell>$980K</TableCell>
                    <TableCell>$1.1M</TableCell>
                    <TableCell>$1.3M</TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colspan="4">Fiscal year 2026</TableCell>
                  </TableRow>
                </TableFooter>
                <Empty>No sales data</Empty>
                <Loading>Loading sales…</Loading>
              </groupviewtable--ml-pivot-table>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-sky-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">View-only table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-view-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Compact table for dashboards and read-only views.</p>
              <groupviewtable--ml-view-table name="card-5" value="${this.cardView}" .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardView = e.detail.value; }}>
                <Caption>Team Availability</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="member" sortable>Member</TableHead>
                    <TableHead key="role" sortable>Role</TableHead>
                    <TableHead key="status">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Amira Patel</TableCell>
                    <TableCell>Designer</TableCell>
                    <TableCell>Available</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Leo Carter</TableCell>
                    <TableCell>Engineer</TableCell>
                    <TableCell>In meeting</TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colspan="3">Updated 5 minutes ago</TableCell>
                  </TableRow>
                </TableFooter>
                <Empty>No team data</Empty>
                <Loading>Loading team…</Loading>
              </groupviewtable--ml-view-table>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-indigo-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Selectable rows table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-data-table-select</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Includes selection checkboxes for bulk actions.</p>
              <groupviewtable--ml-data-table-select name="card-6" value="${this.cardSelect}" .isEditing=${true} .selectable=${true}
                @change=${(e: CustomEvent) => { this.cardSelect = e.detail.value; }}>
                <Caption>Invoice Queue</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="invoice" sortable>Invoice</TableHead>
                    <TableHead key="client" sortable>Client</TableHead>
                    <TableHead key="amount">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>INV-901</TableCell>
                    <TableCell>Nova Health</TableCell>
                    <TableCell>$2,450.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>INV-902</TableCell>
                    <TableCell>Bright Labs</TableCell>
                    <TableCell>$780.00</TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colspan="3">2 invoices awaiting review</TableCell>
                  </TableRow>
                </TableFooter>
                <Empty>No invoices available</Empty>
                <Loading>Loading invoices…</Loading>
              </groupviewtable--ml-data-table-select>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{
      scenario: string;
      dataTableMinimal: boolean;
      dataTable: boolean;
      inlineEditTable: boolean;
      pivotTable: boolean;
      viewTable: boolean;
      dataTableSelect: boolean;
    }> = [
      {
        scenario: 'Quick read-only summary with minimal UI and no pagination.',
        dataTableMinimal: true,
        dataTable: false,
        inlineEditTable: false,
        pivotTable: false,
        viewTable: true,
        dataTableSelect: false,
      },
      {
        scenario: 'Need sortable columns with pagination for large datasets.',
        dataTableMinimal: false,
        dataTable: true,
        inlineEditTable: false,
        pivotTable: false,
        viewTable: false,
        dataTableSelect: false,
      },
      {
        scenario: 'Users should edit values directly within table cells.',
        dataTableMinimal: false,
        dataTable: false,
        inlineEditTable: true,
        pivotTable: false,
        viewTable: false,
        dataTableSelect: false,
      },
      {
        scenario: 'Compare metrics across regions or time periods at a glance.',
        dataTableMinimal: false,
        dataTable: false,
        inlineEditTable: false,
        pivotTable: true,
        viewTable: false,
        dataTableSelect: false,
      },
      {
        scenario: 'Enable bulk actions by selecting multiple rows.',
        dataTableMinimal: false,
        dataTable: false,
        inlineEditTable: false,
        pivotTable: false,
        viewTable: false,
        dataTableSelect: true,
      },
    ];
    const headers = [
      { label: 'Minimal', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Data table', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Inline edit', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Pivot', cls: 'text-rose-600 dark:text-rose-400' },
      { label: 'View', cls: 'text-sky-600 dark:text-sky-400' },
      { label: 'Selectable', cls: 'text-indigo-600 dark:text-indigo-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this guide to pick the right table implementation when displaying structured data in tabular format.
          </p>
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <th class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-3/4">Scenario</th>
                  ${headers.map(
                    (h) => html`
                      <th class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}">${h.label}</th>
                    `,
                  )}
                </tr>
              </thead>
              <tbody>
                ${rows.map(
                  (row, i) => html`
                    <tr class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0">
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                      ${([
                        row.dataTableMinimal,
                        row.dataTable,
                        row.inlineEditTable,
                        row.pivotTable,
                        row.viewTable,
                        row.dataTableSelect,
                      ] as boolean[]).map(
                        (ok) => html`
                          <td class="px-4 py-3.5 text-center">
                            ${ok
                              ? html`<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>`
                              : html`<span class="text-slate-200 dark:text-slate-700 text-sm">—</span>`}
                          </td>
                        `,
                      )}
                    </tr>
                  `,
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // RENDER
  render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }
}
