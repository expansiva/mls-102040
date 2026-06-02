/// <mls fileReference="_102040_/l2/molecules/groupexpandcontent/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupexpandcontent/ml-accordion';

@customElement('molecules--groupexpandcontent--index-102040')
export class GroupExpandContentIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardOne = false;
  @state() private cardTwo = true;

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
          groupExpandContent
        </span>
        <h1
          class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight"
        >
          Expand Content
        </h1>
        <p
          class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Allows the user to expand or collapse content sections to see more or less
          details, with implementations ranging from accordion to show more/show less.
          Supports single-open accordion mode or multiple open sections.
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">
                  FAQ Accordion (multiple open)
                </p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                >
                  groupexpandcontent--ml-accordion
                </code>
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Keep multiple answers open for quick scanning.
              </p>
              <groupexpandcontent--ml-accordion
                name="card-one"
                .value=${this.cardOne}
                .multiple=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardOne = e.detail.value;
                }}
              >
                <Label>Frequently Asked Questions</Label>
                <Section title="How do I reset my password?" expanded>
                  Go to Settings → Security → Reset Password and follow the steps.
                </Section>
                <Section title="Can I change my plan?">
                  Yes, you can upgrade or downgrade at any time from the Billing page.
                </Section>
                <Section title="Is phone support available?" disabled>
                  Phone support is available for Enterprise subscriptions only.
                </Section>
              </groupexpandcontent--ml-accordion>
            </div>
          </div>

          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">
                  Account Details (single open)
                </p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                >
                  groupexpandcontent--ml-accordion
                </code>
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Keep focus on one section at a time in accordion mode.
              </p>
              <groupexpandcontent--ml-accordion
                name="card-two"
                .value=${this.cardTwo}
                .multiple=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardTwo = e.detail.value;
                }}
              >
                <Label>Account settings</Label>
                <Section title="Profile" expanded>
                  Update your avatar, display name, and timezone preferences.
                </Section>
                <Section title="Security">
                  Manage two-factor authentication and active sessions.
                </Section>
                <Section title="Notifications">
                  Choose which alerts you receive by email or push.
                </Section>
              </groupexpandcontent--ml-accordion>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{ scenario: string; accordion: boolean }> = [
      {
        scenario: 'Users need to compare multiple answers or details at once.',
        accordion: true,
      },
      {
        scenario: 'Only one section should stay open to reduce cognitive load.',
        accordion: true,
      },
      {
        scenario: 'You want a consistent expandable container with section slots.',
        accordion: true,
      },
    ];
    const headers = [
      { label: 'Accordion', cls: 'text-violet-600 dark:text-violet-400' },
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
            Use this to decide when an accordion-style expand/collapse pattern best
            fits the need for structured, multi-section content.
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
                    `,
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
                      ${([row.accordion] as boolean[]).map(
                        (ok) => html`
                          <td class="px-4 py-3.5 text-center">
                            ${ok
                              ? html`<span
                                  class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
                                  >✓</span
                                >`
                              : html`<span
                                  class="text-slate-200 dark:text-slate-700 text-sm"
                                  >—</span
                                >`}
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

  render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()}${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }
}
