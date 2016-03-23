import test from 'ava';
import { availableTerminsCount } from '../index';

test('available termins count', t => {
  const availableTermins = [
    { termins: [null, null] },
    { termins: [null, null, null] },
    { termins: [] }
  ];

  t.is(availableTerminsCount(availableTermins), 5);
});
