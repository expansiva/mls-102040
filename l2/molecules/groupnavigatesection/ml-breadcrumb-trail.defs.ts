/// <mls fileReference="_102040_/l2/molecules/groupnavigatesection/ml-breadcrumb-trail.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupNavigateSection';
export const skill = `# Metadata
- TagName: groupnavigatesection--ml-breadcrumb-trail

# Objective
Display a hierarchical navigation trail that indicates the user's current position within a nested structure. It enables users to understand the path taken to reach the current level and to navigate back to any previous interactive level.

# Responsibilities
- Consist of an overall descriptive label and a series of hierarchical navigation levels presented in a single horizontal sequence with visual delimiters between consecutive levels.
- Display each level with a visible text label and an optional icon.
- Distinguish each level by an identity that is communicated upon selection.
- Maintain an active state that identifies the currently selected level; if no level is externally designated as active, the first interactive level must be treated as active by default.
- Allow users to select any interactive level, which updates the active state and communicates the selected level's identity and label to the system.
- Render the final level as plain text without a selection action, making it non-interactive by default.
- Support non-interactive states for any level, preventing selection and suppressing hover or focus indications.
- Show only the content associated with the active level while hiding content from all other levels.
- Display a loading indicator and suppress all interactions when in a loading state.
- Block all selection interactions when the component is in a disabled state.
- On small viewports, collapse intermediate levels into an overflow control represented by "..."; opening this control must reveal hidden levels and permit selection, updating the active state accordingly.
- Display an error message below the navigation trail when an error state is provided.

# Constraints
- The default visual delimiter between levels must be the "/" character.
- Non-interactive levels must appear visually inactive and must not respond to selection attempts.
- The overflow control must align with the collapsed position and must be non-interactive when the component is disabled or loading.
- The component must remain on a single horizontal line without wrapping.
- All visual states—including active, inactive, non-interactive, hover, focus, and error—must adapt to dark mode using the system's semantic color pairs.
- The trail must maintain compact spacing and prioritize clarity of the hierarchical path.

# Notes
- The overflow behavior is triggered specifically by limited horizontal space.
- The error message is independent of the navigation levels and appears only when explicitly provided.`;

