import { DateTime } from 'luxon';
import { createIntl, createIntlCache } from '@formatjs/intl';

import { COLORS } from './colors';
import { THEMES, THEMETYPE } from './themes';
import { LANGUAGES } from './translations';

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

/**
 * Normalize a theme name
 * @param theme Theme name
 * @return Normalized theme name
 */
function normalizeThemeName(theme: string): string {
  // Convert to lower and ensure kebab case
  return theme.toLowerCase().replace("_", "-");
}

/**
 * Check theme and color customization parameters to generate a theme mapping
 * @param params Request parameters
 * @return The chosen theme or default
 */
function getRequestedTheme(params: Record<string, string>): THEMETYPE {
  // normalize theme name
  const selectedTheme = normalizeThemeName(params["theme"] ?? "default");
  // get theme colors, or default colors if theme not found
  const theme: THEMETYPE = selectedTheme !== undefined && selectedTheme in THEMES ? THEMES[selectedTheme]! : THEMES["default"]!;

  // personal theme customizations
  const properties = Object.keys(theme);
  properties.forEach((prop) => {
    // check if each property was passed as a parameter
    if (prop in params) {
      // ignore case
      const param = params[prop]!.toLowerCase();
      // check if color is valid hex color (3, 4, 6, or 8 hex digits)
      if (/^([a-f0-9]{3}|[a-f0-9]{4}|[a-f0-9]{6}|[a-f0-9]{8})$/.test(param)) {
        // set property
        theme[prop] = "#" + param;
      }
      // check if color is valid css color
      else if (COLORS.includes(param)) {
        // set property
        theme[prop] = param;
      }
    }
  });
  // hide borders
  if (params["hide_border"] === "true") {
    theme["border"] = "#0000"; // transparent
  }
  return theme;
}
/**
  * Wraps a string to a given number of characters
  * Similar to `wordwrap()`, but uses regex and does not break with certain non-ascii characters
  * @param string The input string
  * @param width The number of characters at which the string will be wrapped
  * @param break The line is broken using the optional `break` parameter
  * @param cutLongWords If `cutLongWords` is set to true, long words are broken apart to wrap
  * When false the function does not split the word even if affecting the wrap
 * @returns The given string wrapped at the specified length
 */
function utf8WordWrap(string: string, width = 75, breakString = "\n", cutLongWords = false): string {
  // match anything 1 to width chars long followed by whitespace or EOS
  string = string.replace(new RegExp(`(.{1,${width}})(?:\\s|$)`, "u"), `$1${breakString}`);
  // split words that are too long after being broken up
  if (cutLongWords) {
    string = string.replace(new RegExp(`(\\S{${width}})(?=\\S)`, "u"), `$1${breakString}`);
  }
  // trim any trailing line breaks
  return string.trimEnd();
}

/**
  * Get the length of a string with utf8 characters
  * Similar to `strlen()`, but uses regex and does not break with certain non-ascii characters
  * @param string The input string
  * @returns The length of the string
*/
function utf8Strlen(string: string): number {
  return (string.match(/./ug) || []).length;
}

/**
  * Split lines of text using <tspan> elements if it contains a newline or exceeds a maximum number of characters
  * @param text Text to split
  * @param maxChars Maximum number of characters per line
  * @param line1Offset Offset for the first line
  * @return Original text if one line, or split text with <tspan> elements
*/
function splitLines(text: string, maxChars: number, line1Offset: number): string {
  // if too many characters, insert \n before a " " or "-" if possible
  if (text.length > maxChars && !text.includes("\n")) {
    // prefer splitting at " - " if possible
    if (text.includes(" - ")) {
      text = text.replace(" - ", "\n- ");
    }
    // otherwise, use word wrap to split at spaces
    else {
      text = utf8WordWrap(text, maxChars, "\n", true);
    }
  }
  // sanitize text
  text = text.replace(/[<>"&]/g, (match) => {
    if (match == '<') { return '&lt;' }
    else if (match == '>') { return '&gt;' }
    else if (match == '"') { return '&quot;' }
    else if (match == '&') { return '&amp;' }
    else return ""
  });
  return text.replace(
    /^(.*)\n(.*)/,
    `<tspan x='81.5' dy='${line1Offset}'>$1</tspan><tspan x='81.5' dy='16'>$2</tspan>`
  );
}

