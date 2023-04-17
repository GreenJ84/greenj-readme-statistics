/** @format */

import { Request, Response } from "express";

import {
  RedisCache,
  deleteCacheData,
  getCacheData,
  getCacheKey,
  setCacheData,
} from "../utils/cache";
import {
  DATA_UDPDATE_INTERVAL,
} from "../utils/constants";
import { preFlight, sleep } from "../utils/utils";


import {
  LeetRawDaily,
  LeetRawProfileData,
  LeetUserData,
  LeetUserProfile,
  LeetUserStreak,
} from "../leetcode/leetcodeTypes";
import {
  updateLeetUserProfile,
  setLeetUserStreak,
  updateLeetUserStreak,
  startLeetcodeDaily,
  setLeetUserProfile,
} from "../leetcode/query";
import { leetParseDirect } from "../leetcode/apiParser";
import { leetCardDirect } from "../leetcode/leetcodeUtils";

let sleepMod = -2;

export const leetcodeRegister = async (req: Request, res: Response) => {
  // PreFlight checks for user based routes
  if (!preFlight(req, res)) {
    return;
  }
  res.set("Content-Type", "application/json");
  const username = req.params.username!;
  console.log(username)
  const cacheKey = getCacheKey(req.path, username);
  // Try for cached data, Query API if not present
  const [success, _] = await getCacheData(cacheKey);
  if (success) {
    res.status(208).json({
      message: "User already registered",
      code: "208",
    });
    return;
  }

  await setLeetUserProfile(username).catch((err) => {
    throw err;
  });

  const intervalId = setInterval(() => {
    updateLeetUserProfile(username);
  }, DATA_UDPDATE_INTERVAL);

  await setCacheData(cacheKey, intervalId)
    .catch(err => { throw err; })
  
  res.status(201).json({
    message: "User Registered",
    code: "201",
  });
  return;
};
// Main Controller for GitHub
export const leetcodeStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  // PreFlight checks for user based routes
  if (!preFlight(req, res)) {
    return;
  }
  const cacheKey = getCacheKey(req.path, req.params.username!);

  sleepMod = (sleepMod + 2) % 10;
  await sleep(sleepMod);

  const [success, cacheData] = await getCacheData(cacheKey);
  if (!success) {
    res.set("Content-Type", "application/json");
    res.status(401).json({
      message: "User unauthorized. Registration required for API data.",
      code: "401",
    });
    return;
  }
  // console.log(success, cacheData);
  const data = cacheData as LeetUserProfile;

  const createCard = leetCardDirect(req);
  const card = createCard(req, data);

  res.status(200).send(card);
  return;
};

export const leetcodeStreakRegister = async (req: Request, res: Response) => {
  // PreFlight checks for user based routes
  if (!preFlight(req, res)) {
    return;
  }
  res.set("Content-Type", "application/json");
  const cacheKey = getCacheKey(req.path, req.params.username!);
  // Try for cached data, Query API if not present
  const [success, _] = await getCacheData(cacheKey);
  if (success) {
    res.status(208).json({
      message: "User already registered",
      code: "208",
    });
    return;
  }

  await setLeetUserStreak(req).catch((err) => {
    throw err;
  });

  const intervalId = setInterval(() => {
    // console.log(intervalId);
    updateLeetUserStreak(req);
  }, DATA_UDPDATE_INTERVAL);

  await setCacheData(cacheKey, intervalId);

  res.status(201).json({
    message: "User Registered",
    code: "201",
  });
  return;
};

// User Streak specific controller
export const leetcodeStreak = async (
  req: Request,
  res: Response
): Promise<void> => {
  // PreFlight checks for user based routes
  if (!preFlight(req, res)) {
    return;
  }
  const cacheKey = getCacheKey(req.path, req.params.username!);

  const [success, cacheData] = await getCacheData(cacheKey);
  if (!success) {
    res.set("Content-Type", "application/json");
    res.status(401).json({
      message: "User unauthorized. Registration required for API data.",
      code: "401",
    });
    return;
  }
  const data = cacheData as LeetUserStreak;

  const streakCard = leetCardDirect(req);
  const card = streakCard(req, data);

  res.status(200).send(card);
  return;
};

export const leetcodeUnregister = async (req: Request, res: Response) => {
  // Ensure caller is viable
  if (!preFlight(req, res)) {
    return;
  }
  const username = req.params.username!
  let cacheKey = getCacheKey(req.path, username);
  res.set("Content-Type", "application/json");

  // Try for cached data, Query API if not present
  const [profSuccess, profCache] = await getCacheData(cacheKey);
  if (!profSuccess) {
    console.error("User's profile data not found.");
  } else {
    const intervalID = profCache as NodeJS.Timer;
    if (intervalID) {
      clearInterval(intervalID);
    }
    const deleted = await deleteCacheData(cacheKey);
    if (!deleted) {
      console.error("Cached profile data didn't get deleted.");
    }
  }

  const streakPath = req.path
    .split("/")
    .map((sec, idx) => {
      if (idx == 2) {
        return "streak";
      } else {
        return sec;
      }
    })
    .join("/");
  cacheKey = getCacheKey(streakPath, username);
  // Try for cached data, Query API if not present
  const [streakSuccess, streakCache] = await getCacheData(cacheKey);
  if (!streakSuccess) {
    console.error("User's streak data not found.");
  } else {
    const intervalID = streakCache as NodeJS.Timer;
    if (intervalID) {
      clearInterval(intervalID);
    }
    const deleted = await deleteCacheData(cacheKey);
    if (!deleted) {
      console.error("Cached Streak data didn't get deleted.");
    }
  }

  if (!profSuccess && !streakSuccess) {
    res.status(400).json({
      message: "Unregistration process failed.",
      code: "400",
    });
    return;
  } else if (!profSuccess || !streakSuccess) {
    res.status(400).json({
      message:
        "Unregistration partial success. May be partially registered still.",
      code: "400",
    });
    return;
  } else {
    res.status(200).json({
      message: "User unregistered",
      code: "200",
    });
    return;
  }
};

export const leetcodeDaily = async (
  req: Request,
  res: Response
): Promise<void> => {
  req;
  const cacheKey = `leetcode:daily`;

  const [success, cacheData] = await getCacheData(cacheKey);
  if (!success) {
    startLeetcodeDaily();
    res.status(500).json({
      message: "Updating Daily Question. Try again in a minute.",
      code: "500",
    });
    return;
  }
  const data = cacheData as LeetRawDaily;

  console.log(data);
  // const card = createCard(req, parsedData);
  res.set("Content-Type", "application/json");
  res.status(200).send(data);
  return;
};
