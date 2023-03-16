import express from "express";
import * as Github from '../controllers/github.controller';

export const GithubRoutes = (app: express.Application) => {
    // Display github stats in trophies
    app.get('/github/trophies',
        Github.getProfileTrophies
    )
    // Display github stats in Modal
    app.get('/github/stats',
        Github.getProfileStats
    )
    // Display most used github languages
    app.get('/github/languages',
        Github.getTopLangs
    )
    // Display github contributions streak
    app.get('/github/streak',
        Github.getCommitStreak
    )
}