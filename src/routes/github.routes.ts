/** @format */

import express, { Request, Response, NextFunction } from "express";

import {
  getCommitStreak,
  getProfileStats,
  githubRegister,
  githubStreakRegister,
  githubUnregister,
} from "../controllers/github.controller";
import { PRODUCTION } from "../utils/constants";
import { limiter } from "../server";

export const GithubRoutes = (app: express.Application) => {
  // Register github user in server
  app.get(
    "/github/register/:username",
    (req: Request, res: Response, next: NextFunction) => {
      githubRegister(req, res).catch((err) => {
        next(err);
      });
    }
  );
  // Display github stats in trophies
  app.get(
    "/github/trophies/:username",
    (req: Request, res: Response, next: NextFunction) => {
      // Allow Theme updates on Server Landing page
      if (req.query.docsDisplay == "true") {
        res.cacheControl = { noCache: true };
      } else {
        PRODUCTION && app.use(limiter);
      }
      getProfileStats(req, res).catch((err) => {
        next(err);
      });
    }
  );
  // Display github stats in Modal
  app.get(
    "/github/stats/:username",
    (req: Request, res: Response, next: NextFunction) => {
      // Allow Theme updates on Server Landing page
      if (req.query.docsDisplay == "true") {
        res.cacheControl = { noCache: true };
      } else {
        PRODUCTION && app.use(limiter);
      }
      getProfileStats(req, res).catch((err) => {
        next(err);
      });
    }
  );
  // Display most used github languages
  app.get(
    "/github/languages/:username",
    (req: Request, res: Response, next: NextFunction) => {
      // Allow Theme updates on Server Landing page
      if (req.query.docsDisplay == "true") {
        res.cacheControl = { noCache: true };
      } else {
        PRODUCTION && app.use(limiter);
      }
      getProfileStats(req, res).catch((err) => {
        next(err);
      });
    }
  );

  // Register github user streak in server
  app.get(
    "/github/streak/register/:username",
    (req: Request, res: Response, next: NextFunction) => {
      githubStreakRegister(req, res).catch((err) => {
        next(err);
      });
    }
  );
  // Display github contributions streak
  app.get(
    "/github/streak/:username",
    (req: Request, res: Response, next: NextFunction) => {
      // Allow Theme updates on Server Landing page
      if (req.query.docsDisplay == "true") {
        res.cacheControl = { noCache: true };
      } else {
        PRODUCTION && app.use(limiter);
      }
      getCommitStreak(req, res).catch((err) => {
        next(err);
      });
    }
  );

  // Unegister github user in server
  app.get(
    "/github/unregister/:username",
    (req: Request, res: Response, next: NextFunction) => {
      githubUnregister(req, res).catch((err) => {
        next(err);
      });
    }
  );
};
