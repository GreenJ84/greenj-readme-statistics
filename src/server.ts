/** @format */

import express, {NextFunction, Request, Response} from "express";

import { corsHandler, errorHandler, securityHandler } from "./utils/middleware";
import cacheControl from "express-cache-controller";

import { Cache } from "./utils/cache";
import { GithubRoutes } from "./github/routes";
import { LeetCodeRoutes } from "./leetcode/routes";
import { WakaTimeRoutes } from "./wakatime/routes";
import { Themes } from "./utils/themes";

const PORT = 8000;
export const app: express.Application = express();
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

app.get('/', (_req: Request, res: Response, _next: NextFunction) => {
  res.set('Content-Type', 'text/html');
  res.sendFile('/index.html');
});

app.get('/themes', (_req: Request, res: Response, _next: NextFunction) => {
  res.set("Content-Type", "application/json");
  res.status(200).send({ themes: Object.keys(Themes) });
});

app.get('/health', (_req: Request, res: Response, _next: NextFunction) => {
  res.set("Content-Type", "application/json");
  res.status(200).send({ message: 'Server is up and running' });
});

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
