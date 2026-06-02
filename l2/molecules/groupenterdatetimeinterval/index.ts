/// <mls fileReference="_102040_/l2/molecules/groupenterdatetimeinterval/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupenterdatetimeinterval/ml-datetime-interval-timeline';
import '/_102040_/l2/molecules/groupenterdatetimeinterval/ml-enter-datetime-interval';

@customElement('molecules--groupenterdatetimeinterval--index-102040')
export class GroupEnterDateTimeIntervalIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardTimeline = {
    startDatetime: '2026-06-05T09:00:00',
    endDatetime: '2026-06-05T11:30:00',
  };

  @state() private cardEntry = {
    startDatetime: '2026-06-12T13:30:00',
    endDatetime: '2026-06-12T15:00:00',
  };

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
          groupEnterDateTimeInterval
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Enter Date & Time Interval
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to input a date+time range with a start datetime and an end datetime. Ideal for meeting
          scheduling, room reservations, maintenance windows, task time tracking, and any booking that requires exact
          start and end timestamps. Implementations include datetime range picker, event scheduler, and booking widget.
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Timeline scheduler</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupenterdatetimeinterval--ml-datetime-interval-timeline</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Best for visual scheduling with duration constraints.</p>
              <groupenterdatetimeinterval--ml-datetime-interval-timeline
                name="card-1"
                startDatetime="${this.cardTimeline.startDatetime}"
                endDatetime="${this.cardTimeline.endDatetime}"
                locale="en-US"
                timezone="America/New_York"
                .minDurationMinutes=${30}
                .maxDurationMinutes=${480}
                .minuteStep=${15}
                .required=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardTimeline = {
                    startDatetime: e.detail.startDatetime,
                    endDatetime: e.detail.endDatetime,
                  };
                }}
              >
                <Label>Maintenance Window</Label>
                <LabelStart>Start time</LabelStart>
                <LabelEnd>End time</LabelEnd>
                <Helper>Select a 30 min to 8 hour window.</Helper>
              </groupenterdatetimeinterval--ml-datetime-interval-timeline>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Compact entry</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupenterdatetimeinterval--ml-enter-datetime-interval</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Ideal for forms and bookings with clear start/end labels.</p>
              <groupenterdatetimeinterval--ml-enter-datetime-interval
                name="card-2"
                startDatetime="${this.cardEntry.startDatetime}"
                endDatetime="${this.cardEntry.endDatetime}"
                locale="pt-BR"
                minDatetime="2026-06-10T00:00:00"
                maxDatetime="2026-06-20T23:59:59"
                .minuteStep=${30}
                .allowSameInstant=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardEntry = {
                    startDatetime: e.detail.startDatetime,
                    endDatetime: e.detail.endDatetime,
                  };
                }}
              >
                <Label>Reserva de sala</Label>
                <LabelStart>Início</LabelStart>
                <LabelEnd>Fim</LabelEnd>
                <Helper>Escolha um período entre 10 e 20 de junho.</Helper>
              </groupenterdatetimeinterval--ml-enter-datetime-interval>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{ scenario: string; timeline: boolean; entry: boolean }> = [
      { scenario: 'Scheduling in a calendar-like timeline with duration rules.', timeline: true, entry: false },
      { scenario: 'Standard form entry for bookings or task ranges.', timeline: false, entry: true },
      { scenario: 'Need strong visual cues for time span changes.', timeline: true, entry: false },
      { scenario: 'Compact fields with minimal UI footprint.', timeline: false, entry: true },
    ];
    const headers = [
      { label: 'Timeline', cls: 'text-sky-600 dark:text-sky-400' },
      { label: 'Entry', cls: 'text-amber-600 dark:text-amber-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this table to decide between a timeline-focused scheduler and a compact form input when capturing exact
            start/end timestamps.
          </p>
          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
          >
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
                    `,
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
                      ${([row.timeline, row.entry] as boolean[]).map(
                        (ok) => html`
                          <td class="px-4 py-3.5 text-center">
                            ${ok
                              ? html`<span
                                  class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
                                  >✓</span
                                >`
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
  // RENDER
  protected render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()} ${this.renderShowcaseCards()} ${this.renderReferenceTable()}
      </div>
    `;
  }
}
