import test from 'ava';
import { getMonthsStartDatesUnix, addQueryParam } from '../lib';

const unixStartDates = {
  '01.03.2016': 1456786800,
  '01.04.2016': 1459461600,
  '01.05.2016': 1462053600
};

test('getMonthsStartDatesUnix() - works correct for normal range', t => {
  const date = new Date(2016, 2, 22);
  const days = 60;

  t.same(getMonthsStartDatesUnix(date, days), [
    unixStartDates['01.03.2016'],
    unixStartDates['01.04.2016'],
    unixStartDates['01.05.2016']
  ]);
});

test('getMonthsStartDatesUnix() - works correct for short range', t => {
  const date = new Date(2016, 2, 22);
  const days = 1;

  t.same(getMonthsStartDatesUnix(date, days), [
    unixStartDates['01.03.2016']
  ]);
});

test('addQueryParam() - adds param correctly to url without query params', t => {
  const url = 'http://google.com';
  const params = { hello: 'world' };

  t.is(addQueryParam(url, params), 'http://google.com?hello=world');
});

test('addQueryParam() - adds param correctly to url with query params', t => {
  const url = 'http://google.com?a=b';
  const params = { hello: 'world' };

  t.is(addQueryParam(url, params), 'http://google.com?a=b&hello=world');
});
