import { Request } from 'express';
import redis from 'redis';
const client = redis.createClient();

export const getCacheData = async (req: Request): Promise<[boolean, object?]> => {
    try {
        const data = await client.get(
            `${req.path.split("/")[1]!}:${req.params.username!}`
        );
        if (data == undefined) {
            return [false]
        }
        return [true, JSON.parse(data)]
    }
    catch {
        return [false]
    }
}

export const setCacheData = async (req: Request, data: any): Promise<void> => {
    await client.set(
        `${req.path.split("/")[1]!}:${req.params.username!}`,
        JSON.stringify(data), {
            "EX": (60 * 60 * 6)
        }
    )
    return;
}

