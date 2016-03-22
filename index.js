'use strict';

/*eslint-disable no-console*/

import path from 'path';
import { exec } from 'child_process';
import co from 'co';
import jsdom from 'jsdom';
import moment from 'moment';
import debug from 'debug';

import { getMonthsStartDatesUnix, addQueryParam } from './lib';

import notifier from 'node-notifier';

const urlsDebug = debug('urls');

// entry point
const TERMIN_BOOKING_URL = 'https://service.berlin.de/dienstleistung/120686/';

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
        }

        resolve(extractor(window.document));
      }
    });
  }).catch(errorHandler);
}

// extract url from booking button
export function getTerminUrl(terminBookingUrl) {
  return co(function *() {
    return yield query(terminBookingUrl, terminUrlExtractor);
  }).catch(errorHandler);
}

/**
 * Get available termins
 * @param  {string} url                 Termin Calendar Page url
 * @return {Promise<url|undefined>}     Promise that will be resolved with termin
 *                                      calendar page url that is available for booking
 */
function getAvailableTermins(terminCalendarUrl) {
  // months to check
  const unixDates = getMonthsStartDatesUnix(new Date(), 60);

  return co(function *() {
    for (const unixDate of unixDates) {
      const url = addQueryParam(terminCalendarUrl, { Datum: unixDate });
      const termins = yield query(url, getAvailableTerminsForMonth);
      const terminsCount = termins.length;

      console.log(`${moment().format('DD.MM.YYYY HH:mm')} - ${moment.unix(unixDate).format('MMM')} - ${terminsCount} termins available`);
      urlsDebug(`Termin check url: ${url}`);

      if (terminsCount !== 0) {
        console.log(`Something available. Check whole calendar: ${url}`);

        // output results
        console.log('-'.repeat(20));
        for (const termin of termins) {
          console.log(`${termin.text}th:\n${termin.url}\n\n`);
        }

        return url;
      }
    }
  }).catch(errorHandler);
}

// extract available termins for the month
// [{ label: string, url: string }] available labels and url to follow
export function getAvailableTerminsForMonth(url) {
  return co(function *() {
    return yield query(url, availableCalendarTerminsExtractor);
  }).catch(errorHandler);
}

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

function notify(url) {
  notifier.notify({
    title: 'Appointment booking possibility',
    message: 'click to open url',
    open: url,
    icon: path.resolve('./buro.png'),
    contentImage: false,
    sound: 'Ping',
    wait: true
  }).on('click', () => {
    exec(`open ${url}`);
  });
}

export function check(terminBookingUrl = TERMIN_BOOKING_URL) {
  co(function *() {
    const terminCalendarUrl = yield getTerminUrl(terminBookingUrl);
    const availableToBookUrl = yield getAvailableTermins(terminCalendarUrl);

    if (availableToBookUrl) {
      notify(availableToBookUrl);
    }
  }).catch(errorHandler);
}
