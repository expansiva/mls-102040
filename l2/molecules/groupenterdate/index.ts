/// <mls fileReference="_102040_/l2/molecules/groupenterdate/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupenterdate/ml-compact-calendar';
import '/_102040_/l2/molecules/groupenterdate/ml-date-picker';
import '/_102040_/l2/molecules/groupenterdate/ml-date-shortcut-picker';
import '/_102040_/l2/molecules/groupenterdate/ml-inline-calendar';
import { molecules, scenarios } from '/_102040_/l2/molecules/groupenterdate/index.defs.js';
import { renderCatalogReferenceTable } from '/_102020_/l2/aura/molecules/shared/indexReferenceTable.js';

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
    return renderCatalogReferenceTable(molecules, scenarios);
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
