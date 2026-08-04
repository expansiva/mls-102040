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

@customElement('molecules--groupviewtable--index-102040')
export class GroupViewTableIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardAdvanced = '0';
  @state() private cardMinimal = '';
  @state() private cardSelect = '0,2';
  @state() private cardDataTable = '';
  @state() private cardGrouping = '';
  @state() private cardInlineEdit = '';
  @state() private cardPivot = '';
  @state() private cardView = '';
  @state() private cardResponsive = '1';

  render(): TemplateResult {
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
          Displays structured data in tabular format with support for column sorting, row selection, pagination, and isEditing propagation. Pick from data tables, editable grids, grouping, pivot, and responsive implementations.
        </p>
      </header>
    `;
  }

  // =========================================================================== RENDER SHOWCASE CARDS
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Advanced Data Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-advanced-data-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Full-featured table with sorting, selection, and pagination</p>
              <groupviewtable--ml-advanced-data-table
                name="card-advanced"
                value="${this.cardAdvanced}"
                .selectable=${true}
                .page=${1}
                .pageSize=${5}
                .totalItems=${12}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardAdvanced = e.detail.value; }}
              >
                <Caption>Employee Directory</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="name" sortable>Name</TableHead>
                    <TableHead key="role" sortable>Role</TableHead>
                    <TableHead key="dept">Department</TableHead>
                    <TableHead key="status">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Alice Chen</TableCell>
                    <TableCell>Engineer</TableCell>
                    <TableCell>Platform</TableCell>
                    <TableCell>Active</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Bob Martinez</TableCell>
                    <TableCell>Designer</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Active</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Carol Nguyen</TableCell>
                    <TableCell>Manager</TableCell>
                    <TableCell>Operations</TableCell>
                    <TableCell>Away</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No employees found</Empty>
                <Loading>Loading employees…</Loading>
              </groupviewtable--ml-advanced-data-table>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Data Table Minimal</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-data-table-minimal</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Lightweight read-only table for simple structured lists</p>
              <groupviewtable--ml-data-table-minimal
                name="card-minimal"
                value="${this.cardMinimal}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardMinimal = e.detail.value; }}
              >
                <Caption>Recent Orders</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="id">Order</TableHead>
                    <TableHead key="customer">Customer</TableHead>
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
                <Empty>No orders yet</Empty>
              </groupviewtable--ml-data-table-minimal>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Data Table Select</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-data-table-select</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Row selection with checkboxes for bulk actions</p>
              <groupviewtable--ml-data-table-select
                name="card-select"
                value="${this.cardSelect}"
                .selectable=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardSelect = e.detail.value; }}
              >
                <Caption>Selectable Tasks</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="task" sortable>Task</TableHead>
                    <TableHead key="assignee" sortable>Assignee</TableHead>
                    <TableHead key="priority">Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Update billing copy</TableCell>
                    <TableCell>Dana</TableCell>
                    <TableCell>High</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Fix nav overflow</TableCell>
                    <TableCell>Eli</TableCell>
                    <TableCell>Medium</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Ship release notes</TableCell>
                    <TableCell>Fay</TableCell>
                    <TableCell>Low</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No tasks available</Empty>
              </groupviewtable--ml-data-table-select>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Data Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-data-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Standard data table with sortable columns</p>
              <groupviewtable--ml-data-table
                name="card-data-table"
                value="${this.cardDataTable}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardDataTable = e.detail.value; }}
                @sort=${(_e: CustomEvent) => {}}
              >
                <Caption>Product Catalog</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="sku" sortable>SKU</TableHead>
                    <TableHead key="product" sortable>Product</TableHead>
                    <TableHead key="price" sortable>Price</TableHead>
                    <TableHead key="stock">Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>SKU-100</TableCell>
                    <TableCell>Wireless Mouse</TableCell>
                    <TableCell>$29.99</TableCell>
                    <TableCell>142</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SKU-220</TableCell>
                    <TableCell>USB-C Hub</TableCell>
                    <TableCell>$49.00</TableCell>
                    <TableCell>67</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SKU-310</TableCell>
                    <TableCell>Laptop Stand</TableCell>
                    <TableCell>$79.50</TableCell>
                    <TableCell>23</TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>3 products</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
                <Empty>No products found</Empty>
              </groupviewtable--ml-data-table>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-sky-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Grouping Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-grouping-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Hierarchical rows grouped by category or parent key</p>
              <groupviewtable--ml-grouping-table
                name="card-grouping"
                value="${this.cardGrouping}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardGrouping = e.detail.value; }}
              >
                <Caption>Spend by Department</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="category" sortable>Category</TableHead>
                    <TableHead key="item">Item</TableHead>
                    <TableHead key="amount" sortable>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Engineering</TableCell>
                    <TableCell>Cloud hosting</TableCell>
                    <TableCell>$4,200</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Engineering</TableCell>
                    <TableCell>CI minutes</TableCell>
                    <TableCell>$890</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Marketing</TableCell>
                    <TableCell>Ad campaigns</TableCell>
                    <TableCell>$2,150</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Marketing</TableCell>
                    <TableCell>Events</TableCell>
                    <TableCell>$1,600</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No grouped data</Empty>
              </groupviewtable--ml-grouping-table>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-indigo-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Inline Edit Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-inline-edit-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Editable grid that propagates isEditing into cell components</p>
              <groupviewtable--ml-inline-edit-table
                name="card-inline-edit"
                value="${this.cardInlineEdit}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardInlineEdit = e.detail.value; }}
              >
                <Caption>Inventory Adjustments</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="item">Item</TableHead>
                    <TableHead key="qty" sortable>Qty</TableHead>
                    <TableHead key="location">Location</TableHead>
                    <TableHead key="notes">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Widget A</TableCell>
                    <TableCell>48</TableCell>
                    <TableCell>Warehouse N</TableCell>
                    <TableCell>Restock pending</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Widget B</TableCell>
                    <TableCell>12</TableCell>
                    <TableCell>Warehouse S</TableCell>
                    <TableCell>Damaged lot</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gadget C</TableCell>
                    <TableCell>200</TableCell>
                    <TableCell>Warehouse N</TableCell>
                    <TableCell>—</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No inventory rows</Empty>
              </groupviewtable--ml-inline-edit-table>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-purple-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Pivot Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-pivot-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Cross-tab layout for summarizing metrics across dimensions</p>
              <groupviewtable--ml-pivot-table
                name="card-pivot"
                value="${this.cardPivot}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardPivot = e.detail.value; }}
              >
                <Caption>Revenue by Region × Quarter</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="region">Region</TableHead>
                    <TableHead key="q1" sortable>Q1</TableHead>
                    <TableHead key="q2" sortable>Q2</TableHead>
                    <TableHead key="q3" sortable>Q3</TableHead>
                    <TableHead key="q4" sortable>Q4</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>North</TableCell>
                    <TableCell>$120k</TableCell>
                    <TableCell>$135k</TableCell>
                    <TableCell>$142k</TableCell>
                    <TableCell>$158k</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>South</TableCell>
                    <TableCell>$98k</TableCell>
                    <TableCell>$110k</TableCell>
                    <TableCell>$105k</TableCell>
                    <TableCell>$121k</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>EMEA</TableCell>
                    <TableCell>$210k</TableCell>
                    <TableCell>$225k</TableCell>
                    <TableCell>$240k</TableCell>
                    <TableCell>$255k</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No pivot data</Empty>
              </groupviewtable--ml-pivot-table>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-teal-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">View Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-view-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Presentation-focused table for read-only dashboards</p>
              <groupviewtable--ml-view-table
                name="card-view"
                value="${this.cardView}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardView = e.detail.value; }}
              >
                <Caption>System Health</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="service">Service</TableHead>
                    <TableHead key="uptime">Uptime</TableHead>
                    <TableHead key="latency">Latency</TableHead>
                    <TableHead key="status">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>API Gateway</TableCell>
                    <TableCell>99.98%</TableCell>
                    <TableCell>42ms</TableCell>
                    <TableCell>Healthy</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Auth Service</TableCell>
                    <TableCell>99.95%</TableCell>
                    <TableCell>61ms</TableCell>
                    <TableCell>Healthy</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Billing Worker</TableCell>
                    <TableCell>99.40%</TableCell>
                    <TableCell>180ms</TableCell>
                    <TableCell>Degraded</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No services reported</Empty>
                <Loading>Checking health…</Loading>
              </groupviewtable--ml-view-table>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-orange-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Responsive Data Table</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-responsive-data-table</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Adapts columns and density for narrow and mobile viewports</p>
              <groupviewtable--ml-responsive-data-table
                name="card-responsive"
                value="${this.cardResponsive}"
                .selectable=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardResponsive = e.detail.value; }}
              >
                <Caption>Team Members</Caption>
                <TableHeader>
                  <TableRow>
                    <TableHead key="name" sortable>Name</TableHead>
                    <TableHead key="email">Email</TableHead>
                    <TableHead key="role">Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Grace Lee</TableCell>
                    <TableCell>grace@example.com</TableCell>
                    <TableCell>Admin</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Hugo Berg</TableCell>
                    <TableCell>hugo@example.com</TableCell>
                    <TableCell>Editor</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Ivy Santos</TableCell>
                    <TableCell>ivy@example.com</TableCell>
                    <TableCell>Viewer</TableCell>
                  </TableRow>
                </TableBody>
                <Empty>No team members</Empty>
              </groupviewtable--ml-responsive-data-table>
            </div>
          </div>

        </div>
      </section>
    `;
  }

  // =========================================================================== RENDER REFERENCE TABLE
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
    }> = [
      { scenario: 'Simple read-only list of records', advanced: true, minimal: true, select: true, dataTable: true, grouping: false, inlineEdit: false, pivot: false, view: true, responsive: true },
      { scenario: 'Multi-row selection with checkboxes', advanced: true, minimal: false, select: true, dataTable: false, grouping: false, inlineEdit: false, pivot: false, view: false, responsive: true },
      { scenario: 'Sortable column headers', advanced: true, minimal: false, select: true, dataTable: true, grouping: true, inlineEdit: true, pivot: true, view: false, responsive: true },
      { scenario: 'Paginated large datasets', advanced: true, minimal: false, select: false, dataTable: true, grouping: false, inlineEdit: false, pivot: false, view: false, responsive: false },
      { scenario: 'Inline cell editing (isEditing propagation)', advanced: false, minimal: false, select: false, dataTable: false, grouping: false, inlineEdit: true, pivot: false, view: false, responsive: false },
      { scenario: 'Hierarchical or grouped rows', advanced: false, minimal: false, select: false, dataTable: false, grouping: true, inlineEdit: false, pivot: false, view: false, responsive: false },
      { scenario: 'Cross-tab / pivot analysis', advanced: false, minimal: false, select: false, dataTable: false, grouping: false, inlineEdit: false, pivot: true, view: false, responsive: false },
      { scenario: 'Mobile-friendly responsive layout', advanced: false, minimal: false, select: false, dataTable: false, grouping: false, inlineEdit: false, pivot: false, view: false, responsive: true },
      { scenario: 'Dashboard presentation / status boards', advanced: true, minimal: true, select: false, dataTable: true, grouping: false, inlineEdit: false, pivot: false, view: true, responsive: true },
      { scenario: 'Bounded viewport with sticky header (fit-height)', advanced: true, minimal: false, select: false, dataTable: true, grouping: false, inlineEdit: true, pivot: false, view: false, responsive: false },
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
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">Match your data interaction needs — selection, editing, grouping, pivot, or responsive layout — to the right table implementation.</p>
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
                    ${([row.advanced, row.minimal, row.select, row.dataTable, row.grouping, row.inlineEdit, row.pivot, row.view, row.responsive] as boolean[]).map(ok => html`
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
