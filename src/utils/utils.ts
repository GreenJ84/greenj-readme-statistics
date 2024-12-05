import { DateTime } from "luxon";
import { Request } from "express";
import { DocumentNode } from "graphql";
import { createIntl, createIntlCache } from "@formatjs/intl";


import { Themes, ThemeType } from "./themes";
import { PRODUCTION } from "../environment";

export class ResponseError extends Error {
  error: any;
  error_code: number;

  constructor(message: string, error: any, error_code: number) {
    super(message);
    this.error = error;
    this.error_code = error_code;
  }
}

export interface GraphQuery {
  variables?: { [key: string]: unknown };
  query: DocumentNode;
}

type LoggingMethod = typeof console.log;
export const developmentLogger = (
  method: LoggingMethod,
  ...messages: string[]
) => {
  if (!PRODUCTION) {
    method(...messages);
  }
};

/**
 * Normalize a locale code
 * @param localeCode Locale code
 * @return Normalized locale code
 */
export function normalizeLocaleCode(localeCode: string): string {
  const matches = localeCode.match(
    /^([a-z]{2,3})(?:[_-]([a-z]{4}))?(?:[_-]([0-9]{3}|[a-z]{2}))?$/i
  );
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
  return [language, script, region].filter(Boolean).join("-");
}

export const baseCardThemeParse = (req: Request) => {
  const {
    theme,
    background,
    border,
    stroke,

    hideBorder,
    borderRadius,
    locale,
  } = req.query;

  let _theme: ThemeType = { ...Themes["default"]! };
  // Set all properties base to theme first
  if (theme != undefined) {
    !PRODUCTION && console.log(theme);
    if ((theme as string) in Themes) {
      _theme = { ...Themes[theme as string]! };
    }
    !PRODUCTION && console.log(_theme);
  }

  if (background !== undefined) {
    _theme.background = background as string;
  }
  if (border !== undefined) {
    _theme.border = border as string;
  }
  if (stroke !== undefined) {
    _theme.stroke = stroke as string;
  }

  if (hideBorder !== undefined) {
    if (hideBorder == "true") {
      _theme.hideBorder = true;
    }
  } else {
    _theme.hideBorder = false;
  }

  if (borderRadius !== undefined) {
    _theme.borderRadius = parseInt(borderRadius as string);
  } else {
    _theme.borderRadius = 10;
  }

  if (locale !== undefined) {
    _theme.locale = normalizeLocaleCode(locale as string);
  } else {
    _theme.locale = "en-US";
  }

  return _theme;
};

export function parseCookie(cookie: string): Record<string, string> {
  return cookie
    .split(";")
    .map((x) => x.split("="))
    .reduce((acc, x) => {
      if (x.length === 2) {
        let idx = x[0]!.toString().trim();
        acc[idx] = decodeURIComponent(x[1]!).trim();
      }
      return acc;
    }, {} as Record<string, string>);
}

/**
    Convert date from Y-M-D to more human-readable format
 *  @param string $dateString String in Y-M-D format
    *  @param string $locale Locale code
 *  @param string|null $format Date format to use, or null to use locale default
 *  @return string Formatted Date string
 */
export const getFormatDate = (
  dateString: string,
  locale: string,
  format: string | null = null
): string => {
  const date = DateTime.fromISO(dateString);
  let formatted = "";
  const cache = createIntlCache();
  const dateConfig = createIntl(
    {
      locale: locale,
      timeZone: "UTC",
      defaultLocale: "en-US",
      messages: {},
      formats: {},
      defaultFormats: {},
      onError: (err) => {
        console.error(err);
      },
      onWarn: (warning) => {
        console.warn(warning);
      },
    },
    cache
  );
  // if current year, display only month and day
  if (date.toFormat("yyyy") === DateTime.now().toFormat("yyyy")) {
    if (format) {
      // remove brackets and all text within them
      formatted = date.toFormat(format.replace(/\[.*?\]/g, ""));
    } else {
      // format without year using locale
      formatted = dateConfig.formatDate(date.toISODate(), {
        month: "short",
        day: "numeric",
      });
    }
  }
  // otherwise, display month, day, and year
  else {
    if (format) {
      // remove brackets, but leave text within them
      formatted = date.toFormat(format.replace(/[\[\]]/g, ""));
    } else {
      // format with year using locale
      formatted = dateConfig.formatDate(date.toISODate(), {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  }
  // sanitize and return formatted date
  return formatted.replace(/[<>"&]/g, (match) => {
    if (match == "<") {
      return "&lt;";
    } else if (match == ">") {
      return "&gt;";
    } else if (match == '"') {
      return "&quot;";
    } else if (match == "&") {
      return "&amp;";
    } else return "";
  });
};
