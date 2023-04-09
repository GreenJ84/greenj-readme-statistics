import express, { Request, Response, NextFunction } from "express";

import {leetcodeDaily, leetcodeStats} from "../controllers/leetcode.controller";

export const LeetCodeRoutes = (app: express.Application) => {
    // Stars, contribution points, reputaion, rating
    app.get('/leetcode/stats/:username',(req: Request, res: Response, next: NextFunction) => {
        leetcodeStats(req, res)
        .catch(err => {
            next(err)
        })
    });

    // Display LeetCode streak and activity
    app.get('/leetcode/streak/:username',(req: Request, res: Response, next: NextFunction) => {
        leetcodeStats(req, res)
        .catch(err => {
            next(err)
        })
    });

    // Display earned leetcode badges
    app.get('/leetcode/badges/:username',(req: Request, res: Response, next: NextFunction) => {
        leetcodeStats(req, res)
        .catch(err => {
            next(err)
        })
    });

    // Get number of questions solved in total and by level
    app.get('/leetcode/questions_solved/:username',(req: Request, res: Response, next: NextFunction) => {
        leetcodeStats(req, res)
        .catch(err => {
            next(err)
        })
    });

    // Display top 5 most recent questions solved and their languages
    app.get('/leetcode/recent-questions/:username',(req: Request, res: Response, next: NextFunction) => {
        leetcodeStats(req, res)
        .catch(err => {
            next(err)
        })
    });

    // Get a random leetcode problem title
    app.get('/leetcode/daily-question', (req: Request, res: Response, next: NextFunction) => {
        leetcodeDaily(req, res)
        .catch(err => {
            next(err)
        })
    });
}