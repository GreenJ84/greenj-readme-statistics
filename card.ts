import { DateTime } from 'luxon';
import { createIntl, createIntlCache } from '@formatjs/intl';

/**
 * Convert date from Y-M-D to more human-readable format
 * @param string $dateString String in Y-M-D format
 * @param string|null $format Date format to use, or null to use locale default
 * @param string $locale Locale code
 * @return string Formatted Date string
 */
function getFormatDate(dateString: string, format: string | null, locale: string): string {
  const date = DateTime.fromISO(dateString);
  let formatted = '';

  const cache = createIntlCache()
  const dateConfig = createIntl(
    {
      locale: locale,
      timeZone: "UTC",
      defaultLocale: 'en-US',
      messages: {},
      formats: {},
      defaultFormats: {},
      onError: (err) => {console.log(err) },
      onWarn: (warning) => { console.log(warning)}
    },
    cache
  )

  // if current year, display only month and day
  if (date.toFormat('yyyy') === DateTime.now().toFormat('yyyy')) {
    if (format) {
      // remove brackets and all text within them
      formatted = date.toFormat(format.replace(/\[.*?\]/g, ''));
    } else {
      // format without year using locale
      formatted = dateConfig.formatDate(date.toISODate(), { month: 'short', day: 'numeric' });
    }
  }
  // otherwise, display month, day, and year
  else {
    if (format) {
      // remove brackets, but leave text within them
      formatted = date.toFormat(format.replace(/[\[\]]/g, ''));
    } else {
      // format with year using locale
      formatted = dateConfig.formatDate(date.toISODate(), { year: 'numeric', month: 'short', day: 'numeric' });
    }
  }
  // sanitize and return formatted date
  return formatted.replace(/[<>"&]/g, (match) => {
    if (match == '<') { return '&lt;' }
    else if (match == '>') { return '&gt;' }
    else if (match == '"') { return '&quot;' }
    else if (match == '&') { return '&amp;' }
    else return ""
  });
}
// console.log(getFormatDate('1990-07-16', null, "en-US" ))
// console.log(getFormatDate('1997-08-04', null, "fr-FR"))
// console.log(getFormatDate('2023-10-22', null, "es-MX"))
// console.log(getFormatDate('2020-01-10', null, "en-AU"))