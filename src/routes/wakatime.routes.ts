import express, {Request, Response, NextFunction} from "express";

import {getProfileStats} from '../controllers/wakatime.controller';

export const WakaTimeRoutes = (app: express.Application) => {
    // coding/debugging, top project, top lang, top os, top editor, top machine
    app.get('/wakatime/insights/:username',
        (req: Request, res: Response, next: NextFunction) => {
            getProfileStats(req, res)
            .catch(err => {
                next(err)
            })
    });
    // Languages used wheel
    app.get('/wakatime/languages/:username',
        (req: Request, res: Response, next: NextFunction) => {
            getProfileStats(req, res)
            .catch(err => {
                next(err)
            })
    });
    // , best day, total days
    app.get('/wakatime/stats/:username',
        (req: Request, res: Response, next: NextFunction) => {
            getProfileStats(req, res)
            .catch(err => {
                next(err)
            })
    });
}