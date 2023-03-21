import { Request, Response } from "express";
import { streakCardSetup } from "../github/cards/streak-card";

import { GraphQLError } from "../utils/constants";
import { preQery } from "../github/query";
import {  GraphQLResponse, ReadMeData, StreakResponse, STREAKTYPE } from "../github/githubTypes";
import { preFlight } from "../utils/utils";
import { THEMES, THEMETYPE } from "../utils/themes";
import { getResponseParse } from "../github/apiParser";
import { cardDirect, streakProbe } from "../github/githubUtils";


// Universal controller for all but one github route
export const getProfileStats = async (req: Request, res: Response) => {
    if (!preFlight(req, res)) {
        return;
    }
    let variables = { login: req.params.username! }
    const data = await preQery(req, res, variables)
        .then((data: GraphQLResponse | GraphQLError) => {
            if ((data as GraphQLError).error !== undefined) {
                res.status(400).send(data);
            }
            return data as GraphQLResponse;
        })

    // Get Function to parse data
    const parse = getResponseParse(req);
    const parsedData: ReadMeData = parse(data)

    // Get function to create correct card
    const createCard: Function = cardDirect(req);
    const card: string = createCard(req, parsedData);
    card;

    // Send created card as svg string
    res.status(200).send(card);
};



export const getCommitStreak = async (req: Request, res: Response) => {
    if (!preFlight(req, res)) {
        return;
    }
    const { username } = req.params;
    // Minimal query probe to get query data
    const [created, years] = await streakProbe(req, res)
        .then((result: [string, number[]] | boolean): [string | boolean, number[]] => {
            if (typeof(result) == 'boolean') {
                return [result, [0]]
            } else {
                return result;
            }
        });
    if (typeof (created) == "boolean") {
        return;
    }
    // Get Function to parse data
    const parse = getResponseParse(req);
    // Start data with defaults set
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
            THEMES[req.query.theme! as string] as THEMETYPE :
            {
                ...THEMES["black-ice"]!,
                hideBorder: false,
                borderRadius: 10,
                locale: 'en'
            } as THEMETYPE,
    }
    // starting template variables for query
    let variables = {login: username, start: "", end: ""};

    // Call data for each year
    for (let year of years) {
        // If before year is created year, set start to create data else year start
        if (year == new Date(created).getFullYear()) {
            variables.start = new Date(created).toISOString().slice(0, 19) + 'Z';
        } else {
            variables.start = `${year}-01-01T00:00:00Z`;
        }
        // If year is this year, set end to current date else end of year
        if (year == new Date().getFullYear()) {
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
    card;
    res.status(200).send(card);
};
