import { Request } from 'express';
import redis from 'redis';
const client = redis.createClient();

export const getKey = async (req: Request): Promise<any> => {

    await client.get(
        `${req.path.split("/")[1]!}:${req.params.username!}`
    );
}

export const setKey = async (req: Request, data: any): Promise<[boolean, string | any]> => {
    try {
        await client.set(
            `${req.path.split("/")[1]!}:${req.params.username!}`,
            JSON.stringify(data), {
                "EX": (60 * 60 * 12)
            }
        )
    }
    catch {
        return [false, "Error with client cache retrieval."]
    }
    return [true, data]
}