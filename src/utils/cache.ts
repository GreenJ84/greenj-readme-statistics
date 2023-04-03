import { RedisClientType, createClient } from 'redis';
const client: RedisClientType = process.env.NODE_ENV === "production" ?
    createClient({
            url: `redis://${process.env.REDIS_USER!}:${process.env.REDIS_PASS!}@${process.env.PROD_HOST!}:${parseInt(process.env.PROD_PORT!)}`
        })
    :
    createClient();

client.on("error", err => console.error(`Redis client error: ${err}`))

client.connect()
    .then(() => console.log("Redis connection created."))

export const getCacheData = async (key: string): Promise<[boolean, object | null]> => {
    console.log("Getting cache");
    try {
        const data = await client.get(
            key
        );
        if (data == undefined) {
            return [false, null]
        }
        return [true, JSON.parse(data)]
    }
    catch {
        return [false, null]
    }
}

export const setCacheData = async (key: string, data: any): Promise<void> => {
    console.log("Setting cache");
    await client.set(
        key,
        JSON.stringify(data), {
            "EX": (60 * 60 * 6)
        }
    )
    return;
}

