/** @format */

import express, { Request, Response, NextFunction } from "express";

import {
  wakatimeProfile,
  wakatimeRegister,
  wakatimeUnregister,
} from "../controllers/wakatime.controller";

export const WakaTimeRoutes = (app: express.Application) => {
  //* WakaTime Profile Stats Data
  // Register wakatime user in server
  app.get(
    "/wakatime/register/:username",
    (req: Request, res: Response, next: NextFunction) => {
      wakatimeRegister(req, res).catch((err) => {
        next(err);
      });
    }
  );

  // Top Insights for development
  app.get(
    "/wakatime/insights/:username",
    (req: Request, res: Response, next: NextFunction) => {
      // Allow Theme updates on Server Landing page
      if (req.query.docsDisplay == "true") {
        res.cacheControl = { noCache: true };
      }
      wakatimeProfile(req, res).catch((err) => {
        next(err);
      });
    }
  );
  // Languages used wheel
  app.get(
    "/wakatime/languages/:username",
    (req: Request, res: Response, next: NextFunction) => {
      // Allow Theme updates on Server Landing page
      if (req.query.docsDisplay == "true") {
        res.cacheControl = { noCache: true };
      }
      wakatimeProfile(req, res).catch((err) => {
        next(err);
      });
    }
  );
  // , best day, total days
  app.get(
    "/wakatime/stats/:username",
    (req: Request, res: Response, next: NextFunction) => {
      // Allow Theme updates on Server Landing page
      if (req.query.docsDisplay == "true") {
        res.cacheControl = { noCache: true };
      }
      wakatimeProfile(req, res).catch((err) => {
        next(err);
      });
    }
  );

  // Un-Register wakatime user in server
  app.get(
    "/wakatime/unregister/:username",
    (req: Request, res: Response, next: NextFunction) => {
      wakatimeUnregister(req, res).catch((err) => {
        next(err);
      });
    }
  );
};
