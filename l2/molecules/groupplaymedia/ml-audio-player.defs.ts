/// <mls fileReference="_102040_/l2/molecules/groupplaymedia/ml-audio-player.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupPlayMedia';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {};

export const skill = `# Metadata
- TagName: groupplaymedia--ml-audio-player

# Objective
Provide an audio player that enables users to play, pause, seek, adjust volume, and mute media. It manages the playback lifecycle, surfaces timing information, and adheres to the groupPlayMedia contract for events, accessibility, error handling, and content sourcing.

# Responsibilities
- Accept one or more audio sources with associated types through designated source content areas, using them in fallback order.
- Respect autoplay, loop, and muted settings to determine initial playback behavior.
- Toggle between playing and paused states when the user activates the corresponding control.
- Provide a seek control that reflects the current playback position and total duration, and allows the user to change position within the media timeline.
- Display the current playback time and total duration.
- Provide a volume control that adjusts output across the full range from silent to maximum.
- Provide a mute toggle that silences and restores audio output.
- Emit a play event with empty detail that propagates when playback starts.
- Emit a pause event with empty detail that propagates when playback stops.
- Emit an ended event with empty detail that propagates when playback reaches the end.
- Emit timeUpdate events that include the current time and total duration whenever the playback position changes.
- Disable all controls and prevent playback manipulation through the interface when in a disabled state.
- Enter a buffering state and display a loading indicator while media is loading.
- Enter an error state and emit an error event containing a message when media playback fails.
- Use provided label content as the accessible name for the player.
- Support keyboard controls for toggling play/pause, seeking backward and forward, and increasing or decreasing volume.
- Restrict content areas to Label, Source, and Track as defined by the group contract.

# Constraints
- Controls must remain non-interactive and playback must not be controllable via the interface while disabled.
- Only Label, Source, and Track content areas may be accepted; no additional content areas are permitted.
- Volume must remain within the valid range from silent to maximum.
- Events must carry the specified detail structure and must propagate according to the group contract.
- Playback must not start automatically unless the autoplay setting is active.
- Error states must suppress standard playback controls and present error information.

# Notes
- Intended for corporate use cases including training podcasts, call recordings, legal depositions, candidate interviews, and internal voice communications.
- Time values must reflect the actual media timeline and update as the user seeks or playback progresses.`;

