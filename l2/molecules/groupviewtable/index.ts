/// <mls fileReference="_102040_/l2/molecules/groupviewtable/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupviewtable/ml-advanced-data-table';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table-minimal';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table-select';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table';
import '/_102040_/l2/molecules/groupviewtable/ml-grouping-table';
import '/_102040_/l2/molecules/groupviewtable/ml-inline-edit-table';
import '/_102040_/l2/molecules/groupviewtable/ml-pivot-table';
import '/_102040_/l2/molecules/groupviewtable/ml-view-table';
import '/_102040_/l2/molecules/groupviewtable/ml-responsive-data-table';
import '/_102040_/l2/molecules/groupviewtable/ml-lazy-record-detail-table';

// Seats loaded on demand by the lazy-detail card, keyed by the row index that `rowClick` carries.
const CARD10_SEATS: Record<number, string[]> = {
  0: ['ana.silva@northwind.com — Admin', 'bruno.costa@northwind.com — Editor', '+23 other seats'],
  1: ['carla.mendes@contoso.com — Admin', 'diego.rocha@contoso.com — Billing', '+118 other seats'],
  2: ['eduardo.lima@fabrikam.com — Admin', '+4 other seats'],
};

@customElement('molecules--groupviewtable--index-102040')
export class GroupViewTableIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private card1 = '';
  @state() private card2 = '';
  @state() private card3 = '0,2';
  @state() private card4 = '';
  @state() private card5 = '';
  @state() private card6 = '';
  @state() private card7 = '';
  @state() private card8 = '';
  @state() private card9 = '';
  @state() private card10 = '1';

  // ── Lazy detail of the card-10 table ─────────────────────────
  // The molecule emits `rowClick` with the row index when a record is expanded; this page loads
  // what it needs and writes inside that row's <Detail>. The delay is SIMULATED on purpose: it is
  // how a real BFF behaves, and it makes the "loading" state visible, which the screen has to have.
  @state() private card10Seats: Record<number, string[]> = {};
  @state() private card10Loading: number | null = null;

  private loadCard10Seats(index: number) {
    if (this.card10Seats[index] || this.card10Loading === index) return;
    this.card10Loading = index;
    setTimeout(() => {
      this.card10Seats = { ...this.card10Seats, [index]: CARD10_SEATS[index] ?? [] };
      this.card10Loading = null;
    }, 700);
  }

  /** Empty until `rowClick`, then loading, then the seats — all inside the row's live <Detail>. */
  private renderCard10Seats(index: number): TemplateResult {
    const seats = this.card10Seats[index];
    if (!seats) {
      return this.card10Loading === index
        ? html`<p class="text-xs text-slate-400">Loading seats…</p>`
        : html``;
    }
    return html`
      <div class="flex flex-col gap-1">
        ${seats.map(
          (seat) => html`<p class="text-xs text-slate-600 dark:text-slate-300">${seat}</p>`
        )}
      </div>
    `;
  }

  // =========================================================================== RENDER
  render() {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }

  // =========================================================================== RENDER HERO
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
          Choose among data, minimal, selectable, grouping, inline-edit, pivot, responsive, and lazy-detail implementations.
        </p>
      </header>
    `;
  }

  // =========================================================================== SHOWCASE CARDS
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">

          <!-- Advanced Data Table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Advanced Data Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-advanced-data-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Full-featured table with sorting, selection, and pagination</p>
              <groupviewtable--ml-advanced-data-table
                name="card-1"
                value="${this.card1}"
                .isEditing=${true}
                .selectable=${true}
                .page=${1}
                .pageSize=${5}
                .totalItems=${12}
                @change=${(e: CustomEvent) => { this.card1 = e.detail.value; }}
              >
                <Caption>Employee Directory</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="id" sortable>ID</TableHead>
                    <TableHead key="name" sortable>Name</TableHead>
                    <TableHead key="role" sortable>Role</TableHead>
                    <TableHead key="dept">Department</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>E-101</TableCell>
                    <TableCell>Ava Chen</TableCell>
                    <TableCell>Engineer</TableCell>
                    <TableCell>Platform</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>E-102</TableCell>
                    <TableCell>Marcus Lee</TableCell>
                    <TableCell>Designer</TableCell>
                    <TableCell>Product</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>E-103</TableCell>
                    <TableCell>Sofia Ruiz</TableCell>
                    <TableCell>PM</TableCell>
                    <TableCell>Growth</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No employees found</Empty>
                <Loading>Loading employees…</Loading>
              </groupviewtable--ml-advanced-data-table>
            </div>
          </div>

          <!-- Data Table Minimal -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Data Table Minimal</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-data-table-minimal</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Lightweight read-only table with minimal chrome</p>
              <groupviewtable--ml-data-table-minimal
                name="card-2"
                value="${this.card2}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.card2 = e.detail.value; }}
              >
                <Caption>Status Codes</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="code">Code</TableHead>
                    <TableHead key="label">Label</TableHead>
                    <TableHead key="severity">Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>200</TableCell>
                    <TableCell>OK</TableCell>
                    <TableCell>Info</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>404</TableCell>
                    <TableCell>Not Found</TableCell>
                    <TableCell>Warning</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>500</TableCell>
                    <TableCell>Server Error</TableCell>
                    <TableCell>Critical</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No codes available</Empty>
              </groupviewtable--ml-data-table-minimal>
            </div>
          </div>

          <!-- Data Table Select -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Data Table Select</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-data-table-select</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Row selection with checkboxes for bulk actions</p>
              <groupviewtable--ml-data-table-select
                name="card-3"
                value="${this.card3}"
                .isEditing=${true}
                .selectable=${true}
                @change=${(e: CustomEvent) => { this.card3 = e.detail.value; }}
              >
                <Caption>Invoice Batch</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="invoice" sortable>Invoice</TableHead>
                    <TableHead key="client" sortable>Client</TableHead>
                    <TableHead key="amount" sortable>Amount</TableHead>
                    <TableHead key="due">Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>INV-2401</TableCell>
                    <TableCell>Acme Corp</TableCell>
                    <TableCell>$1,250.00</TableCell>
                    <TableCell>2026-08-15</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>INV-2402</TableCell>
                    <TableCell>Globex Inc</TableCell>
                    <TableCell>$890.50</TableCell>
                    <TableCell>2026-08-20</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>INV-2403</TableCell>
                    <TableCell>Initech</TableCell>
                    <TableCell>$2,100.00</TableCell>
                    <TableCell>2026-08-12</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No invoices selected</Empty>
              </groupviewtable--ml-data-table-select>
            </div>
          </div>

          <!-- Data Table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Data Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-data-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Standard sortable data table for everyday lists</p>
              <groupviewtable--ml-data-table
                name="card-4"
                value="${this.card4}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.card4 = e.detail.value; }}
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
                    <TableCell>Sam Patel</TableCell>
                    <TableCell>$320.00</TableCell>
                    <TableCell>Shipped</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No orders found</Empty>
                <Loading>Loading orders…</Loading>
              </groupviewtable--ml-data-table>
            </div>
          </div>

          <!-- Grouping Table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-sky-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Grouping Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-grouping-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Rows organized under collapsible group headers</p>
              <groupviewtable--ml-grouping-table
                name="card-5"
                value="${this.card5}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.card5 = e.detail.value; }}
              >
                <Caption>Tasks by Project</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="task" sortable>Task</TableHead>
                    <TableHead key="assignee" sortable>Assignee</TableHead>
                    <TableHead key="priority">Priority</TableHead>
                    <TableHead key="eta">ETA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Design system tokens</TableCell>
                    <TableCell>Ava Chen</TableCell>
                    <TableCell>High</TableCell>
                    <TableCell>Aug 10</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>API rate limits</TableCell>
                    <TableCell>Marcus Lee</TableCell>
                    <TableCell>Medium</TableCell>
                    <TableCell>Aug 18</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Onboarding checklist</TableCell>
                    <TableCell>Sofia Ruiz</TableCell>
                    <TableCell>Low</TableCell>
                    <TableCell>Aug 25</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No grouped tasks</Empty>
              </groupviewtable--ml-grouping-table>
            </div>
          </div>

          <!-- Inline Edit Table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-indigo-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Inline Edit Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-inline-edit-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Editable grid that propagates isEditing into cell components</p>
              <groupviewtable--ml-inline-edit-table
                name="card-6"
                value="${this.card6}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.card6 = e.detail.value; }}
              >
                <Caption>Inventory Adjustments</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="sku" sortable>SKU</TableHead>
                    <TableHead key="product" sortable>Product</TableHead>
                    <TableHead key="qty" sortable>Qty</TableHead>
                    <TableHead key="location">Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>SKU-4410</TableCell>
                    <TableCell>Wireless Mouse</TableCell>
                    <TableCell>48</TableCell>
                    <TableCell>Aisle B2</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SKU-4411</TableCell>
                    <TableCell>USB-C Hub</TableCell>
                    <TableCell>22</TableCell>
                    <TableCell>Aisle C1</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SKU-4412</TableCell>
                    <TableCell>Laptop Stand</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell>Aisle A4</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No inventory rows</Empty>
                <Loading>Syncing inventory…</Loading>
              </groupviewtable--ml-inline-edit-table>
            </div>
          </div>

          <!-- Pivot Table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-purple-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Pivot Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-pivot-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Cross-tab summary for multi-dimensional analysis</p>
              <groupviewtable--ml-pivot-table
                name="card-7"
                value="${this.card7}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.card7 = e.detail.value; }}
              >
                <Caption>Revenue by Region × Quarter</Caption>
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
                    <TableCell>North America</TableCell>
                    <TableCell>$420K</TableCell>
                    <TableCell>$510K</TableCell>
                    <TableCell>$480K</TableCell>
                    <TableCell>$1.41M</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Europe</TableCell>
                    <TableCell>$310K</TableCell>
                    <TableCell>$355K</TableCell>
                    <TableCell>$390K</TableCell>
                    <TableCell>$1.06M</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>APAC</TableCell>
                    <TableCell>$275K</TableCell>
                    <TableCell>$300K</TableCell>
                    <TableCell>$340K</TableCell>
                    <TableCell>$915K</TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>All regions</TableCell>
                    <TableCell>$1.01M</TableCell>
                    <TableCell>$1.17M</TableCell>
                    <TableCell>$1.21M</TableCell>
                    <TableCell>$3.38M</TableCell>
                  </TableRow>
                </TableFooter>
                <Empty>No pivot data</Empty>
              </groupviewtable--ml-pivot-table>
            </div>
          </div>

          <!-- View Table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-teal-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">View Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-view-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Presentation-focused table for dashboards and reports</p>
              <groupviewtable--ml-view-table
                name="card-8"
                value="${this.card8}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.card8 = e.detail.value; }}
              >
                <Caption>KPI Snapshot</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="metric">Metric</TableHead>
                    <TableHead key="current" sortable>Current</TableHead>
                    <TableHead key="target">Target</TableHead>
                    <TableHead key="delta">Δ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>MRR</TableCell>
                    <TableCell>$84.2K</TableCell>
                    <TableCell>$80K</TableCell>
                    <TableCell>+5.3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Churn</TableCell>
                    <TableCell>2.1%</TableCell>
                    <TableCell>2.5%</TableCell>
                    <TableCell>-0.4pp</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>NPS</TableCell>
                    <TableCell>62</TableCell>
                    <TableCell>60</TableCell>
                    <TableCell>+2</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No metrics to display</Empty>
              </groupviewtable--ml-view-table>
            </div>
          </div>

          <!-- Responsive Data Table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-orange-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Responsive Data Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-responsive-data-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Adapts columns and layout for narrow viewports</p>
              <groupviewtable--ml-responsive-data-table
                name="card-9"
                value="${this.card9}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.card9 = e.detail.value; }}
              >
                <Caption>Support Tickets</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="ticket" sortable>Ticket</TableHead>
                    <TableHead key="subject" sortable>Subject</TableHead>
                    <TableHead key="priority">Priority</TableHead>
                    <TableHead key="owner">Owner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>T-9081</TableCell>
                    <TableCell>Login timeout on mobile</TableCell>
                    <TableCell>High</TableCell>
                    <TableCell>Support L2</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>T-9082</TableCell>
                    <TableCell>Export CSV truncated</TableCell>
                    <TableCell>Medium</TableCell>
                    <TableCell>Support L1</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>T-9083</TableCell>
                    <TableCell>Dark mode contrast</TableCell>
                    <TableCell>Low</TableCell>
                    <TableCell>Design</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No open tickets</Empty>
                <Loading>Fetching tickets…</Loading>
              </groupviewtable--ml-responsive-data-table>
            </div>
          </div>

          <!-- Lazy Record Detail Table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-pink-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Lazy Record Detail Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewtable--ml-lazy-record-detail-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Expands rows on demand to load nested record details</p>
              <groupviewtable--ml-lazy-record-detail-table
                name="card-10"
                value="${this.card10}"
                .isEditing=${true}
                .selectable=${true}
                @change=${(e: CustomEvent) => { this.card10 = e.detail.value; }}
                @rowClick=${(e: CustomEvent) => this.loadCard10Seats(e.detail.index)}
              >
                <Caption>Customer Accounts</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="account" sortable>Account</TableHead>
                    <TableHead key="plan" sortable>Plan</TableHead>
                    <TableHead key="seats">Seats</TableHead>
                    <TableHead key="renewal">Renewal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Northwind Traders</TableCell>
                    <TableCell>Business</TableCell>
                    <TableCell>25</TableCell>
                    <TableCell>2026-11-01</TableCell>
                    <Detail>${this.renderCard10Seats(0)}</Detail>
                  </TableRow>
                  <TableRow>
                    <TableCell>Contoso Ltd</TableCell>
                    <TableCell>Enterprise</TableCell>
                    <TableCell>120</TableCell>
                    <TableCell>2027-01-15</TableCell>
                    <Detail>${this.renderCard10Seats(1)}</Detail>
                  </TableRow>
                  <TableRow>
                    <TableCell>Fabrikam Co</TableCell>
                    <TableCell>Starter</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>2026-09-30</TableCell>
                    <Detail>${this.renderCard10Seats(2)}</Detail>
                  </TableRow>
                </TableBody>
                <Empty>No accounts loaded</Empty>
                <Loading>Loading account details…</Loading>
              </groupviewtable--ml-lazy-record-detail-table>
            </div>
          </div>

        </div>
      </section>
    `;
  }

  // =========================================================================== REFERENCE TABLE
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{
      scenario: string;
      advanced: boolean;
      minimal: boolean;
      select: boolean;
      dataTable: boolean;
      grouping: boolean;
      inlineEdit: boolean;
      pivot: boolean;
      view: boolean;
      responsive: boolean;
      lazyDetail: boolean;
    }> = [
      { scenario: 'Everyday sortable list with caption and empty state', advanced: true, minimal: true, select: true, dataTable: true, grouping: false, inlineEdit: false, pivot: false, view: true, responsive: true, lazyDetail: false },
      { scenario: 'Bulk actions via checkbox row selection', advanced: true, minimal: false, select: true, dataTable: false, grouping: false, inlineEdit: false, pivot: false, view: false, responsive: false, lazyDetail: true },
      { scenario: 'Paginated server-driven result sets', advanced: true, minimal: false, select: false, dataTable: true, grouping: false, inlineEdit: false, pivot: false, view: false, responsive: true, lazyDetail: false },
      { scenario: 'Minimal chrome for dense secondary panels', advanced: false, minimal: true, select: false, dataTable: false, grouping: false, inlineEdit: false, pivot: false, view: true, responsive: false, lazyDetail: false },
      { scenario: 'Rows organized under collapsible groups', advanced: false, minimal: false, select: false, dataTable: false, grouping: true, inlineEdit: false, pivot: false, view: false, responsive: false, lazyDetail: false },
      { scenario: 'Inline cell editing with isEditing propagation', advanced: false, minimal: false, select: false, dataTable: false, grouping: false, inlineEdit: true, pivot: false, view: false, responsive: false, lazyDetail: false },
      { scenario: 'Cross-tab / pivot summaries with footer totals', advanced: false, minimal: false, select: false, dataTable: false, grouping: false, inlineEdit: false, pivot: true, view: false, responsive: false, lazyDetail: false },
      { scenario: 'Dashboard KPI presentation without interaction chrome', advanced: false, minimal: false, select: false, dataTable: false, grouping: false, inlineEdit: false, pivot: false, view: true, responsive: false, lazyDetail: false },
      { scenario: 'Narrow viewports that must reflow columns', advanced: false, minimal: false, select: false, dataTable: false, grouping: false, inlineEdit: false, pivot: false, view: false, responsive: true, lazyDetail: false },
      { scenario: 'Expandable rows that lazy-load nested record detail', advanced: false, minimal: false, select: false, dataTable: false, grouping: false, inlineEdit: false, pivot: false, view: false, responsive: false, lazyDetail: true },
      { scenario: 'Combined sort + select + pagination in one surface', advanced: true, minimal: false, select: true, dataTable: true, grouping: false, inlineEdit: false, pivot: false, view: false, responsive: false, lazyDetail: false },
      { scenario: 'Bounded viewport with sticky header and visible pagination (fit-height)', advanced: true, minimal: false, select: false, dataTable: true, grouping: false, inlineEdit: false, pivot: false, view: false, responsive: true, lazyDetail: false },
    ];

    const headers = [
      { label: 'Advanced', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Minimal', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Select', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Data Table', cls: 'text-rose-600 dark:text-rose-400' },
      { label: 'Grouping', cls: 'text-sky-600 dark:text-sky-400' },
      { label: 'Inline Edit', cls: 'text-indigo-600 dark:text-indigo-400' },
      { label: 'Pivot', cls: 'text-purple-600 dark:text-purple-400' },
      { label: 'View', cls: 'text-teal-600 dark:text-teal-400' },
      { label: 'Responsive', cls: 'text-orange-600 dark:text-orange-400' },
      { label: 'Lazy Detail', cls: 'text-pink-600 dark:text-pink-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">Pick a table implementation by interaction model — selection, grouping, inline edit, pivot, responsive reflow, or lazy row detail — while keeping the same slot-tag contract.</p>
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm overflow-x-auto">
            <table class="w-full text-sm min-w-[64rem]">
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
                    ${([row.advanced, row.minimal, row.select, row.dataTable, row.grouping, row.inlineEdit, row.pivot, row.view, row.responsive, row.lazyDetail] as boolean[]).map(ok => html`
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
