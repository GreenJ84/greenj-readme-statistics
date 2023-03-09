import express from 'express';
import cors from 'cors';

const PORT = 8000

const app = express()
app.use(
    express.json(),
    express.urlencoded({ extended: true })
);

app.use(
    cors({
        origin: '*',
        preflightContinue: true,
        methods: 'GET'
    }),
)


app.listen(PORT,
    () => console.log(`Server is running on port ${PORT}`))