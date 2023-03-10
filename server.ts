import express from 'express';
import cors from 'cors';
import { LeetCodeRoutes } from './src/routes/leetcode.routes';

const PORT = 8000

const app = express();
app.use(
    express.json(),
    express.urlencoded({ extended: true })
);

app.use(
    cors({
        origin: '*',
        methods: 'GET'
    }),
);

LeetCodeRoutes(app)

app.listen(PORT,
    () => console.log(`Server is running on port ${PORT}`)
)

export default {}