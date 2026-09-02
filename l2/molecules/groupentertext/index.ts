/// <mls fileReference="_102040_/l2/molecules/groupentertext/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';

// ── Component imports ───────────────────────────────────────────────────────
import '/_102040_/l2/molecules/groupentertext/ml-address-field';
import '/_102040_/l2/molecules/groupentertext/ml-cpf-input';
import '/_102040_/l2/molecules/groupentertext/ml-floating-text-input';
import '/_102040_/l2/molecules/groupentertext/ml-multiline-text';
import '/_102040_/l2/molecules/groupentertext/ml-password-strength-input';
import '/_102040_/l2/molecules/groupentertext/ml-phone-input';
import '/_102040_/l2/molecules/groupentertext/ml-tag-input';
import '/_102040_/l2/molecules/groupentertext/ml-enter-text';
import { molecules, scenarios } from '/_102040_/l2/molecules/groupentertext/index.defs.js';
import { renderCatalogReferenceTable } from '/_102020_/l2/aura/molecules/shared/indexReferenceTable.js';

@customElement('molecules--groupentertext--index-102040')
export class GroupEnterTextIndex extends StateLitElement {
  // ===========================================================================
  // ── Showcase card states ───────────────────────────────────────────────────
  // ===========================================================================
  @state() private cardAddress: string = '';
  @state() private cardCpf: string = '';
  @state() private cardFloating: string = '';
  @state() private cardMultiline: string = '';
  @state() private cardPassword: string = '';
  @state() private cardPhone: string = '';
  @state() private cardTag: string = '';
  @state() private cardEnter: string = '';

  // ===========================================================================
  // ── Render Hero ────────────────────────────────────────────────────────────
  // ===========================================================================
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
          groupEnterText
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Enter Text
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to input free-form text. Ideal for names, descriptions, comments, emails, passwords, and any textual data. Implementations include input, textarea, password input, masked input, input OTP, search input, and tag input.
        </p>
      </header>
    `;
  }

  // ===========================================================================
  // ── Render Showcase Cards ───────────────────────────────────────────────────
  // ===========================================================================
  private renderShowcaseCards(): TemplateResult {
    return html`
      <section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-2xl mx-auto flex flex-col gap-5">
          <!-- Address Field -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Address Field</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupentertext--ml-address-field</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Single‑line address entry</p>
              <groupentertext--ml-address-field
                name="card-address"
                .value=${this.cardAddress}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardAddress = e.detail.value; }}
              >
                <Label>Address</Label>
                <Helper>Enter your street address</Helper>
                <Prefix>🏠</Prefix>
              </groupentertext--ml-address-field>
            </div>
          </div>

          <!-- CPF Input -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">CPF Input</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupentertext--ml-cpf-input</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Brazilian tax‑ID with mask</p>
              <groupentertext--ml-cpf-input
                name="card-cpf"
                .value=${this.cardCpf}
                .mask="###.###.###-##"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardCpf = e.detail.value; }}
              >
                <Label>CPF</Label>
                <Helper>Enter your CPF number</Helper>
                <Prefix>🆔</Prefix>
              </groupentertext--ml-cpf-input>
            </div>
          </div>

          <!-- Floating Text Input -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Floating Text Input</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupentertext--ml-floating-text-input</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Input with floating label</p>
              <groupentertext--ml-floating-text-input
                name="card-floating"
                .value=${this.cardFloating}
                placeholder="Search…"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardFloating = e.detail.value; }}
              >
                <Label>Search</Label>
                <Helper>Type to search</Helper>
                <Suffix>🔍</Suffix>
              </groupentertext--ml-floating-text-input>
            </div>
          </div>

          <!-- Multiline Text -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Multiline Text</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupentertext--ml-multiline-text</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Textarea for longer content</p>
              <groupentertext--ml-multiline-text
                name="card-multiline"
                .value=${this.cardMultiline}
                rows="4"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardMultiline = e.detail.value; }}
              >
                <Label>Comments</Label>
                <Helper>Leave a comment</Helper>
              </groupentertext--ml-multiline-text>
            </div>
          </div>

          <!-- Password Strength Input -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-sky-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Password Strength Input</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupentertext--ml-password-strength-input</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Password with strength meter</p>
              <groupentertext--ml-password-strength-input
                name="card-password"
                .value=${this.cardPassword}
                inputType="password"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardPassword = e.detail.value; }}
              >
                <Label>Password</Label>
                <Helper>Choose a strong password</Helper>
                <Suffix>👁️</Suffix>
              </groupentertext--ml-password-strength-input>
            </div>
          </div>

          <!-- Phone Input -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-indigo-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Phone Input</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupentertext--ml-phone-input</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">International phone number with mask</p>
              <groupentertext--ml-phone-input
                name="card-phone"
                .value=${this.cardPhone}
                mask="+## (##) #####-####"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardPhone = e.detail.value; }}
              >
                <Label>Phone</Label>
                <Helper>Enter your phone number</Helper>
                <Prefix>📞</Prefix>
              </groupentertext--ml-phone-input>
            </div>
          </div>

          <!-- Tag Input -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-purple-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Tag Input</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupentertext--ml-tag-input</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Enter multiple tags, comma‑separated</p>
              <groupentertext--ml-tag-input
                name="card-tag"
                .value=${this.cardTag}
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardTag = e.detail.value; }}
              >
                <Label>Tags</Label>
                <Helper>Press Enter to add a tag</Helper>
              </groupentertext--ml-tag-input>
            </div>
          </div>

          <!-- Generic Enter Text -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-teal-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Enter Text</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupentertext--ml-enter-text</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Simple single‑line text field</p>
              <groupentertext--ml-enter-text
                name="card-enter"
                .value=${this.cardEnter}
                placeholder="Your name"
                .isEditing=${true}
                @change=${(e: CustomEvent) => { this.cardEnter = e.detail.value; }}
              >
                <Label>Name</Label>
                <Helper>Enter your full name</Helper>
              </groupentertext--ml-enter-text>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // ── Render Reference Table ─────────────────────────────────────────────────
  // ===========================================================================
  private renderReferenceTable(): TemplateResult {
    return renderCatalogReferenceTable(molecules, scenarios);
  }

  // ===========================================================================
  // ── Render -----------------------------------------------------------------
  // ===========================================================================
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
