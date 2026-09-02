/// <mls fileReference="_102040_/l2/molecules/groupnotifyuser/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupnotifyuser/ml-notify-banner';
import '/_102040_/l2/molecules/groupnotifyuser/ml-toast-notification';
import '/_102040_/l2/molecules/groupnotifyuser/ml-alert-modal';
import '/_102040_/l2/molecules/groupnotifyuser/ml-contextual-feedback';
import { molecules, scenarios } from '/_102040_/l2/molecules/groupnotifyuser/index.defs.js';
import { renderCatalogReferenceTable } from '/_102020_/l2/aura/molecules/shared/indexReferenceTable.js';

@customElement('molecules--groupnotifyuser--index-102040')
export class GroupNotifyUserIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardBanner = true;
  @state() private cardToast = true;
  @state() private cardAlertModal = true;
  @state() private cardContextual = true;

  // ===========================================================================
  // HERO
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupNotifyUser
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Notify User
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Informs the user about events, status changes, or action results. Controlled via visible property with implementations for toast, snackbar, banner, alert, and inline alert experiences.
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Notify Banner</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupnotifyuser--ml-notify-banner</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Persistent, page-level updates with optional action.</p>
              <groupnotifyuser--ml-notify-banner
                name="card-banner"
                type="warning"
                position="top"
                .dismissible=${true}
                .visible=${this.cardBanner}
                .value=${this.cardBanner}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardBanner = e.detail.value;
                }}
              >
                <Icon>⚠️</Icon>
                <Title>System Update Available</Title>
                <Message>A new version is ready with faster dashboards.</Message>
                <Action>
                  <button class="text-sky-600 font-semibold">Update Now</button>
                </Action>
              </groupnotifyuser--ml-notify-banner>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Toast Notification</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupnotifyuser--ml-toast-notification</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Lightweight confirmation that fades out automatically.</p>
              <groupnotifyuser--ml-toast-notification
                name="card-toast"
                type="success"
                position="top-right"
                .duration=${3200}
                .dismissible=${true}
                .visible=${this.cardToast}
                .value=${this.cardToast}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardToast = e.detail.value;
                }}
              >
                <Icon>✅</Icon>
                <Title>Report Exported</Title>
                <Message>Your CSV file is ready to download.</Message>
                <Action>
                  <button class="text-emerald-600 font-semibold">Download</button>
                </Action>
              </groupnotifyuser--ml-toast-notification>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Alert Modal</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupnotifyuser--ml-alert-modal</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">High-visibility alert that demands acknowledgment.</p>
              <groupnotifyuser--ml-alert-modal
                name="card-alert"
                type="error"
                position="center"
                .dismissible=${true}
                .visible=${this.cardAlertModal}
                .value=${this.cardAlertModal}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardAlertModal = e.detail.value;
                }}
              >
                <Icon>🚨</Icon>
                <Title>Payment Failed</Title>
                <Message>We could not process your card. Please update billing.</Message>
                <Action>
                  <button class="text-rose-600 font-semibold">Update Card</button>
                </Action>
              </groupnotifyuser--ml-alert-modal>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Contextual Feedback</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupnotifyuser--ml-contextual-feedback</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Inline guidance near the affected form or action.</p>
              <groupnotifyuser--ml-contextual-feedback
                name="card-contextual"
                type="info"
                position="bottom"
                .dismissible=${false}
                .visible=${this.cardContextual}
                .value=${this.cardContextual}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardContextual = e.detail.value;
                }}
              >
                <Icon>💡</Icon>
                <Title>Tip</Title>
                <Message>Adding tags improves search results.</Message>
                <Action>
                  <button class="text-sky-600 font-semibold">Add Tags</button>
                </Action>
              </groupnotifyuser--ml-contextual-feedback>
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
