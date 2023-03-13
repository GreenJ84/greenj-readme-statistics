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