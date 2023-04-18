/** @format */

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cacheControl from "express-cache-controller";

import { LeetCodeRoutes } from "./routes/leetcode.routes";
import { GithubRoutes } from "./routes/github.routes";
import { WakaTimeRoutes } from "./routes/wakatime.routes";
import { displayModals } from "./routes/display";

import { manageLimiter } from "./utils/blacklist";
import { PRODUCTION, ResponseError } from "./utils/constants";
import { buildRedis, teardownRedis } from "./utils/cache";

const PORT = 8000;
const app = express();

// Open cross origin access
app.use(
  cors({
    origin: "*",
    methods: "GET",
  })
);

// API security
app.use(
  helmet({
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
  })
);

// Rate limiting the api
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  handler: async (req, res) => {
    const err: ResponseError = await manageLimiter(req);
    res.status(err.error_code).send(err);
    return;
  },
});
app.use(limiter);

// Cache api calls
PRODUCTION && app.use(
  cacheControl({
    maxAge: 60 * 60 * 4, // Dev Cache for 20 min
  })
);

LeetCodeRoutes(app);
GithubRoutes(app);
WakaTimeRoutes(app);
displayModals(app);

// error handling middleware
app.use((err: Error, _: Request, res: Response, __: NextFunction) => {
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
});

const server = app.listen(PORT, async () => {
  console.log(`Express server running on port ${PORT}`);
  await buildRedis();
});
server.setTimeout(60000);

let shuttingDown = false;
// Stop the Redis server and close the Express server
const gracefulShutdown = async () => {
  if (!shuttingDown) {
    shuttingDown = true;
    console.log("\n");
    console.log("Shutting Down.....");
    server.close(() => {
      // Disconnect from Redis server
      teardownRedis().then(() => {
        console.log("Express server closed.");
        process.exit(0);
      });
    });
  }
};
// Handle SIGINT signal for graceful shutdown
process.on("SIGINT", gracefulShutdown);
// Handle SIGTERM signal for graceful shutdown
process.on("SIGTERM", gracefulShutdown);
// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(`Uncaught: ${err}`);
  gracefulShutdown();
});