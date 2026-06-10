/// <mls fileReference="_102040_/l2/molecules/groupviewcard/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupviewcard/ml-vertical-card';
import '/_102040_/l2/molecules/groupviewcard/ml-view-card-horizontal';
import '/_102040_/l2/molecules/groupviewcard/ml-view-card-media';
import '/_102040_/l2/molecules/groupviewcard/ml-profile-card';

@customElement('molecules--groupviewcard--index-102040')
export class GroupViewCardIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardVertical = 'default';
  @state() private cardHorizontal = 'default';
  @state() private cardMedia = 'default';
  @state() private cardProfile = 'default';

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
          groupViewCard
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          View Cards
        </h1>
        <p
          class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Displays an item as an independent visual unit. Choose from standard, media, horizontal,
          or profile-focused layouts with optional interactive, selectable, and loading states.
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Vertical card</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupviewcard--ml-vertical-card</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Classic stacked layout for product or content tiles.</p>
              <groupviewcard--ml-vertical-card
                name="card-1"
                value="${this.cardVertical}"
                .clickable=${true}
                .selected=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardVertical = e.detail.value;
                }}
              >
                <CardHeader>
                  <CardTitle>Studio Headphones</CardTitle>
                  <CardDescription>Noise cancelling · 30h battery</CardDescription>
                </CardHeader>
                <CardContent>
                  <div class="h-32 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-400">
                    Product image
                  </div>
                </CardContent>
                <CardFooter>$299 · Ships tomorrow</CardFooter>
                <CardAction>
                  <button class="text-xs font-semibold text-sky-600 dark:text-sky-300">View details</button>
                </CardAction>
              </groupviewcard--ml-vertical-card>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Horizontal card</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupviewcard--ml-view-card-horizontal</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Wide layout for list views with quick actions.</p>
              <groupviewcard--ml-view-card-horizontal
                name="card-2"
                value="${this.cardHorizontal}"
                .clickable=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardHorizontal = e.detail.value;
                }}
              >
                <CardHeader>
                  <CardTitle>Design review</CardTitle>
                  <CardDescription>Scheduled · Tue, 2:00 PM</CardDescription>
                </CardHeader>
                <CardContent>
                  <div class="text-sm text-slate-600 dark:text-slate-300">
                    Agenda: landing page updates, new icon set, and spacing tokens.
                  </div>
                </CardContent>
                <CardFooter>3 attendees · Room 4B</CardFooter>
                <CardAction>
                  <button class="text-xs font-semibold text-emerald-600 dark:text-emerald-300">Join call</button>
                </CardAction>
              </groupviewcard--ml-view-card-horizontal>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Media card</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupviewcard--ml-view-card-media</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Image-forward card for galleries and promos.</p>
              <groupviewcard--ml-view-card-media
                name="card-3"
                value="${this.cardMedia}"
                .loading=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardMedia = e.detail.value;
                }}
              >
                <CardHeader>
                  <CardTitle>Alpine escape</CardTitle>
                  <CardDescription>Travel story · 6 min read</CardDescription>
                </CardHeader>
                <CardContent>
                  <div class="h-36 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-400">
                    Cover image
                  </div>
                </CardContent>
                <CardFooter>Updated 2 hours ago</CardFooter>
                <CardAction>
                  <button class="text-xs font-semibold text-amber-600 dark:text-amber-300">Read now</button>
                </CardAction>
              </groupviewcard--ml-view-card-media>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Profile card</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupviewcard--ml-profile-card</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">People-focused layout with status and actions.</p>
              <groupviewcard--ml-profile-card
                name="card-4"
                value="${this.cardProfile}"
                .disabled=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardProfile = e.detail.value;
                }}
              >
                <CardHeader>
                  <CardTitle>Maya Lopez</CardTitle>
                  <CardDescription>Customer success · Online</CardDescription>
                </CardHeader>
                <CardContent>
                  <div class="text-sm text-slate-600 dark:text-slate-300">
                    Handling 12 active accounts and onboarding 3 new teams.
                  </div>
                </CardContent>
                <CardFooter>Last active 5 min ago</CardFooter>
                <CardAction>
                  <button class="text-xs font-semibold text-rose-600 dark:text-rose-300">Message</button>
                </CardAction>
              </groupviewcard--ml-profile-card>
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
      mlVerticalCard: boolean;
      mlViewCardHorizontal: boolean;
      mlViewCardMedia: boolean;
      mlProfileCard: boolean;
    }> = [
      {
        scenario: 'Grid-based product or content tiles with prominent imagery.',
        mlVerticalCard: true,
        mlViewCardHorizontal: false,
        mlViewCardMedia: true,
        mlProfileCard: false,
      },
      {
        scenario: 'Dense list views that need metadata plus a primary action.',
        mlVerticalCard: false,
        mlViewCardHorizontal: true,
        mlViewCardMedia: false,
        mlProfileCard: false,
      },
      {
        scenario: 'Profile or people cards with status, role, and quick actions.',
        mlVerticalCard: false,
        mlViewCardHorizontal: false,
        mlViewCardMedia: false,
        mlProfileCard: true,
      },
      {
        scenario: 'Editorial or marketing highlights anchored by a hero visual.',
        mlVerticalCard: false,
        mlViewCardHorizontal: false,
        mlViewCardMedia: true,
        mlProfileCard: false,
      },
    ];
    const headers = [
      { label: 'Vertical card', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Horizontal card', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Media card', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Profile card', cls: 'text-rose-600 dark:text-rose-400' },
    ];

    return html`
      <section
        class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700"
      >
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use the comparison below to map the right card layout to your content, imagery, and
            interaction needs.
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
                      class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0"
                    >
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                      ${([
                        row.mlVerticalCard,
                        row.mlViewCardHorizontal,
                        row.mlViewCardMedia,
                        row.mlProfileCard,
                      ] as boolean[]).map(
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
