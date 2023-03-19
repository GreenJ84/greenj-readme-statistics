import { Request, Response } from "express";

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
    return true
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

