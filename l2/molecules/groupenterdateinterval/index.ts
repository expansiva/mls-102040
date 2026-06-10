/// <mls fileReference="_102040_/l2/molecules/groupenterdateinterval/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupenterdateinterval/ml-date-interval-drag';
import '/_102040_/l2/molecules/groupenterdateinterval/ml-date-range-dual-calendar';
import '/_102040_/l2/molecules/groupenterdateinterval/ml-month-year-range';
import '/_102040_/l2/molecules/groupenterdateinterval/ml-date-interval-presets';

@customElement('molecules--groupenterdateinterval--index-102040')
export class GroupEnterDateIntervalIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state()
  private cardOne = { startDate: '2026-07-01', endDate: '2026-07-10' };

  @state()
  private cardTwo = { startDate: '2026-08-12', endDate: '2026-09-05' };

  @state()
  private cardThree = { startDate: '2026-01-01', endDate: '2026-06-30' };

  @state()
  private cardFour = { startDate: '2026-05-01', endDate: '2026-05-31' };

  // ===========================================================================
  // HERO
  // ===========================================================================
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupEnterDateInterval
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Enter Date Interval
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to input a date range with a start date and an end date (no time). Ideal for vacation periods, report filters, campaign durations, contract validity, and hotel or flight booking dates. Implementations include date range picker with dual calendar, inline date range, and range picker with presets.
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Drag interval</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupenterdateinterval--ml-date-interval-drag</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Quickly drag across the calendar to define a range.</p>
              <groupenterdateinterval--ml-date-interval-drag
                name="card-1"
                startDate="${this.cardOne.startDate}"
                endDate="${this.cardOne.endDate}"
                locale="en-US"
                .minRangeDays=${2}
                .value=${this.cardOne}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardOne = e.detail.value;
                }}
              >
                <Label>Vacation period</Label>
                <LabelStart>From</LabelStart>
                <LabelEnd>To</LabelEnd>
                <Helper>Drag across the calendar to pick your stay.</Helper>
              </groupenterdateinterval--ml-date-interval-drag>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Dual calendar range</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupenterdateinterval--ml-date-range-dual-calendar</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Two months visible for longer, multi-month planning.</p>
              <groupenterdateinterval--ml-date-range-dual-calendar
                name="card-2"
                startDate="${this.cardTwo.startDate}"
                endDate="${this.cardTwo.endDate}"
                locale="en-US"
                minDate="2026-08-01"
                maxDate="2026-12-31"
                .value=${this.cardTwo}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardTwo = e.detail.value;
                }}
              >
                <Label>Campaign duration</Label>
                <LabelStart>Start date</LabelStart>
                <LabelEnd>End date</LabelEnd>
                <Helper>Great for planning across multiple months.</Helper>
              </groupenterdateinterval--ml-date-range-dual-calendar>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Month/year range</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupenterdateinterval--ml-month-year-range</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Best when reporting by full months or year spans.</p>
              <groupenterdateinterval--ml-month-year-range
                name="card-3"
                startDate="${this.cardThree.startDate}"
                endDate="${this.cardThree.endDate}"
                locale="en-US"
                .minRangeDays=${30}
                .value=${this.cardThree}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardThree = e.detail.value;
                }}
              >
                <Label>Fiscal period</Label>
                <LabelStart>From month</LabelStart>
                <LabelEnd>To month</LabelEnd>
                <Helper>Use for quarter or year-based selections.</Helper>
              </groupenterdateinterval--ml-month-year-range>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Preset ranges</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupenterdateinterval--ml-date-interval-presets</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Let users pick from common ranges like last 30 days.</p>
              <groupenterdateinterval--ml-date-interval-presets
                name="card-4"
                startDate="${this.cardFour.startDate}"
                endDate="${this.cardFour.endDate}"
                locale="en-US"
                .maxRangeDays=${45}
                .value=${this.cardFour}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardFour = e.detail.value;
                }}
              >
                <Label>Report window</Label>
                <LabelStart>Start</LabelStart>
                <LabelEnd>End</LabelEnd>
                <Helper>Presets speed up common analytics queries.</Helper>
              </groupenterdateinterval--ml-date-interval-presets>
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
      mlMonthYearRange: boolean;
      mlDateIntervalPresets: boolean;
    }> = [
      {
        scenario: 'Users should drag across a single calendar for quick selection.',
        mlDateIntervalDrag: true,
        mlDateRangeDualCalendar: false,
        mlMonthYearRange: false,
        mlDateIntervalPresets: false,
      },
      {
        scenario: 'Longer ranges need two months visible at once.',
        mlDateIntervalDrag: false,
        mlDateRangeDualCalendar: true,
        mlMonthYearRange: false,
        mlDateIntervalPresets: false,
      },
      {
        scenario: 'Reporting requires full months or year spans rather than exact days.',
        mlDateIntervalDrag: false,
        mlDateRangeDualCalendar: false,
        mlMonthYearRange: true,
        mlDateIntervalPresets: false,
      },
      {
        scenario: 'Fast selection from predefined ranges like last 7 or 30 days.',
        mlDateIntervalDrag: false,
        mlDateRangeDualCalendar: false,
        mlMonthYearRange: false,
        mlDateIntervalPresets: true,
      },
    ];
    const headers = [
      { label: 'Drag interval', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Dual calendar', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Month/Year', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Presets', cls: 'text-rose-600 dark:text-rose-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">Compare the date range experiences to decide whether you need drag selection, dual calendars, month/year granularity, or quick presets for common ranges.</p>
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
                        row.mlDateIntervalDrag,
                        row.mlDateRangeDualCalendar,
                        row.mlMonthYearRange,
                        row.mlDateIntervalPresets,
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

  // ===========================================================================
  // RENDER
  // ===========================================================================
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
