/** @format */

import express from "express";

import { corsHandler, errorHandler, securityHandler } from "./utils/middleware";
import cacheControl from "express-cache-controller";

import { Cache } from "./utils/cache";
import { GithubRoutes } from "./github/routes";
import { LeetCodeRoutes } from "./leetcode/routes";
import { WakaTimeRoutes } from "./wakatime/routes";

const PORT = 8000;
export const app = express();
export const cache = new Cache()
cache.createConnection();

app.use(express.static("public"));
app.use(corsHandler);
app.use(securityHandler);
app.use(cacheControl({
  noCache: false,
  private: true,
}));

GithubRoutes(app);
LeetCodeRoutes(app);
WakaTimeRoutes(app);

app.use(errorHandler);

const server = app.listen(PORT, async () => {
  console.log(`Express server running on port ${PORT}`);
});

//========== SHUTDOWN PROCESSES =================================
// Stop the Redis server and close the Express server
let shuttingDown = false;
const gracefulShutdown = async () => {
  if (!shuttingDown) {
    shuttingDown = true;
    console.log("\nShutting Down.....");
    server.close(() => {
      cache.tearConnection().then(() => {
        console.log("Express server closed.");
        process.exit(0);
      })
      .catch(() => {process.exit(1);});
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
