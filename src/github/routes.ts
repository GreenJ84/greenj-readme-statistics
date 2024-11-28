/** @format */

import express, { Request, Response, NextFunction } from "express";

import { limiterAndCacheControl, preFlight } from "../utils/middleware";
import {
  getProfileData,
  register,
  unregister,
} from "./controllers";
import { setupRegistrationDatabase } from "./users_database";

export const GithubRoutes = (app: express.Application) => {
  setupRegistrationDatabase();

  app.get(
    "/github/trophies/:username",
    preFlight,
    limiterAndCacheControl,
    (req: Request, res: Response, next: NextFunction) => {
      getProfileData(req, res, "trophies").catch((err: unknown) => {
        next(err);
      });
    }
  );

  app.get(
    "/github/stats/:username",
    preFlight,
    limiterAndCacheControl,
    (req: Request, res: Response, next: NextFunction) => {
      getProfileData(req, res, "stats").catch((err: unknown) => {
        next(err);
      });
    }
  );

  app.get(
    "/github/languages/:username",
    preFlight,
    limiterAndCacheControl,
    (req: Request, res: Response, next: NextFunction) => {
      getProfileData(req, res, "languages").catch((err: unknown) => {
        next(err);
      });
    }
  );

  app.get(
    "/github/streak/:username",
    preFlight,
    limiterAndCacheControl,
    (req: Request, res: Response, next: NextFunction) => {
      getProfileData(req, res, "streak").catch((err: unknown) => {
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
