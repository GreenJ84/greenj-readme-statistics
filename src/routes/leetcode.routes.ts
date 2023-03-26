import express from "express";
import * as LeetcodeController from "../controllers/leetcode.controller";

export const LeetCodeRoutes = (app: express.Application) => {
    // Stars, contribution points, reputaion, rating
    app.get('/leetcode/stats/:username',
        LeetcodeController.leetcodeProfile
    )
    // Display LeetCode streak and activity
    app.get('/leetcode/streak/:username',
    LeetcodeController.leetcodeStreak
    )
    // Display earned leetcode badges
    app.get('/leetcode/badges/:username',
        LeetcodeController.leetcodeProfile
    )
    // Get number of questions solved in total and by level
    app.get('/leetcode/questions_solved/:username',
        LeetcodeController.leetcodeProfile
    )
    // Display top 5 most recent questions solved and their languages
    app.get('/leetcode/recent-questions/:username',
        LeetcodeController.leetcodeProfile
    )
    // Get a random leetcode problem title
    app.get('/leetcode/daily-question',
        LeetcodeController.leetcodeStats
    )
}