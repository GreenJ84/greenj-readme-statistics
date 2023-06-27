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

export const LeetCodeRoutes = (app: express.Application) => {
  // Register leetcode user in server
  app.get(
    "/leetcode/register/:username",
    (req: Request, res: Response, next: NextFunction) => {
      leetcodeRegister(req, res).catch((err) => {
        next(err);
      });
    }
  );
  // Stars, contribution points, reputaion, rating
  app.get(
    "/leetcode/stats/:username",
    (req: Request, res: Response, next: NextFunction) => {
      // Allow Theme updates on Server Landing page
      if (req.query.docsDisplay == "true") {
        res.cacheControl = { noCache: true };
      }
      leetcodeStats(req, res).catch((err) => {
        next(err);
      });
    }
  );
  // Display earned leetcode badges
  app.get(
    "/leetcode/badges/:username",
    (req: Request, res: Response, next: NextFunction) => {
      // Allow Theme updates on Server Landing page
      if (req.query.docsDisplay == "true") {
        res.cacheControl = { noCache: true };
      }
      leetcodeStats(req, res).catch((err) => {
        next(err);
      });
    }
  );
  // Get number of questions solved in total and by level
  app.get(
    "/leetcode/completion/:username",
    (req: Request, res: Response, next: NextFunction) => {
      // Allow Theme updates on Server Landing page
      if (req.query.docsDisplay == "true") {
        res.cacheControl = { noCache: true };
      }
      leetcodeStats(req, res).catch((err) => {
        next(err);
      });
    }
  );

  // Display top 5 most recent questions solved and their languages
  app.get(
    "/leetcode/submission/:username",
    (req: Request, res: Response, next: NextFunction) => {
      // Allow Theme updates on Server Landing page
      if (req.query.docsDisplay == "true") {
        res.cacheControl = { noCache: true };
      }
      leetcodeStats(req, res).catch((err) => {
        next(err);
      });
    }
  );

  // Register for LeetCode streak
  app.get(
    "/leetcode/streak/register/:username",
    (req: Request, res: Response, next: NextFunction) => {
      leetcodeStreakRegister(req, res).catch((err) => {
        next(err);
      });
    }
  );
  // Display LeetCode streak and activity
  app.get(
    "/leetcode/streak/:username",
    (req: Request, res: Response, next: NextFunction) => {
      // Allow Theme updates on Server Landing page
      if (req.query.docsDisplay == "true") {
        res.cacheControl = { noCache: true };
      }
      leetcodeStreak(req, res).catch((err) => {
        next(err);
      });
    }
  );

  // Unregister LeetCode user
  app.get(
    "/leetcode/unregister/:username",
    (req: Request, res: Response, next: NextFunction) => {
      leetcodeUnregister(req, res).catch((err) => {
        next(err);
      });
    }
  );

  // Get a random leetcode problem title
  app.get(
    "/leetcode/daily",
    (req: Request, res: Response, next: NextFunction) => {
      // Allow Theme updates on Server Landing page
      if (req.query.docsDisplay == "true") {
        res.cacheControl = { noCache: true };
      }
      leetcodeDaily(req, res).catch((err) => {
        next(err);
      });
    }
  );
};