/**
  * Normalize a locale code
  * @param localeCode Locale code
  * @return Normalized locale code
*/
function normalizeLocaleCode(localeCode: string): string {
  const matches = localeCode.match(/^([a-z]{2,3})(?:[_-]([a-z]{4}))?(?:[_-]([0-9]{3}|[a-z]{2}))?$/i);
  if (!matches) {
    return "en";
  }
  let language = matches[1] ?? "";
  let script = matches[2] ?? "";
  let region = matches[3] ?? "";
  // convert language to lowercase
  language = language.toLowerCase();
  // convert script to title case
  script = script.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  // convert region to uppercase
  region = region.toUpperCase();
  // combine language, script, and region using underscores
  return [language, script, region].filter(Boolean).join("_");
}

/**
 * Generate SVG output for a stats array
 *
 * @param stats Record<string, unknown> Streak stats
 * @param params Record<string, string>|null Request parameters
 * @returns The generated SVG Streak Stats card
 *
 * @throws InvalidArgumentException If a locale does not exist
 */
interface STATS {
  mode: string
  totalContributions: number
  firstContribution: string,
  longestStreak: {
    start: string
    end: string
    length: number
  },
  currentStreak: {
    start: string
    end: string
    length: number
  }
}

/**
  * Get the translations for a locale code after normalizing it
  * @param localeCode Locale code
  * @return Translations for the locale code
*/
function getTranslations(localeCode: string): Record<string, string> {
  // normalize locale code
  localeCode = normalizeLocaleCode(localeCode);
  // if the locale does not exist, try without the script and region
  if (!LANGUAGES[localeCode]) {
    localeCode = localeCode.split("_")[0]!;
  }
  // get the translations for the locale or empty object if it does not exist
  let localeTranslations = LANGUAGES[localeCode] || {};
  // if the locale returned is a string, it is an alias for another locale
  if (typeof localeTranslations === "string") {
    // get the translations for the alias
    localeTranslations = LANGUAGES[localeTranslations]!;
  }
  // fill in missing translations with English
  localeTranslations = { ...LANGUAGES["en"], ...localeTranslations };
  // return the translations
  return localeTranslations;
}

