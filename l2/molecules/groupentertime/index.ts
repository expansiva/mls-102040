/// <mls fileReference="_102040_/l2/molecules/groupentertime/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupentertime/ml-clock-time-picker';
import '/_102040_/l2/molecules/groupentertime/ml-time-scroll-picker';

@customElement('molecules--groupentertime--index-102040')
export class GroupEnterTimeIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardClockTime = '08:30';
  @state() private cardScrollTime = '14:15:30';

  // ===========================================================================
  //  RENDER
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
  //  HERO
  // ===========================================================================
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
  //  SHOWCASE CARDS
  // ===========================================================================
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Clock face picker</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-clock-time-picker</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Best for an analog-style selection with AM/PM and constrained ranges.</p>
              <groupentertime--ml-clock-time-picker
                name="card-clock"
                value="${this.cardClockTime}"
                locale="en-US"
                minTime="06:00"
                maxTime="22:00"
                .minuteStep=${5}
                .hour12=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardClockTime = e.detail.value ?? '';
                }}
              >
                <Label>Opening time</Label>
                <Helper>Pick a time between 6:00 AM and 10:00 PM.</Helper>
              </groupentertime--ml-clock-time-picker>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Scrollable time columns</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-time-scroll-picker</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Great for precise scheduling with seconds and large increment steps.</p>
              <groupentertime--ml-time-scroll-picker
                name="card-scroll"
                value="${this.cardScrollTime}"
                locale="en-GB"
                placeholder="Select shift start"
                .minuteStep=${15}
                .showSeconds=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardScrollTime = e.detail.value ?? '';
                }}
              >
                <Label>Shift start</Label>
                <Helper>Seconds help log exact handoff times.</Helper>
              </groupentertime--ml-time-scroll-picker>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  //  REFERENCE TABLE
  // ===========================================================================
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{ scenario: string; clockPicker: boolean; scrollPicker: boolean }> = [
      { scenario: 'Selecting an opening or closing time with a visual clock face and AM/PM.', clockPicker: true, scrollPicker: false },
      { scenario: 'Choosing a precise shift time with seconds and quick increments.', clockPicker: false, scrollPicker: true },
      { scenario: 'Guided selection for recurring daily schedules in a compact form.', clockPicker: true, scrollPicker: true },
    ];
    const headers = [
      { label: 'Clock picker', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Scroll picker', cls: 'text-emerald-600 dark:text-emerald-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this group when you need time-only inputs for schedules, alarms, and business hours; compare the picker styles below to choose the best interaction.
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
                      ${([row.clockPicker, row.scrollPicker] as boolean[]).map(
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
