import express, {Request, Response, NextFunction} from "express";

import {getCommitStreak, getProfileStats} from '../controllers/github.controller';

export const GithubRoutes = (app: express.Application) => {
    // Display github stats in trophies
    app.get('/github/trophies/:username',
        (req: Request, res: Response, next: NextFunction) => {
        getProfileStats(req, res)
        .catch(err => {
            next(err)
        })
    });
    // Display github stats in Modal
app.get('/github/stats/:username',
    (req: Request, res: Response, next: NextFunction) => {
        getProfileStats(req, res)
        .catch(err => {
            next(err)
        })
    });
    // Display most used github languages
app.get('/github/languages/:username',
    (req: Request, res: Response, next: NextFunction) => {
        getProfileStats(req, res)
        .catch(err => {
            next(err)
        })
    });
    // Display github contributions streak
app.get('/github/streak/:username',
    (req: Request, res: Response, next: NextFunction) => {
        getCommitStreak(req, res)
        .catch(err => {
            next(err)
        })
    });
}