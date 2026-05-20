/// <mls fileReference="_102040_/l2/molecules/grouprateitem/index.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/grouprateitem/ml-star-rating';
import '/_102040_/l2/molecules/grouprateitem/ml-thumbs-rating';
import '/_102040_/l2/molecules/grouprateitem/ml-emoji-mood-scale';
import '/_102040_/l2/molecules/grouprateitem/ml-numeric-rating-nps';
import '/_102040_/l2/molecules/grouprateitem/ml-qualitative-feedback-tags';
import '/_102040_/l2/molecules/grouprateitem/ml-rating-slider';

@customElement('molecules--grouprateitem--index-102040')
export class GroupRateItemIndex extends StateLitElement {

  // ── Showcase card states ─────────────────────────────────────
  @state() cardStar   = 3;
  @state() cardThumbs = 1;
  @state() cardEmoji  = 3;
  @state() cardNps    = 7;
  @state() cardTags   = 3;
  @state() cardSlider = 3;

  // ===========================================================================
  // HERO
  // ===========================================================================

  private renderHero(): TemplateResult {
    return html`
<header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
  <span class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6">
    groupRateItem
  </span>
  <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
    Rate Item
  </h1>
  <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
    A set of rating and feedback components — from classic stars to NPS scales —
    each optimised for a different emotional or numeric feedback context.
  </p>
</header>`;
  }

  // ===========================================================================
  // SHOWCASE CARDS
  // ===========================================================================

  private renderShowcaseCards(): TemplateResult {
    return html`
<section class="bg-slate-50 dark:bg-slate-950 px-8 py-12 border-b border-slate-200 dark:border-slate-700">
  <div class="max-w-2xl mx-auto flex flex-col gap-5">

    <!-- Star Rating -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="h-1 bg-amber-500"></div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Star Rating</p>
          <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-star-rating</code>
        </div>
        <p class="text-xs text-slate-400 mb-5">Classic 1–5 star quality rating</p>
        <grouprateitem--ml-star-rating
          value="${this.cardStar}" name="card-star" .isEditing=${true} min="1" max="5"
          @change=${(e: CustomEvent) => { this.cardStar = e.detail.value; }}>
          <Label>Overall rating</Label>
        </grouprateitem--ml-star-rating>
      </div>
    </div>

    <!-- Thumbs Rating -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="h-1 bg-sky-500"></div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Thumbs Rating</p>
          <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-thumbs-rating</code>
        </div>
        <p class="text-xs text-slate-400 mb-5">Quick binary like / dislike feedback</p>
        <grouprateitem--ml-thumbs-rating
          value="${this.cardThumbs}" name="card-thumbs" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.cardThumbs = e.detail.value; }}>
          <Label>Was this helpful?</Label>
          <Item value="1">👍</Item>
          <Item value="0">👎</Item>
        </grouprateitem--ml-thumbs-rating>
      </div>
    </div>

    <!-- Emoji Mood Scale -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="h-1 bg-violet-500"></div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Emoji Mood Scale</p>
          <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-emoji-mood-scale</code>
        </div>
        <p class="text-xs text-slate-400 mb-5">Emotional sentiment on a visual scale</p>
        <grouprateitem--ml-emoji-mood-scale
          value="${this.cardEmoji}" name="card-emoji" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.cardEmoji = e.detail.value; }}>
          <Label>How are you feeling?</Label>
          <Item value="1">😞</Item>
          <Item value="2">😕</Item>
          <Item value="3">😐</Item>
          <Item value="4">🙂</Item>
          <Item value="5">😄</Item>
        </grouprateitem--ml-emoji-mood-scale>
      </div>
    </div>

    <!-- Numeric Rating NPS -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="h-1 bg-emerald-500"></div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Numeric Rating NPS</p>
          <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-numeric-rating-nps</code>
        </div>
        <p class="text-xs text-slate-400 mb-5">Net Promoter Score on a 0–10 scale</p>
        <grouprateitem--ml-numeric-rating-nps
          value="${this.cardNps}" name="card-nps" .isEditing=${true} min="0" max="10"
          @change=${(e: CustomEvent) => { this.cardNps = e.detail.value; }}>
          <Label>How likely are you to recommend us?</Label>
        </grouprateitem--ml-numeric-rating-nps>
      </div>
    </div>

    <!-- Qualitative Feedback Tags -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="h-1 bg-rose-500"></div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Qualitative Feedback Tags</p>
          <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-qualitative-feedback-tags</code>
        </div>
        <p class="text-xs text-slate-400 mb-5">Label-based option tags</p>
        <grouprateitem--ml-qualitative-feedback-tags
          value="${this.cardTags}" name="card-tags" .isEditing=${true}
          @change=${(e: CustomEvent) => { this.cardTags = e.detail.value; }}>
          <Label>Rate your experience</Label>
          <Item value="1">Poor</Item>
          <Item value="2">Fair</Item>
          <Item value="3">Good</Item>
          <Item value="4">Very good</Item>
          <Item value="5">Excellent</Item>
        </grouprateitem--ml-qualitative-feedback-tags>
      </div>
    </div>

    <!-- Rating Slider -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div class="h-1 bg-indigo-500"></div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Rating Slider</p>
          <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">ml-rating-slider</code>
        </div>
        <p class="text-xs text-slate-400 mb-5">Stepped visual scale with connecting bar</p>
        <grouprateitem--ml-rating-slider
          value="${this.cardSlider}" name="card-slider" .isEditing=${true} min="1" max="5"
          @change=${(e: CustomEvent) => { this.cardSlider = e.detail.value; }}>
          <Label>Satisfaction level</Label>
        </grouprateitem--ml-rating-slider>
      </div>
    </div>

  </div>
</section>`;
  }

