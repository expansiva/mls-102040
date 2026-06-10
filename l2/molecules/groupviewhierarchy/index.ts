/// <mls fileReference="_102040_/l2/molecules/groupviewhierarchy/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupviewhierarchy/ml-hierarchy-orgchart';
import '/_102040_/l2/molecules/groupviewhierarchy/ml-hierarchy-tree-diagram';
import '/_102040_/l2/molecules/groupviewhierarchy/ml-hierarchy-tree';
import '/_102040_/l2/molecules/groupviewhierarchy/ml-view-hierarchy-mindmap';

@customElement('molecules--groupviewhierarchy--index-102040')
export class GroupViewHierarchyIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private card1 = 'vp-engineering';
  @state() private card2 = 'core-services';
  @state() private card3 = 'src';
  @state() private card4 = 'launch-plan';

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
        <span
          class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
        >
          groupViewHierarchy
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          View Hierarchy
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Displays hierarchical data structures with parent-child relationships. Uses recursive Node slot tags with free content that can nest indefinitely. Supports expand/collapse of nodes with children, accordion mode (one per level), and expand-all. Implementations include tree view, org chart, cascader, nested list, and mind map.
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Org chart</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewhierarchy--ml-hierarchy-orgchart</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Highlight reporting lines and leadership layers.</p>
              <groupviewhierarchy--ml-hierarchy-orgchart
                name="card-1"
                value="${this.card1}"
                .isEditing=${true}
                .multiple=${false}
                @change=${(e: CustomEvent) => {
                  this.card1 = e.detail.value;
                }}
              >
                <Label>Engineering org</Label>
                <Node expanded>
                  CEO
                  <Node expanded>
                    VP Engineering
                    <Node>Platform Lead</Node>
                    <Node>Product Lead</Node>
                    <Node disabled>QA Lead (open role)</Node>
                  </Node>
                  <Node>VP Design</Node>
                </Node>
                <Empty>No departments defined yet.</Empty>
              </groupviewhierarchy--ml-hierarchy-orgchart>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Tree diagram</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewhierarchy--ml-hierarchy-tree-diagram</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Map system architecture with multiple branches open.</p>
              <groupviewhierarchy--ml-hierarchy-tree-diagram
                name="card-2"
                value="${this.card2}"
                .isEditing=${true}
                .expandAll=${true}
                @change=${(e: CustomEvent) => {
                  this.card2 = e.detail.value;
                }}
              >
                <Label>Product architecture</Label>
                <Node expanded>
                  Core services
                  <Node>Auth</Node>
                  <Node>
                    Billing
                    <Node>Invoices</Node>
                    <Node>Payments</Node>
                  </Node>
                </Node>
                <Node>
                  Experience layer
                  <Node>Web app</Node>
                  <Node>Mobile app</Node>
                </Node>
                <Empty>Architecture nodes will appear here.</Empty>
              </groupviewhierarchy--ml-hierarchy-tree-diagram>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Tree view</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewhierarchy--ml-hierarchy-tree</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Classic folder navigation with expandable file nodes.</p>
              <groupviewhierarchy--ml-hierarchy-tree
                name="card-3"
                value="${this.card3}"
                .isEditing=${true}
                .multiple=${true}
                @change=${(e: CustomEvent) => {
                  this.card3 = e.detail.value;
                }}
              >
                <Label>Project files</Label>
                <Node expanded>
                  📁 src
                  <Node>
                    📁 components
                    <Node>📄 Header.tsx</Node>
                    <Node>📄 Footer.tsx</Node>
                  </Node>
                  <Node>
                    📁 pages
                    <Node>📄 Home.tsx</Node>
                    <Node>📄 About.tsx</Node>
                  </Node>
                </Node>
                <Node>📄 package.json</Node>
                <Empty>No files yet.</Empty>
              </groupviewhierarchy--ml-hierarchy-tree>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Mind map</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupviewhierarchy--ml-view-hierarchy-mindmap</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Visualize brainstorming topics with nested ideas.</p>
              <groupviewhierarchy--ml-view-hierarchy-mindmap
                name="card-4"
                value="${this.card4}"
                .isEditing=${true}
                .expandAll=${true}
                @change=${(e: CustomEvent) => {
                  this.card4 = e.detail.value;
                }}
              >
                <Label>Launch plan</Label>
                <Node expanded>
                  Awareness
                  <Node>PR story</Node>
                  <Node>Partner outreach</Node>
                </Node>
                <Node expanded>
                  Activation
                  <Node>Onboarding tour</Node>
                  <Node>Trial checklist</Node>
                </Node>
                <Node>
                  Retention
                  <Node>Weekly insights</Node>
                  <Node>Success playbooks</Node>
                </Node>
                <Empty>No ideas added yet.</Empty>
              </groupviewhierarchy--ml-view-hierarchy-mindmap>
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
      orgChart: boolean;
      treeDiagram: boolean;
      tree: boolean;
      mindMap: boolean;
    }> = [
      {
        scenario: 'You need to show reporting structure and leadership layers.',
        orgChart: true,
        treeDiagram: false,
        tree: false,
        mindMap: false,
      },
      {
        scenario: 'You are mapping systems or services with multiple branches open.',
        orgChart: false,
        treeDiagram: true,
        tree: false,
        mindMap: false,
      },
      {
        scenario: 'You want familiar file or category navigation with expandable items.',
        orgChart: false,
        treeDiagram: false,
        tree: true,
        mindMap: false,
      },
      {
        scenario: 'You are brainstorming ideas around a central topic.',
        orgChart: false,
        treeDiagram: false,
        tree: false,
        mindMap: true,
      },
    ];
    const headers = [
      { label: 'Org chart', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Tree diagram', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Tree view', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Mind map', cls: 'text-rose-600 dark:text-rose-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Choose the layout that best communicates your hierarchy, from formal reporting lines to freeform idea mapping.
          </p>
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
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
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">
                        ${row.scenario}
                      </td>
                      ${([row.orgChart, row.treeDiagram, row.tree, row.mindMap] as boolean[]).map(
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
}
