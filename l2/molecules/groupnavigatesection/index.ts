/// <mls fileReference="_102040_/l2/molecules/groupnavigatesection/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupnavigatesection/ml-tabs';
import '/_102040_/l2/molecules/groupnavigatesection/ml-navigate-pills';
import '/_102040_/l2/molecules/groupnavigatesection/ml-breadcrumb-trail';

@customElement('molecules--groupnavigatesection--index-102040')
export class GroupNavigateSectionIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardTabs = 'overview';
  @state() private cardPills = 'activity';
  @state() private cardBreadcrumb = 'shipping';

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
      <header
        class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center"
      >
        <span
          class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
        >
          groupNavigateSection
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Navigate Section
        </h1>
        <p
          class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Allows the user to switch between sections within the same context. Sections are
          defined via Tab slot tags with value, title, icon, and disabled attributes so the
          page can render the active section content.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SHOWCASE CARDS
  // ===========================================================================
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Tabs</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupnavigatesection--ml-tabs</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Best for dense section content that lives in the same page.
              </p>
              <groupnavigatesection--ml-tabs
                name="card-tabs"
                value="${this.cardTabs}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardTabs = e.detail.value;
                }}
              >
                <Label>Product detail</Label>
                <Tab value="overview" title="Overview" icon="info">
                  <p class="text-sm text-slate-600 dark:text-slate-300">
                    Summary, hero imagery, and key highlights live here.
                  </p>
                </Tab>
                <Tab value="specs" title="Specs" icon="settings">
                  <p class="text-sm text-slate-600 dark:text-slate-300">
                    Technical dimensions, materials, and compatibility.
                  </p>
                </Tab>
                <Tab value="reviews" title="Reviews" icon="star">
                  <p class="text-sm text-slate-600 dark:text-slate-300">
                    Read verified customer ratings and comments.
                  </p>
                </Tab>
                <Tab value="support" title="Support" icon="help" disabled>
                  <p class="text-sm text-slate-600 dark:text-slate-300">
                    Support is only available to registered owners.
                  </p>
                </Tab>
              </groupnavigatesection--ml-tabs>
            </div>
          </div>

          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Navigate Pills</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupnavigatesection--ml-navigate-pills</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Compact segmented control for quick mode switching.
              </p>
              <groupnavigatesection--ml-navigate-pills
                name="card-pills"
                value="${this.cardPills}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardPills = e.detail.value;
                }}
              >
                <Label>Workspace view</Label>
                <Tab value="activity" title="Activity" icon="pulse">
                  <p class="text-sm text-slate-600 dark:text-slate-300">
                    Latest updates from tasks, mentions, and approvals.
                  </p>
                </Tab>
                <Tab value="members" title="Members" icon="users">
                  <p class="text-sm text-slate-600 dark:text-slate-300">
                    Manage roles, invites, and team assignments.
                  </p>
                </Tab>
                <Tab value="settings" title="Settings" icon="sliders" disabled>
                  <p class="text-sm text-slate-600 dark:text-slate-300">
                    Settings are locked for guest collaborators.
                  </p>
                </Tab>
              </groupnavigatesection--ml-navigate-pills>
            </div>
          </div>

          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Breadcrumb Trail</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupnavigatesection--ml-breadcrumb-trail</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Clear step progression for multi-stage flows.
              </p>
              <groupnavigatesection--ml-breadcrumb-trail
                name="card-breadcrumb"
                value="${this.cardBreadcrumb}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardBreadcrumb = e.detail.value;
                }}
              >
                <Label>Checkout progress</Label>
                <Tab value="cart" title="Cart" icon="cart">
                  <p class="text-sm text-slate-600 dark:text-slate-300">
                    Confirm quantities and apply discount codes.
                  </p>
                </Tab>
                <Tab value="shipping" title="Shipping" icon="truck">
                  <p class="text-sm text-slate-600 dark:text-slate-300">
                    Choose delivery speed and verify address.
                  </p>
                </Tab>
                <Tab value="payment" title="Payment" icon="card">
                  <p class="text-sm text-slate-600 dark:text-slate-300">
                    Select card, wallet, or invoice options.
                  </p>
                </Tab>
                <Tab value="review" title="Review" icon="check" disabled>
                  <p class="text-sm text-slate-600 dark:text-slate-300">
                    Review will unlock after payment details.
                  </p>
                </Tab>
              </groupnavigatesection--ml-breadcrumb-trail>
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
      tabs: boolean;
      navigatePills: boolean;
      breadcrumbTrail: boolean;
    }> = [
      {
        scenario: 'Switch between rich content panels on the same page.',
        tabs: true,
        navigatePills: false,
        breadcrumbTrail: false,
      },
      {
        scenario: 'Compact mode toggles where space is tight.',
        tabs: false,
        navigatePills: true,
        breadcrumbTrail: false,
      },
      {
        scenario: 'Users move step-by-step through a flow.',
        tabs: false,
        navigatePills: false,
        breadcrumbTrail: true,
      },
      {
        scenario: 'Need fast switching with minimal visual weight.',
        tabs: false,
        navigatePills: true,
        breadcrumbTrail: false,
      },
    ];
    const headers = [
      { label: 'Tabs', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Navigate Pills', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Breadcrumb Trail', cls: 'text-amber-600 dark:text-amber-400' },
    ];

    return html`
      <section
        class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700"
      >
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Quick reference
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Compare navigation patterns for switching between sections in the same context,
            from dense tabbed content to compact pills and step-based trails.
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
                      <th
                        class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}"
                      >
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
                      ${([row.tabs, row.navigatePills, row.breadcrumbTrail] as boolean[]).map(
                        (ok) => html`
                          <td class="px-4 py-3.5 text-center">
                            ${ok
                              ? html`<span
                                  class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
                                  >✓</span
                                >`
                              : html`<span class="text-slate-200 dark:text-slate-700 text-sm"
                                  >—</span
                                >`}
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
