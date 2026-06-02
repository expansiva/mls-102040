/// <mls fileReference="_102040_/l2/molecules/groupnavigatesection/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupnavigatesection/ml-tabs';

@customElement('molecules--groupnavigatesection--index-102040')
export class GroupGroupnavigatesectionIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardTabsPrimary = 'overview';
  @state() private cardTabsSecondary = 'billing';

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
          Navigate Section
        </h1>
        <p
          class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Allows the user to switch between sections within the same context. Sections defined via Tab slot tags with
          value, title, icon, and disabled attributes. Value is the active tab identifier. Page is responsible for
          displaying each section content. Implementations include tabs, pills/segmented control, navigation menu,
          bottom navigation, and pagination.
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Product detail tabs</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupnavigatesection--ml-tabs</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Switch between content-heavy sections inside a single product page.
              </p>
              <groupnavigatesection--ml-tabs
                name="card-1"
                value="${this.cardTabsPrimary}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardTabsPrimary = e.detail.value;
                }}
              >
                <Label>Product</Label>
                <Tab value="overview" title="Overview" icon="dashboard">
                  <div class="space-y-2">
                    <p class="text-sm text-slate-600 dark:text-slate-300">
                      Full product description with highlights and hero visuals.
                    </p>
                    <ul class="text-xs text-slate-500 dark:text-slate-400 list-disc pl-4">
                      <li>Key benefits and positioning</li>
                      <li>Primary imagery and story</li>
                    </ul>
                  </div>
                </Tab>
                <Tab value="specs" title="Specifications" icon="list">
                  <div class="space-y-2">
                    <p class="text-sm text-slate-600 dark:text-slate-300">Technical specs and fit details.</p>
                    <div class="text-xs text-slate-500 dark:text-slate-400">Material: 80% cotton / 20% linen</div>
                  </div>
                </Tab>
                <Tab value="reviews" title="Reviews" icon="star">
                  <div class="space-y-2">
                    <p class="text-sm text-slate-600 dark:text-slate-300">Customer feedback and ratings.</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">4.7 average rating · 128 reviews</p>
                  </div>
                </Tab>
                <Tab value="support" title="Support" icon="help" disabled>
                  <p class="text-sm text-slate-400">Support is currently unavailable.</p>
                </Tab>
              </groupnavigatesection--ml-tabs>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Account settings</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupnavigatesection--ml-tabs</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Segment settings within a profile management flow.</p>
              <groupnavigatesection--ml-tabs
                name="card-2"
                value="${this.cardTabsSecondary}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardTabsSecondary = e.detail.value;
                }}
              >
                <Label>Account settings</Label>
                <Tab value="profile" title="Profile" icon="user">
                  <div class="space-y-2">
                    <p class="text-sm text-slate-600 dark:text-slate-300">Update name, avatar, and bio.</p>
                    <button class="text-xs text-sky-600 dark:text-sky-400 font-semibold">Edit profile</button>
                  </div>
                </Tab>
                <Tab value="billing" title="Billing" icon="credit-card">
                  <div class="space-y-2">
                    <p class="text-sm text-slate-600 dark:text-slate-300">Manage payment methods and invoices.</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Visa •••• 4821</p>
                  </div>
                </Tab>
                <Tab value="security" title="Security" icon="shield">
                  <div class="space-y-2">
                    <p class="text-sm text-slate-600 dark:text-slate-300">Password, MFA, and device access.</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Last password change: 3 days ago</p>
                  </div>
                </Tab>
                <Tab value="integrations" title="Integrations" icon="plug" disabled>
                  <p class="text-sm text-slate-400">Integrations require an upgraded plan.</p>
                </Tab>
              </groupnavigatesection--ml-tabs>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{ scenario: string; tabs: boolean }> = [
      { scenario: 'You need icon-supported tabs with rich content panels.', tabs: true },
      { scenario: 'Navigation is the only element needed; content lives elsewhere.', tabs: true },
      { scenario: 'You want a single active section with disabled options.', tabs: true },
    ];
    const headers = [{ label: 'Tabs', cls: 'text-violet-600 dark:text-violet-400' }];

    return html`
      <section
        class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700"
      >
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Allows the user to switch between sections within the same context. Sections defined via Tab slot tags with
            value, title, icon, and disabled attributes. Value is the active tab identifier. Page is responsible for
            displaying each section content. Implementations include tabs, pills/segmented control, navigation menu,
            bottom navigation, and pagination.
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
                    `
                  )}
                </tr>
              </thead>
              <tbody>
                ${rows.map(
                  (row, i) => html`
                    <tr
                      class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0"
                    >
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                      ${([row.tabs] as boolean[]).map(
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
  // RENDER
  protected render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()} ${this.renderShowcaseCards()} ${this.renderReferenceTable()}
      </div>
    `;
  }
}
