import { Request, Response } from "express";
import { streakCardSetup } from "../github/cards/streak-card";
import { GraphQLError } from "../utils/constants";
import { preQery } from "../github/query";
import {  ReadMeData, STREAKTYPE } from "../github/githubTypes";

export const getProfileStats = async (req: Request, res: Response) => {
    preQery(req, res);
};

export const getProfileTrophies = async (req: Request, res: Response) => {
    preQery(req, res);
};

export const getCommitStreak = async (req: Request, res: Response) => {
    const data: STREAKTYPE = await preQery(req, res)
        .then((data: ReadMeData | GraphQLError) => {
            if ((data as GraphQLError).error !== undefined) {
                res.status(400).send(data);
            }
            return data as unknown as STREAKTYPE;
        })
        
    const card: string = streakCardSetup(req, data);
    console.log(card)
    res.status(200).send(card);
};

export const getTopLangs = async (req: Request, res: Response) => {
    preQery(req, res);
};