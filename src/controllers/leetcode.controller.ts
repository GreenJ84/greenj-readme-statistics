/** @format */

import { Request, Response } from "express";
import { getDaily } from "../leetcode/daily";
import { preQuery } from '../leetcode/profile';

export const getProfileStats = async (req: Request, res: Response) => {
    preQuery(req, res);

};

export const getQuestionsAnswered = async (req: Request, res: Response) => {
    preQuery(req, res);
};

export const getBadges = async (req: Request, res: Response) => {
    preQuery(req, res);
};

export const getRecentSubmitions = async (req: Request, res: Response) => {
    preQuery(req, res);
};

export const getDailyQuestion = async (req: Request, res: Response) => {
    const { } = req.query;
    getDaily().then((data) => {
        if ("error" in data && "error_code" in data) {
            res.status(400).send(data);
        } else {
            res.status(200).send(data);
        }
    })
};

