/** @format */

import { RedisClientType, createClient } from "redis";
import flatted from "flatted";

import {
  LeetRawDaily,
  LeetUserData,
} from "../leetcode/leetcodeTypes";
import { GithUserData } from "../github/githubTypes";
import {
  DATA_UDPDATE_INTERVAL,
  PRODUCTION,
  PROD_HOST,
  PROD_PORT,
  REDIS_PASS,
  REDIS_USER
} from "./constants";
import { WakaProfileData } from "../wakatime/wakatimeTypes";

export type RedisCache =
  | LeetUserData
  | GithUserData
  | LeetRawDaily
  | NodeJS.Timer
  | WakaProfileData
  | { times: number };

export const redisClient: RedisClientType = PRODUCTION
  ? createClient({
      url: `redis://${REDIS_USER}:${REDIS_PASS}@${PROD_HOST}:${PROD_PORT}`,
    })
  : createClient();

redisClient.on("error", (err) => console.error(`Redis Client error: ${err}`));

export const getCacheKey = (reqPath: string, username: string | null = null) => {
  const path = reqPath.split("/");

  // Get platform route
  const route = path[1];
  const user =
    username !== null ? `:${username}` : "";
  // Get subroute if not wakatime else set profile
  const subroute =
    path[2] == "register" || path[2] == "unregister" ? "profile" : path[2];
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

export const getRegistrationCache = async (
  key: string
): Promise<[boolean, string | number | null]> => {
  try {
    const data = await redisClient.get(key);
    if (data == undefined) {
      !PRODUCTION && console.warn("Empty Cache");
      return [false, null];
    }
    !PRODUCTION && console.log(`Getting ${key}`);
    return [true, parseInt(data)];
    }
  catch (error) {
    !PRODUCTION && console.error(`Error getting cache for ${key}: ${error}`);
    return [false, null];
  }
};

export const getCacheData = async (
  key: string
): Promise<[boolean, RedisCache | null]> => {
  try {
    const data = await redisClient.get(key);
    if (data == undefined) {
      !PRODUCTION && console.warn("Empty Cache");
      return [false, null];
    }
    !PRODUCTION && console.log(`Getting ${key}`);
    return [true, flatted.parse(data)];
  } catch (error) {
    !PRODUCTION && console.error(`Error getting cache for ${key}: ${error}`);
    return [false, null];
  }
};

export const setRegistrationCache = async (
  key: string,
  data: string | number
): Promise<void> => {
  try {
      await redisClient.set(key, data);
    }
  catch (error) {
    !PRODUCTION && console.error(`Error setting cache for ${key}: ${error}`);
  }
  !PRODUCTION && console.log(`Set cache for ${key}`);
  return;
};


export const setCacheData = async (
  key: string,
  data: RedisCache
): Promise<void> => {
  const ExpirationBuffer = PRODUCTION
  ? 2
  : 1.5;
  try {
    await redisClient.set(key, flatted.stringify(data), {
      // 3 min development cache lifetime
      // 16hr production cache lifetime
      PX: DATA_UDPDATE_INTERVAL * ExpirationBuffer,
      // Refresh expiration with data refresh
      XX: true,
    });
    }
  catch (error) {
    !PRODUCTION && console.error(`Error setting cache for ${key}: ${error}`);
  }
  !PRODUCTION && console.log(`Set cache for ${key}`);
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