function generateCard(stats: STATS, params: Record<string,string>): string {

  // get requested theme
  const theme = getRequestedTheme(params);

  // get requested locale, default to English
  const localeCode = params.locale || "en";
  const localeTranslations = getTranslations(localeCode);

  // whether the locale is right-to-left
  const direction = localeTranslations.rtl ? "rtl" : "ltr";

  // get date format
  // locale date formatter (used only if date_format is not specified)
  const dateFormat = params.date_format || localeTranslations.date_format!;

  // number formatter
  const numFormatter = new Intl.NumberFormat(localeCode);

  // read border_radius parameter, default to 4.5 if not set
  const borderRadius = params.border_radius || "4.5";

  // total contributions
  const totalContributions = numFormatter.format(stats.totalContributions);
  const firstContribution = getFormatDate(stats.firstContribution, dateFormat, localeCode);
  let totalContributionsRange = `${firstContribution} - ${localeTranslations.Present}`;

  // current streak
  const currentStreak = numFormatter.format(stats.currentStreak.length);
  const currentStreakStart = getFormatDate(stats.currentStreak.start, dateFormat, localeCode);
  const currentStreakEnd = getFormatDate(stats.currentStreak.end, dateFormat, localeCode);
  let currentStreakRange = currentStreakStart;
  if (currentStreakStart !== currentStreakEnd) {
    currentStreakRange += ` - ${currentStreakEnd}`;
  }

  // longest streak
  const longestStreak = numFormatter.format(stats.longestStreak.length);
  const longestStreakStart = getFormatDate(stats.longestStreak.start, dateFormat, localeCode);
  const longestStreakEnd = getFormatDate(stats.longestStreak.end, dateFormat, localeCode);
  let longestStreakRange = longestStreakStart;
  if (longestStreakStart !== longestStreakEnd) {
    longestStreakRange += ` - ${longestStreakEnd}`;
  }

  // if the translations contain a newline, split the text into two tspan elements
  const totalContributionsText = splitLines(localeTranslations.totalContributions!, 22, -9);
  let currentStreakText;
  let longestStreakText;
  if (stats.mode === "weekly") {
    currentStreakText = splitLines(localeTranslations.weekStreak!, 22, -9);
    longestStreakText = splitLines(localeTranslations.longestWeekStreak!, 22, -9);
  } else {
    currentStreakText = splitLines(localeTranslations.currentStreak!, 22, -9);
    longestStreakText = splitLines(localeTranslations.longestStreak!, 22, -9);
  }

  // if the ranges contain over 28 characters, split the text into two tspan elements
  totalContributionsRange = splitLines(totalContributionsRange, 28, 0);
  currentStreakRange = splitLines(currentStreakRange, 28, 0);
  longestStreakRange = splitLines(longestStreakRange, 28, 0);

  return `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'
                style='isolation: isolate' viewBox='0 0 495 195' width='495px' height='195px' direction='${direction}'>
        <style>
            @keyframes currstreak {
                0% { font-size: 3px; opacity: 0.2; }
                80% { font-size: 34px; opacity: 1; }
                100% { font-size: 28px; opacity: 1; }
            }
            @keyframes fadein {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }
        </style>
        <defs>
            <clipPath id='outer_rectangle'>
                <rect width='495' height='195' rx='${borderRadius}'/>
            </clipPath>
            <mask id='mask_out_ring_behind_fire'>
                <rect width='495' height='195' fill='white'/>
                <ellipse id='mask-ellipse' cx='247.5' cy='32' rx='13' ry='18' fill='black'/>
            </mask>
        </defs>
        <g clip-path='url(#outer_rectangle)'>
            <g style='isolation: isolate'>
                <rect stroke='${theme["border"]}' fill='${theme["background"]}' rx='${borderRadius}' x='0.5' y='0.5' width='494' height='194'/>
            </g>
            <g style='isolation: isolate'>
                <line x1='330' y1='28' x2='330' y2='170' vector-effect='non-scaling-stroke' stroke-width='1' stroke='${theme["stroke"]}' stroke-linejoin='miter' stroke-linecap='square' stroke-miterlimit='3'/>
                <line x1='165' y1='28' x2='165' y2='170' vector-effect='non-scaling-stroke' stroke-width='1' stroke='${theme["stroke"]}' stroke-linejoin='miter' stroke-linecap='square' stroke-miterlimit='3'/>
            </g>
            <g style='isolation: isolate'>
                <!-- Total Contributions Big Number -->
                <g transform='translate(1,48)'>
                    <text x='81.5' y='32' stroke-width='0' text-anchor='middle' fill='${theme["sideNums"]}' stroke='none' font-family='\"Segoe UI\", Ubuntu, sans-serif' font-weight='700' font-size='28px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 0.6s'>
                        ${totalContributions}
                    </text>
                </g>
                <!-- Total Contributions Label -->
                <g transform='translate(1,84)'>
                    <text x='81.5' y='32' stroke-width='0' text-anchor='middle' fill='${theme["sideLabels"]}' stroke='none' font-family='\"Segoe UI\", Ubuntu, sans-serif' font-weight='400' font-size='14px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 0.7s'>
                        ${totalContributionsText}
                    </text>
                </g>
                <!-- total contributions range -->
                <g transform='translate(1,114)'>
                    <text x='81.5' y='32' stroke-width='0' text-anchor='middle' fill='${theme["dates"]}' stroke='none' font-family='\"Segoe UI\", Ubuntu, sans-serif' font-weight='400' font-size='12px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 0.8s'>
                        ${totalContributionsRange}
                    </text>
                </g>
            </g>
            <g style='isolation: isolate'>
                <!-- Current Streak Big Number -->
                <g transform='translate(166,48)'>
                    <text x='81.5' y='32' stroke-width='0' text-anchor='middle' fill='${theme["currStreakNum"]}' stroke='none' font-family='\"Segoe UI\", Ubuntu, sans-serif' font-weight='700' font-size='28px' font-style='normal' style='animation: currstreak 0.6s linear forwards'>
                        ${currentStreak}
                    </text>
                </g>
                <!-- Current Streak Label -->
                <g transform='translate(166,108)'>
                    <text x='81.5' y='32' stroke-width='0' text-anchor='middle' fill='${theme["currStreakLabel"]}' stroke='none' font-family='\"Segoe UI\", Ubuntu, sans-serif' font-weight='700' font-size='14px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 0.9s'>
                        ${currentStreakText}
                    </text>
                </g>
                <!-- Current Streak Range -->
                <g transform='translate(166,145)'>
                    <text x='81.5' y='21' stroke-width='0' text-anchor='middle' fill='${theme["dates"]}' stroke='none' font-family='\"Segoe UI\", Ubuntu, sans-serif' font-weight='400' font-size='12px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 0.9s'>
                        ${currentStreakRange}
                    </text>
                </g>
                <!-- ring around number -->
                <g mask='url(#mask_out_ring_behind_fire)'>
                    <circle cx='247.5' cy='71' r='40' fill='none' stroke='${theme["ring"]}' stroke-width='5' style='opacity: 0; animation: fadein 0.5s linear forwards 0.4s'></circle>
                </g>
                <!-- fire icon -->
                <g stroke-opacity='0' style='opacity: 0; animation: fadein 0.5s linear forwards 0.6s'>
                    <path d=' M 235.5 19.5 L 259.5 19.5 L 259.5 43.5 L 235.5 43.5 L 235.5 19.5 Z ' fill='none'/>
                    <path d=' M 249 20.17 C 249 20.17 249.74 22.82 249.74 24.97 C 249.74 27.03 248.39 28.7 246.33 28.7 C 244.26 28.7 242.7 27.03 242.7 24.97 L 242.73 24.61 C 240.71 27.01 239.5 30.12 239.5 33.5 C 239.5 37.92 243.08 41.5 247.5 41.5 C 251.92 41.5 255.5 37.92 255.5 33.5 C 255.5 28.11 252.91 23.3 249 20.17 Z  M 247.21 38.5 C 245.43 38.5 243.99 37.1 243.99 35.36 C 243.99 33.74 245.04 32.6 246.8 32.24 C 248.57 31.88 250.4 31.03 251.42 29.66 C 251.81 30.95 252.01 32.31 252.01 33.7 C 252.01 36.35 249.86 38.5 247.21 38.5 Z ' fill='${theme["fire"]}' stroke-opacity='0'/>
                </g>
            </g>
            <g style='isolation: isolate'>
                <!-- Longest Streak Big Number -->
                <g transform='translate(331,48)'>
                    <text x='81.5' y='32' stroke-width='0' text-anchor='middle' fill='${theme["sideNums"]}' stroke='none' font-family='\"Segoe UI\", Ubuntu, sans-serif' font-weight='700' font-size='28px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 1.2s'>
                        ${longestStreak}
                    </text>
                </g>
                <!-- Longest Streak Label -->
                <g transform='translate(331,84)'>
                    <text x='81.5' y='32' stroke-width='0' text-anchor='middle' fill='${theme["sideLabels"]}' stroke='none' font-family='\"Segoe UI\", Ubuntu, sans-serif' font-weight='400' font-size='14px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 1.3s'>
                        ${longestStreakText}
                    </text>
                </g>
                <!-- Longest Streak Range -->
                <g transform='translate(331,114)'>
                    <text x='81.5' y='32' stroke-width='0' text-anchor='middle' fill='${theme["dates"]}' stroke='none' font-family='\"Segoe UI\", Ubuntu, sans-serif' font-weight='400' font-size='12px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 1.4s'>
                        ${longestStreakRange}
                    </text>
                </g>
            </g>
        </g>
    </svg>
`;
}


module.exports = {getRequestedTheme, getFormatDate}