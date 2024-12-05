
import express, { Request, Response, NextFunction } from "express";

import { limiterAndCacheControl, notImplemented, preFlight } from "../utils/middleware";
import { dailyQuestion, getProfileData, register, unregister } from "./controllers";

export const LeetCodeRoutes = (app: express.Application) => {

  app.get(
    "/leetcode/stats/:username",
    preFlight,
    limiterAndCacheControl,
    (req: Request, res: Response, next: NextFunction) => {
      getProfileData(req, res, "stats").catch((err) => {
        next(err);
      });
    }
  );

  app.get(
    "/leetcode/badges/:username",
    notImplemented,
    preFlight,
    limiterAndCacheControl,
    (req: Request, res: Response, next: NextFunction) => {
      getProfileData(req, res, "badges").catch((err) => {
        next(err);
      });
    }
  );

  app.get(
    "/leetcode/completion/:username",
    preFlight,
    limiterAndCacheControl,
    (req: Request, res: Response, next: NextFunction) => {
      getProfileData(req, res, "completion").catch((err) => {
        next(err);
      });
    }
  );

  app.get(
    "/leetcode/submissions/:username",
    preFlight,
    limiterAndCacheControl,
    (req: Request, res: Response, next: NextFunction) => {
      getProfileData(req, res, "submissions").catch((err) => {
        next(err);
      });
    }
  );

  app.get(
    "/leetcode/streak/:username",
    preFlight,
    limiterAndCacheControl,
    (req: Request, res: Response, next: NextFunction) => {
      getProfileData(req, res, "streak").catch((err) => {
        next(err);
      });
    }
  );

  app.get(
    "/leetcode/register/:username",
    preFlight,
    (req: Request, res: Response, next: NextFunction) => {
      register(req, res).catch((err) => {
        next(err);
      });
    }
  );

  app.get(
    "/leetcode/unregister/:username",
    preFlight,
    (req: Request, res: Response, next: NextFunction) => {
    unregister(req, res).catch((err) => {
        next(err);
      });
    }
  );

  app.get(
    "/leetcode/daily",
    notImplemented,
    preFlight,
    limiterAndCacheControl,
    (req: Request, res: Response, next: NextFunction) => {
      dailyQuestion(req, res).catch((err) => {
        next(err);
      });
    }
  );
};