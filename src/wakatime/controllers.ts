/** @format */

import { Request, Response } from "express";

import { cache } from "../server";
import { Cache } from "../utils/cache";
import { PlatformDb } from "../utils/database";
import { WakaTimeQuerier } from "./platformQuerier";
import { wakaStatsCard } from "./modals/stats-card";
import { wakaInsightCard } from "./modals/insights-card";
import { wakaLanguagesCard } from "./modals/langs-card";
import { match } from "ts-pattern";
import { Insight, Lang, Stat, UserData, UserProfile } from "./types";

const querier = new WakaTimeQuerier();
const keyGenerator = Cache.keyGenerator('wakatime');
const getRouteSVGModal = (subroute: string): Function => {
  return match(subroute)
    .with("insights", () => {return wakaInsightCard})
    .with("stats", () => {return wakaStatsCard})
    .with("languages", () => {return wakaLanguagesCard})
    .run();
}

export const getUserData = async (
  req: Request,
  res: Response,
  subRoute: string
): Promise<void> => {
  const username = req.params.username!;
  const cacheKey = keyGenerator(username, subRoute);
  const refresh = typeof req.query.refresh === "string" ? req.query.refresh : null;
  
  // Try for cached data, Query API if not present
  let cacheData = await cache.getItem(cacheKey);
  if (cacheData === null || refresh) {
    const profile = await querier.getUserProfile(username);
      (async () => {
        await cache.setItem(keyGenerator(username, "insights"), profile.insights)
          .catch((err) => {
            console.error("Error setting cache:", err);
          });
        await cache.setItem(keyGenerator(username, "stats"), profile.stats)
          .catch((err) => {
            console.error("Error setting cache:", err);
          });
        await cache.setItem(keyGenerator(username, "languages"), profile.languages)
          .catch((err) => {
            console.error("Error setting cache:", err);
          });
      })();
      cacheData = profile[subRoute] as UserData;
  }
  const data = cacheData as UserData;
  
  const cardCreate = getRouteSVGModal(subRoute);
  const card: string = cardCreate(req, data);

  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200).send(card);
};

const cacheProfile = async (username: string, profile: UserProfile) => {
  await cache.setItem(keyGenerator(username, "insights"), profile.insights)
    .catch((err) => {
      console.error("Error setting cache:", err);
    });
  await cache.setItem(keyGenerator(username, "stats"), profile.stats)
    .catch((err) => {
      console.error("Error setting cache:", err);
    });
  await cache.setItem(keyGenerator(username, "languages"), profile.languages)
    .catch((err) => {
      console.error("Error setting cache:", err);
    });
}

const registrar = new PlatformDb("wakatime", "./wakatime/users.sqlite", async (username: string) => {
  try {
    const userProfile = await querier.getUserProfile(username);
    (async () => await cacheProfile(username, userProfile))();
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return;
  }
});
export const register = async (req: Request, res: Response) => {
  const username = req.params.username!;
  const newRegistration = registrar.registerUser(username);

  let userProfile: UserProfile;
  if (newRegistration || req.query.refresh === "true" ) {
  userProfile = await querier.getUserProfile(username) as UserProfile;
  (async () => {(async () => await cacheProfile(username, userProfile))();})();
  } else {
    const [insights, stats, languages] = await Promise.all([
      cache.getItem(keyGenerator(username, "insights")),
      cache.getItem(keyGenerator(username, "stats")),
      cache.getItem(keyGenerator(username, "languages")),
    ]);
    userProfile = {
      insights: insights as Insight,
      stats: stats as Stat,
      languages: languages as Lang,
    };
  }

  try {
    const insightsCard: string = getRouteSVGModal("insights")(req, userProfile.insights);
    const statsCard: string = getRouteSVGModal("stats")(req, userProfile.stats);
    // const badgesCard: string = getRouteSVGModal("badges")(req, userProfile.badges);
    const languagesCard: string = getRouteSVGModal("languages")(req, userProfile.languages);
    res.setHeader("Content-Type", "image/svg+xml");
    res.status(200).send(`<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
        ${insightsCard}
        ${statsCard}
        ${languagesCard}
      </div>`);
  } catch (err){
  }
};

export const unregister = async (req: Request, res: Response) => {
  registrar.unregisterUser(req.params.username!);

  try {
    await Promise.all([
      cache.deleteItem(keyGenerator(req.params.username!, "streak")),
      cache.deleteItem(keyGenerator(req.params.username!, "stats")),
      cache.deleteItem(keyGenerator(req.params.username!, "completion")),
      cache.deleteItem(keyGenerator(req.params.username!, "submissions")),
    ]);
  } catch (err: any){
    console.error("Error deleting cache:", err);
    res.status(500).send("Failed to delete cached user data after unregistering. Data will expire and be removed within the next 24hrs.");
  }
  res.status(200).send("User unregistered successfully.");
};
