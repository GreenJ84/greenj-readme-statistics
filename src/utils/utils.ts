import { Request, Response } from "express";
import { checkBlacklistRequest } from "./blacklist";
import { THEMES, THEMETYPE } from "./themes";


export const preFlight = (req: Request, res: Response): boolean => {
    if (req.params.username == undefined) {
        res.status(400).send(
            {
                message: 'No username found on API Call that requires username',
                error: "Missing username parameter.",
                error_code: 400
            });
        return false
    }
    let accessCheck = checkBlacklistRequest(req, req.params.username!)
    if (!accessCheck[0]) {
        res.status(400).send(
            {
                message: accessCheck[1],
                error: "Caller Black Listed",
                error_code: 403
            });
    }
    return true
}

export const baseCardThemeParse = (req: Request, _theme: THEMETYPE) => {
    const {
        theme,
        background,
        border,
        stroke,

        hideBorder,
        borderRadius,
        locale,
    } = req.query;

    // Set all properties base to theme first
    if ((theme as string) in THEMES) {
        _theme = THEMES[(theme as string)]!
    } else {
        _theme = THEMES["default"]!
    }

    if (background !== undefined) {
        _theme.background = ("#" + background) as string;
    }
    if (border !== undefined) {
        _theme.border = ("#" + border) as string;
    }
    if (stroke !== undefined) {
        _theme.stroke = ("#" + stroke) as string;
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
        _theme.locale = locale as string;
    } else {
        _theme.locale = 'en-US';
    }
}

export function parse_cookie(cookie: string): Record<string, string> {
    return cookie
        .split(";")
        .map((x) => x.trim().split("="))
        .reduce((acc, x) => {
            if (x.length === 2) {
                let idx = x[0]!.toString();
                acc[idx] = x[1]!;
            }
            return acc
        }, {} as Record<string, string>);
}

export function sleep(ms: number, val: unknown = null): Promise<unknown> {
    return new Promise((resolve) => setTimeout(() => resolve(val), ms));
}

