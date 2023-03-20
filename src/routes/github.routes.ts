import express from "express";
import * as Github from '../controllers/github.controller';

export const GithubRoutes = (app: express.Application) => {
    // Display github stats in trophies
    app.get('/github/trophies/:username',
        Github.getProfileStats
    )
    // Display github stats in Modal
    app.get('/github/stats/:username',
        Github.getProfileStats
    )
    // Display most used github languages
    app.get('/github/languages/:username',
        Github.getProfileStats
    )
    // Display github contributions streak
    app.get('/github/streak/:username',
        Github.getCommitStreak
    )
}