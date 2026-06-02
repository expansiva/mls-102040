/// <mls fileReference="_102040_/l2/molecules/groupenterdateinterval/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupenterdateinterval/ml-date-interval-drag';
import '/_102040_/l2/molecules/groupenterdateinterval/ml-date-range-dual-calendar';

@customElement('molecules--groupenterdateinterval--index-102040')
export class GroupEnterDateIntervalIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state()
  private cardDrag = {
    startDate: '2026-06-10',
    endDate: '2026-06-18',
  };

  @state()
  private cardDualCalendar = {
    startDate: '2026-07-01',
    endDate: '2026-07-12',
  };

  // ===========================================================================
  // HERO
  // ===========================================================================
  private renderHero(): TemplateResult {
    return html`
      <header
        class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center"
      >
        <span
          class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
        >
          groupEnterDateInterval
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Enter Date Interval
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to input a date range with a start date and an end date (no time). Ideal for
          vacation periods, report filters, campaign durations, contract validity, and hotel or flight
          booking dates.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SHOWCASE CARDS
  // ===========================================================================
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Interval Drag Picker</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupenterdateinterval--ml-date-interval-drag</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Drag across dates to set flexible ranges for travel or bookings.
              </p>
              <groupenterdateinterval--ml-date-interval-drag
                name="card-drag"
                startDate="${this.cardDrag.startDate}"
                endDate="${this.cardDrag.endDate}"
                locale="en-US"
                .minRangeDays=${2}
                .allowSameDay=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardDrag = e.detail;
                }}
              >
                <Label>Reservation Window</Label>
                <LabelStart>Check-in</LabelStart>
                <LabelEnd>Check-out</LabelEnd>
                <Helper>Minimum stay is 2 nights.</Helper>
              </groupenterdateinterval--ml-date-interval-drag>
            </div>
          </div>

          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Dual Calendar Range</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupenterdateinterval--ml-date-range-dual-calendar</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Two-month view for precise report or campaign scheduling.
              </p>
              <groupenterdateinterval--ml-date-range-dual-calendar
                name="card-dual"
                startDate="${this.cardDualCalendar.startDate}"
                endDate="${this.cardDualCalendar.endDate}"
                locale="en-US"
                minDate="2026-01-01"
                maxDate="2026-12-31"
                .maxRangeDays=${30}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardDualCalendar = e.detail;
                }}
              >
                <Label>Campaign Dates</Label>
                <LabelStart>Starts</LabelStart>
                <LabelEnd>Ends</LabelEnd>
                <Helper>Limit range to 30 days in 2026.</Helper>
              </groupenterdateinterval--ml-date-range-dual-calendar>
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
    const rows: Array<{
      scenario: string;
      mlDateIntervalDrag: boolean;
      mlDateRangeDualCalendar: boolean;
    }> = [
      {
        scenario: 'Users should drag across contiguous days to define their stay quickly.',
        mlDateIntervalDrag: true,
        mlDateRangeDualCalendar: false,
      },
      {
        scenario: 'A two-calendar overview helps compare months for reporting ranges.',
        mlDateIntervalDrag: false,
        mlDateRangeDualCalendar: true,
      },
      {
        scenario: 'Need a compact picker with clear min/max range boundaries.',
        mlDateIntervalDrag: true,
        mlDateRangeDualCalendar: true,
      },
    ];
    const headers = [
      { label: 'Interval Drag', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Dual Calendar', cls: 'text-emerald-600 dark:text-emerald-400' },
    ];

    return html`
      <section
        class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700"
      >
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this guide to choose the right date-range interaction pattern for your date-only
            ranges.
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
                      class="${i % 2 !== 0
                        ? 'bg-slate-50/60 dark:bg-slate-900/40'
                        : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0"
                    >
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">
                        ${row.scenario}
                      </td>
                      ${([row.mlDateIntervalDrag, row.mlDateRangeDualCalendar] as boolean[]).map(
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

  protected render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()} ${this.renderShowcaseCards()} ${this.renderReferenceTable()}
      </div>
    `;
  }
}
