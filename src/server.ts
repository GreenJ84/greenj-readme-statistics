/** @format */

import express from "express";
import { Cache } from "./redis";
import { corsHandler, errorHandler, securityHandler } from "./utils/middleware";
import cacheControl from "express-cache-controller";

const PORT = 8000;
export const app = express();
export const cache = new Cache()

app.use(express.static("public"));
app.use(corsHandler);
app.use(securityHandler);
app.use(cacheControl);
app.use(errorHandler);

const server = app.listen(PORT, async () => {
  console.log(`Express server running on port ${PORT}`);
  await cache.createConnection();
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
