import express from "express";

import {leetcodeDaily, leetcodeStats} from "../controllers/leetcode.controller";

export const LeetCodeRoutes = (app: express.Application) => {
    // Stars, contribution points, reputaion, rating
    app.get('/leetcode/stats/:username',
        leetcodeStats
    )
    // Display LeetCode streak and activity
    app.get('/leetcode/streak/:username',
        leetcodeStats
    )
    // Display earned leetcode badges
    app.get('/leetcode/badges/:username',
        leetcodeStats
    )
    // Get number of questions solved in total and by level
    app.get('/leetcode/questions_solved/:username',
        leetcodeStats
    )
    // Display top 5 most recent questions solved and their languages
    app.get('/leetcode/recent-questions/:username',
        leetcodeStats
    )
    // Get a random leetcode problem title
    app.get('/leetcode/daily-question',
        leetcodeDaily
    )
}