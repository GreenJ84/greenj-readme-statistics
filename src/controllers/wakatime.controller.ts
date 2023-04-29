/** @format */

import { Request, Response } from "express";

import { preFlight } from "../utils/utils";
import {
  getCacheKey,
  getCacheData,
  setRegistrationCache,
  deleteCacheData,
  getRegistrationCache,
} from "../utils/cache";
import { DATA_UDPDATE_INTERVAL } from "../utils/constants";

import { WakaProfileData } from "../wakatime/wakatimeTypes";
import { setWakaProfile, updateWakaProfile } from "../wakatime/query";
import { wakaCardDirect } from "../wakatime/wakatimeUtils";

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
  const [success, _] = await getRegistrationCache(cacheKey);

  await setWakaProfile(username)
    .catch((err) => {
      throw err;
  });

  // Start the refresh cycle
  const intervalId = setInterval(() => {
    updateWakaProfile(username);
    console.log(`Updating Wakatime profile for ${username} at ${new Date().toLocaleString()}`);
  }, DATA_UDPDATE_INTERVAL);

  // Cache the users refresh key
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
  const [success, cacheData] = await getRegistrationCache(cacheKey);
  if (!success) {
    res.status(400).json({
      message: "User not found.",
      code: "404",
    });
    return;
  }

  const intervalID = cacheData;
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
  const username = req.params.username!;
  const cacheKey = getCacheKey(req.path, username);
  
  // Try for cached data, Query API if not present
  const [success, cacheData] = await getCacheData(cacheKey);
  if (!success) {
    await setWakaProfile(username)
    .catch((err) => {
      throw err;
    });
  }
  const data = cacheData as WakaProfileData;
  
  const subRoute = req.path.split("/")[2]!;
  const cardCreate = wakaCardDirect(subRoute);
  const card: string = cardCreate(req, data);

  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200).send(card);
  return;
};
