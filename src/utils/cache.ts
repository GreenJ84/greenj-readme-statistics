import { Request } from 'express';
import { RedisClientType, createClient } from 'redis';
import { LeetCodeGraphQLResponse, STREAKDATA } from '../leetcode/leetcodeTypes';
import { GraphQLResponse, STREAKTYPE } from '../github/githubTypes';
import { wakaResponse } from '../wakatime/wakatimeTypes';
import { PRODUCTION, PROD_HOST, PROD_PORT, REDIS_PASS, REDIS_USER } from './constants';


type cacheType = 
    LeetCodeGraphQLResponse |
    STREAKDATA |
    GraphQLResponse |
    STREAKTYPE |
    wakaResponse |
    { times: number }

export interface USER_CACHE {
    interval: NodeJS.Timer
    data: cacheType
}

export const client: RedisClientType = PRODUCTION ?
    createClient({
            url: `redis://${REDIS_USER}:${REDIS_PASS}@${PROD_HOST}:${PROD_PORT}`
        })
    :
    createClient();

client.on("error", err => console.error(`Redis client error: ${err}`))

export const getCacheKey = (req: Request) => {
    const path = req.path.split("/");

    // Get platform route
    const route = path[1];
    // Get subroute if not wakatime else set profile
    const subroute = path[2] == "streak" || path[2] == "daily" ?
        path[2] : "profile";
    // User terirnary for not user routes
    const user = req.params.username !== undefined ? `:${req.params.username!}` : "";
    return `${route}:${subroute}${user}`;
}

export const buildRedis = async () => {
    await client.connect()
        .then(() => console.log("Redis server connected."))
}

export const teardownRedis = async () => {
    await client.disconnect()
        .then(() => console.log("Redis server disconnected."));
}

export const getCacheData = async (key: string): Promise<[boolean, USER_CACHE | null]> => {
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

export const setCacheData = async (key: string, data: USER_CACHE): Promise<void> => {
    await client.set(
        key,
        JSON.stringify(data), {
            // 30 sec development cache lifetime
            // 8hr and 8min production cache lifetime
            "EX": PRODUCTION ? (60 * 61 * 8) : 30
        }
    )
    return;
}

export const deleteCacheData = async (key: string): Promise<boolean> => {
    const repsonse = await client.del(key);

    if (repsonse > 0) {
        return true;
    } else {
        return false;
    }
}
