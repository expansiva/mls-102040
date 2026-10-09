/// <mls fileReference="_102040_/l2/molecules/groupviewdata/calendarViewLogic.test.ts" enhancement="_blank"/>

import assert from 'node:assert/strict';
import test from 'node:test';
import { calendarEventTitle, localDay, parseCalendarMoment } from '/_102040_/l2/molecules/groupviewdata/calendarViewLogic.js';

// agendaClinica (08/10/2026): the pages wrote `07/10/2026 17:00` and `17:00` in the cells, the calendar searched
// them for `2026-10-07`, found nothing, and drew no event to click. The Row `date` attribute now says when.
test('a date-only value is an all-day event on that day, with no hour', () => {
  assert.deepEqual(parseCalendarMoment('2026-10-07'), { day: '2026-10-07' });
  assert.deepEqual(parseCalendarMoment(' 2026-02-28 '), { day: '2026-02-28' });
});

test('a date-time is placed on the local day and hour of that instant', () => {
  assert.deepEqual(parseCalendarMoment('2026-10-07T17:30:00'), { day: '2026-10-07', hour: 17 });
  const utc = '2026-10-07T20:00:00.000Z';
  const local = new Date(utc);
  assert.deepEqual(parseCalendarMoment(utc), { day: localDay(local), hour: local.getHours() });
});

test('no date, or one that is not a date, is no moment (the row falls back to the text search)', () => {
  for (const value of [null, undefined, '', '   ', '07/10/2026 17:00', '2026-02-30', 'tomorrow']) {
    assert.equal(parseCalendarMoment(value), null, String(value));
  }
});

test('the chip says the Row title, else the text of its cells', () => {
  assert.equal(calendarEventTitle('Lucas Bica — 17:00', ['17:00', 'Lucas Bica']), 'Lucas Bica — 17:00');
  assert.equal(calendarEventTitle(null, ['  17:00 ', 'Lucas\n   Bica', '', 'Agendada']), '17:00 · Lucas Bica · Agendada');
  assert.equal(calendarEventTitle('', []), '');
});
