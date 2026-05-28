/// <mls fileReference="_102040_/l2/molecules/groupviewdata/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupviewdata/ml-card-grid';

@customElement('molecules--groupviewdata--index-102040')
export class GroupGroupViewDataIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardOne = 'team-roster';
  @state() private cardTwo = 'loading-state';

  // ===========================================================================
  // RENDER
  // ===========================================================================
  protected render(): TemplateResult {
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
          groupViewData
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          View Data
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Display a collection of data with adaptive layout. The component decides the best presentation based on context and configuration, ideal for showing multiple records with rich fields.
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
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Card Grid · Team Roster</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewdata--ml-card-grid</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Adaptive grid layout with selectable cards and rich cell content.</p>
              <groupviewdata--ml-card-grid
                name="card-1"
                value="${this.cardOne}"
                .isEditing=${true}
                .selectable=${true}
                @change=${(e: CustomEvent) => {
                  this.cardOne = e.detail.value;
                }}
              >
                <Columns>
                  <Column field="name" header="Name" width="35%" align="left"></Column>
                  <Column field="role" header="Role" width="35%" align="left"></Column>
                  <Column field="status" header="Status" width="30%" align="center"></Column>
                </Columns>
                <Rows>
                  <Row selected>
                    <Cell>Alex Morgan</Cell>
                    <Cell>Design Lead</Cell>
                    <Cell>
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700">Active</span>
                    </Cell>
                  </Row>
                  <Row>
                    <Cell>Jamie Lee</Cell>
                    <Cell>Frontend Engineer</Cell>
                    <Cell>
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700">On Leave</span>
                    </Cell>
                  </Row>
                  <Row disabled>
                    <Cell>Sam Rivera</Cell>
                    <Cell>Product Analyst</Cell>
                    <Cell>
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-200 text-slate-600">Inactive</span>
                    </Cell>
                  </Row>
                </Rows>
                <Empty>
                  <div class="text-sm text-slate-500">No team members available.</div>
                </Empty>
                <Loading>
                  <div class="text-sm text-slate-500">Loading roster…</div>
                </Loading>
              </groupviewdata--ml-card-grid>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Card Grid · Loading State</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewdata--ml-card-grid</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Shows async loading while keeping column metadata consistent.</p>
              <groupviewdata--ml-card-grid
                name="card-2"
                value="${this.cardTwo}"
                .isEditing=${true}
                .loading=${true}
                .hoverable=${true}
                @change=${(e: CustomEvent) => {
                  this.cardTwo = e.detail.value;
                }}
              >
                <Columns>
                  <Column field="project" header="Project" width="40%" align="left"></Column>
                  <Column field="owner" header="Owner" width="30%" align="left"></Column>
                  <Column field="progress" header="Progress" width="30%" align="right"></Column>
                </Columns>
                <Rows>
                  <Row>
                    <Cell>Atlas Migration</Cell>
                    <Cell>Mia Chen</Cell>
                    <Cell>62%</Cell>
                  </Row>
                  <Row>
                    <Cell>Payments Refresh</Cell>
                    <Cell>Jordan Park</Cell>
                    <Cell>34%</Cell>
                  </Row>
                </Rows>
                <Empty>
                  <div class="text-sm text-slate-500">No projects match the current filters.</div>
                </Empty>
                <Loading>
                  <div class="text-sm text-slate-500">Syncing project status…</div>
                </Loading>
              </groupviewdata--ml-card-grid>
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
    const rows: Array<{ scenario: string; mlCardGrid: boolean }> = [
      { scenario: 'Need a responsive, card-based layout with flexible cell content.', mlCardGrid: true },
      { scenario: 'Displaying multiple records with rich metadata and optional selection.', mlCardGrid: true },
      { scenario: 'Prefer a traditional dense table without card styling.', mlCardGrid: false },
    ];
    const headers = [
      { label: 'Card Grid', cls: 'text-violet-600 dark:text-violet-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this decision guide to confirm when the adaptive card grid is the best fit for your data display context.
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
                      ${([row.mlCardGrid] as boolean[]).map(
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
}
