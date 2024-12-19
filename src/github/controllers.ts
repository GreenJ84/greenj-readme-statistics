/** @format */

import { Request, Response } from "express";

import { cache } from "../server";
import { Cache } from "../utils/cache";
import { UserData, UserLanguages, UserProfile, UserStats, UserStreak } from "./types";
import { getRouteSVGModal } from "./utils";
import { GithubQuerier } from "./platformQuerier";
import { PlatformDb } from "../utils/database";

const querier = new GithubQuerier();
const keyGenerator = Cache.keyGenerator('github')

export const getProfileData = async (
  req: Request,
  res: Response,
  subRoute: string
) => {
  const username = req.params.username!;
  const cacheKey = keyGenerator(username, subRoute);
  const refresh = typeof req.query.refresh === "string" ? req.query.refresh : null;

  let cacheData = await cache.getItem(cacheKey);
  if (cacheData === null || refresh === "true") {
    cacheData = await querier.getUserData(subRoute)(username);
    (async () => {
      await cache.setItem(cacheKey, cacheData)
        .catch((err) => {
          console.error("Error setting cache:", err);
        });
    })();
  }

  const data = cacheData as UserData;
  const card: string = getRouteSVGModal(subRoute)(req, data);
  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200).send(card);
};

const cacheProfile = async (username: string, userProfile: UserProfile) => {
  await cache.setItem(keyGenerator(username, "streak"), userProfile.streak)
  .catch((err) => {
    console.error("Error setting cache:", err);
  });
await cache.setItem(keyGenerator(username, "stats"), userProfile.stats)
  .catch((err) => {
    console.error("Error setting cache:", err);
  });
await cache.setItem(keyGenerator(username, "languages"), userProfile.languages)
  .catch((err) => {
    console.error("Error setting cache:", err);
  });
}

const registrar = new PlatformDb("github", "./github/users.sqlite", async (username: string) => {
  const userProfile = await querier.getUserData("profile")(username) as UserProfile;
  (async () => { cacheProfile(username, userProfile)})();
});

export const register = async (req: Request, res: Response) => {
  const username = req.params.username!;
  const newRegistration = registrar.registerUser(username);

  let userProfile: UserProfile;
  if (newRegistration || req.query.refresh === "true" ) {
    userProfile = await querier.getUserData("profile")(username) as UserProfile;
    (async () => { cacheProfile(username, userProfile)})();
  } else {
    const [streak, stats, languages] = await Promise.all([
      cache.getItem(keyGenerator(username, "streak")),
      cache.getItem(keyGenerator(username, "stats")),
      cache.getItem(keyGenerator(username, "languages")),
    ]);
    userProfile = {
      streak: streak as UserStreak,
      stats: stats as UserStats,
      languages: languages as UserLanguages
    };
  }

  const streakCard: string = getRouteSVGModal("streak")(req, userProfile.streak);
  const statsCard: string = getRouteSVGModal("stats")(req, userProfile.stats);
  const langsCard: string = getRouteSVGModal("languages")(req, userProfile.languages);

  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200).send(`<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
      ${streakCard}
      ${statsCard}
      ${langsCard}
    </div>`);
};

export const unregister = async (req: Request, res: Response) => {
  registrar.unregisterUser(req.params.username!);

  try {
    await Promise.all([
      cache.deleteItem(keyGenerator(req.params.username!, "streak")),
      cache.deleteItem(keyGenerator(req.params.username!, "stats")),
      cache.deleteItem(keyGenerator(req.params.username!, "languages")),
    ]);
  } catch (err: any){
    console.error("Error deleting cache:", err);
    res.status(500).send("Failed to delete cached user data after unregistering. Data will expire and be removed within the next 24hrs.");
  }
  res.status(200).send("User unregistered successfully.");
};