  // ===========================================================================
  // REFERENCE TABLE
  // ===========================================================================

  private renderReferenceTable(): TemplateResult {
    const rows: Array<{
      scenario: string;
      star: boolean; thumbs: boolean; emoji: boolean; nps: boolean; tags: boolean; slider: boolean;
    }> = [
      { scenario: 'Quick binary feedback (yes / no, like / dislike)', star: false, thumbs: true,  emoji: false, nps: false, tags: false, slider: false },
      { scenario: 'Classic 1–5 quality scale',                        star: true,  thumbs: false, emoji: false, nps: false, tags: false, slider: true  },
      { scenario: 'Capture emotional mood or sentiment',               star: false, thumbs: false, emoji: true,  nps: false, tags: false, slider: false },
      { scenario: 'Net Promoter Score (wide numeric range)',           star: false, thumbs: false, emoji: false, nps: true,  tags: false, slider: false },
      { scenario: 'Label-based options (Poor / Fair / Excellent)',     star: false, thumbs: false, emoji: false, nps: false, tags: true,  slider: false },
      { scenario: 'Stepped visual progress on a continuous scale',     star: false, thumbs: false, emoji: false, nps: true,  tags: false, slider: true  },
      { scenario: 'Universally recognisable, low learning curve',      star: true,  thumbs: true,  emoji: true,  nps: false, tags: false, slider: false },
      { scenario: 'Custom content per option (emoji, icon, text)',     star: true,  thumbs: true,  emoji: true,  nps: true,  tags: true,  slider: true  },
    ];
    const headers = [
      { label: 'Star',   cls: 'text-amber-600 dark:text-amber-400'     },
      { label: 'Thumbs', cls: 'text-sky-600 dark:text-sky-400'         },
      { label: 'Emoji',  cls: 'text-violet-600 dark:text-violet-400'   },
      { label: 'NPS',    cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Tags',   cls: 'text-rose-600 dark:text-rose-400'       },
      { label: 'Slider', cls: 'text-indigo-600 dark:text-indigo-400'   },
    ];
    return html`
<section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">Choose the right component based on the feedback type and context.</p>
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-1/2">
              Scenario
            </th>
            ${headers.map(h => html`
              <th class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}">${h.label}</th>
            `)}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row, i) => html`
            <tr class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0">
              <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
              ${([row.star, row.thumbs, row.emoji, row.nps, row.tags, row.slider] as boolean[]).map(ok => html`
                <td class="px-4 py-3.5 text-center">
                  ${ok
                    ? html`<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>`
                    : html`<span class="text-slate-200 dark:text-slate-700 text-sm">—</span>`}
                </td>
              `)}
            </tr>
          `)}
        </tbody>
      </table>
    </div>
  </div>
</section>`;
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================

  render() {
    return html`
<div class="font-sans min-h-screen">
  ${this.renderHero()}
  ${this.renderShowcaseCards()}
  ${this.renderReferenceTable()}
</div>`;
  }
}
