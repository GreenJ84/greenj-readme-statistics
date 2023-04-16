/** @format */

import { Request } from "express";
import { RedisClientType, createClient } from "redis";
import {
  LeetRawDaily,
  LeetRawProfileData,
  LeetUserStreak,
} from "../leetcode/leetcodeTypes";
import { GithRawProfileData, GithUserStreak } from "../github/githubTypes";
import { WakaProfileData } from "../wakatime/wakatimeTypes";
import {
  PRODUCTION,
  PROD_HOST,
  PROD_PORT,
  REDIS_PASS,
  REDIS_USER,
} from "./constants";

type UserData =
  | LeetRawProfileData
  | LeetUserStreak
  | LeetRawDaily
  | GithRawProfileData
  | GithUserStreak
  | WakaProfileData
  | { times: number };

export type RedisCache = UserCache | LeetRawDaily | { times: number };

export interface UserCache {
  interval: NodeJS.Timer;
  data: UserData;
}

export const redisClient: RedisClientType = PRODUCTION
  ? createClient({
      url: `redis://${REDIS_USER}:${REDIS_PASS}@${PROD_HOST}:${PROD_PORT}`,
    })
  : createClient();

redisClient.on("error", (err) => console.error(`Redis Client error: ${err}`));

export const getCacheKey = (req: Request) => {
  const path = req.path.split("/");

  // Get platform route
  const route = path[1];
  const user =
    req.params.username !== undefined ? `:${req.params.username!}` : "";
  // Get subroute if not wakatime else set profile
  const subroute =
    path[2] == "streak" || path[2] == "daily" ? path[2] : "profile";
  // User terirnary for not user routes
  return `${route}${user}:${subroute}`;
};

export const buildRedis = async () => {
  await redisClient
    .connect()
    .then(() => console.log("Redis server connected."));
};

export const teardownRedis = async () => {
  await redisClient
    .disconnect()
    .then(() => console.log("Redis server disconnected."));
};

export const getCacheData = async (
  key: string
): Promise<[boolean, RedisCache | null]> => {
  try {
    const data = await redisClient.get(key);
    if (data == undefined) {
      console.warn("Empty Cache");
      return [false, null];
    }
    !PRODUCTION && console.log(`Getting ${key}`);
    return [true, JSON.parse(data)];
  } catch {
    console.error("Cache retrieval Error");
    return [false, null];
  }
};

export const setCacheData = async (
  key: string,
  data: RedisCache
): Promise<void> => {
  await redisClient.set(key, JSON.stringify(data), {
    // 2 min development cache lifetime
    // 8hr and 8min production cache lifetime
    EX: PRODUCTION ? 60 * 61 * 8 : 60 * 2,
  })
    .catch(() => {
      console.error(`Error Setting cache`);
    })
  
  PRODUCTION && console.log(`Set cahche for ${key}`);
  return;
};

export const deleteCacheData = async (key: string): Promise<boolean> => {
  const repsonse = await redisClient.del(key);
  if (repsonse > 0) {
    return true;
  } else {
    return false;
  }
};
