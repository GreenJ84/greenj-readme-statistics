import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { NextFunction, Request, Response } from "express";

import { sanitizeQuery } from "./sanitization";
import { ResponseError } from "./utils";


// API Security
export const preFlight = (req: Request, res: Response): boolean => {
  if (req.params.username == undefined) {
    res.status(400).send({
      message: "No username found on API Call that requires username",
      error: "Missing username parameter.",
      error_code: 400,
    });
    return false;
  }

  sanitizeQuery(req);
  return true;
};

export const errorHandler = (err: Error, _: Request, res: Response, __: NextFunction) => {
  res.set("Content-Type", "application/json");
  if (err && err instanceof ResponseError) {
    res.status(err.error_code).json({
      message: err.message,
      error: err.error,
    });
  } else if (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
}

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
export const rateLimitHandler = rateLimit({
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