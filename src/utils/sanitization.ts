import { Request } from "express";
import xss from "xss";

import { Colors } from "./colors";
import { developmentLogger } from "./utils";

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
    developmentLogger(console.log, param);
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
  developmentLogger(console.log, sanitizedParams.toString());
  req.query = sanitizedParams;
  return true;
}