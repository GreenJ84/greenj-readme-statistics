import { Request, Response } from "express";
import { streakCardSetup } from "../github/cards/streak-card";
import { GraphQLError } from "../utils/constants";
import { preQery } from "../github/query";
import {  GraphQLResponse, StreakResponse, STREAKTYPE } from "../github/githubTypes";
import { handleProbe } from "../github/streakHandle";
import { preFlight } from "../utils/utils";
import { THEMES, THEMETYPE } from "../utils/themes";
import { getResponseParse } from "../github/apiParser";

export const getProfileStats = async (req: Request, res: Response) => {
    if (!preFlight(req, res)) {
        return;
    }
    let variables = {login: req.params.username! }
    preQery(req, res, variables);
};

export const getProfileTrophies = async (req: Request, res: Response) => {
    if (!preFlight(req, res)) {
        return;
    }
    let variables = {login: req.params.username! }
    preQery(req, res, variables);
};

export const getCommitStreak = async (req: Request, res: Response) => {
    if (!preFlight(req, res)) {
        return;
    }
    const { username } = req.params;
    // Minimal query probe to get query data
    const [created, years] = handleProbe(req, res);
    // Get Function to parse data
    const parse = getResponseParse(req);
    // staring data with defaults set
    let streak: STREAKTYPE = {
        title: req.query.title !== undefined ?
            req.query.title as string : "GreenJ84's Streak",
        total: 0,
        totalText: "Total Contributions",
        totalRange: [`${new Date(created).toISOString().slice(0,10)}`, `${new Date().toISOString().slice(0,10)}`],
        curr: 0,
        currText: "Current Streak",
        currDate: ["", ""],
        longest: 0,
        longestText: "Longest Streak",
        longestDate: ["", ""],
        theme: req.query.theme !== undefined ? 
            THEMES[req.query.theme! as string] as THEMETYPE : THEMES["black-ice"]! as THEMETYPE,
    }
    // starting template variables for query
    let variables = {login: username, start: "", end: ""};

    // Call data for each year
    for (let year of years) {
        // If before year is created year, set start to create data else year start
        if (new Date(year).getFullYear() == new Date(created).getFullYear()) {
            variables.start = new Date(created).toISOString().slice(0, 19) + 'Z';
        } else {
            variables.start = `${year}-01-01T00:00:00Z`;
        }
        // If year is this year, set end to current date else end of year
        if (new Date(year).getFullYear() == new Date().getFullYear()) {
            variables.end = new Date().toISOString().slice(0,19)+'Z'
        } else {
            variables.end = `${year}-12-31T00:00:00Z`;
        }
        // Query data for the specific yar
        const data: StreakResponse = await preQery(req, res, variables)
            .then((data: GraphQLResponse | GraphQLError) => {
                if ((data as GraphQLError).error !== undefined) {
                    res.status(400).send(data);
                }
                return data as unknown as StreakResponse;
            })
        // Parse that data with our current stats to update
        parse(streak, data)
    }
    
    const card: string = streakCardSetup(req, streak);
    console.log(card)
    res.status(200).send(card);
};

export const getTopLangs = async (req: Request, res: Response) => {
    if (!preFlight(req, res)) {
        return;
    }
    let variables = {login: req.params.username! }
    preQery(req, res, variables);
};