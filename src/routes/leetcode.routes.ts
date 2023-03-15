import express from "express";
import * as LeetcodeController from "../controllers/leetcode.controller";

export const LeetCodeRoutes = (app: express.Application) => {
    // Stars, contribution points, reputaion, rating
    app.get('/leetcode/stats/:username',
        LeetcodeController.getProfileStats
    )
    // Display earned leetcode badges
    app.get('/leetcode/badges/:username',
    LeetcodeController.getBadges
)
    // Get number of questions solved in total and by level
    app.get('/leetcode/questions_solved/:username',
    LeetcodeController.getQuestionsAnswered
)
    // Display top 5 most recent questions solved and their languages
    app.get('/leetcode/recent-questions/:username',
    LeetcodeController.getRecentSubmitions
)
    // Get a random leetcode problem title
    app.get('/leetcode/daily-question', LeetcodeController.getDailyQuestion)
}