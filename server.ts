import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from "express-rate-limit";
import cacheControl from 'express-cache-controller';

import { LeetCodeRoutes } from './src/routes/leetcode.routes';
import { GithubRoutes } from './src/routes/github.routes';
import { WakaTimeRoutes } from './src/routes/wakatime.routes';

const PORT = 8000

const app = express();
app.use(
    express.json(),
    express.urlencoded({ extended: true })
);

// Open cross origin access
app.use(
    cors({
        origin: '*',
        methods: 'GET'
    }),
);

// Set svg content headers for all routes
app.use((req: Request, res: Response, next: NextFunction) => {
    req;
    // Set response headers
    res.setHeader('Content-Type', 'image/svg+xml');
    next();
});

// Rate limiting the api
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100
});
app.use('/', limiter);

// Cache api calls
app.use(cacheControl({
    maxAge: 60 * 20, // Dev Cache for 20 min
}));

// API security
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
        }
    },
    xssFilter: true,
    noSniff: true,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
}))

LeetCodeRoutes(app);
GithubRoutes(app);
WakaTimeRoutes(app);

app.listen(PORT,
    () => console.log(`Server is running on port ${PORT}`)
);