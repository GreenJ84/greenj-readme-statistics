import express from "express";

export const GithubRoutes = (app: express.Application) => {
    // Display github stats in trophies
    app.get('/github/trophies')
    // Display github stats in Modal
    app.get('/github/stats')
    // Display most used github languages
    app.get('/github/languages')
}