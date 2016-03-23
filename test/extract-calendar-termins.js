import test from 'ava';
import { parseAvailableTerminsForMonth } from '../index';

test('extract available termins - no termins available', async t => {
  const requestUrl = 'http://localhost:8000/termin-calendar-page.htm';

  const result = await parseAvailableTerminsForMonth(requestUrl);
  const expected = [];

  t.same(result, expected);
});

test('extract available termins - with termins available', async t => {
  const requestUrl = 'http://localhost:8000/termin-calendar-page--with-termin.htm';

  const result = await parseAvailableTerminsForMonth(requestUrl);
  const expected = [{ text: '1', url: 'javascript:void(0)' }];

  t.same(result, expected);
});
