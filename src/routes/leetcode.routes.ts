import express from "express";
import * as LeetcodeController from "../controllers/leetcode.controller";

export const LeetCodeRoutes = (app: express.Application) => {
    // Stars, contribution points, reputaion, rating
    app.get('/leetcode/stats/:username',
        LeetcodeController.getProfileStats
    )
    // Display earned leetcode badges
    app.get('/leetcode/badges/:user', (req, res) => {
        res.json(`Hello ${req.params.user!}`)
    })
    // Get number of questions solved in total and by level
    app.get('/leetcode/questions_solved/:user')
    // Display top 5 most recent questions solved and their languages
    app.get('/leetcode/recent-questions/:user')
    // Get a random leetcode problem title
    app.get('/leetcode/random-question')
}