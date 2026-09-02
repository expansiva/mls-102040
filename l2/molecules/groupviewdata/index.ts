/// <mls fileReference="_102040_/l2/molecules/groupviewdata/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupviewdata/ml-card-grid';
import '/_102040_/l2/molecules/groupviewdata/ml-timeline-view';
import '/_102040_/l2/molecules/groupviewdata/ml-vertical-record-list';
import '/_102040_/l2/molecules/groupviewdata/ml-calendar-view';
import '/_102040_/l2/molecules/groupviewdata/ml-kanban-board';
import { molecules, scenarios } from '/_102040_/l2/molecules/groupviewdata/index.defs.js';
import { renderCatalogReferenceTable } from '/_102020_/l2/aura/molecules/shared/indexReferenceTable.js';

@customElement('molecules--groupviewdata--index-102040')
export class GroupViewDataIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardOne = 'quarterly-reports';
  @state() private cardTwo = 'release-timeline';
  @state() private cardThree = 'customer-notes';
  @state() private cardFour = 'events-calendar';
  @state() private cardFive = 'delivery-kanban';

  // ===========================================================================
  // HERO
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span
          class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
        >
          groupViewData
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          View Data
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Display a collection of data with adaptive layout. The component decides the best presentation based on context (viewport, configuration).
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Card grid</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">
                  groupviewdata--ml-card-grid
                </code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Use for visual summaries that benefit from equal-height cards.</p>
              <groupviewdata--ml-card-grid
                name="card-1"
                value="${this.cardOne}"
                .isEditing=${true}
                .hoverable=${true}
                @change=${(e: CustomEvent) => {
                  this.cardOne = e.detail.value;
                }}
              >
                <Columns>
                  <Column field="title" header="Title" />
                  <Column field="summary" header="Summary" />
                  <Column field="owner" header="Owner" align="center" width="120px" />
                </Columns>
                <Rows>
                  <Row>
                    <Cell>Quarterly Report Q2</Cell>
                    <Cell>Highlights of revenue and growth KPIs.</Cell>
                    <Cell>Ana M.</Cell>
                  </Row>
                  <Row>
                    <Cell>Marketing Dashboard</Cell>
                    <Cell>Campaign performance and channel mix.</Cell>
                    <Cell>Rafael L.</Cell>
                  </Row>
                </Rows>
                <Empty>
                  <div class="text-center py-10 text-slate-400">No reports available.</div>
                </Empty>
                <Loading>
                  <div class="text-center py-10 text-slate-400">Loading card grid...</div>
                </Loading>
              </groupviewdata--ml-card-grid>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Timeline view</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">
                  groupviewdata--ml-timeline-view
                </code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Best for ordering records by milestone or release date.</p>
              <groupviewdata--ml-timeline-view
                name="card-2"
                value="${this.cardTwo}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardTwo = e.detail.value;
                }}
              >
                <Columns>
                  <Column field="date" header="Date" width="120px" />
                  <Column field="event" header="Event" />
                  <Column field="owner" header="Owner" align="center" width="120px" />
                </Columns>
                <Rows>
                  <Row>
                    <Cell>Jun 18</Cell>
                    <Cell>Beta release shipped to pilot clients.</Cell>
                    <Cell>Lucas R.</Cell>
                  </Row>
                  <Row>
                    <Cell>Jul 02</Cell>
                    <Cell>Public launch and onboarding campaign.</Cell>
                    <Cell>Bruna C.</Cell>
                  </Row>
                </Rows>
                <Empty>
                  <div class="text-center py-8 text-slate-400">Timeline is empty.</div>
                </Empty>
                <Loading>
                  <div class="text-center py-10 text-slate-400">Loading timeline...</div>
                </Loading>
              </groupviewdata--ml-timeline-view>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Vertical record list</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">
                  groupviewdata--ml-vertical-record-list
                </code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Ideal for stacked details with emphasis on the primary field.</p>
              <groupviewdata--ml-vertical-record-list
                name="card-3"
                value="${this.cardThree}"
                .isEditing=${true}
                .selectable=${true}
                @change=${(e: CustomEvent) => {
                  this.cardThree = e.detail.value;
                }}
              >
                <Columns>
                  <Column field="customer" header="Customer" />
                  <Column field="note" header="Note" />
                  <Column field="status" header="Status" align="center" width="120px" />
                </Columns>
                <Rows>
                  <Row>
                    <Cell>Acme Retail</Cell>
                    <Cell>Follow up on invoice discrepancies.</Cell>
                    <Cell>Open</Cell>
                  </Row>
                  <Row selected>
                    <Cell>Nova Labs</Cell>
                    <Cell>Waiting on procurement approval.</Cell>
                    <Cell>Pending</Cell>
                  </Row>
                </Rows>
                <Empty>
                  <div class="text-center py-8 text-slate-400">No customer notes yet.</div>
                </Empty>
                <Loading>
                  <div class="text-center py-10 text-slate-400">Loading records...</div>
                </Loading>
              </groupviewdata--ml-vertical-record-list>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Calendar view</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">
                  groupviewdata--ml-calendar-view
                </code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Perfect for date-driven collections and scheduling contexts.</p>
              <groupviewdata--ml-calendar-view
                name="card-4"
                value="${this.cardFour}"
                .isEditing=${true}
                .loading=${true}
                @change=${(e: CustomEvent) => {
                  this.cardFour = e.detail.value;
                }}
              >
                <Columns>
                  <Column field="date" header="Date" width="120px" />
                  <Column field="event" header="Event" />
                  <Column field="team" header="Team" align="center" width="120px" />
                </Columns>
                <Rows>
                  <Row>
                    <Cell>Jun 14</Cell>
                    <Cell>Design review with stakeholders.</Cell>
                    <Cell>UX</Cell>
                  </Row>
                  <Row>
                    <Cell>Jun 21</Cell>
                    <Cell>Infrastructure maintenance window.</Cell>
                    <Cell>Ops</Cell>
                  </Row>
                </Rows>
                <Empty>
                  <div class="text-center py-8 text-slate-400">No events scheduled.</div>
                </Empty>
                <Loading>
                  <div class="text-center py-10 text-slate-400">Syncing calendar data...</div>
                </Loading>
              </groupviewdata--ml-calendar-view>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-sky-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Kanban board</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">
                  groupviewdata--ml-kanban-board
                </code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Use for pipeline workflows with multiple status lanes.</p>
              <groupviewdata--ml-kanban-board
                name="card-5"
                value="${this.cardFive}"
                .isEditing=${true}
                .hoverable=${true}
                @change=${(e: CustomEvent) => {
                  this.cardFive = e.detail.value;
                }}
              >
                <Columns>
                  <Column field="task" header="Task" />
                  <Column field="status" header="Status" width="140px" align="center" />
                  <Column field="owner" header="Owner" align="center" width="120px" />
                </Columns>
                <Rows>
                  <Row>
                    <Cell>Finalize supplier contract</Cell>
                    <Cell>Review</Cell>
                    <Cell>Fábio S.</Cell>
                  </Row>
                  <Row>
                    <Cell>Prepare onboarding deck</Cell>
                    <Cell>In progress</Cell>
                    <Cell>Marina D.</Cell>
                  </Row>
                </Rows>
                <Empty>
                  <div class="text-center py-8 text-slate-400">No cards in the board.</div>
                </Empty>
                <Loading>
                  <div class="text-center py-10 text-slate-400">Loading board data...</div>
                </Loading>
              </groupviewdata--ml-kanban-board>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  private renderReferenceTable(): TemplateResult {
    return renderCatalogReferenceTable(molecules, scenarios);
  }

  // ===========================================================================
  // RENDER
  protected render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()} ${this.renderShowcaseCards()} ${this.renderReferenceTable()}
      </div>
    `;
  }
}
