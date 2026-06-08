/// <mls fileReference="_102040_/l2/molecules/groupplaymedia/ml-audio-player.ts" enhancement="_102020_/l2/enhancementAura"/>
// =============================================================================
// AUDIO PLAYER MOLECULE
// =============================================================================
// Skill Group: groupPlayMedia
// This molecule does NOT contain business logic.
import { html, TemplateResult } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { MoleculeAuraElement } from '/_102033_/l2/moleculeBase.js';

/// **collab_i18n_start**
const message_en = {
play: 'Play',
pause: 'Pause',
replay: 'Replay',
mute: 'Mute',
unmute: 'Unmute',
loading: 'Loading audio...',
error: 'Unable to load audio.',
currentTime: 'Current time',
duration: 'Duration',
volume: 'Volume',
};
type MessageType = typeof message_en;
const messages: Record<string, MessageType> = {
en: message_en,
};
/// **collab_i18n_end**

@customElement('groupplaymedia--ml-audio-player')
export class AudioPlayerMolecule extends MoleculeAuraElement {
private msg: MessageType = messages.en;
// ==========================================================================
// SLOT TAGS
// ==========================================================================
slotTags = ['Label', 'Source', 'Track'];
// ==========================================================================
// PROPERTIES — From Contract
// ==========================================================================
@propertyDataSource({ type: String })
poster: string = '';

@propertyDataSource({ type: Boolean })
autoplay = false;

@propertyDataSource({ type: Boolean })
loop = false;

@propertyDataSource({ type: Boolean })
muted = false;

@propertyDataSource({ type: String })
preload: 'none' | 'metadata' | 'auto' = 'metadata';

@propertyDataSource({ type: Boolean })
disabled = false;

@propertyDataSource({ type: Boolean })
loading = false;

// ==========================================================================
// INTERNAL STATE
// ==========================================================================
@state()
private isPlaying = false;

@state()
private currentTime = 0;

@state()
private duration = 0;

@state()
private volume = 1;

@state()
private isMuted = false;

@state()
private isBuffering = false;

@state()
private errorMessage: string | null = null;

@query('audio')
private audioEl!: HTMLAudioElement;

// ==========================================================================
// LIFECYCLE
// ==========================================================================
firstUpdated() {
this.syncInitialState();
}

updated() {
if (this.audioEl) {
this.audioEl.loop = this.loop;
this.audioEl.autoplay = this.autoplay;
this.audioEl.muted = this.muted || this.isMuted;
this.audioEl.preload = this.preload;
}
}

// ==========================================================================
// PUBLIC CONTROL METHODS
// ==========================================================================
playMedia() {
if (this.disabled || !this.audioEl) return;
this.audioEl.play().catch((err) => this.handleMediaError(err));
}

pauseMedia() {
if (this.disabled || !this.audioEl) return;
this.audioEl.pause();
}

togglePlay() {
if (this.disabled) return;
if (this.isPlaying) {
this.pauseMedia();
return;
}
this.playMedia();
}

seekTo(time: number) {
if (this.disabled || !this.audioEl) return;
const nextTime = Math.max(0, Math.min(time, this.duration || 0));
this.audioEl.currentTime = nextTime;
}

setVolume(level: number) {
if (this.disabled || !this.audioEl) return;
const nextVolume = Math.max(0, Math.min(level, 1));
this.volume = nextVolume;
this.audioEl.volume = nextVolume;
if (nextVolume > 0 && this.isMuted) {
this.isMuted = false;
this.audioEl.muted = false;
}
}

toggleMute() {
if (this.disabled || !this.audioEl) return;
this.isMuted = !this.isMuted;
this.audioEl.muted = this.isMuted;
}

// ==========================================================================
// EVENT HANDLERS
// ==========================================================================
private handlePlay() {
this.isPlaying = true;
this.dispatchEvent(new CustomEvent('play', {
bubbles: true,
composed: true,
detail: {},
}));
}

private handlePause() {
this.isPlaying = false;
this.dispatchEvent(new CustomEvent('pause', {
bubbles: true,
composed: true,
detail: {},
}));
}

private handleEnded() {
this.isPlaying = false;
this.dispatchEvent(new CustomEvent('ended', {
bubbles: true,
composed: true,
detail: {},
}));
}

private handleTimeUpdate() {
if (!this.audioEl) return;
this.currentTime = this.audioEl.currentTime || 0;
this.duration = this.audioEl.duration || 0;
this.dispatchEvent(new CustomEvent('timeUpdate', {
bubbles: true,
composed: true,
detail: { currentTime: this.currentTime, duration: this.duration },
}));
}

private handleLoadedMetadata() {
if (!this.audioEl) return;
this.duration = this.audioEl.duration || 0;
this.volume = this.audioEl.volume || 1;
this.isMuted = this.audioEl.muted || this.muted;
}

private handleWaiting() {
this.isBuffering = true;
}

private handleCanPlay() {
this.isBuffering = false;
}

private handleMediaError(err?: unknown) {
this.errorMessage = this.msg.error;
if (err instanceof Error && err.message) {
this.errorMessage = err.message;
}
this.dispatchEvent(new CustomEvent('error', {
bubbles: true,
composed: true,
detail: { message: this.errorMessage || this.msg.error },
}));
}

private handleSeekInput(e: Event) {
const input = e.target as HTMLInputElement;
this.seekTo(parseFloat(input.value));
}

private handleVolumeInput(e: Event) {
const input = e.target as HTMLInputElement;
this.setVolume(parseFloat(input.value));
}

private handleKeyboard(e: KeyboardEvent) {
if (this.disabled || this.errorMessage) return;
if (e.code === 'Space') {
e.preventDefault();
this.togglePlay();
return;
}
if (e.code === 'ArrowLeft') {
e.preventDefault();
this.seekTo(this.currentTime - 5);
return;
}
if (e.code === 'ArrowRight') {
e.preventDefault();
this.seekTo(this.currentTime + 5);
return;
}
if (e.code === 'ArrowUp') {
e.preventDefault();
this.setVolume(this.volume + 0.05);
return;
}
if (e.code === 'ArrowDown') {
e.preventDefault();
this.setVolume(this.volume - 0.05);
}
}

// ==========================================================================
// HELPERS
// ==========================================================================
private syncInitialState() {
this.isMuted = this.muted;
if (this.audioEl) {
this.audioEl.loop = this.loop;
this.audioEl.autoplay = this.autoplay;
this.audioEl.preload = this.preload;
this.audioEl.muted = this.muted;
}
}

private getLabelText(): string {
const labelContent = this.getSlotContent('Label');
if (!labelContent) return 'Audio player';
const temp = document.createElement('div');
temp.innerHTML = labelContent;
return temp.textContent?.trim() || 'Audio player';
}

private formatTime(totalSeconds: number): string {
if (!totalSeconds || Number.isNaN(totalSeconds)) return '0:00';
const minutes = Math.floor(totalSeconds / 60);
const seconds = Math.floor(totalSeconds % 60);
return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

private getButtonClasses(): string {
return [
'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium border transition',
'bg-white dark:bg-slate-800',
'border-slate-200 dark:border-slate-700',
'text-slate-900 dark:text-slate-100',
'hover:bg-slate-50 dark:hover:bg-slate-700',
'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
(this.disabled || this.errorMessage) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
].filter(Boolean).join(' ');
}

private getRangeClasses(): string {
return [
'w-full h-2 rounded-lg appearance-none cursor-pointer',
'bg-slate-200 dark:bg-slate-700',
'focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400',
(this.disabled || this.errorMessage) ? 'opacity-50 cursor-not-allowed' : '',
].filter(Boolean).join(' ');
}

// ==========================================================================
// RENDER
// ==========================================================================
render(): TemplateResult {
const lang = this.getMessageKey(messages);
this.msg = messages[lang];

const sources = this.getSlots('Source').map((el) => ({
src: el.getAttribute('src') || '',
type: el.getAttribute('type') || '',
}));
const tracks = this.getSlots('Track').map((el) => ({
src: el.getAttribute('src') || '',
kind: el.getAttribute('kind') || 'subtitles',
lang: el.getAttribute('lang') || '',
label: el.getAttribute('label') || '',
}));

const labelContent = this.getSlotContent('Label');
const isLoading = this.loading || this.isBuffering;

return html`
<div
class=${[
'w-full rounded-xl border p-4 space-y-3',
'bg-white dark:bg-slate-800',
'border-slate-200 dark:border-slate-700',
(this.disabled || this.errorMessage) ? 'opacity-70' : '',
].filter(Boolean).join(' ')}
role="group"
aria-label=${this.getLabelText()}
@keydown=${this.handleKeyboard}
>
${labelContent
? html`<div class="text-sm font-medium text-slate-900 dark:text-slate-100">${unsafeHTML(labelContent)}</div>`
: html``}

<div class="relative">
${isLoading
? html`<div class="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80 dark:bg-slate-900/70 text-slate-600 dark:text-slate-300 text-sm">${this.msg.loading}</div>`
: html``}

${this.errorMessage
? html`<div class="rounded-lg border border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/30 px-3 py-2 text-sm text-red-600 dark:text-red-400">${this.errorMessage}</div>`
: html`<audio
@play=${this.handlePlay}
@pause=${this.handlePause}
@ended=${this.handleEnded}
@timeupdate=${this.handleTimeUpdate}
@loadedmetadata=${this.handleLoadedMetadata}
@waiting=${this.handleWaiting}
@canplay=${this.handleCanPlay}
@error=${() => this.handleMediaError()}
?muted=${this.muted || this.isMuted}
?autoplay=${this.autoplay}
?loop=${this.loop}
preload=${this.preload}
>
${sources.map((source) => html`<source src=${source.src} type=${source.type} />`)}
${tracks.map((track) => html`<track src=${track.src} kind=${track.kind} srclang=${track.lang} label=${track.label} />`)}
</audio>`}
</div>

${this.errorMessage
? html``
: html`
<div class="flex flex-wrap items-center gap-3">
<button
class=${this.getButtonClasses()}
@click=${this.togglePlay}
?disabled=${this.disabled}
aria-label=${this.isPlaying ? this.msg.pause : this.msg.play}
>
${this.isPlaying ? this.msg.pause : this.msg.play}
</button>

<button
class=${this.getButtonClasses()}
@click=${this.toggleMute}
?disabled=${this.disabled}
aria-label=${this.isMuted ? this.msg.unmute : this.msg.mute}
>
${this.isMuted ? this.msg.unmute : this.msg.mute}
</button>

<div class="flex-1 min-w-[180px]">
<input
class=${this.getRangeClasses()}
type="range"
min="0"
max=${this.duration || 0}
step="0.1"
.value=${String(this.currentTime)}
@input=${this.handleSeekInput}
role="slider"
aria-label=${this.msg.currentTime}
aria-valuemin="0"
aria-valuemax=${String(this.duration || 0)}
aria-valuenow=${String(this.currentTime)}
?disabled=${this.disabled}
/>
</div>

<div class="text-xs text-slate-600 dark:text-slate-400 min-w-[90px] text-right">
${this.formatTime(this.currentTime)} / ${this.formatTime(this.duration)}
</div>
</div>

<div class="flex items-center gap-3">
<span class="text-xs text-slate-600 dark:text-slate-400">${this.msg.volume}</span>
<input
class=${this.getRangeClasses()}
type="range"
min="0"
max="1"
step="0.01"
.value=${String(this.volume)}
@input=${this.handleVolumeInput}
role="slider"
aria-label=${this.msg.volume}
aria-valuemin="0"
aria-valuemax="1"
aria-valuenow=${String(this.volume)}
?disabled=${this.disabled}
/>
</div>
`}
</div>
`;
}
}
