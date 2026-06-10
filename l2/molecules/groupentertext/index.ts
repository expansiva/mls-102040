/// <mls fileReference="_102040_/l2/molecules/groupentertext/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupentertext/ml-cpf-input';
import '/_102040_/l2/molecules/groupentertext/ml-floating-text-input';
import '/_102040_/l2/molecules/groupentertext/ml-multiline-text';
import '/_102040_/l2/molecules/groupentertext/ml-address-field';
import '/_102040_/l2/molecules/groupentertext/ml-password-strength-input';
import '/_102040_/l2/molecules/groupentertext/ml-phone-input';
import '/_102040_/l2/molecules/groupentertext/ml-tag-input';

@customElement('molecules--groupentertext--index-102040')
export class GroupEnterTextIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardCpf = '12345678909';
  @state() private cardFloating = 'Project Aurora';
  @state() private cardMultiline = 'Add release notes and customer impact summary.';
  @state() private cardAddress = '221B Baker Street';
  @state() private cardPassword = 'P@ssw0rd!';
  @state() private cardPhone = '4155550101';
  @state() private cardTag = 'design, systems, q3-launch';

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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">CPF Input</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupentertext--ml-cpf-input</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Masked document field for Brazilian CPF numbers.</p>
              <groupentertext--ml-cpf-input
                name="card-cpf"
                value="${this.cardCpf}"
                placeholder="000.000.000-00"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardCpf = e.detail.value;
                }}
              >
                <Label>CPF</Label>
                <Helper>Enter digits only. Formatting is applied automatically.</Helper>
                <Prefix>BR</Prefix>
                <Suffix>Verify</Suffix>
              </groupentertext--ml-cpf-input>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Floating Label Text</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupentertext--ml-floating-text-input</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Single-line input with floating label behavior.</p>
              <groupentertext--ml-floating-text-input
                name="card-floating"
                value="${this.cardFloating}"
                placeholder="Project name"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardFloating = e.detail.value;
                }}
              >
                <Label>Workspace name</Label>
                <Helper>Used across dashboards and reports.</Helper>
                <Prefix>#</Prefix>
                <Suffix>Auto</Suffix>
              </groupentertext--ml-floating-text-input>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Multiline Text</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupentertext--ml-multiline-text</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Textarea for descriptions or longer responses.</p>
              <groupentertext--ml-multiline-text
                name="card-multiline"
                value="${this.cardMultiline}"
                placeholder="Write a short summary"
                .rows=${4}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardMultiline = e.detail.value;
                }}
              >
                <Label>Release summary</Label>
                <Helper>Describe the key changes for stakeholders.</Helper>
                <Prefix>📝</Prefix>
                <Suffix>Limit 500</Suffix>
              </groupentertext--ml-multiline-text>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Address Field</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupentertext--ml-address-field</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Multi-part input tuned for postal addresses.</p>
              <groupentertext--ml-address-field
                name="card-address"
                value="${this.cardAddress}"
                placeholder="Street, number"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardAddress = e.detail.value;
                }}
              >
                <Label>Office address</Label>
                <Helper>Include building and suite if applicable.</Helper>
                <Prefix>📍</Prefix>
                <Suffix>Map</Suffix>
              </groupentertext--ml-address-field>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-sky-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Password Strength</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupentertext--ml-password-strength-input</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Password input with live strength feedback.</p>
              <groupentertext--ml-password-strength-input
                name="card-password"
                value="${this.cardPassword}"
                placeholder="Create a password"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardPassword = e.detail.value;
                }}
              >
                <Label>Password</Label>
                <Helper>Use 12+ characters with symbols.</Helper>
                <Prefix>🔒</Prefix>
                <Suffix>Generate</Suffix>
              </groupentertext--ml-password-strength-input>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-indigo-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Phone Input</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupentertext--ml-phone-input</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Formatted field for contact phone numbers.</p>
              <groupentertext--ml-phone-input
                name="card-phone"
                value="${this.cardPhone}"
                placeholder="(000) 000-0000"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardPhone = e.detail.value;
                }}
              >
                <Label>Mobile number</Label>
                <Helper>We’ll only use this for account recovery.</Helper>
                <Prefix>+1</Prefix>
                <Suffix>SMS</Suffix>
              </groupentertext--ml-phone-input>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-purple-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Tag Input</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupentertext--ml-tag-input</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Collect multiple keywords or labels at once.</p>
              <groupentertext--ml-tag-input
                name="card-tag"
                value="${this.cardTag}"
                placeholder="Add tags"
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardTag = e.detail.value;
                }}
              >
                <Label>Topics</Label>
                <Helper>Use commas to add multiple tags.</Helper>
                <Prefix>🏷️</Prefix>
                <Suffix>Clear</Suffix>
              </groupentertext--ml-tag-input>
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
      cpf: boolean;
      floating: boolean;
      multiline: boolean;
      address: boolean;
      passwordStrength: boolean;
      phone: boolean;
      tag: boolean;
    }> = [
      {
        scenario: 'Collect a Brazilian CPF with an enforced mask.',
        cpf: true,
        floating: false,
        multiline: false,
        address: false,
        passwordStrength: false,
        phone: false,
        tag: false,
      },
      {
        scenario: 'Capture a short, labeled single-line field such as a title.',
        cpf: false,
        floating: true,
        multiline: false,
        address: false,
        passwordStrength: false,
        phone: false,
        tag: false,
      },
      {
        scenario: 'Allow longer feedback or descriptive notes.',
        cpf: false,
        floating: false,
        multiline: true,
        address: false,
        passwordStrength: false,
        phone: false,
        tag: false,
      },
      {
        scenario: 'Gather a structured physical location or mailing address.',
        cpf: false,
        floating: false,
        multiline: false,
        address: true,
        passwordStrength: false,
        phone: false,
        tag: false,
      },
      {
        scenario: 'Collect a secure password with strength feedback.',
        cpf: false,
        floating: false,
        multiline: false,
        address: false,
        passwordStrength: true,
        phone: false,
        tag: false,
      },
      {
        scenario: 'Request a phone number formatted for calling or SMS.',
        cpf: false,
        floating: false,
        multiline: false,
        address: false,
        passwordStrength: false,
        phone: true,
        tag: false,
      },
      {
        scenario: 'Let users enter multiple keywords or categories.',
        cpf: false,
        floating: false,
        multiline: false,
        address: false,
        passwordStrength: false,
        phone: false,
        tag: true,
      },
    ];
    const headers = [
      { label: 'CPF Input', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'Floating Text', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Multiline Text', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Address Field', cls: 'text-rose-600 dark:text-rose-400' },
      { label: 'Password Strength', cls: 'text-sky-600 dark:text-sky-400' },
      { label: 'Phone Input', cls: 'text-indigo-600 dark:text-indigo-400' },
      { label: 'Tag Input', cls: 'text-purple-600 dark:text-purple-400' },
    ];

    return html`
      <section
        class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700"
      >
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this matrix to pick the right text-input variant for the type of data you need to
            capture, from masked documents and passwords to multi-tag entries.
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
                      class="${i % 2 !== 0
                        ? 'bg-slate-50/60 dark:bg-slate-900/40'
                        : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0"
                    >
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                      ${(
                        [
                          row.cpf,
                          row.floating,
                          row.multiline,
                          row.address,
                          row.passwordStrength,
                          row.phone,
                          row.tag,
                        ] as boolean[]
                      ).map(
                        (ok) => html`
                          <td class="px-4 py-3.5 text-center">
                            ${ok
                              ? html`
                                  <span
                                    class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
                                    >✓</span
                                  >
                                `
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
        ${this.renderHero()} ${this.renderShowcaseCards()} ${this.renderReferenceTable()}
      </div>
    `;
  }
}
