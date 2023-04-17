/** @format */

import { DateTime } from "luxon";
import { Request, Response } from "express";
import { createIntl, createIntlCache } from "@formatjs/intl";

import { addToBlacklist, checkBlacklistRequest } from "./blacklist";
import { Themes, ThemeType } from "./themes";
import { Colors } from "./colors";
import xss from "xss";
import { PRODUCTION } from "./constants";

export function sanitizeText(value: string): string {
  // Match letters, digits, underscores, and spaces
  const match = value.match(/^[a-zA-Z_]+$/);
  if (match) {
    return match[0].replaceAll("_", " ");
  } else {
    throw new Error(`Invalid text value: ${value}`);
  }
}

export function sanitizeParam(value: string): string {
  // Match letters, digits, underscores, and spaces
  const match = value.match(/^[a-zA-Z_]+$/);
  if (match) {
    return match[0].replaceAll("_", "-");
  } else {
    throw new Error(`Invalid text value: ${value}`);
  }
}

// Match CSS color name or 6-character hex code
export function sanitizeColor(value: string): string {
  const match = value.match(/^[a-z]{3,}(?:[a-z]{3,})?$|^[0-9a-fA-F]{6}$/);
  if (match) {
    if (Colors.includes(match[0])) {
      return match[0];
    } else {
      let hex = match[0].match(/^[0-9a-fA-F]{6}$/);
      if (hex) {
        return `#${hex[0]}`;
      }
    }
  }
  throw new Error(`Invalid color value: ${value}`);
}

// Match any number
export function sanitizeNumber(value: string): string {
  const match = value.match(/^-?\d+(?:\.\d+)?$/);
  if (match) {
    return match[0];
  } else {
    throw new Error(`Invalid number value: ${value}`);
  }
}

// Match 'true' or 'false'
export function sanitizeBoolean(value: string): string {
  const match = value.match(/^(true|false)$/i);
  if (match) {
    return match[0].toLowerCase();
  } else {
    throw new Error(`Invalid boolean value: ${value}`);
  }
}

// Match alphanumeric characters and hyphens, with length between 1 and 39
export function sanitizeUsername(value: string): string {
  const match = value.match(/^[a-z_\d](?:[a-z_\d]|-(?=[a-z\d])){1,39}$/i);
  if (match) {
    return match[0];
  } else {
    throw new Error(`Invalid username value: ${value}`);
  }
}

// Loop through all query parameters and sanitize them accordingly
export function sanitizeQuery(req: Request): boolean {
  const color: string[] = [
    "background",
    "border",
    "stroke",
    "ring",
    "fire",
    "dayAvg",
    "pieBG",
    "icons",
    "logo",
    "currStreak",
    "question",
    "score",
    "stats",
    "sideStat",
    "textMain",
    "textSub",
    "dates",
  ];
  const number: string[] = ["borderRadius"];
  const params: string[] = ["theme", "locale"];
  const boolean: string[] = ["hideBorder"];

  const sanitizedParams: Record<string, any> = {};
  for (const param in req.query) {
    const value = req.query[param];
    if (value !== xss(value as string)) {
      req.query = {};
      return false;
    }
    !PRODUCTION && console.log(param)
    switch (true) {
      case color.includes(param):
        try {
          sanitizedParams[param] = sanitizeColor(value as string);
        } catch (error) {
          console.error(error);
        }
        break;
      case number.includes(param):
        try {
          sanitizedParams[param] = sanitizeNumber(value as string);
        } catch (error) {
          console.error(error);
        }
        break;
      case params.includes(param):
        try {
          sanitizedParams[param] = sanitizeParam(value as string);
        } catch (error) {
          console.error(error);
        }
        break;
      case boolean.includes(param):
        try {
          sanitizedParams[param] = sanitizeBoolean(value as string);
        } catch (error) {
          console.error(error);
        }
        break;
      case param == "title":
        try {
          sanitizedParams[param] = sanitizeText(value as string);
        } catch (error) {
          console.error(error);
        }
      // Remove all unwarrented parameters
      default:
        break;
    }
  }
  !PRODUCTION && console.log(sanitizedParams)
  req.query = sanitizedParams;
  return true;
}

// API Security
export const preFlight = (req: Request, res: Response): boolean => {
  if (req.params.username == undefined) {
    res.status(400).send({
      message: "No username found on API Call that requires username",
      error: "Missing username parameter.",
      error_code: 400,
    });
    return false;
  }

  try {
    req.params.username = sanitizeUsername(req.params.username!);
  } catch (err) {
    res.status(403).send({
      message:
        "Username found on API Call did not pass sanitization. Check name or submit support issue.",
      error: err,
      error_code: 400,
    });
    return false;
  }

  let accessCheck = checkBlacklistRequest(req, req.params.username);
  if (!accessCheck[0]) {
    res.status(403).send({
      message: accessCheck[1],
      error: "Caller Black Listed",
      error_code: 403,
    });
    return false;
  }

  if (!sanitizeQuery(req)) {
    addToBlacklist(req.params.username);
    addToBlacklist(req.ip);
    res.status(400).send({
      error: "Malicious Parameter Content",
      error_code: 400,
      message:
        "Malicious xss content found within api call. Immediate API exile.",
    });
  }
  return true;
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
  console.log(theme)

  let _theme: ThemeType = Themes["default"]!;
  // Set all properties base to theme first
  if (theme != undefined) {
    if (theme as string in Themes) {
      _theme = Themes[theme as string]!;
    }
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

export function sleep(mod: number): Promise<void> {
  const randomWait = Math.floor(Math.random() * (1000 * mod));
  return new Promise((resolve) => {
    setTimeout(resolve, randomWait);
  });
}
