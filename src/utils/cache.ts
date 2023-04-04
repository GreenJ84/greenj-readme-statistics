import { RedisClientType, createClient } from 'redis';
import dotenv from 'dotenv';
import { LeetCodeGraphQLResponse, STREAKDATA } from '../leetcode/leetcodeTypes';
import { GraphQLResponse, STREAKTYPE } from '../github/githubTypes';
import { wakaResponse } from '../wakatime/wakatimeTypes';

dotenv.config();

type cacheType = 
    LeetCodeGraphQLResponse |
    STREAKDATA |
    GraphQLResponse |
    STREAKTYPE |
    wakaResponse |
    { times: number }

const client: RedisClientType = process.env.NODE_ENV === "production" ?
    createClient({
            url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASS}@${process.env.PROD_HOST}:${process.env.PROD_PORT}`
        })
    :
    createClient();

client.on("error", err => console.error(`Redis client error: ${err}`))

client.connect()
    .then(() => console.log("Redis connection created."))

export const getCacheData = async (key: string): Promise<[boolean, cacheType | null]> => {
    try {
        const data = await client.get(
            key
        );
        if (data == undefined) {
            console.warn("Empty Cache");
            return [false, null]
        }
        return [true, JSON.parse(data)]
    }
    catch {
        console.error("Cache retrieval Error");
        return [false, null]
    }
}

export const setCacheData = async (key: string, data: any): Promise<void> => {
    await client.set(
        key,
        JSON.stringify(data), {
            "EX": (60 * 60 * 6)
        }
    )
    return;
}

