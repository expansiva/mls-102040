/// <mls fileReference="_102040_/l2/molecules/groupentertimeinterval/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupentertimeinterval/ml-time-interval-selector';
import '/_102040_/l2/molecules/groupentertimeinterval/ml-time-interval-slider';
import '/_102040_/l2/molecules/groupentertimeinterval/ml-work-shift-interval';
import '/_102040_/l2/molecules/groupentertimeinterval/ml-time-interval-range';
import '/_102040_/l2/molecules/groupentertimeinterval/ml-time-interval';
import '/_102040_/l2/molecules/groupentertimeinterval/ml-enter-time-interval';

@customElement('molecules--groupentertimeinterval--index-102040')
export class GroupEnterTimeIntervalIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private card1Value: { startTime: string | null; endTime: string | null } = {
    startTime: '09:00',
    endTime: '17:30',
  };

  @state() private card2Value: { startTime: string | null; endTime: string | null } = {
    startTime: '10:00',
    endTime: '14:00',
  };

  @state() private card3Value: { startTime: string | null; endTime: string | null } = {
    startTime: '22:00',
    endTime: '06:00',
  };

  @state() private card4Value: { startTime: string | null; endTime: string | null } = {
    startTime: '08:30',
    endTime: '12:00',
  };

  @state() private card5Value: { startTime: string | null; endTime: string | null } = {
    startTime: '13:00',
    endTime: '15:00',
  };

  @state() private card6Value: { startTime: string | null; endTime: string | null } = {
    startTime: '23:15',
    endTime: '00:45',
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
          groupEnterTimeInterval
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Enter Time Interval
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Capture start and end times (no dates) for work shifts, business hours, and recurring
          availability. Choose from picker, slider, range, and grid-like implementations that also
          support overnight intervals crossing midnight.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // SHOWCASE CARDS
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section
        class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700"
      >
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Time interval selector</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupentertimeinterval--ml-time-interval-selector</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Dropdown-style picker for standard shift blocks.</p>
              <groupentertimeinterval--ml-time-interval-selector
                name="card-1"
                startTime="${this.card1Value.startTime ?? ''}"
                endTime="${this.card1Value.endTime ?? ''}"
                .minuteStep=${15}
                .required=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card1Value = { startTime: e.detail.startTime, endTime: e.detail.endTime };
                }}
              >
                <Label>Daily shift</Label>
                <LabelStart>Start time</LabelStart>
                <LabelEnd>End time</LabelEnd>
                <Helper>15-minute increments for standard shifts.</Helper>
              </groupentertimeinterval--ml-time-interval-selector>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Time interval slider</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupentertimeinterval--ml-time-interval-slider</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Drag handles to set availability windows.</p>
              <groupentertimeinterval--ml-time-interval-slider
                name="card-2"
                startTime="${this.card2Value.startTime ?? ''}"
                endTime="${this.card2Value.endTime ?? ''}"
                minTime="06:00"
                maxTime="22:00"
                .minuteStep=${30}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card2Value = { startTime: e.detail.startTime, endTime: e.detail.endTime };
                }}
              >
                <Label>Staff availability</Label>
                <LabelStart>Available from</LabelStart>
                <LabelEnd>Available until</LabelEnd>
                <Helper>Drag handles to adjust the window.</Helper>
              </groupentertimeinterval--ml-time-interval-slider>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Work shift interval</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupentertimeinterval--ml-work-shift-interval</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Shift-focused layout with overnight support.</p>
              <groupentertimeinterval--ml-work-shift-interval
                name="card-3"
                startTime="${this.card3Value.startTime ?? ''}"
                endTime="${this.card3Value.endTime ?? ''}"
                locale="en-US"
                .hour12=${true}
                .minuteStep=${15}
                .allowOvernight=${true}
                .minDurationMinutes=${60}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card3Value = { startTime: e.detail.startTime, endTime: e.detail.endTime };
                }}
              >
                <Label>Overnight coverage</Label>
                <LabelStart>Shift starts</LabelStart>
                <LabelEnd>Shift ends</LabelEnd>
                <Helper>Minimum 1 hour. Overnight shifts are allowed.</Helper>
              </groupentertimeinterval--ml-work-shift-interval>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Time interval range</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupentertimeinterval--ml-time-interval-range</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Compact range entry for short sessions.</p>
              <groupentertimeinterval--ml-time-interval-range
                name="card-4"
                startTime="${this.card4Value.startTime ?? ''}"
                endTime="${this.card4Value.endTime ?? ''}"
                .minuteStep=${5}
                .allowSameTime=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card4Value = { startTime: e.detail.startTime, endTime: e.detail.endTime };
                }}
              >
                <Label>Class session</Label>
                <LabelStart>Begins</LabelStart>
                <LabelEnd>Ends</LabelEnd>
                <Helper>Ideal for short, fixed sessions.</Helper>
              </groupentertimeinterval--ml-time-interval-range>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-sky-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Time interval</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupentertimeinterval--ml-time-interval</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">General-purpose field for simple ranges.</p>
              <groupentertimeinterval--ml-time-interval
                name="card-5"
                startTime="${this.card5Value.startTime ?? ''}"
                endTime="${this.card5Value.endTime ?? ''}"
                .minuteStep=${10}
                .required=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card5Value = { startTime: e.detail.startTime, endTime: e.detail.endTime };
                }}
              >
                <Label>Break window</Label>
                <LabelStart>Break starts</LabelStart>
                <LabelEnd>Break ends</LabelEnd>
                <Helper>Required for scheduling breaks.</Helper>
              </groupentertimeinterval--ml-time-interval>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-indigo-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Enter time interval</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupentertimeinterval--ml-enter-time-interval</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Full-featured entry for complex availability rules.</p>
              <groupentertimeinterval--ml-enter-time-interval
                name="card-6"
                startTime="${this.card6Value.startTime ?? ''}"
                endTime="${this.card6Value.endTime ?? ''}"
                locale="en-US"
                .hour12=${true}
                .showSeconds=${true}
                .minuteStep=${15}
                .allowOvernight=${true}
                .minDurationMinutes=${30}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card6Value = { startTime: e.detail.startTime, endTime: e.detail.endTime };
                }}
              >
                <Label>After-hours support</Label>
                <LabelStart>Opens</LabelStart>
                <LabelEnd>Closes</LabelEnd>
                <Helper>Shows seconds and allows overnight spans.</Helper>
              </groupentertimeinterval--ml-enter-time-interval>
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
      timeIntervalSelector: boolean;
      timeIntervalSlider: boolean;
      workShiftInterval: boolean;
      timeIntervalRange: boolean;
      timeInterval: boolean;
      enterTimeInterval: boolean;
    }> = [
      {
        scenario: 'Need a quick dropdown-like selector for standard shifts or office hours.',
        timeIntervalSelector: true,
        timeIntervalSlider: false,
        workShiftInterval: false,
        timeIntervalRange: false,
        timeInterval: true,
        enterTimeInterval: false,
      },
      {
        scenario: 'Users should drag a visual timeline to set availability windows.',
        timeIntervalSelector: false,
        timeIntervalSlider: true,
        workShiftInterval: false,
        timeIntervalRange: false,
        timeInterval: false,
        enterTimeInterval: false,
      },
      {
        scenario: 'Configuring shifts that can cross midnight with duration rules.',
        timeIntervalSelector: false,
        timeIntervalSlider: false,
        workShiftInterval: true,
        timeIntervalRange: false,
        timeInterval: false,
        enterTimeInterval: true,
      },
      {
        scenario: 'Collecting short session ranges with a compact inline layout.',
        timeIntervalSelector: false,
        timeIntervalSlider: false,
        workShiftInterval: false,
        timeIntervalRange: true,
        timeInterval: true,
        enterTimeInterval: false,
      },
    ];

    const headers = [
      { label: 'Selector', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Slider', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Work Shift', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Range', cls: 'text-rose-600 dark:text-rose-400' },
      { label: 'Time Interval', cls: 'text-sky-600 dark:text-sky-400' },
      { label: 'Enter Interval', cls: 'text-indigo-600 dark:text-indigo-400' },
    ];

    return html`
      <section
        class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700"
      >
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this guide to match scheduling scenarios—shifts, business hours, and recurring
            availability—to the most fitting time-interval component, including overnight support.
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
                    `
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
                      ${([
                        row.timeIntervalSelector,
                        row.timeIntervalSlider,
                        row.workShiftInterval,
                        row.timeIntervalRange,
                        row.timeInterval,
                        row.enterTimeInterval,
                      ] as boolean[]).map(
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

  // ===========================================================================
  // RENDER
  protected override render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()} ${this.renderShowcaseCards()} ${this.renderReferenceTable()}
      </div>
    `;
  }
}
