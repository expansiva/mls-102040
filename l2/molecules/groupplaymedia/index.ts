/// <mls fileReference="_102040_/l2/molecules/groupplaymedia/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupplaymedia/ml-video-player';
import '/_102040_/l2/molecules/groupplaymedia/ml-audio-player';

@customElement('molecules--groupplaymedia--index-102040')
export class GroupPlayMediaIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private cardVideo = false;
  @state() private cardAudio = false;

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
          groupPlayMedia
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Play Media
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Plays audio or video content. Media sources provided via Source slot tags with fallback format support.
          Shared contract for both audio and video — swap the component tag to change the player style.
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
          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div class="h-1 bg-violet-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Video player</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupplaymedia--ml-video-player</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Visual storytelling with poster, multiple formats, and captions.</p>
              <groupplaymedia--ml-video-player
                name="card-1"
                poster="https://images.unsplash.com/photo-1522199710521-72d69614c702"
                preload="metadata"
                .autoplay=${false}
                .loop=${false}
                .muted=${false}
                .disabled=${false}
                .loading=${false}
                .value=${this.cardVideo}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardVideo = e.detail.value;
                }}
              >
                <Label>Product demo walkthrough</Label>
                <Source src="https://cdn.example.com/media/demo.webm" type="video/webm"></Source>
                <Source src="https://cdn.example.com/media/demo.mp4" type="video/mp4"></Source>
                <Track
                  src="https://cdn.example.com/media/demo-en.vtt"
                  kind="subtitles"
                  lang="en"
                  label="English"
                ></Track>
              </groupplaymedia--ml-video-player>
            </div>
          </div>

          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Audio player</p>
                <code
                  class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded"
                  >groupplaymedia--ml-audio-player</code
                >
              </div>
              <p class="text-xs text-slate-400 mb-5">Compact listening experience for narration, podcasts, or guides.</p>
              <groupplaymedia--ml-audio-player
                name="card-2"
                preload="metadata"
                .autoplay=${false}
                .loop=${true}
                .muted=${false}
                .disabled=${false}
                .loading=${false}
                .value=${this.cardAudio}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.cardAudio = e.detail.value;
                }}
              >
                <Label>Onboarding narration</Label>
                <Source src="https://cdn.example.com/media/guide.ogg" type="audio/ogg"></Source>
                <Source src="https://cdn.example.com/media/guide.mp3" type="audio/mpeg"></Source>
                <Track
                  src="https://cdn.example.com/media/guide-en.vtt"
                  kind="captions"
                  lang="en"
                  label="English captions"
                ></Track>
              </groupplaymedia--ml-audio-player>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{ scenario: string; videoPlayer: boolean; audioPlayer: boolean }> = [
      { scenario: 'Show a product demo with poster imagery and captions.', videoPlayer: true, audioPlayer: false },
      { scenario: 'Deliver a podcast, meditation, or narration track.', videoPlayer: false, audioPlayer: true },
      { scenario: 'Offer a lightweight fallback when video is unnecessary.', videoPlayer: false, audioPlayer: true },
      { scenario: 'Need visual playback controls plus subtitles.', videoPlayer: true, audioPlayer: false },
    ];
    const headers = [
      { label: 'Video player', cls: 'text-sky-600 dark:text-sky-400' },
      { label: 'Audio player', cls: 'text-amber-600 dark:text-amber-400' },
    ];

    return html`
      <section
        class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700"
      >
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Plays audio or video content. Media sources provided via Source slot tags with fallback format support.
            Use this to decide when to surface a visual player versus a listening-first experience.
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
                      ${([row.videoPlayer, row.audioPlayer] as boolean[]).map(
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
