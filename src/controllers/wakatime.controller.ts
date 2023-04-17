/** @format */

import { Request, Response } from "express";

import { preFlight, sleep } from "../utils/utils";
import {
  getCacheKey,
  getCacheData,
  setRegistrationCache,
  deleteCacheData,
} from "../utils/cache";
import { DATA_UDPDATE_INTERVAL } from "../utils/constants";

import { WakaProfileData } from "../wakatime/wakatimeTypes";
import { setWakaProfile, updateWakaProfile } from "../wakatime/query";
import { wakaCardDirect } from "../wakatime/wakatimeUtils";

let sleepMod = -2;

export const wakatimeRegister = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Ensure caller is viable
  if (!preFlight(req, res)) {
    return;
  }
  const username = req.params.username!;
  const cacheKey = getCacheKey(req.path, username);
  res.set("Content-Type", "application/json");

  // Try for cached data, Query API if not present
  const [success, _] = await getCacheData(cacheKey);
  if (success) {
    res.status(208).json({
      message: "User already registered",
      code: "208",
    });
    return;
  }
  

  await setWakaProfile(username)
    .catch((err) => {
      throw err;
  });

  // Start the refresh cycle
  const intervalID = setInterval(() => {
    updateWakaProfile(username);
  }, DATA_UDPDATE_INTERVAL);

  // Cache the users refresh key
  await setRegistrationCache(cacheKey, intervalID);

  res.status(201).json({
    message: "User Registered",
    code: "201",
  });
  return;
};

export const wakatimeUnregister = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Ensure caller is viable
  if (!preFlight(req, res)) {
    return;
  }
  const cacheKey = getCacheKey(req.path, req.params.username!);
  res.set("Content-Type", "application/json");

  // Try for cached data, Query API if not present
  const [success, cacheData] = await getCacheData(cacheKey);
  if (!success) {
    res.status(400).json({
      message: "User not found.",
      code: "404",
    });
    return;
  }

  const intervalID = cacheData! as NodeJS.Timer;
  if (intervalID) {
    clearInterval(intervalID);
  }
  const deleted = await deleteCacheData(cacheKey);

  if (!deleted) {
    console.error("Cache data didn't get deleted.");
    res.status(200).json({
      message: "Unregistration process failed.",
      code: "400",
    });
    return;
  }

  res.status(200).json({
    message: "User unregistered. Profile stats will not be refreshed at the next interval.",
    code: "200",
  });
  return;
};

export const wakatimeProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Ensure caller is viable
  if (!preFlight(req, res)) {
    return;
  }
  const cacheKey = getCacheKey(req.path, );
  
  sleepMod = (sleepMod + 2) % 10;
  await sleep(sleepMod);
  
  // Try for cached data, Query API if not present
  const [success, cacheData] = await getCacheData(cacheKey);
  if (!success) {
    res.set("Content-Type", "application/json");
    res.status(401).json({
      message: "User unauthorized. Registration required for API data.",
      code: "401",
    });
    return;
  }
  const data = cacheData as WakaProfileData;
  
  const subRoute = req.path.split("/")[2]!;
  const cardCreate = wakaCardDirect(subRoute);
  const card: string = cardCreate(req, data);

  res.status(200).send(card);
  return;
};
