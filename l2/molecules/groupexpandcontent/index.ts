/// <mls fileReference="_102040_/l2/molecules/groupexpandcontent/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupexpandcontent/ml-accordion';
import '/_102040_/l2/molecules/groupexpandcontent/ml-readmore-expand';
import '/_102040_/l2/molecules/groupexpandcontent/ml-single-expand-content';
import '/_102040_/l2/molecules/groupexpandcontent/ml-collapsible-panel';
import '/_102040_/l2/molecules/groupexpandcontent/ml-reveal-overlay';
import { molecules, scenarios } from '/_102040_/l2/molecules/groupexpandcontent/index.defs.js';
import { renderCatalogReferenceTable } from '/_102020_/l2/aura/molecules/shared/indexReferenceTable.js';

@customElement('molecules--groupexpandcontent--index-102040')
export class GroupExpandContentIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state()
  private cardAccordion = 'faq';

  @state()
  private cardReadmore = 'product-overview';

  @state()
  private cardSingle = 'order-details';

  @state()
  private cardPanel = 'billing-panel';

  @state()
  private cardOverlay = 'security-disclosure';

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
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Expand content
        </h1>
        <p
          class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Allows the user to expand or collapse content sections to see more or less details. Manages
          multiple sections via Section slot tags with title, disabled, and expanded attributes.
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">FAQ accordion</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupexpandcontent--ml-accordion</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Single-open accordion for frequently asked questions.
              </p>
              <groupexpandcontent--ml-accordion
                name="card-1"
                value="${this.cardAccordion}"
                .multiple=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardAccordion = e.detail.value;
                }}
              >
                <Label>Frequently asked questions</Label>
                <Section title="How do I reset my password?" expanded>
                  Go to Settings → Security → Reset Password and follow the prompts.
                </Section>
                <Section title="Can I change my plan?">
                  Yes. You can upgrade or downgrade anytime from the Billing page.
                </Section>
                <Section title="How do I contact support?">
                  Use the chat widget or email support@example.com.
                </Section>
              </groupexpandcontent--ml-accordion>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Read more teaser</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupexpandcontent--ml-readmore-expand</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Show a short preview with an optional longer explanation.
              </p>
              <groupexpandcontent--ml-readmore-expand
                name="card-2"
                value="${this.cardReadmore}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardReadmore = e.detail.value;
                }}
              >
                <Label>Product overview</Label>
                <Section title="Summary" expanded>
                  The new plan includes real-time insights, custom alerts, and export-ready reports.
                </Section>
                <Section title="Full details">
                  Dive deeper into analytics dashboards, workspace automation, and team permissions to
                  tailor the experience.
                </Section>
              </groupexpandcontent--ml-readmore-expand>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Single detail drawer</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupexpandcontent--ml-single-expand-content</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Emphasize one expandable section with optional disabled items.
              </p>
              <groupexpandcontent--ml-single-expand-content
                name="card-3"
                value="${this.cardSingle}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardSingle = e.detail.value;
                }}
              >
                <Label>Order details</Label>
                <Section title="Shipment timeline" expanded>
                  Your package ships within 24 hours and delivers in 3–5 business days.
                </Section>
                <Section title="Invoice breakdown">
                  Includes itemized taxes, discounts, and payment method.
                </Section>
                <Section title="Returns policy" disabled>
                  Returns are disabled for custom-made orders.
                </Section>
              </groupexpandcontent--ml-single-expand-content>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Collapsible panel</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupexpandcontent--ml-collapsible-panel</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Stack multiple configuration panels with editable sections.
              </p>
              <groupexpandcontent--ml-collapsible-panel
                name="card-4"
                value="${this.cardPanel}"
                .multiple=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardPanel = e.detail.value;
                }}
              >
                <Label>Billing settings</Label>
                <Section title="Payment method" expanded>
                  Visa ending in 4242 is the primary card for renewals.
                </Section>
                <Section title="Invoices">
                  Send invoices to finance@example.com and enable monthly summaries.
                </Section>
                <Section title="Tax info">
                  Provide VAT or GST details for international billing.
                </Section>
              </groupexpandcontent--ml-collapsible-panel>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-sky-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Reveal overlay</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupexpandcontent--ml-reveal-overlay</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Keep sensitive details hidden until the user expands them.
              </p>
              <groupexpandcontent--ml-reveal-overlay
                name="card-5"
                value="${this.cardOverlay}"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardOverlay = e.detail.value;
                }}
              >
                <Label>Security disclosure</Label>
                <Section title="Why we ask for verification" expanded>
                  Verification helps protect your account from unauthorized access.
                </Section>
                <Section title="What data we store">
                  We store only encrypted identifiers and login audit logs.
                </Section>
              </groupexpandcontent--ml-reveal-overlay>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  private renderReferenceTable(): TemplateResult {
    return renderCatalogReferenceTable(molecules, scenarios);
  }

  // ===========================================================================
  // RENDER
  protected render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }
}
