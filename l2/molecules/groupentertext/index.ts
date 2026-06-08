/// <mls fileReference="_102040_/l2/molecules/groupentertext/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupentertext/ml-cpf-input';
import '/_102040_/l2/molecules/groupentertext/ml-floating-text-input';
import '/_102040_/l2/molecules/groupentertext/ml-multiline-text';

@customElement('molecules--groupentertext--index-102040')
export class GroupEnterTextIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardCpf = '12345678901';
  @state() private cardFloating = 'Lucia Ramos';
  @state() private cardMultiline = 'The onboarding flow needs a short blurb about the project goals.';

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
          groupEnterText
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Enter Text
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to input free-form text. Ideal for names, descriptions, comments, emails,
          passwords, and any textual data. Implementations include input, textarea, password input,
          masked input, input OTP, search input, and tag input.
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">CPF input</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupentertext--ml-cpf-input</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Masked entry for a Brazilian CPF identifier.</p>
              <groupentertext--ml-cpf-input
                name="card-cpf"
                value="${this.cardCpf}"
                placeholder="000.000.000-00"
                mask="###.###.###-##"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardCpf = e.detail.value;
                }}
              >
                <Label>CPF</Label>
                <Helper>Only digits, 11 numbers total.</Helper>
                <Prefix>BR</Prefix>
                <Suffix>Scan</Suffix>
              </groupentertext--ml-cpf-input>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Floating text input</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupentertext--ml-floating-text-input</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Single-line entry with a floating label style.</p>
              <groupentertext--ml-floating-text-input
                name="card-floating"
                value="${this.cardFloating}"
                placeholder="Full name"
                autocomplete="name"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardFloating = e.detail.value;
                }}
              >
                <Label>Full name</Label>
                <Helper>As shown on official documents.</Helper>
                <Prefix>👤</Prefix>
                <Suffix>Clear</Suffix>
              </groupentertext--ml-floating-text-input>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Multiline text</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupentertext--ml-multiline-text</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Capture longer descriptions or notes.</p>
              <groupentertext--ml-multiline-text
                name="card-multiline"
                value="${this.cardMultiline}"
                placeholder="Share a short project summary"
                .rows=${4}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardMultiline = e.detail.value;
                }}
              >
                <Label>Project summary</Label>
                <Helper>Keep it under 280 characters.</Helper>
                <Prefix>📝</Prefix>
                <Suffix>Save</Suffix>
              </groupentertext--ml-multiline-text>
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
      componentCpf: boolean;
      componentFloating: boolean;
      componentMultiline: boolean;
    }> = [
      {
        scenario: 'Masked identifiers or fixed-format numbers like CPF or SSN.',
        componentCpf: true,
        componentFloating: false,
        componentMultiline: false,
      },
      {
        scenario: 'Short single-line names, emails, or titles with a polished label style.',
        componentCpf: false,
        componentFloating: true,
        componentMultiline: false,
      },
      {
        scenario: 'Longer feedback, notes, or descriptions that need multiple lines.',
        componentCpf: false,
        componentFloating: false,
        componentMultiline: true,
      },
      {
        scenario: 'Onboarding forms mixing brief and detailed entries side-by-side.',
        componentCpf: true,
        componentFloating: true,
        componentMultiline: true,
      },
    ];
    const headers = [
      { label: 'CPF input', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Floating text', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Multiline', cls: 'text-amber-600 dark:text-amber-400' },
    ];

    return html`
      <section
        class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700"
      >
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this table to match the right text input style to the context, from formatted IDs to
            multiline narratives.
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
                      class="${i % 2 !== 0
                        ? 'bg-slate-50/60 dark:bg-slate-900/40'
                        : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0"
                    >
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">
                        ${row.scenario}
                      </td>
                      ${([
                        row.componentCpf,
                        row.componentFloating,
                        row.componentMultiline,
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
  protected render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()}${this.renderShowcaseCards()}${this.renderReferenceTable()}
      </div>
    `;
  }
}
