/// <mls fileReference="_102040_/l2/molecules/groupviewdata/calendarViewLogic.ts" enhancement="_blank"/>

// Pure rules of ml-calendar-view: where an event falls and what its chip says. No DOM, no Lit.
//
// Until 08/10/2026 the calendar found an event by searching every cell's text for `YYYY-MM-DD`, an undocumented
// convention: pages that showed the date the way a person reads it (`07/10/2026 17:00`, or only `17:00`) got an
// empty calendar and nothing to click (agendaClinica, consultas and agenda_diaria). The moment now comes from the
// Row's `date` attribute; the old text search stays only for rows without it.

/** The calendar day (local `YYYY-MM-DD`) and, when the value has a time, the local hour of an event. */
export interface CalendarMoment { day: string; hour?: number }

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/u;
const DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?$/u;

/** `YYYY-MM-DD` of a date in the local time zone, the one the calendar grid is drawn in. */
export function localDay(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * The moment of a Row `date` attribute: an ISO 8601 date (`2026-10-07`, an all-day event, no hour) or date-time
 * (`2026-10-07T20:00:00.000Z`, placed on the local day and hour of that instant). Null when absent or unreadable.
 */
export function parseCalendarMoment(value: string | null | undefined): CalendarMoment | null {
  const text = (value ?? '').trim();
  if (!text) return null;
  const dateOnly = DATE_ONLY.exec(text);
  if (dateOnly) {
    const date = new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
    return date.getMonth() === Number(dateOnly[2]) - 1 ? { day: localDay(date) } : null;
  }
  // ISO 8601 only: `new Date('07/10/2026 17:00')` parses too, as July 10 (US order), and would misplace the event.
  if (!DATE_TIME.test(text)) return null;
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return null;
  return { day: localDay(date), hour: date.getHours() };
}

/** The chip text: the Row `title` attribute, else the visible text of its cells joined by ` · `. */
export function calendarEventTitle(title: string | null | undefined, cellTexts: readonly string[]): string {
  const explicit = (title ?? '').trim();
  if (explicit) return explicit;
  return cellTexts.map(text => text.replace(/\s+/gu, ' ').trim()).filter(Boolean).join(' · ');
}
