/// <mls fileReference="_102040_/l2/molecules/groupplaymedia/index.ts" enhancement="_102020_/l2/enhancementAura"/>
import { html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import '/_102040_/l2/molecules/groupplaymedia/ml-audio-player';
import '/_102040_/l2/molecules/groupplaymedia/ml-video-player';
import '/_102040_/l2/molecules/groupplaymedia/ml-pdf-viewer';
import '/_102040_/l2/molecules/groupplaymedia/ml-image-gallery';

@customElement('molecules--groupplaymedia--index-102040')
export class GroupPlayMediaIndex extends StateLitElement {
  // ── Showcase card states ─────────────────────────────────────
  @state() private card1 = 'ready';
  @state() private card2 = 'ready';
  @state() private card3 = 'ready';
  @state() private card4 = 'ready';

  // ===========================================================================
  // HERO
  private renderHero(): TemplateResult {
    return html`
      <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-20 text-center">
        <span
          class="inline-block px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
        >
          groupPlayMedia
        </span>
        <h1 class="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-5 tracking-tight">
          Play Media
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Plays audio or video content. Media sources provided via Source slot tags with fallback format support. Shared contract for both audio and video — swap the component tag to change the player style. Supports autoplay, loop, mute, poster thumbnail, and subtitle tracks. Implementations include video player, audio player, mini player, and media controls.
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
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Video player</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupplaymedia--ml-video-player</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Full video playback with poster thumbnail and subtitle tracks.</p>
              <groupplaymedia--ml-video-player
                name="card-1"
                value="${this.card1}"
                poster="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80"
                preload="metadata"
                .autoplay=${false}
                .loop=${false}
                .muted=${true}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card1 = e.detail.value;
                }}
              >
                <Label>Product demo reel</Label>
                <Source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4"></Source>
                <Source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.webm" type="video/webm"></Source>
                <Track src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.vtt" kind="subtitles" lang="en" label="English"></Track>
              </groupplaymedia--ml-video-player>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-emerald-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Audio player</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupplaymedia--ml-audio-player</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Compact audio playback for podcasts and voice notes.</p>
              <groupplaymedia--ml-audio-player
                name="card-2"
                value="${this.card2}"
                preload="metadata"
                .autoplay=${false}
                .loop=${true}
                .muted=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card2 = e.detail.value;
                }}
              >
                <Label>Weekly briefing • Episode 42</Label>
                <Source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" type="audio/mpeg"></Source>
                <Source src="https://www.soundhelix.com/examples/ogg/SoundHelix-Song-2.ogg" type="audio/ogg"></Source>
                <Track src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.vtt" kind="captions" lang="en" label="English"></Track>
              </groupplaymedia--ml-audio-player>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-amber-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">PDF viewer</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupplaymedia--ml-pdf-viewer</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Inline document playback for manuals and reports.</p>
              <groupplaymedia--ml-pdf-viewer
                name="card-3"
                value="${this.card3}"
                preload="metadata"
                .loading=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card3 = e.detail.value;
                }}
              >
                <Label>Quarterly performance report</Label>
                <Source src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" type="application/pdf"></Source>
              </groupplaymedia--ml-pdf-viewer>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="h-1 bg-rose-500 rounded-t-2xl"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Image gallery</p>
                <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">groupplaymedia--ml-image-gallery</code>
              </div>
              <p class="text-xs text-slate-400 mb-5">Swipeable image browsing for collections and launches.</p>
              <groupplaymedia--ml-image-gallery
                name="card-4"
                value="${this.card4}"
                preload="metadata"
                .loading=${false}
                .isEditing=${true}
                @change=${(e: CustomEvent) => {
                  this.card4 = e.detail.value;
                }}
              >
                <Label>Spring campaign highlights</Label>
                <Source src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80" type="image/jpeg"></Source>
                <Source src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80" type="image/jpeg"></Source>
                <Source src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80" type="image/jpeg"></Source>
              </groupplaymedia--ml-image-gallery>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ===========================================================================
  // REFERENCE TABLE
  private renderReferenceTable(): TemplateResult {
    const rows: Array<{ scenario: string; audioPlayer: boolean; videoPlayer: boolean; pdfViewer: boolean; imageGallery: boolean }> = [
      { scenario: 'Need a compact audio-only playback bar for podcasts or voice notes.', audioPlayer: true, videoPlayer: false, pdfViewer: false, imageGallery: false },
      { scenario: 'Need full video playback with poster art and subtitle tracks.', audioPlayer: false, videoPlayer: true, pdfViewer: false, imageGallery: false },
      { scenario: 'Need inline document preview for PDFs inside a workflow.', audioPlayer: false, videoPlayer: false, pdfViewer: true, imageGallery: false },
      { scenario: 'Need a gallery-style browsing experience for multiple images.', audioPlayer: false, videoPlayer: false, pdfViewer: false, imageGallery: true },
      { scenario: 'Need media playback with a shared slot contract across assets.', audioPlayer: true, videoPlayer: true, pdfViewer: true, imageGallery: true },
    ];
    const headers = [
      { label: 'Audio player', cls: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Video player', cls: 'text-violet-600 dark:text-violet-400' },
      { label: 'PDF viewer', cls: 'text-amber-600 dark:text-amber-400' },
      { label: 'Image gallery', cls: 'text-rose-600 dark:text-rose-400' },
    ];

    return html`
      <section class="bg-slate-100 dark:bg-slate-950 px-8 py-20 border-t border-slate-200 dark:border-slate-700">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Quick reference</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Plays audio or video content. Media sources provided via Source slot tags with fallback format support. Shared contract for both audio and video — swap the component tag to change the player style. Supports autoplay, loop, mute, poster thumbnail, and subtitle tracks. Implementations include video player, audio player, mini player, and media controls.
          </p>
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <th class="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-3/4">Scenario</th>
                  ${headers.map(
                    (h) => html`
                      <th class="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide ${h.cls}">${h.label}</th>
                    `,
                  )}
                </tr>
              </thead>
              <tbody>
                ${rows.map(
                  (row, i) => html`
                    <tr class="${i % 2 !== 0 ? 'bg-slate-50/60 dark:bg-slate-900/40' : ''} border-b border-slate-100 dark:border-slate-700/60 last:border-0">
                      <td class="px-5 py-3.5 text-slate-700 dark:text-slate-300">${row.scenario}</td>
                      ${([row.audioPlayer, row.videoPlayer, row.pdfViewer, row.imageGallery] as boolean[]).map(
                        (ok) => html`
                          <td class="px-4 py-3.5 text-center">
                            ${ok
                              ? html`<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>`
                              : html`<span class="text-slate-200 dark:text-slate-700 text-sm">—</span>`}
                          </td>
                        `,
                      )}
                    </tr>
                  `,
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
        ${this.renderHero()}
        ${this.renderShowcaseCards()}
        ${this.renderReferenceTable()}
      </div>
    `;
  }
}
