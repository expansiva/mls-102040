/// <mls fileReference="_102040_/l2/molecules/groupenterdatetimeinterval/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupenterdatetimeinterval/ml-datetime-interval-timeline';
import '/_102040_/l2/molecules/groupenterdatetimeinterval/ml-enter-datetime-interval';
import '/_102040_/l2/molecules/groupenterdatetimeinterval/ml-event-duration-interval';
import { molecules, scenarios } from '/_102040_/l2/molecules/groupenterdatetimeinterval/index.defs.js';
import { renderCatalogReferenceTable } from '/_102020_/l2/aura/molecules/shared/indexReferenceTable.js';

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
    return renderCatalogReferenceTable(molecules, scenarios);
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
