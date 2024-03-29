/** @format */

import { Request, Response } from "express";

// API Global imports
import { preFlight } from "../utils/utils";
import {
  deleteCacheData,
  getCacheData,
  getCacheKey,
  getRegistrationCache,
  setRegistrationCache,
} from "../utils/cache";
import { DATA_UDPDATE_INTERVAL, PRODUCTION } from "../utils/constants";

// GitHub specific imports
import {
  GithUserProfile,
  GithUserStreak,
} from "../github/githubTypes";
import {
  setGithUserProfile,
  setGithUserStreak,
  updateGithUserStreak,
  updateGithUserProfile,
} from "../github/query";
import { streakCardSetup } from "../github/cards/streak-card";
import { getGithCardDirect } from "../github/githubUtils";

export const githubRegister = async (req: Request, res: Response) => {
  // Ensure Caller is viable
  if (!preFlight(req, res)) {
    return;
  }
  const username = req.params.username!;
  const cacheKey = getCacheKey(req.path, username);
  res.set("Content-Type", "application/json");

  // Try for cached data, Query API if not present
  const [success, _] = await getRegistrationCache(cacheKey);

  await setGithUserProfile(username)
    .catch((err) => {
      throw err;
    });

  const intervalId = setInterval(() => {
    updateGithUserProfile(username);
    console.log(`Updating Github profile for ${username} at ${new Date().toLocaleString()}`);
  }, DATA_UDPDATE_INTERVAL);

  await setRegistrationCache(cacheKey, intervalId[Symbol.toPrimitive]());

  if (success) {
    res.status(208).json({
      message: "User was already registered. Stats refreshed.",
      code: "208",
    });
  } else {
    res.status(201).json({
      message: "User Registered",
      code: "201",
    });
  }
  return;
};

// GitHub controller for all GitHub routes except - Commit Streak Data
export const getProfileStats = async (req: Request, res: Response) => {
  if (!preFlight(req, res)) {
    return;
  }

  const username = req.params.username!;
  const cacheKey = getCacheKey(req.path, username);

  const [success, cacheData] = await getCacheData(cacheKey);
  if (!success) {
    await setGithUserProfile(username)
      .catch((err) => {
        throw err;
      });
  }

  const data = cacheData as GithUserProfile;

  // Get Function to create svg card for data type
  const createCard: Function = getGithCardDirect(req);
  const card: string = createCard(req, data);

  // Send created card as svg string
  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200).send(card);
  return;
};

export const githubStreakRegister = async (req: Request, res: Response) => {
  // Ensure Caller is viable
  if (!preFlight(req, res)) {
    return;
  }
  const cacheKey = getCacheKey(req.path, req.params.username!);
  res.set("Content-Type", "application/json");

  // Try for cached data, Query API if not present
  const [success, _] = await getRegistrationCache(cacheKey);

  await setGithUserStreak(req)
    .catch((err) => {
      throw err;
    });

  const intervalId = setInterval(() => {
    updateGithUserStreak(req);
    console.log(`Updating Github streak profile for ${req.params.username!} at ${new Date().toLocaleString()}`);
  }, DATA_UDPDATE_INTERVAL);

  await setRegistrationCache(cacheKey+'reg', intervalId[Symbol.toPrimitive]() );

  if (success) {
    res.status(208).json({
      message: "User was already registered. Stats refreshed.",
      code: "208",
    });
  } else {
    res.status(201).json({
      message: "User Registered",
      code: "201",
    });
  }
  return;
};

// GitHub Streak Controller
export const getCommitStreak = async (req: Request, res: Response) => {
  if (!preFlight(req, res)) {
    return;
  }
  const cacheKey = getCacheKey(req.path, req.params.username!);

  const [success, cacheData] = await getCacheData(cacheKey);
  if (!success) {
    await setGithUserStreak(req)
      .catch((err) => {
        throw err;
      });
  }
  const data = cacheData as GithUserStreak;

  const card: string = streakCardSetup(req, data);

  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200).send(card);
  return;
};

export const githubUnregister = async (req: Request, res: Response) => {
  // Ensure caller is viable
  if (!preFlight(req, res)) {
    return;
  }

  let cacheKey = getCacheKey(req.path, req.params.username!);
  res.set("Content-Type", "application/json");

  // Try for cached data, Query API if not present
  const [profSuccess, profCache] = await getRegistrationCache(cacheKey);
  if (!profSuccess) {
    console.error("User's profile data not found.");
  } else {
    const intervalID = profCache!;
    
    !PRODUCTION && console.log( `Clearing ${intervalID}`)
    clearInterval(intervalID);

    const deleted = await deleteCacheData(cacheKey);
    if (!deleted) {
      console.error("Cached profile data didn't get deleted.");
    }
  }

  const streakPath = req.path
    .split("/")
    .map((sec, idx) => {
      if (idx == 2) {
        return "streakreg";
      } else {
        return sec;
      }
    })
    .join("/");
  cacheKey = getCacheKey(streakPath, req.params.username!);
  // Try for cached data, Query API if not present
  const [streakSuccess, streakCache] = await getRegistrationCache(cacheKey);
  if (!streakSuccess) {
    console.error("User's streak data not found.");
  } else {
    const intervalID = streakCache!;

    !PRODUCTION && console.log( `Clearing ${intervalID}`)
    clearInterval(intervalID);

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
