/// <mls fileReference="_102040_/l2/molecules/groupentertimeinterval/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupentertimeinterval/ml-time-interval-selector';
import '/_102040_/l2/molecules/groupentertimeinterval/ml-time-interval-slider';

@customElement('molecules--groupentertimeinterval--index-102040')
export class GroupEnterTimeIntervalIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private card1 = { startTime: '09:00', endTime: '17:00' };
  @state() private card2 = { startTime: '18:30', endTime: '02:00' };

  // ===========================================================================
  // RENDER
  // ===========================================================================
  public render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }

  // ===========================================================================
  // HERO
  // ===========================================================================
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupEnterTimeInterval
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Enter Time Interval
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Capture time ranges with a start and end time—perfect for shifts, business hours, classes, or recurring availability windows. Choose between a classic time range picker, a dual-handle slider, or a structured hours grid for faster configuration.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SHOWCASE CARDS
  // ===========================================================================
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Time interval selector</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupentertimeinterval--ml-time-interval-selector</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Standard picker for scheduling consistent shift windows.</p>
              <groupentertimeinterval--ml-time-interval-selector
                name="card-1"
                .value=${this.card1}
                locale="en-US"
                .hour12=${true}
                .minuteStep=${15}
                .minDurationMinutes=${60}
                .allowOvernight=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card1 = e.detail.value;
                }}
              >
                <Label>Work shift</Label>
                <LabelStart>Starts</LabelStart>
                <LabelEnd>Ends</LabelEnd>
                <Helper>Minimum 1 hour, in 15-minute increments.</Helper>
              </groupentertimeinterval--ml-time-interval-selector>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Time interval slider</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupentertimeinterval--ml-time-interval-slider</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Visual slider that supports overnight business hours.</p>
              <groupentertimeinterval--ml-time-interval-slider
                name="card-2"
                .value=${this.card2}
                locale="en-GB"
                .hour12=${false}
                .minuteStep=${30}
                .allowOvernight=${true}
                .maxDurationMinutes=${720}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card2 = e.detail.value;
                }}
              >
                <Label>Overnight availability</Label>
                <LabelStart>Opens</LabelStart>
                <LabelEnd>Closes</LabelEnd>
                <Helper>Close time may be after midnight, up to 12 hours.</Helper>
              </groupentertimeinterval--ml-time-interval-slider>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  // ===========================================================================
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{ scenario: string; selector: boolean; slider: boolean }> = [
      { scenario: 'Pick exact start/end times with localized inputs.', selector: true, slider: false },
      { scenario: 'Communicate availability visually across a timeline.', selector: false, slider: true },
      { scenario: 'Allow overnight ranges that span multiple days.', selector: true, slider: true },
      { scenario: 'Collect fast input on mobile with minimal taps.', selector: true, slider: false },
    ];
    const headers = [
      { label: 'Selector', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Slider', cls: 'text-emerald-600 dark:text-emerald-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Choose the input style that best fits how teams define work shifts, business hours, and recurring availability windows.
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
                      ${([row.selector, row.slider] as boolean[]).map(
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
}
