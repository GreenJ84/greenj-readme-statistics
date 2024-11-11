/** @format */

import express, { Request, Response, NextFunction } from "express";

import {
  leetcodeDaily,
  leetcodeRegister,
  leetcodeStats,
  leetcodeStreak,
  leetcodeStreakRegister,
  leetcodeUnregister,
} from "../controllers/leetcode.controller";
import { PRODUCTION } from "../utils/constants";
import { limiter } from "../server";

export const LeetCodeRoutes = (app: express.Application) => {
  app.get(
    "/leetcode/register/:username",
    (req: Request, res: Response, next: NextFunction) => {
      leetcodeRegister(req, res).catch((err) => {
        next(err);
      });
    }
  );

  app.get(
    "/leetcode/stats/:username",
    (req: Request, res: Response, next: NextFunction) => {
      if (req.query.docsDisplay == "true") {
        res.cacheControl = { noCache: true };
      } else {
        PRODUCTION && app.use(limiter);
      }
      leetcodeStats(req, res).catch((err) => {
        next(err);
      });
    }
  );

  app.get(
    "/leetcode/badges/:username",
    (req: Request, res: Response, next: NextFunction) => {
      if (req.query.docsDisplay == "true") {
        res.cacheControl = { noCache: true };
      } else {
        PRODUCTION && app.use(limiter);
      }
      leetcodeStats(req, res).catch((err) => {
        next(err);
      });
    }
  );

  app.get(
    "/leetcode/completion/:username",
    (req: Request, res: Response, next: NextFunction) => {
      if (req.query.docsDisplay == "true") {
        res.cacheControl = { noCache: true };
      } else {
        PRODUCTION && app.use(limiter);
      }
      leetcodeStats(req, res).catch((err) => {
        next(err);
      });
    }
  );

  app.get(
    "/leetcode/submission/:username",
    (req: Request, res: Response, next: NextFunction) => {
      if (req.query.docsDisplay == "true") {
        res.cacheControl = { noCache: true };
      } else {
        PRODUCTION && app.use(limiter);
      }
      leetcodeStats(req, res).catch((err) => {
        next(err);
      });
    }
  );

  app.get(
    "/leetcode/streak/register/:username",
    (req: Request, res: Response, next: NextFunction) => {
      leetcodeStreakRegister(req, res).catch((err) => {
        next(err);
      });
    }
  );

  app.get(
    "/leetcode/streak/:username",
    (req: Request, res: Response, next: NextFunction) => {
      if (req.query.docsDisplay == "true") {
        res.cacheControl = { noCache: true };
      } else {
        PRODUCTION && app.use(limiter);
      }
      leetcodeStreak(req, res).catch((err) => {
        next(err);
      });
    }
  );

  app.get(
    "/leetcode/unregister/:username",
    (req: Request, res: Response, next: NextFunction) => {
      leetcodeUnregister(req, res).catch((err) => {
        next(err);
      });
    }
  );

  app.get(
    "/leetcode/daily",
    (req: Request, res: Response, next: NextFunction) => {
      if (req.query.docsDisplay == "true") {
        res.cacheControl = { noCache: true };
      } else {
        PRODUCTION && app.use(limiter);
      }
      leetcodeDaily(req, res).catch((err) => {
        next(err);
      });
    }
  );
};
