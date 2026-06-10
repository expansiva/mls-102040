/// <mls fileReference="_102040_/l2/molecules/groupenterdatetimeinterval/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupenterdatetimeinterval/ml-datetime-interval-timeline';
import '/_102040_/l2/molecules/groupenterdatetimeinterval/ml-enter-datetime-interval';
import '/_102040_/l2/molecules/groupenterdatetimeinterval/ml-event-duration-interval';

@customElement('molecules--groupenterdatetimeinterval--index-102040')
export class GroupEnterDateTimeIntervalIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardTimeline = {
    startDatetime: '2026-06-10T08:00:00',
    endDatetime: '2026-06-10T11:30:00',
  };

  @state() private cardEnter = {
    startDatetime: '2026-06-12T09:15:00',
    endDatetime: '2026-06-12T10:45:00',
  };

  @state() private cardEvent = {
    startDatetime: '2026-06-14T13:00:00',
    endDatetime: '2026-06-14T15:00:00',
  };

  // ===========================================================================
  // Hero Section
  // ===========================================================================
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
          Allows the user to input a date+time range with a start datetime and an end datetime. Ideal
          for meeting scheduling, room reservations, maintenance windows, task time tracking, and any
          booking that requires exact start and end timestamps.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // Showcase Cards Section
  // ===========================================================================
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Timeline range</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupenterdatetimeinterval--ml-datetime-interval-timeline</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Best when a visual timeline helps adjust a maintenance or availability window.
              </p>
              <groupenterdatetimeinterval--ml-datetime-interval-timeline
                name="card-1"
                startDatetime="${this.cardTimeline.startDatetime}"
                endDatetime="${this.cardTimeline.endDatetime}"
                timezone="America/Chicago"
                locale="en-US"
                .minuteStep=${15}
                .allowSameInstant=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent<{ startDatetime: string | null; endDatetime: string | null }>) => {
                  this.cardTimeline = {
                    startDatetime: e.detail.startDatetime ?? '',
                    endDatetime: e.detail.endDatetime ?? '',
                  };
                }}
              >
                <Label>Maintenance Window</Label>
                <LabelStart>Start time</LabelStart>
                <LabelEnd>End time</LabelEnd>
                <Helper>Drag across the timeline to cover the expected outage.</Helper>
              </groupenterdatetimeinterval--ml-datetime-interval-timeline>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Standard range input</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupenterdatetimeinterval--ml-enter-datetime-interval</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Form-friendly picker for scheduling meetings with clear start and end fields.
              </p>
              <groupenterdatetimeinterval--ml-enter-datetime-interval
                name="card-2"
                startDatetime="${this.cardEnter.startDatetime}"
                endDatetime="${this.cardEnter.endDatetime}"
                locale="en-GB"
                minDatetime="2026-06-12T08:00:00"
                maxDatetime="2026-06-12T18:00:00"
                .minuteStep=${30}
                .required=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent<{ startDatetime: string | null; endDatetime: string | null }>) => {
                  this.cardEnter = {
                    startDatetime: e.detail.startDatetime ?? '',
                    endDatetime: e.detail.endDatetime ?? '',
                  };
                }}
              >
                <Label>Team Sync</Label>
                <LabelStart>Start</LabelStart>
                <LabelEnd>End</LabelEnd>
                <Helper>Meetings must stay within business hours.</Helper>
              </groupenterdatetimeinterval--ml-enter-datetime-interval>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Event duration interval</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupenterdatetimeinterval--ml-event-duration-interval</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">
                Tailored for bookings that enforce minimum and maximum duration rules.
              </p>
              <groupenterdatetimeinterval--ml-event-duration-interval
                name="card-3"
                startDatetime="${this.cardEvent.startDatetime}"
                endDatetime="${this.cardEvent.endDatetime}"
                locale="pt-BR"
                timezone="America/Sao_Paulo"
                .minDurationMinutes=${60}
                .maxDurationMinutes=${240}
                .minuteStep=${15}
                .isEditing=${true}
                @change=${(e: CustomEvent<{ startDatetime: string | null; endDatetime: string | null }>) => {
                  this.cardEvent = {
                    startDatetime: e.detail.startDatetime ?? '',
                    endDatetime: e.detail.endDatetime ?? '',
                  };
                }}
              >
                <Label>Studio Booking</Label>
                <LabelStart>Check-in</LabelStart>
                <LabelEnd>Check-out</LabelEnd>
                <Helper>Bookings must last between 1 and 4 hours.</Helper>
              </groupenterdatetimeinterval--ml-event-duration-interval>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // Reference Table Section
  // ===========================================================================
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{
      scenario: string;
      mlDatetimeIntervalTimeline: boolean;
      mlEnterDatetimeInterval: boolean;
      mlEventDurationInterval: boolean;
    }> = [
      {
        scenario: 'Need a visual timeline to drag across a maintenance window or availability block.',
        mlDatetimeIntervalTimeline: true,
        mlEnterDatetimeInterval: false,
        mlEventDurationInterval: false,
      },
      {
        scenario: 'Simple form-driven meeting scheduling with start/end fields and validation.',
        mlDatetimeIntervalTimeline: false,
        mlEnterDatetimeInterval: true,
        mlEventDurationInterval: false,
      },
      {
        scenario: 'Bookings with strict min/max duration rules and event context.',
        mlDatetimeIntervalTimeline: false,
        mlEnterDatetimeInterval: false,
        mlEventDurationInterval: true,
      },
      {
        scenario: 'Users need a clear range input but no duration constraints.',
        mlDatetimeIntervalTimeline: false,
        mlEnterDatetimeInterval: true,
        mlEventDurationInterval: false,
      },
    ];
    const headers = [
      { label: 'Timeline range', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Standard range input', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Event duration interval', cls: 'text-amber-600 dark:text-amber-400' },
    ];

    return html`
      <section
        class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700"
      >
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this matrix to choose between timeline visuals, standard inputs, and duration-focused
            widgets for date+time range entry.
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
                      class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0"
                    >
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">
                        ${row.scenario}
                      </td>
                      ${([
                        row.mlDatetimeIntervalTimeline,
                        row.mlEnterDatetimeInterval,
                        row.mlEventDurationInterval,
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
  // Render
  // ===========================================================================
  protected render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()} ${this.renderShowcaseCards()} ${this.renderReferenceTable()}
      </div>
    `;
  }
}
