/** @format */

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cacheControl from "express-cache-controller";
import { spawn } from "child_process";

import { LeetCodeRoutes } from "./routes/leetcode.routes";
import { GithubRoutes } from "./routes/github.routes";
import { WakaTimeRoutes } from "./routes/wakatime.routes";
import { displayModals } from "./routes/display";

import { manageLimiter } from "./utils/blacklist";
import { ResponseError } from "./utils/constants";
import { buildRedis, teardownRedis } from "./utils/cache";

const npmProcess = spawn("npm", ["start"]);
const PORT = 8000;
const app = express();

app.use(express.json(), express.urlencoded({ extended: true }));

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
app.use(
  cacheControl({
    maxAge: 60 * 20, // Dev Cache for 20 min
  })
);

// Set svg content headers for all routes
app.use((_: Request, res: Response, next: NextFunction) => {
  // Set svg response headers as default
  res.setHeader("Content-Type", "image/svg+xml");
  next();
});

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
server.timeout = 30000;

// NPM error handling
npmProcess.stderr.on("data", (data) => {
  const errorMessage = data.toString();
  if (errorMessage.includes("npm ERR!")) {
    console.error(errorMessage);
  } else {
    console.error(`npm stderr: ${data}`);
  }
});

npmProcess.on("close", (code) => {
  if (code != 0) {
    console.log(`npm exited with code ${code}`);
  } else {
    console.log("npm successful closure");
  }
});

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