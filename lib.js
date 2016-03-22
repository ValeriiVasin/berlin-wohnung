import moment from 'moment';
import qs from 'querystring';

/**
 * Get unix timestamps for the beginning of months that are in range [today, today + days]
 * @param  {number} [days=60]  Period duration
 * @return {number[]}          Array of unix timestamps (seconds since 1970)
 */
export function getMonthsStartDatesUnix(date, days) {
  const startDate = moment(date);
  const endDate = startDate.clone().add({ days });
  const results = [];

  // reset
  startDate.startOf('month');
  while (startDate <= endDate) {
    results.push(startDate.unix(Number));
    startDate.add({ month: 1 });
  }

  return results;
}

export function addQueryParam(url, query) {
  const searchStartIndex = url.indexOf('?');

  // no query
  if (searchStartIndex === -1) {
    return `${url}?${qs.stringify(query)}`;
  }

  const urlQuery = qs.parse(url.slice(searchStartIndex + 1));
  const resultQuery = Object.assign({}, urlQuery, query);

  return `${url.slice(0, searchStartIndex + 1)}${qs.stringify(resultQuery)}`;
};
