import express from "express";
import * as wakatime from '../controllers/wakatime.controller';

export const WakaTimeRoutes = (app: express.Application) => {
    // coding/debugging, top project, top lang, top os, top editor, top machine
    app.get('/wakatime/insights/:username',
        wakatime.getProfileStats
    );
    // Languages used wheel
    app.get('/wakatime/languages/:username',
        wakatime.getProfileStats
    );
    // , best day, total days
    app.get('/wakatime/stats/:username',
        wakatime.getProfileStats
    );
}