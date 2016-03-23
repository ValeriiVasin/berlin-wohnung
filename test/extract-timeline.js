import test from 'ava';
import { getTimeTable } from '../index';

test('timetableExtractor() - Extracts time/place correctly', async t => {
  const PAGE_URL = 'http://localhost:8000/termin_available.htm';
  const result = await getTimeTable(PAGE_URL);

  t.is(result.length, 8);
  t.same(result[3], {
    time: '14:00',
    title: 'Bürgeramt Karow / Buch, Pankow',
    address: 'Franz-Schmidt-Str. 8 - 10, 13125 Berlin'
  });
});
