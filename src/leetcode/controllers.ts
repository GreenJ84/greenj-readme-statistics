import { Request, Response } from "express";
import { match } from "ts-pattern";

import { cache } from "../server";
import { Cache } from "../utils/cache";
import { PlatformDb } from "../utils/database";
import { LeetCodeQuerier } from "./platformQuerier";

import { UserBadges, UserCompletion, UserProfile, UserStats, UserStreak, UserSubmissions } from "./types";

import { leetStatsCard } from "./modals/stats-card";
import { leetCompletionCard } from "./modals/completion-card";
import { leetSubmissionsCard } from "./modals/submissions-card";
import { leetStreakCard } from "./modals/streak-card";
import { ResponseError } from "../utils/utils";

const querier = new LeetCodeQuerier();
const keyGenerator = Cache.keyGenerator('leetcode')
const getRouteSVGModal = (subroute: string): Function => {
  return match(subroute)
      .with("stats", () => {return leetStatsCard})
      // .with("badges", () => {return })
      .with("completion", () => {return leetCompletionCard})
      .with("submissions", () => {return leetSubmissionsCard})
      .with("streak", () => {return leetStreakCard})
      // .with("daily", () => {return })
      .run();
}

// Todo: Implement User Badges
export const getProfileData = async (
  req: Request,
  res: Response,
  subRoute: string
) => {
  const username = req.params.username!;
  const cacheKey = keyGenerator(username, subRoute);

  let cacheData = await cache.getItem(cacheKey);
  if (cacheData === null) {
    cacheData = await querier.getUserData(subRoute)(username);
    (async () => {
      await cache.setItem(cacheKey, cacheData)
        .catch((err) => {
          console.error("Error setting cache:", err);
        });
    })();
  }

  const data = cacheData;
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
  await cache.setItem(keyGenerator(username, "badges"), userProfile.badges)
    .catch((err) => {
      console.error("Error setting cache:", err);
    });
  await cache.setItem(keyGenerator(username, "completion"), userProfile.completion)
    .catch((err) => {
      console.error("Error setting cache:", err);
    });
  await cache.setItem(keyGenerator(username, "submissions"), userProfile.submissions)
    .catch((err) => {
      console.error("Error setting cache:", err);
    });
}

const registrar = new PlatformDb("leetcode", "./leetcode/users.sqlite", async (username: string) => {
  const userProfile: UserProfile = await querier.getUserData("profile")(username) as UserProfile;
  (async () => await cacheProfile(username, userProfile));
});
export const register = async (req: Request, res: Response) => {
  const username = req.params.username!;
  const newRegistration = registrar.registerUser(username);

  let userProfile: UserProfile;
  if (newRegistration || req.query.refresh === "true" ) {
    userProfile = await querier.getUserData("profile")(username) as UserProfile;
    (async () => await cacheProfile(username, userProfile));
  } else {
    const [streak, stats, badges, completion, submissions] = await Promise.all([
      cache.getItem(keyGenerator(username, "streak")),
      cache.getItem(keyGenerator(username, "stats")),
      cache.getItem(keyGenerator(username, "badges")),
      cache.getItem(keyGenerator(username, "completion")),
      cache.getItem(keyGenerator(username, "submissions")),
    ]);
    userProfile = {
      streak: streak as UserStreak,
      stats: stats as UserStats,
      badges: badges as UserBadges,
      completion: completion as UserCompletion,
      submissions: submissions as UserSubmissions,
    };
  }

  try {
    const streakCard: string = getRouteSVGModal("streak")(req, userProfile.streak);
    const statsCard: string = getRouteSVGModal("stats")(req, userProfile.stats);
    // const badgesCard: string = getRouteSVGModal("badges")(req, userProfile.badges);
    const completionCard: string = getRouteSVGModal("completion")(req, userProfile.completion);
    const submissionsCard: string = getRouteSVGModal("submissions")(req, userProfile.submissions);
    res.setHeader("Content-Type", "image/svg+xml");
    res.status(200).send(`<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
        ${streakCard}
        ${statsCard}
        ${completionCard}
        ${submissionsCard}
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

// Todo: Implement Daily Question
export const dailyQuestion = async (
  _req: Request,
  _res: Response
): Promise<void> => {
  throw new ResponseError("Unimplemented LeetCode route", {},501);

  // const cacheKey = `leetcode:daily`;
  // const cacheData = await cache.getItem(cacheKey);
  // if (cacheData == null) {
  //   leetDailyQuestionInterval();
  //   res.status(500).json({
  //     message: "Updating Daily Question. Try again in a minute.",
  //     code: "500",
  //   });
  //   return;
  // }
  // const data = cacheData as RawDaily;
  // const card = createCard(req, parsedData);
  // res.set("Content-Type", "application/json");
  // res.status(200).send(data);
  return;
};
