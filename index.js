'use strict';

/*eslint-disable no-console*/

import path from 'path';
import co from 'co';
import jsdom from 'jsdom';
import moment from 'moment';
import debug from 'debug';

import { getMonthsStartDatesUnix, addQueryParam } from './lib';

import notifier from 'node-notifier';

const urlsDebug = debug('urls');

// entry point
const TERMIN_BOOKING_URL = 'https://service.berlin.de/dienstleistung/120686/';

/**
 * Termin = {
 *   url: string,
 *   text: string
 * };
 *
 * AvailableTermin = {
 *  // start of month date - moment.js object
 *  momentDate: object,
 *
 *  // month url
 * 	url: string,
 * 	termins: Termin[]
 * };
 *
 * // termin extracted from timetable
 * TimeTableTermin = {
 *   time: string,
 *   title: string,
 *   address: string,
 *   url: string
 * };
 */

function errorHandler(err) {
  console.error(`[ERROR] ${err}`);
}

/**
 * Extract some data from the url
 * @param  {string}   url       Url to extract data from
 * @param  {function} extractor Extractor function - (document) => data
 * @return {Promise}           [description]
 */
function query(url, extractor) {
  return new Promise((resolve, reject) => {
    jsdom.env({
      url,
      done: (err, window) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(extractor(window.document));
      }
    });
  }).catch(errorHandler);
}

function log(message) {
  const time = moment().format('DD.MM.YYYY HH:mm');

  console.log(`[${time}] ${message}`);
}

// extract url from booking button
export function parseTerminUrl(terminBookingUrl) {
  return co(function *() {
    return yield query(terminBookingUrl, terminUrlExtractor);
  }).catch(errorHandler);
}

/**
 * Get available termins
 * @param  {string} url                   Termin Calendar Page url
 * @return {Promise<AvailableTermin[]>}  Promise that will be resolved with termin
 *                                        calendar page url that is available for booking
 */
function parseAvailableTermins(terminCalendarUrl) {
  // months to check
  const unixDates = getMonthsStartDatesUnix(new Date(), 60);
  const requests = unixDates.map(unixDate => ({
    momentDate: moment.unix(unixDate),
    url: addQueryParam(terminCalendarUrl, { Datum: unixDate })
  }));

  return co(function *() {
    const responses = yield Promise.all(
      requests.map(request => parseAvailableTerminsForMonth(request.url))
    );

    // merge termins back
    return responses.map((termins, index) => {
      return Object.assign({}, requests[index], { termins });
    });
  }).catch(errorHandler);
}

// extract available termins for the month
// [{ label: string, url: string }] available labels and url to follow
export function parseAvailableTerminsForMonth(url) {
  return co(function *() {
    return yield query(url, availableCalendarTerminsExtractor);
  }).catch(errorHandler);
}

// Extractors
function availableCalendarTerminsExtractor(document) {
  const TERMIN_LINKS_SELECTOR = '.calendar-month-table:nth-child(1) td a';
  const links = document.querySelectorAll(TERMIN_LINKS_SELECTOR);

  return Array.from(links).map(link => {
    return { url: link.href, text: link.textContent.trim() };
  });
}

function terminUrlExtractor(document) {
  const TERMIN_BUTTON_SELECTOR = 'a.btn[href^="https://service.berlin.de/terminvereinbarung/termin/tag.php"]';
  const link = document.querySelector(TERMIN_BUTTON_SELECTOR);

  return link && link.href;
}

export function getTimeTable(url) {
  return co(function *() {
    return yield query(url, timetableExtractor);
  }).catch(errorHandler);
}

function timetableExtractor(document) {
  const TIMETABLE_ROW_SELECTOR = '.timetable table tr';
  const TIME_SELECTOR = 'th.buchbar';
  const PLACE_SELECTOR = 'td.frei a';

  return Array.from(document.querySelectorAll(TIMETABLE_ROW_SELECTOR))
    .map(row => {
      const time = row.querySelector(TIME_SELECTOR).textContent.trim();
      const placeLink = row.querySelector(PLACE_SELECTOR);

      const title = placeLink.textContent.trim();
      const linkTitle = placeLink.getAttribute('title').trim();
      const url = placeLink.href;

      // get everything after "Adresse: "
      const address = linkTitle.replace(/.*Adresse\:\s*/, '');

      return { time, title, address, url };
    });
}

function notify(count) {
  notifier.notify({
    message: `Appointments available: ${count}`,
    icon: path.resolve('./buro.png'),
    contentImage: false,
    sound: 'Ping',
    wait: true
  });
}

export function availableTerminsCount(availableTermins) {
  return availableTermins.reduce((acc, availableTermin) => {
    return acc + availableTermin.termins.length;
  }, 0);
}

function printAvailableTerminsInfo(availableTermins) {
  availableTermins.forEach(({ momentDate, url, termins }) => {
    log(`${momentDate.format('MMMM')} / ${termins.length} termins available.`);
    urlsDebug(`Termin check url: ${url}`);

    if (termins.length === 0) {
      return;
    }

    log(`${'-'.repeat(10)} Available termins info: ${'-'.repeat(10)}`);
    log(`Calendar page: ${url}`);
    // print termins dates with links
    termins.forEach(termin => log(`${termin.text}th:\n${termin.url}\n\n`));
    log(`${'-'.repeat(30)}`);
  });
}

export function check(terminBookingUrl = TERMIN_BOOKING_URL) {
  return co(function *() {
    const terminCalendarUrl = yield parseTerminUrl(terminBookingUrl);
    const availableTermins = yield parseAvailableTermins(terminCalendarUrl);

    printAvailableTerminsInfo(availableTermins);
    if (availableTerminsCount(availableTermins) !== 0) {
      notify(availableTerminsCount(availableTermins));
    }
  }).catch(errorHandler);
}
