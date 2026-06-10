/// <mls fileReference="_102040_/l2/molecules/groupnotifyuser/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupnotifyuser/ml-notify-banner';
import '/_102040_/l2/molecules/groupnotifyuser/ml-toast-notification';
import '/_102040_/l2/molecules/groupnotifyuser/ml-alert-modal';
import '/_102040_/l2/molecules/groupnotifyuser/ml-contextual-feedback';

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
    const rows: Array<{
      scenario: string;
      notifyBanner: boolean;
      toastNotification: boolean;
      alertModal: boolean;
      contextualFeedback: boolean;
    }> = [
      {
        scenario: 'Persistent update at the top of the page with a clear action.',
        notifyBanner: true,
        toastNotification: false,
        alertModal: false,
        contextualFeedback: false,
      },
      {
        scenario: 'Quick success confirmation that should disappear automatically.',
        notifyBanner: false,
        toastNotification: true,
        alertModal: false,
        contextualFeedback: false,
      },
      {
        scenario: 'Critical failure that must be acknowledged before continuing.',
        notifyBanner: false,
        toastNotification: false,
        alertModal: true,
        contextualFeedback: false,
      },
      {
        scenario: 'Inline guidance tied to a specific form field or action.',
        notifyBanner: false,
        toastNotification: false,
        alertModal: false,
        contextualFeedback: true,
      },
    ];
    const headers = [
      { label: 'Banner', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Toast', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Alert Modal', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Contextual', cls: 'text-rose-600 dark:text-rose-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this matrix to pick the notification surface that matches urgency, visibility, and placement needs.
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
                      ${([
                        row.notifyBanner,
                        row.toastNotification,
                        row.alertModal,
                        row.contextualFeedback,
                      ] as boolean[]).map(
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
