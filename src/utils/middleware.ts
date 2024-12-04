import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { NextFunction, Request, Response } from "express";

import { app } from "../server";
import { sanitizeQuery } from "./sanitization";
import { ResponseError } from "./utils";
import { PRODUCTION } from "../environment";


export const corsHandler = cors({
  origin: "*",
  methods: "GET",
});

// API security
export const securityHandler = helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https://greenj-readme-stats.onrender.com"],
      },
    },
    xssFilter: true,
    noSniff: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  });

// Rate limiting the api
const rateLimitHandler = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 100,
  handler: async (req, res) => {
    res.status(400).send({
      message: `${
        req.params.username ?? "This caller"
      } has made to many calls. You have been limited.`,
    });
    return;
  },
});

export const preFlight = (req: Request, res: Response, next: NextFunction) => {
  if (req.params.username == undefined) {
    res.status(400).send({
      message: "No username found on API Call that requires username",
      error: "Missing username parameter.",
      error_code: 400,
    });
  }
  sanitizeQuery(req);
  next();
};

export const limiterAndCacheControl = (req: Request, res: Response, next: NextFunction) => {
  if (req.query.docsDisplay == "true") {
    res.cacheControl = { noCache: true };
  }
  if (PRODUCTION) {
    app.use(rateLimitHandler);
  }
  next();
}

export const notImplemented = (_req: Request, _res: Response, _next: NextFunction) => {
  throw new ResponseError(
    "Not implemented",
    "This feature is not yet available.",
    501,
  );
}

export const errorHandler = (err: unknown, _: Request, res: Response, __: NextFunction) => {
  res.set("Content-Type", "application/json");
  if (err instanceof ResponseError) {
    res.status(err.error_code).json({
      message: err.message,
      error: err.error,
    });
  } else if (err instanceof Error) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  } else {
    res.status(500).json({
      message: "An unknown error occurred",
      error: err,
    });
  }
}