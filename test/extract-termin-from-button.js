import test from 'ava';
import { getTerminUrl, getAvailableTerminsForMonth } from '../index';

test('extract termin url from button', async t => {
  const requestUrl = 'http://localhost:8000/termin-button-page.htm';
  const result = await getTerminUrl(requestUrl);
  const expected = 'https://service.berlin.de/terminvereinbarung/termin/tag.php?termin=1&anliegen[]=120686&dienstleisterlist=327316,327312,327314,327346,122238,327348,122252,327338,122260,327340,122262,122254,327278,327274,327276,327294,327290,327292,122291,327270,122285,327266,122286,327264,122296,327268,150230,327282,327286,327284,122312,122314,122304,327330,122311,327334,122309,327332,317869,324433,325341,324434,327352,324414,122283,327354,122276,327324,122274,327326,122267,327328,327318,327320,327322,122208,327298,122226,327300&herkunft=http%3A%2F%2Fservice.berlin.de%2Fdienstleistung%2F120686%2F';

  t.is(result, expected);
});

test('extract available termins - no termins available', async t => {
  const requestUrl = 'http://localhost:8000/termin-calendar-page.htm';

  const result = await getAvailableTerminsForMonth(requestUrl);
  const expected = [];

  t.same(result, expected);
});

test('extract available termins - with termins available', async t => {
  const requestUrl = 'http://localhost:8000/termin-calendar-page--with-termin.htm';

  const result = await getAvailableTerminsForMonth(requestUrl);
  const expected = [{ text: '1', url: 'javascript:void(0)' }];

  t.same(result, expected);
});
