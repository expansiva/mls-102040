/// <mls fileReference="_102040_/l2/molecules/groupviewdata/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupviewdata/ml-card-grid';
import '/_102040_/l2/molecules/groupviewdata/ml-vertical-record-list';
import '/_102040_/l2/molecules/groupviewdata/ml-timeline-view';

@customElement('molecules--groupviewdata--index-102040')
export class GroupViewDataIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private card1 = 'portfolio';
  @state() private card2 = 'customers';
  @state() private card3 = 'release';

  // ===========================================================================
  // HERO
  private renderHero(): TemplateResult {
    return html`
      <header
        class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center"
      >
        <span
          class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
        >
          groupViewData
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          View Data
        </h1>
        <p
          class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Display a collection of data with adaptive layout. The component decides the best
          presentation based on context (viewport, configuration). Use when displaying multiple
          records with defined fields and rich content.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SHOWCASE CARDS
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section
        class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700"
      >
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Card grid</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupviewdata--ml-card-grid</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Best for browsing cards with balanced detail and quick scanning.
              </p>
              <groupviewdata--ml-card-grid
                name="card-1"
                value="${this.card1}"
                .hoverable=${true}
                .selectable=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card1 = e.detail.value;
                }}
              >
                <Columns>
                  <Column field="title" header="Title" />
                  <Column field="owner" header="Owner" width="180px" />
                  <Column field="status" header="Status" align="center" width="120px" />
                </Columns>
                <Rows>
                  <Row selected>
                    <Cell>Strategy Refresh 2026</Cell>
                    <Cell>Marco Silva</Cell>
                    <Cell>
                      <span
                        class="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700"
                        >Active</span
                      >
                    </Cell>
                  </Row>
                  <Row>
                    <Cell>Regional Expansion</Cell>
                    <Cell>Beatriz Nunes</Cell>
                    <Cell>
                      <span class="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700"
                        >Planning</span
                      >
                    </Cell>
                  </Row>
                  <Row disabled>
                    <Cell>Legacy Catalog Cleanup</Cell>
                    <Cell>Paulo Mendes</Cell>
                    <Cell>
                      <span class="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600"
                        >Paused</span
                      >
                    </Cell>
                  </Row>
                </Rows>
                <Empty>
                  <div class="text-center py-10 text-slate-400">No portfolio items yet.</div>
                </Empty>
                <Loading>
                  <div class="text-center py-10 text-slate-400">Loading portfolio cards...</div>
                </Loading>
              </groupviewdata--ml-card-grid>
            </div>
          </div>

          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Vertical record list</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupviewdata--ml-vertical-record-list</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Ideal for narrow layouts where each record needs a stacked presentation.
              </p>
              <groupviewdata--ml-vertical-record-list
                name="card-2"
                value="${this.card2}"
                .hoverable=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card2 = e.detail.value;
                }}
              >
                <Columns>
                  <Column field="name" header="Name" />
                  <Column field="email" header="Email" />
                  <Column field="status" header="Status" align="right" width="120px" />
                </Columns>
                <Rows>
                  <Row>
                    <Cell>
                      <div class="font-medium">Helena Rocha</div>
                      <div class="text-sm text-slate-500">Customer Success</div>
                    </Cell>
                    <Cell>helena@nova.com</Cell>
                    <Cell>
                      <span class="px-2 py-0.5 rounded-full text-xs bg-sky-100 text-sky-700"
                        >Onboarded</span
                      >
                    </Cell>
                  </Row>
                  <Row>
                    <Cell>
                      <div class="font-medium">Rafael Pinto</div>
                      <div class="text-sm text-slate-500">Enterprise</div>
                    </Cell>
                    <Cell>rafael@pulse.io</Cell>
                    <Cell>
                      <span class="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700"
                        >Pending</span
                      >
                    </Cell>
                  </Row>
                  <Row disabled>
                    <Cell>
                      <div class="font-medium">Luisa Araujo</div>
                      <div class="text-sm text-slate-500">SMB</div>
                    </Cell>
                    <Cell>luisa@legacy.co</Cell>
                    <Cell>
                      <span class="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600"
                        >Paused</span
                      >
                    </Cell>
                  </Row>
                </Rows>
                <Empty>
                  <div class="text-center py-10 text-slate-400">No customer records found.</div>
                </Empty>
                <Loading>
                  <div class="text-center py-10 text-slate-400">Fetching customer records...</div>
                </Loading>
              </groupviewdata--ml-vertical-record-list>
            </div>
          </div>

          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Timeline view</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupviewdata--ml-timeline-view</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Great for chronological narratives like releases, incidents, or milestones.
              </p>
              <groupviewdata--ml-timeline-view
                name="card-3"
                value="${this.card3}"
                .hoverable=${true}
                .loading=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card3 = e.detail.value;
                }}
              >
                <Columns>
                  <Column field="date" header="Date" width="140px" />
                  <Column field="event" header="Event" />
                  <Column field="owner" header="Owner" width="160px" />
                </Columns>
                <Rows>
                  <Row>
                    <Cell>Jun 14, 2026</Cell>
                    <Cell>
                      <div class="font-medium">Release 4.2 shipped</div>
                      <div class="text-sm text-slate-500">New dashboard and billing updates</div>
                    </Cell>
                    <Cell>Product Team</Cell>
                  </Row>
                  <Row>
                    <Cell>Jun 06, 2026</Cell>
                    <Cell>
                      <div class="font-medium">Beta feedback review</div>
                      <div class="text-sm text-slate-500">12 interviews summarized</div>
                    </Cell>
                    <Cell>UX Research</Cell>
                  </Row>
                </Rows>
                <Empty>
                  <div class="text-center py-10 text-slate-400">No timeline events yet.</div>
                </Empty>
                <Loading>
                  <div class="text-center py-10 text-slate-400">Loading release timeline...</div>
                </Loading>
              </groupviewdata--ml-timeline-view>
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
      cardGrid: boolean;
      verticalRecordList: boolean;
      timelineView: boolean;
    }> = [
      {
        scenario: 'You need a card-like layout that adapts to wide screens with rich visual content.',
        cardGrid: true,
        verticalRecordList: false,
        timelineView: false,
      },
      {
        scenario: 'The layout must stay readable on narrow screens with stacked record details.',
        cardGrid: false,
        verticalRecordList: true,
        timelineView: false,
      },
      {
        scenario: 'Records should be presented as a chronological story or sequence of milestones.',
        cardGrid: false,
        verticalRecordList: false,
        timelineView: true,
      },
      {
        scenario: 'You want quick scanning across multiple fields with balanced density.',
        cardGrid: true,
        verticalRecordList: true,
        timelineView: false,
      },
    ];
    const headers = [
      { label: 'Card grid', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Vertical list', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Timeline', cls: 'text-amber-600 dark:text-amber-400' },
    ];

    return html`
      <section
        class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700"
      >
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Compare the adaptive layouts to choose the best presentation for your data-rich records.
          </p>
          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
          >
            <table class="w-full text-sm">
              <thead>
                <tr
                  class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700"
                >
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
                    `,
                  )}
                </tr>
              </thead>
              <tbody>
                ${rows.map(
                  (row, i) => html`
                    <tr
                      class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0"
                    >
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">
                        ${row.scenario}
                      </td>
                      ${([
                        row.cardGrid,
                        row.verticalRecordList,
                        row.timelineView,
                      ] as boolean[]).map(
                        (ok) => html`
                          <td class="px-4 py-3.5 text-center">
                            ${ok
                              ? html`<span
                                  class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
                                  >✓</span
                                >`
                              : html`<span class="text-slate-200 dark:text-slate-700 text-sm">
                                  —
                                </span>`}
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
  public render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()} ${this.renderShowcaseCards()} ${this.renderReferenceTable()}
      </div>
    `;
  }
}
