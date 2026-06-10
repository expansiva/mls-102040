/// <mls fileReference="_102040_/l2/molecules/groupnavigatesection/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupnavigatesection/ml-breadcrumb-trail';
import '/_102040_/l2/molecules/groupnavigatesection/ml-navigate-pills';
import '/_102040_/l2/molecules/groupnavigatesection/ml-tabs';
import '/_102040_/l2/molecules/groupnavigatesection/ml-side-nav-scrollspy';
import '/_102040_/l2/molecules/groupnavigatesection/ml-navigate-tabs';

@customElement('molecules--groupnavigatesection--index-102040')
export class GroupNavigateSectionIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardBreadcrumbTrail = 'overview';
  @state() private cardNavigatePills = 'plan';
  @state() private cardTabs = 'profile';
  @state() private cardSideNavScrollspy = 'summary';
  @state() private cardNavigateTabs = 'details';

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
          groupNavigateSection
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Navigate Sections
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to switch between sections within the same context. Sections defined via Tab slot tags
          with value, title, icon, and disabled attributes. Value is the active tab identifier. Page is responsible
          for displaying each section content. Implementations include tabs, pills/segmented control, navigation
          menu, bottom navigation, and pagination.
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
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Breadcrumb trail</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupnavigatesection--ml-breadcrumb-trail</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Lightweight top-level breadcrumb for nested product sections.
              </p>
              <groupnavigatesection--ml-breadcrumb-trail
                name="card-1"
                value="${this.cardBreadcrumbTrail}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardBreadcrumbTrail = e.detail.value;
                }}
              >
                <Label>Product spaces</Label>
                <Tab value="overview" title="Overview" icon="grid">
                  <p class="text-sm text-slate-600 dark:text-slate-300">
                    Highlights, KPIs, and top-level progress.
                  </p>
                </Tab>
                <Tab value="specs" title="Specs" icon="list">
                  <p class="text-sm text-slate-600 dark:text-slate-300">
                    Technical requirements and system details.
                  </p>
                </Tab>
                <Tab value="reviews" title="Reviews" icon="chat">
                  <p class="text-sm text-slate-600 dark:text-slate-300">
                    Customer feedback and internal QA notes.
                  </p>
                </Tab>
                <Tab value="support" title="Support" icon="life-buoy" disabled>
                  <p class="text-sm text-slate-600 dark:text-slate-300">Support queue is offline.</p>
                </Tab>
              </groupnavigatesection--ml-breadcrumb-trail>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Navigate pills</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupnavigatesection--ml-navigate-pills</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Compact segmented control for filtering plan sections.</p>
              <groupnavigatesection--ml-navigate-pills
                name="card-2"
                value="${this.cardNavigatePills}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardNavigatePills = e.detail.value;
                }}
              >
                <Label>Plan builder</Label>
                <Tab value="plan" title="Plan" icon="calendar">
                  <p class="text-sm text-slate-600 dark:text-slate-300">Define milestones and owners.</p>
                </Tab>
                <Tab value="budget" title="Budget" icon="wallet">
                  <p class="text-sm text-slate-600 dark:text-slate-300">Track spend, forecasts, and approvals.</p>
                </Tab>
                <Tab value="risks" title="Risks" icon="alert-triangle">
                  <p class="text-sm text-slate-600 dark:text-slate-300">Monitor blockers and mitigation tasks.</p>
                </Tab>
                <Tab value="history" title="History" icon="clock" disabled>
                  <p class="text-sm text-slate-600 dark:text-slate-300">History unlocks after launch.</p>
                </Tab>
              </groupnavigatesection--ml-navigate-pills>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Tabs</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupnavigatesection--ml-tabs</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Standard tabs for profile management panels.</p>
              <groupnavigatesection--ml-tabs
                name="card-3"
                value="${this.cardTabs}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardTabs = e.detail.value;
                }}
              >
                <Label>Account setup</Label>
                <Tab value="profile" title="Profile" icon="user">
                  <p class="text-sm text-slate-600 dark:text-slate-300">Edit identity, avatar, and bio.</p>
                </Tab>
                <Tab value="security" title="Security" icon="shield">
                  <p class="text-sm text-slate-600 dark:text-slate-300">Manage passwords and MFA.</p>
                </Tab>
                <Tab value="notifications" title="Alerts" icon="bell">
                  <p class="text-sm text-slate-600 dark:text-slate-300">Choose channels and frequency.</p>
                </Tab>
                <Tab value="billing" title="Billing" icon="credit-card" disabled>
                  <p class="text-sm text-slate-600 dark:text-slate-300">Billing connects after verification.</p>
                </Tab>
              </groupnavigatesection--ml-tabs>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Side nav scrollspy</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupnavigatesection--ml-side-nav-scrollspy</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Long-form documentation navigation with anchors.</p>
              <groupnavigatesection--ml-side-nav-scrollspy
                name="card-4"
                value="${this.cardSideNavScrollspy}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardSideNavScrollspy = e.detail.value;
                }}
              >
                <Label>Implementation guide</Label>
                <Tab value="summary" title="Summary" icon="book-open">
                  <p class="text-sm text-slate-600 dark:text-slate-300">Intro summary and timelines.</p>
                </Tab>
                <Tab value="integration" title="Integration" icon="plug">
                  <p class="text-sm text-slate-600 dark:text-slate-300">Embed scripts and SDK keys.</p>
                </Tab>
                <Tab value="analytics" title="Analytics" icon="activity">
                  <p class="text-sm text-slate-600 dark:text-slate-300">Event tracking and metrics.</p>
                </Tab>
                <Tab value="appendix" title="Appendix" icon="file" disabled>
                  <p class="text-sm text-slate-600 dark:text-slate-300">Appendix is draft-only.</p>
                </Tab>
              </groupnavigatesection--ml-side-nav-scrollspy>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-sky-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Navigate tabs</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupnavigatesection--ml-navigate-tabs</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Navigation-styled tabs for checkout steps.</p>
              <groupnavigatesection--ml-navigate-tabs
                name="card-5"
                value="${this.cardNavigateTabs}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardNavigateTabs = e.detail.value;
                }}
              >
                <Label>Checkout flow</Label>
                <Tab value="details" title="Details" icon="clipboard">
                  <p class="text-sm text-slate-600 dark:text-slate-300">Shipping details and address.</p>
                </Tab>
                <Tab value="delivery" title="Delivery" icon="truck">
                  <p class="text-sm text-slate-600 dark:text-slate-300">Choose delivery speed.</p>
                </Tab>
                <Tab value="payment" title="Payment" icon="credit-card">
                  <p class="text-sm text-slate-600 dark:text-slate-300">Add payment method and review.</p>
                </Tab>
                <Tab value="confirm" title="Confirm" icon="check" disabled>
                  <p class="text-sm text-slate-600 dark:text-slate-300">Confirm unlocks after payment.</p>
                </Tab>
              </groupnavigatesection--ml-navigate-tabs>
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
      breadcrumbTrail: boolean;
      navigatePills: boolean;
      tabs: boolean;
      sideNavScrollspy: boolean;
      navigateTabs: boolean;
    }> = [
      {
        scenario: 'Expose hierarchical sections with a breadcrumb feel at the top of a detail page.',
        breadcrumbTrail: true,
        navigatePills: false,
        tabs: false,
        sideNavScrollspy: false,
        navigateTabs: false,
      },
      {
        scenario: 'Quickly swap between 3–4 short, peer sections without leaving context.',
        breadcrumbTrail: false,
        navigatePills: true,
        tabs: true,
        sideNavScrollspy: false,
        navigateTabs: true,
      },
      {
        scenario: 'Long-form documentation needs section anchors and scroll awareness.',
        breadcrumbTrail: false,
        navigatePills: false,
        tabs: false,
        sideNavScrollspy: true,
        navigateTabs: false,
      },
      {
        scenario: 'Provide a classic tabbed interface with clear labels and icons.',
        breadcrumbTrail: false,
        navigatePills: false,
        tabs: true,
        sideNavScrollspy: false,
        navigateTabs: true,
      },
      {
        scenario: 'Step-by-step checkout or onboarding where the tabs read like navigation.',
        breadcrumbTrail: false,
        navigatePills: false,
        tabs: false,
        sideNavScrollspy: false,
        navigateTabs: true,
      },
    ];
    const headers = [
      { label: 'Breadcrumb trail', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Navigate pills', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Tabs', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Side nav scrollspy', cls: 'text-rose-600 dark:text-rose-400' },
      { label: 'Navigate tabs', cls: 'text-sky-600 dark:text-sky-400' },
    ];

    return html`
      <section
        class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700"
      >
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Choose the navigation style that best matches how users move between sections in the same context.
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
                ${rows.map((row, i) => {
                  const checks = [
                    row.breadcrumbTrail,
                    row.navigatePills,
                    row.tabs,
                    row.sideNavScrollspy,
                    row.navigateTabs,
                  ];
                  return html`
                    <tr
                      class="${
                        i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''
                      } border-b border-slate-100 dark:border-slate-700/60 last:border-0"
                    >
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                      ${checks.map(
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
                  `;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()} ${this.renderShowcaseCards()} ${this.renderReferenceTable()}
      </div>
    `;
  }
}
