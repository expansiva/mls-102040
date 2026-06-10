/// <mls fileReference="_102040_/l2/molecules/groupentertime/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupentertime/ml-clock-time-picker';
import '/_102040_/l2/molecules/groupentertime/ml-time-scroll-picker';
import '/_102040_/l2/molecules/groupentertime/ml-enter-time-duration';

@customElement('molecules--groupentertime--index-102040')
export class GroupEnterTimeIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private card1 = '08:30';
  @state() private card2 = '18:15';
  @state() private card3 = '01:45:00';

  // ===========================================================================
  // HERO
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupEnterTime
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Enter Time
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to input a time only (no date). Ideal for business hours, recurring daily schedules, alarm times, opening and closing times, and shift configurations. Implementations include time picker with scrollable columns, masked time input, time spinner, and clock face.
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Clock face picker</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupentertime--ml-clock-time-picker</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Best for visual selection when users prefer analog-style time entry.</p>
              <groupentertime--ml-clock-time-picker
                name="card-1"
                value="${this.card1}"
                locale="en-US"
                placeholder="Select a time"
                .hour12=${true}
                .minuteStep=${5}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card1 = e.detail.value ?? '';
                }}
              >
                <Label>Opening time</Label>
                <Helper>Tap the clock to choose a start time.</Helper>
              </groupentertime--ml-clock-time-picker>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Scrollable columns</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupentertime--ml-time-scroll-picker</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Great for kiosk-style interfaces and fast incremental changes.</p>
              <groupentertime--ml-time-scroll-picker
                name="card-2"
                value="${this.card2}"
                locale="en-GB"
                minTime="06:00"
                maxTime="22:00"
                placeholder="Pick a time"
                .minuteStep=${15}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card2 = e.detail.value ?? '';
                }}
              >
                <Label>Closing time</Label>
                <Helper>Available in 15-minute increments.</Helper>
              </groupentertime--ml-time-scroll-picker>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Time duration entry</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupentertime--ml-enter-time-duration</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Use when capturing elapsed time or shift length with seconds.</p>
              <groupentertime--ml-enter-time-duration
                name="card-3"
                value="${this.card3}"
                placeholder="HH:mm:ss"
                .showSeconds=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card3 = e.detail.value ?? '';
                }}
              >
                <Label>Shift duration</Label>
                <Helper>Include seconds for precise time tracking.</Helper>
              </groupentertime--ml-enter-time-duration>
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
      clockTimePicker: boolean;
      timeScrollPicker: boolean;
      enterTimeDuration: boolean;
    }> = [
      {
        scenario: 'Users want an analog-style clock for quick selection.',
        clockTimePicker: true,
        timeScrollPicker: false,
        enterTimeDuration: false,
      },
      {
        scenario: 'Kiosk or mobile UI where time columns spin quickly.',
        clockTimePicker: false,
        timeScrollPicker: true,
        enterTimeDuration: false,
      },
      {
        scenario: 'Capturing elapsed time or shift length with seconds.',
        clockTimePicker: false,
        timeScrollPicker: false,
        enterTimeDuration: true,
      },
      {
        scenario: 'Choosing opening/closing hours in 15-minute steps.',
        clockTimePicker: false,
        timeScrollPicker: true,
        enterTimeDuration: false,
      },
    ];
    const headers = [
      { label: 'Clock picker', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Scroll picker', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Duration input', cls: 'text-amber-600 dark:text-amber-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this guide to pick the best time-only input for business hours, daily schedules, alarms, and shift configuration workflows.
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
                      ${([row.clockTimePicker, row.timeScrollPicker, row.enterTimeDuration] as boolean[]).map(
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
  public render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }
}
