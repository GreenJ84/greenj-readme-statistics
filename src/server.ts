/** @format */

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cacheControl from "express-cache-controller";

import { LeetCodeRoutes } from "./routes/leetcode.routes";
import { GithubRoutes } from "./routes/github.routes";
import { WakaTimeRoutes } from "./routes/wakatime.routes";
import { manageLimiter } from "./utils/blacklist";
import { ResponseError } from "./utils/constants";
import { buildRedis, teardownRedis } from "./utils/cache";
import { displayModals } from "./routes/display";

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

// Set svg content headers for all routes
app.use((req: Request, res: Response, next: NextFunction) => {
  req;
  // Set svg response headers as default
  res.setHeader("Content-Type", "image/svg+xml");
  next();
});

// error handling middleware
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (err && err instanceof ResponseError) {
    res.status(err.error_code).json({
      message: err.message,
      error: err.error
    });
  } else if (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err
    });
  }
  next();
});

// Rate limiting the api
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  handler: async (req, res) => {
    const err: ResponseError = await manageLimiter(req);
    res.status(err.error_code).send(err);
  },
});
app.use("/", limiter);

// Cache api calls
app.use(
  cacheControl({
    maxAge: 60 * 20, // Dev Cache for 20 min
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
        styleSrc: ["'self'"],
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

LeetCodeRoutes(app);
GithubRoutes(app);
WakaTimeRoutes(app);
displayModals(app);

const server = app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await buildRedis();
});

// Stop the Redis server and close the Express server
const gracefulShutdown = async () => {
  server.close(() => {
    console.log("\n");
    // Disconnect from Redis server
    teardownRedis().then(() => {
      console.log('Express server closed.');
      process.exit(0);
    });
  });
};

// Handle SIGINT signal for graceful shutdown
process.on('SIGINT', gracefulShutdown);

// Handle SIGTERM signal for graceful shutdown
process.on('SIGTERM', gracefulShutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(err);
  gracefulShutdown();
});