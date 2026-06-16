/// <mls fileReference="_102040_/l2/molecules/groupplaymedia/ml-video-player.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupPlayMedia';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {};

export const skill = `# Metadata
- TagName: groupplaymedia--ml-video-player

# Objective
Provide a fully accessible video player that renders a native HTML video element from declarative Source and Track slots and exposes custom playback controls for play/pause, seeking, volume, mute, captions, and fullscreen. The component tracks playback state internally and dispatches events on play, pause, end, and time update.

# Responsibilities
- Render a native <video> element populated with <source> elements from Source slots and <track> elements from Track slots.
- Display a poster image when the poster property is set.
- Support autoplay, loop, muted, and preload attributes passed through to the native video element.
- Show play, pause, and replay button labels according to the current playback state (playing, paused, ended).
- Render a seek range input that reflects currentTime and allows the user to scrub to any position within the video duration.
- Display the current time and total duration in mm:ss format next to the seek bar.
- Render a mute/unmute toggle button and a volume range input for audio level control; muting via the volume slider (reaching 0) must also set the muted state.
- Show a captions toggle button only when Track slots are present; toggling it enables or disables all text tracks on the video element.
- Render a fullscreen button that calls requestFullscreen on the video element.
- Track and expose isPlaying, currentTime, duration, volume, isMuted, and hasEnded as reactive internal state.
- Dispatch play, pause, ended, timeUpdate, and error custom events (bubbling, composed) in response to the corresponding native media events.
- Expose public methods: playMedia, pauseMedia, togglePlay, seekTo, setVolume, toggleMute, enterFullscreen, toggleCaptions.
- Allow keyboard shortcuts on the player container: Space toggles play/pause; ArrowLeft seeks back 5 seconds; ArrowRight seeks forward 5 seconds; ArrowUp increases volume by 0.05; ArrowDown decreases volume by 0.05.
- Display a loading placeholder when the loading property is true.
- Show a no-source error message when no Source slots with a src attribute are provided.
- Render an optional Label slot as a caption above the player.
- Support light and dark color schemes through conditional class application.

# Constraints
- All playback controls and keyboard shortcuts must be blocked when disabled or loading is true.
- Seek position must be clamped to the range [0, duration].
- Volume must be clamped to the range [0, 1].
- The captions button must not appear when no Track slots are present.
- The component must not contain business logic; it only manages playback UI state.
- Source and Track data are read from slot attributes (src, type, kind, lang, label) and must not alter the slot elements.`;
