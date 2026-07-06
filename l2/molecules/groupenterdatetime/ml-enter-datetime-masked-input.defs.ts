/// <mls fileReference="_102040_/l2/molecules/groupenterdatetime/ml-enter-datetime-masked-input.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupEnterDatetime';

// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  dateInput: "masked",
  labelPlacement: "top",
  validation: "inline-below",
  requiredMark: "asterisk"
};

export const skill = `# Metadata
- TagName: groupenterdatetime--ml-enter-datetime-masked-input

# Objective
Allow the user to type a date and time directly into a masked text field. As the user types, the component formats the raw digits into a locale-appropriate date/time pattern (e.g. MM/DD/YYYY HH:MM for en-US, DD/MM/AAAA HH:MM for pt, TT.MM.JJJJ HH:MM for de). When focus leaves the field or Enter is pressed, the typed value is parsed and committed as an ISO datetime string if it is valid; otherwise the field reverts to the last committed value. The component supports min/max datetime bounds, configurable minute step, timezone-aware display, and disabled, readonly, required, loading, and error states.

# Responsibilities
- Render a text input field with a calendar icon decoration on the right.
- Apply a live mask to the raw typed characters, formatting them into the locale-appropriate date/time pattern as the user types.
- Derive the correct date segment order (M/D/Y vs D/M/Y), date separator (/ vs .), and 12/24-hour mode from the configured locale.
- Commit the typed value on blur or when Enter is pressed, converting the masked text to an ISO datetime string (YYYY-MM-DDTHH:MM:00).
- Revert the input display to the last valid committed value when the typed text cannot be parsed into a valid datetime.
- Emit a "change" custom event with the ISO datetime string when a valid value is committed.
- Emit a "change" event with null when the field is cleared to empty and committed.
- Emit "focus" and "blur" custom events when the input gains or loses focus.
- Validate that the parsed datetime satisfies the minDatetime and maxDatetime bounds before committing.
- Validate that the minute component is a multiple of minuteStep before committing.
- Validate that the date components represent a real calendar date (year 1000–9999, valid month and day for that month).
- Synchronise the displayed input value when the "value", "locale", or "timezone" properties change externally.
- Format the displayed value using Intl.DateTimeFormat with the configured locale and timezone for correct presentation.
- Render in view-only mode (static formatted text) when "is-editing" is false.
- Show a label slot above the input and a helper/error slot below.
- Show a required indicator next to the label when "required" is true.
- Show an error message and apply error border styling when "error" is non-empty.
- Show an animated loading spinner in place of the calendar icon and prevent input when "loading" is true.
- Apply disabled styling and block all input interaction when "disabled" is true.
- Apply readonly styling and block text entry when "readonly" is true.

# Constraints
- The mask must only accept digit characters; all non-digit input is stripped before formatting.
- A value must not be committed unless all 12 required digit positions (two each for day, month, four-digit year, hour, minute) are present and form a valid datetime.
- If the typed text is empty, committing must store null and emit "change" with null.
- If the typed text is non-empty but invalid, committing must silently revert the field to the last committed display value without emitting "change".
- The minute value must be a multiple of minuteStep; a datetime with a non-conforming minute must be rejected.
- The parsed datetime must fall within the minDatetime–maxDatetime range; out-of-range values must be rejected.
- Interaction (typing, focus, blur) must be blocked when disabled or loading.
- Readonly state must render the current value but prevent text modification.`;
