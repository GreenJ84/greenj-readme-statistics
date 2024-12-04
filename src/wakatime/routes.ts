/** @format */

import express, { Request, Response, NextFunction } from "express";
import { limiterAndCacheControl, preFlight } from "../utils/middleware";
import { getUserData, register, unregister } from "./controllers";

export const WakaTimeRoutes = (app: express.Application) => {
  app.get(
    "/wakatime/insights/:username",
    preFlight,
    limiterAndCacheControl,
    (req: Request, res: Response, next: NextFunction) => {
      getUserData(req, res, "insights").catch((err) => {
        next(err);
      });
    }
  );

  app.get(
    "/wakatime/languages/:username",
    preFlight,
    limiterAndCacheControl,
    (req: Request, res: Response, next: NextFunction) => {
      getUserData(req, res, "languages").catch((err) => {
        next(err);
      });
    }
  );

  app.get(
    "/wakatime/stats/:username",
    preFlight,
    limiterAndCacheControl,
    (req: Request, res: Response, next: NextFunction) => {
      getUserData(req, res, "stats").catch((err) => {
        next(err);
      });
    }
  );

  app.get(
    "/wakatime/register/:username",
    preFlight,
    limiterAndCacheControl,
    (req: Request, res: Response, next: NextFunction) => {
      register(req, res).catch((err) => {
        next(err);
      });
    }
  );

  app.get(
    "/wakatime/unregister/:username",
    preFlight,
    (req: Request, res: Response, next: NextFunction) => {
      unregister(req, res).catch((err) => {
        next(err);
      });
    }
  );
};
