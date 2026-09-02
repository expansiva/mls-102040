/// <mls fileReference="_102040_/l2/molecules/groupenterdatetime/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupenterdatetime/ml-datetime-picker';
import '/_102040_/l2/molecules/groupenterdatetime/ml-enter-datetime-masked-input';
import { molecules, scenarios } from '/_102040_/l2/molecules/groupenterdatetime/index.defs.js';
import { renderCatalogReferenceTable } from '/_102020_/l2/aura/molecules/shared/indexReferenceTable.js';

@customElement('molecules--groupenterdatetime--index-102040')
export class GroupEnterDatetimeIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardDatetimePicker: string | null = '2026-09-15T14:30:00';
  @state() private cardMaskedInput: string | null = '2026-10-03T09:15:00';

  // =========================================================================== HERO
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupEnterDatetime
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Enter Date and Time
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Capture a date and time together for schedules, deadlines, appointments, and other time-based workflows. Choose a picker for guided selection or a masked input for fast, format-aware entry.
        </p>
      </header>
    `;
  }

  // =========================================================================== SHOWCASE CARDS
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Datetime picker</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-datetime-picker</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Guide users through selecting an appointment date and time.</p>
              <groupenterdatetime--ml-datetime-picker
                name="card-datetime-picker"
                .value=${this.cardDatetimePicker}
                .isEditing=${true}
                locale="en-US"
                minuteStep="15"
                required
                @change=${(e: CustomEvent) => { this.cardDatetimePicker = e.detail.value; }}>
                <Label>Appointment start</Label>
                <Helper>Select a date and time in 15-minute increments.</Helper>
              </groupenterdatetime--ml-datetime-picker>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Masked datetime input</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-enter-datetime-masked-input</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Let experienced users type a complete deadline quickly and consistently.</p>
              <groupenterdatetime--ml-enter-datetime-masked-input
                name="card-masked-input"
                .value=${this.cardMaskedInput}
                .isEditing=${true}
                locale="en-US"
                placeholder="YYYY-MM-DD HH:mm"
                required
                @change=${(e: CustomEvent) => { this.cardMaskedInput = e.detail.value; }}>
                <Label>Project deadline</Label>
                <Helper>Enter the deadline using the displayed date and time format.</Helper>
              </groupenterdatetime--ml-enter-datetime-masked-input>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================================== REFERENCE TABLE
  private renderReferenceTable(): TemplateResult {
    return renderCatalogReferenceTable(molecules, scenarios);
  }

  render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }
}
