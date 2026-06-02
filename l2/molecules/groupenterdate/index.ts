/// <mls fileReference="_102040_/l2/molecules/groupenterdate/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupenterdate/ml-compact-calendar';
import '/_102040_/l2/molecules/groupenterdate/ml-date-picker';

@customElement('molecules--groupenterdate--index-102040')
export class GroupEnterDateIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardOne: string | null = '2026-06-15';
  @state() private cardTwo: string | null = '2026-12-01';

  // ===========================================================================
  // SECTION: HERO
  // ===========================================================================
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupEnterDate
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Enter Date
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to input a date only (no time). Ideal for birth dates, due dates, contract effective dates, expiration dates, and any scenario where the time of day is irrelevant. Implementations include date picker, masked date input, inline calendar, and month/year picker.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SECTION: SHOWCASE CARDS
  // ===========================================================================
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Compact Calendar</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-compact-calendar</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Inline calendar for quick, single-date selection.</p>
              <groupenterdate--ml-compact-calendar
                name="card-one"
                value="${this.cardOne ?? ''}"
                locale="en-US"
                .firstDayOfWeek=${1}
                .showWeekNumbers=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardOne = e.detail.value;
                }}
              >
                <Label>Delivery date</Label>
                <Helper>Pick the target delivery date for the shipment.</Helper>
              </groupenterdate--ml-compact-calendar>
            </div>
          </div>
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Date Picker</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-date-picker</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Popover picker with min/max range guidance.</p>
              <groupenterdate--ml-date-picker
                name="card-two"
                value="${this.cardTwo ?? ''}"
                locale="en-US"
                minDate="2026-11-01"
                maxDate="2026-12-31"
                placeholder="YYYY-MM-DD"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardTwo = e.detail.value;
                }}
              >
                <Label>Contract effective date</Label>
                <Helper>Choose any date within the final two months of 2026.</Helper>
              </groupenterdate--ml-date-picker>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // SECTION: REFERENCE TABLE
  // ===========================================================================
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{ scenario: string; compactCalendar: boolean; datePicker: boolean }> = [
      { scenario: 'User needs a full calendar view for quick single-date selection.', compactCalendar: true, datePicker: false },
      { scenario: 'Form field needs a popover picker with min/max constraints.', compactCalendar: false, datePicker: true },
      { scenario: 'Schedule planning where week numbers help users navigate.', compactCalendar: true, datePicker: false },
      { scenario: 'Compact input with placeholder guidance and optional range.', compactCalendar: false, datePicker: true },
    ];
    const headers = [
      { label: 'Compact calendar', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Date picker', cls: 'text-emerald-600 dark:text-emerald-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this when you need the user to provide a date only (no time), and compare inline calendar versus popover picker experiences.
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
                      ${([row.compactCalendar, row.datePicker] as boolean[]).map(
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
