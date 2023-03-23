import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from "express-rate-limit";

import { LeetCodeRoutes } from './src/routes/leetcode.routes';
import { GithubRoutes } from './src/routes/github.routes';

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

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(req)
    // Set response headers
    res.setHeader('Content-Type', 'image/svg+xml');
    next();
});

// Rate limiting
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100
});
app.use('/', limiter);

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

LeetCodeRoutes(app)
GithubRoutes(app)

app.listen(PORT,
    () => console.log(`Server is running on port ${PORT}`)
);