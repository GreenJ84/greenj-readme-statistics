/** @format */

import express, { Request, Response, NextFunction } from "express";

import { limiterAndCacheControl, preFlight } from "../utils/middleware";
import {
  getProfileStats,
  getCommitStreak,
  register,
  unregister,
} from "./controllers";

export const GithubRoutes = (app: express.Application) => {

  // Display github stats in trophies
  app.get(
    "/github/trophies/:username",
    preFlight,
    limiterAndCacheControl,
    (req: Request, res: Response, next: NextFunction) => {
      // Allow Theme updates on Server Landing page
      getProfileStats(req, res).catch((err: unknown) => {
        next(err);
      });
    }
  );

  // Display github stats in Modal
  app.get(
    "/github/stats/:username",
    preFlight,
    limiterAndCacheControl,
    (req: Request, res: Response, next: NextFunction) => {
      // Allow Theme updates on Server Landing page
      getProfileStats(req, res).catch((err: unknown) => {
        next(err);
      });
    }
  );

  // Display most used github languages
  app.get(
    "/github/languages/:username",
    preFlight,
    limiterAndCacheControl,
    (req: Request, res: Response, next: NextFunction) => {
      getProfileStats(req, res).catch((err: unknown) => {
        next(err);
      });
    }
  );

  // Display github contributions streak
  app.get(
    "/github/streak/:username",
    preFlight,
    limiterAndCacheControl,
    (req: Request, res: Response, next: NextFunction) => {
      getCommitStreak(req, res).catch((err: unknown) => {
        next(err);
      });
    }
  );

  // Register github user in server
  app.get(
    "/github/register/:username",
    preFlight,
    (req: Request, res: Response, next: NextFunction) => {
      register(req, res).catch((err: unknown) => {
        next(err);
      });
    }
  );

  // Unregister github user in server
  app.get(
    "/github/unregister/:username",
    preFlight,
    (req: Request, res: Response, next: NextFunction) => {
      unregister(req, res).catch((err: unknown) => {
        next(err);
      });
    }
  );
};
