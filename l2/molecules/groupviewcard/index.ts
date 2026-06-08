/// <mls fileReference="_102040_/l2/molecules/groupviewcard/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupviewcard/ml-view-card-horizontal';
import '/_102040_/l2/molecules/groupviewcard/ml-vertical-card';
import '/_102040_/l2/molecules/groupviewcard/ml-view-card-media';

@customElement('molecules--groupviewcard--index-102040')
export class GroupViewCardIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardOne = false;
  @state() private cardTwo = true;
  @state() private cardThree = false;

  // ===========================================================================
  // HERO
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span
          class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
        >
          groupViewCard
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          View Cards
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Displays an item as an independent visual unit with flexible header, content, footer, and action slots. Choose from
          horizontal, vertical, or media-first implementations to match the content emphasis.
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Horizontal product card</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupviewcard--ml-view-card-horizontal</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Use when you need a landscape layout with quick scan details and a primary action.
              </p>
              <groupviewcard--ml-view-card-horizontal
                name="card-1"
                .value=${this.cardOne}
                .isEditing=${true}
                .clickable=${true}
                @change=${(e: CustomEvent) => {
                  this.cardOne = e.detail.value;
                }}
              >
                <CardHeader>
                  <CardTitle>Acoustic Studio Bundle</CardTitle>
                  <CardDescription>Starter kit with interface + monitors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div class="flex items-center gap-4">
                    <div class="h-16 w-24 rounded-lg bg-slate-100 dark:bg-slate-700"></div>
                    <div>
                      <p class="text-sm text-slate-600 dark:text-slate-300">Ships in 2 days · 4.8 ★ rating</p>
                      <p class="text-xs text-slate-400">Includes cables and quickstart guide</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-semibold text-slate-900 dark:text-slate-50">$749</span>
                    <span class="text-xs text-slate-400">Limited stock</span>
                  </div>
                </CardFooter>
                <CardAction>
                  <button class="px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900">
                    View details
                  </button>
                </CardAction>
              </groupviewcard--ml-view-card-horizontal>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Vertical feature card</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupviewcard--ml-vertical-card</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Great for stacked lists where imagery and content flow top to bottom.</p>
              <groupviewcard--ml-vertical-card
                name="card-2"
                .value=${this.cardTwo}
                .isEditing=${true}
                .selected=${true}
                @change=${(e: CustomEvent) => {
                  this.cardTwo = e.detail.value;
                }}
              >
                <CardHeader>
                  <CardTitle>Weekly Digest</CardTitle>
                  <CardDescription>5 key metrics ready for review</CardDescription>
                </CardHeader>
                <CardContent>
                  <div class="rounded-xl bg-slate-100 dark:bg-slate-700 p-4">
                    <p class="text-xs uppercase text-slate-400">Highlights</p>
                    <p class="text-sm text-slate-700 dark:text-slate-200">+12% revenue, 8 new accounts, 2 renewals due</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <p class="text-xs text-slate-400">Updated 2 hours ago</p>
                </CardFooter>
                <CardAction>
                  <button class="px-3 py-1.5 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-600">
                    Open report
                  </button>
                </CardAction>
              </groupviewcard--ml-vertical-card>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Media spotlight card</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupviewcard--ml-view-card-media</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Use when a hero image or video needs to lead the story.</p>
              <groupviewcard--ml-view-card-media
                name="card-3"
                .value=${this.cardThree}
                .isEditing=${true}
                .clickable=${true}
                .loading=${false}
                @change=${(e: CustomEvent) => {
                  this.cardThree = e.detail.value;
                }}
              >
                <CardHeader>
                  <CardTitle>Autumn trail guide</CardTitle>
                  <CardDescription>Explore 12 curated hikes with map previews</CardDescription>
                </CardHeader>
                <CardContent>
                  <div class="h-32 rounded-xl bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 dark:from-amber-900/40 dark:via-orange-900/40 dark:to-rose-900/40"></div>
                  <p class="text-sm text-slate-600 dark:text-slate-300 mt-3">Downloadable GPX files and weather tips included.</p>
                </CardContent>
                <CardFooter>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-slate-400">Updated yesterday</span>
                    <span class="text-xs font-semibold text-amber-600 dark:text-amber-400">Premium</span>
                  </div>
                </CardFooter>
                <CardAction>
                  <button class="px-3 py-1.5 text-xs font-semibold rounded-full bg-amber-500 text-white">
                    Start planning
                  </button>
                </CardAction>
              </groupviewcard--ml-view-card-media>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{ scenario: string; viewCardHorizontal: boolean; verticalCard: boolean; viewCardMedia: boolean }> = [
      {
        scenario: 'Need a landscape layout that keeps details and metadata aligned in one row.',
        viewCardHorizontal: true,
        verticalCard: false,
        viewCardMedia: false,
      },
      {
        scenario: 'Stacked layout for lists or dashboards where content flows top to bottom.',
        viewCardHorizontal: false,
        verticalCard: true,
        viewCardMedia: false,
      },
      {
        scenario: 'Media-first presentation where the image or preview is the main emphasis.',
        viewCardHorizontal: false,
        verticalCard: false,
        viewCardMedia: true,
      },
      {
        scenario: 'Clickable overview card with balanced content and a secondary action area.',
        viewCardHorizontal: true,
        verticalCard: true,
        viewCardMedia: false,
      },
    ];
    const headers = [
      { label: 'Horizontal card', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Vertical card', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Media card', cls: 'text-amber-600 dark:text-amber-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Displays an item as an independent visual unit — use this table to match card orientation and media emphasis to
            the content you are presenting.
          </p>
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <th class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-3/4">
                    Scenario
                  </th>
                  ${headers.map(
                    (h) => html`
                      <th class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}">${h.label}</th>
                    `
                  )}
                </tr>
              </thead>
              <tbody>
                ${rows.map(
                  (row, i) => html`
                    <tr
                      class="${
                        i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''
                      } border-b border-slate-100 dark:border-slate-700/60 last:border-0"
                    >
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                      ${([row.viewCardHorizontal, row.verticalCard, row.viewCardMedia] as boolean[]).map(
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

  render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()} ${this.renderShowcaseCards()} ${this.renderReferenceTable()}
      </div>
    `;
  }
}
