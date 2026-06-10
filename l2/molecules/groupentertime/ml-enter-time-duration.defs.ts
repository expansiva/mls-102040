/// <mls fileReference="_102040_/l2/molecules/groupentertime/ml-enter-time-duration.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterTime';
export const skill = `# Metadata
- TagName: groupentertime--ml-enter-time-duration

# Objective
Enable entry and display of time duration in hours and minutes, optionally including seconds, ensuring values conform to valid ranges, boundary limits, and formatting rules. It communicates all changes exclusively through a standardized string-based value contract.

# Responsibilities
- Accept and retain a time value as a formatted string or null when no value is present.
- Automatically format user entries to preserve the correct time structure during editing.
- Validate each time unit independently, permitting hours from 00 to 23, minutes from 00 to 59, and seconds from 00 to 59 when enabled.
- Enforce minimum and maximum time boundaries, preventing confirmation or retention of values outside the permitted range.
- Allow incremental adjustment of individual time units during editing, respecting the configured step interval for minutes.
- Present the value as static text when editing is inactive, showing a formatted representation or a clear empty indicator.
- Communicate confirmed changes using only a payload containing the formatted time string or null.
- Signal when the element becomes active and when it becomes inactive.
- Indicate an invalid state and display the associated message when an error condition exists; otherwise, present auxiliary guidance when available.
- Display a label when label content is provided.
- Prevent modification and interaction when disabled or restricted to read-only.
- Indicate when data is being loaded.

# Constraints
- Must not emit any payload containing total seconds, numeric timestamps, or unformatted values.
- Must not permit values that exceed unit limits or violate configured boundaries.
- Must completely omit the seconds unit when seconds are disabled, and must not store or communicate values containing seconds in that configuration.
- Must not allow incremental adjustment of time units when editing is inactive, disabled, or restricted.
- Must not present editing affordances, guidance text, or error messages when in non-editing display mode.
- Must suppress change communication when in non-editing display mode.
- Minute values and adjustments must align with the configured step; unsupported intermediate values must be rejected or normalized.

# Notes
- The empty state must be immediately recognizable and distinct from a zero value.
- Error messages take precedence over auxiliary guidance text.
- Time values must follow 24-hour conventions.`;

