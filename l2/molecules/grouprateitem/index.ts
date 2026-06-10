/// <mls fileReference="_102040_/l2/molecules/grouprateitem/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/grouprateitem/ml-emoji-mood-scale';
import '/_102040_/l2/molecules/grouprateitem/ml-numeric-rating-nps';
import '/_102040_/l2/molecules/grouprateitem/ml-qualitative-feedback-tags';
import '/_102040_/l2/molecules/grouprateitem/ml-rating-slider';
import '/_102040_/l2/molecules/grouprateitem/ml-star-rating';
import '/_102040_/l2/molecules/grouprateitem/ml-thumbs-rating';
import '/_102040_/l2/molecules/grouprateitem/ml-csat-rating';
import '/_102040_/l2/molecules/grouprateitem/ml-ces-scale';

@customElement('molecules--grouprateitem--index-102040')
export class GroupRateItemIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private card1 = 4;
  @state() private card2 = 1;
  @state() private card3 = 3;
  @state() private card4 = 8;
  @state() private card5 = 70;
  @state() private card6 = 4;
  @state() private card7 = 5;
  @state() private card8 = 2;

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
          groupRateItem
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Rate Item
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Allows the user to rate or score an item with auto-generated numeric ranges or custom options
          via Item slots. Pick from stars, thumbs, emojis, NPS scales, and slider-based ratings.
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Star rating</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >grouprateitem--ml-star-rating</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Classic 1–5 star rating for products or content.</p>
              <grouprateitem--ml-star-rating
                name="card-1"
                .value=${this.card1}
                .min=${1}
                .max=${5}
                .step=${1}
                .required=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card1 = e.detail.value;
                }}
              >
                <Label>Rate this product</Label>
                <Helper>Tap a star to share your rating.</Helper>
              </grouprateitem--ml-star-rating>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Thumbs up/down</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >grouprateitem--ml-thumbs-rating</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Binary sentiment for quick feedback.</p>
              <grouprateitem--ml-thumbs-rating
                name="card-2"
                .value=${this.card2}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card2 = e.detail.value;
                }}
              >
                <Label>Was this answer helpful?</Label>
                <Helper>Choose a quick reaction.</Helper>
                <Item value="0">👎</Item>
                <Item value="1">👍</Item>
              </grouprateitem--ml-thumbs-rating>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Emoji mood scale</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >grouprateitem--ml-emoji-mood-scale</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Expressive feedback using emojis.</p>
              <grouprateitem--ml-emoji-mood-scale
                name="card-3"
                .value=${this.card3}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card3 = e.detail.value;
                }}
              >
                <Label>How do you feel about the update?</Label>
                <Helper>Pick the emoji that best matches your mood.</Helper>
                <Item value="1">😡</Item>
                <Item value="2">😕</Item>
                <Item value="3">😐</Item>
                <Item value="4">😊</Item>
                <Item value="5">🤩</Item>
              </grouprateitem--ml-emoji-mood-scale>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">NPS rating</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >grouprateitem--ml-numeric-rating-nps</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">0–10 scale for promoter score surveys.</p>
              <grouprateitem--ml-numeric-rating-nps
                name="card-4"
                .value=${this.card4}
                .min=${0}
                .max=${10}
                .step=${1}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card4 = e.detail.value;
                }}
              >
                <Label>How likely are you to recommend us?</Label>
                <Helper>0 = not likely, 10 = extremely likely.</Helper>
              </grouprateitem--ml-numeric-rating-nps>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-sky-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Rating slider</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >grouprateitem--ml-rating-slider</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Continuous range for fine-grained scoring.</p>
              <grouprateitem--ml-rating-slider
                name="card-5"
                .value=${this.card5}
                .min=${0}
                .max=${100}
                .step=${10}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card5 = e.detail.value;
                }}
              >
                <Label>Rate the onboarding experience</Label>
                <Helper>Slide to select a score from 0 to 100.</Helper>
              </grouprateitem--ml-rating-slider>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-indigo-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">CSAT rating</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >grouprateitem--ml-csat-rating</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Satisfaction labels for post-task surveys.</p>
              <grouprateitem--ml-csat-rating
                name="card-6"
                .value=${this.card6}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card6 = e.detail.value;
                }}
              >
                <Label>Overall satisfaction</Label>
                <Helper>Pick the option that best matches your experience.</Helper>
                <Item value="1">Very unhappy</Item>
                <Item value="2">Unhappy</Item>
                <Item value="3">Neutral</Item>
                <Item value="4">Happy</Item>
                <Item value="5">Very happy</Item>
              </grouprateitem--ml-csat-rating>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-purple-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">CES scale</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >grouprateitem--ml-ces-scale</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Effort score from 1–7 for support tasks.</p>
              <grouprateitem--ml-ces-scale
                name="card-7"
                .value=${this.card7}
                .min=${1}
                .max=${7}
                .step=${1}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card7 = e.detail.value;
                }}
              >
                <Label>How easy was it to resolve your issue?</Label>
                <Helper>1 = very difficult, 7 = very easy.</Helper>
              </grouprateitem--ml-ces-scale>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-teal-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Feedback tags</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >grouprateitem--ml-qualitative-feedback-tags</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Pick descriptive tags for qualitative insight.</p>
              <grouprateitem--ml-qualitative-feedback-tags
                name="card-8"
                .value=${this.card8}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card8 = e.detail.value;
                }}
              >
                <Label>What needs improvement?</Label>
                <Helper>Select the tag that best describes the issue.</Helper>
                <Item value="1">Too slow</Item>
                <Item value="2">Confusing</Item>
                <Item value="3">Missing features</Item>
                <Item value="4">Buggy</Item>
              </grouprateitem--ml-qualitative-feedback-tags>
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
      emojiMoodScale: boolean;
      numericRatingNps: boolean;
      qualitativeFeedbackTags: boolean;
      ratingSlider: boolean;
      starRating: boolean;
      thumbsRating: boolean;
      csatRating: boolean;
      cesScale: boolean;
    }> = [
      {
        scenario: 'Express emotional sentiment with visual cues.',
        emojiMoodScale: true,
        numericRatingNps: false,
        qualitativeFeedbackTags: false,
        ratingSlider: false,
        starRating: false,
        thumbsRating: false,
        csatRating: false,
        cesScale: false,
      },
      {
        scenario: 'Measure likelihood to recommend on a 0–10 scale.',
        emojiMoodScale: false,
        numericRatingNps: true,
        qualitativeFeedbackTags: false,
        ratingSlider: false,
        starRating: false,
        thumbsRating: false,
        csatRating: false,
        cesScale: false,
      },
      {
        scenario: 'Capture a single descriptive issue or reason.',
        emojiMoodScale: false,
        numericRatingNps: false,
        qualitativeFeedbackTags: true,
        ratingSlider: false,
        starRating: false,
        thumbsRating: false,
        csatRating: false,
        cesScale: false,
      },
      {
        scenario: 'Allow a continuous score with fine granularity.',
        emojiMoodScale: false,
        numericRatingNps: false,
        qualitativeFeedbackTags: false,
        ratingSlider: true,
        starRating: false,
        thumbsRating: false,
        csatRating: false,
        cesScale: false,
      },
      {
        scenario: 'Use a familiar star-based rating pattern.',
        emojiMoodScale: false,
        numericRatingNps: false,
        qualitativeFeedbackTags: false,
        ratingSlider: false,
        starRating: true,
        thumbsRating: false,
        csatRating: false,
        cesScale: false,
      },
      {
        scenario: 'Collect a quick yes/no sentiment.',
        emojiMoodScale: false,
        numericRatingNps: false,
        qualitativeFeedbackTags: false,
        ratingSlider: false,
        starRating: false,
        thumbsRating: true,
        csatRating: false,
        cesScale: false,
      },
      {
        scenario: 'Ask for satisfaction using descriptive labels.',
        emojiMoodScale: false,
        numericRatingNps: false,
        qualitativeFeedbackTags: false,
        ratingSlider: false,
        starRating: false,
        thumbsRating: false,
        csatRating: true,
        cesScale: false,
      },
      {
        scenario: 'Measure effort required to complete a task.',
        emojiMoodScale: false,
        numericRatingNps: false,
        qualitativeFeedbackTags: false,
        ratingSlider: false,
        starRating: false,
        thumbsRating: false,
        csatRating: false,
        cesScale: true,
      },
    ];
    const headers = [
      { label: 'Emoji mood', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'NPS scale', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Feedback tags', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Rating slider', cls: 'text-rose-600 dark:text-rose-400' },
      { label: 'Star rating', cls: 'text-sky-600 dark:text-sky-400' },
      { label: 'Thumbs', cls: 'text-indigo-600 dark:text-indigo-400' },
      { label: 'CSAT', cls: 'text-purple-600 dark:text-purple-400' },
      { label: 'CES', cls: 'text-teal-600 dark:text-teal-400' },
    ];

    return html`
      <section
        class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700"
      >
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Use this guide to match the rating experience to the scale type and feedback format you
            need.
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
                ${rows.map((row, i) => {
                  const values = [
                    row.emojiMoodScale,
                    row.numericRatingNps,
                    row.qualitativeFeedbackTags,
                    row.ratingSlider,
                    row.starRating,
                    row.thumbsRating,
                    row.csatRating,
                    row.cesScale,
                  ];

                  return html`
                    <tr
                      class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0"
                    >
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                      ${values.map(
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
                  `;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // RENDER
  public render(): TemplateResult {
    return html`
      <div class="font-sans min-h-screen">
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }
}
