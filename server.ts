import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from "express-rate-limit";

import { LeetCodeRoutes } from './src/routes/leetcode.routes';

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

// Error handling
app.use(
    (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack);
        res.status(500).send(`Internal Server Error: ${err.stack}`);
    }
)

// Rate limiting
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100
});
app.use('/', limiter);

LeetCodeRoutes(app)

app.listen(PORT,
    () => console.log(`Server is running on port ${PORT}`)
)

export default {}