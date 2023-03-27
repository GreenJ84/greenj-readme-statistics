import express from "express";
import * as wakatime from '../controllers/wakatime.controller';

export const LeetCodeRoutes = (app: express.Application) => {
    // coding/debugging, top project, top lang, top os, top editor, top machine
    app.get('/wakatime/insights/:userId',
        wakatime.getProfileStats
    );
    // Languages used wheel
    app.get('/wakatime/languages/:userId',
        wakatime.getProfileStats
    );
    // , best day, total days
    app.get('/wakatime/stats/:userId',
        wakatime.getProfileStats
    );
}