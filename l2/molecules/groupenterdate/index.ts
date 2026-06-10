/// <mls fileReference="_102040_/l2/molecules/groupenterdate/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupenterdate/ml-compact-calendar';
import '/_102040_/l2/molecules/groupenterdate/ml-date-picker';
import '/_102040_/l2/molecules/groupenterdate/ml-date-shortcut-picker';
import '/_102040_/l2/molecules/groupenterdate/ml-inline-calendar';

@customElement('molecules--groupenterdate--index-102040')
export class GroupEnterDateIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardCompactCalendar: string | null = '2026-06-09';
  @state() private cardDatePicker: string | null = '2026-10-15';
  @state() private cardDateShortcutPicker: string | null = null;
  @state() private cardInlineCalendar: string | null = '2026-03-01';

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
          groupEnterDate
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Enter Date
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to input a date only (no time). Ideal for birth dates, due dates, contract effective dates,
          expiration dates, and any scenario where the time of day is irrelevant. Implementations include date picker,
          masked date input, inline calendar, and month/year picker.
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Compact calendar</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupenterdate--ml-compact-calendar</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                For space-conscious forms that still need a month view.
              </p>
              <groupenterdate--ml-compact-calendar
                name="card-compact-calendar"
                locale="en-US"
                minDate="2026-01-01"
                maxDate="2026-12-31"
                .firstDayOfWeek=${1}
                .showWeekNumbers=${true}
                .value=${this.cardCompactCalendar}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardCompactCalendar = e.detail.value;
                }}
              >
                <Label>Project launch window</Label>
                <Helper>Pick any date in 2026 for the launch plan.</Helper>
              </groupenterdate--ml-compact-calendar>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Date picker</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupenterdate--ml-date-picker</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Standard field with a dropdown calendar and placeholder guidance.
              </p>
              <groupenterdate--ml-date-picker
                name="card-date-picker"
                locale="en-US"
                placeholder="YYYY-MM-DD"
                .value=${this.cardDatePicker}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardDatePicker = e.detail.value;
                }}
              >
                <Label>Contract effective date</Label>
                <Helper>Enter the day the agreement starts.</Helper>
              </groupenterdate--ml-date-picker>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Date shortcut picker</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupenterdate--ml-date-shortcut-picker</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Great for quickly choosing common dates like today or next week.
              </p>
              <groupenterdate--ml-date-shortcut-picker
                name="card-date-shortcut-picker"
                locale="en-US"
                placeholder="Pick a deadline"
                .value=${this.cardDateShortcutPicker}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardDateShortcutPicker = e.detail.value;
                }}
              >
                <Label>Task due date</Label>
                <Helper>Use a preset or choose a specific day.</Helper>
              </groupenterdate--ml-date-shortcut-picker>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Inline calendar</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupenterdate--ml-inline-calendar</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Always-visible calendar for scheduling or dashboard views.
              </p>
              <groupenterdate--ml-inline-calendar
                name="card-inline-calendar"
                locale="en-US"
                .showWeekNumbers=${true}
                .value=${this.cardInlineCalendar}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardInlineCalendar = e.detail.value;
                }}
              >
                <Label>Team availability</Label>
                <Helper>Select a day to see the staffing roster.</Helper>
              </groupenterdate--ml-inline-calendar>
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
      compactCalendar: boolean;
      datePicker: boolean;
      dateShortcutPicker: boolean;
      inlineCalendar: boolean;
    }> = [
      {
        scenario: 'Space-constrained layouts that still need a month grid.',
        compactCalendar: true,
        datePicker: false,
        dateShortcutPicker: false,
        inlineCalendar: false,
      },
      {
        scenario: 'Standard form field with a dropdown calendar and placeholder.',
        compactCalendar: false,
        datePicker: true,
        dateShortcutPicker: false,
        inlineCalendar: false,
      },
      {
        scenario: 'Fast selection with preset dates like today or next week.',
        compactCalendar: false,
        datePicker: false,
        dateShortcutPicker: true,
        inlineCalendar: false,
      },
      {
        scenario: 'Always-visible calendar embedded in dashboards or scheduling views.',
        compactCalendar: false,
        datePicker: false,
        dateShortcutPicker: false,
        inlineCalendar: true,
      },
    ];
    const headers = [
      { label: 'Compact calendar', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Date picker', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Shortcut picker', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Inline calendar', cls: 'text-rose-600 dark:text-rose-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this guide to choose the best date-only input for your flow, whether you need a compact picker, presets,
            or a full inline calendar.
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
                ${rows.map((row, i) => {
                  const checks = [
                    row.compactCalendar,
                    row.datePicker,
                    row.dateShortcutPicker,
                    row.inlineCalendar,
                  ];

                  return html`
                    <tr
                      class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0"
                    >
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                      ${checks.map(
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
                  `;
                })}
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
