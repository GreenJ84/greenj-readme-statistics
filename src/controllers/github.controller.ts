import { Request, Response } from "express";
// import { streakCardSetup } from "../github/cards/streak-card";
import { GraphQLError } from "../utils/constants";
import { preQery } from "../github/query";
import {  ReadMeData } from "../github/githubTypes";

export const getProfileStats = async (req: Request, res: Response) => {
    preQery(req, res);
};

export const getProfileTrophies = async (req: Request, res: Response) => {
    preQery(req, res);
};

export const getCommitStreak = async (req: Request, res: Response) => {
    const data: ReadMeData | GraphQLError = await preQery(req, res)
        .then((data: ReadMeData | GraphQLError) => {
            return data;
        })
    if ((data as GraphQLError).error !== undefined) {
        res.status(400).send(data);
    }
    res.status(200).send(data);

    // const card = streakCardSetup(req);
};

export const getTopLangs = async (req: Request, res: Response) => {
    preQery(req, res);
};