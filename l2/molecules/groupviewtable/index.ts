/// <mls fileReference="_102040_/l2/molecules/groupviewtable/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table-minimal';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table';
import '/_102040_/l2/molecules/groupviewtable/ml-view-table';
import '/_102040_/l2/molecules/groupviewtable/ml-inline-edit-table';
import '/_102040_/l2/molecules/groupviewtable/ml-pivot-table';

@customElement('molecules--groupviewtable--index-102040')
export class GroupGroupViewTableIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private card1 = '';
  @state() private card2 = '0,2';
  @state() private card3 = '';
  @state() private card4 = '1';
  @state() private card5 = '';

  // ===========================================================================
  // HERO SECTION
  private renderHero(): TemplateResult {
    return html`
      <header
        class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center"
      >
        <span
          class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
        >
          groupViewTable
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          View Tables
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Displays structured data in tabular format. Data provided via TableHeader, TableBody, TableRow, TableHead, and TableCell slot tags.
          Supports column sorting, row selection with checkboxes, pagination, and isEditing propagation to web components inside cells.
          Implementations include data table, simple table, editable grid, virtualized table, and tree table.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SHOWCASE CARDS SECTION
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section
        class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700"
      >
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Minimal data table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupviewtable--ml-data-table-minimal</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Lightweight listing for simple inventory snapshots.</p>
              <groupviewtable--ml-data-table-minimal
                name="card-1"
                value="${this.card1}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card1 = e.detail.value;
                }}
              >
                <Caption>Warehouse Snapshot</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="sku" sortable>SKU</TableHead>
                    <TableHead key="item" sortable>Item</TableHead>
                    <TableHead key="stock">On Hand</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>ST-204</TableCell>
                    <TableCell>Canvas Tote</TableCell>
                    <TableCell>142</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ST-305</TableCell>
                    <TableCell>Travel Mug</TableCell>
                    <TableCell>68</TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colspan="3">Updated 10 minutes ago</TableCell>
                  </TableRow>
                </TableFooter>
                <Empty>No items in inventory.</Empty>
                <Loading>Refreshing inventory…</Loading>
              </groupviewtable--ml-data-table-minimal>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Interactive data table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupviewtable--ml-data-table</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Selectable rows, pagination, and sorting for operational worklists.</p>
              <groupviewtable--ml-data-table
                name="card-2"
                value="${this.card2}"
                .isEditing=${true}
                .selectable=${true}
                .page=${1}
                .pageSize=${3}
                .totalItems=${8}
                @change=${(e: CustomEvent) => {
                  this.card2 = e.detail.value;
                }}
              >
                <Caption>Order Queue</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="order" sortable>Order</TableHead>
                    <TableHead key="customer" sortable>Customer</TableHead>
                    <TableHead key="total" sortable>Total</TableHead>
                    <TableHead key="status">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#1042</TableCell>
                    <TableCell>Jonas Patel</TableCell>
                    <TableCell>$249.00</TableCell>
                    <TableCell>Ready</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>#1043</TableCell>
                    <TableCell>Amira Carter</TableCell>
                    <TableCell>$89.50</TableCell>
                    <TableCell>Picking</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>#1044</TableCell>
                    <TableCell>Keon Lewis</TableCell>
                    <TableCell>$132.80</TableCell>
                    <TableCell>Hold</TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colspan="4">3 of 8 orders</TableCell>
                  </TableRow>
                </TableFooter>
                <Empty>No orders in the queue.</Empty>
                <Loading>Loading order queue…</Loading>
              </groupviewtable--ml-data-table>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Read-only view table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupviewtable--ml-view-table</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Clean presentation table for reporting dashboards.</p>
              <groupviewtable--ml-view-table
                name="card-3"
                value="${this.card3}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card3 = e.detail.value;
                }}
              >
                <Caption>Weekly Performance</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="team" sortable>Team</TableHead>
                    <TableHead key="target" sortable>Target</TableHead>
                    <TableHead key="actual" sortable>Actual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>North</TableCell>
                    <TableCell>$120k</TableCell>
                    <TableCell>$131k</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Central</TableCell>
                    <TableCell>$98k</TableCell>
                    <TableCell>$90k</TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colspan="3">Updated Monday 8:00 AM</TableCell>
                  </TableRow>
                </TableFooter>
                <Empty>No performance data.</Empty>
                <Loading>Fetching performance data…</Loading>
              </groupviewtable--ml-view-table>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Inline edit grid</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupviewtable--ml-inline-edit-table</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Editable cells for quick adjustments without leaving the table.</p>
              <groupviewtable--ml-inline-edit-table
                name="card-4"
                value="${this.card4}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card4 = e.detail.value;
                }}
              >
                <Caption>Pricing Overrides</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="plan" sortable>Plan</TableHead>
                    <TableHead key="rate" sortable>Rate</TableHead>
                    <TableHead key="status">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Starter</TableCell>
                    <TableCell>
                      <input
                        class="border border-slate-200 dark:border-slate-600 rounded px-2 py-1 text-sm bg-white dark:bg-slate-700"
                        value="$29"
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        class="border border-slate-200 dark:border-slate-600 rounded px-2 py-1 text-sm bg-white dark:bg-slate-700"
                        value="Active"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Growth</TableCell>
                    <TableCell>
                      <input
                        class="border border-slate-200 dark:border-slate-600 rounded px-2 py-1 text-sm bg-white dark:bg-slate-700"
                        value="$79"
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        class="border border-slate-200 dark:border-slate-600 rounded px-2 py-1 text-sm bg-white dark:bg-slate-700"
                        value="Draft"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colspan="3">Auto-saves every 30s</TableCell>
                  </TableRow>
                </TableFooter>
                <Empty>No pricing overrides.</Empty>
                <Loading>Syncing edits…</Loading>
              </groupviewtable--ml-inline-edit-table>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-sky-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Pivot-style summary table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupviewtable--ml-pivot-table</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Cross-tab metrics for multi-dimensional reporting.</p>
              <groupviewtable--ml-pivot-table
                name="card-5"
                value="${this.card5}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card5 = e.detail.value;
                }}
              >
                <Caption>Regional Revenue Pivot</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="region" sortable>Region</TableHead>
                    <TableHead key="q1" sortable>Q1</TableHead>
                    <TableHead key="q2" sortable>Q2</TableHead>
                    <TableHead key="q3" sortable>Q3</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Americas</TableCell>
                    <TableCell>$1.2M</TableCell>
                    <TableCell>$1.4M</TableCell>
                    <TableCell>$1.3M</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>EMEA</TableCell>
                    <TableCell>$980k</TableCell>
                    <TableCell>$1.1M</TableCell>
                    <TableCell>$1.0M</TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colspan="4">Totals updated weekly</TableCell>
                  </TableRow>
                </TableFooter>
                <Empty>No pivot metrics available.</Empty>
                <Loading>Crunching pivot metrics…</Loading>
              </groupviewtable--ml-pivot-table>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE SECTION
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{
      scenario: string;
      dataTableMinimal: boolean;
      dataTable: boolean;
      viewTable: boolean;
      inlineEditTable: boolean;
      pivotTable: boolean;
    }> = [
      {
        scenario: 'Need the lightest table shell for read-only listings.',
        dataTableMinimal: true,
        dataTable: false,
        viewTable: false,
        inlineEditTable: false,
        pivotTable: false,
      },
      {
        scenario: 'Require selection, pagination, and sorting for work queues.',
        dataTableMinimal: false,
        dataTable: true,
        viewTable: false,
        inlineEditTable: false,
        pivotTable: false,
      },
      {
        scenario: 'Present a clean, non-editable dashboard view.',
        dataTableMinimal: false,
        dataTable: false,
        viewTable: true,
        inlineEditTable: false,
        pivotTable: false,
      },
      {
        scenario: 'Enable editing directly inside cells.',
        dataTableMinimal: false,
        dataTable: false,
        viewTable: false,
        inlineEditTable: true,
        pivotTable: false,
      },
      {
        scenario: 'Show cross-tab summaries and multi-axis totals.',
        dataTableMinimal: false,
        dataTable: false,
        viewTable: false,
        inlineEditTable: false,
        pivotTable: true,
      },
    ];
    const headers = [
      { label: 'Data Table Minimal', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Data Table', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'View Table', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Inline Edit Table', cls: 'text-rose-600 dark:text-rose-400' },
      { label: 'Pivot Table', cls: 'text-sky-600 dark:text-sky-400' },
    ];

    return html`
      <section
        class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700"
      >
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this matrix to select the table implementation that matches the structured data experience you need—from lightweight
            views to interactive, editable, or summarized tables.
          </p>
          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
          >
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <th
                    class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-3/4"
                  >
                    Scenario
                  </th>
                  ${headers.map(
                    (h) => html`
                      <th class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}">
                        ${h.label}
                      </th>
                    `
                  )}
                </tr>
              </thead>
              <tbody>
                ${rows.map(
                  (row, i) => html`
                    <tr
                      class="${i % 2 !== 0
                        ? 'bg-slate-50/60 dark:bg-slate-900/40'
                        : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0"
                    >
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                      ${([
                        row.dataTableMinimal,
                        row.dataTable,
                        row.viewTable,
                        row.inlineEditTable,
                        row.pivotTable,
                      ] as boolean[]).map(
                        (ok) => html`
                          <td class="px-4 py-3.5 text-center">
                            ${ok
                              ? html`<span
                                  class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
                                  >✓</span
                                >`
                              : html`<span class="text-slate-200 dark:text-slate-700 text-sm">—</span>`}
                          </td>
                        `
                      )}
                    </tr>
                  `
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // MAIN RENDER
  public render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()} ${this.renderShowcaseCards()} ${this.renderReferenceTable()}
      </div>
    `;
  }
}
