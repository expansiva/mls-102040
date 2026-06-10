/// <mls fileReference="_102040_/l2/molecules/groupnavigatesteps/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupnavigatesteps/ml-horizontal-stepper';
import '/_102040_/l2/molecules/groupnavigatesteps/ml-vertical-stepper';
import '/_102040_/l2/molecules/groupnavigatesteps/ml-wizard-steps';
import '/_102040_/l2/molecules/groupnavigatesteps/ml-compact-step-indicator';

@customElement('molecules--groupnavigatesteps--index-102040')
export class GroupNavigateStepsIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardHorizontal = 1;
  @state() private cardVertical = 2;
  @state() private cardWizard = 0;
  @state() private cardCompact = 3;

  // ===========================================================================
  // SECTION: Hero
  // ===========================================================================
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupNavigateSteps
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Navigate Steps
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to advance through a sequential multi-step process. Steps defined via Step slot tags with title, description, completed, and disabled attributes. Value is the active step index. Supports linear mode (must complete in order) and free navigation. Implementations include horizontal stepper, vertical stepper, wizard, progress steps.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SECTION: Showcase Cards
  // ===========================================================================
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Horizontal stepper</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupnavigatesteps--ml-horizontal-stepper</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Classic top navigation for checkout and onboarding flows.</p>
              <groupnavigatesteps--ml-horizontal-stepper
                name="card-horizontal"
                .value=${this.cardHorizontal}
                .linear=${true}
                .loading=${false}
                .disabled=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardHorizontal = e.detail.value;
                }}
              >
                <Label>Checkout</Label>
                <Step title="Cart" description="Review items" completed></Step>
                <Step title="Shipping" description="Choose delivery" completed></Step>
                <Step title="Payment" description="Enter details"></Step>
                <Step title="Confirmation" description="Receipt & summary"></Step>
              </groupnavigatesteps--ml-horizontal-stepper>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Vertical stepper</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupnavigatesteps--ml-vertical-stepper</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Detailed progress with room for descriptions and optional jumps.</p>
              <groupnavigatesteps--ml-vertical-stepper
                name="card-vertical"
                .value=${this.cardVertical}
                .linear=${false}
                .loading=${false}
                .disabled=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardVertical = e.detail.value;
                }}
              >
                <Label>Launch checklist</Label>
                <Step title="Branding" description="Logo, colors, fonts" completed></Step>
                <Step title="Content" description="Copy and assets" completed></Step>
                <Step title="QA" description="Run test suite"></Step>
                <Step title="Go live" description="Publish to production" disabled></Step>
              </groupnavigatesteps--ml-vertical-stepper>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Wizard steps</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupnavigatesteps--ml-wizard-steps</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Guided wizard for collecting data step-by-step.</p>
              <groupnavigatesteps--ml-wizard-steps
                name="card-wizard"
                .value=${this.cardWizard}
                .linear=${true}
                .loading=${true}
                .disabled=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardWizard = e.detail.value;
                }}
              >
                <Label>Onboarding</Label>
                <Step title="Profile" description="Add personal details" completed></Step>
                <Step title="Team" description="Invite collaborators"></Step>
                <Step title="Workspace" description="Configure settings"></Step>
                <Step title="Finish" description="Review and submit"></Step>
              </groupnavigatesteps--ml-wizard-steps>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Compact step indicator</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupnavigatesteps--ml-compact-step-indicator</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Lightweight progress indicator for space-constrained layouts.</p>
              <groupnavigatesteps--ml-compact-step-indicator
                name="card-compact"
                .value=${this.cardCompact}
                .linear=${true}
                .loading=${false}
                .disabled=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardCompact = e.detail.value;
                }}
              >
                <Label>Release pipeline</Label>
                <Step title="Build" description="Compile assets" completed></Step>
                <Step title="Test" description="Run suites" completed></Step>
                <Step title="Deploy" description="Ship to prod" completed></Step>
                <Step title="Monitor" description="Track metrics"></Step>
              </groupnavigatesteps--ml-compact-step-indicator>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // SECTION: Reference Table
  // ===========================================================================
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{
      scenario: string;
      horizontal: boolean;
      vertical: boolean;
      wizard: boolean;
      compact: boolean;
    }> = [
      {
        scenario: 'Need a classic, single-row progress tracker for checkout or onboarding.',
        horizontal: true,
        vertical: false,
        wizard: false,
        compact: false,
      },
      {
        scenario: 'Want rich descriptions per step with more vertical space.',
        horizontal: false,
        vertical: true,
        wizard: false,
        compact: false,
      },
      {
        scenario: 'Building a guided wizard flow with step-by-step emphasis.',
        horizontal: false,
        vertical: false,
        wizard: true,
        compact: false,
      },
      {
        scenario: 'Space is tight but you still need progress visibility.',
        horizontal: false,
        vertical: false,
        wizard: false,
        compact: true,
      },
    ];
    const headers = [
      { label: 'Horizontal', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Vertical', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Wizard', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Compact', cls: 'text-rose-600 dark:text-rose-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Allows the user to advance through a sequential multi-step process. Steps defined via Step slot tags with title, description, completed, and disabled attributes. Value is the active step index. Supports linear mode (must complete in order) and free navigation. Implementations include horizontal stepper, vertical stepper, wizard, progress steps.
          </p>
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <th class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-3/4">Scenario</th>
                  ${headers.map(
                    (h) => html`
                      <th class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}">${h.label}</th>
                    `,
                  )}
                </tr>
              </thead>
              <tbody>
                ${rows.map(
                  (row, i) => html`
                    <tr class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0">
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                      ${([row.horizontal, row.vertical, row.wizard, row.compact] as boolean[]).map(
                        (ok) => html`
                          <td class="px-4 py-3.5 text-center">
                            ${ok
                              ? html`<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>`
                              : html`<span class="text-slate-200 dark:text-slate-700 text-sm">—</span>`}
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

  // ===========================================================================
  // SECTION: Render
  // ===========================================================================
  protected override render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }
}
