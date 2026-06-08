/// <mls fileReference="_102040_/l2/molecules/groupexpandcontent/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupexpandcontent/ml-accordion';
import '/_102040_/l2/molecules/groupexpandcontent/ml-readmore-expand';
import '/_102040_/l2/molecules/groupexpandcontent/ml-single-expand-content';

@customElement('molecules--groupexpandcontent--index-102040')
export class GroupExpandContentIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardAccordionMulti = 'faqs';
  @state() private cardAccordionSingle = 'plan-details';
  @state() private cardReadmore = 'read-more';
  @state() private cardSingleExpand = 'order-row';

  // ===========================================================================
  // HERO SECTION
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupExpandContent
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Expand Content
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to expand or collapse content sections to see more or less details. Manages multiple sections via Section slot tags with title, disabled, and expanded attributes.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SHOWCASE CARDS SECTION
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Accordion (multi-open)</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupexpandcontent--ml-accordion</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Great for FAQs where users might compare answers.</p>
              <groupexpandcontent--ml-accordion
                name="card-1"
                value="${this.cardAccordionMulti}"
                .multiple=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardAccordionMulti = e.detail.value;
                }}
              >
                <Label>Frequently asked questions</Label>
                <Section title="How do I reset my password?" expanded>
                  Go to Settings → Security → Reset Password and follow the prompts.
                </Section>
                <Section title="Can I change my plan?">
                  Yes, you can upgrade or downgrade at any time from the Billing page.
                </Section>
                <Section title="How do I contact support?">
                  Use the chat widget in the app or email support@example.com.
                </Section>
              </groupexpandcontent--ml-accordion>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Accordion (single-open)</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupexpandcontent--ml-accordion</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Use for step-by-step policies where only one panel should stay open.</p>
              <groupexpandcontent--ml-accordion
                name="card-2"
                value="${this.cardAccordionSingle}"
                .multiple=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardAccordionSingle = e.detail.value;
                }}
              >
                <Label>Plan details</Label>
                <Section title="Included in Starter" expanded>
                  Basic analytics, 3 team members, and 1 integration.
                </Section>
                <Section title="Included in Growth">
                  Advanced analytics, 10 team members, and priority support.
                </Section>
                <Section title="Included in Enterprise" disabled>
                  Custom security reviews, SSO, and dedicated account manager.
                </Section>
              </groupexpandcontent--ml-accordion>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Read more / show less</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupexpandcontent--ml-readmore-expand</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Inline expansion for long copy blocks or policy previews.</p>
              <groupexpandcontent--ml-readmore-expand
                name="card-3"
                value="${this.cardReadmore}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardReadmore = e.detail.value;
                }}
              >
                <Label>Product overview</Label>
                <Section title="Show more">
                  The full overview includes adoption timelines, onboarding support, and implementation milestones tailored to your team’s workflow.
                </Section>
              </groupexpandcontent--ml-readmore-expand>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Expandable row</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupexpandcontent--ml-single-expand-content</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Perfect for a single row or card that reveals more detail.</p>
              <groupexpandcontent--ml-single-expand-content
                name="card-4"
                value="${this.cardSingleExpand}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardSingleExpand = e.detail.value;
                }}
              >
                <Label>Order #4921</Label>
                <Section title="View order details" expanded>
                  Items: 3 • Status: In transit • Estimated delivery: Jun 18, 2026.
                </Section>
              </groupexpandcontent--ml-single-expand-content>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE SECTION
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{ scenario: string; accordion: boolean; readmoreExpand: boolean; singleExpandContent: boolean }> = [
      { scenario: 'Multiple FAQs where users might compare answers', accordion: true, readmoreExpand: false, singleExpandContent: false },
      { scenario: 'Long text that should expand inline within a paragraph or card', accordion: false, readmoreExpand: true, singleExpandContent: false },
      { scenario: 'A single row or card that reveals details on demand', accordion: false, readmoreExpand: false, singleExpandContent: true },
      { scenario: 'Accordion-style navigation with only one section open at a time', accordion: true, readmoreExpand: false, singleExpandContent: false },
    ];
    const headers = [
      { label: 'Accordion', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Readmore Expand', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Single Expand Content', cls: 'text-rose-600 dark:text-rose-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use these options when the user needs to expand or collapse content sections to see more or less details, with choices for accordion, inline read-more, or single-row expansion.
          </p>
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <th class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-3/4">Scenario</th>
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
                    <tr class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0">
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                      ${([row.accordion, row.readmoreExpand, row.singleExpandContent] as boolean[]).map(
                        (ok) => html`
                          <td class="px-4 py-3.5 text-center">
                            ${ok
                              ? html`<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>`
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
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }
}
